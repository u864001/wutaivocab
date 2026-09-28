import React from 'react';
import type { PhonicsCard } from '../types/phonics';
import { CATEGORIES_META } from '../data/phonicsData';
import { speakPhoneme } from '../utils/audio';
import { X, Volume2 } from 'lucide-react';

import type { PronunciationMode } from '../utils/audio';

interface PhonicsCardViewProps {
  card: PhonicsCard;
  isInfinite?: boolean;
  isHighlighted?: boolean;
  showRemove?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  className?: string;
  slotIndex?: number;
  pronunciationMode?: PronunciationMode;
}

export const PhonicsCardView: React.FC<PhonicsCardViewProps> = ({
  card,
  isInfinite = false,
  isHighlighted = false,
  showRemove = false,
  onRemove,
  onClick,
  size = 'md',
  draggable = true,
  onDragStart,
  className = '',
  pronunciationMode = 'phoneme',
}) => {
  const meta = CATEGORIES_META[card.category] || CATEGORIES_META.basic_consonants;

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Default action: speak phoneme sound with chosen pronunciation mode
    speakPhoneme(card, pronunciationMode);
    if (onClick) {
      onClick();
    }
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  // Dimensions based on size
  const sizeClasses = {
    sm: 'w-14 h-16 text-2xl',
    md: 'w-20 h-24 text-3xl sm:w-22 sm:h-28 sm:text-4xl',
    lg: 'w-24 h-28 text-4xl sm:w-28 sm:h-32 sm:text-5xl',
  }[size];

  // Check if it's a split digraph like a_e
  const isSplitDigraph = card.isSplit || card.grapheme.includes('_');

  return (
    <div
      role="button"
      tabIndex={0}
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={handleCardClick}
      title={`${card.grapheme} (${card.phonemeSound}) ${card.sampleWord ? '— e.g. ' + card.sampleWord : ''}`}
      className={`
        relative select-none flex flex-col items-center justify-center cursor-pointer rounded-2xl
        border-3 font-phonics font-bold transition-all duration-200 card-tactile
        ${sizeClasses}
        ${meta.bgLight} ${meta.bgDark}
        ${meta.borderLight} ${meta.borderDark}
        ${meta.textLight} ${meta.textDark}
        ${isHighlighted ? 'scale-108 ring-4 ring-amber-400 ring-offset-2 shadow-xl z-20 animate-pulse' : ''}
        ${isSplitDigraph ? 'border-dashed border-4' : ''}
        ${className}
      `}
    >
      {/* Category sound badge / IPA hint */}
      <span className="absolute top-1 text-[10px] sm:text-xs font-sans font-medium px-1.5 py-0.2 rounded-full opacity-75 pointer-events-none truncate max-w-[90%]">
        {card.phonemeSound}
      </span>

      {/* Main Grapheme Text - Single-story early childhood font */}
      <div className="flex items-center justify-center tracking-normal mt-1">
        {isSplitDigraph ? (
          <div className="flex items-center space-x-1">
            <span>{card.grapheme.split('_')[0]}</span>
            <span className="w-2.5 h-0.5 border-b-2 border-dashed border-current opacity-60 mx-0.5"></span>
            <span>{card.grapheme.split('_')[1] || 'e'}</span>
          </div>
        ) : (
          <span>{card.displayText || card.grapheme}</span>
        )}
      </div>

      {/* Infinite badge for dispenser */}
      {isInfinite && (
        <span className="absolute -top-2 -right-1 bg-amber-500 text-white text-[10px] font-sans font-bold px-1.5 py-0.5 rounded-full shadow-sm">
          ∞
        </span>
      )}

      {/* Audio icon indicator on bottom corner */}
      <div className="absolute bottom-1 right-1 opacity-25 hover:opacity-100 transition-opacity">
        <Volume2 className="w-3.5 h-3.5" />
      </div>

      {/* Remove Button on card (for placed cards) */}
      {showRemove && onRemove && (
        <button
          type="button"
          onClick={handleRemoveClick}
          aria-label="Remove card"
          className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-115 active:scale-95 z-30"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
};
