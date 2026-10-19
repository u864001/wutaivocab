import React, { useState } from 'react';
import {
  X, Sparkles, BookOpen, Trophy, ShieldCheck,
  ChevronRight, CheckCircle2, Lock, Star, Play, Layers
} from 'lucide-react';
import { Button3D } from './ui/Button3D';
import {
  GRIMOIRE_BOOKS,
  GRIMOIRE_GAME_MODES,
  getGrimoireSummary,
  getBookProgress
} from '../utils/grimoireHelper';
import { soundEngine } from '../services/audio';

export const GrimoireSanctuaryModal = ({
  studentId,
  studentName = '好學生',
  cardTheme = 'dark',
  onClose,
  onLaunchGame
}) => {
  const [activeTheme, setActiveTheme] = useState(cardTheme);
  const [selectedBookId, setSelectedBookId] = useState(1);
  const summary = getGrimoireSummary(studentId);

  const selectedBook = GRIMOIRE_BOOKS.find(b => b.id === selectedBookId) || GRIMOIRE_BOOKS[0];
  const selectedProgress = getBookProgress(studentId, selectedBookId);

  const isDark = activeTheme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      {/* 典藏館彈窗容器 */}
      <div
        className={`relative w-full max-w-5xl rounded-3xl border-2 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-scaleUp transition-colors duration-300 ${
          isDark
            ? 'bg-slate-950/95 border-amber-500/40 text-white shadow-[0_0_50px_rgba(245,158,11,0.25)]'
            : 'bg-stone-100/95 border-amber-700/40 text-stone-900 shadow-[0_0_50px_rgba(217,119,6,0.25)]'
        }`}
      >
        {/* 背景裝飾紋理 */}
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          <img
            src={isDark ? '/assets/backpack/curio_slate.webp' : '/assets/backpack/curio_parchment.webp'}
            alt=""
            className="w-full h-full object-cover filter brightness-[0.7] blur-sm scale-105"
          />
        </div>

        {/* ── 頂部 HUD 標題與八星階級列 ── */}
        <header className="relative z-10 px-4 sm:px-6 py-3 border-b flex items-center justify-between shrink-0 border-amber-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-md border ${
              isDark ? 'bg-amber-950/80 border-amber-400/40 text-amber-300' : 'bg-amber-100 border-amber-600/40 text-amber-800'
            }`}>
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-heading font-black tracking-wide">
                  神山八冊秘典典藏館
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 shadow-sm">
                  {summary.masteredStars} / 8 星大師
                </span>
              </div>
              <p className={`text-[11px] font-bold flex items-center gap-1.5 ${
                isDark ? 'text-amber-200/80' : 'text-stone-600'
              }`}>
                <span>持有者：{studentName}</span>
                <span>•</span>
                <span className="text-amber-400 font-black">【{summary.titleInfo.name}】</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 風格切換 (黑曜石板 / 象牙羊皮) */}
            <button
              type="button"
              onClick={() => {
                soundEngine.click();
                setActiveTheme(prev => prev === 'dark' ? 'parchment' : 'dark');
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 border transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-900 border-white/20 text-amber-300 hover:bg-slate-800'
                  : 'bg-white border-stone-300 text-amber-900 hover:bg-stone-50'
              }`}
              title="切換典藏館展台風格"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isDark ? '墨岩' : '羊皮'}</span>
            </button>

            {/* 關閉按鈕 */}
            <button
              onClick={() => {
                soundEngine.click();
                onClose();
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 text-white transition-all cursor-pointer border border-white/15"
              title="關閉典藏館"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ── 核心內容區 (上部：8 本古籍展示台；下部：選取冊次之 10 大模式星度進程) ── */}
        <div className="relative z-10 flex-1 min-h-0 overflow-y-auto p-3 sm:p-5 flex flex-col gap-4">
          
          {/* ════ 1. 八星大宗師星盤橫幅 ════ */}
          <div className={`p-3 sm:p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner ${
            isDark
              ? 'bg-slate-900/80 border-amber-500/30'
              : 'bg-amber-50/90 border-amber-600/30'
          }`}>
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black tracking-wide flex items-center gap-1.5">
                  <span>八星大宗師全彩試煉進度：</span>
                  <span className="text-amber-500 font-mono">
                    {summary.totalMasteredModes} / {summary.maxModes} 項全冊模式三星精通
                  </span>
                </div>
                <p className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                  每冊全冊範圍三星通過 10 款遊戲模式，即可點亮 100% 全彩古籍並永久解鎖 1 顆金色星盤神印！
                </p>
              </div>
            </div>

            {/* 8 顆實體大星盤徽章 */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm ${
              isDark ? 'bg-black/60 border-amber-400/30' : 'bg-white border-amber-700/30'
            }`}>
              {Array.from({ length: 8 }).map((_, i) => {
                const isLit = i < summary.masteredStars;
                return (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isLit
                        ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-stone-950 shadow-[0_0_10px_rgba(251,191,36,0.8)] scale-110'
                        : isDark
                        ? 'bg-slate-800 text-slate-500 border border-white/5'
                        : 'bg-stone-200 text-stone-400 border border-stone-300'
                    }`}
                    title={`第 ${i + 1} 冊星位 (${isLit ? '已點亮' : '未解鎖'})`}
                  >
                    ★
                  </div>
                );
              })}
            </div>
          </div>

          {/* ════ 2. 八本古老秘典展台 (4 欄 x 2 列卡片網格) ════ */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-black tracking-wide flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>八冊神山古老教科書秘典（點擊切換查看詳細模式）</span>
              </span>
              <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                點選書冊即可在下方檢視 10 大模式進度
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
              {GRIMOIRE_BOOKS.map((book) => {
                const prog = getBookProgress(studentId, book.id);
                const isSelected = book.id === selectedBookId;
                const isMastered = prog.isMastered;

                return (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => {
                      soundEngine.click();
                      setSelectedBookId(book.id);
                    }}
                    className={`group relative p-2.5 sm:p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-between text-center overflow-hidden ${
                      isSelected
                        ? isDark
                          ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_20px_rgba(251,191,36,0.35)] scale-[1.02]'
                          : 'border-amber-600 bg-amber-100/70 shadow-lg scale-[1.02]'
                        : isDark
                        ? 'border-white/10 bg-slate-900/70 hover:border-white/20'
                        : 'border-stone-300 bg-white/70 hover:border-stone-400'
                    }`}
                  >
                    {/* 頂部標籤：羅馬字與星標 */}
                    <div className="w-full flex items-center justify-between mb-1.5 z-10">
                      <span className="font-mono text-[10px] font-black px-1.5 py-0.2 rounded-md bg-black/50 text-amber-300 border border-amber-400/30">
                        {book.roman}
                      </span>
                      {isMastered ? (
                        <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-amber-500 text-stone-950 shadow-sm flex items-center gap-0.5 animate-pulse">
                          <span>★</span>
                          <span>滿星</span>
                        </span>
                      ) : (
                        <span className={`text-[10px] font-mono font-bold ${
                          isDark ? 'text-slate-400' : 'text-stone-500'
                        }`}>
                          {prog.percent}%
                        </span>
                      )}
                    </div>

                    {/* 書籍本體插畫 (具備灰階漸進解鎖遮罩效果) */}
                    <div className="relative w-28 h-32 sm:w-32 sm:h-36 my-1 flex items-center justify-center">
                      {/* 底層：完整灰階暗調版本 */}
                      <img
                        src={book.coverImage}
                        alt={book.nameZh}
                        className="w-full h-full object-contain filter grayscale contrast-90 brightness-[0.45] pointer-events-none select-none transition-all duration-500"
                      />

                      {/* 上層：依據百分比揭示之全彩原貌 (透過 CSS clip-path 裁切遮罩) */}
                      <div
                        className="absolute inset-0 overflow-hidden pointer-events-none transition-all duration-700"
                        style={{
                          clipPath: `inset(0 ${100 - prog.percent}% 0 0)`
                        }}
                      >
                        <img
                          src={book.coverImage}
                          alt=""
                          className={`w-full h-full object-contain filter contrast-110 drop-shadow-lg ${
                            isMastered ? 'brightness-110 animate-avatar-breathe' : ''
                          }`}
                        />
                      </div>

                      {/* 若 100% 精通，綻放金光 */}
                      {isMastered && (
                        <div className="absolute inset-0 pointer-events-none rounded-xl ring-2 ring-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.6)] animate-pulse" />
                      )}
                    </div>

                    {/* 書籍名稱與圖騰標記 */}
                    <div className="w-full mt-1.5 z-10">
                      <h4 className="text-xs font-black font-heading truncate">
                        {book.nameZh}
                      </h4>
                      <p className={`text-[10px] font-bold truncate ${
                        isDark ? 'text-slate-400' : 'text-stone-500'
                      }`}>
                        圖騰：{book.totem}
                      </p>
                    </div>

                    {/* 解鎖進度條 */}
                    <div className="w-full mt-2 h-1.5 rounded-full bg-black/40 overflow-hidden border border-white/10">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isMastered
                            ? 'bg-gradient-to-r from-amber-400 to-yellow-300'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${prog.percent}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ════ 3. 選取書冊之「10 大遊戲模式星度完成清單」 ════ */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isDark
              ? 'bg-slate-900/90 border-white/10'
              : 'bg-white border-stone-300 shadow-sm'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{selectedBook.symbol}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm sm:text-base font-black font-heading">
                      【{selectedBook.roman} • {selectedBook.nameZh}】全冊挑戰星度
                    </h4>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      已達成 {selectedProgress.threeStarCount} / 10 款三星
                    </span>
                  </div>
                  <p className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                    {selectedBook.description}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-black text-amber-400">
                  當前彩色解鎖度：{selectedProgress.percent}%
                </span>
              </div>
            </div>

            {/* 10 款遊戲模式卡片清單 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
              {GRIMOIRE_GAME_MODES.map((mode) => {
                const starVal = selectedProgress.modesStatus[mode.id] || 0;
                const isCleared = starVal >= 3;

                return (
                  <div
                    key={mode.id}
                    className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                      isCleared
                        ? isDark
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                          : 'bg-emerald-50 border-emerald-500/50 text-emerald-900'
                        : isDark
                        ? 'bg-slate-950/60 border-white/10 text-slate-300'
                        : 'bg-stone-50 border-stone-200 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-base">{mode.icon}</span>
                      <div className="flex items-center gap-0.5 text-xs">
                        {Array.from({ length: 3 }).map((_, sIdx) => (
                          <span
                            key={sIdx}
                            className={sIdx < starVal ? 'text-amber-400' : 'text-slate-600'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="my-1">
                      <div className="text-xs font-black truncate">{mode.nameZh}</div>
                      <div className="text-[10px] font-bold opacity-75">
                        {isCleared ? '✅ 已解鎖 10% 彩圖' : '未三星 (未解鎖)'}
                      </div>
                    </div>

                    {onLaunchGame && (
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.click();
                          onClose();
                          onLaunchGame({ modeId: mode.id, bookId: selectedBook.id });
                        }}
                        className={`mt-2 w-full py-1 rounded-lg text-[11px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          isCleared
                            ? 'bg-emerald-800/60 hover:bg-emerald-700 text-emerald-100'
                            : 'bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-sm'
                        }`}
                      >
                        <Play className="w-3 h-3" />
                        <span>{isCleared ? '再戰練習' : '前往挑戰'}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ── 底部快捷條 ── */}
        <footer className="relative z-10 px-4 py-2.5 border-t border-white/10 flex items-center justify-between shrink-0 text-xs font-bold text-slate-400 bg-black/30">
          <span>大武山神聖守護法則 • 永久綁定紀錄 • 達成 8 星晉級最高榮譽大宗師</span>
          <button
            onClick={() => {
              soundEngine.click();
              onClose();
            }}
            className="px-4 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black cursor-pointer transition-all"
          >
            完成檢視返回通行證
          </button>
        </footer>

      </div>
    </div>
  );
};
