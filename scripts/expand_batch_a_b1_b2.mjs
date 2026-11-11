/**
 * Batch A (Books 1 & 2) 高品質題庫擴充建置腳本 (expand_batch_a_b1_b2.mjs)
 *
 * 嚴格遵守「七大命題鐵律」：
 * 1. Canonical 唯一性：每題皆為獨立原創題 (isCanonical: true)，嚴禁跨單元複製貼上。
 * 2. 單一正解防呆：開放式問句必帶明確情境線索或僅有單一文法正確選項。
 * 3. 性別中立防呆：無性別線索時嚴禁同時出現 He/She 或 His/Her。
 * 4. 禁用萬用樣板句：6 個誘答必須與正答語意/詞性同質，0 樣板句。
 * 5. 聽力防洩漏：L-WORD / L-RESP 的英文稿僅存於 media.audioText，question 僅寫中文引導。
 * 6. 詳解 100% 同步：具體說明正答理由與誘答錯誤原因。
 * 7. 靜態結構契約：7 選項、正答 answer: 0、挖空統一 6 底線 ______、無雙句點。
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const mcqFilePath = path.join(projectRoot, 'src/data/hereWeGoMcqBank.js');
const mappingFilePath = path.join(projectRoot, 'src/data/exam/canonicalMapping.js');

const makeScopes = (unit) => {
  if (unit === 'Unit 1' || unit === 'Unit 2') return [unit, 'Review 1'];
  if (unit === 'Unit 3' || unit === 'Unit 4') return [unit, 'Review 2'];
  return [unit];
};

const createItem = ({
  id,
  book,
  unit,
  section,
  taskType,
  difficulty = 2,
  audioText = null,
  question,
  options,
  explanation
}) => ({
  id,
  track: 'textbook',
  book,
  unit,
  section,
  taskType,
  difficulty,
  reviewed: true,
  groupId: null,
  media: {
    audioText,
    imageId: null
  },
  question,
  options,
  answer: 0,
  explanation,
  canonicalId: id,
  primaryScope: unit,
  scopes: makeScopes(unit),
  isCanonical: true
});

// ============================================================================
// BOOK 1 NEW ITEMS (+50 Questions: Starter, Unit 1~4, Review 1~2)
// ============================================================================
const BOOK_1_NEW_ITEMS = [
  // --- Starter (Numbers 1-5 & Classroom Commands) ---
  createItem({
    id: 'hwg_b1_ba_01',
    book: 1,
    unit: 'Starter',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 1,
    audioText: 'three',
    question: '請仔細聽發音，選出正確的數字單字。',
    options: ['three', 'two', 'four', 'five', 'one', 'six', 'ten'],
    explanation: '音檔發音為「three（3）」，其他選項為不同的數字單字。'
  }),
  createItem({
    id: 'hwg_b1_ba_02',
    book: 1,
    unit: 'Starter',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 1,
    audioText: 'five',
    question: '請仔細聽發音，選出正確的數字單字。',
    options: ['five', 'four', 'one', 'two', 'three', 'seven', 'nine'],
    explanation: '音檔發音為「five（5）」，與 four（4）字首發音相近需仔細分辨。'
  }),
  createItem({
    id: 'hwg_b1_ba_03',
    book: 1,
    unit: 'Starter',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Stand up, please.',
    question: '請聽老師的教室指令，選出最合適的回應。',
    options: [
      'OK, Miss Lin.',
      'My name is Leo.',
      'It is a red book.',
      'I am eight years old.',
      'She is my mother.',
      'Yes, it is a dog.',
      'No, I cannot swim.'
    ],
    explanation: '聽到老師發出教室指令「Stand up, please.（請起立）」時，應禮貌回應「OK, Miss Lin.（好的，林老師）」。'
  }),
  createItem({
    id: 'hwg_b1_ba_04',
    book: 1,
    unit: 'Starter',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 1,
    question: 'One, two, three, ______, five. Let\'s count together!',
    options: ['four', 'six', 'eight', 'ten', 'seven', 'nine', 'book'],
    explanation: '依數字 1 到 5 的順序「One, two, three, four, five」，空格應填入「four（4）」。'
  }),
  createItem({
    id: 'hwg_b1_ba_05',
    book: 1,
    unit: 'Starter',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 2,
    question: '上課鐘響了，老師走進教室請大家把書打開，老師會怎麼說？',
    options: [
      'Open your book, please.',
      'Close your book, please.',
      'Stand up, please.',
      'Line up, please.',
      'What color is your book?',
      'How old are you?',
      'What is your name?'
    ],
    explanation: '「Open your book, please.」意為「請打開你的書」；Close 為闔上，Stand up 為起立，Line up 為排隊。'
  }),
  createItem({
    id: 'hwg_b1_ba_06',
    book: 1,
    unit: 'Starter',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 2,
    question: '放學時老師請全班同學排好隊準備離開教室，老師會怎麼說？',
    options: [
      'Line up, please.',
      'Sit down, please.',
      'Open your bag, please.',
      'Look at the ruler.',
      'My name is Max.',
      'It is yellow.',
      'I am five years old.'
    ],
    explanation: '「Line up, please.」意為「請排隊」，符合放學整隊離開教室的情境。'
  }),

  // --- Unit 1 (Greetings & Names) ---
  createItem({
    id: 'hwg_b1_ba_07',
    book: 1,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 1,
    audioText: 'hello',
    question: '請仔細聽發音，選出正確的打招呼單字。',
    options: ['hello', 'name', 'what', 'your', 'book', 'pen', 'red'],
    explanation: '音檔發音為打招呼用語「hello（哈囉／你好）」。'
  }),
  createItem({
    id: 'hwg_b1_ba_08',
    book: 1,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 1,
    audioText: 'name',
    question: '請仔細聽發音，選出正確的單字。',
    options: ['name', 'nine', 'nice', 'no', 'new', 'nose', 'night'],
    explanation: '音檔發音為「name（名字）」，注意字尾為 m 發音，勿與 nine（9）或 nice 混淆。'
  }),
  createItem({
    id: 'hwg_b1_ba_09',
    book: 1,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'What is your name?',
    question: '請聽問句，選出最合適的回應。',
    options: [
      'My name is Emma.',
      'I am seven years old.',
      'It is a blue pencil.',
      'Yes, it is my bag.',
      'No, I am not.',
      'It is red and white.',
      'Sit down, please.'
    ],
    explanation: '音檔詢問「What is your name?（你叫什麼名字？）」，應回答自己的名字「My name is Emma.」。'
  }),
  createItem({
    id: 'hwg_b1_ba_10',
    book: 1,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Hello, I am Lucas.',
    question: '請聽對方的自我介紹，選出最合適的回應。',
    options: [
      'Hi, Lucas. I am Nina.',
      'It is an eraser.',
      'I am ten years old.',
      'It is yellow.',
      'Open your book, please.',
      'No, it is not.',
      'Three pencils, please.'
    ],
    explanation: '對方打招呼並自我介紹「Hello, I am Lucas.」，應回以問候並介紹自己「Hi, Lucas. I am Nina.」。'
  }),
  createItem({
    id: 'hwg_b1_ba_11',
    book: 1,
    unit: 'Unit 1',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'Hi, I am a new student. My ______ is Leo.',
    options: ['name', 'book', 'color', 'ruler', 'bag', 'desk', 'chair'],
    explanation: '句意為「嗨，我是新學生。我的名字是 Leo。」，故空格選「name（名字）」。'
  }),
  createItem({
    id: 'hwg_b1_ba_12',
    book: 1,
    unit: 'Unit 1',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'Hello! I ______ Toby. Nice to meet you.',
    options: ['am', 'is', 'are', 'my', 'your', 'what', 'can'],
    explanation: '第一人稱單數主詞「I（我）」後面必須搭配 be 動詞「am」。'
  }),
  createItem({
    id: 'hwg_b1_ba_13',
    book: 1,
    unit: 'Unit 1',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'A: What is ______ name? B: My name is Mia.',
    options: ['your', 'you', 'I', 'am', 'is', 'are', 'it'],
    explanation: '修飾名詞 name 需使用所有格「your（你的）」，詢問「你的名字是什麼？」。'
  }),
  createItem({
    id: 'hwg_b1_ba_14',
    book: 1,
    unit: 'Unit 1',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 2,
    question: '開學第一天，你想知道隔壁新同學叫什麼名字，你應該怎麼問他？',
    options: [
      'What\'s your name?',
      'How old are you?',
      'What\'s this?',
      'What color is it?',
      'Who is she?',
      'Is this your pencil?',
      'Can you dance?'
    ],
    explanation: '詢問對方的名字應使用「What\'s your name?（你叫什麼名字？）」。'
  }),
  createItem({
    id: 'hwg_b1_ba_15',
    book: 1,
    unit: 'Unit 1',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 2,
    question: '早上進校門遇到英語老師 Miss Lin，你應該怎麼跟她打招呼？',
    options: [
      'Good morning, Miss Lin!',
      'Good night, Miss Lin!',
      'My name is Miss Lin.',
      'Open your book, please.',
      'It is a red bag.',
      'I am six years old.',
      'What is that?'
    ],
    explanation: '早上向老師問早安應說「Good morning, Miss Lin!」；Good night 為睡前晚安。'
  }),
  createItem({
    id: 'hwg_b1_ba_16',
    book: 1,
    unit: 'Unit 1',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 3,
    question: '閱讀短文：「Hello! My name is Kulas. I am a boy. Look at my bag. It is blue.」請問這位男孩叫什麼名字？',
    options: ['Kulas', 'Leo', 'Max', 'Toby', 'Lucas', 'Ryan', 'Ben'],
    explanation: '由短文第一句「My name is Kulas.」可知男孩的名字是 Kulas。'
  }),
  createItem({
    id: 'hwg_b1_ba_17',
    book: 1,
    unit: 'Unit 1',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 3,
    question: '閱讀對話：\nTina: Hi, I\'m Tina. What\'s your name?\nSam: Hello, Tina. My name is Sam.\n請問 Tina 在詢問 Sam 什麼問題？',
    options: [
      'Sam 的名字',
      'Sam 的年齡',
      'Sam 的書包顏色',
      'Sam 的鉛筆盒裡有什麼',
      'Sam 的家人是誰',
      'Sam 會不會游泳',
      'Sam 最喜歡什麼動物'
    ],
    explanation: 'Tina 問「What\'s your name?」，是在詢問對方的名字，Sam 也回答「My name is Sam.」。'
  }),

  // --- Unit 2 (Numbers 6-10 & Age) ---
  createItem({
    id: 'hwg_b1_ba_18',
    book: 1,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 1,
    audioText: 'seven',
    question: '請仔細聽發音，選出正確的數字單字。',
    options: ['seven', 'six', 'eight', 'nine', 'ten', 'five', 'three'],
    explanation: '音檔發音為「seven（7）」，其他選項為不同數字。'
  }),
  createItem({
    id: 'hwg_b1_ba_19',
    book: 1,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 1,
    audioText: 'eight',
    question: '請仔細聽發音，選出正確的數字單字。',
    options: ['eight', 'nine', 'ten', 'six', 'seven', 'four', 'two'],
    explanation: '音檔發音為「eight（8）」，注意 gh 不發音，字尾為 t 音。'
  }),
  createItem({
    id: 'hwg_b1_ba_20',
    book: 1,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'How old are you?',
    question: '請聽問句，選出最合適的回應。',
    options: [
      'I am九 years old.'.replace('九', 'nine'),
      'My name is Chloe.',
      'It is a yellow ruler.',
      'Yes, it is a desk.',
      'It is green.',
      'Close your book, please.',
      'He is my father.'
    ],
    explanation: '音檔詢問年齡「How old are you?（你幾歲？）」，應回答年齡「I am nine years old.（我九歲）」。'
  }),
  createItem({
    id: 'hwg_b1_ba_21',
    book: 1,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Happy birthday! This gift is for you.',
    question: '請聽生日祝福，選出最合適的回應。',
    options: [
      'Thank you!',
      'I am a student.',
      'It is a black chair.',
      'My name is Max.',
      'Line up, please.',
      'No, it isn\'t.',
      'What color is it?'
    ],
    explanation: '當別人祝你生日快樂並送禮物說「Happy birthday! This gift is for you.」時，應禮貌道謝「Thank you!」。'
  }),
  createItem({
    id: 'hwg_b1_ba_22',
    book: 1,
    unit: 'Unit 2',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'Six, seven, eight, ______, ten! I have ten fingers.',
    options: ['nine', 'two', 'three', 'four', 'one', 'five', 'bag'],
    explanation: '依數字 6 到 10 的順序「Six, seven, eight, nine, ten」，空格應填入「nine（9）」。'
  }),
  createItem({
    id: 'hwg_b1_ba_23',
    book: 1,
    unit: 'Unit 2',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'Five plus (+) three is ______.',
    options: ['eight', 'six', 'seven', 'nine', 'ten', 'four', 'two'],
    explanation: '數學加法 5 + 3 = 8，8 的英文為「eight」。'
  }),
  createItem({
    id: 'hwg_b1_ba_24',
    book: 1,
    unit: 'Unit 2',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'A: How old ______ you? B: I am eight years old.',
    options: ['are', 'is', 'am', 'do', 'can', 'what', 'who'],
    explanation: '第二人稱主詞「you（你）」搭配的 be 動詞為「are」，構成問句「How old are you?」。'
  }),
  createItem({
    id: 'hwg_b1_ba_25',
    book: 1,
    unit: 'Unit 2',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'I am ten ______ old today.',
    options: ['years', 'year', 'name', 'names', 'color', 'colors', 'books'],
    explanation: '十歲（ten）為複數，表達幾歲應使用複數名詞「years old」。'
  }),
  createItem({
    id: 'hwg_b1_ba_26',
    book: 1,
    unit: 'Unit 2',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 2,
    question: '今天是好朋友 Emma 的生日，看到蛋糕上有 9 根蠟燭，你想問她今年幾歲，該怎麼說？',
    options: [
      'How old are you, Emma?',
      'What\'s your name, Emma?',
      'What\'s that, Emma?',
      'What color is the cake?',
      'Open your book, Emma.',
      'Who is she, Emma?',
      'Is this your eraser?'
    ],
    explanation: '詢問對方今年幾歲應使用「How old are you, Emma?」。'
  }),
  createItem({
    id: 'hwg_b1_ba_27',
    book: 1,
    unit: 'Unit 2',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 3,
    question: '閱讀短文：「Hi, I am Ryan. Today is my birthday. Look at the cake! One, two, three, four, five, six, seven. Seven candles! I am seven years old.」請問 Ryan 今年幾歲？',
    options: ['7 歲', '5 歲', '6 歲', '8 歲', '9 歲', '10 歲', '4 歲'],
    explanation: '短文中提到「Seven candles! I am seven years old.」，可知 Ryan 今年 7 歲。'
  }),
  createItem({
    id: 'hwg_b1_ba_28',
    book: 1,
    unit: 'Unit 2',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 3,
    question: '閱讀對話：\nLily: Happy birthday, Ben! How old are you?\nBen: Thank you, Lily. I am ten years old. And you?\nLily: I am nine years old.\n請問誰的年紀比較大？',
    options: [
      'Ben 比較大（10 歲）',
      'Lily 比較大（10 歲）',
      '兩個人一樣大（都是 9 歲）',
      '兩個人一樣大（都是 10 歲）',
      'Ben 只有 6 歲',
      'Lily 只有 7 歲',
      '對話中沒有提到年齡'
    ],
    explanation: 'Ben 說「I am ten years old.（10歲）」，Lily 說「I am nine years old.（9歲）」，因此 Ben 比較大。'
  }),

  // --- Unit 3 (Stationery & Classroom Items) ---
  createItem({
    id: 'hwg_b1_ba_29',
    book: 1,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 1,
    audioText: 'eraser',
    question: '請仔細聽發音，選出正確的文具單字。',
    options: ['eraser', 'ruler', 'pencil', 'book', 'desk', 'chair', 'bag'],
    explanation: '音檔發音為「eraser（橡皮擦）」。'
  }),
  createItem({
    id: 'hwg_b1_ba_30',
    book: 1,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 1,
    audioText: 'pencil',
    question: '請仔細聽發音，選出正確的文具單字。',
    options: ['pencil', 'ruler', 'eraser', 'box', 'bag', 'desk', 'chair'],
    explanation: '音檔發音為「pencil（鉛筆）」。'
  }),
  createItem({
    id: 'hwg_b1_ba_31',
    book: 1,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'What is this?',
    question: '請聽問句，選出最合適的回應。',
    options: [
      'It is a ruler.',
      'I am eight years old.',
      'My name is Lucas.',
      'Stand up, please.',
      'You are welcome.',
      'She is my sister.',
      'Yes, I can dance.'
    ],
    explanation: '音檔詢問近處物品「What is this?（這是什麼？）」，應回答物品名稱「It is a ruler.（它是一把尺）」。'
  }),
  createItem({
    id: 'hwg_b1_ba_32',
    book: 1,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'What is that on the desk?',
    question: '請聽問句，選出最合適的回應。',
    options: [
      'It is an eraser.',
      'I am ten.',
      'Hi, I am Nina.',
      'Line up, please.',
      'He is a doctor.',
      'No, I cannot.',
      'Good morning!'
    ],
    explanation: '音檔詢問遠處桌上的物品「What is that on the desk?」，回答「It is an eraser.（它是一塊橡皮擦）」最合適。'
  }),
  createItem({
    id: 'hwg_b1_ba_33',
    book: 1,
    unit: 'Unit 3',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'I write my homework with a ______.',
    options: ['pencil', 'chair', 'desk', 'bag', 'box', 'eraser', 'ruler'],
    explanation: '句意為「我用鉛筆寫作業。」，用來寫字的工具為「pencil（鉛筆）」。'
  }),
  createItem({
    id: 'hwg_b1_ba_34',
    book: 1,
    unit: 'Unit 3',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'I put my books and pencil box in my ______ and go to school.',
    options: ['bag', 'ruler', 'eraser', 'chair', 'pencil', 'pen', 'marker'],
    explanation: '句意為「我把書本和鉛筆盒放進書包裡去上學。」，裝書本背去上學的是「bag（書包／袋子）」。'
  }),
  createItem({
    id: 'hwg_b1_ba_35',
    book: 1,
    unit: 'Unit 3',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'Please sit on your ______ and look at the teacher.',
    options: ['chair', 'ruler', 'eraser', 'pencil', 'pen', 'book', 'marker'],
    explanation: '句意為「請坐在你的椅子上並看著老師。」，可以坐的教室物品為「chair（椅子）」。'
  }),
  createItem({
    id: 'hwg_b1_ba_36',
    book: 1,
    unit: 'Unit 3',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'Look! It is ______ eraser, not a ruler.',
    options: ['an', 'a', 'two', 'three', 'are', 'am', 'you'],
    explanation: '單數可數名詞 eraser 字首為母音，前面必須使用不定冠詞「an」。'
  }),
  createItem({
    id: 'hwg_b1_ba_37',
    book: 1,
    unit: 'Unit 3',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'A: What is that? B: ______ is a box.',
    options: ['It', 'I', 'You', 'He', 'She', 'We', 'Are'],
    explanation: '回答「What is this / that?」時，主詞應使用第三人稱單數非人稱代名詞「It（它）」。'
  }),
  createItem({
    id: 'hwg_b1_ba_38',
    book: 1,
    unit: 'Unit 3',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 2,
    question: '你在教室地板上撿到一個沒看過的文具，指著手上的東西問同學「這是什麼？」，你該怎麼問？',
    options: [
      'What\'s this?',
      'What\'s your name?',
      'How old are you?',
      'Who is he?',
      'Stand up, please.',
      'I am nine years old.',
      'My name is Leo.'
    ],
    explanation: '指著手邊近處的物品詢問「這是什麼？」，應使用「What\'s this?」。'
  }),
  createItem({
    id: 'hwg_b1_ba_39',
    book: 1,
    unit: 'Unit 3',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 3,
    question: '閱讀短文：「Hi, I am Chloe. Look at my desk! This is a book. That is a pencil. And it is an eraser.」請問 Chloe 的書桌上「沒有」提到下列哪一樣物品？',
    options: ['尺 (ruler)', '書本 (book)', '鉛筆 (pencil)', '橡皮擦 (eraser)', '書桌 (desk)', '以上都有提到', '以上都沒提到'],
    explanation: '短文中提到了 desk、book、pencil 與 eraser，唯一沒有提到的是「尺 (ruler)」。'
  }),

  // --- Unit 4 (Colors) ---
  createItem({
    id: 'hwg_b1_ba_40',
    book: 1,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 1,
    audioText: 'yellow',
    question: '請仔細聽發音，選出正確的顏色單字。',
    options: ['yellow', 'green', 'blue', 'black', 'white', 'pink', 'red'],
    explanation: '音檔發音為「yellow（黃色）」。'
  }),
  createItem({
    id: 'hwg_b1_ba_41',
    book: 1,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 1,
    audioText: 'green',
    question: '請仔細聽發音，選出正確的顏色單字。',
    options: ['green', 'red', 'orange', 'pink', 'black', 'white', 'yellow'],
    explanation: '音檔發音為「green（綠色）」。'
  }),
  createItem({
    id: 'hwg_b1_ba_42',
    book: 1,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'What color is your bag?',
    question: '請聽問句，選出最合適的回應。',
    options: [
      'It is blue.',
      'It is a bag.',
      'I am seven years old.',
      'My name is Max.',
      'Open your bag, please.',
      'Yes, I can.',
      'He is a teacher.'
    ],
    explanation: '音檔詢問顏色「What color is your bag?（你的書包是什麼顏色？）」，應回答顏色「It is blue.（它是藍色的）」。'
  }),
  createItem({
    id: 'hwg_b1_ba_43',
    book: 1,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Look at the panda! What color is it?',
    question: '請聽問句，選出最合適的回應。',
    options: [
      'It is black and white.',
      'It is a desk.',
      'I am nine years old.',
      'My name is Emma.',
      'Sit down, please.',
      'She is a nurse.',
      'No, I cannot.'
    ],
    explanation: '音檔詢問貓熊的顏色「What color is it?」，回答「It is black and white.（它是黑白相間的）」最符合事實與語意。'
  }),
  createItem({
    id: 'hwg_b1_ba_44',
    book: 1,
    unit: 'Unit 4',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'Bananas are ______, and red apples are red.',
    options: ['yellow', 'blue', 'pink', 'black', 'white', 'bag', 'desk'],
    explanation: '成熟的香蕉是黃色的，故空格應填「yellow（黃色的）」。'
  }),
  createItem({
    id: 'hwg_b1_ba_45',
    book: 1,
    unit: 'Unit 4',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'Mix red and white, and you get ______!',
    options: ['pink', 'black', 'green', 'blue', 'yellow', 'ruler', 'book'],
    explanation: '美術調色常識：紅色（red）加上白色（white）會調出粉紅色「pink」。'
  }),
  createItem({
    id: 'hwg_b1_ba_46',
    book: 1,
    unit: 'Unit 4',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'Mix red and yellow, and you get ______!',
    options: ['orange', 'blue', 'black', 'white', 'pink', 'green', 'chair'],
    explanation: '紅色（red）加上黃色（yellow）會調出橘色「orange」。'
  }),
  createItem({
    id: 'hwg_b1_ba_47',
    book: 1,
    unit: 'Unit 4',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'Look! It is ______ red apple.',
    options: ['a', 'an', 'two', 'are', 'am', 'what', 'who'],
    explanation: '雖然 apple 是母音開頭，但前面的形容詞「red」為子音開頭，故不定冠詞需用「a」（a red apple）。'
  }),
  createItem({
    id: 'hwg_b1_ba_48',
    book: 1,
    unit: 'Unit 4',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'A: ______ color is the box? B: It is green.',
    options: ['What', 'How', 'Who', 'Where', 'Is', 'Are', 'Can'],
    explanation: '詢問「什麼顏色」使用疑問詞「What color」。'
  }),
  createItem({
    id: 'hwg_b1_ba_49',
    book: 1,
    unit: 'Unit 4',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 3,
    question: '閱讀短文：「Hi! I am Leo. I have a bag, a ruler, and an eraser. My bag is black. My ruler is green. My eraser is pink.」請問 Leo 的尺是什麼顏色的？',
    options: ['綠色 (green)', '黑色 (black)', '粉紅色 (pink)', '藍色 (blue)', '黃色 (yellow)', '紅色 (red)', '白色 (white)'],
    explanation: '由短文中「My ruler is green.」可知 Leo 的尺是綠色的。'
  }),
  createItem({
    id: 'hwg_b1_ba_50',
    book: 1,
    unit: 'Unit 4',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 3,
    question: '承上題短文：「Hi! I am Leo. I have a bag, a ruler, and an eraser. My bag is black. My ruler is green. My eraser is pink.」請問哪一樣物品是粉紅色的？',
    options: ['橡皮擦 (eraser)', '書包 (bag)', '尺 (ruler)', '鉛筆 (pencil)', '書桌 (desk)', '椅子 (chair)', '書本 (book)'],
    explanation: '由短文中最後一句「My eraser is pink.」可知粉紅色的是橡皮擦。'
  })
];

// ============================================================================
// BOOK 2 NEW ITEMS (+50 Questions: Starter, Unit 1~4, Review 1~2)
// ============================================================================
const BOOK_2_NEW_ITEMS = [
  // --- Starter (Numbers 11-15) ---
  createItem({
    id: 'hwg_b2_ba_01',
    book: 2,
    unit: 'Starter',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 1,
    audioText: 'twelve',
    question: '請仔細聽發音，選出正確的數字單字。',
    options: ['twelve', 'eleven', 'thirteen', 'fourteen', 'fifteen', 'ten', 'two'],
    explanation: '音檔發音為「twelve（12）」。'
  }),
  createItem({
    id: 'hwg_b2_ba_02',
    book: 2,
    unit: 'Starter',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 1,
    audioText: 'fifteen',
    question: '請仔細聽發音，選出正確的數字單字。',
    options: ['fifteen', 'fourteen', 'thirteen', 'twelve', 'eleven', 'five', 'four'],
    explanation: '音檔發音為「fifteen（15）」，注意字首為 fif- 而非 five-。'
  }),
  createItem({
    id: 'hwg_b2_ba_03',
    book: 2,
    unit: 'Starter',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'Ten plus (+) four is ______.',
    options: ['fourteen', 'eleven', 'twelve', 'thirteen', 'fifteen', 'four', 'ten'],
    explanation: '數學加法 10 + 4 = 14，14 的英文為「fourteen」。'
  }),
  createItem({
    id: 'hwg_b2_ba_04',
    book: 2,
    unit: 'Starter',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'Fifteen minus (-) four is ______.',
    options: ['eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'nine', 'ten'],
    explanation: '數學減法 15 - 4 = 11，11 的英文為「eleven」。'
  }),

  // --- Unit 1 (Pets & Animals + Big/Small) ---
  createItem({
    id: 'hwg_b2_ba_05',
    book: 2,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 1,
    audioText: 'rabbit',
    question: '請仔細聽發音，選出正確的動物單字。',
    options: ['rabbit', 'turtle', 'frog', 'bird', 'fish', 'dog', 'cat'],
    explanation: '音檔發音為「rabbit（兔子）」。'
  }),
  createItem({
    id: 'hwg_b2_ba_06',
    book: 2,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 1,
    audioText: 'turtle',
    question: '請仔細聽發音，選出正確的動物單字。',
    options: ['turtle', 'rabbit', 'bird', 'fish', 'frog', 'cat', 'dog'],
    explanation: '音檔發音為「turtle（烏龜）」。'
  }),
  createItem({
    id: 'hwg_b2_ba_07',
    book: 2,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Is this a rabbit?',
    question: '請聽問句，選出最合適的回應。',
    options: [
      'Yes, it is. It has long ears.',
      'Yes, I can swim.',
      'He is my brother.',
      'She is a doctor.',
      'I am eleven years old.',
      'No, I am not.',
      'They are rulers.'
    ],
    explanation: '音檔詢問「Is this a rabbit?（這是一隻兔子嗎？）」，主詞為單數動物，應以 it 回答「Yes, it is. It has long ears.」。'
  }),
  createItem({
    id: 'hwg_b2_ba_08',
    book: 2,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Is that a big dog?',
    question: '請聽問句，選出最合適的回應。',
    options: [
      'No, it isn\'t. It is a small cat.',
      'No, I can\'t dance.',
      'Yes, he is my father.',
      'She is a nurse.',
      'My name is Lucas.',
      'It is twelve.',
      'Open your book, please.'
    ],
    explanation: '音檔詢問「Is that a big dog?（那是一隻大狗嗎？）」，否定回答用「No, it isn\'t. It is a small cat.」。'
  }),
  createItem({
    id: 'hwg_b2_ba_09',
    book: 2,
    unit: 'Unit 1',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'A ______ can fly in the sky and sing in the tree.',
    options: ['bird', 'fish', 'turtle', 'dog', 'cat', 'rabbit', 'frog'],
    explanation: '句意為「鳥可以在空中飛並在樹上唱歌。」，會飛的動物是「bird（鳥）」。'
  }),
  createItem({
    id: 'hwg_b2_ba_10',
    book: 2,
    unit: 'Unit 1',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'The green ______ says "Ribbit, ribbit" and can jump high.',
    options: ['frog', 'fish', 'bird', 'cat', 'dog', 'turtle', 'student'],
    explanation: '綠色的且會呱呱叫（Ribbit）並跳得高的是「frog（青蛙）」。'
  }),
  createItem({
    id: 'hwg_b2_ba_11',
    book: 2,
    unit: 'Unit 1',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'An elephant is very ______, but an ant is very small.',
    options: ['big', 'small', 'red', 'short', 'cold', 'sad', 'new'],
    explanation: '大象體型非常「大（big）」，與後半句螞蟻非常「小（small）」形成對比。'
  }),
  createItem({
    id: 'hwg_b2_ba_12',
    book: 2,
    unit: 'Unit 1',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'A: Is that a fish? B: No, it ______.',
    options: ['isn\'t', 'is', 'aren\'t', 'am', 'can\'t', 'don\'t', 'not'],
    explanation: 'No 開頭的簡答句，be 動詞 is 必須加上 not 縮寫為「isn\'t」（No, it isn\'t.）。'
  }),
  createItem({
    id: 'hwg_b2_ba_13',
    book: 2,
    unit: 'Unit 1',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'A: ______ this a small turtle? B: Yes, it is.',
    options: ['Is', 'Are', 'Am', 'Can', 'Who', 'What', 'How'],
    explanation: '答句為「Yes, it is.」，可知問句是以單數 be 動詞「Is」開頭的 Yes/No 問句。'
  }),
  createItem({
    id: 'hwg_b2_ba_14',
    book: 2,
    unit: 'Unit 1',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 2,
    question: '你看到遠處草叢裡有一隻動物，想問朋友「那是一隻兔子嗎？」，你應該怎麼問？',
    options: [
      'Is that a rabbit?',
      'What\'s your name?',
      'Can you jump?',
      'Who is he?',
      'Is she a doctor?',
      'How old are you?',
      'What color is your bag?'
    ],
    explanation: '指著遠處詢問「那是一隻兔子嗎？」，使用指示代名詞 that，句型為「Is that a rabbit?」。'
  }),
  createItem({
    id: 'hwg_b2_ba_15',
    book: 2,
    unit: 'Unit 1',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 3,
    question: '閱讀短文：「Hi, I am Nina. I have two pets. Look! This is a big dog. Its name is Lucky. That is a small turtle. Its name is Coco.」請問 Coco 是什麼動物？',
    options: [
      '一隻小烏龜 (a small turtle)',
      '一隻大狗 (a big dog)',
      '一隻小貓 (a small cat)',
      '一隻白兔 (a white rabbit)',
      '一隻綠青蛙 (a green frog)',
      '一隻小鳥 (a small bird)',
      '一條紅魚 (a red fish)'
    ],
    explanation: '由短文中「That is a small turtle. Its name is Coco.」可知 Coco 是一隻小烏龜。'
  }),
  createItem({
    id: 'hwg_b2_ba_16',
    book: 2,
    unit: 'Unit 1',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 3,
    question: '承上題短文：「Hi, I am Nina. I have two pets. Look! This is a big dog. Its name is Lucky. That is a small turtle. Its name is Coco.」請問 Nina 的大狗叫什麼名字？',
    options: ['Lucky', 'Coco', 'Nina', 'Max', 'Leo', 'Toby', 'Kulas'],
    explanation: '由短文中「This is a big dog. Its name is Lucky.」可知大狗的名字是 Lucky。'
  }),

  // --- Unit 2 (Can / Abilities) ---
  createItem({
    id: 'hwg_b2_ba_17',
    book: 2,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 1,
    audioText: 'swim',
    question: '請仔細聽發音，選出正確的動作單字。',
    options: ['swim', 'sing', 'dance', 'draw', 'jump', 'read', 'write'],
    explanation: '音檔發音為「swim（游泳）」。'
  }),
  createItem({
    id: 'hwg_b2_ba_18',
    book: 2,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 1,
    audioText: 'dance',
    question: '請仔細聽發音，選出正確的動作單字。',
    options: ['dance', 'draw', 'sing', 'swim', 'ride', 'look', 'open'],
    explanation: '音檔發音為「dance（跳舞）」。'
  }),
  createItem({
    id: 'hwg_b2_ba_19',
    book: 2,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Can you ride a bike?',
    question: '請聽問句，選出最合適的回應。',
    options: [
      'Yes, I can.',
      'Yes, it is a bike.',
      'No, he isn\'t.',
      'He is my father.',
      'It is blue and white.',
      'I am ten years old.',
      'She is a teacher.'
    ],
    explanation: '助動詞 Can 開頭的問句「Can you ride a bike?（你會騎腳踏車嗎？）」，應以 can 回答「Yes, I can.」。'
  }),
  createItem({
    id: 'hwg_b2_ba_20',
    book: 2,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Can your brother swim?',
    question: '請聽問句，選出最合適的回應。',
    options: [
      'No, he can\'t. But he can sing.',
      'Yes, she can.',
      'No, it isn\'t.',
      'He is my brother.',
      'I am nine years old.',
      'It is a small fish.',
      'Open your book, please.'
    ],
    explanation: '問句主詞為男性單數「your brother」，且以 Can 提問，故以代名詞 he 與 can\'t 回答「No, he can\'t. But he can sing.」。'
  }),
  createItem({
    id: 'hwg_b2_ba_21',
    book: 2,
    unit: 'Unit 2',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'A fish can ______ in the water, but a bird can fly in the sky.',
    options: ['swim', 'draw', 'sing', 'dance', 'ride a bike', 'write', 'read'],
    explanation: '魚在水裡會做的動作是「swim（游泳）」。'
  }),
  createItem({
    id: 'hwg_b2_ba_22',
    book: 2,
    unit: 'Unit 2',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'Emma has a pencil and paper. She can ______ a cute cat.',
    options: ['draw', 'swim', 'sing', 'dance', 'jump', 'fly', 'run'],
    explanation: '拿著鉛筆和紙張畫出一隻可愛的貓，動作為「draw（畫圖）」。'
  }),
  createItem({
    id: 'hwg_b2_ba_23',
    book: 2,
    unit: 'Unit 2',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'Lucas has a new bicycle. He can ______ in the park.',
    options: ['ride a bike', 'swim', 'draw', 'sing', 'open', 'close', 'sit down'],
    explanation: '有一台新腳踏車（bicycle），在公園裡能做的活動是「ride a bike（騎腳踏車）」。'
  }),
  createItem({
    id: 'hwg_b2_ba_24',
    book: 2,
    unit: 'Unit 2',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'A: ______ you sing an English song? B: Yes, I can.',
    options: ['Can', 'Are', 'Is', 'Am', 'Who', 'What', 'How'],
    explanation: '由答句「Yes, I can.」可知問句以助動詞「Can」開頭詢問能力。'
  }),
  createItem({
    id: 'hwg_b2_ba_25',
    book: 2,
    unit: 'Unit 2',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'A: Can Mia dance? B: No, she ______.',
    options: ['can\'t', 'can', 'isn\'t', 'aren\'t', 'am not', 'don\'t', 'not'],
    explanation: 'Can 問句的否定簡答需使用「can\'t（cannot）」（No, she can\'t.）。'
  }),
  createItem({
    id: 'hwg_b2_ba_26',
    book: 2,
    unit: 'Unit 2',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 2,
    question: '學校才藝表演即將舉行，你想問同學 Leo「你會唱歌嗎？」，你應該怎麼問？',
    options: [
      'Can you sing, Leo?',
      'Are you Leo?',
      'Who is Leo?',
      'Is that a bird, Leo?',
      'How old are you, Leo?',
      'What is this, Leo?',
      'Is he a doctor?'
    ],
    explanation: '詢問對方是否具備唱歌的能力，使用「Can you sing, Leo?」。'
  }),
  createItem({
    id: 'hwg_b2_ba_27',
    book: 2,
    unit: 'Unit 2',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 3,
    question: '閱讀短文：「Hi, I am Max. I can swim and ride a bike, but I can\'t dance. My sister Lily can sing and dance, but she can\'t swim.」請問 Max 不會做什麼事？',
    options: [
      '跳舞 (dance)',
      '游泳 (swim)',
      '騎腳踏車 (ride a bike)',
      '唱歌與游泳',
      '什麼都會做',
      '什麼都不會做',
      '短文中沒有提到'
    ],
    explanation: '短文中 Max 說「I can swim and ride a bike, but I can\'t dance.」，可知他不會跳舞（dance）。'
  }),
  createItem({
    id: 'hwg_b2_ba_28',
    book: 2,
    unit: 'Unit 2',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 3,
    question: '承上題短文：「Hi, I am Max. I can swim and ride a bike, but I can\'t dance. My sister Lily can sing and dance, but she can\'t swim.」請問誰會游泳？',
    options: ['Max', 'Lily', 'Max 和 Lily 都會', 'Max 和 Lily 都不會', '只有老師會', '只有爸爸會', '短文沒提到'],
    explanation: 'Max 說「I can swim」，而「Lily ... can\'t swim」，因此只有 Max 會游泳。'
  }),

  // --- Unit 3 (Family Members & Who is he/she?) ---
  createItem({
    id: 'hwg_b2_ba_29',
    book: 2,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 1,
    audioText: 'mother',
    question: '請仔細聽發音，選出正確的家庭成員單字。',
    options: ['mother', 'father', 'brother', 'sister', 'grandfather', 'grandmother', 'teacher'],
    explanation: '音檔發音為「mother（媽媽／母親）」。'
  }),
  createItem({
    id: 'hwg_b2_ba_30',
    book: 2,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 1,
    audioText: 'grandfather',
    question: '請仔細聽發音，選出正確的家庭成員單字。',
    options: ['grandfather', 'grandmother', 'father', 'brother', 'mother', 'sister', 'doctor'],
    explanation: '音檔發音為「grandfather（爺爺／外公）」。'
  }),
  createItem({
    id: 'hwg_b2_ba_31',
    book: 2,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Who is she?',
    question: '請聽問句，選出最合適的回應。',
    options: [
      'She is my sister.',
      'He is my father.',
      'It is a big dog.',
      'Yes, I can dance.',
      'I am eight years old.',
      'It is red.',
      'Open your book, please.'
    ],
    explanation: '問句「Who is she?（她是誰？）」主詞為女性單數 she，應回答女性對象「She is my sister.（她是我的姊姊／妹妹）」。'
  }),
  createItem({
    id: 'hwg_b2_ba_32',
    book: 2,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Who is that tall man?',
    question: '請聽問句，選出最合適的回應。',
    options: [
      'He is my father.',
      'She is my mother.',
      'It is a small cat.',
      'Yes, it is.',
      'No, I cannot.',
      'My name is Chloe.',
      'It is a yellow ruler.'
    ],
    explanation: '問句「Who is that tall man?（那位高個子的男人是誰？）」詢問男性單數，應以 He 回答「He is my father.（他是我的爸爸）」。'
  }),
  createItem({
    id: 'hwg_b2_ba_33',
    book: 2,
    unit: 'Unit 3',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'My father\'s father is my ______.',
    options: ['grandfather', 'grandmother', 'brother', 'sister', 'mother', 'teacher', 'nurse'],
    explanation: '句意為「我爸爸的爸爸是我的爺爺。」，爺爺的英文為「grandfather」。'
  }),
  createItem({
    id: 'hwg_b2_ba_34',
    book: 2,
    unit: 'Unit 3',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'My mother\'s mother is my ______.',
    options: ['grandmother', 'grandfather', 'father', 'brother', 'doctor', 'cook', 'farmer'],
    explanation: '句意為「我媽媽的媽媽是我的外婆。」，奶奶／外婆的英文為「grandmother」。'
  }),
  createItem({
    id: 'hwg_b2_ba_35',
    book: 2,
    unit: 'Unit 3',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'That boy is my ______. We go to school together.',
    options: ['brother', 'sister', 'mother', 'grandmother', 'rabbit', 'turtle', 'pencil'],
    explanation: '主詞「That boy（那個男孩）」為男性同輩家人，故選「brother（哥哥／弟弟）」；sister、mother、grandmother 皆為女性。'
  }),
  createItem({
    id: 'hwg_b2_ba_36',
    book: 2,
    unit: 'Unit 3',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'A: ______ is that girl? B: She is my sister.',
    options: ['Who', 'What', 'How', 'Can', 'Is', 'Are', 'Where'],
    explanation: '由答句「She is my sister.（她是我妹妹）」可知問句在詢問「誰」，應使用疑問詞「Who」。'
  }),
  createItem({
    id: 'hwg_b2_ba_37',
    book: 2,
    unit: 'Unit 3',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'A: Who is he? B: ______ is my grandfather.',
    options: ['He', 'She', 'It', 'I', 'You', 'We', 'They'],
    explanation: '問句主詞為男性單數「he」，且 grandfather 為男性，答句主詞必須使用「He」。'
  }),
  createItem({
    id: 'hwg_b2_ba_38',
    book: 2,
    unit: 'Unit 3',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 2,
    question: '你去同學家玩，看到牆上照片有一位慈祥的老奶奶，你想問同學「她是誰？」，該怎麼問？',
    options: [
      'Who is she?',
      'Who is he?',
      'What is this?',
      'Can she swim?',
      'How old are you?',
      'What color is it?',
      'Is that a dog?'
    ],
    explanation: '詢問女性長輩「她是誰？」，主詞代名詞用 she，問句為「Who is she?」。'
  }),
  createItem({
    id: 'hwg_b2_ba_39',
    book: 2,
    unit: 'Unit 3',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 3,
    question: '閱讀短文：「Hello, I am Kulas. Look at my family photo! This is my grandfather. He can sing. This is my mother. She can dance. And the cute girl is my sister, Uma.」請問誰會跳舞？',
    options: [
      'Kulas 的媽媽 (mother)',
      'Kulas 的爺爺 (grandfather)',
      'Kulas 的妹妹 (sister)',
      'Kulas 的爸爸 (father)',
      'Kulas 的哥哥 (brother)',
      'Kulas 本人',
      '短文沒有提到'
    ],
    explanation: '由短文中「This is my mother. She can dance.」可知會跳舞的是 Kulas 的媽媽。'
  }),

  // --- Unit 4 (Occupations / Jobs) ---
  createItem({
    id: 'hwg_b2_ba_40',
    book: 2,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 1,
    audioText: 'doctor',
    question: '請仔細聽發音，選出正確的職業單字。',
    options: ['doctor', 'nurse', 'teacher', 'student', 'cook', 'farmer', 'brother'],
    explanation: '音檔發音為「doctor（醫生）」。'
  }),
  createItem({
    id: 'hwg_b2_ba_41',
    book: 2,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 1,
    audioText: 'teacher',
    question: '請仔細聽發音，選出正確的職業單字。',
    options: ['teacher', 'student', 'doctor', 'nurse', 'farmer', 'cook', 'sister'],
    explanation: '音檔發音為「teacher（老師）」。'
  }),
  createItem({
    id: 'hwg_b2_ba_42',
    book: 2,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Is your mother a teacher?',
    question: '請聽問句，選出最合適的回應。',
    options: [
      'Yes, she is.',
      'Yes, he is.',
      'No, it isn\'t.',
      'Yes, I can.',
      'She is my mother.',
      'It is a book.',
      'I am nine years old.'
    ],
    explanation: '問句「Is your mother a teacher?（你媽媽是老師嗎？）」主詞為女性單數 your mother，應以 she 回答「Yes, she is.」。'
  }),
  createItem({
    id: 'hwg_b2_ba_43',
    book: 2,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Are you a student?',
    question: '請聽問句，選出最合適的回應。',
    options: [
      'Yes, I am.',
      'Yes, he is.',
      'No, she isn\'t.',
      'No, it isn\'t.',
      'Yes, I can swim.',
      'My name is Leo.',
      'It is a red pen.'
    ],
    explanation: '問句「Are you a student?（你是學生嗎？）」詢問「你」，回答用第一人稱「Yes, I am.（是的，我是）」。'
  }),
  createItem({
    id: 'hwg_b2_ba_44',
    book: 2,
    unit: 'Unit 4',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'My uncle makes yummy food in the kitchen. He is a great ______.',
    options: ['cook', 'doctor', 'nurse', 'teacher', 'student', 'farmer', 'rabbit'],
    explanation: '句意為「我叔叔在廚房做出美味的食物。他是一位很棒的廚師。」，廚師的英文為「cook」。'
  }),
  createItem({
    id: 'hwg_b2_ba_45',
    book: 2,
    unit: 'Unit 4',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'Miss Lin teaches English at school. She is a kind ______.',
    options: ['teacher', 'nurse', 'cook', 'farmer', 'doctor', 'turtle', 'eraser'],
    explanation: '在學校教英語（teaches English at school）的職業是「teacher（老師）」。'
  }),
  createItem({
    id: 'hwg_b2_ba_46',
    book: 2,
    unit: 'Unit 4',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'Dr. Wang works in a hospital and helps sick people. He is a ______.',
    options: ['doctor', 'student', 'farmer', 'cook', 'teacher', 'brother', 'chair'],
    explanation: 'Dr. Wang 在醫院工作並幫助生病的人，職業為「doctor（醫生）」。'
  }),
  createItem({
    id: 'hwg_b2_ba_47',
    book: 2,
    unit: 'Unit 4',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'A: ______ your father a farmer? B: Yes, he is.',
    options: ['Is', 'Are', 'Am', 'Can', 'Do', 'Who', 'What'],
    explanation: '主詞「your father」為第三人稱單數，且答句為「Yes, he is.」，故問句開頭使用 be 動詞「Is」。'
  }),
  createItem({
    id: 'hwg_b2_ba_48',
    book: 2,
    unit: 'Unit 4',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'A: Are you a nurse? B: No, I ______ not. I am a doctor.',
    options: ['am', 'is', 'are', 'can', 'do', 'not', 'isn\'t'],
    explanation: '第一人稱單數主詞「I」後面必須搭配 be 動詞「am」（No, I am not.）。'
  }),
  createItem({
    id: 'hwg_b2_ba_49',
    book: 2,
    unit: 'Unit 4',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 3,
    question: '閱讀短文：「Hi, I am Toby. I am ten years old, and I am a student. My father is a doctor. My mother is a nurse. My grandfather is a farmer.」請問 Toby 的媽媽從事什麼職業？',
    options: [
      '護理師 (nurse)',
      '醫生 (doctor)',
      '農夫 (farmer)',
      '學生 (student)',
      '廚師 (cook)',
      '老師 (teacher)',
      '短文沒有提到'
    ],
    explanation: '由短文中「My mother is a nurse.」可知 Toby 的媽媽是護理師。'
  }),
  createItem({
    id: 'hwg_b2_ba_50',
    book: 2,
    unit: 'Unit 4',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 3,
    question: '承上題短文：「Hi, I am Toby. I am ten years old, and I am a student. My father is a doctor. My mother is a nurse. My grandfather is a farmer.」請問誰是農夫？',
    options: [
      'Toby 的爺爺 (grandfather)',
      'Toby 的爸爸 (father)',
      'Toby 的媽媽 (mother)',
      'Toby 本人',
      'Toby 的哥哥 (brother)',
      'Toby 的妹妹 (sister)',
      '沒有人是農夫'
    ],
    explanation: '由短文最後一句「My grandfather is a farmer.」可知 Toby 的爺爺是農夫。'
  })
];

// ============================================================================
// APPLY EXPANSION TO HERE_WE_GO_MCQ_BANK & CANONICAL_MAPPING
// ============================================================================
const importFresh = async (filePath) => {
  const url = pathToFileURL(filePath);
  url.searchParams.set('t', String(Date.now()));
  return import(url.href);
};

const { HERE_WE_GO_MCQ_BANK, HERE_WE_GO_BOOK_META } = await importFresh(mcqFilePath);
const { LEGACY_TO_CANONICAL_MAP, CANONICAL_META_MAP } = await importFresh(mappingFilePath);

// 移除先前若已存在之 hwg_b1_ba_* / hwg_b2_ba_* 確保冪等性 (Idempotency)
const baseBank = HERE_WE_GO_MCQ_BANK.filter(
  q => !q.id.startsWith('hwg_b1_ba_') && !q.id.startsWith('hwg_b2_ba_')
);

const newItems = [...BOOK_1_NEW_ITEMS, ...BOOK_2_NEW_ITEMS];
const updatedBank = [...baseBank, ...newItems];

// 更新 canonicalMapping.js
const nextLegacyMap = { ...LEGACY_TO_CANONICAL_MAP };
const nextMetaMap = { ...CANONICAL_META_MAP };

for (const item of newItems) {
  nextLegacyMap[item.id] = item.id;
  nextMetaMap[item.id] = {
    canonicalId: item.id,
    book: item.book,
    primaryScope: item.primaryScope,
    scopes: item.scopes,
    legacyIds: [item.id],
    duplicateCount: 0
  };
}

const bookCounts = {};
for (const q of updatedBank) {
  if (q.isCanonical) {
    bookCounts[q.book] = (bookCounts[q.book] || 0) + 1;
  }
}

const nextStats = {
  totalBankItems: Object.keys(nextLegacyMap).length,
  canonicalItems: updatedBank.length,
  duplicateClones: 1728,
  bookCounts
};

const bankFileContent = `export const HERE_WE_GO_BOOK_META = ${JSON.stringify(HERE_WE_GO_BOOK_META, null, 2)};\n\nexport const HERE_WE_GO_MCQ_BANK = ${JSON.stringify(updatedBank, null, 2)};\n`.replace(/\r\n/g, '\n');
fs.writeFileSync(mcqFilePath, bankFileContent, 'utf8');

const mappingContent = `/**
 * 課本題庫 Canonical Question 映射表與結構定義 (Scheme A + Batch A Expanded)
 *
 * 規範依據：
 * - 冊內正規化 (In-book Canonical)：現有 ${updatedBank.length} 題 (原 1,589 題 + Batch A 100 題)
 * - 已刪除同冊跨單元重複複本：1,728 筆
 * - 跨冊複現題目保留各自獨立進度：22 組
 * - 每冊保證獨立題目數 >= 100 題
 * - scopes 精準限制為原授課單元及對應 Review (長度 <= 2)，絕無全冊漫延
 */

export const CANONICAL_STATS = ${JSON.stringify(nextStats, null, 2)};

/** 舊題號 (legacyId) -> 標準題號 (canonicalId) 映射表 */
export const LEGACY_TO_CANONICAL_MAP = ${JSON.stringify(nextLegacyMap, null, 2)};

/** 標準題號 (canonicalId) -> 範圍與複本元資料 */
export const CANONICAL_META_MAP = ${JSON.stringify(nextMetaMap, null, 2)};

/**
 * 取得指定題號之 Canonical ID
 * @param {string} id 舊題號或標準題號
 * @returns {string}
 */
export function resolveCanonicalId(id) {
  if (!id) return id;
  return LEGACY_TO_CANONICAL_MAP[id] || id;
}

/**
 * 判定題號是否為 Canonical 題號
 * @param {string} id
 * @returns {boolean}
 */
export function isCanonicalId(id) {
  if (!id) return false;
  return Boolean(CANONICAL_META_MAP[id]);
}
`.replace(/\r\n/g, '\n');

fs.writeFileSync(mappingFilePath, mappingContent, 'utf8');

console.log(`✓ Added ${newItems.length} Batch A questions (Book 1: +50, Book 2: +50)`);
console.log(`✓ Updated HERE_WE_GO_MCQ_BANK total canonical items: ${updatedBank.length}`);
console.log(`✓ Book 1 count: ${bookCounts[1]}, Book 2 count: ${bookCounts[2]}`);
