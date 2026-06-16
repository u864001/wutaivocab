const { useState, useEffect, useCallback, useRef, useMemo } = React;

// 🧪 測試模式開關
const DEV_TEST_MODE = true; 

function MemoryGameMulti({ onBack, settings, wordDatabase, dbRef, user }) {
    const [view, setView] = useState('menu'); 
    const [playerName, setPlayerName] = useState('');
    const [roomCodeInput, setRoomCodeInput] = useState('');
    const [roomData, setRoomData] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [lang, setLang] = useState('zh-TW');
    
    const [localPeek, setLocalPeek] = useState([]); 
    const [localCoins, setLocalCoins] = useState(0); 

    // 防呆處理：確保 firebase 存在
    const fb = window.firebase || {};

    const dict = {
        'zh-TW': { 
            title: '多人連線記憶翻牌', menuDesc: '2~4 隊區網連線，支援功能卡策略大亂鬥！',
            namePlh: '輸入名字', codePlh: '4位數房號', createBtn: '創建房間', joinBtn: '加入/重連',
            waiting: '等待對手進房...', roomCode: '房間代碼', joinedTitle: '已加入玩家與分配隊伍',
            startBtn: '開始對戰！', waitHost: '等待房主開始...', leaveBtn: '離開房間',
            turn: '輪到 %team% 回合', locked: '已鎖定', frozen: '冰凍中', myTurn: '🔥 你的回合！',
            teamRed: '紅隊', teamBlue: '藍隊', teamGreen: '綠隊', teamYellow: '黃隊',
            rotateHint: '🔄 建議將手機或平板打橫，體驗最佳 4x5 遊戲視野！'
        },
        'en': { 
            title: 'Multiplayer Memory', menuDesc: '2-4 teams LAN match with power-up cards!',
            namePlh: 'Enter Name', codePlh: '4-digit Code', createBtn: 'Create Room', joinBtn: 'Join/Reconnect',
            waiting: 'Waiting for players...', roomCode: 'Room Code', joinedTitle: 'Joined Players & Teams',
            startBtn: 'Start Match!', waitHost: 'Waiting for host...', leaveBtn: 'Leave Room',
            turn: '%team%\'s turn', locked: 'Locked', frozen: 'Frozen', myTurn: '🔥 YOUR TURN!',
            teamRed: 'Red', teamBlue: 'Blue', teamGreen: 'Green', teamYellow: 'Yellow',
            rotateHint: '🔄 Please rotate your device to landscape for the best 4x5 view!'
        }
    };
    const t = dict[lang];

    const teamNames = lang === 'zh-TW' ? ['紅隊', '藍隊', '綠隊', '黃隊'] : ['Red', 'Blue', 'Green', 'Yellow'];
    const teamColors = {
        '紅隊': 'bg-red-600 border-red-400 text-white shadow-red-600/30',
        '藍隊': 'bg-blue-600 border-blue-400 text-white shadow-blue-600/30',
        '綠隊': 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-600/30',
        '黃隊': 'bg-amber-500 border-amber-400 text-yellow-950 shadow-amber-500/30',
        'Red': 'bg-red-600 border-red-400 text-white shadow-red-600/30',
        'Blue': 'bg-blue-600 border-blue-400 text-white shadow-blue-600/30',
        'Green': 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-600/30',
        'Yellow': 'bg-amber-500 border-amber-400 text-yellow-950 shadow-amber-500/30'
    };

    // 優化 1：使用 useMemo 固定金幣位置，避免每次 render 重新計算導致卡頓
    const memoizedCoins = useMemo(() => {
        return Array.from({length: 15}).map((_,i) => ({ 
            id: i, 
            left: Math.random()*90, 
            delay: Math.random()*2, 
            duration: 1.5 + Math.random()*1.5 
        }));
    }, [roomData?.activeEffect?.step === 'coin_raining']);

    // 安全播放音效
    const safePlaySound = (soundName) => {
        if (window.soundEngine && typeof window.soundEngine.play === 'function') {
            window.soundEngine.play(soundName);
        }
    };

    useEffect(() => {
        if (!roomData?.id || !dbRef) return;
        const unsubscribe = dbRef.collection('rooms').doc(roomData.id).onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                setRoomData({ id: doc.id, ...data });
                if (data.status === 'playing' && view !== 'playing') setView('playing');
            } else {
                alert('房間已解散！');
                onBack();
            }
        });
        return () => unsubscribe();
    }, [roomData?.id]);

    // 同步本地金幣到雲端
    useEffect(() => {
        if (view === 'playing' && roomData && !roomData.activeEffect && localCoins > 0) {
            const increment = fb.firestore.FieldValue.increment(localCoins);
            dbRef.collection('rooms').doc(roomData.id).update({
                [`players.${user.uid}.score`]: increment
            }).then(() => setLocalCoins(0));
        }
    }, [roomData?.activeEffect, localCoins]);

    const handleCreateRoom = async () => {
        if (!playerName.trim()) return setErrorMsg('請輸入有效名字');
        setErrorMsg('');
        const newCode = Math.floor(1000 + Math.random() * 9000).toString();
        const initialRoom = {
            code: newCode, status: 'waiting', createdAt: Date.now(), hostId: user.uid,
            selectedUnits: settings?.selectedUnits || [],
            players: { [user.uid]: { name: playerName.trim(), team: teamNames[0], isHost: true, score: 0, isFrozen: false } }
        };
        try {
            const docRef = await dbRef.collection('rooms').add(initialRoom);
            setRoomData({ id: docRef.id, ...initialRoom });
            setView('waiting');
        } catch (e) { setErrorMsg('建立房間失敗'); }
    };

    const handleJoinRoom = async () => {
        if (!playerName.trim()) return setErrorMsg('請輸入有效名字');
        if (roomCodeInput.length !== 4) return setErrorMsg('請輸入 4 位數房號');
        setErrorMsg('');
        try {
            const snapshot = await dbRef.collection('rooms').where('code', '==', roomCodeInput).get();
            if (snapshot.empty) return setErrorMsg('找不到該房間代碼');
            const roomDoc = snapshot.docs[0];
            const data = roomDoc.data();
            if (data.status === 'playing') return setErrorMsg('對戰已開始');
            const currentPlayersCount = Object.keys(data.players || {}).length;
            if (currentPlayersCount >= 4) return setErrorMsg('房間已滿');
            const assignedTeam = teamNames[currentPlayersCount];
            await dbRef.collection('rooms').doc(roomDoc.id).update({
                [`players.${user.uid}`]: { name: playerName.trim(), team: assignedTeam, isHost: false, score: 0, isFrozen: false }
            });
            setRoomData({ id: roomDoc.id, ...data });
            setView('waiting');
        } catch (e) { setErrorMsg('加入房間失敗'); }
    };

    const handleStartGame = async () => {
        if (roomData.hostId !== user.uid) return;
        let shuffledWords = [];
        if (DEV_TEST_MODE) {
            const testAlphabet = ['A','B','C','D','E','F'];
            shuffledWords = testAlphabet.map(letter => ({ en: letter, zh: letter.toLowerCase() }));
        } else {
            const allowedUnits = roomData.selectedUnits || [];
            let filteredWords = wordDatabase.filter(w => allowedUnits.includes(`${w.book}-${w.lesson}`));
            if (filteredWords.length === 0) filteredWords = wordDatabase;
            shuffledWords = [...filteredWords].sort(() => 0.5 - Math.random()).slice(0, 6);
        }
        
        let newBoard = [];
        shuffledWords.forEach(w => {
            const matchKey = w.en;
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
        const teams = [...new Set(Object.values(roomData.players).map(p => p.team))].sort();

        await dbRef.collection('rooms').doc(roomData.id).update({
            status: 'playing',
            board: newBoard,
            turnOrder: teams,
            currentTeamIndex: 0,
            currentTeam: teams[0],
            turnState: { flippedIndices: [], comboCount: 0, isAnimating: false },
            activeEffect: null 
        });
    };

    const handleCardClick = async (index) => {
        if (!roomData || !isMyTurn()) return;
        const roomRef = dbRef.collection('rooms').doc(roomData.id);
        const card = roomData.board[index];

        // 處理道具卡發動中
        if (roomData.activeEffect && roomData.activeEffect.triggerTeam === myTeam) {
            if (card.status !== 'hidden' || card.isPowerUp) return; 
            if (roomData.activeEffect.cardId === 'powerup_lock') {
                let updatedBoard = [...roomData.board];
                updatedBoard[index].lockedBy = myTeam;
                await roomRef.update({ board: updatedBoard, activeEffect: null });
            } 
            else if (roomData.activeEffect.cardId === 'powerup_peek') {
                setLocalPeek(prev => [...prev, index]);
                setTimeout(() => { 
                    setLocalPeek([]); 
                    roomRef.update({ activeEffect: null });
                }, 3000);
            }
            return;
        }

        if (roomData.turnState.isAnimating || card.status === 'matched' || roomData.turnState.flippedIndices.includes(index) || roomData.activeEffect) return;
        if (card.lockedBy && card.lockedBy !== myTeam) return;

        // 點擊特殊道具卡
        if (card.isPowerUp) {
            safePlaySound('powerup');
            let updatedBoard = [...roomData.board];
            updatedBoard[index].status = 'matched';
            await roomRef.update({
                board: updatedBoard,
                activeEffect: { triggerTeam: myTeam, cardId: card.id, cardName: card.text, type: card.powerType, step: 'selecting' }
            });
            return;
        }

        // 正常翻牌邏輯
        let newFlipped = [...roomData.turnState.flippedIndices, index];
        
        if (newFlipped.length === 1) {
            await roomRef.update({ "turnState.flippedIndices": newFlipped });
            return;
        }

        if (newFlipped.length === 2) {
            await roomRef.update({ "turnState.flippedIndices": newFlipped, "turnState.isAnimating": true });

            const idx1 = newFlipped[0];
            const idx2 = newFlipped[1];
            const isMatch = (roomData.board[idx1].matchId === roomData.board[idx2].matchId) && (roomData.board[idx1].type !== roomData.board[idx2].type);

            setTimeout(async () => {
                const currentRoomSnap = await roomRef.get();
                const latestData = currentRoomSnap.data();
                let updatedBoard = [...latestData.board];
                let nextTeamIndex = latestData.currentTeamIndex;
                let nextCombo = latestData.turnState.comboCount;
                let updatedPlayers = { ...latestData.players };

                if (isMatch) {
                    safePlaySound('correct');
                    updatedBoard[idx1].status = 'matched';
                    updatedBoard[idx2].status = 'matched';
                    Object.keys(updatedPlayers).forEach(uid => {
                        if (updatedPlayers[uid].team === myTeam) updatedPlayers[uid].score += 10;
                    });
                    nextCombo += 1;
                } else {
                    safePlaySound('wrong');
                    nextTeamIndex = (latestData.currentTeamIndex + 1) % latestData.turnOrder.length;
                    nextCombo = 0;
                }

                // 檢查冰凍跳過
                let nextTeam = latestData.turnOrder[nextTeamIndex];
                let isFrozen = Object.values(updatedPlayers).some(p => p.team === nextTeam && p.isFrozen);
                if (isFrozen) {
                    Object.keys(updatedPlayers).forEach(uid => {
                        if (updatedPlayers[uid].team === nextTeam) updatedPlayers[uid].isFrozen = false;
                    });
                    nextTeamIndex = (nextTeamIndex + 1) % latestData.turnOrder.length;
                }

                await roomRef.update({
                    board: updatedBoard,
                    players: updatedPlayers,
                    currentTeamIndex: nextTeamIndex,
                    currentTeam: latestData.turnOrder[nextTeamIndex],
                    turnState: { flippedIndices: [], comboCount: nextCombo, isAnimating: false }
                });
            }, 1200);
        }
    };

    const resolveEffect = async (targetTeam = null) => {
        if (!roomData || !roomData.activeEffect) return;
        const roomRef = dbRef.collection('rooms').doc(roomData.id);
        const effect = roomData.activeEffect;
        let updatedPlayers = { ...roomData.players };
        let updatedBoard = [...roomData.board];

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
            let enIdx = updatedBoard.findIndex(c => c.status === 'hidden' && c.type === 'en' && !c.isPowerUp);
            if (enIdx !== -1) {
                let zhIdx = updatedBoard.findIndex(c => c.status === 'hidden' && c.type === 'zh' && c.matchId === updatedBoard[enIdx].matchId);
                if (zhIdx !== -1) {
                    updatedBoard[enIdx].status = 'matched';
                    updatedBoard[zhIdx].status = 'matched';
                    Object.keys(updatedPlayers).forEach(uid => {
                        if (updatedPlayers[uid].team === myTeam) updatedPlayers[uid].score += 10;
                    });
                }
            }
            await roomRef.update({ board: updatedBoard, players: updatedPlayers, activeEffect: null });
        }
        else if (effect.cardId === 'powerup_radar') {
            await roomRef.update({ "activeEffect.step": 'radar_active' });
            setTimeout(() => { roomRef.update({ activeEffect: null }); }, 3000);
        }
        else if (effect.cardId === 'powerup_coin') {
            await roomRef.update({ "activeEffect.step": 'coin_raining' });
            setTimeout(() => { roomRef.update({ activeEffect: null }); }, 4000);
        }
    };

    const handleLeaveRoom = async () => {
        if (roomData?.id && dbRef && user) {
            if (roomData.hostId === user.uid) await dbRef.collection('rooms').doc(roomData.id).delete();
            else {
                const updateKey = `players.${user.uid}`;
                await dbRef.collection('rooms').doc(roomData.id).update({ [updateKey]: fb.firestore.FieldValue.delete() });
            }
        }
        onBack();
    };

    const isMyTurn = () => roomData?.currentTeam === roomData?.players?.[user?.uid]?.team;
    const myTeam = roomData?.players?.[user?.uid]?.team;

    // --- Render 部份 ---
    if (view === 'menu') return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900 text-white">
            <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-slate-700 text-center">
                <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4"><i className="fa-solid fa-clone text-3xl"></i></div>
                <h2 className="text-3xl font-black">{t.title}</h2>
                <p className="text-slate-400 text-sm mt-2 mb-6">{t.menuDesc}</p>
                <div className="space-y-4">
                    <input type="text" value={playerName} onChange={e=>setPlayerName(e.target.value)} placeholder={t.namePlh} className="w-full p-4 rounded-xl bg-slate-900 border-2 border-slate-600 text-white text-center outline-none focus:border-blue-500" />
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={handleCreateRoom} className="p-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-black">創建</button>
                        <div className="flex flex-col gap-1">
                            <input type="text" maxLength="4" value={roomCodeInput} onChange={e=>setRoomCodeInput(e.target.value.replace(/\D/g, ''))} placeholder="代碼" className="w-full p-2 rounded-lg bg-slate-900 border border-slate-600 text-center" />
                            <button onClick={handleJoinRoom} className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-black text-sm">加入</button>
                        </div>
                    </div>
                    {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
                    <button onClick={onBack} className="w-full mt-2 text-slate-500">返回大廳</button>
                </div>
            </div>
        </div>
    );

    if (view === 'waiting') {
        const playersList = roomData?.players ? Object.values(roomData.players) : [];
        const isHost = roomData?.hostId === user?.uid;
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900 text-white">
                <div className="bg-slate-800 rounded-3xl shadow-2xl p-6 max-w-lg w-full border border-slate-700 text-center">
                    <span className="text-sm font-bold text-slate-400">{t.roomCode}</span>
                    <div className="text-5xl font-black text-yellow-400 tracking-widest mb-6">{roomData?.code}</div>
                    <div className="space-y-2 mb-6 text-left">
                        {playersList.map((p, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-700 p-3 rounded-xl">
                                <span>{p.name} {p.isHost && '👑'}</span>
                                <span className={`px-4 py-1 rounded-full font-black text-sm ${teamColors[p.team]}`}>{p.team}</span>
                            </div>
                        ))}
                    </div>
                    {isHost ? (
                        <button onClick={handleStartGame} disabled={playersList.length < (DEV_TEST_MODE ? 1 : 2)} className="w-full py-4 bg-blue-600 rounded-xl font-black text-xl disabled:opacity-50">
                            {playersList.length < (DEV_TEST_MODE ? 1 : 2) ? '等待對手...' : '開始遊戲'}
                        </button>
                    ) : (
                        <div className="py-4 bg-slate-700 rounded-xl">{t.waitHost}</div>
                    )}
                    <button onClick={handleLeaveRoom} className="mt-4 text-slate-500">離開</button>
                </div>
            </div>
        );
    }

    // 遊戲主畫面邏輯
    const isRadarActive = roomData?.activeEffect?.step === 'radar_active';
    const isCoinRaining = roomData?.activeEffect?.step === 'coin_raining';

    return (
        <div className="flex-1 flex flex-col p-3 bg-slate-900 h-[100dvh] text-white">
            <header className="flex justify-between items-center mb-4 bg-slate-800 p-3 rounded-xl border border-slate-700">
                <button onClick={handleLeaveRoom} className="p-2"><i className="fa-solid fa-arrow-left"></i></button>
                <div className="text-center">
                    <h2 className={`text-xl font-black ${isMyTurn() ? 'text-yellow-400 animate-pulse' : 'text-slate-300'}`}>
                        {isMyTurn() ? '🔥 你的回合' : `輪到 ${roomData.currentTeam}`}
                    </h2>
                </div>
                <div className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-700 text-right">
                    <span className="text-xs text-slate-500 block">得分</span>
                    <span className="text-xl font-black text-emerald-400">{roomData.players[user.uid]?.score || 0}</span>
                </div>
            </header>

            <main className="flex-1 relative flex items-center justify-center max-w-5xl mx-auto w-full">
                <div className={`grid grid-cols-5 gap-2 sm:gap-3 p-3 rounded-2xl w-full h-full max-h-[75vh] ${roomData.activeEffect?.triggerTeam === myTeam && roomData.activeEffect?.type === 'interactive_board' ? 'ring-4 ring-purple-500 bg-purple-900/20' : 'bg-slate-950'}`}>
                    {roomData.board.map((card, index) => {
                        const isMatched = card.status === 'matched';
                        const isFlipped = isMatched || roomData.turnState.flippedIndices.includes(index) || localPeek.includes(index);
                        const showRadar = isRadarActive && !isFlipped && !card.isPowerUp;

                        return (
                            <button
                                key={index}
                                onClick={() => handleCardClick(index)}
                                disabled={isMatched || roomData.turnState.isAnimating}
                                className={`relative rounded-xl flex items-center justify-center transition-all duration-300 aspect-[3/4] ${isFlipped || showRadar ? 'bg-slate-800 border-slate-600' : 'bg-blue-700 border-blue-400 border-b-4 shadow-lg active:border-b-0'}`}
                            >
                                {isFlipped || showRadar ? (
                                    <div className={`text-center ${showRadar ? 'opacity-40' : ''}`}>
                                        {card.isPowerUp ? <i className={`fa-solid ${card.icon} text-2xl text-yellow-400`}></i> : <span className={`font-bold ${card.type === 'en' ? 'text-cyan-400' : 'text-white'}`}>{card.text}</span>}
                                    </div>
                                ) : (
                                    <i className="fa-solid fa-question text-blue-900/30 text-2xl"></i>
                                )}
                                {card.lockedBy && !isFlipped && <i className="fa-solid fa-lock absolute top-1 right-1 text-[10px] text-red-400"></i>}
                            </button>
                        );
                    })}
                </div>

                {isCoinRaining && (
                    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
                        {memoizedCoins.map(c => (
                            <div key={c.id} 
                                className={`absolute text-yellow-400 text-4xl animate-[fall_linear_forwards] ${roomData.activeEffect.triggerTeam === myTeam ? 'pointer-events-auto cursor-pointer' : 'opacity-20'}`}
                                style={{ left: `${c.left}%`, top: '-10%', animationDuration: `${c.duration}s`, animationDelay: `${c.delay}s` }}
                                onPointerDown={(e) => { 
                                    e.target.style.display='none'; 
                                    if(roomData.activeEffect.triggerTeam === myTeam) {
                                        safePlaySound('coin');
                                        setLocalCoins(prev => prev + 2);
                                    }
                                }}
                            ><i className="fa-solid fa-coin"></i></div>
                        ))}
                    </div>
                )}

                {roomData.activeEffect && roomData.activeEffect.step === 'selecting' && (
                    <div className="absolute inset-0 bg-black/90 z-[60] flex flex-col items-center justify-center rounded-2xl p-6 text-center">
                        <h3 className="text-2xl font-black text-yellow-400 mb-6">{roomData.activeEffect.triggerTeam} 獲得了 {roomData.activeEffect.cardName}</h3>
                        {roomData.activeEffect.triggerTeam === myTeam ? (
                            <div className="space-y-4 w-full max-w-xs">
                                {roomData.activeEffect.type === 'auto' && <button onClick={() => resolveEffect()} className="w-full py-4 bg-yellow-500 text-black font-black rounded-xl animate-bounce">啟動效果</button>}
                                {roomData.activeEffect.type === 'interactive_board' && <p className="text-purple-400 animate-pulse">請點選一張牌來執行效果...</p>}
                                {roomData.activeEffect.type === 'interactive_team' && roomData.turnOrder.filter(t => t !== myTeam).map(team => (
                                    <button key={team} onClick={() => resolveEffect(team)} className="w-full py-3 bg-slate-700 rounded-xl border border-slate-500">對 【{team}】 使用</button>
                                ))}
                            </div>
                        ) : <p className="text-slate-400">等待對手操作中...</p>}
                    </div>
                )}
            </main>
            
            <style>{`
                @keyframes fall {
                    to { transform: translateY(110vh) rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
