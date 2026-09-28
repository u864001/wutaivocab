import React from 'react';
import type { AppMode, Language, ThemeMode } from '../types/phonics';
import { getT } from '../utils/i18n';
import { Sun, Moon, Globe, Maximize, Minimize, BookOpen, Headphones, Layers, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenBank: () => void;
  onBackToLobby?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  lang,
  onLangChange,
  theme,
  onThemeChange,
  isFullscreen,
  onToggleFullscreen,
  onOpenBank,
  onBackToLobby,
}) => {
  const t = getT(lang);

  return (
    <header className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-3 sm:px-6 py-2.5 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-2.5">
          {onBackToLobby && (
            <button
              type="button"
              onClick={onBackToLobby}
              title={lang === 'zh' ? '返回遊戲大廳' : 'Back to Lobby'}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <span className="font-phonics font-bold text-xl tracking-tighter">Ph</span>
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg leading-tight text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <span>{t.appShortTitle}</span>
              <span className="hidden md:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                TESOL / OG
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate max-w-xs md:max-w-md">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Center: Mode Switcher (Teaching ⇄ Quiz) + 8 Sound Bank Quick Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
            <button
              type="button"
              onClick={() => onModeChange('teaching')}
              className={`flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 ${
                mode === 'teaching'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{t.teachingMode}</span>
            </button>

            <button
              type="button"
              onClick={() => onModeChange('quiz')}
              className={`flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 ${
                mode === 'quiz'
                  ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>{t.quizMode}</span>
            </button>
          </div>

          {/* Quick Bank Button in Header */}
          <button
            type="button"
            onClick={onOpenBank}
            title={lang === 'zh' ? '全螢幕開啟八大發音卡池' : 'Open 8 Sound Banks'}
            className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl border-2 border-indigo-500/40 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-xs sm:text-sm font-bold transition-all"
          >
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>{lang === 'zh' ? '八大卡池' : 'Sound Bank'}</span>
          </button>
        </div>

        {/* Top-Right Controls: Global Language Switch, Light/Dark Theme Switch, Fullscreen */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={onToggleFullscreen}
            title={isFullscreen ? t.exitFullscreen : t.fullscreen}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isFullscreen ? <Minimize className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Global Language Toggle (EN / 繁中) */}
          <button
            type="button"
            onClick={() => onLangChange(lang === 'zh' ? 'en' : 'zh')}
            title={lang === 'zh' ? 'Switch to English' : '切換為繁體中文'}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Globe className="w-4 h-4 text-indigo-500" />
            <span>{lang === 'zh' ? 'EN' : '繁中'}</span>
          </button>

          {/* Day / Night Theme Toggle */}
          <button
            type="button"
            onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
            title={theme === 'light' ? t.darkMode : t.lightMode}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            ) : (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
