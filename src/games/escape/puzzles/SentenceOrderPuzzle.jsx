import React, { useState, useEffect } from 'react';
import { Volume2, RotateCcw, CheckCircle2, Sparkles, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { soundEngine } from '../../../services/audio';
import { speakMysteriousEnglish } from '../escapeAudio';

export const SentenceOrderPuzzle = ({
  puzzle,
  onSolve,
  onMistake,
  isSolved,
  themeColor = 'indigo'
}) => {
  const targetTokens = puzzle.targetTokens || [];
  const [placedTokens, setPlacedTokens] = useState([]);
  const [availableTokens, setAvailableTokens] = useState(() => puzzle.scrambledTokens || []);
  const [feedback, setFeedback] = useState(null);
  const [isChineseOpen, setIsChineseOpen] = useState(false);

  useEffect(() => {
    if (!isSolved && puzzle?.voiceText) {
      const timer = setTimeout(() => {
        speakMysteriousEnglish(puzzle.voiceText);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [puzzle, isSolved]);

  const handlePlayVoice = () => {
    soundEngine.click();
    speakMysteriousEnglish(puzzle.voiceText);
  };

  const handleTokenClick = (token) => {
    if (isSolved || feedback) return;
    soundEngine.click();

    const newPlaced = [...placedTokens, token];
    setPlacedTokens(newPlaced);
    setAvailableTokens(prev => prev.filter(t => t.id !== token.id));

    if (newPlaced.length === targetTokens.length) {
      validateSentence(newPlaced);
    }
  };

  const handlePlacedClick = (index) => {
    if (isSolved || feedback) return;
    soundEngine.click();

    const item = placedTokens[index];
    const newPlaced = placedTokens.filter((_, i) => i !== index);
    setPlacedTokens(newPlaced);
    setAvailableTokens(prev => [...prev, item]);
  };

  const handleReset = () => {
    if (isSolved || feedback) return;
    soundEngine.click();
    setPlacedTokens([]);
    setAvailableTokens(puzzle.scrambledTokens || []);
    setFeedback(null);
  };

  const validateSentence = (currentPlaced) => {
    const constructed = currentPlaced.map(t => t.word).join(' ');
    const target = targetTokens.join(' ');

    if (constructed === target) {
      setFeedback('correct');
      soundEngine.correct();
      setTimeout(() => {
        onSolve(puzzle.id, { sentence: constructed });
      }, 950);
    } else {
      setFeedback('wrong');
      soundEngine.wrong();
      onMistake(puzzle.id, { constructed });
      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-5 text-center select-none animate-fadeIn">
      {/* 題目與中文提示區 */}
      <div className="w-full max-w-xl mb-4 p-4 rounded-3xl bg-indigo-950/40 border-2 border-indigo-500/50 shadow-xl text-left">
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>句型語序重組 (Sentence Unscramble)</span>
          </div>

          <button
            onClick={handlePlayVoice}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black text-xs transition-all active:scale-95 flex items-center gap-1.5 shadow-md cursor-pointer"
            title="以神秘低沉語音朗讀正確句子"
          >
            <Volume2 className="w-4 h-4" />
            <span>聆聽正確讀音</span>
          </button>
        </div>

        <p className="text-sm sm:text-base font-bold text-slate-300 my-1">
          {puzzle.englishPrompt}
        </p>

        {/* 預設隱藏的中文譯文 */}
        <div className="mt-2.5 pt-2.5 border-t border-white/10">
          <button
            type="button"
            onClick={() => {
              soundEngine.click();
              setIsChineseOpen(!isChineseOpen);
            }}
            className="text-xs font-black text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
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

      {/* 排列槽展示區 (點擊已填入字塊可退回) */}
      <div className="w-full max-w-xl p-3.5 sm:p-4 rounded-2xl bg-black/40 border-2 border-dashed border-indigo-400/50 mb-5 min-h-[64px] flex flex-wrap items-center justify-center gap-2">
        {placedTokens.length === 0 && (
          <span className="text-xs text-slate-500 font-bold">
            （依序點選下方單字卡放入此處）
          </span>
        )}
        {placedTokens.map((t, idx) => (
          <button
            key={t.id}
            onClick={() => handlePlacedClick(idx)}
            disabled={isSolved || Boolean(feedback)}
            className={`px-3.5 py-2 rounded-xl text-base sm:text-lg font-black transition-all active:scale-90 cursor-pointer shadow-md ${
              feedback === 'correct'
                ? 'bg-emerald-500 text-white'
                : feedback === 'wrong'
                ? 'bg-rose-500 text-white animate-shake'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
            title="點擊退回"
          >
            {t.word}
          </button>
        ))}
      </div>

      {/* 散落單字積木池 */}
      <div className="w-full max-w-lg p-3 sm:p-4 rounded-3xl bg-slate-900/80 border border-slate-700">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-black text-slate-400">點選單字塊：</span>
          <button
            onClick={handleReset}
            disabled={isSolved || Boolean(feedback)}
            className="text-xs font-black text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置</span>
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {availableTokens.map((token) => (
            <button
              key={token.id}
              onClick={() => handleTokenClick(token)}
              disabled={isSolved || Boolean(feedback)}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-600 text-base font-black font-heading shadow-md active:scale-90 transition-all cursor-pointer"
            >
              {token.word}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
