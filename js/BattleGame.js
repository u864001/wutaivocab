/* ═══════════════════════════════════════════════════════════════
   BattleGame.js  ── 星際連線對戰（太空視覺版）
   依賴：React 18 (standalone Babel), Firebase Firestore (compat),
         confetti, soundEngine, playAudio, isValidName
═══════════════════════════════════════════════════════════════ */
const { useState, useEffect, useMemo, useCallback, useRef } = React;

/* ───────────────────────────────────────────────────────────────
   UFO 彩蛋素材（3 款，與單人版相同）
─────────────────────────────────────────────────────────────── */
const UFO_SVGS = [
    <svg key="u0" viewBox="0 0 82 38" width="70" height="32" style={{display:'block'}}>
        <ellipse cx="41" cy="29" rx="37" ry="9.5" fill="#1c2e50" stroke="#2a52b5" strokeWidth="1"/>
        <path d="M18,29 Q41,10 64,29" fill="#122038"/>
        <path d="M18,29 Q41,10 64,29" fill="none" stroke="#1e4292" strokeWidth="0.8"/>
        <ellipse cx="41" cy="22" rx="12" ry="8" fill="#172c4a" stroke="#243e82" strokeWidth="0.7"/>
        <circle cx="28" cy="28" r="2.3" fill="#3b82f6" opacity="0.75"/>
        <circle cx="41" cy="29.5" r="2.3" fill="#60a5fa" opacity="0.70"/>
        <circle cx="54" cy="28" r="2.3" fill="#3b82f6" opacity="0.75"/>
    </svg>,
    <svg key="u1" viewBox="0 0 74 54" width="62" height="45" style={{display:'block'}}>
        <ellipse cx="37" cy="42" rx="33" ry="11" fill="#1c2e50" stroke="#2a52b5" strokeWidth="1"/>
        <circle cx="37" cy="28" r="19" fill="#122038" stroke="#1e4292" strokeWidth="1"/>
        <circle cx="31" cy="24" r="6.5" fill="#172c4a" opacity="0.6"/>
        <circle cx="22" cy="41" r="2.5" fill="#818cf8" opacity="0.70"/>
        <circle cx="37" cy="44" r="2.5" fill="#a5b4fc" opacity="0.65"/>
        <circle cx="52" cy="41" r="2.5" fill="#818cf8" opacity="0.70"/>
    </svg>,
    <svg key="u2" viewBox="0 0 84 44" width="72" height="37" style={{display:'block'}}>
        <polygon points="42,5 72,32 12,32" fill="#122038" stroke="#2a52b5" strokeWidth="1"/>
        <rect x="12" y="32" width="60" height="8" rx="4" fill="#1c2e50" stroke="#243e82" strokeWidth="0.8"/>
        <circle cx="25" cy="32" r="2.2" fill="#6366f1" opacity="0.70"/>
        <circle cx="42" cy="37" r="2.2" fill="#818cf8" opacity="0.70"/>
        <circle cx="59" cy="32" r="2.2" fill="#6366f1" opacity="0.70"/>
    </svg>
];

/* ───────────────────────────────────────────────────────────────
   衛星素材（3 款，與單人版相同）
─────────────────────────────────────────────────────────────── */
const SAT_SVGS = [
    <svg key="s0" viewBox="0 0 102 44" width="88" height="38" style={{display:'block'}}>
        <rect x="31" y="17" width="40" height="12" rx="5" fill="#0f1e3a" stroke="#1e3a8a" strokeWidth="1"/>
        <rect x="1" y="14" width="25" height="16" rx="2" fill="#0a1628" stroke="#152e68" strokeWidth="0.8"/>
        <line x1="5" y1="18" x2="25" y2="18" stroke="#0d2040" strokeWidth="1.5"/>
        <line x1="5" y1="22" x2="25" y2="22" stroke="#0d2040" strokeWidth="1.5"/>
        <line x1="26" y1="23" x2="31" y2="23" stroke="#1e3a8a" strokeWidth="1.5"/>
        <rect x="76" y="14" width="25" height="16" rx="2" fill="#0a1628" stroke="#152e68" strokeWidth="0.8"/>
        <line x1="77" y1="18" x2="100" y2="18" stroke="#0d2040" strokeWidth="1.5"/>
        <line x1="77" y1="22" x2="100" y2="22" stroke="#0d2040" strokeWidth="1.5"/>
        <line x1="71" y1="23" x2="76" y2="23" stroke="#1e3a8a" strokeWidth="1.5"/>
        <line x1="51" y1="17" x2="51" y2="8" stroke="#1e3a8a" strokeWidth="1.5"/>
        <circle cx="51" cy="7" r="3.5" fill="none" stroke="#2563eb" strokeWidth="1.5"/>
    </svg>,
    <svg key="s1" viewBox="0 0 94 38" width="80" height="32" style={{display:'block'}}>
        <rect x="15" y="12" width="64" height="16" rx="8" fill="#0a1628" stroke="#152e68" strokeWidth="1"/>
        <rect x="8" y="5" width="78" height="9" rx="2" fill="#0f1e3a" stroke="#1e3a8a" strokeWidth="0.8"/>
        <rect x="8" y="24" width="78" height="9" rx="2" fill="#0f1e3a" stroke="#1e3a8a" strokeWidth="0.8"/>
        <circle cx="80" cy="20" r="8" fill="#060d1f" stroke="#1e3a8a" strokeWidth="1.5"/>
        <circle cx="14" cy="20" r="5.5" fill="#060d1f" stroke="#152e68" strokeWidth="1"/>
    </svg>,
    <svg key="s2" viewBox="0 0 84 38" width="72" height="32" style={{display:'block'}}>
        <circle cx="42" cy="19" r="14" fill="#0a1628" stroke="#1e3a8a" strokeWidth="1"/>
        <line x1="28" y1="19" x2="20" y2="19" stroke="#1e3a8a" strokeWidth="1"/>
        <rect x="4" y="14" width="22" height="10" rx="2" fill="#0f1e3a" stroke="#152e68" strokeWidth="0.8"/>
        <line x1="56" y1="19" x2="64" y2="19" stroke="#1e3a8a" strokeWidth="1"/>
        <rect x="58" y="14" width="22" height="10" rx="2" fill="#0f1e3a" stroke="#152e68" strokeWidth="0.8"/>
    </svg>
];

/* ───────────────────────────────────────────────────────────────
   全域 CSS（繼承單人版 + BattleGame 專用動畫）
─────────────────────────────────────────────────────────────── */
const SPACE_CSS = `
    @keyframes twinkle{0%,100%{opacity:.1;transform:scale(.8)}50%{opacity:1;transform:scale(1.6)}}
    @keyframes flameFlicker{0%,100%{transform:scaleX(1) scaleY(1);opacity:.82}33%{transform:scaleX(1.12) scaleY(.93);opacity:1}66%{transform:scaleX(.9) scaleY(1.07);opacity:.75}}
    @keyframes trailFlicker{0%,100%{transform:scaleY(1);opacity:.65}50%{transform:scaleY(1.28);opacity:.42}}
    @keyframes impactRingA{0%{transform:translate(-50%,-50%) scale(.2);opacity:1}100%{transform:translate(-50%,-50%) scale(4.8);opacity:0}}
    @keyframes impactRingB{0%{transform:translate(-50%,-50%) scale(.2);opacity:.8}100%{transform:translate(-50%,-50%) scale(3.5);opacity:0}}
    @keyframes impactCore{0%{transform:scale(.3);opacity:1}55%{transform:scale(1.6);opacity:.8}100%{transform:scale(.5);opacity:0}}
    @keyframes groundBlast{0%{transform:translateX(-50%) scale(.1,.35);opacity:1}38%{transform:translateX(-50%) scale(2.5,1.9);opacity:.9}100%{transform:translateX(-50%) scale(3.8,.04);opacity:0}}
    @keyframes groundRing{0%{transform:translateX(-50%) scaleX(.1);opacity:.9}100%{transform:translateX(-50%) scaleX(5);opacity:0}}
    @keyframes ufoWobble{0%,100%{transform:rotate(0deg)}25%{transform:rotate(-15deg)}75%{transform:rotate(15deg)}}
    .ufo-wobble{animation:ufoWobble .5s ease-in-out infinite}
    @keyframes ufoHit{0%{transform:scale(1)}45%{transform:scale(1.14)}100%{transform:scale(1)}}
    .ufo-hit{animation:ufoHit .22s ease-out forwards}
    @keyframes ssFly{0%{transform:translateX(-80px);opacity:0}20%{opacity:1}80%{opacity:.8}100%{transform:translateX(260px);opacity:0}}
    @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-10px) rotate(-2deg)}50%{transform:translateX(10px) rotate(2deg)}75%{transform:translateX(-10px) rotate(-2deg)}}
    @keyframes scanDrift{from{background-position:0 0}to{background-position:0 80px}}
    @keyframes growAssault{0%{transform:scale(0.5);opacity:0}10%{opacity:1}100%{transform:scale(2.0);opacity:1}}
    @keyframes assaultRingA{0%{transform:translate(-50%,-50%) scale(.2);opacity:1}100%{transform:translate(-50%,-50%) scale(3.5);opacity:0}}
    @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    .mg-hdr{position:relative;overflow:hidden}
    .mg-hdr::after{content:'';position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,transparent 0px,transparent 3px,rgba(59,130,246,.04) 3px,rgba(59,130,246,.04) 4px);animation:scanDrift 6s linear infinite}
    .mg-btn{background:rgba(9,20,38,.88)!important;border:2px solid #172848!important;color:#e2e8f0!important;transition:all .2s!important;border-radius:14px!important}
    .mg-btn:hover{border-color:#3b82f6!important;background:rgba(29,58,138,.45)!important;box-shadow:0 0 22px rgba(59,130,246,.45)!important}
    .mg-btn:active{transform:scale(.95)}
    .mg-btn:disabled{opacity:.35!important;cursor:not-allowed!important;pointer-events:none!important}
    .mg-inp:focus{border-color:#3b82f6!important;box-shadow:0 0 0 3px rgba(59,130,246,.25),0 0 20px rgba(59,130,246,.2)!important}
`;

/* ═══════════════════════════════════════════════════════════════
   BattleGame — 外層路由（選單 / 等待室 / 結算）
   ── 所有 Firebase 邏輯完全保留，僅改視覺 ──
═══════════════════════════════════════════════════════════════ */
function BattleGame({ onBack, wordDatabase, dbRef, user, settings }) {
    const [view,          setView]          = useState('menu');
    const [playerName,    setPlayerName]    = useState('');
    const [roomCodeInput, setRoomCodeInput] = useState('');
    const [roomData,      setRoomData]      = useState(null);
    const [errorMsg,      setErrorMsg]      = useState('');

    /* 選單星空（固定 60 顆） */
    const menuStars = useMemo(() =>
        Array.from({ length: 60 }, (_, i) => ({
            id: i, x: Math.random() * 100, y: Math.random() * 100,
            size: Math.random() * 2 + 0.4, dur: Math.random() * 4 + 2, delay: Math.random() * 8
        })), []);

    /* ── Firebase 房間監聽（完全保留原版） ── */
    useEffect(() => {
        if (!roomData?.id || !dbRef) return;
        const unsubscribe = dbRef.collection('rooms').doc(roomData.id).onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                setRoomData({ id: doc.id, ...data });
                if (data.status === 'playing'  && view !== 'playing') setView('playing');
                if (data.status === 'finished' && view !== 'result')  setView('result');
                if (data.status === 'playing' && data.hostId === user.uid) {
                    const players    = Object.values(data.players || {});
                    const aliveCount = players.filter(p => !p.isDead).length;
                    if ((players.length > 1 && aliveCount <= 1) || (players.length === 1 && aliveCount === 0)) {
                        dbRef.collection('rooms').doc(doc.id).update({ status: 'finished' }).catch(() => {});
                    }
                }
            } else {
                alert('房間已關閉或解散！Room closed.');
                onBack();
            }
        });
        return () => unsubscribe();
    }, [roomData?.id, dbRef, view, onBack, user.uid]);

    /* ── Room 操作（完全保留原版） ── */
    const handleCreateRoom = async () => {
        if (!isValidName(playerName)) return setErrorMsg('請輸入 1~6 字有效暱稱 / Enter valid nickname (1-6 chars)');
        if (!settings?.selectedUnits || settings.selectedUnits.length === 0) return setErrorMsg('請先回到主畫面勾選對戰單字範圍！');
        if (!dbRef || !user) return setErrorMsg('無法連接伺服器 / Cannot connect to server');
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
        } catch (e) { setErrorMsg('建立房間失敗 / Failed to create room'); }
    };

    const handleJoinRoom = async () => {
        if (!isValidName(playerName)) return setErrorMsg('請輸入 1~6 字有效暱稱 / Enter valid nickname (1-6 chars)');
        if (roomCodeInput.length !== 4) return setErrorMsg('請輸入 4 位數房號 / Enter 4-digit room code');
        if (!dbRef || !user) return setErrorMsg('無法連接伺服器 / Cannot connect to server');
        setErrorMsg('');
        try {
            const snapshot = await dbRef.collection('rooms').where('code', '==', roomCodeInput).get();
            if (snapshot.empty) return setErrorMsg('找不到該房間代碼 / Room code not found');
            const roomDoc = snapshot.docs[0];
            const data    = roomDoc.data();
            const playersArr        = Object.entries(data.players || {});
            const existingPlayerKey = playersArr.find(([uid, p]) => p.name === playerName.trim());
            if (existingPlayerKey) {
                const oldUid    = existingPlayerKey[0];
                const oldStatus = existingPlayerKey[1];
                if (oldUid !== user.uid) {
                    await dbRef.collection('rooms').doc(roomDoc.id).update({
                        [`players.${oldUid}`]:    firebase.firestore.FieldValue.delete(),
                        [`players.${user.uid}`]:  { ...oldStatus, isDead: false }
                    });
                }
                setRoomData({ id: roomDoc.id, ...data });
                setView(data.status === 'playing' ? 'playing' : 'waiting');
                return;
            }
            if (data.status === 'playing') return setErrorMsg('該對戰已開始，無法加入 / Game already started');
            if (playersArr.length >= 4)    return setErrorMsg('房間已滿 (上限 4 人) / Room full (max 4)');
            await dbRef.collection('rooms').doc(roomDoc.id).update({
                [`players.${user.uid}`]: { name: playerName.trim(), isHost: false, score: 0, lives: 10, isDead: false, combo: 0, horizon: 0, attacks: 0, assaults: 0 }
            });
            setRoomData({ id: roomDoc.id, ...data });
            setView('waiting');
        } catch (e) { setErrorMsg('加入房間失敗 / Failed to join room'); }
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

    /* ── 共用樣式 ── */
    const spaceWrap = {
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        minHeight:'100dvh', padding:24, position:'relative', overflow:'hidden',
        background:'radial-gradient(ellipse at 50% 40%, #0d1e40 0%, #080c1a 70%)'
    };
    const spaceCard = {
        position:'relative', zIndex:1, background:'linear-gradient(160deg,#0d1b38,#060d1f)',
        border:'1px solid #1e3a8a', borderRadius:24, padding:32,
        maxWidth:420, width:'100%', textAlign:'center',
        boxShadow:'0 0 60px rgba(59,130,246,.1),0 24px 64px rgba(0,0,0,.6)',
        animation:'fadeIn .5s ease-out'
    };

    /* ═══════════════════════════════════════
       選單畫面
    ═══════════════════════════════════════ */
    if (view === 'menu') return (
        <div style={spaceWrap}>
            <style dangerouslySetInnerHTML={{ __html: SPACE_CSS }} />
            {menuStars.map(s => (
                <div key={s.id} style={{ position:'fixed', top:`${s.y}%`, left:`${s.x}%`, width:`${s.size}px`, height:`${s.size}px`, borderRadius:'50%', background:'white', pointerEvents:'none', zIndex:0, animation:`twinkle ${s.dur}s ${s.delay}s ease-in-out infinite` }} />
            ))}
            <div style={spaceCard}>
                <div style={{ width:84, height:84, margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                    <div style={{ position:'absolute', width:72, height:72, borderRadius:'50%', background:'radial-gradient(circle,rgba(239,68,68,.5) 0%,transparent 70%)', filter:'blur(8px)' }} />
                    <i className="fa-solid fa-fire-flame-curved" style={{ fontSize:44, color:'#ef4444', filter:'drop-shadow(0 0 16px rgba(239,68,68,.85))', position:'relative', zIndex:1 }}></i>
                </div>
                <h2 style={{ fontSize:26, fontWeight:900, color:'#e2e8f0', marginBottom:4, letterSpacing:2 }}>星際連線對戰</h2>
                <p style={{ color:'#475569', fontSize:12, marginBottom:20, letterSpacing:1 }}>Interstellar Battle Mode</p>
                <input
                    type="text" value={playerName} onChange={e => setPlayerName(e.target.value)}
                    placeholder="指揮官代號 / Commander ID"
                    className="mg-inp"
                    style={{ width:'100%', padding:'13px', borderRadius:12, border:'2px solid #1e3a8a', background:'rgba(4,8,20,.9)', color:'#e2e8f0', outline:'none', textAlign:'center', fontWeight:700, fontSize:15, marginBottom:14, boxSizing:'border-box', transition:'border-color .2s,box-shadow .2s', caretColor:'#60a5fa' }}
                />
                {errorMsg && <p style={{ color:'#f87171', fontWeight:700, fontSize:13, marginBottom:10 }}>{errorMsg}</p>}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                    <button onClick={handleCreateRoom} className="mg-btn" style={{ padding:'14px 8px', fontWeight:900, fontSize:14, cursor:'pointer' }}>
                        <i className="fa-solid fa-plus" style={{ marginRight:6 }}></i>創建房間<br/>
                        <span style={{ fontSize:10, fontWeight:400, opacity:.6 }}>Create Room</span>
                    </button>
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                        <input
                            type="text" maxLength="4" value={roomCodeInput}
                            onChange={e => setRoomCodeInput(e.target.value.replace(/\D/g, ''))}
                            placeholder="房號 Code"
                            className="mg-inp"
                            style={{ padding:'9px', borderRadius:10, border:'2px solid #1e3a8a', background:'rgba(4,8,20,.9)', color:'#e2e8f0', outline:'none', textAlign:'center', fontWeight:900, fontSize:18, letterSpacing:4, transition:'border-color .2s,box-shadow .2s', caretColor:'#60a5fa' }}
                        />
                        <button onClick={handleJoinRoom} className="mg-btn" style={{ padding:'9px', fontWeight:900, fontSize:13, cursor:'pointer' }}>
                            加入 / 重連
                        </button>
                    </div>
                </div>
                <button onClick={onBack} style={{ width:'100%', marginTop:4, padding:'11px', color:'#475569', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>
                    ← 返回基地 / Back to Base
                </button>
            </div>
        </div>
    );

    /* ═══════════════════════════════════════
       等待室
    ═══════════════════════════════════════ */
    if (view === 'waiting') {
        const playersList = roomData?.players ? Object.values(roomData.players) : [];
        const isHost      = roomData?.hostId === user?.uid;
        const canStart    = playersList.length >= 2;
        return (
            <div style={spaceWrap}>
                <style dangerouslySetInnerHTML={{ __html: SPACE_CSS }} />
                {menuStars.map(s => (
                    <div key={s.id} style={{ position:'fixed', top:`${s.y}%`, left:`${s.x}%`, width:`${s.size}px`, height:`${s.size}px`, borderRadius:'50%', background:'white', pointerEvents:'none', zIndex:0, animation:`twinkle ${s.dur}s ${s.delay}s ease-in-out infinite` }} />
                ))}
                <div style={spaceCard}>
                    <p style={{ color:'#475569', fontSize:11, marginBottom:6, letterSpacing:2 }}>ROOM CODE / 房間代碼</p>
                    <div style={{ fontSize:48, fontWeight:900, color:'#e2e8f0', letterSpacing:'0.25em', marginBottom:20, background:'rgba(4,8,20,.8)', padding:'14px 20px', borderRadius:16, border:'1px solid #1e3a8a', boxShadow:'inset 0 0 20px rgba(59,130,246,.08)', fontFamily:'"Courier New",monospace' }}>
                        {roomData?.code}
                    </div>
                    <p style={{ textAlign:'left', fontWeight:700, color:'#475569', marginBottom:10, fontSize:13 }}>
                        <i className="fa-solid fa-users" style={{ marginRight:6, color:'#3b82f6' }}></i>
                        已加入玩家 Players ({playersList.length}/4)
                    </p>
                    <div style={{ minHeight:140, marginBottom:20, display:'flex', flexDirection:'column', gap:8 }}>
                        {playersList.map((p, i) => (
                            <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(14,26,60,.8)', border:'1px solid #1e3a8a', borderRadius:12, padding:'10px 14px' }}>
                                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                    <span style={{ fontSize:20 }}>{p.isHost ? '👑' : '🚀'}</span>
                                    <div style={{ textAlign:'left' }}>
                                        <div style={{ fontWeight:700, fontSize:15, color:'#e2e8f0' }}>{p.name}</div>
                                        <div style={{ fontSize:10, color:'#475569' }}>{p.isHost ? 'Host / 房主' : 'Player / 玩家'}</div>
                                    </div>
                                </div>
                                <div style={{ width:8, height:8, borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 8px rgba(34,197,94,.8)' }} />
                            </div>
                        ))}
                    </div>
                    {isHost ? (
                        <button
                            onClick={handleStartGame} disabled={!canStart}
                            style={{ width:'100%', padding:'15px', background: canStart ? 'linear-gradient(135deg,#dc2626,#f97316)' : 'rgba(14,26,60,.8)', border: canStart ? 'none' : '1px solid #1e3a8a', borderRadius:14, color:'white', fontWeight:900, fontSize:17, cursor: canStart ? 'pointer' : 'default', boxShadow: canStart ? '0 0 28px rgba(239,68,68,.4)' : 'none', marginBottom:10, transition:'all .2s', opacity: canStart ? 1 : 0.5 }}
                        >
                            <i className={`fa-solid ${canStart ? 'fa-rocket' : 'fa-spinner fa-spin'}`} style={{ marginRight:8, transform: canStart ? 'rotate(-45deg)' : 'none', display:'inline-block' }}></i>
                            {canStart ? '開始對戰！ Start Battle!' : '等待對手加入… Waiting…'}
                        </button>
                    ) : (
                        <div style={{ width:'100%', padding:'15px', background:'rgba(14,26,60,.8)', border:'1px solid #1e3a8a', borderRadius:14, color:'#93c5fd', fontWeight:700, fontSize:16, textAlign:'center', marginBottom:10 }}>
                            <i className="fa-solid fa-spinner fa-spin" style={{ marginRight:8 }}></i>等待房主開始 / Waiting for host…
                        </div>
                    )}
                    <button onClick={handleLeaveRoom} style={{ width:'100%', padding:'10px', color:'#475569', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>
                        離開房間 / Leave Room
                    </button>
                </div>
            </div>
        );
    }

    /* ═══════════════════════════════════════
       對戰競技場
    ═══════════════════════════════════════ */
    if (view === 'playing') return <BattleArena roomData={roomData} dbRef={dbRef} user={user} wordDatabase={wordDatabase} />;

    /* ═══════════════════════════════════════
       結算畫面
    ═══════════════════════════════════════ */
    if (view === 'result') {
        const ranks = Object.values(roomData.players || {}).map(p => ({
            ...p, finalScore: (p.score || 0) + ((p.lives || 0) * 10)
        })).sort((a, b) => {
            if (a.isDead !== b.isDead) return a.isDead ? 1 : -1;
            return b.finalScore - a.finalScore;
        });
        const rankIcons = ['🥇','🥈','🥉','🏅'];
        return (
            <div style={spaceWrap}>
                <style dangerouslySetInnerHTML={{ __html: SPACE_CSS }} />
                {menuStars.map(s => (
                    <div key={s.id} style={{ position:'fixed', top:`${s.y}%`, left:`${s.x}%`, width:`${s.size}px`, height:`${s.size}px`, borderRadius:'50%', background:'white', pointerEvents:'none', zIndex:0, animation:`twinkle ${s.dur}s ${s.delay}s ease-in-out infinite` }} />
                ))}
                <div style={spaceCard}>
                    <i className="fa-solid fa-trophy" style={{ fontSize:52, color:'#fbbf24', display:'block', marginBottom:16, filter:'drop-shadow(0 0 18px rgba(251,191,36,.8))' }}></i>
                    <h2 style={{ fontSize:24, fontWeight:900, color:'#e2e8f0', marginBottom:4, letterSpacing:2 }}>對戰結算</h2>
                    <p style={{ color:'#475569', fontSize:11, marginBottom:20, letterSpacing:2 }}>Battle Results</p>
                    <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
                        {ranks.map((p, i) => (
                            <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderRadius:14, border: p.isDead ? '1px solid #1e2a3a' : i === 0 ? '1px solid rgba(251,191,36,.5)' : '1px solid #1e3a8a', background: p.isDead ? 'rgba(4,8,20,.4)' : i === 0 ? 'rgba(251,191,36,.08)' : 'rgba(14,26,60,.8)', opacity: p.isDead ? 0.5 : 1 }}>
                                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                    <span style={{ fontSize:20 }}>{rankIcons[i] || '🏅'}</span>
                                    <div style={{ textAlign:'left' }}>
                                        <div style={{ fontWeight:700, color: p.isDead ? '#475569' : '#e2e8f0', fontSize:15 }}>
                                            {p.name}
                                            {p.isDead && <span style={{ fontSize:10, background:'rgba(127,29,29,.8)', color:'#f87171', border:'1px solid #7f1d1d', borderRadius:4, padding:'1px 5px', marginLeft:6, fontWeight:700 }}>OUT</span>}
                                        </div>
                                        <div style={{ fontSize:11, color:'#475569' }}>❤️ {p.lives}×10 + ⭐ {p.score}</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: i === 0 ? 22 : 18, fontWeight:900, color: p.isDead ? '#334155' : i === 0 ? '#fbbf24' : '#93c5fd', textShadow: i === 0 && !p.isDead ? '0 0 12px rgba(251,191,36,.6)' : 'none' }}>
                                    {p.finalScore}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={onBack} style={{ width:'100%', padding:'14px', background:'rgba(14,26,60,.8)', border:'1px solid #1e3a8a', color:'#93c5fd', borderRadius:14, fontWeight:700, fontSize:16, cursor:'pointer' }}>
                        返回太空基地 / Return to Base
                    </button>
                </div>
            </div>
        );
    }
}

/* ═══════════════════════════════════════════════════════════════
   BattleArena — 對戰競技場
   ── Firebase 邏輯完全保留；視覺移植自單人版太空主題 ──
═══════════════════════════════════════════════════════════════ */
function BattleArena({ roomData, dbRef, user, wordDatabase }) {

    /* ── 遊戲狀態（保留原版） ── */
    const [queue,            setQueue]            = useState([]);
    const [currentMeteor,    setCurrentMeteor]    = useState(null);
    const [options,          setOptions]          = useState([]);
    const [timeLeft,         setTimeLeft]         = useState(180);
    const [myState,          setMyState]          = useState(() => {
        const existing = roomData?.players?.[user.uid];
        return existing ? { ...existing } : { score: 0, lives: 10, isDead: false, combo: 0, horizon: 0, attacks: 0, assaults: 0 };
    });
    const [prevTotalAttacks, setPrevTotalAttacks] = useState(0);
    const [prevAssaults,     setPrevAssaults]     = useState({});
    const [assaultMeteors,   setAssaultMeteors]   = useState([]);

    /* ── 視覺狀態（新增） ── */
    const [groundExplosion, setGroundExplosion] = useState(null);
    const [ufoVisible,      setUfoVisible]      = useState(false);
    const [ufoType,         setUfoType]         = useState(0);
    const [ufoPhase,        setUfoPhase]        = useState('moving');
    const [satVisible,      setSatVisible]      = useState(false);
    const [satType,         setSatType]         = useState(0);
    const [shootingStars,   setShootingStars]   = useState([]);

    /* ── DOM Refs ── */
    const meteorRef    = useRef(null);
    const containerRef = useRef(null);

    /* ── UFO Refs（與單人版相同） ── */
    const ufoRef           = useRef(null);
    const ufoPosRef        = useRef({ x:50, y:20, dx:0.045, dy:0.018 });
    const ufoPhaseRef      = useRef('moving');
    const ufoClickRef      = useRef(0);
    const ufoClickTimerRef = useRef(null);
    const ufoRafRef        = useRef(null);

    /* ── 衛星 Refs ── */
    const satRef         = useRef(null);
    const satProgressRef = useRef(0);
    const satRafRef      = useRef(null);
    const satConfigRef   = useRef({ startY:20, apexY:12 });

    /* ── 固定星空（130 顆，useMemo 避免閃爍） ── */
    const stars = useMemo(() =>
        Array.from({ length: 130 }, (_, i) => ({
            id: i, x: Math.random() * 100, y: Math.random() * 88,
            size: Math.random() * 2.2 + 0.4, dur: Math.random() * 4 + 2, delay: Math.random() * 8
        })), []);

    /* ═══════════════════════════════════════════════
       遊戲邏輯 useEffects（全數保留原版，僅 handleShoot 有修改）
    ═══════════════════════════════════════════════ */

    /* 詞庫初始化 */
    useEffect(() => {
        const allowedUnits = roomData?.selectedUnits || [];
        let filtered = wordDatabase.filter(w => allowedUnits.includes(`${w.book}-${w.lesson}`));
        if (filtered.length === 0) filtered = wordDatabase;
        let repeatedDb = [];
        while (repeatedDb.length < 150) repeatedDb = [...repeatedDb, ...[...filtered].sort(() => 0.5 - Math.random())];
        setQueue(repeatedDb);
    }, [wordDatabase, roomData?.selectedUnits]);

    /* 地平線攻擊監聽（保留：每次被攻擊 +3%，最高 30%） */
    useEffect(() => {
        if (!roomData?.players) return;
        let currentTotalAttacks = 0;
        Object.keys(roomData.players).forEach(uid => {
            if (uid !== user.uid) currentTotalAttacks += (roomData.players[uid].attacks || 0);
        });
        if (currentTotalAttacks > prevTotalAttacks && !myState.isDead) {
            const incomingHits = currentTotalAttacks - prevTotalAttacks;
            setMyState(prev => ({ ...prev, horizon: Math.min(30, prev.horizon + (3 * incomingHits)) }));
            soundEngine.wrong();
            if (containerRef.current) {
                containerRef.current.classList.add('animate-[shake_0.5s_ease-in-out]');
                setTimeout(() => containerRef.current?.classList.remove('animate-[shake_0.5s_ease-in-out]'), 500);
            }
        }
        setPrevTotalAttacks(currentTotalAttacks);
    }, [roomData, user.uid, myState.isDead]);

    /* 突擊隕石監聽（保留） */
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
                    for (let i = 0; i < (currentAssaults[uid] - prevCount); i++) {
                        incomingMeteors.push({ id: Math.random().toString(), senderName: p.name, clicksLeft: 3, createdAt: performance.now(), x: 15 + Math.random() * 65, y: 8 + Math.random() * 15 });
                    }
                }
            }
        });
        if (incomingMeteors.length > 0) { setAssaultMeteors(prev => [...prev, ...incomingMeteors]); soundEngine.wrong(); }
        setPrevAssaults(currentAssaults);
    }, [roomData, user.uid, myState.isDead]);

    /* 突擊隕石計時器（保留） */
    useEffect(() => {
        if (assaultMeteors.length === 0 || myState.isDead) return;
        let animationFrameId;
        const checkAssaultTimers = (now) => {
            let missedCount = 0;
            setAssaultMeteors(prev => {
                const remaining = [];
                prev.forEach(m => { if (now - m.createdAt > 5000) missedCount++; else remaining.push(m); });
                return remaining;
            });
            if (missedCount > 0) { for (let i = 0; i < missedCount; i++) handleAssaultMiss(); }
            else animationFrameId = requestAnimationFrame(checkAssaultTimers);
        };
        animationFrameId = requestAnimationFrame(checkAssaultTimers);
        return () => cancelAnimationFrame(animationFrameId);
    }, [assaultMeteors, myState.isDead]);

    /* Firebase 同步（保留） */
    useEffect(() => {
        if (!dbRef || !user || !roomData?.id) return;
        dbRef.collection('rooms').doc(roomData.id).update({ [`players.${user.uid}`]: myState }).catch(() => {});
    }, [myState.score, myState.lives, myState.combo, myState.horizon, myState.attacks, myState.assaults, myState.isDead]);

    /* 倒計時（保留） */
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1 && roomData.hostId === user.uid) {
                    dbRef.collection('rooms').doc(roomData.id).update({ status: 'finished' }).catch(() => {});
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, roomData.hostId, roomData.id, dbRef, user.uid]);

    /* ═══════════════════════════════════════════════
       視覺 FX useEffects（新增，與單人版相同）
    ═══════════════════════════════════════════════ */

    /* 地面爆炸偵測 */
    useEffect(() => {
        if (!currentMeteor?.isExploding) return;
        const top = parseFloat(meteorRef.current?.style.top ?? '0');
        if (top > 35) {
            setGroundExplosion({ id: Date.now(), x: currentMeteor.x, top });
            setTimeout(() => setGroundExplosion(null), 1200);
        }
    }, [currentMeteor?.isExploding]);

    /* UFO 出現計時器 */
    useEffect(() => {
        if (myState.isDead || ufoVisible) return;
        const delay = 8000 + Math.random() * 8000;
        const t = setTimeout(() => {
            const rawDx = (Math.random() - 0.5) * 0.08;
            ufoPosRef.current = { x: 15 + Math.random() * 70, y: 8 + Math.random() * 22, dx: Math.abs(rawDx) < 0.015 ? 0.04 : rawDx, dy: (Math.random() - 0.5) * 0.025 };
            ufoPhaseRef.current = 'moving';
            ufoClickRef.current = 0;
            setUfoType(Math.floor(Math.random() * 3));
            setUfoPhase('moving');
            setUfoVisible(true);
        }, delay);
        return () => clearTimeout(t);
    }, [myState.isDead, ufoVisible]);

    /* UFO 離場動畫（useCallback，分數同步 Firebase） */
    const fleeUfo = useCallback((scored) => {
        cancelAnimationFrame(ufoRafRef.current);
        clearTimeout(ufoClickTimerRef.current);
        ufoPhaseRef.current = 'fleeing';
        setUfoPhase('fleeing');
        if (scored) setMyState(s => ({ ...s, score: s.score + 1 })); /* UFO 分數計入 Firebase */
        const p  = ufoPosRef.current;
        const dx = p.x - 50, dy = p.y - 100;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const tx = p.x + (dx / len) * 200, ty = p.y + (dy / len) * 200;
        if (ufoRef.current) {
            ufoRef.current.style.transition = 'left .75s ease-in,top .75s ease-in,opacity .75s ease-in,transform .75s ease-in';
            ufoRef.current.style.left      = `${tx}%`;
            ufoRef.current.style.top       = `${ty}%`;
            ufoRef.current.style.opacity   = '0';
            ufoRef.current.style.transform = 'translate(-50%,-50%) scale(.05)';
        }
        setTimeout(() => {
            setUfoVisible(false);
            if (ufoRef.current) { ufoRef.current.style.transition = ''; ufoRef.current.style.opacity = '1'; ufoRef.current.style.transform = 'translate(-50%,-50%)'; }
        }, 820);
    }, []);

    /* UFO 移動 RAF */
    useEffect(() => {
        if (!ufoVisible || myState.isDead) return;
        const autoDismiss = setTimeout(() => { if (ufoPhaseRef.current === 'moving') fleeUfo(false); }, 20000 + Math.random() * 8000);
        const animate = () => {
            if (ufoPhaseRef.current === 'moving') {
                const p = ufoPosRef.current;
                p.x += p.dx; p.y += p.dy;
                if (p.x < 4)  { p.x = 4;  p.dx =  Math.abs(p.dx); }
                if (p.x > 96) { p.x = 96; p.dx = -Math.abs(p.dx); }
                if (p.y < 5)  { p.y = 5;  p.dy =  Math.abs(p.dy); }
                if (p.y > 44) { p.y = 44; p.dy = -Math.abs(p.dy); }
                if (ufoRef.current) { ufoRef.current.style.left = `${p.x}%`; ufoRef.current.style.top = `${p.y}%`; }
            }
            ufoRafRef.current = requestAnimationFrame(animate);
        };
        ufoRafRef.current = requestAnimationFrame(animate);
        return () => { cancelAnimationFrame(ufoRafRef.current); clearTimeout(autoDismiss); };
    }, [ufoVisible, myState.isDead, fleeUfo]);

    /* UFO 點擊處理（useCallback） */
    const handleUfoClick = useCallback((e) => {
        e.stopPropagation();
        if (ufoPhaseRef.current === 'fleeing') return;
        const inner = ufoRef.current?.querySelector('.ufo-inner');
        if (inner) { inner.classList.remove('ufo-hit'); void inner.offsetWidth; inner.classList.add('ufo-hit'); }
        if (ufoPhaseRef.current === 'moving') {
            ufoPhaseRef.current = 'frozen'; setUfoPhase('frozen'); ufoClickRef.current = 1;
            ufoClickTimerRef.current = setTimeout(() => fleeUfo(false), 3000);
        } else if (ufoPhaseRef.current === 'frozen') {
            ufoClickRef.current += 1;
            if (ufoClickRef.current >= 5) fleeUfo(true);
        }
    }, [fleeUfo]);

    /* 衛星出現計時器 */
    useEffect(() => {
        if (myState.isDead || satVisible) return;
        const t = setTimeout(() => {
            const startY = 12 + Math.random() * 22;
            satConfigRef.current = { startY, apexY: startY - 5 - Math.random() * 9 };
            satProgressRef.current = 0;
            setSatType(Math.floor(Math.random() * 3));
            setSatVisible(true);
        }, 20000 + Math.random() * 20000);
        return () => clearTimeout(t);
    }, [myState.isDead, satVisible]);

    /* 衛星弧線 RAF */
    useEffect(() => {
        if (!satVisible) return;
        const speed = 0.00048 + Math.random() * 0.00032;
        const animate = () => {
            satProgressRef.current += speed;
            if (satProgressRef.current >= 1) { setSatVisible(false); return; }
            const t2 = satProgressRef.current;
            const { startY, apexY } = satConfigRef.current;
            const x = (1-t2)*(1-t2)*108 + 2*(1-t2)*t2*50 + t2*t2*(-8);
            const y = (1-t2)*(1-t2)*startY + 2*(1-t2)*t2*apexY + t2*t2*startY;
            if (satRef.current) { satRef.current.style.left = `${x}%`; satRef.current.style.top = `${y}%`; }
            satRafRef.current = requestAnimationFrame(animate);
        };
        satRafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(satRafRef.current);
    }, [satVisible]);

    /* 流星雨 */
    useEffect(() => {
        if (myState.isDead) return;
        const interval = setInterval(() => {
            setShootingStars(prev => {
                if (prev.length >= 3) return prev;
                const id = Date.now() + Math.random();
                const angle = 25 + Math.random() * 130;
                const x = 5 + Math.random() * 75, y = 3 + Math.random() * 38;
                const dur = 0.35 + Math.random() * 0.55;
                setTimeout(() => setShootingStars(ps => ps.filter(s => s.id !== id)), (dur + 0.5) * 1000);
                return [...prev, { id, x, y, angle, dur }];
            });
        }, 2800);
        return () => clearInterval(interval);
    }, [myState.isDead]);

    /* 陣亡後清理視覺 FX */
    useEffect(() => {
        if (!myState.isDead) return;
        cancelAnimationFrame(ufoRafRef.current);
        cancelAnimationFrame(satRafRef.current);
        clearTimeout(ufoClickTimerRef.current);
        setUfoVisible(false); setSatVisible(false); setShootingStars([]);
    }, [myState.isDead]);

    /* ═══════════════════════════════════════════════
       隕石產生 & 兩段式落下物理
    ═══════════════════════════════════════════════ */
    const generateOptions = (word) => {
        let pool = wordDatabase.map(w => w.zh).filter(a => a !== word.zh);
        pool = [...new Set(pool)].sort(() => 0.5 - Math.random()).slice(0, 3);
        setOptions([...pool, word.zh].map(opt => ({ text: opt, isCorrect: opt === word.zh, id: Math.random() })).sort(() => 0.5 - Math.random()));
    };

    const spawnMeteor = (wordObj) => {
        // 基礎時間從 6.5 → 9.0 秒：初速與末速同步減緩
        // horizon 最高 30% 時扣減 1.8s，保證仍有 ≥ 7.2s 反應時間（最低 3.5s）
        const dropDuration = Math.max(3.5, 9.0 - (myState.horizon * 0.06));
        setCurrentMeteor({ wordObj, x: 10 + Math.random() * 80, duration: dropDuration, isExploding: false, startTime: performance.now() });
        playAudio(wordObj.en);
    };

    /* 隕石自動生成 */
    useEffect(() => {
        if (queue.length > 0 && !currentMeteor && !myState.isDead) {
            generateOptions(queue[0]);
            spawnMeteor(queue[0]);
        }
    }, [queue, currentMeteor, myState.isDead]);

    /* 兩段式落下 RAF（同單人版物理，bottomLimit 隨 horizon 動態調整）
       Phase 1（前 62.5%）：等速  -15% → 25%（初速緩慢，連接流暢）
       Phase 2（後 37.5%）：加速  25% → bottomLimit
         加速係數 a = 24/range2，保證 Phase1/2 銜接處速度完全連續
    */
    useEffect(() => {
        if (!currentMeteor || currentMeteor.isExploding || myState.isDead) return;
        let animationFrameId;
        const drop = (now) => {
            const elapsed  = (now - currentMeteor.startTime) / 1000;
            const progress = Math.min(elapsed / currentMeteor.duration, 1);

            const ph1Dur      = currentMeteor.duration / 1.6;
            const ph2Dur      = currentMeteor.duration - ph1Dur;
            const bottomLimit = 82 - myState.horizon;
            let   currentY;

            if (elapsed <= ph1Dur) {
                const p1 = elapsed / ph1Dur;
                currentY = -15 + p1 * 40;                            // 等速：-15% → 25%
            } else {
                const p2     = Math.min((elapsed - ph1Dur) / ph2Dur, 1);
                const range2 = Math.max(1, bottomLimit - 25);
                const a      = 24 / range2;                           // 連續速度係數（數學推導）
                const b      = 1 - a;
                const ep2    = a * p2 + b * p2 * p2;                 // 平滑加速
                currentY     = 25 + ep2 * range2;                    // 加速：25% → bottomLimit
            }

            if (meteorRef.current) meteorRef.current.style.top = `${currentY}%`;
            if (progress >= 1) handleMiss();
            else animationFrameId = requestAnimationFrame(drop);
        };
        animationFrameId = requestAnimationFrame(drop);
        return () => cancelAnimationFrame(animationFrameId);
    }, [currentMeteor, myState.isDead, myState.horizon]);

    /* ═══════════════════════════════════════════════
       答題邏輯（handleShoot 修改，其餘保留）
    ═══════════════════════════════════════════════ */
    const handleMiss = () => {
        soundEngine.wrong();
        if (containerRef.current) {
            containerRef.current.classList.add('animate-[shake_0.5s_ease-in-out]');
            setTimeout(() => containerRef.current?.classList.remove('animate-[shake_0.5s_ease-in-out]'), 500);
        }
        setCurrentMeteor(prev => ({ ...prev, isExploding: true }));
        setMyState(prev => { const newLives = prev.lives - 1; return { ...prev, lives: newLives, combo: 0, isDead: newLives <= 0 }; });
        setTimeout(nextTurn, 500);
    };

    const handleAssaultMiss = () => {
        soundEngine.explosion();
        if (containerRef.current) {
            containerRef.current.classList.add('animate-[shake_0.5s_ease-in-out]');
            setTimeout(() => containerRef.current?.classList.remove('animate-[shake_0.5s_ease-in-out]'), 500);
        }
        setMyState(prev => { const newLives = prev.lives - 1; return { ...prev, lives: newLives, combo: 0, isDead: newLives <= 0 }; });
    };

    const handleAssaultClick = (id, e) => {
        e.stopPropagation();
        if (myState.isDead) return;
        soundEngine.laser();
        setAssaultMeteors(prev => prev.map(m => {
            if (m.id === id) {
                const newClicks = m.clicksLeft - 1;
                if (newClicks <= 0) { soundEngine.win(); setMyState(s => ({ ...s, score: s.score + 5 })); return null; }
                return { ...m, clicksLeft: newClicks };
            }
            return m;
        }).filter(Boolean));
    };

    const handleShoot = (opt) => {
        if (!currentMeteor || currentMeteor.isExploding || myState.isDead) return;
        if (opt.isCorrect) {
            soundEngine.laser();
            soundEngine.explosion();
            setCurrentMeteor(prev => ({ ...prev, isExploding: true }));
            if (meteorRef.current && containerRef.current) {
                const rect = meteorRef.current.getBoundingClientRect();
                confetti({ particleCount: 35, spread: 58, origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight }, colors: ['#f87171','#fbbf24','#facc15'] });
            }
            const elapsed    = (performance.now() - currentMeteor.startTime) / 1000;
            const speedBonus = elapsed < (currentMeteor.duration * 0.4) ? 2 : 0;

            setMyState(prev => {
                let newCombo    = prev.combo + 1;
                let newHorizon  = Math.max(0, prev.horizon - 1);   // ✅ 每答對 -1%（地平線小降）
                let newAttacks  = prev.attacks;
                let newAssaults = prev.assaults || 0;
                let extraScore  = 0;

                if (newCombo === 3) {
                    newAttacks += 1;
                    newHorizon  = Math.max(0, newHorizon - 12);    // ✅ Combo-3 額外 -12%（共 -13%，遠超對手 3 次攻擊 +9%）
                    extraScore  = 5;
                } else if (newCombo === 5) {
                    newAssaults += 1;
                    extraScore   = 15;
                    newCombo     = 0;
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

    /* ── 其他玩家資料 ── */
    const otherPlayers = Object.values(roomData.players || {}).filter(p => p.name !== myState.name);

    /* ═══════════════════════════════════════════════
       Render
    ═══════════════════════════════════════════════ */
    return (
        <div style={{ width:'100%', height:'100dvh', display:'flex', flexDirection:'column', overflow:'hidden', userSelect:'none', touchAction:'none', background:'#080c1a' }}>
            <style dangerouslySetInnerHTML={{ __html: SPACE_CSS }} />

            {/* ─────────── 艦橋標題列 ─────────── */}
            <header className="mg-hdr" style={{ flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 12px', zIndex:40, background:'linear-gradient(90deg,#03060f 0%,#091426 50%,#03060f 100%)', borderBottom:'1px solid #1e3a8a', boxShadow:'0 2px 24px rgba(59,130,246,.18)' }}>

                {/* 計時器 + 房號 */}
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', background:'rgba(9,20,38,.9)', border:'1px solid #1e3a8a', borderRadius:10, padding:'4px 11px' }}>
                    <span style={{ color:'#e2e8f0', fontFamily:'"Courier New",monospace', fontWeight:900, fontSize:17, lineHeight:1 }}>
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                    <span style={{ color:'#fbbf24', fontSize:9, fontWeight:900, letterSpacing:2, marginTop:2 }}>
                        ROOM {roomData?.code}
                    </span>
                </div>

                {/* 其他玩家狀態 */}
                {otherPlayers.map((p, i) => (
                    <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'2px 6px', opacity: p.isDead ? 0.3 : 1, filter: p.isDead ? 'grayscale(1)' : 'none', transition:'all .3s' }}>
                        <span style={{ fontSize:11, fontWeight:700, color:'#94a3b8', maxWidth:70, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</span>
                        <div style={{ display:'flex', gap:8, marginTop:2 }}>
                            <span style={{ color:'#ef4444', fontSize:11, fontWeight:700 }}><i className="fa-solid fa-heart" style={{ fontSize:9, marginRight:2 }}></i>{p.lives}</span>
                            <span style={{ color:'#60a5fa', fontSize:11, fontWeight:700 }}><i className="fa-solid fa-star" style={{ fontSize:9, marginRight:2 }}></i>{p.score}</span>
                        </div>
                        {/* 地平線進度條（30% 滿載） */}
                        <div style={{ width:56, height:4, background:'rgba(30,58,138,.4)', borderRadius:2, marginTop:3, overflow:'hidden', border:'1px solid rgba(30,58,138,.6)' }}>
                            <div style={{ height:'100%', background:'linear-gradient(90deg,#f97316,#ef4444)', borderRadius:2, transition:'width .3s', width:`${Math.min(100, ((p.horizon || 0) / 30) * 100)}%` }} />
                        </div>
                    </div>
                ))}

                {/* 自己的生命值 */}
                <div style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(9,20,38,.9)', border:'1px solid #1e3a8a', borderRadius:10, padding:'4px 10px' }}>
                    <i className="fa-solid fa-heart" style={{ fontSize:13, color:'#ef4444', filter:'drop-shadow(0 0 4px rgba(239,68,68,.6))' }}></i>
                    <span style={{ color:'#e2e8f0', fontWeight:900, fontSize:15, fontFamily:'"Courier New",monospace' }}>{myState.lives}</span>
                </div>
            </header>

            {/* ─────────── 主遊戲區 ─────────── */}
            <main ref={containerRef} style={{ flex:1, position:'relative', width:'100%', overflow:'hidden', background:'linear-gradient(180deg,#04060e 0%,#080c1a 45%,#0a1020 100%)' }}>

                {/* 固定星空 */}
                {stars.map(s => (
                    <div key={s.id} style={{ position:'absolute', left:`${s.x}%`, top:`${s.y}%`, width:`${s.size}px`, height:`${s.size}px`, borderRadius:'50%', background:'white', pointerEvents:'none', zIndex:0, animation:`twinkle ${s.dur}s ${s.delay}s ease-in-out infinite` }} />
                ))}

                {/* 流星 */}
                {shootingStars.map(s => (
                    <div key={s.id} style={{ position:'absolute', left:`${s.x}%`, top:`${s.y}%`, transform:`rotate(${s.angle}deg)`, transformOrigin:'0 50%', pointerEvents:'none', zIndex:1 }}>
                        <div style={{ width:100, height:2, background:'linear-gradient(90deg,transparent 0%,rgba(255,255,255,.5) 45%,rgba(255,255,255,.95) 82%,white 100%)', borderRadius:2, boxShadow:'0 0 4px 1px rgba(255,255,255,.35)', animation:`ssFly ${s.dur}s ease-out forwards` }} />
                    </div>
                ))}

                {/* 衛星弧線 */}
                {satVisible && (
                    <div ref={satRef} style={{ position:'absolute', left:'108%', top:'20%', transform:'translate(-50%,-50%)', zIndex:2, pointerEvents:'none', opacity:0.72 }}>
                        {SAT_SVGS[satType]}
                    </div>
                )}

                {/* UFO 彩蛋（可點擊，分數計入 Firebase） */}
                {ufoVisible && (
                    <div
                        ref={ufoRef}
                        onClick={handleUfoClick}
                        style={{ position:'absolute', left:`${ufoPosRef.current.x}%`, top:`${ufoPosRef.current.y}%`, transform:'translate(-50%,-50%)', zIndex:3, cursor: ufoPhase === 'fleeing' ? 'default' : 'pointer', pointerEvents: ufoPhase === 'fleeing' ? 'none' : 'auto' }}
                    >
                        <div className={`ufo-inner${ufoPhase === 'frozen' ? ' ufo-wobble' : ''}`} style={{ opacity:0.72, filter: ufoPhase === 'frozen' ? 'drop-shadow(0 0 8px rgba(96,165,250,.55))' : 'none' }}>
                            {UFO_SVGS[ufoType]}
                        </div>
                    </div>
                )}

                {/* 突擊隕石（來自其他玩家的 Combo-5） */}
                {assaultMeteors.map(m => (
                    <div
                        key={m.id}
                        onClick={e => handleAssaultClick(m.id, e)}
                        style={{ position:'absolute', left:`${m.x}%`, top:`${m.y}%`, zIndex:25, display:'flex', flexDirection:'column', alignItems:'center', cursor:'pointer', animation:'growAssault 5s linear forwards' }}
                    >
                        {/* 來源標籤 */}
                        <div style={{ background:'rgba(109,40,217,.9)', color:'white', fontSize:10, fontWeight:900, padding:'2px 8px', borderRadius:999, marginBottom:5, border:'1px solid rgba(167,139,250,.5)', boxShadow:'0 0 12px rgba(139,92,246,.6)', whiteSpace:'nowrap' }}>
                            ⚠️ {m.senderName}
                        </div>
                        {/* 岩石本體（紫色突擊隕石） */}
                        <div style={{ position:'relative', width:56, height:56, display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <div style={{ position:'absolute', top:'50%', left:'50%', width:52, height:52, borderRadius:'50%', border:'2px solid rgba(167,139,250,.7)', animation:'assaultRingA .9s ease-out infinite' }} />
                            <div style={{ position:'relative', width:44, height:44, background:'radial-gradient(circle at 33% 32%,#6b35c4,#3b1686,#1e0a4a)', borderRadius:'46% 54% 62% 38% / 50% 42% 58% 50%', boxShadow:'0 0 22px 7px rgba(139,92,246,.52),inset -4px -4px 10px rgba(0,0,0,.65)', zIndex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <span style={{ color:'white', fontWeight:900, fontSize:18, textShadow:'0 2px 4px rgba(0,0,0,.8)', position:'relative', zIndex:2 }}>{m.clicksLeft}</span>
                                <div style={{ position:'absolute', top:'18%', left:'14%', width:'22%', height:'16%', borderRadius:'50%', background:'rgba(0,0,0,.55)' }} />
                                <div style={{ position:'absolute', top:'55%', left:'60%', width:'16%', height:'12%', borderRadius:'50%', background:'rgba(0,0,0,.4)' }} />
                            </div>
                        </div>
                        {/* 紫色火焰尾跡 */}
                        <div style={{ width:18, height:32, background:'linear-gradient(to top,transparent,rgba(139,92,246,.65),rgba(167,139,250,.35))', borderRadius:'50% 50% 20% 20% / 60% 60% 30% 30%', filter:'blur(4px)', marginTop:-8, opacity:.8 }} />
                    </div>
                ))}

                {/* 地面爆炸（隕石落地時） */}
                {groundExplosion && (
                    <div style={{ position:'absolute', top:`${groundExplosion.top}%`, left:`${groundExplosion.x}%`, zIndex:8, pointerEvents:'none', transform:'translateY(-30px)' }}>
                        <div style={{ position:'relative', width:0, height:0 }}>
                            <div style={{ position:'absolute', bottom:0, left:0, width:90, height:48, background:'radial-gradient(ellipse,rgba(251,146,60,.85) 0%,rgba(239,68,68,.5) 45%,transparent 75%)', filter:'blur(4px)', animation:'groundBlast 1.1s ease-out forwards' }} />
                            <div style={{ position:'absolute', bottom:2, left:0, width:120, height:7, background:'linear-gradient(90deg,transparent,rgba(251,146,60,.55),rgba(251,191,36,.75),rgba(251,146,60,.55),transparent)', borderRadius:4, animation:'groundRing .9s ease-out forwards' }} />
                        </div>
                    </div>
                )}

                {/* 主隕石 */}
                {currentMeteor && !myState.isDead && (
                    <div ref={meteorRef} style={{ position:'absolute', left:`${currentMeteor.x}%`, top:'-15%', transform:'translate(-50%,0)', zIndex:20, display:'flex', flexDirection:'column', alignItems:'center' }}>
                        {currentMeteor.isExploding ? (
                            /* 擊中爆炸 */
                            <div style={{ position:'relative', width:94, height:94, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <div style={{ position:'absolute', top:'50%', left:'50%', width:72, height:72, borderRadius:'50%', border:'3px solid rgba(251,146,60,.9)', animation:'impactRingA .65s ease-out forwards' }} />
                                <div style={{ position:'absolute', top:'50%', left:'50%', width:48, height:48, borderRadius:'50%', border:'2px solid rgba(251,191,36,.7)', animation:'impactRingB .5s .07s ease-out forwards' }} />
                                <i className="fa-solid fa-explosion" style={{ fontSize:46, color:'#fbbf24', filter:'drop-shadow(0 0 18px rgba(251,191,36,.95))', animation:'impactCore .55s ease-out forwards' }} />
                            </div>
                        ) : (
                            /* 飛行中隕石（火焰 + 岩石 + 標籤） */
                            <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                                {/* 火焰尾跡 */}
                                <div style={{ width:24, height:50, background:'linear-gradient(to bottom,transparent,rgba(251,146,60,.65),rgba(239,68,68,.35))', borderRadius:'50% 50% 20% 20% / 60% 60% 30% 30%', filter:'blur(5px)', animation:'trailFlicker .2s ease-in-out infinite alternate', marginBottom:-10, zIndex:0 }} />
                                {/* 隕石本體 */}
                                <div style={{ position:'relative', width:74, height:74, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }} onClick={() => playAudio(currentMeteor.wordObj.en)}>
                                    <div style={{ position:'absolute', width:74, height:74, borderRadius:'50%', background:'radial-gradient(circle,rgba(251,146,60,.68) 0%,rgba(239,68,68,.42) 40%,transparent 70%)', filter:'blur(10px)', animation:'flameFlicker .15s ease-in-out infinite alternate' }} />
                                    <div style={{ position:'relative', width:54, height:54, background:'radial-gradient(circle at 33% 32%,#5c4232,#2e1e12,#1a0e08)', borderRadius:'46% 54% 62% 38% / 50% 42% 58% 50%', boxShadow:'0 0 20px 7px rgba(251,146,60,.52),inset -6px -6px 12px rgba(0,0,0,.65)', zIndex:1 }}>
                                        <div style={{ position:'absolute', top:'20%', left:'16%', width:'22%', height:'16%', borderRadius:'50%', background:'rgba(0,0,0,.55)' }} />
                                        <div style={{ position:'absolute', top:'52%', left:'58%', width:'16%', height:'12%', borderRadius:'50%', background:'rgba(0,0,0,.4)' }} />
                                        <div style={{ position:'absolute', top:'14%', left:'22%', width:'22%', height:'18%', borderRadius:'50%', background:'rgba(255,255,255,.07)' }} />
                                    </div>
                                </div>
                                {/* 單字標籤 */}
                                <div style={{ marginTop:7, background:'rgba(8,12,26,.94)', border:'1px solid rgba(59,130,246,.6)', borderRadius:8, padding:'5px 14px', boxShadow:'0 0 14px rgba(59,130,246,.32)' }}>
                                    <span style={{ color:'#e2e8f0', fontWeight:900, fontSize:22, fontFamily:'"Courier New",Courier,monospace', textShadow:'0 0 8px rgba(255,255,255,.22)', whiteSpace:'nowrap' }}>
                                        {currentMeteor.wordObj.en}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 地表山脈剪影（固定於底部，z-index 高於危險區） */}
                <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:6, pointerEvents:'none' }}>
                    <svg viewBox="0 0 1440 88" preserveAspectRatio="none" width="100%" height="88">
                        <path d="M0,88 L0,58 L90,38 L180,52 L270,28 L360,46 L440,20 L520,42 L610,16 L700,40 L790,55 L870,24 L960,42 L1040,14 L1130,36 L1220,52 L1310,30 L1380,46 L1440,38 L1440,88 Z" fill="#04070f"/>
                        <path d="M0,88 L0,66 L130,53 L250,65 L340,43 L440,59 L520,37 L610,55 L710,71 L790,45 L880,63 L970,47 L1060,67 L1160,51 L1260,69 L1360,49 L1440,59 L1440,88 Z" fill="#060910"/>
                        <line x1="0" y1="74" x2="1440" y2="74" stroke="rgba(59,130,246,.10)" strokeWidth="1"/>
                    </svg>
                    <div style={{ position:'absolute', bottom:13, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(59,130,246,.18),rgba(96,165,250,.32),rgba(59,130,246,.18),transparent)' }} />
                </div>

                {/* 地平線危險區（從底部上升，位於山脈後方） */}
                {myState.horizon > 0 && (
                    <div style={{ position:'absolute', bottom:0, left:0, right:0, height:`${myState.horizon}%`, zIndex:5, transition:'height .5s ease', background:'rgba(120,10,10,.38)', borderTop:'2px solid rgba(239,68,68,.65)', boxShadow:'0 -4px 24px rgba(239,68,68,.22)', overflow:'hidden' }}>
                        <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(45deg,rgba(239,68,68,.06) 0px,rgba(239,68,68,.06) 10px,transparent 10px,transparent 20px)' }} />
                        {myState.horizon > 2 && (
                            <div style={{ position:'absolute', top:5, left:'50%', transform:'translateX(-50%)', color:'rgba(248,113,113,.8)', fontWeight:900, fontSize:9, letterSpacing:2, whiteSpace:'nowrap' }}>
                                ⚠ DANGER LV.{Math.ceil(myState.horizon / 3)} / 防線縮短
                            </div>
                        )}
                    </div>
                )}

                {/* 陣亡覆蓋 */}
                {myState.isDead && (
                    <div style={{ position:'absolute', inset:0, zIndex:30, background:'rgba(0,0,0,.82)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }}>
                        <div style={{ width:64, height:64, borderRadius:'50%', border:'1px solid rgba(239,68,68,.3)', background:'rgba(127,29,29,.1)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                            <i className="fa-solid fa-ghost fa-spin" style={{ fontSize:28, color:'#ef4444' }}></i>
                        </div>
                        <h2 style={{ fontSize:32, fontWeight:900, color:'#ef4444', letterSpacing:3, marginBottom:8 }}>戰敗出局</h2>
                        <p style={{ color:'#475569', fontSize:11, fontWeight:700, letterSpacing:3 }}>ELIMINATED · 觀戰模式啟動…</p>
                    </div>
                )}
            </main>

            {/* ─────────── 答題區 ─────────── */}
            <footer style={{ flexShrink:0, width:'100%', background:'rgba(3,6,15,.97)', borderTop:'1px solid rgba(30,58,138,.4)', padding:'10px 12px 18px', zIndex:30, position:'relative' }}>
                {/* 自己的分數 & Combo 列 */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10, padding:'0 2px' }}>
                    <div style={{ display:'flex', gap:14, background:'rgba(9,20,38,.9)', border:'1px solid #1e3a8a', borderRadius:10, padding:'5px 12px' }}>
                        <span style={{ color:'#ef4444', fontWeight:700, fontSize:13 }}><i className="fa-solid fa-heart" style={{ marginRight:4 }}></i>{myState.lives}</span>
                        <span style={{ color:'#60a5fa', fontWeight:700, fontSize:13 }}><i className="fa-solid fa-star" style={{ marginRight:4 }}></i>{myState.score}</span>
                    </div>
                    <div style={{ padding:'5px 12px', borderRadius:10, fontWeight:900, fontSize:11, letterSpacing:1, transition:'all .2s', background: myState.combo >= 4 ? 'rgba(147,51,234,.8)' : myState.combo >= 2 ? 'rgba(234,88,12,.7)' : 'rgba(9,20,38,.9)', border: myState.combo >= 2 ? 'none' : '1px solid #1e3a8a', color: myState.combo >= 2 ? 'white' : '#475569', boxShadow: myState.combo >= 4 ? '0 0 16px rgba(168,85,247,.5)' : 'none' }}>
                        COMBO {myState.combo}/5
                    </div>
                </div>
                {/* 答題按鈕 */}
                <div style={{ maxWidth:600, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    {options.map(opt => (
                        <button
                            key={opt.id}
                            onPointerDown={() => handleShoot(opt)}
                            disabled={myState.isDead}
                            className="mg-btn"
                            style={{ padding:'14px 10px', fontWeight:700, fontSize:17, cursor:'pointer', textAlign:'center' }}
                        >
                            {opt.text}
                        </button>
                    ))}
                </div>
            </footer>
        </div>
    );
}

window.BattleGame = BattleGame;
