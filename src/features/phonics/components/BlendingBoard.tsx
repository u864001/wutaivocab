import React, { useState } from 'react';
import type { PlacedCard, PhonicsCard, Language } from '../types/phonics';
import type { PronunciationMode } from '../utils/audio';
import { PhonicsCardView } from './PhonicsCardView';
import { blendPhonemeSequence, playRemoveSound } from '../utils/audio';
import { REAL_WORDS_DICTIONARY } from '../data/phonicsData';
import { getT } from '../utils/i18n';
import {
  Volume2,
  RotateCcw,
  Sparkles,
  Turtle,
  Rabbit,
  PlusCircle,
  HelpCircle,
  CheckCircle2,
  Ear,
  BookA,
} from 'lucide-react';

interface BlendingBoardProps {
  placedCards: PlacedCard[];
  onCardsChange: (cards: PlacedCard[]) => void;
  onDropCard: (card: PhonicsCard, targetIndex?: number) => void;
  onRemoveCard: (instanceId: string) => void;
  onClearBoard: () => void;
  lang: Language;
  pronunciationMode: PronunciationMode;
  onTogglePronunciationMode: () => void;
}

export const BlendingBoard: React.FC<BlendingBoardProps> = ({
  placedCards,
  onCardsChange,
  onDropCard,
  onRemoveCard,
  onClearBoard,
  lang,
  pronunciationMode,
  onTogglePronunciationMode,
}) => {
  const t = getT(lang);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [isSlowBlending, setIsSlowBlending] = useState<boolean>(false);
  const [isBlending, setIsBlending] = useState<boolean>(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  // Compute combined word string
  const combinedWord = placedCards
    .map((pc) => {
      if (pc.card.isSplit || pc.card.grapheme.includes('_')) {
        return pc.card.grapheme.replace('_', '');
      }
      return pc.card.grapheme.replace(/\([^)]*\)/g, ''); // strip (voiced)/(unvoiced)
    })
    .join('')
    .toLowerCase();

  // Check if it forms a recognized word in our dictionary
  const recognizedWordEntry = REAL_WORDS_DICTIONARY[combinedWord];

  // Perform sequential blend and speak
  const handleBlendAndSpeak = async () => {
    if (placedCards.length === 0 || isBlending) return;
    setIsBlending(true);
    const cards = placedCards.map((pc) => pc.card);
    await blendPhonemeSequence(cards, isSlowBlending, setHighlightedIndex, combinedWord, pronunciationMode);
    setIsBlending(false);
  };

  // Drag and drop handlers
  const handleBoardDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleBoardDrop = (e: React.DragEvent, slotIdx?: number) => {
    e.preventDefault();
    const dataStr = e.dataTransfer.getData('text/plain');
    if (!dataStr) return;

    try {
      const data = JSON.parse(dataStr);
      // Case 1: Reordering internal placed card
      if (data.isInternalReorder && typeof data.sourceIndex === 'number') {
        const newCards = [...placedCards];
        const [movedCard] = newCards.splice(data.sourceIndex, 1);
        const destination = typeof slotIdx === 'number' ? slotIdx : newCards.length;
        newCards.splice(destination, 0, movedCard);
        onCardsChange(newCards);
        return;
      }

      // Case 2: New card dropped from Staging Tray or Infinite Dispenser
      if (data.id && data.grapheme) {
        onDropCard(data as PhonicsCard, slotIdx);
      }
    } catch {
      // ignore invalid data
    }
  };

  const handleSlotDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({ isInternalReorder: true, sourceIndex: index })
    );
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSlotDragEnd = () => {
    setDraggedItemIndex(null);
  };

  // 依卡片數量動態計算槽位：預設 3 格 (C-V-C)，放滿後永遠只保留 1 個待放置格，避免手機端被多餘空槽擠成兩排
  const slotCount = Math.max(placedCards.length === 0 ? 3 : placedCards.length + 1, 3);

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-between p-2 sm:p-6 max-w-6xl mx-auto">
      {/* Real Word Discovery Banner */}
      <div className="w-full flex justify-center min-h-[40px] sm:min-h-[52px] mb-1 sm:mb-4">
        {placedCards.length > 0 && recognizedWordEntry ? (
          <div className="flex items-center gap-2.5 sm:gap-3 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 dark:border-emerald-600 shadow-md animate-pop">
            <span className="text-2xl sm:text-4xl">{recognizedWordEntry.emoji}</span>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-phonics text-lg sm:text-2xl font-bold text-emerald-800 dark:text-emerald-300">
                  {recognizedWordEntry.word}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>{t.realWordFound}</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-700 dark:text-emerald-400 font-medium truncate max-w-[220px] sm:max-w-none">
                {lang === 'zh' ? recognizedWordEntry.meaningZh : recognizedWordEntry.meaningEn}
              </p>
            </div>
          </div>
        ) : placedCards.length > 0 ? (
          <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-phonics font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">
              "{combinedWord}"
            </span>
            <span className="text-[10px] sm:text-xs opacity-80 hidden sm:inline">— {t.pseudoWordNotice}</span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2 text-slate-400 text-xs sm:text-sm italic">
            <span>{t.blendingBoardDesc}</span>
          </div>
        )}
      </div>

      {/* Main Magnetic Elkonin Sound Slots Board */}
      <div
        onDragOver={handleBoardDragOver}
        onDrop={(e) => handleBoardDrop(e)}
        className="w-full relative my-auto p-2.5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-radial from-slate-50 to-indigo-50/50 dark:from-slate-900/90 dark:to-indigo-950/20 border-2 sm:border-4 border-slate-300 dark:border-slate-700 shadow-xl flex flex-col items-center justify-center min-h-[170px] sm:min-h-[260px]"
      >
        {/* Subtle Magnetic Grid Ruler / Guide line */}
        <div className="absolute top-1/2 left-4 right-4 sm:left-6 sm:right-6 h-1 border-b-2 border-dashed border-slate-300/80 dark:border-slate-700/80 -translate-y-1/2 pointer-events-none z-0" />

        {/* Sound Slots Flex container: 強制在手機直立時保持單排 (flex-nowrap)，超過長度則平滑橫向滾動 */}
        <div className="relative z-10 flex flex-nowrap items-center justify-center gap-2 sm:gap-3 md:gap-4 max-w-full overflow-x-auto py-2 px-1 scrollbar-none">
          {Array.from({ length: slotCount }).map((_, index) => {
            const placed = placedCards[index];
            const isHighlighted = highlightedIndex === index || highlightedIndex === -1;

            if (placed) {
              return (
                <div
                  key={placed.instanceId}
                  draggable
                  onDragStart={(e) => handleSlotDragStart(e, index)}
                  onDragEnd={handleSlotDragEnd}
                  onDragOver={handleBoardDragOver}
                  onDrop={(e) => handleBoardDrop(e, index)}
                  className={`relative shrink-0 transition-all duration-200 ${
                    draggedItemIndex === index ? 'opacity-40 scale-95' : ''
                  }`}
                >
                  <PhonicsCardView
                    card={placed.card}
                    size="lg"
                    isHighlighted={isHighlighted}
                    showRemove={true}
                    pronunciationMode={pronunciationMode}
                    onRemove={() => {
                      playRemoveSound();
                      onRemoveCard(placed.instanceId);
                    }}
                    className="hover:scale-103"
                  />
                  {/* Slot Number Indicator */}
                  <div className="text-center mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500">
                    {index + 1}
                  </div>
                </div>
              );
            }

            // Empty Slot (手機端為乾淨精簡的 + 號虛線格，避免小文字排版擠壓)
            return (
              <div
                key={`empty_slot_${index}`}
                onDragOver={handleBoardDragOver}
                onDrop={(e) => handleBoardDrop(e, index)}
                className="flex flex-col items-center shrink-0"
              >
                <div className="w-[70px] h-[90px] sm:w-24 sm:h-28 md:w-28 md:h-32 rounded-2xl border-3 border-dashed border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-800/20 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/20 transition-all flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 cursor-pointer group">
                  <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all sm:mb-1" />
                  <span className="text-[10px] font-medium opacity-60 hidden sm:inline text-center px-1">
                    {t.slotDropPrompt} {index + 1}
                  </span>
                </div>
                <div className="text-center mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] font-mono font-bold text-slate-300 dark:text-slate-600">
                  {index + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tip for touch screens (手機端隱藏，節省縱向視野) */}
        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-1.5 opacity-80">
          <span>{t.dragOrTapTip}</span>
        </div>
      </div>

      {/* Bottom Control Toolbar */}
      <div className="w-full mt-2 sm:mt-4 flex flex-nowrap items-center justify-between gap-1.5 sm:gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm">
        {/* Left: Speed Toggle & Pronunciation Mode Toggle */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          {/* Speed Toggle */}
          <button
            type="button"
            onClick={() => setIsSlowBlending(!isSlowBlending)}
            className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black border transition-all cursor-pointer ${
              isSlowBlending
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
            }`}
          >
            {isSlowBlending ? <Turtle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" /> : <Rabbit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />}
            <span className="hidden sm:inline">{isSlowBlending ? t.slowBlending : t.fastBlending}</span>
            <span className="sm:hidden">{isSlowBlending ? '0.7x' : '1.0x'}</span>
          </button>

          {/* Pronunciation Mode Switch (Phoneme vs Word) */}
          <button
            type="button"
            onClick={onTogglePronunciationMode}
            title={lang === 'zh' ? '切換純音素發音或單字示範音' : 'Toggle Pure Phoneme vs Word Anchor'}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-all cursor-pointer"
          >
            {pronunciationMode === 'phoneme' ? <Ear className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" /> : <BookA className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500" />}
            <span className="hidden sm:inline">
              {pronunciationMode === 'phoneme'
                ? lang === 'zh'
                  ? '純音素發音'
                  : 'Pure Phoneme'
                : lang === 'zh'
                ? '示範單字 (apple)'
                : 'Anchor Word'}
            </span>
            <span className="sm:hidden">
              {pronunciationMode === 'phoneme' ? '音素' : '單字'}
            </span>
          </button>
        </div>

        {/* Center: Main Blend & Speak Button */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            disabled={placedCards.length === 0 || isBlending}
            onClick={handleBlendAndSpeak}
            className={`flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-8 py-1.5 sm:py-3 rounded-xl sm:rounded-2xl font-black text-xs sm:text-base text-white shadow-lg transition-all duration-200 cursor-pointer ${
              placedCards.length === 0
                ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                : isBlending
                ? 'bg-indigo-700 scale-98 shadow-md'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/25 active:scale-97'
            }`}
          >
            <Volume2 className={`w-4 h-4 sm:w-5 sm:h-5 ${isBlending ? 'animate-bounce' : ''}`} />
            <span>{isBlending ? (lang === 'zh' ? '拼讀中' : 'Blending') : (lang === 'zh' ? '連綴拼讀' : 'Blend')}</span>
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-75 hidden sm:inline" />
          </button>
        </div>

        {/* Right: Reset / Clear Board Button */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          <button
            type="button"
            disabled={placedCards.length === 0}
            onClick={onClearBoard}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{t.clearBoard}</span>
            <span className="sm:hidden">{lang === 'zh' ? '清空' : 'Clear'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
