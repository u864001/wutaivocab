const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createSideBySideAndOverlays(basePath, diffPath, items, outDir) {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const targetHeight = 768;
  const leftBuf = await sharp(basePath).resize({ height: targetHeight }).toBuffer();
  const rightBuf = await sharp(diffPath).resize({ height: targetHeight }).toBuffer();

  const leftMeta = await sharp(leftBuf).metadata();
  const rightMeta = await sharp(rightBuf).metadata();

  // 1. Generate Side-by-Side Comparison
  const dividerWidth = 16;
  const totalWidth = leftMeta.width + dividerWidth + rightMeta.width;

  const dividerSvg = `<svg width="${dividerWidth}" height="${targetHeight}">
    <rect width="${dividerWidth}" height="${targetHeight}" fill="#0f172a"/>
    <line x1="${dividerWidth/2}" y1="0" x2="${dividerWidth/2}" y2="${targetHeight}" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,6"/>
  </svg>`;

  const sideBySidePath = path.join(outDir, 'book1_scene2_side_by_side.jpg');
  await sharp({
    create: {
      width: totalWidth,
      height: targetHeight,
      channels: 3,
      background: { r: 15, g: 23, b: 42 }
    }
  })
  .composite([
    { input: leftBuf, top: 0, left: 0 },
    { input: Buffer.from(dividerSvg), top: 0, left: leftMeta.width },
    { input: rightBuf, top: 0, left: leftMeta.width + dividerWidth }
  ])
  .jpeg({ quality: 92 })
  .toFile(sideBySidePath);

  console.log('Side-by-side created at:', sideBySidePath);

  // 2. Generate SVG Overlays with Labels & Hitboxes
  let svgElements = '';
  const colors = ['#f43f5e', '#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#eab308', '#14b8a6', '#ec4899'];

  items.forEach((item, idx) => {
    const rx = item.radiusX || item.radius || 60;
    const ry = item.radiusY || item.radius || 60;
    const color = colors[idx % colors.length];

    svgElements += `
      <!-- Target ${idx + 1}: ${item.word} -->
      <ellipse cx="${item.x}" cy="${item.y}" rx="${rx}" ry="${ry}" fill="${color}22" stroke="${color}" stroke-width="4" stroke-dasharray="8 4" />
      <circle cx="${item.x}" cy="${item.y}" r="6" fill="${color}" stroke="#ffffff" stroke-width="2" />
      <rect x="${item.x - 75}" y="${Math.max(10, item.y - ry - 32)}" width="150" height="26" rx="6" fill="rgba(15, 23, 42, 0.9)" stroke="${color}" stroke-width="2" />
      <text x="${item.x}" y="${Math.max(28, item.y - ry - 14)}" fill="#ffffff" font-size="13" font-weight="bold" font-family="sans-serif" text-anchor="middle">${item.word} (${item.wordZh})</text>
    `;
  });

  const svgOverlay = Buffer.from(`<svg width="${leftMeta.width}" height="${targetHeight}" xmlns="http://www.w3.org/2000/svg">${svgElements}</svg>`);

  const overlayBasePath = path.join(outDir, 'book1_scene2_base_boxes.jpg');
  const overlayDiffPath = path.join(outDir, 'book1_scene2_diff_boxes.jpg');

  await sharp(leftBuf).composite([{ input: svgOverlay }]).jpeg({ quality: 90 }).toFile(overlayBasePath);
  await sharp(rightBuf).composite([{ input: svgOverlay }]).jpeg({ quality: 90 }).toFile(overlayDiffPath);

  console.log('Overlay Base created at:', overlayBasePath);
  console.log('Overlay Diff created at:', overlayDiffPath);

  // 3. Generate Combined Side-by-Side with Overlays
  const combinedBoxesPath = path.join(outDir, 'book1_scene2_side_by_side_boxes.jpg');
  const overlayLeftBuf = await sharp(overlayBasePath).toBuffer();
  const overlayRightBuf = await sharp(overlayDiffPath).toBuffer();

  await sharp({
    create: {
      width: totalWidth,
      height: targetHeight,
      channels: 3,
      background: { r: 15, g: 23, b: 42 }
    }
  })
  .composite([
    { input: overlayLeftBuf, top: 0, left: 0 },
    { input: Buffer.from(dividerSvg), top: 0, left: leftMeta.width },
    { input: overlayRightBuf, top: 0, left: leftMeta.width + dividerWidth }
  ])
  .jpeg({ quality: 92 })
  .toFile(combinedBoxesPath);

  console.log('Combined Side-by-side with boxes created at:', combinedBoxesPath);

  return {
    sideBySidePath,
    overlayBasePath,
    overlayDiffPath,
    combinedBoxesPath
  };
}

module.exports = { createSideBySideAndOverlays };
