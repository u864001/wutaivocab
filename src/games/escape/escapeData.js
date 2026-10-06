// ── 密室逃脫：三連環多房間劇情冒險與程序化謎題生成引擎 ──

export const CHAMBER_CHAPTERS = [
  {
    id: 'chamber_1',
    roomNumber: 1,
    titleZh: '第一室：百步蛇前殿 • 回音石廊',
    titleEn: 'Chamber I: The Echo Antechamber',
    subtitleZh: '大自然生態與聽力共鳴',
    themeId: 'temple',
    bg: '/assets/escape/bg_temple.webp',
    bgmId: 'cinema', // 懸疑神秘探險音樂
    color: 'emerald',
    badge: '第一道門',
    runeIcon: '🐍',
    introStoryZh: '探險家在大武山探尋古老石板遺跡時，踩中了地面陷阱，身後千斤巨石轟隆落下封死退路！四周火把驟然點亮，石柱發出神秘回音。唯有破解此處的語言封印，才能升起石門逃往深處！',
    transitionStoryZh: '轟隆隆——！青銅石門發出沉重巨響緩緩升起，露出向下延伸的旋轉石階！空氣中飄散出古老羊皮紙與乾燥墨水的香氣。你快步穿過長廊，來到了沉寂千年的古代典籍密室...',
    puzzleTypes: ['listening', 'meaning']
  },
  {
    id: 'chamber_2',
    roomNumber: 2,
    titleZh: '第二室：長老秘境 • 典籍知識庫',
    titleEn: 'Chamber II: The Arcane Archives',
    subtitleZh: '古卷書庫與拼字構詞',
    themeId: 'library',
    bg: '/assets/escape/bg_library.webp',
    bgmId: 'bookstore', // 典雅神秘魔法書香音樂
    color: 'amber',
    badge: '第二道門',
    runeIcon: '📜',
    introStoryZh: '高聳的環形書架直抵穹頂，漂浮魔法卷軸與古星盤在微光中輕輕旋轉。通往深處的暗門被古代拼字轉盤與釋義封印緊緊扣住。繼續推敲線索，找出前進的通道吧！',
    transitionStoryZh: '咔嚓、咔嚓！隱藏在書架後方的巨型機械齒輪開始咬合旋轉，暗門赫然退開！上方傳來星際流光的呼嘯與清脆鐘鳴。你拾階而上，眼前豁然開朗，抵達了宏偉壯麗的星象祭壇大殿！',
    puzzleTypes: ['spelling', 'meaning']
  },
  {
    id: 'chamber_3',
    roomNumber: 3,
    titleZh: '第三室：大武山之巔 • 星象脫逃祭壇',
    titleEn: 'Chamber III: The Celestial Sanctuary',
    subtitleZh: '星際鐘樓與終極對偶之門',
    themeId: 'observatory',
    bg: '/assets/escape/bg_observatory.webp',
    bgmId: 'plaza', // 宏大莊嚴史詩通關音樂
    color: 'indigo',
    badge: '終極脫逃門',
    runeIcon: '🔭',
    introStoryZh: '巨大的黃銅渾天儀在大武山璀璨星河下緩緩運轉。前方正對著通往地表山谷的終極脫逃大門！大門需要注入精準拼字能量並解開雙重星座配對印記，重見天日的時刻就在眼前！',
    victoryStoryZh: '金光萬丈——！巨大的星圖大門完全敞開，清新的高山微風伴隨著溫暖的第一道晨曦傾瀉而入！你成功破解所有古代封印，順利逃出了神秘石板密室！',
    puzzleTypes: ['spelling', 'pairing']
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

/**
 * 依據單字英文字根、中文意或冊次，為單字判定主題類別
 */
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

/**
 * 依學生年級取得推薦冊別
 */
export const getBooksForGrade = (grade) => {
  const g = String(grade || '').padStart(2, '0');
  if (g === '01') return ['1', 'abc'];
  if (g === '02') return ['2', 'abc'];
  if (g === '03') return ['1', '2'];
  if (g === '04') return ['3', '4'];
  if (g === '05') return ['5', '6'];
  if (g === '06') return ['7', '8'];
  return ['1', '2', '3', '4', '5', '6', '7', '8']; // 訪客全開放
};

/**
 * 洗牌工具
 */
const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * 程序化生成三連環密室大逃脫會話 (Multi-Chamber Campaign Generator)
 */
export const generateEscapeRoomCampaign = (allWords = [], options = {}) => {
  const { grade = '03', selectedUnits = [] } = options;

  // 1. 決定題庫範圍與上榜冊別 (qualifyingBook)
  let eligibleWords = [];
  let qualifyingBook = null;

  if (Array.isArray(selectedUnits) && selectedUnits.length > 0) {
    eligibleWords = allWords.filter(w => selectedUnits.includes(`${w.book}-${w.lesson}`));
    const selectedBooks = [...new Set(selectedUnits.map(u => u.split('-')[0]))];
    if (selectedBooks.length === 1 && eligibleWords.length >= 8) {
      qualifyingBook = selectedBooks[0];
    }
  }

  // 若自選範圍不足 10 字，自動依年級選定本年級教材單字
  if (eligibleWords.length < 10) {
    const gradeBooks = getBooksForGrade(grade);
    eligibleWords = allWords.filter(w => gradeBooks.includes(String(w.book)));
    if (eligibleWords.length < 10) {
      eligibleWords = [...allWords];
    }
    qualifyingBook = gradeBooks[0] || '1';
  }

  const taggedPool = eligibleWords.map(w => ({
    ...w,
    category: tagWordCategory(w)
  }));

  const shuffledPool = shuffle(taggedPool);
  const usedWordIds = new Set();
  const allWordsInvolved = [];

  // 工具：從候選池中取出非重複的單字
  const takeWord = (preferredCategories = []) => {
    let candidate = shuffledPool.find(w => !usedWordIds.has(w.id) && preferredCategories.includes(w.category));
    if (!candidate) {
      candidate = shuffledPool.find(w => !usedWordIds.has(w.id));
    }
    if (!candidate) {
      // 題庫耗盡時循環複用
      candidate = shuffledPool[Math.floor(Math.random() * shuffledPool.length)] || { id: 'fallback', en: 'star', zh: '星星' };
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

  // 2. 為三個房間分別生成題目
  const chapters = CHAMBER_CHAPTERS.map((chapMeta, chapIdx) => {
    const puzzles = [];

    if (chapMeta.id === 'chamber_1') {
      // 第一室：聽力聲納 (1) + 羊皮紙釋義 (2)
      const p1Target = takeWord(['animals', 'nature', 'actions']);
      const p1Distractors = getDistractors(p1Target, 3);
      puzzles.push({
        id: 'p1_listening',
        titleZh: '聲納回音石門',
        titleEn: 'Echo Chamber of Voices',
        type: 'listening',
        stationName: '回音石柱',
        targetWord: p1Target,
        options: shuffle([p1Target, ...p1Distractors]),
        hintZh: '點擊石柱聆聽外師純美式發音，點選共鳴的英文字符！',
        rewardItemZh: '青銅回音符石',
        rewardItemIcon: '🟢'
      });

      const p2Target = takeWord(['animals', 'nature', 'food']);
      const p2Distractors = getDistractors(p2Target, 3);
      puzzles.push({
        id: 'p1_meaning',
        titleZh: '石壁圖騰線索',
        titleEn: 'Ancient Codex Clue',
        type: 'meaning',
        stationName: '壁刻石匣',
        targetWord: p2Target,
        options: shuffle([p2Target, ...p2Distractors]),
        clueZh: p2Target.zh,
        hintZh: '依據壁刻中文線索，挑選相應的英文圖騰！',
        rewardItemZh: '青銅解鎖鑰匙',
        rewardItemIcon: '🗝️'
      });
    } else if (chapMeta.id === 'chamber_2') {
      // 第二室：拼字轉盤 (1) + 典籍釋義 (2)
      const p3Target = takeWord(['school', 'colors_numbers', 'family']);
      const cleanLetters = p3Target.en.toLowerCase().replace(/[^a-z]/g, '').split('');
      const alphabet = 'abcdefghijklmnopqrstuvwxyz';
      const extraLetters = cleanLetters.length <= 5 ? [alphabet[Math.floor(Math.random() * alphabet.length)]] : [];
      puzzles.push({
        id: 'p2_spelling',
        titleZh: '古卷拼字輪盤',
        titleEn: 'Arcane Spelling Disc',
        type: 'spelling',
        stationName: '中央典籍轉盤',
        targetWord: p3Target,
        cleanLetters,
        scrambledLetters: shuffle([...cleanLetters, ...extraLetters]).map((c, i) => ({ id: `p2_${i}_${c}`, char: c })),
        hintZh: '點擊散落的字母重組單字，解開轉盤齒輪！',
        rewardItemZh: '銀月齒輪',
        rewardItemIcon: '⚙️'
      });

      const p4Target = takeWord(['school', 'feelings', 'colors_numbers']);
      const p4Distractors = getDistractors(p4Target, 3);
      puzzles.push({
        id: 'p2_meaning',
        titleZh: '長老羊皮紙匣',
        titleEn: 'Elder Parchment Box',
        type: 'meaning',
        stationName: '智慧石匣',
        targetWord: p4Target,
        options: shuffle([p4Target, ...p4Distractors]),
        clueZh: p4Target.zh,
        hintZh: '解鎖智慧石匣：挑選符合羊皮紙文字的正確詞彙！',
        rewardItemZh: '銀月暗門鑰匙',
        rewardItemIcon: '🗝️'
      });
    } else {
      // 第三室：星際拼字 (1) + 終極雙印對偶大門 (2)
      const p5Target = takeWord(['places_transport', 'daily_life', 'food']);
      const cleanLetters = p5Target.en.toLowerCase().replace(/[^a-z]/g, '').split('');
      const alphabet = 'abcdefghijklmnopqrstuvwxyz';
      const extraLetters = cleanLetters.length <= 5 ? [alphabet[Math.floor(Math.random() * alphabet.length)]] : [];
      puzzles.push({
        id: 'p3_spelling',
        titleZh: '星際拼字解碼盤',
        titleEn: 'Celestial Word Dial',
        type: 'spelling',
        stationName: '渾天儀拼字台',
        targetWord: p5Target,
        cleanLetters,
        scrambledLetters: shuffle([...cleanLetters, ...extraLetters]).map((c, i) => ({ id: `p3_${i}_${c}`, char: c })),
        hintZh: '重組渾天儀上的星際單字，點亮脫逃光芒！',
        rewardItemZh: '黃金星盤印記',
        rewardItemIcon: '🌟'
      });

      const pair1 = takeWord();
      const pair2 = takeWord();
      const pair3 = takeWord();
      puzzles.push({
        id: 'p3_pairing',
        titleZh: '終極對偶大門',
        titleEn: 'The Final Gateway',
        type: 'pairing',
        stationName: '終極封印門扉',
        pairs: [
          { id: pair1.id, en: pair1.en, zh: pair1.zh },
          { id: pair2.id, en: pair2.en, zh: pair2.zh },
          { id: pair3.id, en: pair3.en, zh: pair3.zh }
        ],
        hintZh: '配對 3 組英中星象符文，徹底開啟逃脫大門！',
        rewardItemZh: '永恆自由之鑰',
        rewardItemIcon: '🔑'
      });
    }

    return {
      ...chapMeta,
      puzzles
    };
  });

  return {
    chapters,
    qualifyingBook,
    totalPuzzlesCount: 6,
    allWordsInvolved
  };
};
