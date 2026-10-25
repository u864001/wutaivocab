const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const CALIBRATED_BOOKS = {
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
      { word: 'turtle', wordZh: '烏龜', x: 815, y: 530, radius: 50, radiusX: 50, radiusY: 45, typeZh: '甲殼花紋', descZh: '左圖池塘岩石是青綠小龜，右圖轉為金黃暖橘花紋烏龜' },
      { word: 'frog', wordZh: '青蛙', x: 1115, y: 555, radius: 55, radiusX: 55, radiusY: 50, typeZh: '飾品裝飾', descZh: '左圖荷葉上是普通綠青蛙，右圖頭戴閃耀金皇冠轉為青蛙王子' },
      { word: 'kite', wordZh: '風箏', x: 815, y: 115, radius: 85, radiusX: 85, radiusY: 85, typeZh: '風箏圖樣', descZh: '左圖晴空是幾何條紋菱形風箏，右圖轉為彩虹蝴蝶彩繪風箏' },
      { word: 'bird', wordZh: '小鳥', x: 1245, y: 395, radius: 50, radiusX: 50, radiusY: 45, typeZh: '數量品種', descZh: '左圖木柵欄上棲息2隻小鳥，右圖右側新增第3隻粉紅小鳥' }
    ],
    distractors: [
      { word: 'fish', wordZh: '小魚' },
      { word: 'bear', wordZh: '玩具熊' },
      { word: 'doll', wordZh: '洋娃娃' },
      { word: 'yo-yo', wordZh: '溜溜球' }
    ]
  },

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
      { word: 'sun', wordZh: '太陽', x: 690, y: 100, radius: 80, radiusX: 80, radiusY: 75, typeZh: '光芒樣式', descZh: '左圖太陽散發金黃光芒，右圖轉為燦爛多芒晨曦（已校正置中於太陽本體）' },
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
      { word: 'bus', wordZh: '公車', x: 210, y: 665, radius: 130, radiusX: 110, radiusY: 130, typeZh: '公車外觀', descZh: '左圖街道是經典英倫紅雙層巴士，右圖車身轉為皇家藍配色（已全域擴大包覆整輛巴士）' },
      { word: 'bed', wordZh: '床鋪', x: 275, y: 395, radius: 110, radiusX: 110, radiusY: 65, typeZh: '床單花紋', descZh: '左圖二樓單人床是暖黃格紋被套，右圖轉為深藍星空被套（已修正移至二樓床鋪）' },
      { word: 'hat', wordZh: '帽子', x: 275, y: 210, radius: 48, radiusX: 48, radiusY: 45, typeZh: '帽款色彩', descZh: '左圖二樓衣帽架上是黑圓頂禮帽，右圖轉為黃色緞帶草帽（已修正移至二樓帽架）' },
      { word: 'computer', wordZh: '電腦', x: 605, y: 310, radius: 55, radiusX: 55, radiusY: 45, typeZh: '螢幕顯示', descZh: '左圖二樓書桌上是筆記型電腦螢幕發光，右圖轉為亮粉色外殼（已校準對齊書桌筆電）' },
      { word: 'sofa', wordZh: '沙發', x: 435, y: 765, radius: 85, radiusX: 85, radiusY: 75, typeZh: '沙發布料', descZh: '左圖客廳沙發是溫馨米色布面，右圖轉為墨綠復古絨布沙發（已校準對齊客廳主沙發）' },
      { word: 'book', wordZh: '書本', x: 535, y: 775, radius: 50, radiusX: 50, radiusY: 35, typeZh: '書本封皮', descZh: '左圖茶几上是翻開花草繪本，右圖轉為厚重精裝書（已校準對齊茶几書本）' },
      { word: 'bag', wordZh: '背包', x: 792, y: 792, radius: 50, radiusX: 50, radiusY: 50, typeZh: '提包樣態', descZh: '左圖玄關地毯旁是紅藍學生雙肩書包，右圖轉為草綠色休閒背包（已校準對齊玄關背包）' },
      { word: 'clock', wordZh: '時鐘', x: 855, y: 210, radius: 42, radiusX: 42, radiusY: 42, typeZh: '鐘樓時鐘', descZh: '左圖遠方大笨鐘面指標為整點，右圖指針與鐘面色彩轉變' }
    ],
    distractors: [
      { word: 'lamp', wordZh: '檯燈' },
      { word: 'table', wordZh: '桌子' },
      { word: 'chair', wordZh: '椅子' },
      { word: 'window', wordZh: '窗戶' }
    ]
  },

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
      { word: 'koala', wordZh: '無尾熊', x: 88, y: 275, radius: 65, radiusX: 65, radiusY: 65, typeZh: '無尾熊樣態', descZh: '左圖左側大樹幹趴著灰毛無尾熊，右圖耳朵戴著金黃花朵（已校正移至左側樹上無尾熊）' },
      { word: 'lion', wordZh: '守護石獅', x: 385, y: 345, radius: 80, radiusX: 80, radiusY: 75, typeZh: '雕像姿態', descZh: '左圖宮殿台階旁是端坐石獅，右圖轉為暗銅色且頭戴金桂冠（已校正移至台階石獅）' },
      { word: 'milk', wordZh: '牛奶', x: 230, y: 725, radius: 60, radiusX: 45, radiusY: 60, typeZh: '瓶身圖樣', descZh: '左圖前方石牆上是透明玻璃牛奶瓶，右圖轉為粉紅草莓鮮奶瓶（已校正移至矮牆牛奶）' },
      { word: 'bread', wordZh: '麵包', x: 300, y: 700, radius: 65, radiusX: 65, radiusY: 50, typeZh: '麵包種類', descZh: '左圖紙袋裝有法國金黃長棍麵包，右圖籃中轉為牛角可頌麵包' },
      { word: 'football', wordZh: '足球', x: 550, y: 755, radius: 55, radiusX: 55, radiusY: 55, typeZh: '足球圖樣', descZh: '左圖廣場石板上是經典黑白足球，右圖轉為紅金獎盃足球' },
      { word: 'painting', wordZh: '畫作', x: 750, y: 595, radius: 70, radiusX: 65, radiusY: 70, typeZh: '油畫畫面', descZh: '左圖畫架上是蒙娜麗莎神秘微笑，右圖蒙娜麗莎俏皮戴上黑色墨鏡' },
      { word: 'cake', wordZh: '蛋糕', x: 828, y: 790, radius: 50, radiusX: 50, radiusY: 45, typeZh: '點心甜點', descZh: '左圖圓木凳上是白奶油草莓切片蛋糕，右圖轉為黑森林櫻桃巧克力蛋糕（已更正為蛋糕）' },
      { word: 'camera', wordZh: '相機', x: 915, y: 635, radius: 65, radiusX: 65, radiusY: 55, typeZh: '相機款式', descZh: '左圖路燈柱上懸掛著黑色單眼相機，右圖轉為青藍雙色拍立得相機' }
    ],
    distractors: [
      { word: 'museum', wordZh: '博物館' },
      { word: 'statue', wordZh: '雕像' },
      { word: 'pyramid', wordZh: '金字塔' },
      { word: 'river', wordZh: '河流' }
    ]
  },

  '6': {
    varName: 'BOOK6_MUSEUM_SCENE',
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
    items: [
      { word: 'mask', wordZh: '口罩', x: 88, y: 550, radius: 55, radiusX: 55, radiusY: 45, typeZh: '圖樣樣式', descZh: '左圖接待台上方層架是淺藍醫用口罩，右圖轉為鮮黃笑臉口罩' },
      { word: 'rocket', wordZh: '火箭', x: 380, y: 220, radius: 115, radiusX: 115, radiusY: 75, typeZh: '航天機型', descZh: '左圖穹頂懸掛經典紅白火箭，右圖轉為藍銀太空穿梭機' },
      { word: 'noodles', wordZh: '麵食', x: 345, y: 585, radius: 60, radiusX: 60, radiusY: 50, typeZh: '餐點品項', descZh: '左圖圓邊几上是熱氣騰騰的拉麵碗，右圖轉為番茄肉醬義大利麵' },
      { word: 'elephant', wordZh: '大象', x: 500, y: 520, radius: 90, radiusX: 90, radiusY: 70, typeZh: '裝飾樣式', descZh: '左圖中央自然展區是非洲灰象，右圖身披彩色刺繡節慶鞍毯（已校正對齊中央大象）' },
      { word: 'sunglasses', wordZh: '墨鏡', x: 500, y: 760, radius: 75, radiusX: 75, radiusY: 45, typeZh: '墨鏡造型', descZh: '左圖前方紅絲絨展台上是黑色飛行員墨鏡，右圖轉為紅色愛心造型墨鏡（已校正移至展台墨鏡）' },
      { word: 'salad', wordZh: '沙拉', x: 685, y: 645, radius: 60, radiusX: 60, radiusY: 45, typeZh: '沙拉風味', descZh: '左圖休息長椅上是木碗生菜沙拉，右圖轉為繽紛水果沙拉' },
      { word: 'dinosaur', wordZh: '恐龍', x: 750, y: 260, radius: 125, radiusX: 125, radiusY: 85, typeZh: '化石標本', descZh: '左圖二樓夾層是霸王龍骨骼化石，右圖轉為三角龍骨骼化石' },
      { word: 'backpack', wordZh: '背包', x: 835, y: 765, radius: 65, radiusX: 55, radiusY: 65, typeZh: '背包配色', descZh: '左圖圍欄立柱掛著藍橘撞色背包，右圖轉為紫綠雙色探險背包' }
    ],
    distractors: [
      { word: 'telescope', wordZh: '望遠鏡' },
      { word: 'planet', wordZh: '行星' },
      { word: 'robot', wordZh: '機器人' },
      { word: 'fossil', wordZh: '化石' }
    ]
  },

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
      { word: 'map', wordZh: '地圖', x: 640, y: 630, radius: 140, radiusX: 140, radiusY: 125, typeZh: '地圖形式', descZh: '左圖欄杆上是平鋪彩色世界地圖，右圖轉為復古羊皮紙藏寶圖（已全域擴大包覆整張地圖）' },
      { word: 'suitcase', wordZh: '行李箱', x: 925, y: 635, radius: 125, radiusX: 120, radiusY: 125, typeZh: '箱體造型', descZh: '左圖長椅旁是復古真皮皮箱，右圖轉為亮綠藍色硬殼四輪行李箱（已擴大包覆且與地圖獨立零重疊）' },
      { word: 'gift', wordZh: '禮物', x: 1272, y: 532, radius: 75, radiusX: 75, radiusY: 72, typeZh: '包裝緞帶', descZh: '左圖售票亭是深藍金緞帶禮盒，右圖轉為緋紅翠綠緞帶禮盒' }
    ],
    distractors: [
      { word: 'passport', wordZh: '護照' },
      { word: 'ticket', wordZh: '車票' },
      { word: 'taxi', wordZh: '計程車' },
      { word: 'hotel', wordZh: '旅館' }
    ]
  },

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
      { word: 'swan', wordZh: '天鵝', x: 250, y: 580, radius: 95, radiusX: 95, radiusY: 90, typeZh: '羽色品種', descZh: '左圖池中是優雅純白白天鵝，右圖轉為紅喙純黑天鵝（已擴大包覆天鵝頭頸、羽翼與尾部）' },
      { word: 'spade', wordZh: '鏟子', x: 145, y: 610, radius: 160, radiusX: 65, radiusY: 160, typeZh: '工具配色', descZh: '左圖花圃泥土插著銀柄鏟子，右圖轉為金黃園藝鏟（已往右上移，完整涵蓋頂端手柄至入土鏟刃）' },
      { word: 'drum', wordZh: '鼓', x: 288, y: 272, radius: 66, radiusX: 66, radiusY: 50, typeZh: '樂器外觀', descZh: '左圖涼亭舞台是紅金行進鼓，右圖轉為皇家深藍小鼓' },
      { word: 'pie', wordZh: '派', x: 704, y: 528, radius: 98, radiusX: 98, radiusY: 48, typeZh: '點心風味', descZh: '左圖石台茶几上是酥皮水果派，右圖轉為深紫黑莓派' },
      { word: 'rose', wordZh: '玫瑰', x: 700, y: 272, radius: 70, radiusX: 70, radiusY: 66, typeZh: '花卉色彩', descZh: '左圖拱門是鮮紅玫瑰花叢，右圖轉為金黃玫瑰花叢' },
      { word: 'coat', wordZh: '大衣', x: 952, y: 310, radius: 105, radiusX: 80, radiusY: 105, typeZh: '服飾樣式', descZh: '左圖長椅上是海軍藍風衣，右圖轉為暖駝色牛角扣大衣（已往上延伸完整包覆大衣領口）' },
      { word: 'flute', wordZh: '長笛', x: 980, y: 515, radius: 115, radiusX: 115, radiusY: 35, typeZh: '樂器光澤', descZh: '左圖樂譜架上是銀白長笛，右圖轉為玫瑰金長笛' },
      { word: 'dress', wordZh: '洋裝', x: 1256, y: 356, radius: 130, radiusX: 106, radiusY: 130, typeZh: '禮服色彩', descZh: '左圖人台上是淡紫碎花洋裝，右圖轉為祖母綠綢緞晚宴洋裝' }
    ],
    distractors: [
      { word: 'violin', wordZh: '小提琴' },
      { word: 'piano', wordZh: '鋼琴' },
      { word: 'tree', wordZh: '大樹' },
      { word: 'bench', wordZh: '長椅' }
    ]
  }
};

async function generateCropsAndSideBySide() {
  const publicDir = path.resolve('public/assets/spotter');
  const colors = ['#f43f5e', '#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#eab308', '#14b8a6', '#ec4899'];

  for (const b of ['2', '3', '4', '5', '6', '7', '8']) {
    const config = CALIBRATED_BOOKS[b];
    const baseFile = path.join(publicDir, `book${b}_base.jpg`);
    const diffFile = path.join(publicDir, `book${b}_diff.jpg`);

    const cropsDir = path.join(publicDir, 'crops', `b${b}_s1`);
    if (!fs.existsSync(cropsDir)) {
      fs.mkdirSync(cropsDir, { recursive: true });
    }

    const meta = await sharp(baseFile).metadata();
    const w = meta.width;
    const h = meta.height;

    console.log(`Processing Book ${b} (${w}x${h})...`);

    // 1. Generate 650x276 comparison crops for each item
    for (const item of config.items) {
      const rx = item.radiusX || item.radius;
      const ry = item.radiusY || item.radius;

      // Crop width & height in source image space (aspect ~ 320/276 = 1.16)
      const boxW = Math.max(180, Math.round(rx * 2.3));
      const boxH = Math.max(155, Math.round(boxW * (276 / 320)));

      const cropLeft = Math.max(0, Math.min(w - boxW, Math.round(item.x - boxW / 2)));
      const cropTop = Math.max(0, Math.min(h - boxH, Math.round(item.y - boxH / 2)));
      const actualW = Math.min(w - cropLeft, boxW);
      const actualH = Math.min(h - cropTop, boxH);

      const halfW = 320;
      const cardH = 276;
      const dividerW = 10;
      const totalCardW = halfW * 2 + dividerW; // 650

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

      // Safe file name (replace spaces with underscore, e.g. hot dog -> hot_dog)
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

  console.log('\nAll crops and side-by-side comparison boxes generated successfully!');
}

generateCropsAndSideBySide().catch(console.error);
