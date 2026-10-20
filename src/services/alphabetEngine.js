// ═══════════════════════════════════════════════════════════════════════════
// 霧臺英語宇宙：26 字母全遊戲通用題庫與隨機生成引擎 (Alphabet Engine)
// 專為國小一、二年級打造：字母認讀、大小寫配對、序列填空、積木散落找碴、字母貪食蛇
// ═══════════════════════════════════════════════════════════════════════════

export const UPPERCASE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const LOWERCASE_ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

// 常見低年級易混淆字母對 (Confusable Pairs) - 用於生成高水準干擾項
export const CONFUSABLE_PAIRS = [
  { u: 'B', l: 'd', desc: 'B vs d' },
  { u: 'D', l: 'b', desc: 'D vs b' },
  { u: 'P', l: 'q', desc: 'P vs q' },
  { u: 'Q', l: 'p', desc: 'Q vs p' },
  { u: 'M', l: 'w', desc: 'M vs w' },
  { u: 'W', l: 'm', desc: 'W vs m' },
  { u: 'N', l: 'u', desc: 'N vs u' },
  { u: 'U', l: 'n', desc: 'U vs n' },
  { u: 'C', l: 'o', desc: 'C vs o' },
  { u: 'E', l: 'f', desc: 'E vs f' },
  { u: 'I', l: 'l', desc: 'I vs l' },
  { u: 'G', l: 'q', desc: 'G vs q' }
];

export const SHUFFLE = (arr) => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// ── 1. 貪食蛇：A 到 Z 無縫循環字母珍珠序列 ──
export const getSnakeNextLetter = (currentIndex = 0, isLower = false) => {
  const char = isLower ? LOWERCASE_ALPHABET[currentIndex % 26] : UPPERCASE_ALPHABET[currentIndex % 26];
  const nextIndex = (currentIndex + 1) % 26;
  const isLoopComplete = nextIndex === 0;
  return {
    char,
    currentIndex,
    nextIndex,
    isLoopComplete,
    displayEn: char,
    displayZh: `第 ${currentIndex + 1} 個字母 (${char})`
  };
};

// ── 2. 翻牌記憶對決：大小寫配對牌卡生成器 (A ↔ a, B ↔ b) ──
export const generateMemoryAlphabetDeck = (pairCount = 8) => {
  const selectedRoots = SHUFFLE(UPPERCASE_ALPHABET).slice(0, Math.min(pairCount, 12));
  const cards = [];

  selectedRoots.forEach((upper, idx) => {
    const lower = upper.toLowerCase();
    // 大寫卡
    cards.push({
      id: `card_upper_${upper}_${idx}`,
      pairId: `pair_${upper}`,
      display: upper,
      subDisplay: `大寫字母`,
      type: 'letter_upper',
      char: upper,
      isSpecial: false
    });
    // 小寫卡
    cards.push({
      id: `card_lower_${lower}_${idx}`,
      pairId: `pair_${upper}`,
      display: lower,
      subDisplay: `小寫字母`,
      type: 'letter_lower',
      char: lower,
      isSpecial: false
    });
  });

  return SHUFFLE(cards);
};

// ── 3. 看中選英 / 看英選中 / 聽力測驗：字母選擇題生成器 ──
export const generateQuizAlphabetQuestions = (quizType = 'upper_to_lower', count = 20) => {
  // quizType: 'upper_to_lower' (看大選小) | 'lower_to_upper' (看小選大) | 'listening' (聽音選字母)
  const roots = [];
  while (roots.length < count) {
    roots.push(...SHUFFLE(UPPERCASE_ALPHABET));
  }
  const selectedRoots = roots.slice(0, count);

  return selectedRoots.map((root, index) => {
    const upper = root;
    const lower = root.toLowerCase();

    let promptText = '';
    let targetDisplay = '';
    let audioText = root;
    let correctAnswer = '';
    let isTargetLower = false;

    if (quizType === 'upper_to_lower') {
      promptText = '請選出對應的小寫字母：';
      targetDisplay = upper;
      correctAnswer = lower;
      isTargetLower = true;
    } else if (quizType === 'lower_to_upper') {
      promptText = '請選出對應的大寫字母：';
      targetDisplay = lower;
      correctAnswer = upper;
      isTargetLower = false;
    } else {
      // listening
      promptText = '請聆聽字母發音，選出正確的字母：';
      targetDisplay = '🎧';
      audioText = root;
      correctAnswer = Math.random() < 0.5 ? upper : lower;
      isTargetLower = correctAnswer === lower;
    }

    // 生成干擾項：優先挑選混淆字母，不足時補隨機字母
    const distractors = [];
    const confusable = CONFUSABLE_PAIRS.find(p => p.u === upper);
    if (confusable) {
      distractors.push(isTargetLower ? confusable.l : confusable.u);
    }

    const otherRoots = UPPERCASE_ALPHABET.filter(r => r !== upper && (!confusable || r !== confusable.u.toUpperCase()));
    const shuffledOthers = SHUFFLE(otherRoots);

    while (distractors.length < 3 && shuffledOthers.length > 0) {
      const cand = shuffledOthers.pop();
      const distChar = isTargetLower ? cand.toLowerCase() : cand;
      if (!distractors.includes(distChar) && distChar !== correctAnswer) {
        distractors.push(distChar);
      }
    }

    const rawOptions = [
      { text: correctAnswer, isCorrect: true },
      ...distractors.map(d => ({ text: d, isCorrect: false }))
    ];

    const shuffledOptions = SHUFFLE(rawOptions).map((opt, optIdx) => ({
      ...opt,
      key: String.fromCharCode(65 + optIdx) // A, B, C, D
    }));

    return {
      id: `q_alpha_${quizType}_${index}`,
      type: quizType,
      prompt: promptText,
      target: targetDisplay,
      audioText: audioText,
      en: quizType === 'upper_to_lower' ? upper : lower,
      zh: `字母 ${upper} / ${lower}`,
      correctAnswer,
      options: shuffledOptions
    };
  });
};

// ── 4. 單字積木拼裝：字母序列連續拼裝題型生成器 ──
// 規則：4~5 個連續字母，純全大寫或純全小寫，挖空 1~2 個字母，下方候選積木保持同大小寫
export const generateSpellingAlphabetQuestion = (index = 0) => {
  const isUpper = Math.random() < 0.5;
  const alphabet = isUpper ? UPPERCASE_ALPHABET : LOWERCASE_ALPHABET;
  const seqLength = Math.random() < 0.5 ? 4 : 5; // 4 或 5 個連續字母
  const maxStart = 26 - seqLength;
  const startIdx = Math.floor(Math.random() * (maxStart + 1));
  const sequenceChars = alphabet.slice(startIdx, startIdx + seqLength);

  // 挖空 1 或 2 個空格 (長度 4 挖 1 個，長度 5 挖 1~2 個)
  const blankCount = seqLength === 5 && Math.random() < 0.4 ? 2 : 1;
  const blankIndices = [];
  // 優先挖中間的字母，讓前後有提示，若挖2個則分開
  const possibleIndices = Array.from({ length: seqLength }, (_, i) => i);
  const shuffledIndices = SHUFFLE(possibleIndices);
  for (let i = 0; i < blankCount; i++) {
    blankIndices.push(shuffledIndices[i]);
  }
  blankIndices.sort((a, b) => a - b);

  const correctAnswers = blankIndices.map(bIdx => sequenceChars[bIdx]);

  // 生成干擾積木 (嚴格保持與題幹相同的大小寫！)
  const otherAlphabet = alphabet.filter(c => !sequenceChars.includes(c));
  const distractorCount = blankCount === 1 ? 3 : 2; // 候選總數維持 4 塊積木
  const distractors = SHUFFLE(otherAlphabet).slice(0, distractorCount);

  const candidateTiles = SHUFFLE([
    ...correctAnswers.map((char, i) => ({ id: `tile_ans_${i}_${char}`, char, isAnswer: true })),
    ...distractors.map((char, i) => ({ id: `tile_dist_${i}_${char}`, char, isAnswer: false }))
  ]);

  // 構成槽位定義
  const slots = sequenceChars.map((char, idx) => {
    const isBlank = blankIndices.includes(idx);
    return {
      slotIndex: idx,
      expectedChar: char,
      initialChar: isBlank ? null : char,
      isGiven: !isBlank
    };
  });

  return {
    id: `spell_alpha_${index}`,
    isUpper,
    seqLength,
    blankCount,
    sequenceChars,
    slots,
    candidateTiles,
    targetWord: sequenceChars.join(''),
    meaningZh: isUpper ? '大寫字母順序拼裝' : '小寫字母順序拼裝',
    promptZh: `請依英文字母表的順序，拖曳或點選積木補齊空格：`
  };
};

// ── 5. 神祕密室逃脫：四大字母古代神石鎖題型生成器 ──
export const generateEscapeAlphabetPuzzles = (grade = '01') => {
  const isGrade2 = grade === '02';

  // 題型 1：順序缺字鎖 (如 H I [ ? ] K)
  const isUpper1 = !isGrade2 || Math.random() < 0.5;
  const alpha1 = isUpper1 ? UPPERCASE_ALPHABET : LOWERCASE_ALPHABET;
  const start1 = Math.floor(Math.random() * 22);
  const seq1 = alpha1.slice(start1, start1 + 4);
  const blankIdx1 = 1 + Math.floor(Math.random() * 2); // 挖第 2 或第 3 個
  const targetChar1 = seq1[blankIdx1];
  const puzzle1Prompt = seq1.map((c, i) => i === blankIdx1 ? '【 ? 】' : c).join('  ➔  ');
  const otherRoots1 = alpha1.filter(c => c !== targetChar1);
  const opts1 = SHUFFLE([
    { text: targetChar1, isCorrect: true },
    ...SHUFFLE(otherRoots1).slice(0, 3).map(c => ({ text: c, isCorrect: false }))
  ]);

  // 題型 2：聽神秘神獸音選字母
  const targetChar2 = UPPERCASE_ALPHABET[Math.floor(Math.random() * 26)];
  const displayChar2 = isGrade2 && Math.random() < 0.5 ? targetChar2.toLowerCase() : targetChar2;
  const opts2 = SHUFFLE([
    { text: displayChar2, isCorrect: true },
    ...SHUFFLE(UPPERCASE_ALPHABET.filter(c => c !== targetChar2)).slice(0, 3).map(c => ({
      text: isGrade2 && Math.random() < 0.5 ? c.toLowerCase() : c,
      isCorrect: false
    }))
  ]);

  // 題型 3：三串中找出順序正確的那一串
  const alpha3 = !isGrade2 || Math.random() < 0.5 ? UPPERCASE_ALPHABET : LOWERCASE_ALPHABET;
  const start3 = Math.floor(Math.random() * 22);
  const correctSeq3 = alpha3.slice(start3, start3 + 4).join(' - ');
  // 錯誤項 A：順序顛倒 (如 A C B D)
  const wrongSeq3A = [alpha3[start3], alpha3[start3 + 2], alpha3[start3 + 1], alpha3[start3 + 3]].join(' - ');
  // 錯誤項 B：跳字錯誤 (如 A B D E)
  const wrongSeq3B = [alpha3[start3], alpha3[start3 + 1], alpha3[start3 + 3], alpha3[start3 + 4] || 'Z'].join(' - ');
  const opts3 = SHUFFLE([
    { text: correctSeq3, isCorrect: true },
    { text: wrongSeq3A, isCorrect: false },
    { text: wrongSeq3B, isCorrect: false }
  ]);

  // 題型 4：左右兩堆找落單者 (左堆 5 個，右堆 6 個，找出多出來的唯一字母)
  const alpha4 = !isGrade2 || Math.random() < 0.5 ? UPPERCASE_ALPHABET : LOWERCASE_ALPHABET;
  const pickedLetters = SHUFFLE(alpha4).slice(0, 6);
  const commonLetters = pickedLetters.slice(0, 5);
  const oddLetter = pickedLetters[5]; // 第 6 個落單者
  const leftPile = SHUFFLE(commonLetters);
  const rightPile = SHUFFLE([...commonLetters, oddLetter]);
  const opts4 = SHUFFLE([
    { text: oddLetter, isCorrect: true },
    ...SHUFFLE(commonLetters).slice(0, 3).map(c => ({ text: c, isCorrect: false }))
  ]);

  return [
    {
      chamberNum: 1,
      title: '第一關：星石序列缺字鎖',
      desc: '觀察石板上的字母順序，解開問號處的封印字母：',
      displayPrompt: puzzle1Prompt,
      options: opts1,
      audioText: null
    },
    {
      chamberNum: 2,
      title: '第二關：大武神獸天籟之音',
      desc: '聆聽神獸的呼喚，選出呼應的神聖字母：',
      displayPrompt: '🔊 點擊按鈕聆聽字母發音',
      audioText: targetChar2,
      options: opts2
    },
    {
      chamberNum: 3,
      title: '第三關：古老字母軌道辨析',
      desc: '三組石板符文中，只有一組遵守正確的字母順序，請將它找出：',
      displayPrompt: '請找出順序完全正確的符文軌道：',
      options: opts3,
      audioText: null
    },
    {
      chamberNum: 4,
      title: '第四關：雙子石盤找孤星',
      desc: '右盤比左盤多了一個落單的字母，請眼明手快找出它：',
      leftPile,
      rightPile,
      displayPrompt: `左盤（${leftPile.join('  ')}） vs 右盤（${rightPile.join('  ')}）`,
      options: opts4,
      audioText: null
    }
  ];
};

// ── 6. 鷹眼神探：左右托盤散落彩色字母積木找碴生成器 ──
const VIBRANT_COLORS = [
  '#ef4444', // 鮮紅
  '#3b82f6', // 湛藍
  '#10b981', // 翠綠
  '#f59e0b', // 琥珀黃
  '#8b5cf6', // 紫羅蘭
  '#ec4899', // 桃粉
  '#06b6d4', // 青綠
  '#f97316'  // 暖橘
];

const BLOCK_FONTS = [
  'system-ui, sans-serif',
  'Arial, Helvetica, sans-serif',
  'Comic Sans MS, cursive, sans-serif',
  'Impact, Charcoal, sans-serif',
  'Trebuchet MS, sans-serif',
  'Verdana, Geneva, sans-serif'
];

export const generateSpotterAlphabetRound = (itemCount = 6, diffCount = 3, grade = '01') => {
  const isGrade2 = grade === '02';
  const roots = SHUFFLE(UPPERCASE_ALPHABET).slice(0, itemCount);

  // 在左右兩盤中均勻分佈座標 (防止重疊)
  // 建立 3x3 網格槽位隨機挑選位置
  const gridSlots = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      gridSlots.push({
        x: 18 + c * 32 + (Math.random() * 8 - 4), // 百分比
        y: 18 + r * 30 + (Math.random() * 8 - 4)
      });
    }
  }
  const chosenSlots = SHUFFLE(gridSlots).slice(0, itemCount);

  // 挑選哪些字母要被設為「差異點」
  const diffIndices = SHUFFLE(Array.from({ length: itemCount }, (_, i) => i)).slice(0, diffCount);

  const leftBlocks = [];
  const rightBlocks = [];
  const differences = [];

  roots.forEach((rootChar, idx) => {
    const isUpper = !isGrade2 || Math.random() < 0.6;
    const char = isUpper ? rootChar : rootChar.toLowerCase();
    const pos = chosenSlots[idx];
    const font = BLOCK_FONTS[Math.floor(Math.random() * BLOCK_FONTS.length)];
    const color = VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)];
    const fontSize = 32 + Math.floor(Math.random() * 16); // 32px ~ 48px
    // 隨機傾斜 -22度 到 +22度 (絕對不翻轉、不鏡像！)
    const rotation = Math.round(Math.random() * 44 - 22);

    const isDifferent = diffIndices.includes(idx);

    const baseBlock = {
      id: `block_${idx}`,
      char,
      rootChar,
      x: pos.x,
      y: pos.y,
      font,
      color,
      fontSize,
      rotation,
      isDifference: isDifferent
    };

    if (!isDifferent) {
      // 兩邊完全一致
      leftBlocks.push({ ...baseBlock, side: 'left' });
      rightBlocks.push({ ...baseBlock, side: 'right' });
    } else {
      // 植入差異！4 種差異類型隨機挑選
      const diffTypes = ['color', 'char', 'missing'];
      if (isGrade2) diffTypes.push('case');
      const chosenDiff = diffTypes[Math.floor(Math.random() * diffTypes.length)];

      let rightChar = char;
      let rightColor = color;
      let rightVisible = true;
      let reasonText = '';

      if (chosenDiff === 'color') {
        const otherColors = VIBRANT_COLORS.filter(c => c !== color);
        rightColor = otherColors[Math.floor(Math.random() * otherColors.length)];
        reasonText = `字母 ${char} 顏色相異`;
      } else if (chosenDiff === 'char') {
        const otherChars = (isUpper ? UPPERCASE_ALPHABET : LOWERCASE_ALPHABET).filter(c => c !== char);
        rightChar = otherChars[Math.floor(Math.random() * otherChars.length)];
        reasonText = `字母不同（左為 ${char}，右為 ${rightChar}）`;
      } else if (chosenDiff === 'missing') {
        rightVisible = false;
        reasonText = `右盤缺少字母 ${char}`;
      } else if (chosenDiff === 'case') {
        rightChar = isUpper ? char.toLowerCase() : char.toUpperCase();
        reasonText = `大小寫相異（左為 ${char}，右為 ${rightChar}）`;
      }

      const diffId = `diff_${idx}`;
      differences.push({
        id: diffId,
        blockIndex: idx,
        reason: reasonText,
        x: pos.x,
        y: pos.y,
        isFound: false
      });

      leftBlocks.push({
        ...baseBlock,
        side: 'left',
        diffId
      });

      rightBlocks.push({
        ...baseBlock,
        side: 'right',
        char: rightChar,
        color: rightColor,
        isVisible: rightVisible,
        diffId
      });
    }
  });

  return {
    leftBlocks,
    rightBlocks,
    differences,
    totalDiffs: diffCount,
    promptZh: `左右托盤中共有 ${diffCount} 處積木差異（顏色不同、字母不同或缺少），請找出它們！`
  };
};
