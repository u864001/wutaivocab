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

// ── 輔助：樣條曲線平滑化與高密度骨骼重採樣 (消除轉彎生硬直角與一節節香腸感) ──
const buildDenseFilletSpine = (chain, maxTurnRadius = 14, stepDist = 5) => {
  if (!chain || chain.length < 2) return [];
  const pts = chain.map(c => c.pt);
  const n = pts.length;
  if (n === 2) {
    const dx = pts[1].x - pts[0].x;
    const dy = pts[1].y - pts[0].y;
    const dist = Math.hypot(dx, dy) || 1;
    const tx = dx / dist, ty = dy / dist;
    const count = Math.max(2, Math.ceil(dist / stepDist));
    const samples = [];
    for (let i = 0; i <= count; i++) {
      const frac = i / count;
      samples.push({
        x: pts[0].x + dx * frac,
        y: pts[0].y + dy * frac,
        tx, ty,
        t: frac,
        arcDist: dist * frac
      });
    }
    return samples;
  }

  const segments = [];
  let totalLength = 0;

  for (let i = 0; i < n - 1; i++) {
    const pCurr = pts[i];
    const pNext = pts[i + 1];
    const dx = pNext.x - pCurr.x;
    const dy = pNext.y - pCurr.y;
    const len = Math.hypot(dx, dy);
    if (len < 0.1) continue;
    const ux = dx / len;
    const uy = dy / len;

    let startOffset = 0;
    if (i > 0) {
      const pPrev = pts[i - 1];
      const prevUx = (pCurr.x - pPrev.x) / (Math.hypot(pCurr.x - pPrev.x, pCurr.y - pPrev.y) || 1);
      const prevUy = (pCurr.y - pPrev.y) / (Math.hypot(pCurr.x - pPrev.x, pCurr.y - pPrev.y) || 1);
      const dot = prevUx * ux + prevUy * uy;
      if (dot < 0.99) {
        startOffset = Math.min(maxTurnRadius, len * 0.45);
      }
    }

    let endOffset = 0;
    if (i < n - 2) {
      const pAfter = pts[i + 2];
      const nextUx = (pAfter.x - pNext.x) / (Math.hypot(pAfter.x - pNext.x, pAfter.y - pNext.y) || 1);
      const nextUy = (pAfter.y - pNext.y) / (Math.hypot(pAfter.x - pNext.x, pAfter.y - pNext.y) || 1);
      const dot = ux * nextUx + uy * nextUy;
      if (dot < 0.99) {
        endOffset = Math.min(maxTurnRadius, len * 0.45);
      }
    }

    const segStart = { x: pCurr.x + ux * startOffset, y: pCurr.y + uy * startOffset };
    const segEnd = { x: pNext.x - ux * endOffset, y: pNext.y - uy * endOffset };
    const straightLen = Math.hypot(segEnd.x - segStart.x, segEnd.y - segStart.y);

    if (straightLen > 0.1) {
      segments.push({
        type: 'line',
        start: segStart,
        end: segEnd,
        ux, uy,
        len: straightLen
      });
      totalLength += straightLen;
    }

    if (endOffset > 0 && i < n - 2) {
      const pAfter = pts[i + 2];
      const nextLen = Math.hypot(pAfter.x - pNext.x, pAfter.y - pNext.y) || 1;
      const nextUx = (pAfter.x - pNext.x) / nextLen;
      const nextUy = (pAfter.y - pNext.y) / nextLen;
      const arcStart = segEnd;
      const arcEnd = { x: pNext.x + nextUx * endOffset, y: pNext.y + nextUy * endOffset };
      const arcCtrl = pNext;
      const arcLen = (Math.hypot(arcCtrl.x - arcStart.x, arcCtrl.y - arcStart.y) +
                      Math.hypot(arcEnd.x - arcCtrl.x, arcEnd.y - arcCtrl.y)) * 0.85;
      segments.push({
        type: 'arc',
        p0: arcStart,
        p1: arcCtrl,
        p2: arcEnd,
        len: arcLen
      });
      totalLength += arcLen;
    }
  }

  if (totalLength < 1) return [];

  const samples = [];
  const numSteps = Math.max(8, Math.ceil(totalLength / stepDist));
  for (let s = 0; s <= numSteps; s++) {
    const targetDist = (s / numSteps) * totalLength;
    let accumulated = 0;

    for (let k = 0; k < segments.length; k++) {
      const seg = segments[k];
      if (accumulated + seg.len >= targetDist || k === segments.length - 1) {
        const segDist = Math.max(0, targetDist - accumulated);
        const segFrac = seg.len > 0 ? Math.min(1, segDist / seg.len) : 0;
        let x, y, tx, ty;

        if (seg.type === 'line') {
          x = seg.start.x + (seg.end.x - seg.start.x) * segFrac;
          y = seg.start.y + (seg.end.y - seg.start.y) * segFrac;
          tx = seg.ux;
          ty = seg.uy;
        } else {
          const t = segFrac;
          const oneMinusT = 1 - t;
          x = oneMinusT * oneMinusT * seg.p0.x + 2 * oneMinusT * t * seg.p1.x + t * t * seg.p2.x;
          y = oneMinusT * oneMinusT * seg.p0.y + 2 * oneMinusT * t * seg.p1.y + t * t * seg.p2.y;
          const dxdt = 2 * oneMinusT * (seg.p1.x - seg.p0.x) + 2 * t * (seg.p2.x - seg.p1.x);
          const dydt = 2 * oneMinusT * (seg.p1.y - seg.p0.y) + 2 * t * (seg.p2.y - seg.p1.y);
          const dlen = Math.hypot(dxdt, dydt) || 1;
          tx = dxdt / dlen;
          ty = dydt / dlen;
        }

        samples.push({
          x, y, tx, ty,
          t: s / numSteps,
          arcDist: targetDist
        });
        break;
      }
      accumulated += seg.len;
    }
  }

  return samples;
};

// ── 1. 繪製四周立體多層重疊的邊界 (神山石板砌牆與藤蔓百合 vs 雨林闊葉灌木) ──
export const drawLushBushBorder = (ctx, w, h, time, theme = 'indigenous', cheerTimer = 0, isDark = false) => {
  ctx.save();

  const isIndigenous = theme === 'indigenous';

  if (isIndigenous) {
    // ⛰️ 霧台神山：魯凱特色頁岩片疊石砌牆 (Stacked Slate Wall) + 蔓生青苔 + 純白百合
    // 0) 地坪內嵌柔和環境遮擋陰影 (Inward Ambient Occlusion Shadow，讓石牆與高階地坪無縫嵌合)
    const topAo = ctx.createLinearGradient(0, 24, 0, 56);
    topAo.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
    topAo.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = topAo;
    ctx.fillRect(0, 24, w, 32);

    const btmAo = ctx.createLinearGradient(0, h - 56, 0, h - 24);
    btmAo.addColorStop(0, 'rgba(0, 0, 0, 0)');
    btmAo.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
    ctx.fillStyle = btmAo;
    ctx.fillRect(0, h - 56, w, 32);

    const leftAo = ctx.createLinearGradient(22, 0, 54, 0);
    leftAo.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
    leftAo.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = leftAo;
    ctx.fillRect(22, 0, 32, h);

    const rightAo = ctx.createLinearGradient(w - 54, 0, w - 22, 0);
    rightAo.addColorStop(0, 'rgba(0, 0, 0, 0)');
    rightAo.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
    ctx.fillStyle = rightAo;
    ctx.fillRect(w - 54, 0, 32, h);

    // 1) 石板矮牆基底深色 (夜間為月夜黑曜冷色調)
    ctx.fillStyle = isDark ? '#080d14' : '#141210';
    ctx.fillRect(0, 0, w, 28);
    ctx.fillRect(0, h - 28, w, 28);
    ctx.fillRect(0, 0, 26, h);
    ctx.fillRect(w - 26, 0, 26, h);

    // 2) 頁岩片水平層疊磚塊與石材紋理 (Stacked Slate Slabs with Bevels)
    const slabW = 44;
    const countTop = Math.ceil(w / slabW) + 1;
    for (let i = 0; i < countTop; i++) {
      const sx = i * slabW;
      // 頂部石板
      ctx.fillStyle = isDark
        ? (i % 2 === 0 ? '#0f172a' : '#1e293b')
        : (i % 2 === 0 ? '#262220' : '#3f3a36');
      ctx.fillRect(sx, 0, slabW - 2, 24);
      // 邊緣石材高光 (夜間為月光冷灰藍)
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(214, 211, 209, 0.4)';
      ctx.fillRect(sx, 22, slabW - 2, 2);

      // 底部石板
      ctx.fillStyle = isDark
        ? (i % 2 === 0 ? '#0f172a' : '#1e293b')
        : (i % 2 === 0 ? '#262220' : '#3f3a36');
      ctx.fillRect(sx, h - 24, slabW - 2, 24);
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(214, 211, 209, 0.4)';
      ctx.fillRect(sx, h - 25, slabW - 2, 2);
    }

    const slabH = 38;
    const countSide = Math.ceil(h / slabH) + 1;
    for (let j = 0; j < countSide; j++) {
      const sy = j * slabH;
      // 左側石板
      ctx.fillStyle = isDark
        ? (j % 2 === 0 ? '#0f172a' : '#1e293b')
        : (j % 2 === 0 ? '#262220' : '#3f3a36');
      ctx.fillRect(0, sy, 22, slabH - 2);
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(214, 211, 209, 0.4)';
      ctx.fillRect(20, sy, 2, slabH - 2);

      // 右側石板
      ctx.fillStyle = isDark
        ? (j % 2 === 0 ? '#0f172a' : '#1e293b')
        : (j % 2 === 0 ? '#262220' : '#3f3a36');
      ctx.fillRect(w - 22, sy, 22, slabH - 2);
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(214, 211, 209, 0.4)';
      ctx.fillRect(w - 23, sy, 2, slabH - 2);
    }

    // 3) 石牆縫隙長出的深綠高山苔蘚與小灌木 (Lush Creeping Moss & Ferns)
    const stepX = 26;
    for (let i = 0; i < Math.ceil(w / stepX); i++) {
      const x = i * stepX + 13;
      const wave = Math.sin(time * 2.2 + x * 0.03) * 1.5;
      ctx.fillStyle = isDark
        ? (i % 2 === 0 ? '#064e3b' : '#022c22')
        : (i % 2 === 0 ? '#15803d' : '#166534');
      ctx.beginPath();
      ctx.ellipse(x, 24 + wave, 13, 6, 0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(x, h - 24 - wave, 13, 6, -0.1, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4) 綻放高山百合花飾 (日間純白、夜間月光冷白微光)
    const lilySpacing = 68;
    const lilyCount = Math.floor(w / lilySpacing);
    for (let i = 0; i < lilyCount; i++) {
      const lx = 36 + i * lilySpacing;
      const wavePhase = time * 2.2 - lx * 0.016;
      const sway = Math.sin(wavePhase) * 0.14 + (cheerTimer > 0 ? Math.sin(time * 8) * 0.25 : 0);
      drawSingleLilyInBush(ctx, lx, 26, sway, -1, isDark);
      if (i % 2 === 0) {
        drawSingleLilyInBush(ctx, lx + 34, h - 26, sway, 1, isDark);
      }
    }
  } else {
    // 🌿 陽光熱帶雨林：厚實重疊闊葉灌木圍欄
    ctx.fillStyle = '#062d20';
    ctx.fillRect(0, 0, w, 32);
    ctx.fillRect(0, h - 32, w, 32);
    ctx.fillRect(0, 0, 30, h);
    ctx.fillRect(w - 30, 0, 30, h);

    const stepX = 26;
    const countX = Math.ceil(w / stepX) + 1;

    for (let i = 0; i < countX; i++) {
      const x = i * stepX;
      const wave = Math.sin(time * 2.2 - x * 0.02) * 2;

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
  }

  ctx.restore();
};

const drawSingleLilyInBush = (ctx, x, y, sway, dirY = -1, isDark = false) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(sway);

  // 鮮綠長花莖 (夜間微暗)
  ctx.strokeStyle = isDark ? '#065f46' : '#15803d';
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(dirY * 5, dirY * 12, dirY * 2, dirY * 24);
  ctx.stroke();

  // 披針綠葉
  ctx.fillStyle = isDark ? '#047857' : '#16a34a';
  ctx.beginPath();
  ctx.ellipse(-9, dirY * 11, 11, 3.5, dirY * -0.5, 0, Math.PI * 2);
  ctx.ellipse(9, dirY * 13, 11, 3.5, dirY * 0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.translate(dirY * 2, dirY * 24);

  // 花瓣 (夜間為月光冷白帶冰藍微光)
  ctx.fillStyle = isDark ? '#f0f9ff' : '#ffffff';
  ctx.shadowColor = isDark ? 'rgba(56, 189, 248, 0.75)' : 'rgba(255, 255, 255, 0.85)';
  ctx.shadowBlur = isDark ? 10 : 8;
  ctx.strokeStyle = isDark ? '#7dd3fc' : '#bbf7d0';
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
  isDark = false,
  assets = null
) => {
  if (!spine || spine.length < 2) return;
  ctx.save();

  // 若處於受傷無敵狀態，高頻半透明閃爍
  if (isInvulnerable) {
    ctx.globalAlpha = Math.sin(time * 26) > 0 ? 0.3 : 0.88;
  }

  const chains = sliceSpineChains(spine);

  chains.forEach(chain => {
    if (chain.length < 2) return;

    // 透過二次貝茲樣條與高密度採樣，將折線轉換為圓潤流線型骨骼 (徹底消除 90° 直角生硬折角與香腸感)
    const denseSpine = buildDenseFilletSpine(chain, 14, 5);
    if (denseSpine.length < 2) return;

    const leftPts = [];
    const rightPts = [];
    const totalPoints = denseSpine.length;

    for (let k = 0; k < totalPoints; k++) {
      const s = denseSpine[k];
      const t = s.t; // 0.0 (頭部) -> 1.0 (尾部)

      // 法線向量 (垂直於流動切線)
      const nx = -s.ty;
      const ny = s.tx;

      // 百步蛇勻稱肌肉解剖輪廓 (Deinagkistrodon acutus)
      let r;
      if (t < 0.15) {
        // 頸項微收 (銜接頭頰底寬 13.5px -> 中段粗壯 15.5px)
        r = 13.5 + (15.5 - 13.5) * (t / 0.15);
      } else if (t <= 0.78) {
        // 粗壯勻稱的百步蛇中段軀幹 (圓柱狀肌肉飽滿，寬達 31px，視覺與頭部極度協調)
        r = 15.5;
      } else if (t <= 0.88) {
        // 後腹部微收 (15.5px -> 12.0px)
        r = 15.5 - (15.5 - 12.0) * ((t - 0.78) / 0.10);
      } else {
        // 百步蛇典型錐狀短尾 (~10% 尾長，快速平滑收細至 3.8px 完美銜接尾針 Sprite)
        r = 12.0 - (12.0 - 3.8) * ((t - 0.88) / 0.12);
      }

      // 吞嚥字母波浪隆起 (Belly Bulge)
      bulges.forEach(b => {
        const dist = Math.abs(t - b.progress);
        if (dist < 0.16) {
          const bulgeFactor = Math.cos((dist / 0.16) * (Math.PI / 2)) * 0.35;
          r *= 1.0 + bulgeFactor;
        }
      });

      leftPts.push({ x: s.x + nx * r, y: s.y + ny * r });
      rightPts.push({ x: s.x - nx * r, y: s.y - ny * r });
    }

    // 0) 地面立體柔和投影 (Soft Ground Drop Shadow)
    ctx.save();
    ctx.shadowColor = isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(15, 23, 42, 0.38)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    ctx.moveTo(leftPts[0].x, leftPts[0].y);
    for (let i = 1; i < leftPts.length; i++) ctx.lineTo(leftPts[i].x, leftPts[i].y);
    for (let i = rightPts.length - 1; i >= 0; i--) ctx.lineTo(rightPts[i].x, rightPts[i].y);
    ctx.closePath();
    ctx.fillStyle = isDark ? '#0b1116' : '#2b1007';
    ctx.fill();
    ctx.restore();

    // 1) 繪製連續無縫流暢外輪廓 (母圖色調：深沉赭石/黑曜板岩)
    ctx.beginPath();
    ctx.moveTo(leftPts[0].x, leftPts[0].y);
    for (let i = 1; i < leftPts.length; i++) ctx.lineTo(leftPts[i].x, leftPts[i].y);
    for (let i = rightPts.length - 1; i >= 0; i--) ctx.lineTo(rightPts[i].x, rightPts[i].y);
    ctx.closePath();
    // 嚴格對齊 hundred_pace_snake_master 母圖調色盤
    ctx.fillStyle = isDark ? '#141d24' : '#6e3920';
    ctx.fill();

    // 圓柱體背脊光澤條 (Cylindrical Dorsal Highlight) - 沿高密度樣條描繪，平滑無死角
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(denseSpine[0].x, denseSpine[0].y);
    for (let i = 1; i < denseSpine.length; i++) ctx.lineTo(denseSpine[i].x, denseSpine[i].y);
    ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.18)' : 'rgba(235, 150, 85, 0.32)';
    ctx.lineWidth = 9.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();

    // 外輪廓深色細描邊 (如工筆刻刀線條)
    ctx.strokeStyle = isDark ? '#080d12' : '#26140d';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // 2) 沿著連續弧長 (Arc-Length)，均勻排布母圖標誌性「向心深褐側三角斑」與「雙層祖靈之眼」
    // 依弧長間距 (~25px 一個單元) 分佈，避免在轉彎時擠成一團，確保平滑隨彎度旋轉
    const totalArcLen = denseSpine[denseSpine.length - 1].arcDist;
    const diamondSpacing = 25; // 像素間距
    const numDiamonds = Math.max(1, Math.floor((totalArcLen - 28) / diamondSpacing));

    for (let d = 1; d <= numDiamonds; d++) {
      const targetDist = d * diamondSpacing + 12;
      if (targetDist > totalArcLen - 14) break;

      // 尋找對應弧長的骨骼取樣點
      let sample = denseSpine[0];
      for (let k = 0; k < denseSpine.length - 1; k++) {
        if (denseSpine[k].arcDist <= targetDist && denseSpine[k + 1].arcDist >= targetDist) {
          const segD = denseSpine[k + 1].arcDist - denseSpine[k].arcDist;
          const frac = segD > 0 ? (targetDist - denseSpine[k].arcDist) / segD : 0;
          sample = {
            x: denseSpine[k].x + (denseSpine[k + 1].x - denseSpine[k].x) * frac,
            y: denseSpine[k].y + (denseSpine[k + 1].y - denseSpine[k].y) * frac,
            tx: denseSpine[k].tx + (denseSpine[k + 1].tx - denseSpine[k].tx) * frac,
            ty: denseSpine[k].ty + (denseSpine[k + 1].ty - denseSpine[k].ty) * frac,
            t: denseSpine[k].t + (denseSpine[k + 1].t - denseSpine[k].t) * frac
          };
          break;
        }
      }

      const tNorm = sample.t;
      let r = 15.5;
      if (tNorm < 0.15) r = 13.5 + (15.5 - 13.5) * (tNorm / 0.15);
      else if (tNorm > 0.78 && tNorm <= 0.88) r = 15.5 - 3.5 * ((tNorm - 0.78) / 0.10);
      else if (tNorm > 0.88) r = 12.0 - 8.2 * ((tNorm - 0.88) / 0.12);

      const angle = Math.atan2(sample.ty, sample.tx);

      ctx.save();
      ctx.translate(sample.x, sample.y);
      ctx.rotate(angle);

      // A) 兩側向心深褐大三角斑 (百步蛇天然標誌特徵，向背脊匯聚)
      ctx.fillStyle = isDark ? '#0b1016' : '#26140d';
      // 左側向心三角
      ctx.beginPath();
      ctx.moveTo(-r, -9);
      ctx.lineTo(-r * 0.22, 0);
      ctx.lineTo(-r, 9);
      ctx.closePath();
      ctx.fill();
      // 右側向心三角
      ctx.beginPath();
      ctx.moveTo(r, -9);
      ctx.lineTo(r * 0.22, 0);
      ctx.lineTo(r, 9);
      ctx.closePath();
      ctx.fill();

      // B) 脊背中央神聖雙層祖靈之眼 (象牙白外菱 + 暖金赤心 + 黑曜靈眸)
      if (isDark) {
        // 夜間幽微琥珀微光
        const pulse = 0.55 + 0.45 * Math.sin(time * 3.5 + d * 0.5);
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(-r * 0.70, 0); ctx.lineTo(0, -r * 0.82); ctx.lineTo(r * 0.70, 0); ctx.lineTo(0, r * 0.82);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = `rgba(245, 158, 11, ${pulse})`;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 6 * pulse;
        ctx.beginPath();
        ctx.moveTo(-r * 0.42, 0); ctx.lineTo(0, -r * 0.52); ctx.lineTo(r * 0.42, 0); ctx.lineTo(0, r * 0.52);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        // 白天神聖厚塗雙層菱紋
        // 1. 深色基底
        ctx.fillStyle = '#1c130e';
        ctx.beginPath();
        ctx.moveTo(-r * 0.74, 0); ctx.lineTo(0, -r * 0.88); ctx.lineTo(r * 0.74, 0); ctx.lineTo(0, r * 0.88);
        ctx.closePath();
        ctx.fill();

        // 2. 象牙白鋸齒外菱
        ctx.fillStyle = '#fcfaf6';
        ctx.beginPath();
        ctx.moveTo(-r * 0.62, 0); ctx.lineTo(0, -r * 0.74); ctx.lineTo(r * 0.62, 0); ctx.lineTo(0, r * 0.74);
        ctx.closePath();
        ctx.fill();

        // 3. 暖金赤心內菱
        ctx.fillStyle = d % 2 === 0 ? '#df8f38' : '#c97825';
        ctx.beginPath();
        ctx.moveTo(-r * 0.36, 0); ctx.lineTo(0, -r * 0.46); ctx.lineTo(r * 0.36, 0); ctx.lineTo(0, r * 0.46);
        ctx.closePath();
        ctx.fill();

        // 4. 黑曜祖靈眼點
        ctx.fillStyle = '#181412';
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(1.2, r * 0.15), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  });

  // 3) 繪製百步蛇頭部 (來自母圖提取之 snake_head_indigenous.webp)
  const headPt = spine[0];
  const neckPt = spine[1] || headPt;
  const headAngle = Math.atan2(headPt.y - neckPt.y, headPt.x - neckPt.x);

  ctx.save();
  ctx.translate(headPt.x, headPt.y);

  if (assets?.snakeHead && assets.snakeHead.complete && assets.snakeHead.naturalWidth > 0) {
    ctx.rotate(headAngle + Math.PI / 2);

    const headW = 34;
    const headH = 46;
    const pivotY = headH * 0.58;
    const snoutY = -pivotY;

    // 吐信：分叉蛇舌 (朝向前進方向，從翹鼻尖探出)
    const tongueTimer = (time * 3) % 2.5;
    if (tongueTimer < 0.65 && !isDead) {
      const tLen = 14 + Math.sin(time * 26) * 4;
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(0, snoutY);
      ctx.lineTo(0, snoutY - tLen);
      ctx.lineTo(-4, snoutY - tLen - 5);
      ctx.moveTo(0, snoutY - tLen);
      ctx.lineTo(4, snoutY - tLen - 5);
      ctx.stroke();
    }

    // 蛇頭柔和立體投影 (頸圈羽化處平滑覆蓋身軀首節，零接縫！)
    ctx.save();
    ctx.shadowColor = isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(15, 23, 42, 0.42)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;
    ctx.drawImage(assets.snakeHead, -headW / 2, -pivotY, headW, headH);
    ctx.restore();

    // 死亡時畫上逗趣卡通 X 眼睛
    if (isDead) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      const eyeX = 9.5;
      const eyeY = snoutY + headH * 0.38;
      ctx.beginPath();
      ctx.moveTo(-eyeX - 3.5, eyeY - 3.5); ctx.lineTo(-eyeX + 3.5, eyeY + 3.5);
      ctx.moveTo(-eyeX + 3.5, eyeY - 3.5); ctx.lineTo(-eyeX - 3.5, eyeY + 3.5);
      ctx.moveTo(eyeX - 3.5, eyeY - 3.5); ctx.lineTo(eyeX + 3.5, eyeY + 3.5);
      ctx.moveTo(eyeX + 3.5, eyeY - 3.5); ctx.lineTo(eyeX - 3.5, eyeY + 3.5);
      ctx.stroke();
    }
  }

  ctx.restore();

  // 4) 繪製蛇尾末梢 Sprite (來自母圖提取之 snake_tail_indigenous.webp)
  if (spine.length >= 3 && assets?.snakeTail && assets.snakeTail.complete && assets.snakeTail.naturalWidth > 0) {
    const tailPt = spine[spine.length - 1];
    const prevTailPt = spine[spine.length - 2];
    const tailAngle = Math.atan2(tailPt.y - prevTailPt.y, tailPt.x - prevTailPt.x);
    ctx.save();
    ctx.translate(tailPt.x, tailPt.y);
    ctx.rotate(tailAngle - Math.PI / 2);
    const tailW = 18;
    const tailH = 46;
    ctx.save();
    ctx.shadowColor = isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(15, 23, 42, 0.35)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;
    ctx.drawImage(assets.snakeTail, -tailW / 2, -10, tailW, tailH);
    ctx.restore();
    ctx.restore();
  }

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

  // 1) 繪製一體成型的翡翠綠蛇身輪廓帶 (高密度樣條平滑轉彎，尾端自然收細)
  chains.forEach(chain => {
    if (chain.length < 2) return;

    const denseSpine = buildDenseFilletSpine(chain, 14, 5);
    if (denseSpine.length < 2) return;

    const leftPts = [];
    const rightPts = [];
    const totalPoints = denseSpine.length;

    for (let k = 0; k < totalPoints; k++) {
      const s = denseSpine[k];
      const t = s.t;
      const nx = -s.ty;
      const ny = s.tx;

      let r;
      if (t < 0.15) {
        r = 13.0 + (15.0 - 13.0) * (t / 0.15);
      } else if (t <= 0.78) {
        r = 15.0;
      } else if (t <= 0.88) {
        r = 15.0 - (15.0 - 11.5) * ((t - 0.78) / 0.10);
      } else {
        r = 11.5 - (11.5 - 3.5) * ((t - 0.88) / 0.12);
      }

      bulges.forEach(b => {
        const dist = Math.abs(t - b.progress);
        if (dist < 0.16) {
          const bulgeFactor = Math.cos((dist / 0.16) * (Math.PI / 2)) * 0.35;
          r *= (1.0 + bulgeFactor);
        }
      });

      leftPts.push({ x: s.x + nx * r, y: s.y + ny * r });
      rightPts.push({ x: s.x - nx * r, y: s.y - ny * r });
    }

    // 地面立體柔和投影
    ctx.save();
    ctx.shadowColor = 'rgba(6, 78, 59, 0.4)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    ctx.moveTo(leftPts[0].x, leftPts[0].y);
    for (let i = 1; i < leftPts.length; i++) ctx.lineTo(leftPts[i].x, leftPts[i].y);
    for (let i = rightPts.length - 1; i >= 0; i--) ctx.lineTo(rightPts[i].x, rightPts[i].y);
    ctx.closePath();
    ctx.fillStyle = '#064e3b';
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(leftPts[0].x, leftPts[0].y);
    for (let i = 1; i < leftPts.length; i++) ctx.lineTo(leftPts[i].x, leftPts[i].y);
    for (let i = rightPts.length - 1; i >= 0; i--) ctx.lineTo(rightPts[i].x, rightPts[i].y);
    ctx.closePath();
    ctx.fillStyle = '#10b981';
    ctx.fill();

    // 圓柱體翠綠高光 (沿平滑骨骼)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(denseSpine[0].x, denseSpine[0].y);
    for (let i = 1; i < denseSpine.length; i++) ctx.lineTo(denseSpine[i].x, denseSpine[i].y);
    ctx.strokeStyle = 'rgba(167, 243, 208, 0.45)';
    ctx.lineWidth = 9.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();

    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // 背部點綴金黃圓斑 (沿弧長均勻分佈)
    const totalArcLen = denseSpine[denseSpine.length - 1].arcDist;
    const spotSpacing = 22;
    const numSpots = Math.max(1, Math.floor((totalArcLen - 20) / spotSpacing));
    for (let s = 1; s <= numSpots; s++) {
      const targetDist = s * spotSpacing + 10;
      if (targetDist > totalArcLen - 12) break;
      for (let k = 0; k < denseSpine.length - 1; k++) {
        if (denseSpine[k].arcDist <= targetDist && denseSpine[k + 1].arcDist >= targetDist) {
          const segD = denseSpine[k + 1].arcDist - denseSpine[k].arcDist;
          const frac = segD > 0 ? (targetDist - denseSpine[k].arcDist) / segD : 0;
          const px = denseSpine[k].x + (denseSpine[k + 1].x - denseSpine[k].x) * frac;
          const py = denseSpine[k].y + (denseSpine[k + 1].y - denseSpine[k].y) * frac;
          const tNorm = denseSpine[k].t + (denseSpine[k + 1].t - denseSpine[k].t) * frac;
          const spotR = Math.max(1.6, 4.8 * (1 - tNorm * 0.6));
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(px, py, spotR, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
      }
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
export const drawLetterPod = (ctx, letter, theme, isNextTarget, time, isDark = false, assets = null) => {
  ctx.save();
  ctx.translate(letter.renderX, letter.renderY);

  const bounce = isNextTarget ? Math.sin(time * 6) * 3 : 0;
  ctx.translate(0, bounce);

  const charUpper = (letter.char || '').toUpperCase();

  if (theme === 'indigenous') {
    // ⛰️ 霧台神山百步蛇主題：七彩琉璃珠 (Sacred Glazed Bead) / 板岩金紋符石
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

    // 2. 底座渲染 (優先使用高質感 3D 琉璃珠，否則使用板岩符石備援)
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';

    if (assets?.bead && assets.bead.complete && assets.bead.naturalWidth > 0) {
      const beadSize = 40;
      ctx.drawImage(assets.bead, -beadSize / 2, -beadSize / 2, beadSize, beadSize);
    } else {
      // 符石底色備援：發光目標使用更深邃高對比黑曜板岩，非目標使用深青岩
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
    }

    // 3. 字母本體渲染：極致銳利，純黑外描邊 + 亮白/亮金高飽和填充，學生一眼即可看穿！
    ctx.shadowBlur = 0;
    ctx.font = '900 22px Fredoka, Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 先以厚實深黑描邊建立強烈邊界對比 (避免光芒淹沒字型)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4.8;
    ctx.strokeText(charUpper, 0, 1);

    // 再填入高亮純白/高純金，字體立體剔透！
    ctx.fillStyle = isNextTarget ? '#fef08a' : '#ffffff';
    ctx.fillText(charUpper, 0, 1);
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

// ── 5. 繪製彩蛋：台灣黑熊 (支援高解析 Sprite 探頭與程式化備援) ──
export const drawBlackBear = (ctx, x, y, time, isCheering, assets = null) => {
  ctx.save();
  ctx.translate(x, y);

  const bob = isCheering ? Math.sin(time * 10) * 6 : Math.sin(time * 1.5) * 1.5;
  ctx.translate(0, bob);

  if (assets?.blackBear && assets.blackBear.complete && assets.blackBear.naturalWidth > 0) {
    const size = 52;
    // 朝左下方石板矮牆探頭
    ctx.drawImage(assets.blackBear, -size / 2, -size / 2, size, size);
    if (isCheering) {
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('🐾', 12, -size * 0.4);
    }
  } else {
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
  }

  ctx.restore();
};

// ── 6. 繪製彩蛋：台灣雲豹 (支援高解析 Sprite 探頭與程式化備援) ──
export const drawCloudedLeopard = (ctx, x, y, time, assets = null) => {
  ctx.save();
  ctx.translate(x, y);

  const breathe = Math.sin(time * 2) * 1.5;
  ctx.translate(0, breathe);

  if (assets?.cloudedLeopard && assets.cloudedLeopard.complete && assets.cloudedLeopard.naturalWidth > 0) {
    const size = 50;
    // 鏡像水平翻轉朝石牆內部探頭
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(assets.cloudedLeopard, -size / 2, -size / 2, size, size);
    ctx.restore();
  } else {
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
  }

  ctx.restore();
};

// ── 7. 繪製彩蛋：熱帶小猴子 ──
export const drawJungleMonkey = (ctx, x, y, time, isCheering, assets = null) => {
  ctx.save();
  ctx.translate(x, y);

  if (assets?.monkey && assets.monkey.complete && assets.monkey.naturalWidth > 0) {
    const bob = isCheering ? Math.sin(time * 12) * 5 : Math.sin(time * 1.8) * 1.5;
    ctx.translate(0, bob);
    const monkeySize = 44;
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;
    ctx.drawImage(assets.monkey, -monkeySize / 2, -monkeySize * 0.7, monkeySize, monkeySize);
    ctx.restore();
    ctx.restore();
    return;
  }

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

/**
 * ── 7. 繪製夜間彩蛋：高山領角鴞 / 貓頭鷹 (Owl) ──
 * 棲息於石板矮牆上，兩隻圓滾金色大眼偶爾眨眼、轉頭，答對時開心地拍打翅膀
 */
export const drawOwl = (ctx, x, y, time, isCheering, assets = null) => {
  ctx.save();
  ctx.translate(x, y);

  if (assets?.owl && assets.owl.complete && assets.owl.naturalWidth > 0) {
    const breath = Math.sin(time * 2.2) * 1.5;
    const cheer = isCheering ? Math.sin(time * 14) * 4 : 0;
    ctx.translate(0, breath - cheer);
    const owlSize = 46;
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;
    ctx.drawImage(assets.owl, -owlSize / 2, -owlSize * 0.7, owlSize, owlSize);
    ctx.restore();
    ctx.restore();
    return;
  }

  // 呼吸與轉頭
  const breath = Math.sin(time * 2.2) * 1.2;
  const headTurn = Math.sin(time * 0.6) * 0.12;
  ctx.translate(0, breath);

  // 貓頭鷹身體 (羽毛斑紋)
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.ellipse(0, 4, 18, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // 胸前灰米色胸羽 (Cream Chest Feathers)
  ctx.fillStyle = '#f1f5f9';
  ctx.beginPath();
  ctx.ellipse(0, 8, 12, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // 胸前 V 字細羽斑紋
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-5, 4); ctx.lineTo(0, 8); ctx.lineTo(5, 4);
  ctx.moveTo(-4, 10); ctx.lineTo(0, 14); ctx.lineTo(4, 10);
  ctx.stroke();

  // 左右收攏羽翼 (答對吃字時開心地展翅)
  const wingFlap = isCheering ? Math.sin(time * 16) * 8 : 0;
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.ellipse(-16, 2 - wingFlap, 6, 15, -0.2, 0, Math.PI * 2);
  ctx.ellipse(16, 2 - wingFlap, 6, 15, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // 貓頭鷹頭部 (旋轉角度)
  ctx.save();
  ctx.translate(0, -12);
  ctx.rotate(headTurn);

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();

  // 領角鴞專屬羽角 (Tufted Ear Horns)
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(-12, -8); ctx.lineTo(-16, -24); ctx.lineTo(-4, -14); ctx.closePath();
  ctx.moveTo(12, -8); ctx.lineTo(16, -24); ctx.lineTo(4, -14); ctx.closePath();
  ctx.fill();

  // 面盤白色飾圈
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.arc(-6, -2, 7.5, 0, Math.PI * 2);
  ctx.arc(6, -2, 7.5, 0, Math.PI * 2);
  ctx.fill();

  // 金色璀璨大眼 (每 4 秒眨一次眼)
  const isBlinking = (time % 4 < 0.25);
  if (!isBlinking) {
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(-6, -2, 6, 0, Math.PI * 2);
    ctx.arc(6, -2, 6, 0, Math.PI * 2);
    ctx.fill();

    // 瞳孔與高光
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-6, -2, 3.5, 0, Math.PI * 2);
    ctx.arc(6, -2, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-7, -4, 1.5, 0, Math.PI * 2);
    ctx.arc(5, -4, 1.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // 眨眼可愛閉合線
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(-6, -2, 5, 0.2, Math.PI - 0.2);
    ctx.arc(6, -2, 5, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }

  // 小彎喙
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.moveTo(-2, 0); ctx.lineTo(2, 0); ctx.lineTo(0, 6); ctx.closePath();
  ctx.fill();

  ctx.restore();

  // 金黃鳥爪抓握石板矮牆
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(-8, 25, 3, 0, Math.PI * 2);
  ctx.arc(-4, 25, 3, 0, Math.PI * 2);
  ctx.arc(4, 25, 3, 0, Math.PI * 2);
  ctx.arc(8, 25, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

/**
 * ── 8. 繪製夜間彩蛋：神山大赤鼯鼠 (Flying Squirrel) ──
 * 於左上方石板矮牆探頭探腦，大眼水汪汪，帶有可愛小爪與披風飛膜
 */
export const drawNightSquirrel = (ctx, x, y, time, isCheering, assets = null) => {
  ctx.save();
  ctx.translate(x, y);

  const breathe = Math.sin(time * 2.4) * 1.5;
  ctx.translate(0, breathe);

  if (assets?.flyingSquirrel && assets.flyingSquirrel.complete && assets.flyingSquirrel.naturalWidth > 0) {
    const size = 52;
    ctx.drawImage(assets.flyingSquirrel, -size / 2, -size / 2, size, size);
  } else {
    // 蓬鬆毛茸茸身軀
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.ellipse(0, 4, 16, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // 白色小肚腩
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.ellipse(0, 8, 10, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // 圓大耳朵
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(-11, -8, 6, 0, Math.PI * 2);
    ctx.arc(11, -8, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.arc(-11, -8, 3.5, 0, Math.PI * 2);
    ctx.arc(11, -8, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // 水汪汪黑亮夜行大眼
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-6, -2, 4.5, 0, Math.PI * 2);
    ctx.arc(6, -2, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-7, -4, 1.8, 0, Math.PI * 2);
    ctx.arc(5, -4, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // 粉嫩小鼻與鬍鬚
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(0, 3, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#fef3c7';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-3, 3); ctx.lineTo(-12, 1);
    ctx.moveTo(-3, 4); ctx.lineTo(-11, 6);
    ctx.moveTo(3, 3); ctx.lineTo(12, 1);
    ctx.moveTo(3, 4); ctx.lineTo(11, 6);
    ctx.stroke();

    // 抓在石板邊緣的前小爪
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.arc(-8, 16, 3, 0, Math.PI * 2);
    ctx.arc(8, 16, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
};
