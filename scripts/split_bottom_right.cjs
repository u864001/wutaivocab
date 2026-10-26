const sharp = require('sharp');

async function splitBottomRight() {
  const baseImg = await sharp('public/assets/spotter/book4_scene2_base.jpg').raw().toBuffer({ resolveWithObject: true });
  const diffAImg = await sharp('public/assets/spotter/book4_scene2_diff.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = baseImg.info.width, h = baseImg.info.height;
  const bData = baseImg.data, aData = diffAImg.data;

  // Let's analyze diffs in three x windows:
  // 1. table: x: 440..740, y: 450..768
  // 2. bag: x: 740..1060, y: 480..768
  // 3. basket: x: 1060..1376, y: 480..768

  function getStats(minX, maxX, minY, maxY, name) {
    let sumX = 0, sumY = 0, count = 0;
    let bMinX = 9999, bMaxX = 0, bMinY = 9999, bMaxY = 0;

    for (let y = minY; y < maxY; y++) {
      for (let x = minX; x < maxX; x++) {
        const idx = (y * w + x) * 3;
        const d = Math.max(Math.abs(bData[idx]-aData[idx]), Math.abs(bData[idx+1]-aData[idx+1]), Math.abs(bData[idx+2]-aData[idx+2]));
        if (d > 35) {
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
    console.log(`${name}: Center=(${cx}, ${cy}) BBox=[x: ${bMinX}..${bMaxX} (rx:${rx}), y: ${bMinY}..${bMaxY} (ry:${ry})] diffPixels=${count}`);
  }

  getStats(440, 740, 450, 768, 'TABLE');
  getStats(740, 1060, 480, 768, 'BAG');
  getStats(1060, 1376, 480, 768, 'BASKET');
  getStats(0, 440, 416, 768, 'CHAIR');
  getStats(300, 450, 120, 320, 'HAT');
  getStats(400, 700, 220, 420, 'BUS');
  getStats(750, 1020, 260, 480, 'BOX');
  getStats(1050, 1280, 60, 260, 'CLOCK');
}

splitBottomRight().catch(console.error);
