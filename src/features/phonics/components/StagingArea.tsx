import React from 'react';
import type { PhonicsCard, Language } from '../types/phonics';
import type { PronunciationMode } from '../utils/audio';
import { PhonicsCardView } from './PhonicsCardView';
import { getT } from '../utils/i18n';
import { Sparkles, Layers, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface StagingAreaProps {
  infiniteVowels: PhonicsCard[];
  stagingCards: PhonicsCard[];
  onPlaceCard: (card: PhonicsCard) => void;
  onOpenDrawer: () => void;
  lang: Language;
  pronunciationMode?: PronunciationMode;
}

export const StagingArea: React.FC<StagingAreaProps> = ({
  infiniteVowels,
  stagingCards,
  onPlaceCard,
  onOpenDrawer,
  lang,
  pronunciationMode = 'phoneme',
}) => {
  const t = getT(lang);
  const trayRef = React.useRef<HTMLDivElement>(null);

  const scrollTray = (direction: 'left' | 'right') => {
    if (trayRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      trayRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleDragStart = (e: React.DragEvent, card: PhonicsCard) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(card));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-lg transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch gap-4">
        {/* Left Section: Infinite Vowel Dispenser */}
        <div className="flex flex-col justify-between bg-rose-50/70 dark:bg-rose-950/20 border-2 border-rose-300 dark:border-rose-800/60 rounded-2xl p-2.5 sm:p-3 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300">
                {t.infiniteVowels}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-200/60 dark:bg-rose-900/60 px-1.5 py-0.5 rounded-full">
              ∞ Copy
            </span>
          </div>

          {/* 5 Vowel Cards row */}
          <div className="flex items-center gap-2">
            {infiniteVowels.map((vowel) => (
              <div key={`inf_${vowel.id}`} className="relative group">
                <PhonicsCardView
                  card={vowel}
                  isInfinite={true}
                  size="sm"
                  pronunciationMode={pronunciationMode}
                  onDragStart={(e) => handleDragStart(e, vowel)}
                  onClick={() => onPlaceCard(vowel)}
                  className="sm:w-16! sm:h-20! hover:scale-105"
                />
              </div>
            ))}
          </div>

          <p className="text-[10px] text-rose-700/80 dark:text-rose-400/80 mt-1.5 text-center hidden sm:block">
            {t.infiniteDesc}
          </p>
        </div>

        {/* Right Section: Teacher Selected Staging Tray */}
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-2.5 sm:p-3 relative overflow-hidden">
          {/* Top bar of staging area */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.stagingTray}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {stagingCards.length} {lang === 'zh' ? '張可用' : 'ready'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Prominent Bank Open Button */}
              <button
                type="button"
                onClick={onOpenDrawer}
                className="flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 transition-all active:scale-95 animate-pulse-glow"
              >
                <BookOpen className="w-4 h-4" />
                <span>{lang === 'zh' ? '📚 開啟八大自然發音卡池' : '📚 8 Phonics Sound Banks'}</span>
              </button>

              {/* Scroll buttons */}
              {stagingCards.length > 5 && (
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => scrollTray('left')}
                    aria-label="Scroll left"
                    className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTray('right')}
                    aria-label="Scroll right"
                    className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cards Tray Horizontal Scroll */}
          <div
            ref={trayRef}
            className="flex-1 flex items-center gap-2.5 overflow-x-auto py-1 scroll-smooth"
          >
            {stagingCards.length === 0 ? (
              <div
                onClick={onOpenDrawer}
                className="w-full py-4 text-center cursor-pointer border-2 border-dashed border-indigo-300 dark:border-indigo-700/80 rounded-2xl bg-indigo-50/30 dark:bg-indigo-950/20 hover:bg-indigo-50/60 transition-colors flex items-center justify-center gap-2.5 text-indigo-700 dark:text-indigo-300 font-bold"
              >
                <BookOpen className="w-5 h-5 text-indigo-500 animate-bounce-small" />
                <span className="text-xs sm:text-sm">
                  {lang === 'zh'
                    ? '候用匣目前為空，點擊此處打開「八大發音卡池」展開挑選字卡！'
                    : 'Staging tray is empty. Tap here to open 8 Sound Banks and pick tiles!'}
                </span>
              </div>
            ) : (
              stagingCards.map((card) => (
                <div key={card.id} className="shrink-0">
                  <PhonicsCardView
                    card={card}
                    size="sm"
                    pronunciationMode={pronunciationMode}
                    onDragStart={(e) => handleDragStart(e, card)}
                    onClick={() => onPlaceCard(card)}
                    className="sm:w-16! sm:h-20!"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
