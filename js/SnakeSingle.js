// SnakeSingle.js
const SnakeSingle = ({ onBack, settings, wordDatabase }) => {
    // ----- Canvas 與遊戲狀態 -----
    const canvasRef = React.useRef(null);
    const [gameStatus, setGameStatus] = React.useState('waiting'); // waiting / playing / over
    const [score, setScore] = React.useState(0);
    
    // 遊戲常數
    const CELL_SIZE = 20;
    const COLS = 20;
    const ROWS = 20;
    const WIDTH = COLS * CELL_SIZE;
    const HEIGHT = ROWS * CELL_SIZE;

    // 用 useRef 存放會頻繁變動的資料，避免 re-render 拖慢效能
    const snakeRef = React.useRef([{ x: 10, y: 10 }]);
    const foodRef = React.useRef({ x: 5, y: 5, letter: 'A' });
    const directionRef = React.useRef({ x: 1, y: 0 });
    const nextDirectionRef = React.useRef({ x: 1, y: 0 });
    const gameLoopRef = React.useRef(null);
    const speedRef = React.useRef(120);

    // ----- 工具函式 -----
    const getRandomLetter = () => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return letters[Math.floor(Math.random() * letters.length)];
    };

    const generateFood = (snake) => {
        const newFood = { letter: getRandomLetter() };
        do {
            newFood.x = Math.floor(Math.random() * COLS);
            newFood.y = Math.floor(Math.random() * ROWS);
        } while (snake.some(seg => seg.x === newFood.x && seg.y === newFood.y));
        return newFood;
    };

    const resetGame = () => {
        snakeRef.current = [{ x: 10, y: 10 }];
        directionRef.current = { x: 1, y: 0 };
        nextDirectionRef.current = { x: 1, y: 0 };
        foodRef.current = generateFood(snakeRef.current);
        setScore(0);
    };

    // ----- 遊戲主迴圈 -----
    const tick = React.useCallback(() => {
        const snake = snakeRef.current;
        // 應用真正方向
        directionRef.current = nextDirectionRef.current;
        const head = snake[snake.length - 1];
        const newHead = {
            x: head.x + directionRef.current.x,
            y: head.y + directionRef.current.y
        };

        // 檢查撞牆
        if (newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS) {
            setGameStatus('over');
            return;
        }
        // 檢查撞自己（去掉尾巴再檢查，因為等等會加頭去尾）
        if (snake.slice(0, -1).some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
            setGameStatus('over');
            return;
        }

        const newSnake = [...snake, newHead];
        // 判斷是否吃到食物
        if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
            // 吃到：不砍尾巴，生成新食物，加分
            foodRef.current = generateFood(newSnake);
            setScore(prev => prev + 1);
        } else {
            // 沒吃到：移除尾巴
            newSnake.shift();
        }
        snakeRef.current = newSnake;
        drawCanvas();
    }, []);

    // ----- 繪圖 -----
    const drawCanvas = React.useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        // 背景
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        // 格線
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= COLS; i++) {
            ctx.beginPath();
            ctx.moveTo(i * CELL_SIZE, 0);
            ctx.lineTo(i * CELL_SIZE, HEIGHT);
            ctx.stroke();
        }
        for (let j = 0; j <= ROWS; j++) {
            ctx.beginPath();
            ctx.moveTo(0, j * CELL_SIZE);
            ctx.lineTo(WIDTH, j * CELL_SIZE);
            ctx.stroke();
        }
        // 蛇
        snakeRef.current.forEach((seg, idx) => {
            const gradient = 1 - idx / (snakeRef.current.length + 5);
            ctx.fillStyle = `hsl(120, 70%, ${30 + gradient * 30}%)`;
            ctx.fillRect(seg.x * CELL_SIZE + 2, seg.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        });
        // 食物字母
        const food = foodRef.current;
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(food.letter, food.x * CELL_SIZE + CELL_SIZE/2, food.y * CELL_SIZE + CELL_SIZE/2);
    }, [WIDTH, HEIGHT]);

    // ----- 開始 / 結束控制 -----
    React.useEffect(() => {
        if (gameStatus === 'playing') {
            gameLoopRef.current = setInterval(tick, speedRef.current);
        } else {
            clearInterval(gameLoopRef.current);
        }
        return () => clearInterval(gameLoopRef.current);
    }, [gameStatus, tick]);

    React.useEffect(() => {
        drawCanvas();
    }, [score, gameStatus, drawCanvas]);

    const startGame = () => {
        resetGame();
        setGameStatus('playing');
    };

    // ----- 鍵盤控制 -----
    React.useEffect(() => {
        const handleKey = (e) => {
            e.preventDefault();
            const dir = nextDirectionRef.current;
            switch (e.key) {
                case 'ArrowUp': if (dir.y === 0) nextDirectionRef.current = { x: 0, y: -1 }; break;
                case 'ArrowDown': if (dir.y === 0) nextDirectionRef.current = { x: 0, y: 1 }; break;
                case 'ArrowLeft': if (dir.x === 0) nextDirectionRef.current = { x: -1, y: 0 }; break;
                case 'ArrowRight': if (dir.x === 0) nextDirectionRef.current = { x: 1, y: 0 }; break;
                default: break;
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    // ----- 觸控方向（手機）-----
    let touchStart = null;
    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        touchStart = { x: touch.clientX, y: touch.clientY };
    };
    const handleTouchEnd = (e) => {
        if (!touchStart) return;
        const touch = e.changedTouches[0];
        const dx = touch.clientX - touchStart.x;
        const dy = touch.clientY - touchStart.y;
        const dir = nextDirectionRef.current;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0 && dir.x === 0) nextDirectionRef.current = { x: 1, y: 0 };
            else if (dx < 0 && dir.x === 0) nextDirectionRef.current = { x: -1, y: 0 };
        } else {
            if (dy > 0 && dir.y === 0) nextDirectionRef.current = { x: 0, y: 1 };
            else if (dy < 0 && dir.y === 0) nextDirectionRef.current = { x: 0, y: -1 };
        }
        touchStart = null;
    };

    // ----- UI 渲染 -----
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-white bg-slate-900">
            <div className="mb-4 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="text-sm px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-full transition"
                >
                    ← 回大廳
                </button>
                <span className="text-xl font-bold">分數：{score}</span>
            </div>

            <div
                className="border-4 border-emerald-500 rounded-xl overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <canvas
                    ref={canvasRef}
                    width={WIDTH}
                    height={HEIGHT}
                    className="block"
                />
            </div>

            {gameStatus !== 'playing' && (
                <div className="mt-6">
                    {gameStatus === 'waiting' && (
                        <button
                            onClick={startGame}
                            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full text-lg shadow-lg transition"
                        >
                            開始遊戲
                        </button>
                    )}
                    {gameStatus === 'over' && (
                        <div className="text-center">
                            <p className="text-2xl mb-4 font-black text-red-400">遊戲結束</p>
                            <button
                                onClick={startGame}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full text-lg shadow-lg transition"
                            >
                                再玩一次
                            </button>
                        </div>
                    )}
                </div>
            )}

            <p className="mt-4 text-xs text-slate-500">方向鍵 / 滑動螢幕 控制蛇的方向</p>
        </div>
    );
};
