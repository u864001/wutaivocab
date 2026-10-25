const sharp = require('sharp');
const fs = require('fs');

async function measureZones() {
  const maskFile = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_diff_mask.jpg';
  const meta = await sharp(maskFile).metadata();
  const raw = await sharp(maskFile).raw().toBuffer();
  const w = meta.width;
  const h = meta.height;

  // Let's print a downsampled ASCII / density map (32 columns x 20 rows)
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
          if (raw[y * w + x] > 128) count++;
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

measureZones().catch(console.error);
