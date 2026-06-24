// ===================================================================
// MemoryGameMulti.js - 邊界防護強化版 (v4.1)
// 修正：偷看/上鎖卡無目標時自動跳過；閃電卡無目標時無效化
// ===================================================================

function addScore(players, scoringTeam, points) {
    const next = {};
    Object.keys(players).forEach(uid => { next[uid] = { ...players[uid] }; });
    Object.keys(next).forEach(uid => {
        if (next[uid].team === scoringTeam) next[uid].score += points;
    });
    const alliedTeams = new Set();
    Object.values(next).forEach(p => {
        if (p.winWinWith === scoringTeam) alliedTeams.add(p.team);
    });
    alliedTeams.forEach(allyTeam => {
        Object.keys(next).forEach(uid => {
            if (next[uid].team === allyTeam) {
                next[uid].score += points;
                next[uid].winWinWith = null;
            }
        });
    });
    return next;
}

function advanceTurn(turnOrder, currentTeamIndex, players) {
    const nextPlayers = {};
    Object.keys(players).forEach(uid => { nextPlayers[uid] = { ...players[uid] }; });
    let nextIndex = (currentTeamIndex + 1) % turnOrder.length;
    let guard = 0;
    while (guard < turnOrder.length) {
        const nextTeam = turnOrder[nextIndex];
        const isFrozenTeam = Object.values(nextPlayers).some(p => p.team === nextTeam && p.isFrozen);
        if (!isFrozenTeam) break;
        Object.keys(nextPlayers).forEach(uid => {
            if (nextPlayers[uid].team === nextTeam) nextPlayers[uid].isFrozen = false;
        });
        nextIndex = (nextIndex + 1) % turnOrder.length;
        guard++;
    }
    return { currentTeamIndex: nextIndex, players: nextPlayers };
}

function MemoryGameMulti({ onBack, settings, wordDatabase, dbRef, user, lang = 'zh-TW', setLang }) {
    const { useState, useEffect, useRef, useMemo } = React;

    const dict = {
        'zh-TW': {
            title: '多人記憶翻牌',
            namePlaceholder: '輸入你的名字',
            createRoom: '創建房間',
            roomPlaceholder: '4位房號',
            joinRoom: '加入',
            backToLobby: '返回大廳',
            leaveRoom: '離開房間',
            roomCode: '房間代碼',
            chooseTeam: '選擇你的隊伍',
            currentPlayers: '目前玩家',
            startGame: '開始遊戲',
            waitingHost: '等待房主開始...',
            yourTurn: '🔥 你的回合',
            teamAction: ' 行動中',
            championBoard: '🏆 霧臺國小英雄榜 🏆',
            selectTargetText1: '請點擊場上任',
            selectTargetText2: '張未翻開的卡片',
            chooseTargetTeam: '請選擇施放目標',
            useOn: '對【',
            useAction: '】使用',
            minigameRunning: '正在進行金幣雨小遊戲...',
            pleaseWait: '請稍候，遊戲會自動繼續',
            score: '得分:',
            minigameSettle: '金幣雨結算',
            got: '獲得',
            errorNoName: '請輸入名字',
            errorNoRoom: '請輸入房號',
            errorWrongRoom: '房號錯誤，請確認後再試一次',
            errorStarted: '這場遊戲已經開始，無法加入',
            errorNeedTeams: '至少需要 2 個不同的隊伍才能開始遊戲，請大家先選好隊伍',
            errorNoWords: '題庫單字不足，請先回大廳選擇複習範圍（至少需要8組單字）'
        },
        'en-US': {
            title: 'Multiplayer Memory',
            namePlaceholder: 'Enter your name',
            createRoom: 'Create Room',
            roomPlaceholder: '4-digit Code',
            joinRoom: 'Join',
            backToLobby: 'Back to Lobby',
            leaveRoom: 'Leave Room',
            roomCode: 'Room Code',
            chooseTeam: 'Choose Your Team',
            currentPlayers: 'Current Players',
            startGame: 'Start Game',
            waitingHost: 'Waiting for Host...',
            yourTurn: '🔥 Your Turn',
            teamAction: "'s Turn",
            championBoard: '🏆 Wutai Heroes 🏆',
            selectTargetText1: 'Please click',
            selectTargetText2: 'unflipped card(s)',
            chooseTargetTeam: 'Choose Target Team',
            useOn: 'Use on [',
            useAction: ']',
            minigameRunning: 'is playing Coin Rain...',
            pleaseWait: 'Please wait, game will resume shortly',
            score: 'Score:',
            minigameSettle: 'Coin Rain Results',
            got: 'got',
            errorNoName: 'Please enter a name',
            errorNoRoom: 'Please enter a room code',
            errorWrongRoom: 'Invalid room code, please try again',
            errorStarted: 'Game already started, cannot join',
            errorNeedTeams: 'At least 2 different teams are required to start',
            errorNoWords: 'Not enough words in database (at least 8 pairs required)'
        }
    };
    const t = dict[lang] || dict['zh-TW'];

    const [view, setView] = useState('menu');
    const [playerName, setPlayerName] = useState('');
    const [roomCodeInput, setRoomCodeInput] = useState('');
    const [roomData, setRoomData] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [debugClickCount, setDebugClickCount] = useState(0);

    const [miniGameItems, setMiniGameItems] = useState([]);
    const [miniGameActive, setMiniGameActive] = useState(false);
    const [isExploded, setIsExploded] = useState(false);
    const [miniGameScore, setMiniGameScore] = useState(0);
    const [miniGameSettlement, setMiniGameSettlement] = useState(null);
    const [effectSplash, setEffectSplash] = useState(null);
    const miniGameScoreRef = useRef(0);
    const processingRef = useRef(false);

    const teamNames = ['紅隊', '藍隊', '綠隊', '黃隊'];
    const teamColors = {
        '紅隊': 'bg-red-600 border-red-400',
        '藍隊': 'bg-blue-600 border-blue-400',
        '綠隊': 'bg-emerald-600 border-emerald-400',
        '黃隊': 'bg-amber-500 border-amber-400 text-black'
    };

    const myTeam = roomData?.players?.[user?.uid]?.team;
    const isMyTurn = () => roomData?.currentTeam === myTeam;
    const playSfx = (name) => { 
        try { if (window.soundEngine) window.soundEngine.play(name); } catch(e) {}
    };

    useEffect(() => {
        const originalOverscroll = document.body.style.overscrollBehavior;
        const originalTouchAction = document.body.style.touchAction;
        document.body.style.overscrollBehavior = 'none';
        document.body.style.touchAction = 'manipulation';
        return () => {
            document.body.style.overscrollBehavior = originalOverscroll;
            document.body.style.touchAction = originalTouchAction;
        };
    }, []);

    const availableWords = useMemo(() => {
        if (!wordDatabase || wordDatabase.length === 0) return [];
        if (settings?.selectedUnits?.length) {
            const filtered = wordDatabase.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
            if (filtered.length > 0) return filtered;
        }
        return wordDatabase;
    }, [wordDatabase, settings]);

    useEffect(() => {
        if (!roomData?.id || !dbRef) return;
        const unsubscribe = dbRef.collection('rooms').doc(roomData.id).onSnapshot(doc => {
            if (doc.exists) setRoomData({ id: doc.id, ...doc.data() });
            else onBack();
        }, err => console.error("Snapshot error:", err));
        return () => unsubscribe();
    }, [roomData?.id]);

    useEffect(() => {
        if (!roomData) return;
        if (roomData.status === 'playing' && view !== 'playing') setView('playing');
        if (roomData.status === 'finished' && view !== 'result') setView('result');
    }, [roomData?.status]);

    useEffect(() => {
        if (!roomData?.board || roomData.status !== 'playing' || !dbRef || !user) return;
        if (roomData.hostId !== user.uid) return;
        const allMatched = roomData.board.every(c => c.status === 'matched');
        if (allMatched) {
            dbRef.collection('rooms').doc(roomData.id).update({ status: 'finished' }).catch(() => {});
        }
    }, [roomData?.board, roomData?.status]);

    const handleCreateRoom = async () => {
        if (!playerName.trim()) return setErrorMsg(t.errorNoName);
        setErrorMsg('');
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
        if (!playerName.trim()) return setErrorMsg(t.errorNoName);
        if (!roomCodeInput.trim()) return setErrorMsg(t.errorNoRoom);
        setErrorMsg('');
        const snap = await dbRef.collection('rooms').where('code', '==', roomCodeInput.trim()).get();
        if (snap.empty) return setErrorMsg(t.errorWrongRoom);
        const roomDoc = snap.docs[0];
        const data = roomDoc.data();
        if (data.status !== 'waiting') return setErrorMsg(t.errorStarted);
        const count = Object.keys(data.players || {}).length;
        const defaultTeam = teamNames[count % teamNames.length];
        const newPlayer = { name: playerName.trim(), team: defaultTeam, isHost: false, score: 0, isFrozen: false, winWinWith: null };
        await dbRef.collection('rooms').doc(roomDoc.id).update({ [`players.${user.uid}`]: newPlayer });
        setRoomData({ id: roomDoc.id, ...data, players: { ...data.players, [user.uid]: newPlayer } });
        setView('waiting');
    };

    const handleChangeTeam = async (newTeam) => {
        if (!roomData || !user) return;
        await dbRef.collection('rooms').doc(roomData.id).update({ [`players.${user.uid}.team`]: newTeam });
    };

    const handleStartGame = async () => {
        setErrorMsg('');
        const teams = [...new Set(Object.values(roomData.players).map(p => p.team))];
        if (teams.length < 2) return setErrorMsg(t.errorNeedTeams);
        if (availableWords.length < 8) return setErrorMsg(t.errorNoWords);

        const shuffledWords = [...availableWords].sort(() => Math.random() - 0.5);
        let pairCount, powerUpCount;
        if (shuffledWords.length >= 9) {
            pairCount = 9;
            powerUpCount = 2;
        } else {
            pairCount = 8;
            powerUpCount = 4;
        }
        const selectedWords = shuffledWords.slice(0, pairCount);

        let cards = [];
        selectedWords.forEach((word, i) => {
            const enText = word.en || word.english || word.word || `word${i}`;
            const zhText = word.zh || word.chinese || word.translation || `字${i}`;
            const matchKey = `pair_${i}`;
            cards.push({ id: `en-${matchKey}`, matchId: matchKey, text: enText, type: 'en', status: 'hidden', lockedBy: null });
            cards.push({ id: `zh-${matchKey}`, matchId: matchKey, text: zhText, type: 'zh', status: 'hidden', lockedBy: null });
        });

        const allPowerUps = [
            { id: 'p_peek', text: '偷看卡', icon: 'fa-eye', power: 'peek' },
            { id: 'p_freeze', text: '冰凍卡', icon: 'fa-snowflake', power: 'freeze' },
            { id: 'p_bonus', text: '加分卡', icon: 'fa-gem', power: 'bonus' },
            { id: 'p_coin', text: '金幣雨', icon: 'fa-coins', power: 'coin' },
            { id: 'p_lock', text: '上鎖卡', icon: 'fa-lock', power: 'lock' },
            { id: 'p_radar', text: '雷達卡', icon: 'fa-satellite-dish', power: 'radar' },
            { id: 'p_lightning', text: '閃電卡', icon: 'fa-bolt', power: 'lightning' },
            { id: 'p_winwin', text: '雙贏卡', icon: 'fa-handshake', power: 'winwin' }
        ];
        const selectedPowerUps = [...allPowerUps].sort(() => Math.random() - 0.5).slice(0, powerUpCount);
        cards = [...cards, ...selectedPowerUps.map(p => ({ ...p, status: 'hidden', isPowerUp: true }))].sort(() => Math.random() - 0.5);

        await dbRef.collection('rooms').doc(roomData.id).update({
            status: 'playing', board: cards, turnOrder: teams, currentTeamIndex: 0, currentTeam: teams[0],
            turnState: { flippedIndices: [], comboCount: 0, isAnimating: false }, activeEffect: null
        });
    };

    const handleCardClick = async (index) => {
        if (!roomData || !isMyTurn() || view !== 'playing') return;
        if (processingRef.current) return;
        const roomRef = dbRef.collection('rooms').doc(roomData.id);
        const card = roomData.board[index];
        if (!card) return;

        if (roomData.activeEffect?.step === 'selecting_target') {
            if (card.status !== 'hidden' || card.isPowerUp) return;
            processingRef.current = true;
            try {
                if (roomData.activeEffect.power === 'lock') {
                    const newBoard = roomData.board.map((c, i) => i === index ? { ...c, lockedBy: myTeam } : c);
                    await roomRef.update({ board: newBoard, activeEffect: null });
                } else if (roomData.activeEffect.power === 'peek') {
                    const existing = roomData.activeEffect.peekIndices || [];
                    if (existing.includes(index)) { processingRef.current = false; return; }
                    const next = [...existing, index];
                    if (next.length < 2) {
                        await roomRef.update({ "activeEffect.peekIndices": next });
                    } else {
                        await roomRef.update({ "activeEffect.peekIndices": next });
                        setTimeout(() => roomRef.update({ activeEffect: null }).catch(() => {}), 5000);
                    }
                }
            } catch(e) { console.error("Target Selection Error", e); }
            processingRef.current = false;
            return;
        }

        if (card.status === 'matched' || roomData.turnState.flippedIndices.includes(index)) return;
        if (card.lockedBy && card.lockedBy !== myTeam) return;

        if (card.isPowerUp) {
            processingRef.current = true;
            playSfx('powerup');
            setEffectSplash(card);
            const newBoard = roomData.board.map((c, i) => i === index ? { ...c, status: 'matched' } : c);
            try {
                await roomRef.update({ board: newBoard });
            } catch(e) { console.error(e); processingRef.current = false; return; }

            // ----- 針對偷看/上鎖卡，檢查是否還有合法目標 -----
            if (card.power === 'peek' || card.power === 'lock') {
                const hiddenNormal = newBoard.filter(c => c.status === 'hidden' && !c.isPowerUp);
                const needed = card.power === 'peek' ? 2 : 1;
                if (hiddenNormal.length < needed) {
                    // 沒有足夠目標，直接跳過效果
                    await roomRef.update({ activeEffect: null }).catch(()=>{});
                    processingRef.current = false;
                    setTimeout(() => setEffectSplash(null), 800);
                    return;
                }
            }

            if (card.power === 'lightning') {
                const currentFlipped = roomData.turnState.flippedIndices;
                const currentCombo = roomData.turnState.comboCount || 0;
                try {
                    await dbRef.runTransaction(async (tx) => {
                        const snap = await tx.get(roomRef);
                        const data = snap.data();
                        if (!data || data.status !== 'playing') return;
                        let board = data.board;
                        let players = data.players;
                        const turnOrder = data.turnOrder;
                        let currentTeamIndex = data.currentTeamIndex;
                        let nextCombo = data.turnState.comboCount || 0;
                        const turnState = data.turnState;
                        let switchTurn = false;
                        let effectApplied = false;

                        if (data.turnState.comboCount === 0) {
                            // 基本回合
                            if (currentFlipped.length === 0) {
                                const hiddenPairs = board.filter(c => c.status === 'hidden' && !c.isPowerUp);
                                if (hiddenPairs.length > 0) {
                                    const pick = hiddenPairs[Math.floor(Math.random() * hiddenPairs.length)];
                                    const pairIdx = board.findIndex(c => c.matchId === pick.matchId && c.id !== pick.id);
                                    const selfIdx = board.findIndex(c => c.id === pick.id);
                                    if (pairIdx !== -1) {
                                        board = board.map((c, idx) => (idx === selfIdx || idx === pairIdx) ? { ...c, status: 'matched' } : c);
                                        players = addScore(players, myTeam, 10);
                                        effectApplied = true;
                                    }
                                }
                                if (effectApplied) nextCombo = 1; // 成功才給獎勵回合
                            } else if (currentFlipped.length === 1) {
                                const firstCard = board[currentFlipped[0]];
                                const pairIdx = board.findIndex(c => c.matchId === firstCard.matchId && c.id !== firstCard.id);
                                if (pairIdx !== -1) {
                                    board = board.map((c, idx) => (idx === currentFlipped[0] || idx === pairIdx) ? { ...c, status: 'matched' } : c);
                                    players = addScore(players, myTeam, 10);
                                    effectApplied = true;
                                    nextCombo = 1;
                                }
                            }
                        } else {
                            // 獎勵回合中
                            if (currentFlipped.length === 0) {
                                const hiddenPairs = board.filter(c => c.status === 'hidden' && !c.isPowerUp);
                                if (hiddenPairs.length > 0) {
                                    const pick = hiddenPairs[Math.floor(Math.random() * hiddenPairs.length)];
                                    const pairIdx = board.findIndex(c => c.matchId === pick.matchId && c.id !== pick.id);
                                    const selfIdx = board.findIndex(c => c.id === pick.id);
                                    if (pairIdx !== -1) {
                                        board = board.map((c, idx) => (idx === selfIdx || idx === pairIdx) ? { ...c, status: 'matched' } : c);
                                        players = addScore(players, myTeam, 10);
                                        effectApplied = true;
                                    }
                                }
                                if (effectApplied) {
                                    switchTurn = true;
                                    nextCombo = 0;
                                } else {
                                    switchTurn = true;
                                    nextCombo = 0;
                                }
                            } else if (currentFlipped.length === 1) {
                                const firstCard = board[currentFlipped[0]];
                                const pairIdx = board.findIndex(c => c.matchId === firstCard.matchId && c.id !== firstCard.id);
                                if (pairIdx !== -1) {
                                    board = board.map((c, idx) => (idx === currentFlipped[0] || idx === pairIdx) ? { ...c, status: 'matched' } : c);
                                    players = addScore(players, myTeam, 10);
                                }
                                switchTurn = true;
                                nextCombo = 0;
                            }
                        }

                        if (switchTurn) {
                            const advanced = advanceTurn(turnOrder, currentTeamIndex, players);
                            currentTeamIndex = advanced.currentTeamIndex;
                            players = advanced.players;
                        }
                        const nextTeamName = turnOrder[currentTeamIndex] || turnOrder[0] || myTeam;
                        tx.update(roomRef, {
                            board, players, currentTeamIndex,
                            currentTeam: nextTeamName,
                            turnState: { flippedIndices: [], comboCount: nextCombo, isAnimating: false },
                            activeEffect: null
                        });
                    });
                } catch (e) { console.error('閃電卡交易失敗', e); }
                processingRef.current = false;
                setTimeout(() => setEffectSplash(null), 1500);
                return;
            }

            processingRef.current = false;
            setTimeout(() => {
                setEffectSplash(null);
                processEffectAuto(card);
            }, 2000);
            return;
        }

        // 普通字卡
        const flippedLen = roomData.turnState.flippedIndices.length;

        if (flippedLen === 0) {
            processingRef.current = true;
            try {
                await dbRef.runTransaction(async (tx) => {
                    const snap = await tx.get(roomRef);
                    const data = snap.data();
                    if (!data || data.status !== 'playing') return;
                    if (data.turnState.flippedIndices.length !== 0 || data.turnState.isAnimating) return;
                    const cardNow = data.board[index];
                    if (!cardNow || cardNow.status !== 'hidden' || cardNow.isPowerUp) return;
                    if (cardNow.lockedBy && cardNow.lockedBy !== myTeam) return;
                    tx.update(roomRef, { "turnState.flippedIndices": [index] });
                });
            } catch (e) { console.error("第一張翻牌交易失敗", e); }
            processingRef.current = false;
            return;
        }

        if (flippedLen === 1) {
            if (roomData.turnState.isAnimating) return;
            processingRef.current = true;
            let success = false;
            try {
                await dbRef.runTransaction(async (tx) => {
                    const snap = await tx.get(roomRef);
                    const data = snap.data();
                    if (!data || data.status !== 'playing') return;
                    if (data.turnState.flippedIndices.length !== 1 || data.turnState.isAnimating) return;
                    const cardNow = data.board[index];
                    if (!cardNow || cardNow.status !== 'hidden' || cardNow.isPowerUp) return;
                    if (cardNow.lockedBy && cardNow.lockedBy !== myTeam) return;
                    if (data.turnState.flippedIndices[0] === index) return;
                    const newFlipped = [...data.turnState.flippedIndices, index];
                    tx.update(roomRef, { 
                        "turnState.flippedIndices": newFlipped, 
                        "turnState.isAnimating": true 
                    });
                    success = true;
                });
            } catch (e) { console.error("第二張翻牌交易失敗", e); }
            processingRef.current = false;

            if (success) {
                setTimeout(async () => {
                    try {
                        await dbRef.runTransaction(async (tx) => {
                            const snap = await tx.get(roomRef);
                            const data = snap.data();
                            if (!data || data.status !== 'playing') {
                                tx.update(roomRef, { "turnState.isAnimating": false, "turnState.flippedIndices": [] });
                                return;
                            }

                            let board = data.board;
                            let players = data.players;
                            const turnOrder = data.turnOrder;
                            let currentTeamIndex = data.currentTeamIndex;
                            let nextCombo = data.turnState.comboCount || 0;

                            const currentFlipped = data.turnState.flippedIndices;
                            if (currentFlipped.length !== 2) {
                                tx.update(roomRef, { "turnState.isAnimating": false, "turnState.flippedIndices": [] });
                                return;
                            }
                            const [idx1, idx2] = currentFlipped;
                            const isMatch = board[idx1].matchId === board[idx2].matchId && board[idx1].type !== board[idx2].type;

                            if (isMatch) {
                                playSfx('correct');
                                board = board.map((c, idx) => (idx === idx1 || idx === idx2) ? { ...c, status: 'matched' } : c);
                                players = addScore(players, myTeam, 10);
                                nextCombo += 1;
                            } else {
                                playSfx('wrong');
                                const advanced = advanceTurn(turnOrder, currentTeamIndex, players);
                                currentTeamIndex = advanced.currentTeamIndex;
                                players = advanced.players;
                                nextCombo = 0;
                            }

                            if (data.turnState.comboCount === 1) {
                                const advanced = advanceTurn(turnOrder, currentTeamIndex, players);
                                currentTeamIndex = advanced.currentTeamIndex;
                                players = advanced.players;
                                nextCombo = 0;
                            }

                            const nextTeamName = turnOrder[currentTeamIndex] || turnOrder[0] || myTeam;

                            tx.update(roomRef, {
                                board, players, currentTeamIndex, 
                                currentTeam: nextTeamName,
                                turnState: { flippedIndices: [], comboCount: nextCombo, isAnimating: false }
                            });
                        });
                    } catch (e) { 
                        console.error('回合結算崩潰，強制解鎖', e);
                        roomRef.update({ "turnState.isAnimating": false, "turnState.flippedIndices": [] }).catch(()=>{});
                    }
                }, 1200);
            }
            return;
        }
    };

    const forceResetTurn = () => {
        if (roomData?.hostId !== user.uid) return;
        const count = debugClickCount + 1;
        if (count >= 5) {
            processingRef.current = false;
            dbRef.collection('rooms').doc(roomData.id).update({
                "turnState.isAnimating": false,
                "turnState.flippedIndices": [],
                activeEffect: null
            }).then(() => alert("房主已強制重設遊戲狀態"));
            setDebugClickCount(0);
        } else {
            setDebugClickCount(count);
        }
    };

    const processEffectAuto = async (card) => {
        const roomRef = dbRef.collection('rooms').doc(roomData.id);
        try {
            if (['peek', 'lock'].includes(card.power)) {
                await roomRef.update({ "activeEffect.step": 'selecting_target' });
            } else if (['bonus', 'radar', 'coin'].includes(card.power)) {
                executeEffect(card.power);
            } else if (card.power === 'lightning') {
                // handled
            } else {
                await roomRef.update({ "activeEffect.step": 'choosing_team' });
            }
        } catch(e) { console.error("Effect processing failed", e); }
    };

    const executeEffect = async (power, targetTeam = null) => {
        const roomRef = dbRef.collection('rooms').doc(roomData.id);
        if (power === 'coin') {
            startCoinMiniGame();
            await roomRef.update({ "activeEffect.step": 'minigame_running' });
            return;
        }
        if (power === 'radar') {
            await roomRef.update({ "activeEffect.step": 'radar_showing' });
            setTimeout(() => roomRef.update({ activeEffect: null }).catch(() => {}), 5000);
            return;
        }

        try {
            await dbRef.runTransaction(async (tx) => {
                const snap = await tx.get(roomRef);
                const data = snap.data();
                if (!data) return;
                let players = data.players;
                let board = data.board;

                if (power === 'bonus') {
                    players = addScore(players, myTeam, 30);
                    tx.update(roomRef, { players, activeEffect: null });
                } else if (power === 'freeze') {
                    const nextPlayers = {};
                    Object.keys(players).forEach(uid => {
                        nextPlayers[uid] = { ...players[uid] };
                        if (nextPlayers[uid].team === targetTeam) nextPlayers[uid].isFrozen = true;
                    });
                    tx.update(roomRef, { players: nextPlayers, activeEffect: null });
                } else if (power === 'winwin') {
                    const nextPlayers = {};
                    Object.keys(players).forEach(uid => {
                        nextPlayers[uid] = { ...players[uid] };
                        if (nextPlayers[uid].team === myTeam) nextPlayers[uid].winWinWith = targetTeam;
                    });
                    tx.update(roomRef, { players: nextPlayers, activeEffect: null });
                }
            });
        } catch (e) { 
            console.error('道具效果失敗', e); 
            roomRef.update({ activeEffect: null }).catch(()=>{});
        }
    };

    const startCoinMiniGame = () => {
        miniGameScoreRef.current = 0;
        setMiniGameActive(true);
        setMiniGameScore(0);
        setIsExploded(false);
        setMiniGameSettlement(null);
        const items = [];
        for (let i = 0; i < 40; i++) {
            items.push({
                id: i, type: i % 4 === 0 ? 'bomb' : 'coin',
                left: Math.random() * 90, delay: Math.random() * 6, duration: 2 + Math.random() * 1
            });
        }
        setMiniGameItems(items);
        setTimeout(() => endMiniGame(), 10000);
    };

    const endMiniGame = () => {
        const finalScore = miniGameScoreRef.current;
        setMiniGameActive(false);
        setMiniGameSettlement({ score: finalScore });
        setTimeout(async () => {
            setMiniGameSettlement(null);
            if (!roomData) return;
            const roomRef = dbRef.collection('rooms').doc(roomData.id);
            try {
                await dbRef.runTransaction(async (tx) => {
                    const snap = await tx.get(roomRef);
                    const data = snap.data();
                    if (!data) return;
                    const players = addScore(data.players, myTeam, finalScore);
                    tx.update(roomRef, { players, activeEffect: null });
                });
            } catch (e) { console.error('金幣雨失敗', e); roomRef.update({ activeEffect: null }).catch(()=>{}); }
        }, 1800);
    };

    const TopHeader = () => (
        <header className="h-14 sm:h-16 flex justify-between items-center bg-slate-900 px-4 border-b border-slate-700 shrink-0 z-30 shadow-md">
            <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors border border-slate-600">
                <i className="fa-solid fa-arrow-left text-lg text-white"></i>
            </button>
            <div className="flex-1 text-center font-black text-lg tracking-wider text-slate-200 truncate px-4">
                {t.title}
            </div>
            {setLang && (
                <button onClick={() => setLang(lang === 'zh-TW' ? 'en-US' : 'zh-TW')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 text-white font-bold border border-indigo-400 transition-colors shadow-sm">
                    {lang === 'zh-TW' ? 'EN' : '中文'}
                </button>
            )}
        </header>
    );

    if (view === 'result') {
        const sortedTeams = Object.values(roomData.players).sort((a, b) => b.score - a.score);
        const podium = [sortedTeams[1], sortedTeams[0], sortedTeams[2]].filter(team => team);
        return (
            <div className="fixed inset-0 z-[300] bg-slate-950 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent animate-pulse"></div>
                <h1 className="text-4xl sm:text-6xl font-black text-yellow-400 mb-8 sm:mb-16 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] z-10 animate-bounce text-center">
                    {t.championBoard}
                </h1>
                <div className="relative flex items-end justify-center w-full max-w-4xl h-64 sm:h-80 mb-12 z-10 px-4">
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
                <button onClick={onBack} className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-xl font-black shadow-xl hover:scale-110 transition-transform active:scale-95 z-10 border-2 border-white/20">
                    <i className="fa-solid fa-house mr-2"></i> {t.backToLobby}
                </button>
            </div>
        );
    }

    if (view === 'menu') return (
        <div className="flex flex-col h-full bg-slate-950">
            <TopHeader />
            <div className="flex-1 flex items-center justify-center p-4 text-white">
                <div className="bg-slate-800 p-8 rounded-3xl w-full max-w-md border border-slate-700 shadow-2xl">
                    <input type="text" value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder={t.namePlaceholder} className="w-full p-4 rounded-xl bg-slate-900 border-2 border-slate-600 mb-4" />
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={handleCreateRoom} className="bg-blue-600 hover:bg-blue-500 p-4 rounded-xl font-bold transition-colors">{t.createRoom}</button>
                        <div className="flex flex-col gap-2">
                            <input type="text" maxLength="4" value={roomCodeInput} onChange={e => setRoomCodeInput(e.target.value)} placeholder={t.roomPlaceholder} className="p-2 rounded-lg bg-slate-900 border border-slate-600 text-center text-white font-black" />
                            <button onClick={handleJoinRoom} className="bg-indigo-600 hover:bg-indigo-500 p-2 rounded-lg font-bold transition-colors">{t.joinRoom}</button>
                        </div>
                    </div>
                    {errorMsg && <div className="text-red-400 text-sm mt-4 text-center font-bold">{errorMsg}</div>}
                </div>
            </div>
        </div>
    );

    if (view === 'waiting') return (
        <div className="flex flex-col h-full bg-slate-950">
            <TopHeader />
            <div className="flex-1 flex items-center justify-center p-4 text-white">
                <div className="bg-slate-800 p-8 rounded-3xl w-full max-w-md text-center border border-slate-700 shadow-2xl">
                    <div className="text-sm text-slate-400">{t.roomCode}</div>
                    <div className="text-5xl font-black text-yellow-400 mb-6 tracking-widest bg-slate-900 py-3 rounded-xl border border-yellow-500/30">{roomData.code}</div>
                    <div className="text-left text-sm text-slate-400 mb-2">{t.chooseTeam}</div>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        {teamNames.map(teamName => (
                            <button key={teamName} onClick={() => handleChangeTeam(teamName)}
                                className={`p-3 rounded-xl font-bold border-2 transition-all ${teamColors[teamName]} ${myTeam === teamName ? 'ring-4 ring-white scale-105' : 'opacity-50 hover:opacity-100 border-transparent'}`}>
                                {teamName}
                            </button>
                        ))}
                    </div>
                    <div className="text-left text-sm text-slate-400 mb-2">{t.currentPlayers}</div>
                    <div className="space-y-2 mb-8 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {Object.values(roomData.players).map((p, i) => (
                            <div key={i} className={`p-3 rounded-xl flex justify-between font-bold border border-slate-600/50 shadow-sm ${teamColors[p.team]}`}>
                                <span>{p.name}{p.isHost ? ' 👑' : ''}</span>
                                <span>{p.team}</span>
                            </div>
                        ))}
                    </div>
                    {errorMsg && <div className="text-red-400 text-sm mb-4 font-bold">{errorMsg}</div>}
                    {roomData.hostId === user.uid ? (
                        <button onClick={handleStartGame} className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-black text-xl animate-pulse shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-colors">{t.startGame}</button>
                    ) : <div className="text-slate-400 animate-pulse font-bold bg-slate-900 py-4 rounded-xl">{t.waitingHost}</div>}
                    <div className="mt-4 mb-2 flex flex-col items-center gap-2">
                        <div className="bg-white p-2 rounded-xl shadow-inner">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${roomData.code}&margin=6`} alt="QR Code" width="140" height="140" />
                        </div>
                    </div>
                    <button onClick={onBack} className="w-full mt-6 text-slate-400 hover:text-white transition-colors text-sm underline underline-offset-4">{t.leaveRoom}</button>
                </div>
            </div>
        </div>
    );

    const teamScores = {};
    Object.values(roomData.players).forEach(p => { teamScores[p.team] = (teamScores[p.team] || 0) + p.score; });
    const orderedTeams = useMemo(() => teamNames.filter(t => teamScores[t] !== undefined), [teamScores]);

    return (
        <div className="fixed inset-0 flex flex-col bg-slate-950 text-white overflow-hidden">
            <header className="h-14 sm:h-16 flex justify-between items-center bg-slate-900 px-4 border-b border-slate-800 shrink-0 z-30 shadow-md">
                <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                    <i className="fa-solid fa-arrow-left text-lg"></i>
                </button>
                <div className="flex-1 flex justify-center items-center">
                    <div onClick={forceResetTurn} className={`cursor-pointer select-none text-base sm:text-lg font-black px-6 py-1.5 rounded-full border-2 ${isMyTurn() ? 'text-yellow-400 border-yellow-500/50 bg-yellow-900/20 animate-pulse' : 'text-slate-400 border-slate-700 bg-slate-800/50'}`}>
                        {isMyTurn() ? t.yourTurn : `${roomData.currentTeam}${t.teamAction}`}
                    </div>
                </div>
                <div className="flex gap-1.5">
                    {orderedTeams.map(teamName => (
                        <div key={teamName} className={`px-2 py-1 rounded-md text-xs sm:text-sm font-black border border-white/20 shadow-sm flex flex-col items-center leading-tight ${teamColors[teamName]}`}>
                            <span>{teamName}</span>
                            <span>{teamScores[teamName]}</span>
                        </div>
                    ))}
                </div>
            </header>

            {roomData.activeEffect?.step === 'selecting_target' && isMyTurn() && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-purple-600 text-white px-6 py-3 rounded-full font-black shadow-2xl animate-bounce border-2 border-white">
                    {t.selectTargetText1} {roomData.activeEffect.power === 'peek' ? '2' : '1'} {t.selectTargetText2}
                </div>
            )}

            {roomData.activeEffect?.step === 'choosing_team' && isMyTurn() && (
                <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                    <h2 className="text-3xl font-black mb-8 drop-shadow-lg">{t.chooseTargetTeam}</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {roomData.turnOrder.filter(tn => tn !== myTeam).map(tn => (
                            <button key={tn} onClick={() => executeEffect(roomData.activeEffect.power, tn)} 
                                className={`px-8 py-4 rounded-2xl font-black text-xl border-4 shadow-xl hover:scale-110 transition-transform active:scale-95 ${teamColors[tn]}`}>
                                {t.useOn}{tn}{t.useAction}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <main className="flex-1 relative flex items-center justify-center p-2 sm:p-6 overflow-hidden">
                <div className="gap-2 sm:gap-4 w-full h-full max-w-6xl max-h-full grid"
                    style={{ gridTemplateColumns: `repeat(5, 1fr)`, gridTemplateRows: `repeat(${Math.ceil(roomData.board.length/5)}, 1fr)` }}>
                    {roomData.board.map((card, idx) => {
                        const isMatched = card.status === 'matched';
                        const isPeeked = roomData.activeEffect?.power === 'peek' && roomData.activeEffect?.triggerTeam === myTeam && roomData.activeEffect?.peekIndices?.includes(idx);
                        const isRadarRevealed = roomData.activeEffect?.step === 'radar_showing' && !card.isPowerUp;
                        const isFlipped = isMatched || roomData.turnState.flippedIndices.includes(idx) || isPeeked || isRadarRevealed;
                        return (
                            <button key={idx} onClick={() => handleCardClick(idx)} disabled={isMatched || (roomData.turnState.isAnimating && roomData.activeEffect?.step !== 'selecting_target')}
                                className={`relative rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 border-2 overflow-hidden ${
                                    isFlipped ? 'bg-slate-800 border-slate-600 shadow-inner' : 'bg-gradient-to-b from-blue-500 to-blue-700 border-blue-400 shadow-[0_6px_0_#1e3a8a] active:translate-y-[6px] active:shadow-none hover:brightness-110'
                                } ${isMatched ? 'opacity-30 grayscale' : ''} ${isRadarRevealed ? 'opacity-80 ring-4 ring-green-400/80 bg-slate-700' : ''}`}
                            >
                                {isFlipped ? (
                                    <div className="text-center p-2">
                                        {card.isPowerUp ? <i className={`fa-solid ${card.icon} text-3xl sm:text-5xl text-yellow-400 drop-shadow-md`}></i> : <span className="text-lg sm:text-3xl font-black break-all leading-tight">{card.text}</span>}
                                    </div>
                                ) : <i className="fa-solid fa-question text-white/20 text-3xl sm:text-5xl drop-shadow-sm"></i>}
                                {card.lockedBy && !isFlipped && (
                                    <div className="absolute inset-0 bg-red-900/60 backdrop-blur-[2px] flex items-center justify-center"><i className="fa-solid fa-lock text-red-500 text-3xl drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]"></i></div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </main>

            {miniGameActive && (
                <div className="fixed inset-0 z-[100] bg-indigo-950/95 overflow-hidden touch-none backdrop-blur-sm">
                    <div className="absolute top-24 left-1/2 -translate-x-1/2 text-5xl font-black text-yellow-400 z-[110] drop-shadow-[0_0_15px_rgba(234,179,8,0.6)] bg-slate-900/50 px-8 py-3 rounded-full border border-yellow-500/30">{t.score} {miniGameScore}</div>
                    {miniGameItems.map(item => (
                        <div key={item.id} className="absolute text-6xl sm:text-7xl animate-[fall_linear_forwards] cursor-pointer p-6"
                            style={{ left: `${item.left}%`, top: '-15%', animationDuration: `${item.duration}s`, animationDelay: `${item.delay}s` }}
                            onPointerDown={() => {
                                if (isExploded) return;
                                if (item.type === 'bomb') { setIsExploded(true); playSfx('explosion'); setTimeout(() => endMiniGame(), 1500); }
                                else { miniGameScoreRef.current += 1; setMiniGameScore(s => s + 1); playSfx('coin'); setMiniGameItems(prev => prev.filter(it => it.id !== item.id)); }
                            }}
                        ><i className={`fa-solid ${item.type === 'coin' ? 'fa-coins text-yellow-400' : 'fa-bomb text-red-500'}`}></i></div>
                    ))}
                    {isExploded && <div className="absolute inset-0 bg-red-600/90 flex items-center justify-center z-[120]"><i className="fa-solid fa-explosion text-[200px] text-white animate-ping"></i></div>}
                </div>
            )}

            {miniGameSettlement && (
                <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center text-white">
                    <i className="fa-solid fa-coins text-8xl text-yellow-400 mb-6 animate-bounce"></i>
                    <h2 className="text-4xl font-black mb-4 tracking-widest">{t.minigameSettle}</h2>
                    <p className="text-7xl font-black text-yellow-400">+{miniGameSettlement.score}</p>
                </div>
            )}

            {effectSplash && (
                <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/85 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
                    <div className="text-yellow-400 text-[150px] mb-8 animate-bounce"><i className={`fa-solid ${effectSplash.icon}`}></i></div>
                    <h2 className="text-5xl sm:text-6xl font-black text-white">{myTeam} {t.got}</h2>
                    <h3 className="text-7xl sm:text-8xl font-black text-yellow-400 mt-6 tracking-widest">{effectSplash.text}</h3>
                </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-1 z-[50] pointer-events-none">
                <button onClick={onBack} className="pointer-events-auto" style={{ fontSize: 11, color: 'rgba(100,116,139,0.7)', border: 'none', background: 'none', cursor: 'pointer', padding: '4px 20px' }}>← 返回遊戲大廳</button>
            </div>

            <style>{`
                @keyframes fall { 0% { transform: translateY(-15vh) rotate(0deg); } 100% { transform: translateY(115vh) rotate(360deg); } }
                @keyframes zoomIn { from { opacity: 0; transform: scale(0.3); } to { opacity: 1; transform: scale(1); } }
                @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-80px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes fadeInRight { from { opacity: 0; transform: translateX(80px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    );
}

window.MemoryGameMulti = MemoryGameMulti;
