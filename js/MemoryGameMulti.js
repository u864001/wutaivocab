const { useState, useEffect, useCallback, useRef, useMemo } = React;

function MemoryGameMulti({ onBack, settings, wordDatabase, dbRef, user }) {
    const [gameState, setGameState] = useState(null);
    const [lang, setLang] = useState('zh-TW');
    const [localPeek, setLocalPeek] = useState([]); // 偷看卡本機狀態
    const [localCoins, setLocalCoins] = useState(0); // 金幣雨本機計分

    const dict = {
        'zh-TW': { waiting: '等待房主發牌...', turn: '輪到 %team% 回合', locked: '已鎖定', frozen: '冰凍中', myTurn: '🔥 你的回合！' },
        'en': { waiting: 'Waiting for host to deal...', turn: '%team%\'s turn', locked: 'Locked', frozen: 'Frozen', myTurn: '🔥 YOUR TURN!' }
    };
    const t = dict[lang];

    useEffect(() => {
        if (!dbRef || !settings.roomId) return;
        const unsubscribe = dbRef.collection('rooms').doc(settings.roomId).onSnapshot(doc => {
            if (doc.exists) setGameState(doc.data());
        });
        return () => unsubscribe();
    }, [dbRef, settings.roomId]);

    useEffect(() => {
        if (!gameState || !dbRef || !user) return;
        if (gameState.hostId === user.uid && !gameState.board) {
            initBoardAndSync();
        }
    }, [gameState?.hostId, gameState?.board]);

    // 💰 監聽金幣雨結束，將本機收集的金幣「一次性」寫入 Firebase (保護額度)
    useEffect(() => {
        if (gameState && !gameState.activeEffect && localCoins > 0) {
            dbRef.collection('rooms').doc(settings.roomId).update({
                [`players.${user.uid}.score`]: firebase.firestore.FieldValue.increment(localCoins)
            }).then(() => setLocalCoins(0));
        }
    }, [gameState?.activeEffect, localCoins, dbRef, settings.roomId, user.uid]);

    const initBoardAndSync = async () => {
        const allowedUnits = gameState.selectedUnits || [];
        let filteredWords = wordDatabase.filter(w => allowedUnits.includes(`${w.book}-${w.lesson}`));
        if (filteredWords.length === 0) filteredWords = wordDatabase;
        
        const shuffledWords = [...filteredWords].sort(() => 0.5 - Math.random()).slice(0, 16);
        let newBoard = [];
        
        shuffledWords.forEach(w => {
            const matchKey = w.en || w.english || "Error";
            newBoard.push({ id: `en-${matchKey}`, matchId: matchKey, text: w.en, type: 'en', status: 'hidden', lockedBy: null, isPowerUp: false });
            newBoard.push({ id: `zh-${matchKey}`, matchId: matchKey, text: w.zh, type: 'zh', status: 'hidden', lockedBy: null, isPowerUp: false });
        });

        const powerUps = [
            { id: 'powerup_bonus', text: '加分卡', icon: 'fa-gem', type: 'auto' },
            { id: 'powerup_coin', text: '金幣雨', icon: 'fa-coins', type: 'auto' },
            { id: 'powerup_radar', text: '雷達卡', icon: 'fa-satellite-dish', type: 'auto' },
            { id: 'powerup_lightning', text: '閃電卡', icon: 'fa-bolt', type: 'auto' },
            { id: 'powerup_freeze', text: '冰凍卡', icon: 'fa-snowflake', type: 'interactive_team' },
            { id: 'powerup_peek', text: '偷看卡', icon: 'fa-eye', type: 'interactive_board' },
            { id: 'powerup_lock', text: '上鎖卡', icon: 'fa-lock', type: 'interactive_board' },
            { id: 'powerup_winwin', text: '雙贏卡', icon: 'fa-handshake', type: 'interactive_team' }
        ];

        powerUps.forEach(p => {
            newBoard.push({ id: p.id, matchId: p.id, text: p.text, icon: p.icon, type: 'powerup', powerType: p.type, status: 'hidden', lockedBy: null, isPowerUp: true });
        });

        newBoard = newBoard.sort(() => 0.5 - Math.random());
        const teams = [...new Set(Object.values(gameState.players).map(p => p.team))].sort();

        await dbRef.collection('rooms').doc(settings.roomId).update({
            board: newBoard, turnOrder: teams, currentTeamIndex: 0, currentTeam: teams[0],
            turnState: { flippedIndices: [], comboCount: 0, isAnimating: false }, activeEffect: null 
        });
    };

    const isMyTurn = () => {
        if (!gameState || !gameState.players[user.uid]) return false;
        return gameState.currentTeam === gameState.players[user.uid].team;
    };

    const myTeam = gameState?.players?.[user?.uid]?.team;

    const handleCardClick = async (index) => {
        if (!gameState || !gameState.board || !isMyTurn()) return;
        const roomRef = dbRef.collection('rooms').doc(settings.roomId);
        let newBoard = [...gameState.board];
        const card = newBoard[index];

        // 🌟 處理偷看與上鎖
        if (gameState.activeEffect && gameState.activeEffect.triggerTeam === myTeam) {
            if (card.status !== 'hidden' || card.isPowerUp) return; 

            if (gameState.activeEffect.cardId === 'powerup_lock') {
                newBoard[index].lockedBy = myTeam;
                soundEngine.play('click'); 
                await roomRef.update({ board: newBoard, activeEffect: null });
            } 
            else if (gameState.activeEffect.cardId === 'powerup_peek') {
                setLocalPeek(prev => [...prev, index]);
                soundEngine.play('laser');
                if (localPeek.length === 1) {
                    setTimeout(() => { setLocalPeek([]); }, 3000); 
                    await roomRef.update({ activeEffect: null });
                }
            }
            return;
        }

        if (gameState.turnState.isAnimating || card.status === 'matched' || gameState.turnState.flippedIndices.includes(index) || gameState.activeEffect) return;
        if (card.lockedBy && card.lockedBy !== myTeam) return;

        let newTurnState = { ...gameState.turnState };

        if (card.isPowerUp) {
            newBoard[index].status = 'matched';
            soundEngine.play('powerup');
            await roomRef.update({
                board: newBoard,
                activeEffect: { triggerTeam: myTeam, cardId: card.id, cardName: card.text, type: card.powerType, step: 'selecting' }
            });
            return;
        }

        newTurnState.flippedIndices.push(index);
        
        if (newTurnState.flippedIndices.length === 1) {
            await roomRef.update({ turnState: newTurnState });
            return;
        }

        if (newTurnState.flippedIndices.length === 2) {
            newTurnState.isAnimating = true;
            await roomRef.update({ turnState: newTurnState });

            const idx1 = newTurnState.flippedIndices[0];
            const idx2 = newTurnState.flippedIndices[1];
            const isMatch = (newBoard[idx1].matchId === newBoard[idx2].matchId) && (newBoard[idx1].type !== newBoard[idx2].type);

            setTimeout(async () => {
                let nextTeamIndex = gameState.currentTeamIndex;
                let nextComboCount = newTurnState.comboCount;

                if (isMatch) {
                    newBoard[idx1].status = 'matched';
                    newBoard[idx2].status = 'matched';
                    soundEngine.play('correct');
                    
                    const updatedPlayers = { ...gameState.players };
                    Object.keys(updatedPlayers).forEach(uid => {
                        if (updatedPlayers[uid].team === myTeam) updatedPlayers[uid].score += 10;
                    });

                    if (nextComboCount < 1) nextComboCount += 1;
                    else {
                        nextTeamIndex = (gameState.currentTeamIndex + 1) % gameState.turnOrder.length;
                        nextComboCount = 0;
                    }

                    await roomRef.update({ board: newBoard, players: updatedPlayers, currentTeamIndex: nextTeamIndex, currentTeam: gameState.turnOrder[nextTeamIndex], turnState: { flippedIndices: [], comboCount: nextComboCount, isAnimating: false }});
                } else {
                    soundEngine.play('wrong');
                    nextTeamIndex = (gameState.currentTeamIndex + 1) % gameState.turnOrder.length;
                    await roomRef.update({ currentTeamIndex: nextTeamIndex, currentTeam: gameState.turnOrder[nextTeamIndex], turnState: { flippedIndices: [], comboCount: 0, isAnimating: false }});
                }
            }, 1200);
        }
    };

    // --- 🌟 處理所有卡片的最終結算與特效派發 ---
    const resolveEffect = async (targetTeam = null) => {
        if (!gameState || !gameState.activeEffect) return;
        const roomRef = dbRef.collection('rooms').doc(settings.roomId);
        const effect = gameState.activeEffect;
        let updatedPlayers = { ...gameState.players };
        let newBoard = [...gameState.board];

        if (effect.cardId === 'powerup_bonus') {
            Object.keys(updatedPlayers).forEach(uid => {
                if (updatedPlayers[uid].team === myTeam) updatedPlayers[uid].score += 30;
            });
            await roomRef.update({ players: updatedPlayers, activeEffect: null });
        } 
        else if (effect.cardId === 'powerup_freeze' && targetTeam) {
            Object.keys(updatedPlayers).forEach(uid => {
                if (updatedPlayers[uid].team === targetTeam) updatedPlayers[uid].isFrozen = true;
            });
            await roomRef.update({ players: updatedPlayers, activeEffect: null });
        }
        else if (effect.cardId === 'powerup_winwin' && targetTeam) {
            Object.keys(updatedPlayers).forEach(uid => {
                if (updatedPlayers[uid].team === myTeam || updatedPlayers[uid].team === targetTeam) updatedPlayers[uid].score += 15;
            });
            await roomRef.update({ players: updatedPlayers, activeEffect: null });
        }
        else if (effect.cardId === 'powerup_lightning') {
            // 自動尋找一對尚未翻開的牌
            let enIndex = newBoard.findIndex(c => c.status === 'hidden' && c.type === 'en' && !c.isPowerUp);
            if (enIndex !== -1) {
                let zhIndex = newBoard.findIndex(c => c.status === 'hidden' && c.type === 'zh' && c.matchId === newBoard[enIndex].matchId);
                if (zhIndex !== -1) {
                    newBoard[enIndex].status = 'matched';
                    newBoard[zhIndex].status = 'matched';
                    Object.keys(updatedPlayers).forEach(uid => {
                        if (updatedPlayers[uid].team === myTeam) updatedPlayers[uid].score += 10;
                    });
                }
            }
            await roomRef.update({ board: newBoard, players: updatedPlayers, activeEffect: null });
        }
        else if (effect.cardId === 'powerup_radar') {
            // 切換為雷達模式
            await roomRef.update({ activeEffect: { ...effect, step: 'radar_active' } });
            // 房主負責計時關閉，避免多台裝置重複執行
            if (gameState.hostId === user.uid) {
                setTimeout(async () => { await roomRef.update({ activeEffect: null }); }, 3000);
            }
        }
        else if (effect.cardId === 'powerup_coin') {
            // 切換為金幣雨模式
            await roomRef.update({ activeEffect: { ...effect, step: 'coin_raining' } });
            if (gameState.hostId === user.uid) {
                setTimeout(async () => { await roomRef.update({ activeEffect: null }); }, 4000);
            }
        }
    };

    if (!gameState || !gameState.board) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900 text-white">
                <i className="fa-solid fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i><p className="font-bold">{t.waiting}</p>
            </div>
        );
    }

    const isTargetingBoard = gameState.activeEffect && gameState.activeEffect.triggerTeam === myTeam && gameState.activeEffect.type === 'interactive_board';
    const isRadarActive = gameState.activeEffect?.cardId === 'powerup_radar' && gameState.activeEffect?.step === 'radar_active';
    const isCoinRaining = gameState.activeEffect?.cardId === 'powerup_coin' && gameState.activeEffect?.step === 'coin_raining';
    
    // 金幣雨的隨機掉落資料 (只有發動隊伍需要算)
    const coins = Array.from({length: 15}).map((_,i) => ({ id: i, left: Math.random()*90, delay: Math.random()*2, duration: 1.5 + Math.random()*1.5 }));

    return (
        <div className="flex-1 flex flex-col p-4 bg-slate-900 overflow-hidden select-none">
            <header className="flex justify-between items-center mb-4 bg-slate-800 p-4 rounded-2xl shadow-lg border border-slate-700 shrink-0 relative z-20">
                <button onClick={onBack} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-bold transition-colors">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <div className="text-center flex-1">
                    <h2 className={`text-2xl font-black ${isMyTurn() ? 'text-yellow-400 animate-pulse' : 'text-slate-300'}`}>
                        {isMyTurn() ? t.myTurn : t.turn.replace('%team%', gameState.currentTeam)}
                    </h2>
                    <p className="text-sm font-bold text-slate-500">
                        {isMyTurn() && gameState.turnState.comboCount > 0 && !gameState.activeEffect ? "🌟 COMBO! 再翻一次" : ""}
                    </p>
                </div>
                <div className="text-right bg-slate-900 px-4 py-2 rounded-xl border border-slate-700">
                    <span className="text-xs text-slate-500 font-bold block">本隊分數</span>
                    <span className="text-xl font-black text-emerald-400">
                        {gameState.players[user.uid]?.score || 0}
                        {localCoins > 0 && <span className="text-yellow-400 text-sm ml-1 animate-bounce">+{localCoins}</span>}
                    </span>
                </div>
            </header>

            <main className="flex-1 min-h-0 flex items-center justify-center relative z-10">
                <div className={`w-full h-full max-h-[80vh] grid grid-cols-5 sm:grid-cols-8 gap-1.5 sm:gap-2 p-2 rounded-3xl border transition-colors ${isTargetingBoard ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-slate-950 border-slate-800'}`}>
                    {gameState.board.map((card, index) => {
                        const isPermanentlyFlipped = card.status === 'matched';
                        const isTemporarilyFlipped = gameState.turnState.flippedIndices.includes(index);
                        const isPeeked = localPeek.includes(index); 
                        const isFlipped = isPermanentlyFlipped || isTemporarilyFlipped || isPeeked;
                        const isLocked = card.lockedBy !== null;

                        const isTargetable = isTargetingBoard && !isPermanentlyFlipped && !card.isPowerUp;
                        const targetClass = isTargetable ? 'ring-2 ring-purple-400 animate-pulse cursor-crosshair' : (isTargetingBoard ? 'opacity-30' : '');
                        
                        // 📡 雷達發動時，未翻開的牌會變為半透明字體
                        const showRadarText = isRadarActive && !isFlipped && !card.isPowerUp;

                        return (
                            <button
                                key={index}
                                onClick={() => handleCardClick(index)}
                                disabled={isPermanentlyFlipped || (gameState.turnState.isAnimating && !isTargetingBoard) || (!isMyTurn() && !isTargetingBoard)}
                                className={`relative w-full h-full rounded-lg sm:rounded-xl flex flex-col items-center justify-center p-1 transition-all duration-300 ${
                                    isFlipped || showRadarText
                                        ? 'bg-slate-800 border border-slate-600' 
                                        : 'bg-gradient-to-b from-blue-600 to-blue-800 shadow-md border border-blue-400/30'
                                } ${isPermanentlyFlipped ? 'opacity-20 pointer-events-none' : ''} ${targetClass}`}
                            >
                                {!isFlipped && !isLocked && !showRadarText && <i className="fa-solid fa-globe text-blue-300/40 text-xl sm:text-2xl"></i>}
                                {isLocked && !isFlipped && !showRadarText && <div className="text-center"><i className="fa-solid fa-lock text-slate-400 text-xl"></i><span className="block text-[8px] text-slate-500 mt-1">{card.lockedBy}</span></div>}
                                
                                {(isFlipped || showRadarText) && (
                                    card.isPowerUp ? (
                                        <div className={`text-center ${showRadarText ? 'opacity-40' : ''}`}><i className={`fa-solid ${card.icon} text-2xl sm:text-3xl text-yellow-400 mb-1`}></i><span className="block text-[9px] sm:text-xs font-black text-slate-300">{card.text}</span></div>
                                    ) : (
                                        <span className={`font-bold block break-all text-center ${showRadarText ? 'opacity-40' : ''} ${card.type === 'en' ? 'text-blue-400 font-mono text-sm sm:text-base' : 'text-slate-200 text-xs sm:text-sm'}`}>{card.text}</span>
                                    )
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* --- 💰 金幣雨圖層 (只有觸發隊伍能點擊) --- */}
                {isCoinRaining && (
                    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden rounded-3xl">
                        {coins.map(c => (
                            <div key={c.id} 
                                className={`absolute text-yellow-400 text-4xl animate-[fall_linear_forwards] ${gameState.activeEffect.triggerTeam === myTeam ? 'pointer-events-auto cursor-pointer hover:scale-125' : 'opacity-50'}`}
                                style={{ left: `${c.left}%`, top: '-10%', animationDuration: `${c.duration}s`, animationDelay: `${c.delay}s` }}
                                onPointerDown={(e) => { 
                                    e.target.style.display='none'; 
                                    if(gameState.activeEffect.triggerTeam === myTeam) {
                                        soundEngine.play('coin');
                                        setLocalCoins(prev => prev + 2); // 每顆金幣 2 分
                                    }
                                }}
                            >
                                <i className="fa-solid fa-coin drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]"></i>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- 互動卡片發動 UI (Overlay) --- */}
                {gameState.activeEffect && gameState.activeEffect.step === 'selecting' && (
                    <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center rounded-3xl backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                        <h3 className="text-3xl font-black text-yellow-400 mb-2 drop-shadow-md">{gameState.activeEffect.triggerTeam} 翻到了 {gameState.activeEffect.cardName}！</h3>
                        
                        {gameState.activeEffect.triggerTeam === myTeam ? (
                            <div className="mt-6 flex flex-col items-center">
                                {gameState.activeEffect.type === 'auto' && (
                                    <button onClick={() => resolveEffect()} className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black rounded-full text-xl shadow-[0_0_20px_rgba(234,179,8,0.5)] animate-bounce">
                                        立即發動效果！
                                    </button>
                                )}
                                {gameState.activeEffect.type === 'interactive_board' && (
                                    <p className="text-purple-400 font-bold text-xl animate-pulse bg-purple-900/50 px-6 py-3 rounded-full border border-purple-500"><i className="fa-solid fa-hand-pointer mr-2"></i>請點擊後方盤面上的單字卡...</p>
                                )}
                                {gameState.activeEffect.type === 'interactive_team' && (
                                    <div className="flex gap-4 mt-4">
                                        {gameState.turnOrder.filter(t => t !== myTeam).map(team => (
                                            <button key={team} onClick={() => resolveEffect(team)} className="px-6 py-4 bg-slate-800 hover:bg-slate-700 border-2 border-slate-500 rounded-xl font-bold text-xl transition-transform hover:scale-110">
                                                對 {team} 使用
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-slate-400 font-bold mt-6 text-xl animate-pulse"><i className="fa-solid fa-hourglass-half mr-2"></i>等待對方執行動作...</p>
                        )}
                    </div>
                )}
            </main>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes fall { to { transform: translateY(110vh) rotate(360deg); } }
            `}} />
        </div>
    );
}
