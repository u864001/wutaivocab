import { HERE_WE_GO_TEXTBOOKS } from '../data/hereWeGoTextbookData.js';
import { getSentenceListeningQuestions } from './listeningQuestionBank.js';

function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 取得 1~9 冊書本與單元總覽
 */
export function getBooksSummary() {
  return HERE_WE_GO_TEXTBOOKS.map(b => ({
    book: b.book,
    title: b.title,
    units: b.units.map((u, idx) => ({
      unitId: u.unitId || `b${b.book}_u${idx}`,
      title: u.title,
      dialogueCount: u.dialogues.length,
      vocabCount: u.vocab.length
    }))
  }));
}

/**
 * 取得指定冊次與單元的聽力測驗題庫 (4 選 1 觸控卡片)
 */
export function getUnitListeningQuestions(bookNum = 1, unitId = null, count = 15) {
  const book = HERE_WE_GO_TEXTBOOKS.find(b => b.book === Number(bookNum)) || HERE_WE_GO_TEXTBOOKS[0];
  
  let targetUnit = null;
  if (unitId) {
    targetUnit = book.units.find(u => u.unitId === unitId);
  }
  if (!targetUnit) {
    targetUnit = book.units[1] || book.units[0]; // 預設 Unit 1
  }

  // 收集該單元句型
  let pool = [...(targetUnit.dialogues || [])];

  // 若題數不足，混合本冊其他單元句型擴充
  if (pool.length < count) {
    const otherBookSentences = book.units
      .filter(u => u.unitId !== targetUnit.unitId)
      .flatMap(u => u.dialogues || []);
    pool = [...pool, ...shuffle(otherBookSentences)];
  }

  // 若依然不足，混合全冊句型
  if (pool.length < 5) {
    return getSentenceListeningQuestions(count);
  }

  const selected = shuffle(pool).slice(0, Math.min(count, pool.length));

  // 全域干擾池 (從全部冊次挑選其他句子做為干擾項)
  const allSentences = HERE_WE_GO_TEXTBOOKS.flatMap(b => b.units.flatMap(u => u.dialogues || []));

  return selected.map((item, idx) => {
    const others = allSentences.filter(s => s.en.toLowerCase() !== item.en.toLowerCase());
    // 改為三選一 (1 個正確選項 + 2 個干擾選項，大幅節省畫面空間並呈現精美半透明卡牌)
    const distractors = shuffle(others).slice(0, 2);

    const rawOptions = [
      { textEn: item.en, textZh: item.zh, isCorrect: true },
      ...distractors.map(d => ({ textEn: d.en, textZh: d.zh, isCorrect: false }))
    ];

    const shuffledOptions = shuffle(rawOptions).map((opt, optIdx) => ({
      ...opt,
      key: String.fromCharCode(65 + optIdx)
    }));

    return {
      id: `hwg_${book.book}_${targetUnit.unitId}_${idx}`,
      book: book.book,
      unitTitle: targetUnit.title,
      speaker: item.speaker || 'Teacher',
      audioText: item.en,
      correctEn: item.en,
      correctZh: item.zh,
      promptZh: `${item.speaker && item.speaker !== 'Character' ? item.speaker + '：' : ''}請聆聽發音，選出正確句子`,
      options: shuffledOptions
    };
  });
}

/**
 * 取得指定冊次與單元的口說跟讀 / 對話題目
 */
export function getUnitSpeakingQuestions(bookNum = 1, unitId = null, count = 10) {
  const book = HERE_WE_GO_TEXTBOOKS.find(b => b.book === Number(bookNum)) || HERE_WE_GO_TEXTBOOKS[0];

  let targetUnit = null;
  if (unitId) {
    targetUnit = book.units.find(u => u.unitId === unitId);
  }
  if (!targetUnit) {
    targetUnit = book.units[1] || book.units[0];
  }

  let pool = [...(targetUnit.dialogues || [])];
  if (pool.length < count) {
    const otherBookSentences = book.units
      .filter(u => u.unitId !== targetUnit.unitId)
      .flatMap(u => u.dialogues || []);
    pool = [...pool, ...shuffle(otherBookSentences)];
  }

  const selected = shuffle(pool).slice(0, Math.min(count, pool.length));

  return selected.map((item, idx) => ({
    id: `spk_${book.book}_${targetUnit.unitId}_${idx}`,
    book: book.book,
    unitTitle: targetUnit.title,
    speaker: item.speaker || 'Teacher',
    targetEn: item.en,
    targetZh: item.zh,
    audioText: item.en
  }));
}
