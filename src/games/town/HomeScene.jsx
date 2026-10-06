import React, { useState, useEffect } from 'react';
import { useStudent } from '../../context/StudentContext';
import { soundEngine, speakEnglish, stopSpeech } from '../../services/audio';
import { WisdomCardModal } from './WisdomCardModal';
import {
  ArrowLeft, Music, VolumeX, Sparkles, Package, Coins, Trophy,
  Volume2, Compass, Heart, Award, Shield, CheckCircle2, ShoppingBag,
  X, BookOpen, Coffee, Sun, Pin, Trash2
} from 'lucide-react';

const CATEGORY_TABS = [
  { id: 'all', label: '全部收藏' },
  { id: 'stationery', label: '文具圖書' },
  { id: 'food', label: '美味點心' },
  { id: 'ticket', label: '車票紀念' },
  { id: 'clothing', label: '服飾圖騰' },
  { id: 'special', label: '部落寶物' }
];

export const HomeScene = ({ onClose }) => {
  const { currentStudent, coins, questPoints, inventory, semesterName, semesterNotice, clearSemesterNotice } = useStudent();
  const [activeCategory, setActiveCategory] = useState('all');
  const [isBgmPlaying, setIsBgmPlaying] = useState(true);
  const [isBackpackOpen, setIsBackpackOpen] = useState(false);
  const [isNoticeBoardOpen, setIsNoticeBoardOpen] = useState(false);
  const [isWisdomModalOpen, setIsWisdomModalOpen] = useState(false);
  const [pinnedWisdomCard, setPinnedWisdomCard] = useState(null);
  const [useToast, setUseToast] = useState(null);
  const [bgError, setBgError] = useState(false);

  // 載入釘在告示板上的英語靈感卡 (僅存最新單張)
  const loadPinnedCard = () => {
    try {
      const saved = localStorage.getItem('wutai_latest_pinned_wisdom_card');
      if (saved) {
        setPinnedWisdomCard(JSON.parse(saved));
      } else {
        setPinnedWisdomCard(null);
      }
    } catch (e) {
      setPinnedWisdomCard(null);
    }
  };

  useEffect(() => {
    loadPinnedCard();
  }, [isNoticeBoardOpen, isWisdomModalOpen]);

  const handleUnpinCard = (e) => {
    if (e) e.stopPropagation();
    soundEngine.click();
    localStorage.removeItem('wutai_latest_pinned_wisdom_card');
    setPinnedWisdomCard(null);
    setUseToast("📌 已取下告示板上的靈感卡！");
    setTimeout(() => setUseToast(null), 3000);
  };

  // 進入房間自動啟動溫暖八音盒音樂
  const triggerAudio = () => {
    soundEngine.init();
    if (soundEngine.ctx && soundEngine.ctx.state === 'suspended') {
      soundEngine.ctx.resume().then(() => {
        soundEngine.startSceneBgm('home');
        setIsBgmPlaying(true);
      }).catch(() => {});
    } else {
      soundEngine.startSceneBgm('home');
      setIsBgmPlaying(true);
    }
  };

  useEffect(() => {
    triggerAudio();

    return () => {
      stopSpeech();
    };
  }, []);

  const handleToggleBgm = (e) => {
    if (e) e.stopPropagation();
    soundEngine.click();
    const active = soundEngine.toggleHomeBgm();
    setIsBgmPlaying(active);
  };

  const handleLeaveHome = (e) => {
    if (e) e.stopPropagation();
    stopSpeech();
    if (onClose) onClose();
  };

  const handleOpenBackpack = (e) => {
    if (e) e.stopPropagation();
    triggerAudio();
    soundEngine.click();
    setIsBackpackOpen(true);
    setIsNoticeBoardOpen(false);
  };

  const handleOpenNoticeBoard = (e) => {
    if (e) e.stopPropagation();
    triggerAudio();
    soundEngine.click();
    setIsNoticeBoardOpen(true);
    setIsBackpackOpen(false);
  };

  const handleDeskClick = (e) => {
    if (e) e.stopPropagation();
    triggerAudio();
    soundEngine.correct();
    speakEnglish("Welcome home! Learning English is fun and easy!");
    setUseToast("📖 溫馨書桌：今天也要元氣滿滿，開心大聲說英語！");
    setTimeout(() => setUseToast(null), 3600);
  };

  const handleBedClick = (e) => {
    if (e) e.stopPropagation();
    triggerAudio();
    soundEngine.click();
    setUseToast("🛌 溫暖的陽光大床：在霧臺小鎮逛累了，隨時可以回來休息充電！");
    setTimeout(() => setUseToast(null), 3600);
  };

  const handleUseItem = (item) => {
    soundEngine.correct();
    if (item.nameEn) {
      speakEnglish(item.nameEn);
    }

    if (item.category === 'food') {
      setUseToast(`😋 你在房間裡品嘗了「${item.nameZh}」！滿滿的幸福活力！`);
    } else if (item.category === 'clothing' || item.category === 'special') {
      setUseToast(`✨ 你在房間穿戴上了「${item.nameZh}」！展現自信的部落勇士風采！`);
    } else if (item.category === 'stationery') {
      setUseToast(`📝 你在書桌前拿出了「${item.nameZh}」，寫下了漂亮的英文單字！`);
    } else {
      setUseToast(`🎫 你整理了「${item.nameZh}」，期待下一次山林探險！`);
    }

    setTimeout(() => setUseToast(null), 3600);
  };

  const items = inventory || [];
  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(it => it.category === activeCategory);

  return (
    <div
      onClick={triggerAudio}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 overflow-hidden select-none animate-fadeIn"
    >
      
      {/* ── 16:9 比例完整保留吉卜力房間舞臺 (Zero-crop 16:9 Scenic Stage) ── */}
      <div className="relative w-full aspect-[16/9] max-h-screen overflow-hidden shadow-2xl bg-slate-950">
        
        {/* 全螢幕 16:9 原畫背景圖 (100% 完整無裁切、底層氛圍漸層確保首毫秒絕不黑屏) */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-700/30 via-orange-800/20 to-lime-900/30" />
        {!bgError && (
          <img
            src="/assets/town/bg_home.webp"
            alt="學生溫馨的家"
            onError={() => setBgError(true)}
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02] pointer-events-none transition-all duration-700"
          />
        )}

        {/* ── 頂部懸浮超薄毛玻璃導航列 (Floating Minimal HUD) ── */}
        <div className="absolute top-3 left-3 right-3 z-30 px-3.5 sm:px-5 py-2.5 rounded-2xl bg-slate-950/45 backdrop-blur-md border border-white/20 text-white flex items-center justify-between gap-3 shadow-lg pointer-events-auto">
          
          {/* 左側：返回小鎮按鈕 */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleLeaveHome}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-black text-xs sm:text-sm backdrop-blur-md border border-white/30 flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              title="返回霧臺小鎮全景地圖"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回小鎮</span>
            </button>

            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg">🏡</span>
              <span className="text-sm sm:text-base font-black text-white font-heading drop-shadow">
                {currentStudent?.nickname || '好學生'} 的溫馨房間
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30 hidden md:inline">
                Cozy Home
              </span>
            </div>
          </div>

          {/* 右側：八音盒音樂開關 + 金幣與積分計數 */}
          <div className="flex items-center gap-2 shrink-0">
            {/* 🎵 溫馨循環背景音樂按鈕 */}
            <button
              onClick={handleToggleBgm}
              className={`px-3 py-1.5 rounded-xl text-xs font-black backdrop-blur-md border transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95 ${
                isBgmPlaying
                  ? 'bg-amber-500/30 hover:bg-amber-500/40 text-amber-200 border-amber-400/50'
                  : 'bg-white/15 hover:bg-white/25 text-slate-300 border-white/20'
              }`}
              title={isBgmPlaying ? '點擊暫停背景音樂' : '點擊播放八音盒背景音樂'}
            >
              {isBgmPlaying ? (
                <>
                  <Music className="w-3.5 h-3.5 animate-bounce text-amber-300" />
                  <span className="hidden sm:inline">音樂：</span>
                  <span>播放中</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span>靜音</span>
                </>
              )}
            </button>

            {/* 金幣 */}
            <div className="px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-300/40 backdrop-blur-md flex items-center gap-1 text-amber-200 text-xs font-black shadow-sm">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-sm">{coins}</span>
            </div>

            {/* 積分 */}
            <div className="px-2.5 py-1 rounded-xl bg-indigo-500/20 border border-indigo-300/40 backdrop-blur-md hidden sm:flex items-center gap-1 text-indigo-200 text-xs font-black shadow-sm">
              <Trophy className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-mono text-sm">{questPoints}</span>
            </div>
          </div>
        </div>

        {/* ── 房間內互動熱區層 (Interactive Room Hotspots) ── */}
        
        {/* 🎯 熱區 1：椅子上的綠色探險書包 (Backpack on Wooden Chair) */}
        <div
          onClick={handleOpenBackpack}
          style={{ left: '39.5%', top: '44%', width: '10.5%', height: '28%' }}
          className="absolute z-20 cursor-pointer rounded-2xl group transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95"
          title="開啟書包"
        >
          {/* 呼吸微發光光圈 */}
          <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400/70 shadow-[0_0_22px_rgba(52,211,153,0.7),inset_0_0_12px_rgba(52,211,153,0.3)] animate-pulse group-hover:border-emerald-300 group-hover:shadow-[0_0_32px_rgba(52,211,153,0.95)]" />
          
          {/* 懸浮引導標籤 */}
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-emerald-400/70 text-white text-[11px] font-black flex items-center gap-1 shadow-xl whitespace-nowrap group-hover:-translate-y-1 transition-transform pointer-events-none">
            <span className="text-xs">🎒</span>
            <span className="text-emerald-200">書包</span>
            <span className="text-[10px] text-emerald-400">({items.length})</span>
          </div>
        </div>

        {/* 🎯 熱區 2：牆上的風景畫像與學習榮譽告示板 (Notice Board & Wall Gallery) */}
        <div
          onClick={handleOpenNoticeBoard}
          style={{ left: '66.5%', top: '5.5%', width: '25%', height: '34%' }}
          className="absolute z-20 cursor-pointer rounded-2xl group transition-all duration-300 flex items-center justify-center hover:scale-102 active:scale-98"
          title="查看告示板"
        >
          {/* 呼吸金色發光邊框 */}
          <div className="absolute inset-0 rounded-2xl border-2 border-amber-400/70 shadow-[0_0_22px_rgba(251,191,36,0.7),inset_0_0_12px_rgba(251,191,36,0.3)] animate-pulse group-hover:border-amber-300 group-hover:shadow-[0_0_35px_rgba(251,191,36,0.95)]" />

          {/* 懸浮引導標籤 */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-amber-400/70 text-white text-[11px] font-black flex items-center gap-1 shadow-xl whitespace-nowrap group-hover:translate-y-1 transition-transform pointer-events-none">
            <span className="text-xs">📜</span>
            <span className="text-amber-200">告示板</span>
          </div>
        </div>

        {/* 🎯 熱區 3：書桌上的魔法書 (Daily Word Wisdom Card / 每日英語靈感卡) */}
        <div
          onClick={(e) => {
            if (e) e.stopPropagation();
            triggerAudio();
            soundEngine.click();
            setIsWisdomModalOpen(true);
          }}
          style={{ left: '21.5%', top: '44%', width: '15%', height: '26%' }}
          className="absolute z-20 cursor-pointer rounded-2xl group transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95"
          title="翻開每日靈感卡"
        >
          {/* 呼吸紫金色發光邊框 */}
          <div className="absolute inset-0 rounded-2xl border-2 border-indigo-400/80 shadow-[0_0_24px_rgba(129,140,248,0.7),inset_0_0_12px_rgba(129,140,248,0.3)] animate-pulse group-hover:border-indigo-300 group-hover:shadow-[0_0_35px_rgba(129,140,248,0.95)]" />

          {/* 懸浮引導標籤 */}
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-indigo-400/70 text-white text-[11px] font-black flex items-center gap-1 shadow-xl whitespace-nowrap group-hover:-translate-y-1 transition-transform pointer-events-none">
            <span className="text-xs">📖</span>
            <span className="text-indigo-200">每日靈感卡</span>
          </div>
        </div>

        {/* 🎯 熱區 4：陽光大床彩蛋 (Cozy Bed Easter Egg) */}
        <div
          onClick={handleBedClick}
          style={{ left: '74%', top: '44%', width: '23%', height: '35%' }}
          className="absolute z-10 cursor-pointer rounded-2xl hover:border border-amber-300/40 hover:backdrop-brightness-105 transition-all group"
          title="溫暖休息"
        />

        {/* ── 底部超薄極簡快捷列 (Minimal Bottom Quick Bar) ── */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-2xl bg-slate-950/45 backdrop-blur-md border border-white/20 text-white shadow-lg flex items-center gap-2 pointer-events-auto">
          <button
            onClick={handleOpenBackpack}
            className="px-3 py-1 rounded-xl bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-200 border border-emerald-400/40 text-xs font-black transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <span>🎒</span>
            <span>書包 ({items.length})</span>
          </button>

          <button
            onClick={(e) => {
              if (e) e.stopPropagation();
              triggerAudio();
              soundEngine.click();
              setIsWisdomModalOpen(true);
            }}
            className="px-3 py-1 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/50 text-indigo-200 border border-indigo-400/40 text-xs font-black transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <span>📖</span>
            <span>每日靈感卡</span>
          </button>

          <button
            onClick={handleOpenNoticeBoard}
            className="px-3 py-1 rounded-xl bg-amber-500/30 hover:bg-amber-500/50 text-amber-200 border border-amber-400/40 text-xs font-black transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <span>📜</span>
            <span>告示板</span>
          </button>

          <button
            onClick={handleLeaveHome}
            className="px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-slate-200 border border-white/20 text-xs font-black transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <span>🚪</span>
            <span>返回小鎮</span>
          </button>
        </div>



        {/* ── 互動趣味 Toast 提示 ── */}
        {useToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-2xl bg-slate-900/90 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-2xl animate-bounce border border-amber-400/60 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{useToast}</span>
          </div>
        )}
      </div>

      {/* ── 📖 模態彈窗 3：書桌魔法英語靈感卡牌 ── */}
      {isWisdomModalOpen && (
        <WisdomCardModal
          onClose={() => setIsWisdomModalOpen(false)}
        />
      )}

      {/* ── 🎒 模態彈窗 1：點擊書包後開啟之背包整理視窗 ── */}
      {isBackpackOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
        >
          <div className="w-full max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-emerald-400 dark:border-emerald-600 overflow-hidden flex flex-col max-h-[85vh] animate-scaleUp">
            
            {/* 視窗頂部橫幅 */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-sm">
                  🎒
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-black">
                    個人探險書包 • 道具收納
                  </h3>
                  <p className="text-xs font-bold text-emerald-100">
                    點擊道具可點讀英語發音，並在房間內使用品嘗
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBackpackOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="關閉書包"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 分類標籤切換 */}
            <div className="p-3 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              {CATEGORY_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundEngine.click();
                    setActiveCategory(tab.id);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 道具格子列表 */}
            <div className="flex-1 overflow-y-auto p-4 min-h-[220px]">
              {filteredItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <span className="text-5xl opacity-80 animate-pulse">📦</span>
                  <p className="text-sm font-black text-slate-600 dark:text-slate-300">
                    {activeCategory === 'all'
                      ? '書包裡目前空空的喔！'
                      : `「${CATEGORY_TABS.find(t => t.id === activeCategory)?.label}」分類中尚無物品`}
                  </p>
                  <p className="text-xs font-bold text-slate-400 max-w-sm">
                    快走出家門，到小鎮上的【雲豹書局】挑選文具，或到【黑熊超市】購買美味點心充實書包吧！
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredItems.map((item, idx) => (
                    <div
                      key={`${item.id}_${idx}`}
                      onClick={() => handleUseItem(item)}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border-2 border-slate-200 hover:border-emerald-400 dark:border-slate-700 dark:hover:border-emerald-500 transition-all shadow-sm active:scale-97 cursor-pointer group flex items-start gap-3 relative"
                    >
                      <span className="w-12 h-12 rounded-xl bg-emerald-500/15 group-hover:bg-emerald-500/25 flex items-center justify-center text-2xl shrink-0 transition-colors border border-emerald-300/30">
                        {item.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-white font-heading truncate">
                            {item.nameEn}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              speakEnglish(item.nameEn);
                            }}
                            className="p-1 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400"
                            title="聆聽發音"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          {item.nameZh}
                        </div>
                        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 視窗底部按鈕 */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end shrink-0">
              <button
                onClick={() => setIsBackpackOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-black text-xs transition-colors cursor-pointer"
              >
                收起書包，回到房間
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 📜 模態彈窗 2：點擊告示板後開啟之學習榮譽與金幣成果榜 ── */}
      {isNoticeBoardOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
        >
          <div className="w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-amber-400 dark:border-amber-600 overflow-hidden flex flex-col animate-scaleUp">
            
            {/* 視窗頂部橫幅 */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-600 to-orange-700 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-sm">
                  📜
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-black">
                    學習榮譽告示板 • 個人成果
                  </h3>
                  <p className="text-xs font-bold text-amber-100">
                    霧臺國小自主英語探險家榮譽榜
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNoticeBoardOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="關閉告示板"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 告示板主體內容 */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              
              {/* 學生身分資訊卡片 */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <span className="w-12 h-12 rounded-xl bg-amber-500 text-white font-black text-xl flex items-center justify-center shadow-md">
                  🎓
                </span>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-base font-black text-slate-800 dark:text-white font-heading">
                      {currentStudent?.nickname || '好學生'}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                      初級探險家
                    </span>
                    {semesterName && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-700 dark:text-indigo-300">
                        {semesterName}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    學生座號：{currentStudent?.student_id || '訪客身分'}
                  </p>
                </div>
              </div>

              {/* 三大核心資產統計看板 */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-300/50">
                  <div className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center justify-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-amber-500" />
                    <span>宇宙金幣</span>
                  </div>
                  <div className="text-xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1">
                    {coins}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">可用於商店採買</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-300/50">
                  <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center justify-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-indigo-500" />
                    <span>冒險積分</span>
                  </div>
                  <div className="text-xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                    {questPoints}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">全校榮譽榜排名</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-300/50">
                  <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-1">
                    <Package className="w-3.5 h-3.5 text-emerald-500" />
                    <span>書包寶物</span>
                  </div>
                  <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                    {items.length}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">件收藏道具</div>
                </div>
              </div>

              {/* 📌 實體榮譽告示板卡牌專區 (展示最新單張釘選之英語靈感卡) */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-900/10 dark:bg-amber-950/30 border-2 border-amber-400/50 relative overflow-hidden">
                <div className="flex items-center justify-between pb-2 border-b border-amber-300/40 dark:border-amber-700/40">
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-800 dark:text-amber-300">
                    <Pin className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                    <span>今日英語靈感展示區 (書桌魔法卡)</span>
                  </div>
                  {pinnedWisdomCard && (
                    <button
                      onClick={handleUnpinCard}
                      className="text-[10px] text-rose-500 hover:text-rose-600 font-bold flex items-center gap-0.5 cursor-pointer"
                      title="取下此卡牌"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>取下圖釘</span>
                    </button>
                  )}
                </div>

                {pinnedWisdomCard ? (
                  <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-850 border border-amber-300 dark:border-amber-600/60 shadow-md relative group">
                    {/* 3D 圖釘立體效果 */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 border-2 border-white shadow-md flex items-center justify-center text-xs pointer-events-none">
                      📌
                    </div>

                    <div className="pt-1 flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                        {pinnedWisdomCard.icon || '✨'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="text-base font-black font-heading text-slate-800 dark:text-white">
                            {pinnedWisdomCard.word}
                          </h5>
                          {pinnedWisdomCard.phonetic && (
                            <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400">
                              {pinnedWisdomCard.phonetic}
                            </span>
                          )}
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold">
                            {pinnedWisdomCard.partOfSpeech}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center gap-2">
                          <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-white font-heading leading-snug">
                            "{pinnedWisdomCard.quoteEn}"
                          </p>
                          <button
                            onClick={() => {
                              soundEngine.click();
                              speakEnglish(pinnedWisdomCard.quoteEn);
                            }}
                            className="p-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-700 hover:text-white transition-colors cursor-pointer shrink-0"
                            title="聆聽發音"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                          {pinnedWisdomCard.quoteZh}
                        </p>

                        <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                          <span>📍 釘選日期：{pinnedWisdomCard.pinnedDate || '今日'}</span>
                          <span className="text-amber-600 dark:text-amber-400 font-bold">能量：{pinnedWisdomCard.energy}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 p-4 rounded-xl border-2 border-dashed border-amber-400/40 text-center space-y-1">
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                      📜 告示板尚未釘上靈感卡
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      點擊書桌上的魔法書抽取每日卡牌，即可將最喜歡的英語短句釘在此處每天溫習！
                    </p>
                  </div>
                )}
              </div>

              {/* 每日激勵卡片 */}
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200 dark:border-slate-700">
                <span className="text-amber-500 font-black">🌟 探險家評語：</span>
                「你每一次在霧臺小鎮開口說英語，都是成為大武山英語勇士的珍貴足跡！繼續挑戰每日任務，收集更多寶物吧！」
              </div>
            </div>

            {/* 視窗底部按鈕 */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end shrink-0">
              <button
                onClick={() => setIsNoticeBoardOpen(false)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition-colors cursor-pointer shadow-sm"
              >
                好的，回到房間
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScene;
