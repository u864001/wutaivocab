// ── Canvas 輔助：帶圓角矩形路徑 ──
function snakeRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
    ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
    ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
    ctx.closePath();
}
function drawMeadowFlower(ctx, cx, cy, color, size) {
    for (let i=0;i<5;i++) {
        const a=(i/5)*Math.PI*2-Math.PI/2;
        ctx.fillStyle=color; ctx.beginPath();
        ctx.ellipse(cx+Math.cos(a)*size*1.2,cy+Math.sin(a)*size*1.2,size*0.55,size*0.3,a,0,Math.PI*2);
        ctx.fill();
    }
    ctx.fillStyle='#fef08a'; ctx.beginPath(); ctx.arc(cx,cy,size*0.38,0,Math.PI*2); ctx.fill();
}
function pr(seed) { const x=Math.sin(seed+1)*10000; return x-Math.floor(x); }

// ── 探頭動物 JSX（4 款）──
const PEEK_ANIMALS = [
    {jsx:(<svg viewBox="0 0 50 54" width="42" height="46"><ellipse cx="25" cy="38" rx="14" ry="16" fill="#92400e"/><circle cx="25" cy="22" r="14" fill="#a16207"/><circle cx="19" cy="17" r="4" fill="#7c3a0a"/><circle cx="31" cy="17" r="4" fill="#7c3a0a"/><circle cx="18" cy="20" r="3.2" fill="#111"/><circle cx="32" cy="20" r="3.2" fill="#111"/><circle cx="19" cy="19" r="1.1" fill="white"/><circle cx="33" cy="19" r="1.1" fill="white"/><ellipse cx="25" cy="27" rx="5.5" ry="3.5" fill="#d97706"/><circle cx="23.5" cy="26" r="1.3" fill="#7c3a0a"/><circle cx="26.5" cy="26" r="1.3" fill="#7c3a0a"/><path d="M21 30 Q25 33 29 30" fill="none" stroke="#7c3a0a" strokeWidth="1.2"/></svg>)},
    {jsx:(<svg viewBox="0 0 56 58" width="44" height="46"><circle cx="28" cy="24" r="16" fill="#713f12"/><ellipse cx="14" cy="22" rx="7.5" ry="8.5" fill="#92400e"/><ellipse cx="42" cy="22" rx="7.5" ry="8.5" fill="#92400e"/><ellipse cx="28" cy="30" rx="13" ry="10" fill="#b45309"/><circle cx="21" cy="20" r="3.8" fill="#111"/><circle cx="35" cy="20" r="3.8" fill="#111"/><circle cx="22" cy="19" r="1.3" fill="white"/><circle cx="36" cy="19" r="1.3" fill="white"/><circle cx="26" cy="30" r="1.8" fill="#713f12"/><circle cx="30" cy="30" r="1.8" fill="#713f12"/><path d="M22 35 Q28 39 34 35" fill="none" stroke="#713f12" strokeWidth="1.6"/></svg>)},
    {jsx:(<svg viewBox="0 0 50 52" width="40" height="42"><circle cx="25" cy="21" r="13.5" fill="#b45309"/><circle cx="17" cy="15" r="4.5" fill="#92400e"/><circle cx="33" cy="15" r="4.5" fill="#92400e"/><circle cx="18" cy="19" r="3.2" fill="#111"/><circle cx="32" cy="19" r="3.2" fill="#111"/><circle cx="19" cy="18" r="1.1" fill="white"/><circle cx="33" cy="18" r="1.1" fill="white"/><ellipse cx="25" cy="27" rx="6" ry="3.8" fill="#fde68a"/><circle cx="23" cy="26" r="1.4" fill="#78350f"/><circle cx="27" cy="26" r="1.4" fill="#78350f"/><path d="M20 31 Q25 34 30 31" fill="none" stroke="#78350f" strokeWidth="1.2"/></svg>)},
    {jsx:(<svg viewBox="0 0 54 56" width="42" height="44"><circle cx="27" cy="23" r="14.5" fill="#92400e"/><ellipse cx="13" cy="21" rx="7" ry="8" fill="#a16207"/><ellipse cx="41" cy="21" rx="7" ry="8" fill="#a16207"/><ellipse cx="27" cy="30" rx="12" ry="9" fill="#a16207"/><circle cx="20.5" cy="20" r="3.4" fill="#111"/><circle cx="33.5" cy="20" r="3.4" fill="#111"/><circle cx="21.5" cy="19" r="1.2" fill="white"/><circle cx="34.5" cy="19" r="1.2" fill="white"/><ellipse cx="25.5" cy="30" rx="2" ry="1.7" fill="#713f12"/><ellipse cx="28.5" cy="30" rx="2" ry="1.7" fill="#713f12"/><path d="M22 35 Q27 38 32 35" fill="none" stroke="#713f12" strokeWidth="1.5"/></svg>)}
];

// ── 全域 CSS ──
const SNAKE_CSS = `
    @keyframes snkPeekUp { 0%{transform:translateY(115%)} 20%{transform:translateY(0%)} 80%{transform:translateY(0%)} 100%{transform:translateY(115%)} }
    @keyframes bfWingFlap { 0%,100%{transform:scaleX(1)} 50%{transform:scaleX(0.08)} }
    @keyframes bfFloat { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-7px)} }
    @keyframes snkFadeIn { from{opacity:0} to{opacity:1} }
    @keyframes pulseSoft { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
    @keyframes tapCenter {
        0%   { opacity:1; transform:translate(-50%,-50%) scale(1); }
        80%  { opacity:1; transform:translate(-50%,-50%) scale(1); }
        100% { opacity:0; transform:translate(-50%,-50%) scale(0.5); }
    }
    @keyframes tapRipple {
        0%   { transform:translate(-50%,-50%) scale(0.4); opacity:0.7; }
        100% { transform:translate(-50%,-50%) scale(4.5); opacity:0; }
    }
    .tap-center { animation: tapCenter 0.9s ease-out forwards; }
    .tap-ripple { animation: tapRipple 0.75s ease-out forwards; }
    .bf-wing-l { transform-box:fill-box; transform-origin:100% 50%; animation:bfWingFlap 0.30s ease-in-out infinite; }
    .bf-wing-r { transform-box:fill-box; transform-origin:0% 50%; animation:bfWingFlap 0.30s 0.15s ease-in-out infinite; }
    .dpad-btn { transition:transform 0.08s, background 0.08s !important; }
    .dpad-btn:active { transform:scale(0.86) !important; background:rgba(16,185,129,0.35) !important; }
    .sna-wood {
        background:
            repeating-linear-gradient(88deg,transparent 0px,transparent 5px,rgba(0,0,0,0.055) 5px,rgba(0,0,0,0.055) 6px,transparent 6px,transparent 13px,rgba(255,255,255,0.03) 13px,rgba(255,255,255,0.03) 14px),
            linear-gradient(160deg,#a16207 0%,#854d0e 50%,#713f12 100%);
        border:2px solid #92400e;
        box-shadow:inset 0 1px 0 rgba(255,255,255,0.14),inset 0 -2px 0 rgba(0,0,0,0.28),0 6px 20px rgba(0,0,0,0.45);
    }
    .sna-wood-btn {
        background:
            repeating-linear-gradient(88deg,transparent 0px,transparent 5px,rgba(0,0,0,0.055) 5px,rgba(0,0,0,0.055) 6px,transparent 6px,transparent 13px),
            linear-gradient(160deg,#a16207 0%,#854d0e 50%,#713f12 100%);
        border:2px solid #92400e; color:#fef3c7;
        box-shadow:inset 0 1px 0 rgba(255,255,255,0.14),0 4px 12px rgba(0,0,0,0.4);
        text-shadow:0 1px 3px rgba(0,0,0,0.55); transition:all 0.18s; cursor:pointer;
    }
    .sna-wood-btn:hover {
        background:
            repeating-linear-gradient(88deg,transparent 0px,transparent 5px,rgba(0,0,0,0.055) 5px,rgba(0,0,0,0.055) 6px,transparent 6px,transparent 13px),
            linear-gradient(160deg,#b45309 0%,#92400e 50%,#78350f 100%);
        transform:translateY(-1px);
        box-shadow:inset 0 1px 0 rgba(255,255,255,0.14),0 7px 22px rgba(0,0,0,0.55);
    }
    .sna-wood-btn:active { transform:scale(0.96); }
`;

function SnakeSingle({ onBack, settings, wordDatabase, qualifyingBook, onSaveScore }) {
    const { useState, useEffect, useRef, useCallback } = React;

    // ── 固定設計尺寸（整體框架） ──
    const DESIGN_W = 960;
    const DESIGN_H = 670;
    const GRID_W = 24;
    const GRID_H = 14;
    const TILE_SIZE = 40;

    // ── 流程狀態 ──
    const [uiPhase, setUiPhase]   = useState('selecting');
    const [gameMode, setGameMode] = useState('normal');
    const [lang, setLang]         = useState('zh-TW');
    const uiPhaseRef  = useRef(uiPhase);
    const gameModeRef = useRef(gameMode);
    useEffect(() => { uiPhaseRef.current  = uiPhase;  }, [uiPhase]);
    useEffect(() => { gameModeRef.current = gameMode; }, [gameMode]);

    // ── UI 顯示狀態 ──
    const canvasRef    = useRef(null);
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);
    const scaleRef = useRef(1);
    const [scoreUI, setScoreUI]           = useState(0);
    const [heartsUI, setHeartsUI]         = useState(5);
    const [timeLeftUI, setTimeLeftUI]     = useState(60);
    const [currentWordObj, setCurrentWordObj] = useState(null);
    const [spelledLetters, setSpelledLetters] = useState("");
    const [finalScoreUI, setFinalScoreUI] = useState(0);
    const [tapDot, setTapDot]             = useState(null);
    const gameEndReasonRef = useRef('');

    // ── 方向控制 Ref ──
    const nextDirRef    = useRef('RIGHT');
    const currentDirRef = useRef('RIGHT');
    const snakeHeadRef  = useRef({ x: 12, y: 7 });
    const targetPosRef = useRef(null);

    // ── 視覺裝飾 State ──
    const [animalPeek, setAnimalPeek] = useState(null);
    const [bfVisible,  setBfVisible]  = useState(false);
    const [bfPos,      setBfPos]      = useState({ x:10, y:20 });
    const [bfFlip,     setBfFlip]     = useState(false);
    const bfPosRef = useRef({ x:10, y:20 });
    const bfWpsRef = useRef([]);
    const bfTgtRef = useRef(0);

    const filteredWords = wordDatabase.filter(w =>
        settings.selectedUnits.includes(`${w.book}-${w.lesson}`)
    );

    // ── 雙語字典 ──
    const DICT = {
        'zh-TW': {
            title:'貪食蛇大冒險', chooseMode:'選擇挑戰難度',
            easy:'🌟 簡易模式', easyDesc:'提示發光 + 初速較慢',
            normal:'🔥 一般模式', normalDesc:'60 秒計時，無提示，上榜',
            survival:'🌿 生存模式', survivalDesc:'無限單字，5 條命耗盡為止，上榜',
            back:'← 回大廳', quit:'放棄',
            orientTitle:'建議轉為橫向', orientDesc:'橫向模式可獲得最佳遊戲體驗',
            forceStart:'直接開始遊玩', readyBtn:"I'm Ready!",
            failHearts:'生存失敗', failBoard:'棋盤已滿！', success:'時間到！生存成功',
            survivalEnd:'生存結束',
            gameScore:'遊戲得分', heartBonus:'愛心紅利', totalResult:'總結算',
            survivalTime:'生存時間',
            saved:'☁️ 個人最佳成績已自動存檔',
            practiceNote:'（簡易/練習模式，不列入排行榜）',
            survivalNote:'（生存模式，成績自動存檔）',
            backBtn:'🌿 回主畫面',
        },
        'en': {
            title:'Jungle Snake', chooseMode:'Select Difficulty',
            easy:'🌟 Easy Mode', easyDesc:'Hints + slower start speed',
            normal:'🔥 Normal Mode', normalDesc:'60 s timer, no hints, ranked',
            survival:'🌿 Survival Mode', survivalDesc:'Endless words, 5 lives, ranked',
            back:'← Back', quit:'Quit',
            orientTitle:'Landscape Recommended', orientDesc:'Rotate for the best experience',
            forceStart:'Play Anyway', readyBtn:"I'm Ready!",
            failHearts:'Game Over', failBoard:'Board Full!', success:"Time's Up! Survived!",
            survivalEnd:'Survival Over',
            gameScore:'Game Score', heartBonus:'Life Bonus', totalResult:'Final Score',
            survivalTime:'Survival Time',
            saved:'☁️ Best score saved!',
            practiceNote:'(Practice mode, not ranked)',
            survivalNote:'(Survival mode, auto-saved)',
            backBtn:'🌿 Back to Menu',
        }
    };
    const t = DICT[lang];

    const fmtTime = (mode, sec) => {
        if (mode === 'survival') {
            const m = Math.floor(sec/60), s = sec%60;
            return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        }
        return `${sec}s`;
    };

    const playVoice = useCallback((text) => {
        if ('speechSynthesis' in window && text !== "") {
            window.speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance(text);
            msg.lang='en-US'; msg.rate=0.85;
            window.speechSynthesis.speak(msg);
        }
    }, []);

    // ── 設備轉向偵測 ──
    useEffect(() => {
        const check = () => {
            if (uiPhase==='orientation' && window.innerWidth>window.innerHeight) setUiPhase('ready');
        };
        window.addEventListener('resize', check);
        window.addEventListener('orientationchange', check);
        return () => { window.removeEventListener('resize',check); window.removeEventListener('orientationchange',check); };
    }, [uiPhase]);

    const handleModeSelect = (mode) => {
        if ('speechSynthesis' in window) window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
        setGameMode(mode);
        setTimeLeftUI(mode==='survival' ? 0 : 60);
        setScoreUI(0); setHeartsUI(5);
        setUiPhase(window.innerHeight>window.innerWidth ? 'orientation' : 'ready');
    };

    // ── 裝飾動畫計時器 ──
    useEffect(() => {
        if (uiPhase==='selecting'||uiPhase==='orientation') return;
        let cancelled = false;
        const schedAnimal = () => {
            setTimeout(() => {
                if (cancelled) return;
                setAnimalPeek({ animalIdx:Math.floor(Math.random()*PEEK_ANIMALS.length), pos:12+Math.random()*76, key:Date.now() });
                setTimeout(() => { if (!cancelled) setAnimalPeek(null); }, 3400);
                schedAnimal();
            }, 13000+Math.random()*12000);
        };
        const genWps = () => Array.from({ length:4+Math.floor(Math.random()*4) }, () => {
            const s=Math.floor(Math.random()*4);
            if (s===0) return {x:5+Math.random()*90,y:3+Math.random()*10};
            if (s===1) return {x:5+Math.random()*90,y:87+Math.random()*10};
            if (s===2) return {x:2+Math.random()*10,y:8+Math.random()*84};
            return {x:88+Math.random()*10,y:8+Math.random()*84};
        });
        const schedBf = () => {
            setTimeout(() => {
                if (cancelled) return;
                const wps=genWps(); bfWpsRef.current=wps; bfPosRef.current={...wps[0]}; bfTgtRef.current=1;
                setBfPos({...wps[0]}); setBfFlip(Math.random()>0.5); setBfVisible(true);
                const iv=setInterval(() => {
                    if (cancelled){clearInterval(iv);return;}
                    const cur=bfPosRef.current,ti=bfTgtRef.current,wn=bfWpsRef.current;
                    if (ti>=wn.length){clearInterval(iv);setBfVisible(false);schedBf();return;}
                    const tgt=wn[ti],dx=tgt.x-cur.x,dy=tgt.y-cur.y,dist=Math.sqrt(dx*dx+dy*dy);
                    if (dist<0.5){bfPosRef.current={...tgt};bfTgtRef.current=ti+1;setBfFlip(dx<0);}
                    else{bfPosRef.current.x+=(dx/dist)*0.5;bfPosRef.current.y+=(dy/dist)*0.5;}
                    setBfPos({...bfPosRef.current});
                },50);
            }, 18000+Math.random()*14000);
        };
        schedAnimal(); schedBf();
        return () => { cancelled=true; setBfVisible(false); };
    }, [uiPhase]);

    // ════════════════════════════════════════
    // 動態縮放（基於視窗尺寸，確保完整顯示）
    // ════════════════════════════════════════
    useEffect(() => {
        const updateScale = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const wScale = w / DESIGN_W;
            const hScale = h / DESIGN_H;
            const newScale = Math.min(wScale, hScale, 1);
            setScale(newScale);
            scaleRef.current = newScale;
        };
        updateScale();
        window.addEventListener('resize', updateScale);
        window.addEventListener('orientationchange', updateScale);
        return () => {
            window.removeEventListener('resize', updateScale);
            window.removeEventListener('orientationchange', updateScale);
        };
    }, []);

    // ════════════════════════════════════════
    // 方案 A：D-pad 控制
    // ════════════════════════════════════════
    const handleDPad = useCallback((dir) => {
        if (uiPhaseRef.current!=='playing') return;
        const opp={UP:'DOWN',DOWN:'UP',LEFT:'RIGHT',RIGHT:'LEFT'};
        if (dir!==opp[currentDirRef.current]) {
            nextDirRef.current=dir;
            targetPosRef.current = null;
        }
    }, []);

    // ════════════════════════════════════════
    // 方案 B：點擊草地導航（座標換算基於視窗與縮放）
    // ════════════════════════════════════════
    const handleContainerTap = useCallback((e) => {
        if (uiPhaseRef.current!=='playing') return;
        const containerEl = containerRef.current;
        if (!containerEl) return;

        const rect = containerEl.getBoundingClientRect();
        const currentScale = scaleRef.current;
        // 框架在容器中的偏移（居中）
        const offsetX = (rect.width - DESIGN_W * currentScale) / 2;
        const offsetY = (rect.height - DESIGN_H * currentScale) / 2;

        const designX = (e.clientX - rect.left - offsetX) / currentScale;
        const designY = (e.clientY - rect.top - offsetY) / currentScale;

        const id = Date.now();
        setTapDot({ x: designX, y: designY, id });
        setTimeout(() => setTapDot(p => p?.id===id ? null : p), 900);

        if (designX < 0 || designX > DESIGN_W || designY < 110 || designY > 670) return;
        const tapX = Math.floor(designX / TILE_SIZE);
        const tapY = Math.floor((designY - 110) / TILE_SIZE);
        if (tapX < 0 || tapX >= GRID_W || tapY < 0 || tapY >= GRID_H) return;

        const head = snakeHeadRef.current;
        if (tapX === head.x && tapY === head.y) {
            targetPosRef.current = null;
            return;
        }
        targetPosRef.current = { x: tapX, y: tapY };
    }, []);

    // ════════════════════════════════════════
    // 主遊戲引擎（含 BFS 路徑規劃 & 改良字母放置）
    // ════════════════════════════════════════
    useEffect(() => {
        if (uiPhase==='selecting'||uiPhase==='orientation') return;

        const canvas=canvasRef.current, ctx=canvas.getContext('2d');
        if (!canvas||!ctx||filteredWords.length===0) return;

        nextDirRef.current='RIGHT'; currentDirRef.current='RIGHT';
        snakeHeadRef.current={x:12,y:7};
        gameEndReasonRef.current='';
        targetPosRef.current = null;

        let engineHearts=5, engineScore=0, engineTime=60;
        let isInvincible=false, isEngineActive=true, hasStarted=false;
        let damageFlashStart=0, wordsCompleted=0;
        let wordQueue=[];

        const EASY_RATES=[333,286,250,222,200];

        canvas.width = GRID_W * TILE_SIZE;
        canvas.height = GRID_H * TILE_SIZE;

        let snake=[{x:12,y:7},{x:11,y:7},{x:10,y:7}];
        let targetWordStr="",currentLetterIndex=0,spelledStr="",mapLetters=[];

        let elapsedSeconds=0;

        if (gameModeRef.current==='survival') setTimeLeftUI(0);
        else setTimeLeftUI(60);

        // ── BFS 路徑規劃函數 ──
        const bfsPath = (start, target, snakeBody) => {
            if (!target) return null;
            if (start.x === target.x && start.y === target.y) return null;

            const dirs = [{dx:0,dy:-1,dir:'UP'},{dx:0,dy:1,dir:'DOWN'},{dx:-1,dy:0,dir:'LEFT'},{dx:1,dy:0,dir:'RIGHT'}];
            const queue = [{x:start.x, y:start.y, path:[]}];
            const visited = new Set();
            visited.add(`${start.x},${start.y}`);

            const obstacleSet = new Set();
            for (let i = 0; i < snakeBody.length - 1; i++) {
                obstacleSet.add(`${snakeBody[i].x},${snakeBody[i].y}`);
            }

            while (queue.length > 0) {
                const cur = queue.shift();
                for (const d of dirs) {
                    const nx = cur.x + d.dx;
                    const ny = cur.y + d.dy;
                    const key = `${nx},${ny}`;
                    if (nx < 0 || nx >= GRID_W || ny < 0 || ny >= GRID_H) continue;
                    if (visited.has(key)) continue;
                    if (obstacleSet.has(key)) continue;

                    const newPath = [...cur.path, d.dir];
                    if (nx === target.x && ny === target.y) {
                        return newPath;
                    }
                    visited.add(key);
                    queue.push({x:nx, y:ny, path:newPath});
                }
            }
            return null;
        };

        // ── 靜態草原背景 ──
        const bgCanvas=document.createElement('canvas');
        bgCanvas.width=canvas.width; bgCanvas.height=canvas.height;
        const bgCtx=bgCanvas.getContext('2d');
        for (let gy=0;gy<GRID_H;gy++) {
            for (let gx=0;gx<GRID_W;gx++) {
                const isBorder=gx===0||gx===GRID_W-1||gy===0||gy===GRID_H-1;
                const tx=gx*TILE_SIZE,ty=gy*TILE_SIZE;
                if (!isBorder) {
                    bgCtx.fillStyle=(gx+gy)%2===0?'#4ade80':'#22c55e';
                    bgCtx.fillRect(tx,ty,TILE_SIZE,TILE_SIZE);
                    bgCtx.strokeStyle='rgba(0,0,0,0.07)'; bgCtx.lineWidth=0.6;
                    for (let g=0;g<3;g++) {
                        const gxOff=pr(gx*14+gy*7+g*31)*TILE_SIZE;
                        bgCtx.beginPath(); bgCtx.moveTo(tx+gxOff,ty+TILE_SIZE);
                        bgCtx.lineTo(tx+gxOff+(pr(gx*9+gy*3+g)*6-3),ty+TILE_SIZE*0.45); bgCtx.stroke();
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
                    bgCtx.arc(tx+TILE_SIZE*(0.22+pr(gx*7+gy*29)*0.25),ty+TILE_SIZE*(0.16+pr(gx*11+gy*23)*0.2),TILE_SIZE*0.07,0,Math.PI*2); bgCtx.fill();
                }
            }
        }
        const flowerCols=['#fb7185','#fbbf24','#a78bfa','#60a5fa','#f9a8d4','#86efac'];
        for (let fi=0;fi<22;fi++) {
            let fx,fy,valid=false,att=0;
            while (!valid&&att<30) {
                fx=(Math.floor(pr(fi*37+11)*(GRID_W-4))+2)*TILE_SIZE+TILE_SIZE/2;
                fy=(Math.floor(pr(fi*41+7)*(GRID_H-4))+2)*TILE_SIZE+TILE_SIZE/2;
                valid=!(Math.abs(fx-(GRID_W/2)*TILE_SIZE)<3*TILE_SIZE&&Math.abs(fy-(GRID_H/2)*TILE_SIZE)<2*TILE_SIZE);
                att++;
            }
            drawMeadowFlower(bgCtx,fx,fy,flowerCols[fi%flowerCols.length],3+pr(fi*13)*3);
        }

        // ── 改良字母放置 ──
        const spawnNextWord = () => {
            let nextWord;
            if (gameModeRef.current==='survival') {
                if (wordQueue.length===0) wordQueue=[...filteredWords].sort(()=>Math.random()-0.5);
                nextWord=wordQueue.shift();
            } else {
                nextWord=filteredWords[Math.floor(Math.random()*filteredWords.length)];
            }
            targetWordStr=nextWord.en.replace(/\s+/g,'').toUpperCase();

            if (gameModeRef.current==='survival') {
                const available=(GRID_W-2)*(GRID_H-2)-snake.length;
                if (available<targetWordStr.length) { endGame('board'); return; }
            }

            currentLetterIndex=0; spelledStr=""; mapLetters=[];
            setCurrentWordObj(nextWord); setSpelledLetters(""); playVoice(nextWord.en);

            // 定義排除區域（格子座標）
            const isForbidden = (x, y) => {
                // 1. 邊界
                if (x === 0 || x === GRID_W-1 || y === 0 || y === GRID_H-1) return true;
                // 2. 十字控制盤區域（左下角）
                if (x <= 4 && y >= 10) return true;
                // 3. 頂部兩列（單字木牌下方，避免遮擋）
                if (y < 2) return true;
                // 4. 蛇身
                if (snake.some(s => s.x===x && s.y===y)) return true;
                // 5. 已放置的字母（位置）
                if (mapLetters.some(l => l.x===x && l.y===y)) return true;
                return false;
            };

            for (let i=0; i<targetWordStr.length; i++) {
                const char = targetWordStr[i];
                let placed = false;
                let attempts = 0;
                let newX, newY;
                while (!placed && attempts < 300) {
                    // 隨機生成位置，但逐步放寬限制
                    let range = (attempts < 100) ? 3 : (attempts < 200 ? 2 : 1);
                    newX = Math.floor(Math.random() * (GRID_W - 2*range)) + range;
                    newY = Math.floor(Math.random() * (GRID_H - 2*range)) + range;
                    // 嚴格相鄰檢查（距離 ≥ 2）
                    const tooClose = mapLetters.some(l => Math.abs(l.x - newX) + Math.abs(l.y - newY) <= 1);
                    if (!tooClose && !isForbidden(newX, newY)) {
                        placed = true;
                    }
                    attempts++;
                }
                // 若仍未找到，使用掃描法
                if (!placed) {
                    for (let gy=1; gy<GRID_H-1; gy++) {
                        for (let gx=1; gx<GRID_W-1; gx++) {
                            if (!isForbidden(gx, gy) && !mapLetters.some(l => Math.abs(l.x-gx)+Math.abs(l.y-gy) <= 1)) {
                                newX = gx; newY = gy; placed = true; break;
                            }
                        }
                        if (placed) break;
                    }
                }
                // 若仍無法放置（理論上不可能，因為有空格），則放在隨機位置（最壞情況）
                if (!placed) {
                    do {
                        newX = Math.floor(Math.random() * (GRID_W-2)) + 1;
                        newY = Math.floor(Math.random() * (GRID_H-2)) + 1;
                    } while (snake.some(s => s.x===newX && s.y===newY) || mapLetters.some(l => l.x===newX && l.y===newY));
                }
                mapLetters.push({char, x:newX, y:newY, id:i});
            }
        };

        const endGame = (reason='hearts') => {
            if (!isEngineActive) return;
            isEngineActive=false;
            gameEndReasonRef.current=reason;
            const hearts=Math.max(0,engineHearts), total=engineScore+hearts*10;
            setScoreUI(engineScore); setFinalScoreUI(total); setHeartsUI(hearts);
            if (gameModeRef.current==='survival') setTimeLeftUI(elapsedSeconds);
            setUiPhase('gameover');
            if ((gameModeRef.current==='normal'||gameModeRef.current==='survival')&&total>0&&qualifyingBook&&window.handleSaveScore) {
                window.handleSaveScore({ mode:`snake_${gameModeRef.current}`, book:qualifyingBook, week:window.getWeekNumber?window.getWeekNumber():0, score:total, time:Date.now() });
            }
        };

        const triggerDamage = () => {
            if (isInvincible||!isEngineActive) return;
            engineHearts--; setHeartsUI(engineHearts); damageFlashStart=Date.now();
            if (engineHearts<=0) endGame('hearts');
            else { isInvincible=true; setTimeout(()=>{isInvincible=false;},3000); }
        };

        const timerInterval=setInterval(()=>{
            if (uiPhaseRef.current!=='playing'||!isEngineActive) return;
            if (gameModeRef.current==='survival') {
                elapsedSeconds++; setTimeLeftUI(elapsedSeconds);
            } else {
                engineTime--; setTimeLeftUI(engineTime);
                if (engineTime<=0) endGame('time');
            }
        },1000);

        // ── drawGame ──
        const drawGame = () => {
            ctx.drawImage(bgCanvas,0,0);
            const expectedChar=targetWordStr[currentLetterIndex];
            mapLetters.forEach(letter => {
                const lx=letter.x*TILE_SIZE+TILE_SIZE/2, ly=letter.y*TILE_SIZE+TILE_SIZE/2;
                const isEasyTarget=gameModeRef.current==='easy'&&letter.char===expectedChar;
                if (isEasyTarget){ctx.shadowBlur=18;ctx.shadowColor='#fbbf24';}
                ctx.fillStyle=isEasyTarget?'#f59e0b':'#dc2626';
                ctx.beginPath(); ctx.arc(lx,ly,TILE_SIZE*0.42,0,Math.PI*2); ctx.fill();
                ctx.shadowBlur=0;
                ctx.strokeStyle=isEasyTarget?'#78350f':'#7f1d1d'; ctx.lineWidth=1.8;
                ctx.beginPath(); ctx.moveTo(lx,ly-TILE_SIZE*0.42); ctx.lineTo(lx+3,ly-TILE_SIZE*0.54); ctx.stroke();
                ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.beginPath();
                ctx.ellipse(lx-TILE_SIZE*0.1,ly-TILE_SIZE*0.12,TILE_SIZE*0.13,TILE_SIZE*0.09,-0.5,0,Math.PI*2); ctx.fill();
                ctx.fillStyle='white'; ctx.font='bold 20px "Courier New",monospace';
                ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(letter.char,lx,ly+1);
            });

            snake.forEach((seg,index) => {
                const sx=seg.x*TILE_SIZE,sy=seg.y*TILE_SIZE;
                if (isInvincible) ctx.globalAlpha=Math.floor(Date.now()/200)%2===0?0.28:0.78;
                if (index===0) {
                    ctx.fillStyle=isInvincible?'#38bdf8':'#15803d';
                    snakeRoundRect(ctx,sx+2,sy+2,TILE_SIZE-4,TILE_SIZE-4,9); ctx.fill();
                    if (!isInvincible){ctx.fillStyle='#166534';snakeRoundRect(ctx,sx+6,sy+6,TILE_SIZE-12,TILE_SIZE-12,5);ctx.fill();}
                    const dir=currentDirRef.current;
                    const eyes={RIGHT:[{ex:0.72,ey:0.28},{ex:0.72,ey:0.72}],LEFT:[{ex:0.28,ey:0.28},{ex:0.28,ey:0.72}],UP:[{ex:0.28,ey:0.28},{ex:0.72,ey:0.28}],DOWN:[{ex:0.28,ey:0.72},{ex:0.72,ey:0.72}]}[dir]||[{ex:0.72,ey:0.28},{ex:0.72,ey:0.72}];
                    const po={RIGHT:[1.5,0],LEFT:[-1.5,0],UP:[0,-1.5],DOWN:[0,1.5]}[dir]||[0,0];
                    eyes.forEach(e=>{
                        ctx.globalAlpha=1; ctx.fillStyle='white'; ctx.beginPath(); ctx.arc(sx+e.ex*TILE_SIZE,sy+e.ey*TILE_SIZE,5.5,0,Math.PI*2); ctx.fill();
                        ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(sx+e.ex*TILE_SIZE+po[0],sy+e.ey*TILE_SIZE+po[1],2.8,0,Math.PI*2); ctx.fill();
                    });
                    ctx.globalAlpha=1;
                    if (!isInvincible) {
                        const tb={RIGHT:{x:sx+TILE_SIZE,y:sy+TILE_SIZE/2,dx:9,dy:0},LEFT:{x:sx,y:sy+TILE_SIZE/2,dx:-9,dy:0},UP:{x:sx+TILE_SIZE/2,y:sy,dx:0,dy:-9},DOWN:{x:sx+TILE_SIZE/2,y:sy+TILE_SIZE,dx:0,dy:9}}[dir]||{x:sx+TILE_SIZE,y:sy+TILE_SIZE/2,dx:9,dy:0};
                        ctx.strokeStyle='#dc2626'; ctx.lineWidth=2;
                        const px=tb.dy!==0?4:0,py=tb.dx!==0?4:0;
                        ctx.beginPath();ctx.moveTo(tb.x,tb.y);ctx.lineTo(tb.x+tb.dx,tb.y+tb.dy);ctx.stroke();
                        ctx.beginPath();ctx.moveTo(tb.x+tb.dx,tb.y+tb.dy);ctx.lineTo(tb.x+tb.dx+px,tb.y+tb.dy+py);ctx.stroke();
                        ctx.beginPath();ctx.moveTo(tb.x+tb.dx,tb.y+tb.dy);ctx.lineTo(tb.x+tb.dx-px,tb.y+tb.dy-py);ctx.stroke();
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

        let lastTime=0, animationFrameId;
        const update=(timestamp)=>{
            if (!isEngineActive) return;

            if (uiPhaseRef.current==='playing'&&!hasStarted) {
                hasStarted=true;
                if (gameModeRef.current==='survival') wordQueue=[...filteredWords].sort(()=>Math.random()-0.5);
                spawnNextWord();
            }

            if (uiPhaseRef.current==='playing') {
                const tickRate=gameModeRef.current==='easy'
                    ? EASY_RATES[Math.min(wordsCompleted,EASY_RATES.length-1)]
                    : 200;

                if (timestamp-lastTime>tickRate) {
                    lastTime=timestamp;

                    // BFS 路徑規劃
                    if (targetPosRef.current) {
                        const target = targetPosRef.current;
                        if (target.x === snake[0].x && target.y === snake[0].y) {
                            targetPosRef.current = null;
                        } else {
                            const path = bfsPath(snake[0], target, snake);
                            if (path && path.length > 0) {
                                const dir = path[0];
                                const opp={UP:'DOWN',DOWN:'UP',LEFT:'RIGHT',RIGHT:'LEFT'};
                                if (dir !== opp[currentDirRef.current]) {
                                    nextDirRef.current = dir;
                                } else {
                                    targetPosRef.current = null;
                                }
                            } else {
                                targetPosRef.current = null;
                            }
                        }
                    }

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
                    snakeHeadRef.current=snake[0];

                    if(!isInvincible&&snake.slice(1).some(s=>s.x===head.x&&s.y===head.y))triggerDamage();

                    const ai=mapLetters.findIndex(l=>l.x===head.x&&l.y===head.y);
                    if(ai!==-1){
                        const hl=mapLetters[ai],ec=targetWordStr[currentLetterIndex];
                        if(hl.char===ec){
                            mapLetters.splice(ai,1); engineScore+=10; setScoreUI(engineScore);
                            currentLetterIndex++; spelledStr+=hl.char; setSpelledLetters(spelledStr);
                            if(currentLetterIndex>=targetWordStr.length){
                                engineScore+=50; setScoreUI(engineScore);
                                wordsCompleted++; spawnNextWord();
                            }
                        } else { triggerDamage(); snake.pop(); }
                    } else { snake.pop(); }

                    if (targetPosRef.current && snake[0].x === targetPosRef.current.x && snake[0].y === targetPosRef.current.y) {
                        targetPosRef.current = null;
                    }
                }
            }
            drawGame();
            animationFrameId=requestAnimationFrame(update);
        };
        animationFrameId=requestAnimationFrame(update);

        // 鍵盤控制
        const handleKeyDown=(e)=>{
            if(uiPhaseRef.current!=='playing')return;
            if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))e.preventDefault();
            if(e.key==='ArrowUp'   &&currentDirRef.current!=='DOWN') { nextDirRef.current='UP'; targetPosRef.current=null; }
            if(e.key==='ArrowDown' &&currentDirRef.current!=='UP')   { nextDirRef.current='DOWN'; targetPosRef.current=null; }
            if(e.key==='ArrowLeft' &&currentDirRef.current!=='RIGHT'){ nextDirRef.current='LEFT'; targetPosRef.current=null; }
            if(e.key==='ArrowRight'&&currentDirRef.current!=='LEFT') { nextDirRef.current='RIGHT'; targetPosRef.current=null; }
        };
        const preventScroll=(e)=>e.preventDefault();
        const preventContext=(e)=>e.preventDefault();
        const savedOverscroll=document.body.style.overscrollBehavior;
        document.body.style.overscrollBehavior='none';

        window.addEventListener('keydown',handleKeyDown);
        window.addEventListener('touchmove',preventScroll,{passive:false});
        document.addEventListener('contextmenu',preventContext);

        return ()=>{
            isEngineActive=false; clearInterval(timerInterval); cancelAnimationFrame(animationFrameId);
            window.removeEventListener('keydown',handleKeyDown);
            window.removeEventListener('touchmove',preventScroll);
            document.removeEventListener('contextmenu',preventContext);
            document.body.style.overscrollBehavior=savedOverscroll;
            targetPosRef.current = null;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uiPhase==='selecting'||uiPhase==='orientation']);

    /* ══════════════════════════════════════
       共用：語言切換按鈕
    ══════════════════════════════════════ */
    const LangBtn = ({style={}}) => (
        <button onClick={()=>setLang(l=>l==='zh-TW'?'en':'zh-TW')} className="sna-wood-btn"
            style={{ padding:'6px 12px', borderRadius:9, fontSize:13, ...style }}
            onPointerDown={e=>e.stopPropagation()}>
            {lang==='zh-TW'?'EN':'中文'}
        </button>
    );

    const forestBg = {
        width:'100%', height:'100svh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', padding:24, position:'relative',
        overflow:'hidden', background:'radial-gradient(ellipse at 50% 60%,#166534 0%,#052e16 55%,#021a0e 100%)'
    };

    /* ══════════════════════════════════════
       畫面 1：選擇難度
    ══════════════════════════════════════ */
    if (uiPhase==='selecting') return (
        <div style={forestBg}>
            <style dangerouslySetInnerHTML={{ __html: SNAKE_CSS }}/>
            <div style={{ position:'absolute', top:16, right:16, zIndex:10 }}><LangBtn/></div>
            <div className="sna-wood" style={{ borderRadius:24, padding:'32px 36px', maxWidth:440, width:'100%', textAlign:'center', zIndex:1 }}>
                <div style={{ fontSize:52, marginBottom:10, lineHeight:1 }}>🐍</div>
                <h1 style={{ fontSize:26, fontWeight:900, color:'#fef3c7', marginBottom:6, letterSpacing:2, textShadow:'0 2px 8px rgba(0,0,0,.55)' }}>{t.title}</h1>
                <p style={{ color:'#fde68a', marginBottom:22, fontWeight:600, opacity:.85, fontSize:14 }}>{t.chooseMode}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    <button onClick={()=>handleModeSelect('easy')} className="sna-wood-btn" style={{ padding:'15px 20px', borderRadius:14, fontWeight:900, fontSize:17 }}>
                        {t.easy}<div style={{ fontSize:12, fontWeight:500, opacity:.78, marginTop:4 }}>{t.easyDesc}</div>
                    </button>
                    <button onClick={()=>handleModeSelect('normal')} className="sna-wood-btn" style={{ padding:'15px 20px', borderRadius:14, fontWeight:900, fontSize:17 }}>
                        {t.normal}<div style={{ fontSize:12, fontWeight:500, opacity:.78, marginTop:4 }}>{t.normalDesc}</div>
                    </button>
                    <button onClick={()=>handleModeSelect('survival')} className="sna-wood-btn" style={{ padding:'15px 20px', borderRadius:14, fontWeight:900, fontSize:17 }}>
                        {t.survival}<div style={{ fontSize:12, fontWeight:500, opacity:.78, marginTop:4 }}>{t.survivalDesc}</div>
                    </button>
                </div>
                <button onClick={onBack} style={{ marginTop:18, color:'#fde68a', background:'none', border:'none', cursor:'pointer', fontWeight:700, fontSize:13, opacity:.75 }}>{t.back}</button>
            </div>
        </div>
    );

    /* ══════════════════════════════════════
       畫面 2：設備轉向提醒
    ══════════════════════════════════════ */
    if (uiPhase==='orientation') return (
        <div style={{ position:'fixed', inset:0, background:'rgba(5,46,22,1)', zIndex:100, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', color:'white', padding:24, textAlign:'center' }}>
            <style dangerouslySetInnerHTML={{ __html: SNAKE_CSS }}/>
            <div style={{ position:'absolute', top:16, right:16 }}><LangBtn/></div>
            <div style={{ position:'absolute', top:16, left:16 }}>
                <button onPointerDown={()=>setUiPhase('selecting')} className="sna-wood-btn" style={{ padding:'6px 12px', borderRadius:9, fontSize:13 }}>{t.back}</button>
            </div>
            <i className="fa-solid fa-mobile-screen" style={{ fontSize:54, marginBottom:18, transform:'rotate(-90deg)', color:'#4ade80' }}></i>
            <h2 style={{ fontSize:24, fontWeight:900, marginBottom:8, color:'#86efac' }}>{t.orientTitle}</h2>
            <p style={{ color:'#bbf7d0', fontSize:14, marginBottom:36 }}>{t.orientDesc}</p>
            <button onClick={()=>setUiPhase('ready')} className="sna-wood-btn" style={{ padding:'12px 24px', borderRadius:12, fontWeight:700, fontSize:15 }}>{t.forceStart}</button>
        </div>
    );

    /* ══════════════════════════════════════
       畫面 3,4,5：Ready / Playing / Gameover
    ══════════════════════════════════════ */
    const resultTitle = () => {
        const r=gameEndReasonRef.current;
        if (r==='time') return t.success;
        if (r==='board') return t.failBoard;
        if (gameMode==='survival') return t.survivalEnd;
        return t.failHearts;
    };

    return (
        <div ref={containerRef} onPointerDown={handleContainerTap} onContextMenu={e=>e.preventDefault()}
            style={{ position:'fixed', inset:0, width:'100vw', height:'100vh', touchAction:'none', overscrollBehavior:'none', overflow:'hidden', background:'#052e16', userSelect:'none' }}>
            <style dangerouslySetInnerHTML={{ __html: SNAKE_CSS }}/>

            {/* ── 整體框架 ── */}
            <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: DESIGN_W,
                height: DESIGN_H,
                transform: `translate(-50%, -50%) scale(${scale})`,
                transformOrigin: 'center center',
                background: 'transparent',
                pointerEvents: 'none',
            }}>
                {/* 木質標題列 */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: 50,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0 14px', boxSizing: 'border-box',
                    background: 'linear-gradient(90deg,#3a1a00,#713f12 50%,#3a1a00)',
                    borderBottom: '2px solid #92400e',
                    boxShadow: '0 2px 16px rgba(0,0,0,.55)',
                    pointerEvents: 'auto',
                }}>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                        <button onClick={onBack} className="sna-wood-btn" style={{ padding:'4px 10px', borderRadius:8, fontSize:13, border:'1px solid #92400e' }} onPointerDown={e=>e.stopPropagation()}>{t.quit}</button>
                        <div className="sna-wood" style={{ borderRadius:8, padding:'4px 12px', fontWeight:800, color:'#fef3c7', fontSize:15 }}>🌿 {scoreUI}</div>
                    </div>
                    <div style={{ display:'flex', gap:2 }}>
                        {[...Array(5)].map((_,i)=><span key={i} style={{ opacity:i<heartsUI?1:0.22, fontSize:16 }}>{i<heartsUI?'❤️':'🤍'}</span>)}
                    </div>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                        <div style={{ background:'rgba(220,38,38,.88)', padding:'4px 10px', borderRadius:8, fontWeight:800, color:'#fef2f2', fontSize:13, border:'1px solid #dc2626' }}>
                            {gameMode==='survival'?'⏱':' ⏱'} {fmtTime(gameMode,timeLeftUI)}
                        </div>
                        <LangBtn style={{ padding:'4px 10px', borderRadius:8, fontSize:13 }}/>
                    </div>
                </div>

                {/* 單字木牌 */}
                {uiPhase==='playing' && currentWordObj && (
                    <div style={{
                        position: 'absolute', top: 50, left: '50%', transform: 'translateX(-50%)',
                        pointerEvents: 'none', zIndex: 10,
                    }}>
                        <div className="sna-wood" style={{ borderRadius:12, padding:'6px 16px', textAlign:'center', whiteSpace:'nowrap' }}>
                            <p style={{ color:'#fde68a', fontSize:12, fontWeight:600, marginBottom:2, opacity:.88 }}>{currentWordObj.zh}</p>
                            <div style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'center' }}>
                                <span style={{ fontSize:22, fontWeight:900, letterSpacing:3, fontFamily:'"Courier New",monospace' }}>
                                    <span style={{ color:'#86efac' }}>{spelledLetters}</span>
                                    <span style={{ color:'#a16207' }}>{currentWordObj.en.replace(/\s+/g,'').toUpperCase().substring(spelledLetters.length)}</span>
                                </span>
                                <button onClick={e=>{e.stopPropagation();playVoice(currentWordObj.en);}}
                                    style={{ pointerEvents:'auto', background:'#166534', border:'1px solid #4ade80', color:'#86efac', width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:12 }}
                                    onPointerDown={e=>e.stopPropagation()}>
                                    <i className="fa-solid fa-volume-high"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Canvas 區域 */}
                <div style={{
                    position: 'absolute', top: 110, left: 0, width: DESIGN_W, height: GRID_H * TILE_SIZE,
                    pointerEvents: 'auto',
                }}>
                    <canvas ref={canvasRef}
                        width={GRID_W * TILE_SIZE}
                        height={GRID_H * TILE_SIZE}
                        style={{ width: '100%', height: '100%', display: 'block', background: '#052e16' }}
                    />
                </div>

                {/* Ready 按鈕 */}
                {uiPhase==='ready' && (
                    <div style={{
                        position: 'absolute', top: 110, left: 0, width: DESIGN_W, height: GRID_H * TILE_SIZE,
                        background: 'rgba(5,46,22,0.65)', zIndex: 20,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
                        pointerEvents: 'auto',
                    }} onPointerDown={e=>e.stopPropagation()}>
                        <div style={{ color:'#fde68a', fontWeight:700, fontSize:15, opacity:.85, background:'rgba(0,0,0,.25)', padding:'4px 14px', borderRadius:8 }}>
                            {gameMode==='easy'?t.easy:gameMode==='normal'?t.normal:t.survival}
                        </div>
                        <button onClick={()=>setUiPhase('playing')} className="sna-wood-btn"
                            style={{ padding:'16px 40px', borderRadius:18, fontSize:26, fontWeight:900, animation:'pulseSoft 1.5s infinite' }}>
                            {t.readyBtn}
                        </button>
                    </div>
                )}

                {/* 結算畫面 */}
                {uiPhase==='gameover' && (
                    <div style={{
                        position: 'absolute', top: 110, left: 0, width: DESIGN_W, height: GRID_H * TILE_SIZE,
                        background: 'rgba(5,46,22,0.97)', zIndex: 50,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20,
                        animation: 'snkFadeIn .5s ease-out', pointerEvents: 'auto',
                    }} onPointerDown={e=>e.stopPropagation()}>
                        <div style={{ position:'absolute', top:12, right:12 }}><LangBtn/></div>
                        <div style={{ fontSize:50, marginBottom:8 }}>
                            {gameEndReasonRef.current==='time'?'🏆':gameEndReasonRef.current==='board'?'🌿':'💀'}
                        </div>
                        <h2 style={{ fontSize:22, fontWeight:900, color:'#fef3c7', marginBottom:14 }}>{resultTitle()}</h2>

                        {gameMode==='survival' && (
                            <div style={{ color:'#86efac', fontSize:20, fontWeight:900, marginBottom:12, background:'rgba(0,0,0,.2)', padding:'6px 20px', borderRadius:10 }}>
                                ⏱ {fmtTime('survival',timeLeftUI)}
                            </div>
                        )}

                        <div className="sna-wood" style={{ borderRadius:18, padding:18, marginBottom:14, width:'100%', maxWidth:340 }}>
                            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontWeight:700, color:'#fde68a' }}>
                                <span>{t.gameScore}</span><span>{scoreUI}</span>
                            </div>
                            <div style={{ display:'flex', justifyContent:'space-between', paddingBottom:10, marginBottom:10, borderBottom:'1px solid rgba(255,255,255,.15)', fontWeight:700, color:'#fda4af' }}>
                                <span>{t.heartBonus} ({heartsUI}×10)</span><span>+{heartsUI*10}</span>
                            </div>
                            <div style={{ display:'flex', justifyContent:'space-between', fontWeight:900, fontSize:20, color:'#86efac' }}>
                                <span>{t.totalResult}</span><span>{finalScoreUI}</span>
                            </div>
                        </div>

                        {gameMode==='easy' ? (
                            <p style={{ color:'#a16207', fontSize:12, marginBottom:14, fontWeight:600 }}>{t.practiceNote}</p>
                        ) : gameMode==='survival' ? (
                            <p style={{ color:'#86efac', fontWeight:700, marginBottom:14, padding:'6px 14px', borderRadius:10, background:'rgba(134,239,172,.1)', border:'1px solid rgba(134,239,172,.3)', fontSize:12 }}>{t.survivalNote}</p>
                        ) : qualifyingBook ? (
                            <p style={{ color:'#86efac', fontWeight:700, marginBottom:14, padding:'6px 14px', borderRadius:10, background:'rgba(134,239,172,.1)', border:'1px solid rgba(134,239,172,.3)', fontSize:12 }}>{t.saved}</p>
                        ) : (
                            <p style={{ color:'#a16207', fontSize:12, marginBottom:14, fontWeight:600 }}>{t.practiceNote}</p>
                        )}

                        <button onClick={onBack} className="sna-wood-btn" style={{ padding:'10px 32px', borderRadius:12, fontWeight:900, fontSize:16 }}>{t.backBtn}</button>
                    </div>
                )}

                {/* D-pad */}
                {uiPhase==='playing' && (
                    <div style={{
                        position: 'absolute', bottom: 20, left: 20,
                        display:'grid', gridTemplateColumns:'repeat(3,50px)', gridTemplateRows:'repeat(3,50px)', gap:3,
                        filter:'drop-shadow(0 3px 10px rgba(0,0,0,0.55))', pointerEvents: 'auto',
                        opacity: 0.70,
                    }}>
                        <div/>
                        <button className="dpad-btn" onPointerDown={e=>{e.stopPropagation();handleDPad('UP');}}
                            style={{ background:'rgba(5,46,22,0.82)', border:'2px solid rgba(74,222,128,0.5)', borderRadius:'12px 12px 4px 4px', color:'#86efac', fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>▲</button>
                        <div/>
                        <button className="dpad-btn" onPointerDown={e=>{e.stopPropagation();handleDPad('LEFT');}}
                            style={{ background:'rgba(5,46,22,0.82)', border:'2px solid rgba(74,222,128,0.5)', borderRadius:'12px 4px 4px 12px', color:'#86efac', fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>◀</button>
                        <div style={{ background:'rgba(5,46,22,0.55)', borderRadius:6, border:'1px solid rgba(74,222,128,0.2)' }}/>
                        <button className="dpad-btn" onPointerDown={e=>{e.stopPropagation();handleDPad('RIGHT');}}
                            style={{ background:'rgba(5,46,22,0.82)', border:'2px solid rgba(74,222,128,0.5)', borderRadius:'4px 12px 12px 4px', color:'#86efac', fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>▶</button>
                        <div/>
                        <button className="dpad-btn" onPointerDown={e=>{e.stopPropagation();handleDPad('DOWN');}}
                            style={{ background:'rgba(5,46,22,0.82)', border:'2px solid rgba(74,222,128,0.5)', borderRadius:'4px 4px 12px 12px', color:'#86efac', fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>▼</button>
                        <div/>
                    </div>
                )}

                {/* 漣漪紅點 */}
                {tapDot && (
                    <div key={tapDot.id} style={{ position:'absolute', left:tapDot.x, top:tapDot.y, pointerEvents:'none', zIndex:12 }}>
                        <div className="tap-ripple" style={{ position:'absolute', width:20, height:20, borderRadius:'50%', border:'2px solid rgba(220,38,38,0.65)' }}/>
                        <div className="tap-center" style={{ position:'absolute', width:12, height:12, borderRadius:'50%', background:'rgba(220,38,38,0.92)', boxShadow:'0 0 6px rgba(220,38,38,0.6)' }}/>
                    </div>
                )}

                {/* 蝴蝶 */}
                {bfVisible && (
                    <div style={{
                        position: 'absolute',
                        left: `${bfPos.x}%`,
                        top: `${bfPos.y}%`,
                        transform: `translate(-50%,-50%) scaleX(${bfFlip?-1:1})`,
                        pointerEvents:'none', zIndex:5,
                        animation:'bfFloat 1.9s ease-in-out infinite',
                    }}>
                        <svg viewBox="0 0 62 44" width="46" height="34">
                            <g className="bf-wing-l"><ellipse cx="22" cy="17" rx="20" ry="14" fill="#fb923c" opacity="0.76"/><ellipse cx="17" cy="31" rx="14" ry="9" fill="#fed7aa" opacity="0.70"/></g>
                            <g className="bf-wing-r"><ellipse cx="40" cy="17" rx="20" ry="14" fill="#fb923c" opacity="0.76"/><ellipse cx="45" cy="31" rx="14" ry="9" fill="#fed7aa" opacity="0.70"/></g>
                            <ellipse cx="31" cy="22" rx="2.8" ry="13" fill="#1c1917"/>
                            <line x1="31" y1="9" x2="23" y2="2" stroke="#1c1917" strokeWidth="1.5"/><circle cx="22" cy="1.5" r="2.2" fill="#1c1917"/>
                            <line x1="31" y1="9" x2="39" y2="2" stroke="#1c1917" strokeWidth="1.5"/><circle cx="40" cy="1.5" r="2.2" fill="#1c1917"/>
                        </svg>
                    </div>
                )}

                {/* 動物探頭 */}
                {animalPeek && (
                    <div key={animalPeek.key} style={{ position:'absolute', bottom:0, left:`${animalPeek.pos}%`, pointerEvents:'none', zIndex:6 }}>
                        <div style={{ transform:'translateX(-50%)', animation:'snkPeekUp 3.4s ease-in-out forwards' }}>
                            {PEEK_ANIMALS[animalPeek.animalIdx].jsx}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

window.SnakeSingle = SnakeSingle;
