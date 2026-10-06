import React, { useState } from 'react';
import { Button3D } from '../../components/ui/Button3D';
import { useStudent } from '../../context/StudentContext';
import { DAILY_QUEST_TEMPLATES, MAX_DAILY_QUESTS, getTodayDateStr } from './townData';
import { soundEngine } from '../../services/audio';
import {
  ScrollText, X, Trophy, Coins, CheckCircle2, AlertCircle,
  Sparkles, Target, Award, Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuestBoardModal = ({ onClose, onNavigateLocation }) => {
  const {
    currentStudent,
    coins,
    spendCoins,
    questPoints,
    addQuestPoints,
    updateDailyQuest,
    isLoggedIn
  } = useStudent();

  const [toastMessage, setToastMessage] = useState(null);
  const today = getTodayDateStr();
  const rawQuestData = (typeof currentStudent?.daily_quest === 'object' && currentStudent.daily_quest) ? currentStudent.daily_quest : {};

  // 跨日檢查：若為過去日期的舊存檔，今日狀態自動視為全新開始
  const isTodayData = rawQuestData.date === today;

  // 今日已領取獎勵之任務 ID 清單 (最多 3 個)
  const claimedList = (isTodayData && Array.isArray(rawQuestData.claimedQuestIds))
    ? rawQuestData.claimedQuestIds
    : [];

  const completedTodayCount = claimedList.length;
  const isDailyLimitReached = completedTodayCount >= MAX_DAILY_QUESTS;

  // 當前正在進行中任務 (若今日已領獎則代表無進行中任務)
  const currentActiveId = (isTodayData && !rawQuestData.rewardClaimed)
    ? (rawQuestData.questId || rawQuestData.activeQuestId)
    : null;

  const activeTemplate = currentActiveId
    ? DAILY_QUEST_TEMPLATES.find(q => q.id === currentActiveId)
    : null;

  const isCurrentCompleted = Boolean(isTodayData && activeTemplate && rawQuestData.completed);

  // 接取任務
  const handleAcceptQuest = async (quest) => {
    soundEngine.click();

    if (!isLoggedIn) {
      setToastMessage({ type: 'error', text: '請先登入學生座號，才能接取每日任務並累積探索積分喔！' });
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    if (isDailyLimitReached) {
      soundEngine.wrong();
      setToastMessage({ type: 'error', text: `今日 ${MAX_DAILY_QUESTS} 個任務額度已全數達成！請明天 00:00 換日後再來挑戰喔！` });
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    if (claimedList.includes(quest.id)) {
      soundEngine.wrong();
      setToastMessage({ type: 'error', text: '這項任務今天已經領取過獎勵囉！請挑選其他未完成的任務。' });
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    if (activeTemplate) {
      soundEngine.wrong();
      setToastMessage({ type: 'error', text: '你目前已有正在進行中的任務，請先完成它或點擊「放棄任務」再接新任務！' });
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    // 若需要投注金幣
    if (quest.cost > 0) {
      if (coins < quest.cost) {
        soundEngine.wrong();
        setToastMessage({ type: 'error', text: `宇宙金幣不足！接取此任務需要投注 ${quest.cost} 金幣，快去闖關單字遊戲累積金幣吧！` });
        setTimeout(() => setToastMessage(null), 3500);
        return;
      }
      const success = await spendCoins(quest.cost);
      if (!success) return;
    }

    soundEngine.correct();
    const newQuestData = {
      ...rawQuestData,
      date: today,
      questId: quest.id,
      activeQuestId: quest.id,
      tier: quest.tier,
      acceptedAt: new Date().toISOString(),
      completed: false,
      rewardClaimed: false,
      claimedQuestIds: claimedList,
      completedCount: claimedList.length,
      progress: {
        dialogueDone: false,
        actionDone: false
      }
    };

    await updateDailyQuest(newQuestData);
    setToastMessage({ type: 'success', text: `成功接取「${quest.titleZh}」！快前往小鎮展開冒險吧！` });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 領取任務完成獎勵
  const handleClaimReward = async () => {
    if (!activeTemplate || !rawQuestData.completed) return;
    soundEngine.win();
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}

    await addQuestPoints(activeTemplate.rewardPoints);
    const newClaimed = [...claimedList, activeTemplate.id];

    const updated = {
      ...rawQuestData,
      date: today,
      questId: null,
      activeQuestId: null,
      completed: false,
      rewardClaimed: true,
      claimedQuestIds: newClaimed,
      completedCount: newClaimed.length
    };
    await updateDailyQuest(updated);

    setToastMessage({
      type: 'success',
      text: `🎉 恭喜完成任務！獲得 +${activeTemplate.rewardPoints} 探索積分！今日探索進度 (${newClaimed.length}/${MAX_DAILY_QUESTS})`
    });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 放棄當前任務 (重新選擇)
  const handleAbandonQuest = async () => {
    soundEngine.click();
    await updateDailyQuest({
      ...rawQuestData,
      date: today,
      questId: null,
      activeQuestId: null,
      completed: false,
      rewardClaimed: false,
      claimedQuestIds: claimedList,
      completedCount: claimedList.length
    });
    setToastMessage({ type: 'info', text: '已放棄當前任務，你可以重新挑選新的每日任務！' });
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-indigo-500 dark:border-indigo-600 overflow-hidden relative max-h-[85vh] flex flex-col animate-scaleUp">
        {/* 頂部布告欄橫幅 */}
        <div className="relative p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <img src="/assets/town/bg_school.webp" alt="" className="w-full h-full object-cover filter brightness-[0.35] contrast-125" />
            <div className="absolute inset-0 bg-indigo-950/70 backdrop-blur-[2px]" />
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/90 dark:bg-slate-800/90 shadow-md flex items-center justify-center overflow-hidden shrink-0 border border-white/20">
              <img src="/assets/town/npc_principal.webp" alt="校長" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-heading font-black text-white">
                  霧臺國小 • 每日探索任務布告欄
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 shadow-sm">
                  Daily Quests
                </span>
              </div>
              <p className="text-xs font-bold text-amber-200">
                探索小鎮完成生活英語任務！每日限挑選 3 個任務爭奪全校榮譽榜！
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 sm:gap-3">
            {/* 今日進度標籤 */}
            <div className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-black flex items-center gap-1 shadow-sm backdrop-blur-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>今日: {completedTodayCount}/{MAX_DAILY_QUESTS}</span>
            </div>

            <div className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md flex items-center gap-1.5 text-xs font-black text-white shadow-sm border border-white/20">
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>{questPoints}</span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20 ml-1"
              title="關閉布告欄"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 訊息回饋 Toast */}
        {toastMessage && (
          <div className={`mx-4 mt-3 p-3 rounded-2xl text-white font-black text-xs flex items-center gap-2 shadow-md animate-fadeIn ${
            toastMessage.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'
          }`}>
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* 任務內容清單 */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* 今日 3 任務全數達成祝賀橫幅 */}
          {isDailyLimitReached && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400/60 text-emerald-100 flex items-center gap-3 shadow-md animate-scaleUp">
              <Award className="w-8 h-8 text-amber-300 shrink-0 animate-bounce" />
              <div>
                <h4 className="font-heading font-black text-sm sm:text-base text-emerald-200">
                  🎉 太優秀了！今日 3 個探索任務已全數圓滿達成！
                </h4>
                <p className="text-xs text-emerald-300/90 font-bold mt-0.5">
                  你今天表現非常認真，探索積分已全數入帳！請好好休息，明天 00:00 換日後再來挑戰全新任務！
                </p>
              </div>
            </div>
          )}

          {/* 若有進行中任務：置頂展示進度 */}
          {activeTemplate && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-slate-800 border-2 border-indigo-400 dark:border-indigo-600 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-indigo-600 text-white flex items-center gap-1 shadow-sm">
                  <Target className="w-3.5 h-3.5" />
                  進行中任務 (第 {completedTodayCount + 1}/{MAX_DAILY_QUESTS} 個)
                </span>

                <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  達成獎勵: +{activeTemplate.rewardPoints} 探索積分
                </span>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-heading font-black text-slate-800 dark:text-white">
                  {activeTemplate.titleZh}
                </h4>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  {activeTemplate.titleEn}
                </p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                  {activeTemplate.descriptionZh}
                </p>
              </div>

              {/* 進度條與狀態 */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isCurrentCompleted ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  <span className="text-xs font-black text-slate-700 dark:text-slate-200">
                    {isCurrentCompleted ? '🎯 任務目標已達成！' : '🧭 冒險進行中...'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isCurrentCompleted ? (
                    <Button3D
                      variant="emerald"
                      size="sm"
                      onClick={handleClaimReward}
                      icon={Award}
                      className="shadow-md"
                    >
                      領取 +{activeTemplate.rewardPoints} 探索積分！
                    </Button3D>
                  ) : (
                    <>
                      {onNavigateLocation && (
                        <button
                          onClick={() => {
                            onClose();
                            onNavigateLocation(activeTemplate.targetLocation);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-colors cursor-pointer"
                        >
                          前往目標地標 🚀
                        </button>
                      )}
                      <button
                        onClick={handleAbandonQuest}
                        className="text-xs font-bold text-slate-400 hover:text-rose-500 ml-2"
                      >
                        放棄任務
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 任務階層選擇目錄 (6 款任務：2 低、2 中、2 高) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                今日可挑選任務列表 (固定 6 款，每日限完成 3 個)：
              </span>
              <span className="text-xs font-black text-indigo-500 dark:text-indigo-400">
                已完成 {completedTodayCount} / {MAX_DAILY_QUESTS}
              </span>
            </div>

            {DAILY_QUEST_TEMPLATES.map((q) => {
              const isClaimed = claimedList.includes(q.id);
              const isSelected = activeTemplate && activeTemplate.id === q.id;

              return (
                <div
                  key={q.id}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all shadow-sm ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : isClaimed
                      ? 'border-emerald-500/40 bg-emerald-500/5 opacity-80'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-indigo-400'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          q.tier === 'easy'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : q.tier === 'medium'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {q.tier === 'easy'
                            ? '🟢 簡單探索 (免費)'
                            : q.tier === 'medium'
                            ? `🔵 中階挑戰 (投注 ${q.cost} 金幣)`
                            : `🟡 榮譽解謎 (投注 ${q.cost} 金幣)`}
                        </span>

                        <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono">
                          +{q.rewardPoints} 探索積分
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-black text-slate-800 dark:text-white font-heading">
                        {q.titleZh}
                      </h4>
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                        {q.descriptionZh}
                      </p>
                    </div>

                    <div className="shrink-0 w-full sm:w-auto text-right">
                      {isClaimed ? (
                        <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl">
                          <CheckCircle2 className="w-4 h-4" /> 今日已完成
                        </span>
                      ) : isSelected ? (
                        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950/60 px-3 py-1.5 rounded-xl">
                          正在進行中
                        </span>
                      ) : isDailyLimitReached ? (
                        <span className="text-xs font-bold text-slate-400 bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded-xl">
                          今日額度已滿
                        </span>
                      ) : (
                        <Button3D
                          variant={q.cost > 0 ? 'amber' : 'emerald'}
                          size="sm"
                          onClick={() => handleAcceptQuest(q)}
                          disabled={Boolean(activeTemplate)}
                          className="w-full sm:w-auto"
                        >
                          {q.cost > 0 ? `投注 ${q.cost} 金幣接取` : '免費接取任務'}
                        </Button3D>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 底部關閉按鈕 */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 text-center shrink-0">
          <Button3D variant="slate" size="sm" onClick={onClose} className="w-full sm:w-auto">
            返回小鎮
          </Button3D>
        </div>
      </div>
    </div>
  );
};
