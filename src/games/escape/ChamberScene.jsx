import React from 'react';
import { Sparkles, Key, CheckCircle2, Lock, Volume2, Scroll, Settings2, DoorClosed, VolumeX, Music } from 'lucide-react';
import { soundEngine, bgmManager } from '../../services/audio';

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
  const roomSolvedCount = puzzles.filter(p => solvedPuzzleIds.has(p.id)).length;

  // 根據題目類型分派適配的圖示與相對位置
  const getHotspotConfig = (puzzle, idx) => {
    if (puzzle.type === 'listening') {
      return { icon: Volume2, top: '45%', left: '26%', color: 'emerald' };
    }
    if (puzzle.type === 'meaning') {
      return { icon: Scroll, top: '65%', left: '42%', color: 'amber' };
    }
    if (puzzle.type === 'spelling') {
      return { icon: Settings2, top: '70%', left: '50%', color: 'indigo' };
    }
    if (puzzle.type === 'pairing') {
      return { icon: DoorClosed, top: '48%', left: '76%', color: 'rose' };
    }
    // 預設平均分佈兩側
    return {
      icon: Key,
      top: '55%',
      left: idx === 0 ? '30%' : '70%',
      color: 'amber'
    };
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-screen overflow-hidden flex flex-col justify-between select-none bg-slate-950">
      {/* ── 1. 底層：當前房間的高清吉卜力手繪全景圖 ── */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 pointer-events-none"
        style={{ backgroundImage: `url(${currentChapter.bg})` }}
      />

      {/* ── 2. 光影層：暗角暗化、火把微光與漂浮金粉光芒 ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/65 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40" />

      {/* 浮動微粒塵埃光暈 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/40 blur-[1px] absolute top-1/4 left-1/3 animate-ping" />
        <div className="w-3 h-3 rounded-full bg-emerald-400/30 blur-[2px] absolute top-1/2 left-1/5 animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-indigo-300/40 blur-[1px] absolute top-1/3 right-1/4 animate-bounce" />
      </div>

      {/* ── 3. 頂部儀表板 (HUD: 進度、時間、生命值、BGM開關、提示透鏡、退出) ── */}
      <header className="relative z-20 w-full p-2.5 sm:p-4 flex items-center justify-between gap-2 sm:gap-3 bg-slate-900/70 backdrop-blur-md border-b border-white/10 shadow-lg">
        {/* 左側：放棄退出與當前房間進度 */}
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

          {/* 房間進度指示徽章 */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-black/50 border border-white/15">
            <span className="text-sm sm:text-base">{currentChapter.runeIcon}</span>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-amber-400 leading-tight">
                房間 {chapterIndex + 1} / {totalChapters}
              </span>
              <span className="text-xs sm:text-sm font-black text-white font-heading leading-tight truncate max-w-[130px] sm:max-w-none">
                {currentChapter.titleZh}
              </span>
            </div>
          </div>
        </div>

        {/* 中間：逃脫累計計時器 */}
        <div className="px-3.5 py-1 sm:py-1.5 rounded-2xl bg-black/60 border border-amber-500/30 shadow-inner flex items-center gap-1.5 sm:gap-2">
          <span className="text-[11px] font-black text-slate-400">⏱️ 用時</span>
          <span className="text-base sm:text-xl font-black font-mono text-amber-400 tracking-widest">
            {formatTime(timeElapsed)}
          </span>
        </div>

        {/* 右側：愛心、BGM開關、透鏡提示 */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* BGM 音樂切換鈕 */}
          <button
            onClick={onToggleBgm}
            className={`p-1.5 sm:p-2 rounded-xl border transition-all active:scale-95 cursor-pointer ${
              isBgmMuted
                ? 'bg-slate-800/60 text-slate-500 border-slate-700'
                : 'bg-indigo-500/30 text-indigo-300 border-indigo-400/50 shadow-sm shadow-indigo-500/20'
            }`}
            title={isBgmMuted ? '開啟場景配樂' : '關閉配樂'}
          >
            {isBgmMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Music className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />}
          </button>

          {/* 愛心生命值 */}
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
            title="使用鷹眼透鏡排除干擾項"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>透鏡 ({hintCount})</span>
          </button>
        </div>
      </header>

      {/* ── 4. 中層：密室空間與本房間可互動機關熱區 (Hotspots) ── */}
      <main className="relative flex-1 w-full max-w-5xl mx-auto h-full z-10 flex items-center justify-center p-4">
        {puzzles.map((puzzle, idx) => {
          const isSolved = solvedPuzzleIds.has(puzzle.id);
          const config = getHotspotConfig(puzzle, idx);
          const Icon = config.icon;

          return (
            <div
              key={puzzle.id}
              style={{ top: config.top, left: config.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              onClick={() => {
                soundEngine.click();
                onSelectStation(puzzle.id);
              }}
            >
              {/* 外圈脈衝發光光環 */}
              <div
                className={`absolute -inset-3 sm:-inset-4 rounded-3xl blur-md transition-all duration-300 ${
                  isSolved
                    ? 'bg-emerald-500/40 group-hover:bg-emerald-500/60 animate-pulse'
                    : 'bg-amber-400/35 group-hover:bg-amber-400/65 animate-pulse'
                }`}
              />

              {/* 機關熱區實體徽章按鍵 (iPad 56px+ 友善熱區) */}
              <div
                className={`relative px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl border-2 sm:border-3 backdrop-blur-md shadow-2xl flex items-center gap-2.5 transition-all duration-200 group-hover:scale-110 group-active:scale-95 ${
                  isSolved
                    ? 'bg-emerald-950/85 border-emerald-400 text-emerald-200'
                    : 'bg-slate-900/85 border-amber-400/90 text-amber-200 hover:border-amber-300'
                }`}
              >
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-md ${
                    isSolved
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-500 text-slate-950 font-black'
                  }`}
                >
                  {isSolved ? (
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </div>

                <div className="text-left hidden xs:block">
                  <div className="text-[10px] sm:text-xs font-bold text-slate-400">
                    {puzzle.stationName}
                  </div>
                  <div className="text-xs sm:text-sm font-black font-heading tracking-wide">
                    {puzzle.titleZh}
                  </div>
                </div>

                {isSolved ? (
                  <span className="text-sm">🗝️</span>
                ) : (
                  <Lock className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                )}
              </div>
            </div>
          );
        })}
      </main>

      {/* ── 5. 底欄：當前房間解鎖鑰匙與石門進度 ── */}
      <footer className="relative z-20 w-full p-3 sm:p-4 bg-slate-900/85 backdrop-blur-md border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 max-w-3xl mx-auto rounded-t-3xl shadow-2xl">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-300">
          <span>🗝️ 本室石門機關封印：</span>
          <span className="text-amber-400 font-bold">
            {roomSolvedCount} / {puzzles.length} 個解開
          </span>
        </div>

        {/* 當前房間 2 道機關的印記狀態 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {puzzles.map((p) => {
            const isDone = solvedPuzzleIds.has(p.id);
            return (
              <div
                key={p.id}
                onClick={() => {
                  soundEngine.click();
                  onSelectStation(p.id);
                }}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-black transition-all cursor-pointer ${
                  isDone
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 scale-105 shadow-sm shadow-emerald-500/30'
                    : 'bg-black/40 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                <span>{p.rewardItemIcon}</span>
                <span>{p.rewardItemZh}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-600" />
                )}
              </div>
            );
          })}
        </div>
      </footer>
    </div>
  );
};
