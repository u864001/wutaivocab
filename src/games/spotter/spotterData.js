// ── 《鷹眼神探 • 單字找不同》 3D 立體紙雕市集資料池與動態出題引擎 ──

export const DIFFERENCE_CATEGORIES = [
  { id: 'color', labelZh: '顏色差異', color: 'text-amber-500', icon: '🎨' },
  { id: 'presence', labelZh: '存在差異', color: 'text-emerald-500', icon: '✨' },
  { id: 'size', labelZh: '大小差異', color: 'text-blue-500', icon: '🔍' },
  { id: 'quantity', labelZh: '數量差異', color: 'text-purple-500', icon: '🔢' },
  { id: 'displacement', labelZh: '位移差異', color: 'text-rose-500', icon: '📍' },
  { id: 'text', labelZh: '符號文字', color: 'text-cyan-500', icon: '🔤' }
];

// 核心目標與場景單字池（以 1376x768 立體紙雕市集場景精確錨定，8 大候選目標皆具備原生無瑕局部圖層）
export const TARGET_ITEMS_POOL = [
  {
    word: 'juice',
    wordZh: '果汁',
    x: 778,
    y: 640,
    radius: 55,
    patch: {
      url: '/assets/spotter/patches/patch_juice.webp',
      x: 730,
      y: 580,
      width: 100,
      height: 115
    },
    variants: [
      { id: 'color', type: 'color', typeZh: '果汁風味', descZh: '左圖桌上是金黃柳橙果汁，右圖是鮮紅西瓜果汁' }
    ]
  },
  {
    word: 'tea',
    wordZh: '茶',
    x: 928,
    y: 648,
    radius: 65,
    patch: {
      url: '/assets/spotter/patches/patch_tea.webp',
      x: 880,
      y: 580,
      width: 100,
      height: 130
    },
    variants: [
      { id: 'color', type: 'color', typeZh: '茶品與蒸氣', descZh: '左圖茶壺是金黃琥珀茶且茶杯冒出白煙，右圖茶壺是紫色花草茶且無白煙' }
    ]
  },
  {
    word: 'pizza',
    wordZh: '披薩',
    x: 1070,
    y: 712,
    radius: 60,
    patch: {
      url: '/assets/spotter/patches/patch_pizza.webp',
      x: 1010,
      y: 650,
      width: 120,
      height: 115
    },
    variants: [
      { id: 'color', type: 'color', typeZh: '披薩配料', descZh: '左圖是經典紅色臘腸披薩，右圖是翠綠青醬橄欖披薩' }
    ]
  },
  {
    word: 'ice cream',
    wordZh: '冰淇淋',
    x: 1265,
    y: 630,
    radius: 60,
    patch: {
      url: '/assets/spotter/patches/patch_icecream.webp',
      x: 1200,
      y: 560,
      width: 130,
      height: 130
    },
    variants: [
      { id: 'color', type: 'color', typeZh: '冰淇淋口味', descZh: '左圖聖代是草莓與薄荷雙球，右圖是藍莓黑醋栗與濃黑巧克力雙球' }
    ]
  },
  {
    word: 'apple',
    wordZh: '蘋果',
    x: 114,
    y: 668,
    radius: 55,
    patch: {
      url: '/assets/spotter/patches/patch_apple.webp',
      x: 60,
      y: 615,
      width: 110,
      height: 110
    },
    variants: [
      { id: 'color', type: 'color', typeZh: '品種顏色', descZh: '左圖木箱全裝滿紅富士蘋果，右圖最前排是一顆青翠綠蘋果' }
    ]
  },
  {
    word: 'hamburger',
    wordZh: '漢堡',
    x: 1148,
    y: 615,
    radius: 55,
    patch: {
      url: '/assets/spotter/patches/patch_hamburger.webp',
      x: 1080,
      y: 560,
      width: 140,
      height: 110
    },
    variants: [
      { id: 'color', type: 'color', typeZh: '漢堡配料', descZh: '左圖漢堡內夾新鮮紅色番茄切片，右圖轉為紫紅洋蔥圈' }
    ]
  },
  {
    word: 'banana',
    wordZh: '香蕉',
    x: 255,
    y: 545,
    radius: 55,
    patch: {
      url: '/assets/spotter/patches/patch_banana.webp',
      x: 190,
      y: 480,
      width: 130,
      height: 120
    },
    variants: [
      { id: 'color', type: 'color', typeZh: '顏色成熟度', descZh: '左圖木箱全是一整串金黃熟成香蕉，右圖轉為一整串青脆鮮綠香蕉' }
    ]
  },
  {
    word: 'watermelon',
    wordZh: '西瓜',
    x: 350,
    y: 665,
    radius: 60,
    patch: {
      url: '/assets/spotter/patches/patch_watermelon.webp',
      x: 290,
      y: 590,
      width: 140,
      height: 130
    },
    variants: [
      { id: 'color', type: 'color', typeZh: '果肉品種', descZh: '左圖木箱前排是鮮紅甜美西瓜切片，右圖轉為金黃甜美的小玉西瓜切片' }
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

// ── 動態出題產生器 (每次進關從 8 大驗證相異單字隨機抽選 5 個，未抽中者兩邊完全相同！) ──
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
  const candidatePool = TARGET_ITEMS_POOL.filter(item => !!item.patch);
  const chosenTargets = shuffle(candidatePool).slice(0, targetCount);
  const unchosenTargets = TARGET_ITEMS_POOL.filter(item => !chosenTargets.some(c => c.word === item.word));

  // 2. 為選中的 5 個目標各自指定驗證過的自然樣態變化
  const activeDifferences = chosenTargets.map(item => {
    const chosenVariant = item.variants[0];
    return {
      id: `diff-${item.word}`,
      word: item.word,
      wordZh: item.wordZh,
      x: item.x,
      y: item.y,
      radius: item.radius || 55,
      patch: item.patch,
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
