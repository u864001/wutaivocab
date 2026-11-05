/**
 * Test My English Pre-A1 官方模擬題庫
 * 涵蓋五大面向：字彙 (vocab)、聽力 (listening)、閱讀 (reading)、口說 (speaking)、寫作 (writing)
 * 各面向子題型皆走獨立流水編號，支援教師後台檢核與學生端測驗
 */

export const TME_PRE_A1_BANK = [
  // ══════════════════════════════════════════════════════════════════════════
  // ── 1. 字彙 (vocab) ── 原型示範題
  // ══════════════════════════════════════════════════════════════════════════
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

  // ══════════════════════════════════════════════════════════════════════════
  // ── 2. 聽力 (listening) ──
  // ══════════════════════════════════════════════════════════════════════════
  // (1) 看圖選句 (示範題)
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
  // (2) 聽對話選圖 (示範題)
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
  // (3) 選正確回應 (Listen & Respond) ── 第一階段 6 題
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
    id: 'tme-listen-resp-02',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-resp',
    serialNum: 2,
    taskType: 'L-QA',
    difficulty: 1,
    media: { audioText: 'What time is it now?' },
    question: '請聽日常問句，選出最適當的回應句子：',
    options: [
      "It is three thirty.",
      "It is on the table.",
      "I have three books.",
      "It is sunny today."
    ],
    answer: 0,
    explanation: '問句「What time is it now?（現在幾點？）」，詢問時間應回答「It is three thirty.（現在三點半）」。',
    reviewed: true
  },
  {
    id: 'tme-listen-resp-03',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-resp',
    serialNum: 3,
    taskType: 'L-QA',
    difficulty: 1,
    media: { audioText: 'Nice to meet you, Linda.' },
    question: '請聽禮貌問候，選出最適當的回應句子：',
    options: [
      "Nice to meet you, too.",
      "Good night, Mom.",
      "You are welcome.",
      "I am very sorry."
    ],
    answer: 0,
    explanation: '初次見面問候「Nice to meet you.（很高興認識你）」，標準回應為「Nice to meet you, too.」。',
    reviewed: true
  },
  {
    id: 'tme-listen-resp-04',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-resp',
    serialNum: 4,
    taskType: 'L-QA',
    difficulty: 2,
    media: { audioText: 'Where is the post office, please?' },
    question: '請聽問路問句，選出最適當的回應句子：',
    options: [
      "It is next to the bookstore.",
      "I don't have letters.",
      "It is fifty dollars.",
      "I am eating lunch."
    ],
    answer: 0,
    explanation: '問句詢問郵局地點（Where is the post office?），應回答具體方位「It is next to the bookstore.（在書店隔壁）」。',
    reviewed: true
  },
  {
    id: 'tme-listen-resp-05',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-resp',
    serialNum: 5,
    taskType: 'L-QA',
    difficulty: 1,
    media: { audioText: 'Do you want some orange juice?' },
    question: '請聽日常問句，選出最適當的回應句子：',
    options: [
      "Yes, please. I am thirsty.",
      "No, it's not an orange.",
      "I can jump very high.",
      "She is my sister."
    ],
    answer: 0,
    explanation: '對方禮貌詢問「Do you want some orange juice?（要喝點柳橙汁嗎？）」，接受時回答「Yes, please. I am thirsty.（好的請給我，我很渴）」。',
    reviewed: true
  },
  {
    id: 'tme-listen-resp-06',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-resp',
    serialNum: 6,
    taskType: 'L-QA',
    difficulty: 2,
    media: { audioText: 'Whose jacket is this on the chair?' },
    question: '請聽日常問句，選出最適當的回應句子：',
    options: [
      "It is Tony's jacket.",
      "I like blue jackets.",
      "It is eighty dollars.",
      "She is reading a book."
    ],
    answer: 0,
    explanation: '問句使用 Whose（誰的）詢問夾克所有權，回答應為所有格「It is Tony\'s jacket.（那是東尼的外套）」。',
    reviewed: true
  },
  // (4) 聽對話答選擇題 (Dialogue Q&A) ── 第一階段 6 題
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
  {
    id: 'tme-listen-qa-02',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-conv-qa',
    serialNum: 2,
    taskType: 'L-CONV',
    difficulty: 2,
    media: { audioText: 'Boy: Where are you going, Kelly? Girl: I am going to the zoo to see the pandas. Question: Where is Kelly going?' },
    question: '聽對話，回答問題：Where is Kelly going?',
    options: ['The zoo', 'The park', 'The school', 'The museum'],
    answer: 0,
    explanation: '對話中 Kelly 清楚表示「I am going to the zoo to see the pandas」，故前往動物園。',
    reviewed: true
  },
  {
    id: 'tme-listen-qa-03',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-conv-qa',
    serialNum: 3,
    taskType: 'L-CONV',
    difficulty: 2,
    media: { audioText: 'Girl: How much is that red pencil box? Clerk: It is sixty dollars. Question: How much is the pencil box?' },
    question: '聽對話，回答問題：How much is the pencil box?',
    options: [
      'Sixty dollars ($60)',
      'Sixteen dollars ($16)',
      'Six dollars ($6)',
      'Six hundred dollars ($600)'
    ],
    answer: 0,
    explanation: '店員回答「It is sixty dollars.（60元）」，選項 ① 正確。',
    reviewed: true
  },
  {
    id: 'tme-listen-qa-04',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-conv-qa',
    serialNum: 4,
    taskType: 'L-CONV',
    difficulty: 2,
    media: { audioText: 'Dad: How do you go to school today, Andy? Andy: I ride my bicycle with Peter. Question: How does Andy go to school?' },
    question: '聽對話，回答問題：How does Andy go to school?',
    options: ['By bicycle', 'By bus', 'On foot', 'By car'],
    answer: 0,
    explanation: 'Andy 回答「I ride my bicycle with Peter」，交通方式為騎腳踏車（By bicycle）。',
    reviewed: true
  },
  {
    id: 'tme-listen-qa-05',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-conv-qa',
    serialNum: 5,
    taskType: 'L-CONV',
    difficulty: 1,
    media: { audioText: 'Teacher: What day is today, class? Students: Today is Wednesday! Question: What day is today?' },
    question: '聽對話，回答問題：What day is today?',
    options: ['Wednesday', 'Monday', 'Friday', 'Sunday'],
    answer: 0,
    explanation: '全班回答「Today is Wednesday!（今天星期三）」，故選 ①。',
    reviewed: true
  },
  {
    id: 'tme-listen-qa-06',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-conv-qa',
    serialNum: 6,
    taskType: 'L-CONV',
    difficulty: 2,
    media: { audioText: 'Girl: Is your father a doctor, Ben? Boy: No, he is a bus driver. Question: What is Ben\'s father?' },
    question: '聽對話，回答問題：What is Ben\'s father?',
    options: ['A bus driver', 'A doctor', 'A teacher', 'A cook'],
    answer: 0,
    explanation: 'Ben 明確說明「No, he is a bus driver.（不，他是一位公車司機）」，故選 ①。',
    reviewed: true
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ── 3. 閱讀 (reading) ──
  // ══════════════════════════════════════════════════════════════════════════
  // (1) 看圖選字 (告示牌示範題)
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
  // (2) 看圖選句 (示範題)
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
  // (3) 是非判斷 (True / False) ── 第一階段 6 題
  {
    id: 'tme-read-tf-01',
    track: 'tme-preA1',
    category: 'reading',
    subType: 'read-truefalse',
    serialNum: 1,
    taskType: 'R-TF',
    difficulty: 1,
    question: '閱讀生活情境：\nJason is twelve years old. His sister, Amy, is nine years old.\n\n判斷下列敘述是否相符：\nJason is older than Amy. (Jason 比 Amy 年長)',
    options: ['True (相符)', 'False (不符)'],
    answer: 0,
    explanation: '文中 Jason 12 歲，Amy 9 歲，Jason 確實比妹妹年長，敘述相符，故選 True。',
    reviewed: true
  },
  {
    id: 'tme-read-tf-02',
    track: 'tme-preA1',
    category: 'reading',
    subType: 'read-truefalse',
    serialNum: 2,
    taskType: 'R-TF',
    difficulty: 1,
    question: '閱讀生活情境：\nEmma likes apples and oranges, but she doesn\'t like bananas or papayas.\n\n判斷下列敘述是否相符：\nEmma likes bananas.',
    options: ['True (相符)', 'False (不符)'],
    answer: 1,
    explanation: '文中明確指出「she doesn\'t like bananas」，故 Emma 喜歡香蕉的敘述與原文不符，選 False。',
    reviewed: true
  },
  {
    id: 'tme-read-tf-03',
    track: 'tme-preA1',
    category: 'reading',
    subType: 'read-truefalse',
    serialNum: 3,
    taskType: 'R-TF',
    difficulty: 1,
    question: '閱讀生活情境：\nThe supermarket is open from Monday to Saturday. It is closed on Sunday.\n\n判斷下列敘述是否相符：\nYou can buy food at the supermarket on Sunday.',
    options: ['True (相符)', 'False (不符)'],
    answer: 1,
    explanation: '超市週日公休（closed on Sunday），因此週日無法在超市買東西，敘述不符，選 False。',
    reviewed: true
  },
  {
    id: 'tme-read-tf-04',
    track: 'tme-preA1',
    category: 'reading',
    subType: 'read-truefalse',
    serialNum: 4,
    taskType: 'R-TF',
    difficulty: 1,
    question: '閱讀生活情境：\nDavid gets up at 6:30 every morning. He eats breakfast at 7:00 and goes to school at 7:30.\n\n判斷下列敘述是否相符：\nDavid eats breakfast before going to school. (David 在上學前吃早餐)',
    options: ['True (相符)', 'False (不符)'],
    answer: 0,
    explanation: '7:00 吃早餐，7:30 去上學，確實是在上學前吃早餐，敘述相符，選 True。',
    reviewed: true
  },
  {
    id: 'tme-read-tf-05',
    track: 'tme-preA1',
    category: 'reading',
    subType: 'read-truefalse',
    serialNum: 5,
    taskType: 'R-TF',
    difficulty: 1,
    question: '閱讀生活情境：\nPeter has two dogs and three cats in his house. All his pets are friendly.\n\n判斷下列敘述是否相符：\nPeter has five pets in total. (Peter 總共有五隻寵物)',
    options: ['True (相符)', 'False (不符)'],
    answer: 0,
    explanation: '2 隻狗加 3 隻貓合計 5 隻寵物，敘述相符，選 True。',
    reviewed: true
  },
  {
    id: 'tme-read-tf-06',
    track: 'tme-preA1',
    category: 'reading',
    subType: 'read-truefalse',
    serialNum: 6,
    taskType: 'R-TF',
    difficulty: 2,
    question: '閱讀生活情境：\nThe train to Taipei leaves at 10:15. It is 10:30 now, and Sam is still at home.\n\n判斷下列敘述是否相符：\nSam is on the train now. (Sam 現在正在火車上)',
    options: ['True (相符)', 'False (不符)'],
    answer: 1,
    explanation: '火車 10:15 已開走，現在 10:30 且 Sam 還在家裡，顯然沒搭上火車，敘述不符，選 False。',
    reviewed: true
  },
  // (4) 段落填空 (Cloze) ── 第一階段 6 題
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
  {
    id: 'tme-read-cloze-02',
    track: 'tme-preA1',
    category: 'reading',
    subType: 'read-cloze',
    serialNum: 2,
    taskType: 'R-CLOZE',
    difficulty: 1,
    passage: {
      title: '【短文填空】Sunday in the Park',
      text: 'Today is Sunday. It is a sunny day. Mary and her brother go to the park. They ride their _______ happily together.'
    },
    question: '依短文文意，空格處應填入哪一個單字？',
    options: ['bikes', 'beds', 'chairs', 'desks'],
    answer: 0,
    explanation: '在公園裡騎的是腳踏車（ride bikes），故選 ① bikes。',
    reviewed: true
  },
  {
    id: 'tme-read-cloze-03',
    track: 'tme-preA1',
    category: 'reading',
    subType: 'read-cloze',
    serialNum: 3,
    taskType: 'R-CLOZE',
    difficulty: 1,
    passage: {
      title: '【短文填空】After School Snack',
      text: 'Tom is hungry after school. He opens the refrigerator and takes out some bread. Then he drinks a glass of _______.'
    },
    question: '依短文文意，空格處應填入哪一個單字？',
    options: ['milk', 'pens', 'shoes', 'books'],
    answer: 0,
    explanation: '動詞為 drinks（喝），且單位為 a glass of（一杯），空格只能填可飲用的液體 milk（牛奶）。',
    reviewed: true
  },
  {
    id: 'tme-read-cloze-04',
    track: 'tme-preA1',
    category: 'reading',
    subType: 'read-cloze',
    serialNum: 4,
    taskType: 'R-CLOZE',
    difficulty: 2,
    passage: {
      title: '【短文填空】Reading Time',
      text: 'Lisa wants to read an English story. She walks to the school _______ and finds a very interesting book on the shelf.'
    },
    question: '依短文文意，空格處應填入哪一個單字？',
    options: ['library', 'kitchen', 'bedroom', 'bathroom'],
    answer: 0,
    explanation: '找書與閱讀應前往學校的圖書館（library），故選 ①。',
    reviewed: true
  },
  {
    id: 'tme-read-cloze-05',
    track: 'tme-preA1',
    category: 'reading',
    subType: 'read-cloze',
    serialNum: 5,
    taskType: 'R-CLOZE',
    difficulty: 1,
    passage: {
      title: '【短文填空】Rainy Day Reminder',
      text: 'Look outside the window. It is cold and rainy today. Don\'t forget to take an _______ with you when you leave.'
    },
    question: '依短文文意，空格處應填入哪一個單字？',
    options: ['umbrella', 'apple', 'orange', 'eraser'],
    answer: 0,
    explanation: '雨天出門提醒攜帶的應為雨傘（umbrella），冠詞為 an 也符合母音開頭。',
    reviewed: true
  },
  {
    id: 'tme-read-cloze-06',
    track: 'tme-preA1',
    category: 'reading',
    subType: 'read-cloze',
    serialNum: 6,
    taskType: 'R-CLOZE',
    difficulty: 1,
    passage: {
      title: '【短文填空】Lunch Break',
      text: 'Kevin has four classes in the morning. At twelve o\'clock, he has _______ with his classmates in the classroom.'
    },
    question: '依短文文意，空格處應填入哪一個單字？',
    options: ['lunch', 'breakfast', 'dinner', 'supper'],
    answer: 0,
    explanation: '中午十二點（twelve o\'clock）吃的餐點為午餐（lunch），故選 ①。',
    reviewed: true
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ── 4. 口說 (speaking) ── 原型示範題 (暫緩大規模擴充)
  // ══════════════════════════════════════════════════════════════════════════
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

  // ══════════════════════════════════════════════════════════════════════════
  // ── 5. 寫作 (writing) ── 第一階段主力 (重組問句 6 題 ＋ 重組答句 6 題)
  // ══════════════════════════════════════════════════════════════════════════
  // (1) 看問句重組答句 ── 6 題
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
    id: 'tme-write-sr-02',
    track: 'tme-preA1',
    category: 'writing',
    subType: 'write-scramble-resp',
    serialNum: 2,
    taskType: 'W-SCRAMBLE',
    difficulty: 1,
    question: '【重組答句】看問句「What time is it now?」，將單字依序重組成正確答句：',
    scrambledWords: ['is', 'o’clock', 'It', 'three'],
    targetSentence: 'It is three o’clock.',
    options: [
      'It is three o’clock.',
      'Three o’clock it is.',
      'It three is o’clock.',
      'Is it three o’clock.'
    ],
    answer: 0,
    explanation: '回答時間標準句型為「It is + 數字 + o’clock.」。',
    reviewed: true
  },
  {
    id: 'tme-write-sr-03',
    track: 'tme-preA1',
    category: 'writing',
    subType: 'write-scramble-resp',
    serialNum: 3,
    taskType: 'W-SCRAMBLE',
    difficulty: 1,
    question: '【重組答句】看問句「Do you like apples?」，將單字依序重組成正確答句：',
    scrambledWords: ['do', 'I', 'Yes', 'like', 'them'],
    targetSentence: 'Yes, I like them.',
    options: [
      'Yes, I like them.',
      'I like them, yes do.',
      'Yes, them I like.',
      'Do I like them, yes.'
    ],
    answer: 0,
    explanation: '簡答肯定的完整肯定句為「Yes, I like them.（是的，我喜歡它們）」。',
    reviewed: true
  },
  {
    id: 'tme-write-sr-04',
    track: 'tme-preA1',
    category: 'writing',
    subType: 'write-scramble-resp',
    serialNum: 4,
    taskType: 'W-SCRAMBLE',
    difficulty: 1,
    question: '【重組答句】看問句「How is the weather today?」，將單字依序重組成正確答句：',
    scrambledWords: ['sunny', 'It', 'today', 'is'],
    targetSentence: 'It is sunny today.',
    options: [
      'It is sunny today.',
      'Today sunny is it.',
      'Is it sunny today.',
      'It sunny is today.'
    ],
    answer: 0,
    explanation: '回答天氣句型為「It is + 天氣形容詞 + today.」。',
    reviewed: true
  },
  {
    id: 'tme-write-sr-05',
    track: 'tme-preA1',
    category: 'writing',
    subType: 'write-scramble-resp',
    serialNum: 5,
    taskType: 'W-SCRAMBLE',
    difficulty: 2,
    question: '【重組答句】看問句「Can you play basketball?」，將單字依序重組成正確答句：',
    scrambledWords: ['can', 'Yes', 'play', 'I'],
    targetSentence: 'Yes, I can play.',
    options: [
      'Yes, I can play.',
      'I can play, yes.',
      'Can I play, yes.',
      'Yes, play I can.'
    ],
    answer: 0,
    explanation: 'Can 疑問句的肯定答句為「Yes, I can play.（是的，我會打）」。',
    reviewed: true
  },
  {
    id: 'tme-write-sr-06',
    track: 'tme-preA1',
    category: 'writing',
    subType: 'write-scramble-resp',
    serialNum: 6,
    taskType: 'W-SCRAMBLE',
    difficulty: 2,
    question: '【重組答句】看問句「What does your sister want?」，將單字依序重組成正確答句：',
    scrambledWords: ['She', 'some', 'wants', 'milk'],
    targetSentence: 'She wants some milk.',
    options: [
      'She wants some milk.',
      'Some milk she wants.',
      'Wants she some milk.',
      'She some milk wants.'
    ],
    answer: 0,
    explanation: '第三人稱單數主詞 She，動詞要加 s 為 wants，後接受詞 some milk。',
    reviewed: true
  },

  // (2) 看答句重組問句 ── 6 題
  {
    id: 'tme-write-sq-01',
    track: 'tme-preA1',
    category: 'writing',
    subType: 'write-scramble-q',
    serialNum: 1,
    taskType: 'W-SCRAMBLE',
    difficulty: 1,
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
  },
  {
    id: 'tme-write-sq-02',
    track: 'tme-preA1',
    category: 'writing',
    subType: 'write-scramble-q',
    serialNum: 2,
    taskType: 'W-SCRAMBLE',
    difficulty: 1,
    question: '【重組問句】看答句「I am from Taiwan.」，將單字依序重組成適當的疑問句：',
    scrambledWords: ['you', 'Where', 'from', 'are'],
    targetSentence: 'Where are you from?',
    options: [
      'Where are you from?',
      'Where from are you?',
      'Are you where from?',
      'You are from where?'
    ],
    answer: 0,
    explanation: '詢問來自何處句型為「Where are you from?」。',
    reviewed: true
  },
  {
    id: 'tme-write-sq-03',
    track: 'tme-preA1',
    category: 'writing',
    subType: 'write-scramble-q',
    serialNum: 3,
    taskType: 'W-SCRAMBLE',
    difficulty: 2,
    question: '【重組問句】看答句「My favorite color is blue.」，將單字依序重組成適當的疑問句：',
    scrambledWords: ['color', 'What', 'your', 'favorite', 'is'],
    targetSentence: 'What is your favorite color?',
    options: [
      'What is your favorite color?',
      'What color is favorite your?',
      'Your favorite color is what?',
      'Is what your favorite color?'
    ],
    answer: 0,
    explanation: '詢問最喜歡的顏色句型為「What is your favorite color?」。',
    reviewed: true
  },
  {
    id: 'tme-write-sq-04',
    track: 'tme-preA1',
    category: 'writing',
    subType: 'write-scramble-q',
    serialNum: 4,
    taskType: 'W-SCRAMBLE',
    difficulty: 1,
    question: '【重組問句】看答句「Yes, she can swim very well.」，將單字依序重組成適當的疑問句：',
    scrambledWords: ['swim', 'she', 'Can'],
    targetSentence: 'Can she swim?',
    options: [
      'Can she swim?',
      'She can swim?',
      'Swim can she?',
      'Can swim she?'
    ],
    answer: 0,
    explanation: '答句為 Yes/No，含有助動詞 can，問句應為「Can + 主詞 + 原形動詞?」即「Can she swim?」。',
    reviewed: true
  },
  {
    id: 'tme-write-sq-05',
    track: 'tme-preA1',
    category: 'writing',
    subType: 'write-scramble-q',
    serialNum: 5,
    taskType: 'W-SCRAMBLE',
    difficulty: 1,
    question: '【重組問句】看答句「He is in the kitchen.」，將單字依序重組成適當的疑問句：',
    scrambledWords: ['is', 'he', 'Where'],
    targetSentence: 'Where is he?',
    options: [
      'Where is he?',
      'Where he is?',
      'Is he where?',
      'He is where?'
    ],
    answer: 0,
    explanation: '答句告知地點「in the kitchen」，問句應為 Where 開頭的倒裝問句「Where is he?」。',
    reviewed: true
  },
  {
    id: 'tme-write-sq-06',
    track: 'tme-preA1',
    category: 'writing',
    subType: 'write-scramble-q',
    serialNum: 6,
    taskType: 'W-SCRAMBLE',
    difficulty: 2,
    question: '【重組問句】看答句「No, they don\'t like hot dogs.」，將單字依序重組成適當的疑問句：',
    scrambledWords: ['hot dogs', 'like', 'they', 'Do'],
    targetSentence: 'Do they like hot dogs?',
    options: [
      'Do they like hot dogs?',
      'Do like they hot dogs?',
      'They do like hot dogs?',
      'Like they do hot dogs?'
    ],
    answer: 0,
    explanation: '答句為「No, they don\'t like...」，一般動詞 like 的複數主詞問句使用助動詞 Do 開頭：「Do they like hot dogs?」。',
    reviewed: true
  }
];
