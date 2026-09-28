/**
 * 字母貪食蛇 2D 向量程序化主題繪製器 (Procedural Vector Canvas Engine)
 * 包含兩大風格：
 * 1. 🌿 陽光熱帶雨林 (Jungle Theme)：萌趣小青蛇、龜背芋棕櫚灌木、小猴子、藍閃蝶、熱帶果實
 * 2. ⛰️ 霧台原民神山 (Indigenous Theme)：神獸百步蛇、微風搖曳白色百合花、石板岩矮牆、台灣黑熊、台灣雲豹
 */

// ── 輔助函數：角度內插 ──
export const lerp = (a, b, t) => a + (b - a) * t;

export const lerpAngle = (a, b, t) => {
  let diff = (b - a) % (Math.PI * 2);
  if (diff < -Math.PI) diff += Math.PI * 2;
  if (diff > Math.PI) diff -= Math.PI * 2;
  return a + diff * t;
};

// ── 1. 繪製微風吹拂海浪擺動的「魯凱純白百合花」與石板草叢 ──
export const drawLilyBushBorder = (ctx, w, h, time, cheerProgress = 0) => {
  ctx.save();

  // 頂部與底部石板矮牆基底
  ctx.fillStyle = '#292524'; // 深板岩色
  ctx.fillRect(0, 0, w, 24);
  ctx.fillRect(0, h - 24, w, 24);
  ctx.fillRect(0, 0, 22, h);
  ctx.fillRect(w - 22, 0, 22, h);

  // 石板紋理裂痕線條
  ctx.strokeStyle = '#44403c';
  ctx.lineWidth = 1.5;
  for (let x = 40; x < w; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 10, 24);
    ctx.moveTo(x + 20, h - 24);
    ctx.lineTo(x + 30, h);
    ctx.stroke();
  }

  // 頂部石板上的盛開白色百合花群與高山蕨類（微風如波浪般依序搖曳）
  const lilyCount = Math.floor(w / 70);
  for (let i = 0; i < lilyCount; i++) {
    const lx = 45 + i * 70;
    // 空間前進波：每朵百合與草葉依 X 座標相位延遲，呈現「風吹草偃」如波浪滾動效果！
    const wavePhase = time * 2.2 - lx * 0.015;
    const sway = Math.sin(wavePhase) * 0.18 + (cheerProgress > 0 ? Math.sin(time * 8) * 0.25 : 0);

    // 1) 繪製百合花朵 (頂部)
    drawSingleLily(ctx, lx, 22, sway, -1);

    // 2) 繪製底部的百合花朵 (底部)
    if (i % 2 === 0) {
      const bSway = Math.sin(wavePhase + 1.2) * 0.18;
      drawSingleLily(ctx, lx + 20, h - 22, bSway, 1);
    }
  }

  ctx.restore();
};

// 繪製單朵生動盛開的白色百合花
const drawSingleLily = (ctx, x, y, sway, dirY = -1) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(sway);

  // 鮮綠花莖
  ctx.strokeStyle = '#15803d';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(dirY * 4, dirY * 12, dirY * 2, dirY * 22);
  ctx.stroke();

  // 兩側長條披針形綠葉
  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.ellipse(-8, dirY * 10, 10, 3, dirY * -0.5, 0, Math.PI * 2);
  ctx.ellipse(8, dirY * 12, 10, 3, dirY * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // 花朵基底平移至花頸
  ctx.translate(dirY * 2, dirY * 22);

  // 盛開號角型純白花瓣（外層花瓣 3 片，內層花瓣 3 片）
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
  ctx.shadowBlur = 6;

  // 花托微青綠
  ctx.strokeStyle = '#86efac';
  ctx.lineWidth = 1;

  // 6 片修長百合花瓣
  for (let p = 0; p < 6; p++) {
    const angle = (p * Math.PI) / 3 - Math.PI / 2;
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-4, -10, 0, -18); // 花瓣尖端向外微翻卷
    ctx.quadraticCurveTo(4, -10, 0, 0);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // 金黃色百合花蕊 (花絲與金黃花藥)
  ctx.shadowBlur = 0;
  for (let a = 0; a < 5; a++) {
    const antherAngle = (a * (Math.PI * 2)) / 5;
    ctx.save();
    ctx.rotate(antherAngle);
    // 花絲
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -9);
    ctx.stroke();
    // 金黃花藥
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.ellipse(0, -10, 2.5, 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 花心嫩綠小點
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

// ── 2. 繪製熱帶雨林茂密灌木圍欄 (Jungle Bush Border) ──
export const drawJungleBushBorder = (ctx, w, h, time) => {
  ctx.save();

  // 頂部與底部深綠雨林暗帶
  ctx.fillStyle = '#064e3b';
  ctx.fillRect(0, 0, w, 22);
  ctx.fillRect(0, h - 22, w, 22);
  ctx.fillRect(0, 0, 20, h);
  ctx.fillRect(w - 20, 0, 20, h);

  // 龜背芋與棕櫚葉叢（微風連續波浪）
  const bushCount = Math.floor(w / 45);
  for (let i = 0; i < bushCount; i++) {
    const bx = 30 + i * 45;
    const wave = Math.sin(time * 2.0 - bx * 0.02) * 0.15;

    // 上方灌木葉
    ctx.save();
    ctx.translate(bx, 14);
    ctx.rotate(wave);
    ctx.fillStyle = i % 2 === 0 ? '#059669' : '#10b981';
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI);
    ctx.fill();
    // 葉脈
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.lineTo(12, 0);
    ctx.stroke();
    ctx.restore();

    // 下方灌木葉
    ctx.save();
    ctx.translate(bx + 15, h - 14);
    ctx.rotate(-wave);
    ctx.fillStyle = i % 2 === 0 ? '#10b981' : '#34d399';
    ctx.beginPath();
    ctx.arc(0, 0, 16, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
};

// ── 3. 繪製林間地表光斑 (Dappled Sunlight) ──
export const drawDappledSunlight = (ctx, w, h, time) => {
  ctx.save();
  ctx.globalAlpha = 0.14;
  ctx.fillStyle = '#fef08a'; // 陽光暖金

  const spots = [
    { x: 0.25, y: 0.35, r: 65, speed: 0.4 },
    { x: 0.65, y: 0.25, r: 85, speed: 0.3 },
    { x: 0.45, y: 0.70, r: 75, speed: 0.5 },
    { x: 0.80, y: 0.60, r: 60, speed: 0.35 }
  ];

  spots.forEach((sp, idx) => {
    const ox = Math.sin(time * sp.speed + idx) * 16;
    const oy = Math.cos(time * sp.speed + idx * 2) * 12;
    ctx.beginPath();
    ctx.arc(w * sp.x + ox, h * sp.y + oy, sp.r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
};

// ── 4. 繪製神獸百步蛇身軀與頭部 (Sacred Hundred-Pace Snake) ──
export const drawHundredPaceSnake = (ctx, spine, time, bulges = [], isDead = false) => {
  if (!spine || spine.length < 2) return;
  ctx.save();

  const totalSegs = spine.length;

  // 1) 繪製蛇身與經典黑白黃三角菱形紋 (由尾至頭畫，保證頭部壓在最上層)
  for (let i = totalSegs - 1; i >= 1; i--) {
    const curr = spine[i];
    const prev = spine[i - 1];
    const next = spine[i + 1] || curr;

    // 粗細漸變（前粗後細）
    const taper = 1.0 - (i / totalSegs) * 0.45;
    let radius = 17 * taper;

    // 檢查是否有吞嚥字母的波浪隆起 (Belly Bulge)
    bulges.forEach(b => {
      const frac = i / totalSegs;
      const dist = Math.abs(frac - b.progress);
      if (dist < 0.16) {
        const bulgeFactor = Math.cos((dist / 0.16) * (Math.PI / 2)) * 0.5;
        radius *= 1.0 + bulgeFactor;
      }
    });

    const angle = Math.atan2(curr.y - prev.y, curr.x - prev.x);

    // 蛇身底色：深板岩暗褐
    ctx.fillStyle = '#292524';
    ctx.strokeStyle = '#1c1917';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(curr.x, curr.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 經典百步蛇背脊「祖靈幾何三角菱形紋」
    ctx.save();
    ctx.translate(curr.x, curr.y);
    ctx.rotate(angle);

    // 白色外三角
    ctx.fillStyle = '#f5f5f4';
    ctx.beginPath();
    ctx.moveTo(-radius * 0.7, 0);
    ctx.lineTo(0, -radius * 0.85);
    ctx.lineTo(radius * 0.7, 0);
    ctx.lineTo(0, radius * 0.85);
    ctx.closePath();
    ctx.fill();

    // 金黃/琥珀色內三角菱形
    ctx.fillStyle = i % 2 === 0 ? '#eab308' : '#d97706';
    ctx.beginPath();
    ctx.moveTo(-radius * 0.45, 0);
    ctx.lineTo(0, -radius * 0.55);
    ctx.lineTo(radius * 0.45, 0);
    ctx.lineTo(0, radius * 0.55);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // 2) 繪製百步蛇頭部 (Head)
  const head = spine[0];
  const neck = spine[1];
  const headAngle = Math.atan2(head.y - neck.y, head.x - neck.x);

  ctx.save();
  ctx.translate(head.x, head.y);
  ctx.rotate(headAngle);

  // 吐信：百步蛇深暗赤紅分叉舌
  const tongueTimer = (time * 3) % 2.5;
  if (tongueTimer < 0.6 && !isDead) {
    const tLen = 14 + Math.sin(time * 25) * 4;
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(18, 0);
    ctx.lineTo(18 + tLen, 0);
    // 分叉
    ctx.lineTo(18 + tLen + 5, -3.5);
    ctx.moveTo(18 + tLen, 0);
    ctx.lineTo(18 + tLen + 5, 3.5);
    ctx.stroke();
  }

  // 百步蛇經典頭型：微翹尖吻三角形
  ctx.fillStyle = '#44403c';
  ctx.strokeStyle = '#1c1917';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(24, 0); // 尖翹鼻尖！
  ctx.lineTo(10, -15);
  ctx.lineTo(-12, -14);
  ctx.lineTo(-14, 0);
  ctx.lineTo(-12, 14);
  ctx.lineTo(10, 15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 鼻尖上的微翹隆起特徵（百步蛇標誌）
  ctx.fillStyle = '#78716c';
  ctx.beginPath();
  ctx.arc(22, 0, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // 頭頂祖靈菱形王冠圖騰
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.moveTo(6, 0);
  ctx.lineTo(-2, -6);
  ctx.lineTo(-8, 0);
  ctx.lineTo(-2, 6);
  ctx.closePath();
  ctx.fill();

  // 眼睛（失誤變 >_< 蚊香眼，正常時為有神琥珀金眼）
  if (isDead) {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    // 左眼 >
    ctx.beginPath();
    ctx.moveTo(4, -8); ctx.lineTo(8, -6); ctx.lineTo(4, -4);
    ctx.stroke();
    // 右眼 >
    ctx.beginPath();
    ctx.moveTo(4, 4); ctx.lineTo(8, 6); ctx.lineTo(4, 8);
    ctx.stroke();
  } else {
    // 琥珀金眼球
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(6, -8, 4.5, 0, Math.PI * 2);
    ctx.arc(6, 8, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // 銳利豎瞳
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(6.5, -8, 1.2, 3.5, 0, 0, Math.PI * 2);
    ctx.ellipse(6.5, 8, 1.2, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 眼神光
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(5.5, -9, 1.2, 0, Math.PI * 2);
    ctx.arc(5.5, 7, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
  ctx.restore();
};

// ── 5. 繪製萌趣小青蛇身軀與頭部 (Emerald Jungle Snake) ──
export const drawGreenSnake = (ctx, spine, time, bulges = [], isDead = false) => {
  if (!spine || spine.length < 2) return;
  ctx.save();

  const totalSegs = spine.length;

  for (let i = totalSegs - 1; i >= 1; i--) {
    const curr = spine[i];
    const prev = spine[i - 1];
    const taper = 1.0 - (i / totalSegs) * 0.45;
    let radius = 17 * taper;

    bulges.forEach(b => {
      const frac = i / totalSegs;
      const dist = Math.abs(frac - b.progress);
      if (dist < 0.16) {
        const bulgeFactor = Math.cos((dist / 0.16) * (Math.PI / 2)) * 0.5;
        radius *= 1.0 + bulgeFactor;
      }
    });

    // 翡翠綠漸變
    ctx.fillStyle = i % 2 === 0 ? '#10b981' : '#34d399';
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(curr.x, curr.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 金黃背部圓形斑點
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(curr.x, curr.y, radius * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  // 繪製圓萌頭部
  const head = spine[0];
  const neck = spine[1];
  const headAngle = Math.atan2(head.y - neck.y, head.x - neck.x);

  ctx.save();
  ctx.translate(head.x, head.y);
  ctx.rotate(headAngle);

  // 吐信：可愛粉紅舌
  const tongueTimer = (time * 3) % 2.5;
  if (tongueTimer < 0.6 && !isDead) {
    const tLen = 14 + Math.sin(time * 25) * 4;
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(16 + tLen, 0);
    ctx.lineTo(16 + tLen + 4, -3);
    ctx.moveTo(16 + tLen, 0);
    ctx.lineTo(16 + tLen + 4, 3);
    ctx.stroke();
  }

  // 圓萌頭形
  ctx.fillStyle = '#10b981';
  ctx.strokeStyle = '#047857';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(3, 0, 18, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 腮紅
  ctx.fillStyle = 'rgba(251, 113, 133, 0.4)';
  ctx.beginPath();
  ctx.arc(-2, -10, 4, 0, Math.PI * 2);
  ctx.arc(-2, 10, 4, 0, Math.PI * 2);
  ctx.fill();

  // 大眼睛
  if (isDead) {
    ctx.strokeStyle = '#064e3b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(4, -8); ctx.lineTo(10, -5); ctx.lineTo(4, -2);
    ctx.moveTo(4, 2); ctx.lineTo(10, 5); ctx.lineTo(4, 8);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(6, -7, 5, 0, Math.PI * 2);
    ctx.arc(6, 7, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(7.5, -7, 3, 0, Math.PI * 2);
    ctx.arc(7.5, 7, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(6.5, -8, 1.4, 0, Math.PI * 2);
    ctx.arc(6.5, 6, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
  ctx.restore();
};

// ── 6. 繪製字母水果 / 石板雕刻 (Letter Pods) ──
export const drawLetterPod = (ctx, letter, theme, isNextTarget, time) => {
  ctx.save();
  ctx.translate(letter.renderX, letter.renderY);

  const bounce = isNextTarget ? Math.sin(time * 6) * 2.5 : 0;
  ctx.translate(0, bounce);

  if (theme === 'indigenous') {
    // 霧台石板雕刻浮雕 (原民風)
    if (isNextTarget) {
      // 祖靈神聖光環
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 16;
    }

    // 板岩石牌外形
    ctx.fillStyle = isNextTarget ? '#44403c' : '#292524';
    ctx.strokeStyle = isNextTarget ? '#facc15' : '#78716c';
    ctx.lineWidth = isNextTarget ? 3 : 2;
    ctx.beginPath();
    ctx.roundRect(-18, -18, 36, 36, 10);
    ctx.fill();
    ctx.stroke();

    // 刻紋裝飾角
    ctx.strokeStyle = isNextTarget ? '#fde047' : '#a8a29e';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-14, -14, 28, 28);

    // 金黃/純白字母雕刻
    ctx.fillStyle = isNextTarget ? '#fef08a' : '#f5f5f4';
    ctx.font = 'bold 20px Fredoka, Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter.char.toUpperCase(), 0, 1);
  } else {
    // 熱帶水果莢 (雨林風)
    if (isNextTarget) {
      ctx.shadowColor = '#a3e635';
      ctx.shadowBlur = 18;
    }

    // 果實底圓
    ctx.fillStyle = isNextTarget ? '#facc15' : '#ffffff';
    ctx.strokeStyle = isNextTarget ? '#eab308' : '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 果蒂頂葉
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(0, -18, 5, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 字母文字
    ctx.fillStyle = isNextTarget ? '#78350f' : '#064e3b';
    ctx.font = 'bold 20px Fredoka, Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter.char.toUpperCase(), 0, 1);
  }

  ctx.restore();
};

// ── 7. 繪製彩蛋：台灣黑熊 (Formosan Black Bear) ──
export const drawBlackBear = (ctx, x, y, time, isCheering) => {
  ctx.save();
  ctx.translate(x, y);

  const bob = isCheering ? Math.sin(time * 10) * 6 : Math.sin(time * 1.5) * 1.5;
  ctx.translate(0, bob);

  // 熊頭圓體 (深黑)
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.ellipse(0, 0, 20, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // 圓耳朵 (兩側)
  ctx.beginPath();
  ctx.arc(-16, -14, 7, 0, Math.PI * 2);
  ctx.arc(16, -14, 7, 0, Math.PI * 2);
  ctx.fill();
  // 耳內暖粉
  ctx.fillStyle = '#78716c';
  ctx.beginPath();
  ctx.arc(-16, -14, 3.5, 0, Math.PI * 2);
  ctx.arc(16, -14, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // 經典標誌性「白色 V 字紋胸徽」！
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-11, 8);
  ctx.lineTo(0, 16);
  ctx.lineTo(11, 8);
  ctx.stroke();

  // 鼻吻 (淺褐)
  ctx.fillStyle = '#a8a29e';
  ctx.beginPath();
  ctx.ellipse(0, 2, 8, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  // 黑鼻子
  ctx.fillStyle = '#0c0a09';
  ctx.beginPath();
  ctx.ellipse(0, 0, 3.5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 亮眼睛
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

  // 答對時高舉熊掌喝采！
  if (isCheering) {
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.arc(-22, -6, 6, 0, Math.PI * 2);
    ctx.arc(22, -6, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
};

// ── 8. 繪製彩蛋：台灣雲豹 (Taiwan Clouded Leopard) ──
export const drawCloudedLeopard = (ctx, x, y, time) => {
  ctx.save();
  ctx.translate(x, y);

  const breathe = Math.sin(time * 2) * 1.5;
  ctx.translate(0, breathe);

  // 豹頭底色 (黃褐)
  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.ellipse(0, 0, 17, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // 貓科耳朵
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.moveTo(-14, -6); ctx.lineTo(-12, -18); ctx.lineTo(-4, -12); ctx.closePath();
  ctx.moveTo(14, -6); ctx.lineTo(12, -18); ctx.lineTo(4, -12); ctx.closePath();
  ctx.fill();

  // 美麗的黑邊「雲狀斑紋（Cloud Rosettes）」
  ctx.strokeStyle = '#1c1917';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(-7, 4, 3, 0.5, Math.PI * 1.8);
  ctx.arc(7, 4, 3, 0.2, Math.PI * 1.5);
  ctx.stroke();

  // 鼻吻
  ctx.fillStyle = '#fef3c7';
  ctx.beginPath();
  ctx.ellipse(0, 4, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(0, 3, 2, 0, Math.PI * 2);
  ctx.fill();

  // 神秘琥珀眼球
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.ellipse(-6, -3, 3, 4, 0, 0, Math.PI * 2);
  ctx.ellipse(6, -3, 3, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // 豎瞳
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(-6, -3, 1, 3.5, 0, 0, Math.PI * 2);
  ctx.ellipse(6, -3, 1, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 輕擺的豹尾巴
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

// ── 9. 繪製彩蛋：熱帶小猴子 (Jungle Monkey) ──
export const drawJungleMonkey = (ctx, x, y, time, isCheering) => {
  ctx.save();
  ctx.translate(x, y);

  const bob = isCheering ? Math.sin(time * 12) * 5 : Math.sin(time * 1.8) * 1.5;
  ctx.translate(0, bob);

  // 棕色猴頭
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fill();

  // 圓耳朵
  ctx.beginPath();
  ctx.arc(-18, 0, 7, 0, Math.PI * 2);
  ctx.arc(18, 0, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(-18, 0, 4, 0, Math.PI * 2);
  ctx.arc(18, 0, 4, 0, Math.PI * 2);
  ctx.fill();

  // 桃心臉龐
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.ellipse(0, 3, 13, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // 小黑眼
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(-5, 0, 2.5, 0, Math.PI * 2);
  ctx.arc(5, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // 微笑
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, 5, 4, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // 慶祝時拿著金黃香蕉！
  if (isCheering) {
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(16, -4, 8, 0.4, Math.PI * 0.9);
    ctx.stroke();
  }

  ctx.restore();
};

// ── 10. 繪製彩蛋：藍色閃蝶 (Blue Morpho Butterfly) ──
export const drawButterfly = (ctx, x, y, angle, time) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // 快速拍翅物理
  const flap = Math.sin(time * 16);
  ctx.scale(flap, 1);

  // 耀眼電光藍翅膀
  ctx.fillStyle = '#0284c7';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;

  // 上翅
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-14, -14, -18, -6, 0, -2);
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(14, -14, 18, -6, 0, -2);
  ctx.fill(); ctx.stroke();

  // 下翅
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-10, 4, -12, 12, 0, 4);
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(10, 4, 12, 12, 0, 4);
  ctx.fill(); ctx.stroke();

  // 細長黑軀幹
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(0, 0, 1.5, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};
