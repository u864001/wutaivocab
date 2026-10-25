const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function testOverlay(bookNum, items, baseFile, diffFile) {
  const meta = await sharp(baseFile).metadata();
  const w = meta.width;
  const h = meta.height;

  let svgElements = '';
  const colors = ['#f43f5e', '#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#eab308', '#14b8a6', '#ec4899'];

  items.forEach((item, idx) => {
    const color = colors[idx % colors.length];
    const rx = item.rx || item.radiusX || item.radius;
    const ry = item.ry || item.radiusY || item.radius;
    const labelY = Math.max(22, item.y - ry - 10);
    const rectY = Math.max(8, item.y - ry - 24);

    svgElements += `
      <ellipse cx="${item.x}" cy="${item.y}" rx="${rx}" ry="${ry}" fill="${color}25" stroke="${color}" stroke-width="3" stroke-dasharray="6 4" />
      <circle cx="${item.x}" cy="${item.y}" r="5" fill="${color}" stroke="#ffffff" stroke-width="1.5" />
      <rect x="${item.x - 65}" y="${rectY}" width="130" height="20" rx="5" fill="rgba(15, 23, 42, 0.9)" stroke="${color}" stroke-width="1.5" />
      <text x="${item.x}" y="${labelY}" fill="#ffffff" font-size="11" font-weight="bold" font-family="sans-serif" text-anchor="middle">${item.word} (${item.wordZh})</text>
    `;
  });

  const overlaySvg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${svgElements}</svg>`;
  const overlayBuf = Buffer.from(overlaySvg);

  const leftWithBoxes = await sharp(baseFile).composite([{ input: overlayBuf }]).toBuffer();
  const rightWithBoxes = await sharp(diffFile).composite([{ input: overlayBuf }]).toBuffer();

  const dividerW = 12;
  const totalW = w * 2 + dividerW;
  const dividerSvg = `<svg width="${dividerW}" height="${h}"><rect width="${dividerW}" height="${h}" fill="#020617"/></svg>`;

  const stitched = await sharp({
    create: { width: totalW, height: h, channels: 3, background: '#020617' }
  }).composite([
    { input: leftWithBoxes, left: 0, top: 0 },
    { input: Buffer.from(dividerSvg), left: w, top: 0 },
    { input: rightWithBoxes, left: w + dividerW, top: 0 }
  ]).jpeg({ quality: 90 }).toFile(`public/assets/spotter/debug_crops/verify_b${bookNum}.jpg`);

  console.log(`Saved verification image for Book ${bookNum}: public/assets/spotter/debug_crops/verify_b${bookNum}.jpg`);
}

const FIXED_SCENES = {
  // ── BOOK 2: 陽光農莊與可愛動物公園 ──
  '2': {
    titleZh: '陽光農莊與可愛動物公園（三年級第 2 冊 • 場景 1）',
    base: 'public/assets/spotter/book2_base.jpg',
    diff: 'public/assets/spotter/book2_diff.jpg',
    items: [
      { word: 'cat', wordZh: '貓咪', x: 153, y: 417, rx: 75, ry: 55, descZh: '左圖長椅上是三花貓，右圖轉為橘色虎斑貓' },
      { word: 'ball', wordZh: '球', x: 441, y: 645, rx: 65, ry: 65, descZh: '左圖野餐墊旁是黑白足球，右圖轉為橘黑籃球' },
      { word: 'dog', wordZh: '狗狗', x: 596, y: 492, rx: 65, ry: 75, descZh: '左圖小狗戴紅色項圈，右圖轉為藍色項圈且俏皮眨眼' },
      { word: 'rabbit', wordZh: '兔子', x: 735, y: 485, rx: 55, ry: 50, descZh: '左圖幸運草堆是純白小兔，右圖轉為灰色小兔' },
      { word: 'turtle', wordZh: '烏龜', x: 815, y: 530, rx: 50, ry: 45, descZh: '左圖池塘岩石是青綠小龜，右圖轉為金黃暖橘花紋烏龜' },
      { word: 'frog', wordZh: '青蛙', x: 1115, y: 555, rx: 55, ry: 50, descZh: '左圖荷葉上是普通綠青蛙，右圖頭戴閃耀金皇冠轉為青蛙王子' },
      { word: 'kite', wordZh: '風箏', x: 815, y: 115, rx: 85, ry: 85, descZh: '左圖晴空是幾何條紋菱形風箏，右圖轉為彩虹蝴蝶彩繪風箏' },
      { word: 'bird', wordZh: '小鳥', x: 1245, y: 395, rx: 50, ry: 45, descZh: '左圖木柵欄上棲息2隻小鳥，右圖右側新增第3隻粉紅小鳥' }
    ]
  },

  // ── BOOK 3: 微風氣象湖畔與青草野餐公園 (修正 Sun 座標) ──
  '3': {
    titleZh: '微風氣象湖畔與青草野餐公園（四年級第 3 冊）',
    base: 'public/assets/spotter/book3_base.jpg',
    diff: 'public/assets/spotter/book3_diff.jpg',
    items: [
      { word: 'umbrella', wordZh: '遮陽傘', x: 140, y: 428, rx: 140, ry: 86, descZh: '左圖草地是紅白條紋遮陽傘，右圖轉為藍白海洋條紋傘' },
      { word: 'kite', wordZh: '風箏', x: 372, y: 124, rx: 130, ry: 120, descZh: '左圖晴空是幾何條紋風箏，右圖轉為菱形純色彩繪風箏' },
      { word: 'hamburger', wordZh: '漢堡', x: 472, y: 456, rx: 66, ry: 50, descZh: '左圖長椅上是起司牛肉堡，右圖轉為脆皮炸雞雙層堡' },
      { word: 'hot dog', wordZh: '熱狗', x: 784, y: 332, rx: 74, ry: 62, descZh: '左圖木棧道熱狗淋滿黃芥末醬，右圖淋滿番茄紅醬' },
      { word: 'sun', wordZh: '太陽', x: 500, y: 135, rx: 85, ry: 80, descZh: '左圖太陽散發金黃光芒，右圖轉為燦爛多芒晨曦（已校正移至中央太陽本體）' },
      { word: 'pizza', wordZh: '披薩', x: 716, y: 556, rx: 86, ry: 54, descZh: '左圖石台上是經典臘腸披薩，右圖轉為夏威夷鳳梨披薩' },
      { word: 'ice cream', wordZh: '冰淇淋', x: 996, y: 388, rx: 62, ry: 54, descZh: '左圖花叢邊是粉紅草莓冰淇淋，右圖轉為香濃巧克力甜筒' },
      { word: 'juice', wordZh: '果汁', x: 1132, y: 640, rx: 86, ry: 66, descZh: '左圖野餐墊是金黃柳橙果汁，右圖轉為翠綠奇異果汁' }
    ]
  },

  // ── BOOK 4: 英倫時鐘小鎮與透視溫馨家居 (修正 bed/hat 互換、公車擴大包覆整車、電腦、沙發、背包、書本) ──
  '4': {
    titleZh: '英倫時鐘小鎮與透視溫馨家居（四年級第 4 冊）',
    base: 'public/assets/spotter/book4_base.jpg',
    diff: 'public/assets/spotter/book4_diff.jpg',
    items: [
      { word: 'bus', wordZh: '公車', x: 210, y: 665, rx: 110, ry: 130, descZh: '左圖街道是經典英倫紅雙層巴士，右圖車身轉為皇家藍配色（已全域擴大包覆整輛巴士）' },
      { word: 'bed', wordZh: '床鋪', x: 275, y: 395, rx: 110, ry: 65, descZh: '左圖二樓單人床是暖黃格紋被套，右圖轉為深藍星空被套（已修正移至二樓床鋪）' },
      { word: 'hat', wordZh: '帽子', x: 275, y: 210, rx: 48, ry: 45, descZh: '左圖二樓衣帽架上是黑圓頂禮帽，右圖轉為黃色緞帶草帽（已修正移至二樓帽架）' },
      { word: 'computer', wordZh: '電腦', x: 605, y: 310, rx: 55, ry: 45, descZh: '左圖二樓書桌上是筆記型電腦螢幕發光，右圖轉為亮粉色外殼（已校準對齊書桌筆電）' },
      { word: 'sofa', wordZh: '沙發', x: 435, y: 765, rx: 85, ry: 75, descZh: '左圖客廳沙發是溫馨米色布面，右圖轉為墨綠復古絨布沙發（已校準對齊客廳主沙發）' },
      { word: 'book', wordZh: '書本', x: 535, y: 775, rx: 50, ry: 35, descZh: '左圖茶几上是翻開花草繪本，右圖轉為厚重精裝書（已校準對齊茶几書本）' },
      { word: 'bag', wordZh: '背包', x: 792, y: 792, rx: 50, ry: 50, descZh: '左圖玄關地毯旁是紅藍學生雙肩書包，右圖轉為草綠色休閒背包（已校準對齊玄關背包）' },
      { word: 'clock', wordZh: '時鐘', x: 855, y: 210, rx: 42, ry: 42, descZh: '左圖遠方大笨鐘面指標為整點，右圖指針與鐘面色彩轉變' }
    ]
  },

  // ── BOOK 5: 巴黎羅浮宮藝文廣場 (修正 lion/koala/milk/cake) ──
  '5': {
    titleZh: '巴黎羅浮宮藝文廣場（五年級第 5 冊）',
    base: 'public/assets/spotter/book5_base.jpg',
    diff: 'public/assets/spotter/book5_diff.jpg',
    items: [
      { word: 'koala', wordZh: '無尾熊', x: 88, y: 275, rx: 65, ry: 65, descZh: '左圖左側大樹幹趴著灰毛無尾熊，右圖耳朵戴著金黃花朵（已校正移至左側樹上無尾熊）' },
      { word: 'lion', wordZh: '守護石獅', x: 385, y: 345, rx: 80, ry: 75, descZh: '左圖宮殿台階旁是端坐石獅，右圖轉為暗銅色且頭戴金桂冠（已校正移至台階石獅）' },
      { word: 'milk', wordZh: '牛奶', x: 230, y: 725, rx: 45, ry: 60, descZh: '左圖前方石牆上是透明玻璃牛奶瓶，右圖轉為粉紅草莓鮮奶瓶（已校正移至矮牆牛奶）' },
      { word: 'bread', wordZh: '麵包', x: 300, y: 700, rx: 65, ry: 50, descZh: '左圖紙袋裝有法國金黃長棍麵包，右圖籃中轉為牛角可頌麵包' },
      { word: 'football', wordZh: '足球', x: 550, y: 755, rx: 55, ry: 55, descZh: '左圖廣場石板上是經典黑白足球，右圖轉為紅金獎盃足球' },
      { word: 'painting', wordZh: '畫作', x: 750, y: 595, rx: 65, ry: 70, descZh: '左圖畫架上是蒙娜麗莎神秘微笑，右圖蒙娜麗莎俏皮戴上黑色墨鏡' },
      { word: 'cake', wordZh: '蛋糕', x: 828, y: 790, rx: 50, ry: 45, descZh: '左圖圓木凳上是白奶油草莓切片蛋糕，右圖轉為黑森林櫻桃巧克力蛋糕（已更正為蛋糕）' },
      { word: 'camera', wordZh: '相機', x: 915, y: 635, rx: 65, ry: 55, descZh: '左圖路燈柱上懸掛著黑色單眼相機，右圖轉為青藍雙色拍立得相機' }
    ]
  },

  // ── BOOK 6: 世界自然歷史博物館 (修正大象、墨鏡、麵食、沙拉) ──
  '6': {
    titleZh: '世界自然歷史與星際探索博物館（五年級第 6 冊）',
    base: 'public/assets/spotter/book6_base.jpg',
    diff: 'public/assets/spotter/book6_diff.jpg',
    items: [
      { word: 'mask', wordZh: '口罩', x: 88, y: 550, rx: 55, ry: 45, descZh: '左圖接待台上方層架是淺藍醫用口罩，右圖轉為鮮黃笑臉口罩' },
      { word: 'rocket', wordZh: '火箭', x: 380, y: 220, rx: 115, ry: 75, descZh: '左圖穹頂懸掛經典紅白火箭，右圖轉為藍銀太空穿梭機' },
      { word: 'noodles', wordZh: '麵食', x: 345, y: 585, rx: 60, ry: 50, descZh: '左圖圓邊几上是熱氣騰騰的拉麵碗，右圖轉為番茄肉醬義大利麵' },
      { word: 'elephant', wordZh: '大象', x: 500, y: 520, rx: 90, ry: 70, descZh: '左圖中央自然展區是非洲灰象，右圖身披彩色刺繡節慶鞍毯（已校正對齊中央大象）' },
      { word: 'sunglasses', wordZh: '墨鏡', x: 500, y: 760, rx: 75, ry: 45, descZh: '左圖前方紅絲絨展台上是黑色飛行員墨鏡，右圖轉為紅色愛心造型墨鏡（已校正移至展台墨鏡）' },
      { word: 'salad', wordZh: '沙拉', x: 685, y: 645, rx: 60, ry: 45, descZh: '左圖休息長椅上是木碗生菜沙拉，右圖轉為繽紛水果沙拉' },
      { word: 'dinosaur', wordZh: '恐龍', x: 750, y: 260, rx: 125, ry: 85, descZh: '左圖二樓夾層是霸王龍骨骼化石，右圖轉為三角龍骨骼化石' },
      { word: 'backpack', wordZh: '背包', x: 835, y: 765, rx: 55, ry: 65, descZh: '左圖圍欄立柱掛著藍橘撞色背包，右圖轉為紫綠雙色探險背包' }
    ]
  },

  // ── BOOK 7: 世界節慶與環球港灣 (地圖擴大、行李箱擴大且不與地圖重疊) ──
  '7': {
    titleZh: '世界節慶與環球港灣（六年級第 7 冊）',
    base: 'public/assets/spotter/book7_base.jpg',
    diff: 'public/assets/spotter/book7_diff.jpg',
    items: [
      { word: 'airplane', wordZh: '飛機', x: 336, y: 108, rx: 145, ry: 48, descZh: '左圖高空是經典白藍客機，右圖轉為金橘色超音速噴射機' },
      { word: 'flag', wordZh: '國旗', x: 1140, y: 64, rx: 52, ry: 42, descZh: '左圖燈塔頂端是紅白藍國家旗幟，右圖轉為金黃海軍藍燕尾信號旗' },
      { word: 'train', wordZh: '火車', x: 792, y: 260, rx: 175, ry: 45, descZh: '左圖石拱橋上是復古蒸氣火車，右圖轉為流線型銀紅高速列車' },
      { word: 'ship', wordZh: '輪船', x: 440, y: 390, rx: 140, ry: 105, descZh: '左圖港灣中是純白豪華遊輪，右圖轉為雙桅木造復古風帆帆船' },
      { word: 'postcard', wordZh: '明信片', x: 172, y: 548, rx: 88, ry: 52, descZh: '左圖郵筒旁是燈塔海景明信片，右圖轉為熱帶海灘愛心郵戳明信片' },
      { word: 'map', wordZh: '地圖', x: 640, y: 630, rx: 140, ry: 125, descZh: '左圖欄杆上是平鋪彩色世界地圖，右圖轉為復古羊皮紙藏寶圖（已全域擴大包覆整張地圖）' },
      { word: 'suitcase', wordZh: '行李箱', x: 925, y: 635, rx: 120, ry: 125, descZh: '左圖長椅旁是復古真皮皮箱，右圖轉為亮綠藍色硬殼四輪行李箱（已擴大包覆且與地圖獨立零重疊）' },
      { word: 'gift', wordZh: '禮物', x: 1272, y: 532, rx: 75, ry: 72, descZh: '左圖售票亭是深藍金緞帶禮盒，右圖轉為緋紅翠綠緞帶禮盒' }
    ]
  },

  // ── BOOK 8: 四季時光庭園 (天鵝擴大包覆全鵝與鵝頭、鏟子整體往右上移包覆整支、大衣往上移包覆領口) ──
  '8': {
    titleZh: '四季時光庭園與畢業留影（六年級第 8 冊）',
    base: 'public/assets/spotter/book8_base.jpg',
    diff: 'public/assets/spotter/book8_diff.jpg',
    items: [
      { word: 'swan', wordZh: '天鵝', x: 250, y: 580, rx: 95, ry: 90, descZh: '左圖池中是優雅純白白天鵝，右圖轉為紅喙純黑天鵝（已擴大包覆天鵝頭頸、羽翼與尾部）' },
      { word: 'spade', wordZh: '鏟子', x: 145, y: 610, rx: 65, ry: 160, descZh: '左圖花圃泥土插著銀柄鏟子，右圖轉為金黃園藝鏟（已往右上移，完整涵蓋頂端手柄至入土鏟刃）' },
      { word: 'drum', wordZh: '鼓', x: 288, y: 272, rx: 66, ry: 50, descZh: '左圖涼亭舞台是紅金行進鼓，右圖轉為皇家深藍小鼓' },
      { word: 'pie', wordZh: '派', x: 704, y: 528, rx: 98, ry: 48, descZh: '左圖石台茶几上是酥皮水果派，右圖轉為深紫黑莓派' },
      { word: 'rose', wordZh: '玫瑰', x: 700, y: 272, rx: 70, ry: 66, descZh: '左圖拱門是鮮紅玫瑰花叢，右圖轉為金黃玫瑰花叢' },
      { word: 'coat', wordZh: '大衣', x: 952, y: 310, rx: 80, ry: 105, descZh: '左圖長椅上是海軍藍風衣，右圖轉為暖駝色牛角扣大衣（已往上延伸完整包覆大衣領口）' },
      { word: 'flute', wordZh: '長笛', x: 980, y: 515, rx: 115, ry: 35, descZh: '左圖樂譜架上是銀白長笛，右圖轉為玫瑰金長笛' },
      { word: 'dress', wordZh: '洋裝', x: 1256, y: 356, rx: 106, ry: 130, descZh: '左圖人台上是淡紫碎花洋裝，右圖轉為祖母綠綢緞晚宴洋裝' }
    ]
  }
};

async function renderAll() {
  for (const b of ['2', '3', '4', '5', '6', '7', '8']) {
    const sc = FIXED_SCENES[b];
    await testOverlay(b, sc.items, sc.base, sc.diff);
  }
  console.log('All 7 books verification overlays created successfully!');
}

renderAll().catch(console.error);
