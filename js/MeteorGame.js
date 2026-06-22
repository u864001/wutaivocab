const { useState, useEffect, useMemo, useCallback, useRef } = React;

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
    .mg-hdr{position:relative;overflow:hidden}
    .mg-hdr::after{content:'';position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,transparent 0px,transparent 3px,rgba(59,130,246,.04) 3px,rgba(59,130,246,.04) 4px);animation:scanDrift 6s linear infinite}
    .mg-btn{background:rgba(9,20,38,.88)!important;border:2px solid #172848!important;color:#e2e8f0!important;transition:all .2s!important;border-radius:14px!important}
    .mg-btn:hover{border-color:#3b82f6!important;background:rgba(29,58,138,.45)!important;box-shadow:0 0 22px rgba(59,130,246,.45)!important}
    .mg-btn:active{transform:scale(.95)}
    .mg-inp:focus{border-color:#3b82f6!important;box-shadow:0 0 0 3px rgba(59,130,246,.25),0 0 20px rgba(59,130,246,.2)!important}
`;

function MeteorGame({ subMode, onBack, settings, wordDatabase, qualifyingBook, onSaveScore }) {

    /* ═══ ORIGINAL GAME STATE (UNCHANGED) ═══ */
    const [queue, setQueue] = useState([]);
    const [currentMeteor, setCurrentMeteor] = useState(null);
    const [options, setOptions] = useState([]);
    const [lives, setLives] = useState(3);
    const [score, setScore] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [nameError, setNameError] = useState('');
    const [scoreSaved, setScoreSaved] = useState(false);
    const containerRef = useRef(null);
    const meteorRef = useRef(null);
    const gameStartTimeRef = useRef(null);
    const finalSurvivalTimeRef = useRef(0);

    /* ═══ VISUAL-ONLY STATE & REFS ═══ */
    const [groundExplosion, setGroundExplosion] = useState(null);

    const [ufoVisible, setUfoVisible] = useState(false);
    const [ufoType,    setUfoType]    = useState(0);
    const [ufoPhase,   setUfoPhase]   = useState('moving');
    const ufoRef           = useRef(null);
    const ufoPosRef        = useRef({ x:50, y:20, dx:0.045, dy:0.018 });
    const ufoPhaseRef      = useRef('moving');
    const ufoClickRef      = useRef(0);
    const ufoClickTimerRef = useRef(null);
    const ufoRafRef        = useRef(null);

    const [satVisible, setSatVisible] = useState(false);
    const [satType,    setSatType]    = useState(0);
    const satRef         = useRef(null);
    const satProgressRef = useRef(0);
    const satRafRef      = useRef(null);
    const satConfigRef   = useRef({ startY:20, apexY:12 });

    const [shootingStars, setShootingStars] = useState([]);

    const stars = useMemo(() =>
        Array.from({ length: 130 }, (_, i) => ({
            id: i,
            x:     Math.random() * 100,
            y:     Math.random() * 88,
            size:  Math.random() * 2.2 + 0.4,
            dur:   Math.random() * 4   + 2,
            delay: Math.random() * 8
        })),
    []);

    /* ═══ ORIGINAL GAME LOGIC (ALL UNCHANGED) ═══ */
    useEffect(() => {
        let db = [];
        if (subMode === 'abc') {
            const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
            db = ALPHABET.map((letter, i) => ({ id:`abc-${i}`, book:'ABC', lesson:0, en:letter, zh:letter.toLowerCase() }));
        } else {
            db = wordDatabase.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
        }
        let shuffled = [...db].sort(() => 0.5 - Math.random());
        if (settings.count !== 'all' && subMode !== 'abc') shuffled = shuffled.slice(0, parseInt(settings.count, 10));
        setQueue(shuffled);
    }, [settings, wordDatabase, subMode]);

    const generateOptions = (correctWord, fullDb) => {
        const ansKey = subMode === 'en-zh' ? 'zh' : (subMode === 'abc' ? 'zh' : 'en');
        const correctAns = correctWord[ansKey];
        let pool = fullDb.map(w => w[ansKey]).filter(a => a !== correctAns);
        pool = [...new Set(pool)].sort(() => 0.5 - Math.random()).slice(0, 3);
        const finalOptions = [...pool, correctAns].map(opt => ({
            text: opt, isCorrect: opt === correctAns, id: Math.random().toString()
        })).sort(() => 0.5 - Math.random());
        setOptions(finalOptions);
    };

    const spawnMeteor = (wordObj) => {
        // ×1.6：Phase 1 等速段拉長，初速 = 舊版 50%，末速維持 80% 上限
        const dropDuration = Math.max(2.4, (5 - (score * 0.15)) * 1.6);
        const xPos = 10 + Math.random() * 80;
        setCurrentMeteor({ wordObj, x: xPos, duration: dropDuration, isExploding: false, id: Date.now() });
        if (subMode !== 'zh-en' && subMode !== 'abc') playAudio(wordObj.en);
    };

    const handleStart = () => {
        if (queue.length === 0) return onBack();
        setHasStarted(true);
        setLives(3);
        setScore(0);
        gameStartTimeRef.current = performance.now();
        const firstWord = queue[0];
        generateOptions(firstWord, subMode === 'abc' ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(l => ({ zh: l.toLowerCase() })) : wordDatabase);
        spawnMeteor(firstWord);
    };

    useEffect(() => {
        if (!hasStarted || isFinished || !currentMeteor || currentMeteor.isExploding) return;
        let start = performance.now();
        let animationFrameId;
        const drop = (now) => {
            const elapsed = (now - start) / 1000;
            const progress = Math.min(elapsed / currentMeteor.duration, 1);

            // ── 兩段式落下（修訂版）──
            // 設 D = 原始基準時間，新 duration = 1.6D
            // Phase 1（前 1.0D = 62.5% 總時）：y -15%→25%  等速，初速 = 舊版 50%
            // Phase 2（後 0.6D = 37.5% 總時）：y 25%→85%   平滑加速
            //   f(p2) = 0.6·p2² + 0.4·p2
            //   p2=0 速度 = Phase 1 末速（完全銜接，無突變）
            //   p2=1 速度 = 160/D = 原自由落體末速的 80%（精確上限）
            const ph1Dur = currentMeteor.duration / 1.6;      // = 1.0D（62.5%）
            const ph2Dur = currentMeteor.duration - ph1Dur;   // = 0.6D（37.5%）
            let currentY;
            if (elapsed <= ph1Dur) {
                const p1 = elapsed / ph1Dur;
                currentY = -15 + p1 * 40;                     // 等速：-15% → 25%
            } else {
                const p2 = Math.min((elapsed - ph1Dur) / ph2Dur, 1);
                const ep2 = 0.6 * p2 * p2 + 0.4 * p2;        // 平滑加速（連續且有末速上限）
                currentY = 25 + ep2 * 60;                     // 加速：25% → 85%
            }

            if (meteorRef.current) meteorRef.current.style.top = `${currentY}%`;
            if (progress >= 1) handleMiss();
            else animationFrameId = requestAnimationFrame(drop);
        };
        animationFrameId = requestAnimationFrame(drop);
        return () => cancelAnimationFrame(animationFrameId);
    }, [currentMeteor, hasStarted, isFinished]);

    const handleMiss = () => {
        soundEngine.wrong();
        if (containerRef.current) {
            containerRef.current.classList.add('animate-[shake_0.5s_ease-in-out]');
            setTimeout(() => containerRef.current?.classList.remove('animate-[shake_0.5s_ease-in-out]'), 500);
        }
        setCurrentMeteor(prev => ({ ...prev, isExploding: true }));
        setLives(l => {
            const newLives = l - 1;
            if (newLives <= 0) {
                finalSurvivalTimeRef.current = Math.floor((performance.now() - gameStartTimeRef.current) / 1000);
                setTimeout(() => setIsFinished(true), 1000);
            } else {
                setTimeout(() => nextTurn(), 1000);
            }
            return newLives;
        });
    };

    const handleShoot = (opt, e) => {
        if (!currentMeteor || currentMeteor.isExploding) return;
        soundEngine.laser();
        if (opt.isCorrect) {
            soundEngine.explosion();
            setScore(s => s + 1);
            setCurrentMeteor(prev => ({ ...prev, isExploding: true }));
            if (meteorRef.current && containerRef.current) {
                const rect = meteorRef.current.getBoundingClientRect();
                const x = (rect.left + rect.width / 2) / window.innerWidth;
                const y = (rect.top + rect.height / 2) / window.innerHeight;
                confetti({ particleCount: 40, spread: 60, origin: { x, y }, colors: ['#f87171', '#fbbf24', '#facc15'] });
            }
            setTimeout(() => nextTurn(), 800);
        } else {
            handleMiss();
        }
    };

    const nextTurn = () => {
        const newQueue = [...queue];
        newQueue.shift();
        if (newQueue.length > 0) {
            setQueue(newQueue);
            const nextWord = newQueue[0];
            generateOptions(nextWord, subMode === 'abc' ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(l => ({ zh: l.toLowerCase() })) : wordDatabase);
            spawnMeteor(nextWord);
        } else {
            finalSurvivalTimeRef.current = Math.floor((performance.now() - gameStartTimeRef.current) / 1000);
            setIsFinished(true);
            soundEngine.win();
        }
    };

    const submitToLeaderboard = () => {
        if (!isValidName(playerName)) { setNameError('請輸入正確的姓名格式'); return; }
        if (containsProfanity(playerName)) { setNameError('請勿使用不雅字眼'); return; }
        const realBook = subMode === 'abc' ? 'ABC' : qualifyingBook;
        onSaveScore({ book: realBook, mode: `meteor-${subMode}`, name: playerName.trim(), score, time: finalSurvivalTimeRef.current, week: getWeekNumber(), timestamp: Date.now() });
        setScoreSaved(true);
    };

    /* ═══ VISUAL FX: ground explosion detection ═══ */
    useEffect(() => {
        if (!currentMeteor?.isExploding) return;
        const top = parseFloat(meteorRef.current?.style.top ?? '0');
        if (top > 55) {
            const id = Date.now();
            setGroundExplosion({ id, x: currentMeteor.x });
            setTimeout(() => setGroundExplosion(null), 1200);
        }
    }, [currentMeteor?.isExploding]);

    /* ═══ VISUAL FX: UFO spawn timer ═══ */
    useEffect(() => {
        if (!hasStarted || isFinished || ufoVisible) return;
        const delay = 8000 + Math.random() * 8000;
        const t = setTimeout(() => {
            const rawDx = (Math.random() - 0.5) * 0.08;
            ufoPosRef.current = {
                x:  15 + Math.random() * 70,
                y:  8  + Math.random() * 22,
                dx: Math.abs(rawDx) < 0.015 ? 0.04 : rawDx,
                dy: (Math.random() - 0.5) * 0.025
            };
            ufoPhaseRef.current = 'moving';
            ufoClickRef.current = 0;
            setUfoType(Math.floor(Math.random() * 3));
            setUfoPhase('moving');
            setUfoVisible(true);
        }, delay);
        return () => clearTimeout(t);
    }, [hasStarted, isFinished, ufoVisible]);

    /* ═══ VISUAL FX: UFO movement RAF ═══ */
    useEffect(() => {
        if (!ufoVisible || !hasStarted || isFinished) return;
        // 若玩家未點擊，20~28 秒後自動無聲離場，確保每局能見到多次 UFO
        const autoDismiss = setTimeout(() => {
            if (ufoPhaseRef.current === 'moving') fleeUfo(false);
        }, 20000 + Math.random() * 8000);
        const animate = () => {
            if (ufoPhaseRef.current === 'moving') {
                const p = ufoPosRef.current;
                p.x += p.dx; p.y += p.dy;
                if (p.x <  4) { p.x =  4; p.dx =  Math.abs(p.dx); }
                if (p.x > 96) { p.x = 96; p.dx = -Math.abs(p.dx); }
                if (p.y <  5) { p.y =  5; p.dy =  Math.abs(p.dy); }
                if (p.y > 44) { p.y = 44; p.dy = -Math.abs(p.dy); }
                if (ufoRef.current) {
                    ufoRef.current.style.left = `${p.x}%`;
                    ufoRef.current.style.top  = `${p.y}%`;
                }
            }
            ufoRafRef.current = requestAnimationFrame(animate);
        };
        ufoRafRef.current = requestAnimationFrame(animate);
        return () => { cancelAnimationFrame(ufoRafRef.current); clearTimeout(autoDismiss); };
    }, [ufoVisible, hasStarted, isFinished, fleeUfo]);

    /* ═══ VISUAL FX: clean up on game end ═══ */
    useEffect(() => {
        if (!isFinished) return;
        cancelAnimationFrame(ufoRafRef.current);
        cancelAnimationFrame(satRafRef.current);
        clearTimeout(ufoClickTimerRef.current);
        setUfoVisible(false);
        setSatVisible(false);
        setShootingStars([]);
    }, [isFinished]);

    /* ═══ VISUAL FX: UFO flee (radial from ground center) ═══ */
    const fleeUfo = useCallback((scored) => {
        cancelAnimationFrame(ufoRafRef.current);
        clearTimeout(ufoClickTimerRef.current);
        ufoPhaseRef.current = 'fleeing';
        setUfoPhase('fleeing');
        if (scored) setScore(s => s + 1);
        const p = ufoPosRef.current;
        const dx = p.x - 50, dy = p.y - 100;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const tx = p.x + (dx / len) * 200;
        const ty = p.y + (dy / len) * 200;
        if (ufoRef.current) {
            ufoRef.current.style.transition = 'left .75s ease-in,top .75s ease-in,opacity .75s ease-in,transform .75s ease-in';
            ufoRef.current.style.left      = `${tx}%`;
            ufoRef.current.style.top       = `${ty}%`;
            ufoRef.current.style.opacity   = '0';
            ufoRef.current.style.transform = 'translate(-50%,-50%) scale(.05)';
        }
        setTimeout(() => {
            setUfoVisible(false);
            if (ufoRef.current) {
                ufoRef.current.style.transition = '';
                ufoRef.current.style.opacity    = '1';
                ufoRef.current.style.transform  = 'translate(-50%,-50%)';
            }
        }, 820);
    }, []);

    /* ═══ VISUAL FX: UFO click handler ═══ */
    const handleUfoClick = useCallback((e) => {
        e.stopPropagation();
        if (ufoPhaseRef.current === 'fleeing') return;
        const inner = ufoRef.current?.querySelector('.ufo-inner');
        if (inner) { inner.classList.remove('ufo-hit'); void inner.offsetWidth; inner.classList.add('ufo-hit'); }
        if (ufoPhaseRef.current === 'moving') {
            ufoPhaseRef.current = 'frozen';
            setUfoPhase('frozen');
            ufoClickRef.current = 1;
            ufoClickTimerRef.current = setTimeout(() => fleeUfo(false), 3000);
        } else if (ufoPhaseRef.current === 'frozen') {
            ufoClickRef.current += 1;
            if (ufoClickRef.current >= 5) fleeUfo(true);
        }
    }, [fleeUfo]);

    /* ═══ VISUAL FX: satellite spawn timer ═══ */
    useEffect(() => {
        if (!hasStarted || isFinished || satVisible) return;
        const t = setTimeout(() => {
            const startY = 12 + Math.random() * 22;
            satConfigRef.current = { startY, apexY: startY - 5 - Math.random() * 9 };
            satProgressRef.current = 0;
            setSatType(Math.floor(Math.random() * 3));
            setSatVisible(true);
        }, 20000 + Math.random() * 20000);
        return () => clearTimeout(t);
    }, [hasStarted, isFinished, satVisible]);

    /* ═══ VISUAL FX: satellite arc RAF ═══ */
    useEffect(() => {
        if (!satVisible || !hasStarted) return;
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
    }, [satVisible, hasStarted]);

    /* ═══ VISUAL FX: shooting star spawner ═══ */
    useEffect(() => {
        if (!hasStarted || isFinished) return;
        const interval = setInterval(() => {
            setShootingStars(prev => {
                if (prev.length >= 3) return prev;
                const id    = Date.now() + Math.random();
                const angle = 25 + Math.random() * 130;
                const x     = 5  + Math.random() * 75;
                const y     = 3  + Math.random() * 38;
                const dur   = 0.35 + Math.random() * 0.55;
                setTimeout(() => setShootingStars(ps => ps.filter(s => s.id !== id)), (dur + 0.5) * 1000);
                return [...prev, { id, x, y, angle, dur }];
            });
        }, 2800);
        return () => clearInterval(interval);
    }, [hasStarted, isFinished]);

    /* ═══════════════════════════════════════
       開始畫面
    ═══════════════════════════════════════ */
    if (!hasStarted) return (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100dvh', padding:24, background:'radial-gradient(ellipse at 50% 40%, #0d1e40 0%, #080c1a 70%)', position:'relative', overflow:'hidden' }}>
            <style dangerouslySetInnerHTML={{ __html: SPACE_CSS }} />
            {stars.slice(0, 60).map(s => (
                <div key={s.id} style={{ position:'fixed', top:`${s.y}%`, left:`${s.x}%`, width:`${s.size}px`, height:`${s.size}px`, borderRadius:'50%', background:'white', pointerEvents:'none', zIndex:0, animation:`twinkle ${s.dur}s ${s.delay}s ease-in-out infinite` }} />
            ))}
            <div style={{ position:'relative', zIndex:1, background:'linear-gradient(160deg,#0d1b38,#060d1f)', border:'1px solid #1e3a8a', borderRadius:24, padding:40, maxWidth:420, width:'100%', textAlign:'center', boxShadow:'0 0 60px rgba(59,130,246,.1),0 24px 64px rgba(0,0,0,.6)' }}>
                <div style={{ width:90, height:90, margin:'0 auto 24px', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                    <div style={{ position:'absolute', width:80, height:80, borderRadius:'50%', background:'radial-gradient(circle,rgba(251,146,60,.55) 0%,transparent 70%)', filter:'blur(8px)' }} />
                    <i className="fa-solid fa-meteor" style={{ fontSize:48, color:'#fb923c', filter:'drop-shadow(0 0 16px rgba(251,146,60,.9))', position:'relative', zIndex:1 }}></i>
                </div>
                <h2 style={{ fontSize:28, fontWeight:900, color:'#e2e8f0', marginBottom:12, letterSpacing:2 }}>太空隕石防衛戰</h2>
                <p style={{ color:'#64748b', marginBottom:28, lineHeight:1.75, fontSize:15 }}>
                    看準掉落的隕石單字，<br/>在下方炮台選擇正確翻譯擊碎它！<br/>
                    <span style={{ color:'#fb923c', fontWeight:700, fontSize:13, display:'block', marginTop:8 }}>
                        <i className="fa-solid fa-volume-high" style={{ marginRight:6 }}></i>請開啟聲音體驗最佳效果！
                    </span>
                </p>
                <button onClick={handleStart} style={{ width:'100%', padding:'16px 24px', background:'linear-gradient(135deg,#1d4ed8,#3b82f6)', color:'white', borderRadius:16, fontWeight:900, fontSize:18, border:'none', cursor:'pointer', boxShadow:'0 0 32px rgba(59,130,246,.5)', letterSpacing:1 }}>
                    <i className="fa-solid fa-rocket" style={{ marginRight:8, transform:'rotate(-45deg)', display:'inline-block' }}></i>發射升空
                </button>
                <button onClick={onBack} style={{ width:'100%', marginTop:14, padding:'12px', color:'#475569', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>返回基地</button>
            </div>
        </div>
    );

    /* ═══════════════════════════════════════
       通關 / 失敗畫面
    ═══════════════════════════════════════ */
    if (isFinished) {
        const canRank = subMode === 'abc' || qualifyingBook !== null;
        return (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100dvh', padding:24, background:'radial-gradient(ellipse at 50% 40%, #0d1e40 0%, #080c1a 70%)', position:'relative', overflow:'hidden' }}>
                <style dangerouslySetInnerHTML={{ __html: SPACE_CSS }} />
                {stars.slice(0, 70).map(s => (
                    <div key={s.id} style={{ position:'fixed', top:`${s.y}%`, left:`${s.x}%`, width:`${s.size}px`, height:`${s.size}px`, borderRadius:'50%', background:'white', pointerEvents:'none', zIndex:0, animation:`twinkle ${s.dur}s ${s.delay}s ease-in-out infinite` }} />
                ))}
                <div style={{ position:'relative', zIndex:1, background:'linear-gradient(160deg,#0d1b38,#060d1f)', border:'1px solid #1e3a8a', borderRadius:24, padding:32, maxWidth:420, width:'100%', textAlign:'center', boxShadow:'0 0 60px rgba(59,130,246,.1),0 24px 64px rgba(0,0,0,.6)' }}>
                    <i className="fa-solid fa-trophy" style={{ fontSize:56, color:'#fbbf24', display:'block', marginBottom:20, filter:'drop-shadow(0 0 18px rgba(251,191,36,.8))' }}></i>
                    <h2 style={{ fontSize:26, fontWeight:900, color:'#e2e8f0', marginBottom:20, letterSpacing:2 }}>防衛結束！</h2>
                    <div style={{ background:'rgba(4,8,20,.8)', border:'1px solid #1e3a8a', borderRadius:16, padding:20, marginBottom:20 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:16, fontWeight:700, marginBottom:10 }}>
                            <span style={{ color:'#94a3b8' }}>成功擊毀</span>
                            <span style={{ color:'#60a5fa' }}>{score} 顆隕石</span>
                        </div>
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:16, fontWeight:700 }}>
                            <span style={{ color:'#94a3b8' }}>生存時間</span>
                            <span style={{ color:'#34d399', textShadow:'0 0 10px rgba(52,211,153,.6)' }}>{finalSurvivalTimeRef.current} 秒</span>
                        </div>
                    </div>
                    {canRank && !scoreSaved ? (
                        <div style={{ background:'rgba(4,8,20,.8)', border:'1px solid rgba(251,191,36,.3)', borderRadius:16, padding:20, marginBottom:20 }}>
                            <h3 style={{ fontWeight:900, color:'#fbbf24', marginBottom:14, fontSize:15, filter:'drop-shadow(0 0 6px rgba(251,191,36,.5))' }}>
                                <i className="fa-solid fa-crown" style={{ marginRight:6 }}></i>獲得銀河榜單資格！
                            </h3>
                            <input
                                type="text" value={playerName}
                                onChange={e => { setPlayerName(e.target.value); setNameError(''); }}
                                placeholder="輸入指揮官姓名"
                                className="mg-inp"
                                onKeyDown={e => e.key === 'Enter' && submitToLeaderboard()}
                                style={{ width:'100%', padding:'12px', borderRadius:12, border:'2px solid #1e3a8a', background:'rgba(4,8,20,.9)', color:'#e2e8f0', outline:'none', textAlign:'center', fontWeight:700, fontSize:16, marginBottom:10, boxSizing:'border-box', transition:'border-color .2s,box-shadow .2s', caretColor:'#60a5fa' }}
                            />
                            {nameError && <p style={{ color:'#f87171', fontSize:13, fontWeight:700, marginBottom:10 }}>{nameError}</p>}
                            <button onClick={submitToLeaderboard} style={{ width:'100%', padding:'12px', background:'linear-gradient(135deg,#d97706,#f59e0b)', color:'#1a0800', borderRadius:12, fontWeight:900, fontSize:15, border:'none', cursor:'pointer', boxShadow:'0 0 22px rgba(251,191,36,.4)' }}>
                                <i className="fa-solid fa-upload" style={{ marginRight:6 }}></i>登錄戰績
                            </button>
                        </div>
                    ) : scoreSaved ? (
                        <div style={{ background:'rgba(16,185,129,.1)', border:'1px solid #10b981', borderRadius:12, padding:16, marginBottom:20, color:'#34d399', fontWeight:700 }}>
                            <i className="fa-solid fa-circle-check" style={{ marginRight:8 }}></i>戰績已同步！
                        </div>
                    ) : null}
                    <button onClick={onBack} style={{ width:'100%', padding:'14px', background:'rgba(14,26,60,.8)', border:'1px solid #1e3a8a', color:'#93c5fd', borderRadius:14, fontWeight:700, fontSize:16, cursor:'pointer' }}>
                        返回大廳
                    </button>
                </div>
            </div>
        );
    }

    /* ═══════════════════════════════════════
       主遊戲畫面
    ═══════════════════════════════════════ */
    return (
        <div style={{ width:'100%', height:'100dvh', display:'flex', flexDirection:'column', overflow:'hidden', userSelect:'none', touchAction:'none', background:'#080c1a' }}>

            <style dangerouslySetInnerHTML={{ __html: SPACE_CSS }} />

            {/* ── 艦橋標題列 ── */}
            <header className="mg-hdr" style={{ flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', zIndex:20, background:'linear-gradient(90deg,#03060f 0%,#091426 50%,#03060f 100%)', borderBottom:'1px solid #1e3a8a', boxShadow:'0 2px 24px rgba(59,130,246,.18)' }}>
                <button onClick={onBack} style={{ padding:'8px 14px', borderRadius:12, fontWeight:700, border:'1px solid #1e3a8a', cursor:'pointer', display:'flex', alignItems:'center', gap:8, background:'rgba(9,20,38,.85)', color:'#93c5fd', transition:'all .2s' }}>
                    <i className="fa-solid fa-chevron-left"></i> 撤退
                </button>
                <div style={{ fontWeight:900, fontSize:17, color:'#93c5fd', letterSpacing:3, textShadow:'0 0 14px rgba(96,165,250,.7)', display:'flex', alignItems:'center', gap:8 }}>
                    <i className="fa-solid fa-meteor" style={{ fontSize:14, color:'#fb923c', filter:'drop-shadow(0 0 6px rgba(251,146,60,.8))' }}></i>
                    SCORE: {score}
                </div>
                <div style={{ display:'flex', gap:6 }}>
                    {[...Array(3)].map((_, i) => (
                        <i key={i} className="fa-solid fa-heart" style={{ fontSize:18, color: i < lives ? '#ef4444' : '#1e2a3a', filter: i < lives ? 'drop-shadow(0 0 5px rgba(239,68,68,.6))' : 'none', transition:'all .3s' }}></i>
                    ))}
                </div>
            </header>

            {/* ── 主遊戲區 ── */}
            <main ref={containerRef} style={{ flex:1, position:'relative', width:'100%', overflow:'hidden', background:'linear-gradient(180deg,#04060e 0%,#080c1a 45%,#0a1020 100%)' }}>

                {/* 固定星空 */}
                {stars.map(s => (
                    <div key={s.id} style={{ position:'absolute', left:`${s.x}%`, top:`${s.y}%`, width:`${s.size}px`, height:`${s.size}px`, borderRadius:'50%', background:'white', pointerEvents:'none', zIndex:0, animation:`twinkle ${s.dur}s ${s.delay}s ease-in-out infinite` }} />
                ))}

                {/* 流星（最多 3 條同時，各自方向不同） */}
                {shootingStars.map(s => (
                    <div key={s.id} style={{ position:'absolute', left:`${s.x}%`, top:`${s.y}%`, transform:`rotate(${s.angle}deg)`, transformOrigin:'0 50%', pointerEvents:'none', zIndex:1 }}>
                        <div style={{ width:100, height:2, background:'linear-gradient(90deg,transparent 0%,rgba(255,255,255,.5) 45%,rgba(255,255,255,.95) 82%,white 100%)', borderRadius:2, boxShadow:'0 0 4px 1px rgba(255,255,255,.35)', animation:`ssFly ${s.dur}s ease-out forwards` }} />
                    </div>
                ))}

                {/* 衛星（最多 1 個，定速弧線飛越） */}
                {satVisible && (
                    <div ref={satRef} style={{ position:'absolute', left:'108%', top:'20%', transform:'translate(-50%,-50%)', zIndex:2, pointerEvents:'none', opacity:0.72 }}>
                        {SAT_SVGS[satType]}
                    </div>
                )}

                {/* UFO 彩蛋（最多 1 個，可點擊） */}
                {ufoVisible && (
                    <div
                        ref={ufoRef}
                        onClick={handleUfoClick}
                        style={{ position:'absolute', left:`${ufoPosRef.current.x}%`, top:`${ufoPosRef.current.y}%`, transform:'translate(-50%,-50%)', zIndex:3, cursor: ufoPhase === 'fleeing' ? 'default' : 'pointer', pointerEvents: ufoPhase === 'fleeing' ? 'none' : 'auto' }}
                    >
                        <div
                            className={`ufo-inner${ufoPhase === 'frozen' ? ' ufo-wobble' : ''}`}
                            style={{ opacity:0.72, filter: ufoPhase === 'frozen' ? 'drop-shadow(0 0 8px rgba(96,165,250,.55))' : 'none' }}
                        >
                            {UFO_SVGS[ufoType]}
                        </div>
                    </div>
                )}

                {/* 地面爆炸（隕石落地時） */}
                {groundExplosion && (
                    <div style={{ position:'absolute', bottom:'8%', left:`${groundExplosion.x}%`, zIndex:8, pointerEvents:'none' }}>
                        <div style={{ position:'relative', width:0, height:0 }}>
                            <div style={{ position:'absolute', bottom:0, left:0, width:90, height:48, background:'radial-gradient(ellipse,rgba(251,146,60,.85) 0%,rgba(239,68,68,.5) 45%,transparent 75%)', filter:'blur(4px)', animation:'groundBlast 1.1s ease-out forwards' }} />
                            <div style={{ position:'absolute', bottom:2, left:0, width:120, height:7, background:'linear-gradient(90deg,transparent,rgba(251,146,60,.55),rgba(251,191,36,.75),rgba(251,146,60,.55),transparent)', borderRadius:4, animation:'groundRing .9s ease-out forwards' }} />
                        </div>
                    </div>
                )}

                {/* 隕石本體 */}
                {currentMeteor && (
                    <div
                        ref={meteorRef}
                        style={{ position:'absolute', left:`${currentMeteor.x}%`, top:'-15%', transform:'translate(-50%,0)', zIndex:10, display:'flex', flexDirection:'column', alignItems:'center' }}
                    >
                        {currentMeteor.isExploding ? (
                            /* ── 擊中爆炸動畫 ── */
                            <div style={{ position:'relative', width:94, height:94, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <div style={{ position:'absolute', top:'50%', left:'50%', width:72, height:72, borderRadius:'50%', border:'3px solid rgba(251,146,60,.9)', animation:'impactRingA .65s ease-out forwards' }} />
                                <div style={{ position:'absolute', top:'50%', left:'50%', width:48, height:48, borderRadius:'50%', border:'2px solid rgba(251,191,36,.7)', animation:'impactRingB .5s .07s ease-out forwards' }} />
                                <i className="fa-solid fa-explosion" style={{ fontSize:46, color:'#fbbf24', filter:'drop-shadow(0 0 18px rgba(251,191,36,.95))', animation:'impactCore .55s ease-out forwards' }} />
                            </div>
                        ) : (
                            /* ── 飛行中隕石（火焰 + 岩石 + 標籤） ── */
                            <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                                {/* 火焰尾跡（在隕石上方，朝上） */}
                                <div style={{ width:24, height:50, background:'linear-gradient(to bottom,transparent,rgba(251,146,60,.65),rgba(239,68,68,.35))', borderRadius:'50% 50% 20% 20% / 60% 60% 30% 30%', filter:'blur(5px)', animation:'trailFlicker .2s ease-in-out infinite alternate', marginBottom:-10, zIndex:0 }} />
                                {/* 隕石 + 外焰 */}
                                <div
                                    style={{ position:'relative', width:74, height:74, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}
                                    onClick={() => playAudio(currentMeteor.wordObj.en)}
                                >
                                    {/* 外焰光暈 */}
                                    <div style={{ position:'absolute', width:74, height:74, borderRadius:'50%', background:'radial-gradient(circle,rgba(251,146,60,.68) 0%,rgba(239,68,68,.42) 40%,transparent 70%)', filter:'blur(10px)', animation:'flameFlicker .15s ease-in-out infinite alternate' }} />
                                    {/* 岩石本體（不規則形狀） */}
                                    <div style={{ position:'relative', width:54, height:54, background:'radial-gradient(circle at 33% 32%,#5c4232,#2e1e12,#1a0e08)', borderRadius:'46% 54% 62% 38% / 50% 42% 58% 50%', boxShadow:'0 0 20px 7px rgba(251,146,60,.52),inset -6px -6px 12px rgba(0,0,0,.65)', zIndex:1 }}>
                                        {/* 隕石坑細節 */}
                                        <div style={{ position:'absolute', top:'20%', left:'16%', width:'22%', height:'16%', borderRadius:'50%', background:'rgba(0,0,0,.55)' }} />
                                        <div style={{ position:'absolute', top:'52%', left:'58%', width:'16%', height:'12%', borderRadius:'50%', background:'rgba(0,0,0,.4)' }} />
                                        <div style={{ position:'absolute', top:'14%', left:'22%', width:'22%', height:'18%', borderRadius:'50%', background:'rgba(255,255,255,.07)' }} />
                                    </div>
                                </div>
                                {/* 單字標籤 */}
                                <div style={{ marginTop:7, background:'rgba(8,12,26,.94)', border:'1px solid rgba(59,130,246,.6)', borderRadius:8, padding:'5px 14px', boxShadow:'0 0 14px rgba(59,130,246,.32)' }}>
                                    <span style={{ color:'#e2e8f0', fontWeight:900, fontSize:22, fontFamily:'"Courier New",Courier,monospace', textShadow:'0 0 8px rgba(255,255,255,.22)', whiteSpace:'nowrap' }}>
                                        {subMode === 'zh-en' ? currentMeteor.wordObj.zh : currentMeteor.wordObj.en}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 地表山脈剪影 */}
                <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:5, pointerEvents:'none' }}>
                    <svg viewBox="0 0 1440 88" preserveAspectRatio="none" width="100%" height="88">
                        {/* 遠山層 */}
                        <path d="M0,88 L0,58 L90,38 L180,52 L270,28 L360,46 L440,20 L520,42 L610,16 L700,40 L790,55 L870,24 L960,42 L1040,14 L1130,36 L1220,52 L1310,30 L1380,46 L1440,38 L1440,88 Z" fill="#04070f"/>
                        {/* 近山層 */}
                        <path d="M0,88 L0,66 L130,53 L250,65 L340,43 L440,59 L520,37 L610,55 L710,71 L790,45 L880,63 L970,47 L1060,67 L1160,51 L1260,69 L1360,49 L1440,59 L1440,88 Z" fill="#060910"/>
                        {/* 地平線 */}
                        <line x1="0" y1="74" x2="1440" y2="74" stroke="rgba(59,130,246,.10)" strokeWidth="1"/>
                    </svg>
                    {/* 地平線藍光輝 */}
                    <div style={{ position:'absolute', bottom:13, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(59,130,246,.18),rgba(96,165,250,.32),rgba(59,130,246,.18),transparent)' }} />
                </div>
            </main>

            {/* ── 答題按鈕區 ── */}
            <footer style={{ flexShrink:0, width:'100%', background:'rgba(3,6,15,.97)', borderTop:'1px solid rgba(30,58,138,.4)', padding:'14px 16px 20px', zIndex:20 }}>
                <div style={{ maxWidth:600, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    {options.map(opt => (
                        <button
                            key={opt.id}
                            onClick={e => handleShoot(opt, e)}
                            className="mg-btn"
                            style={{ position:'relative', overflow:'hidden', padding:'16px 12px', fontWeight:700, fontSize:18, cursor:'pointer', textAlign:'center' }}
                        >
                            {opt.text}
                        </button>
                    ))}
                </div>
            </footer>
        </div>
    );
}
