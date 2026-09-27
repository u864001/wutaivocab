import React, { useState, useMemo } from 'react';
import { GlassCard } from './ui/GlassCard';
import { Button3D } from './ui/Button3D';
import { useI18n } from '../context/I18nContext';
import {
  Trophy, Settings2, Swords, Rocket, Puzzle,
  Volume2, Keyboard, ChevronDown, ChevronUp, Check,
  QrCode, Sparkles, BookOpen, UserCheck
} from 'lucide-react';

export const Lobby = ({
  words = [],
  settings,
  setSettings,
  onNavigate,
  onOpenLeaderboard,
  qualifyingBook
}) => {
  const { t, lang } = useI18n();
  const [activeTab, setActiveTab] = useState('official'); // 'official' or 'teacher'
  const [expandedBooks, setExpandedBooks] = useState(['1', 'Mario專區']);

  // 分組整理題庫單元
  const groupedData = useMemo(() => {
    const official = {};
    const teachers = {};

    words.forEach(w => {
      const isOfficial = w.author === 'Official';
      const target = isOfficial ? official : teachers;
      const groupKey = w.book;
      if (!target[groupKey]) target[groupKey] = { author: w.author, lessons: new Set() };
      target[groupKey].lessons.add(w.lesson);
    });

    return { official, teachers };
  }, [words]);

  // 已選取總單字量
  const selectedWordsCount = useMemo(() => {
    return words.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`)).length;
  }, [words, settings.selectedUnits]);

  const isSelectionEmpty = selectedWordsCount === 0;

  // 切換單元選取
  const toggleUnit = (book, lesson) => {
    const key = `${book}-${lesson}`;
    setSettings(prev => ({
      ...prev,
      selectedUnits: prev.selectedUnits.includes(key)
        ? prev.selectedUnits.filter(u => u !== key)
        : [...prev.selectedUnits, key]
    }));
  };

  // 全選該冊所有單元
  const toggleAllInBook = (book, lessonsSet) => {
    const allUnits = Array.from(lessonsSet).map(l => `${book}-${l}`);
    const isAllSelected = allUnits.every(u => settings.selectedUnits.includes(u));

    setSettings(prev => ({
      ...prev,
      selectedUnits: isAllSelected
        ? prev.selectedUnits.filter(u => !u.startsWith(`${book}-`))
        : [...new Set([...prev.selectedUnits, ...allUnits])]
    }));
  };

  const toggleExpand = (book) => {
    setExpandedBooks(prev =>
      prev.includes(book) ? prev.filter(b => b !== book) : [...prev, book]
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-6 space-y-6 animate-fadeIn pb-16">
      {/* ── 英雄榜橫幅便當塊 ── */}
      <GlassCard className="bg-gradient-to-r from-amber-400/90 via-yellow-400/90 to-amber-500/90 dark:from-indigo-900/90 dark:via-purple-900/90 dark:to-indigo-900/90 border-amber-300 dark:border-indigo-700/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/30 dark:bg-white/10 text-amber-950 dark:text-amber-200 text-xs font-black mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            每週熱門挑戰進行中
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-amber-950 dark:text-white font-heading">
            {t.appName}
          </h2>
          <p className="text-xs sm:text-sm font-bold text-amber-900/80 dark:text-indigo-200 mt-1">
            題庫已收錄 {words.length} 個單字 • 挑戰每週排行榜登頂！
          </p>
        </div>

        <Button3D
          variant="amber"
          size="lg"
          onClick={onOpenLeaderboard}
          icon={Trophy}
          className="shadow-xl shrink-0"
        >
          {t.leaderboard}
        </Button3D>
      </GlassCard>

      {/* ── 複習範圍便當盒 (Bento Tile) ── */}
      <GlassCard>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black">
            <Settings2 className="w-6 h-6" />
            <h3 className="text-xl font-heading">{t.rangeTitle}</h3>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setSettings(s => ({ ...s, selectedUnits: words.map(w => `${w.book}-${w.lesson}`) }))}
              className="text-xs font-black text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              {t.selectAll}
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setSettings(s => ({ ...s, selectedUnits: [] }))}
              className="text-xs font-black text-slate-500 hover:text-rose-500"
            >
              {t.clearAll}
            </button>
            <div className={`px-3 py-1 rounded-full text-xs font-black ml-2 ${
              isSelectionEmpty 
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-500' 
                : 'bg-emerald-500 text-white shadow-sm'
            }`}>
              {t.selectedCount.replace('{count}', selectedWordsCount)}
            </div>
          </div>
        </div>

        {/* 官方教材 vs 教師專區 分頁切換 */}
        <div className="flex gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mb-5 max-w-md">
          <button
            onClick={() => setActiveTab('official')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'official'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {t.officialBooks}
          </button>
          <button
            onClick={() => setActiveTab('teacher')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'teacher'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            {t.teacherSections}
          </button>
        </div>

        {/* 單元清單折疊選單 */}
        <div className="space-y-3">
          {Object.entries(activeTab === 'official' ? groupedData.official : groupedData.teachers)
            .sort(([a], [b]) => {
              const numA = parseInt(a);
              const numB = parseInt(b);
              if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
              if (!isNaN(numA)) return -1;
              if (!isNaN(numB)) return 1;
              return a.localeCompare(b);
            })
            .map(([book, data]) => {
            const allUnits = Array.from(data.lessons).map(l => `${book}-${l}`);
            const isFull = allUnits.length > 0 && allUnits.every(u => settings.selectedUnits.includes(u));
            const isPart = allUnits.some(u => settings.selectedUnits.includes(u)) && !isFull;
            const isExp = expandedBooks.includes(book);

            return (
              <div
                key={book}
                className="rounded-2xl border border-slate-200/90 dark:border-slate-700/90 bg-white/70 dark:bg-slate-800/60 overflow-hidden"
              >
                <div
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                  onClick={() => toggleExpand(book)}
                >
                  <div className="flex items-center gap-3">
                    {isExp ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    <span className="font-heading font-black text-base text-slate-800 dark:text-slate-100">
                      {isNaN(book) ? book : `第 ${book} 冊`}
                    </span>
                    {(isFull || isPart) && (
                      <span className={`w-2.5 h-2.5 rounded-full ${isFull ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAllInBook(book, data.lessons);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                      isFull 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                        : isPart
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {isFull ? '取消此冊' : '全選此冊'}
                  </button>
                </div>

                {isExp && (
                  <div className="p-3.5 pt-1 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap gap-2">
                    {Array.from(data.lessons)
                      .sort((a, b) => {
                        const getWeight = (l) => {
                          const s = String(l).toLowerCase();
                          if (s.includes('starter')) return -1;
                          if (s.includes('review')) return 99;
                          if (s.includes('festival')) return 100;
                          const n = parseInt(s.replace(/\D/g, ''));
                          return isNaN(n) ? 50 : n;
                        };
                        return getWeight(a) - getWeight(b);
                      })
                      .map((lesson) => {
                      const isSelected = settings.selectedUnits.includes(`${book}-${lesson}`);
                      return (
                        <button
                          key={`${book}-${lesson}`}
                          onClick={() => toggleUnit(book, lesson)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
                            isSelected
                              ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30 scale-105'
                              : 'bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {lesson.startsWith('Unit') ? lesson : `第 ${lesson} 課`}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 出題數與上榜門檻指示 */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-black text-slate-500 dark:text-slate-400">
              {t.unitCount}：
            </label>
            <select
              value={settings.count}
              onChange={(e) => setSettings(s => ({ ...s, count: e.target.value }))}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 font-black text-xs sm:text-sm text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600 outline-none"
            >
              <option value="5">{t.q5}</option>
              <option value="10">{t.q10}</option>
              <option value="20">{t.q20}</option>
              <option value="all">{t.qAll}</option>
            </select>
          </div>

          <div>
            {qualifyingBook !== null ? (
              <span className="text-xs font-black px-3.5 py-1.5 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {t.rankQualified}
              </span>
            ) : (
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                {t.rankHint}
              </span>
            )}
          </div>
        </div>
      </GlassCard>

      {/* ── 多人競技便當塊 ── */}
      <div>
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 font-heading mb-3 flex items-center gap-2">
          {t.secMulti}
        </h3>
        <GlassCard
          hoverable={!isSelectionEmpty}
          onClick={() => !isSelectionEmpty && onNavigate('battle')}
          className={`relative overflow-hidden ${
            isSelectionEmpty ? 'opacity-50 cursor-not-allowed' : 'group'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-md">
                <Swords className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-black text-slate-800 dark:text-slate-100 font-heading">
                    {t.battleTitle}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                    LIVE 對戰
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">
                  {t.battleDesc}
                </p>
              </div>
            </div>

            <Button3D variant="rose" size="md" disabled={isSelectionEmpty} className="hidden sm:inline-flex">
              立即迎戰
            </Button3D>
          </div>
        </GlassCard>
      </div>

      {/* ── 單人冒險挑戰便當網格 (4 Columns) ── */}
      <div>
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 font-heading mb-3 flex items-center gap-2">
          {t.secSolo}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 隕石防衛戰 */}
          <GlassCard
            hoverable={!isSelectionEmpty}
            onClick={() => !isSelectionEmpty && onNavigate('meteor')}
            className={`text-center flex flex-col items-center justify-between ${
              isSelectionEmpty ? 'opacity-50 cursor-not-allowed' : 'group'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Rocket className="w-7 h-7" />
            </div>
            <h4 className="text-base font-black text-slate-800 dark:text-slate-100 font-heading">
              {t.meteorTitle}
            </h4>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 mb-4 flex-1">
              {t.meteorDesc}
            </p>
            <Button3D variant="blue" size="sm" disabled={isSelectionEmpty} className="w-full">
              出發防衛
            </Button3D>
          </GlassCard>

          {/* 叢林貪食蛇 */}
          <GlassCard
            hoverable={!isSelectionEmpty}
            onClick={() => !isSelectionEmpty && onNavigate('snake')}
            className={`text-center flex flex-col items-center justify-between ${
              isSelectionEmpty ? 'opacity-50 cursor-not-allowed' : 'group'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Sparkles className="w-7 h-7" />
            </div>
            <h4 className="text-base font-black text-slate-800 dark:text-slate-100 font-heading">
              {t.snakeTitle}
            </h4>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 mb-4 flex-1">
              {t.snakeDesc}
            </p>
            <Button3D variant="emerald" size="sm" disabled={isSelectionEmpty} className="w-full">
              進入叢林
            </Button3D>
          </GlassCard>

          {/* 拖曳拼字大師 */}
          <GlassCard
            hoverable={!isSelectionEmpty}
            onClick={() => !isSelectionEmpty && onNavigate('spelling')}
            className={`text-center flex flex-col items-center justify-between ${
              isSelectionEmpty ? 'opacity-50 cursor-not-allowed' : 'group'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all">
              <Puzzle className="w-7 h-7" />
            </div>
            <h4 className="text-base font-black text-slate-800 dark:text-slate-100 font-heading">
              {t.spellingTitle}
            </h4>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 mb-4 flex-1">
              {t.spellingDesc}
            </p>
            <Button3D variant="rose" size="sm" disabled={isSelectionEmpty} className="w-full">
              開始拼字
            </Button3D>
          </GlassCard>

          {/* 記憶翻牌 */}
          <GlassCard
            hoverable={!isSelectionEmpty}
            onClick={() => !isSelectionEmpty && onNavigate('memory')}
            className={`text-center flex flex-col items-center justify-between ${
              isSelectionEmpty ? 'opacity-50 cursor-not-allowed' : 'group'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all">
              <Trophy className="w-7 h-7" />
            </div>
            <h4 className="text-base font-black text-slate-800 dark:text-slate-100 font-heading">
              {t.memoryTitle}
            </h4>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 mb-4 flex-1">
              {t.memoryDesc}
            </p>
            <Button3D variant="slate" size="sm" disabled={isSelectionEmpty} className="w-full">
              翻牌挑戰
            </Button3D>
          </GlassCard>
        </div>
      </div>

      {/* ── 經典測驗便當塊 ── */}
      <div>
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 font-heading mb-3 flex items-center gap-2">
          {t.secClassic}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button3D
            variant="slate"
            size="md"
            disabled={isSelectionEmpty}
            onClick={() => onNavigate('quiz-zh-en')}
            className="w-full flex-col py-4"
          >
            <Keyboard className="w-5 h-5 text-blue-500 mb-1" />
            <span>{t.quizZhEn}</span>
          </Button3D>

          <Button3D
            variant="slate"
            size="md"
            disabled={isSelectionEmpty}
            onClick={() => onNavigate('quiz-en-zh')}
            className="w-full flex-col py-4"
          >
            <Keyboard className="w-5 h-5 text-emerald-500 mb-1" />
            <span>{t.quizEnZh}</span>
          </Button3D>

          <Button3D
            variant="slate"
            size="md"
            disabled={isSelectionEmpty}
            onClick={() => onNavigate('quiz-listening')}
            className="w-full flex-col py-4"
          >
            <Volume2 className="w-5 h-5 text-purple-500 mb-1" />
            <span>{t.quizListening}</span>
          </Button3D>

          <Button3D
            variant="slate"
            size="md"
            disabled={isSelectionEmpty}
            onClick={() => onNavigate('quiz-hard')}
            className="w-full flex-col py-4"
          >
            <Sparkles className="w-5 h-5 text-amber-500 mb-1" />
            <span>{t.quizHard}</span>
          </Button3D>
        </div>
      </div>

      {/* ── 頁尾 QR Code 便當卡 ── */}
      <footer className="pt-6 flex flex-col items-center justify-center text-center">
        <GlassCard className="p-4 flex flex-col items-center max-w-xs w-full">
          <div className="p-2 bg-white rounded-2xl shadow-sm border border-slate-200 mb-2">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://u864001.github.io/wutaivocab/"
              alt="QR Code"
              className="w-24 h-24"
            />
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5" />
            {t.scanToJoin}
          </p>
        </GlassCard>
        <p className="text-xs font-bold text-slate-400 mt-4">
          {t.developer}
        </p>
      </footer>
    </div>
  );
};
