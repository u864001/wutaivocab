import { useStudent } from '../../context/StudentContext';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { SpotterScene } from './SpotterScene';
import { SpotterWordBank } from './SpotterWordBank';
import { SPOTTER_SCENES, SPOTTER_SCENES_BY_BOOK, ALL_SCENES_BY_BOOK, generateSpotterRound } from './spotterData';
import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';
import { generateSpotterAlphabetRound } from '../../services/alphabetEngine';
import { soundEngine } from '../../services/audio';
import confetti from 'canvas-confetti';
import {
  ArrowLeft, Heart, Timer, Trophy, Sparkles, RefreshCw,
  CheckCircle2, AlertTriangle, ShieldAlert, Search, Lightbulb
} from 'lucide-react';

export const VocabSpotterGame = ({
  settings,
  words = [],
  qualifyingBook,
  onBack,
  onOpenWorkbench
}) => {
  const { currentStudent } = useStudent();
  // 依據選取的冊次動態匹配場景（支援 1～8 冊完整成對立體紙雕）
  const selectedBook = useMemo(() => {
    // 1. 優先檢查 URL 參數
    try {
      const sp = new URLSearchParams(window.location.search);
      const urlBook = sp.get('book');
      if (urlBook && SPOTTER_SCENES_BY_BOOK[urlBook]) return urlBook;
      const urlGrade = sp.get('grade');
      if (urlGrade) {
        const gradeMap = { '6': '7', '5': '5', '4': '3', '3': '1' };
        const cleanG = urlGrade.replace(/^0/, '');
        if (gradeMap[cleanG] && SPOTTER_SCENES_BY_BOOK[gradeMap[cleanG]]) return gradeMap[cleanG];
      }
    } catch (e) {}

    // 2. 檢查 props 傳入的 qualifyingBook
    if (qualifyingBook && SPOTTER_SCENES_BY_BOOK[String(qualifyingBook)]) {
      return String(qualifyingBook);
    }

    // 3. 檢查 settings?.selectedBook
    if (settings?.selectedBook && SPOTTER_SCENES_BY_BOOK[String(settings.selectedBook)]) {
      return String(settings.selectedBook);
    }

    // 4. 檢查 settings?.selectedUnits (例如 '7-1' 或 'b7' -> '7')
    if (settings?.selectedUnits && settings.selectedUnits.length > 0) {
      for (const u of settings.selectedUnits) {
        const b = String(u).split('-')[0].replace(/^b/, '');
        if (b && SPOTTER_SCENES_BY_BOOK[b]) return b;
      }
    }

    // 5. 檢查當前登入學生的年級 (六年級預設第 7 冊、五年級第 5 冊、四年級第 3 冊、三年級第 1 冊)
    const cleanGrade = String(currentStudent?.grade || '').replace(/^0/, '');
    const gradeBookMap = { '6': '7', '5': '5', '4': '3', '3': '1' };
    if (cleanGrade && gradeBookMap[cleanGrade] && SPOTTER_SCENES_BY_BOOK[gradeBookMap[cleanGrade]]) {
      return gradeBookMap[cleanGrade];
    }

    return '1';
  }, [qualifyingBook, settings?.selectedBook, settings?.selectedUnits, currentStudent?.grade]);

  // 低年級 Aa 字母模式判斷 (一、二年級或字母專案)
  const isAlphabetMode = useMemo(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const urlGrade = sp.get('grade');
      const urlBook = sp.get('book');
      if (urlGrade === '1' || urlGrade === '2' || urlGrade === '01' || urlGrade === '02' || urlBook === 'abc') {
        return true;
      }
    } catch (e) {}

    const cleanGrade = String(currentStudent?.grade || '');
    return qualifyingBook === 'abc' ||
      cleanGrade === '01' || cleanGrade === '02' || cleanGrade === '1' || cleanGrade === '2' ||
      (settings?.selectedUnits && settings.selectedUnits.includes('abc')) ||
      Boolean(settings?.alphaMode);
  }, [qualifyingBook, settings, currentStudent?.grade]);

  const scenesForBook = ALL_SCENES_BY_BOOK[selectedBook] || [SPOTTER_SCENES_BY_BOOK[selectedBook] || SPOTTER_SCENES_BY_BOOK['1']];
  const [sceneIndex, setSceneIndex] = useState(0);
  const currentScene = scenesForBook[sceneIndex] || scenesForBook[0];

  // 每一局動態隨機抽取 5 個目標單字並指定樣態
  const [roundSeed, setRoundSeed] = useState(() => Date.now());
  const roundData = useMemo(() => generateSpotterRound(currentScene, 5), [currentScene, roundSeed]);

  const alphaRoundData = useMemo(() => {
    return isAlphabetMode ? generateSpotterAlphabetRound(6, 3, currentStudent?.grade || '01') : null;
  }, [isAlphabetMode, roundSeed, currentStudent?.grade]);

  const { activeDifferences, itemStateMap, wordBankOptions, totalCount } = isAlphabetMode
    ? { activeDifferences: alphaRoundData?.differences || [], itemStateMap: {}, wordBankOptions: [], totalCount: 3 }
    : roundData;

  // 遊戲核心狀態
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'failed' | 'victory'
  const [lives, setLives] = useState(5); // 5 顆愛心
  const [spotlightDiffId, setSpotlightDiffId] = useState(null); // 當前聚光燈鎖定之相異點 ID
  const [solvedDiffIds, setSolvedDiffIds] = useState(() => new Set());
  const [shakeScene, setShakeScene] = useState(false);
  const [missFeedback, setMissFeedback] = useState(null);
  const [matchSuccessFeedback, setMatchSuccessFeedback] = useState(null);
  const [missRipples, setMissRipples] = useState([]);

  // 放大鏡檢視模式狀態（雙圖同步縮放平移，純檢視不觸發點擊）
  const [isInspectMode, setIsInspectMode] = useState(false);
  const [pan, setPan] = useState({ x: 300, y: 180 });

  // 鷹眼提示狀態 (消耗 1 心換取未解線索霓虹光環)
  const [hintDiffId, setHintDiffId] = useState(null);
  const [showHintConfirmModal, setShowHintConfirmModal] = useState(false);

  // 計時器 (毫秒精度，過關時結算)
  const [elapsedMs, setElapsedMs] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  // 計時器運作
  useEffect(() => {
    if (gameState === 'playing') {
      startTimeRef.current = Date.now() - elapsedMs;
      timerRef.current = setInterval(() => {
        setElapsedMs(Date.now() - startTimeRef.current);
      }, 50);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // 重置/開啟全新題目挑戰（多場景冊次自動切換下一個場景）
  const handleRestart = () => {
    if (scenesForBook.length > 1) {
      setSceneIndex(prev => (prev + 1) % scenesForBook.length);
    }
    setRoundSeed(Date.now()); // 換一組全新的隨機 5 個題目與樣態
    setGameState('playing');
    setLives(5);
    setSpotlightDiffId(null);
    setSolvedDiffIds(new Set());
    setElapsedMs(0);
    setMissFeedback(null);
    setMatchSuccessFeedback(null);
    setMissRipples([]);
    setHintDiffId(null);
    setIsInspectMode(false);
    setPan({ x: 300, y: 180 });
    startTimeRef.current = Date.now();
  };

  // 專案負責人 Mark 隱藏入口：放大鏡圖標連點 5 下直通變異工作台
  const secretClicksRef = useRef(0);
  const secretTimerRef = useRef(null);

  const handleMagnifierSecretClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    secretClicksRef.current += 1;
    if (secretTimerRef.current) clearTimeout(secretTimerRef.current);

    if (secretClicksRef.current >= 5) {
      secretClicksRef.current = 0;
      soundEngine.correct();
      if (onOpenWorkbench) {
        onOpenWorkbench();
      } else {
        window.location.search = '?view=spotter-test';
      }
    } else {
      secretTimerRef.current = setTimeout(() => {
        secretClicksRef.current = 0;
      }, 2000);
    }
  };

  // 觸發提示請求
  const handleRequestHint = () => {
    if (gameState !== 'playing' || spotlightDiffId) return;
    if (lives <= 1) {
      setMissFeedback("⚠️ 愛心僅剩 1 顆，無法使用提示（避免耗盡失敗）！");
      setTimeout(() => setMissFeedback(null), 2500);
      return;
    }
    setShowHintConfirmModal(true);
  };

  // 確認消耗 1 心取得提示
  const handleConfirmHint = () => {
    setShowHintConfirmModal(false);
    const unsolved = activeDifferences.filter(d => !solvedDiffIds.has(d.id));
    if (unsolved.length === 0) return;

    setLives(prev => Math.max(1, prev - 1));
    soundEngine.click();

    const target = unsolved[Math.floor(Math.random() * unsolved.length)];
    setHintDiffId(target.id);
  };

  // 扣心與檢查失敗
  const deductLife = (reasonText) => {
    setLives(prev => {
      const nextLives = Math.max(0, prev - 1);
      if (nextLives === 0) {
        setGameState('failed');
        soundEngine.wrong();
      }
      return nextLives;
    });

    // 震動畫面
    setShakeScene(true);
    setTimeout(() => setShakeScene(false), 500);

    // 提示反饋
    setMissFeedback(reasonText);
    setTimeout(() => setMissFeedback(null), 2500);
  };

  // 點擊字母積木處理 (低年級找碴模式)
  const handleAlphabetBlockClick = (block) => {
    if (gameState !== 'playing' || !alphaRoundData) return;

    if (block.isDifference) {
      if (solvedDiffIds.has(block.diffId)) return;
      const newSolved = new Set(solvedDiffIds);
      newSolved.add(block.diffId);
      setSolvedDiffIds(newSolved);
      soundEngine.correct();

      const diffObj = alphaRoundData.differences.find(d => d.id === block.diffId);
      setMatchSuccessFeedback({
        word: block.char,
        wordZh: diffObj?.reason || '積木差異',
        solvedCount: newSolved.size,
        total: alphaRoundData.totalDiffs
      });
      setTimeout(() => setMatchSuccessFeedback(null), 2500);

      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}

      if (newSolved.size >= alphaRoundData.totalDiffs) {
        setGameState('victory');
        soundEngine.win();
        setTimeout(() => {
          try {
            confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
          } catch (e) {}
        }, 300);
      }
    } else {
      deductLife('❌ 這裡兩邊積木完全一樣喔！請再仔細觀察其他字母～');
    }
  };

  const wordBankContainerRef = useRef(null);

  // 點擊命中相異目標
  const handleDifferenceClicked = (diffId, clickPos) => {
    if (spotlightDiffId) return; // 聚光燈鎖定中不重複觸發
    if (hintDiffId) setHintDiffId(null); // 作答時消滅提示圈

    soundEngine.correct();
    setSpotlightDiffId(diffId);
    setMissFeedback(null);

    // 平滑捲動至單字庫區，確保小螢幕與平板上單字庫即刻出現在視野中央
    if (wordBankContainerRef.current) {
      setTimeout(() => {
        wordBankContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  // 點擊非相異之處 (點錯)
  const handleMissClicked = (clickPos) => {
    if (spotlightDiffId) return;
    if (hintDiffId) setHintDiffId(null); // 作答時消滅提示圈

    soundEngine.wrong();
    const rippleId = Date.now() + Math.random();
    setMissRipples(prev => [...prev, { id: rippleId, x: clickPos.x, y: clickPos.y }]);
    setTimeout(() => {
      setMissRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 800);

    deductLife('❌ 這裡兩邊完全一樣喔！請再仔細觀察其他角落～');
  };

  // 單字庫點選成功
  const handleWordMatchSuccess = (diffId) => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {}

    const newSolved = new Set(solvedDiffIds);
    newSolved.add(diffId);
    setSolvedDiffIds(newSolved);
    setSpotlightDiffId(null);

    const targetDiff = activeDifferences.find(d => d.id === diffId);
    if (targetDiff) {
      setMatchSuccessFeedback({
        word: targetDiff.word,
        wordZh: targetDiff.wordZh,
        solvedCount: newSolved.size,
        total: totalCount
      });
      setTimeout(() => setMatchSuccessFeedback(null), 2500);
    }

    // 檢查是否全破通關 (本局 5 個相異點全部尋獲)
    if (newSolved.size >= totalCount) {
      setGameState('victory');
      soundEngine.win();
      setTimeout(() => {
        try {
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.5 }
          });
        } catch (e) {}
      }, 300);
    }
  };

  // 單字庫點選失敗
  const handleWordMatchFail = (word) => {
    deductLife(`❌ 「${word}」不是聚光燈照出的物品喔！請再看一眼聚光燈！`);
  };

  // 格式化計時時間 (分:秒.毫秒)
  const formattedTime = useMemo(() => {
    const totalSec = elapsedMs / 1000;
    const mins = Math.floor(totalSec / 60);
    const secs = (totalSec % 60).toFixed(1);
    return `${String(mins).padStart(2, '0')}:${secs.padStart(4, '0')}`;
  }, [elapsedMs]);

  const activeSpotlightDiff = activeDifferences.find(d => d.id === spotlightDiffId);
  const BOOK_ZH_MAP = { '1': '一', '2': '二', '3': '三', '4': '四', '5': '五', '6': '六', '7': '七', '8': '八' };
  const bookZhNum = BOOK_ZH_MAP[String(currentScene.book)] || currentScene.book;

  return (
    <div className="w-full max-w-6xl mx-auto px-1 sm:px-3 py-1.5 sm:py-3 space-y-1.5 sm:space-y-2.5 animate-fadeIn pb-10 select-none">
      {/* ── 頂部抬頭控制列（極致精簡單列排版，最大化釋放雙圖空間） ── */}
      <GlassCard className="p-1.5 sm:p-2.5 flex items-center justify-between gap-1.5 sm:gap-2.5 border-2 border-amber-300 dark:border-amber-700/60 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-amber-500/10">
        {/* 左側：回大廳、放大鏡圖標 (5次點擊直通工作台)、鷹眼神探 (手機僅圖標)、冊次標籤 (手機僅數字) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Button3D variant="slate" size="sm" onClick={onBack} icon={ArrowLeft} className="px-2 py-1 text-xs shrink-0">
            <span className="hidden sm:inline">回大廳</span>
          </Button3D>

          <button
            type="button"
            onClick={handleMagnifierSecretClick}
            className="p-1 rounded-lg hover:bg-amber-500/10 active:scale-90 transition-all text-amber-500 cursor-pointer shrink-0"
            title="鷹眼神探"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
          </button>

          <h2 className="hidden sm:inline text-sm sm:text-base font-black text-slate-800 dark:text-white font-heading whitespace-nowrap">
            鷹眼神探
          </h2>

          <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black shrink-0 whitespace-nowrap">
            <span className="hidden sm:inline">第{bookZhNum}冊</span>
            <span className="sm:hidden">{bookZhNum}</span>
          </span>
        </div>

        {/* 右側：愛心、進度、秒數、放大鏡、提示、換題 */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none shrink-0">
          {/* 愛心條 (5 Lives) */}
          <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 rounded-xl bg-rose-500/10 border border-rose-300 dark:border-rose-800 shrink-0">
            {[...Array(5)].map((_, i) => (
              <Heart
                key={i}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${
                  i < lives
                    ? 'text-rose-500 fill-rose-500 scale-100'
                    : 'text-slate-300 dark:text-slate-600 scale-90'
                }`}
              />
            ))}
          </div>

          {/* 破案進度 (0/5) */}
          <div className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-xl bg-emerald-500/10 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] sm:text-xs font-black shrink-0 whitespace-nowrap">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">進度：</span>
            <span>{solvedDiffIds.size}/{totalCount}</span>
          </div>

          {/* 計時器 */}
          <div className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] sm:text-xs font-black font-mono shrink-0 whitespace-nowrap">
            <Timer className="w-3.5 h-3.5 text-amber-500" />
            <span>{formattedTime}</span>
          </div>

          {/* 🔍 放大鏡檢視按鈕 */}
          <button
            onClick={() => setIsInspectMode(prev => !prev)}
            className={`px-2 py-1 rounded-xl border text-[11px] sm:text-xs font-black flex items-center gap-1 active:scale-95 transition-all cursor-pointer shrink-0 ${
              isInspectMode
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
            }`}
            title={isInspectMode ? '退出放大鏡檢視 (回到作答)' : '開啟放大鏡檢視模式'}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isInspectMode ? '退出' : '放大鏡'}</span>
          </button>

          {/* 💡 鷹眼提示按鈕 (消耗 1 心) */}
          <button
            onClick={handleRequestHint}
            disabled={gameState !== 'playing' || !!spotlightDiffId}
            className="px-2 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-400/40 text-[11px] sm:text-xs font-black flex items-center gap-0.5 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            title="消耗 1 顆愛心圈出 1 處未解線索"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">提示</span>
            <span className="text-[10px] text-rose-500 font-black">(-1❤️)</span>
          </button>

          {/* 隨機換題按鈕 */}
          <button
            onClick={handleRestart}
            className="px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs font-black flex items-center gap-1 active:scale-95 transition-all cursor-pointer shrink-0"
            title="隨機換題 / 切換場景"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">換題</span>
          </button>
        </div>
      </GlassCard>

      {/* ── 放大鏡檢視狀態浮動提示列 ── */}
      {isInspectMode && (
        <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/15 border border-amber-400 dark:border-amber-500 text-amber-900 dark:text-amber-200 text-xs font-black flex flex-wrap items-center justify-between gap-2 shadow-md backdrop-blur-md animate-in fade-in">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-black shrink-0 text-[11px]">🔍 放大檢視</span>
            <span className="text-[11px] sm:text-xs">拖曳任一圖同步移動，此模式點擊不作答、不扣心</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPan({ x: 300, y: 180 })}
              className="px-2 py-1 rounded-lg bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-black border border-slate-300 dark:border-slate-600 active:scale-95 transition-all cursor-pointer"
            >
              視野居中
            </button>
            <button
              onClick={() => setIsInspectMode(false)}
              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-black shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              ✕ 退出
            </button>
          </div>
        </div>
      )}

      {/* ── 浮動提示膠囊 (Toast HUD：浮於畫卷之上，徹底杜絕畫面跳動與 Layout Shift) ── */}
      {(matchSuccessFeedback || missFeedback) && (
        <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none max-w-lg w-[92%] transition-all duration-300">
          {matchSuccessFeedback && (
            <div className="p-3 sm:p-3.5 rounded-2xl bg-emerald-600/95 dark:bg-emerald-700/95 text-white text-xs sm:text-sm font-black flex items-center justify-between gap-3 shadow-2xl backdrop-blur-md border border-emerald-300/40 animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
                <span>🎉 太強了！成功尋獲相異物品：<strong className="underline decoration-2 text-yellow-300 uppercase">{matchSuccessFeedback.word}</strong>（{matchSuccessFeedback.wordZh}）！</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-800/80 text-emerald-100 text-xs font-black shrink-0">
                {matchSuccessFeedback.solvedCount} / {matchSuccessFeedback.total}
              </span>
            </div>
          )}

          {missFeedback && !matchSuccessFeedback && (
            <div className="p-3 sm:p-3.5 rounded-2xl bg-rose-600/95 dark:bg-rose-700/95 text-white text-xs sm:text-sm font-black flex items-center gap-2.5 shadow-2xl backdrop-blur-md border border-rose-300/40 animate-in fade-in slide-in-from-top-4">
              <AlertTriangle className="w-4 h-4 text-rose-200 shrink-0 animate-bounce" />
              <span>{missFeedback}</span>
            </div>
          )}
        </div>
      )}

      {/* ── 核心遊戲舞台：低年級字母托盤模式 vs 中高年級紙雕場景模式 ── */}
      {isAlphabetMode ? (
        <div className="w-full flex flex-col space-y-3 animate-fadeIn">
          {/* 低年級字母托盤狀態欄 */}
          <div className="p-3 rounded-2xl bg-amber-500/15 border-2 border-amber-400 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-black flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
              <span>左右托盤散落著字母積木，找出 <strong>{alphaRoundData?.totalDiffs || 3}</strong> 處顏色、字母或大小寫相異之處！</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shrink-0 shadow">
              已尋獲：{solvedDiffIds.size} / {alphaRoundData?.totalDiffs || 3}
            </span>
          </div>

          {/* 左右對照字母托盤 (直立上下排、橫放/折疊/平板左右排) */}
          <div className={`grid grid-cols-1 landscape:grid-cols-2 md:grid-cols-2 gap-3 transition-transform ${shakeScene ? 'animate-headShake' : ''}`}>
            {/* 左托盤 */}
            <div className="relative w-full aspect-[4/3] rounded-3xl bg-gradient-to-b from-stone-850 via-stone-900 to-stone-950 border-4 border-amber-500/70 shadow-2xl overflow-hidden p-4">
              <div className="absolute top-2.5 left-3 z-10 px-2.5 py-1 rounded-xl bg-black/70 text-amber-300 text-xs font-black border border-amber-400/30">
                左側托盤 (Left Tray)
              </div>
              <div className="relative w-full h-full">
                {alphaRoundData?.leftBlocks.map((block) => {
                  const isSolved = solvedDiffIds.has(block.diffId);
                  return (
                    <button
                      key={block.id}
                      type="button"
                      onClick={() => handleAlphabetBlockClick(block)}
                      style={{
                        left: `${block.x}%`,
                        top: `${block.y}%`,
                        transform: `translate(-50%, -50%) rotate(${block.rotation}deg)`,
                        fontFamily: block.font,
                        color: block.color,
                        fontSize: `${block.fontSize}px`
                      }}
                      className={`absolute w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-black shadow-xl border-2 transition-transform active:scale-90 cursor-pointer select-none ${
                        isSolved
                          ? 'bg-emerald-500/30 border-emerald-400 ring-4 ring-emerald-400/50 scale-105'
                          : 'bg-stone-900/90 border-stone-600 hover:border-amber-400 hover:scale-110'
                      }`}
                    >
                      <span>{block.char}</span>
                      {isSolved && (
                        <CheckCircle2 className="absolute -top-1.5 -right-1.5 w-5 h-5 text-emerald-400 bg-stone-950 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 右托盤 */}
            <div className="relative w-full aspect-[4/3] rounded-3xl bg-gradient-to-b from-stone-850 via-stone-900 to-stone-950 border-4 border-cyan-500/70 shadow-2xl overflow-hidden p-4">
              <div className="absolute top-2.5 left-3 z-10 px-2.5 py-1 rounded-xl bg-black/70 text-cyan-300 text-xs font-black border border-cyan-400/30">
                右側托盤 (Right Tray)
              </div>
              <div className="relative w-full h-full">
                {alphaRoundData?.rightBlocks.map((block) => {
                  if (block.isVisible === false) {
                    const isSolved = solvedDiffIds.has(block.diffId);
                    return (
                      <button
                        key={block.id}
                        type="button"
                        onClick={() => handleAlphabetBlockClick({ ...block, isDifference: true })}
                        style={{
                          left: `${block.x}%`,
                          top: `${block.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        className={`absolute w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-black cursor-pointer transition-all active:scale-90 select-none ${
                          isSolved
                            ? 'bg-emerald-500/30 border-2 border-emerald-400 text-emerald-300 ring-4 ring-emerald-400/50 scale-105'
                            : 'bg-transparent border-0 opacity-0 hover:opacity-10'
                        }`}
                        title={isSolved ? '已找齊' : ''}
                      >
                        {isSolved ? (
                          <>
                            <span className="text-[11px] font-black">已找齊</span>
                            <CheckCircle2 className="absolute -top-1.5 -right-1.5 w-5 h-5 text-emerald-400 bg-stone-950 rounded-full" />
                          </>
                        ) : null}
                      </button>
                    );
                  }

                  const isSolved = solvedDiffIds.has(block.diffId);
                  return (
                    <button
                      key={block.id}
                      type="button"
                      onClick={() => handleAlphabetBlockClick(block)}
                      style={{
                        left: `${block.x}%`,
                        top: `${block.y}%`,
                        transform: `translate(-50%, -50%) rotate(${block.rotation}deg)`,
                        fontFamily: block.font,
                        color: block.color,
                        fontSize: `${block.fontSize}px`
                      }}
                      className={`absolute w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-black shadow-xl border-2 transition-transform active:scale-90 cursor-pointer select-none ${
                        isSolved
                          ? 'bg-emerald-500/30 border-emerald-400 ring-4 ring-emerald-400/50 scale-105'
                          : 'bg-stone-900/90 border-stone-600 hover:border-cyan-400 hover:scale-110'
                      }`}
                    >
                      <span>{block.char}</span>
                      {isSolved && (
                        <CheckCircle2 className="absolute -top-1.5 -right-1.5 w-5 h-5 text-emerald-400 bg-stone-950 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 雙圖畫卷核心區域 (直立手機上下排、橫放/折疊/平板左右排) */}
          <div className={`grid grid-cols-1 landscape:grid-cols-2 md:grid-cols-2 gap-2 sm:gap-3 transition-transform ${shakeScene ? 'animate-headShake' : ''}`}>
            {/* 左圖 */}
            <SpotterScene
              scene={currentScene}
              itemStateMap={itemStateMap}
              activeDifferences={activeDifferences}
              isLeft={true}
              spotlightDiffId={spotlightDiffId}
              solvedDiffIds={solvedDiffIds}
              onDifferenceClicked={handleDifferenceClicked}
              onMissClicked={handleMissClicked}
              missRipples={missRipples}
              isInspectMode={isInspectMode}
              zoomLevel={2.2}
              pan={pan}
              onPanChange={setPan}
              hintDiffId={hintDiffId}
            />

            {/* 右圖 */}
            <SpotterScene
              scene={currentScene}
              itemStateMap={itemStateMap}
              activeDifferences={activeDifferences}
              isLeft={false}
              spotlightDiffId={spotlightDiffId}
              solvedDiffIds={solvedDiffIds}
              onDifferenceClicked={handleDifferenceClicked}
              onMissClicked={handleMissClicked}
              missRipples={missRipples}
              isInspectMode={isInspectMode}
              zoomLevel={2.2}
              pan={pan}
              onPanChange={setPan}
              hintDiffId={hintDiffId}
            />
          </div>

          {/* 下方單字庫 (Word Bank) */}
          <div ref={wordBankContainerRef} className="w-full">
            <SpotterWordBank
              spotlightDiff={activeSpotlightDiff}
              wordOptions={wordBankOptions}
              activeDifferences={activeDifferences}
              solvedDiffIds={solvedDiffIds}
              onWordMatchSuccess={handleWordMatchSuccess}
              onWordMatchFail={handleWordMatchFail}
            />
          </div>
        </>
      )}

      {/* ── 彈窗 0：提示確認對話框 (Hint Confirmation) ── */}
      {showHintConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <GlassCard className="max-w-md w-full p-6 text-center relative overflow-hidden border-2 border-amber-400/80 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Lightbulb className="w-8 h-8 animate-pulse text-amber-400" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-800 dark:text-white mb-2">
              💡 鷹眼神探線索提示
            </h3>

            <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              是否消耗 <span className="text-rose-500 font-black">1 顆愛心 ❤️</span>，由鷹眼神探在雙圖以顯眼霓虹光環圈出 1 處未尋獲的相異點？
            </p>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-xs font-bold text-amber-800 dark:text-amber-300 mb-5 flex items-center justify-center gap-3">
              <span>現有愛心：<strong className="text-rose-500">❤️ x {lives}</strong></span>
              <span>➔</span>
              <span>提示後：<strong className="text-rose-400">❤️ x {lives - 1}</strong></span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Button3D
                variant="slate"
                size="md"
                onClick={() => setShowHintConfirmModal(false)}
                className="w-full text-xs sm:text-sm"
              >
                再自己找找
              </Button3D>

              <Button3D
                variant="amber"
                size="md"
                onClick={handleConfirmHint}
                icon={Lightbulb}
                className="w-full text-xs sm:text-sm shadow-amber-500/30"
              >
                確定消耗 1❤️
              </Button3D>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ── 彈窗 1：通關大捷勝利結算 (Victory) ── */}
      {gameState === 'victory' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <GlassCard className="max-w-md w-full p-6 sm:p-8 text-center relative overflow-hidden border-2 border-amber-400 shadow-2xl max-h-[92dvh] overflow-y-auto">
            <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-amber-400 mx-auto mb-2 animate-bounce" />

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-black mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>鷹眼破案 • 5 大相異處全數尋獲</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black font-heading text-slate-800 dark:text-white mb-1">
              🎉 鷹眼破案成功！
            </h2>
            <p className="text-xs font-bold text-slate-400 mb-4">
              過關耗時 <span className="text-amber-400 font-black text-base">{formattedTime}</span> • 剩餘愛心 <span className="text-rose-500 font-black text-base">❤️ x {lives}</span>
            </p>

            {/* 提報 Top 50 榮譽榜 */}
            <div className="mb-5 text-left">
              <HonorSubmissionCard
                mode="spotter"
                book={qualifyingBook || currentScene.book || '1'}
                score={lives}
                time={Math.round(elapsedMs / 1000)}
                totalCount={totalCount}
                rangeText={`第 ${currentScene.book} 冊 - ${currentScene.titleZh}`}
                reviewWords={activeDifferences.map(d => ({
                  id: d.id,
                  en: d.word,
                  zh: d.wordZh,
                  isMistake: false
                }))}
              />
            </div>

            <div className="space-y-2.5">
              <Button3D
                variant="amber"
                size="md"
                onClick={handleRestart}
                icon={RefreshCw}
                className="w-full"
              >
                換一組隨機題目挑戰 🎲
              </Button3D>

              <Button3D
                variant="slate"
                size="md"
                onClick={onBack}
                icon={ArrowLeft}
                className="w-full"
              >
                返回大廳
              </Button3D>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ── 彈窗 2：挑戰失敗 (Failed) ── */}
      {gameState === 'failed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <GlassCard className="max-w-md w-full p-6 sm:p-8 text-center relative overflow-hidden border-2 border-rose-500 shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-3 text-3xl">
              💔
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-black mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>愛心已耗盡</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-800 dark:text-white mb-2">
              挑戰失敗 (Failed)
            </h2>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              本次探查已破解 <strong className="text-amber-500">{solvedDiffIds.size} / {totalCount}</strong> 處差異。<br />
              深呼吸一口氣，聚精會神，再來一次定能通關！
            </p>

            <div className="space-y-2.5">
              <Button3D
                variant="rose"
                size="md"
                onClick={handleRestart}
                icon={RefreshCw}
                className="w-full"
              >
                重新挑戰 ❤️
              </Button3D>

              <Button3D
                variant="slate"
                size="md"
                onClick={onBack}
                icon={ArrowLeft}
                className="w-full"
              >
                返回單字學習館
              </Button3D>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
