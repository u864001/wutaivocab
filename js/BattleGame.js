function BattleGame({ onBack, wordDatabase, dbRef, user, settings }) {
    const [view, setView] = useState('menu'); 
    const [playerName, setPlayerName] = useState('');
    const [roomCodeInput, setRoomCodeInput] = useState('');
    const [roomData, setRoomData] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    
    useEffect(() => {
        if (!roomData?.id || !dbRef) return;
        const unsubscribe = dbRef.collection('rooms').doc(roomData.id).onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                setRoomData({ id: doc.id, ...data });
                if (data.status === 'playing' && view !== 'playing') setView('playing');
                if (data.status === 'finished' && view !== 'result') setView('result');
                
                // ⚡ 優化：房主即時監聽「倖存者數量」，如果剩餘 1 人(含)以下，提早結束遊戲！
             if (data.status === 'playing' && data.hostId === user.uid) {
                 const players = Object.values(data.players || {});
                 const aliveCount = players.filter(p => !p.isDead).length;
                 // 多人對戰剩 1 人或全滅，或者單機測試全滅，就提早結算
                 if ((players.length > 1 && aliveCount <= 1) || (players.length === 1 && aliveCount === 0)) {
                     dbRef.collection('rooms').doc(doc.id).update({ status: 'finished' }).catch(()=>{});
                 }
             }
            } else {
                alert('房間已關閉或解散！');
                onBack();
            }
        });
        return () => unsubscribe();
    }, [roomData?.id, dbRef, view, onBack, user.uid]);

    const handleCreateRoom = async () => {
        if (!isValidName(playerName)) return setErrorMsg('請輸入 1~6 字有效暱稱');
        if (!settings?.selectedUnits || settings.selectedUnits.length === 0) return setErrorMsg('關主請先回到主畫面勾選對戰的單字範圍！');
        if (!dbRef || !user) return setErrorMsg('無法連接伺服器');
        
        setErrorMsg('');
        const newCode = Math.floor(1000 + Math.random() * 9000).toString();
        const initialRoom = {
            code: newCode, status: 'waiting', createdAt: Date.now(), hostId: user.uid,
            selectedUnits: settings.selectedUnits, 
            players: { [user.uid]: { name: playerName.trim(), isHost: true, score: 0, lives: 10, isDead: false, combo: 0, horizon: 0, attacks: 0, assaults: 0 } }
        };
        try {
            const docRef = await dbRef.collection('rooms').add(initialRoom);
            setRoomData({ id: docRef.id, ...initialRoom });
            setView('waiting');
        } catch (e) { setErrorMsg('建立房間失敗'); }
    };

    const handleJoinRoom = async () => {
        if (!isValidName(playerName)) return setErrorMsg('請輸入 1~6 字有效暱稱');
        if (roomCodeInput.length !== 4) return setErrorMsg('請輸入 4 位數房號');
        if (!dbRef || !user) return setErrorMsg('無法連接伺服器');
        setErrorMsg('');
        
        try {
            const snapshot = await dbRef.collection('rooms').where('code', '==', roomCodeInput).get();
            if (snapshot.empty) return setErrorMsg('找不到該房間代碼');
            const roomDoc = snapshot.docs[0];
            const data = roomDoc.data();
            
            const playersArr = Object.entries(data.players || {});
            const existingPlayerKey = playersArr.find(([uid, p]) => p.name === playerName.trim());
            
            if (existingPlayerKey) {
                const oldUid = existingPlayerKey[0];
                const oldStatus = existingPlayerKey[1];
                if (oldUid !== user.uid) {
                    await dbRef.collection('rooms').doc(roomDoc.id).update({
                        [`players.${oldUid}`]: firebase.firestore.FieldValue.delete(),
                        [`players.${user.uid}`]: { ...oldStatus, isDead: false } 
                    });
                }
                setRoomData({ id: roomDoc.id, ...data });
                setView(data.status === 'playing' ? 'playing' : 'waiting');
                return;
            }

            if (data.status === 'playing') return setErrorMsg('該對戰已開始，無法加入新玩家');
            if (playersArr.length >= 4) return setErrorMsg('房間已滿 (上限 4 人)');
            
            await dbRef.collection('rooms').doc(roomDoc.id).update({
                [`players.${user.uid}`]: { name: playerName.trim(), isHost: false, score: 0, lives: 10, isDead: false, combo: 0, horizon: 0, attacks: 0, assaults: 0 }
            });
            setRoomData({ id: roomDoc.id, ...data });
            setView('waiting');
        } catch (e) { setErrorMsg('加入房間失敗'); }
    };

    const handleStartGame = async () => {
        if (roomData?.hostId === user?.uid && dbRef) {
            setView('playing'); 
            await dbRef.collection('rooms').doc(roomData.id).update({ status: 'playing', startTime: Date.now() });
        }
    };

    const handleLeaveRoom = async () => {
        if (roomData?.id && dbRef && user) {
            if (roomData.hostId === user.uid) await dbRef.collection('rooms').doc(roomData.id).delete();
            else await dbRef.collection('rooms').doc(roomData.id).update({ [`players.${user.uid}`]: firebase.firestore.FieldValue.delete() });
        }
        onBack();
    };

    if (view === 'menu') return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900 animate-[fadeIn_0.5s_ease-out]">
            <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-slate-700">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><i className="fa-solid fa-fire-flame-curved text-3xl"></i></div>
                    <h2 className="text-3xl font-black text-white">區域連線對戰</h2>
                    <p className="text-slate-400 text-sm mt-2">隨開隨玩，支援斷線刷新重連</p>
                </div>
                <div className="space-y-4">
                    <input type="text" value={playerName} onChange={e=>setPlayerName(e.target.value)} placeholder="輸入名字" className="w-full p-4 rounded-xl bg-slate-900 border-2 border-slate-600 text-white font-bold text-center focus:border-red-500 outline-none" />
                    {errorMsg && <p className="text-red-400 font-bold text-sm text-center animate-bounce">{errorMsg}</p>}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <button onClick={handleCreateRoom} className="p-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black shadow-lg shadow-red-600/30 transition-transform hover:scale-105">創建房間</button>
                        <div className="flex flex-col gap-2">
                            <input type="text" maxLength="4" value={roomCodeInput} onChange={e=>setRoomCodeInput(e.target.value.replace(/\D/g, ''))} placeholder="4位數房號" className="w-full p-3 rounded-xl bg-slate-900 border-2 border-slate-600 text-white font-black text-center tracking-widest outline-none focus:border-blue-500" />
                            <button onClick={handleJoinRoom} className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black shadow-lg shadow-blue-600/30 transition-transform hover:scale-105">加入/重連</button>
                        </div>
                    </div>
                    <button onClick={onBack} className="w-full mt-4 p-3 text-slate-500 hover:text-slate-300 font-bold">返回大廳</button>
                </div>
            </div>
        </div>
    );

    if (view === 'waiting') {
        const playersList = roomData?.players ? Object.values(roomData.players) : [];
        const isHost = roomData?.hostId === user?.uid;
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900 animate-[fadeIn_0.5s_ease-out]">
                <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-slate-700 text-center">
                    <h2 className="text-2xl font-bold text-slate-300 mb-2">房間代碼</h2>
                    <div className="text-6xl font-black text-white tracking-[0.2em] mb-8 bg-slate-900 py-4 rounded-2xl border border-slate-700 shadow-inner">{roomData?.code}</div>
                    <h3 className="text-left font-bold text-slate-400 mb-3">已加入玩家 ({playersList.length}/4)</h3>
                    <div className="space-y-2 mb-8 min-h-[160px]">
                        {playersList.map((p, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-700 p-4 rounded-xl border border-slate-600">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl">{p.isHost ? '👑' : '🚀'}</div>
                                    <span className="font-bold text-lg text-white">{p.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {isHost ? (
                        <button onClick={handleStartGame} disabled={playersList.length < 2} className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl font-black text-xl shadow-lg hover:scale-105 disabled:opacity-50 transition-all">{playersList.length < 2 ? '等待對手加入...' : '開始對戰！'}</button>
                    ) : (
                        <div className="w-full py-4 bg-slate-700 text-slate-300 rounded-xl font-black text-xl flex items-center justify-center gap-3"><i className="fa-solid fa-spinner fa-spin"></i> 等待房主開始</div>
                    )}
                    <button onClick={handleLeaveRoom} className="w-full mt-4 text-slate-500 hover:text-red-400 font-bold">離開房間</button>
                </div>
            </div>
        );
    }

    if (view === 'playing') return <BattleArena roomData={roomData} dbRef={dbRef} user={user} wordDatabase={wordDatabase} />;
    
    if (view === 'result') {
     // ⚡ 依照總分排序：原本分數 + (剩餘愛心 x 10)
     const ranks = Object.values(roomData.players || {}).map(p => ({
         ...p,
         finalScore: (p.score || 0) + ((p.lives || 0) * 10)
     })).sort((a, b) => {
         if (a.isDead !== b.isDead) return a.isDead ? 1 : -1; // 活著的依然優先排上面
         return b.finalScore - a.finalScore; // 同樣生死狀態下，純比總分
     });
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900 animate-[fadeIn_0.5s_ease-out]">
                <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-slate-700 text-center">
                    <i className="fa-solid fa-trophy text-yellow-500 text-6xl mb-6"></i>
                    <h2 className="text-3xl font-black text-white mb-6">對戰結算</h2>
                    <div className="space-y-3 mb-8">
                        {ranks.map((p, i) => (
                            <div key={i} className={`flex items-center justify-between p-4 rounded-xl font-bold border ${
                                p.isDead 
                                ? 'bg-slate-800/40 text-slate-500 border-slate-700/50' // ⚡ 提早陣亡：暗色字體呈現
                                : i === 0 
                                    ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' 
                                    : 'bg-slate-700 text-white border-slate-600'
                            }`}>
                                <div className="flex gap-4">
                                    <span>#{i+1}</span>
                                    <span className={p.isDead ? 'font-normal' : ''}>{p.name} {p.isDead && <span className="text-[10px] bg-red-950/80 text-red-400 border border-red-900 px-1.5 py-0.5 rounded ml-1 font-bold inline-block">OUT</span>}</span>
                                </div>
                                <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm font-mono items-center">
                                 <span className={p.isDead ? 'text-slate-600' : 'text-red-500'} title="愛心轉換分數"><i className="fa-solid fa-heart"></i> {p.lives}x10</span>
                                 <span className={p.isDead ? 'text-slate-600' : 'text-slate-400'}>+</span>
                                 <span className={p.isDead ? 'text-slate-600' : 'text-blue-400'} title="答題分數"><i className="fa-solid fa-star"></i> {p.score}</span>
                                 <span className={p.isDead ? 'text-slate-600' : 'text-slate-400'}>=</span>
                                 <span className={p.isDead ? 'text-slate-500 font-bold' : 'text-yellow-400 font-black text-base sm:text-lg'}>{p.finalScore}</span>
                             </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={onBack} className="w-full py-4 bg-slate-600 hover:bg-slate-500 text-white rounded-xl font-black">返回大廳</button>
                </div>
            </div>
        );
    }
}

function BattleArena({ roomData, dbRef, user, wordDatabase }) {
    const [queue, setQueue] = useState([]);
    const [currentMeteor, setCurrentMeteor] = useState(null);
    const [options, setOptions] = useState([]);
    
    const [timeLeft, setTimeLeft] = useState(180);
    const [myState, setMyState] = useState(() => {
        const existing = roomData?.players?.[user.uid];
        return existing ? { ...existing } : { score: 0, lives: 10, isDead: false, combo: 0, horizon: 0, attacks: 0, assaults: 0 };
    });
    
    const [prevTotalAttacks, setPrevTotalAttacks] = useState(0);
    const [prevAssaults, setPrevAssaults] = useState({});
    const [assaultMeteors, setAssaultMeteors] = useState([]); 
    
    const meteorRef = useRef(null);
    const containerRef = useRef(null);

    // 題庫過濾
    useEffect(() => {
        const allowedUnits = roomData?.selectedUnits || [];
        let filtered = wordDatabase.filter(w => allowedUnits.includes(`${w.book}-${w.lesson}`));
        if (filtered.length === 0) filtered = wordDatabase; 
        let repeatedDb = [];
        while (repeatedDb.length < 150) repeatedDb = [...repeatedDb, ...[...filtered].sort(() => 0.5 - Math.random())];
        setQueue(repeatedDb);
    }, [wordDatabase, roomData?.selectedUnits]);

    // 地平線攻擊監聽
    useEffect(() => {
        if (!roomData?.players) return;
        let currentTotalAttacks = 0;
        Object.keys(roomData.players).forEach(uid => { if (uid !== user.uid) currentTotalAttacks += (roomData.players[uid].attacks || 0); });
        
        if (currentTotalAttacks > prevTotalAttacks && !myState.isDead) {
            setMyState(prev => ({ ...prev, horizon: Math.min(3, prev.horizon + 1) }));
            soundEngine.wrong(); 
            if(containerRef.current) {
                containerRef.current.classList.add('animate-[shake_0.5s_ease-in-out]');
                setTimeout(() => containerRef.current?.classList.remove('animate-[shake_0.5s_ease-in-out]'), 500);
            }
        }
        setPrevTotalAttacks(currentTotalAttacks);
    }, [roomData, user.uid, myState.isDead]);

    // 突襲隕石監聽
    useEffect(() => {
        if (!roomData?.players) return;
        const currentAssaults = {};
        let incomingMeteors = [];

        Object.keys(roomData.players).forEach(uid => {
            if (uid !== user.uid) {
                const p = roomData.players[uid];
                currentAssaults[uid] = p.assaults || 0;
                const prevCount = prevAssaults[uid] || 0;
                
                if (currentAssaults[uid] > prevCount && !myState.isDead) {
                    for(let i=0; i < (currentAssaults[uid] - prevCount); i++) {
                        incomingMeteors.push({
                            id: Math.random().toString(),
                            senderName: p.name,
                            clicksLeft: 3,
                            createdAt: performance.now(),
                            x: 15 + Math.random() * 65, 
                            y: 8 + Math.random() * 15   
                        });
                    }
                }
            }
        });

        if (incomingMeteors.length > 0) {
            setAssaultMeteors(prev => [...prev, ...incomingMeteors]);
            soundEngine.wrong(); 
        }
        setPrevAssaults(currentAssaults);
    }, [roomData, user.uid, myState.isDead]);

    // 突襲時限監聽
    useEffect(() => {
        if (assaultMeteors.length === 0 || myState.isDead) return;
        let animationFrameId;
        const checkAssaultTimers = (now) => {
            let missedCount = 0;
            setAssaultMeteors(prev => {
                const remaining = [];
                prev.forEach(m => {
                    if (now - m.createdAt > 5000) missedCount++; 
                    else remaining.push(m);
                });
                return remaining;
            });
            if (missedCount > 0) {
                for(let i=0; i<missedCount; i++) handleAssaultMiss();
            } else {
                animationFrameId = requestAnimationFrame(checkAssaultTimers);
            }
        };
        animationFrameId = requestAnimationFrame(checkAssaultTimers);
        return () => cancelAnimationFrame(animationFrameId);
    }, [assaultMeteors, myState.isDead]);

    // 狀態同步
    useEffect(() => {
        if (!dbRef || !user || !roomData?.id) return;
        dbRef.collection('rooms').doc(roomData.id).update({
            [`players.${user.uid}`]: myState
        }).catch(()=>{});
    }, [myState.score, myState.lives, myState.combo, myState.horizon, myState.attacks, myState.assaults, myState.isDead]);

    // ⚡ 修正：計時器不再受 myState.isDead 限制，確保死後依然保持全局倒數
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1 && roomData.hostId === user.uid) {
                    dbRef.collection('rooms').doc(roomData.id).update({ status: 'finished' }).catch(()=>{});
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, roomData.hostId, roomData.id, dbRef, user.uid]);

    const generateOptions = (word) => {
        let pool = wordDatabase.map(w => w.zh).filter(a => a !== word.zh);
        pool = [...new Set(pool)].sort(() => 0.5 - Math.random()).slice(0, 3);
        const finalOptions = [...pool, word.zh].map(opt => ({ text: opt, isCorrect: opt === word.zh, id: Math.random() })).sort(() => 0.5 - Math.random());
        setOptions(finalOptions);
    };

    const spawnMeteor = (wordObj) => {
        const baseDuration = 6.5; 
        const dropDuration = Math.max(2.2, baseDuration - (myState.horizon * 1.2)); 
        setCurrentMeteor({ wordObj, x: 10 + Math.random() * 80, duration: dropDuration, isExploding: false, startTime: performance.now() });
        playAudio(wordObj.en);
    };

    useEffect(() => {
        if (queue.length > 0 && !currentMeteor && !myState.isDead) {
            generateOptions(queue[0]);
            spawnMeteor(queue[0]);
        }
    }, [queue, currentMeteor, myState.isDead]);

    useEffect(() => {
        if (!currentMeteor || currentMeteor.isExploding || myState.isDead) return;
        let animationFrameId;
        const drop = (now) => {
            const elapsed = (now - currentMeteor.startTime) / 1000;
            const progress = Math.min(elapsed / currentMeteor.duration, 1);
            
            // ⚡ 修正：由 100 改為 82，保證隕石底端碰觸到紅網立刻觸發爆炸扣心
            const bottomLimit = 82 - (myState.horizon * 18); 
            const easeInProgress = progress * progress; 
            const currentY = -15 + (easeInProgress * (bottomLimit + 15)); 

            if (meteorRef.current) meteorRef.current.style.top = `${currentY}%`;

            if (progress >= 1) handleMiss();
            else animationFrameId = requestAnimationFrame(drop);
        };
        animationFrameId = requestAnimationFrame(drop);
        return () => cancelAnimationFrame(animationFrameId);
    }, [currentMeteor, myState.isDead, myState.horizon]);

    const handleMiss = () => {
        soundEngine.wrong();
        setCurrentMeteor(prev => ({ ...prev, isExploding: true }));
        setMyState(prev => { const newLives = prev.lives - 1; return { ...prev, lives: newLives, combo: 0, isDead: newLives <= 0 }; });
        setTimeout(nextTurn, 500);
    };

    const handleAssaultMiss = () => {
        soundEngine.explosion();
        if(containerRef.current) {
            containerRef.current.classList.add('animate-[shake_0.5s_ease-in-out]');
            setTimeout(() => containerRef.current?.classList.remove('animate-[shake_0.5s_ease-in-out]'), 500);
        }
        setMyState(prev => { const newLives = prev.lives - 1; return { ...prev, lives: newLives, combo: 0, isDead: newLives <= 0 }; });
    };

    // ⚡ 修正：全數採用 onClick 阻斷雙重觸發，徹底解決 Queue 佇列卡死與 Combo 錯亂問題
    const handleShoot = (opt) => {
        if (!currentMeteor || currentMeteor.isExploding || myState.isDead) return;
        
        if (opt.isCorrect) {
            soundEngine.laser();
            setCurrentMeteor(prev => ({ ...prev, isExploding: true }));
            
            const elapsed = (performance.now() - currentMeteor.startTime) / 1000;
            const speedBonus = elapsed < (currentMeteor.duration * 0.4) ? 2 : 0; 
            
            setMyState(prev => {
                let newCombo = prev.combo + 1;
                let newHorizon = prev.horizon;
                let newAttacks = prev.attacks;
                let newAssaults = prev.assaults || 0;
                let extraScore = 0;
                
                if (newCombo === 3) {
                    newAttacks += 1; 
                    newHorizon = Math.max(0, prev.horizon - 1); 
                    extraScore = 5; 
                } else if (newCombo === 5) {
                    newAssaults += 1; 
                    extraScore = 15; 
                    newCombo = 0; // 5連擊完美歸零
                }
                
                return { ...prev, score: prev.score + 1 + speedBonus + extraScore, combo: newCombo, horizon: newHorizon, attacks: newAttacks, assaults: newAssaults };
            });
            setTimeout(nextTurn, 400);
        } else {
            handleMiss();
        }
    };

    const nextTurn = () => {
        setQueue(prev => { const newQ = [...prev]; newQ.shift(); return newQ; });
        setCurrentMeteor(null);
    };

    const handleAssaultClick = (id, e) => {
        e.stopPropagation(); 
        if (myState.isDead) return;
        soundEngine.laser(); 
        
        setAssaultMeteors(prev => prev.map(m => {
            if (m.id === id) {
                const newClicks = m.clicksLeft - 1;
                if (newClicks <= 0) {
                    soundEngine.win(); 
                    setMyState(s => ({ ...s, score: s.score + 5 })); 
                    return null;
                }
                return { ...m, clicksLeft: newClicks };
            }
            return m;
        }).filter(Boolean));
    };

    const otherPlayers = Object.values(roomData.players || {}).filter(p => p.name !== myState.name);

    return (
        <div className="flex-1 flex flex-col w-full h-[100dvh] bg-slate-900 overflow-hidden no-select font-sans relative">
            <header className="bg-slate-950 border-b border-slate-800 p-2 flex justify-around items-center shrink-0 z-40">
                {/* ⚡ 加上房號看板，方便斷線者抬頭看 */}
                <div className="flex flex-col items-center bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                    <span className="text-white font-mono font-black text-xl leading-none">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                    <span className="text-yellow-400 font-black text-[10px] tracking-widest mt-1">ROOM {roomData?.code}</span>
                </div>
                {otherPlayers.map((p, i) => (
                    <div key={i} className={`flex flex-col items-center px-2 transition-all ${p.isDead ? 'opacity-30 grayscale' : ''}`}>
                        <span className="text-xs font-bold text-slate-300 truncate max-w-[70px]">{p.name}</span>
                        <div className="flex gap-2 mt-0.5">
                            <span className="text-red-500 text-xs font-bold"><i className="fa-solid fa-heart"></i> {p.lives}</span>
                            <span className="text-blue-400 text-xs font-bold"><i className="fa-solid fa-star"></i> {p.score}</span>
                        </div>
                        <div className="w-16 h-1.5 bg-slate-800 mt-1 rounded-full overflow-hidden border border-slate-700">
                            <div className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-300" style={{ width: `${((p.horizon || 0) / 3) * 100}%` }}></div>
                        </div>
                    </div>
                ))}
            </header>

            <main ref={containerRef} className="flex-1 relative w-full stars-bg overflow-hidden transition-all duration-300">
                
                {/* 💥 渲染突襲隕石 💥 */}
                {assaultMeteors.map(m => (
                    <div key={m.id} onClick={(e) => handleAssaultClick(m.id, e)} className="absolute z-50 flex flex-col items-center justify-center cursor-pointer pointer-events-auto" style={{ left: `${m.x}%`, top: `${m.y}%`, animation: 'growAssault 5s linear forwards' }}>
                        <div className="bg-red-600/90 text-white text-[10px] font-black px-2 py-0.5 rounded-full mb-1 border border-red-800 whitespace-nowrap shadow-[0_0_15px_rgba(220,38,38,0.8)]">
                            ⚠️ 來自 {m.senderName} 
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-80 animate-[ping_1s_ease-out_infinite]"></div>
                            <div className={`bg-purple-900 border-4 ${m.clicksLeft === 1 ? 'border-red-500' : 'border-purple-400'} rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.8)] active:scale-90 transition-transform`}>
                                <i className="fa-solid fa-meteor text-purple-300 text-2xl drop-shadow-md"></i>
                                <span className="absolute text-white font-black text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{m.clicksLeft}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* 實體地平線過載電網 */}
                <div className="absolute bottom-0 w-full bg-red-950/40 border-t-4 border-red-500 flex flex-col items-center justify-start transition-all duration-500 z-10 overflow-hidden" style={{ height: `${myState.horizon * 18}%` }}>
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(239,68,68,0.1)_25%,transparent_25%,transparent_50%,rgba(239,68,68,0.1)_50%,rgba(239,68,68,0.1)_75%,transparent_75%,transparent)] bg-[length:40px_40px] animate-[pulse_1.5s_infinite]"></div>
                    {myState.horizon > 0 && <div className="relative pt-1 text-red-400 font-black text-[10px] tracking-widest animate-pulse flex items-center gap-1"><i className="fa-solid fa-triangle-exclamation"></i> 防線縮短 LEVEL {myState.horizon}</div>}
                </div>

                {myState.isDead && (
                    <div className="absolute inset-0 z-30 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
                        <div className="w-16 h-16 bg-red-600/10 border border-red-600/30 text-red-500 rounded-full flex items-center justify-center mb-4 animate-spin"><i className="fa-solid fa-ghost text-3xl"></i></div>
                        <h2 className="text-4xl font-black text-red-600 mb-2 tracking-wider">戰敗出局</h2>
                        <p className="text-slate-400 text-xs font-bold tracking-widest animate-pulse">已啟動觀戰系統，正在監聽最終勝負...</p>
                    </div>
                )}

                {/* 正常單字隕石 */}
                {currentMeteor && !myState.isDead && (
                    <div ref={meteorRef} className="absolute transform -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none" style={{ left: `${currentMeteor.x}%`, top: '-15%' }}>
                        {currentMeteor.isExploding ? (
                            <div className="text-6xl animate-[ping_0.3s_ease-out_forwards] text-orange-500"><i className="fa-solid fa-explosion"></i></div>
                        ) : (
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-60 animate-pulse"></div>
                                <div className="relative bg-slate-800 border-2 border-slate-600 rounded-2xl p-4 shadow-2xl flex flex-col items-center pointer-events-auto cursor-pointer" onClick={() => playAudio(currentMeteor.wordObj.en)}>
                                    <i className="fa-solid fa-meteor text-blue-400 text-xl mb-1 absolute -top-4"></i>
                                    <span className="text-xl sm:text-2xl font-black text-white whitespace-nowrap">{currentMeteor.wordObj.en}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <footer className="w-full bg-slate-950 p-4 shrink-0 z-30 border-t-4 border-slate-800 relative">
                <div className="absolute -top-12 left-0 w-full px-4 flex justify-between items-end pointer-events-none">
                    <div className="bg-slate-900/90 border border-slate-700 px-4 py-1.5 rounded-t-xl flex gap-4 shadow-lg text-sm">
                        <span className="text-red-500 font-bold"><i className="fa-solid fa-heart"></i> {myState.lives}</span>
                        <span className="text-blue-400 font-bold"><i className="fa-solid fa-star"></i> {myState.score}</span>
                    </div>
                    <div className={`px-4 py-1.5 rounded-t-xl font-black text-xs tracking-wider shadow-lg transition-colors ${myState.combo >= 4 ? 'bg-purple-600 text-white animate-bounce' : myState.combo >= 2 ? 'bg-orange-500 text-white animate-pulse' : 'bg-slate-900/90 border border-slate-700 text-slate-400'}`}>
                        COMBO {myState.combo}/5
                    </div>
                </div>

                <div className="max-w-2xl mx-auto grid grid-cols-2 gap-3 mt-1">
                    {options.map((opt) => (
                        <button key={opt.id} disabled={myState.isDead} onClick={() => handleShoot(opt)} className="bg-slate-800 border-2 border-slate-700 hover:border-blue-500 rounded-xl p-4 active:scale-95 transition-all disabled:opacity-30">
                            <span className="text-xl font-bold text-white block truncate">{opt.text}</span>
                        </button>
                    ))}
                </div>
            </footer>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-15px) rotate(-3deg); } 50% { transform: translateX(15px) rotate(3deg); } 75% { transform: translateX(-15px) rotate(-3deg); } }
                @keyframes growAssault { 0% { transform: scale(0.5); opacity: 0; } 10% { opacity: 1; } 100% { transform: scale(2.0); opacity: 1; } }
            `}} />
        </div>
    );
}
