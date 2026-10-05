import React, { useState, useMemo, useCallback } from 'react';
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
import { ShopModal } from './ShopModal';
import { BackpackModal } from './BackpackModal';
import { QuestBoardModal } from './QuestBoardModal';
import { soundEngine } from '../../services/audio';
import {
  ArrowLeft, Coins, Trophy, Package, ScrollText, Sparkles,
  MapPin, ShoppingBag, Compass, ChevronRight, Gift, Megaphone
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
  const [isBackpackOpen, setIsBackpackOpen] = useState(false);
  const [isQuestBoardOpen, setIsQuestBoardOpen] = useState(false);
  const [teacherBonusToast, setTeacherBonusToast] = useState(null);
  const [hoveredLocationId, setHoveredLocationId] = useState(null);

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
    // 中階任務 1：公園自然四季生態對話（需在飛鼠公園對話樹中探討晴天/涼爽/四季/動物節點）
    else if (dailyQuest.questId === 'medium_nature_explorer') {
      if (actionType === 'dialogue' && param1 === 'park' && ['sunny', 'cool', 'animals', 'seasons'].includes(param2)) {
        shouldComplete = true;
      }
    }
    // 中階任務 2：診所就醫健康對話（需在貓頭鷹診所諮詢喉嚨痛/健康保養節點）或購買保健物資
    else if (dailyQuest.questId === 'medium_healthy_hero') {
      if ((actionType === 'dialogue' && param1 === 'clinic' && ['throat', 'healthy'].includes(param2)) ||
          (actionType === 'buy' && (param1 === 'special' || param2 === 'throat_lozenge' || param2 === 'cooling_patch' || param2 === 'water_bottle_item'))) {
        shouldComplete = true;
      }
    }
    // 高階任務：集會所深入了解百合文化涵義（需在百步蛇集會所對話樹解鎖 lily_meaning 或 badge_offer 節點）或購買百合勇士勳章
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

  const handleOpenLocation = (loc) => {
    soundEngine.click();
    setActiveDialogueLocation(loc);
  };

  const isTeacherAtActiveLocation = Boolean(
    activeDialogueLocation &&
    activeDialogueLocation.id === teacherInfo.locationId &&
    !hasMetTeacherToday
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4 animate-fadeIn">
      
      {/* ── 霧臺小鎮全螢幕 2D 大地圖主要容器 (Full-Screen Town Map Stage) ── */}
      <div className="relative w-full h-[calc(100vh-48px)] min-h-[640px] max-h-[92vh] rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-500/70 bg-slate-950 flex flex-col justify-between">
        
        {/* ── 1. 全景地圖底圖 (16:9 Town Map Base Layer) ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={TOWN_MAP_PANORAMA_IMG}
            alt="霧臺小鎮全景大地圖"
            className="w-full h-full object-cover object-center filter brightness-95 contrast-105 select-none"
          />
          {/* 自然環境微光漸層 */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/45 pointer-events-none" />
        </div>

        {/* ── 2. 頂部 HUD 狀態列 (Top Navigation & Student Stats HUD) ── */}
        <div className="relative z-30 p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md border-b border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <Button3D variant="slate" size="sm" onClick={onBack} icon={ArrowLeft}>
              {lang === 'zh-TW' ? '回學習宇宙' : 'Back Home'}
            </Button3D>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white font-heading flex items-center gap-1.5 drop-shadow-md">
                  <span>🏔️ 霧臺小鎮</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                    Town Map RPG
                  </span>
                </h2>
              </div>
              <p className="text-[11px] font-bold text-slate-300 hidden sm:block drop-shadow">
                點擊地標進入 2D 室內場景・與部落夥伴與客座外師用英語對話！
              </p>
            </div>
          </div>

          {/* 外師今日出沒公告 + 金幣 + 背包 + 任務 */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
            {/* 今日外師巡迴提示 */}
            <div className="px-3 py-1 rounded-xl bg-amber-500/30 border border-amber-400/70 backdrop-blur-md flex items-center gap-1.5 text-amber-200 text-xs font-black shadow-sm animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                外師 {teacherInfo.teacher.nameZh} 現身於：
                {TOWN_LOCATIONS.find(l => l.id === teacherInfo.locationId)?.nameZh}
              </span>
            </div>

            {/* 金幣計數器 */}
            <div className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-300/40 backdrop-blur-md flex items-center gap-1.5 text-amber-200 text-xs font-black shadow-sm">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-sm">{coins}</span>
            </div>

            {/* 探索積分 */}
            <div className="px-3 py-1 rounded-xl bg-indigo-500/20 border border-indigo-300/40 backdrop-blur-md flex items-center gap-1.5 text-indigo-200 text-xs font-black shadow-sm">
              <Trophy className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-mono text-sm">{questPoints}</span>
            </div>

            {/* 背包 */}
            <button
              onClick={() => {
                soundEngine.click();
                setIsBackpackOpen(true);
              }}
              className="px-3 py-1 rounded-xl bg-lime-600 hover:bg-lime-700 text-white text-xs font-black flex items-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer"
              title="開啟個人背包"
            >
              <Package className="w-3.5 h-3.5" />
              <span>背包 ({inventory?.length || 0})</span>
            </button>

            {/* 每日任務 */}
            <button
              onClick={() => {
                soundEngine.click();
                setIsQuestBoardOpen(true);
              }}
              className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer"
              title="查看每日任務"
            >
              <ScrollText className="w-3.5 h-3.5" />
              <span>每日任務</span>
            </button>
          </div>
        </div>

        {/* ── 3. 大地圖 9 大互動地標熱點 (Interactive Map Hotspots) ── */}
        <div className="relative flex-1 w-full h-full">
          {TOWN_LOCATIONS.map((loc) => {
            const isTeacherVisitingHere = (loc.id === teacherInfo.locationId && !hasMetTeacherToday);
            const dailyTheme = getLocationDailyTheme(loc.id, todayStr);
            const coords = loc.mapCoords || { x: 50, y: 50 };
            const isHovered = hoveredLocationId === loc.id;

            return (
              <div
                key={loc.id}
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group z-20"
                onMouseEnter={() => setHoveredLocationId(loc.id)}
                onMouseLeave={() => setHoveredLocationId(null)}
              >
                {/* ── 地標按鈕主體 (Hotspot Pin Button) ── */}
                <button
                  onClick={() => handleOpenLocation(loc)}
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-2xl transition-all duration-300 transform group-hover:scale-125 group-hover:-translate-y-2 cursor-pointer border-2 ${
                    isTeacherVisitingHere
                      ? 'bg-amber-100/95 dark:bg-amber-950/95 border-amber-400 ring-4 ring-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.9)] animate-teacher-pulse'
                      : 'bg-white/95 dark:bg-slate-900/95 border-emerald-400 ring-2 ring-emerald-400/40 shadow-emerald-500/40 group-hover:ring-4 group-hover:ring-emerald-400 group-hover:shadow-[0_0_25px_rgba(52,211,153,0.9)]'
                  }`}
                  title={`進入 ${loc.nameZh}`}
                >
                  {/* 外師現身徽章 */}
                  {isTeacherVisitingHere && (
                    <span className="absolute -top-2.5 -right-2 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[9px] font-black shadow-md animate-bounce whitespace-nowrap">
                      ⭐ 外師現身
                    </span>
                  )}

                  {/* 呼吸擴散雷達光波 */}
                  <span className={`absolute inset-0 rounded-2xl pointer-events-none ${
                    isTeacherVisitingHere ? 'bg-amber-400/30 animate-ping' : 'bg-emerald-400/30 animate-hotspot-pulse'
                  }`} />

                  {/* 地標圖示 */}
                  <span className="relative z-10 select-none">
                    {isTeacherVisitingHere ? teacherInfo.teacher.avatar : loc.npcAvatar}
                  </span>
                </button>

                {/* ── 地標常駐迷你名稱 (Mini Tag Below Pin) ── */}
                <span className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md text-white font-black text-[11px] whitespace-nowrap shadow-md border border-white/20 group-hover:border-emerald-400 group-hover:text-emerald-300 transition-all pointer-events-none z-10">
                  {loc.nameZh}
                </span>

                {/* ── 滑鼠移過時跳出的地點資訊浮動卡 (Hover Tooltip Card) ── */}
                <div className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 transition-all duration-200 z-30 min-w-[210px] sm:min-w-[250px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border-2 border-emerald-400 flex flex-col gap-2 ${
                  isHovered
                    ? 'opacity-100 pointer-events-auto transform translate-y-0 scale-100'
                    : 'opacity-0 pointer-events-none transform translate-y-2 scale-95'
                }`}>
                  <div className="flex items-center justify-between gap-1 border-b border-slate-200 dark:border-slate-800 pb-1.5">
                    <div>
                      <h4 className="text-sm font-black text-slate-800 dark:text-white font-heading">
                        {loc.nameZh}
                      </h4>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {loc.nameEn}
                      </span>
                    </div>
                    <span className="text-xl">
                      {isTeacherVisitingHere ? teacherInfo.teacher.avatar : loc.npcAvatar}
                    </span>
                  </div>

                  {/* 今日輪替主題 */}
                  {dailyTheme && (
                    <div className="px-2 py-1 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-[10px] font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                      <Megaphone className="w-3 h-3 shrink-0" />
                      <span className="truncate">{dailyTheme}</span>
                    </div>
                  )}

                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {loc.description}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                    <span>
                      {isTeacherVisitingHere ? `店員: ${teacherInfo.teacher.nameZh}` : `NPC: ${loc.npcName}`}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <span>點擊啟程</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── 4. 底部小鎮地標快捷切換列 (Bottom Landmark Quick Jump Dock) ── */}
        <div className="relative z-30 p-2.5 sm:p-3 bg-slate-950/70 backdrop-blur-md border-t border-white/15 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-300 shrink-0 pl-1">
            <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
            <span className="hidden sm:inline">小鎮地標快捷：</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {TOWN_LOCATIONS.map((loc) => {
              const isTeacherHere = (loc.id === teacherInfo.locationId && !hasMetTeacherToday);

              return (
                <button
                  key={loc.id}
                  onClick={() => handleOpenLocation(loc)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
                    isTeacherHere
                      ? 'bg-amber-500 text-white animate-pulse ring-2 ring-amber-300'
                      : 'bg-white/15 hover:bg-emerald-500 hover:text-white text-slate-200 border border-white/15'
                  }`}
                >
                  <span>{isTeacherHere ? teacherInfo.teacher.avatar : loc.npcAvatar}</span>
                  <span>{loc.nameZh}</span>
                </button>
              );
            })}
          </div>
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

      {/* ── 全螢幕 2D 視覺小說冒險對話場景 (Visual Novel Scene Stage) ── */}
      {activeDialogueLocation && (
        <DialogueEngine
          location={activeDialogueLocation}
          onClose={() => setActiveDialogueLocation(null)}
          onOpenShop={(shopId) => setActiveShopLocationId(shopId)}
          onOpenQuests={() => setIsQuestBoardOpen(true)}
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
