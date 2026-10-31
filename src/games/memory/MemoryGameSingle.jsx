import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { useI18n } from '../../context/I18nContext';
import { soundEngine, speakEnglish } from '../../services/audio';
import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';
import { UPPERCASE_ALPHABET, SHUFFLE } from '../../services/alphabetEngine';
import { CARD_THEMES } from './memoryThemes';
import { POWER_UP_DEFS, AnnouncementBanner } from './PowerUpEffects';
import { PowerUpCodexModal } from './PowerUpCodexModal';
import {
  RukaiCardBackFace,
  OrnateWordCardFace,
  OlympianDeityCardFace,
  OlympianAwakeningStage
} from './OlympianCardArt';
import { enterFullscreen, exitFullscreen } from '../../services/fullscreen';
import confetti from 'canvas-confetti';
import {
  ArrowLeft, Trophy, Sparkles, HelpCircle, Coins, Bomb,
  BookOpen, Eye, Zap, Gem, Satellite, Palette, CheckCircle2, AlertCircle
} from 'lucide-react';

// ── 普路托斯「黃金豐饒之角」10 秒天界金幣雨與冥界黑火炸彈小遊戲 ──
const CoinRainModal = ({ onComplete }) => {
  const [items, setItems] = useState([]);
  const [popups, setPopups] = useState([]);
  const [coinScore, setCoinScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [bombExploded, setBombExploded] = useState(false);
  const isFinishedRef = useRef(false);
  const scoreRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          if (!isFinishedRef.current) {
            isFinishedRef.current = true;
            onComplete(scoreRef.current);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const spawner = setInterval(() => {
      if (isFinishedRef.current) return;
      const roll = Math.random();
      const itemType = roll < 0.22 ? 'bomb' : roll < 0.38 ? 'gem' : 'coin';
      setItems(prev => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          type: itemType,
          x: Math.floor(Math.random() * 80) + 10,
          duration: itemType === 'gem' ? 1.85 : Math.random() * 1.2 + 1.9
        }
      ]);
    }, 340);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
    };
  }, [onComplete]);

  const handleClickItem = (item, e) => {
    if (isFinishedRef.current) return;
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    const px = rect ? e.clientX - rect.left : 200;
    const py = rect ? e.clientY - rect.top : 200;

    if (item.type === 'coin' || item.type === 'gem') {
      const gain = item.type === 'gem' ? 3 : 1;
      soundEngine.correct();
      scoreRef.current += gain;
      setCoinScore(scoreRef.current);
      setItems(prev => prev.filter(i => i.id !== item.id));
      const popId = `${Date.now()}-${Math.random()}`;
      setPopups(prev => [...prev, { id: popId, x: px, y: py, text: item.type === 'gem' ? '+3 聖石暴擊!' : '+1 金幣', isGem: item.type === 'gem' }]);
      setTimeout(() => {
        setPopups(prev => prev.filter(p => p.id !== popId));
      }, 650);
    } else {
      soundEngine.explosion();
      isFinishedRef.current = true;
      setBombExploded(true);
      setPopups(prev => [...prev, { id: 'bomb-pop', x: px, y: py, text: '💥 誤觸冥界黑火炸彈！', isBomb: true }]);
      setTimeout(() => onComplete(scoreRef.current), 750);
    }
  };

  return (
    <div className={`absolute inset-0 z-50 rounded-3xl flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden animate-fadeIn select-none ${
      bombExploded ? 'bg-rose-950/95' : 'bg-gradient-to-b from-amber-950 via-slate-950 to-indigo-950'
    }`}>
      {/* 奧林帕斯黃金神殿背景光柱與豐饒之角 */}
      <svg viewBox="0 0 800 500" className="absolute inset-0 w-full h-full pointer-events-none opacity-35" preserveAspectRatio="none">
        <defs>
          <radialGradient id="plutus_halo" cx="50%" cy="12%" r="65%">
            <stop offset="0%" stopColor="#fde047" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#d97706" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="500" fill="url(#plutus_halo)" />
        {/* 希臘神殿大石柱 */}
        <rect x="35" y="40" width="38" height="460" fill="#78350f" opacity="0.4" />
        <rect x="727" y="40" width="38" height="460" fill="#78350f" opacity="0.4" />
        {/* 頂部中央黃金豐饒之角圖騰 */}
        <path d="M350,55 C340,20 390,5 425,22 C445,32 460,12 475,5 C480,28 460,65 420,82 C380,95 358,80 350,55 Z" fill="#facc15" stroke="#fef08a" strokeWidth="3" />
      </svg>

      {/* 頂部神殿計分 HUD */}
      <div className="flex items-center justify-between w-full z-20">
        <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black text-sm sm:text-base flex items-center gap-2 shadow-[0_0_25px_rgba(251,191,36,0.6)] border-2 border-amber-200">
          <Coins className="w-5 h-5" />
          <span>普路托斯神殿接幣: {coinScore} 枚 (+{coinScore * 2} 分)</span>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-indigo-900/90 border-2 border-amber-300/70 text-amber-200 font-black text-sm sm:text-base shadow-lg">
          ⏱ 豐饒神力倒數: {timeLeft}s
        </div>
      </div>

      {/* 互動掉落區 */}
      <div className="absolute inset-0 pointer-events-auto overflow-hidden">
        {items.map(item => (
          <button
            key={item.id}
            type="button"
            onPointerDown={(e) => handleClickItem(item, e)}
            className="absolute -top-16 p-2 cursor-pointer transition-transform active:scale-75 focus:outline-none"
            style={{
              left: `${item.x}%`,
              animationDuration: `${item.duration}s`,
              animationName: 'fallDown',
              animationTimingFunction: 'linear',
              animationFillMode: 'forwards'
            }}
          >
            {item.type === 'coin' ? (
              /* 🪙 古希臘雅典娜貓頭鷹立體金幣 */
              <svg viewBox="0 0 64 64" className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_0_14px_rgba(250,204,21,0.95)]">
                <circle cx="32" cy="32" r="28" fill="#facc15" stroke="#fef08a" strokeWidth="3.5" />
                <circle cx="32" cy="32" r="22" fill="#eab308" stroke="#b45309" strokeWidth="1.5" strokeDasharray="4 2" />
                <polygon points="32,14 44,32 32,50 20,32" fill="#fef08a" stroke="#b45309" strokeWidth="1.5" />
                <circle cx="32" cy="32" r="5" fill="#b45309" />
              </svg>
            ) : item.type === 'gem' ? (
              /* 💎 阿波羅太陽翡翠聖石 (+3 暴擊) */
              <svg viewBox="0 0 64 64" className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_0_18px_rgba(52,211,153,1)] animate-pulse">
                <polygon points="32,4 56,22 46,56 18,56 8,22" fill="#10b981" stroke="#a7f3d0" strokeWidth="3" />
                <polygon points="32,12 46,24 39,48 25,48 18,24" fill="#34d399" />
                <text x="32" y="38" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="900">+3</text>
              </svg>
            ) : (
              /* 💣 冥界塔耳塔羅斯黑火炸彈 (誤觸即引爆) */
              <svg viewBox="0 0 64 64" className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_0_16px_rgba(244,63,94,0.95)] animate-bounce">
                <circle cx="32" cy="36" r="22" fill="#1e1b4b" stroke="#f43f5e" strokeWidth="3" />
                <path d="M32,14 Q38,4 48,8" fill="none" stroke="#fde047" strokeWidth="3" />
                <circle cx="48" cy="8" r="5" fill="#f43f5e" />
                <polygon points="22,30 28,33 24,38" fill="#f43f5e" />
                <polygon points="42,30 36,33 40,38" fill="#f43f5e" />
                <path d="M23,45 Q32,39 41,45" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
              </svg>
            )}
          </button>
        ))}

        {/* 點擊爆分浮動粒子文字 */}
        {popups.map(p => (
          <div
            key={p.id}
            style={{ left: p.x, top: p.y }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none font-black text-base sm:text-xl animate-bounce z-30 ${
              p.isBomb ? 'text-rose-400 scale-125' : p.isGem ? 'text-emerald-300' : 'text-amber-300'
            } drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]`}
          >
            {p.text}
          </div>
        ))}
      </div>

      {/* 底部神諭提示 */}
      <div className="relative z-20 px-4 py-1.5 rounded-full bg-black/65 border border-amber-400/50 text-xs font-bold text-amber-200">
        ✨ 狂點古希臘金幣 (+1) 與翡翠聖石 (+3)，千萬別點到紫紅冥界炸彈！
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fallDown {
            from { top: -12%; transform: rotate(0deg); }
            to { top: 112%; transform: rotate(360deg); }
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
  const isAlphabetMode = Boolean(
    qualifyingBook === 'abc' ||
    (settings?.selectedUnits && settings.selectedUnits.includes('abc')) ||
    settings?.alphaMode
  );

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
    let pool = words.filter(w => (settings?.selectedUnits || []).includes(`${w.book}-${w.lesson}`));
    if (pool.length < 8) pool = words;
    const selected = [...pool].sort(() => 0.5 - Math.random()).slice(0, 8);
    selectedWordsRef.current = selected;
    const cardList = [];
    if (isAlphabetMode) {
      // 字母模式：抽 8 組英文字母大小寫配對 (A ↔ a)
      const selectedRoots = SHUFFLE(UPPERCASE_ALPHABET).slice(0, 8);
      selectedRoots.forEach((upper) => {
        const matchKey = `pair_${upper}`;
        cardList.push({
          id: `upper-${matchKey}`,
          matchId: matchKey,
          text: upper,
          subText: '大寫',
          type: 'en',
          speak: upper,
          isPowerUp: false
        });
        cardList.push({
          id: `lower-${matchKey}`,
          matchId: matchKey,
          text: upper.toLowerCase(),
          subText: '小寫',
          type: 'zh',
          speak: upper,
          isPowerUp: false
        });
      });
    } else {
      // 16 張單字卡
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
    }

    // 4 張隨機奧林帕斯希臘神話神卡 (從完整 8 大眾神池中抽取 4 張入局)
    const availablePowerUps = ['lightning', 'peek', 'freeze', 'coin', 'lock', 'bonus', 'radar', 'winwin'];
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

  // 自動直接開局發牌（依據 Lobby 整備室設定，零二次彈窗）
  useEffect(() => {
    handleStart();
  }, []);

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
      // 💎 阿波羅加分卡：立即 +30 分
      setScore(s => s + 30);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    } else if (pid === 'freeze') {
      // ❄️ 博雷阿斯極北寒霜：賜予冰晶護盾 +20 分並開啟 Bonus 回合
      setScore(s => s + 20);
      setIsBonusTurn(true);
      setTurnWordsFlipped(0);
      setBonusNotification('❄️ 博雷阿斯降下極北冰晶祝福！獲得 +20 分並開啟 Bonus 回合！');
      setTimeout(() => setBonusNotification(''), 3000);
    } else if (pid === 'lock') {
      // 🔒 赫菲斯托斯神匠金鎖：鎖定並直接透視一組配對的 2 張字卡 5 秒 (+15 分)
      setScore(s => s + 15);
      const unmatchedWords = cards.filter(c => !c.isPowerUp && !matched.includes(c.id));
      if (unmatchedWords.length > 0) {
        const targetPairId = unmatchedWords[0].matchId;
        const pairIndices = cards
          .map((c, idx) => (c.matchId === targetPairId ? idx : -1))
          .filter(idx => idx !== -1);
        setPeekIndices(pairIndices);
        setTimeout(() => setPeekIndices([]), 5000);
      }
      setBonusNotification('🔒 赫菲斯托斯鍛造神鎖！已為您精準鎖定並透視一組配對 5 秒 (+15 分)！');
      setTimeout(() => setBonusNotification(''), 3000);
    } else if (pid === 'winwin') {
      // 🤝 雙子神星辰同盟：雙子座祝福 +25 分並開啟 Bonus 回合
      setScore(s => s + 25);
      setIsBonusTurn(true);
      setTurnWordsFlipped(0);
      setBonusNotification('🤝 雙子座守護神締結星辰契約！獲得 +25 雙贏祝福並開啟 Bonus 回合！');
      setTimeout(() => setBonusNotification(''), 3000);
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

  // ─── 結算畫面 ───
  if (isFinished) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 animate-fadeIn">
        <GlassCard className="max-w-lg w-full text-center p-4 sm:p-6 md:p-8 shadow-2xl">
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
            rangeText={qualifyingBook ? `第 ${qualifyingBook} 冊` : (settings?.selectedUnits || []).slice(0, 3).join(', ')}
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
    <div className="fixed inset-0 z-40 bg-slate-950 flex flex-col items-center justify-between p-2 sm:p-4 max-h-[100dvh] h-[100dvh] overflow-hidden select-none animate-fadeIn">
      {/* 奧林帕斯星辰神殿牌桌原畫背景 */}
      <img
        src="/assets/memory/board_bg_olympus.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none mix-blend-luminosity filter blur-[0.5px]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/70 to-slate-950/90 pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center h-full justify-between relative z-10">
        {/* 八大卡牌精靈圖鑑彈窗 */}
        <PowerUpCodexModal isOpen={showCodex} onClose={() => setShowCodex(false)} />

        {/* 翻到卡牌時上方滑入宣告橫幅 (2 秒後滑出) + 1.35 秒全場眾神降臨神力動畫 */}
        <AnnouncementBanner
          announcement={announcement}
          onComplete={() => setAnnouncement(null)}
        />
        <OlympianAwakeningStage activeAwakening={announcement} />

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

        {/* 總分、卡背主題切換(日/夜)與眾神圖鑑按鈕 */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => handleToggleCardTheme(cardThemeId === 'noble_gold' ? 'cyber_blue' : 'noble_gold')}
            title="切換卡背：魯凱百合(日) / 古老石板(夜)"
            className="px-2.5 py-1 rounded-xl bg-slate-800 border border-amber-400/50 text-amber-200 hover:bg-slate-700 font-black text-xs transition-colors flex items-center gap-1"
          >
            <span>{cardThemeId === 'noble_gold' ? '🌙 石板夜' : '☀️ 百合日'}</span>
          </button>
          <span className="px-3 py-1 rounded-xl bg-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-md">
            得分: {score}
          </span>
          <button
            onClick={() => {
              soundEngine.click();
              setShowCodex(true);
            }}
            title="查看奧林帕斯眾神圖鑑"
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
                aspect-[4/3] rounded-2xl sm:rounded-3xl p-0.5 font-heading font-black text-xs sm:text-sm flex flex-col items-center justify-center text-center transition-all cursor-pointer shadow-lg max-h-[104px] relative overflow-hidden
                ${isCardMatched
                  ? isPowerUpCard
                    ? 'ring-2 ring-amber-400/90 shadow-amber-500/30 scale-[0.98] pointer-events-none'
                    : 'ring-2 ring-emerald-400/80 opacity-85 scale-[0.97] pointer-events-none'
                  : showFront
                  ? 'scale-105 ring-2 ring-amber-300 shadow-2xl z-10'
                  : `btn-3d ${currentCardTheme.cardBackClass} border-b-4 hover:-translate-y-1 hover:scale-[1.025] hover:shadow-[0_0_18px_rgba(251,191,36,0.45)] active:border-b-0 active:translate-y-0 duration-200`}
              `}
            >
              {showFront ? (
                /* 翻開正面：希臘眾神史詩卡面 或 古典雕花金框單字卡面 (動一次即回歸靜止) */
                <div className="w-full h-full relative">
                  {isPowerUpCard ? (
                    <OlympianDeityCardFace powerId={card.powerId} />
                  ) : (
                    <OrnateWordCardFace text={card.text} type={card.type} />
                  )}
                  {isCardMatched && !isPowerUpCard && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ) : (
                /* 蓋牌背面：魯凱族百合花(日) / 霧臺古老石板(夜) 高細節 TCG 卡背 */
                <div className="flex flex-col items-center justify-center w-full h-full relative">
                  <RukaiCardBackFace motif={currentCardTheme.motif} />
                  {/* 赫利奧斯全視雷達發動時：僅發動者畫面上浮現全息微光提示 */}
                  {radarActive && !card.isPowerUp && (
                    <div className="absolute inset-0 bg-emerald-950/75 backdrop-blur-[1px] rounded-xl flex flex-col items-center justify-center p-1 animate-pulse border-2 border-emerald-400/80 z-10">
                      <span className="text-[11px] sm:text-xs font-black text-emerald-200 line-clamp-1">
                        {card.text}
                      </span>
                      <span className="text-[9px] font-extrabold text-amber-300">
                        [{card.type === 'en' ? 'EN' : 'ZH'}]
                      </span>
                    </div>
                  )}
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
