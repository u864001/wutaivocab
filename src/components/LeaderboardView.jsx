import React, { useState, useEffect } from 'react';
import { GlassCard } from './ui/GlassCard';
import { Button3D } from './ui/Button3D';
import { useI18n } from '../context/I18nContext';
import { fetchLeaderboard, getWeekNumber } from '../services/supabase';
import { Trophy, ArrowLeft, RotateCw, Medal, Calendar, BookOpen } from 'lucide-react';

const GAME_MODES = [
  { key: 'spelling', label: '拖曳拼字大師', color: 'text-rose-500', badge: 'bg-rose-100 text-rose-800' },
  { key: 'meteor-zh-en', label: '隕石防衛 (中選英)', color: 'text-indigo-500', badge: 'bg-indigo-100 text-indigo-800' },
  { key: 'meteor-en-zh', label: '隕石防衛 (英選中)', color: 'text-emerald-500', badge: 'bg-emerald-100 text-emerald-800' },
  { key: 'snake-normal', label: '叢林貪食蛇 (一般)', color: 'text-lime-600', badge: 'bg-lime-100 text-lime-800' },
  { key: 'quiz-zh-en', label: '中翻英打字', color: 'text-blue-500', badge: 'bg-blue-100 text-blue-800' },
  { key: 'memory-single', label: '星際記憶翻牌', color: 'text-cyan-500', badge: 'bg-cyan-100 text-cyan-800' },
];

export const LeaderboardView = ({ onBack, words = [] }) => {
  const { t } = useI18n();
  const currentWeek = getWeekNumber();
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [selectedBook, setSelectedBook] = useState('1');
  const [activeMode, setActiveMode] = useState('spelling');
  const [ranks, setRanks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 取得現有所有冊別
  const availableBooks = Array.from(new Set(words.map(w => w.book))).sort();

  const loadRanks = async (force = false) => {
    setIsLoading(true);
    const CACHE_KEY = `lb_${selectedWeek}_${activeMode}_${selectedBook}`;
    const now = Date.now();

    if (!force) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, time } = JSON.parse(cached);
          if (now - time < 60 * 1000) { // 60 秒快取保護
            setRanks(data);
            setIsLoading(false);
            return;
          }
        } catch (e) {}
      }
    }

    const data = await fetchLeaderboard(selectedWeek, activeMode, selectedBook);
    setRanks(data);
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, time: now }));
    setIsLoading(false);
  };

  useEffect(() => {
    loadRanks();
  }, [selectedWeek, selectedBook, activeMode]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 sm:py-6 animate-fadeIn pb-16">
      {/* 頂部導覽列 */}
      <div className="flex items-center justify-between mb-6">
        <Button3D variant="slate" size="sm" onClick={onBack} icon={ArrowLeft}>
          {t.backLobby}
        </Button3D>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
          <Trophy className="w-8 h-8 text-amber-500" />
          全校英雄榮譽榜
        </h2>

        <button
          onClick={() => loadRanks(true)}
          disabled={isLoading}
          className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:scale-105 active:scale-95 transition-transform"
          title="重新整理"
        >
          <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* 篩選控制器便當卡 */}
      <GlassCard className="mb-6 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* 週次切換 */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-black text-slate-600 dark:text-slate-300">選擇週次：</span>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(parseInt(e.target.value, 10))}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 font-black text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none"
            >
              {[...Array(6)].map((_, i) => {
                const w = currentWeek - i;
                if (w < 1) return null;
                return (
                  <option key={w} value={w}>
                    第 {w} 週 {w === currentWeek ? '(本週進行中)' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* 冊別切換 */}
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-black text-slate-600 dark:text-slate-300">冊別/專區：</span>
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 font-black text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none"
            >
              {availableBooks.map((b) => (
                <option key={b} value={b}>
                  {isNaN(b) ? b : `第 ${b} 冊`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 遊戲模式按鈕列 */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60">
          {GAME_MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => setActiveMode(m.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeMode === m.key
                  ? 'bg-amber-400 text-amber-950 font-black shadow-sm scale-105'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* 排行榜表格卡片 */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Medal className="w-5 h-5 text-amber-500" />
            <h3 className="font-heading font-black text-lg text-slate-800 dark:text-slate-100">
              {GAME_MODES.find(m => m.key === activeMode)?.label} 前 10 名
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-400">
            同一學生僅記錄每週最佳成績
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 font-bold text-sm">
              排行榜載入中...
            </div>
          ) : ranks.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-bold text-sm">
              本週此模式尚無英雄登錄，快來搶下頭名！
            </div>
          ) : (
            ranks.map((r, idx) => (
              <div
                key={r.id || idx}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                    idx === 0 
                      ? 'bg-amber-400 text-amber-950 shadow-md shadow-amber-400/30 text-base' 
                      : idx === 1
                      ? 'bg-slate-300 text-slate-800'
                      : idx === 2
                      ? 'bg-amber-700/30 text-amber-700 dark:text-amber-300'
                      : 'text-slate-400 font-bold'
                  }`}>
                    {idx + 1}
                  </span>

                  <div>
                    <h4 className="font-black text-base text-slate-800 dark:text-slate-100">
                      {r.name}
                    </h4>
                    <span className="text-[11px] font-bold text-slate-400">
                      花費時間：{r.time} 秒
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-heading">
                    {r.score}
                  </span>
                  <span className="text-xs font-bold text-slate-400 ml-1">分</span>
                </div>
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  );
};
