const sharp = require('sharp');
const fs = require('fs');

async function measureExactRev2() {
  const baseFile = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_canal_market_base_v2_1792829379631.jpg';
  const diffFile = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_canal_market_diff_v1_1792829455967.jpg';

  const baseBuf = await sharp(baseFile).raw().toBuffer();
  const diffBuf = await sharp(diffFile).raw().toBuffer();
  const w = 1376;
  const h = 768;

  // Let's define the search regions for the 8 items on Rev 2 based on the grid:
  // 1. Grape: upper-left pergola canopy (x: 50~450, y: 50~350)
  // 2. Banana: hanging basket (x: 50~150, y: 400~600)
  // 3. Apple: bottom-left crate (x: 40~200, y: 650~768)
  // 4. Cat: bridge railing (x: 350~450, y: 480~580)
  // 5. Dog: cobblestones (x: 220~350, y: 550~750)
  // 6. Fish: canal (x: 320~420, y: 680~768)
  // 7. Elephant: ground fountain (x: 500~650, y: 600~768)
  // 8. Pumpkin: windowsill (x: 580~680, y: 550~680)

  // Wait! Look at the grid preview: the left half is 1376 wide!
  // In amsterdam_v2_grid_preview.jpg, the yellow grid lines go from 0 to 1300 across the left image!
  // Let's read the yellow numbers on the top of the left image:
  // 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300!
  // Grape: x is between 100 and 500!
  // Banana: x is between 100 and 200! y is between 400 and 600!
  // Apple: x is between 40 and 200! y is between 650 and 768!
  // Cat: x is between 750 and 850! y is between 480 and 580!
  // Dog: x is between 500 and 650! y is between 550 and 750!
  // Fish: x is between 680 and 800! y is between 680 and 768!
  // Elephant: x is between 1000 and 1250! y is between 600 and 768!
  // Pumpkin: x is between 1200 and 1350! y is between 550 and 680!

  const searchZones = [
    { name: 'grape', wordZh: '葡萄', minX: 80, maxX: 550, minY: 50, maxY: 380 },
    { name: 'banana', wordZh: '香蕉', minX: 90, maxX: 250, minY: 400, maxY: 620 },
    { name: 'apple', wordZh: '蘋果', minX: 40, maxX: 260, minY: 660, maxY: 768 },
    { name: 'cat', wordZh: '貓咪', minX: 720, maxX: 880, minY: 480, maxY: 580 },
    { name: 'dog', wordZh: '狗狗', minX: 480, maxX: 680, minY: 560, maxY: 750 },
    { name: 'fish', wordZh: '魚兒', minX: 680, maxX: 820, minY: 680, maxY: 768 },
    { name: 'elephant', wordZh: '大象', minX: 1000, maxX: 1250, minY: 600, maxY: 768 },
    { name: 'pumpkin', wordZh: '南瓜', minX: 1180, maxX: 1350, minY: 550, maxY: 680 }
  ];

  console.log('--- MEASURING REVISION 2 ITEMS ---');
  const results = [];
  for (const z of searchZones) {
    let sumX = 0, sumY = 0, count = 0;
    let bMinX = Infinity, bMaxX = -Infinity, bMinY = Infinity, bMaxY = -Infinity;

    for (let y = z.minY; y < z.maxY; y++) {
      for (let x = z.minX; x < z.maxX; x++) {
        const idx = (y * w + x) * 3;
        const dist = Math.abs(baseBuf[idx] - diffBuf[idx]) +
                     Math.abs(baseBuf[idx+1] - diffBuf[idx+1]) +
                     Math.abs(baseBuf[idx+2] - diffBuf[idx+2]);
        if (dist > 45) {
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
      console.log(`Item [${z.name} - ${z.wordZh}]: Center=(${cx}, ${cy}), rx=${rx}, ry=${ry}, bounds=[${bMinX},${bMinY} to ${bMaxX},${bMaxY}], pixels=${count}`);
      results.push({ name: z.name, wordZh: z.wordZh, cx, cy, rx, ry, bounds: [bMinX, bMinY, bMaxX, bMaxY], count });
    } else {
      console.log(`Item [${z.name} - ${z.wordZh}]: NO DIFF DETECTED!`);
    }
  }

  // Check stray diff pixels
  let strayCount = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 3;
      const dist = Math.abs(baseBuf[idx] - diffBuf[idx]) +
                   Math.abs(baseBuf[idx+1] - diffBuf[idx+1]) +
                   Math.abs(baseBuf[idx+2] - diffBuf[idx+2]);
      if (dist > 45) {
        const inAny = results.some(r => {
          return x >= r.bounds[0] - 20 && x <= r.bounds[2] + 20 &&
                 y >= r.bounds[1] - 20 && y <= r.bounds[3] + 20;
        });
        if (!inAny) strayCount++;
      }
    }
  }
  console.log('Stray diff pixels outside all 8 targets:', strayCount);
}

measureExactRev2().catch(console.error);
