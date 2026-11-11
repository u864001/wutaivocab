/**
 * Batch C (Books 5 & 6) 高品質題庫擴充建置腳本 (expand_batch_c_b5_b6.mjs)
 *
 * 嚴格遵守「七大命題鐵律」、V-MEAN 語境生活填空、R-COMP 字數規格 (30~50字)：
 * 1. Canonical 唯一性：每題皆為獨立原創題 (isCanonical: true)，scopes 長度 <= 2。
 * 2. 單一正解防呆：情境充足，正答唯一，排他性 100%。
 * 3. 性別中立防呆：明確人稱或情境，無性別線索時嚴禁同時出現 He/She 或 His/Her。
 * 4. 禁用萬用樣板句：6 個誘答必須同質同詞性，0 樣板句。
 * 5. 聽力防洩漏：L-WORD / L-RESP 統一固定題幹，逐字稿僅在 media.audioText。
 * 6. 詳解 100% 同步：具體說明正答理由與誘答錯誤原因。
 * 7. 靜態結構契約：7 選項、正答 answer: 0、挖空 ______、無雙句點。
 * 8. V-MEAN 語境填空：純生活語境英文句子挖空，嚴禁機械式翻譯題。
 * 9. R-COMP 短文字數：短文長度嚴格落於 30~50 字。
 *
 * 配比保證 (每冊 50 題，合計 100 題)：
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
// BOOK 5 NEW ITEMS (+50 Questions: Starter, Unit 1~4, Review 1~2, Festival)
// Exact TaskType Quota: L-WORD: 8, L-RESP: 8, V-MEAN: 10, G-MC: 10, G-CTX: 6, R-COMP: 8
// ============================================================================
const BOOK_5_NEW_ITEMS = [
  // --- Starter (School Places & Activities) ---
  createItem({
    id: 'hwg_b5_bc_01',
    book: 5,
    unit: 'Starter',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 1,
    question: 'Leo loves reading storybooks quietly. He is in the ______ now.',
    options: ['library', 'museum', 'hospital', 'park', 'supermarket', 'zoo', 'bank'],
    explanation: '句意為「Leo 喜歡安靜地閱讀故事書，他現在正在圖書館裡。」填入 library 最符合情境；museum 為博物館。'
  }),
  createItem({
    id: 'hwg_b5_bc_02',
    book: 5,
    unit: 'Starter',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 1,
    question: 'Look! The students ______ studying English in the classroom.',
    options: ['are', 'is', 'am', 'be', 'can', 'do', 'have'],
    explanation: '主詞「The students」為複數名詞，現在進行式搭配的 be 動詞為「are」。'
  }),
  createItem({
    id: 'hwg_b5_bc_03',
    book: 5,
    unit: 'Starter',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 1,
    question: '下課時你想問新同學「你最喜歡哪一個科目？」，應該怎麼問？',
    options: [
      'What is your favorite subject?',
      'What day is today?',
      'Where are you going?',
      'How many zebras are there?',
      'How is the weather today?',
      'What time do you sleep?',
      'Who is your teacher?'
    ],
    explanation: '詢問對方最喜歡的學科科目，標準英文問句為「What is your favorite subject?」。'
  }),
  createItem({
    id: 'hwg_b5_bc_04',
    book: 5,
    unit: 'Starter',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: "閱讀短文：「Leo is a fifth-grade student. Today is Monday morning. Leo walks to school with his sister. He has English class and science class before lunch. In the afternoon, he plays basketball with his friends in the gym.」請問 Leo 在星期一早上有哪兩門課？",
    options: ['英語與自然', '國語與數學', '音樂與美術', '體育與社會', '生活與綜合', '數學與美勞', '健康與體育'],
    explanation: "短文第 4 句明確指出「He has English class and science class before lunch.（他在午餐前有英語課和自然課）」，故選「英語與自然」。"
  }),

  // --- Unit 1 (Days of the Week) ---
  createItem({
    id: 'hwg_b5_bc_05',
    book: 5,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'Wednesday',
    options: ['Wednesday', 'Tuesday', 'Thursday', 'Monday', 'Friday', 'Saturday', 'Sunday'],
    explanation: '聽力發音為「Wednesday（星期三）」。'
  }),
  createItem({
    id: 'hwg_b5_bc_06',
    book: 5,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'Thursday',
    options: ['Thursday', 'Tuesday', 'Wednesday', 'Friday', 'Monday', 'Saturday', 'Sunday'],
    explanation: '聽力發音為「Thursday（星期四）」。'
  }),
  createItem({
    id: 'hwg_b5_bc_07',
    book: 5,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'What day is today?',
    options: ["It's Tuesday.", "I'm ten years old.", "I have three dogs.", "She is my friend.", "It's on the table.", "Yes, I can.", "I want an apple."],
    explanation: '問句詢問「今天是星期幾？」，應回答星期名稱「It\'s Tuesday.（今天是星期二）」。'
  }),
  createItem({
    id: 'hwg_b5_bc_08',
    book: 5,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Is today Friday?',
    options: ["No, it's not. It's Thursday.", "Yes, I like pizza.", "I am in the classroom.", "They are five pencils.", "She has long hair.", "I can ride a bike.", "It's twelve o'clock."],
    explanation: '問句為 be 動詞引導的是非問句「今天是星期五嗎？」，否定回答為「No, it\'s not. It\'s Thursday.（不，今天不是。今天是星期四）」。'
  }),
  createItem({
    id: 'hwg_b5_bc_09',
    book: 5,
    unit: 'Unit 1',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'Today is Saturday. Tomorrow is ______, and we do not go to school.',
    options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    explanation: '句意為「今天是星期六，明天是星期日，我們不用上學。」週六的隔天為 Sunday（星期日）。'
  }),
  createItem({
    id: 'hwg_b5_bc_10',
    book: 5,
    unit: 'Unit 1',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: "The first school day of the week is ______. Let's get ready for class!",
    options: ['Monday', 'Sunday', 'Saturday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    explanation: '句意為「一週的第一個上學日是星期一。讓我們準備上課吧！」故選 Monday。'
  }),
  createItem({
    id: 'hwg_b5_bc_11',
    book: 5,
    unit: 'Unit 1',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 1,
    question: 'What day ______ it today? It is Wednesday.',
    options: ['is', 'are', 'am', 'be', 'do', 'does', 'can'],
    explanation: '主詞 it 搭配的單數現在式 be 動詞為「is」。'
  }),
  createItem({
    id: 'hwg_b5_bc_12',
    book: 5,
    unit: 'Unit 1',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'We go to the park together ______ Sunday afternoon.',
    options: ['on', 'in', 'at', 'to', 'for', 'with', 'by'],
    explanation: '在特定的星期或特定星期的上午/下午，介系詞固定使用「on」。'
  }),
  createItem({
    id: 'hwg_b5_bc_13',
    book: 5,
    unit: 'Unit 1',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 1,
    question: '朋友問你今天是星期幾，你想回答「今天是星期四」，該怎麼說？',
    options: [
      "It's Thursday today.",
      "It's twelve o'clock.",
      "I like Thursdays.",
      "Today is sunny.",
      "I have art class.",
      "It's five dollars.",
      "It's on the table."
    ],
    explanation: '回答今天星期四的正確句型為「It\'s Thursday today.」。'
  }),
  createItem({
    id: 'hwg_b5_bc_14',
    book: 5,
    unit: 'Unit 1',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: "閱讀短文：「Today is Friday afternoon. The students are happy because the weekend is coming. Kevin plans to visit his grandparents on Saturday. On Sunday, he wants to ride his bicycle in the park with his father. Kevin loves sunny weekends.」請問 Kevin 計畫在星期六做什麼？",
    options: ['拜訪爺爺奶奶', '在公園騎腳踏車', '在家裡寫作業', '去圖書館看書', '跟朋友打籃球', '跟媽媽去超市', '參加音樂發表會'],
    explanation: "短文第 3 句寫道「Kevin plans to visit his grandparents on Saturday.（Kevin 計畫在星期六拜訪爺爺奶奶）」，故正確答案為「拜訪爺爺奶奶」。"
  }),
  createItem({
    id: 'hwg_b5_bc_15',
    book: 5,
    unit: 'Unit 1',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: "閱讀短文：「Amy checks the calendar on the kitchen wall. Today is Wednesday, so she has swimming class after school. Tomorrow is Thursday, and her school has an English spelling test. Amy studies hard every day after school.」請問 Amy 在星期三放學後有什麼活動？",
    options: ['游泳課', '英語拼字測驗', '鋼琴發表會', '去超市買水果', '打掃自己房間', '參觀歷史博物館', '去動物園看大象'],
    explanation: "短文第 2 句指出「Today is Wednesday, so she has swimming class after school.（今天是星期三，所以她放學後有游泳課）」，故選「游泳課」。"
  }),

  // --- Unit 2 (School Subjects) ---
  createItem({
    id: 'hwg_b5_bc_16',
    book: 5,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'science',
    options: ['science', 'social studies', 'English', 'Chinese', 'math', 'art', 'music'],
    explanation: '聽力發音為「science（自然科學）」。'
  }),
  createItem({
    id: 'hwg_b5_bc_17',
    book: 5,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'music',
    options: ['music', 'art', 'math', 'English', 'Chinese', 'science', 'PE'],
    explanation: '聽力發音為「music（音樂）」。'
  }),
  createItem({
    id: 'hwg_b5_bc_18',
    book: 5,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'What subjects do you have on Wednesday?',
    options: ["I have English and math.", "It's Wednesday today.", "I'm ten years old.", "Yes, I like school.", "He is in the park.", "There are five horses.", "I want an apple."],
    explanation: '問句詢問「你星期三有什麼科目？」，回答科目為「I have English and math.（我有英語與數學課）」。'
  }),
  createItem({
    id: 'hwg_b5_bc_19',
    book: 5,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Do you have PE class today?',
    options: ["Yes, I do. We play dodgeball today.", "No, it's Tuesday.", "I have three sisters.", "She is a good doctor.", "It's in the bedroom.", "They are green apples.", "I am twelve years old."],
    explanation: '助動詞 Do 引導的是非問句，肯定簡答搭配完整說明「Yes, I do. We play dodgeball today.」。'
  }),
  createItem({
    id: 'hwg_b5_bc_20',
    book: 5,
    unit: 'Unit 2',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'We sing songs and play the recorder in ______ class.',
    options: ['music', 'math', 'science', 'PE', 'art', 'Chinese', 'English'],
    explanation: '句意為「我們在音樂課唱歌並吹奏直笛。」故選 music。'
  }),
  createItem({
    id: 'hwg_b5_bc_21',
    book: 5,
    unit: 'Unit 2',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'In ______ class, we run around the playground and play basketball.',
    options: ['PE', 'music', 'art', 'math', 'English', 'Chinese', 'science'],
    explanation: '句意為「在體育課，我們在操場跑步並打籃球。」體育課縮寫為 PE。'
  }),
  createItem({
    id: 'hwg_b5_bc_22',
    book: 5,
    unit: 'Unit 2',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: "Emma ______ have social studies class on Monday.",
    options: ["doesn't", "don't", "isn't", "aren't", "not", "no", "can't"],
    explanation: '第三人稱單數 Emma 在現在簡單式中的否定助動詞應使用「doesn\'t」。'
  }),
  createItem({
    id: 'hwg_b5_bc_23',
    book: 5,
    unit: 'Unit 2',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 1,
    question: '______ they have English class every morning?',
    options: ['Do', 'Does', 'Are', 'Is', 'Am', 'Can', 'Be'],
    explanation: '主詞 they 為複數，一般動詞 have 的疑問句助動詞應使用「Do」。'
  }),
  createItem({
    id: 'hwg_b5_bc_24',
    book: 5,
    unit: 'Unit 2',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 1,
    question: '想要詢問同學今天有沒有數學課，最有禮貌且文法正確的問法是哪一句？',
    options: [
      'Do you have math class today?',
      'What time is it now?',
      'Where is the math book?',
      'Is today Tuesday?',
      'Do you like apples?',
      'Who is your math teacher?',
      'Can you draw a circle?'
    ],
    explanation: '詢問對方今天是否有某堂課，標準句型為「Do you have ... class today?」。'
  }),
  createItem({
    id: 'hwg_b5_bc_25',
    book: 5,
    unit: 'Unit 2',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: "閱讀短文：「Tony loves Friday because he has art class and music class in the afternoon. In art class, Tony paints a blue mountain with trees. In music class, he sings a cheerful song with his classmates. Tony is very happy.」請問 Tony 在星期五下午的美術課畫了什麼？",
    options: ['畫了藍色的山與樹木', '畫了一隻可愛的小貓', '畫了一架紅色的飛機', '畫了一顆大南瓜', '畫了一座現代博物館', '畫了許多美麗的花朵', '畫了一張世界地圖'],
    explanation: "短文第 2 句明確寫道「In art class, Tony paints a blue mountain with trees.（在美術課，Tony 畫了藍色的山與樹木）」，故選「畫了藍色的山與樹木」。"
  }),
  createItem({
    id: 'hwg_b5_bc_26',
    book: 5,
    unit: 'Unit 2',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: "閱讀短文：「Mia has a busy Tuesday schedule. In the morning, she has Chinese and math. After lunch, she has science class in the lab. Mia loves science because she can do fun experiments with plants and clean water.」請問 Mia 在星期二下午的哪一個地方上自然課？",
    options: ['在實驗室 (in the lab)', '在操場 (on the playground)', '在音樂教室 (in the music room)', '在圖書館 (in the library)', '在校長室 (in the office)', '在體育館 (in the gym)', '在禮堂 (in the hall)'],
    explanation: "短文第 3 句指出「she has science class in the lab.（她在實驗室上自然課）」，故選「在實驗室 (in the lab)」。"
  }),

  // --- Unit 3 (Town Places) ---
  createItem({
    id: 'hwg_b5_bc_27',
    book: 5,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'supermarket',
    options: ['supermarket', 'hospital', 'museum', 'library', 'park', 'zoo', 'bank'],
    explanation: '聽力發音為「supermarket（超級市場）」。'
  }),
  createItem({
    id: 'hwg_b5_bc_28',
    book: 5,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'museum',
    options: ['museum', 'hospital', 'library', 'supermarket', 'park', 'zoo', 'post office'],
    explanation: '聽力發音為「museum（博物館）」。'
  }),
  createItem({
    id: 'hwg_b5_bc_29',
    book: 5,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Where are you going, Kevin?',
    options: ["I'm going to the library to study.", "It's sunny and warm.", "I'm eleven years old.", "Yes, I like apples.", "She is my cousin.", "There are four cows.", "It's on the table."],
    explanation: '問句詢問「你要去哪裡？」，回答目的地為「I\'m going to the library to study.（我要去圖書館讀書）」。'
  }),
  createItem({
    id: 'hwg_b5_bc_30',
    book: 5,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Where is the post office?',
    options: ["It's next to the big bank.", "I have three brothers.", "It is three o'clock.", "Yes, I do.", "I'm ten years old.", "They are cute birds.", "I want some orange juice."],
    explanation: '問句詢問「郵局在哪裡？」，指引方位的回答為「It\'s next to the big bank.（它在大型銀行旁邊）」。'
  }),
  createItem({
    id: 'hwg_b5_bc_31',
    book: 5,
    unit: 'Unit 3',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'When people are sick, they visit the doctor at the ______.',
    options: ['hospital', 'museum', 'supermarket', 'zoo', 'park', 'post office', 'bank'],
    explanation: '句意為「當人們生病時，他們會去醫院看醫生。」故選 hospital。'
  }),
  createItem({
    id: 'hwg_b5_bc_32',
    book: 5,
    unit: 'Unit 3',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'Mom wants to buy fresh milk, eggs, and bread at the ______.',
    options: ['supermarket', 'museum', 'hospital', 'library', 'zoo', 'park', 'bank'],
    explanation: '句意為「媽媽想在超級市場購買新鮮鮮奶、雞蛋與麵包。」故選 supermarket。'
  }),
  createItem({
    id: 'hwg_b5_bc_33',
    book: 5,
    unit: 'Unit 3',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'The children are ______ to the central park on foot.',
    options: ['walking', 'walk', 'walks', 'walked', 'are walk', 'to walk', 'is walking'],
    explanation: 'be 動詞 are 後面接現在分詞 V-ing 構成現在進行式「are walking」。'
  }),
  createItem({
    id: 'hwg_b5_bc_34',
    book: 5,
    unit: 'Unit 3',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 1,
    question: 'Where ______ Mrs. Lin going this afternoon?',
    options: ['is', 'are', 'am', 'be', 'do', 'does', 'can'],
    explanation: '主詞 Mrs. Lin 為單數女性人稱，搭配的單數 be 動詞為「is」。'
  }),
  createItem({
    id: 'hwg_b5_bc_35',
    book: 5,
    unit: 'Unit 3',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 1,
    question: '你在街上遇到朋友，想問他「你正準備要去哪裡？」，應該說哪一句？',
    options: [
      'Where are you going?',
      'Where is my schoolbag?',
      'What day is today?',
      'How do you go to school?',
      'What are you doing?',
      'Who is that woman?',
      'Is this your pencil?'
    ],
    explanation: '詢問對方正前往哪裡的標準句型為「Where are you going?」。'
  }),
  createItem({
    id: 'hwg_b5_bc_36',
    book: 5,
    unit: 'Unit 3',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: "閱讀短文：「On Saturday morning, Mr. Brown and his daughter Tina go into town. First, they mail a birthday card at the post office. Next, they walk to the supermarket to buy fresh apples and warm milk. Finally, they rest in the park.」請問 Mr. Brown 和 Tina 在郵局做了什麼事？",
    options: ['寄出生日卡片', '買新鮮的蘋果與牛奶', '看有趣的古代恐龍展覽', '在草地上散步休息', '借了三本英文故事書', '存了一筆零用錢', '看牙醫並檢查牙齒'],
    explanation: "短文第 2 句寫道「First, they mail a birthday card at the post office.（首先，他們在郵局寄了一張生日卡片）」，故選「寄出生日卡片」。"
  }),
  createItem({
    id: 'hwg_b5_bc_37',
    book: 5,
    unit: 'Unit 3',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: "閱讀短文：「Jenny visits the city museum with her mother today. The museum is huge, with many old dinosaur bones and beautiful paintings. Jenny loves drawing, so she sketches a giant dinosaur in her notebook. She has a wonderful day in the museum.」請問 Jenny 在城市博物館的筆記本裡畫了什麼？",
    options: ['畫了一隻巨大的恐龍', '畫了一幅美麗的風景', '畫了一輛紅色公車', '畫了一棟高大的醫院', '畫了許多新鮮的水果', '畫了一隻可愛的斑馬', '畫了一座現代圖書館'],
    explanation: "短文第 3 句明確寫道「Jenny loves drawing, so she sketches a giant dinosaur in her notebook.（Jenny 喜歡畫畫，所以她在筆記本裡素描了一隻巨大的恐龍）」，故選「畫了一隻巨大的恐龍」。"
  }),

  // --- Unit 4 (Animals & Counting) ---
  createItem({
    id: 'hwg_b5_bc_38',
    book: 5,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'zebra',
    options: ['zebra', 'tiger', 'lion', 'elephant', 'monkey', 'bear', 'horse'],
    explanation: '聽力發音為「zebra（斑馬）」。'
  }),
  createItem({
    id: 'hwg_b5_bc_39',
    book: 5,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'elephant',
    options: ['elephant', 'monkey', 'giraffe', 'zebra', 'tiger', 'lion', 'bear'],
    explanation: '聽力發音為「elephant（大象）」。'
  }),
  createItem({
    id: 'hwg_b5_bc_40',
    book: 5,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'How many horses are there on the farm?',
    options: ["There are eight horses.", "It's sunny today.", "I'm in the fifth grade.", "She is my aunt.", "Yes, I like animals.", "It is ten dollars.", "I have art class."],
    explanation: '問句詢問「農場上有幾匹馬？」，回答數量為「There are eight horses.（那裡有八匹馬）」。'
  }),
  createItem({
    id: 'hwg_b5_bc_41',
    book: 5,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Are there any monkeys in the tall tree?',
    options: ["Yes, there are three monkeys.", "No, it's Monday.", "I am twelve years old.", "She is a teacher.", "It is on the table.", "I want some water.", "They like hot dogs."],
    explanation: 'There are 引導的是非問句，肯定回答數量為「Yes, there are three monkeys.（有的，那裡有三隻猴子）」。'
  }),
  createItem({
    id: 'hwg_b5_bc_42',
    book: 5,
    unit: 'Unit 4',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'The big grey ______ has a very long nose and two large ears.',
    options: ['elephant', 'zebra', 'tiger', 'monkey', 'lion', 'horse', 'bear'],
    explanation: '句意為「那隻灰色的大象有著非常長的鼻子與兩隻大耳朵。」符合特徵的動物為 elephant。'
  }),
  createItem({
    id: 'hwg_b5_bc_43',
    book: 5,
    unit: 'Unit 4',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'A ______ is a wild animal with black and white stripes on its body.',
    options: ['zebra', 'lion', 'tiger', 'elephant', 'bear', 'monkey', 'horse'],
    explanation: '句意為「斑馬是一種身上帶有黑白條紋的野生動物。」符合特徵的動物為 zebra。'
  }),
  createItem({
    id: 'hwg_b5_bc_44',
    book: 5,
    unit: 'Unit 4',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 1,
    question: 'There ______ only one little sheep under the big tree.',
    options: ['is', 'are', 'am', 'be', 'can', 'do', 'have'],
    explanation: '後方名詞「one little sheep」為單數，there be 句型應搭配單數動詞「is」。'
  }),
  createItem({
    id: 'hwg_b5_bc_45',
    book: 5,
    unit: 'Unit 4',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 1,
    question: 'How ______ cows are eating grass in the green field?',
    options: ['many', 'much', 'old', 'tall', 'big', 'any', 'some'],
    explanation: '修飾可數複數名詞 cows 的疑問詞片語為「How many（有多少）」。'
  }),
  createItem({
    id: 'hwg_b5_bc_46',
    book: 5,
    unit: 'Unit 4',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 1,
    question: '參觀農場時你想知道牧場裡有幾隻綿羊，應該怎麼問農夫？',
    options: [
      'How many sheep are there on your farm?',
      'What are the sheep doing?',
      'Where is your farm, sir?',
      'Do you like sheep, sir?',
      'What color are the sheep?',
      'How much is the sheep?',
      'Is that your dog, sir?'
    ],
    explanation: '詢問可數動物數量的標準問句為「How many ... are there...?」。'
  }),
  createItem({
    id: 'hwg_b5_bc_47',
    book: 5,
    unit: 'Unit 4',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 1,
    question: '弟弟指著樹上的猴子問「Are there two monkeys?」，你數了數發現剛好是兩隻，該如何肯定回答？',
    options: [
      'Yes, there are.',
      "No, there aren't.",
      'Yes, they do.',
      "No, they don't.",
      'Yes, it is.',
      'Yes, I can.',
      'There is one.'
    ],
    explanation: '對「Are there...?」問句的肯定簡答句為「Yes, there are.」。'
  }),
  createItem({
    id: 'hwg_b5_bc_48',
    book: 5,
    unit: 'Unit 4',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: "閱讀短文：「Uncle David has a peaceful farm in the valley. There are ten cows, seven white sheep, and three horses on his farm. Every morning, Uncle David feeds the animals fresh grass and clean water. The animals are very healthy.」請問 Uncle David 的農場上有幾隻白色的綿羊？",
    options: ['七隻綿羊 (seven sheep)', '十隻綿羊 (ten sheep)', '三隻綿羊 (three sheep)', '五隻綿羊 (five sheep)', '十二隻綿羊 (twelve sheep)', '兩隻綿羊 (two sheep)', '八隻綿羊 (eight sheep)'],
    explanation: "短文第 2 句明確寫道「There are ten cows, seven white sheep, and three horses on his farm.」，因此白綿羊的數量為「七隻綿羊 (seven sheep)」。"
  }),

  // --- Festival (Thanksgiving & Celebrations) ---
  createItem({
    id: 'hwg_b5_bc_49',
    book: 5,
    unit: 'Festival',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'On Thanksgiving Day, families gather to eat a big roasted ______ for dinner.',
    options: ['turkey', 'pumpkin', 'apple', 'sandwich', 'hamburger', 'pizza', 'hot dog'],
    explanation: '句意為「在感恩節當天，全家人團聚在晚餐享用一大隻烤火雞。」感恩節傳統佳餚為 turkey。'
  }),
  createItem({
    id: 'hwg_b5_bc_50',
    book: 5,
    unit: 'Festival',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: "We say 'Thank you' and give thanks ______ our family on Thanksgiving.",
    options: ['for', 'on', 'in', 'at', 'with', 'by', 'of'],
    explanation: 'give thanks for... 為固定文法搭配片語，表示「為……表達感謝之意」。'
  })
];

// ============================================================================
// BOOK 6 NEW ITEMS (+50 Questions: Starter, Unit 1~4, Review 1~2, Festival)
// Exact TaskType Quota: L-WORD: 8, L-RESP: 8, V-MEAN: 10, G-MC: 10, G-CTX: 6, R-COMP: 8
// ============================================================================
const BOOK_6_NEW_ITEMS = [
  // --- Starter (Daily Routines & Review) ---
  createItem({
    id: 'hwg_b6_bc_01',
    book: 6,
    unit: 'Starter',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 1,
    question: 'Lucas is running on the sports field. He is wearing his red ______.',
    options: ['sneakers', 'jacket', 'umbrella', 'glasses', 'watch', 'gloves', 'backpack'],
    explanation: '句意為「Lucas 正在運動場跑步，他穿著他的紅色運動鞋。」跑步穿著運動鞋 sneakers 最合適。'
  }),
  createItem({
    id: 'hwg_b6_bc_02',
    book: 6,
    unit: 'Starter',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 1,
    question: 'Look! Nina and Emma ______ drinking warm water in the dining room.',
    options: ['are', 'is', 'am', 'be', 'can', 'do', 'have'],
    explanation: '主詞「Nina and Emma」為兩個人（複數代名詞 they），進行式搭配的 be 動詞為「are」。'
  }),
  createItem({
    id: 'hwg_b6_bc_03',
    book: 6,
    unit: 'Starter',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 1,
    question: '看到同學臉色蒼白看起來很不舒服，你想關心問他「你怎麼了？還好嗎？」，應該說哪一句？',
    options: [
      "What's wrong? Are you okay?",
      "What time do you sleep?",
      "Where are you going?",
      "Whose cap is this?",
      "What day is today?",
      "Do you like apples?",
      "How many books do you have?"
    ],
    explanation: '關心對方身體不適的慣用詢問句為「What\'s wrong? Are you okay?」。'
  }),
  createItem({
    id: 'hwg_b6_bc_04',
    book: 6,
    unit: 'Starter',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: "閱讀短文：「Lucas sits on a chair in the nurse's office. He has a sore throat and a bad cough today. The kind nurse gives him a glass of warm water. She tells Lucas to rest quietly until his mother arrives.」請問 Lucas 在健康中心時，護理師給了他什麼？",
    options: [
      '一杯溫水 (a glass of warm water)',
      '一顆甜蘋果 (a sweet apple)',
      '一包感冒藥 (a bag of medicine)',
      '一碗熱牛肉麵 (a bowl of beef noodles)',
      '一本英文故事書 (an English storybook)',
      '一把藍色雨傘 (a blue umbrella)',
      '一件保暖外套 (a warm jacket)'
    ],
    explanation: "短文第 3 句明確寫道「The kind nurse gives him a glass of warm water.（親切的護理師給了他一杯溫水）」，故選「一杯溫水」。"
  }),

  // --- Unit 1 (Body Parts & Aches) ---
  createItem({
    id: 'hwg_b6_bc_05',
    book: 6,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'stomachache',
    options: ['stomachache', 'headache', 'toothache', 'fever', 'cough', 'cold', 'sore throat'],
    explanation: '聽力發音為「stomachache（胃痛／肚子痛）」。'
  }),
  createItem({
    id: 'hwg_b6_bc_06',
    book: 6,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'toothache',
    options: ['toothache', 'headache', 'stomachache', 'fever', 'cough', 'cold', 'sore throat'],
    explanation: '聽力發音為「toothache（牙齒痛）」。'
  }),
  createItem({
    id: 'hwg_b6_bc_07',
    book: 6,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: "What's wrong with your right arm?",
    options: ["It hurts a lot. I fell down.", "I'm ten years old.", "It's Monday today.", "Yes, I like sports.", "She is my sister.", "They are five pencils.", "It's on the table."],
    explanation: '問句詢問「你的右手臂怎麼了？」，回答「It hurts a lot. I fell down.（非常痛，我跌倒了）」最符合語意。'
  }),
  createItem({
    id: 'hwg_b6_bc_08',
    book: 6,
    unit: 'Unit 1',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Does your head hurt, Max?',
    options: ["Yes, it does. I have a headache.", "No, it's Tuesday.", "I have three brothers.", "He is in the library.", "They are cute dogs.", "I want some juice.", "It's five o'clock."],
    explanation: '助動詞 Does 引導的是非問句，肯定回答為「Yes, it does. I have a headache.（是的，我頭很痛）」。'
  }),
  createItem({
    id: 'hwg_b6_bc_09',
    book: 6,
    unit: 'Unit 1',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'My tooth hurts terribly after eating sweet candy. I have a bad ______.',
    options: ['toothache', 'headache', 'stomachache', 'fever', 'cough', 'runny nose', 'sore throat'],
    explanation: '句意為「吃完甜糖果後我的牙齒痛得厲害，我牙齒痛得很嚴重。」故選 toothache。'
  }),
  createItem({
    id: 'hwg_b6_bc_10',
    book: 6,
    unit: 'Unit 1',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'Kevin has a high body temperature. His forehead is very hot. He has a ______.',
    options: ['fever', 'toothache', 'stomachache', 'headache', 'cough', 'cut', 'cold'],
    explanation: '句意為「Kevin 體溫很高，額頭非常燙。他發燒了。」故選 fever。'
  }),
  createItem({
    id: 'hwg_b6_bc_11',
    book: 6,
    unit: 'Unit 1',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 1,
    question: 'Ouch! My left leg ______ after playing soccer.',
    options: ['hurts', 'hurt', 'is hurt', 'hurting', 'to hurt', 'hurted', 'are hurt'],
    explanation: '主詞「My left leg」為單數名詞，現在式動詞應加 s 為「hurts」。'
  }),
  createItem({
    id: 'hwg_b6_bc_12',
    book: 6,
    unit: 'Unit 1',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 1,
    question: 'What is ______ with your little brother? He is crying.',
    options: ['wrong', 'right', 'bad', 'sick', 'hot', 'cold', 'happy'],
    explanation: 'What is wrong with someone 為關心對方發生何事的固定句型。'
  }),
  createItem({
    id: 'hwg_b6_bc_13',
    book: 6,
    unit: 'Unit 1',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 1,
    question: '你的喉嚨非常痛，老師問你怎麼了，你該如何用英語完整表達「我的喉嚨很痛」？',
    options: [
      "I have a sore throat.",
      "I have a toothache.",
      "I have a big backpack.",
      "I like warm tea.",
      "My stomach is full.",
      "I want to go home.",
      "It is very cold outside."
    ],
    explanation: '表達喉嚨痛的英文句型為「I have a sore throat.」。'
  }),
  createItem({
    id: 'hwg_b6_bc_14',
    book: 6,
    unit: 'Unit 1',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: "閱讀短文：「Emma cannot play dodgeball in PE class today because her right knee hurts. She fell on the playground during recess this morning. The PE teacher tells Emma to sit on the bench under the shade and drink some water.」請問 Emma 今天在體育課為什麼不能打躲避球？",
    options: [
      '因為她的右膝蓋受傷疼痛',
      '因為她發燒在家裡休息',
      '因為她肚子痛想去廁所',
      '因為她今天忘記帶運動鞋',
      '因為她有嚴重的蛀牙牙痛',
      '因為她正在圖書館看故事書',
      '因為她在音樂教室練唱歌曲'
    ],
    explanation: "短文第 1 句寫道「Emma cannot play dodgeball in PE class today because her right knee hurts.（因為她的右膝蓋疼痛）」，故選「因為她的右膝蓋受傷疼痛」。"
  }),
  createItem({
    id: 'hwg_b6_bc_15',
    book: 6,
    unit: 'Unit 1',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: "閱讀短文：「Peter ate three big ice creams after lunch on a hot sunny day. Now his stomach hurts and he feels uncomfortable. Peter's father takes him to see a doctor. The doctor advises Peter not to eat too much cold ice cream.」請問 Peter 肚子痛的原因是什麼？",
    options: [
      '午餐後吃了三支大冰淇淋',
      '在體育課跑步跌倒撞到肚子',
      '今天早上沒有吃營養早餐',
      '喝了太多冰可樂與熱水',
      '吃了過期發霉的雞肉三明治',
      '在公園吹冷風受涼感冒',
      '昨天晚上太晚睡覺很疲累'
    ],
    explanation: "短文第 1~2 句明確說明「Peter ate three big ice creams after lunch on a hot sunny day. Now his stomach hurts...（在午餐後吃了三支大冰淇淋，現在肚子痛）」，故選「午餐後吃了三支大冰淇淋」。"
  }),

  // --- Unit 2 (Illness & Care) ---
  createItem({
    id: 'hwg_b6_bc_16',
    book: 6,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'medicine',
    options: ['medicine', 'doctor', 'hospital', 'nurse', 'fever', 'headache', 'water'],
    explanation: '聽力發音為「medicine（藥物）」。'
  }),
  createItem({
    id: 'hwg_b6_bc_17',
    book: 6,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'rest',
    options: ['rest', 'run', 'read', 'ride', 'rain', 'ring', 'rope'],
    explanation: '聽力發音為「rest（休息）」。'
  }),
  createItem({
    id: 'hwg_b6_bc_18',
    book: 6,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'You look pale. Should you see a doctor?',
    options: ["Yes, my mom will take me to the clinic.", "No, it's Tuesday today.", "I'm in the fifth grade.", "She is my English teacher.", "There are five horses.", "It is three dollars.", "I have an apple."],
    explanation: '問句詢問「你臉色蒼白，該去看醫生嗎？」，肯定回答為「Yes, my mom will take me to the clinic.（是的，我媽媽會帶我去診所）」。'
  }),
  createItem({
    id: 'hwg_b6_bc_19',
    book: 6,
    unit: 'Unit 2',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Does Lucas take his medicine after meals?',
    options: ["Yes, he takes his medicine on time.", "No, it is sunny.", "I have two sisters.", "He is ten years old.", "They are in the park.", "It's on the table.", "I like pizza."],
    explanation: '助動詞 Does 引導的是非問句，肯定回答「Yes, he takes his medicine on time.（是的，他按時吃藥）」。'
  }),
  createItem({
    id: 'hwg_b6_bc_20',
    book: 6,
    unit: 'Unit 2',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'When you catch a bad cold, you should drink warm water and take a good ______ in bed.',
    options: ['rest', 'run', 'walk', 'jump', 'game', 'class', 'party'],
    explanation: '句意為「當你重感冒時，你應該喝溫水並在床上好好休息。」take a good rest 為固定搭配片語。'
  }),
  createItem({
    id: 'hwg_b6_bc_21',
    book: 6,
    unit: 'Unit 2',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'The friendly doctor gave Nina some white ______ to help her fever go down.',
    options: ['medicine', 'candy', 'cookies', 'ice cream', 'sandwiches', 'soda', 'pizza'],
    explanation: '句意為「親切的醫生給了 Nina 一些白色藥物來幫助她退燒。」故選 medicine。'
  }),
  createItem({
    id: 'hwg_b6_bc_22',
    book: 6,
    unit: 'Unit 2',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'You look very tired. You should ______ in bed and sleep.',
    options: ['stay', 'stays', 'staying', 'stayed', 'to stay', 'are stay', 'is stay'],
    explanation: '助動詞 should 後面必須接原形動詞，故填入「stay」。'
  }),
  createItem({
    id: 'hwg_b6_bc_23',
    book: 6,
    unit: 'Unit 2',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 1,
    question: 'Does your grandfather ______ warm tea every morning?',
    options: ['drink', 'drinks', 'drinking', 'drank', 'to drink', 'is drink', 'are drink'],
    explanation: '助動詞 Does 後面的一般動詞需恢復為原形動詞「drink」。'
  }),
  createItem({
    id: 'hwg_b6_bc_24',
    book: 6,
    unit: 'Unit 2',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 1,
    question: '同學感冒發燒而且一直咳嗽，你想建議他「你應該去看醫生」，最恰當的英語表達是哪一句？',
    options: [
      'You should see a doctor.',
      'You can play basketball.',
      'Where is the hospital?',
      'What day is today?',
      'Do you want some ice cream?',
      'How much is the medicine?',
      'Are you hungry now?'
    ],
    explanation: '給予就醫建議的標準祈使/建議句型為「You should see a doctor.」。'
  }),
  createItem({
    id: 'hwg_b6_bc_25',
    book: 6,
    unit: 'Unit 2',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: "閱讀短文：「Ben has a runny nose and a slight fever today. His mother takes him to Dr. Lin's clinic. Dr. Lin checks Ben's ears and throat. He gives Ben medicine and tells him to drink plenty of warm water.」請問林醫師建議感冒的 Ben 應該做什麼？",
    options: [
      '多喝溫開水並按時吃藥',
      '去操場打籃球流汗',
      '吃三支大冰淇淋降溫',
      '去圖書館借閱厚重的書',
      '跟同學一起去逛超級市場',
      '去游泳池參加游泳訓練',
      '在房間裡大聲練習唱英文歌'
    ],
    explanation: "短文最後一句寫道「He gives Ben medicine and tells him to drink plenty of warm water.（給 Ben 藥並叫他喝充足的溫水）」，故選「多喝溫開水並按時吃藥」。"
  }),
  createItem({
    id: 'hwg_b6_bc_26',
    book: 6,
    unit: 'Unit 2',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: "閱讀短文：「Cindy stayed up very late on Sunday night doing school projects. On Monday morning, she woke up with a bad headache. Her mother made her warm soup and told Cindy to stay home and rest in bed for one day.」請問 Cindy 在星期一早上頭痛的主要原因是什麼？",
    options: [
      '星期天晚上熬夜做學校作業',
      '在學校吃壞肚子食物中毒',
      '在體育課被躲避球打到頭部',
      '在下雨天淋雨著涼感冒發燒',
      '吃了太多甜食導致蛀牙牙痛',
      '在農場被小羊輕輕撞倒在地上',
      '在公車上看手機導致眼睛疲倦'
    ],
    explanation: "短文第 1 句指出「Cindy stayed up very late on Sunday night doing school projects.（Cindy 星期天晚上熬夜做學校作業）」，故選「星期天晚上熬夜做學校作業」。"
  }),

  // --- Unit 3 (Meals & Foods) ---
  createItem({
    id: 'hwg_b6_bc_27',
    book: 6,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'noodles',
    options: ['noodles', 'sandwiches', 'hamburgers', 'dumplings', 'cookies', 'pizzas', 'pancakes'],
    explanation: '聽力發音為「noodles（麵條）」。'
  }),
  createItem({
    id: 'hwg_b6_bc_28',
    book: 6,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'breakfast',
    options: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'supper', 'brunch'],
    explanation: '聽力發音為「breakfast（早餐）」。'
  }),
  createItem({
    id: 'hwg_b6_bc_29',
    book: 6,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'What would you like for breakfast, Leo?',
    options: ["I'd like an egg sandwich and milk.", "It's seven o'clock.", "I'm eleven years old.", "Yes, I like school.", "She is my mother.", "There are five horses.", "It's in the kitchen."],
    explanation: '問句詢問「你早餐想吃什麼？」，回答餐點為「I\'d like an egg sandwich and milk.（我想要一份雞蛋三明治與牛奶）」。'
  }),
  createItem({
    id: 'hwg_b6_bc_30',
    book: 6,
    unit: 'Unit 3',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Would you like some warm vegetable soup?',
    options: ["Yes, please. I'd love some.", "No, it's Wednesday.", "I have three brothers.", "He is in the bedroom.", "They are green apples.", "I am ten years old.", "It's on Green Street."],
    explanation: '禮貌詢問「你想要一些溫熱的蔬菜湯嗎？」，有禮貌的肯定接受為「Yes, please. I\'d love some.」。'
  }),
  createItem({
    id: 'hwg_b6_bc_31',
    book: 6,
    unit: 'Unit 3',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'Every morning at seven, I eat eggs and toast for ______.',
    options: ['breakfast', 'lunch', 'dinner', 'midnight', 'snack', 'supper', 'party'],
    explanation: '句意為「每天早上七點，我吃雞蛋與烤土司當作早餐。」早上的餐點為 breakfast。'
  }),
  createItem({
    id: 'hwg_b6_bc_32',
    book: 6,
    unit: 'Unit 3',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'Chef Wang cooks delicious beef ______ with fresh green vegetables in a big bowl.',
    options: ['noodles', 'juice', 'milk', 'tea', 'water', 'coffee', 'lemonade'],
    explanation: '句意為「王主廚在一只大碗裡烹調美味的牛肉麵，搭配新鮮綠色蔬菜。」故選 noodles。'
  }),
  createItem({
    id: 'hwg_b6_bc_33',
    book: 6,
    unit: 'Unit 3',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'What ______ you like to drink with your lunch?',
    options: ['would', 'are', 'is', 'did', 'have', 'were', 'am'],
    explanation: 'What would you like to... 為禮貌詢問想吃喝何物的固定助動詞用法。'
  }),
  createItem({
    id: 'hwg_b6_bc_34',
    book: 6,
    unit: 'Unit 3',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 1,
    question: 'Amy would like ______ orange juice and two pancakes.',
    options: ['some', 'a', 'an', 'many', 'few', 'one', 'these'],
    explanation: 'orange juice 為不可數名詞，肯定句修飾不可數名詞應使用「some」。'
  }),
  createItem({
    id: 'hwg_b6_bc_35',
    book: 6,
    unit: 'Unit 3',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 1,
    question: '招待朋友到家裡作客時，你想親切地詢問他「你想要喝一些蘋果汁嗎？」，最恰當有禮貌的說法是哪一句？',
    options: [
      'Would you like some apple juice?',
      'Do you have apple juice in your bag?',
      'Where is the apple juice, please?',
      'How much is this apple juice?',
      'What time do you drink juice?',
      'Is that your apple juice?',
      'Who made this apple juice?'
    ],
    explanation: '親切招待客人的禮貌句型為「Would you like some ...?」。'
  }),
  createItem({
    id: 'hwg_b6_bc_36',
    book: 6,
    unit: 'Unit 3',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: "閱讀短文：「Every Sunday, Grandma makes special lunch for her family. Today she prepares beef noodles, steamed dumplings, and hot corn soup. Everyone eats happily around the wooden table. Grandma's cooking is the most delicious food in the world for Leo.」請問奶奶今天星期日為全家人準備了什麼美味午餐？",
    options: [
      '牛肉麵、蒸餃與熱玉米濃湯',
      '炸雞、炸薯條與大杯可樂',
      '烤火雞、南瓜派與冰紅茶',
      '蔬菜沙拉、三明治與鮮奶',
      '義大利麵、烤披薩與柳橙汁',
      '蛋炒飯、紫菜蛋花湯與水果',
      '日式壽司、味噌湯與熱綠茶'
    ],
    explanation: "短文第 2 句指出「Today she prepares beef noodles, steamed dumplings, and hot corn soup.（牛肉麵、蒸餃與熱玉米濃湯）」，故選該項。"
  }),
  createItem({
    id: 'hwg_b6_bc_37',
    book: 6,
    unit: 'Unit 3',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: "閱讀短文：「Jason usually eats lunch at the school cafeteria at twelve o'clock. Today the cafeteria serves fried rice, green beans, and vegetable soup. Jason finishes all his food because he knows wasting food is not good for our planet.」請問 Jason 為什麼會把學校午餐全部吃光光？",
    options: [
      '因為他知道珍惜食物愛護地球',
      '因為下午體育課要考折返跑',
      '因為如果沒吃完會被老師處罰',
      '因為這是他媽媽親自送來的便當',
      '因為學校餐廳舉辦吃乾淨比賽',
      '因為他肚子非常飢餓想吃更多',
      '因為他想要領到餐廳的好寶寶貼紙'
    ],
    explanation: "短文第 3 句寫道「Jason finishes all his food because he knows wasting food is not good for our planet.（因為他知道浪費食物對我們的地球不好）」，故選「因為他知道珍惜食物愛護地球」。"
  }),

  // --- Unit 4 (Possessions & Whose) ---
  createItem({
    id: 'hwg_b6_bc_38',
    book: 6,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'umbrella',
    options: ['umbrella', 'backpack', 'jacket', 'glasses', 'watch', 'cap', 'gloves'],
    explanation: '聽力發音為「umbrella（雨傘）」。'
  }),
  createItem({
    id: 'hwg_b6_bc_39',
    book: 6,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-WORD',
    difficulty: 2,
    audioText: 'jacket',
    options: ['jacket', 'backpack', 'umbrella', 'cap', 'glasses', 'gloves', 'watch'],
    explanation: '聽力發音為「jacket（夾克外套）」。'
  }),
  createItem({
    id: 'hwg_b6_bc_40',
    book: 6,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Whose blue backpack is that on the floor?',
    options: ["It's Lucas's backpack.", "It is twelve o'clock.", "I'm in Class 501.", "Yes, I like blue.", "She is my aunt.", "There are three horses.", "It's rainy today."],
    explanation: '問句詢問「地板上的藍色書包是誰的？」，回答所有格為「It\'s Lucas\'s backpack.（它是 Lucas 的書包）」。'
  }),
  createItem({
    id: 'hwg_b6_bc_41',
    book: 6,
    unit: 'Unit 4',
    section: 'listening',
    taskType: 'L-RESP',
    difficulty: 2,
    audioText: 'Whose glasses are these on the table?',
    options: ["They are Grandpa's glasses.", "It is three dollars.", "No, it's Monday.", "I am twelve years old.", "He has a headache.", "I want some orange juice.", "It is next to the bank."],
    explanation: '問句詢問複數名詞「桌上的眼鏡是誰的？」，回答為「They are Grandpa\'s glasses.（它們是爺爺的眼鏡）」。'
  }),
  createItem({
    id: 'hwg_b6_bc_42',
    book: 6,
    unit: 'Unit 4',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: "It is raining heavily outside. Don't forget to take an ______ with you!",
    options: ['umbrella', 'watch', 'glasses', 'ring', 'dictionary', 'marker', 'crayon'],
    explanation: '句意為「外面正下著大雨，出門別忘了帶一把雨傘！」故選 umbrella。'
  }),
  createItem({
    id: 'hwg_b6_bc_43',
    book: 6,
    unit: 'Unit 4',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'It is freezing cold in the mountains. Put on your warm ______ before going out.',
    options: ['jacket', 'umbrella', 'watch', 'glasses', 'pen', 'notebook', 'pencil'],
    explanation: '句意為「山區天氣非常寒冷，出門前請穿上你的保暖夾克外套。」故選 jacket。'
  }),
  createItem({
    id: 'hwg_b6_bc_44',
    book: 6,
    unit: 'Unit 4',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 1,
    question: "______ red water bottle is this on the teacher's desk?",
    options: ['Whose', 'Who', "Who's", 'Where', 'What', 'Which', 'When'],
    explanation: '詢問物品所屬所有人的疑問代名詞應使用「Whose（誰的）」。'
  }),
  createItem({
    id: 'hwg_b6_bc_45',
    book: 6,
    unit: 'Unit 4',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 1,
    question: 'The blue gloves on the chair ______ mine. Thank you!',
    options: ['are', 'is', 'am', 'be', 'do', 'does', 'can'],
    explanation: '主詞「The blue gloves」為複數名詞，be 動詞應搭配「are」。'
  }),
  createItem({
    id: 'hwg_b6_bc_46',
    book: 6,
    unit: 'Unit 4',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 1,
    question: '看到桌上有一副不知是誰的眼鏡，想詢問大家「這副眼鏡是誰的？」，應該說哪一句？',
    options: [
      'Whose glasses are these?',
      'Where are my glasses?',
      'Do you have glasses?',
      'What color are the glasses?',
      'How much are these glasses?',
      'Are these your new shoes?',
      'Who can find the glasses?'
    ],
    explanation: 'glasses 為複數名詞，詢問所有人的標準句型為「Whose glasses are these?」。'
  }),
  createItem({
    id: 'hwg_b6_bc_47',
    book: 6,
    unit: 'Unit 4',
    section: 'grammar',
    taskType: 'G-CTX',
    difficulty: 1,
    question: '朋友問你這頂棒球帽是誰的，你想回答「這是 Lucas 的棒球帽」，該怎麼回答？',
    options: [
      "It's Lucas's cap.",
      "He is Lucas.",
      "It is on the cap.",
      "Lucas likes caps.",
      "This is a blue cap.",
      "I have a new cap.",
      "It's five dollars."
    ],
    explanation: '回答物品為某人的所有格句型為「It\'s Lucas\'s cap.」。'
  }),
  createItem({
    id: 'hwg_b6_bc_48',
    book: 6,
    unit: 'Unit 4',
    section: 'reading',
    taskType: 'R-COMP',
    difficulty: 2,
    question: "閱讀短文：「After English class, Nina found a yellow umbrella under her wooden desk. Nina brought the umbrella to the teacher. Miss Lin asked the whole class, and Kevin raised his hand. Kevin thanked Nina happily for returning his lost umbrella.」請問 Nina 在木頭書桌底下撿到的黃色雨傘是誰遺失的？",
    options: [
      '是 Kevin 遺失的黃色雨傘',
      '是林老師 (Miss Lin) 的雨傘',
      '是 Lucas 忘記帶回家的雨傘',
      '是 Nina 自己的備用黃色雨傘',
      '是校長在走廊巡視時掉落的',
      '是打掃阿姨放在教室後方的',
      '是健康中心護理師借給班上的'
    ],
    explanation: "短文第 3~4 句寫道「Miss Lin asked the whole class, and Kevin raised his hand. Kevin thanked Nina happily for returning his lost umbrella.（Kevin 舉手並感謝 Nina 歸還他遺失的雨傘）」，故選「是 Kevin 遺失的黃色雨傘」。"
  }),

  // --- Festival (Mother's Day & Celebrations) ---
  createItem({
    id: 'hwg_b6_bc_49',
    book: 6,
    unit: 'Festival',
    section: 'vocabulary',
    taskType: 'V-MEAN',
    difficulty: 2,
    question: 'On Mother\'s Day, children give a red ______ and a card to their mothers.',
    options: ['carnation', 'pumpkin', 'turkey', 'tree', 'egg', 'sandwich', 'hamburger'],
    explanation: '句意為「在母親節這天，孩子們會送一朵紅色的康乃馨與卡片給媽媽。」母親節象徵花卉為 carnation。'
  }),
  createItem({
    id: 'hwg_b6_bc_50',
    book: 6,
    unit: 'Festival',
    section: 'grammar',
    taskType: 'G-MC',
    difficulty: 2,
    question: 'We make a beautiful handmade card ______ our beloved mother on Mother\'s Day.',
    options: ['for', 'on', 'in', 'at', 'with', 'by', 'of'],
    explanation: 'make something for someone 表示「為某人製作某物」，故選介系詞「for」。'
  })
];

// ============================================================================
// MAIN EXECUTION PIPELINE
// ============================================================================
console.log('Starting Batch C Canonical Expansion (Book 5 & Book 6)...');

const currentMod = await import(pathToFileURL(mcqFilePath).href);
const baseBank = currentMod.HERE_WE_GO_MCQ_BANK || [];

console.log(`Current canonical bank size: ${baseBank.length}`);
if (baseBank.length !== 1789) {
  throw new Error(`Expected baseline database size of 1,789 items (Batch B), but found ${baseBank.length}`);
}

const newItems = [...BOOK_5_NEW_ITEMS, ...BOOK_6_NEW_ITEMS];
console.log(`Total new Batch C items to inject: ${newItems.length} (Book 5: 50, Book 6: 50)`);

// 檢查 ID 唯一性
const existingIds = new Set(baseBank.map((q) => q.id));
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
 * 課本題庫 Canonical Question 映射表與結構定義 (Scheme A + Batch A, B & C Expanded)
 *
 * 規範依據：
 * - 冊內正規化 (In-book Canonical)：現有 ${updatedBank.length} 題 (原 1,589 題 + Batch A 100 題 + Batch B 100 題 + Batch C 100 題)
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

console.log(`✓ Added ${newItems.length} Batch C questions (Book 5: +50, Book 6: +50)`);
console.log(`✓ Updated HERE_WE_GO_MCQ_BANK total canonical items: ${updatedBank.length}`);
console.log(`✓ Book 5 count: ${bookCounts[5]}, Book 6 count: ${bookCounts[6]}`);
