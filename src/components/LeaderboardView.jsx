import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from './ui/GlassCard';
import { Button3D } from './ui/Button3D';
import { useI18n } from '../context/I18nContext';
import { fetchLeaderboard, getWeekNumber } from '../services/supabase';
import { soundEngine } from '../services/audio';
import { useEasterEgg } from '../hooks/useEasterEgg';
import {
  Trophy, ArrowLeft, RotateCw, Medal, Calendar,
  BookOpen, Puzzle, Rocket, Sparkles, Keyboard,
  Swords, X, ChevronRight, Compass
} from 'lucide-react';

const BOARD_MODES = [
  {
    id: 'spelling',
    label: '拖曳拼字大師',
    icon: Puzzle,
    color: 'text-rose-500',
    unit: '分',
    defaultKey: 'spelling',
    subModes: [{ key: 'spelling', label: '標準拼字' }]
  },
  {
    id: 'meteor',
    label: '隕石防衛戰',
    icon: Rocket,
    color: 'text-indigo-500',
    unit: '分',
    defaultKey: 'meteor-zh-en',
    subModes: [
      { key: 'meteor-zh-en', label: '看中文選英文' },
      { key: 'meteor-en-zh', label: '看英文選中文' },
      { key: 'meteor-abc', label: 'ABC 防衛' }
    ]
  },
  {
    id: 'snake',
    label: '叢林貪食蛇',
    icon: Sparkles,
    color: 'text-emerald-500',
    unit: '分',
    defaultKey: 'snake-normal',
    subModes: [
      { key: 'snake-normal', label: '競速挑戰' },
      { key: 'snake-survival', label: '生存挑戰' },
      { key: 'snake-easy', label: '新手引導' }
    ]
  },
  {
    id: 'quiz',
    label: '經典學習測驗',
    icon: Keyboard,
    color: 'text-blue-500',
    unit: '分',
    defaultKey: 'quiz-zh-en',
    subModes: [
      { key: 'quiz-zh-en', label: '中翻英打字' },
      { key: 'quiz-en-zh', label: '英翻中打字' },
      { key: 'quiz-listening', label: '英語聽力' },
      { key: 'quiz-hard', label: '魔王綜合' }
    ]
  },
  {
    id: 'memory',
    label: '星際記憶翻牌',
    icon: Trophy,
    color: 'text-cyan-500',
    unit: '分',
    defaultKey: 'memory-single',
    subModes: [{ key: 'memory-single', label: '標準翻牌' }]
  },
  {
    id: 'battle',
    label: '連線對戰之王',
    icon: Swords,
    color: 'text-amber-500',
    unit: '勝',
    defaultKey: 'battle-wins',
    subModes: [{ key: 'battle-wins', label: '累積勝場' }]
  },
  {
    id: 'maze',
    label: '字母巡航迷宮',
    icon: Compass,
    color: 'text-violet-500',
    unit: '秒',
    defaultKey: 'maze-upper',
    subModes: [
      { key: 'maze-upper', label: '10x10 大寫巡航' },
      { key: 'maze-lower', label: '10x10 小寫巡航' }
    ]
  }
];

export const LeaderboardView = ({ onBack, onOpenTeacherHub, words = [] }) => {
  const { t } = useI18n();
  const currentWeek = getWeekNumber();
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [selectedBook, setSelectedBook] = useState('1');
  const [boardData, setBoardData] = useState({}); // { [modeKey]: items[] }
  const [isLoading, setIsLoading] = useState(false);

  // ── 隱藏後台彩蛋：連續點擊「全校英雄榜」標題 5 下進入教師工作台 ──
  const handleTitleClick = useEasterEgg(onOpenTeacherHub, 5, 2000);

  // 各卡片當前選取的子模式 Key
  const [activeSubKeys, setActiveSubKeys] = useState({
    spelling: 'spelling',
    meteor: 'meteor-zh-en',
    snake: 'snake-normal',
    quiz: 'quiz-zh-en',
    memory: 'memory-single',
    battle: 'battle-wins',
    maze: 'maze-upper'
  });

  // 彈窗顯示前 50 名的模式 Key (null 表示關閉)
  const [modalModeKey, setModalModeKey] = useState(null);

  // 取得現有所有冊別 (數字優先排序，若題庫尚未就緒則安全回退)
  const rawBooks = words && words.length > 0
    ? Array.from(new Set(words.map(w => w.book)))
    : ['1', '2', '3', '4', '5', '6', '7', '8'];

  const availableBooks = (rawBooks.length > 0 ? rawBooks : ['1', '2', '3', '4', '5', '6', '7', '8']).sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    if (!isNaN(numA)) return -1;
    if (!isNaN(numB)) return 1;
    return String(a || '').localeCompare(String(b || ''));
  });

  const loadAllBoards = async (force = false) => {
    setIsLoading(true);
    const results = { ...boardData };

    const isPastWeek = selectedWeek < currentWeek;
    const cacheTtl = isPastWeek ? 7 * 24 * 60 * 60 * 1000 : 60 * 1000; // 歷史週次成績已凍結，快取 7 天；本週快取 60 秒

    await Promise.all(
      BOARD_MODES.map(async (m) => {
        const activeKey = activeSubKeys[m.id] || m.defaultKey;
        const CACHE_KEY = `lb_v2_${selectedWeek}_${activeKey}_${selectedBook}`;
        const now = Date.now();

        if (!force) {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            try {
              const { data, time } = JSON.parse(cached);
              if (now - time < cacheTtl) {
                results[activeKey] = data;
                return;
              }
            } catch (e) {}
          }
        }

        const data = await fetchLeaderboard(selectedWeek, activeKey, selectedBook, 50);
        results[activeKey] = data;
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data, time: now }));
      })
    );

    setBoardData(results);
    setIsLoading(false);
  };

  useEffect(() => {
    loadAllBoards();
  }, [selectedWeek, selectedBook, activeSubKeys]);

  const handleSubModeChange = async (cardId, newKey) => {
    setActiveSubKeys(prev => ({ ...prev, [cardId]: newKey }));
    const isPastWeek = selectedWeek < currentWeek;
    const cacheTtl = isPastWeek ? 7 * 24 * 60 * 60 * 1000 : 60 * 1000;
    const CACHE_KEY = `lb_v2_${selectedWeek}_${newKey}_${selectedBook}`;
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, time } = JSON.parse(cached);
        if (Date.now() - time < cacheTtl) {
          setBoardData(prev => ({ ...prev, [newKey]: data }));
          return;
        }
      } catch (e) {}
    }
    const data = await fetchLeaderboard(selectedWeek, newKey, selectedBook, 50);
    setBoardData(prev => ({ ...prev, [newKey]: data }));
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, time: Date.now() }));
  };

  // 尋找當前打開彈窗的模式與子模式名稱
  const getActiveModalInfo = () => {
    if (!modalModeKey) return null;
    for (const m of BOARD_MODES) {
      const sm = m.subModes.find(s => s.key === modalModeKey);
      if (sm) {
        return {
          title: `${m.label} (${sm.label})`,
          unit: m.unit,
          color: m.color
        };
      }
    }
    return { title: '排行榜', unit: '分', color: 'text-amber-500' };
  };

  const modalInfo = getActiveModalInfo();
  const activeModalRanks = modalModeKey ? (boardData[modalModeKey] || []) : [];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-6 animate-fadeIn pb-16">
      {/* 頂部導覽列 */}
      <div className="flex items-center justify-between mb-6">
        <Button3D variant="slate" size="sm" onClick={onBack} icon={ArrowLeft}>
          {t.backLobby || '回大廳'}
        </Button3D>

        <h2
          onClick={handleTitleClick}
          className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2 cursor-pointer select-none active:scale-95 transition-transform"
          title={t.heroHallTitle || '全校英雄榜'}
        >
          <Trophy className="w-8 h-8 text-amber-500 animate-bounce" />
          {t.heroHallTitle || '全校英雄榜'}
        </h2>

        <button
          onClick={() => loadAllBoards(true)}
          disabled={isLoading}
          className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:scale-105 active:scale-95 transition-transform"
          title={t.refresh || '重新整理'}
        >
          <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* 篩選控制器便當卡 (冊別 ＆ 週次切換) */}
      <GlassCard className="mb-6 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* 冊別切換 (難度分級隔離) */}
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-black text-slate-700 dark:text-slate-200">
              {t.selectBookLabel || '選擇競賽冊別：'}
            </span>
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 font-black text-xs sm:text-sm text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600 outline-none focus:border-blue-500"
            >
              {availableBooks.map((b) => (
                <option key={b} value={b}>
                  {isNaN(b) ? b : (t.bookN ? t.bookN.replace('{b}', b) : `第 ${b} 冊`)}
                </option>
              ))}
            </select>
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
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 font-black text-xs sm:text-sm text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600 outline-none focus:border-emerald-500"
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

      {/* ── 各遊戲 Top 5 便當卡網格 (Bento Grid) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {BOARD_MODES.map((mode) => {
          const Icon = mode.icon;
          const activeKey = activeSubKeys[mode.id] || mode.defaultKey;
          const ranks = (boardData[activeKey] || []).slice(0, 5);

          return (
            <GlassCard key={mode.id} className="flex flex-col justify-between p-5 relative overflow-hidden">
              <div>
                {/* 卡片標題與圖標 */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${mode.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-base text-slate-800 dark:text-slate-100">
                        {mode.label}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400">
                        {t.top5WeeklyBadge}
                      </span>
                    </div>
                  </div>

                  {/* 子模式切換選單 */}
                  {mode.subModes.length > 1 && (
                    <select
                      value={activeKey}
                      onChange={(e) => handleSubModeChange(mode.id, e.target.value)}
                      className="text-[11px] font-black py-1 px-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 outline-none"
                    >
                      {mode.subModes.map(sm => (
                        <option key={sm.key} value={sm.key}>{sm.label}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* 前 5 名清單 */}
                <div className="space-y-2 mb-4">
                  {isLoading && !boardData[activeKey] ? (
                    <div className="py-8 text-center text-xs font-bold text-slate-400">
                      ...
                    </div>
                  ) : ranks.length === 0 ? (
                    <div className="py-8 text-center text-xs font-bold text-slate-400">
                      {t.noContenders}
                    </div>
                  ) : (
                    ranks.map((r, idx) => (
                      <div
                        key={r.id || idx}
                        className="p-2 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[11px] ${
                            idx === 0 
                              ? 'bg-amber-400 text-amber-950 font-black shadow-sm' 
                              : idx === 1
                              ? 'bg-slate-300 text-slate-800'
                              : idx === 2
                              ? 'bg-amber-700/30 text-amber-700 dark:text-amber-300'
                              : 'text-slate-400'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="font-black text-slate-800 dark:text-slate-100 truncate max-w-[120px]">
                            {r.name}
                          </span>
                        </div>

                        <div className="text-right font-black">
                          <span className="text-emerald-600 dark:text-emerald-400 font-heading text-sm">
                            {mode.unit === '秒' ? (r.time || 0) : r.score}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1">
                            {mode.unit === '秒' ? '秒' : mode.unit === '勝' ? t.unitWins : t.unitPoints}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 查看完整前 50 名按鈕 */}
              <button
                onClick={() => setModalModeKey(activeKey)}
                className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-700/70 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-black flex items-center justify-center gap-1 transition-colors"
              >
                <span>{t.viewTop50Btn}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </GlassCard>
          );
        })}
      </div>

      {/* ── 前 50 名完整名次彈窗 (Modal) ── */}
      {modalModeKey && modalInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <GlassCard className="max-w-xl w-full max-h-[85vh] flex flex-col p-6 shadow-2xl relative">
            {/* 彈窗頂部 */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Medal className="w-6 h-6 text-amber-500" />
                <h3 className="text-xl font-black font-heading text-slate-800 dark:text-slate-100">
                  {t.top50ModalTitle ? t.top50ModalTitle.replace('{title}', modalInfo.title) : `${modalInfo.title} 前 50 名`}
                </h3>
              </div>
              <button
                onClick={() => setModalModeKey(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-bold text-slate-400 my-2">
              {t.top50ModalSubtitle
                ? t.top50ModalSubtitle.replace('{book}', selectedBook).replace('{week}', selectedWeek)
                : `第 ${selectedBook} 冊 • 第 ${selectedWeek} 週 • 每位同學僅取最佳成績`}
            </p>

            {/* 滾動榜單 */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 pr-1 my-2">
              {activeModalRanks.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-bold text-sm">
                  {t.noContenders || '尚無挑戰者登錄'}
                </div>
              ) : (
                activeModalRanks.map((r, idx) => (
                  <div
                    key={r.id || idx}
                    className="py-3 px-2 flex items-center justify-between text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                        idx === 0 
                          ? 'bg-amber-400 text-amber-950 shadow-md' 
                          : idx === 1
                          ? 'bg-slate-300 text-slate-800'
                          : idx === 2
                          ? 'bg-amber-700/30 text-amber-700 dark:text-amber-300'
                          : 'text-slate-400'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-black text-slate-800 dark:text-slate-100">
                          {r.name}
                        </span>
                        {r.time > 0 && (
                          <span className="text-[10px] text-slate-400 block">
                            {t.timeSpentSec ? t.timeSpentSec.replace('{time}', r.time) : `耗時：${r.time} 秒`}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-heading">
                        {modalInfo.unit === '秒' ? (r.time || 0) : r.score}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">
                        {modalInfo.unit === '秒' ? '秒' : modalInfo.unit === '勝' ? (t.unitWins || '勝') : (t.unitPoints || '分')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 關閉按鈕 */}
            <Button3D
              variant="slate"
              size="md"
              onClick={() => setModalModeKey(null)}
              className="w-full mt-2"
            >
              {t.closeBoardBtn}
            </Button3D>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
