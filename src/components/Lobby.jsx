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
  Sun, Moon, VolumeX, ShieldCheck, Layers, HelpCircle
} from 'lucide-react';

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

  // ── 五大欄位定義與子遊戲資料 ──
  const COLUMNS = useMemo(() => [
    {
      id: 'explore',
      title: '探索解謎',
      icon: KeyRound,
      emoji: '🔍',
      tag: '4 款遊戲',
      colorName: 'emerald',
      gradient: 'from-emerald-900/90 via-teal-950/80 to-slate-950',
      activeBorder: 'border-emerald-400',
      activeRing: 'ring-emerald-400/50',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      spineText: '探索解謎 • 密室 鷹眼 迷宮 記憶',
      summary: '逃脫 • 鷹眼 • 迷宮 • 記憶',
      isDirectJump: false,
      games: [
        { id: 'escape', name: '神祕密室逃脫', icon: '🗝️', badge: '沉浸解謎' },
        { id: 'spotter', name: '鷹眼神探找不同', icon: '👁️', badge: '視覺辨析' },
        { id: 'maze', name: '字母巡航迷宮', icon: '🧭', badge: '字母連線' },
        { id: 'memory', name: '翻牌記憶對決', icon: '🃏', badge: '記憶配對' }
      ]
    },
    {
      id: 'speed',
      title: '極速反應',
      icon: Flame,
      emoji: '⚡',
      tag: '4 款遊戲',
      colorName: 'amber',
      gradient: 'from-amber-900/90 via-orange-950/80 to-slate-950',
      activeBorder: 'border-amber-400',
      activeRing: 'ring-amber-400/50',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      spineText: '極速反應 • 是非 隕石 拖曳 貪蛇',
      summary: '是非 • 隕石 • 拖曳 • 貪蛇',
      isDirectJump: false,
      games: [
        { id: 'swipe', name: '極速是非滑牌', icon: '⚡', badge: '手速比拼' },
        { id: 'meteor', name: '3D 隕石防衛戰', icon: '🚀', badge: '打字擊墜' },
        { id: 'spelling', name: '單字拖曳拼裝', icon: '🧩', badge: '積木拼字' },
        { id: 'snake', name: '叢林神山貪蛇', icon: '🐍', badge: '百步蛇' }
      ]
    },
    {
      id: 'quiz',
      title: '經典測驗',
      icon: Keyboard,
      emoji: '📝',
      tag: '4 款遊戲',
      colorName: 'blue',
      gradient: 'from-blue-900/90 via-indigo-950/80 to-slate-950',
      activeBorder: 'border-blue-400',
      activeRing: 'ring-blue-400/50',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
      spineText: '經典測驗 • 中翻英 英翻中 聽力 綜合',
      summary: '中翻英 • 英翻中 • 聽力 • 綜合',
      isDirectJump: false,
      games: [
        { id: 'quiz-zh-en', name: '看中選英', icon: '🔤', badge: '中文選英文' },
        { id: 'quiz-en-zh', name: '看英選中', icon: '📖', badge: '英文選中文' },
        { id: 'quiz-listening', name: '英語聽力', icon: '🎧', badge: '聽音辨字' },
        { id: 'quiz-mixed', name: '綜合全能測驗', icon: '🎯', badge: '隨機挑戰' }
      ]
    },
    {
      id: 'battle',
      title: '多人連線',
      icon: Swords,
      emoji: '🌐',
      tag: 'LIVE 對戰',
      colorName: 'purple',
      gradient: 'from-purple-900/90 via-fuchsia-950/80 to-slate-950',
      activeBorder: 'border-purple-400',
      activeRing: 'ring-purple-400/50',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
      spineText: '多人連線 • 烈焰 翡翠 星空',
      summary: '烈焰 • 翡翠 • 星空',
      isDirectJump: true,
      jumpTarget: 'battle'
    },
    {
      id: 'town',
      title: '霧臺小鎮',
      icon: Store,
      emoji: '🏛️',
      tag: '部落探索',
      colorName: 'yellow',
      gradient: 'from-amber-950/90 via-stone-900/90 to-slate-950',
      activeBorder: 'border-yellow-400',
      activeRing: 'ring-yellow-400/50',
      badgeBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40',
      spineText: '霧臺小鎮 • 漫步主街 族人學伴',
      summary: '漫步主街 • 拜訪族人',
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

  // ── 自動為所屬年級預選第一個單元 (若尚未選取) ──
  useEffect(() => {
    if (studentGradeNum > 2 && (!settings.selectedUnits || settings.selectedUnits.length === 0)) {
      const firstBook = recommendedBooks[0];
      const bookData = groupedUnits[firstBook];
      if (bookData && bookData.lessons.size > 0) {
        const firstLesson = Array.from(bookData.lessons)[0];
        setSettings(prev => ({
          ...prev,
          selectedUnits: [`${firstBook}-${firstLesson}`]
        }));
      }
    }
  }, [studentGradeNum, recommendedBooks, groupedUnits, settings.selectedUnits, setSettings]);

  // ── 切換單元選取 ──
  const handleToggleUnit = (book, lesson) => {
    soundEngine.click();
    const key = `${book}-${lesson}`;
    setSettings(prev => ({
      ...prev,
      selectedUnits: prev.selectedUnits.includes(key)
        ? prev.selectedUnits.filter(u => u !== key)
        : [...prev.selectedUnits, key]
    }));
  };

  // ── 全選/反選該冊單元 ──
  const handleToggleAllBook = (book) => {
    soundEngine.click();
    const bookData = groupedUnits[book];
    if (!bookData) return;
    const allUnits = Array.from(bookData.lessons).map(l => `${book}-${l}`);
    const isAllSelected = allUnits.every(u => settings.selectedUnits.includes(u));

    setSettings(prev => ({
      ...prev,
      selectedUnits: isAllSelected
        ? prev.selectedUnits.filter(u => !u.startsWith(`${book}-`))
        : [...new Set([...prev.selectedUnits, ...allUnits])]
    }));
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
      // 再次點擊展開中的欄位：選中第一個子遊戲
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
        if (found) return { ...found, categoryTitle: c.title, colorName: c.colorName };
      }
    }
    return { id: 'escape', name: '神祕密室逃脫', icon: '🗝️', categoryTitle: '探索解謎' };
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
      // 字母迷宮遊戲直接啟動，其他遊戲進入選範圍
      if (selectedGame === 'maze') {
        onNavigate('maze');
        return;
      }
      setStep('scope');
    } else if (step === 'scope') {
      if (studentGradeNum <= 2) {
        // 低年級特殊轉導：若選了字母迷宮直接進，其他依字母出題
        onNavigate(selectedGame);
      } else {
        if (selectedWordsCount === 0) return;
        onNavigate(selectedGame);
      }
    }
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none z-10 animate-fadeIn">
      
      {/* ── 背景星空環境光暈 ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ════════════════════════════════════════════════════════════════
          【固定頂部 HUD】左上回首頁 • 上中英雄榜 • 右上個人資訊通行證
         ════════════════════════════════════════════════════════════════ */}
      <header className="relative z-30 w-full px-3 sm:px-6 py-2.5 sm:py-3.5 bg-slate-900/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between shadow-lg shrink-0">
        
        {/* 左上角：回首頁 */}
        <button
          type="button"
          onClick={() => {
            soundEngine.click();
            onNavigate('portal');
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/15 text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
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
          className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 hover:from-amber-500/30 hover:to-yellow-500/40 border border-amber-400/50 text-amber-300 font-heading text-xs sm:text-sm font-black flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
          title="查看全校與年級英雄榜"
        >
          <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>🏆 英雄榜</span>
          <span className="hidden md:inline text-[11px] text-amber-300/80 font-mono">
            (看{studentGradeNum}年級排行)
          </span>
        </button>

        {/* 右上角：個人資訊通行證 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.click();
              if (openModal) openModal();
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white border border-white/20 text-xs font-black flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            title="點擊修改個人身分/座號"
          >
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span className="max-w-[120px] truncate">
              {formatStudentBadge(currentStudent, lang) || '設置個人身分'}
            </span>
            {currentStudent?.coins !== undefined && (
              <span className="text-amber-400 font-mono font-bold flex items-center gap-0.5 ml-1">
                🪙 {currentStudent.coins}
              </span>
            )}
          </button>
        </div>

      </header>

      {/* ════════════════════════════════════════════════════════════════
          【中央主舞台】Step 1: 五欄彈性手風琴選遊戲 / Step 2: 範圍選取
         ════════════════════════════════════════════════════════════════ */}
      <main className="relative z-20 flex-1 w-full max-w-7xl mx-auto p-2.5 sm:p-4 md:p-6 flex flex-col justify-center overflow-hidden">
        
        {/* ────────────────────────────────────────────────────────
            【步驟一：選遊戲】iPad/電腦橫向 5 欄手風琴，手機縱向 5 列手風琴
           ──────────────────────────────────────────────────────── */}
        {step === 'game' && (
          <div className="w-full h-full max-h-[82vh] flex flex-col md:flex-row items-stretch gap-2.5 sm:gap-3.5 md:gap-4 overflow-hidden">
            {COLUMNS.map((col, idx) => {
              const isSelectedCol = activeCol === col.id;
              const isCompressed = activeCol !== null && !isSelectedCol;

              // 彈性比例 (Flex Ratio)：
              // 未點選時均為 1；選中該欄時該欄為 6.2 (佔約 65%)，其餘壓縮為 0.8 (佔約 8%)
              const flexStyle = {
                flex: isSelectedCol ? (window.innerWidth >= 768 ? 6.2 : 5) : isCompressed ? 0.85 : 1
              };

              return (
                <div
                  key={col.id}
                  style={flexStyle}
                  onClick={() => !isSelectedCol && handleColumnClick(col)}
                  className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col cursor-pointer ${
                    isSelectedCol
                      ? `bg-gradient-to-br ${col.gradient} ${col.activeBorder} ring-4 ${col.activeRing} shadow-2xl`
                      : isCompressed
                      ? 'bg-slate-900/90 border-white/10 hover:border-white/30 opacity-75 hover:opacity-100'
                      : `bg-gradient-to-b ${col.gradient} border-white/20 hover:border-white/40 hover:scale-[1.01] shadow-lg`
                  }`}
                >
                  
                  {/* ── 狀態 A：壓縮狀態 (細條書脊) ── */}
                  {isCompressed ? (
                    <div className="w-full h-full flex md:flex-col items-center justify-between p-2.5 sm:p-3 text-center animate-fadeIn">
                      <span className="text-xl sm:text-2xl">{col.emoji}</span>
                      
                      {/* 直排標籤文字 (書脊) */}
                      <span className="text-xs sm:text-sm font-black text-slate-300 font-heading md:[writing-mode:vertical-rl] md:rotate-180 tracking-widest truncate">
                        {col.title}
                      </span>

                      <span className="w-2 h-2 rounded-full bg-white/40" />
                    </div>
                  ) : isSelectedCol ? (
                    /* ── 狀態 B：展開狀態 (約佔 65%，展示子遊戲 2×2 大格子) ── */
                    <div className="w-full h-full p-4 sm:p-6 flex flex-col justify-between overflow-y-auto animate-fadeIn">
                      
                      {/* 展開頂部欄 */}
                      <div className="flex items-center justify-between pb-2 border-b border-white/15 shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl sm:text-3xl">{col.emoji}</span>
                          <div>
                            <h3 className="text-lg sm:text-2xl font-black text-white font-heading">
                              {col.title}
                            </h3>
                            <p className="text-xs text-slate-300 font-bold hidden sm:block">
                              {col.summary}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundEngine.click();
                            setActiveCol(null);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
                          title="還原所有欄位"
                        >
                          ✕ 還原
                        </button>
                      </div>

                      {/* 2×2 子遊戲卡片清單 */}
                      <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 my-auto py-2">
                        {col.games?.map((g) => {
                          const isGameActive = selectedGame === g.id;
                          return (
                            <div
                              key={g.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectGame(g.id);
                              }}
                              className={`p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center relative group active:scale-95 ${
                                isGameActive
                                  ? 'bg-amber-400 text-stone-950 border-amber-200 ring-4 ring-amber-300/60 shadow-xl scale-102'
                                  : 'bg-slate-900/80 hover:bg-slate-800 text-white border-white/20 hover:border-amber-400/60'
                              }`}
                            >
                              {/* 勾選徽章 */}
                              {isGameActive && (
                                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-stone-950 text-amber-300 flex items-center justify-center text-xs font-black">
                                  ✓
                                </span>
                              )}

                              <span className="text-3xl sm:text-4xl mb-1.5 transition-transform group-hover:scale-110">
                                {g.icon}
                              </span>
                              
                              <h4 className="text-sm sm:text-base font-black font-heading leading-tight">
                                {g.name}
                              </h4>

                              <span className={`text-[10px] sm:text-xs font-bold mt-1 px-2 py-0.5 rounded-full ${
                                isGameActive
                                  ? 'bg-stone-950/20 text-stone-950'
                                  : 'bg-white/10 text-slate-300'
                              }`}>
                                {g.badge}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* 底部小提示 */}
                      <div className="text-center text-xs font-bold text-amber-200/90 pt-1 border-t border-white/10 shrink-0">
                        點選好遊戲後，請點擊右下角「下一步 ➔」挑選範圍！
                      </div>

                    </div>
                  ) : (
                    /* ── 狀態 C：均分 20% 預設狀態 (大圖示、大標題、精練說明) ── */
                    <div className="w-full h-full p-4 sm:p-5 flex flex-col items-center justify-between text-center group">
                      <div className="w-full flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${col.badgeBg}`}>
                          {col.tag}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </div>

                      <div className="my-auto flex flex-col items-center">
                        <span className="text-4xl sm:text-5xl md:text-6xl mb-3 drop-shadow transition-transform duration-300 group-hover:scale-115">
                          {col.emoji}
                        </span>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white font-heading">
                          {col.title}
                        </h3>
                        <p className="text-xs sm:text-sm font-bold text-slate-300 mt-1 line-clamp-2">
                          {col.summary}
                        </p>
                      </div>

                      <div className="w-full py-1.5 rounded-xl bg-white/10 group-hover:bg-white/20 text-white font-black text-xs transition-colors">
                        {col.isDirectJump ? '點擊直通 ➔' : '點擊展開 ➔'}
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
          <div className="w-full h-full max-h-[82vh] p-4 sm:p-6 rounded-3xl bg-slate-900/90 border-2 border-amber-400/60 backdrop-blur-md shadow-2xl flex flex-col justify-between overflow-hidden animate-fadeIn">
            
            {/* 範圍頂部資訊欄 */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-white/15 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentGameObj.icon}</span>
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
                    請確認挑戰範圍（已自動錨定【{studentGradeNum}年級】教材範圍）：
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
                <span>{showAllBooks ? '收合為本年級' : '🔄 其他年級/全冊自選'}</span>
              </button>
            </div>

            {/* ── 核心範圍膠囊區 (依年級直出) ── */}
            <div className="flex-1 my-3 overflow-y-auto pr-1">
              
              {/* 【低年級 1~2 年級】直出三大字母膠囊，不出現冊次 */}
              {studentGradeNum <= 2 && !showAllBooks ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                  <div className="text-center mb-6">
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/40">
                      🌱 低年級專屬 • 字母啟蒙
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black text-white font-heading mt-2">
                      請選擇字母挑戰模式：
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl">
                    {[
                      { key: 'upper', title: '🔠 大寫字母', sub: 'A ~ Z 認知辨析' },
                      { key: 'lower', title: '🔡 小寫字母', sub: 'a ~ z 認知辨析' },
                      { key: 'mixed', title: '🔀 大小寫混合', sub: 'A-z 全能綜合' }
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
                          <span className="text-xl sm:text-2xl font-black font-heading mb-1">
                            {mode.title}
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
                        className="p-3.5 rounded-2xl bg-slate-800/70 border border-white/10 flex flex-col gap-2.5"
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
                                    : 'bg-slate-900/90 text-slate-300 hover:text-white border-white/15'
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
            <div className="flex items-center justify-between pt-2 border-t border-white/15 text-xs text-slate-300 shrink-0">
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
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold hidden sm:inline">
                  🏆 符合榮譽榜資格 (單冊選滿2單元20字)
                </span>
              )}
            </div>

          </div>
        )}

      </main>

      {/* ════════════════════════════════════════════════════════════════
          【固定底部導航列】左下上一頁 • 右下下一步 / 🚀 開始遊戲
         ════════════════════════════════════════════════════════════════ */}
      <footer className="relative z-30 w-full px-3 sm:px-6 py-2.5 sm:py-3.5 bg-slate-900/90 backdrop-blur-md border-t border-white/10 flex items-center justify-between shadow-lg shrink-0">
        
        {/* 左下角：上一頁 */}
        <button
          type="button"
          onClick={handleGoBack}
          className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-black flex items-center gap-1.5 border border-white/20 shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>{step === 'scope' ? '回選遊戲' : activeCol !== null ? '還原選單' : '回首頁'}</span>
        </button>

        {/* 提示訊息 (電腦版) */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-bold">
          <span>{step === 'game' ? '請點選遊戲 ➔ 點擊下一步' : '挑選完成 ➔ 立即開始！'}</span>
        </div>

        {/* 右下角：下一步 ➔ / 🚀 開始遊戲 */}
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
              ? '下一步 ➔ (Next)' 
              : `🚀 開始遊戲 (${selectedWordsCount} 字)`
            }
          </span>
          {step === 'scope' && <Play className="w-4 h-4 fill-stone-950" />}
        </button>

      </footer>

    </div>
  );
};
