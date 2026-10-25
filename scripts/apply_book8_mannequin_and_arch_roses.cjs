const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function applyBook8Fixes() {
  console.log('=== Step 1: Unify Archway Roses on Book 8 Diff Image ===');

  const baseBuf = fs.readFileSync('public/assets/spotter/book8_base.jpg');
  const diffBuf = fs.readFileSync('public/assets/spotter/book8_diff.jpg');

  const baseImg = sharp(baseBuf);
  const diffImg = sharp(diffBuf);

  const { data: bData, info } = await baseImg.raw().toBuffer({ resolveWithObject: true });
  const { data: dData } = await diffImg.raw().toBuffer({ resolveWithObject: true });

  const patchedDiff = Buffer.from(dData);

  const centerRoseX = 698;
  const centerRoseY = 268;
  const innerRx = 76;
  const innerRy = 74;
  const outerRx = 92;
  const outerRy = 90;

  let patchedCount = 0;

  for (let y = 40; y < 450; y++) {
    for (let x = 500; x < 900; x++) {
      const idx = (y * info.width + x) * info.channels;
      const edx = (x - centerRoseX);
      const edy = (y - centerRoseY);

      const dInner = (edx * edx) / (innerRx * innerRx) + (edy * edy) / (innerRy * innerRy);
      const dOuter = (edx * edx) / (outerRx * outerRx) + (edy * edy) / (outerRy * outerRy);

      if (dInner <= 1.0) {
        // Center rose difference -> keep diff (yellow rose)
        continue;
      } else if (dOuter >= 1.0) {
        // Archway roses & background -> unify with base (red climbing roses)
        const diffAmount = Math.abs(bData[idx] - dData[idx]) + Math.abs(bData[idx+1] - dData[idx+1]) + Math.abs(bData[idx+2] - dData[idx+2]);
        if (diffAmount > 8) {
          patchedDiff[idx] = bData[idx];
          patchedDiff[idx+1] = bData[idx+1];
          patchedDiff[idx+2] = bData[idx+2];
          patchedCount++;
        }
      } else {
        // Feather blend boundary
        const t = (Math.sqrt(dOuter) - 1.0) / (Math.sqrt(outerRx / innerRx) - 1.0);
        const clampedT = Math.max(0, Math.min(1, t));
        patchedDiff[idx] = Math.round(dData[idx] * (1 - clampedT) + bData[idx] * clampedT);
        patchedDiff[idx+1] = Math.round(dData[idx+1] * (1 - clampedT) + bData[idx+1] * clampedT);
        patchedDiff[idx+2] = Math.round(dData[idx+2] * (1 - clampedT) + bData[idx+2] * clampedT);
        patchedCount++;
      }
    }
  }

  console.log(`Unification complete: ${patchedCount} pixels synchronized with base.`);

  // Write updated book8_diff.jpg
  const newDiffJpg = await sharp(patchedDiff, { raw: { width: info.width, height: info.height, channels: 3 } })
    .jpeg({ quality: 92 })
    .toBuffer();
  fs.writeFileSync('public/assets/spotter/book8_diff.jpg', newDiffJpg);
  console.log('Saved updated public/assets/spotter/book8_diff.jpg');

  console.log('=== Step 2: Regenerate Book 8 Crops & Overlay ===');

  const targets = [
    { word: 'swan', x: 325, y: 460, rx: 70, ry: 55 },
    { word: 'spade', x: 200, y: 535, rx: 38, ry: 135, rotate: -14 },
    { word: 'drum', x: 288, y: 250, rx: 66, ry: 58 },
    { word: 'pie', x: 704, y: 546, rx: 96, ry: 52 },
    { word: 'rose', x: 698, y: 268, rx: 76, ry: 74 },
    { word: 'coat', x: 957, y: 310, rx: 75, ry: 95 },
    { word: 'flute', x: 998, y: 505, rx: 105, ry: 35 },
    { word: 'dress', x: 1256, y: 348, rx: 110, ry: 142 } // Raised to encompass full mannequin
  ];

  const cropDir = 'public/assets/spotter/crops/b8_s1';
  if (!fs.existsSync(cropDir)) fs.mkdirSync(cropDir, { recursive: true });

  const finalBaseBuf = fs.readFileSync('public/assets/spotter/book8_base.jpg');
  const finalDiffBuf = fs.readFileSync('public/assets/spotter/book8_diff.jpg');

  // Crop compare helper (650x276)
  const cardW = 650, cardH = 276;
  const halfW = 320, innerH = 250;

  for (const t of targets) {
    const rx = t.rx || t.radius || 60;
    const ry = t.ry || t.radius || 60;
    const cropBoxW = Math.max(140, Math.min(halfW, Math.round(rx * 2.2)));
    const cropBoxH = Math.max(120, Math.min(innerH, Math.round(ry * 2.2)));

    let left = Math.max(0, Math.min(1376 - cropBoxW, Math.round(t.x - cropBoxW / 2)));
    let top = Math.max(0, Math.min(768 - cropBoxH, Math.round(t.y - cropBoxH / 2)));

    const bCrop = await sharp(finalBaseBuf)
      .extract({ left, top, width: cropBoxW, height: cropBoxH })
      .resize(halfW, innerH, { fit: 'contain', background: { r: 15, g: 23, b: 42 } })
      .jpeg()
      .toBuffer();

    const dCrop = await sharp(finalDiffBuf)
      .extract({ left, top, width: cropBoxW, height: cropBoxH })
      .resize(halfW, innerH, { fit: 'contain', background: { r: 15, g: 23, b: 42 } })
      .jpeg()
      .toBuffer();

    const svgHeader = Buffer.from(
      `<svg width="${cardW}" height="${cardH}">
        <rect width="${cardW}" height="${cardH}" fill="#0f172a" rx="12" />
        <rect x="5" y="5" width="${halfW}" height="${innerH}" fill="none" stroke="#38bdf8" stroke-width="2" rx="8" />
        <rect x="${halfW + 10}" y="5" width="${halfW}" height="${innerH}" fill="none" stroke="#a855f7" stroke-width="2" rx="8" />
        <text x="20" y="270" fill="#38bdf8" font-size="14" font-weight="bold" font-family="sans-serif">BASE (左圖底圖)</text>
        <text x="${halfW + 25}" y="270" fill="#c084fc" font-size="14" font-weight="bold" font-family="sans-serif">VAR A (右圖變異) • ${t.word.toUpperCase()}</text>
      </svg>`
    );

    const outCardPath = path.join(cropDir, `${t.word}_compare.jpg`);
    await sharp({
      create: { width: cardW, height: cardH, channels: 3, background: { r: 15, g: 23, b: 42 } }
    }).composite([
      { input: svgHeader, left: 0, top: 0 },
      { input: bCrop, left: 5, top: 5 },
      { input: dCrop, left: halfW + 10, top: 5 }
    ]).jpeg({ quality: 90 }).toFile(outCardPath);

    console.log(`Generated crop: ${outCardPath}`);
  }

  // Generate full side-by-side with bounding boxes (2752x768)
  let ellipsesSvg = '<svg width="2752" height="768">';
  for (const t of targets) {
    const rx = t.rx || t.radius || 60;
    const ry = t.ry || t.radius || 60;
    const rot = t.rotate || 0;
    const transformL = rot !== 0 ? ` transform="rotate(${rot}, ${t.x}, ${t.y})"` : '';
    const transformR = rot !== 0 ? ` transform="rotate(${rot}, ${t.x + 1376}, ${t.y})"` : '';

    ellipsesSvg += `
      <g>
        <ellipse cx="${t.x}" cy="${t.y}" rx="${rx}" ry="${ry}" fill="none" stroke="#22c55e" stroke-width="3" stroke-dasharray="6,4"${transformL} />
        <text x="${t.x}" y="${Math.max(20, t.y - ry - 8)}" text-anchor="middle" fill="#22c55e" font-size="16" font-weight="bold" font-family="sans-serif">${t.word.toUpperCase()}</text>
        <ellipse cx="${t.x + 1376}" cy="${t.y}" rx="${rx}" ry="${ry}" fill="none" stroke="#f43f5e" stroke-width="3" stroke-dasharray="6,4"${transformR} />
        <text x="${t.x + 1376}" y="${Math.max(20, t.y - ry - 8)}" text-anchor="middle" fill="#f43f5e" font-size="16" font-weight="bold" font-family="sans-serif">${t.word.toUpperCase()}</text>
      </g>
    `;
  }
  ellipsesSvg += '</svg>';

  const boxesOutPath = 'public/assets/spotter/book8_side_by_side_boxes.jpg';
  await sharp({
    create: { width: 2752, height: 768, channels: 3, background: { r: 0, g: 0, b: 0 } }
  }).composite([
    { input: finalBaseBuf, left: 0, top: 0 },
    { input: finalDiffBuf, left: 1376, top: 0 },
    { input: Buffer.from(ellipsesSvg), left: 0, top: 0 }
  ]).jpeg({ quality: 88 }).toFile(boxesOutPath);

  console.log(`Saved side-by-side with boxes: ${boxesOutPath}`);
  console.log('All Book 8 fixes applied successfully!');
}

applyBook8Fixes().catch(err => {
  console.error(err);
  process.exit(1);
});
