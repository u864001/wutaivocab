import React, { useState, useEffect } from 'react';
import { Volume2, RotateCcw, Sparkles, ChevronDown, ChevronUp, Eye, Delete } from 'lucide-react';
import { soundEngine } from '../../../services/audio';
import { speakMysteriousEnglish } from '../escapeAudio';

export const SpellingPuzzle = ({
  puzzle,
  onSolve,
  onMistake,
  isSolved,
  themeColor = 'indigo'
}) => {
  const targetLetters = puzzle.cleanLetters || [];
  const [slots, setSlots] = useState(() => new Array(targetLetters.length).fill(null));
  const [availableLetters, setAvailableLetters] = useState(() => puzzle.scrambledLetters || []);
  const [feedback, setFeedback] = useState(null);
  const [isChineseOpen, setIsChineseOpen] = useState(false);

  useEffect(() => {
    if (!isSolved && (puzzle?.voiceText || puzzle?.englishSentence)) {
      const timer = setTimeout(() => {
        speakMysteriousEnglish(puzzle.voiceText || puzzle.englishSentence);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [puzzle, isSolved]);

  const handlePlayVoice = () => {
    soundEngine.click();
    speakMysteriousEnglish(puzzle.voiceText || puzzle.englishSentence || puzzle.targetWord?.en);
  };

  const handleLetterClick = (letterObj) => {
    if (isSolved || feedback) return;
    const emptyIndex = slots.findIndex(s => s === null);
    if (emptyIndex === -1) return;

    soundEngine.click();

    const newSlots = [...slots];
    newSlots[emptyIndex] = letterObj;
    setSlots(newSlots);

    setAvailableLetters(prev => prev.filter(l => l.id !== letterObj.id));

    if (emptyIndex === slots.length - 1) {
      validateSpelling(newSlots);
    }
  };

  const handleSlotClick = (index) => {
    if (isSolved || feedback) return;
    const item = slots[index];
    if (!item) return;

    soundEngine.click();

    const newSlots = [...slots];
    newSlots[index] = null;
    setSlots(newSlots);

    setAvailableLetters(prev => [...prev, item]);
  };

  // ⌫ 退回最後一個填入的字母
  const handleBackspace = () => {
    if (isSolved || feedback) return;
    for (let i = slots.length - 1; i >= 0; i--) {
      if (slots[i]) {
        handleSlotClick(i);
        break;
      }
    }
  };

  // 🔄 清空重排全部字母
  const handleResetSlots = () => {
    if (isSolved || feedback) return;
    soundEngine.click();
    setSlots(new Array(targetLetters.length).fill(null));
    setAvailableLetters(puzzle.scrambledLetters || []);
    setFeedback(null);
  };

  const validateSpelling = (currentSlots) => {
    const spelled = currentSlots.map(s => s?.char || '').join('').toLowerCase();
    const target = targetLetters.join('').toLowerCase();

    if (spelled === target) {
      setFeedback('correct');
      soundEngine.correct();
      setTimeout(() => {
        onSolve(puzzle.id, puzzle.targetWord);
      }, 1000);
    } else {
      setFeedback('wrong');
      soundEngine.wrong();
      onMistake(puzzle.id, { spelled });
      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }
  };

  // 🌟 單字分組邏輯：若目標單字包含空格（如 "social studies"），依單詞視覺分組
  const wordTokens = (puzzle.targetText || puzzle.targetWord?.en || '')
    .trim()
    .split(/\s+/)
    .map(w => w.replace(/[^a-zA-Z]/g, '').toLowerCase())
    .filter(Boolean);

  let slotGroups = [];
  if (wordTokens.length > 1 && wordTokens.join('').length === targetLetters.length) {
    let cursor = 0;
    wordTokens.forEach(token => {
      const groupIndices = [];
      for (let i = 0; i < token.length; i++) {
        groupIndices.push(cursor++);
      }
      slotGroups.push({ word: token, indices: groupIndices });
    });
  } else {
    slotGroups = [{ word: '', indices: targetLetters.map((_, i) => i) }];
  }

  // 依字母總長度自適應卡槽與符文字體大小，防止高年級長單字爆版
  const totalLetters = targetLetters.length;
  const isSuperLong = totalLetters >= 10;
  const isLong = totalLetters >= 7;

  const slotSizeClass = isSuperLong
    ? 'w-7 h-9 sm:w-9 sm:h-11 text-base sm:text-lg rounded-xl border-2'
    : isLong
    ? 'w-9 h-11 sm:w-11 sm:h-13 text-lg sm:text-xl rounded-xl sm:rounded-2xl border-2'
    : 'w-11 h-13 sm:w-14 sm:h-16 text-xl sm:text-2xl rounded-2xl border-2 sm:border-3';

  const availSizeClass = isSuperLong
    ? 'w-8 h-8 sm:w-10 sm:h-10 text-base sm:text-lg rounded-xl'
    : isLong
    ? 'w-9 h-9 sm:w-11 sm:h-11 text-lg sm:text-xl rounded-xl'
    : 'w-11 h-11 sm:w-13 sm:h-13 text-xl sm:text-2xl rounded-2xl';

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-5 text-center select-none animate-fadeIn overflow-x-hidden">
      {/* 英文句子與中文譯文提示卡 */}
      <div className="w-full max-w-xl mb-3 sm:mb-4 p-3.5 sm:p-4 rounded-3xl bg-indigo-950/40 border-2 border-indigo-500/50 shadow-xl text-left relative">
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>拼字符文解碼 (Rune Unscramble)</span>
          </div>

          <button
            onClick={handlePlayVoice}
            className="p-1.5 sm:px-3 sm:py-1 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black text-xs transition-all active:scale-95 flex items-center gap-1.5 shadow-md cursor-pointer"
            title="以神秘低沉語音朗讀"
          >
            <Volume2 className="w-4 h-4" />
            <span>聆聽發音</span>
          </button>
        </div>

        {/* 英文句子 / 提示 */}
        <p className="text-base sm:text-lg font-heading font-black text-indigo-100 tracking-wide leading-relaxed my-1.5">
          "{puzzle.englishPrompt || puzzle.englishSentence}"
        </p>

        {/* 預設隱藏的中文譯文 (點擊展開) */}
        <div className="mt-2.5 pt-2.5 border-t border-white/10">
          <button
            type="button"
            onClick={() => {
              soundEngine.click();
              setIsChineseOpen(!isChineseOpen);
            }}
            className="text-xs font-black text-indigo-400/90 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isChineseOpen ? '收合中文詳解' : '📜 揭示古代石刻中文譯文 (點擊展開)'}</span>
            {isChineseOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isChineseOpen && (
            <div className="mt-2 p-2.5 rounded-xl bg-black/40 text-xs sm:text-sm font-bold text-slate-300 animate-fadeIn">
              {puzzle.chineseClue}
            </div>
          )}
        </div>
      </div>

      {/* 拼字卡槽展示區（支援多單字分組換行與長單字響應式縮放，100% 絕不破版） */}
      <div className="w-full max-w-full flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mb-3 min-h-[52px] px-2">
        {slotGroups.map((group, gIdx) => (
          <div
            key={gIdx}
            className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 shadow-inner"
          >
            {group.indices.map((index) => {
              const slotItem = slots[index];
              let slotStyle = 'bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100';

              if (isSolved) {
                slotStyle = 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/30';
              } else if (slotItem) {
                if (feedback === 'correct') {
                  slotStyle = 'bg-emerald-500 text-white border-emerald-400 shadow-lg';
                } else if (feedback === 'wrong') {
                  slotStyle = 'bg-rose-500 text-white border-rose-400 animate-shake';
                } else {
                  slotStyle = 'bg-indigo-500 text-white border-indigo-400 shadow-md';
                }
              }

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSlotClick(index)}
                  disabled={isSolved || !slotItem || Boolean(feedback)}
                  className={`${slotSizeClass} font-black font-heading flex items-center justify-center transition-all duration-150 active:scale-90 cursor-pointer shadow-sm ${slotStyle}`}
                  title={slotItem ? '點擊退回字母' : `第 ${index + 1} 格`}
                >
                  {slotItem ? slotItem.char.toUpperCase() : '_'}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* 快捷操作按鈕列：退格、全部重排（常駐中間，任何螢幕都不會被切掉或推到螢幕外） */}
      <div className="flex items-center justify-center gap-2.5 mb-3.5 flex-wrap">
        <button
          type="button"
          onClick={handleBackspace}
          disabled={isSolved || Boolean(feedback) || !slots.some(Boolean)}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 border border-slate-700 text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
          title="退回上一格字母"
        >
          <Delete className="w-3.5 h-3.5 text-amber-400" />
          <span>⌫ 刪除上一格</span>
        </button>

        <button
          type="button"
          onClick={handleResetSlots}
          disabled={isSolved || Boolean(feedback) || !slots.some(Boolean)}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 border border-slate-700 text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
          title="清空重排全部字母"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>🔄 全部重排</span>
        </button>
      </div>

      {/* 散落符文字母池 (大按鈕，點擊即上槽) */}
      <div className="w-full max-w-lg p-2.5 sm:p-3.5 rounded-3xl bg-slate-900/80 border border-slate-700/80">
        <p className="text-[11px] sm:text-xs font-black text-slate-400 mb-2 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>點選散落的字母符文填入空格</span>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {availableLetters.map((letter) => (
            <button
              key={letter.id}
              type="button"
              onClick={() => handleLetterClick(letter)}
              disabled={isSolved || Boolean(feedback)}
              className={`${availSizeClass} bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-400 font-black font-heading flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer`}
            >
              {letter.char.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
