import React from 'react';
import type { AppMode, Language, ThemeMode } from '../types/phonics';
import type { PronunciationMode } from '../utils/audio';
import { getT } from '../utils/i18n';
import { Maximize, Minimize, BookOpen, Headphones, Layers, Ear, BookA } from 'lucide-react';

interface HeaderProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  lang: Language;
  onLangChange?: (lang: Language) => void;
  theme?: ThemeMode;
  onThemeChange?: (theme: ThemeMode) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenBank: () => void;
  onBackToLobby?: () => void;
  pronunciationMode?: PronunciationMode;
  onTogglePronunciationMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  lang,
  isFullscreen,
  onToggleFullscreen,
  onOpenBank,
  pronunciationMode = 'phoneme',
  onTogglePronunciationMode,
}) => {
  const t = getT(lang);

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-1.5 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-2.5 border-b border-slate-200/80 dark:border-slate-800/80 mb-1 sm:mb-2 transition-colors overflow-x-auto scrollbar-none">
      {/* Left: Phonics Module Title */}
      <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-sm shrink-0">
          <span className="font-phonics font-bold text-xs sm:text-sm tracking-tighter">Ph</span>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="font-heading font-black text-xs sm:text-base leading-tight text-slate-800 dark:text-slate-100 whitespace-nowrap">
              {t.appShortTitle}
            </h2>
            <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
              TESOL / OG
            </span>
          </div>
        </div>
      </div>

      {/* Center: Mode Switcher (Teaching ⇄ Quiz) + 8 Sound Bank Quick Button */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 sm:p-1 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
          <button
            type="button"
            onClick={() => onModeChange('teaching')}
            className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1 rounded-md sm:rounded-lg text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer ${
              mode === 'teaching'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">{t.teachingMode}</span>
            <span className="sm:hidden">教學</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('quiz')}
            className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1 rounded-md sm:rounded-lg text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer ${
              mode === 'quiz'
                ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Headphones className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">{t.quizMode}</span>
            <span className="sm:hidden">聽測</span>
          </button>
        </div>

        {/* Quick 8 Sound Bank Button */}
        <button
          type="button"
          onClick={onOpenBank}
          title={lang === 'zh' ? '全螢幕開啟八大發音卡池' : 'Open 8 Sound Banks'}
          className="flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-xs sm:text-sm font-black transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden sm:inline">{lang === 'zh' ? '八大卡池' : 'Sound Banks'}</span>
          <span className="sm:hidden">卡池</span>
        </button>
      </div>

      {/* Right: Pronunciation Mode Toggle + Fullscreen */}
      <div className="flex items-center space-x-2">
        {onTogglePronunciationMode && (
          <button
            type="button"
            onClick={onTogglePronunciationMode}
            title={lang === 'zh' ? '切換純音素發音或單字示範音' : 'Toggle Pure Phoneme vs Word Anchor'}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
          >
            {pronunciationMode === 'phoneme' ? (
              <Ear className="w-3.5 h-3.5 text-indigo-500" />
            ) : (
              <BookA className="w-3.5 h-3.5 text-purple-500" />
            )}
            <span className="hidden sm:inline">
              {pronunciationMode === 'phoneme'
                ? lang === 'zh'
                  ? '純音素'
                  : 'Phoneme'
                : lang === 'zh'
                ? '範例字'
                : 'Anchor'}
            </span>
          </button>
        )}

        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={onToggleFullscreen}
          title={isFullscreen ? t.exitFullscreen : t.fullscreen}
          className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
