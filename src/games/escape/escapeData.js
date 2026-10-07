// ── 密室逃脫：八大豐富題型、動態不重疊座標與三室戰役生成引擎 ──

export const CHAMBER_CHAPTERS = [
  {
    id: 'chamber_1',
    roomNumber: 1,
    titleZh: '第一室：百步蛇前殿 • 回音石廊',
    titleEn: 'Chamber I: The Echo Antechamber',
    subtitleZh: '大自然生態與聽力共鳴',
    themeId: 'temple',
    bg: '/assets/escape/bg_temple.webp',
    color: 'emerald',
    badge: '第一道門',
    runeIcon: '🐍',
    introStoryZh: '探險家在大武山探尋古老石板遺跡時，踩中了地面暗磚，身後千斤巨石轟隆落下封死退路！四周火把驟然點亮，石室中暗藏著 5 處神秘遺跡（位置每次探索皆會改變）。細心觀察那錯落明滅的微光，只有 3 個散發淡金色呼吸光暈的才是過關關鍵！',
    transitionStoryZh: '轟隆隆——！青銅石門發出沉重巨響緩緩升起，露出向下延伸的旋轉石階！空氣中飄散出古老羊皮紙與乾燥墨水的香氣。你快步穿過長廊，來到了沉寂千年的古代典籍密室...'
  },
  {
    id: 'chamber_2',
    roomNumber: 2,
    titleZh: '第二室：長老秘境 • 典籍知識庫',
    titleEn: 'Chamber II: The Arcane Archives',
    subtitleZh: '古卷書庫與拼字構詞',
    themeId: 'library',
    bg: '/assets/escape/bg_library.webp',
    color: 'amber',
    badge: '第二道門',
    runeIcon: '📜',
    introStoryZh: '高聳的環形書架直抵穹頂，漂浮魔法卷軸與古星盤在微光中輕輕旋轉。這座知識寶庫中隨機散落著 5 個線索節點，光暈忽明忽暗錯落閃爍，找出 3 個金色關鍵真理印記！',
    transitionStoryZh: '咔嚓、咔嚓！隱藏在書架後方的巨型機械齒輪開始咬合旋轉，暗門赫然退開！上方傳來星際流光的呼嘯與清脆鐘鳴。你拾階而上，眼前豁然開朗，抵達了宏偉壯麗的星象祭壇大殿！'
  },
  {
    id: 'chamber_3',
    roomNumber: 3,
    titleZh: '第三室：大武山之巔 • 星象脫逃祭壇',
    titleEn: 'Chamber III: The Celestial Sanctuary',
    subtitleZh: '星際鐘樓與終極對偶之門',
    themeId: 'observatory',
    bg: '/assets/escape/bg_observatory.webp',
    color: 'indigo',
    badge: '終極脫逃門',
    runeIcon: '🔭',
    introStoryZh: '巨大的黃銅渾天儀在大武山璀璨星河下緩緩運轉。前方正對著通往地表山谷的終極脫逃大門！房間星空中有 5 處隨機分佈的天體機關，只有啟動正確的 3 顆核心星核，沉睡大門才會為你敞開！',
    victoryStoryZh: '金光萬丈——！巨大的星圖大門完全敞開，清新的高山微風伴隨著溫暖的第一道晨曦傾瀉而入！你成功破解所有古代封印，順利逃出了神秘石板密室！'
  }
];

// ── 反義詞詞庫對照表 ──
export const OPPOSITES_POOL = [
  { word: 'big', opposite: 'small', zh: '大', oppZh: '小' },
  { word: 'small', opposite: 'big', zh: '小', oppZh: '大' },
  { word: 'tall', opposite: 'short', zh: '高', oppZh: '矮' },
  { word: 'short', opposite: 'tall', zh: '矮', oppZh: '高' },
  { word: 'hot', opposite: 'cold', zh: '熱', oppZh: '冷' },
  { word: 'cold', opposite: 'hot', zh: '冷', oppZh: '熱' },
  { word: 'happy', opposite: 'sad', zh: '高興', oppZh: '傷心' },
  { word: 'sad', opposite: 'happy', zh: '傷心', oppZh: '高興' },
  { word: 'open', opposite: 'close', zh: '開', oppZh: '關' },
  { word: 'close', opposite: 'open', zh: '關', oppZh: '開' },
  { word: 'stand', opposite: 'sit', zh: '站', oppZh: '坐' },
  { word: 'sit', opposite: 'stand', zh: '坐', oppZh: '站' },
  { word: 'yes', opposite: 'no', zh: '是', oppZh: '不是' },
  { word: 'new', opposite: 'old', zh: '新', oppZh: '舊' }
];

// ── 日常會話問答呼應庫 (精選16組國小生活常用口語問答) ──
export const DIALOGUES_POOL = [
  {
    question: 'How are you today?',
    correct: "I'm fine, thank you.",
    distractors: ["I have a pencil.", "It's three o'clock.", "She is my sister."],
    zh: '今天你好嗎？'
  },
  {
    question: 'Can you swim in the river?',
    correct: 'Yes, I can.',
    distractors: ['No, it is red.', 'I am ten years old.', 'It is on the chair.'],
    zh: '你會在河裡游泳嗎？'
  },
  {
    question: 'What is this on the table?',
    correct: "It's an eraser.",
    distractors: ["Yes, I do.", "I'm playing soccer.", "Good morning."],
    zh: '桌上的這個是什麼？'
  },
  {
    question: 'Do you like red apples?',
    correct: 'Yes, I do. They are sweet.',
    distractors: ["I'm fine.", "It's blue.", "No, she is tall."],
    zh: '你喜歡紅蘋果嗎？'
  },
  {
    question: "What's the weather like today?",
    correct: "It's sunny and warm.",
    distractors: ["I have two books.", "My name is Peter.", "Under the desk."],
    zh: '今天天氣如何？'
  },
  {
    question: 'What time is it right now?',
    correct: "It is two o'clock.",
    distractors: ["Yes, I am happy.", "I like hamburgers.", "She can dance."],
    zh: '現在幾點鐘了？'
  },
  {
    question: 'What is your name?',
    correct: 'My name is Leo.',
    distractors: ["I am nine years old.", "It is blue.", "Yes, I am."],
    zh: '請問你叫什麼名字？'
  },
  {
    question: 'Where is my English book?',
    correct: 'It is on your desk.',
    distractors: ["I like red.", "At seven o'clock.", "He is my brother."],
    zh: '我的英文書在哪裡？'
  },
  {
    question: 'How old are you?',
    correct: 'I am nine years old.',
    distractors: ["I'm happy.", "It is cold outside.", "Yes, I can."],
    zh: '你今年幾歲呢？'
  },
  {
    question: 'What color do you like?',
    correct: 'I like blue and green.',
    distractors: ["I have a dog.", "It is three o'clock.", "I can jump."],
    zh: '你喜歡什麼顏色？'
  },
  {
    question: 'Good morning, teacher!',
    correct: 'Good morning, everyone!',
    distractors: ["Good night.", "See you yesterday.", "I am eating lunch."],
    zh: '老師早安！'
  },
  {
    question: 'See you tomorrow!',
    correct: 'Goodbye! See you.',
    distractors: ["Yes, please.", "Thank you very much.", "It is five dollars."],
    zh: '明天見！'
  },
  {
    question: 'Can you help me, please?',
    correct: 'Sure, I can help you.',
    distractors: ["I am eight.", "It is purple.", "Under the chair."],
    zh: '請問你能幫我一下嗎？'
  },
  {
    question: 'Do you have a pet at home?',
    correct: 'Yes, I have a cute dog.',
    distractors: ["It is red.", "I like bananas.", "At the library."],
    zh: '你家裡有養寵物嗎？'
  },
  {
    question: 'May I drink some water?',
    correct: 'Sure, go ahead.',
    distractors: ["It is hot today.", "I have three balls.", "She is singing."],
    zh: '我可以喝點水嗎？'
  },
  {
    question: 'Is this your pencil box?',
    correct: 'Yes, it is mine. Thank you!',
    distractors: ["No, it's yellow.", "I'm ten.", "He is very tall."],
    zh: '這是你的鉛筆盒嗎？'
  }
];

// ── 生活特徵謎語庫 (精選16組國小生活與自然特徵謎語) ──
export const RIDDLES_POOL = [
  {
    riddle: "I have two long ears and I love carrots. What am I?",
    answer: 'rabbit',
    distractors: ['fish', 'tiger', 'bird'],
    zh: '我有兩隻長長的耳朵，我最喜歡吃胡蘿蔔。我是誰？',
    wordZh: '兔子'
  },
  {
    riddle: "I am big and grey. I have a very long nose. What am I?",
    answer: 'elephant',
    distractors: ['cat', 'dog', 'monkey'],
    zh: '我體型龐大且呈灰色，我有很長很長的鼻子。我是誰？',
    wordZh: '大象'
  },
  {
    riddle: "I am round and red. Monkeys and kids like to eat me. What am I?",
    answer: 'apple',
    distractors: ['eraser', 'ruler', 'pencil'],
    zh: '我又圓又紅，猴子和小朋友都愛吃我。我是誰？',
    wordZh: '蘋果'
  },
  {
    riddle: "I have feathers and two wings. I can fly high in the sky. What am I?",
    answer: 'bird',
    distractors: ['frog', 'bear', 'pig'],
    zh: '我有羽毛和兩隻翅膀，我能在天空高高飛翔。我是誰？',
    wordZh: '鳥'
  },
  {
    riddle: "You use me to write words and draw pictures at school. What am I?",
    answer: 'pencil',
    distractors: ['pizza', 'dog', 'chair'],
    zh: '在學校裡，你用我來寫字和畫畫。我是誰？',
    wordZh: '鉛筆'
  },
  {
    riddle: "I live in the water. I can swim very fast without legs. What am I?",
    answer: 'fish',
    distractors: ['lion', 'elephant', 'horse'],
    zh: '我住在水裡，沒有腳卻能游得很快。我是誰？',
    wordZh: '魚'
  },
  {
    riddle: "I say woof! I am a loyal friend and I love to wag my tail. What am I?",
    answer: 'dog',
    distractors: ['cat', 'duck', 'bear'],
    zh: '我會汪汪叫！我是忠實的好朋友，喜歡開心地搖尾巴。我是誰？',
    wordZh: '小狗'
  },
  {
    riddle: "I say meow. I like to catch mice and take naps in the warm sun. What am I?",
    answer: 'cat',
    distractors: ['dog', 'cow', 'tiger'],
    zh: '我會喵喵叫，喜歡抓老鼠並在溫暖陽光下打瞌睡。我是誰？',
    wordZh: '小貓'
  },
  {
    riddle: "I am long and yellow. Monkeys love to peel and eat me. What am I?",
    answer: 'banana',
    distractors: ['apple', 'orange', 'grape'],
    zh: '我又長又黃，猴子最喜歡剝開吃我。我是誰？',
    wordZh: '香蕉'
  },
  {
    riddle: "I have many pages and stories, but I cannot speak. You can read me. What am I?",
    answer: 'book',
    distractors: ['desk', 'chair', 'bag'],
    zh: '我有許多書頁與故事，但我不會說話。你每天可以閱讀我。我是誰？',
    wordZh: '書本'
  },
  {
    riddle: "I have two hands and a round face. I tick-tock all day to tell the time. What am I?",
    answer: 'clock',
    distractors: ['ruler', 'eraser', 'pen'],
    zh: '我有兩隻指針與圓臉，整天滴答走告訴你現在幾點。我是誰？',
    wordZh: '時鐘'
  },
  {
    riddle: "I shine high in the sky during the day. I bring you light and warmth. What am I?",
    answer: 'sun',
    distractors: ['star', 'moon', 'cloud'],
    zh: '我在白天高懸空中，為大地帶來明亮光芒與溫暖。我是誰？',
    wordZh: '太陽'
  },
  {
    riddle: "I am white, cold, and healthy to drink. Cows give me to kids. What am I?",
    answer: 'milk',
    distractors: ['juice', 'tea', 'soup'],
    zh: '我是白色又健康的飲品，乳牛媽媽將我送給小朋友。我是誰？',
    wordZh: '牛奶'
  },
  {
    riddle: "I have four wheels. I drive on the road with a beep-beep horn. What am I?",
    answer: 'car',
    distractors: ['bike', 'plane', 'boat'],
    zh: '我有四個輪子，在馬路上奔馳並按著嗶嗶喇叭。我是誰？',
    wordZh: '汽車'
  },
  {
    riddle: "I have green leaves and strong branches. Birds build their homes in me. What am I?",
    answer: 'tree',
    distractors: ['flower', 'stone', 'grass'],
    zh: '我有綠色的樹葉與堅固的枝枒，小鳥喜歡在我身上築巢。我是誰？',
    wordZh: '大樹'
  },
  {
    riddle: "I am the king of the jungle with a golden mane and a loud roar. What am I?",
    answer: 'lion',
    distractors: ['rabbit', 'sheep', 'pig'],
    zh: '我有金色鬃毛與威猛的吼聲，我是森林百獸之王。我是誰？',
    wordZh: '獅子'
  }
];

// ── 語意類別字典與特徵標籤 ──
const CATEGORY_KEYWORDS = {
  animals: ['cat', 'dog', 'bird', 'fish', 'elephant', 'tiger', 'monkey', 'bear', 'lion', 'zebra', 'rabbit', 'pig', 'cow', 'duck', 'horse', 'sheep', 'turtle', 'frog', 'butterfly', 'deer', 'snake', 'pet', 'animal'],
  food: ['apple', 'banana', 'grape', 'orange', 'pizza', 'hamburger', 'sandwich', 'juice', 'milk', 'water', 'tea', 'ice cream', 'cake', 'bread', 'rice', 'egg', 'chicken', 'fruit', 'pie', 'cookie', 'soup', 'salad'],
  colors_numbers: ['red', 'blue', 'yellow', 'green', 'pink', 'purple', 'black', 'white', 'brown', 'orange', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen'],
  school: ['book', 'ruler', 'pencil', 'eraser', 'desk', 'chair', 'pen', 'bag', 'marker', 'glue', 'classroom', 'school', 'teacher', 'student', 'bell', 'box', 'draw', 'write', 'read'],
  actions: ['run', 'jump', 'sing', 'dance', 'swim', 'read', 'write', 'draw', 'play', 'eat', 'drink', 'sleep', 'walk', 'talk', 'fly', 'help', 'cook', 'listen', 'look', 'climb'],
  places_transport: ['park', 'supermarket', 'hospital', 'school', 'library', 'zoo', 'station', 'store', 'cinema', 'bus', 'train', 'car', 'bike', 'bicycle', 'plane', 'boat', 'ship', 'taxi'],
  family: ['father', 'mother', 'brother', 'sister', 'grandfather', 'grandmother', 'dad', 'mom', 'friend', 'boy', 'girl'],
  feelings: ['happy', 'sad', 'tired', 'hungry', 'thirsty', 'angry', 'sick', 'hot', 'cold', 'cool', 'warm', 'good', 'fine']
};

export const tagWordCategory = (word) => {
  if (!word || !word.en) return 'adventure';
  const cleanEn = word.en.toLowerCase().trim();

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => cleanEn === k || cleanEn.includes(k))) {
      return cat;
    }
  }

  const lesson = (word.lesson || '').toLowerCase();
  if (lesson.includes('動物') || lesson.includes('animal')) return 'animals';
  if (lesson.includes('食物') || lesson.includes('甜點') || lesson.includes('food')) return 'food';
  if (lesson.includes('學校') || lesson.includes('school')) return 'school';
  if (lesson.includes('自然') || lesson.includes('nature')) return 'nature';
  if (lesson.includes('運動') || lesson.includes('sport')) return 'actions';

  return 'adventure';
};

export const getBooksForGrade = (grade) => {
  const g = String(grade || '').padStart(2, '0');
  if (g === '01') return ['1', 'abc'];
  if (g === '02') return ['2', 'abc'];
  if (g === '03') return ['1', '2'];
  if (g === '04') return ['3', '4'];
  if (g === '05') return ['5', '6'];
  if (g === '06') return ['7', '8'];
  return ['1', '2', '3', '4', '5', '6', '7', '8'];
};

const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * 程序化生成 5 個互不重疊且分散自然的座標點
 * safe bounds: left 15%~85%, top 28%~78%, 最小間距 20%
 */
export const generateNonOverlappingHotspots = (count = 5) => {
  const points = [];
  const minDistance = 20; // 歐幾里得最小間距 (百分比)
  let attempts = 0;

  while (points.length < count && attempts < 200) {
    attempts++;
    const left = Math.floor(Math.random() * 70) + 15; // 15% ~ 85%
    const top = Math.floor(Math.random() * 50) + 28;  // 28% ~ 78%

    const isOverlap = points.some(p => {
      const dx = p.leftNum - left;
      const dy = (p.topNum - top) * 1.35; // 考量 16:9 垂直比例加權
      return Math.sqrt(dx * dx + dy * dy) < minDistance;
    });

    if (!isOverlap) {
      points.push({
        left: `${left}%`,
        top: `${top}%`,
        leftNum: left,
        topNum: top,
        // 賦予每點隨機錯落的呼吸動畫延遲與週期
        animDelay: `${(Math.random() * 4).toFixed(1)}s`,
        animDuration: `${(3.8 + Math.random() * 2.5).toFixed(1)}s`
      });
    }
  }

  // 備援保底點位 (若極端情況未抽滿 5 點)
  const fallbackSpots = [
    { left: '22%', top: '38%', animDelay: '0s', animDuration: '4.5s' },
    { left: '32%', top: '68%', animDelay: '1.8s', animDuration: '5.2s' },
    { left: '50%', top: '78%', animDelay: '3.1s', animDuration: '4.2s' },
    { left: '60%', top: '42%', animDelay: '0.9s', animDuration: '5.8s' },
    { left: '80%', top: '60%', animDelay: '2.4s', animDuration: '4.7s' }
  ];

  while (points.length < count) {
    points.push(fallbackSpots[points.length] || { left: '50%', top: '50%', animDelay: '0s', animDuration: '4s' });
  }

  return points;
};

/**
 * 依臺灣國小學期標準時間，自動自適應當前學期之正式教材進度冊別
 * 8月~1月 (上學期)：三年級第1冊、四年級第3冊、五年級第5冊、六年級第7冊 (一二年級為 abc)
 * 2月~7月 (下學期)：三年級第2冊、四年級第4冊、五年級第6冊、六年級第8冊
 */
export const getActiveCurriculumBookForGrade = (grade, date = new Date()) => {
  const g = String(grade || '03').padStart(2, '0');
  const month = date.getMonth() + 1;
  const isSemester1 = month >= 8 || month === 1;

  if (g === '01' || g === '02') return 'abc';
  if (g === '03') return isSemester1 ? '1' : '2';
  if (g === '04') return isSemester1 ? '3' : '4';
  if (g === '05') return isSemester1 ? '5' : '6';
  if (g === '06') return isSemester1 ? '7' : '8';
  return '1';
};

/**
 * 程序化生成三連環密室大逃脫會話 (八大多元題型 + 隨機不重疊熱區 + 3關鍵2干擾)
 */
export const generateEscapeRoomCampaign = (allWords = [], options = {}) => {
  const { grade = '03', selectedUnits = [] } = options;

  let eligibleWords = [];
  let qualifyingBook = null;

  // 1. 若大廳有自訂勾選單元，優先採用
  if (Array.isArray(selectedUnits) && selectedUnits.length > 0) {
    eligibleWords = allWords.filter(w => selectedUnits.includes(`${w.book}-${w.lesson}`));
    const selectedBooks = [...new Set(selectedUnits.map(u => u.split('-')[0]))];
    if (selectedBooks.length === 1 && eligibleWords.length >= 8) {
      qualifyingBook = selectedBooks[0];
    }
  }

  // 2. 自適應當前學期標準進度 (學生無須特別手動挑選，進關即為進度標準教材，保證符合上榜規範)
  if (eligibleWords.length < 10) {
    const activeBook = getActiveCurriculumBookForGrade(grade);
    qualifyingBook = activeBook;

    if (activeBook === 'abc') {
      eligibleWords = allWords.filter(w => String(w.book) === 'abc' || String(w.book) === '1');
    } else {
      eligibleWords = allWords.filter(w => String(w.book) === String(activeBook));
    }

    // 備援：若單冊單字極少，補足該年級雙冊詞彙
    if (eligibleWords.length < 10) {
      const gradeBooks = getBooksForGrade(grade);
      eligibleWords = allWords.filter(w => gradeBooks.includes(String(w.book)));
      if (eligibleWords.length < 10) {
        eligibleWords = [...allWords];
      }
    }
  }

  // 3. 嚴格單字文本去重 (避免同一生字因不同課次出現而重複抽取)
  const seenEnWords = new Set();
  const uniqueEligibleWords = [];
  for (const w of eligibleWords) {
    const enClean = (w.en || '').toLowerCase().trim();
    if (enClean && !seenEnWords.has(enClean)) {
      seenEnWords.add(enClean);
      uniqueEligibleWords.push({ ...w, category: tagWordCategory(w) });
    }
  }

  const taggedPool = shuffle(uniqueEligibleWords.length >= 8 ? uniqueEligibleWords : eligibleWords.map(w => ({ ...w, category: tagWordCategory(w) })));
  const usedWordTexts = new Set();
  const allWordsInvolved = [];

  const takeWord = () => {
    let candidate = taggedPool.find(w => !usedWordTexts.has((w.en || '').toLowerCase().trim()));
    if (!candidate) {
      candidate = taggedPool[Math.floor(Math.random() * taggedPool.length)] || { id: 'fallback', en: 'star', zh: '星星' };
    }
    if (candidate?.en) {
      usedWordTexts.add(candidate.en.toLowerCase().trim());
    }
    allWordsInvolved.push(candidate);
    return candidate;
  };

  const getDistractors = (targetWord, count = 3) => {
    const targetEn = (targetWord.en || '').toLowerCase().trim();
    const targetZh = (targetWord.zh || '').trim();
    const seenTexts = new Set([targetEn]);
    const seenZh = new Set([targetZh]);
    const result = [];

    const sameCat = allWords.filter(w => (w.en || '').toLowerCase().trim() !== targetEn && tagWordCategory(w) === tagWordCategory(targetWord));
    const other = allWords.filter(w => (w.en || '').toLowerCase().trim() !== targetEn && tagWordCategory(w) !== tagWordCategory(targetWord));
    const candidates = shuffle([...sameCat, ...other]);

    for (const c of candidates) {
      const en = (c.en || '').toLowerCase().trim();
      const zh = (c.zh || '').trim();
      if (en && zh && !seenTexts.has(en) && !seenZh.has(zh)) {
        seenTexts.add(en);
        seenZh.add(zh);
        result.push(c);
        if (result.length >= count) break;
      }
    }
    return result;
  };

  let oppositesUsedInCampaign = false;

  // 生成三間房間
  const chapters = CHAMBER_CHAPTERS.map((chapMeta, chapIdx) => {
    // 1. 每關隨機生成 5 個不重疊的點位
    const hotspots = generateNonOverlappingHotspots(5);

    // 2. 隨機抽選 3 個關鍵點索引 (例如 [1, 3, 4])，其餘 2 個為迷途干擾點
    const shuffledIndices = shuffle([0, 1, 2, 3, 4]);
    const keyIndices = new Set(shuffledIndices.slice(0, 3));

    // 3. 多元題型池洗牌指派：優先使用國小高教育價值核心題型（克漏字、聽力、拼字、句子重組、對偶配對、謎語、會話）
    const coreTypes = ['cloze', 'listening', 'spelling', 'sentence_order', 'pairing', 'riddle', 'dialogue'];
    let roomTypes = shuffle([...coreTypes]).slice(0, 5);

    // 大幅壓低 opposites 出現機率：整場戰役 3 間房間最多只會出現 1 題，且整體出現率僅約 15%
    if (!oppositesUsedInCampaign && chapIdx === 1 && Math.random() < 0.15) {
      roomTypes[4] = 'opposites';
      oppositesUsedInCampaign = true;
      roomTypes = shuffle(roomTypes);
    }

    const puzzles = hotspots.map((spot, spotIdx) => {
      const isKeyRelic = keyIndices.has(spotIdx);
      const puzzleType = roomTypes[spotIdx] || 'cloze';
      const targetWord = takeWord();
      const distractors = getDistractors(targetWord, 3);

      let puzzleObj = {
        id: `${chapMeta.id}_spot_${spotIdx}`,
        top: spot.top,
        left: spot.left,
        animDelay: spot.animDelay,
        animDuration: spot.animDuration,
        isKeyRelic,
        haloType: isKeyRelic ? 'gold' : 'pale',
        type: puzzleType,
        stationName: `神秘遺跡 #${spotIdx + 1}`,
        targetWord,
        options: shuffle([targetWord, ...distractors]),
        rewardItemZh: isKeyRelic ? '關鍵逃脫印記' : '迷途古物',
        rewardItemIcon: isKeyRelic ? '🗝️' : '✨'
      };

      // 依題型構建專屬題目內容與線索
      if (puzzleType === 'cloze') {
        // 題型 1：情境克漏字填空 (讀懂前後文填空)
        const cat = tagWordCategory(targetWord);
        let sentenceWithBlank = `We can see a mysterious ___ in the ancient chamber.`;
        let zhTrans = `我們可以在古老石室中看見神秘的【${targetWord.zh}】。`;
        if (cat === 'animals') {
          sentenceWithBlank = `Look at that cute ___ sleeping under the big green tree.`;
          zhTrans = `看那隻在綠色大樹下睡覺的可愛【${targetWord.zh}】。`;
        } else if (cat === 'food') {
          sentenceWithBlank = `For lunch, I love to eat a fresh ___ with sweet juice.`;
          zhTrans = `午餐時，我喜歡吃新鮮的【${targetWord.zh}】配果汁。`;
        } else if (cat === 'school') {
          sentenceWithBlank = `Please put your ___ on the wooden desk right now.`;
          zhTrans = `請立刻把你的【${targetWord.zh}】放在木頭書桌上。`;
        } else if (cat === 'actions') {
          sentenceWithBlank = `On a sunny morning, children love to ___ in the park.`;
          zhTrans = `在陽光明媚的早晨，小朋友喜歡在公園裡【${targetWord.zh}】。`;
        } else if (cat === 'colors_numbers') {
          sentenceWithBlank = `I can see a bright ___ picture on the classroom wall.`;
          zhTrans = `我可以在教室牆上看到一張鮮豔的【${targetWord.zh}】圖片。`;
        } else if (cat === 'places_transport') {
          sentenceWithBlank = `We took a fast ___ to visit our grandparents today.`;
          zhTrans = `我們今天搭乘快捷的【${targetWord.zh}】去探望祖父母。`;
        } else if (cat === 'family') {
          sentenceWithBlank = `My ___ is cooking a sweet apple pie in the kitchen.`;
          zhTrans = `我的【${targetWord.zh}】正在廚房裡烤香甜的蘋果派。`;
        } else if (cat === 'feelings') {
          sentenceWithBlank = `After running for an hour, I feel very ___ today.`;
          zhTrans = `跑了一個小時後，我今天覺得很【${targetWord.zh}】。`;
        }
        puzzleObj.titleZh = '情境克漏字填空';
        puzzleObj.englishPrompt = sentenceWithBlank;
        puzzleObj.targetText = targetWord.en;
        puzzleObj.chineseClue = zhTrans;
        puzzleObj.voiceText = sentenceWithBlank.replace('___', targetWord.en);
        puzzleObj.options = shuffle([targetWord.en, ...distractors.map(d => d.en)]);
      }
      else if (puzzleType === 'riddle') {
        // 題型 2：生活特徵推理解謎
        const randomRiddle = shuffle(RIDDLES_POOL)[0];
        puzzleObj.titleZh = '古代特徵謎語解碼';
        puzzleObj.englishPrompt = randomRiddle.riddle;
        puzzleObj.targetText = randomRiddle.answer;
        puzzleObj.chineseClue = randomRiddle.zh;
        puzzleObj.voiceText = randomRiddle.riddle;
        puzzleObj.options = shuffle([randomRiddle.answer, ...randomRiddle.distractors]);
      }
      else if (puzzleType === 'listening') {
        // 題型 3：純聽力聲納辨詞
        puzzleObj.titleZh = '純聽力聲納辨識';
        puzzleObj.englishPrompt = '🔊 仔細聆聽石壁發出的神秘語音，選出聽到的單字：';
        puzzleObj.targetText = targetWord.en;
        puzzleObj.chineseClue = `聽力語音內容為：【${targetWord.en}】（中文意：${targetWord.zh}）`;
        puzzleObj.voiceText = targetWord.en;
        puzzleObj.options = shuffle([targetWord.en, ...distractors.map(d => d.en)]);
      }
      else if (puzzleType === 'spelling') {
        // 題型 4：百步蛇散落拼字
        const cleanLetters = targetWord.en.toLowerCase().replace(/[^a-z]/g, '').split('');
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        const extraLetters = cleanLetters.length <= 5 ? [alphabet[Math.floor(Math.random() * alphabet.length)]] : [];
        puzzleObj.titleZh = '散落符文拼字輪盤';
        puzzleObj.englishPrompt = `Spell the word for: "${targetWord.zh}"`;
        puzzleObj.targetText = targetWord.en;
        puzzleObj.chineseClue = `請拼出中文代表的單字：【${targetWord.zh}】`;
        puzzleObj.voiceText = targetWord.en;
        puzzleObj.cleanLetters = cleanLetters;
        puzzleObj.scrambledLetters = shuffle([...cleanLetters, ...extraLetters]).map((c, i) => ({ id: `sc_${i}_${c}`, char: c }));
      }
      else if (puzzleType === 'sentence_order') {
        // 題型 5：句子單字重組排列
        const sampleSentences = [
          { words: ['This', 'is', 'a', targetWord.en], zh: `這是一隻${targetWord.zh}。` },
          { words: ['I', 'can', 'see', targetWord.en], zh: `我看得見${targetWord.zh}。` },
          { words: ['We', 'like', 'the', targetWord.en], zh: `我們喜歡${targetWord.zh}。` },
          { words: ['Look', 'at', 'that', targetWord.en], zh: `看那隻${targetWord.zh}！` }
        ];
        const picked = shuffle(sampleSentences)[0];
        puzzleObj.titleZh = '古代句子詞序重組';
        puzzleObj.englishPrompt = '將下方散落的單字依正確語序排列：';
        puzzleObj.targetTokens = picked.words;
        puzzleObj.chineseClue = `重組正確句子中文為：「${picked.zh}」`;
        puzzleObj.voiceText = picked.words.join(' ');
        puzzleObj.scrambledTokens = shuffle(picked.words.map((w, i) => ({ id: `tk_${i}_${w}`, word: w })));
      }
      else if (puzzleType === 'opposites') {
        // 題型 6：反義詞對偶解碼
        const oppObj = shuffle(OPPOSITES_POOL)[0];
        const dists = shuffle(OPPOSITES_POOL.filter(o => o.opposite !== oppObj.opposite)).slice(0, 3).map(o => o.opposite);
        puzzleObj.titleZh = '對稱相反詞解碼';
        puzzleObj.englishPrompt = `What is the opposite of "${oppObj.word}"?`;
        puzzleObj.targetText = oppObj.opposite;
        puzzleObj.chineseClue = `尋找相反詞：請問【${oppObj.word}】(${oppObj.zh}) 的相反詞是什麼？`;
        puzzleObj.voiceText = `What is the opposite of ${oppObj.word}?`;
        puzzleObj.options = shuffle([oppObj.opposite, ...dists]);
      }
      else if (puzzleType === 'dialogue') {
        // 題型 7：日常會話問答呼應
        const diagObj = shuffle(DIALOGUES_POOL)[0];
        puzzleObj.titleZh = '日常英語問答呼應';
        puzzleObj.englishPrompt = `Question: "${diagObj.question}"`;
        puzzleObj.targetText = diagObj.correct;
        puzzleObj.chineseClue = `當別人問你「${diagObj.zh}」時，最恰當的回答是什麼？`;
        puzzleObj.voiceText = diagObj.question;
        puzzleObj.options = shuffle([diagObj.correct, ...diagObj.distractors]);
      }
      else {
        // 題型 8：中英雙向對偶消消樂 (pairing) - 嚴格保證 3 組單字與涵義完全互異
        const pList = [];
        const seenEn = new Set();
        const seenZh = new Set();
        for (let attempt = 0; attempt < 10 && pList.length < 3; attempt++) {
          const w = takeWord();
          const en = (w.en || '').toLowerCase().trim();
          const zh = (w.zh || '').trim();
          if (en && zh && !seenEn.has(en) && !seenZh.has(zh)) {
            seenEn.add(en);
            seenZh.add(zh);
            pList.push(w);
          }
        }
        // 保底：若抽樣未滿 3 組，補足備用詞
        const backupPairs = [
          { en: 'sun', zh: '太陽' },
          { en: 'moon', zh: '月亮' },
          { en: 'star', zh: '星星' }
        ];
        while (pList.length < 3) {
          const bp = backupPairs.find(b => !seenEn.has(b.en) && !seenZh.has(b.zh)) || backupPairs[pList.length];
          seenEn.add(bp.en);
          seenZh.add(bp.zh);
          pList.push(bp);
        }

        puzzleObj.titleZh = '中英雙向對偶消消樂';
        puzzleObj.englishPrompt = '點選左側英文與右側中文，完成 3 組成對配對：';
        puzzleObj.chineseClue = '將每一組相對應的英文字詞與中文涵義連線配對。';
        puzzleObj.voiceText = `${pList[0].en}, ${pList[1].en}, ${pList[2].en}`;
        puzzleObj.pairs = [
          { id: `pair_0_${pList[0].en}`, en: pList[0].en, zh: pList[0].zh },
          { id: `pair_1_${pList[1].en}`, en: pList[1].en, zh: pList[1].zh },
          { id: `pair_2_${pList[2].en}`, en: pList[2].en, zh: pList[2].zh }
        ];
      }

      return puzzleObj;
    });

    return {
      ...chapMeta,
      puzzles,
      keyPuzzlesCount: 3
    };
  });

  return {
    chapters,
    qualifyingBook,
    totalPuzzlesCount: 9,
    allWordsInvolved
  };
};
