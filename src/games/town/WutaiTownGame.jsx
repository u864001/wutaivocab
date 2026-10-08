import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button3D } from '../../components/ui/Button3D';
import { useI18n } from '../../context/I18nContext';
import { useStudent } from '../../context/StudentContext';
import {
  TOWN_LOCATIONS,
  TOWN_ITEMS,
  TOWN_MAP_PANORAMA_IMG,
  getTodayDateStr,
  getDailyVisitingTeacherInfo,
  getLocationDailyTheme,
  DAILY_QUEST_MASTER_POOL
} from './townData';
import { DialogueEngine } from './DialogueEngine';
import { HomeScene } from './HomeScene';
import { ShopModal } from './ShopModal';
import { BackpackModal } from './BackpackModal';
import { QuestBoardModal } from './QuestBoardModal';
import { soundEngine, stopSpeech } from '../../services/audio';
import {
  ArrowLeft, Coins, Trophy, Package, ScrollText, Sparkles,
  Compass, ChevronRight, Gift, Music, VolumeX
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WutaiTownGame = ({ onBack }) => {
  const { lang } = useI18n();
  const {
    currentStudent,
    coins,
    questPoints,
    inventory,
    updateDailyQuest,
    claimTeacherBonus
  } = useStudent();

  // 計算今日客座外師巡迴狀態
  const todayStr = useMemo(() => getTodayDateStr(), []);
  const teacherInfo = useMemo(() => getDailyVisitingTeacherInfo(todayStr), [todayStr]);
  const hasMetTeacherToday = currentStudent?.daily_quest?.teacherMetDate === todayStr;

  // 畫面模態與地標狀態
  const [activeDialogueLocation, setActiveDialogueLocation] = useState(null);
  const [activeShopLocationId, setActiveShopLocationId] = useState(null);
  const [isHomeOpen, setIsHomeOpen] = useState(false);
  const [isBackpackOpen, setIsBackpackOpen] = useState(false);
  const [isQuestBoardOpen, setIsQuestBoardOpen] = useState(false);
  const [teacherBonusToast, setTeacherBonusToast] = useState(null);
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [isTownBgmActive, setIsTownBgmActive] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // 領取外師每日彩蛋積分處理 (提升至 10 ~ 20 探索積分，尊榮外師每日限定)
  const handleTeacherBonusClaimed = async () => {
    const bonus = Math.floor(Math.random() * 11) + 10; // 隨機 10 ~ 20 探索積分
    soundEngine.win();
    try {
      confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
    } catch (e) {}

    if (claimTeacherBonus) {
      await claimTeacherBonus(bonus, teacherInfo.teacher.nameZh);
    }

    setTeacherBonusToast({
      teacherName: teacherInfo.teacher.nameZh,
      points: bonus
    });

    setTimeout(() => {
      setTeacherBonusToast(null);
    }, 4500);
  };

  // 任務進度監聽處理 (全自動適配 52 款大師任務池：單點交談、單品採買、類別採購、雙點巡禮、三地標大巡查)
  const handleQuestProgress = useCallback(async (actionType, param1, param2) => {
    const dailyQuest = currentStudent?.daily_quest;
    if (!dailyQuest || dailyQuest.completed || dailyQuest.rewardClaimed) return;

    const currentQuestId = dailyQuest.questId || dailyQuest.activeQuestId;
    if (!currentQuestId) return;

    const template = DAILY_QUEST_MASTER_POOL.find(q => q.id === currentQuestId);
    if (!template) return;

    // 累積記錄進度：造訪過的地標與購買過的道具
    const prevProgress = (typeof dailyQuest.progress === 'object' && dailyQuest.progress) ? dailyQuest.progress : {};
    const visitedLocations = Array.isArray(prevProgress.visitedLocations) ? [...prevProgress.visitedLocations] : [];
    const boughtItems = Array.isArray(prevProgress.boughtItems) ? [...prevProgress.boughtItems] : [];

    let progressChanged = false;

    // 1. 對話推進 (param1: locationId, param2: currentNodeId)
    if (actionType === 'dialogue' && param1 && param2 && param2 !== 'welcome') {
      if (!visitedLocations.includes(param1)) {
        visitedLocations.push(param1);
        progressChanged = true;
      }
    }

    // 2. 道具購買 (param1: item.category, param2: item.id)
    if (actionType === 'buy' && param2) {
      if (!boughtItems.includes(param2)) {
        boughtItems.push(param2);
        progressChanged = true;
      }
      const shopLoc = TOWN_ITEMS.find(it => it.id === param2)?.shopId;
      if (shopLoc && !visitedLocations.includes(shopLoc)) {
        visitedLocations.push(shopLoc);
        progressChanged = true;
      }
    }

    let shouldComplete = false;

    // ── 依任務類型進行達成判定 ──
    // A. 單地標生活英語交談 (talk)
    if (template.type === 'talk') {
      if (visitedLocations.includes(template.targetLocation)) {
        shouldComplete = true;
      }
    }
    // B. 指定單品採買 (buy_item)
    else if (template.type === 'buy_item') {
      if (boughtItems.includes(template.targetItemId)) {
        shouldComplete = true;
      }
    }
    // C. 類別採買 (buy_category)
    else if (template.type === 'buy_category') {
      if (actionType === 'buy' && param1 === template.targetCategory) {
        shouldComplete = true;
      }
    }
    // D. 地標交談或採買皆可 (talk_or_buy)
    else if (template.type === 'talk_or_buy') {
      if (visitedLocations.includes(template.targetLocation)) {
        shouldComplete = true;
      }
    }
    // E. 雙地標跨點巡禮 (multi_tour)
    else if (template.type === 'multi_tour') {
      if (Array.isArray(template.targetLocations) && template.targetLocations.every(loc => visitedLocations.includes(loc))) {
        shouldComplete = true;
      }
    }
    // F. 複合任務：買道具 + 指定地點對話 (buy_and_visit)
    else if (template.type === 'buy_and_visit') {
      const hasBought = Array.isArray(template.validItemIds)
        ? template.validItemIds.some(id => boughtItems.includes(id))
        : boughtItems.length > 0;
      const hasVisited = visitedLocations.includes(template.targetLocation);
      if (hasBought && hasVisited) {
        shouldComplete = true;
      }
    }
    // G. 三地標大巡禮 (grand_tour)
    else if (template.type === 'grand_tour') {
      if (visitedLocations.length >= (template.requiredCount || 3)) {
        shouldComplete = true;
      }
    }

    if (shouldComplete) {
      soundEngine.win();
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}

      const updated = {
        ...dailyQuest,
        completed: true,
        completedAt: new Date().toISOString(),
        progress: {
          visitedLocations,
          boughtItems
        }
      };
      await updateDailyQuest(updated);
    } else if (progressChanged) {
      // 僅更新中間進度供 UI 即時打勾
      await updateDailyQuest({
        ...dailyQuest,
        progress: {
          visitedLocations,
          boughtItems
        }
      });
    }
  }, [currentStudent?.daily_quest, updateDailyQuest]);

  // ── 全自動場景背景音樂無縫切換 (Town / Home / Sub-scenes) ──
  useEffect(() => {
    if (!isTownBgmActive) {
      soundEngine.stopSceneBgm();
      return;
    }

    soundEngine.init();
    if (soundEngine.ctx && soundEngine.ctx.state === 'suspended') {
      soundEngine.ctx.resume().catch(() => {});
    }

    if (isHomeOpen) {
      soundEngine.startSceneBgm('home');
    } else if (activeDialogueLocation) {
      soundEngine.startSceneBgm(activeDialogueLocation.id);
    } else {
      soundEngine.startSceneBgm('town');
    }
  }, [isHomeOpen, activeDialogueLocation, isTownBgmActive]);

  // 組件卸載時中斷所有 TTS 語音與音樂
  useEffect(() => {
    return () => {
      stopSpeech();
      soundEngine.stopSceneBgm();
    };
  }, []);

  // ── 預先快取小鎮各場景與 NPC WebP 圖片 (瀏覽器背景閒置預載，秒開零等待) ──
  useEffect(() => {
    const preloadList = [
      ...TOWN_LOCATIONS.flatMap(loc => [loc.bgImage, loc.npcPortrait].filter(Boolean)),
      '/assets/town/bg_home.webp',
      '/assets/town/teacher_mario.webp',
      '/assets/town/teacher_ibu.webp'
    ];

    const runPreload = () => {
      preloadList.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    };

    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(runPreload, { timeout: 2000 });
      } else {
        setTimeout(runPreload, 300);
      }
    }
  }, []);

  const handleToggleTownBgm = (e) => {
    if (e) e.stopPropagation();
    soundEngine.click();
    if (isTownBgmActive) {
      soundEngine.stopSceneBgm();
      setIsTownBgmActive(false);
    } else {
      setIsTownBgmActive(true);
    }
  };

  const handleOpenLocation = (loc) => {
    stopSpeech();
    soundEngine.click();
    soundEngine.init();
    if (soundEngine.ctx && soundEngine.ctx.state === 'suspended') {
      soundEngine.ctx.resume().catch(() => {});
    }
    if (loc.id === 'home') {
      setIsHomeOpen(true);
      return;
    }
    setActiveDialogueLocation(loc);
  };

  const handleBackToGalaxy = () => {
    stopSpeech();
    soundEngine.stopSceneBgm();
    if (onBack) onBack();
  };

  const isTeacherAtActiveLocation = Boolean(
    activeDialogueLocation &&
    activeDialogueLocation.id === teacherInfo.locationId &&
    !hasMetTeacherToday
  );

  return (
    <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 py-2 animate-fadeIn flex flex-col items-center">
      
      {/* ── 16:9 比例完整保留全景大地圖容器 (Zero-crop 16:9 Panoramic Stage) ── */}
      <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-500/50 bg-slate-950 select-none">
        
        {/* 全景地圖底圖 (100% 完整無裁切呈現) */}
        <img
          src={TOWN_MAP_PANORAMA_IMG}
          alt="霧臺小鎮全景大地圖"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none filter brightness-[0.98] contrast-[1.02]"
        />

        {/* ── 頂部懸浮超輕薄毛玻璃導航橫幅 (Floating Top Glass HUD) ── */}
        <div className="absolute top-1.5 left-1.5 right-1.5 sm:top-3 sm:left-3 sm:right-3 z-30 px-2 sm:px-5 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-slate-950/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-between gap-1.5 sm:gap-3 shadow-lg pointer-events-auto">
          
          {/* 左側：返回學習宇宙與標題 (手機版極精簡圖示) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              onClick={handleBackToGalaxy}
              title={lang === 'zh-TW' ? '回學習宇宙' : 'Back'}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-black flex items-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">{lang === 'zh-TW' ? '回學習宇宙' : 'Back'}</span>
            </button>

            <span className="text-xs sm:text-lg font-black font-heading text-white drop-shadow hidden xs:inline sm:inline">
              🏔️ 霧臺小鎮
            </span>
          </div>

          {/* 🌟 中央核心：僅在平板與電腦寬螢幕顯示地點資訊 (手機版隱藏，徹底避免被擠成 6 行) ── */}
          <div className="hidden md:flex flex-1 text-center px-2 min-w-0 justify-center">
            {hoveredLocation ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-emerald-950/60 border border-emerald-400/60 backdrop-blur-md shadow-md animate-scaleUp">
                <span className="text-base sm:text-lg">{hoveredLocation.npcAvatar}</span>
                <div className="text-left">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs sm:text-sm font-black text-emerald-200 font-heading">
                      {hoveredLocation.nameZh}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-300">
                      {hoveredLocation.nameEn}
                    </span>
                    {hoveredLocation.id === teacherInfo.locationId && !hasMetTeacherToday && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black animate-pulse flex items-center gap-0.5">
                        <Sparkles className="w-3 h-3" />
                        <span>外師 {teacherInfo.teacher.nameZh} 在此！</span>
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-bold text-slate-300 hidden lg:block">
                    {hoveredLocation.npcName}
                  </div>
                </div>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/10 text-slate-200 text-xs font-bold shadow-sm">
                <Compass className="w-3.5 h-3.5 text-emerald-300 animate-spin-slow" />
                <span>探索霧臺小鎮</span>
              </div>
            )}
          </div>

          {/* 右側：音樂切換 + 金幣 + 榮譽積分 + 背包 + 任務 (手機版純圖示單行排版) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* 🎵 音樂開關 */}
            <button
              onClick={handleToggleTownBgm}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-black backdrop-blur-md border transition-all flex items-center gap-1 shadow-sm cursor-pointer active:scale-95 ${
                isTownBgmActive
                  ? 'bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-200 border-emerald-400/50'
                  : 'bg-white/15 hover:bg-white/25 text-slate-300 border-white/20'
              }`}
              title={isTownBgmActive ? '暫停背景音樂' : '播放背景音樂'}
            >
              {isTownBgmActive ? (
                <>
                  <Music className="w-3.5 h-3.5 animate-bounce text-emerald-300" />
                  <span className="hidden lg:inline text-[11px]">小鎮音樂</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden lg:inline text-[11px]">靜音</span>
                </>
              )}
            </button>

            {/* 金幣計數器 */}
            <div className="px-1.5 py-1 sm:px-2.5 sm:py-1 rounded-xl bg-amber-500/20 border border-amber-300/40 backdrop-blur-md flex items-center gap-1 text-amber-200 text-xs font-black shadow-sm">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-xs sm:text-sm">{coins}</span>
            </div>

            {/* 探索積分 (榮譽) */}
            <div className="px-1.5 py-1 sm:px-2.5 sm:py-1 rounded-xl bg-indigo-500/20 border border-indigo-300/40 backdrop-blur-md flex items-center gap-1 text-indigo-200 text-xs font-black shadow-sm">
              <Trophy className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-mono text-xs sm:text-sm">{questPoints}</span>
            </div>

            {/* 我的房間 / 背包 */}
            <button
              onClick={() => {
                soundEngine.click();
                soundEngine.init();
                if (soundEngine.ctx && soundEngine.ctx.state === 'suspended') {
                  soundEngine.ctx.resume().catch(() => {});
                }
                soundEngine.startHomeBgm();
                setIsHomeOpen(true);
              }}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-lime-600 hover:bg-lime-700 text-white text-xs font-black flex items-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer"
              title="回到溫馨的家 • 整理背包"
            >
              <Package className="w-3.5 h-3.5" />
              <span className="hidden md:inline">我的房間</span>
              <span className="text-[11px] sm:text-xs font-mono">({inventory?.length || 0})</span>
            </button>

            {/* 每日任務 */}
            <button
              onClick={() => {
                soundEngine.click();
                setIsQuestBoardOpen(true);
              }}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer"
              title="查看每日任務"
            >
              <ScrollText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">每日任務</span>
            </button>
          </div>
        </div>

        {/* ── 9 大建築精準熱區 (Interactive Hotspot Areas with Neon Glow on Hover) ── */}
        <div className="absolute inset-0 pointer-events-none">
          {TOWN_LOCATIONS.map((loc) => {
            const isTeacherHere = (loc.id === teacherInfo.locationId && !hasMetTeacherToday);
            const isHovered = hoveredLocation?.id === loc.id;
            const area = loc.mapArea || { left: 45, top: 45, width: 15, height: 15 };

            return (
              <div
                key={loc.id}
                style={{
                  left: `${area.left}%`,
                  top: `${area.top}%`,
                  width: `${area.width}%`,
                  height: `${area.height}%`
                }}
                onMouseEnter={() => setHoveredLocation(loc)}
                onMouseLeave={() => setHoveredLocation(null)}
                onClick={() => handleOpenLocation(loc)}
                className={`absolute rounded-3xl pointer-events-auto cursor-pointer transition-all duration-300 transform group ${
                  isHovered
                    ? 'scale-[1.03] border-2 border-emerald-400 shadow-[0_0_35px_6px_rgba(52,211,153,0.85),inset_0_0_20px_rgba(52,211,153,0.3)] backdrop-brightness-[1.12] backdrop-contrast-[1.05] z-20'
                    : isTeacherHere
                    ? 'border-2 border-amber-400/70 shadow-[0_0_22px_rgba(245,158,11,0.55)] animate-pulse z-10'
                    : 'border border-white/0 hover:border-emerald-400/50 z-10'
                }`}
                title={`進入 ${loc.nameZh}`}
              >
                {/* 外師現身之微型小金星 (自然融入角落，不突兀) */}
                {isTeacherHere && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black shadow-lg animate-bounce flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3" />
                    <span>外師現身</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* ── 電腦版底部超薄快捷切換列 (Minimalist Floating Bottom Dock) ── */}
        <div className="hidden sm:flex absolute bottom-3 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-2xl bg-slate-950/45 backdrop-blur-md border border-white/20 text-white shadow-lg items-center gap-1.5 max-w-[94vw] overflow-x-auto pointer-events-auto">
          {TOWN_LOCATIONS.map((loc) => {
            const isTeacherHere = (loc.id === teacherInfo.locationId && !hasMetTeacherToday);
            const isHovered = hoveredLocation?.id === loc.id;

            return (
              <button
                key={loc.id}
                onMouseEnter={() => setHoveredLocation(loc)}
                onMouseLeave={() => setHoveredLocation(null)}
                onClick={() => handleOpenLocation(loc)}
                className={`px-2.5 py-1 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer ${
                  isHovered
                    ? 'bg-emerald-500 text-white scale-105 shadow-[0_0_15px_rgba(52,211,153,0.8)]'
                    : isTeacherHere
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-white/15 hover:bg-white/25 text-slate-200 border border-white/10'
                }`}
              >
                <span>{loc.npcAvatar}</span>
                <span>{loc.nameZh}</span>
              </button>
            );
          })}
        </div>

        {/* ── 手機版底部收折按鈕 (不佔用地圖畫面，點擊滑出抽屜選單) ── */}
        <div className="sm:hidden absolute bottom-2 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="px-3.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-400/60 text-white text-[11px] font-black flex items-center gap-1.5 shadow-lg active:scale-95 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
            <span>9 大地標導覽</span>
            <span className="text-[9px] text-emerald-300 bg-emerald-500/25 px-1.5 py-0.5 rounded-full">展開</span>
          </button>
        </div>
      </div>

      {/* ── 手機版 9 大地標底部滑出抽屜選單 (Mobile Location Drawer) ── */}
      {isMobileNavOpen && (
        <div className="sm:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-fadeIn pointer-events-auto">
          <div
            className="w-full bg-slate-900 border-t-2 border-emerald-500/50 rounded-t-3xl p-4 max-h-[75vh] overflow-y-auto animate-slideUp text-white shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <h3 className="font-heading font-black text-sm text-emerald-300">
                  霧臺小鎮 9 大生活地標
                </h3>
              </div>
              <button
                onClick={() => setIsMobileNavOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-xs font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3">
              {TOWN_LOCATIONS.map((loc) => {
                const isTeacherHere = (loc.id === teacherInfo.locationId && !hasMetTeacherToday);
                return (
                  <button
                    key={loc.id}
                    onClick={() => {
                      setIsMobileNavOpen(false);
                      handleOpenLocation(loc);
                    }}
                    className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer ${
                      isTeacherHere
                        ? 'bg-amber-950/60 border-amber-400/80 shadow-md'
                        : 'bg-slate-800/80 border-slate-700/80 hover:border-emerald-400/60'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{loc.npcAvatar}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-black text-white truncate font-heading">
                          {loc.nameZh}
                        </span>
                        {isTeacherHere && (
                          <span className="text-[9px] bg-amber-500 text-white px-1 py-0.2 rounded font-black shrink-0">
                            外師
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 truncate">
                        {loc.nameEn}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── 外師每日彩蛋獎勵提示 Toast ── */}
      {teacherBonusToast && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white flex items-center gap-3 shadow-2xl animate-bounce">
          <span className="p-2 rounded-xl bg-white/20 text-2xl">🎉</span>
          <div>
            <h4 className="font-black text-sm font-heading">
              獲得 {teacherBonusToast.teacherName} 的每日驚喜獎勵！
            </h4>
            <p className="text-xs font-bold text-white/90">
              探索積分 +{teacherBonusToast.points} 點！榮譽榜同步提升！
            </p>
          </div>
        </div>
      )}

      {/* ── 🏡 學生溫馨的家 (全螢幕吉卜力房間與循環背景音樂) ── */}
      {isHomeOpen && (
        <HomeScene
          onClose={() => setIsHomeOpen(false)}
        />
      )}

      {/* ── 全螢幕 2D 視覺小說冒險對話場景 (Visual Novel Scene Stage) ── */}
      {activeDialogueLocation && activeDialogueLocation.id !== 'home' && (
        <DialogueEngine
          key={activeDialogueLocation.id + (isTeacherAtActiveLocation ? '_teacher' : '')}
          location={activeDialogueLocation}
          onClose={() => {
            stopSpeech();
            setActiveDialogueLocation(null);
          }}
          onOpenShop={(shopId) => {
            stopSpeech();
            setActiveShopLocationId(shopId);
          }}
          onOpenQuests={() => {
            stopSpeech();
            setIsQuestBoardOpen(true);
          }}
          onQuestProgress={handleQuestProgress}
          isVisitingTeacher={isTeacherAtActiveLocation}
          visitingTeacher={teacherInfo.teacher}
          onTeacherBonusClaimed={handleTeacherBonusClaimed}
        />
      )}

      {/* ── 金幣商店模態窗 ── */}
      {activeShopLocationId && (
        <ShopModal
          locationId={activeShopLocationId}
          onClose={() => setActiveShopLocationId(null)}
          onQuestProgress={handleQuestProgress}
        />
      )}

      {/* ── 學生個人背包倉庫模態窗 ── */}
      {isBackpackOpen && (
        <BackpackModal
          onClose={() => setIsBackpackOpen(false)}
        />
      )}

      {/* ── 每日任務公佈欄模態窗 ── */}
      {isQuestBoardOpen && (
        <QuestBoardModal
          onClose={() => setIsQuestBoardOpen(false)}
          onNavigateLocation={(targetLocId) => {
            const found = TOWN_LOCATIONS.find(l => l.id === targetLocId);
            if (found) {
              handleOpenLocation(found);
            }
          }}
        />
      )}
    </div>
  );
};

export default WutaiTownGame;
