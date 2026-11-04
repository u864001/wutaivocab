import fs from 'fs';
import path from 'path';

const outDir = path.resolve('src/data/exam/saa');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// --------------------------------------------------------------------------
// GRADE 4 (115) - 35 Questions
// --------------------------------------------------------------------------
const g4Raw = [
  {
    number: 1,
    taskType: 'A-SOUND',
    dimension: '語音聽辨',
    question: '請聽語音，選出正確的字詞：',
    options: ['pet', 'pit', 'bet', 'bit'],
    answer: 0,
    media: { audioText: 'pet' },
    explanation: '聽力語音為「pet」，發音為短母音 /e/，以字母 p 開頭。'
  },
  {
    number: 2,
    taskType: 'A-SOUND',
    dimension: '語音聽辨',
    question: '請聽語音，選出正確的拼字：',
    options: ['Bulbasaur', 'Dulbesour', 'Duldasaur', 'Buldesour'],
    answer: 0,
    media: { audioText: 'Bulbasaur' },
    explanation: '聽力語音為寶可夢經典角色「Bulbasaur（妙蛙種子）」，正確拼字開頭為 B-u-l-b-a-s-a-u-r。'
  },
  {
    number: 3,
    taskType: 'A-SOUND',
    dimension: '語音聽辨',
    question: '請聽語音，選出正確的字詞：',
    options: ['cloud', 'glue', 'club', 'globe'],
    answer: 2,
    media: { audioText: 'club' },
    explanation: '聽力語音為「club」，以 /kl/ 子音群開頭，短母音 /ʌ/。'
  },
  {
    number: 4,
    taskType: 'A-SOUND',
    dimension: '語音聽辨',
    question: '請聽語音，選出正確的名字：',
    options: ['Dabby', 'Betty', 'Daddy', 'Brady'],
    answer: 1,
    media: { audioText: 'Betty' },
    explanation: '聽力語音為女孩名字「Betty」，以字母 B 開頭。'
  },
  {
    number: 5,
    taskType: 'L-WORD',
    dimension: '辭彙聽辨',
    question: '請聽語音，選出正確的單字：',
    options: ['Huntrix', 'hangry', 'hanger', 'hungry'],
    answer: 3,
    media: { audioText: 'hungry' },
    explanation: '聽力單字為「hungry」，意為肚子餓。'
  },
  {
    number: 6,
    taskType: 'L-WORD',
    dimension: '辭彙聽辨',
    question: '請看圖並聽語音，選出最相符的圖片：',
    options: ['圖片 ① (肚子餓)', '圖片 ② (難過)', '圖片 ③ (生氣)', '圖片 ④ (開心跑步)'],
    answer: 2,
    image: '/assets/exam/saa/115/g4_q6.webp',
    media: { audioText: 'The boy is angry.' },
    explanation: '音檔描述「The boy is angry.（男孩很生氣）」，圖片 ③ 男孩握拳皺眉表情生氣，故選 ③。'
  },
  {
    number: 7,
    taskType: 'L-WORD',
    dimension: '辭彙聽辨',
    question: '請看點菜單並聽語音，選出正確的點餐單：',
    options: ['點菜單 ①', '點菜單 ②', '點菜單 ③', '點菜單 ④'],
    answer: 2,
    image: '/assets/exam/saa/115/g4_q7.webp',
    media: { audioText: 'Table 12. We want noodles, pizza, and water, please.' },
    explanation: '聽力內容「Table 12. We want noodles, pizza, and water, please.」，點菜單 ③ 正確勾選了 12 桌與麵條、披薩、水，故選 ③。'
  },
  {
    number: 8,
    taskType: 'L-WORD',
    dimension: '辭彙聽辨',
    question: '請看超市收據並聽語音，選出正確的收據：',
    options: ['收據 ①', '收據 ②', '收據 ③', '收據 ④'],
    answer: 1,
    image: '/assets/exam/saa/115/g4_q8.webp',
    media: { audioText: 'The pumpkin is fifty, watermelon is one hundred, and sandwich is thirty. The total is one hundred and eighty.' },
    explanation: '聽力內容提及南瓜 50、西瓜 100、三明治 30，總計 180 元，收據 ② 標價與總額完全相符，故選 ②。'
  },
  {
    number: 9,
    taskType: 'L-SENT',
    dimension: '教室生活辭句理解',
    question: '請看圖並聽語音，選出正確的情境圖片：',
    options: ['圖片 ① (趕校車)', '圖片 ② (丟球)', '圖片 ③ (兩人站立)', '圖片 ④ (兩人聊天微笑)'],
    answer: 3,
    image: '/assets/exam/saa/115/g4_q9.webp',
    media: { audioText: 'The boy and girl are talking happily.' },
    explanation: '聽力情境「The boy and girl are talking happily.（男孩與女孩正開心地交談）」，圖片 ④ 兩人面對面聊天微笑，故選 ④。'
  },
  {
    number: 10,
    taskType: 'L-SENT',
    dimension: '教室生活辭句理解',
    question: '請看圖並聽語音，選出正確的課堂情境：',
    options: ['圖片 ① (黑板寫 apple)', '圖片 ② (剪刀割手喊 Ouch!)', '圖片 ③ (實驗喊 Wow!)', '圖片 ④ (老師點頭說 OK)'],
    answer: 3,
    image: '/assets/exam/saa/115/g4_q10.webp',
    media: { audioText: 'The teacher says OK to the student.' },
    explanation: '聽力內容「The teacher says OK to the student.（老師對學生說 OK）」，圖片 ④ 老師微笑對學生比 OK 手勢，故選 ④。'
  },
  {
    number: 11,
    taskType: 'L-SENT',
    dimension: '教室生活辭句理解',
    question: '請看氣溫與穿著並聽語音，選出相符的圖片：',
    options: ['圖片 ① (30°C 扇扇子)', '圖片 ② (40°C 擦汗)', '圖片 ③ (20°C 穿外套)', '圖片 ④ (12°C 穿羽絨大衣)'],
    answer: 2,
    image: '/assets/exam/saa/115/g4_q11.webp',
    media: { audioText: 'It is twenty degrees. He is wearing a jacket.' },
    explanation: '聽力內容「It is twenty degrees. He is wearing a jacket.（現在二十度，他穿著外套）」，圖片 ③ 溫度計顯示 20°C 且穿著外套，故選 ③。'
  },
  {
    number: 12,
    taskType: 'L-SENT',
    dimension: '教室生活辭句理解',
    question: '請聽問句，選出最適當的回應句子：',
    options: ['I can dance.', "I'm fine. Thank you.", "I'm a student.", "I'm seven years old."],
    answer: 3,
    media: { audioText: 'How old are you, little girl?' },
    explanation: '問句「How old are you, little girl?（小女孩你幾歲？）」，回答年齡為「I’m seven years old.（我七歲）」，故選 ④。'
  },
  {
    number: 13,
    taskType: 'L-SENT',
    dimension: '教室生活辭句理解',
    question: '請看圖並聽語音，選出玩具機器人位置正確的房間：',
    options: ['房間 ① (書桌底下)', '房間 ② (書桌上方)', '房間 ③ (床上)', '房間 ④ (床底下)'],
    answer: 0,
    image: '/assets/exam/saa/115/g4_q13.webp',
    media: { audioText: 'The toy robot is under the desk.' },
    explanation: '聽力內容「The toy robot is under the desk.（玩具機器人在書桌底下）」，房間 ① 中機器人位於書桌下方，故選 ①。'
  },
  {
    number: 14,
    taskType: 'L-CONV',
    dimension: '文化節慶理解',
    question: '請看時鐘與客廳情境並聽語音對話，選出正確的圖片：',
    options: ['圖片 ① (4:05 玩桌遊)', '圖片 ② (4:05 看電視)', '圖片 ③ (4:50 看電視)', '圖片 ④ (4:50 玩桌遊)'],
    answer: 2,
    image: '/assets/exam/saa/115/g4_q14.webp',
    media: { audioText: 'Girl: What time is it now? Boy: It is ten to five. Let’s watch TV.' },
    explanation: '對話提到「It is ten to five (差十分五點，即 4:50). Let’s watch TV.」，圖片 ③ 時鐘指在 4:50 且正在看電視，故選 ③。'
  },
  {
    number: 15,
    taskType: 'L-CONV',
    dimension: '文化節慶理解',
    question: '請看節慶裝扮並聽語音對話，選出正確的節慶圖片：',
    options: ['圖片 ① (三個小女巫提糖果袋)', '圖片 ② (復活節小兔提籃)', '圖片 ③ (幽靈、骷髏與小孩)', '圖片 ④ (聖誕樹合照)'],
    answer: 0,
    image: '/assets/exam/saa/115/g4_q15.webp',
    media: { audioText: 'Look at the three little witches with broomsticks and candy bags! Happy Halloween!' },
    explanation: '對話中讚美「three little witches with broomsticks and candy bags! Happy Halloween!」，圖片 ① 為三位騎掃帚提糖果袋的小女巫，故選 ①。'
  },
  {
    number: 16,
    taskType: 'V-MEAN',
    dimension: '字詞辨識',
    question: '選出正確相對應的大寫字母：rhinoceros',
    options: ['RMINOCEROS', 'RNIHOCEROS', 'RHLNOCEROS', 'RHINOCEROS'],
    answer: 3,
    explanation: '單字「rhinoceros（犀牛）」對應之全大寫字母為「RHINOCEROS」，留意 H 與 I 的順序，故選 ④。'
  },
  {
    number: 17,
    taskType: 'V-MEAN',
    dimension: '字詞辨識',
    question: '看棒球衣上的大寫單字「DODGERS」，選出正確相對應的小寫字母：',
    options: ['dobjers', 'dobgers', 'dodjers', 'dodgers'],
    answer: 3,
    image: '/assets/exam/saa/115/g4_q17.webp',
    explanation: '球衣上為「DODGERS」，全小寫字母為「dodgers」，注意字母 d、g、b 之辨識，故選 ④。'
  },
  {
    number: 18,
    taskType: 'V-MEAN',
    dimension: '字詞辨識',
    question: '依文字「three erasers and five pencils」選出數量正確的文具圖片：',
    options: ['圖片 ① (3 支筆、5 塊橡皮擦)', '圖片 ② (5 支筆、3 塊橡皮擦)', '圖片 ③ (3 支筆、5 塊迴紋針)', '圖片 ④ (5 支筆、3 把尺)'],
    answer: 1,
    image: '/assets/exam/saa/115/g4_q18.webp',
    explanation: '文字為「three erasers and five pencils（3 塊橡皮擦與 5 支鉛筆）」，圖片 ② 數量與品項完全相符，故選 ②。'
  },
  {
    number: 19,
    taskType: 'V-MEAN',
    dimension: '字詞辨識',
    question: '觀察門牌號碼規律 18、20、22、?、26，選出問號處房子的英文號碼：',
    options: ['twenty-four', 'thirty-four', 'thirty-five', 'twenty-five'],
    answer: 0,
    image: '/assets/exam/saa/115/g4_q19.webp',
    explanation: '門牌規律為雙數遞增 18、20、22、(24)、26，24 的英文為 twenty-four，故選 ①。'
  },
  {
    number: 20,
    taskType: 'V-MEAN',
    dimension: '字詞辨識',
    question: '看色相環顏色規律，Yellow 與 Blue 調和後在問號處的顏色是：',
    options: ['grain', 'green', 'grin', 'great'],
    answer: 1,
    image: '/assets/exam/saa/115/g4_q20.webp',
    explanation: '黃色（Yellow）與藍色（Blue）混合後的顏色為綠色「green」，故選 ②。'
  },
  {
    number: 21,
    taskType: 'V-MEAN',
    dimension: '字詞辨識',
    question: '依文字「sandwich, banana, and milk」選出正確的餐盤：',
    options: ['餐盤 ① (三明治、香蕉、牛奶)', '餐盤 ② (麵條、西瓜、牛奶)', '餐盤 ③ (漢堡、蘋果、牛奶)', '餐盤 ④ (披薩、檸檬、牛奶)'],
    answer: 0,
    image: '/assets/exam/saa/115/g4_q21.webp',
    explanation: '餐盤食物為三明治（sandwich）、香蕉（banana）與牛奶（milk），餐盤 ① 完全吻合，故選 ①。'
  },
  {
    number: 22,
    taskType: 'V-MEAN',
    dimension: '字詞辨識',
    question: '依單字「a driver」選出符合職業的圖片：',
    options: ['職業 ① (廚師)', '職業 ② (學生)', '職業 ③ (計程車司機)', '職業 ④ (老師)'],
    answer: 2,
    image: '/assets/exam/saa/115/g4_q22.webp',
    explanation: '單字「a driver」意為駕駛、司機，圖片 ③ 為手握方向盤的計程車司機，故選 ③。'
  },
  {
    number: 23,
    taskType: 'V-MEAN',
    dimension: '字詞辨識',
    question: '依單字「cloudy」選出符合天氣的圖片：',
    options: ['天氣 ① (刮風吹樹)', '天氣 ② (多雲陰天)', '天氣 ③ (大太陽晴天)', '天氣 ④ (下雨撐傘)'],
    answer: 1,
    image: '/assets/exam/saa/115/g4_q23.webp',
    explanation: '單字「cloudy」意為多雲陰天的，圖片 ② 為雲朵圖示，故選 ②。'
  },
  {
    number: 24,
    taskType: 'G-MC',
    dimension: '句子理解',
    question: 'It’s eleven forty. Let’s have lunch.（看圖選出時間與情境正確的圖片）：',
    options: ['圖片 ① (時間 11:14，吃午餐)', '圖片 ② (時間 11:14，拿筆說話)', '圖片 ③ (時間 11:40，拿筆說話)', '圖片 ④ (時間 11:40，吃午餐)'],
    answer: 3,
    image: '/assets/exam/saa/115/g4_q24.webp',
    explanation: '句子意為「現在十一點四十。我們吃午餐吧。」，圖片 ④ 時鐘顯示 11:40 且正在吃午餐，故選 ④。'
  },
  {
    number: 25,
    taskType: 'G-MC',
    dimension: '句子理解',
    question: 'He is cool. Is he your brother?',
    options: [
      "No, she’s not. She’s my sister.",
      "No, he’s not. He’s my teacher.",
      "No, she’s not. She has a marker.",
      "No, he’s not. He’s tired."
    ],
    answer: 1,
    explanation: '問句主詞為男性 he（Is he your brother?），回答應使用代名詞 he；否定答句並說明身分「No, he’s not. He’s my teacher.」，故選 ②。'
  },
  {
    number: 26,
    taskType: 'G-MC',
    dimension: '句子理解',
    question: '看動物喜好評分表（獅子微笑、猴子難過、斑馬微笑），選出正確敘述：',
    options: [
      'I like lions and monkeys.',
      'I like lions and horses.',
      'I like tigers and zebras.',
      'I don’t like monkeys.'
    ],
    answer: 3,
    image: '/assets/exam/saa/115/g4_q26.webp',
    explanation: '評分表中猴子下方為哭臉圖案，代表不喜歡猴子，正確敘述為「I don’t like monkeys.」，故選 ④。'
  },
  {
    number: 27,
    taskType: 'G-MC',
    dimension: '句子理解',
    question: 'A: _________________________________________\nB: Yes, I am. Can I have some water?\nA: Sure.',
    options: [
      'I am thirsty.',
      'Are you thirsty?',
      'Can you spell “water”?',
      'I want some water.'
    ],
    answer: 1,
    explanation: '答句為「Yes, I am. Can I have some water?（是的我是。我可以喝點水嗎？）」，問句應為 Are you 疑問句，故選 ②「Are you thirsty?」。'
  },
  {
    number: 28,
    taskType: 'G-CTX',
    dimension: '文化節慶理解',
    question: '看圖中對話「Look! It’s so round and big. Happy ______!」，選出所代表的節慶：',
    options: [
      'Mother’s Day',
      'Moon Festival',
      'Halloween',
      'Dragon Boat Festival'
    ],
    answer: 1,
    image: '/assets/exam/saa/115/g4_q28.webp',
    explanation: '看著又圓又大的月亮讚美「Look! It’s so round and big.」，對應的節慶為中秋節「Moon Festival」，故選 ②。'
  },
  {
    number: 29,
    taskType: 'G-CTX',
    dimension: '文化節慶理解',
    question: 'A: Mom, the _________ tree is beautiful.\nB: Yes, it is. Let’s open the gifts. Merry ________.',
    options: ['Halloween', 'Easter', 'Dragon', 'Christmas'],
    answer: 3,
    explanation: '聖誕樹為「Christmas tree」，祝福語為「Merry Christmas」，故選 ④。'
  },
  {
    number: 30,
    taskType: 'R-COMP',
    dimension: '句子理解',
    groupId: 'saa-115-g4-picnic',
    passage: {
      title: '【生活閱讀】Picnic (野餐) Day',
      text: 'My name is Jack. Today is my birthday! I’m twelve years old now.\nIt’s sunny today. Dad, Mom, and I are having a picnic (野餐) in the park. We have some fruits and an orange cake.\nWe are sitting under a big tree. I see a dog and two birds. The dog is running. The birds are singing in the trees.'
    },
    question: 'Which (哪一個) is Jack’s cake?',
    options: ['蛋糕 ① (11 歲草莓)', '蛋糕 ② (11 歲橘子片)', '蛋糕 ③ (12 歲橘子片)', '蛋糕 ④ (12 歲草莓)'],
    answer: 2,
    image: '/assets/exam/saa/115/g4_q30.webp',
    explanation: '文中提到「I’m twelve years old now... We have an orange cake.」，Jack 滿 12 歲且蛋糕為橘子蛋糕，對應圖片 ③，故選 ③。'
  },
  {
    number: 31,
    taskType: 'R-COMP',
    dimension: '句子理解',
    groupId: 'saa-115-g4-picnic',
    passage: {
      title: '【生活閱讀】Picnic (野餐) Day',
      text: 'My name is Jack. Today is my birthday! I’m twelve years old now.\nIt’s sunny today. Dad, Mom, and I are having a picnic (野餐) in the park. We have some fruits and an orange cake.\nWe are sitting under a big tree. I see a dog and two birds. The dog is running. The birds are singing in the trees.'
    },
    question: 'What do they have at the picnic?',
    options: [
      'apples, bananas, and a cake',
      'pizza, noodles, and some juice',
      'hot dogs, hamburgers, and ice cream',
      'guavas, papayas, and sandwiches'
    ],
    answer: 0,
    explanation: '文中指出「We have some fruits and an orange cake.」，選項 ① 中的 apples（蘋果）與 bananas（香蕉）均為水果（fruits），與蛋糕相符，故選 ①。'
  },
  {
    number: 32,
    taskType: 'R-COMP',
    dimension: '句子理解',
    groupId: 'saa-115-g4-schedule',
    passage: {
      title: '【行程表閱讀】Activity Schedule',
      text: '時間表行程：\n10:15 AM - Gina 在房間看書 (Reading)\n12:30 PM - Tony 與 Gina 在餐廳吃午餐\n2:25 PM - Gina 上舞蹈課 (Dancing class) / Tony 上游泳課 (Swimming class)\n4:40 PM - 回家時間 (Time to go home!)'
    },
    image: '/assets/exam/saa/115/g4_q32_passage.webp',
    question: 'Look at Gina. What time is it?',
    options: [
      'It’s ten fifteen.',
      'It’s ten fifty.',
      'It’s four forty.',
      'It’s two twenty-five.'
    ],
    answer: 0,
    explanation: '看題目插圖中 Gina 正在房間閱讀「Reading」，對應行程表時間為 10:15 AM「It’s ten fifteen.」，故選 ①。'
  },
  {
    number: 33,
    taskType: 'R-COMP',
    dimension: '句子理解',
    groupId: 'saa-115-g4-schedule',
    passage: {
      title: '【行程表閱讀】Activity Schedule',
      text: '時間表行程：\n10:15 AM - Gina 在房間看書 (Reading)\n12:30 PM - Tony 與 Gina 在餐廳吃午餐\n2:25 PM - Gina 上舞蹈課 (Dancing class) / Tony 上游泳課 (Swimming class)\n4:40 PM - 回家時間 (Time to go home!)'
    },
    image: '/assets/exam/saa/115/g4_q32_passage.webp',
    question: 'Which (哪一個) is “NOT” true?',
    options: [
      'Tony and Gina have lunch in the dining room.',
      'Tony can swim.',
      'They go home at four thirty.',
      'Gina is reading in the bedroom.'
    ],
    answer: 2,
    explanation: '時間表載明「4:40 PM - Time to go home!」，回家時間是四點四十而非四點半（four thirty），故選項 ③ 為錯誤敘述。'
  },
  {
    number: 34,
    taskType: 'R-COMP',
    dimension: '句子理解',
    groupId: 'saa-115-g4-breakfast',
    passage: {
      title: '【生活閱讀】Birthday Breakfast (早餐)',
      text: 'Lara: Good morning, Mom.\nAshley: Good morning, Lara. Do you want some eggs for breakfast?\nLara: Yes, please. I want some bread and juice, too.\nAshley: Here you go. It’s hot!\nLara: They’re yummy, Mom. I like the egg. But it’s red.\nAshley: It’s your birthday! We have red eggs on your birthday!\nLara: Thanks, Mom!'
    },
    question: 'What color is the egg?',
    options: ['It’s red.', 'It’s yummy.', 'It’s your birthday!', 'It’s hot!'],
    answer: 0,
    explanation: '文中 Lara 說「I like the egg. But it’s red.」Mom 回應「We have red eggs on your birthday!」，蛋的顏色為紅色「It’s red.」，故選 ①。'
  },
  {
    number: 35,
    taskType: 'R-COMP',
    dimension: '句子理解',
    groupId: 'saa-115-g4-breakfast',
    passage: {
      title: '【生活閱讀】Birthday Breakfast (早餐)',
      text: 'Lara: Good morning, Mom.\nAshley: Good morning, Lara. Do you want some eggs for breakfast?\nLara: Yes, please. I want some bread and juice, too.\nAshley: Here you go. It’s hot!\nLara: They’re yummy, Mom. I like the egg. But it’s red.\nAshley: It’s your birthday! We have red eggs on your birthday!\nLara: Thanks, Mom!'
    },
    question: 'What are they eating?',
    options: [
      '選項 ① (麵條、蛋、牛奶)',
      '選項 ② (法國麵包、紅蛋、果汁牛奶)',
      '選項 ③ (漢堡、水煮蛋、牛奶)',
      '選項 ④ (法國麵包、白蛋、果汁牛奶)'
    ],
    answer: 1,
    image: '/assets/exam/saa/115/g4_q35.webp',
    explanation: '文中早餐包括 bread（麵包）、juice（果汁）與 red eggs（紅蛋），選項 ② 的組合完全相符，故選 ②。'
  }
];

// --------------------------------------------------------------------------
// GRADE 5 (115) - 35 Questions
// --------------------------------------------------------------------------
const g5Raw = [
  {
    number: 1,
    taskType: 'A-SOUND',
    dimension: '語音聽辨',
    question: '請聽語音，選出正確的字詞：',
    options: ['were', 'wife', 'wove', 'wave'],
    answer: 3,
    media: { audioText: 'wave' },
    explanation: '聽力語音為「wave」，母音發長母音 /eɪ/。'
  },
  {
    number: 2,
    taskType: 'A-SOUND',
    dimension: '語音聽辨',
    question: '請聽語音，選出正確的名字：',
    options: ['micro', 'Nicole', 'Michael', 'near'],
    answer: 1,
    media: { audioText: 'Nicole' },
    explanation: '聽力語音為女子名字「Nicole」，重音在第二音節。'
  },
  {
    number: 3,
    taskType: 'L-WORD',
    dimension: '辭彙聽辨',
    question: '請看圖並聽語音，選出最相符的季節與天氣圖片：',
    options: ['圖片 ① (冬天下雪寒冷)', '圖片 ② (秋天涼爽吹風)', '圖片 ③ (春天溫暖坐長椅)', '圖片 ④ (夏天炎熱遮陽流汗)'],
    answer: 3,
    image: '/assets/exam/saa/115/g5_q3.webp',
    media: { audioText: 'It is hot and sunny in summer.' },
    explanation: '聽力語音「It is hot and sunny in summer.（夏天炎熱又晴朗）」，圖片 ④ 男子戴遮陽帽揮汗且氣溫高，故選 ④。'
  },
  {
    number: 4,
    taskType: 'L-WORD',
    dimension: '辭彙聽辨',
    question: '請看圖並聽語音，選出正確的物品圖片：',
    options: ['圖片 ① (書本)', '圖片 ② (電腦螢幕)', '圖片 ③ (紙箱)', '圖片 ④ (尺)'],
    answer: 3,
    image: '/assets/exam/saa/115/g5_q4.webp',
    media: { audioText: 'ruler' },
    explanation: '聽力單字為「ruler（直尺）」，圖片 ④ 為刻度尺，故選 ④。'
  },
  {
    number: 5,
    taskType: 'L-WORD',
    dimension: '辭彙聽辨',
    question: '請聽語音，選出正確的句子：',
    options: [
      'Grandpa loves his brother.',
      'Grandma loves her brother.',
      'Grandpa loves his sister.',
      'Grandma loves her sister.'
    ],
    answer: 3,
    media: { audioText: 'Grandma loves her sister.' },
    explanation: '聽力整句為「Grandma loves her sister.（祖母愛她的姊妹）」，注意 Grandma 與 her sister 之辨識。'
  },
  {
    number: 6,
    taskType: 'L-WORD',
    dimension: '辭彙聽辨',
    question: '請看街道建築並聽語音，選出正確的建築位置：',
    options: ['建築 ① (Green St 上的 Bank 銀行)', '建築 ② (Black St 上的書店)', '建築 ③ (White St 上的書店)', '建築 ④ (Red St 上的郵局)'],
    answer: 0,
    image: '/assets/exam/saa/115/g5_q6.webp',
    media: { audioText: 'The bank is on Green Street.' },
    explanation: '聽力內容「The bank is on Green Street.（銀行在綠街上）」，建築 ① 門楣標示 $ 符號為銀行且位於 Green St，故選 ①。'
  },
  {
    number: 7,
    taskType: 'L-SENT',
    dimension: '教室生活辭句理解與回應',
    question: '請看圖並聽語音，選出遺失物品地點正確的圖片：',
    options: ['地點 ① (動物園門口掉書)', '地點 ② (美術館地上掉鑰匙)', '地點 ③ (餐廳桌上掉背包)', '地點 ④ (公園遊戲區地上掉手錶)'],
    answer: 3,
    image: '/assets/exam/saa/115/g5_q7.webp',
    media: { audioText: 'I lost my watch at the park.' },
    explanation: '聽力內容「I lost my watch at the park.（我在公園弄丟了我的手錶）」，圖片 ④ 為公園遊戲區且地上有一隻手錶，故選 ④。'
  },
  {
    number: 8,
    taskType: 'L-SENT',
    dimension: '教室生活辭句理解與回應',
    question: '請看圖並聽語音，選出最相符的情境：',
    options: ['情境 ① (老師看手錶催促 Hurry up! 學生寫考卷)', '情境 ② (彎腰撿起掉在地上的鉛筆)', '情境 ③ (男女生分享畫筆畫畫)', '情境 ④ (學生看黑板寫 cat)'],
    answer: 0,
    image: '/assets/exam/saa/115/g5_q8.webp',
    media: { audioText: 'Hurry up! Time is almost up.' },
    explanation: '聽力情境「Hurry up! Time is almost up.（快點！時間快到了）」，情境 ① 為監考老師看手錶催促學生加快答題，故選 ①。'
  },
  {
    number: 9,
    taskType: 'L-SENT',
    dimension: '教室生活辭句理解與回應',
    question: '請看建築排列並聽語音，選出正確的排列：',
    options: ['排列 ① (學校 - 麵包店 - 銀行)', '排列 ② (書店 - 銀行 - 公園)', '排列 ③ (銀行 - 書店 - 麵包店)', '排列 ④ (公園 - 學校 - 書店)'],
    answer: 1,
    image: '/assets/exam/saa/115/g5_q9.webp',
    media: { audioText: 'The bank is between the bookstore and the park.' },
    explanation: '聽力內容「The bank is between the bookstore and the park.（銀行在書店與公園中間）」，排列 ② 為書店 - 銀行 - 公園，完全相符，故選 ②。'
  },
  {
    number: 10,
    taskType: 'L-SENT',
    dimension: '教室生活辭句理解與回應',
    question: '請聽問句，選出最適當的回應句子：',
    options: [
      'I have lunch at eleven thirty.',
      'No, I don’t have Chinese class on Tuesday.',
      'I have breakfast at home.',
      'Yes, I would like some noodles.'
    ],
    answer: 0,
    media: { audioText: 'What time do you have lunch?' },
    explanation: '問句詢問午餐時間「What time do you have lunch?」，回應「I have lunch at eleven thirty.（我十一點半吃午餐）」，故選 ①。'
  },
  {
    number: 11,
    taskType: 'L-SENT',
    dimension: '教室生活辭句理解與回應',
    question: '請聽問句，選出最適當的回應句子：',
    options: [
      'The dog is big.',
      'It’s in the box.',
      'It’s on the table.',
      'The box is small.'
    ],
    answer: 1,
    media: { audioText: 'Where is the puppy?' },
    explanation: '問句詢問小狗在哪裡「Where is the puppy?」，適當回應為說明位置「It’s in the box.（在盒子裡）」，故選 ②。'
  },
  {
    number: 12,
    taskType: 'L-SENT',
    dimension: '文化節慶理解',
    question: '請看節慶圖案並聽語音，選出正確的節慶圖片：',
    options: ['情境 ① (萬聖節下雨幽靈撐傘)', '情境 ② (中秋節雲朵遮滿月)', '情境 ③ (農曆新年放鞭炮)', '情境 ④ (聖誕節雪人與聖誕樹)'],
    answer: 1,
    image: '/assets/exam/saa/115/g5_q12.webp',
    media: { audioText: 'Look at the full moon in the sky. Happy Moon Festival!' },
    explanation: '語音提及「full moon in the sky. Happy Moon Festival!（天上的滿月，中秋節快樂！）」，圖片 ② 為雲層後的皎潔滿月，故選 ②。'
  },
  {
    number: 13,
    taskType: 'L-SENT',
    dimension: '文化節慶理解',
    question: '請看圖片並聽語音，選出正確的情境圖片：',
    options: ['圖片 ① (拿麥克風唱歌)', '圖片 ② (畫母親節卡片 I Love Mom)', '圖片 ③ (頭戴運動頭巾跳舞)', '圖片 ④ (在書桌前看書寫字)'],
    answer: 1,
    image: '/assets/exam/saa/115/g5_q13.webp',
    media: { audioText: 'The boy is drawing a card for Mother’s Day.' },
    explanation: '聽力內容「The boy is drawing a card for Mother’s Day.（男孩正在畫母親節卡片）」，圖片 ② 小男孩正在畫卡片寫「I ❤ Mom」，故選 ②。'
  },
  {
    number: 14,
    taskType: 'L-CONV',
    dimension: '教室生活辭句理解與回應',
    question: '請看週一至週三的天氣表並聽對話，選出正確的天氣表：',
    options: [
      '天氣表 ① (週一晴天、週二下雨、週三多雲)',
      '天氣表 ② (週一多雲、週二刮風、週三下雨)',
      '天氣表 ③ (週一下雪、週二晴天、週三下雨)',
      '天氣表 ④ (週一晴天、週二多雲、週三下雪)'
    ],
    answer: 1,
    image: '/assets/exam/saa/115/g5_q14.webp',
    media: { audioText: 'Girl: What is the weather like this week? Boy: It’s cloudy on Monday, windy on Tuesday, and rainy on Wednesday.' },
    explanation: '對話中說明天氣為「cloudy on Monday (週一多雲), windy on Tuesday (週二颳風), and rainy on Wednesday (週三下雨)」，天氣表 ② 完全吻合，故選 ②。'
  },
  {
    number: 15,
    taskType: 'L-CONV',
    dimension: '教室生活辭句理解與回應',
    question: '承第 14 題對話，週三出門時需要準備什麼？',
    options: [
      'a hat and sunglasses',
      'a T-shirt and shorts',
      'an umbrella and a jacket',
      'gloves and sunglasses'
    ],
    answer: 2,
    media: { audioText: 'Girl: It is cold and rainy on Wednesday. What should I bring? Boy: You should take an umbrella and wear a jacket.' },
    explanation: '對話提到週三既寒冷又下雨，建議「take an umbrella and wear a jacket（帶雨傘並穿外套）」，故選 ③。'
  },
  {
    number: 16,
    taskType: 'V-MEAN',
    dimension: '字詞辨識',
    question: '看圖片選出正確的食物單字：',
    options: ['hot dog', 'hamburger', 'bread', 'pizza'],
    answer: 1,
    image: '/assets/exam/saa/115/g5_q16.webp',
    explanation: '圖片中為美味牛肉漢堡，英文單字為 hamburger，故選 ②。'
  },
  {
    number: 17,
    taskType: 'V-MEAN',
    dimension: '字詞辨識',
    question: '依文字「grape juice」選出正確的飲料圖片：',
    options: ['飲料 ① (葡萄汁)', '飲料 ② (柳橙汁)', '飲料 ③ (蘋果汁)', '飲料 ④ (西瓜汁)'],
    answer: 0,
    image: '/assets/exam/saa/115/g5_q17.webp',
    explanation: '文字為「grape juice（葡萄汁）」，飲料 ① 杯旁畫有葡萄串，故選 ①。'
  },
  {
    number: 18,
    taskType: 'V-MEAN',
    dimension: '字詞辨識',
    question: 'The elephant is ___________.（看圖中大象與旁邊小狗的身高比較）：',
    options: ['tall', 'thin', 'short', 'small'],
    answer: 0,
    image: '/assets/exam/saa/115/g5_q18.webp',
    explanation: '圖中刻度表顯示大象身高超過 2.5 公尺，對比旁邊的小狗，大象是高大的「tall」，故選 ①。'
  },
  {
    number: 19,
    taskType: 'V-MEAN',
    dimension: '字詞辨識',
    question: '依單字「swimming」選出相符的運動圖片：',
    options: ['運動 ① (游泳)', '運動 ② (打籃球)', '運動 ③ (踢足球)', '運動 ④ (慢跑)'],
    answer: 0,
    image: '/assets/exam/saa/115/g5_q19.webp',
    explanation: '單字「swimming」意為游泳，運動 ① 為在泳池中戴蛙鏡游泳的人物，故選 ①。'
  },
  {
    number: 20,
    taskType: 'G-MC',
    dimension: '句子理解',
    question: '看圖中文具的數量與大小，選出正確的敘述：',
    options: [
      'I have five big erasers and four small pens.',
      'I have four small rulers and five small pens.',
      'I have four small rulers and five big pencils.',
      'I have five small erasers and four big pencils.'
    ],
    answer: 3,
    image: '/assets/exam/saa/115/g5_q20.webp',
    explanation: '圖中文具為 5 塊小橡皮擦（five small erasers）與 4 支長鉛筆（four big pencils），正確敘述為 ④。'
  },
  {
    number: 21,
    taskType: 'G-MC',
    dimension: '句子理解',
    question: 'This is a capybara (水豚). Where are the oranges?',
    options: [
      'The oranges are on the capybara.',
      'The oranges are under the capybara.',
      'The capybara is on the oranges.',
      'The capybara is by the oranges.'
    ],
    answer: 0,
    image: '/assets/exam/saa/115/g5_q21.webp',
    explanation: '圖片中水豚頭頂與背上頂著柳橙，正確介系詞為 on（在...上面），故選 ①「The oranges are on the capybara.」。'
  },
  {
    number: 22,
    taskType: 'G-MC',
    dimension: '句子理解',
    question: 'What should (應該) the boy do?（看教室黑板規律舉手發言）：',
    options: [
      'Open the door.',
      'Take out his book.',
      'Go to the restroom.',
      'Raise his hand to speak.'
    ],
    answer: 3,
    image: '/assets/exam/saa/115/g5_q22.webp',
    explanation: '黑板圖示標示發言前應先舉手，故男孩應該「Raise his hand to speak.（舉手發言）」，故選 ④。'
  },
  {
    number: 23,
    taskType: 'G-MC',
    dimension: '句子理解',
    question: 'What day is Christmas?（看日曆中 12 月 25 日為星期幾）：',
    options: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'],
    answer: 1,
    image: '/assets/exam/saa/115/g5_q23.webp',
    explanation: '日曆中 12 月 25 日聖誕節向上對應之星期為 Thursday（週四），故選 ②。'
  },
  {
    number: 24,
    taskType: 'G-CTX',
    dimension: '文化節慶理解',
    question: '看萬聖節南瓜燈與鬼怪變裝圖片，選出最適當的節慶標語：',
    options: [
      'Let’s Eat! Happy Birthday!',
      'Have a Seat! Merry Christmas!',
      'Trick or Treat! Happy Halloween!',
      'Watch the Moon! Moon Festival is on Fire!'
    ],
    answer: 2,
    image: '/assets/exam/saa/115/g5_q24.webp',
    explanation: '萬聖節變裝討糖經典口號與祝福為「Trick or Treat! Happy Halloween!」，故選 ③。'
  },
  {
    number: 25,
    taskType: 'G-MC',
    dimension: '句子理解',
    question: 'A: Where are you going?\nB: ____________.',
    options: [
      'I’m going crazy.',
      'I’m going to be eleven.',
      'I’m going to my bedroom.',
      'I’m going to sing.'
    ],
    answer: 2,
    explanation: '問句「Where are you going?（你要去哪裡？）」詢問目的地，回答場所「I’m going to my bedroom.（我要去我的臥室）」，故選 ③。'
  },
  {
    number: 26,
    taskType: 'G-MC',
    dimension: '句子理解',
    question: 'This is Ruby’s bag. What are on her shopping list (購物清單)?',
    options: [
      '清單 ① (2 apples, 2 bottles of milk, 1 bag of rice, 3 cakes)',
      '清單 ② (2 apples, 2 bottles of water, 1 bag of bread, 4 eggs)',
      '清單 ③ (2 apples, 2 bottles of milk, 1 bag of rice, 4 eggs)',
      '清單 ④ (2 apples, 1 bottle of soda, 1 bag of rice, 4 cakes)'
    ],
    answer: 2,
    image: '/assets/exam/saa/115/g5_q26.webp',
    explanation: '購物袋中裝有 2 顆蘋果、2 瓶牛奶、1 袋米與 4 顆雞蛋，清單 ③ 項目與數量完全吻合，故選 ③。'
  },
  {
    number: 27,
    taskType: 'R-COMP',
    dimension: '短文與對話理解',
    question: 'What day is “School Fun Day”?（看海報公告活動星期）：',
    options: ["It’s on Monday.", "It’s on Friday.", "It’s on Saturday.", "It’s on Sunday."],
    answer: 2,
    image: '/assets/exam/saa/115/g5_q27.webp',
    explanation: '海報上標記活動時間為週六「Saturday」，故選 ③「It’s on Saturday.」。'
  },
  {
    number: 28,
    taskType: 'G-MC',
    dimension: '句子理解',
    question: 'Will: Hi, Mandy. How are you?\nMandy: I am tired. How about you?\nWill: Me, too. It’s eleven o’clock now. What time is it in Taipei?\nMandy: It’s ten o’clock. Time to go to bed here.\nQuestion: Where is Will?',
    options: ['London', 'Taipei', 'Tokyo', 'Sydney'],
    answer: 2,
    image: '/assets/exam/saa/115/g5_q28.webp',
    explanation: '對話中 Will 所在地的時間是 11 點，比台北的 10 點快 1 個小時（GMT+9），對照世界時區地圖為 Tokyo（東京），故選 ③。'
  },
  {
    number: 29,
    taskType: 'G-MC',
    dimension: '句子理解',
    question: 'Which (哪一個) is true?（看四種動物技能表）：',
    options: [
      'Frank is a fish.',
      'Teresa is a frog.',
      'Crystal can run.',
      'Teresa can’t swim.'
    ],
    answer: 3,
    image: '/assets/exam/saa/115/g5_q29.webp',
    explanation: '技能表中 Teresa 在 swim（游泳）欄位標示叉號，代表「Teresa can’t swim.（Teresa 不會游泳）」，故選 ④。'
  },
  {
    number: 30,
    taskType: 'R-COMP',
    dimension: '短文與對話理解',
    groupId: 'saa-115-g5-feelings',
    image: '/assets/exam/saa/115/g5_q30_chart.webp',
    passage: {
      title: '【圖表閱讀】Class 501 Feeling Check-Up (心情檢測)',
      text: '五年一班心情檢測統計長條圖：\n統計全班學生今天的心情感受（Happy, Sad, Tired, Angry, Hungry 等）。'
    },
    question: 'What is the ★?',
    options: ['Tired', 'Hungry', 'Happy', 'Thirsty'],
    answer: 2,
    explanation: '★ 欄位對應的心情符號為大笑臉且統計人數最多，代表「Happy（開心的）」，故選 ③。'
  },
  {
    number: 31,
    taskType: 'R-COMP',
    dimension: '短文與對話理解',
    groupId: 'saa-115-g5-feelings',
    image: '/assets/exam/saa/115/g5_q30_chart.webp',
    passage: {
      title: '【圖表閱讀】Class 501 Feeling Check-Up (心情檢測)',
      text: '五年一班心情檢測統計長條圖：\n統計全班學生今天的心情感受（Happy, Sad, Tired, Angry, Hungry 等）。'
    },
    question: 'How does Chris feel today?',
    options: ['He feels happy.', 'He feels sad.', 'He feels angry.', 'He feels scared.'],
    answer: 1,
    explanation: '在圖表中尋找名字 Chris，其位於哭泣難過臉的 Sad 欄位，故「He feels sad.」，選 ②。'
  },
  {
    number: 32,
    taskType: 'R-COMP',
    dimension: '短文與對話理解',
    groupId: 'saa-115-g5-feelings',
    image: '/assets/exam/saa/115/g5_q30_chart.webp',
    passage: {
      title: '【圖表閱讀】Class 501 Feeling Check-Up (心情檢測)',
      text: '五年一班心情檢測統計長條圖：\n統計全班學生今天的心情感受（Happy, Sad, Tired, Angry, Hungry 等）。'
    },
    question: 'How many students are there in Class 501?',
    options: [
      'There are seven students.',
      'There are eleven students.',
      'There are fifteen students.',
      'There are twenty students.'
    ],
    answer: 0,
    explanation: '統計各心情欄位上的學生大頭貼總數，全班共有 7 位學生（There are seven students），故選 ①。'
  },
  {
    number: 33,
    taskType: 'R-COMP',
    dimension: '文化節慶理解',
    groupId: 'saa-115-g5-diary',
    passage: {
      title: '【生活日記】Dear diary',
      text: 'Dear diary:\nToday is a hot and sunny day. I don’t have to go to school. At 9:00, my mom and I go to get some rice to make zongzi (rice dumpling) in the supermarket. When we come back home, my dad and I watch boat racing on TV. It’s twelve o’clock. We stand eggs. What a happy day!'
    },
    question: 'What festival is today?',
    options: ['Moon Festival', 'Lunar New Year', 'Mother’s Day', 'Dragon Boat Festival'],
    answer: 3,
    explanation: '日記中描述了包粽子（zongzi）、看電視划龍舟（boat racing）與正午立蛋（stand eggs），皆為端午節（Dragon Boat Festival）的傳統習俗，故選 ④。'
  },
  {
    number: 34,
    taskType: 'R-COMP',
    dimension: '短文與對話理解',
    groupId: 'saa-115-g5-diary',
    image: '/assets/exam/saa/115/g5_q34_map.webp',
    passage: {
      title: '【生活日記】Dear diary',
      text: 'Dear diary:\nToday is a hot and sunny day. I don’t have to go to school. At 9:00, my mom and I go to get some rice to make zongzi (rice dumpling) in the supermarket. When we come back home, my dad and I watch boat racing on TV. It’s twelve o’clock. We stand eggs. What a happy day!'
    },
    question: 'Where is the family?',
    options: ['They are in Taipei.', 'They are in Taichung.', 'They are in Tainan.', 'They are in Yilan.'],
    answer: 2,
    explanation: '地圖插圖中家庭位置的圖釘標記在台灣南部的台南（Tainan），故「They are in Tainan.」，選 ③。'
  },
  {
    number: 35,
    taskType: 'R-COMP',
    dimension: '短文與對話理解',
    groupId: 'saa-115-g5-diary',
    image: '/assets/exam/saa/115/g5_q35.webp',
    passage: {
      title: '【生活日記】Dear diary',
      text: 'Dear diary:\nToday is a hot and sunny day. I don’t have to go to school. At 9:00, my mom and I go to get some rice to make zongzi (rice dumpling) in the supermarket. When we come back home, my dad and I watch boat racing on TV. It’s twelve o’clock. We stand eggs. What a happy day!'
    },
    question: 'Look at the boy. What time is it?',
    options: ['時鐘 ① (12:00 立蛋)', '時鐘 ② (9:00 買米)', '時鐘 ③ (10:00 看電視)', '時鐘 ④ (3:00 吃粽子)'],
    answer: 0,
    explanation: '圖片中男孩正在地上立蛋，日記中說明「It’s twelve o’clock. We stand eggs.」，時鐘 ① 顯示 12:00 整，故選 ①。'
  }
];

// --------------------------------------------------------------------------
// GRADE 6 (115) - 35 Questions
// --------------------------------------------------------------------------
const g6Raw = [
  {
    number: 1,
    taskType: 'A-SOUND',
    dimension: '語音聽辨',
    question: '請聽語音，選出正確的字詞：',
    options: ['bet', 'beat', 'bite', 'bat'],
    answer: 1,
    media: { audioText: 'beat' },
    explanation: '聽力語音為「beat」，母音發長母音 /i/。'
  },
  {
    number: 2,
    taskType: 'A-SOUND',
    dimension: '語音聽辨',
    question: '請聽語音，選出正確的單字：',
    options: ['sore', 'star', 'sure', 'sir'],
    answer: 0,
    media: { audioText: 'sore' },
    explanation: '聽力單字為「sore（疼痛的）」，母音發音為 /ɔ/。'
  },
  {
    number: 3,
    taskType: 'L-WORD',
    dimension: '辭彙聽辨',
    question: '請看高鐵車票並聽語音，選出正確的車次車票：',
    options: ['車票 ① (Train 0137)', '車票 ② (Train 0657)', '車票 ③ (Train 0837)', '車票 ④ (Train 0817)'],
    answer: 3,
    image: '/assets/exam/saa/115/g6_q3.webp',
    media: { audioText: 'Train zero-eight-one-seven is ready to go.' },
    explanation: '聽力內容「Train zero-eight-one-seven (0817) is ready to go.」，車票 ④ 標註 Train 0817，故選 ④。'
  },
  {
    number: 4,
    taskType: 'L-WORD',
    dimension: '辭彙聽辨',
    question: '請看指示代名詞手勢並聽語音，選出相符的圖片：',
    options: ['圖片 ① (That sock)', '圖片 ② (Those socks)', '圖片 ③ (These socks)', '圖片 ④ (This sock)'],
    answer: 2,
    image: '/assets/exam/saa/115/g6_q4.webp',
    media: { audioText: 'these socks' },
    explanation: '聽力內容「these socks」，these 代表近距離且為複數（兩隻襪子），圖片 ③ 近距離指著兩隻襪子，故選 ③。'
  },
  {
    number: 5,
    taskType: 'L-WORD',
    dimension: '辭彙聽辨',
    question: '請看生病症狀並聽語音，選出相符的圖片：',
    options: ['症狀 ① (喉嚨痛)', '症狀 ② (牙痛)', '症狀 ③ (打噴嚏丟垃圾桶)', '症狀 ④ (流鼻水擤鼻涕)'],
    answer: 3,
    image: '/assets/exam/saa/115/g6_q5.webp',
    media: { audioText: 'He has a runny nose.' },
    explanation: '聽力內容「He has a runny nose.（他流鼻水）」，症狀 ④ 小男孩拿著衛生紙擦鼻水，故選 ④。'
  },
  {
    number: 6,
    taskType: 'L-SENT',
    dimension: '教室生活辭句理解與回應',
    question: '請聽語音，選出相符的天氣敘述：',
    options: [
      'They are going to the park.',
      'They are flying a kite.',
      'It is cloudy and rainy.',
      'It is sunny and windy.'
    ],
    answer: 3,
    media: { audioText: 'It is sunny and windy outside.' },
    explanation: '聽力內容「It is sunny and windy outside.（外面晴朗且有風）」，選項 ④ 相符。'
  },
  {
    number: 7,
    taskType: 'L-SENT',
    dimension: '教室生活辭句理解與回應',
    question: '請看症狀與交通工具並聽語音，選出相符的圖片：',
    options: ['圖片 ① (流鼻水 + 搭公車)', '圖片 ② (牙痛 + 騎腳踏車)', '圖片 ③ (牙痛 + 搭公車)', '圖片 ④ (流鼻水 + 騎腳踏車)'],
    answer: 2,
    image: '/assets/exam/saa/115/g6_q7.webp',
    media: { audioText: 'I have a toothache today. I go to the dentist by bus.' },
    explanation: '聽力內容「I have a toothache today. I go to the dentist by bus.（我今天牙痛，我搭公車去看牙醫）」，圖片 ③ 男士捂臉牙痛且旁邊為公車，故選 ③。'
  },
  {
    number: 8,
    taskType: 'L-SENT',
    dimension: '教室生活辭句理解與回應',
    question: '請看手錶指針並聽語音，選出正確的手錶：',
    options: ['手錶 ① (3:55)', '手錶 ② (9:50)', '手錶 ③ (4:40)', '手錶 ④ (8:15)'],
    answer: 3,
    image: '/assets/exam/saa/115/g6_q8.webp',
    media: { audioText: 'Look at my watch. It is eight fifteen.' },
    explanation: '聽力內容「Look at my watch. It is eight fifteen.（看我的手錶，現在八點十五分）」，手錶 ④ 時針指在 8、分針指在 3（15分），故選 ④。'
  },
  {
    number: 9,
    taskType: 'L-SENT',
    dimension: '教室生活辭句理解與回應',
    question: '請聽日常問答，選出最適當的回應：',
    options: [
      'Sure. Let me help you.',
      'No. I am not fat.',
      'Yes. I have two hands.',
      'Sorry. Henry is not here.'
    ],
    answer: 0,
    media: { audioText: 'Could you please give me a hand?' },
    explanation: '問句「Could you please give me a hand?（你能幫我一個忙嗎？）」，禮貌答應「Sure. Let me help you.（當然，讓我幫你）」，故選 ①。'
  },
  {
    number: 10,
    taskType: 'L-SENT',
    dimension: '教室生活辭句理解與回應',
    question: '請聽問句，選出最適當的回應句子：',
    options: [
      'They are sleeping.',
      'They are from the USA.',
      'No, I don’t like monkeys.',
      'There are five monkeys.'
    ],
    answer: 3,
    media: { audioText: 'How many monkeys are there in the tree?' },
    explanation: '問句詢問數量「How many monkeys are there in the tree?（樹上有幾隻猴子？）」，回應「There are five monkeys.（有五隻猴子）」，故選 ④。'
  },
  {
    number: 11,
    taskType: 'L-SENT',
    dimension: '教室生活辭句理解與回應',
    question: '請看建築街景並聽語音，選出正確的女孩去處：',
    options: ['街景 ① (學校旁書店)', '街景 ② (麵包店旁書店)', '街景 ③ (學校旁郵局)', '街景 ④ (麵包店旁郵局)'],
    answer: 1,
    image: '/assets/exam/saa/115/g6_q11.webp',
    media: { audioText: 'The girl is going to the bookstore next to the bakery.' },
    explanation: '聽力內容「The girl is going to the bookstore next to the bakery.（女孩要去麵包店旁邊的書店）」，街景 ② 正確標示麵包店（麵包圖示）旁的書店，女孩思考著書本，故選 ②。'
  },
  {
    number: 12,
    taskType: 'L-SENT',
    dimension: '文化節慶理解',
    question: '請聽節慶描述，選出正確的節慶名稱：',
    options: ['It’s Halloween.', 'It’s Easter.', 'It’s Mother’s Day.', 'It’s Christmas.'],
    answer: 0,
    media: { audioText: 'Children are wearing costumes and saying Trick or Treat!' },
    explanation: '描述提到小朋友變裝並喊不給糖就搗蛋「Trick or Treat!」，代表萬聖節「It’s Halloween.」，故選 ①。'
  },
  {
    number: 13,
    taskType: 'L-SENT',
    dimension: '文化節慶理解',
    question: '請看節慶裝飾並聽語音，選出正確的裝飾組合：',
    options: ['組合 ① (聖誕樹與兩個禮物)', '組合 ② (星星與兩個禮物)', '組合 ③ (星星與兩隻聖誕襪)', '組合 ④ (聖誕樹與兩隻聖誕襪)'],
    answer: 2,
    image: '/assets/exam/saa/115/g6_q13.webp',
    media: { audioText: 'Look at the decorations. There are two stockings and a star.' },
    explanation: '聽力內容「There are two stockings and a star.（有兩隻聖誕襪和一顆星星）」，裝飾組合 ③ 為大星星與兩隻聖誕襪，故選 ③。'
  },
  {
    number: 14,
    taskType: 'L-CONV',
    dimension: '教室生活辭句理解與回應',
    question: '請聽對話，選出男孩放學後的活動：',
    options: ['He does his homework.', 'He rides a bike.', 'He watches TV.', 'He eats some food.'],
    answer: 0,
    media: { audioText: 'Girl: What do you do after school? Boy: I do my homework in my room.' },
    explanation: '對話中女孩詢問放學後活動，男孩回答「I do my homework in my room.（我在房間寫作業）」，故選 ①。'
  },
  {
    number: 15,
    taskType: 'L-CONV',
    dimension: '教室生活辭句理解與回應',
    question: '請聽對話，選出他們晚上一起做什麼活動：',
    options: [
      'They go to the supermarket.',
      'They watch TV at home.',
      'They read some books at the bookstore.',
      'They play basketball at the park.'
    ],
    answer: 1,
    media: { audioText: 'Girl: What do you and your brother do in the evening? Boy: We watch TV at home together.' },
    explanation: '對話中男孩回答「We watch TV at home together.（我們晚上一起在家看電視）」，故選 ②。'
  },
  {
    number: 16,
    taskType: 'V-MEAN',
    dimension: '字詞辨識',
    question: '看圖片點餐情境（芭樂與木瓜牛奶），選出正確句子：',
    options: [
      'I would like some guavas and papaya milk.',
      'I would like some grapes and pineapple cake.',
      'I would like some guavas and pineapple cake.',
      'I would like some grapes and papaya milk.'
    ],
    answer: 0,
    image: '/assets/exam/saa/115/g6_q16.webp',
    explanation: '圖片中的水果是芭樂（guavas）且飲料為木瓜牛奶（papaya milk），相符句子為 ①。'
  },
  {
    number: 17,
    taskType: 'V-MEAN',
    dimension: '字詞辨識',
    question: 'David goes to the supermarket in the morning, and he goes to the museum in the afternoon. What day is it?',
    options: ['It’s Tuesday.', 'It’s Wednesday.', 'It’s Thursday.', 'It’s Friday.'],
    answer: 2,
    image: '/assets/exam/saa/115/g6_q17.webp',
    explanation: '日程表中，週四（Thu.）上午（Morning）為超市圖示，下午（Afternoon）為博物館圖示，故「It’s Thursday.」，選 ③。'
  },
  {
    number: 18,
    taskType: 'V-MEAN',
    dimension: '字詞辨識',
    question: 'Which (哪一個) is true?（看家庭各房間活動剖面圖）：',
    options: [
      'Dad is reading in the bedroom.',
      'I’m sleeping in the living room.',
      'Mom is drinking in the kitchen.',
      'The dog is playing in the yard.'
    ],
    answer: 3,
    image: '/assets/exam/saa/115/g6_q18.webp',
    explanation: '剖面圖右側院子裡小狗正在奔跑玩耍「The dog is playing in the yard.」，其他選項房間與動作皆不符，故選 ④。'
  },
  {
    number: 19,
    taskType: 'V-MEAN',
    dimension: '字詞辨識',
    question: 'Paul and his sister are at a kite shop. Paul wants to buy a frog kite ($200), and his sister likes the bear kite ($300). They only have NTD$400. What can they buy?',
    options: [
      'Two bear kites.',
      'Two robot kites.',
      'Two frog kites.',
      'A frog kite and a bear kite.'
    ],
    answer: 2,
    image: '/assets/exam/saa/115/g6_q19.webp',
    explanation: '兄妹兩人只有 400 元預算，青蛙風箏一隻 200 元，買兩隻剛好 200 × 2 = 400 元「Two frog kites.」，故選 ③。'
  },
  {
    number: 20,
    taskType: 'G-MC',
    dimension: '句子理解',
    question: 'A: Whose glasses are those?\nB: _______________________________________________.',
    options: [
      'They are going to the supermarket.',
      'They are seven hundred dollars.',
      'They are under the table.',
      'They are Nancy’s.'
    ],
    answer: 3,
    explanation: '問句「Whose glasses are those?（那是誰的眼鏡？）」詢問所有權，回答所有格「They are Nancy’s.（那是南西的）」，故選 ④。'
  },
  {
    number: 21,
    taskType: 'G-MC',
    dimension: '句子理解',
    question: 'Which (哪一個) is true?（看動物園柵欄裡的動物圖片）：',
    options: [
      'There are five monkeys.',
      'There are some horses.',
      'There are four turtles.',
      'There are three zebras.'
    ],
    answer: 1,
    image: '/assets/exam/saa/115/g6_q21.webp',
    explanation: '圖片中柵欄裡有多匹馬正在吃草，正確敘述為「There are some horses.（有一些馬）」，故選 ②。'
  },
  {
    number: 22,
    taskType: 'G-MC',
    dimension: '句子理解',
    question: 'This is a pie chart (圓餅圖). There are 20 students in Jane’s class. They do different (不同) things after school. Which (哪一個) is true?',
    options: [
      'Three students go swimming after school.',
      'Twelve students read some books after school.',
      'Only five students play basketball after school.',
      'Twenty-five students listen to music after school.'
    ],
    answer: 0,
    image: '/assets/exam/saa/115/g6_q22.webp',
    explanation: '圓餅圖數據顯示放學後游泳（swimming）的學生人數為 3 人，故選項 ①「Three students go swimming after school.」相符。'
  },
  {
    number: 23,
    taskType: 'G-MC',
    dimension: '句子理解',
    question: 'Whose glasses are those?（看漫畫對話內容）：',
    options: ["They’re Mike’s.", "They’re Lily’s.", "They’re Dad’s.", "They’re Mom’s."],
    answer: 0,
    image: '/assets/exam/saa/115/g6_q23.webp',
    explanation: '漫畫對話中確認眼鏡的主人是 Mike，回答「They’re Mike’s.」，故選 ①。'
  },
  {
    number: 24,
    taskType: 'G-MC',
    dimension: '句子理解',
    question: 'What do you need if (如果) you are in Tainan?（看台灣天氣預報圖中台南的下雨圖示）：',
    options: [
      'A watch.',
      'An umbrella.',
      'A pair of (一雙) gloves.',
      'A pair of (一副) sunglasses.'
    ],
    answer: 1,
    image: '/assets/exam/saa/115/g6_q24.webp',
    explanation: '台灣天氣預報圖中台南（Tainan）標示雨天雲朵下雨圖案，故出門需要雨傘「An umbrella.」，故選 ②。'
  },
  {
    number: 25,
    taskType: 'G-MC',
    dimension: '句子理解',
    question: 'I have six hundred dollars. What can I buy?（看服飾價格標籤）：',
    options: [
      'I can buy a pair of (一雙) socks and a dress.',
      'I can buy a pair of (一雙) socks and two T-shirts.',
      'I can buy a pair of (一雙) shoes and a dress.',
      'I can buy a pair of (一雙) shoes and pants.'
    ],
    answer: 1,
    image: '/assets/exam/saa/115/g6_q25.webp',
    explanation: '商品價格：T-shirt $200、socks $100、dress $600、shoes $500。一雙襪子 $100 加兩件 T 恤 $400 合計 $500 <= $600，故選 ②。'
  },
  {
    number: 26,
    taskType: 'G-MC',
    dimension: '句子理解',
    question: 'It’s 9:20. Hannah is late for the party, and she is at the train station. How can she get there before (之前) 9:30?',
    options: [
      'She can get there by bike.',
      'She can get there by bus.',
      'She can get there on foot.',
      'She can get there by train.'
    ],
    answer: 0,
    image: '/assets/exam/saa/115/g6_q26.webp',
    explanation: '從火車站到派對地點距離 9:30 只有 10 分鐘，交通耗時表中騎自行車（by bike）只要 8 分鐘，能在 9:30 前抵達，故選 ①。'
  },
  {
    number: 27,
    taskType: 'G-MC',
    dimension: '句子理解',
    question: 'What does the girl say?（看櫃台結帳女孩付款）：',
    options: [
      'Where is your coffee?',
      'How much is it?',
      'Here you are.',
      'Good job!'
    ],
    answer: 2,
    image: '/assets/exam/saa/115/g6_q27.webp',
    explanation: '女孩在結帳櫃台遞鈔票給店員，付款時的禮貌英語為「Here you are.（這給您）」，故選 ③。'
  },
  {
    number: 28,
    taskType: 'R-COMP',
    dimension: '短文與對話理解',
    question: 'Which (哪一個) is true?（看公共場所標誌守則）：',
    options: [
      'We can ride a bike in the museum.',
      'We can play baseball at the post office.',
      'We should (應該) buy a ticket (門票) to go to a bakery.',
      'We should (應該) be quiet in the library and the museum.'
    ],
    answer: 3,
    image: '/assets/exam/saa/115/g6_q28.webp',
    explanation: '圖書館與博物館皆為靜音場所，標誌要求「We should be quiet in the library and the museum.（在圖書館與博物館應保持安靜）」，故選 ④。'
  },
  {
    number: 29,
    taskType: 'G-CTX',
    dimension: '文化節慶理解',
    question: 'Which (哪一個) is true?',
    options: [
      'We can watch lion dance on Earth Day.',
      'We can dress up (裝扮) as a vampire on Halloween.',
      'We can watch dragon boat racing on Moon Festival.',
      'We can decorate (裝飾) the Christmas tree on New Year’s Eve (前夕).'
    ],
    answer: 1,
    explanation: '萬聖節的傳統習俗為變裝打扮成吸血鬼、幽靈等角色「dress up as a vampire on Halloween」，故選 ②。'
  },
  {
    number: 30,
    taskType: 'G-CTX',
    dimension: '文化節慶理解',
    question: 'What can you see on Dragon Boat Festival?',
    options: ['圖片 ① (吃月餅賞月)', '圖片 ② (划龍舟吃粽子)', '圖片 ③ (萬聖節討糖)', '圖片 ④ (聖誕老人與雪人)'],
    answer: 1,
    image: '/assets/exam/saa/115/g6_q30.webp',
    explanation: '端午節（Dragon Boat Festival）的代表景觀與習俗為划龍舟與包粽子，對應圖片 ②，故選 ②。'
  },
  {
    number: 31,
    taskType: 'R-COMP',
    dimension: '短文與對話理解',
    question: 'Andy: What time do you get up?\nJason: I get up at five.\nAndy: Wow! You are an early bird.\nJason: Yes, I am. I love early mornings.\n\nQuestion: Why is Jason an early bird?',
    options: [
      'He loves birds.',
      'He likes to go upstairs (樓上).',
      'He gets up early.',
      'He is on time.'
    ],
    answer: 2,
    explanation: '英文慣用語「early bird」意指早起的人，對話中 Jason 每天清晨五點起床（I get up at five），故因為他起得很早「He gets up early.」，選 ③。'
  },
  {
    number: 32,
    taskType: 'R-COMP',
    dimension: '短文與對話理解',
    groupId: 'saa-115-g6-typhoon',
    image: '/assets/exam/saa/115/g6_q32_board.webp',
    passage: {
      title: '【社群貼文】Typhoon Help Board',
      text: 'Kyle:\nIt was rainy and windy yesterday. I don’t like typhoons (颱風). I lost (失去) all my toys. There is a lot of mud (淤泥) here. My house is on Black Street. Who can help me?\n\nCindy: Let me give you a hand. I’m on the train now. I can clean your house.\nKyle: Great! Let’s clean together!\nWinnie: I’m going to your house by bus. Do you need some water?\nKyle: Yes, I’m thirsty. Thank you!\nTed: Don’t worry. I can give you some T-shirts and pants.\nKyle: Good! Thank you!\nRyan: Do you need to see a doctor? I can take (帶) you to the hospital.\nKyle: No, thank you. I’m fine.'
    },
    question: 'Which (哪一個) is true?',
    options: [
      'It was hot and sunny yesterday.',
      'Winnie goes to Kyle’s house by bus.',
      'Ted gives Kyle some water.',
      'Kyle’s toys are at the lost and found (失物招領).'
    ],
    answer: 1,
    explanation: '文中 Winnie 留言「I’m going to your house by bus.（我搭公車去你家）」，故選項 ② 相符。'
  },
  {
    number: 33,
    taskType: 'R-COMP',
    dimension: '短文與對話理解',
    groupId: 'saa-115-g6-typhoon',
    image: '/assets/exam/saa/115/g6_q32_board.webp',
    passage: {
      title: '【社群貼文】Typhoon Help Board',
      text: 'Kyle:\nIt was rainy and windy yesterday. I don’t like typhoons (颱風). I lost (失去) all my toys. There is a lot of mud (淤泥) here. My house is on Black Street. Who can help me?\n\nCindy: Let me give you a hand. I’m on the train now. I can clean your house.\nKyle: Great! Let’s clean together!\nWinnie: I’m going to your house by bus. Do you need some water?\nKyle: Yes, I’m thirsty. Thank you!\nTed: Don’t worry. I can give you some T-shirts and pants.\nKyle: Good! Thank you!\nRyan: Do you need to see a doctor? I can take (帶) you to the hospital.\nKyle: No, thank you. I’m fine.'
    },
    question: 'What does Kyle NOT need?',
    options: [
      'He needs some T-shirts and pants.',
      'He needs some water.',
      'He needs to go to the hospital.',
      'He needs to clean the house.'
    ],
    answer: 2,
    explanation: 'Ryan 問他需不需要看醫生去醫院，Kyle 回答「No, thank you. I’m fine.」，代表他不需要去醫院，故選 ③。'
  },
  {
    number: 34,
    taskType: 'R-COMP',
    dimension: '短文與對話理解',
    groupId: 'saa-115-g6-suspects',
    image: '/assets/exam/saa/115/g6_q34_police.webp',
    passage: {
      title: '【警方偵訊報告】Police Report & Suspects',
      text: 'Suspect (嫌疑犯) 1: Andrew\n“I bought (買) some apple juice and pizza yesterday afternoon, and then (然後) watched TV at home.”\n\nSuspect 2: Betty\n“I was at the hospital last night. I visited (拜訪) my dad. He had a stomachache yesterday.”\n\nSuspect 3: Chris\n“I had dinner with a friend at Den’s Restaurant last night.”\n\nSuspect 4: Diana\n“I was at the post office yesterday morning, and then I read some books at the library.”\n\nPOLICE REPORT 警察報告書:\nA crown (皇冠) was stolen (被偷) from the museum yesterday. A red backpack was found under a chair. There is a suspect lying (說謊) because (因為) Den’s Restaurant was not open yesterday.'
    },
    question: 'Who had a stomachache?',
    options: ['Andrew', 'Chris’ friend', 'Diana', 'Betty’s Dad'],
    answer: 3,
    explanation: 'Betty 在陳述中表示「I visited my dad. He had a stomachache yesterday.」，胃痛的是 Betty 的父親（Betty’s Dad），故選 ④。'
  },
  {
    number: 35,
    taskType: 'R-COMP',
    dimension: '短文與對話理解',
    groupId: 'saa-115-g6-suspects',
    image: '/assets/exam/saa/115/g6_q34_police.webp',
    passage: {
      title: '【警方偵訊報告】Police Report & Suspects',
      text: 'Suspect (嫌疑犯) 1: Andrew\n“I bought (買) some apple juice and pizza yesterday afternoon, and then (然後) watched TV at home.”\n\nSuspect 2: Betty\n“I was at the hospital last night. I visited (拜訪) my dad. He had a stomachache yesterday.”\n\nSuspect 3: Chris\n“I had dinner with a friend at Den’s Restaurant last night.”\n\nSuspect 4: Diana\n“I was at the post office yesterday morning, and then I read some books at the library.”\n\nPOLICE REPORT 警察報告書:\nA crown (皇冠) was stolen (被偷) from the museum yesterday. A red backpack was found under a chair. There is a suspect lying (說謊) because (因為) Den’s Restaurant was not open yesterday.'
    },
    question: 'Who is the thief (小偷)?',
    options: ['Andrew', 'Betty', 'Chris', 'Diana'],
    answer: 2,
    explanation: '警方報告中指稱「Den’s Restaurant was not open yesterday.（該餐廳昨天根本沒開門）」，Chris 謊稱昨晚在該餐廳吃晚餐，是在說謊的嫌疑犯，故 Chris 是小偷，選 ③。'
  }
];

function enrich(rawList, grade) {
  return rawList.map((q) => ({
    id: `saa-115-g${grade}-${String(q.number).padStart(2, '0')}`,
    year: 115,
    grade,
    targetGrade: grade,
    book: grade === 4 ? 4 : grade === 5 ? 6 : 8,
    unit: `115 年國小${grade === 4 ? '四年級' : grade === 5 ? '五年級' : '六年級'}學力檢測`,
    section: q.number <= 15 ? 'listening' : 'reading',
    track: 'ministry-assessment',
    preserveOptionOrder: true,
    reviewed: true,
    ...q
  }));
}

const g4Questions = enrich(g4Raw, 4);
const g5Questions = enrich(g5Raw, 5);
const g6Questions = enrich(g6Raw, 6);

// Write G4
fs.writeFileSync(
  path.join(outDir, 'saa115G4.js'),
  `export const SAA_115_G4_QUESTIONS = ${JSON.stringify(g4Questions, null, 2)};\n`
);
console.log('✓ Wrote saa115G4.js (35 questions, fully enriched)');

// Write G5
fs.writeFileSync(
  path.join(outDir, 'saa115G5.js'),
  `export const SAA_115_G5_QUESTIONS = ${JSON.stringify(g5Questions, null, 2)};\n`
);
console.log('✓ Wrote saa115G5.js (35 questions, fully enriched)');

// Write G6
fs.writeFileSync(
  path.join(outDir, 'saa115G6.js'),
  `export const SAA_115_G6_QUESTIONS = ${JSON.stringify(g6Questions, null, 2)};\n`
);
console.log('✓ Wrote saa115G6.js (35 questions, fully enriched)');

// Write index.js for saa/
const indexContent = `import { SAA_115_G4_QUESTIONS } from './saa115G4.js';
import { SAA_115_G5_QUESTIONS } from './saa115G5.js';
import { SAA_115_G6_QUESTIONS } from './saa115G6.js';

export {
  SAA_115_G4_QUESTIONS,
  SAA_115_G5_QUESTIONS,
  SAA_115_G6_QUESTIONS
};

export const SAA_115_ALL_QUESTIONS = [
  ...SAA_115_G4_QUESTIONS,
  ...SAA_115_G5_QUESTIONS,
  ...SAA_115_G6_QUESTIONS
];

export const SAA_115_EXAM_PAPERS = {
  4: {
    year: 115,
    grade: 4,
    title: '115 年度國小四年級學力檢測全真試卷 (35題)',
    questions: SAA_115_G4_QUESTIONS
  },
  5: {
    year: 115,
    grade: 5,
    title: '115 年度國小五年級學力檢測全真試卷 (35題)',
    questions: SAA_115_G5_QUESTIONS
  },
  6: {
    year: 115,
    grade: 6,
    title: '115 年度國小六年級學力檢測全真試卷 (35題)',
    questions: SAA_115_G6_QUESTIONS
  }
};
`;

fs.writeFileSync(path.join(outDir, 'index.js'), indexContent);
console.log('✓ Wrote src/data/exam/saa/index.js');
