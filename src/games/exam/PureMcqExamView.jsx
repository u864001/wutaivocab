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
  UserCheck,
  Headphones,
  PenTool,
  GraduationCap,
  ChevronRight,
  Clock,
  AlertTriangle,
  X,
  Check,
  Info,
  SlidersHorizontal,
  FileText,
  Type
} from 'lucide-react';
import {
  EXAM_TRACKS,
  TME_PRE_A1_SPEC,
  SAA_EXAM_SPEC,
  HERE_WE_GO_BOOK_META,
  HERE_WE_GO_MCQ_BANK,
  TME_PRE_A1_BANK,
  SAA_EXAM_BANK,
  SAA_115_EXAM_PAPERS,
  SAA_ALL_EXAM_PAPERS
} from '../../data/exam';
import { playDialogueSpeech, stopDialogueSpeech, isDialogue } from '../../services/dialogueSpeaker';
import { useStudent } from '../../context/StudentContext';
import {
  isBookInOwnGrade,
  formatStudentBadge,
  formatStudentDisplayName
} from '../../utils/studentIdHelper';
import {
  recordMcqExamStats,
  recordPreA1MasteryLeaderboard,
  submitStudentQuestionReport
} from '../../services/supabase';
import {
  recordExamMasterySession,
  loadStudentMastery,
  MASTERY_STATES
} from '../../utils/masteryHelper';
import { PreA1MasteryDashboard } from '../../components/exam/PreA1MasteryDashboard';
import {
  assembleExamForm,
  buildFormOutline,
  buildTaskBreakdown,
  getInProgressKey,
  loadInProgress,
  saveInProgress,
  clearInProgress,
  purgeExpiredInProgress,
  getTaskLabel,
  extractTargetToken
} from './examBlueprint';

const CHOICE_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
export const STUDENT_REPORT_TAGS = [
  { id: 'no_answer', icon: '❌', label: '找不到正確答案（答案似乎不在選項中）' },
  { id: 'image_error', icon: '🖼️', label: '圖片看不到或圖片內容不合' },
  { id: 'audio_error', icon: '🔊', label: '語音沒有聲音或讀音怪怪的' },
  { id: 'typo_error', icon: '✍️', label: '題目或選項有錯字或打錯' },
  { id: 'other_error', icon: '❓', label: '其他問題 / 題目意思怪怪的' }
];
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
  // Setup Sub-View: 'hub' (四大膠囊總覽) | 'textbook' | 'saa' | 'preA1' | 'mistakes'
  const [setupSubView, setSetupSubView] = useState(() => {
    if (settings?.mode === 'mistakes') return 'mistakes';
    return 'hub';
  });
  // Scope Mode: 'curriculum' (課本範圍檢定) | 'ministry-assessment' (學力檢測) | 'tme-preA1' (Pre-A1) | 'mistakes' (個人易錯題複習)
  const [scopeMode, setScopeMode] = useState('curriculum');
  const [selectedBook, setSelectedBook] = useState(initialBook);

  // 課本題型模式: 'comprehensive' (綜合測驗: 聽力+筆試) | 'written' (純筆試: 避開聽力) | 'listening' (純聽力特訓)
  const [textbookExamMode, setTextbookExamMode] = useState(() => {
    if (initialBook === 'g1' || initialBook === 'g2') return 'written';
    return 'comprehensive';
  });
  // 單元範圍快選標籤: 'midterm' (上半冊) | 'final' (下半冊) | 'all' (全冊) | 'custom' (自選)
  const [rangePreset, setRangePreset] = useState(() => {
    if (initialBook === 'g1' || initialBook === 'g2') return 'all';
    return 'midterm';
  });
  const [isCustomUnitOpen, setIsCustomUnitOpen] = useState(false);
  const [isPlayingAudioTest, setIsPlayingAudioTest] = useState(false);

  const [selectedUnits, setSelectedUnits] = useState(() => {
    const meta = HERE_WE_GO_BOOK_META[initialBook];
    if (!meta) return [];
    if (initialBook === 'g1' || initialBook === 'g2') return [...meta.units];
    return meta.units.filter((u) => ['Starter', 'Unit 1', 'Unit 2', 'Review 1'].includes(u));
  });
  // 測驗題數選項: 10 | 20 | 50
  const [questionCountOpt, setQuestionCountOpt] = useState(20);
  // 四聯階梯布題台逐步引導狀態 (1: 冊別, 2: 範圍, 3: 型態, 4: 題數)
  const [activeBoardStep, setActiveBoardStep] = useState(1);
  const [maxReachedBoardStep, setMaxReachedBoardStep] = useState(1);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  // 學力檢測 (SAA) 設定
  const defaultSaaGrade = useMemo(() => {
    const g = Number(currentStudent?.grade) || 0;
    return g >= 4 && g <= 6 ? g : 4;
  }, [currentStudent?.grade]);
  const [selectedSaaGrade, setSelectedSaaGrade] = useState(defaultSaaGrade);
  // SAA 測驗年度: 115 (最新全真試卷) | 114 (114年全真試卷)
  const [selectedSaaYear, setSelectedSaaYear] = useState(115);
  // SAA 題型組合: 'standard' (聽15+閱20) | 'listening' (聽20) | 'reading' (閱20)
  const [selectedSaaFormat, setSelectedSaaFormat] = useState('standard');

  // Pre-A1 設定: 'standard' (聽15+閱15) | 'listening' (聽20) | 'reading' (閱20) | 'writing' (寫作重組20)
  const [selectedPreA1Format, setSelectedPreA1Format] = useState('standard');
  // 正式施測模式 (30題 • 限時35分 • 雙次聽力播音 • 分母300題)
  const [isFormalExam, setIsFormalExam] = useState(false);
  const [masteryInitialTrack, setMasteryInitialTrack] = useState('tme-preA1');
  const finalizeExamRef = useRef(null);

  const isSelectedBookOwnGrade = useMemo(() => {
    return isBookInOwnGrade(
      String(selectedBook),
      currentStudent?.grade,
      'mcq-exam'
    );
  }, [selectedBook, currentStudent?.grade]);

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

  // 學生試題疑義回報狀態 (僅在非正式練習開放)
  const [reportedQuestions, setReportedQuestions] = useState({}); // { [qId]: boolean }
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingQuestion, setReportingQuestion] = useState(null);
  const [selectedReportTag, setSelectedReportTag] = useState('no_answer');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportToastMessage, setReportToastMessage] = useState(null);

  const handleOpenReportModal = useCallback((question) => {
    if (!question) return;
    setReportingQuestion(question);
    setSelectedReportTag('no_answer');
    setShowReportModal(true);
  }, []);

  const handleSubmitReport = useCallback(async () => {
    if (!reportingQuestion || isSubmittingReport) return;
    const chosen = STUDENT_REPORT_TAGS.find((t) => t.id === selectedReportTag) || STUDENT_REPORT_TAGS[0];
    setIsSubmittingReport(true);

    try {
      await submitStudentQuestionReport({
        questionId: reportingQuestion.id,
        track: scopeMode,
        book: reportingQuestion.book || selectedBook,
        tag: chosen.id,
        label: chosen.label,
        studentId: currentStudent?.student_id || currentStudent?.id || 'guest',
        studentName: formatStudentDisplayName(currentStudent) || '冒險家'
      });

      setReportedQuestions((prev) => ({
        ...prev,
        [reportingQuestion.id]: true
      }));

      setShowReportModal(false);
      setReportToastMessage('感謝你的回報！老師會盡快為大家檢查這題 ❤️');
      setTimeout(() => {
        setReportToastMessage(null);
      }, 3500);
    } catch (err) {
      console.warn('Failed to submit report', err);
      setShowReportModal(false);
    } finally {
      setIsSubmittingReport(false);
      setReportingQuestion(null);
    }
  }, [reportingQuestion, isSubmittingReport, selectedReportTag, scopeMode, selectedBook, currentStudent]);

  // 載入時清理過期快照並檢查是否有未完檢定
  useEffect(() => {
    purgeExpiredInProgress();
    const snap = loadInProgress(inProgressKey);
    if (snap && Array.isArray(snap.questions) && snap.questions.length > 0) {
      setSavedSession(snap);
    }
  }, [inProgressKey]);

  // 切換範圍快捷設定
  const applyRangePreset = useCallback((preset, bookKey = selectedBook) => {
    setRangePreset(preset);
    setActiveBoardStep(3);
    setMaxReachedBoardStep((prev) => Math.max(prev, 3));
    const meta = HERE_WE_GO_BOOK_META[bookKey];
    if (!meta) return;
    if (bookKey === 'g1' || bookKey === 'g2') {
      setSelectedUnits([...meta.units]);
      return;
    }
    if (preset === 'midterm') {
      setSelectedUnits(meta.units.filter((u) => ['Starter', 'Unit 1', 'Unit 2', 'Review 1'].includes(u)));
    } else if (preset === 'final') {
      setSelectedUnits(meta.units.filter((u) => ['Unit 3', 'Unit 4', 'Review 2', 'Festival'].includes(u)));
    } else if (preset === 'all') {
      setSelectedUnits([...meta.units]);
    }
  }, [selectedBook]);

  // 當學生登入身分或年級變更時，自動同步預設冊別
  useEffect(() => {
    setSelectedBook(initialBook);
    if (initialBook === 'g1' || initialBook === 'g2') {
      setRangePreset('all');
      setSelectedUnits(HERE_WE_GO_BOOK_META[initialBook]?.units || []);
      setTextbookExamMode('written');
    } else {
      setRangePreset('midterm');
      const meta = HERE_WE_GO_BOOK_META[initialBook];
      if (meta) {
        setSelectedUnits(meta.units.filter((u) => ['Starter', 'Unit 1', 'Unit 2', 'Review 1'].includes(u)));
      }
    }
  }, [initialBook]);

  // 切換冊別時智慧分流
  const handleSelectBook = useCallback((bookNum) => {
    setSelectedBook(bookNum);
    setActiveBoardStep(2);
    setMaxReachedBoardStep((prev) => Math.max(prev, 2));
    if (bookNum === 'g1' || bookNum === 'g2') {
      setRangePreset('all');
      setSelectedUnits(HERE_WE_GO_BOOK_META[bookNum]?.units || []);
      setTextbookExamMode('written');
    } else {
      const preset = rangePreset === 'custom' ? 'midterm' : rangePreset;
      applyRangePreset(preset, bookNum);
    }
  }, [rangePreset, applyRangePreset]);

  const toggleUnit = (unitName) => {
    setSelectedUnits((prev) =>
      prev.includes(unitName) ? prev.filter((u) => u !== unitName) : [...prev, unitName]
    );
  };

  // 課本範圍可用題庫（依 canonicalId 天然去重，杜絕同一題目在組卷中重複出現，並無縫支援 Review 跨單元 scopes）
  const curriculumPool = useMemo(() => {
    const seen = new Set();
    const pool = [];
    for (const q of HERE_WE_GO_MCQ_BANK) {
      if (q.book !== selectedBook) continue;
      const inScope = (selectedUnits || []).includes(q.unit) ||
        (Array.isArray(q.scopes) && q.scopes.some((s) => (selectedUnits || []).includes(s)));
      if (!inScope) continue;
      const cId = q.canonicalId || q.id;
      if (!seen.has(cId)) {
        seen.add(cId);
        pool.push(q);
      }
    }
    return pool;
  }, [selectedBook, selectedUnits]);

  // 個人易錯題列表（相容舊題號與 Canonical 題號）
  const mistakeQuestions = useMemo(() => {
    const mistakeKeys = Object.keys(mistakeMap || {});
    if (mistakeKeys.length === 0) return [];
    const ids = new Set(mistakeKeys);
    const seen = new Set();
    const list = [];
    for (const q of HERE_WE_GO_MCQ_BANK) {
      const cId = q.canonicalId || q.id;
      if (ids.has(q.id) || ids.has(cId)) {
        if (!seen.has(cId)) {
          seen.add(cId);
          list.push(q);
        }
      }
    }
    return list;
  }, [mistakeMap]);

  // Pre-A1 官方模擬題庫 (Scaffold & Registry)
  const tmePool = useMemo(() => {
    if (selectedPreA1Format === 'listening') {
      return TME_PRE_A1_BANK.filter((q) => q.category === 'listening' || q.taskType?.startsWith('L-'));
    }
    if (selectedPreA1Format === 'reading') {
      return TME_PRE_A1_BANK.filter((q) => q.category === 'reading' || q.taskType?.startsWith('R-') || q.taskType?.startsWith('V-'));
    }
    if (selectedPreA1Format === 'writing') {
      return TME_PRE_A1_BANK.filter((q) => q.category === 'writing' || q.taskType === 'W-SCRAMBLE');
    }
    return TME_PRE_A1_BANK;
  }, [selectedPreA1Format]);

  // 縣市學力檢測 (SAA) 題庫 (Scaffold & Registry)
  const saaPool = useMemo(() => {
    const g = Number(selectedSaaGrade) || 4;
    const y = Number(selectedSaaYear) || 115;
    const paper = SAA_ALL_EXAM_PAPERS?.[y]?.[g] || SAA_115_EXAM_PAPERS[g];
    if (paper && selectedSaaFormat === 'standard') {
      return paper.questions;
    }
    let list = SAA_EXAM_BANK.filter((q) => !q.targetGrade || q.targetGrade === g);
    if (selectedSaaFormat === 'listening') {
      list = list.filter((q) => q.section === 'listening' || q.type?.startsWith('L-') || q.taskType?.startsWith('L-') || q.taskType?.startsWith('A-'));
    } else if (selectedSaaFormat === 'reading') {
      list = list.filter((q) => q.section === 'reading' || q.type?.startsWith('R-') || q.taskType?.startsWith('R-') || q.taskType?.startsWith('V-') || q.taskType?.startsWith('G-'));
    }
    return list;
  }, [selectedSaaGrade, selectedSaaFormat, selectedSaaYear]);

  // 計時器（若為正式施測模式則限時 35 分鐘 2100 秒，逾時自動交卷）
  useEffect(() => {
    if (phase !== 'exam' || !startTime) return;
    const timer = setInterval(() => {
      const cur = Math.floor((Date.now() - startTime) / 1000);
      setElapsedSec(cur);
      if (isFormalExam && cur >= 2100) {
        clearInterval(timer);
        finalizeExamRef.current?.();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, startTime, isFormalExam]);

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
      let targetCount = Number(customTargetCount) || 20;
      let sourceList = [];

      if (customPool && Array.isArray(customPool) && customPool.length > 0) {
        sourceList = customTargetCount ? [...customPool].slice(0, Number(customTargetCount)) : [...customPool];
      } else if (scopeMode === 'tme-preA1') {
        targetCount = isFormalExam || selectedPreA1Format === 'standard' ? 30 : 20;
        sourceList = assembleExamForm(tmePool, targetCount);
      } else if (scopeMode === 'ministry-assessment') {
        if (selectedSaaFormat === 'standard') {
          targetCount = 35;
          sourceList = [...saaPool].slice(0, 35);
        } else {
          const reqCount = 20;
          targetCount = Math.min(reqCount, saaPool.length);
          sourceList = assembleExamForm(saaPool, targetCount);
        }
      } else if (scopeMode === 'mistakes') {
        targetCount = Number(questionCountOpt) || 20;
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
        targetCount = Number(questionCountOpt) || 20;
        let pool = curriculumPool;
        const isG1G2 = selectedBook === 'g1' || selectedBook === 'g2';

        if (!isG1G2) {
          if (textbookExamMode === 'written') {
            // 純讀寫筆試：完全避開聽力
            pool = pool.filter((q) => !q.media?.audioText && !q.taskType?.startsWith('L-'));
          } else if (textbookExamMode === 'listening') {
            // 純聽力特訓：將對話題與單字題動態轉換為聽力播放題
            pool = pool.map((q) => {
              if (q.taskType === 'G-DLG') {
                return {
                  ...q,
                  taskType: 'L-RESP',
                  section: 'listening',
                  media: { audioText: q.question.replace(/\s*______\s*/g, ' ... ') },
                  question: '請聽語音對話或問句，選出最適當的回應：'
                };
              }
              if (q.taskType === 'V-MEAN') {
                const token = extractTargetToken(q) || (Array.isArray(q.options) ? q.options[q.answer] : '');
                return {
                  ...q,
                  taskType: 'L-WORD',
                  section: 'listening',
                  media: { audioText: token },
                  question: '請聽發音，選出正確的中文意思：'
                };
              }
              return q;
            }).filter((q) => q.media?.audioText || q.taskType?.startsWith('L-'));
          } else {
            // 綜合測驗 (段考標準)：約 25%~35% 聽力 + 70% 讀寫筆試
            let audioCount = 0;
            const maxAudio = Math.max(2, Math.round(targetCount * 0.3));
            pool = pool.map((q) => {
              if (q.taskType === 'G-DLG' && audioCount < maxAudio * 3) {
                audioCount++;
                return {
                  ...q,
                  taskType: 'L-RESP',
                  section: 'listening',
                  media: { audioText: q.question.replace(/\s*______\s*/g, ' ... ') },
                  question: '請聽語音對話或問句，選出最適當的回應：'
                };
              }
              return q;
            });
          }
        }

        // 使用專業語言測驗組卷藍圖：按大題順序排布、難度遞增、題組不拆散
        sourceList = assembleExamForm(pool, targetCount);
      }

      if (sourceList.length === 0) return;

      // 動態誘答項抽樣與選項隨機洗牌：
      // 1. 若題目具 preserveOptionOrder 或是非題，保留原順序
      // 2. 若 options 數量超過目標選項數（預設 4 選項），從誘答項池動態隨機抽取 (targetCount - 1) 個，與唯一正確答案組合成目標數量的答項 (Dynamic Distractor Sampling)
      // 3. 選項文字與 optionImages 成對綁定同步抽樣與 Fisher-Yates 隨機洗牌
      const prepared = sourceList.map((q) => {
        const isTrueFalse = q.subType === 'read-truefalse' || (q.options?.length === 2 && (q.options[0]?.includes('True') || q.options[0]?.includes('相符')));
        if (q.preserveOptionOrder || isTrueFalse) {
          return {
            ...q,
            options: [...q.options],
            optionImages: q.optionImages ? [...q.optionImages] : undefined,
            answer: q.answer
          };
        }

        const hasOptionImages = Array.isArray(q.optionImages) && q.optionImages.length === q.options.length;
        const combined = q.options.map((text, idx) => ({
          text,
          img: hasOptionImages ? q.optionImages[idx] : null,
          isCorrect: idx === q.answer
        }));

        // 目標呈現選項數（預設 4，若原選項長度 <= 4 則維持原選項長度；亦可由題目自定義 targetOptionCount）
        const targetCount = Math.max(2, Math.min(combined.length, q.targetOptionCount || (combined.length <= 4 ? combined.length : 4)));

        let workingSet = combined;
        // 若選項總數超過目標呈現數，啟動動態誘答項抽樣 (Dynamic Distractor Sampling: 1 正解 + C(n, k) 誘答)
        if (combined.length > targetCount) {
          const correctItem = combined.find((c) => c.isCorrect) || combined[0];
          const distractorPool = combined.filter((c) => !c.isCorrect);

          // 對誘答項池進行隨機洗牌後抽取需要的數量 (targetCount - 1)
          for (let i = distractorPool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [distractorPool[i], distractorPool[j]] = [distractorPool[j], distractorPool[i]];
          }
          const sampledDistractors = distractorPool.slice(0, targetCount - 1);
          workingSet = [correctItem, ...sampledDistractors];
        }

        // Fisher-Yates 隨機洗牌工作集合
        for (let i = workingSet.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [workingSet[i], workingSet[j]] = [workingSet[j], workingSet[i]];
        }

        return {
          ...q,
          options: workingSet.map((c, idx) => {
            // 若為圖片選項且文字為通用圖片標籤，同步重新格式化為當前對應標籤
            if (hasOptionImages && (/^圖片\s*\([A-Z0-9]\)$/.test(c.text) || /^選項\s*\([A-Z0-9]\)$/.test(c.text))) {
              return `圖片 (${CHOICE_LABELS[idx] || idx + 1})`;
            }
            return c.text;
          }),
          optionImages: hasOptionImages ? workingSet.map((c) => c.img) : q.optionImages,
          answer: workingSet.findIndex((c) => c.isCorrect)
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
    [
      questionCountOpt,
      scopeMode,
      selectedSaaFormat,
      selectedPreA1Format,
      isFormalExam,
      mistakeQuestions,
      currentStudent?.grade,
      curriculumPool,
      tmePool,
      saaPool,
      textbookExamMode,
      selectedBook
    ]
  );

  // 語音朗讀題幹（支援多角色對話男女聲；一、二年級中文題幹自動使用 zh-TW 語音讀題；三～六年級英文題幹使用 en-US 朗讀；支援正式檢定雙次播放協定）
  const speakQuestion = (text, repeatTimes = 1) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      const raw = String(text || '');
      const hasChinese = /[\u4e00-\u9fa5]/.test(raw);
      if (!hasChinese && isDialogue(raw)) {
        playDialogueSpeech({ text: raw });
        return;
      }
      window.speechSynthesis.cancel();
      const clean = raw
        .replace(/_{2,}/g, hasChinese ? ' 空格 ' : ' blank ')
        .replace(/\bA:\s*/g, '')
        .replace(/\bB:\s*/g, '');
      const utter = new SpeechSynthesisUtterance(clean);
      utter.lang = hasChinese ? 'zh-TW' : 'en-US';
      utter.rate = 0.9;
      if (!hasChinese && window.speechSynthesis.getVoices) {
        const voices = window.speechSynthesis.getVoices() || [];
        const enVoices = voices.filter(v => (v?.lang || '').toLowerCase().replace('_', '-').startsWith('en'));
        const usVoice = enVoices.find(v => (v?.lang || '').toLowerCase().replace('_', '-').startsWith('en-us')) || enVoices[0];
        if (usVoice) utter.voice = usVoice;
      }
      if (repeatTimes > 1) {
        utter.onend = () => {
          setTimeout(() => {
            try {
              const utter2 = new SpeechSynthesisUtterance(clean);
              utter2.lang = hasChinese ? 'zh-TW' : 'en-US';
              utter2.rate = 0.9;
              if (utter.voice) utter2.voice = utter.voice;
              window.speechSynthesis.speak(utter2);
            } catch {}
          }, 2000);
        };
      }
      window.speechSynthesis.speak(utter);
    } catch {
      // Ignore TTS errors
    }
  };

  // 第 0 頁考前音量測試發音
  const runAudioTest = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    setIsPlayingAudioTest(true);
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance('Welcome to the Wutai English Test. Can you hear me clearly? Testing one, two, three.');
      utter.lang = 'en-US';
      utter.rate = 0.9;
      const voices = window.speechSynthesis.getVoices() || [];
      const enVoices = voices.filter(v => (v?.lang || '').toLowerCase().replace('_', '-').startsWith('en'));
      const usVoice = enVoices.find(v => (v?.lang || '').toLowerCase().replace('_', '-').startsWith('en-us')) || enVoices[0];
      if (usVoice) utter.voice = usVoice;
      utter.onend = () => setIsPlayingAudioTest(false);
      utter.onerror = () => setIsPlayingAudioTest(false);
      window.speechSynthesis.speak(utter);
    } catch {
      setIsPlayingAudioTest(false);
    }
  }, []);

  // 第 0 頁沒帶耳機時，一鍵切換純筆試並即時重組
  const switchToWrittenMode = useCallback(() => {
    setTextbookExamMode('written');
    const pool = curriculumPool.filter((q) => !q.media?.audioText && !q.taskType?.startsWith('L-'));
    const sourceList = assembleExamForm(pool, Number(questionCountOpt) || 20);
    const prepared = sourceList.map((q) => {
      const isTrueFalse = q.subType === 'read-truefalse' || (q.options?.length === 2 && (q.options[0]?.includes('True') || q.options[0]?.includes('相符')));
      if (q.preserveOptionOrder || isTrueFalse) return { ...q };
      const rawOptions = Array.isArray(q.options) ? [...q.options] : [];
      if (rawOptions.length <= 4) return { ...q };
      const correctOpt = rawOptions[0];
      const distractors = rawOptions.slice(1);
      for (let i = distractors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
      }
      const chosenDistractors = distractors.slice(0, 3);
      const workingSet = [correctOpt, ...chosenDistractors];
      const indices = [0, 1, 2, 3];
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      const shuffledOptions = indices.map((idx) => workingSet[idx]);
      const newAnswer = indices.indexOf(0);
      return { ...q, options: shuffledOptions, answer: newAnswer };
    });
    setQuestions(prepared);
  }, [curriculumPool, questionCountOpt]);

  // 正式施測模式：進入聽力試題時自動觸發雙次朗讀協定（間隔 2 秒播放兩遍）
  useEffect(() => {
    if (phase !== 'exam' || !isFormalExam) return;
    const curQ = questions[currentIndex];
    if (!curQ) return;
    const isListening =
      curQ.category === 'listening' ||
      curQ.section === 'listening' ||
      curQ.taskType?.startsWith('L-') ||
      curQ.taskType?.startsWith('A-') ||
      curQ.subType?.startsWith('listen-') ||
      curQ.taskType === 'V-AUDIO-WORD' ||
      curQ.taskType === 'V-AUDIO-PIC' ||
      Boolean(curQ.media?.audioText);
    if (isListening) {
      const timer = setTimeout(() => {
        speakQuestion(curQ.media?.audioText || curQ.question, 2);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [phase, currentIndex, isFormalExam, questions]);

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
      const targetId = q.canonicalId || q.id;
      if (isRight) {
        correctCount++;
        // 在「個人易錯題複習」模式中答對既有易錯題：連續答對次數 +1，達 2 次即移出易錯池
        if (scopeMode === 'mistakes' && (nextMistakes[targetId] || nextMistakes[q.id])) {
          const currentRec = nextMistakes[targetId] || nextMistakes[q.id];
          const nextStreak = (currentRec.streak || 0) + 1;
          if (nextStreak >= 2) {
            delete nextMistakes[targetId];
            delete nextMistakes[q.id];
            graduatedCount++;
          } else {
            delete nextMistakes[q.id];
            nextMistakes[targetId] = {
              ...currentRec,
              streak: nextStreak,
              updatedAt: Date.now()
            };
          }
        }
      } else {
        // 答錯：加入易錯池並將連續答對紀錄歸零（以 Canonical ID 統一索引）
        if (!nextMistakes[targetId] && !nextMistakes[q.id]) {
          addedMistakeCount++;
        }
        const prevWrong = (nextMistakes[targetId]?.wrongCount || nextMistakes[q.id]?.wrongCount || 0);
        delete nextMistakes[q.id];
        nextMistakes[targetId] = {
          wrongCount: prevWrong + 1,
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

    // 記錄三大檢定動態滾動精熟狀態
    const currentSid = currentStudent?.student_id || currentStudent?.id || 'guest';
    const examTrack =
      scopeMode === 'tme-preA1'
        ? 'tme-preA1'
        : scopeMode === 'ministry-assessment'
        ? 'ministry-assessment'
        : 'curriculum';
    const updatedSnap = recordExamMasterySession(
      currentSid,
      examTrack,
      questions,
      answers,
      isFormalExam || selectedPreA1Format === 'standard'
    );

    // 若為 Pre-A1 且學生已登入，同步滾動精熟度至英雄榜 (mode: prea1-mastery)
    if (scopeMode === 'tme-preA1' && isLoggedIn) {
      const tmeTrack = updatedSnap?.tracks?.['tme-preA1'];
      if (tmeTrack) {
        const mCount = tmeTrack.mastered_count || 0;
        const mRate = Math.round((mCount / (tmeTrack.total_items || 300)) * 100);
        recordPreA1MasteryLeaderboard({
          grade: currentStudent?.grade,
          name: formatStudentDisplayName(currentStudent),
          studentId: currentSid,
          masteredCount: mCount,
          totalItems: tmeTrack.total_items || 300,
          masteryRate: mRate
        }).catch(() => {});
      }
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
    currentStudent?.student_id,
    currentStudent?.id,
    isLoggedIn,
    addCoins,
    onComplete,
    elapsedSec,
    inProgressKey,
    isFormalExam,
    selectedPreA1Format
  ]);

  finalizeExamRef.current = finalizeExam;

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

      {/* 學生回報成功 Toast 訊息 */}
      {reportToastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-xl animate-fadeIn flex items-center gap-2">
          <CheckCircle2 size={18} />
          <span>{reportToastMessage}</span>
        </div>
      )}

      {/* 中央一頁式專業檢定容器 */}
      <div className="relative z-10 w-full max-w-5xl h-full max-h-[820px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-slate-100 transition-opacity duration-150">
        {children}
      </div>

      {/* 學生試題疑義回報快答彈窗 */}
      {showReportModal && reportingQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-700 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-sm sm:text-base">
                <AlertTriangle size={18} />
                <span>題目有什麼問題呢？</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowReportModal(false);
                  setReportingQuestion(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              點選最接近的情況，老師會收到通知為大家修正（免打字）：
            </p>

            <div className="space-y-2">
              {STUDENT_REPORT_TAGS.map((tag) => {
                const isSelected = selectedReportTag === tag.id;
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => setSelectedReportTag(tag.id)}
                    className={`w-full p-2.5 sm:p-3 rounded-xl border text-left text-xs sm:text-sm font-bold flex items-center gap-2.5 transition cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/90 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/30'
                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-slate-600 bg-slate-50/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span className="text-base sm:text-lg shrink-0">{tag.icon}</span>
                    <span className="flex-1 leading-snug">{tag.label}</span>
                    {isSelected && <CheckCircle2 size={16} className="text-indigo-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setShowReportModal(false);
                  setReportingQuestion(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                disabled={isSubmittingReport}
                onClick={handleSubmitReport}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                {isSubmittingReport ? '送出中...' : '確認送出 🚀'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ============================================================================
  // STEP 1 & 2: 一頁式檢定範圍與題數設定 (Setup Screen - Zero Scroll)
  // ============================================================================
  if (phase === 'setup') {
    const bookMeta = HERE_WE_GO_BOOK_META[selectedBook] || HERE_WE_GO_BOOK_META[1];
    const mistakeCount = mistakeQuestions.length;
    const canStart =
      scopeMode === 'mistakes'
        ? true
        : scopeMode === 'curriculum'
        ? curriculumPool.length > 0
        : scopeMode === 'tme-preA1'
        ? tmePool.length > 0
        : scopeMode === 'ministry-assessment'
        ? saaPool.length > 0
        : false;

    if (setupSubView === 'preA1-dashboard') {
      return renderShell(
        <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-contain">
          <PreA1MasteryDashboard
            student={currentStudent}
            initialTrack={masteryInitialTrack || 'tme-preA1'}
            onBack={() => {
              if (masteryInitialTrack === 'ministry-assessment') setSetupSubView('saa');
              else if (masteryInitialTrack === 'curriculum') setSetupSubView('textbook');
              else setSetupSubView('preA1');
            }}
            onStartDrill={(subType, count = 5, mode = 'all', track = 'tme-preA1') => {
              const studentId = currentStudent?.student_id || currentStudent?.id || 'guest';
              const snap = loadStudentMastery(studentId);
              const trackKey = track || 'tme-preA1';
              const itemsMap = snap?.tracks?.[trackKey]?.items || {};

              let bank = [];
              if (trackKey === 'tme-preA1') {
                bank = TME_PRE_A1_BANK;
                setScopeMode('tme-preA1');
              } else if (trackKey === 'ministry-assessment') {
                bank = SAA_EXAM_BANK;
                setScopeMode('ministry-assessment');
              } else {
                bank = HERE_WE_GO_MCQ_BANK;
                setScopeMode('curriculum');
              }

              let drillPool = bank.filter((q) => {
                if (trackKey === 'curriculum') {
                  const bookNum = Number(subType.replace('b', ''));
                  return q.subType === subType || q.bookGroup === subType || q.book === bookNum;
                }
                return q.subType === subType || q.taskType === subType;
              });
              if (drillPool.length === 0) {
                drillPool = bank;
              }

              if (mode === 'mistakes') {
                const mistakePool = drillPool.filter((q) => {
                  const it = itemsMap[q.id];
                  return it && it.status !== MASTERY_STATES.MASTERED;
                });
                if (mistakePool.length > 0) drillPool = mistakePool;
              } else if (mode === 'new') {
                const newPool = drillPool.filter((q) => !itemsMap[q.id]);
                if (newPool.length > 0) drillPool = newPool;
              }

              if (drillPool.length > 0) {
                // Fisher-Yates 隨機洗牌
                const shuffled = [...drillPool];
                for (let i = shuffled.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                const selected = shuffled.slice(0, Math.min(count, shuffled.length));
                setIsFormalExam(false);
                startExamSession(selected, selected.length, true);
              }
            }}
          />
        </div>
      );
    }

    return renderShell(
      <>
        {/* 頂端精簡導覽列 */}
        <div className="shrink-0 px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/80 dark:bg-slate-900/80">
          {setupSubView === 'hub' ? (
            <button
              type="button"
              onClick={onBack}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft size={16} />
              離開大廳
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSetupSubView('hub')}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft size={16} />
              返回選單
            </button>
          )}

          <div className="flex items-center gap-2">
            {setupSubView === 'hub' && <Award className="text-indigo-600 dark:text-indigo-400" size={22} />}
            {setupSubView === 'textbook' && <BookOpen className="text-indigo-600 dark:text-indigo-400" size={22} />}
            {setupSubView === 'saa' && <ClipboardCheck className="text-purple-600 dark:text-purple-400" size={22} />}
            {setupSubView === 'preA1' && <Award className="text-sky-600 dark:text-sky-400" size={22} />}
            {setupSubView === 'mistakes' && <RotateCcw className="text-rose-600 dark:text-rose-400" size={22} />}
            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {setupSubView === 'hub' && '霧臺英語檢定館'}
                {setupSubView === 'textbook' && '課本題庫練習'}
                {setupSubView === 'saa' && '學力檢測練習'}
                {setupSubView === 'preA1' && 'Pre A1 檢測練習'}
                {setupSubView === 'mistakes' && '個人易錯題複習'}
              </h1>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
                {setupSubView === 'hub' && 'Wutai English Assessment Arena'}
                {setupSubView === 'textbook' && 'Here We Go! 分冊分單元檢定'}
                {setupSubView === 'saa' && '教育部 SAA 臺灣學生學習成就評量'}
                {setupSubView === 'preA1' && 'Test My English 官方指標模擬'}
                {setupSubView === 'mistakes' && '精準鎖定錯題 • 連續答對 2 次出庫'}
              </div>
            </div>
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

        {/* 中央設定主體（彈性自適應高度、空間不足滑動免重疊） */}
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
                    {savedSession.scopeMode === 'mistakes'
                      ? '易錯題複習'
                      : savedSession.scopeMode === 'tme-preA1'
                      ? 'Pre-A1 官方模擬檢定'
                      : savedSession.scopeMode === 'ministry-assessment'
                      ? 'SAA 學力成就模擬'
                      : `${formatBookLabel(savedSession.selectedBook)}檢定`} • 6 小時內有效，可隨時接續
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
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition cursor-pointer"
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
                    if (savedSession.scopeMode) setScopeMode(savedSession.scopeMode);
                    setSavedSession(null);
                    setPhase('exam');
                  }}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-sm flex items-center gap-1 transition cursor-pointer"
                >
                  <span>接續作答</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* 模式 A：四大膠囊首頁 (setupSubView === 'hub')                          */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {setupSubView === 'hub' && (
            <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full gap-3 sm:gap-4 my-auto py-2">
              <div className="text-center sm:text-left">
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
                  請選擇檢定練習模式
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  涵蓋校內課本段考題庫、教育部縣市學力檢測與 Test My English 官方指標
                </p>
              </div>

              {/* 膠囊 1: 課本題庫練習 */}
              <button
                type="button"
                onClick={() => {
                  setSetupSubView('textbook');
                  setScopeMode('curriculum');
                }}
                className="w-full text-left p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 hover:bg-indigo-50/40 dark:hover:bg-slate-800 border-2 border-indigo-200/80 dark:border-indigo-900/60 border-l-6 border-l-indigo-600 hover:border-indigo-500 dark:hover:border-indigo-400 shadow-md hover:shadow-xl transition-all duration-200 group flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <BookOpen size={24} className="sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        課本題庫練習
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        3,317 題分冊精熟
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 sm:line-clamp-none">
                      何嘉仁 Here We Go! 第 1～8 冊與銜接單元，自選冊別、單元與題數
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-black text-xs sm:text-sm">
                  <span className="hidden sm:inline">進入練習</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* 膠囊 2: 學力檢測練習 */}
              <button
                type="button"
                onClick={() => {
                  setSetupSubView('saa');
                  setScopeMode('ministry-assessment');
                }}
                className="w-full text-left p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 hover:bg-purple-50/40 dark:hover:bg-slate-800 border-2 border-purple-200/80 dark:border-purple-900/60 border-l-6 border-l-purple-600 hover:border-purple-500 dark:hover:border-purple-400 shadow-md hover:shadow-xl transition-all duration-200 group flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <ClipboardCheck size={24} className="sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        學力檢測練習
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                        SAA 4～6年級學測
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 sm:line-clamp-none">
                      參考教育部 SAA 學習成就評量：聽 15 閱 20 正式卷或專項特訓（已建立 75 題全真題庫）
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1 text-purple-600 dark:text-purple-400 font-black text-xs sm:text-sm">
                  <span className="hidden sm:inline">進入練習</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* 膠囊 3: Pre A1 檢測練習 */}
              <button
                type="button"
                onClick={() => {
                  setSetupSubView('preA1');
                  setScopeMode('tme-preA1');
                }}
                className="w-full text-left p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 hover:bg-sky-50/40 dark:hover:bg-slate-800 border-2 border-sky-200/80 dark:border-sky-900/60 border-l-6 border-l-sky-600 hover:border-sky-500 dark:hover:border-sky-400 shadow-md hover:shadow-xl transition-all duration-200 group flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <Award size={24} className="sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        Pre A1 檢測練習
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                        教育部官方標準
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 sm:line-clamp-none">
                      Test My English 官方指標：聽力 15 題 ＋ 閱讀 15 題（達 21 題合格）
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1 text-sky-600 dark:text-sky-400 font-black text-xs sm:text-sm">
                  <span className="hidden sm:inline">進入練習</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* 膠囊 4: 易錯題複習 */}
              <button
                type="button"
                onClick={() => {
                  setSetupSubView('mistakes');
                  setScopeMode('mistakes');
                }}
                className="w-full text-left p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 hover:bg-rose-50/40 dark:hover:bg-slate-800 border-2 border-rose-200/80 dark:border-rose-900/60 border-l-6 border-l-rose-600 hover:border-rose-500 dark:hover:border-rose-400 shadow-md hover:shadow-xl transition-all duration-200 group flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <RotateCcw size={24} className="sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                        易錯題複習
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        {mistakeCount} 題待複習
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 sm:line-clamp-none">
                      精準重測曾答錯題目，題數不足自動由本年級補足；連續答對 2 次自動移出
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1 text-rose-600 dark:text-rose-400 font-black text-xs sm:text-sm">
                  <span className="hidden sm:inline">進入練習</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* 模式 B：課本題庫練習 (setupSubView === 'textbook')                     */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* 模式 B：課本題庫練習 (setupSubView === 'textbook') - 四聯階梯式布題台      */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {setupSubView === 'textbook' && (
            <div className="flex-1 flex flex-col gap-3 min-h-0">
              {/* 頂部極簡標籤橫幅（精熟診斷卡入口與題庫統計） */}
              <div className="shrink-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 dark:from-amber-950/40 dark:via-orange-950/40 dark:to-amber-950/40 border border-amber-300/40 dark:border-amber-700/40 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <BookOpen size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                      <span>Here We Go 3,317 全冊題庫</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200 shrink-0">
                        1～8 冊 · 字母專冊 · 國一先修
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMasteryInitialTrack('curriculum');
                    setSetupSubView('preA1-dashboard');
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-black shadow-xs flex items-center gap-1 transition cursor-pointer shrink-0"
                >
                  <BookOpen size={13} />
                  <span>課本精熟卡 ➔</span>
                </button>
              </div>

              {/* 四聯階梯式任務控制台 (4-Column Progressive Mission Board - Zero Scroll on iPad) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 sm:gap-3 flex-1 min-h-0">
                {/* ───────────────────────────────────────────────────────────── */}
                {/* 欄 1：01 TARGET 冊別選擇                                        */}
                {/* ───────────────────────────────────────────────────────────── */}
                <div
                  onClick={() => setActiveBoardStep(1)}
                  className={`rounded-2xl p-3 flex flex-col gap-2 min-h-0 transition-all cursor-pointer ${
                    activeBoardStep === 1
                      ? 'border-2 border-indigo-500 dark:border-indigo-400 bg-white dark:bg-slate-800 shadow-md ring-2 ring-indigo-500/25 dark:ring-indigo-400/25 opacity-100'
                      : 1 <= maxReachedBoardStep
                      ? 'border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 shadow-xs opacity-95 hover:border-indigo-200'
                      : 'border-2 border-dashed border-slate-200 dark:border-slate-750 bg-slate-50/70 dark:bg-slate-850/60 opacity-45 hover:opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center transition ${
                        activeBoardStep === 1
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        1
                      </span>
                      <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        01 TARGET 冊別
                      </span>
                    </div>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                      isSelectedBookOwnGrade
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                    }`}>
                      {isSelectedBookOwnGrade ? '本年級計分' : '練習'}
                    </span>
                  </div>

                  {/* 冊別按鈕網格 */}
                  <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto pr-0.5 min-h-0">
                    {/* 低年級字母專冊 */}
                    <div className="grid grid-cols-2 gap-1">
                      {['g1', 'g2'].map((bKey) => {
                        const isSelected = selectedBook === bKey;
                        const isOwn = isBookInOwnGrade(bKey, currentStudent?.grade, 'mcq-exam');
                        return (
                          <button
                            key={bKey}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectBook(bKey);
                            }}
                            className={`py-2 px-2 rounded-xl border text-center transition flex flex-col items-center justify-center cursor-pointer ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs font-black'
                                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                            }`}
                          >
                            <span className="text-sm font-black leading-tight">{formatBookLabel(bKey)}</span>
                            {isOwn && (
                              <span className={`text-[10px] font-bold ${isSelected ? 'text-amber-200' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                ★ 本年級
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* 3~6 年級 1~8 冊 */}
                    <div className="grid grid-cols-2 gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((bNum) => {
                        const isSelected = selectedBook === bNum;
                        const isOwn = isBookInOwnGrade(String(bNum), currentStudent?.grade, 'mcq-exam');
                        return (
                          <button
                            key={bNum}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectBook(bNum);
                            }}
                            className={`py-2 px-2 rounded-xl border text-center transition flex flex-col items-center justify-center cursor-pointer ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs font-black'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                            }`}
                          >
                            <span className="text-sm font-black leading-tight">{formatBookLabel(bNum)}</span>
                            {isOwn && (
                              <span className={`text-[10px] font-bold ${isSelected ? 'text-amber-200' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                ★ 本年級
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* 國一先修 */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectBook(9);
                      }}
                      className={`w-full py-2 px-2 rounded-xl border text-center transition flex items-center justify-center gap-1 cursor-pointer ${
                        selectedBook === 9
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs font-black'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                      }`}
                    >
                      <span className="text-sm font-black">國一先修 (Book 9)</span>
                    </button>
                  </div>
                </div>

                {/* ───────────────────────────────────────────────────────────── */}
                {/* 欄 2：02 SCOPE 評量範圍                                        */}
                {/* ───────────────────────────────────────────────────────────── */}
                <div
                  onClick={() => setActiveBoardStep(2)}
                  className={`rounded-2xl p-3 flex flex-col gap-2 min-h-0 transition-all cursor-pointer ${
                    activeBoardStep === 2
                      ? 'border-2 border-indigo-500 dark:border-indigo-400 bg-white dark:bg-slate-800 shadow-md ring-2 ring-indigo-500/25 dark:ring-indigo-400/25 opacity-100'
                      : 2 <= maxReachedBoardStep
                      ? 'border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 shadow-xs opacity-95 hover:border-indigo-200'
                      : 'border-2 border-dashed border-slate-200 dark:border-slate-750 bg-slate-50/70 dark:bg-slate-850/60 opacity-45 hover:opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center transition ${
                        activeBoardStep === 2
                          ? 'bg-amber-600 text-white ring-2 ring-amber-300'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        2
                      </span>
                      <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        02 SCOPE 範圍
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold truncate">
                      {curriculumPool.length} 題可用
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-0.5 min-h-0">
                    {/* 1, 2 年級：極簡自動通道 */}
                    {(selectedBook === 'g1' || selectedBook === 'g2') ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
                        <Type size={24} className="text-amber-600 dark:text-amber-400 mb-1" />
                        <div className="text-sm font-black text-amber-900 dark:text-amber-100">
                          全字母闖關檢定
                        </div>
                        <p className="text-[10px] text-amber-700 dark:text-amber-300 mt-1 leading-relaxed">
                          涵蓋英文字母前後順序、缺漏字母填空與大小寫配對
                        </p>
                        <span className="mt-2 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                          ✓ 系統已全自動選定
                        </span>
                      </div>
                    ) : (
                      <>
                        {/* 3~6 年級三大段考快選膠囊 */}
                        <div className="flex flex-col gap-1.5">
                          {/* 上半冊 (期中考) */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              applyRangePreset('midterm');
                            }}
                            className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-1.5 cursor-pointer ${
                              rangePreset === 'midterm'
                                ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/60 text-amber-950 dark:text-amber-100 font-black shadow-xs ring-1 ring-amber-500'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-300 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="text-sm sm:text-base font-black flex items-center gap-1">
                                <span>上半冊 (期中考)</span>
                              </div>
                              <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                Starter, Unit 1, Unit 2, Review 1
                              </div>
                            </div>
                            {rangePreset === 'midterm' && <CheckCircle2 size={16} className="text-amber-600 shrink-0" />}
                          </button>

                          {/* 下半冊 (期末考) */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              applyRangePreset('final');
                            }}
                            className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-1.5 cursor-pointer ${
                              rangePreset === 'final'
                                ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/60 text-amber-950 dark:text-amber-100 font-black shadow-xs ring-1 ring-amber-500'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-300 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="text-sm sm:text-base font-black flex items-center gap-1">
                                <span>下半冊 (期末考)</span>
                              </div>
                              <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                Unit 3, Unit 4, Review 2, Festival
                              </div>
                            </div>
                            {rangePreset === 'final' && <CheckCircle2 size={16} className="text-amber-600 shrink-0" />}
                          </button>

                          {/* 全選 / 全冊總複習 */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              applyRangePreset('all');
                            }}
                            className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-1.5 cursor-pointer ${
                              rangePreset === 'all'
                                ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/60 text-amber-950 dark:text-amber-100 font-black shadow-xs ring-1 ring-amber-500'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-300 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="text-sm sm:text-base font-black flex items-center gap-1">
                                <span>全冊總複習 (全選)</span>
                              </div>
                              <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                全冊 8 個單元總動員
                              </div>
                            </div>
                            {rangePreset === 'all' && <CheckCircle2 size={16} className="text-amber-600 shrink-0" />}
                          </button>
                        </div>

                        {/* 自選單元折疊抽屜 */}
                        <div className="mt-auto pt-1 border-t border-slate-100 dark:border-slate-700">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRangePreset('custom');
                              setActiveBoardStep(2);
                              setIsCustomUnitOpen((prev) => !prev);
                            }}
                            className={`w-full py-1.5 px-2 rounded-lg text-xs font-black border flex items-center justify-between cursor-pointer transition ${
                              rangePreset === 'custom'
                                ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 text-indigo-700 dark:text-indigo-300'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <SlidersHorizontal size={13} />
                              <span>自選特定單元 ({selectedUnits.length})</span>
                            </span>
                            <span className="text-[10px] font-semibold">{isCustomUnitOpen ? '▲ 收合' : '▼ 展開'}</span>
                          </button>

                          {isCustomUnitOpen && (
                            <div className="grid grid-cols-2 gap-1 mt-1 p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 max-h-36 overflow-y-auto">
                              {bookMeta.units.map((unitName) => {
                                const checked = selectedUnits.includes(unitName);
                                return (
                                  <button
                                    key={unitName}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setRangePreset('custom');
                                      toggleUnit(unitName);
                                    }}
                                    className={`p-1.5 rounded-lg border text-left text-xs font-bold truncate flex items-center justify-between cursor-pointer ${
                                      checked
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                                    }`}
                                  >
                                    <span className="truncate">{unitName}</span>
                                    {checked && <Check size={12} className="shrink-0 ml-0.5" />}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* ───────────────────────────────────────────────────────────── */}
                {/* 欄 3：03 MODE 施測型態                                         */}
                {/* ───────────────────────────────────────────────────────────── */}
                <div
                  onClick={() => setActiveBoardStep(3)}
                  className={`rounded-2xl p-3 flex flex-col gap-2 min-h-0 transition-all cursor-pointer ${
                    activeBoardStep === 3
                      ? 'border-2 border-indigo-500 dark:border-indigo-400 bg-white dark:bg-slate-800 shadow-md ring-2 ring-indigo-500/25 dark:ring-indigo-400/25 opacity-100'
                      : 3 <= maxReachedBoardStep
                      ? 'border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 shadow-xs opacity-95 hover:border-indigo-200'
                      : 'border-2 border-dashed border-slate-200 dark:border-slate-750 bg-slate-50/70 dark:bg-slate-850/60 opacity-45 hover:opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center transition ${
                        activeBoardStep === 3
                          ? 'bg-purple-600 text-white ring-2 ring-purple-300'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        3
                      </span>
                      <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        03 MODE 型態
                      </span>
                    </div>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                      聽力/筆試配置
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-0.5 min-h-0">
                    {/* 1, 2 年級：極簡自動通道 */}
                    {(selectedBook === 'g1' || selectedBook === 'g2') ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-3 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60">
                        <GraduationCap size={24} className="text-purple-600 dark:text-purple-400 mb-1" />
                        <div className="text-sm font-black text-purple-900 dark:text-purple-100">
                          字母圖文全題型
                        </div>
                        <p className="text-[10px] text-purple-700 dark:text-purple-300 mt-1 leading-relaxed">
                          自適應派發純字母、大小寫配對與趣味圖文題，免考複雜文法與長句
                        </p>
                        <span className="mt-2 text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 dark:bg-purple-900 dark:text-purple-200">
                          ✓ 低年級專屬通道
                        </span>
                      </div>
                    ) : (
                      <>
                        {/* 綜合測驗 */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTextbookExamMode('comprehensive');
                            setActiveBoardStep(4);
                            setMaxReachedBoardStep((prev) => Math.max(prev, 4));
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-1.5 cursor-pointer ${
                            textbookExamMode === 'comprehensive'
                              ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/60 text-purple-950 dark:text-purple-100 font-black shadow-xs ring-1 ring-purple-500'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-300 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="text-sm sm:text-base font-black flex items-center gap-1.5">
                              <Headphones size={15} className="text-purple-600 shrink-0" />
                              <span>綜合測驗</span>
                              <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200 shrink-0">
                                段考標準
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">
                              含聽力 (約30%) ＋ 讀寫 (約70%)
                            </div>
                          </div>
                          {textbookExamMode === 'comprehensive' && <CheckCircle2 size={16} className="text-purple-600 shrink-0" />}
                        </button>

                        {/* 純筆試測驗 */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTextbookExamMode('written');
                            setActiveBoardStep(4);
                            setMaxReachedBoardStep((prev) => Math.max(prev, 4));
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-1.5 cursor-pointer ${
                            textbookExamMode === 'written'
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-100 font-black shadow-xs ring-1 ring-indigo-500'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="text-sm sm:text-base font-black flex items-center gap-1.5">
                              <FileText size={15} className="text-indigo-600 shrink-0" />
                              <span>純筆試測驗</span>
                              <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 shrink-0">
                                避開聽力
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">
                              100% 讀寫選擇題，安靜教室首選
                            </div>
                          </div>
                          {textbookExamMode === 'written' && <CheckCircle2 size={16} className="text-indigo-600 shrink-0" />}
                        </button>

                        {/* 純聽力特訓 */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTextbookExamMode('listening');
                            setActiveBoardStep(4);
                            setMaxReachedBoardStep((prev) => Math.max(prev, 4));
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-1.5 cursor-pointer ${
                            textbookExamMode === 'listening'
                              ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/60 text-sky-950 dark:text-sky-100 font-black shadow-xs ring-1 ring-sky-500'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-sky-300 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="text-sm sm:text-base font-black flex items-center gap-1.5">
                              <Volume2 size={15} className="text-sky-600 shrink-0" />
                              <span>純聽力特訓</span>
                              <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-sky-200 text-sky-800 dark:bg-sky-900 dark:text-sky-200 shrink-0">
                                聽力衝刺
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">
                              全卷皆為聽力理解問答，戴耳機練習
                            </div>
                          </div>
                          {textbookExamMode === 'listening' && <CheckCircle2 size={16} className="text-sky-600 shrink-0" />}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* ───────────────────────────────────────────────────────────── */}
                {/* 欄 4：04 SCALE 題數規模 (右下控制列統一行使啟動職責)               */}
                {/* ───────────────────────────────────────────────────────────── */}
                <div
                  onClick={() => setActiveBoardStep(4)}
                  className={`rounded-2xl p-3 flex flex-col justify-between gap-2 min-h-0 transition-all cursor-pointer ${
                    activeBoardStep === 4
                      ? 'border-2 border-indigo-500 dark:border-indigo-400 bg-white dark:bg-slate-800 shadow-md ring-2 ring-indigo-500/25 dark:ring-indigo-400/25 opacity-100'
                      : 4 <= maxReachedBoardStep
                      ? 'border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 shadow-xs opacity-95 hover:border-indigo-200'
                      : 'border-2 border-dashed border-slate-200 dark:border-slate-750 bg-slate-50/70 dark:bg-slate-850/60 opacity-45 hover:opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center transition ${
                        activeBoardStep === 4
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        4
                      </span>
                      <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        04 SCALE 題數
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      測驗規模
                    </span>
                  </div>

                  {/* 題數選擇 */}
                  <div className="flex flex-col gap-1.5">
                    {(selectedBook === 'g1' || selectedBook === 'g2' ? [
                      { count: 10, label: '10 題', sub: '小試身手 • 最高 +4 金幣' },
                      { count: 20, label: '20 題', sub: '勇者挑戰 • 最高 +8 金幣' }
                    ] : [
                      { count: 10, label: '10 題', sub: '速測 • 最高 +4 金幣' },
                      { count: 20, label: '20 題', sub: '標準段考 • 最高 +8 金幣 (推薦)' },
                      { count: 50, label: '50 題', sub: '大考衝刺 • 最高 +20 金幣' }
                    ]).map((opt) => {
                      const active = questionCountOpt === opt.count;
                      return (
                        <button
                          key={opt.count}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuestionCountOpt(opt.count);
                            setActiveBoardStep(4);
                            setMaxReachedBoardStep(4);
                          }}
                          className={`w-full py-2.5 px-3 rounded-xl border text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                            active
                              ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 font-black shadow-xs ring-1 ring-emerald-500'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-300'
                          }`}
                        >
                          <div>
                            <span className="text-sm sm:text-base font-black">{opt.label}</span>
                            <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">{opt.sub}</div>
                          </div>
                          {active && <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* 下半部：精練布題摘要卡（視線引導至右下角全站啟動按鈕） */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs">
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-bold">
                        <span>已選配置摘要</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-black">{questionCountOpt} 題</span>
                      </div>
                      <div className="mt-1 font-black text-slate-800 dark:text-slate-100 truncate text-xs sm:text-sm">
                        {formatBookLabel(selectedBook)} • {rangePreset === 'midterm' ? '期中考範圍' : rangePreset === 'final' ? '期末考範圍' : rangePreset === 'all' ? '全冊範圍' : `${selectedUnits.length} 個單元`}
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        {textbookExamMode === 'comprehensive' ? '聽力 + 讀寫筆試' : textbookExamMode === 'written' ? '純讀寫筆試' : '純聽力特訓'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* 模式 C：學力檢測練習 (setupSubView === 'saa')                          */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {setupSubView === 'saa' && (
            <div className="flex flex-col gap-3">
              {/* SAA 頂部精熟診斷卡捷徑橫幅 */}
              <div className="shrink-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-emerald-950/40 border border-emerald-300/40 dark:border-emerald-700/40 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ClipboardCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span>教育部 SAA 學力成就 180 全題庫</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                        聽力三大題 · 閱讀二大題
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      動態滾動精熟體系：錯題連對 2 次翻盤解鎖為精熟，拒絕歷史錯誤懲罰
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMasteryInitialTrack('ministry-assessment');
                    setSetupSubView('preA1-dashboard');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
                >
                  <ClipboardCheck size={15} />
                  <span>查看學力精熟診斷卡 ➔</span>
                </button>
              </div>

              {/* 步驟 1：選擇測驗年度 */}
              <div className="shrink-0 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-700/70 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-xs font-black flex items-center justify-center">
                      1
                    </span>
                    <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      選擇施測年度 (Exam Year)
                    </span>
                  </div>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                    歷屆官方全真試卷
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {[
                    { year: 115, label: '115 年度全真卷', badge: '最新施測 (35題)' },
                    { year: 114, label: '114 年度全真卷', badge: '正式題本 (35題)' }
                  ].map((y) => {
                    const active = selectedSaaYear === y.year;
                    return (
                      <button
                        key={y.year}
                        type="button"
                        onClick={() => setSelectedSaaYear(y.year)}
                        className={`py-2 px-3 rounded-xl border-2 text-center transition flex items-center justify-between cursor-pointer ${
                          active
                            ? 'border-purple-600 bg-purple-600 text-white shadow-md'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-purple-300'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-black">{y.label}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          active ? 'bg-purple-800/60 text-purple-100' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                        }`}>
                          {y.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 步驟 2：選擇施測年級 */}
              <div className="shrink-0 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-700/70 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-xs font-black flex items-center justify-center">
                      2
                    </span>
                    <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      選擇施測年級
                    </span>
                  </div>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                    教育部 SAA 規範年級
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { grade: 4, label: '四年級', desc: 'Book 3~4 範圍' },
                    { grade: 5, label: '五年級', desc: 'Book 5~6 範圍' },
                    { grade: 6, label: '六年級', desc: 'Book 7~8 範圍' }
                  ].map((g) => {
                    const active = selectedSaaGrade === g.grade;
                    return (
                      <button
                        key={g.grade}
                        type="button"
                        onClick={() => setSelectedSaaGrade(g.grade)}
                        className={`py-2.5 px-3 rounded-xl border-2 text-center transition flex flex-col items-center justify-center cursor-pointer ${
                          active
                            ? 'border-purple-600 bg-purple-600 text-white shadow-md'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-purple-300'
                        }`}
                      >
                        <span className="text-sm sm:text-base font-black">{g.label}</span>
                        <span className={`text-[11px] font-semibold mt-0.5 ${active ? 'text-purple-100' : 'text-slate-400'}`}>
                          {g.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 步驟 3：選擇題型與題數組合 (向下彈出三大膠囊) */}
              <div className="shrink-0 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-700/70 space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-xs font-black flex items-center justify-center">
                      2
                    </span>
                    <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      選擇測驗組合
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">點選切換</span>
                </div>
                <div className="space-y-2">
                  {/* 膠囊 A: 聽 15 + 閱 20 (預設) */}
                  <button
                    type="button"
                    onClick={() => setSelectedSaaFormat('standard')}
                    className={`w-full p-3 sm:p-3.5 rounded-xl border-2 text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                      selectedSaaFormat === 'standard'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/60 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        selectedSaaFormat === 'standard' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                      }`}>
                        <ClipboardCheck size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                            聽力 15 題 ＋ 閱讀 20 題
                          </span>
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            正式學測規格 (預設)
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          115 年度全真學力檢測標準試卷，1~35 題原卷原圖高解析完整呈現
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base sm:text-lg font-black text-purple-600 dark:text-purple-400">35 題</span>
                    </div>
                  </button>

                  {/* 膠囊 B: 聽力 20 題 */}
                  <button
                    type="button"
                    onClick={() => setSelectedSaaFormat('listening')}
                    className={`w-full p-3 sm:p-3.5 rounded-xl border-2 text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                      selectedSaaFormat === 'listening'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/60 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        selectedSaaFormat === 'listening' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                      }`}>
                        <Headphones size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                            聽力測驗 20 題
                          </span>
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                            專題特訓
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          辨識句意、基本問答、言談理解三大聽力大題深入強化
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base sm:text-lg font-black text-purple-600 dark:text-purple-400">20 題</span>
                    </div>
                  </button>

                  {/* 膠囊 C: 閱讀 20 題 */}
                  <button
                    type="button"
                    onClick={() => setSelectedSaaFormat('reading')}
                    className={`w-full p-3 sm:p-3.5 rounded-xl border-2 text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                      selectedSaaFormat === 'reading'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/60 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        selectedSaaFormat === 'reading' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                      }`}>
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                            閱讀測驗 20 題
                          </span>
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                            專題特訓
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          字彙語法單題、生活告示、情境題組深入練習
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base sm:text-lg font-black text-purple-600 dark:text-purple-400">20 題</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* 三大等第說明 */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60">
                  <div className="font-black text-emerald-700 dark:text-emerald-300">精熟 (Proficient)</div>
                  <div className="text-[10px] text-slate-500">答對率 ≥ 85%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60">
                  <div className="font-black text-amber-700 dark:text-amber-300">基礎 (Basic)</div>
                  <div className="text-[10px] text-slate-500">答對率 60%～84%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/60">
                  <div className="font-black text-rose-700 dark:text-rose-300">待加強 (Developing)</div>
                  <div className="text-[10px] text-slate-500">答對率 &lt; 60%</div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* 模式 D：Pre A1 檢測練習 (setupSubView === 'preA1')                     */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {setupSubView === 'preA1' && (
            <div className="flex flex-col gap-3">
              {/* 頂部快捷入口：個人精熟診斷卡 & 300 題庫總覽 */}
              <div className="shrink-0 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/50 dark:to-indigo-950/50 border border-sky-200 dark:border-sky-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black shadow-sm shrink-0">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Test My English 官方 300 全題庫</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-200 text-sky-800 dark:bg-sky-900 dark:text-sky-200">
                        五大面向 · 19 子題型
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      動態滾動精熟體系：錯題連對 2 次翻盤解鎖為精熟，拒絕歷史錯誤懲罰
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMasteryInitialTrack('tme-preA1');
                    setSetupSubView('preA1-dashboard');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Award size={15} />
                  <span>查看個人精熟診斷卡 ➔</span>
                </button>
              </div>

              {/* 步驟 1：選擇施測模式 (正式施測 vs 專項練習) */}
              <div className="shrink-0 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-700/70 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white text-xs font-black flex items-center justify-center">
                      1
                    </span>
                    <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      選擇施測模式
                    </span>
                  </div>
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                    教育部標準規範
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormalExam(true);
                      setSelectedPreA1Format('standard');
                    }}
                    className={`p-3 rounded-xl border-2 text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                      isFormalExam
                        ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/60 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-sky-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>🎓 正式施測模式</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                          全真規格
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        30 題 (聽15+閱15) · 限時 35 分鐘 · 聽力自動朗讀 2 遍
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsFormalExam(false)}
                    className={`p-3 rounded-xl border-2 text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                      !isFormalExam
                        ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/60 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-sky-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>🎯 專項自主練習模式</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          無壓力練習
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        自由選擇聽力、閱讀、寫作重組等專門題組
                      </div>
                    </div>
                  </button>
                </div>

                {isFormalExam ? (
                  <div className="p-3 rounded-xl bg-sky-100/70 dark:bg-sky-950/50 border border-sky-300 dark:border-sky-800 text-xs text-sky-900 dark:text-sky-200 space-y-1">
                    <div className="font-black flex items-center gap-1.5">
                      <Sparkles size={14} className="text-sky-600" />
                      <span>正式施測模式已就緒</span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      包含生活聽力 15 題與看圖閱讀 15 題，試題依循易到難階梯排序。聽力題型將依國際施測標準<strong>自動朗讀兩次</strong>。全卷限時 35 分鐘，答對 21 題 (70%) 即達 Pre-A1 合格標準！
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      選擇練習題型組合：
                    </div>
                  {/* 膠囊 A: 聽 15 + 閱 15 (官方標準 30 題) */}
                  <button
                    type="button"
                    onClick={() => setSelectedPreA1Format('standard')}
                    className={`w-full p-3 sm:p-3.5 rounded-xl border-2 text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                      selectedPreA1Format === 'standard'
                        ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/60 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-sky-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        selectedPreA1Format === 'standard' ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                      }`}>
                        <Award size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                            聽力 15 題 ＋ 閱讀 15 題
                          </span>
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-sky-200 text-sky-800 dark:bg-sky-900 dark:text-sky-200">
                            官方標準規格 (預設)
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Test My English 官方 Pre-A1 正式題數（共 30 題，答對 21 題即合格）
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base sm:text-lg font-black text-sky-600 dark:text-sky-400">30 題</span>
                    </div>
                  </button>

                  {/* 膠囊 B: 聽力 20 題 */}
                  <button
                    type="button"
                    onClick={() => setSelectedPreA1Format('listening')}
                    className={`w-full p-3 sm:p-3.5 rounded-xl border-2 text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                      selectedPreA1Format === 'listening'
                        ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/60 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-sky-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        selectedPreA1Format === 'listening' ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                      }`}>
                        <Headphones size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                            聽力測驗 20 題
                          </span>
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                            專題特訓
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          聽音選圖、聽音選字、生活問句應答集中強化
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base sm:text-lg font-black text-sky-600 dark:text-sky-400">20 題</span>
                    </div>
                  </button>

                  {/* 膠囊 C: 閱讀 20 題 */}
                  <button
                    type="button"
                    onClick={() => setSelectedPreA1Format('reading')}
                    className={`w-full p-3 sm:p-3.5 rounded-xl border-2 text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                      selectedPreA1Format === 'reading'
                        ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/60 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-sky-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        selectedPreA1Format === 'reading' ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                      }`}>
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                            閱讀測驗 20 題
                          </span>
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                            專題特訓
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          看圖選字、日常生活告示圖文配合、短句是非判斷集中強化
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base sm:text-lg font-black text-sky-600 dark:text-sky-400">20 題</span>
                    </div>
                  </button>

                  {/* 膠囊 D: 寫作句子重組 20 題 (國小核心十大句型) */}
                  <button
                    type="button"
                    onClick={() => setSelectedPreA1Format('writing')}
                    className={`w-full p-3 sm:p-3.5 rounded-xl border-2 text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                      selectedPreA1Format === 'writing'
                        ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/60 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-sky-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        selectedPreA1Format === 'writing' ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                      }`}>
                        <PenTool size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                            寫作句子重組 20 題
                          </span>
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200">
                            國小核心十大句型
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Wh-問句、Be動詞、Can/Do助動詞、進行式與介系詞等 10 大核心句型立體磁吸重組特訓
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base sm:text-lg font-black text-sky-600 dark:text-sky-400">20 題</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

              {/* 口說與寫作四技整合說明小卡 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/40 dark:to-indigo-950/40 border border-sky-200 dark:border-sky-800/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-sky-900 dark:text-sky-200">
                  <Sparkles size={16} className="text-sky-600 dark:text-sky-400" />
                  <span>全真四技整合指引（口說與寫作實戰）</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>• 寫作 (Writing)：</strong>Pre-A1 著重字母大小寫、單字拼寫與基礎句子重組，學生可至<strong>「拼字大師」</strong>遊戲隨時進行即時互動訓練。<br />
                  <strong>• 口說 (Speaking)：</strong>Pre-A1 著重朗讀句子與日常圖片口語問答，學生可前往<strong>「聽說實驗室」</strong>進行 AI 語音即時評測與發音糾錯！
                </p>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* 模式 E：易錯題複習 (setupSubView === 'mistakes')                       */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {setupSubView === 'mistakes' && (
            <div className="flex flex-col gap-3">
              {/* 易錯題庫概況卡 */}
              <div className="shrink-0 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-xs font-black flex items-center justify-center">
                      1
                    </span>
                    <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      易錯題庫概況
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                    待複習：{mistakeCount} 題
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  系統已自動為你收錄平時測驗曾答錯的題目。若目前易錯題數少於所選題數（{questionCountOpt} 題），系統將自動自你<strong>本年級（Grade {currentStudent?.grade || 4}）</strong>的題庫中隨機挑選合適題目補滿。
                </p>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-600 shrink-0" />
                  <span>精熟機制：只要在複習中對同一題「連續答對 2 次」，系統即自動從易錯池移除！</span>
                </div>
              </div>

              {/* 選擇題數 */}
              <div className="shrink-0 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-700/70 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-xs font-black flex items-center justify-center">
                    2
                  </span>
                  <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    選擇複習題數
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
                        className={`py-2.5 px-3 rounded-xl border-2 text-center transition flex flex-col items-center justify-center cursor-pointer ${
                          active
                            ? 'border-rose-600 bg-rose-600 text-white shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-rose-300'
                        }`}
                      >
                        <span className="text-sm sm:text-base font-black">{opt.label}</span>
                        <span
                          className={`text-[11px] font-bold ${
                            active ? 'text-rose-100' : 'text-amber-600 dark:text-amber-400'
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
          )}
        </div>

        {/* 底部功能與開始測驗 CTA（固定於底部） */}
        <div className="shrink-0 px-3 sm:px-6 py-2.5 sm:py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between gap-3">
          {setupSubView === 'hub' ? (
            <div className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold">💡 提示：本年級檢定答對率 ≥ 60% 可領取金幣獎勵</span>
              <span className="font-bold hidden sm:inline">霧臺評量矩陣 v2.5</span>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setSetupSubView('hub')}
                className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 transition cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft size={15} />
                <span>返回選單</span>
              </button>

              {setupSubView === 'textbook' && (
                <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 py-1.5 px-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-indigo-600 dark:text-indigo-400 font-black">
                    {formatBookLabel(selectedBook)}
                  </span>
                  <span>•</span>
                  <span>
                    {selectedBook === 'g1' || selectedBook === 'g2'
                      ? '全字母'
                      : rangePreset === 'midterm'
                      ? '上半冊'
                      : rangePreset === 'final'
                      ? '下半冊'
                      : rangePreset === 'all'
                      ? '全冊'
                      : `自選 ${selectedUnits.length} 單元`}
                  </span>
                  <span>•</span>
                  <span>
                    {textbookExamMode === 'comprehensive'
                      ? '綜合測驗'
                      : textbookExamMode === 'written'
                      ? '純筆試'
                      : '純聽力'}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-black">
                    {questionCountOpt} 題
                  </span>
                </div>
              )}

              <button
                type="button"
                disabled={!canStart}
                onClick={() => startExamSession()}
                className={`w-full sm:w-auto sm:min-w-[260px] py-3.5 px-8 rounded-2xl text-white font-black text-sm sm:text-base shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed ${
                  scopeMode === 'tme-preA1'
                    ? 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/25'
                    : scopeMode === 'ministry-assessment'
                    ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/25'
                    : scopeMode === 'mistakes'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25'
                }`}
              >
                <span>
                  {scopeMode === 'tme-preA1'
                    ? (isFormalExam
                        ? '開始 Pre-A1 正式施測 (30 題 · 限時 35 分)'
                        : (tmePool.length > 0 ? `開始 Pre-A1 練習 (${selectedPreA1Format === 'standard' ? 30 : 20} 題)` : '🚧 Pre-A1 官方題庫編製中 (敬請期待)'))
                    : scopeMode === 'ministry-assessment'
                    ? (saaPool.length > 0 ? `開始學力測驗 (${selectedSaaFormat === 'standard' ? 35 : 20} 題)` : '🚧 SAA 學力題庫編製中 (敬請期待)')
                    : scopeMode === 'mistakes'
                    ? `開始複習 (${questionCountOpt} 題)`
                    : `開始檢定 (${questionCountOpt} 題)`}
                </span>
                <ArrowRight size={18} />
              </button>
            </>
          )}
        </div>
      </>
    );
  }

  // STEP 2.5: 本次測驗內容配置與說明 (Page 0 Zero-Scroll iPad Blueprint & Dossier)
  // ============================================================================
  if (phase === 'instructions') {
    const outline = buildFormOutline(questions);
    const bookMeta = HERE_WE_GO_BOOK_META[selectedBook] || HERE_WE_GO_BOOK_META[1];
    const centerTitle =
      scopeMode === 'mistakes'
        ? '個人易錯題精熟複習'
        : scopeMode === 'tme-preA1'
        ? 'Test My English Pre-A1 官方模擬檢定'
        : scopeMode === 'ministry-assessment'
        ? `教育部 SAA 臺灣學生學習成就評量 (${selectedSaaYear} 年度 • ${selectedSaaGrade} 年級卷)`
        : `${formatBookLabel(selectedBook)} 課程能力檢定`;

    const candidateDisplayName = isLoggedIn
      ? formatStudentDisplayName(currentStudent)
      : '自主練習考生 (Guest)';

    const passCriteria =
      scopeMode === 'tme-preA1'
        ? 'Pre-A1 合格：答對 21 題 (70%)'
        : scopeMode === 'ministry-assessment'
        ? '精熟門檻：答對率 ≥ 85%'
        : scopeMode === 'mistakes'
        ? '連續答對 2 次判定精熟出庫'
        : isSelectedBookOwnGrade
        ? '本年級合格率 ≥ 60% 獎勵金幣'
        : '自主練習 (免計英雄榜)';

    const hasAudioSection = outline.some((p) => p.audio);

    return renderShell(
      <>
        {/* 頂端精簡導覽列 */}
        <div className="shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/80 dark:bg-slate-900/80">
          <button
            type="button"
            onClick={() => setPhase('setup')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            重選範圍
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <ClipboardCheck className="text-indigo-600 dark:text-indigo-400 shrink-0" size={18} />
            <h2 className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white truncate">
              {centerTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsRulesModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              title="查看作答守則與檢定說明"
            >
              <Info size={14} className="text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">應試守則</span>
            </button>
            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              共 {questions.length} 題
            </span>
          </div>
        </div>

        {/* 主體內容（iPad 一頁內免捲動自適應佈局） */}
        <div className="flex-1 min-h-0 p-3 sm:p-5 flex flex-col justify-between max-w-3xl mx-auto w-full gap-3 overflow-hidden">
          {/* 1. 次要資訊精簡膠囊列 (考生、時間、合格標準) */}
          <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 text-xs">
            <div className="flex items-center gap-1.5 text-slate-750 dark:text-slate-200 font-bold min-w-0">
              <UserCheck size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="truncate max-w-[140px] sm:max-w-none">{candidateDisplayName}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 font-semibold text-[11px] sm:text-xs">
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-slate-400" />
                約 {Math.max(15, Math.ceil(questions.length * 1.2))} 分鐘
              </span>
              <span>•</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{passCriteria}</span>
            </div>
          </div>

          {/* 2. 主要資訊一：試卷大題題型分布藍圖 (Exam Blueprint Pills) */}
          <div className="flex-1 min-h-0 flex flex-col justify-center space-y-1.5">
            <div className="flex items-center justify-between text-xs font-black text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <ClipboardCheck size={15} className="text-indigo-600 dark:text-indigo-400" />
                試卷題型分布藍圖 (共 {questions.length} 題)
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                {outline.length} 個大題部分
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto max-h-[220px] sm:max-h-none pr-0.5">
              {outline.map((part, idx) => {
                const isAudio = part.audio;
                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-800/90 rounded-xl p-2.5 sm:p-3 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-2xs hover:border-indigo-400 transition"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-black flex items-center justify-center border border-indigo-200 dark:border-indigo-800 shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-white truncate flex items-center gap-1.5">
                          <span>{part.label}</span>
                          {isAudio && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 flex items-center gap-0.5 shrink-0">
                              <Headphones size={10} />
                              聽力
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                          {part.sectionLabel}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 shrink-0 ml-2">
                      第 {part.start}–{part.end} 題 ({part.end - part.start + 1} 題)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. 主要資訊二：考前耳機與音量檢驗互動條 (精簡文字，<15字) */}
          <div className="shrink-0">
            {hasAudioSection ? (
              <div className="p-3 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/40 dark:to-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-between gap-2.5 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Headphones size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white block">
                      含聽力大題，請確認設備音量
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={runAudioTest}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
                      isPlayingAudioTest
                        ? 'bg-emerald-600 text-white shadow-emerald-500/25 ring-2 ring-emerald-400'
                        : 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-600'
                    }`}
                  >
                    <Volume2 size={14} className={isPlayingAudioTest ? 'animate-bounce' : ''} />
                    <span>{isPlayingAudioTest ? '播放中...' : '試聽發音'}</span>
                  </button>

                  {scopeMode === 'curriculum' && (
                    <button
                      type="button"
                      onClick={switchToWrittenMode}
                      className="px-2 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 transition cursor-pointer"
                      title="沒耳機？點此切換為純筆試"
                    >
                      轉純筆試
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                  <FileText size={15} className="text-slate-500 shrink-0" />
                  <span>純筆試測驗 • 全卷無聽力題，請安心作答</span>
                </div>
                <span className="text-[11px] text-slate-400">作答中仍可隨時點擊發音輔助</span>
              </div>
            )}
          </div>

          {/* 4. 主要資訊三：準備好了開始作答按鈕 (Big, tactile CTA) */}
          <div className="shrink-0 pt-1">
            <button
              type="button"
              onClick={() => {
                setStartTime(Date.now());
                setElapsedSec(0);
                setCurrentIndex(0);
                setPhase('exam');
              }}
              className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-black text-sm sm:text-base shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>準備好了，開始作答 ({questions.length} 題)</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* 考前應試守則說明彈窗 (固定資訊優雅收納，點擊小圖示即可開啟) */}
        {isRulesModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-base">
                  <Info size={18} className="text-indigo-600 dark:text-indigo-400" />
                  <span>應試指南與作答守則</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRulesModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 space-y-1">
                  <div className="font-black text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Flag size={14} />
                    <span>標記待查與防漏答</span>
                  </div>
                  <p className="text-[11px] text-slate-650 dark:text-slate-300">
                    不確定答案時可點擊右上角旗幟標記，交卷前系統會提示未答題數以防疏漏。
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 space-y-1">
                  <div className="font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <Headphones size={14} />
                    <span>語音朗讀與聽力播放</span>
                  </div>
                  <p className="text-[11px] text-slate-650 dark:text-slate-300">
                    聽力試題依檢定標準播放兩次，一般讀寫題亦可點擊題目旁的喇叭按鈕進行發音輔助。
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 space-y-1">
                  <div className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>自動暫存與斷線續考</span>
                  </div>
                  <p className="text-[11px] text-slate-650 dark:text-slate-300">
                    作答中進度每題自動儲存，若遇設備斷線或意外關閉，6 小時內重新進入皆可無縫接續。
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsRulesModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
              >
                我瞭解了，關閉說明
              </button>
            </div>
          </div>
        )}
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
        : scopeMode === 'tme-preA1'
        ? `Pre-A1 模擬 · ${currentTaskLabel}`
        : scopeMode === 'ministry-assessment'
        ? `SAA 學力模考 · ${currentTaskLabel}`
        : `${formatBookLabel(selectedBook)} · ${currentTaskLabel}`;

    return renderShell(
      <>
        {/* 頂端三欄極簡狀態列：左「離開」、中「測驗冊別」、右「題號進度與標記」 */}
        <div className="shrink-0 px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 grid grid-cols-3 items-center bg-slate-50/90 dark:bg-slate-900/90">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowExitConfirm(true)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1 transition"
            >
              <ArrowLeft size={15} />
              離開
            </button>
            {isFormalExam && (
              <span className={`px-2.5 py-1 rounded-lg border font-mono font-black text-xs flex items-center gap-1 ${
                Math.max(0, 2100 - elapsedSec) < 300
                  ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                  : 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                <Clock size={13} />
                <span>{formatTime(Math.max(0, 2100 - elapsedSec))}</span>
              </span>
            )}
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
              <div className="flex items-center gap-1.5">
                {reportedQuestions[currentQ.id] ? (
                  <span className="px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    已回報
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenReportModal(currentQ)}
                    className="px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-700/60 bg-amber-50/80 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                    title="題目有問題？點此快速回報給老師"
                  >
                    <AlertTriangle size={13} />
                    回報問題
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => speakQuestion(currentQ.media?.audioText || currentQ.question)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1 transition"
                >
                  <Volume2 size={14} />
                  朗讀題幹
                </button>
              </div>
            </div>

            {currentQ.passage && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-indigo-50/70 dark:bg-slate-800/90 border border-indigo-200/80 dark:border-slate-700 text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-line text-slate-800 dark:text-slate-200 mb-2">
                <div className="font-black text-indigo-700 dark:text-indigo-400 mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                  <BookOpen size={16} />
                  <span>{currentQ.passage.title || '【生活閱讀篇章】'}</span>
                </div>
                <div className="font-mono text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                  {currentQ.passage.text}
                </div>
              </div>
            )}
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-wide py-1">
              {formatQuestionStem(currentQ.question)}
            </div>

            {/* 寫作重組專屬：彩色立體磁吸單字積木架 (3D Magnetic Word Blocks Rack) */}
            {(currentQ.tokens || currentQ.scrambledWords) && (
              <div className="my-3 sm:my-4 p-3.5 sm:p-5 rounded-3xl bg-gradient-to-b from-slate-100/95 via-slate-50 to-slate-200/90 dark:from-slate-800/90 dark:to-slate-900/90 border-2 border-slate-300 dark:border-slate-700 shadow-inner flex flex-col gap-3">
                {/* 頂部標籤列：句型徽章與提示 */}
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    {currentQ.pattern && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs">
                        {currentQ.pattern}
                      </span>
                    )}
                    <span className="text-slate-600 dark:text-slate-300 font-bold flex items-center gap-1">
                      <span>🧲</span>
                      <span>磁吸單字積木（點擊積木發音）</span>
                    </span>
                  </div>
                  {currentQ.chinese && (
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      中文語意：{currentQ.chinese}
                    </span>
                  )}
                </div>

                {/* 對話情境填空框 (若題目有 contextPrompt) */}
                {currentQ.contextPrompt && (
                  <div className="px-3.5 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed shadow-xs">
                    {currentQ.contextPrompt}
                  </div>
                )}

                {/* 3D 磁吸積木展示槽 (Magnetic Rack Tray) */}
                <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 min-h-[72px]">
                  {(currentQ.tokens || currentQ.scrambledWords || []).map((word, wIdx) => {
                    const CHIP_PALETTES = [
                      'bg-rose-500 hover:bg-rose-600 text-white border-b-4 border-rose-700 shadow-rose-200 dark:shadow-none',
                      'bg-sky-500 hover:bg-sky-600 text-white border-b-4 border-sky-700 shadow-sky-200 dark:shadow-none',
                      'bg-emerald-500 hover:bg-emerald-600 text-white border-b-4 border-emerald-700 shadow-emerald-200 dark:shadow-none',
                      'bg-amber-500 hover:bg-amber-600 text-white border-b-4 border-amber-700 shadow-amber-200 dark:shadow-none',
                      'bg-indigo-500 hover:bg-indigo-600 text-white border-b-4 border-indigo-700 shadow-indigo-200 dark:shadow-none',
                      'bg-fuchsia-500 hover:bg-fuchsia-600 text-white border-b-4 border-fuchsia-700 shadow-fuchsia-200 dark:shadow-none',
                      'bg-teal-500 hover:bg-teal-600 text-white border-b-4 border-teal-700 shadow-teal-200 dark:shadow-none',
                      'bg-purple-500 hover:bg-purple-600 text-white border-b-4 border-purple-700 shadow-purple-200 dark:shadow-none',
                    ];
                    const colorClass = CHIP_PALETTES[wIdx % CHIP_PALETTES.length];

                    return (
                      <button
                        key={wIdx}
                        type="button"
                        onClick={() => speakQuestion(word)}
                        title="點擊聆聽單字發音"
                        className={`group relative px-3.5 py-2 sm:px-4.5 sm:py-2.5 rounded-2xl font-black text-base sm:text-lg tracking-wide transition-all transform hover:-translate-y-0.5 active:translate-y-1 cursor-pointer select-none shadow-md flex items-center gap-1.5 ${colorClass}`}
                      >
                        <span className="w-2 h-2 rounded-full bg-white/40 shadow-inner block shrink-0" />
                        <span>{word}</span>
                        <Volume2 size={13} className="opacity-0 group-hover:opacity-80 transition-opacity ml-0.5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {currentQ.image && (
              <div className="flex justify-center my-2 sm:my-3">
                <img
                  src={currentQ.image}
                  alt="題目插圖"
                  className="max-h-52 sm:max-h-64 max-w-full w-auto object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-1.5"
                  loading="eager"
                />
              </div>
            )}

            {/* 聽力題專屬播放卡片（學生端完全隱藏字稿，僅留播放鈕） */}
            {currentQ.media?.audioText && (
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 my-2 rounded-2xl bg-indigo-50/80 dark:bg-slate-800/80 border border-indigo-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => speakQuestion(currentQ.media.audioText)}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <Volume2 size={16} />
                  <span>{isDialogue(currentQ.media.audioText) ? '🎭 播放情境對話語音' : '🎧 播放聽力語音'}</span>
                </button>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                  可反覆點擊按鈕聆聽發音
                </span>
              </div>
            )}
          </div>

          {/* (A)(B)(C)(D) 選項區 (支援線稿圖檔選項與文字選項) */}
          <div className="my-auto w-full">
            {currentQ.optionImages && currentQ.optionImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {currentQ.optionImages.map((imgSrc, optIdx) => {
                  const isChosen = selectedChoice === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(optIdx)}
                      className={`p-3 sm:p-4 rounded-2xl border-2 text-center transition flex flex-col items-center justify-between gap-2 cursor-pointer ${
                        isChosen
                          ? 'border-indigo-600 bg-indigo-50/90 dark:bg-indigo-950/70 shadow-md ring-2 ring-indigo-400'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm shrink-0 ${
                            isChosen
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {CHOICE_LABELS[optIdx]}
                        </span>
                        {isChosen && (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                            已選
                          </span>
                        )}
                      </div>

                      <div className="w-full h-24 sm:h-32 flex items-center justify-center p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                        <img
                          src={imgSrc}
                          alt={`選項 ${CHOICE_LABELS[optIdx]}`}
                          className="max-h-full max-w-full object-contain"
                          draggable={false}
                        />
                      </div>

                      <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                        {currentQ.options?.[optIdx] || `選項 (${CHOICE_LABELS[optIdx]})`}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
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
            )}
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
                  {scopeMode === 'mistakes'
                    ? '易錯題複習'
                    : scopeMode === 'tme-preA1'
                    ? 'Pre-A1 官方模擬'
                    : scopeMode === 'ministry-assessment'
                    ? 'SAA 學力模考'
                    : `${formatBookLabel(selectedBook)}檢定`}
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
                  <div className="flex items-center gap-2">
                    {!isFormalExam && (
                      reportedQuestions[currentReviewItem.q.id] ? (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 size={13} />
                          已回報
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenReportModal(currentReviewItem.q)}
                          className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1 transition cursor-pointer"
                          title="若答案或題目有誤，點此回報給老師"
                        >
                          <AlertTriangle size={13} />
                          回報疑義
                        </button>
                      )
                    )}
                    <button
                      type="button"
                      onClick={() => speakQuestion(currentReviewItem.q.question)}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1"
                    >
                      <Volume2 size={14} />
                      朗讀
                    </button>
                  </div>
                </div>

                {currentReviewItem.q.passage && (
                  <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-slate-800/90 border border-indigo-200/80 dark:border-slate-700 text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-line text-slate-800 dark:text-slate-200 mb-2">
                    <div className="font-black text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-1.5 text-xs">
                      <BookOpen size={14} />
                      <span>{currentReviewItem.q.passage.title || '【生活閱讀篇章】'}</span>
                    </div>
                    <div className="font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                      {currentReviewItem.q.passage.text}
                    </div>
                  </div>
                )}

                <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {formatQuestionStem(currentReviewItem.q.question)}
                </div>

                {currentReviewItem.q.image && (
                  <div className="flex justify-center my-2">
                    <img
                      src={currentReviewItem.q.image}
                      alt="題目插圖"
                      className="max-h-48 sm:max-h-56 max-w-full w-auto object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-1.5"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* 寫作重組單字卡回顧 */}
                {(currentReviewItem.q.tokens || currentReviewItem.q.scrambledWords) && (
                  <div className="my-2.5 p-3 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-inner">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span>🧲</span>
                        <span>給定磁吸單字積木：</span>
                      </span>
                      {currentReviewItem.q.pattern && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          {currentReviewItem.q.pattern}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {(currentReviewItem.q.tokens || currentReviewItem.q.scrambledWords || []).map((word, wIdx) => {
                        const PALETTES = [
                          'bg-rose-500 text-white',
                          'bg-sky-500 text-white',
                          'bg-emerald-500 text-white',
                          'bg-amber-500 text-white',
                          'bg-indigo-500 text-white',
                          'bg-fuchsia-500 text-white',
                          'bg-teal-500 text-white',
                          'bg-purple-500 text-white'
                        ];
                        return (
                          <span
                            key={wIdx}
                            className={`px-2.5 py-1 rounded-xl text-xs font-black shadow-xs ${PALETTES[wIdx % PALETTES.length]}`}
                          >
                            {word}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
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
