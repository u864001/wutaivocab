const sharp = require('sharp');

async function measureExactCoords() {
  const meta = await sharp('public/assets/spotter/book2_base.jpg').metadata();
  console.log('Book 2 dimensions:', meta.width, 'x', meta.height);

  // Let's find pixel diff coordinates between book2_base and book2_diff
  const bBuf = await sharp('public/assets/spotter/book2_base.jpg').raw().toBuffer();
  const dBuf = await sharp('public/assets/spotter/book2_diff.jpg').raw().toBuffer();
  const w = meta.width;
  const h = meta.height;

  // Let's divide into regions and find the centroid of diffs
  const regions = [
    { name: 'cat', left: 40, top: 460, width: 200, height: 160 },
    { name: 'ball', left: 240, top: 620, width: 150, height: 140 },
    { name: 'dog', left: 360, top: 520, width: 140, height: 180 },
    { name: 'rabbit', left: 480, top: 520, width: 120, height: 120 },
    { name: 'turtle', left: 550, top: 650, width: 100, height: 100 },
    { name: 'frog', left: 740, top: 670, width: 130, height: 95 },
    { name: 'kite', left: 500, top: 30, width: 220, height: 210 },
    { name: 'bird', left: 810, top: 430, width: 160, height: 110 }
  ];

  for (const r of regions) {
    let sumX = 0, sumY = 0, cnt = 0;
    let minX = w, maxX = 0, minY = h, maxY = 0;
    for (let y = r.top; y < r.top + r.height && y < h; y++) {
      for (let x = r.left; x < r.left + r.width && x < w; x++) {
        const idx = (y * w + x) * meta.channels;
        const diff = (Math.abs(bBuf[idx] - dBuf[idx]) + Math.abs(bBuf[idx+1] - dBuf[idx+1]) + Math.abs(bBuf[idx+2] - dBuf[idx+2])) / 3;
        if (diff > 25) {
          sumX += x;
          sumY += y;
          cnt++;
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }
    console.log(`B2 ${r.name}: cnt=${cnt}, cx=${Math.round(sumX/cnt)}, cy=${Math.round(sumY/cnt)}, bbox=[${minX}, ${minY}, ${maxX-minX}x${maxY-minY}]`);
  }
}

measureExactCoords().catch(console.error);
