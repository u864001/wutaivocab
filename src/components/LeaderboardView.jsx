import React, { useState, useEffect, useMemo } from 'react';
import { GlassCard } from './ui/GlassCard';
import { Button3D } from './ui/Button3D';
import { useI18n } from '../context/I18nContext';
import { useStudent } from '../context/StudentContext';
import { useTheme } from '../context/ThemeContext';
import {
  fetchLeaderboard,
  fetchMonopolyLeaderboard,
  fetchQuestPointsLeaderboard,
  getWeekNumber
} from '../services/supabase';
import { getCurrentSemesterId, getSemesterDisplayName } from '../utils/semesterHelper';
import { soundEngine } from '../services/audio';
import { useEasterEgg } from '../hooks/useEasterEgg';
import { pad2, formatStudentBadge } from '../utils/studentIdHelper';
import {
  Trophy, ArrowLeft, RotateCw, Medal, Calendar,
  BookOpen, Puzzle, Rocket, Sparkles, Keyboard,
  Swords, X, ChevronRight, Compass, Flame, Coins, Award,
  Users, Crown, Zap, School, KeyRound, Eye, Headphones, Mic, Volume2, VolumeX, Globe,
  Sun, Moon, User
} from 'lucide-react';

export const GRADE_LEADERBOARD_TABS = [
  { id: '01', zh: '一年級', en: 'Grade 1', books: ['abc', '1'], isAlphabet: true },
  { id: '02', zh: '二年級', en: 'Grade 2', books: ['abc', '2'], isAlphabet: true },
  { id: '03', zh: '三年級', en: 'Grade 3', books: ['1', '2'] },
  { id: '04', zh: '四年級', en: 'Grade 4', books: ['3', '4'] },
  { id: '05', zh: '五年級', en: 'Grade 5', books: ['5', '6'] },
  { id: '06', zh: '六年級', en: 'Grade 6', books: ['7', '8'] },
  { id: 'all', zh: '全校大亂鬥', en: 'All School', books: null, isAllSchool: true }
];

const THEME_WALLPAPERS = {
  all: '/assets/lobby/theme_explore.jpg',
  explore: '/assets/lobby/theme_explore.jpg',
  speed: '/assets/lobby/theme_speed.jpg',
  quiz: '/assets/lobby/theme_quiz.jpg',
  battle: '/assets/lobby/theme_battle.jpg',
  langlab: '/assets/lobby/theme_town.jpg'
};

export const DOMAIN_CATEGORIES = [
  { id: 'all', zh: '全部項目', en: 'All' },
  { id: 'explore', zh: '探索解謎', en: 'Explore' },
  { id: 'speed', zh: '極速反應', en: 'Speed' },
  { id: 'quiz', zh: '經典測驗', en: 'Quiz' },
  { id: 'battle', zh: '多人對戰', en: 'Battle' },
  { id: 'langlab', zh: '雙語聽說', en: 'Language Lab' }
];

export const CONSOLIDATED_GAME_MODES = [
  // ── 探索解謎 (Explore) ──
  {
    id: 'escape',
    label: '密室逃脫',
    icon: KeyRound,
    color: 'text-amber-400',
    unit: '秒',
    category: 'explore',
    modeKeys: ['escape'],
    subModes: [{ key: 'escape', label: '三連環脫逃' }]
  },
  {
    id: 'spotter',
    label: '神探找不同',
    icon: Eye,
    color: 'text-amber-400',
    unit: '秒',
    category: 'explore',
    modeKeys: ['spotter'],
    subModes: [{ key: 'spotter', label: '鷹眼搜查' }]
  },
  {
    id: 'maze',
    label: '字母迷宮',
    icon: Compass,
    color: 'text-teal-400',
    unit: '秒',
    category: 'explore',
    modeKeys: ['maze-upper', 'maze-lower', 'maze-master'],
    subModes: [
      { key: 'maze-upper', label: '大寫巡航' },
      { key: 'maze-lower', label: '小寫巡航' }
    ]
  },
  {
    id: 'memory',
    label: '記憶翻牌',
    icon: Trophy,
    color: 'text-cyan-400',
    unit: '分',
    category: 'explore',
    modeKeys: ['memory-single'],
    subModes: [{ key: 'memory-single', label: '標準翻牌' }]
  },

  // ── 極速反應 (Speed) ──
  {
    id: 'mole',
    label: '單字打地鼠',
    icon: Zap,
    color: 'text-amber-400',
    unit: '分',
    category: 'speed',
    modeKeys: ['mole-vocab', 'mole-abc'],
    subModes: [
      { key: 'mole-vocab', label: '單字地穴' },
      { key: 'mole-abc', label: '字母地穴' }
    ]
  },
  {
    id: 'swipe',
    label: '是非滑牌',
    icon: Flame,
    color: 'text-rose-400',
    unit: '分',
    category: 'speed',
    modeKeys: ['swipe-vocab', 'swipe-abc'],
    subModes: [
      { key: 'swipe-vocab', label: '30秒單字' },
      { key: 'swipe-abc', label: '30秒字母' }
    ]
  },
  {
    id: 'meteor',
    label: '隕石防衛',
    icon: Rocket,
    color: 'text-amber-400',
    unit: '分',
    category: 'speed',
    modeKeys: ['meteor-zh-en', 'meteor-en-zh', 'meteor-abc'],
    subModes: [
      { key: 'meteor-zh-en', label: '中選英' },
      { key: 'meteor-en-zh', label: '英選中' },
      { key: 'meteor-abc', label: 'ABC 防衛' }
    ]
  },
  {
    id: 'snake',
    label: '百步貪蛇',
    icon: Zap,
    color: 'text-emerald-400',
    unit: '分',
    category: 'speed',
    modeKeys: ['snake-normal', 'snake-survival', 'snake-easy'],
    subModes: [
      { key: 'snake-normal', label: '競速挑戰' },
      { key: 'snake-survival', label: '生存挑戰' }
    ]
  },
  {
    id: 'spelling',
    label: '拖曳拼字',
    icon: Puzzle,
    color: 'text-yellow-400',
    unit: '分',
    category: 'speed',
    modeKeys: ['spelling'],
    subModes: [{ key: 'spelling', label: '標準拼字' }]
  },

  // ── 經典測驗 (Quiz) ──
  {
    id: 'quiz',
    label: '四大經典測驗',
    icon: Keyboard,
    color: 'text-sky-400',
    unit: '分',
    category: 'quiz',
    modeKeys: ['quiz-zh-en', 'quiz-en-zh', 'quiz-listening', 'quiz-hard'],
    subModes: [
      { key: 'quiz-zh-en', label: '中選英' },
      { key: 'quiz-en-zh', label: '英選中' },
      { key: 'quiz-listening', label: '英語聽力' },
      { key: 'quiz-hard', label: '魔王綜合' }
    ]
  },

  // ── 多人對戰 (Battle) ──
  {
    id: 'battle',
    label: '多人連線',
    icon: Swords,
    color: 'text-purple-400',
    unit: '勝',
    category: 'battle',
    modeKeys: ['battle-wins'],
    subModes: [{ key: 'battle-wins', label: '勝場累積' }]
  },
  {
    id: 'monopoly',
    label: '大富翁財富',
    icon: Coins,
    color: 'text-amber-400',
    unit: '金幣',
    category: 'battle',
    isSpecial: 'monopoly',
    modeKeys: ['monopoly'],
    subModes: [{ key: 'monopoly', label: '金幣總資產' }]
  },

  // ── 雙語聽說 (Language Lab) ──
  {
    id: 'listening_lab',
    label: '聽力特訓',
    icon: Headphones,
    color: 'text-sky-400',
    unit: '題',
    category: 'langlab',
    modeKeys: ['listening_lab'],
    subModes: [{ key: 'listening_lab', label: '聽力特訓' }]
  },
  {
    id: 'speaking_lab',
    label: '口說跟讀',
    icon: Mic,
    color: 'text-rose-400',
    unit: '題',
    category: 'langlab',
    modeKeys: ['speaking_lab'],
    subModes: [{ key: 'speaking_lab', label: '口說跟讀' }]
  }
];

export const LeaderboardView = ({ onBack, onOpenTeacherHub, words = [] }) => {
  const { t, lang, toggleLang } = useI18n();
  const { currentStudent, isLoggedIn, openModal } = useStudent();
  const { isDark, toggleTheme, isAuto } = useTheme();
  const [isMuted, setIsMuted] = useState(soundEngine.isMuted);
  const currentWeek = getWeekNumber();

  // 智慧預設目標年級：若已登入學生則自動錨定其所屬年級 (1~6)，否則預設 4 年級
  const [selectedGrade, setSelectedGrade] = useState(() => {
    if (currentStudent?.grade) {
      const g = pad2(currentStudent.grade);
      if (['01', '02', '03', '04', '05', '06'].includes(g)) return g;
    }
    return '04';
  });

  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [selectedDomain, setSelectedDomain] = useState('all'); // 'all' | 'langlab' | 'arcade' | 'campus'
  const [boardData, setBoardData] = useState({}); // { [modeId]: items[] }
  const [isLoading, setIsLoading] = useState(false);
  const [modalModeId, setModalModeId] = useState(null); // 當前展開 Top 50 的遊戲模式 ID

  // 隱藏管理後台彩蛋
  const handleTitleClick = useEasterEgg(onOpenTeacherHub, 5, 2000);

  // 當前年級設定
  const activeGradeObj = useMemo(() => {
    return GRADE_LEADERBOARD_TABS.find(tab => tab.id === selectedGrade) || GRADE_LEADERBOARD_TABS[3];
  }, [selectedGrade]);

  // 載入所有遊戲模式之榜單 (含快取護航)
  const loadGradeBoards = async (force = false) => {
    setIsLoading(true);
    const results = { ...boardData };
    const isPastWeek = selectedWeek < currentWeek;
    const cacheTtl = isPastWeek ? 7 * 24 * 60 * 60 * 1000 : 45 * 1000;
    const now = Date.now();

    const isAll = activeGradeObj.isAllSchool || selectedGrade === 'all' || selectedGrade === '00';
    const isAlphabetGrade = Boolean(activeGradeObj.isAlphabet);
    const books = isAll ? null : activeGradeObj.books;

    await Promise.all(
      CONSOLIDATED_GAME_MODES.map(async (m) => {
        const CACHE_KEY = `lb_g4_${selectedWeek}_${selectedGrade}_${m.id}`;

        if (!force) {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            try {
              const { data, time } = JSON.parse(cached);
              if (now - time < cacheTtl) {
                results[m.id] = data;
                return;
              }
            } catch (e) {}
          }
        }

        let fetchedList = [];
        try {
          if (m.isSpecial === 'monopoly') {
            fetchedList = await fetchMonopolyLeaderboard(isAll ? null : selectedGrade, 50);
          } else if (m.isSpecial === 'quest') {
            fetchedList = await fetchQuestPointsLeaderboard(isAll ? null : selectedGrade, 50);
          } else {
            // 一、二年級字母模式：若為字母遊戲模式或聽說測驗，不限冊別（包含 abc 與基礎冊別）；若為全校大亂鬥則不限冊別
            const queryBooks = isAll
              ? null
              : (isAlphabetGrade && (m.id === 'maze' || m.id === 'swipe' || m.id === 'meteor' || m.id === 'memory' || m.id === 'listening_lab' || m.id === 'speaking_lab'))
              ? null
              : books;
            fetchedList = await fetchLeaderboard(selectedWeek, m.modeKeys, queryBooks, 50);
            if (isPastWeek && Array.isArray(fetchedList)) {
              fetchedList = fetchedList.filter(row => {
                const sId = String(row.student_id || '');
                const name = String(row.name || '');
                return sId !== '999999' && !sId.startsWith('99') && !name.includes('訪客') && !name.includes('Guest');
              });
            }
          }
        } catch (err) {
          console.warn(`讀取模式 ${m.id} 排行失敗:`, err);
          fetchedList = [];
        }

        results[m.id] = fetchedList;
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data: fetchedList, time: now }));
        } catch (e) {}
      })
    );

    setBoardData(results);
    setIsLoading(false);
  };

  useEffect(() => {
    loadGradeBoards();
  }, [selectedGrade, selectedWeek]);

  // 彈窗詳細資料
  const activeModalMode = useMemo(() => {
    if (!modalModeId) return null;
    return CONSOLIDATED_GAME_MODES.find(m => m.id === modalModeId);
  }, [modalModeId]);

  const activeModalRanks = useMemo(() => {
    let list = modalModeId ? (boardData[modalModeId] || []) : [];
    if (isPastWeek && Array.isArray(list)) {
      list = list.filter(row => {
        const sId = String(row.student_id || '');
        const name = String(row.name || '');
        return sId !== '999999' && !sId.startsWith('99') && !name.includes('訪客') && !name.includes('Guest');
      });
    }
    return list;
  }, [modalModeId, boardData, isPastWeek]);

  // 輔助函式：取得子模式或冊別標籤
  const getSubModeBadge = (row, modeObj) => {
    if (!row) return null;
    if (modeObj.isSpecial === 'monopoly') {
      return formatStudentBadge({ grade: row.grade, class: row.class, seat: row.seat }, lang);
    }
    if (modeObj.isSpecial === 'quest') {
      return formatStudentBadge({ grade: row.grade, class: row.class, seat: row.seat }, lang);
    }

    if (modeObj.id === 'spotter') {
      const bookLabel = row.book ? `B${row.book}` : '';
      const heartsLabel = row.score ? `❤️x${row.score}` : '';
      return [bookLabel, heartsLabel].filter(Boolean).join(' • ');
    }

    if (modeObj.id === 'listening_lab' || modeObj.id === 'speaking_lab') {
      const bookLabel = row.book === 'abc' ? 'ABC字母' : (row.book ? `B${row.book}` : '');
      const sm = modeObj.subModes?.find(s => s.key === row.mode);
      const modeLabel = sm?.label || (modeObj.id === 'listening_lab' ? '聽力特訓' : '口說跟讀');
      return [bookLabel, modeLabel].filter(Boolean).join(' • ');
    }

    const sm = modeObj.subModes?.find(s => s.key === row.mode);
    const modeLabel = sm?.label || row.mode;
    const bookLabel = row.book ? `B${row.book}` : '';
    return [bookLabel, modeLabel].filter(Boolean).join(' • ');
  };

  const currentWallpaper = THEME_WALLPAPERS[selectedDomain] || THEME_WALLPAPERS.all;

  return (
    <div className={`relative min-h-screen w-full select-none animate-fadeIn pb-16 transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-800'}`}>
      {/* ── 專屬主題海報全景背景層 (依點選分類平滑切換，清晰震撼) ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0">
        <img
          key={currentWallpaper}
          src={currentWallpaper}
          alt="Theme Wallpaper"
          className={`w-full h-full object-cover object-center scale-100 transition-all duration-700 ease-out animate-fadeIn ${
            isDark ? 'brightness-[0.70] contrast-[1.1]' : 'brightness-[0.85] contrast-[1.05]'
          }`}
        />
        {/* 柔和暗度漸層：上方柔和暗化保護導覽列，中央透光顯現原畫，下方沉穩 */}
        <div className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${
          isDark
            ? 'bg-gradient-to-b from-slate-950/85 via-slate-950/40 to-slate-950/90'
            : 'bg-gradient-to-b from-white/90 via-slate-50/75 to-white/95 backdrop-blur-[1px]'
        }`} />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* ── 頂部導覽列 ── */}
        <div className="flex items-center justify-between mb-4">
          <Button3D variant={isDark ? "slate" : "secondary"} size="sm" onClick={onBack} icon={ArrowLeft}>
            <span className="hidden sm:inline">{t.backLobby || '回大廳'}
          </span>
          </Button3D>

          <h2
            onClick={handleTitleClick}
            className={`hidden md:flex text-2xl sm:text-3xl font-black font-heading items-center gap-2 cursor-pointer select-none active:scale-95 transition-transform ${
              isDark ? 'text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]' : 'text-slate-800 drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]'
            }`}
            title="連續點擊 5 次啟動管理後台"
          >
            <Trophy className="w-8 h-8 text-amber-500 dark:text-amber-400 animate-bounce" />
            {t.heroHallTitle || '全校英雄榮譽榜'}
          </h2>

          {/* 右上角控制群組：業界標準統一排序（重新整理 ➔ 聲音 ➔ 雙語 ➔ 日夜主題 ➔ 學生通行證錨點） */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* 1. 重新整理 */}
            <button
              onClick={() => loadGradeBoards(true)}
              disabled={isLoading}
              className={`p-2 sm:p-2.5 rounded-2xl border transition-all cursor-pointer shadow-md active:scale-95 ${
                isDark
                  ? 'bg-black/60 border-white/20 text-slate-300 hover:text-white'
                  : 'bg-white/90 border-slate-300 text-slate-600 hover:text-slate-900 shadow-sm'
              }`}
              title={t.refresh || '重新整理'}
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            {/* 2. 靜音/音效切換 */}
            <button
              onClick={() => {
                const m = soundEngine.toggleMute();
                setIsMuted(m);
              }}
              className={`p-2 sm:p-2.5 rounded-2xl border transition-all cursor-pointer shadow-md active:scale-95 ${
                isDark
                  ? 'bg-black/60 border-white/20 text-slate-300 hover:text-white'
                  : 'bg-white/90 border-slate-300 text-slate-600 hover:text-slate-900 shadow-sm'
              }`}
              title={isMuted ? '開啟音效' : '靜音'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
            </button>

            {/* 3. 雙語切換 */}
            <button
              onClick={() => {
                soundEngine.click();
                if (toggleLang) toggleLang();
              }}
              className={`p-2 sm:px-3 sm:py-2 rounded-2xl border transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-1 ${
                isDark
                  ? 'bg-black/60 border-white/20 text-blue-400 hover:text-white'
                  : 'bg-white/90 border-slate-300 text-blue-600 hover:text-blue-700 shadow-sm'
              }`}
              title={lang === 'zh-TW' ? 'Switch to English' : '切換為繁體中文'}
            >
              <Globe className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-black hidden sm:inline">{lang === 'zh-TW' ? 'EN' : '中文'}</span>
            </button>

            {/* 4. 日夜模式切換 */}
            <button
              onClick={() => {
                soundEngine.click();
                toggleTheme();
              }}
              className={`p-2 sm:p-2.5 rounded-2xl border transition-all cursor-pointer shadow-md active:scale-95 relative ${
                isDark
                  ? 'bg-black/60 border-white/20 text-cyan-300 hover:text-white'
                  : 'bg-white/90 border-slate-300 text-amber-500 hover:text-amber-600 shadow-sm'
              }`}
              title={
                isAuto
                  ? (isDark ? '星月夜間模式 (依時鐘自動，點擊切換為手動白天)' : '晨曦日間模式 (依時鐘自動，點擊切換為手動夜間)')
                  : (isDark ? '當前為手動夜間 (點擊回歸時鐘自動)' : '當前為手動白天 (點擊切換為手動夜間)')
              }
            >
              {isDark ? <Moon className="w-4 h-4 text-cyan-300" /> : <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />}
              {isAuto && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-white dark:ring-slate-900" title="隨時鐘自動切換" />
              )}
            </button>

            {/* 5. 學生探險通行證 / 登入 (個人身分錨定於最右側) */}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  soundEngine.click();
                  if (openModal) openModal();
                }}
                title={t.currentIdentity || '個人探險通行證'}
                className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 border border-emerald-400/50 text-slate-800 dark:text-slate-100 flex items-center gap-1.5 text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
              >
                {currentStudent?.avatar_id ? (
                  <img
                    src={`/assets/avatars/${currentStudent.avatar_id}.webp`}
                    alt="Warrior Avatar"
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-amber-400 shadow-sm shrink-0"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <User className="w-3.5 h-3.5 text-emerald-500" />
                )}
                <span className="font-heading truncate max-w-[100px] hidden sm:inline">
                  {formatStudentBadge(currentStudent, lang)}
                </span>
                <span className="flex items-center gap-0.5 text-amber-500 dark:text-amber-400 font-mono font-black text-xs">
                  <Coins className="w-3 h-3" />
                  {currentStudent?.coins ?? 0}
                </span>
              </button>
            ) : (
              <button
                onClick={() => {
                  soundEngine.click();
                  if (openModal) openModal();
                }}
                title={t.loginToRoam || '登入座號漫遊'}
                className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white flex items-center gap-1.5 text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.loginToRoam || '登入座號'}</span>
              </button>
            )}
          </div>
        </div>

        {/* ── 年級分流分頁導覽列 (一到六年級 + 全校大亂鬥 共 7 大類別) ── */}
        <div className="mb-4">
          <div className={`flex items-center gap-1.5 p-1.5 rounded-2xl border backdrop-blur-md overflow-x-auto scrollbar-none shadow-2xl transition-colors ${
            isDark ? 'bg-slate-950/75 border-white/20' : 'bg-white/90 border-slate-200/90 shadow-md'
          }`}>
            {GRADE_LEADERBOARD_TABS.map((tab) => {
              const isSelected = selectedGrade === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundEngine.click();
                    setSelectedGrade(tab.id);
                  }}
                  className={`flex-1 min-w-[95px] py-2 px-2 rounded-xl text-xs sm:text-sm font-black transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg border border-emerald-300 ring-2 ring-emerald-400/40 scale-102'
                      : isDark
                      ? 'text-slate-300 hover:text-white hover:bg-white/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{lang === 'zh-TW' ? tab.zh : tab.en}</span>
                  {tab.isAlphabet ? (
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-amber-200' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      字母樂園 🔤
                    </span>
                  ) : tab.isAllSchool ? (
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-amber-200' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      綜合大亂鬥 ⚔️
                    </span>
                  ) : (
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-200' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      第 {tab.books?.join('、')} 冊
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 篩選控制器便當卡 (當前年級資訊、學期身分 ＆ 競賽週次切換) ── */}
        <div className={`mb-5 p-3.5 sm:p-4 rounded-3xl border backdrop-blur-md shadow-2xl transition-colors ${
          isDark ? 'bg-slate-950/75 border-white/20 text-white' : 'bg-white/90 border-slate-200/90 text-slate-800 shadow-md'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${
                isDark ? 'bg-white/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              }`}>
                {activeGradeObj.isAllSchool ? <Swords className="w-5 h-5 text-amber-500 dark:text-amber-400" /> : <Users className="w-5 h-5" />}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {lang === 'zh-TW' ? activeGradeObj.zh : activeGradeObj.en} 榮譽競賽榜
                </span>
                {selectedGrade === currentStudent?.grade && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                    我的年級 🎯
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-black flex items-center gap-1 ${
                  isDark ? 'bg-indigo-500/30 border-indigo-400/40 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                }`}>
                  <School className="w-3 h-3" />
                  {getSemesterDisplayName()}
                </span>
              </div>
            </div>

            {/* 週次切換 */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {t.compWeekLabel || '競賽週次：'}
              </span>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(parseInt(e.target.value, 10))}
                className={`p-1.5 sm:p-2 rounded-xl border font-black text-xs sm:text-sm outline-none transition-colors ${
                  isDark
                    ? 'bg-slate-900 border-white/20 text-white focus:border-emerald-400'
                    : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-emerald-500'
                }`}
              >
                {[...Array(6)].map((_, i) => {
                  const w = currentWeek - i;
                  if (w < 1) return null;
                  return (
                    <option key={w} value={w} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}>
                      {(t.weekN ? t.weekN.replace('{w}', w) : `第 ${w} 週`)} {w === currentWeek ? (t.currentWeekTag || '(本週)') : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        {/* ── 五大領域館別切換膠囊導覽列 ── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {DOMAIN_CATEGORIES.map((cat) => {
              const isSelected = selectedDomain === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundEngine.click();
                    setSelectedDomain(cat.id);
                  }}
                  className={`px-3.5 sm:px-5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-lg border ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-300 ring-2 ring-emerald-400/40 scale-105 shadow-emerald-500/30'
                      : isDark
                      ? 'bg-slate-950/75 text-slate-300 border-white/20 hover:text-white hover:bg-slate-900'
                      : 'bg-white/85 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100 shadow-xs'
                  }`}
                >
                  <span>{lang === 'zh-TW' ? cat.zh : cat.en}</span>
                  {cat.id === 'langlab' && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-stone-950 text-[10px] font-black animate-pulse">
                      聽說
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 榜單內容展示區 ── */}
        {(() => {
          // 渲染個別模式的風雲小卡 (Top 5 預覽 ＋ 點擊查看 Top 50)
          const renderModeCard = (mode, isWide = false) => {
            const Icon = mode.icon;
            const ranks = (boardData[mode.id] || []).slice(0, 5);

            return (
              <div
                key={mode.id}
                className={`flex flex-col justify-between p-4 sm:p-5 rounded-3xl relative overflow-hidden group transition-all duration-300 shadow-2xl backdrop-blur-md ${
                  isDark
                    ? mode.category === 'explore'
                      ? 'bg-slate-950/75 border border-emerald-500/40 hover:border-emerald-400 hover:shadow-emerald-500/20'
                      : mode.category === 'speed'
                      ? 'bg-slate-950/75 border border-amber-500/40 hover:border-amber-400 hover:shadow-amber-500/20'
                      : mode.category === 'quiz'
                      ? 'bg-slate-950/75 border border-sky-500/40 hover:border-sky-400 hover:shadow-sky-500/20'
                      : mode.category === 'battle'
                      ? 'bg-slate-950/75 border border-purple-500/40 hover:border-purple-400 hover:shadow-purple-500/20'
                      : 'bg-slate-950/75 border border-rose-500/40 hover:border-rose-400 hover:shadow-rose-500/20'
                    : mode.category === 'explore'
                      ? 'bg-white/90 border border-emerald-400/60 hover:border-emerald-500 hover:shadow-emerald-500/15 text-slate-800 shadow-lg'
                      : mode.category === 'speed'
                      ? 'bg-white/90 border border-amber-400/60 hover:border-amber-500 hover:shadow-amber-500/15 text-slate-800 shadow-lg'
                      : mode.category === 'quiz'
                      ? 'bg-white/90 border border-sky-400/60 hover:border-sky-500 hover:shadow-sky-500/15 text-slate-800 shadow-lg'
                      : mode.category === 'battle'
                      ? 'bg-white/90 border border-purple-400/60 hover:border-purple-500 hover:shadow-purple-500/15 text-slate-800 shadow-lg'
                      : 'bg-white/90 border border-rose-400/60 hover:border-rose-500 hover:shadow-rose-500/15 text-slate-800 shadow-lg'
                } ${isWide ? 'border-2 ring-1 ring-sky-400/40' : ''}`}
              >
                <div>
                  {/* 卡片標題與圖標 */}
                  <div className={`flex items-center justify-between mb-3 pb-2.5 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${mode.color} ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className={`font-heading font-black text-sm sm:text-base flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          <span>{mode.label}</span>
                          {mode.category === 'langlab' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-black">
                              15題特訓
                            </span>
                          )}
                        </h3>
                      </div>
                    </div>

                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md font-mono ${isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                      {mode.unit}
                    </span>
                  </div>

                  {/* 前 5 名清單 */}
                  <div className="space-y-1.5 mb-3 min-h-[160px]">
                    {isLoading && !boardData[mode.id] ? (
                      <div className="h-full flex items-center justify-center text-xs font-bold text-slate-400 py-10">
                        <RotateCw className="w-4 h-4 animate-spin mr-1.5 text-emerald-400" />
                        載入中...
                      </div>
                    ) : ranks.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-xs font-bold text-slate-400 py-10 gap-1">
                        <Sparkles className="w-5 h-5 text-slate-500" />
                        <span>{t.noContenders || '尚無挑戰者'}</span>
                      </div>
                    ) : (
                      ranks.map((entry, idx) => {
                        const isFirst = idx === 0;
                        const isSecond = idx === 1;
                        const isThird = idx === 2;

                        const isEntryGuest = String(entry.student_id || '') === '999999' || String(entry.name || '').includes('訪客') || String(entry.name || '').includes('Guest');
                        const studentName = isEntryGuest
                          ? `[訪客] ${(entry.nickname || entry.name || '探險者').replace(/^\[訪客\]\s*/, '')}`
                          : (entry.nickname || entry.name || '同學');
                        const scoreValue = mode.isSpecial === 'monopoly'
                          ? (entry.coins ?? 0)
                          : mode.isSpecial === 'quest'
                          ? (entry.quest_points ?? 0)
                          : (mode.id === 'escape' || mode.id === 'spotter')
                          ? (entry.time > 1000 ? (entry.time / 1000).toFixed(1) : (entry.time ?? entry.score))
                          : entry.score;

                        const badgeText = getSubModeBadge(entry, mode);

                        return (
                          <div
                            key={entry.id || entry.student_id || idx}
                            className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                              isFirst
                                ? 'bg-amber-400/20 border border-amber-300/80 font-black text-amber-500 dark:text-amber-200'
                                : isSecond
                                ? isDark ? 'bg-white/10 border border-white/10 font-bold text-slate-100' : 'bg-slate-100 border border-slate-200 font-bold text-slate-800'
                                : isThird
                                ? 'bg-amber-700/20 border border-amber-700/40 font-bold text-amber-700 dark:text-amber-300'
                                : isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate pr-2">
                              <span className="w-5 text-center font-black shrink-0 font-mono">
                                {isFirst ? '🥇' : isSecond ? '🥈' : isThird ? '🥉' : `${idx + 1}.`}
                              </span>
                              <span className="truncate max-w-[90px] font-bold">
                                {studentName}
                              </span>
                              {badgeText && (
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                                  isDark ? 'bg-white/15 text-slate-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}>
                                  {badgeText}
                                </span>
                              )}
                            </div>

                            <div className={`font-mono font-black shrink-0 text-right ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                              {scoreValue}
                              <span className={`text-[10px] font-normal ml-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {mode.unit}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* 展開完整 Top 50 3D 按鈕 */}
                <button
                  onClick={() => {
                    soundEngine.click();
                    setModalModeId(mode.id);
                  }}
                  className={`w-full py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm border ${
                    isDark ? 'bg-white/10 hover:bg-white/20 text-white border-white/20' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/90'
                  }`}
                >
                  <span>{t.viewTop50Btn || '查看完整前 50 名'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          };

        if (selectedDomain === 'langlab') {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-fadeIn">
              {CONSOLIDATED_GAME_MODES.filter(m => m.category === 'langlab').map(m => renderModeCard(m, true))}
            </div>
          );
        }

        if (selectedDomain !== 'all') {
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 animate-fadeIn">
              {CONSOLIDATED_GAME_MODES.filter(m => m.category === selectedDomain).map(m => renderModeCard(m))}
            </div>
          );
        }

        // 預設全部項目：依五大主題分類整齊呈現
        return (
          <div className="space-y-8 animate-fadeIn">
            {/* 1. 探索解謎 */}
            <div>
              <div className="flex items-center justify-between mb-3 pb-1.5 border-b border-emerald-500/30">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🧭</span>
                  <h4 className="font-heading font-black text-sm sm:text-base text-slate-800 dark:text-emerald-300">
                    探索解謎 (Explore)
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                    4 大關卡
                  </span>
                </div>
                <button
                  onClick={() => {
                    soundEngine.click();
                    setSelectedDomain('explore');
                  }}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>聚焦此主題 ➔</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {CONSOLIDATED_GAME_MODES.filter(m => m.category === 'explore').map(m => renderModeCard(m))}
              </div>
            </div>

            {/* 2. 極速反應 */}
            <div>
              <div className="flex items-center justify-between mb-3 pb-1.5 border-b border-amber-500/30">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚡</span>
                  <h4 className="font-heading font-black text-sm sm:text-base text-slate-800 dark:text-amber-300">
                    極速反應 (Speed)
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">
                    5 大關卡
                  </span>
                </div>
                <button
                  onClick={() => {
                    soundEngine.click();
                    setSelectedDomain('speed');
                  }}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>聚焦此主題 ➔</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {CONSOLIDATED_GAME_MODES.filter(m => m.category === 'speed').map(m => renderModeCard(m))}
              </div>
            </div>

            {/* 3. 經典測驗 */}
            <div>
              <div className="flex items-center justify-between mb-3 pb-1.5 border-b border-sky-500/30">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📖</span>
                  <h4 className="font-heading font-black text-sm sm:text-base text-slate-800 dark:text-sky-300">
                    經典測驗 (Quiz)
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-bold">
                    4 大題型
                  </span>
                </div>
                <button
                  onClick={() => {
                    soundEngine.click();
                    setSelectedDomain('quiz');
                  }}
                  className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>聚焦此主題 ➔</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {CONSOLIDATED_GAME_MODES.filter(m => m.category === 'quiz').map(m => renderModeCard(m))}
              </div>
            </div>

            {/* 4. 多人對戰 */}
            <div>
              <div className="flex items-center justify-between mb-3 pb-1.5 border-b border-purple-500/30">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚔️</span>
                  <h4 className="font-heading font-black text-sm sm:text-base text-slate-800 dark:text-purple-300">
                    多人對戰 (Battle)
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-bold">
                    連線與財富
                  </span>
                </div>
                <button
                  onClick={() => {
                    soundEngine.click();
                    setSelectedDomain('battle');
                  }}
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>聚焦此主題 ➔</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {CONSOLIDATED_GAME_MODES.filter(m => m.category === 'battle').map(m => renderModeCard(m))}
              </div>
            </div>

            {/* 5. 雙語聽說 */}
            <div>
              <div className="flex items-center justify-between mb-3 pb-1.5 border-b border-rose-500/30">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎧</span>
                  <h4 className="font-heading font-black text-sm sm:text-base text-slate-800 dark:text-rose-300">
                    雙語聽說 (Language Lab)
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold">
                    聽說分立
                  </span>
                </div>
                <button
                  onClick={() => {
                    soundEngine.click();
                    setSelectedDomain('langlab');
                  }}
                  className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>聚焦此主題 ➔</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {CONSOLIDATED_GAME_MODES.filter(m => m.category === 'langlab').map(m => renderModeCard(m, true))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Tier 2: 完整 Top 50 英雄榜彈窗 (Expandable Modal) ── */}
      {activeModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-emerald-400/80 dark:border-emerald-600/80 overflow-hidden relative max-h-[85vh] flex flex-col animate-scaleUp">
            {/* 彈窗頂部 */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                  <activeModalMode.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-black">
                    {activeModalMode.label} • 前 50 名榮譽殿堂
                  </h3>
                  <p className="text-[11px] sm:text-xs text-emerald-100 font-bold">
                    {lang === 'zh-TW' ? activeGradeObj.zh : activeGradeObj.en} • 第 {selectedWeek} 週 • 每位同學僅取最佳成績
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalModeId(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="關閉"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 排名列表內容 */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
              {activeModalRanks.length === 0 ? (
                <div className="py-16 text-center text-slate-400 font-bold text-sm">
                  <Crown className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  目前本年級尚無同學登錄成績，快去大廳成為第 1 位榮譽榜首吧！
                </div>
              ) : (
                activeModalRanks.map((entry, idx) => {
                  const isGold = idx === 0;
                  const isSilver = idx === 1;
                  const isBronze = idx === 2;

                  const studentName = entry.nickname || entry.name || '同學';
                  const scoreValue = activeModalMode.isSpecial === 'monopoly'
                    ? (entry.coins ?? 0)
                    : activeModalMode.isSpecial === 'quest'
                    ? (entry.quest_points ?? 0)
                    : (activeModalMode.id === 'escape' || activeModalMode.id === 'spotter')
                    ? (entry.time > 1000 ? (entry.time / 1000).toFixed(1) : (entry.time ?? entry.score))
                    : entry.score;

                  const badgeText = getSubModeBadge(entry, activeModalMode);

                  return (
                    <div
                      key={entry.id || entry.student_id || idx}
                      className={`flex items-center justify-between p-3 rounded-2xl text-xs sm:text-sm transition-colors border ${
                        isGold
                          ? 'bg-amber-400/20 border-amber-300 dark:border-amber-600 text-amber-950 dark:text-amber-100 font-black'
                          : isSilver
                          ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-black'
                          : isBronze
                          ? 'bg-amber-700/15 dark:bg-amber-950/30 border-amber-600/40 text-amber-900 dark:text-amber-200 font-black'
                          : 'bg-white/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black font-mono shrink-0 ${
                          isGold ? 'bg-amber-400 text-amber-950 shadow-sm' :
                          isSilver ? 'bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-white' :
                          isBronze ? 'bg-amber-600 text-white' :
                          'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        }`}>
                          {idx + 1}
                        </span>

                        <span className="font-heading font-black truncate max-w-[140px] sm:max-w-[200px]">
                          {studentName}
                        </span>

                        {badgeText && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 shrink-0">
                            {badgeText}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0 text-right">
                        <div>
                          <div className="font-mono font-black text-sm sm:text-base text-emerald-600 dark:text-emerald-400">
                            {scoreValue}
                            <span className="text-xs font-normal ml-0.5 text-slate-400">
                              {activeModalMode.unit}
                            </span>
                          </div>
                          {activeModalMode.id === 'escape' ? (
                            <span className="text-[10px] font-bold text-slate-400 block font-mono">
                              已解開 {entry.score} 道機關
                            </span>
                          ) : activeModalMode.id === 'spotter' ? (
                            <span className="text-[10px] font-bold text-rose-400 block font-mono">
                              剩餘 ❤️ x {entry.score}
                            </span>
                          ) : entry.time !== undefined && entry.time > 0 && activeModalMode.unit !== '秒' ? (
                            <span className="text-[10px] font-bold text-slate-400 block font-mono">
                              耗時 {entry.time} 秒
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* 彈窗底部關閉按鈕 */}
            <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 text-center shrink-0">
              <Button3D
                variant="slate"
                size="sm"
                onClick={() => setModalModeId(null)}
                className="w-full sm:w-auto"
              >
                關閉榜單
              </Button3D>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default LeaderboardView;
