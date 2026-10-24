/**
 * 字母貪食蛇 2D 向量程序化主題繪製器 (Procedural Vector Canvas Engine)
 * 包含兩大風格：
 * 1. ⛰️ 霧台原民神山 (Indigenous Theme)：神獸百步蛇、一體成型流線型蛇身、茂密高山灌木穿插盛開純白百合花、台灣黑熊、台灣雲豹
 * 2. 🌿 陽光熱帶雨林 (Jungle Theme)：萌趣小青蛇、一體成型流線型蛇身、繁茂闊葉灌木圍欄、小猴子、藍閃蝶、熱帶果實
 */

export const lerp = (a, b, t) => a + (b - a) * t;

export const lerpAngle = (a, b, t) => {
  let diff = (b - a) % (Math.PI * 2);
  if (diff < -Math.PI) diff += Math.PI * 2;
  if (diff > Math.PI) diff -= Math.PI * 2;
  return a + diff * t;
};

// ── 輔助：依穿牆邊界切割骨骼點序列 ──
const sliceSpineChains = (spine, maxDist = 200) => {
  if (!spine || spine.length === 0) return [];
  const chains = [];
  let currentChain = [{ pt: spine[0], globalIndex: 0 }];

  for (let i = 1; i < spine.length; i++) {
    const prev = spine[i - 1];
    const curr = spine[i];
    const dist = Math.hypot(curr.x - prev.x, curr.y - prev.y);

    if (dist > maxDist) {
      if (currentChain.length > 0) chains.push(currentChain);
      currentChain = [{ pt: curr, globalIndex: i }];
    } else {
      currentChain.push({ pt: curr, globalIndex: i });
    }
  }
  if (currentChain.length > 0) chains.push(currentChain);
  return chains;
};

// ── 1. 繪製四周立體多層重疊的茂密綠色灌木叢 (Lush Overlapping Bush Border) ──
export const drawLushBushBorder = (ctx, w, h, time, theme = 'indigenous', cheerTimer = 0) => {
  ctx.save();

  const isIndigenous = theme === 'indigenous';

  // 1) 最外層天然邊界底色（深森林暗綠）
  ctx.fillStyle = '#062d20';
  ctx.fillRect(0, 0, w, 32);
  ctx.fillRect(0, h - 32, w, 32);
  ctx.fillRect(0, 0, 30, h);
  ctx.fillRect(w - 30, 0, 30, h);

  // 2) 頂部與底部：厚實重疊灌木葉球
  const stepX = 26;
  const countX = Math.ceil(w / stepX) + 1;

  for (let i = 0; i < countX; i++) {
    const x = i * stepX;
    const wave = Math.sin(time * 2.2 - x * 0.02) * 2;

    // 頂部灌木球重疊堆疊
    ctx.fillStyle = i % 2 === 0 ? '#065f46' : '#047857';
    ctx.beginPath();
    ctx.arc(x, 14 + wave, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = i % 3 === 0 ? '#10b981' : '#059669';
    ctx.beginPath();
    ctx.arc(x + 10, 20 - wave, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = i % 2 === 0 ? '#34d399' : '#6ee7b7';
    ctx.beginPath();
    ctx.ellipse(x + 5, 26 + wave * 0.5, 10, 6, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // 底部灌木球重疊堆疊
    ctx.fillStyle = i % 2 === 0 ? '#065f46' : '#047857';
    ctx.beginPath();
    ctx.arc(x, h - 14 - wave, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = i % 3 === 0 ? '#10b981' : '#059669';
    ctx.beginPath();
    ctx.arc(x - 8, h - 20 + wave, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = i % 2 === 0 ? '#34d399' : '#6ee7b7';
    ctx.beginPath();
    ctx.ellipse(x - 5, h - 26 - wave * 0.5, 10, 6, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3) 左側與右側：厚實垂直灌木重疊
  const stepY = 28;
  const countY = Math.ceil(h / stepY) + 1;
  for (let j = 0; j < countY; j++) {
    const y = j * stepY;
    const waveY = Math.cos(time * 2.0 + y * 0.03) * 2;

    ctx.fillStyle = j % 2 === 0 ? '#065f46' : '#059669';
    ctx.beginPath();
    ctx.arc(14 + waveY, y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(22 - waveY * 0.5, y + 6, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = j % 2 === 0 ? '#065f46' : '#059669';
    ctx.beginPath();
    ctx.arc(w - 14 - waveY, y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(w - 22 + waveY * 0.5, y + 6, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4) 百步蛇神山主題：純白百合花自然穿插生長在茂密灌木葉隙之中
  if (isIndigenous) {
    const lilySpacing = 72;
    const lilyCount = Math.floor(w / lilySpacing);

    for (let i = 0; i < lilyCount; i++) {
      const lx = 48 + i * lilySpacing;
      const wavePhase = time * 2.4 - lx * 0.016;
      const sway = Math.sin(wavePhase) * 0.16 + (cheerTimer > 0 ? Math.sin(time * 9) * 0.28 : 0);

      drawSingleLilyInBush(ctx, lx, 32, sway, -1);

      if (i % 2 === 0) {
        const bSway = Math.sin(wavePhase + 1.4) * 0.16;
        drawSingleLilyInBush(ctx, lx + 36, h - 32, bSway, 1);
      }
    }
  }

  ctx.restore();
};

const drawSingleLilyInBush = (ctx, x, y, sway, dirY = -1) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(sway);

  // 鮮綠長花莖
  ctx.strokeStyle = '#15803d';
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(dirY * 5, dirY * 12, dirY * 2, dirY * 24);
  ctx.stroke();

  // 披針綠葉
  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.ellipse(-9, dirY * 11, 11, 3.5, dirY * -0.5, 0, Math.PI * 2);
  ctx.ellipse(9, dirY * 13, 11, 3.5, dirY * 0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.translate(dirY * 2, dirY * 24);

  // 純白喇叭花瓣
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.85)';
  ctx.shadowBlur = 8;
  ctx.strokeStyle = '#bbf7d0';
  ctx.lineWidth = 1;

  for (let p = 0; p < 6; p++) {
    const angle = (p * Math.PI) / 3 - Math.PI / 2;
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-4.5, -11, 0, -20);
    ctx.quadraticCurveTo(4.5, -11, 0, 0);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // 金黃花蕊
  ctx.shadowBlur = 0;
  for (let a = 0; a < 5; a++) {
    const antherAngle = (a * (Math.PI * 2)) / 5;
    ctx.save();
    ctx.rotate(antherAngle);
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -10);
    ctx.stroke();

    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.ellipse(0, -11, 2.6, 1.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 翠綠花心
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(0, 0, 2.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

// ── 2. 繪製一體成型流線型神獸百步蛇 (Continuous Serpent Body Ribbon) ──
export const drawHundredPaceSnake = (
  ctx,
  spine,
  time,
  bulges = [],
  isDead = false,
  isInvulnerable = false,
  isDark = false
) => {
  if (!spine || spine.length < 2) return;
  ctx.save();

  // 若處於受傷無敵狀態，高頻半透明閃爍
  if (isInvulnerable) {
    ctx.globalAlpha = Math.sin(time * 26) > 0 ? 0.3 : 0.88;
  }

  const totalSegs = spine.length;
  const chains = sliceSpineChains(spine);

  // 1) 繪製一體成型的流線型蛇身輪廓帶 (非球狀，尾部優雅收細！)
  chains.forEach(chain => {
    if (chain.length < 2) return;

    const leftPts = [];
    const rightPts = [];

    for (let k = 0; k < chain.length; k++) {
      const item = chain[k];
      const pt = item.pt;
      const gIdx = item.globalIndex;

      // 切線向量
      let tx, ty;
      if (k === 0) {
        tx = chain[1].pt.x - pt.x;
        ty = chain[1].pt.y - pt.y;
      } else if (k === chain.length - 1) {
        tx = pt.x - chain[k - 1].pt.x;
        ty = pt.y - chain[k - 1].pt.y;
      } else {
        tx = chain[k + 1].pt.x - chain[k - 1].pt.x;
        ty = chain[k + 1].pt.y - chain[k - 1].pt.y;
      }
      const len = Math.hypot(tx, ty) || 1;
      const nx = -ty / len;
      const ny = tx / len;

      // 半徑：從頭部腰身到尾端平滑漸變收尖 (精緻修長流線身軀，原寬度 80%)
      const t = gIdx / Math.max(1, totalSegs - 1);
      let r = 14.0;
      if (t > 0.65) {
        const tailFrac = (t - 0.65) / 0.35;
        r = 14.0 * (1.0 - tailFrac * 0.82); // 尾尖平滑收細至約 2.5px
      }

      // 吞嚥字母波浪隆起 (Belly Bulge)
      bulges.forEach(b => {
        const dist = Math.abs(t - b.progress);
        if (dist < 0.16) {
          const bulgeFactor = Math.cos((dist / 0.16) * (Math.PI / 2)) * 0.52;
          r *= 1.0 + bulgeFactor;
        }
      });

      leftPts.push({ x: pt.x + nx * r, y: pt.y + ny * r });
      rightPts.push({ x: pt.x - nx * r, y: pt.y - ny * r });
    }

    // 繪製連續蛇身外輪廓
    ctx.beginPath();
    ctx.moveTo(leftPts[0].x, leftPts[0].y);
    for (let i = 1; i < leftPts.length; i++) {
      ctx.lineTo(leftPts[i].x, leftPts[i].y);
    }
    for (let i = rightPts.length - 1; i >= 0; i--) {
      ctx.lineTo(rightPts[i].x, rightPts[i].y);
    }
    ctx.closePath();

    // 蛇身底色：白晝暖赤栗褐 vs 月夜黑曜板岩
    ctx.fillStyle = isDark ? '#18232c' : '#7c2d12';
    ctx.fill();

    // 外輪廓深色細描邊
    ctx.strokeStyle = isDark ? '#0b1116' : '#431407';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // 2) 沿著連貫中心線，在各骨骼節點處繪製經典祖靈幾何三角菱形紋 (等比 80%)
    for (let k = chain.length - 1; k >= 1; k--) {
      const item = chain[k];
      const pt = item.pt;
      const gIdx = item.globalIndex;
      if (gIdx === 0) continue; // 蛇頭留給頭部

      const prevPt = chain[Math.max(0, k - 1)].pt;
      const angle = Math.atan2(pt.y - prevPt.y, pt.x - prevPt.x);

      const t = gIdx / Math.max(1, totalSegs - 1);
      let r = 13.2;
      if (t > 0.65) {
        const tailFrac = (t - 0.65) / 0.35;
        r = 13.2 * (1.0 - tailFrac * 0.82);
      }

      ctx.save();
      ctx.translate(pt.x, pt.y);
      ctx.rotate(angle);

      if (isDark) {
        // 🌙 夜間：深黑幾何外三角 + 幽微琉璃琥珀呼吸微光（絕非全身刺眼光棒）
        const pulse = 0.55 + 0.45 * Math.sin(time * 3.5 + gIdx * 0.4);
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(-r * 0.72, 0);
        ctx.lineTo(0, -r * 0.85);
        ctx.lineTo(r * 0.72, 0);
        ctx.lineTo(0, r * 0.85);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = `rgba(245, 158, 11, ${pulse})`;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 6 * pulse;
        ctx.beginPath();
        ctx.moveTo(-r * 0.44, 0);
        ctx.lineTo(0, -r * 0.54);
        ctx.lineTo(r * 0.44, 0);
        ctx.lineTo(0, r * 0.54);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        // ☀️ 白天：高純度雪白幾何外三角 + 燦爛金黃幾何內菱形
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-r * 0.72, 0);
        ctx.lineTo(0, -r * 0.85);
        ctx.lineTo(r * 0.72, 0);
        ctx.lineTo(0, r * 0.85);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = gIdx % 2 === 0 ? '#facc15' : '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(-r * 0.44, 0);
        ctx.lineTo(0, -r * 0.54);
        ctx.lineTo(r * 0.44, 0);
        ctx.lineTo(0, r * 0.54);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }
  });

  // 3) 繪製百步蛇頭部 (等比縮放為 80%，秀氣立體)
  const head = spine[0];
  const neck = spine[1] || head;
  const headAngle = Math.atan2(head.y - neck.y, head.x - neck.x);

  ctx.save();
  ctx.translate(head.x, head.y);
  ctx.rotate(headAngle);

  // 吐信：分叉蛇舌
  const tongueTimer = (time * 3) % 2.5;
  if (tongueTimer < 0.65 && !isDead) {
    const tLen = 12 + Math.sin(time * 26) * 3;
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(14 + tLen, 0);
    ctx.lineTo(14 + tLen + 4, -3);
    ctx.moveTo(14 + tLen, 0);
    ctx.lineTo(14 + tLen + 4, 3);
    ctx.stroke();
  }

  // 經典尖吻翹鼻頭型 (原比例 80%)
  ctx.fillStyle = isDark ? '#1e293b' : '#9a3412';
  ctx.strokeStyle = isDark ? '#0b1116' : '#431407';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(20, 0);
  ctx.lineTo(9, -13);
  ctx.lineTo(-10, -12);
  ctx.lineTo(-12, 0);
  ctx.lineTo(-10, 12);
  ctx.lineTo(9, 13);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 鼻尖肉質微翹小特徵 (白晝暖橙 vs 月夜琥珀金)
  ctx.fillStyle = isDark ? '#f59e0b' : '#ea580c';
  ctx.beginPath();
  ctx.arc(18.5, 0, 3.0, 0, Math.PI * 2);
  ctx.fill();

  // 頭頂祖靈王冠金黃紋
  ctx.fillStyle = isDark ? '#fbbf24' : '#fde047';
  ctx.beginPath();
  ctx.moveTo(6.5, 0);
  ctx.lineTo(-1, -5.5);
  ctx.lineTo(-6.5, 0);
  ctx.lineTo(-1, 5.5);
  ctx.closePath();
  ctx.fill();

  // 眼睛
  if (isDead) {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(3, -6.5); ctx.lineTo(7, -4); ctx.lineTo(3, -1.5);
    ctx.moveTo(3, 1.5); ctx.lineTo(7, 4); ctx.lineTo(3, 6.5);
    ctx.stroke();
  } else {
    // 亮琥珀金色眼球
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(5.5, -6.5, 4.0, 0, Math.PI * 2);
    ctx.arc(5.5, 6.5, 4.0, 0, Math.PI * 2);
    ctx.fill();

    // 黑垂直瞳孔
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(6, -6.5, 1.1, 3.2, 0, 0, Math.PI * 2);
    ctx.ellipse(6, 6.5, 1.1, 3.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // 眼神高光
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(5, -7.5, 1.2, 0, Math.PI * 2);
    ctx.arc(5, 5.5, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
  ctx.restore();
};

// ── 3. 繪製一體成型流線型小青蛇 (Continuous Emerald Snake Ribbon) ──
export const drawGreenSnake = (
  ctx,
  spine,
  time,
  bulges = [],
  isDead = false,
  isInvulnerable = false
) => {
  if (!spine || spine.length < 2) return;
  ctx.save();

  if (isInvulnerable) {
    ctx.globalAlpha = Math.sin(time * 26) > 0 ? 0.3 : 0.88;
  }

  const totalSegs = spine.length;
  const chains = sliceSpineChains(spine);

  // 1) 繪製一體成型的翡翠綠蛇身輪廓帶 (尾端自然收細)
  chains.forEach(chain => {
    if (chain.length < 2) return;

    const leftPts = [];
    const rightPts = [];

    for (let k = 0; k < chain.length; k++) {
      const item = chain[k];
      const pt = item.pt;
      const gIdx = item.globalIndex;

      let tx, ty;
      if (k === 0) {
        tx = chain[1].pt.x - pt.x;
        ty = chain[1].pt.y - pt.y;
      } else if (k === chain.length - 1) {
        tx = pt.x - chain[k - 1].pt.x;
        ty = pt.y - chain[k - 1].pt.y;
      } else {
        tx = chain[k + 1].pt.x - chain[k - 1].pt.x;
        ty = chain[k + 1].pt.y - chain[k - 1].pt.y;
      }
      const len = Math.hypot(tx, ty) || 1;
      const nx = -ty / len;
      const ny = tx / len;

      const t = gIdx / Math.max(1, totalSegs - 1);
      let r = 14.0;
      if (t > 0.65) {
        const tailFrac = (t - 0.65) / 0.35;
        r = 14.0 * (1.0 - tailFrac * 0.82); // 尾尖收細至約 2.5px
      }

      bulges.forEach(b => {
        const dist = Math.abs(t - b.progress);
        if (dist < 0.16) {
          const bulgeFactor = Math.cos((dist / 0.16) * (Math.PI / 2)) * 0.52;
          r *= 1.0 + bulgeFactor;
        }
      });

      leftPts.push({ x: pt.x + nx * r, y: pt.y + ny * r });
      rightPts.push({ x: pt.x - nx * r, y: pt.y - ny * r });
    }

    ctx.beginPath();
    ctx.moveTo(leftPts[0].x, leftPts[0].y);
    for (let i = 1; i < leftPts.length; i++) {
      ctx.lineTo(leftPts[i].x, leftPts[i].y);
    }
    for (let i = rightPts.length - 1; i >= 0; i--) {
      ctx.lineTo(rightPts[i].x, rightPts[i].y);
    }
    ctx.closePath();

    ctx.fillStyle = '#10b981';
    ctx.fill();

    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // 背部點綴金黃圓斑 (等比 80%)
    for (let k = 1; k < chain.length; k++) {
      const item = chain[k];
      const pt = item.pt;
      const gIdx = item.globalIndex;
      const t = gIdx / Math.max(1, totalSegs - 1);
      const spotR = Math.max(1.6, 4.8 * (1 - t * 0.6));

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, spotR, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // 2) 圓萌小青蛇頭部 (等比縮放為 80%)
  const head = spine[0];
  const neck = spine[1] || head;
  const headAngle = Math.atan2(head.y - neck.y, head.x - neck.x);

  ctx.save();
  ctx.translate(head.x, head.y);
  ctx.rotate(headAngle);

  // 吐信：可愛粉紅舌
  const tongueTimer = (time * 3) % 2.5;
  if (tongueTimer < 0.65 && !isDead) {
    const tLen = 12 + Math.sin(time * 26) * 3;
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(13, 0);
    ctx.lineTo(13 + tLen, 0);
    ctx.lineTo(13 + tLen + 3.5, -2.5);
    ctx.moveTo(13 + tLen, 0);
    ctx.lineTo(13 + tLen + 3.5, 2.5);
    ctx.stroke();
  }

  // 圓萌頭形 (80%)
  ctx.fillStyle = '#10b981';
  ctx.strokeStyle = '#047857';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.ellipse(2.5, 0, 14.5, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 腮紅
  ctx.fillStyle = 'rgba(251, 113, 133, 0.45)';
  ctx.beginPath();
  ctx.arc(-1.5, -8, 3.2, 0, Math.PI * 2);
  ctx.arc(-1.5, 8, 3.2, 0, Math.PI * 2);
  ctx.fill();

  // 大眼睛 (80%)
  if (isDead) {
    ctx.strokeStyle = '#064e3b';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(3, -6.5); ctx.lineTo(8, -4); ctx.lineTo(3, -1.5);
    ctx.moveTo(3, 1.5); ctx.lineTo(8, 4); ctx.lineTo(3, 6.5);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(5, -5.5, 4.0, 0, Math.PI * 2);
    ctx.arc(5, 5.5, 4.0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(6, -5.5, 2.4, 0, Math.PI * 2);
    ctx.arc(6, 5.5, 2.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(5.2, -6.5, 1.1, 0, Math.PI * 2);
    ctx.arc(5.2, 4.8, 1.1, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
  ctx.restore();
};

// ── 4. 繪製字母標的 (Letter Pods - 晶亮發光且字體超清晰高對比，學生一眼即能辨識) ──
export const drawLetterPod = (ctx, letter, theme, isNextTarget, time, isDark = false) => {
  ctx.save();
  ctx.translate(letter.renderX, letter.renderY);

  const bounce = isNextTarget ? Math.sin(time * 6) * 3 : 0;
  ctx.translate(0, bounce);

  const charUpper = (letter.char || '').toUpperCase();

  if (theme === 'indigenous') {
    // ⛰️ 霧台神山百步蛇主題：板岩金紋符石 (Runic Slate Block)
    if (isNextTarget) {
      // 1. 外圍神聖光暈層 (只對外圈光暈生效，文字繪製前務必清空 shadowBlur，確保文字極致清晰！)
      ctx.save();
      const pulseSize = 22 + Math.sin(time * 8) * 3;
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 24;
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, pulseSize, 0, Math.PI * 2);
      ctx.stroke();

      // 4 個對稱神聖光芒菱形星芒
      const rot = time * 1.5;
      for (let i = 0; i < 4; i++) {
        const ang = rot + (i * Math.PI) / 2;
        const rx = Math.cos(ang) * (pulseSize + 4);
        const ry = Math.sin(ang) * (pulseSize + 4);
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(rx, ry, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 2. 板岩符石本體 (徹底重設 shadowBlur = 0，消除一切字體模糊暈染)
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';

    // 符石底色：發光目標使用更深邃高對比黑曜板岩，非目標使用深青岩
    ctx.fillStyle = isNextTarget ? '#0f172a' : (isDark ? '#1e293b' : '#1e293b');
    ctx.strokeStyle = isNextTarget ? '#facc15' : '#64748b';
    ctx.lineWidth = isNextTarget ? 3.5 : 2;
    ctx.beginPath();
    ctx.roundRect(-19, -19, 38, 38, 11);
    ctx.fill();
    ctx.stroke();

    // 內嵌金屬刻紋 (菱形圖騰角飾)
    ctx.strokeStyle = isNextTarget ? '#fde047' : '#475569';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-14, -14, 28, 28);

    // 3. 字母本體渲染：極致銳利，純黑外描邊 + 亮白/亮金高飽和填充，學生一眼即可看穿！
    ctx.shadowBlur = 0;
    ctx.font = '900 22px Fredoka, Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 先以厚實深黑描邊建立強烈邊界對比 (避免光芒淹沒字型)
    ctx.strokeStyle = isNextTarget ? '#000000' : '#0f172a';
    ctx.lineWidth = 4.5;
    ctx.strokeText(charUpper, 0, 1);

    // 再填入高亮純白/高純金，字體立體剔透！
    ctx.fillStyle = isNextTarget ? '#ffffff' : '#e2e8f0';
    ctx.fillText(charUpper, 0, 1);

    // 發光目標文字中央加一抹金色點綴
    if (isNextTarget) {
      ctx.fillStyle = '#fef08a';
      ctx.fillText(charUpper, 0, 1);
    }
  } else {
    // 🌿 熱帶雨林主題：翠綠仙果 / 叢林寶石 (Jungle Gem Fruit)
    if (isNextTarget) {
      ctx.save();
      const pulseSize = 21 + Math.sin(time * 8) * 3;
      ctx.shadowColor = '#4ade80';
      ctx.shadowBlur = 24;
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, pulseSize, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = isNextTarget ? '#064e3b' : '#ffffff';
    ctx.strokeStyle = isNextTarget ? '#22c55e' : '#10b981';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 0, 19, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 葉片
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.ellipse(0, -19, 6, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // 字母字型：銳利黑描邊 + 亮白/深綠字體
    ctx.shadowBlur = 0;
    ctx.font = '900 22px Fredoka, Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.strokeStyle = isNextTarget ? '#000000' : '#0f172a';
    ctx.lineWidth = isNextTarget ? 4 : 2;
    ctx.strokeText(charUpper, 0, 1);

    ctx.fillStyle = isNextTarget ? '#ffffff' : '#064e3b';
    ctx.fillText(charUpper, 0, 1);
  }

  ctx.restore();
};

// ── 5. 繪製彩蛋：台灣黑熊 ──
export const drawBlackBear = (ctx, x, y, time, isCheering) => {
  ctx.save();
  ctx.translate(x, y);

  const bob = isCheering ? Math.sin(time * 10) * 6 : Math.sin(time * 1.5) * 1.5;
  ctx.translate(0, bob);

  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.ellipse(0, 0, 20, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(-16, -14, 7, 0, Math.PI * 2);
  ctx.arc(16, -14, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#78716c';
  ctx.beginPath();
  ctx.arc(-16, -14, 3.5, 0, Math.PI * 2);
  ctx.arc(16, -14, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-11, 8);
  ctx.lineTo(0, 16);
  ctx.lineTo(11, 8);
  ctx.stroke();

  ctx.fillStyle = '#a8a29e';
  ctx.beginPath();
  ctx.ellipse(0, 2, 8, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0c0a09';
  ctx.beginPath();
  ctx.ellipse(0, 0, 3.5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-6, -4, 2.5, 0, Math.PI * 2);
  ctx.arc(6, -4, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0c0a09';
  ctx.beginPath();
  ctx.arc(-5.5, -4, 1.5, 0, Math.PI * 2);
  ctx.arc(6.5, -4, 1.5, 0, Math.PI * 2);
  ctx.fill();

  if (isCheering) {
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.arc(-22, -6, 6, 0, Math.PI * 2);
    ctx.arc(22, -6, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
};

// ── 6. 繪製彩蛋：台灣雲豹 ──
export const drawCloudedLeopard = (ctx, x, y, time) => {
  ctx.save();
  ctx.translate(x, y);

  const breathe = Math.sin(time * 2) * 1.5;
  ctx.translate(0, breathe);

  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.ellipse(0, 0, 17, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.moveTo(-14, -6); ctx.lineTo(-12, -18); ctx.lineTo(-4, -12); ctx.closePath();
  ctx.moveTo(14, -6); ctx.lineTo(12, -18); ctx.lineTo(4, -12); ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#1c1917';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(-7, 4, 3, 0.5, Math.PI * 1.8);
  ctx.arc(7, 4, 3, 0.2, Math.PI * 1.5);
  ctx.stroke();

  ctx.fillStyle = '#fef3c7';
  ctx.beginPath();
  ctx.ellipse(0, 4, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(0, 3, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.ellipse(-6, -3, 3, 4, 0, 0, Math.PI * 2);
  ctx.ellipse(6, -3, 3, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(-6, -3, 1, 3.5, 0, 0, Math.PI * 2);
  ctx.ellipse(6, -3, 1, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  const tailWave = Math.sin(time * 3) * 6;
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(14, 6);
  ctx.quadraticCurveTo(24, 8 + tailWave, 28, 0 + tailWave);
  ctx.stroke();

  ctx.restore();
};

// ── 7. 繪製彩蛋：熱帶小猴子 ──
export const drawJungleMonkey = (ctx, x, y, time, isCheering) => {
  ctx.save();
  ctx.translate(x, y);

  const bob = isCheering ? Math.sin(time * 12) * 5 : Math.sin(time * 1.8) * 1.5;
  ctx.translate(0, bob);

  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(-18, 0, 7, 0, Math.PI * 2);
  ctx.arc(18, 0, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(-18, 0, 4, 0, Math.PI * 2);
  ctx.arc(18, 0, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.ellipse(0, 3, 13, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(-5, 0, 2.5, 0, Math.PI * 2);
  ctx.arc(5, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, 5, 4, 0.2, Math.PI - 0.2);
  ctx.stroke();

  if (isCheering) {
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(16, -4, 8, 0.4, Math.PI * 0.9);
    ctx.stroke();
  }

  ctx.restore();
};

// ── 8. 繪製彩蛋：藍色閃蝶 ──
export const drawButterfly = (ctx, x, y, angle, time) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const flap = Math.sin(time * 16);
  ctx.scale(flap, 1);

  ctx.fillStyle = '#0284c7';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-14, -14, -18, -6, 0, -2);
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(14, -14, 18, -6, 0, -2);
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-10, 4, -12, 12, 0, 4);
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(10, 4, 12, 12, 0, 4);
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(0, 0, 1.5, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

// ── 9. 繪製神山彩蛋：台灣國寶神山鳳蝶 (Taiwan Mountain Swallowtail Butterfly) ──
export const drawMountainButterfly = (ctx, x, y, angle, time) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const flap = Math.sin(time * 15);
  ctx.scale(flap, 1);

  // 黑天鵝絨底翅
  ctx.fillStyle = '#1c1917';
  ctx.strokeStyle = '#0c0a09';
  ctx.lineWidth = 1.4;

  // 上翅 (修長鳳蝶前翅)
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-15, -16, -20, -7, 0, -2);
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(15, -16, 20, -7, 0, -2);
  ctx.fill(); ctx.stroke();

  // 上翅金黃斑紋
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.ellipse(-9, -8, 4, 1.8, -0.6, 0, Math.PI * 2);
  ctx.ellipse(9, -8, 4, 1.8, 0.6, 0, Math.PI * 2);
  ctx.fill();

  // 下翅 (帶有優雅燕尾 Swallowtail 突起)
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-11, 4, -13, 14, -7, 18);
  ctx.lineTo(-5, 12);
  ctx.lineTo(0, 4);
  ctx.fill(); ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(11, 4, 13, 14, 7, 18);
  ctx.lineTo(5, 12);
  ctx.lineTo(0, 4);
  ctx.fill(); ctx.stroke();

  // 下翅鮮紅寶石斑紋 (經典國寶鳳蝶特徵)
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(-6, 9, 2.5, 0, Math.PI * 2);
  ctx.arc(6, 9, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // 細長黑軀幹
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.ellipse(0, 0, 1.4, 7.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

/**
 * 繪製月夜幽谷螢火蟲 (緩慢漂浮、間歇性呼吸微光)
 */
export const drawFirefly = (ctx, x, y, time, phase = 0) => {
  ctx.save();
  // 緩慢懸浮微幅漂移
  const hoverX = x + Math.sin(time * 0.8 + phase) * 8;
  const hoverY = y + Math.cos(time * 0.6 + phase) * 8;

  // 2.5 秒週期的柔和呼吸光
  const breath = Math.pow(Math.sin(time * 2.5 + phase), 4);
  const glow = 0.25 + 0.75 * breath;

  // 螢火蟲外圈冷綠微光光暈
  ctx.shadowColor = '#a3e635';
  ctx.shadowBlur = 12 * glow;

  ctx.fillStyle = `rgba(163, 230, 53, ${0.4 * glow})`;
  ctx.beginPath();
  ctx.arc(hoverX, hoverY, 6 * glow, 0, Math.PI * 2);
  ctx.fill();

  // 核心微明亮點
  ctx.fillStyle = `rgba(254, 240, 138, ${0.9 * glow})`;
  ctx.beginPath();
  ctx.arc(hoverX, hoverY, 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};
