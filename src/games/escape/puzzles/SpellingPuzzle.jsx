import React, { useState, useEffect } from 'react';
import { Volume2, RotateCcw, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import { soundEngine, speakEnglish } from '../../../services/audio';

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
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

  // 點擊發音
  const handlePlayVoice = () => {
    soundEngine.click();
    speakEnglish(puzzle.targetWord.en);
  };

  // 點擊散落字母：放入第一個空格
  const handleLetterClick = (letterObj) => {
    if (isSolved || feedback) return;
    const emptyIndex = slots.findIndex(s => s === null);
    if (emptyIndex === -1) return;

    soundEngine.click();

    // 移入槽位
    const newSlots = [...slots];
    newSlots[emptyIndex] = letterObj;
    setSlots(newSlots);

    // 從散落池中隱藏
    setAvailableLetters(prev => prev.filter(l => l.id !== letterObj.id));

    // 若所有空格已填滿，進行校驗
    if (emptyIndex === slots.length - 1) {
      validateSpelling(newSlots);
    }
  };

  // 點擊已填入槽位：退回該字母
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

  // 重置槽位
  const handleResetSlots = () => {
    if (isSolved || feedback) return;
    soundEngine.click();
    setSlots(new Array(targetLetters.length).fill(null));
    setAvailableLetters(puzzle.scrambledLetters || []);
    setFeedback(null);
  };

  // 校驗拼字
  const validateSpelling = (currentSlots) => {
    const spelled = currentSlots.map(s => s?.char || '').join('').toLowerCase();
    const target = targetLetters.join('').toLowerCase();

    if (spelled === target) {
      setFeedback('correct');
      soundEngine.correct();
      speakEnglish(puzzle.targetWord.en);
      setTimeout(() => {
        onSolve(puzzle.id, puzzle.targetWord);
      }, 1000);
    } else {
      setFeedback('wrong');
      soundEngine.wrong();
      onMistake(puzzle.id, { spelled });
      setTimeout(() => {
        setFeedback(null);
        // 保留槽位讓學生自主調整，或退回錯誤字母
      }, 1000);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-3 sm:p-5 text-center select-none animate-fadeIn">
      {/* 題目指引區塊 */}
      <div className="mb-4 sm:mb-6 flex items-center justify-center gap-3">
        <div className="px-5 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-300 dark:border-indigo-700/80 shadow-md flex items-center gap-3">
          <span className="text-xl sm:text-2xl font-black text-indigo-950 dark:text-indigo-100 font-heading">
            {puzzle.targetWord.zh}
          </span>
          <button
            onClick={handlePlayVoice}
            className="p-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm active:scale-95 transition-all cursor-pointer"
            title="聆聽發音提示"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={handleResetSlots}
          disabled={isSolved || feedback}
          className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-all active:scale-95 cursor-pointer"
          title="重設拼字槽"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* 拼字卡槽展示列 (iPad 觸控點擊退回) */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 min-h-[64px]">
        {slots.map((slotItem, index) => {
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
              onClick={() => handleSlotClick(index)}
              disabled={isSolved || !slotItem || Boolean(feedback)}
              className={`w-12 h-14 sm:w-16 sm:h-18 rounded-2xl border-2 sm:border-3 text-2xl sm:text-3xl font-black font-heading flex items-center justify-center transition-all duration-150 active:scale-90 cursor-pointer shadow-sm ${slotStyle}`}
            >
              {slotItem ? slotItem.char.toUpperCase() : '_'}
            </button>
          );
        })}
      </div>

      {/* 散落符文字母池 (點擊即上槽，56px+ 大按鈕) */}
      <div className="w-full max-w-lg p-4 rounded-3xl bg-slate-100/80 dark:bg-slate-850/80 border border-slate-200 dark:border-slate-700/80">
        <p className="text-xs font-black text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>點選字母符文自動填入空格</span>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {availableLetters.map((letter) => (
            <button
              key={letter.id}
              onClick={() => handleLetterClick(letter)}
              disabled={isSolved || Boolean(feedback)}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-400 text-xl sm:text-2xl font-black font-heading flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer"
            >
              {letter.char.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
