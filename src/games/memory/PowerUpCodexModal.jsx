import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { speakEnglish, soundEngine } from '../../services/audio';
import { POWER_UP_DEFS, MiniSandboxCanvas } from './PowerUpEffects';
import { OlympianDeityCardFace } from './OlympianCardArt';
import {
  X, Volume2, Sparkles, HelpCircle, ArrowLeft,
  ChevronLeft, ChevronRight, Shield, Zap, LayoutGrid, Disc
} from 'lucide-react';

const GOD_KEYS = ['lightning', 'peek', 'freeze', 'coin', 'lock', 'bonus', 'radar', 'winwin'];

export const PowerUpCodexModal = ({ isOpen, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState('wheel'); // 'wheel' | 'grid'
  const touchStartXRef = useRef(0);

  // 鍵盤左右箭頭導航支援
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, viewMode]);

  if (!isOpen) return null;

  const cardList = GOD_KEYS.map(key => POWER_UP_DEFS[key]);
  const currentCard = cardList[activeIndex] || cardList[0];

  const handlePrev = () => {
    soundEngine.click();
    setActiveIndex(prev => (prev - 1 + cardList.length) % cardList.length);
  };

  const handleNext = () => {
    soundEngine.click();
    setActiveIndex(prev => (prev + 1) % cardList.length);
  };

  const handleSelectIndex = (idx) => {
    soundEngine.click();
    setActiveIndex(idx);
    setViewMode('wheel');
  };

  // 支援觸控滑動切換
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (deltaX > 40) {
      handlePrev();
    } else if (deltaX < -40) {
      handleNext();
    }
  };

  // 語音朗讀卡牌雙語神話與規則
  const handleSpeakCard = (card) => {
    soundEngine.click();
    // 朗讀英文神祇名與稱號
    speakEnglish(card.enName);

    // 朗讀中文神話背景與規則 (Web Speech API)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `${card.name}。${card.mythTitle}。神話典故：${card.mythLoreZh || card.shortDesc}。卡牌規則：${card.shortDesc}`;
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'zh-TW';
      utter.rate = 1.0;
      window.speechSynthesis.speak(utter);
    }
  };

  const prevIndex = (activeIndex - 1 + cardList.length) % cardList.length;
  const nextIndex = (activeIndex + 1) % cardList.length;
  const prevCard = cardList[prevIndex];
  const nextCard = cardList[nextIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="max-w-5xl w-full max-h-[94vh] flex flex-col rounded-3xl bg-slate-900/95 border-2 border-amber-500/40 shadow-[0_0_50px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* ─── 頂部 Header ─── */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 relative z-20">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.25)]">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-black text-amber-200 font-heading tracking-wide flex items-center gap-2">
                <span>奧林帕斯神殿 • 希臘眾神圖鑑</span>
                <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  8 大神卡
                </span>
              </h2>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 truncate max-w-[240px] sm:max-w-md">
                3D 輪轉選角 • 中英雙語神話典故與實戰戰略
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 視圖切換：3D 轉盤選角 vs 8 格總覽 */}
            <div className="flex items-center bg-slate-800/90 p-0.5 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => {
                  soundEngine.click();
                  setViewMode('wheel');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all ${
                  viewMode === 'wheel'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="3D 轉盤選角模式"
              >
                <Disc className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">3D 輪播</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.click();
                  setViewMode('grid');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="宮格總覽模式"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">總覽</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ─── 主體內容區 ─── */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-5 md:p-6">
          {viewMode === 'wheel' ? (
            /* ══════ 3D 轉盤選角展示模式 ══════ */
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 items-start h-full">
              {/* ── 左半部：3D 景深選角輪盤 + 微縮實戰沙盒 ── */}
              <div
                className="w-full lg:w-[46%] shrink-0 flex flex-col items-center select-none"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* 3D 景深旋轉舞台 */}
                <div className="w-full relative py-2 flex items-center justify-center min-h-[220px] sm:min-h-[260px] overflow-hidden">
                  {/* 左切換箭頭 */}
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous Deity"
                    className="absolute left-1 sm:left-2 z-30 p-2 sm:p-2.5 rounded-full bg-slate-900/90 hover:bg-amber-500 hover:text-stone-950 text-amber-300 border border-amber-400/50 shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-all active:scale-90"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  {/* 3D 卡牌舞台 (左側前一張、中央主卡、右側後一張) */}
                  <div
                    className="relative w-full max-w-[420px] h-[190px] sm:h-[230px] flex items-center justify-center"
                    style={{ perspective: '1100px' }}
                  >
                    {/* 左側卡牌 (傾斜景深) */}
                    <div
                      onClick={handlePrev}
                      className="absolute left-2 sm:left-4 w-32 sm:w-40 aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-out z-10 opacity-45 hover:opacity-75"
                      style={{
                        transform: 'rotateY(30deg) scale(0.82) translateZ(-60px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.7)'
                      }}
                    >
                      <OlympianDeityCardFace powerId={prevCard.id} />
                      <div className="absolute inset-0 bg-slate-950/40 pointer-events-none" />
                    </div>

                    {/* 中央主卡 (醒目放大、金框光環) */}
                    <div
                      className="relative w-52 sm:w-64 aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 ease-out z-20"
                      style={{
                        transform: 'rotateY(0deg) scale(1) translateZ(40px)',
                        boxShadow: '0 0 35px rgba(251,191,36,0.45), 0 20px 40px rgba(0,0,0,0.85)'
                      }}
                    >
                      <OlympianDeityCardFace powerId={currentCard.id} size="large" />
                    </div>

                    {/* 右側卡牌 (傾斜景深) */}
                    <div
                      onClick={handleNext}
                      className="absolute right-2 sm:right-4 w-32 sm:w-40 aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-out z-10 opacity-45 hover:opacity-75"
                      style={{
                        transform: 'rotateY(-30deg) scale(0.82) translateZ(-60px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.7)'
                      }}
                    >
                      <OlympianDeityCardFace powerId={nextCard.id} />
                      <div className="absolute inset-0 bg-slate-950/40 pointer-events-none" />
                    </div>
                  </div>

                  {/* 右切換箭頭 */}
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next Deity"
                    className="absolute right-1 sm:right-2 z-30 p-2 sm:p-2.5 rounded-full bg-slate-900/90 hover:bg-amber-500 hover:text-stone-950 text-amber-300 border border-amber-400/50 shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-all active:scale-90"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                {/* 底部 8 神快速點選指示膠囊列 */}
                <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2 my-2 py-1 flex-wrap">
                  {cardList.map((c, i) => {
                    const isSelected = i === activeIndex;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectIndex(i)}
                        className={`px-2 py-1 rounded-xl text-[11px] font-black transition-all flex items-center gap-1 ${
                          isSelected
                            ? 'bg-amber-400 text-stone-950 shadow-[0_0_12px_rgba(251,191,36,0.6)] scale-105'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        <span>{c.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>

                {/* 卡牌神力微縮實戰循環沙盒 */}
                <div className="w-full mt-2 p-2.5 sm:p-3 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col items-center shadow-inner">
                  <div className="flex items-center justify-between w-full mb-1.5 px-1">
                    <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      實戰神力動畫模擬 (Live Sandbox)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      LOOPING
                    </span>
                  </div>
                  <MiniSandboxCanvas cardId={currentCard.id} width={260} height={130} />
                </div>
              </div>

              {/* ── 右半部：雙語希臘神話起源典故 + 運作機制與戰略 ── */}
              <div className="flex-1 w-full space-y-3 sm:space-y-4">
                {/* 頂部神祇名號與語音報讀按鈕 */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-800/90 to-indigo-950/40 border border-amber-400/40 flex items-start justify-between gap-3 shadow-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-md bg-amber-400 text-stone-950 uppercase tracking-widest">
                        NO. 0{activeIndex + 1}
                      </span>
                      <span className="text-xs font-bold text-amber-300/80">
                        {currentCard.mythTitle}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
                      {currentCard.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-extrabold text-amber-300">
                      {currentCard.enName}
                    </p>
                  </div>

                  <Button3D
                    variant="amber"
                    size="sm"
                    onClick={() => handleSpeakCard(currentCard)}
                    icon={Volume2}
                    className="shrink-0"
                  >
                    語音報讀
                  </Button3D>
                </div>

                {/* 🏛️ 1. 古希臘神話典故與起源 (Bilingual Mythology Lore) */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-md">
                  <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="text-sm">🏛️</span> 古希臘神話典故與起源 (Mythology Lore)
                  </h4>
                  <p className="text-xs sm:text-sm font-bold text-slate-100 leading-relaxed mb-2">
                    {currentCard.mythLoreZh}
                  </p>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-300/90 leading-relaxed italic border-l-2 border-amber-400/60 pl-2.5">
                    {currentCard.mythLoreEn}
                  </p>
                </div>

                {/* 🛡️ 2. 遊戲神力運作機制 (Game Rules) */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-md">
                  <h4 className="text-xs font-black text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-400" /> 神力運作機制 (Card Effect)
                  </h4>
                  <p className="text-xs sm:text-sm font-bold text-slate-100 leading-relaxed mb-1.5">
                    {currentCard.shortDesc}
                  </p>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-300/80 italic">
                    {currentCard.enDesc}
                  </p>
                </div>

                {/* 💡 3. 高手對戰戰略指南 (Tactical Mastery) */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-md">
                  <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" /> 高手對戰戰略指南 (Tactical Guide)
                  </h4>
                  <p className="text-xs sm:text-sm font-bold text-amber-100 leading-relaxed mb-1">
                    {currentCard.tactic}
                  </p>
                  <p className="text-[11px] sm:text-xs font-semibold text-amber-300/75 italic">
                    {currentCard.enTactic}
                  </p>
                </div>

                {/* 私密視野與特殊規則提示 */}
                {['peek', 'radar', 'lightning'].includes(currentCard.id) && (
                  <div className="p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/35 flex items-start gap-2 shadow-sm">
                    <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div className="text-[11px] sm:text-xs font-bold text-indigo-200 leading-relaxed">
                      {currentCard.id === 'peek' && '【私密視野保護】：所選卡片僅本隊螢幕能透視看到，其他隊伍螢幕只會顯示神秘護盾阻絕，絕不洩漏情報！'}
                      {currentCard.id === 'radar' && '【獨占透視】：全場微光透視僅出現在本隊螢幕，敵隊螢幕完全正常不顯示，保有絕對情報優勢！'}
                      {currentCard.id === 'lightning' && '【Bonus 回合規則】：前兩張翻到閃電卡自動配對並開啟 Bonus 回合；若在第 3、4 張（Bonus 回合）翻到，完成配對後結束本隊回合並換隊。'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ══════ 八大卡牌宮格總覽模式 ══════ */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 animate-scaleUp">
              {cardList.map((card, idx) => (
                <div
                  key={card.id}
                  onClick={() => handleSelectIndex(idx)}
                  className={`group cursor-pointer rounded-2xl p-3.5 border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between ${card.bg} ${card.border} hover:border-amber-400`}
                >
                  <div>
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-2.5 border border-amber-400/50 shadow-md group-hover:scale-[1.03] transition-transform">
                      <OlympianDeityCardFace powerId={card.id} />
                    </div>

                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-black text-white font-heading group-hover:text-amber-400 transition-colors">
                        {card.name}
                      </h3>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        #{idx + 1}
                      </span>
                    </div>

                    <p className="text-[11px] font-bold text-slate-400 mb-1.5 truncate">
                      {card.enName}
                    </p>
                    <p className="text-[11px] font-medium text-slate-300 line-clamp-2 leading-relaxed">
                      {card.shortDesc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                    <span>點擊進入 3D 轉盤</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── 底部 Footer ─── */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-t border-slate-800 flex items-center justify-between bg-slate-900/90 relative z-20">
          <span className="text-[11px] sm:text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <span>🏛️ 星際記憶翻牌 • 奧林帕斯眾神圖鑑</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-500">霧臺國小教學團隊研發</span>
          </span>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-[11px] text-slate-500 font-bold">
              可使用鍵盤 ← → 方向鍵旋轉選角
            </span>
            <Button3D variant="slate" size="sm" onClick={onClose}>
              關閉圖鑑
            </Button3D>
          </div>
        </div>
      </div>
    </div>
  );
};