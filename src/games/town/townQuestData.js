/**
 * 霧臺英語宇宙 2.0 - 每日探索任務總資料庫 (52 款任務大師池)
 * 兩級數值防通膨機制：
 * - 🟢 普通任務 (Normal): 費用 0 金幣 (免費)，達成獎勵 +10 探索積分 (35 款)
 * - 🟡 高級任務 (Advanced): 費用 10 金幣，達成獎勵 +20 探索積分 (17 款)
 * 每日校長室布告欄自大師池中隨機開出 7 款精選任務 (4 普通 + 3 高級)，學生當日最多挑選 3 個完成。
 */

export const MAX_DAILY_QUESTS = 3;

export const DAILY_QUEST_MASTER_POOL = [
  {
    "id": "norm_talk_supermarket",
    "tier": "normal",
    "type": "talk",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "超市晨光打招呼",
    "titleEn": "Morning Greeting at Supermarket",
    "descriptionZh": "前往黑熊超市，與黑熊老闆進行一段日常英語問候。",
    "descriptionEn": "Visit Black Bear Supermarket and chat in English with Boss Bear.",
    "targetLocation": "supermarket",
    "targetLocationNameZh": "黑熊超市"
  },
  {
    "id": "norm_talk_bookstore",
    "tier": "normal",
    "type": "talk",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "書局愛讀書諮詢",
    "titleEn": "Reading Consultation at Bookstore",
    "descriptionZh": "前往貓頭鷹書局，向店長用英語請教推薦好書。",
    "descriptionEn": "Visit Owl Bookstore and consult about books in English.",
    "targetLocation": "bookstore",
    "targetLocationNameZh": "貓頭鷹書局"
  },
  {
    "id": "norm_talk_park",
    "tier": "normal",
    "type": "talk",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "飛鼠公園自然問答",
    "titleEn": "Nature Chat at Flying Squirrel Park",
    "descriptionZh": "前往飛鼠公園，向雲豹長老請教今日大自然與山嵐天氣。",
    "descriptionEn": "Visit Flying Squirrel Park and chat with Elder Cloud Leopard.",
    "targetLocation": "park",
    "targetLocationNameZh": "飛鼠公園"
  },
  {
    "id": "norm_talk_station",
    "tier": "normal",
    "type": "talk",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "火車站鐵道問候",
    "titleEn": "Railway Greeting at Train Station",
    "descriptionZh": "前往山林火車站，向穿山甲站長諮詢觀光列車與時刻。",
    "descriptionEn": "Visit Forest Train Station and ask about trains in English.",
    "targetLocation": "station",
    "targetLocationNameZh": "山林火車站"
  },
  {
    "id": "norm_talk_clinic",
    "tier": "normal",
    "type": "talk",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "診所保健生活談天",
    "titleEn": "Wellness Talk at Owl Clinic",
    "descriptionZh": "前往貓頭鷹診所，向山羊醫生請教健康生活好習慣。",
    "descriptionEn": "Visit Owl Clinic and learn healthy habits with Dr. Goat.",
    "targetLocation": "clinic",
    "targetLocationNameZh": "貓頭鷹診所"
  },
  {
    "id": "norm_talk_plaza",
    "tier": "normal",
    "type": "talk",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "集會所傳統文化問候",
    "titleEn": "Cultural Chat at Assembly Hall",
    "descriptionZh": "前往百步蛇集會所，與百合設計師交流傳統部落文化。",
    "descriptionEn": "Visit Hundred-Pace Assembly Hall and chat with Stylist Lily.",
    "targetLocation": "plaza",
    "targetLocationNameZh": "百步蛇集會所"
  },
  {
    "id": "norm_talk_cinema",
    "tier": "normal",
    "type": "talk",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "露天影城熱門新片諮詢",
    "titleEn": "Movie Talk at Open-Air Cinema",
    "descriptionZh": "前往森林露天電影院，向野豬售票員問候熱門動畫新片。",
    "descriptionEn": "Visit Open-Air Cinema and chat about movies with Clerk Boar.",
    "targetLocation": "cinema",
    "targetLocationNameZh": "露天電影院"
  },
  {
    "id": "norm_talk_school",
    "tier": "normal",
    "type": "talk",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "國小晨光學習報告",
    "titleEn": "Morning Study Report at School",
    "descriptionZh": "前往霧臺國小，向校長分享今日元氣滿滿的英語學習決心！",
    "descriptionEn": "Visit Wutai Elementary School and greet Principal enthusiastically.",
    "targetLocation": "school",
    "targetLocationNameZh": "霧臺國小"
  },
  {
    "id": "norm_buy_apple",
    "tier": "normal",
    "type": "buy_item",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "高山紅蘋果採買",
    "titleEn": "Buy a Fresh Red Apple",
    "descriptionZh": "前往黑熊超市，挑選一顆香甜多汁的紅蘋果 (Red Apple) 放入背包。",
    "descriptionEn": "Visit Supermarket and buy a Red Apple.",
    "targetLocation": "supermarket",
    "targetLocationNameZh": "黑熊超市",
    "targetItemId": "apple_item"
  },
  {
    "id": "norm_buy_banana",
    "tier": "normal",
    "type": "buy_item",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "元氣香蕉補給",
    "titleEn": "Buy an Energy Banana",
    "descriptionZh": "前往黑熊超市，選購一根營養熟甜的香蕉 (Banana)。",
    "descriptionEn": "Visit Supermarket and purchase a Banana.",
    "targetLocation": "supermarket",
    "targetLocationNameZh": "黑熊超市",
    "targetItemId": "banana_item"
  },
  {
    "id": "norm_buy_sandwich",
    "tier": "normal",
    "type": "buy_item",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "美味三明治採買",
    "titleEn": "Buy a Delicious Sandwich",
    "descriptionZh": "前往黑熊超市，選購一份熱騰騰美味三明治 (Sandwich)。",
    "descriptionEn": "Visit Supermarket and buy a Sandwich.",
    "targetLocation": "supermarket",
    "targetLocationNameZh": "黑熊超市",
    "targetItemId": "sandwich_item"
  },
  {
    "id": "norm_buy_milk",
    "tier": "normal",
    "type": "buy_item",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "高鈣冰牛奶補給",
    "titleEn": "Buy Cold Milk",
    "descriptionZh": "前往黑熊超市，選購一瓶純淨冰牛奶 (Cold Milk)。",
    "descriptionEn": "Visit Supermarket and buy Cold Milk.",
    "targetLocation": "supermarket",
    "targetLocationNameZh": "黑熊超市",
    "targetItemId": "milk_item"
  },
  {
    "id": "norm_buy_juice",
    "tier": "normal",
    "type": "buy_item",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "鮮榨柳橙汁選購",
    "titleEn": "Buy Fresh Orange Juice",
    "descriptionZh": "前往黑熊超市，購買一瓶充滿維他命 C 的柳橙汁 (Orange Juice)。",
    "descriptionEn": "Visit Supermarket and buy Orange Juice.",
    "targetLocation": "supermarket",
    "targetLocationNameZh": "黑熊超市",
    "targetItemId": "juice_item"
  },
  {
    "id": "norm_buy_pizza",
    "tier": "normal",
    "type": "buy_item",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "特濃起司披薩選購",
    "titleEn": "Buy a Slice of Pizza",
    "descriptionZh": "前往黑熊超市，購買一片香濃美味的起司披薩 (Pizza Slice)。",
    "descriptionEn": "Visit Supermarket and buy a Pizza Slice.",
    "targetLocation": "supermarket",
    "targetLocationNameZh": "黑熊超市",
    "targetItemId": "pizza_item"
  },
  {
    "id": "norm_buy_pencil",
    "tier": "normal",
    "type": "buy_item",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "好用學習鉛筆選購",
    "titleEn": "Buy a Wooden Pencil",
    "descriptionZh": "前往貓頭鷹書局，挑選一枝好寫好握的鉛筆 (Pencil)。",
    "descriptionEn": "Visit Owl Bookstore and buy a Pencil.",
    "targetLocation": "bookstore",
    "targetLocationNameZh": "貓頭鷹書局",
    "targetItemId": "pencil_item"
  },
  {
    "id": "norm_buy_eraser",
    "tier": "normal",
    "type": "buy_item",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "乾淨橡皮擦選購",
    "titleEn": "Buy a Clean Eraser",
    "descriptionZh": "前往貓頭鷹書局，選購一塊擦拭乾淨的橡皮擦 (Eraser)。",
    "descriptionEn": "Visit Owl Bookstore and buy an Eraser.",
    "targetLocation": "bookstore",
    "targetLocationNameZh": "貓頭鷹書局",
    "targetItemId": "eraser_item"
  },
  {
    "id": "norm_buy_ruler",
    "tier": "normal",
    "type": "buy_item",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "測量透明直尺選購",
    "titleEn": "Buy a Clear Ruler",
    "descriptionZh": "前往貓頭鷹書局，選購一把筆直清晰的測量直尺 (Ruler)。",
    "descriptionEn": "Visit Owl Bookstore and buy a Ruler.",
    "targetLocation": "bookstore",
    "targetLocationNameZh": "貓頭鷹書局",
    "targetItemId": "ruler_item"
  },
  {
    "id": "norm_buy_marker",
    "tier": "normal",
    "type": "buy_item",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "彩繪麥克筆選購",
    "titleEn": "Buy a Color Marker",
    "descriptionZh": "前往貓頭鷹書局，挑選一枝色彩鮮豔的彩繪麥克筆 (Marker)。",
    "descriptionEn": "Visit Owl Bookstore and buy a Marker.",
    "targetLocation": "bookstore",
    "targetLocationNameZh": "貓頭鷹書局",
    "targetItemId": "marker_item"
  },
  {
    "id": "norm_buy_workbook",
    "tier": "normal",
    "type": "buy_item",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "英語冒險作業本選購",
    "titleEn": "Buy an English Workbook",
    "descriptionZh": "前往貓頭鷹書局，購買一本記錄學習進步的筆記本 (Workbook)。",
    "descriptionEn": "Visit Owl Bookstore and buy a Workbook.",
    "targetLocation": "bookstore",
    "targetLocationNameZh": "貓頭鷹書局",
    "targetItemId": "workbook_item"
  },
  {
    "id": "norm_buy_bus_ticket",
    "tier": "normal",
    "type": "buy_item",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "客運巴士票採買",
    "titleEn": "Buy a Bus Ticket",
    "descriptionZh": "前往山林火車站，選購一張前往市區的客運單程票 (Bus Ticket)。",
    "descriptionEn": "Visit Train Station and buy a Bus Ticket.",
    "targetLocation": "station",
    "targetLocationNameZh": "山林火車站",
    "targetItemId": "bus_ticket"
  },
  {
    "id": "norm_buy_train_ticket",
    "tier": "normal",
    "type": "buy_item",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "火車聯票採買",
    "titleEn": "Buy a Train Ticket",
    "descriptionZh": "前往山林火車站，選購一張快線火車聯票 (Train Ticket)。",
    "descriptionEn": "Visit Train Station and buy an Express Train Ticket.",
    "targetLocation": "station",
    "targetLocationNameZh": "山林火車站",
    "targetItemId": "train_ticket"
  },
  {
    "id": "norm_buy_bicycle_bell",
    "tier": "normal",
    "type": "buy_item",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "單車可愛鈴鐺選購",
    "titleEn": "Buy a Bicycle Bell",
    "descriptionZh": "前往山林火車站，購買一個清脆響亮的單車鈴鐺 (Bicycle Bell)。",
    "descriptionEn": "Visit Train Station and buy a Bicycle Bell.",
    "targetLocation": "station",
    "targetLocationNameZh": "山林火車站",
    "targetItemId": "bicycle_bell"
  },
  {
    "id": "norm_buy_throat_lozenge",
    "tier": "normal",
    "type": "buy_item",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "清涼潤喉薄荷糖採買",
    "titleEn": "Buy Mint Throat Lozenges",
    "descriptionZh": "前往貓頭鷹診所，購買一包清涼舒爽的潤喉薄荷糖 (Throat Lozenges)。",
    "descriptionEn": "Visit Clinic and buy Mint Throat Lozenges.",
    "targetLocation": "clinic",
    "targetLocationNameZh": "貓頭鷹診所",
    "targetItemId": "throat_lozenge"
  },
  {
    "id": "norm_buy_cooling_patch",
    "tier": "normal",
    "type": "buy_item",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "退熱冰冰貼選購",
    "titleEn": "Buy a Cooling Patch",
    "descriptionZh": "前往貓頭鷹診所，購買一包舒緩降溫的退熱冰冰貼 (Cooling Patch)。",
    "descriptionEn": "Visit Clinic and buy a Cooling Patch.",
    "targetLocation": "clinic",
    "targetLocationNameZh": "貓頭鷹診所",
    "targetItemId": "cooling_patch"
  },
  {
    "id": "norm_buy_water_bottle",
    "tier": "normal",
    "type": "buy_item",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "活力健康大水壺選購",
    "titleEn": "Buy a Healthy Water Bottle",
    "descriptionZh": "前往貓頭鷹診所，選購一個多喝溫水的健康大水壺 (Water Bottle)。",
    "descriptionEn": "Visit Clinic and buy a Water Bottle.",
    "targetLocation": "clinic",
    "targetLocationNameZh": "貓頭鷹診所",
    "targetItemId": "water_bottle_item"
  },
  {
    "id": "norm_buy_movie_ticket",
    "tier": "normal",
    "type": "buy_item",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "冒險電影全票選購",
    "titleEn": "Buy a Movie Ticket",
    "descriptionZh": "前往露天電影院，購買一張精彩 3D 動畫電影全票 (Movie Ticket)。",
    "descriptionEn": "Visit Cinema and buy a Movie Ticket.",
    "targetLocation": "cinema",
    "targetLocationNameZh": "露天電影院",
    "targetItemId": "movie_ticket"
  },
  {
    "id": "norm_buy_popcorn",
    "tier": "normal",
    "type": "buy_item",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "奶油香甜爆米花採買",
    "titleEn": "Buy Butter Popcorn",
    "descriptionZh": "前往露天電影院，購買一桶香脆可口的奶油爆米花 (Popcorn)。",
    "descriptionEn": "Visit Cinema and buy Butter Popcorn.",
    "targetLocation": "cinema",
    "targetLocationNameZh": "露天電影院",
    "targetItemId": "popcorn_item"
  },
  {
    "id": "norm_buy_lily_badge",
    "tier": "normal",
    "type": "buy_item",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "純潔百合學習紀念章收藏",
    "titleEn": "Collect White Lily Cultural Badge",
    "descriptionZh": "前往百步蛇集會所，收藏一枚象徵純潔與勇氣的百合學習紀念章！",
    "descriptionEn": "Visit Assembly Hall and collect the White Lily Cultural Badge.",
    "targetLocation": "plaza",
    "targetLocationNameZh": "百步蛇集會所",
    "targetItemId": "lily_badge"
  },
  {
    "id": "norm_buy_glass_bead",
    "tier": "normal",
    "type": "buy_item",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "部落勇士琉璃珠項鍊收藏",
    "titleEn": "Collect Glass Bead Necklace",
    "descriptionZh": "前往百步蛇集會所，收藏一條傳承守護祝福的勇士琉璃珠項鍊。",
    "descriptionEn": "Visit Assembly Hall and collect Glass Bead Necklace.",
    "targetLocation": "plaza",
    "targetLocationNameZh": "百步蛇集會所",
    "targetItemId": "glass_bead"
  },
  {
    "id": "norm_buy_warrior_hat",
    "tier": "normal",
    "type": "buy_item",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "部落獵人帥氣帽選購",
    "titleEn": "Buy a Hunter Cap",
    "descriptionZh": "前往百步蛇集會所，選購一頂英氣十足的部落獵人帥氣帽子。",
    "descriptionEn": "Visit Assembly Hall and buy a Hunter Cap.",
    "targetLocation": "plaza",
    "targetLocationNameZh": "百步蛇集會所",
    "targetItemId": "warrior_hat"
  },
  {
    "id": "norm_explore_food",
    "tier": "normal",
    "type": "buy_category",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "超市健康美食品味",
    "titleEn": "Healthy Food Taste at Supermarket",
    "descriptionZh": "前往黑熊超市，選購任意一項美味水果或健康點心。",
    "descriptionEn": "Visit Supermarket and purchase any healthy food item.",
    "targetLocation": "supermarket",
    "targetLocationNameZh": "黑熊超市",
    "targetCategory": "food"
  },
  {
    "id": "norm_explore_stationery",
    "tier": "normal",
    "type": "buy_category",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "書局文具用品採購",
    "titleEn": "Stationery Shopping at Bookstore",
    "descriptionZh": "前往貓頭鷹書局，選購任意一項文具用品充實書包。",
    "descriptionEn": "Visit Bookstore and buy any stationery supply.",
    "targetLocation": "bookstore",
    "targetLocationNameZh": "貓頭鷹書局",
    "targetCategory": "stationery"
  },
  {
    "id": "norm_explore_travel",
    "tier": "normal",
    "type": "talk_or_buy",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "山林鐵道出行準備",
    "titleEn": "Railway Travel Preparation",
    "descriptionZh": "前往火車站向穿山甲站長諮詢時刻，或購買一張車票地圖。",
    "descriptionEn": "Visit Train Station to chat or buy travel tickets.",
    "targetLocation": "station",
    "targetLocationNameZh": "山林火車站"
  },
  {
    "id": "norm_explore_wellness",
    "tier": "normal",
    "type": "talk_or_buy",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "貓頭鷹診所日常健康保養",
    "titleEn": "Daily Wellness Care at Clinic",
    "descriptionZh": "前往貓頭鷹診所請教醫生健康話題，或選購薄荷糖等保健物資。",
    "descriptionEn": "Visit Clinic for wellness talk or health items.",
    "targetLocation": "clinic",
    "targetLocationNameZh": "貓頭鷹診所"
  },
  {
    "id": "norm_explore_culture",
    "tier": "normal",
    "type": "talk_or_buy",
    "cost": 0,
    "rewardPoints": 10,
    "titleZh": "集會所傳統圖騰欣賞",
    "titleEn": "Totem & Culture Appreciation",
    "descriptionZh": "前往集會所向設計師請教傳統百合花，或選購一件文化紀念品。",
    "descriptionEn": "Visit Assembly Hall for cultural dialogue or items.",
    "targetLocation": "plaza",
    "targetLocationNameZh": "百步蛇集會所"
  },
  {
    "id": "adv_tour_book_supermarket",
    "tier": "advanced",
    "type": "multi_tour",
    "cost": 10,
    "rewardPoints": 20,
    "titleZh": "【雙點巡禮】好學能量補給日",
    "titleEn": "Bookstore & Supermarket Tour",
    "descriptionZh": "投注 10 金幣解鎖！完成雙重巡禮：先至貓頭鷹書局請教好書，再前往黑熊超市完成英語交談！",
    "descriptionEn": "Invest 10 coins! Visit both Owl Bookstore and Black Bear Supermarket.",
    "targetLocations": [
      "bookstore",
      "supermarket"
    ],
    "targetLocationsNamesZh": [
      "貓頭鷹書局",
      "黑熊超市"
    ]
  },
  {
    "id": "adv_tour_park_clinic",
    "tier": "advanced",
    "type": "multi_tour",
    "cost": 10,
    "rewardPoints": 20,
    "titleZh": "【雙點巡禮】山林森呼吸健康行",
    "titleEn": "Park Nature & Clinic Wellness Tour",
    "descriptionZh": "投注 10 金幣解鎖！完成雙重巡禮：前往飛鼠公園享受芬多精，並至診所向醫生請教健康好習慣！",
    "descriptionEn": "Invest 10 coins! Visit Flying Squirrel Park and Owl Clinic.",
    "targetLocations": [
      "park",
      "clinic"
    ],
    "targetLocationsNamesZh": [
      "飛鼠公園",
      "貓頭鷹診所"
    ]
  },
  {
    "id": "adv_tour_station_cinema",
    "tier": "advanced",
    "type": "multi_tour",
    "cost": 10,
    "rewardPoints": 20,
    "titleZh": "【雙點巡禮】鐵道旅行與休閒影城",
    "titleEn": "Railway Station & Cinema Tour",
    "descriptionZh": "投注 10 金幣解鎖！完成雙重巡禮：前往山林火車站問候站長，並至露天電影院聊聊熱門新片！",
    "descriptionEn": "Invest 10 coins! Visit Forest Train Station and Open-Air Cinema.",
    "targetLocations": [
      "station",
      "cinema"
    ],
    "targetLocationsNamesZh": [
      "山林火車站",
      "露天電影院"
    ]
  },
  {
    "id": "adv_tour_plaza_school",
    "tier": "advanced",
    "type": "multi_tour",
    "cost": 10,
    "rewardPoints": 20,
    "titleZh": "【雙點巡禮】傳統文化與校園巡禮",
    "titleEn": "Assembly Hall & School Tour",
    "descriptionZh": "投注 10 金幣解鎖！完成雙重巡禮：拜訪百步蛇集會所了解傳統圖騰，並回到國小向校長報告！",
    "descriptionEn": "Invest 10 coins! Visit Assembly Hall and Wutai Elementary School.",
    "targetLocations": [
      "plaza",
      "school"
    ],
    "targetLocationsNamesZh": [
      "百步蛇集會所",
      "霧臺國小"
    ]
  },
  {
    "id": "adv_tour_supermarket_park",
    "tier": "advanced",
    "type": "multi_tour",
    "cost": 10,
    "rewardPoints": 20,
    "titleZh": "【雙點巡禮】超市點心與公園漫步",
    "titleEn": "Supermarket Snacks & Park Walk",
    "descriptionZh": "投注 10 金幣解鎖！完成雙重巡禮：至黑熊超市選購美味點心，並前往飛鼠公園與長老談天！",
    "descriptionEn": "Invest 10 coins! Visit Supermarket and Flying Squirrel Park.",
    "targetLocations": [
      "supermarket",
      "park"
    ],
    "targetLocationsNamesZh": [
      "黑熊超市",
      "飛鼠公園"
    ]
  },
  {
    "id": "adv_tour_bookstore_station",
    "tier": "advanced",
    "type": "multi_tour",
    "cost": 10,
    "rewardPoints": 20,
    "titleZh": "【雙點巡禮】書香伴旅程遠足行",
    "titleEn": "Bookstore & Train Station Tour",
    "descriptionZh": "投注 10 金幣解鎖！完成雙重巡禮：至書局挑選一本好書，並至火車站請教觀光列車路線！",
    "descriptionEn": "Invest 10 coins! Visit Owl Bookstore and Train Station.",
    "targetLocations": [
      "bookstore",
      "station"
    ],
    "targetLocationsNamesZh": [
      "貓頭鷹書局",
      "山林火車站"
    ]
  },
  {
    "id": "adv_tour_clinic_plaza",
    "tier": "advanced",
    "type": "multi_tour",
    "cost": 10,
    "rewardPoints": 20,
    "titleZh": "【雙點巡禮】小鎮衛士與部落勇士行",
    "titleEn": "Clinic & Assembly Hall Tour",
    "descriptionZh": "投注 10 金幣解鎖！完成雙重巡禮：至診所向醫生請教健康秘訣，並至集會所欣賞百合花榮譽！",
    "descriptionEn": "Invest 10 coins! Visit Clinic and Hundred-Pace Assembly Hall.",
    "targetLocations": [
      "clinic",
      "plaza"
    ],
    "targetLocationsNamesZh": [
      "貓頭鷹診所",
      "百步蛇集會所"
    ]
  },
  {
    "id": "adv_tour_park_cinema",
    "tier": "advanced",
    "type": "multi_tour",
    "cost": 10,
    "rewardPoints": 20,
    "titleZh": "【雙點巡禮】自然微風與星空觀影",
    "titleEn": "Park Breeze & Cinema Tour",
    "descriptionZh": "投注 10 金幣解鎖！完成雙重巡禮：至公園欣賞大自然風景，並前往露天電影院感受歡樂！",
    "descriptionEn": "Invest 10 coins! Visit Flying Squirrel Park and Cinema.",
    "targetLocations": [
      "park",
      "cinema"
    ],
    "targetLocationsNamesZh": [
      "飛鼠公園",
      "露天電影院"
    ]
  },
  {
    "id": "adv_tour_school_supermarket",
    "tier": "advanced",
    "type": "multi_tour",
    "cost": 10,
    "rewardPoints": 20,
    "titleZh": "【雙點巡禮】放學補給與晨光學習",
    "titleEn": "School Greeting & Supermarket Trip",
    "descriptionZh": "投注 10 金幣解鎖！完成雙重巡禮：在學校分享晨光精神，並至黑熊超市採購能量水果！",
    "descriptionEn": "Invest 10 coins! Visit Elementary School and Supermarket.",
    "targetLocations": [
      "school",
      "supermarket"
    ],
    "targetLocationsNamesZh": [
      "霧臺國小",
      "黑熊超市"
    ]
  },
  {
    "id": "adv_tour_station_plaza",
    "tier": "advanced",
    "type": "multi_tour",
    "cost": 10,
    "rewardPoints": 20,
    "titleZh": "【雙點巡禮】山林鐵道與傳統圖騰",
    "titleEn": "Station Travel & Tribal Totem Tour",
    "descriptionZh": "投注 10 金幣解鎖！完成雙重巡禮：前往火車站諮詢車票，並至百步蛇集會所探索琉璃珠傳奇！",
    "descriptionEn": "Invest 10 coins! Visit Train Station and Assembly Hall.",
    "targetLocations": [
      "station",
      "plaza"
    ],
    "targetLocationsNamesZh": [
      "山林火車站",
      "百步蛇集會所"
    ]
  },
  {
    "id": "adv_action_picnic",
    "tier": "advanced",
    "type": "buy_and_visit",
    "cost": 10,
    "rewardPoints": 20,
    "titleZh": "【野餐行動】山林野餐準備行",
    "titleEn": "Picnic Preparation Journey",
    "descriptionZh": "投注 10 金幣解鎖！在黑熊超市採買三明治或蘋果，並前往飛鼠公園向長老完成英語對話！",
    "descriptionEn": "Invest 10 coins! Buy snacks at Supermarket, then talk to Elder at Flying Squirrel Park.",
    "buyLocation": "supermarket",
    "targetLocation": "park",
    "validItemIds": [
      "sandwich_item",
      "apple_item",
      "banana_item"
    ],
    "targetLocationNameZh": "飛鼠公園"
  },
  {
    "id": "adv_action_study_supplies",
    "tier": "advanced",
    "type": "buy_and_visit",
    "cost": 10,
    "rewardPoints": 20,
    "titleZh": "【好學行動】文具採買與校長報告",
    "titleEn": "Study Supplies & Principal Talk",
    "descriptionZh": "投注 10 金幣解鎖！在貓頭鷹書局選購鉛筆或作業本，並前往霧臺國小向校長完成英語對話！",
    "descriptionEn": "Invest 10 coins! Buy stationery at Bookstore, then greet Principal at School.",
    "buyLocation": "bookstore",
    "targetLocation": "school",
    "validItemIds": [
      "pencil_item",
      "eraser_item",
      "workbook_item",
      "marker_item"
    ],
    "targetLocationNameZh": "霧臺國小"
  },
  {
    "id": "adv_action_wellness_walk",
    "tier": "advanced",
    "type": "buy_and_visit",
    "cost": 10,
    "rewardPoints": 20,
    "titleZh": "【健康行動】潤喉糖採買與晨間漫步",
    "titleEn": "Wellness Lozenges & Park Walk",
    "descriptionZh": "投注 10 金幣解鎖！在貓頭鷹診所購買薄荷潤喉糖或水壺，並前往飛鼠公園完成大自然對話！",
    "descriptionEn": "Invest 10 coins! Buy throat lozenges at Clinic, then chat at Park.",
    "buyLocation": "clinic",
    "targetLocation": "park",
    "validItemIds": [
      "throat_lozenge",
      "water_bottle_item"
    ],
    "targetLocationNameZh": "飛鼠公園"
  },
  {
    "id": "adv_action_movie_feast",
    "tier": "advanced",
    "type": "buy_and_visit",
    "cost": 10,
    "rewardPoints": 20,
    "titleZh": "【觀影行動】爆米花享受與影城閒聊",
    "titleEn": "Movie Popcorn & Cinema Chat",
    "descriptionZh": "投注 10 金幣解鎖！在電影院購買奶油爆米花，並向野豬售票員請教熱映精彩強檔！",
    "descriptionEn": "Invest 10 coins! Buy popcorn at Cinema, and talk with Clerk Boar.",
    "buyLocation": "cinema",
    "targetLocation": "cinema",
    "validItemIds": [
      "popcorn_item",
      "movie_ticket"
    ],
    "targetLocationNameZh": "露天電影院"
  },
  {
    "id": "adv_action_railway_trip",
    "tier": "advanced",
    "type": "buy_and_visit",
    "cost": 10,
    "rewardPoints": 20,
    "titleZh": "【鐵道行者】車票選購與站台諮詢",
    "titleEn": "Railway Ticket & Station Master Chat",
    "descriptionZh": "投注 10 金幣解鎖！在火車站購買觀光火車票或巴士票，並向穿山甲站長請教旅程！",
    "descriptionEn": "Invest 10 coins! Buy tickets at Station, and chat with Station Master.",
    "buyLocation": "station",
    "targetLocation": "station",
    "validItemIds": [
      "bus_ticket",
      "train_ticket",
      "bicycle_bell"
    ],
    "targetLocationNameZh": "山林火車站"
  },
  {
    "id": "adv_action_warrior_honor",
    "tier": "advanced",
    "type": "buy_and_visit",
    "cost": 10,
    "rewardPoints": 20,
    "titleZh": "【榮譽勇士】傳統百合花精神學習",
    "titleEn": "Warrior Honor & Cultural Badge",
    "descriptionZh": "投注 10 金幣解鎖！在集會所收藏純潔百合紀念章或琉璃珠，並與百合設計師英語交談！",
    "descriptionEn": "Invest 10 coins! Collect Lily Badge at Assembly Hall, and chat with Stylist Lily.",
    "buyLocation": "plaza",
    "targetLocation": "plaza",
    "validItemIds": [
      "lily_badge",
      "glass_bead",
      "warrior_hat"
    ],
    "targetLocationNameZh": "百步蛇集會所"
  },
  {
    "id": "adv_action_grand_tour_3",
    "tier": "advanced",
    "type": "grand_tour",
    "cost": 10,
    "rewardPoints": 20,
    "titleZh": "【小鎮特派員】三地標探索大巡禮",
    "titleEn": "Grand Town 3-Landmark Explorer",
    "descriptionZh": "投注 10 金幣挑戰！走訪小鎮任意 3 個不同地標並完成英語互動，成為全能探險家！",
    "descriptionEn": "Invest 10 coins! Visit any 3 different town landmarks and engage in English dialogues.",
    "requiredCount": 3
  }
];

export const NORMAL_QUESTS = DAILY_QUEST_MASTER_POOL.filter(q => q.tier === 'normal');
export const ADVANCED_QUESTS = DAILY_QUEST_MASTER_POOL.filter(q => q.tier === 'advanced');

// 依據台灣連續日序號，每日自 52 款任務大師池中挑選 7 款每日任務 (4 普通 + 3 高級)
export const getDailyQuestBoard = (dateStr) => {
  // 動態依日期計算 Epoch Day
  let epochDay = 0;
  try {
    const timestamp = Date.parse(`${dateStr}T12:00:00+08:00`);
    if (!isNaN(timestamp)) {
      epochDay = Math.floor(timestamp / 86400000);
    }
  } catch (e) {}

  const pickedNormal = [];
  const normalLen = NORMAL_QUESTS.length;
  // 挑選 4 款不重複普通任務
  for (let i = 0; i < 4; i++) {
    const idx = (epochDay * 7 + i * 5) % normalLen;
    pickedNormal.push(NORMAL_QUESTS[idx]);
  }

  const pickedAdvanced = [];
  const advancedLen = ADVANCED_QUESTS.length;
  // 挑選 3 款不重複高級任務
  for (let i = 0; i < 3; i++) {
    const idx = (epochDay * 5 + i * 4) % advancedLen;
    pickedAdvanced.push(ADVANCED_QUESTS[idx]);
  }

  return [...pickedNormal, ...pickedAdvanced];
};

export default DAILY_QUEST_MASTER_POOL;
