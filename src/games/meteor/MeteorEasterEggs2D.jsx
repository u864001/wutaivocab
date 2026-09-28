import React, { useState, useEffect, useRef } from 'react';

/**
 * 2D 備援模式專屬彩蛋系統 (流星拖曳光痕、原地旋轉 UFO、人造衛星)
 * - 流星：真實飛機雲拖曳光軌，滑過位置保留靜態光痕並自然淡化消逝
 * - UFO：點擊原地急煞自轉，絕不跳至畫面中央，3秒內點滿5次享受加成並獎勵5分
 */
export const MeteorEasterEggs2D = ({ onUfoSuccess }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // ── 1. 流星 Canvas 物理拖曳光痕系統 ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    let width = (canvas.width = canvas.parentElement.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement.clientHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || 600;
      height = canvas.height = canvas.parentElement.clientHeight || 400;
    };
    window.addEventListener('resize', handleResize);

    // 流星狀態
    let star = null;
    let nextStarTime = performance.now() + 5000 + Math.random() * 6000;

    const spawnStar = (now) => {
      const startX = 20 + Math.random() * (width * 0.35);
      const startY = 10 + Math.random() * (height * 0.25);
      const angle = (30 + Math.random() * 15) * (Math.PI / 180); // 30~45度朝右下
      const speed = 480 + Math.random() * 220; // 像素/秒
      const duration = 0.9 + Math.random() * 0.5; // 燃燒時長

      star = {
        hx: startX,
        hy: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        startTime: now,
        duration,
        trail: [], // 留在空中的靜態發光點痕跡 [{x, y, alpha, size}]
        alive: true
      };

      nextStarTime = now + 9000 + Math.random() * 10000;
    };

    let lastTime = performance.now();
    const render = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      if (!star && now >= nextStarTime) {
        spawnStar(now);
      }

      if (star) {
        const elapsed = (now - star.startTime) / 1000;

        if (star.alive) {
          // 移動流星頭部
          star.hx += star.vx * dt;
          star.hy += star.vy * dt;

          // 計算頭部亮度：先由暗急速轉明 (前 15%)，隨後隨著隨機程度逐漸轉暗
          let headAlpha = 0;
          const p = elapsed / star.duration;
          if (p < 0.15) {
            headAlpha = p / 0.15; // 急速變明
          } else {
            headAlpha = Math.max(0, 1.0 - (p - 0.15) / 0.85); // 逐漸轉暗
          }

          // 在走過的位置留下定點光痕 (像飛機雲一樣留在原地，不隨流星位移)
          if (headAlpha > 0.05) {
            star.trail.push({
              x: star.hx,
              y: star.hy,
              alpha: headAlpha * 0.7, // 軌跡比頭部暗
              size: 2.2 * headAlpha
            });
          }

          // 繪製頭部實體光點 (亮白核心 + 柔和青光暈)
          if (headAlpha > 0.02) {
            const glowRad = 6 * headAlpha;
            const grad = ctx.createRadialGradient(star.hx, star.hy, 0, star.hx, star.hy, glowRad);
            grad.addColorStop(0, `rgba(255, 255, 255, ${headAlpha})`);
            grad.addColorStop(0.35, `rgba(165, 243, 252, ${headAlpha * 0.8})`);
            grad.addColorStop(1, 'rgba(56, 189, 248, 0)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(star.hx, star.hy, glowRad, 0, Math.PI * 2);
            ctx.fill();

            // 中心亮白核心
            ctx.fillStyle = `rgba(255, 255, 255, ${headAlpha})`;
            ctx.beginPath();
            ctx.arc(star.hx, star.hy, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }

          if (elapsed >= star.duration || star.hx > width || star.hy > height) {
            star.alive = false; // 頭部燃燒完畢消散
          }
        }

        // 渲染留在空中的飛機雲靜止軌跡 (原地逐漸變暗消散)
        for (let i = star.trail.length - 1; i >= 0; i--) {
          const pt = star.trail[i];
          pt.alpha *= Math.pow(0.5, dt * 1.6); // 隨時間在原地衰減變淡

          if (pt.alpha <= 0.015) {
            star.trail.splice(i, 1);
            continue;
          }

          ctx.fillStyle = `rgba(186, 230, 253, ${pt.alpha})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // 軌跡全數淡出完畢
        if (!star.alive && star.trail.length === 0) {
          star = null;
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // ── 2. 人造衛星 (背景平滑沿圓弧漫遊，不可點選) ──
  const [satellite, setSatellite] = useState(null);

  useEffect(() => {
    let timer;
    const launchSatellite = () => {
      setSatellite({ id: Date.now() });
      setTimeout(() => setSatellite(null), 18000);
      timer = setTimeout(launchSatellite, 25000 + Math.random() * 15000);
    };

    timer = setTimeout(launchSatellite, 6000);
    return () => clearTimeout(timer);
  }, []);

  // ── 3. UFO 飛碟互動狀態 (精準原地旋轉，不瞬移中央) ──
  const [ufo, setUfo] = useState(null);
  const ufoTimerRef = useRef(null);
  const ufoStateRef = useRef(null);
  const ufoAnimRef = useRef(null);

  useEffect(() => {
    let spawnTimer;

    const triggerSpawn = () => {
      const fromLeft = Math.random() > 0.5;
      const initialUfo = {
        state: 'CRUISING',
        posX: fromLeft ? -8 : 108,
        posY: 18 + Math.random() * 8,
        dir: fromLeft ? 1 : -1,
        speed: 7.5 + Math.random() * 2.5,
        baseY: 18 + Math.random() * 8,
        startTime: performance.now(),
        clicks: 0,
        remainingSec: 3.0,
        spinDeg: 0
      };

      setUfo(initialUfo);
      ufoStateRef.current = initialUfo;

      // 啟動精準座標幀循環
      let last = performance.now();
      const tick = (now) => {
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;

        const current = ufoStateRef.current;
        if (!current) return;

        if (current.state === 'CRUISING') {
          const t = (now - current.startTime) / 1000;
          // S 型波浪巡航
          const nextX = current.posX + current.dir * current.speed * dt;
          const nextY = current.baseY + Math.sin(t * 2.2) * 3;

          const updated = { ...current, posX: nextX, posY: nextY };
          ufoStateRef.current = updated;
          setUfo(updated);

          // 飛出螢幕邊界
          if ((current.dir === 1 && nextX > 115) || (current.dir === -1 && nextX < -15)) {
            setUfo(null);
            ufoStateRef.current = null;
            spawnTimer = setTimeout(triggerSpawn, 20000 + Math.random() * 15000);
            return;
          }
        } else if (current.state === 'CLICKED') {
          // 原地旋轉 (旋轉角度持續遞增，但 posX, posY 絕對鎖死在點擊點)
          const nextDeg = current.spinDeg + dt * 720;
          const updated = { ...current, spinDeg: nextDeg };
          ufoStateRef.current = updated;
          setUfo(updated);
        } else if (current.state === 'ESCAPE') {
          // 未滿 5 次：從原地朝最近邊界加速逃跑
          const escapeDir = current.posX >= 50 ? 1 : -1;
          const nextX = current.posX + escapeDir * 55 * dt;
          const nextDeg = current.spinDeg + dt * 1080;
          const updated = { ...current, posX: nextX, spinDeg: nextDeg };
          ufoStateRef.current = updated;
          setUfo(updated);

          if (nextX > 120 || nextX < -20) {
            setUfo(null);
            ufoStateRef.current = null;
            spawnTimer = setTimeout(triggerSpawn, 18000 + Math.random() * 15000);
            return;
          }
        } else if (current.state === 'WARP_OUT') {
          // 集滿 5 次：原地光速跳躍逃逸
          const nextDeg = current.spinDeg + dt * 1440;
          const updated = { ...current, spinDeg: nextDeg };
          ufoStateRef.current = updated;
          setUfo(updated);
        }

        ufoAnimRef.current = requestAnimationFrame(tick);
      };

      ufoAnimRef.current = requestAnimationFrame(tick);
    };

    spawnTimer = setTimeout(triggerSpawn, 10000);

    return () => {
      clearTimeout(spawnTimer);
      if (ufoAnimRef.current) cancelAnimationFrame(ufoAnimRef.current);
      if (ufoTimerRef.current) clearInterval(ufoTimerRef.current);
    };
  }, []);

  // 點擊 UFO 處理
  const handleUfoClick = (e) => {
    e.stopPropagation();
    const current = ufoStateRef.current;
    if (!current || (current.state !== 'CRUISING' && current.state !== 'CLICKED')) return;

    if (current.state === 'CRUISING') {
      // 第一次點擊：原地瞬間煞車！鎖死當前 posX, posY
      const nextClicks = 1;
      const updated = {
        ...current,
        state: 'CLICKED',
        clicks: nextClicks,
        remainingSec: 3.0
      };
      ufoStateRef.current = updated;
      setUfo(updated);

      // 開啟 3 秒倒數計時器
      const startTime = performance.now();
      ufoTimerRef.current = setInterval(() => {
        const elapsed = (performance.now() - startTime) / 1000;
        const rem = Math.max(0, 3.0 - elapsed);
        const cur = ufoStateRef.current;
        if (!cur || cur.state !== 'CLICKED') return;

        if (rem <= 0) {
          clearInterval(ufoTimerRef.current);
          const escaped = { ...cur, state: 'ESCAPE', remainingSec: 0 };
          ufoStateRef.current = escaped;
          setUfo(escaped);
        } else {
          const tickUpdate = { ...cur, remainingSec: rem };
          ufoStateRef.current = tickUpdate;
          setUfo(tickUpdate);
        }
      }, 80);

    } else if (current.state === 'CLICKED') {
      const nextClicks = current.clicks + 1;

      if (nextClicks >= 5) {
        clearInterval(ufoTimerRef.current);
        const warp = {
          ...current,
          state: 'WARP_OUT',
          clicks: 5,
          remainingSec: 0
        };
        ufoStateRef.current = warp;
        setUfo(warp);

        // 發送加分通知 (同享當前連擊 bonus)
        if (onUfoSuccess) onUfoSuccess(5);

        // 0.6 秒後淡出消失
        setTimeout(() => {
          setUfo(null);
          ufoStateRef.current = null;
        }, 600);
      } else {
        const updated = { ...current, clicks: nextClicks };
        ufoStateRef.current = updated;
        setUfo(updated);
      }
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* ── 1. 流星真實飛機雲拖曳光軌 Canvas ── */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* ── 2. 背景人造衛星 ── */}
      {satellite && (
        <div className="absolute animate-satellite-orbit flex items-center gap-1 opacity-70 z-0">
          <div className="w-4 h-1.5 bg-blue-900 border border-blue-400 rounded-sm" />
          <div className="w-2.5 h-2.5 bg-slate-400 rounded-sm relative flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <div className="w-4 h-1.5 bg-blue-900 border border-blue-400 rounded-sm" />
        </div>
      )}

      {/* ── 3. UFO 飛碟 (原地旋轉，無瞬移) ── */}
      {ufo && (
        <div
          onClick={handleUfoClick}
          className="absolute pointer-events-auto cursor-pointer select-none z-10"
          style={{
            left: `${ufo.posX}%`,
            top: `${ufo.posY}%`,
            transform: 'translate(-50%, -50%)',
            transition: ufo.state === 'WARP_OUT' ? 'transform 0.5s ease-in, opacity 0.5s ease-in' : 'none',
            opacity: ufo.state === 'WARP_OUT' ? 0 : 1,
            scale: ufo.state === 'WARP_OUT' ? '0' : '1'
          }}
        >
          <div className="flex flex-col items-center">
            {/* 倒數計時與次數全息名牌 */}
            {ufo.state === 'CLICKED' && (
              <div className="px-2 py-0.5 mb-1 rounded-full bg-slate-900/90 border border-cyan-400 text-[10px] font-black text-cyan-300 shadow-md whitespace-nowrap animate-pulse">
                🛸 {ufo.clicks}/5 ({ufo.remainingSec.toFixed(1)}s)
              </div>
            )}
            {ufo.state === 'WARP_OUT' && (
              <div className="px-2.5 py-0.5 mb-1 rounded-full bg-emerald-950/90 border border-emerald-400 text-xs font-black text-emerald-300 shadow-lg whitespace-nowrap animate-bounce">
                🛸 攔截成功！
              </div>
            )}
            {ufo.state === 'ESCAPE' && (
              <div className="px-2 py-0.5 mb-1 rounded-full bg-rose-950/90 border border-rose-400 text-[10px] font-black text-rose-300 shadow-md whitespace-nowrap">
                💨 逃逸中...
              </div>
            )}

            {/* 原地自轉飛碟本體 */}
            <div
              className="relative transition-transform duration-75"
              style={{
                transform: `rotate(${ufo.spinDeg}deg)`
              }}
            >
              <div
                className={`w-11 h-4 rounded-full border shadow-md flex items-center justify-center transition-colors ${
                  ufo.state === 'WARP_OUT'
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-600 border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.8)]'
                    : ufo.state === 'ESCAPE'
                    ? 'bg-gradient-to-r from-rose-600 via-red-400 to-rose-700 border-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.8)]'
                    : 'bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                }`}
              >
                {/* 座艙罩 */}
                <div
                  className={`w-4 h-2 -top-1.5 absolute rounded-full border shadow-inner ${
                    ufo.state === 'WARP_OUT'
                      ? 'bg-emerald-400 border-emerald-200'
                      : ufo.state === 'ESCAPE'
                      ? 'bg-rose-400 border-rose-200'
                      : 'bg-cyan-400/80 border-cyan-200'
                  }`}
                />
                {/* 訊號燈點 */}
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
