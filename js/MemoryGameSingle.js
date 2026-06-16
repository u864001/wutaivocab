// 明確宣告 React 核心 Hook 來源
const { useState, useEffect, useMemo, useCallback, useRef } = React;

// 🪙 內建組件：金幣雨小遊戲 (Coin Rain Minigame)
function CoinRainMinigame({ onComplete }) {
    const [items, setItems] = useState([]);
    const [miniScore, setMiniScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [isExploding, setIsExploding] = useState(false);

    // 倒數計時器
    useEffect(() => {
        if (timeLeft <= 0 && !isExploding) {
            onComplete(miniScore);
            return;
        }
        if (isExploding) return;
        const timer = setTimeout(() => setTimeLeft(l => l - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, isExploding, miniScore, onComplete]);

    // 隨機生成掉落物 (75% 金幣, 25% 炸彈)
    useEffect(() => {
        if (isExploding || timeLeft <= 0) return;
        const spawnInterval = setInterval(() => {
            const isBomb = Math.random() < 0.25;
            setItems(prev => [...prev, {
                id: Math.random().toString(36).substr(2, 9),
                type: isBomb ? 'bomb' : 'coin',
                left: Math.floor(Math.random() * 80) + 10, // 橫向隨機 10% ~ 90%
                duration: Math.random() * 2 + 2 // 掉落速度 2~4 秒
            }]);
        }, 400); // 每 0.4 秒掉一個
        return () => clearInterval(spawnInterval);
    }, [isExploding, timeLeft]);

    const handleItemClick = (id, type) => {
        if (isExploding) return;
        if (type === 'coin') {
            setMiniScore(s => s + 1);
            setItems(prev => prev.filter(item => item.id !== id));
        } else if (type === 'bomb') {
            setIsExploding(true);
            setTimeout(() => {
                onComplete(miniScore); // 炸彈爆炸後，結算已得金幣並結束
            }, 1500);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center overflow-hidden">
            <style>{`
                @keyframes fallDown { from { top: -10%; } to { top: 110%; } }
                .falling-item { animation: fallDown linear forwards; }
            `}</style>
            
            <div className="mt-10 text-white text-center z-10">
                <h2 className="text-3xl font-black text-yellow-400 drop-shadow-md mb-2">金幣雨 (Coin Rain)</h2>
                <div className="flex gap-8 justify-center text-xl font-bold">
                    <span className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-600">剩餘: {timeLeft} 秒</span>
                    <span className="bg-yellow-900/50 text-yellow-400 px-4 py-2 rounded-xl border border-yellow-600">獲得: {miniScore} 分</span>
                </div>
                {isExploding && <div className="mt-20 text-6xl animate-bounce">💥 踩到炸彈啦！結算中...</div>}
            </div>

            {/* 掉落物渲染區 */}
            {!isExploding && items.map(item => (
                <button 
                    key={item.id}
                    onClick={() => handleItemClick(item.id, item.type)}
                    className="falling-item absolute text-5xl hover:scale-125 transition-transform"
                    style={{ left: `${item.left}%`, animationDuration: `${item.duration}s` }}
                >
                    {item.type === 'coin' ? <i className="fa-solid fa-coin text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]"></i> : <i className="fa-solid fa-bomb text-slate-800 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]"></i>}
                </button>
            ))}
        </div>
    );
}

// 🃏 主遊戲組件
function MemoryGameSingle({ onBack, settings, wordDatabase, onSaveScore }) {
    // 預留雙語字典檔機制
    const lang = 'zh-TW'; 
    const t = {
        title: '星際記憶翻牌 (單局挑戰)',
        gameOver: '挑戰完成！',
        saveScore: '儲存分數並回大廳',
        missingWords: '⚠️ 題庫單字不足，請回大廳重新設定。'
    };

    const [cards, setCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedIds, setMatchedIds] = useState([]);
    const [score, setScore] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [startTime, setStartTime] = useState(Date.now());
    const [timeBonus, setTimeBonus] = useState(0);

    // 特殊卡牌狀態
    const [peekIndices, setPeekIndices] = useState([]);
    const [radarActive, setRadarActive] = useState(false);
    const [activeMinigame, setActiveMinigame] = useState(null);

    // 從題庫中篩選範圍
    const availableWords = useMemo(() => {
        if (!wordDatabase || !settings || !settings.selectedUnits) return [];
        return wordDatabase.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
    }, [settings, wordDatabase]);

    // 初始化牌組 (一局定勝負)
    const initDeck = useCallback(() => {
        if (availableWords.length === 0) return;

        const shuffledWords = [...availableWords].sort(() => Math.random() - 0.5);
        const pairCount = Math.min(shuffledWords.length, 9);
        const selectedWords = shuffledWords.slice(0, pairCount);

        let newCards = [];
        selectedWords.forEach(word => {
            const enText = word.en || word.english || word.word || "[英文遺失]";
            const zhText = word.zh || word.chinese || word.translation || "[中文遺失]";
            const matchKey = enText; 

            newCards.push({ id: `en-${matchKey}`, matchId: matchKey, text: enText, type: 'en', isPowerUp: false });
            newCards.push({ id: `zh-${matchKey}`, matchId: matchKey, text: zhText, type: 'zh', isPowerUp: false });
        });

        // 隨機挑選 2 張單機專屬功能卡
        const spPowerUps = [
            { id: 'powerup_bonus', icon: 'fa-gem', color: 'text-emerald-400', name: '加分卡 (+30)' },
            { id: 'powerup_radar', icon: 'fa-satellite-dish', color: 'text-green-400', name: '雷達卡 (透視)' },
            { id: 'powerup_peek', icon: 'fa-eye', color: 'text-indigo-400', name: '偷看卡 (2張)' },
            { id: 'powerup_lightning', icon: 'fa-bolt', color: 'text-yellow-300', name: '閃電卡 (自動)' },
            { id: 'powerup_coin', icon: 'fa-coins', color: 'text-yellow-400', name: '金幣雨' }
        ];
        const selectedPowerUps = spPowerUps.sort(() => Math.random() - 0.5).slice(0, 2);
        
        selectedPowerUps.forEach((p, idx) => {
            newCards.push({ id: `${p.id}_${idx}`, matchId: p.id, icon: p.icon, color: p.color, text: p.name, type: 'powerup', isPowerUp: true });
        });

        setCards(newCards.sort(() => Math.random() - 0.5));
        setFlippedIndices([]);
        setMatchedIds([]);
        setScore(0);
        setStartTime(Date.now());
        setGameOver(false);
        setIsAnimating(false);
    }, [availableWords]);

    useEffect(() => { initDeck(); }, [initDeck]);

    // 處理功能卡邏輯 (不消耗翻牌次數)
    const triggerPowerUp = (powerId, cardIndex) => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000); // 鎖定盤面 1 秒展示特效

        if (powerId === 'powerup_bonus') {
            setScore(s => s + 30);
        } 
        else if (powerId === 'powerup_radar') {
            setRadarActive(true);
            setTimeout(() => setRadarActive(false), 2000);
        } 
        else if (powerId === 'powerup_peek') {
            const validIndices = cards.map((c, i) => i).filter(i => !matchedIds.includes(cards[i].matchId) && !flippedIndices.includes(i) && i !== cardIndex);
            const picked = validIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
            setPeekIndices(picked);
            setTimeout(() => setPeekIndices([]), 5000);
        } 
        else if (powerId === 'powerup_lightning') {
            if (flippedIndices.length === 0) {
                // 第1張抽到：隨機找一對沒翻過的消除，並結束回合
                const unmatchedWords = cards.filter(c => !c.isPowerUp && !matchedIds.includes(c.matchId));
                if (unmatchedWords.length > 0) {
                    setMatchedIds(prev => [...prev, unmatchedWords[0].matchId]);
                    setScore(s => s + 10);
                }
            } else if (flippedIndices.length === 1) {
                // 第2張抽到：直接把第1張的另一半找出來消除，並結束回合
                const targetMatchId = cards[flippedIndices[0]].matchId;
                setMatchedIds(prev => [...prev, targetMatchId]);
                setScore(s => s + 10);
                setFlippedIndices([]);
            }
        } 
        else if (powerId === 'powerup_coin') {
            setActiveMinigame('coin_rain');
        }
    };

    const handleCardClick = (index) => {
        if (isAnimating || flippedIndices.includes(index) || matchedIds.includes(cards[index].matchId) || peekIndices.includes(index)) return;

        const card = cards[index];

        // 碰到功能卡 -> 執行功能，且不算入 flippedIndices (維持玩家目前的翻牌階段)
        if (card.isPowerUp) {
            setMatchedIds(prev => [...prev, card.matchId]);
            triggerPowerUp(card.matchId, index);
            return;
        }

        // 一般單字卡邏輯
        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            setIsAnimating(true);
            const c1 = cards[newFlipped[0]];
            const c2 = cards[newFlipped[1]];

            if (c1.matchId === c2.matchId && c1.type !== c2.type) {
                setTimeout(() => {
                    setMatchedIds(prev => [...prev, c1.matchId]);
                    setScore(s => s + 10);
                    setFlippedIndices([]);
                    setIsAnimating(false);
                }, 600);
            } else {
                setTimeout(() => {
                    setFlippedIndices([]);
                    setIsAnimating(false);
                }, 1000);
            }
        }
    };

    // 檢查遊戲結束 (一局定勝負：所有卡牌都進了 matchedIds)
    useEffect(() => {
        if (cards.length > 0 && matchedIds.length >= (cards.length - 2) / 2 + 2) { // 9對 + 2張道具 = 11
            const timeTaken = Math.floor((Date.now() - startTime) / 1000);
            // 基礎獎勵：2分鐘內完成有額外加分，越快越多
            const calculatedBonus = Math.max(0, 120 - timeTaken); 
            setTimeBonus(calculatedBonus);
            setTimeout(() => setGameOver(true), 1500);
        }
    }, [matchedIds, cards, startTime]);

    const handleFinishAndSave = () => {
        const finalScore = score + timeBonus;
        // 如果 App.js 尚未傳入 onSaveScore，就直接返回大廳；若有傳入則儲存。
        if (onSaveScore) {
            onSaveScore({ gameMode: 'memory_single', score: finalScore, date: new Date().toISOString() });
        }
        onBack();
    };

    if (availableWords.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-white">
                <p className="text-xl font-bold mb-4">{t.missingWords}</p>
                <button onClick={onBack} className="px-6 py-3 bg-blue-600 rounded-xl font-bold">返回大廳</button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 flex flex-col h-screen select-none animate-[fadeIn_0.5s_ease-out]">
            {activeMinigame === 'coin_rain' && (
                <CoinRainMinigame onComplete={(miniScore) => {
                    setScore(s => s + miniScore);
                    setActiveMinigame(null);
                }} />
            )}

            {/* 一致性頂部導覽列 */}
            <header className="shrink-0 flex justify-between items-center mb-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <button onClick={onBack} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold transition-colors flex items-center gap-2">
                    <i className="fa-solid fa-arrow-left"></i> 返回
                </button>
                
                <h1 className="font-black text-xl text-blue-600 dark:text-blue-400 hidden sm:block">{t.title}</h1>

                <div className="flex items-center gap-4">
                    <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="text-sm text-slate-500 font-bold mr-2">Score</span>
                        <span className="text-xl font-black text-emerald-500">{score}</span>
                    </div>
                </div>
            </header>

            {/* 遊戲結束結算畫面 */}
            {gameOver ? (
                <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center animate-[zoomIn_0.3s_ease-out]">
                    <i className="fa-solid fa-trophy text-6xl text-yellow-400 mb-6 drop-shadow-lg"></i>
                    <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-6">{t.gameOver}</h2>
                    
                    <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl w-full max-w-sm mb-8 space-y-3">
                        <div className="flex justify-between text-lg font-bold text-slate-600 dark:text-slate-300">
                            <span>配對得分:</span> <span>{score} 分</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 pb-3">
                            <span>時間紅利:</span> <span>+ {timeBonus} 分</span>
                        </div>
                        <div className="flex justify-between text-2xl font-black text-emerald-600 dark:text-emerald-400 pt-2">
                            <span>總分:</span> <span>{score + timeBonus} 分</span>
                        </div>
                    </div>

                    <button onClick={handleFinishAndSave} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-xl shadow-lg transition-transform hover:scale-105">
                        <i className="fa-solid fa-upload mr-2"></i> {t.saveScore}
                    </button>
                </div>
            ) : (
                /* 4x5 網格對戰盤面 */
                <div className="flex-1 min-h-0 flex items-center justify-center">
                    <div className={`w-full h-full max-h-[75vh] grid grid-cols-5 grid-rows-4 gap-2 sm:gap-3 p-2 bg-slate-200 dark:bg-slate-950 rounded-3xl shadow-inner transition-all duration-500 ${radarActive ? 'ring-4 ring-green-400 shadow-[0_0_30px_rgba(74,222,128,0.5)]' : ''}`}>
                        {cards.map((card, index) => {
                            const isPermanentlyFlipped = matchedIds.includes(card.matchId);
                            const isTemporarilyFlipped = flippedIndices.includes(index) || peekIndices.includes(index);
                            const isRadarRevealed = radarActive && !isPermanentlyFlipped && !isTemporarilyFlipped;
                            
                            const isFlipped = isPermanentlyFlipped || isTemporarilyFlipped || isRadarRevealed;

                            return (
                                <button
                                    key={card.id || index}
                                    onClick={() => handleCardClick(index)}
                                    disabled={isPermanentlyFlipped || isRadarRevealed}
                                    className={`relative w-full h-full rounded-xl sm:rounded-2xl flex items-center justify-center p-1 transition-all duration-300 ${
                                        isFlipped 
                                            ? 'bg-white dark:bg-slate-800 shadow-md border-2 border-blue-400' 
                                            : 'bg-blue-600 hover:bg-blue-500 shadow-[0_4px_0_rgb(29,78,216)] hover:-translate-y-0.5'
                                    } ${isPermanentlyFlipped && !card.isPowerUp ? 'opacity-40 scale-95 border-emerald-500' : ''} ${isRadarRevealed ? 'opacity-80 scale-95 border-green-400' : ''}`}
                                >
                                    {!isFlipped && (
                                        <div className="text-blue-300/60">
                                            <i className="fa-solid fa-globe text-2xl sm:text-3xl animate-pulse"></i>
                                        </div>
                                    )}

                                    {isFlipped && (
                                        <div className="w-full text-center p-1">
                                            {card.isPowerUp ? (
                                                <div className="flex flex-col items-center justify-center">
                                                    <i className={`fa-solid ${card.icon} text-2xl sm:text-3xl ${card.color} mb-1 ${isTemporarilyFlipped ? 'animate-bounce' : ''}`}></i>
                                                    <span className="text-[10px] sm:text-xs font-black text-slate-700 dark:text-slate-200">{card.text}</span>
                                                </div>
                                            ) : (
                                                <span className={`font-bold block break-all ${
                                                    card.type === 'en' 
                                                        ? 'text-sm sm:text-base md:text-lg text-blue-600 dark:text-blue-400 font-mono' 
                                                        : 'text-xs sm:text-sm md:text-base text-slate-700 dark:text-slate-200'
                                                }`}>
                                                    {card.text}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {isPermanentlyFlipped && !card.isPowerUp && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] border border-white shadow">
                                            <i className="fa-solid fa-check"></i>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
