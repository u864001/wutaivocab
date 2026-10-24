// ── 《鷹眼神探 • 單字找不同》 3D 立體紙雕課室資料池與動態出題引擎 ──

export const DIFFERENCE_CATEGORIES = [
  { id: 'color', labelZh: '顏色差異', color: 'text-amber-500', icon: '🎨' },
  { id: 'presence', labelZh: '存在差異', color: 'text-emerald-500', icon: '✨' },
  { id: 'style', labelZh: '樣式造型', color: 'text-blue-500', icon: '🔍' },
  { id: 'state', labelZh: '開闔狀態', color: 'text-purple-500', icon: '📖' },
  { id: 'pattern', labelZh: '花紋紋理', color: 'text-rose-500', icon: '📍' }
];

// ── 【Book 1 三年級上學期】彩虹文具與創意課室 (Here We Go Book 1 核心單字) ──
export const BOOK1_CLASSROOM_SCENE = {
  id: 'book1_classroom',
  book: '1',
  grade: 3,
  titleZh: '彩虹文具與創意課室（三年級第 1 冊）',
  titleEn: 'Rainbow Stationery & Creative Classroom (Book 1)',
  descZh: '在立體紙雕課室中，仔細觀察左右兩圖 8 處相異之處！點選後在單字庫配對正確單字！',
  baseImage: '/assets/spotter/book1_base.jpg',
  diffImage: '/assets/spotter/book1_diff.jpg',
  width: 1376,
  height: 768,
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
      descZh: '左圖牆上是紅藍雙色雙肩書包，右圖轉為暖陽黃與翠綠雙色雙肩書包'
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
      descZh: '左圖木桌上是黃色六角木質鉛筆，右圖轉為彩虹糖果條紋鉛筆'
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
      descZh: '左圖桌角是粉紅長方形橡皮擦，右圖轉為薄荷綠三角造型橡皮擦'
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
      descZh: '左圖講台架上是翻開的彩色圖畫英語讀本，右圖轉為闔上的皇家紫精裝故事書'
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
      descZh: '左圖手作几上是半透明金黃學生直尺，右圖轉為蔚藍天藍色直尺'
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
      descZh: '左圖學生桌筆槽中是深海軍藍原子筆，右圖轉為鮮豔亮紅金屬光澤原子筆'
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
      descZh: '左圖課桌上是粉彩條紋拉鍊筆袋，右圖轉為海軍藍白波卡圓點鉛筆盒'
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
      descZh: '左圖窗台邊是粗桿草綠色彩色筆，右圖轉為亮眼霓虹螢光橘彩色筆'
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

// ── 【Book 2 三年級下學期】溫馨派對與感恩卡片 (Here We Go Book 2) ──
export const BOOK2_PARTY_SCENE = {
  id: 'book2_party',
  book: '2',
  grade: 3,
  titleZh: '溫馨派對與感恩卡片（三年級第 2 冊）',
  titleEn: 'Mother\'s Day Party & Cards (Book 2)',
  descZh: '在溫馨的派對客廳中，找出 8 處相異物品！',
  baseImage: '/assets/spotter/book2_base.jpg',
  diffImage: '/assets/spotter/book2_diff.jpg',
  width: 1376,
  height: 768,
  targetItems: [
    { word: 'balloon', wordZh: '氣球', x: 809, y: 99, radius: 50, radiusX: 50, radiusY: 50, typeZh: '顏色樣式', descZh: '漂浮氣球樣式變更' },
    { word: 'card', wordZh: '卡片', x: 881, y: 179, radius: 45, radiusX: 45, radiusY: 45, typeZh: '封面圖樣', descZh: '感恩卡片樣式變更' },
    { word: 'cake', wordZh: '蛋糕', x: 596, y: 492, radius: 55, radiusX: 55, radiusY: 48, typeZh: '口味裝飾', descZh: '派對蛋糕裝飾變更' },
    { word: 'candle', wordZh: '蠟燭', x: 744, y: 484, radius: 70, radiusX: 66, radiusY: 70, typeZh: '燭光色彩', descZh: '蠟燭顏色變更' },
    { word: 'flower', wordZh: '花朵', x: 152, y: 412, radius: 74, radiusX: 74, radiusY: 54, typeZh: '花朵品種', descZh: '花瓶花卉變更' },
    { word: 'gift', wordZh: '禮物', x: 1112, y: 572, radius: 55, radiusX: 55, radiusY: 50, typeZh: '包裝緞帶', descZh: '禮物盒顏色變更' },
    { word: 'candy', wordZh: '糖果', x: 436, y: 652, radius: 62, radiusX: 62, radiusY: 62, typeZh: '糖果風味', descZh: '糖果盤點心變更' },
    { word: 'party', wordZh: '派對帽', x: 1256, y: 396, radius: 50, radiusX: 50, radiusY: 45, typeZh: '節慶裝飾', descZh: '派對帽條紋變更' }
  ],
  distractors: [
    { word: 'family', wordZh: '家人' },
    { word: 'mother', wordZh: '媽媽' },
    { word: 'friend', wordZh: '朋友' },
    { word: 'happy', wordZh: '快樂' }
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
    { word: 'umbrella', wordZh: '遮陽傘', x: 140, y: 428, radius: 140, radiusX: 140, radiusY: 86, typeZh: '傘面花色', descZh: '左圖草地是紅白條紋遮陽傘，右圖轉為藍白海洋條紋傘' },
    { word: 'kite', wordZh: '風箏', x: 372, y: 124, radius: 130, radiusX: 130, radiusY: 120, typeZh: '風箏圖樣', descZh: '左圖晴空是幾何條紋風箏，右圖轉為菱形純色彩繪風箏' },
    { word: 'hamburger', wordZh: '漢堡', x: 472, y: 456, radius: 66, radiusX: 66, radiusY: 50, typeZh: '夾心配料', descZh: '左圖長椅上是起司牛肉堡，右圖轉為脆皮炸雞雙層堡' },
    { word: 'hot dog', wordZh: '熱狗', x: 784, y: 332, radius: 74, radiusX: 74, radiusY: 62, typeZh: '醬料樣態', descZh: '左圖木棧道熱狗淋滿黃芥末醬，右圖淋滿番茄紅醬' },
    { word: 'sun', wordZh: '太陽', x: 792, y: 92, radius: 110, radiusX: 110, radiusY: 70, typeZh: '光芒樣式', descZh: '左圖太陽散發金黃光芒，右圖轉為燦爛多芒晨曦' },
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
    { word: 'bed', wordZh: '床鋪', x: 380, y: 168, radius: 45, radiusX: 45, radiusY: 45, typeZh: '床單花紋', descZh: '左圖二樓單人床是暖黃格紋被套，右圖轉為深藍星空被套' },
    { word: 'hat', wordZh: '帽子', x: 388, y: 304, radius: 65, radiusX: 65, radiusY: 45, typeZh: '帽款色彩', descZh: '左圖衣帽架上是黑圓頂高帽，右圖轉為復古棕色獵鹿帽' },
    { word: 'computer', wordZh: '電腦', x: 288, y: 460, radius: 55, radiusX: 55, radiusY: 45, typeZh: '螢幕顯示', descZh: '左圖書桌上是筆記型電腦螢幕發光，右圖轉為簡約銀灰桌機螢幕' },
    { word: 'bag', wordZh: '背包', x: 288, y: 570, radius: 55, radiusX: 55, radiusY: 45, typeZh: '提包樣態', descZh: '左圖玄關地毯旁是休閒雙肩包，右圖轉為焦糖棕真皮手提公事包' },
    { word: 'book', wordZh: '書本', x: 636, y: 596, radius: 120, radiusX: 120, radiusY: 85, typeZh: '書本封皮', descZh: '左圖茶几上是紅色精裝讀本，右圖轉為翠綠圖畫書' },
    { word: 'bus', wordZh: '公車', x: 824, y: 240, radius: 58, radiusX: 58, radiusY: 45, typeZh: '公車外觀', descZh: '左圖街道是經典英倫紅雙層巴士，右圖車身轉為皇家藍配色' },
    { word: 'sofa', wordZh: '沙發', x: 1096, y: 616, radius: 58, radiusX: 58, radiusY: 58, typeZh: '沙發布料', descZh: '左圖客廳沙發是溫馨米色布面，右圖轉為墨綠復古絨布沙發' },
    { word: 'clock', wordZh: '時鐘', x: 1176, y: 164, radius: 45, radiusX: 45, radiusY: 45, typeZh: '鐘樓時鐘', descZh: '左圖遠方鐘樓指標為整點，右圖指針與鐘面色彩轉變' }
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
    { word: 'lion', wordZh: '守護石獅', x: 112, y: 152, radius: 35, radiusX: 35, radiusY: 35, typeZh: '雕像姿態', descZh: '左圖宮殿台階旁是端坐石獅，右圖轉為威嚴昂首姿態' },
    { word: 'koala', wordZh: '無尾熊', x: 180, y: 200, radius: 35, radiusX: 35, radiusY: 35, typeZh: '無尾熊樣態', descZh: '左圖大樹上是憨厚灰毛無尾熊，右圖轉為抱著桉樹嫩葉' },
    { word: 'bread', wordZh: '麵包', x: 444, y: 540, radius: 105, radiusX: 94, radiusY: 105, typeZh: '麵包種類', descZh: '左圖長椅邊是法國金黃長棍麵包，右圖轉為螺旋牛角可頌麵包' },
    { word: 'milk', wordZh: '牛奶', x: 528, y: 252, radius: 110, radiusX: 95, radiusY: 110, typeZh: '瓶身圖樣', descZh: '左圖石牆上是復古透明玻璃牛奶瓶，右圖轉為藍白條紋紙盒鮮奶' },
    { word: 'football', wordZh: '足球', x: 752, y: 584, radius: 74, radiusX: 58, radiusY: 74, typeZh: '足球圖樣', descZh: '左圖石板廣場上是黑白經典足球，右圖轉為藍金世界杯紀念足球' },
    { word: 'painting', wordZh: '畫作', x: 1024, y: 420, radius: 45, radiusX: 45, radiusY: 45, typeZh: '油畫畫面', descZh: '左圖畫架上是蒙娜麗莎神秘微笑，右圖轉為塞納河畔晨曦風景油畫' },
    { word: 'palette', wordZh: '調色盤', x: 1136, y: 608, radius: 58, radiusX: 58, radiusY: 58, typeZh: '顏料色彩', descZh: '左圖調色几上是彩虹七彩油畫顏料，右圖轉為大地暖金色系顏料' },
    { word: 'camera', wordZh: '相機', x: 1264, y: 488, radius: 82, radiusX: 82, radiusY: 82, typeZh: '相機款式', descZh: '左圖路燈柱上懸掛著復古黑色單眼相機，右圖轉為銀紅雙色拍立得相機' }
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
    { word: 'mask', wordZh: '口罩', x: 104, y: 424, radius: 58, radiusX: 58, radiusY: 50, typeZh: '圖樣樣式', descZh: '左圖防疫站是淺藍醫用口罩，右圖轉為鮮黃卡通笑臉口罩' },
    { word: 'elephant', wordZh: '大象', x: 276, y: 300, radius: 40, radiusX: 40, radiusY: 40, typeZh: '裝飾樣式', descZh: '左圖野生非洲展區是素色灰象，右圖身披彩色刺繡節慶鞍毯' },
    { word: 'rocket', wordZh: '火箭', x: 416, y: 192, radius: 115, radiusX: 115, radiusY: 72, typeZh: '航天機型', descZh: '左圖穹頂懸掛經典紅白火箭，右圖轉為藍銀太空穿梭機' },
    { word: 'noodles', wordZh: '麵食', x: 480, y: 456, radius: 74, radiusX: 74, radiusY: 66, typeZh: '餐點品項', descZh: '左圖咖啡几上是日式拉麵碗，右圖轉為經典番茄肉醬義大利麵' },
    { word: 'sunglasses', wordZh: '墨鏡', x: 656, y: 388, radius: 54, radiusX: 50, radiusY: 54, typeZh: '墨鏡造型', descZh: '左圖中央展台是黑色飛行員墨鏡，右圖轉為復古紅色愛心墨鏡' },
    { word: 'salad', wordZh: '沙拉', x: 944, y: 496, radius: 58, radiusX: 58, radiusY: 45, typeZh: '沙拉風味', descZh: '左圖長椅上是清爽綠生菜沙拉，右圖轉為草莓鮮果水果沙拉' },
    { word: 'dinosaur', wordZh: '恐龍', x: 996, y: 208, radius: 135, radiusX: 135, radiusY: 90, typeZh: '化石標本', descZh: '左圖夾層展廳是霸王龍骨骼化石，右圖轉為具頭盾雙角的三角龍化石' },
    { word: 'backpack', wordZh: '背包', x: 1156, y: 588, radius: 86, radiusX: 70, radiusY: 86, typeZh: '背包配色', descZh: '左圖立柱掛著藍橘撞色背包，右圖轉為深紫螢光綠探險背包' }
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
    { word: 'airplane', wordZh: '飛機', x: 336, y: 108, radius: 145, radiusX: 145, radiusY: 48, typeZh: '機型樣式', descZh: '左圖高空是經典白藍客機，右圖轉為金橘色超音速噴射機' },
    { word: 'flag', wordZh: '國旗', x: 1140, y: 64, radius: 52, radiusX: 52, radiusY: 42, typeZh: '旗幟樣式', descZh: '左圖燈塔頂端是紅白藍國家旗幟，右圖轉為金黃海軍藍燕尾信號旗' },
    { word: 'train', wordZh: '火車', x: 792, y: 260, radius: 175, radiusX: 175, radiusY: 45, typeZh: '列車型式', descZh: '左圖石拱橋上是復古蒸氣火車，右圖轉為流線型銀紅高速列車（全面覆蓋火車頭與整列車廂）' },
    { word: 'ship', wordZh: '輪船', x: 440, y: 390, radius: 140, radiusX: 140, radiusY: 105, typeZh: '船隻種類', descZh: '左圖港灣中是純白豪華遊輪，右圖轉為雙桅木造復古風帆帆船' },
    { word: 'postcard', wordZh: '明信片', x: 172, y: 548, radius: 88, radiusX: 88, radiusY: 52, typeZh: '明信片圖樣', descZh: '左圖郵筒旁是燈塔海景明信片，右圖轉為熱帶海灘愛心郵戳明信片（精確對齊紅色郵筒與卡片）' },
    { word: 'map', wordZh: '地圖', x: 630, y: 585, radius: 95, radiusX: 95, radiusY: 65, typeZh: '地圖形式', descZh: '左圖欄杆上是平鋪彩色世界地圖，右圖轉為復古羊皮紙藏寶圖（精確對齊觀景台平台，絕無偏移至水面）' },
    { word: 'suitcase', wordZh: '行李箱', x: 900, y: 570, radius: 85, radiusX: 85, radiusY: 68, typeZh: '箱體造型', descZh: '左圖長椅旁是復古真皮皮箱，右圖轉為亮綠藍色硬殼四輪行李箱' },
    { word: 'gift', wordZh: '禮物', x: 1272, y: 532, radius: 75, radiusX: 75, radiusY: 72, typeZh: '包裝緞帶', descZh: '左圖售票亭是深藍金緞帶禮盒，右圖轉為緋紅翠綠緞帶禮盒' }
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
    { word: 'swan', wordZh: '天鵝', x: 295, y: 485, radius: 72, radiusX: 75, radiusY: 62, typeZh: '羽色品種', descZh: '左圖池中是優雅純白白天鵝，右圖轉為紅喙純黑天鵝' },
    { word: 'spade', wordZh: '鏟子', x: 138, y: 635, radius: 75, radiusX: 50, radiusY: 140, typeZh: '工具配色', descZh: '左圖花圃泥土插著銀柄鏟子，右圖轉為亮金黃色園藝鏟' },
    { word: 'drum', wordZh: '鼓', x: 288, y: 272, radius: 66, radiusX: 66, radiusY: 50, typeZh: '樂器外觀', descZh: '左圖涼亭舞台是紅金行進鼓，右圖轉為皇家深藍小鼓' },
    { word: 'pie', wordZh: '派', x: 704, y: 528, radius: 98, radiusX: 98, radiusY: 48, typeZh: '點心風味', descZh: '左圖石台茶几上是酥皮水果派，右圖轉為深紫黑莓派' },
    { word: 'rose', wordZh: '玫瑰', x: 700, y: 272, radius: 70, radiusX: 70, radiusY: 66, typeZh: '花卉色彩', descZh: '左圖拱門是鮮紅玫瑰花叢，右圖轉為金黃玫瑰花叢' },
    { word: 'coat', wordZh: '大衣', x: 952, y: 340, radius: 85, radiusX: 75, radiusY: 95, typeZh: '服飾樣式', descZh: '左圖長椅上是海軍藍風衣，右圖轉為暖駝色牛角扣大衣' },
    { word: 'flute', wordZh: '長笛', x: 980, y: 515, radius: 80, radiusX: 115, radiusY: 35, typeZh: '樂器光澤', descZh: '左圖樂譜架上是銀白長笛，右圖轉為玫瑰金長笛' },
    { word: 'dress', wordZh: '洋裝', x: 1256, y: 356, radius: 118, radiusX: 106, radiusY: 130, typeZh: '禮服色彩', descZh: '左圖人台上是淡紫碎花洋裝，右圖轉為祖母綠綢緞晚宴洋裝' }
  ],
  distractors: [
    { word: 'violin', wordZh: '小提琴' },
    { word: 'piano', wordZh: '鋼琴' },
    { word: 'tree', wordZh: '大樹' },
    { word: 'bench', wordZh: '長椅' }
  ]
};

// ── 依冊次索引 (覆蓋 1 到 8 冊全系列教材) ──
export const SPOTTER_SCENES_BY_BOOK = {
  '1': BOOK1_CLASSROOM_SCENE,
  '2': BOOK2_PARTY_SCENE,
  '3': BOOK3_PARK_SCENE,
  '4': BOOK4_LONDON_SCENE,
  '5': BOOK5_PARIS_SCENE,
  '6': BOOK6_MUSEUM_SCENE,
  '7': BOOK7_HARBOR_SCENE,
  '8': BOOK8_GARDEN_SCENE
};

// 全域場景清單（依冊次 1～8 排序）
export const SPOTTER_SCENES = [
  BOOK1_CLASSROOM_SCENE,
  BOOK2_PARTY_SCENE,
  BOOK3_PARK_SCENE,
  BOOK4_LONDON_SCENE,
  BOOK5_PARIS_SCENE,
  BOOK6_MUSEUM_SCENE,
  BOOK7_HARBOR_SCENE,
  BOOK8_GARDEN_SCENE
];

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
