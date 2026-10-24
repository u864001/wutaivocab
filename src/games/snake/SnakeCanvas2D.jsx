import React, { useRef, useEffect } from 'react';
import {
  drawLushBushBorder,
  drawHundredPaceSnake,
  drawGreenSnake,
  drawLetterPod,
  drawBlackBear,
  drawCloudedLeopard,
  drawJungleMonkey,
  drawButterfly,
  drawMountainButterfly,
  drawFirefly
} from './snakeJungleTheme';

export const SnakeCanvas2D = ({
  snake = [],
  nextHead = null,
  stepProgress = 0, // 0.0 ~ 1.0 (當前步進平滑進度)
  letters = [],
  theme = 'indigenous', // 'indigenous' | 'jungle'
  isDark = false,
  isDead = false,
  isInvulnerable = false,
  isNextTargetFn = () => false,
  cheerTrigger = 0,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  gridW = 20,
  gridH = 12,
  width = 800,
  height = 480
}) => {
  const canvasRef = useRef(null);

  // 吞嚥波浪隊列 (Belly Bulge Queue)
  const bulgesRef = useRef([]);
  const prevSnakeLenRef = useRef(snake.length);

  // 歡呼計時器
  const cheerTimerRef = useRef(0);
  const prevCheerTriggerRef = useRef(cheerTrigger);

  // 夜間螢火蟲物理狀態 (霧台神山夜景模式專屬)
  const firefliesRef = useRef([
    { x: 120, y: 100, vx: 14, vy: 9, phase: 0 },
    { x: 340, y: 220, vx: -12, vy: 14, phase: 1.5 },
    { x: 620, y: 160, vx: 15, vy: -11, phase: 3.0 },
    { x: 480, y: 380, vx: -13, vy: -10, phase: 4.5 },
    { x: 200, y: 320, vx: 11, vy: 12, phase: 2.2 },
    { x: 700, y: 280, vx: -12, vy: 11, phase: 5.1 }
  ]);

  // 彩蛋蝴蝶物理狀態 (Jungle 主題)
  const butterfliesRef = useRef([
    { x: 220, y: 160, vx: 20, vy: 15, angle: 0, changeTimer: 0 },
    { x: 560, y: 300, vx: -18, vy: 16, angle: 0, changeTimer: 0 }
  ]);

  // 動物彩蛋位置 (探頭於茂密灌木叢邊緣)
  const monkeyPosRef = useRef({ x: 730, y: 44 });
  const bearPosRef = useRef({ x: 720, y: 46 });
  const leopardPosRef = useRef({ x: 100, y: 436 });

  // 監聽歡呼觸發
  useEffect(() => {
    if (cheerTrigger > prevCheerTriggerRef.current) {
      cheerTimerRef.current = 2.0;
      prevCheerTriggerRef.current = cheerTrigger;
    }
  }, [cheerTrigger]);

  // 監聽吃到單字增加長度 -> 觸發吞嚥隆起波浪
  useEffect(() => {
    if (snake.length > prevSnakeLenRef.current) {
      bulgesRef.current.push({ progress: 0, speed: 1.5 });
    }
    prevSnakeLenRef.current = snake.length;
  }, [snake.length]);

  // 主動畫渲染循環 (60 FPS requestAnimationFrame)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let lastTime = performance.now();

    const tileW = width / gridW;
    const tileH = height / gridH;

    const renderLoop = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const time = now / 1000;

      // 1. 更新歡呼計時
      if (cheerTimerRef.current > 0) {
        cheerTimerRef.current -= dt;
      }
      const isCheering = cheerTimerRef.current > 0;

      // 2. 更新吞嚥波浪進度
      bulgesRef.current.forEach(b => {
        b.progress += dt * b.speed;
      });
      bulgesRef.current = bulgesRef.current.filter(b => b.progress <= 1.1);

      // 3. 嚴格依照經典貪食蛇「走過的路徑」計算身軀各節 60 FPS 平滑座標
      // 蛇頭：snake[0] -> nextHead (依 stepProgress 插值)
      // 第 i 節：snake[i] -> snake[i-1] (依 stepProgress 插值)
      // 確保 100% 走過蛇頭走過的網格折線軌道，完全不發生側向漂移或切角！
      const alpha = Math.max(0, Math.min(1, stepProgress));
      const spine = [];

      if (snake.length > 0) {
        const headTarget = nextHead || snake[0];

        for (let i = 0; i < snake.length; i++) {
          const from = snake[i];
          const to = i === 0 ? headTarget : snake[i - 1];

          // 處理穿牆 (Wrap Around) 距離修正：避免跨越畫布時直線扯斷
          let dx = to.x - from.x;
          let dy = to.y - from.y;

          if (dx > gridW / 2) dx -= gridW;
          if (dx < -gridW / 2) dx += gridW;
          if (dy > gridH / 2) dy -= gridH;
          if (dy < -gridH / 2) dy += gridH;

          // 平滑插值 (Unwrapped coordinate lerp)
          const interpX = from.x + dx * alpha;
          const interpY = from.y + dy * alpha;

          // 封裝至合法畫布座標
          const wrappedX = ((interpX % gridW) + gridW) % gridW;
          const wrappedY = ((interpY % gridH) + gridH) % gridH;

          spine.push({
            x: wrappedX * tileW + tileW / 2,
            y: wrappedY * tileH + tileH / 2
          });
        }
      }

      // 4. 更新蝴蝶物理 (兩個主題皆有在地特色蝴蝶飛舞)
      if (spine.length > 0) {
        const head = spine[0];
        butterfliesRef.current.forEach(bf => {
          bf.changeTimer -= dt;
          if (bf.changeTimer <= 0) {
            bf.changeTimer = 1.5 + Math.random() * 2.0;
            bf.vx = (Math.random() - 0.5) * 45;
            bf.vy = (Math.random() - 0.5) * 45;
          }

          // 驚嚇逃逸物理：蛇頭太近時加速拍翅飛離
          const distToSnake = Math.hypot(bf.x - head.x, bf.y - head.y);
          if (distToSnake < 85) {
            const awayAngle = Math.atan2(bf.y - head.y, bf.x - head.x);
            bf.vx = Math.cos(awayAngle) * 95;
            bf.vy = Math.sin(awayAngle) * 95;
          }

          bf.x += bf.vx * dt;
          bf.y += bf.vy * dt;

          if (bf.x < 45) { bf.x = 45; bf.vx = Math.abs(bf.vx); }
          if (bf.x > width - 45) { bf.x = width - 45; bf.vx = -Math.abs(bf.vx); }
          if (bf.y < 45) { bf.y = 45; bf.vy = Math.abs(bf.vy); }
          if (bf.y > height - 45) { bf.y = height - 45; bf.vy = -Math.abs(bf.vy); }

          bf.angle = Math.atan2(bf.vy, bf.vx) + Math.PI / 2;
        });
      }

      // 夜間螢火蟲緩慢漂移物理
      if (isDark) {
        firefliesRef.current.forEach(ff => {
          ff.x += ff.vx * dt;
          ff.y += ff.vy * dt;
          if (ff.x < 45) { ff.x = 45; ff.vx = Math.abs(ff.vx); }
          if (ff.x > width - 45) { ff.x = width - 45; ff.vx = -Math.abs(ff.vx); }
          if (ff.y < 45) { ff.y = 45; ff.vy = Math.abs(ff.vy); }
          if (ff.y > height - 45) { ff.y = height - 45; ff.vy = -Math.abs(ff.vy); }
        });
      }

      // ─── 5. 畫布繪製 (Canvas Rendering) ───
      ctx.clearRect(0, 0, width, height);

      if (theme === 'indigenous') {
        if (!isDark) {
          // ☀️ 白晝晨曦：翠綠高山草地 2D 俯視
          ctx.fillStyle = '#166534'; // 晨曦翠綠高山草皮底色
          ctx.fillRect(0, 0, width, height);

          // 雙色翠綠草坪棋盤格微凹槽對比
          for (let x = 0; x < gridW; x++) {
            for (let y = 0; y < gridH; y++) {
              if ((x + y) % 2 === 0) {
                ctx.fillStyle = '#15803d'; // 明亮翠綠
                ctx.fillRect(x * tileW, y * tileH, tileW, tileH);
              }
            }
          }

          // 晨曦朝陽溫潤微光
          const morningGlow = ctx.createLinearGradient(0, 0, width, height);
          morningGlow.addColorStop(0, 'rgba(254, 240, 138, 0.12)');
          morningGlow.addColorStop(1, 'rgba(34, 197, 94, 0.06)');
          ctx.fillStyle = morningGlow;
          ctx.fillRect(0, 0, width, height);

          // 四周灌木與純白百合花圍欄
          drawLushBushBorder(ctx, width, height, time, 'indigenous', cheerTimerRef.current);

          // 彩蛋：雲豹與黑熊
          drawCloudedLeopard(ctx, leopardPosRef.current.x, leopardPosRef.current.y, time);
          drawBlackBear(ctx, bearPosRef.current.x, bearPosRef.current.y, time, isCheering);

          // 靈動飛舞的國寶鳳蝶
          butterfliesRef.current.forEach(bf => {
            drawMountainButterfly(ctx, bf.x, bf.y, bf.angle, time);
          });
        } else {
          // 🌙 月夜幽谷：深邃月夜草坪 2D 俯視
          ctx.fillStyle = '#061a15'; // 月夜墨藍綠草坪底色
          ctx.fillRect(0, 0, width, height);

          // 深色草坪棋盤格
          for (let x = 0; x < gridW; x++) {
            for (let y = 0; y < gridH; y++) {
              if ((x + y) % 2 === 0) {
                ctx.fillStyle = '#0a241e';
                ctx.fillRect(x * tileW, y * tileH, tileW, tileH);
              }
            }
          }

          // 皎潔月光幽谷漸層
          const moonlightGlow = ctx.createLinearGradient(0, 0, width, height);
          moonlightGlow.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
          moonlightGlow.addColorStop(1, 'rgba(99, 102, 241, 0.04)');
          ctx.fillStyle = moonlightGlow;
          ctx.fillRect(0, 0, width, height);

          // 🌟 每隔 7 秒一次的 45° 金屬月光掃光 (Moonlight Specular Sweep)
          const sweepDuration = 1.8;
          const sweepPeriod = 7.0;
          const sweepCycleTime = (time % sweepPeriod);
          if (sweepCycleTime < sweepDuration) {
            const sweepProgress = sweepCycleTime / sweepDuration;
            const sweepCenter = (width + height) * sweepProgress - (width * 0.2);

            ctx.save();
            ctx.beginPath();
            ctx.rect(0, 0, width, height);
            ctx.clip();

            const sweepGrad = ctx.createLinearGradient(
              sweepCenter - 80, sweepCenter - 80,
              sweepCenter + 80, sweepCenter + 80
            );
            sweepGrad.addColorStop(0, 'rgba(224, 242, 254, 0)');
            sweepGrad.addColorStop(0.5, 'rgba(224, 242, 254, 0.16)');
            sweepGrad.addColorStop(1, 'rgba(224, 242, 254, 0)');

            ctx.fillStyle = sweepGrad;
            ctx.fillRect(0, 0, width, height);
            ctx.restore();
          }

          // 四周夜幕灌木圍欄
          drawLushBushBorder(ctx, width, height, time, 'indigenous', cheerTimerRef.current);

          // 彩蛋：雲豹與黑熊
          drawCloudedLeopard(ctx, leopardPosRef.current.x, leopardPosRef.current.y, time);
          drawBlackBear(ctx, bearPosRef.current.x, bearPosRef.current.y, time, isCheering);

          // 🌟 緩慢漂浮微光呼吸的夜光螢火蟲 (取代白天的蝴蝶)
          firefliesRef.current.forEach(ff => {
            drawFirefly(ctx, ff.x, ff.y, time, ff.phase);
          });
        }

      } else {
        // 🌿 陽光熱帶雨林：明朗生機翠綠 (已徹底移除突兀的淡黃色大圓圈！)
        ctx.fillStyle = '#059669';
        ctx.fillRect(0, 0, width, height);

        // 淺草綠棋盤格
        for (let x = 0; x < gridW; x++) {
          for (let y = 0; y < gridH; y++) {
            if ((x + y) % 2 === 0) {
              ctx.fillStyle = '#10b981';
              ctx.fillRect(x * tileW, y * tileH, tileW, tileH);
            }
          }
        }

        // 四周茂密重疊的熱帶闊葉灌木圍欄
        drawLushBushBorder(ctx, width, height, time, 'jungle', cheerTimerRef.current);

        // 探頭彩蛋：熱帶小猴子 (右上角，答對時舉香蕉歡呼)
        drawJungleMonkey(ctx, monkeyPosRef.current.x, monkeyPosRef.current.y, time, isCheering);

        // 自由飛舞的藍閃蝶
        butterfliesRef.current.forEach(bf => {
          drawButterfly(ctx, bf.x, bf.y, bf.angle, time);
        });
      }

      // ─── 6. 繪製字母標的 (Letter Pods) ───
      letters.forEach(letter => {
        const renderX = letter.x * tileW + tileW / 2;
        const renderY = letter.y * tileH + tileH / 2;
        const isNext = isNextTargetFn(letter);
        drawLetterPod(
          ctx,
          { ...letter, renderX, renderY },
          theme,
          isNext,
          time,
          isDark
        );
      });

      // ─── 7. 繪製平滑蛇身 (Snake Body & Head) ───
      if (spine.length >= 2) {
        if (theme === 'indigenous') {
          drawHundredPaceSnake(ctx, spine, time, bulgesRef.current, isDead, isInvulnerable, isDark);
        } else {
          drawGreenSnake(ctx, spine, time, bulgesRef.current, isDead, isInvulnerable);
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [snake, nextHead, stepProgress, letters, theme, isDark, isDead, isInvulnerable, isNextTargetFn, width, height, gridW, gridH]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="w-auto h-full max-h-[46vh] sm:max-h-[50vh] max-w-full rounded-2xl sm:rounded-3xl shadow-2xl border-4 border-emerald-900/40 dark:border-white/10 aspect-[5/3] touch-none cursor-pointer select-none transition-all duration-300"
    />
  );
};
