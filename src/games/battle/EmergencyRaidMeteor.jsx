import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../services/audio';
import confetti from 'canvas-confetti';
import { Flame, AlertTriangle, ShieldAlert, Skull, ShieldCheck, Zap } from 'lucide-react';

/**
 * 突襲隕石 (Emergency Raid Meteor) 組件
 * - 敵方連對 5 題 (Combo 5) 向對手發送
 * - 螢幕最多維持 1 顆同學突襲隕石，隨機落於左翼安全空域 (18%~30%)，完全避開中央題目 (35%~65%) 與右上 Combo 區 (74%~96%)！
 * - 4.5 秒充裕反應時間，手速點擊 3 下（毀滅烈焰 4 下）即可成功防禦攔截！
 * - 帶有科幻戰術折線 (HUD Cyber Leader Line) 與全息警示標牌。
 */
export const EmergencyRaidMeteor = ({
  raidData, // { attackerName, id, isMega, missStreak }
  onDefended,
  onImpact
}) => {
  const [clicks, setClicks] = useState(0);
  const [remainingSec, setRemainingSec] = useState(4.5);
  const [topPercent, setTopPercent] = useState(8);
  const [isExploding, setIsExploding] = useState(false);
  const [impacted, setImpacted] = useState(false);

  const startTimeRef = useRef(performance.now());
  const animFrameRef = useRef(null);
  const handledRef = useRef(false);

  const isMega = Boolean(raidData?.isMega);
  const missStreak = raidData?.missStreak || 0;
  const penaltyPoints = 10 + missStreak;
  const targetClicks = isMega ? 4 : 3;

  // 隨機落點分佈：避開中央題目區 (35%~65%)、右上角 Combo 氣球區 (74%~96%)，也不過度貼近螢幕左緣 (0%~16%)
  // 在 18% ~ 30% 之間隨機動態分佈
  const [xPos] = useState(() => 18 + Math.random() * 12);

  useEffect(() => {
    startTimeRef.current = performance.now();
    soundEngine.wrong(); // 警報提示音

    const duration = 4.5; // 4.5 秒反應時間

    const tick = (now) => {
      if (handledRef.current) return;
      const elapsed = (now - startTimeRef.current) / 1000;
      const rem = Math.max(0, duration - elapsed);
      setRemainingSec(rem);

      // 下墜軌跡 (8% -> 80%)
      const progress = Math.min(1.0, elapsed / duration);
      const easeProgress = Math.pow(progress, 1.25);
      setTopPercent(8 + easeProgress * 72);

      if (rem <= 0) {
        // 逾時撞擊地表
        handledRef.current = true;
        setImpacted(true);
        soundEngine.explosion();
        setTimeout(() => {
          onImpact(isMega);
        }, 300);
        return;
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [onImpact, isMega]);

  // 點擊隕石防守
  const handleClick = (e) => {
    e.stopPropagation();
    if (handledRef.current || isExploding || impacted) return;

    soundEngine.laser();
    const nextClicks = clicks + 1;
    setClicks(nextClicks);

    if (nextClicks >= targetClicks) {
      // 成功打爆！
      handledRef.current = true;
      setIsExploding(true);
      soundEngine.explosion();

      try {
        confetti({
          particleCount: isMega ? 40 : 25,
          spread: isMega ? 75 : 55,
          colors: isMega ? ['#ec4899', '#ef4444', '#f59e0b', '#7c3aed'] : ['#38bdf8', '#06b6d4', '#10b981']
        });
      } catch (err) {}

      setTimeout(() => {
        onDefended(isMega);
      }, 350);
    }
  };

  if (impacted) {
    return (
      <div
        className="absolute -translate-x-1/2 bottom-4 z-40 text-center animate-ping pointer-events-none"
        style={{ left: `${xPos}%` }}
      >
        <div className={isMega ? 'text-6xl drop-shadow-[0_0_20px_#ef4444]' : 'text-5xl'}>💥</div>
        {isMega && (
          <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-xs shadow-lg animate-bounce block mt-1">
            防線受創！-1❤️ -{penaltyPoints}分
          </span>
        )}
      </div>
    );
  }

  if (isExploding) {
    return (
      <div
        className="absolute -translate-x-1/2 z-40 text-center animate-bounce pointer-events-none"
        style={{ left: `${xPos}%`, top: `${topPercent}%` }}
      >
        <div className={isMega ? 'text-6xl' : 'text-5xl'}>✨</div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white font-black text-xs shadow-xl flex items-center gap-1 border border-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isMega ? '烈焰解除！扣分歸零' : '成功攔截！扣分歸零'}</span>
        </span>
      </div>
    );
  }

  const progressPercent = Math.min(100, (clicks / targetClicks) * 100);

  return (
    <div
      onClick={handleClick}
      className={`absolute -translate-x-1/2 z-40 cursor-pointer select-none pointer-events-auto touch-manipulation group transition-transform ${
        isMega ? 'scale-105 sm:scale-115' : ''
      }`}
      style={{
        left: `${xPos}%`,
        top: `${topPercent}%`,
        transition: 'transform 0.05s linear'
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* 科幻數位戰術折線 (HUD Cyber Leader Line) */}
        <div className="flex flex-col items-center mb-1 items-start">
          {/* 頂部來源全息標牌 */}
          <div className={`px-2.5 py-1 rounded-xl border-2 text-[11px] font-black shadow-xl flex items-center gap-1 whitespace-nowrap backdrop-blur-md ${
            isMega
              ? 'bg-rose-950/90 border-rose-400 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.9)] animate-pulse'
              : 'bg-slate-900/90 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.6)]'
          }`}>
            {isMega ? (
              <Skull className="w-3.5 h-3.5 text-rose-400 animate-spin-slow" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
            )}
            <span>來自 <span className="text-amber-300 font-extrabold">{raidData.attackerName}</span> 的突襲！</span>
            <span className="text-white font-mono font-black ml-1">⏱️{remainingSec.toFixed(1)}s</span>
          </div>

          {/* 點擊防衛進度條 (HUD Tactical Progress) */}
          <div className="w-full mt-0.5 px-2 py-0.5 rounded-lg bg-black/75 border border-white/20 flex items-center justify-between gap-1 text-[10px] font-black">
            <span className="text-amber-300 flex items-center gap-0.5">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>點擊防衛 ({clicks}/{targetClicks})</span>
            </span>
            <div className="w-12 h-1.5 rounded-full bg-slate-700 overflow-hidden">
              <div
                className={`h-full transition-all duration-150 ${isMega ? 'bg-rose-500' : 'bg-cyan-400'}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* 隕石本體 (支援烈焰大隕石與科技隕石核心) */}
        <div className="relative group-active:scale-95 transition-transform">
          <Flame className={`-mb-2.5 mx-auto animate-pulse ${
            isMega ? 'w-12 h-12 text-rose-400 drop-shadow-[0_0_15px_#f43f5e]' : 'w-9 h-9 text-amber-400 drop-shadow-[0_0_10px_#f59e0b]'
          }`} />

          <div className={`rounded-full border-2 flex items-center justify-center text-white font-black shadow-2xl transition-all ${
            isMega
              ? 'w-14 h-14 bg-gradient-to-br from-rose-600 via-red-600 to-purple-950 border-rose-300 shadow-[0_0_25px_rgba(244,63,94,0.9)] animate-pulse'
              : 'w-12 h-12 bg-gradient-to-br from-cyan-600 via-blue-700 to-slate-900 border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.8)]'
          }`}>
            {isMega ? (
              <Skull className="w-7 h-7 text-amber-300 animate-spin-slow" />
            ) : (
              <ShieldAlert className="w-6 h-6 text-cyan-200 animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
