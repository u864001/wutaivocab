// ── 智慧教學誘答選項演算法 ──
// 規則：
// 1. 正確選項 (1個)
// 2. 誘答選項 (3個)：
//    - 高機率 (75%) 出現 1 個同屬於「當前選取範圍」的單字 (提升鑑別度)
//    - 其餘選項從「已學過單元」（該範圍之前的所有單元）中隨機抽取 (複習舊單元)
//    - 若前置單元數量不足，則平滑回退至目前範圍或全題庫

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

export const generateSmartOptions = (targetWord, selectedWords, allWords, key = 'en') => {
  const correctVal = targetWord[key];
  const chosenDistractors = [];

  // 1. 高機率 (75%) 從「同選取範圍」挑選 1 個干擾選項
  const sameRangePool = selectedWords
    .map(w => w[key])
    .filter(val => val && val.toLowerCase() !== correctVal.toLowerCase());

  if (Math.random() < 0.75 && sameRangePool.length > 0) {
    const picked = sameRangePool[Math.floor(Math.random() * sameRangePool.length)];
    chosenDistractors.push(picked);
  }

  // 2. 從「已學過單字池」挑選剩餘選項 (補滿 3 個干擾項)
  const learnedPool = getLearnedPool(allWords, selectedWords.map(w => `${w.book}-${w.lesson}`));
  const availableLearned = learnedPool
    .map(w => w[key])
    .filter(val => val && val.toLowerCase() !== correctVal.toLowerCase() && !chosenDistractors.includes(val));

  // 隨機打散候選池
  const shuffledLearned = [...new Set(availableLearned)].sort(() => 0.5 - Math.random());

  while (chosenDistractors.length < 3 && shuffledLearned.length > 0) {
    chosenDistractors.push(shuffledLearned.pop());
  }

  // 3. 防呆護航：若前置池依然湊不滿 3 個，從全庫候選
  if (chosenDistractors.length < 3) {
    const fallbackPool = allWords
      .map(w => w[key])
      .filter(val => val && val.toLowerCase() !== correctVal.toLowerCase() && !chosenDistractors.includes(val));
    const shuffledFallback = [...new Set(fallbackPool)].sort(() => 0.5 - Math.random());
    while (chosenDistractors.length < 3 && shuffledFallback.length > 0) {
      chosenDistractors.push(shuffledFallback.pop());
    }
  }

  // 4. 合併正確選項並洗牌輸出
  const all4 = [correctVal, ...chosenDistractors.slice(0, 3)];
  return all4.sort(() => 0.5 - Math.random()).map(text => ({
    text,
    isCorrect: text.toLowerCase() === correctVal.toLowerCase(),
    id: Math.random().toString(36).substring(2, 9)
  }));
};
