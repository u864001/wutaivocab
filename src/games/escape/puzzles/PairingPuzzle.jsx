import React, { useState, useEffect } from 'react';
import { KeyRound, CheckCircle2, Sparkles, Link2 } from 'lucide-react';
import { soundEngine, speakEnglish } from '../../../services/audio';

export const PairingPuzzle = ({
  puzzle,
  onSolve,
  onMistake,
  isSolved,
  themeColor = 'amber'
}) => {
  const [pairs] = useState(() => puzzle.pairs || []);
  const [leftItems, setLeftItems] = useState(() => {
    return [...pairs].sort(() => 0.5 - Math.random());
  });
  const [rightItems, setRightItems] = useState(() => {
    return [...pairs].sort(() => 0.5 - Math.random());
  });

  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedLeftIds, setMatchedLeftIds] = useState(new Set());
  const [matchedRightIds, setMatchedRightIds] = useState(new Set());
  const [wrongPair, setWrongPair] = useState(false);

  // 點擊左側英文
  const handleSelectLeft = (item) => {
    if (isSolved || matchedLeftIds.has(item.id) || wrongPair) return;
    soundEngine.click();
    speakEnglish(item.en);
    setSelectedLeft(item);

    if (selectedRight) {
      checkMatch(item, selectedRight);
    }
  };

  // 點擊右側中文
  const handleSelectRight = (item) => {
    if (isSolved || matchedRightIds.has(item.id) || wrongPair) return;
    soundEngine.click();
    setSelectedRight(item);

    if (selectedLeft) {
      checkMatch(selectedLeft, item);
    }
  };

  // 校驗配對 (支援相同單字或意義對應，雙向相符均認定為正確答案)
  const checkMatch = (left, right) => {
    const cleanLeftEn = (left.en || '').toLowerCase().trim();
    const cleanRightZh = (right.zh || '').trim();

    // 只要英文與中文在中英對照庫中有任一筆對應相符，即視為成功配對
    const isPairMatch = left.id === right.id || pairs.some(p =>
      (p.en || '').toLowerCase().trim() === cleanLeftEn &&
      (p.zh || '').trim() === cleanRightZh
    );

    if (isPairMatch) {
      // 配對成功！
      soundEngine.correct();
      const nextMatchedLeft = new Set(matchedLeftIds);
      const nextMatchedRight = new Set(matchedRightIds);
      nextMatchedLeft.add(left.id);
      nextMatchedRight.add(right.id);
      setMatchedLeftIds(nextMatchedLeft);
      setMatchedRightIds(nextMatchedRight);
      setSelectedLeft(null);
      setSelectedRight(null);

      // 全部配對完成
      if (nextMatchedLeft.size >= pairs.length) {
        setTimeout(() => {
          onSolve(puzzle.id, pairs);
        }, 900);
      }
    } else {
      // 配對錯誤
      soundEngine.wrong();
      setWrongPair(true);
      onMistake(puzzle.id, { left: left.en, right: right.zh });
      setTimeout(() => {
        setWrongPair(false);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 900);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-3 sm:p-5 text-center select-none animate-fadeIn">
      {/* 關卡引導說明 */}
      <div className="mb-4 sm:mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-black border border-amber-300 dark:border-amber-700">
          <KeyRound className="w-4 h-4 text-amber-500" />
          <span>解鎖大門雙重封印：連線 3 組英中對應符文</span>
        </div>
      </div>

      {/* 雙欄對偶連線配對列表 (iPad 觸控友善大按鈕) */}
      <div className="w-full max-w-xl grid grid-cols-2 gap-4 sm:gap-6">
        {/* 左側：英文符文 */}
        <div className="space-y-3">
          <div className="text-xs font-black text-slate-400 dark:text-slate-500 tracking-wider">
            ENGLISH
          </div>
          {leftItems.map((item) => {
            const isMatched = matchedLeftIds.has(item.id);
            const isSelected = selectedLeft?.id === item.id;

            let cardStyle = 'bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-700 hover:border-amber-400';

            if (isMatched) {
              cardStyle = 'bg-emerald-500 text-white border-emerald-400 opacity-90 scale-95 shadow-sm';
            } else if (isSelected) {
              if (wrongPair) {
                cardStyle = 'bg-rose-500 text-white border-rose-400 animate-shake';
              } else {
                cardStyle = 'bg-amber-500 text-white border-amber-400 scale-102 shadow-lg shadow-amber-500/30';
              }
            }

            return (
              <button
                key={item.id}
                onClick={() => handleSelectLeft(item)}
                disabled={isMatched || isSolved}
                className={`w-full py-4 sm:py-5 px-3 rounded-2xl border-2 font-black font-heading text-lg sm:text-xl transition-all duration-150 active:scale-95 shadow-md flex items-center justify-between cursor-pointer ${cardStyle}`}
              >
                <span className="truncate">{item.en}</span>
                {isMatched && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* 右側：中文印記 */}
        <div className="space-y-3">
          <div className="text-xs font-black text-slate-400 dark:text-slate-500 tracking-wider">
            CHINESE
          </div>
          {rightItems.map((item) => {
            const isMatched = matchedRightIds.has(item.id);
            const isSelected = selectedRight?.id === item.id;

            let cardStyle = 'bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-700 hover:border-amber-400';

            if (isMatched) {
              cardStyle = 'bg-emerald-500 text-white border-emerald-400 opacity-90 scale-95 shadow-sm';
            } else if (isSelected) {
              if (wrongPair) {
                cardStyle = 'bg-rose-500 text-white border-rose-400 animate-shake';
              } else {
                cardStyle = 'bg-amber-500 text-white border-amber-400 scale-102 shadow-lg shadow-amber-500/30';
              }
            }

            return (
              <button
                key={item.id}
                onClick={() => handleSelectRight(item)}
                disabled={isMatched || isSolved}
                className={`w-full py-4 sm:py-5 px-3 rounded-2xl border-2 font-black font-heading text-lg sm:text-xl transition-all duration-150 active:scale-95 shadow-md flex items-center justify-between cursor-pointer ${cardStyle}`}
              >
                <span className="truncate">{item.zh}</span>
                {isMatched && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
