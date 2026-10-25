const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function inspectCrops(bookNum, clusters) {
  const baseFile = `public/assets/spotter/book${bookNum}_base.jpg`;
  const diffFile = `public/assets/spotter/book${bookNum}_diff.jpg`;
  const outDir = `public/assets/spotter/debug_crops/b${bookNum}`;
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (let i = 0; i < clusters.length; i++) {
    const c = clusters[i];
    const cropW = Math.min(240, c.w + 40);
    const cropH = Math.min(240, c.h + 40);
    const left = Math.max(0, Math.min(1376 - cropW, c.cx - Math.floor(cropW / 2)));
    const top = Math.max(0, Math.min(768 - cropH, c.cy - Math.floor(cropH / 2)));

    const bCrop = await sharp(baseFile).extract({ left, top, width: cropW, height: cropH }).resize(200, 200).toBuffer();
    const dCrop = await sharp(diffFile).extract({ left, top, width: cropW, height: cropH }).resize(200, 200).toBuffer();

    const compare = await sharp({
      create: { width: 410, height: 210, channels: 3, background: '#111827' }
    }).composite([
      { input: bCrop, left: 5, top: 5 },
      { input: dCrop, left: 205, top: 5 }
    ]).jpeg().toFile(path.join(outDir, `cluster_${i+1}_x${c.cx}_y${c.cy}.jpg`));
    console.log(`Saved B${bookNum} cluster ${i+1} at (${c.cx}, ${c.cy})`);
  }
}

async function run() {
  // Let's inspect Book 2 clusters
  const b2Clusters = [
    { cx: 153, cy: 417, w: 144, h: 144 },
    { cx: 441, cy: 645, w: 144, h: 144 },
    { cx: 600, cy: 495, w: 48, h: 96 },
    { cx: 775, cy: 515, w: 240, h: 192 },
    { cx: 825, cy: 119, w: 240, h: 240 },
    { cx: 1117, cy: 552, w: 96, h: 48 },
    { cx: 1242, cy: 400, w: 96, h: 96 }
  ];
  await inspectCrops(2, b2Clusters);
}
run();
