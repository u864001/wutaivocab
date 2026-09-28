import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../services/audio';
import confetti from 'canvas-confetti';
import { Flame, AlertTriangle, ShieldAlert } from 'lucide-react';

/**
 * 突襲隕石 (Emergency Raid Meteor) 組件
 * - 敵方連對 3 題時觸發，向所有對手投放
 * - 3 秒內必須以手速連點 5 下打爆，否則撞擊地表扣除 1 顆愛心！
 * - 具備危險赤紅警報、殘餘秒數倒數與點擊打擊反饋
 */
export const EmergencyRaidMeteor = ({
  raidData, // { attackerName, id }
  onDefended, // 成功點滿 5 下擊落
  onImpact // 逾時撞擊地表扣心
}) => {
  const [clicks, setClicks] = useState(0);
  const [remainingSec, setRemainingSec] = useState(3.0);
  const [topPercent, setTopPercent] = useState(10);
  const [isExploding, setIsExploding] = useState(false);
  const [impacted, setImpacted] = useState(false);

  const startTimeRef = useRef(performance.now());
  const animFrameRef = useRef(null);
  const handledRef = useRef(false);

  // 橫向隨機偏移位置 (偏左或偏右，避免遮擋中央單字題)
  const [xPos] = useState(() => 22 + Math.random() * 56);

  useEffect(() => {
    startTimeRef.current = performance.now();
    soundEngine.wrong(); // 警報聲

    const duration = 3.0; // 3 秒撞地

    const tick = (now) => {
      if (handledRef.current) return;
      const elapsed = (now - startTimeRef.current) / 1000;
      const rem = Math.max(0, duration - elapsed);
      setRemainingSec(rem);

      // 下墜軌跡 (10% -> 85%)
      const progress = Math.min(1.0, elapsed / duration);
      const easeProgress = Math.pow(progress, 1.4); // 後段加速下墜
      setTopPercent(10 + easeProgress * 75);

      if (rem <= 0) {
        // 逾時撞擊地表！
        handledRef.current = true;
        setImpacted(true);
        soundEngine.explosion();
        setTimeout(() => {
          onImpact();
        }, 300);
        return;
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [onImpact]);

  // 點擊隕石
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
          particleCount: 25,
          spread: 60,
          colors: ['#ef4444', '#f97316', '#fbbf24']
        });
      } catch (err) {}

      setTimeout(() => {
        onDefended();
      }, 350);
    }
  };

  if (impacted) {
    return (
      <div
        className="absolute -translate-x-1/2 bottom-4 z-40 text-center animate-ping"
        style={{ left: `${xPos}%` }}
      >
        <div className="text-5xl">💥</div>
      </div>
    );
  }

  if (isExploding) {
    return (
      <div
        className="absolute -translate-x-1/2 z-40 text-center animate-bounce"
        style={{ left: `${xPos}%`, top: `${topPercent}%` }}
      >
        <div className="text-5xl">💥</div>
        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-black text-xs shadow-lg">
          攔截成功！
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="absolute -translate-x-1/2 z-40 cursor-pointer select-none pointer-events-auto touch-manipulation group"
      style={{
        left: `${xPos}%`,
        top: `${topPercent}%`,
        transition: 'transform 0.05s linear'
      }}
    >
      <div className="flex flex-col items-center">
        {/* 警報名牌與點擊次數 */}
        <div className="px-2.5 py-1 mb-1 rounded-full bg-rose-950/95 border-2 border-rose-500 text-rose-300 text-[11px] font-black shadow-[0_0_15px_rgba(244,63,94,0.9)] flex items-center gap-1 animate-pulse whitespace-nowrap">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span>來自 {raidData.attackerName} 的空襲！</span>
          <span className="text-white font-mono font-black">({remainingSec.toFixed(1)}s)</span>
        </div>

        {/* 點擊次數充氣徽章 */}
        <div className="px-3 py-0.5 mb-1 rounded-full bg-red-600 text-white text-xs font-black shadow-md border border-yellow-300 animate-bounce">
          🔥 速點 5 下！({clicks}/5)
        </div>

        {/* 突襲赤紅燃燒隕石本體 */}
        <div className="relative group-active:scale-90 transition-transform">
          <Flame className="w-10 h-10 text-rose-500 -mb-3 mx-auto animate-pulse" />
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 via-rose-700 to-slate-900 border-2 border-rose-400 shadow-[0_0_20px_rgba(239,68,68,0.9)] flex items-center justify-center text-white font-black text-lg">
            <ShieldAlert className="w-7 h-7 text-amber-300 animate-spin-slow" />
          </div>
        </div>
      </div>
    </div>
  );
};
