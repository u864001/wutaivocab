function MemoryGameSingle({ onBack, settings, wordDatabase }) {
    const [cards, setCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedIds, setMatchedIds] = useState([]);
    const [score, setScore] = useState(0);
    const [wave, setWave] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);

    // 從題庫中篩選出使用者選擇的範圍
    const availableWords = useMemo(() => {
        return wordDatabase.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
    }, [settings, wordDatabase]);

    // 初始化牌組 (Wave 產生器)
    const initDeck = useCallback(() => {
        if (availableWords.length === 0) return;

        // 1. 隨機挑選 9 個單字
        const shuffledWords = [...availableWords].sort(() => Math.random() - 0.5);
        const selectedWords = shuffledWords.slice(0, 9);

        // 2. 製作 18 張單字卡 (9張英文 + 9張中文)
        let newCards = [];
        selectedWords.forEach(word => {
            newCards.push({ id: `en-${word.english}`, matchId: word.english, text: word.english, type: 'en', isPowerUp: false });
            newCards.push({ id: `zh-${word.english}`, matchId: word.english, text: word.chinese, type: 'zh', isPowerUp: false });
        });

        // 3. 隨機挑選 2 張道具卡 (單機版先以加分卡代替測試)
        const powerUpTypes = [
            { icon: 'fa-gem', color: 'text-emerald-500', name: 'Bonus' },
            { icon: 'fa-bolt', color: 'text-yellow-400', name: 'Lightning' }
        ];
        powerUpTypes.forEach((p, idx) => {
            newCards.push({ id: `powerup-${idx}`, matchId: `powerup-${idx}`, icon: p.icon, color: p.color, text: p.name, type: 'powerup', isPowerUp: true });
        });

        // 4. 洗牌
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

    // 翻牌邏輯
    const handleCardClick = (index) => {
        // 防止重複點擊或動畫播放中點擊
        if (isAnimating || flippedIndices.includes(index) || matchedIds.includes(cards[index].matchId)) return;

        // 如果是道具卡 (單機版直接觸發效果並消除)
        if (cards[index].isPowerUp) {
            setMatchedIds(prev => [...prev, cards[index].matchId]);
            setScore(prev => prev + 50); // 道具卡加分
            checkWaveComplete(matchedIds.length + 1);
            return;
        }

        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        // 如果翻開了兩張牌
        if (newFlipped.length === 2) {
            setIsAnimating(true);
            const card1 = cards[newFlipped[0]];
            const card2 = cards[newFlipped[1]];

            if (card1.matchId === card2.matchId && card1.type !== card2.type) {
                // 配對成功
                setTimeout(() => {
                    setMatchedIds(prev => {
                        const newMatched = [...prev, card1.matchId];
                        checkWaveComplete(newMatched.length + (cards.filter(c => c.isPowerUp).length)); 
                        // 計算消除進度：配對成功的字組 + 已經用掉的道具卡
                        return newMatched;
                    });
                    setScore(prev => prev + 10);
                    setFlippedIndices([]);
                    setIsAnimating(false);
                }, 600);
            } else {
                // 配對失敗，蓋回去
                setTimeout(() => {
                    setFlippedIndices([]);
                    setIsAnimating(false);
                }, 1000);
            }
        }
    };

    // 檢查是否完成當前波段
    const checkWaveComplete = (currentMatchedCount) => {
        // 9組單字 + 2張道具卡 = 11個獨立的 matchId
        if (currentMatchedCount >= 11) {
            setTimeout(() => {
                setWave(prev => prev + 1);
            }, 1500);
        }
    };

    if (availableWords.length === 0) return <div className="text-center p-10">請先返回大廳選擇題庫！</div>;

    return (
        <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 animate-[fadeIn_0.5s_ease-out] flex flex-col h-screen">
            
            {/* 標準化頂部導覽列 (採用一致性設計) */}
            <header className="shrink-0 flex justify-between items-center mb-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <button onClick={onBack} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold transition-colors flex items-center gap-2">
                    <i className="fa-solid fa-arrow-left"></i> 返回上一層
                </button>
                
                <div className="flex items-center gap-4">
                    <div className="text-center hidden sm:block">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Wave</span>
                        <span className="text-xl font-black text-blue-600 dark:text-blue-400">{wave}</span>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="text-sm text-slate-500 font-bold mr-2">Score</span>
                        <span className="text-xl font-black text-emerald-500">{score}</span>
                    </div>
                </div>
            </header>

            {/* 遊戲區域：強制 4x5 網格 */}
            <div className="flex-1 min-h-0 flex items-center justify-center">
                <div className="w-full h-full max-h-[80vh] grid grid-cols-5 grid-rows-4 gap-2 sm:gap-3 lg:gap-4 p-2 bg-slate-100 dark:bg-slate-900 rounded-3xl border-4 border-slate-200 dark:border-slate-700 shadow-inner">
                    {cards.map((card, index) => {
                        const isFlipped = flippedIndices.includes(index) || matchedIds.includes(card.matchId);
                        const isMatched = matchedIds.includes(card.matchId);

                        return (
                            <button
                                key={index}
                                onClick={() => handleCardClick(index)}
                                disabled={isMatched}
                                className={`relative w-full h-full rounded-xl sm:rounded-2xl flex items-center justify-center p-2 transition-all duration-300 transform perspective-1000 ${
                                    isFlipped ? 'bg-white dark:bg-slate-800 shadow-md border-2 border-blue-200 dark:border-blue-800 rotate-0' : 'bg-blue-500 hover:bg-blue-400 shadow-[0_4px_0_rgb(29,78,216)] hover:-translate-y-1'
                                } ${isMatched && !card.isPowerUp ? 'opacity-50 scale-95 border-emerald-400 dark:border-emerald-600' : ''}`}
                            >
                                {/* 牌背 (未翻開) */}
                                {!isFlipped && (
                                    <div className="text-blue-300 opacity-50">
                                        <i className="fa-solid fa-planet-ringed text-3xl sm:text-4xl"></i>
                                    </div>
                                )}

                                {/* 牌面 (已翻開) */}
                                {isFlipped && (
                                    <div className="animate-[zoomIn_0.2s_ease-out] w-full text-center break-words">
                                        {card.isPowerUp ? (
                                            <div className="flex flex-col items-center gap-1 sm:gap-2">
                                                <i className={`fa-solid ${card.icon} text-3xl sm:text-4xl ${card.color} animate-bounce`}></i>
                                                <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200">{card.text}</span>
                                            </div>
                                        ) : (
                                            <span className={`font-bold ${card.type === 'en' ? 'text-lg sm:text-xl lg:text-2xl text-blue-600 dark:text-blue-400' : 'text-base sm:text-lg lg:text-xl text-slate-700 dark:text-slate-200'}`}>
                                                {card.text}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* 配對成功的打勾特效 */}
                                {isMatched && !card.isPowerUp && (
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm animate-[ping_0.5s_ease-out_1_reverse]">
                                        <i className="fa-solid fa-check text-xs"></i>
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
