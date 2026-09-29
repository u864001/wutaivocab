import React from 'react';
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
  QrCode,
  Compass,
  GraduationCap,
  Users,
  MessageSquare,
  ClipboardCheck,
  ExternalLink,
} from 'lucide-react';

export const Portal = ({
  onNavigate,
  onOpenLeaderboard,
  onOpenTeacherHub,
  wordsCount = 0,
}) => {
  const { t, lang } = useI18n();
  const handleAdminTrigger = useEasterEgg(onOpenTeacherHub, 5, 2000);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-8 space-y-6 animate-fadeIn pb-16">
      {/* ── 英語學習宇宙 歡迎橫幅便當塊 ── */}
      <GlassCard className="bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-indigo-500/15 border-2 border-emerald-300/60 dark:border-emerald-700/60 p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="flex items-center gap-4 sm:gap-5">
          <div
            onClick={handleAdminTrigger}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 cursor-pointer select-none active:scale-95 transition-transform shrink-0"
            title="點擊 5 次啟動管理後台"
          >
            <Sparkles className="w-9 h-9 sm:w-11 sm:h-11 animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 dark:bg-emerald-400/20 text-emerald-800 dark:text-emerald-300 text-xs font-black mb-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>{lang === 'zh-TW' ? '教育部課綱 • 雙語啟蒙基地' : 'Curriculum & Phonics Hub'}</span>
            </div>
            <h2
              onClick={handleAdminTrigger}
              className="text-2xl sm:text-4xl font-black text-slate-800 dark:text-white font-heading cursor-pointer select-none tracking-wide"
            >
              {t.portalTitle}
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 mt-1">
              {t.portalSubtitle}
            </p>
          </div>
        </div>

        {/* 全校排行榜快速通關按鈕 */}
        {onOpenLeaderboard && (
          <Button3D
            variant="amber"
            size="md"
            onClick={onOpenLeaderboard}
            icon={Trophy}
            className="shadow-md shrink-0 w-full sm:w-auto"
          >
            {t.leaderboard}
          </Button3D>
        )}
      </GlassCard>

      {/* ── 核心兩大學習宇宙區塊 (上下排列，預留向下與左右延伸空間) ── */}
      <div className="flex flex-col gap-6">
        {/* ── 模組一：單字學習宇宙 (English Vocabulary Quest) ── */}
        <GlassCard
          hoverable={true}
          onClick={() => onNavigate('lobby')}
          className="relative overflow-hidden group cursor-pointer border-2 border-emerald-300 dark:border-emerald-700/60 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-teal-500/10 dark:from-emerald-950/40 dark:via-slate-900/50 dark:to-teal-950/30 p-6 sm:p-8"
        >
          {/* 背景裝飾光暈 */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xl shadow-emerald-500/30 shrink-0">
                <Rocket className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 font-heading">
                    {t.vocabModuleTitle}
                  </h3>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-sm">
                    {t.vocabModuleBadge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  {t.vocabModuleDesc}
                </p>

                {/* 亮點標籤列 */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-emerald-200 dark:border-emerald-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                    <Swords className="w-3.5 h-3.5 text-rose-500" />
                    {lang === 'zh-TW' ? '多人即時擂台' : 'Live Battle Arena'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-emerald-200 dark:border-emerald-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                    <Gamepad2 className="w-3.5 h-3.5 text-indigo-500" />
                    {lang === 'zh-TW' ? '4 大單人遊戲' : '4 Solo Games'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-emerald-200 dark:border-emerald-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                    {wordsCount > 0
                      ? (lang === 'zh-TW' ? `題庫已收錄 ${wordsCount} 字` : `${wordsCount} Words Loaded`)
                      : (lang === 'zh-TW' ? '課綱全冊單字庫' : 'Curriculum Wordbank')}
                  </span>
                </div>
              </div>
            </div>

            <Button3D
              variant="emerald"
              size="lg"
              className="shrink-0 w-full sm:w-auto shadow-lg group-hover:scale-105 transition-transform"
            >
              <div className="flex items-center gap-2">
                <span>{t.vocabModuleEnter}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Button3D>
          </div>
        </GlassCard>

        {/* ── 模組二：自然發音練習 (Interactive Phonics Board) ── */}
        <GlassCard
          hoverable={true}
          onClick={() => onNavigate('phonics')}
          className="relative overflow-hidden group cursor-pointer border-2 border-indigo-300 dark:border-indigo-700/60 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 dark:from-indigo-950/40 dark:via-slate-900/50 dark:to-purple-950/30 p-6 sm:p-8"
        >
          {/* 背景裝飾光暈 */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 shadow-xl shadow-indigo-500/30 shrink-0">
                <Volume2 className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 font-heading">
                    {t.phonicsModuleTitle}
                  </h3>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm">
                    {t.phonicsModuleBadge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  {t.phonicsModuleDesc}
                </p>

                {/* 亮點標籤列 */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-indigo-200 dark:border-indigo-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    {lang === 'zh-TW' ? '8 大發音規則卡池' : '8 Sound Banks'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-indigo-200 dark:border-indigo-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                    <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                    {lang === 'zh-TW' ? 'CVC 磁吸拼音導軌' : 'CVC Blending Board'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-indigo-200 dark:border-indigo-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                    <Headphones className="w-3.5 h-3.5 text-pink-500" />
                    {lang === 'zh-TW' ? '聽音辨字聽力挑戰' : 'Dictation Quiz'}
                  </span>
                </div>
              </div>
            </div>

            <Button3D
              variant="purple"
              size="lg"
              className="shrink-0 w-full sm:w-auto shadow-lg group-hover:scale-105 transition-transform"
            >
              <div className="flex items-center gap-2">
                <span>{t.phonicsModuleEnter}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Button3D>
          </div>
        </GlassCard>

        {/* ── 模組三：ClassQnA 線上互動教室與回家作業 (Virtual Classroom & Homework) ── */}
        <GlassCard
          hoverable={true}
          onClick={() => window.open('https://classqna.vercel.app/', '_blank', 'noopener,noreferrer')}
          className="relative overflow-hidden group cursor-pointer border-2 border-sky-300 dark:border-sky-700/60 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-cyan-500/10 dark:from-sky-950/40 dark:via-slate-900/50 dark:to-cyan-950/30 p-6 sm:p-8"
        >
          {/* 背景裝飾光暈 */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-sky-500/10 dark:bg-sky-500/5 blur-3xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-sky-500 via-blue-500 to-indigo-500 text-white flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xl shadow-sky-500/30 shrink-0">
                <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 font-heading">
                    {t.classqnaModuleTitle}
                  </h3>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm">
                    {t.classqnaModuleBadge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  {t.classqnaModuleDesc}
                </p>

                {/* 亮點標籤列 */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-sky-200 dark:border-sky-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                    <Users className="w-3.5 h-3.5 text-sky-500" />
                    {lang === 'zh-TW' ? '線上互動虛擬教室' : 'Virtual Classroom'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-sky-200 dark:border-sky-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                    {lang === 'zh-TW' ? '課堂即時問答互動' : 'Live Class Q&A'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-sky-200 dark:border-sky-800/60 text-slate-700 dark:text-slate-200 text-xs font-black">
                    <ClipboardCheck className="w-3.5 h-3.5 text-teal-500" />
                    {lang === 'zh-TW' ? '雲端回家作業指派' : 'Cloud Homework'}
                  </span>
                </div>
              </div>
            </div>

            <Button3D
              variant="blue"
              size="lg"
              className="shrink-0 w-full sm:w-auto shadow-lg group-hover:scale-105 transition-transform"
            >
              <div className="flex items-center gap-2">
                <span>{t.classqnaModuleEnter}</span>
                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Button3D>
          </div>
        </GlassCard>
      </div>

      {/* ── 頁尾 QR Code 便當卡 ── */}
      <footer className="pt-4 flex flex-col items-center justify-center text-center">
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
