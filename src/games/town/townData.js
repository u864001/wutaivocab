/**
 * 霧臺英語宇宙 2.0 - 霧臺小鎮 (Wutai Town) 全域資料庫
 * 整合現有 396 顆課綱單字，構建 9 大生活地標、多樣化每日輪替對話樹、外師巡迴彩蛋、道具商店與每日任務！
 */

// ── 0. 日期與隨機種子運算工具 ──
export const getTodayDateStr = () => {
  return new Date().toISOString().slice(0, 10);
};

export const getDaySeed = (dateStr = getTodayDateStr()) => {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
  }
  return hash;
};

// 32-bit 高散列整數隨機運算器 (保證每日多樣化輪替與非重複地點)
export const hashInt = (x) => {
  x = ((x >>> 16) ^ x) * 0x45d9f3b;
  x = ((x >>> 16) ^ x) * 0x45d9f3b;
  x = (x >>> 16) ^ x;
  return x >>> 0;
};

// ── 0.5 霧臺小鎮全景地圖常數與 50 套對話樹匯入 ──
import { DIALOGUE_VARIANTS, VISITING_TEACHER_VARIANTS } from './townDialogueData.js';
export { DIALOGUE_VARIANTS, VISITING_TEACHER_VARIANTS };

export const TOWN_MAP_PANORAMA_IMG = '/assets/town/town_map_panorama.webp';

// ── 1. 霧臺小鎮 9 大社區地標清單 ──
export const TOWN_LOCATIONS = [
  {
    id: 'school',
    nameZh: '霧臺國小',
    nameEn: 'Wutai Elementary School',
    npcName: '校長 (Principal)',
    npcRole: '任務公佈欄與課堂生活',
    npcAvatar: '🏫',
    mapArea: { left: 32, top: 33, width: 29, height: 26 },
    mapCoords: { x: 46.5, y: 46 },
    standeeSide: 'left',
    voiceProfile: { gender: 'male', pitch: 0.78, rate: 0.82, accent: 'en-GB' }, // 沉穩智慧的英國紳士腔老校長
    bgGradient: 'from-blue-600/20 via-indigo-500/20 to-teal-500/20',
    borderColor: 'border-blue-400 dark:border-blue-600',
    iconColor: 'text-blue-500',
    description: '公佈欄領取每日探索任務，分享學校英語與課堂作息。',
    dailyThemes: [
      '今日校園公告：晨光英語與操場體育活動',
      '今日校園公告：準備探險作業本與鉛筆盒',
      '今日校園公告：大武山清新晨間活力'
    ],
    bgImage: '/assets/town/bg_school.webp',
    npcPortrait: '/assets/town/npc_principal.webp',
    hasShop: false,
    hasQuests: true
  },
  {
    id: 'bookstore',
    nameZh: '雲豹書局',
    nameEn: 'Cloud Leopard Bookstore',
    npcName: '雲豹店長 (Manager Leopard)',
    npcRole: '文具專賣與冒險筆記',
    npcAvatar: '🐆',
    mapArea: { left: 31, top: 7, width: 18, height: 23 },
    mapCoords: { x: 40, y: 18.5 },
    standeeSide: 'left',
    voiceProfile: { gender: 'male', pitch: 0.96, rate: 0.92, accent: 'en-US' }, // 熱情活潑清亮書卷氣的雲豹男店長
    bgGradient: 'from-amber-500/20 via-orange-500/20 to-yellow-500/20',
    borderColor: 'border-amber-400 dark:border-amber-600',
    iconColor: 'text-amber-500',
    description: '挑選鉛筆、橡皮擦與探險作業本，練習詢價購物。',
    dailyThemes: [
      '今日文具特輯：開學必備鉛筆、直尺與橡皮擦',
      '今日書局特輯：大武山山豬與飛鼠冒險繪本',
      '今日彩繪特輯：美術色彩筆與彩繪筆記本'
    ],
    bgImage: '/assets/town/bg_bookstore.webp',
    npcPortrait: '/assets/town/npc_bookstore.webp',
    hasShop: true,
    hasQuests: false
  },
  {
    id: 'supermarket',
    nameZh: '黑熊超市',
    nameEn: 'Black Bear Supermarket',
    npcName: '黑熊店員 (Clerk Bear)',
    npcRole: '美味點心與新鮮蔬果',
    npcAvatar: '🐻',
    mapArea: { left: 53, top: 15, width: 22, height: 21 },
    mapCoords: { x: 64, y: 25.5 },
    standeeSide: 'left',
    voiceProfile: { gender: 'male', pitch: 0.60, rate: 0.78, accent: 'en-US' }, // 極渾厚低沉憨厚的大黑熊男音
    bgGradient: 'from-emerald-500/20 via-green-500/20 to-teal-500/20',
    borderColor: 'border-emerald-400 dark:border-emerald-600',
    iconColor: 'text-emerald-500',
    description: '採買三明治、水果與飲料，餓了渴了快來補給！',
    dailyThemes: [
      '今日美食特選：香脆蘋果與特濃起司披薩',
      '今日早餐特供：純淨鮮牛奶與酸甜柳橙汁',
      '今日野餐特刊：黃金香蕉與山林探險補給'
    ],
    bgImage: '/assets/town/bg_supermarket.webp',
    npcPortrait: '/assets/town/npc_supermarket.webp',
    hasShop: true,
    hasQuests: false
  },
  {
    id: 'park',
    nameZh: '飛鼠公園',
    nameEn: 'Flying Squirrel Park',
    npcName: '飛鼠長老 (Elder Squirrel)',
    npcRole: '大自然生態與四季天氣',
    npcAvatar: '🐿️',
    mapArea: { left: 72, top: 26, width: 26, height: 26 },
    mapCoords: { x: 85, y: 39 },
    standeeSide: 'left',
    voiceProfile: { gender: 'male', pitch: 1.15, rate: 0.95, accent: 'en-US' }, // 輕快靈動有精神的飛鼠長老音
    bgGradient: 'from-teal-500/20 via-cyan-500/20 to-emerald-500/20',
    borderColor: 'border-teal-400 dark:border-teal-600',
    iconColor: 'text-teal-500',
    description: '微風吹拂的草地，觀察蝴蝶花朵，聊聊今天的天氣四季。',
    dailyThemes: [
      '今日大自然觀察：晴空萬里與純白百合盛開',
      '今日大自然觀察：涼爽山風與草地慢跑時光',
      '今日大自然觀察：大武山四季風景與野生動物'
    ],
    bgImage: '/assets/town/bg_park.webp',
    npcPortrait: '/assets/town/npc_park.webp',
    hasShop: false,
    hasQuests: false
  },
  {
    id: 'station',
    nameZh: '霧臺客運站',
    nameEn: 'Wutai Bus Station',
    npcName: '雄鷹站長 (Station Master Eagle)',
    npcRole: '交通路線與旅行車票',
    npcAvatar: '🦅',
    mapArea: { left: 3, top: 42, width: 27, height: 25 },
    mapCoords: { x: 16.5, y: 54.5 },
    standeeSide: 'left',
    voiceProfile: { gender: 'male', pitch: 0.85, rate: 0.90, accent: 'en-US' }, // 俐落威嚴自信的雄鷹男站長
    bgGradient: 'from-orange-500/20 via-amber-600/20 to-rose-500/20',
    borderColor: 'border-orange-400 dark:border-orange-600',
    iconColor: 'text-orange-500',
    description: '搭公車、騎自行車去旅行，出發前往屏東與高雄！',
    dailyThemes: [
      '今日路線速遞：綠色客運穿梭谷川大橋',
      '今日安全倡導：山林自行車漫遊與安全帽騎乘',
      '今日轉乘資訊：出發前往屏東與高雄城市之旅'
    ],
    bgImage: '/assets/town/bg_station.webp',
    npcPortrait: '/assets/town/npc_station.webp',
    hasShop: true,
    hasQuests: false
  },
  {
    id: 'clinic',
    nameZh: '貓頭鷹診所',
    nameEn: 'Owl Health Clinic',
    npcName: '貓頭鷹醫師 (Dr. Owl)',
    npcRole: '守護健康與就醫問診',
    npcAvatar: '🦉',
    mapArea: { left: 58, top: 50, width: 19, height: 23 },
    mapCoords: { x: 67.5, y: 61.5 },
    standeeSide: 'left',
    voiceProfile: { gender: 'male', pitch: 0.75, rate: 0.80, accent: 'en-US' }, // 溫和深沉治癒安心的貓頭鷹男醫師
    bgGradient: 'from-cyan-500/20 via-blue-500/20 to-indigo-500/20',
    borderColor: 'border-cyan-400 dark:border-cyan-600',
    iconColor: 'text-cyan-500',
    description: '感冒發燒或肚子痛？醫師為你檢查並提供健康糖果。',
    dailyThemes: [
      '今日衛教專欄：喉嚨不適舒緩與薄荷潤喉糖',
      '今日衛教專欄：多喝溫水與睡滿八小時健康法則',
      '今日衛教專欄：戶外運動防護與退熱冰冰貼'
    ],
    bgImage: '/assets/town/bg_clinic.webp',
    npcPortrait: '/assets/town/npc_clinic.webp',
    hasShop: true,
    hasQuests: false
  },
  {
    id: 'plaza',
    nameZh: '百步蛇集會所',
    nameEn: 'Hundred-Pace Gathering Hall',
    npcName: '百合設計師 (Stylist Lily)',
    npcRole: '部落文化與服飾圖騰',
    npcAvatar: '🌺',
    mapArea: { left: 2, top: 6, width: 23, height: 28 },
    mapCoords: { x: 13.5, y: 20 },
    standeeSide: 'left',
    voiceProfile: { gender: 'female', pitch: 1.18, rate: 0.85, accent: 'en-US' }, // 優雅柔和婉約悅耳的百合女設計師
    bgGradient: 'from-purple-500/20 via-pink-500/20 to-rose-500/20',
    borderColor: 'border-purple-400 dark:border-purple-600',
    iconColor: 'text-purple-500',
    description: '欣賞美麗的百合花與琉璃珠項鍊，挑選部落帥氣獵人帽。',
    dailyThemes: [
      '今日文化傳承：魯凱族純潔百合勇士榮譽勳章',
      '今日工藝焦點：傳家七彩琉璃珠與陶壺故事',
      '今日服飾風尚：帥氣獵人帽與百步蛇圖騰背心'
    ],
    bgImage: '/assets/town/bg_plaza.webp',
    npcPortrait: '/assets/town/npc_plaza.webp',
    hasShop: true,
    hasQuests: false
  },
  {
    id: 'cinema',
    nameZh: '山豬影城',
    nameEn: 'Boar Cinema',
    npcName: '野豬售票員 (Clerk Boar)',
    npcRole: '休閒電影與熱騰騰爆米花',
    npcAvatar: '🐗',
    mapArea: { left: 79, top: 52, width: 19, height: 29 },
    mapCoords: { x: 88.5, y: 66.5 },
    standeeSide: 'left',
    voiceProfile: { gender: 'male', pitch: 0.68, rate: 0.88, accent: 'en-US' }, // 粗曠熱情有力的山豬男售票員
    bgGradient: 'from-rose-500/20 via-pink-600/20 to-purple-600/20',
    borderColor: 'border-rose-400 dark:border-rose-600',
    iconColor: 'text-rose-500',
    description: '週末最棒的娛樂！買張電影票，配上一大桶香脆爆米花。',
    dailyThemes: [
      '今日熱映中：《雲豹大冒險 3D》(The Legend of Cloud Leopard 3D)',
      '今日熱映中：《百步蛇傳奇守護者》(The Hundred-Pace Guardian)',
      '今日熱映中：《飛鼠快俠與星空探險》(Flying Squirrel Speedster)'
    ],
    bgImage: '/assets/town/bg_cinema.webp',
    npcPortrait: '/assets/town/npc_cinema.webp',
    hasShop: true,
    hasQuests: false
  },
  {
    id: 'home',
    nameZh: '學生溫馨的家',
    nameEn: 'Player Home',
    npcName: '個人房間與背包 (Cozy Room)',
    npcRole: '溫馨房間與道具收藏',
    npcAvatar: '🏡',
    mapArea: { left: 39, top: 73, width: 18, height: 21 },
    mapCoords: { x: 48, y: 83.5 },
    standeeSide: 'left',
    voiceProfile: null,
    bgGradient: 'from-amber-600/20 via-orange-500/20 to-lime-500/20',
    borderColor: 'border-amber-400 dark:border-amber-600',
    iconColor: 'text-amber-500',
    description: '溫暖舒服的個人房間，伴隨輕柔八音盒音樂，整理背包道具與收藏榮譽。',
    dailyThemes: ['溫暖的家：放鬆聆聽房間八音盒音樂，整理個人探險背包'],
    bgImage: '/assets/town/bg_home.webp',
    npcPortrait: null,
    hasShop: false,
    hasBackpack: true
  }
];

// ── 2. 今日地標主題輪換計算 ──
export const getLocationDailyTheme = (locId, dateStr = getTodayDateStr()) => {
  const loc = TOWN_LOCATIONS.find(l => l.id === locId);
  if (!loc || !loc.dailyThemes || loc.dailyThemes.length === 0) return '';
  const seed = getDaySeed(dateStr);
  return loc.dailyThemes[seed % loc.dailyThemes.length];
};

// ── 3. 小鎮道具商品總目錄 ──
export const TOWN_ITEMS = [
  // 📚 雲豹書局文具
  {
    id: 'pencil_item',
    shopId: 'bookstore',
    nameEn: 'Pencil',
    nameZh: '木質鉛筆',
    price: 10,
    icon: '✏️',
    category: 'stationery',
    description: '一枝寫字滑順的小鉛筆。課堂必備！'
  },
  {
    id: 'eraser_item',
    shopId: 'bookstore',
    nameEn: 'Eraser',
    nameZh: '彩色橡皮擦',
    price: 10,
    icon: '🧼',
    category: 'stationery',
    description: '能把錯字擦得乾乾淨淨的橡皮擦。'
  },
  {
    id: 'ruler_item',
    shopId: 'bookstore',
    nameEn: 'Ruler',
    nameZh: '透明直尺',
    price: 15,
    icon: '📏',
    category: 'stationery',
    description: '能畫出筆直直線與測量長度的尺。'
  },
  {
    id: 'marker_item',
    shopId: 'bookstore',
    nameEn: 'Marker',
    nameZh: '彩繪麥克筆',
    price: 20,
    icon: '🖍️',
    category: 'stationery',
    description: '美術課必備的彩色筆，顏色鮮豔亮麗。'
  },
  {
    id: 'workbook_item',
    shopId: 'bookstore',
    nameEn: 'Workbook',
    nameZh: '英語冒險作業本',
    price: 25,
    icon: '📓',
    category: 'stationery',
    description: '記錄每日英語進步軌跡的精美筆記本。'
  },
  {
    id: 'backpack_item',
    shopId: 'bookstore',
    nameEn: 'Adventure Backpack',
    nameZh: '山林探險背包',
    price: 80,
    icon: '🎒',
    category: 'clothing',
    description: '堅固耐用的大背包，能裝下滿滿的學習寶藏！'
  },

  // 🏪 黑熊超市美食與飲料
  {
    id: 'apple_item',
    shopId: 'supermarket',
    nameEn: 'Red Apple',
    nameZh: '香甜紅蘋果',
    price: 10,
    icon: '🍎',
    category: 'food',
    description: '脆甜多汁的大紅蘋果，吃了元氣滿滿！'
  },
  {
    id: 'banana_item',
    shopId: 'supermarket',
    nameEn: 'Banana',
    nameZh: '熟甜香蕉',
    price: 10,
    icon: '🍌',
    category: 'food',
    description: '營養豐富的黃金香蕉，運動後最佳點心。'
  },
  {
    id: 'sandwich_item',
    shopId: 'supermarket',
    nameEn: 'Sandwich',
    nameZh: '美味火腿三明治',
    price: 30,
    icon: '🥪',
    category: 'food',
    description: '夾著起司與新鮮蔬菜的熱騰騰三明治。'
  },
  {
    id: 'milk_item',
    shopId: 'supermarket',
    nameEn: 'Cold Milk',
    nameZh: '純淨冰牛奶',
    price: 20,
    icon: '🥛',
    category: 'food',
    description: '高鈣香醇的鮮牛奶，喝了快快長大！'
  },
  {
    id: 'juice_item',
    shopId: 'supermarket',
    nameEn: 'Orange Juice',
    nameZh: '鮮榨柳橙汁',
    price: 25,
    icon: '🧃',
    category: 'food',
    description: '滿滿維他命 C 的酸甜柳橙果汁。'
  },
  {
    id: 'pizza_item',
    shopId: 'supermarket',
    nameEn: 'Pizza Slice',
    nameZh: '香濃起司披薩',
    price: 45,
    icon: '🍕',
    category: 'food',
    description: 'Mario 老師最愛的特濃起司披薩切片。'
  },

  // 🚌 霧臺客運站票券
  {
    id: 'bus_ticket',
    shopId: 'station',
    nameEn: 'Bus Ticket',
    nameZh: '霧臺客運單程票',
    price: 20,
    icon: '🎫',
    category: 'ticket',
    description: '前往屏東市區的客運巴士票，可欣賞沿途山林風光。'
  },
  {
    id: 'train_ticket',
    shopId: 'station',
    nameEn: 'Express Train Ticket',
    nameZh: '屏東快線火車聯票',
    price: 50,
    icon: '🚆',
    category: 'ticket',
    description: '前往高雄大城市的疾速火車票。'
  },
  {
    id: 'bicycle_bell',
    shopId: 'station',
    nameEn: 'Bicycle Bell',
    nameZh: '清脆單車鈴鐺',
    price: 15,
    icon: '🔔',
    category: 'special',
    description: '叮叮噹！騎車提醒路上小動物的可愛鈴鐺。'
  },

  // 🏥 貓頭鷹診所保健用品
  {
    id: 'throat_lozenge',
    shopId: 'clinic',
    nameEn: 'Mint Throat Lozenges',
    nameZh: '清涼薄荷潤喉糖',
    price: 15,
    icon: '🍬',
    category: 'food',
    description: '喉嚨痛時含一顆，清涼舒爽！'
  },
  {
    id: 'cooling_patch',
    shopId: 'clinic',
    nameEn: 'Cooling Patch',
    nameZh: '退熱冰冰貼',
    price: 20,
    icon: '🩹',
    category: 'special',
    description: '發燒額頭熱烘烘時的舒緩好幫手。'
  },
  {
    id: 'water_bottle_item',
    shopId: 'clinic',
    nameEn: 'Healthy Water Bottle',
    nameZh: '活力健康大水壺',
    price: 40,
    icon: '🍶',
    category: 'stationery',
    description: '每天多喝溫水，保持健康活力！'
  },

  // 🏛️ 百步蛇集會所傳統服飾與部落寶物
  {
    id: 'lily_badge',
    shopId: 'plaza',
    nameEn: 'White Lily Badge',
    nameZh: '純潔百合勇士勳章',
    price: 50,
    icon: '⚜️',
    category: 'special',
    description: '魯凱族象徵尊貴、純潔與榮耀的白百合徽章！'
  },
  {
    id: 'glass_bead',
    shopId: 'plaza',
    nameEn: 'Glass Bead Necklace',
    nameZh: '琉璃珠項鍊 (勇士之珠)',
    price: 70,
    icon: '📿',
    category: 'special',
    description: '古老陶壺傳承的七彩琉璃珠，守護平安。'
  },
  {
    id: 'warrior_hat',
    shopId: 'plaza',
    nameEn: 'Hunter Cap',
    nameZh: '部落獵人帥氣帽',
    price: 60,
    icon: '🧢',
    category: 'clothing',
    description: '遮陽又英氣風發的獵人隊長帽子。'
  },
  {
    id: 'totem_tshirt',
    shopId: 'plaza',
    nameEn: 'Totem T-shirt',
    nameZh: '百步蛇圖騰 T 恤',
    price: 80,
    icon: '👕',
    category: 'clothing',
    description: '印有精緻傳統幾何圖騰的舒適純棉上衣。'
  },

  // 🎬 山豬影城娛樂點心
  {
    id: 'movie_ticket',
    shopId: 'cinema',
    nameEn: 'Movie Ticket',
    nameZh: '冒險電影全票',
    price: 50,
    icon: '🎟️',
    category: 'ticket',
    description: '最新強檔 3D 精彩動畫電影票。'
  },
  {
    id: 'popcorn_item',
    shopId: 'cinema',
    nameEn: 'Butter Popcorn',
    nameZh: '奶油香甜爆米花',
    price: 30,
    icon: '🍿',
    category: 'food',
    description: '看電影必備，香脆可口的大桶爆米花！'
  }
];

// ── 4. 雙外師客座巡迴彩蛋系統 (Visiting Teachers: Mario & Ibu) ──
export const VISITING_TEACHERS = {
  mario: {
    id: 'mario',
    nameZh: '客座外師 Mario',
    nameEn: 'Teacher Mario',
    roleZh: '雙語活力外師 • 街頭英語互動',
    avatar: '👨‍🏫',
    portrait: '/assets/town/teacher_mario.webp',
    standeeSide: 'right',
    voiceProfile: { gender: 'male', pitch: 0.90, rate: 0.92, accent: 'en-US' }, // 活力陽光美語男外師
    bgGradient: 'from-amber-500/30 via-red-500/20 to-orange-500/30',
    tag: '🌟 客座外師 Mario 現身！',
    dialogueTree: {
      startNode: 'mario_welcome',
      nodes: {
        mario_welcome: {
          id: 'mario_welcome',
          speaker: '外師 Mario (Teacher Mario)',
          en: "What's up, superstar! I am Teacher Mario! What a great surprise to meet you here in Wutai! How is your day going?",
          zh: "嗨，大明星！我是 Mario 老師！真驚喜能在霧臺這裡遇見你！你今天過得如何？",
          options: [
            { text_en: "It is awesome to meet you, Teacher Mario!", text_zh: "太酷了，很高興遇到 Mario 老師！", target_id: 'mario_cheer' },
            { text_en: "What are you doing here today?", text_zh: "老師今天怎麼會在這裡呢？", target_id: 'mario_mission' },
            { text_en: "I love learning English with you!", text_zh: "我最喜歡和老師一起學英語了！", target_id: 'mario_practice' }
          ]
        },
        mario_cheer: {
          id: 'mario_cheer',
          speaker: '外師 Mario (Teacher Mario)',
          en: "You have fantastic energy! Keep speaking English loud and proud. Give me a high five!",
          zh: "你的朝氣真是太棒了！繼續大聲又自信地說英語。來和我擊個掌吧！",
          options: [
            { text_en: "High five! Let's practice English!", text_zh: "擊掌！我們一起練習英文！", target_id: 'mario_reward' }
          ]
        },
        mario_mission: {
          id: 'mario_mission',
          speaker: '外師 Mario (Teacher Mario)',
          en: "I am exploring our wonderful Wutai town! I love the fresh mountain breeze, delicious pizza, and friendly smiles everywhere.",
          zh: "我正在探索我們美麗的霧臺小鎮！我好喜歡這裡清新的山風、美味的披薩，還有大家親切的笑容。",
          options: [
            { text_en: "Wutai is the best place ever!", text_zh: "霧臺是最棒的地方！", target_id: 'mario_reward' }
          ]
        },
        mario_practice: {
          id: 'mario_practice',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Remember my golden rule: Don't be afraid of making mistakes. Every new English word is your superpower!",
          zh: "記住我的黃金法則：不要害怕犯錯。每一個學會的新英語單字都是你的超能力！",
          options: [
            { text_en: "Yes! Every word is a superpower!", text_zh: "沒錯！每個單字都是超能力！", target_id: 'mario_reward' }
          ]
        },
        mario_reward: {
          id: 'mario_reward',
          speaker: '外師 Mario (Teacher Mario)',
          en: "You did an incredible job speaking English with me today! Here is your daily mystery bonus points! Have an amazing day!",
          zh: "你今天和我練習英語表現得太棒了！這是送給你的每日驚喜探索積分！祝你有個精彩的一天！",
          options: [
            { text_en: "Thank you so much, Teacher Mario! See you!", text_zh: "非常謝謝 Mario 老師！再見！", action: 'CLAIM_TEACHER_BONUS' }
          ]
        }
      }
    }
  },
  ibu: {
    id: 'ibu',
    nameZh: '客座外師 Ibu',
    nameEn: 'Teacher Ibu',
    roleZh: '親切雙語外師 • 文化發音互動',
    avatar: '👩‍🏫',
    portrait: '/assets/town/teacher_ibu.webp',
    standeeSide: 'right',
    voiceProfile: { gender: 'female', pitch: 1.04, rate: 0.88, accent: 'en-US' }, // 來自加州的親切溫暖美語女外師
    bgGradient: 'from-pink-500/30 via-purple-500/20 to-indigo-500/30',
    tag: '🌟 客座外師 Ibu 現身！',
    dialogueTree: {
      startNode: 'ibu_welcome',
      nodes: {
        ibu_welcome: {
          id: 'ibu_welcome',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Hello, my wonderful learner! Sabau! I am Teacher Ibu! It is lovely to see you walking in the bright sunshine today.",
          zh: "你好，可愛的學生！Sabau！我是 Ibu 老師！真高興在明媚的陽光下遇見你。",
          options: [
            { text_en: "Hello, Teacher Ibu! Sabau!", text_zh: "Ibu 老師好！Sabau！", target_id: 'ibu_culture' },
            { text_en: "Can you teach me a nice English phrase?", text_zh: "老師可以教我一句好聽的英文嗎？", target_id: 'ibu_phrase' },
            { text_en: "I am exploring Wutai town today!", text_zh: "我今天正在探索霧臺小鎮！", target_id: 'ibu_explore' }
          ]
        },
        ibu_culture: {
          id: 'ibu_culture',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Sabau! Combining our tribal warmth with joyful English makes my heart sing! Your pronunciation is truly wonderful.",
          zh: "Sabau！將我們部落的溫暖與歡樂的英語結合，讓我心中充滿歌唱！你的發音真好聽。",
          options: [
            { text_en: "Thank you, Teacher Ibu!", text_zh: "謝謝 Ibu 老師！", target_id: 'ibu_reward' }
          ]
        },
        ibu_phrase: {
          id: 'ibu_phrase',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Here is a cheerful phrase for you: 'Shine bright like the morning sun!' Say it with a big warm smile!",
          zh: "送你這句充滿朝氣的話：'Shine bright like the morning sun!'（像晨光一樣閃閃發亮！）帶著大大的笑容說出來吧！",
          options: [
            { text_en: "Shine bright like the morning sun!", text_zh: "像晨光一樣閃閃發亮！", target_id: 'ibu_reward' }
          ]
        },
        ibu_explore: {
          id: 'ibu_explore',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Exploring and learning through everyday life is the true secret to mastering languages! You are doing amazing.",
          zh: "在日常生活中探索與學習，是精通語言的秘密！你做得太棒了。",
          options: [
            { text_en: "I love exploring every day!", text_zh: "我喜歡每天探索！", target_id: 'ibu_reward' }
          ]
        },
        ibu_reward: {
          id: 'ibu_reward',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Thank you for chatting with me today! Here are your special bonus points! Keep shining, my dear student!",
          zh: "謝謝你今天和我練習英語！這是給你的特別獎勵積分。繼續閃閃發亮吧，親愛的孩子！",
          options: [
            { text_en: "Thank you, Teacher Ibu! Goodbye!", text_zh: "謝謝 Ibu 老師！再見！", action: 'CLAIM_TEACHER_BONUS' }
          ]
        }
      }
    }
  }
};

// ── 5. 計算今日值勤外師與出現地標 (高散列非重複演算法 + 5 套專屬外師輪替對話) ──
export const getDailyVisitingTeacherInfo = (dateStr = getTodayDateStr()) => {
  const seed = getDaySeed(dateStr);
  const teacherKeys = ['mario', 'ibu'];
  // 每日交替巡迴外師 (Mario / Ibu 每日動態換班)
  const teacherIndex = hashInt(seed + 99) % teacherKeys.length;
  const teacherKey = teacherKeys[teacherIndex];

  // 外師巡迴的 7 個社區與商店地標 (不包含國小與玩家家裡)
  const possibleLocations = ['bookstore', 'supermarket', 'park', 'station', 'clinic', 'plaza', 'cinema'];
  let locIndex = hashInt(seed + 77) % possibleLocations.length;

  // 確保連續兩天不會重複出現在相同地標 (防連續同一地點卡死)
  try {
    const d = new Date(dateStr);
    d.setDate(d.getDate() - 1);
    const prevDateStr = d.toISOString().slice(0, 10);
    const prevSeed = getDaySeed(prevDateStr);
    const prevLocIndex = hashInt(prevSeed + 77) % possibleLocations.length;
    if (locIndex === prevLocIndex) {
      locIndex = (locIndex + 1) % possibleLocations.length;
    }
  } catch (e) {}

  const locationId = possibleLocations[locIndex];

  // 每日自該外師專屬 5 套對話樹中隨機抽取出 1 套使用
  const teacherVariants = VISITING_TEACHER_VARIANTS[teacherKey] || [];
  const variantIndex = hashInt(seed + 333) % Math.max(1, teacherVariants.length);
  const dailyDialogueTree = teacherVariants[variantIndex] || VISITING_TEACHERS[teacherKey]?.dialogueTree;

  return {
    date: dateStr,
    teacherKey,
    teacher: {
      ...VISITING_TEACHERS[teacherKey],
      dialogueTree: dailyDialogueTree
    },
    locationId
  };
};

// ── 7. 智慧對話樹取得函式 (支援外師巡迴與每日輪替) ──
export const getDialogueTreeForLocation = (locationId, options = {}) => {
  // 溫馨的家屬於個人專屬音樂休閒房間，不設 NPC 與對話樹
  if (locationId === 'home') {
    return null;
  }

  const {
    dateStr = getTodayDateStr(),
    isTeacherActive = false,
    teacher = null
  } = options;

  // 1. 若當前地標為外師客座駐點，且學生今日尚未完成交談，優先返回外師專屬對話樹！
  if (isTeacherActive && teacher && teacher.dialogueTree) {
    return teacher.dialogueTree;
  }

  // 2. 否則依據當日種子自多樣化對話樹池中選取當日輪替對話樹 (使用 32-bit hashInt 混合地標偏移，確保各建築每天獨立隨機抽取 5 套之一)
  const variants = DIALOGUE_VARIANTS[locationId];
  if (Array.isArray(variants) && variants.length > 0) {
    const seed = getDaySeed(dateStr);
    const locHashOffset = locationId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const variantIndex = hashInt(seed + locHashOffset) % variants.length;
    return variants[variantIndex];
  }

  // 備援回退
  return DIALOGUE_VARIANTS.school ? DIALOGUE_VARIANTS.school[0] : null;
};

// ── 8. 相容預設對話樹導出 (Backward Compatibility) ──
export const DIALOGUE_TREES = {
  school: DIALOGUE_VARIANTS.school[0],
  bookstore: DIALOGUE_VARIANTS.bookstore[0],
  supermarket: DIALOGUE_VARIANTS.supermarket[0],
  park: DIALOGUE_VARIANTS.park[0],
  station: DIALOGUE_VARIANTS.station[0],
  clinic: DIALOGUE_VARIANTS.clinic[0],
  plaza: DIALOGUE_VARIANTS.plaza[0],
  cinema: DIALOGUE_VARIANTS.cinema[0]
};

// ── 9. 每日任務系統清單 ──
export const DAILY_QUEST_TEMPLATES = [
  // 🟢 難度一：簡單任務 (免費領取，+20 探索積分)
  {
    id: 'easy_greet_supermarket',
    tier: 'easy',
    titleZh: '超市晨光打招呼',
    titleEn: 'Morning Greeting at Supermarket',
    cost: 0,
    rewardPoints: 20,
    targetLocation: 'supermarket',
    descriptionZh: '前往黑熊超市，與店員或客座外師進行一段英語問候，並購買任意一項健康點心。',
    descriptionEn: 'Visit Black Bear Supermarket, chat in English, and purchase any healthy snack.',
    actionRequired: 'buy_food',
    dialogueTarget: 'supermarket'
  },
  {
    id: 'easy_stationery_check',
    tier: 'easy',
    titleZh: '書局採買小幫手',
    titleEn: 'Bookstore Stationery Helper',
    cost: 0,
    rewardPoints: 20,
    targetLocation: 'bookstore',
    descriptionZh: '前往雲豹書局與店長交談，挑選一枝鉛筆或橡皮擦放入你的背包。',
    descriptionEn: 'Visit Cloud Leopard Bookstore, talk to Manager Leopard, and buy a pencil or eraser.',
    actionRequired: 'buy_stationery',
    dialogueTarget: 'bookstore'
  },

  // 🔵 難度二：中階挑戰 (需投注 50 金幣解鎖，+90 探索積分)
  {
    id: 'medium_nature_explorer',
    tier: 'medium',
    titleZh: '大武山自然觀察家',
    titleEn: 'Da-Wu Mountain Nature Explorer',
    cost: 50,
    rewardPoints: 90,
    targetLocation: 'park',
    descriptionZh: '投注 50 金幣解鎖！前往飛鼠公園向長老請教今日四季天氣（解鎖晴天/四季/動物對話），融入大自然。',
    descriptionEn: 'Bet 50 coins! Chat about weather, seasons, and animals at Flying Squirrel Park.',
    actionRequired: 'visit_park_and_station',
    dialogueTarget: 'park'
  },
  {
    id: 'medium_healthy_hero',
    tier: 'medium',
    titleZh: '小鎮健康衛士',
    titleEn: 'Town Health Defender',
    cost: 50,
    rewardPoints: 90,
    targetLocation: 'clinic',
    descriptionZh: '投注 50 金幣解鎖！前往貓頭鷹診所諮詢健康保健或身體症狀（喉嚨痛/健康習慣），並購買一包潤喉薄荷糖或健康大水壺。',
    descriptionEn: 'Bet 50 coins! Consult Dr. Owl at the clinic, and purchase throat lozenges or water bottle.',
    actionRequired: 'buy_clinic_item',
    dialogueTarget: 'clinic'
  },

  // 🟡 難度三：高階解謎 (需投注 100 金幣解鎖，+180 探索積分)
  {
    id: 'hard_tribal_warrior',
    tier: 'hard',
    titleZh: '百步蛇傳奇榮譽勇士',
    titleEn: 'Legend of Hundred-Pace Warrior',
    cost: 100,
    rewardPoints: 180,
    targetLocation: 'plaza',
    descriptionZh: '投注 100 金幣解鎖高難度榮譽挑戰！前往百步蛇集會所深入了解白百合花涵義，學習純潔勇士精神，並獲得純潔百合勇士勳章！',
    descriptionEn: 'Bet 100 coins! Learn about the White Lily at the Gathering Hall, and earn the Lily Badge!',
    actionRequired: 'buy_lily_and_cinema',
    dialogueTarget: 'plaza'
  }
];
