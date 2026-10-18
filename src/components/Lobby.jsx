import React, { useState, useMemo, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';
import { useStudent } from '../context/StudentContext';
import { useTheme } from '../context/ThemeContext';
import { formatStudentBadge } from '../utils/studentIdHelper';
import { soundEngine } from '../services/audio';
import {
  Home, Trophy, User, ArrowLeft, ArrowRight, Play,
  KeyRound, Eye, Compass, Puzzle, Flame, Rocket,
  Sparkles, Keyboard, BookOpen, Volume2, Swords,
  Store, RotateCcw, Check, CheckCircle2, ChevronRight,
  Sun, Moon, VolumeX, ShieldCheck, Layers, HelpCircle,
  X, Zap
} from 'lucide-react';

const POSTER_EXPLORE = '/assets/lobby/theme_explore.jpg';
const POSTER_SPEED = '/assets/lobby/theme_speed.jpg';
const POSTER_QUIZ = '/assets/lobby/theme_quiz.jpg';
const POSTER_BATTLE = '/assets/lobby/theme_battle.jpg';
const POSTER_TOWN = '/assets/lobby/theme_town.jpg';

export const Lobby = ({
  words = [],
  settings,
  setSettings,
  onNavigate,
  onOpenLeaderboard,
  onOpenTeacherHub,
  qualifyingBook
}) => {
  const { t, lang } = useI18n();
  const { currentStudent, isLoggedIn, openModal } = useStudent();
  const { isDark, toggleTheme } = useTheme();

  // ── 流程步驟：'game' (選遊戲手風琴) | 'scope' (選範圍) ──
  const [step, setStep] = useState('game');

  // ── 手風琴選中展開欄位：null (均分 20%) | 'explore' | 'speed' | 'quiz' ──
  const [activeCol, setActiveCol] = useState(null);

  // ── 當前選中的遊戲 ID ──
  const [selectedGame, setSelectedGame] = useState('escape');

  // ── 選範圍：是否展開「其他全部冊次與教師自創」 ──
  const [showAllBooks, setShowAllBooks] = useState(false);

  // ── 首次進入若未設置個人身分，自動喚起通行證設置 ──
  useEffect(() => {
    try {
      const lastId = localStorage.getItem('wutai_last_student_id');
      const guest = localStorage.getItem('wutai_guest_student');
      if (!currentStudent && !lastId && !guest) {
        const timer = setTimeout(() => {
          if (openModal) openModal();
        }, 450);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, [currentStudent, openModal]);

  // ── 學生年級判定 (1~6，預設 3) ──
  const studentGradeNum = useMemo(() => {
    if (currentStudent?.grade) {
      const g = parseInt(currentStudent.grade, 10);
      if (g >= 1 && g <= 6) return g;
    }
    return 3;
  }, [currentStudent]);

  // ── 五大欄位定義（專屬海報底圖、雕刻字體樣式與高質感子遊戲徽章） ──
  const COLUMNS = useMemo(() => [
    {
      id: 'explore',
      title: '探索解謎',
      enTitle: 'EXPLORE & PUZZLES',
      icon: KeyRound,
      bgImage: POSTER_EXPLORE,
      tag: '4 款挑戰',
      colorName: 'emerald',
      titleGlow: 'bg-gradient-to-b from-emerald-100 via-emerald-200 to-teal-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] drop-shadow-[0_0_16px_rgba(16,185,129,0.7)]',
      spineTextColor: 'text-emerald-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]',
      borderClass: 'border-emerald-500/60 hover:border-emerald-400',
      activeRingClass: 'ring-emerald-400/60 border-emerald-300',
      tagBadge: 'bg-emerald-950/80 text-emerald-300 border-emerald-400/50',
      plaqueBg: 'bg-emerald-950/75 border-emerald-400/40 shadow-emerald-950/50',
      summary: '古老遺跡 • 神廟機關 • 秘境尋寶',
      isDirectJump: false,
      games: [
        { id: 'escape', name: '神祕密室逃脫', iconComp: KeyRound, iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/25 border-emerald-400/40', badge: '機關解謎' },
        { id: 'spotter', name: '鷹眼神探找不同', iconComp: Eye, iconColor: 'text-amber-400', iconBg: 'bg-amber-500/25 border-amber-400/40', badge: '視覺辨析' },
        { id: 'maze', name: '字母巡航迷宮', iconComp: Compass, iconColor: 'text-teal-400', iconBg: 'bg-teal-500/25 border-teal-400/40', badge: '字母航線' },
        { id: 'memory', name: '翻牌記憶對決', iconComp: Sparkles, iconColor: 'text-cyan-400', iconBg: 'bg-cyan-500/25 border-cyan-400/40', badge: '記憶配對' }
      ]
    },
    {
      id: 'speed',
      title: '極速反應',
      enTitle: 'SPEED & ARCADE',
      icon: Flame,
      bgImage: POSTER_SPEED,
      tag: '4 款挑戰',
      colorName: 'amber',
      titleGlow: 'bg-gradient-to-b from-yellow-100 via-amber-300 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] drop-shadow-[0_0_18px_rgba(245,158,11,0.8)]',
      spineTextColor: 'text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]',
      borderClass: 'border-amber-500/60 hover:border-amber-400',
      activeRingClass: 'ring-amber-400/60 border-amber-300',
      tagBadge: 'bg-amber-950/80 text-amber-300 border-amber-400/50',
      plaqueBg: 'bg-amber-950/75 border-amber-400/40 shadow-amber-950/50',
      summary: '熔岩競技 • 隕石突擊 • 閃電手速',
      isDirectJump: false,
      games: [
        { id: 'swipe', name: '極速是非滑牌', iconComp: Flame, iconColor: 'text-rose-400', iconBg: 'bg-rose-500/25 border-rose-400/40', badge: '30秒對決' },
        { id: 'meteor', name: '3D 隕石防衛戰', iconComp: Rocket, iconColor: 'text-amber-400', iconBg: 'bg-amber-500/25 border-amber-400/40', badge: '打字擊墜' },
        { id: 'mole', name: '單字打地鼠', iconComp: Zap, iconColor: 'text-amber-300', iconBg: 'bg-amber-500/25 border-amber-400/40', badge: '地穴手速' },
        { id: 'snake', name: '叢林神山貪蛇', iconComp: Zap, iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/25 border-emerald-400/40', badge: '百步蛇' }
      ]
    },
    {
      id: 'quiz',
      title: '經典測驗',
      enTitle: 'CLASSIC ARENA',
      icon: Keyboard,
      bgImage: POSTER_QUIZ,
      tag: '4 款挑戰',
      colorName: 'blue',
      titleGlow: 'bg-gradient-to-b from-white via-sky-200 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] drop-shadow-[0_0_18px_rgba(56,189,248,0.7)]',
      spineTextColor: 'text-sky-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]',
      borderClass: 'border-blue-500/60 hover:border-blue-400',
      activeRingClass: 'ring-blue-400/60 border-blue-300',
      tagBadge: 'bg-blue-950/80 text-blue-300 border-blue-400/50',
      plaqueBg: 'bg-blue-950/75 border-blue-400/40 shadow-blue-950/50',
      summary: '星空書閣 • 智慧結晶 • 全能評測',
      isDirectJump: false,
      games: [
        { id: 'quiz-zh-en', name: '看中選英', iconComp: Keyboard, iconColor: 'text-sky-400', iconBg: 'bg-sky-500/25 border-sky-400/40', badge: '中選英' },
        { id: 'quiz-en-zh', name: '看英選中', iconComp: BookOpen, iconColor: 'text-indigo-400', iconBg: 'bg-indigo-500/25 border-indigo-400/40', badge: '英選中' },
        { id: 'quiz-listening', name: '英語聽力', iconComp: Volume2, iconColor: 'text-cyan-400', iconBg: 'bg-cyan-500/25 border-cyan-400/40', badge: '聽音辨字' },
        { id: 'quiz-mixed', name: '綜合全能測驗', iconComp: Trophy, iconColor: 'text-amber-400', iconBg: 'bg-amber-500/25 border-amber-400/40', badge: '隨機挑戰' }
      ]
    },
    {
      id: 'battle',
      title: '多人連線',
      enTitle: 'LIVE BATTLE',
      icon: Swords,
      bgImage: POSTER_BATTLE,
      tag: 'LIVE 對戰',
      colorName: 'purple',
      titleGlow: 'bg-gradient-to-b from-white via-purple-200 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] drop-shadow-[0_0_18px_rgba(217,70,239,0.8)]',
      spineTextColor: 'text-purple-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]',
      borderClass: 'border-purple-500/60 hover:border-purple-400',
      activeRingClass: 'ring-purple-400/60 border-purple-300',
      tagBadge: 'bg-purple-950/80 text-purple-300 border-purple-400/50',
      plaqueBg: 'bg-purple-950/75 border-purple-400/40 shadow-purple-950/50',
      summary: '星際擂台 • 雙人交鋒 • 榮譽爭霸',
      isDirectJump: true,
      jumpTarget: 'battle'
    },
    {
      id: 'town',
      title: '霧臺小鎮',
      enTitle: 'WUTAI TOWN',
      icon: Store,
      bgImage: POSTER_TOWN,
      tag: '部落探索',
      colorName: 'yellow',
      titleGlow: 'bg-gradient-to-b from-amber-100 via-amber-200 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] drop-shadow-[0_0_18px_rgba(234,179,8,0.7)]',
      spineTextColor: 'text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]',
      borderClass: 'border-yellow-600/60 hover:border-yellow-400',
      activeRingClass: 'ring-yellow-400/60 border-yellow-300',
      tagBadge: 'bg-amber-950/80 text-yellow-300 border-yellow-500/50',
      plaqueBg: 'bg-amber-950/75 border-yellow-500/40 shadow-amber-950/50',
      summary: '夕陽百岳 • 石板屋舍 • 族人學伴',
      isDirectJump: true,
      jumpTarget: 'town'
    }
  ], []);

  // ── 單元資料分組 ──
  const groupedUnits = useMemo(() => {
    const map = {};
    words.forEach(w => {
      const bKey = String(w.book);
      if (!map[bKey]) {
        map[bKey] = {
          book: bKey,
          author: w.author || 'Official',
          lessons: new Set()
        };
      }
      map[bKey].lessons.add(w.lesson);
    });
    return map;
  }, [words]);

  // ── 年級對應預設冊次 ──
  const recommendedBooks = useMemo(() => {
    if (studentGradeNum <= 2) return ['abc'];
    if (studentGradeNum === 3) return ['1', '2'];
    if (studentGradeNum === 4) return ['3', '4'];
    if (studentGradeNum === 5) return ['5', '6'];
    if (studentGradeNum === 6) return ['7', '8'];
    return ['1', '2'];
  }, [studentGradeNum]);

  // ── 低年級字母模式狀態 ──
  const [alphaMode, setAlphaMode] = useState('mixed'); // 'upper' | 'lower' | 'mixed'

  // ── 智慧記憶機制：自動帶入學生上次的選擇，並在年級切換時安全防禦 ──
  const STORAGE_KEY_UNITS = 'wutai_saved_selected_units';

  // 當學生年級或題庫就緒時，嘗試恢復上次合法的選擇；若無或年級不符則保持預設空選取
  useEffect(() => {
    // 低年級為字母模式，不需套用單元記憶
    if (studentGradeNum <= 2) {
      if (settings.selectedUnits && settings.selectedUnits.length > 0) {
        setSettings(prev => ({ ...prev, selectedUnits: [] }));
      }
      return;
    }

    try {
      const savedRaw = localStorage.getItem(STORAGE_KEY_UNITS);
      if (savedRaw) {
        const savedData = JSON.parse(savedRaw);
        // 防禦機制 1：檢查記憶的年級是否與當前學生完全相符
        if (savedData && savedData.gradeNum === studentGradeNum && Array.isArray(savedData.units)) {
          // 防禦機制 2：檢查單元是否真正存在於目前的 words 題庫中
          const validUnits = savedData.units.filter(uKey => {
            const [b, l] = uKey.split('-');
            return words.some(w => String(w.book) === b && String(w.lesson) === l);
          });

          // 若當前 settings.selectedUnits 尚未設定或與已記憶不同，且有效單元大於 0，則安全帶入
          if (validUnits.length > 0) {
            setSettings(prev => {
              // 避免無窮觸發
              const prevSorted = [...(prev.selectedUnits || [])].sort().join(',');
              const validSorted = [...validUnits].sort().join(',');
              if (prevSorted === validSorted) return prev;
              return { ...prev, selectedUnits: validUnits };
            });
            return;
          }
        }
      }
    } catch (e) {
      console.warn('讀取單元記憶失敗:', e);
    }
  }, [studentGradeNum, words, setSettings]);

  // 輔助函式：儲存單元選擇並更新 settings
  const updateAndSaveUnits = (updater) => {
    setSettings(prev => {
      const nextUnits = typeof updater === 'function' ? updater(prev.selectedUnits || []) : updater;
      try {
        if (studentGradeNum > 2) {
          localStorage.setItem(STORAGE_KEY_UNITS, JSON.stringify({
            gradeNum: studentGradeNum,
            studentId: currentStudent?.student_id || 'guest',
            units: nextUnits
          }));
        }
      } catch (e) {}
      return {
        ...prev,
        selectedUnits: nextUnits
      };
    });
  };

  // ── 切換單元選取 ──
  const handleToggleUnit = (book, lesson) => {
    soundEngine.click();
    const key = `${book}-${lesson}`;
    updateAndSaveUnits(prevUnits => (
      prevUnits.includes(key)
        ? prevUnits.filter(u => u !== key)
        : [...prevUnits, key]
    ));
  };

  // ── 全選/反選該冊單元 ──
  const handleToggleAllBook = (book) => {
    soundEngine.click();
    const bookData = groupedUnits[book];
    if (!bookData) return;
    const allUnits = Array.from(bookData.lessons).map(l => `${book}-${l}`);
    const isAllSelected = allUnits.every(u => settings.selectedUnits.includes(u));

    updateAndSaveUnits(prevUnits => (
      isAllSelected
        ? prevUnits.filter(u => !u.startsWith(`${book}-`))
        : [...new Set([...prevUnits, ...allUnits])]
    ));
  };

  // ── 已選單字總數 ──
  const selectedWordsCount = useMemo(() => {
    if (studentGradeNum <= 2) return 26;
    return words.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`)).length;
  }, [studentGradeNum, words, settings.selectedUnits]);

  // ── 點擊欄位處理 ──
  const handleColumnClick = (col) => {
    soundEngine.click();
    if (col.isDirectJump) {
      onNavigate(col.jumpTarget);
      return;
    }
    if (activeCol === col.id) {
      return;
    }
    setActiveCol(col.id);
    if (col.games && col.games.length > 0) {
      setSelectedGame(col.games[0].id);
    }
  };

  // ── 點選具體子遊戲 ──
  const handleSelectGame = (gameId) => {
    soundEngine.click();
    setSelectedGame(gameId);
  };

  // ── 當前選中的遊戲資訊 ──
  const currentGameObj = useMemo(() => {
    for (const c of COLUMNS) {
      if (c.games) {
        const found = c.games.find(g => g.id === selectedGame);
        if (found) return { ...found, categoryTitle: c.title, colorName: c.colorName, bgImage: c.bgImage };
      }
    }
    return { id: 'escape', name: '神祕密室逃脫', iconComp: KeyRound, categoryTitle: '探索解謎', bgImage: POSTER_EXPLORE };
  }, [COLUMNS, selectedGame]);

  // ── 上一步 ──
  const handleGoBack = () => {
    soundEngine.click();
    if (step === 'scope') {
      setStep('game');
    } else if (activeCol !== null) {
      setActiveCol(null);
    } else {
      onNavigate('portal');
    }
  };

  // ── 下一步 / 開始遊戲 ──
  const handleGoNext = () => {
    soundEngine.click();
    if (step === 'game') {
      if (!selectedGame) return;
      if (selectedGame === 'maze') {
        onNavigate('maze');
        return;
      }
      setStep('scope');
    } else if (step === 'scope') {
      if (studentGradeNum <= 2) {
        onNavigate(selectedGame);
      } else {
        if (selectedWordsCount === 0) return;
        onNavigate(selectedGame);
      }
    }
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none z-10 animate-fadeIn font-sans">
      
      {/* ── 背景星空環境微光 ── */}
      <div className="absolute inset-0 bg-slate-950 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ════════════════════════════════════════════════════════════════
          【固定頂部 HUD】左上回首頁 • 上中英雄榜 • 右上個人資訊通行證
         ════════════════════════════════════════════════════════════════ */}
      <header className="relative z-30 w-full px-3 sm:px-6 py-2.5 sm:py-3 bg-slate-950/85 backdrop-blur-md border-b border-white/10 flex items-center justify-between shadow-xl shrink-0">
        
        {/* 左上角：回首頁 */}
        <button
          type="button"
          onClick={() => {
            soundEngine.click();
            onNavigate('portal');
          }}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/15 text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          title="返回英語學習宇宙首頁"
        >
          <Home className="w-4 h-4 text-emerald-400" />
          <span>回首頁</span>
        </button>

        {/* 置上中：英雄榜 */}
        <button
          type="button"
          onClick={() => {
            soundEngine.click();
            onOpenLeaderboard();
          }}
          className="px-4 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/25 via-yellow-500/30 to-amber-500/25 hover:from-amber-500/35 hover:to-yellow-500/45 border-2 border-amber-400/60 text-amber-200 font-heading text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
          title="查看全校與年級英雄榜"
        >
          <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
          <span className="tracking-wide">英雄榜</span>
          <span className="hidden md:inline text-[11px] text-amber-300/80 font-mono">
            (看{studentGradeNum}年級排行)
          </span>
        </button>

        {/* 右上角：個人資訊通行證 */}
        <button
          type="button"
          onClick={() => {
            soundEngine.click();
            if (openModal) openModal();
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-white/20 text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          title="點擊修改個人身分/座號"
        >
          <User className="w-3.5 h-3.5 text-emerald-400" />
          <span className="max-w-[120px] truncate">
            {formatStudentBadge(currentStudent, lang) || '設置個人身分'}
          </span>
          {currentStudent?.coins !== undefined && (
            <span className="text-amber-400 font-mono font-bold flex items-center gap-1 ml-1 text-xs">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{currentStudent.coins}</span>
            </span>
          )}
        </button>

      </header>

      {/* ════════════════════════════════════════════════════════════════
          【中央主舞台】Step 1: 五欄彈性手風琴選遊戲 / Step 2: 範圍選取
         ════════════════════════════════════════════════════════════════ */}
      <main className="relative z-20 flex-1 w-full max-w-7xl mx-auto p-2 sm:p-3 md:p-4 flex flex-col justify-center overflow-hidden">
        
        {/* ────────────────────────────────────────────────────────
            【步驟一：選遊戲】iPad/電腦橫向 5 欄手風琴，手機縱向 5 列手風琴
           ──────────────────────────────────────────────────────── */}
        {step === 'game' && (
          <div className="w-full h-full flex flex-col md:flex-row items-stretch gap-2 sm:gap-2.5 md:gap-3 overflow-hidden">
            {COLUMNS.map((col) => {
              const isSelectedCol = activeCol === col.id;
              const isCompressed = activeCol !== null && !isSelectedCol;

              // 彈性比例 (Flex Ratio)：
              // 未點選時均為 1；選中該欄時該欄為 6.5 (佔約 65%)，其餘壓縮為 0.85 (佔約 8%)
              const flexStyle = {
                flex: isSelectedCol ? (window.innerWidth >= 768 ? 6.5 : 5.5) : isCompressed ? 0.85 : 1
              };

              return (
                <div
                  key={col.id}
                  style={flexStyle}
                  onClick={() => !isSelectedCol && handleColumnClick(col)}
                  className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col cursor-pointer group shadow-2xl ${
                    isSelectedCol
                      ? `${col.activeRingClass} ring-4 shadow-[0_0_35px_rgba(0,0,0,0.8)]`
                      : isCompressed
                      ? 'border-white/10 hover:border-white/30 opacity-75 hover:opacity-100'
                      : `${col.borderClass} hover:scale-[1.01]`
                  }`}
                >
                  
                  {/* ── 專屬電影級插畫背景圖層 (保持極高清晰度，移除遮蓋) ── */}
                  <img
                    src={col.bgImage}
                    alt={col.title}
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out select-none pointer-events-none ${
                      isSelectedCol
                        ? 'brightness-[0.6] contrast-[1.05]'
                        : isCompressed
                        ? 'brightness-[0.35] contrast-[1.1]'
                        : 'brightness-[0.85] contrast-[1.05] group-hover:brightness-[0.95] group-hover:scale-105'
                    }`}
                  />

                  {/* 融入環境的主題光影漸層遮罩：上方與中央幾近透明，下方有舒適暗漸層供文字判讀 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/25 to-slate-950/20 pointer-events-none" />

                  {/* ── 狀態 A：壓縮狀態 (細條書脊 - 正立漢字縱排，徹底杜絕倒立旋轉) ── */}
                  {isCompressed ? (
                    <div className="relative z-10 w-full h-full flex md:flex-col items-center justify-between p-2 sm:p-2.5 text-center animate-fadeIn select-none">
                      {/* 頂部細緻光標 */}
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1" />
                      
                      {/* 正立漢字縱向排列 (由上而下，字距適中，極易閱讀，純中文字) */}
                      <div className="flex md:flex-col items-center justify-center gap-1.5 sm:gap-2 my-auto select-none">
                        {col.title.split('').map((char, cIdx) => (
                          <span
                            key={cIdx}
                            className={`text-sm sm:text-base font-black font-serif ${col.spineTextColor} tracking-widest`}
                          >
                            {char}
                          </span>
                        ))}
                      </div>

                      {/* 底部微光指示燈 */}
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white animate-pulse mb-1" />
                    </div>
                  ) : isSelectedCol ? (
                    /* ── 狀態 B：展開狀態 (約佔 65%，中央完全留空展示精美大圖，底部小尺寸 2×2 精煉無滑動卡片) ── */
                    <div className="relative z-10 w-full h-full p-3 sm:p-4 md:p-5 flex flex-col justify-between overflow-hidden animate-fadeIn select-none">
                      
                      {/* 展開頂部：精簡半透明銘牌，高度僅約 36px，無遮擋大圖示 */}
                      <div className={`px-3 py-1.5 sm:py-2 rounded-xl backdrop-blur-md border shadow-lg flex items-center justify-between shrink-0 ${col.plaqueBg}`}>
                        <div className="flex items-center gap-2">
                          <h3 className={`text-base sm:text-xl font-black font-serif tracking-wider ${col.titleGlow}`}>
                            {col.title}
                          </h3>
                          <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase hidden sm:inline">
                            {col.enTitle}
                          </span>
                          <span className="text-xs text-slate-300 font-bold hidden md:inline ml-1">
                            • {col.summary}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundEngine.click();
                            setActiveCol(null);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-black/50 hover:bg-black/70 text-slate-300 hover:text-white text-xs font-bold border border-white/20 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                          title="還原所有欄位"
                        >
                          <X className="w-3 h-3" />
                          <span>還原</span>
                        </button>
                      </div>

                      {/* 中央舞台：完全留空，讓原畫震撼視野完整展現！ */}
                      <div className="flex-1 min-h-[30px]" />

                      {/* 展開底部：縮小版 2×2 子區塊，完全避免捲軸滑動，極致精練 */}
                      <div className="w-full max-w-2xl mx-auto flex flex-col gap-1.5 shrink-0">
                        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                          {col.games?.map((g) => {
                            const isGameActive = selectedGame === g.id;
                            const IconComp = g.iconComp;
                            return (
                              <div
                                key={g.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectGame(g.id);
                                }}
                                className={`px-3 py-2 sm:py-2.5 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-2 relative group active:scale-98 backdrop-blur-md ${
                                  isGameActive
                                    ? 'bg-amber-400 text-stone-950 border-amber-200 ring-2 ring-amber-300/80 shadow-lg font-black'
                                    : 'bg-slate-950/80 hover:bg-slate-900/90 text-white/95 border-white/20 hover:border-amber-400/60 shadow-md'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  {/* 微型小圖示，體積僅 14px，絕不喧賓奪主 */}
                                  <IconComp className={`w-3.5 h-3.5 shrink-0 ${
                                    isGameActive ? 'text-stone-950' : 'text-amber-300'
                                  }`} />
                                  <h4 className="text-xs sm:text-sm font-black tracking-wide truncate">
                                    {g.name}
                                  </h4>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                    isGameActive
                                      ? 'bg-stone-950/20 text-stone-950'
                                      : 'bg-white/10 text-slate-300'
                                  }`}>
                                    {g.badge}
                                  </span>
                                  {isGameActive && (
                                    <Check className="w-3.5 h-3.5 stroke-[3] text-stone-950" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* 底部小提示：極簡一行 */}
                        <div className="text-center text-[11px] font-bold text-amber-200/90 pt-0.5 shrink-0">
                          已選定「{currentGameObj.name}」，請點右下角「下一步 ➔」
                        </div>
                      </div>

                    </div>
                  ) : (
                    /* ── 狀態 C：均分 20% 預設狀態 (大插畫完整通透展現，完全拿掉中央遮擋，僅保留底部純中文字) ── */
                    <div className="relative z-10 w-full h-full p-3 sm:p-4 flex flex-col justify-between text-center group select-none">
                      
                      {/* 頂部精緻小標籤 (無任何 emoji) */}
                      <div className="w-full flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border backdrop-blur-md ${col.tagBadge}`}>
                          {col.tag}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-white/70 group-hover:translate-x-1 transition-transform" />
                      </div>

                      {/* 中央完全留空！讓原畫的遺跡、熔岩、星空書閣、競技場、大武山全景 100% 盡收眼底！ */}
                      <div className="flex-1" />

                      {/* 底部文字匾額：純中文字，雕刻字型深度融入，絕不遮掩全圖 */}
                      <div className="w-full flex flex-col items-center pb-1">
                        <h3 className={`text-xl sm:text-2xl md:text-2xl lg:text-3xl font-black font-serif tracking-widest ${col.titleGlow}`}>
                          {col.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs font-bold text-slate-200/90 mt-0.5 line-clamp-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                          {col.summary}
                        </p>
                        <div className="mt-2 w-full py-1.5 rounded-xl bg-black/40 hover:bg-black/60 group-hover:bg-black/70 text-white font-black text-xs transition-colors border border-white/15 shadow">
                          {col.isDirectJump ? '點擊直通 ➔' : '點擊展開 ➔'}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

        {/* ────────────────────────────────────────────────────────
            【步驟二：選範圍】單一視窗零滾動，直出該年級所屬範圍與「其他」
           ──────────────────────────────────────────────────────── */}
        {step === 'scope' && (
          <div className="relative w-full h-full max-h-[82vh] p-4 sm:p-6 rounded-3xl overflow-hidden border-2 border-amber-400/60 shadow-2xl flex flex-col justify-between animate-fadeIn">
            
            {/* 範圍頁背景插畫 (帶入所選遊戲主題背景) */}
            <img
              src={currentGameObj.bgImage}
              alt={currentGameObj.name}
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.35] contrast-[1.1] pointer-events-none select-none"
            />
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md pointer-events-none" />

            {/* 範圍頂部資訊欄 */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-white/15 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
                  <currentGameObj.iconComp className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-white font-heading">
                      {currentGameObj.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold">
                      {currentGameObj.categoryTitle}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-bold mt-0.5">
                    已自動錨定【{studentGradeNum}年級】教材範圍，點選單元即可開始：
                  </p>
                </div>
              </div>

              {/* 切換「其他範圍 / 全冊全展開」按鈕 */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.click();
                  setShowAllBooks(prev => !prev);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer border ${
                  showAllBooks
                    ? 'bg-amber-400 text-stone-950 border-amber-200 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:text-white border-white/20'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{showAllBooks ? '收合為本年級' : '其他年級/全冊自選'}</span>
              </button>
            </div>

            {/* ── 核心範圍膠囊區 (依年級直出) ── */}
            <div className="relative z-10 flex-1 my-3 overflow-y-auto pr-1">
              
              {/* 【低年級 1~2 年級】直出三大字母膠囊，不出現冊次 */}
              {studentGradeNum <= 2 && !showAllBooks ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                  <div className="text-center mb-6">
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/40">
                      低年級專屬 • 字母啟蒙
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black text-white font-heading mt-2">
                      請選擇字母挑戰模式：
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl">
                    {[
                      { key: 'upper', title: '大寫字母', en: 'UPPERCASE', sub: 'A ~ Z 認知辨析' },
                      { key: 'lower', title: '小寫字母', en: 'LOWERCASE', sub: 'a ~ z 認知辨析' },
                      { key: 'mixed', title: '大小寫混合', en: 'MIXED (A-z)', sub: 'A-z 全能綜合' }
                    ].map((mode) => {
                      const isActive = alphaMode === mode.key;
                      return (
                        <button
                          key={mode.key}
                          type="button"
                          onClick={() => {
                            soundEngine.click();
                            setAlphaMode(mode.key);
                          }}
                          className={`p-5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center active:scale-95 ${
                            isActive
                              ? 'bg-emerald-500 text-white border-emerald-300 ring-4 ring-emerald-400/40 shadow-xl scale-103'
                              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-white/20'
                          }`}
                        >
                          <span className="text-lg sm:text-xl font-black font-heading mb-0.5">
                            {mode.title}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-200 uppercase tracking-widest mb-1">
                            {mode.en}
                          </span>
                          <span className="text-xs opacity-80 font-bold">
                            {mode.sub}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* 【中高年級 3~6 年級 或 其他全選】直出冊次與單元膠囊 */
                <div className="space-y-4">
                  {(showAllBooks ? Object.keys(groupedUnits).sort() : recommendedBooks).map((bKey) => {
                    const bData = groupedUnits[bKey];
                    if (!bData) return null;
                    const lessonsArr = Array.from(bData.lessons);
                    const allSelected = lessonsArr.every(l => settings.selectedUnits.includes(`${bKey}-${l}`));

                    return (
                      <div
                        key={bKey}
                        className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col gap-2.5 backdrop-blur-md"
                      >
                        {/* 冊次標題列與全選按鈕 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-stone-950 text-xs font-black font-mono">
                              Book {bKey}
                            </span>
                            <span className="text-xs sm:text-sm font-black text-amber-200">
                              {bData.author === 'Official' ? `Here We Go 第 ${bKey} 冊` : bKey}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleAllBook(bKey)}
                            className="px-2.5 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                          >
                            {allSelected ? '✓ 取消全選' : '+ 全選本冊'}
                          </button>
                        </div>

                        {/* 單元膠囊清單 */}
                        <div className="flex flex-wrap gap-2">
                          {lessonsArr.map((lesson) => {
                            const isSelected = settings.selectedUnits.includes(`${bKey}-${lesson}`);
                            return (
                              <button
                                key={lesson}
                                type="button"
                                onClick={() => handleToggleUnit(bKey, lesson)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 border ${
                                  isSelected
                                    ? 'bg-emerald-500 text-white border-emerald-300 shadow-md ring-2 ring-emerald-400/40 scale-102'
                                    : 'bg-slate-950/80 text-slate-300 hover:text-white border-white/15'
                                }`}
                              >
                                <span>{isSelected ? '✓' : '•'}</span>
                                <span>{lesson}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* 範圍底部摘要 */}
            <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/15 text-xs text-slate-300 shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-bold">已挑選單元：</span>
                <span className="text-emerald-400 font-mono font-black">
                  {studentGradeNum <= 2 && !showAllBooks ? '字母全套' : `${settings.selectedUnits.length} 個單元`}
                </span>
                <span className="font-bold ml-2">字數：</span>
                <span className="text-amber-400 font-mono font-black">
                  {selectedWordsCount} 字
                </span>
              </div>

              {qualifyingBook && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold hidden sm:inline flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span>符合榮譽榜資格 (同冊超過20字或選滿2單元)</span>
                </span>
              )}
            </div>

          </div>
        )}

      </main>

      {/* ════════════════════════════════════════════════════════════════
          【固定底部導航列】左下上一頁 • 右下下一步 / 開始遊戲
         ════════════════════════════════════════════════════════════════ */}
      <footer className="relative z-30 w-full px-3 sm:px-6 py-2.5 sm:py-3.5 bg-slate-950/85 backdrop-blur-md border-t border-white/10 flex items-center justify-between shadow-xl shrink-0">
        
        {/* 左下角：上一頁 */}
        <button
          type="button"
          onClick={handleGoBack}
          className="px-4 py-2 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white text-xs sm:text-sm font-black flex items-center gap-1.5 border border-white/20 shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>{step === 'scope' ? '回選遊戲' : activeCol !== null ? '還原選單' : '回首頁'}</span>
        </button>

        {/* 提示訊息 (電腦版) */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-bold">
          <span>{step === 'game' ? '請點選遊戲 ➔ 點擊下一步' : '挑選完成 ➔ 立即開始！'}</span>
        </div>

        {/* 右下角：下一步 ➔ / 開始遊戲 */}
        <button
          type="button"
          onClick={handleGoNext}
          disabled={step === 'scope' && studentGradeNum > 2 && selectedWordsCount === 0}
          className={`px-5 sm:px-7 py-2.5 rounded-2xl font-heading font-black text-xs sm:text-base flex items-center gap-2 shadow-xl active:scale-95 transition-all cursor-pointer border-2 ${
            step === 'scope' && studentGradeNum > 2 && selectedWordsCount === 0
              ? 'bg-slate-800 text-slate-500 border-white/10 opacity-50 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-stone-950 border-amber-200'
          }`}
        >
          <span>
            {step === 'game' 
              ? '下一步 ➔' 
              : `開始遊戲 (${selectedWordsCount} 字)`
            }
          </span>
          {step === 'scope' && <Play className="w-4 h-4 fill-stone-950" />}
        </button>

      </footer>

    </div>
  );
};
