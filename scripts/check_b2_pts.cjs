const sharp = require('sharp');
const fs = require('fs');

async function inspectPixelValues() {
  const meta = await sharp('public/assets/spotter/book2_base.jpg').metadata();
  console.log('B2 size:', meta.width, 'x', meta.height);

  // Let's crop at (153, 417), (441, 645), (600, 495), (775, 515), (825, 119), (1117, 552), (1242, 400)
  const pts = [
    { name: 'p1', x: 153, y: 417 },
    { name: 'p2', x: 441, y: 645 },
    { name: 'p3', x: 600, y: 495 },
    { name: 'p4', x: 775, y: 515 },
    { name: 'p5', x: 825, y: 119 },
    { name: 'p6', x: 1117, y: 552 },
    { name: 'p7', x: 1242, y: 400 }
  ];

  for (const p of pts) {
    const left = Math.max(0, p.x - 60);
    const top = Math.max(0, p.y - 60);
    const bCrop = await sharp('public/assets/spotter/book2_base.jpg').extract({ left, top, width: 120, height: 120 }).toBuffer();
    const dCrop = await sharp('public/assets/spotter/book2_diff.jpg').extract({ left, top, width: 120, height: 120 }).toBuffer();
    await sharp({
      create: { width: 250, height: 130, channels: 3, background: '#111827' }
    }).composite([
      { input: bCrop, left: 5, top: 5 },
      { input: dCrop, left: 125, top: 5 }
    ]).jpeg().toFile(`public/assets/spotter/debug_crops/b2_pt_${p.name}_${p.x}_${p.y}.jpg`);
    console.log(`Saved p at ${p.x}, ${p.y}`);
  }
}

inspectPixelValues().catch(console.error);
