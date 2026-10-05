import React, { useState } from 'react';
import { drawThreeCandidateCards } from './wordWisdomData';
import { soundEngine, speakEnglish } from '../../services/audio';
import { useStudent } from '../../context/StudentContext';
import {
  Sparkles, X, Volume2, RotateCcw, CheckCircle2,
  Trophy, BookOpen, Star, Compass, Heart, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WisdomCardModal = ({ onClose, customWordsPool = [] }) => {
  const { addQuestPoints, currentStudent } = useStudent();

  // 候選的 3 張神秘卡牌
  const [candidates, setCandidates] = useState(() => drawThreeCandidateCards(customWordsPool));
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasClaimedDailyBonus, setHasClaimedDailyBonus] = useState(false);

  // 學生選擇其中一張卡牌
  const handleSelectCard = (index) => {
    if (selectedIndex !== null) return; // 已經選取

    soundEngine.correct();
    setSelectedIndex(index);

    // 播放 3D 翻轉與彩帶煙花效果
    setTimeout(() => {
      setIsFlipped(true);
      soundEngine.win();

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      // 今日首次翻牌獎勵 (+5 探索積分)
      if (!hasClaimedDailyBonus && addQuestPoints) {
        addQuestPoints(5);
        setHasClaimedDailyBonus(true);
      }

      // 自動朗讀卡牌英文短句
      const card = candidates[index];
      if (card?.quoteEn) {
        setTimeout(() => {
          speakEnglish(card.quoteEn);
        }, 600);
      }
    }, 400);
  };

  const selectedCard = selectedIndex !== null ? candidates[selectedIndex] : null;

  // 重新洗牌
  const handleRedraw = (e) => {
    if (e) e.stopPropagation();
    soundEngine.click();
    setSelectedIndex(null);
    setIsFlipped(false);
    setCandidates(drawThreeCandidateCards(customWordsPool));
  };

  const handleSpeakQuote = (e) => {
    if (e) e.stopPropagation();
    if (selectedCard?.quoteEn) {
      soundEngine.click();
      speakEnglish(selectedCard.quoteEn);
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none"
    >
      <div className="w-full max-w-2xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-2 border-amber-400/80 rounded-3xl shadow-[0_0_50px_rgba(251,191,36,0.25)] overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp relative">
        
        {/* ── 頂部古典金飾導航 ── */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-600/30 via-indigo-900/40 to-amber-600/30 border-b border-amber-400/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-xl shadow-inner">
              ✨
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-heading font-black text-amber-200 tracking-wide drop-shadow">
                  今日英語智慧靈感卡
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  每日心靈翻牌
                </span>
              </div>
              <p className="text-xs text-slate-300 font-bold">
                書桌魔法手冊 • 單字能量心靈導引
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
            title="收起卡牌"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── 主體內容區域 ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center">
          
          {/* ── 階段一：未選牌時的 3 張神秘卡背排列 ── */}
          {selectedIndex === null ? (
            <div className="w-full flex flex-col items-center py-4 space-y-6">
              <div className="text-center space-y-1.5 max-w-md">
                <h4 className="text-base sm:text-lg font-black text-amber-100 font-heading flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  <span>靜下心來，點選一張命定魔法卡</span>
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
                </h4>
                <p className="text-xs sm:text-sm font-bold text-slate-300 leading-relaxed">
                  「深呼吸～看著三張蘊藏智慧能量的卡牌，跟隨你的直覺，點選今天指引你學習的單字之光！」
                </p>
              </div>

              {/* 三張神秘卡牌陣列 */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-lg px-2">
                {candidates.map((card, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectCard(idx)}
                    className="aspect-[2/3] rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border-2 border-amber-400/60 hover:border-amber-300 shadow-[0_10px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_0_30px_rgba(251,191,36,0.7)] hover:-translate-y-2 active:scale-95 transition-all duration-300 cursor-pointer flex flex-col items-center justify-between p-3 relative group overflow-hidden"
                  >
                    {/* 卡背金星背景 */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute inset-1.5 rounded-xl border border-amber-400/30 pointer-events-none" />

                    <div className="w-full flex justify-between text-[11px] text-amber-400/60 font-serif">
                      <span>★</span>
                      <span>★</span>
                    </div>

                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-3xl sm:text-4xl filter drop-shadow group-hover:scale-110 transition-transform">
                        🔮
                      </span>
                      <span className="text-[11px] font-black text-amber-200 tracking-widest uppercase">
                        Card {idx + 1}
                      </span>
                    </div>

                    <div className="w-full flex justify-between text-[11px] text-amber-400/60 font-serif">
                      <span>★</span>
                      <span>★</span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] font-bold text-slate-400">
                💡 每天可以在房間書桌抽卡一次，獲得正能量短句與探索積分！
              </p>
            </div>
          ) : (
            /* ── 階段二：選牌後的 3D 翻牌與盛大揭曉 ── */
            <div className="w-full max-w-lg flex flex-col items-center space-y-4 py-2">
              
              {/* 卡牌正面 (3D 翻轉展示卡) */}
              <div className={`w-full max-w-md rounded-3xl bg-gradient-to-b from-amber-100 via-amber-50 to-orange-50 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border-4 border-amber-400 dark:border-amber-500 shadow-[0_15px_40px_rgba(251,191,36,0.35)] p-5 sm:p-6 transition-all duration-700 flex flex-col space-y-3.5 relative overflow-hidden ${
                isFlipped ? 'scale-100 rotate-0 opacity-100' : 'scale-95 rotate-6 opacity-0'
              }`}>
                
                {/* 卡牌頂部：能量主題與詞性 */}
                <div className="flex items-center justify-between border-b border-amber-300/60 dark:border-slate-700 pb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 font-black text-xs flex items-center gap-1 border border-amber-400/30">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{selectedCard.energy}</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                    {selectedCard.partOfSpeech}
                  </span>
                </div>

                {/* 卡牌中心：單字核心與圖案 */}
                <div className="flex flex-col items-center py-1">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border-2 border-amber-400/40 flex items-center justify-center text-5xl shadow-inner mb-2 animate-bounce">
                    {selectedCard.icon}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-800 dark:text-white tracking-wide">
                    {selectedCard.word}
                  </h3>
                  {selectedCard.phonetic && (
                    <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                      {selectedCard.phonetic}
                    </span>
                  )}
                </div>

                {/* 今日魔法英語短句區 (附發音按鈕) */}
                <div className="p-3.5 rounded-2xl bg-amber-500/15 border-2 border-amber-400/50 flex items-center justify-between gap-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-300 tracking-wider">
                      ✨ Today's Magic English:
                    </div>
                    <div className="text-sm sm:text-base font-black text-slate-800 dark:text-white font-heading leading-snug">
                      "{selectedCard.quoteEn}"
                    </div>
                  </div>
                  <button
                    onClick={handleSpeakQuote}
                    className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
                    title="聆聽魔法英語朗讀"
                  >
                    <Volume2 className="w-4 h-4 animate-pulse" />
                  </button>
                </div>

                {/* 今日心靈引導語 (中文溫暖長文) */}
                <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-amber-200/60 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
                  <div className="text-xs font-black text-amber-800 dark:text-amber-400 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>心靈小智慧：</span>
                  </div>
                  <p>{selectedCard.quoteZh}</p>
                </div>

                {/* 翻牌獎勵提示 */}
                {hasClaimedDailyBonus && (
                  <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-800 dark:text-emerald-300 text-xs font-black flex items-center justify-center gap-1.5 animate-fadeIn">
                    <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                    <span>獲得每日心靈靈感獎勵：探索積分 +5 點！</span>
                  </div>
                )}
              </div>

              {/* 底部操作按鈕 */}
              <div className="flex items-center gap-3 w-full max-w-md pt-1">
                <button
                  onClick={handleRedraw}
                  className="flex-1 py-2.5 px-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-black text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重新抽一張</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>收下靈感，放回書桌</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WisdomCardModal;
