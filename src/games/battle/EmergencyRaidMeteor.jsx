import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../services/audio';
import confetti from 'canvas-confetti';
import { Flame, AlertTriangle, ShieldAlert, Skull, ShieldCheck } from 'lucide-react';

/**
 * 突襲隕石 (Emergency Raid Meteor) 組件
 * - 敵方連對 3 題時向所有對手投放
 * - 專屬「左側空域走廊」(10%~25%)，絕不遮蔽中央單字題與右側連擊氣球！
 * - 3 秒內手速狂點 5 下防禦打爆：
 *   - 成功防禦：不加分 (+0分)，重置墜地連續扣分連鎖 (連鎖歸零)。
 *   - 逾時墜地：
 *     - 第 1~5 顆：扣分 (10 + combo扣分加成)，不扣心。
 *     - 連續 5 顆未理會後，第 6 顆起突變為「毀滅級烈焰大隕石」：墜地扣分且扣 1 顆愛心！
 */
export const EmergencyRaidMeteor = ({
  raidData, // { attackerName, id, isMega, missStreak }
  onDefended, // (isMega) => void (成功點擊 5 下防衛)
  onImpact // (isMega) => void (逾時墜地)
}) => {
  const [clicks, setClicks] = useState(0);
  const [remainingSec, setRemainingSec] = useState(3.0);
  const [topPercent, setTopPercent] = useState(8);
  const [isExploding, setIsExploding] = useState(false);
  const [impacted, setImpacted] = useState(false);

  const startTimeRef = useRef(performance.now());
  const animFrameRef = useRef(null);
  const handledRef = useRef(false);

  const isMega = !!raidData?.isMega;
  const missStreak = raidData?.missStreak || 0;
  const penaltyPoints = 10 + missStreak;

  // 專屬左側空域走廊 (10% ~ 25%)，徹底與中央題目 (38%~62%) 和右側連擊 (74%~96%) 分道揚鑣
  const [xPos] = useState(() => 10 + Math.random() * 15);

  useEffect(() => {
    startTimeRef.current = performance.now();
    soundEngine.wrong(); // 警報聲

    const duration = 3.0; // 3 秒撞地

    const tick = (now) => {
      if (handledRef.current) return;
      const elapsed = (now - startTimeRef.current) / 1000;
      const rem = Math.max(0, duration - elapsed);
      setRemainingSec(rem);

      // 下墜軌跡 (8% -> 82%)
      const progress = Math.min(1.0, elapsed / duration);
      const easeProgress = Math.pow(progress, 1.35);
      setTopPercent(8 + easeProgress * 74);

      if (rem <= 0) {
        // 逾時撞擊地表！
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

    if (nextClicks >= 5) {
      // 成功打爆！
      handledRef.current = true;
      setIsExploding(true);
      soundEngine.explosion();

      try {
        confetti({
          particleCount: isMega ? 45 : 25,
          spread: isMega ? 80 : 60,
          colors: isMega ? ['#ec4899', '#ef4444', '#f59e0b', '#7c3aed'] : ['#ef4444', '#f97316', '#fbbf24']
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
            地表受創！-1❤️ -{penaltyPoints}分
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
          <span>{isMega ? '毀滅解除！扣分歸零' : '成功防守！扣分歸零'}</span>
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`absolute -translate-x-1/2 z-40 cursor-pointer select-none pointer-events-auto touch-manipulation group transition-transform ${
        isMega ? 'scale-110 sm:scale-125' : ''
      }`}
      style={{
        left: `${xPos}%`,
        top: `${topPercent}%`,
        transition: 'transform 0.05s linear'
      }}
    >
      <div className="flex flex-col items-center">
        {/* 頂部空襲來源名牌 */}
        <div className={`px-2.5 py-1 mb-1 rounded-full border-2 text-[11px] font-black shadow-lg flex items-center gap-1 whitespace-nowrap ${
          isMega
            ? 'bg-rose-950/95 border-rose-400 text-rose-200 shadow-[0_0_25px_rgba(244,63,94,1)] animate-bounce'
            : 'bg-rose-950/90 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.7)] animate-pulse'
        }`}>
          {isMega ? (
            <Skull className="w-3.5 h-3.5 text-rose-400 animate-spin-slow" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          )}
          <span>{isMega ? `⚠️ 來自 ${raidData.attackerName} 的烈焰空襲！` : `來自 ${raidData.attackerName} 的空襲！`}</span>
          <span className="text-white font-mono font-black">({remainingSec.toFixed(1)}s)</span>
        </div>

        {/* 點擊防衛按鈕標籤 */}
        <div className={`px-3 py-0.5 mb-1 rounded-full text-white text-xs font-black shadow-md border animate-bounce ${
          isMega
            ? 'bg-gradient-to-r from-red-600 via-rose-600 to-purple-700 border-amber-300 shadow-[0_0_15px_rgba(239,68,68,0.9)]'
            : 'bg-red-600 border-yellow-300'
        }`}>
          {isMega ? (
            <span>💥 墜地扣心！速點 5 下！({clicks}/5)</span>
          ) : (
            <span>🔥 速點 5 下！(墜地扣{penaltyPoints}分) ({clicks}/5)</span>
          )}
        </div>

        {/* 突襲赤紅 / 烈焰燃燒隕石本體 */}
        <div className="relative group-active:scale-90 transition-transform">
          <Flame className={`-mb-3 mx-auto animate-pulse ${
            isMega ? 'w-14 h-14 text-rose-400 drop-shadow-[0_0_15px_#f43f5e]' : 'w-10 h-10 text-rose-500'
          }`} />

          <div className={`rounded-full border-2 flex items-center justify-center text-white font-black shadow-2xl transition-all ${
            isMega
              ? 'w-16 h-16 bg-gradient-to-br from-rose-500 via-red-600 to-purple-950 border-rose-300 shadow-[0_0_35px_rgba(244,63,94,1)] animate-pulse'
              : 'w-14 h-14 bg-gradient-to-br from-red-600 via-rose-700 to-slate-900 border-rose-400 shadow-[0_0_20px_rgba(239,68,68,0.9)]'
          }`}>
            {isMega ? (
              <Skull className="w-8 h-8 text-amber-300 animate-spin-slow" />
            ) : (
              <ShieldAlert className="w-7 h-7 text-amber-300 animate-spin-slow" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
