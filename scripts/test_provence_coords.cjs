const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgPath = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/book2_scene1_base_provence_clean_1793074089917.jpg';
const artDir = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3';

// Calibrated target items based on Mark's specific feedback:
// 1. heart: expanded right to wrap entire heart balloon + bow
// 2. dog: enlarged to fully cover entire puppy from head/ears to paws
// 3. fish: enlarged flat ellipse to cover entire bottom water pool
// 4. flower: expanded upper-right to cover sunflowers & pot without touching gift
// 5. gift: shifted up to cover top ribbon bow & avoid flower
// 6. card: enlarged to comfortably accommodate A/B/C variants
const TARGET_ITEMS = [
  { word: 'heart', wordZh: '愛心', x: 172, y: 250, rx: 82, ry: 115 },
  { word: 'cat', wordZh: '貓咪', x: 270, y: 615, rx: 105, ry: 60 },
  { word: 'dog', wordZh: '小狗', x: 410, y: 480, rx: 78, ry: 92 },
  { word: 'fish', wordZh: '魚', x: 684, y: 508, rx: 150, ry: 52 },
  { word: 'card', wordZh: '卡片', x: 948, y: 612, rx: 65, ry: 95 },
  { word: 'gift', wordZh: '禮物', x: 1150, y: 430, rx: 78, ry: 85 },
  { word: 'flower', wordZh: '花朵', x: 1270, y: 630, rx: 105, ry: 125 },
  { word: 'bird', wordZh: '小鳥', x: 1265, y: 120, rx: 70, ry: 50 }
];

function ellipseRadiusAtAngle(rx, ry, theta) {
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  return (rx * ry) / Math.sqrt((ry * cos) ** 2 + (rx * sin) ** 2);
}

console.log('Testing 28 pairs of Book 2 Scene 1 coordinates (v6):');
let overlaps = 0;
for (let i = 0; i < TARGET_ITEMS.length; i++) {
  for (let j = i + 1; j < TARGET_ITEMS.length; j++) {
    const a = TARGET_ITEMS[i];
    const b = TARGET_ITEMS[j];

    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.hypot(dx, dy);

    const angleAB = Math.atan2(dy, dx);
    const angleBA = Math.atan2(-dy, -dx);

    const rA = ellipseRadiusAtAngle(a.rx, a.ry, angleAB);
    const rB = ellipseRadiusAtAngle(b.rx, b.ry, angleBA);

    const margin = dist - (rA + rB);
    const isOverlapping = margin < 0;
    if (isOverlapping) overlaps++;

    console.log(`Pair (${a.word.padEnd(8)} <-> ${b.word.padEnd(8)}): dist=${dist.toFixed(1).padStart(5)}px, sumR=${(rA + rB).toFixed(1).padStart(5)}px, margin=${margin.toFixed(1).padStart(5)}px ${isOverlapping ? '❌ OVERLAP' : '✓ OK'}`);
  }
}
console.log('\nTotal overlaps:', overlaps);

async function main() {
  const meta = await sharp(imgPath).metadata();

  // 1. Preview with boxes and labels
  let svg = `<svg width="${meta.width}" height="${meta.height}" xmlns="http://www.w3.org/2000/svg">`;
  TARGET_ITEMS.forEach(it => {
    svg += `<ellipse cx="${it.x}" cy="${it.y}" rx="${it.rx}" ry="${it.ry}" fill="none" stroke="#00ff66" stroke-width="3" stroke-dasharray="6,4"/>`;
    svg += `<rect x="${it.x - 55}" y="${Math.max(10, it.y - it.ry - 26)}" width="110" height="22" fill="rgba(0,0,0,0.8)" rx="5"/>`;
    svg += `<text x="${it.x}" y="${Math.max(10, it.y - it.ry - 26) + 16}" fill="#00ff66" font-size="13" font-family="sans-serif" font-weight="bold" text-anchor="middle">${it.word} (${it.wordZh})</text>`;
  });
  svg += `</svg>`;

  await sharp(imgPath)
    .composite([{ input: Buffer.from(svg), left: 0, top: 0 }])
    .jpeg({ quality: 95 })
    .toFile(path.join(artDir, 'provence_boxes_perfect_v6.jpg'));

  console.log('Saved provence_boxes_perfect_v6.jpg');

  // 2. Clean version (boxes only)
  let cleanSvg = `<svg width="${meta.width}" height="${meta.height}" xmlns="http://www.w3.org/2000/svg">`;
  TARGET_ITEMS.forEach(it => {
    cleanSvg += `<ellipse cx="${it.x}" cy="${it.y}" rx="${it.rx}" ry="${it.ry}" fill="none" stroke="#00ff66" stroke-width="3" stroke-dasharray="6,4"/>`;
  });
  cleanSvg += `</svg>`;

  await sharp(imgPath)
    .composite([{ input: Buffer.from(cleanSvg), left: 0, top: 0 }])
    .jpeg({ quality: 95 })
    .toFile(path.join(artDir, 'provence_boxes_clean_v6.jpg'));

  console.log('Saved provence_boxes_clean_v6.jpg');
}

main().catch(console.error);
