import React, { useState, useMemo } from 'react';
import { GlassCard } from './ui/GlassCard';
import { Button3D } from './ui/Button3D';
import { useI18n } from '../context/I18nContext';
import { useStudent } from '../context/StudentContext';
import { formatStudentDisplayName, formatStudentBadge } from '../utils/studentIdHelper';
import {
  Trophy, Settings2, Swords, Rocket, Puzzle,
  Volume2, Keyboard, ChevronDown, ChevronUp, Check,
  QrCode, Sparkles, BookOpen, UserCheck, Megaphone, Home,
  Compass, Flame, Coins, User, RefreshCw, Package, ShieldCheck,
  Store, MapPin, KeyRound
} from 'lucide-react';
import { useEasterEgg } from '../hooks/useEasterEgg';

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
  const [activeTab, setActiveTab] = useState('official'); // 'official' or 'teacher'
  const [expandedBooks, setExpandedBooks] = useState(['1', 'Mario專區']);

  const handleAdminTrigger = useEasterEgg(onOpenTeacherHub, 5, 2000);

  const [announcement] = useState(() => {
    try {
      const saved = localStorage.getItem('wutai_announcement');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

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
      {/* ── 宇宙導航麵包屑 / 回首頁按鈕 ── */}
      <div className="flex items-center justify-start gap-3">
        <button
          onClick={() => onNavigate('portal')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-black shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Home className="w-4 h-4 text-emerald-500" />
          <span>{t.backToPortal || '回學習宇宙首頁'}</span>
        </button>
      </div>
      {/* ── 全校即時跑馬燈公告 (由管理員後台設定) ── */}
      {announcement?.active && announcement?.text && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 border-2 border-amber-300 dark:border-amber-600 flex items-center gap-3 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-black shadow-sm animate-fadeIn">
          <span className="p-2 rounded-xl bg-amber-500 text-white shadow-sm shrink-0">
            <Megaphone className="w-4 h-4 animate-bounce" />
          </span>
          <span className="flex-1 tracking-wide leading-relaxed">
            {announcement.text}
          </span>
        </div>
      )}

      {/* ── 英雄榜橫幅便當塊 (標題連續點擊 5 次直通後台) ── */}
      <GlassCard className="bg-gradient-to-r from-amber-400/90 via-yellow-400/90 to-amber-500/90 dark:from-indigo-900/90 dark:via-purple-900/90 dark:to-indigo-900/90 border-amber-300 dark:border-indigo-700/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/30 dark:bg-white/10 text-amber-950 dark:text-amber-200 text-xs font-black mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            每週熱門挑戰進行中
          </div>
          <h2
            onClick={handleAdminTrigger}
            className="text-2xl sm:text-3xl font-black text-amber-950 dark:text-white font-heading cursor-pointer select-none active:scale-95 transition-transform"
            title={t.vocabLobbyTitle || t.appName}
          >
            {t.vocabLobbyTitle || t.appName}
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

      {/* ── 霧臺宇宙學生漫遊通行證名片 / 登入引導 (Bento Tile) ── */}
      <GlassCard className="border-2 border-emerald-400/60 dark:border-emerald-600/60 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-indigo-500/10 dark:from-emerald-950/30 dark:to-slate-800/60 p-4 sm:p-5">
        {isLoggedIn ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-heading font-black text-lg shadow-md shrink-0">
                {currentStudent.nickname?.slice(0, 1) || '學'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-sm">
                    {formatStudentBadge(currentStudent, lang)}
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-slate-800 dark:text-white font-heading">
                    {currentStudent.nickname}
                  </h4>
                  <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    ID: {currentStudent.student_id}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{t.ownGradeRewardTip}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-300 dark:border-amber-700 flex items-center gap-1.5 text-amber-700 dark:text-amber-300 text-xs font-black">
                  <Coins className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-mono text-sm">{currentStudent.coins ?? 0}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-indigo-500/15 border border-indigo-300 dark:border-indigo-700 flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 text-xs font-black">
                  <Trophy className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="font-mono text-sm">{currentStudent.quest_points ?? 0}</span>
                </div>
              </div>

              <button
                onClick={openModal}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black flex items-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t.switchSeatBtn}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-heading font-black text-xl shrink-0">
                🎒
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-slate-800 dark:text-white font-heading">
                  {t.noStudentSelected}
                </h4>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.clickToLoginStudent}
                </p>
              </div>
            </div>

            <Button3D
              variant="amber"
              size="sm"
              onClick={openModal}
              icon={User}
              className="w-full sm:w-auto shadow-md"
            >
              {t.loginToRoam}
            </Button3D>
          </div>
        )}
      </GlassCard>

      {/* ── 快速傳送：霧臺小鎮生活冒險 RPG 橫幅 ── */}
      <GlassCard
        hoverable={true}
        onClick={() => onNavigate('town')}
        className="cursor-pointer border-2 border-amber-300 dark:border-amber-700/60 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-yellow-500/15 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5 text-left">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-2xl shadow-md shrink-0">
            🏘️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-sm">
                RPG 探索
              </span>
              <h4 className="text-base sm:text-lg font-black text-slate-800 dark:text-white font-heading">
                {t.townModuleTitle || '霧臺小鎮生活冒險 RPG'}
              </h4>
            </div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-0.5">
              {lang === 'zh-TW'
                ? '9 大生活地標・情境英語對話・金幣商店採買・每日懸賞任務！'
                : 'Explore 9 landmarks, dialogue trees, shops, backpack, and daily quests!'}
            </p>
          </div>
        </div>

        <Button3D
          variant="amber"
          size="sm"
          className="shrink-0 w-full sm:w-auto shadow-md pointer-events-none"
        >
          <span>{lang === 'zh-TW' ? '前往小鎮 🏘️' : 'Visit Town 🏘️'}</span>
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
                          if (s.includes('starter')) return -10; // Starter 最前
                          if (s.includes('festival') || s.includes('culture')) return 999; // Festival 最後
                          if (s.includes('review')) {
                            const r = parseInt(s.replace(/\D/g, ''));
                            return 80 + (isNaN(r) ? 0 : r);
                          }
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

        {/* 出題數、誘答模式與上榜門檻指示 */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* 每次出題數 */}
            <div className="flex items-center gap-2">
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

            {/* 誘答模式膠囊切換器 (Apple Capsule Segmented Pill) */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400">
                {t.distractorMode}：
              </label>
              <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setSettings(s => ({ ...s, distractorMode: 'strict' }))}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    (settings.distractorMode || 'strict') === 'strict'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                  }`}
                >
                  {t.distractorStrict}
                </button>
                <button
                  type="button"
                  onClick={() => setSettings(s => ({ ...s, distractorMode: 'spiral' }))}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    settings.distractorMode === 'spiral'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                  }`}
                >
                  {t.distractorSpiral}
                </button>
              </div>
            </div>
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

        {/* 誘答模式備註提示 */}
        <div className="mt-2 text-left">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
            💡 {settings.distractorMode === 'spiral' ? t.distractorSpiralHint : t.distractorStrictHint}
          </span>
        </div>
      </GlassCard>

      {/* ── 多人競技便當塊 ── */}
      <div>
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 font-heading mb-3 flex items-center gap-2">
          {t.secMulti}
        </h3>
        <GlassCard
          hoverable={true}
          onClick={() => onNavigate('battle')}
          className="relative overflow-hidden group cursor-pointer"
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

            <Button3D variant="rose" size="md" className="hidden sm:inline-flex">
              進入大廳
            </Button3D>
          </div>
        </GlassCard>
      </div>

      {/* ── 單人冒險挑戰便當網格 (4 Columns) ── */}
      <div>
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 font-heading mb-3 flex items-center gap-2">
          {t.secSolo}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
          {/* 神祕密室逃脫 (分年級主題解謎、聽力拼字、高畫質沉浸探索) */}
          <GlassCard
            hoverable={true}
            onClick={() => onNavigate('escape')}
            className="text-center flex flex-col items-center justify-between group border-2 border-emerald-400/80 bg-gradient-to-b from-emerald-500/15 via-teal-500/10 to-transparent relative shadow-md cursor-pointer"
          >
            <div className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm flex items-center gap-0.5">
              <span>全新密室</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-md">
              <KeyRound className="w-7 h-7" />
            </div>
            <h4 className="text-base font-black text-slate-800 dark:text-slate-100 font-heading">
              {t.escapeTitle || '神祕密室逃脫'}
            </h4>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 mb-4 flex-1">
              {t.escapeDesc || '四大機關封印！聲納聽力、羊皮紙線索、拼字輪盤與對偶之門！'}
            </p>
            <Button3D variant="emerald" size="sm" className="w-full">
              進入密室
            </Button3D>
          </GlassCard>

          {/* 極速是非滑牌 (30秒卡牌速辨，低年級字母 / 中高年級單字) */}
          <GlassCard
            hoverable={true}
            onClick={() => onNavigate('swipe')}
            className="text-center flex flex-col items-center justify-between group border-2 border-rose-400/60 bg-gradient-to-b from-rose-500/10 via-orange-500/5 to-transparent relative shadow-md cursor-pointer"
          >
            <div className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm flex items-center gap-0.5">
              <span>30秒對決</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-md">
              <Flame className="w-7 h-7" />
            </div>
            <h4 className="text-base font-black text-slate-800 dark:text-slate-100 font-heading">
              {t.swipeTitle || '極速是非滑牌'}
            </h4>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 mb-4 flex-1">
              {t.swipeDesc || '30秒極速對決！左右滑動手牌，挑戰功能彩蛋與連擊！'}
            </p>
            <Button3D variant="rose" size="sm" className="w-full">
              滑牌挑戰
            </Button3D>
          </GlassCard>

          {/* 星際字母迷宮 / 百步蛇字母巡航 (低年級專屬，免選單字即玩) */}
          <GlassCard
            hoverable={true}
            onClick={() => onNavigate('maze')}
            className="text-center flex flex-col items-center justify-between group border-2 border-amber-400/60 bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent relative shadow-md"
          >
            <div className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-sm flex items-center gap-0.5">
              <span>低年級首選</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-stone-950 transition-all shadow-md">
              <Compass className="w-7 h-7" />
            </div>
            <h4 className="text-base font-black text-slate-800 dark:text-slate-100 font-heading">
              {t.mazeTitle || '字母巡航迷宮'}
            </h4>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 mb-4 flex-1">
              {t.mazeDesc || '百步蛇手指巡航！A到Z字母連線與10x10挑戰！'}
            </p>
            <Button3D variant="amber" size="sm" className="w-full">
              巡航探險
            </Button3D>
          </GlassCard>

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
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost') && !window.location.origin.includes('127.0.0.1')
                  ? window.location.origin
                  : 'https://wutaivocab.vercel.app'
              )}`}
              alt="QR Code"
              className="w-24 h-24 object-contain"
            />
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5" />
            {t.scanToJoin}
          </p>
          <span className="text-[11px] font-mono text-slate-400 mt-1">
            {typeof window !== 'undefined' && window.location.host && !window.location.host.includes('localhost')
              ? window.location.host
              : 'wutaivocab.vercel.app'}
          </span>
        </GlassCard>
        <p
          onClick={handleAdminTrigger}
          className="text-xs font-bold text-slate-400 mt-4 cursor-pointer select-none active:scale-95 transition-transform"
          title={t.appName}
        >
          {t.developer}
        </p>
      </footer>
    </div>
  );
};
