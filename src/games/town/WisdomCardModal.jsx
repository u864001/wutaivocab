import React, { useState, useMemo } from 'react';
import { drawThreeCandidateCards } from './wordWisdomData';
import { soundEngine, speakEnglish } from '../../services/audio';
import { useStudent } from '../../context/StudentContext';
import {
  Sparkles, X, Volume2, RotateCcw, CheckCircle2,
  Trophy, BookOpen, Star, Compass, Heart, ArrowRight,
  Pin, Bookmark, Check, Eye, EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ── 3 大候選卡背神秘元素設計 (太陽、月亮、星辰三大象徵，外觀與氣場完全區隔) ──
const CARD_BACK_THEMES = [
  {
    rune: '☀️',
    badge: '太陽符印',
    titleZh: '太陽之光',
    titleEn: 'Sun of Vitality',
    motto: '活力與勇氣 • 溫暖照耀',
    gradient: 'from-amber-600 via-orange-850 to-slate-950',
    border: 'border-amber-400/80 hover:border-amber-300',
    glow: 'shadow-[0_12px_32px_rgba(251,191,36,0.45)] hover:shadow-[0_0_35px_rgba(251,191,36,0.8)]',
    text: 'text-amber-300',
    accentBg: 'bg-amber-400/20'
  },
  {
    rune: '🌙',
    badge: '月夜符印',
    titleZh: '月之守護',
    titleEn: 'Moon of Serenity',
    motto: '平靜與智慧 • 溫柔守護',
    gradient: 'from-cyan-750 via-indigo-950 to-slate-950',
    border: 'border-cyan-400/80 hover:border-cyan-300',
    glow: 'shadow-[0_12px_32px_rgba(34,211,238,0.45)] hover:shadow-[0_0_35px_rgba(34,211,238,0.8)]',
    text: 'text-cyan-300',
    accentBg: 'bg-cyan-400/20'
  },
  {
    rune: '⚡',
    badge: '星辰符印',
    titleZh: '星辰引力',
    titleEn: 'Star of Dreams',
    motto: '靈感與夢想 • 閃耀探索',
    gradient: 'from-purple-650 via-fuchsia-950 to-slate-950',
    border: 'border-fuchsia-400/80 hover:border-fuchsia-300',
    glow: 'shadow-[0_12px_32px_rgba(232,121,249,0.45)] hover:shadow-[0_0_35px_rgba(232,121,249,0.8)]',
    text: 'text-fuchsia-300',
    accentBg: 'bg-fuchsia-400/20'
  }
];

export const WisdomCardModal = ({ onClose, customWordsPool = [] }) => {
  const { addQuestPoints } = useStudent();
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [candidates, setCandidates] = useState(() => drawThreeCandidateCards(customWordsPool));
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFirstDrawToday, setIsFirstDrawToday] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [pinToast, setPinToast] = useState(null);
  const [showChineseQuote, setShowChineseQuote] = useState(false); // 預設隱藏金句中文，點擊才查看

  // 學生選擇其中一張卡牌：觸發真 3D 雙面陀螺平滑旋轉 (慢 -> 極快 -> 慢速停止)
  const handleSelectCard = (index) => {
    if (selectedIndex !== null || isSpinning) return;

    setSelectedIndex(index);
    setIsSpinning(true);
    setIsFlipped(false);
    setShowChineseQuote(false);

    // 播放陀螺急速旋轉聲效
    soundEngine.spinCard();

    // 檢查今日是否為首次翻卡 (+5 積分判斷)
    const lastDrawDate = localStorage.getItem('wutai_wisdom_last_draw_date');
    const isFirstToday = lastDrawDate !== todayStr;
    setIsFirstDrawToday(isFirstToday);

    // 檢查該卡是否已被釘在告示板
    const pinnedCardStr = localStorage.getItem('wutai_latest_pinned_wisdom_card');
    if (pinnedCardStr) {
      try {
        const p = JSON.parse(pinnedCardStr);
        setIsPinned(p?.id === candidates[index]?.id);
      } catch (e) {
        setIsPinned(false);
      }
    } else {
      setIsPinned(false);
    }

    // 平滑陀螺旋轉 1.8 秒後平穩停下並揭曉
    setTimeout(() => {
      try {
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      soundEngine.win();
      setIsSpinning(false);
      setIsFlipped(true);

      // 今日首次翻牌獎勵 (+5 探索積分)
      if (isFirstToday) {
        if (addQuestPoints) {
          addQuestPoints(5);
        }
        localStorage.setItem('wutai_wisdom_last_draw_date', todayStr);
      }

      // 自動朗讀卡牌英文短句
      const card = candidates[index];
      if (card?.quoteEn) {
        setTimeout(() => {
          speakEnglish(card.quoteEn);
        }, 500);
      }
    }, 1800);
  };

  const selectedCard = selectedIndex !== null ? candidates[selectedIndex] : null;

  // 釘選/收藏至榮譽告示板 (永遠只覆蓋保留最新單張，不佔空間)
  const handlePinCard = (e) => {
    if (e) e.stopPropagation();
    if (!selectedCard) return;

    soundEngine.pinCard();
    const pinnedData = {
      ...selectedCard,
      pinnedDate: todayStr
    };
    localStorage.setItem('wutai_latest_pinned_wisdom_card', JSON.stringify(pinnedData));
    setIsPinned(true);
    setPinToast(`📌 已將「${selectedCard.word}」靈感卡釘在房間告示板！`);
    setTimeout(() => setPinToast(null), 3200);
  };

  // 重新洗牌
  const handleRedraw = (e) => {
    if (e) e.stopPropagation();
    soundEngine.click();
    setSelectedIndex(null);
    setIsSpinning(false);
    setIsFlipped(false);
    setIsPinned(false);
    setShowChineseQuote(false);
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
      {/* 🌟 慢至極快再平滑減速停下 (物理陀螺旋轉曲線) CSS 動畫 */}
      <style>{`
        @keyframes smoothTopSpin {
          0% {
            transform: rotateY(0deg) scale(0.95);
          }
          100% {
            transform: rotateY(2340deg) scale(1);
          }
        }
        .animate-smooth-top-spin {
          animation: smoothTopSpin 1.8s cubic-bezier(0.38, 0.0, 0.22, 1) forwards;
          transform-style: preserve-3d;
        }
      `}</style>

      <div className="w-full max-w-xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-2 border-amber-400/80 rounded-3xl shadow-[0_0_50px_rgba(251,191,36,0.3)] overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp relative">
        
        {/* ── 頂部導航 ── */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-amber-600/30 via-indigo-900/40 to-amber-600/30 border-b border-amber-400/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-lg shadow-inner">
              ✨
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-heading font-black text-amber-200 tracking-wide drop-shadow">
                今日英語靈感卡
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
            title="關閉"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── 主體內容區域 ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center min-h-[420px]">
          
          {/* ── 階段一：未選牌時的 3 張神秘卡背 ── */}
          {selectedIndex === null ? (
            <div className="w-full flex flex-col items-center py-2 space-y-6 animate-fadeIn">
              <div className="text-center space-y-1 max-w-md">
                <h4 className="text-base sm:text-lg font-black text-amber-100 font-heading flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  <span>點選一張今日魔法卡</span>
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
                </h4>
                <p className="text-xs font-bold text-slate-300">
                  深呼吸～跟隨直覺，挑選一張代表你今日能量的卡牌
                </p>
              </div>

              {/* 三張神秘卡牌陣列 (太陽、月亮、星辰三大象徵卡背) */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-lg px-2">
                {candidates.map((card, idx) => {
                  const theme = CARD_BACK_THEMES[idx] || CARD_BACK_THEMES[0];
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectCard(idx)}
                      className={`aspect-[2/3] rounded-2xl bg-gradient-to-br ${theme.gradient} border-2 ${theme.border} ${theme.glow} hover:-translate-y-2 active:scale-95 transition-all duration-300 cursor-pointer flex flex-col items-center justify-between p-3 relative group overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute inset-1 rounded-xl border border-white/20 pointer-events-none" />

                      <div className="w-full flex items-center justify-between text-[10px] font-bold text-white/60">
                        <span>★</span>
                        <span className={`px-1.5 py-0.2 rounded-full ${theme.accentBg} ${theme.text} text-[9px]`}>
                          {theme.badge}
                        </span>
                        <span>★</span>
                      </div>

                      <div className="flex flex-col items-center space-y-1 my-auto">
                        <span className="text-3xl sm:text-4xl filter drop-shadow group-hover:scale-120 transition-transform duration-300">
                          {theme.rune}
                        </span>
                        <div className="text-center">
                          <div className={`text-xs sm:text-sm font-black font-heading ${theme.text} tracking-wide drop-shadow`}>
                            {theme.titleZh}
                          </div>
                        </div>
                      </div>

                      <div className="w-full text-center">
                        <span className="text-[9px] font-bold text-slate-300/80 block truncate">
                          {theme.motto}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-[11px] font-bold text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                每日首次翻牌可獲探索積分 +5 點
              </div>
            </div>
          ) : isSpinning ? (
            /* ── 階段二：真 3D 雙面陀螺平滑旋轉 (慢 -> 極快 -> 慢速停下) ── */
            <div className="w-full flex flex-col items-center justify-center py-6 space-y-6">
              <div className="relative flex items-center justify-center">
                {/* 旋風發光環 */}
                <div className="absolute w-60 h-60 rounded-full border-2 border-dashed border-amber-400/40 animate-spin duration-700 pointer-events-none" />
                <div className="absolute w-64 h-64 rounded-full bg-amber-500/15 blur-xl pointer-events-none" />

                {/* 🌟 真 3D 雙面旋轉卡牌 (一面是美麗卡背，另一面是卡面內容，在旋轉中自然交替翻轉) */}
                {(() => {
                  const theme = CARD_BACK_THEMES[selectedIndex] || CARD_BACK_THEMES[0];
                  const card = candidates[selectedIndex];
                  return (
                    <div style={{ perspective: '1200px' }} className="w-48 aspect-[2/3] relative">
                      <div className="w-full h-full relative animate-smooth-top-spin">
                        {/* 面 1：美麗卡背 (0°) */}
                        <div
                          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}
                          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${theme.gradient} border-4 ${theme.border} ${theme.glow} flex flex-col items-center justify-between p-4 shadow-2xl`}
                        >
                          <div className="w-full flex justify-between text-[10px] text-white/50">
                            <span>★</span>
                            <span>★</span>
                          </div>
                          <div className="flex flex-col items-center space-y-2">
                            <span className="text-5xl filter drop-shadow">{theme.rune}</span>
                            <span className={`text-base font-black font-heading ${theme.text}`}>{theme.titleZh}</span>
                          </div>
                          <div className="w-full flex justify-between text-[10px] text-white/50">
                            <span>★</span>
                            <span>★</span>
                          </div>
                        </div>

                        {/* 面 2：卡片內容頁 (180°) */}
                        <div
                          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                          className="absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-100 via-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 border-4 border-amber-400 flex flex-col items-center justify-center p-4 shadow-2xl text-center"
                        >
                          <span className="text-4xl mb-2 animate-bounce">{card?.icon || '✨'}</span>
                          <span className="text-xl font-black font-heading text-slate-800 dark:text-white">{card?.word}</span>
                          <span className="text-xs text-amber-700 dark:text-amber-300 font-bold mt-1 line-clamp-2">"{card?.quoteEn}"</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-amber-200 font-heading animate-pulse">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>命定能量凝聚中...</span>
              </div>
            </div>
          ) : (
            /* ── 階段三：平穩落地後的正面展示卡 ── */
            <div className="w-full max-w-md flex flex-col items-center space-y-3 py-1">
              
              {/* 卡牌正面 (精緻典雅展示卡) */}
              <div className={`w-full rounded-3xl bg-gradient-to-b from-amber-100 via-amber-50 to-orange-50 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border-4 border-amber-400 dark:border-amber-500 shadow-[0_15px_40px_rgba(251,191,36,0.35)] p-5 transition-all duration-500 flex flex-col space-y-3 relative overflow-hidden ${
                isFlipped ? 'scale-100 rotate-0 opacity-100' : 'scale-95 opacity-0'
              }`}>
                
                {/* 已釘選徽章 */}
                {isPinned && (
                  <div className="absolute top-2 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-[10px] font-black">
                    <Pin className="w-3 h-3 text-amber-600 fill-amber-600" />
                    <span>已釘在告示板</span>
                  </div>
                )}

                {/* 卡牌頂部：能量主題 */}
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
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border-2 border-amber-400/40 flex items-center justify-center text-4xl shadow-inner mb-1.5">
                    {selectedCard.icon}
                  </div>
                  <h3 className="text-2xl font-black font-heading text-slate-800 dark:text-white tracking-wide">
                    {selectedCard.word}
                  </h3>
                  {selectedCard.phonetic && (
                    <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                      {selectedCard.phonetic}
                    </span>
                  )}
                </div>

                {/* 今日魔法英語短句區 (附發音) */}
                <div className="p-3 rounded-2xl bg-amber-500/15 border-2 border-amber-400/50 flex items-center justify-between gap-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-300 tracking-wider">
                      Today's Magic English:
                    </div>
                    <div className="text-sm sm:text-base font-black text-slate-800 dark:text-white font-heading leading-snug">
                      "{selectedCard.quoteEn}"
                    </div>
                  </div>
                  <button
                    onClick={handleSpeakQuote}
                    className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
                    title="朗讀英文"
                  >
                    <Volume2 className="w-4 h-4 animate-pulse" />
                  </button>
                </div>

                {/* 🌟 今日心靈引導語 (中文預設隱藏，點擊才查看) */}
                {showChineseQuote ? (
                  <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-amber-200/60 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed space-y-1 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-black text-amber-800 dark:text-amber-400 flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                        <span>中文引導：</span>
                      </div>
                      <button
                        onClick={() => setShowChineseQuote(false)}
                        className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        隱藏
                      </button>
                    </div>
                    <p>{selectedCard.quoteZh}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowChineseQuote(true)}
                    className="text-center text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline py-1 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>查看中文故事解釋</span>
                  </button>
                )}

                {/* 翻牌積分結算 */}
                {isFirstDrawToday && (
                  <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/60 text-emerald-800 dark:text-emerald-300 text-xs font-black flex items-center justify-center gap-1 animate-fadeIn">
                    <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                    <span>今日首次翻牌：探索積分 +5 點！</span>
                  </div>
                )}
              </div>

              {/* Toast 提示 */}
              {pinToast && (
                <div className="px-3.5 py-1 rounded-xl bg-amber-500 text-white text-xs font-black shadow-lg animate-bounce flex items-center gap-1">
                  <Pin className="w-3 h-3" />
                  <span>{pinToast}</span>
                </div>
              )}

              {/* 底部操作按鈕 */}
              <div className="grid grid-cols-3 gap-2 w-full pt-1">
                <button
                  onClick={handlePinCard}
                  className={`py-2 px-2 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer active:scale-95 ${
                    isPinned
                      ? 'bg-amber-500/30 text-amber-200 border border-amber-400/60'
                      : 'bg-amber-600 hover:bg-amber-700 text-white border border-amber-400/40'
                  }`}
                  title="釘在房間告示板"
                >
                  <Pin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{isPinned ? '已釘告示板' : '釘在告示板'}</span>
                </button>

                <button
                  onClick={handleRedraw}
                  className="py-2 px-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-black text-xs border border-white/20 transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                  title="再抽一張"
                >
                  <RotateCcw className="w-3 h-3 shrink-0" />
                  <span className="truncate">再抽一張</span>
                </button>

                <button
                  onClick={onClose}
                  className="py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                  title="放回書桌"
                >
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span className="truncate">放回書桌</span>
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
