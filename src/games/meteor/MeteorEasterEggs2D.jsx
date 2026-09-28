import React, { useState, useEffect, useRef } from 'react';

/**
 * 2D 備援模式專屬彩蛋系統 (流星、人造衛星、UFO 飛碟)
 * 保持與 3D 模式 100% 相同之遊戲規則與加分機制
 */
export const MeteorEasterEggs2D = ({ onUfoSuccess }) => {
  // ── 1. 2D 流星狀態 ──
  const [shootingStar, setShootingStar] = useState(null);

  useEffect(() => {
    let timer;
    const triggerStar = () => {
      const top = 10 + Math.random() * 25;
      const left = 5 + Math.random() * 20;
      setShootingStar({ id: Date.now(), top, left });

      setTimeout(() => {
        setShootingStar(null);
      }, 1200);

      timer = setTimeout(triggerStar, 9000 + Math.random() * 12000);
    };

    timer = setTimeout(triggerStar, 6000);
    return () => clearTimeout(timer);
  }, []);

  // ── 2. 2D 人造衛星狀態 (平滑沿圓弧在背景移動，不可點擊) ──
  const [satellite, setSatellite] = useState(null);

  useEffect(() => {
    let timer;
    const launchSatellite = () => {
      setSatellite({ id: Date.now() });

      setTimeout(() => {
        setSatellite(null);
      }, 18000);

      timer = setTimeout(launchSatellite, 25000 + Math.random() * 20000);
    };

    timer = setTimeout(launchSatellite, 7000);
    return () => clearTimeout(timer);
  }, []);

  // ── 3. 2D UFO 飛碟互動狀態 (點擊 5 次加 5 分) ──
  const [ufo, setUfo] = useState(null);
  const ufoTimeoutRef = useRef(null);

  useEffect(() => {
    let timer;
    const spawnUfo = () => {
      // 隨機左邊或右邊進場
      const fromLeft = Math.random() > 0.5;
      setUfo({
        id: Date.now(),
        fromLeft,
        state: 'CRUISING', // 'CRUISING' | 'CLICKED' | 'WARP_OUT' | 'ESCAPE'
        clicks: 0,
        remainingSec: 3.0
      });

      timer = setTimeout(spawnUfo, 22000 + Math.random() * 18000);
    };

    timer = setTimeout(spawnUfo, 12000);
    return () => {
      clearTimeout(timer);
      if (ufoTimeoutRef.current) clearInterval(ufoTimeoutRef.current);
    };
  }, []);

  // UFO 點擊處理
  const handleUfoClick = (e) => {
    e.stopPropagation();
    if (!ufo || (ufo.state !== 'CRUISING' && ufo.state !== 'CLICKED')) return;

    if (ufo.state === 'CRUISING') {
      const nextClicks = 1;
      setUfo(prev => ({
        ...prev,
        state: 'CLICKED',
        clicks: nextClicks,
        remainingSec: 3.0
      }));

      // 開啟 3 秒倒數計時
      const startTime = Date.now();
      ufoTimeoutRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const rem = Math.max(0, 3.0 - elapsed);
        setUfo(prev => {
          if (!prev || prev.state !== 'CLICKED') return prev;
          if (rem <= 0) {
            clearInterval(ufoTimeoutRef.current);
            setTimeout(() => setUfo(null), 800);
            return { ...prev, state: 'ESCAPE', remainingSec: 0 };
          }
          return { ...prev, remainingSec: rem };
        });
      }, 100);

    } else if (ufo.state === 'CLICKED') {
      const nextClicks = ufo.clicks + 1;
      if (nextClicks >= 5) {
        clearInterval(ufoTimeoutRef.current);
        setUfo(prev => ({
          ...prev,
          state: 'WARP_OUT',
          clicks: 5,
          remainingSec: 0
        }));

        if (onUfoSuccess) onUfoSuccess(5);
        setTimeout(() => setUfo(null), 800);
      } else {
        setUfo(prev => ({ ...prev, clicks: nextClicks }));
      }
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* ── 2D 背景微光流星 ── */}
      {shootingStar && (
        <div
          className="absolute w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-300 to-white -rotate-45 animate-shooting-star opacity-60"
          style={{ top: `${shootingStar.top}%`, left: `${shootingStar.left}%` }}
        />
      )}

      {/* ── 2D 背景漫遊人造衛星 (不可點擊) ── */}
      {satellite && (
        <div className="absolute animate-satellite-orbit flex items-center gap-1 opacity-70">
          <div className="w-4 h-1.5 bg-blue-900 border border-blue-400 rounded-sm" />
          <div className="w-2.5 h-2.5 bg-slate-400 rounded-sm relative flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <div className="w-4 h-1.5 bg-blue-900 border border-blue-400 rounded-sm" />
        </div>
      )}

      {/* ── 2D UFO 飛碟彩蛋 (可點擊 5 次加 5 分) ── */}
      {ufo && (
        <div
          onClick={handleUfoClick}
          className={`absolute pointer-events-auto cursor-pointer select-none transition-all duration-300 ${
            ufo.state === 'CRUISING'
              ? ufo.fromLeft ? 'animate-ufo-fly-left' : 'animate-ufo-fly-right'
              : ufo.state === 'CLICKED'
              ? 'top-[22%] left-1/2 -translate-x-1/2 animate-spin-wobble'
              : ufo.state === 'WARP_OUT'
              ? 'top-[22%] left-1/2 -translate-x-1/2 scale-0 opacity-0 transition-transform duration-500'
              : 'top-[22%] left-1/2 -translate-x-1/2 translate-y-[-100px] scale-50 opacity-0 transition-transform duration-500'
          }`}
          style={{
            top: ufo.state === 'CRUISING' ? '18%' : undefined
          }}
        >
          <div className="flex flex-col items-center">
            {/* 倒數計時與次數全息名牌 */}
            {ufo.state === 'CLICKED' && (
              <div className="px-2 py-0.5 mb-1 rounded-full bg-slate-900/90 border border-cyan-400 text-[10px] font-black text-cyan-300 shadow-md">
                🛸 {ufo.clicks}/5 ({ufo.remainingSec.toFixed(1)}s)
              </div>
            )}
            {ufo.state === 'WARP_OUT' && (
              <div className="px-2.5 py-0.5 mb-1 rounded-full bg-emerald-950/90 border border-emerald-400 text-xs font-black text-emerald-300 shadow-lg animate-bounce">
                🛸 +5 分！
              </div>
            )}

            {/* 飛碟外型本體 */}
            <div className="relative">
              <div className="w-10 h-4 rounded-full bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 border border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.6)] flex items-center justify-center">
                <div className="w-4 h-2 -top-1.5 absolute rounded-full bg-cyan-400/80 border border-cyan-200 shadow-inner" />
                <div className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-cyan-300 animate-ping" />
                  <span className="w-1 h-1 rounded-full bg-amber-300" />
                  <span className="w-1 h-1 rounded-full bg-rose-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
