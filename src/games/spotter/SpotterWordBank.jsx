import React, { useState } from 'react';
import { soundEngine, speakEnglish } from '../../services/audio';
import { Volume2, Lock, Target, CheckCircle2 } from 'lucide-react';

export const SpotterWordBank = ({
  spotlightDiff = null,
  wordOptions = [],
  solvedDiffIds = new Set(),
  activeDifferences = [],
  onWordMatchSuccess,
  onWordMatchFail
}) => {
  const [shakingWord, setShakingWord] = useState(null);
  const [successWord, setSuccessWord] = useState(null);

  // 點擊發音
  const handlePronounce = (e, word) => {
    e.stopPropagation();
    speakEnglish(word, 'mario');
  };

  // 學生點擊單字選項
  const handleSelectWord = (option) => {
    if (!spotlightDiff) return; // 若非配對階段，直接無視

    const optWord = (option.word || '').trim().toLowerCase();
    const spotWord = (spotlightDiff.word || '').trim().toLowerCase();

    if (optWord === spotWord) {
      // 答對！播放清脆答對音效、美語發音、高亮按鈕、回傳母組件更新進度解除聚光燈
      soundEngine.correct();
      speakEnglish(option.word, 'mario');
      setSuccessWord(option.word);
      setTimeout(() => {
        setSuccessWord(null);
        if (onWordMatchSuccess) {
          onWordMatchSuccess(spotlightDiff.id);
        }
      }, 350);
    } else {
      // 答錯！震動、扣心、但保留聚光燈！
      soundEngine.wrong();
      setShakingWord(option.word);
      setTimeout(() => setShakingWord(null), 600);
      if (onWordMatchFail) {
        onWordMatchFail(option.word);
      }
    }
  };

  return (
    <div className={`w-full rounded-2xl p-4 sm:p-5 transition-all duration-300 relative ${
      spotlightDiff
        ? 'bg-amber-500/10 dark:bg-amber-950/30 border-2 border-amber-400 dark:border-amber-500 shadow-xl'
        : 'bg-white/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 opacity-60'
    }`}>
      {/* ── 狀態導引橫幅 ── */}
      <div className="flex items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center gap-2">
          {spotlightDiff ? (
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black animate-pulse">
              <span className="p-1.5 rounded-xl bg-amber-500 text-white shadow-sm">
                <Target className="w-4 h-4" />
              </span>
              <span className="text-xs sm:text-sm font-heading">
                🎯 鷹眼已鎖定！請在下方點選該相異物品的英語單字：
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold">
              <span className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-500 shadow-sm">
                <Lock className="w-4 h-4" />
              </span>
              <span className="text-xs sm:text-sm">
                🔍 請先在上方雙圖中點選找出一處不同之處（單字庫暫時鎖定，點擊不扣心）
              </span>
            </div>
          )}
        </div>

        {spotlightDiff && (
          <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-300 text-xs font-black shrink-0 border border-amber-400/40">
            {spotlightDiff.typeZh}
          </span>
        )}
      </div>

      {/* ── 單字卡選項網格 ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5">
        {wordOptions.map((opt) => {
          const isShaking = shakingWord === opt.word;
          const isSuccess = successWord === opt.word;
          const isThisDiffSolved = activeDifferences.some(d => d.word === opt.word && solvedDiffIds.has(d.id));

          return (
            <button
              key={opt.word}
              type="button"
              disabled={!spotlightDiff || isThisDiffSolved}
              onClick={() => handleSelectWord(opt)}
              className={`group relative p-2.5 sm:p-3 rounded-xl font-heading text-left transition-all flex flex-col justify-between cursor-pointer active:scale-95 ${
                !spotlightDiff
                  ? 'bg-slate-100 dark:bg-slate-700/50 text-slate-400 border border-transparent cursor-not-allowed opacity-75'
                  : isSuccess
                  ? 'bg-emerald-500 text-white border-2 border-emerald-400 scale-105 shadow-xl animate-bounce'
                  : isShaking
                  ? 'bg-rose-500 text-white border-2 border-rose-600 scale-95 animate-headShake shadow-md'
                  : isThisDiffSolved
                  ? 'bg-slate-100/90 dark:bg-slate-800/80 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-60'
                  : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-amber-50 dark:hover:bg-amber-950/40 border-2 border-slate-200 dark:border-slate-600 hover:border-amber-400 shadow-sm hover:shadow-md hover:scale-102'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs sm:text-sm font-black capitalize tracking-wide">
                  {opt.word}
                </span>

                <span
                  onClick={(e) => handlePronounce(e, opt.word)}
                  title="聆聽發音"
                  className="p-1 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-100/50 dark:hover:bg-slate-600 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="flex items-center justify-between mt-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-300">
                <span>{opt.wordZh}</span>
                {isThisDiffSolved && (
                  <span className="text-[10px] text-emerald-500 font-black">✓ 已解</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
