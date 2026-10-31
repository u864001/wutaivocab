/**
/**
 * 神山雙語正向英語格言庫 (Forest Wisdom Quotes)
 * 精選 30+ 則富含探險勇氣、堅持努力、自然智慧、接納錯誤之小學生正向格言
 */

export const FOREST_QUOTES = [
  {
    en: "Every step forward is a step toward greatness.",
    zh: "每向前邁出一步，都是邁向偉大的一步。"
  },
  {
    en: "A journey of a thousand miles begins with a single step.",
    zh: "千里之行，始於足下。"
  },
  {
    en: "Nature does not hurry, yet everything is accomplished.",
    zh: "大自然從不著急，卻成就了一切。"
  },
  {
    en: "Believe in yourself and magic will happen.",
    zh: "相信自己，奇蹟就會自然發生。"
  },
  {
    en: "Mistakes are proof that you are trying.",
    zh: "每一次犯錯，都是你在努力嘗試的最好證明。"
  },
  {
    en: "The brave hunter never stops exploring.",
    zh: "勇敢的獵人，從不停止探索的腳步。"
  },
  {
    en: "Small daily efforts lead to big success.",
    zh: "每天持續累積微小的努力，終將成就巨大的成功。"
  },
  {
    en: "Practice makes perfect.",
    zh: "熟能生巧，持之以恆就是力量。"
  },
  {
    en: "Wisdom begins with wonder.",
    zh: "智慧始於對世界的好奇與探索。"
  },
  {
    en: "Your only limit is your imagination.",
    zh: "你唯一的極限，就是你的想像力。"
  },
  {
    en: "Fall down seven times, stand up eight.",
    zh: "跌倒七次，第八次依然勇敢站起來。"
  },
  {
    en: "Stars cannot shine without darkness.",
    zh: "黑夜越深沉，繁星越加璀璨。"
  },
  {
    en: "You are braver than you believe, stronger than you seem.",
    zh: "你比自己相信的更勇敢，比自己看到的更堅強。"
  },
  {
    en: "Be like a mountain: calm, strong, and enduring.",
    zh: "像高山一樣：沉靜、堅定、屹立不搖。"
  },
  {
    en: "Learning is a treasure that travels with you everywhere.",
    zh: "知識是隨身相伴、永不褪色的珍寶。"
  },
  {
    en: "Even the tallest cedar tree was once a tiny seed.",
    zh: "即使是參天巨木，也曾是一顆小小的種子。"
  },
  {
    en: "Listen to the forest, it teaches without words.",
    zh: "傾聽山林的呢喃，它在無聲中教會我們智慧。"
  },
  {
    en: "Curiosity is the key to all adventures.",
    zh: "好奇心是通往所有奇妙冒險的金鑰匙。"
  },
  {
    en: "Dream big, work hard, stay humble.",
    zh: "心懷大志，腳踏實地，保持謙遜溫和。"
  },
  {
    en: "Every master was once a beginner.",
    zh: "每一位大師，都曾是從零開始的初學者。"
  },
  {
    en: "Keep your eyes on the stars and your feet on the ground.",
    zh: "眼望星空，腳踏實地。"
  },
  {
    en: "Happiness is found in small discoveries.",
    zh: "幸福就藏在日常生活的小小新發現裡。"
  },
  {
    en: "A brave heart conquers every mountain peak.",
    zh: "一顆勇敢的心，能征服每一座山峰。"
  },
  {
    en: "Patience and perseverance conquer all things.",
    zh: "耐心與毅力，能克服世界上所有的挑戰。"
  },
  {
    en: "Courage is taking that first step even when afraid.",
    zh: "真正的勇氣，是即使感到害怕依然邁出第一步。"
  },
  {
    en: "The greatest victory is defeating yesterday's self.",
    zh: "最棒的勝利，是超越昨天的自己。"
  },
  {
    en: "In every walk with nature, one receives far more than seeks.",
    zh: "每一次步入大自然，收穫總遠多於尋求。"
  },
  {
    en: "You can do hard things.",
    zh: "你有能力克服最困難的事！"
  },
  {
    en: "Bright smiles light up the deepest valleys.",
    zh: "燦爛的微笑，能照亮最幽深的山谷。"
  },
  {
    en: "Great things take time to grow.",
    zh: "所有美好的事物，都需要時間慢慢醞釀。"
  }
];

/**
 * 隨機抽取一則格言
 */
export const getRandomQuote = () => {
  const index = Math.floor(Math.random() * FOREST_QUOTES.length);
  return FOREST_QUOTES[index];
};
