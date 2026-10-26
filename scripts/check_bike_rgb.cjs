const sharp = require('sharp');

async function checkBikeRGB() {
  const base = await sharp('public/assets/spotter/book7_scene2_base.jpg').raw().toBuffer({ resolveWithObject: true });
  const diff = await sharp('public/assets/spotter/book7_scene2_diff.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = 1376;

  console.log('--- Base image bike center vertical slice at x=560 ---');
  for (let y = 460; y <= 520; y += 5) {
    const idx = (y * w + 560) * 3;
    console.log('y=' + y + ': Base RGB=(' + base.data[idx] + ',' + base.data[idx+1] + ',' + base.data[idx+2] + '), Diff RGB=(' + diff.data[idx] + ',' + diff.data[idx+1] + ',' + diff.data[idx+2] + ')');
  }

  // Also check handlebar peak across x[520..600]
  let minY = 999;
  for (let y = 460; y <= 500; y++) {
    for (let x = 520; x <= 600; x++) {
      const idx = (y * w + x) * 3;
      const d = Math.abs(diff.data[idx] - base.data[idx]) + Math.abs(diff.data[idx+1] - base.data[idx+1]) + Math.abs(diff.data[idx+2] - base.data[idx+2]);
      if (d > 45) {
        if (y < minY) minY = y;
      }
    }
  }
  console.log('Highest bike handlebar/basket diff pixel y =', minY);
}
checkBikeRGB();
