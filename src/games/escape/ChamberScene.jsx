import React from 'react';
import { Sparkles, Key, CheckCircle2, VolumeX, Music } from 'lucide-react';
import { soundEngine } from '../../services/audio';
import { ChamberAmbience } from './ChamberAmbience';

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
      {/* 內嵌專屬錯落明滅呼吸光暈動畫 (最暗保持低亮度0.12，進關時保持全最暗，滑鼠hover平滑漸變放大) */}
      <style>{`
        @keyframes subtleHaloBreath {
          0% {
            opacity: 0.12;
            transform: scale(0.92);
          }
          50% {
            opacity: 0.46;
            transform: scale(1.08);
          }
          100% {
            opacity: 0.12;
            transform: scale(0.92);
          }
        }
        .halo-breath-base {
          opacity: 0.12;
          transform: scale(0.92);
          animation: subtleHaloBreath var(--anim-duration, 5s) ease-in-out infinite both;
          animation-delay: var(--anim-delay, 0s);
        }
        .halo-hover-illumination {
          opacity: 0;
          transform: scale(0.96);
          transition: opacity 0.45s cubic-bezier(0.2, 0.8, 0.3, 1),
                      transform 0.45s cubic-bezier(0.2, 0.8, 0.3, 1),
                      box-shadow 0.45s ease-out;
        }
        .group:hover .halo-hover-illumination,
        .group:active .halo-hover-illumination {
          opacity: 0.88;
          transform: scale(1.18);
        }
      `}</style>

      {/* ── 1. 底層：純淨高清全景手繪背景 (無任何刻意生硬的大圖示) ── */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 pointer-events-none"
        style={{ backgroundImage: `url(${currentChapter.bg})` }}
      />

      {/* ── 2. 環境彩蛋層：單一主題微小沉浸彩蛋 (在太空背景之上，但在建物及窗框本體之下) ── */}
      <ChamberAmbience
        themeId={currentChapter.themeId}
        isMuted={isBgmMuted}
      />

      {/* ── 2.1 建物與窗框前置層 (星象祭壇第三室專屬：石牆、拱門與提燈遮罩位於流星之上，流星絕不畫上牆) ── */}
      {(currentChapter.themeId === 'observatory' || currentChapter.id === 'temple_3') && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 pointer-events-none z-[11]"
          style={{ backgroundImage: 'url(/assets/escape/bg_observatory_foreground.webp)' }}
        />
      )}

      {/* ── 2.5 光影層：暗角與環境微光 ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/65 pointer-events-none z-[12]" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40 z-[12]" />

      {/* ── 3. 頂部儀表板 (HUD) ── */}
      <header className="relative z-20 w-full p-2.5 sm:p-4 flex items-center justify-between gap-2 sm:gap-3 bg-slate-900/75 backdrop-blur-md border-b border-white/10 shadow-lg">
        {/* 左側：退回密室大廳與當前房間指示 */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              soundEngine.click();
              onQuit();
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs sm:text-sm font-black border border-slate-700 transition-all active:scale-95 cursor-pointer flex items-center gap-1"
            title="退回密室逃脫大廳"
          >
            <span>← 密室大廳</span>
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

          {/* 三大古老符印蒐集進度 */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/50 border border-white/10">
            <span className="text-[10px] font-bold text-slate-400">符印：</span>
            {['🦉 智慧之符', '⭐ 蒼穹之鑰', '💎 守護之印'].map((rune, idx) => (
              <span
                key={idx}
                className={`text-[11px] px-2 py-0.5 rounded-lg font-black transition-all ${
                  idx < chapterIndex
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-400/40 shadow-sm'
                    : idx === chapterIndex
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 animate-pulse'
                    : 'opacity-30 grayscale text-slate-500'
                }`}
              >
                {rune}
              </span>
            ))}
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

      {/* ── 4. 中層：5 處隨機生成不重疊熱區（明滅至0，錯落忽明忽暗） ── */}
      <main className="relative flex-1 w-full max-w-6xl mx-auto h-full z-10">
        {puzzles.map((puzzle) => {
          const isSolved = solvedPuzzleIds.has(puzzle.id);
          const isKey = puzzle.isKeyRelic;

          // 關鍵點：淡淡金色光暈；迷途點：淡淡白黃光暈
          const haloRingStyle = isKey
            ? 'border-2 border-amber-400/50 bg-amber-400/15 shadow-[0_0_25px_rgba(251,191,36,0.45)]'
            : 'border-2 border-slate-100/40 bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.3)]';

          return (
            <div
              key={puzzle.id}
              style={{
                top: puzzle.top,
                left: puzzle.left,
                '--anim-delay': puzzle.animDelay || '0s',
                '--anim-duration': puzzle.animDuration || '5s'
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group p-5"
              onClick={() => {
                soundEngine.click();
                onSelectStation(puzzle.id);
              }}
              title={isSolved ? `${puzzle.stationName} (已解開)` : '點擊調查此處遺跡'}
            >
              {/* 雙層光暈：底層獨立呼吸（進關全最暗，永不斷層），頂層Hover時平滑升亮微幅放大 */}
              {!isSolved ? (
                <div className="relative w-14 h-14 sm:w-18 sm:h-18 flex items-center justify-center pointer-events-none">
                  {/* 底層：持續背景幽微呼吸光暈 (最暗0.12 ~ 最亮0.46，各走各的頻率與延遲，進關時皆為初始最暗) */}
                  <div
                    style={{
                      '--anim-delay': puzzle.animDelay || '0s',
                      '--anim-duration': puzzle.animDuration || '5s'
                    }}
                    className={`absolute inset-0 rounded-full ${haloRingStyle} halo-breath-base`}
                  />

                  {/* 頂層：滑鼠 Hover / 觸控喚醒微光層 (平時 opacity:0，滑入時從目前亮度平滑漸亮至0.88並擴大1.18倍，移開平滑漸暗回呼吸) */}
                  <div
                    className={`absolute inset-0 rounded-full ${
                      isKey
                        ? 'border-2 border-amber-300 bg-amber-400/35 shadow-[0_0_36px_rgba(251,191,36,0.85)]'
                        : 'border-2 border-slate-100 bg-white/25 shadow-[0_0_30px_rgba(255,255,255,0.75)]'
                    } halo-hover-illumination`}
                  />
                </div>
              ) : (
                /* 已解開的熱區：留下微光印記 */
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-black/60 border border-emerald-400/60 text-emerald-300 flex items-center justify-center shadow-lg shadow-emerald-500/30 scale-95 transition-transform group-hover:scale-110">
                  <span className="text-sm sm:text-base">{puzzle.rewardItemIcon}</span>
                </div>
              )}
            </div>
          );
        })}
      </main>

      {/* ── 5. 底欄：尋找 3 個關鍵逃脫印記進度指示條 ── */}
      <footer className="relative z-20 w-full p-3 sm:p-4 bg-slate-900/85 backdrop-blur-md border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 max-w-2xl mx-auto rounded-t-3xl shadow-2xl">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-300">
          <span>🗝️ 本室石門關鍵印記：</span>
          <span className="text-amber-400 font-bold">
            {keySolvedCount} / 3 個尋獲
          </span>
          <span className="text-[11px] font-normal text-slate-400 hidden xs:inline">
            (找出 3 個散發淡金微光的關鍵點)
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
                <span>印記 #{slotIdx + 1}</span>
              </div>
            );
          })}
        </div>
      </footer>
    </div>
  );
};
