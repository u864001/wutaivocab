// ── 《鷹眼神探 • 單字找不同》 3D 立體紙雕課室資料池與動態出題引擎 ──

export const DIFFERENCE_CATEGORIES = [
  { id: 'color', labelZh: '顏色差異', color: 'text-amber-500', icon: '🎨' },
  { id: 'presence', labelZh: '存在差異', color: 'text-emerald-500', icon: '✨' },
  { id: 'style', labelZh: '樣式造型', color: 'text-blue-500', icon: '🔍' },
  { id: 'state', labelZh: '開闔狀態', color: 'text-purple-500', icon: '📖' },
  { id: 'pattern', labelZh: '花紋紋理', color: 'text-rose-500', icon: '📍' }
];

// ── 【Book 1 三年級上學期】彩虹文具與創意課室 (Here We Go Book 1 核心單字 • 場景 1) ──
export const BOOK1_CLASSROOM_SCENE = {
  id: 'book1_classroom',
  book: '1',
  sceneNumber: 1,
  grade: 3,
  titleZh: '彩虹文具與創意課室（三年級第 1 冊 • 場景 1）',
  titleEn: 'Rainbow Stationery & Creative Classroom (Book 1 • Scene 1)',
  descZh: '在立體紙雕課室中，仔細觀察左右兩圖 8 處相異之處！點選後在單字庫配對正確單字！',
  baseImage: '/assets/spotter/book1_base.jpg',
  diffImage: '/assets/spotter/book1_diff.jpg',
  width: 1376,
  height: 768,
  status: 'ready',
  targetItems: [
    {
      word: 'bag',
      wordZh: '書包',
      x: 228,
      y: 240,
      radius: 82,
      radiusX: 70,
      radiusY: 82,
      typeZh: '顏色樣態',
      descZh: '左圖牆上是紅藍雙色雙肩書包，右圖轉為暖陽黃與翠綠雙色雙肩書包',
      cropCompare: '/assets/spotter/crops/b1_s1/bag_compare.jpg'
    },
    {
      word: 'pencil',
      wordZh: '鉛筆',
      x: 228,
      y: 592,
      radius: 105,
      radiusX: 105,
      radiusY: 65,
      typeZh: '花紋樣式',
      descZh: '左圖木桌上是黃色六角木質鉛筆，右圖轉為彩虹糖果條紋鉛筆',
      cropCompare: '/assets/spotter/crops/b1_s1/pencil_compare.jpg'
    },
    {
      word: 'eraser',
      wordZh: '橡皮擦',
      x: 304,
      y: 416,
      radius: 50,
      radiusX: 50,
      radiusY: 45,
      typeZh: '造型顏色',
      descZh: '左圖桌角是粉紅長方形橡皮擦，右圖轉為薄荷綠三角造型橡皮擦',
      cropCompare: '/assets/spotter/crops/b1_s1/eraser_compare.jpg'
    },
    {
      word: 'book',
      wordZh: '書本',
      x: 596,
      y: 240,
      radius: 100,
      radiusX: 100,
      radiusY: 75,
      typeZh: '開闔狀態',
      descZh: '左圖講台架上是翻開的彩色圖畫英語讀本，右圖轉為闔上的皇家紫精裝故事書',
      cropCompare: '/assets/spotter/crops/b1_s1/book_compare.jpg'
    },
    {
      word: 'ruler',
      wordZh: '直尺',
      x: 672,
      y: 540,
      radius: 140,
      radiusX: 140,
      radiusY: 45,
      typeZh: '材質色彩',
      descZh: '左圖手作几上是半透明金黃學生直尺，右圖轉為蔚藍天藍色直尺',
      cropCompare: '/assets/spotter/crops/b1_s1/ruler_compare.jpg'
    },
    {
      word: 'pen',
      wordZh: '原子筆',
      x: 984,
      y: 452,
      radius: 95,
      radiusX: 95,
      radiusY: 45,
      typeZh: '筆桿色彩',
      descZh: '左圖學生桌筆槽中是深海軍藍原子筆，右圖轉為鮮豔亮紅金屬光澤原子筆',
      cropCompare: '/assets/spotter/crops/b1_s1/pen_compare.jpg'
    },
    {
      word: 'pencil case',
      wordZh: '鉛筆盒',
      x: 1172,
      y: 600,
      radius: 95,
      radiusX: 95,
      radiusY: 55,
      typeZh: '布面圖樣',
      descZh: '左圖課桌上是粉彩條紋拉鍊筆袋，右圖轉為海軍藍白波卡圓點鉛筆盒',
      cropCompare: '/assets/spotter/crops/b1_s1/pencil_case_compare.jpg'
    },
    {
      word: 'marker',
      wordZh: '彩色筆',
      x: 1212,
      y: 408,
      radius: 74,
      radiusX: 74,
      radiusY: 46,
      typeZh: '筆管色彩',
      descZh: '左圖窗台邊是粗桿草綠色彩色筆，右圖轉為亮眼霓虹螢光橘彩色筆',
      cropCompare: '/assets/spotter/crops/b1_s1/marker_compare.jpg'
    }
  ],
  distractors: [
    { word: 'desk', wordZh: '書桌' },
    { word: 'chair', wordZh: '椅子' },
    { word: 'teacher', wordZh: '老師' },
    { word: 'student', wordZh: '學生' },
    { word: 'blackboard', wordZh: '黑板' }
  ]
};

// ── 【Book 1 三年級上學期】阿姆斯特丹風車運河果園集市 (核心單字 • 場景 2 • 支援動態 Slot 變異) ──
export const BOOK1_AMSTERDAM_SCENE = {
  id: 'book1_scene2',
  book: '1',
  sceneNumber: 2,
  grade: 3,
  titleZh: '荷蘭贊斯風車運河果園集市（三年級第 1 冊 • 場景 2）',
  titleEn: 'Amsterdam Windmill Canal Orchard Market (Book 1 • Scene 2)',
  descZh: '在荷蘭贊斯風車運河與果園市集中，仔細觀察左右兩圖 8 處相異之處！點選後在單字庫配對正確單字！',
  baseImage: '/assets/spotter/book1_scene2_base.jpg',
  diffImage: '/assets/spotter/book1_scene2_diff.jpg',
  width: 1376,
  height: 768,
  status: 'ready',
  isDynamicReady: true,
  patchDir: '/assets/spotter/patches/b1_s2',
  targetItems: [
    {
      word: 'grape',
      wordZh: '葡萄',
      x: 250,
      y: 190,
      radius: 155,
      radiusX: 185,
      radiusY: 125,
      typeZh: '果實色彩',
      descZh: '左圖木藤架垂掛整排深紫巨峰葡萄，右圖轉為翠綠無籽葡萄串（已擴大包覆整區葡萄架）',
      slot: { x: 50, y: 50, w: 450, h: 320, rx: 20 },
      patchFile: 'grape_variantA.png',
      cropCompare: '/assets/spotter/crops/b1_s2/grape_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '深紫巨峰葡萄', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '翠綠無籽葡萄串', tag: 'Variant A' },
        { id: 'varB', name: '變異 B (規劃)', label: '晶瑩白葡萄串', tag: 'Variant B' },
        { id: 'varC', name: '變異 C (規劃)', label: '雙倍豐收葡萄棚', tag: 'Variant C' }
      ]
    },
    {
      word: 'banana',
      wordZh: '香蕉',
      x: 160,
      y: 430,
      radius: 65,
      radiusX: 65,
      radiusY: 60,
      typeZh: '存在差異',
      descZh: '左圖藤編吊籃放有一串熟黃香蕉，右圖吊籃空無一物',
      slot: { x: 95, y: 370, w: 130, h: 140, rx: 16 },
      patchFile: 'banana_variantA.png',
      cropCompare: '/assets/spotter/crops/b1_s2/banana_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '藤籃熟黃香蕉', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '空吊籃 (無香蕉)', tag: 'Variant A' },
        { id: 'varB', name: '變異 B (規劃)', label: '青草綠未熟香蕉', tag: 'Variant B' },
        { id: 'varC', name: '變異 C (規劃)', label: '熱帶迷你芭蕉', tag: 'Variant C' }
      ]
    },
    {
      word: 'apple',
      wordZh: '蘋果',
      x: 185,
      y: 650,
      radius: 95,
      radiusX: 110,
      radiusY: 70,
      typeZh: '品種色彩',
      descZh: '左圖木箱與箱外掉落的青蘋果，右圖全數轉為鮮紅富士蘋果（已擴大包覆箱外蘋果）',
      slot: { x: 40, y: 580, w: 240, h: 170, rx: 16 },
      patchFile: 'apple_variantA.png',
      cropCompare: '/assets/spotter/crops/b1_s2/apple_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '翠綠青蘋果（含落果）', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '鮮紅富士蘋果（含落果）', tag: 'Variant A' },
        { id: 'varB', name: '變異 B (規劃)', label: '金黃香甜蘋果', tag: 'Variant B' },
        { id: 'varC', name: '變異 C (規劃)', label: '空木箱與單顆蘋果', tag: 'Variant C' }
      ]
    },
    {
      word: 'cat',
      wordZh: '貓咪',
      x: 774,
      y: 423,
      radius: 50,
      radiusX: 55,
      radiusY: 45,
      typeZh: '品種毛色',
      descZh: '左圖石橋自行車旁趴著橘白花貓，右圖替換成純黑長尾貓咪',
      slot: { x: 710, y: 380, w: 130, h: 100, rx: 14 },
      patchFile: 'cat_variantA.png',
      cropCompare: '/assets/spotter/crops/b1_s2/cat_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '趴臥橘白花貓', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '純黑長尾黑貓', tag: 'Variant A' },
        { id: 'varB', name: '變異 B (規劃)', label: '白底灰斑三花貓', tag: 'Variant B' },
        { id: 'varC', name: '變異 C (規劃)', label: '黑白紳士賓士貓', tag: 'Variant C' }
      ]
    },
    {
      word: 'dog',
      wordZh: '狗狗',
      x: 464,
      y: 602,
      radius: 90,
      radiusX: 95,
      radiusY: 85,
      typeZh: '品種樣態',
      descZh: '左圖石板路坐著金黃柴犬，右圖轉為趴臥的斑點大麥町犬（已擴大包覆柴犬與大麥町完整身軀）',
      slot: { x: 345, y: 475, w: 245, h: 235, rx: 20 },
      patchFile: 'dog_variantA.png',
      cropCompare: '/assets/spotter/crops/b1_s2/dog_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '坐姿金黃柴犬', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '趴臥斑點大麥町犬', tag: 'Variant A' },
        { id: 'varB', name: '變異 B (規劃)', label: '短腿柯基犬', tag: 'Variant B' },
        { id: 'varC', name: '變異 C (規劃)', label: '捲毛貴賓犬', tag: 'Variant C' }
      ]
    },
    {
      word: 'fish',
      wordZh: '魚兒',
      x: 712,
      y: 662,
      radius: 48,
      radiusX: 52,
      radiusY: 42,
      typeZh: '品種色彩',
      descZh: '左圖運河游動金紅錦鯉，右圖替換成青藍色小魚',
      slot: { x: 620, y: 640, w: 150, h: 90, rx: 16 },
      patchFile: 'fish_variantA.png',
      cropCompare: '/assets/spotter/crops/b1_s2/fish_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '金紅錦鯉', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '青藍紋熱帶魚', tag: 'Variant A' },
        { id: 'varB', name: '變異 B (規劃)', label: '雙尾黑金小金魚', tag: 'Variant B' },
        { id: 'varC', name: '變異 C (規劃)', label: '銀白小鮭魚', tag: 'Variant C' }
      ]
    },
    {
      word: 'elephant',
      wordZh: '大象',
      x: 1117,
      y: 573,
      radius: 55,
      radiusX: 58,
      radiusY: 52,
      typeZh: '雕塑造型',
      descZh: '左圖地面花園廣場水池為小象石雕噴泉，右圖替換為海豚石雕噴泉（已修正移至地面花園廣場）',
      slot: { x: 1040, y: 525, w: 160, h: 130, rx: 16 },
      patchFile: 'elephant_variantA.png',
      cropCompare: '/assets/spotter/crops/b1_s2/elephant_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '小象石雕噴泉', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '海豚石雕噴泉', tag: 'Variant A' },
        { id: 'varB', name: '變異 B (規劃)', label: '青蛙吐水石雕', tag: 'Variant B' },
        { id: 'varC', name: '變異 C (規劃)', label: '純水花疊流無雕像', tag: 'Variant C' }
      ]
    },
    {
      word: 'pumpkin',
      wordZh: '南瓜',
      x: 1263,
      y: 500,
      radius: 40,
      radiusX: 42,
      radiusY: 36,
      typeZh: '外觀造型',
      descZh: '左圖農舍窗台放金黃大南瓜，右圖替換為笑臉萬聖南瓜燈',
      slot: { x: 1210, y: 455, w: 110, h: 95, rx: 14 },
      patchFile: 'pumpkin_variantA.png',
      cropCompare: '/assets/spotter/crops/b1_s2/pumpkin_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '金黃自然大南瓜', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '萬聖節笑臉南瓜燈', tag: 'Variant A' },
        { id: 'varB', name: '變異 B (規劃)', label: '奶油白條紋長南瓜', tag: 'Variant B' },
        { id: 'varC', name: '變異 C (規劃)', label: '墨綠日本栗子南瓜', tag: 'Variant C' }
      ]
    }
  ],
  distractors: [
    { word: 'windmill', wordZh: '風車' },
    { word: 'canal', wordZh: '運河' },
    { word: 'bridge', wordZh: '石橋' },
    { word: 'boat', wordZh: '木船' },
    { word: 'bike', wordZh: '自行車' },
    { word: 'tree', wordZh: '樹木' },
    { word: 'flower', wordZh: '花朵' },
    { word: 'sun', wordZh: '太陽' }
  ]
};

// ── 【Book 2 三年級下學期】陽光農莊與可愛動物公園 (Here We Go Book 2) ──
export const BOOK2_PARK_SCENE = {
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
  targetItems: [
    { word: 'cat', wordZh: '貓咪', x: 153, y: 417, radius: 75, radiusX: 75, radiusY: 55, typeZh: '花色品種', descZh: '左圖長椅上是三花貓，右圖轉為橘色虎斑貓', cropCompare: '/assets/spotter/crops/b2_s1/cat_compare.jpg' },
    { word: 'ball', wordZh: '球', x: 441, y: 645, radius: 65, radiusX: 65, radiusY: 65, typeZh: '球類樣式', descZh: '左圖野餐墊旁是黑白足球，右圖轉為橘黑籃球', cropCompare: '/assets/spotter/crops/b2_s1/ball_compare.jpg' },
    { word: 'dog', wordZh: '狗狗', x: 596, y: 492, radius: 75, radiusX: 65, radiusY: 75, typeZh: '神態配件', descZh: '左圖小狗戴紅色項圈，右圖轉為藍色項圈且俏皮眨眼', cropCompare: '/assets/spotter/crops/b2_s1/dog_compare.jpg' },
    { word: 'rabbit', wordZh: '兔子', x: 735, y: 485, radius: 55, radiusX: 55, radiusY: 50, typeZh: '毛色外觀', descZh: '左圖幸運草堆是純白小兔，右圖轉為灰色小兔', cropCompare: '/assets/spotter/crops/b2_s1/rabbit_compare.jpg' },
    { word: 'turtle', wordZh: '烏龜', x: 815, y: 530, radius: 50, radiusX: 50, radiusY: 45, typeZh: '甲殼花紋', descZh: '左圖池塘岩石是青綠小龜，右圖轉為金黃暖橘花紋烏龜', cropCompare: '/assets/spotter/crops/b2_s1/turtle_compare.jpg' },
    { word: 'frog', wordZh: '青蛙', x: 1115, y: 555, radius: 55, radiusX: 55, radiusY: 50, typeZh: '飾品裝飾', descZh: '左圖荷葉上是普通綠青蛙，右圖頭戴閃耀金皇冠轉為青蛙王子', cropCompare: '/assets/spotter/crops/b2_s1/frog_compare.jpg' },
    { word: 'kite', wordZh: '風箏', x: 815, y: 115, radius: 85, radiusX: 85, radiusY: 85, typeZh: '風箏圖樣', descZh: '左圖晴空是幾何條紋菱形風箏，右圖轉為彩虹蝴蝶彩繪風箏', cropCompare: '/assets/spotter/crops/b2_s1/kite_compare.jpg' },
    { word: 'bird', wordZh: '小鳥', x: 1245, y: 395, radius: 50, radiusX: 50, radiusY: 45, typeZh: '數量品種', descZh: '左圖木柵欄上棲息2隻小鳥，右圖右側新增第3隻粉紅小鳥', cropCompare: '/assets/spotter/crops/b2_s1/bird_compare.jpg' }
  ],
  distractors: [
    { word: 'fish', wordZh: '小魚' },
    { word: 'bear', wordZh: '玩具熊' },
    { word: 'doll', wordZh: '洋娃娃' },
    { word: 'yo-yo', wordZh: '溜溜球' }
  ]
};

// ── 【Book 3 四年級上學期】微風氣象湖畔與青草野餐公園 (Here We Go Book 3) ──
export const BOOK3_PARK_SCENE = {
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
  targetItems: [
    { word: 'umbrella', wordZh: '遮陽傘', x: 140, y: 428, radius: 140, radiusX: 140, radiusY: 86, typeZh: '傘面花色', descZh: '左圖草地是紅白條紋遮陽傘，右圖轉為藍白海洋條紋傘', cropCompare: '/assets/spotter/crops/b3_s1/umbrella_compare.jpg' },
    { word: 'kite', wordZh: '風箏', x: 372, y: 124, radius: 130, radiusX: 130, radiusY: 120, typeZh: '風箏圖樣', descZh: '左圖晴空是幾何條紋風箏，右圖轉為菱形純色彩繪風箏', cropCompare: '/assets/spotter/crops/b3_s1/kite_compare.jpg' },
    { word: 'hamburger', wordZh: '漢堡', x: 472, y: 456, radius: 66, radiusX: 66, radiusY: 50, typeZh: '夾心配料', descZh: '左圖長椅上是起司牛肉堡，右圖轉為脆皮炸雞雙層堡', cropCompare: '/assets/spotter/crops/b3_s1/hamburger_compare.jpg' },
    { word: 'hot dog', wordZh: '熱狗', x: 784, y: 332, radius: 74, radiusX: 74, radiusY: 62, typeZh: '醬料樣態', descZh: '左圖木棧道熱狗淋滿黃芥末醬，右圖淋滿番茄紅醬', cropCompare: '/assets/spotter/crops/b3_s1/hot_dog_compare.jpg' },
    { word: 'sun', wordZh: '太陽', x: 690, y: 100, radius: 80, radiusX: 80, radiusY: 75, typeZh: '光芒樣式', descZh: '左圖太陽散發金黃光芒，右圖轉為燦爛多芒晨曦（已校正置中於太陽本體）', cropCompare: '/assets/spotter/crops/b3_s1/sun_compare.jpg' },
    { word: 'pizza', wordZh: '披薩', x: 716, y: 556, radius: 86, radiusX: 86, radiusY: 54, typeZh: '披薩配料', descZh: '左圖石台上是經典臘腸披薩，右圖轉為夏威夷鳳梨披薩', cropCompare: '/assets/spotter/crops/b3_s1/pizza_compare.jpg' },
    { word: 'ice cream', wordZh: '冰淇淋', x: 996, y: 388, radius: 62, radiusX: 62, radiusY: 54, typeZh: '甜筒口味', descZh: '左圖花叢邊是粉紅草莓冰淇淋，右圖轉為香濃巧克力甜筒', cropCompare: '/assets/spotter/crops/b3_s1/ice_cream_compare.jpg' },
    { word: 'juice', wordZh: '果汁', x: 1132, y: 640, radius: 86, radiusX: 86, radiusY: 66, typeZh: '果汁色澤', descZh: '左圖野餐墊是金黃柳橙果汁，右圖轉為翠綠奇異果汁', cropCompare: '/assets/spotter/crops/b3_s1/juice_compare.jpg' }
  ],
  distractors: [
    { word: 'cloud', wordZh: '雲朵' },
    { word: 'bird', wordZh: '小鳥' },
    { word: 'lake', wordZh: '湖泊' },
    { word: 'grass', wordZh: '草地' }
  ]
};

// ── 【Book 4 四年級下學期】英倫時鐘小鎮與透視溫馨家居 (Here We Go Book 4) ──
export const BOOK4_LONDON_SCENE = {
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
  targetItems: [
    { word: 'bus', wordZh: '公車', x: 210, y: 665, radius: 130, radiusX: 110, radiusY: 130, typeZh: '公車外觀', descZh: '左圖街道是經典英倫紅雙層巴士，右圖車身轉為皇家藍配色（已全域擴大包覆整輛巴士）', cropCompare: '/assets/spotter/crops/b4_s1/bus_compare.jpg' },
    { word: 'bed', wordZh: '床鋪', x: 275, y: 395, radius: 110, radiusX: 110, radiusY: 65, typeZh: '床單花紋', descZh: '左圖二樓單人床是暖黃格紋被套，右圖轉為深藍星空被套（已修正移至二樓床鋪）', cropCompare: '/assets/spotter/crops/b4_s1/bed_compare.jpg' },
    { word: 'hat', wordZh: '帽子', x: 275, y: 210, radius: 48, radiusX: 48, radiusY: 45, typeZh: '帽款色彩', descZh: '左圖二樓衣帽架上是黑圓頂禮帽，右圖轉為黃色緞帶草帽（已修正移至二樓帽架）', cropCompare: '/assets/spotter/crops/b4_s1/hat_compare.jpg' },
    { word: 'computer', wordZh: '電腦', x: 605, y: 310, radius: 55, radiusX: 55, radiusY: 45, typeZh: '螢幕顯示', descZh: '左圖二樓書桌上是筆記型電腦螢幕發光，右圖轉為亮粉色外殼（已校準對齊書桌筆電）', cropCompare: '/assets/spotter/crops/b4_s1/computer_compare.jpg' },
    { word: 'sofa', wordZh: '沙發', x: 435, y: 765, radius: 85, radiusX: 85, radiusY: 75, typeZh: '沙發布料', descZh: '左圖客廳沙發是溫馨米色布面，右圖轉為墨綠復古絨布沙發（已校準對齊客廳主沙發）', cropCompare: '/assets/spotter/crops/b4_s1/sofa_compare.jpg' },
    { word: 'book', wordZh: '書本', x: 535, y: 775, radius: 50, radiusX: 50, radiusY: 35, typeZh: '書本封皮', descZh: '左圖茶几上是翻開花草繪本，右圖轉為厚重精裝書（已校準對齊茶几書本）', cropCompare: '/assets/spotter/crops/b4_s1/book_compare.jpg' },
    { word: 'bag', wordZh: '背包', x: 792, y: 792, radius: 50, radiusX: 50, radiusY: 50, typeZh: '提包樣態', descZh: '左圖玄關地毯旁是紅藍學生雙肩書包，右圖轉為草綠色休閒背包（已校準對齊玄關背包）', cropCompare: '/assets/spotter/crops/b4_s1/bag_compare.jpg' },
    { word: 'clock', wordZh: '時鐘', x: 855, y: 210, radius: 42, radiusX: 42, radiusY: 42, typeZh: '鐘樓時鐘', descZh: '左圖遠方大笨鐘面指標為整點，右圖指針與鐘面色彩轉變', cropCompare: '/assets/spotter/crops/b4_s1/clock_compare.jpg' }
  ],
  distractors: [
    { word: 'lamp', wordZh: '檯燈' },
    { word: 'table', wordZh: '桌子' },
    { word: 'chair', wordZh: '椅子' },
    { word: 'window', wordZh: '窗戶' }
  ]
};

// ── 【Book 5 五年級上學期】巴黎羅浮宮藝文廣場（Here We Go Book 5） ──
export const BOOK5_PARIS_SCENE = {
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
  targetItems: [
    { word: 'koala', wordZh: '無尾熊', x: 88, y: 275, radius: 65, radiusX: 65, radiusY: 65, typeZh: '無尾熊樣態', descZh: '左圖左側大樹幹趴著灰毛無尾熊，右圖耳朵戴著金黃花朵（已校正移至左側樹上無尾熊）', cropCompare: '/assets/spotter/crops/b5_s1/koala_compare.jpg' },
    { word: 'lion', wordZh: '守護石獅', x: 385, y: 345, radius: 80, radiusX: 80, radiusY: 75, typeZh: '雕像姿態', descZh: '左圖宮殿台階旁是端坐石獅，右圖轉為暗銅色且頭戴金桂冠（已校正移至台階石獅）', cropCompare: '/assets/spotter/crops/b5_s1/lion_compare.jpg' },
    { word: 'milk', wordZh: '牛奶', x: 230, y: 725, radius: 60, radiusX: 45, radiusY: 60, typeZh: '瓶身圖樣', descZh: '左圖前方石牆上是透明玻璃牛奶瓶，右圖轉為粉紅草莓鮮奶瓶（已校正移至矮牆牛奶）', cropCompare: '/assets/spotter/crops/b5_s1/milk_compare.jpg' },
    { word: 'bread', wordZh: '麵包', x: 300, y: 700, radius: 65, radiusX: 65, radiusY: 50, typeZh: '麵包種類', descZh: '左圖紙袋裝有法國金黃長棍麵包，右圖籃中轉為牛角可頌麵包', cropCompare: '/assets/spotter/crops/b5_s1/bread_compare.jpg' },
    { word: 'football', wordZh: '足球', x: 550, y: 755, radius: 55, radiusX: 55, radiusY: 55, typeZh: '足球圖樣', descZh: '左圖廣場石板上是經典黑白足球，右圖轉為紅金獎盃足球', cropCompare: '/assets/spotter/crops/b5_s1/football_compare.jpg' },
    { word: 'painting', wordZh: '畫作', x: 750, y: 595, radius: 70, radiusX: 65, radiusY: 70, typeZh: '油畫畫面', descZh: '左圖畫架上是蒙娜麗莎神秘微笑，右圖蒙娜麗莎俏皮戴上黑色墨鏡', cropCompare: '/assets/spotter/crops/b5_s1/painting_compare.jpg' },
    { word: 'cake', wordZh: '蛋糕', x: 828, y: 790, radius: 50, radiusX: 50, radiusY: 45, typeZh: '點心甜點', descZh: '左圖圓木凳上是白奶油草莓切片蛋糕，右圖轉為黑森林櫻桃巧克力蛋糕（已更正為蛋糕）', cropCompare: '/assets/spotter/crops/b5_s1/cake_compare.jpg' },
    { word: 'camera', wordZh: '相機', x: 915, y: 635, radius: 65, radiusX: 65, radiusY: 55, typeZh: '相機款式', descZh: '左圖路燈柱上懸掛著黑色單眼相機，右圖轉為青藍雙色拍立得相機', cropCompare: '/assets/spotter/crops/b5_s1/camera_compare.jpg' }
  ],
  distractors: [
    { word: 'museum', wordZh: '博物館' },
    { word: 'statue', wordZh: '雕像' },
    { word: 'pyramid', wordZh: '金字塔' },
    { word: 'river', wordZh: '河流' }
  ]
};

// ── 【Book 6 五年級下學期】世界自然歷史與星際探索博物館（Here We Go Book 6） ──
export const BOOK6_MUSEUM_SCENE = {
  id: 'book6_museum',
  book: '6',
  grade: 5,
  titleZh: '世界自然歷史與星際探索博物館（五年級第 6 冊）',
  titleEn: 'World Science & Space Museum (Book 6)',
  descZh: '在壯麗的星際與自然歷史博物館中，找出 8 處相異物品！',
  baseImage: '/assets/spotter/book6_base.jpg',
  diffImage: '/assets/spotter/book6_diff.jpg',
  width: 1376,
  height: 768,
  targetItems: [
    { word: 'mask', wordZh: '口罩', x: 88, y: 550, radius: 55, radiusX: 55, radiusY: 45, typeZh: '圖樣樣式', descZh: '左圖接待台上方層架是淺藍醫用口罩，右圖轉為鮮黃笑臉口罩', cropCompare: '/assets/spotter/crops/b6_s1/mask_compare.jpg' },
    { word: 'rocket', wordZh: '火箭', x: 380, y: 220, radius: 115, radiusX: 115, radiusY: 75, typeZh: '航天機型', descZh: '左圖穹頂懸掛經典紅白火箭，右圖轉為藍銀太空穿梭機', cropCompare: '/assets/spotter/crops/b6_s1/rocket_compare.jpg' },
    { word: 'noodles', wordZh: '麵食', x: 345, y: 585, radius: 60, radiusX: 60, radiusY: 50, typeZh: '餐點品項', descZh: '左圖圓邊几上是熱氣騰騰的拉麵碗，右圖轉為番茄肉醬義大利麵', cropCompare: '/assets/spotter/crops/b6_s1/noodles_compare.jpg' },
    { word: 'elephant', wordZh: '大象', x: 500, y: 520, radius: 90, radiusX: 90, radiusY: 70, typeZh: '裝飾樣式', descZh: '左圖中央自然展區是非洲灰象，右圖身披彩色刺繡節慶鞍毯（已校正對齊中央大象）', cropCompare: '/assets/spotter/crops/b6_s1/elephant_compare.jpg' },
    { word: 'sunglasses', wordZh: '墨鏡', x: 500, y: 760, radius: 75, radiusX: 75, radiusY: 45, typeZh: '墨鏡造型', descZh: '左圖前方紅絲絨展台上是黑色飛行員墨鏡，右圖轉為紅色愛心造型墨鏡（已校正移至展台墨鏡）', cropCompare: '/assets/spotter/crops/b6_s1/sunglasses_compare.jpg' },
    { word: 'salad', wordZh: '沙拉', x: 685, y: 645, radius: 60, radiusX: 60, radiusY: 45, typeZh: '沙拉風味', descZh: '左圖休息長椅上是木碗生菜沙拉，右圖轉為繽紛水果沙拉', cropCompare: '/assets/spotter/crops/b6_s1/salad_compare.jpg' },
    { word: 'dinosaur', wordZh: '恐龍', x: 750, y: 260, radius: 125, radiusX: 125, radiusY: 85, typeZh: '化石標本', descZh: '左圖二樓夾層是霸王龍骨骼化石，右圖轉為三角龍骨骼化石', cropCompare: '/assets/spotter/crops/b6_s1/dinosaur_compare.jpg' },
    { word: 'backpack', wordZh: '背包', x: 835, y: 765, radius: 65, radiusX: 55, radiusY: 65, typeZh: '背包配色', descZh: '左圖圍欄立柱掛著藍橘撞色背包，右圖轉為紫綠雙色探險背包', cropCompare: '/assets/spotter/crops/b6_s1/backpack_compare.jpg' }
  ],
  distractors: [
    { word: 'telescope', wordZh: '望遠鏡' },
    { word: 'planet', wordZh: '行星' },
    { word: 'robot', wordZh: '機器人' },
    { word: 'fossil', wordZh: '化石' }
  ]
};

// ── 【Book 7 六年級上學期】世界節慶與環球港灣（Here We Go Book 7） ──
export const BOOK7_HARBOR_SCENE = {
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
  targetItems: [
    { word: 'airplane', wordZh: '飛機', x: 336, y: 108, radius: 145, radiusX: 145, radiusY: 48, typeZh: '機型樣式', descZh: '左圖高空是經典白藍客機，右圖轉為金橘色超音速噴射機', cropCompare: '/assets/spotter/crops/b7_s1/airplane_compare.jpg' },
    { word: 'flag', wordZh: '國旗', x: 1140, y: 64, radius: 52, radiusX: 52, radiusY: 42, typeZh: '旗幟樣式', descZh: '左圖燈塔頂端是紅白藍國家旗幟，右圖轉為金黃海軍藍燕尾信號旗', cropCompare: '/assets/spotter/crops/b7_s1/flag_compare.jpg' },
    { word: 'train', wordZh: '火車', x: 792, y: 260, radius: 175, radiusX: 175, radiusY: 45, typeZh: '列車型式', descZh: '左圖石拱橋上是復古蒸氣火車，右圖轉為流線型銀紅高速列車', cropCompare: '/assets/spotter/crops/b7_s1/train_compare.jpg' },
    { word: 'ship', wordZh: '輪船', x: 440, y: 390, radius: 140, radiusX: 140, radiusY: 105, typeZh: '船隻種類', descZh: '左圖港灣中是純白豪華遊輪，右圖轉為雙桅木造復古風帆帆船', cropCompare: '/assets/spotter/crops/b7_s1/ship_compare.jpg' },
    { word: 'postcard', wordZh: '明信片', x: 172, y: 548, radius: 88, radiusX: 88, radiusY: 52, typeZh: '明信片圖樣', descZh: '左圖郵筒旁是燈塔海景明信片，右圖轉為熱帶海灘愛心郵戳明信片', cropCompare: '/assets/spotter/crops/b7_s1/postcard_compare.jpg' },
    { word: 'map', wordZh: '地圖', x: 640, y: 630, radius: 140, radiusX: 140, radiusY: 125, typeZh: '地圖形式', descZh: '左圖欄杆上是平鋪彩色世界地圖，右圖轉為復古羊皮紙藏寶圖（已全域擴大包覆整張地圖）', cropCompare: '/assets/spotter/crops/b7_s1/map_compare.jpg' },
    { word: 'suitcase', wordZh: '行李箱', x: 925, y: 635, radius: 125, radiusX: 120, radiusY: 125, typeZh: '箱體造型', descZh: '左圖長椅旁是復古真皮皮箱，右圖轉為亮綠藍色硬殼四輪行李箱（已擴大包覆且與地圖獨立零重疊）', cropCompare: '/assets/spotter/crops/b7_s1/suitcase_compare.jpg' },
    { word: 'gift', wordZh: '禮物', x: 1272, y: 532, radius: 75, radiusX: 75, radiusY: 72, typeZh: '包裝緞帶', descZh: '左圖售票亭是深藍金緞帶禮盒，右圖轉為緋紅翠綠緞帶禮盒', cropCompare: '/assets/spotter/crops/b7_s1/gift_compare.jpg' }
  ],
  distractors: [
    { word: 'passport', wordZh: '護照' },
    { word: 'ticket', wordZh: '車票' },
    { word: 'taxi', wordZh: '計程車' },
    { word: 'hotel', wordZh: '旅館' }
  ]
};

// ── 【Book 8 六年級下學期】四季時光庭園與畢業留影（Here We Go Book 8） ──
export const BOOK8_GARDEN_SCENE = {
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
  targetItems: [
    { word: 'swan', wordZh: '天鵝', x: 250, y: 580, radius: 95, radiusX: 95, radiusY: 90, typeZh: '羽色品種', descZh: '左圖池中是優雅純白白天鵝，右圖轉為紅喙純黑天鵝（已擴大包覆天鵝頭頸、羽翼與尾部）', cropCompare: '/assets/spotter/crops/b8_s1/swan_compare.jpg' },
    { word: 'spade', wordZh: '鏟子', x: 145, y: 610, radius: 160, radiusX: 65, radiusY: 160, typeZh: '工具配色', descZh: '左圖花圃泥土插著銀柄鏟子，右圖轉為金黃園藝鏟（已往右上移，完整涵蓋頂端手柄至入土鏟刃）', cropCompare: '/assets/spotter/crops/b8_s1/spade_compare.jpg' },
    { word: 'drum', wordZh: '鼓', x: 288, y: 272, radius: 66, radiusX: 66, radiusY: 50, typeZh: '樂器外觀', descZh: '左圖涼亭舞台是紅金行進鼓，右圖轉為皇家深藍小鼓', cropCompare: '/assets/spotter/crops/b8_s1/drum_compare.jpg' },
    { word: 'pie', wordZh: '派', x: 704, y: 528, radius: 98, radiusX: 98, radiusY: 48, typeZh: '點心風味', descZh: '左圖石台茶几上是酥皮水果派，右圖轉為深紫黑莓派', cropCompare: '/assets/spotter/crops/b8_s1/pie_compare.jpg' },
    { word: 'rose', wordZh: '玫瑰', x: 700, y: 272, radius: 70, radiusX: 70, radiusY: 66, typeZh: '花卉色彩', descZh: '左圖拱門是鮮紅玫瑰花叢，右圖轉為金黃玫瑰花叢', cropCompare: '/assets/spotter/crops/b8_s1/rose_compare.jpg' },
    { word: 'coat', wordZh: '大衣', x: 952, y: 310, radius: 105, radiusX: 80, radiusY: 105, typeZh: '服飾樣式', descZh: '左圖長椅上是海軍藍風衣，右圖轉為暖駝色牛角扣大衣（已往上延伸完整包覆大衣領口）', cropCompare: '/assets/spotter/crops/b8_s1/coat_compare.jpg' },
    { word: 'flute', wordZh: '長笛', x: 980, y: 515, radius: 115, radiusX: 115, radiusY: 35, typeZh: '樂器光澤', descZh: '左圖樂譜架上是銀白長笛，右圖轉為玫瑰金長笛', cropCompare: '/assets/spotter/crops/b8_s1/flute_compare.jpg' },
    { word: 'dress', wordZh: '洋裝', x: 1256, y: 356, radius: 130, radiusX: 106, radiusY: 130, typeZh: '禮服色彩', descZh: '左圖人台上是淡紫碎花洋裝，右圖轉為祖母綠綢緞晚宴洋裝', cropCompare: '/assets/spotter/crops/b8_s1/dress_compare.jpg' }
  ],
  distractors: [
    { word: 'violin', wordZh: '小提琴' },
    { word: 'piano', wordZh: '鋼琴' },
    { word: 'tree', wordZh: '大樹' },
    { word: 'bench', wordZh: '長椅' }
  ]
};

// ── 【Book 2 場景 2 規劃中】日本京都花見小路與職人小鎮 ──
export const BOOK2_KYOTO_SCENE_ROADMAP = {
  id: 'book2_scene2',
  book: '2',
  sceneNumber: 2,
  grade: 3,
  titleZh: '日本京都花見小路與職人小鎮（三年級第 2 冊 • 場景 2）',
  titleEn: 'Kyoto Hanamikoji Artisan Town (Book 2 • Scene 2)',
  descZh: '在古色古香的京都木造町家與石疊小路中，尋找工藝禮品與茶屋相異之處！',
  baseImage: '/assets/spotter/book2_base.jpg',
  diffImage: '/assets/spotter/book2_diff.jpg',
  width: 1376,
  height: 768,
  status: 'roadmap',
  targetItems: [
    { word: 'cup', wordZh: '茶杯', x: 260, y: 520, radiusX: 55, radiusY: 50, typeZh: '茶具樣式', descZh: '白瓷茶杯 ➔ 抹茶陶杯' },
    { word: 'key', wordZh: '鑰匙', x: 420, y: 390, radiusX: 45, radiusY: 45, typeZh: '材質造型', descZh: '黃銅古鑰 ➔ 銀雕鑰匙' },
    { word: 'fan', wordZh: '摺扇', x: 580, y: 280, radiusX: 65, radiusY: 55, typeZh: '扇面繪紋', descZh: '櫻花金箔摺扇 ➔ 富士山青藍扇' },
    { word: 'box', wordZh: '盒子', x: 740, y: 560, radiusX: 70, radiusY: 60, typeZh: '漆器外盒', descZh: '黑漆描金點心盒 ➔ 朱紅木盒' },
    { word: 'bird', wordZh: '小鳥', x: 890, y: 190, radiusX: 50, radiusY: 45, typeZh: '鳥羽品種', descZh: '枝頭青雀 ➔ 櫻樹白頭翁' },
    { word: 'tea', wordZh: '茶葉', x: 980, y: 480, radiusX: 60, radiusY: 55, typeZh: '茶罐色彩', descZh: '玉露茶罐 ➔ 焙茶金罐' },
    { word: 'umbrella', wordZh: '油紙傘', x: 1140, y: 340, radiusX: 85, radiusY: 75, typeZh: '傘面圖案', descZh: '緋紅蛇目傘 ➔ 紫羅蘭和傘' },
    { word: 'doll', wordZh: '木芥子人偶', x: 1220, y: 580, radiusX: 55, radiusY: 65, typeZh: '人偶彩繪', descZh: '圓頭小芥子 ➔ 傳統鳴子芥子' }
  ],
  distractors: [{ word: 'house', wordZh: '房子' }, { word: 'tree', wordZh: '樹木' }, { word: 'path', wordZh: '小徑' }]
};

// ── 依冊次索引 (覆蓋 1 到 8 冊全系列教材，支援多場景切換) ──
export const ALL_SCENES_BY_BOOK = {
  '1': [BOOK1_CLASSROOM_SCENE, BOOK1_AMSTERDAM_SCENE],
  '2': [BOOK2_PARK_SCENE, BOOK2_KYOTO_SCENE_ROADMAP],
  '3': [BOOK3_PARK_SCENE],
  '4': [BOOK4_LONDON_SCENE],
  '5': [BOOK5_PARIS_SCENE],
  '6': [BOOK6_MUSEUM_SCENE],
  '7': [BOOK7_HARBOR_SCENE],
  '8': [BOOK8_GARDEN_SCENE]
};

// 取得該冊次所有場景
export const getScenesForBook = (bookId) => {
  return ALL_SCENES_BY_BOOK[String(bookId)] || [BOOK1_CLASSROOM_SCENE];
};

// 依冊次索引 (向後相容預設第一場景)
export const SPOTTER_SCENES_BY_BOOK = {
  '1': BOOK1_CLASSROOM_SCENE,
  '2': BOOK2_PARK_SCENE,
  '3': BOOK3_PARK_SCENE,
  '4': BOOK4_LONDON_SCENE,
  '5': BOOK5_PARIS_SCENE,
  '6': BOOK6_MUSEUM_SCENE,
  '7': BOOK7_HARBOR_SCENE,
  '8': BOOK8_GARDEN_SCENE
};

// 全域場景清單（依冊次與場景編號完整排序）
export const SPOTTER_SCENES = [
  BOOK1_CLASSROOM_SCENE,
  BOOK1_AMSTERDAM_SCENE,
  BOOK2_PARK_SCENE,
  BOOK3_PARK_SCENE,
  BOOK4_LONDON_SCENE,
  BOOK5_PARIS_SCENE,
  BOOK6_MUSEUM_SCENE,
  BOOK7_HARBOR_SCENE,
  BOOK8_GARDEN_SCENE
];

// 向後相容別名
export const BOOK2_PARTY_SCENE = BOOK2_PARK_SCENE;

// 向下相容匯出
export const TARGET_ITEMS_POOL = BOOK1_CLASSROOM_SCENE.targetItems;

// ── 動態出題產生器 (每次進關全量開放該圖所有相異點，絕無幽靈差異誤扣心) ──
export const generateSpotterRound = (scene = BOOK1_CLASSROOM_SCENE, targetCount = null) => {
  const activeScene = scene || BOOK1_CLASSROOM_SCENE;
  const items = activeScene.targetItems || BOOK1_CLASSROOM_SCENE.targetItems;

  const shuffle = (arr) => {
    const list = [...arr];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  };

  // 100% 啟用該紙雕圖上的所有相異目標，保證「畫面上看到的相異處 = 本題有效目標」，絕不留幽靈差異誤扣心！
  const chosenTargets = items;
  const unchosenTargets = [];

  const activeDifferences = chosenTargets.map(item => ({
    id: `diff-${item.word}`,
    word: item.word,
    wordZh: item.wordZh,
    x: item.x,
    y: item.y,
    radius: item.radius || 55,
    radiusX: item.radiusX || item.radius || 55,
    radiusY: item.radiusY || item.radius || 55,
    typeZh: item.typeZh || '樣態差異',
    descZh: item.descZh || ''
  }));

  // 2. 狀態字典
  const itemStateMap = {};
  items.forEach(item => {
    const active = activeDifferences.find(d => d.word === item.word);
    itemStateMap[item.word] = active ? 'active' : 'default';
  });

  // 3. 組裝 Word Bank 選項：正解目標 + 現場常見誘答單字
  const targetWordsSet = new Set(chosenTargets.map(c => c.word));
  const availableDistractors = [
    ...(activeScene.distractors || []),
    ...unchosenTargets.map(t => ({ word: t.word, wordZh: t.wordZh }))
  ].filter(d => !targetWordsSet.has(d.word));

  const uniqueDistractors = [];
  const seen = new Set();
  for (const d of availableDistractors) {
    if (!seen.has(d.word)) {
      seen.add(d.word);
      uniqueDistractors.push(d);
    }
  }

  const chosenDistractors = shuffle(uniqueDistractors).slice(0, 3);
  const rawOptions = [
    ...chosenTargets.map(t => ({ word: t.word, wordZh: t.wordZh })),
    ...chosenDistractors
  ];
  // 依字母排序讓學生好找
  const wordBankOptions = rawOptions.sort((a, b) => a.word.localeCompare(b.word));

  return {
    activeDifferences,
    itemStateMap,
    wordBankOptions,
    totalCount: chosenTargets.length
  };
};
