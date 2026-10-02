import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { useI18n } from '../../context/I18nContext';
import { enterFullscreen, exitFullscreen } from '../../services/fullscreen';
import { soundEngine, speakEnglish } from '../../services/audio';
import { FALLBACK_WORDS } from '../../services/supabase';
import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';
import confetti from 'canvas-confetti';
import {
  ArrowLeft, RotateCcw, Volume2, VolumeX, Sparkles, Trophy,
  CheckCircle2, Flame, ShieldAlert, Mountain, Rocket, Undo2,
  Clock, Zap, Star, Wind, Shuffle, PlusCircle, Check, X,
  HelpCircle, Eye, ChevronRight
} from 'lucide-react';

// ── 字母易混淆對照表 (低年級專屬) ──
const CONFUSABLE_PAIRS = [
  { u: 'B', l: 'd' }, { u: 'D', l: 'b' },
  { u: 'P', l: 'q' }, { u: 'Q', l: 'p' },
  { u: 'M', l: 'w' }, { u: 'W', l: 'm' },
  { u: 'N', l: 'u' }, { u: 'U', l: 'n' },
  { u: 'I', l: 'l' }, { u: 'E', l: 'a' }
];

const ALPHABET_LIST = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// ── 功能卡種類定義 ──
const SPECIAL_EFFECTS = [
  {
    type: 'double',
    title: '雙倍積分卡 (2X)',
    desc: '滑掉啟動！10 秒內所有答對得分通通雙倍！',
    badge: '雙倍加分',
    duration: 10,
    gradient: 'from-amber-500 via-orange-500 to-yellow-400',
    icon: Zap
  },
  {
    type: 'always_right',
    title: '必正卡 (Always Right)',
    desc: '滑掉啟動！接下來 5 張卡必定為正確配對！',
    badge: '一路向右',
    duration: null, // 以次數 5 次計
    count: 5,
    gradient: 'from-emerald-500 via-teal-500 to-green-400',
    icon: CheckCircle2
  },
  {
    type: 'star',
    title: '無敵星星卡 (Star Power)',
    desc: '滑掉啟動！5 秒內不管左滑或右滑皆算答對！',
    badge: '無敵星芒',
    duration: 5,
    gradient: 'from-yellow-400 via-amber-400 to-orange-400',
    icon: Star
  },
  {
    type: 'shrink',
    title: '迷你縮小卡 (Shrink 60%)',
    desc: '滑掉啟動！卡牌縮小至 60% 挑戰動態視力！',
    badge: '趣味縮小',
    duration: 5,
    gradient: 'from-purple-600 via-indigo-500 to-pink-500',
    icon: Sparkles
  },
  {
    type: 'reverse',
    title: '乾坤大挪移 (Reverse O/X)',
    desc: '滑掉啟動！5 秒內左右對錯顛倒（左邊是O、右邊是X）！',
    badge: '對錯反轉',
    duration: 5,
    gradient: 'from-rose-600 via-pink-600 to-red-500',
    icon: Shuffle
  },
  {
    type: 'time_extend',
    title: '時光延續卡 (+5s)',
    desc: '滑掉啟動！立即為你延長 5 秒鐘作答時間！',
    badge: '+5 秒',
    duration: null, // 立即觸發
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
    icon: Clock
  },
  {
    type: 'wind',
    title: '呼嘯旋風卡 (Wind Gust)',
    desc: '滑掉啟動！強風來襲，滑動距離需加長 25% 才能甩掉！',
    badge: '旋風阻力',
    duration: 5,
    gradient: 'from-sky-500 via-teal-600 to-blue-600',
    icon: Wind
  }
];

export const SwipeCardGame = ({
  words = [],
  settings = {},
  qualifyingBook,
  onBack
}) => {
  const { t } = useI18n();

  // ── 遊戲流程狀態 ──
  // 'menu' (選單), 'playing' (進行中), 'settlement' (結算)
  const [gameState, setGameState] = useState('menu');

  // 模式：'vocab' (中高年級單字釋義), 'letters' (低年級 Aa 大小寫配對)
  const [gameMode, setGameMode] = useState('vocab');

  // 計時器 (30秒極速對決)
  const TOTAL_GAME_TIME = 30;
  const [timeLeft, setTimeLeft] = useState(TOTAL_GAME_TIME);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimerFrozen, setIsTimerFrozen] = useState(false); // 方案A：名師訂正時時間凍結

  // 積分與連擊
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalSwiped, setTotalSwiped] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [floatingScore, setFloatingScore] = useState(null); // { text, x, y, id }

  // 牌堆管理
  const [cardDeck, setCardDeck] = useState([]);
  const [isCorrecting, setIsCorrecting] = useState(false); // 是否正處於答錯名師訂正狀態
  const [correctingCard, setCorrectingCard] = useState(null);

  // 當前作用中的功能卡效果
  // { type, duration, remainingTime, count }
  const [activeEffect, setActiveEffect] = useState(null);
  const [alwaysRightCount, setAlwaysRightCount] = useState(0);

  // 拖曳物理狀態
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState(null); // 'left' | 'right'
  const dragStartRef = useRef({ x: 0, y: 0 });
  const isPointerDownRef = useRef(false);
  const dismissTimerRef = useRef(null);

  // 保持即時模式參照，防止非同步 closure 滯後
  const gameModeRef = useRef(gameMode);
  useEffect(() => {
    gameModeRef.current = gameMode;
  }, [gameMode]);

  // 卸載時清理全螢幕與訂正計時器
  useEffect(() => {
    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
      exitFullscreen();
    };
  }, []);

  // 篩選並標準化有效單字庫 (相容 en/zh 與 word/meaning，離線時無縫使用備用庫)
  const activeWordList = useMemo(() => {
    const rawList = (!words || words.length === 0) ? FALLBACK_WORDS : words;
    let filtered = rawList;
    if (settings?.selectedUnits && settings.selectedUnits.length > 0) {
      const subset = rawList.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
      if (subset.length > 0) filtered = subset;
    }
    const normalized = filtered.map(w => ({
      word: (w.en || w.word || '').trim(),
      meaning: (w.zh || w.meaning || '').trim()
    })).filter(w => w.word && w.meaning);

    return normalized.length > 0
      ? normalized
      : [{ word: 'apple', meaning: '蘋果' }, { word: 'banana', meaning: '香蕉' }];
  }, [words, settings?.selectedUnits]);

  // ── 生成單張卡片輔助函式 (保證 O(1) 無無窮迴圈風險) ──
  const createSingleCard = useCallback((
    forceMatch = false,
    canGenerateSpecial = true,
    mode = gameModeRef.current,
    currentDeck = cardDeck
  ) => {
    const cardId = `c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 檢查是否可插入功能卡 (當前無作用中效果，且卡堆中無其他功能卡)
    const hasSpecialInDeck = currentDeck.some(c => c.isSpecial);
    const shouldSpawnSpecial = canGenerateSpecial && !activeEffect && !hasSpecialInDeck && Math.random() < 0.16;

    if (shouldSpawnSpecial) {
      const effectConfig = SPECIAL_EFFECTS[Math.floor(Math.random() * SPECIAL_EFFECTS.length)];
      return {
        id: cardId,
        isSpecial: true,
        effect: effectConfig.type,
        title: effectConfig.title,
        desc: effectConfig.desc,
        badge: effectConfig.badge,
        gradient: effectConfig.gradient,
        duration: effectConfig.duration,
        count: effectConfig.count
      };
    }

    // ── 模式 1：低年級大小寫字母配對 ──
    if (mode === 'letters') {
      const isMatch = forceMatch || Math.random() < 0.5;
      const upperChar = ALPHABET_LIST[Math.floor(Math.random() * ALPHABET_LIST.length)];
      let lowerChar = upperChar.toLowerCase();

      if (!isMatch) {
        // 50% 機率使用易混淆字母陷阱
        const confusable = CONFUSABLE_PAIRS.find(p => p.u === upperChar);
        if (confusable && Math.random() < 0.6) {
          lowerChar = confusable.l;
        } else {
          // 隨機抽換為相異字母 (以 filter 篩選，杜絕 while 迴圈卡死)
          const otherLetters = ALPHABET_LIST.filter(c => c !== upperChar);
          lowerChar = otherLetters[Math.floor(Math.random() * otherLetters.length)].toLowerCase();
        }
      }

      return {
        id: cardId,
        isSpecial: false,
        word: upperChar,
        displayMeaning: lowerChar,
        correctMeaning: upperChar.toLowerCase(),
        isMatch: upperChar.toLowerCase() === lowerChar
      };
    }

    // ── 模式 2：中高年級單字詞義是非題 ──
    const pool = activeWordList.length > 0
      ? activeWordList
      : [{ word: 'apple', meaning: '蘋果' }, { word: 'banana', meaning: '香蕉' }];
    const targetWord = pool[Math.floor(Math.random() * pool.length)];
    const isMatch = forceMatch || Math.random() < 0.5;

    let displayMeaning = targetWord.meaning;
    if (!isMatch && pool.length > 1) {
      const otherWords = pool.filter(w => w.word.toLowerCase() !== targetWord.word.toLowerCase());
      if (otherWords.length > 0) {
        const distractor = otherWords[Math.floor(Math.random() * otherWords.length)];
        displayMeaning = distractor.meaning;
      } else {
        displayMeaning = targetWord.meaning === '蘋果' ? '香蕉' : '蘋果';
      }
    }

    return {
      id: cardId,
      isSpecial: false,
      word: targetWord.word,
      displayMeaning,
      correctMeaning: targetWord.meaning,
      isMatch: targetWord.meaning === displayMeaning
    };
  }, [activeWordList, activeEffect, cardDeck]);

  // ── 初始化或補充卡堆 (隨時維持 4 張卡牌) ──
  const replenishDeck = useCallback((currentDeck, count = 4, mode = gameModeRef.current) => {
    const newDeck = [...currentDeck];
    while (newDeck.length < count) {
      const forceMatch = Boolean(activeEffect?.type === 'always_right' || alwaysRightCount > 0);
      newDeck.push(createSingleCard(forceMatch, newDeck.length > 0, mode, newDeck));
    }
    return newDeck;
  }, [createSingleCard, activeEffect, alwaysRightCount]);

  // ── 開始遊戲 ──
  const handleStartGame = (selectedMode = gameMode) => {
    enterFullscreen();
    soundEngine.click();

    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }

    setGameMode(selectedMode);
    gameModeRef.current = selectedMode;

    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTotalSwiped(0);
    setCorrectCount(0);
    setTimeLeft(TOTAL_GAME_TIME);
    setIsTimerRunning(true);
    setIsTimerFrozen(false);
    setActiveEffect(null);
    setAlwaysRightCount(0);
    setIsCorrecting(false);
    setCorrectingCard(null);
    setDragOffset({ x: 0, y: 0 });
    setExitDirection(null);

    // 生成前 4 張手牌 (傳入 selectedMode，確保初次建立即正確套用目標模式)
    const initialDeck = [];
    for (let i = 0; i < 4; i++) {
      initialDeck.push(createSingleCard(false, i > 0, selectedMode, initialDeck));
    }
    setCardDeck(initialDeck);
    setGameState('playing');
  };

  // ── 倒數計時器監聽 ──
  useEffect(() => {
    if (!isTimerRunning || isTimerFrozen || gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerRunning(false);
          soundEngine.win();
          setGameState('settlement');
          try {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          } catch (e) {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, isTimerFrozen, gameState]);

  // ── 功能卡倒數效果監聽 ──
  useEffect(() => {
    if (!activeEffect || !activeEffect.duration || isTimerFrozen) return;

    const effectTimer = setInterval(() => {
      setActiveEffect(prev => {
        if (!prev) return null;
        if (prev.remainingTime <= 1) {
          clearInterval(effectTimer);
          return null;
        }
        return { ...prev, remainingTime: prev.remainingTime - 1 };
      });
    }, 1000);

    return () => clearInterval(effectTimer);
  }, [activeEffect, isTimerFrozen]);

  // ── 核心滑動判斷與結算 ──
  const executeSwipe = useCallback((direction) => {
    if (isCorrecting || cardDeck.length === 0 || gameState !== 'playing') return;

    const topCard = cardDeck[0];
    if (!topCard) return;

    setTotalSwiped(s => s + 1);

    // ── 情況 1：滑掉的是功能卡 (左右皆可啟動) ──
    if (topCard.isSpecial) {
      soundEngine.laser();
      setExitDirection(direction);

      // 啟動功能卡
      if (topCard.effect === 'time_extend') {
        // 時光延續：立即 +5 秒
        setTimeLeft(t => t + 5);
        setFloatingScore({ text: '+5s ⏱️', type: 'time', id: Date.now() });
      } else if (topCard.effect === 'always_right') {
        setActiveEffect({ type: 'always_right', title: topCard.title });
        setAlwaysRightCount(5);
        setFloatingScore({ text: '必正 5 連發！🎯', type: 'bonus', id: Date.now() });
      } else {
        setActiveEffect({
          type: topCard.effect,
          title: topCard.title,
          duration: topCard.duration,
          remainingTime: topCard.duration
        });
        setFloatingScore({ text: `${topCard.badge} 啟動！`, type: 'bonus', id: Date.now() });
      }

      setTimeout(() => {
        setExitDirection(null);
        setDragOffset({ x: 0, y: 0 });
        setCardDeck(prev => replenishDeck(prev.slice(1)));
      }, 180);
      return;
    }

    // ── 情況 2：普通卡牌判定 ──
    // 判斷玩家輸入意向
    // 預設：右滑 = 是 (TRUE), 左滑 = 非 (FALSE)
    // 乾坤大挪移狀態：左滑 = 是 (TRUE), 右滑 = 非 (FALSE)
    const isReversed = activeEffect?.type === 'reverse';
    let playerAnswerIsMatch = false;

    if (isReversed) {
      playerAnswerIsMatch = direction === 'left';
    } else {
      playerAnswerIsMatch = direction === 'right';
    }

    // 無敵星星卡狀態：任何方向皆判定為答對
    const isStarActive = activeEffect?.type === 'star';
    const isCorrect = isStarActive || (playerAnswerIsMatch === topCard.isMatch);

    if (isCorrect) {
      // ── 答對！加分與連擊推進 ──
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak(m => Math.max(m, nextStreak));
      setCorrectCount(c => c + 1);

      // 必正卡次數扣減
      if (activeEffect?.type === 'always_right' || alwaysRightCount > 0) {
        setAlwaysRightCount(cnt => {
          const nextCnt = cnt - 1;
          if (nextCnt <= 0 && activeEffect?.type === 'always_right') {
            setActiveEffect(null);
          }
          return Math.max(0, nextCnt);
        });
      }

      // 計分：基本分 10 + 連擊獎勵 (最高+10)
      const isDoubleActive = activeEffect?.type === 'double';
      const streakBonus = Math.min(nextStreak, 10);
      const earned = (10 + streakBonus) * (isDoubleActive ? 2 : 1);

      setScore(s => s + earned);
      soundEngine.combo(nextStreak);
      speakEnglish(topCard.word);

      // 浮動得分提示
      setFloatingScore({
        text: `+${earned}${isDoubleActive ? ' (2X!)' : ''}`,
        type: 'score',
        id: Date.now()
      });

      // 飛出動畫後補牌
      setExitDirection(direction);
      setTimeout(() => {
        setExitDirection(null);
        setDragOffset({ x: 0, y: 0 });
        setCardDeck(prev => replenishDeck(prev.slice(1), 4, gameModeRef.current));
      }, 180);

    } else {
      // ── 答錯！觸發方案A：時間凍結與名師訂正 ──
      setStreak(0);
      soundEngine.wrong();
      setIsTimerFrozen(true); // 暫停 30 秒倒數計時器
      setIsCorrecting(true);
      setCorrectingCard(topCard);
      setDragOffset({ x: 0, y: 0 });
      speakEnglish(topCard.word);

      // 自動停留 2.3 秒後淡出並回收回牌堆 (玩家亦可點擊卡牌立即跳過)
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
      dismissTimerRef.current = setTimeout(() => {
        handleDismissCorrection();
      }, 2300);
    }
  }, [
    isCorrecting, cardDeck, gameState, activeEffect, alwaysRightCount,
    streak, replenishDeck
  ]);

  // 關閉訂正並恢復遊戲
  const handleDismissCorrection = useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    setIsCorrecting(false);
    setIsTimerFrozen(false); // 恢復 30 秒倒數計時器

    // 將該錯題重新推入牌堆隊尾 (錯題循環回收練習)
    setCardDeck(prev => {
      const remaining = prev.slice(1);
      const recycledCard = correctingCard ? [{
        ...correctingCard,
        id: `re_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
      }] : [];
      return replenishDeck([...remaining, ...recycledCard], 4, gameModeRef.current);
    });
    setCorrectingCard(null);
  }, [correctingCard, replenishDeck]);

  // ── 觸控與滑鼠拖曳處理 ──
  const handlePointerDown = (e) => {
    if (isCorrecting || gameState !== 'playing') return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}
    isPointerDownRef.current = true;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isPointerDownRef.current || isCorrecting || gameState !== 'playing') return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    // 垂直拖曳阻尼減半，維持水平主軸
    setDragOffset({ x: dx, y: dy * 0.4 });
  };

  const handlePointerUp = (e) => {
    if (!isPointerDownRef.current) return;
    try {
      if (e?.currentTarget?.hasPointerCapture?.(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch (err) {}
    isPointerDownRef.current = false;
    setIsDragging(false);

    // 計算判定門檻 (旋風卡狀態門檻加長 25%)
    const baseThreshold = 85;
    const threshold = activeEffect?.type === 'wind' ? baseThreshold * 1.25 : baseThreshold;

    if (dragOffset.x > threshold) {
      executeSwipe('right');
    } else if (dragOffset.x < -threshold) {
      executeSwipe('left');
    } else {
      // 未達門檻，Q 彈回彈原位
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // ── 鍵盤快速鍵支援 (左右方向鍵) ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;

      if (isCorrecting) {
        if (e.key === ' ' || e.key === 'Enter') {
          handleDismissCorrection();
        }
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        executeSwipe('right');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        executeSwipe('left');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isCorrecting, executeSwipe, handleDismissCorrection]);

  // 退出至大廳
  const handleBackToLobby = () => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    exitFullscreen();
    onBack();
  };

  // 退出至選單
  const handleBackToMenu = () => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    setGameState('menu');
    setIsTimerRunning(false);
    setIsTimerFrozen(false);
  };

  // ─── 畫面 1：遊戲選單與模式選擇 ───
  if (gameState === 'menu') {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-6 animate-fadeIn pb-16">
        {/* 頂部導覽列 */}
        <div className="flex items-center justify-between">
          <Button3D variant="slate" size="sm" onClick={handleBackToLobby} icon={ArrowLeft}>
            {t.backToVocabLobby || '回單字學習館'}
          </Button3D>

          <span className="px-3 py-1 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-mono font-black text-xs">
            ⏱️ 30 秒極速對決
          </span>
        </div>

        {/* 歡迎主橫幅 */}
        <GlassCard className="text-center p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r from-rose-500/15 via-orange-500/10 to-amber-500/15 border-2 border-rose-400 dark:border-rose-600/60 shadow-lg">
          <div className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-tr from-rose-500 to-amber-400 text-white shadow-xl shadow-rose-500/30">
            <Flame className="w-10 h-10 animate-pulse text-white" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black font-heading text-slate-800 dark:text-white mb-2">
            🃏 極速是非滑牌 • 撲克大對決
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            30 秒手速與腦力極限！手握撲克手牌，配對正確右滑、錯誤左滑。享受神級連擊 Bonus、7 大功能彩蛋卡牌與時間凍結名師訂正！
          </p>

          {/* 模式切換器 */}
          <div className="mt-5 inline-flex items-center gap-2 p-1.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 shadow-sm">
            <button
              onClick={() => { setGameMode('vocab'); soundEngine.click(); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                gameMode === 'vocab'
                  ? 'bg-rose-500 text-white shadow-md font-extrabold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              📖 單字詞義是非 (中高年級)
            </button>
            <button
              onClick={() => { setGameMode('letters'); soundEngine.click(); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                gameMode === 'letters'
                  ? 'bg-rose-500 text-white shadow-md font-extrabold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              🔡 Aa 字母大小寫 (低年級首選)
            </button>
          </div>
        </GlassCard>

        {/* 雙模式詳細卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. 中高年級單字模式 */}
          <GlassCard className="p-6 flex flex-col justify-between border-2 border-rose-300/80 dark:border-rose-700/60 relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-sm flex items-center gap-1">
                  <Flame className="w-3 h-3 animate-pulse" />
                  <span>Top 50 英雄榜</span>
                </span>
                <span className="text-xs font-mono font-black text-rose-600 dark:text-rose-400">
                  30 秒限時
                </span>
              </div>

              <h3 className="text-xl font-black font-heading text-slate-800 dark:text-slate-100">
                單字詞義速辨
              </h3>

              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                牌面顯示英文單字與中文釋義，快速辨識是否相符。隨選教材範圍（共 {activeWordList.length} 字），答對連續連擊倍數加乘！
              </p>

              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>右滑 ✔ 是 / 左滑 ✖ 非</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>隨機掉落 7 種驚喜功能卡（雙倍、無敵星、時鐘）</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Undo2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>答錯時間凍結，浮現名師正確解釋</span>
                </div>
              </div>
            </div>

            <Button3D
              variant="rose"
              size="md"
              onClick={() => handleStartGame('vocab')}
              className="w-full mt-4"
            >
              進入單字滑牌挑戰
            </Button3D>
          </GlassCard>

          {/* 2. 低年級字母配對模式 */}
          <GlassCard className="p-6 flex flex-col justify-between border-2 border-amber-300/80 dark:border-amber-700/60 relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500 text-stone-950 shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>低年級入門首選</span>
                </span>
                <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-400">
                  免選題庫即玩
                </span>
              </div>

              <h3 className="text-xl font-black font-heading text-slate-800 dark:text-slate-100">
                Aa 字母大小寫配對
              </h3>

              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                專為低年級打造！免選範圍，大字體隨機出現大寫與小寫字母（含 b/d, p/q 易混淆辨析），鍛鍊極速英文字母反射神經！
              </p>

              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>直觀對照（例如 A-a 往右滑、B-d 往左滑）</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>30 秒極限衝刺，角逐全校英雄榜</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>全功能彩蛋卡支援，歡樂滿滿</span>
                </div>
              </div>
            </div>

            <Button3D
              variant="amber"
              size="md"
              onClick={() => handleStartGame('letters')}
              className="w-full mt-4"
            >
              進入 Aa 字母配對
            </Button3D>
          </GlassCard>
        </div>
      </div>
    );
  }

  // ─── 畫面 2：遊戲進行中 (2D 撲克手牌展開堆疊) ───
  if (gameState === 'playing') {
    const isShrunk = activeEffect?.type === 'shrink';
    const isReversed = activeEffect?.type === 'reverse';
    const isStar = activeEffect?.type === 'star';
    const isDouble = activeEffect?.type === 'double';
    const isWind = activeEffect?.type === 'wind';
    const isAlwaysRight = activeEffect?.type === 'always_right' || alwaysRightCount > 0;

    const topCard = cardDeck[0];

    // 計算旋轉角度與透明度
    const dragAngle = dragOffset.x * 0.08;
    const isSwipingRight = dragOffset.x > 30;
    const isSwipingLeft = dragOffset.x < -30;

    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-between p-3 sm:p-5 select-none touch-none overscroll-none overflow-hidden bg-slate-950 text-white"
        style={{
          backgroundImage: isDouble
            ? 'radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.2) 0%, rgba(15, 23, 42, 0.98) 100%)'
            : isStar
            ? 'radial-gradient(circle at 50% 30%, rgba(250, 204, 21, 0.2) 0%, rgba(15, 23, 42, 0.98) 100%)'
            : isWind
            ? 'radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.15) 0%, rgba(15, 23, 42, 0.98) 100%)'
            : 'radial-gradient(circle at 50% 30%, rgba(244, 63, 94, 0.12) 0%, rgba(15, 23, 42, 0.98) 100%)'
        }}
      >
        {/* ── 頂部 HUD 資訊與快捷按鈕 ── */}
        <div className="w-full max-w-md flex items-center justify-between gap-2 shrink-0 z-20">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBackToMenu}
              className="px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-black flex items-center gap-1 border border-white/15 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-rose-400" />
              <span>回選單</span>
            </button>

            <button
              onClick={handleBackToLobby}
              className="px-2.5 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-black text-slate-300 border border-white/15 transition-all cursor-pointer"
            >
              回單字館
            </button>
          </div>

          {/* 30秒倒數計時器 (若處於訂正狀態顯示凍結標記) */}
          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl border font-mono font-black text-sm transition-all ${
            isTimerFrozen
              ? 'bg-blue-600/30 border-blue-400 text-blue-300 animate-pulse'
              : timeLeft <= 5
              ? 'bg-rose-600/40 border-rose-400 text-rose-200 animate-bounce'
              : 'bg-black/50 border-white/15 text-white'
          }`}>
            <Clock className={`w-4 h-4 ${isTimerFrozen ? 'text-blue-400' : 'text-amber-400'}`} />
            <span>{isTimerFrozen ? `❄️ ${timeLeft}s (凍結)` : `${timeLeft}s`}</span>
          </div>

          {/* 即時得分與連擊 */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono font-black text-sm">
            <Flame className={`w-4 h-4 ${streak > 2 ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`} />
            <span>{score}</span>
            {streak > 1 && (
              <span className="text-[10px] bg-amber-500 text-stone-950 px-1.5 py-0.2 rounded-full ml-1">
                {streak}x
              </span>
            )}
          </div>
        </div>

        {/* ── 狀態特效提示條 (橫幅) ── */}
        <div className="w-full max-w-md h-8 flex items-center justify-center shrink-0 z-20">
          {activeEffect && (
            <div className={`px-4 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-2 animate-bounce bg-gradient-to-r ${
              activeEffect.type === 'double' ? 'from-amber-500 to-yellow-400 text-stone-950' :
              activeEffect.type === 'star' ? 'from-yellow-300 to-amber-400 text-stone-950' :
              activeEffect.type === 'reverse' ? 'from-rose-500 to-pink-500 text-white' :
              activeEffect.type === 'shrink' ? 'from-purple-500 to-indigo-500 text-white' :
              activeEffect.type === 'wind' ? 'from-sky-500 to-blue-500 text-white' :
              'from-emerald-500 to-teal-400 text-white'
            }`}>
              {activeEffect.type === 'always_right' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>必正卡發威中！剩餘 {alwaysRightCount} 張</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{activeEffect.title} 作用中！({activeEffect.remainingTime}s)</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* ── 核心 2D 撲克手牌展開物理區域 ── */}
        <div className="relative w-full max-w-sm h-[380px] sm:h-[420px] flex items-center justify-center my-auto z-10">
          {/* 背景輔助指示 (一路向右霓虹箭頭) */}
          {isAlwaysRight && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 hidden sm:flex flex-col items-center gap-1 text-emerald-400 animate-pulse font-black text-xs">
              <ChevronRight className="w-8 h-8 animate-ping" />
              <span>一路向右</span>
            </div>
          )}

          {/* 背景輔助指示 (乾坤大挪移左右警示) */}
          {isReversed && (
            <>
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center text-emerald-400 font-black text-xs animate-pulse">
                <Check className="w-8 h-8" />
                <span>左邊是 O</span>
              </div>
              <div className="absolute -right-10 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center text-rose-400 font-black text-xs animate-pulse">
                <X className="w-8 h-8" />
                <span>右邊是 X</span>
              </div>
            </>
          )}

          {/* 渲染卡片堆疊 (從底至頂，後方卡片微縮露出邊角) */}
          {(() => {
            const visibleCards = cardDeck.slice(0, 3);
            const totalVisible = visibleCards.length;
            return visibleCards.slice().reverse().map((card, revIdx) => {
              const actualIdx = totalVisible - 1 - revIdx; // 0 是最上方卡片，1 是次卡，2 是底卡
              const isTop = actualIdx === 0;

              // 次卡與底卡的縮放與下移位移
              const scale = (isShrunk ? 0.6 : 1) * (1 - actualIdx * 0.05);
              const translateY = actualIdx * 14;

              // 最上方卡片的拖曳位移與旋轉
              const currentTranslateX = isTop ? dragOffset.x : 0;
              const currentTranslateY = isTop ? translateY + dragOffset.y : translateY;
              const currentRotation = isTop ? dragAngle : actualIdx * 1.5;

              // 飛離螢幕動畫
              const isExiting = isTop && exitDirection !== null;
              const exitX = exitDirection === 'right' ? 500 : exitDirection === 'left' ? -500 : 0;

              return (
                <div
                  key={card.id}
                  onPointerDown={isTop ? handlePointerDown : undefined}
                  onPointerMove={isTop ? handlePointerMove : undefined}
                  onPointerUp={isTop ? handlePointerUp : undefined}
                  onPointerCancel={isTop ? handlePointerUp : undefined}
                  className={`
                    absolute w-[280px] sm:w-[320px] h-[360px] sm:h-[400px] rounded-3xl p-6
                    flex flex-col justify-between select-none touch-none cursor-grab active:cursor-grabbing
                  shadow-2xl transition-all
                  ${isTop ? 'z-30' : actualIdx === 1 ? 'z-20' : 'z-10'}
                  ${isExiting ? 'transition-transform duration-200 opacity-0' : isDragging && isTop ? '' : 'transition-transform duration-150'}
                  ${card.isSpecial ? 'border-4 border-amber-300' : 'border-2 border-white/20'}
                  ${
                    isCorrecting && isTop
                      ? 'animate-shake ring-4 ring-rose-500 border-rose-500 scale-105 shadow-[0_0_35px_rgba(244,63,94,0.6)]'
                      : ''
                  }
                `}
                style={{
                  transform: isExiting
                    ? `translate(${exitX}px, 0px) rotate(${exitX * 0.08}deg) scale(${scale})`
                    : `translate(${currentTranslateX}px, ${currentTranslateY}px) rotate(${currentRotation}deg) scale(${scale})`,
                  background: card.isSpecial
                    ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)'
                    : 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)'
                }}
              >
                {/* ── 撲克花色邊角 (四角微縮識別) ── */}
                <div className="flex items-center justify-between text-xs font-mono font-black text-white/40">
                  <span>{card.isSpecial ? '★ BONUS' : '♠ WUTAI'}</span>
                  <span>{card.isSpecial ? card.badge : `#${totalSwiped + actualIdx + 1}`}</span>
                </div>

                {/* ── 卡片核心內容 (單字 / 字母 / 功能卡) ── */}
                <div className="flex-1 flex flex-col items-center justify-center text-center my-auto">
                  {card.isSpecial ? (
                    // 功能卡外觀
                    <div className="space-y-3">
                      <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center bg-gradient-to-tr ${card.gradient} text-white shadow-xl shadow-amber-500/30 animate-pulse`}>
                        <Sparkles className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black font-heading text-amber-300">
                        {card.title}
                      </h3>
                      <p className="text-xs font-bold text-slate-300 leading-relaxed px-2">
                        {card.desc}
                      </p>
                      <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white font-black text-[11px] animate-bounce">
                        左右任意滑動即啟動！
                      </span>
                    </div>
                  ) : isCorrecting && isTop ? (
                    // 方案A：名師訂正浮現畫面 (時間凍結中)
                    <div className="space-y-3 p-2 animate-fadeIn" onClick={handleDismissCorrection}>
                      <span className="px-3 py-1 rounded-full bg-rose-500 text-white font-black text-xs shadow-md">
                        ❌ 答錯囉！名師訂正
                      </span>
                      <h3 className="text-3xl sm:text-4xl font-black font-heading text-rose-300 tracking-wide">
                        {card.word}
                      </h3>
                      <div className="p-3 rounded-2xl bg-white/10 border border-white/20">
                        <span className="text-xs font-bold text-slate-400 block mb-0.5">正確配對釋義：</span>
                        <span className="text-2xl font-black text-amber-300">
                          {card.correctMeaning}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-bold">
                        ⏱️ 時間暫停中 • 點擊卡牌立即繼續
                      </p>
                    </div>
                  ) : (
                    // 普通題目卡 (英文單字 + 配對釋義)
                    <div className="space-y-4">
                      <h3 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-wide text-white drop-shadow-md">
                        {card.word}
                      </h3>

                      <div className="h-[2px] w-16 bg-white/20 mx-auto rounded-full" />

                      <p className="text-2xl sm:text-3xl font-black text-amber-300 drop-shadow-md tracking-wider">
                        {card.displayMeaning}
                      </p>
                    </div>
                  )}
                </div>

                {/* ── 底部滑動意向動態浮水印 (往右拉透綠、往左拉透紅) ── */}
                <div className="flex items-center justify-between text-xs font-black">
                  <span className={`transition-all duration-150 flex items-center gap-1 ${
                    isSwipingLeft
                      ? isReversed ? 'text-emerald-400 scale-110 font-extrabold' : 'text-rose-400 scale-110 font-extrabold'
                      : 'text-white/30'
                  }`}>
                    {isReversed ? '✔ 正確 (O)' : '✖ 錯誤 (X)'}
                  </span>

                  <span className={`transition-all duration-150 flex items-center gap-1 ${
                    isSwipingRight
                      ? isReversed ? 'text-rose-400 scale-110 font-extrabold' : 'text-emerald-400 scale-110 font-extrabold'
                      : 'text-white/30'
                  }`}>
                    {isReversed ? '✖ 錯誤 (X)' : '✔ 正確 (O)'}
                  </span>
                </div>
              </div>
            );
          });
        })()}
        </div>

        {/* ── 浮動得分飄字 ── */}
        {floatingScore && (
          <div
            key={floatingScore.id}
            className={`fixed top-24 pointer-events-none font-heading font-black text-xl sm:text-2xl z-40 animate-floatUp ${
              floatingScore.type === 'time' ? 'text-cyan-400' :
              floatingScore.type === 'bonus' ? 'text-amber-300' :
              'text-emerald-400'
            }`}
          >
            {floatingScore.text}
          </div>
        )}

        {/* ── 底部大按鈕操作區 (支援點擊滑掉，無障礙雙相容) ── */}
        <div className="w-full max-w-sm flex items-center justify-between gap-4 shrink-0 z-20 pb-2">
          {/* 左邊按鈕 */}
          <button
            onClick={() => executeSwipe('left')}
            className={`flex-1 py-3.5 px-4 rounded-2xl font-heading font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg cursor-pointer ${
              isReversed
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-emerald-600/30'
                : 'bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-rose-600/30'
            }`}
          >
            {isReversed ? (
              <>
                <Check className="w-5 h-5" />
                <span>正確 (O)</span>
              </>
            ) : (
              <>
                <X className="w-5 h-5" />
                <span>錯誤 (X)</span>
              </>
            )}
          </button>

          {/* 右邊按鈕 */}
          <button
            onClick={() => executeSwipe('right')}
            className={`flex-1 py-3.5 px-4 rounded-2xl font-heading font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg cursor-pointer ${
              isReversed
                ? 'bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-rose-600/30'
                : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-emerald-600/30'
            }`}
          >
            {isReversed ? (
              <>
                <X className="w-5 h-5" />
                <span>錯誤 (X)</span>
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>正確 (O)</span>
              </>
            )}
          </button>
        </div>

        {/* 底部鍵盤提示 */}
        <div className="text-[11px] font-bold text-slate-400 text-center shrink-0">
          💡 支援手指左右滑牌，或使用鍵盤 ← / → 方向鍵作答
        </div>
      </div>
    );
  }

  // ─── 畫面 3：遊戲結算畫面 (30秒極速排行) ───
  if (gameState === 'settlement') {
    const accuracy = totalSwiped > 0 ? Math.round((correctCount / totalSwiped) * 100) : 0;
    const isVocab = gameMode === 'vocab';

    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 animate-fadeIn">
        <GlassCard className="max-w-md w-full text-center p-6 sm:p-8 border shadow-2xl relative overflow-hidden">
          {/* 通關獎盃勳章 */}
          <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center bg-gradient-to-tr from-rose-500 to-amber-400 text-white shadow-xl shadow-rose-500/30">
            <Trophy className="w-10 h-10 text-white animate-bounce" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-800 dark:text-slate-100 mb-1">
            ⏱️ 30 秒滑牌挑戰完成！
          </h2>

          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-5">
            模式：{isVocab ? '單字詞義速辨' : 'Aa 字母大小寫配對'}
          </p>

          {/* 總分看板 */}
          <div className="p-4 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 mb-5 flex flex-col items-center">
            <span className="text-4xl font-black text-rose-500 font-mono tracking-tight">
              {score} 分
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
              總得分（依分數高至低排序登榜）
            </span>

            {/* 詳細統計三格欄 */}
            <div className="flex items-center justify-around w-full border-t border-rose-200/60 dark:border-rose-800/60 pt-3 mt-3">
              <div className="flex flex-col items-center">
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {correctCount}/{totalSwiped}
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">答對題數</span>
              </div>
              <div className="w-[1px] h-7 bg-rose-200 dark:bg-rose-800" />
              <div className="flex flex-col items-center">
                <span className="text-xl font-black text-amber-500 font-mono">
                  {maxStreak}
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">最高連擊</span>
              </div>
              <div className="w-[1px] h-7 bg-rose-200 dark:bg-rose-800" />
              <div className="flex flex-col items-center">
                <span className="text-xl font-black text-blue-500 font-mono">
                  {accuracy}%
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">正確率</span>
              </div>
            </div>
          </div>

          {/* 提報全校 Top 50 英雄榜卡片 */}
          <HonorSubmissionCard
            mode={isVocab ? 'swipe-vocab' : 'swipe-abc'}
            book={qualifyingBook || '1'}
            score={score}
            time={30}
            totalCount={totalSwiped || 20}
            rangeText={isVocab ? '30秒是非滑牌 (單字)' : '30秒是非滑牌 (字母)'}
            reviewWords={[]}
          />

          {/* 操作按鈕群 */}
          <div className="space-y-2 mt-4">
            <Button3D
              variant="rose"
              size="lg"
              onClick={() => handleStartGame(gameMode)}
              className="w-full text-base font-black shadow-lg shadow-rose-500/20"
            >
              再挑戰一次（30 秒）
            </Button3D>

            <Button3D
              variant="blue"
              size="md"
              onClick={handleBackToMenu}
              className="w-full"
            >
              回滑牌選單
            </Button3D>

            <Button3D
              variant="slate"
              size="md"
              onClick={handleBackToLobby}
              className="w-full"
            >
              {t.backToVocabLobby || '回單字學習館'}
            </Button3D>
          </div>
        </GlassCard>
      </div>
    );
  }

  return null;
};
