import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { useI18n } from '../../context/I18nContext';
import { soundEngine, speakEnglish } from '../../services/audio';
import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';
import confetti from 'canvas-confetti';
import { ArrowLeft, Trophy, Sparkles, HelpCircle, Coins, Bomb } from 'lucide-react';

// ── 金幣雨迷你遊戲 ──
const CoinRain = ({ onComplete }) => {
  const [items, setItems] = useState([]);
  const [coinScore, setCoinScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);
  const isFinishedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          if (!isFinishedRef.current) {
            isFinishedRef.current = true;
            onComplete(coinScore);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const spawner = setInterval(() => {
      if (isFinishedRef.current) return;
      setItems(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          type: Math.random() < 0.2 ? 'bomb' : 'coin',
          x: Math.floor(Math.random() * 80) + 10,
          duration: Math.random() * 1.5 + 2
        }
      ]);
    }, 450);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
    };
  }, [coinScore, onComplete]);

  const handleClickItem = (id, type) => {
    if (isFinishedRef.current) return;

    if (type === 'coin') {
      soundEngine.correct();
      setCoinScore(s => s + 1);
      setItems(prev => prev.filter(i => i.id !== id));
    } else {
      soundEngine.explosion();
      isFinishedRef.current = true;
      setTimeout(() => onComplete(coinScore), 500);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/90 rounded-3xl flex flex-col items-center justify-between p-6 overflow-hidden">
      <div className="flex items-center justify-between w-full z-20">
        <span className="px-4 py-1.5 rounded-xl bg-amber-400 text-amber-950 font-black text-sm flex items-center gap-1.5">
          <Coins className="w-4 h-4" /> 金幣: {coinScore}
        </span>
        <span className="px-4 py-1.5 rounded-xl bg-blue-500 text-white font-black text-sm">
          ⏱ 剩餘: {timeLeft}s
        </span>
      </div>

      <div className="absolute inset-0 pointer-events-auto overflow-hidden">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => handleClickItem(item.id, item.type)}
            className="absolute -top-12 animate-fall p-3 cursor-pointer transition-transform active:scale-75"
            style={{
              left: `${item.x}%`,
              animationDuration: `${item.duration}s`,
              animationName: 'fallDown',
              animationTimingFunction: 'linear',
              animationFillMode: 'forwards'
            }}
          >
            {item.type === 'coin' ? (
              <Coins className="w-10 h-10 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            ) : (
              <Bomb className="w-10 h-10 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            )}
          </button>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fallDown {
            from { top: -10%; }
            to { top: 110%; }
          }
        `
      }} />
    </div>
  );
};

export const MemoryGameSingle = ({
  settings,
  words = [],
  qualifyingBook,
  onBack
}) => {
  const { t } = useI18n();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // indices
  const [matched, setMatched] = useState([]); // card ids
  const [moves, setMoves] = useState(0);
  const [showCoinRain, setShowCoinRain] = useState(false);
  const [bonusScore, setBonusScore] = useState(0);

  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const selectedWordsRef = useRef([]);

  const handleStart = () => {
    let pool = words.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
    if (pool.length < 10) pool = words; // fallback
    const selected = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
    selectedWordsRef.current = selected;

    const cardList = [];
    selected.forEach((w, idx) => {
      cardList.push({
        id: `en-${idx}`,
        pairId: idx,
        text: w.en,
        type: 'en',
        speak: w.en
      });
      cardList.push({
        id: `zh-${idx}`,
        pairId: idx,
        text: w.zh,
        type: 'zh',
        speak: w.en
      });
    });

    setCards(cardList.sort(() => 0.5 - Math.random()));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setBonusScore(0);
    setHasStarted(true);
    setIsFinished(false);
    setStartTime(Date.now());
  };

  const handleCardClick = (index) => {
    if (flipped.length >= 2 || flipped.includes(index) || matched.includes(cards[index].id)) {
      return;
    }

    soundEngine.click();
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (cards[index].type === 'en') {
      speakEnglish(cards[index].speak);
    }

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [c1, c2] = [cards[newFlipped[0]], cards[newFlipped[1]]];

      if (c1.pairId === c2.pairId) {
        // 配對成功！
        soundEngine.correct();
        setMatched(m => [...m, c1.id, c2.id]);
        setFlipped([]);

        // 機率觸發金幣雨小彩蛋
        if (Math.random() < 0.25) {
          setTimeout(() => setShowCoinRain(true), 400);
        }

        // 全數配對完成
        if (matched.length + 2 >= cards.length) {
          const finalSec = Math.floor((Date.now() - startTime) / 1000);
          setElapsedTime(finalSec);
          setTimeout(() => {
            setIsFinished(true);
            soundEngine.win();
            confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
          }, 600);
        }
      } else {
        // 配對失敗
        soundEngine.wrong();
        setTimeout(() => setFlipped([]), 900);
      }
    }
  };


  if (!hasStarted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full text-center p-8">
          <div className="w-20 h-20 rounded-3xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-4 animate-float-slow">
            <Sparkles className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2 font-heading">
            {t.memoryTitle}
          </h2>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-6">
            共 20 張卡片（10 組中英單字），翻開成對單字即可消除，偶爾會掉落驚喜金幣雨！
          </p>
          <div className="space-y-3">
            <Button3D variant="blue" size="lg" onClick={handleStart} className="w-full">
              {t.startChallenge}
            </Button3D>
            <Button3D variant="slate" size="md" onClick={onBack} className="w-full">
              {t.backLobby}
            </Button3D>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 animate-fadeIn">
        <GlassCard className="max-w-md w-full text-center p-8">
          <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-3 animate-bounce" />
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 font-heading mb-1">
            {t.memoryComplete}
          </h2>
          <p className="text-xs font-bold text-slate-500 mb-6">
            {t.spentTime}：<span className="text-cyan-600 font-black text-lg">{elapsedTime} 秒</span> • {t.flipsCount}{moves}
          </p>

          {bonusScore > 0 && (
            <div className="p-3 mb-4 rounded-xl bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center gap-1">
              <Coins className="w-4 h-4 text-amber-500" /> {t.coinRainBonus}+{bonusScore * 5} {t.unitPoints}！
            </div>
          )}

          {/* 榮譽榜破紀錄留名判定卡與獎狀領取 */}
          <HonorSubmissionCard
            mode="memory-single"
            book={qualifyingBook}
            score={Math.max(10, 100 - moves * 2 + bonusScore * 5)}
            time={elapsedTime}
            totalCount={selectedWordsRef.current.length || 10}
            rangeText={qualifyingBook ? `第 ${qualifyingBook} 冊` : settings.selectedUnits.slice(0, 3).join(', ')}
            reviewWords={selectedWordsRef.current.map(w => ({
              id: w.id,
              en: w.en,
              zh: w.zh,
              isMistake: false
            }))}
          />

          <Button3D variant="slate" size="lg" onClick={onBack} className="w-full">
            {t.backLobby}
          </Button3D>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2 flex flex-col items-center relative">
      {showCoinRain && (
        <CoinRain
          onComplete={(coinsCaught) => {
            setBonusScore(b => b + coinsCaught);
            setShowCoinRain(false);
          }}
        />
      )}

      {/* 頂部資訊列 */}
      <div className="w-full flex items-center justify-between mb-3">
        <Button3D variant="slate" size="sm" onClick={onBack} icon={ArrowLeft}>
          {t.backLobby}
        </Button3D>

        <div className="flex items-center gap-3">
          <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
            {t.flipsCount}{moves}
          </span>
          <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-emerald-500 text-white shadow-sm">
            {t.pairsMatched}{matched.length / 2} / 10
          </span>
        </div>
      </div>

      {/* 4x5 翻牌網格 (高度約束確保 iPad 零滾動) */}
      <div className="w-full grid grid-cols-4 sm:grid-cols-5 gap-2.5 sm:gap-3 max-h-[60vh]">
        {cards.map((card, idx) => {
          const isCardFlipped = flipped.includes(idx) || matched.includes(card.id);
          const isCardMatched = matched.includes(card.id);

          return (
            <button
              key={card.id}
              disabled={isCardMatched}
              onClick={() => handleCardClick(idx)}
              className={`
                aspect-[4/3] rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 font-heading font-black text-sm sm:text-base flex items-center justify-center text-center transition-all cursor-pointer shadow-md max-h-[96px]
                ${isCardMatched
                  ? 'bg-emerald-500 text-white opacity-40 border-2 border-emerald-600 scale-95 pointer-events-none'
                  : isCardFlipped
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-cyan-400 border-2 border-blue-400 dark:border-cyan-500 scale-105'
                  : 'btn-3d bg-gradient-to-br from-indigo-500 to-blue-600 text-white border-b-4 border-indigo-800 active:border-b-0 hover:scale-105'}
              `}
            >
              {isCardFlipped ? (
                <span className="line-clamp-2 leading-tight">{card.text}</span>
              ) : (
                <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 opacity-70" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
