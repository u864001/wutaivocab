import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

export async function sliceGrid(inputPath, outputDir, namesGrid, options = {}) {
  const targetSize = options.targetSize || 400;
  const padding = options.padding || 20;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const imageBuffer = fs.readFileSync(inputPath);
  const meta = await sharp(imageBuffer).metadata();
  const width = meta.width;
  const height = meta.height;

  const rows = namesGrid.length;
  const cols = namesGrid[0].length;
  console.log(`Grid Slicing: ${inputPath} (${width}x${height}) into ${rows}x${cols}...`);

  const results = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const name = namesGrid[r][c];
      if (!name) continue;

      const left = Math.floor(c * (width / cols));
      const top = Math.floor(r * (height / rows));
      const right = Math.min(width, Math.floor((c + 1) * (width / cols)));
      const bottom = Math.min(height, Math.floor((r + 1) * (height / rows)));
      const cellW = right - left;
      const cellH = bottom - top;

      const outPath = path.join(outputDir, `${name}.png`);

      try {
        const cellBuffer = await sharp(imageBuffer)
          .extract({ left, top, width: cellW, height: cellH })
          .toBuffer();

        await sharp(cellBuffer)
          .trim({ background: '#ffffff', threshold: 15 })
          .resize(targetSize, targetSize, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          })
          .png({ quality: 95 })
          .toFile(outPath);

        console.log(`[OK] (${r}, ${c}) ${name} -> ${outPath}`);
        results.push({ name, path: outPath });
      } catch (err) {
        console.error(`[FALLBACK] (${r}, ${c}) ${name}:`, err.message);
        await sharp(imageBuffer)
          .extract({ left, top, width: cellW, height: cellH })
          .resize(targetSize, targetSize, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          })
          .png({ quality: 95 })
          .toFile(outPath);
        results.push({ name, path: outPath });
      }
    }
  }

  return results;
}

// CLI usage: node scripts/slice_grid.mjs <inputImage> <outputDir> <namesJsonString>
if (process.argv[2] && process.argv[3] && process.argv[4]) {
  const input = process.argv[2];
  const outDir = path.resolve(process.argv[3]);
  const names = JSON.parse(process.argv[4]);
  sliceGrid(input, outDir, names)
    .then(res => console.log(`Finished slicing ${res.length} items.`))
    .catch(err => console.error(err));
}
