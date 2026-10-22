// ── 《鷹眼神探 • 單字找不同》 3D 立體紙雕課室資料池與動態出題引擎 ──

export const DIFFERENCE_CATEGORIES = [
  { id: 'color', labelZh: '顏色差異', color: 'text-amber-500', icon: '🎨' },
  { id: 'presence', labelZh: '存在差異', color: 'text-emerald-500', icon: '✨' },
  { id: 'style', labelZh: '樣式造型', color: 'text-blue-500', icon: '🔍' },
  { id: 'state', labelZh: '開闔狀態', color: 'text-purple-500', icon: '📖' },
  { id: 'pattern', labelZh: '花紋紋理', color: 'text-rose-500', icon: '📍' }
];

// ── 【Book 1 三年級上學期】彩虹文具與創意課室 (100% Here We Go Book 1 課本核心單字) ──
export const BOOK1_CLASSROOM_SCENE = {
  id: 'book1_classroom',
  book: '1',
  grade: 3,
  titleZh: '彩虹文具與創意課室（三年級第 1 冊）',
  titleEn: 'Rainbow Stationery & Creative Classroom (Book 1)',
  descZh: '在立體紙雕課室中，仔細觀察左右兩圖 5 處相異之處！點選後在單字庫配對正確單字！',
  baseImage: '/assets/spotter/book1_base.jpg',
  diffImage: '/assets/spotter/book1_diff.jpg',
  width: 1376,
  height: 768,
  targetItems: [
    {
      word: 'bag',
      wordZh: '書包',
      x: 227,
      y: 234,
      radius: 65,
      typeZh: '顏色樣態',
      descZh: '左圖牆上是紅藍雙色雙肩書包，右圖轉為暖陽黃與翠綠雙色雙肩書包'
    },
    {
      word: 'pencil',
      wordZh: '鉛筆',
      x: 230,
      y: 590,
      radius: 60,
      typeZh: '花紋樣式',
      descZh: '左圖木桌上是黃色六角木質鉛筆，右圖轉為彩虹糖果條紋鉛筆'
    },
    {
      word: 'eraser',
      wordZh: '橡皮擦',
      x: 301,
      y: 415,
      radius: 50,
      typeZh: '造型顏色',
      descZh: '左圖桌角是粉紅長方形橡皮擦，右圖轉為薄荷綠三角造型橡皮擦'
    },
    {
      word: 'book',
      wordZh: '書本',
      x: 582,
      y: 234,
      radius: 70,
      typeZh: '開闔狀態',
      descZh: '左圖講台架上是翻開的彩色圖畫英語讀本，右圖轉為闔上的皇家紫精裝故事書'
    },
    {
      word: 'ruler',
      wordZh: '直尺',
      x: 680,
      y: 545,
      radius: 65,
      typeZh: '材質色彩',
      descZh: '左圖手作几上是半透明金黃學生直尺，右圖轉為蔚藍天藍色直尺'
    },
    {
      word: 'pen',
      wordZh: '原子筆',
      x: 983,
      y: 450,
      radius: 55,
      typeZh: '筆桿色彩',
      descZh: '左圖學生桌筆槽中是深海軍藍原子筆，右圖轉為鮮豔亮紅金屬光澤原子筆'
    },
    {
      word: 'pencil case',
      wordZh: '鉛筆盒',
      x: 1180,
      y: 590,
      radius: 70,
      typeZh: '布面圖樣',
      descZh: '左圖課桌上是粉彩條紋拉鍊筆袋，右圖轉為海軍藍白波卡圓點鉛筆盒'
    },
    {
      word: 'marker',
      wordZh: '彩色筆',
      x: 1215,
      y: 418,
      radius: 60,
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
  descZh: '在溫馨的派對客廳中，找出 5 處相異物品！',
  baseImage: '/assets/spotter/book2_base.jpg',
  diffImage: '/assets/spotter/book2_diff.jpg',
  width: 1376,
  height: 768,
  targetItems: [
    { word: 'balloon', wordZh: '氣球', x: 809, y: 99, radius: 60, typeZh: '顏色樣式', descZh: '漂浮氣球樣式變更' },
    { word: 'card', wordZh: '卡片', x: 881, y: 179, radius: 55, typeZh: '封面圖樣', descZh: '感恩卡片樣式變更' },
    { word: 'cake', wordZh: '蛋糕', x: 601, y: 479, radius: 60, typeZh: '口味裝飾', descZh: '派對蛋糕裝飾變更' },
    { word: 'candle', wordZh: '蠟燭', x: 738, y: 484, radius: 50, typeZh: '燭光色彩', descZh: '蠟燭顏色變更' },
    { word: 'flower', wordZh: '花朵', x: 151, y: 416, radius: 60, typeZh: '花朵品種', descZh: '花瓶花卉變更' },
    { word: 'gift', wordZh: '禮物', x: 1109, y: 565, radius: 65, typeZh: '包裝緞帶', descZh: '禮物盒顏色變更' },
    { word: 'candy', wordZh: '糖果', x: 441, y: 642, radius: 55, typeZh: '糖果風味', descZh: '糖果盤點心變更' },
    { word: 'party', wordZh: '派對帽', x: 1245, y: 394, radius: 60, typeZh: '節慶裝飾', descZh: '派對帽條紋變更' }
  ],
  distractors: [
    { word: 'family', wordZh: '家人' },
    { word: 'mother', wordZh: '媽媽' },
    { word: 'friend', wordZh: '朋友' },
    { word: 'happy', wordZh: '快樂' }
  ]
};

// ── 依冊次索引 ──
export const SPOTTER_SCENES_BY_BOOK = {
  '1': BOOK1_CLASSROOM_SCENE,
  '2': BOOK2_PARTY_SCENE
};

// 全域場景清單（預設優先展示 Book 1 三年級課室）
export const SPOTTER_SCENES = [
  BOOK1_CLASSROOM_SCENE,
  BOOK2_PARTY_SCENE
];

// 向下相容匯出
export const TARGET_ITEMS_POOL = BOOK1_CLASSROOM_SCENE.targetItems;

// ── 動態出題產生器 (每次進關從 8 大候選隨機抽選 5 個) ──
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
    typeZh: item.typeZh || '樣態差異',
    descZh: item.descZh || ''
  }));

  // 2. 狀態字典
  const itemStateMap = {};
  items.forEach(item => {
    const active = activeDifferences.find(d => d.word === item.word);
    itemStateMap[item.word] = active ? 'active' : 'default';
  });

  // 3. 組裝 Word Bank 選項：5 個正解目標 + 3 個現場常見誘答單字 = 8 個友善大字卡
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
