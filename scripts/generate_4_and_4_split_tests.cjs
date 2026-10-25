const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateSplitTests() {
  const basePath = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_canal_market_base_v2_1792829379631.jpg';
  const diffPath = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_canal_market_diff_v1_1792829455967.jpg';
  const brainDir = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3';
  const publicDir = path.resolve('public/assets/spotter');

  const w = 1376;
  const h = 768;

  // Define slots for all 8 items with feathered masks
  const allItems = [
    {
      word: 'grape',
      wordZh: '葡萄',
      x: 250,
      y: 190,
      radiusX: 185,
      radiusY: 125,
      slot: { x: 50, y: 50, w: 450, h: 320, rx: 20 },
      descZh: '深紫葡萄 ➔ 翠綠葡萄'
    },
    {
      word: 'banana',
      wordZh: '香蕉',
      x: 160,
      y: 430,
      radiusX: 65,
      radiusY: 60,
      slot: { x: 95, y: 370, w: 130, h: 140, rx: 16 },
      descZh: '熟黃香蕉 ➔ 空吊籃'
    },
    {
      word: 'apple',
      wordZh: '蘋果',
      x: 185,
      y: 650,
      radiusX: 110,
      radiusY: 70,
      slot: { x: 40, y: 580, w: 240, h: 170, rx: 16 },
      descZh: '青蘋果 ➔ 紅蘋果（含箱外落果）'
    },
    {
      word: 'cat',
      wordZh: '貓咪',
      x: 774,
      y: 423,
      radiusX: 55,
      radiusY: 45,
      slot: { x: 710, y: 380, w: 130, h: 100, rx: 14 },
      descZh: '橘白花貓 ➔ 純黑長尾貓'
    },
    {
      word: 'dog',
      wordZh: '狗狗',
      x: 464,
      y: 602,
      radiusX: 95,
      radiusY: 85,
      slot: { x: 345, y: 475, w: 245, h: 235, rx: 20 },
      descZh: '金黃柴犬 ➔ 斑點大麥町犬'
    },
    {
      word: 'fish',
      wordZh: '魚兒',
      x: 712,
      y: 662,
      radiusX: 52,
      radiusY: 42,
      slot: { x: 620, y: 640, w: 150, h: 90, rx: 16 },
      descZh: '金紅錦鯉 ➔ 青藍小魚'
    },
    {
      word: 'elephant',
      wordZh: '大象',
      x: 1117,
      y: 573,
      radiusX: 58,
      radiusY: 52,
      slot: { x: 1040, y: 525, w: 160, h: 130, rx: 16 },
      descZh: '小象石雕噴泉 ➔ 海豚石雕噴泉'
    },
    {
      word: 'pumpkin',
      wordZh: '南瓜',
      x: 1263,
      y: 500,
      radiusX: 42,
      radiusY: 36,
      slot: { x: 1210, y: 455, w: 110, h: 95, rx: 14 },
      descZh: '金黃大南瓜 ➔ 笑臉南瓜燈'
    }
  ];

  // Helper to extract a feathered patch from diff
  async function createPatch(item) {
    const s = item.slot;
    const diffCrop = await sharp(diffPath).extract({ left: s.x, top: s.y, width: s.w, height: s.h }).toBuffer();
    const maskSvg = `<svg width="${s.w}" height="${s.h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="feather" cx="50%" cy="50%" r="50%">
          <stop offset="80%" stop-color="#ffffff" stop-opacity="1"/>
          <stop offset="98%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${s.w}" height="${s.h}" rx="${s.rx || 14}" fill="url(#feather)"/>
    </svg>`;
    const patchBuf = await sharp(diffCrop)
      .ensureAlpha()
      .composite([{ input: Buffer.from(maskSvg), blend: 'dest-in' }])
      .png()
      .toBuffer();
    return { patchBuf, x: s.x, y: s.y };
  }

  // Pre-generate all 8 patches
  const patchMap = {};
  for (const it of allItems) {
    patchMap[it.word] = await createPatch(it);
  }

  // Helper to generate side-by-side with SVG overlay boxes for specific active items
  async function renderTestRun(runId, activeWords, labelText) {
    const activeItems = allItems.filter(it => activeWords.includes(it.word));
    const inactiveItems = allItems.filter(it => !activeWords.includes(it.word));

    // 1. Compose Right Image: Base Image + active patches ONLY!
    const activeComposites = activeItems.map(it => ({
      input: patchMap[it.word].patchBuf,
      left: patchMap[it.word].x,
      top: patchMap[it.word].y
    }));

    const rightStampedBuf = await sharp(basePath)
      .composite(activeComposites)
      .jpeg({ quality: 92 })
      .toBuffer();

    // 2. Generate SVG overlay: boxes ONLY on active items!
    const colors = ['#f43f5e', '#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#eab308', '#14b8a6', '#ec4899'];
    let svgElements = '';
    activeItems.forEach((item, idx) => {
      const rx = item.radiusX;
      const ry = item.radiusY;
      const color = colors[idx % colors.length];
      const labelY = Math.max(25, item.y - ry - 14);
      const rectY = Math.max(10, item.y - ry - 30);

      svgElements += `
        <!-- Active Target ${idx + 1}: ${item.word} -->
        <ellipse cx="${item.x}" cy="${item.y}" rx="${rx}" ry="${ry}" fill="${color}20" stroke="${color}" stroke-width="4" stroke-dasharray="8 4" />
        <circle cx="${item.x}" cy="${item.y}" r="6" fill="${color}" stroke="#ffffff" stroke-width="2" />
        <rect x="${item.x - 70}" y="${rectY}" width="140" height="24" rx="6" fill="rgba(15, 23, 42, 0.9)" stroke="${color}" stroke-width="2" />
        <text x="${item.x}" y="${labelY}" fill="#ffffff" font-size="12" font-weight="bold" font-family="sans-serif" text-anchor="middle">🎯 ${item.word} (${item.wordZh})</text>
      `;
    });

    // Also draw a badge at top-center explaining the run
    svgElements += `
      <rect x="${w/2 - 200}" y="20" width="400" height="34" rx="8" fill="rgba(15, 23, 42, 0.88)" stroke="#38bdf8" stroke-width="2" />
      <text x="${w/2}" y="42" fill="#38bdf8" font-size="14" font-weight="bold" font-family="sans-serif" text-anchor="middle">${labelText}</text>
    `;

    const svgOverlay = Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${svgElements}</svg>`);

    const leftWithOverlay = await sharp(basePath).composite([{ input: svgOverlay }]).toBuffer();
    const rightWithOverlay = await sharp(rightStampedBuf).composite([{ input: svgOverlay }]).toBuffer();

    const divW = 16;
    const totalW = w * 2 + divW;
    const dividerSvg = `<svg width="${divW}" height="${h}"><rect width="${divW}" height="${h}" fill="#0f172a"/><line x1="${divW/2}" y1="0" x2="${divW/2}" y2="${h}" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,6"/></svg>`;

    const outPath = path.join(brainDir, `dynamic_test_${runId}.jpg`);
    await sharp({
      create: { width: totalW, height: h, channels: 3, background: { r: 15, g: 23, b: 42 } }
    })
    .composite([
      { input: leftWithOverlay, top: 0, left: 0 },
      { input: Buffer.from(dividerSvg), top: 0, left: w },
      { input: rightWithOverlay, top: 0, left: w + divW }
    ])
    .jpeg({ quality: 92 })
    .toFile(outPath);

    console.log(`Saved ${outPath}`);
    return outPath;
  }

  // Run 1: Mutate Set 1 (apple, banana, grape, cat). Set 2 stays Base!
  const run1Path = await renderTestRun('set1_4items', ['grape', 'banana', 'apple', 'cat'], '測試一：抽取前 4 題 (左半邊單字變異，右半邊完全原圖)');

  // Run 2: Mutate Set 2 (dog, fish, elephant, pumpkin). Set 1 stays Base!
  const run2Path = await renderTestRun('set2_4items', ['dog', 'fish', 'elephant', 'pumpkin'], '測試二：抽取後 4 題 (右半邊單字變異，左半邊完全原圖)');

  console.log('Finished generating both 4-and-4 split test runs!');
}

generateSplitTests().catch(console.error);
