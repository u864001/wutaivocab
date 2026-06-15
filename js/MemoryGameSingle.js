// 明確宣告 React 核心 Hook 來源
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

        const shuffledWords = [...availableWords].sort(() => Math.random() - 0.5);
        const pairCount = Math.min(shuffledWords.length, 9);
        const selectedWords = shuffledWords.slice(0, pairCount);

        let newCards = [];
        selectedWords.forEach(word => {
            // 🌟 終極防護：自動相容多種常見的試算表欄位命名
            const enText = word.en || word.english || word.word || "[英文遺失]";
            const zhText = word.zh || word.chinese || word.translation || "[中文遺失]";
            // 用英文單字當作配對的唯一 ID
            const matchKey = enText; 

            newCards.push({ id: `en-${matchKey}`, matchId: matchKey, text: enText, type: 'en', isPowerUp: false });
            newCards.push({ id: `zh-${matchKey}`, matchId: matchKey, text: zhText, type: 'zh', isPowerUp: false });
        });

        // 固定隨機混入 2 張道具卡
        const powerUpTypes = [
            { icon: 'fa-gem', color: 'text-emerald-500', name: 'Bonus' },
            { icon: 'fa-bolt', color: 'text-yellow-400', name: 'Lightning' }
        ];
        powerUpTypes.forEach((p, idx) => {
            newCards.push({ id: `powerup-${idx}`, matchId: `powerup-${idx}`, icon: p.icon, color: p.color, text: p.name, type: 'powerup', isPowerUp: true });
        });

        newCards = newCards.sort(() => Math.random() - 0.5);
        
        setCards(newCards);
        setFlippedIndices([]);
        setMatchedIds([]);
        setIsAnimating(false);
    }, [availableWords]);

    useEffect(() => {
        initDeck();
    }, [wave, initDeck]);

    const handleCardClick = (index) => {
        if (isAnimating || flippedIndices.includes(index) || matchedIds.includes(cards[index].matchId)) return;

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
                setTimeout(() => {
                    setFlippedIndices([]);
                    setIsAnimating(false);
                }, 1000);
            }
        }
    };

    const checkWaveComplete = (currentMatchedCount) => {
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
        <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 flex flex-col h-screen select-none animate-[fadeIn_0.5s_ease-out]">
            <header className="shrink-0 flex justify-between items-center mb-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <button onClick={onBack} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold transition-colors flex items-center gap-2">
                    <i className="fa-solid fa-arrow-left"></i> 返回大廳
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
                                {!isFlipped && (
                                    <div className="text-blue-300/60">
                                        <i className="fa-solid fa-globe text-2xl sm:text-3xl animate-pulse"></i>
                                    </div>
                                )}

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
