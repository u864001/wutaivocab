import React from 'react';
import { Sparkles, Key, CheckCircle2, Lock, Volume2, Scroll, Settings2, DoorClosed, HelpCircle } from 'lucide-react';
import { soundEngine } from '../../services/audio';

export const ChamberScene = ({
  theme,
  puzzles = [],
  solvedPuzzleIds = new Set(),
  activePuzzleId,
  onSelectStation,
  lives = 3,
  timeElapsed = 0,
  hintCount = 2,
  onUseHint,
  onQuit
}) => {
  const allSolved = puzzles.length > 0 && puzzles.every(p => solvedPuzzleIds.has(p.id));

  // 機關熱區在 16:9 全景畫布上的相對百分比座標配置 (依主題與真實門扉微調)
  const HOTSPOTS = [
    {
      id: 'puzzle_listening',
      nameZh: '回音石柱',
      icon: Volume2,
      top: '38%',
      left: '18%',
      color: 'emerald',
      puzzleIndex: 0
    },
    {
      id: 'puzzle_meaning',
      nameZh: '羊皮紙匣',
      icon: Scroll,
      top: '62%',
      left: '26%',
      color: 'amber',
      puzzleIndex: 1
    },
    {
      id: 'puzzle_spelling',
      nameZh: '符文石盤',
      icon: Settings2,
      top: '72%',
      left: '52%',
      color: 'indigo',
      puzzleIndex: 2
    },
    {
      id: 'puzzle_pairing',
      nameZh: '終極封印門',
      icon: DoorClosed,
      top: '46%',
      left: '78%',
      color: 'rose',
      puzzleIndex: 3
    }
  ];

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-screen overflow-hidden flex flex-col justify-between select-none bg-slate-950">
      {/* ── 1. 底層：高清吉卜力/塞爾達冒險手繪全景圖 ── */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 pointer-events-none"
        style={{ backgroundImage: `url(${theme.bg})` }}
      />

      {/* ── 2. 光影層：暗角暗化、火把微光與漂浮金粉光芒 ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/60 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40" />

      {/* 浮動微粒塵埃光暈 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/40 blur-[1px] absolute top-1/4 left-1/3 animate-ping" />
        <div className="w-3 h-3 rounded-full bg-emerald-400/30 blur-[2px] absolute top-1/2 left-1/5 animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-indigo-300/40 blur-[1px] absolute top-1/3 right-1/4 animate-bounce" />
      </div>

      {/* ── 3. 頂部儀表板 (HUD: 時間、生命值、提示透鏡、退出) ── */}
      <header className="relative z-20 w-full p-3 sm:p-4 flex items-center justify-between gap-3 bg-slate-900/60 backdrop-blur-md border-b border-white/10 shadow-lg">
        {/* 左側：主題標籤與退出 */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              soundEngine.click();
              onQuit();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs sm:text-sm font-black border border-slate-700 transition-all active:scale-95 cursor-pointer"
          >
            ← 放棄逃脫
          </button>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-black/40 border border-white/10">
            <span className="text-base">{theme.runeIcon}</span>
            <span className="text-xs font-black text-amber-300 tracking-wider font-heading">
              {theme.nameZh}
            </span>
          </div>
        </div>

        {/* 中間：逃脫計時器 */}
        <div className="px-4 py-1.5 rounded-2xl bg-black/50 border border-amber-500/30 shadow-inner flex items-center gap-2">
          <span className="text-xs font-black text-slate-400">⏱️ 用時</span>
          <span className="text-lg sm:text-xl font-black font-mono text-amber-400 tracking-widest">
            {formatTime(timeElapsed)}
          </span>
        </div>

        {/* 右側：愛心生命值與鷹眼提示道具 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 愛心 */}
          <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-black/40 border border-rose-500/20 text-rose-500 font-black text-sm sm:text-base">
            {Array.from({ length: 3 }).map((_, idx) => (
              <span key={idx} className={idx < lives ? 'opacity-100 scale-100 transition-transform' : 'opacity-20 grayscale'}>
                ❤️
              </span>
            ))}
          </div>

          {/* 鷹眼透鏡提示道具 (iPad 大點擊區) */}
          <button
            onClick={onUseHint}
            disabled={hintCount <= 0 || allSolved}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs sm:text-sm font-black transition-all active:scale-95 shadow-md border cursor-pointer ${
              hintCount > 0
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300'
                : 'bg-slate-800/60 text-slate-500 border-slate-700 cursor-not-allowed'
            }`}
            title="使用鷹眼透鏡排除干擾項"
          >
            <Sparkles className="w-4 h-4" />
            <span>透鏡 ({hintCount})</span>
          </button>
        </div>
      </header>

      {/* ── 4. 中層：密室空間與 4 大互動機關熱區 (Hotspots) ── */}
      <main className="relative flex-1 w-full max-w-6xl mx-auto h-full z-10 flex items-center justify-center p-4">
        {HOTSPOTS.map((spot) => {
          const puzzle = puzzles[spot.puzzleIndex];
          if (!puzzle) return null;
          const isSolved = solvedPuzzleIds.has(puzzle.id);
          const Icon = spot.icon;

          return (
            <div
              key={spot.id}
              style={{ top: spot.top, left: spot.left }}
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
                    : 'bg-amber-400/30 group-hover:bg-amber-400/60 animate-pulse'
                }`}
              />

              {/* 機關熱區實體徽章按鍵 (iPad 56px+ 友善熱區) */}
              <div
                className={`relative px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl border-2 sm:border-3 backdrop-blur-md shadow-2xl flex items-center gap-2.5 transition-all duration-200 group-hover:scale-110 group-active:scale-95 ${
                  isSolved
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                    : 'bg-slate-900/80 border-amber-400/90 text-amber-200 hover:border-amber-300'
                }`}
              >
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-md ${
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
                  <span className="text-xs sm:text-sm">🔑</span>
                ) : (
                  <Lock className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                )}
              </div>
            </div>
          );
        })}
      </main>

      {/* ── 5. 底欄：四大符文鑰匙碎片收集進度條 ── */}
      <footer className="relative z-20 w-full p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-4xl mx-auto rounded-t-3xl shadow-2xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-400 tracking-wider">
            🗝️ 逃脫印記收集進度：
          </span>
          <span className="text-sm font-black text-amber-400">
            {solvedPuzzleIds.size} / 4
          </span>
        </div>

        {/* 4 顆符文印記狀態晶片 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {puzzles.map((p, idx) => {
            const isCollected = solvedPuzzleIds.has(p.id);
            return (
              <div
                key={p.id}
                onClick={() => {
                  soundEngine.click();
                  onSelectStation(p.id);
                }}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                  isCollected
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 scale-105 shadow-sm shadow-emerald-500/30'
                    : 'bg-black/30 border-slate-700 text-slate-500 hover:border-slate-500'
                }`}
              >
                <span className="text-sm">{p.rewardItemIcon}</span>
                <span className="text-xs font-black hidden md:inline">
                  {p.rewardItemZh}
                </span>
                {isCollected ? (
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
