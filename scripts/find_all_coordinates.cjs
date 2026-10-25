const sharp = require('sharp');
const fs = require('fs');

async function locateDiffs() {
  const baseFile = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_market_base_1792828395305.jpg';
  const diffFile = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_market_difference_1792828472957.jpg';

  const baseBuf = await sharp(baseFile).raw().toBuffer();
  const diffBuf = await sharp(diffFile).raw().toBuffer();
  const w = 1376;
  const h = 768;

  // We have 8 known items:
  // 1. Grapes (top-left trellis): x: 0~250, y: 0~350
  // 2. Bananas (mid-left basket): x: 100~300, y: 350~600
  // 3. Apples (bottom-left crate): x: 0~250, y: 550~768
  // 4. Cat (center-left bridge railing): x: 350~550, y: 350~550
  // 5. Fish (canal water): x: 600~800, y: 550~768
  // 6. Dog (cobblestone): x: 750~950, y: 450~750
  // 7. Elephant (upper-right fountain): x: 1000~1350, y: 50~350
  // 8. Pumpkin (mid-right windowsill): x: 1000~1350, y: 400~700

  const regions = [
    { name: 'grape', wordZh: '葡萄', minX: 0, maxX: 260, minY: 0, maxY: 350 },
    { name: 'banana', wordZh: '香蕉', minX: 100, maxX: 280, minY: 350, maxY: 620 },
    { name: 'apple', wordZh: '蘋果', minX: 0, maxX: 260, minY: 550, maxY: 768 },
    { name: 'cat', wordZh: '貓咪', minX: 350, maxX: 550, minY: 350, maxY: 550 },
    { name: 'fish', wordZh: '魚兒', minX: 600, maxX: 800, minY: 550, maxY: 768 },
    { name: 'dog', wordZh: '狗狗', minX: 750, maxX: 950, minY: 450, maxY: 750 },
    { name: 'elephant', wordZh: '大象', minX: 1050, maxX: 1350, minY: 50, maxY: 350 },
    { name: 'pumpkin', wordZh: '南瓜', minX: 1050, maxX: 1350, minY: 400, maxY: 700 }
  ];

  const results = [];

  for (const reg of regions) {
    let sumX = 0, sumY = 0, count = 0;
    let bMinX = Infinity, bMaxX = -Infinity, bMinY = Infinity, bMaxY = -Infinity;

    for (let y = reg.minY; y < reg.maxY; y++) {
      for (let x = reg.minX; x < reg.maxX; x++) {
        const idx = (y * w + x) * 3;
        const dist = Math.abs(baseBuf[idx] - diffBuf[idx]) +
                     Math.abs(baseBuf[idx + 1] - diffBuf[idx + 1]) +
                     Math.abs(baseBuf[idx + 2] - diffBuf[idx + 2]);
        if (dist > 50) {
          sumX += x;
          sumY += y;
          count++;
          bMinX = Math.min(bMinX, x);
          bMaxX = Math.max(bMaxX, x);
          bMinY = Math.min(bMinY, y);
          bMaxY = Math.max(bMaxY, y);
        }
      }
    }

    if (count > 0) {
      const cx = Math.round(sumX / count);
      const cy = Math.round(sumY / count);
      const rx = Math.round((bMaxX - bMinX) / 2);
      const ry = Math.round((bMaxY - bMinY) / 2);
      console.log(`[${reg.name} - ${reg.wordZh}] Center: (${cx}, ${cy}), rx: ${rx}, ry: ${ry}, bounds: [${bMinX},${bMinY} to ${bMaxX},${bMaxY}], pixels: ${count}`);
      results.push({
        word: reg.name,
        wordZh: reg.wordZh,
        x: cx,
        y: cy,
        rx: Math.max(45, rx + 10),
        ry: Math.max(45, ry + 10),
        bounds: [bMinX, bMinY, bMaxX, bMaxY]
      });
    } else {
      console.log(`[${reg.name} - ${reg.wordZh}] NO DIFF DETECTED in region!`);
    }
  }

  // Also check if there are any UNEXPECTED diffs outside these 8 regions
  let strayPixels = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 3;
      const dist = Math.abs(baseBuf[idx] - diffBuf[idx]) +
                   Math.abs(baseBuf[idx + 1] - diffBuf[idx + 1]) +
                   Math.abs(baseBuf[idx + 2] - diffBuf[idx + 2]);
      if (dist > 50) {
        const inAny = results.some(r => {
          return x >= r.bounds[0] - 15 && x <= r.bounds[2] + 15 &&
                 y >= r.bounds[1] - 15 && y <= r.bounds[3] + 15;
        });
        if (!inAny) strayPixels++;
      }
    }
  }
  console.log('Stray diff pixels outside all 8 targets:', strayPixels);
}

locateDiffs().catch(console.error);
