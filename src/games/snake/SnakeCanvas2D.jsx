import React, { useRef, useEffect } from 'react';
import {
  drawLushBushBorder,
  drawHundredPaceSnake,
  drawGreenSnake,
  drawLetterPod,
  drawBlackBear,
  drawCloudedLeopard,
  drawJungleMonkey,
  drawButterfly
} from './snakeJungleTheme';

export const SnakeCanvas2D = ({
  snake = [],
  nextHead = null,
  stepProgress = 0, // 0.0 ~ 1.0 (當前步進平滑進度)
  letters = [],
  theme = 'indigenous', // 'indigenous' | 'jungle'
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

      // 4. 更新蝴蝶物理 (Jungle 主題)
      if (theme === 'jungle' && spine.length > 0) {
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

      // ─── 5. 畫布繪製 (Canvas Rendering) ───
      ctx.clearRect(0, 0, width, height);

      if (theme === 'indigenous') {
        // ⛰️ 霧台神山：清晨高山草甸與溫潤板岩綠 (提升亮度，告別深黑！)
        ctx.fillStyle = '#1e3a2f'; // 清新高山青綠底色
        ctx.fillRect(0, 0, width, height);

        // 溫潤板岩青石棋盤格微對比
        for (let x = 0; x < gridW; x++) {
          for (let y = 0; y < gridH; y++) {
            if ((x + y) % 2 === 0) {
              ctx.fillStyle = '#26483a';
              ctx.fillRect(x * tileW, y * tileH, tileW, tileH);
            }
          }
        }

        // 神山高山微光漸層 (清朗晨光)
        const mountainGlow = ctx.createLinearGradient(0, 0, width, height);
        mountainGlow.addColorStop(0, 'rgba(253, 230, 138, 0.08)');
        mountainGlow.addColorStop(1, 'rgba(16, 185, 129, 0.05)');
        ctx.fillStyle = mountainGlow;
        ctx.fillRect(0, 0, width, height);

        // 繪製四周厚實重疊茂密灌木叢，純白百合花自然穿插生長在葉隙中！
        drawLushBushBorder(ctx, width, height, time, 'indigenous', cheerTimerRef.current);

        // 探頭彩蛋：台灣雲豹 (左下邊界灌木後方)
        drawCloudedLeopard(ctx, leopardPosRef.current.x, leopardPosRef.current.y, time);

        // 探頭彩蛋：台灣黑熊 (右上邊界灌木後方，答對時高舉雙掌歡呼)
        drawBlackBear(ctx, bearPosRef.current.x, bearPosRef.current.y, time, isCheering);

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
          time
        );
      });

      // ─── 7. 繪製平滑蛇身 (Snake Body & Head) ───
      if (spine.length >= 2) {
        if (theme === 'indigenous') {
          drawHundredPaceSnake(ctx, spine, time, bulgesRef.current, isDead, isInvulnerable);
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
  }, [snake, nextHead, stepProgress, letters, theme, isDead, isInvulnerable, isNextTargetFn, width, height, gridW, gridH]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="w-full max-w-4xl h-auto rounded-3xl shadow-2xl border-4 border-emerald-900/40 dark:border-white/10 aspect-[5/3] touch-none cursor-pointer select-none transition-all duration-300"
    />
  );
};
