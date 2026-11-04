/**
 * Test My English Pre-A1 官方模擬題庫
 * 涵蓋五大面向：字彙 (vocab)、聽力 (listening)、閱讀 (reading)、口說 (speaking)、寫作 (writing)
 * 各面向子題型皆走獨立流水編號，支援教師後台檢核與學生端測驗
 */

export const TME_PRE_A1_BANK = [
  // ── 1. 字彙 (vocab) ──
  {
    id: 'tme-vocab-w2p-01',
    track: 'tme-preA1',
    category: 'vocab',
    subType: 'vocab-word2pic',
    serialNum: 1,
    taskType: 'V-PIC',
    difficulty: 1,
    question: '看單字選出正確的圖片：apple',
    options: ['圖片 ① (蘋果 🍎)', '圖片 ② (香蕉 🍌)', '圖片 ③ (柳橙 🍊)', '圖片 ④ (葡萄 🍇)'],
    answer: 0,
    explanation: '英文「apple」意為蘋果，對應圖片 ①。',
    reviewed: true
  },
  {
    id: 'tme-vocab-w2p-02',
    track: 'tme-preA1',
    category: 'vocab',
    subType: 'vocab-word2pic',
    serialNum: 2,
    taskType: 'V-PIC',
    difficulty: 1,
    question: '看單字選出正確的圖片：pencil',
    options: ['圖片 ① (尺 📏)', '圖片 ② (鉛筆 ✏️)', '圖片 ③ (書本 📖)', '圖片 ④ (剪刀 ✂️)'],
    answer: 1,
    explanation: '英文「pencil」意為鉛筆，對應圖片 ②。',
    reviewed: true
  },
  {
    id: 'tme-vocab-p2w-01',
    track: 'tme-preA1',
    category: 'vocab',
    subType: 'vocab-pic2word',
    serialNum: 1,
    taskType: 'V-MEAN',
    difficulty: 1,
    question: '看圖片選出正確的英文單字：🐱 (一隻小貓咪)',
    options: ['dog', 'cat', 'pig', 'bird'],
    answer: 1,
    explanation: '圖片中為貓咪，英文為「cat」。',
    reviewed: true
  },
  {
    id: 'tme-vocab-a2p-01',
    track: 'tme-preA1',
    category: 'vocab',
    subType: 'vocab-audio2pic',
    serialNum: 1,
    taskType: 'L-PIC',
    difficulty: 1,
    media: { audioText: 'umbrella' },
    question: '請聽語音，選出相符的物品圖片：',
    options: ['圖片 ① (雨傘 ☂️)', '圖片 ② (帽子 🧢)', '圖片 ③ (鞋子 👟)', '圖片 ④ (外套 🧥)'],
    answer: 0,
    explanation: '聽力發音為「umbrella（雨傘）」，故選圖片 ①。',
    reviewed: true
  },
  {
    id: 'tme-vocab-a2w-01',
    track: 'tme-preA1',
    category: 'vocab',
    subType: 'vocab-audio2word',
    serialNum: 1,
    taskType: 'L-WORD',
    difficulty: 1,
    media: { audioText: 'yellow' },
    question: '請聽語音，選出拼寫正確的單字：',
    options: ['yellow', 'yallow', 'yollow', 'yellw'],
    answer: 0,
    explanation: '聽力發音為顏色「yellow（黃色）」，正確拼字為 y-e-l-l-o-w。',
    reviewed: true
  },

  // ── 2. 聽力 (listening) ──
  {
    id: 'tme-listen-p2s-01',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-pic2sent',
    serialNum: 1,
    taskType: 'L-SENT',
    difficulty: 1,
    media: { audioText: 'The boy is riding a bicycle in the park.' },
    question: '看圖片並聽語音，選出描述正確的句子：',
    options: [
      'The boy is riding a bicycle.',
      'The boy is swimming.',
      'The boy is sleeping.',
      'The boy is reading a book.'
    ],
    answer: 0,
    explanation: '聽力內容「The boy is riding a bicycle.（男孩正在騎腳踏車）」，故選 ①。',
    reviewed: true
  },
  {
    id: 'tme-listen-d2p-01',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-dlg2pic',
    serialNum: 1,
    taskType: 'L-CONV',
    difficulty: 2,
    media: { audioText: 'Girl: Where are you going, Peter? Boy: I am going to the library to read books.' },
    question: '聽對話，選出 Peter 前往地點相符的圖片：',
    options: ['圖片 ① (圖書館 📚)', '圖片 ② (動物園 🦁)', '圖片 ③ (操場 🏃)', '圖片 ④ (餐廳 🍔)'],
    answer: 0,
    explanation: '對話中 Peter 說「I am going to the library」，故前往地點為圖書館。',
    reviewed: true
  },
  {
    id: 'tme-listen-resp-01',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-resp',
    serialNum: 1,
    taskType: 'L-QA',
    difficulty: 1,
    media: { audioText: 'How are you doing today?' },
    question: '請聽日常問句，選出最適當的回應句子：',
    options: [
      "I'm fine, thank you.",
      "I'm ten years old.",
      'I like apples.',
      'It is a pen.'
    ],
    answer: 0,
    explanation: '問句「How are you doing today?（你今天好嗎？）」，標準應答為「I’m fine, thank you.」。',
    reviewed: true
  },
  {
    id: 'tme-listen-qa-01',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-conv-qa',
    serialNum: 1,
    taskType: 'L-CONV',
    difficulty: 2,
    media: { audioText: 'Mom: Do you want some milk, Tom? Tom: No, thank you, Mom. I want some water. Question: What does Tom want?' },
    question: '聽對話，回答問題：What does Tom want?',
    options: ['Water', 'Milk', 'Juice', 'Tea'],
    answer: 0,
    explanation: 'Tom 回答「I want some water」，故 Tom 想要水。',
    reviewed: true
  },

  // ── 3. 閱讀 (reading) ──
  {
    id: 'tme-read-p2w-01',
    track: 'tme-preA1',
    category: 'reading',
    subType: 'read-pic2word',
    serialNum: 1,
    taskType: 'V-PIC',
    difficulty: 1,
    question: '看生活告示牌內容，選出代表的指示單字：🚪 [EXIT]',
    options: ['Exit (出口)', 'Enter (入口)', 'Stop (停止)', 'Open (營業中)'],
    answer: 0,
    explanation: '告示牌上寫著「EXIT」，代表緊急出口，故選 ①。',
    reviewed: true
  },
  {
    id: 'tme-read-tf-01',
    track: 'tme-preA1',
    category: 'reading',
    subType: 'read-truefalse',
    serialNum: 1,
    taskType: 'R-TF',
    difficulty: 1,
    question: '閱讀句子：There are three bananas on the table.（桌上有三根香蕉）\n圖片：桌上有三根黃色香蕉 🍌🍌🍌\n請問敘述是否相符？',
    options: ['True (相符)', 'False (不符)'],
    answer: 0,
    explanation: '圖片中桌上確實有三根香蕉，句子描述相符，故選 True。',
    reviewed: true
  },
  {
    id: 'tme-read-p2s-01',
    track: 'tme-preA1',
    category: 'reading',
    subType: 'read-pic2sent',
    serialNum: 1,
    taskType: 'G-CTX',
    difficulty: 1,
    question: '看情境圖片（小女孩正在下雨天撐著黃色雨傘），選出最相符的句子：',
    options: [
      'It is rainy. The girl has an umbrella.',
      'It is sunny. The girl is swimming.',
      'It is windy. The boy is flying a kite.',
      'It is snowy. The children are making a snowman.'
    ],
    answer: 0,
    explanation: '情境為雨天且小女孩撐傘，句子 ① 完全吻合。',
    reviewed: true
  },
  {
    id: 'tme-read-cloze-01',
    track: 'tme-preA1',
    category: 'reading',
    subType: 'read-cloze',
    serialNum: 1,
    taskType: 'R-CLOZE',
    difficulty: 2,
    passage: {
      title: '【短文填空】My Pet Dog',
      text: 'I have a cute pet dog. His name is Lucky. Lucky is brown and white. He loves to _______ with a small red ball.'
    },
    question: '依短文文意，空格處應填入哪一個單字？',
    options: ['play', 'eat', 'sleep', 'read'],
    answer: 0,
    explanation: '狗狗喜歡「玩」紅色的球，片語為 play with a ball，故選 ① play。',
    reviewed: true
  },

  // ── 4. 口說 (speaking) ──
  {
    id: 'tme-speak-w-01',
    track: 'tme-preA1',
    category: 'speaking',
    subType: 'speak-word',
    serialNum: 1,
    taskType: 'S-WORD',
    difficulty: 1,
    media: { audioText: 'Good morning' },
    targetText: 'Good morning',
    question: '【單字片語朗讀】請看螢幕文字並清晰朗讀：Good morning',
    options: ['朗讀標的：Good morning (早安)'],
    answer: 0,
    explanation: '測驗打招呼常見片語發音清晰度與語調。',
    reviewed: true
  },
  {
    id: 'tme-speak-s-01',
    track: 'tme-preA1',
    category: 'speaking',
    subType: 'speak-short',
    serialNum: 1,
    taskType: 'S-SENT',
    difficulty: 1,
    media: { audioText: 'What is your name?' },
    targetText: 'What is your name?',
    question: '【短句朗讀】請看日常問句並自然朗讀：What is your name?',
    options: ['朗讀標的：What is your name? (你叫什麼名字？)'],
    answer: 0,
    explanation: '測驗疑問句語調（Wh-問句句尾降調）。',
    reviewed: true
  },
  {
    id: 'tme-speak-l-01',
    track: 'tme-preA1',
    category: 'speaking',
    subType: 'speak-long',
    serialNum: 1,
    taskType: 'S-SENT',
    difficulty: 2,
    media: { audioText: 'I like to play basketball with my friends on Sunday.' },
    targetText: 'I like to play basketball with my friends on Sunday.',
    question: '【長句朗讀】請注意斷句與連音，完整朗讀：I like to play basketball with my friends on Sunday.',
    options: ['朗讀標的：I like to play basketball with my friends on Sunday.'],
    answer: 0,
    explanation: '測驗連貫朗讀、動詞片語與時間副詞連音。',
    reviewed: true
  },

  // ── 5. 寫作 (writing) ──
  {
    id: 'tme-write-sr-01',
    track: 'tme-preA1',
    category: 'writing',
    subType: 'write-scramble-resp',
    serialNum: 1,
    taskType: 'W-SCRAMBLE',
    difficulty: 1,
    question: '【重組答句】看問句「Where is the book?」，將單字依序重組成正確答句：',
    scrambledWords: ['is', 'on', 'It', 'the', 'desk'],
    targetSentence: 'It is on the desk.',
    options: [
      'It is on the desk.',
      'On the desk it is.',
      'The desk is on it.',
      'It desk is on the.'
    ],
    answer: 0,
    explanation: '正確答句主詞為 It，後接 be 動詞 is 與介系詞片語 on the desk。',
    reviewed: true
  },
  {
    id: 'tme-write-sq-01',
    track: 'tme-preA1',
    category: 'writing',
    subType: 'write-scramble-q',
    serialNum: 1,
    taskType: 'W-SCRAMBLE',
    difficulty: 2,
    question: '【重組問句】看答句「I am ten years old.」，將單字依序重組成適當的疑問句：',
    scrambledWords: ['are', 'old', 'How', 'you'],
    targetSentence: 'How old are you?',
    options: [
      'How old are you?',
      'How are you old?',
      'Are you how old?',
      'Old how are you?'
    ],
    answer: 0,
    explanation: '詢問年齡標準句型為「How old + are you?」，字首 H 大寫，句尾加問號。',
    reviewed: true
  }
];
