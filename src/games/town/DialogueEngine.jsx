import React, { useState, useEffect, useMemo } from 'react';
import { getDialogueTreeForLocation } from './townData';
import { speakEnglish, soundEngine } from '../../services/audio';
import {
  Volume2, X, MessageSquare, Sparkles, ShoppingBag,
  ScrollText, Gift, ChevronRight, Compass
} from 'lucide-react';

export const DialogueEngine = ({
  location,
  onClose,
  onOpenShop,
  onOpenQuests,
  onQuestProgress,
  isVisitingTeacher = false,
  visitingTeacher = null,
  onTeacherBonusClaimed
}) => {
  // 智慧決定當前對話樹 (若為今日值勤外師則載入外師專屬對話樹，否則載入當日輪替對話樹)
  const tree = useMemo(() => {
    return getDialogueTreeForLocation(location?.id, {
      isTeacherActive: isVisitingTeacher,
      teacher: visitingTeacher
    });
  }, [location?.id, isVisitingTeacher, visitingTeacher]);

  const [currentNodeId, setCurrentNodeId] = useState(tree?.startNode || 'welcome');
  const currentNode = tree?.nodes?.[currentNodeId];
  const [portraitError, setPortraitError] = useState(false);
  const [bgError, setBgError] = useState(false);

  // 當進入新節點時播放清脆提示音，並自動朗讀英語發音
  useEffect(() => {
    if (currentNode?.en) {
      soundEngine.click();
      speakEnglish(currentNode.en);
      // 觸發任務對話目標比對
      if (onQuestProgress) {
        onQuestProgress('dialogue', location.id, currentNodeId);
      }
    }
  }, [currentNodeId, currentNode, location?.id]);

  if (!location || !tree || !currentNode) {
    return null;
  }

  const handleSelectOption = (opt) => {
    soundEngine.click();

    // 處理外師彩蛋領獎動作
    if (opt.action === 'CLAIM_TEACHER_BONUS') {
      if (onTeacherBonusClaimed) {
        onTeacherBonusClaimed();
      }
      onClose();
      return;
    }

    // 處理特殊動作 (Action)
    if (opt.action === 'OPEN_SHOP') {
      onClose();
      if (onOpenShop) onOpenShop(location.id);
      return;
    }
    if (opt.action === 'OPEN_QUESTS') {
      onClose();
      if (onOpenQuests) onOpenQuests();
      return;
    }

    if (opt.target_id === 'END') {
      onClose();
      return;
    }

    if (opt.target_id && tree.nodes[opt.target_id]) {
      setCurrentNodeId(opt.target_id);
    } else {
      onClose();
    }
  };

  const handleReplaySpeech = () => {
    if (currentNode?.en) {
      speakEnglish(currentNode.en);
    }
  };

  // 決定頭像、立繪與身分資訊
  const displayAvatar = isVisitingTeacher ? visitingTeacher.avatar : location.npcAvatar;
  const displayPortrait = isVisitingTeacher ? visitingTeacher.portrait : location.npcPortrait;
  const displayRole = isVisitingTeacher ? visitingTeacher.roleZh : location.npcRole;
  const displayBg = location.bgImage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl bg-slate-950 rounded-3xl shadow-2xl border-2 border-emerald-400/80 dark:border-emerald-500/80 overflow-hidden relative my-auto flex flex-col max-h-[94vh] animate-scaleUp">
        
        {/* ── 2D 沉浸式場景背景 (Ghibli 2D Scene Background Layer) ── */}
        <div className="absolute inset-0 bg-slate-900 pointer-events-none overflow-hidden">
          {displayBg && !bgError ? (
            <img
              src={displayBg}
              alt={location.nameZh}
              onError={() => setBgError(true)}
              className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.05] transition-all duration-700 select-none scale-100 hover:scale-105"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${location.bgGradient}`} />
          )}
          {/* 場景氛圍光影與遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/60" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/70 pointer-events-none" />
        </div>

        {/* ── 頂部 HUD 狀態導航列 (Top Bar) ── */}
        <div className="relative z-20 px-4 py-3 bg-slate-950/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-lg shrink-0">
              {displayAvatar}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-black text-white font-heading truncate">
                  {location.nameZh}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded-full">
                  {location.nameEn}
                </span>
                {isVisitingTeacher && (
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black flex items-center gap-1 shadow-sm animate-pulse">
                    <Sparkles className="w-3 h-3" />
                    <span>{visitingTeacher.tag}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* 店家快捷按鈕 */}
            {!isVisitingTeacher && location.hasShop && (
              <button
                onClick={() => {
                  onClose();
                  if (onOpenShop) onOpenShop(location.id);
                }}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md transition-all cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>商店</span>
              </button>
            )}

            {!isVisitingTeacher && location.hasQuests && (
              <button
                onClick={() => {
                  onClose();
                  if (onOpenQuests) onOpenQuests();
                }}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all cursor-pointer"
              >
                <ScrollText className="w-3.5 h-3.5" />
                <span>公佈欄</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
              title="關閉對話"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── 客座外師專屬彩蛋提示條 (若為外師模式) ── */}
        {isVisitingTeacher && (
          <div className="relative z-20 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-4 py-1.5 flex items-center justify-between text-xs font-black shadow-inner shrink-0">
            <span className="flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 animate-bounce" />
              <span>今日客座外師巡迴彩蛋：完成互動可獲 5~10 探索積分！</span>
            </span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
              每日限定一次
            </span>
          </div>
        )}

        {/* ── 2D 視覺小說立繪舞台層 (Visual Novel Actor Stage) ── */}
        <div className="relative z-10 flex-1 flex items-end justify-center sm:justify-start px-4 sm:px-10 pt-2 min-h-[180px] sm:min-h-[260px] pointer-events-none overflow-hidden">
          {displayPortrait && !portraitError ? (
            <div className="relative pointer-events-auto flex flex-col items-center sm:items-start group animate-slideInLeft">
              <img
                src={displayPortrait}
                alt={currentNode.speaker}
                onError={() => setPortraitError(true)}
                className="h-44 sm:h-64 md:h-72 object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.9)] filter contrast-[1.05] select-none transition-transform duration-300 group-hover:scale-105"
              />
              {/* 立繪名字光環 */}
              <div className="absolute -bottom-2 sm:bottom-0 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-emerald-400/50 shadow-xl flex items-center gap-1.5 text-xs font-black text-emerald-300 shrink-0 whitespace-nowrap">
                <span>{displayAvatar}</span>
                <span>{currentNode.speaker}</span>
              </div>
            </div>
          ) : (
            <div className="pointer-events-auto flex items-center gap-3 p-3 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/20 mb-3 shadow-xl">
              <span className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-4xl shadow-inner border border-white/20">
                {displayAvatar}
              </span>
              <div>
                <h4 className="text-base font-black text-white font-heading">
                  {currentNode.speaker}
                </h4>
                <p className="text-xs font-bold text-slate-300">
                  {displayRole}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── 對話框與玩家英語分支選擇區 (VN Speech Bubble & Choices) ── */}
        <div className="relative z-20 p-4 sm:p-5 bg-slate-950/92 backdrop-blur-xl border-t-2 border-emerald-500/50 space-y-3.5 overflow-y-auto max-h-[52vh] shrink-0">
          
          {/* NPC 臺詞對話泡泡 */}
          <div className="p-4 sm:p-4.5 rounded-2xl bg-white/5 border border-white/15 relative space-y-2 shadow-inner">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500 text-white font-black text-xs tracking-wide shadow-sm flex items-center gap-1">
                  <span>{displayAvatar}</span>
                  <span>{currentNode.speaker}</span>
                </span>
                <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
                  {displayRole}
                </span>
              </div>

              {/* 語音重複朗讀按鈕 */}
              <button
                onClick={handleReplaySpeech}
                className="px-2.5 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-300 border border-emerald-400/40 text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1 active:scale-95"
                title="點擊聆聽英語真人朗讀"
              >
                <Volume2 className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                <span>朗讀發音</span>
              </button>
            </div>

            {/* 英文主臺詞 */}
            <p className="text-base sm:text-lg md:text-xl font-black text-white leading-relaxed font-heading tracking-wide pr-2">
              "{currentNode.en}"
            </p>

            {/* 中文翻譯對白 */}
            <p className="text-xs sm:text-sm font-bold text-amber-300/90 pt-1.5 border-t border-white/10">
              「{currentNode.zh}」
            </p>
          </div>

          {/* 學生回答選項分支 (Branch Options) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>💬 選擇你的英語回應：</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                點擊以英語互動
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {currentNode.options?.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  className="w-full text-left p-3 sm:p-3.5 rounded-2xl bg-white/5 hover:bg-emerald-500/20 border-2 border-white/10 hover:border-emerald-400/80 transition-all shadow-md active:scale-98 group cursor-pointer"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/20 group-hover:bg-emerald-500 text-emerald-300 group-hover:text-white flex items-center justify-center text-xs font-black shrink-0 transition-colors mt-0.5 border border-emerald-400/40">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-black text-white group-hover:text-emerald-200 transition-colors leading-snug">
                        {opt.text_en}
                      </div>
                      <div className="text-[11px] font-bold text-slate-400 group-hover:text-emerald-300/90 mt-0.5 transition-colors">
                        {opt.text_zh}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
