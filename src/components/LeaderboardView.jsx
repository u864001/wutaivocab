import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { pad2, formatStudentBadge, formatStudentDisplayName, isGuestStudent } from '../utils/studentIdHelper';
import { loadStudentMastery } from '../utils/masteryHelper';
import {
  Trophy, ArrowLeft, RotateCw, Calendar, BookOpen, Puzzle, Rocket,
  Sparkles, Keyboard, Swords, ChevronRight, ChevronLeft, Compass, Flame,
  Coins, Award, Users, Crown, Zap, School, KeyRound, Eye, Headphones,
  PenTool, Mic, Volume2, VolumeX, Globe, Sun, Moon, User, CheckCircle2,
  Layers, ArrowUpRight
} from 'lucide-react';

// ── 年級標籤 (嚴格保留 '一年級' 等文字供全自動測試點擊) ──
export const GRADE_LEADERBOARD_TABS = [
  { id: '01', zh: '一年級', en: 'Grade 1', books: ['g1', 'abc', '1'], isAlphabet: true },
  { id: '02', zh: '二年級', en: 'Grade 2', books: ['g2', 'abc', '2'], isAlphabet: true },
  { id: '03', zh: '三年級', en: 'Grade 3', books: ['1', '2'] },
  { id: '04', zh: '四年級', en: 'Grade 4', books: ['3', '4'] },
  { id: '05', zh: '五年級', en: 'Grade 5', books: ['5', '6'] },
  { id: '06', zh: '六年級', en: 'Grade 6', books: ['7', '8', '9'] },
  { id: 'all', zh: '全校大亂鬥', en: 'All School', books: null, isAllSchool: true }
];

// ── 四大天王色調與標籤 ──
export const FOUR_CHAMPION_TABS = [
  {
    id: 'exam_king',
    zh: '測驗之王',
    en: 'Exam King',
    realm: '破曉藍調 • 劍橋Pre-A1/學力/課本/口說',
    icon: Crown,
    color: 'from-sky-500 to-indigo-600',
    border: 'border-sky-400/60',
    ring: 'ring-sky-400/40',
    glow: 'shadow-sky-500/25',
    textGlow: 'text-sky-300'
  },
  {
    id: 'coin_king',
    zh: '金幣之王',
    en: 'Coin King',
    realm: '朝陽暖金 • 勤學累積全校總資產',
    icon: Coins,
    color: 'from-amber-400 to-yellow-600',
    border: 'border-amber-400/60',
    ring: 'ring-amber-400/40',
    glow: 'shadow-amber-500/25',
    textGlow: 'text-amber-300'
  },
  {
    id: 'point_king',
    zh: '積分之王',
    en: 'Quest King',
    realm: '林谷翡翠 • 霧臺家園探索歷險',
    icon: Compass,
    color: 'from-emerald-400 to-teal-600',
    border: 'border-emerald-400/60',
    ring: 'ring-emerald-400/40',
    glow: 'shadow-emerald-500/25',
    textGlow: 'text-emerald-300'
  },
  {
    id: 'game_king',
    zh: '遊戲之王',
    en: 'Game King',
    realm: '暮色紫霞 • 單字館四大領域9大小遊戲',
    icon: Rocket,
    color: 'from-purple-400 to-fuchsia-600',
    border: 'border-purple-400/60',
    ring: 'ring-purple-400/40',
    glow: 'shadow-purple-500/25',
    textGlow: 'text-purple-300'
  }
];

export const DOMAIN_CATEGORIES = FOUR_CHAMPION_TABS;

// ── 測驗之王四大子軌道 (嚴格對齊原測驗館色彩與官方規範) ──
export const EXAM_KING_SUBTRACKS = [
  {
    id: 'prea1_mastery',
    label: 'Pre-A1 官方精熟',
    subLabel: '官方 300 題動態精熟',
    icon: Award,
    unit: '題精熟',
    badgeColor: 'border-sky-400 text-sky-300 bg-sky-500/15 ring-sky-400/40',
    modeKeys: ['prea1-mastery']
  },
  {
    id: 'saa_mastery',
    label: 'SAA 學力成就',
    subLabel: '教育部學習成就評量',
    icon: CheckCircle2,
    unit: '題精熟',
    badgeColor: 'border-emerald-400 text-emerald-300 bg-emerald-500/15 ring-emerald-400/40',
    modeKeys: ['saa-mastery', 'mcq-saa']
  },
  {
    id: 'mcq_king',
    label: '課本單元檢定',
    subLabel: '1,289 題課綱單元測驗',
    icon: Crown,
    unit: '分',
    badgeColor: 'border-amber-400 text-amber-300 bg-amber-500/15 ring-amber-400/40',
    modeKeys: ['mcq-king', 'mcq-diligent']
  },
  {
    id: 'speaking_lab',
    label: '雙語口說評測',
    subLabel: '即時 AI 發音與朗讀跟讀',
    icon: Mic,
    unit: '題',
    badgeColor: 'border-rose-400 text-rose-300 bg-rose-500/15 ring-rose-400/40',
    modeKeys: ['speaking_lab']
  }
];

// ── 遊戲之王四大子領域 (100% 嚴格遵循 Lobby.jsx 單字館分類與框色) ──
export const GAME_KING_CATEGORIES = [
  {
    id: 'explore',
    title: '探索解謎',
    icon: KeyRound,
    colorClass: 'border-teal-400 text-teal-300 bg-teal-500/15',
    activeClass: 'ring-2 ring-teal-400 border-teal-300 bg-teal-500/25 text-white',
    games: [
      { id: 'escape', name: '神祕密室逃脫', icon: KeyRound, unit: '秒', modeKeys: ['escape'] },
      { id: 'spotter', name: '鷹眼神探找不同', icon: Eye, unit: '秒', modeKeys: ['spotter'] },
      { id: 'maze', name: '字母巡航迷宮', icon: Compass, unit: '秒', modeKeys: ['maze-upper', 'maze-lower', 'maze-master'] },
      { id: 'memory', name: '翻牌記憶對決', icon: Sparkles, unit: '分', modeKeys: ['memory-single'] }
    ]
  },
  {
    id: 'speed',
    title: '極速反應',
    icon: Flame,
    colorClass: 'border-amber-400 text-amber-300 bg-amber-500/15',
    activeClass: 'ring-2 ring-amber-400 border-amber-300 bg-amber-500/25 text-white',
    games: [
      { id: 'mole', name: '單字打地鼠', icon: Zap, unit: '分', modeKeys: ['mole-vocab', 'mole-abc'] },
      { id: 'swipe', name: '極速是非滑牌', icon: Flame, unit: '分', modeKeys: ['swipe-vocab', 'swipe-abc'] },
      { id: 'meteor', name: '3D 隕石防衛戰', icon: Rocket, unit: '分', modeKeys: ['meteor-zh-en', 'meteor-en-zh', 'meteor-abc'] },
      { id: 'snake', name: '叢林神山貪蛇', icon: Zap, unit: '分', modeKeys: ['snake-normal', 'snake-survival', 'snake-easy'] }
    ]
  },
  {
    id: 'quiz',
    title: '經典測驗',
    icon: Keyboard,
    colorClass: 'border-sky-400 text-sky-300 bg-sky-500/15',
    activeClass: 'ring-2 ring-sky-400 border-sky-300 bg-sky-500/25 text-white',
    games: [
      { id: 'quiz', name: '中英字義速辨', icon: Keyboard, unit: '分', modeKeys: ['quiz-choice', 'quiz-zh-en', 'quiz-en-zh', 'quiz-hard'] },
      { id: 'listening', name: '聽力三合一', icon: Volume2, unit: '分', modeKeys: ['quiz-listening', 'quiz-listening-word', 'quiz-listening-sentence', 'quiz-listening-qa'] },
      { id: 'spelling', name: '單字積木拼裝', icon: Puzzle, unit: '分', modeKeys: ['spelling'] },
      { id: 'handwriting', name: '神筆筆順書寫', icon: PenTool, unit: '分', modeKeys: ['handwriting', 'handwriting-abc'] }
    ]
  },
  {
    id: 'battle',
    title: '多人連線',
    icon: Swords,
    colorClass: 'border-purple-400 text-purple-300 bg-purple-500/15',
    activeClass: 'ring-2 ring-purple-400 border-purple-300 bg-purple-500/25 text-white',
    games: [
      { id: 'battle', name: '即時多人連線', icon: Swords, unit: '勝', modeKeys: ['battle-wins'] }
    ]
  }
];

// 全域遊戲模式聚合表
export const CONSOLIDATED_GAME_MODES = [
  ...EXAM_KING_SUBTRACKS.map(s => ({
    id: s.id,
    label: s.label,
    icon: s.icon,
    unit: s.unit,
    champion: 'exam_king',
    modeKeys: s.modeKeys
  })),
  {
    id: 'monopoly',
    label: '金幣財富榜',
    icon: Coins,
    unit: '金幣',
    champion: 'coin_king',
    isSpecial: 'monopoly',
    modeKeys: ['monopoly']
  },
  {
    id: 'town_quest',
    label: '探索歷險積分',
    icon: Compass,
    unit: '分',
    champion: 'point_king',
    isSpecial: 'quest',
    modeKeys: ['quest-points']
  },
  ...GAME_KING_CATEGORIES.flatMap(c =>
    c.games.map(g => ({
      id: g.id,
      label: g.name,
      icon: g.icon,
      unit: g.unit,
      champion: 'game_king',
      category: c.id,
      modeKeys: g.modeKeys
    }))
  )
];

// ── 3A 遊戲立體金屬名次徽章 (絕不使用廉價 Emoji) ──
const MetallicRankMedal = ({ rank }) => {
  if (rank === 1) {
    return (
      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 text-amber-950 ring-1 ring-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.6)] font-black text-xs font-mono flex items-center justify-center shrink-0">
        1
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-100 via-slate-300 to-slate-400 text-slate-900 ring-1 ring-slate-200 shadow-[0_0_6px_rgba(226,232,240,0.5)] font-black text-xs font-mono flex items-center justify-center shrink-0">
        2
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-yellow-900 text-amber-100 ring-1 ring-amber-500 shadow-[0_0_6px_rgba(217,119,6,0.4)] font-black text-xs font-mono flex items-center justify-center shrink-0">
        3
      </span>
    );
  }
  return (
    <span className="w-6 h-6 rounded-full bg-white/10 dark:bg-slate-800 text-slate-300 border border-white/15 font-bold text-xs font-mono flex items-center justify-center shrink-0">
      {rank}
    </span>
  );
};

// ── 大武山四聯屏風畫連續山脈幾何 SVG ──
const DawuMountainPolyptychSvg = ({ panelIndex }) => {
  if (panelIndex === 0) {
    // 測驗之巔・西麓起點 (起於 y:95，升至交界 y:55)
    return (
      <svg className="w-full h-full" viewBox="0 0 300 130" preserveAspectRatio="none">
        <defs>
          <linearGradient id="exam-mountain-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="exam-mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path d="M 0,78 C 90,65 180,40 300,48 L 300,130 L 0,130 Z" fill="url(#exam-mist)" />
        <path d="M 0,95 C 60,90 110,70 170,55 C 220,42 265,48 300,55 L 300,130 L 0,130 Z" fill="url(#exam-mountain-grad)" />
        <path d="M 0,95 C 60,90 110,70 170,55 C 220,42 265,48 300,55" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.75" />
      </svg>
    );
  }

  if (panelIndex === 1) {
    // 金幣之麓・北大武主峰峭壁 (始於交界 y:55，攀登最高主峰 y:12，降至交界 y:68)
    return (
      <svg className="w-full h-full" viewBox="0 0 300 130" preserveAspectRatio="none">
        <defs>
          <linearGradient id="coin-mountain-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="coin-mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path d="M 0,48 C 80,30 150,22 300,58 L 300,130 L 0,130 Z" fill="url(#coin-mist)" />
        <path d="M 0,55 C 45,60 90,35 150,12 C 195,15 250,38 300,68 L 300,130 L 0,130 Z" fill="url(#coin-mountain-grad)" />
        <path d="M 0,55 C 45,60 90,35 150,12 C 195,15 250,38 300,68" fill="none" stroke="#fbbf24" strokeWidth="1.8" strokeOpacity="0.9" />
        {/* 北大武主峰破曉微光 */}
        <circle cx="150" cy="12" r="3" fill="#fef08a" className="animate-pulse" />
      </svg>
    );
  }

  if (panelIndex === 2) {
    // 積分之谷・大武鞍部林谷 (始於交界 y:68，深壑 y:82，攀升至交界 y:48)
    return (
      <svg className="w-full h-full" viewBox="0 0 300 130" preserveAspectRatio="none">
        <defs>
          <linearGradient id="quest-mountain-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="quest-mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path d="M 0,58 C 80,68 180,60 300,42 L 300,130 L 0,130 Z" fill="url(#quest-mist)" />
        <path d="M 0,68 C 50,75 100,88 160,82 C 215,76 260,62 300,48 L 300,130 L 0,130 Z" fill="url(#quest-mountain-grad)" />
        <path d="M 0,68 C 50,75 100,88 160,82 C 215,76 260,62 300,48" fill="none" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.8" />
      </svg>
    );
  }

  // 遊戲之界・南大武霞稜 (始於交界 y:48，夕照山稜 y:35，傾瀉至 y:95)
  return (
    <svg className="w-full h-full" viewBox="0 0 300 130" preserveAspectRatio="none">
      <defs>
        <linearGradient id="game-mountain-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="game-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <path d="M 0,42 C 80,32 170,42 300,82 L 300,130 L 0,130 Z" fill="url(#game-mist)" />
      <path d="M 0,48 C 40,42 90,32 150,45 C 210,58 260,80 300,95 L 300,130 L 0,130 Z" fill="url(#game-mountain-grad)" />
      <path d="M 0,48 C 40,42 90,32 150,45 C 210,58 260,80 300,95" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeOpacity="0.8" />
    </svg>
  );
};

export const LeaderboardView = ({ onBack, onOpenTeacherHub }) => {
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
  const isPastWeek = selectedWeek < currentWeek;

  // 展開神聖殿堂狀態機：null (四屏風大武全景) | 'exam_king' | 'coin_king' | 'point_king' | 'game_king'
  const [activeSanctum, setActiveSanctum] = useState(null);

  // 測驗之王神殿內選中子軌道
  const [activeExamSubtrack, setActiveExamSubtrack] = useState('prea1_mastery');

  // 遊戲之王神殿內選中分類與遊戲
  const [activeGameCategory, setActiveGameCategory] = useState('explore');
  const [activeGameId, setActiveGameId] = useState('escape');

  const [boardData, setBoardData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // 隱藏管理後台彩蛋
  const handleTitleClick = useEasterEgg(onOpenTeacherHub, 5, 2000);

  // 當前年級設定
  const activeGradeObj = useMemo(() => {
    return GRADE_LEADERBOARD_TABS.find(tab => tab.id === selectedGrade) || GRADE_LEADERBOARD_TABS[3];
  }, [selectedGrade]);

  // 載入所有模式榜單
  const loadGradeBoards = useCallback(async (force = false) => {
    setIsLoading(true);
    const results = { ...boardData };
    const isPast = selectedWeek < currentWeek;
    const cacheTtl = isPast ? 7 * 24 * 60 * 60 * 1000 : 45 * 1000;
    const now = Date.now();

    const isAll = activeGradeObj.isAllSchool || selectedGrade === 'all' || selectedGrade === '00';
    const isAlphabetGrade = Boolean(activeGradeObj.isAlphabet);
    const books = isAll ? null : activeGradeObj.books;

    await Promise.all(
      CONSOLIDATED_GAME_MODES.map(async (m) => {
        const CACHE_KEY = `lb_poly_${selectedWeek}_${selectedGrade}_${m.id}`;

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
          } else if (m.id === 'prea1_mastery') {
            const queryBooks = isAll ? null : [`g${parseInt(selectedGrade, 10)}`];
            fetchedList = await fetchLeaderboard(selectedWeek, 'prea1-mastery', queryBooks, 50);
            if ((!fetchedList || fetchedList.length === 0) && currentStudent) {
              const sid = currentStudent.student_id || currentStudent.id;
              const snap = loadStudentMastery(sid);
              const tme = snap?.tracks?.['tme-preA1'];
              if (tme && tme.mastered_count > 0) {
                fetchedList = [{
                  id: 'local_mastery_' + sid,
                  name: formatStudentDisplayName(currentStudent),
                  score: tme.mastered_count,
                  time: Math.round((tme.mastered_count / (tme.total_items || 300)) * 100),
                  book: `g${currentStudent.grade || 4}`,
                  created_at: snap.updated_at
                }];
              }
            }
          } else if (m.id === 'saa_mastery') {
            const queryBooks = isAll ? null : [`g${parseInt(selectedGrade, 10)}`];
            fetchedList = await fetchLeaderboard(selectedWeek, ['saa-mastery', 'mcq-saa'], queryBooks, 50);
            if ((!fetchedList || fetchedList.length === 0) && currentStudent) {
              const sid = currentStudent.student_id || currentStudent.id;
              const snap = loadStudentMastery(sid);
              const saa = snap?.tracks?.['ministry-assessment'];
              if (saa && saa.mastered_count > 0) {
                fetchedList = [{
                  id: 'local_mastery_saa_' + sid,
                  name: formatStudentDisplayName(currentStudent),
                  score: saa.mastered_count,
                  time: Math.round((saa.mastered_count / (saa.total_items || 285)) * 100),
                  book: `g${currentStudent.grade || 4}`,
                  created_at: snap.updated_at
                }];
              }
            }
          } else {
            const queryBooks = isAll
              ? null
              : m.champion === 'exam_king'
              ? (selectedGrade === '01' ? ['g1'] : selectedGrade === '02' ? ['g2'] : books)
              : (isAlphabetGrade && (m.id === 'maze' || m.id === 'swipe' || m.id === 'meteor' || m.id === 'memory' || m.id === 'listening_lab' || m.id === 'speaking_lab'))
              ? null
              : books;

            fetchedList = await fetchLeaderboard(selectedWeek, m.modeKeys, queryBooks, 50);
            if (Array.isArray(fetchedList)) {
              if (m.id === 'escape') {
                fetchedList = fetchedList.filter(row => row.time && Number(row.time) > 1);
              } else if (m.id === 'spotter') {
                fetchedList = fetchedList.filter(row => row.time && Number(row.time) > 0);
              }
              if (isPast) {
                fetchedList = fetchedList.filter(row => !isGuestStudent(row));
              }
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
  }, [selectedWeek, selectedGrade, activeGradeObj, currentWeek, currentStudent]);

  useEffect(() => {
    loadGradeBoards();
  }, [loadGradeBoards]);

  // ── 四大天王前三名即時預覽 (零混亂分數，純名次與座號姓名) ──
  const previewTopThree = useMemo(() => {
    const getTopThree = (list) => {
      if (!Array.isArray(list)) return [];
      const cleanList = isPastWeek ? list.filter(r => !isGuestStudent(r)) : list;
      return cleanList.slice(0, 3).map(r => ({
        name: formatStudentDisplayName(r),
        badge: formatStudentBadge(r, lang)
      }));
    };

    // 測驗之王：優先取 Pre-A1 官方精熟，若無則取課本檢定
    const examSource = (boardData['prea1_mastery']?.length > 0)
      ? boardData['prea1_mastery']
      : (boardData['mcq_king']?.length > 0)
      ? boardData['mcq_king']
      : (boardData['saa_mastery'] || []);

    // 金幣之王：monopoly
    const coinSource = boardData['monopoly'] || [];

    // 積分之王：town_quest
    const pointSource = boardData['town_quest'] || [];

    // 遊戲之王：聚合小遊戲榜中最佳選手
    const arcadeIds = ['escape', 'spotter', 'maze', 'mole', 'swipe', 'meteor', 'snake', 'battle'];
    const gamePlayersMap = new Map();
    arcadeIds.forEach(id => {
      const gList = boardData[id] || [];
      gList.forEach((r, idx) => {
        const name = formatStudentDisplayName(r);
        if (!gamePlayersMap.has(name) || idx + 1 < gamePlayersMap.get(name).bestRank) {
          gamePlayersMap.set(name, {
            name,
            badge: formatStudentBadge(r, lang),
            bestRank: idx + 1
          });
        }
      });
    });
    const gameSource = Array.from(gamePlayersMap.values()).sort((a, b) => a.bestRank - b.bestRank);

    return {
      exam_king: getTopThree(examSource),
      coin_king: getTopThree(coinSource),
      point_king: getTopThree(pointSource),
      game_king: gameSource.slice(0, 3)
    };
  }, [boardData, isPastWeek, lang]);

  // ── 全能至尊殿堂 (Grand Master) 綜合名次計算 (平均名次排序，零分數展示) ──
  const grandMasterTopThree = useMemo(() => {
    const studentMap = new Map();

    const trackRank = (list, domainKey) => {
      if (!Array.isArray(list)) return;
      list.forEach((row, idx) => {
        if (isPastWeek && isGuestStudent(row)) return;
        const name = formatStudentDisplayName(row);
        const badge = formatStudentBadge(row, lang);
        if (!studentMap.has(name)) {
          studentMap.set(name, {
            name,
            badge,
            ranks: { exam: 50, coin: 50, point: 50, game: 50 },
            activeCount: 0
          });
        }
        const s = studentMap.get(name);
        const currentRank = idx + 1;
        if (currentRank < s.ranks[domainKey]) {
          if (s.ranks[domainKey] === 50) s.activeCount += 1;
          s.ranks[domainKey] = currentRank;
        }
      });
    };

    // 1. 測驗領域
    ['prea1_mastery', 'saa_mastery', 'mcq_king', 'speaking_lab'].forEach(id => {
      trackRank(boardData[id], 'exam');
    });

    // 2. 金幣領域
    trackRank(boardData['monopoly'], 'coin');

    // 3. 積分領域
    trackRank(boardData['town_quest'], 'point');

    // 4. 遊戲領域
    ['escape', 'spotter', 'maze', 'mole', 'swipe', 'meteor', 'snake', 'battle'].forEach(id => {
      trackRank(boardData[id], 'game');
    });

    const students = Array.from(studentMap.values()).map(s => {
      const avgRank = (s.ranks.exam + s.ranks.coin + s.ranks.point + s.ranks.game) / 4;
      return { ...s, avgRank };
    });

    // 優先比參與領域數，再比平均名次
    students.sort((a, b) => {
      if (b.activeCount !== a.activeCount) return b.activeCount - a.activeCount;
      return a.avgRank - b.avgRank;
    });

    return students.slice(0, 3);
  }, [boardData, isPastWeek, lang]);

  // 當前選中神殿的背景壁紙
  const currentWallpaper = useMemo(() => {
    if (activeSanctum === 'coin_king') return '/assets/lobby/theme_town.jpg';
    if (activeSanctum === 'point_king') return '/assets/lobby/theme_explore.jpg';
    if (activeSanctum === 'game_king') return '/assets/lobby/theme_speed.jpg';
    return '/assets/lobby/theme_quiz.jpg';
  }, [activeSanctum]);

  // 切換週次
  const handlePrevWeek = () => {
    if (selectedWeek > 1) {
      soundEngine.click();
      setSelectedWeek(w => w - 1);
    }
  };

  const handleNextWeek = () => {
    if (selectedWeek < currentWeek) {
      soundEngine.click();
      setSelectedWeek(w => w + 1);
    }
  };

  return (
    <div className={`relative min-h-screen w-full select-none pb-20 transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-800'}`}>
      {/* ── 全景主題背景層 (依神殿平滑流光切換) ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0">
        <img
          key={currentWallpaper}
          src={currentWallpaper}
          alt="Wallpaper"
          className={`w-full h-full object-cover object-center scale-100 transition-all duration-700 ease-out ${
            isDark ? 'brightness-[0.55] contrast-[1.1]' : 'brightness-[0.80] contrast-[1.05]'
          }`}
        />
        <div className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${
          isDark
            ? 'bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-slate-950/95'
            : 'bg-gradient-to-b from-white/90 via-slate-50/75 to-white/95 backdrop-blur-[2px]'
        }`} />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-2 sm:px-6 py-2.5 sm:py-6">
        {/* ── 頂部工具列 (回大廳、標題彩蛋、控制項群組) ── */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 mb-3 sm:mb-4">
          <Button3D
            variant={isDark ? "slate" : "secondary"}
            size="sm"
            onClick={onBack}
            icon={ArrowLeft}
            className="px-2.5 py-1.5 sm:px-3.5 shrink-0"
          >
            <span className="hidden sm:inline">{t.backLobby || '回大廳'}</span>
          </Button3D>

          <h2
            onClick={handleTitleClick}
            className={`hidden md:flex text-xl sm:text-2xl font-black font-heading items-center gap-2 cursor-pointer select-none active:scale-95 transition-transform ${
              isDark ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]' : 'text-slate-800 drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]'
            }`}
            title="連續點擊 5 次啟動管理後台"
          >
            <Trophy className="w-6 h-6 text-amber-400 animate-bounce" />
            <span>全校英雄榮譽榜</span>
          </h2>

          {/* 右上角控制列 (重新整理 ➔ 聲音 ➔ 語言 ➔ 日夜 ➔ 學生通行證) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={() => loadGradeBoards(true)}
              disabled={isLoading}
              className={`p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border transition-all cursor-pointer shadow-md active:scale-95 shrink-0 ${
                isDark
                  ? 'bg-black/60 border-white/20 text-slate-300 hover:text-white'
                  : 'bg-white/90 border-slate-300 text-slate-600 hover:text-slate-900 shadow-sm'
              }`}
              title="重新整理"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => {
                const m = soundEngine.toggleMute();
                setIsMuted(m);
              }}
              className={`p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border transition-all cursor-pointer shadow-md active:scale-95 shrink-0 ${
                isDark
                  ? 'bg-black/60 border-white/20 text-slate-300 hover:text-white'
                  : 'bg-white/90 border-slate-300 text-slate-600 hover:text-slate-900 shadow-sm'
              }`}
              title={isMuted ? '開啟音效' : '靜音'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={() => {
                soundEngine.click();
                if (toggleLang) toggleLang();
              }}
              className={`p-1.5 sm:px-2.5 sm:py-2 rounded-xl sm:rounded-2xl border transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-1 shrink-0 ${
                isDark
                  ? 'bg-black/60 border-white/20 text-blue-400 hover:text-white'
                  : 'bg-white/90 border-slate-300 text-blue-600 hover:text-blue-700 shadow-sm'
              }`}
              title="切換語言"
            >
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-black hidden sm:inline">{lang === 'zh-TW' ? 'EN' : '中文'}</span>
            </button>

            <button
              onClick={() => {
                soundEngine.click();
                toggleTheme();
              }}
              className={`p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border transition-all cursor-pointer shadow-md active:scale-95 relative shrink-0 ${
                isDark
                  ? 'bg-black/60 border-white/20 text-cyan-300 hover:text-white'
                  : 'bg-white/90 border-slate-300 text-amber-500 hover:text-amber-600 shadow-sm'
              }`}
              title="切換日夜"
            >
              {isDark ? <Moon className="w-4 h-4 text-cyan-300" /> : <Sun className="w-4 h-4 text-amber-500" />}
              {isAuto && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* 學生身分錨點 */}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  soundEngine.click();
                  if (openModal) openModal();
                }}
                className="px-2 py-1 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 border border-emerald-400/50 text-slate-800 dark:text-slate-100 flex items-center gap-1 sm:gap-1.5 text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
              >
                {currentStudent?.avatar_id ? (
                  <img
                    src={`/assets/avatars/${currentStudent.avatar_id}.webp`}
                    alt="Avatar"
                    className="w-5 h-5 rounded-full object-cover border border-amber-400 shadow-sm shrink-0"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                )}
                <span className="font-heading truncate max-w-[90px] hidden sm:inline">
                  {formatStudentBadge(currentStudent, lang)}
                </span>
                <span className="flex items-center gap-0.5 text-amber-400 font-mono font-black text-xs">
                  <Coins className="w-3 h-3 shrink-0" />
                  {currentStudent?.coins ?? 0}
                </span>
              </button>
            ) : (
              <button
                onClick={() => {
                  soundEngine.click();
                  if (openModal) openModal();
                }}
                className="p-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white flex items-center gap-1.5 text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">登入座號</span>
              </button>
            )}
          </div>
        </div>

        {/* ── 極簡年級膠囊列 (保留 '一年級' 等標準標籤) ── */}
        <div className="mb-3">
          <div className={`flex items-center gap-1.5 p-1 rounded-2xl border backdrop-blur-md overflow-x-auto scrollbar-none shadow-lg transition-colors ${
            isDark ? 'bg-slate-950/70 border-white/15' : 'bg-white/85 border-slate-200/90 shadow-sm'
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
                  className={`flex-1 min-w-[85px] py-2 px-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md border border-emerald-300 ring-2 ring-emerald-400/40 scale-[1.02]'
                      : isDark
                      ? 'text-slate-300 hover:text-white hover:bg-white/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{lang === 'zh-TW' ? tab.zh : tab.en}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 頂部控制器便當條：年級狀態 ＆ 純箭頭週次步進器 [ ◀ 第 10 週 ▶ ] ── */}
        <div className={`mb-4 px-3 py-2 rounded-2xl border backdrop-blur-md shadow-md transition-colors flex items-center justify-between gap-2 flex-wrap ${
          isDark ? 'bg-slate-950/70 border-white/15 text-white' : 'bg-white/85 border-slate-200/90 text-slate-800'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-black">
              {lang === 'zh-TW' ? activeGradeObj.zh : activeGradeObj.en}
            </span>
            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-black flex items-center gap-1 ${
              isDark ? 'bg-indigo-500/30 border-indigo-400/40 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}>
              <School className="w-3 h-3" />
              {getSemesterDisplayName()}
            </span>
          </div>

          {/* 純箭頭週次步進器 [ ◀ 第 10 週 ▶ ] */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevWeek}
              disabled={selectedWeek <= 1}
              className={`p-1.5 rounded-xl border transition-all ${
                selectedWeek <= 1
                  ? 'opacity-30 cursor-not-allowed border-transparent text-slate-500'
                  : isDark
                  ? 'bg-white/10 border-white/20 text-white hover:bg-white/20 active:scale-95 cursor-pointer'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 active:scale-95 cursor-pointer'
              }`}
              title="前一週"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className={`px-2.5 py-1 rounded-xl border font-mono font-black text-xs sm:text-sm flex items-center gap-1.5 ${
              isDark ? 'bg-black/40 border-white/15 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>第 {selectedWeek} 週</span>
              {selectedWeek === currentWeek && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-sans font-bold">
                  本週
                </span>
              )}
            </div>

            <button
              onClick={handleNextWeek}
              disabled={selectedWeek >= currentWeek}
              className={`p-1.5 rounded-xl border transition-all ${
                selectedWeek >= currentWeek
                  ? 'opacity-30 cursor-not-allowed border-transparent text-slate-500'
                  : isDark
                  ? 'bg-white/10 border-white/20 text-white hover:bg-white/20 active:scale-95 cursor-pointer'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 active:scale-95 cursor-pointer'
              }`}
              title="後一週"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── 四王全能至尊殿堂 (Grand Master Hall) 頂部榮譽銘牌 (零分數，純名次與姓名) ── */}
        <div className={`mb-5 p-3 sm:p-3.5 rounded-2xl border backdrop-blur-md shadow-lg transition-all ${
          isDark
            ? 'bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-amber-950/40 border-amber-400/40'
            : 'bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-amber-300'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-400">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-heading font-black text-amber-400 tracking-wider">
                四王綜合全能至尊殿堂
              </span>
            </div>

            {/* 前三名純名次展示 */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {grandMasterTopThree.length === 0 ? (
                <span className="text-xs text-slate-400 font-bold">尚無登榜記錄</span>
              ) : (
                grandMasterTopThree.map((s, idx) => (
                  <div
                    key={s.name}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-black transition-transform ${
                      idx === 0
                        ? 'bg-amber-400/20 border-amber-400/60 text-amber-300 shadow-sm'
                        : idx === 1
                        ? isDark ? 'bg-white/10 border-white/20 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-700'
                        : isDark ? 'bg-amber-900/20 border-amber-800/40 text-amber-200' : 'bg-amber-100 border-amber-200 text-amber-800'
                    }`}
                  >
                    <MetallicRankMedal rank={idx + 1} />
                    <span className="truncate max-w-[110px]">{s.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            主舞台：大武山四聯屏風一頁式主視覺 (Overview) OR 神聖殿堂展開 (Sanctum)
        ══════════════════════════════════════════════════════════════════ */}
        {!activeSanctum ? (
          /* ── 大武山四聯屏風畫 (Dawu Mountain Polyptych Folding Screen) ── */
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 animate-fadeIn">
            {FOUR_CHAMPION_TABS.map((tab, idx) => {
              const Icon = tab.icon;
              const previews = previewTopThree[tab.id] || [];

              return (
                <div
                  key={tab.id}
                  onClick={() => {
                    soundEngine.click();
                    setActiveSanctum(tab.id);
                  }}
                  className={`group relative rounded-3xl border overflow-hidden p-4 sm:p-5 flex flex-col justify-between min-h-[300px] sm:min-h-[340px] cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-xl backdrop-blur-md ${
                    isDark
                      ? `bg-slate-950/80 ${tab.border} hover:${tab.glow}`
                      : `bg-white/90 ${tab.border} hover:${tab.glow}`
                  }`}
                >
                  {/* 大武山連峰背景幾何稜線 (第 0~3 扇連續相接) */}
                  <div className="absolute inset-x-0 bottom-0 h-36 pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity duration-300">
                    <DawuMountainPolyptychSvg panelIndex={idx} />
                  </div>

                  {/* 頂部：標題與圖標 */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${tab.color} text-white flex items-center justify-center shadow-md`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[11px] font-mono font-black px-2 py-0.5 rounded-full border ${
                        isDark ? 'bg-white/10 border-white/15 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
                      }`}>
                        TOP 50
                      </span>
                    </div>

                    <h3 className={`font-heading font-black text-lg sm:text-xl tracking-wide ${tab.textGlow}`}>
                      {tab.zh}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {tab.realm}
                    </p>
                  </div>

                  {/* 中間：即時前三名預覽 (零混亂分數，純立體金屬名次徽章 + 截斷姓名) */}
                  <div className="relative z-10 my-4 space-y-2">
                    {previews.length === 0 ? (
                      <div className="py-6 text-center text-xs font-bold text-slate-400 flex flex-col items-center gap-1">
                        <Sparkles className="w-4 h-4 text-slate-500" />
                        <span>尚無登榜同學</span>
                      </div>
                    ) : (
                      previews.map((entry, rIdx) => (
                        <div
                          key={entry.name + rIdx}
                          className={`flex items-center gap-2 p-2 rounded-xl text-xs font-black transition-colors ${
                            rIdx === 0
                              ? isDark ? 'bg-amber-400/15 text-amber-200 border border-amber-400/40' : 'bg-amber-50 text-amber-900 border border-amber-200'
                              : isDark ? 'bg-white/5 text-slate-200 border border-white/10' : 'bg-slate-50 text-slate-800 border border-slate-200'
                          }`}
                        >
                          <MetallicRankMedal rank={rIdx + 1} />
                          <span className="truncate flex-1">{entry.name}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* 底部按鈕：展開專屬殿堂 */}
                  <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-black text-slate-300 group-hover:text-white transition-colors">
                    <span>展開完整榮譽榜</span>
                    <ArrowUpRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ══════════════════════════════════════════════════════════════════
              神聖殿堂展開模式 (Sanctum Mode)：依照主榜專屬色調渲染
          ══════════════════════════════════════════════════════════════════ */
          <div className="animate-fadeIn space-y-4">
            {/* 殿堂頂部微縮導航條 (返回大武全景 ＋ 四王即時切換膠囊) */}
            <div className={`p-2 rounded-2xl border backdrop-blur-md flex items-center justify-between gap-2 flex-wrap ${
              isDark ? 'bg-slate-950/80 border-white/15' : 'bg-white/90 border-slate-200'
            }`}>
              <button
                onClick={() => {
                  soundEngine.click();
                  setActiveSanctum(null);
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                  isDark ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>返回大武全景</span>
              </button>

              {/* 四王快速切換標籤 */}
              <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none">
                {FOUR_CHAMPION_TABS.map((tab) => {
                  const isCurrent = activeSanctum === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        soundEngine.click();
                        setActiveSanctum(tab.id);
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                        isCurrent
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-md border ${tab.border}`
                          : isDark
                          ? 'text-slate-300 hover:text-white hover:bg-white/10 border border-transparent'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.zh}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 殿堂本體內容 (依王別渲染) */}
            {(() => {
              // ── 1. 測驗之王神殿 (Exam Sanctum) ──
              if (activeSanctum === 'exam_king') {
                const activeTrackObj = EXAM_KING_SUBTRACKS.find(t => t.id === activeExamSubtrack) || EXAM_KING_SUBTRACKS[0];
                const list = (boardData[activeTrackObj.id] || []).slice(0, 50);

                return (
                  <div className={`p-4 sm:p-6 rounded-3xl border backdrop-blur-xl shadow-2xl transition-all ${
                    isDark
                      ? 'bg-gradient-to-b from-sky-950/40 via-indigo-950/20 to-slate-950/90 border-sky-500/40'
                      : 'bg-gradient-to-b from-sky-50/90 via-indigo-50/70 to-white/95 border-sky-300'
                  }`}>
                    {/* 四大子榜膠囊切換 (參考原測驗館色彩) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                      {EXAM_KING_SUBTRACKS.map(track => {
                        const isSelected = activeExamSubtrack === track.id;
                        const SubIcon = track.icon;
                        return (
                          <button
                            key={track.id}
                            onClick={() => {
                              soundEngine.click();
                              setActiveExamSubtrack(track.id);
                            }}
                            className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                              isSelected
                                ? `ring-2 ${track.badgeColor} font-black scale-[1.02] shadow-md`
                                : isDark
                                ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                                : 'bg-white/60 border-slate-200 text-slate-700 hover:bg-white'
                            }`}
                          >
                            <SubIcon className="w-4 h-4 shrink-0" />
                            <div className="truncate">
                              <div className="text-xs font-black truncate">{track.label}</div>
                              <div className="text-[10px] text-slate-400 truncate">{track.subLabel}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Top 50 清單 */}
                    <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
                      {list.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 font-bold text-xs flex flex-col items-center gap-2">
                          <Crown className="w-8 h-8 text-slate-500" />
                          <span>本年級尚無同學登錄 {activeTrackObj.label} 成績，快去挑戰吧！</span>
                        </div>
                      ) : (
                        list.map((entry, idx) => (
                          <div
                            key={entry.id || entry.student_id || idx}
                            className={`flex items-center justify-between p-2.5 rounded-2xl text-xs sm:text-sm border transition-colors ${
                              idx === 0
                                ? 'bg-amber-400/20 border-amber-400/60 font-black'
                                : idx === 1
                                ? isDark ? 'bg-white/10 border-white/20 font-bold' : 'bg-slate-100 border-slate-300 font-bold'
                                : idx === 2
                                ? isDark ? 'bg-amber-900/20 border-amber-800/40 font-bold' : 'bg-amber-100/60 border-amber-200 font-bold'
                                : isDark ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-white/80 border-slate-200 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate pr-2">
                              <MetallicRankMedal rank={idx + 1} />
                              <span className="font-heading font-black truncate max-w-[130px] sm:max-w-[200px]">
                                {formatStudentDisplayName(entry)}
                              </span>
                              {entry.book && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${
                                  isDark ? 'bg-white/10 border-white/15 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'
                                }`}>
                                  B{entry.book}
                                </span>
                              )}
                            </div>
                            <div className="font-mono font-black text-right shrink-0 text-sky-400">
                              {entry.score}
                              <span className="text-[10px] font-normal text-slate-400 ml-1">
                                {activeTrackObj.unit}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              }

              // ── 2. 金幣之王神殿 (Coin Sanctum) ──
              if (activeSanctum === 'coin_king') {
                const list = (boardData['monopoly'] || []).slice(0, 50);

                return (
                  <div className={`p-4 sm:p-6 rounded-3xl border backdrop-blur-xl shadow-2xl transition-all ${
                    isDark
                      ? 'bg-gradient-to-b from-amber-950/40 via-yellow-950/20 to-slate-950/90 border-amber-500/40'
                      : 'bg-gradient-to-b from-amber-50/90 via-yellow-50/70 to-white/95 border-amber-300'
                  }`}>
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-amber-400/30">
                      <Coins className="w-5 h-5 text-amber-400" />
                      <h3 className="font-heading font-black text-sm sm:text-base text-amber-400">
                        全校金幣富豪榜 • 前 50 名
                      </h3>
                    </div>

                    <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
                      {list.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 font-bold text-xs flex flex-col items-center gap-2">
                          <Coins className="w-8 h-8 text-slate-500" />
                          <span>尚無金幣記錄</span>
                        </div>
                      ) : (
                        list.map((entry, idx) => (
                          <div
                            key={entry.student_id || idx}
                            className={`flex items-center justify-between p-2.5 rounded-2xl text-xs sm:text-sm border transition-colors ${
                              idx === 0
                                ? 'bg-amber-400/20 border-amber-400/60 font-black'
                                : idx === 1
                                ? isDark ? 'bg-white/10 border-white/20 font-bold' : 'bg-slate-100 border-slate-300 font-bold'
                                : idx === 2
                                ? isDark ? 'bg-amber-900/20 border-amber-800/40 font-bold' : 'bg-amber-100/60 border-amber-200 font-bold'
                                : isDark ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-white/80 border-slate-200 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate pr-2">
                              <MetallicRankMedal rank={idx + 1} />
                              <span className="font-heading font-black truncate max-w-[130px] sm:max-w-[200px]">
                                {formatStudentDisplayName(entry)}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {formatStudentBadge(entry, lang)}
                              </span>
                            </div>
                            <div className="font-mono font-black text-right shrink-0 text-amber-400 flex items-center gap-1">
                              <Coins className="w-3.5 h-3.5" />
                              <span>{entry.coins ?? 0}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              }

              // ── 3. 積分之王神殿 (Quest Sanctum) ──
              if (activeSanctum === 'point_king') {
                const list = (boardData['town_quest'] || []).slice(0, 50);

                return (
                  <div className={`p-4 sm:p-6 rounded-3xl border backdrop-blur-xl shadow-2xl transition-all ${
                    isDark
                      ? 'bg-gradient-to-b from-emerald-950/40 via-teal-950/20 to-slate-950/90 border-emerald-500/40'
                      : 'bg-gradient-to-b from-emerald-50/90 via-teal-50/70 to-white/95 border-emerald-300'
                  }`}>
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-emerald-400/30">
                      <Compass className="w-5 h-5 text-emerald-400" />
                      <h3 className="font-heading font-black text-sm sm:text-base text-emerald-400">
                        霧臺家園探索歷險積分 • 前 50 名
                      </h3>
                    </div>

                    <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
                      {list.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 font-bold text-xs flex flex-col items-center gap-2">
                          <Compass className="w-8 h-8 text-slate-500" />
                          <span>尚無家園探索記錄</span>
                        </div>
                      ) : (
                        list.map((entry, idx) => (
                          <div
                            key={entry.student_id || idx}
                            className={`flex items-center justify-between p-2.5 rounded-2xl text-xs sm:text-sm border transition-colors ${
                              idx === 0
                                ? 'bg-emerald-400/20 border-emerald-400/60 font-black'
                                : idx === 1
                                ? isDark ? 'bg-white/10 border-white/20 font-bold' : 'bg-slate-100 border-slate-300 font-bold'
                                : idx === 2
                                ? isDark ? 'bg-emerald-900/20 border-emerald-800/40 font-bold' : 'bg-emerald-100/60 border-emerald-200 font-bold'
                                : isDark ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-white/80 border-slate-200 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate pr-2">
                              <MetallicRankMedal rank={idx + 1} />
                              <span className="font-heading font-black truncate max-w-[130px] sm:max-w-[200px]">
                                {formatStudentDisplayName(entry)}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {formatStudentBadge(entry, lang)}
                              </span>
                            </div>
                            <div className="font-mono font-black text-right shrink-0 text-emerald-400 flex items-center gap-1">
                              <Compass className="w-3.5 h-3.5" />
                              <span>{entry.quest_points ?? 0}</span>
                              <span className="text-[10px] font-normal text-slate-400">分</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              }

              // ── 4. 遊戲之王神殿 (Game Sanctum - 100% 遵照 Lobby.jsx 單字館分類) ──
              const curCategory = GAME_KING_CATEGORIES.find(c => c.id === activeGameCategory) || GAME_KING_CATEGORIES[0];
              const curGame = curCategory.games.find(g => g.id === activeGameId) || curCategory.games[0];
              const list = (boardData[curGame.id] || []).slice(0, 50);

              return (
                <div className={`p-4 sm:p-6 rounded-3xl border backdrop-blur-xl shadow-2xl transition-all ${
                  isDark
                    ? 'bg-gradient-to-b from-purple-950/40 via-fuchsia-950/20 to-slate-950/90 border-purple-500/40'
                    : 'bg-gradient-to-b from-purple-50/90 via-fuchsia-50/70 to-white/95 border-purple-300'
                }`}>
                  {/* 四大領域切換膠囊 (探索解謎、極速反應、經典測驗、多人連線) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    {GAME_KING_CATEGORIES.map(cat => {
                      const isCatSelected = activeGameCategory === cat.id;
                      const CatIcon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            soundEngine.click();
                            setActiveGameCategory(cat.id);
                            setActiveGameId(cat.games[0].id);
                          }}
                          className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                            isCatSelected
                              ? cat.activeClass
                              : isDark
                              ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                              : 'bg-white/60 border-slate-200 text-slate-700 hover:bg-white'
                          }`}
                        >
                          <CatIcon className="w-4 h-4 shrink-0" />
                          <span className="text-xs font-black truncate">{cat.title}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* 領域內小遊戲橫向膠囊 */}
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-2 mb-3">
                    {curCategory.games.map(g => {
                      const isGameSelected = curGame.id === g.id;
                      const GIcon = g.icon;
                      return (
                        <button
                          key={g.id}
                          onClick={() => {
                            soundEngine.click();
                            setActiveGameId(g.id);
                          }}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                            isGameSelected
                              ? 'bg-white dark:bg-slate-800 text-purple-400 border-purple-400 shadow-md ring-1 ring-purple-400/50'
                              : isDark
                              ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                              : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <GIcon className="w-3.5 h-3.5" />
                          <span>{g.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* 遊戲榜單 Top 50 清單 */}
                  <div className="space-y-1.5 max-h-[55vh] overflow-y-auto pr-1">
                    {list.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 font-bold text-xs flex flex-col items-center gap-2">
                        <Rocket className="w-8 h-8 text-slate-500" />
                        <span>本年級尚無 {curGame.name} 成績記錄</span>
                      </div>
                    ) : (
                      list.map((entry, idx) => (
                        <div
                          key={entry.id || entry.student_id || idx}
                          className={`flex items-center justify-between p-2.5 rounded-2xl text-xs sm:text-sm border transition-colors ${
                            idx === 0
                              ? 'bg-purple-400/20 border-purple-400/60 font-black'
                              : idx === 1
                              ? isDark ? 'bg-white/10 border-white/20 font-bold' : 'bg-slate-100 border-slate-300 font-bold'
                              : idx === 2
                              ? isDark ? 'bg-purple-900/20 border-purple-800/40 font-bold' : 'bg-purple-100/60 border-purple-200 font-bold'
                              : isDark ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-white/80 border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate pr-2">
                            <MetallicRankMedal rank={idx + 1} />
                            <span className="font-heading font-black truncate max-w-[130px] sm:max-w-[200px]">
                              {formatStudentDisplayName(entry)}
                            </span>
                            {entry.book && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${
                                isDark ? 'bg-white/10 border-white/15 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'
                              }`}>
                                B{entry.book}
                              </span>
                            )}
                          </div>
                          <div className="font-mono font-black text-right shrink-0 text-purple-400">
                            {curGame.id === 'escape' || curGame.id === 'spotter'
                              ? (entry.time > 1000 ? (entry.time / 1000).toFixed(1) : (entry.time ?? entry.score))
                              : entry.score}
                            <span className="text-[10px] font-normal text-slate-400 ml-1">
                              {curGame.unit}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardView;
