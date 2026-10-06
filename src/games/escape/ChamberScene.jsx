import React from 'react';
import { Sparkles, Key, CheckCircle2, Lock, Volume2, Scroll, Settings2, DoorClosed, VolumeX, Music, HelpCircle } from 'lucide-react';
import { soundEngine } from '../../services/audio';

export const ChamberScene = ({
  currentChapter,
  chapterIndex = 0,
  totalChapters = 3,
  solvedPuzzleIds = new Set(),
  onSelectStation,
  lives = 3,
  timeElapsed = 0,
  hintCount = 2,
  onUseHint,
  onQuit,
  isBgmMuted = false,
  onToggleBgm
}) => {
  const puzzles = currentChapter?.puzzles || [];
  // 計算已解鎖的關鍵逃脫印記數量 (目標 3 個)
  const keySolvedCount = puzzles.filter(p => p.isKeyRelic && solvedPuzzleIds.has(p.id)).length;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-screen overflow-hidden flex flex-col justify-between select-none bg-slate-950">
      {/* ── 1. 底層：純淨高清全景手繪背景 (無任何刻意生硬的大圖示) ── */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 pointer-events-none"
        style={{ backgroundImage: `url(${currentChapter.bg})` }}
      />

      {/* ── 2. 光影層：暗角與環境金粉微光 ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/65 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40" />

      {/* ── 3. 頂部儀表板 (HUD) ── */}
      <header className="relative z-20 w-full p-2.5 sm:p-4 flex items-center justify-between gap-2 sm:gap-3 bg-slate-900/75 backdrop-blur-md border-b border-white/10 shadow-lg">
        {/* 左側：退出與當前房間指示 */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              soundEngine.click();
              onQuit();
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs sm:text-sm font-black border border-slate-700 transition-all active:scale-95 cursor-pointer"
          >
            ← 退出
          </button>

          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-black/50 border border-white/15">
            <span className="text-sm sm:text-base">{currentChapter.runeIcon}</span>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-amber-400 leading-tight">
                第 {chapterIndex + 1} 室 / 共 {totalChapters} 室
              </span>
              <span className="text-xs sm:text-sm font-black text-white font-heading leading-tight truncate max-w-[130px] sm:max-w-none">
                {currentChapter.titleZh}
              </span>
            </div>
          </div>
        </div>

        {/* 中間：逃脫計時器 */}
        <div className="px-3.5 py-1 sm:py-1.5 rounded-2xl bg-black/60 border border-amber-500/30 shadow-inner flex items-center gap-1.5 sm:gap-2">
          <span className="text-[11px] font-black text-slate-400">⏱️ 用時</span>
          <span className="text-base sm:text-xl font-black font-mono text-amber-400 tracking-widest">
            {formatTime(timeElapsed)}
          </span>
        </div>

        {/* 右側：愛心、合成BGM開關、提示透鏡 */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Web Audio 專屬環境音樂切換鈕 */}
          <button
            onClick={onToggleBgm}
            className={`p-1.5 sm:p-2 rounded-xl border transition-all active:scale-95 cursor-pointer ${
              isBgmMuted
                ? 'bg-slate-800/60 text-slate-500 border-slate-700'
                : 'bg-amber-500/30 text-amber-300 border-amber-400/50 shadow-sm shadow-amber-500/20'
            }`}
            title={isBgmMuted ? '開啟神秘環境音' : '靜音'}
          >
            {isBgmMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Music className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />}
          </button>

          {/* 生命值 */}
          <div className="hidden xs:flex items-center gap-0.5 px-2.5 py-1 rounded-xl bg-black/50 border border-rose-500/20 text-rose-500 font-black text-xs sm:text-sm">
            {Array.from({ length: 3 }).map((_, idx) => (
              <span key={idx} className={idx < lives ? 'opacity-100 scale-100' : 'opacity-20 grayscale'}>
                ❤️
              </span>
            ))}
          </div>

          {/* 鷹眼透鏡提示道具 */}
          <button
            onClick={onUseHint}
            disabled={hintCount <= 0}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1 text-xs sm:text-sm font-black transition-all active:scale-95 shadow-md border cursor-pointer ${
              hintCount > 0
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300'
                : 'bg-slate-800/60 text-slate-500 border-slate-700 cursor-not-allowed'
            }`}
            title="透鏡提示"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>透鏡 ({hintCount})</span>
          </button>
        </div>
      </header>

      {/* ── 4. 中層：5 處自然融入場景的神秘隱藏熱區 (無圖示，淡淡呼吸微光圈) ── */}
      <main className="relative flex-1 w-full max-w-6xl mx-auto h-full z-10">
        {puzzles.map((puzzle, idx) => {
          const isSolved = solvedPuzzleIds.has(puzzle.id);
          const isKey = puzzle.isKeyRelic;

          // 呼吸微光樣式配置：
          // 關鍵核心點 (isKeyRelic)：淡淡金黃色呼吸光暈 (淡金忽明忽暗)
          // 迷途干擾點 (!isKeyRelic)：淡淡乳白色/淡黃呼吸光暈 (淡白忽明忽暗)
          const haloRingStyle = isKey
            ? 'border border-amber-400/40 bg-amber-400/10 shadow-[0_0_20px_rgba(251,191,36,0.35)]'
            : 'border border-slate-200/35 bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.25)]';

          return (
            <div
              key={puzzle.id}
              style={{ top: puzzle.top, left: puzzle.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group p-4"
              onClick={() => {
                soundEngine.click();
                onSelectStation(puzzle.id);
              }}
              title={isSolved ? `${puzzle.stationName} (已解開)` : '點擊調查此處遺跡'}
            >
              {/* 自然呼吸微光圈 (未解開時忽明忽暗，滑鼠 Hover 時顯露加強) */}
              {!isSolved ? (
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full transition-all duration-300 ${haloRingStyle} animate-pulse group-hover:scale-125 group-hover:opacity-100 opacity-40 group-active:scale-95`}
                />
              ) : (
                /* 已解開的熱區：留下淡淡發光的精緻印記 */
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-black/60 border border-emerald-400/60 text-emerald-300 flex items-center justify-center shadow-lg shadow-emerald-500/30 scale-95 transition-transform group-hover:scale-110">
                  <span className="text-sm sm:text-base">{puzzle.rewardItemIcon}</span>
                </div>
              )}
            </div>
          );
        })}
      </main>

      {/* ── 5. 底欄：尋找 3 個關鍵逃脫核心進度指示條 ── */}
      <footer className="relative z-20 w-full p-3 sm:p-4 bg-slate-900/85 backdrop-blur-md border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 max-w-2xl mx-auto rounded-t-3xl shadow-2xl">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-300">
          <span>🗝️ 本室石門關鍵印記：</span>
          <span className="text-amber-400 font-bold">
            {keySolvedCount} / 3 個尋獲
          </span>
          <span className="text-[11px] font-normal text-slate-400 hidden xs:inline">
            (需解開 3 個散發淡金微光的關鍵點)
          </span>
        </div>

        {/* 3 個關鍵逃脫核心插槽 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {Array.from({ length: 3 }).map((_, slotIdx) => {
            const isFilled = slotIdx < keySolvedCount;
            return (
              <div
                key={slotIdx}
                className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-black transition-all ${
                  isFilled
                    ? 'bg-amber-500/25 border-amber-400 text-amber-300 scale-105 shadow-md shadow-amber-500/30'
                    : 'bg-black/50 border-slate-700 text-slate-600'
                }`}
              >
                <span>{isFilled ? '🗝️' : '⚪'}</span>
                <span>核心印記 #{slotIdx + 1}</span>
              </div>
            );
          })}
        </div>
      </footer>
    </div>
  );
};
