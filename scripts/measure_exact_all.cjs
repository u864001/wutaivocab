const sharp = require('sharp');
const fs = require('fs');

async function measureExactAll() {
  const baseFile = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_market_base_1792828395305.jpg';
  const diffFile = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_market_difference_1792828472957.jpg';

  const baseBuf = await sharp(baseFile).raw().toBuffer();
  const diffBuf = await sharp(diffFile).raw().toBuffer();
  const w = 1376;
  const h = 768;

  // Let's find diff pixels in generous boxes around each expected item:
  const searchZones = [
    { name: 'grape', minX: 0, maxX: 260, minY: 0, maxY: 300 },
    { name: 'banana', minX: 250, maxX: 450, minY: 320, maxY: 600 },
    { name: 'apple', minX: 0, maxX: 260, minY: 550, maxY: 768 },
    { name: 'cat', minX: 600, maxX: 750, minY: 280, maxY: 450 },
    { name: 'dog', minX: 800, maxX: 1050, minY: 400, maxY: 650 },
    { name: 'fish', minX: 580, maxX: 780, minY: 580, maxY: 768 },
    { name: 'elephant', minX: 1100, maxX: 1350, minY: 50, maxY: 300 },
    { name: 'pumpkin', minX: 1100, maxX: 1350, minY: 380, maxY: 600 }
  ];

  console.log('--- EXACT MEASUREMENTS ---');
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

    const cx = Math.round(sumX / count);
    const cy = Math.round(sumY / count);
    const rx = Math.round((bMaxX - bMinX) / 2);
    const ry = Math.round((bMaxY - bMinY) / 2);
    console.log(`Item [${z.name}]: center=(${cx}, ${cy}), rx=${rx}, ry=${ry}, bounds=[${bMinX},${bMinY} to ${bMaxX},${bMaxY}], pixels=${count}`);
  }
}

measureExactAll().catch(console.error);
