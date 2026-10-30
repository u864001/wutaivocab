import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
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
  CheckSquare,
  Square,
  Coins,
  AlertCircle,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { HERE_WE_GO_BOOK_META, HERE_WE_GO_MCQ_BANK } from '../../data/hereWeGoMcqBank';
import { useStudent } from '../../context/StudentContext';
import {
  isBookInOwnGrade,
  formatStudentBadge,
  formatStudentDisplayName
} from '../../utils/studentIdHelper';
import { recordMcqExamStats } from '../../services/supabase';
import {
  assembleExamForm,
  buildFormOutline,
  buildTaskBreakdown,
  getInProgressKey,
  loadInProgress,
  saveInProgress,
  clearInProgress,
  purgeExpiredInProgress,
  getTaskLabel
} from './examBlueprint';

const CHOICE_LABELS = ['A', 'B', 'C', 'D'];
const ALL_BOOK_OPTIONS = ['g1', 'g2', 1, 2, 3, 4, 5, 6, 7, 8, 9];
const formatBookLabel = (bKey) => {
  if (bKey === 'g1') return '1年大寫';
  if (bKey === 'g2') return '2年大小寫';
  if (Number(bKey) === 9) return '國一先修';
  return `第 ${bKey} 冊`;
};

/**
 * 依據學生年級取得預設對應冊別陣列
 */
function getDefaultBooksForGrade(grade) {
  const g = Number(grade) || 0;
  if (g === 1) return ['g1'];
  if (g === 2) return ['g2'];
  if (g === 3) return [1, 2];
  if (g === 4) return [3, 4];
  if (g === 5) return [5, 6];
  if (g === 6) return [7, 8, 9];
  return [1, 2, 3, 4, 5, 6, 7, 8];
}

/**
 * 將 A: ... B: ... 對話題幹自動分行呈現，提升閱讀清晰度
 */
function formatQuestionStem(text) {
  const str = String(text || '').trim();
  if (/\bA:\s*/.test(str) && /\bB:\s*/.test(str)) {
    const parts = str.split(/(?=\bB:\s*)/);
    return (
      <div className="space-y-1.5">
        {parts.map((p, idx) => (
          <div key={idx} className="leading-snug">
            {p.trim()}
          </div>
        ))}
      </div>
    );
  }
  return <div className="leading-snug">{str}</div>;
}

export function PureMcqExamView({ settings, onBack, onComplete }) {
  const { currentStudent, isLoggedIn, addCoins, openModal, coins } = useStudent();

  // 依據學生年級或外部傳入設定決定預設冊別
  const initialBook = useMemo(() => {
    const units = settings?.selectedUnits || [];
    for (const u of units) {
      const m = String(u).match(/Book\s*(\d+)|HWG\s*(\d+)|第\s*(\d+)\s*冊/i);
      if (m) {
        const num = Number(m[1] || m[2] || m[3]);
        if (num >= 1 && num <= 9) return num;
      }
    }
    const gradeBooks = getDefaultBooksForGrade(currentStudent?.grade);
    return gradeBooks[0] || 1;
  }, [settings?.selectedUnits, currentStudent?.grade]);

  // 學生專屬易錯題庫 LocalStorage Key
  const mistakeStorageKey = useMemo(() => {
    const sid = currentStudent?.student_id || currentStudent?.id || 'guest';
    return `wutai_mcq_mistakes_${sid}`;
  }, [currentStudent]);

  // 讀取與儲存個人易錯題池: { [qId]: { wrongCount: number, streak: number, updatedAt: number } }
  const [mistakeMap, setMistakeMap] = useState(() => {
    try {
      const raw = localStorage.getItem(mistakeStorageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(mistakeStorageKey);
      setMistakeMap(raw ? JSON.parse(raw) : {});
    } catch {
      setMistakeMap({});
    }
  }, [mistakeStorageKey]);

  const saveMistakeMap = useCallback(
    (nextMap) => {
      setMistakeMap(nextMap);
      try {
        localStorage.setItem(mistakeStorageKey, JSON.stringify(nextMap));
      } catch {
        // Ignore storage quota errors
      }
    },
    [mistakeStorageKey]
  );

  // Phase: 'setup' | 'instructions' | 'exam' | 'result'
  const [phase, setPhase] = useState('setup');
  // Scope Mode: 'curriculum' (課本範圍檢定) | 'mistakes' (個人易錯題複習)
  const [scopeMode, setScopeMode] = useState('curriculum');
  const [selectedBook, setSelectedBook] = useState(initialBook);
  const [selectedUnits, setSelectedUnits] = useState(
    () => HERE_WE_GO_BOOK_META[initialBook]?.units || []
  );
  // 測驗題數選項: 10 | 20 | 50
  const [questionCountOpt, setQuestionCountOpt] = useState(20);

  // In-Progress Snapshot Key & State (6 小時內有效)
  const inProgressKey = useMemo(() => getInProgressKey(currentStudent), [currentStudent]);
  const [savedSession, setSavedSession] = useState(null);

  // Exam Runtime States
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qIndex]: choiceIdx }
  const [flagged, setFlagged] = useState({}); // { [qIndex]: boolean }
  const [startTime, setStartTime] = useState(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [showUnansweredConfirm, setShowUnansweredConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Result & Review States (單頁翻頁檢視，免上下捲動)
  const [reviewFilter, setReviewFilter] = useState('wrong'); // 'wrong' | 'all'
  const [reviewPageIndex, setReviewPageIndex] = useState(0);
  const [taskBreakdown, setTaskBreakdown] = useState([]);
  const [sessionRewardInfo, setSessionRewardInfo] = useState({
    coinsEarned: 0,
    reason: '',
    eligible: false,
    graduatedCount: 0,
    addedMistakeCount: 0
  });
  const hasAwardedCoinsRef = useRef(false);

  // 載入時清理過期快照並檢查是否有未完檢定
  useEffect(() => {
    purgeExpiredInProgress();
    const snap = loadInProgress(inProgressKey);
    if (snap && Array.isArray(snap.questions) && snap.questions.length > 0) {
      setSavedSession(snap);
    }
  }, [inProgressKey]);

  // 當學生登入身分或年級變更時，自動同步預設冊別
  useEffect(() => {
    setSelectedBook(initialBook);
    setSelectedUnits(HERE_WE_GO_BOOK_META[initialBook]?.units || []);
  }, [initialBook]);

  // 切換冊別時預設全選該冊所有單元
  const handleSelectBook = (bookNum) => {
    setSelectedBook(bookNum);
    setSelectedUnits(HERE_WE_GO_BOOK_META[bookNum]?.units || []);
  };

  const toggleUnit = (unitName) => {
    setSelectedUnits((prev) =>
      prev.includes(unitName) ? prev.filter((u) => u !== unitName) : [...prev, unitName]
    );
  };

  // 課本範圍可用題庫
  const curriculumPool = useMemo(() => {
    return HERE_WE_GO_MCQ_BANK.filter(
      (q) => q.book === selectedBook && selectedUnits.includes(q.unit)
    );
  }, [selectedBook, selectedUnits]);

  // 個人易錯題列表
  const mistakeQuestions = useMemo(() => {
    const ids = new Set(Object.keys(mistakeMap || {}));
    return HERE_WE_GO_MCQ_BANK.filter((q) => ids.has(q.id));
  }, [mistakeMap]);

  // 計時器（純紀錄用時）
  useEffect(() => {
    if (phase !== 'exam' || !startTime) return;
    const timer = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, startTime]);

  // 作答中自動保存進度至 LocalStorage（6小時內有效，維護健康回應機制）
  useEffect(() => {
    if (phase === 'exam' && questions.length > 0 && startTime) {
      saveInProgress(inProgressKey, {
        startedAt: startTime,
        questions,
        answers,
        flagged,
        currentIndex,
        elapsedSec,
        selectedBook,
        scopeMode,
        questionCountOpt
      });
    }
  }, [
    phase,
    questions,
    answers,
    flagged,
    currentIndex,
    elapsedSec,
    inProgressKey,
    startTime,
    selectedBook,
    scopeMode,
    questionCountOpt
  ]);

  // 若在成績單頁面剛登入，自動補發當次應得金幣
  useEffect(() => {
    if (
      phase === 'result' &&
      isLoggedIn &&
      sessionRewardInfo.coinsEarned > 0 &&
      !hasAwardedCoinsRef.current
    ) {
      hasAwardedCoinsRef.current = true;
      addCoins(sessionRewardInfo.coinsEarned);
    }
  }, [phase, isLoggedIn, sessionRewardInfo.coinsEarned, addCoins]);

  // 組建測驗題目並啟動測驗
  const startExamSession = useCallback(
    (customPool = null, customTargetCount = null, skipInstructions = false) => {
      const targetCount = Number(customTargetCount || questionCountOpt) || 20;
      let sourceList = [];

      if (customPool && Array.isArray(customPool) && customPool.length > 0) {
        sourceList = [...customPool];
      } else if (scopeMode === 'mistakes') {
        // 優先放入所有個人易錯題
        const mistakeList = [...mistakeQuestions];
        for (let i = mistakeList.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [mistakeList[i], mistakeList[j]] = [mistakeList[j], mistakeList[i]];
        }
        sourceList = mistakeList.slice(0, targetCount);

        // 若易錯題不足目標題數，從學生本年級題庫隨機抽題補滿（不重複）
        if (sourceList.length < targetCount) {
          const pickedIds = new Set(sourceList.map((q) => q.id));
          const ownBooks = getDefaultBooksForGrade(currentStudent?.grade);
          const fillerCandidates = HERE_WE_GO_MCQ_BANK.filter(
            (q) => ownBooks.includes(q.book) && !pickedIds.has(q.id)
          );
          for (let i = fillerCandidates.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [fillerCandidates[i], fillerCandidates[j]] = [
              fillerCandidates[j],
              fillerCandidates[i]
            ];
          }
          const needed = targetCount - sourceList.length;
          sourceList = [...sourceList, ...fillerCandidates.slice(0, needed)];
        }
      } else {
        // 使用專業語言測驗組卷藍圖：按大題順序排布、難度遞增、題組不拆散
        sourceList = assembleExamForm(curriculumPool, targetCount);
      }

      if (sourceList.length === 0) return;

      // 隨機洗牌每題的 (A)(B)(C)(D) 選項順序
      const prepared = sourceList.map((q) => {
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

      hasAwardedCoinsRef.current = false;
      setQuestions(prepared);
      setCurrentIndex(0);
      setAnswers({});
      setFlagged({});
      setShowUnansweredConfirm(false);
      setShowExitConfirm(false);

      if (skipInstructions || customPool) {
        setStartTime(Date.now());
        setElapsedSec(0);
        setPhase('exam');
      } else {
        setPhase('instructions');
      }
    },
    [questionCountOpt, scopeMode, mistakeQuestions, currentStudent?.grade, curriculumPool]
  );

  // 語音朗讀題幹（一、二年級中文題幹自動使用 zh-TW 語音讀題；三～六年級英文題幹使用 en-US 朗讀）
  const speakQuestion = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const raw = String(text || '');
      const hasChinese = /[\u4e00-\u9fa5]/.test(raw);
      const clean = raw
        .replace(/_{2,}/g, hasChinese ? ' 空格 ' : ' blank ')
        .replace(/\bA:\s*/g, '')
        .replace(/\bB:\s*/g, '');
      const utter = new SpeechSynthesisUtterance(clean);
      utter.lang = hasChinese ? 'zh-TW' : 'en-US';
      utter.rate = 0.9;
      window.speechSynthesis.speak(utter);
    } catch {
      // Ignore TTS errors
    }
  };

  // 點選選項（純粹記錄作答，無遊戲音效）
  const handleSelectOption = (optIdx) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: optIdx }));
  };

  const toggleFlagCurrent = () => {
    setFlagged((prev) => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  // 交卷結算：更新易錯題池＋計算金幣獎勵＋同步三大累計排行榜 (測驗王、勤學王、精準王)
  const finalizeExam = useCallback(() => {
    let correctCount = 0;
    const nextMistakes = { ...mistakeMap };
    let graduatedCount = 0;
    let addedMistakeCount = 0;

    questions.forEach((q, idx) => {
      const isRight = answers[idx] === q.answer;
      if (isRight) {
        correctCount++;
        // 在「個人易錯題複習」模式中答對既有易錯題：連續答對次數 +1，達 2 次即移出易錯池
        if (scopeMode === 'mistakes' && nextMistakes[q.id]) {
          const nextStreak = (nextMistakes[q.id].streak || 0) + 1;
          if (nextStreak >= 2) {
            delete nextMistakes[q.id];
            graduatedCount++;
          } else {
            nextMistakes[q.id] = {
              ...nextMistakes[q.id],
              streak: nextStreak,
              updatedAt: Date.now()
            };
          }
        }
      } else {
        // 答錯：加入易錯池並將連續答對紀錄歸零
        if (!nextMistakes[q.id]) {
          addedMistakeCount++;
        }
        nextMistakes[q.id] = {
          wrongCount: (nextMistakes[q.id]?.wrongCount || 0) + 1,
          streak: 0,
          updatedAt: Date.now()
        };
      }
    });

    saveMistakeMap(nextMistakes);

    const total = questions.length || 1;
    const accuracyRatio = correctCount / total;
    const finalScore = Math.round(accuracyRatio * 100);

    // 判斷是否符合本年級計分資格（易錯題複習或選擇學生自己年級的冊別）
    const isOwnGradeBook =
      scopeMode === 'mistakes' ||
      isBookInOwnGrade(String(selectedBook), currentStudent?.grade, 'mcq-exam');

    let coinsEarned = 0;
    let reason = '';
    if (!isOwnGradeBook) {
      coinsEarned = 0;
      reason = '跨年級自主練習不發放金幣與排行積分（選擇本年級冊別或易錯題複習即可計分）';
    } else if (finalScore < 60) {
      coinsEarned = 0;
      reason = '答對率需達 60% 以上方可獲得檢定金幣與累計排行，看詳解訂正後再挑戰一次！';
    } else {
      // 題數 × 答對率 × 0.4（10題全對=4、20題全對=8、50題全對=20，單次上限 20 金幣）
      coinsEarned = Math.min(20, Math.max(1, Math.round(total * accuracyRatio * 0.4)));
      reason = `通過檢定標準（答對率 ${finalScore}%），獲得 +${coinsEarned} 金幣並計入本週三大榜！`;

      // 自動同步至課本檢定三大累計排行榜（測驗王、勤學王、精準王）
      const displayName = formatStudentDisplayName(currentStudent);
      recordMcqExamStats({
        grade: currentStudent?.grade,
        book: selectedBook,
        name: displayName,
        correctCount,
        totalCount: total
      }).catch(() => {});
    }

    if (coinsEarned > 0 && isLoggedIn && !hasAwardedCoinsRef.current) {
      hasAwardedCoinsRef.current = true;
      addCoins(coinsEarned);
    }

    // 計算各大題分項診斷成績
    const breakdown = buildTaskBreakdown(questions, answers);
    setTaskBreakdown(breakdown);

    // 清理進行中快照
    clearInProgress(inProgressKey);
    setSavedSession(null);

    setSessionRewardInfo({
      coinsEarned,
      reason,
      eligible: isOwnGradeBook && finalScore >= 60,
      graduatedCount,
      addedMistakeCount
    });

    setShowUnansweredConfirm(false);
    setReviewFilter(correctCount === total ? 'all' : 'wrong');
    setReviewPageIndex(0);
    setPhase('result');

    if (typeof onComplete === 'function') {
      onComplete(finalScore, {
        mode: 'pure-mcq',
        book: selectedBook,
        correctCount,
        totalQuestions: total,
        elapsedSec,
        coinsEarned
      });
    }
  }, [
    mistakeMap,
    questions,
    answers,
    scopeMode,
    saveMistakeMap,
    selectedBook,
    currentStudent?.grade,
    isLoggedIn,
    addCoins,
    onComplete,
    elapsedSec,
    inProgressKey
  ]);

  const handleRequestSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      setShowUnansweredConfirm(true);
    } else {
      finalizeExam();
    }
  };

  // 鍵盤快捷鍵支援 (1~4 / A~D 選答案，左右方向鍵切換題目)
  useEffect(() => {
    if (phase !== 'exam') return;
    const onKeyDown = (e) => {
      if (showUnansweredConfirm || showExitConfirm) return;
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

  // 根據目前時段決定魯凱日/夜底圖
  const isNightBg = useMemo(() => {
    const hr = new Date().getHours();
    return hr >= 18 || hr < 6;
  }, []);

  const bgImageUrl = isNightBg
    ? '/images/rukai_hub_night_1775490488446.png'
    : '/images/rukai_Main_Hub_Day.png';

  // ============================================================================
  // 共用零捲動外框 (100dvh Zero-Scroll Professional Language Assessment Shell)
  // ============================================================================
  const renderShell = (children) => (
    <div
      className="relative w-full h-[100dvh] overflow-hidden select-none flex flex-col items-center justify-center p-2 sm:p-4 md:p-5 bg-slate-900 bg-cover bg-center"
      style={{ backgroundImage: `url('${bgImageUrl}')` }}
    >
      {/* 專業柔焦遮罩層，降低背景干擾、突顯中央檢定面板 */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md pointer-events-none" />

      {/* 中央一頁式專業檢定容器 */}
      <div className="relative z-10 w-full max-w-5xl h-full max-h-[820px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-slate-100 transition-opacity duration-150">
        {children}
      </div>
    </div>
  );

  // ============================================================================
  // STEP 1 & 2: 一頁式檢定範圍與題數設定 (Setup Screen - Zero Scroll)
  // ============================================================================
  if (phase === 'setup') {
    const bookMeta = HERE_WE_GO_BOOK_META[selectedBook] || HERE_WE_GO_BOOK_META[1];
    const mistakeCount = mistakeQuestions.length;
    const isSelectedBookOwnGrade = isBookInOwnGrade(
      String(selectedBook),
      currentStudent?.grade,
      'mcq-exam'
    );
    const canStart = scopeMode === 'mistakes' ? true : curriculumPool.length > 0;

    return renderShell(
      <>
        {/* 頂端精簡導覽列 */}
        <div className="shrink-0 px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/80 dark:bg-slate-900/80">
          <button
            type="button"
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition"
          >
            <ArrowLeft size={16} />
            離開
          </button>

          <div className="flex items-center gap-2">
            <ClipboardCheck className="text-indigo-600 dark:text-indigo-400" size={20} />
            <h1 className="text-base sm:text-lg md:text-xl font-black tracking-tight text-slate-900 dark:text-white">
              課本題庫檢定館
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={openModal}
                className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-black flex items-center gap-1.5"
              >
                <span>{formatStudentBadge(currentStudent)}</span>
                <span className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400">
                  <Coins size={13} />
                  {coins}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={openModal}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-black flex items-center gap-1"
              >
                <UserCheck size={14} />
                登入領金幣
              </button>
            )}
          </div>
        </div>

        {/* 中央設定主體（彈性自適應高度、免捲動） */}
        {/* 空間足夠時（電腦／平板）一頁呈現；空間不足時（手機、未放大視窗）允許上下滑動，絕不重疊 */}
        <div className="flex-1 min-h-0 p-3 sm:p-5 md:p-6 flex flex-col gap-3 overflow-y-auto overscroll-contain">
          {/* 未完成檢定接續提醒 (6 小時內有效快照) */}
          {savedSession && (
            <div className="shrink-0 p-3 sm:p-4 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/70 border-2 border-indigo-300 dark:border-indigo-700 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2.5 min-w-0">
                <Sparkles className="text-indigo-600 dark:text-indigo-400 shrink-0" size={20} />
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-black text-indigo-950 dark:text-indigo-100 flex items-center gap-2">
                    <span>發現未完成的檢定</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-200/70 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200">
                      已作答 {Object.keys(savedSession.answers || {}).length} / {savedSession.questions?.length} 題
                    </span>
                  </div>
                  <div className="text-[11px] text-indigo-700 dark:text-indigo-300 truncate mt-0.5">
                    {savedSession.scopeMode === 'mistakes' ? '易錯題複習' : `${formatBookLabel(savedSession.selectedBook)}檢定`} • 6 小時內有效，可隨時接續
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    clearInProgress(inProgressKey);
                    setSavedSession(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition"
                >
                  放棄重測
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuestions(savedSession.questions);
                    setAnswers(savedSession.answers || {});
                    setFlagged(savedSession.flagged || {});
                    setCurrentIndex(savedSession.currentIndex || 0);
                    setElapsedSec(savedSession.elapsedSec || 0);
                    setStartTime(Date.now() - (savedSession.elapsedSec || 0) * 1000);
                    if (savedSession.selectedBook) setSelectedBook(savedSession.selectedBook);
                    if (savedSession.questionCountOpt) setQuestionCountOpt(savedSession.questionCountOpt);
                    setSavedSession(null);
                    setPhase('exam');
                  }}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-sm flex items-center gap-1 transition"
                >
                  <span>接續作答</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* 步驟 1：選擇測驗模式与範圍 */}
          <div className="shrink-0 flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
                  1
                </span>
                <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  選擇範圍
                </span>
              </div>

              {/* 課本範圍 vs 個人易錯題複習 切換 */}
              <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setScopeMode('curriculum')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-black transition ${
                    scopeMode === 'curriculum'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  📚 課本範圍
                </button>
                <button
                  type="button"
                  onClick={() => setScopeMode('mistakes')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-black transition flex items-center gap-1.5 ${
                    scopeMode === 'mistakes'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <span>📓 易錯題複習</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                    {mistakeCount}
                  </span>
                </button>
              </div>
            </div>

            {scopeMode === 'curriculum' ? (
              <div className="flex flex-col gap-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-700/70">
                {/* 冊別列 (第 1~8 冊 + 國一先修) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-slate-500 dark:text-slate-400">
                      冊別<span className="hidden sm:inline">（{bookMeta.subtitle}）</span>
                    </span>
                    <span
                      className={`font-black px-2 py-0.5 rounded-md ${
                        isSelectedBookOwnGrade
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {isSelectedBookOwnGrade ? '✓ 本年級計分' : '練習不計分'}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-11 gap-1.5">
                    {ALL_BOOK_OPTIONS.map((bNum) => {
                      const isSelected = selectedBook === bNum;
                      const isOwn = isBookInOwnGrade(
                        String(bNum),
                        currentStudent?.grade,
                        'mcq-exam'
                      );
                      return (
                        <button
                          key={String(bNum)}
                          type="button"
                          onClick={() => handleSelectBook(bNum)}
                          className={`py-1.5 px-1 rounded-xl border text-center transition flex flex-col items-center justify-center relative ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          <span className="text-[11px] sm:text-xs font-black leading-tight">
                            {formatBookLabel(bNum)}
                          </span>
                          {isOwn && (
                            <span
                              className={`text-[10px] font-bold leading-tight mt-0.5 ${
                                isSelected ? 'text-amber-200' : 'text-emerald-600 dark:text-emerald-400'
                              }`}
                            >
                              本年級
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 單元勾選列 */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      單元<span className="hidden sm:inline">（題庫 {curriculumPool.length} 題）</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedUnits([...bookMeta.units])}
                        className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                      >
                        全選
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedUnits(
                            selectedBook === 'g1' || selectedBook === 'g2'
                              ? bookMeta.units.slice(0, 2)
                              : bookMeta.units.filter((u) =>
                                  ['Starter', 'Unit 1', 'Unit 2', 'Review 1'].includes(u)
                                )
                          )
                        }
                        className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-white hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        上半冊
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedUnits(
                            selectedBook === 'g1' || selectedBook === 'g2'
                              ? bookMeta.units.slice(2)
                              : bookMeta.units.filter((u) =>
                                  ['Unit 3', 'Unit 4', 'Review 2', 'Festival'].includes(u)
                                )
                          )
                        }
                        className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-white hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        下半冊
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {bookMeta.units.map((unitName) => {
                      const checked = selectedUnits.includes(unitName);
                      return (
                        <button
                          key={unitName}
                          type="button"
                          onClick={() => toggleUnit(unitName)}
                          className={`px-3 py-2 rounded-xl border text-left transition flex items-center justify-between ${
                            checked
                              ? 'border-indigo-600 bg-indigo-50/90 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-100 font-black'
                              : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/40 text-slate-400 font-bold'
                          }`}
                        >
                          <span className="text-xs sm:text-sm truncate">{unitName}</span>
                          {checked ? (
                            <CheckSquare size={15} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                          ) : (
                            <Square size={15} className="text-slate-300 dark:text-slate-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* 個人易錯題複習說明面板 */
              <div className="flex flex-col justify-center bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-700/70">
                <div className="max-w-xl mx-auto text-center space-y-2 sm:space-y-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-black">
                    📓 易錯題：{mistakeCount} 題
                  </div>
                  <h3 className="text-sm sm:text-lg font-black text-slate-900 dark:text-white">
                    連續答對 2 次自動移出
                  </h3>
                  <p className="hidden sm:block text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    系統會自動收集你曾答錯的題目編號。若目前易錯題數少於所選測驗題數，將自動從你的本年級題庫隨機抽題補滿。在本模式中只要對同一題
                    <span className="font-black text-emerald-600 dark:text-emerald-400">
                      「連續答對 2 次」
                    </span>
                    ，系統即判定已熟練並自動從易錯池移除！
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 步驟 2：選擇欲測驗題數 (10 / 20 / 50) */}
          <div className="shrink-0 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-700/70 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
                  2
                </span>
                <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  選擇題數
                </span>
              </div>
              <span className="hidden md:inline text-xs font-bold text-slate-500 dark:text-slate-400">
                本年級答對率 ≥ 60% 才發金幣
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { count: 10, label: '10 題', reward: '最高 +4' },
                { count: 20, label: '20 題', reward: '最高 +8' },
                { count: 50, label: '50 題', reward: '最高 +20' }
              ].map((opt) => {
                const active = questionCountOpt === opt.count;
                return (
                  <button
                    key={opt.count}
                    type="button"
                    onClick={() => setQuestionCountOpt(opt.count)}
                    className={`py-2.5 px-3 rounded-xl border-2 text-center transition flex flex-col items-center justify-center ${
                      active
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <span className="text-sm sm:text-base font-black">{opt.label}</span>
                    <span
                      className={`text-[11px] font-bold ${
                        active ? 'text-amber-200' : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {opt.reward}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* 步驟 3：開始測驗 CTA（固定於底部，不隨內容捲走） */}
        <div className="shrink-0 px-3 sm:px-6 py-2.5 sm:py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-end">
            <button
              type="button"
              disabled={!canStart}
              onClick={() => startExamSession()}
              className="w-full sm:w-auto sm:min-w-[260px] py-3.5 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black text-sm sm:text-base shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 ml-auto"
            >
              <span>開始檢定 ({questionCountOpt} 題)</span>
              <ArrowRight size={18} />
            </button>
        </div>
      </>
    );
  }

  // ============================================================================
  // STEP 2.5: 本次測驗內容配置與說明 (Page 0 Overview Screen - Zero Scroll)
  // ============================================================================
  if (phase === 'instructions') {
    const outline = buildFormOutline(questions);
    const bookMeta = HERE_WE_GO_BOOK_META[selectedBook] || HERE_WE_GO_BOOK_META[1];
    const centerTitle = scopeMode === 'mistakes' ? '個人易錯題複習' : `${formatBookLabel(selectedBook)}檢定`;

    return renderShell(
      <>
        {/* 頂端精簡導覽列 */}
        <div className="shrink-0 px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/80 dark:bg-slate-900/80">
          <button
            type="button"
            onClick={() => setPhase('setup')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition"
          >
            <ArrowLeft size={16} />
            重選範圍
          </button>

          <div className="flex items-center gap-2">
            <BookOpen className="text-indigo-600 dark:text-indigo-400" size={20} />
            <h2 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-slate-900 dark:text-white">
              本次測驗說明與配置
            </h2>
          </div>

          <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            共 {questions.length} 題
          </span>
        </div>

        {/* 主體內容（空間不足可捲動） */}
        <div className="flex-1 min-h-0 p-4 sm:p-6 md:p-8 flex flex-col justify-between gap-4 overflow-y-auto overscroll-contain">
          <div className="max-w-2xl mx-auto w-full space-y-4">
            {/* 試卷基本資訊卡 */}
            <div className="bg-slate-50/90 dark:bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {centerTitle}
                  </span>
                  <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                    {bookMeta.title}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-black text-xs sm:text-sm shadow-xs">
                  全卷 {questions.length} 題
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <span className="font-bold">測驗範圍：</span>
                <span className="truncate">{scopeMode === 'mistakes' ? '個人錯題精選' : selectedUnits.join('、')}</span>
              </div>
            </div>

            {/* 大題配置列表 */}
            <div className="space-y-2">
              <div className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span>📋 本次測驗大題配置</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {outline.map((part, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-800/90 rounded-xl p-3 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-black flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-white">
                          {part.label}
                        </div>
                        <div className="text-[11px] text-slate-400 font-semibold">
                          {part.sectionLabel}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                      第 {part.start}–{part.end} 題 ({part.end - part.start + 1} 題)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 溫馨提醒 */}
            <div className="bg-amber-50/70 dark:bg-amber-950/40 rounded-xl p-3.5 border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
              <div className="font-black flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                <AlertCircle size={15} />
                <span>作答須知與專業規範</span>
              </div>
              <ul className="list-disc list-inside space-y-1 opacity-90 pl-1">
                <li>依序一頁一題作答，作答時可隨時點擊右上角 🚩 標記待查題目。</li>
                <li>點擊下方「正式開始作答」後才會進入第 1 題並正式開始計時。</li>
                <li>作答中斷線或誤離，6 小時內返回皆可無縫接續作答。</li>
              </ul>
            </div>
          </div>

          {/* 底部開始按鈕 */}
          <div className="shrink-0 flex items-center justify-center pt-2 pb-1">
            <button
              type="button"
              onClick={() => {
                setStartTime(Date.now());
                setElapsedSec(0);
                setCurrentIndex(0);
                setPhase('exam');
              }}
              className="w-full sm:w-auto sm:min-w-[280px] py-3.5 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm sm:text-base shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>正式開始作答 ➔</span>
            </button>
          </div>
        </div>
      </>
    );
  }

  // ============================================================================
  // STEP 3: 開始測驗 (一頁一題、專業語言檢定風格、頂端三欄極簡列)
  // ============================================================================
  if (phase === 'exam') {
    const currentQ = questions[currentIndex];
    const selectedChoice = answers[currentIndex];
    const isFlagged = !!flagged[currentIndex];
    const answeredCount = Object.keys(answers).length;

    if (!currentQ) return null;

    const currentTaskLabel = getTaskLabel(currentQ);
    const centerScopeTitle =
      scopeMode === 'mistakes'
        ? `個人易錯題 · ${currentTaskLabel}`
        : `${formatBookLabel(selectedBook)} · ${currentTaskLabel}`;

    return renderShell(
      <>
        {/* 頂端三欄極簡狀態列：左「離開」、中「測驗冊別」、右「題號進度與標記」 */}
        <div className="shrink-0 px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 grid grid-cols-3 items-center bg-slate-50/90 dark:bg-slate-900/90">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setShowExitConfirm(true)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1 transition"
            >
              <ArrowLeft size={15} />
              離開
            </button>
          </div>

          <div className="text-center truncate font-black text-sm sm:text-base text-slate-800 dark:text-slate-100">
            {centerScopeTitle}
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={toggleFlagCurrent}
              className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 transition ${
                isFlagged
                  ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="標記待檢查"
            >
              <Flag size={13} className={isFlagged ? 'fill-amber-500 text-amber-500' : ''} />
              <span className="hidden sm:inline">{isFlagged ? '已標記' : '標記'}</span>
            </button>
            <span className="px-3 py-1 rounded-lg bg-slate-900 dark:bg-indigo-600 text-white font-black text-xs sm:text-sm">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
        </div>

        {/* 中央單題試題區（固定於容器內，不捲動） */}
        <div
          key={currentQ.id}
          className="flex-1 min-h-0 px-4 sm:px-8 py-4 sm:py-6 flex flex-col justify-between gap-4 overflow-y-auto overscroll-contain transition-opacity duration-150"
        >
          {/* 題幹區 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Question {currentIndex + 1}
              </span>
              <button
                type="button"
                onClick={() => speakQuestion(currentQ.question)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1 transition"
              >
                <Volume2 size={14} />
                朗讀題幹
              </button>
            </div>

            <div className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-wide py-1">
              {formatQuestionStem(currentQ.question)}
            </div>
          </div>

          {/* (A)(B)(C)(D) 選項區 */}
          <div className="grid grid-cols-1 gap-2.5 sm:gap-3 my-auto">
            {currentQ.options.map((optText, optIdx) => {
              const isChosen = selectedChoice === optIdx;
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full px-4 py-3 sm:py-4 rounded-2xl border-2 text-left transition flex items-center gap-3.5 ${
                    isChosen
                      ? 'border-indigo-600 bg-indigo-50/90 dark:bg-indigo-950/70 text-indigo-950 dark:text-white font-black shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/50 hover:border-indigo-300 text-slate-800 dark:text-slate-100 font-bold'
                  }`}
                >
                  <span
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-black text-sm sm:text-base shrink-0 ${
                      isChosen
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {CHOICE_LABELS[optIdx]}
                  </span>
                  <span className="text-base sm:text-lg md:text-xl leading-snug">{optText}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 底部導覽列：上一題 / 題號圓點列 / 下一題或交卷 */}
        <div className="shrink-0 px-4 sm:px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 disabled:opacity-40 font-black text-xs sm:text-sm flex items-center gap-1.5 shrink-0 transition"
          >
            <ArrowLeft size={16} />
            上一題
          </button>

          {/* 單行可橫向滑動題號列（絕不撐高頁面） */}
          <div className="flex-1 flex items-center justify-center gap-1 overflow-x-auto py-1 no-scrollbar">
            {questions.map((_, idx) => {
              const isCurr = idx === currentIndex;
              const isAns = answers[idx] !== undefined;
              const isFlg = !!flagged[idx];
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[11px] font-black shrink-0 transition relative flex items-center justify-center ${
                    isCurr
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                      : isAns
                        ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-800'
                        : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {idx + 1}
                  {isFlg && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border border-white" />
                  )}
                </button>
              );
            })}
          </div>

          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shrink-0 shadow-sm transition"
            >
              下一題
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRequestSubmit}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shrink-0 shadow-sm transition"
            >
              <CheckCircle2 size={16} />
              交卷計分
            </button>
          )}
        </div>

        {/* 未答完確認視窗 */}
        {showUnansweredConfirm && (
          <div className="absolute inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                尚有未作答題目
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                目前還有{' '}
                <span className="font-black text-rose-600">
                  {questions.length - answeredCount} 題
                </span>{' '}
                尚未作答。確定要直接交卷嗎？
              </p>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowUnansweredConfirm(false);
                    const firstMissing = questions.findIndex((_, idx) => answers[idx] === undefined);
                    if (firstMissing !== -1) setCurrentIndex(firstMissing);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold"
                >
                  返回檢查未答題
                </button>
                <button
                  type="button"
                  onClick={finalizeExam}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black"
                >
                  確定交卷
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 中途離開確認視窗 */}
        {showExitConfirm && (
          <div className="absolute inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                確定要中止本次檢定嗎？
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                離開後本次尚未交卷的作答進度將不會計分。
              </p>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold"
                >
                  繼續作答
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearInProgress(inProgressKey);
                    setSavedSession(null);
                    setShowExitConfirm(false);
                    setPhase('setup');
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black"
                >
                  返回設定頁
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // ============================================================================
  // STEP 4 & 5: 結算金幣與單題翻頁式檢定報告 (Result & Paged Review - Zero Scroll)
  // ============================================================================
  const totalQ = questions.length || 1;
  const correctList = questions.filter((q, idx) => answers[idx] === q.answer);
  const wrongList = questions.filter((q, idx) => answers[idx] !== q.answer);
  const score = Math.round((correctList.length / totalQ) * 100);

  const reviewItems = questions
    .map((q, idx) => ({ q, idx, userChoice: answers[idx], isCorrect: answers[idx] === q.answer }))
    .filter((item) => (reviewFilter === 'wrong' ? !item.isCorrect || flagged[item.idx] : true));

  const safeReviewIdx = Math.min(
    Math.max(0, reviewPageIndex),
    Math.max(0, reviewItems.length - 1)
  );
  const currentReviewItem = reviewItems[safeReviewIdx] || null;

  return renderShell(
    <>
      {/* 頂端導覽列 */}
      <div className="shrink-0 px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-slate-900/90">
        <button
          type="button"
          onClick={() => setPhase('setup')}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition"
        >
          <ArrowLeft size={15} />
          返回
        </button>

        <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
          <Award size={18} className="text-indigo-600 dark:text-indigo-400" />
          <span>檢定結果</span>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs"
        >
          回首頁
        </button>
      </div>

      {/* 主體：電腦雙欄（左成績、右單題翻頁詳解）；手機上下排列，內容超出時可上下滑動 */}
      <div className="flex-1 min-h-0 p-3 sm:p-5 flex flex-col gap-3 overflow-y-auto overscroll-contain lg:grid lg:grid-cols-12 lg:gap-4 lg:overflow-hidden">
        {/* 左欄：成績（得分旁直接顯示本次金幣） */}
        <div className="shrink-0 lg:col-span-4 bg-slate-50/90 dark:bg-slate-800/50 rounded-2xl p-3 sm:p-5 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-3">
          <div className="space-y-2.5 sm:space-y-3">
            {/* 分數、答對題數與金幣 */}
            <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 sm:p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-400 truncate">
                  {scopeMode === 'mistakes' ? '易錯題複習' : `${formatBookLabel(selectedBook)}檢定`}
                </div>
                <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  答對 {correctList.length} / {totalQ} 題
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  {formatTime(elapsedSec)}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div
                  title={sessionRewardInfo.reason}
                  className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1 font-black text-sm sm:text-base border ${
                    sessionRewardInfo.coinsEarned > 0
                      ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-300'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  <Coins size={16} className="shrink-0" />+{sessionRewardInfo.coinsEarned}
                </div>
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center text-white shadow-md ${
                    score >= 60 ? 'bg-indigo-600' : 'bg-rose-600'
                  }`}
                >
                  <span className="text-[10px] font-bold opacity-80">得分</span>
                  <span className="text-2xl sm:text-3xl font-black leading-none">{score}</span>
                </div>
              </div>
            </div>

            {!isLoggedIn && sessionRewardInfo.coinsEarned > 0 && (
              <button
                type="button"
                onClick={openModal}
                className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition"
              >
                登入以入帳金幣
              </button>
            )}

            {/* 分項診斷成績 */}
            {taskBreakdown.length > 0 && (
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-xs font-black text-slate-700 dark:text-slate-200 flex items-center justify-between">
                  <span>📊 題型分項表現</span>
                  <span className="text-[10px] text-slate-400 font-bold">答對 / 該題型題數</span>
                </div>
                <div className="space-y-1.5">
                  {taskBreakdown.map((row) => {
                    const pct = row.total > 0 ? Math.round((row.correct / row.total) * 100) : 0;
                    return (
                      <div key={row.taskType} className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-600 dark:text-slate-300">
                          {row.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-800 dark:text-slate-100">
                            {row.correct} / {row.total}
                          </span>
                          <span
                            className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                              pct >= 80
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                : pct >= 60
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                                : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                            }`}
                          >
                            {pct}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 易錯題池變動紀錄（一行精簡） */}
            {(sessionRewardInfo.graduatedCount > 0 || sessionRewardInfo.addedMistakeCount > 0) && (
              <div className="px-2.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold flex flex-wrap gap-x-3 gap-y-0.5">
                {sessionRewardInfo.graduatedCount > 0 && (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ✓ 易錯題移出 {sessionRewardInfo.graduatedCount} 題
                  </span>
                )}
                {sessionRewardInfo.addedMistakeCount > 0 && (
                  <span className="text-rose-600 dark:text-rose-400">
                    • 新增易錯題 {sessionRewardInfo.addedMistakeCount} 題
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 操作按鈕組 */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {wrongList.length > 0 && (
              <button
                type="button"
                onClick={() => startExamSession(wrongList, wrongList.length)}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition"
              >
                <RotateCcw size={15} />
                錯題重練 ({wrongList.length})
              </button>
            )}
            <button
              type="button"
              onClick={() => startExamSession()}
              className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition"
            >
              <RotateCcw size={15} />
              再測一次
            </button>
          </div>
        </div>

        {/* 右欄：一頁一題翻頁式詳解檢視卡（免上下捲動） */}
        <div className="shrink-0 lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-5 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-3 lg:overflow-hidden lg:min-h-0">
          {/* 篩選與題目翻頁控制列 */}
          <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setReviewFilter('wrong');
                  setReviewPageIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                  reviewFilter === 'wrong'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                只看錯題 ({wrongList.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setReviewFilter('all');
                  setReviewPageIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                  reviewFilter === 'all'
                    ? 'bg-slate-900 dark:bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                全部題目 ({questions.length})
              </button>
            </div>

            {reviewItems.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={safeReviewIdx === 0}
                  onClick={() => setReviewPageIndex((i) => Math.max(0, i - 1))}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 text-xs font-black flex items-center gap-1"
                >
                  <ArrowLeft size={13} />
                  上一題
                </button>
                <span className="text-xs font-black text-slate-600 dark:text-slate-300">
                  {safeReviewIdx + 1} / {reviewItems.length}
                </span>
                <button
                  type="button"
                  disabled={safeReviewIdx >= reviewItems.length - 1}
                  onClick={() =>
                    setReviewPageIndex((i) => Math.min(reviewItems.length - 1, i + 1))
                  }
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 text-xs font-black flex items-center gap-1"
                >
                  下一題
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>

          {/* 單題詳解內容 */}
          {currentReviewItem ? (
            <div className="flex-1 flex flex-col justify-between gap-2.5 lg:min-h-0 lg:overflow-y-auto">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-black ${
                        currentReviewItem.isCorrect
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
                      }`}
                    >
                      第 {currentReviewItem.idx + 1} 題 •{' '}
                      {currentReviewItem.isCorrect ? '✓ 答對' : '✗ 答錯'}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {formatBookLabel(currentReviewItem.q.book)} • {currentReviewItem.q.unit}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakQuestion(currentReviewItem.q.question)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1"
                  >
                    <Volume2 size={14} />
                    朗讀
                  </button>
                </div>

                <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {formatQuestionStem(currentReviewItem.q.question)}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentReviewItem.q.options.map((optText, oIdx) => {
                  const isAns = oIdx === currentReviewItem.q.answer;
                  const isPicked = oIdx === currentReviewItem.userChoice;
                  return (
                    <div
                      key={oIdx}
                      className={`px-3 py-2 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-between gap-2 ${
                        isAns
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-100'
                          : isPicked && !isAns
                            ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-100'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="break-words min-w-0">
                        ({CHOICE_LABELS[oIdx]}) {optText}
                      </span>
                      {isAns && (
                        <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-300 shrink-0">
                          ✓ 正解
                        </span>
                      )}
                      {isPicked && !isAns && (
                        <span className="text-[11px] font-black text-rose-600 shrink-0">
                          ✗ 你的作答
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-xs sm:text-sm text-indigo-950 dark:text-indigo-100 leading-relaxed">
                <span className="font-black text-indigo-700 dark:text-indigo-300">💡 解析：</span>
                {currentReviewItem.q.explanation}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <CheckCircle2 size={36} className="text-emerald-500 mb-2" />
              <div className="font-black text-base text-slate-800 dark:text-white">
                本次測驗全數答對，沒有任何錯題！
              </div>
              <button
                type="button"
                onClick={() => setReviewFilter('all')}
                className="mt-2 text-xs font-bold text-indigo-600 hover:underline"
              >
                點此檢視全部題目解析
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PureMcqExamView;
