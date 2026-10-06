import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, XCircle, Sparkles, HelpCircle } from 'lucide-react';
import { soundEngine, speakEnglish } from '../../../services/audio';

export const ListeningPuzzle = ({
  puzzle,
  onSolve,
  onMistake,
  isSolved,
  eliminatedOptionId,
  themeColor = 'emerald'
}) => {
  const [selectedId, setSelectedId] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

  // 自動播放外師語音 (第一次點開時自動朗讀)
  useEffect(() => {
    if (!isSolved && puzzle?.targetWord?.en) {
      const timer = setTimeout(() => {
        speakEnglish(puzzle.targetWord.en);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [puzzle, isSolved]);

  const handlePlayVoice = () => {
    soundEngine.click();
    speakEnglish(puzzle.targetWord.en);
  };

  const handleSelectOption = (option) => {
    if (isSolved || feedback) return;
    soundEngine.click();
    setSelectedId(option.id);

    if (option.id === puzzle.targetWord.id) {
      setFeedback('correct');
      soundEngine.correct();
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
      {/* 聲納聽力共鳴台核心 */}
      <div className="mb-5 sm:mb-7 flex flex-col items-center">
        <button
          onClick={handlePlayVoice}
          className="relative group p-5 sm:p-7 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-white shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-emerald-300/60"
          title="點擊聆聽純美式外師發音"
        >
          <div className="absolute -inset-1 rounded-3xl bg-emerald-400/40 blur group-hover:blur-md transition-all animate-pulse" />
          <Volume2 className="w-12 h-12 sm:w-16 sm:h-16 relative z-10 animate-bounce" />
          <span className="block text-[11px] sm:text-xs font-black tracking-widest mt-1 opacity-90">
            TAP TO LISTEN
          </span>
        </button>
        <p className="mt-3 text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5 bg-white/70 dark:bg-slate-800/70 px-4 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span>聆聽石柱共鳴語音，挑選正確刻印符石</span>
        </p>
      </div>

      {/* 4 個大尺寸石符文選項 (iPad 友善觸控熱區) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-xl">
        {puzzle.options.map((opt, idx) => {
          const isEliminated = opt.id === eliminatedOptionId;
          const isSelected = selectedId === opt.id;
          const isTarget = opt.id === puzzle.targetWord.id;

          let btnClass = 'bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-700 hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40';

          if (isSolved && isTarget) {
            btnClass = 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/30';
          } else if (isSelected) {
            if (feedback === 'correct') {
              btnClass = 'bg-emerald-500 text-white border-emerald-400 scale-102 shadow-lg shadow-emerald-500/40';
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
                <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700/80 flex items-center justify-center font-black text-xs text-slate-500 dark:text-slate-300">
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
