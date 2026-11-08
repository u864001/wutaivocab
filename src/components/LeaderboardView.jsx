import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  X, Maximize2
} from 'lucide-react';

// ── 年級分流設定 (保留 '一年級' 等標準文字供全自動測試點擊) ──
export const GRADE_LEADERBOARD_TABS = [
  { id: '01', zh: '一年級', en: 'Grade 1', books: ['g1', 'abc', '1'], isAlphabet: true },
  { id: '02', zh: '二年級', en: 'Grade 2', books: ['g2', 'abc', '2'], isAlphabet: true },
  { id: '03', zh: '三年級', en: 'Grade 3', books: ['1', '2'] },
  { id: '04', zh: '四年級', en: 'Grade 4', books: ['3', '4'] },
  { id: '05', zh: '五年級', en: 'Grade 5', books: ['5', '6'] },
  { id: '06', zh: '六年級', en: 'Grade 6', books: ['7', '8', '9'] },
  { id: 'all', zh: '全校大亂鬥', en: 'All School', books: null, isAllSchool: true }
];

// ── 大武山四聯屏風畫四大天王定義 (高階生成繪圖、領域色調與排版) ──
export const FOUR_CHAMPION_PANELS = [
  {
    id: 'exam_king',
    title: '測驗之王',
    enTitle: 'EXAM KING',
    realm: '破曉藍調 • 官方檢定',
    bgImage: '/assets/leaderboard/polyptych_exam.jpg',
    icon: Crown,
    colorName: 'sky',
    titleGlow: 'bg-gradient-to-b from-sky-100 via-sky-200 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] drop-shadow-[0_0_16px_rgba(56,189,248,0.8)]',
    spineTextColor: 'text-sky-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]',
    borderClass: 'border-sky-500/60 hover:border-sky-400',
    activeRingClass: 'ring-sky-400/80 border-sky-300',
    plaqueBg: 'bg-sky-950/85 border-sky-400/50 shadow-sky-950/60'
  },
  {
    id: 'coin_king',
    title: '金幣之王',
    enTitle: 'COIN KING',
    realm: '朝陽暖金 • 總資產財富',
    bgImage: '/assets/leaderboard/polyptych_coin.jpg',
    icon: Coins,
    colorName: 'amber',
    titleGlow: 'bg-gradient-to-b from-yellow-100 via-amber-300 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] drop-shadow-[0_0_18px_rgba(245,158,11,0.8)]',
    spineTextColor: 'text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]',
    borderClass: 'border-amber-500/60 hover:border-amber-400',
    activeRingClass: 'ring-amber-400/80 border-amber-300',
    plaqueBg: 'bg-amber-950/85 border-amber-400/50 shadow-amber-950/60'
  },
  {
    id: 'point_king',
    title: '積分之王',
    enTitle: 'QUEST KING',
    realm: '林谷翡翠 • 家園探索歷險',
    bgImage: '/assets/leaderboard/polyptych_quest.jpg',
    icon: Compass,
    colorName: 'emerald',
    titleGlow: 'bg-gradient-to-b from-emerald-100 via-emerald-200 to-teal-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] drop-shadow-[0_0_16px_rgba(16,185,129,0.8)]',
    spineTextColor: 'text-emerald-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]',
    borderClass: 'border-emerald-500/60 hover:border-emerald-400',
    activeRingClass: 'ring-emerald-400/80 border-emerald-300',
    plaqueBg: 'bg-emerald-950/85 border-emerald-400/50 shadow-emerald-950/60'
  },
  {
    id: 'game_king',
    title: '遊戲之王',
    enTitle: 'GAME KING',
    realm: '暮色紫霞 • 單字館小遊戲',
    bgImage: '/assets/leaderboard/polyptych_game.jpg',
    icon: Rocket,
    colorName: 'purple',
    titleGlow: 'bg-gradient-to-b from-white via-purple-200 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] drop-shadow-[0_0_18px_rgba(217,70,239,0.8)]',
    spineTextColor: 'text-purple-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]',
    borderClass: 'border-purple-500/60 hover:border-purple-400',
    activeRingClass: 'ring-purple-400/80 border-purple-300',
    plaqueBg: 'bg-purple-950/85 border-purple-400/50 shadow-purple-950/60'
  }
];

export const FOUR_CHAMPION_TABS = FOUR_CHAMPION_PANELS.map(p => ({
  id: p.id,
  zh: p.title,
  en: p.enTitle,
  realm: p.realm,
  icon: p.icon
}));

export const DOMAIN_CATEGORIES = FOUR_CHAMPION_TABS;

// ── 測驗之王四大子軌道 (嚴格對齊原測驗館色彩與官方規範) ──
export const EXAM_KING_SUBTRACKS = [
  {
    id: 'prea1_mastery',
    label: 'Pre-A1 官方精熟',
    subLabel: '劍橋 300 題動態精熟',
    icon: Award,
    unit: '題精熟',
    badgeColor: 'border-sky-400 text-sky-300 bg-sky-500/20 ring-sky-400/50',
    modeKeys: ['prea1-mastery']
  },
  {
    id: 'saa_mastery',
    label: 'SAA 學力成就',
    subLabel: '教育部學力評量 285 題',
    icon: CheckCircle2,
    unit: '題精熟',
    badgeColor: 'border-emerald-400 text-emerald-300 bg-emerald-500/20 ring-emerald-400/50',
    modeKeys: ['saa-mastery', 'mcq-saa']
  },
  {
    id: 'mcq_king',
    label: '課本單元檢定',
    subLabel: '1,289 題單元實戰',
    icon: Crown,
    unit: '分',
    badgeColor: 'border-amber-400 text-amber-300 bg-amber-500/20 ring-amber-400/50',
    modeKeys: ['mcq-king', 'mcq-diligent']
  },
  {
    id: 'speaking_lab',
    label: '雙語口說評測',
    subLabel: 'AI 朗讀跟讀與發音評測',
    icon: Mic,
    unit: '題',
    badgeColor: 'border-rose-400 text-rose-300 bg-rose-500/20 ring-rose-400/50',
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
    activeClass: 'ring-2 ring-teal-400 border-teal-300 bg-teal-500/30 text-white',
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
    activeClass: 'ring-2 ring-amber-400 border-amber-300 bg-amber-500/30 text-white',
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
    activeClass: 'ring-2 ring-sky-400 border-sky-300 bg-sky-500/30 text-white',
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
    activeClass: 'ring-2 ring-purple-400 border-purple-300 bg-purple-500/30 text-white',
    games: [
      { id: 'battle', name: '即時多人連線', icon: Swords, unit: '勝', modeKeys: ['battle-wins'] }
    ]
  }
];

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
const MetallicRankMedal = ({ rank, size = 'sm' }) => {
  const sizeClass = size === 'xs' ? 'w-4 h-4 text-[10px]' : 'w-5 h-5 text-xs';
  if (rank === 1) {
    return (
      <span className={`${sizeClass} rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 text-amber-950 ring-1 ring-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.6)] font-black font-mono flex items-center justify-center shrink-0`}>
        1
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className={`${sizeClass} rounded-full bg-gradient-to-br from-slate-100 via-slate-300 to-slate-400 text-slate-900 ring-1 ring-slate-200 shadow-[0_0_6px_rgba(226,232,240,0.5)] font-black font-mono flex items-center justify-center shrink-0`}>
        2
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className={`${sizeClass} rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-yellow-900 text-amber-100 ring-1 ring-amber-500 shadow-[0_0_6px_rgba(217,119,6,0.4)] font-black font-mono flex items-center justify-center shrink-0`}>
        3
      </span>
    );
  }
  return (
    <span className={`${sizeClass} rounded-full bg-white/10 dark:bg-slate-800 text-slate-300 border border-white/15 font-bold font-mono flex items-center justify-center shrink-0`}>
      {rank}
    </span>
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

  // 手風琴主狀態：null (四屏風並列) | 'exam_king' | 'coin_king' | 'point_king' | 'game_king'
  const [activeCol, setActiveCol] = useState(null);

  // 測驗之王神殿內選中子軌道
  const [activeExamSubtrack, setActiveExamSubtrack] = useState('prea1_mastery');

  // 遊戲之王神殿內選中分類與遊戲
  const [activeGameCategory, setActiveGameCategory] = useState('explore');
  const [activeGameId, setActiveGameId] = useState('escape');

  const [boardData, setBoardData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // 隱藏管理後台彩蛋 (連續點擊 5 次)
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

    const examSource = (boardData['prea1_mastery']?.length > 0)
      ? boardData['prea1_mastery']
      : (boardData['mcq_king']?.length > 0)
      ? boardData['mcq_king']
      : (boardData['saa_mastery'] || []);

    const coinSource = boardData['monopoly'] || [];
    const pointSource = boardData['town_quest'] || [];

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

    ['prea1_mastery', 'saa_mastery', 'mcq_king', 'speaking_lab'].forEach(id => {
      trackRank(boardData[id], 'exam');
    });
    trackRank(boardData['monopoly'], 'coin');
    trackRank(boardData['town_quest'], 'point');
    ['escape', 'spotter', 'maze', 'mole', 'swipe', 'meteor', 'snake', 'battle'].forEach(id => {
      trackRank(boardData[id], 'game');
    });

    const students = Array.from(studentMap.values()).map(s => {
      const avgRank = (s.ranks.exam + s.ranks.coin + s.ranks.point + s.ranks.game) / 4;
      return { ...s, avgRank };
    });

    students.sort((a, b) => {
      if (b.activeCount !== a.activeCount) return b.activeCount - a.activeCount;
      return a.avgRank - b.avgRank;
    });

    return students.slice(0, 3);
  }, [boardData, isPastWeek, lang]);

  // 背景桌布：深層透光，絕不刷白
  const currentWallpaper = useMemo(() => {
    if (activeCol === 'coin_king') return '/assets/lobby/theme_town.jpg';
    if (activeCol === 'point_king') return '/assets/lobby/theme_explore.jpg';
    if (activeCol === 'game_king') return '/assets/lobby/theme_speed.jpg';
    return '/assets/lobby/theme_quiz.jpg';
  }, [activeCol]);

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
    <div className={`fixed inset-0 w-full h-[100dvh] flex flex-col justify-between overflow-hidden select-none z-10 animate-fadeIn font-sans transition-colors duration-500 ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-900 text-slate-100'
    }`}>
      {/* ── 專屬高階背景層 (透光率提升，保留大武山巒大氣質感) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <img
          key={currentWallpaper}
          src={currentWallpaper}
          alt="Wallpaper"
          className="w-full h-full object-cover object-center scale-105 brightness-[0.65] contrast-[1.15] transition-all duration-700 ease-out"
        />
        {/* 輕量級暗角與頂部防眩光漸層 (大幅減淡，讓背景圖透出) */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/20 to-slate-950/85 pointer-events-none" />
      </div>

      {/* ════════════════════════════════════════════════════════════════
          【極簡單行整合式 HUD 頂部工具列】高密度、零浪費空間
         ════════════════════════════════════════════════════════════════ */}
      <header className={`relative z-30 w-full px-2 sm:px-4 py-1 sm:py-1.5 backdrop-blur-md border-b flex items-center justify-between shadow-xl shrink-0 gap-1.5 sm:gap-2 transition-colors ${
        isDark ? 'bg-slate-950/80 border-white/10' : 'bg-slate-900/85 border-white/15'
      }`}>
        {/* 左側：回大廳 ＋ 週次純箭頭步進器 */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-black flex items-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer"
            title="返回英語大廳"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">回大廳</span>
          </button>

          {/* 週次純箭頭步進器 [ ◀ 第 10 週 ▶ ] */}
          <div className="flex items-center gap-0.5 bg-black/40 border border-white/15 rounded-xl px-1 py-0.5 shadow-inner">
            <button
              type="button"
              onClick={handlePrevWeek}
              disabled={selectedWeek <= 1}
              className={`p-1 rounded-lg transition-all ${
                selectedWeek <= 1
                  ? 'opacity-25 cursor-not-allowed text-slate-500'
                  : 'text-slate-300 hover:text-white hover:bg-white/15 active:scale-95 cursor-pointer'
              }`}
              title="上一週"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono font-black text-xs text-amber-300 whitespace-nowrap">
              第{selectedWeek}週
            </span>
            <button
              type="button"
              onClick={handleNextWeek}
              disabled={selectedWeek >= currentWeek}
              className={`p-1 rounded-lg transition-all ${
                selectedWeek >= currentWeek
                  ? 'opacity-25 cursor-not-allowed text-slate-500'
                  : 'text-slate-300 hover:text-white hover:bg-white/15 active:scale-95 cursor-pointer'
              }`}
              title="下一週"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 中央：極簡年級分流膠囊 (保留 '一年級' 等標準文字供測試點擊) */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 px-1 bg-black/30 border border-white/10 rounded-2xl max-w-full">
          {GRADE_LEADERBOARD_TABS.map((tab) => {
            const isSelected = selectedGrade === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundEngine.click();
                  setSelectedGrade(tab.id);
                }}
                className={`px-2 py-1 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md border border-emerald-300 ring-1 ring-emerald-400/50 scale-[1.03]'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.zh}
              </button>
            );
          })}
        </div>

        {/* 右側：全能至尊微縮銘牌 ＋ 系統控制項 */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* 四王綜合全能至尊微縮晶片 (零混亂分數，純名次與姓名) */}
          <div
            onClick={handleTitleClick}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-black cursor-pointer shadow-sm select-none"
            title="全能至尊殿堂 • 5 次啟動管理後台"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[11px] text-amber-300 tracking-wide">至尊:</span>
            {grandMasterTopThree.length === 0 ? (
              <span className="text-slate-400 font-normal">虛位以待</span>
            ) : (
              grandMasterTopThree.map((s, idx) => (
                <span key={s.name} className="flex items-center gap-1 truncate max-w-[85px]">
                  <MetallicRankMedal rank={idx + 1} size="xs" />
                  <span className="truncate">{s.name}</span>
                </span>
              ))
            )}
          </div>

          {/* 重新整理 */}
          <button
            type="button"
            onClick={() => loadGradeBoards(true)}
            disabled={isLoading}
            className="p-1 sm:p-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="重新整理榜單"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* 聲音 */}
          <button
            type="button"
            onClick={() => {
              const m = soundEngine.toggleMute();
              setIsMuted(m);
            }}
            className="p-1 sm:p-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            title={isMuted ? '開啟音效' : '靜音'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {/* 日夜 */}
          <button
            type="button"
            onClick={() => {
              soundEngine.click();
              toggleTheme();
            }}
            className="p-1 sm:p-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="日夜主題"
          >
            {isDark ? <Moon className="w-3.5 h-3.5 text-cyan-300" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          {/* 學生身分 */}
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => {
                soundEngine.click();
                if (openModal) openModal();
              }}
              className="px-2 py-1 rounded-xl bg-slate-900/90 border border-emerald-400/40 text-white text-xs font-black flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
              title="個人探險通行證"
            >
              {currentStudent?.avatar_id ? (
                <img
                  src={`/assets/avatars/${currentStudent.avatar_id}.webp`}
                  alt="Avatar"
                  className="w-4 h-4 rounded-full object-cover border border-amber-400 shrink-0"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <User className="w-3 h-3 text-emerald-400 shrink-0" />
              )}
              <span className="hidden md:inline truncate max-w-[70px]">
                {formatStudentBadge(currentStudent, lang)}
              </span>
              <span className="text-amber-400 font-mono flex items-center gap-0.5 text-[11px]">
                <Coins className="w-3 h-3 shrink-0" />
                {currentStudent?.coins ?? 0}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                soundEngine.click();
                if (openModal) openModal();
              }}
              className="px-2 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-black flex items-center gap-1 shadow-md active:scale-95 cursor-pointer"
            >
              <User className="w-3 h-3" />
              <span className="hidden sm:inline">登入</span>
            </button>
          )}
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════
          【中央主舞台：大武山四聯手風琴屏風長卷】(佔據 90% 畫面，震撼大氣)
         ════════════════════════════════════════════════════════════════ */}
      <main className="relative z-20 flex-1 w-full max-w-[1500px] mx-auto p-2 sm:p-3 md:p-3.5 flex flex-col justify-center overflow-hidden">
        <div className="w-full h-full flex flex-col md:flex-row items-stretch gap-2 sm:gap-2.5 md:gap-3 overflow-hidden">
          {FOUR_CHAMPION_PANELS.map((panel) => {
            const isSelected = activeCol === panel.id;
            const isCompressed = activeCol !== null && !isSelected;
            const Icon = panel.icon;
            const previews = previewTopThree[panel.id] || [];

            // 手風琴動態比例：展開 6.5，壓縮 0.75，常態等寬 1
            const flexStyle = {
              flex: isSelected ? (window.innerWidth >= 768 ? 6.5 : 5.5) : isCompressed ? 0.75 : 1
            };

            return (
              <div
                key={panel.id}
                style={flexStyle}
                onClick={() => {
                  if (!isSelected) {
                    soundEngine.click();
                    setActiveCol(panel.id);
                  }
                }}
                className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col cursor-pointer group shadow-2xl ${
                  isSelected
                    ? `${panel.activeRingClass} ring-4 shadow-[0_0_35px_rgba(0,0,0,0.8)]`
                    : isCompressed
                    ? 'border-white/10 hover:border-white/30 opacity-75 hover:opacity-100'
                    : `${panel.borderClass} hover:scale-[1.01]`
                }`}
              >
                {/* ── 高階繪圖大武山屏風背景圖層 (Banana 頂級藝術原畫) ── */}
                <img
                  src={panel.bgImage}
                  alt={panel.title}
                  className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out select-none pointer-events-none ${
                    isSelected
                      ? 'brightness-[0.55] contrast-[1.1]'
                      : isCompressed
                      ? 'brightness-[0.35] contrast-[1.15]'
                      : 'brightness-[0.80] contrast-[1.1] group-hover:brightness-[0.92] group-hover:scale-105'
                  }`}
                />

                {/* 柔和暗角層 */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/20 to-slate-950/30 pointer-events-none" />

                {/* ── 狀態一：壓縮收折柱 (Vertical Calligraphy Spine) ── */}
                {isCompressed ? (
                  <div className="relative z-10 w-full h-full flex md:flex-col items-center justify-between p-2 sm:p-2.5 text-center animate-fadeIn select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1" />
                    <div className="flex md:flex-col items-center justify-center gap-1.5 sm:gap-2 my-auto select-none">
                      {panel.title.split('').map((char, cIdx) => (
                        <span
                          key={cIdx}
                          className={`text-sm sm:text-base font-black font-serif ${panel.spineTextColor} tracking-widest`}
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white animate-pulse mb-1" />
                  </div>
                ) : !isSelected ? (
                  /* ── 狀態二：未展開常態屏風 (展示宏偉原畫 ＋ 前三名預覽) ── */
                  <div className="relative z-10 w-full h-full p-3 sm:p-4 md:p-5 flex flex-col justify-between overflow-hidden animate-fadeIn select-none">
                    {/* 頂部標題 */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-9 h-9 rounded-2xl bg-black/50 border border-white/20 flex items-center justify-center text-white shadow-md">
                          <Icon className="w-5 h-5 text-amber-400" />
                        </div>
                        <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full border bg-black/40 border-white/20 text-amber-300">
                          TOP 50
                        </span>
                      </div>
                      <h3 className={`font-serif font-black text-lg sm:text-xl md:text-2xl tracking-wide ${panel.titleGlow}`}>
                        {panel.title}
                      </h3>
                      <p className="text-[11px] text-slate-300 line-clamp-1 font-bold">
                        {panel.realm}
                      </p>
                    </div>

                    {/* 中央：前三名榮譽預覽 (零混亂分數，純金屬徽章 + 姓名) */}
                    <div className="my-auto py-3 space-y-1.5">
                      {previews.length === 0 ? (
                        <div className="py-4 text-center text-xs font-bold text-slate-400 flex flex-col items-center gap-1">
                          <Sparkles className="w-4 h-4 text-slate-500" />
                          <span>尚無登榜記錄</span>
                        </div>
                      ) : (
                        previews.map((entry, rIdx) => (
                          <div
                            key={entry.name + rIdx}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-black border transition-colors ${
                              rIdx === 0
                                ? 'bg-amber-400/20 border-amber-400/50 text-amber-200'
                                : rIdx === 1
                                ? 'bg-white/10 border-white/15 text-slate-200'
                                : 'bg-amber-900/20 border-amber-800/40 text-amber-200'
                            }`}
                          >
                            <MetallicRankMedal rank={rIdx + 1} size="sm" />
                            <span className="truncate flex-1">{entry.name}</span>
                          </div>
                        ))
                      )}
                    </div>

                    {/* 底部展開按鈕 */}
                    <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs font-black text-slate-300 group-hover:text-white transition-colors">
                      <span>點擊展開完整神殿</span>
                      <Maximize2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                ) : (
                  /* ── 狀態三：手風琴展開神殿 (Flex: 6.5，展示完整 Top 50 榜單) ── */
                  <div className="relative z-10 w-full h-full p-3 sm:p-4 md:p-5 flex flex-col justify-between overflow-hidden animate-fadeIn select-none">
                    {/* 展開頂部銘牌 ＋ 關閉還原按鈕 */}
                    <div className={`px-3 py-2 rounded-2xl backdrop-blur-md border shadow-lg flex items-center justify-between shrink-0 mb-3 ${panel.plaqueBg}`}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-amber-400 shrink-0" />
                        <div>
                          <h3 className={`text-base sm:text-lg font-black font-serif tracking-wider ${panel.titleGlow}`}>
                            {panel.title}
                          </h3>
                          <span className="text-[10px] font-mono tracking-widest text-white/70 uppercase">
                            {panel.enTitle} • {panel.realm}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundEngine.click();
                          setActiveCol(null);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs font-black border border-white/20 transition-all cursor-pointer flex items-center gap-1 active:scale-95 shrink-0"
                        title="還原四聯全景"
                      >
                        <X className="w-3.5 h-3.5 text-amber-400" />
                        <span>還原全景</span>
                      </button>
                    </div>

                    {/* 展開神殿內容 (依王別渲染子榜與 Top 50 列表) */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                      {/* 1. 測驗之王：四大子榜切換 (Pre-A1 / SAA / 課本 / 口說) */}
                      {panel.id === 'exam_king' && (
                        <div className="flex-1 flex flex-col overflow-hidden">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-2.5 shrink-0">
                            {EXAM_KING_SUBTRACKS.map(track => {
                              const isSubActive = activeExamSubtrack === track.id;
                              const SubIcon = track.icon;
                              return (
                                <button
                                  key={track.id}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    soundEngine.click();
                                    setActiveExamSubtrack(track.id);
                                  }}
                                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-1.5 ${
                                    isSubActive
                                      ? `ring-2 ${track.badgeColor} font-black scale-[1.02] shadow-md`
                                      : 'bg-black/40 border-white/10 text-slate-300 hover:bg-black/60'
                                  }`}
                                >
                                  <SubIcon className="w-4 h-4 shrink-0" />
                                  <div className="truncate">
                                    <div className="text-xs font-black truncate">{track.label}</div>
                                    <div className="text-[9px] text-slate-400 truncate">{track.subLabel}</div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {/* 測驗王 Top 50 清單 */}
                          {(() => {
                            const curTrack = EXAM_KING_SUBTRACKS.find(t => t.id === activeExamSubtrack) || EXAM_KING_SUBTRACKS[0];
                            const list = (boardData[curTrack.id] || []).slice(0, 50);
                            return (
                              <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                                {list.length === 0 ? (
                                  <div className="py-10 text-center text-slate-400 font-bold text-xs">
                                    本年級尚無 {curTrack.label} 登榜記錄
                                  </div>
                                ) : (
                                  list.map((entry, idx) => (
                                    <div
                                      key={entry.id || entry.student_id || idx}
                                      className={`flex items-center justify-between p-2 rounded-xl text-xs sm:text-sm border transition-colors ${
                                        idx === 0
                                          ? 'bg-amber-400/25 border-amber-400/60 font-black'
                                          : idx === 1
                                          ? 'bg-white/10 border-white/20 font-bold'
                                          : idx === 2
                                          ? 'bg-amber-900/25 border-amber-800/40 font-bold'
                                          : 'bg-black/35 border-white/10 text-slate-200'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 truncate pr-2">
                                        <MetallicRankMedal rank={idx + 1} size="sm" />
                                        <span className="font-heading font-black truncate max-w-[140px] sm:max-w-[220px]">
                                          {formatStudentDisplayName(entry)}
                                        </span>
                                        {entry.book && (
                                          <span className="text-[9px] px-1.5 py-0.2 rounded border bg-white/10 border-white/15 text-slate-300 font-mono">
                                            B{entry.book}
                                          </span>
                                        )}
                                      </div>
                                      <div className="font-mono font-black text-right shrink-0 text-sky-300">
                                        {entry.score}
                                        <span className="text-[10px] font-normal text-slate-400 ml-1">
                                          {curTrack.unit}
                                        </span>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {/* 2. 金幣之王：全校金幣富豪 Top 50 */}
                      {panel.id === 'coin_king' && (
                        <div className="flex-1 overflow-hidden flex flex-col">
                          <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                            {((boardData['monopoly'] || []).slice(0, 50)).map((entry, idx) => (
                              <div
                                key={entry.student_id || idx}
                                className={`flex items-center justify-between p-2 rounded-xl text-xs sm:text-sm border transition-colors ${
                                  idx === 0
                                    ? 'bg-amber-400/25 border-amber-400/60 font-black'
                                    : idx === 1
                                    ? 'bg-white/10 border-white/20 font-bold'
                                    : idx === 2
                                    ? 'bg-amber-900/25 border-amber-800/40 font-bold'
                                    : 'bg-black/35 border-white/10 text-slate-200'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate pr-2">
                                  <MetallicRankMedal rank={idx + 1} size="sm" />
                                  <span className="font-heading font-black truncate max-w-[140px] sm:max-w-[220px]">
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
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3. 積分之王：家園探索歷險 Top 50 */}
                      {panel.id === 'point_king' && (
                        <div className="flex-1 overflow-hidden flex flex-col">
                          <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                            {((boardData['town_quest'] || []).slice(0, 50)).map((entry, idx) => (
                              <div
                                key={entry.student_id || idx}
                                className={`flex items-center justify-between p-2 rounded-xl text-xs sm:text-sm border transition-colors ${
                                  idx === 0
                                    ? 'bg-emerald-400/25 border-emerald-400/60 font-black'
                                    : idx === 1
                                    ? 'bg-white/10 border-white/20 font-bold'
                                    : idx === 2
                                    ? 'bg-emerald-900/25 border-emerald-800/40 font-bold'
                                    : 'bg-black/35 border-white/10 text-slate-200'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate pr-2">
                                  <MetallicRankMedal rank={idx + 1} size="sm" />
                                  <span className="font-heading font-black truncate max-w-[140px] sm:max-w-[220px]">
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
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 4. 遊戲之王：四大分類 (探索解謎、極速反應、經典測驗、多人連線) ＋ 遊戲 Top 50 */}
                      {panel.id === 'game_king' && (
                        <div className="flex-1 flex flex-col overflow-hidden">
                          {/* 四大領域切換膠囊 */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-2 shrink-0">
                            {GAME_KING_CATEGORIES.map(cat => {
                              const isCatActive = activeGameCategory === cat.id;
                              const CatIcon = cat.icon;
                              return (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    soundEngine.click();
                                    setActiveGameCategory(cat.id);
                                    setActiveGameId(cat.games[0].id);
                                  }}
                                  className={`p-1.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-1.5 ${
                                    isCatActive ? cat.activeClass : 'bg-black/40 border-white/10 text-slate-300 hover:bg-black/60'
                                  }`}
                                >
                                  <CatIcon className="w-3.5 h-3.5 shrink-0" />
                                  <span className="text-xs font-black truncate">{cat.title}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* 領域內小遊戲橫向膠囊 */}
                          {(() => {
                            const curCat = GAME_KING_CATEGORIES.find(c => c.id === activeGameCategory) || GAME_KING_CATEGORIES[0];
                            const curGame = curCat.games.find(g => g.id === activeGameId) || curCat.games[0];
                            const list = (boardData[curGame.id] || []).slice(0, 50);

                            return (
                              <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1.5 mb-1.5 shrink-0">
                                  {curCat.games.map(g => {
                                    const isGameActive = curGame.id === g.id;
                                    const GIcon = g.icon;
                                    return (
                                      <button
                                        key={g.id}
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          soundEngine.click();
                                          setActiveGameId(g.id);
                                        }}
                                        className={`px-2.5 py-1 rounded-lg border text-xs font-black flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
                                          isGameActive
                                            ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                                            : 'bg-black/40 border-white/10 text-slate-300 hover:bg-black/60'
                                        }`}
                                      >
                                        <GIcon className="w-3 h-3" />
                                        <span>{g.name}</span>
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* 遊戲 Top 50 列表 */}
                                <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                                  {list.length === 0 ? (
                                    <div className="py-10 text-center text-slate-400 font-bold text-xs">
                                      本年級尚無 {curGame.name} 成績記錄
                                    </div>
                                  ) : (
                                    list.map((entry, idx) => (
                                      <div
                                        key={entry.id || entry.student_id || idx}
                                        className={`flex items-center justify-between p-2 rounded-xl text-xs sm:text-sm border transition-colors ${
                                          idx === 0
                                            ? 'bg-purple-500/25 border-purple-400/60 font-black'
                                            : idx === 1
                                            ? 'bg-white/10 border-white/20 font-bold'
                                            : idx === 2
                                            ? 'bg-purple-900/25 border-purple-800/40 font-bold'
                                            : 'bg-black/35 border-white/10 text-slate-200'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2 truncate pr-2">
                                          <MetallicRankMedal rank={idx + 1} size="sm" />
                                          <span className="font-heading font-black truncate max-w-[140px] sm:max-w-[220px]">
                                            {formatStudentDisplayName(entry)}
                                          </span>
                                          {entry.book && (
                                            <span className="text-[9px] px-1.5 py-0.2 rounded border bg-white/10 border-white/15 text-slate-300 font-mono">
                                              B{entry.book}
                                            </span>
                                          )}
                                        </div>
                                        <div className="font-mono font-black text-right shrink-0 text-purple-300">
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
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default LeaderboardView;
