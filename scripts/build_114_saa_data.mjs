import fs from 'fs';
import path from 'path';

const outDir = path.resolve('src/data/exam/saa');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// ============================================================================
// GRADE 4 (114) - 35 Questions
// ============================================================================
const g4Questions = [
  {
    number: 1,
    taskType: 'L-WORD',
    dimension: '辭彙聽辨',
    question: '請聽語音，選出正確的字詞：',
    options: ['cardboard', 'copper', 'cube', 'couple'],
    answer: 1,
    media: { audioText: 'copper' },
    explanation: '聽力語音為「copper（銅、銅幣）」，發音為短母音 /ɑ/，以字母 c 開頭。'
  },
  {
    number: 2,
    taskType: 'A-SOUND',
    dimension: '語音聽辨',
    question: '請聽語音，選出正確的拼字：',
    options: ['xylophone', 'sylobhone', 'xylobhone', 'sylophone'],
    answer: 0,
    media: { audioText: 'xylophone' },
    explanation: '聽力語音為木琴「xylophone」，正確英文拼字為 x-y-l-o-p-h-o-n-e。'
  },
  {
    number: 3,
    taskType: 'A-SOUND',
    dimension: '語音聽辨',
    question: '請聽語音，選出正確的字詞：',
    options: ['kachupi', 'pikachu', 'chukapi', 'pichuka'],
    answer: 1,
    media: { audioText: 'pikachu' },
    explanation: '聽力語音為寶可夢經典角色皮卡丘「pikachu」，正確音節拼字為 p-i-k-a-c-h-u。'
  },
  {
    number: 4,
    taskType: 'A-SOUND',
    dimension: '語音聽辨',
    question: '請聽語音，選出正確的字詞：',
    options: ['made', 'mad', 'mat', 'meat'],
    answer: 0,
    media: { audioText: 'made' },
    explanation: '聽力語音為「made」，長母音 a_e 發音為 /eɪ/，代表過去式製造。'
  },
  {
    number: 5,
    taskType: 'L-WORD',
    dimension: '辭彙聽辨',
    question: '請聽語音，選出正確的單字：',
    options: ['weather', 'water', 'windy', 'window'],
    answer: 0,
    media: { audioText: 'weather' },
    explanation: '聽力語音為「weather（天氣）」，發音以 /w/ 開頭，中間母音為 /ɛ/。'
  },
  {
    number: 6,
    taskType: 'L-WORD',
    dimension: '辭彙聽辨',
    question: '請聽語音，選出正確的顏色單字：',
    options: ['black', 'pink', 'green', 'brown'],
    answer: 3,
    media: { audioText: 'brown' },
    explanation: '聽力語音為顏色單字「brown（褐色、棕色）」，以子音群 br- 開頭。'
  },
  {
    number: 7,
    taskType: 'L-CONV',
    dimension: '言談理解',
    question: '請聽對話，選出最相符的敘述：',
    options: ['He is in the kitchen.', 'He is doing the dishes.', 'He is cooking.', 'He is brushing his teeth.'],
    answer: 2,
    media: {
      audioText: "Woman: Ted, where are you?\nTed: I'm in the kitchen.\nWoman: What are you doing?\nTed: I'm cooking.\nWoman: Oh, let me see.\nNarrator: What is Ted doing?"
    },
    explanation: '對話中 Ted 明確回答「I\'m cooking.（我正在煮飯做菜）」，故正確答案為選項 ③。'
  },
  {
    number: 8,
    taskType: 'L-SENT',
    dimension: '辨識句意',
    question: '請聽對話，選出最相符的收據圖片：',
    options: ['選項 ① ($13: 香蕉與橘子)', '選項 ② ($23: 香蕉與橘子)', '選項 ③ ($32: 蘋果與橘子)', '選項 ④ ($23: 蘋果與香蕉)'],
    answer: 1,
    image: '/assets/exam/saa/114/g4_q8.webp',
    media: {
      audioText: "Boy: Can I have a banana and an orange, please?\nClerk: No problem. That's twenty-three dollars, please.\nBoy: Here you go."
    },
    explanation: '聽力中男孩購買香蕉（banana）與橘子（orange），店員告知總價「That\'s twenty-three dollars, please.（23 元）」，選項 ② 完全相符。'
  },
  {
    number: 9,
    taskType: 'L-SENT',
    dimension: '辨識句意',
    question: '請聽句子，選出相符的情境插圖：',
    options: ['選項 ① (安靜請勿說話)', '選項 ② (請坐下)', '選項 ③ (請大聲說話)', '選項 ④ (請站起來)'],
    answer: 2,
    image: '/assets/exam/saa/114/g4_q9.webp',
    media: { audioText: 'Teacher: Speak louder, please.' },
    explanation: '聽力句子為「Speak louder, please.（請說大聲一點）」，選項 ③ 拿著擴音器示意大聲說話，故選 ③。'
  },
  {
    number: 10,
    taskType: 'L-SENT',
    dimension: '辨識句意',
    question: '請聽對話，選出物品相符的位置圖：',
    options: ['選項 ① (筆在書桌上)', '選項 ② (筆在書桌下)', '選項 ③ (尺在書桌下)', '選項 ④ (書在椅子下)'],
    answer: 1,
    image: '/assets/exam/saa/114/g4_q10.webp',
    media: {
      audioText: "Girl: Kevin, is this your pen?\nKevin: Yes, I couldn't find it.\nGirl: It is under the desk."
    },
    explanation: '對話中女孩指明原子筆「It is under the desk.（它在書桌底下）」，選項 ② 插圖相符。'
  },
  {
    number: 11,
    taskType: 'L-SENT',
    dimension: '辨識句意',
    question: '請聽對話，選出書包與箱子相符的位置圖：',
    options: ['選項 ① (綠箱子在臥室)', '選項 ② (紅箱子在客廳)', '選項 ③ (書包在廚房)', '選項 ④ (綠箱子在客廳，書包在箱內)'],
    answer: 3,
    image: '/assets/exam/saa/114/g4_q11.webp',
    media: {
      audioText: "Mom: Where is your bag?\nBoy: My bag is in the green box.\nMom: Where is the green box?\nBoy: It's in the living room."
    },
    explanation: '對話指明書包在綠色箱子裡（green box），且箱子位於客廳（living room），選項 ④ 完全相符。'
  },
  {
    number: 12,
    taskType: 'L-SENT',
    dimension: '辨識句意',
    question: '請聽對話，選出哥哥年齡與身分相符的圖：',
    options: ['選項 ① (哥哥 22 歲，是醫生與廚師)', '選項 ② (哥哥 12 歲，是學生)', '選項 ③ (哥哥 20 歲，是廚師)', '選項 ④ (哥哥 22 歲，既是廚師也是司機)'],
    answer: 3,
    image: '/assets/exam/saa/114/g4_q12.webp',
    media: {
      audioText: "Girl: How old is your brother?\nBoy: He is twenty-two.\nGirl: Is your brother a cook?\nBoy: Yes, he is. He is a driver, too.\nGirl: Wow, cool."
    },
    explanation: '對話提及哥哥 22 歲（twenty-two），且「He is a cook. He is a driver, too.（既是廚師也是司機）」，選項 ④ 相符。'
  },
  {
    number: 13,
    taskType: 'L-SENT',
    dimension: '辨識句意',
    question: '請聽對話，選出玩具位置相符的圖片：',
    options: ['選項 ① (近處風箏，遠處機器人)', '選項 ② (近處機器人，遠處風箏)', '選項 ③ (近處洋娃娃，遠處風箏)', '選項 ④ (近處機器人，遠處氣球)'],
    answer: 1,
    image: '/assets/exam/saa/114/g4_q13.webp',
    media: {
      audioText: "Girl: What's this?\nBoy: It's my robot.\nGirl: What's that?\nBoy: It's a kite."
    },
    explanation: '近處 this 為機器人（robot），遠處 that 為風箏（kite），選項 ② 正確。'
  },
  {
    number: 14,
    taskType: 'L-SENT',
    dimension: '辨識句意',
    question: '請聽敘述，選出節慶採買相符的圖：',
    options: ['選項 ① (端午節粽子與龍舟)', '選項 ② (萬聖節南瓜與糖果)', '選項 ③ (中秋節柚子與月餅)', '選項 ④ (聖誕節拐杖糖與聖誕樹)'],
    answer: 2,
    image: '/assets/exam/saa/114/g4_q14.webp',
    media: {
      audioText: 'Narrator: Bob is shopping for Moon Festival. He wants some pommelos and mooncakes.'
    },
    explanation: '聽力內容為 Bob 正在採買中秋節（Moon Festival）應景食物柚子（pommelos）與月餅（mooncakes），選項 ③ 正確。'
  },
  {
    number: 15,
    taskType: 'L-SENT',
    dimension: '辨識句意',
    question: '請聽對話，選出萬聖節相符的情境圖：',
    options: ['選項 ① (萬聖節裝扮、下雨帶傘、時鐘 9 點)', '選項 ② (晴天出門、時鐘 8 點)', '選項 ③ (下雨沒帶傘、時鐘 9 點)', '選項 ④ (室內吃糖果、時鐘 10 點)'],
    answer: 0,
    image: '/assets/exam/saa/114/g4_q15.webp',
    media: {
      audioText: "Boy: Can we go trick-or-treating?\nMom: Of course.\nBoy: Thank you, Mom. I'll be back at nine o'clock.\nMom: Take an umbrella. It's rainy."
    },
    explanation: '對話中提及出門不給糖就搗蛋（trick-or-treating）、預計九點回家（nine o\'clock），且外面下雨要帶雨傘（Take an umbrella. It\'s rainy.），選項 ① 相符。'
  },
  {
    number: 16,
    taskType: 'V-MEAN',
    dimension: '字母辨識',
    question: '選出與圖片字母相符的答案：',
    options: ['KANAIA HAFFIS', 'KAMALA HARRIS', 'KAMALA HANNLS', 'KANAIA HANNIS'],
    answer: 1,
    image: '/assets/exam/saa/114/g4_q16.webp',
    explanation: '圖片文字清楚標示大寫英文字母「KAMALA HARRIS」，拼字為 K-A-M-A-L-A H-A-R-R-I-S，故選 ②。'
  },
  {
    number: 17,
    taskType: 'V-MEAN',
    dimension: '字母辨識',
    question: '選出與圖片字母相符的答案：',
    options: ['Seltribges Deparfnemf Sfore', 'Seltridjes Deqarfmenf Sfore', 'Selfridges Department Store', 'Selfribges Deqartnemt Store'],
    answer: 2,
    image: '/assets/exam/saa/114/g4_q17.webp',
    explanation: '圖片招牌為英國知名連鎖百貨公司「Selfridges Department Store」，故選 ③。'
  },
  {
    number: 18,
    taskType: 'V-MEAN',
    dimension: '字意理解',
    question: '看圖選出職業名稱：',
    options: ['a doctor', 'a driver', 'a student', 'a cook'],
    answer: 1,
    image: '/assets/exam/saa/114/g4_q18.webp',
    explanation: '圖片中人物雙手握著方向盤正在開車，身分為司機（a driver），故選 ②。'
  },
  {
    number: 19,
    taskType: 'V-MEAN',
    dimension: '字意理解',
    question: '看圖數一數，選出數量與食物名稱相符的敘述：',
    options: [
      'eight bananas, five hot dogs, and four sandwiches',
      'eight bananas, four hot dogs, and five sandwiches',
      'seven bananas, five hot dogs, and four sandwiches',
      'seven bananas, four hot dogs, and five sandwiches'
    ],
    answer: 0,
    image: '/assets/exam/saa/114/g4_q19.webp',
    explanation: '圖中盤子內共有 8 根香蕉（eight bananas）、5 支熱狗（five hot dogs）與 4 個三明治（four sandwiches），故選 ①。'
  },
  {
    number: 20,
    taskType: 'V-MEAN',
    dimension: '字意理解',
    question: '選出與英文單字「fifteen」相對應的數字：',
    options: ['選項 ① (50)', '選項 ② (5)', '選項 ③ (15)', '選項 ④ (12)'],
    answer: 2,
    image: '/assets/exam/saa/114/g4_q20.webp',
    explanation: '單字「fifteen」代表數字 15，圖 ③ 標示 15，故選 ③。'
  },
  {
    number: 21,
    taskType: 'V-MEAN',
    dimension: '字意理解',
    question: 'Open your book to page ____________.',
    options: ['twenty-two', 'thirty-three', 'twenty-three', 'thirty-two'],
    answer: 3,
    image: '/assets/exam/saa/114/g4_q21.webp',
    explanation: '圖中課本打開頁碼顯示為第 32 頁，英文為「thirty-two」，故選 ④。'
  },
  {
    number: 22,
    taskType: 'V-MEAN',
    dimension: '字意理解',
    question: '看圖選出動物與特徵描述：',
    options: ['a small dog', 'a big chicken', 'a small cat', 'a big duck'],
    answer: 0,
    image: '/assets/exam/saa/114/g4_q22.webp',
    explanation: '圖片中是一隻體型嬌小的狗（a small dog），故選 ①。'
  },
  {
    number: 23,
    taskType: 'V-MEAN',
    dimension: '字意理解',
    question: '看圖選出居家場所名稱：',
    options: ['dining room', 'living room', 'bedroom', 'kitchen'],
    answer: 2,
    image: '/assets/exam/saa/114/g4_q23.webp',
    explanation: '圖中有床鋪與被褥枕頭，為臥室（bedroom），故選 ③。'
  },
  {
    number: 24,
    taskType: 'V-MEAN',
    dimension: '字意理解',
    question: '看圖選出人物感受相符的敘述：',
    options: ['I’m black and blue.', 'I’m thin and fat.', 'It’s green and purple.', 'I’m happy and full.'],
    answer: 3,
    image: '/assets/exam/saa/114/g4_q24.webp',
    explanation: '圖中角色剛吃飽飯滿足地摸著肚子微笑，形容「happy and full（快樂且飽足）」，故選 ④。'
  },
  {
    number: 25,
    taskType: 'V-MEAN',
    dimension: '字意理解',
    question: '看圖選出文具相對位置相符的句子：',
    options: ['The ruler is on the book.', 'The ruler is under the book.', 'The pen is on the ruler.', 'The book is under the pen.'],
    answer: 0,
    image: '/assets/exam/saa/114/g4_q25.webp',
    explanation: '圖中直尺（ruler）平放在書本（book）上方，介系詞使用 on，故選 ①「The ruler is on the book.」。'
  },
  {
    number: 26,
    taskType: 'R-COMP',
    dimension: '句子理解',
    question: 'It’s so hot today. I want some ice cream.',
    options: ['選項 ① (大太陽下流汗吃冰淇淋)', '選項 ② (下雪天堆雪人)', '選項 ③ (下雨天吃熱麵)', '選項 ④ (颳大風放風箏)'],
    answer: 0,
    image: '/assets/exam/saa/114/g4_q26.webp',
    explanation: '句子表達今天好熱（so hot）、想吃冰淇淋（want some ice cream），圖 ① 完全相符，故選 ①。'
  },
  {
    number: 27,
    taskType: 'G-MC',
    dimension: '文法與會話',
    question: 'She’s beautiful. Who’s she?',
    options: ['She’s eating hamburgers.', 'She’s my mother. She is a doctor.', 'She’s drinking tea in the kitchen.', 'She’s seventy-five years old.'],
    answer: 1,
    explanation: '問句「Who\'s she?（她是誰？）」詢問對方身分，回答「She\'s my mother. She is a doctor.（她是我媽媽，她是一位醫生）」最合邏輯，故選 ②。'
  },
  {
    number: 28,
    taskType: 'G-MC',
    dimension: '文法與會話',
    question: 'A: _____________________________________________?\nB: She’s in the living room.',
    options: ['Where is grandma?', 'What is she doing?', 'Who’s she?', 'How old is your sister?'],
    answer: 0,
    explanation: '答句「She\'s in the living room.（她在客廳裡）」回答場所地點，疑問句應用「Where（在哪裡）」，故選 ①「Where is grandma?」。'
  },
  {
    number: 29,
    taskType: 'G-MC',
    dimension: '日常生活情境',
    question: 'A: Trick or treat!\nB: ________________________________',
    options: ['Give me a hand, please.', 'Sorry, I’m late.', 'How about you?', 'Here’s some candy for you.'],
    answer: 3,
    explanation: '萬聖節小朋友說「Trick or treat!（不給糖就搗蛋）」，對方合適回應為「Here\'s some candy for you.（拿去，這是給你的糖果）」，故選 ④。'
  },
  {
    number: 30,
    taskType: 'G-MC',
    dimension: '節慶文化理解',
    question: 'Annie: Mom, here’s a flower for you.\nMom: What’s wrong?\nAnnie: It’s the 2nd Sunday of May.\nMom: Oh! Thank you.\nAnnie: _______________________________________',
    options: ['Happy New Year.', 'Merry Christmas!', 'Happy Mother’s Day.', 'Happy Moon Festival.'],
    answer: 2,
    explanation: '五月的第二個星期日為母親節（the 2nd Sunday of May），送花給媽媽應祝賀「Happy Mother\'s Day.（母親節快樂）」，故選 ③。'
  },
  {
    number: 31,
    taskType: 'R-COMP',
    dimension: '篇章理解題組',
    groupId: 'saa-114-g4-call',
    passage: {
      title: '【視訊電話】A Video Call from Ken',
      text: "Andy: Hi, Ken! How are you?\nKen: Great! How’s the weather in Taiwan?\nAndy: It’s cold and rainy now.\nKen: It’s hot and sunny here in Sydney (雪梨).\nAndy: That’s nice. Is that your brother?\nKen: Yes, he is reading.\nAndy: It’s dinner time for me.\nKen: It’s nine thirty here in Sydney. It’s bed time for me."
    },
    image: '/assets/exam/saa/114/g4_q31.webp',
    question: 'How’s the weather in Taiwan?',
    options: ['選項 ① (晴天大太陽)', '選項 ② (寒冷下雨天)', '選項 ③ (下雪天)', '選項 ④ (颳大風)'],
    answer: 1,
    explanation: '對話中 Andy 回答「It’s cold and rainy now.（臺灣現在又冷又下雨）」，選項 ② 下雨撐傘圖相符，故選 ②。'
  },
  {
    number: 32,
    taskType: 'R-COMP',
    dimension: '篇章理解題組',
    groupId: 'saa-114-g4-call',
    passage: {
      title: '【視訊電話】A Video Call from Ken',
      text: "Andy: Hi, Ken! How are you?\nKen: Great! How’s the weather in Taiwan?\nAndy: It’s cold and rainy now.\nKen: It’s hot and sunny here in Sydney (雪梨).\nAndy: That’s nice. Is that your brother?\nKen: Yes, he is reading.\nAndy: It’s dinner time for me.\nKen: It’s nine thirty here in Sydney. It’s bed time for me."
    },
    question: 'Which (哪一個) is true?',
    options: ['It’s rainy in Sydney.', 'Andy is going to bed.', 'Ken’s brother is reading.', 'Ken is in Taiwan.'],
    answer: 2,
    explanation: '文中 Ken 指出「Yes, he is reading.（對，我弟弟正在閱讀看書）」，選項 ③ 敘述正確。'
  },
  {
    number: 33,
    taskType: 'R-COMP',
    dimension: '篇章理解題組',
    groupId: 'saa-114-g4-call',
    passage: {
      title: '【視訊電話】A Video Call from Ken',
      text: "Andy: Hi, Ken! How are you?\nKen: Great! How’s the weather in Taiwan?\nAndy: It’s cold and rainy now.\nKen: It’s hot and sunny here in Sydney (雪梨).\nAndy: That’s nice. Is that your brother?\nKen: Yes, he is reading.\nAndy: It’s dinner time for me.\nKen: It’s nine thirty here in Sydney. It’s bed time for me."
    },
    image: '/assets/exam/saa/114/g4_q33.webp',
    question: 'What time is it in Sydney?',
    options: ['選項 ① (9:00)', '選項 ② (6:30)', '選項 ③ (8:30)', '選項 ④ (9:30)'],
    answer: 3,
    explanation: '文中 Ken 說「It’s nine thirty here in Sydney.（雪梨這裡現在是九點半）」，選項 ④ 時鐘指在 9:30，故選 ④。'
  },
  {
    number: 34,
    taskType: 'R-COMP',
    dimension: '篇章理解題組',
    groupId: 'saa-114-g4-party',
    passage: {
      title: '【驚喜派對】A Surprise Party',
      text: "Let’s have a birthday party for my mom.\nDad: Marc, the cake is ready.\nMarc: That’s nice. I’m drawing a card. Can you help me?\nDad: No problem.\nMarc: Dad, Amber is in the bedroom. Is she sleeping?\nDad: No, she’s not. Your big sister is dancing.\nMarc: Cool! Oh! It’s cold and rainy outside.\nDad: Let’s have the party in the living room."
    },
    question: 'What is Amber doing?',
    options: ['She is in the bedroom.', 'She is drawing a card.', 'She is dancing in the bedroom.', 'She is sleeping in the living room.'],
    answer: 2,
    explanation: 'Marc 詢問在臥室的姊姊 Amber 是否在睡覺，爸爸回覆「No, she’s not. Your big sister is dancing.」，故 Amber 正在臥室裡跳舞，選 ③。'
  },
  {
    number: 35,
    taskType: 'R-COMP',
    dimension: '篇章理解題組',
    groupId: 'saa-114-g4-party',
    passage: {
      title: '【驚喜派對】A Surprise Party',
      text: "Let’s have a birthday party for my mom.\nDad: Marc, the cake is ready.\nMarc: That’s nice. I’m drawing a card. Can you help me?\nDad: No problem.\nMarc: Dad, Amber is in the bedroom. Is she sleeping?\nDad: No, she’s not. Your big sister is dancing.\nMarc: Cool! Oh! It’s cold and rainy outside.\nDad: Let’s have the party in the living room."
    },
    image: '/assets/exam/saa/114/g4_q35.webp',
    question: 'Let’s have the party in the __________.',
    options: ['選項 ① (臥室 bedroom)', '選項 ② (廚房 kitchen)', '選項 ③ (浴室 bathroom)', '選項 ④ (客廳 living room)'],
    answer: 3,
    explanation: '短文最後爸爸提議「Let’s have the party in the living room.（我們在客廳辦派對吧）」，選項 ④ 客廳圖相符，故選 ④。'
  }
];

// ============================================================================
// GRADE 5 (114) - 35 Questions
// ============================================================================
const g5Questions = [
  {
    number: 1,
    taskType: 'L-WORD',
    dimension: '語音聽辨',
    question: '請聽語音，選出正確的字詞：',
    options: ['cheer', 'there', 'share', 'where'],
    answer: 0,
    media: { audioText: 'cheer' },
    explanation: '聽力語音為「cheer」，以子音 /tʃ/ 開頭，發音為 /tʃɪr/。'
  },
  {
    number: 2,
    taskType: 'L-WORD',
    dimension: '語音聽辨',
    question: '請聽語音，選出正確的單字：',
    options: ['drink', 'Derek', 'trick', 'truck'],
    answer: 2,
    media: { audioText: 'trick' },
    explanation: '聽力語音為「trick」，以子音群 tr- 開頭，母音為短母音 /ɪ/。'
  },
  {
    number: 3,
    taskType: 'L-SENT',
    dimension: '辨識句意',
    question: '請聽語音，選出相符的飲品插圖：',
    options: ['選項 ① (果汁/橘子汁)', '選項 ② (咖啡/熱飲)', '選項 ③ (水壺/水)', '選項 ④ (珍珠奶茶 bubble tea)'],
    answer: 3,
    image: '/assets/exam/saa/114/g5_q3.webp',
    media: { audioText: 'Narrator: bubble tea' },
    explanation: '聽力單字為經典臺灣代表飲品「bubble tea（珍珠奶茶）」，選項 ④ 相符。'
  },
  {
    number: 4,
    taskType: 'L-SENT',
    dimension: '辨識句意',
    question: '請聽語音，選出相符的配件插圖：',
    options: ['選項 ① (太陽眼鏡 sunglasses)', '選項 ② (普通眼鏡 glasses)', '選項 ③ (手錶 watch)', '選項 ④ (帽子 cap)'],
    answer: 0,
    image: '/assets/exam/saa/114/g5_q4.webp',
    media: { audioText: 'Narrator: sunglasses' },
    explanation: '聽力單字為「sunglasses（太陽眼鏡）」，選項 ① 插圖相符。'
  },
  {
    number: 5,
    taskType: 'L-WORD',
    dimension: '辭彙聽辨',
    question: '請聽語音，選出播出的學校機構名稱：',
    options: [
      'National Library of Social Studies',
      'National Museum of Natural Science',
      'National Math High School',
      'Chinese and English Resource Center'
    ],
    answer: 2,
    media: { audioText: 'Narrator: National Math High School' },
    explanation: '聽力播音學校名稱為「National Math High School」，選項 ③ 完全相符。'
  },
  {
    number: 6,
    taskType: 'L-SENT',
    dimension: '辨識句意',
    question: '請聽句子，選出相符的星期與天氣圖：',
    options: ['選項 ① (週一晴天)', '選項 ② (週三多雲)', '選項 ③ (週四下雨天)', '選項 ④ (週五下雪天)'],
    answer: 2,
    image: '/assets/exam/saa/114/g5_q6.webp',
    media: { audioText: 'Narrator: It was rainy this Thursday.' },
    explanation: '聽力句子為「It was rainy this Thursday.（這星期四下雨）」，選項 ③ 週四下雨相符。'
  },
  {
    number: 7,
    taskType: 'L-SENT',
    dimension: '辨識句意',
    question: '請聽句子，選出動作相符的插圖：',
    options: ['選項 ① (關燈)', '選項 ② (開窗)', '選項 ③ (開燈 Turn on the light)', '選項 ④ (關門)'],
    answer: 2,
    image: '/assets/exam/saa/114/g5_q7.webp',
    media: { audioText: 'Narrator: Turn on the light, please.' },
    explanation: '聽力句子為祈使句「Turn on the light, please.（請開燈）」，選項 ③ 伸手打開電燈開關相符。'
  },
  {
    number: 8,
    taskType: 'L-QA',
    dimension: '基本問答',
    question: '請聽對話問句，選出最適當的回應：',
    options: ['He’s doing great.', 'He’s reading a book.', 'He’s a firefighter.', 'He’s eight years old.'],
    answer: 1,
    media: {
      audioText: "Woman: We are going to be late. What's he doing?"
    },
    explanation: '問句「What\'s he doing?（他正在做什麼？）」詢問進行中動作，回答「He\'s reading a book.（他正在看書）」最合時態邏輯，故選 ②。'
  },
  {
    number: 9,
    taskType: 'L-SENT',
    dimension: '辨識句意',
    question: '請聽對話，選出節慶活動相符的插圖：',
    options: ['選項 ① (端午划龍舟)', '選項 ② (中秋節烤肉吃月餅)', '選項 ③ (復活節彩蛋尋寶與去教堂)', '選項 ④ (聖誕節交換禮物)'],
    answer: 2,
    image: '/assets/exam/saa/114/g5_q9.webp',
    media: {
      audioText: "Girl: What do you do on Easter?\nBoy: I go egg hunting with my friends. I go to church with my family."
    },
    explanation: '對話討論復活節（Easter），男孩回答進行尋找彩蛋活動（go egg hunting）並上教堂（go to church），選項 ③ 相符。'
  },
  {
    number: 10,
    taskType: 'L-SENT',
    dimension: '辨識句意',
    question: '請聽句子，選出作息時間相符的圖：',
    options: ['選項 ① (早上 6:30 起床)', '選項 ② (早上 7:30 吃早餐)', '選項 ③ (晚上 9:30 睡覺)', '選項 ④ (下午 4:30 放學)'],
    answer: 0,
    image: '/assets/exam/saa/114/g5_q10.webp',
    media: { audioText: 'Narrator: She gets up at 6:30.' },
    explanation: '聽力句子為「She gets up at 6:30.（她六點半起床）」，選項 ① 時鐘顯示 6:30 且人物正在起床，完全吻合。'
  },
  {
    number: 11,
    taskType: 'L-SENT',
    dimension: '辨識句意',
    question: '請聽句子，選出寵物外觀與年齡相符的圖：',
    options: ['選項 ① (白色小狗)', '選項 ② (黑色貓咪)', '選項 ③ (黃色小鴨)', '選項 ④ (綠色寵物 2 歲)'],
    answer: 3,
    image: '/assets/exam/saa/114/g5_q11.webp',
    media: { audioText: 'Narrator: My pet is green. He is 2 years old.' },
    explanation: '聽力指出「My pet is green. He is 2 years old.（我的寵物是綠色的，牠兩歲）」，選項 ④ 綠色寵物兩歲相符。'
  },
  {
    number: 12,
    taskType: 'L-QA',
    dimension: '基本問答',
    question: '請聽短文情境，選出最適當的回應：',
    options: ['Thank you very much.', 'You are welcome.', 'Sorry, I’m late.', 'Give me a hand.'],
    answer: 0,
    media: {
      audioText: "Narrator: Tina's brother can cook. He makes a hamburger for Tina. It's very yummy. What can Tina say to her brother?"
    },
    explanation: '哥哥為 Tina 做了美味可口的漢堡，Tina 應表達感謝說「Thank you very much.（非常謝謝你）」，故選 ①。'
  },
  {
    number: 13,
    taskType: 'L-CONV',
    dimension: '言談理解',
    question: '請聽廣播，選出商店性質相符的圖：',
    options: ['選項 ① (超級市場 a supermarket)', '選項 ② (服飾店 a clothing store)', '選項 ③ (書店 a bookstore)', '選項 ④ (醫院 a hospital)'],
    answer: 0,
    image: '/assets/exam/saa/114/g5_q13.webp',
    media: {
      audioText: "Narrator: You can buy ten oranges with one hundred dollars, and eight apples with fifty dollars. We also have fish and rice cakes. Welcome to the 101 Shop now! What is 101 Shop?"
    },
    explanation: '廣播內容介紹 101 商店販售柳丁、蘋果、魚與米糕，為生鮮超市（supermarket），故選 ①。'
  },
  {
    number: 14,
    taskType: 'L-CONV',
    dimension: '言談理解',
    groupId: 'saa-114-g5-train',
    passage: {
      title: '【火車廣播】Train Announcement from Kaohsiung to Taipei',
      text: "Conductor: This is train number 5678 from Kaohsiung to Taipei. We will stop in Taichung at 3:30, Banqiao at 4:20, and Taipei at 4:30. The weather in Taichung is windy. The weather in Taipei is rainy."
    },
    image: '/assets/exam/saa/114/g5_q14.webp',
    question: 'Andy’s train is going to Taipei. Which is Andy’s ticket?',
    options: ['選項 ① (車次 1234)', '選項 ② (車次 5678 高雄至台北)', '選項 ③ (車次 5678 台中至板橋)', '選項 ④ (車次 8765)'],
    answer: 1,
    media: {
      audioText: "Conductor: This is train number 5678 from Kaohsiung to Taipei. We will stop in Taichung at 3:30, Banqiao at 4:20, and Taipei at 4:30. The weather in Taichung is windy. The weather in Taipei is rainy.\nQuestion 14: Andy's train is going to Taipei. Which is Andy's ticket?"
    },
    explanation: '廣播中車次為 5678、路線為從高雄出發前往台北（Kaohsiung to Taipei），車票 ② 資訊完全相符。'
  },
  {
    number: 15,
    taskType: 'L-CONV',
    dimension: '言談理解',
    groupId: 'saa-114-g5-train',
    passage: {
      title: '【火車廣播】Train Announcement from Kaohsiung to Taipei',
      text: "Conductor: This is train number 5678 from Kaohsiung to Taipei. We will stop in Taichung at 3:30, Banqiao at 4:20, and Taipei at 4:30. The weather in Taichung is windy. The weather in Taipei is rainy."
    },
    image: '/assets/exam/saa/114/g5_q15.webp',
    question: 'It’s 4:40. Andy is in Taipei now. What does Andy see?',
    options: ['選項 ① (大太陽晴天)', '選項 ② (颳大風)', '選項 ③ (下雨天 rainy)', '選項 ④ (下雪天)'],
    answer: 2,
    media: {
      audioText: "Conductor: The weather in Taichung is windy. The weather in Taipei is rainy.\nQuestion 15: It's 4:40. Andy is in Taipei now. What does Andy see?"
    },
    explanation: '廣播告知台北現在下雨（The weather in Taipei is rainy.），4:40 Andy 抵達台北看到下雨撐傘景象，圖 ③ 相符。'
  },
  {
    number: 16,
    taskType: 'V-MEAN',
    dimension: '單字理解',
    question: '看圖選出科技生活物品名稱：',
    options: ['an umbrella', 'a computer', 'a sandwich', 'a smartphone'],
    answer: 3,
    image: '/assets/exam/saa/114/g5_q16.webp',
    explanation: '圖中為日常生活不可或缺的智慧型手機（a smartphone），故選 ④。'
  },
  {
    number: 17,
    taskType: 'G-MC',
    dimension: '節慶文化理解',
    question: 'Today is September 28th. Happy __________________ Day!',
    options: ['Student’s', 'Teacher’s', 'Doctor’s', 'Nurse’s'],
    answer: 1,
    explanation: '每年的 9 月 28 日為教師節（Teacher\'s Day），故選 ②。'
  },
  {
    number: 18,
    taskType: 'R-COMP',
    dimension: '身體部位理解',
    question: 'Touch your nose.',
    options: ['選項 ① (摸耳朵)', '選項 ② (摸眼睛)', '選項 ③ (摸鼻子 Touch your nose)', '選項 ④ (摸嘴巴)'],
    answer: 2,
    image: '/assets/exam/saa/114/g5_q18.webp',
    explanation: '指令「Touch your nose.」意思是觸摸鼻子，圖 ③ 人物手指指向鼻子，故選 ③。'
  },
  {
    number: 19,
    taskType: 'R-COMP',
    dimension: '生活測量理解',
    question: '看圖選出長度相符的句子：',
    options: [
      'It’s one hundred and thirteen centimeters (公分) long.',
      'It’s one hundred and thirty centimeters (公分) long.',
      'It’s eleven centimeters (公分) long.',
      'It’s three centimeters (公分) long.'
    ],
    answer: 0,
    image: '/assets/exam/saa/114/g5_q19.webp',
    explanation: '皮尺上刻度標註為 113 公分，英文數字讀為「one hundred and thirteen centimeters」，故選 ①。'
  },
  {
    number: 20,
    taskType: 'R-COMP',
    dimension: '生活情境理解',
    question: 'Look at the picture, which (哪一個) is true?',
    options: ['Jason is in the hospital.', 'Jason’s feet hurt (痛).', 'Jason doesn’t have a cold.', 'Jason has a stomachache.'],
    answer: 0,
    image: '/assets/exam/saa/114/g5_q20.webp',
    explanation: '圖中 Jason 躺在病床上有醫護人員照料，身處醫院（in the hospital），故選 ①。'
  },
  {
    number: 21,
    taskType: 'V-MEAN',
    dimension: '日常標誌辨識',
    question: '看圖選出最適合的請求問句：',
    options: ['May I go to the restaurant?', 'May I go to the restroom?', 'May I open the window?', 'May I come in?'],
    answer: 1,
    image: '/assets/exam/saa/114/g5_q21.webp',
    explanation: '圖示為男女洗手間公廁標誌（restroom），「May I go to the restroom?（我可以去洗手間嗎？）」相符，故選 ②。'
  },
  {
    number: 22,
    taskType: 'R-COMP',
    dimension: '圖表時間理解',
    question: 'The library is closed. What time is it?',
    options: ['It’s two o’clock in the afternoon.', 'It’s ten thirty in the morning.', 'It’s eight o’clock in the morning.', 'It’s three thirty in the afternoon.'],
    answer: 2,
    image: '/assets/exam/saa/114/g5_q22.webp',
    explanation: '圖書館開放時間告示為 09:00 - 17:00，早上 8 點（eight o\'clock in the morning）尚未開門為閉館狀態（closed），故選 ③。'
  },
  {
    number: 23,
    taskType: 'R-COMP',
    dimension: '日常課表推理',
    question: 'Jack is at school. It’s 9 o’clock. He is playing basketball. At 9:30, he is going to the science class. What day is today?',
    options: ['It’s Monday.', 'It’s Tuesday.', 'It’s Wednesday.', 'It’s Thursday.'],
    answer: 1,
    image: '/assets/exam/saa/114/g5_q23.webp',
    explanation: '對照課表，星期二（Tuesday）9:00 是籃球體育課、9:30 是自然科學課（science class），故選 ②。'
  },
  {
    number: 24,
    taskType: 'R-COMP',
    dimension: '生活告示理解',
    question: 'Look at the picture, which (哪一個) is true?',
    options: [
      'There is a water bottle.',
      'Teddy’s lunchbox is here.',
      'We can see it in the bathroom.',
      'I can’t find my umbrella. I can come here.'
    ],
    answer: 3,
    image: '/assets/exam/saa/114/g5_q24.webp',
    explanation: '圖片為校園「Lost and Found（失物招領箱）」，裡面放有雨傘，找不到雨傘時可至此處招領，故選 ④。'
  },
  {
    number: 25,
    taskType: 'R-COMP',
    dimension: '服飾線稿理解',
    question: 'She is wearing a dress and a scarf.',
    options: ['選項 ① (穿 T 恤與短褲)', '選項 ② (穿襯衫與長褲)', '選項 ③ (穿毛衣與牛仔褲)', '選項 ④ (穿洋裝且圍圍巾 a dress and a scarf)'],
    answer: 3,
    image: '/assets/exam/saa/114/g5_q25.webp',
    explanation: '句子敘述女孩穿著連身洋裝（dress）且圍著圍巾（scarf），圖 ④ 插圖相符，故選 ④。'
  },
  {
    number: 26,
    taskType: 'R-COMP',
    dimension: '地圖路徑理解',
    question: 'Where is he going?',
    options: ['I’m ten.', 'It’s green.', 'She goes to bed.', 'He is going to the bank.'],
    answer: 3,
    image: '/assets/exam/saa/114/g5_q26.webp',
    explanation: '地圖中指標箭頭明確指向銀行（Bank），答句「He is going to the bank.」相符，故選 ④。'
  },
  {
    number: 27,
    taskType: 'R-COMP',
    dimension: '社區地圖理解',
    question: 'Look at the picture, what is the ★?',
    options: ['It’s a marker.', 'It’s a hot dog.', 'It’s a bakery.', 'It’s a panda.'],
    answer: 2,
    image: '/assets/exam/saa/114/g5_q27.webp',
    explanation: '地圖中 ★ 星號標記之建築為麵包烘焙店（Bakery），故選 ③「It\'s a bakery.」。'
  },
  {
    number: 28,
    taskType: 'R-COMP',
    dimension: '節慶圖象理解',
    question: 'What do you see on the Christmas tree?',
    options: ['I see a star and stockings.', 'I see Santa and a snowman.', 'I see flowers and gifts.', 'I see eggs and dragon boats.'],
    answer: 0,
    image: '/assets/exam/saa/114/g5_q28.webp',
    explanation: '聖誕樹頂端有星星裝飾（a star），枝枒上懸掛著聖誕襪（stockings），故選 ①。'
  },
  {
    number: 29,
    taskType: 'R-COMP',
    dimension: '行事曆圖表理解',
    question: 'Jenny is free on Tuesdays and Saturdays. She can go to ________________________________ events (活動).',
    options: [
      'Moon Festival and Double Tenth Day',
      'Double Tenth Day and Halloween',
      'Halloween and New Year',
      'Moon Festival and Christmas'
    ],
    answer: 3,
    image: '/assets/exam/saa/114/g5_q29.webp',
    explanation: '月曆中中秋節在星期二（Tuesday）、聖誕節活動在星期六（Saturday），恰好符合 Jenny 的空閒日，故選 ④。'
  },
  {
    number: 30,
    taskType: 'R-COMP',
    dimension: '場所位置理解',
    question: 'Where is May?',
    options: ['She is in the supermarket.', 'She is in the post office.', 'She is at school.', 'She is at home.'],
    answer: 3,
    image: '/assets/exam/saa/114/g5_q30.webp',
    explanation: '圖中 May 坐在客廳沙發上看電視休憩，在家裡（at home），故選 ④。'
  },
  {
    number: 31,
    taskType: 'R-COMP',
    dimension: '篇章理解題組',
    groupId: 'saa-114-g5-plan',
    passage: {
      title: '【假日計畫】Sunday Plans for Hank, Lisa, and Ivy',
      text: "These are Hank, Lisa, and Ivy's plans (計畫) for this Sunday:\nHank is going to the supermarket to buy fruits and snacks.\nLisa and Ivy both (兩人都) go to ★ in the afternoon.\nLisa goes home by bike."
    },
    image: '/assets/exam/saa/114/g5_q31_passage.webp',
    question: 'Where is Hank going this Sunday?',
    options: ['He is going to a supermarket.', 'He is going to a bookstore.', 'He is going to a post office.', 'He is going to a hospital.'],
    answer: 0,
    explanation: '短文指出 Hank 週日要去超級市場買東西（going to a supermarket），故選 ①。'
  },
  {
    number: 32,
    taskType: 'R-COMP',
    dimension: '篇章理解題組',
    groupId: 'saa-114-g5-plan',
    passage: {
      title: '【假日計畫】Sunday Plans for Hank, Lisa, and Ivy',
      text: "These are Hank, Lisa, and Ivy's plans (計畫) for this Sunday:\nHank is going to the supermarket to buy fruits and snacks.\nLisa and Ivy both (兩人都) go to ★ in the afternoon.\nLisa goes home by bike."
    },
    image: '/assets/exam/saa/114/g5_q31_passage.webp',
    question: 'Lisa and Ivy both (兩人都) go to ★, what place is this?',
    options: ['It’s the bakery.', 'It’s the park.', 'It’s the bank.', 'It’s the museum.'],
    answer: 1,
    explanation: '地圖中 ★ 星號標記之地點為休閒綠地公園（Park），故選 ②。'
  },
  {
    number: 33,
    taskType: 'R-COMP',
    dimension: '篇章理解題組',
    groupId: 'saa-114-g5-plan',
    passage: {
      title: '【假日計畫】Sunday Plans for Hank, Lisa, and Ivy',
      text: "These are Hank, Lisa, and Ivy's plans (計畫) for this Sunday:\nHank is going to the supermarket to buy fruits and snacks.\nLisa and Ivy both (兩人都) go to ★ in the afternoon.\nLisa goes home by bike."
    },
    image: '/assets/exam/saa/114/g5_q33.webp',
    question: 'How does Lisa go home?',
    options: ['She goes home by bus.', 'She goes home by car.', 'She goes home by taxi.', 'She goes home by bike.'],
    answer: 3,
    explanation: '交通方式圖解載明 Lisa 騎自行車回家（by bike），故選 ④。'
  },
  {
    number: 34,
    taskType: 'R-COMP',
    dimension: '篇章理解題組',
    groupId: 'saa-114-g5-schedule',
    passage: {
      title: '【每週課表】Jason’s Weekly Schedule',
      text: "Monday 10/7: Bring a basketball\nTuesday 10/8: Regular class\nWednesday 10/9: Bring a swimming suit\nThursday 10/10: Happy Birthday Day!\nFriday 10/11: Field Trip (戶外教學)!"
    },
    image: '/assets/exam/saa/114/g5_q34_schedule.webp',
    question: 'What day does Jason have swimming class?',
    options: ['He has swimming class on Monday.', 'He has swimming class on Wednesday.', 'He has swimming class on Double Tenth Day.', 'He has swimming class on his birthday.'],
    answer: 1,
    explanation: '課表上 10/9 星期三（Wednesday）標明「Bring a swimming suit（攜帶泳衣）」，代表週三有游泳課，故選 ②。'
  },
  {
    number: 35,
    taskType: 'R-COMP',
    dimension: '篇章理解題組',
    groupId: 'saa-114-g5-schedule',
    passage: {
      title: '【每週課表】Jason’s Weekly Schedule',
      text: "Monday 10/7: Bring a basketball\nTuesday 10/8: Regular class\nWednesday 10/9: Bring a swimming suit\nThursday 10/10: Happy Birthday Day!\nFriday 10/11: Field Trip (戶外教學)!"
    },
    image: '/assets/exam/saa/114/g5_q34_schedule.webp',
    question: 'Look at the weather on Friday. What does Jason need in his bag?',
    options: ['He needs sunglasses.', 'He needs an umbrella.', 'He doesn’t need his bag.', 'He doesn’t need his phone.'],
    answer: 1,
    explanation: '週五天氣圖示為降雨，參加戶外教學時書包需備妥雨傘（He needs an umbrella.），故選 ②。'
  }
];

// ============================================================================
// GRADE 6 (114) - 35 Questions
// ============================================================================
const g6Questions = [
  {
    number: 1,
    taskType: 'L-WORD',
    dimension: '語音聽辨',
    question: '請聽語音，選出正確的字詞：',
    options: ['fuel', 'feel', 'file', 'fell'],
    answer: 1,
    media: { audioText: 'feel' },
    explanation: '聽力語音為「feel」，發音為長母音 /iː/，以 f- 開頭。'
  },
  {
    number: 2,
    taskType: 'L-WORD',
    dimension: '語音聽辨',
    question: '請聽語音，選出正確的字詞：',
    options: ['flame', 'flee', 'fly', 'float'],
    answer: 0,
    media: { audioText: 'flame' },
    explanation: '聽力語音為「flame（火焰）」，以子音群 fl- 開頭，母音 a_e 發音為 /eɪ/。'
  },
  {
    number: 3,
    taskType: 'L-SENT',
    dimension: '辨識句意',
    question: '請聽句子，選出橋樑長度相符的插圖：',
    options: ['選項 ① (569 公尺)', '選項 ② (597 公尺)', '選項 ③ (579 公尺)', '選項 ④ (759 公尺)'],
    answer: 2,
    image: '/assets/exam/saa/114/g6_q3.webp',
    media: { audioText: 'Narrator: The bridge is five hundred and seventy-nine meters long.' },
    explanation: '聽力句子為「The bridge is five hundred and seventy-nine meters long.（這座橋長 579 公尺）」，選項 ③ 相符。'
  },
  {
    number: 4,
    taskType: 'L-SENT',
    dimension: '辨識句意',
    question: '請聽句子，選出動作相符的插圖：',
    options: ['選項 ① (在陸地上跑步)', '選項 ② (在天空中飛行)', '選項 ③ (在廚房做菜)', '選項 ④ (水手在海上航行 The sailor sails the sea)'],
    answer: 3,
    image: '/assets/exam/saa/114/g6_q4.webp',
    media: { audioText: 'Narrator: The sailor sails the sea.' },
    explanation: '聽力句子為繞口令趣味句「The sailor sails the sea.（水手在海上航行）」，選項 ④ 插圖相符。'
  },
  {
    number: 5,
    taskType: 'L-SENT',
    dimension: '辨識句意',
    question: '請聽句子，選出家人外觀特徵相符的圖：',
    options: ['選項 ① (父親身材高大)', '選項 ② (母親身材瘦長)', '選項 ③ (父親身材矮小 short)', '選項 ④ (弟弟正在看書)'],
    answer: 2,
    image: '/assets/exam/saa/114/g6_q5.webp',
    media: { audioText: "Boy: He's my father. He's short." },
    explanation: '聽力敘述為「He\'s my father. He\'s short.（他是我爸爸，他身材矮小）」，選項 ③ 人物矮小相符。'
  },
  {
    number: 6,
    taskType: 'L-SENT',
    dimension: '辨識句意',
    question: '請聽句子，選出相符的情境插圖：',
    options: ['選項 ① (生氣怒吼)', '選項 ② (哭泣難過)', '選項 ③ (驚慌失措)', '選項 ④ (冷靜下來提供協助 Calm down. I can help you.)'],
    answer: 3,
    image: '/assets/exam/saa/114/g6_q6.webp',
    media: { audioText: 'Narrator: Calm down. I can help you.' },
    explanation: '聽力句子安撫對方說「Calm down. I can help you.（冷靜點，我可以幫你）」，選項 ④ 表情友善示意幫助相符。'
  },
  {
    number: 7,
    taskType: 'L-SENT',
    dimension: '辨識句意',
    question: '請聽句子，選出警告事項相符的圖：',
    options: ['選項 ① (小心山上有大熊 big bears in the mountains)', '選項 ② (小心湖裡有鱷魚)', '選項 ③ (小心森林有野狼)', '選項 ④ (小心樹上有猴子)'],
    answer: 0,
    image: '/assets/exam/saa/114/g6_q7.webp',
    media: { audioText: 'Narrator: Be careful. There are big bears in the mountains.' },
    explanation: '聽力提醒「Be careful. There are big bears in the mountains.（小心，山上有大熊）」，選項 ① 登山與大熊警示牌相符。'
  },
  {
    number: 8,
    taskType: 'L-SENT',
    dimension: '辨識句意',
    question: '請聽對話，選出天氣與活動相符的圖：',
    options: ['選項 ① (下雨天買雨傘)', '選項 ② (晴天颳風買風箏 sunny and windy, buy a kite)', '選項 ③ (下雪天堆雪人)', '選項 ④ (陰天在室內看電視)'],
    answer: 1,
    image: '/assets/exam/saa/114/g6_q8.webp',
    media: {
      audioText: "Boy: How's the weather?\nGirl: It's sunny and windy today. Let's buy a kite."
    },
    explanation: '對話指明天氣晴朗且有風（sunny and windy），提議買風箏去放（Let\'s buy a kite），選項 ② 相符。'
  },
  {
    number: 9,
    taskType: 'L-SENT',
    dimension: '辨識句意',
    question: '請聽敘述，選出假期相符的情境圖：',
    options: ['選項 ① (在英國參觀大笨鐘)', '選項 ② (在美國度過暑假 goes to the USA for summer vacation)', '選項 ③ (在日本看富士山)', '選項 ④ (在澳洲看袋鼠)'],
    answer: 1,
    image: '/assets/exam/saa/114/g6_q9.webp',
    media: {
      audioText: 'Narrator: Malina goes to the USA for summer vacation. She likes it there very much.'
    },
    explanation: '聽力內容為「Malina goes to the USA for summer vacation.（Malina 去美國放暑假）」，選項 ② 美國地標與自由女神相符。'
  },
  {
    number: 10,
    taskType: 'L-SENT',
    dimension: '辨識句意',
    question: '請聽對話，選出病痛部位相符的插圖：',
    options: ['選項 ① (腿部疼痛 My leg hurts)', '選項 ② (手臂疼痛)', '選項 ③ (頭痛發燒)', '選項 ④ (喉嚨痛)'],
    answer: 0,
    image: '/assets/exam/saa/114/g6_q10.webp',
    media: {
      audioText: "Girl: What's wrong?\nBoy: My leg hurts."
    },
    explanation: '男孩回答「My leg hurts.（我的腿好痛）」，選項 ① 摸著受傷的腿部相符。'
  },
  {
    number: 11,
    taskType: 'L-QA',
    dimension: '基本問答',
    question: '請聽問句，選出動物能力最適當的答覆：',
    options: ['It is flying.', 'It can jump.', 'Yes, it is good at swimming.', 'No, it can’t climb a tree.'],
    answer: 1,
    media: {
      audioText: 'Narrator: This is my rabbit. It is so cute. What can it do?'
    },
    explanation: '問句「What can it do?（兔子會做什麼能力？）」詢問能力，回答「It can jump.（牠會跳躍）」符合兔子天性與文法，故選 ②。'
  },
  {
    number: 12,
    taskType: 'L-QA',
    dimension: '基本問答',
    question: '請聽問句，選出日常社交最適當的回應：',
    options: ['Yes, it is. It’s a tiger.', 'No, it’s not a lion. It’s a tiger.', 'Thank you! The box is heavy.', 'Thank you. It’s Tuesday.'],
    answer: 2,
    media: {
      audioText: 'Narrator: You look tired. May I help you?'
    },
    explanation: '對方好心提議「May I help you?（我能幫忙你嗎？）」，合適回應為「Thank you! The box is heavy.（謝謝你！這個箱子好重）」，故選 ③。'
  },
  {
    number: 13,
    taskType: 'L-CONV',
    dimension: '言談理解',
    question: '請聽對話，選出何者敘述正確：',
    options: ['Jim is playing soccer now.', 'Jim doesn’t have his cap.', 'Pam is playing soccer now.', 'Pam has her cap now.'],
    answer: 2,
    media: {
      audioText: "Girl: Whose cap is this, Jim?\nJim: It's Pam's cap. She wears it when she plays soccer.\nGirl: Where is she now?\nJim: Oh no! Pam is playing soccer now, and she doesn't have her cap.\nNarrator: Which is true?"
    },
    explanation: '對話中 Jim 說明「Pam is playing soccer now, and she doesn\'t have her cap.（Pam 現在正在踢足球，而且她沒戴帽子）」，選項 ③「Pam is playing soccer now.」敘述正確。'
  },
  {
    number: 14,
    taskType: 'L-CONV',
    dimension: '言談理解',
    question: '請聽對話，回答所提出的問題：',
    options: ['It’s Monday.', 'Kevin is Andy’s classmate.', 'They need pencils for the art class.', 'Angela, Kevin, and Michael.'],
    answer: 3,
    media: {
      audioText: "Angela: Michael, do we have art class today?\nMichael: Yes, Angela. It's Monday. We need crayons for art class.\nAngela: How about the markers?\nMichael: I am not sure. Let's ask our classmate Kevin.\nNarrator: Who has art class on Monday?"
    },
    explanation: '對話由 Angela 與 Michael 對談，提及同班同學 Kevin，三人均在週一上美術課，故選 ④「Angela, Kevin, and Michael.」。'
  },
  {
    number: 15,
    taskType: 'L-CONV',
    dimension: '言談理解',
    question: '請聽短文廣播，回答 Wendy 現在應該做什麼：',
    options: [
      'Wendy should hide under the desk.',
      'Wendy should make a handmade gift.',
      'Wendy should help carry the presents.',
      'Wendy should do her homework.'
    ],
    answer: 2,
    media: {
      audioText: "Man: Wendy, it's Christmas! Stop sleeping under the Christmas tree. Please give me a hand. Help me carry these heavy presents to our living room.\nNarrator: What should Wendy do now?"
    },
    explanation: '說話者要求 Wendy「Please give me a hand. Help me carry these heavy presents to our living room.（幫我把這些沉重的禮物搬到客廳）」，故選 ③。'
  },
  {
    number: 16,
    taskType: 'R-COMP',
    dimension: '介系詞空間理解',
    question: 'My bag is under the desk.',
    options: ['選項 ① (書包在桌子上)', '選項 ② (書包在桌子下 under the desk)', '選項 ③ (書包在椅子旁)', '選項 ④ (書包在床上)'],
    answer: 1,
    image: '/assets/exam/saa/114/g6_q16.webp',
    explanation: '句子表達書包在書桌下方（under the desk），圖 ② 書包放置在書桌下完全相符，故選 ②。'
  },
  {
    number: 17,
    taskType: 'R-COMP',
    dimension: '地圖空間理解',
    question: 'The library is next to the bus station.',
    options: ['選項 ① (圖書館在郵局對面)', '選項 ② (圖書館在公園旁邊)', '選項 ③ (圖書館緊鄰公車站 next to the bus station)', '選項 ④ (圖書館在學校後面)'],
    answer: 2,
    image: '/assets/exam/saa/114/g6_q17.webp',
    explanation: '句子敘述「The library is next to the bus station.（圖書館在公車站旁邊）」，圖 ③ 圖書館與公車站相鄰相符，故選 ③。'
  },
  {
    number: 18,
    taskType: 'V-MEAN',
    dimension: '職業單字理解',
    question: '看圖選出職業名稱：',
    options: ['She’s a nurse.', 'She’s a doctor.', 'She’s a teacher.', 'She’s a student.'],
    answer: 1,
    image: '/assets/exam/saa/114/g6_q18.webp',
    explanation: '圖中人物戴聽診器正在為病人診察，為醫生（She\'s a doctor.），故選 ②。'
  },
  {
    number: 19,
    taskType: 'R-COMP',
    dimension: '動物數量計數理解',
    question: '看圖數一數，選出相符的句子：',
    options: [
      'There are two cats and three turtles.',
      'There are two dogs and a bird.',
      'There are five cats and two fish.',
      'There are three dogs and five fish.'
    ],
    answer: 3,
    image: '/assets/exam/saa/114/g6_q19.webp',
    explanation: '清點圖片中動物：有 3 隻狗（three dogs）以及魚缸中的 5 條魚（five fish），選項 ④ 正確。'
  },
  {
    number: 20,
    taskType: 'R-COMP',
    dimension: '生活物品歸屬理解',
    question: '看圖選出相符的描述句子：',
    options: ['I am thirsty.', 'It is seven thirty now.', 'That is Nancy’s water bottle.', 'Let’s find it together.'],
    answer: 3,
    image: '/assets/exam/saa/114/g6_q20.webp',
    explanation: '圖中兩位小朋友正在尋找水壺並相互指著桌子，表達「Let’s find it together.（我們一起來找找看吧）」，故選 ④。'
  },
  {
    number: 21,
    taskType: 'G-MC',
    dimension: '交通方式會話',
    question: 'A: How can I get to the zoo?\nB: _____________________________________________',
    options: ['You can go there after school.', 'You can take the MRT.', 'You can get some money.', 'You can see animals.'],
    answer: 1,
    explanation: '問句「How can I get to the zoo?（我該如何前往動物園？）」詢問搭乘之交通方式，回答「You can take the MRT.（你可以搭捷運）」最正確，故選 ②。'
  },
  {
    number: 22,
    taskType: 'G-MC',
    dimension: '文法與場所會話',
    question: 'Angela: Where are you going?\nAndy: ______________________________________ I want to buy some apples.',
    options: ['He is going to a supermarket.', 'Andy is going home.', 'I am going home.', 'I am going to a supermarket.'],
    answer: 3,
    explanation: '問句問「Where are you going?」，主詞為 you，答句主詞應為第一人稱「I am going to a supermarket.（我正要去超市買蘋果）」，故選 ④。'
  },
  {
    number: 23,
    taskType: 'R-COMP',
    dimension: '居家活動理解',
    question: '看圖選出正在書房做功課的正確敘述：',
    options: [
      'Ryan is doing his homework in the study.',
      'Lily is cooking in the kitchen.',
      'Ted is dancing in the living room.',
      'Judy is sleeping in the bedroom.'
    ],
    answer: 0,
    image: '/assets/exam/saa/114/g6_q23.webp',
    explanation: '圖中 Ryan 正坐在書房（in the study）的書桌前認真寫作業（doing his homework），選項 ① 完全吻合。'
  },
  {
    number: 24,
    taskType: 'G-MC',
    dimension: '空間問答會話',
    question: 'A: Where is my ball?\nB: ______________________________',
    options: ['It’s a chair.', 'It’s my pet.', 'It’s on the table.', 'It’s a ball.'],
    answer: 2,
    explanation: '問句「Where is my ball?（我的球在哪裡？）」詢問位置，回答介系詞片語「It\'s on the table.（它在桌子上）」，故選 ③。'
  },
  {
    number: 25,
    taskType: 'G-MC',
    dimension: '放學休閒會話',
    question: 'A: What do you do after school?\nB: _____________________________',
    options: ['I like bananas.', 'I am from Taiwan.', 'I go jogging.', 'I get up at 6:30.'],
    answer: 2,
    explanation: '問句「What do you do after school?（你放學後都做什麼活動？）」詢問課後作息，回答「I go jogging.（我去慢跑運動）」符合活動邏輯，故選 ③。'
  },
  {
    number: 26,
    taskType: 'G-MC',
    dimension: '助動詞時態文法',
    question: 'A: _______________________________________________\nB: Yes, he does.',
    options: ['Does he go to school by train?', 'What does a horse say?', 'Where is he going?', 'Who does he call after school?'],
    answer: 0,
    explanation: '答句為「Yes, he does.」簡答，原疑問句必須為以助動詞 Does 開頭的 Yes/No 問句，故選 ①「Does he go to school by train?」。'
  },
  {
    number: 27,
    taskType: 'R-COMP',
    dimension: '食物點餐會話理解',
    question: 'A: Do you want some noodles?\nB: Yes, I do. I want a cake and some orange juice, too.',
    options: ['選項 ① (披薩、熱狗與可樂)', '選項 ② (麵條、蛋糕與柳橙汁)', '選項 ③ (漢堡、三明治與牛奶)', '選項 ④ (米飯、魚與水)'],
    answer: 1,
    image: '/assets/exam/saa/114/g6_q27.webp',
    explanation: '對話要求吃麵（noodles）、蛋糕（cake）與柳橙汁（orange juice），圖 ② 食物組合完全吻合，故選 ②。'
  },
  {
    number: 28,
    taskType: 'R-COMP',
    dimension: '身體症狀否定推理',
    question: 'What is “NOT” in the picture?',
    options: ['a headache', 'a fever', 'a sore throat', 'a stomachache'],
    answer: 3,
    image: '/assets/exam/saa/114/g6_q28.webp',
    explanation: '圖中出現頭痛（headache）、發燒（fever）與喉嚨痛（sore throat），唯獨沒有胃痛/肚子痛（stomachache），題目問 NOT，故選 ④。'
  },
  {
    number: 29,
    taskType: 'R-COMP',
    dimension: '節慶圖象辨識',
    question: '看圖選出相符的節慶名稱：',
    options: ['It is Mother’s Day.', 'It is Halloween.', 'It is Moon Festival.', 'It is Easter.'],
    answer: 0,
    image: '/assets/exam/saa/114/g6_q29.webp',
    explanation: '圖中孩子手捧康乃馨花束與禮物送給微笑的母親，表達母親節（Mother\'s Day），故選 ①。'
  },
  {
    number: 30,
    taskType: 'G-MC',
    dimension: '節慶文化情境',
    question: 'January 1st is New Year’s Day. What can we do to celebrate (慶祝) New Year?',
    options: ['We can color eggs.', 'We can go trick-or-treating.', 'We can eat turkey and potatoes.', 'We can watch fireworks.'],
    answer: 3,
    image: '/assets/exam/saa/114/g6_q30.webp',
    explanation: '1 月 1 日元旦新年（New Year\'s Day），跨年最經典的慶祝活動是欣賞璀璨煙火秀（watch fireworks），故選 ④。'
  },
  {
    number: 31,
    taskType: 'R-COMP',
    dimension: '篇章理解題組',
    groupId: 'saa-114-g6-sofa',
    passage: {
      title: '【商品評論網】Online Sofa Reviews',
      text: "★★☆☆☆ August 17, 2024\nKaren: Very bad sofa. It’s hard and it makes my back hurt. Don’t buy it!\n★★★★★ June 16, 2024\nJudy: Super nice and pretty! I like to watch TV with my cat together on the sofa.\n★★★★★ May 19, 2024\nSead: Now I don’t want to leave home!"
    },
    image: '/assets/exam/saa/114/g6_q31_review.webp',
    question: 'What can you buy on the website (網站)?',
    options: ['We can buy clothes.', 'We can buy fish.', 'We can buy desks.', 'We can buy bubble tea.'],
    answer: 2,
    explanation: '該購物網站為居家家具類專賣網，販售沙發、書桌（desks）等家具，故選 ③。'
  },
  {
    number: 32,
    taskType: 'R-COMP',
    dimension: '篇章理解題組',
    groupId: 'saa-114-g6-sofa',
    passage: {
      title: '【商品評論網】Online Sofa Reviews',
      text: "★★☆☆☆ August 17, 2024\nKaren: Very bad sofa. It’s hard and it makes my back hurt. Don’t buy it!\n★★★★★ June 16, 2024\nJudy: Super nice and pretty! I like to watch TV with my cat together on the sofa.\n★★★★★ May 19, 2024\nSead: Now I don’t want to leave home!"
    },
    image: '/assets/exam/saa/114/g6_q31_review.webp',
    question: 'How much is the sofa?',
    options: ['It’s ten thousand dollars.', 'It’s eight thousand dollars.', 'It’s four thousand dollars.', 'It’s two thousand dollars.'],
    answer: 1,
    explanation: '商品圖標示沙發價格為 $8,000 元（eight thousand dollars），故選 ②。'
  },
  {
    number: 33,
    taskType: 'R-COMP',
    dimension: '篇章理解題組',
    groupId: 'saa-114-g6-sofa',
    passage: {
      title: '【商品評論網】Online Sofa Reviews',
      text: "★★☆☆☆ August 17, 2024\nKaren: Very bad sofa. It’s hard and it makes my back hurt. Don’t buy it!\n★★★★★ June 16, 2024\nJudy: Super nice and pretty! I like to watch TV with my cat together on the sofa.\n★★★★★ May 19, 2024\nSead: Now I don’t want to leave home!"
    },
    image: '/assets/exam/saa/114/g6_q31_review.webp',
    question: 'Which (哪一個) is true?',
    options: ['Judy doesn’t like to watch TV.', 'Sead thinks the sofa is hard.', 'Judy and Sead have a cat.', 'Karen doesn’t like the sofa.'],
    answer: 3,
    explanation: 'Karen 評分兩顆星並留下負評「Very bad sofa... Don\'t buy it!」，可知 Karen 不喜歡這張沙發（Karen doesn’t like the sofa.），選項 ④ 正確。'
  },
  {
    number: 34,
    taskType: 'R-COMP',
    dimension: '篇章理解題組',
    groupId: 'saa-114-g6-diary',
    passage: {
      title: '【生活閱讀日記】Toby’s Diary',
      text: "Today, I go to school by bike at 8:00. I have lunch with my friend, Jan. Jan eats fish, and I have a hamburger. Jan does not do her math homework, and the teacher is very mad at her. The teacher says, “You have no class break today!”\nJan and I go jogging together after school. Jan is very good in PE class. I can help her with math, and she helps me with PE."
    },
    image: '/assets/exam/saa/114/g6_q34_diary.webp',
    question: 'What is “mad” in the diary?',
    options: ['angry', 'happy', 'thirsty', 'hungry'],
    answer: 0,
    explanation: '文中 Jan 沒寫數學功課，老師對她非常生氣說「You have no class break today!」，mad 等同於生氣「angry」，故選 ①。'
  },
  {
    number: 35,
    taskType: 'R-COMP',
    dimension: '篇章理解題組',
    groupId: 'saa-114-g6-diary',
    passage: {
      title: '【生活閱讀日記】Toby’s Diary',
      text: "Today, I go to school by bike at 8:00. I have lunch with my friend, Jan. Jan eats fish, and I have a hamburger. Jan does not do her math homework, and the teacher is very mad at her. The teacher says, “You have no class break today!”\nJan and I go jogging together after school. Jan is very good in PE class. I can help her with math, and she helps me with PE."
    },
    image: '/assets/exam/saa/114/g6_q34_diary.webp',
    question: 'Which (哪一個) is true?',
    options: ['Toby goes to school by bike.', 'Toby is mad at Jan.', 'Jan is good at math.', 'A dog eats Jan\'s homework.'],
    answer: 0,
    explanation: '日記開頭第一句清楚寫道「Today, I go to school by bike at 8:00.（今天我八點騎自行車去上學）」，選項 ① 正確。'
  }
];

function generateGradeFile(year, grade, rawQuestions, filename) {
  const finalQuestions = rawQuestions.map(q => {
    const numPadded = String(q.number).padStart(2, '0');
    const isListening = q.number <= 15;
    return {
      id: `saa-${year}-g${grade}-${numPadded}`,
      year,
      grade,
      targetGrade: grade,
      book: grade,
      unit: `${year} 年國小${grade === 4 ? '四' : (grade === 5 ? '五' : '六')}年級學力檢測`,
      section: isListening ? 'listening' : 'reading',
      track: 'ministry-assessment',
      preserveOptionOrder: true,
      reviewed: true,
      number: q.number,
      taskType: q.taskType,
      dimension: q.dimension,
      ...(q.groupId ? { groupId: q.groupId } : {}),
      ...(q.passage ? { passage: q.passage } : {}),
      ...(q.image ? { image: q.image } : {}),
      question: q.question,
      options: q.options,
      answer: q.answer,
      ...(q.media ? { media: q.media } : {}),
      explanation: q.explanation
    };
  });

  const content = `export const SAA_${year}_G${grade}_QUESTIONS = ${JSON.stringify(finalQuestions, null, 2)};\n`;
  fs.writeFileSync(path.join(outDir, filename), content, 'utf-8');
  console.log(`✓ Generated ${filename} (${finalQuestions.length} questions)`);
}

generateGradeFile(114, 4, g4Questions, 'saa114G4.js');
generateGradeFile(114, 5, g5Questions, 'saa114G5.js');
generateGradeFile(114, 6, g6Questions, 'saa114G6.js');
