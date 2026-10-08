import React, { useState, useMemo, useRef } from 'react';
import type { PhonicsCard, Language } from '../types/phonics';
import type { PronunciationMode } from '../utils/audio';
import { PhonicsCardView } from './PhonicsCardView';
import { getT } from '../utils/i18n';
import { Sparkles, Layers, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface StagingAreaProps {
  allCards: PhonicsCard[];
  infiniteVowels: PhonicsCard[];
  stagingCards: PhonicsCard[];
  onPlaceCard: (card: PhonicsCard) => void;
  onOpenDrawer: () => void;
  lang: Language;
  pronunciationMode?: PronunciationMode;
}

// 5 大母音家族分類標籤（全面涵蓋短母音、雙母音、複合音、魔術e與捲舌音）
const VOWEL_TABS = [
  { id: 'short', nameZh: '短母音', nameEn: 'Short', badge: 'aeiou', color: 'rose' },
  { id: 'teams', nameZh: '雙母音', nameEn: 'Teams', badge: 'ee/ea/ai', color: 'emerald' },
  { id: 'diphthongs', nameZh: '複合音', nameEn: 'Glides', badge: 'ou/ow/oi', color: 'amber' },
  { id: 'silent_e', nameZh: '魔術 e', nameEn: 'Magic e', badge: 'a_e', color: 'orange' },
  { id: 'r_controlled', nameZh: '捲舌 R', nameEn: 'Bossy R', badge: 'ar/er', color: 'purple' },
];

export const StagingArea: React.FC<StagingAreaProps> = ({
  allCards,
  stagingCards,
  onPlaceCard,
  onOpenDrawer,
  lang,
  pronunciationMode = 'phoneme',
}) => {
  const t = getT(lang);
  const [activeVowelTab, setActiveVowelTab] = useState<string>('short');
  const trayRef = useRef<HTMLDivElement>(null);
  const vowelRef = useRef<HTMLDivElement>(null);

  // 依當前選中的母音分類，動態抓取對應的無限取用母音卡片
  const activeVowels = useMemo(() => {
    switch (activeVowelTab) {
      case 'teams':
        return allCards.filter(
          (c) => c.category === 'vowel_teams' && ['ee', 'ea', 'ai', 'ay', 'oa', 'igh', 'ew'].includes(c.grapheme)
        );
      case 'diphthongs':
        return allCards.filter(
          (c) => c.category === 'vowel_teams' && ['ou', 'ow', 'oi', 'oy', 'oo', 'au', 'aw'].includes(c.grapheme)
        );
      case 'silent_e':
        return allCards.filter((c) => c.category === 'silent_e');
      case 'r_controlled':
        return allCards.filter((c) => c.category === 'r_controlled');
      case 'short':
      default:
        return allCards.filter(
          (c) => c.category === 'short_vowels' && ['a', 'e', 'i', 'o', 'u'].includes(c.grapheme)
        );
    }
  }, [allCards, activeVowelTab]);

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
    <div className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-2 sm:p-4 shadow-lg transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch gap-2.5 sm:gap-4">
        {/* ══════════════════════════════════════════════════════════ */}
        {/* 💖 左側：母音百寶箱 (全面支援短母音、雙母音、複合音、魔術e、捲舌R) */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div className="flex flex-col justify-between bg-rose-50/70 dark:bg-rose-950/20 border-2 border-rose-300 dark:border-rose-800/60 rounded-2xl p-2 sm:p-3 shrink-0 md:max-w-[460px]">
          {/* 母音分類切換列 */}
          <div className="flex items-center justify-between gap-1 mb-1.5 sm:mb-2">
            <div className="flex items-center space-x-1 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-xs font-black text-rose-800 dark:text-rose-300">
                {lang === 'zh' ? '母音百寶箱' : 'Vowel Hub'}
              </span>
            </div>

            {/* 母音 5 大分類切換標籤 */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
              {VOWEL_TABS.map((tab) => {
                const isActive = activeVowelTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveVowelTab(tab.id)}
                    className={`px-1.5 sm:px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-black transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-xs scale-102'
                        : 'bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{lang === 'zh' ? tab.nameZh : tab.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 無限母音卡片水平陳列列 */}
          <div
            ref={vowelRef}
            className="flex items-center gap-3 sm:gap-3.5 overflow-x-auto py-1 px-1 scrollbar-none min-h-[72px] sm:min-h-[86px]"
          >
            {activeVowels.map((vowel) => (
              <div key={`inf_${vowel.id}`} className="relative group shrink-0">
                <PhonicsCardView
                  card={vowel}
                  isInfinite={false}
                  size="sm"
                  pronunciationMode={pronunciationMode}
                  onDragStart={(e) => handleDragStart(e, vowel)}
                  onClick={() => onPlaceCard(vowel)}
                  className="w-14 h-17 sm:w-16 sm:h-20 hover:scale-105"
                />
              </div>
            ))}
          </div>

          <p className="text-[10px] text-rose-700/80 dark:text-rose-400/80 mt-1 text-center hidden sm:block">
            {lang === 'zh'
              ? '✨ 點選或拖曳母音即可放置於導軌；切換上方標籤探索雙母音與魔術e！'
              : '✨ Tap or drag vowels to the board; switch tabs above to explore vowel teams!'}
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* 🛡️ 右側：子音字卡專區 (Consonant Staging Tray，單子音、雙子音、複合子音) */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-2 sm:p-3 relative overflow-hidden">
          {/* 子音匣頂部工具列 */}
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                {lang === 'zh' ? '子音字卡專區' : 'Consonants'}
              </span>
              <span className="text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {stagingCards.length}
                <span className="hidden sm:inline"> {lang === 'zh' ? '張可用' : 'ready'}</span>
              </span>
            </div>

            <div className="flex items-center space-x-1.5 sm:space-x-2">
              {/* 開啟 8 大卡池按鈕 */}
              <button
                type="button"
                onClick={onOpenDrawer}
                className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-black shadow-md shadow-indigo-500/20 transition-all active:scale-95 animate-pulse-glow cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">
                  {lang === 'zh' ? '📚 開啟八大自然發音卡池' : '📚 8 Phonics Sound Banks'}
                </span>
                <span className="sm:hidden">{lang === 'zh' ? '8大卡池' : 'Banks'}</span>
              </button>

              {/* 電腦版左右滾動按鈕 */}
              {stagingCards.length > 5 && (
                <div className="hidden sm:flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => scrollTray('left')}
                    aria-label="Scroll left"
                    className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTray('right')}
                    aria-label="Scroll right"
                    className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 子音卡片水平捲軸 */}
          <div
            ref={trayRef}
            className="flex-1 flex items-center gap-3 sm:gap-3.5 overflow-x-auto py-1 px-1 scroll-smooth scrollbar-none min-h-[72px] sm:min-h-[86px]"
          >
            {stagingCards.length === 0 ? (
              <div
                onClick={onOpenDrawer}
                className="w-full py-3 sm:py-4 text-center cursor-pointer border-2 border-dashed border-indigo-300 dark:border-indigo-700/80 rounded-2xl bg-indigo-50/30 dark:bg-indigo-950/20 hover:bg-indigo-50/60 transition-colors flex items-center justify-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold"
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 animate-bounce-small" />
                <span className="text-xs sm:text-sm">
                  {lang === 'zh'
                    ? '子音匣為空，點擊此處打開「八大卡池」挑選子音！'
                    : 'Consonant tray is empty. Tap here to pick consonants!'}
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
                    className="w-14 h-17 sm:w-16 sm:h-20 hover:scale-105"
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
