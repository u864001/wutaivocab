// ── 智慧教學誘答選項演算法 ──
// 規則：
// 1. 正確選項 (1個)：100% 嚴格取自使用者所選取的範圍！
// 2. 單元順序：Starter(最前) -> Unit 1,2,3,4 -> Review -> Festival(最後)
// 3. 誘答選項：
//    - 預設模式 'strict' (同選定範圍)：誘答選項 100% 全數來自當前選定範圍單字。
//      若選定範圍總單字數少於 4，僅從選定範圍內可用的字產生選項（2選1或3選1），絕不出範圍外的單字！
//    - 螺旋模式 'spiral' (螺旋挑戰複習)：高機率 (75%) 出現同單元單字，其餘自前置已學單元抽取。

export const getUnitWeight = (book, lesson) => {
  const bNum = parseInt(book);
  if (!isNaN(bNum)) {
    const s = String(lesson).toLowerCase();
    let lWeight = 50;
    if (s.includes('starter')) {
      lWeight = 0; // Starter 一律排在該冊最前面
    } else if (s.includes('festival') || s.includes('culture')) {
      lWeight = 99; // Festival 節慶文化一律排在該冊最後面
    } else if (s.includes('review')) {
      const rNum = parseInt(s.replace(/\D/g, ''));
      lWeight = 80 + (isNaN(rNum) ? 0 : rNum);
    } else {
      const n = parseInt(s.replace(/\D/g, ''));
      if (!isNaN(n)) lWeight = n;
    }
    return bNum * 1000 + lWeight;
  }
  // 教師自建專區依字串排序
  return 90000;
};

export const getLearnedPool = (allWords, selectedUnits) => {
  if (!selectedUnits || selectedUnits.length === 0) return allWords;

  // 找出所選範圍中最高冊別與課別的權重 (依循 1~8 冊循序漸進原則)
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

  // 若選的是教師專區或前置題目不足，則以目前選取範圍作為候選
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

  // 候選過濾：同選定範圍內「排除正確答案」且「去除重複文字」的候選字
  const sameRangePool = selectedWords
    .map(w => w[key])
    .filter(val => val && String(val).toLowerCase() !== String(correctVal).toLowerCase());
  const uniqueSameRange = [...new Set(sameRangePool)].sort(() => 0.5 - Math.random());

  if (mode === 'strict') {
    // ── 模式 A：純選定範圍 (預設) ──
    // 100% 嚴格全部由選定範圍挑選干擾字，絕不洩漏到範圍外！
    while (chosenDistractors.length < 3 && uniqueSameRange.length > 0) {
      chosenDistractors.push(uniqueSameRange.pop());
    }
  } else {
    // ── 模式 B：螺旋複習 ──
    // 1. 高機率 (75%) 從「同選取範圍」挑選 1 個干擾選項 (提升鑑別度)
    if (Math.random() < 0.75 && uniqueSameRange.length > 0) {
      chosenDistractors.push(uniqueSameRange.pop());
    }

    // 2. 從「已學過單字池」挑選剩餘選項 (前置單元溫故知新)
    const learnedPool = getLearnedPool(allWords, selectedWords.map(w => `${w.book}-${w.lesson}`));
    const availableLearned = learnedPool
      .map(w => w[key])
      .filter(val => val && String(val).toLowerCase() !== String(correctVal).toLowerCase() && !chosenDistractors.includes(val));

    const shuffledLearned = [...new Set(availableLearned)].sort(() => 0.5 - Math.random());
    while (chosenDistractors.length < 3 && shuffledLearned.length > 0) {
      chosenDistractors.push(shuffledLearned.pop());
    }

    // 3. 若已學池不足，以目前選定範圍內其他剩餘字補齊
    while (chosenDistractors.length < 3 && uniqueSameRange.length > 0) {
      const nextWord = uniqueSameRange.pop();
      if (!chosenDistractors.includes(nextWord)) {
        chosenDistractors.push(nextWord);
      }
    }
  }

  // 4. 合併正確選項並洗牌輸出
  const finalOptions = [correctVal, ...chosenDistractors];
  return finalOptions.sort(() => 0.5 - Math.random()).map(text => ({
    text,
    isCorrect: String(text).toLowerCase() === String(correctVal).toLowerCase(),
    id: Math.random().toString(36).substring(2, 9)
  }));
};
