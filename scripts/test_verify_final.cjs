const sharp = require('sharp');

// 8 Pinpoint Ground Truth Targets for Book 6 Scene 2 (Singapore Gardens by the Bay)
const targets = [
  { name: 'tree', x: 230, y: 220, rx: 150, ry: 115 },
  { name: 'statue', x: 460, y: 335, rx: 45, ry: 85 },
  { name: 'boat', x: 880, y: 390, rx: 118, ry: 48 },
  { name: 'water', x: 585, y: 515, rx: 25, ry: 48 },
  { name: 'noodles', x: 525, y: 600, rx: 66, ry: 50 },
  { name: 'salad', x: 710, y: 550, rx: 65, ry: 50 },
  { name: 'soup', x: 865, y: 550, rx: 65, ry: 52 },
  { name: 'fan', x: 670, y: 650, rx: 70, ry: 40 }
];

async function verifyFinal() {
  const baseImg = 'public/assets/spotter/book6_scene2_base.jpg';
  const width = 1376, height = 768;

  console.log('=== 28 PAIRWISE DISTANCE VERIFICATION (TRUE GROUND TRUTH) ===');
  let overlaps = 0;
  let minGap = Infinity;
  let minPair = '';

  for (let i = 0; i < targets.length; i++) {
    for (let j = i + 1; j < targets.length; j++) {
      const t1 = targets[i];
      const t2 = targets[j];
      const dx = t1.x - t2.x;
      const dy = t1.y - t2.y;
      const dist = Math.hypot(dx, dy);

      const angle = Math.atan2(dy, dx);
      const r1 = Math.hypot(t1.rx * Math.cos(angle), t1.ry * Math.sin(angle));
      const r2 = Math.hypot(t2.rx * Math.cos(angle), t2.ry * Math.sin(angle));
      const gap = dist - (r1 + r2);

      if (gap < minGap) {
        minGap = gap;
        minPair = `${t1.name} <-> ${t2.name}`;
      }
      if (gap <= 0) overlaps++;
      console.log(`Pair: ${t1.name.padEnd(8)} <-> ${t2.name.padEnd(8)}: Dist=${dist.toFixed(1)}px, BoundSum=${(r1+r2).toFixed(1)}px, Gap=${gap.toFixed(1)}px ${gap <= 0 ? 'OVERLAP!' : 'OK'}`);
    }
  }

  console.log(`\nResult: Overlaps = ${overlaps} / 28 pairs`);
  console.log(`Smallest Gap: ${minGap.toFixed(1)}px (${minPair})`);

  // Draw visual preview on base image
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .box { fill: none; stroke: #00ffcc; stroke-width: 3.5; }
        .label { font-family: sans-serif; font-size: 15px; font-weight: bold; fill: #ffffff; text-shadow: 1px 1px 3px black; }
        .tag-bg { fill: rgba(0,0,0,0.75); }
      </style>
      ${targets.map(c => `
        <ellipse cx="${c.x}" cy="${c.y}" rx="${c.rx}" ry="${c.ry}" class="box" />
        <rect x="${c.x - 42}" y="${c.y - c.ry - 22}" width="84" height="20" rx="4" class="tag-bg" />
        <text x="${c.x}" y="${c.y - c.ry - 7}" text-anchor="middle" class="label">${c.name}</text>
      `).join('\n')}
    </svg>
  `;

  await sharp(baseImg)
    .composite([{ input: Buffer.from(svg), left: 0, top: 0 }])
    .jpeg({ quality: 90 })
    .toFile('C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/b6_s2_ground_truth_final.jpg');

  console.log('Saved b6_s2_ground_truth_final.jpg');
}

verifyFinal().catch(console.error);
