import React, { useState, useEffect } from 'react';
import { Button3D } from '../../components/ui/Button3D';
import { DIALOGUE_TREES } from './townData';
import { speakEnglish, soundEngine } from '../../services/audio';
import { Volume2, X, MessageSquare, Sparkles, ShoppingBag, ScrollText, CheckCircle2 } from 'lucide-react';

export const DialogueEngine = ({
  location,
  onClose,
  onOpenShop,
  onOpenQuests,
  onQuestProgress
}) => {
  const tree = DIALOGUE_TREES[location?.id];
  const [currentNodeId, setCurrentNodeId] = useState(tree?.startNode || 'welcome');

  const currentNode = tree?.nodes?.[currentNodeId];

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-emerald-400 dark:border-emerald-600 overflow-hidden relative my-auto animate-scaleUp">
        {/* 頂部 NPC 橫幅 */}
        <div className={`p-4 sm:p-5 bg-gradient-to-r ${location.bgGradient} text-slate-800 dark:text-white flex items-center justify-between border-b border-slate-200 dark:border-slate-800`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-md flex items-center justify-center text-2xl shrink-0">
              {location.npcAvatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-heading font-black">
                  {currentNode.speaker}
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                  {location.nameZh}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {location.npcRole}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            title="關閉對話"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* NPC 對話對白框 (Speech Bubble) */}
        <div className="p-4 sm:p-6 space-y-5">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 relative">
            {/* 語音重複朗讀按鈕 */}
            <button
              onClick={handleReplaySpeech}
              className="absolute right-3 top-3 p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 transition-colors shadow-sm cursor-pointer flex items-center gap-1 text-xs font-bold"
              title="點擊聆聽英語真人發音"
            >
              <Volume2 className="w-4 h-4 animate-pulse text-emerald-600 dark:text-emerald-400" />
              <span>朗讀發音</span>
            </button>

            {/* 英文主對話 */}
            <p className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 leading-relaxed pr-24 font-heading">
              "{currentNode.en}"
            </p>

            {/* 中文輔助翻譯 */}
            <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 mt-2.5 pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80">
              「{currentNode.zh}」
            </p>
          </div>

          {/* 學生回答選項分支 (Branch Options) */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block px-1">
              💬 選擇你的英語回應：
            </span>

            {currentNode.options?.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt)}
                className="w-full text-left p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border-2 border-slate-200 hover:border-emerald-400 dark:border-slate-700 dark:hover:border-emerald-500 transition-all shadow-sm active:scale-98 group cursor-pointer"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/15 group-hover:bg-emerald-500 text-emerald-600 group-hover:text-white flex items-center justify-center text-xs font-black shrink-0 transition-colors mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                      {opt.text_en}
                    </div>
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                      {opt.text_zh}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* 店家快捷功能列 */}
          {location.hasShop && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  onClose();
                  if (onOpenShop) onOpenShop(location.id);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>直接打開商品目錄</span>
              </button>
            </div>
          )}

          {location.hasQuests && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  onClose();
                  if (onOpenQuests) onOpenQuests();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <ScrollText className="w-4 h-4" />
                <span>查看每日任務公佈欄</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
