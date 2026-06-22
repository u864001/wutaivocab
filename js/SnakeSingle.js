function SnakeSingle({ onBack, settings, wordDatabase, qualifyingBook, onSaveScore }) {
    const { useState, useEffect, useRef, useCallback } = React;
    
    // UI 狀態 (僅負責顯示，不干擾底層引擎)
    const canvasRef = useRef(null);
    const [scoreUI, setScoreUI] = useState(0);
    const [heartsUI, setHeartsUI] = useState(5);
    const [timeLeftUI, setTimeLeftUI] = useState(60);
    const [currentWordObj, setCurrentWordObj] = useState(null);
    const [spelledLetters, setSpelledLetters] = useState("");
    const [isGameOver, setIsGameOver] = useState(false);
    const [finalScoreUI, setFinalScoreUI] = useState(0);

    // 過濾出目前設定範圍內的題庫
    const filteredWords = wordDatabase.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));

    // 語音朗讀功能
    const playVoice = useCallback((text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance(text);
            msg.lang = 'en-US';
            msg.rate = 0.85; // 稍微放慢，適合國小生
            window.speechSynthesis.speak(msg);
        }
    }, []);

    // 🌟 遊戲核心引擎 (嚴格封裝在 useEffect 內，避免 React 重新渲染導致重置)
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!canvas || !ctx || filteredWords.length === 0) return;

        // --- 引擎內部變數 (這些變數的改變不會觸發 React 重新渲染) ---
        let engineHearts = 5;
        let engineScore = 0;
        let engineTime = 60;
        let isInvincible = false;
        let isEngineRunning = true;
        
        // 網格設定 (24x14)
        const GRID_W = 24;
        const GRID_H = 14;
        const TILE_SIZE = 40;
        canvas.width = GRID_W * TILE_SIZE;
        canvas.height = GRID_H * TILE_SIZE;

        // 蛇的初始狀態
        let snake = [{x: 12, y: 7}, {x: 11, y: 7}, {x: 10, y: 7}];
        let currentDir = 'RIGHT';
        let nextDir = 'RIGHT';

        // 單字拆解狀態
        let activeWordObj = null;
        let targetWordStr = "";
        let currentLetterIndex = 0;
        let spelledStr = "";
        let mapLetters = []; // 散落在地圖上的字母陣列

        // 初始化/抽取下一個單字
        const spawnNextWord = () => {
            activeWordObj = filteredWords[Math.floor(Math.random() * filteredWords.length)];
            targetWordStr = activeWordObj.en.replace(/\s+/g, '').toUpperCase();
            currentLetterIndex = 0;
            spelledStr = "";
            mapLetters = [];

            // 更新 UI 顯示
            setCurrentWordObj(activeWordObj);
            setSpelledLetters("");
            playVoice(activeWordObj.en);

            // 將單字的每一個字母散落至地圖
            for (let i = 0; i < targetWordStr.length; i++) {
                let char = targetWordStr[i];
                let isValid = false;
                let newX, newY;

                while (!isValid) {
                    newX = Math.floor(Math.random() * (GRID_W - 2)) + 1;
                    newY = Math.floor(Math.random() * (GRID_H - 2)) + 1;
                    
                    // 確保不會長在蛇身上
                    let onSnake = snake.some(segment => segment.x === newX && segment.y === newY);
                    // 確保不會與其他字母重疊
                    let onLetter = mapLetters.some(l => l.x === newX && l.y === newY);
                    
                    isValid = !onSnake && !onLetter;
                }
                mapLetters.push({ char: char, x: newX, y: newY });
            }
        };

        // 遊戲結束邏輯
        const endGame = (isTimeUp = false) => {
            if (!isEngineRunning) return;
            isEngineRunning = false;
            
            // 計算剩餘愛心紅利 (每顆 10 分)
            const finalHearts = Math.max(0, engineHearts);
            const heartBonus = finalHearts * 10;
            const totalScore = engineScore + heartBonus;
            
            setScoreUI(engineScore); // 更新最終過程分
            setFinalScoreUI(totalScore); // 更新加總分
            setIsGameOver(true);

            // 結算成績寫入 Firestore
            if (qualifyingBook && totalScore > 0 && window.handleSaveScore) {
                window.handleSaveScore({
                    mode: 'snake_single',
                    book: qualifyingBook,
                    week: window.getWeekNumber ? window.getWeekNumber() : 0,
                    score: totalScore,
                    time: Date.now()
                });
            }
        };

        // 觸發傷害與容錯機制
        const triggerDamage = (reason) => {
            if (isInvincible || !isEngineRunning) return;
            console.log("扣心原因：", reason);
            
            engineHearts--;
            setHeartsUI(engineHearts); // 更新上方 UI
            
            // 畫面閃紅光
            ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (engineHearts <= 0) {
                endGame(false); // 血量歸零結束
            } else {
                // 幽靈無敵模式 (3 秒)
                isInvincible = true;
                setTimeout(() => { isInvincible = false; }, 3000);
            }
        };

        // 啟動第一道題目
        spawnNextWord();

        // 啟動 60 秒倒數計時器
        const timerInterval = setInterval(() => {
            if (isEngineRunning && engineTime > 0) {
                engineTime--;
                setTimeLeftUI(engineTime); // 更新上方 UI
                if (engineTime <= 0) {
                    endGame(true); // 時間到結束
                }
            }
        }, 1000);

        // 🎨 繪圖函數
        const drawGame = () => {
            // 1. 畫草地與灌木叢
            for (let y = 0; y < GRID_H; y++) {
                for (let x = 0; x < GRID_W; x++) {
                    ctx.fillStyle = (x + y) % 2 === 0 ? '#10b981' : '#059669'; // Tailwind Emerald 綠系
                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    
                    if (x === 0 || x === GRID_W - 1 || y === 0 || y === GRID_H - 1) {
                        ctx.fillStyle = '#064e3b'; // 深綠色邊界
                        ctx.beginPath();
                        ctx.arc(x * TILE_SIZE + TILE_SIZE/2, y * TILE_SIZE + TILE_SIZE/2, TILE_SIZE*0.6, 0, Math.PI*2);
                        ctx.fill();
                    }
                }
            }

            // 2. 畫散落的字母 (支援發光提示)
            let expectedChar = targetWordStr[currentLetterIndex];
            mapLetters.forEach(letter => {
                let isTarget = (letter.char === expectedChar);

                ctx.shadowBlur = isTarget ? 15 : 0;
                ctx.shadowColor = isTarget ? 'yellow' : 'transparent';
                ctx.fillStyle = isTarget ? '#fbbf24' : '#ef4444'; // 正確目標為黃色，錯誤/尚未輪到為紅色
                
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
                    ctx.globalAlpha = Math.floor(Date.now() / 200) % 2 === 0 ? 0.3 : 0.7; // 閃爍無敵特效
                    ctx.fillStyle = index === 0 ? '#38bdf8' : '#bae6fd'; 
                } else {
                    ctx.globalAlpha = 1.0;
                    ctx.fillStyle = index === 0 ? '#f97316' : '#fdba74'; 
                }
                ctx.fillRect(segment.x * TILE_SIZE + 2, segment.y * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            });
            ctx.globalAlpha = 1.0;
        };

        // 🏃 遊戲主迴圈
        let lastTime = 0;
        const tickRate = 200; // 蛇移動速度 (越小越快)
        let animationFrameId;

        const update = (timestamp) => {
            if (!isEngineRunning) return;

            if (timestamp - lastTime > tickRate) {
                lastTime = timestamp;
                currentDir = nextDir;
                let head = { ...snake[0] };

                // 移動座標
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

                if (hitWall) triggerDamage("撞到邊界樹叢！");

                // 咬到自己判定
                if (!isInvincible && snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                    triggerDamage("咬到自己的身體！");
                }

                snake.unshift(head); // 蛇頭往前延伸

                // 🍎 吃字母判定
                let ateLetterIdx = mapLetters.findIndex(l => l.x === head.x && l.y === head.y);
                if (ateLetterIdx !== -1) {
                    let hitLetter = mapLetters[ateLetterIdx];
                    let expectedChar = targetWordStr[currentLetterIndex];

                    if (hitLetter.char === expectedChar) {
                        // 【正確吃對順序】
                        mapLetters.splice(ateLetterIdx, 1); // 拔除地圖上的該字母
                        engineScore += 10;
                        setScoreUI(engineScore);
                        
                        currentLetterIndex++;
                        spelledStr += hitLetter.char;
                        setSpelledLetters(spelledStr); // 更新上方單字拼寫 UI
                        
                        // 判斷單字是否拼完
                        if (currentLetterIndex >= targetWordStr.length) {
                            engineScore += 50;
                            setScoreUI(engineScore);
                            spawnNextWord(); // 重新洗牌出新字
                        }
                        // 正確吃到，所以不執行 pop()，讓蛇自然變長一格
                    } else {
                        // 【吃錯順序字母】
                        triggerDamage("吃到順序錯誤的字母！");
                        snake.pop(); // 吐出來，身體不變長。保留字母在原地給他重吃機會。
                    }
                } else {
                    snake.pop(); // 沒吃到任何東西，移除尾巴維持原長度
                }
            }

            drawGame();
            animationFrameId = requestAnimationFrame(update);
        };

        animationFrameId = requestAnimationFrame(update);

        // --- 操作指令監聽 ---
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

        // 元件卸載清理
        return () => {
            isEngineRunning = false;
            clearInterval(timerInterval);
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', preventScroll);
        };
    }, []); // 🌟 空陣列確保遊戲迴圈只在最初掛載一次，不受 UI 更新干擾而重置！

    // 介面渲染
    return (
        <div className="w-full h-screen bg-slate-900 flex flex-col relative touch-none overscroll-none overflow-hidden">
            
            {/* 頂部導覽與狀態列 */}
            <div className="absolute top-0 w-full flex justify-between items-center p-4 z-10 text-white font-bold drop-shadow-md">
                <div className="flex gap-4 items-center">
                    <button onClick={onBack} className="bg-slate-700/80 hover:bg-slate-600 px-4 py-2 rounded-xl backdrop-blur transition-colors">
                        <i className="fa-solid fa-arrow-left mr-2"></i>放棄
                    </button>
                    {/* 🌟 倒數計時器 */}
                    <div className="bg-red-500/90 px-4 py-2 rounded-xl border border-red-400 text-lg flex items-center gap-2">
                        <i className="fa-solid fa-stopwatch animate-pulse"></i> 
                        {timeLeftUI}s
                    </div>
                </div>
                
                {/* 🌟 愛心 5 顆 */}
                <div className="text-2xl tracking-widest bg-slate-900/50 px-4 py-1 rounded-full">
                    {'❤️'.repeat(heartsUI)}{'🤍'.repeat(5 - heartsUI)}
                </div>
                
                <div className="text-xl bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-600">
                    分數: <span className="text-emerald-400">{scoreUI}</span>
                </div>
            </div>

            {/* 提示字詞區塊 */}
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
                <div className="absolute inset-0 z-50 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-white animate-[fadeIn_0.5s_ease-out]">
                    {heartsUI <= 0 ? (
                        <i className="fa-solid fa-skull text-6xl text-red-500 mb-4 animate-bounce"></i>
                    ) : (
                        <i className="fa-solid fa-clock text-6xl text-blue-400 mb-4 animate-bounce"></i>
                    )}
                    <h2 className="text-4xl font-black mb-2">{heartsUI <= 0 ? '生存失敗' : '時間到！生存成功'}</h2>
                    
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 my-6 text-center w-80 shadow-2xl">
                        <p className="text-slate-300 mb-2 flex justify-between">遊戲得分 <span>{scoreUI}</span></p>
                        <p className="text-pink-400 mb-4 flex justify-between border-b border-slate-600 pb-4">
                            愛心紅利 ({heartsUI}x10) <span>+{heartsUI * 10}</span>
                        </p>
                        <p className="text-2xl font-black text-emerald-400 flex justify-between">
                            總結算 <span className="text-4xl">{finalScoreUI}</span>
                        </p>
                    </div>

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
            
            <canvas ref={canvasRef} className="w-full h-full object-contain bg-black" />
            
            {/* 直立螢幕警告遮罩 */}
            <div className="fixed inset-0 bg-slate-900/95 z-[100] flex flex-col justify-center items-center text-white p-6 text-center portrait:flex landscape:hidden">
                <i className="fa-solid fa-mobile-screen text-6xl mb-6 animate-pulse -rotate-90"></i>
                <h2 className="text-3xl font-black mb-2 text-emerald-400">設備轉向提醒</h2>
                <p className="text-lg text-slate-300">請將平板或手機轉為<strong className="text-white">橫向</strong><br/>以獲得最佳視野與操控體驗</p>
            </div>
        </div>
    );
}

window.SnakeSingle = SnakeSingle;
