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
  isDynamicSlot: true,
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
    { word: 'turtle', wordZh: '烏龜', x: 805, y: 580, radius: 55, radiusX: 55, radiusY: 50, typeZh: '甲殼花紋', descZh: '左圖池塘岩石是青綠小龜，右圖轉為金黃暖橘花紋烏龜（已下移置中於烏龜本體）', cropCompare: '/assets/spotter/crops/b2_s1/turtle_compare.jpg' },
    { word: 'frog', wordZh: '青蛙', x: 1115, y: 605, radius: 55, radiusX: 55, radiusY: 50, typeZh: '飾品裝飾', descZh: '左圖荷葉上是普通綠青蛙，右圖頭戴閃耀金皇冠轉為青蛙王子（已下移半徑置中於荷葉青蛙）', cropCompare: '/assets/spotter/crops/b2_s1/frog_compare.jpg' },
    { word: 'kite', wordZh: '風箏', x: 830, y: 185, radius: 155, radiusX: 95, radiusY: 155, typeZh: '風箏圖樣', descZh: '左圖晴空是幾何條紋風箏，右圖轉為彩虹蝴蝶彩繪風箏（已全域擴大完整涵蓋風箏菱面與飄逸尾穗）', cropCompare: '/assets/spotter/crops/b2_s1/kite_compare.jpg' },
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
    { word: 'sun', wordZh: '太陽與雲朵', x: 750, y: 100, radius: 140, radiusX: 140, radiusY: 80, typeZh: '氣象雲采', descZh: '左圖晴空上有太陽與微笑白雲，右圖白雲消散轉為燦爛多芒晨曦（全域涵蓋太陽與雲朵）', cropCompare: '/assets/spotter/crops/b3_s1/sun_compare.jpg' },
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

// ── 【Book 3 場景 2 • A 方案動態 8 選 5 補丁引擎】瑞士阿爾卑斯湖畔與木屋野餐台 (Swiss Alpine Lake & Chalet Picnic Terrace) ──
export const BOOK3_ALPINE_SCENE = {
  id: 'book3_alpine',
  book: '3',
  sceneNumber: 2,
  grade: 4,
  titleZh: '瑞士阿爾卑斯湖畔與木屋野餐台（四年級第 3 冊 • 場景 2）',
  titleEn: 'Swiss Alpine Lake & Chalet Picnic Terrace (Book 3 • Scene 2)',
  descZh: '在壯麗的瑞士冰川湖畔與阿爾卑斯木屋野餐台上，尋找美味野餐食物與高山景觀相異之處！',
  baseImage: '/assets/spotter/book3_scene2_base.jpg',
  diffImage: '/assets/spotter/book3_scene2_diff.jpg',
  diffImageVarB: '/assets/spotter/book3_scene2_diff_varb.jpg',
  diffImageVarC: '/assets/spotter/book3_scene2_diff_varc.jpg',
  width: 1376,
  height: 768,
  status: 'ready',
  isDynamic: true,
  isDynamicSlot: true,
  patchDir: '/assets/spotter/patches/b3_s2',
  targetItems: [
    {
      word: 'cloud',
      wordZh: '白雲',
      x: 410,
      y: 100,
      radius: 105,
      radiusX: 110,
      radiusY: 65,
      typeZh: '天候景觀',
      descZh: '藍天山巔棉花白雲，右圖轉為前後兩層立體疊加白雲',
      slot: { x: 295, y: 25, w: 230, h: 150, rx: 16 },
      patchFile: 'cloud_variantA.png',
      cropCompare: '/assets/spotter/crops/b3_s2/cloud_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '單層棉花白雲', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '雙層立體疊加白雲', tag: 'Variant A', patchFile: 'cloud_variantA.png', cropCompare: '/assets/spotter/crops/b3_s2/cloud_compare.jpg', descZh: '藍天山巔白雲轉為前後兩層立體疊加白雲' },
        { id: 'varB', name: '變異 B', label: '夕陽金霞雲', tag: 'Variant B', patchFile: 'cloud_variantB.png', cropCompare: '/assets/spotter/crops/b3_s2/cloud_compare_varB.jpg', descZh: '藍天山巔白雲轉為夕陽暖金鑲邊彩霞白雲' },
        { id: 'varC', name: '變異 C', label: '愛心夢幻雲', tag: 'Variant C', patchFile: 'cloud_variantC.png', cropCompare: '/assets/spotter/crops/b3_s2/cloud_compare_varC.jpg', descZh: '藍天山巔白雲轉為愛心形狀綿密夢幻白雲' }
      ]
    },
    {
      word: 'milk',
      wordZh: '牛奶',
      x: 124,
      y: 493,
      radius: 50,
      radiusX: 50,
      radiusY: 75,
      typeZh: '乳品包裝',
      descZh: '左側木欄托盤玻璃牛奶瓶，右圖轉為瑞士高山藍白紙盒牛奶',
      slot: { x: 59, y: 403, w: 130, h: 180, rx: 16 },
      patchFile: 'milk_variantA.png',
      cropCompare: '/assets/spotter/crops/b3_s2/milk_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '玻璃奶瓶', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '藍白紙盒牛奶', tag: 'Variant A', patchFile: 'milk_variantA.png', cropCompare: '/assets/spotter/crops/b3_s2/milk_compare.jpg', descZh: '左側木欄托盤玻璃牛奶瓶轉為瑞士高山藍白紙盒牛奶' },
        { id: 'varB', name: '變異 B', label: '肉桂熱牛奶', tag: 'Variant B', patchFile: 'milk_variantB.png', cropCompare: '/assets/spotter/crops/b3_s2/milk_compare_varB.jpg', descZh: '左側木欄托盤轉為暖心馬克杯熱牛奶佐肉桂' },
        { id: 'varC', name: '變異 C', label: '吸管隨行杯', tag: 'Variant C', patchFile: 'milk_variantC.png', cropCompare: '/assets/spotter/crops/b3_s2/milk_compare_varC.jpg', descZh: '左側木欄托盤轉為帶吸管玻璃隨行杯牛奶' }
      ]
    },
    {
      word: 'tea',
      wordZh: '茶',
      x: 440,
      y: 584,
      radius: 75,
      radiusX: 75,
      radiusY: 58,
      typeZh: '茶品品項',
      descZh: '野餐桌上琥珀紅茶壺組，右圖轉為翠綠高山薄荷綠茶杯',
      slot: { x: 350, y: 511, w: 180, h: 146, rx: 16 },
      patchFile: 'tea_variantA.png',
      cropCompare: '/assets/spotter/crops/b3_s2/tea_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '琥珀熱紅茶', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '薄荷綠茶杯', tag: 'Variant A', patchFile: 'tea_variantA.png', cropCompare: '/assets/spotter/crops/b3_s2/tea_compare.jpg', descZh: '野餐桌上琥珀紅茶壺組轉為翠綠高山薄荷綠茶杯' },
        { id: 'varB', name: '變異 B', label: '黃檸檬冰茶', tag: 'Variant B', patchFile: 'tea_variantB.png', cropCompare: '/assets/spotter/crops/b3_s2/tea_compare_varB.jpg', descZh: '野餐桌上轉為鮮黃檸檬片冰紅茶杯' },
        { id: 'varC', name: '變異 C', label: '茶包馬克杯', tag: 'Variant C', patchFile: 'tea_variantC.png', cropCompare: '/assets/spotter/crops/b3_s2/tea_compare_varC.jpg', descZh: '野餐桌上轉為陶瓷馬克杯佐茶包吊牌' }
      ]
    },
    {
      word: 'sandwich',
      wordZh: '三明治',
      x: 648,
      y: 553,
      radius: 72,
      radiusX: 72,
      radiusY: 52,
      typeZh: '麵包餐點',
      descZh: '木切板上雙層三明治，右圖轉為長棍法式潛艇三明治',
      slot: { x: 561, y: 486, w: 174, h: 134, rx: 16 },
      patchFile: 'sandwich_variantA.png',
      cropCompare: '/assets/spotter/crops/b3_s2/sandwich_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '雙層三明治', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '法式潛艇堡', tag: 'Variant A', patchFile: 'sandwich_variantA.png', cropCompare: '/assets/spotter/crops/b3_s2/sandwich_compare.jpg', descZh: '木切板上雙層三明治轉為長棍法式潛艇三明治' },
        { id: 'varB', name: '變異 B', label: '火腿可頌堡', tag: 'Variant B', patchFile: 'sandwich_variantB.png', cropCompare: '/assets/spotter/crops/b3_s2/sandwich_compare_varB.jpg', descZh: '木切板上轉為香酥金黃可頌三明治' },
        { id: 'varC', name: '變異 C', label: '芝麻貝果堡', tag: 'Variant C', patchFile: 'sandwich_variantC.png', cropCompare: '/assets/spotter/crops/b3_s2/sandwich_compare_varC.jpg', descZh: '木切板上轉為香烤芝麻貝果三明治' }
      ]
    },
    {
      word: 'rice',
      wordZh: '飯糰',
      x: 820,
      y: 553,
      radius: 58,
      radiusX: 58,
      radiusY: 52,
      typeZh: '米飯主食',
      descZh: '竹蓆上海苔三角飯糰，右圖轉為櫻花粉櫻花醃漬飯糰',
      slot: { x: 747, y: 486, w: 146, h: 134, rx: 16 },
      patchFile: 'rice_variantA.png',
      cropCompare: '/assets/spotter/crops/b3_s2/rice_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '海苔三角飯糰', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '櫻花醃漬飯糰', tag: 'Variant A', patchFile: 'rice_variantA.png', cropCompare: '/assets/spotter/crops/b3_s2/rice_compare.jpg', descZh: '竹蓆上海苔三角飯糰轉為櫻花粉櫻花醃漬飯糰' },
        { id: 'varB', name: '變異 B', label: '瓷碗香米飯', tag: 'Variant B', patchFile: 'rice_variantB.png', cropCompare: '/assets/spotter/crops/b3_s2/rice_compare_varB.jpg', descZh: '竹蓆上轉為青花瓷碗裝熱騰騰白米飯' },
        { id: 'varC', name: '變異 C', label: '醬油烤飯糰', tag: 'Variant C', patchFile: 'rice_variantC.png', cropCompare: '/assets/spotter/crops/b3_s2/rice_compare_varC.jpg', descZh: '竹蓆上轉為烤香黃金醬油燒飯糰' }
      ]
    },
    {
      word: 'watermelon',
      wordZh: '西瓜',
      x: 980,
      y: 625,
      radius: 85,
      radiusX: 90,
      radiusY: 80,
      typeZh: '當令水果',
      descZh: '長凳白瓷盤上鮮紅切片西瓜，右圖轉為金黃小玉切片西瓜',
      slot: { x: 875, y: 535, w: 210, h: 180, rx: 16 },
      patchFile: 'watermelon_variantA.png',
      cropCompare: '/assets/spotter/crops/b3_s2/watermelon_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '紅肉切片西瓜', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '金黃小玉西瓜', tag: 'Variant A', patchFile: 'watermelon_variantA.png', cropCompare: '/assets/spotter/crops/b3_s2/watermelon_compare.jpg', descZh: '長凳白瓷盤上鮮紅切片西瓜轉為金黃小玉切片西瓜' },
        { id: 'varB', name: '變異 B', label: '條紋完整西瓜', tag: 'Variant B', patchFile: 'watermelon_variantB.png', cropCompare: '/assets/spotter/crops/b3_s2/watermelon_compare_varB.jpg', descZh: '長凳白瓷盤上轉為翠綠條紋完整小西瓜' },
        { id: 'varC', name: '變異 C', label: '薄荷西瓜切塊', tag: 'Variant C', patchFile: 'watermelon_variantC.png', cropCompare: '/assets/spotter/crops/b3_s2/watermelon_compare_varC.jpg', descZh: '長凳上轉為白瓷碗盛裝西瓜方塊佐薄荷葉' }
      ]
    },
    {
      word: 'water',
      wordZh: '水壺',
      x: 1228,
      y: 468,
      radius: 48,
      radiusX: 48,
      radiusY: 80,
      typeZh: '飲水器皿',
      descZh: '右側木欄玻璃冷水壺，右圖轉為亮銀高山金屬運動水壺',
      slot: { x: 1165, y: 373, w: 126, h: 190, rx: 16 },
      patchFile: 'water_variantA.png',
      cropCompare: '/assets/spotter/crops/b3_s2/water_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '玻璃冷水壺', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '金屬保溫水壺', tag: 'Variant A', patchFile: 'water_variantA.png', cropCompare: '/assets/spotter/crops/b3_s2/water_compare.jpg', descZh: '右側木欄玻璃冷水壺轉為亮銀高山金屬運動水壺' },
        { id: 'varB', name: '變異 B', label: '高腳氣泡水杯', tag: 'Variant B', patchFile: 'water_variantB.png', cropCompare: '/assets/spotter/crops/b3_s2/water_compare_varB.jpg', descZh: '右側木欄轉為澄澈高腳氣泡水杯佐青檸' },
        { id: 'varC', name: '變異 C', label: '刻度運動水瓶', tag: 'Variant C', patchFile: 'water_variantC.png', cropCompare: '/assets/spotter/crops/b3_s2/water_compare_varC.jpg', descZh: '右側木欄轉為戶外透明刻度運動水瓶' }
      ]
    },
    {
      word: 'orange',
      wordZh: '柳橙',
      x: 1240,
      y: 680,
      radius: 75,
      radiusX: 90,
      radiusY: 60,
      typeZh: '柑橘水果',
      descZh: '露台木碗盛裝帶葉飽滿鮮橙，右圖轉為玻璃盤晶透柳橙切片輪盤',
      slot: { x: 1140, y: 610, w: 200, h: 140, rx: 16 },
      patchFile: 'orange_variantA.png',
      cropCompare: '/assets/spotter/crops/b3_s2/orange_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '鮮採綠葉甜橙', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '晶透切片輪盤', tag: 'Variant A', patchFile: 'orange_variantA.png', cropCompare: '/assets/spotter/crops/b3_s2/orange_compare.jpg', descZh: '露台木碗鮮橙轉為玻璃盤晶透柳橙切片輪盤' },
        { id: 'varB', name: '變異 B', label: '剝開飽滿橙瓣', tag: 'Variant B', patchFile: 'orange_variantB.png', cropCompare: '/assets/spotter/crops/b3_s2/orange_compare_varB.jpg', descZh: '露台木碗轉為盛裝剝開飽滿橙肉果瓣' },
        { id: 'varC', name: '變異 C', label: '編籃黃金大橙', tag: 'Variant C', patchFile: 'orange_variantC.png', cropCompare: '/assets/spotter/crops/b3_s2/orange_compare_varC.jpg', descZh: '露台轉為竹編籃盛裝金黃大甜橙' }
      ]
    }
  ],
  distractors: [
    { word: 'apple', wordZh: '蘋果' },
    { word: 'banana', wordZh: '香蕉' },
    { word: 'grape', wordZh: '葡萄' },
    { word: 'cake', wordZh: '蛋糕' }
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
    { word: 'bus', wordZh: '公車', x: 235, y: 515, radius: 160, radiusX: 160, radiusY: 135, typeZh: '公車外觀', descZh: '左側街道行駛經典英倫紅雙層巴士，右圖車身轉為皇家藍配色（全域包覆整輛紅藍雙層巴士）', cropCompare: '/assets/spotter/crops/b4_s1/bus_compare.jpg' },
    { word: 'hat', wordZh: '帽子', x: 395, y: 158, radius: 60, radiusX: 60, radiusY: 48, typeZh: '帽款色彩', descZh: '二樓衣帽架上掛著黑色圓頂禮帽，右圖轉為黃色緞帶草帽（精確對齊二樓衣帽架）', cropCompare: '/assets/spotter/crops/b4_s1/hat_compare.jpg' },
    { word: 'bed', wordZh: '床鋪', x: 370, y: 305, radius: 85, radiusX: 85, radiusY: 65, typeZh: '床單花紋', descZh: '二樓臥室單人床是暖黃格紋被套，右圖轉為深藍星空被套（中心精準置中於床鋪中央）', cropCompare: '/assets/spotter/crops/b4_s1/bed_compare.jpg' },
    { word: 'computer', wordZh: '電腦', x: 840, y: 242, radius: 75, radiusX: 75, radiusY: 50, typeZh: '螢幕顯示', descZh: '二樓書桌筆記型電腦螢幕發光，右圖轉為亮粉色外殼（精確對齊書桌筆電）', cropCompare: '/assets/spotter/crops/b4_s1/computer_compare.jpg' },
    { word: 'sofa', wordZh: '沙發', x: 560, y: 580, radius: 85, radiusX: 85, radiusY: 85, typeZh: '沙發布料', descZh: '客廳主沙發是溫馨米色布面，右圖轉為墨綠復古絨布沙發（精確對齊客廳沙發）', cropCompare: '/assets/spotter/crops/b4_s1/sofa_compare.jpg' },
    { word: 'book', wordZh: '書本', x: 725, y: 590, radius: 65, radiusX: 65, radiusY: 65, typeZh: '書本封皮', descZh: '客廳茶几上翻開的花草繪本，右圖轉為厚重精裝書（精確對齊茶几書本）', cropCompare: '/assets/spotter/crops/b4_s1/book_compare.jpg' },
    { word: 'bag', wordZh: '背包', x: 1095, y: 610, radius: 75, radiusX: 65, radiusY: 75, typeZh: '提包樣態', descZh: '一樓玄關地毯旁是紅藍學生雙肩書包，右圖轉為草綠色休閒背包（精確對齊玄關背包）', cropCompare: '/assets/spotter/crops/b4_s1/bag_compare.jpg' },
    { word: 'clock', wordZh: '時鐘', x: 1180, y: 165, radius: 48, radiusX: 45, radiusY: 48, typeZh: '鐘樓時鐘', descZh: '右上方鐘樓大笨鐘面指標為整點，右圖指針與鐘面色彩轉變（精確對齊鐘樓時鐘）', cropCompare: '/assets/spotter/crops/b4_s1/clock_compare.jpg' }
  ],
  distractors: [
    { word: 'lamp', wordZh: '檯燈' },
    { word: 'table', wordZh: '桌子' },
    { word: 'chair', wordZh: '椅子' },
    { word: 'window', wordZh: '窗戶' }
  ]
};

// ── 【Book 4 場景 2 • A 方案動態 8 選 5 槽位】倫敦泰晤士河畔與皇家地標公園街景 ──
export const BOOK4_RIVERSIDE_SCENE = {
  id: 'book4_scene2',
  book: '4',
  sceneNumber: 2,
  grade: 4,
  titleZh: '倫敦泰晤士河畔與皇家地標公園（四年級第 4 冊 • 場景 2 • A方案）',
  titleEn: 'London Thames Riverside & Royal Landmark Plaza (Book 4 • Scene 2 • Dynamic Slot Engine)',
  descZh: '在壯麗的泰晤士河畔遠眺大笨鐘與石欄拱門廣場，尋找 8 處相異物件！（融入狗、貓、腳踏車、書本、雨傘、遊船等 13+ 個已學單字靜態干擾物，三層自然景深佈局）',
  baseImage: '/assets/spotter/book4_scene2_base.jpg',
  diffImage: '/assets/spotter/book4_scene2_diff.jpg',
  diffImageVarB: '/assets/spotter/book4_scene2_diff_varb.jpg',
  diffImageVarC: '/assets/spotter/book4_scene2_diff_varc.jpg',
  width: 1376,
  height: 768,
  status: 'ready',
  isDynamic: true,
  isDynamicSlot: true,
  patchDir: '/assets/spotter/patches/b4_s2',
  targetItems: [
    {
      word: 'chair',
      wordZh: '椅子',
      x: 175,
      y: 590,
      radius: 140,
      radiusX: 140,
      radiusY: 110,
      typeZh: '椅款樣式',
      descZh: '前景墨綠英倫長椅，右圖轉為白色維多利亞鐵藝雕花椅',
      slot: { x: 20, y: 465, w: 310, h: 250, rx: 16 },
      patchFile: 'chair_variantA.png',
      cropCompare: '/assets/spotter/crops/b4_s2/chair_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '墨綠英倫長椅', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '白色鐵藝雕花椅', tag: 'Variant A', patchFile: 'chair_variantA.png', cropCompare: '/assets/spotter/crops/b4_s2/chair_compare.jpg', descZh: '前景墨綠英倫長椅轉為白色維多利亞鐵藝雕花椅' },
        { id: 'varB', name: '變異 B', label: '實木格紋單人椅', tag: 'Variant B', patchFile: 'chair_variantB.png', cropCompare: '/assets/spotter/crops/b4_s2/chair_compare_varB.jpg', descZh: '前景長椅轉為暖木色實木單人椅佐蘇格蘭格紋軟墊' },
        { id: 'varC', name: '變異 C', label: '咖啡館金屬椅', tag: 'Variant C', patchFile: 'chair_variantC.png', cropCompare: '/assets/spotter/crops/b4_s2/chair_compare_varC.jpg', descZh: '前景長椅轉為熱情亮紅街角露天咖啡館金屬椅' }
      ]
    },
    {
      word: 'hat',
      wordZh: '帽子',
      x: 450,
      y: 235,
      radius: 50,
      radiusX: 45,
      radiusY: 50,
      typeZh: '紳士帽款',
      descZh: '路燈臂懸掛紳士黑圓頂帽，右圖轉為金棕毛呢獵鹿帽',
      slot: { x: 395, y: 175, w: 110, h: 120, rx: 16 },
      patchFile: 'hat_variantA.png',
      cropCompare: '/assets/spotter/crops/b4_s2/hat_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '紳士黑圓頂帽', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '金棕毛呢獵鹿帽', tag: 'Variant A', patchFile: 'hat_variantA.png', cropCompare: '/assets/spotter/crops/b4_s2/hat_compare.jpg', descZh: '路燈臂掛著的紳士黑圓頂帽轉為金棕毛呢獵鹿帽' },
        { id: 'varB', name: '變異 B', label: '海軍藍緞帶草帽', tag: 'Variant B', patchFile: 'hat_variantB.png', cropCompare: '/assets/spotter/crops/b4_s2/hat_compare_varB.jpg', descZh: '路燈臂禮帽轉為米白平頂草帽佐海軍藍緞帶' },
        { id: 'varC', name: '變異 C', label: '羽毛圓頂禮帽', tag: 'Variant C', patchFile: 'hat_variantC.png', cropCompare: '/assets/spotter/crops/b4_s2/hat_compare_varC.jpg', descZh: '路燈臂禮帽轉為深墨綠針織圓頂禮帽佐羽毛' }
      ]
    },
    {
      word: 'bus',
      wordZh: '公車',
      x: 500,
      y: 395,
      radius: 140,
      radiusX: 165,
      radiusY: 65,
      typeZh: '公車外觀',
      descZh: '河畔街道行駛經典紅雙層巴士，右圖轉為皇家海軍藍觀光巴士',
      slot: { x: 320, y: 315, w: 360, h: 160, rx: 16 },
      patchFile: 'bus_variantA.png',
      cropCompare: '/assets/spotter/crops/b4_s2/bus_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '經典紅雙層巴士', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '海軍藍觀光巴士', tag: 'Variant A', patchFile: 'bus_variantA.png', cropCompare: '/assets/spotter/crops/b4_s2/bus_compare.jpg', descZh: '河畔街道行駛經典紅雙層巴士轉為皇家海軍藍觀光巴士' },
        { id: 'varB', name: '變異 B', label: '雙層敞篷巴士', tag: 'Variant B', patchFile: 'bus_variantB.png', cropCompare: '/assets/spotter/crops/b4_s2/bus_compare_varB.jpg', descZh: '街道紅雙層巴士轉為復古奶油白與酒紅雙層敞篷巴士' },
        { id: 'varC', name: '變異 C', label: '銀亮油電雙層車', tag: 'Variant C', patchFile: 'bus_variantC.png', cropCompare: '/assets/spotter/crops/b4_s2/bus_compare_varC.jpg', descZh: '街道紅雙層巴士轉為銀亮金屬流線雙層油電巴士' }
      ]
    },
    {
      word: 'table',
      wordZh: '桌子',
      x: 625,
      y: 685,
      radius: 120,
      radiusX: 160,
      radiusY: 70,
      typeZh: '咖啡桌款',
      descZh: '露天原木咖啡圓桌，右圖披覆典雅白色波浪蕾絲桌巾',
      slot: { x: 450, y: 605, w: 350, h: 160, rx: 16 },
      patchFile: 'table_variantA.png',
      cropCompare: '/assets/spotter/crops/b4_s2/table_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '原木咖啡圓桌', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '蕾絲桌巾咖啡桌', tag: 'Variant A', patchFile: 'table_variantA.png', cropCompare: '/assets/spotter/crops/b4_s2/table_compare.jpg', descZh: '露天原木咖啡圓桌披覆典雅白色波浪蕾絲桌巾' },
        { id: 'varB', name: '變異 B', label: '馬賽克拼花六角桌', tag: 'Variant B', patchFile: 'table_variantB.png', cropCompare: '/assets/spotter/crops/b4_s2/table_compare_varB.jpg', descZh: '咖啡圓桌轉為彩色地中海馬賽克瓷磚拼花六角桌' },
        { id: 'varC', name: '變異 C', label: '粗獷方型野餐桌', tag: 'Variant C', patchFile: 'table_variantC.png', cropCompare: '/assets/spotter/crops/b4_s2/table_compare_varC.jpg', descZh: '咖啡圓桌轉為原木風粗獷方型野餐實木小桌' }
      ]
    },
    {
      word: 'box',
      wordZh: '禮盒',
      x: 850,
      y: 365,
      radius: 75,
      radiusX: 75,
      radiusY: 65,
      typeZh: '禮品盒裝',
      descZh: '石欄基座紫色金緞帶禮盒，右圖轉為英倫花草彩繪鐵盒茶罐',
      slot: { x: 760, y: 285, w: 180, h: 160, rx: 16 },
      patchFile: 'box_variantA.png',
      cropCompare: '/assets/spotter/crops/b4_s2/box_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '紫絲絨金緞帶禮盒', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '花草彩繪鐵盒茶罐', tag: 'Variant A', patchFile: 'box_variantA.png', cropCompare: '/assets/spotter/crops/b4_s2/box_compare.jpg', descZh: '石欄基座紫色金緞帶禮盒轉為英倫花草彩繪鐵盒茶罐' },
        { id: 'varB', name: '變異 B', label: '紅木雕花珠寶盒', tag: 'Variant B', patchFile: 'box_variantB.png', cropCompare: '/assets/spotter/crops/b4_s2/box_compare_varB.jpg', descZh: '石欄基座禮盒轉為溫潤紅木雕花珠寶盒佐黃銅鎖扣' },
        { id: 'varC', name: '變異 C', label: '米字旗金屬紀念盒', tag: 'Variant C', patchFile: 'box_variantC.png', cropCompare: '/assets/spotter/crops/b4_s2/box_compare_varC.jpg', descZh: '石欄基座禮盒轉為亮麗英國米字旗彩繪金屬紀念盒' }
      ]
    },
    {
      word: 'bag',
      wordZh: '提包',
      x: 935,
      y: 655,
      radius: 80,
      radiusX: 80,
      radiusY: 80,
      typeZh: '提包種類',
      descZh: '石板路上焦糖皮質公事包，右圖轉為橄欖綠帆布休閒後背包',
      slot: { x: 840, y: 560, w: 190, h: 190, rx: 16 },
      patchFile: 'bag_variantA.png',
      cropCompare: '/assets/spotter/crops/b4_s2/bag_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '焦糖皮質公事包', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '帆布休閒後背包', tag: 'Variant A', patchFile: 'bag_variantA.png', cropCompare: '/assets/spotter/crops/b4_s2/bag_compare.jpg', descZh: '石板路上焦糖皮質公事包轉為橄欖綠帆布休閒後背包' },
        { id: 'varB', name: '變異 B', label: '硬挺英式雙肩包', tag: 'Variant B', patchFile: 'bag_variantB.png', cropCompare: '/assets/spotter/crops/b4_s2/bag_compare_varB.jpg', descZh: '石板路皮質公事包轉為海軍藍深紅英式硬挺學生雙肩包' },
        { id: 'varC', name: '變異 C', label: '刺繡提花托特包', tag: 'Variant C', patchFile: 'bag_variantC.png', cropCompare: '/assets/spotter/crops/b4_s2/bag_compare_varC.jpg', descZh: '石板路皮質公事包轉為復古刺繡提花大容量托特包' }
      ]
    },
    {
      word: 'clock',
      wordZh: '時鐘',
      x: 912,
      y: 175,
      radius: 55,
      radiusX: 55,
      radiusY: 55,
      typeZh: '鐘樓時鐘',
      descZh: '遠景大笨鐘金色羅馬鐘面，右圖轉為珍珠白簡約夜光鐘面',
      slot: { x: 842, y: 105, w: 140, h: 140, rx: 16 },
      patchFile: 'clock_variantA.png',
      cropCompare: '/assets/spotter/crops/b4_s2/clock_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '金色羅馬鐘面', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '珍珠白夜光鐘面', tag: 'Variant A', patchFile: 'clock_variantA.png', cropCompare: '/assets/spotter/crops/b4_s2/clock_compare.jpg', descZh: '遠景大笨鐘金色羅馬鐘面轉為珍珠白簡約夜光鐘面' },
        { id: 'varB', name: '變異 B', label: '墨綠金漆花絲鐘面', tag: 'Variant B', patchFile: 'clock_variantB.png', cropCompare: '/assets/spotter/crops/b4_s2/clock_compare_varB.jpg', descZh: '遠景大笨鐘鐘面轉為維多利亞墨綠底金漆花絲古典鐘面' },
        { id: 'varC', name: '變異 C', label: '暖橘金色夕陽鐘面', tag: 'Variant C', patchFile: 'clock_variantC.png', cropCompare: '/assets/spotter/crops/b4_s2/clock_compare_varC.jpg', descZh: '遠景大笨鐘鐘面轉為夕陽暖橘金色背光三點鐘下午茶鐘面' }
      ]
    },
    {
      word: 'basket',
      wordZh: '提籃',
      x: 1215,
      y: 615,
      radius: 95,
      radiusX: 95,
      radiusY: 85,
      typeZh: '編織野餐籃',
      descZh: '右側石階旁蜂蜜色藤編野餐籃，右圖轉為盛滿薰衣草與玫瑰白鐵絲花籃',
      slot: { x: 1105, y: 515, w: 220, h: 200, rx: 16 },
      patchFile: 'basket_variantA.png',
      cropCompare: '/assets/spotter/crops/b4_s2/basket_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '蜂蜜色藤編野餐籃', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '薰衣草白鐵絲花籃', tag: 'Variant A', patchFile: 'basket_variantA.png', cropCompare: '/assets/spotter/crops/b4_s2/basket_compare.jpg', descZh: '右側蜂蜜色藤編野餐籃轉為盛滿薰衣草與玫瑰白鐵絲花籃' },
        { id: 'varB', name: '變異 B', label: '鮮果香酥深褐藤籃', tag: 'Variant B', patchFile: 'basket_variantB.png', cropCompare: '/assets/spotter/crops/b4_s2/basket_compare_varB.jpg', descZh: '右側野餐籃轉為裝滿鮮紅蘋果與香酥英式糕點深褐色藤籃' },
        { id: 'varC', name: '變異 C', label: '竹編提把購物提籃', tag: 'Variant C', patchFile: 'basket_variantC.png', cropCompare: '/assets/spotter/crops/b4_s2/basket_compare_varC.jpg', descZh: '右側野餐籃轉為原色竹編圓弧提把野餐購物提籃' }
      ]
    }
  ],
  distractors: [
    { word: 'dog', wordZh: '狗' },
    { word: 'cat', wordZh: '貓' },
    { word: 'bike', wordZh: '腳踏車' },
    { word: 'boat', wordZh: '船' },
    { word: 'umbrella', wordZh: '雨傘' },
    { word: 'book', wordZh: '書本' },
    { word: 'cup', wordZh: '茶杯' },
    { word: 'bird', wordZh: '鳥' },
    { word: 'car', wordZh: '汽車' },
    { word: 'apple', wordZh: '蘋果' }
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
    { word: 'koala', wordZh: '無尾熊', x: 145, y: 175, radius: 75, radiusX: 75, radiusY: 75, typeZh: '無尾熊樣態', descZh: '左側大樹幹趴著灰毛無尾熊，右圖耳朵戴著金黃花朵（全域包覆整隻無尾熊身軀、頭耳與四爪）', cropCompare: '/assets/spotter/crops/b5_s1/koala_compare.jpg' },
    { word: 'lion', wordZh: '守護石獅', x: 535, y: 260, radius: 90, radiusX: 80, radiusY: 90, typeZh: '雕像姿態', descZh: '宮殿台階基座旁是端坐石獅，右圖轉為暗銅色且頭戴金桂冠（精確置中於石獅雕像與球）', cropCompare: '/assets/spotter/crops/b5_s1/lion_compare.jpg' },
    { word: 'milk', wordZh: '牛奶', x: 330, y: 560, radius: 75, radiusX: 45, radiusY: 75, typeZh: '瓶身圖樣', descZh: '前方矮石牆欄杆上是透明玻璃牛奶瓶，右圖轉為粉紅草莓鮮奶瓶（精確置中於鮮奶瓶，與麵包零重疊）', cropCompare: '/assets/spotter/crops/b5_s1/milk_compare.jpg' },
    { word: 'bread', wordZh: '麵包', x: 450, y: 560, radius: 75, radiusX: 60, radiusY: 75, typeZh: '麵包種類', descZh: '休閒長椅旁長棍麵包紙袋，右圖轉為牛角可頌麵包籃（獨立包覆長椅麵包籃，完全不包覆牛奶）', cropCompare: '/assets/spotter/crops/b5_s1/bread_compare.jpg' },
    { word: 'football', wordZh: '足球', x: 755, y: 580, radius: 60, radiusX: 60, radiusY: 60, typeZh: '足球圖樣', descZh: '廣場石板上是經典黑白足球，右圖轉為紅金獎盃足球（精確置中於地面足球）', cropCompare: '/assets/spotter/crops/b5_s1/football_compare.jpg' },
    { word: 'painting', wordZh: '畫作', x: 1020, y: 390, radius: 65, radiusX: 55, radiusY: 65, typeZh: '油畫畫面', descZh: '畫架上是蒙娜麗莎神秘微笑，右圖蒙娜麗莎俏皮戴上黑色墨鏡（精確置中於畫架畫布）', cropCompare: '/assets/spotter/crops/b5_s1/painting_compare.jpg' },
    { word: 'cake', wordZh: '蛋糕', x: 1140, y: 610, radius: 60, radiusX: 60, radiusY: 60, typeZh: '點心甜點', descZh: '圓木几上是白奶油草莓切片蛋糕，右圖轉為黑森林櫻桃巧克力蛋糕（精確置中於木几蛋糕）', cropCompare: '/assets/spotter/crops/b5_s1/cake_compare.jpg' },
    { word: 'camera', wordZh: '相機', x: 1265, y: 490, radius: 65, radiusX: 65, radiusY: 65, typeZh: '相機款式', descZh: '右側路燈柱上懸掛著黑色單眼相機，右圖轉為青藍雙色拍立得相機（精確置中於路燈相機）', cropCompare: '/assets/spotter/crops/b5_s1/camera_compare.jpg' }
  ],
  distractors: [
    { word: 'museum', wordZh: '博物館' },
    { word: 'statue', wordZh: '雕像' },
    { word: 'pyramid', wordZh: '金字塔' },
    { word: 'river', wordZh: '河流' }
  ]
};

// ── 【Book 6 五年級下學期】世界自然歷史與星際探索博物館（Here We Go Book 6，無食物展館規範） ──

// ── 【Book 5 場景 2 • A方案】巴黎蒙馬特小丘畫家村與聖心堂露天咖啡街（動態 8 選 5 插槽補丁引擎） ──
export const BOOK5_MONTMARTRE_SCENE = {
  id: 'book5_scene2',
  book: '5',
  sceneNumber: 2,
  grade: 5,
  titleZh: '巴黎蒙馬特小丘畫家村與聖心堂露天咖啡街（五年級第 5 冊 • 場景 2 • A方案）',
  titleEn: 'Paris Montmartre Place du Tertre & Sacré-Cœur (Book 5 • Scene 2 • Dynamic Slot Engine)',
  descZh: '在充滿藝術傳奇的蒙馬特特爾特廣場遠眺聖心堂白穹頂，尋找 8 處相異物件！（融入黑貓、法鬥、腳踏車、書本、咖啡杯、雪鐵龍老爺車等 16 個已學單字靜態干擾物，三層自然景深佈局）',
  baseImage: '/assets/spotter/book5_scene2_base.jpg',
  diffImage: '/assets/spotter/book5_scene2_diff.jpg',
  diffImageVarB: '/assets/spotter/book5_scene2_diff_varb.jpg',
  diffImageVarC: '/assets/spotter/book5_scene2_diff_varc.jpg',
  width: 1376,
  height: 768,
  status: 'ready',
  isDynamic: true,
  isDynamicSlot: true,
  patchDir: '/assets/spotter/patches/b5_s2',
  targetItems: [
  {
    word: "bread",
    wordZh: "法式麵包",
    x: 65,
    y: 615,
    radius: 120,
    radiusX: 55,
    radiusY: 120,
    typeZh: "麵包品項",
    descZh: "烘焙坊前藤籃中的金黃法式長棍轉為滿籃香脆牛角可頌與巧克力麵包",
    slot: {
      x: 0,
      y: 431,
      w: 158,
      h: 337,
      rx: 16
    },
    patchFile: "bread_variantA.png",
    cropCompare: "/assets/spotter/crops/b5_s2/bread_compare_var_a.jpg",
    variants: [
      {
        id: "base",
        name: "原圖基準",
        label: "原圖樣式",
        tag: "Base"
      },
      {
        id: "varA",
        name: "變異 A",
        label: "型態 A",
        tag: "Variant A",
        patchFile: "bread_variantA.png",
        cropCompare: "/assets/spotter/crops/b5_s2/bread_compare_var_a.jpg",
        descZh: "烘焙坊前藤籃中的金黃法式長棍轉為滿籃香脆牛角可頌與巧克力麵包"
      },
      {
        id: "varB",
        name: "變異 B",
        label: "型態 B",
        tag: "Variant B",
        patchFile: "bread_variantB.png",
        cropCompare: "/assets/spotter/crops/b5_s2/bread_compare_var_b.jpg",
        descZh: "烘焙坊前長棍麵包轉為剛出爐的圓形鄉村天然酵母麵包 (Boules)"
      },
      {
        id: "varC",
        name: "變異 C",
        label: "型態 C",
        tag: "Variant C",
        patchFile: "bread_variantC.png",
        cropCompare: "/assets/spotter/crops/b5_s2/bread_compare_var_c.jpg",
        descZh: "烘焙坊前長棍麵包轉為帶有金黃蛋液光澤的法式編織布里歐麵包 (Brioche)"
      }
    ]
  },
  {
    word: "guitar",
    wordZh: "木吉他",
    x: 445,
    y: 530,
    radius: 90,
    radiusX: 40,
    radiusY: 90,
    typeZh: "吉他琴款",
    descZh: "倚靠在復古街燈旁的雲杉民謠木吉他轉為日落漸層色雙 f 孔爵士吉他",
    slot: {
      x: 373,
      y: 388,
      w: 144,
      h: 284,
      rx: 16
    },
    patchFile: "guitar_variantA.png",
    cropCompare: "/assets/spotter/crops/b5_s2/guitar_compare_var_a.jpg",
    variants: [
      {
        id: "base",
        name: "原圖基準",
        label: "原圖樣式",
        tag: "Base"
      },
      {
        id: "varA",
        name: "變異 A",
        label: "型態 A",
        tag: "Variant A",
        patchFile: "guitar_variantA.png",
        cropCompare: "/assets/spotter/crops/b5_s2/guitar_compare_var_a.jpg",
        descZh: "倚靠在復古街燈旁的雲杉民謠木吉他轉為日落漸層色雙 f 孔爵士吉他"
      },
      {
        id: "varB",
        name: "變異 B",
        label: "型態 B",
        tag: "Variant B",
        patchFile: "guitar_variantB.png",
        cropCompare: "/assets/spotter/crops/b5_s2/guitar_compare_var_b.jpg",
        descZh: "街燈旁民謠吉他轉為櫻桃紅西班牙佛朗明哥古典吉他"
      },
      {
        id: "varC",
        name: "變異 C",
        label: "型態 C",
        tag: "Variant C",
        patchFile: "guitar_variantC.png",
        cropCompare: "/assets/spotter/crops/b5_s2/guitar_compare_var_c.jpg",
        descZh: "街燈旁民謠吉他轉為收納於天鵝絨琴盒中的日落色半空心電吉他"
      }
    ]
  },
  {
    word: "brush",
    wordZh: "畫筆",
    x: 560,
    y: 620,
    radius: 65,
    radiusX: 65,
    radiusY: 42,
    typeZh: "畫筆樣式",
    descZh: "木凳調色盤上的古典木質油畫筆轉為現代透明水彩畫筆組",
    slot: {
      x: 453,
      y: 545,
      w: 214,
      h: 150,
      rx: 16
    },
    patchFile: "brush_variantA.png",
    cropCompare: "/assets/spotter/crops/b5_s2/brush_compare_var_a.jpg",
    variants: [
      {
        id: "base",
        name: "原圖基準",
        label: "原圖樣式",
        tag: "Base"
      },
      {
        id: "varA",
        name: "變異 A",
        label: "型態 A",
        tag: "Variant A",
        patchFile: "brush_variantA.png",
        cropCompare: "/assets/spotter/crops/b5_s2/brush_compare_var_a.jpg",
        descZh: "木凳調色盤上的古典木質油畫筆轉為現代透明水彩畫筆組"
      },
      {
        id: "varB",
        name: "變異 B",
        label: "型態 B",
        tag: "Variant B",
        patchFile: "brush_variantB.png",
        cropCompare: "/assets/spotter/crops/b5_s2/brush_compare_var_b.jpg",
        descZh: "木凳上的畫筆轉為陶瓷花瓣調色盤上的細緻水彩毛筆"
      },
      {
        id: "varC",
        name: "變異 C",
        label: "型態 C",
        tag: "Variant C",
        patchFile: "brush_variantC.png",
        cropCompare: "/assets/spotter/crops/b5_s2/brush_compare_var_c.jpg",
        descZh: "木凳上的畫筆轉為開啟的古典黃銅手提箱內各色長桿油畫筆"
      }
    ]
  },
  {
    word: "painting",
    wordZh: "畫作",
    x: 765,
    y: 415,
    radius: 115,
    radiusX: 78,
    radiusY: 115,
    typeZh: "畫布題材",
    descZh: "畫架上的藍天聖心堂油畫轉為點亮街燈與星空的巴黎夜景艾菲爾鐵塔",
    slot: {
      x: 640,
      y: 238,
      w: 250,
      h: 354,
      rx: 16
    },
    patchFile: "painting_variantA.png",
    cropCompare: "/assets/spotter/crops/b5_s2/painting_compare_var_a.jpg",
    variants: [
      {
        id: "base",
        name: "原圖基準",
        label: "原圖樣式",
        tag: "Base"
      },
      {
        id: "varA",
        name: "變異 A",
        label: "型態 A",
        tag: "Variant A",
        patchFile: "painting_variantA.png",
        cropCompare: "/assets/spotter/crops/b5_s2/painting_compare_var_a.jpg",
        descZh: "畫架上的藍天聖心堂油畫轉為點亮街燈與星空的巴黎夜景艾菲爾鐵塔"
      },
      {
        id: "varB",
        name: "變異 B",
        label: "型態 B",
        tag: "Variant B",
        patchFile: "painting_variantB.png",
        cropCompare: "/assets/spotter/crops/b5_s2/painting_compare_var_b.jpg",
        descZh: "畫架上的聖心堂風景油畫轉為立體派鮮黃向日葵花瓶靜物畫"
      },
      {
        id: "varC",
        name: "變異 C",
        label: "型態 C",
        tag: "Variant C",
        patchFile: "painting_variantC.png",
        cropCompare: "/assets/spotter/crops/b5_s2/painting_compare_var_c.jpg",
        descZh: "畫架上的油畫轉為戴著紅色畫家貝雷帽的俏皮黑貓水彩插畫"
      }
    ]
  },
  {
    word: "cake",
    wordZh: "法式蛋糕",
    x: 755,
    y: 625,
    radius: 60,
    radiusX: 60,
    radiusY: 45,
    typeZh: "法式甜點",
    descZh: "大理石咖啡桌上的草莓水果千層塔轉為頂級黑巧克力歐培拉 (Opera) 蛋糕",
    slot: {
      x: 655,
      y: 546,
      w: 200,
      h: 158,
      rx: 16
    },
    patchFile: "cake_variantA.png",
    cropCompare: "/assets/spotter/crops/b5_s2/cake_compare_var_a.jpg",
    variants: [
      {
        id: "base",
        name: "原圖基準",
        label: "原圖樣式",
        tag: "Base"
      },
      {
        id: "varA",
        name: "變異 A",
        label: "型態 A",
        tag: "Variant A",
        patchFile: "cake_variantA.png",
        cropCompare: "/assets/spotter/crops/b5_s2/cake_compare_var_a.jpg",
        descZh: "大理石咖啡桌上的草莓水果千層塔轉為頂級黑巧克力歐培拉 (Opera) 蛋糕"
      },
      {
        id: "varB",
        name: "變異 B",
        label: "型態 B",
        tag: "Variant B",
        patchFile: "cake_variantB.png",
        cropCompare: "/assets/spotter/crops/b5_s2/cake_compare_var_b.jpg",
        descZh: "咖啡桌上的草莓蛋糕轉為多層彩色法式馬卡龍塔 (Macarons)"
      },
      {
        id: "varC",
        name: "變異 C",
        label: "型態 C",
        tag: "Variant C",
        patchFile: "cake_variantC.png",
        cropCompare: "/assets/spotter/crops/b5_s2/cake_compare_var_c.jpg",
        descZh: "咖啡桌上的蛋糕轉為鋪滿新鮮藍莓的重乳酪起司蛋糕切片"
      }
    ]
  },
  {
    word: "flag",
    wordZh: "旗幟",
    x: 995,
    y: 60,
    radius: 55,
    radiusX: 55,
    radiusY: 35,
    typeZh: "屋頂旗幟",
    descZh: "屋頂旗桿飄揚的法國藍白紅三色旗轉為歐盟十二金星深藍底旗",
    slot: {
      x: 902,
      y: 0,
      w: 186,
      h: 125,
      rx: 16
    },
    patchFile: "flag_variantA.png",
    cropCompare: "/assets/spotter/crops/b5_s2/flag_compare_var_a.jpg",
    variants: [
      {
        id: "base",
        name: "原圖基準",
        label: "原圖樣式",
        tag: "Base"
      },
      {
        id: "varA",
        name: "變異 A",
        label: "型態 A",
        tag: "Variant A",
        patchFile: "flag_variantA.png",
        cropCompare: "/assets/spotter/crops/b5_s2/flag_compare_var_a.jpg",
        descZh: "屋頂旗桿飄揚的法國藍白紅三色旗轉為歐盟十二金星深藍底旗"
      },
      {
        id: "varB",
        name: "變異 B",
        label: "型態 B",
        tag: "Variant B",
        patchFile: "flag_variantB.png",
        cropCompare: "/assets/spotter/crops/b5_s2/flag_compare_var_b.jpg",
        descZh: "屋頂法國三色旗轉為巴黎市徽紅藍雙色風帆船旗幟"
      },
      {
        id: "varC",
        name: "變異 C",
        label: "型態 C",
        tag: "Variant C",
        patchFile: "flag_variantC.png",
        cropCompare: "/assets/spotter/crops/b5_s2/flag_compare_var_c.jpg",
        descZh: "屋頂三色旗轉為海軍藍飾金邊的藝術節燕尾三角錦旗"
      }
    ]
  },
  {
    word: "bell",
    wordZh: "歷史銅鐘",
    x: 1125,
    y: 290,
    radius: 85,
    radiusX: 55,
    radiusY: 85,
    typeZh: "拱門鐘款",
    descZh: "建築外牆拱門吊掛的古樸青銅鐘轉為拋光亮金黃銅鐘綴飾紅流蘇",
    slot: {
      x: 1032,
      y: 155,
      w: 186,
      h: 270,
      rx: 16
    },
    patchFile: "bell_variantA.png",
    cropCompare: "/assets/spotter/crops/b5_s2/bell_compare_var_a.jpg",
    variants: [
      {
        id: "base",
        name: "原圖基準",
        label: "原圖樣式",
        tag: "Base"
      },
      {
        id: "varA",
        name: "變異 A",
        label: "型態 A",
        tag: "Variant A",
        patchFile: "bell_variantA.png",
        cropCompare: "/assets/spotter/crops/b5_s2/bell_compare_var_a.jpg",
        descZh: "建築外牆拱門吊掛的古樸青銅鐘轉為拋光亮金黃銅鐘綴飾紅流蘇"
      },
      {
        id: "varB",
        name: "變異 B",
        label: "型態 B",
        tag: "Variant B",
        patchFile: "bell_variantB.png",
        cropCompare: "/assets/spotter/crops/b5_s2/bell_compare_var_b.jpg",
        descZh: "外牆拱門青銅鐘旁增設成對的雙聯排音雙銅鐘"
      },
      {
        id: "varC",
        name: "變異 C",
        label: "型態 C",
        tag: "Variant C",
        patchFile: "bell_variantC.png",
        cropCompare: "/assets/spotter/crops/b5_s2/bell_compare_var_c.jpg",
        descZh: "外牆青銅鐘轉為帶有浮雕十字紋章的中世紀重型鐵質教堂鐘"
      }
    ]
  },
  {
    word: "camera",
    wordZh: "相機",
    x: 1120,
    y: 695,
    radius: 60,
    radiusX: 60,
    radiusY: 50,
    typeZh: "相機機型",
    descZh: "編織藤椅上的黑銀復古旁軸相機轉為亮紅色拍立得相機吐出小相片",
    slot: {
      x: 1020,
      y: 609,
      w: 200,
      h: 159,
      rx: 16
    },
    patchFile: "camera_variantA.png",
    cropCompare: "/assets/spotter/crops/b5_s2/camera_compare_var_a.jpg",
    variants: [
      {
        id: "base",
        name: "原圖基準",
        label: "原圖樣式",
        tag: "Base"
      },
      {
        id: "varA",
        name: "變異 A",
        label: "型態 A",
        tag: "Variant A",
        patchFile: "camera_variantA.png",
        cropCompare: "/assets/spotter/crops/b5_s2/camera_compare_var_a.jpg",
        descZh: "編織藤椅上的黑銀復古旁軸相機轉為亮紅色拍立得相機吐出小相片"
      },
      {
        id: "varB",
        name: "變異 B",
        label: "型態 B",
        tag: "Variant B",
        patchFile: "camera_variantB.png",
        cropCompare: "/assets/spotter/crops/b5_s2/camera_compare_var_b.jpg",
        descZh: "藤椅上的旁軸相機轉為復古雙鏡頭反光 (TLR) 相機"
      },
      {
        id: "varC",
        name: "變異 C",
        label: "型態 C",
        tag: "Variant C",
        patchFile: "camera_variantC.png",
        cropCompare: "/assets/spotter/crops/b5_s2/camera_compare_var_c.jpg",
        descZh: "藤椅上的旁軸相機轉為金象牙配色奢華相機佐銀色鏡頭蓋"
      }
    ]
  }
],
  distractors: [
  {
    word: "cat",
    wordZh: "黑貓"
  },
  {
    word: "dog",
    wordZh: "法鬥犬"
  },
  {
    word: "bike",
    wordZh: "腳踏車"
  },
  {
    word: "book",
    wordZh: "畫冊"
  },
  {
    word: "cup",
    wordZh: "咖啡杯"
  },
  {
    word: "flower",
    wordZh: "窗台繁花"
  },
  {
    word: "tree",
    wordZh: "梧桐樹"
  },
  {
    word: "car",
    wordZh: "老爺車"
  },
  {
    word: "chair",
    wordZh: "藤椅"
  },
  {
    word: "table",
    wordZh: "咖啡桌"
  },
  {
    word: "bag",
    wordZh: "提包"
  },
  {
    word: "lamp",
    wordZh: "街燈"
  },
  {
    word: "bird",
    wordZh: "白鴿"
  },
  {
    word: "apple",
    wordZh: "蘋果"
  },
  {
    word: "clock",
    wordZh: "掛鐘"
  },
  {
    word: "umbrella",
    wordZh: "遮陽傘"
  }
]
};

export const BOOK6_MUSEUM_SCENE = {
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
  targetItems: [
    { word: 'mask', wordZh: '口罩', x: 104, y: 422, radius: 55, radiusX: 55, radiusY: 45, typeZh: '圖樣樣式', descZh: '左側防疫宣導台層架放著淺藍醫用口罩，右圖轉為鮮黃笑臉口罩', cropCompare: '/assets/spotter/crops/b6_s1/mask_compare.jpg' },
    { word: 'rocket', wordZh: '火箭', x: 400, y: 188, radius: 110, radiusX: 110, radiusY: 75, typeZh: '航天機型', descZh: '挑高穹頂吊掛經典紅白火箭，右圖轉為藍銀太空穿梭機', cropCompare: '/assets/spotter/crops/b6_s1/rocket_compare.jpg' },
    { word: 'cap', wordZh: '棒球帽', x: 480, y: 466, radius: 65, radiusX: 65, radiusY: 55, typeZh: '訪客帽款', descZh: '中左獨立圓几上訪客遺落之寶藍色隊帽，右圖轉為亮紅星徽太空帽（已完全抹除原食物碗）', cropCompare: '/assets/spotter/crops/b6_s1/cap_compare.jpg' },
    { word: 'elephant', wordZh: '大象', x: 685, y: 405, radius: 130, radiusX: 130, radiusY: 65, typeZh: '裝飾樣式', descZh: '野生非洲實景展廳模型非洲象，右圖身披彩色刺繡節慶鞍毯（精確置中包覆非洲大象與節慶鞍毯）', cropCompare: '/assets/spotter/crops/b6_s1/elephant_compare.jpg' },
    { word: 'sunglasses', wordZh: '墨鏡', x: 695, y: 585, radius: 75, radiusX: 75, radiusY: 40, typeZh: '墨鏡造型', descZh: '中央前景聚光絲絨展台上是純黑飛行員墨鏡，右圖轉為復古紅色愛心造型墨鏡（精確對齊前景展台墨鏡）', cropCompare: '/assets/spotter/crops/b6_s1/sunglasses_compare.jpg' },
    { word: 'dinosaur', wordZh: '恐龍', x: 1000, y: 193, radius: 125, radiusX: 125, radiusY: 80, typeZh: '化石標本', descZh: '史前夾層展廳是霸王龍骨骼化石，右圖轉為三角龍化石標本', cropCompare: '/assets/spotter/crops/b6_s1/dinosaur_compare.jpg' },
    { word: 'umbrella', wordZh: '雨傘', x: 945, y: 493, radius: 55, radiusX: 55, radiusY: 45, typeZh: '隨身傘具', descZh: '訪客木長椅邊靠著鵝黃折疊木柄傘，右圖轉為翡翠綠條紋仕女傘（已完全抹除長椅沙拉碗）', cropCompare: '/assets/spotter/crops/b6_s1/umbrella_compare.jpg' },
    { word: 'backpack', wordZh: '背包', x: 1151, y: 597, radius: 75, radiusX: 65, radiusY: 75, typeZh: '背包配色', descZh: '紅毯圍欄立柱掛著藍橘撞色背包，右圖轉為深紫螢光綠探險背包', cropCompare: '/assets/spotter/crops/b6_s1/backpack_compare.jpg' }
  ],
  distractors: [
    { word: 'telescope', wordZh: '望遠鏡' },
    { word: 'planet', wordZh: '行星' },
    { word: 'robot', wordZh: '機器人' },
    { word: 'fossil', wordZh: '化石' }
  ]
};

// ── 【Book 6 場景 2 • A方案】新加坡濱海灣花園超級樹與戶外美食步道（動態 8 選 5 插槽補丁引擎） ──
export const BOOK6_SINGAPORE_SCENE = {
  id: 'book6_scene2',
  book: '6',
  sceneNumber: 2,
  grade: 5,
  titleZh: '新加坡濱海灣花園超級樹與戶外美食步道（五年級第 6 冊 • 場景 2 • A方案）',
  titleEn: 'Singapore Gardens by the Bay & Waterfront Promenade (Book 6 • Scene 2 • Dynamic Slot Engine)',
  descZh: '在暮色迷人的濱海灣遠眺超級樹與金沙天際線，尋找 8 處相異物件！（融入海鳥、花貓、寵物犬、自行車、餐桌、藤椅、景觀燈、蘭花花台等 16 個已學單字靜態干擾物，三層自然景深佈局）',
  baseImage: '/assets/spotter/book6_scene2_base.jpg',
  diffImage: '/assets/spotter/book6_scene2_diff.jpg',
  diffImageVarB: '/assets/spotter/book6_scene2_diff_varb.jpg',
  diffImageVarC: '/assets/spotter/book6_scene2_diff_varc.jpg',
  width: 1376,
  height: 768,
  status: 'ready',
  isDynamic: true,
  isDynamicSlot: true,
  patchDir: '/assets/spotter/patches/b6_s2',
  targetItems: [
    {
      word: "tree",
      wordZh: "熱帶樹花",
      x: 230,
      y: 220,
      radius: 150,
      radiusX: 150,
      radiusY: 115,
      typeZh: "枝頭樣態",
      descZh: "雞蛋花樹盛開粉紅花朵轉為白瓣金黃花蕊的夏威夷白金雞蛋花",
      slot: { x: 4, y: 43, w: 452, h: 354, rx: 16 },
      patchFile: "tree_variantA.png",
      cropCompare: "/assets/spotter/crops/b6_s2/tree_compare_var_a.jpg",
      variants: [
        { id: "base", name: "原圖基準", label: "原圖樣式", tag: "Base" },
        { id: "varA", name: "變異 A", label: "型態 A", tag: "Variant A", patchFile: "tree_variantA.png", cropCompare: "/assets/spotter/crops/b6_s2/tree_compare_var_a.jpg", descZh: "雞蛋花樹盛開粉紅花朵轉為白瓣金黃花蕊的夏威夷白金雞蛋花" },
        { id: "varB", name: "變異 B", label: "型態 B", tag: "Variant B", patchFile: "tree_variantB.png", cropCompare: "/assets/spotter/crops/b6_s2/tree_compare_var_b.jpg", descZh: "雞蛋花樹枝頭結滿熟透金黃的熱帶香甜芒果與青翠嫩葉" },
        { id: "varC", name: "變異 C", label: "型態 C", tag: "Variant C", patchFile: "tree_variantC.png", cropCompare: "/assets/spotter/crops/b6_s2/tree_compare_var_c.jpg", descZh: "枝頭轉為盛開深紫色熱帶蘭花並棲息著一隻色彩繽紛的巨嘴鳥" }
      ]
    },
    {
      word: "statue",
      wordZh: "魚尾獅雕像",
      x: 460,
      y: 335,
      radius: 85,
      radiusX: 45,
      radiusY: 85,
      typeZh: "雕像裝飾",
      descZh: "白色魚尾獅身披新加坡星月節慶紅絲帶與璀璨金色桂冠",
      slot: { x: 381, y: 200, w: 158, h: 270, rx: 16 },
      patchFile: "statue_variantA.png",
      cropCompare: "/assets/spotter/crops/b6_s2/statue_compare_var_a.jpg",
      variants: [
        { id: "base", name: "原圖基準", label: "原圖樣式", tag: "Base" },
        { id: "varA", name: "變異 A", label: "型態 A", tag: "Variant A", patchFile: "statue_variantA.png", cropCompare: "/assets/spotter/crops/b6_s2/statue_compare_var_a.jpg", descZh: "白色魚尾獅身披新加坡星月節慶紅絲帶與璀璨金色桂冠" },
        { id: "varB", name: "變異 B", label: "型態 B", tag: "Variant B", patchFile: "statue_variantB.png", cropCompare: "/assets/spotter/crops/b6_s2/statue_compare_var_b.jpg", descZh: "白色石雕魚尾獅轉為金光閃閃的高雅拋光黃銅青銅雕像" },
        { id: "varC", name: "變異 C", label: "型態 C", tag: "Variant C", patchFile: "statue_variantC.png", cropCompare: "/assets/spotter/crops/b6_s2/statue_compare_var_c.jpg", descZh: "魚尾獅融入夜間燈光秀，點亮霓虹電光紫藍色極光漸層光暈" }
      ]
    },
    {
      word: "boat",
      wordZh: "觀光渡輪",
      x: 880,
      y: 390,
      radius: 118,
      radiusX: 118,
      radiusY: 48,
      typeZh: "船隻款式",
      descZh: "傳統黃褐木造駁船轉為流線型純白雙層現代豪華觀光遊艇",
      slot: { x: 699, y: 307, w: 362, h: 166, rx: 16 },
      patchFile: "boat_variantA.png",
      cropCompare: "/assets/spotter/crops/b6_s2/boat_compare_var_a.jpg",
      variants: [
        { id: "base", name: "原圖基準", label: "原圖樣式", tag: "Base" },
        { id: "varA", name: "變異 A", label: "型態 A", tag: "Variant A", patchFile: "boat_variantA.png", cropCompare: "/assets/spotter/crops/b6_s2/boat_compare_var_a.jpg", descZh: "傳統黃褐木造駁船轉為流線型純白雙層現代豪華觀光遊艇" },
        { id: "varB", name: "變異 B", label: "型態 B", tag: "Variant B", patchFile: "boat_variantB.png", cropCompare: "/assets/spotter/crops/b6_s2/boat_compare_var_b.jpg", descZh: "傳統駁船轉為翠綠與純白雙色的環保太陽能綠能觀光渡輪" },
        { id: "varC", name: "變異 C", label: "型態 C", tag: "Variant C", patchFile: "boat_variantC.png", cropCompare: "/assets/spotter/crops/b6_s2/boat_compare_var_c.jpg", descZh: "傳統駁船轉為深海軍藍飾以黃銅欄杆與節慶燕尾旗的尊爵迎賓船" }
      ]
    },
    {
      word: "water",
      wordZh: "冰涼水瓶",
      x: 585,
      y: 515,
      radius: 50,
      radiusX: 25,
      radiusY: 48,
      typeZh: "飲品杯款",
      descZh: "晶透檸檬冰水轉為粉紅漸層葡萄柚氣泡水果水佐清涼薄荷葉",
      slot: { x: 534, y: 432, w: 102, h: 166, rx: 16 },
      patchFile: "water_variantA.png",
      cropCompare: "/assets/spotter/crops/b6_s2/water_compare_var_a.jpg",
      variants: [
        { id: "base", name: "原圖基準", label: "原圖樣式", tag: "Base" },
        { id: "varA", name: "變異 A", label: "型態 A", tag: "Variant A", patchFile: "water_variantA.png", cropCompare: "/assets/spotter/crops/b6_s2/water_compare_var_a.jpg", descZh: "晶透檸檬冰水轉為粉紅漸層葡萄柚氣泡水果水佐清涼薄荷葉" },
        { id: "varB", name: "變異 B", label: "型態 B", tag: "Variant B", patchFile: "water_variantB.png", cropCompare: "/assets/spotter/crops/b6_s2/water_compare_var_b.jpg", descZh: "晶透水杯轉為現榨金黃柳橙汁配紅白相間復古條紋環保吸管" },
        { id: "varC", name: "變異 C", label: "型態 C", tag: "Variant C", patchFile: "water_variantC.png", cropCompare: "/assets/spotter/crops/b6_s2/water_compare_var_c.jpg", descZh: "冰水杯轉為夢幻藍色蝶豆花檸檬冰茶綻放清澈漸層色彩" }
      ]
    },
    {
      word: "noodles",
      wordZh: "南洋炒麵",
      x: 525,
      y: 600,
      radius: 66,
      radiusX: 66,
      radiusY: 50,
      typeZh: "麵食風味",
      descZh: "金黃南洋炒麵轉為香濃椰奶紅油叻沙湯麵佐金黃油豆腐泡",
      slot: { x: 417, y: 514, w: 216, h: 172, rx: 16 },
      patchFile: "noodles_variantA.png",
      cropCompare: "/assets/spotter/crops/b6_s2/noodles_compare_var_a.jpg",
      variants: [
        { id: "base", name: "原圖基準", label: "原圖樣式", tag: "Base" },
        { id: "varA", name: "變異 A", label: "型態 A", tag: "Variant A", patchFile: "noodles_variantA.png", cropCompare: "/assets/spotter/crops/b6_s2/noodles_compare_var_a.jpg", descZh: "金黃南洋炒麵轉為香濃椰奶紅油叻沙湯麵佐金黃油豆腐泡" },
        { id: "varB", name: "變異 B", label: "型態 B", tag: "Variant B", patchFile: "noodles_variantB.png", cropCompare: "/assets/spotter/crops/b6_s2/noodles_compare_var_b.jpg", descZh: "炒麵轉為乾拌黑醬油撈麵佐鮮甜大蝦雲吞與青江菜" },
        { id: "varC", name: "變異 C", label: "型態 C", tag: "Variant C", patchFile: "noodles_variantC.png", cropCompare: "/assets/spotter/crops/b6_s2/noodles_compare_var_c.jpg", descZh: "炒麵轉為石鍋韓風香菇時蔬炒冬粉撒上香脆熟白芝麻" }
      ]
    },
    {
      word: "salad",
      wordZh: "鮮蔬沙拉",
      x: 710,
      y: 550,
      radius: 65,
      radiusX: 65,
      radiusY: 50,
      typeZh: "沙拉配料",
      descZh: "田園生菜沙拉滿鋪純白菲達起司塊、黑橄欖與初榨橄欖油",
      slot: { x: 603, y: 464, w: 214, h: 172, rx: 16 },
      patchFile: "salad_variantA.png",
      cropCompare: "/assets/spotter/crops/b6_s2/salad_compare_var_a.jpg",
      variants: [
        { id: "base", name: "原圖基準", label: "原圖樣式", tag: "Base" },
        { id: "varA", name: "變異 A", label: "型態 A", tag: "Variant A", patchFile: "salad_variantA.png", cropCompare: "/assets/spotter/crops/b6_s2/salad_compare_var_a.jpg", descZh: "田園生菜沙拉滿鋪純白菲達起司塊、黑橄欖與初榨橄欖油" },
        { id: "varB", name: "變異 B", label: "型態 B", tag: "Variant B", patchFile: "salad_variantB.png", cropCompare: "/assets/spotter/crops/b6_s2/salad_compare_var_b.jpg", descZh: "生菜沙拉轉為泰式青木瓜絲沙拉滿撒香脆花生碎與新鮮香菜" },
        { id: "varC", name: "變異 C", label: "型態 C", tag: "Variant C", patchFile: "salad_variantC.png", cropCompare: "/assets/spotter/crops/b6_s2/salad_compare_var_c.jpg", descZh: "生菜沙拉轉為挪威煙燻鮭魚凱薩沙拉滿覆金黃蒜香脆麵包丁" }
      ]
    },
    {
      word: "soup",
      wordZh: "熱騰騰熱湯",
      x: 865,
      y: 550,
      radius: 65,
      radiusX: 65,
      radiusY: 52,
      typeZh: "熱湯風味",
      descZh: "青花瓷清湯轉為砂鍋胡椒肉骨茶佐香酥油條與燉排骨",
      slot: { x: 758, y: 461, w: 214, h: 178, rx: 16 },
      patchFile: "soup_variantA.png",
      cropCompare: "/assets/spotter/crops/b6_s2/soup_compare_var_a.jpg",
      variants: [
        { id: "base", name: "原圖基準", label: "原圖樣式", tag: "Base" },
        { id: "varA", name: "變異 A", label: "型態 A", tag: "Variant A", patchFile: "soup_variantA.png", cropCompare: "/assets/spotter/crops/b6_s2/soup_compare_var_a.jpg", descZh: "青花瓷清湯轉為砂鍋胡椒肉骨茶佐香酥油條與燉排骨" },
        { id: "varB", name: "變異 B", label: "型態 B", tag: "Variant B", patchFile: "soup_variantB.png", cropCompare: "/assets/spotter/crops/b6_s2/soup_compare_var_b.jpg", descZh: "清湯轉為溫潤金黃奶油南瓜濃湯點綴純白鮮奶油花紋" },
        { id: "varC", name: "變異 C", label: "型態 C", tag: "Variant C", patchFile: "soup_variantC.png", cropCompare: "/assets/spotter/crops/b6_s2/soup_compare_var_c.jpg", descZh: "清湯轉為紅豔酸辣泰式冬陰功海鮮湯浮現飽滿鮮蝦與香茅" }
      ]
    },
    {
      word: "fan",
      wordZh: "手持風扇",
      x: 670,
      y: 650,
      radius: 70,
      radiusX: 70,
      radiusY: 40,
      typeZh: "風扇外觀",
      descZh: "柔和粉藍手持風扇轉為俏皮櫻花粉色貓耳造型隨身小風扇",
      slot: { x: 556, y: 578, w: 228, h: 144, rx: 16 },
      patchFile: "fan_variantA.png",
      cropCompare: "/assets/spotter/crops/b6_s2/fan_compare_var_a.jpg",
      variants: [
        { id: "base", name: "原圖基準", label: "原圖樣式", tag: "Base" },
        { id: "varA", name: "變異 A", label: "型態 A", tag: "Variant A", patchFile: "fan_variantA.png", cropCompare: "/assets/spotter/crops/b6_s2/fan_compare_var_a.jpg", descZh: "柔和粉藍手持風扇轉為俏皮櫻花粉色貓耳造型隨身小風扇" },
        { id: "varB", name: "變異 B", label: "型態 B", tag: "Variant B", patchFile: "fan_variantB.png", cropCompare: "/assets/spotter/crops/b6_s2/fan_compare_var_b.jpg", descZh: "粉藍風扇轉為復古奶油黃簡約工業風渦輪隨身手提電風扇" },
        { id: "varC", name: "變異 C", label: "型態 C", tag: "Variant C", patchFile: "fan_variantC.png", cropCompare: "/assets/spotter/crops/b6_s2/fan_compare_var_c.jpg", descZh: "粉藍風扇轉為清新薄荷嫩綠色運動摺疊頸掛隨身多功能風扇" }
      ]
    }
  ],
  distractors: [
    { word: "bird", wordZh: "海鳥" },
    { word: "cat", wordZh: "花貓" },
    { word: "dog", wordZh: "寵物犬" },
    { word: "bike", wordZh: "單車" },
    { word: "cup", wordZh: "咖啡杯" },
    { word: "table", wordZh: "戶外餐桌" },
    { word: "chair", wordZh: "編織藤椅" },
    { word: "bag", wordZh: "手提布袋" },
    { word: "lamp", wordZh: "景觀街燈" },
    { word: "bridge", wordZh: "雙螺旋橋" },
    { word: "clock", wordZh: "鐘塔" },
    { word: "flower", wordZh: "熱帶盆花" },
    { word: "umbrella", wordZh: "遮陽大傘" },
    { word: "box", wordZh: "面紙盒" },
    { word: "apple", wordZh: "紅蘋果" },
    { word: "book", wordZh: "旅行指南" }
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
    { word: 'map', wordZh: '地圖', x: 705, y: 570, radius: 165, radiusX: 165, radiusY: 95, typeZh: '地圖形式', descZh: '觀景台欄杆上平鋪彩色世界地圖，右圖轉為復古藏寶圖（已向右平移置中完整包覆整張世界地圖）', cropCompare: '/assets/spotter/crops/b7_s1/map_compare.jpg' },
    { word: 'suitcase', wordZh: '行李箱', x: 965, y: 580, radius: 85, radiusX: 75, radiusY: 85, typeZh: '箱體造型', descZh: '長椅旁立著棕色復古皮箱，右圖轉為亮綠藍色硬殼四輪行李箱（緊湊置中於行李箱核心，與地圖完全獨立零重疊）', cropCompare: '/assets/spotter/crops/b7_s1/suitcase_compare.jpg' },
    { word: 'gift', wordZh: '禮物', x: 1272, y: 532, radius: 75, radiusX: 75, radiusY: 72, typeZh: '包裝緞帶', descZh: '左圖售票亭是深藍金緞帶禮盒，右圖轉為緋紅翠綠緞帶禮盒', cropCompare: '/assets/spotter/crops/b7_s1/gift_compare.jpg' }
  ],
  distractors: [
    { word: 'passport', wordZh: '護照' },
    { word: 'ticket', wordZh: '車票' },
    { word: 'taxi', wordZh: '計程車' },
    { word: 'hotel', wordZh: '旅館' }
  ]
};

// ── 【Book 7 六年級上學期 • 場景 2】現代都會捷運轉運站與景觀大道（Here We Go Book 7 • A 方案動態 8 選 5） ──
export const BOOK7_METRO_SCENE = {
  id: 'book7_scene2',
  book: '7',
  sceneNumber: 2,
  grade: 6,
  titleZh: '現代都會捷運轉運站與景觀大道（六年級第 7 冊 • 圖 2 • A 方案）',
  titleEn: 'Metropolitan Metro Transit Hub & Modern Plaza (Book 7 • Scene 2 • Dynamic Slot Engine)',
  descZh: '在現代都會捷運轉運站前，找出 8 處相異點（全冊出題本位主義，100% 本冊全新單字，融入 18 個真實背景已學單字）！',
  baseImage: '/assets/spotter/book7_scene2_base.jpg',
  diffImage: '/assets/spotter/book7_scene2_diff.jpg',
  diffImageVarB: '/assets/spotter/book7_scene2_diff_varb.jpg',
  diffImageVarC: '/assets/spotter/book7_scene2_diff_varc.jpg',
  width: 1376,
  height: 768,
  status: 'ready',
  isDynamic: true,
  isDynamicSlot: true,
  patchDir: '/assets/spotter/patches/b7_s2',
  targetItems: [
    {
      word: 'metro',
      wordZh: '捷運列車',
      x: 423,
      y: 185,
      radius: 258,
      radiusX: 258,
      radiusY: 40,
      rotate: 4.8,
      typeZh: '列車型態',
      descZh: '左圖高架軌道為整列藍綠塗裝都會捷運，右圖依變異為深紅高鐵/耀眼黃單軌/翡翠綠磁浮',
      slot: { x: 153, y: 133, w: 540, h: 104, rx: 16 },
      patchFile: 'metro_variantA.png',
      cropCompare: '/assets/spotter/crops/b7_s2/metro_compare.jpg',
      variants: [
        { id: 'base', name: '基準', label: '基準型態', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '型態 A', tag: 'Variant A', patchFile: 'metro_variantA.png', cropCompare: '/assets/spotter/crops/b7_s2/metro_compare.jpg', descZh: '高架軌道捷運轉為整列深紅流線高鐵列車' },
        { id: 'varB', name: '變異 B', label: '型態 B', tag: 'Variant B', patchFile: 'metro_variantB.png', cropCompare: '/assets/spotter/crops/b7_s2/metro_compare_var_b.jpg', descZh: '高架軌道轉為整列亮黃黑紋單軌列車' },
        { id: 'varC', name: '變異 C', label: '型態 C', tag: 'Variant C', patchFile: 'metro_variantC.png', cropCompare: '/assets/spotter/crops/b7_s2/metro_compare_var_c.jpg', descZh: '高架軌道轉為整列翡翠綠未來磁浮列車' }
      ]
    },
    {
      word: 'taxi',
      wordZh: '計程車',
      x: 650,
      y: 405,
      radius: 75,
      radiusX: 75,
      radiusY: 45,
      typeZh: '計程車塗裝',
      descZh: '左圖轉運車道為亮黃色計程車，右圖轉為海軍藍與銀灰城市計程車',
      slot: { x: 563, y: 348, w: 174, h: 114, rx: 16 },
      patchFile: 'taxi_variantA.png',
      cropCompare: '/assets/spotter/crops/b7_s2/taxi_compare.jpg',
      variants: [
        { id: 'base', name: '基準', label: '基準型態', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '型態 A', tag: 'Variant A', patchFile: 'taxi_variantA.png', cropCompare: '/assets/spotter/crops/b7_s2/taxi_compare.jpg', descZh: '亮黃色計程車轉為海軍藍頂燈計程車' },
        { id: 'varB', name: '變異 B', label: '型態 B', tag: 'Variant B', patchFile: 'taxi_variantB.png', cropCompare: '/assets/spotter/crops/b7_s2/taxi_compare_var_b.jpg', descZh: '亮黃色計程車轉為經典英倫黑頂計程車' },
        { id: 'varC', name: '變異 C', label: '型態 C', tag: 'Variant C', patchFile: 'taxi_variantC.png', cropCompare: '/assets/spotter/crops/b7_s2/taxi_compare_var_c.jpg', descZh: '亮黃色計程車轉為珍珠白綠頂燈計程車' }
      ]
    },
    {
      word: 'car',
      wordZh: '汽車',
      x: 940,
      y: 435,
      radius: 88,
      radiusX: 88,
      radiusY: 80,
      typeZh: '汽車款式',
      descZh: '左圖車道為銀綠綠能休旅車，右圖轉為亮紅跑車風格小型電動車',
      slot: { x: 840, y: 345, w: 200, h: 180, rx: 16 },
      patchFile: 'car_variantA.png',
      cropCompare: '/assets/spotter/crops/b7_s2/car_compare.jpg',
      variants: [
        { id: 'base', name: '基準', label: '基準型態', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '型態 A', tag: 'Variant A', patchFile: 'car_variantA.png', cropCompare: '/assets/spotter/crops/b7_s2/car_compare.jpg', descZh: '銀綠休旅車轉為亮紅跑車型電動車' },
        { id: 'varB', name: '變異 B', label: '型態 B', tag: 'Variant B', patchFile: 'car_variantB.png', cropCompare: '/assets/spotter/crops/b7_s2/car_compare_var_b.jpg', descZh: '銀綠休旅車轉為水藍白頂都會代步車' },
        { id: 'varC', name: '變異 C', label: '型態 C', tag: 'Variant C', patchFile: 'car_variantC.png', cropCompare: '/assets/spotter/crops/b7_s2/car_compare_var_c.jpg', descZh: '銀綠休旅車轉為金屬古銅橘跨界小車' }
      ]
    },
    {
      word: 'scooter',
      wordZh: '機車',
      x: 1205,
      y: 460,
      radius: 68,
      radiusX: 68,
      radiusY: 60,
      typeZh: '機車型態',
      descZh: '左圖路側停泊薄荷綠速克達，右圖轉為火紅運動跑車機車',
      slot: { x: 1125, y: 388, w: 160, h: 144, rx: 16 },
      patchFile: 'scooter_variantA.png',
      cropCompare: '/assets/spotter/crops/b7_s2/scooter_compare.jpg',
      variants: [
        { id: 'base', name: '基準', label: '基準型態', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '型態 A', tag: 'Variant A', patchFile: 'scooter_variantA.png', cropCompare: '/assets/spotter/crops/b7_s2/scooter_compare.jpg', descZh: '薄荷綠速克達轉為火紅運動跑車機車' },
        { id: 'varB', name: '變異 B', label: '型態 B', tag: 'Variant B', patchFile: 'scooter_variantB.png', cropCompare: '/assets/spotter/crops/b7_s2/scooter_compare_var_b.jpg', descZh: '薄荷綠速克達轉為陽光黃經典復古機車' },
        { id: 'varC', name: '變異 C', label: '型態 C', tag: 'Variant C', patchFile: 'scooter_variantC.png', cropCompare: '/assets/spotter/crops/b7_s2/scooter_compare_var_c.jpg', descZh: '薄荷綠速克達轉為地中海蔚藍皮座機車' }
      ]
    },
    {
      word: 'bike',
      wordZh: '自行車',
      x: 560,
      y: 550,
      radius: 82,
      radiusX: 72,
      radiusY: 82,
      typeZh: '自行車款',
      descZh: '左圖步道停靠亮橘色共享單車，右圖轉為青藍色公共租賃單車',
      slot: { x: 476, y: 456, w: 168, h: 188, rx: 16 },
      patchFile: 'bike_variantA.png',
      cropCompare: '/assets/spotter/crops/b7_s2/bike_compare.jpg',
      variants: [
        { id: 'base', name: '基準', label: '基準型態', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '型態 A', tag: 'Variant A', patchFile: 'bike_variantA.png', cropCompare: '/assets/spotter/crops/b7_s2/bike_compare.jpg', descZh: '亮橘色共享單車轉為青藍色公共租賃單車' },
        { id: 'varB', name: '變異 B', label: '型態 B', tag: 'Variant B', patchFile: 'bike_variantB.png', cropCompare: '/assets/spotter/crops/b7_s2/bike_compare_var_b.jpg', descZh: '亮橘色共享單車轉為青檸綠環保自行車' },
        { id: 'varC', name: '變異 C', label: '型態 C', tag: 'Variant C', patchFile: 'bike_variantC.png', cropCompare: '/assets/spotter/crops/b7_s2/bike_compare_var_c.jpg', descZh: '亮橘色共享單車轉為亮紅城市通勤公路車' }
      ]
    },
    {
      word: 'ticket',
      wordZh: '車票',
      x: 350,
      y: 470,
      radius: 24,
      radiusX: 24,
      radiusY: 22,
      typeZh: '票卡樣式',
      descZh: '左圖售票機口伸出彩虹磁條票卡，右圖轉為閃亮黃金VIP智慧車票',
      slot: { x: 314, y: 436, w: 72, h: 68, rx: 16 },
      patchFile: 'ticket_variantA.png',
      cropCompare: '/assets/spotter/crops/b7_s2/ticket_compare.jpg',
      variants: [
        { id: 'base', name: '基準', label: '基準型態', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '型態 A', tag: 'Variant A', patchFile: 'ticket_variantA.png', cropCompare: '/assets/spotter/crops/b7_s2/ticket_compare.jpg', descZh: '彩虹票卡轉為黃金VIP徽章感應卡' },
        { id: 'varB', name: '變異 B', label: '型態 B', tag: 'Variant B', patchFile: 'ticket_variantB.png', cropCompare: '/assets/spotter/crops/b7_s2/ticket_compare_var_b.jpg', descZh: '彩虹票卡轉為霓虹青藍條碼乘車券' },
        { id: 'varC', name: '變異 C', label: '型態 C', tag: 'Variant C', patchFile: 'ticket_variantC.png', cropCompare: '/assets/spotter/crops/b7_s2/ticket_compare_var_c.jpg', descZh: '彩虹票卡轉為粉紅吉祥物卡通定期票' }
      ]
    },
    {
      word: 'sandwich',
      wordZh: '三明治',
      x: 250,
      y: 655,
      radius: 46,
      radiusX: 46,
      radiusY: 30,
      typeZh: '三明治型態',
      descZh: '左圖木盤為切片三明治，右圖轉為法式金黃可頌鮭魚三明治',
      slot: { x: 194, y: 615, w: 112, h: 80, rx: 16 },
      patchFile: 'sandwich_variantA.png',
      cropCompare: '/assets/spotter/crops/b7_s2/sandwich_compare.jpg',
      variants: [
        { id: 'base', name: '基準', label: '基準型態', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '型態 A', tag: 'Variant A', patchFile: 'sandwich_variantA.png', cropCompare: '/assets/spotter/crops/b7_s2/sandwich_compare.jpg', descZh: '切片三明治轉為法式可頌鮭魚三明治' },
        { id: 'varB', name: '變異 B', label: '型態 B', tag: 'Variant B', patchFile: 'sandwich_variantB.png', cropCompare: '/assets/spotter/crops/b7_s2/sandwich_compare_var_b.jpg', descZh: '切片三明治轉為芝麻貝果起司蛋三明治' },
        { id: 'varC', name: '變異 C', label: '型態 C', tag: 'Variant C', patchFile: 'sandwich_variantC.png', cropCompare: '/assets/spotter/crops/b7_s2/sandwich_compare_var_c.jpg', descZh: '切片三明治轉為雜糧三層總匯三明治' }
      ]
    },
    {
      word: 'soda',
      wordZh: '蘇打汽水',
      x: 340,
      y: 585,
      radius: 78,
      radiusX: 32,
      radiusY: 78,
      typeZh: '汽水瓶型',
      descZh: '左圖吧台為沁藍氣泡水瓶，右圖轉為紅寶石櫻桃蘇打瓶',
      slot: { x: 296, y: 495, w: 88, h: 180, rx: 16 },
      patchFile: 'soda_variantA.png',
      cropCompare: '/assets/spotter/crops/b7_s2/soda_compare.jpg',
      variants: [
        { id: 'base', name: '基準', label: '基準型態', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '型態 A', tag: 'Variant A', patchFile: 'soda_variantA.png', cropCompare: '/assets/spotter/crops/b7_s2/soda_compare.jpg', descZh: '沁藍氣泡水瓶轉為櫻桃紅蘇打氣泡瓶' },
        { id: 'varB', name: '變異 B', label: '型態 B', tag: 'Variant B', patchFile: 'soda_variantB.png', cropCompare: '/assets/spotter/crops/b7_s2/soda_compare_var_b.jpg', descZh: '沁藍氣泡水瓶轉為青檸綠霜滴氣泡易開罐' },
        { id: 'varC', name: '變異 C', label: '型態 C', tag: 'Variant C', patchFile: 'soda_variantC.png', cropCompare: '/assets/spotter/crops/b7_s2/soda_compare_var_c.jpg', descZh: '沁藍氣泡水瓶轉為黃金熱帶芒果蘇打瓶' }
      ]
    }
  ],
  distractors: [
    { word: 'dog', wordZh: '導盲小狗' },
    { word: 'cat', wordZh: '睡覺貓咪' },
    { word: 'bird', wordZh: '白鴿' },
    { word: 'clock', wordZh: '車站時鐘' },
    { word: 'tree', wordZh: '林蔭路樹' },
    { word: 'bridge', wordZh: '天橋' },
    { word: 'map', wordZh: '導覽地圖' },
    { word: 'cup', wordZh: '紙杯' }
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
    { word: 'swan', wordZh: '天鵝', x: 325, y: 460, radius: 70, radiusX: 70, radiusY: 55, typeZh: '羽色品種', descZh: '左側池塘中優雅純白白天鵝，右圖轉為紅喙純黑黑天鵝（向右上移精確包覆天鵝頭頸與全軀）', cropCompare: '/assets/spotter/crops/b8_s1/swan_compare.jpg' },
    { word: 'spade', wordZh: '鏟子', x: 200, y: 535, radius: 135, radiusX: 38, radiusY: 135, rotate: -14, typeZh: '工具配色', descZh: '花圃插著園藝鏟，右圖轉為金黃園藝鏟（中心逆時針傾斜14度拉伸，完美涵蓋木柄至鏟刃，與天鵝零交疊）', cropCompare: '/assets/spotter/crops/b8_s1/spade_compare.jpg' },
    { word: 'drum', wordZh: '鼓', x: 288, y: 250, radius: 66, radiusX: 66, radiusY: 58, typeZh: '樂器外觀', descZh: '左圖涼亭舞台是紅金行進鼓，右圖轉為皇家深藍小鼓（向上移完整包含鼓面與鼓棒）', cropCompare: '/assets/spotter/crops/b8_s1/drum_compare.jpg' },
    { word: 'pie', wordZh: '派', x: 704, y: 546, radius: 96, radiusX: 96, radiusY: 52, typeZh: '點心風味', descZh: '左圖石台茶几上是酥皮水果派，右圖轉為深紫黑莓派（向下移包滿整個派與烤盤）', cropCompare: '/assets/spotter/crops/b8_s1/pie_compare.jpg' },
    { word: 'rose', wordZh: '玫瑰', x: 698, y: 268, radius: 76, radiusX: 76, radiusY: 74, typeZh: '花卉色彩', descZh: '左圖中央拱門是鮮紅玫瑰花叢，右圖轉為金黃玫瑰花叢（拱門兩側纏繞之背景玫瑰花已於兩圖統一顏色，僅中央玫瑰相異）', cropCompare: '/assets/spotter/crops/b8_s1/rose_compare.jpg' },
    { word: 'coat', wordZh: '大衣', x: 957, y: 310, radius: 95, radiusX: 75, radiusY: 95, typeZh: '服飾樣式', descZh: '左圖長椅上是海軍藍風衣，右圖轉為暖駝色牛角扣大衣（完整包覆領口與肩線）', cropCompare: '/assets/spotter/crops/b8_s1/coat_compare.jpg' },
    { word: 'flute', wordZh: '長笛', x: 998, y: 505, radius: 105, radiusX: 105, radiusY: 35, typeZh: '樂器光澤', descZh: '左圖樂譜架上是銀白長笛，右圖轉為玫瑰金長笛', cropCompare: '/assets/spotter/crops/b8_s1/flute_compare.jpg' },
    { word: 'dress', wordZh: '洋裝', x: 1256, y: 348, radius: 142, radiusX: 110, radiusY: 142, typeZh: '禮服色彩', descZh: '右側人台模特兒上是淡紫碎花洋裝，右圖轉為祖母綠綢緞晚宴洋裝（判定框已向上拉伸完整包覆整個人形模特兒全身）', cropCompare: '/assets/spotter/crops/b8_s1/dress_compare.jpg' }
  ],
  distractors: [
    { word: 'violin', wordZh: '小提琴' },
    { word: 'piano', wordZh: '鋼琴' },
    { word: 'tree', wordZh: '大樹' },
    { word: 'bench', wordZh: '長椅' }
  ]
};

// ── 【Book 2 場景 2 • A 方案動態槽位變異】日本京都花見小路與職人小鎮 ──
export const BOOK2_KYOTO_SCENE = {
  id: 'book2_scene2',
  book: '2',
  sceneNumber: 2,
  grade: 3,
  titleZh: '日本京都花見小路與職人小鎮（三年級第 2 冊 • 場景 2 • A方案）',
  titleEn: 'Kyoto Hanamikoji Artisan Town (Book 2 • Scene 2 • Dynamic Slot Engine)',
  descZh: '在古色古香的京都木造町家與石疊小路中，尋找工藝禮品與茶屋相異之處！',
  baseImage: '/assets/spotter/book2_scene2_base.jpg',
  diffImage: '/assets/spotter/book2_scene2_diff.jpg',
  diffImageVarB: '/assets/spotter/book2_scene2_diff_varb.jpg',
  diffImageVarC: '/assets/spotter/book2_scene2_diff_varc.jpg',
  width: 1376,
  height: 768,
  status: 'ready',
  isDynamic: true,
  isDynamicSlot: true,
  patchDir: '/assets/spotter/patches/b2_s2',
  targetItems: [
    {
      word: 'cup',
      wordZh: '茶杯',
      x: 146,
      y: 595,
      radius: 58,
      radiusX: 58,
      radiusY: 48,
      typeZh: '茶具樣式',
      descZh: '茶屋木長凳托盤上是白瓷茶杯，右圖轉為綠釉抹茶陶杯',
      slot: { x: 73, y: 532, w: 146, h: 126, rx: 16 },
      patchFile: 'cup_variantA.png',
      cropCompare: '/assets/spotter/crops/b2_s2/cup_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '白瓷茶杯', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '綠釉抹茶陶杯', tag: 'Variant A', patchFile: 'cup_variantA.png', cropCompare: '/assets/spotter/crops/b2_s2/cup_compare.jpg', descZh: '茶屋木長凳托盤上是白瓷茶杯，右圖轉為綠釉抹茶陶杯' },
        { id: 'varB', name: '變異 B', label: '朱紅漆器茶托杯', tag: 'Variant B', patchFile: 'cup_variantB.png', cropCompare: '/assets/spotter/crops/b2_s2/cup_compare_varB.jpg', descZh: '茶屋木長凳托盤上轉為朱紅漆器茶托杯' },
        { id: 'varC', name: '變異 C', label: '紫砂陶茶杯', tag: 'Variant C', patchFile: 'cup_variantC.png', cropCompare: '/assets/spotter/crops/b2_s2/cup_compare_varC.jpg', descZh: '茶屋木長凳托盤上轉為紫砂陶茶杯' }
      ]
    },
    {
      word: 'bed',
      wordZh: '榻榻米床鋪',
      x: 318,
      y: 230,
      radius: 115,
      radiusX: 115,
      radiusY: 52,
      typeZh: '被鋪花色',
      descZh: '二樓和室敞開紙門內是暖黃藺草蓆被鋪，右圖轉為青藍浪紋日式被鋪',
      slot: { x: 188, y: 163, w: 260, h: 134, rx: 16 },
      patchFile: 'bed_variantA.png',
      cropCompare: '/assets/spotter/crops/b2_s2/bed_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '暖黃藺草蓆被鋪', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '青藍浪紋日式被鋪', tag: 'Variant A', patchFile: 'bed_variantA.png', cropCompare: '/assets/spotter/crops/b2_s2/bed_compare.jpg', descZh: '二樓和室敞開紙門內是暖黃藺草蓆被鋪，右圖轉為青藍浪紋日式被鋪' },
        { id: 'varB', name: '變異 B', label: '櫻粉櫻花棉褥和室被鋪', tag: 'Variant B', patchFile: 'bed_variantB.png', cropCompare: '/assets/spotter/crops/b2_s2/bed_compare_varB.jpg', descZh: '二樓和室敞開紙門內轉為櫻粉櫻花棉褥和室被鋪' }
      ]
    },
    {
      word: 'umbrella',
      wordZh: '和傘',
      x: 468,
      y: 536,
      radius: 118,
      radiusX: 118,
      radiusY: 78,
      typeZh: '傘面圖案',
      descZh: '茶屋門口立著緋紅蛇目油紙傘，右圖轉為紫羅蘭碎花和傘',
      slot: { x: 335, y: 443, w: 266, h: 186, rx: 20 },
      patchFile: 'umbrella_variantA.png',
      cropCompare: '/assets/spotter/crops/b2_s2/umbrella_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '緋紅蛇目油紙傘', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '紫羅蘭碎花和傘', tag: 'Variant A', patchFile: 'umbrella_variantA.png', cropCompare: '/assets/spotter/crops/b2_s2/umbrella_compare.jpg', descZh: '茶屋門口立著緋紅蛇目油紙傘，右圖轉為紫羅蘭碎花和傘' },
        { id: 'varB', name: '變異 B', label: '陽光金黃節慶和傘', tag: 'Variant B', patchFile: 'umbrella_variantB.png', cropCompare: '/assets/spotter/crops/b2_s2/umbrella_compare_varB.jpg', descZh: '茶屋門口立著陽光金黃節慶和傘' },
        { id: 'varC', name: '變異 C', label: '青竹翠綠和傘', tag: 'Variant C', patchFile: 'umbrella_variantC.png', cropCompare: '/assets/spotter/crops/b2_s2/umbrella_compare_varC.jpg', descZh: '茶屋門口立著青竹翠綠和傘' }
      ]
    },
    {
      word: 'doll',
      wordZh: '人偶',
      x: 583,
      y: 422,
      radius: 48,
      radiusX: 48,
      radiusY: 72,
      typeZh: '人偶彩繪',
      descZh: '工藝陳列架上是紅色和服木芥子娃娃，右圖轉為藍條紋鳴子人偶',
      slot: { x: 520, y: 335, w: 126, h: 174, rx: 16 },
      patchFile: 'doll_variantA.png',
      cropCompare: '/assets/spotter/crops/b2_s2/doll_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '紅色和服木芥子', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '藍條紋鳴子人偶', tag: 'Variant A', patchFile: 'doll_variantA.png', cropCompare: '/assets/spotter/crops/b2_s2/doll_compare.jpg', descZh: '工藝陳列架上是紅色和服木芥子娃娃，右圖轉為藍條紋鳴子人偶' },
        { id: 'varB', name: '變異 B', label: '招財貓木雕人偶', tag: 'Variant B', patchFile: 'doll_variantB.png', cropCompare: '/assets/spotter/crops/b2_s2/doll_compare_varB.jpg', descZh: '工藝陳列架上轉為招財貓木雕人偶' },
        { id: 'varC', name: '變異 C', label: '金黃達摩吉祥木偶', tag: 'Variant C', patchFile: 'doll_variantC.png', cropCompare: '/assets/spotter/crops/b2_s2/doll_compare_varC.jpg', descZh: '工藝陳列架上轉為金黃達摩吉祥木偶' }
      ]
    },
    {
      word: 'fish',
      wordZh: '錦鯉',
      x: 910,
      y: 694,
      radius: 72,
      radiusX: 72,
      radiusY: 38,
      typeZh: '錦鯉花紋',
      descZh: '庭園清澈石水盆中游動著紅金錦鯉，右圖轉為水墨黑白斑紋錦鯉',
      slot: { x: 823, y: 641, w: 174, h: 106, rx: 16 },
      patchFile: 'fish_variantA.png',
      cropCompare: '/assets/spotter/crops/b2_s2/fish_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '紅金相間錦鯉', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '水墨黑白斑紋錦鯉', tag: 'Variant A', patchFile: 'fish_variantA.png', cropCompare: '/assets/spotter/crops/b2_s2/fish_compare.jpg', descZh: '庭園清澈石水盆中游動著紅金錦鯉，右圖轉為水墨黑白斑紋錦鯉' },
        { id: 'varB', name: '變異 B', label: '金黃招財黃金錦鯉', tag: 'Variant B', patchFile: 'fish_variantB.png', cropCompare: '/assets/spotter/crops/b2_s2/fish_compare_varB.jpg', descZh: '庭園清澈石水盆中游動著金黃招財黃金錦鯉' },
        { id: 'varC', name: '變異 C', label: '碧藍錦鯉與翠綠荷葉', tag: 'Variant C', patchFile: 'fish_variantC.png', cropCompare: '/assets/spotter/crops/b2_s2/fish_compare_varC.jpg', descZh: '庭園清澈石水盆中轉為碧藍錦鯉與翠綠荷葉' }
      ]
    },
    {
      word: 'fan',
      wordZh: '摺扇',
      x: 1072,
      y: 432,
      radius: 88,
      radiusX: 88,
      radiusY: 48,
      typeZh: '扇面繪紋',
      descZh: '竹製陳列架上是櫻花金箔摺扇，右圖轉為富士山青藍摺扇',
      slot: { x: 969, y: 369, w: 206, h: 126, rx: 16 },
      patchFile: 'fan_variantA.png',
      cropCompare: '/assets/spotter/crops/b2_s2/fan_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '櫻花金箔摺扇', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '富士山青藍摺扇', tag: 'Variant A', patchFile: 'fan_variantA.png', cropCompare: '/assets/spotter/crops/b2_s2/fan_compare.jpg', descZh: '竹製陳列架上是櫻花金箔摺扇，右圖轉為富士山青藍摺扇' },
        { id: 'varB', name: '變異 B', label: '秋季金黃銀杏圓團扇', tag: 'Variant B', patchFile: 'fan_variantB.png', cropCompare: '/assets/spotter/crops/b2_s2/fan_compare_varB.jpg', descZh: '竹製陳列架上轉為秋季金黃銀杏圓團扇' },
        { id: 'varC', name: '變異 C', label: '素雅紫藤水墨摺扇', tag: 'Variant C', patchFile: 'fan_variantC.png', cropCompare: '/assets/spotter/crops/b2_s2/fan_compare_varC.jpg', descZh: '竹製陳列架上轉為素雅紫藤水墨摺扇' }
      ]
    },
    {
      word: 'bird',
      wordZh: '小鳥',
      x: 1231,
      y: 141,
      radius: 78,
      radiusX: 78,
      radiusY: 68,
      typeZh: '羽色品種',
      descZh: '右上櫻花樹梢停著翠綠小雀鳥，右圖轉為雪白灰羽小鳥',
      slot: { x: 1138, y: 58, w: 186, h: 166, rx: 20 },
      patchFile: 'bird_variantA.png',
      cropCompare: '/assets/spotter/crops/b2_s2/bird_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '翠綠枝頭小雀鳥', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '雪白灰羽小鳥', tag: 'Variant A', patchFile: 'bird_variantA.png', cropCompare: '/assets/spotter/crops/b2_s2/bird_compare.jpg', descZh: '右上櫻花樹梢停著翠綠小雀鳥，右圖轉為雪白灰羽小鳥' },
        { id: 'varB', name: '變異 B', label: '暖橘紅喉知更鳥', tag: 'Variant B', patchFile: 'bird_variantB.png', cropCompare: '/assets/spotter/crops/b2_s2/bird_compare_varB.jpg', descZh: '右上櫻花樹梢停著暖橘紅喉知更鳥' },
        { id: 'varC', name: '變異 C', label: '靛藍琉璃鳥', tag: 'Variant C', patchFile: 'bird_variantC.png', cropCompare: '/assets/spotter/crops/b2_s2/bird_compare_varC.jpg', descZh: '右上櫻花樹梢停著靛藍琉璃鳥' }
      ]
    },
    {
      word: 'box',
      wordZh: '點心盒',
      x: 1277,
      y: 531,
      radius: 78,
      radiusX: 78,
      radiusY: 58,
      typeZh: '禮盒包裝',
      descZh: '點心鋪桌上是黑漆描金點心盒，右圖轉為朱紅櫻花木質點心盒',
      slot: { x: 1184, y: 458, w: 186, h: 146, rx: 16 },
      patchFile: 'box_variantA.png',
      cropCompare: '/assets/spotter/crops/b2_s2/box_compare.jpg',
      variants: [
        { id: 'base', name: '原圖基準', label: '原色桐木工藝盒', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '黑漆描金點心盒', tag: 'Variant A', patchFile: 'box_variantA.png', cropCompare: '/assets/spotter/crops/b2_s2/box_compare.jpg', descZh: '點心鋪桌上是黑漆描金點心盒，右圖轉為朱紅櫻花木質點心盒' },
        { id: 'varB', name: '變異 B', label: '朱紅櫻花禮品盒', tag: 'Variant B', patchFile: 'box_variantB.png', cropCompare: '/assets/spotter/crops/b2_s2/box_compare_varB.jpg', descZh: '點心鋪桌上轉為朱紅櫻花禮品盒' },
        { id: 'varC', name: '變異 C', label: '雙層竹編精緻點心籠', tag: 'Variant C', patchFile: 'box_variantC.png', cropCompare: '/assets/spotter/crops/b2_s2/box_compare_varC.jpg', descZh: '點心鋪桌上轉為雙層竹編精緻點心籠' }
      ]
    }
  ],
  distractors: [
    { word: 'house', wordZh: '房子' },
    { word: 'tree', wordZh: '樹木' },
    { word: 'bridge', wordZh: '橋樑' },
    { word: 'lantern', wordZh: '石燈籠' }
  ]
};

// ── 【Book 8 六年級下學期 • 場景 2】紐約第五大道時尚名店街（Here We Go Book 8 • A 方案動態 8 選 5） ──
export const BOOK8_AVENUE_SCENE = {
  id: 'book8_scene2',
  book: '8',
  sceneNumber: 2,
  grade: 6,
  titleZh: '紐約第五大道時尚名店街（六年級第 8 冊 • 圖 2 • A 方案）',
  titleEn: 'Fifth Avenue Luxury Fashion Promenade & Sidewalk Cafe (Book 8 • Scene 2 • Dynamic Slot Engine)',
  descZh: '在紐約第五大道時尚名店街前，找出 8 處相異點（全冊出題本位主義，100% 本冊全新單字，自然融入 14 個情境協調已學單字）！',
  baseImage: '/assets/spotter/book8_scene2_base.jpg',
  diffImage: '/assets/spotter/book8_scene2_diff.jpg',
  diffImageVarB: '/assets/spotter/book8_scene2_diff_varb.jpg',
  diffImageVarC: '/assets/spotter/book8_scene2_diff_varc.jpg',
  width: 1376,
  height: 768,
  status: 'ready',
  isDynamic: true,
  isDynamicSlot: true,
  patchDir: '/assets/spotter/patches/b8_s2',
  targetItems: [
    {
      word: 'suit',
      wordZh: '西裝',
      x: 265,
      y: 300,
      radius: 75,
      radiusX: 60,
      radiusY: 75,
      typeZh: '西裝款式',
      descZh: '左側精品櫥窗內為海軍藍成套西裝，右圖轉為酒紅絲絨晚宴西裝',
      slot: { x: 195, y: 215, w: 140, h: 170, rx: 16 },
      patchFile: 'suit_variantA.png',
      cropCompare: '/assets/spotter/crops/b8_s2/suit_compare.jpg',
      variants: [
        { id: 'base', name: '基準', label: '基準型態', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '型態 A', tag: 'Variant A', patchFile: 'suit_variantA.png', cropCompare: '/assets/spotter/crops/b8_s2/suit_compare.jpg', descZh: '深海軍藍西裝轉為酒紅絲絨晚宴禮服西裝' },
        { id: 'varB', name: '變異 B', label: '型態 B', tag: 'Variant B', patchFile: 'suit_variantB.png', cropCompare: '/assets/spotter/crops/b8_s2/suit_compare_var_b.jpg', descZh: '深海軍藍西裝轉為卡其米色雙排扣休閒西裝' },
        { id: 'varC', name: '變異 C', label: '型態 C', tag: 'Variant C', patchFile: 'suit_variantC.png', cropCompare: '/assets/spotter/crops/b8_s2/suit_compare_var_c.jpg', descZh: '深海軍藍西裝轉為祖母綠英倫紳士西裝' }
      ]
    },
    {
      word: 'jacket',
      wordZh: '夾克',
      x: 475,
      y: 370,
      radius: 68,
      radiusX: 60,
      radiusY: 68,
      typeZh: '夾克款式',
      descZh: '左側服飾立架上為棕色飛行皮夾克，右圖轉為亮黑重機皮夾克',
      slot: { x: 405, y: 292, w: 140, h: 156, rx: 16 },
      patchFile: 'jacket_variantA.png',
      cropCompare: '/assets/spotter/crops/b8_s2/jacket_compare.jpg',
      variants: [
        { id: 'base', name: '基準', label: '基準型態', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '型態 A', tag: 'Variant A', patchFile: 'jacket_variantA.png', cropCompare: '/assets/spotter/crops/b8_s2/jacket_compare.jpg', descZh: '棕色飛行皮夾克轉為亮黑銀拉鍊重機夾克' },
        { id: 'varB', name: '變異 B', label: '型態 B', tag: 'Variant B', patchFile: 'jacket_variantB.png', cropCompare: '/assets/spotter/crops/b8_s2/jacket_compare_var_b.jpg', descZh: '棕色飛行皮夾克轉為陽光黃防風連帽休閒夾克' },
        { id: 'varC', name: '變異 C', label: '型態 C', tag: 'Variant C', patchFile: 'jacket_variantC.png', cropCompare: '/assets/spotter/crops/b8_s2/jacket_compare_var_c.jpg', descZh: '棕色飛行皮夾克轉為橄欖軍綠尼龍飛行夾克' }
      ]
    },
    {
      word: 'skirt',
      wordZh: '裙子',
      x: 170,
      y: 515,
      radius: 62,
      radiusX: 50,
      radiusY: 62,
      typeZh: '裙款造型',
      descZh: '左側人台模特兒為裸粉百褶裙，右圖轉為深藍白波點傘裙',
      slot: { x: 110, y: 443, w: 120, h: 144, rx: 16 },
      patchFile: 'skirt_variantA.png',
      cropCompare: '/assets/spotter/crops/b8_s2/skirt_compare.jpg',
      variants: [
        { id: 'base', name: '基準', label: '基準型態', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '型態 A', tag: 'Variant A', patchFile: 'skirt_variantA.png', cropCompare: '/assets/spotter/crops/b8_s2/skirt_compare.jpg', descZh: '裸粉百褶裙轉為深海軍藍白波點傘裙' },
        { id: 'varB', name: '變異 B', label: '型態 B', tag: 'Variant B', patchFile: 'skirt_variantB.png', cropCompare: '/assets/spotter/crops/b8_s2/skirt_compare_var_b.jpg', descZh: '裸粉百褶裙轉為檸檬黃高腰A字裙' },
        { id: 'varC', name: '變異 C', label: '型態 C', tag: 'Variant C', patchFile: 'skirt_variantC.png', cropCompare: '/assets/spotter/crops/b8_s2/skirt_compare_var_c.jpg', descZh: '裸粉百褶裙轉為黑白英倫千鳥格毛呢裙' }
      ]
    },
    {
      word: 'jeans',
      wordZh: '牛仔褲',
      x: 305,
      y: 585,
      radius: 55,
      radiusX: 55,
      radiusY: 42,
      typeZh: '丹寧褲款',
      descZh: '左側展示桌上為經典深藍牛仔褲，右圖轉為淺水洗白灰破洞牛仔褲',
      slot: { x: 240, y: 533, w: 130, h: 104, rx: 16 },
      patchFile: 'jeans_variantA.png',
      cropCompare: '/assets/spotter/crops/b8_s2/jeans_compare.jpg',
      variants: [
        { id: 'base', name: '基準', label: '基準型態', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '型態 A', tag: 'Variant A', patchFile: 'jeans_variantA.png', cropCompare: '/assets/spotter/crops/b8_s2/jeans_compare.jpg', descZh: '深藍牛仔褲轉為淺水洗刷白破洞牛仔褲' },
        { id: 'varB', name: '變異 B', label: '型態 B', tag: 'Variant B', patchFile: 'jeans_variantB.png', cropCompare: '/assets/spotter/crops/b8_s2/jeans_compare_var_b.jpg', descZh: '深藍牛仔褲轉為曜石黑修身丹寧褲' },
        { id: 'varC', name: '變異 C', label: '型態 C', tag: 'Variant C', patchFile: 'jeans_variantC.png', cropCompare: '/assets/spotter/crops/b8_s2/jeans_compare_var_c.jpg', descZh: '深藍牛仔褲轉為焦糖原色厚磅丹寧褲' }
      ]
    },
    {
      word: 'blanket',
      wordZh: '薄毯',
      x: 695,
      y: 485,
      radius: 62,
      radiusX: 55,
      radiusY: 62,
      typeZh: '毛毯織紋',
      descZh: '露天咖啡椅背為紅黑英倫格紋毛毯，右圖轉為鵝黃菱格編織毛毯',
      slot: { x: 630, y: 413, w: 130, h: 144, rx: 16 },
      patchFile: 'blanket_variantA.png',
      cropCompare: '/assets/spotter/crops/b8_s2/blanket_compare.jpg',
      variants: [
        { id: 'base', name: '基準', label: '基準型態', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '型態 A', tag: 'Variant A', patchFile: 'blanket_variantA.png', cropCompare: '/assets/spotter/crops/b8_s2/blanket_compare.jpg', descZh: '紅黑格紋毛毯轉為鵝黃柔白菱格編織毛毯' },
        { id: 'varB', name: '變異 B', label: '型態 B', tag: 'Variant B', patchFile: 'blanket_variantB.png', cropCompare: '/assets/spotter/crops/b8_s2/blanket_compare_var_b.jpg', descZh: '紅黑格紋毛毯轉為湖水蔚藍雪花提花絨毛毯' },
        { id: 'varC', name: '變異 C', label: '型態 C', tag: 'Variant C', patchFile: 'blanket_variantC.png', cropCompare: '/assets/spotter/crops/b8_s2/blanket_compare_var_c.jpg', descZh: '紅黑格紋毛毯轉為摩登橘褐幾何羊毛披毯' }
      ]
    },
    {
      word: 'toast',
      wordZh: '烤吐司',
      x: 805,
      y: 605,
      radius: 45,
      radiusX: 45,
      radiusY: 38,
      typeZh: '吐司口味',
      descZh: '露天咖啡盤中為金黃焦香法式吐司，右圖轉為鮮紅草莓生乳酪吐司',
      slot: { x: 750, y: 557, w: 110, h: 96, rx: 16 },
      patchFile: 'toast_variantA.png',
      cropCompare: '/assets/spotter/crops/b8_s2/toast_compare.jpg',
      variants: [
        { id: 'base', name: '基準', label: '基準型態', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '型態 A', tag: 'Variant A', patchFile: 'toast_variantA.png', cropCompare: '/assets/spotter/crops/b8_s2/toast_compare.jpg', descZh: '金黃法式吐司轉為草莓生乳酪厚片吐司' },
        { id: 'varB', name: '變異 B', label: '型態 B', tag: 'Variant B', patchFile: 'toast_variantB.png', cropCompare: '/assets/spotter/crops/b8_s2/toast_compare_var_b.jpg', descZh: '金黃法式吐司轉為酪梨水波蛋綠意熱烤吐司' },
        { id: 'varC', name: '變異 C', label: '型態 C', tag: 'Variant C', patchFile: 'toast_variantC.png', cropCompare: '/assets/spotter/crops/b8_s2/toast_compare_var_c.jpg', descZh: '金黃法式吐司轉為藍莓香蕉巧克力厚切吐司' }
      ]
    },
    {
      word: 'glass',
      wordZh: '玻璃杯',
      x: 905,
      y: 545,
      radius: 50,
      radiusX: 25,
      radiusY: 50,
      typeZh: '杯型色澤',
      descZh: '露天大理石桌為八角透明冰晶玻璃杯，右圖轉為寶石鈷藍復古杯',
      slot: { x: 870, y: 485, w: 70, h: 120, rx: 16 },
      patchFile: 'glass_variantA.png',
      cropCompare: '/assets/spotter/crops/b8_s2/glass_compare.jpg',
      variants: [
        { id: 'base', name: '基準', label: '基準型態', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '型態 A', tag: 'Variant A', patchFile: 'glass_variantA.png', cropCompare: '/assets/spotter/crops/b8_s2/glass_compare.jpg', descZh: '透明冰晶玻璃杯轉為寶石鈷藍壓紋復古杯' },
        { id: 'varB', name: '變異 B', label: '型態 B', tag: 'Variant B', patchFile: 'glass_variantB.png', cropCompare: '/assets/spotter/crops/b8_s2/glass_compare_var_b.jpg', descZh: '透明冰晶玻璃杯轉為琥珀金光羅紋長飲杯' },
        { id: 'varC', name: '變異 C', label: '型態 C', tag: 'Variant C', patchFile: 'glass_variantC.png', cropCompare: '/assets/spotter/crops/b8_s2/glass_compare_var_c.jpg', descZh: '透明冰晶玻璃杯轉為翡翠晶綠浮雕氣泡水杯' }
      ]
    },
    {
      word: 'peach',
      wordZh: '水蜜桃',
      x: 1075,
      y: 605,
      radius: 40,
      radiusX: 38,
      radiusY: 40,
      typeZh: '蜜桃品種',
      descZh: '右側點心架上為粉嫩鮮採水蜜桃，右圖轉為深紅寶石蜜桃',
      slot: { x: 1027, y: 555, w: 96, h: 100, rx: 16 },
      patchFile: 'peach_variantA.png',
      cropCompare: '/assets/spotter/crops/b8_s2/peach_compare.jpg',
      variants: [
        { id: 'base', name: '基準', label: '基準型態', tag: 'Base' },
        { id: 'varA', name: '變異 A', label: '型態 A', tag: 'Variant A', patchFile: 'peach_variantA.png', cropCompare: '/assets/spotter/crops/b8_s2/peach_compare.jpg', descZh: '粉嫩水蜜桃轉為深紅紫黑寶石蜜桃' },
        { id: 'varB', name: '變異 B', label: '型態 B', tag: 'Variant B', patchFile: 'peach_variantB.png', cropCompare: '/assets/spotter/crops/b8_s2/peach_compare_var_b.jpg', descZh: '粉嫩水蜜桃轉為黃金水蜜桃佐薄荷葉' },
        { id: 'varC', name: '變異 C', label: '型態 C', tag: 'Variant C', patchFile: 'peach_variantC.png', cropCompare: '/assets/spotter/crops/b8_s2/peach_compare_var_c.jpg', descZh: '粉嫩水蜜桃轉為法式焦糖蜜桃酥塔' }
      ]
    }
  ],
  distractors: [
    { word: 'taxi', wordZh: '計程車' },
    { word: 'car', wordZh: '禮車' },
    { word: 'bus', wordZh: '觀光巴士' },
    { word: 'gift', wordZh: '禮品盒' },
    { word: 'box', wordZh: '鞋盒' },
    { word: 'bag', wordZh: '精品提袋' },
    { word: 'chair', wordZh: '咖啡椅' },
    { word: 'table', wordZh: '咖啡圓桌' },
    { word: 'lamp', wordZh: '歐風街燈' },
    { word: 'umbrella', wordZh: '遮陽傘' },
    { word: 'tree', wordZh: '林蔭盆栽' },
    { word: 'cup', wordZh: '骨瓷咖啡杯' },
    { word: 'clock', wordZh: '街頭立鐘' },
    { word: 'book', wordZh: '時尚雜誌' }
  ]
};

// ── 依冊次索引 (覆蓋 1 到 8 冊全系列教材，支援多場景切換) ──
export const ALL_SCENES_BY_BOOK = {
  '1': [BOOK1_CLASSROOM_SCENE, BOOK1_AMSTERDAM_SCENE],
  '2': [BOOK2_PARK_SCENE, BOOK2_KYOTO_SCENE],
  '3': [BOOK3_PARK_SCENE, BOOK3_ALPINE_SCENE],
  '4': [BOOK4_LONDON_SCENE, BOOK4_RIVERSIDE_SCENE],
  '5': [BOOK5_PARIS_SCENE, BOOK5_MONTMARTRE_SCENE],
  '6': [BOOK6_MUSEUM_SCENE, BOOK6_SINGAPORE_SCENE],
  '7': [BOOK7_HARBOR_SCENE, BOOK7_METRO_SCENE],
  '8': [BOOK8_GARDEN_SCENE, BOOK8_AVENUE_SCENE]
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
  BOOK2_KYOTO_SCENE,
  BOOK3_PARK_SCENE,
  BOOK3_ALPINE_SCENE,
  BOOK4_LONDON_SCENE,
  BOOK4_RIVERSIDE_SCENE,
  BOOK5_PARIS_SCENE,
  BOOK5_MONTMARTRE_SCENE,
  BOOK6_MUSEUM_SCENE,
  BOOK6_SINGAPORE_SCENE,
  BOOK7_HARBOR_SCENE,
  BOOK7_METRO_SCENE,
  BOOK8_GARDEN_SCENE,
  BOOK8_AVENUE_SCENE
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

  // 若為 Method A 動態補丁場景，隨機抽取 5 個目標；其餘 3 個目標在右圖不貼補丁，左右兩圖 100% 相同！
  // 若為傳統 Method B 場景，則啟用紙雕圖上的所有相異目標，保證畫面看到的相異處 = 本題有效目標！
  const isDynamic = Boolean(activeScene.isDynamicSlot);
  const countToPick = targetCount || (isDynamic ? 5 : items.length);

  let chosenTargets = items;
  let unchosenTargets = [];
  if (isDynamic && items.length > countToPick) {
    const shuffled = shuffle(items);
    chosenTargets = shuffled.slice(0, countToPick);
    unchosenTargets = items.filter(it => !chosenTargets.some(c => c.word === it.word));
  }

  const activeDifferences = chosenTargets.map(item => {
    // 若該目標有多種變異型態 (varA, varB, varC)，隨機抽取其中一種型態作為本局相異點！
    const availableVars = item.variants ? item.variants.filter(v => v.id !== 'base' && v.patchFile) : [];
    const pickedVar = availableVars.length > 0 ? availableVars[Math.floor(Math.random() * availableVars.length)] : null;

    return {
      id: `diff-${item.word}`,
      word: item.word,
      wordZh: item.wordZh,
      x: item.x,
      y: item.y,
      radius: item.radius || 55,
      radiusX: item.radiusX || item.radius || 55,
      radiusY: item.radiusY || item.radius || 55,
      rotate: item.rotate || 0,
      typeZh: item.typeZh || '樣態差異',
      descZh: pickedVar?.descZh || item.descZh || '',
      slot: item.slot,
      patchFile: pickedVar?.patchFile || item.patchFile,
      variantName: pickedVar?.name || '變異 A',
      variantLabel: pickedVar?.label || ''
    };
  });

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
