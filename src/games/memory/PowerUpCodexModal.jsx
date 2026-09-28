import React, { useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { speakEnglish, soundEngine } from '../../services/audio';
import { POWER_UP_DEFS, MiniSandboxCanvas } from './PowerUpEffects';
import {
  X, Volume2, Sparkles, HelpCircle, ArrowLeft,
  ChevronRight, Shield, Zap
} from 'lucide-react';

export const PowerUpCodexModal = ({ isOpen, onClose }) => {
  const [selectedCardId, setSelectedCardId] = useState(null);

  if (!isOpen) return null;

  const cardList = Object.values(POWER_UP_DEFS);
  const selectedCard = selectedCardId ? POWER_UP_DEFS[selectedCardId] : null;

  // 語音朗讀卡牌雙語介紹
  const handleSpeakCard = (card) => {
    soundEngine.click();
    // 朗讀英文名
    speakEnglish(card.enName);

    // 朗讀中文說明 (Web Speech API)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `${card.name}，精靈化身：${card.spirit}。${card.shortDesc}`;
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'zh-TW';
      utter.rate = 1.0;
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="max-w-4xl w-full max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border-2 border-slate-700/80 shadow-2xl overflow-hidden">
        {/* 頂部 Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            {selectedCard ? (
              <button
                onClick={() => setSelectedCardId(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-1 text-sm font-bold"
              >
                <ArrowLeft className="w-4 h-4" /> 返回精靈列表
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white font-heading">
                    星際卡牌精靈圖鑑 (8 大正增強神卡)
                  </h2>
                  <p className="text-xs font-bold text-slate-400">
                    點擊任一精靈卡牌展開全螢幕說明與實戰動畫模擬
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 內容區域 */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
          {selectedCard ? (
            /* ─── 單一卡牌巨幅展開詳細面板 (含微縮實戰動畫) ─── */
            <div className="animate-scaleUp flex flex-col md:flex-row gap-6 items-start">
              {/* 左側：精靈立繪卡面與微縮動畫沙盒 */}
              <div className="w-full md:w-72 shrink-0 flex flex-col items-center">
                <div
                  className={`w-full aspect-[3/4] rounded-3xl p-6 flex flex-col items-center justify-between border-2 shadow-2xl relative overflow-hidden bg-gradient-to-b ${selectedCard.gradient} ${selectedCard.border}`}
                >
                  <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />

                  {/* 頂部精靈編號與圖示 */}
                  <div className="w-full flex items-center justify-between z-10">
                    <span className="text-xs font-black tracking-widest text-white/80 uppercase">
                      MAGIC POWER-UP
                    </span>
                    <selectedCard.icon className="w-7 h-7 text-white drop-shadow-md" />
                  </div>

                  {/* 中央巨大精靈標誌 */}
                  <div className="my-auto flex flex-col items-center text-center z-10">
                    <div className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner mb-3">
                      <selectedCard.icon className="w-12 h-12 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-2xl font-black text-white font-heading">
                      {selectedCard.name}
                    </span>
                    <span className="text-xs font-bold text-white/70">
                      {selectedCard.enName}
                    </span>
                  </div>

                  {/* 底部化身稱號 */}
                  <div className="w-full py-1.5 px-3 rounded-xl bg-black/30 backdrop-blur-md text-center text-xs font-extrabold text-amber-300 border border-white/10 z-10">
                    {selectedCard.spirit}
                  </div>
                </div>

                {/* 卡牌角落實戰微縮循環動畫模擬 */}
                <div className="w-full mt-4 p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center">
                  <div className="flex items-center justify-between w-full mb-2 px-1">
                    <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" /> 實戰模擬展示 (Live Sandbox)
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      LOOPING
                    </span>
                  </div>
                  <MiniSandboxCanvas cardId={selectedCard.id} width={240} height={140} />
                </div>
              </div>

              {/* 右側：雙語說明與實戰技巧 */}
              <div className="flex-1 w-full space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-white font-heading">
                      {selectedCard.name}
                      <span className="ml-2 text-sm font-bold text-slate-400">
                        ({selectedCard.enName})
                      </span>
                    </h3>
                    <p className="text-xs font-bold text-amber-400 mt-0.5">
                      精靈稱謂：{selectedCard.spirit}
                    </p>
                  </div>

                  {/* 🔊 語音朗讀按鈕 */}
                  <Button3D
                    variant="amber"
                    size="sm"
                    onClick={() => handleSpeakCard(selectedCard)}
                    icon={Volume2}
                  >
                    語音報讀
                  </Button3D>
                </div>

                {/* 規則運作說明 */}
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-400" /> 運作機制與規則說明
                  </h4>
                  <p className="text-base font-bold text-slate-100 leading-relaxed mb-2">
                    {selectedCard.shortDesc}
                  </p>
                  <p className="text-xs font-semibold text-slate-400 italic">
                    {selectedCard.enDesc}
                  </p>
                </div>

                {/* 實戰戰略技巧 */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" /> 高手戰略指南
                  </h4>
                  <p className="text-sm font-bold text-amber-100 leading-relaxed mb-1">
                    {selectedCard.tactic}
                  </p>
                  <p className="text-xs font-semibold text-amber-300/70 italic">
                    {selectedCard.enTactic}
                  </p>
                </div>

                {/* 私密視野與特殊規則提示 */}
                {['peek', 'radar', 'lightning'].includes(selectedCard.id) && (
                  <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-2.5">
                    <HelpCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div className="text-xs font-bold text-blue-200 leading-relaxed">
                      {selectedCard.id === 'peek' && '【私密視野保護】：所選卡片僅本隊螢幕能透視看到，其他隊伍螢幕只會顯示紫色神秘護盾阻絕，絕不洩漏情報！'}
                      {selectedCard.id === 'radar' && '【獨占透視】：全場微光透視僅出現在本隊螢幕，敵隊螢幕完全正常不顯示，保有絕對諜報優勢！'}
                      {selectedCard.id === 'lightning' && '【Bonus 回合規則】：前兩張翻到閃電卡自動配對並開啟 Bonus 回合；若在第 3、4 張（Bonus 回合）翻到，完成配對後結束本隊回合並換隊。'}
                    </div>
                  </div>
                )}

                {/* 返回列表按鈕 */}
                <div className="pt-2 flex justify-end">
                  <Button3D
                    variant="slate"
                    size="md"
                    onClick={() => setSelectedCardId(null)}
                  >
                    返回精靈圖鑑列表
                  </Button3D>
                </div>
              </div>
            </div>
          ) : (
            /* ─── 八大卡牌宮格總覽列表 ─── */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {cardList.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.id}
                    onClick={() => {
                      soundEngine.click();
                      setSelectedCardId(card.id);
                    }}
                    className={`group cursor-pointer rounded-2xl p-4 border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-between ${card.bg} ${card.border} hover:border-white/60`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: `${card.color}25`, border: `1.5px solid ${card.color}` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: card.color }} />
                        </div>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-white/10 text-slate-300 uppercase">
                          POWER-UP
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-white font-heading mb-0.5 group-hover:text-amber-400 transition-colors">
                        {card.name}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 mb-2">
                        {card.enName}
                      </p>
                      <p className="text-xs font-medium text-slate-300 line-clamp-2 leading-relaxed">
                        {card.shortDesc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                      <span>查看精靈介紹 & 動畫</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 底部 Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 flex items-center justify-between bg-slate-900/90">
          <span className="text-xs font-bold text-slate-400">
            星際記憶翻牌 • 霧臺國小教學團隊研發
          </span>
          <Button3D variant="slate" size="sm" onClick={onClose}>
            關閉圖鑑
          </Button3D>
        </div>
      </div>
    </div>
  );
};
