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
    color: 'emerald',
    badge: '第一道門',
    runeIcon: '🐍',
    introStoryZh: '探險家在大武山探尋古老石板遺跡時，踩中了地面陷阱，身後千斤巨石轟隆落下封死退路！四周火把驟然點亮，石壁隱藏著遠古微光。房間內有 5 處神秘遺跡，但只有 3 個散發淡淡金光的才是解開石門的真正關鍵！',
    transitionStoryZh: '轟隆隆——！青銅石門發出沉重巨響緩緩升起，露出向下延伸的旋轉石階！空氣中飄散出古老羊皮紙與乾燥墨水的香氣。你快步穿過長廊，來到了沉寂千年的古代典籍密室...',
    hotspots: [
      { id: 'spot_1', nameZh: '圖騰火把石柱', top: '36%', left: '15%', hint: '燃燒著微光的青石火把柱' },
      { id: 'spot_2', nameZh: '綠寶石石龕', top: '55%', left: '25%', hint: '散發綠色幽光的石龕寶石' },
      { id: 'spot_3', nameZh: '中央古石祭台', top: '72%', left: '28%', hint: '刻滿古文字的石階祭台' },
      { id: 'spot_4', nameZh: '百步蛇石壁雕刻', top: '44%', left: '56%', hint: '盤旋守護殿堂的石雕巨蛇' },
      { id: 'spot_5', nameZh: '大門右側符文柱', top: '42%', left: '88%', hint: '青藤纏繞的厚重石柱' }
    ]
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
    introStoryZh: '高聳的環形書架直抵穹頂，漂浮魔法卷軸與古星盤在微光中輕輕旋轉。這座知識寶庫中暗藏 5 個線索節點，仔細觀察石室中的微弱呼吸光暈，找出 3 個關鍵真理印記！',
    transitionStoryZh: '咔嚓、咔嚓！隱藏在書架後方的巨型機械齒輪開始咬合旋轉，暗門赫然退開！上方傳來星際流光的呼嘯與清脆鐘鳴。你拾階而上，眼前豁然開朗，抵達了宏偉壯麗的星象祭壇大殿！',
    hotspots: [
      { id: 'spot_1', nameZh: '石壁壁爐溫火', top: '70%', left: '27%', hint: '燃燒著溫暖火焰的石造壁爐' },
      { id: 'spot_2', nameZh: '木桌古卷軸', top: '85%', left: '18%', hint: '平鋪在桌上的古代魔法羊皮紙' },
      { id: 'spot_3', nameZh: '中央星芒地圖', top: '88%', left: '53%', hint: '地面雕刻的六芒星秘術光環' },
      { id: 'spot_4', nameZh: '上方環形大書架', top: '26%', left: '55%', hint: '擺滿千卷典籍的二樓木質大書架' },
      { id: 'spot_5', nameZh: '古門雙龍雕刻', top: '56%', left: '85%', hint: '大門上盤據的雙龍浮雕神木' }
    ]
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
    introStoryZh: '巨大的黃銅渾天儀在大武山璀璨星河下緩緩運轉。前方正對著通往地表山谷的終極脫逃大門！房間星空中有 5 處天體機關，只有啟動正確的 3 顆核心星核，沉睡大門才會為你敞開！',
    victoryStoryZh: '金光萬丈——！巨大的星圖大門完全敞開，清新的高山微風伴隨著溫暖的第一道晨曦傾瀉而入！你成功破解所有古代封印，順利逃出了神秘石板密室！',
    hotspots: [
      { id: 'spot_1', nameZh: '星河拱形窗台', top: '48%', left: '23%', hint: '透出璀璨大武山星空的巨型石窗' },
      { id: 'spot_2', nameZh: '黃銅天文望遠鏡', top: '70%', left: '44%', hint: '三腳架上精密的黃銅望遠鏡' },
      { id: 'spot_3', nameZh: '星盤研讀桌', top: '68%', left: '54%', hint: '散落著渾天星圖的木質研究桌' },
      { id: 'spot_4', nameZh: '穹頂巨型齒輪', top: '20%', left: '65%', hint: '穹頂緩緩咬合的巨大黃銅齒輪組' },
      { id: 'spot_5', nameZh: '星座封印大門', top: '62%', left: '70%', hint: '鑲嵌著十二星座之圖的封印大門' }
    ]
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

/**
 * 依單字分類生成神秘簡單英文句子線索
 */
export const makeEnglishSentence = (word) => {
  const en = word.en;
  const cat = tagWordCategory(word);

  if (cat === 'animals') {
    return {
      sentence: `Look into the shadows! A wild ${en} is watching us.`,
      chineseClue: `凝視陰影深處！一隻野生的【${word.zh}】正在注視著我們。`
    };
  }
  if (cat === 'food') {
    return {
      sentence: `The ancient altar asks for a delicious ${en}.`,
      chineseClue: `古老的祭台需要獻上一份美味的【${word.zh}】。`
    };
  }
  if (cat === 'school') {
    return {
      sentence: `Find the secret tool! The ${en} holds the ancient magic.`,
      chineseClue: `找出秘密工具！這件【${word.zh}】蘊藏著遠古的智慧。`
    };
  }
  if (cat === 'actions') {
    return {
      sentence: `To pass the gate, we must ${en} together bravely!`,
      chineseClue: `要想通過大門，我們必須勇敢地一起【${word.zh}】！`
    };
  }
  if (cat === 'places_transport') {
    return {
      sentence: `The ancient map guides us forward to the ${en}.`,
      chineseClue: `古老的地圖指引我們邁向神秘的【${word.zh}】。`
    };
  }
  if (cat === 'colors_numbers') {
    return {
      sentence: `Touch the glowing rune! The color is shining ${en}.`,
      chineseClue: `輕觸發光的符文！那道神聖的光芒正是【${word.zh}】。`
    };
  }

  return {
    sentence: `Whisper the sacred password: "${en}" will awaken the seal.`,
    chineseClue: `低聲吟誦神聖的密語：【${word.zh}】將會喚醒石門封印。`
  };
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
 * 程序化生成每間密室 5 點 (3 關鍵點 + 2 干擾點) 的冒險會話
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

  // 生成三間房間，每間 5 個熱區 (隨機抽選 3 個關鍵點，2 個迷途干擾點)
  const chapters = CHAMBER_CHAPTERS.map((chapMeta) => {
    // 5 個熱區隨機洗牌打散關鍵順序
    const shuffledIndices = shuffle([0, 1, 2, 3, 4]);
    const keyIndices = new Set(shuffledIndices.slice(0, 3)); // 前 3 個為關鍵點

    const puzzles = chapMeta.hotspots.map((spot, spotIdx) => {
      const isKeyRelic = keyIndices.has(spotIdx);
      const targetWord = takeWord();
      const sentenceInfo = makeEnglishSentence(targetWord);
      const distractors = getDistractors(targetWord, 3);

      // 依位置安排題型
      let type = 'meaning';
      if (spotIdx % 3 === 0) type = 'listening';
      else if (spotIdx % 3 === 1) type = 'spelling';
      else type = 'meaning';

      // 字母拼寫資料
      const cleanLetters = targetWord.en.toLowerCase().replace(/[^a-z]/g, '').split('');
      const alphabet = 'abcdefghijklmnopqrstuvwxyz';
      const extraLetters = cleanLetters.length <= 5 ? [alphabet[Math.floor(Math.random() * alphabet.length)]] : [];

      return {
        id: `${chapMeta.id}_spot_${spotIdx}`,
        stationName: spot.nameZh,
        top: spot.top,
        left: spot.left,
        hint: spot.hint,
        isKeyRelic, // 是否為 3 個過關關鍵點之一
        haloType: isKeyRelic ? 'gold' : 'pale', // 微光光暈顏色：金光 vs 淡白光
        titleZh: spot.nameZh,
        type,
        targetWord,
        englishSentence: sentenceInfo.sentence,
        chineseClue: sentenceInfo.chineseClue,
        options: shuffle([targetWord, ...distractors]),
        cleanLetters,
        scrambledLetters: shuffle([...cleanLetters, ...extraLetters]).map((c, i) => ({ id: `scramble_${i}_${c}`, char: c })),
        rewardItemZh: isKeyRelic ? '核心石板印記' : '遠古迷途古物',
        rewardItemIcon: isKeyRelic ? '🗝️' : '✨'
      };
    });

    return {
      ...chapMeta,
      puzzles,
      keyPuzzlesCount: 3 // 每間房間必須解開 3 個關鍵印記
    };
  });

  return {
    chapters,
    qualifyingBook,
    totalPuzzlesCount: 9, // 三間房間共需解開 3 * 3 = 9 個關鍵點
    allWordsInvolved
  };
};
