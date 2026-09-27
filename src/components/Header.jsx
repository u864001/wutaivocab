import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { soundEngine } from '../services/audio';
import { Sun, Moon, Volume2, VolumeX, Globe, Sparkles, GraduationCap } from 'lucide-react';

export const Header = ({ onOpenTeacherHub, onOpenLeaderboard, isOnline = true }) => {
  const { isDark, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useI18n();
  const [isMuted, setIsMuted] = React.useState(soundEngine.isMuted);

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="w-full max-w-6xl mx-auto px-4 py-3 sm:py-5 flex items-center justify-between gap-3">
      {/* 學校標題與連線狀態 */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-400 dark:from-indigo-600 dark:to-cyan-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 dark:shadow-indigo-500/30">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-black tracking-wide text-slate-800 dark:text-slate-100 font-heading">
              {t.appName}
            </h1>
            <span className={`text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
              isOnline 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' 
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {isOnline ? t.connected : t.offline}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:block">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* 功能控制區：音效、雙語、主題、教師後台 */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* 教師後台快捷鈕 */}
        <button
          onClick={onOpenTeacherHub}
          title={t.teacherHub}
          className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 text-xs font-black shadow-sm transition-all active:scale-95"
        >
          <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-cyan-400" />
          <span className="hidden md:inline">{t.teacherHub}</span>
        </button>

        {/* 音效開關 */}
        <button
          onClick={handleToggleSound}
          title={isMuted ? t.soundOff : t.soundOn}
          className="p-2 sm:p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm transition-all active:scale-95"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600 dark:text-cyan-400" />}
        </button>

        {/* 雙語切換 */}
        <button
          onClick={toggleLang}
          className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 flex items-center gap-1 text-xs font-black shadow-sm transition-all active:scale-95"
        >
          <Globe className="w-3.5 h-3.5 text-blue-500" />
          <span>{lang === 'zh-TW' ? 'EN' : '中文'}</span>
        </button>

        {/* 主題切換 (☀️ 陽光叢林 vs 🌙 極光星空) */}
        <button
          onClick={toggleTheme}
          title={isDark ? t.themeDay : t.themeNight}
          className="p-2 sm:p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-amber-500 dark:text-cyan-300 shadow-sm transition-all active:scale-95"
        >
          {isDark ? <Sun className="w-4 h-4 animate-spin-slow" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
