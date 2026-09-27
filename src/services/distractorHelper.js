// ── 智慧教學誘答選項演算法 ──
// 規則：
// 1. 正確選項 (1個)：100% 嚴格取自使用者所選取的範圍！
// 2. 誘答選項 (3個)：
//    - 預設模式 'strict' (同選定範圍)：誘答選項全數來自當前選定範圍單字。
//      若選定範圍總單字數小於 4，則平滑回退至題庫補齊，防止重複選項或當機。
//    - 螺旋模式 'spiral' (螺旋挑戰複習)：高機率 (75%) 出現 1 個同單元單字，其餘自已學過單元（前置單元）抽取。

const getUnitWeight = (book, lesson) => {
  const bNum = parseInt(book);
  const lNum = parseInt(String(lesson).replace(/\D/g, ''));
  if (!isNaN(bNum)) {
    return bNum * 1000 + (isNaN(lNum) ? 50 : lNum);
  }
  // 教師自建專區依字串排序
  return 90000;
};

export const getLearnedPool = (allWords, selectedUnits) => {
  if (!selectedUnits || selectedUnits.length === 0) return allWords;

  // 找出所選範圍中最高冊別與課別的權重
  let maxWeight = 0;
  let hasOfficial = false;

  selectedUnits.forEach(u => {
    const [book, lesson] = u.split('-');
    const w = getUnitWeight(book, lesson);
    if (!isNaN(parseInt(book))) {
      hasOfficial = true;
      if (w > maxWeight) maxWeight = w;
    }
  });

  // 如果選的是官方教材，已學過單元即為小於等於 maxWeight 的所有單字
  if (hasOfficial && maxWeight > 0) {
    const learned = allWords.filter(w => {
      const bNum = parseInt(w.book);
      if (isNaN(bNum)) return false;
      return getUnitWeight(w.book, w.lesson) <= maxWeight;
    });
    if (learned.length >= 4) return learned;
  }

  // 若選的是教師專區或前置題目不足，則以目前選取範圍或全庫作為候選
  const selectedWords = allWords.filter(w =>
    selectedUnits.includes(`${w.book}-${w.lesson}`)
  );
  return selectedWords.length >= 4 ? selectedWords : allWords;
};

export const generateSmartOptions = (
  targetWord,
  selectedWords = [],
  allWords = [],
  key = 'en',
  mode = 'strict' // 預設為 'strict' (同選定範圍)
) => {
  const correctVal = targetWord[key];
  const chosenDistractors = [];

  // 候選過濾：同選定範圍內的非正確答案候選字
  const sameRangePool = selectedWords
    .map(w => w[key])
    .filter(val => val && String(val).toLowerCase() !== String(correctVal).toLowerCase());
  const uniqueSameRange = [...new Set(sameRangePool)].sort(() => 0.5 - Math.random());

  if (mode === 'strict') {
    // ── 模式 A：純選定範圍 (預設) ──
    // 盡可能全部由選定範圍挑選 3 個干擾字
    while (chosenDistractors.length < 3 && uniqueSameRange.length > 0) {
      chosenDistractors.push(uniqueSameRange.pop());
    }

    // 防呆護航：若選定範圍題目太少（例如選的單元只有 2~3 個字），才從全庫補充，防重複
    if (chosenDistractors.length < 3) {
      const fallbackPool = allWords
        .map(w => w[key])
        .filter(val => val && String(val).toLowerCase() !== String(correctVal).toLowerCase() && !chosenDistractors.includes(val));
      const shuffledFallback = [...new Set(fallbackPool)].sort(() => 0.5 - Math.random());
      while (chosenDistractors.length < 3 && shuffledFallback.length > 0) {
        chosenDistractors.push(shuffledFallback.pop());
      }
    }
  } else {
    // ── 模式 B：螺旋複習 ──
    // 1. 高機率 (75%) 從「同選取範圍」挑選 1 個干擾選項 (提升鑑別度)
    if (Math.random() < 0.75 && uniqueSameRange.length > 0) {
      chosenDistractors.push(uniqueSameRange.pop());
    }

    // 2. 從「已學過單字池」挑選剩餘選項 (補滿 3 個干擾項)
    const learnedPool = getLearnedPool(allWords, selectedWords.map(w => `${w.book}-${w.lesson}`));
    const availableLearned = learnedPool
      .map(w => w[key])
      .filter(val => val && String(val).toLowerCase() !== String(correctVal).toLowerCase() && !chosenDistractors.includes(val));

    const shuffledLearned = [...new Set(availableLearned)].sort(() => 0.5 - Math.random());
    while (chosenDistractors.length < 3 && shuffledLearned.length > 0) {
      chosenDistractors.push(shuffledLearned.pop());
    }

    // 3. 防呆平滑回退
    if (chosenDistractors.length < 3) {
      const fallbackPool = allWords
        .map(w => w[key])
        .filter(val => val && String(val).toLowerCase() !== String(correctVal).toLowerCase() && !chosenDistractors.includes(val));
      const shuffledFallback = [...new Set(fallbackPool)].sort(() => 0.5 - Math.random());
      while (chosenDistractors.length < 3 && shuffledFallback.length > 0) {
        chosenDistractors.push(shuffledFallback.pop());
      }
    }
  }

  // 4. 合併正確選項並洗牌輸出
  const all4 = [correctVal, ...chosenDistractors.slice(0, 3)];
  return all4.sort(() => 0.5 - Math.random()).map(text => ({
    text,
    isCorrect: String(text).toLowerCase() === String(correctVal).toLowerCase(),
    id: Math.random().toString(36).substring(2, 9)
  }));
};
