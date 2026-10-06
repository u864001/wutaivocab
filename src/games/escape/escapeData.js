// ── 密室逃脫：年級主題題庫分類對照表與程序化謎題生成引擎 ──

export const CHAMBER_THEMES = [
  {
    id: 'temple',
    nameZh: '百步蛇神廟密室',
    nameEn: 'The Sacred Serpent Temple',
    subtitleZh: '大自然、野生動物與神秘符文',
    subtitleEn: 'Nature, Wildlife & Sacred Runes',
    descZh: '深藏在大武山古老山壁中的神秘神殿，青石地板與圖騰巨柱刻劃著遠古傳說。大門被四道符文封印，唯有解開英語謎題才能迎來曙光！',
    bg: '/assets/escape/bg_temple.webp',
    color: 'emerald',
    badge: '部落探險',
    runeIcon: '🐍',
    allowedCategories: ['animals', 'nature', 'actions', 'adventure']
  },
  {
    id: 'library',
    nameZh: '長老魔法圖書館',
    nameEn: 'The Arcane Library',
    subtitleZh: '學院文具、色彩感知與生活日常',
    subtitleEn: 'School Life, Colors & Daily Wisdom',
    descZh: '環形高聳的古老書架擺滿了魔法典籍與漂浮卷軸，壁爐劈啪燃燒著微光。解鎖羊皮紙箱與符文轉盤，帶走這座知識寶庫的探險榮耀！',
    bg: '/assets/escape/bg_library.webp',
    color: 'amber',
    badge: '智慧魔法',
    runeIcon: '📜',
    allowedCategories: ['school', 'colors_numbers', 'family', 'feelings', 'adventure']
  },
  {
    id: 'observatory',
    nameZh: '星象時光鐘樓',
    nameEn: 'The Celestial Observatory',
    subtitleZh: '城鎮場所、交通工具與美味佳餚',
    subtitleEn: 'Places, Transit, Food & Constellations',
    descZh: '巨大黃銅齒輪與渾天儀在璀璨星河下緩緩運轉。大門鑲嵌著十二星座之印，只有辨識星際語音與搭配詞彙，才能開啟通往銀河的出口！',
    bg: '/assets/escape/bg_observatory.webp',
    color: 'indigo',
    badge: '星際奇幻',
    runeIcon: '🔭',
    allowedCategories: ['food', 'places_transport', 'daily_life', 'adventure']
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

  // 依單元名稱輔助分類
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
 * 動態程序化生成密室謎題
 * @param {Array} allWords - 全庫單字 (Supabase or fallback)
 * @param {Object} options - { grade, themeId, selectedUnits }
 */
export const generateEscapeRoomSession = (allWords = [], options = {}) => {
  const { grade = '03', themeId = null, selectedUnits = [] } = options;

  // 1. 決定題庫範圍與上榜冊別 (qualifyingBook)
  let eligibleWords = [];
  let qualifyingBook = null;

  if (Array.isArray(selectedUnits) && selectedUnits.length > 0) {
    // 優先使用 Lobby 勾選範圍
    eligibleWords = allWords.filter(w => selectedUnits.includes(`${w.book}-${w.lesson}`));
    const selectedBooks = [...new Set(selectedUnits.map(u => u.split('-')[0]))];
    if (selectedBooks.length === 1 && eligibleWords.length >= 10) {
      qualifyingBook = selectedBooks[0];
    }
  }

  // 若自選範圍不足 8 字，或未勾選自選範圍，依學生年級自適應挑選本年級教材單字
  if (eligibleWords.length < 8) {
    const gradeBooks = getBooksForGrade(grade);
    eligibleWords = allWords.filter(w => gradeBooks.includes(String(w.book)));
    if (eligibleWords.length < 8) {
      eligibleWords = [...allWords];
    }
    // 預設將學生本年級代表冊別設為合格冊別
    qualifyingBook = gradeBooks[0] || '1';
  }

  // 2. 挑選密室主題 (支援指定或隨機輪替，並防同主題連續出現)
  let theme = null;
  if (themeId) {
    theme = CHAMBER_THEMES.find(t => t.id === themeId) || CHAMBER_THEMES[0];
  } else {
    let lastThemeId = null;
    try {
      lastThemeId = sessionStorage.getItem('wutai_last_escape_theme');
    } catch (e) {}
    const availableThemes = CHAMBER_THEMES.filter(t => t.id !== lastThemeId);
    theme = availableThemes[Math.floor(Math.random() * availableThemes.length)] || CHAMBER_THEMES[0];
    try {
      sessionStorage.setItem('wutai_last_escape_theme', theme.id);
    } catch (e) {}
  }

  // 3. 語意分類過濾：優先提取與主題最貼近的單字
  const taggedWords = eligibleWords.map(w => ({
    ...w,
    category: tagWordCategory(w)
  }));

  const primaryPool = taggedWords.filter(w => theme.allowedCategories.includes(w.category));
  const fallbackPool = taggedWords.filter(w => !theme.allowedCategories.includes(w.category));

  // 組合總候選池 (優先主題，次用同冊補足)
  const candidatePool = shuffle([...primaryPool, ...fallbackPool]);

  // 至少需要 6 個不同單字供 4 道機關解謎與生成干擾項
  const sessionWords = candidatePool.slice(0, Math.min(candidatePool.length, 12));
  const poolForDistractors = shuffle(allWords.filter(w => !sessionWords.some(sw => sw.id === w.id)));

  // ── 謎題 1：聲納回音石門 (聽力辨識 Hearing Echo) ──
  const p1Target = sessionWords[0] || { id: 'p1', en: 'apple', zh: '蘋果' };
  const p1Distractors = shuffle([
    ...sessionWords.filter(w => w.id !== p1Target.id),
    ...poolForDistractors
  ]).slice(0, 3);
  const puzzleListening = {
    id: 'puzzle_listening',
    titleZh: '聲納回音石門',
    titleEn: 'Echo Chamber of Voices',
    type: 'listening',
    stationName: '回音石柱',
    targetWord: p1Target,
    options: shuffle([p1Target, ...p1Distractors]),
    hintZh: '點擊喇叭或石柱聆聽外師純美式發音，點選共鳴的英文字符！',
    rewardItemZh: '青銅回音符石',
    rewardItemIcon: '🟢'
  };

  // ── 謎題 2：遠古羊皮紙匣 (中文釋義與情境線索) ──
  const p2Target = sessionWords[1] || { id: 'p2', en: 'banana', zh: '香蕉' };
  const p2Distractors = shuffle([
    ...sessionWords.filter(w => w.id !== p2Target.id && w.id !== p1Target.id),
    ...poolForDistractors
  ]).slice(0, 3);
  const puzzleMeaning = {
    id: 'puzzle_meaning',
    titleZh: '遠古羊皮紙匣',
    titleEn: 'Ancient Codex Parchment',
    type: 'meaning',
    stationName: '密碼石匣',
    targetWord: p2Target,
    options: shuffle([p2Target, ...p2Distractors]),
    clueZh: p2Target.zh,
    hintZh: '解讀羊皮紙上記載的古老密語，挑選出正確的英文刻印！',
    rewardItemZh: '銀月解碼印記',
    rewardItemIcon: '🌙'
  };

  // ── 謎題 3：百步蛇拼字石盤 (字母重組與拼寫解密) ──
  const p3Target = sessionWords[2] || { id: 'p3', en: 'dog', zh: '狗' };
  const cleanTargetLetters = p3Target.en.toLowerCase().replace(/[^a-z]/g, '').split('');
  // 隨機添加 1 個干擾字母增加國小中高年級鑑別度
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const extraLetters = cleanTargetLetters.length <= 5
    ? [alphabet[Math.floor(Math.random() * alphabet.length)]]
    : [];
  const puzzleSpelling = {
    id: 'puzzle_spelling',
    titleZh: '百步蛇符文石盤',
    titleEn: 'Serpent Rune Wheel',
    type: 'spelling',
    stationName: '中央轉盤',
    targetWord: p3Target,
    cleanLetters: cleanTargetLetters,
    scrambledLetters: shuffle([...cleanTargetLetters, ...extraLetters]).map((char, index) => ({
      id: `letter-${index}-${char}`,
      char
    })),
    hintZh: '點擊下方散落的字母符文，按順序填滿石刻槽位拼出單字！',
    rewardItemZh: '黃金拼字齒輪',
    rewardItemIcon: '⚙️'
  };

  // ── 謎題 4：終極對偶之門 (英中配對 / 生活詞彙對應) ──
  const p4PairPool = shuffle(sessionWords.slice(3, 7));
  const pairingWords = p4PairPool.length >= 3 ? p4PairPool.slice(0, 3) : sessionWords.slice(0, 3);
  const puzzlePairing = {
    id: 'puzzle_pairing',
    titleZh: '終極對偶之門',
    titleEn: 'Gateway of Twin Runes',
    type: 'pairing',
    stationName: '終極封印大門',
    pairs: pairingWords.map(w => ({ id: w.id, en: w.en, zh: w.zh })),
    hintZh: '左側英文與右側中文彼此呼應，依序點選互相配對以解開門鎖！',
    rewardItemZh: '永恆逃脫之鑰',
    rewardItemIcon: '🔑'
  };

  return {
    theme,
    qualifyingBook,
    wordsInvolved: [p1Target, p2Target, p3Target, ...pairingWords],
    puzzles: [
      puzzleListening,
      puzzleMeaning,
      puzzleSpelling,
      puzzlePairing
    ]
  };
};
