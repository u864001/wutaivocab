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

// ── 日常會話問答呼應庫 ──
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
  }
];

// ── 生活特徵謎語庫 ──
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
 * 程序化生成三連環密室大逃脫會話 (八大多元題型 + 隨機不重疊熱區 + 3關鍵2干擾)
 */
export const generateEscapeRoomCampaign = (allWords = [], options = {}) => {
  const { grade = '03', selectedUnits = [] } = options;

  let eligibleWords = [];
  let qualifyingBook = null;

  if (Array.isArray(selectedUnits) && selectedUnits.length > 0) {
    eligibleWords = allWords.filter(w => selectedUnits.includes(`${w.book}-${w.lesson}`));
    const selectedBooks = [...new Set(selectedUnits.map(u => u.split('-')[0]))];
    if (selectedBooks.length === 1 && eligibleWords.length >= 8) {
      qualifyingBook = selectedBooks[0];
    }
  }

  if (eligibleWords.length < 10) {
    const gradeBooks = getBooksForGrade(grade);
    eligibleWords = allWords.filter(w => gradeBooks.includes(String(w.book)));
    if (eligibleWords.length < 10) {
      eligibleWords = [...allWords];
    }
    qualifyingBook = gradeBooks[0] || '1';
  }

  const taggedPool = shuffle(eligibleWords.map(w => ({ ...w, category: tagWordCategory(w) })));
  const usedWordIds = new Set();
  const allWordsInvolved = [];

  const takeWord = () => {
    let candidate = taggedPool.find(w => !usedWordIds.has(w.id));
    if (!candidate) {
      candidate = taggedPool[Math.floor(Math.random() * taggedPool.length)] || { id: 'fallback', en: 'star', zh: '星星' };
    }
    usedWordIds.add(candidate.id);
    allWordsInvolved.push(candidate);
    return candidate;
  };

  const getDistractors = (targetWord, count = 3) => {
    const sameCat = allWords.filter(w => w.id !== targetWord.id && tagWordCategory(w) === tagWordCategory(targetWord));
    const other = allWords.filter(w => w.id !== targetWord.id && tagWordCategory(w) !== tagWordCategory(targetWord));
    return shuffle([...sameCat, ...other]).slice(0, count);
  };

  // 生成三間房間
  const chapters = CHAMBER_CHAPTERS.map((chapMeta, chapIdx) => {
    // 1. 每關隨機生成 5 個不重疊的點位
    const hotspots = generateNonOverlappingHotspots(5);

    // 2. 隨機抽選 3 個關鍵點索引 (例如 [1, 3, 4])，其餘 2 個為迷途干擾點
    const shuffledIndices = shuffle([0, 1, 2, 3, 4]);
    const keyIndices = new Set(shuffledIndices.slice(0, 3));

    // 3. 多元題型池洗牌指派 (克漏字、謎語、聽力、拼字、句子重組、對偶配對、反義詞、問答呼應)
    const availableTypes = shuffle([
      'cloze',           // 1. 情境克漏字填空
      'riddle',          // 2. 生活特徵推理解謎
      'listening',       // 3. 純聽力聲納辨音
      'spelling',        // 4. 百步蛇散落拼字
      'sentence_order',  // 5. 句子單字重組排列
      'opposites',       // 6. 反義詞對偶解碼
      'dialogue',        // 7. 日常會話問答呼應
      'pairing'          // 8. 中英雙向對偶消消樂
    ]);

    const puzzles = hotspots.map((spot, spotIdx) => {
      const isKeyRelic = keyIndices.has(spotIdx);
      const puzzleType = availableTypes[spotIdx] || 'cloze';
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
        let sentenceWithBlank = `We can see a wild ___ in the green mountains.`;
        let zhTrans = `我們可以在青山中看見野生的【${targetWord.zh}】。`;
        if (cat === 'food') {
          sentenceWithBlank = `For lunch, I love to eat a fresh ___ with juice.`;
          zhTrans = `午餐時，我喜歡吃新鮮的【${targetWord.zh}】配果汁。`;
        } else if (cat === 'school') {
          sentenceWithBlank = `Please open your ___ and read lesson one carefully.`;
          zhTrans = `請打開你的【${targetWord.zh}】，仔細閱讀第一課。`;
        } else if (cat === 'actions') {
          sentenceWithBlank = `On a sunny day, we can ___ happily in the park.`;
          zhTrans = `在陽光明媚的日子裡，我們可以在公園裡開心地【${targetWord.zh}】。`;
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
        // 題型 8：中英雙向對偶消消樂 (pairing)
        const pair1 = takeWord();
        const pair2 = takeWord();
        const pair3 = takeWord();
        puzzleObj.titleZh = '中英雙向對偶消消樂';
        puzzleObj.englishPrompt = '點選左側英文與右側中文，完成 3 組成對配對：';
        puzzleObj.chineseClue = '將每一組相對應的英文字詞與中文涵義連線配對。';
        puzzleObj.voiceText = `${pair1.en}, ${pair2.en}, ${pair3.en}`;
        puzzleObj.pairs = [
          { id: pair1.id, en: pair1.en, zh: pair1.zh },
          { id: pair2.id, en: pair2.en, zh: pair2.zh },
          { id: pair3.id, en: pair3.en, zh: pair3.zh }
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
