function SnakeSingle({ onBack, settings, wordDatabase, qualifyingBook, onSaveScore }) {
    const { useState, useEffect, useRef, useCallback } = React;
    
    // UI 狀態 (透過 React 渲染)
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [hearts, setHearts] = useState(3);
    const [currentWordObj, setCurrentWordObj] = useState(null);
    const [spelledLetters, setSpelledLetters] = useState("");
    const [isGameOver, setIsGameOver] = useState(false);

    // 過濾出目前設定範圍內的題庫
    const filteredWords = wordDatabase.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));

    // 語音朗讀功能 (Web Speech API)
    const playVoice = useCallback((text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // 停止上一個發音
            const msg = new SpeechSynthesisUtterance(text);
            msg.lang = 'en-US';
            msg.rate = 0.9; // 放慢一點適合國小生
            window.speechSynthesis.speak(msg);
        }
    }, []);

    // 遊戲核心引擎 (放在 useEffect 確保 Canvas 與事件監聽的生命週期)
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!canvas || !ctx || filteredWords.length === 0) return;

        // 引擎內部變數 (避免 React re-render 干擾 requestAnimationFrame 效能)
        let engineHearts = 3;
        let engineScore = 0;
        let isInvincible = false;
        
        // 網格設定 (24x14)
        const GRID_W = 24;
        const GRID_H = 14;
        const TILE_SIZE = 40;
        canvas.width = GRID_W * TILE_SIZE;
        canvas.height = GRID_H * TILE_SIZE;

        // 蛇的狀態
        let snake = [{x: 12, y: 7}, {x: 11, y: 7}, {x: 10, y: 7}];
        let currentDir = 'RIGHT';
        let nextDir = 'RIGHT';

        // 單字拆解狀態
        let currentWordIndex = 0;
        let activeWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
        let targetWordStr = activeWord.en.replace(/\s+/g, '').toUpperCase(); // 去除空格並轉大寫
        let currentLetterIndex = 0;
        
        // 地圖上的字母物件陣列
        let mapLetters = [];

        // 初始化 React UI 顯示
        setCurrentWordObj(activeWord);
        setSpelledLetters("");
        playVoice(activeWord.en);

        // 產生字母方塊
        const spawnLetter = () => {
            let newX, newY;
            let isValid = false;
            while (!isValid) {
                newX = Math.floor(Math.random() * (GRID_W - 2)) + 1;
                newY = Math.floor(Math.random() * (GRID_H - 2)) + 1;
                // 確保不會生在蛇的身體上
                isValid = !snake.some(segment => segment.x === newX && segment.y === newY);
            }
            
            mapLetters = [{
                x: newX, 
                y: newY, 
                char: targetWordStr[currentLetterIndex],
                isCorrect: true
            }];
            
            // 可以擴充：隨機生成 1~2 個錯誤字母作為干擾
        };

        spawnLetter();

        // 觸發傷害與容錯機制
        const triggerDamage = () => {
            engineHearts--;
            setHearts(engineHearts);
            
            // 畫面閃紅光
            ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (engineHearts <= 0) {
                setIsGameOver(true);
                // 結算成績寫入 Firestore
                if (qualifyingBook && engineScore > 0 && window.handleSaveScore) {
                    window.handleSaveScore({
                        mode: 'snake_single',
                        book: qualifyingBook,
                        week: window.getWeekNumber ? window.getWeekNumber() : 0,
                        score: engineScore,
                        time: Date.now()
                    });
                }
            } else {
                // 幽靈無敵模式 (3 秒)
                isInvincible = true;
                setTimeout(() => { isInvincible = false; }, 3000);
            }
        };

        // 繪圖函數
        const drawGame = () => {
            // 1. 畫雙色草地
            for (let y = 0; y < GRID_H; y++) {
                for (let x = 0; x < GRID_W; x++) {
                    ctx.fillStyle = (x + y) % 2 === 0 ? '#10b981' : '#059669'; // Tailwind Emerald 色系
                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    
                    // 畫邊界灌木叢
                    if (x === 0 || x === GRID_W - 1 || y === 0 || y === GRID_H - 1) {
                        ctx.fillStyle = '#064e3b'; 
                        ctx.beginPath();
                        ctx.arc(x * TILE_SIZE + TILE_SIZE/2, y * TILE_SIZE + TILE_SIZE/2, TILE_SIZE*0.6, 0, Math.PI*2);
                        ctx.fill();
                    }
                }
            }

            // 2. 畫字母目標
            mapLetters.forEach(letter => {
                ctx.shadowBlur = letter.isCorrect ? 15 : 0;
                ctx.shadowColor = letter.isCorrect ? 'yellow' : 'transparent';
                ctx.fillStyle = letter.isCorrect ? '#fbbf24' : '#ef4444';
                
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

            // 3. 畫蛇
            snake.forEach((segment, index) => {
                if (isInvincible) {
                    ctx.globalAlpha = Math.floor(Date.now() / 200) % 2 === 0 ? 0.3 : 0.7; // 閃爍效果
                    ctx.fillStyle = index === 0 ? '#38bdf8' : '#bae6fd'; // 幽靈藍
                } else {
                    ctx.globalAlpha = 1.0;
                    ctx.fillStyle = index === 0 ? '#f97316' : '#fdba74'; // 正常橘
                }
                ctx.fillRect(segment.x * TILE_SIZE + 2, segment.y * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            });
            ctx.globalAlpha = 1.0;
        };

        // 遊戲主迴圈
        let lastTime = 0;
        const tickRate = 200; // 移動速度 (毫秒)
        let animationFrameId;

        const update = (timestamp) => {
            if (engineHearts <= 0) return;

            if (timestamp - lastTime > tickRate) {
                lastTime = timestamp;
                currentDir = nextDir;
                let head = { ...snake[0] };

                // 移動邏輯
                if (currentDir === 'UP') head.y--;
                if (currentDir === 'DOWN') head.y++;
                if (currentDir === 'LEFT') head.x--;
                if (currentDir === 'RIGHT') head.x++;

                // 穿牆判定
                let hitWall = false;
                if (head.x < 0) { head.x = GRID_W - 1; hitWall = true; }
                else if (head.x >= GRID_W) { head.x = 0; hitWall = true; }
                if (head.y < 0) { head.y = GRID_H - 1; hitWall = true; }
                else if (head.y >= GRID_H) { head.y = 0; hitWall = true; }

                if (hitWall) triggerDamage();

                // 咬到自己判定
                if (!isInvincible && snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                    triggerDamage();
                }

                snake.unshift(head);

                // 吃字母判定
                let ateLetter = -1;
                mapLetters.forEach((letter, index) => {
                    if (head.x === letter.x && head.y === letter.y) ateLetter = index;
                });

                if (ateLetter !== -1) {
                    const eaten = mapLetters[ateLetter];
                    if (eaten.isCorrect) {
                        // 吃到正確字母
                        engineScore += 10;
                        setScore(engineScore);
                        currentLetterIndex++;
                        setSpelledLetters(targetWordStr.substring(0, currentLetterIndex));
                        
                        if (currentLetterIndex >= targetWordStr.length) {
                            // 拼完一整個單字，加分並換下一題
                            engineScore += 50;
                            setScore(engineScore);
                            activeWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
                            targetWordStr = activeWord.en.replace(/\s+/g, '').toUpperCase();
                            currentLetterIndex = 0;
                            setCurrentWordObj(activeWord);
                            setSpelledLetters("");
                            playVoice(activeWord.en);
                        }
                        spawnLetter();
                    } else {
                        // 吃到錯誤字母
                        triggerDamage();
                        snake.pop(); // 吐出來不變長
                    }
                } else {
                    snake.pop(); // 沒吃到東西，維持長度
                }
            }

            drawGame();
            animationFrameId = requestAnimationFrame(update);
        };

        animationFrameId = requestAnimationFrame(update);

        // --- 指令監聽區塊 ---
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
            const screenW = window.innerWidth;
            const screenH = window.innerHeight;
            const dx = touchX - screenW / 2;
            const dy = touchY - screenH / 2;

            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0 && currentDir !== 'LEFT') nextDir = 'RIGHT';
                if (dx < 0 && currentDir !== 'RIGHT') nextDir = 'LEFT';
            } else {
                if (dy > 0 && currentDir !== 'UP') nextDir = 'DOWN';
                if (dy < 0 && currentDir !== 'DOWN') nextDir = 'UP';
            }
        };

        // 阻擋原生滑動以防重整
        const preventScroll = (e) => e.preventDefault();

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchmove', preventScroll, { passive: false });

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', preventScroll);
        };
    }, [filteredWords, playVoice, qualifyingBook]);

    return (
        <div className="w-full h-screen bg-slate-900 flex flex-col relative touch-none overscroll-none overflow-hidden">
            
            {/* 頂部導覽與狀態列 */}
            <div className="absolute top-0 w-full flex justify-between items-center p-4 z-10 text-white font-bold drop-shadow-md">
                <button onClick={onBack} className="bg-slate-700/80 hover:bg-slate-600 px-4 py-2 rounded-xl backdrop-blur transition-colors">
                    <i className="fa-solid fa-arrow-left mr-2"></i>返回
                </button>
                <div className="text-2xl tracking-widest bg-slate-900/50 px-4 py-1 rounded-full">
                    {'❤️'.repeat(hearts)}
                </div>
                <div className="text-xl bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-600">
                    分數: <span className="text-emerald-400">{score}</span>
                </div>
            </div>

            {/* 提示字詞區塊 (UI Overlay) */}
            {currentWordObj && !isGameOver && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
                    <div className="bg-slate-800/90 border-2 border-emerald-500 rounded-3xl px-8 py-4 shadow-2xl flex flex-col items-center">
                        <p className="text-slate-300 text-lg mb-1">{currentWordObj.zh}</p>
                        <div className="flex items-center gap-4">
                            <h2 className="text-4xl font-black tracking-widest text-white uppercase">
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

            {/* 結算畫面 */}
            {isGameOver && (
                <div className="absolute inset-0 z-50 bg-slate-900/90 flex flex-col items-center justify-center p-6 text-white animate-[fadeIn_0.5s_ease-out]">
                    <i className="fa-solid fa-skull text-6xl text-red-500 mb-4 animate-bounce"></i>
                    <h2 className="text-4xl font-black mb-2">生存挑戰結束</h2>
                    <p className="text-xl text-slate-300 mb-6">總得分：<span className="text-emerald-400 font-bold text-3xl">{score}</span></p>
                    {qualifyingBook ? (
                        <p className="text-yellow-400 font-bold mb-8 bg-yellow-400/10 px-4 py-2 rounded-xl"><i className="fa-solid fa-cloud-arrow-up"></i> 成績已自動上傳至排行榜</p>
                    ) : (
                        <p className="text-slate-400 text-sm mb-8">（本次為練習模式，不列入排行榜）</p>
                    )}
                    <button onClick={onBack} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-10 rounded-2xl shadow-lg transition-transform hover:scale-105">
                        回主畫面
                    </button>
                </div>
            )}
            
            {/* 遊戲主要畫布 */}
            <canvas 
                ref={canvasRef} 
                className="w-full h-full object-contain bg-black"
            />
            
            {/* 直立螢幕警告遮罩 */}
            <div className="fixed inset-0 bg-slate-900/95 z-[100] flex flex-col justify-center items-center text-white p-6 text-center portrait:flex landscape:hidden">
                <i className="fa-solid fa-mobile-screen text-6xl mb-6 animate-pulse -rotate-90"></i>
                <h2 className="text-3xl font-black mb-2 text-emerald-400">設備轉向提醒</h2>
                <p className="text-lg text-slate-300">請將平板或手機轉為<strong className="text-white">橫向</strong><br/>以獲得最佳視野與操控體驗</p>
            </div>
        </div>
    );
}

// 掛載至全域
window.SnakeSingle = SnakeSingle;
