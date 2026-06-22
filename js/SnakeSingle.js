function SnakeSingle({ onBack, settings, wordDatabase, qualifyingBook, onSaveScore }) {
    const { useState, useEffect, useRef, useCallback } = React;
    
    // ── 模式與 UI 狀態 ──
    const [gameMode, setGameMode] = useState('selecting'); // 'selecting' | 'easy' | 'normal'
    const [gameStarted, setGameStarted] = useState(false);
    const gameModeRef = useRef(gameMode);
    useEffect(() => { gameModeRef.current = gameMode; }, [gameMode]);

    const canvasRef = useRef(null);
    const [scoreUI, setScoreUI] = useState(0);
    const [heartsUI, setHeartsUI] = useState(5);
    const [timeLeftUI, setTimeLeftUI] = useState(60);
    const [currentWordObj, setCurrentWordObj] = useState(null);
    const [spelledLetters, setSpelledLetters] = useState("");
    const [isGameOver, setIsGameOver] = useState(false);
    const [finalScoreUI, setFinalScoreUI] = useState(0);

    // 過濾題庫
    const filteredWords = wordDatabase.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));

    // 語音引擎 (加入解鎖機制)
    const playVoice = useCallback((text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance(text);
            msg.lang = 'en-US';
            msg.rate = 0.85;
            window.speechSynthesis.speak(msg);
        }
    }, []);

    // ── 遊戲引擎 ──
    useEffect(() => {
        if (!gameStarted) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!canvas || !ctx || filteredWords.length === 0) return;

        const isEasy = gameModeRef.current === 'easy';

        let engineHearts = 5;
        let engineScore = 0;
        let engineTime = 60;
        let isInvincible = false;
        let isEngineRunning = true;
        
        const GRID_W = 24;
        const GRID_H = 14;
        const TILE_SIZE = 40;
        canvas.width = GRID_W * TILE_SIZE;
        canvas.height = GRID_H * TILE_SIZE;

        let snake = [{x: 12, y: 7}, {x: 11, y: 7}, {x: 10, y: 7}];
        let currentDir = 'RIGHT';
        let nextDir = 'RIGHT';

        let activeWordObj = null;
        let targetWordStr = "";
        let currentLetterIndex = 0;
        let spelledStr = "";
        let mapLetters = [];

        const spawnNextWord = () => {
            activeWordObj = filteredWords[Math.floor(Math.random() * filteredWords.length)];
            targetWordStr = activeWordObj.en.replace(/\s+/g, '').toUpperCase();
            currentLetterIndex = 0;
            spelledStr = "";
            mapLetters = [];

            setCurrentWordObj(activeWordObj);
            setSpelledLetters("");
            playVoice(activeWordObj.en);

            for (let i = 0; i < targetWordStr.length; i++) {
                let char = targetWordStr[i];
                let isValid = false;
                let newX, newY;
                while (!isValid) {
                    newX = Math.floor(Math.random() * (GRID_W - 2)) + 1;
                    newY = Math.floor(Math.random() * (GRID_H - 2)) + 1;
                    let onSnake = snake.some(seg => seg.x === newX && seg.y === newY);
                    let onLetter = mapLetters.some(l => l.x === newX && l.y === newY);
                    isValid = !onSnake && !onLetter;
                }
                mapLetters.push({ char, x: newX, y: newY, id: i }); // 加上 ID 確保刪除精準
            }
        };

        const endGame = (isTimeUp = false) => {
            if (!isEngineRunning) return;
            isEngineRunning = false;
            
            const finalHearts = Math.max(0, engineHearts);
            const heartBonus = finalHearts * 10;
            const totalScore = engineScore + heartBonus;
            
            setScoreUI(engineScore);
            setFinalScoreUI(totalScore);
            setIsGameOver(true);

            // 🌟 完美銜接 V4 架構：一般模式直接默默上傳「個人最佳成績」
            if (gameModeRef.current === 'normal' && totalScore > 0 && qualifyingBook && window.handleSaveScore) {
                window.handleSaveScore({
                    mode: 'snake_single',
                    book: qualifyingBook,
                    week: window.getWeekNumber ? window.getWeekNumber() : 0,
                    score: totalScore,
                    time: Date.now()
                });
            }
        };

        const triggerDamage = () => {
            if (isInvincible || !isEngineRunning) return;
            engineHearts--;
            setHeartsUI(engineHearts);
            ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            if (engineHearts <= 0) {
                endGame(false);
            } else {
                isInvincible = true;
                setTimeout(() => { isInvincible = false; }, 3000);
            }
        };

        spawnNextWord();

        const timerInterval = setInterval(() => {
            if (isEngineRunning && engineTime > 0) {
                engineTime--;
                setTimeLeftUI(engineTime);
                if (engineTime <= 0) endGame(true);
            }
        }, 1000);

        const drawGame = () => {
            for (let y = 0; y < GRID_H; y++) {
                for (let x = 0; x < GRID_W; x++) {
                    ctx.fillStyle = (x + y) % 2 === 0 ? '#10b981' : '#059669';
                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    if (x === 0 || x === GRID_W - 1 || y === 0 || y === GRID_H - 1) {
                        ctx.fillStyle = '#064e3b';
                        ctx.beginPath();
                        ctx.arc(x * TILE_SIZE + TILE_SIZE/2, y * TILE_SIZE + TILE_SIZE/2, TILE_SIZE*0.6, 0, Math.PI*2);
                        ctx.fill();
                    }
                }
            }
            
            let expectedChar = targetWordStr[currentLetterIndex];
            mapLetters.forEach(letter => {
                let isTarget = (letter.char === expectedChar);
                if (isEasy && isTarget) {
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = 'yellow';
                } else {
                    ctx.shadowBlur = 0;
                    ctx.shadowColor = 'transparent';
                }
                ctx.fillStyle = isEasy && isTarget ? '#fbbf24' : '#ef4444';
                ctx.beginPath();
                ctx.arc(letter.x * TILE_SIZE + TILE_SIZE/2, letter.y * TILE_SIZE + TILE_SIZE/2, TILE_SIZE*0.45, 0, Math.PI*2);
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.fillStyle = 'black';
                ctx.font = 'bold 22px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(letter.char, letter.x * TILE_SIZE + TILE_SIZE/2, letter.y * TILE_SIZE + TILE_SIZE/2);
            });
            
            snake.forEach((segment, index) => {
                if (isInvincible) {
                    ctx.globalAlpha = Math.floor(Date.now() / 200) % 2 === 0 ? 0.3 : 0.7;
                    ctx.fillStyle = index === 0 ? '#38bdf8' : '#bae6fd';
                } else {
                    ctx.globalAlpha = 1.0;
                    ctx.fillStyle = index === 0 ? '#f97316' : '#fdba74';
                }
                ctx.fillRect(segment.x * TILE_SIZE + 2, segment.y * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            });
            ctx.globalAlpha = 1.0;
        };

        let lastTime = 0;
        const tickRate = 200;
        let animationFrameId;

        const update = (timestamp) => {
            if (!isEngineRunning) return;
            if (timestamp - lastTime > tickRate) {
                lastTime = timestamp;
                currentDir = nextDir;
                let head = { ...snake[0] };
                if (currentDir === 'UP') head.y--;
                if (currentDir === 'DOWN') head.y++;
                if (currentDir === 'LEFT') head.x--;
                if (currentDir === 'RIGHT') head.x++;

                let hitWall = false;
                if (head.x < 0) { head.x = GRID_W - 1; hitWall = true; }
                else if (head.x >= GRID_W) { head.x = 0; hitWall = true; }
                if (head.y < 0) { head.y = GRID_H - 1; hitWall = true; }
                else if (head.y >= GRID_H) { head.y = 0; hitWall = true; }
                if (hitWall) triggerDamage();

                snake.unshift(head);
                if (!isInvincible && snake.slice(1).some(seg => seg.x === head.x && seg.y === head.y)) {
                    triggerDamage();
                }

                let ateLetterIdx = mapLetters.findIndex(l => l.x === head.x && l.y === head.y);
                if (ateLetterIdx !== -1) {
                    let hitLetter = mapLetters[ateLetterIdx];
                    let expectedChar = targetWordStr[currentLetterIndex];
                    if (hitLetter.char === expectedChar) {
                        mapLetters.splice(ateLetterIdx, 1);
                        engineScore += 10;
                        setScoreUI(engineScore);
                        currentLetterIndex++;
                        spelledStr += hitLetter.char;
                        setSpelledLetters(spelledStr);
                        if (currentLetterIndex >= targetWordStr.length) {
                            engineScore += 50;
                            setScoreUI(engineScore);
                            spawnNextWord();
                        }
                    } else {
                        triggerDamage();
                        snake.pop(); 
                    }
                } else {
                    snake.pop(); 
                }
            }
            drawGame();
            animationFrameId = requestAnimationFrame(update);
        };

        animationFrameId = requestAnimationFrame(update);

        const handleKeyDown = (e) => {
            if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
            if (e.key === 'ArrowUp' && currentDir !== 'DOWN') nextDir = 'UP';
            if (e.key === 'ArrowDown' && currentDir !== 'UP') nextDir = 'DOWN';
            if (e.key === 'ArrowLeft' && currentDir !== 'RIGHT') nextDir = 'LEFT';
            if (e.key === 'ArrowRight' && currentDir !== 'LEFT') nextDir = 'RIGHT';
        };

        const handleTouchStart = (e) => {
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const dx = touchX - window.innerWidth / 2;
            const dy = touchY - window.innerHeight / 2;
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0 && currentDir !== 'LEFT') nextDir = 'RIGHT';
                if (dx < 0 && currentDir !== 'RIGHT') nextDir = 'LEFT';
            } else {
                if (dy > 0 && currentDir !== 'UP') nextDir = 'DOWN';
                if (dy < 0 && currentDir !== 'DOWN') nextDir = 'UP';
            }
        };

        const preventScroll = (e) => e.preventDefault();

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchmove', preventScroll, { passive: false });

        return () => {
            isEngineRunning = false;
            clearInterval(timerInterval);
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', preventScroll);
        };
    }, [gameStarted]); 

    // ── 遊戲啟動前：選單畫面 ──
    if (!gameStarted) {
        return (
            <div className="w-full h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6 animate-[fadeIn_0.3s_ease-out]">
                <h1 className="text-4xl sm:text-5xl font-black mb-4 text-emerald-400 drop-shadow-lg"><i className="fa-solid fa-staff-snake"></i> 貪食蛇大冒險</h1>
                <p className="text-slate-400 mb-10 text-lg">選擇挑戰難度</p>
                <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
                    <button
                        onClick={() => { 
                            // 破除 iOS 語音限制的魔法：在點擊當下先播一段空白聲音
                            playVoice(""); 
                            setGameMode('easy'); 
                            setGameStarted(true); 
                        }}
                        className="flex-1 px-6 py-6 bg-slate-800 border-2 border-emerald-500 hover:bg-emerald-600 rounded-2xl font-bold shadow-lg transition-all group"
                    >
                        <div className="text-2xl mb-2">🌟 簡易模式</div>
                        <p className="text-sm font-normal text-slate-400 group-hover:text-emerald-100">下一個字母會發光提示</p>
                    </button>
                    <button
                        onClick={() => { 
                            playVoice("");
                            setGameMode('normal'); 
                            setGameStarted(true); 
                        }}
                        className="flex-1 px-6 py-6 bg-slate-800 border-2 border-orange-500 hover:bg-orange-600 rounded-2xl font-bold shadow-lg transition-all group"
                    >
                        <div className="text-2xl mb-2">🔥 一般模式</div>
                        <p className="text-sm font-normal text-slate-400 group-hover:text-orange-100">無提示，自動存入榮譽榜</p>
                    </button>
                </div>
                <button onClick={onBack} className="mt-12 text-slate-500 hover:text-white transition font-bold px-6 py-2 rounded-full border border-slate-700 hover:bg-slate-800">
                    <i className="fa-solid fa-arrow-left mr-2"></i>回大廳
                </button>
            </div>
        );
    }

    // ── 遊戲進行中畫面 ──
    return (
        <div className="w-full h-screen bg-slate-900 flex flex-col relative touch-none overscroll-none overflow-hidden">
            <div className="absolute top-0 w-full flex justify-between items-center p-4 z-10 text-white font-bold drop-shadow-md">
                <div className="flex gap-4 items-center">
                    <button onClick={onBack} className="bg-slate-700/80 hover:bg-slate-600 px-4 py-2 rounded-xl backdrop-blur transition-colors">
                        <i className="fa-solid fa-arrow-left mr-2"></i>放棄
                    </button>
                    <div className="bg-red-500/90 px-4 py-2 rounded-xl border border-red-400 text-lg flex items-center gap-2">
                        <i className="fa-solid fa-stopwatch animate-pulse"></i> {timeLeftUI}s
                    </div>
                </div>
                <div className="text-2xl tracking-widest bg-slate-900/50 px-4 py-1 rounded-full hidden sm:block">
                    {'❤️'.repeat(heartsUI)}{'🤍'.repeat(5 - heartsUI)}
                </div>
                <div className="text-xl bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-600">
                    分數: <span className="text-emerald-400">{scoreUI}</span>
                </div>
            </div>

            {currentWordObj && !isGameOver && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
                    <div className="bg-slate-800/90 border-2 border-emerald-500 rounded-3xl px-8 py-4 shadow-2xl flex flex-col items-center">
                        <p className="text-slate-300 text-lg mb-1">{currentWordObj.zh}</p>
                        <div className="flex items-center gap-4">
                            <h2 className="text-3xl sm:text-4xl font-black tracking-widest text-white uppercase">
                                <span className="text-emerald-400">{spelledLetters}</span>
                                <span className="text-slate-500">{currentWordObj.en.replace(/\s+/g, '').toUpperCase().substring(spelledLetters.length)}</span>
                            </h2>
                            <button 
                                onClick={(e) => { e.stopPropagation(); playVoice(currentWordObj.en); }}
                                className="pointer-events-auto bg-emerald-500 hover:bg-emerald-400 text-white w-10 h-10 rounded-full flex justify-center items-center"
                            >
                                <i className="fa-solid fa-volume-high"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isGameOver && (
                <div className="absolute inset-0 z-50 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-white animate-[fadeIn_0.5s_ease-out]">
                    {heartsUI <= 0 ? (
                        <i className="fa-solid fa-skull text-6xl text-red-500 mb-4 animate-bounce"></i>
                    ) : (
                        <i className="fa-solid fa-clock text-6xl text-blue-400 mb-4 animate-bounce"></i>
                    )}
                    <h2 className="text-4xl font-black mb-2">{heartsUI <= 0 ? '生存失敗' : '時間到！生存成功'}</h2>
                    
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 my-6 text-center w-80 shadow-2xl">
                        <p className="text-slate-300 mb-2 flex justify-between font-bold">遊戲得分 <span>{scoreUI}</span></p>
                        <p className="text-pink-400 mb-4 flex justify-between border-b border-slate-600 pb-4 font-bold">
                            愛心紅利 ({heartsUI}x10) <span>+{heartsUI * 10}</span>
                        </p>
                        <p className="text-2xl font-black text-emerald-400 flex justify-between">
                            總結算 <span className="text-4xl">{finalScoreUI}</span>
                        </p>
                    </div>

                    {gameMode === 'normal' && qualifyingBook ? (
                        <p className="text-emerald-400 font-bold mb-8 bg-emerald-400/10 px-6 py-3 rounded-xl border border-emerald-500/30"><i className="fa-solid fa-cloud-arrow-up"></i> 個人最佳成績已自動存檔</p>
                    ) : (
                        <p className="text-slate-400 text-sm mb-8 font-bold">（簡易/練習模式，不列入排行榜）</p>
                    )}
                    <button onClick={onBack} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-10 rounded-2xl shadow-lg transition-transform hover:scale-105">
                        回主畫面
                    </button>
                </div>
            )}
            
            <canvas ref={canvasRef} className="w-full h-full object-contain bg-black" />
            
            <div className="fixed inset-0 bg-slate-900/95 z-[100] flex flex-col justify-center items-center text-white p-6 text-center portrait:flex landscape:hidden">
                <i className="fa-solid fa-mobile-screen text-6xl mb-6 animate-pulse -rotate-90"></i>
                <h2 className="text-3xl font-black mb-2 text-emerald-400">設備轉向提醒</h2>
                <p className="text-lg text-slate-300">請將平板或手機轉為<strong className="text-white">橫向</strong><br/>以獲得最佳視野與操控體驗</p>
            </div>
        </div>
    );
}

window.SnakeSingle = SnakeSingle;
