import React, { useState, useEffect } from 'react';
import { useStudent } from '../../context/StudentContext';
import { soundEngine, speakEnglish, stopSpeech } from '../../services/audio';
import {
  ArrowLeft, Music, VolumeX, Sparkles, Package, Coins, Trophy,
  Volume2, Compass, Heart, Award, Shield, CheckCircle2, ShoppingBag
} from 'lucide-react';

const CATEGORY_TABS = [
  { id: 'all', label: '全部收藏' },
  { id: 'stationery', label: '文具圖書' },
  { id: 'food', label: '美味點心' },
  { id: 'ticket', label: '車票紀念' },
  { id: 'clothing', label: '服飾圖騰' },
  { id: 'special', label: '部落寶物' }
];

export const HomeScene = ({ onClose, onNavigateLocation }) => {
  const { currentStudent, coins, questPoints, inventory } = useStudent();
  const [activeCategory, setActiveCategory] = useState('all');
  const [isBgmPlaying, setIsBgmPlaying] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [useToast, setUseToast] = useState(null);
  const [bgError, setBgError] = useState(false);

  // 進入溫馨的家時，自動播放溫暖八音盒循環背景音樂；離開時立即停止
  useEffect(() => {
    soundEngine.startHomeBgm();
    setIsBgmPlaying(soundEngine.isHomeBgmActive());

    return () => {
      soundEngine.stopHomeBgm();
      stopSpeech();
    };
  }, []);

  const handleToggleBgm = () => {
    soundEngine.click();
    const active = soundEngine.toggleHomeBgm();
    setIsBgmPlaying(active);
  };

  const handleLeaveHome = () => {
    soundEngine.stopHomeBgm();
    stopSpeech();
    if (onClose) onClose();
  };

  const handleUseItem = (item) => {
    soundEngine.correct();
    if (item.nameEn) {
      speakEnglish(item.nameEn);
    }

    if (item.category === 'food') {
      setUseToast(`😋 你在溫馨的房間裡品嘗了「${item.nameZh}」！滿滿的幸福活力！`);
    } else if (item.category === 'clothing' || item.category === 'special') {
      setUseToast(`✨ 你在全身鏡前換上了「${item.nameZh}」！展現自信的部落風采！`);
    } else if (item.category === 'stationery') {
      setUseToast(`📝 你在書桌前拿出了「${item.nameZh}」，寫下了一句很棒的英文！`);
    } else {
      setUseToast(`🎫 你整理了「${item.nameZh}」，期待下一次精彩的山林冒險！`);
    }

    setTimeout(() => setUseToast(null), 3600);
  };

  const items = inventory || [];
  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(it => it.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 overflow-hidden select-none animate-fadeIn">
      
      {/* ── 1. 全螢幕 16:9 溫馨的家吉卜力原畫背景 (Cozy Home Backdrop) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {!bgError ? (
          <img
            src="/assets/town/bg_home.png"
            alt="學生溫馨的家"
            onError={() => setBgError(true)}
            className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.03] transition-all duration-700 scale-100"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-700/30 via-orange-800/20 to-lime-900/30" />
        )}
        {/* 電影級晨光與柔和暗角 */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/45" />
      </div>

      {/* ── 2. 頂部 HUD 狀態列 (Top HUD) ── */}
      <div className="relative z-30 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 bg-slate-950/45 backdrop-blur-md border-b border-white/15 shrink-0">
        <div className="flex items-center gap-3">
          {/* 返回小鎮地圖快捷鈕 */}
          <button
            onClick={handleLeaveHome}
            className="px-3.5 py-1.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-black text-xs sm:text-sm backdrop-blur-md border border-white/30 flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            title="隨時返回霧臺小鎮全景地圖"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回小鎮地圖</span>
          </button>

          {/* 地標標籤 */}
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 backdrop-blur-md flex items-center justify-center text-lg shadow-sm border border-amber-400/30">
              🏡
            </span>
            <span className="text-sm sm:text-base font-black text-white font-heading drop-shadow-md">
              學生溫馨的家
            </span>
            <span className="text-xs font-mono font-bold text-amber-300 bg-white/10 px-2 py-0.5 rounded-full hidden sm:inline">
              Cozy Home
            </span>
          </div>
        </div>

        {/* 右側：溫馨循環音樂開關 + 金幣與積分計數 */}
        <div className="flex items-center gap-2">
          {/* 🎵 溫馨循環背景音樂開關 */}
          <button
            onClick={handleToggleBgm}
            className={`px-3 py-1.5 rounded-2xl text-xs font-black backdrop-blur-md border transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95 ${
              isBgmPlaying
                ? 'bg-amber-500/30 hover:bg-amber-500/40 text-amber-200 border-amber-400/50'
                : 'bg-white/15 hover:bg-white/25 text-slate-300 border-white/20'
            }`}
            title={isBgmPlaying ? '點擊暫停背景音樂' : '點擊播放溫馨八音盒背景音樂'}
          >
            {isBgmPlaying ? (
              <>
                <Music className="w-3.5 h-3.5 animate-bounce text-amber-300" />
                <span className="hidden sm:inline">溫馨八音盒音樂：</span>
                <span>播放中</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span>音樂已靜音</span>
              </>
            )}
          </button>

          {/* 金幣存量 */}
          <div className="px-3 py-1.5 rounded-2xl bg-amber-500/20 border border-amber-300/40 backdrop-blur-md flex items-center gap-1.5 text-amber-200 text-xs font-black shadow-sm">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-sm">{coins}</span>
          </div>

          {/* 探索積分 */}
          <div className="px-3 py-1.5 rounded-2xl bg-indigo-500/20 border border-indigo-300/40 backdrop-blur-md hidden sm:flex items-center gap-1.5 text-indigo-200 text-xs font-black shadow-sm">
            <Trophy className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono text-sm">{questPoints}</span>
          </div>
        </div>
      </div>

      {/* 道具使用回饋 Toast */}
      {useToast && (
        <div className="relative z-40 mx-4 sm:mx-8 mt-3 p-3 rounded-2xl bg-gradient-to-r from-amber-600 to-emerald-600 text-white font-black text-xs sm:text-sm flex items-center justify-between shadow-xl animate-fadeIn border border-white/20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 animate-bounce text-yellow-200" />
            <span>{useToast}</span>
          </div>
          <button
            onClick={() => setUseToast(null)}
            className="text-white/80 hover:text-white text-xs px-2 py-0.5 rounded-lg bg-black/20"
          >
            好的
          </button>
        </div>
      )}

      {/* ── 3. 主舞臺：左側個人天地卡片 + 右側陳列置物架與背包 ── */}
      <div className="relative z-20 flex-1 flex flex-col lg:flex-row items-stretch justify-between p-4 sm:p-6 md:p-8 gap-5 max-w-7xl mx-auto w-full min-h-0 overflow-y-auto">
        
        {/* ── 左側：學生個人房間與成就書桌 (Personal Desk & Profile) ── */}
        <div className="w-full lg:w-4/12 flex flex-col gap-4 shrink-0">
          
          {/* 歡迎回家的暖心大卡片 */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-2 border-amber-300/60 dark:border-amber-500/40 shadow-2xl space-y-3.5 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-md border-2 border-white/60">
                🏡
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white font-heading">
                    {currentStudent?.nickname || '好學生'} 的房間
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                    學習家
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  座號：{currentStudent?.student_id || '訪客'}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-bold text-amber-900/90 dark:text-amber-200/90 leading-relaxed bg-amber-50/80 dark:bg-amber-950/40 p-3.5 rounded-2xl border border-amber-200/60 dark:border-amber-800/60">
              「歡迎回到溫暖的家！在山中小鎮探險之後，可以在房間裡聆聽八音盒旋律，整理你買回來的英語學習寶物、衣服與美食。」
            </p>

            {/* 榮譽與存錢筒小看板 */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-300/40">
                <div className="text-xs font-bold text-amber-700 dark:text-amber-300">儲蓄金幣</div>
                <div className="text-base sm:text-lg font-black font-mono text-amber-600 dark:text-amber-400">
                  {coins}
                </div>
              </div>
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-300/40">
                <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300">冒險積分</div>
                <div className="text-base sm:text-lg font-black font-mono text-indigo-600 dark:text-indigo-400">
                  {questPoints}
                </div>
              </div>
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-300/40">
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">寶物件數</div>
                <div className="text-base sm:text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {items.length}
                </div>
              </div>
            </div>

            {/* 外出小鎮快捷按鈕 */}
            <button
              onClick={handleLeaveHome}
              className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Compass className="w-4 h-4" />
              <span>走出家門 • 探索霧臺小鎮</span>
            </button>
          </div>
        </div>

        {/* ── 右側：個人探險背包與道具陳列架 (Cozy Shelf & Backpack Storage) ── */}
        <div className="w-full lg:w-8/12 flex flex-col p-4 sm:p-6 rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-2 border-white/60 dark:border-slate-700/60 shadow-2xl min-h-[380px] overflow-hidden">
          
          {/* 置物架頂部與分類切換 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700 shrink-0">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-500" />
              <h4 className="text-sm sm:text-base font-black text-slate-800 dark:text-white font-heading">
                個人探險背包收納架
              </h4>
              <span className="text-[11px] font-bold text-slate-500">
                (點擊道具可朗讀英語發音與使用)
              </span>
            </div>

            {/* 分類按鈕 */}
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
              {CATEGORY_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundEngine.click();
                    setActiveCategory(tab.id);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-amber-500 text-white shadow-sm scale-103'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 道具格子列表 */}
          <div className="flex-1 overflow-y-auto pt-3.5 pr-1 min-h-[220px]">
            {filteredItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <span className="text-5xl opacity-80 animate-pulse">📦</span>
                <p className="text-sm font-black text-slate-600 dark:text-slate-300">
                  {activeCategory === 'all'
                    ? '背包架上目前空空的喔！'
                    : `「${CATEGORY_TABS.find(t => t.id === activeCategory)?.label}」分類中尚無物品`}
                </p>
                <p className="text-xs font-bold text-slate-400 max-w-sm">
                  快出發前往小鎮上的【雲豹書局】挑選文具，或到【黑熊超市】購買美味點心，豐富你的房間收藏吧！
                </p>
                <button
                  onClick={handleLeaveHome}
                  className="mt-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>去小鎮商店逛逛</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredItems.map((item, idx) => (
                  <div
                    key={`${item.id}_${idx}`}
                    onClick={() => handleUseItem(item)}
                    className="p-3.5 rounded-2xl bg-white/75 dark:bg-slate-800/75 hover:bg-amber-50 dark:hover:bg-amber-950/30 border-2 border-slate-200/80 hover:border-amber-400 dark:border-slate-700 dark:hover:border-amber-500 transition-all shadow-sm active:scale-97 cursor-pointer group flex items-start gap-3 relative"
                  >
                    <span className="w-12 h-12 rounded-xl bg-amber-500/15 group-hover:bg-amber-500/25 flex items-center justify-center text-2xl shrink-0 transition-colors border border-amber-300/30">
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
                          className="p-1 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 text-amber-600 dark:text-amber-400"
                          title="聆聽英文發音"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-xs font-bold text-amber-700 dark:text-amber-300">
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
        </div>
      </div>
    </div>
  );
};

export default HomeScene;
