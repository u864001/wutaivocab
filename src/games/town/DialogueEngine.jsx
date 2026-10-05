import React, { useState, useEffect, useMemo } from 'react';
import { getDialogueTreeForLocation } from './townData';
import { speakEnglish, soundEngine } from '../../services/audio';
import {
  Volume2, X, MessageSquare, Sparkles, ShoppingBag,
  ScrollText, Gift, ChevronRight, Compass, ArrowLeft, LogOut
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
  const [isDialogueReady, setIsDialogueReady] = useState(false);

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

  // 人物滑入就定位後延遲彈出對話框 (約 250ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDialogueReady(true);
    }, 280);
    return () => clearTimeout(timer);
  }, []);

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

  // 決定頭像、去背立繪與身分資訊
  const displayAvatar = isVisitingTeacher ? visitingTeacher.avatar : location.npcAvatar;
  const displayPortrait = isVisitingTeacher ? visitingTeacher.portrait : location.npcPortrait;
  const displayRole = isVisitingTeacher ? visitingTeacher.roleZh : location.npcRole;
  const displayBg = location.bgImage;

  // 決定角色站位：預設在畫面左側 1/3 (若是外師則可由右側 1/3 滑入)
  const standeeSide = isVisitingTeacher 
    ? (visitingTeacher.standeeSide || 'right') 
    : (location.standeeSide || 'left');
  const isLeft = standeeSide === 'left';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 overflow-hidden select-none animate-fadeIn">
      
      {/* ── 1. 全螢幕 16:9 室內場景底圖 (Full-Screen Scenic Backdrop) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {displayBg && !bgError ? (
          <img
            src={displayBg}
            alt={location.nameZh}
            onError={() => setBgError(true)}
            className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05] transition-all duration-700 scale-100"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${location.bgGradient}`} />
        )}
        {/* 電影級環境光影與暗角 */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/50" />
      </div>

      {/* ── 2. 頂部 HUD 狀態導航列 (Top Bar) ── */}
      <div className="relative z-30 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 bg-slate-950/40 backdrop-blur-md border-b border-white/15 shrink-0">
        <div className="flex items-center gap-3">
          {/* 返回小鎮地圖快捷鈕 */}
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-black text-xs sm:text-sm backdrop-blur-md border border-white/30 flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            title="隨時返回霧臺小鎮全景地圖"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回小鎮地圖</span>
          </button>

          {/* 地標名稱標籤 */}
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg shadow-sm border border-white/20">
              {displayAvatar}
            </span>
            <span className="text-sm sm:text-base font-black text-white font-heading drop-shadow-md">
              {location.nameZh}
            </span>
            <span className="text-xs font-mono font-bold text-amber-300 bg-white/10 px-2 py-0.5 rounded-full hidden sm:inline">
              {location.nameEn}
            </span>
            {isVisitingTeacher && (
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[11px] font-black animate-pulse flex items-center gap-1 shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{visitingTeacher.tag}</span>
              </span>
            )}
          </div>
        </div>

        {/* 右側功能快捷按鈕 */}
        <div className="flex items-center gap-2">
          {!isVisitingTeacher && location.hasShop && (
            <button
              onClick={() => {
                onClose();
                if (onOpenShop) onOpenShop(location.id);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md transition-all cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>商店目錄</span>
            </button>
          )}

          {!isVisitingTeacher && location.hasQuests && (
            <button
              onClick={() => {
                onClose();
                if (onOpenQuests) onOpenQuests();
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all cursor-pointer"
            >
              <ScrollText className="w-3.5 h-3.5" />
              <span>任務公佈欄</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
            title="關閉返回"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 外師彩蛋橫幅提示 */}
      {isVisitingTeacher && (
        <div className="relative z-30 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-4 py-1.5 flex items-center justify-between text-xs font-black shadow-inner shrink-0">
          <span className="flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5 animate-bounce" />
            <span>客座外師巡迴中：完成本次英語對話即可獲得 5~10 探索積分！</span>
          </span>
          <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[10px]">
            每日首遇限定
          </span>
        </div>
      )}

      {/* ── 3. 主舞台：左/右 1/3 去背人物立繪 + 2/3 半透明白色毛玻璃對話與應答框 ── */}
      <div className="relative z-20 flex-1 flex flex-col md:flex-row items-end justify-between px-4 sm:px-8 md:px-12 pb-4 sm:pb-6 gap-4 sm:gap-8 max-w-7xl mx-auto w-full min-h-0 overflow-y-auto sm:overflow-visible">
        
        {/* ── 人物立繪層 (Character Standee Layer) ── */}
        <div className={`w-full md:w-1/3 lg:w-5/12 flex flex-col items-center justify-end shrink-0 pointer-events-none ${
          isLeft 
            ? 'order-1 sm:items-start animate-slide-in-left' 
            : 'order-1 md:order-2 sm:items-end animate-slide-in-right'
        }`}>
          {displayPortrait && !portraitError ? (
            <div className="relative pointer-events-auto flex flex-col items-center group">
              {/* 已去背透明全身立繪 PNG */}
              <img
                src={displayPortrait}
                alt={currentNode.speaker}
                onError={() => setPortraitError(true)}
                className="h-56 sm:h-72 md:h-[480px] lg:h-[540px] max-h-[68vh] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)] select-none transition-transform duration-300 group-hover:scale-103"
              />
              {/* 人物浮動身分銘牌 */}
              <div className="mt-1 px-4 py-1.5 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-white/50 dark:border-slate-700/60 shadow-xl flex items-center gap-2 pointer-events-auto">
                <span className="text-xl">{displayAvatar}</span>
                <div>
                  <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-white font-heading leading-tight">
                    {currentNode.speaker}
                  </div>
                  <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    {displayRole}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="pointer-events-auto flex items-center gap-3 p-4 rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-white/40 shadow-xl mb-4">
              <span className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-4xl shadow-inner">
                {displayAvatar}
              </span>
              <div>
                <h4 className="text-base font-black text-slate-800 dark:text-white font-heading">
                  {currentNode.speaker}
                </h4>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {displayRole}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── 對話框與應答框層 (Right/Left 2/3 Dialogue Area) ── */}
        <div className={`w-full md:w-2/3 lg:w-7/12 flex flex-col justify-end space-y-3.5 pb-1 ${
          isLeft ? 'order-2 md:order-2' : 'order-2 md:order-1'
        } ${isDialogueReady ? 'animate-scaleUp' : 'opacity-0'}`}>

          {/* ── 上方：人物對話框 (Speech Bubble with Semi-transparent White Glassmorphism) ── */}
          <div className="p-4 sm:p-5 md:p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-2 border-white/60 dark:border-slate-700/60 shadow-2xl relative space-y-2.5 transition-all">
            
            {/* 對白框頂部狀態 */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-emerald-500 text-white font-black text-xs sm:text-sm tracking-wide shadow-sm flex items-center gap-1.5">
                  <span>{displayAvatar}</span>
                  <span>{currentNode.speaker}</span>
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
                  {displayRole}
                </span>
              </div>

              {/* 語音重複朗讀按鈕 */}
              <button
                onClick={handleReplaySpeech}
                className="px-3 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1 active:scale-95 border border-emerald-300/40"
                title="點擊聆聽英語真人朗讀"
              >
                <Volume2 className="w-3.5 h-3.5 animate-pulse text-emerald-600 dark:text-emerald-400" />
                <span>朗讀發音</span>
              </button>
            </div>

            {/* 英文主臺詞 */}
            <p className="text-base sm:text-lg md:text-xl font-black text-slate-800 dark:text-white leading-relaxed font-heading tracking-wide pr-2">
              "{currentNode.en}"
            </p>

            {/* 中文翻譯對白 */}
            <p className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-300 pt-2 border-t border-slate-200/80 dark:border-slate-700/80">
              「{currentNode.zh}」
            </p>
          </div>

          {/* ── 下方：學生應答框 (Student Response Choice Box) ── */}
          <div className="p-3.5 sm:p-5 rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-2 border-white/60 dark:border-slate-700/60 shadow-2xl space-y-2.5 transition-all">
            
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                <span>💬 選擇你的英語回應：</span>
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                點擊以英語應答
              </span>
            </div>

            {/* 樹狀對話選項列表 */}
            <div className="grid grid-cols-1 gap-2 max-h-[30vh] overflow-y-auto pr-0.5">
              {currentNode.options?.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  className="w-full text-left p-3 sm:p-3.5 rounded-2xl bg-white/70 hover:bg-emerald-50 dark:bg-slate-800/70 dark:hover:bg-emerald-950/40 border-2 border-slate-200/80 hover:border-emerald-400 dark:border-slate-700 dark:hover:border-emerald-500 transition-all shadow-sm active:scale-98 group cursor-pointer flex items-start gap-2.5"
                >
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/15 group-hover:bg-emerald-500 text-emerald-600 group-hover:text-white flex items-center justify-center text-xs font-black shrink-0 transition-colors mt-0.5 border border-emerald-400/30">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors leading-snug">
                      {opt.text_en}
                    </div>
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 mt-0.5 transition-colors">
                      {opt.text_zh}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                </button>
              ))}

              {/* 🚪 永久離開選項：隨時可返回小鎮大地圖 */}
              <button
                onClick={onClose}
                className="w-full text-left p-2.5 sm:p-3 rounded-2xl bg-slate-100/80 hover:bg-rose-50 dark:bg-slate-800/50 dark:hover:bg-rose-950/40 border border-slate-200 hover:border-rose-300 dark:border-slate-700 dark:hover:border-rose-500 transition-all shadow-sm active:scale-98 group cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-600 dark:text-slate-300 group-hover:text-rose-600 dark:group-hover:text-rose-400">
                  <span className="text-base">🚪</span>
                  <span>"I will explore the town now. See you later!" (我要去逛逛小鎮了，晚點見！)</span>
                </div>
                <span className="text-[10px] font-black text-slate-400 group-hover:text-rose-500 flex items-center gap-0.5">
                  <span>返回小鎮</span>
                  <span>↩️</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
