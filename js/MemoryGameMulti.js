const { useState, useEffect, useCallback, useRef, useMemo } = React;

function MemoryGameMulti({ onBack, settings, wordDatabase, dbRef, user }) {
    const [view, setView] = useState('menu'); // 'menu' | 'waiting' | 'playing'
    const [playerName, setPlayerName] = useState('');
    const [roomCodeInput, setRoomCodeInput] = useState('');
    const [roomData, setRoomData] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [lang, setLang] = useState('zh-TW');
    
    const [localPeek, setLocalPeek] = useState([]); 
    const [localCoins, setLocalCoins] = useState(0); 

    const dict = {
        'zh-TW': { 
            title: '多人連線記憶翻牌', menuDesc: '2~4 隊區網連線，支援功能卡策略大亂鬥！',
            namePlh: '輸入名字', codePlh: '4位數房號', createBtn: '創建房間', joinBtn: '加入/重連',
            waiting: '等待對手與分隊...', roomCode: '房間代碼', joinedTitle: '已加入玩家與隊伍',
            startBtn: '開始對戰！', waitHost: '等待房主開始...', leaveBtn: '離開房間',
            turn: '輪到 %team% 回合', locked: '已鎖定', frozen: '冰凍中', myTurn: '🔥 你的回合！',
            teamRed: '紅隊', teamBlue: '藍隊', teamGreen: '綠隊', teamYellow: '黃隊'
        },
        'en': { 
            title: 'Multiplayer Memory', menuDesc: '2-4 teams LAN match with power-up cards!',
            namePlh: 'Enter Name', codePlh: '4-digit Code', createBtn: 'Create Room', joinBtn: 'Join/Reconnect',
            waiting: 'Waiting for players...', roomCode: 'Room Code', joinedTitle: 'Joined Players & Teams',
            startBtn: 'Start Match!', waitHost: 'Waiting for host...', leaveBtn: 'Leave Room',
            turn: '%team%\'s turn', locked: 'Locked', frozen: 'Frozen', myTurn: '🔥 YOUR TURN!',
            teamRed: 'Red', teamBlue: 'Blue', teamGreen: 'Green', teamYellow: 'Yellow'
        }
    };
    const t = dict[lang];

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

    // 1. 監聽房間狀態
    useEffect(() => {
        if (!roomData?.id || !dbRef) return;
        const unsubscribe = dbRef.collection('rooms').doc(roomData.id).onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                setRoomData({ id: doc.id, ...data });
                if (data.status === 'playing' && view !== 'playing') setView('playing');
                if (data.status === 'finished' && view !== 'result') setView('menu'); // 簡化結束回選單
            } else {
                alert('房間已解散！');
                onBack();
            }
        });
        return () => unsubscribe();
    }, [roomData?.id, dbRef, view, onBack]);

    // 2. 收集金幣雨結算監聽
    useEffect(() => {
        if (view === 'playing' && roomData && !roomData.activeEffect && localCoins > 0) {
            dbRef.collection('rooms').doc(roomData.id).update({
                [`players.${user.uid}.score`]: firebase.firestore.FieldValue.increment(localCoins)
            }).then(() => setLocalCoins(0));
        }
    }, [roomData?.activeEffect, localCoins, view, dbRef, roomData?.id, user.uid]);

    // 3. 創建房間
    const handleCreateRoom = async () => {
        if (!playerName.trim()) return setErrorMsg('請輸入有效名字');
        if (!settings?.selectedUnits || settings.selectedUnits.length === 0) return setErrorMsg('請先回到主畫面勾選對戰的單字範圍！');
        
        setErrorMsg('');
        const newCode = Math.floor(1000 + Math.random() * 9000).toString();
        const defaultTeam = lang === 'zh-TW' ? '紅隊' : 'Red';
        const initialRoom = {
            code: newCode, status: 'waiting', createdAt: Date.now(), hostId: user.uid,
            selectedUnits: settings.selectedUnits,
            players: { [user.uid]: { name: playerName.trim(), team: defaultTeam, isHost: true, score: 0, isFrozen: false } }
        };
        try {
            const docRef = await dbRef.collection('rooms').add(initialRoom);
            setRoomData({ id: docRef.id, ...initialRoom });
            setView('waiting');
        } catch (e) { setErrorMsg('建立房間失敗'); }
    };

    // 4. 加入房間
    const handleJoinRoom = async () => {
        if (!playerName.trim()) return setErrorMsg('請輸入有效名字');
        if (roomCodeInput.length !== 4) return setErrorMsg('請輸入 4 位數房號');
        setErrorMsg('');

        try {
            const snapshot = await dbRef.collection('rooms').where('code', '==', roomCodeInput).get();
            if (snapshot.empty) return setErrorMsg('找不到該房間代碼');
            const roomDoc = snapshot.docs[0];
            const data = roomDoc.data();
            
            const defaultTeam = lang === 'zh-TW' ? '藍隊' : 'Blue';
            if (data.status === 'playing') return setErrorMsg('對戰已開始，無法加入');

            await dbRef.collection('rooms').doc(roomDoc.id).update({
                [`players.${user.uid}`]: { name: playerName.trim(), team: defaultTeam, isHost: false, score: 0, isFrozen: false }
            });
            setRoomData({ id: roomDoc.id, ...data });
            setView('waiting');
        } catch (e) { setErrorMsg('加入房間失敗'); }
    };

    // 5. 在等待室更換隊伍顏色
    const handleSelectTeam = async (teamName) => {
        if (!roomData || !user) return;
        await dbRef.collection('rooms').doc(roomData.id).update({
            [`players.${user.uid}.team`]: teamName
        });
    };

    // 6. 房主正式啟動遊戲：進行發牌與初始化
    const handleStartGame = async () => {
        if (roomData.hostId !== user.uid) return;

        const allowedUnits = roomData.selectedUnits || [];
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

    const handleLeaveRoom = async () => {
        if (roomData?.id && dbRef && user) {
            if (roomData.hostId === user.uid) await dbRef.collection('rooms').doc(roomData.id).delete();
            else await dbRef.collection('rooms').doc(roomData.id).update({ [`players.${user.uid}`]: firebase.firestore.FieldValue.delete() });
        }
        onBack();
    };

    const isMyTurn = () => {
        if (!roomData || !roomData.players?.[user.uid]) return false;
        return roomData.currentTeam === roomData.players[user.uid].team;
    };

    const myTeam = roomData?.players?.[user?.uid]?.team;

    // 7. 遊戲核心點擊判定
    const handleCardClick = async (index) => {
        if (!roomData || !roomData.board || !isMyTurn()) return;
        const roomRef = dbRef.collection('rooms').doc(roomData.id);
        let newBoard = [...roomData.board];
        const card = newBoard[index];

        if (roomData.activeEffect && roomData.activeEffect.triggerTeam === myTeam) {
            if (card.status !== 'hidden' || card.isPowerUp) return; 
            if (roomData.activeEffect.cardId === 'powerup_lock') {
                newBoard[index].lockedBy = myTeam;
                soundEngine.play('click'); 
                await roomRef.update({ board: newBoard, activeEffect: null });
            } 
            else if (roomData.activeEffect.cardId === 'powerup_peek') {
                setLocalPeek(prev => [...prev, index]);
                soundEngine.play('laser');
                if (localPeek.length === 1) {
                    setTimeout(() => { setLocalPeek([]); }, 3000); 
                    await roomRef.update({ activeEffect: null });
                }
            }
            return;
        }

        if (roomData.turnState.isAnimating || card.status === 'matched' || roomData.turnState.flippedIndices.includes(index) || roomData.activeEffect) return;
        if (card.lockedBy && card.lockedBy !== myTeam) return;

        let newTurnState = { ...roomData.turnState };

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
                let nextTeamIndex = roomData.currentTeamIndex;
                let nextComboCount = newTurnState.comboCount;

                if (isMatch) {
                    newBoard[idx1].status = 'matched';
                    newBoard[idx2].status = 'matched';
                    soundEngine.play('correct');
                    
                    const updatedPlayers = { ...roomData.players };
                    Object.keys(updatedPlayers).forEach(uid => {
                        if (updatedPlayers[uid].team === myTeam) updatedPlayers[uid].score += 10;
                    });

                    if (nextComboCount < 1) nextComboCount += 1;
                    else {
                        nextTeamIndex = (roomData.currentTeamIndex + 1) % roomData.turnOrder.length;
                        nextComboCount = 0;
                    }

                    // 檢查下一隊是否被冰凍
                    let checkNextTeam = roomData.turnOrder[nextTeamIndex];
                    let isNextFrozen = Object.values(updatedPlayers).some(p => p.team === checkNextTeam && p.isFrozen);
                    if (isNextFrozen) {
                        // 解凍並跳過
                        Object.keys(updatedPlayers).forEach(uid => {
                            if (updatedPlayers[uid].team === checkNextTeam) updatedPlayers[uid].isFrozen = false;
                        });
                        nextTeamIndex = (nextTeamIndex + 1) % roomData.turnOrder.length;
                    }

                    await roomRef.update({ board: newBoard, players: updatedPlayers, currentTeamIndex: nextTeamIndex, currentTeam: roomData.turnOrder[nextTeamIndex], turnState: { flippedIndices: [], comboCount: nextComboCount, isAnimating: false }});
                } else {
                    soundEngine.play('wrong');
                    nextTeamIndex = (roomData.currentTeamIndex + 1) % roomData.turnOrder.length;
                    
                    const updatedPlayers = { ...roomData.players };
                    let checkNextTeam = roomData.turnOrder[nextTeamIndex];
                    let isNextFrozen = Object.values(updatedPlayers).some(p => p.team === checkNextTeam && p.isFrozen);
                    if (isNextFrozen) {
                        Object.keys(updatedPlayers).forEach(uid => {
                            if (updatedPlayers[uid].team === checkNextTeam) updatedPlayers[uid].isFrozen = false;
                        });
                        nextTeamIndex = (nextTeamIndex + 1) % roomData.turnOrder.length;
                    }

                    await roomRef.update({ players: updatedPlayers, currentTeamIndex: nextTeamIndex, currentTeam: roomData.turnOrder[nextTeamIndex], turnState: { flippedIndices: [], comboCount: 0, isAnimating: false }});
                }
            }, 1200);
        }
    };

    const resolveEffect = async (targetTeam = null) => {
        if (!roomData || !roomData.activeEffect) return;
        const roomRef = dbRef.collection('rooms').doc(roomData.id);
        const effect = roomData.activeEffect;
        let updatedPlayers = { ...roomData.players };
        let newBoard = [...roomData.board];

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
            await roomRef.update({ activeEffect: { ...effect, step: 'radar_active' } });
            if (roomData.hostId === user.uid) {
                setTimeout(async () => { await roomRef.update({ activeEffect: null }); }, 3000);
            }
        }
        else if (effect.cardId === 'powerup_coin') {
            await roomRef.update({ activeEffect: { ...effect, step: 'coin_raining' } });
            if (roomData.hostId === user.uid) {
                setTimeout(async () => { await roomRef.update({ activeEffect: null }); }, 4000);
            }
        }
    };

    // --- 🎮 視窗渲染 A：主選單輸入名稱與房號 ---
    if (view === 'menu') return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900 text-white animate-[fadeIn_0.4s_ease-out]">
            <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-slate-700 text-center">
                <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-clone text-3xl"></i>
                </div>
                <h2 className="text-3xl font-black">{t.title}</h2>
                <p className="text-slate-400 text-sm mt-2 mb-6">{t.menuDesc}</p>
                <div className="space-y-4">
                    <input type="text" value={playerName} onChange={e=>setPlayerName(e.target.value)} placeholder={t.namePlh} className="w-full p-4 rounded-xl bg-slate-900 border-2 border-slate-600 text-white font-bold text-center focus:border-blue-500 outline-none" />
                    {errorMsg && <p className="text-red-400 font-bold text-sm">{errorMsg}</p>}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <button onClick={handleCreateRoom} className="p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black shadow-lg transition-transform hover:scale-105">{t.createBtn}</button>
                        <div className="flex flex-col gap-2">
                            <input type="text" maxLength="4" value={roomCodeInput} onChange={e=>setRoomCodeInput(e.target.value.replace(/\D/g, ''))} placeholder={t.codePlh} className="w-full p-3 rounded-xl bg-slate-900 border-2 border-slate-600 text-white font-black text-center tracking-widest outline-none focus:border-indigo-500" />
                            <button onClick={handleJoinRoom} className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black shadow-lg transition-transform hover:scale-105">{t.joinBtn}</button>
                        </div>
                    </div>
                    <button onClick={onBack} className="w-full mt-4 text-slate-500 hover:text-slate-300 font-bold">返回大廳</button>
                </div>
            </div>
        </div>
    );

    // --- 🎮 視窗渲染 B：多隊分色分組等待室 ---
    if (view === 'waiting') {
        const playersList = roomData?.players ? Object.values(roomData.players) : [];
        const isHost = roomData?.hostId === user?.uid;
        const availableTeams = lang === 'zh-TW' ? ['紅隊', '藍隊', '綠隊', '黃隊'] : ['Red', 'Blue', 'Green', 'Yellow'];
        
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900 text-white animate-[fadeIn_0.4s_ease-out]">
                <div className="bg-slate-800 rounded-3xl shadow-2xl p-6 max-w-lg w-full border border-slate-700 text-center">
                    <span className="text-sm font-bold text-slate-400">{t.roomCode}</span>
                    <div className="text-5xl font-black text-yellow-400 tracking-[0.2em] mb-6 bg-slate-900 py-3 rounded-xl border border-slate-700 shadow-inner">{roomData?.code}</div>
                    
                    <h3 className="text-left font-bold text-slate-400 mb-2">1. 選擇你的陣營顏色</h3>
                    <div className="grid grid-cols-4 gap-2 mb-6">
                        {availableTeams.map(team => (
                            <button key={team} onClick={() => handleSelectTeam(team)} className={`p-3 rounded-xl font-black border-2 transition-all ${myTeam === team ? teamColors[team] + ' scale-105 border-white' : 'bg-slate-900 border-slate-700 opacity-60'}`}>
                                {team}
                            </button>
                        ))}
                    </div>

                    <h3 className="text-left font-bold text-slate-400 mb-2">{t.joinedTitle} ({playersList.length}/4)</h3>
                    <div className="space-y-2 mb-6 min-h-[140px]">
                        {playersList.map((p, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-700 p-3 rounded-xl border border-slate-600">
                                <span className="font-bold text-white">{p.name}</span>
                                <span className={`px-4 py-1 rounded-full font-black text-sm shadow-md ${teamColors[p.team]}`}>{p.team}</span>
                            </div>
                        ))}
                    </div>

                    {isHost ? (
                        <button onClick={handleStartGame} disabled={playersList.length < 2} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-xl font-black text-xl shadow-lg hover:scale-105 disabled:opacity-50 transition-all">
                            {playersList.length < 2 ? '等待對手加入陣營...' : t.startBtn}
                        </button>
                    ) : (
                        <div className="w-full py-4 bg-slate-700 text-slate-400 rounded-xl font-black text-xl flex items-center justify-center gap-3"><i className="fa-solid fa-spinner fa-spin"></i> {t.waitHost}</div>
                    )}
                    <button onClick={handleLeaveRoom} className="w-full mt-4 text-slate-500 hover:text-red-400 font-bold">{t.leaveBtn}</button>
                </div>
            </div>
        );
    }

    // --- 🎮 視窗渲染 C：正式記憶翻牌遊戲戰場 (Phase 4 特效完整包) ---
    const isTargetingBoard = roomData.activeEffect && roomData.activeEffect.triggerTeam === myTeam && roomData.activeEffect.type === 'interactive_board';
    const isRadarActive = roomData.activeEffect?.cardId === 'powerup_radar' && roomData.activeEffect?.step === 'radar_active';
    const isCoinRaining = roomData.activeEffect?.cardId === 'powerup_coin' && roomData.activeEffect?.step === 'coin_raining';
    const coins = Array.from({length: 15}).map((_,i) => ({ id: i, left: Math.random()*90, delay: Math.random()*2, duration: 1.5 + Math.random()*1.5 }));

    return (
        <div className="flex-1 flex flex-col p-4 bg-slate-900 overflow-hidden select-none text-white animate-[fadeIn_0.5s_ease-out]">
            <header className="flex justify-between items-center mb-4 bg-slate-800 p-4 rounded-2xl shadow-lg border border-slate-700 shrink-0 relative z-20">
                <button onClick={handleLeaveRoom} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-bold transition-colors">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <div className="text-center flex-1">
                    <h2 className={`text-2xl font-black ${isMyTurn() ? 'text-yellow-400 animate-pulse' : 'text-slate-300'}`}>
                        {isMyTurn() ? t.myTurn : t.turn.replace('%team%', roomData.currentTeam)}
                    </h2>
                    <p className="text-sm font-bold text-slate-500">
                        {isMyTurn() && roomData.turnState.comboCount > 0 && !roomData.activeEffect ? "🌟 COMBO! 再翻一次" : ""}
                    </p>
                </div>
                <div className="text-right bg-slate-900 px-4 py-2 rounded-xl border border-slate-700">
                    <span className="text-xs text-slate-500 font-bold block">本隊分數</span>
                    <span className="text-xl font-black text-emerald-400">
                        {roomData.players[user.uid]?.score || 0}
                        {localCoins > 0 && <span className="text-yellow-400 text-sm ml-1 animate-bounce">+{localCoins}</span>}
                    </span>
                </div>
            </header>

            <main className="flex-1 min-h-0 flex items-center justify-center relative z-10">
                <div className={`w-full h-full max-h-[80vh] grid grid-cols-5 sm:grid-cols-8 gap-1.5 sm:gap-2 p-2 rounded-3xl border transition-colors ${isTargetingBoard ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-slate-950 border-slate-800'}`}>
                    {roomData.board.map((card, index) => {
                        const isPermanentlyFlipped = card.status === 'matched';
                        const isTemporarilyFlipped = roomData.turnState.flippedIndices.includes(index);
                        const isPeeked = localPeek.includes(index); 
                        const isFlipped = isPermanentlyFlipped || isTemporarilyFlipped || isPeeked;
                        const isLocked = card.lockedBy !== null;

                        const isTargetable = isTargetingBoard && !isPermanentlyFlipped && !card.isPowerUp;
                        const targetClass = isTargetable ? 'ring-2 ring-purple-400 animate-pulse cursor-crosshair' : (isTargetingBoard ? 'opacity-30' : '');
                        const showRadarText = isRadarActive && !isFlipped && !card.isPowerUp;

                        return (
                            <button
                                key={index}
                                onClick={() => handleCardClick(index)}
                                disabled={isPermanentlyFlipped || (roomData.turnState.isAnimating && !isTargetingBoard) || (!isMyTurn() && !isTargetingBoard)}
                                className={`relative w-full h-full rounded-lg sm:rounded-xl flex flex-col items-center justify-center p-1 transition-all duration-300 ${
                                    isFlipped || showRadarText
                                        ? 'bg-slate-800 border border-slate-600' 
                                        : 'bg-gradient-to-b from-blue-600 to-blue-800 hover:from-blue-500 shadow-md border border-blue-400/30'
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

                {/* --- 金幣雨圖層 --- */}
                {isCoinRaining && (
                    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden rounded-3xl">
                        {coins.map(c => (
                            <div key={c.id} 
                                className={`absolute text-yellow-400 text-4xl animate-[fall_linear_forwards] ${roomData.activeEffect.triggerTeam === myTeam ? 'pointer-events-auto cursor-pointer hover:scale-125' : 'opacity-50'}`}
                                style={{ left: `${c.left}%`, top: '-10%', animationDuration: `${c.duration}s`, animationDelay: `${c.delay}s` }}
                                onPointerDown={(e) => { 
                                    e.target.style.display='none'; 
                                    if(roomData.activeEffect.triggerTeam === myTeam) {
                                        soundEngine.play('coin');
                                        setLocalCoins(prev => prev + 2);
                                    }
                                }}
                            >
                                <i className="fa-solid fa-coin drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]"></i>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- 互動卡片發動 UI (Overlay) --- */}
                {roomData.activeEffect && roomData.activeEffect.step === 'selecting' && (
                    <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center rounded-3xl backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                        <h3 className="text-3xl font-black text-yellow-400 mb-2 drop-shadow-md">{roomData.activeEffect.triggerTeam} 翻到了 {roomData.activeEffect.cardName}！</h3>
                        
                        {roomData.activeEffect.triggerTeam === myTeam ? (
                            <div className="mt-6 flex flex-col items-center">
                                {roomData.activeEffect.type === 'auto' && (
                                    <button onClick={() => resolveEffect()} className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black rounded-full text-xl shadow-[0_0_20px_rgba(234,179,8,0.5)] animate-bounce">
                                        立即發動效果！
                                    </button>
                                )}
                                {roomData.activeEffect.type === 'interactive_board' && (
                                    <p className="text-purple-400 font-bold text-xl animate-pulse bg-purple-900/50 px-6 py-3 rounded-full border border-purple-500"><i className="fa-solid fa-hand-pointer mr-2"></i>請點擊後方盤面上的單字卡...</p>
                                )}
                                {roomData.activeEffect.type === 'interactive_team' && (
                                    <div className="flex gap-4 mt-4">
                                        {roomData.turnOrder.filter(t => t !== myTeam).map(team => (
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
