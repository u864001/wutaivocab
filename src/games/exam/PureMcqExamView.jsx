import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Flag,
  Volume2,
  RotateCcw,
  Award,
  BookOpen,
  ClipboardCheck,
  Sparkles,
  CheckSquare,
  Square,
  HelpCircle,
  Filter
} from 'lucide-react';
import { HERE_WE_GO_BOOK_META, HERE_WE_GO_MCQ_BANK } from '../../data/hereWeGoMcqBank';
import { soundEngine } from '../../services/audio';
import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';

const CHOICE_LABELS = ['A', 'B', 'C', 'D'];
const formatBookLabel = (bNum) => (Number(bNum) === 9 ? '國一先修' : `第 ${bNum} 冊`);

/**
 * 將 A: ... B: ... 對話題幹自動分行呈現，提升學生閱讀清晰度
 */
function formatQuestionStem(text) {
  const str = String(text || '').trim();
  if (/\bA:\s*/.test(str) && /\bB:\s*/.test(str)) {
    const parts = str.split(/(?=\bB:\s*)/);
    return (
      <div className="space-y-2.5">
        {parts.map((p, idx) => (
          <div key={idx} className="leading-relaxed">
            {p.trim()}
          </div>
        ))}
      </div>
    );
  }
  return <div className="leading-relaxed">{str}</div>;
}

export function PureMcqExamView({ settings, onBack, onComplete }) {
  // 根據外部 Lobby 選擇的冊別給予預設冊別（預設第 1 冊或由 settings 推斷）
  const initialBook = useMemo(() => {
    const units = settings?.selectedUnits || [];
    for (const u of units) {
      const m = String(u).match(/Book\s*(\d+)|HWG\s*(\d+)|第\s*(\d+)\s*冊/i);
      if (m) {
        const num = Number(m[1] || m[2] || m[3]);
        if (num >= 1 && num <= 9) return num;
      }
    }
    return 1;
  }, [settings?.selectedUnits]);

  // Phase: 'setup' | 'exam' | 'result'
  const [phase, setPhase] = useState('setup');
  const [selectedBook, setSelectedBook] = useState(initialBook);
  const [selectedUnits, setSelectedUnits] = useState(() => HERE_WE_GO_BOOK_META[initialBook]?.units || []);
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'grammar' | 'dialogue'
  const [questionCountOpt, setQuestionCountOpt] = useState(10); // 10 | 20 | 25 | 'all'
  const [examMode, setExamMode] = useState('exam'); // 'exam' (交卷才看分數) | 'practice' (即時看詳解)
  const [autoAdvance, setAutoAdvance] = useState(false); // 考卷模式下點選選項後是否自動跳下一題

  // Exam Runtime States
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qIndex]: choiceIdx }
  const [flagged, setFlagged] = useState({}); // { [qIndex]: boolean }
  const [practiceRevealed, setPracticeRevealed] = useState({}); // { [qIndex]: boolean }
  const [startTime, setStartTime] = useState(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [reviewFilter, setReviewFilter] = useState('all'); // 'all' | 'wrong'
  const [showUnansweredConfirm, setShowUnansweredConfirm] = useState(false);

  // 切換冊別時預設全選該冊所有單元
  const handleSelectBook = (bookNum) => {
    soundEngine.click();
    setSelectedBook(bookNum);
    setSelectedUnits(HERE_WE_GO_BOOK_META[bookNum]?.units || []);
  };

  const toggleUnit = (unitName) => {
    soundEngine.click();
    setSelectedUnits((prev) =>
      prev.includes(unitName) ? prev.filter((u) => u !== unitName) : [...prev, unitName]
    );
  };

  // 計算當前篩選範圍內的可用題庫
  const availablePool = useMemo(() => {
    return HERE_WE_GO_MCQ_BANK.filter((q) => {
      if (q.book !== selectedBook) return false;
      if (!selectedUnits.includes(q.unit)) return false;
      if (categoryFilter !== 'all' && q.category !== categoryFilter) return false;
      return true;
    });
  }, [selectedBook, selectedUnits, categoryFilter]);

  // 各單元題數統計
  const unitCounts = useMemo(() => {
    const counts = {};
    for (const q of HERE_WE_GO_MCQ_BANK) {
      if (q.book === selectedBook) {
        if (categoryFilter === 'all' || q.category === categoryFilter) {
          counts[q.unit] = (counts[q.unit] || 0) + 1;
        }
      }
    }
    return counts;
  }, [selectedBook, categoryFilter]);

  // 計時器（僅作為作答時間紀錄，無倒數壓力）
  useEffect(() => {
    if (phase !== 'exam' || !startTime) return;
    const timer = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, startTime]);

  // 啟動測驗
  const startExamWithPool = useCallback(
    (pool, targetCount) => {
      if (!pool || pool.length === 0) return;
      soundEngine.click();
      // Fisher-Yates 洗牌題目與選項順序
      const shuffled = [...pool];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const limit = targetCount === 'all' ? shuffled.length : Math.min(Number(targetCount) || 10, shuffled.length);
      const picked = shuffled.slice(0, limit).map((q) => {
        const correctOptText = q.options[q.answer];
        const opts = [...q.options];
        for (let i = opts.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [opts[i], opts[j]] = [opts[j], opts[i]];
        }
        return {
          ...q,
          options: opts,
          answer: opts.indexOf(correctOptText)
        };
      });

      setQuestions(picked);
      setCurrentIndex(0);
      setAnswers({});
      setFlagged({});
      setPracticeRevealed({});
      setStartTime(Date.now());
      setElapsedSec(0);
      setShowUnansweredConfirm(false);
      setReviewFilter('all');
      setPhase('exam');
    },
    []
  );

  const handleStartExam = () => {
    startExamWithPool(availablePool, questionCountOpt);
  };

  // 語音朗讀題幹（排除底線符號）
  const speakQuestion = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const clean = String(text || '')
        .replace(/_{2,}/g, ' blank ')
        .replace(/\bA:\s*/g, '')
        .replace(/\bB:\s*/g, '');
      const utter = new SpeechSynthesisUtterance(clean);
      utter.lang = 'en-US';
      utter.rate = 0.9;
      window.speechSynthesis.speak(utter);
    } catch {
      // Ignore TTS errors
    }
  };

  // 點選選項
  const handleSelectOption = (optIdx) => {
    const isPractice = examMode === 'practice';
    if (isPractice && practiceRevealed[currentIndex]) {
      return; // 練習模式已公佈答案後不再變更
    }

    setAnswers((prev) => ({ ...prev, [currentIndex]: optIdx }));

    if (isPractice) {
      setPracticeRevealed((prev) => ({ ...prev, [currentIndex]: true }));
      const currentQ = questions[currentIndex];
      if (currentQ && optIdx === currentQ.answer) {
        soundEngine.correct();
      } else {
        soundEngine.wrong();
      }
    } else {
      soundEngine.click();
      if (autoAdvance && currentIndex < questions.length - 1) {
        setTimeout(() => {
          setCurrentIndex((idx) => Math.min(questions.length - 1, idx + 1));
        }, 180);
      }
    }
  };

  const toggleFlagCurrent = () => {
    soundEngine.click();
    setFlagged((prev) => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  // 交卷結算
  const finalizeExam = useCallback(() => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) correctCount++;
    });
    const total = questions.length || 1;
    const finalScore = Math.round((correctCount / total) * 100);
    soundEngine.win();
    setShowUnansweredConfirm(false);
    setPhase('result');
    if (typeof onComplete === 'function') {
      onComplete(finalScore, {
        mode: 'pure-mcq',
        book: selectedBook,
        correctCount,
        totalQuestions: total,
        elapsedSec
      });
    }
  }, [questions, answers, onComplete, selectedBook, elapsedSec]);

  const handleRequestSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      setShowUnansweredConfirm(true);
    } else {
      finalizeExam();
    }
  };

  // 鍵盤快捷鍵支援 (1~4 / A~D 選答案，左右方向鍵切換上一題/下一題)
  useEffect(() => {
    if (phase !== 'exam') return;
    const onKeyDown = (e) => {
      if (showUnansweredConfirm) return;
      const key = e.key.toUpperCase();
      const currentQ = questions[currentIndex];
      if (!currentQ) return;
      if (['1', 'A'].includes(key) && currentQ.options.length >= 1) {
        handleSelectOption(0);
      } else if (['2', 'B'].includes(key) && currentQ.options.length >= 2) {
        handleSelectOption(1);
      } else if (['3', 'C'].includes(key) && currentQ.options.length >= 3) {
        handleSelectOption(2);
      } else if (['4', 'D'].includes(key) && currentQ.options.length >= 4) {
        handleSelectOption(3);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex((i) => i - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  // ============================================================================
  // PHASE 1: 設定測驗範圍與題數 (Setup View)
  // ============================================================================
  if (phase === 'setup') {
    const bookMeta = HERE_WE_GO_BOOK_META[selectedBook] || HERE_WE_GO_BOOK_META[1];
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 py-6 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-sm transition"
              >
                <ArrowLeft size={18} />
                返回大廳
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ClipboardCheck className="text-indigo-600 dark:text-indigo-400" size={26} />
                  課本選擇題庫檢定專區
                </h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                  一頁一題無干擾作答 • 涵蓋 Here We Go 第 1～8 冊與國一先修各單元文法選擇、情境對話類題
                </p>
              </div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-sm font-bold">
              目前範圍可用題庫：<span className="text-lg font-black">{availablePool.length}</span> 題
            </div>
          </div>

          {/* Step 1: 選擇冊別 */}
          <div className="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base md:text-lg font-black flex items-center gap-2 text-slate-800 dark:text-white">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-black">
                  1
                </span>
                選擇冊別 (第 1～8 冊 / 國一先修)
              </h2>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {bookMeta.subtitle}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((bNum) => {
                const isSelected = selectedBook === bNum;
                const totalInBook = HERE_WE_GO_MCQ_BANK.filter((q) => q.book === bNum).length;
                return (
                  <button
                    key={bNum}
                    onClick={() => handleSelectBook(bNum)}
                    className={`p-3 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-md scale-[1.02]'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:border-indigo-300 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span className="text-sm font-black">{formatBookLabel(bNum)}</span>
                    <span
                      className={`text-[11px] font-semibold ${
                        isSelected ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {totalInBook} 題
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: 選擇單元範圍 */}
          <div className="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base md:text-lg font-black flex items-center gap-2 text-slate-800 dark:text-white">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-black">
                  2
                </span>
                選擇單元範圍 ({bookMeta.title})
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedUnits([...bookMeta.units])}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition"
                >
                  全選本冊
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedUnits(
                      bookMeta.units.filter((u) => ['Starter', 'Unit 1', 'Unit 2', 'Review 1'].includes(u))
                    )
                  }
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                >
                  期中考範圍 (U1~R1)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedUnits(
                      bookMeta.units.filter((u) => ['Unit 3', 'Unit 4', 'Review 2', 'Festival'].includes(u))
                    )
                  }
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                >
                  期末考範圍 (U3~R2)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedUnits([])}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 transition"
                >
                  清除全選
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {bookMeta.units.map((unitName) => {
                const checked = selectedUnits.includes(unitName);
                const count = unitCounts[unitName] || 0;
                return (
                  <button
                    key={unitName}
                    type="button"
                    onClick={() => toggleUnit(unitName)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 text-left transition-all ${
                      checked
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-100 font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {checked ? (
                        <CheckSquare size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                      ) : (
                        <Square size={18} className="text-slate-400 shrink-0" />
                      )}
                      <span className="text-sm font-bold">{unitName}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                      {count} 題
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: 選擇題型、題數與作答模式 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 題型篩選 */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-3">
              <h3 className="text-sm font-black flex items-center gap-2 text-slate-800 dark:text-white">
                <Filter size={16} className="text-indigo-600" />
                3. 選擇題型分類
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'all', label: '🎯 綜合全題型 (文法＋對話)' },
                  { id: 'grammar', label: '📐 文法與句意選擇' },
                  { id: 'dialogue', label: '💬 情境對話選擇' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border-2 text-left text-xs md:text-sm font-bold transition ${
                      categoryFilter === cat.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-200'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 題數選擇 */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-3">
              <h3 className="text-sm font-black flex items-center gap-2 text-slate-800 dark:text-white">
                <BookOpen size={16} className="text-indigo-600" />
                4. 選擇測驗題數
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { val: 10, label: '10 題', sub: '每題 10 分' },
                  { val: 20, label: '20 題', sub: '每題 5 分' },
                  { val: 25, label: '25 題', sub: '每題 4 分' },
                  { val: 'all', label: `全部 (${availablePool.length})`, sub: '完整刷題' }
                ].map((opt) => (
                  <button
                    key={String(opt.val)}
                    type="button"
                    onClick={() => setQuestionCountOpt(opt.val)}
                    className={`p-3 rounded-xl border-2 text-center transition ${
                      questionCountOpt === opt.val
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-200 font-black'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold'
                    }`}
                  >
                    <div className="text-sm">{opt.label}</div>
                    <div className="text-[11px] text-slate-400">{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 作答模式 */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-3">
              <h3 className="text-sm font-black flex items-center gap-2 text-slate-800 dark:text-white">
                <Sparkles size={16} className="text-indigo-600" />
                5. 作答與批改模式
              </h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setExamMode('exam')}
                  className={`w-full p-3 rounded-xl border-2 text-left transition ${
                    examMode === 'exam'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-100'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <div className="text-xs md:text-sm font-black">📝 正式考卷模式 (推薦)</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    無干擾一頁一題，全部寫完交卷才計分與看詳解
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setExamMode('practice')}
                  className={`w-full p-3 rounded-xl border-2 text-left transition ${
                    examMode === 'practice'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-100'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <div className="text-xs md:text-sm font-black">💡 即時詳解練習模式</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    每題選完立即顯示對錯與中文文法解析
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Start CTA */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <label className="flex items-center gap-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoAdvance}
                onChange={(e) => setAutoAdvance(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              考卷模式下，點選答案後自動跳下一題（亦可隨時按上一題修改）
            </label>

            <button
              type="button"
              disabled={availablePool.length === 0}
              onClick={handleStartExam}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black text-base md:text-lg shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2"
            >
              開始作答 ({questionCountOpt === 'all' ? availablePool.length : Math.min(questionCountOpt, availablePool.length)} 題)
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // PHASE 2: 一頁一題無干擾作答區 (Distraction-Free One-Question-Per-Page View)
  // ============================================================================
  if (phase === 'exam') {
    const currentQ = questions[currentIndex];
    const selectedChoice = answers[currentIndex];
    const isFlagged = !!flagged[currentIndex];
    const isPractice = examMode === 'practice';
    const isRevealed = isPractice && !!practiceRevealed[currentIndex];
    const answeredCount = Object.keys(answers).length;

    if (!currentQ) return null;

    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-4 md:py-8 px-3 md:px-6 flex flex-col">
        <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col gap-4">
          {/* Top Minimal Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setPhase('setup')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1 transition"
              >
                <ArrowLeft size={14} />
                重設範圍
              </button>
              <span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-black border border-indigo-200 dark:border-indigo-800">
                {formatBookLabel(currentQ.book)} • {currentQ.unit}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {currentQ.category === 'grammar' ? '文法與句意選擇' : '情境對話選擇'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400">
              <span>已作答：{answeredCount} / {questions.length}</span>
              <span>用時：{formatTime(elapsedSec)}</span>
            </div>
          </div>

          {/* Main One-Question Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-9 flex-1 flex flex-col justify-between space-y-6">
            {/* Question Number & Tools */}
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white font-black text-base md:text-lg">
                    第 {currentIndex + 1} 題
                  </span>
                  <span className="text-xs md:text-sm font-bold text-slate-400">
                    共 {questions.length} 題
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => speakQuestion(currentQ.question)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
                    title="朗讀英文題目"
                  >
                    <Volume2 size={15} />
                    朗讀題幹
                  </button>
                  <button
                    type="button"
                    onClick={toggleFlagCurrent}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
                      isFlagged
                        ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Flag size={14} className={isFlagged ? 'fill-amber-500 text-amber-500' : ''} />
                    {isFlagged ? '已標記待檢查' : '標記待檢查'}
                  </button>
                </div>
              </div>

              {/* Question Stem */}
              <div className="py-2 text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-wide">
                {formatQuestionStem(currentQ.question)}
              </div>

              {/* Choices List */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((optText, optIdx) => {
                  const isChosen = selectedChoice === optIdx;
                  const isCorrectOpt = optIdx === currentQ.answer;

                  let btnStyle =
                    'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 hover:border-indigo-400 hover:bg-indigo-50/30 text-slate-800 dark:text-slate-100';
                  let badgeStyle =
                    'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600';

                  if (isRevealed) {
                    if (isCorrectOpt) {
                      btnStyle =
                        'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-100 font-black';
                      badgeStyle = 'bg-emerald-600 text-white';
                    } else if (isChosen && !isCorrectOpt) {
                      btnStyle =
                        'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-100';
                      badgeStyle = 'bg-rose-600 text-white';
                    }
                  } else if (isChosen) {
                    btnStyle =
                      'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-950 dark:text-white ring-2 ring-indigo-500/30 font-black';
                    badgeStyle = 'bg-indigo-600 text-white';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 md:p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-4 ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-base shrink-0 ${badgeStyle}`}
                        >
                          {CHOICE_LABELS[optIdx]}
                        </span>
                        <span className="text-lg md:text-xl font-bold">{optText}</span>
                      </div>

                      {isRevealed && isCorrectOpt && (
                        <CheckCircle2 className="text-emerald-600 shrink-0" size={24} />
                      )}
                      {isRevealed && isChosen && !isCorrectOpt && (
                        <XCircle className="text-rose-600 shrink-0" size={24} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instant Explanation in Practice Mode */}
              {isRevealed && (
                <div className="mt-4 p-4 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-sm md:text-base text-indigo-950 dark:text-indigo-100 space-y-1">
                  <div className="font-black flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300">
                    <HelpCircle size={18} />
                    文法與語境解析：
                  </div>
                  <p className="leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}
            </div>

            {/* Bottom Prev / Next / Submit Navigation Bar */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => {
                  soundEngine.click();
                  setCurrentIndex((i) => Math.max(0, i - 1));
                }}
                className="px-5 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 font-black text-sm md:text-base flex items-center gap-2 transition"
              >
                <ArrowLeft size={18} />
                上一題
              </button>

              <div className="flex items-center gap-3">
                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.click();
                      setCurrentIndex((i) => Math.min(questions.length - 1, i + 1));
                    }}
                    className="px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm md:text-base shadow-md shadow-indigo-600/20 flex items-center gap-2 transition"
                  >
                    下一題
                    <ArrowRight size={18} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRequestSubmit}
                    className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm md:text-base shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition"
                  >
                    <CheckCircle2 size={18} />
                    完成並交卷計分
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Number Strip (題號快速跳轉列) */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>題號導覽（點擊題號可直接跳至該題檢查）</span>
              {answeredCount === questions.length && (
                <button
                  type="button"
                  onClick={handleRequestSubmit}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-black"
                >
                  全部已作答，點此立即交卷 ➔
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {questions.map((_, idx) => {
                const isCurr = idx === currentIndex;
                const isAns = answers[idx] !== undefined;
                const isFlg = !!flagged[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-9 h-9 rounded-xl text-xs font-black transition relative flex items-center justify-center ${
                      isCurr
                        ? 'ring-2 ring-indigo-600 bg-indigo-600 text-white'
                        : isAns
                          ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {idx + 1}
                    {isFlg && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 border border-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Unanswered Confirmation Modal */}
        {showUnansweredConfirm && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                還有未作答的題目喔！
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                目前共有 <span className="font-black text-rose-600">{questions.length - answeredCount} 題</span> 尚未選擇答案。確定要現在直接交卷計分嗎？
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUnansweredConfirm(false);
                    const firstMissing = questions.findIndex((_, idx) => answers[idx] === undefined);
                    if (firstMissing !== -1) setCurrentIndex(firstMissing);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold"
                >
                  跳至未答題目
                </button>
                <button
                  type="button"
                  onClick={finalizeExam}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black"
                >
                  確定交卷
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // PHASE 3: 交卷成績單與詳解訂正 (Result & Review View)
  // ============================================================================
  const totalQ = questions.length || 1;
  const correctList = questions.filter((q, idx) => answers[idx] === q.answer);
  const wrongList = questions.filter((q, idx) => answers[idx] !== q.answer);
  const score = Math.round((correctList.length / totalQ) * 100);

  const reviewItems = questions
    .map((q, idx) => ({ q, idx, userChoice: answers[idx], isCorrect: answers[idx] === q.answer }))
    .filter((item) => (reviewFilter === 'wrong' ? !item.isCorrect || flagged[item.idx] : true));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 py-6 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Score Banner */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-black">
              <Award size={15} />
              {formatBookLabel(selectedBook)}選擇題檢定成績單
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
              {score === 100
                ? '🎉 滿分全對！太優秀了！'
                : score >= 80
                  ? '👏 表現優異！離滿分只差一步！'
                  : '💪 完成測驗！看看下方詳解把錯題學起來！'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              答對 <span className="font-black text-emerald-600">{correctList.length}</span> / {totalQ} 題 • 作答用時 {formatTime(elapsedSec)}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-28 h-28 rounded-3xl bg-indigo-600 text-white flex flex-col items-center justify-center shadow-lg shadow-indigo-600/25">
              <span className="text-xs font-bold text-indigo-200">總分</span>
              <span className="text-4xl font-black">{score}</span>
              <span className="text-[11px] text-indigo-200">滿分 100</span>
            </div>
          </div>
        </div>

        {/* 榮譽榜登錄與學習金幣獎勵卡 */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <HonorSubmissionCard
            mode="mcq-exam"
            book={String(selectedBook)}
            score={correctList.length}
            time={elapsedSec}
            totalCount={totalQ}
            rangeText={`${formatBookLabel(selectedBook)} (${selectedUnits.join(', ')})`}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setReviewFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition ${
                reviewFilter === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              全部題目 ({questions.length})
            </button>
            <button
              type="button"
              onClick={() => setReviewFilter('wrong')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition ${
                reviewFilter === 'wrong'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-rose-600 border border-rose-200 dark:border-rose-800'
              }`}
            >
              只看錯題與標記 ({wrongList.length})
            </button>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {wrongList.length > 0 && (
              <button
                type="button"
                onClick={() => startExamWithPool(wrongList, 'all')}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs md:text-sm flex items-center gap-1.5 shadow-sm transition"
              >
                <RotateCcw size={16} />
                錯題重練 ({wrongList.length} 題)
              </button>
            )}
            <button
              type="button"
              onClick={() => startExamWithPool(availablePool, questionCountOpt)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs md:text-sm flex items-center gap-1.5 shadow-sm transition"
            >
              <RotateCcw size={16} />
              同範圍再測一次
            </button>
            <button
              type="button"
              onClick={() => setPhase('setup')}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs md:text-sm transition"
            >
              變更範圍與題數
            </button>
          </div>
        </div>

        {/* Detailed Question-by-Question Review List */}
        <div className="space-y-4">
          {reviewItems.map(({ q, idx, userChoice, isCorrect }) => (
            <div
              key={q.id + '_' + idx}
              className={`bg-white dark:bg-slate-800 rounded-2xl p-5 md:p-6 border-2 shadow-sm space-y-4 ${
                isCorrect
                  ? 'border-slate-200 dark:border-slate-700'
                  : 'border-rose-300 dark:border-rose-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-black ${
                      isCorrect
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200'
                    }`}
                  >
                    第 {idx + 1} 題 • {isCorrect ? '✓ 答對' : '✗ 答錯'}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {formatBookLabel(q.book)} • {q.unit}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => speakQuestion(q.question)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                >
                  <Volume2 size={14} />
                  朗讀
                </button>
              </div>

              <div className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
                {formatQuestionStem(q.question)}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((optText, oIdx) => {
                  const isAns = oIdx === q.answer;
                  const isPicked = oIdx === userChoice;
                  return (
                    <div
                      key={oIdx}
                      className={`px-3.5 py-2.5 rounded-xl border text-sm font-bold flex items-center justify-between ${
                        isAns
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-100'
                          : isPicked && !isAns
                            ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-100'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span>
                        ({CHOICE_LABELS[oIdx]}) {optText}
                      </span>
                      {isAns && <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">正確答案</span>}
                      {isPicked && !isAns && <span className="text-xs font-black text-rose-600">你的作答</span>}
                    </div>
                  );
                })}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                <span className="font-black text-indigo-600 dark:text-indigo-400">💡 解析：</span>
                {q.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PureMcqExamView;
