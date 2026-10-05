import React, { useState, useMemo } from 'react';
import { drawThreeCandidateCards } from './wordWisdomData';
import { soundEngine, speakEnglish } from '../../services/audio';
import { useStudent } from '../../context/StudentContext';
import {
  Sparkles, X, Volume2, RotateCcw, CheckCircle2,
  Trophy, BookOpen, Star, Compass, Heart, ArrowRight,
  Pin, Bookmark, Check
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

  // 候選的 3 張神秘卡牌
  const [candidates, setCandidates] = useState(() => drawThreeCandidateCards(customWordsPool));
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFirstDrawToday, setIsFirstDrawToday] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [pinToast, setPinToast] = useState(null);

  // 學生選擇其中一張卡牌：觸發 2160 度陀螺高速旋轉儀式
  const handleSelectCard = (index) => {
    if (selectedIndex !== null || isSpinning) return;

    setSelectedIndex(index);
    setIsSpinning(true);
    setIsFlipped(false);

    // 播放 2160 度陀螺急速旋轉聲效
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

    // 陀螺高速 2160 度 (整整 6 圈) 旋轉 1.8 秒後平穩停下並盛大展開
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

      // 今日首次翻牌獎勵 (+5 探索積分，僅每天首次發放)
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
        }, 550);
      }
    }, 1800);
  };

  const selectedCard = selectedIndex !== null ? candidates[selectedIndex] : null;

  // 釘選/收藏至榮譽告示板 (僅覆蓋保留最新單張卡片，完全不佔雲端空間)
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
    setPinToast(`📌 已將「${selectedCard.word}」靈感卡釘在房間榮譽告示板！`);
    setTimeout(() => setPinToast(null), 3600);
  };

  // 重新洗牌
  const handleRedraw = (e) => {
    if (e) e.stopPropagation();
    soundEngine.click();
    setSelectedIndex(null);
    setIsSpinning(false);
    setIsFlipped(false);
    setIsPinned(false);
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
      {/* 2160 度陀螺旋轉 CSS 動畫樣式注入 */}
      <style>{`
        @keyframes topSpin2160 {
          0% {
            transform: perspective(1200px) rotateY(0deg) scale(0.95) translateY(0);
          }
          30% {
            transform: perspective(1200px) rotateY(720deg) scale(1.15) translateY(-25px);
          }
          70% {
            transform: perspective(1200px) rotateY(1800deg) scale(1.22) translateY(-32px);
          }
          100% {
            transform: perspective(1200px) rotateY(2160deg) scale(1) translateY(0);
          }
        }
        .animate-spin-top-2160 {
          animation: topSpin2160 1.8s cubic-bezier(0.16, 0.84, 0.28, 1) forwards;
        }
      `}</style>

      <div className="w-full max-w-2xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-2 border-amber-400/80 rounded-3xl shadow-[0_0_50px_rgba(251,191,36,0.3)] overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp relative">
        
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center min-h-[440px]">
          
          {/* ── 階段一：未選牌時的 3 張神秘卡背排列 (左中右三大元素完全區隔) ── */}
          {selectedIndex === null ? (
            <div className="w-full flex flex-col items-center py-2 space-y-6 animate-fadeIn">
              <div className="text-center space-y-1.5 max-w-md">
                <h4 className="text-base sm:text-lg font-black text-amber-100 font-heading flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  <span>靜下心來，點選一張命定魔法卡</span>
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
                </h4>
                <p className="text-xs sm:text-sm font-bold text-slate-300 leading-relaxed">
                  「深呼吸～三張卡牌分別代表太陽、月亮與星辰的智慧能量。跟隨直覺，點選指引你今天學習的單字之光！」
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
                      className={`aspect-[2/3] rounded-2xl bg-gradient-to-br ${theme.gradient} border-2 ${theme.border} ${theme.glow} hover:-translate-y-2.5 active:scale-95 transition-all duration-300 cursor-pointer flex flex-col items-center justify-between p-3 relative group overflow-hidden`}
                    >
                      {/* 卡背金星背景 */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute inset-1.5 rounded-xl border border-white/20 pointer-events-none" />

                      {/* 頂部元素徽記標籤 */}
                      <div className="w-full flex items-center justify-between text-[10px] font-bold text-white/60">
                        <span>★</span>
                        <span className={`px-1.5 py-0.2 rounded-full ${theme.accentBg} ${theme.text} text-[9px]`}>
                          {theme.badge}
                        </span>
                        <span>★</span>
                      </div>

                      {/* 中央符號與標題 */}
                      <div className="flex flex-col items-center space-y-1.5 my-auto">
                        <span className="text-3xl sm:text-4xl filter drop-shadow group-hover:scale-125 group-hover:rotate-6 transition-all duration-300">
                          {theme.rune}
                        </span>
                        <div className="text-center">
                          <div className={`text-xs sm:text-sm font-black font-heading ${theme.text} tracking-wide drop-shadow`}>
                            {theme.titleZh}
                          </div>
                          <div className="text-[9px] font-mono font-bold text-slate-400">
                            {theme.titleEn}
                          </div>
                        </div>
                      </div>

                      {/* 底部能量座右銘引導語 */}
                      <div className="w-full text-center">
                        <span className="text-[9px] font-bold text-slate-300/80 block truncate">
                          {theme.motto}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>每日首次翻牌可獲探索積分 +5 點！翻開後可將實體卡釘在房間告示板上</span>
              </div>
            </div>
          ) : isSpinning ? (
            /* ── 階段二：選牌後的 2160 度陀螺急速大轉圈旋轉動畫舞臺 ── */
            <div className="w-full flex flex-col items-center justify-center py-8 space-y-6">
              <div className="relative flex items-center justify-center">
                {/* 陀螺旋轉旋風發光圈環 */}
                <div className="absolute w-64 h-64 rounded-full border-4 border-dashed border-amber-400/40 animate-spin duration-700 pointer-events-none" />
                <div className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-amber-500/20 via-fuchsia-500/20 to-cyan-500/20 blur-xl animate-pulse pointer-events-none" />

                {/* 急速 2160 度旋轉卡牌實體 (6 圈急速自轉) */}
                {(() => {
                  const theme = CARD_BACK_THEMES[selectedIndex] || CARD_BACK_THEMES[0];
                  return (
                    <div className={`w-44 aspect-[2/3] rounded-2xl bg-gradient-to-br ${theme.gradient} border-4 ${theme.border} ${theme.glow} flex flex-col items-center justify-center p-4 shadow-2xl animate-spin-top-2160`}>
                      <span className="text-5xl filter drop-shadow">
                        {theme.rune}
                      </span>
                      <span className={`text-sm font-black font-heading mt-2 ${theme.text}`}>
                        {theme.titleZh}
                      </span>
                      <span className="text-[10px] text-white/70 font-mono mt-1">
                        SPIRIT 2160°
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* 儀式感引導文字 */}
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-sm sm:text-base font-black text-amber-200 font-heading animate-pulse">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>🌀 命定能量急速凝聚中... 陀螺高速翻轉！</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-xs text-slate-300 font-bold">
                  正在連結大武山自然單字庫，即將揭曉今日心靈啟發！
                </p>
              </div>
            </div>
          ) : (
            /* ── 階段三：2160 度轉完後的平穩落地、3D 盛大揭曉展示 ── */
            <div className="w-full max-w-lg flex flex-col items-center space-y-3.5 py-1">
              
              {/* 卡牌正面 (精緻典雅 3D 展示卡牌) */}
              <div className={`w-full max-w-md rounded-3xl bg-gradient-to-b from-amber-100 via-amber-50 to-orange-50 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border-4 border-amber-400 dark:border-amber-500 shadow-[0_15px_40px_rgba(251,191,36,0.35)] p-5 sm:p-6 transition-all duration-500 flex flex-col space-y-3 relative overflow-hidden ${
                isFlipped ? 'scale-100 rotate-0 opacity-100' : 'scale-95 opacity-0'
              }`}>
                
                {/* 釘選標誌 (若已釘在告示板，顯示金黃圖釘效果) */}
                {isPinned && (
                  <div className="absolute top-2 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-[10px] font-black">
                    <Pin className="w-3 h-3 text-amber-600 fill-amber-600" />
                    <span>已釘在榮譽告示板</span>
                  </div>
                )}

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

                {/* 今日魔法英語短句區 (附朗讀按鈕) */}
                <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-500/15 border-2 border-amber-400/50 flex items-center justify-between gap-2.5">
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
                <div className="p-3 sm:p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-amber-200/60 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
                  <div className="text-xs font-black text-amber-800 dark:text-amber-400 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>心靈小智慧：</span>
                  </div>
                  <p>{selectedCard.quoteZh}</p>
                </div>

                {/* 翻牌積分結算橫幅 (每日首次 +5 積分，後續抽卡提醒) */}
                {isFirstDrawToday ? (
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border-2 border-emerald-400/60 text-emerald-800 dark:text-emerald-300 text-xs font-black flex items-center justify-center gap-1.5 animate-fadeIn">
                    <Trophy className="w-4 h-4 text-emerald-600 animate-bounce" />
                    <span>🎉 今日首次翻牌獎勵：探索積分 +5 點已入帳！</span>
                  </div>
                ) : (
                  <div className="p-2 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[11px] font-bold flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>今日已領取過每日翻牌積分 (+5)，可隨時反覆抽卡收集靈感！</span>
                  </div>
                )}
              </div>

              {/* Toast 提示 (釘選成功) */}
              {pinToast && (
                <div className="px-4 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-black shadow-lg animate-bounce flex items-center gap-1.5">
                  <Pin className="w-3.5 h-3.5" />
                  <span>{pinToast}</span>
                </div>
              )}

              {/* 底部操作按鈕：收藏釘至告示板 + 重新抽一張 + 收下放回書桌 */}
              <div className="grid grid-cols-3 gap-2 w-full max-w-md pt-1">
                {/* 📌 收藏貼到榮譽告示板 (只存最新一張，不佔雲端額度) */}
                <button
                  onClick={handlePinCard}
                  className={`py-2 px-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer active:scale-95 ${
                    isPinned
                      ? 'bg-amber-500/30 text-amber-200 border border-amber-400/60'
                      : 'bg-amber-600 hover:bg-amber-700 text-white border border-amber-400/40'
                  }`}
                  title="將這張靈感卡釘在房間牆上的榮譽告示板"
                >
                  <Pin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{isPinned ? '已釘在告示板' : '釘在告示板'}</span>
                </button>

                {/* 🔄 重新抽一張 */}
                <button
                  onClick={handleRedraw}
                  className="py-2 px-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-black text-xs border border-white/20 transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                  title="重新洗牌，再抽一張靈感卡"
                >
                  <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">再抽一張</span>
                </button>

                {/* ✅ 收下靈感，放回書桌 */}
                <button
                  onClick={onClose}
                  className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                  title="結束抽卡，放回書桌"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
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
