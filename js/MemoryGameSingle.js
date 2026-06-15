// 明確宣告 React 核心 Hook 來源，防止 CDN 環境下編譯失聯
const { useState, useEffect, useMemo, useCallback } = React;

function MemoryGameSingle({ onBack, settings, wordDatabase }) {
    const [cards, setCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedIds, setMatchedIds] = useState([]);
    const [score, setScore] = useState(0);
    const [wave, setWave] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);

    // 從題庫中篩選出使用者選擇的範圍
    const availableWords = useMemo(() => {
        if (!wordDatabase || !settings || !settings.selectedUnits) return [];
        return wordDatabase.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
    }, [settings, wordDatabase]);

    // 初始化牌組 (Wave 產生器)
    const initDeck = useCallback(() => {
        if (availableWords.length === 0) return;

        // 1. 隨機洗牌
        const shuffledWords = [...availableWords].sort(() => Math.random() - 0.5);
        
        // 2. 動態決定要取幾組單字（最多 9 組，若題庫太少則全取）
        const pairCount = Math.min(shuffledWords.length, 9);
        const selectedWords = shuffledWords.slice(0, pairCount);

        // 3. 製作單字卡 (張數 = pairCount * 2)
        let newCards = [];
        selectedWords.forEach(word => {
            newCards.push({ id: `en-${word.english}`, matchId: word.english, text: word.english, type: 'en', isPowerUp: false });
            newCards.push({ id: `zh-${word.english}`, matchId: word.english, text: word.chinese, type: 'zh', isPowerUp: false });
        });

        // 4. 固定隨機混入 2 張道具卡
        const powerUpTypes = [
            { icon: 'fa-gem', color: 'text-emerald-500', name: 'Bonus' },
            { icon: 'fa-bolt', color: 'text-yellow-400', name: 'Lightning' }
        ];
        powerUpTypes.forEach((p, idx) => {
            newCards.push({ id: `powerup-${idx}`, matchId: `powerup-${idx}`, icon: p.icon, color: p.color, text: p.name, type: 'powerup', isPowerUp: true });
        });

        // 5. 全體大洗牌
        newCards = newCards.sort(() => Math.random() - 0.5);
        
        setCards(newCards);
        setFlippedIndices([]);
        setMatchedIds([]);
        setIsAnimating(false);
    }, [availableWords]);

    // 初始載入與波段更新時發牌
    useEffect(() => {
        initDeck();
    }, [wave, initDeck]);

    // 翻牌處理
    const handleCardClick = (index) => {
        if (isAnimating || flippedIndices.includes(index) || matchedIds.includes(cards[index].matchId)) return;

        // 道具卡觸發邏輯
        if (cards[index].isPowerUp) {
            const powerId = cards[index].matchId;
            setMatchedIds(prev => {
                const newMatched = [...prev, powerId];
                checkWaveComplete(newMatched.length);
                return newMatched;
            });
            setScore(prev => prev + 50);
            return;
        }

        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            setIsAnimating(true);
            const card1 = cards[newFlipped[0]];
            const card2 = cards[newFlipped[1]];

            // 檢查配對：matchId 相同且一張英文一張中文
            if (card1.matchId === card2.matchId && card1.type !== card2.type) {
                setTimeout(() => {
                    setMatchedIds(prev => {
                        const newMatched = [...prev, card1.matchId];
                        checkWaveComplete(newMatched.length);
                        return newMatched;
                    });
                    setScore(prev => prev + 10);
                    setFlippedIndices([]);
                    setIsAnimating(false);
                }, 600);
            } else {
                // 失敗蓋回
                setTimeout(() => {
                    setFlippedIndices([]);
                    setIsAnimating(false);
                }, 1000);
            }
        }
    };

    // 檢查是否完成當前波段
    const checkWaveComplete = (currentMatchedCount) => {
        // 總目標數 = 實際單字組數 + 2張道具卡
        const totalUniqueItems = (cards.length - 2) / 2 + 2;
        if (currentMatchedCount >= totalUniqueItems && cards.length > 0) {
            setTimeout(() => {
                setWave(prev => prev + 1);
            }, 1200);
        }
    };

    if (availableWords.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-white">
                <p className="text-xl font-bold mb-4">⚠️ 請先返回外層大廳選擇有效的複習範圍！</p>
                <button onClick={onBack} className="px-6 py-3 bg-blue-600 rounded-xl font-bold">返回大廳</button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 flex flex-col h-screen select-none">
            
            {/* 一致性頂部導覽列 */}
            <header className="shrink-0 flex justify-between items-center mb-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <button onClick={onBack} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold transition-colors flex items-center gap-2">
                    <i className="fa-solid fa-arrow-left"></i> 返回上一層
                </button>
                
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Wave</span>
                        <span className="text-xl font-black text-blue-600 dark:text-blue-400">{wave}</span>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="text-sm text-slate-500 font-bold mr-2">Score</span>
                        <span className="text-xl font-black text-emerald-500">{score}</span>
                    </div>
                </div>
            </header>

            {/* 核心 4x5 網格對戰盤面 */}
            <div className="flex-1 min-h-0 flex items-center justify-center">
                <div className="w-full h-full max-h-[75vh] grid grid-cols-5 grid-rows-4 gap-2 sm:gap-3 p-2 bg-slate-200 dark:bg-slate-950 rounded-3xl shadow-inner">
                    {cards.map((card, index) => {
                        const isFlipped = flippedIndices.includes(index) || matchedIds.includes(card.matchId);
                        const isMatched = matchedIds.includes(card.matchId);

                        return (
                            <button
                                key={card.id || index}
                                onClick={() => handleCardClick(index)}
                                disabled={isMatched}
                                className={`relative w-full h-full rounded-xl sm:rounded-2xl flex items-center justify-center p-1 transition-all duration-300 ${
                                    isFlipped 
                                        ? 'bg-white dark:bg-slate-800 shadow-md border-2 border-blue-400' 
                                        : 'bg-blue-600 hover:bg-blue-500 shadow-[0_4px_0_rgb(29,78,216)] hover:-translate-y-0.5'
                                } ${isMatched && !card.isPowerUp ? 'opacity-40 scale-95 border-emerald-500' : ''}`}
                            >
                                {/* 牌背狀態 */}
                                {!isFlipped && (
                                    <div className="text-blue-300/60">
                                        <i className="fa-solid fa-globe text-2xl sm:text-3xl animate-pulse"></i>
                                    </div>
                                )}

                                {/* 牌面內容 */}
                                {isFlipped && (
                                    <div className="w-full text-center p-1">
                                        {card.isPowerUp ? (
                                            <div className="flex flex-col items-center justify-center">
                                                <i className={`fa-solid ${card.icon} text-2xl sm:text-3xl ${card.color} mb-1`}></i>
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

                                {/* 成功過關小勾勾 */}
                                {isMatched && !card.isPowerUp && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] border border-white shadow">
                                        <i className="fa-solid fa-check"></i>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
