// ── 《鷹眼神探 • 單字找不同》 關卡資料與差異庫 ──
// 涵蓋 6 大差異類型：顏色差異、存在差異、大小差異、數量差異、位移差異、符號文字差異

export const DIFFERENCE_CATEGORIES = [
  { id: 'color', labelZh: '顏色差異', color: 'text-amber-500', icon: '🎨' },
  { id: 'presence', labelZh: '存在差異', color: 'text-emerald-500', icon: '✨' },
  { id: 'size', labelZh: '大小差異', color: 'text-blue-500', icon: '🔍' },
  { id: 'quantity', labelZh: '數量差異', color: 'text-purple-500', icon: '🔢' },
  { id: 'displacement', labelZh: '位移差異', color: 'text-rose-500', icon: '📍' },
  { id: 'text', labelZh: '符號文字', color: 'text-cyan-500', icon: '🔤' }
];

export const SPOTTER_SCENES = [
  {
    id: 'plaza_market',
    book: '3',
    titleZh: '陽光市集與街角露天咖啡座',
    titleEn: 'Sunshine Plaza & Street Café',
    descZh: '在熱鬧的午後街角，找尋 10 處隱蔽的相異之處，鎖定聚光燈並指認單字！',
    width: 1000,
    height: 650,
    // 10 處相異目標點
    differences: [
      {
        id: 'diff-juice',
        word: 'juice',
        wordZh: '果汁',
        type: 'color',
        typeZh: '顏色差異',
        descriptionZh: '左圖桌上是綠色奇異果汁，右圖桌上是鮮紅色西瓜汁',
        x: 320,
        y: 440,
        radius: 46
      },
      {
        id: 'diff-tea',
        word: 'tea',
        wordZh: '茶',
        type: 'color',
        typeZh: '顏色差異',
        descriptionZh: '左圖茶几上是金黃琥珀洋甘菊茶，右圖是紫色花果茶',
        x: 235,
        y: 465,
        radius: 46
      },
      {
        id: 'diff-icecream',
        word: 'ice cream',
        wordZh: '冰淇淋',
        type: 'presence',
        typeZh: '存在差異',
        descriptionZh: '左圖甜點車上有雙球甜筒冰淇淋，右圖甜點架上空無一物',
        x: 830,
        y: 395,
        radius: 48
      },
      {
        id: 'diff-mooncake',
        word: 'moon cake',
        wordZh: '月餅',
        type: 'presence',
        typeZh: '存在差異',
        descriptionZh: '左圖盤中盛放著金黃烘焙月餅，右圖盤子是空的',
        x: 645,
        y: 450,
        radius: 46
      },
      {
        id: 'diff-watermelon',
        word: 'watermelon',
        wordZh: '西瓜',
        type: 'size',
        typeZh: '大小差異',
        descriptionZh: '左圖水果架上是特大號巨無霸西瓜，右圖是迷你袖珍西瓜',
        x: 135,
        y: 485,
        radius: 50
      },
      {
        id: 'diff-hamburger',
        word: 'hamburger',
        wordZh: '漢堡',
        type: 'size',
        typeZh: '大小差異',
        descriptionZh: '左圖餐桌上是特大雙層巨無霸漢堡，右圖是一口小漢堡',
        x: 485,
        y: 445,
        radius: 48
      },
      {
        id: 'diff-apple',
        word: 'apple',
        wordZh: '蘋果',
        type: 'quantity',
        typeZh: '數量差異',
        descriptionZh: '左圖木箱裝滿 5 顆紅蘋果，右圖箱內只有 2 顆蘋果',
        x: 85,
        y: 410,
        radius: 48
      },
      {
        id: 'diff-hotdog',
        word: 'hot dog',
        wordZh: '熱狗',
        type: 'quantity',
        typeZh: '數量差異',
        descriptionZh: '左圖烤架上排列著 3 份熱狗堡，右圖只有 1 份熱狗堡',
        x: 745,
        y: 450,
        radius: 48
      },
      {
        id: 'diff-banana',
        word: 'banana',
        wordZh: '香蕉',
        type: 'displacement',
        typeZh: '位移差異',
        descriptionZh: '左圖香蕉平放在桌面，右圖香蕉懸掛在上方的黃銅掛鉤上',
        x: 180,
        y: 435,
        altX: 180,
        altY: 285,
        radius: 48
      },
      {
        id: 'diff-sixteen',
        word: 'sixteen',
        wordZh: '十六',
        type: 'text',
        typeZh: '符號文字',
        descriptionZh: '左圖街燈古典掛牌為 16 號，右圖掛牌為 20 號',
        x: 395,
        y: 195,
        radius: 46
      }
    ],

    // 誘答庫：場景中確實繪製的所有其他單字（保證 Word Bank 選項均真實存在於圖中）
    distractors: [
      { word: 'sandwich', wordZh: '三明治' },
      { word: 'cake', wordZh: '蛋糕' },
      { word: 'pizza', wordZh: '披薩' },
      { word: 'milk', wordZh: '牛奶' },
      { word: 'water', wordZh: '水' },
      { word: 'orange', wordZh: '柳橙' },
      { word: 'sunny', wordZh: '晴朗的' },
      { word: 'cloudy', wordZh: '多雲的' },
      { word: 'windy', wordZh: '颳風的' },
      { word: 'happy', wordZh: '快樂的' },
      { word: 'angry', wordZh: '生氣的' },
      { word: 'tired', wordZh: '很累的' },
      { word: 'hungry', wordZh: '肚子餓的' },
      { word: 'rice', wordZh: '米飯' },
      { word: 'pomelo', wordZh: '柚子' },
      { word: 'twenty', wordZh: '二十' }
    ]
  }
];
