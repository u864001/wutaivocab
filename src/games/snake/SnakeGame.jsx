import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { useI18n } from '../../context/I18nContext';
import { soundEngine, speakEnglish } from '../../services/audio';
import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';
import { SnakeCanvas2D } from './SnakeCanvas2D';
import { enterFullscreen, exitFullscreen } from '../../services/fullscreen';
import confetti from 'canvas-confetti';
import {
  ArrowLeft, Heart, Trophy, Sparkles, Maximize2, Minimize2,
  ArrowUp, ArrowDown, ArrowLeft as DpadLeft, ArrowRight as DpadRight,
  Mountain, Trees, Award
} from 'lucide-react';

const GRID_W = 20;
const GRID_H = 12;

export const SnakeGame = ({
  settings,
  words = [],
  qualifyingBook,
  onBack
}) => {
  const { t } = useI18n();
  const [gameMode, setGameMode] = useState('normal'); // 'easy' | 'normal' | 'survival'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('wutai_snake_theme') || 'indigenous'; // 預設霧台百步蛇神山
  });
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [currentWord, setCurrentWord] = useState(null);
  const [spelledChars, setSpelledChars] = useState('');
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [timeLeft, setTimeLeft] = useState(60);
  const [survivalTime, setSurvivalTime] = useState(0);
  const [cheerTrigger, setCheerTrigger] = useState(0);

  // 60 FPS 平滑軌跡狀態
  const [renderSnake, setRenderSnake] = useState([{ x: 6, y: 6 }, { x: 5, y: 6 }]);
  const [nextHead, setNextHead] = useState({ x: 7, y: 6 });
  const [stepProgress, setStepProgress] = useState(0);
  const [renderLetters, setRenderLetters] = useState([]);
  const [isSnakeDead, setIsSnakeDead] = useState(false);
  const [invulnerableTime, setInvulnerableTime] = useState(0); // 3 秒受傷無敵倒數

  // Refs 避免閉包舊值
  const invulnerableTimerRef = useRef(0);
  const snakeRef = useRef([{ x: 6, y: 6 }, { x: 5, y: 6 }]);
  const nextHeadRef = useRef({ x: 7, y: 6 });
  const dirRef = useRef('RIGHT');
  const lettersRef = useRef([]); // [{ char, x, y, id }]
  const wordQueueRef = useRef([]);
  const startTimeRef = useRef(0);
  const completedWordsRef = useRef(new Map());
  const mistakeIdsRef = useRef(new Set());

  const currentWordRef = useRef(null);
  const spelledCharsRef = useRef('');

  useEffect(() => {
    currentWordRef.current = currentWord;
  }, [currentWord]);

  useEffect(() => {
    spelledCharsRef.current = spelledChars;
  }, [spelledChars]);

  // 主題切換持久化
  const handleToggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('wutai_snake_theme', newTheme);
    soundEngine.click();
  };

  // 智慧全螢幕管理
  const toggleFullscreen = () => {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement || document.webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  useEffect(() => {
    return () => {
      exitFullscreen();
    };
  }, []);

  // 初始化題庫
  useEffect(() => {
    let filtered = words.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
    wordQueueRef.current = [...filtered].sort(() => 0.5 - Math.random());
  }, [settings, words]);

  const loadNextWord = () => {
    if (wordQueueRef.current.length === 0) {
      const filtered = words.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
      wordQueueRef.current = [...filtered].sort(() => 0.5 - Math.random());
    }
    const next = wordQueueRef.current.shift();
    if (next && next.id) {
      completedWordsRef.current.set(next.id, { id: next.id, en: next.en, zh: next.zh });
    }
    setCurrentWord(next);
    setSpelledChars('');
    spelledCharsRef.current = '';
    if (next?.en) {
      speakEnglish(next.en);
    }

    // 在場上生成目標單字的所有字母與干擾字母
    const targetLetters = (next?.en || '').toLowerCase().split('');
    const extraLetters = 'abcdefghijklmnopqrstuvwxyz'
      .split('')
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const allChars = [...targetLetters, ...extraLetters].sort(() => 0.5 - Math.random());

    const placed = [];
    allChars.forEach((ch, idx) => {
      let x, y;
      let tries = 0;
      do {
        x = Math.floor(Math.random() * (GRID_W - 2)) + 1;
        y = Math.floor(Math.random() * (GRID_H - 2)) + 1;
        tries++;
      } while (
        tries < 50 &&
        (placed.some(p => p.x === x && p.y === y) ||
          snakeRef.current.some(s => s.x === x && s.y === y) ||
          (nextHeadRef.current.x === x && nextHeadRef.current.y === y))
      );

      placed.push({ char: ch, x, y, id: `${ch}-${idx}-${Date.now()}` });
    });

    lettersRef.current = placed;
    setRenderLetters([...placed]);
  };

  const handleStart = (mode) => {
    const filtered = words.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
    if (filtered.length === 0) {
      alert('請先在主畫面勾選複習範圍！');
      return onBack();
    }
    wordQueueRef.current = [...filtered].sort(() => 0.5 - Math.random());
    completedWordsRef.current.clear();
    mistakeIdsRef.current.clear();
    setGameMode(mode);
    setHasStarted(true);
    setIsFinished(false);
    setIsSnakeDead(false);
    setScore(0);
    setHearts(5);
    setTimeLeft(60);
    setStepProgress(0);
    setInvulnerableTime(0);
    invulnerableTimerRef.current = 0;
    startTimeRef.current = Date.now();

    snakeRef.current = [{ x: 6, y: 6 }, { x: 5, y: 6 }];
    dirRef.current = 'RIGHT';
    nextHeadRef.current = { x: 7, y: 6 };

    setRenderSnake([...snakeRef.current]);
    setNextHead({ ...nextHeadRef.current });

    enterFullscreen();
    loadNextWord();
  };

  const handleBackToLobby = () => {
    exitFullscreen();
    onBack();
  };

  // 鍵盤操作監聽 (防反向撞自己)
  useEffect(() => {
    if (!hasStarted || isFinished) return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      const cur = dirRef.current;
      if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && cur !== 'DOWN') dirRef.current = 'UP';
      else if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && cur !== 'UP') dirRef.current = 'DOWN';
      else if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && cur !== 'RIGHT') dirRef.current = 'LEFT';
      else if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && cur !== 'LEFT') dirRef.current = 'RIGHT';
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, isFinished]);

  // ─── 核心 60 FPS 游動與網格前進步進循環 ───
  useEffect(() => {
    if (!hasStarted || isFinished) return;

    const speedMap = {
      easy: 360,      // ms/格
      normal: 270,    // ms/格
      survival: 230   // ms/格
    };
    const stepDuration = speedMap[gameMode] || 270;

    let animId;
    let lastTime = performance.now();
    let accumulated = 0;

    // 扣心與 3 秒受傷無敵觸發 (防連續撞死)
    const handleDeductHeart = () => {
      if (invulnerableTimerRef.current > 0) return; // 免疫重複扣心！

      soundEngine.wrong();
      if (currentWordRef.current?.id) mistakeIdsRef.current.add(currentWordRef.current.id);

      invulnerableTimerRef.current = 3.0; // 開啟 3 秒無敵
      setInvulnerableTime(3.0);

      setHearts(h => {
        if (h <= 1) triggerGameOver();
        return Math.max(0, h - 1);
      });
    };

    // 前進一格網格邏輯：蛇身 100% 沿著蛇頭經過的歷史格子走
    const advanceOneStep = () => {
      const currentHead = snakeRef.current[0];
      const targetHead = { ...(nextHeadRef.current || currentHead) };

      // 1. 檢測自撞 (無敵期間不扣心)
      const hitSelf = snakeRef.current.slice(1).some(seg => seg.x === targetHead.x && seg.y === targetHead.y);
      if (hitSelf) {
        handleDeductHeart();
      }

      // 2. 蛇頭抵達 targetHead
      snakeRef.current.unshift({ ...targetHead });

      // 3. 檢測是否吃到字母
      const letterIndex = lettersRef.current.findIndex(l => l.x === targetHead.x && l.y === targetHead.y);
      if (letterIndex !== -1) {
        const eaten = lettersRef.current[letterIndex];
        const curW = currentWordRef.current;
        const curSpelled = spelledCharsRef.current;
        const nextChar = curW?.en?.toLowerCase()[curSpelled.length];

        if (eaten.char === nextChar) {
          // 吃對字母
          soundEngine.correct();
          const newSpelled = curSpelled + eaten.char;
          spelledCharsRef.current = newSpelled;
          setSpelledChars(newSpelled);

          lettersRef.current.splice(letterIndex, 1);
          setRenderLetters([...lettersRef.current]);

          // 完成單字
          if (newSpelled === curW?.en?.toLowerCase()) {
            soundEngine.combo(3);
            setScore(s => s + 10);
            setCheerTrigger(c => c + 1);
            confetti({ particleCount: 36, spread: 60, origin: { y: 0.6 } });
            setTimeout(() => loadNextWord(), 450);
          }
          // 正確進食：不 pop 尾巴，長度自然加 1
        } else {
          // 吃錯字母
          handleDeductHeart();
          snakeRef.current.pop();
        }
      } else {
        snakeRef.current.pop();
      }

      // 4. 計算下一個目標蛇頭 (nextHead)
      const curDir = dirRef.current;
      const newNext = { ...snakeRef.current[0] };
      if (curDir === 'UP') newNext.y -= 1;
      else if (curDir === 'DOWN') newNext.y += 1;
      else if (curDir === 'LEFT') newNext.x -= 1;
      else if (curDir === 'RIGHT') newNext.x += 1;

      // 穿牆 Wrap around
      if (newNext.x < 0) newNext.x = GRID_W - 1;
      if (newNext.x >= GRID_W) newNext.x = 0;
      if (newNext.y < 0) newNext.y = GRID_H - 1;
      if (newNext.y >= GRID_H) newNext.y = 0;

      nextHeadRef.current = newNext;
      setNextHead(newNext);
      setRenderSnake([...snakeRef.current]);
    };

    const loop = (now) => {
      const dt = Math.min(now - lastTime, 100);
      lastTime = now;

      // 受傷無敵 3 秒倒數計時
      if (invulnerableTimerRef.current > 0) {
        invulnerableTimerRef.current = Math.max(0, invulnerableTimerRef.current - dt / 1000);
        setInvulnerableTime(invulnerableTimerRef.current);
      }

      accumulated += dt / stepDuration;

      while (accumulated >= 1.0) {
        accumulated -= 1.0;
        advanceOneStep();
      }

      setStepProgress(accumulated);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [hasStarted, isFinished, gameMode]);

  // 計時器 (一般模式)
  useEffect(() => {
    if (!hasStarted || isFinished || gameMode !== 'normal') return;

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          triggerGameOver();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, isFinished, gameMode]);

  const triggerGameOver = () => {
    setIsSnakeDead(true);
    setTimeout(() => {
      finishGame();
    }, 600);
  };

  const finishGame = () => {
    setIsFinished(true);
    setSurvivalTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    soundEngine.win();
    exitFullscreen();
  };

  // 觸控手勢
  const touchStartRef = useRef(null);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e) => {
    if (e.cancelable) e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 20) {
      if (absX > absY) {
        handleDpad(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        handleDpad(dy > 0 ? 'DOWN' : 'UP');
      }
    }
    touchStartRef.current = null;
  };

  const handleDpad = (newDir) => {
    const cur = dirRef.current;
    if (newDir === 'UP' && cur !== 'DOWN') dirRef.current = 'UP';
    if (newDir === 'DOWN' && cur !== 'UP') dirRef.current = 'DOWN';
    if (newDir === 'LEFT' && cur !== 'RIGHT') dirRef.current = 'LEFT';
    if (newDir === 'RIGHT' && cur !== 'LEFT') dirRef.current = 'RIGHT';
  };

  const isNextTargetLetter = (letter) => {
    return (
      gameMode === 'easy' &&
      Boolean(currentWord) &&
      letter.char === currentWord.en.toLowerCase()[spelledChars.length]
    );
  };

  // ─── 遊戲前大廳畫面 ───
  if (!hasStarted) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <GlassCard className="max-w-lg w-full text-center p-8 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-bounce shadow-lg ${
            theme === 'indigenous'
              ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
          }`}>
            {theme === 'indigenous' ? (
              <span className="text-5xl">🐍</span>
            ) : (
              <Sparkles className="w-12 h-12" />
            )}
          </div>

          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2 font-heading tracking-tight">
            {theme === 'indigenous' ? '⛰️ 霧台神山 • 百步蛇拼字傳奇' : '🌿 陽光熱帶雨林 • 字母貪食蛇'}
          </h2>

          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            {theme === 'indigenous'
              ? '化身排灣與魯凱族守護神獸「百步蛇」，在茂密高山灌木與隨風搖曳的純白百合花間穿梭，累積勇士積分！'
              : t.snakeHelp}
          </p>

          {/* 雙主題風格切換器 */}
          <div className="mb-6 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
            <button
              onClick={() => handleToggleTheme('indigenous')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
                theme === 'indigenous'
                  ? 'bg-amber-500 text-stone-950 shadow-md scale-100 font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Mountain className="w-4 h-4" />
              <span>霧台神山百步蛇</span>
            </button>
            <button
              onClick={() => handleToggleTheme('jungle')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
                theme === 'jungle'
                  ? 'bg-emerald-500 text-white shadow-md scale-100 font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Trees className="w-4 h-4" />
              <span>陽光熱帶雨林</span>
            </button>
          </div>

          <div className="space-y-3">
            <Button3D
              variant={theme === 'indigenous' ? 'amber' : 'emerald'}
              size="lg"
              onClick={() => handleStart('easy')}
              className="w-full text-base"
            >
              {t.snakeEasy}
            </Button3D>
            <Button3D
              variant={theme === 'indigenous' ? 'amber' : 'amber'}
              size="lg"
              onClick={() => handleStart('normal')}
              className="w-full text-base"
            >
              {t.snakeNormal}
            </Button3D>
            <Button3D
              variant={theme === 'indigenous' ? 'stone' : 'blue'}
              size="lg"
              onClick={() => handleStart('survival')}
              className="w-full text-base"
            >
              {t.snakeSurvival}
            </Button3D>
            <Button3D
              variant="slate"
              size="md"
              onClick={handleBackToLobby}
              className="w-full mt-2"
            >
              {t.backLobby}
            </Button3D>
          </div>
        </GlassCard>
      </div>
    );
  }

  // ─── 遊戲結算畫面 ───
  if (isFinished) {
    const isIndigenous = theme === 'indigenous';

    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 animate-fadeIn">
        <GlassCard className={`max-w-md w-full text-center p-8 border shadow-2xl ${
          isIndigenous
            ? 'bg-stone-900/90 border-amber-500/40 text-stone-100'
            : 'bg-emerald-950/20 border-emerald-500/30'
        }`}>
          <div className="relative mx-auto mb-3 flex items-center justify-center">
            {isIndigenous ? (
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 flex items-center justify-center shadow-lg border-2 border-amber-200">
                  <Award className="w-11 h-11 text-stone-950" />
                </div>
                <span className="absolute -bottom-1 -right-1 text-2xl">🌸</span>
              </div>
            ) : (
              <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
            )}
          </div>

          <h2 className="text-3xl font-black font-heading mb-1 tracking-tight">
            {isIndigenous ? '⛰️ 霧台神山勇士 • 百合桂冠加冕' : t.snakeResults}
          </h2>

          <p className="text-xs font-bold text-slate-400 mb-6">
            {isIndigenous ? '漫步茂密高山灌木百合之境 • ' : ''}
            {t.survivalTime}
            <span className={isIndigenous ? 'text-amber-400 font-black text-lg ml-1' : 'text-emerald-400 font-black text-lg ml-1'}>
              {survivalTime} 秒
            </span>
          </p>

          <div className={`p-5 rounded-2xl border mb-6 ${
            isIndigenous
              ? 'bg-stone-800/80 border-amber-500/30'
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
          }`}>
            <span className={`text-5xl font-black ${
              isIndigenous ? 'text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {score} <span className="text-2xl font-bold">{t.unitPoints}</span>
            </span>
            <p className="text-xs font-bold text-slate-400 mt-1">
              {isIndigenous ? '百步蛇神聖勇士積分' : t.adventureScore}
            </p>
          </div>

          <HonorSubmissionCard
            mode={`snake-${gameMode}`}
            book={qualifyingBook}
            score={score}
            time={survivalTime}
            totalCount={Math.max(Math.floor(score / 10), completedWordsRef.current.size, 1)}
            rangeText={qualifyingBook ? `第 ${qualifyingBook} 冊` : settings.selectedUnits.slice(0, 3).join(', ')}
            reviewWords={Array.from(completedWordsRef.current.values()).map(w => ({
              ...w,
              isMistake: mistakeIdsRef.current.has(w.id)
            }))}
          />

          <Button3D
            variant={isIndigenous ? 'amber' : 'slate'}
            size="lg"
            onClick={handleBackToLobby}
            className="w-full mt-4"
          >
            {t.backLobby}
          </Button3D>
        </GlassCard>
      </div>
    );
  }

  // ─── 遊戲進行中畫面 (iPad 零捲動滿版全螢幕適配) ───
  return (
    <div className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-between p-2 sm:p-3 max-h-[100dvh] h-[100dvh] overflow-hidden select-none animate-fadeIn">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center h-full justify-between">
        {/* 頂部資訊列 (HUD) */}
        <div className="w-full flex items-center justify-between mb-1 sm:mb-2 gap-2 flex-shrink-0">
          <Button3D variant="slate" size="sm" onClick={handleBackToLobby} icon={ArrowLeft}>
            {t.backLobby}
          </Button3D>

        {/* 雙主題快速切換微型開關 */}
        <div className="flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700">
          <button
            onClick={() => handleToggleTheme('indigenous')}
            title="切換為霧台百步蛇主題"
            className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
              theme === 'indigenous'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">百步蛇</span>
          </button>
          <button
            onClick={() => handleToggleTheme('jungle')}
            title="切換為熱帶雨林主題"
            className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
              theme === 'jungle'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Trees className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">青蛇雨林</span>
          </button>
        </div>

        {/* 愛心生命值 */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {[...Array(5)].map((_, i) => (
            <Heart
              key={i}
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-all ${
                i < hearts
                  ? 'text-rose-500 fill-rose-500 animate-pulse'
                  : 'text-slate-300 dark:text-slate-700 opacity-40'
              }`}
            />
          ))}
        </div>

        {/* 限時 (一般模式) */}
        {gameMode === 'normal' && (
          <div className="px-3 py-1 rounded-xl bg-amber-400 text-amber-950 font-black text-xs sm:text-sm shadow-sm">
            ⏱ {timeLeft}s
          </div>
        )}

        {/* 分數 */}
        <div className={`px-3 py-1 rounded-xl font-black text-xs sm:text-sm shadow-md ${
          theme === 'indigenous' ? 'bg-amber-500 text-stone-950' : 'bg-emerald-500 text-white'
        }`}>
          得分: {score}
        </div>

        {/* 全螢幕切換手動按鈕 */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? '退出全螢幕' : '全螢幕遊玩'}
          className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* 目標單字拼字進度條 */}
      {currentWord && (
        <div className={`w-full mb-3 p-3 rounded-2xl border flex items-center justify-between shadow-sm ${
          theme === 'indigenous'
            ? 'bg-stone-900/90 border-amber-500/30 text-stone-100'
            : 'bg-white/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-2xl font-heading font-black">
              {currentWord.zh}
            </span>
            <button
              onClick={() => speakEnglish(currentWord.en)}
              className="text-xs px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-400 hover:bg-amber-400/30 transition-colors"
            >
              🔊 唸法
            </button>
          </div>

          <div className="flex gap-1.5 sm:gap-2">
            {currentWord.en.split('').map((char, idx) => (
              <span
                key={idx}
                className={`w-7 h-8 sm:w-8 sm:h-9 rounded-xl flex items-center justify-center font-black text-base sm:text-lg transition-transform ${
                  idx < spelledChars.length
                    ? theme === 'indigenous'
                      ? 'bg-amber-500 text-stone-950 shadow-sm scale-105'
                      : 'bg-emerald-500 text-white shadow-sm scale-105'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                }`}
              >
                {idx < spelledChars.length ? char.toUpperCase() : '_'}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 2D 骨骼動力學平滑畫布 (彈性高度適配 iPad 一頁檢視) */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center my-1">
        <SnakeCanvas2D
          snake={renderSnake}
          nextHead={nextHead}
          stepProgress={stepProgress}
          letters={renderLetters}
          theme={theme}
          isDead={isSnakeDead}
          isInvulnerable={invulnerableTime > 0}
          isNextTargetFn={isNextTargetLetter}
          cheerTrigger={cheerTrigger}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          gridW={GRID_W}
          gridH={GRID_H}
          width={800}
          height={480}
        />
      </div>

      {/* 虛擬十字鍵 */}
      <div className="flex flex-col items-center gap-1.5 flex-shrink-0 mb-1">
        <Button3D
          variant={theme === 'indigenous' ? 'stone' : 'slate'}
          size="sm"
          onClick={() => handleDpad('UP')}
          className="w-16 h-11"
        >
          <ArrowUp className="w-5 h-5" />
        </Button3D>
        <div className="flex gap-4">
          <Button3D
            variant={theme === 'indigenous' ? 'stone' : 'slate'}
            size="sm"
            onClick={() => handleDpad('LEFT')}
            className="w-16 h-11"
          >
            <DpadLeft className="w-5 h-5" />
          </Button3D>
          <Button3D
            variant={theme === 'indigenous' ? 'stone' : 'slate'}
            size="sm"
            onClick={() => handleDpad('DOWN')}
            className="w-16 h-11"
          >
            <ArrowDown className="w-5 h-5" />
          </Button3D>
          <Button3D
            variant={theme === 'indigenous' ? 'stone' : 'slate'}
            size="sm"
            onClick={() => handleDpad('RIGHT')}
            className="w-16 h-11"
          >
            <DpadRight className="w-5 h-5" />
          </Button3D>
        </div>
      </div>
    </div>
  </div>
  );
};
