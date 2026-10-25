const { createSideBySideAndOverlays } = require('./inspect_book1_scene2.cjs');
const fs = require('fs');
const path = require('path');

async function run() {
  const basePath = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_market_base_1792828395305.jpg';
  const diffPath = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_market_difference_1792828472957.jpg';

  const items = [
    { word: 'grape', wordZh: '葡萄', x: 122, y: 125, radiusX: 110, radiusY: 100, descZh: '左圖木藤架垂掛深紫葡萄，右圖轉為翠綠無籽葡萄' },
    { word: 'banana', wordZh: '香蕉', x: 335, y: 450, radiusX: 75, radiusY: 85, descZh: '左圖藤編吊籃放有一串熟黃香蕉，右圖吊籃空無一物' },
    { word: 'apple', wordZh: '蘋果', x: 165, y: 645, radiusX: 95, radiusY: 70, descZh: '左圖木箱裝滿青蘋果，右圖轉為鮮紅富士蘋果' },
    { word: 'cat', wordZh: '貓咪', x: 680, y: 355, radiusX: 65, radiusY: 50, descZh: '左圖石橋欄杆趴著橘白花貓，右圖替換成純黑貓咪' },
    { word: 'dog', wordZh: '狗狗', x: 915, y: 535, radiusX: 90, radiusY: 85, descZh: '左圖石板路坐著柴犬，右圖轉為趴著的斑點大麥町犬' },
    { word: 'fish', wordZh: '魚兒', x: 700, y: 670, radiusX: 80, ry: 65, radiusY: 65, descZh: '左圖運河游動金紅錦鯉，右圖替換成青藍色小魚' },
    { word: 'elephant', wordZh: '大象', x: 1220, y: 160, radiusX: 105, radiusY: 80, descZh: '左圖花圃露台為小象石雕噴泉，右圖替換為海豚躍水石雕噴泉' },
    { word: 'pumpkin', wordZh: '南瓜', x: 1185, y: 455, radiusX: 80, radiusY: 65, descZh: '左圖農舍窗台放金黃大南瓜，右圖替換為笑臉萬聖南瓜燈' }
  ];

  const brainDir = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3';
  const res = await createSideBySideAndOverlays(basePath, diffPath, items, brainDir);

  // Copy to public/assets/spotter
  const publicDir = path.resolve('public/assets/spotter');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  fs.copyFileSync(basePath, path.join(publicDir, 'book1_scene2_base.jpg'));
  fs.copyFileSync(diffPath, path.join(publicDir, 'book1_scene2_diff.jpg'));
  fs.copyFileSync(res.combinedBoxesPath, path.join(publicDir, 'book1_scene2_side_by_side_boxes.jpg'));
  fs.copyFileSync(res.overlayBasePath, path.join(publicDir, 'book1_scene2_base_boxes.jpg'));
  fs.copyFileSync(res.overlayDiffPath, path.join(publicDir, 'book1_scene2_diff_boxes.jpg'));

  console.log('Successfully re-generated and deployed calibrated overlay images!');
}

run().catch(console.error);
