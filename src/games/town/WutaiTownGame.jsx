import React, { useState, useMemo, useCallback } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { useI18n } from '../../context/I18nContext';
import { useStudent } from '../../context/StudentContext';
import {
  TOWN_LOCATIONS,
  TOWN_ITEMS,
  getTodayDateStr,
  getDailyVisitingTeacherInfo,
  getLocationDailyTheme
} from './townData';
import { DialogueEngine } from './DialogueEngine';
import { ShopModal } from './ShopModal';
import { BackpackModal } from './BackpackModal';
import { QuestBoardModal } from './QuestBoardModal';
import { soundEngine } from '../../services/audio';
import { formatStudentBadge } from '../../utils/studentIdHelper';
import {
  ArrowLeft, Coins, Trophy, Package, ScrollText, Sparkles,
  MapPin, ShoppingBag, MessageSquare, Home, Compass, User,
  CheckCircle2, ChevronRight, Shield, Gift, Megaphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WutaiTownGame = ({ onBack }) => {
  const { t, lang } = useI18n();
  const {
    currentStudent,
    coins,
    questPoints,
    inventory,
    isLoggedIn,
    openModal,
    updateDailyQuest,
    claimTeacherBonus
  } = useStudent();

  // 計算今日客座外師巡迴狀態
  const todayStr = useMemo(() => getTodayDateStr(), []);
  const teacherInfo = useMemo(() => getDailyVisitingTeacherInfo(todayStr), [todayStr]);
  const hasMetTeacherToday = currentStudent?.daily_quest?.teacherMetDate === todayStr;

  // 畫面模態狀態
  const [activeDialogueLocation, setActiveDialogueLocation] = useState(null);
  const [activeShopLocationId, setActiveShopLocationId] = useState(null);
  const [isBackpackOpen, setIsBackpackOpen] = useState(false);
  const [isQuestBoardOpen, setIsQuestBoardOpen] = useState(false);
  const [teacherBonusToast, setTeacherBonusToast] = useState(null);

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

    if (loc.id === 'home') {
      setIsBackpackOpen(true);
      return;
    }

    if (loc.id === 'school') {
      setIsQuestBoardOpen(true);
      return;
    }

    setActiveDialogueLocation(loc);
  };

  const activeQuest = currentStudent?.daily_quest;
  const isTeacherAtActiveLocation = Boolean(
    activeDialogueLocation &&
    activeDialogueLocation.id === teacherInfo.locationId &&
    !hasMetTeacherToday
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-6 animate-fadeIn pb-16 space-y-6">
      {/* ── 頂部小鎮 HUD 導航與狀態列 ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/80 dark:bg-slate-800/80 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md">
        <div className="flex items-center gap-3">
          <Button3D variant="slate" size="sm" onClick={onBack} icon={ArrowLeft}>
            {lang === 'zh-TW' ? '回學習宇宙' : 'Back Home'}
          </Button3D>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white font-heading flex items-center gap-1.5">
                <span>🏔️ 霧臺小鎮</span>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                  Wutai Town RPG
                </span>
              </h2>
            </div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:block">
              社區英語探索・9大生活地標・每日輪替對話・外師巡迴彩蛋
            </p>
          </div>
        </div>

        {/* 學生身分晶片、金幣與背包按鈕 */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
          {/* 金幣計數器 */}
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-300 dark:border-amber-700 flex items-center gap-1.5 text-amber-700 dark:text-amber-300 text-xs font-black">
            <Coins className="w-4 h-4 text-amber-500" />
            <span className="font-mono text-sm">{coins}</span>
          </div>

          {/* 探索積分計數器 */}
          <div className="px-3 py-1.5 rounded-xl bg-indigo-500/15 border border-indigo-300 dark:border-indigo-700 flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 text-xs font-black">
            <Trophy className="w-4 h-4 text-indigo-500" />
            <span className="font-mono text-sm">{questPoints}</span>
          </div>

          {/* 快捷背包按鈕 */}
          <button
            onClick={() => {
              soundEngine.click();
              setIsBackpackOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-lime-500 hover:bg-lime-600 text-white text-xs font-black flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            title="開啟個人背包"
          >
            <Package className="w-4 h-4" />
            <span>背包 ({inventory?.length || 0})</span>
          </button>

          {/* 任務公佈欄按鈕 */}
          <button
            onClick={() => {
              soundEngine.click();
              setIsQuestBoardOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            title="查看每日任務"
          >
            <ScrollText className="w-4 h-4" />
            <span>每日任務</span>
          </button>
        </div>
      </div>

      {/* ── 🌟 外師彩蛋獎勵提示 Toast (若剛領取) ── */}
      {teacherBonusToast && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-between gap-3 shadow-lg animate-bounce">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-white/20 text-2xl">
              🎉
            </span>
            <div>
              <h4 className="font-black text-sm sm:text-base font-heading">
                獲得 {teacherBonusToast.teacherName} 的每日驚喜獎勵！
              </h4>
              <p className="text-xs font-bold text-white/90">
                探索積分 +{teacherBonusToast.points} 點！榮譽榜同步提升！
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl bg-white text-amber-700 text-xs font-black shadow-sm">
            +{teacherBonusToast.points} 積分
          </span>
        </div>
      )}

      {/* ── 進行中每日任務提示小卡 (若有) ── */}
      {activeQuest && activeQuest.questId && !activeQuest.rewardClaimed && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-indigo-500/15 via-blue-500/15 to-purple-500/15 border-2 border-indigo-300 dark:border-indigo-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
              <ScrollText className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                {activeQuest.completed ? '🎯 任務已達成！' : '🧭 進行中任務：'}
              </span>
              <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">
                {activeQuest.completed ? '任務目標已完成！請前往霧臺國小領取探索積分獎勵！' : '請前往小鎮各商家完成英語互動！'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsQuestBoardOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-colors shrink-0 cursor-pointer"
          >
            {activeQuest.completed ? '領取獎勵 🏆' : '查看任務詳情 📜'}
          </button>
        </div>
      )}

      {/* ── 9 大社區地標視覺化全景導覽地圖 (Town Map Bento Grid) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {TOWN_LOCATIONS.map((loc) => {
          const isTeacherVisitingHere = (loc.id === teacherInfo.locationId && !hasMetTeacherToday);
          const hasTeacherMetHere = (loc.id === teacherInfo.locationId && hasMetTeacherToday);
          const dailyTheme = getLocationDailyTheme(loc.id, todayStr);

          return (
            <GlassCard
              key={loc.id}
              hoverable={true}
              onClick={() => handleOpenLocation(loc)}
              className={`group cursor-pointer p-5 flex flex-col justify-between border-2 transition-all shadow-md relative overflow-hidden ${
                isTeacherVisitingHere
                  ? 'border-amber-400 dark:border-amber-500 ring-2 ring-amber-400/40 shadow-amber-500/20'
                  : 'hover:border-emerald-400 dark:hover:border-emerald-500'
              }`}
            >
              {/* 背景微光裝飾 */}
              <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br ${
                isTeacherVisitingHere ? teacherInfo.teacher.bgGradient : loc.bgGradient
              } blur-2xl group-hover:scale-125 transition-transform pointer-events-none`} />

              <div>
                <div className="flex items-start justify-between gap-3 mb-3 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform shrink-0 border ${
                    isTeacherVisitingHere
                      ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-600'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}>
                    {isTeacherVisitingHere ? teacherInfo.teacher.avatar : loc.npcAvatar}
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    {/* 今日外師現身徽章 */}
                    {isTeacherVisitingHere && (
                      <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black shadow-sm animate-pulse flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{teacherInfo.teacher.nameZh} 現身！</span>
                      </span>
                    )}

                    {hasTeacherMetHere && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold">
                        今日外師交談完畢 ✓
                      </span>
                    )}

                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {loc.nameEn.split(' ')[0]}
                    </span>
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white font-heading group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {loc.nameZh}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400 block mb-2">
                    {loc.nameEn}
                  </span>

                  {/* 今日輪替主題提示 */}
                  {dailyTheme && (
                    <div className="mb-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-300/60 dark:border-emerald-700/60 text-[11px] font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-1 truncate">
                      <Megaphone className="w-3 h-3 shrink-0" />
                      <span className="truncate">{dailyTheme}</span>
                    </div>
                  )}

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    <div className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 mb-0.5">
                      {isTeacherVisitingHere
                        ? `今日店員: ${teacherInfo.teacher.nameZh}`
                        : `NPC: ${loc.npcName}`}
                    </div>
                    {loc.description}
                  </div>
                </div>
              </div>

              {/* 底部功能標籤與進入按鈕 */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/80 relative z-10">
                <div className="flex items-center gap-1 text-[11px] font-black text-slate-500">
                  {loc.hasShop && <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">商店</span>}
                  {loc.hasQuests && <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">任務</span>}
                  {loc.hasBackpack && <span className="px-1.5 py-0.5 rounded bg-lime-100 dark:bg-lime-950 text-lime-700 dark:text-lime-300">背包</span>}
                </div>

                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                  <span>{isTeacherVisitingHere ? '拜訪外師' : '進入地標'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* ── 模態彈窗 1：NPC 零延遲對話樹 (支援外師巡迴與每日輪替) ── */}
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

      {/* ── 模態彈窗 2：金幣商店 ── */}
      {activeShopLocationId && (
        <ShopModal
          locationId={activeShopLocationId}
          onClose={() => setActiveShopLocationId(null)}
          onQuestProgress={handleQuestProgress}
        />
      )}

      {/* ── 模態彈窗 3：學生個人背包倉庫 ── */}
      {isBackpackOpen && (
        <BackpackModal
          onClose={() => setIsBackpackOpen(false)}
        />
      )}

      {/* ── 模態彈窗 4：每日任務公佈欄 ── */}
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
