// ── 《鷹眼神探 • 單字找不同》 20 大目標單字資料池與動態出題引擎 ──

export const DIFFERENCE_CATEGORIES = [
  { id: 'color', labelZh: '顏色差異', color: 'text-amber-500', icon: '🎨' },
  { id: 'presence', labelZh: '存在差異', color: 'text-emerald-500', icon: '✨' },
  { id: 'size', labelZh: '大小差異', color: 'text-blue-500', icon: '🔍' },
  { id: 'quantity', labelZh: '數量差異', color: 'text-purple-500', icon: '🔢' },
  { id: 'displacement', labelZh: '位移差異', color: 'text-rose-500', icon: '📍' },
  { id: 'text', labelZh: '符號文字', color: 'text-cyan-500', icon: '🔤' }
];

// 20 大待測目標單字池（均已預先繪製多種樣態變化）
export const TARGET_ITEMS_POOL = [
  {
    word: 'juice',
    wordZh: '果汁',
    x: 320,
    y: 440,
    radius: 46,
    variants: [
      { id: 'color', type: 'color', typeZh: '顏色差異', descZh: '左圖是綠色奇異果汁，右圖是鮮紅色西瓜汁' },
      { id: 'size', type: 'size', typeZh: '大小差異', descZh: '左圖是大杯果汁，右圖是小迷你果汁' },
      { id: 'presence', type: 'presence', typeZh: '存在差異', descZh: '左圖杯中有果汁，右圖杯子是空的' }
    ]
  },
  {
    word: 'tea',
    wordZh: '茶',
    x: 235,
    y: 465,
    radius: 46,
    variants: [
      { id: 'color', type: 'color', typeZh: '顏色差異', descZh: '左圖是金黃琥珀洋甘菊茶，右圖是紫色花果茶' },
      { id: 'size', type: 'size', typeZh: '大小差異', descZh: '左圖是大茶壺，右圖是小單人茶壺' },
      { id: 'presence', type: 'presence', typeZh: '存在差異', descZh: '左圖桌上有茶壺，右圖只有茶杯' }
    ]
  },
  {
    word: 'ice cream',
    wordZh: '冰淇淋',
    x: 830,
    y: 395,
    radius: 48,
    variants: [
      { id: 'presence', type: 'presence', typeZh: '存在差異', descZh: '左圖甜點車上有雙球冰淇淋，右圖架上空無一物' },
      { id: 'color', type: 'color', typeZh: '顏色差異', descZh: '左圖是草莓薄荷雙球，右圖是芒果藍莓雙球' },
      { id: 'size', type: 'size', typeZh: '大小差異', descZh: '左圖是特大雙球冰淇淋，右圖是迷你袖珍冰淇淋' }
    ]
  },
  {
    word: 'moon cake',
    wordZh: '月餅',
    x: 645,
    y: 450,
    radius: 46,
    variants: [
      { id: 'presence', type: 'presence', typeZh: '存在差異', descZh: '左圖盤中盛放著金黃烘焙月餅，右圖盤子是空的' },
      { id: 'quantity', type: 'quantity', typeZh: '數量差異', descZh: '左圖盤中有 2 顆月餅，右圖只有 1 顆月餅' }
    ]
  },
  {
    word: 'watermelon',
    wordZh: '西瓜',
    x: 135,
    y: 485,
    radius: 50,
    variants: [
      { id: 'size', type: 'size', typeZh: '大小差異', descZh: '左圖水果架上是特大號巨無霸西瓜，右圖是迷你西瓜' },
      { id: 'color', type: 'color', typeZh: '顏色差異', descZh: '左圖是紅肉切片西瓜，右圖是小玉黃肉西瓜' }
    ]
  },
  {
    word: 'hamburger',
    wordZh: '漢堡',
    x: 485,
    y: 445,
    radius: 48,
    variants: [
      { id: 'size', type: 'size', typeZh: '大小差異', descZh: '左圖餐桌上是特大雙層巨無霸漢堡，右圖是一口小漢堡' },
      { id: 'presence', type: 'presence', typeZh: '存在差異', descZh: '左圖桌上有漢堡，右圖只有空白餐巾包裝紙' }
    ]
  },
  {
    word: 'apple',
    wordZh: '蘋果',
    x: 85,
    y: 410,
    radius: 48,
    variants: [
      { id: 'quantity', type: 'quantity', typeZh: '數量差異', descZh: '左圖木箱裝滿 5 顆紅蘋果，右圖箱內只有 2 顆蘋果' },
      { id: 'color', type: 'color', typeZh: '顏色差異', descZh: '左圖是紅蘋果，右圖是青翠綠蘋果' }
    ]
  },
  {
    word: 'hot dog',
    wordZh: '熱狗',
    x: 745,
    y: 450,
    radius: 48,
    variants: [
      { id: 'quantity', type: 'quantity', typeZh: '數量差異', descZh: '左圖烤架上排列著 3 份熱狗堡，右圖只有 1 份熱狗堡' },
      { id: 'presence', type: 'presence', typeZh: '存在差異', descZh: '左圖烤架上有熱狗滋滋作響，右圖烤架空空如也' }
    ]
  },
  {
    word: 'banana',
    wordZh: '香蕉',
    x: 180,
    y: 435,
    radius: 48,
    variants: [
      { id: 'displacement', type: 'displacement', typeZh: '位移差異', descZh: '左圖香蕉平放在桌面，右圖香蕉懸掛在上方的吊鉤上', altPos: { x: 180, y: 285 } },
      { id: 'color', type: 'color', typeZh: '顏色差異', descZh: '左圖香蕉金黃成熟，右圖香蕉青綠未熟' }
    ]
  },
  {
    word: 'sixteen',
    wordZh: '十六',
    x: 395,
    y: 195,
    radius: 46,
    variants: [
      { id: 'text', type: 'text', typeZh: '符號文字', descZh: '左圖街燈古典掛牌為 16 號，右圖掛牌為 20 號' },
      { id: 'color', type: 'color', typeZh: '顏色差異', descZh: '左圖門牌為古銅金底色，右圖門牌為深藍色底色' }
    ]
  },
  {
    word: 'pizza',
    wordZh: '披薩',
    x: 545,
    y: 435,
    radius: 46,
    variants: [
      { id: 'quantity', type: 'quantity', typeZh: '數量差異', descZh: '左圖托盤上有 2 片披薩，右圖只有 1 片披薩' },
      { id: 'presence', type: 'presence', typeZh: '存在差異', descZh: '左圖托盤上有披薩，右圖托盤上只有碎屑' }
    ]
  },
  {
    word: 'cake',
    wordZh: '蛋糕',
    x: 595,
    y: 430,
    radius: 46,
    variants: [
      { id: 'color', type: 'color', typeZh: '顏色差異', descZh: '左圖是粉紅草莓奶油蛋糕，右圖是濃黑巧克力蛋糕' },
      { id: 'presence', type: 'presence', typeZh: '存在差異', descZh: '左圖玻璃罩內有蛋糕，右圖玻璃罩內是空的' }
    ]
  },
  {
    word: 'sandwich',
    wordZh: '三明治',
    x: 340,
    y: 455,
    radius: 46,
    variants: [
      { id: 'quantity', type: 'quantity', typeZh: '數量差異', descZh: '左圖盤中有 2 份三明治，右圖只有 1 份三明治' },
      { id: 'presence', type: 'presence', typeZh: '存在差異', descZh: '左圖盤中有三明治，右圖盤子是空的' }
    ]
  },
  {
    word: 'milk',
    wordZh: '牛奶',
    x: 360,
    y: 465,
    radius: 46,
    variants: [
      { id: 'presence', type: 'presence', typeZh: '存在差異', descZh: '左圖有裝滿牛奶的玻璃瓶，右圖瓶子是透明空的' },
      { id: 'color', type: 'color', typeZh: '顏色差異', descZh: '左圖是純白鮮乳，右圖是粉紅草莓調味乳' }
    ]
  },
  {
    word: 'water',
    wordZh: '水',
    x: 265,
    y: 435,
    radius: 46,
    variants: [
      { id: 'presence', type: 'presence', typeZh: '存在差異', descZh: '左圖有裝滿冰水的水杯壺，右圖水壺是空的' },
      { id: 'color', type: 'color', typeZh: '顏色差異', descZh: '左圖是清澈純水，右圖是紫色蝶豆花水' }
    ]
  },
  {
    word: 'orange',
    wordZh: '柳橙',
    x: 125,
    y: 375,
    radius: 46,
    variants: [
      { id: 'quantity', type: 'quantity', typeZh: '數量差異', descZh: '左圖籃中有 3 顆柳橙，右圖籃中只有 2 顆柳橙' },
      { id: 'presence', type: 'presence', typeZh: '存在差異', descZh: '左圖籃中有柳橙，右圖編織籃是空的' }
    ]
  },
  {
    word: 'pomelo',
    wordZh: '柚子',
    x: 45,
    y: 475,
    radius: 46,
    variants: [
      { id: 'presence', type: 'presence', typeZh: '存在差異', descZh: '左圖木箱旁放有柚子，右圖該位置空無一物' },
      { id: 'size', type: 'size', typeZh: '大小差異', descZh: '左圖是巨大節慶柚子，右圖是迷你小柚子' }
    ]
  },
  {
    word: 'rice',
    wordZh: '米飯',
    x: 515,
    y: 475,
    radius: 46,
    variants: [
      { id: 'presence', type: 'presence', typeZh: '存在差異', descZh: '左圖碗中盛放白米飯，右圖碗是空的' },
      { id: 'quantity', type: 'quantity', typeZh: '數量差異', descZh: '左圖有 2 顆三角飯糰，右圖只有 1 顆飯糰' }
    ]
  },
  {
    word: 'sunny',
    wordZh: '晴朗的',
    x: 80,
    y: 75,
    radius: 48,
    variants: [
      { id: 'symbol', type: 'text', typeZh: '符號文字', descZh: '左圖太陽露齒微笑，右圖太陽戴著黑色酷墨鏡' },
      { id: 'color', type: 'color', typeZh: '顏色差異', descZh: '左圖是金黃太陽，右圖是火紅夕陽' }
    ]
  },
  {
    word: 'cloudy',
    wordZh: '多雲的',
    x: 240,
    y: 70,
    radius: 48,
    variants: [
      { id: 'quantity', type: 'quantity', typeZh: '數量差異', descZh: '左圖天空中飄著 2 朵雲，右圖只有 1 朵雲' },
      { id: 'color', type: 'color', typeZh: '顏色差異', descZh: '左圖是雪白雲朵，右圖是暗灰雨雲' }
    ]
  }
];

// 補充誘答單字池（底圖環境常駐元素）
export const DISTRACTOR_WORDS_POOL = [
  { word: 'windy', wordZh: '颳風的' },
  { word: 'rainy', wordZh: '下雨的' },
  { word: 'happy', wordZh: '快樂的' },
  { word: 'angry', wordZh: '生氣的' },
  { word: 'tired', wordZh: '很累的' },
  { word: 'hungry', wordZh: '肚子餓的' },
  { word: 'thirsty', wordZh: '口渴的' },
  { word: 'twenty', wordZh: '二十' }
];

// ── 動態隨機抽題產生器 (隨機抽取 5 個單字作為相異目標) ──
export const generateSpotterRound = (targetCount = 5) => {
  // 洗牌演算法
  const shuffle = (arr) => {
    const list = [...arr];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  };

  // 1. 從 20 個待測目標中隨機抽取 targetCount (預設 5 個) 作為本局題目
  const shuffledTargets = shuffle(TARGET_ITEMS_POOL);
  const chosenTargets = shuffledTargets.slice(0, targetCount);
  const unchosenTargets = shuffledTargets.slice(targetCount);

  // 2. 為選中的 5 個目標各自隨機指定 1 種樣態變化
  const activeDifferences = chosenTargets.map(item => {
    const chosenVariant = item.variants[Math.floor(Math.random() * item.variants.length)];
    return {
      id: `diff-${item.word}`,
      word: item.word,
      wordZh: item.wordZh,
      x: item.x,
      y: item.y,
      radius: item.radius,
      altX: chosenVariant.altPos?.x,
      altY: chosenVariant.altPos?.y,
      type: chosenVariant.type,
      typeZh: chosenVariant.typeZh,
      descZh: chosenVariant.descZh,
      variantKey: chosenVariant.id
    };
  });

  // 3. 建立 20 個物件的狀態字典 (active 目標使用該 variantKey，其他 15 個目標一律使用 'default')
  const itemStateMap = {};
  TARGET_ITEMS_POOL.forEach(item => {
    const active = activeDifferences.find(d => d.word === item.word);
    itemStateMap[item.word] = active ? active.variantKey : 'default';
  });

  // 4. 組裝 Word Bank 選項：5 個正解目標 + 11 個場景中的誘答單字 = 16 個選項
  const distractorsPool = shuffle([...unchosenTargets, ...DISTRACTOR_WORDS_POOL]);
  const chosenDistractors = distractorsPool.slice(0, 11).map(d => ({ word: d.word, wordZh: d.wordZh }));

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
    totalCount: targetCount
  };
};

// 關卡場景靜態配置
export const SPOTTER_SCENES = [
  {
    id: 'plaza_market',
    book: '3',
    titleZh: '陽光市集與街角露天咖啡座',
    titleEn: 'Sunshine Plaza & Street Café',
    descZh: '在熱鬧的午後街角，隨機潛藏 5 處相異之處！鎖定聚光燈並在單字庫辨析單字！',
    width: 1000,
    height: 650
  }
];
