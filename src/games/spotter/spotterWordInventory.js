/**
 * 《鷹眼神探 • 找不同》全冊單字出場頻率與覆蓋率台帳 (Spotter Word Inventory & Coverage Matrix)
 * 目的：追蹤 Here We Go 1~8 冊課綱單字在各場景中的登場次數，杜絕「常用字過度重複、冷門字長期掛零」的教學盲區。
 */

// ── 題型屬性分類 ──
// 'concrete': 具象物品/動物/食物/建築（極適合繪製為場景相異目標）
// 'environment': 環境/天氣/季節/場所（適合繪製為背景地標或大景相異）
// 'abstract': 抽象詞/功能詞/代名詞/片語（適合做為 Word Bank 混淆誘答選項）

export const SPOTTER_CURRICULUM_MATRIX = {
  // ── 第 1 冊 (三年級上學期) ──
  '1': {
    bookTitle: 'Here We Go 第 1 冊',
    words: [
      { en: 'bag', zh: '書包', type: 'concrete' },
      { en: 'pencil', zh: '鉛筆', type: 'concrete' },
      { en: 'eraser', zh: '橡皮擦', type: 'concrete' },
      { en: 'book', zh: '書本', type: 'concrete' },
      { en: 'ruler', zh: '尺', type: 'concrete' },
      { en: 'pen', zh: '原子筆', type: 'concrete' },
      { en: 'pencil case', zh: '鉛筆盒', type: 'concrete' },
      { en: 'marker', zh: '彩色筆', type: 'concrete' },
      // 待登場候選
      { en: 'apple', zh: '蘋果', type: 'concrete' },
      { en: 'banana', zh: '香蕉', type: 'concrete' },
      { en: 'grape', zh: '葡萄', type: 'concrete' },
      { en: 'cat', zh: '貓', type: 'concrete' },
      { en: 'dog', zh: '狗', type: 'concrete' },
      { en: 'elephant', zh: '大象', type: 'concrete' },
      { en: 'fish', zh: '魚', type: 'concrete' },
      { en: 'hat', zh: '帽子', type: 'concrete' },
      { en: 'bat', zh: '蝙蝠', type: 'concrete' },
      { en: 'ghost', zh: '鬼', type: 'concrete' },
      { en: 'pumpkin', zh: '南瓜', type: 'concrete' },
      { en: 'spider', zh: '蜘蛛', type: 'concrete' },
      { en: 'witch', zh: '女巫', type: 'concrete' },
      { en: 'vampire', zh: '吸血鬼', type: 'concrete' },
      { en: 'blue', zh: '藍色', type: 'abstract' },
      { en: 'green', zh: '綠色', type: 'abstract' },
      { en: 'red', zh: '紅色', type: 'abstract' },
      { en: 'yellow', zh: '黃色', type: 'abstract' },
      { en: 'black', zh: '黑色', type: 'abstract' },
      { en: 'white', zh: '白色', type: 'abstract' },
      { en: 'one', zh: '一', type: 'abstract' },
      { en: 'two', zh: '二', type: 'abstract' },
      { en: 'three', zh: '三', type: 'abstract' },
      { en: 'four', zh: '四', type: 'abstract' },
      { en: 'five', zh: '五', type: 'abstract' },
      { en: 'six', zh: '六', type: 'abstract' },
      { en: 'seven', zh: '七', type: 'abstract' },
      { en: 'eight', zh: '八', type: 'abstract' },
      { en: 'nine', zh: '九', type: 'abstract' },
      { en: 'ten', zh: '十', type: 'abstract' }
    ]
  },

  // ── 第 2 冊 (三年級下學期) ──
  '2': {
    bookTitle: 'Here We Go 第 2 冊',
    words: [
      { en: 'balloon', zh: '氣球', type: 'concrete' },
      { en: 'card', zh: '卡片', type: 'concrete' },
      { en: 'cake', zh: '蛋糕', type: 'concrete' },
      { en: 'candle', zh: '蠟燭', type: 'concrete' },
      { en: 'flower', zh: '花朵', type: 'concrete' },
      { en: 'gift', zh: '禮物', type: 'concrete' },
      { en: 'candy', zh: '糖果', type: 'concrete' },
      { en: 'party', zh: '派對帽', type: 'concrete' },
      // 待登場候選
      { en: 'bird', zh: '鳥', type: 'concrete' },
      { en: 'cat', zh: '貓', type: 'concrete' },
      { en: 'dog', zh: '狗', type: 'concrete' },
      { en: 'fish', zh: '魚', type: 'concrete' },
      { en: 'doctor', zh: '醫生', type: 'concrete' },
      { en: 'nurse', zh: '護理師', type: 'concrete' },
      { en: 'cook', zh: '廚師', type: 'concrete' },
      { en: 'driver', zh: '司機', type: 'concrete' },
      { en: 'student', zh: '學生', type: 'concrete' },
      { en: 'teacher', zh: '教師', type: 'concrete' },
      { en: 'grandfather', zh: '爺爺', type: 'concrete' },
      { en: 'grandmother', zh: '奶奶', type: 'concrete' },
      { en: 'father', zh: '爸爸', type: 'concrete' },
      { en: 'mother', zh: '媽媽', type: 'concrete' },
      { en: 'brother', zh: '兄弟', type: 'concrete' },
      { en: 'sister', zh: '姊妹', type: 'concrete' },
      { en: 'heart', zh: '愛心', type: 'concrete' },
      { en: 'dance', zh: '跳舞', type: 'abstract' },
      { en: 'draw', zh: '畫畫', type: 'abstract' },
      { en: 'jump', zh: '跳', type: 'abstract' },
      { en: 'sing', zh: '唱歌', type: 'abstract' },
      { en: 'swim', zh: '游泳', type: 'abstract' },
      { en: 'write', zh: '寫字', type: 'abstract' },
      { en: 'tall', zh: '高的', type: 'abstract' },
      { en: 'short', zh: '矮的', type: 'abstract' }
    ]
  },

  // ── 第 3 冊 (四年級上學期) ──
  '3': {
    bookTitle: 'Here We Go 第 3 冊',
    words: [
      { en: 'umbrella', zh: '遮陽傘', type: 'concrete' },
      { en: 'kite', zh: '風箏', type: 'concrete' },
      { en: 'hamburger', zh: '漢堡', type: 'concrete' },
      { en: 'hot dog', zh: '熱狗', type: 'concrete' },
      { en: 'sun', zh: '太陽', type: 'environment' },
      { en: 'pizza', zh: '披薩', type: 'concrete' },
      { en: 'ice cream', zh: '冰淇淋', type: 'concrete' },
      { en: 'juice', zh: '果汁', type: 'concrete' },
      // 待登場候選
      { en: 'sandwich', zh: '三明治', type: 'concrete' },
      { en: 'orange', zh: '柳橙', type: 'concrete' },
      { en: 'watermelon', zh: '西瓜', type: 'concrete' },
      { en: 'moon cake', zh: '月餅', type: 'concrete' },
      { en: 'pomelo', zh: '柚子', type: 'concrete' },
      { en: 'milk', zh: '牛奶', type: 'concrete' },
      { en: 'water', zh: '水', type: 'concrete' },
      { en: 'tea', zh: '茶', type: 'concrete' },
      { en: 'rice', zh: '米飯', type: 'concrete' },
      { en: 'sunny', zh: '晴朗的', type: 'environment' },
      { en: 'rainy', zh: '下雨的', type: 'environment' },
      { en: 'cloudy', zh: '多雲的', type: 'environment' },
      { en: 'windy', zh: '颳風的', type: 'environment' },
      { en: 'hot', zh: '炎熱的', type: 'environment' },
      { en: 'cold', zh: '寒冷的', type: 'environment' },
      { en: 'warm', zh: '溫暖的', type: 'environment' },
      { en: 'cool', zh: '涼爽的', type: 'environment' }
    ]
  },

  // ── 第 4 冊 (四年級下學期) ──
  '4': {
    bookTitle: 'Here We Go 第 4 冊',
    words: [
      { en: 'bed', zh: '床鋪', type: 'concrete' },
      { en: 'hat', zh: '帽子', type: 'concrete' },
      { en: 'computer', zh: '電腦', type: 'concrete' },
      { en: 'bag', zh: '背包', type: 'concrete' },
      { en: 'book', zh: '書本', type: 'concrete' },
      { en: 'bus', zh: '公車', type: 'concrete' },
      { en: 'sofa', zh: '沙發', type: 'concrete' },
      { en: 'clock', zh: '時鐘', type: 'concrete' },
      // 待登場候選
      { en: 'desk', zh: '書桌', type: 'concrete' },
      { en: 'table', zh: '桌子', type: 'concrete' },
      { en: 'chair', zh: '椅子', type: 'concrete' },
      { en: 'lamp', zh: '檯燈', type: 'concrete' },
      { en: 'box', zh: '箱子', type: 'concrete' },
      { en: 'basket', zh: '籃子', type: 'concrete' },
      { en: 'bunny', zh: '兔子', type: 'concrete' },
      { en: 'bedroom', zh: '臥室', type: 'environment' },
      { en: 'living room', zh: '客廳', type: 'environment' },
      { en: 'kitchen', zh: '廚房', type: 'environment' },
      { en: 'dining room', zh: '飯廳', type: 'environment' },
      { en: 'bathroom', zh: '浴室', type: 'environment' },
      { en: 'yard', zh: '庭院', type: 'environment' }
    ]
  },

  // ── 第 5 冊 (五年級上學期) ──
  '5': {
    bookTitle: 'Here We Go 第 5 冊',
    words: [
      { en: 'lion', zh: '石獅雕像', type: 'concrete' },
      { en: 'koala', zh: '無尾熊', type: 'concrete' },
      { en: 'bread', zh: '麵包', type: 'concrete' },
      { en: 'milk', zh: '牛奶', type: 'concrete' },
      { en: 'football', zh: '足球', type: 'concrete' },
      { en: 'painting', zh: '畫作', type: 'concrete' },
      { en: 'brush', zh: '畫筆', type: 'concrete' },
      { en: 'camera', zh: '相機', type: 'concrete' },
      // 待登場候選
      { en: 'supermarket', zh: '超級市場', type: 'environment' },
      { en: 'library', zh: '圖書館', type: 'environment' },
      { en: 'hospital', zh: '醫院', type: 'environment' },
      { en: 'bank', zh: '銀行', type: 'environment' },
      { en: 'post office', zh: '郵局', type: 'environment' },
      { en: 'bookstore', zh: '書店', type: 'environment' },
      { en: 'park', zh: '公園', type: 'environment' },
      { en: 'horse', zh: '馬', type: 'concrete' },
      { en: 'tiger', zh: '老虎', type: 'concrete' },
      { en: 'zebra', zh: '斑馬', type: 'concrete' },
      { en: 'Christmas tree', zh: '聖誕樹', type: 'concrete' },
      { en: 'bell', zh: '鈴鐺', type: 'concrete' },
      { en: 'stocking', zh: '聖誕襪', type: 'concrete' }
    ]
  },

  // ── 第 6 冊 (五年級下學期) ──
  '6': {
    bookTitle: 'Here We Go 第 6 冊',
    words: [
      { en: 'mask', zh: '口罩', type: 'concrete' },
      { en: 'elephant', zh: '大象', type: 'concrete' },
      { en: 'rocket', zh: '火箭', type: 'concrete' },
      { en: 'noodles', zh: '麵食', type: 'concrete' },
      { en: 'sunglasses', zh: '墨鏡', type: 'concrete' },
      { en: 'salad', zh: '沙拉', type: 'concrete' },
      { en: 'dinosaur', zh: '恐龍', type: 'concrete' },
      { en: 'backpack', zh: '背包', type: 'concrete' },
      // 待登場候選
      { en: 'chicken', zh: '雞肉', type: 'concrete' },
      { en: 'soup', zh: '熱湯', type: 'concrete' },
      { en: 'lunchbox', zh: '便當盒', type: 'concrete' },
      { en: 'waterbottle', zh: '水壺', type: 'concrete' },
      { en: 'cap', zh: '棒球帽', type: 'concrete' },
      { en: 'glasses', zh: '眼鏡', type: 'concrete' },
      { en: 'shoes', zh: '鞋子', type: 'concrete' },
      { en: 'umbrella', zh: '雨傘', type: 'concrete' },
      { en: 'sachet', zh: '香包', type: 'concrete' },
      { en: 'zongzi', zh: '粽子', type: 'concrete' }
    ]
  },

  // ── 第 7 冊 (六年級上學期) ──
  '7': {
    bookTitle: 'Here We Go 第 7 冊',
    words: [
      { en: 'airplane', zh: '飛機', type: 'concrete' },
      { en: 'flag', zh: '國旗', type: 'concrete' },
      { en: 'train', zh: '火車', type: 'concrete' },
      { en: 'ship', zh: '輪船', type: 'concrete' },
      { en: 'postcard', zh: '明信片', type: 'concrete' },
      { en: 'map', zh: '地圖', type: 'concrete' },
      { en: 'suitcase', zh: '行李箱', type: 'concrete' },
      { en: 'gift', zh: '禮物', type: 'concrete' },
      // 待登場候選
      { en: 'bike', zh: '腳踏車', type: 'concrete' },
      { en: 'bus', zh: '公車', type: 'concrete' },
      { en: 'car', zh: '汽車', type: 'concrete' },
      { en: 'metro', zh: '捷運', type: 'concrete' },
      { en: 'scooter', zh: '機車', type: 'concrete' },
      { en: 'taxi', zh: '計程車', type: 'concrete' },
      { en: 'Taiwan', zh: '台灣', type: 'environment' },
      { en: 'the UK', zh: '英國', type: 'environment' },
      { en: 'the USA', zh: '美國', type: 'environment' },
      { en: 'Japan', zh: '日本', type: 'environment' },
      { en: 'Australia', zh: '澳洲', type: 'environment' }
    ]
  },

  // ── 第 8 冊 (六年級下學期) ──
  '8': {
    bookTitle: 'Here We Go 第 8 冊',
    words: [
      { en: 'swan', zh: '天鵝', type: 'concrete' },
      { en: 'spade', zh: '鏟子', type: 'concrete' },
      { en: 'drum', zh: '鼓', type: 'concrete' },
      { en: 'pie', zh: '派', type: 'concrete' },
      { en: 'rose', zh: '玫瑰', type: 'concrete' },
      { en: 'coat', zh: '大衣', type: 'concrete' },
      { en: 'flute', zh: '長笛', type: 'concrete' },
      { en: 'dress', zh: '洋裝', type: 'concrete' },
      // 待登場候選
      { en: 'jacket', zh: '夾克', type: 'concrete' },
      { en: 'skirt', zh: '裙子', type: 'concrete' },
      { en: 'T-shirt', zh: 'T恤', type: 'concrete' },
      { en: 'jeans', zh: '牛仔褲', type: 'concrete' },
      { en: 'pants', zh: '長褲', type: 'concrete' },
      { en: 'shorts', zh: '短褲', type: 'concrete' },
      { en: 'hat', zh: '帽子', type: 'concrete' },
      { en: 'spring', zh: '春天', type: 'environment' },
      { en: 'summer', zh: '夏天', type: 'environment' },
      { en: 'fall', zh: '秋天', type: 'environment' },
      { en: 'winter', zh: '冬天', type: 'environment' },
      { en: 'restaurant', zh: '餐廳', type: 'environment' },
      { en: 'mall', zh: '購物中心', type: 'environment' }
    ]
  }
};

/**
 * 計算指定冊次之單字登場頻率與覆蓋清單
 * @param {string} bookNum 冊次 '1'~'8'
 * @param {Array} currentScenes 該冊已載入的場景陣列
 */
export function getBookCoverageReport(bookNum, currentScenes = []) {
  const matrix = SPOTTER_CURRICULUM_MATRIX[String(bookNum)];
  if (!matrix) return null;

  const appearanceCount = {};
  matrix.words.forEach(w => {
    appearanceCount[w.en.toLowerCase()] = 0;
  });

  currentScenes.forEach(scene => {
    (scene.targetItems || []).forEach(item => {
      const key = (item.word || '').toLowerCase().trim();
      if (appearanceCount[key] !== undefined) {
        appearanceCount[key]++;
      }
    });
  });

  const appeared = [];
  const pendingConcrete = [];
  const pendingAbstract = [];

  matrix.words.forEach(w => {
    const count = appearanceCount[w.en.toLowerCase()] || 0;
    if (count > 0) {
      appeared.push({ ...w, count });
    } else {
      if (w.type === 'concrete' || w.type === 'environment') {
        pendingConcrete.push(w);
      } else {
        pendingAbstract.push(w);
      }
    }
  });

  const coveragePercent = Math.round((appeared.length / matrix.words.length) * 100);

  return {
    bookNum: String(bookNum),
    bookTitle: matrix.bookTitle,
    totalWords: matrix.words.length,
    appearedCount: appeared.length,
    coveragePercent,
    appeared,
    pendingConcrete,
    pendingAbstract
  };
}
