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
  X, Zap, Star
} from 'lucide-react';

const POSTER_EXPLORE = '/assets/lobby/theme_explore.jpg';
const POSTER_SPEED = '/assets/lobby/theme_speed.jpg';
const POSTER_QUIZ = '/assets/lobby/theme_quiz.jpg';
const POSTER_BATTLE = '/assets/lobby/theme_battle.jpg';
const POSTER_TOWN = '/assets/lobby/theme_town.jpg';

// ── 5 欄 × 2 列年級配對定義（由左至右：一二年級、三上三下、四上四下、五上五下、六上六下） ──
const GRADE_COLUMNS = [
  {
    colId: 'g1_g2',
    colLabel: '低年級',
    top: { id: 'g1', label: '一年級', book: 'abc', grade: 1, isAlpha: true, desc: '字母認讀' },
    bottom: { id: 'g2', label: '二年級', book: 'abc', grade: 2, isAlpha: true, desc: '自然發音' }
  },
  {
    colId: 'b1_b2',
    colLabel: '三年級',
    top: { id: 'b1', label: '三上', book: '1', grade: 3, semester: 1, desc: '第 1 冊' },
    bottom: { id: 'b2', label: '三下', book: '2', grade: 3, semester: 2, desc: '第 2 冊' }
  },
  {
    colId: 'b3_b4',
    colLabel: '四年級',
    top: { id: 'b3', label: '四上', book: '3', grade: 4, semester: 1, desc: '第 3 冊' },
    bottom: { id: 'b4', label: '四下', book: '4', grade: 4, semester: 2, desc: '第 4 冊' }
  },
  {
    colId: 'b5_b6',
    colLabel: '五年級',
    top: { id: 'b5', label: '五上', book: '5', grade: 5, semester: 1, desc: '第 5 冊' },
    bottom: { id: 'b6', label: '五下', book: '6', grade: 5, semester: 2, desc: '第 6 冊' }
  },
  {
    colId: 'b7_b8',
    colLabel: '六年級',
    top: { id: 'b7', label: '六上', book: '7', grade: 6, semester: 1, desc: '第 7 冊' },
    bottom: { id: 'b8', label: '六下', book: '8', grade: 6, semester: 2, desc: '第 8 冊' }
  }
];

const ALL_GRADE_OPTIONS = GRADE_COLUMNS.flatMap(c => [c.top, c.bottom]);

// ── 三到六年級通用單元順序 (由左至右順序固定) ──
const UNIVERSAL_UNITS = [
  { id: 'all', label: '🏆 全冊 (All)' },
  { id: 'starter', label: 'Starter' },
  { id: 'unit1', label: 'Unit 1' },
  { id: 'unit2', label: 'Unit 2' },
  { id: 'unit3', label: 'Unit 3' },
  { id: 'unit4', label: 'Unit 4' },
  { id: 'festival', label: 'Festival' }
];

// ── 各遊戲左下角真實精彩遊戲截圖瞬間 (羽化融景) ──
const GAME_SPOTLIGHT_ART = {
  mole: '/assets/screenshots/screenshot_mole.jpg',
  meteor: '/assets/screenshots/screenshot_meteor.jpg',
  snake: '/assets/screenshots/screenshot_snake.jpg',
  spotter: '/assets/spotter/book1_base.jpg',
  escape: '/assets/escape/bg_temple.webp',
  maze: '/assets/screenshots/screenshot_snake.jpg',
  swipe: '/assets/screenshots/screenshot_meteor.jpg',
  memory: '/assets/lobby/theme_explore.jpg',
  'quiz-zh-en': '/assets/lobby/theme_quiz.jpg',
  'quiz-en-zh': '/assets/lobby/theme_quiz.jpg',
  'quiz-listening': '/assets/lobby/theme_quiz.jpg',
  'quiz-mixed': '/assets/lobby/theme_quiz.jpg',
  town: '/assets/town/town_map_panorama.webp',
  battle: '/assets/lobby/theme_battle.jpg'
};

// ── 密室逃脫四大秘境手風琴定義 (調用第一室實景 WebP) ──
const ESCAPE_THEMES_PREVIEW = [
  {
    id: 'temple',
    name: '大武山石板神廟',
    enName: 'Ancient Slate Sanctuary',
    bg: '/assets/escape/bg_temple.webp',
    icon: '🏛️',
    tag: '石板傳奇',
    colorName: 'emerald',
    desc: '大武山古老石板遺跡，千斤巨石封鎖，解開回音石廊與星象祭壇！'
  },
  {
    id: 'dungeon',
    name: '黑曜熔岩地下城',
    enName: 'Obsidian Dungeon',
    bg: '/assets/escape/dungeon_room1.webp',
    icon: '⛓️',
    tag: '黑曜熔岩',
    colorName: 'amber',
    desc: '封閉百年的黑曜石囚室，破譯矮人符文與煉金長廊，啟動地心升降機！'
  },
  {
    id: 'tomb',
    name: '法老古墓黃金殿',
    enName: 'Pharaoh Gold Tomb',
    bg: '/assets/escape/tomb_room1.webp',
    icon: '🏺',
    tag: '尼羅秘藏',
    colorName: 'yellow',
    desc: '沉睡千年的金字塔砂岩墓道，解讀聖書體符文，迎向太陽神之巔！'
  },
  {
    id: 'asylum',
    name: '雨夜殘破時鐘樓',
    enName: 'Clockwork Asylum',
    bg: '/assets/escape/asylum_room1.webp',
    icon: '🕰️',
    tag: '雨夜鐘樓',
    colorName: 'violet',
    desc: '暴風雨之夜廢棄維多利亞鐘樓，齒輪嘎吱作響，在十二聲鐘響前逃脫！'
  }
];

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

  // ── 流程步驟：'game' (選遊戲手風琴) | 'scope' (專屬整備選冊/秘境頁) ──
  const [step, setStep] = useState('game');

  // ── 手風琴選中展開欄位：null (均分 20%) | 'explore' | 'speed' | 'quiz' ──
  const [activeCol, setActiveCol] = useState(null);

  // ── 當前選中的遊戲 ID ──
  const [selectedGame, setSelectedGame] = useState('escape');

  // ── 選定的冊次選項 ID (預設對應學生年級) ──
  const [selectedOptionId, setSelectedOptionId] = useState('b1');

  // ── 單元選取模式：'all' | 'starter' | 'unit1' | 'unit2' | 'unit3' | 'unit4' | 'festival' ──
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('all');

  // ── 低年級字母模式：'upper' | 'lower' | 'mixed' ──
  const [alphaMode, setAlphaMode] = useState('upper');

  // ── 密室逃脫選定主題 ──
  const [escapeThemeId, setEscapeThemeId] = useState('temple');

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

  // ── 根據學生年級自動初始化預設選項 ──
  useEffect(() => {
    if (studentGradeNum === 1) setSelectedOptionId('g1');
    else if (studentGradeNum === 2) setSelectedOptionId('g2');
    else if (studentGradeNum === 3) setSelectedOptionId('b1');
    else if (studentGradeNum === 4) setSelectedOptionId('b3');
    else if (studentGradeNum === 5) setSelectedOptionId('b5');
    else if (studentGradeNum === 6) setSelectedOptionId('b7');
  }, [studentGradeNum]);

  // ── 五大欄位定義 ──
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
        { id: 'spotter', name: '鷹眼神探找不同', iconComp: Eye, iconColor: 'text-amber-400', iconBg: 'bg-amber-500/25 border-amber-400/40', badge: '全冊紙雕' },
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
        { id: 'mole', name: '單字打地鼠', iconComp: Zap, iconColor: 'text-amber-300', iconBg: 'bg-amber-500/25 border-amber-400/40', badge: '地穴手速' },
        { id: 'swipe', name: '極速是非滑牌', iconComp: Flame, iconColor: 'text-rose-400', iconBg: 'bg-rose-500/25 border-rose-400/40', badge: '30秒對決' },
        { id: 'meteor', name: '3D 隕石防衛戰', iconComp: Rocket, iconColor: 'text-amber-400', iconBg: 'bg-amber-500/25 border-amber-400/40', badge: '打字擊墜' },
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

  // ── 題庫單元分組 ──
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

  // ── 當前選中的冊次選項資料 ──
  const currentOptionData = useMemo(() => {
    return ALL_GRADE_OPTIONS.find(o => o.id === selectedOptionId) || ALL_GRADE_OPTIONS[2];
  }, [selectedOptionId]);

  // ── 是否為僅支援全冊的遊戲 (如鷹眼神探找不同) ──
  const isWholeBookOnlyGame = selectedGame === 'spotter';

  // ── 當冊次或單元變更時，自動配置 settings.selectedUnits 確保上榜資格 ──
  useEffect(() => {
    if (currentOptionData.isAlpha) {
      setSettings(prev => ({
        ...prev,
        alphaMode: alphaMode,
        selectedUnits: ['abc']
      }));
    } else {
      const bKey = currentOptionData.book;
      const bData = groupedUnits[bKey];
      if (bData && bData.lessons) {
        const allUnits = Array.from(bData.lessons).map(l => `${bKey}-${l}`);
        
        if (selectedUnitFilter === 'all' || isWholeBookOnlyGame) {
          setSettings(prev => ({
            ...prev,
            alphaMode: null,
            selectedUnits: allUnits
          }));
        } else {
          // 對應指定單元
          let targetLessonNum = '1';
          if (selectedUnitFilter === 'starter') targetLessonNum = '0';
          else if (selectedUnitFilter === 'unit1') targetLessonNum = '1';
          else if (selectedUnitFilter === 'unit2') targetLessonNum = '2';
          else if (selectedUnitFilter === 'unit3') targetLessonNum = '3';
          else if (selectedUnitFilter === 'unit4') targetLessonNum = '4';
          else if (selectedUnitFilter === 'festival') targetLessonNum = 'festival';

          const matchedUnits = allUnits.filter(u => {
            const lessonPart = u.split('-')[1]?.toLowerCase() || '';
            return lessonPart.includes(targetLessonNum) || lessonPart === targetLessonNum;
          });

          setSettings(prev => ({
            ...prev,
            alphaMode: null,
            selectedUnits: matchedUnits.length > 0 ? matchedUnits : allUnits
          }));
        }
      }
    }
  }, [currentOptionData, alphaMode, selectedUnitFilter, isWholeBookOnlyGame, groupedUnits, setSettings]);

  // ── 已選單字總數 ──
  const selectedWordsCount = useMemo(() => {
    if (currentOptionData.isAlpha) return 26;
    return words.filter(w => (settings.selectedUnits || []).includes(`${w.book}-${w.lesson}`)).length;
  }, [currentOptionData, words, settings?.selectedUnits]);

  // ── 點擊外層欄位 ──
  const handleColumnClick = (col) => {
    soundEngine.click();
    if (col.isDirectJump) {
      onNavigate(col.jumpTarget);
      return;
    }
    setActiveCol(col.id);
    if (col.games && col.games.length > 0) {
      setSelectedGame(col.games[0].id);
    }
  };

  // ── 點選具體子遊戲：直接絲滑展開至 100% 全螢幕選冊整備頁 ──
  const handleSelectGame = (gameId) => {
    soundEngine.click();
    setSelectedGame(gameId);
    setStep('scope');
  };

  // ── 點選冊次 ──
  const handleSelectBookOption = (optId) => {
    soundEngine.click();
    setSelectedOptionId(optId);
  };

  // ── 點選字母模式 ──
  const handleSelectAlphaMode = (mode) => {
    soundEngine.click();
    setAlphaMode(mode);
    setSettings(prev => ({ ...prev, alphaMode: mode }));
  };

  // ── 點選通用單元 ──
  const handleSelectUnit = (unitId) => {
    soundEngine.click();
    setSelectedUnitFilter(unitId);
  };

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

  // ── 開始遊戲 ──
  const handleStartGame = () => {
    soundEngine.click();
    if (selectedGame === 'escape') {
      try {
        localStorage.setItem('wutai_escape_theme', escapeThemeId);
      } catch (e) {}
      onNavigate('escape');
    } else if (selectedGame === 'maze') {
      onNavigate('maze');
    } else {
      onNavigate(selectedGame);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none z-10 animate-fadeIn font-sans">
      
      {/* ── 背景星空環境微光 ── */}
      <div className="absolute inset-0 bg-slate-950 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ════════════════════════════════════════════════════════════════
          【固定頂部 HUD】左上回首頁 / 上一步 • 上中英雄榜 • 右上個人通行證
         ════════════════════════════════════════════════════════════════ */}
      <header className="relative z-30 w-full px-3 sm:px-6 py-2 sm:py-2.5 bg-slate-950/85 backdrop-blur-md border-b border-white/10 flex items-center justify-between shadow-xl shrink-0">
        
        {/* 左上角：上一步 / 回首頁 */}
        <button
          type="button"
          onClick={handleGoBack}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 hover:text-white border border-white/20 text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          title={step === 'scope' ? '返回選擇其他遊戲' : '返回英語學習宇宙首頁'}
        >
          {step === 'scope' ? (
            <>
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>回選遊戲</span>
            </>
          ) : (
            <>
              <Home className="w-4 h-4 text-emerald-400" />
              <span>回首頁</span>
            </>
          )}
        </button>

        {/* 置上中：英雄榜 或 整備室標題 */}
        {step === 'scope' ? (
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-2xl bg-slate-900/90 border border-white/20 shadow-md">
            <currentGameObj.iconComp className="w-4 h-4 text-amber-400" />
            <span className="font-heading font-black text-xs sm:text-sm tracking-wide text-white">
              {currentGameObj.name}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold">
              {currentGameObj.categoryTitle}
            </span>
          </div>
        ) : (
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
            <span className="hidden md:inline text-[11px] text-amber-300 font-mono">
              (看{studentGradeNum}年級排行)
            </span>
          </button>
        )}

        {/* 右上角：個人資訊通行證 */}
        <button
          type="button"
          onClick={() => {
            soundEngine.click();
            if (openModal) openModal();
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-white/25 text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          title="點擊修改個人身分/座號"
        >
          <User className="w-3.5 h-3.5 text-emerald-400" />
          <span className="max-w-[120px] truncate">
            {formatStudentBadge(currentStudent, lang) || '設置身分'}
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
          【中央主舞台】
          Step 1: 電腦橫向 5 欄 / 手機縱向 5 列手風琴
          Step 2: 5 欄 × 2 列上下配對網格 (位置偏上，下方預留專屬彈出區，零跳動)
         ════════════════════════════════════════════════════════════════ */}
      <main className="relative z-20 flex-1 w-full max-w-7xl mx-auto p-2 sm:p-3 md:p-4 flex flex-col justify-center overflow-hidden">
        
        {/* ────────────────────────────────────────────────────────
            【步驟一：選遊戲】電腦橫向手風琴 / 手機縱向手風琴
           ──────────────────────────────────────────────────────── */}
        {step === 'game' && (
          <div className="w-full h-full flex flex-col md:flex-row items-stretch gap-2 sm:gap-2.5 md:gap-3 overflow-hidden">
            {COLUMNS.map((col) => {
              const isSelectedCol = activeCol === col.id;
              const isCompressed = activeCol !== null && !isSelectedCol;

              // 彈性比例
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
                  
                  {/* 背景圖層 */}
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

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/25 to-slate-950/20 pointer-events-none" />

                  {/* 壓縮狀態 */}
                  {isCompressed ? (
                    <div className="relative z-10 w-full h-full flex md:flex-col items-center justify-between p-2 sm:p-2.5 text-center animate-fadeIn select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1" />
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
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white animate-pulse mb-1" />
                    </div>
                  ) : isSelectedCol ? (
                    /* 展開狀態 */
                    <div className="relative z-10 w-full h-full p-3 sm:p-4 md:p-5 flex flex-col justify-between overflow-hidden animate-fadeIn select-none">
                      
                      {/* 展開頂部銘牌 */}
                      <div className={`px-3 py-1.5 sm:py-2 rounded-xl backdrop-blur-md border shadow-lg flex items-center justify-between shrink-0 ${col.plaqueBg}`}>
                        <div className="flex items-center gap-2">
                          <h3 className={`text-base sm:text-xl font-black font-serif tracking-wider ${col.titleGlow}`}>
                            {col.title}
                          </h3>
                          <span className="text-[10px] font-mono tracking-widest text-white/70 uppercase hidden sm:inline">
                            {col.enTitle}
                          </span>
                          <span className="text-xs text-slate-200 font-bold hidden md:inline ml-1">
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
                          className="px-2.5 py-1 rounded-lg bg-black/50 hover:bg-black/70 text-slate-200 hover:text-white text-xs font-bold border border-white/20 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                          title="還原所有欄位"
                        >
                          <X className="w-3 h-3" />
                          <span>還原</span>
                        </button>
                      </div>

                      <div className="flex-1 min-h-[20px]" />

                      {/* 展開底部：子遊戲按鈕 */}
                      <div className="w-full max-w-2xl mx-auto flex flex-col gap-1.5 shrink-0">
                        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                          {col.games?.map((g) => {
                            const isGameActive = selectedGame === g.id;
                            const IconComp = g.iconComp;
                            return (
                              <button
                                key={g.id}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectGame(g.id);
                                }}
                                className={`px-3 py-2.5 sm:py-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-2 relative group active:scale-98 backdrop-blur-md shadow-lg ${
                                  isGameActive
                                    ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-stone-950 border-amber-200 ring-4 ring-amber-300/80 font-black scale-102'
                                    : 'bg-slate-950/85 hover:bg-slate-900/95 text-white/95 border-white/25 hover:border-amber-400/60 hover:scale-101'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                                    isGameActive ? 'bg-stone-950/20' : 'bg-amber-400/20 border border-amber-400/40'
                                  }`}>
                                    <IconComp className={`w-4 h-4 ${
                                      isGameActive ? 'text-stone-950' : 'text-amber-300'
                                    }`} />
                                  </div>
                                  <h4 className="text-xs sm:text-sm font-black tracking-wide truncate">
                                    {g.name}
                                  </h4>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                    isGameActive
                                      ? 'bg-stone-950/25 text-stone-950'
                                      : 'bg-white/10 text-slate-200'
                                  }`}>
                                    {g.badge}
                                  </span>
                                  <ChevronRight className={`w-4 h-4 ${isGameActive ? 'text-stone-950' : 'text-white/40'}`} />
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <div className="text-center text-[11px] font-bold text-amber-200 pt-1 shrink-0">
                          點選任一遊戲，直通專屬整備出征室 ➔
                        </div>
                      </div>

                    </div>
                  ) : (
                    /* 均分預設狀態 */
                    <div className="relative z-10 w-full h-full p-3 sm:p-4 flex flex-col justify-between text-center group select-none">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border shadow-sm ${col.tagBadge}`}>
                          {col.tag}
                        </span>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white/80 group-hover:text-white group-hover:scale-110 transition-transform">
                          <col.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                        </div>
                      </div>

                      <div className="my-auto flex flex-col items-center">
                        <h3 className={`text-xl sm:text-2xl md:text-3xl font-black font-serif tracking-wider drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] ${col.titleGlow}`}>
                          {col.title}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-white/70 font-mono tracking-widest uppercase mt-1">
                          {col.enTitle}
                        </p>
                      </div>

                      <div>
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
            【步驟二：專屬整備出征室】
            A. 若為「神祕密室逃脫」：全版四大秘境手風琴 (第一室實景 WebP)
            B. 若為其他遊戲：左下角靈魂剪影羽化融景 + 5 欄 × 2 列上下配對網格 (位置偏上，下方預留專屬單元彈出區，零跳動)
           ──────────────────────────────────────────────────────── */}
        {step === 'scope' && (
          <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-amber-400/60 shadow-2xl flex flex-col justify-between animate-fadeIn">
            
            {/* 滿版電影級背景圖層 */}
            <img
              src={currentGameObj.bgImage}
              alt={currentGameObj.name}
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.35] contrast-[1.1] pointer-events-none select-none"
            />
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md pointer-events-none" />

            {/* ═══ 分流 A：神祕密室逃脫 • 四大秘境手風琴 ═══ */}
            {selectedGame === 'escape' ? (
              <div className="relative z-10 w-full h-full p-3 sm:p-5 flex flex-col justify-between">
                
                {/* 秘境手風琴標題列 */}
                <div className="flex items-center justify-between pb-2 border-b border-white/15 shrink-0">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base sm:text-lg font-black text-white font-heading">
                      請選擇探索秘境：
                    </h3>
                  </div>
                  <span className="text-xs text-emerald-300 font-bold hidden sm:inline">
                    大武山四大古代封印，破解三室機關重現天日
                  </span>
                </div>

                {/* 四大秘境手風琴本體 */}
                <div className="flex-1 my-2 sm:my-3 flex flex-col md:flex-row items-stretch gap-2 sm:gap-3 overflow-hidden">
                  {ESCAPE_THEMES_PREVIEW.map((th) => {
                    const isSelected = escapeThemeId === th.id;
                    return (
                      <div
                        key={th.id}
                        onClick={() => {
                          soundEngine.click();
                          setEscapeThemeId(th.id);
                        }}
                        style={{
                          flex: isSelected ? (window.innerWidth >= 768 ? 4.5 : 3.5) : 1
                        }}
                        className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-500 ease-out cursor-pointer flex flex-col justify-between p-3 sm:p-4 shadow-xl ${
                          isSelected
                            ? 'border-amber-300 ring-4 ring-amber-400/50 shadow-[0_0_30px_rgba(245,158,11,0.5)]'
                            : 'border-white/15 hover:border-white/40 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={th.bg}
                          alt={th.name}
                          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 pointer-events-none select-none ${
                            isSelected ? 'scale-105 brightness-[0.7]' : 'brightness-[0.4]'
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-slate-950/20 pointer-events-none" />

                        {/* 卡片頂部 */}
                        <div className="relative z-10 flex items-center justify-between">
                          <span className="text-xl sm:text-2xl">{th.icon}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 text-amber-300 border border-amber-400/40 font-bold">
                            {th.tag}
                          </span>
                        </div>

                        {/* 卡片底部資訊 */}
                        <div className="relative z-10">
                          <h4 className="text-sm sm:text-lg font-black text-white font-heading">
                            {th.name}
                          </h4>
                          <p className="text-[10px] text-amber-200 font-mono tracking-wider uppercase mb-1">
                            {th.enName}
                          </p>
                          {isSelected && (
                            <p className="text-xs text-slate-200 font-bold line-clamp-2 mt-1 animate-fadeIn">
                              {th.desc}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 秘境底部開始按鈕 */}
                <div className="pt-2 border-t border-white/15 flex items-center justify-between shrink-0">
                  <div className="text-xs text-slate-200 font-bold">
                    已選定：<span className="text-amber-300 font-black">{ESCAPE_THEMES_PREVIEW.find(t => t.id === escapeThemeId)?.name}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartGame}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 hover:from-emerald-300 hover:to-teal-200 text-stone-950 font-heading font-black text-sm sm:text-base flex items-center gap-2 shadow-2xl active:scale-95 transition-all cursor-pointer border-2 border-emerald-200"
                  >
                    <span>🚪 進入秘境 START</span>
                    <Play className="w-4 h-4 fill-stone-950" />
                  </button>
                </div>

              </div>
            ) : (
              /* ═══ 分流 B：全單人通用整備室 ═══ */
              <div className="relative z-10 w-full h-full p-3 sm:p-4 md:p-5 flex flex-col justify-between overflow-hidden">
                
                {/* 頂部引導題字 */}
                <div className="flex items-center justify-between pb-2 border-b border-white/15 shrink-0">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm sm:text-base font-black text-white font-heading">
                      請選擇挑戰年級冊次：
                    </h3>
                  </div>

                  {/* 當前上榜資質標牌 */}
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] font-bold flex items-center gap-1.5 shadow">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>選冊即可直接獲得英雄榜資格</span>
                  </span>
                </div>

                {/* ── 核心舞台：左下角靈魂剪影 + 右側/中央 5 欄 × 2 列上下配對網格 ── */}
                <div className="relative flex-1 w-full my-1 sm:my-2 flex items-center justify-between gap-4 overflow-hidden">
                  
                  {/* 左下角：真實遊戲截圖瞬間 (雙重漸變極致透明羽化) */}
                  <div className="hidden lg:block absolute -left-4 -bottom-4 w-72 h-72 pointer-events-none select-none z-0">
                    <img
                      src={GAME_SPOTLIGHT_ART[selectedGame] || GAME_SPOTLIGHT_ART.mole}
                      alt="Game Action Spotlight"
                      className="w-full h-full object-cover rounded-3xl filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] brightness-95 contrast-105"
                      style={{
                        maskImage: 'linear-gradient(to top right, black 35%, transparent 85%), radial-gradient(circle at bottom left, black 50%, transparent 80%)',
                        WebkitMaskImage: 'linear-gradient(to top right, black 35%, transparent 85%), radial-gradient(circle at bottom left, black 50%, transparent 80%)'
                      }}
                    />
                  </div>

                  {/* 右側 / 中央面板：【位置偏上】5 欄 × 2 列上下排列 + 【下方預留】專屬單元彈出區 (零跳動) */}
                  <div className="relative z-10 w-full lg:max-w-4xl lg:ml-auto h-full flex flex-col justify-between py-1">
                    
                    {/* ── 【冊別偏上】5 欄 × 2 列網格 (一年級二年級上下、三上三下上下、四上四下上下、五上五下上下、六上六下上下) ── */}
                    <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5 w-full shrink-0">
                      {GRADE_COLUMNS.map((col) => {
                        const isTopSelected = selectedOptionId === col.top.id;
                        const isBottomSelected = selectedOptionId === col.bottom.id;
                        const isTopRecommended = studentGradeNum === col.top.grade;
                        const isBottomRecommended = studentGradeNum === col.bottom.grade;

                        return (
                          <div key={col.colId} className="flex flex-col gap-1.5 sm:gap-2">
                            
                            {/* 上排按鈕 (一年級、三上、四上、五上、六上) */}
                            <button
                              type="button"
                              onClick={() => handleSelectBookOption(col.top.id)}
                              className={`p-2 sm:p-2.5 rounded-2xl border-2 transition-all duration-150 cursor-pointer flex flex-col items-center justify-center relative active:scale-95 shadow-md ${
                                isTopSelected
                                  ? 'bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-500 text-stone-950 border-amber-200 ring-4 ring-amber-300/80 scale-102 font-black shadow-[0_0_20px_rgba(245,158,11,0.6)]'
                                  : 'bg-slate-900/90 hover:bg-slate-800 text-white border-white/20 hover:border-amber-400/60'
                              }`}
                            >
                              {isTopRecommended && (
                                <span className={`absolute -top-2 px-1.5 py-0.2 rounded-full text-[8px] sm:text-[9px] font-black flex items-center gap-0.5 shadow ${
                                  isTopSelected
                                    ? 'bg-stone-950 text-amber-300 border border-amber-400'
                                    : 'bg-amber-500 text-stone-950 border border-amber-300 animate-pulse'
                                }`}>
                                  <Star className="w-2 h-2 fill-current" />
                                  <span>推薦</span>
                                </span>
                              )}

                              <span className="text-sm sm:text-base md:text-lg font-black font-heading tracking-wide">
                                {col.top.label}
                              </span>
                              <span className={`text-[9px] sm:text-[10px] font-bold mt-0.5 truncate max-w-full ${
                                isTopSelected ? 'text-stone-950/80' : 'text-slate-300'
                              }`}>
                                {col.top.desc}
                              </span>

                              {isTopSelected && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-stone-950 absolute top-1 right-1 stroke-[2.5]" />
                              )}
                            </button>

                            {/* 下排按鈕 (二年級、三下、四下、五下、六下) */}
                            <button
                              type="button"
                              onClick={() => handleSelectBookOption(col.bottom.id)}
                              className={`p-2 sm:p-2.5 rounded-2xl border-2 transition-all duration-150 cursor-pointer flex flex-col items-center justify-center relative active:scale-95 shadow-md ${
                                isBottomSelected
                                  ? 'bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-500 text-stone-950 border-amber-200 ring-4 ring-amber-300/80 scale-102 font-black shadow-[0_0_20px_rgba(245,158,11,0.6)]'
                                  : 'bg-slate-900/90 hover:bg-slate-800 text-white border-white/20 hover:border-amber-400/60'
                              }`}
                            >
                              {isBottomRecommended && (
                                <span className={`absolute -top-2 px-1.5 py-0.2 rounded-full text-[8px] sm:text-[9px] font-black flex items-center gap-0.5 shadow ${
                                  isBottomSelected
                                    ? 'bg-stone-950 text-amber-300 border border-amber-400'
                                    : 'bg-amber-500 text-stone-950 border border-amber-300 animate-pulse'
                                }`}>
                                  <Star className="w-2 h-2 fill-current" />
                                  <span>推薦</span>
                                </span>
                              )}

                              <span className="text-sm sm:text-base md:text-lg font-black font-heading tracking-wide">
                                {col.bottom.label}
                              </span>
                              <span className={`text-[9px] sm:text-[10px] font-bold mt-0.5 truncate max-w-full ${
                                isBottomSelected ? 'text-stone-950/80' : 'text-slate-300'
                              }`}>
                                {col.bottom.desc}
                              </span>

                              {isBottomSelected && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-stone-950 absolute top-1 right-1 stroke-[2.5]" />
                              )}
                            </button>

                          </div>
                        );
                      })}
                    </div>

                    {/* ── 【單元別偏下】預留專屬固定高度彈出區 (徹底解決任何跳動) ── */}
                    <div className="w-full min-h-[68px] sm:min-h-[76px] flex items-center justify-center p-2 rounded-2xl bg-slate-900/90 border border-white/20 backdrop-blur-md shrink-0 mt-2">
                      
                      {/* 若選【一年級 / 二年級】：彈出大寫、小寫、混合三大模式 */}
                      {currentOptionData.isAlpha ? (
                        <div className="w-full flex items-center justify-between gap-2 animate-fadeIn">
                          <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5 shrink-0">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                            <span>字母規格：</span>
                          </span>

                          <div className="grid grid-cols-3 gap-2 flex-1 max-w-md">
                            {[
                              { id: 'upper', label: '🔠 大寫 A-Z' },
                              { id: 'lower', label: '🔡 小寫 a-z' },
                              { id: 'mixed', label: '🔤 混合 Aa-Zz' }
                            ].map((m) => {
                              const isModeActive = alphaMode === m.id;
                              return (
                                <button
                                  key={m.id}
                                  type="button"
                                  onClick={() => handleSelectAlphaMode(m.id)}
                                  className={`py-1.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                                    isModeActive
                                      ? 'bg-emerald-400 text-stone-950 border-emerald-200 ring-2 ring-emerald-300/80 shadow'
                                      : 'bg-slate-800 text-slate-100 hover:text-white border-white/20'
                                  }`}
                                >
                                  {m.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : isWholeBookOnlyGame ? (
                        /* 若為鷹眼神探等全冊專屬遊戲：直接提示已鎖定全景 */
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-amber-300 animate-fadeIn">
                          <Eye className="w-4 h-4 text-amber-400 animate-pulse" />
                          <span>✨ 鷹眼神探採全冊 3D 紙雕全景尋寶 • 點擊右下角立即出征！</span>
                        </div>
                      ) : (
                        /* 若為三到六年級：彈出通用單元順序 starter unit1 unit2 unit3 unit4 festival (由左至右順序固定) */
                        <div className="w-full flex items-center justify-between gap-1.5 sm:gap-2 overflow-x-auto py-1 animate-fadeIn">
                          {UNIVERSAL_UNITS.map((u) => {
                            const isUnitActive = selectedUnitFilter === u.id;
                            return (
                              <button
                                key={u.id}
                                type="button"
                                onClick={() => handleSelectUnit(u.id)}
                                className={`py-1.5 px-2.5 sm:px-3 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer border ${
                                  isUnitActive
                                    ? 'bg-amber-400 text-stone-950 border-amber-200 ring-2 ring-amber-300/80 font-black shadow'
                                    : 'bg-slate-800 text-slate-200 hover:text-white border-white/20 hover:border-amber-400/50'
                                }`}
                              >
                                {u.label}
                              </button>
                            );
                          })}
                        </div>
                      )}

                    </div>

                  </div>

                </div>

                {/* 整備室底部：狀態摘要與出征按鈕 */}
                <div className="pt-2 border-t border-white/15 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2 text-xs text-slate-200 font-bold">
                    <span>已就緒：</span>
                    <span className="text-amber-300 font-black">
                      {currentOptionData.label} ({currentOptionData.isAlpha ? '26 字母全套' : selectedUnitFilter === 'all' ? `${selectedWordsCount} 字全冊` : `${selectedUnitFilter.toUpperCase()}`})
                    </span>
                    <span className="text-emerald-400 font-black hidden sm:inline ml-1">
                      • 榮譽榜資格已鎖定
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartGame}
                    className="px-7 sm:px-9 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-stone-950 font-heading font-black text-sm sm:text-base flex items-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.6)] active:scale-95 transition-all cursor-pointer border-2 border-amber-200 animate-pulse"
                  >
                    <span>⚔️ 開始遊戲 START</span>
                    <Play className="w-4 h-4 fill-stone-950" />
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* ════════════════════════════════════════════════════════════════
          【固定底部簡易提示列】僅在首頁狀態下輔助說明
         ════════════════════════════════════════════════════════════════ */}
      {step === 'game' && (
        <footer className="relative z-30 w-full px-4 py-2 bg-slate-950/85 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-xs text-slate-300 font-bold shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>五大主題 • 點選任一遊戲立即展開整備出征室</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-amber-300 font-mono">
            WUTAI ENGLISH ADVENTURE HALL
          </div>
        </footer>
      )}

    </div>
  );
};
