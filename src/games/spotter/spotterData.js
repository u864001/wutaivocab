// ── 《鷹眼神探 • 單字找不同》 3D 立體紙雕市集資料池與動態出題引擎 ──

export const DIFFERENCE_CATEGORIES = [
  { id: 'color', labelZh: '顏色差異', color: 'text-amber-500', icon: '🎨' },
  { id: 'presence', labelZh: '存在差異', color: 'text-emerald-500', icon: '✨' },
  { id: 'size', labelZh: '大小差異', color: 'text-blue-500', icon: '🔍' },
  { id: 'quantity', labelZh: '數量差異', color: 'text-purple-500', icon: '🔢' },
  { id: 'displacement', labelZh: '位移差異', color: 'text-rose-500', icon: '📍' },
  { id: 'text', labelZh: '符號文字', color: 'text-cyan-500', icon: '🔤' }
];

// 核心目標與場景單字池（以 1376x768 立體紙雕市集場景精確錨定，8 大候選目標皆具備 2~3 種多重無瑕局部樣態）
export const TARGET_ITEMS_POOL = [
  {
    word: 'juice',
    wordZh: '果汁',
    x: 778,
    y: 640,
    radius: 55,
    patchBox: { x: 730, y: 580, width: 100, height: 115 },
    variants: [
      { id: 'red', type: 'color', typeZh: '果汁風味', descZh: '左圖桌上是金黃柳橙果汁，右圖是鮮紅西瓜果汁', patchUrl: '/assets/spotter/patches/patch_juice.webp' },
      { id: 'green', type: 'color', typeZh: '果汁風味', descZh: '左圖桌上是金黃柳橙果汁，右圖是翠綠奇異果汁', patchUrl: '/assets/spotter/patches/patch_juice_green.webp' },
      { id: 'empty', type: 'presence', typeZh: '有無差異', descZh: '左圖桌上有滿滿冰果汁，右圖杯子已空空如也', patchUrl: '/assets/spotter/patches/patch_juice_empty.webp' }
    ]
  },
  {
    word: 'tea',
    wordZh: '茶',
    x: 928,
    y: 648,
    radius: 65,
    patchBox: { x: 880, y: 580, width: 100, height: 130 },
    variants: [
      { id: 'purple', type: 'color', typeZh: '茶品與蒸氣', descZh: '左圖茶壺是金黃琥珀茶且茶杯冒出白煙，右圖茶壺是紫色花草茶且無白煙', patchUrl: '/assets/spotter/patches/patch_tea.webp' },
      { id: 'matcha', type: 'color', typeZh: '茶品與蒸氣', descZh: '左圖茶壺是金黃琥珀茶且茶杯冒出白煙，右圖茶壺是翠綠日式抹茶且無白煙', patchUrl: '/assets/spotter/patches/patch_tea_matcha.webp' }
    ]
  },
  {
    word: 'pizza',
    wordZh: '披薩',
    x: 1070,
    y: 712,
    radius: 60,
    patchBox: { x: 1010, y: 650, width: 120, height: 115 },
    variants: [
      { id: 'pesto', type: 'color', typeZh: '披薩配料', descZh: '左圖是經典紅色臘腸披薩，右圖是翠綠青醬橄欖披薩', patchUrl: '/assets/spotter/patches/patch_pizza.webp' },
      { id: 'cheese', type: 'color', typeZh: '披薩配料', descZh: '左圖是紅色臘腸披薩，右圖是香濃甜玉米起司披薩', patchUrl: '/assets/spotter/patches/patch_pizza_cheese.webp' }
    ]
  },
  {
    word: 'ice cream',
    wordZh: '冰淇淋',
    x: 1265,
    y: 630,
    radius: 60,
    patchBox: { x: 1200, y: 560, width: 130, height: 130 },
    variants: [
      { id: 'dark', type: 'color', typeZh: '冰淇淋口味', descZh: '左圖聖代是草莓與薄荷雙球，右圖是藍莓黑醋栗與濃黑巧克力雙球', patchUrl: '/assets/spotter/patches/patch_icecream.webp' },
      { id: 'mango', type: 'color', typeZh: '冰淇淋口味', descZh: '左圖聖代是粉紅草莓薄荷，右圖轉為金黃芒果與濃巧克力雙球', patchUrl: '/assets/spotter/patches/patch_icecream_mango.webp' }
    ]
  },
  {
    word: 'apple',
    wordZh: '蘋果',
    x: 114,
    y: 668,
    radius: 55,
    patchBox: { x: 60, y: 615, width: 110, height: 110 },
    variants: [
      { id: 'green', type: 'color', typeZh: '品種顏色', descZh: '左圖木箱全裝滿紅富士蘋果，右圖最前排是一顆青翠綠蘋果', patchUrl: '/assets/spotter/patches/patch_apple.webp' },
      { id: 'yellow', type: 'color', typeZh: '品種顏色', descZh: '左圖木箱全是紅富士蘋果，右圖最前排轉為金黃金冠蘋果', patchUrl: '/assets/spotter/patches/patch_apple_yellow.webp' }
    ]
  },
  {
    word: 'hamburger',
    wordZh: '漢堡',
    x: 1148,
    y: 615,
    radius: 55,
    patchBox: { x: 1080, y: 560, width: 140, height: 110 },
    variants: [
      { id: 'onion', type: 'color', typeZh: '漢堡配料', descZh: '左圖漢堡內夾新鮮紅色番茄切片，右圖轉為紫紅洋蔥圈', patchUrl: '/assets/spotter/patches/patch_hamburger.webp' },
      { id: 'crispy', type: 'color', typeZh: '肉排風味', descZh: '左圖漢堡是經典厚牛排，右圖轉為香脆金黃炸魚排', patchUrl: '/assets/spotter/patches/patch_hamburger_gold.webp' }
    ]
  },
  {
    word: 'banana',
    wordZh: '香蕉',
    x: 255,
    y: 545,
    radius: 55,
    patchBox: { x: 190, y: 480, width: 130, height: 120 },
    variants: [
      { id: 'green', type: 'color', typeZh: '成熟度差異', descZh: '左圖木箱全是一整串金黃熟成香蕉，右圖轉為一整串青脆鮮綠香蕉', patchUrl: '/assets/spotter/patches/patch_banana.webp' },
      { id: 'orange', type: 'color', typeZh: '熱帶品種', descZh: '左圖木箱是金黃香蕉，右圖轉為濃郁橘紅熱帶大蕉', patchUrl: '/assets/spotter/patches/patch_banana_orange.webp' }
    ]
  },
  {
    word: 'watermelon',
    wordZh: '西瓜',
    x: 350,
    y: 665,
    radius: 60,
    patchBox: { x: 290, y: 590, width: 140, height: 130 },
    variants: [
      { id: 'yellow', type: 'color', typeZh: '果肉品種', descZh: '左圖木箱前排是鮮紅甜美西瓜切片，右圖轉為金黃甜美的小玉西瓜切片', patchUrl: '/assets/spotter/patches/patch_watermelon.webp' },
      { id: 'orange', type: 'color', typeZh: '果肉品種', descZh: '左圖木箱前排是紅肉西瓜切片，右圖轉為金橙色哈密瓜風味西瓜切片', patchUrl: '/assets/spotter/patches/patch_watermelon_orange.webp' }
    ]
  },
  {
    word: 'water',
    wordZh: '水',
    x: 690,
    y: 460,
    radius: 70,
    variants: [
      { id: 'presence', type: 'presence', typeZh: '存在差異', descZh: '廣場中央的噴泉流淌著清澈泉水' }
    ]
  },
  {
    word: 'sunny',
    wordZh: '晴天',
    x: 955,
    y: 70,
    radius: 60,
    variants: [
      { id: 'presence', type: 'presence', typeZh: '存在差異', descZh: '萬里無雲的天空中掛著溫暖陽光' }
    ]
  }
];

// 補充誘答單字池（底圖環境常駐元素，皆真實存在於 3D 紙雕市集中）
export const DISTRACTOR_WORDS_POOL = [
  { word: 'water', wordZh: '水' },
  { word: 'sunny', wordZh: '晴天' },
  { word: 'dog', wordZh: '狗' },
  { word: 'bike', wordZh: '腳踏車' },
  { word: 'clock', wordZh: '時鐘' }
];

// ── 動態出題產生器 (每次進關從 8 大候選隨機抽選 5 個，且每個候選各自隨機抽取一種變體！) ──
export const generateSpotterRound = (targetCount = 5) => {
  // 洗牌演算法 (Fisher-Yates)
  const shuffle = (arr) => {
    const list = [...arr];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  };

  // 1. 從 8 個立體紙雕精製相異目標候選中，隨機動態抽選 5 個 (C(8, 5) = 56 種不重複出題組合！)
  const candidatePool = TARGET_ITEMS_POOL.filter(item => !!item.patchBox);
  const chosenTargets = shuffle(candidatePool).slice(0, targetCount);
  const unchosenTargets = TARGET_ITEMS_POOL.filter(item => !chosenTargets.some(c => c.word === item.word));

  // 2. 為選中的 5 個目標各自隨機指定一種驗證過的自然樣態變化 (多型態隨機抽選！)
  const activeDifferences = chosenTargets.map(item => {
    const chosenVariant = shuffle(item.variants)[0]; // 每個物品隨機選取 1 款樣態！
    return {
      id: `diff-${item.word}`,
      word: item.word,
      wordZh: item.wordZh,
      x: item.x,
      y: item.y,
      radius: item.radius || 55,
      patch: {
        url: chosenVariant.patchUrl,
        x: item.patchBox.x,
        y: item.patchBox.y,
        width: item.patchBox.width,
        height: item.patchBox.height
      },
      altX: chosenVariant.altPos?.x,
      altY: chosenVariant.altPos?.y,
      type: chosenVariant.type,
      typeZh: chosenVariant.typeZh,
      descZh: chosenVariant.descZh,
      variantKey: chosenVariant.id
    };
  });

  // 3. 建立狀態字典
  const itemStateMap = {};
  TARGET_ITEMS_POOL.forEach(item => {
    const active = activeDifferences.find(d => d.word === item.word);
    itemStateMap[item.word] = active ? active.variantKey : 'default';
  });

  // 4. 組裝 Word Bank 選項：5 個正解目標 + 3 個現場常見誘答單字 = 8 個友善大字卡（大幅降低學童認知負荷）
  const targetWordsSet = new Set(chosenTargets.map(c => c.word));
  const availableDistractorCandidates = [
    ...DISTRACTOR_WORDS_POOL,
    ...unchosenTargets.map(t => ({ word: t.word, wordZh: t.wordZh }))
  ].filter(d => !targetWordsSet.has(d.word));

  const uniqueDistractors = [];
  const seenDistractorWords = new Set();
  for (const d of availableDistractorCandidates) {
    if (!seenDistractorWords.has(d.word)) {
      seenDistractorWords.add(d.word);
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
    totalCount: targetCount
  };
};

// 關卡場景靜態配置 (1376 x 768 滿版 16:9 高畫質立體紙雕)
export const SPOTTER_SCENES = [
  {
    id: 'plaza_market',
    book: '3',
    titleZh: '陽光市集與街角露天咖啡座（立體紙雕風）',
    titleEn: 'Papercraft Plaza & Street Café',
    descZh: '在熱鬧的立體紙雕市集中，仔細觀察左右兩圖 5 處相異之處！點選後在單字庫配對正確單字！',
    width: 1376,
    height: 768
  }
];
