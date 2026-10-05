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

// ── 0.5 霧臺小鎮全景地圖常數 ──
export const TOWN_MAP_PANORAMA_IMG = '/assets/town/town_map_panorama.png';

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
    voiceProfile: { gender: 'male', pitch: 0.88, rate: 0.85, accent: 'en-GB' }, // 沉穩溫和的英國紳士腔老校長
    bgGradient: 'from-blue-600/20 via-indigo-500/20 to-teal-500/20',
    borderColor: 'border-blue-400 dark:border-blue-600',
    iconColor: 'text-blue-500',
    description: '公佈欄領取每日探索任務，分享學校英語與課堂作息。',
    dailyThemes: [
      '今日校園公告：晨光英語與操場體育活動',
      '今日校園公告：準備探險作業本與鉛筆盒',
      '今日校園公告：大武山清新晨間活力'
    ],
    bgImage: '/assets/town/bg_school.png',
    npcPortrait: '/assets/town/npc_principal.png',
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
    voiceProfile: { gender: 'male', pitch: 1.02, rate: 0.92 }, // 熱情活潑儒雅的雲豹男店長
    bgGradient: 'from-amber-500/20 via-orange-500/20 to-yellow-500/20',
    borderColor: 'border-amber-400 dark:border-amber-600',
    iconColor: 'text-amber-500',
    description: '挑選鉛筆、橡皮擦與探險作業本，練習詢價購物。',
    dailyThemes: [
      '今日文具特輯：開學必備鉛筆、直尺與橡皮擦',
      '今日書局特輯：大武山山豬與飛鼠冒險繪本',
      '今日彩繪特輯：美術色彩筆與彩繪筆記本'
    ],
    bgImage: '/assets/town/bg_bookstore.png',
    npcPortrait: '/assets/town/npc_bookstore.png',
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
    voiceProfile: { gender: 'male', pitch: 0.68, rate: 0.82 }, // 低沉渾厚大黑熊男音
    bgGradient: 'from-emerald-500/20 via-green-500/20 to-teal-500/20',
    borderColor: 'border-emerald-400 dark:border-emerald-600',
    iconColor: 'text-emerald-500',
    description: '採買三明治、水果與飲料，餓了渴了快來補給！',
    dailyThemes: [
      '今日美食特選：香脆蘋果與特濃起司披薩',
      '今日早餐特供：純淨鮮牛奶與酸甜柳橙汁',
      '今日野餐特刊：黃金香蕉與山林探險補給'
    ],
    bgImage: '/assets/town/bg_supermarket.png',
    npcPortrait: '/assets/town/npc_supermarket.png',
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
    voiceProfile: { gender: 'male', pitch: 1.35, rate: 0.90 }, // 輕快高亢敏捷的飛鼠長老音
    bgGradient: 'from-teal-500/20 via-cyan-500/20 to-emerald-500/20',
    borderColor: 'border-teal-400 dark:border-teal-600',
    iconColor: 'text-teal-500',
    description: '微風吹拂的草地，觀察蝴蝶花朵，聊聊今天的天氣四季。',
    dailyThemes: [
      '今日大自然觀察：晴空萬里與純白百合盛開',
      '今日大自然觀察：涼爽山風與草地慢跑時光',
      '今日大自然觀察：大武山四季風景與野生動物'
    ],
    bgImage: '/assets/town/bg_park.png',
    npcPortrait: '/assets/town/npc_park.png',
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
    voiceProfile: { gender: 'male', pitch: 0.88, rate: 0.88 }, // 俐落威嚴自信的雄鷹男站長
    bgGradient: 'from-orange-500/20 via-amber-600/20 to-rose-500/20',
    borderColor: 'border-orange-400 dark:border-orange-600',
    iconColor: 'text-orange-500',
    description: '搭公車、騎自行車去旅行，出發前往屏東與高雄！',
    dailyThemes: [
      '今日路線速遞：綠色客運穿梭谷川大橋',
      '今日安全倡導：山林自行車漫遊與安全帽騎乘',
      '今日轉乘資訊：出發前往屏東與高雄城市之旅'
    ],
    bgImage: '/assets/town/bg_station.png',
    npcPortrait: '/assets/town/npc_station.png',
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
    voiceProfile: { gender: 'male', pitch: 0.80, rate: 0.80 }, // 溫和深沉治癒的貓頭鷹男醫師
    bgGradient: 'from-cyan-500/20 via-blue-500/20 to-indigo-500/20',
    borderColor: 'border-cyan-400 dark:border-cyan-600',
    iconColor: 'text-cyan-500',
    description: '感冒發燒或肚子痛？醫師為你檢查並提供健康糖果。',
    dailyThemes: [
      '今日衛教專欄：喉嚨不適舒緩與薄荷潤喉糖',
      '今日衛教專欄：多喝溫水與睡滿八小時健康法則',
      '今日衛教專欄：戶外運動防護與退熱冰冰貼'
    ],
    bgImage: '/assets/town/bg_clinic.png',
    npcPortrait: '/assets/town/npc_clinic.png',
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
    voiceProfile: { gender: 'female', pitch: 1.15, rate: 0.86 }, // 優雅柔和悅耳的百合女設計師
    bgGradient: 'from-purple-500/20 via-pink-500/20 to-rose-500/20',
    borderColor: 'border-purple-400 dark:border-purple-600',
    iconColor: 'text-purple-500',
    description: '欣賞美麗的百合花與琉璃珠項鍊，挑選部落帥氣獵人帽。',
    dailyThemes: [
      '今日文化傳承：魯凱族純潔百合勇士榮譽勳章',
      '今日工藝焦點：傳家七彩琉璃珠與陶壺故事',
      '今日服飾風尚：帥氣獵人帽與百步蛇圖騰背心'
    ],
    bgImage: '/assets/town/bg_plaza.png',
    npcPortrait: '/assets/town/npc_plaza.png',
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
    voiceProfile: { gender: 'male', pitch: 0.74, rate: 0.88 }, // 粗曠熱情有力的山豬男售票員
    bgGradient: 'from-rose-500/20 via-pink-600/20 to-purple-600/20',
    borderColor: 'border-rose-400 dark:border-rose-600',
    iconColor: 'text-rose-500',
    description: '週末最棒的娛樂！買張電影票，配上一大桶香脆爆米花。',
    dailyThemes: [
      '今日熱映中：《雲豹大冒險 3D》(The Legend of Cloud Leopard 3D)',
      '今日熱映中：《百步蛇傳奇守護者》(The Hundred-Pace Guardian)',
      '今日熱映中：《飛鼠快俠與星空探險》(Flying Squirrel Speedster)'
    ],
    bgImage: '/assets/town/bg_cinema.png',
    npcPortrait: '/assets/town/npc_cinema.png',
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
    bgImage: '/assets/town/bg_home.png',
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
    portrait: '/assets/town/teacher_mario.png',
    standeeSide: 'right',
    voiceProfile: { gender: 'male', pitch: 0.94, rate: 0.92, accent: 'en-US' }, // 活力陽光美語男外師
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
    portrait: '/assets/town/teacher_ibu.png',
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

// ── 5. 計算今日值勤外師與出現地標 ──
export const getDailyVisitingTeacherInfo = (dateStr = getTodayDateStr()) => {
  const seed = getDaySeed(dateStr);
  const teacherKeys = ['mario', 'ibu'];
  const teacherKey = teacherKeys[seed % teacherKeys.length];
  // 外師巡迴的 7 個社區與商店地標 (不包含國小與玩家家裡)
  const possibleLocations = ['bookstore', 'supermarket', 'park', 'station', 'clinic', 'plaza', 'cinema'];
  const locationIndex = Math.floor(seed / 7) % possibleLocations.length;
  const locationId = possibleLocations[locationIndex];

  return {
    date: dateStr,
    teacherKey,
    teacher: VISITING_TEACHERS[teacherKey],
    locationId
  };
};

// ── 6. 各地標多樣化輪替對話樹清單 (Dialogue Variants Pool) ──
export const DIALOGUE_VARIANTS = {
  // ── 🏫 霧臺國小校長 (2 種日常輪替主題) ──
  school: [
    {
      variantId: 'school_v0',
      title: '晨光朝氣與全校任務篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '校長 (Principal)',
          en: "Good morning, young learner! Welcome back to Wutai Elementary School. How are you today?",
          zh: "早安，優秀的小小冒險家！歡迎回到霧臺國小。你今天好嗎？",
          options: [
            { text_en: "I am happy and ready to learn!", text_zh: "我很快樂，準備好學習了！", target_id: 'quest_intro' },
            { text_en: "What classes do we have today?", text_zh: "我們今天有哪些課呢？", target_id: 'classes' },
            { text_en: "I am a little tired today.", text_zh: "我今天有點累。", target_id: 'encourage' }
          ]
        },
        quest_intro: {
          id: 'quest_intro',
          speaker: '校長 (Principal)',
          en: "Wonderful energy! The school bulletin board has daily quests today. Complete them to earn Quest Points for our school honor roll!",
          zh: "太棒的朝氣了！學校布告欄今天有每日探索任務。完成它們可以為我們學校的榮譽榜贏得探索積分喔！",
          options: [
            { text_en: "Let me check the Quest Board!", text_zh: "讓我看看任務布告欄！", action: 'OPEN_QUESTS' },
            { text_en: "Thank you, Principal!", text_zh: "謝謝校長！", target_id: 'farewell' }
          ]
        },
        classes: {
          id: 'classes',
          speaker: '校長 (Principal)',
          en: "Today is an exciting day! We have English, Math, and PE on the sports ground. Remember to bring your workbook and water bottle!",
          zh: "今天是很充實的一天！我們在操場有英語課、數學課和體育課。記得帶你的作業本和大水壺喔！",
          options: [
            { text_en: "I love English and PE!", text_zh: "我最喜歡英語課和體育課！", target_id: 'quest_intro' },
            { text_en: "I will get my workbook ready.", text_zh: "我會準備好我的作業本。", target_id: 'farewell' }
          ]
        },
        encourage: {
          id: 'encourage',
          speaker: '校長 (Principal)',
          en: "Take a deep breath of our fresh mountain air! Drink some warm water, and visit the park after class to see the green trees.",
          zh: "深呼吸一口我們大武山清新的空氣吧！喝點溫水，下課後去公園看看綠樹放鬆一下。",
          options: [
            { text_en: "Thank you, I feel better now!", text_zh: "謝謝您，我感覺好多了！", target_id: 'quest_intro' }
          ]
        },
        farewell: {
          id: 'farewell',
          speaker: '校長 (Principal)',
          en: "Work hard and enjoy your day at Wutai Elementary! Have fun!",
          zh: "認真學習，享受你在霧臺國小的一天！祝你玩得開心！",
          options: [
            { text_en: "Goodbye, Principal!", text_zh: "再見，校長！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'school_v1',
      title: '學用品準備與閱讀推廣篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '校長 (Principal)',
          en: "Hello, diligent student! Did you pack your school bag and pencil case before coming to school?",
          zh: "你好，勤奮的同學！來學校前，你的書包和鉛筆盒都收拾好了嗎？",
          options: [
            { text_en: "Yes, I have my pencil, eraser, and ruler!", text_zh: "是的，我有鉛筆、橡皮擦和直尺！", target_id: 'bag_check' },
            { text_en: "I forgot my eraser at home.", text_zh: "我把橡皮擦忘在家裡了。", target_id: 'bookstore_tip' }
          ]
        },
        bag_check: {
          id: 'bag_check',
          speaker: '校長 (Principal)',
          en: "Excellent preparation! Being organized is the first step to successful learning. Check the bulletin board for new adventures!",
          zh: "太優秀的準備了！有條不紊是成功學習的第一步。快看看布告欄上有沒有新的冒險吧！",
          options: [
            { text_en: "Open Quest Board!", text_zh: "開啟任務公佈欄！", action: 'OPEN_QUESTS' }
          ]
        },
        bookstore_tip: {
          id: 'bookstore_tip',
          speaker: '校長 (Principal)',
          en: "Don't worry! You can visit Cloud Leopard Bookstore to get a colorful eraser with your student coins.",
          zh: "別擔心！你可以去雲豹書局用你獲得的學生金幣挑選一個彩色橡皮擦。",
          options: [
            { text_en: "I will visit the bookstore!", text_zh: "我等一下去書局看看！", target_id: 'END' }
          ]
        }
      }
    }
  ],

  // ── 📖 雲豹書局店長 (2 種日常輪替主題) ──
  bookstore: [
    {
      variantId: 'bookstore_v0',
      title: '經典文具採買篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "Hello! Welcome to Cloud Leopard Bookstore. We have books, pencils, and rulers. How can I help you?",
          zh: "你好！歡迎光臨雲豹書局。我們有書本、鉛筆和尺。有什麼我可以幫你的嗎？",
          options: [
            { text_en: "I want to buy some stationery.", text_zh: "我想買一些文具。", action: 'OPEN_SHOP' },
            { text_en: "Do you have English storybooks?", text_zh: "你們有英語故事書嗎？", target_id: 'books' },
            { text_en: "Just looking around, thank you!", text_zh: "我只是隨意看看，謝謝！", target_id: 'browse' }
          ]
        },
        books: {
          id: 'books',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "Yes, we do! We have stories about courageous mountain boars and clever flying squirrels. Reading books makes your English great!",
          zh: "當然有！我們有關於勇敢山豬與聰明飛鼠的故事。閱讀英文書能讓你的英語能力大躍進！",
          options: [
            { text_en: "Let me check your shop items!", text_zh: "讓我看看你的商品！", action: 'OPEN_SHOP' },
            { text_en: "I will read them every day.", text_zh: "我會每天閱讀它們。", target_id: 'farewell' }
          ]
        },
        browse: {
          id: 'browse',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "Take your time! If you need a pencil or eraser for school, just ask me anytime.",
          zh: "慢慢看！如果學校需要鉛筆或橡皮擦，隨時告訴我喔。",
          options: [
            { text_en: "Open stationery shop.", text_zh: "開啟文具商店。", action: 'OPEN_SHOP' },
            { text_en: "Thank you, goodbye!", text_zh: "謝謝店長，再見！", target_id: 'END' }
          ]
        },
        farewell: {
          id: 'farewell',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "Happy studying! Keep learning new English words every day!",
          zh: "學習愉快！每天都要持續學習新的英語單字喔！",
          options: [
            { text_en: "Goodbye, Manager Leopard!", text_zh: "再見，雲豹店長！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'bookstore_v1',
      title: '彩繪創作與彩色麥克筆篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "Welcome back! Today we have bright markers: red, blue, green, and yellow! Do you like drawing pictures?",
          zh: "歡迎光臨！今天我們進了色彩鮮豔的麥克筆：紅色、藍色、綠色還有黃色！你喜歡畫畫嗎？",
          options: [
            { text_en: "I love drawing mountain animals!", text_zh: "我最喜歡畫大武山上的動物了！", target_id: 'art_talk' },
            { text_en: "Show me the colorful markers, please.", text_zh: "請讓我看看彩色麥克筆。", action: 'OPEN_SHOP' }
          ]
        },
        art_talk: {
          id: 'art_talk',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "Drawing and labeling things in English is a fun way to learn vocabulary! Grab a marker and start creating!",
          zh: "畫畫並在旁邊標註英文單字，是學習字彙超好玩的方式！挑一組麥克筆開始創作吧！",
          options: [
            { text_en: "Let me buy some markers!", text_zh: "我要買麥克筆！", action: 'OPEN_SHOP' },
            { text_en: "Thank you for the wonderful idea!", text_zh: "謝謝店長超棒的點子！", target_id: 'END' }
          ]
        }
      }
    }
  ],

  // ── 🏪 黑熊超市店員 (2 種日常輪替主題) ──
  supermarket: [
    {
      variantId: 'supermarket_v0',
      title: '美味點心與熱騰騰披薩篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "Hello, friendly kid! Welcome to Black Bear Supermarket. Are you hungry or thirsty?",
          zh: "你好，有禮貌的同學！歡迎來到黑熊超市。你肚子餓還是口渴了嗎？",
          options: [
            { text_en: "I am hungry! I want food.", text_zh: "我肚子餓了！我想要好吃的食物。", target_id: 'hungry' },
            { text_en: "I am thirsty! I want a drink.", text_zh: "我口渴了！我想要喝飲料。", target_id: 'thirsty' },
            { text_en: "Let me see all items in the store.", text_zh: "讓我逛逛超市裡的所有商品。", action: 'OPEN_SHOP' }
          ]
        },
        hungry: {
          id: 'hungry',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "We have fresh sandwiches, red apples, and delicious pizza slices today. What do you like?",
          zh: "我們今天有新鮮的三明治、紅蘋果和美味的披薩切片。你喜歡哪一個呢？",
          options: [
            { text_en: "I like sandwiches and apples!", text_zh: "我喜歡三明治和蘋果！", action: 'OPEN_SHOP' },
            { text_en: "Pizza smells so good!", text_zh: "披薩聞起來好香啊！", action: 'OPEN_SHOP' }
          ]
        },
        thirsty: {
          id: 'thirsty',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "Cold milk and sweet orange juice are ready in the fridge! They are cold and refreshing.",
          zh: "冰牛奶和香甜柳橙汁已經在冰箱準備好了！冰涼又爽口。",
          options: [
            { text_en: "I want to buy some drinks!", text_zh: "我想買好喝的飲料！", action: 'OPEN_SHOP' },
            { text_en: "Drinking water is good for health too.", text_zh: "喝白開水對健康也很好。", target_id: 'farewell' }
          ]
        },
        farewell: {
          id: 'farewell',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "Enjoy your snack and have a joyful day! Come back soon!",
          zh: "享受你的美味點心，祝你有個愉快的一天！歡迎常常來！",
          options: [
            { text_en: "Thank you, Clerk Bear!", text_zh: "謝謝你，黑熊店員！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'supermarket_v1',
      title: '晨光元氣早餐與高鈣牛奶篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "Good morning! Eating a nutritious breakfast gives you big power for English quizzes! Did you eat breakfast?",
          zh: "早安！吃頓有營養的早餐會給你滿滿的活力應對英語小測驗！你今天吃早餐了嗎？",
          options: [
            { text_en: "I want a sandwich and cold milk!", text_zh: "我想要三明治和冰牛奶！", action: 'OPEN_SHOP' },
            { text_en: "What fruits do you recommend?", text_zh: "你推薦什麼水果呢？", target_id: 'fruit_rec' }
          ]
        },
        fruit_rec: {
          id: 'fruit_rec',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "Sweet bananas give instant energy, and crunchy red apples keep the doctor away! Both are fresh from the farm.",
          zh: "香甜香蕉能迅速補充體力，脆甜紅蘋果讓醫生遠離你！都是產地新鮮直送喔。",
          options: [
            { text_en: "Let me buy some bananas and apples!", text_zh: "我要買香蕉和蘋果！", action: 'OPEN_SHOP' }
          ]
        }
      }
    }
  ],

  // ── 🌳 飛鼠公園長老 (2 種日常輪替主題) ──
  park: [
    {
      variantId: 'park_v0',
      title: '晴朗四季與白百合生態篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Welcome to Flying Squirrel Park, my young friend! Listen to the birds singing. How is the weather today?",
          zh: "歡迎來到飛鼠公園，我的年輕朋友！聽聽鳥兒的歌聲。今天的天氣怎麼樣呢？",
          options: [
            { text_en: "It is sunny and warm today!", text_zh: "今天天氣晴朗又溫暖！", target_id: 'sunny' },
            { text_en: "It is cloudy and cool today.", text_zh: "今天多雲又涼爽。", target_id: 'cool' },
            { text_en: "What animals live in this park?", text_zh: "這個公園裡住著哪些動物呢？", target_id: 'animals' }
          ]
        },
        sunny: {
          id: 'sunny',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Sunny days are great for playing outside! Look at the colorful butterflies dancing over the white lilies.",
          zh: "晴天最適合在戶外玩耍了！看看五彩繽紛的蝴蝶在純白百合花上跳舞呢。",
          options: [
            { text_en: "Nature in Wutai is so beautiful!", text_zh: "霧臺的大自然真是太美了！", target_id: 'farewell' },
            { text_en: "Which season do you like best?", text_zh: "長老您最喜歡哪個季節呢？", target_id: 'seasons' }
          ]
        },
        cool: {
          id: 'cool',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Cool mountain breezes make jogging comfortable! Don't forget to put on a jacket if it gets windy.",
          zh: "涼爽的山風讓慢跑很舒服！如果風變大了，別忘了穿上一件夾克外套喔。",
          options: [
            { text_en: "I will wear my jacket.", text_zh: "我會穿上我的夾克。", target_id: 'farewell' }
          ]
        },
        animals: {
          id: 'animals',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "We have butterflies, green frogs, clever birds, and little dogs playing on the grass. We love and protect all animals!",
          zh: "我們有蝴蝶、綠青蛙、聰明的鳥兒，還有在草地上玩耍的小狗。我們熱愛並保護所有動物！",
          options: [
            { text_en: "Animals are our best friends!", text_zh: "動物是我們最好的朋友！", target_id: 'farewell' }
          ]
        },
        seasons: {
          id: 'seasons',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "I love spring when flowers bloom, and autumn when the mountain air is dry and fresh. Every season in Wutai is a blessing.",
          zh: "我喜歡繁花盛開的春天，也喜歡山風乾爽清新的秋天。霧臺的每個季節都是恩賜。",
          options: [
            { text_en: "Thank you for sharing, Elder!", text_zh: "謝謝長老的分享！", target_id: 'farewell' }
          ]
        },
        farewell: {
          id: 'farewell',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "May the sunshine guide your steps today! Go boldly!",
          zh: "願今天的陽光指引你的腳步！勇敢向前邁進吧！",
          options: [
            { text_en: "Goodbye, Elder Squirrel!", text_zh: "再見，飛鼠長老！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'park_v1',
      title: '山林慢跑與季節微風篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Feel the mountain breeze today! In autumn and winter, cool air blows through the tall trees. How are you feeling?",
          zh: "感受今天的山風吧！在秋冬時節，涼爽的微風吹過高聳的樹林。你感覺如何？",
          options: [
            { text_en: "It is cool and refreshing today.", text_zh: "今天涼爽又神清氣爽。", target_id: 'cool' },
            { text_en: "The sun is shining brightly!", text_zh: "陽光非常燦爛！", target_id: 'sunny' },
            { text_en: "Tell me about the seasons here.", text_zh: "請跟我說說這裡的四季故事。", target_id: 'seasons' }
          ]
        },
        cool: {
          id: 'cool',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Running on the soft grass keeps your heart healthy! Remember to stretch your legs.",
          zh: "在柔軟的草地上跑步能保持心臟強健！記得活動雙腿拉拉筋喔。",
          options: [
            { text_en: "I love jogging in the park!", text_zh: "我喜歡在公園裡慢跑！", target_id: 'END' }
          ]
        },
        sunny: {
          id: 'sunny',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Warm sunshine lights up the mountain trails. Enjoy every golden minute of today!",
          zh: "溫暖的陽光照亮了山間小徑。好好享受今天每一刻黃金般的時光！",
          options: [
            { text_en: "Thank you, Elder Squirrel!", text_zh: "謝謝飛鼠長老！", target_id: 'END' }
          ]
        },
        seasons: {
          id: 'seasons',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Spring brings green leaves, summer brings rain, autumn brings crisp air, and winter brings cozy fires. Every season is unique!",
          zh: "春天帶來綠葉、夏天帶來雨水、秋天帶來乾爽涼風、冬天帶來溫暖柴火。每個季節都獨一無二！",
          options: [
            { text_en: "Wutai's nature is wonderful!", text_zh: "霧臺的大自然太棒了！", target_id: 'END' }
          ]
        }
      }
    }
  ],

  // ── 🚌 霧臺客運站雄鷹站長 (2 種日常輪替主題) ──
  station: [
    {
      variantId: 'station_v0',
      title: '谷川大橋與屏東客運巴士篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "Welcome to Wutai Bus Station! I am Station Master Eagle. Where are you traveling today, little adventurer?",
          zh: "歡迎來到霧臺客運站！我是雄鷹站長。小小探險家，你今天要去哪裡旅行呢？",
          options: [
            { text_en: "How do you go to Pingtung?", text_zh: "請問怎麼去屏東呢？", target_id: 'pingtung' },
            { text_en: "I want to buy a bus ticket.", text_zh: "我想買一張公車票。", action: 'OPEN_SHOP' },
            { text_en: "Can I ride my bike here?", text_zh: "我可以騎腳踏車嗎？", target_id: 'bike' }
          ]
        },
        pingtung: {
          id: 'pingtung',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "You can go by bus! The green bus leaves every hour. It drives through our scenic mountain valleys and Guchuan Bridge.",
          zh: "你可以搭公車去！綠色的客運巴士每小時出發一班，會穿過壯麗的山谷和谷川大橋喔。",
          options: [
            { text_en: "One bus ticket, please!", text_zh: "請給我一張公車票！", action: 'OPEN_SHOP' },
            { text_en: "Sounds like a fun trip!", text_zh: "聽起來是一趟好玩的旅程！", target_id: 'farewell' }
          ]
        },
        bike: {
          id: 'bike',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "Riding a bicycle is great exercise! Remember to ring your bell around sharp corners and wear a helmet.",
          zh: "騎腳踏車是很棒的運動！過彎時記得按鈴鐺提醒，並且要戴好安全帽喔。",
          options: [
            { text_en: "Safety first! Thank you, Station Master.", text_zh: "安全第一！謝謝雄鷹站長。", target_id: 'farewell' }
          ]
        },
        farewell: {
          id: 'farewell',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "Have a safe and happy journey! Fasten your seatbelt!",
          zh: "祝你有一趟安全又快樂的旅程！記得繫好安全帶！",
          options: [
            { text_en: "Goodbye, Station Master Eagle!", text_zh: "再見，雄鷹站長！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'station_v1',
      title: '火車站轉乘與高雄都會探險篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "All aboard! Beyond Pingtung lies the fast express train to Kaohsiung city! Are you planning a big trip?",
          zh: "各位旅客請上車！抵達屏東後，還能換乘前往高雄大城市的疾速火車喔！你正計畫一場大旅行嗎？",
          options: [
            { text_en: "I want an express train ticket!", text_zh: "我想要一張疾速火車票！", action: 'OPEN_SHOP' },
            { text_en: "Is the train faster than the bus?", text_zh: "火車比公車快嗎？", target_id: 'train_speed' }
          ]
        },
        train_speed: {
          id: 'train_speed',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "Yes! Trains zoom on steel rails with zero traffic lights. But our mountain buses have the finest scenic views!",
          zh: "沒錯！火車在鐵軌上奔馳沒有紅綠燈。但我們山區客運沿途有全台灣最絕美的山景！",
          options: [
            { text_en: "I love both buses and trains!", text_zh: "公車和火車我都好喜歡！", action: 'OPEN_SHOP' }
          ]
        }
      }
    }
  ],

  // ── 🏥 貓頭鷹診所醫師 (2 種日常輪替主題) ──
  clinic: [
    {
      variantId: 'clinic_v0',
      title: '喉嚨舒緩與健康保健三大法寶篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '貓頭鷹醫師 (Dr. Owl)',
          en: "Hello, dear child! This is Owl Health Clinic. You look thoughtful. What is wrong with you?",
          zh: "你好，親愛的孩子！這裡是貓頭鷹健康診所。你看起來有些沉思。身體有哪裡不舒服嗎？",
          options: [
            { text_en: "I am healthy and strong!", text_zh: "我身體很健康強壯！", target_id: 'healthy' },
            { text_en: "I have a sore throat.", text_zh: "我喉嚨有點痛。", target_id: 'throat' },
            { text_en: "Do you have first aid items?", text_zh: "你們有急救保健用品嗎？", action: 'OPEN_SHOP' }
          ]
        },
        healthy: {
          id: 'healthy',
          speaker: '貓頭鷹醫師 (Dr. Owl)',
          en: "I love hearing that! Eating fresh fruit, drinking enough water, and sleeping eight hours keep sickness away.",
          zh: "聽到這個我真高興！多吃新鮮水果、喝足夠的水、每天睡滿八小時，病菌就會遠離你。",
          options: [
            { text_en: "I drink water every day!", text_zh: "我每天都有喝很多水！", target_id: 'farewell' },
            { text_en: "Let me buy a water bottle.", text_zh: "我想買個健康大水壺。", action: 'OPEN_SHOP' }
          ]
        },
        throat: {
          id: 'throat',
          speaker: '貓頭鷹醫師 (Dr. Owl)',
          en: "A sore throat can happen when the air gets dry. Have a mint throat lozenge and rest your voice.",
          zh: "天氣乾燥時容易喉嚨痛。含一顆薄荷潤喉糖，並讓聲帶多休息吧。",
          options: [
            { text_en: "I will take a throat lozenge.", text_zh: "我想買一包潤喉糖。", action: 'OPEN_SHOP' },
            { text_en: "Thank you for the advice!", text_zh: "謝謝醫師的建議！", target_id: 'farewell' }
          ]
        },
        farewell: {
          id: 'farewell',
          speaker: '貓頭鷹醫師 (Dr. Owl)',
          en: "Stay healthy and keep smiling! Health is your greatest treasure.",
          zh: "保持健康，維持燦爛笑容！健康是你最珍貴的寶藏。",
          options: [
            { text_en: "Thank you, Dr. Owl!", text_zh: "謝謝您，貓頭鷹醫師！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'clinic_v1',
      title: '退熱冰貼與運動防護篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '貓頭鷹醫師 (Dr. Owl)',
          en: "Greetings, active explorer! Running on mountain trails requires good care. Do you have a fever or cold?",
          zh: "問候你，活潑的探險家！在山間小徑奔跑需要好好照顧身體。你有發燒或感冒嗎？",
          options: [
            { text_en: "I am feeling healthy today!", text_zh: "我今天感覺很健康！", target_id: 'healthy' },
            { text_en: "My forehead feels warm.", text_zh: "我的額頭摸起來熱熱的。", target_id: 'fever' }
          ]
        },
        healthy: {
          id: 'healthy',
          speaker: '貓頭鷹醫師 (Dr. Owl)',
          en: "Keep up the great habits: Wash your hands with soap and drink clean water throughout the day!",
          zh: "繼續保持好習慣：用肥皂勤洗手，整天都要隨時補充純淨水！",
          options: [
            { text_en: "I will do that! Thank you.", text_zh: "我會做到的！謝謝醫師。", target_id: 'END' }
          ]
        },
        fever: {
          id: 'fever',
          speaker: '貓頭鷹醫師 (Dr. Owl)',
          en: "A cooling patch helps soothe a warm forehead. Drink warm water and get plenty of restful sleep.",
          zh: "退熱冰冰貼可以舒緩溫熱的額頭。多喝溫水並獲得充足的睡眠休息。",
          options: [
            { text_en: "I need a cooling patch, please.", text_zh: "請給我一包退熱冰冰貼。", action: 'OPEN_SHOP' }
          ]
        }
      }
    }
  ],

  // ── 🏛️ 百步蛇集會所設計師 (2 種日常輪替主題) ──
  plaza: [
    {
      variantId: 'plaza_v0',
      title: '純潔白百合與榮譽勇士文化篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '百合設計師 (Stylist Lily)',
          en: "Welcome to Hundred-Pace Gathering Hall! Look at our beautiful traditional vest, hunter caps, and white lily badges. Do you like fashion?",
          zh: "歡迎來到百步蛇集會所！看看我們美麗的傳統背心、獵人帽與純白百合勳章。你喜歡服飾配件嗎？",
          options: [
            { text_en: "I want to see the tribal badges!", text_zh: "我想看看部落勳章與項鍊！", action: 'OPEN_SHOP' },
            { text_en: "What does the White Lily mean?", text_zh: "請問白百合花代表什麼意思呢？", target_id: 'lily_meaning' },
            { text_en: "These clothes are very cool!", text_zh: "這些衣服真帥氣！", action: 'OPEN_SHOP' }
          ]
        },
        lily_meaning: {
          id: 'lily_meaning',
          speaker: '百合設計師 (Stylist Lily)',
          en: "In Rukai culture, the white lily symbolizes honor, purity, and bravery! Only true warriors and kind learners earn the right to wear it.",
          zh: "在魯凱族文化中，白百合花象徵榮譽、純潔與英勇！只有真正的勇士與善良認真的學者才有資格佩戴它。",
          options: [
            { text_en: "I want to be an honorable learner!", text_zh: "我也想成為一名有榮譽感的學者！", target_id: 'badge_offer' },
            { text_en: "Let me buy a White Lily badge.", text_zh: "我要用金幣購買白百合勳章。", action: 'OPEN_SHOP' }
          ]
        },
        badge_offer: {
          id: 'badge_offer',
          speaker: '百合設計師 (Stylist Lily)',
          en: "Study hard, speak kind words, and conquer the English universe! You are already a shining star of Wutai.",
          zh: "認真學習、口說善言，並征服英語宇宙吧！你已經是霧臺一顆閃亮之星。",
          options: [
            { text_en: "Thank you for the encouragement!", text_zh: "謝謝百合設計師的鼓勵！", target_id: 'farewell' }
          ]
        },
        farewell: {
          id: 'farewell',
          speaker: '百合設計師 (Stylist Lily)',
          en: "Wear your courage with pride! Come back and visit us anytime!",
          zh: "驕傲地展現你的勇氣吧！隨時歡迎常來集會所交流！",
          options: [
            { text_en: "Goodbye, Stylist Lily!", text_zh: "再見，百合設計師！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'plaza_v1',
      title: '傳家七彩琉璃珠與陶壺傳奇篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '百合設計師 (Stylist Lily)',
          en: "Sabau! Look at these colorful glass beads! In our traditions, each bead tells an ancient story of wisdom, courage, and love.",
          zh: "Sabau！看看這些七彩琉璃珠！在我們的傳統中，每顆珠子都述說著古老的智慧、勇氣與愛的故事。",
          options: [
            { text_en: "What does the White Lily mean?", text_zh: "那白百合花又代表什麼意思呢？", target_id: 'lily_meaning' },
            { text_en: "I want to wear a glass bead necklace!", text_zh: "我想戴上琉璃珠項鍊！", action: 'OPEN_SHOP' }
          ]
        },
        lily_meaning: {
          id: 'lily_meaning',
          speaker: '百合設計師 (Stylist Lily)',
          en: "The white lily represents purity and bravery! Coupled with the glass beads, you will carry the strength of our ancestors.",
          zh: "白百合代表著純潔與勇敢！配上琉璃珠，你將承載祖先賜予的力量。",
          options: [
            { text_en: "I will be brave in learning English!", text_zh: "我學英文會非常勇敢！", target_id: 'badge_offer' }
          ]
        },
        badge_offer: {
          id: 'badge_offer',
          speaker: '百合設計師 (Stylist Lily)',
          en: "Hold your head high! You are our proud tribal scholar.",
          zh: "昂首闊步吧！你是我們引以為傲的部落學者。",
          options: [
            { text_en: "Thank you, Stylist Lily!", text_zh: "謝謝百合設計師！", target_id: 'END' }
          ]
        }
      }
    }
  ],

  // ── 🎬 山豬影城野豬售票員 (3 部輪播檔期電影篇) ──
  cinema: [
    {
      variantId: 'cinema_v0',
      title: '熱映強檔：《雲豹大冒險 3D》',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '野豬售票員 (Clerk Boar)',
          en: "Hey there! Welcome to Boar Cinema! It is a fantastic weekend for movies. Would you like a ticket or some popcorn?",
          zh: "嗨，朋友！歡迎來到山豬影城！這真是看電影的完美週末。你想要電影票還是香濃爆米花呢？",
          options: [
            { text_en: "I want popcorn and a ticket!", text_zh: "我想要爆米花和電影票！", action: 'OPEN_SHOP' },
            { text_en: "What movie is playing today?", text_zh: "今天正在上映什麼電影呢？", target_id: 'movie_info' },
            { text_en: "What do you like to do on weekends?", text_zh: "你週末喜歡做什麼呢？", target_id: 'weekend_chat' }
          ]
        },
        movie_info: {
          id: 'movie_info',
          speaker: '野豬售票員 (Clerk Boar)',
          en: "We are showing 'The Legend of Cloud Leopard 3D'! It has exciting adventures, flying squirrels, and cheerful music.",
          zh: "我們正在上映《雲豹大冒險 3D》！裡面有刺激的冒險、會飛的松鼠，還有歡樂的配樂喔。",
          options: [
            { text_en: "I definitely want to watch it!", text_zh: "我一定要看這部電影！", action: 'OPEN_SHOP' },
            { text_en: "Sounds like a great movie!", text_zh: "聽起來是一部超棒的電影！", target_id: 'farewell' }
          ]
        },
        weekend_chat: {
          id: 'weekend_chat',
          speaker: '野豬售票員 (Clerk Boar)',
          en: "In my free time, I like playing basketball, listening to lively music, and eating sandwiches! What about you?",
          zh: "休閒時間裡，我喜歡打籃球、聽歡樂的音樂，還有大口吃三明治！你呢？",
          options: [
            { text_en: "I like studying English and playing games!", text_zh: "我喜歡學英文和玩益智遊戲！", target_id: 'farewell' }
          ]
        },
        farewell: {
          id: 'farewell',
          speaker: '野豬售票員 (Clerk Boar)',
          en: "Enjoy the show! Don't drop your popcorn on the floor!",
          zh: "好好享受這場電影！別把爆米花掉到地上喔！",
          options: [
            { text_en: "Thank you, Clerk Boar!", text_zh: "謝謝你，野豬售票員！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'cinema_v1',
      title: '熱映強檔：《百步蛇傳奇守護者》',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '野豬售票員 (Clerk Boar)',
          en: "Lights, camera, action! Today's feature presentation is 'The Hundred-Pace Guardian'! An epic tale of courage!",
          zh: "燈光、攝影機、開拍！今天上映的大片是《百步蛇傳奇守護者》！一場關於勇氣的史詩冒險！",
          options: [
            { text_en: "I want a movie ticket, please!", text_zh: "請給我一張電影票！", action: 'OPEN_SHOP' },
            { text_en: "Tell me about the Guardian story.", text_zh: "請跟我說說守護者的故事。", target_id: 'guardian_story' }
          ]
        },
        guardian_story: {
          id: 'guardian_story',
          speaker: '野豬售票員 (Clerk Boar)',
          en: "A young mountain adventurer saves the ancient forest using wisdom and kind words. It is deeply moving!",
          zh: "一位年輕的山林冒險家運用智慧與善良的話語拯救了古老森林。非常感人！",
          options: [
            { text_en: "Give me some butter popcorn and tickets!", text_zh: "請給我爆米花和電影票！", action: 'OPEN_SHOP' }
          ]
        }
      }
    },
    {
      variantId: 'cinema_v2',
      title: '熱映強檔：《飛鼠快俠與星空探險》',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '野豬售票員 (Clerk Boar)',
          en: "Zoom! Our fast flying squirrel hero is flying across the starry skies in 'Flying Squirrel Speedster'! Grab your seats!",
          zh: "咻！我們疾速飛鼠英雄正在《飛鼠快俠與星空探險》中劃過星空！快入座吧！",
          options: [
            { text_en: "I want popcorn and tickets!", text_zh: "我要爆米花和電影票！", action: 'OPEN_SHOP' }
          ]
        }
      }
    }
  ]
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

  // 2. 否則依據當日種子自多樣化對話樹池中選取當日輪替對話樹
  const variants = DIALOGUE_VARIANTS[locationId];
  if (Array.isArray(variants) && variants.length > 0) {
    const seed = getDaySeed(dateStr);
    return variants[seed % variants.length];
  }

  // 備援回退
  return DIALOGUE_VARIANTS.school[0];
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
