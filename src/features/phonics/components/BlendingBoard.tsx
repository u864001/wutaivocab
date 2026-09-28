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

  // Number of visible slots to render: at least 5, or placedCards.length + 1
  const slotCount = Math.max(5, placedCards.length + 1);

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-between p-3 sm:p-6 max-w-6xl mx-auto">
      {/* Real Word Discovery Banner */}
      <div className="w-full flex justify-center min-h-[52px] mb-2 sm:mb-4">
        {placedCards.length > 0 && recognizedWordEntry ? (
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 dark:border-emerald-600 shadow-md animate-pop">
            <span className="text-3xl sm:text-4xl">{recognizedWordEntry.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-phonics text-xl sm:text-2xl font-bold text-emerald-800 dark:text-emerald-300">
                  {recognizedWordEntry.word}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t.realWordFound}
                </span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                {lang === 'zh' ? recognizedWordEntry.meaningZh : recognizedWordEntry.meaningEn}
              </p>
            </div>
          </div>
        ) : placedCards.length > 0 ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span className="font-phonics font-bold text-base text-slate-800 dark:text-slate-200">
              "{combinedWord}"
            </span>
            <span className="text-xs opacity-80">— {t.pseudoWordNotice}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm italic">
            <span>{t.blendingBoardDesc}</span>
          </div>
        )}
      </div>

      {/* Main Magnetic Elkonin Sound Slots Board */}
      <div
        onDragOver={handleBoardDragOver}
        onDrop={(e) => handleBoardDrop(e)}
        className="w-full relative my-auto p-4 sm:p-8 rounded-3xl bg-radial from-slate-50 to-indigo-50/50 dark:from-slate-900/90 dark:to-indigo-950/20 border-4 border-slate-300 dark:border-slate-700 shadow-xl flex flex-col items-center justify-center min-h-[220px] sm:min-h-[280px]"
      >
        {/* Subtle Magnetic Grid Ruler / Guide line */}
        <div className="absolute top-1/2 left-6 right-6 h-1 border-b-2 border-dashed border-slate-300/80 dark:border-slate-700/80 -translate-y-1/2 pointer-events-none z-0" />

        {/* Sound Slots Flex container */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5 max-w-full">
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
                  className={`relative transition-all duration-200 ${
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
                  <div className="text-center mt-1 text-[11px] font-sans font-bold text-slate-400 dark:text-slate-500">
                    {index + 1}
                  </div>
                </div>
              );
            }

            // Empty Slot
            return (
              <div
                key={`empty_slot_${index}`}
                onDragOver={handleBoardDragOver}
                onDrop={(e) => handleBoardDrop(e, index)}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl border-3 border-dashed border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-800/20 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/20 transition-all flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 cursor-pointer group">
                  <PlusCircle className="w-6 h-6 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all mb-1" />
                  <span className="text-[11px] font-medium opacity-60">
                    {t.slotDropPrompt} {index + 1}
                  </span>
                </div>
                <div className="text-center mt-1 text-[11px] font-sans font-bold text-slate-300 dark:text-slate-600">
                  {index + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tip for touch screens */}
        <div className="mt-4 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 opacity-80">
          <span>{t.dragOrTapTip}</span>
        </div>
      </div>

      {/* Bottom Control Toolbar */}
      <div className="w-full mt-4 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-2xl shadow-sm">
        {/* Left: Speed Toggle & Pronunciation Mode Toggle */}
        <div className="flex items-center space-x-2">
          {/* Speed Toggle */}
          <button
            type="button"
            onClick={() => setIsSlowBlending(!isSlowBlending)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
              isSlowBlending
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
            }`}
          >
            {isSlowBlending ? <Turtle className="w-4 h-4 text-amber-500" /> : <Rabbit className="w-4 h-4 text-slate-500" />}
            <span>{isSlowBlending ? t.slowBlending : t.fastBlending}</span>
          </button>

          {/* Pronunciation Mode Switch (Phoneme vs Word) */}
          <button
            type="button"
            onClick={onTogglePronunciationMode}
            title={lang === 'zh' ? '切換純音素發音或單字示範音' : 'Toggle Pure Phoneme vs Word Anchor'}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-all"
          >
            {pronunciationMode === 'phoneme' ? <Ear className="w-4 h-4 text-indigo-500" /> : <BookA className="w-4 h-4 text-purple-500" />}
            <span>
              {pronunciationMode === 'phoneme'
                ? lang === 'zh'
                  ? '純音素發音'
                  : 'Pure Phoneme'
                : lang === 'zh'
                ? '示範單字 (apple)'
                : 'Anchor Word'}
            </span>
          </button>
        </div>

        {/* Center: Main Blend & Speak Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={placedCards.length === 0 || isBlending}
            onClick={handleBlendAndSpeak}
            className={`flex items-center space-x-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl font-bold text-sm sm:text-base text-white shadow-lg transition-all duration-200 ${
              placedCards.length === 0
                ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                : isBlending
                ? 'bg-indigo-700 scale-98 shadow-md'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/25 active:scale-97'
            }`}
          >
            <Volume2 className={`w-5 h-5 ${isBlending ? 'animate-bounce' : ''}`} />
            <span>{isBlending ? t.blendingActive : t.blendAndSpeak}</span>
            <Sparkles className="w-4 h-4 opacity-75" />
          </button>
        </div>

        {/* Right: Reset / Clear Board Button */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            disabled={placedCards.length === 0}
            onClick={onClearBoard}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.clearBoard}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
