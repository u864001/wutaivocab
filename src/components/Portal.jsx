import React, { useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { Button3D } from './ui/Button3D';
import { useI18n } from '../context/I18nContext';
import { useEasterEgg } from '../hooks/useEasterEgg';
import {
  Sparkles,
  Rocket,
  Volume2,
  BookOpen,
  ArrowRight,
  Swords,
  Trophy,
  Layers,
  Gamepad2,
  Headphones,
  Mic,
  QrCode,
  GraduationCap,
  Users,
  MessageSquare,
  ClipboardCheck,
  ExternalLink,
  Store,
  MapPin,
  Coins,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const Portal = ({
  onNavigate,
  onOpenLeaderboard,
  onOpenTeacherHub,
  wordsCount = 0,
}) => {
  const { t, lang } = useI18n();
  const handleAdminTrigger = useEasterEgg(onOpenTeacherHub, 5, 2000);
  const [showMobileQr, setShowMobileQr] = useState(false);

  return (
    <div className="relative min-h-screen w-full">
      {/* ══════════════════════════════════════════════════════════ */}
      {/* 🏞️ 魯凱族原住民文化專屬自適應網頁底圖 (寬螢幕與窄螢幕自適應) */}
      {/* 上方為純淨開闊的晨曦天空（無頂部織布干擾，確保導覽列文字清晰）， */}
      {/* 下方保留盛開百合花 (Bariangalay)、神聖古陶壺 (Kadilrungane) 與幾何飾邊 */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <img
          src="/assets/rukai_ui_background.jpg"
          alt="Rukai Indigenous Cultural Background"
          className="w-full h-full object-cover object-top opacity-90 dark:opacity-25 transition-opacity duration-700"
        />
        {/* 柔和霧嵐漫射遮罩：兼顧文化美學與文字高清晰度無障礙對比 */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/40 dark:from-slate-950/70 dark:via-slate-950/50 dark:to-slate-950/80 backdrop-blur-[0.5px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-6 space-y-4 sm:space-y-6 animate-fadeIn pb-14">
        {/* ── 頂部歡迎便當塊 ── */}
        <GlassCard className="relative overflow-hidden bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-indigo-500/15 border-2 border-emerald-300/60 dark:border-emerald-700/60 p-3 sm:p-7 shadow-lg">
          {/* 背景裝飾：遠處大武山晨嵐微光 */}
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-emerald-500/15 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between gap-3 sm:gap-4 relative z-10">
            <div className="flex items-center gap-3 sm:gap-5 min-w-0 flex-1">
              {/* 霧臺學習宇宙徽章圖示 (連續點選 5 次直通後台) */}
              <div
                onClick={handleAdminTrigger}
                className="w-12 h-12 sm:w-18 sm:h-18 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 cursor-pointer select-none active:scale-95 transition-transform shrink-0"
                title="霧臺國小 英語學習宇宙"
              >
                <Sparkles className="w-6 h-6 sm:w-10 sm:h-10 animate-pulse pointer-events-none" />
              </div>

              <div className="flex-1 min-w-0">
                {/* 魯凱文化標籤 */}
                <div className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-400/20 text-emerald-800 dark:text-emerald-300 text-[10px] sm:text-xs font-black mb-0.5 sm:mb-1">
                  <span>🌿</span>
                  <span className="truncate">
                    {lang === 'zh-TW' ? '霧臺國小 • 魯凱雙語學習宇宙' : 'Wutai Elementary Bilingual Hub'}
                  </span>
                </div>

                {/* 主標題 */}
                <div className="flex items-center gap-2">
                  <h2
                    onClick={handleAdminTrigger}
                    className="text-lg sm:text-3xl font-black text-slate-800 dark:text-white font-heading cursor-pointer select-none tracking-wide truncate"
                  >
                    {t.portalTitle}
                  </h2>
                </div>

                {/* 精簡副標題 (手機版隱藏以省下垂直高度，電腦版正常顯示) */}
                <p className="hidden sm:block text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 mt-0.5 truncate">
                  {lang === 'zh-TW' ? '教育部課綱教材與部落情境英語探險' : 'Curriculum & Tribal Adventure'}
                </p>
              </div>
            </div>

            {/* 全校排行榜快速通關按鈕 (手機版金牌膠囊，電腦版立體 3D 琥珀按鈕) */}
            {onOpenLeaderboard && (
              <div className="shrink-0">
                {/* 手機版純金色獎盃圖示 (直立時不帶文字，避免與校名標題遮蔽) */}
                <button
                  type="button"
                  onClick={onOpenLeaderboard}
                  className="sm:hidden w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-500 text-amber-950 flex items-center justify-center shadow-md shadow-amber-500/30 border border-amber-300/70 active:scale-95 transition-all cursor-pointer shrink-0"
                  title={t.leaderboard}
                  aria-label={t.leaderboard}
                >
                  <Trophy className="w-5 h-5 text-amber-900 fill-amber-300 dark:text-amber-100 shrink-0 drop-shadow-xs" />
                </button>

                {/* 電腦版 3D 按鈕 */}
                <div className="hidden sm:block">
                  <Button3D
                    variant="amber"
                    size="md"
                    onClick={onOpenLeaderboard}
                    icon={Trophy}
                    className="shadow-md text-xs sm:text-sm py-2 sm:py-2.5 whitespace-nowrap"
                  >
                    {t.leaderboard}
                  </Button3D>
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* 📱 1. 手機專屬極精簡版面 (Mobile Ultra-Compact Mode, < 640px) */}
        {/* 順序：RPG ➔ 單字 ➔ 發音 ➔ QnA ➔ 課本 (拔除冗餘小字，扁平元素化，一屏全覽) */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div className="block sm:hidden space-y-2">
          {/* 手機模組 1：霧臺小鎮生活冒險 RPG */}
          <div
            onClick={() => onNavigate('town')}
            className="p-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent dark:from-amber-950/60 dark:to-slate-900/60 border-2 border-amber-400/60 dark:border-amber-600/60 flex items-center justify-between gap-2.5 shadow-sm active:scale-98 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25 shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-[15px] font-black text-slate-800 dark:text-slate-100 font-heading truncate">
                  {t.townModuleTitle}
                </h3>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-amber-600 text-white shrink-0 tracking-wide">
                  生活RPG
                </span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 手機模組 2：英語單字冒險館 */}
          <div
            onClick={() => onNavigate('lobby')}
            className="p-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent dark:from-emerald-950/60 dark:to-slate-900/60 border-2 border-emerald-400/60 dark:border-emerald-600/60 flex items-center justify-between gap-2.5 shadow-sm active:scale-98 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 shrink-0">
                <Rocket className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-[15px] font-black text-slate-800 dark:text-slate-100 font-heading truncate">
                  {t.vocabModuleTitle}
                </h3>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-emerald-600 text-white shrink-0 tracking-wide">
                  單字冒險
                </span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 手機模組 3：自然發音探索館 */}
          <div
            onClick={() => onNavigate('phonics')}
            className="p-2.5 px-3 rounded-2xl bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-transparent dark:from-indigo-950/60 dark:to-slate-900/60 border-2 border-indigo-400/60 dark:border-indigo-600/60 flex items-center justify-between gap-2.5 shadow-sm active:scale-98 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 shrink-0">
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-[15px] font-black text-slate-800 dark:text-slate-100 font-heading truncate">
                  {t.phonicsModuleTitle}
                </h3>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-indigo-600 text-white shrink-0 tracking-wide">
                  自然發音
                </span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 手機模組 4：雙語聽說探險館 (視聽語言教室) */}
          <div
            onClick={() => onNavigate('langlab')}
            className="p-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-500/15 via-pink-500/10 to-transparent dark:from-rose-950/60 dark:to-slate-900/60 border-2 border-rose-400/60 dark:border-rose-600/60 flex items-center justify-between gap-2.5 shadow-sm active:scale-98 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-rose-500/25 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-[15px] font-black text-slate-800 dark:text-slate-100 font-heading truncate">
                  {t.langlabModuleTitle || '雙語聽說探險館'}
                </h3>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-rose-600 text-white shrink-0 tracking-wide">
                  聽說探險
                </span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 手機模組 5：ClassQnA 線上互動教室 */}
          <div
            onClick={() => window.open('https://classqna.vercel.app/', '_blank', 'noopener,noreferrer')}
            className="p-2.5 px-3 rounded-2xl bg-gradient-to-r from-sky-500/15 via-blue-500/10 to-transparent dark:from-sky-950/60 dark:to-slate-900/60 border-2 border-sky-400/60 dark:border-sky-600/60 flex items-center justify-between gap-2.5 shadow-sm active:scale-98 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-500 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-sky-500/25 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-[15px] font-black text-slate-800 dark:text-slate-100 font-heading truncate">
                  {t.classqnaModuleTitle}
                </h3>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-sky-600 text-white shrink-0 tracking-wide">
                  互動教室
                </span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 手機模組 6：自編英語電子教科書 */}
          <div
            onClick={() => onNavigate('textbook')}
            className="p-2.5 px-3 rounded-2xl bg-gradient-to-r from-teal-500/15 via-emerald-500/10 to-transparent dark:from-teal-950/60 dark:to-slate-900/60 border-2 border-teal-400/60 dark:border-teal-600/60 flex items-center justify-between gap-2.5 shadow-sm active:scale-98 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-md shadow-teal-500/25 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-[15px] font-black text-slate-800 dark:text-slate-100 font-heading truncate">
                  {t.textbookModuleTitle || '自編英語電子教科書'}
                </h3>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-teal-600 text-white shrink-0 tracking-wide">
                  電子課本
                </span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* 💻 2. 電腦與平板專屬寬平長方形版面 (Desktop Horizontal Banner Mode, >= 640px) */}
        {/* 舒展大氣的長方形橫幅卡片，左右通透，視覺舒適不擠壓 */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div className="hidden sm:flex flex-col space-y-4 sm:space-y-5">
          {/* ── 模組一：霧臺小鎮生活冒險 RPG (Wutai Town Dialogue RPG) ── */}
          <GlassCard
            hoverable={true}
            onClick={() => onNavigate('town')}
            className="relative overflow-hidden group cursor-pointer border-2 border-amber-300/80 dark:border-amber-700/60 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-rose-500/10 dark:from-amber-950/40 dark:via-slate-900/50 dark:to-orange-950/30 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 relative z-10">
              <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-center group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-xl shadow-amber-500/30 shrink-0">
                  <Store className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 font-heading">
                      {t.townModuleTitle}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-sm">
                      {t.townModuleBadge}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                    漫步 9 大社區地標！沉浸式實景情境英語對話，使用金幣採買文具點心，完成每日探索任務。
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-amber-200 dark:border-amber-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      9大生活地標
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-amber-200 dark:border-amber-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                      <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
                      情境英語對話
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-amber-200 dark:border-amber-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                      <Coins className="w-3.5 h-3.5 text-yellow-500" />
                      金幣任務商店
                    </span>
                  </div>
                </div>
              </div>

              <Button3D
                variant="amber"
                size="lg"
                className="shrink-0 w-full md:w-auto shadow-lg group-hover:scale-105 transition-transform"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{t.townModuleEnter}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Button3D>
            </div>
          </GlassCard>

          {/* ── 模組二：英語單字冒險館 (English Vocabulary Quest) ── */}
          <GlassCard
            hoverable={true}
            onClick={() => onNavigate('lobby')}
            className="relative overflow-hidden group cursor-pointer border-2 border-emerald-300/80 dark:border-emerald-700/60 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-teal-500/10 dark:from-emerald-950/40 dark:via-slate-900/50 dark:to-teal-950/30 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 relative z-10">
              <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-xl shadow-emerald-500/30 shrink-0">
                  <Rocket className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 font-heading">
                      {t.vocabModuleTitle}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-600 text-white shadow-sm">
                      {t.vocabModuleBadge}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                    收錄教育部課綱全冊單字庫！提供多人即時競技擂台、隕石防衛、貪食蛇、拖曳拼字與記憶翻牌。
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-emerald-200 dark:border-emerald-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                      <Swords className="w-3.5 h-3.5 text-rose-500" />
                      多人競技擂台
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-emerald-200 dark:border-emerald-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                      <Gamepad2 className="w-3.5 h-3.5 text-indigo-500" />
                      5大遊戲模式
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-emerald-200 dark:border-emerald-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                      {wordsCount > 0 ? `課綱 ${wordsCount} 字題庫` : '全冊教材題庫'}
                    </span>
                  </div>
                </div>
              </div>

              <Button3D
                variant="emerald"
                size="lg"
                className="shrink-0 w-full md:w-auto shadow-lg group-hover:scale-105 transition-transform"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{t.vocabModuleEnter}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Button3D>
            </div>
          </GlassCard>

          {/* ── 模組三：自然發音探索館 (Interactive Phonics Board) ── */}
          <GlassCard
            hoverable={true}
            onClick={() => onNavigate('phonics')}
            className="relative overflow-hidden group cursor-pointer border-2 border-indigo-300/80 dark:border-indigo-700/60 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-pink-500/10 dark:from-indigo-950/40 dark:via-slate-900/50 dark:to-purple-950/30 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 relative z-10">
              <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300 shadow-xl shadow-indigo-500/30 shrink-0">
                  <Volume2 className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 font-heading">
                      {t.phonicsModuleTitle}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm">
                      {t.phonicsModuleBadge}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                    包含短母音、魔術e、混成音等 8 大發音規則卡池，支援 CVC 磁吸拼讀導軌與聽音辨字挑戰。
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-indigo-200 dark:border-indigo-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" />
                      8大規則卡池
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-indigo-200 dark:border-indigo-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      CVC拼讀導軌
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-indigo-200 dark:border-indigo-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                      <Headphones className="w-3.5 h-3.5 text-pink-500" />
                      聽音辨字挑戰
                    </span>
                  </div>
                </div>
              </div>

              <Button3D
                variant="purple"
                size="lg"
                className="shrink-0 w-full md:w-auto shadow-lg group-hover:scale-105 transition-transform"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{t.phonicsModuleEnter}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Button3D>
            </div>
          </GlassCard>

          {/* ── 模組四：雙語聽說探險館 (Language Lab Hub - 視聽語言教室) ── */}
          <GlassCard
            hoverable={true}
            onClick={() => onNavigate('langlab')}
            className="relative overflow-hidden group cursor-pointer border-2 border-rose-300/80 dark:border-rose-700/60 bg-gradient-to-r from-rose-500/10 via-amber-500/5 to-indigo-500/10 dark:from-rose-950/40 dark:via-slate-900/50 dark:to-indigo-950/30 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 relative z-10">
              <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-rose-500 via-amber-500 to-indigo-500 text-white flex items-center justify-center group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-xl shadow-rose-500/30 shrink-0">
                  <Headphones className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 font-heading">
                      {t.langlabModuleTitle || '雙語聽說探險館'}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-rose-600 via-amber-600 to-indigo-600 text-white shadow-sm">
                      {t.langlabModuleBadge || '視聽教室・翰林全冊・AI發音辨識'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                    {t.langlabModuleDesc || '走進吉卜力風視聽語言教室！收錄翰林 Here We Go 1~9 全冊課文與情境對話，支援卡帶書櫃選書、聽力測驗與免流量即時語音口說辨識！'}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-rose-200 dark:border-rose-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                      <BookOpen className="w-3.5 h-3.5 text-rose-500" />
                      翰林 1~9 全冊對話
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-amber-200 dark:border-amber-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                      <Headphones className="w-3.5 h-3.5 text-amber-500" />
                      四選一聽力測驗
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-indigo-200 dark:border-indigo-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                      <Mic className="w-3.5 h-3.5 text-indigo-500" />
                      AI 即時口說錄音 (0流量)
                    </span>
                  </div>
                </div>
              </div>

              <Button3D
                variant="rose"
                size="lg"
                className="shrink-0 w-full md:w-auto shadow-lg group-hover:scale-105 transition-transform"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{t.langlabModuleEnter || '進入聽說探險館'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Button3D>
            </div>
          </GlassCard>

          {/* ── 模組五：ClassQnA 線上互動教室與回家作業 (Virtual Classroom & Homework) ── */}
          <GlassCard
            hoverable={true}
            onClick={() => window.open('https://classqna.vercel.app/', '_blank', 'noopener,noreferrer')}
            className="relative overflow-hidden group cursor-pointer border-2 border-sky-300/80 dark:border-sky-700/60 bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-cyan-500/10 dark:from-sky-950/40 dark:via-slate-900/50 dark:to-cyan-950/30 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 relative z-10">
              <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-sky-500 via-blue-500 to-indigo-500 text-white flex items-center justify-center group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-xl shadow-sky-500/30 shrink-0">
                  <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 font-heading">
                      {t.classqnaModuleTitle}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm">
                      {t.classqnaModuleBadge}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                    建立線上互動虛擬教室，支援課堂即時問答互動與雲端回家作業，學生放學後可隨時跨裝置練習。
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-sky-200 dark:border-sky-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                      <Users className="w-3.5 h-3.5 text-sky-500" />
                      虛擬互動教室
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-sky-200 dark:border-sky-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                      課堂即時問答
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-sky-200 dark:border-sky-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                      <ClipboardCheck className="w-3.5 h-3.5 text-teal-500" />
                      雲端回家作業
                    </span>
                  </div>
                </div>
              </div>

              <Button3D
                variant="blue"
                size="lg"
                className="shrink-0 w-full md:w-auto shadow-lg group-hover:scale-105 transition-transform"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{t.classqnaModuleEnter}</span>
                  <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Button3D>
            </div>
          </GlassCard>

          {/* ── 模組六：自編英語電子教科書 (Bilingual Textbook Flipbook) ── */}
          <GlassCard
            hoverable={true}
            onClick={() => onNavigate('textbook')}
            className="relative overflow-hidden group cursor-pointer border-2 border-teal-300/80 dark:border-teal-700/60 bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-cyan-500/10 dark:from-teal-950/40 dark:via-slate-900/50 dark:to-cyan-950/30 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 relative z-10">
              <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-cyan-500 text-white flex items-center justify-center group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300 shadow-xl shadow-teal-500/30 shrink-0">
                  <BookOpen className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 font-heading">
                      {t.textbookModuleTitle || '自編英語電子教科書'}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm">
                      {t.textbookModuleBadge || '48頁全彩・3D翻頁・聽力隨身聽'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                    {t.textbookModuleDesc || '收錄國小雙語校本教材全 5 單元！支援 3D 擬真翻頁、雙指放大鏡、章節快速跳轉與聽力測驗即時語音朗讀輔助。'}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-teal-200 dark:border-teal-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                      <BookOpen className="w-3.5 h-3.5 text-teal-500" />
                      48 頁全彩教材
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-teal-200 dark:border-teal-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      3D 擬真翻頁
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-teal-200 dark:border-teal-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                      <Headphones className="w-3.5 h-3.5 text-cyan-500" />
                      聽力測驗語音輔助 (0流量)
                    </span>
                  </div>
                </div>
              </div>

              <Button3D
                variant="teal"
                size="lg"
                className="shrink-0 w-full md:w-auto shadow-lg group-hover:scale-105 transition-transform"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{t.textbookModuleEnter || '翻閱電子書'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Button3D>
            </div>
          </GlassCard>
        </div>

        {/* ── 頁尾便當卡 (手機版預設折疊 QR Code，電腦版完整展示) ── */}
        <footer className="pt-2 sm:pt-4 flex flex-col items-center justify-center text-center">
          {/* 手機版折疊按鈕 */}
          <div className="sm:hidden mb-2">
            <button
              type="button"
              onClick={() => setShowMobileQr(!showMobileQr)}
              className="text-[11px] font-black text-slate-500 dark:text-slate-400 hover:text-emerald-600 flex items-center gap-1 py-1 px-2.5 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
            >
              <QrCode className="w-3 h-3 text-emerald-600" />
              <span>{showMobileQr ? '收合網站 QR Code' : '📱 顯示網站 QR Code 分享'}</span>
              {showMobileQr ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* QR Code 實體卡 (電腦版永遠顯示，手機版點擊展開) */}
          <div className={`${showMobileQr ? 'block' : 'hidden sm:block'} w-full max-w-xs transition-all`}>
            <GlassCard className="p-3.5 flex flex-col items-center w-full">
              <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 mb-1.5">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
                    typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost') && !window.location.origin.includes('127.0.0.1')
                      ? window.location.origin
                      : 'https://wutaivocab.vercel.app'
                  )}`}
                  alt="QR Code"
                  className="w-20 h-20 sm:w-22 sm:h-22 object-contain"
                />
              </div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <QrCode className="w-3 h-3 text-emerald-600" />
                {t.scanToJoin}
              </p>
              <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                wutaivocab.vercel.app
              </span>
            </GlassCard>
          </div>

          <p
            onClick={handleAdminTrigger}
            className="text-[11px] font-bold text-slate-400 mt-3 cursor-pointer select-none active:scale-95 transition-transform"
            title={t.appName}
          >
            {t.developer}
          </p>
        </footer>
      </div>
    </div>
  );
};
