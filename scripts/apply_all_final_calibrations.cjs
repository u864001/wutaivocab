const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.resolve('public/assets/spotter');

// 1. Patch Book 6 to replace food with papercraft cap and umbrella
async function patchBook6Food() {
  console.log('=== Patching Book 6: Removing food and adding cap & umbrella ===');

  const baseFile = path.join(publicDir, 'book6_base.jpg');
  const diffFile = path.join(publicDir, 'book6_diff.jpg');

  // Cap on table (x: 480, y: 466) -> left: 415, top: 415
  const baseCapSvg = Buffer.from(`
    <svg width="130" height="100" viewBox="0 0 130 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="b6dropSh" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.45"/>
        </filter>
      </defs>
      <ellipse cx="65" cy="74" rx="52" ry="18" fill="#1e293b" opacity="0.65"/>
      <path d="M 18 70 C 28 84 92 86 116 66 C 96 60 44 58 18 70 Z" fill="#1e40af" stroke="#1d4ed8" stroke-width="1.5" filter="url(#b6dropSh)"/>
      <path d="M 22 70 C 30 82 90 84 112 66 C 96 62 48 60 22 70 Z" fill="#2563eb"/>
      <path d="M 30 62 C 26 34 54 18 75 20 C 96 22 106 43 103 60 C 85 56 48 56 30 62 Z" fill="#1d4ed8" stroke="#1e3a8a" stroke-width="1.5" filter="url(#b6dropSh)"/>
      <path d="M 34 60 C 30 36 55 22 74 23 C 92 24 102 44 99 58 C 82 54 50 54 34 60 Z" fill="#3b82f6"/>
      <path d="M 74 23 C 68 38 65 50 64 58" stroke="#1e40af" stroke-width="1.5" stroke-dasharray="3 2" fill="none"/>
      <path d="M 74 23 C 80 38 85 48 86 56" stroke="#1e40af" stroke-width="1.5" stroke-dasharray="3 2" fill="none"/>
      <circle cx="74" cy="22" r="4.5" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <circle cx="65" cy="42" r="8.5" fill="#ffffff" stroke="#1e3a8a" stroke-width="1" filter="url(#b6dropSh)"/>
      <polygon points="65,36 67,41 72,41 68,44 70,49 65,46 60,49 62,44 58,41 63,41" fill="#fbbf24"/>
    </svg>
  `);

  const diffCapSvg = Buffer.from(`
    <svg width="130" height="100" viewBox="0 0 130 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="b6dropSh2" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.45"/>
        </filter>
      </defs>
      <ellipse cx="65" cy="74" rx="52" ry="18" fill="#1e293b" opacity="0.65"/>
      <path d="M 18 70 C 28 84 92 86 116 66 C 96 60 44 58 18 70 Z" fill="#991b1b" stroke="#b91c1c" stroke-width="1.5" filter="url(#b6dropSh2)"/>
      <path d="M 22 70 C 30 82 90 84 112 66 C 96 62 48 60 22 70 Z" fill="#dc2626"/>
      <path d="M 30 62 C 26 34 54 18 75 20 C 96 22 106 43 103 60 C 85 56 48 56 30 62 Z" fill="#b91c1c" stroke="#7f1d1d" stroke-width="1.5" filter="url(#b6dropSh2)"/>
      <path d="M 34 60 C 30 36 55 22 74 23 C 92 24 102 44 99 58 C 82 54 50 54 34 60 Z" fill="#ef4444"/>
      <path d="M 74 23 C 68 38 65 50 64 58" stroke="#991b1b" stroke-width="1.5" stroke-dasharray="3 2" fill="none"/>
      <path d="M 74 23 C 80 38 85 48 86 56" stroke="#991b1b" stroke-width="1.5" stroke-dasharray="3 2" fill="none"/>
      <circle cx="74" cy="22" r="4.5" fill="#facc15" stroke="#ca8a04" stroke-width="1"/>
      <circle cx="65" cy="42" r="8.5" fill="#1e293b" stroke="#facc15" stroke-width="1" filter="url(#b6dropSh2)"/>
      <polygon points="65,35 68,43 62,43" fill="#ffffff"/>
      <polygon points="65,42 67,48 63,48" fill="#f97316"/>
    </svg>
  `);

  // Umbrella on bench (x: 945, y: 493) -> left: 890, top: 450
  const baseUmbrellaSvg = Buffer.from(`
    <svg width="110" height="90" viewBox="0 0 110 90" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="b6uSh" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.5"/>
        </filter>
      </defs>
      <ellipse cx="55" cy="68" rx="42" ry="12" fill="#0f172a" opacity="0.6"/>
      <g transform="rotate(-18 55 50)" filter="url(#b6uSh)">
        <polygon points="55,10 52,18 58,18" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/>
        <path d="M 52 18 L 44 65 L 66 65 L 58 18 Z" fill="#eab308" stroke="#ca8a04" stroke-width="1.5"/>
        <path d="M 55 18 L 55 65" stroke="#fef08a" stroke-width="2"/>
        <path d="M 50 25 L 47 65" stroke="#a16207" stroke-width="1.2"/>
        <path d="M 60 25 L 63 65" stroke="#facc15" stroke-width="1.2"/>
        <rect x="47" y="42" width="16" height="4" rx="2" fill="#854d0e"/>
        <path d="M 55 65 L 55 78 C 55 85 45 85 45 78" stroke="#78350f" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      </g>
    </svg>
  `);

  const diffUmbrellaSvg = Buffer.from(`
    <svg width="110" height="90" viewBox="0 0 110 90" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="b6uSh2" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.5"/>
        </filter>
      </defs>
      <ellipse cx="55" cy="68" rx="42" ry="12" fill="#0f172a" opacity="0.6"/>
      <g transform="rotate(-18 55 50)" filter="url(#b6uSh2)">
        <polygon points="55,10 52,18 58,18" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
        <path d="M 52 18 L 44 65 L 66 65 L 58 18 Z" fill="#059669" stroke="#047857" stroke-width="1.5"/>
        <path d="M 55 18 L 55 65" stroke="#6ee7b7" stroke-width="2"/>
        <path d="M 50 25 L 47 65" stroke="#065f46" stroke-width="1.2"/>
        <path d="M 60 25 L 63 65" stroke="#34d399" stroke-width="1.2"/>
        <rect x="47" y="42" width="16" height="4" rx="2" fill="#dc2626"/>
        <path d="M 55 65 L 55 78 C 55 85 45 85 45 78" stroke="#cbd5e1" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      </g>
    </svg>
  `);

  const baseBuf = fs.readFileSync(baseFile);
  const diffBuf = fs.readFileSync(diffFile);

  const patchedBase = await sharp(baseBuf)
    .composite([
      { input: baseCapSvg, left: 415, top: 416 },
      { input: baseUmbrellaSvg, left: 890, top: 450 }
    ])
    .jpeg({ quality: 92 })
    .toBuffer();

  const patchedDiff = await sharp(diffBuf)
    .composite([
      { input: diffCapSvg, left: 415, top: 416 },
      { input: diffUmbrellaSvg, left: 890, top: 450 }
    ])
    .jpeg({ quality: 92 })
    .toBuffer();

  fs.writeFileSync(baseFile, patchedBase);
  fs.writeFileSync(diffFile, patchedDiff);
  console.log('Book 6 base and diff images successfully patched!');
}

const FINAL_CALIBRATED_SCENES = {
  // ── Book 2: 陽光農莊與可愛動物公園 ──
  '2': {
    varName: 'BOOK2_PARK_SCENE',
    id: 'book2_park',
    book: '2',
    grade: 3,
    titleZh: '陽光農莊與可愛動物公園（三年級第 2 冊）',
    titleEn: 'Sunny Farm & Pet Park (Book 2)',
    descZh: '在溫暖的陽光農莊與綠草如茵的公園中，找出 8 處相異動物與玩具！',
    baseImage: '/assets/spotter/book2_base.jpg',
    diffImage: '/assets/spotter/book2_diff.jpg',
    width: 1376,
    height: 768,
    items: [
      { word: 'cat', wordZh: '貓咪', x: 153, y: 417, radius: 75, radiusX: 75, radiusY: 55, typeZh: '花色品種', descZh: '左圖長椅上是三花貓，右圖轉為橘色虎斑貓' },
      { word: 'ball', wordZh: '球', x: 441, y: 645, radius: 65, radiusX: 65, radiusY: 65, typeZh: '球類樣式', descZh: '左圖野餐墊旁是黑白足球，右圖轉為橘黑籃球' },
      { word: 'dog', wordZh: '狗狗', x: 596, y: 492, radius: 75, radiusX: 65, radiusY: 75, typeZh: '神態配件', descZh: '左圖小狗戴紅色項圈，右圖轉為藍色項圈且俏皮眨眼' },
      { word: 'rabbit', wordZh: '兔子', x: 735, y: 485, radius: 55, radiusX: 55, radiusY: 50, typeZh: '毛色外觀', descZh: '左圖幸運草堆是純白小兔，右圖轉為灰色小兔' },
      { word: 'turtle', wordZh: '烏龜', x: 805, y: 580, radius: 55, radiusX: 55, radiusY: 50, typeZh: '甲殼花紋', descZh: '左圖池塘岩石是青綠小龜，右圖轉為金黃暖橘花紋烏龜（已下移置中於烏龜本體）' },
      { word: 'frog', wordZh: '青蛙', x: 1115, y: 605, radius: 55, radiusX: 55, radiusY: 50, typeZh: '飾品裝飾', descZh: '左圖荷葉上是普通綠青蛙，右圖頭戴閃耀金皇冠轉為青蛙王子（已下移半徑置中於荷葉青蛙）' },
      { word: 'kite', wordZh: '風箏', x: 830, y: 185, radius: 155, radiusX: 95, radiusY: 155, typeZh: '風箏圖樣', descZh: '左圖晴空是幾何條紋風箏，右圖轉為彩虹蝴蝶彩繪風箏（已全域擴大完整涵蓋風箏菱面與飄逸尾穗）' },
      { word: 'bird', wordZh: '小鳥', x: 1245, y: 395, radius: 50, radiusX: 50, radiusY: 45, typeZh: '數量品種', descZh: '左圖木柵欄上棲息2隻小鳥，右圖右側新增第3隻粉紅小鳥' }
    ],
    distractors: [
      { word: 'fish', wordZh: '小魚' },
      { word: 'bear', wordZh: '玩具熊' },
      { word: 'doll', wordZh: '洋娃娃' },
      { word: 'yo-yo', wordZh: '溜溜球' }
    ]
  },

  // ── Book 3: 微風氣象湖畔與青草野餐公園 ──
  '3': {
    varName: 'BOOK3_PARK_SCENE',
    id: 'book3_park',
    book: '3',
    grade: 4,
    titleZh: '微風氣象湖畔與青草野餐公園（四年級第 3 冊）',
    titleEn: 'Breeze Lake & Sunny Picnic Park (Book 3)',
    descZh: '在風和日麗的野餐公園中，找出 8 處相異物品！點選後在單字庫配對正確單字！',
    baseImage: '/assets/spotter/book3_base.jpg',
    diffImage: '/assets/spotter/book3_diff.jpg',
    width: 1376,
    height: 768,
    items: [
      { word: 'umbrella', wordZh: '遮陽傘', x: 140, y: 428, radius: 140, radiusX: 140, radiusY: 86, typeZh: '傘面花色', descZh: '左圖草地是紅白條紋遮陽傘，右圖轉為藍白海洋條紋傘' },
      { word: 'kite', wordZh: '風箏', x: 372, y: 124, radius: 130, radiusX: 130, radiusY: 120, typeZh: '風箏圖樣', descZh: '左圖晴空是幾何條紋風箏，右圖轉為菱形純色彩繪風箏' },
      { word: 'hamburger', wordZh: '漢堡', x: 472, y: 456, radius: 66, radiusX: 66, radiusY: 50, typeZh: '夾心配料', descZh: '左圖長椅上是起司牛肉堡，右圖轉為脆皮炸雞雙層堡' },
      { word: 'hot dog', wordZh: '熱狗', x: 784, y: 332, radius: 74, radiusX: 74, radiusY: 62, typeZh: '醬料樣態', descZh: '左圖木棧道熱狗淋滿黃芥末醬，右圖淋滿番茄紅醬' },
      { word: 'sun', wordZh: '太陽與雲朵', x: 750, y: 100, radius: 140, radiusX: 140, radiusY: 80, typeZh: '氣象雲采', descZh: '左圖晴空上有太陽與微笑白雲，右圖白雲消散轉為燦爛多芒晨曦（全域涵蓋太陽與雲朵）' },
      { word: 'pizza', wordZh: '披薩', x: 716, y: 556, radius: 86, radiusX: 86, radiusY: 54, typeZh: '披薩配料', descZh: '左圖石台上是經典臘腸披薩，右圖轉為夏威夷鳳梨披薩' },
      { word: 'ice cream', wordZh: '冰淇淋', x: 996, y: 388, radius: 62, radiusX: 62, radiusY: 54, typeZh: '甜筒口味', descZh: '左圖花叢邊是粉紅草莓冰淇淋，右圖轉為香濃巧克力甜筒' },
      { word: 'juice', wordZh: '果汁', x: 1132, y: 640, radius: 86, radiusX: 86, radiusY: 66, typeZh: '果汁色澤', descZh: '左圖野餐墊是金黃柳橙果汁，右圖轉為翠綠奇異果汁' }
    ],
    distractors: [
      { word: 'cloud', wordZh: '雲朵' },
      { word: 'bird', wordZh: '小鳥' },
      { word: 'lake', wordZh: '湖泊' },
      { word: 'grass', wordZh: '草地' }
    ]
  },

  // ── Book 4: 英倫時鐘小鎮與透視溫馨家居 ──
  '4': {
    varName: 'BOOK4_LONDON_SCENE',
    id: 'book4_london',
    book: '4',
    grade: 4,
    titleZh: '英倫時鐘小鎮與透視溫馨家居（四年級第 4 冊）',
    titleEn: 'London Street & Cozy Home (Book 4)',
    descZh: '在精緻的英倫街景與立體剖面小屋中，找出 8 處相異物品！',
    baseImage: '/assets/spotter/book4_base.jpg',
    diffImage: '/assets/spotter/book4_diff.jpg',
    width: 1376,
    height: 768,
    items: [
      { word: 'bus', wordZh: '公車', x: 848, y: 235, radius: 115, radiusX: 115, radiusY: 75, typeZh: '公車外觀', descZh: '街道中央行駛經典英倫紅雙層巴士，右圖車身轉為皇家藍配色（全域包覆整輛雙層巴士）' },
      { word: 'bed', wordZh: '床鋪', x: 415, y: 170, radius: 75, radiusX: 75, radiusY: 65, typeZh: '床單花紋', descZh: '二樓臥室單人床是暖黃格紋被套，右圖轉為深藍星空被套（中心精準置中於床鋪中央）' },
      { word: 'hat', wordZh: '帽子', x: 405, y: 300, radius: 65, radiusX: 65, radiusY: 55, typeZh: '帽款色彩', descZh: '二樓衣帽架上掛著黑色圓頂禮帽，右圖轉為黃色緞帶草帽（中心對齊衣帽架）' },
      { word: 'computer', wordZh: '電腦', x: 300, y: 455, radius: 60, radiusX: 60, radiusY: 50, typeZh: '螢幕顯示', descZh: '一樓書桌筆記型電腦螢幕發光，右圖轉為亮粉色外殼（精確對齊書桌筆電）' },
      { word: 'bag', wordZh: '背包', x: 295, y: 565, radius: 65, radiusX: 65, radiusY: 60, typeZh: '提包樣態', descZh: '一樓玄關地毯旁是紅藍學生雙肩書包，右圖轉為草綠色休閒背包（精確對齊玄關背包）' },
      { word: 'book', wordZh: '書本', x: 605, y: 595, radius: 95, radiusX: 95, radiusY: 65, typeZh: '書本封皮', descZh: '客廳茶几上翻開的花草繪本，右圖轉為厚重精裝書（精確對齊茶几書本）' },
      { word: 'sofa', wordZh: '沙發', x: 1095, y: 618, radius: 95, radiusX: 95, radiusY: 85, typeZh: '沙發布料', descZh: '客廳主沙發是溫馨米色布面，右圖轉為墨綠復古絨布沙發（精確對齊客廳沙發）' },
      { word: 'clock', wordZh: '時鐘', x: 1195, y: 170, radius: 55, radiusX: 55, radiusY: 55, typeZh: '鐘樓時鐘', descZh: '右上方鐘樓大笨鐘面指標為整點，右圖指針與鐘面色彩轉變（精確對齊鐘樓時鐘）' }
    ],
    distractors: [
      { word: 'lamp', wordZh: '檯燈' },
      { word: 'table', wordZh: '桌子' },
      { word: 'chair', wordZh: '椅子' },
      { word: 'window', wordZh: '窗戶' }
    ]
  },

  // ── Book 5: 巴黎羅浮宮藝文廣場 ──
  '5': {
    varName: 'BOOK5_PARIS_SCENE',
    id: 'book5_paris',
    book: '5',
    grade: 5,
    titleZh: '巴黎羅浮宮藝文廣場（五年級第 5 冊）',
    titleEn: 'Paris Louvre Art Plaza (Book 5)',
    descZh: '在充滿藝術氣息的羅浮宮前廣場，找出 8 處相異物品！',
    baseImage: '/assets/spotter/book5_base.jpg',
    diffImage: '/assets/spotter/book5_diff.jpg',
    width: 1376,
    height: 768,
    items: [
      { word: 'koala', wordZh: '無尾熊', x: 185, y: 195, radius: 70, radiusX: 65, radiusY: 70, typeZh: '無尾熊樣態', descZh: '左側大樹幹趴著灰毛無尾熊，右圖耳朵戴著金黃花朵（全域包覆整隻無尾熊身軀與耳爪）' },
      { word: 'lion', wordZh: '守護石獅', x: 115, y: 158, radius: 60, radiusX: 60, radiusY: 60, typeZh: '雕像姿態', descZh: '宮殿左側台階旁是端坐石獅，右圖轉為暗銅色且頭戴金桂冠（精確置中於石獅雕像）' },
      { word: 'milk', wordZh: '牛奶', x: 530, y: 275, radius: 80, radiusX: 75, radiusY: 90, typeZh: '瓶身圖樣', descZh: '中央矮石牆上是透明玻璃牛奶瓶，右圖轉為粉紅草莓鮮奶瓶（精確置中於鮮奶瓶）' },
      { word: 'bread', wordZh: '麵包', x: 415, y: 545, radius: 105, radiusX: 105, radiusY: 90, typeZh: '麵包種類', descZh: '休閒長椅上紙袋裝滿法國金黃長棍麵包，右圖籃中轉為牛角可頌麵包（精確置中於長椅麵包籃）' },
      { word: 'football', wordZh: '足球', x: 755, y: 580, radius: 75, radiusX: 75, radiusY: 75, typeZh: '足球圖樣', descZh: '廣場石板上是經典黑白足球，右圖轉為紅金獎盃足球（精確置中於地面足球）' },
      { word: 'painting', wordZh: '畫作', x: 1025, y: 395, radius: 70, radiusX: 70, radiusY: 65, typeZh: '油畫畫面', descZh: '畫架上是蒙娜麗莎神秘微笑，右圖蒙娜麗莎俏皮戴上黑色墨鏡（精確置中於畫架畫布）' },
      { word: 'cake', wordZh: '蛋糕', x: 1140, y: 610, radius: 75, radiusX: 75, radiusY: 75, typeZh: '點心甜點', descZh: '圓木几上是白奶油草莓切片蛋糕，右圖轉為黑森林櫻桃巧克力蛋糕（精確置中於木几蛋糕）' },
      { word: 'camera', wordZh: '相機', x: 1265, y: 490, radius: 85, radiusX: 85, radiusY: 85, typeZh: '相機款式', descZh: '右側路燈柱上懸掛著黑色單眼相機，右圖轉為青藍雙色拍立得相機（精確置中於路燈相機）' }
    ],
    distractors: [
      { word: 'museum', wordZh: '博物館' },
      { word: 'statue', wordZh: '雕像' },
      { word: 'pyramid', wordZh: '金字塔' },
      { word: 'river', wordZh: '河流' }
    ]
  },

  // ── Book 6: 世界自然歷史與星際探索博物館 (完全零食物，替換為 cap 棒球帽與 umbrella 雨傘) ──
  '6': {
    varName: 'BOOK6_MUSEUM_SCENE',
    id: 'book6_museum',
    book: '6',
    grade: 5,
    titleZh: '世界自然歷史與星際探索博物館（五年級第 6 冊）',
    titleEn: 'World Science & Space Museum (Book 6)',
    descZh: '在壯麗的星際與自然歷史博物館中，找出 8 處相異展品與訪客物件！（已完全移除食物，符合展館規範）',
    baseImage: '/assets/spotter/book6_base.jpg',
    diffImage: '/assets/spotter/book6_diff.jpg',
    width: 1376,
    height: 768,
    items: [
      { word: 'mask', wordZh: '口罩', x: 104, y: 422, radius: 55, radiusX: 55, radiusY: 45, typeZh: '圖樣樣式', descZh: '左側防疫宣導台層架放著淺藍醫用口罩，右圖轉為鮮黃笑臉口罩' },
      { word: 'rocket', wordZh: '火箭', x: 400, y: 188, radius: 110, radiusX: 110, radiusY: 75, typeZh: '航天機型', descZh: '挑高穹頂吊掛經典紅白火箭，右圖轉為藍銀太空穿梭機' },
      { word: 'elephant', wordZh: '大象', x: 275, y: 295, radius: 50, radiusX: 50, radiusY: 50, typeZh: '裝飾樣式', descZh: '野生非洲實景展廳模型非洲象，右圖身披彩色刺繡節慶鞍毯（精確置中於非洲展區大象）' },
      { word: 'cap', wordZh: '棒球帽', x: 480, y: 466, radius: 65, radiusX: 65, radiusY: 55, typeZh: '訪客帽款', descZh: '中左獨立圓几上訪客遺落之寶藍色隊帽，右圖轉為亮紅星徽太空帽（替換原食物碗）' },
      { word: 'sunglasses', wordZh: '墨鏡', x: 680, y: 381, radius: 75, radiusX: 75, radiusY: 50, typeZh: '墨鏡造型', descZh: '中央前景聚光絲絨展台上是純黑飛行員墨鏡，右圖轉為復古紅色愛心造型墨鏡' },
      { word: 'dinosaur', wordZh: '恐龍', x: 1000, y: 193, radius: 125, radiusX: 125, radiusY: 80, typeZh: '化石標本', descZh: '史前夾層展廳是霸王龍骨骼化石，右圖轉為三角龍化石標本' },
      { word: 'umbrella', wordZh: '雨傘', x: 945, y: 493, radius: 55, radiusX: 55, radiusY: 45, typeZh: '隨身傘具', descZh: '訪客木長椅邊靠著鵝黃折疊木柄傘，右圖轉為翡翠綠條紋仕女傘（替換原長椅沙拉碗）' },
      { word: 'backpack', wordZh: '背包', x: 1151, y: 597, radius: 65, radiusX: 65, radiusY: 75, typeZh: '背包配色', descZh: '紅毯圍欄立柱掛著藍橘撞色背包，右圖轉為深紫螢光綠探險背包' }
    ],
    distractors: [
      { word: 'telescope', wordZh: '望遠鏡' },
      { word: 'planet', wordZh: '行星' },
      { word: 'robot', wordZh: '機器人' },
      { word: 'fossil', wordZh: '化石' }
    ]
  },

  // ── Book 7: 世界節慶與環球港灣 ──
  '7': {
    varName: 'BOOK7_HARBOR_SCENE',
    id: 'book7_harbor',
    book: '7',
    grade: 6,
    titleZh: '世界節慶與環球港灣（六年級第 7 冊）',
    titleEn: 'Global World Harbor & Coastal Scenic Pier (Book 7)',
    descZh: '在美麗的環球海港與景觀棧道上，找出 8 處相異物品！點選後在單字庫配對正確單字！',
    baseImage: '/assets/spotter/book7_base.jpg',
    diffImage: '/assets/spotter/book7_diff.jpg',
    width: 1376,
    height: 768,
    items: [
      { word: 'airplane', wordZh: '飛機', x: 336, y: 108, radius: 145, radiusX: 145, radiusY: 48, typeZh: '機型樣式', descZh: '左圖高空是經典白藍客機，右圖轉為金橘色超音速噴射機' },
      { word: 'flag', wordZh: '國旗', x: 1140, y: 64, radius: 52, radiusX: 52, radiusY: 42, typeZh: '旗幟樣式', descZh: '左圖燈塔頂端是紅白藍國家旗幟，右圖轉為金黃海軍藍燕尾信號旗' },
      { word: 'train', wordZh: '火車', x: 792, y: 260, radius: 175, radiusX: 175, radiusY: 45, typeZh: '列車型式', descZh: '左圖石拱橋上是復古蒸氣火車，右圖轉為流線型銀紅高速列車' },
      { word: 'ship', wordZh: '輪船', x: 440, y: 390, radius: 140, radiusX: 140, radiusY: 105, typeZh: '船隻種類', descZh: '左圖港灣中是純白豪華遊輪，右圖轉為雙桅木造復古風帆帆船' },
      { word: 'postcard', wordZh: '明信片', x: 172, y: 548, radius: 88, radiusX: 88, radiusY: 52, typeZh: '明信片圖樣', descZh: '左圖郵筒旁是燈塔海景明信片，右圖轉為熱帶海灘愛心郵戳明信片' },
      { word: 'map', wordZh: '地圖', x: 635, y: 615, radius: 150, radiusX: 150, radiusY: 125, typeZh: '地圖形式', descZh: '觀景台欄杆上平鋪彩色世界地圖，右圖轉為復古藏寶圖（已全域擴大完整包覆整張世界地圖）' },
      { word: 'suitcase', wordZh: '行李箱', x: 945, y: 580, radius: 95, radiusX: 95, radiusY: 90, typeZh: '箱體造型', descZh: '長椅旁立著棕色復古皮箱，右圖轉為亮綠藍色硬殼四輪行李箱（已縮小半徑並緊湊置中於行李箱核心，與地圖完全獨立零重疊）' },
      { word: 'gift', wordZh: '禮物', x: 1272, y: 532, radius: 75, radiusX: 75, radiusY: 72, typeZh: '包裝緞帶', descZh: '左圖售票亭是深藍金緞帶禮盒，右圖轉為緋紅翠綠緞帶禮盒' }
    ],
    distractors: [
      { word: 'passport', wordZh: '護照' },
      { word: 'ticket', wordZh: '車票' },
      { word: 'taxi', wordZh: '計程車' },
      { word: 'hotel', wordZh: '旅館' }
    ]
  },

  // ── Book 8: 四季時光庭園與畢業留影 ──
  '8': {
    varName: 'BOOK8_GARDEN_SCENE',
    id: 'book8_garden',
    book: '8',
    grade: 6,
    titleZh: '四季時光庭園與畢業留影（六年級第 8 冊）',
    titleEn: 'Four Seasons Memory Garden (Book 8)',
    descZh: '在繁花盛開的四季庭園中，找出 8 處相異物品！點選後在單字庫配對正確單字！',
    baseImage: '/assets/spotter/book8_base.jpg',
    diffImage: '/assets/spotter/book8_diff.jpg',
    width: 1376,
    height: 768,
    items: [
      { word: 'swan', wordZh: '天鵝', x: 290, y: 495, radius: 85, radiusX: 85, radiusY: 80, typeZh: '羽色品種', descZh: '左側池塘中優雅純白白天鵝，右圖轉為紅喙純黑黑天鵝（中心精確置中於天鵝本體，包覆頭頸與全軀）' },
      { word: 'spade', wordZh: '鏟子', x: 205, y: 595, radius: 130, radiusX: 55, radiusY: 130, typeZh: '工具配色', descZh: '左側花圃泥土插著銀柄鏟子，右圖轉為金黃園藝鏟（精確校準至花圃手柄至入土鏟刃核心）' },
      { word: 'drum', wordZh: '鼓', x: 288, y: 272, radius: 66, radiusX: 66, radiusY: 50, typeZh: '樂器外觀', descZh: '左圖涼亭舞台是紅金行進鼓，右圖轉為皇家深藍小鼓' },
      { word: 'pie', wordZh: '派', x: 704, y: 528, radius: 98, radiusX: 98, radiusY: 48, typeZh: '點心風味', descZh: '左圖石台茶几上是酥皮水果派，右圖轉為深紫黑莓派' },
      { word: 'rose', wordZh: '玫瑰', x: 700, y: 272, radius: 70, radiusX: 70, radiusY: 66, typeZh: '花卉色彩', descZh: '左圖拱門是鮮紅玫瑰花叢，右圖轉為金黃玫瑰花叢' },
      { word: 'coat', wordZh: '大衣', x: 957, y: 310, radius: 95, radiusX: 75, radiusY: 95, typeZh: '服飾樣式', descZh: '左圖長椅上是海軍藍風衣，右圖轉為暖駝色牛角扣大衣（完整包覆領口與肩線）' },
      { word: 'flute', wordZh: '長笛', x: 998, y: 505, radius: 105, radiusX: 105, radiusY: 35, typeZh: '樂器光澤', descZh: '左圖樂譜架上是銀白長笛，右圖轉為玫瑰金長笛' },
      { word: 'dress', wordZh: '洋裝', x: 1256, y: 390, radius: 110, radiusX: 105, radiusY: 110, typeZh: '禮服色彩', descZh: '右側人台上是淡紫碎花洋裝，右圖轉為祖母綠綢緞晚宴洋裝' }
    ],
    distractors: [
      { word: 'violin', wordZh: '小提琴' },
      { word: 'piano', wordZh: '鋼琴' },
      { word: 'tree', wordZh: '大樹' },
      { word: 'bench', wordZh: '長椅' }
    ]
  }
};

async function generateAllCropsAndOverlays() {
  const colors = ['#f43f5e', '#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#eab308', '#14b8a6', '#ec4899'];

  for (const b of ['2', '3', '4', '5', '6', '7', '8']) {
    const config = FINAL_CALIBRATED_SCENES[b];
    const baseFile = path.join(publicDir, `book${b}_base.jpg`);
    const diffFile = path.join(publicDir, `book${b}_diff.jpg`);

    const cropsDir = path.join(publicDir, 'crops', `b${b}_s1`);
    if (!fs.existsSync(cropsDir)) {
      fs.mkdirSync(cropsDir, { recursive: true });
    }

    const meta = await sharp(baseFile).metadata();
    const w = meta.width;
    const h = meta.height;

    console.log(`Generating crops and overlay for Book ${b} (${w}x${h})...`);

    // 1. Generate 650x276 comparison crops for each item
    for (const item of config.items) {
      const rx = item.radiusX || item.radius;
      const ry = item.radiusY || item.radius;

      // Card dimensions
      const halfW = 320;
      const cardH = 276;
      const dividerW = 10;
      const totalCardW = halfW * 2 + dividerW; // 650

      const boxW = Math.max(180, Math.round(rx * 2.3));
      const boxH = Math.max(155, Math.round(boxW * (276 / 320)));

      const cropLeft = Math.max(0, Math.min(w - boxW, Math.round(item.x - boxW / 2)));
      const cropTop = Math.max(0, Math.min(h - boxH, Math.round(item.y - boxH / 2)));
      const actualW = Math.min(w - cropLeft, boxW);
      const actualH = Math.min(h - cropTop, boxH);

      const leftCrop = await sharp(baseFile)
        .extract({ left: cropLeft, top: cropTop, width: actualW, height: actualH })
        .resize(halfW, cardH, { fit: 'cover' })
        .toBuffer();

      const rightCrop = await sharp(diffFile)
        .extract({ left: cropLeft, top: cropTop, width: actualW, height: actualH })
        .resize(halfW, cardH, { fit: 'cover' })
        .toBuffer();

      const badgeSvgLeft = Buffer.from(`
        <svg width="${halfW}" height="${cardH}">
          <rect x="8" y="8" width="58" height="20" rx="4" fill="rgba(15,23,42,0.85)" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="37" y="22" fill="#38bdf8" font-size="10" font-weight="900" font-family="sans-serif" text-anchor="middle">BASE</text>
        </svg>
      `);

      const badgeSvgRight = Buffer.from(`
        <svg width="${halfW}" height="${cardH}">
          <rect x="8" y="8" width="62" height="20" rx="4" fill="rgba(15,23,42,0.85)" stroke="#10b981" stroke-width="1.5"/>
          <text x="39" y="22" fill="#10b981" font-size="10" font-weight="900" font-family="sans-serif" text-anchor="middle">VAR A</text>
        </svg>
      `);

      const leftWithBadge = await sharp(leftCrop).composite([{ input: badgeSvgLeft }]).toBuffer();
      const rightWithBadge = await sharp(rightCrop).composite([{ input: badgeSvgRight }]).toBuffer();

      const dividerCardSvg = Buffer.from(`
        <svg width="${dividerW}" height="${cardH}">
          <rect width="${dividerW}" height="${cardH}" fill="#0f172a"/>
          <line x1="${dividerW/2}" y1="0" x2="${dividerW/2}" y2="${cardH}" stroke="#334155" stroke-width="2"/>
        </svg>
      `);

      const safeWord = item.word.replace(/\s+/g, '_');
      const cropOutPath = path.join(cropsDir, `${safeWord}_compare.jpg`);

      await sharp({
        create: { width: totalCardW, height: cardH, channels: 3, background: '#0f172a' }
      }).composite([
        { input: leftWithBadge, left: 0, top: 0 },
        { input: dividerCardSvg, left: halfW, top: 0 },
        { input: rightWithBadge, left: halfW + dividerW, top: 0 }
      ]).jpeg({ quality: 90 }).toFile(cropOutPath);

      item.cropCompare = `/assets/spotter/crops/b${b}_s1/${safeWord}_compare.jpg`;
    }

    // 2. Generate side-by-side verification overlay image
    let svgElements = '';
    config.items.forEach((item, idx) => {
      const color = colors[idx % colors.length];
      const rx = item.radiusX || item.radius;
      const ry = item.radiusY || item.radius;
      const labelY = Math.max(22, item.y - ry - 10);
      const rectY = Math.max(8, item.y - ry - 24);

      svgElements += `
        <ellipse cx="${item.x}" cy="${item.y}" rx="${rx}" ry="${ry}" fill="${color}25" stroke="${color}" stroke-width="3.5" stroke-dasharray="8 4" />
        <circle cx="${item.x}" cy="${item.y}" r="5" fill="${color}" stroke="#ffffff" stroke-width="2" />
        <rect x="${item.x - 70}" y="${rectY}" width="140" height="22" rx="5" fill="rgba(15, 23, 42, 0.9)" stroke="${color}" stroke-width="1.5" />
        <text x="${item.x}" y="${labelY}" fill="#ffffff" font-size="12" font-weight="bold" font-family="sans-serif" text-anchor="middle">${item.word} (${item.wordZh})</text>
      `;
    });

    const overlaySvg = Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${svgElements}</svg>`);

    const leftWithBoxes = await sharp(baseFile).composite([{ input: overlaySvg }]).toBuffer();
    const rightWithBoxes = await sharp(diffFile).composite([{ input: overlaySvg }]).toBuffer();

    const dividerW = 14;
    const totalW = w * 2 + dividerW;
    const dividerSvg = Buffer.from(`<svg width="${dividerW}" height="${h}"><rect width="${dividerW}" height="${h}" fill="#020617"/></svg>`);

    const sideBySidePath = path.join(publicDir, `book${b}_side_by_side_boxes.jpg`);
    await sharp({
      create: { width: totalW, height: h, channels: 3, background: '#020617' }
    }).composite([
      { input: leftWithBoxes, left: 0, top: 0 },
      { input: dividerSvg, left: w, top: 0 },
      { input: rightWithBoxes, left: w + dividerW, top: 0 }
    ]).jpeg({ quality: 90 }).toFile(sideBySidePath);

    console.log(`Saved Book ${b} side-by-side with boxes to: ${sideBySidePath}`);
  }
}

async function main() {
  await patchBook6Food();
  await generateAllCropsAndOverlays();
  console.log('\nAll assets and crops generated successfully!');
}

main().catch(console.error);
