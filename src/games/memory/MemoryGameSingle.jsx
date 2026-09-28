import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { useI18n } from '../../context/I18nContext';
import { soundEngine, speakEnglish } from '../../services/audio';
import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';
import { CARD_THEMES } from './memoryThemes';
import { POWER_UP_DEFS, AnnouncementBanner } from './PowerUpEffects';
import { PowerUpCodexModal } from './PowerUpCodexModal';
import { enterFullscreen, exitFullscreen } from '../../services/fullscreen';
import confetti from 'canvas-confetti';
import {
  ArrowLeft, Trophy, Sparkles, HelpCircle, Coins, Bomb,
  BookOpen, Eye, Zap, Gem, Satellite, Palette, CheckCircle2, AlertCircle
} from 'lucide-react';

// ── 金幣雨 10 秒挑戰小遊戲 ──
const CoinRainModal = ({ onComplete }) => {
  const [items, setItems] = useState([]);
  const [coinScore, setCoinScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
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
          type: Math.random() < 0.22 ? 'bomb' : 'coin',
          x: Math.floor(Math.random() * 82) + 8,
          duration: Math.random() * 1.5 + 2.0
        }
      ]);
    }, 400);

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
    <div className="absolute inset-0 z-50 bg-slate-950/95 rounded-3xl flex flex-col items-center justify-between p-6 overflow-hidden animate-fadeIn">
      <div className="flex items-center justify-between w-full z-20">
        <span className="px-4 py-2 rounded-xl bg-amber-400 text-amber-950 font-black text-sm flex items-center gap-1.5 shadow-lg">
          <Coins className="w-4 h-4" /> 金幣狂收: {coinScore}
        </span>
        <span className="px-4 py-2 rounded-xl bg-blue-500 text-white font-black text-sm shadow-lg">
          ⏱ 倒數計時: {timeLeft}s
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
              <Coins className="w-11 h-11 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)] animate-spin-slow" />
            ) : (
              <Bomb className="w-11 h-11 text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.9)] animate-pulse" />
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

  // 卡牌色系樣式
  const [cardThemeId, setCardThemeId] = useState(() => {
    return localStorage.getItem('wutai_memory_card_theme') || 'noble_gold';
  });
  const currentCardTheme = CARD_THEMES[cardThemeId] || CARD_THEMES.noble_gold;

  // 圖鑑彈窗
  const [showCodex, setShowCodex] = useState(false);

  // 牌組與翻牌狀態
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // 當前翻開字卡的 index
  const [matched, setMatched] = useState([]); // 已配對卡牌 id
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);

  // 回合與 Bonus 回合規範狀態
  const [turnWordsFlipped, setTurnWordsFlipped] = useState(0); // 當前回合已翻字卡數 (0~2)
  const [isBonusTurn, setIsBonusTurn] = useState(false); // 是否處於 Bonus 回合中
  const [bonusNotification, setBonusNotification] = useState('');

  // 特殊功能卡狀態
  const [showCoinRain, setShowCoinRain] = useState(false);
  const [radarActive, setRadarActive] = useState(false); // 雷達卡 5 秒
  const [peekIndices, setPeekIndices] = useState([]); // 偷看卡 5 秒
  const [announcement, setAnnouncement] = useState(null); // 滑入公告

  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const selectedWordsRef = useRef([]);

  // 卸載時還原全螢幕
  useEffect(() => {
    return () => {
      exitFullscreen();
    };
  }, []);

  const handleBackToLobby = () => {
    exitFullscreen();
    onBack();
  };

  // 切換卡牌主題
  const handleToggleCardTheme = (newThemeId) => {
    setCardThemeId(newThemeId);
    localStorage.setItem('wutai_memory_card_theme', newThemeId);
    soundEngine.click();
  };

  // 初始化牌組 (8組中英單字 16張 + 4張功能卡牌 = 20張)
  const handleStart = () => {
    let pool = words.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
    if (pool.length < 8) pool = words;
    const selected = [...pool].sort(() => 0.5 - Math.random()).slice(0, 8);
    selectedWordsRef.current = selected;

    const cardList = [];
    // 16 張字卡
    selected.forEach((w, idx) => {
      const matchKey = `pair_${idx}`;
      cardList.push({
        id: `en-${matchKey}`,
        matchId: matchKey,
        text: w.en,
        type: 'en',
        speak: w.en,
        isPowerUp: false
      });
      cardList.push({
        id: `zh-${matchKey}`,
        matchId: matchKey,
        text: w.zh,
        type: 'zh',
        speak: w.en,
        isPowerUp: false
      });
    });

    // 4 張精選功能卡 (偷看卡、加分卡、金幣雨、雷達卡、閃電卡)
    const availablePowerUps = ['peek', 'bonus', 'coin', 'radar', 'lightning'];
    const chosenPowerUps = [...availablePowerUps].sort(() => 0.5 - Math.random()).slice(0, 4);

    chosenPowerUps.forEach((pId, pIdx) => {
      const pDef = POWER_UP_DEFS[pId];
      cardList.push({
        id: `powerup-${pId}-${pIdx}`,
        powerId: pId,
        text: pDef.name,
        type: 'powerup',
        isPowerUp: true,
        powerDef: pDef
      });
    });

    setCards(cardList.sort(() => 0.5 - Math.random()));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setScore(0);
    setTurnWordsFlipped(0);
    setIsBonusTurn(false);
    setBonusNotification('');
    setRadarActive(false);
    setPeekIndices([]);
    setAnnouncement(null);

    setHasStarted(true);
    setIsFinished(false);
    setStartTime(Date.now());

    // 進關時自動最大化/全螢幕以適配 iPad 零捲動
    enterFullscreen();
  };

  // 點擊卡牌處理
  const handleCardClick = (index) => {
    const card = cards[index];
    if (!card) return;

    // 防止在已翻開 2 張卡比對中、已配對、或正在翻開狀態時點擊 (徹底防護連擊例外)
    if (
      flipped.length >= 2 ||
      flipped.includes(index) ||
      matched.includes(card.id) ||
      peekIndices.includes(index)
    ) {
      return;
    }

    soundEngine.click();

    // ─── 情況 A：翻到「功能卡牌」 (不計入普通字卡 2 張額度，立即生效) ───
    if (card.isPowerUp) {
      triggerPowerUp(card, index);
      return;
    }

    // ─── 情況 B：翻到「普通中英字卡」 ───
    if (card.type === 'en') {
      speakEnglish(card.speak);
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    setTurnWordsFlipped(prev => prev + 1);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [idx1, idx2] = newFlipped;
      const c1 = cards[idx1];
      const c2 = cards[idx2];

      const isMatch = c1.matchId === c2.matchId && c1.type !== c2.type;

      if (isMatch) {
        // 配對成功！
        soundEngine.correct();
        setScore(s => s + 10);
        setMatched(m => [...m, c1.id, c2.id]);
        setFlipped([]);

        // 檢查是否達成全數單字配對
        const newlyMatchedCount = matched.length + 2;
        const totalWordCards = cards.filter(c => !c.isPowerUp).length;

        if (newlyMatchedCount >= totalWordCards) {
          // 全數字卡完成挑戰！退出全螢幕回復正常視窗
          exitFullscreen();
          const finalSec = Math.floor((Date.now() - startTime) / 1000);
          setElapsedTime(finalSec);
          setTimeout(() => {
            setIsFinished(true);
            soundEngine.win();
            confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
          }, 600);
          return;
        }

        // 回合與 Bonus 回合規範判定：
        // 若在常規回合前 2 張即成功配對，獎勵開啟 1 次 Bonus 回合 (可再翻 2 張)！
        if (!isBonusTurn) {
          setIsBonusTurn(true);
          setTurnWordsFlipped(0);
          setBonusNotification('🔥 配對成功！開啟額外 1 次 Bonus 回合 (可再翻 2 張)！');
          setTimeout(() => setBonusNotification(''), 3000);
        } else {
          // 若已在 Bonus 回合中完成配對，宣告 Bonus 已滿，結束 Bonus
          setIsBonusTurn(false);
          setTurnWordsFlipped(0);
          setBonusNotification('⭐ Bonus 回合達成配對！回合圓滿交棒。');
          setTimeout(() => setBonusNotification(''), 2500);
        }
      } else {
        // 配對失敗
        soundEngine.wrong();
        setTimeout(() => {
          setFlipped([]);
          if (isBonusTurn) {
            setIsBonusTurn(false);
            setBonusNotification('');
          }
          setTurnWordsFlipped(0);
        }, 900);
      }
    }
  };

  // 觸發功能卡牌效果
  const triggerPowerUp = (card, cardIndex) => {
    soundEngine.powerup?.() || soundEngine.correct();
    // 標記該功能牌已翻開並消除
    setMatched(m => [...m, card.id]);

    // 1. 滑入橫幅宣告 (2 秒後滑出)
    setAnnouncement({
      cardId: card.powerId,
      cardName: card.powerDef.name,
      playerName: '探險勇士'
    });

    const pid = card.powerId;

    if (pid === 'bonus') {
      // 💎 加分卡：立即 +30 分
      setScore(s => s + 30);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    } else if (pid === 'radar') {
      // 📡 雷達卡：全場透視 5 秒 (僅發動者可見)
      setRadarActive(true);
      setTimeout(() => setRadarActive(false), 5000);
    } else if (pid === 'peek') {
      // 👁️ 偷看卡：隨機挑選 2 張未配對字卡透視 5 秒
      const unmatchedIndices = cards
        .map((c, i) => i)
        .filter(i => !cards[i].isPowerUp && !matched.includes(cards[i].id) && i !== cardIndex);

      const picks = unmatchedIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
      setPeekIndices(picks);
      setTimeout(() => setPeekIndices([]), 5000);
    } else if (pid === 'coin') {
      // 🪙 金幣雨：進入 10 秒狂抓金幣小遊戲
      setTimeout(() => setShowCoinRain(true), 600);
    } else if (pid === 'lightning') {
      // ⚡ 閃電卡：自動完成一組單字配對
      const unmatchedWords = cards.filter(c => !c.isPowerUp && !matched.includes(c.id));
      if (unmatchedWords.length > 0) {
        const targetPairId = unmatchedWords[0].matchId;
        const pairCards = cards.filter(c => c.matchId === targetPairId);
        const pairCardIds = pairCards.map(c => c.id);

        setMatched(m => [...m, ...pairCardIds]);
        setScore(s => s + 10);
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });

        // 閃電卡特殊規則：
        // 若在常規前 2 張翻到閃電卡：自動開啟 Bonus 回合！
        // 若在 Bonus 回合 (第 3、4 張) 翻到：自動配對加分，但結束 Bonus 回合！
        if (!isBonusTurn) {
          setIsBonusTurn(true);
          setTurnWordsFlipped(0);
          setBonusNotification('⚡ 閃電保送配對！開啟額外 1 次 Bonus 回合！');
          setTimeout(() => setBonusNotification(''), 3000);
        } else {
          setIsBonusTurn(false);
          setTurnWordsFlipped(0);
          setBonusNotification('⚡ 閃電保送配對！Bonus 回合已達上限並結束。');
          setTimeout(() => setBonusNotification(''), 2500);
        }
      }
    }
  };

  // ─── 遊戲前大廳 ───
  if (!hasStarted) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        {/* 八大卡牌精靈圖鑑彈窗 */}
        <PowerUpCodexModal isOpen={showCodex} onClose={() => setShowCodex(false)} />

        <GlassCard className="max-w-lg w-full text-center p-8 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div className="w-20 h-20 rounded-3xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-4 animate-float-slow shadow-lg border border-cyan-500/30">
            <Sparkles className="w-10 h-10" />
          </div>

          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2 font-heading tracking-tight">
            {t.memoryTitle}
          </h2>

          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
            共 20 張卡片（8 組中英單字 + 4 張隨機正增強神卡），翻開成對單字即可消除，連續配對可獲得 Bonus 額外回合！
          </p>

          {/* 四大卡牌色系風格切換器 */}
          <div className="mb-6 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-xs font-black text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-amber-400" /> 選擇卡牌外觀風格
              </span>
              <span className="text-xs font-extrabold text-amber-500">
                {currentCardTheme.name}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {Object.values(CARD_THEMES).map(themeItem => (
                <button
                  key={themeItem.id}
                  onClick={() => handleToggleCardTheme(themeItem.id)}
                  className={`py-2 px-1.5 rounded-xl font-black text-xs flex items-center justify-center gap-1 transition-all ${
                    cardThemeId === themeItem.id
                      ? 'bg-amber-400 text-stone-950 shadow-md scale-100 font-extrabold ring-2 ring-amber-300'
                      : 'bg-white dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <span>{themeItem.icon}</span>
                  <span className="truncate">{themeItem.name.slice(0, 4)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 進入八大卡牌精靈圖鑑按鈕 */}
          <button
            onClick={() => {
              soundEngine.click();
              setShowCodex(true);
            }}
            className="w-full mb-4 py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-900/60 to-purple-900/60 hover:from-indigo-800/80 hover:to-purple-800/80 border-2 border-indigo-400/50 text-indigo-200 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02]"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>開啟「八大功能卡牌精靈圖鑑」(含實戰動畫模擬)</span>
          </button>

          <div className="space-y-3">
            <Button3D variant="blue" size="lg" onClick={handleStart} className="w-full text-base">
              開始翻牌冒險
            </Button3D>
            <Button3D variant="slate" size="md" onClick={onBack} className="w-full">
              {t.backLobby}
            </Button3D>
          </div>
        </GlassCard>
      </div>
    );
  }

  // ─── 結算畫面 ───
  if (isFinished) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 animate-fadeIn">
        <GlassCard className="max-w-md w-full text-center p-8 shadow-2xl">
          <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-3 animate-bounce" />
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 font-heading mb-1">
            {t.memoryComplete}
          </h2>
          <p className="text-xs font-bold text-slate-500 mb-6">
            {t.spentTime}：<span className="text-cyan-600 font-black text-lg">{elapsedTime} 秒</span> • 翻牌步數：{moves}
          </p>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 mb-6 flex flex-col items-center">
            <span className="text-4xl font-black text-amber-500">
              {score} 分
            </span>
            <span className="text-xs font-bold text-slate-400 mt-1">
              星際記憶翻牌總積分
            </span>
          </div>

          <HonorSubmissionCard
            mode="memory-single"
            book={qualifyingBook}
            score={score}
            time={elapsedTime}
            totalCount={selectedWordsRef.current.length || 8}
            rangeText={qualifyingBook ? `第 ${qualifyingBook} 冊` : settings.selectedUnits.slice(0, 3).join(', ')}
            reviewWords={selectedWordsRef.current.map(w => ({
              id: w.id,
              en: w.en,
              zh: w.zh,
              isMistake: false
            }))}
          />

          <Button3D variant="slate" size="lg" onClick={handleBackToLobby} className="w-full mt-4">
            {t.backLobby}
          </Button3D>
        </GlassCard>
      </div>
    );
  }

  // ─── 遊戲進行中 (iPad 零捲動滿版全螢幕適配) ───
  return (
    <div className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-between p-2 sm:p-4 max-h-[100dvh] h-[100dvh] overflow-hidden select-none animate-fadeIn">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center h-full justify-between">
        {/* 八大卡牌精靈圖鑑彈窗 */}
        <PowerUpCodexModal isOpen={showCodex} onClose={() => setShowCodex(false)} />

        {/* 翻到卡牌時上方滑入宣告橫幅 (2 秒後滑出) */}
        <AnnouncementBanner
          announcement={announcement}
          onComplete={() => setAnnouncement(null)}
        />

        {/* 金幣雨小遊戲全螢幕 */}
        {showCoinRain && (
          <CoinRainModal
            onComplete={(coinsCaught) => {
              setScore(s => s + coinsCaught * 2);
              setShowCoinRain(false);
            }}
          />
        )}

        {/* 頂部資訊列 (HUD) */}
        <div className="w-full flex items-center justify-between mb-2 sm:mb-3 gap-2 flex-shrink-0">
          <Button3D variant="slate" size="sm" onClick={handleBackToLobby} icon={ArrowLeft}>
            {t.backLobby}
          </Button3D>

        {/* Bonus 回合與翻牌次數提示 */}
        <div className="flex items-center gap-2">
          {isBonusTurn ? (
            <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black text-xs animate-pulse shadow-md flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> BONUS 回合！(翻牌 {turnWordsFlipped}/2)
            </span>
          ) : (
            <span className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-black text-xs">
              本回合翻牌: {turnWordsFlipped}/2
            </span>
          )}

          {radarActive && (
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500 text-white font-black text-xs animate-pulse flex items-center gap-1">
              <Satellite className="w-3.5 h-3.5" /> 雷達透視中
            </span>
          )}
        </div>

        {/* 總分與圖鑑按鈕 */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-md">
            得分: {score}
          </span>
          <button
            onClick={() => {
              soundEngine.click();
              setShowCodex(true);
            }}
            title="查看卡牌圖鑑"
            className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Bonus 回合宣告橫幅提示 */}
      {bonusNotification && (
        <div className="w-full mb-2 p-2 rounded-xl bg-amber-500/20 border border-amber-400/50 text-center font-black text-xs sm:text-sm text-amber-300 animate-slideDown">
          {bonusNotification}
        </div>
      )}

      {/* 4x5 翻牌網格 (20 張卡片) */}
      <div className="w-full grid grid-cols-4 sm:grid-cols-5 gap-2.5 sm:gap-3 max-h-[64vh]">
        {cards.map((card, idx) => {
          const isCardFlipped = flipped.includes(idx) || matched.includes(card.id);
          const isCardMatched = matched.includes(card.id);
          const isPeeked = peekIndices.includes(idx); // 偷看卡私密視野
          const showFront = isCardFlipped || isPeeked;

          // 功能牌特有外觀
          const isPowerUpCard = card.isPowerUp;

          return (
            <button
              key={card.id}
              disabled={isCardMatched}
              onClick={() => handleCardClick(idx)}
              className={`
                aspect-[4/3] rounded-2xl sm:rounded-3xl p-2 font-heading font-black text-xs sm:text-sm flex flex-col items-center justify-center text-center transition-all cursor-pointer shadow-md max-h-[96px] relative overflow-hidden
                ${isCardMatched
                  ? 'bg-slate-800 text-white opacity-30 border border-slate-700 scale-95 pointer-events-none'
                  : showFront
                  ? isPowerUpCard
                    ? `bg-gradient-to-br ${card.powerDef?.gradient || 'from-amber-500 to-yellow-600'} text-white border-2 border-white scale-105 shadow-xl`
                    : `${currentCardTheme.cardFrontClass} scale-105 border-2 shadow-xl`
                  : `btn-3d ${currentCardTheme.cardBackClass} border-b-4 hover:scale-105 active:border-b-0`}
              `}
              style={
                !showFront && !isCardMatched
                  ? { backgroundImage: currentCardTheme.cardBackPattern }
                  : undefined
              }
            >
              {showFront ? (
                /* 翻開正面 */
                <div className="flex flex-col items-center justify-center w-full h-full">
                  {isPowerUpCard ? (
                    <>
                      <card.powerDef.icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1 text-white animate-bounce" />
                      <span className="text-[11px] sm:text-xs font-black tracking-tight leading-tight">
                        {card.text}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="line-clamp-2 leading-tight px-1 font-bold">
                        {card.text}
                      </span>
                      <span className="text-[10px] opacity-60 font-semibold uppercase mt-0.5">
                        {card.type === 'en' ? 'EN' : 'ZH'}
                      </span>
                    </>
                  )}
                </div>
              ) : (
                /* 蓋牌背面 */
                <div className="flex flex-col items-center justify-center w-full h-full relative">
                  {/* 雷達卡發動時：僅發動者畫面上浮現全息微光提示！ */}
                  {radarActive && !card.isPowerUp && (
                    <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[1px] rounded-2xl flex flex-col items-center justify-center p-1 animate-pulse border border-emerald-400/60 z-10">
                      <span className="text-[10px] font-black text-emerald-200 line-clamp-1">
                        {card.text}
                      </span>
                      <span className="text-[9px] font-extrabold text-emerald-300">
                        [{card.type === 'en' ? 'EN' : 'ZH'}]
                      </span>
                    </div>
                  )}

                  <HelpCircle className="w-5 h-5 sm:w-7 sm:h-7 opacity-50" style={{ color: currentCardTheme.accentColor }} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  </div>
  );
};
