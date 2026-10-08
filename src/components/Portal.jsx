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

// ══════════════════════════════════════════════════════════════
// 🌿 魯凱族聖花「百合花 (Bariangalay)」隨風輕曳純前端向量動效
// 特色：純 SVG + CSS GPU 硬體加速，0 額外網路流量、0 資料庫負擔、60FPS 絲滑省電
// ══════════════════════════════════════════════════════════════
const SwayingLily = ({ className = "w-16 h-24 sm:w-20 sm:h-28" }) => (
  <div className={`relative pointer-events-none select-none shrink-0 ${className}`}>
    <svg
      viewBox="0 0 100 140"
      className="w-full h-full overflow-visible"
      style={{
        animation: 'rukaiLilySway 6.5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate',
        transformOrigin: '50px 135px'
      }}
    >
      <defs>
        {/* 百合花瓣柔和漸層 (象徵純潔白色與淡紫背稜) */}
        <linearGradient id="lilyPetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="lilyRibGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#a855f7" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#475569" stopOpacity="0.1" />
        </linearGradient>
        {/* 翠綠花莖漸層 */}
        <linearGradient id="lilyStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        {/* 金黃花蕊微暈 */}
        <filter id="pollenGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 葉片 1 (左側修長披針葉) */}
      <path
        d="M 50 110 Q 25 105 18 85 Q 32 98 50 105 Z"
        fill="#10b981"
        opacity="0.9"
      />
      {/* 葉片 2 (右側修長披針葉) */}
      <path
        d="M 50 120 Q 75 115 84 95 Q 68 110 50 115 Z"
        fill="#059669"
        opacity="0.95"
      />

      {/* 典雅微彎長花莖 */}
      <path
        d="M 50 135 Q 48 90 52 45"
        stroke="url(#lilyStemGrad)"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* 花托萼片 */}
      <path
        d="M 48 45 Q 52 40 56 45 Q 52 48 48 45 Z"
        fill="#047857"
      />

      {/* 金黃雄蕊與雌蕊 (向外微綻) */}
      <g filter="url(#pollenGlow)">
        <path d="M 52 42 Q 50 24 45 18" stroke="#f59e0b" strokeWidth="1.2" fill="none" />
        <circle cx="45" cy="17" r="2.2" fill="#d97706" />

        <path d="M 52 42 Q 53 22 53 14" stroke="#f59e0b" strokeWidth="1.2" fill="none" />
        <circle cx="53" cy="13" r="2.5" fill="#fbbf24" />

        <path d="M 52 42 Q 56 25 61 19" stroke="#f59e0b" strokeWidth="1.2" fill="none" />
        <circle cx="61" cy="18" r="2.2" fill="#d97706" />
      </g>

      {/* 臺灣百合 6 片向外反捲的潔白喇叭花瓣 */}
      <g style={{ animation: 'rukaiPetalPulse 5s ease-in-out infinite alternate' }}>
        {/* 後層花瓣 */}
        <path
          d="M 52 42 Q 38 28 32 15 Q 46 22 52 38 Z"
          fill="url(#lilyPetalGrad)"
          stroke="#cbd5e1"
          strokeWidth="0.6"
        />
        <path
          d="M 52 42 Q 66 28 72 15 Q 58 22 52 38 Z"
          fill="url(#lilyPetalGrad)"
          stroke="#cbd5e1"
          strokeWidth="0.6"
        />

        {/* 前層主花瓣 (優雅反捲) */}
        <path
          d="M 52 42 Q 42 22 40 6 Q 49 18 52 40 Z"
          fill="#ffffff"
          stroke="#e2e8f0"
          strokeWidth="0.6"
        />
        <path
          d="M 52 42 Q 62 22 64 6 Q 55 18 52 40 Z"
          fill="#ffffff"
          stroke="#e2e8f0"
          strokeWidth="0.6"
        />

        {/* 中央主瓣背稜紫線 */}
        <path
          d="M 52 42 Q 52 18 52 4 Q 54 20 52 42 Z"
          stroke="url(#lilyRibGrad)"
          strokeWidth="1.2"
          fill="none"
        />
      </g>
    </svg>
  </div>
);

// ══════════════════════════════════════════════════════════════
// 🐍 魯凱族傳統百步蛇幾何菱形飾帶 (Rukai Diamond Pattern)
// ══════════════════════════════════════════════════════════════
const RukaiPatternBar = ({ className = "" }) => (
  <div className={`w-full overflow-hidden flex items-center justify-center opacity-80 select-none pointer-events-none ${className}`}>
    <svg viewBox="0 0 480 12" className="w-full max-w-sm sm:max-w-md h-2.5 sm:h-3" preserveAspectRatio="none">
      <defs>
        <pattern id="rukaiDiamondPattern" width="28" height="12" patternUnits="userSpaceOnUse">
          {/* 外菱形 (陶土紅) */}
          <polygon points="14,1 27,6 14,11 1,6" fill="#dc2626" />
          {/* 中菱形 (純白) */}
          <polygon points="14,2.5 23,6 14,9.5 5,6" fill="#ffffff" />
          {/* 內菱形 (琉璃金) */}
          <polygon points="14,4 19,6 14,8 9,6" fill="#f59e0b" />
          {/* 核心點 (玄武黑) */}
          <circle cx="14" cy="6" r="1.2" fill="#0f172a" />
          {/* 兩側銜接三角 */}
          <polygon points="0,0 5,0 0,5" fill="#f59e0b" />
          <polygon points="28,0 23,0 28,5" fill="#f59e0b" />
          <polygon points="0,12 5,12 0,7" fill="#f59e0b" />
          <polygon points="28,12 23,12 28,7" fill="#f59e0b" />
        </pattern>
      </defs>
      <rect width="480" height="12" fill="url(#rukaiDiamondPattern)" />
    </svg>
  </div>
);

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
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-6 space-y-4 sm:space-y-6 animate-fadeIn pb-14">
      {/* 內嵌魯凱百合花隨風飄搖 CSS 動畫 (純前端 GPU 加速，0 伺服器流量) */}
      <style>{`
        @keyframes rukaiLilySway {
          0% {
            transform: rotate(-3.5deg);
          }
          50% {
            transform: rotate(2.5deg);
          }
          100% {
            transform: rotate(-3.5deg);
          }
        }
        @keyframes rukaiPetalPulse {
          0%, 100% {
            filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 10px rgba(253, 230, 138, 0.7));
          }
        }
      `}</style>

      {/* ── 頂部歡迎便當塊 (融入大武山聖山晨嵐與魯凱百合花文化) ── */}
      <GlassCard className="relative overflow-hidden bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-indigo-500/15 border-2 border-emerald-300/60 dark:border-emerald-700/60 p-4 sm:p-7 shadow-lg">
        {/* 背景裝飾：遠處大武山晨嵐微光 */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-emerald-500/15 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5 sm:gap-5 w-full sm:w-auto">
            {/* 霧臺學習宇宙徽章圖示 (連續點選 5 次直通後台) */}
            <div
              onClick={handleAdminTrigger}
              className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 cursor-pointer select-none active:scale-95 transition-transform shrink-0"
              title="霧臺國小 英語學習宇宙"
            >
              <Sparkles className="w-7 h-7 sm:w-10 sm:h-10 animate-pulse pointer-events-none" />
            </div>

            <div className="flex-1 min-w-0">
              {/* 魯凱文化標籤 */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-400/20 text-emerald-800 dark:text-emerald-300 text-[11px] sm:text-xs font-black mb-1">
                <span>🌿</span>
                <span className="truncate">
                  {lang === 'zh-TW' ? '霧臺國小 • 魯凱雙語學習宇宙' : 'Wutai Elementary Bilingual Hub'}
                </span>
              </div>

              {/* 主標題與隨風搖曳百合花 */}
              <div className="flex items-center gap-2">
                <h2
                  onClick={handleAdminTrigger}
                  className="text-xl sm:text-3xl font-black text-slate-800 dark:text-white font-heading cursor-pointer select-none tracking-wide truncate"
                >
                  {t.portalTitle}
                </h2>
              </div>

              {/* 精簡副標題 */}
              <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 mt-0.5 truncate">
                {lang === 'zh-TW' ? '教育部課綱教材與部落情境英語探險' : 'Curriculum & Tribal Adventure'}
              </p>
            </div>

            {/* 右上角/右側：隨風輕曳百合花動效 (象徵魯凱族榮譽與純潔聖花) */}
            <div className="hidden xs:flex items-center justify-center pl-2">
              <SwayingLily className="w-12 h-16 sm:w-16 sm:h-22" />
            </div>
          </div>

          {/* 全校排行榜快速通關按鈕 */}
          {onOpenLeaderboard && (
            <div className="w-full sm:w-auto shrink-0 flex items-center gap-2">
              <Button3D
                variant="amber"
                size="md"
                onClick={onOpenLeaderboard}
                icon={Trophy}
                className="shadow-md w-full sm:w-auto text-xs sm:text-sm py-2 sm:py-2.5"
              >
                {t.leaderboard}
              </Button3D>
            </div>
          )}
        </div>

        {/* 魯凱族傳統百步蛇幾何菱紋飾帶 */}
        <RukaiPatternBar className="mt-3.5 sm:mt-4" />
      </GlassCard>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 📱 1. 手機專屬極精簡版面 (Mobile Ultra-Compact Mode, < 640px) */}
      {/* 去除冗長文字與多層標籤，以 4 個俐落高回饋的大按鈕卡片呈現，單手輕鬆滑動 */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="block sm:hidden space-y-2.5">
        {/* 手機模組 1：單字學習館 */}
        <div
          onClick={() => onNavigate('lobby')}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent dark:from-emerald-950/60 dark:to-slate-900/60 border-2 border-emerald-400/60 dark:border-emerald-600/60 flex items-center justify-between gap-3 shadow-md active:scale-98 transition-transform cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 shrink-0">
              <Rocket className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-black text-slate-800 dark:text-slate-100 font-heading truncate">
                  {t.vocabModuleTitle}
                </h3>
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-emerald-600 text-white shrink-0">
                  多人/遊戲
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {wordsCount > 0 ? `課綱 ${wordsCount} 字` : '課綱單字'} • 多人連線擂台 • 5大遊戲
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* 手機模組 2：自然發音練習 */}
        <div
          onClick={() => onNavigate('phonics')}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-transparent dark:from-indigo-950/60 dark:to-slate-900/60 border-2 border-indigo-400/60 dark:border-indigo-600/60 flex items-center justify-between gap-3 shadow-md active:scale-98 transition-transform cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/30 shrink-0">
              <Volume2 className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-black text-slate-800 dark:text-slate-100 font-heading truncate">
                  {t.phonicsModuleTitle}
                </h3>
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-indigo-600 text-white shrink-0">
                  CVC拼音
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate mt-0.5">
                8大規則卡池 • 磁吸拼讀導軌 • 聽力評量
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* 手機模組 3：霧臺小鎮生活冒險 RPG */}
        <div
          onClick={() => onNavigate('town')}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent dark:from-amber-950/60 dark:to-slate-900/60 border-2 border-amber-400/60 dark:border-amber-600/60 flex items-center justify-between gap-3 shadow-md active:scale-98 transition-transform cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-black text-slate-800 dark:text-slate-100 font-heading truncate">
                  {t.townModuleTitle}
                </h3>
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-amber-600 text-white shrink-0">
                  生活RPG
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate mt-0.5">
                9大生活地標 • 沉浸對話 • 金幣任務商店
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* 手機模組 4：ClassQnA 線上互動教室 */}
        <div
          onClick={() => window.open('https://classqna.vercel.app/', '_blank', 'noopener,noreferrer')}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-500/15 via-blue-500/10 to-transparent dark:from-sky-950/60 dark:to-slate-900/60 border-2 border-sky-400/60 dark:border-sky-600/60 flex items-center justify-between gap-3 shadow-md active:scale-98 transition-transform cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-500 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-sky-500/30 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-black text-slate-800 dark:text-slate-100 font-heading truncate">
                  {t.classqnaModuleTitle}
                </h3>
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-sky-600 text-white shrink-0">
                  作業/問答
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate mt-0.5">
                線上虛擬教室 • 即時互動 • 雲端回家作業
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 💻 2. 電腦與平板專屬 2x2 精鍊精緻版面 (Desktop Mode, >= 640px) */}
      {/* 雙欄對稱並排，視覺清晰好點擊，說明精練不冗長 */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="hidden sm:grid sm:grid-cols-2 gap-4 sm:gap-5">
        {/* ── 模組一：單字學習宇宙 (English Vocabulary Quest) ── */}
        <GlassCard
          hoverable={true}
          onClick={() => onNavigate('lobby')}
          className="relative overflow-hidden group cursor-pointer border-2 border-emerald-300 dark:border-emerald-700/60 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-teal-500/10 dark:from-emerald-950/40 dark:via-slate-900/50 dark:to-teal-950/30 p-5 sm:p-6 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-emerald-500/30">
                <Rocket className="w-7 h-7" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-sm">
                {t.vocabModuleBadge}
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 font-heading">
                {t.vocabModuleTitle}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                收錄教育部課綱全冊單字庫！提供多人即時競技擂台、隕石防衛、貪食蛇、拖曳拼字與記憶翻牌。
              </p>
            </div>

            {/* 亮點標籤列 */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-emerald-200 dark:border-emerald-800/60 text-slate-700 dark:text-slate-200 text-[11px] font-black">
                <Swords className="w-3 h-3 text-rose-500" />
                多人擂台
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-emerald-200 dark:border-emerald-800/60 text-slate-700 dark:text-slate-200 text-[11px] font-black">
                <Gamepad2 className="w-3 h-3 text-indigo-500" />
                5大遊戲
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-emerald-200 dark:border-emerald-800/60 text-slate-700 dark:text-slate-200 text-[11px] font-black">
                <BookOpen className="w-3 h-3 text-emerald-500" />
                {wordsCount > 0 ? `${wordsCount} 字題庫` : '全冊題庫'}
              </span>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-emerald-500/10">
            <Button3D
              variant="emerald"
              size="md"
              className="w-full shadow-md group-hover:scale-102 transition-transform"
            >
              <div className="flex items-center justify-center gap-2">
                <span>{t.vocabModuleEnter}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Button3D>
          </div>
        </GlassCard>

        {/* ── 模組二：自然發音練習 (Interactive Phonics Board) ── */}
        <GlassCard
          hoverable={true}
          onClick={() => onNavigate('phonics')}
          className="relative overflow-hidden group cursor-pointer border-2 border-indigo-300 dark:border-indigo-700/60 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 dark:from-indigo-950/40 dark:via-slate-900/50 dark:to-purple-950/30 p-5 sm:p-6 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300 shadow-lg shadow-indigo-500/30">
                <Volume2 className="w-7 h-7" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm">
                {t.phonicsModuleBadge}
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 font-heading">
                {t.phonicsModuleTitle}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                包含短母音、魔術e、混成音等 8 大發音規則卡池，支援 CVC 磁吸拼讀導軌與聽音辨字挑戰。
              </p>
            </div>

            {/* 亮點標籤列 */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-indigo-200 dark:border-indigo-800/60 text-slate-700 dark:text-slate-200 text-[11px] font-black">
                <Layers className="w-3 h-3 text-indigo-500" />
                8大規則卡池
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-indigo-200 dark:border-indigo-800/60 text-slate-700 dark:text-slate-200 text-[11px] font-black">
                <Sparkles className="w-3 h-3 text-purple-500" />
                CVC拼讀導軌
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-indigo-200 dark:border-indigo-800/60 text-slate-700 dark:text-slate-200 text-[11px] font-black">
                <Headphones className="w-3 h-3 text-pink-500" />
                聽音辨字挑戰
              </span>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-indigo-500/10">
            <Button3D
              variant="purple"
              size="md"
              className="w-full shadow-md group-hover:scale-102 transition-transform"
            >
              <div className="flex items-center justify-center gap-2">
                <span>{t.phonicsModuleEnter}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Button3D>
          </div>
        </GlassCard>

        {/* ── 模組三：霧臺小鎮生活冒險 RPG (Wutai Town Dialogue RPG) ── */}
        <GlassCard
          hoverable={true}
          onClick={() => onNavigate('town')}
          className="relative overflow-hidden group cursor-pointer border-2 border-amber-300 dark:border-amber-700/60 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 dark:from-amber-950/40 dark:via-slate-900/50 dark:to-orange-950/30 p-5 sm:p-6 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-center group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-amber-500/30">
                <Store className="w-7 h-7" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-sm">
                {t.townModuleBadge}
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 font-heading">
                {t.townModuleTitle}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                漫步 9 大社區地標！沉浸式實景情境英語對話，使用金幣採買文具點心，完成每日探索任務。
              </p>
            </div>

            {/* 亮點標籤列 */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-amber-200 dark:border-amber-800/60 text-slate-700 dark:text-slate-200 text-[11px] font-black">
                <MapPin className="w-3 h-3 text-amber-500" />
                9大地標
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-amber-200 dark:border-amber-800/60 text-slate-700 dark:text-slate-200 text-[11px] font-black">
                <MessageSquare className="w-3 h-3 text-orange-500" />
                情境英語對話
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-amber-200 dark:border-amber-800/60 text-slate-700 dark:text-slate-200 text-[11px] font-black">
                <Coins className="w-3 h-3 text-yellow-500" />
                金幣商店任務
              </span>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-amber-500/10">
            <Button3D
              variant="amber"
              size="md"
              className="w-full shadow-md group-hover:scale-102 transition-transform"
            >
              <div className="flex items-center justify-center gap-2">
                <span>{t.townModuleEnter}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Button3D>
          </div>
        </GlassCard>

        {/* ── 模組四：ClassQnA 線上互動教室與回家作業 ── */}
        <GlassCard
          hoverable={true}
          onClick={() => window.open('https://classqna.vercel.app/', '_blank', 'noopener,noreferrer')}
          className="relative overflow-hidden group cursor-pointer border-2 border-sky-300 dark:border-sky-700/60 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-cyan-500/10 dark:from-sky-950/40 dark:via-slate-900/50 dark:to-cyan-950/30 p-5 sm:p-6 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-500 to-indigo-500 text-white flex items-center justify-center group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-sky-500/30">
                <GraduationCap className="w-7 h-7" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm">
                {t.classqnaModuleBadge}
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 font-heading">
                {t.classqnaModuleTitle}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                建立線上互動虛擬教室，支援課堂即時問答互動與雲端回家作業，學生放學後可隨時跨裝置練習。
              </p>
            </div>

            {/* 亮點標籤列 */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-sky-200 dark:border-sky-800/60 text-slate-700 dark:text-slate-200 text-[11px] font-black">
                <Users className="w-3 h-3 text-sky-500" />
                虛擬教室
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-sky-200 dark:border-sky-800/60 text-slate-700 dark:text-slate-200 text-[11px] font-black">
                <MessageSquare className="w-3 h-3 text-blue-500" />
                即時問答
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-sky-200 dark:border-sky-800/60 text-slate-700 dark:text-slate-200 text-[11px] font-black">
                <ClipboardCheck className="w-3 h-3 text-teal-500" />
                雲端作業
              </span>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-sky-500/10">
            <Button3D
              variant="blue"
              size="md"
              className="w-full shadow-md group-hover:scale-102 transition-transform"
            >
              <div className="flex items-center justify-center gap-2">
                <span>{t.classqnaModuleEnter}</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
  );
};
