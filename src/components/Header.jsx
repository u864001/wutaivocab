import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { useStudent } from '../context/StudentContext';
import { formatStudentBadge } from '../utils/studentIdHelper';
import { soundEngine } from '../services/audio';
import { Sun, Moon, Volume2, VolumeX, Globe, Sparkles, Home, ArrowLeft, User, Coins, Trophy } from 'lucide-react';
import { useEasterEgg } from '../hooks/useEasterEgg';

export const Header = ({
  onOpenTeacherHub,
  onOpenLeaderboard,
  onOpenPhonics,
  onGoHome,
  onGoParent,
  currentView = 'portal',
  isOnline = true
}) => {
  const { isDark, toggleTheme, isAuto } = useTheme();
  const { lang, toggleLang, t } = useI18n();
  const { currentStudent, isLoggedIn, openModal } = useStudent();
  const [isMuted, setIsMuted] = useState(soundEngine.isMuted);

  const handleAdminTrigger = useEasterEgg(onOpenTeacherHub, 5, 2000);

  const handleLeaderboardClick = (e) => {
    handleAdminTrigger(e);
    if (onOpenLeaderboard) {
      onOpenLeaderboard();
    }
  };

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="w-full max-w-6xl mx-auto px-2.5 sm:px-4 py-2 sm:py-4 flex items-center justify-between gap-2 sm:gap-3 relative z-20">
      {/* 學校標題與連線狀態 */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* 一鍵回首頁圖示 (手機版專用回首頁鈕，電腦版點擊星光 5 次直通後台) */}
        <div
          onClick={() => {
            if (onGoHome) onGoHome();
            else handleAdminTrigger();
          }}
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-400 dark:from-indigo-600 dark:to-cyan-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 dark:shadow-indigo-500/30 cursor-pointer select-none active:scale-95 transition-transform shrink-0"
          title={lang === 'zh-TW' ? '返回英語學習宇宙首頁' : 'Go Home'}
        >
          <Home className="w-4 h-4 sm:hidden pointer-events-none" />
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 hidden sm:block pointer-events-none" />
        </div>

        {/* 電腦版完整標題與連線狀態標籤 (手機版隱藏，徹底避免直排佔據10行) */}
        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <h1
              onClick={onGoHome}
              className={`text-lg sm:text-2xl font-black tracking-wide text-slate-800 dark:text-slate-100 font-heading whitespace-nowrap ${
                onGoHome ? 'cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors' : ''
              }`}
            >
              {t.appName}
            </h1>
            <span className={`text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap shrink-0 ${
              isOnline 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' 
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {isOnline ? t.connected : t.offline}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* 功能控制區：符合業界標準排序（返回 ➔ 榮譽獎盃 ➔ 聲音 ➔ 雙語 ➔ 日夜主題 ➔ 學生通行證錨點） */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* 1. 上一層返回按鈕 (非首頁時顯示，手機版僅箭頭圖示) */}
        {(onGoParent || onGoHome) && currentView !== 'portal' && (
          <button
            onClick={onGoParent || onGoHome}
            title={
              currentView === 'lobby' || currentView === 'phonics' || currentView === 'town' || currentView === 'textbook' || currentView === 'langlab'
                ? (lang === 'zh-TW' ? '返回學習宇宙首頁' : 'Back to Universe Home')
                : (lang === 'zh-TW' ? '返回單字冒險館' : 'Back to Vocab Hub')
            }
            className="p-2 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 flex items-center gap-1 text-xs font-black shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">
              {currentView === 'lobby' || currentView === 'phonics' || currentView === 'town' || currentView === 'textbook' || currentView === 'langlab'
                ? (lang === 'zh-TW' ? '學習首頁' : 'Home')
                : (lang === 'zh-TW' ? '回單字館' : 'Vocab Hub')}
            </span>
          </button>
        )}

        {/* 2. 🏆 全校排行榜圓形金盃按鈕 (連續點選 5 次可開啟教師後台) */}
        {onOpenLeaderboard && (
          <button
            type="button"
            onClick={handleLeaderboardClick}
            title={lang === 'zh-TW' ? '全校榮譽排行榜 (連續點選 5 次開啟教師後台)' : 'School Leaderboard'}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-amber-400/20 via-yellow-400/30 to-amber-500/20 hover:from-amber-400/40 hover:to-yellow-400/50 border border-amber-400/60 dark:border-yellow-400/50 text-amber-500 dark:text-yellow-300 flex items-center justify-center shadow-sm hover:shadow-amber-400/25 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Trophy className="w-4 h-4 text-amber-500 dark:text-yellow-300 fill-amber-400/30 dark:fill-yellow-400/20 drop-shadow-xs" />
          </button>
        )}

        {/* 3. 🔊 音效開關 (純圖示) */}
        <button
          onClick={handleToggleSound}
          title={isMuted ? t.soundOff : t.soundOn}
          className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm transition-all active:scale-95 shrink-0"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-cyan-400" />}
        </button>

        {/* 4. 🌐 雙語切換 (手機版純圖示) */}
        <button
          onClick={toggleLang}
          title={lang === 'zh-TW' ? 'Switch to English' : '切換為繁體中文'}
          className="p-2 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 flex items-center gap-1 text-xs font-black shadow-sm transition-all active:scale-95 shrink-0"
        >
          <Globe className="w-3.5 h-3.5 text-blue-500" />
          <span className="hidden sm:inline">{lang === 'zh-TW' ? 'EN' : '中文'}</span>
        </button>

        {/* 5. ☀️/🌙 主題切換 (晨曦白晝 vs 星月夜景，支援時鐘自動隨動) */}
        <button
          onClick={toggleTheme}
          title={
            isAuto
              ? (isDark ? '星月夜間模式 (依時鐘自動，點擊切換為手動白天)' : '晨曦日間模式 (依時鐘自動，點擊切換為手動夜間)')
              : (isDark ? '當前為手動夜間 (點擊回歸時鐘自動)' : '當前為手動白天 (點擊切換為手動夜間)')
          }
          className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-amber-500 dark:text-cyan-300 shadow-sm transition-all active:scale-95 shrink-0 relative"
        >
          {isDark ? <Moon className="w-3.5 h-3.5 text-cyan-300" /> : <Sun className="w-3.5 h-3.5 animate-spin-slow text-amber-500" />}
          {isAuto && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-white dark:ring-slate-900" title="隨時鐘自動切換" />
          )}
        </button>

        {/* 6. 👤 學生漫遊通行證 / 座號登入按鈕 (個人身分錨定於最右側) */}
        {isLoggedIn ? (
          <button
            onClick={openModal}
            title={t.currentIdentity}
            className="px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 border border-emerald-300 dark:border-emerald-600 text-slate-800 dark:text-slate-100 flex items-center gap-1.5 text-xs font-black shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
          >
            {currentStudent?.avatar_id ? (
              <img
                src={`/assets/avatars/${currentStudent.avatar_id}.webp`}
                alt="Warrior Avatar"
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-amber-400 shadow-sm shrink-0"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            )}
            <span className="font-heading truncate max-w-[110px] hidden sm:inline">
              {formatStudentBadge(currentStudent, lang)}
            </span>
            <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-mono font-black text-[11px] sm:text-xs">
              <Coins className="w-3 h-3" />
              {currentStudent.coins ?? 0}
            </span>
          </button>
        ) : (
          <button
            onClick={openModal}
            title={t.loginToRoam}
            className="p-2 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white flex items-center gap-1.5 text-xs font-black shadow-sm shadow-amber-500/20 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.loginToRoam}</span>
          </button>
        )}
      </div>
    </header>
  );
};
