import fs from 'fs';
import path from 'path';

const bankPath = path.resolve('src/data/exam/tmePreA1Bank.js');
let content = fs.readFileSync(bankPath, 'utf8');

// We have exact replacement definitions for each of the 41 items
const patches = {
  // === 1. vocab-audio2word (6 items) ===
  'tme-vocab-a2w-03': {
    options: ['blue', 'bleu', 'bloo', 'blu', 'blew', 'bolue'],
    answer: 0,
    explanation: '聽力發音為「blue（藍色）」，正確拼字為 b-l-u-e。'
  },
  'tme-vocab-a2w-04': {
    options: ['ruler', 'rular', 'rouler', 'ruller', 'rulor', 'rurle'],
    answer: 0,
    explanation: '聽力發音為「ruler（直尺）」，正確拼字為 r-u-l-e-r。'
  },
  'tme-vocab-a2w-05': {
    options: ['pencil', 'pensil', 'pencel', 'pencle', 'pensle', 'pincil'],
    answer: 0,
    explanation: '聽力發音為「pencil（鉛筆）」，正確拼字為 p-e-n-c-i-l。'
  },
  'tme-vocab-a2w-06': {
    options: ['bread', 'bred', 'braed', 'breed', 'briad', 'brede'],
    answer: 0,
    explanation: '聽力發音為「bread（麵包）」，正確拼字為 b-r-e-a-d。'
  },
  'tme-vocab-a2w-07': {
    options: ['water', 'watar', 'woter', 'watter', 'wator', 'wateur'],
    answer: 0,
    explanation: '聽力發音為「water（水）」，正確拼字為 w-a-t-e-r。'
  },
  'tme-vocab-a2w-08': {
    options: ['chair', 'chare', 'cheir', 'chiar', 'chaer', 'char'],
    answer: 0,
    explanation: '聽力發音為「chair（椅子）」，正確拼字為 c-h-a-i-r。'
  },

  // === 2. listen-pic2sent (5 items) ===
  'tme-listen-p2s-03': {
    options: [
      'The yellow school bus is stopping here.',
      'The children are studying at school.',
      'The boy is riding a blue bicycle.',
      'The white boat is in the water.',
      'The cute dog is sleeping.',
      'The girl is eating a red apple.'
    ],
    answer: 0,
    explanation: '插圖為校車公車，聽力為「The yellow school bus is stopping here.（黃色校車停在這邊）」，故選 (A)。'
  },
  'tme-listen-p2s-04': {
    options: [
      'There are three candles on the birthday cake.',
      'The girl is eating a delicious apple.',
      'The boy is playing with a toy car.',
      'The students are reading in the library.',
      'The dog is running in the park.',
      'The yellow bus is driving fast.'
    ],
    answer: 0,
    explanation: '插圖為生日蛋糕，聽力內容「There are three candles on the birthday cake.（生日蛋糕上有三支蠟燭）」，故選 (A)。'
  },
  'tme-listen-p2s-05': {
    options: [
      'There is a bench under the green tree in the park.',
      'The family is visiting the animals in the zoo.',
      'The children are having lunch at home.',
      'The boy is washing his bicycle.',
      'The cat is sleeping on the sofa.',
      'The students are singing in the classroom.'
    ],
    answer: 0,
    explanation: '插圖為公園與長椅，聽力「There is a bench under the green tree in the park.（公園裡的綠樹下有一張長椅）」，故選 (A)。'
  },
  'tme-listen-p2s-06': {
    options: [
      'The small fish is swimming happily in the water.',
      'The yellow bus is stopping on the road.',
      'The girl is writing with a pencil.',
      'The mother is cooking in the kitchen.',
      'The birds are flying in the sky.',
      'The boy is reading a book under the tree.'
    ],
    answer: 0,
    explanation: '插圖為水裡的小魚，聽力「The small fish is swimming happily in the water.（小魚在水裡開心地游著）」，故選 (A)。'
  },
  'tme-listen-p2s-07': {
    options: [
      'A white sailboat is floating on the blue sea.',
      'The girl is reading books in the library.',
      'The children are eating cake at the party.',
      'The cat is playing with a ball.',
      'The teacher is writing on the blackboard.',
      'The students are running in the gym.'
    ],
    answer: 0,
    explanation: '插圖為帆船小艇，聽力「A white sailboat is floating on the blue sea.（一艘白色帆船漂浮在藍色海面上）」，故選 (A)。'
  },

  // === 3. listen-resp (8 items) ===
  'tme-listen-resp-03': {
    options: [
      'Nice to meet you, too.',
      'It is in your bag.',
      'It is five dollars.',
      'She is my sister.',
      'I can swim.',
      'He is ten years old.'
    ],
    answer: 0,
    explanation: '初次見面問候「Nice to meet you.（很高興認識你）」，標準回應為「Nice to meet you, too.」。'
  },
  'tme-listen-resp-04': {
    options: [
      'It is next to the bookstore.',
      'Yes, I do.',
      'No, it isn\'t.',
      'I am a student.',
      'It is red.',
      'They are fine.'
    ],
    answer: 0,
    explanation: '問句詢問郵局地點（Where is the post office?），應回答具體方位「It is next to the bookstore.（在書店隔壁）」。'
  },
  'tme-listen-resp-05': {
    options: [
      'Yes, please. I am thirsty.',
      'It is blue.',
      'It is my brother\'s.',
      'I have two caps.',
      'It is on the desk.',
      'I like blue caps.'
    ],
    answer: 0,
    explanation: '對方禮貌詢問「Do you want some orange juice?（要喝點柳橙汁嗎？）」，接受時回答「Yes, please. I am thirsty.（好的請給我，我很渴）」。'
  },
  'tme-listen-resp-06': {
    options: [
      'It is Tony\'s jacket.',
      'Yes, I can.',
      'Yes, I am.',
      'No, they don\'t.',
      'I like swimming.',
      'It is five o\'clock.'
    ],
    answer: 0,
    explanation: '問句使用 Whose（誰的）詢問夾克所有權，回答應為所有格「It is Tony\'s jacket.（那是東尼的外套）」。'
  },
  'tme-listen-resp-07': {
    options: [
      'Nice to meet you, too.',
      'He is my brother.',
      'He is at home.',
      'He has a red cap.',
      'Yes, he does.',
      'He is ten.'
    ],
    answer: 0,
    explanation: '初次見面打招呼「Nice to meet you」，標準禮貌回應為「Nice to meet you, too.（我也很高興認識你）」。'
  },
  'tme-listen-resp-08': {
    options: [
      'You are welcome.',
      'I am nine years old.',
      'I\'m in Grade 3.',
      'There are nine pens.',
      'It is nine o\'clock.',
      'I am fine, thanks.'
    ],
    answer: 0,
    explanation: '對方道謝「Thank you...」，客氣回應「You are welcome.（不客氣）」。'
  },
  'tme-listen-resp-09': {
    options: [
      'Goodbye! You, too!',
      'It is a notebook.',
      'It is under the desk.',
      'It is very happy.',
      'They are pencils.',
      'Yes, it is.'
    ],
    answer: 0,
    explanation: '道別祝週末愉快，回答「Goodbye! You, too!（再見！你也是！）」。'
  },
  'tme-listen-resp-10': {
    options: [
      'Sure, no problem!',
      'You\'re welcome.',
      'Good night, Mom.',
      'See you tomorrow.',
      'I am sorry.',
      'Thank you very much.'
    ],
    answer: 0,
    explanation: '請求協助「Can you help me...」，樂意幫忙時回答「Sure, no problem!（當然沒問題！）」。'
  },

  // === 4. listen-conv-qa (8 items) ===
  'tme-listen-qa-03': {
    options: [
      'Sixty dollars',
      'The elephant',
      'The rabbit',
      'The monkey',
      'Sixteen dollars',
      'Six dollars'
    ],
    answer: 0,
    explanation: '店員回答「It is sixty dollars.（60元）」，故選 (A) Sixty dollars。'
  },
  'tme-listen-qa-04': {
    options: [
      'By bicycle',
      'At eight ten',
      'By bus',
      'On foot',
      'By car',
      'By train'
    ],
    answer: 0,
    explanation: 'Andy 回答「I ride my bicycle with Peter」，交通方式為騎腳踏車（By bicycle），故選 (A)。'
  },
  'tme-listen-qa-05': {
    options: [
      'Wednesday',
      'Three',
      'Monday',
      'Friday',
      'Sunday',
      'Thursday'
    ],
    answer: 0,
    explanation: '全班回答「Today is Wednesday!（今天星期三）」，故選 (A) Wednesday。'
  },
  'tme-listen-qa-06': {
    options: [
      'A bus driver',
      'Cooking dinner',
      'A doctor',
      'A teacher',
      'A cook',
      'A police officer'
    ],
    answer: 0,
    explanation: 'Ben 明確說明「No, he is a bus driver.（不，他是一位公車司機）」，故選 (A) A bus driver。'
  },
  'tme-listen-qa-07': {
    options: [
      'A red bicycle',
      'Red',
      'A basketball',
      'A toy robot',
      'A blue notebook',
      'A teddy bear'
    ],
    answer: 0,
    explanation: 'Ben 明確回答「I want a red bicycle」，故選 (A) A red bicycle。'
  },
  'tme-listen-qa-08': {
    options: [
      'In her school bag at home',
      'Under the chair',
      'On the teacher\'s desk',
      'In the locker',
      'In the library',
      'Under her bed'
    ],
    answer: 0,
    explanation: 'Amy 回答作業「in my school bag at home（在家裡的書包中）」，故選 (A)。'
  },
  'tme-listen-qa-09': {
    options: [
      'Hungry',
      'Peter',
      'Thirsty',
      'Tired',
      'Happy',
      'Angry'
    ],
    answer: 0,
    explanation: 'Andy 回答「I am very hungry（我很餓）」，故選 (A) Hungry。'
  },
  'tme-listen-qa-10': {
    options: [
      'Making a chocolate cake',
      'Rainy',
      'Washing the dishes',
      'Drinking milk',
      'Eating breakfast',
      'Reading a book'
    ],
    answer: 0,
    explanation: 'Tom 回答「I am making a chocolate cake for Mom」，故選 (A) Making a chocolate cake。'
  },

  // === 5. read-pic2sent (6 items) ===
  'tme-read-p2s-03': {
    options: [
      'The cute dog is sitting on the floor.',
      'The students are studying in the classroom.',
      'The cat is climbing the tree.',
      'The birds are singing in the sky.',
      'The children are playing basketball.',
      'The teacher is writing on the blackboard.'
    ],
    answer: 0,
    explanation: '插圖為可愛小狗坐在地上，句子 (A) 完全吻合。'
  },
  'tme-read-p2s-04': {
    options: [
      'The little duck is swimming in the water.',
      'There are two birds in the tree.',
      'There is a cat under the chair.',
      'There are four fish in the pond.',
      'There is a monkey climbing the tree.',
      'There are three dogs in the car.'
    ],
    answer: 0,
    explanation: '插圖為水中游水的小鴨，句子 (A) 最相符。'
  },
  'tme-read-p2s-05': {
    options: [
      'The students take the yellow school bus.',
      'The woman is cooking in the kitchen.',
      'The man is sleeping in the bedroom.',
      'The girl is reading in the library.',
      'The boy is washing a bicycle.',
      'The children are swimming in the ocean.'
    ],
    answer: 0,
    explanation: '插圖為大公車/校車，句子 (A)「搭公車上學」完全吻合。'
  },
  'tme-read-p2s-06': {
    options: [
      'There is an open English book on the desk.',
      'The children are having fun at the playground.',
      'The cat is sleeping under the bed.',
      'The woman is driving a car.',
      'The children are eating in the restaurant.',
      'The boy is playing basketball.'
    ],
    answer: 0,
    explanation: '插圖為翻開的書本，句子 (A) 完全相符。'
  },
  'tme-read-p2s-07': {
    options: [
      'There is a birthday cake with candles.',
      'The cute cat is sleeping on the sofa.',
      'The big dog is barking at the door.',
      'The little bird is singing on the fence.',
      'The children are playing on the swing.',
      'The students are studying math.'
    ],
    answer: 0,
    explanation: '插圖為點燃蠟燭的生日蛋糕，句子 (A) 完全吻合。'
  },
  'tme-read-p2s-08': {
    options: [
      'A small sailboat is floating on the water.',
      'The family is having a picnic in the park.',
      'The family is watching television at home.',
      'The girl is shopping in the bookstore.',
      'The students are swimming in the ocean.',
      'The boy is flying a kite.'
    ],
    answer: 0,
    explanation: '插圖為海上的小帆船，句子 (A) 完全吻合。'
  },

  // === 6. read-cloze (8 items) ===
  'tme-read-cloze-03': {
    options: [
      'milk',
      'bread',
      'apple',
      'rice',
      'pizza',
      'egg'
    ],
    answer: 0,
    explanation: '動詞為 drinks（喝），且單位為 a glass of（一杯），空格只能填可飲用的液體 milk（牛奶），故選 (A)。'
  },
  'tme-read-cloze-04': {
    options: [
      'library',
      'kitchen',
      'bedroom',
      'park',
      'zoo',
      'hospital'
    ],
    answer: 0,
    explanation: '找書與閱讀應前往圖書館（library），故選 (A)。'
  },
  'tme-read-cloze-05': {
    options: [
      'umbrella',
      'pencil',
      'notebook',
      'ruler',
      'jacket',
      'eraser'
    ],
    answer: 0,
    explanation: '雨天出門提醒攜帶的應為雨傘（umbrella），冠詞為 an 也符合母音開頭，故選 (A)。'
  },
  'tme-read-cloze-06': {
    options: [
      'lunch',
      'breakfast',
      'dinner',
      'homework',
      'baseball',
      'sleep'
    ],
    answer: 0,
    explanation: '中午十二點（twelve o\'clock）吃的餐點為午餐（lunch），故選 (A)。'
  },
  'tme-read-cloze-07': {
    options: [
      'shirt',
      'pencil',
      'apple',
      'clock',
      'book',
      'desk'
    ],
    answer: 0,
    explanation: '動詞為 puts on（穿上），空格只能填衣物類單字 shirt（襯衫/衣物），故選 (A)。'
  },
  'tme-read-cloze-08': {
    options: [
      'water',
      'bread',
      'cookie',
      'pizza',
      'banana',
      'egg'
    ],
    answer: 0,
    explanation: '口渴（thirsty）且動詞為 drinks（喝），空格填水（water），故選 (A)。'
  },
  'tme-read-cloze-09': {
    options: [
      'elephant',
      'rabbit',
      'monkey',
      'bird',
      'cat',
      'tiger'
    ],
    answer: 0,
    explanation: '有 long trunk（長鼻子）的巨大灰色動物為 elephant（大象），故選 (A)。'
  },
  'tme-read-cloze-10': {
    options: [
      'scissors',
      'pencils',
      'rulers',
      'erasers',
      'crayons',
      'brushes'
    ],
    answer: 0,
    explanation: '美勞課剪紙（cut out the paper）使用的工具為 scissors（剪刀），故選 (A)。'
  }
};

// Now parse the file and patch each item
// We can use RegExp matching each item block:
let patchedCount = 0;

for (const [id, patch] of Object.entries(patches)) {
  // Regex to find object with "id": "id", ... up to closing brace "reviewed": true\s*} or similar
  const idRegex = new RegExp(`(\\{\\s*"id":\\s*"${id}"[\\s\\S]*?\\n  \\})`, 'm');
  const match = content.match(idRegex);
  if (!match) {
    console.error(`ERROR: Could not find block for ${id}`);
    continue;
  }
  
  let block = match[1];
  
  // Replace options: "options": [\n ... \n ]
  const optionsStr = JSON.stringify(patch.options, null, 6).replace(/\[\n\s+/, '[\n      ').replace(/\n\s+\]/, '\n    ]');
  block = block.replace(/"options":\s*\[[\s\S]*?\],/, `"options": ${optionsStr},`);
  
  // Replace answer
  block = block.replace(/"answer":\s*\d+,/, `"answer": ${patch.answer},`);
  
  // Replace explanation
  block = block.replace(/"explanation":\s*"[^"]*",/, `"explanation": "${patch.explanation}",`);
  
  content = content.replace(match[1], block);
  patchedCount++;
}

console.log(`Successfully patched ${patchedCount} of ${Object.keys(patches).length} items.`);
fs.writeFileSync(bankPath, content, 'utf8');
console.log('Saved to', bankPath);
