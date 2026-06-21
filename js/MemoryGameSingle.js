const { useState, useEffect, useMemo, useCallback, useRef } = React;

// ── 設計基準尺寸：整個棋盤都在這個固定座標系裡設計，再由 scale 等比縮放到任何螢幕 ──
const BOARD_W = 700;
const BOARD_H = 400;
const COLS = 5;

// 安全取得週次的純函式 (Fallback，確保一定有週次能上榜)
const getWeekNumberSafe = () => {
    if (typeof window.getWeekNumber === 'function') return window.getWeekNumber();
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

// ── 金幣雨子元件：以 position:absolute 運行在棋盤容器內，天然被棋盤邊界裁切 ──
function CoinRainMinigame({ onComplete }) {
    const [items, setItems] = useState([]);
    const [miniScore, setMiniScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [isExploding, setIsExploding] = useState(false);

    const hasCompletedRef = useRef(false);
    const miniScoreRef = useRef(0);
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

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
    }, []);

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
        <div style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'rgba(5,8,20,0.96)', borderRadius: 24, overflow: 'hidden' }}>
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fallDown { from { top: -12%; } to { top: 112%; } }
                .coin-fall { position: absolute; animation: fallDown linear forwards; }
            `}} />

            <div style={{ position: 'absolute', top: 14, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 20, zIndex: 60 }}>
                <span style={{ background: '#0d1b38', color: '#93c5fd', padding: '5px 16px', borderRadius: 10, fontWeight: 900, fontSize: 18, border: '1px solid #1e3a8a', boxShadow: '0 0 10px rgba(59,130,246,0.2)' }}>⏱ {timeLeft}s</span>
                <span style={{ background: '#1a0e00', color: '#fbbf24', padding: '5px 16px', borderRadius: 10, fontWeight: 900, fontSize: 18, border: '1px solid #78350f', boxShadow: '0 0 10px rgba(251,191,36,0.2)' }}>🪙 {miniScore}pt</span>
            </div>

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

            {isExploding && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(220,38,38,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 90, borderRadius: 24 }}>
                    💥
                </div>
            )}
        </div>
    );
}

// ── 主遊戲元件 ──
function MemoryGameSingle({ onBack, settings, wordDatabase, onSaveScore }) {
    const t = {
        title: '星際記憶翻牌',
        gameOver: '挑戰完成！',
        saveScore: '送出成績並回大廳',
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
    const [finalTime, setFinalTime] = useState(0);
    const [peekIndices, setPeekIndices] = useState([]);
    const [radarActive, setRadarActive] = useState(false);
    const [activeMinigame, setActiveMinigame] = useState(null);
    const [miniGameSettlement, setMiniGameSettlement] = useState(null);
    const [playerName, setPlayerName] = useState(localStorage.getItem('wutai_player_name') || '');
    const isFinishingRef = useRef(false);

    // ── 視覺層：追蹤剛配對成功的卡牌，觸發白光閃爍 ──
    const [flashMatchIds, setFlashMatchIds] = useState(new Set());
    const prevMatchedIdsRef = useRef([]);

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

    // ── 視覺層：偵測 matchedIds 新增項目，短暫觸發白光閃爍 ──
    useEffect(() => {
        const prev = prevMatchedIdsRef.current;
        const newlyMatched = matchedIds.filter(id => !prev.includes(id));
        if (newlyMatched.length > 0) {
            setFlashMatchIds(new Set(newlyMatched));
            setTimeout(() => setFlashMatchIds(new Set()), 680);
        }
        prevMatchedIdsRef.current = matchedIds;
    }, [matchedIds]);

    // ── 視覺層：生成一次性星空座標，不影響任何遊戲狀態 ──
    const stars = useMemo(() =>
        Array.from({ length: 90 }, (_, i) => ({
            id: i,
            top: Math.random() * 100,
            left: Math.random() * 100,
            size: Math.random() * 2.2 + 0.4,
            delay: Math.random() * 7,
            duration: Math.random() * 3 + 2.5
        })),
    []);

    const availableWords = useMemo(() => {
        if (!wordDatabase || !settings || !settings.selectedUnits) return [];
        return wordDatabase.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
    }, [settings, wordDatabase]);

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
            const matchKey = `pair_${idx}`;
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

    const triggerPowerUp = (powerId, cardIndex) => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
        if (powerId === 'powerup_bonus') {
            setScore(s => s + 30);
        } else if (powerId === 'powerup_radar') {
            setRadarActive(true);
            setTimeout(() => setRadarActive(false), 5000);
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
                    const pick = unmatched[Math.floor(Math.random() * unmatched.length)];
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

    useEffect(() => {
        if (cards.length === 0 || isFinishingRef.current) return;
        const totalUnique = new Set(cards.map(c => c.matchId)).size;
        if (matchedIds.length >= totalUnique) {
            isFinishingRef.current = true;
            const timeTaken = Math.floor((Date.now() - startTime) / 1000);
            setFinalTime(timeTaken);
            setTimeBonus(Math.max(0, 120 - timeTaken));
            setTimeout(() => setGameOver(true), 1500);
        }
    }, [matchedIds, cards, startTime]);

    // ── 完美對齊排行榜的送分邏輯 ──
    const handleFinishAndSave = () => {
        if (!playerName.trim()) {
            alert('請輸入你的名字才能上榜喔！');
            return;
        }
        localStorage.setItem('wutai_player_name', playerName.trim());

        const books = [...new Set(settings?.selectedUnits?.map(u => u.split('-')[0]) || [])];
        const qualifyBook = books.length === 1 ? books[0] : 'Mixed';

        if (onSaveScore) {
            onSaveScore({
                name: playerName.trim(),
                mode: 'memory_single',
                book: qualifyBook,
                week: getWeekNumberSafe(),
                score: score + timeBonus,
                time: finalTime,
                date: new Date().toISOString()
            });
        }
        onBack();
    };

    if (availableWords.length === 0) {
        return (
            <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#080c1a', color: 'white', padding: 24 }}>
                <i className="fa-solid fa-satellite-dish" style={{ fontSize: 48, color: '#3b82f6', marginBottom: 20, filter: 'drop-shadow(0 0 16px rgba(59,130,246,0.7))' }}></i>
                <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, textAlign: 'center', color: '#94a3b8' }}>{t.missingWords}</p>
                <button onClick={onBack} style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', borderRadius: 12, fontWeight: 700, color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 0 24px rgba(59,130,246,0.5)' }}>返回大廳</button>
            </div>
        );
    }

    const ROWS = Math.ceil(cards.length / COLS);

    return (
        <div style={{
            width: '100%', height: '100dvh', display: 'flex', flexDirection: 'column',
            userSelect: 'none', touchAction: 'none', overscrollBehavior: 'none',
            background: '#080c1a'
        }}>

            {/* ══════════════════════════════════════
                深空主題全域 CSS 動畫
            ══════════════════════════════════════ */}
            <style dangerouslySetInnerHTML={{ __html: `

                @keyframes twinkle {
                    0%, 100% { opacity: 0.1; transform: scale(0.8); }
                    50%       { opacity: 1;   transform: scale(1.6); }
                }

                @keyframes matchFlash {
                    0%   { box-shadow: 0 0 14px 4px rgba(96,165,250,0.8); }
                    30%  { box-shadow: 0 0 55px 28px #ffffff, 0 0 90px 50px rgba(255,255,255,0.55); }
                    100% { box-shadow: 0 0 14px 4px rgba(96,165,250,0.4); }
                }

                @keyframes plasmaGlow {
                    0%, 100% { box-shadow: 0 0 10px 3px rgba(59,130,246,0.65), 0 0 24px 7px rgba(59,130,246,0.2); }
                    50%      { box-shadow: 0 0 20px 8px rgba(96,165,250,0.9),  0 0 42px 16px rgba(96,165,250,0.38); }
                }

                @keyframes powerupHalo {
                    0%, 100% { opacity: 0.55; transform: scale(1); }
                    50%      { opacity: 1;    transform: scale(1.08); }
                }

                @keyframes scanDrift {
                    from { background-position: 0 0; }
                    to   { background-position: 0 80px; }
                }

                .bridge-header {
                    position: relative;
                    overflow: hidden;
                }
                .bridge-header::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: repeating-linear-gradient(
                        0deg,
                        transparent 0px, transparent 3px,
                        rgba(59,130,246,0.04) 3px, rgba(59,130,246,0.04) 4px
                    );
                    pointer-events: none;
                    animation: scanDrift 6s linear infinite;
                }

                .card-flash {
                    animation: matchFlash 0.68s ease-out forwards !important;
                }

                .card-plasma {
                    animation: plasmaGlow 2.4s ease-in-out infinite;
                }

                .powerup-halo {
                    animation: powerupHalo 2s ease-in-out infinite;
                }

                .space-input:focus {
                    border-color: #3b82f6 !important;
                    box-shadow: 0 0 0 3px rgba(59,130,246,0.25), 0 0 20px rgba(59,130,246,0.2) !important;
                }

                .space-submit:hover {
                    transform: scale(1.02);
                    box-shadow: 0 0 40px rgba(59,130,246,0.6), 0 10px 25px rgba(0,0,0,0.4) !important;
                }
                .space-submit:active { transform: scale(0.97); }

                .space-back:hover {
                    background: rgba(30,58,138,0.55) !important;
                    border-color: #3b82f6 !important;
                }
            `}} />

            {/* ══════════════════════════════════════
                小遊戲結算遮罩
            ══════════════════════════════════════ */}
            {miniGameSettlement && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 200,
                    background: 'radial-gradient(ellipse at center, #050f28 0%, rgba(0,3,10,0.97) 100%)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white'
                }}>
                    <i className="fa-solid fa-coins" style={{ fontSize: 76, color: '#fbbf24', marginBottom: 20, filter: 'drop-shadow(0 0 22px rgba(251,191,36,0.95))' }}></i>
                    <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 10, letterSpacing: 4, color: '#93c5fd' }}>金幣雨結算</div>
                    <div style={{ fontSize: 60, fontWeight: 900, color: '#fbbf24', textShadow: '0 0 32px rgba(251,191,36,0.85)' }}>+{miniGameSettlement.score} 分</div>
                </div>
            )}

            {/* ══════════════════════════════════════
                深色艦橋標題列
            ══════════════════════════════════════ */}
            <header
                className="bridge-header"
                style={{
                    flexShrink: 0,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 16px', zIndex: 10,
                    background: 'linear-gradient(90deg, #03060f 0%, #091426 50%, #03060f 100%)',
                    borderBottom: '1px solid #1e3a8a',
                    boxShadow: '0 2px 24px rgba(59,130,246,0.18), 0 1px 0 rgba(96,165,250,0.08)'
                }}
            >
                <button
                    onClick={onBack}
                    className="space-back"
                    style={{
                        padding: '8px 14px', borderRadius: 12, fontWeight: 700,
                        border: '1px solid #1e3a8a', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: 'rgba(9,20,38,0.85)', color: '#93c5fd',
                        transition: 'all 0.2s'
                    }}
                >
                    <i className="fa-solid fa-arrow-left"></i> 返回
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <i className="fa-solid fa-rocket" style={{
                        fontSize: 15, color: '#60a5fa',
                        filter: 'drop-shadow(0 0 6px rgba(96,165,250,0.8))',
                        transform: 'rotate(-45deg)'
                    }}></i>
                    <span style={{
                        fontWeight: 900, fontSize: 17,
                        color: '#93c5fd', letterSpacing: 3,
                        textShadow: '0 0 14px rgba(96,165,250,0.7)'
                    }}>{t.title}</span>
                </div>

                <div style={{
                    padding: '8px 14px', borderRadius: 12,
                    background: 'rgba(9,20,38,0.9)', border: '1px solid #1e3a8a',
                    boxShadow: '0 0 12px rgba(52,211,153,0.08)'
                }}>
                    <span style={{ fontSize: 12, fontWeight: 700, marginRight: 6, color: '#334155', letterSpacing: 1 }}>SCORE</span>
                    <span style={{ fontSize: 20, fontWeight: 900, color: '#34d399', textShadow: '0 0 12px rgba(52,211,153,0.75)' }}>{score}</span>
                </div>
            </header>

            {gameOver ? (
                /* ══════════════════════════════════════
                   通關畫面
                ══════════════════════════════════════ */
                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: 24, overflowY: 'auto', position: 'relative',
                    background: 'radial-gradient(ellipse at 50% 40%, #0d1e40 0%, #080c1a 65%)'
                }}>
                    {/* 通關畫面星星裝飾 */}
                    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                        {stars.slice(0, 50).map(s => (
                            <div key={s.id} style={{
                                position: 'absolute',
                                top: `${s.top}%`, left: `${s.left}%`,
                                width: `${s.size}px`, height: `${s.size}px`,
                                borderRadius: '50%', background: 'white',
                                animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`
                            }} />
                        ))}
                    </div>

                    <div style={{
                        position: 'relative', zIndex: 1,
                        background: 'linear-gradient(160deg, #0d1b38 0%, #060d1f 100%)',
                        borderRadius: 24, padding: 32, textAlign: 'center',
                        maxWidth: 400, width: '100%',
                        border: '1px solid #1e3a8a',
                        boxShadow: '0 0 0 1px rgba(59,130,246,0.12), 0 24px 64px rgba(0,0,0,0.6), 0 0 50px rgba(59,130,246,0.08)'
                    }}>
                        <i className="fa-solid fa-trophy" style={{
                            fontSize: 56, color: '#fbbf24', marginBottom: 20,
                            filter: 'drop-shadow(0 0 18px rgba(251,191,36,0.8))',
                            display: 'block'
                        }}></i>
                        <h2 style={{
                            fontSize: 26, fontWeight: 900, marginBottom: 20,
                            color: '#e2e8f0', letterSpacing: 2
                        }}>{t.gameOver}</h2>

                        <div style={{
                            borderRadius: 16, padding: 20, marginBottom: 20,
                            display: 'flex', flexDirection: 'column', gap: 12,
                            background: 'rgba(4,8,20,0.8)', border: '1px solid #1e3a8a'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700 }}>
                                <span style={{ color: '#94a3b8' }}>配對得分</span>
                                <span style={{ color: '#60a5fa' }}>{score} 分</span>
                            </div>
                            <div style={{
                                display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700,
                                paddingBottom: 12, borderBottom: '1px solid #1e3a8a'
                            }}>
                                <span style={{ color: '#94a3b8' }}>時間紅利</span>
                                <span style={{ color: '#60a5fa' }}>+{timeBonus} 分</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, fontWeight: 900 }}>
                                <span style={{ color: '#34d399' }}>總分</span>
                                <span style={{ color: '#34d399', textShadow: '0 0 14px rgba(52,211,153,0.75)' }}>{score + timeBonus} 分</span>
                            </div>
                        </div>

                        {/* 🌟 玩家名稱輸入框 */}
                        <input
                            type="text"
                            value={playerName}
                            onChange={e => setPlayerName(e.target.value)}
                            placeholder="請輸入你的名字以上榜"
                            className="space-input"
                            style={{
                                width: '100%', padding: '14px', borderRadius: '16px',
                                border: '2px solid #1e3a8a', marginBottom: '20px',
                                fontSize: '18px', textAlign: 'center', fontWeight: 900, outline: 'none',
                                background: 'rgba(4,8,20,0.9)', color: '#e2e8f0',
                                boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s',
                                caretColor: '#60a5fa'
                            }}
                        />

                        <button
                            onClick={handleFinishAndSave}
                            className="space-submit"
                            style={{
                                padding: '16px 24px',
                                background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)',
                                color: 'white', borderRadius: 16, fontWeight: 900, fontSize: 18,
                                border: 'none', cursor: 'pointer', width: '100%',
                                boxShadow: '0 0 28px rgba(59,130,246,0.45), 0 10px 25px rgba(0,0,0,0.35)',
                                transition: 'all 0.2s', letterSpacing: 1
                            }}
                        >
                            <i className="fa-solid fa-upload" style={{ marginRight: 8 }}></i>{t.saveScore}
                        </button>
                    </div>
                </div>
            ) : (
                /* ══════════════════════════════════════
                   星際棋盤遊戲區
                ══════════════════════════════════════ */
                <div
                    ref={wrapperRef}
                    style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden', position: 'relative',
                        background: '#080c1a'
                    }}
                >
                    {/* 閃爍星星背景層 */}
                    {stars.map(s => (
                        <div key={s.id} style={{
                            position: 'absolute',
                            top: `${s.top}%`, left: `${s.left}%`,
                            width: `${s.size}px`, height: `${s.size}px`,
                            borderRadius: '50%', background: 'white',
                            pointerEvents: 'none', zIndex: 0,
                            animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`
                        }} />
                    ))}

                    {/* 棋盤本體 */}
                    <div
                        style={{
                            width: BOARD_W, height: BOARD_H, flexShrink: 0,
                            transform: `scale(${scale})`, transformOrigin: 'center center',
                            position: 'relative', overflow: 'hidden', borderRadius: 24,
                            zIndex: 1,
                            background: radarActive
                                ? 'rgba(16,185,129,0.1)'
                                : 'linear-gradient(145deg, #0a1628 0%, #060d1f 100%)',
                            boxShadow: radarActive
                                ? '0 0 0 4px #4ade80, 0 0 40px rgba(74,222,128,0.4), inset 0 2px 10px rgba(0,0,0,0.3)'
                                : '0 0 0 1px #1a3060, 0 0 50px rgba(59,130,246,0.12), inset 0 2px 10px rgba(0,0,0,0.4)',
                            transition: 'box-shadow 0.5s, background 0.5s',
                            display: 'grid',
                            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                            gap: 8, padding: 10
                        }}
                    >
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

                        {cards.map((card, index) => {
                            const isPermanentlyFlipped = matchedIds.includes(card.matchId);
                            const isTemporarilyFlipped = flippedIndices.includes(index) || peekIndices.includes(index);
                            const isRadarRevealed = radarActive && !isPermanentlyFlipped && !isTemporarilyFlipped;
                            const isFlipped = isPermanentlyFlipped || isTemporarilyFlipped || isRadarRevealed;

                            // 閃光只對字詞卡（非道具）的配對瞬間觸發
                            const isFlashing = flashMatchIds.has(card.matchId) && isPermanentlyFlipped && !card.isPowerUp;

                            // ── 依狀態決定視覺樣式 ──
                            let cardBg, cardBorder, cardOpacity, cardTransform;
                            let cardBoxShadow = undefined;

                            if (isRadarRevealed) {
                                cardBg        = 'rgba(5,150,105,0.18)';
                                cardBorder    = '2px solid #4ade80';
                                cardBoxShadow = '0 0 10px rgba(74,222,128,0.3), inset 0 0 8px rgba(74,222,128,0.08)';
                                cardOpacity   = 1;
                                cardTransform = 'none';

                            } else if (isPermanentlyFlipped && !card.isPowerUp) {
                                if (isFlashing) {
                                    // 閃光瞬間：全亮讓 matchFlash keyframe 有作用
                                    cardBg        = '#060d1f';
                                    cardBorder    = '2px solid #60a5fa';
                                    cardBoxShadow = undefined; // 由 .card-flash 動畫接管
                                    cardOpacity   = 1;
                                    cardTransform = 'scale(1.04)';
                                } else {
                                    // 配對後淡出
                                    cardBg        = 'rgba(6,12,26,0.85)';
                                    cardBorder    = '2px solid #0f2040';
                                    cardBoxShadow = 'none';
                                    cardOpacity   = 0.35;
                                    cardTransform = 'scale(0.95)';
                                }

                            } else if (isFlipped) {
                                // 翻開中（暫時翻開 or 道具卡）：電漿發光由 .card-plasma 控制
                                cardBg        = '#060d1f';
                                cardBorder    = '2px solid #3b82f6';
                                cardBoxShadow = undefined;
                                cardOpacity   = 1;
                                cardTransform = 'none';

                            } else {
                                // 未翻開：暗色金屬質感
                                cardBg        = 'linear-gradient(160deg, #0e1928 0%, #09111e 55%, #0d1726 100%)';
                                cardBorder    = '2px solid #172848';
                                cardBoxShadow = '0 4px 0 #030710, inset 0 1px 0 rgba(255,255,255,0.04), 0 0 6px rgba(23,40,72,0.5)';
                                cardOpacity   = 1;
                                cardTransform = 'none';
                            }

                            const cardClass = isFlashing
                                ? 'card-flash'
                                : (isTemporarilyFlipped && !card.isPowerUp ? 'card-plasma' : '');

                            const buttonStyle = {
                                position: 'relative', width: '100%', height: '100%', borderRadius: 10,
                                border: cardBorder,
                                background: cardBg,
                                opacity: cardOpacity,
                                transform: cardTransform,
                                cursor: isPermanentlyFlipped || isRadarRevealed ? 'default' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: 5,
                                transition: 'opacity 0.3s, transform 0.3s, border-color 0.3s',
                                overflow: 'hidden'
                            };
                            if (cardBoxShadow !== undefined) buttonStyle.boxShadow = cardBoxShadow;

                            return (
                                <button
                                    key={card.id || index}
                                    onClick={() => handleCardClick(index)}
                                    disabled={isPermanentlyFlipped || isRadarRevealed}
                                    className={cardClass}
                                    style={buttonStyle}
                                >
                                    {/* 未翻開：暗色金屬 + 火箭圖示 */}
                                    {!isFlipped && (
                                        <i className="fa-solid fa-rocket" style={{
                                            fontSize: 22,
                                            color: 'rgba(96,165,250,0.28)',
                                            transform: 'rotate(-45deg)',
                                            filter: 'drop-shadow(0 0 4px rgba(59,130,246,0.18))'
                                        }}></i>
                                    )}

                                    {/* 翻開後：內容 */}
                                    {isFlipped && (
                                        <div style={{ width: '100%', textAlign: 'center', padding: '0 2px' }}>
                                            {card.isPowerUp ? (
                                                /* 道具卡：帶對應顏色光暈圓圈 */
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                                    <div
                                                        className="powerup-halo"
                                                        style={{
                                                            width: 46, height: 46, borderRadius: '50%',
                                                            background: `${card.color}18`,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            boxShadow: `0 0 16px 6px ${card.color}55, 0 0 32px 12px ${card.color}1a`,
                                                            border: `1px solid ${card.color}44`
                                                        }}
                                                    >
                                                        <i className={`fa-solid ${card.icon}`} style={{
                                                            fontSize: 22, color: card.color,
                                                            filter: `drop-shadow(0 0 7px ${card.color})`
                                                        }}></i>
                                                    </div>
                                                    <span style={{
                                                        fontSize: 10, fontWeight: 900, lineHeight: 1.2,
                                                        color: card.color,
                                                        textShadow: `0 0 8px ${card.color}99`
                                                    }}>{card.text}</span>
                                                </div>
                                            ) : (
                                                /* 字詞卡：英文等寬字體 + 電漿色 */
                                                <span style={{
                                                    display: 'block',
                                                    fontSize: card.type === 'en' ? 19 : 16,
                                                    fontWeight: 700, lineHeight: 1.25,
                                                    wordBreak: 'break-word',
                                                    color: card.type === 'en' ? '#60a5fa' : '#cbd5e1',
                                                    fontFamily: card.type === 'en'
                                                        ? '"Courier New", Courier, monospace'
                                                        : 'inherit',
                                                    textShadow: card.type === 'en'
                                                        ? '0 0 10px rgba(96,165,250,0.55)'
                                                        : '0 0 6px rgba(203,213,225,0.2)'
                                                }}>{card.text}</span>
                                            )}
                                        </div>
                                    )}

                                    {/* 配對成功綠色勾勾 */}
                                    {isPermanentlyFlipped && !card.isPowerUp && (
                                        <div style={{
                                            position: 'absolute', top: -4, right: -4,
                                            width: 18, height: 18,
                                            background: '#10b981', borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            border: '2px solid #080c1a',
                                            fontSize: 9, color: 'white', zIndex: 10,
                                            boxShadow: '0 0 8px rgba(16,185,129,0.65)'
                                        }}>
                                            <i className="fa-solid fa-check"></i>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════
                底部返回列
            ══════════════════════════════════════ */}
            <div style={{
                flexShrink: 0, textAlign: 'center', padding: '4px 0',
                background: 'rgba(3,6,15,0.95)',
                borderTop: '1px solid rgba(30,58,138,0.35)'
            }}>
                <button onClick={onBack} style={{
                    fontSize: 12, color: '#334155', border: 'none', background: 'none',
                    cursor: 'pointer', padding: '6px 20px', letterSpacing: 1,
                    transition: 'color 0.2s'
                }}>← 返回遊戲大廳</button>
            </div>
        </div>
    );
}
