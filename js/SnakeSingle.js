// ── Canvas 輔助：帶圓角矩形 ──
function snakeRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

// ── Canvas 輔助：草地小花 ──
function drawMeadowFlower(ctx, cx, cy, color, size) {
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(cx + Math.cos(angle) * size * 1.2, cy + Math.sin(angle) * size * 1.2,
            size * 0.55, size * 0.3, angle, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.fillStyle = '#fef08a';
    ctx.beginPath(); ctx.arc(cx, cy, size * 0.38, 0, Math.PI * 2); ctx.fill();
}

// ── 決定性偽隨機（不影響 Math.random 遊戲邏輯）──
function pr(seed) {
    const x = Math.sin(seed + 1) * 10000;
    return x - Math.floor(x);
}

// ── 探頭動物 JSX（4 款）──
const PEEK_ANIMALS = [
    { jsx: (
        <svg viewBox="0 0 50 54" width="42" height="46">
            <ellipse cx="25" cy="38" rx="14" ry="16" fill="#92400e"/>
            <circle cx="25" cy="22" r="14" fill="#a16207"/>
            <circle cx="19" cy="17" r="4" fill="#7c3a0a"/>
            <circle cx="31" cy="17" r="4" fill="#7c3a0a"/>
            <circle cx="18" cy="20" r="3.2" fill="#111"/><circle cx="32" cy="20" r="3.2" fill="#111"/>
            <circle cx="19" cy="19" r="1.1" fill="white"/><circle cx="33" cy="19" r="1.1" fill="white"/>
            <ellipse cx="25" cy="27" rx="5.5" ry="3.5" fill="#d97706"/>
            <circle cx="23.5" cy="26" r="1.3" fill="#7c3a0a"/><circle cx="26.5" cy="26" r="1.3" fill="#7c3a0a"/>
            <path d="M21 30 Q25 33 29 30" fill="none" stroke="#7c3a0a" strokeWidth="1.2"/>
        </svg>
    )},
    { jsx: (
        <svg viewBox="0 0 56 58" width="44" height="46">
            <circle cx="28" cy="24" r="16" fill="#713f12"/>
            <ellipse cx="14" cy="22" rx="7.5" ry="8.5" fill="#92400e"/>
            <ellipse cx="42" cy="22" rx="7.5" ry="8.5" fill="#92400e"/>
            <ellipse cx="28" cy="30" rx="13" ry="10" fill="#b45309"/>
            <circle cx="21" cy="20" r="3.8" fill="#111"/><circle cx="35" cy="20" r="3.8" fill="#111"/>
            <circle cx="22" cy="19" r="1.3" fill="white"/><circle cx="36" cy="19" r="1.3" fill="white"/>
            <circle cx="26" cy="30" r="1.8" fill="#713f12"/><circle cx="30" cy="30" r="1.8" fill="#713f12"/>
            <path d="M22 35 Q28 39 34 35" fill="none" stroke="#713f12" strokeWidth="1.6"/>
        </svg>
    )},
    { jsx: (
        <svg viewBox="0 0 50 52" width="40" height="42">
            <circle cx="25" cy="21" r="13.5" fill="#b45309"/>
            <circle cx="17" cy="15" r="4.5" fill="#92400e"/><circle cx="33" cy="15" r="4.5" fill="#92400e"/>
            <circle cx="18" cy="19" r="3.2" fill="#111"/><circle cx="32" cy="19" r="3.2" fill="#111"/>
            <circle cx="19" cy="18" r="1.1" fill="white"/><circle cx="33" cy="18" r="1.1" fill="white"/>
            <ellipse cx="25" cy="27" rx="6" ry="3.8" fill="#fde68a"/>
            <circle cx="23" cy="26" r="1.4" fill="#78350f"/><circle cx="27" cy="26" r="1.4" fill="#78350f"/>
            <path d="M20 31 Q25 34 30 31" fill="none" stroke="#78350f" strokeWidth="1.2"/>
        </svg>
    )},
    { jsx: (
        <svg viewBox="0 0 54 56" width="42" height="44">
            <circle cx="27" cy="23" r="14.5" fill="#92400e"/>
            <ellipse cx="13" cy="21" rx="7" ry="8" fill="#a16207"/>
            <ellipse cx="41" cy="21" rx="7" ry="8" fill="#a16207"/>
            <ellipse cx="27" cy="30" rx="12" ry="9" fill="#a16207"/>
            <circle cx="20.5" cy="20" r="3.4" fill="#111"/><circle cx="33.5" cy="20" r="3.4" fill="#111"/>
            <circle cx="21.5" cy="19" r="1.2" fill="white"/><circle cx="34.5" cy="19" r="1.2" fill="white"/>
            <ellipse cx="25.5" cy="30" rx="2" ry="1.7" fill="#713f12"/>
            <ellipse cx="28.5" cy="30" rx="2" ry="1.7" fill="#713f12"/>
            <path d="M22 35 Q27 38 32 35" fill="none" stroke="#713f12" strokeWidth="1.5"/>
        </svg>
    )}
];

// ── 全域 CSS ──
const SNAKE_CSS = `
    @keyframes snkPeekUp {
        0%   { transform: translateY(115%); } 20%  { transform: translateY(0%); }
        80%  { transform: translateY(0%);   } 100% { transform: translateY(115%); }
    }
    @keyframes bfWingFlap {
        0%,100% { transform: scaleX(1); } 50% { transform: scaleX(0.08); }
    }
    @keyframes bfFloat {
        0%,100% { transform: translateY(0px); } 50% { transform: translateY(-7px); }
    }
    @keyframes snkFadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes pulseSoft {
        0%,100% { transform: scale(1); } 50% { transform: scale(1.05); }
    }
    @keyframes tapDotPulse {
        0%   { transform: translate(-50%,-50%) scale(0.3); opacity: 1; }
        45%  { transform: translate(-50%,-50%) scale(1.7); opacity: 0.8; }
        100% { transform: translate(-50%,-50%) scale(1.1); opacity: 0; }
    }
    .tap-dot { animation: tapDotPulse 0.9s ease-out forwards; }
    .dpad-btn { transition: transform 0.08s, background 0.08s !important; }
    .dpad-btn:active { transform: scale(0.86) !important; background: rgba(16,185,129,0.35) !important; }
    .bf-wing-l { transform-box: fill-box; transform-origin: 100% 50%; animation: bfWingFlap 0.30s ease-in-out infinite; }
    .bf-wing-r { transform-box: fill-box; transform-origin: 0% 50%; animation: bfWingFlap 0.30s 0.15s ease-in-out infinite; }
    .sna-wood {
        background: repeating-linear-gradient(88deg, transparent 0px, transparent 5px, rgba(0,0,0,0.055) 5px, rgba(0,0,0,0.055) 6px, transparent 6px, transparent 13px, rgba(255,255,255,0.03) 13px, rgba(255,255,255,0.03) 14px),
            linear-gradient(160deg, #a16207 0%, #854d0e 50%, #713f12 100%);
        border: 2px solid #92400e;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -2px 0 rgba(0,0,0,0.28), 0 6px 20px rgba(0,0,0,0.45);
    }
    .sna-wood-btn {
        background: repeating-linear-gradient(88deg, transparent 0px, transparent 5px, rgba(0,0,0,0.055) 5px, rgba(0,0,0,0.055) 6px, transparent 6px, transparent 13px),
            linear-gradient(160deg, #a16207 0%, #854d0e 50%, #713f12 100%);
        border: 2px solid #92400e; color: #fef3c7;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.14), 0 4px 12px rgba(0,0,0,0.4);
        text-shadow: 0 1px 3px rgba(0,0,0,0.55); transition: all 0.18s; cursor: pointer;
    }
    .sna-wood-btn:hover {
        background: repeating-linear-gradient(88deg, transparent 0px, transparent 5px, rgba(0,0,0,0.055) 5px, rgba(0,0,0,0.055) 6px, transparent 6px, transparent 13px),
            linear-gradient(160deg, #b45309 0%, #92400e 50%, #78350f 100%);
        transform: translateY(-1px);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.14), 0 7px 22px rgba(0,0,0,0.55);
    }
    .sna-wood-btn:active { transform: scale(0.96); }
`;

function SnakeSingle({ onBack, settings, wordDatabase, qualifyingBook, onSaveScore }) {
    const { useState, useEffect, useRef, useCallback } = React;

    // ── 核心流程狀態 ──
    const [uiPhase, setUiPhase] = useState('selecting');
    const [gameMode, setGameMode] = useState('normal');
    const [lang, setLang] = useState('zh-TW');
    const uiPhaseRef  = useRef(uiPhase);
    const gameModeRef = useRef(gameMode);
    useEffect(() => { uiPhaseRef.current = uiPhase; }, [uiPhase]);
    useEffect(() => { gameModeRef.current = gameMode; }, [gameMode]);

    // ── UI 狀態 ──
    const canvasRef    = useRef(null);
    const containerRef = useRef(null);
    const [scoreUI, setScoreUI]           = useState(0);
    const [heartsUI, setHeartsUI]         = useState(5);
    const [timeLeftUI, setTimeLeftUI]     = useState(60);
    const [currentWordObj, setCurrentWordObj] = useState(null);
    const [spelledLetters, setSpelledLetters] = useState("");
    const [finalScoreUI, setFinalScoreUI] = useState(0);
    const [tapDot, setTapDot]             = useState(null); // { x, y, id }

    // ── 方向控制 Ref（component 層，讓 D-pad 與點擊導航都能存取）──
    const nextDirRef    = useRef('RIGHT'); // 下一幀要走的方向
    const currentDirRef = useRef('RIGHT'); // 本幀實際方向
    const snakeHeadRef  = useRef({ x: 12, y: 7 }); // 蛇頭位置，供點擊導航計算

    const filteredWords = wordDatabase.filter(w =>
        settings.selectedUnits.includes(`${w.book}-${w.lesson}`)
    );

    // ── 雙語字典 ──
    const t = {
        'zh-TW': {
            title: '貪食蛇大冒險', chooseMode: '選擇挑戰難度',
            easy: '🌟 簡易模式', easyDesc: '下一個字母會發光提示',
            normal: '🔥 一般模式', normalDesc: '無提示，自動存入榮譽榜',
            backHome: '← 回大廳', quit: '放棄', score: '🌿',
            orientTitle: '設備轉向提醒',
            orientDesc: '請將平板或手機轉為橫向\n以獲得最佳視野與操控體驗',
            forceStart: '強制直向遊玩', readyBtn: "I'm Ready!",
            fail: '生存失敗', success: '時間到！生存成功',
            gameScore: '遊戲得分', heartBonus: '愛心紅利', totalResult: '總結算',
            saved: '☁️ 個人最佳成績已自動存檔',
            notSaved: '（簡易/練習模式，不列入排行榜）', backBtn: '🌿 回主畫面'
        },
        'en': {
            title: 'Jungle Snake', chooseMode: 'Select Difficulty',
            easy: '🌟 Easy Mode', easyDesc: 'Next letter glows',
            normal: '🔥 Normal Mode', normalDesc: 'No hints, ranked',
            backHome: '← Back', quit: 'Quit', score: '🌿',
            orientTitle: 'Rotate Device',
            orientDesc: 'Please rotate to landscape\nfor the best experience',
            forceStart: 'Play in Portrait', readyBtn: "I'm Ready!",
            fail: 'Survival Failed', success: "Time Up! Survived!",
            gameScore: 'Game Score', heartBonus: 'Life Bonus', totalResult: 'Total Score',
            saved: '☁️ Personal best auto-saved',
            notSaved: '(Practice mode, not ranked)', backBtn: '🌿 Main Menu'
        }
    }[lang];

    const playVoice = useCallback((text) => {
        if ('speechSynthesis' in window && text !== "") {
            window.speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance(text);
            msg.lang = 'en-US'; msg.rate = 0.85;
            window.speechSynthesis.speak(msg);
        }
    }, []);

    // ── 設備轉向自動偵測 ──
    useEffect(() => {
        const handleResize = () => {
            if (uiPhase === 'orientation' && window.innerWidth > window.innerHeight) {
                setUiPhase('ready');
            }
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, [uiPhase]);

    const handleModeSelect = (mode) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
        }
        setGameMode(mode);
        setUiPhase(window.innerHeight > window.innerWidth ? 'orientation' : 'ready');
    };

    // ── 純視覺 State（蝴蝶、動物）──
    const [animalPeek, setAnimalPeek] = useState(null);
    const [bfVisible,  setBfVisible]  = useState(false);
    const [bfPos,      setBfPos]      = useState({ x: 10, y: 20 });
    const [bfFlip,     setBfFlip]     = useState(false);
    const bfPosRef = useRef({ x: 10, y: 20 });
    const bfWpsRef = useRef([]);
    const bfTgtRef = useRef(0);

    // ── 裝飾動畫計時器 ──
    useEffect(() => {
        if (uiPhase === 'selecting' || uiPhase === 'orientation') return;
        let cancelled = false;
        const scheduleAnimal = () => {
            setTimeout(() => {
                if (cancelled) return;
                setAnimalPeek({ animalIdx: Math.floor(Math.random() * PEEK_ANIMALS.length), pos: 12 + Math.random() * 76, key: Date.now() });
                setTimeout(() => { if (!cancelled) setAnimalPeek(null); }, 3400);
                scheduleAnimal();
            }, 13000 + Math.random() * 12000);
        };
        const genWaypoints = () => {
            return Array.from({ length: 4 + Math.floor(Math.random() * 4) }, () => {
                const s = Math.floor(Math.random() * 4);
                if (s === 0) return { x: 5 + Math.random() * 90,  y: 3  + Math.random() * 10 };
                if (s === 1) return { x: 5 + Math.random() * 90,  y: 87 + Math.random() * 10 };
                if (s === 2) return { x: 2 + Math.random() * 10,  y: 8  + Math.random() * 84 };
                return             { x: 88 + Math.random() * 10, y: 8  + Math.random() * 84 };
            });
        };
        const scheduleBf = () => {
            setTimeout(() => {
                if (cancelled) return;
                const wps = genWaypoints();
                bfWpsRef.current = wps; bfPosRef.current = { ...wps[0] }; bfTgtRef.current = 1;
                setBfPos({ ...wps[0] }); setBfFlip(Math.random() > 0.5); setBfVisible(true);
                const iv = setInterval(() => {
                    if (cancelled) { clearInterval(iv); return; }
                    const cur = bfPosRef.current, ti = bfTgtRef.current, wpsN = bfWpsRef.current;
                    if (ti >= wpsN.length) { clearInterval(iv); setBfVisible(false); scheduleBf(); return; }
                    const tgt = wpsN[ti];
                    const dx = tgt.x - cur.x, dy = tgt.y - cur.y, dist = Math.sqrt(dx*dx+dy*dy);
                    if (dist < 0.5) { bfPosRef.current = { ...tgt }; bfTgtRef.current = ti + 1; setBfFlip(dx < 0); }
                    else { bfPosRef.current.x += (dx/dist)*0.5; bfPosRef.current.y += (dy/dist)*0.5; }
                    setBfPos({ ...bfPosRef.current });
                }, 50);
            }, 18000 + Math.random() * 14000);
        };
        scheduleAnimal(); scheduleBf();
        return () => { cancelled = true; setBfVisible(false); };
    }, [uiPhase]);

    // ═══════════════════════════════════════
    // 方案 A：虛擬十字鍵（D-pad）
    // ═══════════════════════════════════════
    const handleDPad = useCallback((dir) => {
        if (uiPhaseRef.current !== 'playing') return;
        const opp = { UP:'DOWN', DOWN:'UP', LEFT:'RIGHT', RIGHT:'LEFT' };
        if (dir !== opp[currentDirRef.current]) nextDirRef.current = dir;
    }, []);

    // ═══════════════════════════════════════
    // 方案 B：點擊草地區域導航
    // 規則：短邊先走（|dx|<=|dy| → 先走水平；|dy|<|dx| → 先走垂直）
    // ═══════════════════════════════════════
    const handleContainerTap = useCallback((e) => {
        if (uiPhaseRef.current !== 'playing') return;
        const containerEl = containerRef.current;
        const canvasEl    = canvasRef.current;
        if (!containerEl || !canvasEl) return;

        // 顯示紅點動畫
        const contRect = containerEl.getBoundingClientRect();
        const id = Date.now();
        setTapDot({ x: e.clientX - contRect.left, y: e.clientY - contRect.top, id });
        setTimeout(() => setTapDot(prev => prev?.id === id ? null : prev), 900);

        // 計算點擊對應的 canvas grid 座標
        const GRID_W = 24, GRID_H = 14, TILE_SIZE = 40;
        const canvasW = GRID_W * TILE_SIZE, canvasH = GRID_H * TILE_SIZE;
        const cr    = canvasEl.getBoundingClientRect();
        const scale = Math.min(cr.width / canvasW, cr.height / canvasH);
        const rendW = canvasW * scale, rendH = canvasH * scale;
        const offX  = cr.left + (cr.width  - rendW) / 2;
        const offY  = cr.top  + (cr.height - rendH) / 2;
        const cpx   = (e.clientX - offX) / scale;
        const cpy   = (e.clientY - offY) / scale;

        if (cpx < 0 || cpx > canvasW || cpy < 0 || cpy > canvasH) return;

        const tapX = Math.floor(cpx / TILE_SIZE);
        const tapY = Math.floor(cpy / TILE_SIZE);
        const { x: hx, y: hy } = snakeHeadRef.current;
        const dx = tapX - hx, dy = tapY - hy;
        if (dx === 0 && dy === 0) return;

        const opp = { UP:'DOWN', DOWN:'UP', LEFT:'RIGHT', RIGHT:'LEFT' };
        let newDir;
        // 短邊先走
        if (Math.abs(dx) <= Math.abs(dy)) {
            // 水平邊較短（或相等）→ 先走水平
            if      (dx > 0) newDir = 'RIGHT';
            else if (dx < 0) newDir = 'LEFT';
            else              newDir = dy > 0 ? 'DOWN' : 'UP';
        } else {
            // 垂直邊較短 → 先走垂直
            if      (dy > 0) newDir = 'DOWN';
            else if (dy < 0) newDir = 'UP';
            else              newDir = dx > 0 ? 'RIGHT' : 'LEFT';
        }
        if (newDir !== opp[currentDirRef.current]) nextDirRef.current = newDir;
    }, []);

    // ═══════════════════════════════════════
    // 主遊戲引擎
    // 只要離開 selecting/orientation 就掛載一次，之後不再重置
    // ═══════════════════════════════════════
    useEffect(() => {
        if (uiPhase === 'selecting' || uiPhase === 'orientation') return;

        const canvas = canvasRef.current;
        const ctx    = canvas.getContext('2d');
        if (!canvas || !ctx || filteredWords.length === 0) return;

        // 初始化方向控制 Ref
        nextDirRef.current    = 'RIGHT';
        currentDirRef.current = 'RIGHT';
        snakeHeadRef.current  = { x: 12, y: 7 };

        let engineHearts = 5, engineScore = 0, engineTime = 60;
        let isInvincible = false, isEngineActive = true, hasSpawnedInitial = false;
        let damageFlashStart = 0;

        const GRID_W = 24, GRID_H = 14, TILE_SIZE = 40;
        canvas.width  = GRID_W * TILE_SIZE;
        canvas.height = GRID_H * TILE_SIZE;

        let snake      = [{ x: 12, y: 7 }, { x: 11, y: 7 }, { x: 10, y: 7 }];
        let activeWordObj = null, targetWordStr = "", currentLetterIndex = 0;
        let spelledStr = "", mapLetters = [];

        // ── 靜態草原背景（一次繪製）──
        const bgCanvas = document.createElement('canvas');
        bgCanvas.width = canvas.width; bgCanvas.height = canvas.height;
        const bgCtx = bgCanvas.getContext('2d');

        for (let gy = 0; gy < GRID_H; gy++) {
            for (let gx = 0; gx < GRID_W; gx++) {
                const isBorder = gx===0||gx===GRID_W-1||gy===0||gy===GRID_H-1;
                const tx = gx*TILE_SIZE, ty = gy*TILE_SIZE;
                if (!isBorder) {
                    bgCtx.fillStyle = (gx+gy)%2===0 ? '#4ade80' : '#22c55e';
                    bgCtx.fillRect(tx,ty,TILE_SIZE,TILE_SIZE);
                    bgCtx.strokeStyle='rgba(0,0,0,0.07)'; bgCtx.lineWidth=0.6;
                    for (let g=0;g<3;g++) {
                        const gxOff=pr(gx*14+gy*7+g*31)*TILE_SIZE;
                        bgCtx.beginPath();
                        bgCtx.moveTo(tx+gxOff,ty+TILE_SIZE);
                        bgCtx.lineTo(tx+gxOff+(pr(gx*9+gy*3+g)*6-3),ty+TILE_SIZE*0.45);
                        bgCtx.stroke();
                    }
                } else {
                    bgCtx.fillStyle='#14532d'; bgCtx.fillRect(tx,ty,TILE_SIZE,TILE_SIZE);
                    const bCols=['#166534','#15803d','#16a34a','#14532d'];
                    const bCnt=3+Math.floor(pr(gx*17+gy*11)*2);
                    for (let b=0;b<bCnt;b++) {
                        bgCtx.fillStyle=bCols[b%bCols.length]; bgCtx.beginPath();
                        bgCtx.arc(tx+TILE_SIZE*(0.15+pr(gx*31+gy*13+b*7)*0.7),ty+TILE_SIZE*(0.15+pr(gx*23+gy*17+b*5)*0.7),TILE_SIZE*(0.22+pr(gx*19+gy*11+b*3)*0.2),0,Math.PI*2);
                        bgCtx.fill();
                    }
                    bgCtx.fillStyle='rgba(255,255,255,0.11)'; bgCtx.beginPath();
                    bgCtx.arc(tx+TILE_SIZE*(0.22+pr(gx*7+gy*29)*0.25),ty+TILE_SIZE*(0.16+pr(gx*11+gy*23)*0.2),TILE_SIZE*0.07,0,Math.PI*2);
                    bgCtx.fill();
                }
            }
        }
        const flowerColors=['#fb7185','#fbbf24','#a78bfa','#60a5fa','#f9a8d4','#86efac'];
        for (let fi=0;fi<22;fi++) {
            let fx,fy,valid=false,att=0;
            while (!valid&&att<30) {
                fx=(Math.floor(pr(fi*37+11)*(GRID_W-4))+2)*TILE_SIZE+TILE_SIZE/2;
                fy=(Math.floor(pr(fi*41+7)*(GRID_H-4))+2)*TILE_SIZE+TILE_SIZE/2;
                valid=!(Math.abs(fx-(GRID_W/2)*TILE_SIZE)<3*TILE_SIZE&&Math.abs(fy-(GRID_H/2)*TILE_SIZE)<2*TILE_SIZE);
                att++;
            }
            drawMeadowFlower(bgCtx,fx,fy,flowerColors[fi%flowerColors.length],3+pr(fi*13)*3);
        }

        // ── 字母放置（三階段，避開標題與相鄰）──
        const spawnNextWord = () => {
            activeWordObj = filteredWords[Math.floor(Math.random()*filteredWords.length)];
            targetWordStr = activeWordObj.en.replace(/\s+/g,'').toUpperCase();
            currentLetterIndex=0; spelledStr=""; mapLetters=[];
            setCurrentWordObj(activeWordObj); setSpelledLetters(""); playVoice(activeWordObj.en);

            for (let i=0;i<targetWordStr.length;i++) {
                let char=targetWordStr[i], isValid=false, newX=2, newY=3, attempts=0;
                while (!isValid && attempts<250) {
                    if (attempts<80) {
                        // 階段 1：嚴格模式，避開頂部 3 行、相鄰字母
                        newX=Math.floor(Math.random()*(GRID_W-4))+2; // X: 2~21
                        newY=Math.floor(Math.random()*(GRID_H-6))+3; // Y: 3~11（完全避開標題列區域）
                    } else if (attempts<160) {
                        // 階段 2：放寬，允許 Y=2 但仍避開標題中央
                        newX=Math.floor(Math.random()*(GRID_W-4))+2;
                        newY=Math.floor(Math.random()*(GRID_H-5))+2; // Y: 2~11
                    } else {
                        // 階段 3：應急，使用完整草地
                        newX=Math.floor(Math.random()*(GRID_W-2))+1;
                        newY=Math.floor(Math.random()*(GRID_H-2))+1;
                    }

                    const onSnake  = snake.some(s=>s.x===newX&&s.y===newY);
                    const onLetter = mapLetters.some(l=>l.x===newX&&l.y===newY);

                    if (!onSnake && !onLetter) {
                        isValid = true;

                        // 規則 A：避開單字木牌下方（中央 X:6~17, Y:2~4）
                        if (attempts<160 && newX>=6 && newX<=17 && newY<=4) isValid=false;

                        // 規則 B：避免字母相鄰（前 80 次嚴格）
                        if (isValid && attempts<80) {
                            if (mapLetters.some(l=>Math.abs(l.x-newX)<=1&&Math.abs(l.y-newY)<=1)) isValid=false;
                        }
                        // 規則 B 放寬（次 80 次只排除正重疊）
                        if (isValid && attempts>=80 && attempts<160) {
                            if (mapLetters.some(l=>Math.abs(l.x-newX)===0&&Math.abs(l.y-newY)===0)) isValid=false;
                        }
                    }
                    attempts++;
                }

                // 極端防護：掃描第一個空格
                if (!isValid) {
                    for (let gy=2;gy<GRID_H-1&&!isValid;gy++) {
                        for (let gx=1;gx<GRID_W-1&&!isValid;gx++) {
                            if (!snake.some(s=>s.x===gx&&s.y===gy)&&!mapLetters.some(l=>l.x===gx&&l.y===gy)) {
                                newX=gx; newY=gy; isValid=true;
                            }
                        }
                    }
                }
                mapLetters.push({ char, x: newX, y: newY, id: i });
            }
        };

        const endGame = () => {
            const totalScore = engineScore + Math.max(0,engineHearts)*10;
            setScoreUI(engineScore); setFinalScoreUI(totalScore); setUiPhase('gameover');
            if (gameModeRef.current==='normal'&&totalScore>0&&qualifyingBook&&window.handleSaveScore) {
                window.handleSaveScore({ mode:'snake_single', book:qualifyingBook, week:window.getWeekNumber?window.getWeekNumber():0, score:totalScore, time:Date.now() });
            }
        };

        const triggerDamage = () => {
            if (isInvincible||uiPhaseRef.current!=='playing') return;
            engineHearts--; setHeartsUI(engineHearts); damageFlashStart=Date.now();
            if (engineHearts<=0) endGame();
            else { isInvincible=true; setTimeout(()=>{isInvincible=false;},3000); }
        };

        const timerInterval = setInterval(()=>{
            if (uiPhaseRef.current==='playing'&&engineTime>0) {
                engineTime--; setTimeLeftUI(engineTime);
                if (engineTime<=0) endGame();
            }
        },1000);

        // ── 草原主題 drawGame ──
        const drawGame = () => {
            ctx.drawImage(bgCanvas,0,0);

            const expectedChar = targetWordStr[currentLetterIndex];
            mapLetters.forEach(letter=>{
                const lx=letter.x*TILE_SIZE+TILE_SIZE/2, ly=letter.y*TILE_SIZE+TILE_SIZE/2;
                const isEasyTarget = gameModeRef.current==='easy' && letter.char===expectedChar;
                if (isEasyTarget){ctx.shadowBlur=18;ctx.shadowColor='#fbbf24';}
                ctx.fillStyle = isEasyTarget?'#f59e0b':'#dc2626';
                ctx.beginPath(); ctx.arc(lx,ly,TILE_SIZE*0.42,0,Math.PI*2); ctx.fill();
                ctx.shadowBlur=0;
                ctx.strokeStyle=isEasyTarget?'#78350f':'#7f1d1d'; ctx.lineWidth=1.8;
                ctx.beginPath(); ctx.moveTo(lx,ly-TILE_SIZE*0.42); ctx.lineTo(lx+3,ly-TILE_SIZE*0.54); ctx.stroke();
                ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.beginPath();
                ctx.ellipse(lx-TILE_SIZE*0.1,ly-TILE_SIZE*0.12,TILE_SIZE*0.13,TILE_SIZE*0.09,-0.5,0,Math.PI*2); ctx.fill();
                ctx.fillStyle='white'; ctx.font='bold 20px "Courier New",monospace';
                ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(letter.char,lx,ly+1);
            });

            snake.forEach((seg,index)=>{
                const sx=seg.x*TILE_SIZE, sy=seg.y*TILE_SIZE;
                if (isInvincible) ctx.globalAlpha=Math.floor(Date.now()/200)%2===0?0.28:0.78;
                if (index===0) {
                    ctx.fillStyle=isInvincible?'#38bdf8':'#15803d';
                    snakeRoundRect(ctx,sx+2,sy+2,TILE_SIZE-4,TILE_SIZE-4,9); ctx.fill();
                    if (!isInvincible){ctx.fillStyle='#166534';snakeRoundRect(ctx,sx+6,sy+6,TILE_SIZE-12,TILE_SIZE-12,5);ctx.fill();}
                    const dir = currentDirRef.current;
                    const eyePos={RIGHT:[{ex:0.72,ey:0.28},{ex:0.72,ey:0.72}],LEFT:[{ex:0.28,ey:0.28},{ex:0.28,ey:0.72}],UP:[{ex:0.28,ey:0.28},{ex:0.72,ey:0.28}],DOWN:[{ex:0.28,ey:0.72},{ex:0.72,ey:0.72}]}[dir]||[{ex:0.72,ey:0.28},{ex:0.72,ey:0.72}];
                    const pOff={RIGHT:[1.5,0],LEFT:[-1.5,0],UP:[0,-1.5],DOWN:[0,1.5]}[dir]||[0,0];
                    eyePos.forEach(e=>{
                        ctx.globalAlpha=1; ctx.fillStyle='white';
                        ctx.beginPath(); ctx.arc(sx+e.ex*TILE_SIZE,sy+e.ey*TILE_SIZE,5.5,0,Math.PI*2); ctx.fill();
                        ctx.fillStyle='#111';
                        ctx.beginPath(); ctx.arc(sx+e.ex*TILE_SIZE+pOff[0],sy+e.ey*TILE_SIZE+pOff[1],2.8,0,Math.PI*2); ctx.fill();
                    });
                    ctx.globalAlpha=1;
                    if (!isInvincible){
                        const tb={RIGHT:{x:sx+TILE_SIZE,y:sy+TILE_SIZE/2,dx:9,dy:0},LEFT:{x:sx,y:sy+TILE_SIZE/2,dx:-9,dy:0},UP:{x:sx+TILE_SIZE/2,y:sy,dx:0,dy:-9},DOWN:{x:sx+TILE_SIZE/2,y:sy+TILE_SIZE,dx:0,dy:9}}[dir]||{x:sx+TILE_SIZE,y:sy+TILE_SIZE/2,dx:9,dy:0};
                        ctx.strokeStyle='#dc2626'; ctx.lineWidth=2;
                        ctx.beginPath(); ctx.moveTo(tb.x,tb.y); ctx.lineTo(tb.x+tb.dx,tb.y+tb.dy); ctx.stroke();
                        const px=tb.dy!==0?4:0,py=tb.dx!==0?4:0;
                        ctx.beginPath(); ctx.moveTo(tb.x+tb.dx,tb.y+tb.dy); ctx.lineTo(tb.x+tb.dx+px,tb.y+tb.dy+py); ctx.stroke();
                        ctx.beginPath(); ctx.moveTo(tb.x+tb.dx,tb.y+tb.dy); ctx.lineTo(tb.x+tb.dx-px,tb.y+tb.dy-py); ctx.stroke();
                    }
                } else {
                    const even=index%2===0;
                    ctx.fillStyle=isInvincible?(even?'#bae6fd':'#93c5fd'):(even?'#16a34a':'#166534');
                    snakeRoundRect(ctx,sx+3,sy+3,TILE_SIZE-6,TILE_SIZE-6,6); ctx.fill();
                    if (!isInvincible){ctx.strokeStyle='rgba(0,0,0,0.16)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(sx+TILE_SIZE/2,sy+TILE_SIZE/2,TILE_SIZE*0.22,0,Math.PI*2);ctx.stroke();}
                    ctx.globalAlpha=1;
                }
            });
            ctx.globalAlpha=1;

            const fe=Date.now()-damageFlashStart;
            if (fe<350){ctx.fillStyle=`rgba(220,38,38,${0.5*(1-fe/350)})`;ctx.fillRect(0,0,canvas.width,canvas.height);}
        };

        let lastTime=0; const tickRate=200; let animationFrameId;

        const update = (timestamp) => {
            if (!isEngineActive) return;

            // 初始生單字：進入 playing 後才觸發
            if (uiPhaseRef.current==='playing' && !hasSpawnedInitial) {
                hasSpawnedInitial=true; spawnNextWord();
            }

            if (uiPhaseRef.current==='playing') {
                if (timestamp-lastTime>tickRate) {
                    lastTime=timestamp;
                    // 從 nextDirRef 讀取，寫入 currentDirRef
                    currentDirRef.current = nextDirRef.current;
                    const dir = currentDirRef.current;
                    let head={...snake[0]};
                    if(dir==='UP')head.y--;if(dir==='DOWN')head.y++;
                    if(dir==='LEFT')head.x--;if(dir==='RIGHT')head.x++;

                    let hitWall=false;
                    if(head.x<0){head.x=GRID_W-1;hitWall=true;}else if(head.x>=GRID_W){head.x=0;hitWall=true;}
                    if(head.y<0){head.y=GRID_H-1;hitWall=true;}else if(head.y>=GRID_H){head.y=0;hitWall=true;}
                    if(hitWall)triggerDamage();

                    snake.unshift(head);
                    snakeHeadRef.current = snake[0]; // 更新蛇頭位置供點擊導航使用

                    if(!isInvincible&&snake.slice(1).some(s=>s.x===head.x&&s.y===head.y))triggerDamage();

                    const ai=mapLetters.findIndex(l=>l.x===head.x&&l.y===head.y);
                    if(ai!==-1){
                        const hl=mapLetters[ai],ec=targetWordStr[currentLetterIndex];
                        if(hl.char===ec){
                            mapLetters.splice(ai,1); engineScore+=10; setScoreUI(engineScore);
                            currentLetterIndex++; spelledStr+=hl.char; setSpelledLetters(spelledStr);
                            if(currentLetterIndex>=targetWordStr.length){engineScore+=50;setScoreUI(engineScore);spawnNextWord();}
                        } else { triggerDamage(); snake.pop(); }
                    } else { snake.pop(); }
                }
            }
            drawGame();
            animationFrameId=requestAnimationFrame(update);
        };
        animationFrameId=requestAnimationFrame(update);

        // 鍵盤控制（使用 currentDirRef 做反向防呆）
        const handleKeyDown=(e)=>{
            if(uiPhaseRef.current!=='playing')return;
            if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))e.preventDefault();
            if(e.key==='ArrowUp'   &&currentDirRef.current!=='DOWN') nextDirRef.current='UP';
            if(e.key==='ArrowDown' &&currentDirRef.current!=='UP')   nextDirRef.current='DOWN';
            if(e.key==='ArrowLeft' &&currentDirRef.current!=='RIGHT')nextDirRef.current='LEFT';
            if(e.key==='ArrowRight'&&currentDirRef.current!=='LEFT') nextDirRef.current='RIGHT';
        };

        // 防止頁面捲動（保留）
        const preventScroll=(e)=>e.preventDefault();
        window.addEventListener('keydown',handleKeyDown);
        window.addEventListener('touchmove',preventScroll,{passive:false});

        return ()=>{
            isEngineActive=false;
            clearInterval(timerInterval);
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('keydown',handleKeyDown);
            window.removeEventListener('touchmove',preventScroll);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uiPhase === 'selecting' || uiPhase === 'orientation']);

    /* ═══════════════════════════════════════
       畫面 1：選擇難度
    ═══════════════════════════════════════ */
    if (uiPhase === 'selecting') return (
        <div style={{ width:'100%', height:'100svh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, background:'radial-gradient(ellipse at 50% 60%, #166534 0%, #052e16 55%, #021a0e 100%)', position:'relative', overflow:'hidden' }}>
            <style dangerouslySetInnerHTML={{ __html: SNAKE_CSS }}/>
            <div style={{ position:'absolute', top:20, right:20, zIndex:20 }}>
                <button onClick={()=>setLang(lang==='zh-TW'?'en':'zh-TW')} className="sna-wood-btn" style={{ padding:'6px 14px', borderRadius:8, fontSize:14 }}>
                    {lang==='zh-TW'?'EN':'中文'}
                </button>
            </div>
            <div className="sna-wood" style={{ borderRadius:24, padding:40, maxWidth:440, width:'100%', textAlign:'center', zIndex:10 }}>
                <div style={{ fontSize:58, marginBottom:14, lineHeight:1 }}>🐍</div>
                <h1 style={{ fontSize:28, fontWeight:900, color:'#fef3c7', marginBottom:8, letterSpacing:2, textShadow:'0 2px 8px rgba(0,0,0,.55)' }}>{t.title}</h1>
                <p style={{ color:'#fde68a', marginBottom:28, fontWeight:600, opacity:.85 }}>{t.chooseMode}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                    <button onClick={()=>handleModeSelect('easy')} className="sna-wood-btn" style={{ padding:'18px 24px', borderRadius:14, fontWeight:900, fontSize:18 }}>
                        {t.easy}<div style={{ fontSize:13, fontWeight:500, opacity:.78, marginTop:5 }}>{t.easyDesc}</div>
                    </button>
                    <button onClick={()=>handleModeSelect('normal')} className="sna-wood-btn" style={{ padding:'18px 24px', borderRadius:14, fontWeight:900, fontSize:18 }}>
                        {t.normal}<div style={{ fontSize:13, fontWeight:500, opacity:.78, marginTop:5 }}>{t.normalDesc}</div>
                    </button>
                </div>
                <button onClick={onBack} style={{ marginTop:22, color:'#fde68a', background:'none', border:'none', cursor:'pointer', fontWeight:700, fontSize:14, opacity:.75 }}>{t.backHome}</button>
            </div>
        </div>
    );

    /* ═══════════════════════════════════════
       畫面 2：設備轉向提醒
    ═══════════════════════════════════════ */
    if (uiPhase === 'orientation') return (
        <div style={{ position:'fixed', inset:0, background:'rgba(5,46,22,1)', zIndex:100, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', color:'white', padding:24, textAlign:'center' }}>
            <style dangerouslySetInnerHTML={{ __html: SNAKE_CSS }}/>
            <div style={{ position:'absolute', top:20, right:20 }}>
                <button onClick={()=>setLang(lang==='zh-TW'?'en':'zh-TW')} className="sna-wood-btn" style={{ padding:'6px 12px', borderRadius:8, fontSize:14 }}>{lang==='zh-TW'?'EN':'中文'}</button>
            </div>
            <i className="fa-solid fa-mobile-screen" style={{ fontSize:54, marginBottom:18, transform:'rotate(-90deg)', color:'#4ade80' }}></i>
            <h2 style={{ fontSize:26, fontWeight:900, marginBottom:8, color:'#86efac' }}>{t.orientTitle}</h2>
            <p style={{ color:'#bbf7d0', fontSize:15, whiteSpace:'pre-line', marginBottom:40 }}>{t.orientDesc}</p>
            <button onClick={()=>setUiPhase('ready')} className="sna-wood-btn" style={{ padding:'12px 24px', borderRadius:12, fontWeight:700, fontSize:16 }}>{t.forceStart}</button>
        </div>
    );

    /* ═══════════════════════════════════════
       畫面 3 & 4：準備中／遊戲進行／結算
       （共用同一個容器，canvas 保持存活）
    ═══════════════════════════════════════ */
    return (
        <div
            ref={containerRef}
            onPointerDown={handleContainerTap}
            style={{ width:'100%', height:'100svh', display:'flex', flexDirection:'column', position:'relative', touchAction:'none', overscrollBehavior:'none', overflow:'hidden', background:'#052e16' }}
        >
            <style dangerouslySetInnerHTML={{ __html: SNAKE_CSS }}/>

            {/* ── 木質標題列：左上(退出+分數) | 中(愛心) | 右上(計時+語言) ── */}
            <div style={{ position:'absolute', top:0, width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', zIndex:20, background:'linear-gradient(90deg,#3a1a00,#713f12 50%,#3a1a00)', borderBottom:'2px solid #92400e', boxShadow:'0 2px 16px rgba(0,0,0,.55)', boxSizing:'border-box' }}>
                <div style={{ display:'flex', gap:8, alignItems:'center', flex:1 }}>
                    <button onClick={onBack} className="sna-wood-btn" style={{ padding:'7px 13px', borderRadius:11, fontSize:13 }} onPointerDown={e=>e.stopPropagation()}>{t.quit}</button>
                    <div className="sna-wood" style={{ borderRadius:10, padding:'6px 13px', fontWeight:800, color:'#fef3c7', fontSize:15 }}>
                        {t.score} {scoreUI}
                    </div>
                </div>
                <div style={{ display:'flex', gap:3, justifyContent:'center', flex:1 }}>
                    {[...Array(5)].map((_,i)=><span key={i} style={{ opacity:i<heartsUI?1:0.22, transition:'opacity .3s', fontSize:17 }}>{i<heartsUI?'❤️':'🤍'}</span>)}
                </div>
                <div style={{ display:'flex', gap:8, alignItems:'center', justifyContent:'flex-end', flex:1 }}>
                    <div style={{ background:'rgba(220,38,38,.88)', padding:'6px 12px', borderRadius:10, fontWeight:800, color:'#fef2f2', fontSize:14, border:'1px solid #dc2626' }}>⏱ {timeLeftUI}s</div>
                    <button onClick={()=>setLang(lang==='zh-TW'?'en':'zh-TW')} className="sna-wood-btn" style={{ padding:'6px 12px', borderRadius:8, fontSize:13 }} onPointerDown={e=>e.stopPropagation()}>
                        {lang==='zh-TW'?'EN':'ZH'}
                    </button>
                </div>
            </div>

            {/* ── Ready 緩衝按鈕 ── */}
            {uiPhase === 'ready' && (
                <div style={{ position:'absolute', inset:0, background:'rgba(5,46,22,0.6)', zIndex:20, display:'flex', alignItems:'center', justifyContent:'center' }} onPointerDown={e=>e.stopPropagation()}>
                    <button onClick={()=>setUiPhase('playing')} className="sna-wood-btn"
                        style={{ padding:'20px 40px', borderRadius:20, fontSize:32, fontWeight:900, animation:'pulseSoft 1.5s infinite' }}>
                        {t.readyBtn}
                    </button>
                </div>
            )}

            {/* ── 單字木牌（僅遊戲中）── */}
            {uiPhase === 'playing' && currentWordObj && (
                <div style={{ position:'absolute', top:60, left:'50%', transform:'translateX(-50%)', zIndex:10, pointerEvents:'none' }}>
                    <div className="sna-wood" style={{ borderRadius:14, padding:'9px 18px', textAlign:'center', whiteSpace:'nowrap' }}>
                        <p style={{ color:'#fde68a', fontSize:12, fontWeight:600, marginBottom:3, opacity:.88 }}>{currentWordObj.zh}</p>
                        <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'center' }}>
                            <span style={{ fontSize:24, fontWeight:900, letterSpacing:4, fontFamily:'"Courier New",monospace' }}>
                                <span style={{ color:'#86efac' }}>{spelledLetters}</span>
                                <span style={{ color:'#a16207' }}>{currentWordObj.en.replace(/\s+/g,'').toUpperCase().substring(spelledLetters.length)}</span>
                            </span>
                            <button onClick={e=>{e.stopPropagation();playVoice(currentWordObj.en);}}
                                style={{ pointerEvents:'auto', background:'#166534', border:'1px solid #4ade80', color:'#86efac', width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:13 }}
                                onPointerDown={e=>e.stopPropagation()}>
                                <i className="fa-solid fa-volume-high"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── 通關/失敗畫面 ── */}
            {uiPhase === 'gameover' && (
                <div style={{ position:'absolute', inset:0, zIndex:50, background:'rgba(5,46,22,0.96)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, animation:'snkFadeIn .5s ease-out' }} onPointerDown={e=>e.stopPropagation()}>
                    <div style={{ position:'absolute', top:16, right:16 }}>
                        <button onClick={()=>setLang(lang==='zh-TW'?'en':'zh-TW')} className="sna-wood-btn" style={{ padding:'6px 12px', borderRadius:8, fontSize:14 }}>{lang==='zh-TW'?'EN':'中文'}</button>
                    </div>
                    <div style={{ fontSize:60, marginBottom:14 }}>{heartsUI<=0?'💀':'🏆'}</div>
                    <h2 style={{ fontSize:26, fontWeight:900, color:'#fef3c7', marginBottom:20 }}>{heartsUI<=0?t.fail:t.success}</h2>
                    <div className="sna-wood" style={{ borderRadius:20, padding:24, marginBottom:18, width:'100%', maxWidth:340 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10, fontWeight:700, color:'#fde68a' }}>
                            <span>{t.gameScore}</span><span>{scoreUI}</span>
                        </div>
                        <div style={{ display:'flex', justifyContent:'space-between', paddingBottom:12, marginBottom:12, borderBottom:'1px solid rgba(255,255,255,.15)', fontWeight:700, color:'#fda4af' }}>
                            <span>{t.heartBonus} ({heartsUI}×10)</span><span>+{heartsUI*10}</span>
                        </div>
                        <div style={{ display:'flex', justifyContent:'space-between', fontWeight:900, fontSize:22, color:'#86efac' }}>
                            <span>{t.totalResult}</span><span>{finalScoreUI}</span>
                        </div>
                    </div>
                    {gameMode==='normal'&&qualifyingBook ? (
                        <p style={{ color:'#86efac', fontWeight:700, marginBottom:18, padding:'10px 18px', borderRadius:12, background:'rgba(134,239,172,.1)', border:'1px solid rgba(134,239,172,.3)', fontSize:13 }}>{t.saved}</p>
                    ) : (
                        <p style={{ color:'#a16207', fontSize:12, marginBottom:18, fontWeight:600 }}>{t.notSaved}</p>
                    )}
                    <button onClick={onBack} className="sna-wood-btn" style={{ padding:'13px 36px', borderRadius:14, fontWeight:900, fontSize:17 }}>{t.backBtn}</button>
                </div>
            )}

            {/* ── Canvas 遊戲主畫面 ── */}
            <canvas ref={canvasRef} style={{ width:'100%', height:'100%', objectFit:'contain', display:'block', background:'#052e16' }}/>

            {/* ── 方案 A：虛擬十字鍵（左下角，遊戲中才顯示）── */}
            {uiPhase === 'playing' && (
                <div style={{ position:'absolute', bottom:18, left:14, zIndex:15, opacity:0.70, touchAction:'none',
                    display:'grid', gridTemplateColumns:'repeat(3,52px)', gridTemplateRows:'repeat(3,52px)', gap:3,
                    filter:'drop-shadow(0 3px 10px rgba(0,0,0,0.55))' }}>
                    {/* 上排 */}
                    <div/>
                    <button className="dpad-btn" onPointerDown={e=>{e.stopPropagation();handleDPad('UP');}}
                        style={{ background:'rgba(5,46,22,0.82)', border:'2px solid rgba(74,222,128,0.5)', borderRadius:'14px 14px 4px 4px', color:'#86efac', fontSize:22, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>▲</button>
                    <div/>
                    {/* 中排 */}
                    <button className="dpad-btn" onPointerDown={e=>{e.stopPropagation();handleDPad('LEFT');}}
                        style={{ background:'rgba(5,46,22,0.82)', border:'2px solid rgba(74,222,128,0.5)', borderRadius:'14px 4px 4px 14px', color:'#86efac', fontSize:22, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>◀</button>
                    <div style={{ background:'rgba(5,46,22,0.55)', borderRadius:8, border:'1px solid rgba(74,222,128,0.2)' }}/>
                    <button className="dpad-btn" onPointerDown={e=>{e.stopPropagation();handleDPad('RIGHT');}}
                        style={{ background:'rgba(5,46,22,0.82)', border:'2px solid rgba(74,222,128,0.5)', borderRadius:'4px 14px 14px 4px', color:'#86efac', fontSize:22, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>▶</button>
                    {/* 下排 */}
                    <div/>
                    <button className="dpad-btn" onPointerDown={e=>{e.stopPropagation();handleDPad('DOWN');}}
                        style={{ background:'rgba(5,46,22,0.82)', border:'2px solid rgba(74,222,128,0.5)', borderRadius:'4px 4px 14px 14px', color:'#86efac', fontSize:22, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>▼</button>
                    <div/>
                </div>
            )}

            {/* ── 方案 B 視覺：點擊紅點動畫 ── */}
            {tapDot && (
                <div key={tapDot.id}
                    className="tap-dot"
                    style={{ position:'absolute', left:tapDot.x, top:tapDot.y,
                        width:22, height:22, borderRadius:'50%',
                        background:'rgba(220,38,38,0.88)',
                        border:'2.5px solid rgba(255,130,130,0.9)',
                        boxShadow:'0 0 14px rgba(220,38,38,0.75)',
                        pointerEvents:'none', zIndex:12 }}/>
            )}

            {/* ── 蝴蝶 ── */}
            {bfVisible && (
                <div style={{ position:'absolute', left:`${bfPos.x}%`, top:`${bfPos.y}%`, transform:`translate(-50%,-50%) scaleX(${bfFlip?-1:1})`, pointerEvents:'none', zIndex:5, animation:'bfFloat 1.9s ease-in-out infinite' }}>
                    <svg viewBox="0 0 62 44" width="46" height="34">
                        <g className="bf-wing-l"><ellipse cx="22" cy="17" rx="20" ry="14" fill="#fb923c" opacity="0.76"/><ellipse cx="17" cy="31" rx="14" ry="9" fill="#fed7aa" opacity="0.70"/></g>
                        <g className="bf-wing-r"><ellipse cx="40" cy="17" rx="20" ry="14" fill="#fb923c" opacity="0.76"/><ellipse cx="45" cy="31" rx="14" ry="9" fill="#fed7aa" opacity="0.70"/></g>
                        <ellipse cx="31" cy="22" rx="2.8" ry="13" fill="#1c1917"/>
                        <line x1="31" y1="9" x2="23" y2="2" stroke="#1c1917" strokeWidth="1.5"/><circle cx="22" cy="1.5" r="2.2" fill="#1c1917"/>
                        <line x1="31" y1="9" x2="39" y2="2" stroke="#1c1917" strokeWidth="1.5"/><circle cx="40" cy="1.5" r="2.2" fill="#1c1917"/>
                    </svg>
                </div>
            )}

            {/* ── 動物探頭 ── */}
            {animalPeek && (
                <div key={animalPeek.key} style={{ position:'absolute', bottom:0, left:`${animalPeek.pos}%`, pointerEvents:'none', zIndex:6 }}>
                    <div style={{ transform:'translateX(-50%)', animation:'snkPeekUp 3.4s ease-in-out forwards' }}>
                        {PEEK_ANIMALS[animalPeek.animalIdx].jsx}
                    </div>
                </div>
            )}
        </div>
    );
}

window.SnakeSingle = SnakeSingle;
