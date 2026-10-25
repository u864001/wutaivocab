const sharp = require('sharp');
const fs = require('fs');

async function findCentroidInRegion(baseFile, diffFile, region, threshold = 20) {
  const meta = await sharp(baseFile).metadata();
  const left = Math.max(0, Math.min(meta.width - 1, region.left));
  const top = Math.max(0, Math.min(meta.height - 1, region.top));
  const width = Math.min(meta.width - left, region.width);
  const height = Math.min(meta.height - top, region.height);

  const baseCrop = await sharp(baseFile).extract({ left, top, width, height }).raw().toBuffer();
  const diffCrop = await sharp(diffFile).extract({ left, top, width, height }).raw().toBuffer();
  const channels = meta.channels;

  let sumX = 0, sumY = 0, count = 0;
  let minX = width, maxX = 0, minY = height, maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const dr = Math.abs(baseCrop[idx] - diffCrop[idx]);
      const dg = Math.abs(baseCrop[idx + 1] - diffCrop[idx + 1]);
      const db = Math.abs(baseCrop[idx + 2] - diffCrop[idx + 2]);
      if ((dr + dg + db) / 3 > threshold) {
        sumX += x;
        sumY += y;
        count++;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (count === 0) return null;
  return {
    cx: Math.round(left + sumX / count),
    cy: Math.round(top + sumY / count),
    minX: left + minX,
    maxX: left + maxX,
    minY: top + minY,
    maxY: top + maxY,
    w: maxX - minX,
    h: maxY - minY,
    count
  };
}

async function calibrateAll() {
  console.log('=== BOOK 2 ===');
  const b2Base = 'public/assets/spotter/book2_base.jpg';
  const b2Diff = 'public/assets/spotter/book2_diff.jpg';
  console.log('cat:', await findCentroidInRegion(b2Base, b2Diff, { left: 60, top: 480, width: 170, height: 120 }));
  console.log('ball:', await findCentroidInRegion(b2Base, b2Diff, { left: 280, top: 680, width: 130, height: 88 }));
  console.log('dog:', await findCentroidInRegion(b2Base, b2Diff, { left: 380, top: 520, width: 150, height: 170 }));
  console.log('rabbit:', await findCentroidInRegion(b2Base, b2Diff, { left: 490, top: 540, width: 110, height: 120 }));
  console.log('turtle:', await findCentroidInRegion(b2Base, b2Diff, { left: 560, top: 660, width: 100, height: 100 }));
  console.log('frog:', await findCentroidInRegion(b2Base, b2Diff, { left: 760, top: 690, width: 130, height: 78 }));
  console.log('kite:', await findCentroidInRegion(b2Base, b2Diff, { left: 520, top: 30, width: 220, height: 210 }));
  console.log('bird:', await findCentroidInRegion(b2Base, b2Diff, { left: 810, top: 440, width: 160, height: 100 }));

  console.log('\n=== BOOK 3 (Sun) ===');
  const b3Base = 'public/assets/spotter/book3_base.jpg';
  const b3Diff = 'public/assets/spotter/book3_diff.jpg';
  console.log('sun:', await findCentroidInRegion(b3Base, b3Diff, { left: 400, top: 20, width: 350, height: 220 }));

  console.log('\n=== BOOK 4 ===');
  const b4Base = 'public/assets/spotter/book4_base.jpg';
  const b4Diff = 'public/assets/spotter/book4_diff.jpg';
  console.log('bus:', await findCentroidInRegion(b4Base, b4Diff, { left: 100, top: 500, width: 220, height: 268 }));
  console.log('bed:', await findCentroidInRegion(b4Base, b4Diff, { left: 160, top: 310, width: 230, height: 160 }));
  console.log('hat:', await findCentroidInRegion(b4Base, b4Diff, { left: 230, top: 160, width: 100, height: 100 }));
  console.log('computer:', await findCentroidInRegion(b4Base, b4Diff, { left: 550, top: 260, width: 120, height: 100 }));
  console.log('book:', await findCentroidInRegion(b4Base, b4Diff, { left: 490, top: 720, width: 90, height: 48 }));
  console.log('sofa:', await findCentroidInRegion(b4Base, b4Diff, { left: 340, top: 650, width: 190, height: 118 }));
  console.log('bag:', await findCentroidInRegion(b4Base, b4Diff, { left: 750, top: 730, width: 90, height: 38 }));
  console.log('clock:', await findCentroidInRegion(b4Base, b4Diff, { left: 830, top: 180, width: 60, height: 60 }));

  console.log('\n=== BOOK 5 ===');
  const b5Base = 'public/assets/spotter/book5_base.jpg';
  const b5Diff = 'public/assets/spotter/book5_diff.jpg';
  console.log('koala:', await findCentroidInRegion(b5Base, b5Diff, { left: 30, top: 170, width: 120, height: 160 }));
  console.log('lion:', await findCentroidInRegion(b5Base, b5Diff, { left: 320, top: 230, width: 130, height: 180 }));
  console.log('milk:', await findCentroidInRegion(b5Base, b5Diff, { left: 190, top: 630, width: 80, height: 138 }));
  console.log('bread:', await findCentroidInRegion(b5Base, b5Diff, { left: 260, top: 640, width: 100, height: 120 }));
  console.log('football:', await findCentroidInRegion(b5Base, b5Diff, { left: 500, top: 690, width: 100, height: 78 }));
  console.log('painting:', await findCentroidInRegion(b5Base, b5Diff, { left: 700, top: 480, width: 100, height: 160 }));
  console.log('cake:', await findCentroidInRegion(b5Base, b5Diff, { left: 790, top: 730, width: 80, height: 38 }));
  console.log('camera:', await findCentroidInRegion(b5Base, b5Diff, { left: 860, top: 560, width: 110, height: 140 }));

  console.log('\n=== BOOK 6 ===');
  const b6Base = 'public/assets/spotter/book6_base.jpg';
  const b6Diff = 'public/assets/spotter/book6_diff.jpg';
  console.log('mask:', await findCentroidInRegion(b6Base, b6Diff, { left: 20, top: 500, width: 100, height: 100 }));
  console.log('rocket:', await findCentroidInRegion(b6Base, b6Diff, { left: 210, top: 150, width: 200, height: 140 }));
  console.log('elephant:', await findCentroidInRegion(b6Base, b6Diff, { left: 420, top: 440, width: 160, height: 150 }));
  console.log('noodles:', await findCentroidInRegion(b6Base, b6Diff, { left: 300, top: 510, width: 100, height: 140 }));
  console.log('sunglasses:', await findCentroidInRegion(b6Base, b6Diff, { left: 440, top: 710, width: 130, height: 58 }));
  console.log('salad:', await findCentroidInRegion(b6Base, b6Diff, { left: 640, top: 600, width: 90, height: 100 }));
  console.log('dinosaur:', await findCentroidInRegion(b6Base, b6Diff, { left: 620, top: 160, width: 220, height: 150 }));
  console.log('backpack:', await findCentroidInRegion(b6Base, b6Diff, { left: 780, top: 670, width: 100, height: 98 }));

  console.log('\n=== BOOK 7 (Map & Suitcase) ===');
  const b7Base = 'public/assets/spotter/book7_base.jpg';
  const b7Diff = 'public/assets/spotter/book7_diff.jpg';
  console.log('map:', await findCentroidInRegion(b7Base, b7Diff, { left: 380, top: 650, width: 260, height: 118 }));
  console.log('suitcase:', await findCentroidInRegion(b7Base, b7Diff, { left: 640, top: 660, width: 120, height: 108 }));

  console.log('\n=== BOOK 8 (Swan, Spade, Coat) ===');
  const b8Base = 'public/assets/spotter/book8_base.jpg';
  const b8Diff = 'public/assets/spotter/book8_diff.jpg';
  console.log('swan:', await findCentroidInRegion(b8Base, b8Diff, { left: 160, top: 500, width: 140, height: 160 }));
  console.log('spade:', await findCentroidInRegion(b8Base, b8Diff, { left: 80, top: 460, width: 130, height: 300 }));
  console.log('coat:', await findCentroidInRegion(b8Base, b8Diff, { left: 640, top: 260, width: 120, height: 180 }));
}

calibrateAll().catch(console.error);
