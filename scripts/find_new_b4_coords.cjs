const sharp = require('sharp');

async function findCoords() {
  const baseImg = await sharp('public/assets/spotter/book4_scene2_base.jpg').raw().toBuffer({ resolveWithObject: true });
  const diffAImg = await sharp('public/assets/spotter/book4_scene2_diff.jpg').raw().toBuffer({ resolveWithObject: true });
  const diffBImg = await sharp('public/assets/spotter/book4_scene2_diff_varb.jpg').raw().toBuffer({ resolveWithObject: true });
  const diffCImg = await sharp('public/assets/spotter/book4_scene2_diff_varc.jpg').raw().toBuffer({ resolveWithObject: true });

  const w = baseImg.info.width, h = baseImg.info.height;
  const bData = baseImg.data;

  // Search regions for each target:
  const targetRegions = [
    { word: 'chair', name: 'CHAIR (椅子)', box: [0, 420, 380, 768] },
    { word: 'hat', name: 'HAT (帽子)', box: [380, 150, 480, 300] },
    { word: 'bus', name: 'BUS (公車)', box: [380, 250, 650, 450] },
    { word: 'table', name: 'TABLE (桌子)', box: [480, 520, 750, 768] },
    { word: 'box', name: 'BOX (禮盒)', box: [750, 270, 950, 460] },
    { word: 'bag', name: 'BAG (提包)', box: [780, 520, 1050, 768] },
    { word: 'clock', name: 'CLOCK (時鐘)', box: [850, 100, 980, 260] },
    { word: 'basket', name: 'BASKET (提籃)', box: [1080, 480, 1376, 750] }
  ];

  console.log('=== EXACT COORDINATE CALIBRATION ACROSS ALL VARIANTS ===');
  const results = [];

  for (const t of targetRegions) {
    let allMinX = 9999, allMaxX = 0, allMinY = 9999, allMaxY = 0;
    let totalSumX = 0, totalSumY = 0, totalCount = 0;

    [diffAImg.data, diffBImg.data, diffCImg.data].forEach(diffData => {
      for (let y = t.box[1]; y < t.box[3]; y++) {
        for (let x = t.box[0]; x < t.box[2]; x++) {
          const idx = (y * w + x) * 3;
          const d = Math.max(
            Math.abs(bData[idx] - diffData[idx]),
            Math.abs(bData[idx+1] - diffData[idx+1]),
            Math.abs(bData[idx+2] - diffData[idx+2])
          );
          if (d > 35) {
            totalSumX += x;
            totalSumY += y;
            totalCount++;
            allMinX = Math.min(allMinX, x);
            allMaxX = Math.max(allMaxX, x);
            allMinY = Math.min(allMinY, y);
            allMaxY = Math.max(allMaxY, y);
          }
        }
      }
    });

    const cx = Math.round(totalSumX / totalCount);
    const cy = Math.round(totalSumY / totalCount);
    const bw = allMaxX - allMinX;
    const bh = allMaxY - allMinY;
    const rx = Math.ceil(bw / 2);
    const ry = Math.ceil(bh / 2);

    console.log(`${t.name}:`);
    console.log(`  Center: (${cx}, ${cy})`);
    console.log(`  BBox: [x: ${allMinX}..${allMaxX}, y: ${allMinY}..${allMaxY}] (w: ${bw}, h: ${bh})`);
    console.log(`  Suggested rx: ${rx}, ry: ${ry}\n`);

    results.push({ word: t.word, name: t.name, cx, cy, rx, ry, minX: allMinX, maxX: allMaxX, minY: allMinY, maxY: allMaxY });
  }

  // Also check if any other unexpected differences exist outside these regions
  // to ensure background items (dog, cat, bike, boat, etc.) are 100% identical!
  let backgroundDiffPixels = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let inAnyBox = false;
      for (const t of results) {
        if (x >= t.minX - 10 && x <= t.maxX + 10 && y >= t.minY - 10 && y <= t.maxY + 10) {
          inAnyBox = true;
          break;
        }
      }
      if (!inAnyBox) {
        const idx = (y * w + x) * 3;
        const d = Math.max(
          Math.abs(bData[idx] - diffAImg.data[idx]),
          Math.abs(bData[idx+1] - diffAImg.data[idx+1]),
          Math.abs(bData[idx+2] - diffAImg.data[idx+2])
        );
        if (d > 45) {
          backgroundDiffPixels++;
        }
      }
    }
  }
  console.log('Background non-target diff pixels (cleanliness score):', backgroundDiffPixels);
}

findCoords().catch(console.error);