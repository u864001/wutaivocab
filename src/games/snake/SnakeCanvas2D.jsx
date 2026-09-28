import React, { useRef, useEffect } from 'react';
import {
  lerp,
  lerpAngle,
  drawLilyBushBorder,
  drawJungleBushBorder,
  drawDappledSunlight,
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
  letters = [],
  theme = 'jungle', // 'jungle' | 'indigenous'
  isDead = false,
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

  // 物理平滑骨骼狀態 (Physical Kinematic Spine)
  const spineRef = useRef([]);
  const prevSnakeLenRef = useRef(snake.length);
  const bulgesRef = useRef([]);
  const cheerTimerRef = useRef(0);
  const prevCheerTriggerRef = useRef(cheerTrigger);

  // 彩蛋蝴蝶物理狀態 (Jungle)
  const butterfliesRef = useRef([
    { x: 180, y: 150, vx: 0.6, vy: 0.4, angle: 0, changeTimer: 0 },
    { x: 550, y: 320, vx: -0.5, vy: 0.5, angle: 0, changeTimer: 0 }
  ]);

  // 彩蛋動物位置
  const monkeyPosRef = useRef({ x: 740, y: 40 });
  const bearPosRef = useRef({ x: 720, y: 42 });
  const leopardPosRef = useRef({ x: 90, y: 440 });

  // 監聽歡呼觸發
  useEffect(() => {
    if (cheerTrigger > prevCheerTriggerRef.current) {
      cheerTimerRef.current = 2.0; // 歡呼持續 2 秒
      prevCheerTriggerRef.current = cheerTrigger;
    }
  }, [cheerTrigger]);

  // 監聽吃到單字增加長度 -> 觸發波浪吞嚥隆起 (Belly Bulge)
  useEffect(() => {
    if (snake.length > prevSnakeLenRef.current) {
      bulgesRef.current.push({ progress: 0, speed: 1.4 });
    }
    prevSnakeLenRef.current = snake.length;
  }, [snake.length]);

  // 初始化或同步平滑骨骼節點數
  useEffect(() => {
    const tileW = width / gridW;
    const tileH = height / gridH;

    if (snake.length === 0) return;

    if (spineRef.current.length === 0) {
      spineRef.current = snake.map(s => ({
        x: s.x * tileW + tileW / 2,
        y: s.y * tileH + tileH / 2
      }));
    } else {
      // 若邏輯蛇長度增加，補足尾部節點
      while (spineRef.current.length < snake.length) {
        const last = spineRef.current[spineRef.current.length - 1];
        spineRef.current.push({ ...last });
      }
      // 若縮減，截斷
      if (spineRef.current.length > snake.length) {
        spineRef.current = spineRef.current.slice(0, snake.length);
      }
    }
  }, [snake, width, height, gridW, gridH]);

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
      const dt = Math.min((now - lastTime) / 1000, 0.1); // 秒 (防止切換分頁跳幀巨大)
      lastTime = now;
      const time = now / 1000;

      // 1. 更新歡呼計時
      if (cheerTimerRef.current > 0) {
        cheerTimerRef.current -= dt;
      }
      const isCheering = cheerTimerRef.current > 0;

      // 2. 更新吞嚥波浪
      bulgesRef.current.forEach(b => {
        b.progress += dt * b.speed;
      });
      bulgesRef.current = bulgesRef.current.filter(b => b.progress <= 1.1);

      // 3. 骨骼運動學 (Kinematic Spine Update)
      const spine = spineRef.current;
      if (snake.length > 0 && spine.length === snake.length) {
        // 目標蛇頭位置
        const targetHeadX = snake[0].x * tileW + tileW / 2;
        const targetHeadY = snake[0].y * tileH + tileH / 2;

        // 蛇頭平滑插值 (處理穿牆 wrap around 距離修正)
        let dx = targetHeadX - spine[0].x;
        let dy = targetHeadY - spine[0].y;

        // 穿牆修正：如果跨越了半個螢幕，代表是穿牆
        if (Math.abs(dx) > width / 2) {
          spine[0].x += dx > 0 ? width : -width;
          dx = targetHeadX - spine[0].x;
        }
        if (Math.abs(dy) > height / 2) {
          spine[0].y += dy > 0 ? height : -height;
          dy = targetHeadY - spine[0].y;
        }

        // 平滑跟隨蛇頭目標點
        const headLerpSpeed = isDead ? 0.05 : 12.0;
        spine[0].x += dx * Math.min(dt * headLerpSpeed, 0.9);
        spine[0].y += dy * Math.min(dt * headLerpSpeed, 0.9);

        // 穿牆包裝回合法畫布區間
        if (spine[0].x < 0) spine[0].x += width;
        if (spine[0].x >= width) spine[0].x -= width;
        if (spine[0].y < 0) spine[0].y += height;
        if (spine[0].y >= height) spine[0].y -= height;

        // 蛇身節點反向動力跟隨約束 (IK segment follower)
        const SEGMENT_DIST = tileW * 0.72; // 自然節距
        for (let i = 1; i < spine.length; i++) {
          const leader = spine[i - 1];
          const follower = spine[i];

          let segDx = follower.x - leader.x;
          let segDy = follower.y - leader.y;

          // 穿牆修正
          if (segDx > width / 2) segDx -= width;
          if (segDx < -width / 2) segDx += width;
          if (segDy > height / 2) segDy -= height;
          if (segDy < -height / 2) segDy += height;

          const currentDist = Math.hypot(segDx, segDy);
          if (currentDist > 0.001) {
            // 微妙的 S 型身體律動 (Slithering Wave)
            const waveOffset = Math.sin(time * 9 - i * 0.6) * 1.8;
            const normX = -segDy / currentDist;
            const normY = segDx / currentDist;

            // 保持固定節距
            const targetX = leader.x + (segDx / currentDist) * SEGMENT_DIST + normX * waveOffset;
            const targetY = leader.y + (segDy / currentDist) * SEGMENT_DIST + normY * waveOffset;

            follower.x = lerp(follower.x, targetX, Math.min(dt * 18, 0.85));
            follower.y = lerp(follower.y, targetY, Math.min(dt * 18, 0.85));

            if (follower.x < 0) follower.x += width;
            if (follower.x >= width) follower.x -= width;
            if (follower.y < 0) follower.y += height;
            if (follower.y >= height) follower.y -= height;
          }
        }
      }

      // 4. 更新蝴蝶物理 (Jungle 主題)
      if (theme === 'jungle' && spine.length > 0) {
        const head = spine[0];
        butterfliesRef.current.forEach(bf => {
          bf.changeTimer -= dt;
          if (bf.changeTimer <= 0) {
            bf.changeTimer = 1.5 + Math.random() * 2.0;
            bf.vx = (Math.random() - 0.5) * 40;
            bf.vy = (Math.random() - 0.5) * 40;
          }

          // 驚嚇逃逸物理：蛇頭太近時急速拍翅飛離！
          const distToSnake = Math.hypot(bf.x - head.x, bf.y - head.y);
          if (distToSnake < 85) {
            const awayAngle = Math.atan2(bf.y - head.y, bf.x - head.x);
            bf.vx = Math.cos(awayAngle) * 90;
            bf.vy = Math.sin(awayAngle) * 90;
          }

          bf.x += bf.vx * dt;
          bf.y += bf.vy * dt;

          // 保持在畫面邊界內
          if (bf.x < 40) { bf.x = 40; bf.vx = Math.abs(bf.vx); }
          if (bf.x > width - 40) { bf.x = width - 40; bf.vx = -Math.abs(bf.vx); }
          if (bf.y < 40) { bf.y = 40; bf.vy = Math.abs(bf.vy); }
          if (bf.y > height - 40) { bf.y = height - 40; bf.vy = -Math.abs(bf.vy); }

          bf.angle = Math.atan2(bf.vy, bf.vx) + Math.PI / 2;
        });
      }

      // ─── 5. 開始繪製 (Canvas Rendering) ───
      ctx.clearRect(0, 0, width, height);

      if (theme === 'indigenous') {
        // ⛰️ 霧台原民神山背景：深板岩沈穩質感底色
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(0, 0, width, height);

        // 板岩棋盤格微對比
        for (let x = 0; x < gridW; x++) {
          for (let y = 0; y < gridH; y++) {
            if ((x + y) % 2 === 0) {
              ctx.fillStyle = '#262220';
              ctx.fillRect(x * tileW, y * tileH, tileW, tileH);
            }
          }
        }

        // 神山清晨山嵐微光
        const mountainGlow = ctx.createLinearGradient(0, 0, width, height);
        mountainGlow.addColorStop(0, 'rgba(217, 119, 6, 0.08)');
        mountainGlow.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
        mountainGlow.addColorStop(1, 'rgba(180, 83, 9, 0.06)');
        ctx.fillStyle = mountainGlow;
        ctx.fillRect(0, 0, width, height);

        // 繪製微風吹拂如波浪搖曳的「魯凱純白百合花群」與板岩牆
        drawLilyBushBorder(ctx, width, height, time, cheerTimerRef.current);

        // 探頭彩蛋：台灣雲豹 (左下邊界)
        drawCloudedLeopard(ctx, leopardPosRef.current.x, leopardPosRef.current.y, time);

        // 探頭彩蛋：台灣黑熊 (右上邊界，答對時高舉雙掌歡呼)
        drawBlackBear(ctx, bearPosRef.current.x, bearPosRef.current.y, time, isCheering);

      } else {
        // 🌿 陽光熱帶雨林背景：生機盎然翠綠
        ctx.fillStyle = '#059669';
        ctx.fillRect(0, 0, width, height);

        // 淺草綠棋盤
        for (let x = 0; x < gridW; x++) {
          for (let y = 0; y < gridH; y++) {
            if ((x + y) % 2 === 0) {
              ctx.fillStyle = '#10b981';
              ctx.fillRect(x * tileW, y * tileH, tileW, tileH);
            }
          }
        }

        // 林間穿透陽光斑駁光暈 (Dappled Sunlight)
        drawDappledSunlight(ctx, width, height, time);

        // 茂密龜背芋雨林邊界
        drawJungleBushBorder(ctx, width, height, time);

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
          drawHundredPaceSnake(ctx, spine, time, bulgesRef.current, isDead);
        } else {
          drawGreenSnake(ctx, spine, time, bulgesRef.current, isDead);
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [snake, letters, theme, isDead, isNextTargetFn, width, height, gridW, gridH]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="w-full max-w-4xl h-auto rounded-3xl shadow-2xl border-4 border-slate-800/20 dark:border-white/10 aspect-[5/3] touch-none cursor-pointer select-none transition-all duration-300"
    />
  );
};
