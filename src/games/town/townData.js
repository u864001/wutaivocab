/**
 * 霧臺英語宇宙 2.0 - 霧臺小鎮 (Wutai Town) 全域資料庫
 * 整合現有 396 顆課綱單字，構建 9 大生活地標、零延遲對話樹、道具商店與每日任務！
 */

// ── 1. 霧臺小鎮 9 大社區地標清單 ──
export const TOWN_LOCATIONS = [
  {
    id: 'school',
    nameZh: '霧臺國小',
    nameEn: 'Wutai Elementary School',
    npcName: '校長 (Principal)',
    npcRole: '任務公佈欄與課堂生活',
    npcAvatar: '🏫',
    bgGradient: 'from-blue-600/20 via-indigo-500/20 to-teal-500/20',
    borderColor: 'border-blue-400 dark:border-blue-600',
    iconColor: 'text-blue-500',
    description: '公佈欄領取每日探索任務，分享學校英語與課堂作息。',
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
    bgGradient: 'from-amber-500/20 via-orange-500/20 to-yellow-500/20',
    borderColor: 'border-amber-400 dark:border-amber-600',
    iconColor: 'text-amber-500',
    description: '挑選鉛筆、橡皮擦與探險作業本，練習詢價購物。',
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
    bgGradient: 'from-emerald-500/20 via-green-500/20 to-teal-500/20',
    borderColor: 'border-emerald-400 dark:border-emerald-600',
    iconColor: 'text-emerald-500',
    description: '採買三明治、水果與飲料，餓了渴了快來補給！',
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
    bgGradient: 'from-teal-500/20 via-cyan-500/20 to-emerald-500/20',
    borderColor: 'border-teal-400 dark:border-teal-600',
    iconColor: 'text-teal-500',
    description: '微風吹拂的草地，觀察蝴蝶花朵，聊聊今天的天氣四季。',
    hasShop: false,
    hasQuests: false
  },
  {
    id: 'station',
    nameZh: '霧臺客運站',
    nameEn: 'Wutai Bus Station',
    npcName: '山豬司機 (Driver Boar)',
    npcRole: '交通路線與旅行車票',
    npcAvatar: '🐗',
    bgGradient: 'from-orange-500/20 via-amber-600/20 to-rose-500/20',
    borderColor: 'border-orange-400 dark:border-orange-600',
    iconColor: 'text-orange-500',
    description: '搭公車、騎自行車去旅行，出發前往屏東與高雄！',
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
    bgGradient: 'from-cyan-500/20 via-blue-500/20 to-indigo-500/20',
    borderColor: 'border-cyan-400 dark:border-cyan-600',
    iconColor: 'text-cyan-500',
    description: '感冒發燒或肚子痛？醫師為你檢查並提供健康糖果。',
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
    bgGradient: 'from-purple-500/20 via-pink-500/20 to-rose-500/20',
    borderColor: 'border-purple-400 dark:border-purple-600',
    iconColor: 'text-purple-500',
    description: '欣賞美麗的百合花與琉璃珠項鍊，挑選部落帥氣獵人帽。',
    hasShop: true,
    hasQuests: false
  },
  {
    id: 'cinema',
    nameZh: '山豬影城',
    nameEn: 'Boar Cinema',
    npcName: '售票員瑪莉歐 (Mario)',
    npcRole: '休閒電影與熱騰騰爆米花',
    npcAvatar: '🎬',
    bgGradient: 'from-rose-500/20 via-pink-600/20 to-purple-600/20',
    borderColor: 'border-rose-400 dark:border-rose-600',
    iconColor: 'text-rose-500',
    description: '週末最棒的娛樂！買張電影票，配上一大桶香脆爆米花。',
    hasShop: true,
    hasQuests: false
  },
  {
    id: 'home',
    nameZh: '學生溫馨的家',
    nameEn: 'Player Home',
    npcName: '個人背包倉庫 (Backpack)',
    npcRole: '整理房間與道具收納',
    npcAvatar: '🏡',
    bgGradient: 'from-lime-500/20 via-emerald-500/20 to-teal-500/20',
    borderColor: 'border-lime-400 dark:border-lime-600',
    iconColor: 'text-lime-500',
    description: '回到溫暖的家，打開背包查看所有收集品，整理你的書桌。',
    hasShop: false,
    hasBackpack: true
  }
];

// ── 2. 小鎮道具商品總目錄 (包含價格、分類與課綱單字) ──
export const TOWN_ITEMS = [
  // 📚 雲豹書局文具 (Stationery)
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

  // 🏪 黑熊超市美食與飲料 (Food & Drinks)
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

  // 🚌 霧臺客運站交通車票 (Transportation Tickets)
  {
    id: 'bus_ticket_pingtung',
    shopId: 'station',
    nameEn: 'Bus Ticket to Pingtung',
    nameZh: '屏東客運紀念車票',
    price: 20,
    icon: '🎫',
    category: 'ticket',
    description: '搭乘綠色屏東客運公車穿越山谷的通行證。'
  },
  {
    id: 'train_ticket_kaohsiung',
    shopId: 'station',
    nameEn: 'Train Ticket to Kaohsiung',
    nameZh: '高雄自強號火車票',
    price: 35,
    icon: '🚆',
    category: 'ticket',
    description: '通往熱鬧港都高雄的快速列車票券。'
  },
  {
    id: 'bicycle_bell',
    shopId: 'station',
    nameEn: 'Bicycle Bell',
    nameZh: '腳踏車清脆鈴鐺',
    price: 25,
    icon: '🔔',
    category: 'special',
    description: '騎腳踏車在霧臺蜿蜒小路上響起叮叮聲！'
  },

  // 🏥 貓頭鷹診所健康良藥 (Health & Wellness)
  {
    id: 'throat_lozenge',
    shopId: 'clinic',
    nameEn: 'Throat Lozenge',
    nameZh: '潤喉薄荷糖',
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

  // 🏛️ 百步蛇集會所傳統服飾與部落寶物 (Tribal Culture & Fashion)
  {
    id: 'lily_badge',
    shopId: 'plaza',
    nameEn: 'White Lily Badge',
    nameZh: '純潔百合勇士勳章',
    price: 50,
    icon: '⚜️',
    category: 'special',
    description: '魯凱族象徵尊貴與榮耀的白百合徽章！'
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

  // 🎬 山豬影城娛樂點心 (Cinema & Entertainment)
  {
    id: 'movie_ticket',
    shopId: 'cinema',
    nameEn: 'Movie Ticket',
    nameZh: '冒險電影全票',
    price: 50,
    icon: '🎟️',
    category: 'ticket',
    description: '《雲豹大冒險》3D 精彩動畫電影票。'
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

// ── 3. 預製精選對話樹引擎 (Pre-baked Pedagogical Dialogue Trees) ──
export const DIALOGUE_TREES = {
  // ── 1. 霧臺國小校長 ──
  school: {
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

  // ── 2. 雲豹書局店長 ──
  bookstore: {
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

  // ── 3. 黑熊超市店員 ──
  supermarket: {
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

  // ── 4. 飛鼠公園長老 ──
  park: {
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

  // ── 5. 霧臺客運站司機 ──
  station: {
    startNode: 'welcome',
    nodes: {
      welcome: {
        id: 'welcome',
        speaker: '山豬司機 (Driver Boar)',
        en: "Vroom vroom! Welcome to Wutai Bus Station. Where are you going today, little traveler?",
        zh: "嗡嗡嗡！歡迎來到霧臺客運站。今天要去哪裡旅行呢，小小旅行家？",
        options: [
          { text_en: "How do you go to Pingtung?", text_zh: "請問怎麼去屏東呢？", target_id: 'pingtung' },
          { text_en: "I want to buy a bus ticket.", text_zh: "我想買一張公車票。", action: 'OPEN_SHOP' },
          { text_en: "Can I ride my bike here?", text_zh: "我可以騎腳踏車嗎？", target_id: 'bike' }
        ]
      },
      pingtung: {
        id: 'pingtung',
        speaker: '山豬司機 (Driver Boar)',
        en: "You can go by bus! The green bus leaves every hour. It drives through our scenic mountain valleys.",
        zh: "你可以搭公車去！綠色的客運巴士每小時出發一班，會穿過我們壯麗的山谷喔。",
        options: [
          { text_en: "One bus ticket, please!", text_zh: "請給我一張公車票！", action: 'OPEN_SHOP' },
          { text_en: "Sounds like a fun trip!", text_zh: "聽起來是一趟好玩的旅程！", target_id: 'farewell' }
        ]
      },
      bike: {
        id: 'bike',
        speaker: '山豬司機 (Driver Boar)',
        en: "Riding a bicycle is great exercise! Remember to ring your bell around sharp corners and wear a helmet.",
        zh: "騎腳踏車是很棒的運動！過彎時記得按鈴鐺提醒，並且要戴好安全帽喔。",
        options: [
          { text_en: "Safety first! Thank you.", text_zh: "安全第一！謝謝司機先生。", target_id: 'farewell' }
        ]
      },
      farewell: {
        id: 'farewell',
        speaker: '山豬司機 (Driver Boar)',
        en: "Have a safe and happy journey! Fasten your seatbelt!",
        zh: "祝你有一趟安全又快樂的旅程！記得繫好安全帶！",
        options: [
          { text_en: "Goodbye, Driver Boar!", text_zh: "再見，山豬司機！", target_id: 'END' }
        ]
      }
    }
  },

  // ── 6. 貓頭鷹診所醫師 ──
  clinic: {
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

  // ── 7. 百步蛇集會所設計師 ──
  plaza: {
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

  // ── 8. 山豬影城售票員 ──
  cinema: {
    startNode: 'welcome',
    nodes: {
      welcome: {
        id: 'welcome',
        speaker: '售票員瑪莉歐 (Mario)',
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
        speaker: '售票員瑪莉歐 (Mario)',
        en: "We are showing 'The Legend of Cloud Leopard 3D'! It has exciting adventures, flying squirrels, and cheerful music.",
        zh: "我們正在上映《雲豹大冒險 3D》！裡面有刺激的冒險、會飛的松鼠，還有歡樂的配樂喔。",
        options: [
          { text_en: "I definitely want to watch it!", text_zh: "我一定要看這部電影！", action: 'OPEN_SHOP' },
          { text_en: "Sounds like a great movie!", text_zh: "聽起來是一部超棒的電影！", target_id: 'farewell' }
        ]
      },
      weekend_chat: {
        id: 'weekend_chat',
        speaker: '售票員瑪莉歐 (Mario)',
        en: "In my free time, I like playing basketball with Mark, listening to lively music, and eating sandwiches! What about you?",
        zh: "休閒時間裡，我喜歡和 Mark 老師打籃球、聽歡樂的音樂，還有大口吃三明治！你呢？",
        options: [
          { text_en: "I like studying English and playing games!", text_zh: "我喜歡學英文和玩益智遊戲！", target_id: 'farewell' }
        ]
      },
      farewell: {
        id: 'farewell',
        speaker: '售票員瑪莉歐 (Mario)',
        en: "Enjoy the show! Don't drop your popcorn on the floor!",
        zh: "好好享受這場電影！別把爆米花掉到地上喔！",
        options: [
          { text_en: "Thank you, Mario!", text_zh: "謝謝你，瑪莉歐！", target_id: 'END' }
        ]
      }
    }
  }
};

// ── 4. 每日任務系統清單 (3 大階層：免費/中階/高階冒險) ──
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
    descriptionZh: '前往黑熊超市，與黑熊店員進行一段英語問候，並購買任意一項健康點心。',
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
    descriptionZh: '投注 50 金幣解鎖！前往飛鼠公園向長老請教今日四季天氣，並至客運站購買一張公車票。',
    descriptionEn: 'Bet 50 coins! Chat about weather at Flying Squirrel Park, and buy a bus ticket at the station.',
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
    descriptionZh: '投注 50 金幣解鎖！前往貓頭鷹診所諮詢健康保健，並購買一包潤喉薄荷糖或健康大水壺。',
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
    descriptionZh: '投注 100 金幣解鎖高難度榮譽挑戰！前往百步蛇集會所了解白百合花涵義，購買純潔百合勇士勳章，並至山豬影城與瑪莉歐分享冒險故事！',
    descriptionEn: 'Bet 100 coins! Learn about the White Lily at the Gathering Hall, equip the Lily Badge, and chat with Mario at the cinema!',
    actionRequired: 'buy_lily_and_cinema',
    dialogueTarget: 'plaza'
  }
];
