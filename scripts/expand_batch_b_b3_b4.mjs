/**
 * Batch B (Books 3 & 4) 高品質題庫擴充建置腳本 (expand_batch_b_b3_b4.mjs)
 *
 * 嚴格遵守「七大命題鐵律」與 SOP：
 * 1. Canonical 唯一性：每題皆為獨立原創題 (isCanonical: true)，scopes 長度 <= 2。
 * 2. 單一正解防呆：情境充足，正答唯一，排他性 100%。
 * 3. 性別中立防呆：明確人稱或情境，無性別線索時嚴禁同時出現 He/She 或 His/Her。
 * 4. 禁用萬用樣板句：6 個誘答必須同質同詞性，0 樣板句。
 * 5. 聽力防洩漏：L-WORD / L-RESP 統一固定題幹，逐字稿僅在 media.audioText。
 * 6. 詳解 100% 同步：具體說明正答理由與誘答錯誤原因。
 * 7. 靜態結構契約：7 選項、正答 answer: 0、挖空 ______、無雙句點。
 *
 * 配比保證 (每冊 50 題)：
 * L-WORD: 8, L-RESP: 8, V-MEAN: 10, G-MC: 10, G-CTX: 6, R-COMP: 8
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

const FIXED_L_WORD_STEM = '【聽力：聽音選字】請聽英語發音，選出聽到的單字：';
const FIXED_L_RESP_STEM = '【聽力：聽問句選回應】請聽英語問句，選出最適合的回應句：';

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
}) => {
  const normalizedQuestion =
    taskType === 'L-WORD'
      ? FIXED_L_WORD_STEM
      : taskType === 'L-RESP'
        ? FIXED_L_RESP_STEM
        : question;

  return {
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
    question: normalizedQuestion,
    options,
    answer: 0,
    explanation,
    canonicalId: id,
    primaryScope: unit,
    scopes: makeScopes(unit),
    isCanonical: true
  };
};

// ============================================================================
// BOOK 3 NEW ITEMS (+50 Questions: Starter, Unit 1~4, Review 1~2, Festival)
// Exact TaskType Quota: L-WORD: 8, L-RESP: 8, V-MEAN: 10, G-MC: 10, G-CTX: 6, R-COMP: 8
// ============================================================================
const BOOK_3_NEW_ITEMS = [
  // --- Starter (Feelings & Review) ---
  createItem({
    id: 'hwg_b3_bb_01',
    book: 3,
    unit: 'Starter',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 1,
    question: '英文單字「hungry」是指哪一種生理感覺？',
    options: ['飢餓的', '口渴的', '生氣的', '疲累的', '傷心的', '害怕的', '害羞的'],
    explanation: '「hungry」意為「飢餓的」；「口渴的」是 thirsty。'
  }),
  createItem({
    id: 'hwg_b3_bb_02',
    book: 3,
    unit: 'Starter',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 1,
    question: 'Tom and Jerry ______ happy students in Class 301.',
    options: ['are', 'is', 'am', 'be', 'can', 'do', 'have'],
    explanation: '主詞「Tom and Jerry」為兩個人（複數代名詞 they），搭配的現在式 be 動詞為「are」。'
  }),
  createItem({
    id: 'hwg_b3_bb_03',
    book: 3,
    unit: 'Starter',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 1,
    question: '放學後你的肚子咕嚕咕嚕叫，想告訴媽媽你肚子餓了，應該說哪一句？',
    options: ["I'm hungry, Mom.", "I'm thirsty, Mom.", "I'm fine, Mom.", "I'm sleepy, Mom.", "I'm happy, Mom.", "I'm busy, Mom.", "I'm cold, Mom."],
    explanation: '肚子咕嚕叫表示飢餓，因此應說「I\'m hungry, Mom.（媽媽，我肚子餓了）」。'
  }),
  createItem({
    id: 'hwg_b3_bb_04',
    book: 3,
    unit: 'Starter',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: '閱讀對話：「Leo: Are you thirsty, Amy? Amy: No, I\'m not thirsty. I\'m hungry. I want a sandwich.」請問 Amy 現在感覺如何？',
    options: ['肚子餓', '口渴', '很累', '生氣', '很飽', '感冒', '很熱'],
    explanation: '根據對話 Amy 說「No, I\'m not thirsty. I\'m hungry.（我不渴，我肚子餓）」，故應選「肚子餓」。'
  }),

  // --- Unit 1 (Weather) ---
  createItem({
    id: 'hwg_b3_bb_05',
    book: 3,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'rainy',
    options: ['rainy', 'sunny', 'windy', 'cloudy', 'snowy', 'hot', 'cold'],
    explanation: '聽力音檔發音為「rainy（下雨的）」。'
  }),
  createItem({
    id: 'hwg_b3_bb_06',
    book: 3,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'windy',
    options: ['windy', 'cloudy', 'sunny', 'snowy', 'rainy', 'warm', 'cool'],
    explanation: '聽力音檔發音為「windy（多風的／風大的）」。'
  }),
  createItem({
    id: 'hwg_b3_bb_07',
    book: 3,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: "How's the weather today?",
    options: ["It's sunny and hot.", "I'm ten years old.", "I want two hot dogs.", "She is my sister.", "They are pencils.", "Yes, I can.", "I'm in the classroom."],
    explanation: '問句詢問天氣「How\'s the weather today?（今天天氣如何？）」，適當回應為描述天氣的「It\'s sunny and hot.（天氣晴朗且炎熱）」。'
  }),
  createItem({
    id: 'hwg_b3_bb_08',
    book: 3,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: "Is it rainy outside?",
    options: ["No, it isn't. It's cloudy.", "Yes, I am a teacher.", "No, they are books.", "Yes, she can dance.", "I want some water.", "He is ten.", "It's an eraser."],
    explanation: '問句詢問「Is it rainy outside?（外面下雨嗎？）」，以 it 與 be 動詞提問，回應為「No, it isn\'t. It\'s cloudy.（不，沒下雨。是陰天）」。'
  }),
  createItem({
    id: 'hwg_b3_bb_09',
    book: 3,
    unit: 'Unit 1',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: '英文單字「cloudy」的中文意思是什麼？',
    options: ['多雲的／陰天的', '晴朗的', '下雨的', '下雪的', '風大的', '炎熱的', '寒冷的'],
    explanation: '「cloudy」由名詞 cloud（雲）加上 y 構成形容詞，意為「多雲的／陰天的」。'
  }),
  createItem({
    id: 'hwg_b3_bb_10',
    book: 3,
    unit: 'Unit 1',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: '天氣非常冷，需要穿厚外套。英文中表示「寒冷的」單字是哪一個？',
    options: ['cold', 'hot', 'warm', 'cool', 'sunny', 'rainy', 'windy'],
    explanation: '「cold」表示「寒冷的」；hot 是炎熱的，warm 是溫暖的。'
  }),
  createItem({
    id: 'hwg_b3_bb_11',
    book: 3,
    unit: 'Unit 1',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: '______ the weather in Taipei today? It\'s rainy.',
    options: ["How's", "What's", "Who's", "Where's", "Is", "Are", "Can"],
    explanation: '詢問天氣概況使用固定句型「How\'s the weather?」；若用 What 則需搭配 like（What\'s the weather like?）。'
  }),
  createItem({
    id: 'hwg_b3_bb_12',
    book: 3,
    unit: 'Unit 1',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'Look at the heavy snow outside! ______ very cold today.',
    options: ["It's", "They're", "I'm", "You're", "He's", "She's", "We're"],
    explanation: '英語中描述天氣與氣溫的主詞習慣使用虛主詞「It」，故搭配 be 動詞縮寫為「It\'s」。'
  }),
  createItem({
    id: 'hwg_b3_bb_13',
    book: 3,
    unit: 'Unit 1',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 2,
    question: '看到外面正在下大雨，你想提醒朋友帶雨傘出門，應該怎麼說？',
    options: ["It's rainy. Take an umbrella.", "It's sunny. Put on a hat.", "It's windy. Fly a kite.", "It's snowy. Make a snowman.", "It's hot. Drink some milk.", "It's cloudy. Good morning.", "It's cold. Open the door."],
    explanation: '下大雨（rainy）時應攜帶雨傘（umbrella），故選「It\'s rainy. Take an umbrella.」。'
  }),
  createItem({
    id: 'hwg_b3_bb_14',
    book: 3,
    unit: 'Unit 1',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: '閱讀短文：「Today is Sunday. The sun is big and bright in the sky. Ken and his dog play in the park. It is very hot.」請問今天的天氣是怎樣？',
    options: ['晴朗炎熱', '寒冷下雪', '狂風大雨', '陰暗多雲', '涼爽微風', '雷雨交加', '霧氣濃重'],
    explanation: '根據文中「The sun is big and bright... It is very hot.」，可知天氣為「晴朗炎熱」。'
  }),
  createItem({
    id: 'hwg_b3_bb_15',
    book: 3,
    unit: 'Unit 1',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 3,
    question: '閱讀氣象報告：「Good morning! Today in Kaohsiung, it is sunny. But in Keelung, it is rainy and cold. Please take your umbrella!」請問基隆（Keelung）的天氣如何？',
    options: ['又濕又冷下著雨', '晴朗大太陽', '多雲溫暖', '大風乾燥', '飄雪結冰', '酷熱難耐', '晴時多雲'],
    explanation: '報告中明確指出「in Keelung, it is rainy and cold（在基隆是下雨且寒冷的）」，故選「又濕又冷下著雨」。'
  }),

  // --- Unit 2 (Feelings & Food) ---
  createItem({
    id: 'hwg_b3_bb_16',
    book: 3,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'hamburger',
    options: ['hamburger', 'hot dog', 'sandwich', 'apple', 'banana', 'bread', 'pizza'],
    explanation: '聽力音檔發音為「hamburger（漢堡）」。'
  }),
  createItem({
    id: 'hwg_b3_bb_17',
    book: 3,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'banana',
    options: ['banana', 'apple', 'orange', 'pear', 'pie', 'pizza', 'peach'],
    explanation: '聽力音檔發音為「banana（香蕉）」。'
  }),
  createItem({
    id: 'hwg_b3_bb_18',
    book: 3,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Are you hungry, Kevin?',
    options: ["Yes, I am. I want a hot dog.", "No, it isn't. It's sunny.", "Yes, she is my teacher.", "I can ride a bike.", "They are in the kitchen.", "It's ten o'clock.", "He has three apples."],
    explanation: '問句問「Are you hungry, Kevin?（凱文，你肚子餓嗎？）」，以 Are you 提問，回應為「Yes, I am. I want a hot dog.（是的，我餓了。我想要一個熱狗）」。'
  }),
  createItem({
    id: 'hwg_b3_bb_19',
    book: 3,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'What do you want to eat?',
    options: ["I want two sandwiches, please.", "I'm ten years old.", "It's windy and cool.", "She can play basketball.", "He is in the bedroom.", "Yes, please.", "They are under the table."],
    explanation: '問句詢問「What do you want to eat?（你想吃什麼？）」，回答具體想要吃的食物「I want two sandwiches, please.（我想要兩個三明治）」。'
  }),
  createItem({
    id: 'hwg_b3_bb_20',
    book: 3,
    unit: 'Unit 2',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: '英文單字「hot dog」的中文意思是什麼？',
    options: ['熱狗', '漢堡', '三明治', '披薩', '炸雞', '麵包', '派餅'],
    explanation: '「hot dog」意為「熱狗」；漢堡是 hamburger，三明治是 sandwich。'
  }),
  createItem({
    id: 'hwg_b3_bb_21',
    book: 3,
    unit: 'Unit 2',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: '英文單字「thirsty」是指哪一種感覺？',
    options: ['口渴的', '飢餓的', '睏倦的', '飽足的', '生病的', '著急的', '興奮的'],
    explanation: '「thirsty」表示「口渴的」；「飢餓的」是 hungry。'
  }),
  createItem({
    id: 'hwg_b3_bb_22',
    book: 3,
    unit: 'Unit 2',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'I am very hungry. I want three ______ for lunch.',
    options: ['hot dogs', 'hot dog', 'a hot dog', 'an hot dog', 'apple', 'banana', 'water'],
    explanation: '數字 three（3）大於 1，後面必須接複數名詞「hot dogs」。'
  }),
  createItem({
    id: 'hwg_b3_bb_23',
    book: 3,
    unit: 'Unit 2',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'A: Are you hungry? B: No, I ______ not. I\'m full.',
    options: ['am', 'is', 'are', 'can', 'do', 'have', 'be'],
    explanation: '主詞為第一人稱單數「I」，對應的否定 be 動詞為「am not」。'
  }),
  createItem({
    id: 'hwg_b3_bb_24',
    book: 3,
    unit: 'Unit 2',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 2,
    question: '在早餐店裡，店員問你想吃什麼（What do you want?），你想點一個漢堡，應該怎麼回答？',
    options: ['I want a hamburger, please.', 'I want a water, please.', 'I am ten years old.', 'It is sunny today.', 'I can jump and run.', 'She is hungry.', 'They are my brothers.'],
    explanation: '回應點餐需求應用「I want a hamburger, please.（我想要一個漢堡，謝謝）」。'
  }),
  createItem({
    id: 'hwg_b3_bb_25',
    book: 3,
    unit: 'Unit 2',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: '閱讀點餐對話：「Clerk: Welcome! What do you want? Eric: I want one hamburger and two apples. Clerk: Here you are. Eric: Thank you.」請問 Eric 總共點了幾顆蘋果？',
    options: ['2 顆', '1 顆', '3 顆', '4 顆', '0 顆', '5 顆', '6 顆'],
    explanation: '根據 Eric 所說「I want one hamburger and two apples」，蘋果點了「2 顆（two apples）」。'
  }),
  createItem({
    id: 'hwg_b3_bb_26',
    book: 3,
    unit: 'Unit 2',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 3,
    question: '閱讀日記：「After basketball practice, Ben and Sam are tired and hungry. Ben eats a big sandwich. Sam eats two bananas and an apple. They are full and happy now.」請問 Sam 吃了什麼水果？',
    options: ['兩根香蕉和一顆蘋果', '一個大三明治', '兩個熱狗和漢堡', '三顆紅蘋果', '一碗熱湯', '一塊巧克力蛋糕', '四顆橘子'],
    explanation: '文中指出「Sam eats two bananas and an apple」，因此 Sam 吃了「兩根香蕉和一顆蘋果」。'
  }),

  // --- Unit 3 (Drinks & What do you want?) ---
  createItem({
    id: 'hwg_b3_bb_27',
    book: 3,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'juice',
    options: ['juice', 'water', 'milk', 'tea', 'soda', 'soup', 'coffee'],
    explanation: '聽力音檔發音為「juice（果汁）」。'
  }),
  createItem({
    id: 'hwg_b3_bb_28',
    book: 3,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'milk',
    options: ['milk', 'water', 'juice', 'tea', 'soda', 'cake', 'bread'],
    explanation: '聽力音檔發音為「milk（牛奶）」。'
  }),
  createItem({
    id: 'hwg_b3_bb_29',
    book: 3,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Do you want some milk?',
    options: ["Yes, please. I'm thirsty.", "It's sunny today.", "I'm nine years old.", "She can play the piano.", "They are in the living room.", "He is my cousin.", "It is under the chair."],
    explanation: '問句提問「Do you want some milk?（你想要喝點牛奶嗎？）」，接受提議之禮貌回應為「Yes, please. I\'m thirsty.（好的，麻煩了。我很渴）」。'
  }),
  createItem({
    id: 'hwg_b3_bb_30',
    book: 3,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'What do you want to drink?',
    options: ["I want some orange juice, please.", "I have three sisters.", "It's five o'clock.", "No, I am not tired.", "She is singing in the room.", "They are blue pencils.", "Yes, I can swim."],
    explanation: '問句問「What do you want to drink?（你想喝什麼？）」，合適回應為表明想喝的飲品「I want some orange juice, please.（我想要一些柳橙汁）」。'
  }),
  createItem({
    id: 'hwg_b3_bb_31',
    book: 3,
    unit: 'Unit 3',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: '英文單字「water」的中文意思是什麼？',
    options: ['水', '牛奶', '果汁', '茶', '汽水', '湯', '咖啡'],
    explanation: '「water」意為「水」；milk 是牛奶，juice 是果汁。'
  }),
  createItem({
    id: 'hwg_b3_bb_32',
    book: 3,
    unit: 'Unit 3',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: '英文單字「tea」的中文意思是什麼？',
    options: ['茶', '水', '牛奶', '果汁', '可樂', '冰淇淋', '沙拉'],
    explanation: '「tea」意為「茶」；「水」是 water。'
  }),
  createItem({
    id: 'hwg_b3_bb_33',
    book: 3,
    unit: 'Unit 3',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'After running, Mike is thirsty. He wants some ______ to drink.',
    options: ['water', 'a water', 'waters', 'two water', 'sandwich', 'hot dog', 'apple'],
    explanation: '水（water）為不可數名詞，不可加 a 或複數 -s，與 some 搭配填入「water」。'
  }),
  createItem({
    id: 'hwg_b3_bb_34',
    book: 3,
    unit: 'Unit 3',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'A: Do you want some juice? B: No, ______ you. I\'m not thirsty.',
    options: ['thank', 'thanks', 'please', 'welcome', 'fine', 'sorry', 'good'],
    explanation: '禮貌拒絕飲食提議的固定用語為「No, thank you.（不用了，謝謝你）」。'
  }),
  createItem({
    id: 'hwg_b3_bb_35',
    book: 3,
    unit: 'Unit 3',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 2,
    question: '媽媽倒了一杯新鮮牛奶問你要不要喝，你很有禮貌地想接受，應該怎麼回答？',
    options: ['Yes, please. Thank you, Mom.', 'No, thank you. I am full.', 'I want a hot dog.', 'It is rainy today.', 'I can run fast.', 'She is my sister.', 'They are under the bed.'],
    explanation: '禮貌接受飲食提議應使用「Yes, please.（好的，麻煩了）」。'
  }),
  createItem({
    id: 'hwg_b3_bb_36',
    book: 3,
    unit: 'Unit 3',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: '閱讀短文：「In the kitchen, Dad pours three glasses. Lucy wants some milk. Tim wants some orange juice. Dad drinks a cup of warm tea.」請問 Tim 想要喝什麼飲料？',
    options: ['柳橙汁', '牛奶', '熱茶', '開水', '汽水', '蘋果汁', '熱可可'],
    explanation: '根據文中「Tim wants some orange juice」，Tim 想喝的是「柳橙汁」。'
  }),
  createItem({
    id: 'hwg_b3_bb_37',
    book: 3,
    unit: 'Unit 3',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 3,
    question: '閱讀野餐記趣：「It is a sunny day. Penny and her brother are in the park. Penny is thirsty and drinks cold water. Her brother eats a banana and drinks apple juice.」請問誰喝了冰涼的開水？',
    options: ['Penny', 'Penny 的哥哥', '他們的爸爸', '公園管理員', '他們的老師', 'Penny 的朋友', '沒有人'],
    explanation: '文中指出「Penny is thirsty and drinks cold water」，故喝水的是「Penny」。'
  }),

  // --- Unit 4 (Abilities & Action Verbs) ---
  createItem({
    id: 'hwg_b3_bb_38',
    book: 3,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'dance',
    options: ['dance', 'swim', 'sing', 'jump', 'run', 'draw', 'read'],
    explanation: '聽力音檔發音為「dance（跳舞）」。'
  }),
  createItem({
    id: 'hwg_b3_bb_39',
    book: 3,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'swim',
    options: ['swim', 'sing', 'run', 'fly', 'dance', 'jump', 'climb'],
    explanation: '聽力音檔發音為「swim（游泳）」。'
  }),
  createItem({
    id: 'hwg_b3_bb_40',
    book: 3,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Can you swim in the pool?',
    options: ["Yes, I can. I like swimming.", "No, it isn't. It's windy.", "I want two apples.", "She is ten years old.", "They are on the desk.", "He is my father.", "It is three o'clock."],
    explanation: '問句以助動詞 Can 提問能力「Can you swim in the pool?（你會在泳池游泳嗎？）」，適當回應為「Yes, I can. I like swimming.（是的，我會。我喜歡游泳）」。'
  }),
  createItem({
    id: 'hwg_b3_bb_41',
    book: 3,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Can your brother ride a bike?',
    options: ["Yes, he can ride very well.", "No, she can't dance.", "It is sunny outside.", "I want some milk.", "They are happy students.", "He is in the living room.", "I am nine years old."],
    explanation: '問句提問「Can your brother ride a bike?（你哥哥/弟弟會騎腳踏車嗎？）」，主詞為男性單數「he」，對應回答為「Yes, he can ride very well.（是的，他騎得很好）」。'
  }),
  createItem({
    id: 'hwg_b3_bb_42',
    book: 3,
    unit: 'Unit 4',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: '英文動作單字「sing」的中文意思是什麼？',
    options: ['唱歌', '跳舞', '游泳', '跑步', '跳躍', '畫畫', '讀書'],
    explanation: '「sing」意為「唱歌」；「跳舞」是 dance，「游泳」是 swim。'
  }),
  createItem({
    id: 'hwg_b3_bb_43',
    book: 3,
    unit: 'Unit 4',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: '青蛙（frog）在荷葉上跳來跳去。英文中表示「跳躍」的單字是哪一個？',
    options: ['jump', 'run', 'swim', 'dance', 'sing', 'fly', 'walk'],
    explanation: '「jump」表示「跳躍」；run 是跑步，swim 是游泳。'
  }),
  createItem({
    id: 'hwg_b3_bb_44',
    book: 3,
    unit: 'Unit 4',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'Kelly has a sweet voice. She ______ sing very well.',
    options: ['can', 'is', 'are', 'am', 'do', 'have', 'be'],
    explanation: '表示能力「能夠／會唱歌」應使用助動詞「can」，後面接原形動詞 sing。'
  }),
  createItem({
    id: 'hwg_b3_bb_45',
    book: 3,
    unit: 'Unit 4',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'A: Can you fly like a bird? B: No, I ______.',
    options: ["can't", 'am not', "isn't", "aren't", "don't", "not", "haven't"],
    explanation: '問句以助動詞 Can 提問，否定簡答應使用「No, I can\'t.」。'
  }),
  createItem({
    id: 'hwg_b3_bb_46',
    book: 3,
    unit: 'Unit 4',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 2,
    question: '體育課時老師想知道大家會不會跳繩，詢問「Can you jump?」，你很有自信地回答你會，應該怎麼說？',
    options: ['Yes, I can.', "No, I can't.", "Yes, I am.", "No, it isn't.", "I want an apple.", "It's sunny today.", "She is happy."],
    explanation: '針對「Can you...?」的肯定回答為「Yes, I can.（是的，我會）」。'
  }),
  createItem({
    id: 'hwg_b3_bb_47',
    book: 3,
    unit: 'Unit 4',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 2,
    question: '學校舉辦才藝表演，你想報名唱歌與跳舞，老師問「What can you do?」，你應該怎麼說？',
    options: ["I can sing and dance.", "I'm ten years old.", "It's sunny today.", "I want an apple.", "She is my friend.", "They are students.", "He can swim."],
    explanation: '回答能做什麼才藝應使用「I can sing and dance.（我會唱歌與跳舞）」。'
  }),
  createItem({
    id: 'hwg_b3_bb_48',
    book: 3,
    unit: 'Unit 4',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 3,
    question: '閱讀動物小百科：「Fish live in the water. They can swim all day. Birds have wings. They can fly in the sky and sing sweet songs.」請問鳥兒（birds）在空中能夠做什麼？',
    options: ['飛翔與唱歌', '游泳與跳水', '跑步與跳舞', '爬樹與睡覺', '寫字與畫畫', '捉迷藏', '捕魚'],
    explanation: '文中敘述「Birds have wings. They can fly in the sky and sing sweet songs」，故為「飛翔與唱歌」。'
  }),

  // --- Festival (Halloween) ---
  createItem({
    id: 'hwg_b3_bb_49',
    book: 3,
    unit: 'Festival',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: '萬聖節小朋友常常提著南瓜燈去要糖果，英文「pumpkin」的意思是什麼？',
    options: ['南瓜', '糖果', '鬼魂', '巫婆', '面具', '蘋果', '黑貓'],
    explanation: '「pumpkin」意為「南瓜」；candy 是糖果，ghost 是鬼魂。'
  }),
  createItem({
    id: 'hwg_b3_bb_50',
    book: 3,
    unit: 'Festival',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'On Halloween night, the children knock on doors and shout, "Trick ______ treat!"',
    options: ['or', 'and', 'but', 'for', 'to', 'in', 'at'],
    explanation: '萬聖節傳統討糖討趣語固定為「Trick or treat!（不給糖就搗蛋！）」，使用連接詞「or」。'
  })
];

// ============================================================================
// BOOK 4 NEW ITEMS (+50 Questions: Starter, Unit 1~4, Review 1~2, Festival)
// Exact TaskType Quota: L-WORD: 8, L-RESP: 8, V-MEAN: 10, G-MC: 10, G-CTX: 6, R-COMP: 8
// ============================================================================
const BOOK_4_NEW_ITEMS = [
  // --- Starter (Review Numbers 10-60 & Daily Clock) ---
  createItem({
    id: 'hwg_b4_bb_01',
    book: 4,
    unit: 'Starter',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: '英文單字「thirty」代表的阿拉伯數字是多少？',
    options: ['30', '13', '3', '300', '40', '50', '20'],
    explanation: '「thirty」代表數字 30；「13」是 thirteen。'
  }),
  createItem({
    id: 'hwg_b4_bb_02',
    book: 4,
    unit: 'Starter',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'The school bell rings ______ eight o\'clock in the morning.',
    options: ['at', 'on', 'in', 'to', 'for', 'of', 'by'],
    explanation: '在具體時間點（如 eight o\'clock）前面，固定搭配介系詞「at」。'
  }),
  createItem({
    id: 'hwg_b4_bb_03',
    book: 4,
    unit: 'Starter',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 2,
    question: '上課快遲到了，你想禮貌詢問路人現在幾點了，應該怎麼說？',
    options: ["Excuse me. What time is it?", "Excuse me. Where are you?", "Excuse me. Who are you?", "Excuse me. How are you?", "Excuse me. What's this?", "Excuse me. Can you jump?", "Excuse me. Are you hungry?"],
    explanation: '禮貌詢問時間的固定句型為「Excuse me. What time is it?（不好意思，請問現在幾點？）」。'
  }),
  createItem({
    id: 'hwg_b4_bb_04',
    book: 4,
    unit: 'Starter',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: '閱讀生活短文：「David gets up at seven o\'clock. He eats breakfast at 7:30. At eight o\'clock, he goes to school with his sister.」請問 David 在幾點吃早餐？',
    options: ['七點半 (7:30)', '七點整 (7:00)', '八點整 (8:00)', '八點半 (8:30)', '六點半 (6:30)', '九點整 (9:00)', '六點整 (6:00)'],
    explanation: '文中指出「He eats breakfast at 7:30」，故為「七點半 (7:30)」。'
  }),

  // --- Unit 1 (What time is it? / Daily Schedule) ---
  createItem({
    id: 'hwg_b4_bb_05',
    book: 4,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'breakfast',
    options: ['breakfast', 'lunch', 'dinner', 'brunch', 'bed', 'school', 'clock'],
    explanation: '聽力音檔發音為「breakfast（早餐）」。'
  }),
  createItem({
    id: 'hwg_b4_bb_06',
    book: 4,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: "o'clock",
    options: ["o'clock", 'clock', 'time', 'watch', 'hour', 'minute', 'second'],
    explanation: '聽力音檔發音為「o\'clock（點鐘，用於整點）」。'
  }),
  createItem({
    id: 'hwg_b4_bb_07',
    book: 4,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'What time is it now?',
    options: ["It's twelve o'clock. Time for lunch.", "I'm ten years old.", "She is in the kitchen.", "He can swim fast.", "They are apples.", "Yes, it is sunny.", "I want a sandwich."],
    explanation: '問句問「What time is it now?（現在幾點？）」，合適回應為「It\'s twelve o\'clock. Time for lunch.（十二點整。該吃午餐了）」。'
  }),
  createItem({
    id: 'hwg_b4_bb_08',
    book: 4,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: "It's seven o'clock. Hurry up!",
    options: ["OK, Mom. I'm ready for school.", "No, it isn't rainy.", "Yes, I can dance.", "She is my teacher.", "They are pencils.", "I have three books.", "It is under the box."],
    explanation: '催促時間「It\'s seven o\'clock. Hurry up!（七點了，快一點！）」，合適回應為「OK, Mom. I\'m ready for school.（好的，媽媽。我準備好去上學了）」。'
  }),
  createItem({
    id: 'hwg_b4_bb_09',
    book: 4,
    unit: 'Unit 1',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: '英文單字「dinner」是指哪一餐？',
    options: ['晚餐', '早餐', '午餐', '下午茶', '消夜', '早午餐', '甜點'],
    explanation: '「dinner」意為「晚餐」；breakfast 是早餐，lunch 是午餐。'
  }),
  createItem({
    id: 'hwg_b4_bb_10',
    book: 4,
    unit: 'Unit 1',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: '鬧鐘響起該上床睡覺了。英文中「bed」在此片語「Time for bed.」代表什麼意思？',
    options: ['就寢／睡覺', '起床', '洗澡', '看電視', '吃早餐', '寫作業', '做運動'],
    explanation: '「Time for bed.」為習慣用法，意指「該上床睡覺了」。'
  }),
  createItem({
    id: 'hwg_b4_bb_11',
    book: 4,
    unit: 'Unit 1',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'It\'s twelve o\'clock. Time ______ lunch!',
    options: ['for', 'to', 'at', 'in', 'on', 'of', 'by'],
    explanation: '「Time for + 名詞」為固定表達「做...的時間到了」；lunch 為名詞，故填介系詞「for」。'
  }),
  createItem({
    id: 'hwg_b4_bb_12',
    book: 4,
    unit: 'Unit 1',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'A: ______ is the time? B: It\'s five o\'clock.',
    options: ['What', 'Who', 'Where', 'How', 'Which', 'Why', 'When'],
    explanation: '詢問時間使用疑問代名詞「What」，構成「What is the time?」或「What time is it?」。'
  }),
  createItem({
    id: 'hwg_b4_bb_13',
    book: 4,
    unit: 'Unit 1',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 2,
    question: '晚上九點半了，媽媽走進房間提醒你該上床睡覺了，她會說哪一句話？',
    options: ["It's 9:30. Time for bed.", "It's 9:30. Time for breakfast.", "It's 9:30. Time for lunch.", "It's 9:30. How's the weather?", "It's 9:30. Where are you?", "It's 9:30. Can you swim?", "It's 9:30. Stand up, please."],
    explanation: '晚上九點半為就寢時間，應提醒「Time for bed.（該睡覺了）」。'
  }),
  createItem({
    id: 'hwg_b4_bb_14',
    book: 4,
    unit: 'Unit 1',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: '閱讀行程表：「12:00 - Eat lunch. 12:40 - Read books. 1:00 - Take a nap. 3:30 - Play basketball.」請問下午一點整（1:00）要做什麼事？',
    options: ['睡午覺 (Take a nap)', '吃午餐', '看書', '打籃球', '寫作業', '打掃教室', '放學回家'],
    explanation: '根據行程表「1:00 - Take a nap」，下午一點整要做的事是「睡午覺」。'
  }),
  createItem({
    id: 'hwg_b4_bb_15',
    book: 4,
    unit: 'Unit 1',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 3,
    question: '閱讀對話：「Mom: Wake up, Ken! It\'s seven o\'clock. Ken: What time is breakfast? Mom: Breakfast is at 7:20. Hurry up!」請問早餐是在幾點幾分？',
    options: ['七點二十分 (7:20)', '七點整 (7:00)', '七點十分 (7:10)', '七點半 (7:30)', '八點整 (8:00)', '六點五十分 (6:50)', '八點十分 (8:10)'],
    explanation: '根據媽媽所說「Breakfast is at 7:20」，可知早餐時間為「七點二十分」。'
  }),

  // --- Unit 2 (Where are you? / Rooms in a House) ---
  createItem({
    id: 'hwg_b4_bb_16',
    book: 4,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'kitchen',
    options: ['kitchen', 'living room', 'bedroom', 'bathroom', 'dining room', 'garden', 'garage'],
    explanation: '聽力音檔發音為「kitchen（廚房）」。'
  }),
  createItem({
    id: 'hwg_b4_bb_17',
    book: 4,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'living room',
    options: ['living room', 'bedroom', 'bathroom', 'dining room', 'kitchen', 'balcony', 'yard'],
    explanation: '聽力音檔發音為「living room（客廳）」。'
  }),
  createItem({
    id: 'hwg_b4_bb_18',
    book: 4,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Where are you, Peter?',
    options: ["I'm in the living room watching TV.", "She is ten years old.", "It's three o'clock.", "They are apples.", "Yes, I can swim.", "It is under the chair.", "He is my brother."],
    explanation: '問句問「Where are you, Peter?（彼得，你在哪裡？）」，適當回應為說明自身所在位置「I\'m in the living room watching TV.（我在客廳看電視）」。'
  }),
  createItem({
    id: 'hwg_b4_bb_19',
    book: 4,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Is Mom in the kitchen?',
    options: ["Yes, she is cooking dinner.", "No, it isn't rainy.", "Yes, I can jump.", "They are in the box.", "I want two hot dogs.", "He is ten.", "It's on the table."],
    explanation: '問句問「Is Mom in the kitchen?（媽媽在廚房嗎？）」，對應媽媽為女性單數 she，回答「Yes, she is cooking dinner.（是的，她正在做晚餐）」。'
  }),
  createItem({
    id: 'hwg_b4_bb_20',
    book: 4,
    unit: 'Unit 2',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: '英文單字「bedroom」的中文意思是什麼？',
    options: ['臥室／臥房', '客廳', '廚房', '浴室', '餐廳', '陽台', '書房'],
    explanation: '「bedroom」（bed + room）意為「臥室／臥房」；客廳是 living room。'
  }),
  createItem({
    id: 'hwg_b4_bb_21',
    book: 4,
    unit: 'Unit 2',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: '英文單字「bathroom」的中文意思是什麼？',
    options: ['浴室／洗手間', '廚房', '客廳', '臥房', '玄關', '庭院', '地下室'],
    explanation: '「bathroom」（bath + room）意為「浴室／洗手間」。'
  }),
  createItem({
    id: 'hwg_b4_bb_22',
    book: 4,
    unit: 'Unit 2',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'A: Where is Grandma? B: She is ______ the garden reading a book.',
    options: ['in', 'on', 'at', 'to', 'for', 'with', 'under'],
    explanation: '表示在特定空間內部（如 the garden / the room），使用介系詞「in」。'
  }),
  createItem({
    id: 'hwg_b4_bb_23',
    book: 4,
    unit: 'Unit 2',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'A: Are you in the dining room? B: No, I ______ not. I\'m in the yard.',
    options: ['am', 'is', 'are', 'can', 'do', 'have', 'be'],
    explanation: '針對「Are you...?」提問，主詞為第一人稱 I，否定回答搭配 be 動詞「am not」。'
  }),
  createItem({
    id: 'hwg_b4_bb_24',
    book: 4,
    unit: 'Unit 2',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 2,
    question: '朋友到你家作客，在玄關呼喊問你在哪裡（Where are you?），你在客廳，應該怎麼回答？',
    options: ["I'm in the living room.", "I'm ten years old.", "It's sunny today.", "I can ride a bike.", "She is in the kitchen.", "They are hot dogs.", "It's two o'clock."],
    explanation: '回答自身所在位置應用「I\'m in the living room.（我在客廳）」。'
  }),
  createItem({
    id: 'hwg_b4_bb_25',
    book: 4,
    unit: 'Unit 2',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: '閱讀捉迷藏短文：「The kids play hide-and-seek at home. Andy is in the bedroom under the bed. Linda is in the dining room behind the door. Where is Toby? He is in the kitchen!」請問 Andy 躲在哪裡？',
    options: ['臥室的床底下', '餐廳的門後面', '廚房裡', '客廳的沙發上', '浴室門口', '陽台花盆旁', '庭院樹下'],
    explanation: '文中指出「Andy is in the bedroom under the bed」，故 Andy 躲在「臥室的床底下」。'
  }),
  createItem({
    id: 'hwg_b4_bb_26',
    book: 4,
    unit: 'Unit 2',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 3,
    question: '閱讀家庭生活短文：「It is 6:30 in the evening. Mom and Dad are in the kitchen cooking dinner. Brother Leo is in the living room doing homework. Little May is in the bathroom washing her hands.」請問誰在浴室裡洗手？',
    options: ['May (Little May)', 'Leo', 'Mom', 'Dad', 'Grandpa', 'Grandma', '鄰居'],
    explanation: '文中寫到「Little May is in the bathroom washing her hands」，故在浴室洗手的是「May」。'
  }),

  // --- Unit 3 (Where is the ball? / Place Prepositions & Objects) ---
  createItem({
    id: 'hwg_b4_bb_27',
    book: 4,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'under',
    options: ['under', 'on', 'in', 'by', 'behind', 'next', 'over'],
    explanation: '聽力音檔發音為「under（在...下方）」。'
  }),
  createItem({
    id: 'hwg_b4_bb_28',
    book: 4,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'table',
    options: ['table', 'chair', 'desk', 'box', 'bed', 'door', 'sofa'],
    explanation: '聽力音檔發音為「table（桌子）」。'
  }),
  createItem({
    id: 'hwg_b4_bb_29',
    book: 4,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Where is my English book?',
    options: ["It's on the teacher's desk.", "I'm ten years old.", "She can play the piano.", "They are apples.", "No, it isn't rainy.", "Yes, please.", "He is in the kitchen."],
    explanation: '問句問「Where is my English book?（我的英文書在哪裡？）」，物品為單數代名詞 it，回答「It\'s on the teacher\'s desk.（在老師的桌上）」。'
  }),
  createItem({
    id: 'hwg_b4_bb_30',
    book: 4,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Where are the yellow balls?',
    options: ["They are under the wooden chair.", "It is three o'clock.", "I want some orange juice.", "She is my cousin.", "Yes, I can swim.", "He is nine.", "It's on the table."],
    explanation: '問句問複數物品「Where are the yellow balls?（那些黃色球在哪裡？）」，以 They 回答「They are under the wooden chair.（它們在木椅下面）」。'
  }),
  createItem({
    id: 'hwg_b4_bb_31',
    book: 4,
    unit: 'Unit 3',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: '英文方位介系詞「under」的中文意思是什麼？',
    options: ['在...下面／下方', '在...上面', '在...裡面', '在...旁邊', '在...後面', '在...中間', '在...前面'],
    explanation: '「under」意為「在...下面／下方」；「在...上面」是 on。'
  }),
  createItem({
    id: 'hwg_b4_bb_32',
    book: 4,
    unit: 'Unit 3',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: '英文家具單字「chair」的中文意思是什麼？',
    options: ['椅子', '桌子', '書桌', '床鋪', '箱子', '門', '窗戶'],
    explanation: '「chair」意為「椅子」；table 是桌子，desk 是書桌。'
  }),
  createItem({
    id: 'hwg_b4_bb_33',
    book: 4,
    unit: 'Unit 3',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'Look! The little cute cat is sleeping ______ the big box.',
    options: ['in', 'at', 'to', 'for', 'of', 'from', 'with'],
    explanation: '貓咪在箱子內部睡覺，表示在封閉立體容器內部，使用介系詞「in」。'
  }),
  createItem({
    id: 'hwg_b4_bb_34',
    book: 4,
    unit: 'Unit 3',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'A: Where ______ my keys? B: They are on the dining table.',
    options: ['are', 'is', 'am', 'be', 'can', 'do', 'have'],
    explanation: '主詞「my keys」為複數名詞（後面代名詞為 they），搭配的 be 動詞應為「are」。'
  }),
  createItem({
    id: 'hwg_b4_bb_35',
    book: 4,
    unit: 'Unit 3',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 2,
    question: '妹妹找不到她的鉛筆盒，你看到鉛筆盒就在書桌上面，你應該怎麼指引她？',
    options: ["It's on the desk.", "It's under the bed.", "It's in the kitchen.", "I want a sandwich.", "I'm ten years old.", "She can dance.", "They are apples."],
    explanation: '鉛筆盒在書桌（desk）上面（on），應說「It\'s on the desk.」。'
  }),
  createItem({
    id: 'hwg_b4_bb_36',
    book: 4,
    unit: 'Unit 3',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: '閱讀尋物小故事：「Sam cannot find his red cap. He looks around the room. It is not on the chair. It is not under the bed. Ah, look! It is in his school bag!」請問 Sam 的紅色帽子最後在哪裡找到？',
    options: ['在他的書包裡面', '在椅子上面', '在床鋪底下', '在書桌上面', '在客廳沙發上', '在衣櫃裡面', '在廚房桌上'],
    explanation: '文末清楚寫出「It is in his school bag!（在它的書包裡面！）」，故應選「在他的書包裡面」。'
  }),
  createItem({
    id: 'hwg_b4_bb_37',
    book: 4,
    unit: 'Unit 3',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 3,
    question: '閱讀房間描寫：「In Lucy\'s room, there is a big desk by the window. Her computer is on the desk. Her tennis shoes are under the chair. A cute teddy bear is on her bed.」請問泰迪熊（teddy bear）放在哪裡？',
    options: ['在她的床上', '在書桌上', '在椅子下', '在窗戶邊', '在書包裡', '在地毯上', '在門後'],
    explanation: '根據最後一句「A cute teddy bear is on her bed」，泰迪熊放在「在她的床上」。'
  }),

  // --- Unit 4 (What are you doing? / Present Continuous Actions) ---
  createItem({
    id: 'hwg_b4_bb_38',
    book: 4,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'reading',
    options: ['reading', 'sleeping', 'eating', 'cooking', 'drawing', 'singing', 'writing'],
    explanation: '聽力音檔發音為現在分詞「reading（正在閱讀）」。'
  }),
  createItem({
    id: 'hwg_b4_bb_39',
    book: 4,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'sleeping',
    options: ['sleeping', 'eating', 'reading', 'cooking', 'drawing', 'dancing', 'jumping'],
    explanation: '聽力音檔發音為現在分詞「sleeping（正在睡覺）」。'
  }),
  createItem({
    id: 'hwg_b4_bb_40',
    book: 4,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'What are you doing right now?',
    options: ["I'm drawing a picture of an elephant.", "It's three o'clock.", "I'm ten years old.", "She is my sister.", "They are on the desk.", "Yes, I can swim.", "He is in the bedroom."],
    explanation: '問句問「What are you doing right now?（你現在正在做什麼？）」，合適回應為現在進行式「I\'m drawing a picture of an elephant.（我正在畫一隻大象）」。'
  }),
  createItem({
    id: 'hwg_b4_bb_41',
    book: 4,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'What is your brother Kevin doing?',
    options: ["He is sleeping in his bedroom.", "She is singing in the living room.", "I want some orange juice.", "It's sunny and hot.", "They are under the table.", "Yes, please.", "No, I can't."],
    explanation: '問句問男性「your brother Kevin」正在做什麼，回答以 He 開頭「He is sleeping in his bedroom.（他正在臥室裡睡覺）」。'
  }),
  createItem({
    id: 'hwg_b4_bb_42',
    book: 4,
    unit: 'Unit 4',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: '英文動作單字「cooking」是指正在進行什麼活動？',
    options: ['做飯／烹飪', '睡覺', '閱讀', '畫畫', '唱歌', '跑步', '打掃'],
    explanation: '「cooking」意為「做飯／烹飪」；reading 是閱讀，sleeping 是睡覺。'
  }),
  createItem({
    id: 'hwg_b4_bb_43',
    book: 4,
    unit: 'Unit 4',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: '英文動作單字「drawing」是指正在進行什麼活動？',
    options: ['畫畫／繪圖', '寫字', '閱讀', '唱歌', '跳舞', '煮飯', '散步'],
    explanation: '「drawing」意為「畫畫／繪圖」；writing 是寫字。'
  }),
  createItem({
    id: 'hwg_b4_bb_44',
    book: 4,
    unit: 'Unit 4',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'Shh! Be quiet! The baby ______ in the crib.',
    options: ['is sleeping', 'sleep', 'sleeps', 'are sleeping', 'am sleeping', 'slept', 'to sleep'],
    explanation: '主詞「The baby」為單數第三人稱，且前面有「Be quiet!」提示正在發生的動作，現在進行式應為「is sleeping」。'
  }),
  createItem({
    id: 'hwg_b4_bb_45',
    book: 4,
    unit: 'Unit 4',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'A: What are Tina and Amy doing? B: ______ are reading English books.',
    options: ['They', 'She', 'He', 'I', 'You', 'It', 'We'],
    explanation: '答句主詞指代「Tina and Amy」兩個人（複數第三人稱），代名詞應使用「They」。'
  }),
  createItem({
    id: 'hwg_b4_bb_46',
    book: 4,
    unit: 'Unit 4',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 2,
    question: '媽媽走進你的書房問你正在做什麼（What are you doing?），你正專心在讀英文故事書，你應該怎麼回答？',
    options: ["I'm reading a storybook.", "I'm ten years old.", "It's five o'clock.", "I want some water.", "She is in the kitchen.", "They are pencils.", "He can swim fast."],
    explanation: '表達自己正在閱讀故事書，應說「I\'m reading a storybook.」。'
  }),
  createItem({
    id: 'hwg_b4_bb_47',
    book: 4,
    unit: 'Unit 4',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 2,
    question: '老師在教室巡視，問「Who is drawing on the board?」，你想舉手說明你正在黑板上畫畫，應該怎麼說？',
    options: ["I am drawing on the board.", "I am sleeping in bed.", "I want a sandwich.", "It is twelve o'clock.", "She is my mother.", "They are on the desk.", "It is rainy today."],
    explanation: '表達自己正在黑板上畫畫，應回答「I am drawing on the board.」。'
  }),
  createItem({
    id: 'hwg_b4_bb_48',
    book: 4,
    unit: 'Unit 4',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 3,
    question: '閱讀週日下午短文：「It is Sunday afternoon. The Lee family is at home. Dad is cooking in the kitchen. Mom is reading in the living room. Tim is drawing a robot in his room.」請問 Tim 正在房間裡做什麼？',
    options: ['畫機器人 (drawing a robot)', '做飯', '看書', '睡覺', '寫功課', '玩積木', '聽音樂'],
    explanation: '文中指出「Tim is drawing a robot in his room」，因此 Tim 正在「畫機器人」。'
  }),

  // --- Festival (Easter / Mother's Day) ---
  createItem({
    id: 'hwg_b4_bb_49',
    book: 4,
    unit: 'Festival',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: '復活節時大家會把煮熟的蛋塗上美麗繽紛的顏色，這種彩蛋在英文中稱為？',
    options: ['Easter eggs', 'Easter bunnies', 'Easter cards', 'Easter hats', 'Easter baskets', 'Easter flowers', 'Easter gifts'],
    explanation: '復活節彩蛋的英文即為「Easter eggs」；Easter bunnies 是復活節兔子。'
  }),
  createItem({
    id: 'hwg_b4_bb_50',
    book: 4,
    unit: 'Festival',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'On Mother\'s Day, Jenny gives a card ______ her mother to say thank you.',
    options: ['to', 'for', 'at', 'in', 'on', 'with', 'by'],
    explanation: '句型「give something to someone（把某物給某人）」固定搭配介系詞「to」。'
  })
];

// ============================================================================
// MAIN EXECUTION
// ============================================================================
const newItems = [...BOOK_3_NEW_ITEMS, ...BOOK_4_NEW_ITEMS];

if (newItems.length !== 100) {
  throw new Error(`Expected exactly 100 new items for Batch B, got ${newItems.length}`);
}

const currentMod = await import(pathToFileURL(mcqFilePath).href);
const currentBank = currentMod.HERE_WE_GO_MCQ_BANK || [];
const baseBank = currentBank.filter(q => !q.id.includes('_bb_'));

if (baseBank.length !== 1689) {
  throw new Error(`Current base bank must have exactly 1,689 items before Batch B, got ${baseBank.length}`);
}

// 檢查 ID 唯一性
const existingIds = new Set(baseBank.map(q => q.id));
for (const item of newItems) {
  if (existingIds.has(item.id)) {
    throw new Error(`Duplicate ID detected: ${item.id}`);
  }
}

// 組合新題庫
const updatedBank = [...baseBank, ...newItems];

// 寫入 hereWeGoMcqBank.js
const bankHeader = `// -------------------------------------------------------------
// 翰林英語 Here We Go 全國首創小學全冊檢定題庫
// 本檔案由系統標準題庫正規化工具與擴充建置管線共同維護
// -------------------------------------------------------------

export const HERE_WE_GO_BOOK_META = ${JSON.stringify(currentMod.HERE_WE_GO_BOOK_META, null, 2)};

export const HERE_WE_GO_MCQ_BANK = ${JSON.stringify(updatedBank, null, 2)};
`;

fs.writeFileSync(mcqFilePath, bankHeader.replace(/\r\n/g, '\n'), 'utf8');

// 計算各冊與各單元最新 Canonical 統計數據
const bookCounts = {};
const unitCounts = {};

for (const q of updatedBank) {
  bookCounts[q.book] = (bookCounts[q.book] || 0) + 1;
  const unitKey = `b${q.book}_${q.unit}`;
  unitCounts[unitKey] = (unitCounts[unitKey] || 0) + 1;
}

const mappingMod = await import(pathToFileURL(mappingFilePath).href);
const currentLegacyMap = mappingMod.LEGACY_TO_CANONICAL_MAP || {};
const currentMetaMap = mappingMod.CANONICAL_META_MAP || {};

const nextLegacyMap = { ...currentLegacyMap };
const nextMetaMap = { ...currentMetaMap };

for (const item of newItems) {
  nextLegacyMap[item.id] = item.id;
  nextMetaMap[item.id] = {
    canonicalId: item.id,
    primaryScope: item.primaryScope,
    scopes: item.scopes,
    clones: []
  };
}

const nextStats = {
  totalLegacyMapped: Object.keys(nextLegacyMap).length,
  canonicalItems: updatedBank.length,
  duplicateClones: 1728,
  prunedClonesCount: 1728,
  crossBookIndependentSets: 22,
  bookCounts,
  unitCounts
};

const mappingContent = `/**
 * 課本題庫 Canonical Question 映射表與結構定義 (Scheme A + Batch A & B Expanded)
 *
 * 規範依據：
 * - 冊內正規化 (In-book Canonical)：現有 ${updatedBank.length} 題 (原 1,589 題 + Batch A 100 題 + Batch B 100 題)
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

console.log(`✓ Added ${newItems.length} Batch B questions (Book 3: +50, Book 4: +50)`);
console.log(`✓ Updated HERE_WE_GO_MCQ_BANK total canonical items: ${updatedBank.length}`);
console.log(`✓ Book 3 count: ${bookCounts[3]}, Book 4 count: ${bookCounts[4]}`);
