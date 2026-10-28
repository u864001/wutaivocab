const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const baseImg = 'public/assets/spotter/book2_scene2_base.jpg';
const outDir = 'public/assets/spotter/crops/b2_s2_test';
fs.mkdirSync(outDir, { recursive: true });

// Height is 768. Let's calibrate Y correctly:
// easel (draw) is on left from Y ~400 to 760
// cook is around X: 260-400, Y: 390-680
// pot is around X: 380-510, Y: 520-710
// doctor is around X: 530-630, Y: 390-680
// nurse is around X: 620-710, Y: 380-680
// driver is around X: 860-930, Y: 340-470
// student is around X: 690-810, Y: 650-768
// teacher is around X: 800-950, Y: 540-768

const items = [
  { word: 'draw', x: 80, y: 560, w: 200, h: 200 },
  { word: 'cook', x: 255, y: 390, w: 140, h: 280 },
  { word: 'pot', x: 380, y: 525, w: 130, h: 185 },
  { word: 'doctor', x: 530, y: 390, w: 100, h: 290 },
  { word: 'nurse', x: 620, y: 375, w: 90, h: 305 },
  { word: 'driver', x: 860, y: 340, w: 75, h: 140 },
  { word: 'student', x: 690, y: 660, w: 120, h: 108 },
  { word: 'teacher', x: 795, y: 540, w: 160, h: 228 },
];

async function run() {
  for (const item of items) {
    const left = Math.max(0, item.x);
    const top = Math.max(0, item.y);
    const width = Math.min(1376 - left, item.w);
    const height = Math.min(768 - top, item.h);

    await sharp(baseImg)
      .extract({ left, top, width, height })
      .toFile(path.join(outDir, `${item.word}.jpg`));
    console.log(`Cropped ${item.word}: ${left},${top} ${width}x${height}`);
  }
}

run();
