const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const cropDir = 'public/assets/spotter/crops/b2_s2';
fs.mkdirSync(cropDir, { recursive: true });

const baseFile = 'public/assets/spotter/book2_scene2_base.jpg';

// Coordinates on Base (1376x768)
const baseBoxes = {
  draw: { left: 80, top: 540, width: 220, height: 220 },
  cook: { left: 250, top: 390, width: 150, height: 280 },
  pot: { left: 380, top: 520, width: 140, height: 190 },
  doctor: { left: 525, top: 385, width: 110, height: 300 },
  nurse: { left: 615, top: 375, width: 100, height: 310 },
  student: { left: 680, top: 640, width: 130, height: 128 },
  teacher: { left: 790, top: 535, width: 170, height: 233 },
  driver: { left: 855, top: 335, width: 85, height: 150 },
};

// Coordinates on Variant A
const varABoxes = {
  draw: { left: 850, top: 560, width: 220, height: 200 },
  cook: { left: 470, top: 460, width: 120, height: 270 },
  pot: { left: 570, top: 630, width: 100, height: 120 },
  doctor: { left: 660, top: 540, width: 105, height: 220 },
  nurse: { left: 750, top: 555, width: 100, height: 210 },
  student: { left: 340, top: 540, width: 95, height: 220 },
  teacher: { left: 260, top: 440, width: 95, height: 320 },
  driver: { left: 160, top: 440, width: 80, height: 140 },
};

// Coordinates on Variant B
const varBBoxes = {
  draw: { left: 810, top: 530, width: 220, height: 230 },
  cook: { left: 25, top: 470, width: 180, height: 298 },
  pot: { left: 175, top: 700, width: 130, height: 68 },
  doctor: { left: 305, top: 580, width: 105, height: 188 },
  nurse: { left: 405, top: 575, width: 105, height: 193 },
  student: { left: 680, top: 600, width: 125, height: 168 },
  teacher: { left: 520, top: 520, width: 130, height: 248 },
  driver: { left: 295, top: 330, width: 85, height: 170 },
};

// Coordinates on Variant C
const varCBoxes = {
  draw: { left: 840, top: 540, width: 200, height: 220 },
  cook: { left: 290, top: 500, width: 110, height: 200 },
  pot: { left: 400, top: 610, width: 100, height: 120 },
  doctor: { left: 780, top: 330, width: 110, height: 185 },
  nurse: { left: 890, top: 355, width: 90, height: 175 },
  student: { left: 650, top: 600, width: 100, height: 168 },
  teacher: { left: 550, top: 390, width: 125, height: 270 },
  driver: { left: 155, top: 465, width: 80, height: 175 },
};

const variants = [
  { key: 'A', suffix: '', file: 'public/assets/spotter/book2_scene2_diff.jpg', boxes: varABoxes },
  { key: 'B', suffix: '_varB', file: 'public/assets/spotter/book2_scene2_diff_varb.jpg', boxes: varBBoxes },
  { key: 'C', suffix: '_varC', file: 'public/assets/spotter/book2_scene2_diff_varc.jpg', boxes: varCBoxes },
];

async function run() {
  const words = Object.keys(baseBoxes);
  
  for (const v of variants) {
    console.log(`Generating side-by-side comparison crops for Variant ${v.key}...`);
    for (const w of words) {
      const bBox = baseBoxes[w];
      const dBox = v.boxes[w];

      const cropSize = 250;

      // Extract Base crop (padded and resized to cropSize x cropSize)
      const baseCrop = await sharp(baseFile)
        .extract({
          left: Math.max(0, Math.min(1376 - bBox.width, bBox.left)),
          top: Math.max(0, Math.min(768 - bBox.height, bBox.top)),
          width: Math.min(1376 - bBox.left, bBox.width),
          height: Math.min(768 - bBox.top, bBox.height),
        })
        .resize(cropSize, cropSize, { fit: 'contain', background: { r: 25, g: 25, b: 30 } })
        .toBuffer();

      // Extract Diff crop
      const diffCrop = await sharp(v.file)
        .extract({
          left: Math.max(0, Math.min(1376 - dBox.width, dBox.left)),
          top: Math.max(0, Math.min(768 - dBox.height, dBox.top)),
          width: Math.min(1376 - dBox.left, dBox.width),
          height: Math.min(768 - dBox.top, dBox.height),
        })
        .resize(cropSize, cropSize, { fit: 'contain', background: { r: 25, g: 25, b: 30 } })
        .toBuffer();

      // Combine side-by-side: [ Base | Diff ] with divider
      const outFile = path.join(cropDir, `${w}_compare${v.suffix}.jpg`);
      await sharp({
        create: {
          width: cropSize * 2 + 10,
          height: cropSize,
          channels: 3,
          background: { r: 20, g: 20, b: 25 }
        }
      })
      .composite([
        { input: baseCrop, left: 0, top: 0 },
        { input: diffCrop, left: cropSize + 10, top: 0 }
      ])
      .jpeg({ quality: 90 })
      .toFile(outFile);

      console.log(`  ✓ ${outFile}`);
    }
  }
}

run();
