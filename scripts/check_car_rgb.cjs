const sharp = require('sharp');

async function checkRGB() {
  const base = await sharp('public/assets/spotter/book7_scene2_base.jpg').raw().toBuffer({ resolveWithObject: true });
  const diff = await sharp('public/assets/spotter/book7_scene2_diff.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = 1376;

  console.log('--- Base image car center vertical slice ---');
  for (let y = 340; y <= 420; y += 5) {
    const idx = (y * w + 940) * 3;
    console.log('y=' + y + ': Base RGB=(' + base.data[idx] + ',' + base.data[idx+1] + ',' + base.data[idx+2] + '), Diff RGB=(' + diff.data[idx] + ',' + diff.data[idx+1] + ',' + diff.data[idx+2] + ')');
  }
}
checkRGB();
