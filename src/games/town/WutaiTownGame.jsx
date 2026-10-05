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
  getLocationDailyTheme
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

  // 領取外師每日彩蛋積分處理
  const handleTeacherBonusClaimed = async () => {
    const bonus = Math.floor(Math.random() * 6) + 5; // 隨機 5 ~ 10 探索積分
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

  // 任務進度監聽處理
  const handleQuestProgress = useCallback(async (actionType, param1, param2) => {
    const dailyQuest = currentStudent?.daily_quest;
    if (!dailyQuest || dailyQuest.completed || dailyQuest.rewardClaimed) return;

    let shouldComplete = false;

    // 簡易任務 1：黑熊超市買食物或進行問候對話
    if (dailyQuest.questId === 'easy_greet_supermarket') {
      if ((actionType === 'buy' && (param1 === 'food' || param2 === 'sandwich_item' || param2 === 'apple_item')) ||
          (actionType === 'dialogue' && param1 === 'supermarket')) {
        shouldComplete = true;
      }
    }
    // 簡易任務 2：書局買文具或向店長請教
    else if (dailyQuest.questId === 'easy_stationery_check') {
      if ((actionType === 'buy' && (param1 === 'stationery' || param2 === 'pencil_item' || param2 === 'eraser_item')) ||
          (actionType === 'dialogue' && param1 === 'bookstore')) {
        shouldComplete = true;
      }
    }
    // 中階任務 1：公園自然四季生態對話
    else if (dailyQuest.questId === 'medium_nature_explorer') {
      if (actionType === 'dialogue' && param1 === 'park' && ['sunny', 'cool', 'animals', 'seasons'].includes(param2)) {
        shouldComplete = true;
      }
    }
    // 中階任務 2：診所就醫健康對話或購買保健物資
    else if (dailyQuest.questId === 'medium_healthy_hero') {
      if ((actionType === 'dialogue' && param1 === 'clinic' && ['throat', 'healthy'].includes(param2)) ||
          (actionType === 'buy' && (param1 === 'special' || param2 === 'throat_lozenge' || param2 === 'cooling_patch' || param2 === 'water_bottle_item'))) {
        shouldComplete = true;
      }
    }
    // 高階任務：集會所深入了解百合文化涵義或購買百合勇士勳章
    else if (dailyQuest.questId === 'hard_tribal_warrior') {
      if ((actionType === 'dialogue' && param1 === 'plaza' && ['lily_meaning', 'badge_offer'].includes(param2)) ||
          (actionType === 'buy' && param2 === 'lily_badge')) {
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
        completedAt: new Date().toISOString()
      };
      await updateDailyQuest(updated);
    }
  }, [currentStudent?.daily_quest, updateDailyQuest]);

  // ── 小鎮全景地圖專屬晨曦冒險進行曲生命週期管理 ──
  useEffect(() => {
    if (!isHomeOpen && !activeDialogueLocation && isTownBgmActive) {
      soundEngine.init();
      if (soundEngine.ctx && soundEngine.ctx.state === 'suspended') {
        soundEngine.ctx.resume().catch(() => {});
      }
      soundEngine.startSceneBgm('town');
    }

    return () => {
      if (!isHomeOpen && !activeDialogueLocation) {
        soundEngine.stopSceneBgm();
      }
    };
  }, [isHomeOpen, activeDialogueLocation, isTownBgmActive]);

  // 組件卸載時立即強制中斷所有 TTS 語音與音樂
  useEffect(() => {
    return () => {
      stopSpeech();
      soundEngine.stopSceneBgm();
    };
  }, []);

  const handleToggleTownBgm = (e) => {
    if (e) e.stopPropagation();
    soundEngine.click();
    if (isTownBgmActive) {
      soundEngine.stopSceneBgm();
      setIsTownBgmActive(false);
    } else {
      soundEngine.startSceneBgm('town');
      setIsTownBgmActive(true);
    }
  };

  const handleOpenLocation = (loc) => {
    stopSpeech();
    soundEngine.click();
    soundEngine.stopSceneBgm();
    if (loc.id === 'home') {
      soundEngine.init();
      if (soundEngine.ctx && soundEngine.ctx.state === 'suspended') {
        soundEngine.ctx.resume().catch(() => {});
      }
      soundEngine.startHomeBgm();
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
        <div className="absolute top-3 left-3 right-3 z-30 px-3.5 sm:px-5 py-2.5 rounded-2xl bg-slate-950/45 backdrop-blur-md border border-white/20 text-white flex items-center justify-between gap-3 shadow-lg pointer-events-auto">
          
          {/* 左側：返回學習宇宙與標題 */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Button3D variant="slate" size="sm" onClick={handleBackToGalaxy} icon={ArrowLeft}>
              {lang === 'zh-TW' ? '回學習宇宙' : 'Back'}
            </Button3D>

            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black font-heading text-white drop-shadow">
                🏔️ 霧臺小鎮
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30 hidden sm:inline">
                Wutai Town RPG
              </span>
            </div>
          </div>

          {/* 🌟 中央核心：滑鼠移到建築上方時，即時於頂部橫幅中央優雅顯示地點資訊 (取代突兀的浮動字) ── */}
          <div className="flex-1 text-center px-2 min-w-0">
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
                  <div className="text-[10px] font-bold text-slate-300 hidden md:block">
                    {hoveredLocation.npcName} • {hoveredLocation.description}
                  </div>
                </div>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/10 text-slate-200 text-xs font-bold shadow-sm">
                <Compass className="w-3.5 h-3.5 text-emerald-300 animate-spin-slow" />
                <span>移動滑鼠探索小鎮 9 大建築地標・點擊進入 2D 冒險</span>
              </div>
            )}
          </div>

          {/* 右側：音樂切換 + 金幣 + 積分 + 背包 + 任務快捷 */}
          <div className="flex items-center gap-2 shrink-0">
            {/* 🎵 霧臺小鎮晨曦冒險音樂開關 */}
            <button
              onClick={handleToggleTownBgm}
              className={`px-2.5 py-1 rounded-xl text-xs font-black backdrop-blur-md border transition-all flex items-center gap-1 shadow-sm cursor-pointer active:scale-95 ${
                isTownBgmActive
                  ? 'bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-200 border-emerald-400/50'
                  : 'bg-white/15 hover:bg-white/25 text-slate-300 border-white/20'
              }`}
              title={isTownBgmActive ? '點擊暫停小鎮背景音樂' : '點擊播放小鎮背景音樂'}
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
            <div className="px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-300/40 backdrop-blur-md flex items-center gap-1 text-amber-200 text-xs font-black shadow-sm">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-sm">{coins}</span>
            </div>

            {/* 探索積分 */}
            <div className="px-2.5 py-1 rounded-xl bg-indigo-500/20 border border-indigo-300/40 backdrop-blur-md flex items-center gap-1 text-indigo-200 text-xs font-black shadow-sm hidden sm:flex">
              <Trophy className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-mono text-sm">{questPoints}</span>
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
              className="px-2.5 py-1 rounded-xl bg-lime-600 hover:bg-lime-700 text-white text-xs font-black flex items-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer"
              title="回到溫馨的家 • 聆聽音樂並整理背包"
            >
              <Package className="w-3.5 h-3.5" />
              <span className="hidden md:inline">我的房間</span>
              <span>({inventory?.length || 0})</span>
            </button>

            {/* 每日任務 */}
            <button
              onClick={() => {
                soundEngine.click();
                setIsQuestBoardOpen(true);
              }}
              className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer"
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

        {/* ── 底部超薄透明快捷切換列 (Minimalist Floating Bottom Dock) ── */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-2xl bg-slate-950/45 backdrop-blur-md border border-white/20 text-white shadow-lg flex items-center gap-1.5 max-w-[94vw] overflow-x-auto pointer-events-auto">
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
      </div>

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
