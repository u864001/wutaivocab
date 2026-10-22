import fs from 'fs';

let canvasCode = fs.readFileSync('src/games/snake/SnakeCanvas2D.jsx', 'utf8');

// 1. Add isDark prop to component signature
canvasCode = canvasCode.replace(
  "  theme = 'indigenous', // 'indigenous' | 'jungle'",
  "  theme = 'indigenous', // 'indigenous' | 'jungle'\n  isDark = false,"
);

// 2. Add firefliesRef for Night mode
canvasCode = canvasCode.replace(
  "  // 彩蛋蝴蝶物理狀態 (Jungle 主題)",
  `  // 夜間螢火蟲物理狀態 (霧台神山夜景模式專屬)
  const firefliesRef = useRef([
    { x: 120, y: 100, vx: 14, vy: 9, phase: 0 },
    { x: 340, y: 220, vx: -12, vy: 14, phase: 1.5 },
    { x: 620, y: 160, vx: 15, vy: -11, phase: 3.0 },
    { x: 480, y: 380, vx: -13, vy: -10, phase: 4.5 },
    { x: 200, y: 320, vx: 11, vy: 12, phase: 2.2 },
    { x: 700, y: 280, vx: -12, vy: 11, phase: 5.1 }
  ]);

  // 彩蛋蝴蝶物理狀態 (Jungle 主題)`
);

// 3. Update indigenous rendering for Day vs Night
const oldIndigenousBlock = `      if (theme === 'indigenous') {
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

        // 台灣國寶神山鳳蝶飛舞彩蛋 (燕尾黑天鵝絨紅寶石斑)
        butterfliesRef.current.forEach(bf => {
          drawMountainButterfly(ctx, bf.x, bf.y, bf.angle, time);
        });

      }`;

const newIndigenousBlock = `      if (theme === 'indigenous') {
        if (isDark) {
          // 🌙 霧台神山星月夜景：深邃神聖黑曜板岩與琉璃螢光苔蘚
          ctx.fillStyle = '#0a101d'; // 深夜黑曜底色
          ctx.fillRect(0, 0, width, height);

          // 板岩暗石紋理交錯棋盤格
          for (let x = 0; x < gridW; x++) {
            for (let y = 0; y < gridH; y++) {
              if ((x + y) % 2 === 0) {
                ctx.fillStyle = '#111b2e';
                ctx.fillRect(x * tileW, y * tileH, tileW, tileH);
              }
            }
          }

          // 月夜星光微光漸層 (冷冽神秘月華神韻)
          const nightGlow = ctx.createLinearGradient(0, 0, width, height);
          nightGlow.addColorStop(0, 'rgba(56, 189, 248, 0.09)');
          nightGlow.addColorStop(0.5, 'rgba(16, 185, 129, 0.05)');
          nightGlow.addColorStop(1, 'rgba(99, 102, 241, 0.08)');
          ctx.fillStyle = nightGlow;
          ctx.fillRect(0, 0, width, height);

          // 四周灌木
          drawLushBushBorder(ctx, width, height, time, 'indigenous', cheerTimerRef.current);
          drawCloudedLeopard(ctx, leopardPosRef.current.x, leopardPosRef.current.y, time);
          drawBlackBear(ctx, bearPosRef.current.x, bearPosRef.current.y, time, isCheering);

          // 🌙 夜間專屬：漫舞夜光的山林螢火蟲 (Fireflies)
          firefliesRef.current.forEach(ff => {
            ff.x += ff.vx * dt;
            ff.y += ff.vy * dt;
            if (ff.x < 35 || ff.x > width - 35) ff.vx = -ff.vx;
            if (ff.y < 35 || ff.y > height - 35) ff.vy = -ff.vy;

            const glow = Math.sin(time * 3 + ff.phase) * 0.5 + 0.5;
            ctx.save();
            ctx.shadowColor = '#a3e635';
            ctx.shadowBlur = 14 * glow;
            ctx.fillStyle = \`rgba(190, 242, 100, \${0.35 + 0.55 * glow})\`;
            ctx.beginPath();
            ctx.arc(ff.x, ff.y, 2.5 + glow * 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          });
        } else {
          // ☀️ 霧台神山白晝晨曦：清朗高山草甸與溫潤板岩綠
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
          mountainGlow.addColorStop(0, 'rgba(253, 230, 138, 0.12)');
          mountainGlow.addColorStop(1, 'rgba(16, 185, 129, 0.05)');
          ctx.fillStyle = mountainGlow;
          ctx.fillRect(0, 0, width, height);

          drawLushBushBorder(ctx, width, height, time, 'indigenous', cheerTimerRef.current);
          drawCloudedLeopard(ctx, leopardPosRef.current.x, leopardPosRef.current.y, time);
          drawBlackBear(ctx, bearPosRef.current.x, bearPosRef.current.y, time, isCheering);

          butterfliesRef.current.forEach(bf => {
            drawMountainButterfly(ctx, bf.x, bf.y, bf.angle, time);
          });
        }
      }`;

canvasCode = canvasCode.replace(oldIndigenousBlock, newIndigenousBlock);

// 4. Pass isDark to drawLetterPod
canvasCode = canvasCode.replace(
  `        drawLetterPod(
          ctx,
          { ...letter, renderX, renderY },
          theme,
          isNext,
          time
        );`,
  `        drawLetterPod(
          ctx,
          { ...letter, renderX, renderY },
          theme,
          isNext,
          time,
          isDark
        );`
);

// 5. Add isDark to useEffect dependencies
canvasCode = canvasCode.replace(
  "[snake, nextHead, stepProgress, letters, theme, isDead, isInvulnerable, isNextTargetFn, width, height, gridW, gridH]",
  "[snake, nextHead, stepProgress, letters, theme, isDark, isDead, isInvulnerable, isNextTargetFn, width, height, gridW, gridH]"
);

fs.writeFileSync('src/games/snake/SnakeCanvas2D.jsx', canvasCode, 'utf8');
console.log('SnakeCanvas2D.jsx updated with Day/Night rendering!');
