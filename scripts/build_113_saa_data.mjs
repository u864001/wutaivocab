import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve('src/data/exam/saa');
const ANSWERS = {
  4: [0, 2, 2, 2, 3, 3, 3, 1, 0, 0, 3, 2, 1, 0, 1, 3, 0, 1, 2, 1, 0, 1, 3, 2, 1, 0, 3, 3, 1, 3, 2, 1, 2, 2, 0],
  5: [1, 0, 2, 3, 2, 0, 2, 0, 0, 2, 0, 1, 2, 3, 2, 1, 3, 2, 2, 3, 0, 1, 1, 2, 3, 1, 0, 0, 3, 0, 1, 1, 1, 3, 3],
  6: [0, 1, 2, 0, 0, 0, 3, 1, 1, 3, 3, 0, 2, 2, 2, 1, 1, 3, 0, 1, 1, 0, 2, 3, 2, 3, 1, 3, 0, 0, 3, 2, 1, 3, 2],
};

const image = (grade, number) => `/assets/exam/saa/113/g${grade}_q${number}.webp`;
const material = (name) => `/assets/exam/saa/113/materials/${name}.webp`;
const choices = (...values) => values;

// Official MP3 clip boundaries. The original recording remains intact; the player
// seeks to these ranges so students hear the official narrator and actors first.
const OFFICIAL_AUDIO_CLIPS = {
  4: [[125.0, 135.5], [146.0, 159.5], [164.7, 175.5], [184.1, 193.5], [203.4, 214.0], [223.1, 233.0], [244.6, 263.0], [274.1, 294.0], [304.9, 318.0], [330.0, 358.0], [369.9, 388.0], [400.4, 422.5], [422.7, 447.5], [460.5, 486.5], [499.9, 546.5]],
  5: [[133.2, 142.5], [152.2, 161.5], [171.5, 176.5], [191.2, 213.0], [213.2, 228.5], [239.0, 263.8], [264.0, 280.5], [292.2, 315.5], [350.2, 370.5], [384.9, 406.0], [420.3, 494.5], [509.2, 535.5], [549.4, 602.5], [617.0, 705.5], [617.0, 705.5]],
  6: [[133.8, 154.5], [154.5, 178.5], [178.5, 199.0], [199.0, 219.2], [219.2, 242.5], [242.5, 260.2], [260.2, 306.0], [306.0, 342.5], [342.5, 387.4], [401.8, 429.0], [429.0, 464.0], [464.0, 490.0], [490.0, 513.5], [513.5, 642.0], [513.5, 642.0]],
};

const officialAudio = (grade, number) => {
  const [clipStart, clipEnd] = OFFICIAL_AUDIO_CLIPS[grade][number - 1];
  return {
    audioSrc: `/audio/saa/113/g${grade}-official.mp3`,
    clipStart,
    clipEnd,
    audioSourceType: 'official',
  };
};

function buildItem(grade, raw) {
  const answer = ANSWERS[grade][raw.number - 1];
  if (raw.answer !== undefined && raw.answer !== answer) {
    throw new Error(`G${grade} Q${raw.number}: answer mismatch ${raw.answer} !== ${answer}`);
  }
  return {
    id: `saa-113-g${grade}-${String(raw.number).padStart(2, '0')}`,
    year: 113,
    grade,
    targetGrade: grade,
    book: grade,
    unit: `113 年國小${grade === 4 ? '四' : grade === 5 ? '五' : '六'}年級學力檢測`,
    section: raw.number <= 15 ? 'listening' : 'reading',
    track: 'ministry-assessment',
    sourceType: 'official',
    sourceStatus: 'published',
    preserveOptionOrder: true,
    reviewed: true,
    number: raw.number,
    taskType: raw.taskType,
    dimension: raw.dimension,
    question: raw.question,
    options: raw.options,
    answer,
    ...(raw.image ? { image: raw.image } : {}),
    ...(raw.optionImages ? { optionImages: raw.optionImages } : {}),
    ...(raw.media ? { media: { ...raw.media, ...(raw.number <= 15 ? officialAudio(grade, raw.number) : {}) } } : {}),
    explanation: raw.explanation,
    ...(raw.groupId ? { groupId: raw.groupId } : {}),
    ...(raw.passage ? { passage: raw.passage } : {}),
  };
}

const G4_FAMILY_1 = {
  title: '【31–32 共用題組】Bonnie 與 Andy 的家庭對話',
  image: material('g4_family_1_dialogue'),
  text: "Bonnie: Hi! My name is Bonnie. What's your name?\nAndy: Hello! I'm Andy.\nBonnie: Is that your mother? She is tall.\nAndy: Oh, that's Anna. She's my sister. She's 26 years old.\nBonnie: She is beautiful!\nAndy: Thank you. Is that your brother?\nBonnie: No, he's not my brother. He's my father, Ben. He is thirty-six.\nAndy: He is my teacher.\nBonnie: Wow! Cool!",
};

const G4_FAMILY_2 = {
  title: '【33–35 共用題組】Show and Tell Your Family',
  image: material('g4_family_2_story'),
  text: "Show and Tell your family!\nAmy: This is my father. He is tall. This is my mother. She can sing. And this is my little brother. He is cute.\nKen: This is my grandpa. He is a teacher. This is my grandma. She is a doctor.\nJoe: This is my big sister. She is a police officer. I want to be a police officer, too.\nTina: This is my dad. He likes cats. He can draw!",
};

const G5_CONTACT = {
  title: '【31–32 共用題組】Student Emergency Contact Card',
  image: material('g5_contact_card'),
  text: "Harry Yang, Sunny Elementary School, birthday 2012.6.19, class 6-A, phone 0934-567890, teacher Sharon Pong.\nContact 1: Mandy Lin, Harry's mother, phone 0912-345678, doctor.\nContact 2: Nick Yang, Harry's brother, phone 0987-654321, police officer.",
};

const G5_MUSEUM = {
  title: '【33–35 共用題組】Art Museum Ticket Board',
  image: material('g5_museum_board'),
  text: 'Tuesday to Friday: children 6–12 are free and adults are $80. Saturday and Sunday: children are $50 and adults are $100. Closed on Monday. No eating, drinking, or pets.',
};

const G6_LETTER = {
  title: '【31–33 共用題組】Taylor 寫給 Stella 的信',
  image: material('g6_letter'),
  text: "Dear Stella,\nHow is your new school? Is it far away from us? You know our school is still on Turtle Street next to the park. You are always welcome for a visit. We miss you a lot.\n\nI love math, but now my favorite subject is English. The English teacher is so funny. She has long hair, wears glasses, and dresses. She is my favorite teacher.\n\nBy the way, I am going to the zoo on Moon Festival. There is a new museum opening in the zoo. I would like to see the new exhibitions. Are you coming? Let's have dinner together after visiting the zoo and the museum. Please let me know if you are coming.\n\nBest,\nTaylor",
};

const G6_PLANNER = {
  title: '【34–35 共用題組】Amy’s Weekly Planner',
  image: material('g6_weekly_planner'),
  text: "Monday: PE class, wear sneakers.\nTuesday: go jogging with Penny.\nWednesday: go to the park with Bernadette.\nThursday: art class.\nFriday: watch TV.\nSaturday: karaoke with Howard.\nSunday: go hiking.",
};

const g4 = [
  { number: 1, taskType: 'A-SOUND', dimension: '語音聽辨', question: '請聽語音，選出正確的字母：', options: choices('R', 'L', 'H', 'V'), media: { audioText: 'R' }, explanation: '音檔念出英文字母 R，故選 ①。' },
  { number: 2, taskType: 'A-SOUND', dimension: '語音聽辨', question: '請聽語音，選出正確的字詞：', options: choices('Matt', 'myth', 'math', 'moth'), media: { audioText: 'math' }, explanation: '音檔單字為 math，正確拼字是選項 ③。' },
  { number: 3, taskType: 'A-SOUND', dimension: '語音聽辨', question: '請聽語音，選出正確的字詞：', options: choices('fine', 'fin', 'fun', 'fan'), media: { audioText: 'fun' }, explanation: '音檔單字為 fun，正確拼字是選項 ③。' },
  { number: 4, taskType: 'A-SOUND', dimension: '語音聽辨', question: '請聽語音，選出正確的字詞：', options: choices('Surry', 'sunny', 'silly', 'Sally'), media: { audioText: 'silly' }, explanation: '音檔單字為 silly，正確拼字是選項 ③。' },
  { number: 5, taskType: 'A-SOUND', dimension: '語音聽辨', question: '請聽語音，選出正確的字詞：', options: choices('ball', 'tall', 'doll', 'draw'), media: { audioText: 'draw' }, explanation: '音檔單字為 draw，正確拼字是選項 ④。' },
  { number: 6, taskType: 'A-SOUND', dimension: '語音聽辨', question: '請聽語音，選出正確的字詞：', options: choices('train', 'tree', 'tall', 'tired'), media: { audioText: 'tired' }, explanation: '音檔單字為 tired，正確拼字是選項 ④。' },
  { number: 7, taskType: 'L-SENT', dimension: '辨識句意', question: '請聽句子，選出符合爺爺年齡的圖片：', options: choices('圖片 ①（19 歲）', '圖片 ②（9 歲）', '圖片 ③（39 歲）', '圖片 ④（90 歲）'), image: image(4, 7), media: { audioText: 'My grandpa is ninety years old.' }, explanation: '音檔說爺爺 90 歲，圖片 ④ 的蛋糕數字為 90。' },
  { number: 8, taskType: 'L-SENT', dimension: '辨識句意', question: '請聽句子，選出正確的書店明細：', options: choices('明細 ①', '明細 ②', '明細 ③', '明細 ④'), image: image(4, 8), media: { audioText: 'I bought two erasers and seven pens.' }, explanation: '音檔說買了 2 個橡皮擦和 7 枝筆，明細 ② 相符。' },
  { number: 9, taskType: 'L-RESP', dimension: '生活辭句回應', question: '請聽問句，選出最適合的情境圖片：', options: choices('圖片 ①（受傷時被關心）', '圖片 ②（課堂教學）', '圖片 ③（放學時間）', '圖片 ④（運動場受傷）'), image: image(4, 9), media: { audioText: 'Are you okay?' }, explanation: 'Are you okay? 用來關心受傷或不舒服的人；圖片 ① 最符合。' },
  { number: 10, taskType: 'L-CONV', dimension: '言談理解', question: '請聽對話，選出橡皮擦所在位置：', options: choices('圖片 ①（書桌下）', '圖片 ②（椅子下）', '圖片 ③（桌上）', '圖片 ④（箱子上）'), image: image(4, 10), media: { audioText: "A: Andy, do you see my eraser?\nB: Oh, it's under your desk.\nA: Here it is. Thank you." }, explanation: '對話明確說橡皮擦在書桌下，圖片 ① 相符。' },
  { number: 11, taskType: 'L-CONV', dimension: '言談理解', question: '請聽對話，選出爸爸所在的房間：', options: choices('圖片 ①（客廳）', '圖片 ②（餐廳）', '圖片 ③（臥室）', '圖片 ④（廚房）'), image: image(4, 11), media: { audioText: "Child: Dad, where are you?\nDad: I'm in the kitchen." }, explanation: '爸爸回答自己在 kitchen（廚房），故選圖片 ④。' },
  { number: 12, taskType: 'L-RESP', dimension: '生活辭句回應', question: '請聽問句，選出最適合的回答：', options: choices("I'm thirsty.", "It's red.", "It's rainy.", "It's big."), media: { audioText: "How's the weather?" }, explanation: 'How’s the weather? 詢問天氣，It’s rainy. 是合適回答。' },
  { number: 13, taskType: 'L-CONV', dimension: '言談理解', question: '請聽對話，選出時間與活動相符的圖片：', options: choices('圖片 ①（閱讀）', '圖片 ②（5:45 吃晚餐）', '圖片 ③（打球）', '圖片 ④（搭車）'), image: image(4, 13), media: { audioText: "A: What time is it?\nB: It's five forty-five. It's time to have dinner." }, explanation: '對話說 5:45 且該吃晚餐了，圖片 ② 相符。' },
  { number: 14, taskType: 'L-CONV', dimension: '言談理解', question: '請聽對話，選出符合送禮情境的圖片：', options: choices('圖片 ①（送禮給媽媽）', '圖片 ②（萬聖節裝扮）', '圖片 ③（包粽子）', '圖片 ④（做手工藝）'), image: image(4, 14), media: { audioText: "Child: Mom, this is for you.\nMom: A gift! Thank you. I can't wait to open it." }, explanation: '孩子把禮物送給媽媽，圖片 ① 最符合。' },
  { number: 15, taskType: 'L-CONV', dimension: '言談理解', question: '請聽對話，選出正確的聖誕節待辦清單：', options: choices('清單 ①', '清單 ②', '清單 ③', '清單 ④'), image: image(4, 15), media: { audioText: "A: Christmas is coming. What are we going to do? Let's make a to-do list.\nB: Okay. There are three things to do.\nA: What are they?\nB: Here is our Christmas to-do list." }, explanation: '清單 ② 的禮物、聖誕樹與聖誕襪都是聖誕節活動，故選 ②。' },
  { number: 16, taskType: 'R-LETTER', dimension: '字母辨識', question: '選出與大寫「QUOKKA」相對應的正確小寫：', options: choices('guokka', 'Puakko', 'puokka', 'quokka'), explanation: 'QUOKKA 的正確小寫為 quokka。' },
  { number: 17, taskType: 'R-LETTER', dimension: '字母辨識', question: '選出圖片中文字完全相同的大寫拼法：', options: choices('TED STEVENS ANCHORAGE INTERNATIONAL AIRPORT', 'TED SFEVENS ANCHORAQE INFERNATIONAL AIRPORT', 'TED STEVEMS ANCHORAGE IMTERMATIONAL AIRPORT', 'TED SFEVEMS AMCHORAQE INFERMATIONAL AIRPORT'), image: image(4, 17), explanation: '機場招牌為 TED STEVENS ANCHORAGE INTERNATIONAL AIRPORT，選項 ① 完全相同。' },
  { number: 18, taskType: 'R-PIC', dimension: '字意理解', question: '選出總金額為 forty-five（45）的圖片：', options: choices('圖片 ①', '圖片 ②', '圖片 ③', '圖片 ④'), image: image(4, 18), explanation: '圖片 ② 為 10＋10＋10＋10＋5＝45。' },
  { number: 19, taskType: 'R-PIC', dimension: '字意理解', question: '選出 bathroom（浴室）的圖片：', options: choices('圖片 ①（教室）', '圖片 ②（臥室）', '圖片 ③（浴室）', '圖片 ④（客廳）'), image: image(4, 19), explanation: '圖片 ③ 有浴缸與洗手台，是 bathroom。' },
  { number: 20, taskType: 'R-PIC', dimension: '字意理解', question: '選出同時有 watermelon and juice 的圖片：', options: choices('圖片 ①', '圖片 ②', '圖片 ③', '圖片 ④'), image: image(4, 20), explanation: '圖片 ③ 同時有西瓜與瓶裝果汁。' },
  { number: 21, taskType: 'R-PIC', dimension: '圖文理解', question: 'Look at the picture. 選出與圖片相符的句子：', options: choices('Cool! The dog is under the cat.', 'Great! The cat is on the chicken.', 'Wow! The chicken is under the cat.', 'Look! The dog is on the chicken.'), image: image(4, 21), explanation: '圖中動物由下而上是驢、狗、貓、雞；狗在貓下面，故選 ①。' },
  { number: 22, taskType: 'R-PIC', dimension: '圖文理解', question: "Ryan is a student. He's eight. He's tall. He can dance and sing.", options: choices('圖片 ①（打籃球）', '圖片 ②（唱歌跳舞）', '圖片 ③（畫畫）', '圖片 ④（游泳）'), image: image(4, 22), explanation: '描述指出 Ryan 會跳舞與唱歌，圖片 ② 相符。' },
  { number: 23, taskType: 'R-PIC', dimension: '圖文理解', question: '請看圖片，選出正確描述物品位置的句子：', options: choices('The book is under the desk. The ruler is under the book.', 'The pencil is on the book. The eraser is on the pencil.', 'The eraser is on the book. The ruler is under the desk.', 'The ruler is on the desk. The pencil is on the book.'), image: image(4, 23), explanation: '圖中尺在桌上、鉛筆在書本上，故選 ④。' },
  { number: 24, taskType: 'R-PIC', dimension: '圖文理解', question: '請看圖片，選出符合天氣與人物活動的句子：', options: choices("It's hot and windy. I'm in the dining room.", "It's hot and windy. I'm drawing.", "It's cold and windy. I'm in the living room.", "It's cold and windy. I'm writing."), image: image(4, 24), explanation: '溫度計顯示 5°C、窗外有風，人物在客廳，故選 ③。' },
  { number: 25, taskType: 'R-PIC', dimension: '圖文理解', question: 'Which is true? 請依水果盤選出正確敘述：', options: choices('There are three small oranges and four big papayas.', 'There are five small papayas and three big oranges.', 'There are four big papayas and ten small bananas.', 'There are three big oranges and four small bananas.'), image: image(4, 25), explanation: '圖中有 5 個小木瓜與 3 個大橘子，故選 ②。' },
  { number: 26, taskType: 'R-RESP', dimension: '生活辭句回應', question: 'Do you want some water?', options: choices("Yes, please. I'm thirsty.", "No worries. She's full.", "Yes, I am. I'm thirty.", "Why not? She's full."), explanation: '詢問是否想喝水，以 Yes, please. I’m thirsty. 回答最自然。' },
  { number: 27, taskType: 'R-RESP', dimension: '生活辭句回應', question: 'Where are you going?', options: choices("I'm going to be OK.", "I'm going to be happy.", "I'm going to read a book.", "I'm going to my bedroom."), explanation: 'Where 詢問目的地，I’m going to my bedroom. 回答地點。' },
  { number: 28, taskType: 'R-RESP', dimension: '生活辭句回應', question: 'How old are you?', options: choices("I'm fine. Thank you.", 'I like pink.', 'I have seven pencils.', "I'm ten years old."), explanation: 'How old 詢問年齡，故選 I’m ten years old.。' },
  { number: 29, taskType: 'R-PIC', dimension: '文化理解', question: "It's twelve o'clock! Let's stand the eggs! What day is today?", options: choices('Mother’s Day', 'Dragon Boat Festival', 'Moon Festival', 'Chinese New Year'), image: image(4, 29), explanation: '中午立蛋是端午節活動，故選圖片 ②。' },
  { number: 30, taskType: 'R-PIC', dimension: '文化理解', question: "Tomorrow is Halloween. I'm going trick-or-treating. I want to be a witch. I need some bags and costume.", options: choices('圖片 ①（糖果）', '圖片 ②（稻草人）', '圖片 ③（南瓜）', '圖片 ④（女巫服裝與袋子）'), image: image(4, 30), explanation: '女巫裝扮與裝糖果的袋子在圖片 ④。' },
  { number: 31, taskType: 'R-COMP', dimension: '短文理解', groupId: 'saa-113-g4-family-1', passage: G4_FAMILY_1, question: 'Who is Andy?', options: choices("Anna is Andy's mother.", "He's Bonnie's father.", "He is Anna's brother.", "Andy is Bonnie's brother."), explanation: 'Anna 是 Andy 的姊妹，因此 Andy 是 Anna 的兄弟，故選 ③。' },
  { number: 32, taskType: 'R-COMP', dimension: '短文理解', groupId: 'saa-113-g4-family-1', passage: G4_FAMILY_1, question: 'Which is true?', options: choices('A = sister', 'B = father', 'C = mother', 'D = thirty-six'), image: material('g4_family_1_diagram'), explanation: '家族圖中 B 表示 Bonnie 與 Ben 的父女關係，故 B = father。' },
  { number: 33, taskType: 'R-COMP', dimension: '短文理解', groupId: 'saa-113-g4-family-2', passage: G4_FAMILY_2, question: "This is Tina's dad.", options: choices('圖片 ①', '圖片 ②', '圖片 ③', '圖片 ④'), optionImages: ['g4_q33_a', 'g4_q33_b', 'g4_q33_c', 'g4_q33_d'].map(material), explanation: 'Tina 的爸爸喜歡貓且會畫畫，圖片 ③ 相符。' },
  { number: 34, taskType: 'R-COMP', dimension: '短文理解', groupId: 'saa-113-g4-family-2', passage: G4_FAMILY_2, question: 'Who is she?', options: choices("She's Joe's mom.", "She's Ken's grandma.", "She's Joe's sister.", "She's Amy's mom."), image: material('g4_q34_police'), explanation: '圖片人物是女警；短文說 Joe 的姊姊是警察，故選 ③。' },
  { number: 35, taskType: 'R-COMP', dimension: '短文理解', groupId: 'saa-113-g4-family-2', passage: G4_FAMILY_2, question: 'Which is NOT true?', options: choices('Joe wants to be a doctor.', "Amy's dad is tall.", "Ken's grandfather is a teacher.", "Amy's mom can sing."), explanation: 'Joe 想當警察，不是醫生，因此選項 ① 是不正確的敘述。' },
];

const g5 = [
  { number: 1, taskType: 'A-SOUND', dimension: '語音聽辨', question: '請聽語音，選出正確的字詞：', options: choices('pill', 'Phil', 'hill', 'wheel'), media: { audioText: 'Phil' }, explanation: '音檔念出人名 Phil，故選 ②。' },
  { number: 2, taskType: 'A-SOUND', dimension: '語音聽辨', question: '請聽語音，選出正確的字詞：', options: choices('bait', 'bake', 'bad', 'date'), media: { audioText: 'bait' }, explanation: '音檔單字為 bait，故選 ①。' },
  { number: 3, taskType: 'A-SOUND', dimension: '語音聽辨', question: '請聽語音，選出正確的數字：', options: choices('nine', 'nineteen', 'ninety', 'night'), media: { audioText: 'ninety' }, explanation: '音檔數字為 ninety（90），故選 ③。' },
  { number: 4, taskType: 'L-WORD', dimension: '辭彙聽辨', question: '請聽單字，選出正確的圖片：', options: choices('圖片 ①（太陽眼鏡）', '圖片 ②（手套）', '圖片 ③（襪子）', '圖片 ④（鞋子）'), image: image(5, 4), media: { audioText: 'shoes' }, explanation: '音檔單字為 shoes，圖片 ④ 是鞋子。' },
  { number: 5, taskType: 'L-WORD', dimension: '辭彙聽辨', question: '請聽數字，選出正確選項：', options: choices('Two hundred and fifteen', 'Two hundred and twenty-five', 'Two hundred and fifty-five', 'Three hundred and fifty-five'), media: { audioText: 'Two hundred and fifty-five.' }, explanation: '音檔為 255，英文是 two hundred and fifty-five，故選 ③。' },
  { number: 6, taskType: 'L-SENT', dimension: '辨識句意', question: '請聽句子，選出正確的圖片：', options: choices('圖片 ①（打掃）', '圖片 ②（吃飯）', '圖片 ③（唱歌）', '圖片 ④（回家）'), image: image(5, 6), media: { audioText: "Let's clean up." }, explanation: 'Let’s clean up. 表示一起打掃，圖片 ① 相符。' },
  { number: 7, taskType: 'L-SENT', dimension: '辨識句意', question: '請聽句子，選出正確的圖片：', options: choices('圖片 ①（寒冷）', '圖片 ②（肚子餓）', '圖片 ③（疲倦）', '圖片 ④（跳舞）'), image: image(5, 7), media: { audioText: "I'm tired. Let's take a break." }, explanation: '說話者表示 tired（疲倦）並想休息，圖片 ③ 相符。' },
  { number: 8, taskType: 'L-SENT', dimension: '辨識句意', question: '請聽句子，選出符合生肖年與紅包情境的圖片：', options: choices('圖片 ①', '圖片 ②', '圖片 ③', '圖片 ④'), image: image(5, 8), media: { audioText: 'It is 2024, the Year of the Dragon. Grandma gives Nina a red envelope.' }, explanation: '2024 是龍年，且奶奶給 Nina 紅包；圖片 ① 符合紅包圖案的龍年情境。' },
  { number: 9, taskType: 'L-RESP', dimension: '生活辭句回應', question: 'Amy 很難過正在哭。請聽敘述，選出最適合對她說的話：', options: choices('Amy, are you okay?', 'Amy, what time is it?', 'You are welcome, Amy.', 'Thank you very much, Amy.'), media: { audioText: 'Amy is sad. She is crying. What can you say to Amy?' }, explanation: '關心正在哭的 Amy，最適合問 Amy, are you okay?。' },
  { number: 10, taskType: 'L-CONV', dimension: '言談理解', question: '請聽敘述並參考作息表，選出正確時間：', options: choices("It's six o'clock.", "It's seven thirty.", "It's nine o'clock.", 'Yes, he is.'), image: image(5, 10), media: { audioText: "It's time to go to bed. What time is it?" }, explanation: '作息表顯示 9:00 PM 上床睡覺，故選 It’s nine o’clock.。' },
  { number: 11, taskType: 'L-CONV', dimension: '言談理解', question: '請聽點名對話，選出箭頭所指女孩的資訊：', options: choices('She is Judy.', 'She is nine.', 'She is next to Andy.', 'She is the teacher.'), image: image(5, 11), media: { audioText: "Teacher: Line up, please. Three, two, one. Are you ready?\nChildren: Yes!\nTeacher: When I call your name, please raise your hand and say here. Jason.\nJason: Here.\nTeacher: Judy.\nJudy: Here.\nTeacher: Kevin.\nKevin: Here.\nTeacher: Andy.\nAndy: Here.\nTeacher: Okay, let's play a game.\nChildren: Hooray!\nNarrator: What's her name?" }, explanation: '點名順序與箭頭位置顯示她是 Judy，故選 ①。' },
  { number: 12, taskType: 'L-CONV', dimension: '言談理解', question: '請聽對話，選出 Kevin 所在的位置：', options: choices("He's in the living room.", "He's in the kitchen.", "He's in the car.", "He's in the library."), media: { audioText: "A: Kevin, what are you doing?\nKevin: I'm doing the dishes.\nNarrator: Where is he?" }, explanation: 'Kevin 正在洗碗，最合理的位置是 kitchen，故選 ②。' },
  { number: 13, taskType: 'L-CONV', dimension: '言談理解', question: '請聽對話，選出正確的購物清單：', options: choices('橘子、葡萄、芭樂', '橘子、蘋果、檸檬', '橘子、蘋果、香蕉', '木瓜、葡萄、香蕉'), image: image(5, 13), media: { audioText: "A: I want to make some fruit salad. Let's go shopping.\nB: What do we need?\nA: I want some oranges and apples. How about you?\nB: I want some bananas.\nA: Great! Let's go.\nNarrator: What's on their shopping list?" }, explanation: '對話列出 oranges、apples、bananas，故選清單 ③。' },
  { number: 14, taskType: 'L-CONV', dimension: '言談理解', groupId: 'saa-113-g5-map', question: '請聽對話並看地圖：Kate 和 Bob 現在在哪裡？', options: choices('They are at Taipei Library.', 'They are at Taiwan Museum.', 'They are at Taipei Zoo.', 'They are at Mega Bank.'), image: image(5, 14), media: { audioText: "Kate: Where are we now, Bob?\nBob: We are at Mega Bank.\nKate: Where are you going?\nBob: I want to visit the Taiwan Museum.\nKate: Where is it?\nBob: It's on Blue Street, Kate." }, explanation: 'Bob 明確說 We are at Mega Bank.，故選 ④。' },
  { number: 15, taskType: 'L-CONV', dimension: '言談理解', groupId: 'saa-113-g5-map', question: '請聽對話並看地圖：Kate 要去哪裡？', options: choices('She is going to Red Road.', 'She is going to Welcome Supermarket.', 'She is going to Taiwan Museum.', 'Bob is going to Taipei Library.'), image: image(5, 15), media: { audioText: "Kate: Where are we now, Bob?\nBob: We are at Mega Bank.\nKate: Where are you going?\nBob: I want to visit the Taiwan Museum.\nKate: Where is it?\nBob: It's on Blue Street, Kate." }, explanation: '對話中的目的地是 Taiwan Museum，故選 ③。' },
  { number: 16, taskType: 'R-PIC', dimension: '字意理解', question: '請看房屋剖面圖，選出 kitchen 所在的位置：', options: choices('位置 ①', '位置 ②', '位置 ③', '位置 ④'), image: image(5, 16), explanation: '廚房位於房屋左下方，箭頭標示為位置 ②。' },
  { number: 17, taskType: 'R-PIC', dimension: '字意理解', question: '請看圖片，選出正確的症狀：', options: choices('cold', 'stomachache', 'headache', 'toothache'), image: image(5, 17), explanation: '人物按著牙齒且圖示牙痛，故選 toothache。' },
  { number: 18, taskType: 'R-PIC', dimension: '字意理解', question: '請看圖片，選出最相符的詞組：', options: choices('a beautiful dress', 'a beautiful scarf', 'a nice jacket', 'a nice vest'), image: image(5, 18), explanation: '圖片是 jacket（夾克），故選 a nice jacket。' },
  { number: 19, taskType: 'R-PIC', dimension: '圖文理解', question: '請看圖片，選出正確句子：', options: choices('The bird can sing.', 'The lion can dance.', 'The elephant can draw.', 'The bear can ride a bike.'), image: image(5, 19), explanation: '圖中大象正在畫畫，故選 The elephant can draw.。' },
  { number: 20, taskType: 'R-PIC', dimension: '圖文理解', question: 'There are ______.', options: choices('a horse', 'eighty turtles', 'eighteen zebras', 'eight horses'), image: image(5, 20), explanation: '圖中共有八匹馬，故選 eight horses。' },
  { number: 21, taskType: 'R-PIC', dimension: '生活指令', question: 'Wash your hands. 選出符合指令的圖片：', options: choices('圖片 ①（洗手）', '圖片 ②（洗頭）', '圖片 ③（拍手）', '圖片 ④（刷牙）'), image: image(5, 21), explanation: '圖片 ① 是在水龍頭下洗手，符合 Wash your hands.。' },
  { number: 22, taskType: 'R-PIC', dimension: '生活指令', question: 'Circle the word “cat”. 選出符合指令的圖片：', options: choices('圖片 ①', '圖片 ②', '圖片 ③', '圖片 ④'), image: image(5, 22), explanation: '圖片 ② 將單字 cat 圈起來，符合指令。' },
  { number: 23, taskType: 'R-PIC', dimension: '圖表理解', question: "This is Will's weekly plan. Which is true?", options: choices("It's cloudy on Monday.", "It's sunny on Friday.", "It's hot on Wednesday.", "It's rainy on Saturday."), image: image(5, 23), explanation: '週計畫中 Friday 圈選的是 sunny，故選 ②。' },
  { number: 24, taskType: 'R-MATH', dimension: '生活應用', question: 'Jane was born in 2017. It is 2024 now. How old is Jane?', options: choices('She is seventeen years old.', 'She is eleven years old.', 'She is seven years old.', 'She is five years old.'), explanation: '2024－2017＝7，Jane 七歲，故選 ③。' },
  { number: 25, taskType: 'R-PIC', dimension: '圖表理解', question: "Jay's friends show their feelings for his post. Which is true?", options: choices('George is happy.', "Three of Jay's friends are angry.", "Two of Jay's friends are happy.", 'Ruby is sad.'), image: image(5, 25), explanation: 'Ruby 旁的表情是 sad，故選 Ruby is sad.。' },
  { number: 26, taskType: 'R-PIC', dimension: '生活應用', question: 'Which is true? 請依餐廳菜單與點餐圖選出正確敘述：', options: choices('The hamburger is forty dollars.', 'The hot dog is forty-five dollars.', 'The girl wants some milk and juice.', 'The girl wants a hot dog, some noodles and some juice.'), image: image(5, 26), explanation: '菜單標示 hot dog 為 $45，故選 ②。' },
  { number: 27, taskType: 'R-PIC', dimension: '圖文理解', question: 'The cook is short and heavy.', options: choices('圖片 ①（矮胖廚師）', '圖片 ②（高瘦老師）', '圖片 ③（護士）', '圖片 ④（消防員）'), image: image(5, 27), explanation: '圖片 ① 是矮胖的廚師，與句子相符。' },
  { number: 28, taskType: 'R-PIC', dimension: '圖文理解', question: "Hank doesn't have a pencil. He says: “Lily, may I borrow your pencil?”", options: choices('圖片 ①（同學借鉛筆）', '圖片 ②（同學借書）', '圖片 ③（進教室）', '圖片 ④（上廁所）'), image: image(5, 28), explanation: '圖片 ① 顯示男生向同學借鉛筆，故選 ①。' },
  { number: 29, taskType: 'R-PIC', dimension: '文化理解', question: '請看圖片，選出正確的節慶敘述：', options: choices("We get lucky money on Chinese New Year's Eve.", 'We paint pomelo hats on Moon Festival.', 'We sing Christmas songs on Christmas.', 'We stand eggs on Dragon Boat Festival.'), image: image(5, 29), explanation: '圖中人物正在端午節正午立蛋，故選 ④。' },
  { number: 30, taskType: 'R-PIC', dimension: '文化理解', question: '請看 12/24～12/25 的促銷廣告，判斷是哪個節日：', options: choices('Christmas', 'Easter', 'Halloween', 'New Year'), image: image(5, 30), explanation: '12 月 24 至 25 日且有聖誕老人，故選 Christmas。' },
  { number: 31, taskType: 'R-COMP', dimension: '圖表理解', groupId: 'saa-113-g5-contact', passage: G5_CONTACT, question: "Teacher Sharon has to call Harry's mother. The number is ______.", options: choices('0934-567890', '0912-345678', '0987-654321', '1985-1004'), explanation: '聯絡卡顯示 Harry 母親 Mandy 的電話是 0912-345678，故選 ②。' },
  { number: 32, taskType: 'R-COMP', dimension: '圖表理解', groupId: 'saa-113-g5-contact', passage: G5_CONTACT, question: 'Which is true?', options: choices('Nick is eleven years old.', 'Harry is a student.', 'Sharon is a doctor.', "Mandy is Nick's sister."), explanation: '聯絡卡顯示 Harry 就讀 Sunny Elementary School 且有班級，Harry 是學生。' },
  { number: 33, taskType: 'R-COMP', dimension: '生活告示', groupId: 'saa-113-g5-museum', passage: G5_MUSEUM, question: "Windy goes to the Art Museum, but it's not open. What day is it?", options: choices("It's Sunday.", "It's Monday.", "It's Tuesday.", "It's Wednesday."), explanation: '票價表註明 Closed on Monday，故選 Monday。' },
  { number: 34, taskType: 'R-COMP', dimension: '生活告示', groupId: 'saa-113-g5-museum', passage: G5_MUSEUM, question: 'Jerry is 9 years old. Jerry’s mom is 40 years old. Their tickets are $150. What day is it?', options: choices("It's Wednesday.", "It's Thursday.", "It's Friday.", "It's Saturday."), explanation: '週末兒童 $50、成人 $100，共 $150；選項中只有 Saturday 是週末。' },
  { number: 35, taskType: 'R-COMP', dimension: '生活告示', groupId: 'saa-113-g5-museum', passage: G5_MUSEUM, question: 'What can we do in the museum?', options: choices('We can eat hamburgers.', 'We can drink soda.', 'We can walk the dog.', 'We can see paintings.'), explanation: '告示禁止飲食與寵物；在美術館可以看畫作，故選 ④。' },
];

const g6 = [
  { number: 1, taskType: 'A-SOUND', dimension: '語音聽辨', question: '請聽語音，選出正確的字詞：', options: choices('park', 'pork', 'perk', 'pink'), media: { audioText: 'park' }, explanation: '音檔單字為 park，故選 ①。' },
  { number: 2, taskType: 'A-SOUND', dimension: '語音聽辨', question: '請聽語音，選出正確的拼字：', options: choices('edusation', 'education', 'educatable', 'educationist'), media: { audioText: 'education' }, explanation: '音檔單字為 education，正確拼字是選項 ②。' },
  { number: 3, taskType: 'A-SOUND', dimension: '語音聽辨', question: '請聽語音，選出正確的星期：', options: choices('Sunday', 'Saturday', 'Tuesday', 'Thursday'), media: { audioText: 'Tuesday' }, explanation: '音檔念出 Tuesday，故選 ③。' },
  { number: 4, taskType: 'A-SOUND', dimension: '語音聽辨', question: '請聽語音，選出正確的字詞：', options: choices('glass', 'gloves', 'gifts', 'glaze'), media: { audioText: 'glass' }, explanation: '音檔單字為 glass，故選 ①。' },
  { number: 5, taskType: 'L-WORD', dimension: '辭彙聽辨', question: '請聽數字，選出正確選項：', options: choices('76', '706', '67', '607'), media: { audioText: 'seventy-six' }, explanation: '音檔數字為 seventy-six（76），故選 ①。' },
  { number: 6, taskType: 'L-SENT', dimension: '辨識句意', question: '請聽指令，選出正確的圖片：', options: choices('圖片 ①（打開書）', '圖片 ②（闔上書）', '圖片 ③（舉手）', '圖片 ④（放下手）'), image: image(6, 6), media: { audioText: 'Open your book.' }, explanation: 'Open your book. 表示打開書本，圖片 ① 相符。' },
  { number: 7, taskType: 'L-CONV', dimension: '言談理解', question: '請聽對話，選出星期日 9:30 的活動圖片：', options: choices('圖片 ①（9:30 睡覺）', '圖片 ②（9:30 吃飯）', '圖片 ③（9:30 吃早餐）', '圖片 ④（9:30 起床）'), image: image(6, 7), media: { audioText: "A: What time do you get up on Sunday?\nB: I get up at nine thirty on Sunday." }, explanation: '對話說星期日 9:30 起床，圖片 ④ 相符。' },
  { number: 8, taskType: 'L-SENT', dimension: '辨識句意', question: '請聽敘述，選出 Laura 的國家圖片：', options: choices('圖片 ①（美國）', '圖片 ②（新加坡）', '圖片 ③（澳洲）', '圖片 ④（英國）'), image: image(6, 8), media: { audioText: 'Look at the picture. Laura is my new friend. She is from Singapore.' }, explanation: 'Laura 來自 Singapore，圖片 ② 是新加坡。' },
  { number: 9, taskType: 'L-CONV', dimension: '言談理解', question: '請聽點餐內容，選出正確圖片：', options: choices('冰淇淋與兩盤義大利麵', '牛奶與兩盤義大利麵', '冰淇淋與兩碗飯', '牛奶與兩碗飯'), image: image(6, 9), media: { audioText: 'A: What would you like?\nB: I would like a glass of milk and two plates of spaghetti.' }, explanation: '點餐內容是 1 杯牛奶和 2 盤義大利麵，圖片 ② 相符。' },
  { number: 10, taskType: 'L-RESP', dimension: '生活辭句回應', question: '請聽問句，選出所詢問的 Lily 物品：', options: choices('圖片 ①（車）', '圖片 ②（罐子）', '圖片 ③（鞋子）', '圖片 ④（帽子）'), image: image(6, 10), media: { audioText: "Whose cap is it?" }, explanation: '問句詢問 cap（帽子）是誰的，圖片 ④ 是 Lily 的帽子。' },
  { number: 11, taskType: 'L-RESP', dimension: '生活辭句回應', question: '請聽問句，選出最適合的圖片答案：', options: choices('圖片 ①（雪人）', '圖片 ②（手錶 5:28）', '圖片 ③（遊戲機）', '圖片 ④（3 月 7 日星期四）'), image: image(6, 11), media: { audioText: 'I lost count of the days after being sick for many days. What day is today?' }, explanation: '問句詢問今天星期幾，日曆圖片 ④ 顯示 Thursday，故選 ④。' },
  { number: 12, taskType: 'L-RESP', dimension: '生活辭句回應', question: '請聽問句，選出最適合的回答：', options: choices('I am from Taiwan.', 'I am in Taipei.', 'I am going to Taichung.', 'I can get to Tainan by bus.'), media: { audioText: 'Where are you from?' }, explanation: 'Where are you from? 詢問來自哪裡，I am from Taiwan. 最合適。' },
  { number: 13, taskType: 'L-RESP', dimension: '生活辭句回應', question: '請聽句子，選出最適合的回應：', options: choices("No, I don't have a watch.", 'Yes, it is sunny outside.', 'Thank you!', 'Me, too.'), media: { audioText: 'Watch out!' }, explanation: 'Watch out! 是提醒小心，受提醒者以 Thank you! 回應最合適。' },
  { number: 14, taskType: 'L-CONV', dimension: '言談理解', groupId: 'saa-113-g6-halloween', question: '請聽對話，判斷是哪個節日：', options: choices('New Year', 'Christmas', 'Halloween', "Father's Day"), media: { audioText: "A: Knock, knock!\nB: Wow, Cindy! You dressed up as a vampire!\nCindy: Yes. Well, Peter, are you a ghost?\nPeter: No, I am a mummy.\nCindy: Oh, never mind. You look really cool.\nPeter: Thank you. Hey, let's practice the chant.\nCindy: Sure.\nBoth: Trick or treat, smell my feet, give me something good to eat!\nCindy: Amazing! Let's go." }, explanation: '對話有變裝、Trick or treat，明確是 Halloween。' },
  { number: 15, taskType: 'L-CONV', dimension: '言談理解', groupId: 'saa-113-g6-halloween', question: '請聽對話，選出正確敘述：', options: choices('Cindy dressed up as a mummy.', 'Peter dressed up as a ghost.', 'Cindy dressed up as a vampire.', 'Peter dressed up as a dragon.'), media: { audioText: "A: Knock, knock!\nB: Wow, Cindy! You dressed up as a vampire!\nCindy: Yes. Well, Peter, are you a ghost?\nPeter: No, I am a mummy.\nCindy: Oh, never mind. You look really cool.\nPeter: Thank you. Hey, let's practice the chant.\nCindy: Sure.\nBoth: Trick or treat, smell my feet, give me something good to eat!" }, explanation: '對話明確說 Cindy dressed up as a vampire.，故選 ③。' },
  { number: 16, taskType: 'R-PIC', dimension: '圖文理解', question: 'The movie is so great. We ordered one hot dog and two cups of juice.', options: choices('圖片 ①', '圖片 ②', '圖片 ③', '圖片 ④'), image: image(6, 16), explanation: '圖片 ② 位於電影院，人物拿著 1 個熱狗與 2 杯果汁。' },
  { number: 17, taskType: 'R-PIC', dimension: '圖文理解', question: "My favorite season is summer. It's hot, and I enjoy going to the park a lot.", options: choices('圖片 ①（晴天海邊）', '圖片 ②（晴天公園）', '圖片 ③（颳風海邊）', '圖片 ④（颳風公園）'), image: image(6, 17), explanation: '句子說炎熱夏天且喜歡去公園，晴天公園的圖片 ② 最符合。' },
  { number: 18, taskType: 'R-PIC', dimension: '圖表理解', question: '請看服飾價目圖，選出正確敘述：', options: choices('The skirt is seven hundred and fifteen dollars.', 'The socks are five hundred and fifty dollars.', 'The pants are five hundred and fifty dollars.', 'The dress is seven hundred and fifteen dollars.'), image: image(6, 18), explanation: '圖中洋裝標價 $715，故選 The dress is seven hundred and fifteen dollars.。' },
  { number: 19, taskType: 'R-PIC', dimension: '圖文理解', question: '請看圖片，選出正確敘述：', options: choices('The lion is at a museum.', 'The tiger is at a restaurant.', 'The lion is at a movie theater.', 'The tiger is at a train station.'), image: image(6, 19), explanation: '圖中獅子展示於博物館，故選 ①。' },
  { number: 20, taskType: 'R-PIC', dimension: '生活辭句', question: '請看圖片，選出最符合人物想法的問句：', options: choices('Whose gloves are those?', 'Where are my glasses?', 'How much is this glass?', 'Why are my gloves here?'), image: image(6, 20), explanation: '人物戴著眼鏡卻在找眼鏡，想法圖示也是 glasses，故選 Where are my glasses?。' },
  { number: 21, taskType: 'R-CLOZE', dimension: '語意與文法', question: "It's ______ in summer in Taiwan. I want to buy these ______.", options: choices('hot / sweaters', 'hot / T-shirts', 'cold / shorts', 'cold / gloves'), explanation: '臺灣夏天炎熱，適合買 T-shirts，故選 hot / T-shirts。' },
  { number: 22, taskType: 'R-CLOZE', dimension: '語意與文法', question: 'I have a sore throat and runny nose. Maybe I have a ______. I will go see a doctor later.', options: choices('cold', 'cool', 'cow', 'cod'), explanation: '喉嚨痛與流鼻水是感冒症狀，have a cold 表示感冒。' },
  { number: 23, taskType: 'R-CLOZE', dimension: '語意與文法', question: 'Penny likes to _____ in the ______ in her free time.', options: choices('sing / library', 'drive / hospital', 'swim / gym', 'draw / bank'), explanation: '在 gym 游泳是四個選項中語意合理的搭配，故選 swim / gym。' },
  { number: 24, taskType: 'R-CLOZE', dimension: '語意與文法', question: 'Leonard and Sheldon like to ______ in a bookstore on weekends.', options: choices('buy lunch', 'go dancing', 'go fishing', 'buy comic books'), explanation: '在 bookstore 可以買 comic books，故選 ④。' },
  { number: 25, taskType: 'R-CLOZE', dimension: '語意與文法', question: 'Howard has a sweet tooth and he never brushes his teeth. Now he has a ______.', options: choices('tooth fairy', 'teeth', 'toothache', 'tooth gems'), explanation: '愛吃甜食又不刷牙容易 toothache（牙痛），故選 ③。' },
  { number: 26, taskType: 'R-CLOZE', dimension: '語意與文法', question: "Raj's favorite subject is ______. He likes to play the guitar, and he's very good at it.", options: choices('science', 'PE', 'social studies', 'music'), explanation: '會彈吉他與 music 科目相關，故選 ④。' },
  { number: 27, taskType: 'R-CLOZE', dimension: '語意與文法', question: "I am so ______. Let's go to the ______ nearby!", options: choices('happy / post office', 'hungry / bakery', 'sad / school', 'angry / library'), explanation: '肚子餓可以去 bakery，故選 hungry / bakery。' },
  { number: 28, taskType: 'R-RESP', dimension: '生活辭句回應', question: 'A: What are you doing?\nB: ______.', options: choices("I'm fine.", "I'm hungry.", "I'm in the kitchen.", "I'm cooking."), explanation: 'What are you doing? 詢問正在做的事，I’m cooking. 回答最合適。' },
  { number: 29, taskType: 'R-CLOZE', dimension: '文化理解', question: 'Today is Chinese New Year. I ______.', options: choices('get lucky money', 'go on an egg hunt', 'get a Christmas gift', 'eat a rice dumpling'), explanation: '農曆新年會收到 lucky money（紅包），故選 ①。' },
  { number: 30, taskType: 'R-PIC', dimension: '字意理解', question: "Look at Robin's Facebook story. What is ‘fit’?", options: choices('strong', 'angry', 'sad', 'sick'), image: material('g6_q30_story'), explanation: '貼文以 Fit, healthy, happy 描述運動狀態；fit 在此意為 strong、健康強壯。' },
  { number: 31, taskType: 'R-COMP', dimension: '短文理解', groupId: 'saa-113-g6-letter', passage: G6_LETTER, question: 'Which is true?', options: choices('Taylor and Stella are new friends.', 'Taylor is going to the school on Moon Festival.', 'Taylor wants to have lunch with Stella.', 'There is a new museum in the zoo.'), explanation: '信中明確提到 There is a new museum opening in the zoo.，故選 ④。' },
  { number: 32, taskType: 'R-COMP', dimension: '短文理解', groupId: 'saa-113-g6-letter', passage: G6_LETTER, question: "Which is Taylor's school?", options: choices('1', '2', '3', '4'), image: material('g6_q32_map'), explanation: 'Taylor 的學校在 Turtle Street 且在公園旁，地圖位置 ③ 符合。' },
  { number: 33, taskType: 'R-COMP', dimension: '短文理解', groupId: 'saa-113-g6-letter', passage: G6_LETTER, question: "Who is Taylor's favorite teacher?", options: choices('圖片 ①', '圖片 ②', '圖片 ③', '圖片 ④'), optionImages: ['g6_q33_a', 'g6_q33_b', 'g6_q33_c', 'g6_q33_d'].map(material), explanation: '信中說最喜歡英文老師，老師長髮、戴眼鏡且穿洋裝，圖片 ② 相符。' },
  { number: 34, taskType: 'R-COMP', dimension: '圖表理解', groupId: 'saa-113-g6-planner', passage: G6_PLANNER, question: 'Today is Tuesday. Who is going to go jogging?', options: choices('Sheldon', 'Howard', 'Bernadette', 'Penny'), explanation: '週計畫寫 Tuesday: go jogging with my best friend, Penny，故選 Penny。' },
  { number: 35, taskType: 'R-COMP', dimension: '圖表理解', groupId: 'saa-113-g6-planner', passage: G6_PLANNER, question: 'Amy has to bring her markers and crayons with her to school. What day is today?', options: choices('Today is Monday.', 'Today is Tuesday.', 'Today is Thursday.', 'Today is Wednesday.'), explanation: 'markers 和 crayons 是美術課用品；週計畫的 art class 在 Thursday，故選 ③。' },
];

for (const [grade, source] of [[4, g4], [5, g5], [6, g6]]) {
  if (source.length !== 35) throw new Error(`G${grade}: expected 35 items, got ${source.length}`);
  const items = source.map((raw) => buildItem(grade, raw));
  const exportName = `SAA_113_G${grade}_QUESTIONS`;
  fs.writeFileSync(
    path.join(OUT_DIR, `saa113G${grade}.js`),
    `export const ${exportName} = ${JSON.stringify(items, null, 2)};\n`,
    'utf8',
  );
  console.log(`Wrote ${exportName}: ${items.length} questions`);
}
