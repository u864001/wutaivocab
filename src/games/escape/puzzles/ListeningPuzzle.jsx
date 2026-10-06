import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, XCircle, Sparkles, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { soundEngine } from '../../../services/audio';
import { speakMysteriousEnglish } from '../escapeAudio';

export const ListeningPuzzle = ({
  puzzle,
  onSolve,
  onMistake,
  isSolved,
  eliminatedOptionId,
  themeColor = 'emerald'
}) => {
  const [selectedId, setSelectedId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isChineseOpen, setIsChineseOpen] = useState(false);

  // 初次打開自動以神秘低沉語音朗讀英文句子
  useEffect(() => {
    if (!isSolved && puzzle?.englishSentence) {
      const timer = setTimeout(() => {
        speakMysteriousEnglish(puzzle.englishSentence);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [puzzle, isSolved]);

  const handlePlayVoice = () => {
    soundEngine.click();
    speakMysteriousEnglish(puzzle.englishSentence || puzzle.targetWord.en);
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
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-5 text-center select-none animate-fadeIn">
      {/* 神秘英文預言句子展示台 */}
      <div className="w-full max-w-xl mb-4 sm:mb-6 p-4 sm:p-5 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/40 shadow-xl text-left relative">
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>遠古回音預言 (Ancient Prophecy)</span>
          </div>

          <button
            onClick={handlePlayVoice}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all active:scale-95 flex items-center gap-1.5 shadow-md cursor-pointer"
            title="以低沉神秘語音再次朗讀"
          >
            <Volume2 className="w-4 h-4" />
            <span>聆聽神秘朗讀</span>
          </button>
        </div>

        {/* 英文句子 */}
        <p className="text-base sm:text-xl font-heading font-black text-emerald-100 tracking-wide leading-relaxed my-2">
          "{puzzle.englishSentence}"
        </p>

        {/* 預設隱藏的中文譯文 (可點擊展開) */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={() => {
              soundEngine.click();
              setIsChineseOpen(!isChineseOpen);
            }}
            className="text-xs font-black text-emerald-400/90 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
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

      {/* 4 個選項 */}
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
