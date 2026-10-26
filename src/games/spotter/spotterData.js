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

// ── 依冊次索引 (覆蓋 1 到 8 冊全系列教材，支援多場景切換) ──
export const ALL_SCENES_BY_BOOK = {
  '1': [BOOK1_CLASSROOM_SCENE, BOOK1_AMSTERDAM_SCENE],
  '2': [BOOK2_PARK_SCENE, BOOK2_KYOTO_SCENE],
  '3': [BOOK3_PARK_SCENE, BOOK3_ALPINE_SCENE],
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
  BOOK2_KYOTO_SCENE,
  BOOK3_PARK_SCENE,
  BOOK3_ALPINE_SCENE,
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
