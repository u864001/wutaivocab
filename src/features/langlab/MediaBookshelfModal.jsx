import React, { useState } from 'react';
import { getBooksSummary } from '../../services/hereWeGoQuestionBank.js';
import { soundEngine } from '../../services/audio.js';
import { X, BookOpen, Disc, CheckCircle2, Sparkles, ChevronRight } from 'lucide-react';

const GRADE_SUBTITLES = {
  1: '國小三年級上學期 (初階發音與問候)',
  2: '國小三年級下學期 (動物、能力與職業)',
  3: '國小四年級上學期 (天氣、感覺與食物)',
  4: '國小四年級下學期 (時間、進行式與位置)',
  5: '國小五年級上學期 (星期、作息與去處)',
  6: '國小五年級下學期 (症狀、餐點與所有格)',
  7: '國小六年級上學期 (國家、交通與休閒)',
  8: '國小六年級下學期 (過去式、購物與季節)',
  9: '🎓 國一先修／國中銜接 (過去式進階、世博建築與節慶)'
};

const BOOK_PALETTES = [
  'from-amber-600 to-orange-700 border-amber-400',
  'from-emerald-600 to-teal-700 border-emerald-400',
  'from-blue-600 to-indigo-700 border-blue-400',
  'from-purple-600 to-violet-700 border-purple-400',
  'from-rose-600 to-pink-700 border-rose-400',
  'from-cyan-600 to-sky-700 border-cyan-400',
  'from-lime-600 to-emerald-700 border-lime-400',
  'from-fuchsia-600 to-purple-700 border-fuchsia-400',
  'from-amber-700 to-stone-800 border-amber-500'
];

export const MediaBookshelfModal = ({
  currentBook = 1,
  currentUnitId = null,
  onSelectUnit,
  onClose
}) => {
  const books = getBooksSummary();
  const [selectedBookNum, setSelectedBookNum] = useState(currentBook || 1);

  const activeBook = books.find(b => b.book === selectedBookNum) || books[0];

  const handleBookClick = (bookNum) => {
    soundEngine.click();
    setSelectedBookNum(bookNum);
  };

  const handleUnitSelect = (unit) => {
    soundEngine.correct();
    if (onSelectUnit) {
      onSelectUnit(selectedBookNum, unit.unitId, unit.title);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* 典雅原木影音櫃主體 */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-stone-900 via-amber-950/90 to-stone-950 border-4 border-amber-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white">
        
        {/* 頂部櫃頂裝飾條與關閉按鈕 */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-amber-900 via-stone-800 to-amber-900 border-b-2 border-amber-600/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 text-xl border border-amber-500/30">
              📚
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black font-heading text-amber-200">
                典雅原木影音書籍櫃 • 冊次與單元選課
              </h3>
              <p className="text-xs text-amber-300/70 font-bold hidden sm:block">
                收納翰林 Here We Go 1～9 冊官方課本全文、對話問答與核心句型
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.click();
              onClose();
            }}
            className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer active:scale-95 transition-all"
            title="關閉書籍櫃"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 內容區：左側選冊 (1~9冊精裝盒) + 右側單元抽屜 (卡帶/CD) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          
          {/* 左欄：1～9 冊精裝典藏盒 */}
          <div className="w-full md:w-5/12 border-b-2 md:border-b-0 md:border-r-2 border-amber-800/60 p-3 sm:p-4 overflow-y-auto space-y-2 bg-stone-950/50 shrink-0">
            <div className="text-[11px] font-black text-amber-400/80 tracking-wider mb-2 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>點選課本冊次 (Book 1 ～ 9)：</span>
            </div>

            {books.map((b, idx) => {
              const isSelected = selectedBookNum === b.book;
              const palette = BOOK_PALETTES[idx % BOOK_PALETTES.length];

              return (
                <button
                  key={b.book}
                  type="button"
                  onClick={() => handleBookClick(b.book)}
                  className={`w-full p-2.5 sm:p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-2.5 cursor-pointer active:scale-98 ${
                    isSelected
                      ? `bg-gradient-to-r ${palette} shadow-lg ring-2 ring-amber-300/50 scale-[1.01]`
                      : 'bg-stone-900/80 border-stone-800 hover:border-amber-600/50 hover:bg-stone-850'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-black/30 border border-white/20 flex items-center justify-center font-black font-mono text-sm shrink-0 text-amber-200">
                      B{b.book}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-black truncate font-heading text-white">
                          {b.title}
                        </h4>
                        {b.book === 9 && (
                          <span className="px-1.5 py-0.2 rounded-md text-[9px] font-black bg-rose-600 text-white border border-rose-400 shrink-0 shadow-xs">
                            國一先修
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-white/70 truncate">
                        {GRADE_SUBTITLES[b.book] || '官方精選教材'}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-black/40 text-amber-300 shrink-0 border border-white/10">
                    {b.units.length} 單元
                  </span>
                </button>
              );
            })}
          </div>

          {/* 右欄：單元抽屜清單 (立體卡帶抽屜) */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-stone-900/60">
            <div className="mb-4 pb-2 border-b border-amber-700/40 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-black text-amber-400">
                  第 {activeBook.book} 冊單元目錄
                </span>
                <h4 className="text-base sm:text-lg font-black text-white font-heading">
                  {GRADE_SUBTITLES[activeBook.book]}
                </h4>
              </div>
              <span className="text-xs text-stone-400">
                點選單元立即載入教室
              </span>
            </div>

            <div className="space-y-2.5">
              {activeBook.units.map((unit) => {
                const isCurrentActive = selectedBookNum === currentBook && unit.unitId === currentUnitId;

                return (
                  <button
                    key={unit.unitId}
                    type="button"
                    onClick={() => handleUnitSelect(unit)}
                    className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-3 cursor-pointer group active:scale-98 ${
                      isCurrentActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-700 border-emerald-400 ring-2 ring-emerald-300 shadow-lg'
                        : 'bg-stone-850/90 border-amber-900/60 hover:border-amber-400/80 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30 group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-black transition-all">
                        <Disc className="w-5 h-5 animate-spin-slow" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-sm sm:text-base font-black text-white group-hover:text-amber-200 transition-colors font-heading truncate">
                          {unit.title}
                        </h5>
                        <p className="text-xs text-stone-400 mt-0.5">
                          收錄 {unit.dialogueCount} 組情境會話 • {unit.vocabCount} 個核心字彙
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isCurrentActive ? (
                        <span className="px-2.5 py-1 rounded-xl bg-white/20 text-emerald-200 text-xs font-black flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>進行中</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-xl bg-amber-600/30 text-amber-300 group-hover:bg-amber-500 group-hover:text-black text-xs font-black transition-all flex items-center gap-1">
                          <span>開始</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 底部提醒 */}
        <div className="px-5 py-2.5 bg-black/60 border-t border-amber-800/40 text-center text-xs text-amber-300/80 flex items-center justify-center gap-2 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>選定單元後自動載入視聽教室中央黑板與操作台，享受 100% 官方教材原音體驗！</span>
        </div>
      </div>
    </div>
  );
};
