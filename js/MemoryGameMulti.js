const { useState, useEffect, useCallback, useRef, useMemo } = React;

const DEV_TEST_MODE = true; 

function MemoryGameMulti({ onBack, settings, wordDatabase, dbRef, user }) {
    const [view, setView] = useState('menu'); 
    const [playerName, setPlayerName] = useState('');
    const [roomCodeInput, setRoomCodeInput] = useState('');
    const [roomData, setRoomData] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [lang, setLang] = useState('zh-TW');
    
    // 遊戲內狀態
    const [localPeek, setLocalPeek] = useState([]); 
    const [miniGameItems, setMiniGameItems] = useState([]); 
    const [miniGameActive, setMiniGameActive] = useState(false);
    const [isExploded, setIsExploded] = useState(false);
    const [miniGameScore, setMiniGameScore] = useState(0);
    const [effectSplash, setEffectSplash] = useState(null);

    const fb = window.firebase || {};

    const teamNames = ['紅隊', '藍隊', '綠隊', '黃隊'];
    const teamColors = {
        '紅隊': 'bg-red-600 border-red-400', 
        '藍隊': 'bg-blue-600 border-blue-400',
        '綠隊': 'bg-emerald-600 border-emerald-400', 
        '黃隊': 'bg-amber-500 border-amber-400 text-black'
    };

    // Firebase 監聽
    useEffect(() => {
        if (!roomData?.id || !dbRef) return;
        const unsubscribe = dbRef.collection('rooms').doc(roomData.id).onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                setRoomData({ id: doc.id, ...data });
                
                // 自動判斷勝負邏輯
                if (data.status === 'playing' && data.board) {
                    const allMatched = data.board.every(c => c.status === 'matched');
                    if (allMatched) {
                        dbRef.collection('rooms').doc(roomData.id).update({ status: 'finished' });
                        setView('result');
                    }
                }
                
                if (data.status === 'playing' && view !== 'playing') setView('playing');
                if (data.status === 'finished') setView('result');
            } else { onBack(); }
        });
        return () => unsubscribe();
    }, [roomData?.id]);

    const playSfx = (name) => { if (window.soundEngine) window.soundEngine.play(name); };

    // --- 核心邏輯 (與前版保持一致，僅修復閃電卡與金幣雨) ---

    const handleCreateRoom = async () => {
        if (!playerName.trim()) return setErrorMsg('請輸入名字');
        const newCode = Math.floor(1000 + Math.random() * 9000).toString();
        const initialRoom = {
            code: newCode, status: 'waiting', hostId: user.uid,
            players: { [user.uid]: { name: playerName.trim(), team: teamNames[0], isHost: true, score: 0, isFrozen: false, winWinWith: null } }
        };
        const docRef = await dbRef.collection('rooms').add(initialRoom);
        setRoomData({ id: docRef.id, ...initialRoom });
        setView('waiting');
    };

    const handleJoinRoom = async () => {
        const snap = await dbRef.collection('rooms').where('code', '==', roomCodeInput).get();
        if (snap.empty) return setErrorMsg('房號錯誤');
        const roomDoc = snap.docs[0];
        const data = roomDoc.data();
        const count = Object.keys(data.players).length;
        await dbRef.collection('rooms').doc(roomDoc.id).update({
            [`players.${user.uid}`]: { name: playerName.trim(), team: teamNames[count], isHost: false, score: 0, isFrozen: false, winWinWith: null }
        });
        setRoomData({ id: roomDoc.id, ...data });
        setView('waiting');
    };

    const handleStartGame = async () => {
        let cards = [];
        const testPairs = ['A','B','C','D','E','F'];
        testPairs.forEach(p => {
            cards.push({ id: `en-${p}`, matchId: p, text: p, type: 'en', status: 'hidden', lockedBy: null });
            cards.push({ id: `zh-${p}`, matchId: p, text: p.toLowerCase(), type: 'zh', status: 'hidden', lockedBy: null });
        });
        const powerUps = [
            { id: 'p_peek', text: '偷看卡', icon: 'fa-eye', power: 'peek' },
            { id: 'p_freeze', text: '冰凍卡', icon: 'fa-snowflake', power: 'freeze' },
            { id: 'p_bonus', text: '加分卡', icon: 'fa-gem', power: 'bonus' },
            { id: 'p_coin', text: '金幣雨', icon: 'fa-coins', power: 'coin' },
            { id: 'p_lock', text: '上鎖卡', icon: 'fa-lock', power: 'lock' },
            { id: 'p_radar', text: '雷達卡', icon: 'fa-satellite-dish', power: 'radar' },
            { id: 'p_lightning', text: '閃電卡', icon: 'fa-bolt', power: 'lightning' },
            { id: 'p_winwin', text: '雙贏卡', icon: 'fa-handshake', power: 'winwin' }
        ];
        cards = [...cards, ...powerUps.map(p => ({ ...p, status: 'hidden', isPowerUp: true }))].sort(() => Math.random() - 0.5);
        const teams = [...new Set(Object.values(roomData.players).map(p => p.team))];
        await dbRef.collection('rooms').doc(roomData.id).update({
            status: 'playing', board: cards, turnOrder: teams, currentTeamIndex: 0, currentTeam: teams[0],
            turnState: { flippedIndices: [], comboCount: 0, isAnimating: false }, activeEffect: null
        });
    };

    const handleCardClick = async (index) => {
        if (!isMyTurn() || roomData.turnState.isAnimating || view !== 'playing') return;
        const roomRef = dbRef.collection('rooms').doc(roomData.id);
        const card = roomData.board[index];

        if (roomData.activeEffect?.step === 'selecting_target') {
            if (card.status !== 'hidden' || card.isPowerUp) return;
            if (roomData.activeEffect.power === 'lock') {
                const newBoard = [...roomData.board];
                newBoard[index].lockedBy = myTeam;
                await roomRef.update({ board: newBoard, activeEffect: null });
            } else if (roomData.activeEffect.power === 'peek') {
                setLocalPeek(prev => {
                    const next = [...prev, index];
                    if (next.length === 2) {
                        setTimeout(() => { setLocalPeek([]); roomRef.update({ activeEffect: null }); }, 5000);
                    }
                    return next;
                });
            }
            return;
        }

        if (card.status === 'matched' || roomData.turnState.flippedIndices.includes(index)) return;
        if (card.lockedBy && card.lockedBy !== myTeam) return;

        if (card.isPowerUp) {
            playSfx('powerup');
            setEffectSplash(card);
            const newBoard = [...roomData.board];
            newBoard[index].status = 'matched';
            await roomRef.update({ board: newBoard, activeEffect: { ...card, triggerTeam: myTeam, step: 'announcing' } });
            setTimeout(() => {
                setEffectSplash(null);
                processEffectAuto(card);
            }, 2000);
            return;
        }

        const newFlipped = [...roomData.turnState.flippedIndices, index];
        if (newFlipped.length === 1) {
            await roomRef.update({ "turnState.flippedIndices": newFlipped });
        } else {
            await roomRef.update({ "turnState.flippedIndices": newFlipped, "turnState.isAnimating": true });
            const [i1, i2] = newFlipped;
            const isMatch = roomData.board[i1].matchId === roomData.board[i2].matchId && roomData.board[i1].type !== roomData.board[i2].type;

            setTimeout(async () => {
                const snap = await roomRef.get();
                const data = snap.data();
                let { players, board, turnOrder, currentTeamIndex } = data;
                let nextCombo = isMatch ? data.turnState.comboCount + 1 : 0;

                if (isMatch) {
                    playSfx('correct');
                    board[i1].status = 'matched'; board[i2].status = 'matched';
                    addScore(players, myTeam, 10);
                } else {
                    playSfx('wrong');
                    currentTeamIndex = (currentTeamIndex + 1) % turnOrder.length;
                }

                let nextTeam = turnOrder[currentTeamIndex];
                if (Object.values(players).some(p => p.team === nextTeam && p.isFrozen)) {
                    Object.keys(players).forEach(uid => { if (players[uid].team === nextTeam) players[uid].isFrozen = false; });
                    currentTeamIndex = (currentTeamIndex + 1) % turnOrder.length;
                }

                await roomRef.update({
                    board, players, currentTeamIndex, currentTeam: turnOrder[currentTeamIndex],
                    turnState: { flippedIndices: [], comboCount: nextCombo, isAnimating: false }
                });
            }, 1200);
        }
    };

    const processEffectAuto = async (card) => {
        const roomRef = dbRef.collection('rooms').doc(roomData.id);
        if (['peek', 'lock'].includes(card.power)) {
            await roomRef.update({ "activeEffect.step": 'selecting_target' });
        } else if (['bonus', 'radar', 'lightning', 'coin'].includes(card.power)) {
            executeEffect(card.power);
        } else {
            await roomRef.update({ "activeEffect.step": 'choosing_team' });
        }
    };

    const executeEffect = async (power, targetTeam = null) => {
        const roomRef = dbRef.collection('rooms').doc(roomData.id);
        const latestSnap = await roomRef.get();
        let { players, board } = latestSnap.data();

        if (power === 'bonus') {
            addScore(players, myTeam, 30);
            await roomRef.update({ players, activeEffect: null });
        } else if (power === 'freeze') {
            Object.keys(players).forEach(uid => { if (players[uid].team === targetTeam) players[uid].isFrozen = true; });
            await roomRef.update({ players, activeEffect: null });
        } else if (power === 'winwin') {
            Object.keys(players).forEach(uid => { if (players[uid].team === myTeam) players[uid].winWinWith = targetTeam; });
            await roomRef.update({ players, activeEffect: null });
        } else if (power === 'radar') {
            await roomRef.update({ "activeEffect.step": 'radar_showing' });
            setTimeout(() => roomRef.update({ activeEffect: null }), 5000);
        } else if (power === 'lightning') {
            const flipped = latestSnap.data().turnState.flippedIndices;
            if (flipped.length === 0) {
                const hiddenPairs = board.filter(c => c.status === 'hidden' && !c.isPowerUp);
                if (hiddenPairs.length > 0) {
                    const pick = hiddenPairs[0];
                    const pairIdx = board.findIndex(c => c.matchId === pick.matchId && c.id !== pick.id);
                    const selfIdx = board.findIndex(c => c.id === pick.id);
                    board[selfIdx].status = 'matched'; board[pairIdx].status = 'matched';
                    addScore(players, myTeam, 10);
                    await roomRef.update({ board, players, activeEffect: null, "turnState.comboCount": 1 });
                }
            } else {
                const firstCard = board[flipped[0]];
                const pairIdx = board.findIndex(c => c.matchId === firstCard.matchId && c.id !== firstCard.id);
                board[flipped[0]].status = 'matched'; board[pairIdx].status = 'matched';
                addScore(players, myTeam, 10);
                await roomRef.update({ board, players, activeEffect: null, "turnState.flippedIndices": [], "turnState.isAnimating": false });
            }
        } else if (power === 'coin') {
            startCoinMiniGame();
            await roomRef.update({ "activeEffect.step": 'minigame_running' });
        }
    };

    const addScore = (players, team, points) => {
        Object.keys(players).forEach(uid => {
            if (players[uid].team === team) {
                players[uid].score += points;
                const partner = players[uid].winWinWith;
                if (partner) {
                    Object.keys(players).forEach(puid => { if (players[puid].team === partner) players[puid].score += points; });
                }
            }
        });
    };

    const startCoinMiniGame = () => {
        setMiniGameActive(true); setMiniGameScore(0); setIsExploded(false);
        const items = [];
        for (let i = 0; i < 40; i++) {
            items.push({ id: i, type: i % 4 === 0 ? 'bomb' : 'coin', left: Math.random() * 90, delay: Math.random() * 8, duration: 2.5 + Math.random() * 1.5 });
        }
        setMiniGameItems(items);
        setTimeout(() => endMiniGame(), 10000);
    };

    const endMiniGame = async () => {
        setMiniGameActive(false);
        const roomRef = dbRef.collection('rooms').doc(roomData.id);
        const snap = await roomRef.get();
        const players = snap.data().players;
        addScore(players, myTeam, miniGameScore);
        await roomRef.update({ players, activeEffect: null });
    };

    const isMyTurn = () => roomData?.currentTeam === roomData?.players?.[user?.uid]?.team;
    const myTeam = roomData?.players?.[user?.uid]?.team;

    // --- 頒獎台 UI ---
    if (view === 'result') {
        const sortedTeams = Object.values(roomData.players)
            .sort((a, b) => b.score - a.score);
        const podium = [sortedTeams[1], sortedTeams[0], sortedTeams[2]].filter(t => t); // 2, 1, 3 順序排版

        return (
            <div className="fixed inset-0 z-[300] bg-slate-950 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent animate-pulse"></div>
                <h1 className="text-4xl sm:text-6xl font-black text-yellow-400 mb-8 sm:mb-16 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] z-10 animate-bounce">
                    🏆 全校英雄榜 🏆
                </h1>

                {/* 頒獎台主體 */}
                <div className="relative flex items-end justify-center w-full max-w-4xl h-64 sm:h-80 mb-12 z-10 px-4">
                    {/* 第二名 */}
                    {podium[0] && podium[1] && (
                        <div className="flex flex-col items-center mx-2 sm:mx-6 animate-[fadeInLeft_0.8s_ease-out]">
                            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-4 border-slate-300 shadow-lg mb-2 ${teamColors[podium[0].team]}`}>
                                <span className="text-2xl font-black">2</span>
                            </div>
                            <div className="text-sm sm:text-lg font-black mb-2">{podium[0].name}</div>
                            <div className="w-24 sm:w-32 h-24 sm:h-32 bg-slate-400 rounded-t-xl flex flex-col items-center justify-center shadow-inner border-t border-slate-300">
                                <span className="text-xs font-bold text-slate-800">SILVER</span>
                                <span className="text-xl sm:text-2xl font-black text-white">{podium[0].score}</span>
                            </div>
                        </div>
                    )}

                    {/* 第一名 */}
                    {podium[1] && (
                        <div className="flex flex-col items-center mx-2 sm:mx-6 z-20 animate-[zoomIn_1s_ease-out]">
                            <i className="fa-solid fa-crown text-yellow-400 text-4xl mb-2 animate-bounce"></i>
                            <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full flex items-center justify-center border-4 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.8)] mb-2 ${teamColors[podium[1].team]}`}>
                                <span className="text-4xl font-black">1</span>
                            </div>
                            <div className="text-lg sm:text-2xl font-black mb-2">{podium[1].name}</div>
                            <div className="w-32 sm:w-40 h-40 sm:h-52 bg-yellow-600 rounded-t-xl flex flex-col items-center justify-center shadow-[0_-5px_15px_rgba(234,179,8,0.3)] border-t border-yellow-400">
                                <span className="text-sm font-bold text-yellow-900">CHAMPION</span>
                                <span className="text-3xl sm:text-4xl font-black text-white">{podium[1].score}</span>
                            </div>
                        </div>
                    )}

                    {/* 第三名 */}
                    {podium[2] && (
                        <div className="flex flex-col items-center mx-2 sm:mx-6 animate-[fadeInRight_0.8s_ease-out]">
                            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-4 border-amber-700 shadow-lg mb-2 ${teamColors[podium[2].team]}`}>
                                <span className="text-xl font-black">3</span>
                            </div>
                            <div className="text-sm sm:text-base font-black mb-2">{podium[2].name}</div>
                            <div className="w-20 sm:w-28 h-16 sm:h-20 bg-amber-800 rounded-t-xl flex flex-col items-center justify-center shadow-inner border-t border-amber-600">
                                <span className="text-[10px] font-bold text-amber-300">BRONZE</span>
                                <span className="text-lg sm:text-xl font-black text-white">{podium[2].score}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 第四名與其他 */}
                {sortedTeams.length > 3 && (
                    <div className="bg-slate-900/80 px-8 py-3 rounded-full border border-slate-700 text-slate-400 font-bold mb-8 animate-fadeUp">
                        4. {sortedTeams[3].name} - {sortedTeams[3].score} 分
                    </div>
                )}

                <button onClick={onBack} className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-xl font-black shadow-xl hover:scale-110 transition-transform active:scale-95 z-10 border-2 border-white/20">
                    <i className="fa-solid fa-house mr-2"></i> 返回大廳
                </button>
            </div>
        );
    }

    // --- 基礎介面 (Menu/Waiting/Playing) ---

    if (view === 'menu') return (
        <div className="flex-1 flex items-center justify-center bg-slate-900 p-4 text-white">
            <div className="bg-slate-800 p-8 rounded-3xl w-full max-w-md border border-slate-700 shadow-2xl">
                <h1 className="text-3xl font-black text-center mb-6">多人記憶翻牌</h1>
                <input type="text" value={playerName} onChange={e=>setPlayerName(e.target.value)} placeholder="輸入隊名" className="w-full p-4 rounded-xl bg-slate-900 border-2 border-slate-600 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={handleCreateRoom} className="bg-blue-600 p-4 rounded-xl font-bold">創建房間</button>
                    <div className="flex flex-col gap-2">
                        <input type="text" maxLength="4" value={roomCodeInput} onChange={e=>setRoomCodeInput(e.target.value)} placeholder="4位房號" className="p-2 rounded-lg bg-slate-900 border border-slate-600 text-center text-white" />
                        <button onClick={handleJoinRoom} className="bg-indigo-600 p-2 rounded-lg font-bold">加入</button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (view === 'waiting') return (
        <div className="flex-1 flex items-center justify-center bg-slate-900 p-4 text-white">
            <div className="bg-slate-800 p-8 rounded-3xl w-full max-w-md text-center border border-slate-700">
                <div className="text-sm text-slate-400">房間代碼</div>
                <div className="text-5xl font-black text-yellow-400 mb-6 tracking-widest">{roomData.code}</div>
                <div className="space-y-2 mb-8">
                    {Object.values(roomData.players).map((p, i) => (
                        <div key={i} className={`p-3 rounded-xl flex justify-between ${teamColors[p.team]}`}>
                            <span>{p.name}</span><span>{p.team}</span>
                        </div>
                    ))}
                </div>
                {roomData.hostId === user.uid ? (
                    <button onClick={handleStartGame} className="w-full bg-blue-600 py-4 rounded-xl font-black text-xl animate-pulse shadow-lg shadow-blue-600/30">開始遊戲</button>
                ) : <div className="text-slate-400 animate-pulse">等待房主開始...</div>}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 flex flex-col bg-slate-950 text-white overflow-hidden">
            <header className="h-14 sm:h-16 flex justify-between items-center bg-slate-900 px-4 border-b border-slate-800 shrink-0 z-30">
                <button onClick={onBack} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"><i className="fa-solid fa-arrow-left text-sm"></i></button>
                <div className="text-center">
                    <div className={`text-base sm:text-lg font-black ${isMyTurn() ? 'text-yellow-400 animate-pulse' : 'text-slate-400'}`}>
                        {isMyTurn() ? '🔥 你的回合' : `${roomData.currentTeam} 行動中`}
                    </div>
                </div>
                <div className="flex gap-1">
                    {Object.values(roomData.players).map((p, i) => (
                        <div key={i} className={`px-2 py-0.5 rounded text-[10px] font-bold ${teamColors[p.team]}`}>{p.score}</div>
                    ))}
                </div>
            </header>

            {/* 道具發動時的浮動提示欄 */}
            {roomData.activeEffect?.step === 'selecting_target' && isMyTurn() && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-purple-600 text-white px-6 py-2 rounded-full font-black shadow-2xl animate-bounce border-2 border-white">
                    請點擊場上任 {roomData.activeEffect.power==='peek'?'2':'1'} 張未翻開的卡片
                </div>
            )}
            
            {roomData.activeEffect?.step === 'choosing_team' && isMyTurn() && (
                <div className="absolute inset-0 z-40 bg-black/60 flex flex-col items-center justify-center p-4">
                    <h2 className="text-2xl font-black mb-4">請選擇施放目標</h2>
                    <div className="flex gap-4">
                        {roomData.turnOrder.filter(t=>t!==myTeam).map(team => (
                            <button key={team} onClick={()=>executeEffect(roomData.activeEffect.power, team)} className={`px-6 py-3 rounded-xl font-bold ${teamColors[team]}`}>對【{team}】使用</button>
                        ))}
                    </div>
                </div>
            )}

            <main className="flex-1 relative flex items-center justify-center p-2 sm:p-4 overflow-hidden">
                <div className={`grid grid-cols-5 grid-rows-4 gap-1.5 sm:gap-3 w-full h-full max-w-5xl max-h-full ${roomData.activeEffect?.step === 'selecting_target' && isMyTurn() ? 'ring-4 ring-purple-500 rounded-2xl bg-purple-900/20' : ''}`}>
                    {roomData.board.map((card, idx) => {
                        const isMatched = card.status === 'matched';
                        const isFlipped = isMatched || roomData.turnState.flippedIndices.includes(idx) || localPeek.includes(idx) || (roomData.activeEffect?.step === 'radar_showing' && !card.isPowerUp);
                        
                        return (
                            <button
                                key={idx}
                                onClick={() => handleCardClick(idx)}
                                disabled={isMatched || (roomData.turnState.isAnimating && roomData.activeEffect?.step !== 'selecting_target')}
                                className={`relative rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 border-2 overflow-hidden ${
                                    isFlipped ? 'bg-slate-800 border-slate-600' : 'bg-blue-600 border-blue-400 shadow-[0_4px_0_#1e40af]'
                                } ${isMatched ? 'opacity-20' : ''}`}
                            >
                                {isFlipped ? (
                                    <div className="text-center p-1">
                                        {card.isPowerUp ? <i className={`fa-solid ${card.icon} text-xl sm:text-3xl text-yellow-400`}></i> : <span className="text-sm sm:text-2xl font-bold break-all leading-none">{card.text}</span>}
                                    </div>
                                ) : (
                                    <i className="fa-solid fa-question text-blue-300/10 text-xl sm:text-3xl"></i>
                                )}
                                {card.lockedBy && !isFlipped && (
                                    <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center"><i className="fa-solid fa-lock text-red-500"></i></div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </main>

            {miniGameActive && (
                <div className="fixed inset-0 z-[100] bg-indigo-950/90 overflow-hidden touch-none">
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 text-4xl font-black text-yellow-400 z-[110]">得分: {miniGameScore}</div>
                    {miniGameItems.map(item => (
                        <div
                            key={item.id}
                            className="absolute text-5xl animate-[fall_linear_forwards] cursor-pointer p-4"
                            style={{ left: `${item.left}%`, top: '-10%', animationDuration: `${item.duration}s`, animationDelay: `${item.delay}s` }}
                            onPointerDown={(e) => {
                                if (isExploded) return;
                                if (item.type === 'bomb') {
                                    setIsExploded(true); playSfx('explosion');
                                    setTimeout(() => endMiniGame(), 1500);
                                } else {
                                    setMiniGameScore(s => s + 1); playSfx('coin');
                                    e.currentTarget.style.display = 'none';
                                }
                            }}
                        >
                            <i className={`fa-solid ${item.type === 'coin' ? 'fa-coins text-yellow-400' : 'fa-bomb text-red-500'} drop-shadow-lg`}></i>
                        </div>
                    ))}
                    {isExploded && (
                        <div className="absolute inset-0 bg-red-600/80 flex items-center justify-center z-[120]">
                            <i className="fa-solid fa-explosion text-9xl text-white animate-ping"></i>
                        </div>
                    )}
                </div>
            )}

            {effectSplash && (
                <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
                    <div className="text-yellow-400 text-9xl mb-4 animate-bounce"><i className={`fa-solid ${effectSplash.icon}`}></i></div>
                    <h2 className="text-5xl font-black text-white">{myTeam} 獲得</h2>
                    <h3 className="text-7xl font-black text-yellow-400 mt-2">{effectSplash.text}</h3>
                </div>
            )}

            <style>{`
                @keyframes fall {
                    0% { transform: translateY(-10vh) rotate(0deg); }
                    100% { transform: translateY(110vh) rotate(360deg); }
                }
                @keyframes zoomIn {
                    from { opacity: 0; transform: scale(0.5); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes fadeInLeft {
                    from { opacity: 0; transform: translateX(-50px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeInRight {
                    from { opacity: 0; transform: translateX(50px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
}
