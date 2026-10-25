const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processRevision2() {
  const baseFile = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_canal_market_base_v2_1792829379631.jpg';
  const diffFile = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_canal_market_diff_v1_1792829455967.jpg';
  const outDir = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3';

  const w = 1376;
  const h = 768;

  // 1. Grid Preview
  let gridSvg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">`;
  for (let x = 0; x <= w; x += 100) {
    gridSvg += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>`;
    gridSvg += `<text x="${x + 4}" y="20" fill="#ffff00" font-size="12" font-family="monospace">${x}</text>`;
  }
  for (let y = 0; y <= h; y += 100) {
    gridSvg += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>`;
    gridSvg += `<text x="4" y="${y + 16}" fill="#ffff00" font-size="12" font-family="monospace">${y}</text>`;
  }
  gridSvg += `</svg>`;
  const gridBuf = Buffer.from(gridSvg);

  const baseWithGrid = await sharp(baseFile).composite([{ input: gridBuf }]).toBuffer();
  const diffWithGrid = await sharp(diffFile).composite([{ input: gridBuf }]).toBuffer();

  const dividerWidth = 16;
  const totalWidth = w * 2 + dividerWidth;
  const dividerSvg = `<svg width="${dividerWidth}" height="${h}">
    <rect width="${dividerWidth}" height="${h}" fill="#0f172a"/>
    <line x1="${dividerWidth/2}" y1="0" x2="${dividerWidth/2}" y2="${h}" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,6"/>
  </svg>`;

  const gridPreviewPath = path.join(outDir, 'amsterdam_v2_grid_preview.jpg');
  await sharp({
    create: { width: totalWidth, height: h, channels: 3, background: { r: 15, g: 23, b: 42 } }
  })
  .composite([
    { input: baseWithGrid, top: 0, left: 0 },
    { input: Buffer.from(dividerSvg), top: 0, left: w },
    { input: diffWithGrid, top: 0, left: w + dividerWidth }
  ])
  .jpeg({ quality: 92 })
  .toFile(gridPreviewPath);
  console.log('Saved grid preview:', gridPreviewPath);

  // 2. Compute pixel diffs across the canvas
  const baseBuf = await sharp(baseFile).raw().toBuffer();
  const diffBuf = await sharp(diffFile).raw().toBuffer();

  // Downsampled density grid (40x20)
  const cols = 40;
  const rows = 20;
  const colW = Math.floor(w / cols);
  const rowH = Math.floor(h / rows);
  console.log('--- Diff Pixel Density Grid (40x20) ---');
  for (let r = 0; r < rows; r++) {
    let line = '';
    for (let c = 0; c < cols; c++) {
      let count = 0;
      for (let y = r * rowH; y < (r + 1) * rowH; y++) {
        for (let x = c * colW; x < (c + 1) * colW; x++) {
          const idx = (y * w + x) * 3;
          const dist = Math.abs(baseBuf[idx] - diffBuf[idx]) +
                       Math.abs(baseBuf[idx+1] - diffBuf[idx+1]) +
                       Math.abs(baseBuf[idx+2] - diffBuf[idx+2]);
          if (dist > 45) count++;
        }
      }
      const density = count / (colW * rowH);
      if (density > 0.4) line += '#';
      else if (density > 0.2) line += '*';
      else if (density > 0.08) line += '.';
      else line += ' ';
    }
    console.log(line);
  }
}

processRevision2().catch(console.error);
