const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function testOverlay(bookNum, items, baseFile, diffFile) {
  const meta = await sharp(baseFile).metadata();
  const w = meta.width;
  const h = meta.height;

  let svgElements = '';
  const colors = ['#f43f5e', '#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#eab308', '#14b8a6', '#ec4899'];

  items.forEach((item, idx) => {
    const color = colors[idx % colors.length];
    const rx = item.radiusX || item.radius;
    const ry = item.radiusY || item.radius;
    const labelY = Math.max(22, item.y - ry - 10);
    const rectY = Math.max(8, item.y - ry - 24);

    svgElements += `
      <ellipse cx="${item.x}" cy="${item.y}" rx="${rx}" ry="${ry}" fill="${color}25" stroke="${color}" stroke-width="3" stroke-dasharray="6 4" />
      <circle cx="${item.x}" cy="${item.y}" r="5" fill="${color}" stroke="#ffffff" stroke-width="1.5" />
      <rect x="${item.x - 60}" y="${rectY}" width="120" height="20" rx="5" fill="rgba(15, 23, 42, 0.9)" stroke="${color}" stroke-width="1.5" />
      <text x="${item.x}" y="${labelY}" fill="#ffffff" font-size="11" font-weight="bold" font-family="sans-serif" text-anchor="middle">${item.word} (${item.wordZh})</text>
    `;
  });

  const overlaySvg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${svgElements}</svg>`;
  const overlayBuf = Buffer.from(overlaySvg);

  const leftWithBoxes = await sharp(baseFile).composite([{ input: overlayBuf }]).toBuffer();
  const rightWithBoxes = await sharp(diffFile).composite([{ input: overlayBuf }]).toBuffer();

  const dividerW = 12;
  const totalW = w * 2 + dividerW;
  const dividerSvg = `<svg width="${dividerW}" height="${h}"><rect width="${dividerW}" height="${h}" fill="#020617"/></svg>`;

  const stitched = await sharp({
    create: { width: totalW, height: h, channels: 3, background: '#020617' }
  }).composite([
    { input: leftWithBoxes, left: 0, top: 0 },
    { input: Buffer.from(dividerSvg), left: w, top: 0 },
    { input: rightWithBoxes, left: w + dividerW, top: 0 }
  ]).jpeg({ quality: 90 }).toFile(`public/assets/spotter/debug_crops/verify_b${bookNum}.jpg`);

  console.log(`Saved verification image for Book ${bookNum}: public/assets/spotter/debug_crops/verify_b${bookNum}.jpg`);
}

async function run() {
  const dir = 'public/assets/spotter/debug_crops';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // 1. Check Book 3 Sun
  const b3Base = 'public/assets/spotter/book3_base.jpg';
  const b3Diff = 'public/assets/spotter/book3_diff.jpg';
  const b3DiffBuf = await sharp(b3Diff).raw().toBuffer();
  const b3BaseBuf = await sharp(b3Base).raw().toBuffer();
  // Check diff in sun area (x: 420~580, y: 50~220) vs cloud area (x: 650~850, y: 50~150)
  let sunDiffCount = 0;
  for (let y = 50; y < 220; y++) {
    for (let x = 420; x < 580; x++) {
      const idx = (y * 1376 + x) * 3;
      const d = (Math.abs(b3BaseBuf[idx] - b3DiffBuf[idx]) + Math.abs(b3BaseBuf[idx+1] - b3DiffBuf[idx+1]) + Math.abs(b3BaseBuf[idx+2] - b3DiffBuf[idx+2])) / 3;
      if (d > 25) sunDiffCount++;
    }
  }
  console.log('Book 3 sun diff count at (420-580, 50-220):', sunDiffCount);

  // 2. Check Book 7 Map and Suitcase exact pixels
  const b7Base = 'public/assets/spotter/book7_base.jpg';
  const b7Diff = 'public/assets/spotter/book7_diff.jpg';
  const b7BaseBuf = await sharp(b7Base).raw().toBuffer();
  const b7DiffBuf = await sharp(b7Diff).raw().toBuffer();

  // Find map bounding box in x: 500~800, y: 500~768
  let mapMinX = 1376, mapMaxX = 0, mapMinY = 768, mapMaxY = 0, mapPts = 0;
  for (let y = 500; y < 768; y++) {
    for (let x = 500; x < 780; x++) {
      const idx = (y * 1376 + x) * 3;
      const d = (Math.abs(b7BaseBuf[idx] - b7DiffBuf[idx]) + Math.abs(b7BaseBuf[idx+1] - b7DiffBuf[idx+1]) + Math.abs(b7BaseBuf[idx+2] - b7DiffBuf[idx+2])) / 3;
      if (d > 25) {
        mapMinX = Math.min(mapMinX, x);
        mapMaxX = Math.max(mapMaxX, x);
        mapMinY = Math.min(mapMinY, y);
        mapMaxY = Math.max(mapMaxY, y);
        mapPts++;
      }
    }
  }
  console.log(`Book 7 Map exact bbox: [${mapMinX}, ${mapMinY}] to [${mapMaxX}, ${mapMaxY}], cx=${(mapMinX+mapMaxX)/2}, cy=${(mapMinY+mapMaxY)/2}, w=${mapMaxX-mapMinX}, h=${mapMaxY-mapMinY}, pts=${mapPts}`);

  // Find suitcase bounding box in x: 800~1050, y: 500~768
  let scMinX = 1376, scMaxX = 0, scMinY = 768, scMaxY = 0, scPts = 0;
  for (let y = 500; y < 768; y++) {
    for (let x = 800; x < 1050; x++) {
      const idx = (y * 1376 + x) * 3;
      const d = (Math.abs(b7BaseBuf[idx] - b7DiffBuf[idx]) + Math.abs(b7BaseBuf[idx+1] - b7DiffBuf[idx+1]) + Math.abs(b7BaseBuf[idx+2] - b7DiffBuf[idx+2])) / 3;
      if (d > 25) {
        scMinX = Math.min(scMinX, x);
        scMaxX = Math.max(scMaxX, x);
        scMinY = Math.min(scMinY, y);
        scMaxY = Math.max(scMaxY, y);
        scPts++;
      }
    }
  }
  console.log(`Book 7 Suitcase exact bbox: [${scMinX}, ${scMinY}] to [${scMaxX}, ${scMaxY}], cx=${(scMinX+scMaxX)/2}, cy=${(scMinY+scMaxY)/2}, w=${scMaxX-scMinX}, h=${scMaxY-scMinY}, pts=${scPts}`);

  // 3. Check Book 8 Swan, Spade, Coat exact pixels
  const b8Base = 'public/assets/spotter/book8_base.jpg';
  const b8Diff = 'public/assets/spotter/book8_diff.jpg';
  const b8BaseBuf = await sharp(b8Base).raw().toBuffer();
  const b8DiffBuf = await sharp(b8Diff).raw().toBuffer();

  // Swan (pond, x: 150~350, y: 450~700)
  let swanMinX = 1376, swanMaxX = 0, swanMinY = 768, swanMaxY = 0, swanPts = 0;
  for (let y = 450; y < 700; y++) {
    for (let x = 150; x < 350; x++) {
      const idx = (y * 1376 + x) * 3;
      const d = (Math.abs(b8BaseBuf[idx] - b8DiffBuf[idx]) + Math.abs(b8BaseBuf[idx+1] - b8DiffBuf[idx+1]) + Math.abs(b8BaseBuf[idx+2] - b8DiffBuf[idx+2])) / 3;
      if (d > 25) {
        swanMinX = Math.min(swanMinX, x);
        swanMaxX = Math.max(swanMaxX, x);
        swanMinY = Math.min(swanMinY, y);
        swanMaxY = Math.max(swanMaxY, y);
        swanPts++;
      }
    }
  }
  console.log(`Book 8 Swan bbox: [${swanMinX}, ${swanMinY}] to [${swanMaxX}, ${swanMaxY}], cx=${(swanMinX+swanMaxX)/2}, cy=${(swanMinY+swanMaxY)/2}, w=${swanMaxX-swanMinX}, h=${swanMaxY-swanMinY}`);

  // Spade (soil bed, x: 50~250, y: 450~768)
  let spadeMinX = 1376, spadeMaxX = 0, spadeMinY = 768, spadeMaxY = 0, spadePts = 0;
  for (let y = 450; y < 768; y++) {
    for (let x = 50; x < 250; x++) {
      const idx = (y * 1376 + x) * 3;
      const d = (Math.abs(b8BaseBuf[idx] - b8DiffBuf[idx]) + Math.abs(b8BaseBuf[idx+1] - b8DiffBuf[idx+1]) + Math.abs(b8BaseBuf[idx+2] - b8DiffBuf[idx+2])) / 3;
      if (d > 25) {
        spadeMinX = Math.min(spadeMinX, x);
        spadeMaxX = Math.max(spadeMaxX, x);
        spadeMinY = Math.min(spadeMinY, y);
        spadeMaxY = Math.max(spadeMaxY, y);
        spadePts++;
      }
    }
  }
  console.log(`Book 8 Spade bbox: [${spadeMinX}, ${spadeMinY}] to [${spadeMaxX}, ${spadeMaxY}], cx=${(spadeMinX+spadeMaxX)/2}, cy=${(spadeMinY+spadeMaxY)/2}, w=${spadeMaxX-spadeMinX}, h=${spadeMaxY-spadeMinY}`);

  // Coat (bench, x: 600~800, y: 250~500)
  let coatMinX = 1376, coatMaxX = 0, coatMinY = 768, coatMaxY = 0, coatPts = 0;
  for (let y = 250; y < 500; y++) {
    for (let x = 600; x < 800; x++) {
      const idx = (y * 1376 + x) * 3;
      const d = (Math.abs(b8BaseBuf[idx] - b8DiffBuf[idx]) + Math.abs(b8BaseBuf[idx+1] - b8DiffBuf[idx+1]) + Math.abs(b8BaseBuf[idx+2] - b8DiffBuf[idx+2])) / 3;
      if (d > 25) {
        coatMinX = Math.min(coatMinX, x);
        coatMaxX = Math.max(coatMaxX, x);
        coatMinY = Math.min(coatMinY, y);
        coatMaxY = Math.max(coatMaxY, y);
        coatPts++;
      }
    }
  }
  console.log(`Book 8 Coat bbox: [${coatMinX}, ${coatMinY}] to [${coatMaxX}, ${coatMaxY}], cx=${(coatMinX+coatMaxX)/2}, cy=${(coatMinY+coatMaxY)/2}, w=${coatMaxX-coatMinX}, h=${coatMaxY-coatMinY}`);
}

run().catch(console.error);
