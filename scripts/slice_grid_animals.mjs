import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

export async function slice3x3Grid(inputPath, outputDir, namesGrid) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const imageBuffer = fs.readFileSync(inputPath);
  const meta = await sharp(imageBuffer).metadata();
  const width = meta.width;
  const height = meta.height;
  console.log('Image dimensions:', width, 'x', height);

  const results = [];

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const name = namesGrid[r][c];
      const left = Math.floor(c * (width / 3));
      const top = Math.floor(r * (height / 3));
      const right = Math.min(width, Math.floor((c + 1) * (width / 3)));
      const bottom = Math.min(height, Math.floor((r + 1) * (height / 3)));
      const cellW = right - left;
      const cellH = bottom - top;

      const outPath = path.join(outputDir, `${name}.png`);

      try {
        // Step 1: extract cell to buffer
        const cellBuffer = await sharp(imageBuffer)
          .extract({ left, top, width: cellW, height: cellH })
          .toBuffer();

        // Step 2: trim & contain into 400x400
        await sharp(cellBuffer)
          .trim({ background: '#ffffff', threshold: 15 })
          .resize(400, 400, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          })
          .png()
          .toFile(outPath);

        console.log(`[OK] (${r}, ${c}) ${name} -> ${outPath}`);
        results.push({ name, path: outPath });
      } catch (err) {
        console.error(`[ERROR] (${r}, ${c}) ${name}:`, err.message);
        // Fallback without trim if trim had issues
        await sharp(imageBuffer)
          .extract({ left, top, width: cellW, height: cellH })
          .resize(400, 400, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          })
          .png()
          .toFile(outPath);
        console.log(`[FALLBACK OK] (${r}, ${c}) ${name} -> ${outPath}`);
        results.push({ name, path: outPath });
      }
    }
  }

  return results;
}

const defaultNames = [
  ['tiger', 'lion', 'cow'],
  ['horse', 'sheep', 'zebra'],
  ['frog', 'snake', 'giraffe']
];

const targetInput = process.argv[2] || 'C:/Users/user/.gemini/antigravity/brain/7f6b0266-80c5-443e-9bea-ac24863d5afa/grid_animals_3x3_1794065954250.jpg';
const outDir = path.resolve('public/assets/exam/preA1/demo/sliced');
slice3x3Grid(targetInput, outDir, defaultNames)
  .then(res => console.log('Successfully processed all 9 animals!'))
  .catch(err => console.error('Error:', err));
