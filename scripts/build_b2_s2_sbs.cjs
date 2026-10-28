const sharp = require('sharp');
const fs = require('fs');

const baseFile = 'public/assets/spotter/book2_scene2_base.jpg';

// Coordinates on Base (1376x768)
const baseBoxes = {
  draw: { left: 80, top: 540, width: 220, height: 220, color: '#ef4444' },
  cook: { left: 250, top: 390, width: 150, height: 280, color: '#f97316' },
  pot: { left: 380, top: 520, width: 140, height: 190, color: '#eab308' },
  doctor: { left: 525, top: 385, width: 110, height: 300, color: '#10b981' },
  nurse: { left: 615, top: 375, width: 100, height: 310, color: '#06b6d4' },
  student: { left: 680, top: 640, width: 130, height: 128, color: '#3b82f6' },
  teacher: { left: 790, top: 535, width: 170, height: 233, color: '#8b5cf6' },
  driver: { left: 855, top: 335, width: 85, height: 150, color: '#ec4899' },
};

// Coordinates on Variant A
const varABoxes = {
  draw: { left: 850, top: 560, width: 220, height: 200, color: '#ef4444' },
  cook: { left: 470, top: 460, width: 120, height: 270, color: '#f97316' },
  pot: { left: 570, top: 630, width: 100, height: 120, color: '#eab308' },
  doctor: { left: 660, top: 540, width: 105, height: 220, color: '#10b981' },
  nurse: { left: 750, top: 555, width: 100, height: 210, color: '#06b6d4' },
  student: { left: 340, top: 540, width: 95, height: 220, color: '#3b82f6' },
  teacher: { left: 260, top: 440, width: 95, height: 320, color: '#8b5cf6' },
  driver: { left: 160, top: 440, width: 80, height: 140, color: '#ec4899' },
};

// Coordinates on Variant B
const varBBoxes = {
  draw: { left: 810, top: 530, width: 220, height: 230, color: '#ef4444' },
  cook: { left: 25, top: 470, width: 180, height: 298, color: '#f97316' },
  pot: { left: 175, top: 700, width: 130, height: 68, color: '#eab308' },
  doctor: { left: 305, top: 580, width: 105, height: 188, color: '#10b981' },
  nurse: { left: 405, top: 575, width: 105, height: 193, color: '#06b6d4' },
  student: { left: 680, top: 600, width: 125, height: 168, color: '#3b82f6' },
  teacher: { left: 520, top: 520, width: 130, height: 248, color: '#8b5cf6' },
  driver: { left: 295, top: 330, width: 85, height: 170, color: '#ec4899' },
};

// Coordinates on Variant C
const varCBoxes = {
  draw: { left: 840, top: 540, width: 200, height: 220, color: '#ef4444' },
  cook: { left: 290, top: 500, width: 110, height: 200, color: '#f97316' },
  pot: { left: 400, top: 610, width: 100, height: 120, color: '#eab308' },
  doctor: { left: 780, top: 330, width: 110, height: 185, color: '#10b981' },
  nurse: { left: 890, top: 355, width: 90, height: 175, color: '#06b6d4' },
  student: { left: 650, top: 600, width: 100, height: 168, color: '#3b82f6' },
  teacher: { left: 550, top: 390, width: 125, height: 270, color: '#8b5cf6' },
  driver: { left: 155, top: 465, width: 80, height: 175, color: '#ec4899' },
};

function createSvgBoxes(boxes, width, height) {
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  for (const [k, b] of Object.entries(boxes)) {
    svg += `<rect x="${b.left}" y="${b.top}" width="${b.width}" height="${b.height}" fill="none" stroke="${b.color}" stroke-width="4" stroke-dasharray="8,4" rx="8" />`;
    svg += `<rect x="${b.left}" y="${b.top - 24}" width="${k.length * 12 + 16}" height="24" fill="${b.color}" rx="4" />`;
    svg += `<text x="${b.left + 8}" y="${b.top - 7}" fill="#ffffff" font-size="14" font-weight="bold" font-family="sans-serif">${k}</text>`;
  }
  svg += '</svg>';
  return Buffer.from(svg);
}

const variants = [
  { key: 'A', outFile: 'public/assets/spotter/book2_scene2_side_by_side_boxes.jpg', diffFile: 'public/assets/spotter/book2_scene2_diff.jpg', boxes: varABoxes },
  { key: 'B', outFile: 'public/assets/spotter/book2_scene2_side_by_side_boxes_varb.jpg', diffFile: 'public/assets/spotter/book2_scene2_diff_varb.jpg', boxes: varBBoxes },
  { key: 'C', outFile: 'public/assets/spotter/book2_scene2_side_by_side_boxes_varc.jpg', diffFile: 'public/assets/spotter/book2_scene2_diff_varc.jpg', boxes: varCBoxes },
];

async function run() {
  const baseSvg = createSvgBoxes(baseBoxes, 1376, 768);
  const baseWithBoxes = await sharp(baseFile)
    .composite([{ input: baseSvg, left: 0, top: 0 }])
    .toBuffer();

  for (const v of variants) {
    const diffSvg = createSvgBoxes(v.boxes, 1376, 768);
    const diffWithBoxes = await sharp(v.diffFile)
      .composite([{ input: diffSvg, left: 0, top: 0 }])
      .toBuffer();

    await sharp({
      create: {
        width: 1376 * 2 + 20,
        height: 768,
        channels: 3,
        background: { r: 15, g: 15, b: 20 }
      }
    })
    .composite([
      { input: baseWithBoxes, left: 0, top: 0 },
      { input: diffWithBoxes, left: 1376 + 20, top: 0 }
    ])
    .jpeg({ quality: 88 })
    .toFile(v.outFile);

    console.log(`✓ Saved: ${v.outFile}`);
  }
}

run();
