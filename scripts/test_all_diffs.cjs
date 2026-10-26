const sharp = require('sharp');

async function testAllDiffs() {
  const baseImg = await sharp('public/assets/spotter/book4_scene2_base.jpg').raw().toBuffer({ resolveWithObject: true });
  const diffAImg = await sharp('public/assets/spotter/book4_scene2_diff.jpg').raw().toBuffer({ resolveWithObject: true });
  const diffBImg = await sharp('public/assets/spotter/book4_scene2_diff_varb.jpg').raw().toBuffer({ resolveWithObject: true });
  const diffCImg = await sharp('public/assets/spotter/book4_scene2_diff_varc.jpg').raw().toBuffer({ resolveWithObject: true });
  
  const w = baseImg.info.width, h = baseImg.info.height;
  const bData = baseImg.data;

  const targets = [
    { name: 'CHAIR', minX: 0, maxX: 430, minY: 420, maxY: 768 },
    { name: 'HAT', minX: 300, maxX: 450, minY: 120, maxY: 320 },
    { name: 'BUS', minX: 400, maxX: 680, minY: 220, maxY: 420 },
    { name: 'TABLE', minX: 440, maxX: 740, minY: 450, maxY: 768 },
    { name: 'BOX', minX: 750, maxX: 1020, minY: 260, maxY: 480 },
    { name: 'BAG', minX: 740, maxX: 1060, minY: 480, maxY: 768 },
    { name: 'CLOCK', minX: 1050, maxX: 1280, minY: 60, maxY: 260 },
    { name: 'BASKET', minX: 1060, maxX: 1376, minY: 480, maxY: 768 }
  ];

  [ {name: 'Diff A', data: diffAImg.data}, {name: 'Diff B', data: diffBImg.data}, {name: 'Diff C', data: diffCImg.data} ].forEach(diff => {
    console.log(`\n=== Testing ${diff.name} ===`);
    targets.forEach(t => {
      let sumX = 0, sumY = 0, count = 0;
      let bMinX = 9999, bMaxX = 0, bMinY = 9999, bMaxY = 0;

      for (let y = t.minY; y < t.maxY; y++) {
        for (let x = t.minX; x < t.maxX; x++) {
          const idx = (y * w + x) * 3;
          const d = Math.max(Math.abs(bData[idx]-diff.data[idx]), Math.abs(bData[idx+1]-diff.data[idx+1]), Math.abs(bData[idx+2]-diff.data[idx+2]));
          if (d > 35) {
            sumX += x; sumY += y; count++;
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
        console.log(`  ${t.name}: Center=(${cx}, ${cy}) BBox=[x: ${bMinX}..${bMaxX}, y: ${bMinY}..${bMaxY}] diffPixels=${count}`);
      } else {
        console.log(`  ${t.name}: ⚠️ NO DIFF FOUND!`);
      }
    });
  });
}

testAllDiffs().catch(console.error);
