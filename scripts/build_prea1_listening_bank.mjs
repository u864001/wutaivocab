import fs from 'fs';
import path from 'path';
import { TME_PRE_A1_BANK } from '../src/data/exam/tmePreA1Bank.js';

// 1. Get existing 34 listening items, ensure reviewed: true
const existingListening = TME_PRE_A1_BANK.filter(q => q.category === 'listening').map(q => ({
  ...q,
  reviewed: true
}));

// 2. Define the 12 new listen-resp items (11-22)
const newListenRespItems = [
  {
    id: 'tme-listen-resp-11',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-resp',
    serialNum: 11,
    taskType: 'L-QA',
    difficulty: 1,
    media: {
      audioText: 'I am so sorry I broke your yellow crayon, Kelly.'
    },
    question: '請聽道歉句，選出最適當的回應句子：',
    options: [
      "That's all right. Don't worry.",
      'I like red crayons.',
      'Yes, I do.',
      'He is nine years old.',
      'It is ten dollars.',
      'Good morning, Kelly.'
    ],
    answer: 0,
    explanation: "對方道歉「I am so sorry...」，安慰與包容的標準禮貌回應為「That's all right. Don't worry.（沒關係，別擔心）」，故選 (A)。",
    reviewed: true
  },
  {
    id: 'tme-listen-resp-12',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-resp',
    serialNum: 12,
    taskType: 'L-QA',
    difficulty: 1,
    media: {
      audioText: "What's wrong, Andy? You look very tired."
    },
    question: '請聽關心問句，選出最適當的回應句子：',
    options: [
      'I have a headache and a fever.',
      'I like to eat apples.',
      'Yes, she can swim.',
      'It is on the chair.',
      'My name is Peter.',
      'At seven o\'clock.'
    ],
    answer: 0,
    explanation: "問句關心「What's wrong? You look very tired.（你怎麼了？你看起來很累）」，回答身體不適症狀「I have a headache and a fever.（我頭痛而且發燒）」，故選 (A)。",
    reviewed: true
  },
  {
    id: 'tme-listen-resp-13',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-resp',
    serialNum: 13,
    taskType: 'L-QA',
    difficulty: 1,
    media: {
      audioText: "It is a beautiful sunny day. Let's go swimming!"
    },
    question: '請聽提議句，選出最適當的回應句子：',
    options: [
      "Great idea! Let's go!",
      'No, I am not a teacher.',
      'It is twelve o\'clock.',
      'I have three brothers.',
      'She is at home.',
      'It is twenty dollars.'
    ],
    answer: 0,
    explanation: "對方提議「Let's go swimming!（我們去游泳吧！）」，欣然贊同回答「Great idea! Let's go!（好主意！我們走吧！）」，故選 (A)。",
    reviewed: true
  },
  {
    id: 'tme-listen-resp-14',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-resp',
    serialNum: 14,
    taskType: 'L-QA',
    difficulty: 1,
    media: {
      audioText: 'How is the weather outside today, Mom?'
    },
    question: '請聽天氣問句，選出最適當的回應句子：',
    options: [
      'It is rainy and cold. Take your umbrella.',
      'I am ten years old.',
      'She is cooking lunch.',
      'Yes, I can play basketball.',
      'It is on the second floor.',
      'I want two bananas.'
    ],
    answer: 0,
    explanation: '問句詢問「How is the weather outside today?（今天外面天氣如何？）」，回答天氣狀況「It is rainy and cold. Take your umbrella.（下雨又冷，帶上雨傘）」，故選 (A)。',
    reviewed: true
  },
  {
    id: 'tme-listen-resp-15',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-resp',
    serialNum: 15,
    taskType: 'L-QA',
    difficulty: 2,
    media: {
      audioText: 'Excuse me, how much are these three red notebooks?'
    },
    question: '請聽詢問價格問句，選出最適當的回應句子：',
    options: [
      'They are fifty dollars.',
      'They are on the desk.',
      'They are very happy.',
      'Yes, they can.',
      'I like red notebooks.',
      'There are three books.'
    ],
    answer: 0,
    explanation: '問句詢問價格「How much are these three red notebooks?」，應回答金額「They are fifty dollars.（五十元）」，故選 (A)。',
    reviewed: true
  },
  {
    id: 'tme-listen-resp-16',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-resp',
    serialNum: 16,
    taskType: 'L-QA',
    difficulty: 1,
    media: {
      audioText: 'Your new shoes are so cool, Peter!'
    },
    question: '請聽稱讚讚美，選出最適當的回應句子：',
    options: [
      'Thank you! My mother bought them for me.',
      'You are welcome.',
      'I am sorry.',
      'Goodbye, see you tomorrow.',
      'They are pencils.',
      'No, they are not doctors.'
    ],
    answer: 0,
    explanation: '對方讚美新球鞋「Your new shoes are so cool!」，禮貌接受讚美道謝「Thank you! My mother bought them for me.（謝謝！媽媽買給我的）」，故選 (A)。',
    reviewed: true
  },
  {
    id: 'tme-listen-resp-17',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-resp',
    serialNum: 17,
    taskType: 'L-QA',
    difficulty: 1,
    media: {
      audioText: 'Do you like bananas or papayas, Lisa?'
    },
    question: '請聽選擇喜好問句，選出最適當的回應句子：',
    options: [
      'I like bananas. They are sweet.',
      'Yes, I do.',
      'No, I am not.',
      'It is nine o\'clock.',
      'He is my brother.',
      'At the supermarket.'
    ],
    answer: 0,
    explanation: '問句使用 or 提供二選一「Do you like bananas or papayas?」，不可回答 Yes/No，應選特定喜好「I like bananas. They are sweet.」，故選 (A)。',
    reviewed: true
  },
  {
    id: 'tme-listen-resp-18',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-resp',
    serialNum: 18,
    taskType: 'L-QA',
    difficulty: 1,
    media: {
      audioText: 'Please open your English book and turn to page twenty.'
    },
    question: '請聽老師課堂指令，選出學生最適當的回應：',
    options: [
      'Okay, Teacher. Page twenty.',
      'Good night, Mom.',
      'You are welcome.',
      'I like to play piano.',
      'It is three dollars.',
      'No, it isn\'t blue.'
    ],
    answer: 0,
    explanation: '老師課堂指令「Please open your English book and turn to page twenty.」，學生確認執行回答「Okay, Teacher. Page twenty.」，故選 (A)。',
    reviewed: true
  },
  {
    id: 'tme-listen-resp-19',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-resp',
    serialNum: 19,
    taskType: 'L-QA',
    difficulty: 1,
    media: {
      audioText: 'Can I borrow your eraser for a minute, Tom?'
    },
    question: '請聽借用物品請求，選出最適當的回應句子：',
    options: [
      'Sure! Here you are.',
      'I am ten years old.',
      'Yes, I have an eraser.',
      'He is in the library.',
      'It is very big.',
      'No, thank you.'
    ],
    answer: 0,
    explanation: '同學借用橡皮擦「Can I borrow your eraser...?」，樂意出借回答「Sure! Here you are.（當然！拿去吧！）」，故選 (A)。',
    reviewed: true
  },
  {
    id: 'tme-listen-resp-20',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-resp',
    serialNum: 20,
    taskType: 'L-QA',
    difficulty: 1,
    media: {
      audioText: 'What do you usually do on Sunday, Kevin?'
    },
    question: '請聽日常作息問句，選出最適當的回應句子：',
    options: [
      'I usually ride my bicycle with my father.',
      'Today is Sunday.',
      'It is sunny today.',
      'Yes, I like Sunday.',
      'I am in the classroom.',
      'He is nine years old.'
    ],
    answer: 0,
    explanation: '問句詢問「What do you usually do on Sunday?（你週日通常做什麼？）」，回答日常活動「I usually ride my bicycle with my father.（我通常跟爸爸去騎腳踏車）」，故選 (A)。',
    reviewed: true
  },
  {
    id: 'tme-listen-resp-21',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-resp',
    serialNum: 21,
    taskType: 'L-QA',
    difficulty: 2,
    media: {
      audioText: 'Who is that tall man standing next to the tree?'
    },
    question: '請聽人物詢問問句，選出最適當的回應句子：',
    options: [
      'He is our new PE teacher, Mr. Chen.',
      'He is cooking dinner.',
      'It is a big tree.',
      'Yes, he is tall.',
      'He likes apples.',
      'At three thirty.'
    ],
    answer: 0,
    explanation: '問句使用 Who 詢問人物身分「Who is that tall man...?」，回答「He is our new PE teacher, Mr. Chen.（他是我們新來的體育老師陳老師）」，故選 (A)。',
    reviewed: true
  },
  {
    id: 'tme-listen-resp-22',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-resp',
    serialNum: 22,
    taskType: 'L-QA',
    difficulty: 1,
    media: {
      audioText: 'Goodbye, everyone! Have a safe trip home!'
    },
    question: '請聽放學道別祝福，選出最適當的回應句子：',
    options: [
      'Thank you, Teacher! See you tomorrow!',
      'I am sorry.',
      'You are welcome.',
      'It is under the desk.',
      'I want an apple.',
      'Yes, I can.'
    ],
    answer: 0,
    explanation: '放學道別並祝回家路上小心「Have a safe trip home!」，禮貌回應「Thank you, Teacher! See you tomorrow!（謝謝老師！明天見！）」，故選 (A)。',
    reviewed: true
  }
];

// 3. Define the 12 new listen-conv-qa items (11-22)
const newListenQaItems = [
  {
    id: 'tme-listen-qa-11',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-conv-qa',
    serialNum: 11,
    taskType: 'L-CONV',
    difficulty: 2,
    media: {
      audioText: 'Boy: Mom, I am so hungry after basketball practice. Mom: There is some bread and sweet strawberry jam on the table. Boy: Thank you, Mom! Can I also have a glass of milk? Mom: Sure, it is in the refrigerator. Question: What does the boy want to drink?'
    },
    question: '聽對話，回答問題：What does the boy want to drink?',
    options: [
      'Milk',
      'Orange juice',
      'Water',
      'Hot tea',
      'Coffee',
      'Apple juice'
    ],
    answer: 0,
    explanation: '男孩詢問「Can I also have a glass of milk?」，故想喝的飲料為牛奶 (Milk)，選 (A)。',
    reviewed: true
  },
  {
    id: 'tme-listen-qa-12',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-conv-qa',
    serialNum: 12,
    taskType: 'L-CONV',
    difficulty: 2,
    media: {
      audioText: 'Girl: Excuse me, Mr. Wu. Where can I find books about animals? Librarian: They are on shelf number four, next to the window. Girl: Thank you very much! Question: Where are the animal books?'
    },
    question: '聽對話，回答問題：Where are the animal books?',
    options: [
      'On shelf number four',
      "On the teacher's desk",
      'In the computer room',
      'Under the chair',
      'Near the front door',
      'On shelf number one'
    ],
    answer: 0,
    explanation: '圖書館員回答「They are on shelf number four, next to the window.」，在第四號書架上，故選 (A)。',
    reviewed: true
  },
  {
    id: 'tme-listen-qa-13',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-conv-qa',
    serialNum: 13,
    taskType: 'L-CONV',
    difficulty: 1,
    media: {
      audioText: "Dad: It's Saturday morning! Do you want to go to the zoo or the museum, Leo? Leo: The zoo! I really want to see the baby monkeys. Dad: Okay, let's take the bus there right now. Question: Where are Leo and his father going?"
    },
    question: '聽對話，回答問題：Where are Leo and his father going?',
    options: [
      'The zoo',
      'The museum',
      'The hospital',
      'The library',
      'The supermarket',
      'The school'
    ],
    answer: 0,
    explanation: 'Leo 明確回答「The zoo! I really want to see the baby monkeys.」，父子前往動物園，故選 (A)。',
    reviewed: true
  },
  {
    id: 'tme-listen-qa-14',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-conv-qa',
    serialNum: 14,
    taskType: 'L-CONV',
    difficulty: 2,
    media: {
      audioText: "Girl: Oh no! Where is my favorite red pencil? Boy: Look under your chair, Kelly. Girl: No, that's a black pen. Boy: How about inside your English textbook? Girl: Wow, you found it! Thank you! Question: Where was Kelly's red pencil?"
    },
    question: "聽對話，回答問題：Where was Kelly's red pencil?",
    options: [
      'Inside her English textbook',
      'Under her chair',
      'In her backpack',
      "On the teacher's desk",
      'In the trash can',
      'At home on her bed'
    ],
    answer: 0,
    explanation: '男孩提醒「How about inside your English textbook?」女孩驚呼「you found it!」，故鉛筆在英語課本裡，選 (A)。',
    reviewed: true
  },
  {
    id: 'tme-listen-qa-15',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-conv-qa',
    serialNum: 15,
    taskType: 'L-CONV',
    difficulty: 2,
    media: {
      audioText: 'Boy: Is that your mother in the white coat, Amy? Girl: Yes, she works at Wutai Health Center. She helps sick people every day. Boy: Wow, she is a great nurse! Question: What does Amy\'s mother do?'
    },
    question: "聽對話，回答問題：What does Amy's mother do?",
    options: [
      'She is a nurse.',
      'She is a teacher.',
      'She is a bus driver.',
      'She is a cook.',
      'She is a farmer.',
      'She is a police officer.'
    ],
    answer: 0,
    explanation: '對話中最後明確提到「she is a great nurse!（她是一位很棒的護理師）」，故選 (A)。',
    reviewed: true
  },
  {
    id: 'tme-listen-qa-16',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-conv-qa',
    serialNum: 16,
    taskType: 'L-CONV',
    difficulty: 2,
    media: {
      audioText: "Girl: Can you play the recorder, Peter? Boy: No, I can't. But I can play the drums! Girl: That's awesome! I can play the piano. Let's practice together for the school concert! Question: What instrument can Peter play?"
    },
    question: '聽對話，回答問題：What instrument can Peter play?',
    options: [
      'The drums',
      'The piano',
      'The recorder',
      'The guitar',
      'The violin',
      'The flute'
    ],
    answer: 0,
    explanation: "Peter 說明「No, I can't [play the recorder]. But I can play the drums!」，Peter 會打鼓，故選 (A)。",
    reviewed: true
  },
  {
    id: 'tme-listen-qa-17',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-conv-qa',
    serialNum: 17,
    taskType: 'L-CONV',
    difficulty: 1,
    media: {
      audioText: 'Mom: Listen to the radio, Ben. It will rain this afternoon. Ben: But it is sunny right now, Mom! Mom: Yes, but clouds are coming from the mountains. Take your blue raincoat. Ben: Okay, Mom. Question: What will the weather be like this afternoon?'
    },
    question: '聽對話，回答問題：What will the weather be like this afternoon?',
    options: [
      'It will rain.',
      'It will be hot and sunny.',
      'It will snow.',
      'It will be very windy.',
      'It will be foggy.',
      'It will be warm.'
    ],
    answer: 0,
    explanation: '媽媽提醒「Listen to the radio... It will rain this afternoon.」，下午將會下雨，故選 (A)。',
    reviewed: true
  },
  {
    id: 'tme-listen-qa-18',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-conv-qa',
    serialNum: 18,
    taskType: 'L-CONV',
    difficulty: 2,
    media: {
      audioText: "Teacher: Class, tomorrow is Lisa's birthday. Boy: Can we sing a birthday song for her? Teacher: Yes! And Tony bought ten colorful balloons. Girl: I made a big birthday card. Question: How many balloons did Tony buy?"
    },
    question: '聽對話，回答問題：How many balloons did Tony buy?',
    options: [
      'Ten balloons',
      'Two balloons',
      'Twenty balloons',
      'Five balloons',
      'Twelve balloons',
      'Eight balloons'
    ],
    answer: 0,
    explanation: '老師說明「Tony bought ten colorful balloons.（Tony 買了 10 顆彩色氣球）」，故選 (A)。',
    reviewed: true
  },
  {
    id: 'tme-listen-qa-19',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-conv-qa',
    serialNum: 19,
    taskType: 'L-CONV',
    difficulty: 2,
    media: {
      audioText: 'Cafeteria Staff: Hello, Andy! Would you like chicken noodles or beef fried rice today? Andy: I ate noodles yesterday. Can I have beef fried rice, please? Staff: Here you are. Enjoy your lunch! Question: What does Andy have for lunch today?'
    },
    question: '聽對話，回答問題：What does Andy have for lunch today?',
    options: [
      'Beef fried rice',
      'Chicken noodles',
      'A hamburger',
      'Tomato pizza',
      'A vegetable sandwich',
      'Fruit salad'
    ],
    answer: 0,
    explanation: 'Andy 選擇「Can I have beef fried rice, please?」，Andy 今天吃牛肉炒飯，故選 (A)。',
    reviewed: true
  },
  {
    id: 'tme-listen-qa-20',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-conv-qa',
    serialNum: 20,
    taskType: 'L-CONV',
    difficulty: 2,
    media: {
      audioText: 'Girl: Are you ready for Sports Day tomorrow, Kevin? Boy: Yes! I am running the 100-meter race. Girl: Good luck! I am playing in the dodgeball game at two o\'clock. Question: What is Kevin doing on Sports Day?'
    },
    question: '聽對話，回答問題：What is Kevin doing on Sports Day?',
    options: [
      'Running the 100-meter race',
      'Playing dodgeball',
      'Swimming in the pool',
      'Playing basketball',
      'Singing on the stage',
      'Jumping high'
    ],
    answer: 0,
    explanation: 'Kevin 說明「I am running the 100-meter race（我參加一百公尺賽跑）」，故選 (A)。',
    reviewed: true
  },
  {
    id: 'tme-listen-qa-21',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-conv-qa',
    serialNum: 21,
    taskType: 'L-CONV',
    difficulty: 1,
    media: {
      audioText: 'Boy: Excuse me, did you see a small brown puppy near the park gate? Girl: Yes! A cute puppy was playing near the flower bed five minutes ago. Boy: Thank you so much! That is my puppy, Lucky! Question: What color is Lucky the puppy?'
    },
    question: '聽對話，回答問題：What color is Lucky the puppy?',
    options: [
      'Brown',
      'Black',
      'White',
      'Yellow',
      'Grey',
      'Orange'
    ],
    answer: 0,
    explanation: '男孩尋找「a small brown puppy」，小狗是棕色的，故選 (A) Brown。',
    reviewed: true
  },
  {
    id: 'tme-listen-qa-22',
    track: 'tme-preA1',
    category: 'listening',
    subType: 'listen-conv-qa',
    serialNum: 22,
    taskType: 'L-CONV',
    difficulty: 2,
    media: {
      audioText: 'Girl: What time should we meet at the school gate on Saturday morning, Tom? Tom: How about eight o\'clock? Girl: Eight is a bit early. Can we meet at eight thirty? Tom: Sure! Eight thirty is perfect. Question: What time will they meet on Saturday?'
    },
    question: '聽對話，回答問題：What time will they meet on Saturday?',
    options: [
      'At eight thirty',
      'At eight o\'clock',
      'At nine o\'clock',
      'At seven thirty',
      'At ten o\'clock',
      'At eight fifteen'
    ],
    answer: 0,
    explanation: '兩人協商後最終確認「Sure! Eight thirty is perfect.（八點半太完美了）」，約定在 8:30，故選 (A)。',
    reviewed: true
  }
];

const fullListeningBank = [
  ...existingListening,
  ...newListenRespItems,
  ...newListenQaItems
];

console.log(`Total Listening Bank Count: ${fullListeningBank.length} (Existing: ${existingListening.length}, New Resp: ${newListenRespItems.length}, New QA: ${newListenQaItems.length})`);

const outPath = path.resolve('src/data/exam/tmePreA1ListeningBank.js');
const fileContent = `/**
 * Test My English Pre-A1 官方模擬題庫 — 聽力專項題庫模組 (Listening Bank)
 * 涵蓋四大聽力子面向：
 * 1. 看圖選句 (L-SENT / listen-pic2sent) - 7 題
 * 2. 聽對話選圖 (L-DLG / listen-dlg2pic) - 7 題
 * 3. 選正確回應 (L-RESP / listen-resp) - 22 題
 * 4. 聽對話答選擇題 (L-CONV / listen-conv-qa) - 22 題
 * 
 * 總題數：58 題
 * 嚴守國小英語第 1～8 冊課綱詞彙範圍；對話自然生動，貼近真實生活情境。
 */

export const TME_PRE_A1_LISTENING_BANK = ${JSON.stringify(fullListeningBank, null, 2)};
`;

fs.writeFileSync(outPath, fileContent, 'utf8');
console.log('Successfully written to', outPath);
