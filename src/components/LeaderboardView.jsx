import React, { useState, useEffect, useMemo } from 'react';
import { GlassCard } from './ui/GlassCard';
import { Button3D } from './ui/Button3D';
import { useI18n } from '../context/I18nContext';
import { useStudent } from '../context/StudentContext';
import {
  fetchLeaderboard,
  fetchMonopolyLeaderboard,
  fetchQuestPointsLeaderboard,
  getWeekNumber
} from '../services/supabase';
import { soundEngine } from '../services/audio';
import { useEasterEgg } from '../hooks/useEasterEgg';
import { pad2, formatStudentBadge } from '../utils/studentIdHelper';
import {
  Trophy, ArrowLeft, RotateCw, Medal, Calendar,
  BookOpen, Puzzle, Rocket, Sparkles, Keyboard,
  Swords, X, ChevronRight, Compass, Flame, Coins, Award,
  Users, Crown, Zap
} from 'lucide-react';

export const GRADE_LEADERBOARD_TABS = [
  { id: '01', zh: '一年級', en: 'Grade 1', books: ['1'], descZh: '字母啟蒙與初階單字 (第1冊)' },
  { id: '02', zh: '二年級', en: 'Grade 2', books: ['2'], descZh: '生活用語與日常單字 (第2冊)' },
  { id: '03', zh: '三年級', en: 'Grade 3', books: ['1', '2'], descZh: '第1~2冊綜合競賽' },
  { id: '04', zh: '四年級', en: 'Grade 4', books: ['3', '4'], descZh: '第3~4冊進階挑戰' },
  { id: '05', zh: '五年級', en: 'Grade 5', books: ['5', '6'], descZh: '第5~6冊高年級挑戰' },
  { id: '06', zh: '六年級', en: 'Grade 6', books: ['7', '8'], descZh: '第7~8冊畢業大會考' },
  { id: '00', zh: '全校財富榜', en: 'School Wealth', books: ['1','2','3','4','5','6','7','8'], descZh: '全校大富翁金幣與小鎮榮譽' }
];

export const CONSOLIDATED_GAME_MODES = [
  {
    id: 'swipe',
    label: '極速是非滑牌',
    icon: Flame,
    color: 'text-rose-500',
    unit: '分',
    modeKeys: ['swipe-vocab', 'swipe-abc'],
    subModes: [
      { key: 'swipe-vocab', label: '30秒單字' },
      { key: 'swipe-abc', label: '30秒字母' }
    ]
  },
  {
    id: 'maze',
    label: '字母巡航迷宮',
    icon: Compass,
    color: 'text-violet-500',
    unit: '秒',
    modeKeys: ['maze-upper', 'maze-lower', 'maze-master'],
    subModes: [
      { key: 'maze-upper', label: '大寫巡航' },
      { key: 'maze-lower', label: '小寫巡航' }
    ]
  },
  {
    id: 'snake',
    label: '叢林貪食蛇',
    icon: Sparkles,
    color: 'text-emerald-500',
    unit: '分',
    modeKeys: ['snake-normal', 'snake-survival', 'snake-easy'],
    subModes: [
      { key: 'snake-normal', label: '競速挑戰' },
      { key: 'snake-survival', label: '生存挑戰' },
      { key: 'snake-easy', label: '新手引導' }
    ]
  },
  {
    id: 'meteor',
    label: '隕石防衛戰',
    icon: Rocket,
    color: 'text-indigo-500',
    unit: '分',
    modeKeys: ['meteor-zh-en', 'meteor-en-zh', 'meteor-abc'],
    subModes: [
      { key: 'meteor-zh-en', label: '中選英' },
      { key: 'meteor-en-zh', label: '英選中' },
      { key: 'meteor-abc', label: 'ABC 防衛' }
    ]
  },
  {
    id: 'memory',
    label: '星際記憶翻牌',
    icon: Trophy,
    color: 'text-cyan-500',
    unit: '分',
    modeKeys: ['memory-single'],
    subModes: [{ key: 'memory-single', label: '標準翻牌' }]
  },
  {
    id: 'spelling',
    label: '拖曳拼字大師',
    icon: Puzzle,
    color: 'text-pink-500',
    unit: '分',
    modeKeys: ['spelling'],
    subModes: [{ key: 'spelling', label: '標準拼字' }]
  },
  {
    id: 'quiz',
    label: '四大經典測驗',
    icon: Keyboard,
    color: 'text-blue-500',
    unit: '分',
    modeKeys: ['quiz-zh-en', 'quiz-en-zh', 'quiz-listening', 'quiz-hard'],
    subModes: [
      { key: 'quiz-zh-en', label: '中選英' },
      { key: 'quiz-en-zh', label: '英選中' },
      { key: 'quiz-listening', label: '英語聽力' },
      { key: 'quiz-hard', label: '魔王綜合' }
    ]
  },
  {
    id: 'battle',
    label: '連線對戰之王',
    icon: Swords,
    color: 'text-amber-500',
    unit: '勝',
    modeKeys: ['battle-wins'],
    subModes: [{ key: 'battle-wins', label: '勝場累積' }]
  },
  {
    id: 'monopoly',
    label: '大富翁財富榜',
    icon: Coins,
    color: 'text-amber-400',
    unit: '金幣',
    isSpecial: 'monopoly',
    modeKeys: ['monopoly'],
    subModes: [{ key: 'monopoly', label: '金幣總資產' }]
  },
  {
    id: 'town-quest',
    label: '小鎮探索榮譽榜',
    icon: Award,
    color: 'text-indigo-400',
    unit: '積分',
    isSpecial: 'quest',
    modeKeys: ['town-quest'],
    subModes: [{ key: 'town-quest', label: '任務積分' }]
  }
];

export const LeaderboardView = ({ onBack, onOpenTeacherHub, words = [] }) => {
  const { t, lang } = useI18n();
  const { currentStudent } = useStudent();
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

    const books = activeGradeObj.books;

    await Promise.all(
      CONSOLIDATED_GAME_MODES.map(async (m) => {
        const CACHE_KEY = `lb_g2_${selectedWeek}_${selectedGrade}_${m.id}`;

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
            fetchedList = await fetchMonopolyLeaderboard(selectedGrade === '00' ? null : selectedGrade, 50);
          } else if (m.isSpecial === 'quest') {
            fetchedList = await fetchQuestPointsLeaderboard(selectedGrade === '00' ? null : selectedGrade, 50);
          } else {
            fetchedList = await fetchLeaderboard(selectedWeek, m.modeKeys, books, 50);
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

  const activeModalRanks = modalModeId ? (boardData[modalModeId] || []) : [];

  // 輔助函式：取得子模式或冊別標籤
  const getSubModeBadge = (row, modeObj) => {
    if (!row) return null;
    if (modeObj.isSpecial === 'monopoly') {
      return formatStudentBadge({ grade: row.grade, class: row.class, seat: row.seat }, lang);
    }
    if (modeObj.isSpecial === 'quest') {
      return formatStudentBadge({ grade: row.grade, class: row.class, seat: row.seat }, lang);
    }

    const sm = modeObj.subModes?.find(s => s.key === row.mode);
    const modeLabel = sm?.label || row.mode;
    const bookLabel = row.book ? `B${row.book}` : '';
    return [bookLabel, modeLabel].filter(Boolean).join(' • ');
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-6 animate-fadeIn pb-16">
      {/* ── 頂部導覽列 ── */}
      <div className="flex items-center justify-between mb-5">
        <Button3D variant="slate" size="sm" onClick={onBack} icon={ArrowLeft}>
          {t.backLobby || '回大廳'}
        </Button3D>

        <h2
          onClick={handleTitleClick}
          className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2 cursor-pointer select-none active:scale-95 transition-transform"
          title="連續點擊 5 次啟動管理後台"
        >
          <Trophy className="w-8 h-8 text-amber-500 animate-bounce" />
          {t.heroHallTitle || '全校英雄榮譽榜'}
        </h2>

        <button
          onClick={() => loadGradeBoards(true)}
          disabled={isLoading}
          className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-sm"
          title={t.refresh || '重新整理'}
        >
          <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* ── 年級分流分頁導覽列 (Consolidated 6 Grades + School Wealth) ── */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 overflow-x-auto scrollbar-none shadow-sm">
          {GRADE_LEADERBOARD_TABS.map((tab) => {
            const isSelected = selectedGrade === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundEngine.click();
                  setSelectedGrade(tab.id);
                }}
                className={`flex-1 min-w-[90px] py-2 px-2 rounded-xl text-xs sm:text-sm font-black transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-md scale-102 border border-emerald-300 dark:border-emerald-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <span>{lang === 'zh-TW' ? tab.zh : tab.en}</span>
                {tab.id !== '00' && (
                  <span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-500 dark:text-emerald-300' : 'text-slate-400'}`}>
                    第 {tab.books.join('、')} 冊
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 篩選控制器便當卡 (當前年級資訊 ＆ 競賽週次切換) ── */}
      <GlassCard className="mb-6 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-800 dark:text-white">
                  {lang === 'zh-TW' ? activeGradeObj.zh : activeGradeObj.en} 榮譽競賽榜
                </span>
                {selectedGrade === currentStudent?.grade && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                    我的年級 🎯
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                {activeGradeObj.descZh}
              </p>
            </div>
          </div>

          {/* 週次切換 */}
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-black text-slate-700 dark:text-slate-200">
              {t.compWeekLabel || '競賽週次：'}
            </span>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(parseInt(e.target.value, 10))}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 font-black text-xs sm:text-sm text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600 outline-none focus:border-emerald-500"
            >
              {[...Array(6)].map((_, i) => {
                const w = currentWeek - i;
                if (w < 1) return null;
                return (
                  <option key={w} value={w}>
                    {(t.weekN ? t.weekN.replace('{w}', w) : `第 ${w} 週`)} {w === currentWeek ? (t.currentWeekTag || '(本週)') : ''}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </GlassCard>

      {/* ── Tier 1: 10 大遊戲模式 Top 5 風雲英雄小卡網格 (Bento Grid) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {CONSOLIDATED_GAME_MODES.map((mode) => {
          const Icon = mode.icon;
          const ranks = (boardData[mode.id] || []).slice(0, 5);

          return (
            <GlassCard
              key={mode.id}
              className="flex flex-col justify-between p-4 sm:p-5 relative overflow-hidden group hover:border-emerald-400/80 transition-all shadow-sm"
            >
              <div>
                {/* 卡片標題與圖標 */}
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${mode.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-heading font-black text-sm sm:text-base text-slate-800 dark:text-slate-100">
                      {mode.label}
                    </h3>
                  </div>

                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                    {mode.unit}
                  </span>
                </div>

                {/* 前 5 名清單 */}
                <div className="space-y-1.5 mb-3 min-h-[160px]">
                  {isLoading && !boardData[mode.id] ? (
                    <div className="h-full flex items-center justify-center text-xs font-bold text-slate-400 py-10">
                      <RotateCw className="w-4 h-4 animate-spin mr-1.5 text-emerald-500" />
                      載入中...
                    </div>
                  ) : ranks.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-xs font-bold text-slate-400 py-10 gap-1">
                      <Sparkles className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                      <span>{t.noContenders || '尚無挑戰者'}</span>
                    </div>
                  ) : (
                    ranks.map((entry, idx) => {
                      const isFirst = idx === 0;
                      const isSecond = idx === 1;
                      const isThird = idx === 2;

                      const studentName = entry.nickname || entry.name || '同學';
                      const scoreValue = mode.isSpecial === 'monopoly'
                        ? (entry.coins ?? 0)
                        : mode.isSpecial === 'quest'
                        ? (entry.quest_points ?? 0)
                        : entry.score;

                      const badgeText = getSubModeBadge(entry, mode);

                      return (
                        <div
                          key={entry.id || entry.student_id || idx}
                          className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                            isFirst
                              ? 'bg-amber-500/15 border border-amber-300 dark:border-amber-700 font-black text-amber-950 dark:text-amber-200'
                              : isSecond
                              ? 'bg-slate-100 dark:bg-slate-800 font-black text-slate-800 dark:text-slate-200'
                              : isThird
                              ? 'bg-amber-700/10 dark:bg-amber-950/20 font-black text-amber-900 dark:text-amber-300'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
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
                              <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 shrink-0">
                                {badgeText}
                              </span>
                            )}
                          </div>

                          <div className="font-mono font-black shrink-0 text-right">
                            {scoreValue}
                            <span className="text-[10px] font-normal ml-0.5 text-slate-400">
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
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/50 text-slate-700 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
              >
                <span>{t.viewTop50Btn || '查看完整前 50 名'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </GlassCard>
          );
        })}
      </div>

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
                          {entry.time !== undefined && entry.time > 0 && (
                            <span className="text-[10px] font-bold text-slate-400 block font-mono">
                              耗時 {entry.time} 秒
                            </span>
                          )}
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
  );
};

export default LeaderboardView;
