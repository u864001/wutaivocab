const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function inspectBook6() {
  const base = 'public/assets/spotter/book6_base.jpg';
  const diff = 'public/assets/spotter/book6_diff.jpg';
  const outDir = 'public/assets/spotter/debug_crops/b6';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const clusters = [
    { name: 'cluster1', left: 40, top: 370, width: 150, height: 120 },
    { name: 'cluster2', left: 240, top: 100, width: 330, height: 230 },
    { name: 'cluster3', left: 380, top: 380, width: 200, height: 150 },
    { name: 'cluster4', left: 620, top: 330, width: 150, height: 120 },
    { name: 'cluster5', left: 570, top: 520, width: 240, height: 120 },
    { name: 'cluster6', left: 860, top: 430, width: 150, height: 110 },
    { name: 'cluster7', left: 860, top: 100, width: 280, height: 200 },
    { name: 'cluster8', left: 1050, top: 520, width: 190, height: 150 }
  ];

  for (const c of clusters) {
    const bCrop = await sharp(base).extract(c).resize(200, 200).toBuffer();
    const dCrop = await sharp(diff).extract(c).resize(200, 200).toBuffer();
    await sharp({
      create: { width: 410, height: 210, channels: 3, background: '#111827' }
    }).composite([
      { input: bCrop, left: 5, top: 5 },
      { input: dCrop, left: 205, top: 5 }
    ]).jpeg().toFile(path.join(outDir, `${c.name}.jpg`));
    console.log(`Saved B6 ${c.name}`);
  }
}

inspectBook6().catch(console.error);
