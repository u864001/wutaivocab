import React, { useState, useEffect, useMemo } from 'react';
import { getDialogueTreeForLocation } from './townData';
import { speakEnglish, stopSpeech, soundEngine } from '../../services/audio';
import {
  Volume2, X, MessageSquare, Sparkles, ShoppingBag,
  ScrollText, Gift, ChevronRight, ArrowLeft, LogOut,
  Music, VolumeX, Eye, EyeOff, RotateCcw
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
  // 智慧決定當前對話樹
  const tree = useMemo(() => {
    return getDialogueTreeForLocation(location?.id, {
      isTeacherActive: isVisitingTeacher,
      teacher: visitingTeacher
    });
  }, [location?.id, isVisitingTeacher, visitingTeacher]);

  const [currentNodeId, setCurrentNodeId] = useState(tree?.startNode || 'welcome');
  const [nodeHistory, setNodeHistory] = useState([]); // 樹狀對話歷史堆疊，支援回上一層
  const [showChineseNpc, setShowChineseNpc] = useState(false); // 預設隱藏 NPC 中文翻譯，由學生主動點擊展開
  const [showChineseOptions, setShowChineseOptions] = useState(false); // 預設隱藏應答選項中文，純美語閱讀練習
  const currentNode = tree?.nodes?.[currentNodeId];
  const [portraitError, setPortraitError] = useState(false);
  const [bgError, setBgError] = useState(false);
  const [isDialogueReady, setIsDialogueReady] = useState(false);

  // 決定當前發言人物的專屬音色設定 (性別、音調 pitch、語速 rate、腔調 accent)
  const activeVoiceProfile = useMemo(() => {
    if (isVisitingTeacher && visitingTeacher?.voiceProfile) {
      return visitingTeacher.voiceProfile;
    }
    return location?.voiceProfile || { gender: 'male', pitch: 1.0, rate: 0.88, accent: 'en-US' };
  }, [isVisitingTeacher, visitingTeacher, location]);

  const [isBgmPlaying, setIsBgmPlaying] = useState(true);

  // 進入場景時啟動該地標專屬背景音樂
  useEffect(() => {
    if (location?.id) {
      soundEngine.startSceneBgm(location.id);
      setIsBgmPlaying(soundEngine.isSceneBgmActive());
    }

    return () => {
      stopSpeech();
    };
  }, [location?.id]);

  const handleToggleBgm = () => {
    soundEngine.click();
    const active = soundEngine.toggleSceneBgm(location?.id);
    setIsBgmPlaying(active);
  };

  // 當切換新節點時，自動朗讀英語並重設中文隱藏
  useEffect(() => {
    if (currentNode?.en) {
      soundEngine.click();
      speakEnglish(currentNode.en, activeVoiceProfile);
      setShowChineseNpc(false); // 新句子預設隱藏中文翻譯
      if (onQuestProgress) {
        onQuestProgress('dialogue', location.id, currentNodeId);
      }
    }
  }, [currentNodeId, currentNode, location?.id, activeVoiceProfile]);

  // 人物滑入就定位後延遲彈出對話框
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDialogueReady(true);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  // 安全退出並停止語音
  const handleClose = () => {
    stopSpeech();
    if (onClose) onClose();
  };

  if (!location || !tree || !currentNode) {
    return null;
  }

  // 選擇回應選項 (支援商店不退場、回上一層、自選分支)
  const handleSelectOption = (opt) => {
    soundEngine.click();

    // 領取外師彩蛋
    if (opt.action === 'CLAIM_TEACHER_BONUS') {
      stopSpeech();
      if (onTeacherBonusClaimed) {
        onTeacherBonusClaimed();
      }
      handleClose();
      return;
    }

    // 開啟商店：不關閉對話場景，符合 RPG 邏輯，商店覆蓋於當前場景，關閉商店後依然留在角色面前！
    if (opt.action === 'OPEN_SHOP') {
      stopSpeech();
      if (onOpenShop) onOpenShop(location.id);
      return;
    }

    // 開啟任務公佈欄：同樣保持場景不中斷
    if (opt.action === 'OPEN_QUESTS') {
      stopSpeech();
      if (onOpenQuests) onOpenQuests();
      return;
    }

    if (opt.target_id === 'END') {
      handleClose();
      return;
    }

    if (opt.target_id && tree.nodes[opt.target_id]) {
      setNodeHistory(prev => [...prev, currentNodeId]);
      setCurrentNodeId(opt.target_id);
    } else {
      handleClose();
    }
  };

  // 回到上一層 (RPG 樹狀對話經典返回操作)
  const handleGoBack = () => {
    soundEngine.click();
    stopSpeech();
    if (nodeHistory.length > 0) {
      const prevNodeId = nodeHistory[nodeHistory.length - 1];
      setNodeHistory(prev => prev.slice(0, -1));
      setCurrentNodeId(prevNodeId);
    } else {
      setCurrentNodeId(tree?.startNode || 'welcome');
    }
  };

  const handleReplaySpeech = () => {
    if (currentNode?.en) {
      speakEnglish(currentNode.en, activeVoiceProfile);
    }
  };

  const displayAvatar = isVisitingTeacher ? visitingTeacher.avatar : location.npcAvatar;
  const displayPortrait = isVisitingTeacher ? visitingTeacher.portrait : location.npcPortrait;
  const displayRole = isVisitingTeacher ? visitingTeacher.roleZh : location.npcRole;
  const displayBg = location.bgImage;

  const standeeSide = isVisitingTeacher 
    ? (visitingTeacher.standeeSide || 'right') 
    : (location.standeeSide || 'left');
  const isLeft = standeeSide === 'left';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 overflow-hidden select-none animate-fadeIn">
      
      {/* ── 1. 全螢幕 16:9 室內場景底圖 ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {displayBg && !bgError ? (
          <img
            src={displayBg}
            alt={location.nameZh}
            onError={() => setBgError(true)}
            className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.03] transition-all duration-700"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${location.bgGradient}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/50" />
      </div>

      {/* ── 2. 頂部簡約導航列 ── */}
      <div className="relative z-30 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 bg-slate-950/40 backdrop-blur-md border-b border-white/15 shrink-0">
        <div className="flex items-center gap-3">
          {/* 返回小鎮大地圖按鈕 */}
          <button
            onClick={handleClose}
            className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-black text-xs sm:text-sm backdrop-blur-md border border-white/30 flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            title="返回小鎮大地圖"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回小鎮</span>
          </button>

          {/* 地標與角色名稱 */}
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-lg shadow-sm border border-white/20">
              {displayAvatar}
            </span>
            <span className="text-sm sm:text-base font-black text-white font-heading drop-shadow">
              {location.nameZh}
            </span>
            <span className="text-xs font-mono font-bold text-amber-300 bg-white/10 px-2 py-0.5 rounded-full hidden sm:inline">
              {location.nameEn}
            </span>
            {isVisitingTeacher && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-black animate-pulse flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{visitingTeacher.nameZh} 現身！</span>
              </span>
            )}
          </div>
        </div>

        {/* 右側快捷操作 */}
        <div className="flex items-center gap-2">
          {!isVisitingTeacher && location.hasShop && (
            <button
              onClick={() => {
                stopSpeech();
                if (onOpenShop) onOpenShop(location.id);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md transition-all cursor-pointer"
              title="開啟商店購買道具"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>商店目錄</span>
            </button>
          )}

          {!isVisitingTeacher && location.hasQuests && (
            <button
              onClick={() => {
                stopSpeech();
                if (onOpenQuests) onOpenQuests();
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all cursor-pointer"
              title="查看每日任務公佈欄"
            >
              <ScrollText className="w-3.5 h-3.5" />
              <span>任務公佈欄</span>
            </button>
          )}

          {/* 背景音樂開關 */}
          <button
            onClick={handleToggleBgm}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-black backdrop-blur-md border transition-all flex items-center gap-1 shadow-sm cursor-pointer active:scale-95 ${
              isBgmPlaying
                ? 'bg-amber-500/25 text-amber-200 border-amber-400/40'
                : 'bg-white/15 text-slate-300 border-white/20'
            }`}
            title={isBgmPlaying ? '暫停音樂' : '播放音樂'}
          >
            {isBgmPlaying ? (
              <Music className="w-3.5 h-3.5 animate-bounce text-amber-300" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* ── 3. 舞臺主體內容區 (置中對稱、左右留白一致、自適應各種螢幕) ── */}
      <div className="relative flex-1 w-full max-w-[1380px] mx-auto flex flex-col md:flex-row items-end justify-between px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 pb-3 sm:pb-5 gap-4 md:gap-8 lg:gap-12 overflow-hidden pointer-events-none">
        
        {/* ── 角色立繪層 (Left/Right 立繪對齊外側留白) ── */}
        <div className={`w-full md:w-auto shrink-0 flex flex-col justify-end z-10 transition-all duration-700 ${
          isLeft 
            ? 'order-1 md:order-1 items-center md:items-start' 
            : 'order-1 md:order-2 items-center md:items-end'
        }`}>
          {displayPortrait && !portraitError ? (
            <div className="relative group pointer-events-auto flex flex-col items-center">
              <img
                src={displayPortrait}
                alt={currentNode.speaker}
                onError={() => setPortraitError(true)}
                className="h-52 sm:h-64 md:h-[460px] lg:h-[520px] max-h-[66vh] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)] select-none transition-transform duration-300 group-hover:scale-102"
              />
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

        {/* ── 對話框與應答框層 (適當寬度、與立繪留白對稱平衡) ── */}
        <div className={`w-full md:flex-1 flex flex-col justify-end pointer-events-auto ${
          isLeft 
            ? 'order-2 md:order-2 items-center md:items-end' 
            : 'order-2 md:order-1 items-center md:items-start'
        } ${isDialogueReady ? 'animate-scaleUp' : 'opacity-0'}`}>
          
          <div className="w-full max-w-[560px] md:max-w-[580px] lg:max-w-[640px] xl:max-w-[680px] flex flex-col space-y-3 pb-1">

            {/* ── 上方：人物對話框 (Speech Bubble) ── */}
            <div className="p-4 sm:p-5 md:p-5.5 rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-2 border-white/60 dark:border-slate-700/60 shadow-2xl relative space-y-2.5 transition-all">
              
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-sm flex items-center gap-1.5">
                    <span>{displayAvatar}</span>
                    <span>{currentNode.speaker}</span>
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
                    {displayRole}
                  </span>
                </div>

                {/* 朗讀發音按鈕 */}
                <button
                  onClick={handleReplaySpeech}
                  className="px-3 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1 active:scale-95 border border-emerald-300/40"
                  title="重新聆聽發音"
                >
                  <Volume2 className="w-3.5 h-3.5 animate-pulse text-emerald-600 dark:text-emerald-400" />
                  <span>朗讀</span>
                </button>
              </div>

              {/* 英文主臺詞 (醒目美語原音主體) */}
              <p className="text-base sm:text-lg md:text-xl font-black text-slate-800 dark:text-white leading-relaxed font-heading tracking-wide pr-2">
                "{currentNode.en}"
              </p>

              {/* 🌟 中文翻譯：預設隱藏，點擊才展開 (營造純美語閱讀情境) */}
              {showChineseNpc ? (
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 flex items-start justify-between gap-2 animate-fadeIn">
                  <p className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-300 leading-relaxed">
                    「{currentNode.zh}」
                  </p>
                  <button
                    onClick={() => setShowChineseNpc(false)}
                    className="text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 cursor-pointer flex items-center gap-0.5"
                  >
                    <EyeOff className="w-3 h-3" />
                    <span>隱藏</span>
                  </button>
                </div>
              ) : (
                <div className="pt-1">
                  <button
                    onClick={() => setShowChineseNpc(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 hover:underline cursor-pointer"
                    title="點擊查看中文翻譯"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>點擊查看中文翻譯</span>
                  </button>
                </div>
              )}
            </div>

            {/* ── 下方：學生應答框 (Student Choice Box) ── */}
            <div className="p-3.5 sm:p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-2 border-white/60 dark:border-slate-700/60 shadow-2xl space-y-2 transition-all">
              
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                  <span>💬 選擇你的回應：</span>
                </span>

                {/* 選項中文提示開關 (預設純英文，點擊切換) */}
                <button
                  onClick={() => setShowChineseOptions(prev => !prev)}
                  className="text-[11px] font-bold text-slate-400 hover:text-emerald-500 flex items-center gap-1 cursor-pointer transition-colors"
                  title="切換選項中文翻譯提示"
                >
                  <span>{showChineseOptions ? '隱藏中文提示' : '💡 中文提示'}</span>
                </button>
              </div>

              {/* 樹狀對話選項列表 */}
              <div className="grid grid-cols-1 gap-2 max-h-[28vh] overflow-y-auto pr-0.5 scrollbar-thin">
                {currentNode.options?.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    className="w-full text-left p-2.5 sm:p-3 rounded-2xl bg-white/70 hover:bg-emerald-50 dark:bg-slate-800/70 dark:hover:bg-emerald-950/40 border-2 border-slate-200/80 hover:border-emerald-400 dark:border-slate-700 dark:hover:border-emerald-500 transition-all shadow-sm active:scale-98 group cursor-pointer flex items-start gap-2.5"
                  >
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/15 group-hover:bg-emerald-500 text-emerald-600 group-hover:text-white flex items-center justify-center text-xs font-black shrink-0 transition-colors mt-0.5 border border-emerald-400/30">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors leading-snug">
                        {opt.text_en}
                      </div>
                      {showChineseOptions && opt.text_zh && (
                        <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 mt-0.5 transition-colors">
                          {opt.text_zh}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </button>
                ))}

                {/* ↩️ 回上一層 / 詢問其他事情 (經典 RPG 樹狀對話返回上一層操作) */}
                {nodeHistory.length > 0 && (
                  <button
                    onClick={handleGoBack}
                    className="w-full text-left p-2 sm:p-2.5 rounded-2xl bg-indigo-50/90 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-700/80 text-indigo-700 dark:text-indigo-300 font-black text-xs transition-all shadow-sm active:scale-98 flex items-center justify-between cursor-pointer"
                    title="回到上一層對話選項"
                  >
                    <div className="flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>"Let me ask something else." (回上一層 / 詢問其他事情)</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-indigo-200/60 dark:bg-indigo-800/60 px-2 py-0.5 rounded-full">
                      Back
                    </span>
                  </button>
                )}

                {/* 🚪 返回小鎮選項 */}
                <button
                  onClick={handleClose}
                  className="w-full text-left p-2 sm:p-2.5 rounded-2xl bg-slate-100/80 hover:bg-rose-50 dark:bg-slate-800/50 dark:hover:bg-rose-950/40 border border-slate-200 hover:border-rose-300 dark:border-slate-700 dark:hover:border-rose-500 transition-all shadow-sm active:scale-98 group cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 text-xs font-black text-slate-600 dark:text-slate-300 group-hover:text-rose-600 dark:group-hover:text-rose-400">
                    <span className="text-sm">🚪</span>
                    <span>"Goodbye! See you later." (再見，返回小鎮)</span>
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
    </div>
  );
};

export default DialogueEngine;
