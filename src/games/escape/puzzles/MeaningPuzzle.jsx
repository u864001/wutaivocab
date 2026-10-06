import React, { useState } from 'react';
import { Scroll, CheckCircle2, XCircle, Sparkles, KeyRound } from 'lucide-react';
import { soundEngine, speakEnglish } from '../../../services/audio';

export const MeaningPuzzle = ({
  puzzle,
  onSolve,
  onMistake,
  isSolved,
  eliminatedOptionId,
  themeColor = 'amber'
}) => {
  const [selectedId, setSelectedId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleSelectOption = (option) => {
    if (isSolved || feedback) return;
    soundEngine.click();
    setSelectedId(option.id);

    if (option.id === puzzle.targetWord.id) {
      setFeedback('correct');
      soundEngine.correct();
      speakEnglish(option.en);
      setTimeout(() => {
        onSolve(puzzle.id, option);
      }, 900);
    } else {
      setFeedback('wrong');
      soundEngine.wrong();
      onMistake(puzzle.id, option);
      setTimeout(() => {
        setFeedback(null);
        setSelectedId(null);
      }, 1000);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-3 sm:p-5 text-center select-none animate-fadeIn">
      {/* 羊皮紙卷軸神秘謎面 */}
      <div className="w-full max-w-xl mb-5 sm:mb-6 p-5 sm:p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/80 shadow-lg relative overflow-hidden">
        <div className="absolute top-2 right-3 text-amber-500/20 text-6xl select-none pointer-events-none">
          📜
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/60 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 text-xs font-black mb-2">
          <Scroll className="w-3.5 h-3.5" />
          <span>遠古羊皮紙線索</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black font-heading text-amber-950 dark:text-amber-100 tracking-wide mt-1">
          {puzzle.clueZh}
        </h3>
        <p className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-300/80 mt-1.5">
          解鎖密碼匣：請挑選出對應此中文意義的英文咒語
        </p>
      </div>

      {/* 4 個刻字石匣選項 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-xl">
        {puzzle.options.map((opt, idx) => {
          const isEliminated = opt.id === eliminatedOptionId;
          const isSelected = selectedId === opt.id;
          const isTarget = opt.id === puzzle.targetWord.id;

          let btnClass = 'bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-700 hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-950/40';

          if (isSolved && isTarget) {
            btnClass = 'bg-amber-500 text-white border-amber-400 shadow-lg shadow-amber-500/30';
          } else if (isSelected) {
            if (feedback === 'correct') {
              btnClass = 'bg-amber-500 text-white border-amber-400 scale-102 shadow-lg shadow-amber-500/40';
            } else if (feedback === 'wrong') {
              btnClass = 'bg-rose-500 text-white border-rose-400 animate-shake';
            }
          }

          if (isEliminated) {
            btnClass += ' opacity-30 pointer-events-none line-through';
          }

          return (
            <button
              key={opt.id || idx}
              onClick={() => handleSelectOption(opt)}
              disabled={isSolved || isEliminated || Boolean(feedback)}
              className={`p-4 sm:p-5 rounded-2xl border-2 text-left flex items-center justify-between transition-all duration-200 active:scale-95 shadow-md cursor-pointer ${btnClass}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center font-black text-xs text-amber-700 dark:text-amber-300">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-xl sm:text-2xl font-black font-heading tracking-wide">
                  {opt.en}
                </span>
              </div>

              {isSelected && feedback === 'correct' && (
                <CheckCircle2 className="w-6 h-6 text-white shrink-0 animate-bounce" />
              )}
              {isSelected && feedback === 'wrong' && (
                <XCircle className="w-6 h-6 text-white shrink-0 animate-shake" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
