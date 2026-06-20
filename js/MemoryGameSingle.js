const { useState, useEffect, useMemo, useCallback, useRef } = React;

// ── 設計基準尺寸：整個棋盤都在這個固定座標系裡設計，再由 scale 等比縮放到任何螢幕 ──
const BOARD_W = 700;
const BOARD_H = 400;
const COLS = 5;

// ── 金幣雨子元件：以 position:absolute 運行在棋盤容器內，天然被棋盤邊界裁切 ──
function CoinRainMinigame({ onComplete }) {
    const [items, setItems] = useState([]);
    const [miniScore, setMiniScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [isExploding, setIsExploding] = useState(false);

    const hasCompletedRef = useRef(false);
    const miniScoreRef = useRef(0);
    // 用 ref 存 onComplete，讓 effect 可以存取最新版本的 callback，同時不讓它觸發 effect 重建
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    // 倒數計時器：只在掛載時啟動一次，點金幣不會打斷它(修復原版最嚴重的 bug)
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(l => {
                if (l <= 1) {
                    clearInterval(timer);
                    if (!hasCompletedRef.current) {
                        hasCompletedRef.current = true;
                        onCompleteRef.current(miniScoreRef.current);
                    }
                    return 0;
                }
                return l - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []); // 空依賴陣列：只建立一次

    // 掉落物生成器：只在掛載時啟動一次，節奏穩定
    useEffect(() => {
        const spawner = setInterval(() => {
            if (hasCompletedRef.current) return;
            setItems(prev => [...prev, {
                id: Math.random().toString(36).slice(2),
                type: Math.random() < 0.25 ? 'bomb' : 'coin',
                left: Math.floor(Math.random() * 78) + 10,
                duration: Math.random() * 2 + 2
            }]);
        }, 400);
        return () => clearInterval(spawner);
    }, []);

    const handlePointerDown = (id, type) => {
        if (isExploding || hasCompletedRef.current) return;
        if (type === 'coin') {
            miniScoreRef.current += 1;
            setMiniScore(s => s + 1);
            setItems(prev => prev.filter(it => it.id !== id));
        } else {
            setIsExploding(true);
            setTimeout(() => {
                if (!hasCompletedRef.current) {
                    hasCompletedRef.current = true;
                    onCompleteRef.current(miniScoreRef.current);
                }
            }, 1500);
        }
    };

    return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'rgba(15,23,42,0.92)', borderRadius: 24, overflow: 'hidden' }}>
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fallDown { from { top: -12%; } to { top: 112%; } }
                .coin-fall { position: absolute; animation: fallDown linear forwards; }
            `}} />

            {/* 分數與倒數顯示 */}
            <div style={{ position: 'absolute', top: 14, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 20, zIndex: 60 }}>
                <span style={{ background: '#1e293b', color: '#e2e8f0', padding: '5px 16px', borderRadius: 10, fontWeight: 900, fontSize: 18, border: '1px solid #475569' }}>⏱ {timeLeft}s</span>
                <span style={{ background: '#422006', color: '#fbbf24', padding: '5px 16px', borderRadius: 10, fontWeight: 900, fontSize: 18, border: '1px solid #92400e' }}>🪙 {miniScore}pt</span>
            </div>

            {/* 掉落物 */}
            {!isExploding && items.map(item => (
                <button key={item.id} className="coin-fall"
                    onPointerDown={() => handlePointerDown(item.id, item.type)}
                    style={{ left: `${item.left}%`, animationDuration: `${item.duration}s`,
                             fontSize: 34, padding: 8, zIndex: item.type === 'bomb' ? 2 : 1,
                             background: 'none', border: 'none', cursor: 'pointer' }}>
                    {item.type === 'coin'
                        ? <i className="fa-solid fa-coins" style={{ color: '#facc15', filter: 'drop-shadow(0 0 6px rgba(250,204,21,0.9))' }}></i>
                        : <i className="fa-solid fa-bomb" style={{ color: '#ef4444', filter: 'drop-shadow(0 0 6px rgba(255,0,0,0.9))' }}></i>}
                </button>
            ))}

            {/* 爆炸畫面 */}
            {isExploding && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(220,38,38,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 90, borderRadius: 24 }}>
                    💥
                </div>
            )}

            {/* 逃生按鈕：遊戲進行時固定顯示在底部，scale 框架外，避免任何狀況卡死 */}
            <div style={{ flexShrink: 0, textAlign: 'center', padding: '4px 0', background: 'rgba(15,23,42,0.6)' }}>
                <button onClick={onBack}
                    style={{ fontSize: 12, color: '#64748b', border: 'none', background: 'none', cursor: 'pointer', padding: '6px 20px', letterSpacing: 1 }}>
                    ← 返回遊戲大廳
                </button>
            </div>
        </div>
    );
}

// ── 主遊戲元件 ──
function MemoryGameSingle({ onBack, settings, wordDatabase, onSaveScore }) {
    const t = {
        title: '星際記憶翻牌',
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
    const [peekIndices, setPeekIndices] = useState([]);
    const [radarActive, setRadarActive] = useState(false);
    const [activeMinigame, setActiveMinigame] = useState(null);
    const [miniGameSettlement, setMiniGameSettlement] = useState(null);
    const isFinishingRef = useRef(false);

    // ── 等比縮放：用 ResizeObserver 偵測 wrapper 大小，計算讓棋盤完整顯示所需的 scale ──
    const wrapperRef = useRef(null);
    const [scale, setScale] = useState(1);
    useEffect(() => {
        const update = () => {
            if (!wrapperRef.current) return;
            const { clientWidth: w, clientHeight: h } = wrapperRef.current;
            setScale(Math.min(w / BOARD_W, h / BOARD_H) * 0.97);
        };
        update();
        const ro = new ResizeObserver(update);
        if (wrapperRef.current) ro.observe(wrapperRef.current);
        return () => ro.disconnect();
    }, []);

    // ── 可用單字 ──
    const availableWords = useMemo(() => {
        if (!wordDatabase || !settings || !settings.selectedUnits) return [];
        return wordDatabase.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
    }, [settings, wordDatabase]);

    // ── 初始化牌組 ──
    const initDeck = useCallback(() => {
        if (availableWords.length === 0) return;
        isFinishingRef.current = false;
        const shuffledWords = [...availableWords].sort(() => Math.random() - 0.5);
        const pairCount = Math.min(shuffledWords.length, 9);
        const selectedWords = shuffledWords.slice(0, pairCount);
        let newCards = [];
        selectedWords.forEach((word, idx) => {
            const enText = word.en || word.english || word.word || '[英文遺失]';
            const zhText = word.zh || word.chinese || word.translation || '[中文遺失]';
            const matchKey = `pair_${idx}`; // 用索引當代號，避免同拼字不同義的單字撞名
            newCards.push({ id: `en-${matchKey}`, matchId: matchKey, text: enText, type: 'en', isPowerUp: false });
            newCards.push({ id: `zh-${matchKey}`, matchId: matchKey, text: zhText, type: 'zh', isPowerUp: false });
        });
        const allPowerUps = [
            { id: 'powerup_bonus',     icon: 'fa-gem',            color: '#34d399', name: '加分卡 (+30)' },
            { id: 'powerup_radar',     icon: 'fa-satellite-dish', color: '#4ade80', name: '雷達卡 (透視)' },
            { id: 'powerup_peek',      icon: 'fa-eye',            color: '#818cf8', name: '偷看卡 (2張)' },
            { id: 'powerup_lightning', icon: 'fa-bolt',           color: '#fde047', name: '閃電卡 (自動)' },
            { id: 'powerup_coin',      icon: 'fa-coins',          color: '#fbbf24', name: '金幣雨' }
        ];
        allPowerUps.sort(() => Math.random() - 0.5).slice(0, 2).forEach((p, idx) => {
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


    // ── 防止手機下拉重新整理和雙指縮放等干擾遊戲的系統手勢 ──
    useEffect(() => {
        const prev = { overscroll: document.body.style.overscrollBehavior, overflow: document.body.style.overflow };
        document.body.style.overscrollBehavior = 'none';
        document.body.style.overflow = 'hidden';
        const blockPull = (e) => { if (e.touches && e.touches.length > 0) e.preventDefault(); };
        document.addEventListener('touchmove', blockPull, { passive: false });
        return () => {
            document.body.style.overscrollBehavior = prev.overscroll;
            document.body.style.overflow = prev.overflow;
            document.removeEventListener('touchmove', blockPull);
        };
    }, []);

    useEffect(() => { initDeck(); }, [initDeck]);

    // ── 道具效果 ──
    const triggerPowerUp = (powerId, cardIndex) => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
        if (powerId === 'powerup_bonus') {
            setScore(s => s + 30);
        } else if (powerId === 'powerup_radar') {
            setRadarActive(true);
            setTimeout(() => setRadarActive(false), 5000); // 修復：5秒而非原本的2秒
        } else if (powerId === 'powerup_peek') {
            const validIndices = cards.map((_, i) => i).filter(i =>
                !matchedIds.includes(cards[i].matchId) && !flippedIndices.includes(i) && i !== cardIndex
            );
            setPeekIndices(validIndices.sort(() => 0.5 - Math.random()).slice(0, 2));
            setTimeout(() => setPeekIndices([]), 5000);
        } else if (powerId === 'powerup_lightning') {
            if (flippedIndices.length === 0) {
                const unmatched = cards.filter(c => !c.isPowerUp && !matchedIds.includes(c.matchId));
                if (unmatched.length > 0) {
                    const pick = unmatched[Math.floor(Math.random() * unmatched.length)]; // 修復：真正隨機
                    setMatchedIds(prev => [...prev, pick.matchId]);
                    setScore(s => s + 10);
                }
            } else if (flippedIndices.length === 1) {
                setMatchedIds(prev => [...prev, cards[flippedIndices[0]].matchId]);
                setScore(s => s + 10);
                setFlippedIndices([]);
            }
        } else if (powerId === 'powerup_coin') {
            setActiveMinigame('coin_rain');
        }
    };

    // ── 點擊卡牌 ──
    const handleCardClick = (index) => {
        if (isAnimating || flippedIndices.includes(index) || matchedIds.includes(cards[index].matchId) || peekIndices.includes(index)) return;
        const card = cards[index];
        if (card.isPowerUp) {
            setMatchedIds(prev => [...prev, card.matchId]);
            triggerPowerUp(card.matchId, index);
            return;
        }
        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);
        if (newFlipped.length === 2) {
            setIsAnimating(true);
            const c1 = cards[newFlipped[0]], c2 = cards[newFlipped[1]];
            const isMatch = c1.matchId === c2.matchId && c1.type !== c2.type;
            setTimeout(() => {
                if (isMatch) { setMatchedIds(prev => [...prev, c1.matchId]); setScore(s => s + 10); }
                setFlippedIndices([]);
                setIsAnimating(false);
            }, isMatch ? 600 : 1000);
        }
    };

    // ── 結算判斷：用 Set 計算相異 matchId 數量，不再用固定公式，道具卡數量改了也不會壞 ──
    useEffect(() => {
        if (cards.length === 0 || isFinishingRef.current) return;
        const totalUnique = new Set(cards.map(c => c.matchId)).size;
        if (matchedIds.length >= totalUnique) {
            isFinishingRef.current = true;
            const timeTaken = Math.floor((Date.now() - startTime) / 1000);
            setTimeBonus(Math.max(0, 120 - timeTaken));
            setTimeout(() => setGameOver(true), 1500);
        }
    }, [matchedIds, cards, startTime]);

    const handleFinishAndSave = () => {
        if (onSaveScore) onSaveScore({ gameMode: 'memory_single', score: score + timeBonus, date: new Date().toISOString() });
        onBack();
    };

    // ── 題庫不足時的提示畫面 ──
    if (availableWords.length === 0) {
        return (
            <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white', padding: 24 }}>
                <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>{t.missingWords}</p>
                <button onClick={onBack} style={{ padding: '12px 24px', background: '#2563eb', borderRadius: 12, fontWeight: 700, color: 'white', border: 'none', cursor: 'pointer' }}>返回大廳</button>
            </div>
        );
    }

    const ROWS = Math.ceil(cards.length / COLS);

    return (
        <div style={{ width: '100%', height: '100dvh', display: 'flex', flexDirection: 'column', userSelect: 'none', touchAction: 'none', overscrollBehavior: 'none' }}
             className="bg-slate-50 dark:bg-slate-900">

            {/* 金幣雨結算疊層：在 transform 容器外面，使用 position:fixed 不受 scale 影響，確保全螢幕可見 */}
            {miniGameSettlement && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.93)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <i className="fa-solid fa-coins" style={{ fontSize: 76, color: '#fbbf24', marginBottom: 20 }}></i>
                    <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 10, letterSpacing: 4 }}>金幣雨結算</div>
                    <div style={{ fontSize: 60, fontWeight: 900, color: '#fbbf24' }}>+{miniGameSettlement.score} 分</div>
                </div>
            )}

            {/* ── 頂部標題列 ── */}
            <header style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px' }}
                    className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
                <button onClick={onBack} style={{ padding: '8px 14px', borderRadius: 12, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200">
                    <i className="fa-solid fa-arrow-left"></i> 返回
                </button>
                <span style={{ fontWeight: 900, fontSize: 17 }} className="text-blue-600 dark:text-blue-400 hidden sm:block">{t.title}</span>
                <div style={{ padding: '8px 14px', borderRadius: 12 }} className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span style={{ fontSize: 12, fontWeight: 700, marginRight: 6 }} className="text-slate-400">Score</span>
                    <span style={{ fontSize: 20, fontWeight: 900 }} className="text-emerald-500">{score}</span>
                </div>
            </header>

            {/* ── 主內容區 ── */}
            {gameOver ? (
                // ── 結算畫面 ──
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, overflowY: 'auto' }}>
                    <div style={{ background: 'white', borderRadius: 24, padding: 32, textAlign: 'center', maxWidth: 400, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}
                         className="dark:bg-slate-800">
                        <i className="fa-solid fa-trophy" style={{ fontSize: 56, color: '#fbbf24', marginBottom: 20 }}></i>
                        <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 20 }} className="text-slate-800 dark:text-white">{t.gameOver}</h2>
                        <div style={{ borderRadius: 16, padding: 20, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12 }}
                             className="bg-slate-50 dark:bg-slate-900">
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700 }} className="text-slate-600 dark:text-slate-300">
                                <span>配對得分</span><span>{score} 分</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, paddingBottom: 12 }}
                                 className="text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                                <span>時間紅利</span><span>+{timeBonus} 分</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, fontWeight: 900 }} className="text-emerald-600 dark:text-emerald-400">
                                <span>總分</span><span>{score + timeBonus} 分</span>
                            </div>
                        </div>
                        <button onClick={handleFinishAndSave}
                                style={{ padding: '14px 24px', background: 'linear-gradient(135deg, #2563eb, #4f46e5)', color: 'white', borderRadius: 16, fontWeight: 700, fontSize: 17, border: 'none', cursor: 'pointer', width: '100%' }}>
                            <i className="fa-solid fa-upload" style={{ marginRight: 8 }}></i>{t.saveScore}
                        </button>
                    </div>
                </div>
            ) : (
                // ── 棋盤 Scale Wrapper ──
                // 這個 div 填滿剩餘高度，ResizeObserver 偵測它的尺寸來計算 scale
                <div ref={wrapperRef} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
                     className="bg-slate-100 dark:bg-slate-950">

                    {/* 固定設計尺寸的棋盤容器：透過 CSS transform scale 等比縮放到任何螢幕 */}
                    <div style={{
                        width: BOARD_W,
                        height: BOARD_H,
                        flexShrink: 0,
                        transform: `scale(${scale})`,
                        transformOrigin: 'center center',
                        position: 'relative',  // 讓金幣雨的 position:absolute 有參照點
                        overflow: 'hidden',     // 裁切金幣雨，讓它不會溢出棋盤邊框
                        borderRadius: 24,
                        background: radarActive ? 'rgba(16,185,129,0.12)' : undefined,
                        boxShadow: radarActive
                            ? '0 0 0 4px #4ade80, 0 0 40px rgba(74,222,128,0.4), inset 0 2px 10px rgba(0,0,0,0.2)'
                            : 'inset 0 2px 10px rgba(0,0,0,0.2)',
                        transition: 'box-shadow 0.5s, background 0.5s',
                        // 棋盤本身也是 grid 容器
                        display: 'grid',
                        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                        gap: 8,
                        padding: 10
                    }} className="bg-slate-200 dark:bg-slate-950">

                        {/* 金幣雨：position:absolute 疊在棋盤上，自然受到 overflow:hidden 裁切在棋盤邊界內 */}
                        {activeMinigame === 'coin_rain' && (
                            <CoinRainMinigame onComplete={(miniScore) => {
                                setActiveMinigame(null);
                                setMiniGameSettlement({ score: miniScore });
                                setTimeout(() => {
                                    setScore(s => s + miniScore);
                                    setMiniGameSettlement(null);
                                }, 1800);
                            }} />
                        )}

                        {/* 卡牌 */}
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
                                    style={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 10,
                                        border: isRadarRevealed ? '2px solid #4ade80'
                                              : isFlipped    ? '2px solid #93c5fd'
                                              :                 '2px solid #3b82f6',
                                        background: isRadarRevealed ? 'rgba(5,150,105,0.25)'
                                                  : isFlipped    ? 'white'
                                                  :                 'linear-gradient(160deg, #3b82f6, #1d4ed8)',
                                        boxShadow: isFlipped ? 'inset 0 2px 6px rgba(0,0,0,0.1)' : '0 4px 0 #1e40af',
                                        opacity: isPermanentlyFlipped && !card.isPowerUp ? 0.35 : 1,
                                        transform: isPermanentlyFlipped && !card.isPowerUp ? 'scale(0.95)' : 'none',
                                        cursor: isPermanentlyFlipped || isRadarRevealed ? 'default' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 5,
                                        transition: 'all 0.3s',
                                        overflow: 'hidden'
                                    }}
                                    className={isFlipped && !isRadarRevealed ? 'dark:bg-slate-800' : ''}
                                >
                                    {!isFlipped && (
                                        <i className="fa-solid fa-globe" style={{ fontSize: 22, color: 'rgba(147,197,253,0.45)' }}></i>
                                    )}
                                    {isFlipped && (
                                        <div style={{ width: '100%', textAlign: 'center', padding: '0 2px' }}>
                                            {card.isPowerUp ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                                                    <i className={`fa-solid ${card.icon}`} style={{ fontSize: 25, color: card.color }}></i>
                                                    <span style={{ fontSize: 10, fontWeight: 900, lineHeight: 1.2 }} className="text-slate-600 dark:text-slate-300">{card.text}</span>
                                                </div>
                                            ) : (
                                                // 字體尺寸用 px：因為在固定設計座標系內，會隨 scale 等比縮放，視覺效果穩定
                                                <span style={{
                                                    display: 'block',
                                                    fontSize: card.type === 'en' ? 19 : 16,
                                                    fontWeight: 700,
                                                    lineHeight: 1.25,
                                                    wordBreak: 'break-word',
                                                    color: card.type === 'en' ? '#2563eb' : '#334155',
                                                    fontFamily: card.type === 'en' ? 'monospace, monospace' : 'inherit'
                                                }} className={card.type === 'en' ? 'dark:text-blue-400' : 'dark:text-slate-100'}>
                                                    {card.text}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    {isPermanentlyFlipped && !card.isPowerUp && (
                                        <div style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white', fontSize: 9, color: 'white', zIndex: 10 }}>
                                            <i className="fa-solid fa-check"></i>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 逃生按鈕：遊戲進行時固定顯示在底部，scale 框架外，避免任何狀況卡死 */}
            <div style={{ flexShrink: 0, textAlign: 'center', padding: '4px 0', background: 'rgba(15,23,42,0.6)' }}>
                <button onClick={onBack}
                    style={{ fontSize: 12, color: '#64748b', border: 'none', background: 'none', cursor: 'pointer', padding: '6px 20px', letterSpacing: 1 }}>
                    ← 返回遊戲大廳
                </button>
            </div>
        </div>
    );
}
