import fs from 'fs';
import path from 'path';
import { TME_PRE_A1_BANK } from '../src/data/exam/tmePreA1Bank.js';

// 1. Get the 36 existing reading items, ensure reviewed: true
const existingReading = TME_PRE_A1_BANK.filter(q => q.category === 'reading').map(q => ({
  ...q,
  reviewed: true
}));

// 2. Define the 6 new reading passages (4 questions each = 24 items)
const newPassageGroups = [
  {
    groupId: 'tme-read-g01',
    passageTitle: '【在地文化與生活】A Sunny Day in Wutai',
    passageText: `Leo and his sister, Maya, live in Wutai. Today is Sunday, and the weather is sunny and warm.
In the morning, they help their grandfather in the vegetable garden. They pick fresh red tomatoes and green beans.
In the afternoon, they sit outside their stone slab house. Grandfather tells them stories about the mountains while they eat sweet boiled millet cakes.
Leo loves his mountain home very much.

* stone slab house: 石板屋
* boiled millet cake: 水煮小米糕
* fresh: 新鮮的`,
    questions: [
      {
        id: 'tme-read-p01-01',
        serialNum: 1,
        question: 'What is the weather like in Wutai today?',
        options: [
          'It is sunny and warm.',
          'It is cold and rainy.',
          'It is windy and snowy.',
          'It is cloudy and dark.'
        ],
        answer: 0,
        explanation: '文中第一段第二句清楚說明「Today is Sunday, and the weather is sunny and warm.（今天天氣晴朗且溫暖）」，故選 (A)。'
      },
      {
        id: 'tme-read-p01-02',
        serialNum: 2,
        question: 'What do Leo and Maya do in the morning?',
        options: [
          'They help their grandfather in the garden.',
          'They play basketball at school.',
          'They go to the supermarket.',
          'They ride their bicycles in the park.'
        ],
        answer: 0,
        explanation: '文中說明「In the morning, they help their grandfather in the vegetable garden.（早上他們在菜園幫祖父的忙）」，故選 (A)。'
      },
      {
        id: 'tme-read-p01-03',
        serialNum: 3,
        question: 'Where do the children sit in the afternoon?',
        options: [
          'Outside their stone slab house',
          'In the school library',
          'On the yellow school bus',
          'Under the bridge'
        ],
        answer: 0,
        explanation: '文中說明「In the afternoon, they sit outside their stone slab house.（下午他們坐在石板屋外）」，故選 (A)。'
      },
      {
        id: 'tme-read-p01-04',
        serialNum: 4,
        question: 'What do the children eat while listening to Grandfather\'s stories?',
        options: [
          'Sweet boiled millet cakes',
          'Hot hamburgers and French fries',
          'Cold chocolate ice cream',
          'Fresh apples and bananas'
        ],
        answer: 0,
        explanation: '文中說明「while they eat sweet boiled millet cakes（邊吃著甜甜的水煮小米糕）」，故選 (A)。'
      }
    ]
  },
  {
    groupId: 'tme-read-g02',
    passageTitle: '【校園生活與告示】School Lost and Found Notice',
    passageText: `LOST AND FOUND NOTICE
Date: November 6th
Place Found: Near the school gym (體育館)

A student found a blue pencil case on the bench near the gym after the PE class.
Inside the pencil case, there are:
- Three black pencils
- One long yellow ruler
- A small pink eraser shaped like a rabbit

If this is your pencil case, please go to the library and talk to Miss Lin.

* lost and found: 失物招領
* gym: 體育館
* shaped like: 形狀像...`,
    questions: [
      {
        id: 'tme-read-p02-01',
        serialNum: 1,
        question: 'What color is the lost pencil case?',
        options: [
          'Blue',
          'Pink',
          'Yellow',
          'Black'
        ],
        answer: 0,
        explanation: '告示第一段「A student found a blue pencil case...」，鉛筆盒為藍色，故選 (A) Blue。'
      },
      {
        id: 'tme-read-p02-02',
        serialNum: 2,
        question: 'Where was the pencil case found?',
        options: [
          'On the bench near the school gym',
          'In the classroom under the desk',
          'On the table in the cafeteria',
          'In front of the school gate'
        ],
        answer: 0,
        explanation: '告示寫明「on the bench near the gym after the PE class（體育課後在體育館附近的長椅上）」，故選 (A)。'
      },
      {
        id: 'tme-read-p02-03',
        serialNum: 3,
        question: 'What does the pink eraser look like?',
        options: [
          'It is shaped like a rabbit.',
          'It looks like a small car.',
          'It is shaped like an apple.',
          'It looks like a yellow star.'
        ],
        answer: 0,
        explanation: '告示列出「A small pink eraser shaped like a rabbit（一個形狀像小兔子的粉紅色橡皮擦）」，故選 (A)。'
      },
      {
        id: 'tme-read-p02-04',
        serialNum: 4,
        question: 'Where should the owner go to get the pencil case back?',
        options: [
          'The library',
          'The playground',
          'The art classroom',
          'The school office'
        ],
        answer: 0,
        explanation: '文末註明「please go to the library and talk to Miss Lin」，失主應前往圖書館找林老師，故選 (A)。'
      }
    ]
  },
  {
    groupId: 'tme-read-g03',
    passageTitle: '【社交溝通與邀請函】Kevin\'s 10th Birthday Party Invitation',
    passageText: `YOU ARE INVITED!
To: All My Friends
From: Kevin
Event: Kevin's 10th Birthday Party!

When: Saturday, December 12th, from 2:00 PM to 5:00 PM
Where: Kevin's House (No. 8, Green Road, near Central Park)

Fun Activities:
1. Play video games and board games
2. Make your own mini pizza
3. Enjoy chocolate birthday cake and orange juice

Please reply (回覆) to Kevin's mother before December 8th.
We hope to see you there!

* invitation: 邀請函
* event: 活動/盛事
* board game: 桌上遊戲/桌遊
* reply: 回覆`,
    questions: [
      {
        id: 'tme-read-p03-01',
        serialNum: 1,
        question: 'Whose birthday party is it?',
        options: [
          'Kevin\'s birthday party',
          'Kevin\'s mother\'s party',
          'Central Park\'s festival',
          'Miss Lin\'s party'
        ],
        answer: 0,
        explanation: '邀請函開頭標題「Kevin\'s 10th Birthday Party!」，為 Kevin 的 10 歲生日派對，故選 (A)。'
      },
      {
        id: 'tme-read-p03-02',
        serialNum: 2,
        question: 'What time does the birthday party start?',
        options: [
          'At 2:00 PM',
          'At 5:00 PM',
          'At 10:00 AM',
          'At 12:00 PM'
        ],
        answer: 0,
        explanation: '時間欄位明確註明「from 2:00 PM to 5:00 PM」，下午 2 點開始，故選 (A)。'
      },
      {
        id: 'tme-read-p03-03',
        serialNum: 3,
        question: 'What food can the guests make by themselves at the party?',
        options: [
          'Mini pizza',
          'Chocolate cake',
          'Hamburgers',
          'Apple pies'
        ],
        answer: 0,
        explanation: '活動第二項標註「Make your own mini pizza（自己做迷你披薩）」，故選 (A)。'
      },
      {
        id: 'tme-read-p03-04',
        serialNum: 4,
        question: 'When should friends reply to Kevin\'s mother?',
        options: [
          'Before December 8th',
          'On December 12th',
          'After 5:00 PM',
          'On Saturday morning'
        ],
        answer: 0,
        explanation: '文末明確提醒「Please reply to Kevin\'s mother before December 8th（請在 12 月 8 日前向媽媽回覆）」，故選 (A)。'
      }
    ]
  },
  {
    groupId: 'tme-read-g04',
    passageTitle: '【日常生活與寵物】A Day with Cookie the Cat',
    passageText: `Amy has a very cute white cat named Cookie. Cookie is only one year old, but she is very smart and active.
Every morning at six thirty, Cookie walks into Amy's bedroom and licks her hand to wake her up.
After breakfast, Cookie likes to sit on the windowsill and watch the little birds singing in the garden.
In the afternoon, Amy plays with Cookie using a red string. Cookie jumps up and down happily.
At night, Cookie sleeps quietly at the foot of Amy's bed. Amy loves Cookie so much.

* smart: 聰明的
* active: 活潑好動的
* windowsill: 窗台
* red string: 紅色毛線繩`,
    questions: [
      {
        id: 'tme-read-p04-01',
        serialNum: 1,
        question: 'What animal is Cookie?',
        options: [
          'A cute white cat',
          'A big brown dog',
          'A yellow bird',
          'A grey rabbit'
        ],
        answer: 0,
        explanation: '第一句「Amy has a very cute white cat named Cookie」，Cookie 是一隻白貓，故選 (A)。'
      },
      {
        id: 'tme-read-p04-02',
        serialNum: 2,
        question: 'How does Cookie wake Amy up in the morning?',
        options: [
          'She licks Amy\'s hand.',
          'She barks loudly.',
          'She sings a song.',
          'She rings a bell.'
        ],
        answer: 0,
        explanation: '第二段「Cookie walks into Amy\'s bedroom and licks her hand to wake her up」，Cookie 舔 Amy 的手叫醒她，故選 (A)。'
      },
      {
        id: 'tme-read-p04-03',
        serialNum: 3,
        question: 'What does Cookie like to watch from the windowsill?',
        options: [
          'Little birds in the garden',
          'Cars on the road',
          'Children in the park',
          'Fish in the river'
        ],
        answer: 0,
        explanation: '文中說明「watch the little birds singing in the garden（看著花園裡唱歌的小鳥）」，故選 (A)。'
      },
      {
        id: 'tme-read-p04-04',
        serialNum: 4,
        question: 'Where does Cookie sleep at night?',
        options: [
          'At the foot of Amy\'s bed',
          'Inside the kitchen closet',
          'On the living room sofa',
          'Under the dining table'
        ],
        answer: 0,
        explanation: '倒數第二句「Cookie sleeps quietly at the foot of Amy\'s bed（在 Amy 的床尾安靜睡覺）」，故選 (A)。'
      }
    ]
  },
  {
    groupId: 'tme-read-g05',
    passageTitle: '【生活常識與健康】Good Morning Habits for School',
    passageText: `Having healthy morning habits helps students study well at school.
First, go to bed early and wake up at seven o'clock. Do not stay up late playing computer games.
Second, drink a warm cup of water, brush your teeth, and wash your face.
Third, never skip breakfast! A good breakfast can give your body strong energy. You can eat bread, an egg, and drink a glass of fresh milk.
Finally, pack your school bag and check your homework before leaving home.
Start your day happily, and you will have a wonderful day at school!

* habit: 習慣
* energy: 活力/能量
* pack: 整理/收拾
* skip: 略過/不吃`,
    questions: [
      {
        id: 'tme-read-p05-01',
        serialNum: 1,
        question: 'What time does the text suggest students wake up?',
        options: [
          'At seven o\'clock',
          'At eight thirty',
          'At six o\'clock',
          'At nine o\'clock'
        ],
        answer: 0,
        explanation: '文中「First, go to bed early and wake up at seven o\'clock」，建議 7 點起床，故選 (A)。'
      },
      {
        id: 'tme-read-p05-02',
        serialNum: 2,
        question: 'What should students drink right after waking up?',
        options: [
          'A warm cup of water',
          'Cold orange soda',
          'Hot black coffee',
          'Sweet apple juice'
        ],
        answer: 0,
        explanation: '文中「Second, drink a warm cup of water」，喝一杯溫水，故選 (A)。'
      },
      {
        id: 'tme-read-p05-03',
        serialNum: 3,
        question: 'Why is eating breakfast very important for students?',
        options: [
          'It gives the body strong energy.',
          'It makes students sleepy.',
          'It takes a long time to cook.',
          'It is only for weekends.'
        ],
        answer: 0,
        explanation: '文中「A good breakfast can give your body strong energy.（提供身體充沛活力）」，故選 (A)。'
      },
      {
        id: 'tme-read-p05-04',
        serialNum: 4,
        question: 'What should you check before leaving home for school?',
        options: [
          'Pack your school bag and check your homework',
          'Watch a long movie on TV',
          'Play computer games for one hour',
          'Go back to sleep in bed'
        ],
        answer: 0,
        explanation: '第四點說明「pack your school bag and check your homework before leaving home」，故選 (A)。'
      }
    ]
  },
  {
    groupId: 'tme-read-g06',
    passageTitle: '【自然科學與天氣】The Four Seasons in Taiwan',
    passageText: `There are four different seasons in a year: spring, summer, fall, and winter.
In spring, the weather becomes warm. Flowers bloom in the mountains, and green leaves grow on the trees.
In summer, it is sunny and hot. Children like to eat sweet watermelon and go swimming in the cool pool.
In fall, the wind is cool. It is the best season to fly kites and have picnics in the park.
In winter, it gets cold and windy. People wear warm sweaters, coats, and scarves when they go outside.
Which season do you like best?

* season: 季節
* bloom: 開花
* sweater: 毛衣
* scarf / scarves: 圍巾 (複數)`,
    questions: [
      {
        id: 'tme-read-p06-01',
        serialNum: 1,
        question: 'What happens to the trees and flowers in spring?',
        options: [
          'Flowers bloom and green leaves grow.',
          'All leaves turn brown and fall.',
          'Snow covers the tree branches.',
          'Trees stop growing completely.'
        ],
        answer: 0,
        explanation: '文中描述春天「Flowers bloom in the mountains, and green leaves grow on the trees.」，故選 (A)。'
      },
      {
        id: 'tme-read-p06-02',
        serialNum: 2,
        question: 'What do children like to do during the hot summer?',
        options: [
          'Eat sweet watermelon and go swimming',
          'Make a big snowman outside',
          'Wear thick heavy coats',
          'Sit near the fireplace'
        ],
        answer: 0,
        explanation: '夏天段落說明「Children like to eat sweet watermelon and go swimming in the cool pool.」，故選 (A)。'
      },
      {
        id: 'tme-read-p06-03',
        serialNum: 3,
        question: 'According to the text, what is a great outdoor activity for fall?',
        options: [
          'Flying kites and having picnics',
          'Swimming in the ocean',
          'Wearing a swimming suit',
          'Staying in bed all day'
        ],
        answer: 0,
        explanation: '秋天段落「It is the best season to fly kites and have picnics in the park.」，放風箏與野餐，故選 (A)。'
      },
      {
        id: 'tme-read-p06-04',
        serialNum: 4,
        question: 'What do people wear when it is cold in winter?',
        options: [
          'Warm sweaters, coats, and scarves',
          'T-shirts and short pants',
          'Light summer dresses',
          'Swimwear and sunglasses'
        ],
        answer: 0,
        explanation: '冬天段落「People wear warm sweaters, coats, and scarves when they go outside.」，穿著毛衣、外套與圍巾，故選 (A)。'
      }
    ]
  }
];

// Transform passage groups into individual question objects
const newPassageItems = [];
newPassageGroups.forEach(group => {
  group.questions.forEach((q, idx) => {
    newPassageItems.push({
      id: q.id,
      track: 'tme-preA1',
      category: 'reading',
      subType: 'read-passage',
      serialNum: q.serialNum,
      taskType: 'R-COMP',
      difficulty: 1,
      groupId: group.groupId,
      passage: {
        title: group.passageTitle,
        text: group.passageText
      },
      question: q.question,
      options: q.options,
      answer: q.answer,
      explanation: q.explanation,
      reviewed: true
    });
  });
});

// 3. Define the 8 new contextual cloze items (tme-read-cloze-11 to 18)
const newClozeItems = [
  {
    id: 'tme-read-cloze-11',
    track: 'tme-preA1',
    category: 'reading',
    subType: 'read-cloze',
    serialNum: 11,
    taskType: 'R-CLOZE',
    difficulty: 1,
    passage: {
      title: '【短文填空】Weekend at Grandma\'s House',
      text: `On Saturday, Peter visits his grandma in the countryside. Grandma has a small pond behind her house. There are five yellow _______ swimming in the clean water.

* countryside: 鄉村/鄉下`
    },
    question: '依短文文意，空格處應填入哪一個單字？',
    options: ['ducks', 'desks', 'books', 'pens', 'clocks', 'cars'],
    answer: 0,
    explanation: '在水池中（pond）游泳的水生動物為黃色小鴨（ducks），故選 (A) ducks。',
    reviewed: true
  },
  {
    id: 'tme-read-cloze-12',
    track: 'tme-preA1',
    category: 'reading',
    subType: 'read-cloze',
    serialNum: 12,
    taskType: 'R-CLOZE',
    difficulty: 1,
    passage: {
      title: '【生活短文填空】Making Fresh Fruit Salad',
      text: `Mom is making fruit salad for lunch. She cuts some sweet apples, red strawberries, and yellow _______. It smells very delicious!

* fruit salad: 水果沙拉
* strawberry: 草莓`
    },
    question: '依短文文意，空格處應填入哪一個單字？',
    options: ['bananas', 'shoes', 'chairs', 'bicycles', 'notebooks', 'rulers'],
    answer: 0,
    explanation: '製作水果沙拉（fruit salad），空格需填黃色水果（yellow bananas），故選 (A) bananas。',
    reviewed: true
  },
  {
    id: 'tme-read-cloze-13',
    track: 'tme-preA1',
    category: 'reading',
    subType: 'read-cloze',
    serialNum: 13,
    taskType: 'R-CLOZE',
    difficulty: 1,
    passage: {
      title: '【生活短文填空】Music Class Performance',
      text: `Today is Friday. The children have music class in the afternoon. Kelly sits straight and plays the _______ happily for the teacher.

* performance: 表演
* straight: 筆直地/端正地`
    },
    question: '依短文文意，空格處應填入哪一個單字？',
    options: ['piano', 'pencil', 'pizza', 'park', 'plane', 'paper'],
    answer: 0,
    explanation: '音樂課（music class）演奏的樂器為鋼琴（play the piano），故選 (A) piano。',
    reviewed: true
  },
  {
    id: 'tme-read-cloze-14',
    track: 'tme-preA1',
    category: 'reading',
    subType: 'read-cloze',
    serialNum: 14,
    taskType: 'R-CLOZE',
    difficulty: 1,
    passage: {
      title: '【生活短文填空】Sunny Day Sport',
      text: `The sun is shining brightly today. Andy and his friends take a ball to the court after school. They love to play _______ together.

* court: 球場
* brightly: 明亮地`
    },
    question: '依短文文意，空格處應填入哪一個單字？',
    options: ['basketball', 'breakfast', 'bedroom', 'bookstore', 'bathroom', 'bottle'],
    answer: 0,
    explanation: '放學後在球場（court）玩的球類運動為籃球（play basketball），故選 (A) basketball。',
    reviewed: true
  },
  {
    id: 'tme-read-cloze-15',
    track: 'tme-preA1',
    category: 'reading',
    subType: 'read-cloze',
    serialNum: 15,
    taskType: 'R-CLOZE',
    difficulty: 1,
    passage: {
      title: '【生活短文填空】Bedtime Reminder',
      text: `It is already nine thirty at night. Dad knocks on Tom's door and says, "Tom, it is time to brush your _______ and go to sleep."

* bedtime: 就寢時間
* knock: 敲門`
    },
    question: '依短文文意，空格處應填入哪一個單字？',
    options: ['teeth', 'shoes', 'bags', 'books', 'desks', 'chairs'],
    answer: 0,
    explanation: '睡前衛生的固定片語為刷牙（brush your teeth），故選 (A) teeth。',
    reviewed: true
  },
  {
    id: 'tme-read-cloze-16',
    track: 'tme-preA1',
    category: 'reading',
    subType: 'read-cloze',
    serialNum: 16,
    taskType: 'R-CLOZE',
    difficulty: 1,
    passage: {
      title: '【生活短文填空】Visiting the Town Hospital',
      text: `David has a fever and a bad cough today. His mother takes him to the town _______ to see a friendly doctor.

* fever: 發燒
* cough: 咳嗽`
    },
    question: '依短文文意，空格處應填入哪一個單字？',
    options: ['hospital', 'playground', 'supermarket', 'bookstore', 'bakery', 'zoo'],
    answer: 0,
    explanation: '生病看醫生（see a doctor）應前往醫院（hospital），故選 (A) hospital。',
    reviewed: true
  },
  {
    id: 'tme-read-cloze-17',
    track: 'tme-preA1',
    category: 'reading',
    subType: 'read-cloze',
    serialNum: 17,
    taskType: 'R-CLOZE',
    difficulty: 1,
    passage: {
      title: '【生活短文填空】Rainy Walk Home',
      text: `Dark clouds fill the sky, and heavy rain starts to fall. Luckily, Jenny has a yellow _______ in her backpack, so she does not get wet.

* luckily: 幸好/幸運地
* get wet: 淋濕`
    },
    question: '依短文文意，空格處應填入哪一個單字？',
    options: ['umbrella', 'pencil', 'clock', 'ruler', 'eraser', 'marker'],
    answer: 0,
    explanation: '下大雨防止淋濕的隨身雨具為雨傘（umbrella），故選 (A) umbrella。',
    reviewed: true
  },
  {
    id: 'tme-read-cloze-18',
    track: 'tme-preA1',
    category: 'reading',
    subType: 'read-cloze',
    serialNum: 18,
    taskType: 'R-CLOZE',
    difficulty: 1,
    passage: {
      title: '【在地生活填空】Wutai Mountain Trail',
      text: `Grandpa takes Sam for a morning walk along the green mountain trail. They look up and see a big black _______ flying high in the blue sky.

* trail: 步道/小徑
* along: 沿著`
    },
    question: '依短文文意，空格處應填入哪一個單字？',
    options: ['bird', 'fish', 'dog', 'pig', 'rabbit', 'cat'],
    answer: 0,
    explanation: '在藍天中高高飛翔的動物為鳥類（bird flying high in the sky），故選 (A) bird。',
    reviewed: true
  }
];

const fullReadingBank = [
  ...existingReading,
  ...newPassageItems,
  ...newClozeItems
];

console.log(`Total Reading Bank Count: ${fullReadingBank.length} (Existing: ${existingReading.length}, New Passages: ${newPassageItems.length}, New Cloze: ${newClozeItems.length})`);

const outPath = path.resolve('src/data/exam/tmePreA1ReadingBank.js');
const fileContent = `/**
 * Test My English Pre-A1 官方模擬題庫 — 閱讀專項題庫模組 (Reading Bank)
 * 涵蓋四大閱讀子面向：
 * 1. 看圖選字 (V-PIC / read-pic2word) - 8 題
 * 2. 看圖選句 (G-CTX / read-pic2sent) - 8 題
 * 3. 是非判斷 (R-TF / read-truefalse) - 10 題
 * 4. 短文填空 (R-CLOZE / read-cloze) - 18 題
 * 5. 篇章閱讀理解題組 (R-COMP / read-passage) - 6 大生活篇章 (24 題)
 * 
 * 總題數：68 題
 * 嚴守國小英語第 1～8 冊課綱詞彙範圍；文中所涉在地文化或生活情境非核心單字，均於文末以星號 (*) 附註中文註解。
 */

export const TME_PRE_A1_READING_BANK = ${JSON.stringify(fullReadingBank, null, 2)};
`;

fs.writeFileSync(outPath, fileContent, 'utf8');
console.log('Successfully written to', outPath);
