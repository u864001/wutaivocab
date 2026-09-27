// ── 常用安全詞彙白名單 (避免 class 包含 ass、glass 誤判等問題) ──
const SAFE_WORDS = [
  'class', 'classic', 'classroom', 'pass', 'password', 'grass', 'glass', 'bass', 'compass', 'assistant'
];

// ── 中英文校園常見不雅文字與敏感詞清單 ──
const PROFANITY_WORDS = [
  // 中文髒話、辱罵、三字經、性暗示、不雅諧音
  '幹你', '幹他', '幹她', '幹娘', '幹死', '林娘', '操你', '草泥馬', '三小', '靠北', '靠杯', '靠夭', 
  '機掰', '雞掰', '雞巴', 'ㄐㄅ', 'ㄐ掰', '懶趴', '懶叫', '覽叫', '懶子', '爛趴', '白痴', '白癡', 
  '智障', '腦殘', '低能', '智缺', '婊子', '破麻', '賤人', '賤貨', '雜種', '王八蛋', '王八', '混蛋',
  '去死', '死好', '色情', '做愛', '幹砲', '約砲', '陰莖', '陰道', '睪丸', '自慰', '打手槍',
  '手淫', '射精', '吃屎', '大便', '死八婆', '死肥豬', '屌爆', '屌你',

  // 英文髒話、歧視、性字眼 (含常見諧音與縮寫)
  'fuck', 'fuk', 'fck', 'fking', 'fxxk',
  'shit', 'sh1t',
  'bitch', 'b1tch',
  'asshole',
  'dick', 'd1ck',
  'pussy',
  'slut',
  'cunt',
  'nigger', 'nigga',
  'faggot', 'fag',
  'whore',
  'bastard',
  'dumbass',
  'retard',
  'porn',
  'penis',
  'vagina',
  'boobs',
  'wtf', 'stfu'
];

/**
 * 檢查字串是否包含不雅文字
 * @param {string} text - 待檢查字串 (如暱稱)
 * @returns {boolean} - 若包含不雅字詞則返回 true
 */
export const containsProfanity = (text) => {
  if (!text || typeof text !== 'string') return false;

  let norm = text.toLowerCase();

  // 1. 先剃除安全常見詞 (如 class 避免誤判 ass)
  for (const sw of SAFE_WORDS) {
    norm = norm.split(sw).join(' ');
  }

  // 2. 去除常見標點符號與特殊字元，防範「f.u.c.k」或「幹 ！！」等刻意規避
  norm = norm.replace(/[\s\-_.,!@#$%^&*()+=[\]{}|;:'"<>?/~`，。！？、]/g, '');

  if (!norm) return false;

  // 3. 特殊字眼檢測：單獨的「幹」或「操」
  const cleanTrimmed = text.trim();
  if (cleanTrimmed === '幹' || cleanTrimmed === '操') return true;

  // 4. 關鍵詞匹配
  return PROFANITY_WORDS.some(badWord => {
    return norm.includes(badWord.toLowerCase());
  });
};

/**
 * 取得不雅字警告提示
 */
export const getProfanityError = (text) => {
  if (containsProfanity(text)) {
    return '⚠️ 暱稱包含不合適或不雅字詞，請使用文明、有朝氣的名字登錄榮譽榜喔！';
  }
  return null;
};
