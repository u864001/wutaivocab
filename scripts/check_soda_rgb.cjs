const sharp = require('sharp');

async function checkSodaRGB() {
  const base = await sharp('public/assets/spotter/book7_scene2_base.jpg').raw().toBuffer({ resolveWithObject: true });
  const diff = await sharp('public/assets/spotter/book7_scene2_diff.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = 1376;

  let minY = 999, maxY = 0;
  let minX = 999, maxX = 0;
  for (let y = 510; y <= 660; y++) {
    for (let x = 310; x <= 370; x++) {
      const idx = (y * w + x) * 3;
      const d = Math.abs(diff.data[idx] - base.data[idx]) + Math.abs(diff.data[idx+1] - base.data[idx+1]) + Math.abs(diff.data[idx+2] - base.data[idx+2]);
      if (d > 45) {
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
    }
  }
  console.log('Soda bottle boundaries:', { minX, maxX, minY, maxY, width: maxX - minX + 1, height: maxY - minY + 1, cx: ((minX + maxX)/2).toFixed(1), cy: ((minY + maxY)/2).toFixed(1) });
}
checkSodaRGB();
