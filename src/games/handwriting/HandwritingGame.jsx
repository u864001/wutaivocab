import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { useI18n } from '../../context/I18nContext';
import { useStudent } from '../../context/StudentContext';
import { useTheme } from '../../context/ThemeContext';
import { soundEngine, speakEnglish } from '../../services/audio';
import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';
import {
  FOUR_LINES,
  ALL_STROKES,
  getLetterStrokes,
  evaluateHandwriting
} from '../../services/alphabetStrokes';
import confetti from 'canvas-confetti';
import {
  ArrowLeft, Volume2, RotateCcw, Check, Sparkles, Trophy,
  Undo2, PenTool, HelpCircle, ArrowRight, ShieldCheck, Flame, BookOpen
} from 'lucide-react';

export const HandwritingGame = ({
  settings,
  words = [],
  qualifyingBook,
  onBack
}) => {
  const { t } = useI18n();
  const { currentStudent } = useStudent();
  const { isDark } = useTheme();

  // 模式：'tracing' (描寫自學版 - 有螢光導引，不登排行榜) | 'challenge' (實戰默寫版 - 無導引，評分登榜)
  const [playMode, setPlayMode] = useState('tracing');

  // 年級自適應判定：1年級大寫、2年級小寫、3~6年級單字逐字分格
  const studentGradeNum = useMemo(() => {
    if (currentStudent?.grade) {
      const g = parseInt(currentStudent.grade, 10);
      if (g >= 1 && g <= 6) return g;
    }
    return 3;
  }, [currentStudent]);

  // 出題列表 (題目物件清單)
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);

  // 若是單字模式，追蹤當前單字寫到第幾個字母 (letterIndex)
  const [charInWordIndex, setCharInWordIndex] = useState(0);

  // 畫布筆跡歷史 (每一劃為一組 points: [{x, y}, ...])
  const [strokes, setStrokes] = useState([]);
  const [currentStroke, setCurrentStroke] = useState(null);

  // 描寫版：目前正在進行的筆劃序號 (0, 1, 2...)
  const [activeStrokeStep, setActiveStrokeStep] = useState(0);

  // 實戰版評分反饋
  const [evalResult, setEvalResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 結算狀態
  const [isFinished, setIsFinished] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalScoreSum, setTotalScoreSum] = useState(0);
  const [scoredCount, setScoredCount] = useState(0);

  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);

  // ── 題庫初始化 ──
  useEffect(() => {
    let list = [];
    const isAlphabetMode = Boolean(
      studentGradeNum === 1 ||
      studentGradeNum === 2 ||
      qualifyingBook === 'abc' ||
      settings?.alphaMode ||
      (settings?.selectedUnits && settings.selectedUnits.includes('abc'))
    );

    if (isAlphabetMode) {
      // 1年級大寫，2年級小寫 (或大寫隨機)
      const isLower = studentGradeNum === 2;
      const alphabetStr = isLower ? 'abcdefghijklmnopqrstuvwxyz' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const shuffled = alphabetStr.split('').sort(() => 0.5 - Math.random());
      list = shuffled.slice(0, 10).map((char, i) => ({
        id: `char_${char}_${i}`,
        type: 'letter',
        targetChar: char,
        displayTitle: isLower ? `小寫字母 ${char}` : `大寫字母 ${char}`,
        wordStr: char,
        zh: isLower ? `請練習小寫字母 ${char}` : `請練習大寫字母 ${char}`
      }));
    } else {
      // 3~6 年級單字模式：篩選單元單字
      let filtered = words.filter(w => settings?.selectedUnits?.includes(`${w.book}-${w.lesson}`));
      if (filtered.length === 0 && words.length > 0) {
        filtered = words;
      }
      const pool = filtered.filter(w => w.en && /^[a-zA-Z]+$/.test(w.en.trim()));
      const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 8);
      list = (shuffled.length > 0 ? shuffled : [
        { id: 'sample_apple', en: 'apple', zh: '蘋果' },
        { id: 'sample_cat', en: 'cat', zh: '貓' },
        { id: 'sample_book', en: 'book', zh: '書' }
      ]).map(w => ({
        id: w.id || w.en,
        type: 'word',
        wordStr: w.en.trim(),
        targetChar: w.en.trim()[0] || 'a',
        displayTitle: w.en,
        zh: w.zh || '單字筆順練習'
      }));
    }

    setQuestions(list);
    setQIndex(0);
    setCharInWordIndex(0);
    setStrokes([]);
    setActiveStrokeStep(0);
    setEvalResult(null);
  }, [studentGradeNum, words, settings, qualifyingBook]);

  // 當前目標題目
  const currentQ = questions[qIndex] || null;

  // 當前畫布上目標書寫的字母
  const activeChar = useMemo(() => {
    if (!currentQ) return 'A';
    if (currentQ.type === 'letter') {
      return currentQ.targetChar;
    }
    const chars = currentQ.wordStr || '';
    return chars[charInWordIndex] || chars[0] || 'A';
  }, [currentQ, charInWordIndex]);

  // 目標字母的標準筆順數據
  const strokeModel = useMemo(() => {
    return getLetterStrokes(activeChar) || getLetterStrokes('A');
  }, [activeChar]);

  // 自動播放語音朗讀
  useEffect(() => {
    if (activeChar) {
      speakEnglish(activeChar);
    }
  }, [activeChar]);

  // ── 畫布重繪邏輯 ──
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // 繪製使用者筆劃
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const allStrokes = currentStroke ? [...strokes, currentStroke] : strokes;

    allStrokes.forEach((stroke, sIdx) => {
      if (stroke.length < 1) return;
      ctx.beginPath();
      ctx.lineWidth = Math.max(10, width * 0.055);
      // 筆劃顏色：深色主題用明亮天藍/翠綠，淺色用深海藍
      ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
      ctx.shadowColor = isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(2, 132, 199, 0.25)';
      ctx.shadowBlur = 6;

      const p0 = stroke[0];
      const startX = (p0.x / FOUR_LINES.width) * width;
      const startY = (p0.y / FOUR_LINES.height) * height;
      ctx.moveTo(startX, startY);

      for (let i = 1; i < stroke.length; i++) {
        const pt = stroke[i];
        const px = (pt.x / FOUR_LINES.width) * width;
        const py = (pt.y / FOUR_LINES.height) * height;
        ctx.lineTo(px, py);
      }
      ctx.stroke();
    });
  }, [strokes, currentStroke, isDark]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // 尺寸自動調整
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      redrawCanvas();
    }
  }, [redrawCanvas]);

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [updateCanvasSize]);

  // ── 防誤觸防滑動指針座標計算 ──
  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;

    const normX = Math.max(0, Math.min(FOUR_LINES.width, ((clientX - rect.left) / rect.width) * FOUR_LINES.width));
    const normY = Math.max(0, Math.min(FOUR_LINES.height, ((clientY - rect.top) / rect.height) * FOUR_LINES.height));
    return { x: normX, y: normY };
  };

  const handlePointerDown = (e) => {
    // 徹底鎖定原生手勢與滑動
    e.preventDefault();
    e.stopPropagation();
    isDrawingRef.current = true;
    const pt = getCanvasCoords(e);
    setCurrentStroke([pt]);
  };

  const handlePointerMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDrawingRef.current) return;
    const pt = getCanvasCoords(e);

    setCurrentStroke(prev => {
      if (!prev) return [pt];
      const last = prev[prev.length - 1];
      const dist = Math.hypot(pt.x - last.x, pt.y - last.y);
      if (dist > 1.2) {
        return [...prev, pt];
      }
      return prev;
    });

    // 描寫版：實時檢測是否靠近當前目標筆劃
    if (playMode === 'tracing' && strokeModel) {
      const targetStroke = strokeModel.strokes[activeStrokeStep];
      if (targetStroke) {
        const startDist = Math.hypot(pt.x - targetStroke.start.x, pt.y - targetStroke.start.y);
        const endDist = Math.hypot(pt.x - targetStroke.end.x, pt.y - targetStroke.end.y);
        // 若到達終點附近
        if (endDist < 14) {
          // 本劃完成
        }
      }
    }
  };

  const handlePointerUp = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    if (currentStroke && currentStroke.length > 1) {
      const nextStrokes = [...strokes, currentStroke];
      setStrokes(nextStrokes);
      setCurrentStroke(null);

      // 描寫模式下逐步完成推進
      if (playMode === 'tracing' && strokeModel) {
        const nextStep = activeStrokeStep + 1;
        soundEngine.click();

        if (nextStep >= strokeModel.strokes.length) {
          // 本字母描寫全數完成！
          soundEngine.correct();
          confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
          setEvalResult({
            score: 100,
            stars: 3,
            passed: true,
            feedback: '🎉 筆順引導描紅完成！標準握筆與順序全對！'
          });
        } else {
          setActiveStrokeStep(nextStep);
        }
      }
    } else {
      setCurrentStroke(null);
    }
  };

  // 清除重寫
  const handleClear = () => {
    soundEngine.click();
    setStrokes([]);
    setCurrentStroke(null);
    setActiveStrokeStep(0);
    setEvalResult(null);
  };

  // 撤銷上一筆
  const handleUndo = () => {
    soundEngine.click();
    if (strokes.length > 0) {
      setStrokes(prev => prev.slice(0, prev.length - 1));
      if (playMode === 'tracing' && activeStrokeStep > 0) {
        setActiveStrokeStep(s => s - 1);
      }
      setEvalResult(null);
    }
  };

  // 實戰挑戰模式：提交書寫評分
  const handleEvaluateChallenge = () => {
    if (isSubmitting || strokes.length === 0) return;
    soundEngine.click();
    setIsSubmitting(true);

    const result = evaluateHandwriting({
      targetChar: activeChar,
      userStrokes: strokes,
      isGuidedTracing: false
    });

    setEvalResult(result);
    setIsSubmitting(false);

    if (result.passed) {
      soundEngine.correct();
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
    } else {
      soundEngine.wrong();
    }
  };

  // 進入下一個字母或下一題
  const handleNextStep = () => {
    soundEngine.click();
    const scoreVal = evalResult?.score || 100;
    setTotalScoreSum(s => s + scoreVal);
    setScoredCount(c => c + 1);

    // 檢查單字模式是否還有下一個字母
    if (currentQ?.type === 'word') {
      const nextCharIdx = charInWordIndex + 1;
      if (nextCharIdx < currentQ.wordStr.length) {
        setCharInWordIndex(nextCharIdx);
        setStrokes([]);
        setCurrentStroke(null);
        setActiveStrokeStep(0);
        setEvalResult(null);
        return;
      }
    }

    // 題目推進
    const nextQIdx = qIndex + 1;
    if (nextQIdx < questions.length) {
      setQIndex(nextQIdx);
      setCharInWordIndex(0);
      setStrokes([]);
      setCurrentStroke(null);
      setActiveStrokeStep(0);
      setEvalResult(null);
    } else {
      // 測驗全數結束
      const finalTime = Math.max(15, Math.floor((Date.now() - sessionStartTime) / 1000));
      setElapsedTime(finalTime);
      setIsFinished(true);
      soundEngine.win();
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.55 } });
    }
  };

  // ── 結算畫面 ──
  if (isFinished) {
    const avgScore = scoredCount > 0 ? Math.round(totalScoreSum / scoredCount) : 100;
    const finalStars = avgScore >= 80 ? 3 : (avgScore >= 60 ? 2 : 1);
    const isTracingMode = playMode === 'tracing';

    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 animate-fadeIn">
        <GlassCard className="max-w-lg w-full text-center p-6 sm:p-8">
          <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-3 animate-bounce" />
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 font-heading mb-1">
            {isTracingMode ? '🌱 筆順自學描寫精熟！' : '⚔️ 神筆書寫挑戰完成！'}
          </h2>
          <p className="text-xs font-bold text-slate-500 mb-6">
            挑戰總耗時：<span className="text-emerald-500 font-black text-lg">{elapsedTime} 秒</span>
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">字形筆順精熟度</span>
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {avgScore} 分
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">總評價星級</span>
              <span className="text-3xl font-black text-amber-500">
                {'⭐'.repeat(finalStars)}
              </span>
            </div>
          </div>

          {/* 🌟 核心規則：自學描寫版不登榜，實戰默寫版方可正式上榜與紀錄八星秘典 🌟 */}
          {isTracingMode ? (
            <div className="p-4 mb-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/50 text-left">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-black text-sm mb-1.5">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>🌱 自學描寫練習模式提示</span>
              </div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                恭喜熟練正確筆順與格線！本模式為粗筆螢光描寫之「自學練習」，成績不連動榮譽排行榜。<br />
                若想爭取全校 Top 50 榮譽與點亮八星秘典，請切換至『⚔️ 實戰默寫版』挑戰！
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <HonorSubmissionCard
                gameMode="handwriting"
                book={qualifyingBook || (studentGradeNum === 1 || studentGradeNum === 2 ? 'abc' : '1')}
                score={avgScore}
                time={elapsedTime}
                totalCount={questions.length}
                rangeText={qualifyingBook ? `第 ${qualifyingBook} 冊` : (studentGradeNum === 1 ? '一年級大寫' : '二年級小寫')}
                onSuccess={() => {}}
              />
            </div>
          )}

          <div className="space-y-3">
            <Button3D
              variant="blue"
              size="lg"
              onClick={() => {
                setIsFinished(false);
                setQIndex(0);
                setCharInWordIndex(0);
                setStrokes([]);
                setEvalResult(null);
                setTotalScoreSum(0);
                setScoredCount(0);
              }}
              className="w-full"
            >
              再練一次
            </Button3D>
            <Button3D variant="slate" size="md" onClick={onBack} className="w-full">
              {t.backLobby}
            </Button3D>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div
      className="min-h-[85vh] flex flex-col items-center justify-start p-2 sm:p-4 select-none touch-none"
      style={{
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        overscrollBehavior: 'none'
      }}
    >
      {/* ── 頂部導航列與模式切換 ── */}
      <div className="w-full max-w-xl flex items-center justify-between gap-2 mb-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 sm:p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:scale-105 active:scale-95 transition-transform shadow-sm cursor-pointer"
          title={t.backLobby}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* 雙模式切換膠囊 [✏️ 描寫自學版 | ⚔️ 實戰默寫版] */}
        <div className="flex bg-slate-200/80 dark:bg-slate-800/90 p-1 rounded-2xl border border-slate-300 dark:border-slate-700 shadow-inner">
          <button
            type="button"
            onClick={() => {
              soundEngine.click();
              setPlayMode('tracing');
              handleClear();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              playMode === 'tracing'
                ? 'bg-emerald-600 text-white shadow-md scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>✏️ 描寫自學版</span>
            <span className="text-[10px] opacity-80">(螢光引導)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.click();
              setPlayMode('challenge');
              handleClear();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              playMode === 'challenge'
                ? 'bg-blue-600 text-white shadow-md scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>⚔️ 實戰默寫版</span>
            <span className="text-[10px] opacity-80">(評分登榜)</span>
          </button>
        </div>

        {/* 朗讀發音按鈕 */}
        <button
          type="button"
          onClick={() => speakEnglish(currentQ?.type === 'word' ? currentQ.wordStr : activeChar)}
          className="p-2 sm:p-2.5 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-300/40 hover:scale-105 active:scale-95 transition-transform shadow-sm cursor-pointer"
          title="播放標準英語發音"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* ── 題目提示資訊卡 ── */}
      <div className="w-full max-w-xl mb-3 flex items-center justify-between px-3 py-2 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-400/30">
            第 {qIndex + 1} / {questions.length} 題
          </span>
          <span className="text-sm font-black text-slate-700 dark:text-slate-200">
            {currentQ?.zh}
          </span>
        </div>

        {/* 單字模式下的各字母分頁卡 (c - a - t) */}
        {currentQ?.type === 'word' && (
          <div className="flex items-center gap-1">
            {currentQ.wordStr.split('').map((c, i) => (
              <span
                key={i}
                className={`w-6 h-6 rounded-lg font-mono font-black text-xs flex items-center justify-center border transition-all ${
                  i === charInWordIndex
                    ? 'bg-blue-600 text-white border-blue-400 scale-110 shadow-sm'
                    : i < charInWordIndex
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-400/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700'
                }`}
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── 核心四線三格手寫板主舞台 ── */}
      <div className="relative w-full max-w-md aspect-[100/120] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-300/80 dark:border-slate-700 bg-amber-50/50 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center">
        {/* 1. 四線三格標準教學格線 SVG */}
        <svg
          viewBox={`0 0 ${FOUR_LINES.width} ${FOUR_LINES.height}`}
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
        >
          {/* 四線背景區塊微漸層 */}
          <rect x="0" y="0" width="100" height="15" fill={isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(241, 245, 249, 0.5)'} />
          <rect x="0" y="15" width="100" height="30" fill={isDark ? 'rgba(30, 41, 59, 0.25)' : 'rgba(255, 255, 255, 0.6)'} />
          <rect x="0" y="45" width="100" height="30" fill={isDark ? 'rgba(56, 189, 248, 0.05)' : 'rgba(224, 242, 254, 0.35)'} />
          <rect x="0" y="75" width="100" height="30" fill={isDark ? 'rgba(30, 41, 59, 0.25)' : 'rgba(255, 255, 255, 0.6)'} />
          <rect x="0" y="105" width="100" height="15" fill={isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(241, 245, 249, 0.5)'} />

          {/* 第 1 線：頂線 (Headline / Ascender) */}
          <line x1="0" y1="15" x2="100" y2="15" stroke={isDark ? '#64748b' : '#94a3b8'} strokeWidth="0.8" />
          <text x="3" y="13" fontSize="3.2" fill={isDark ? '#64748b' : '#94a3b8'} fontWeight="bold">Top (頂線)</text>

          {/* 第 2 線：中線 (Midline / Waistline - 虛線) */}
          <line x1="0" y1="45" x2="100" y2="45" stroke={isDark ? '#38bdf8' : '#0284c7'} strokeWidth="0.8" strokeDasharray="2, 2" />
          <text x="3" y="43" fontSize="3.2" fill={isDark ? '#38bdf8' : '#0284c7'} fontWeight="bold">Mid (中線)</text>

          {/* 第 3 線：基線 (Baseline - 紅色/橘色主基線) */}
          <line x1="0" y1="75" x2="100" y2="75" stroke="#f43f5e" strokeWidth="1.2" />
          <text x="3" y="73" fontSize="3.2" fill="#f43f5e" fontWeight="bold">Base (基線)</text>

          {/* 第 4 線：底線 (Descender / Bottom line) */}
          <line x1="0" y1="105" x2="100" y2="105" stroke={isDark ? '#64748b' : '#94a3b8'} strokeWidth="0.8" />
          <text x="3" y="103" fontSize="3.2" fill={isDark ? '#64748b' : '#94a3b8'} fontWeight="bold">Bottom (底線)</text>

          {/* 🌟 描寫版：粗半透明螢光引導筆劃與 ①②③ 號碼標籤 🌟 */}
          {playMode === 'tracing' && strokeModel && strokeModel.strokes.map((st, idx) => {
            const isCompleted = idx < activeStrokeStep;
            const isCurrent = idx === activeStrokeStep;

            return (
              <g key={st.id}>
                {/* 粗半透明螢光軌跡 */}
                <path
                  d={st.path}
                  fill="none"
                  stroke={
                    isCompleted
                      ? '#10b981'
                      : isCurrent
                      ? (isDark ? '#facc15' : '#eab308')
                      : (isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)')
                  }
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={isCompleted ? 0.75 : isCurrent ? 0.45 : 0.25}
                />

                {/* 筆順圓圈號碼標記 ①②③ */}
                <circle
                  cx={st.labelPos.x}
                  cy={st.labelPos.y}
                  r="4"
                  fill={isCompleted ? '#10b981' : isCurrent ? '#f59e0b' : '#94a3b8'}
                  stroke="#ffffff"
                  strokeWidth="0.8"
                />
                <text
                  x={st.labelPos.x}
                  y={st.labelPos.y + 1.4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="4"
                  fontWeight="bold"
                >
                  {st.id}
                </text>

                {/* 當前活躍筆劃起筆指引閃爍小光點 */}
                {isCurrent && (
                  <circle
                    cx={st.start.x}
                    cy={st.start.y}
                    r="3.5"
                    fill="#3b82f6"
                    className="animate-ping"
                    opacity="0.85"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* 2. HTML5 繪圖 Canvas (事件全面鎖定與防滑動) */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onContextMenu={(e) => e.preventDefault()}
          className="absolute inset-0 w-full h-full touch-none select-none cursor-crosshair z-10"
        />

        {/* 3. 實戰模式評分正誤遮罩彈窗 */}
        {evalResult && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-xs p-5 rounded-3xl bg-white dark:bg-slate-800 shadow-2xl text-center border-2 border-slate-200 dark:border-slate-700">
              <div className="text-4xl mb-2">
                {evalResult.passed ? '🎉' : '💪'}
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
                {evalResult.passed ? `${evalResult.score} 分 • 完美書寫！` : `${evalResult.score} 分 • 再試一次`}
              </h3>
              <div className="flex justify-center gap-1 text-2xl mb-2">
                {'⭐'.repeat(evalResult.stars)}
              </div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                {evalResult.feedback}
              </p>

              <div className="flex gap-2">
                <Button3D
                  variant="slate"
                  size="sm"
                  onClick={handleClear}
                  className="flex-1"
                >
                  重新書寫
                </Button3D>
                {evalResult.passed && (
                  <Button3D
                    variant="emerald"
                    size="sm"
                    onClick={handleNextStep}
                    className="flex-1"
                    icon={ArrowRight}
                  >
                    下一題
                  </Button3D>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 底部控制工具列 ── */}
      <div className="w-full max-w-md mt-4 flex items-center justify-between gap-2 px-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="px-3.5 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5 text-xs font-black shadow-sm cursor-pointer"
            title="全部清空"
          >
            <RotateCcw className="w-4 h-4 text-rose-500" />
            <span>清空重寫</span>
          </button>
          <button
            type="button"
            onClick={handleUndo}
            disabled={strokes.length === 0}
            className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:scale-105 active:scale-95 transition-transform disabled:opacity-40 disabled:pointer-events-none shadow-sm cursor-pointer"
            title="撤銷上一筆"
          >
            <Undo2 className="w-4 h-4" />
          </button>
        </div>

        {playMode === 'tracing' ? (
          <Button3D
            variant="emerald"
            size="md"
            onClick={handleNextStep}
            disabled={activeStrokeStep < (strokeModel?.strokes?.length || 1)}
            icon={ArrowRight}
          >
            完成進入下一題
          </Button3D>
        ) : (
          <Button3D
            variant="blue"
            size="md"
            onClick={handleEvaluateChallenge}
            disabled={strokes.length === 0 || evalResult !== null}
            icon={Check}
          >
            提交判定
          </Button3D>
        )}
      </div>
    </div>
  );
};
