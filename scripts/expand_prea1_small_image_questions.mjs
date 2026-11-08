import fs from 'fs';
import path from 'path';

// 1. Definition of 28 new items for tmePreA1Bank.js
const NEW_VOCAB_WORD2PIC = [
  {
    id: "tme-vocab-w2p-09",
    track: "tme-preA1",
    category: "vocab",
    subType: "vocab-word2pic",
    serialNum: 9,
    taskType: "V-PIC",
    difficulty: 1,
    question: "看單字選出相符的物品線稿插圖：teeth",
    options: ["圖片 (A)", "圖片 (B)", "圖片 (C)", "圖片 (D)", "圖片 (E)", "圖片 (F)", "圖片 (G)"],
    optionImages: [
      "/assets/exam/preA1/teeth.png",
      "/assets/exam/preA1/eye.png",
      "/assets/exam/preA1/nose.png",
      "/assets/exam/preA1/mouth.png",
      "/assets/exam/preA1/ear.png",
      "/assets/exam/preA1/head.png",
      "/assets/exam/preA1/hand.png"
    ],
    answer: 0,
    explanation: "英文「teeth」意為牙齒（tooth 的複數），對應整齊牙齒線稿插圖。",
    reviewed: true
  },
  {
    id: "tme-vocab-w2p-10",
    track: "tme-preA1",
    category: "vocab",
    subType: "vocab-word2pic",
    serialNum: 10,
    taskType: "V-PIC",
    difficulty: 1,
    question: "看單字選出相符的物品線稿插圖：rainbow",
    options: ["圖片 (A)", "圖片 (B)", "圖片 (C)", "圖片 (D)", "圖片 (E)", "圖片 (F)", "圖片 (G)"],
    optionImages: [
      "/assets/exam/preA1/rainbow.png",
      "/assets/exam/preA1/sun.png",
      "/assets/exam/preA1/moon.png",
      "/assets/exam/preA1/star.png",
      "/assets/exam/preA1/cloud.png",
      "/assets/exam/preA1/rain.png",
      "/assets/exam/preA1/snowman.png"
    ],
    answer: 0,
    explanation: "英文「rainbow」意為彩虹，對應天邊七色彩虹線稿插圖。",
    reviewed: true
  },
  {
    id: "tme-vocab-w2p-11",
    track: "tme-preA1",
    category: "vocab",
    subType: "vocab-word2pic",
    serialNum: 11,
    taskType: "V-PIC",
    difficulty: 1,
    question: "看單字選出相符的物品線稿插圖：spider",
    options: ["圖片 (A)", "圖片 (B)", "圖片 (C)", "圖片 (D)", "圖片 (E)", "圖片 (F)", "圖片 (G)"],
    optionImages: [
      "/assets/exam/preA1/spider.png",
      "/assets/exam/preA1/bat.png",
      "/assets/exam/preA1/mouse.png",
      "/assets/exam/preA1/frog.png",
      "/assets/exam/preA1/bird.png",
      "/assets/exam/preA1/fish.png",
      "/assets/exam/preA1/snake.png"
    ],
    answer: 0,
    explanation: "英文「spider」意為蜘蛛，對應八隻腳蜘蛛線稿插圖。",
    reviewed: true
  },
  {
    id: "tme-vocab-w2p-12",
    track: "tme-preA1",
    category: "vocab",
    subType: "vocab-word2pic",
    serialNum: 12,
    taskType: "V-PIC",
    difficulty: 1,
    question: "看單字選出相符的物品線稿插圖：chocolate",
    options: ["圖片 (A)", "圖片 (B)", "圖片 (C)", "圖片 (D)", "圖片 (E)", "圖片 (F)", "圖片 (G)"],
    optionImages: [
      "/assets/exam/preA1/chocolate.png",
      "/assets/exam/preA1/candy.png",
      "/assets/exam/preA1/cake.png",
      "/assets/exam/preA1/cookie.png",
      "/assets/exam/preA1/ice_cream.png",
      "/assets/exam/preA1/bread.png",
      "/assets/exam/preA1/pizza.png"
    ],
    answer: 0,
    explanation: "英文「chocolate」意為巧克力，對應排裝甜點巧克力線稿插圖。",
    reviewed: true
  },
  {
    id: "tme-vocab-w2p-13",
    track: "tme-preA1",
    category: "vocab",
    subType: "vocab-word2pic",
    serialNum: 13,
    taskType: "V-PIC",
    difficulty: 1,
    question: "看單字選出相符的物品線稿插圖：hospital",
    options: ["圖片 (A)", "圖片 (B)", "圖片 (C)", "圖片 (D)", "圖片 (E)", "圖片 (F)", "圖片 (G)"],
    optionImages: [
      "/assets/exam/preA1/hospital.png",
      "/assets/exam/preA1/school.png",
      "/assets/exam/preA1/library.png",
      "/assets/exam/preA1/park.png",
      "/assets/exam/preA1/zoo.png",
      "/assets/exam/preA1/bookstore.png",
      "/assets/exam/preA1/cinema.png"
    ],
    answer: 0,
    explanation: "英文「hospital」意為醫院，對應十字標誌醫院建築線稿插圖。",
    reviewed: true
  },
  {
    id: "tme-vocab-w2p-14",
    track: "tme-preA1",
    category: "vocab",
    subType: "vocab-word2pic",
    serialNum: 14,
    taskType: "V-PIC",
    difficulty: 1,
    question: "看單字選出相符的物品線稿插圖：snowman",
    options: ["圖片 (A)", "圖片 (B)", "圖片 (C)", "圖片 (D)", "圖片 (E)", "圖片 (F)", "圖片 (G)"],
    optionImages: [
      "/assets/exam/preA1/snowman.png",
      "/assets/exam/preA1/tree.png",
      "/assets/exam/preA1/flower.png",
      "/assets/exam/preA1/river.png",
      "/assets/exam/preA1/mountain.png",
      "/assets/exam/preA1/beach.png",
      "/assets/exam/preA1/sea.png"
    ],
    answer: 0,
    explanation: "英文「snowman」意為雪人，對應圍圍巾戴帽子的雪人線稿插圖。",
    reviewed: true
  }
];

const NEW_VOCAB_PIC2WORD = [
  {
    id: "tme-vocab-p2w-09",
    track: "tme-preA1",
    category: "vocab",
    subType: "vocab-pic2word",
    serialNum: 9,
    taskType: "V-MEAN",
    difficulty: 1,
    question: "看題目線稿插圖，選出正確的英文單字：",
    image: "/assets/exam/preA1/hippo.png",
    options: ["hippo", "elephant", "tiger", "lion", "bear", "monkey", "giraffe"],
    answer: 0,
    explanation: "插圖中為大耳朵圓肚子的河馬線稿，英文為「hippo」。",
    reviewed: true
  },
  {
    id: "tme-vocab-p2w-10",
    track: "tme-preA1",
    category: "vocab",
    subType: "vocab-pic2word",
    serialNum: 10,
    taskType: "V-MEAN",
    difficulty: 1,
    question: "看題目線稿插圖，選出正確的英文單字：",
    image: "/assets/exam/preA1/candy.png",
    options: ["candy", "chocolate", "cookie", "cake", "bread", "apple", "pizza"],
    answer: 0,
    explanation: "插圖中為兩端扭褶糖果紙包裝的糖果線稿，英文為「candy」。",
    reviewed: true
  },
  {
    id: "tme-vocab-p2w-11",
    track: "tme-preA1",
    category: "vocab",
    subType: "vocab-pic2word",
    serialNum: 11,
    taskType: "V-MEAN",
    difficulty: 1,
    question: "看題目線稿插圖，選出正確的英文單字：",
    image: "/assets/exam/preA1/nurse.png",
    options: ["nurse", "doctor", "teacher", "student", "farmer", "cook", "police officer"],
    answer: 0,
    explanation: "插圖中為戴護士帽的醫護人員線稿，英文為「nurse」。",
    reviewed: true
  },
  {
    id: "tme-vocab-p2w-12",
    track: "tme-preA1",
    category: "vocab",
    subType: "vocab-pic2word",
    serialNum: 12,
    taskType: "V-MEAN",
    difficulty: 1,
    question: "看題目線稿插圖，選出正確的英文單字：",
    image: "/assets/exam/preA1/piano.png",
    options: ["piano", "guitar", "bell", "drum", "robot", "clock", "box"],
    answer: 0,
    explanation: "插圖中為黑白琴鍵的平台鋼琴線稿，英文為「piano」。",
    reviewed: true
  },
  {
    id: "tme-vocab-p2w-13",
    track: "tme-preA1",
    category: "vocab",
    subType: "vocab-pic2word",
    serialNum: 13,
    taskType: "V-MEAN",
    difficulty: 1,
    question: "看題目線稿插圖，選出正確的英文單字：",
    image: "/assets/exam/preA1/potato.png",
    options: ["potato", "tomato", "carrot", "apple", "banana", "orange", "egg"],
    answer: 0,
    explanation: "插圖中為帶有芽眼特徵的馬鈴薯線稿，英文為「potato」。",
    reviewed: true
  },
  {
    id: "tme-vocab-p2w-14",
    track: "tme-preA1",
    category: "vocab",
    subType: "vocab-pic2word",
    serialNum: 14,
    taskType: "V-MEAN",
    difficulty: 1,
    question: "看題目線稿插圖，選出正確的英文單字：",
    image: "/assets/exam/preA1/bat.png",
    options: ["bat", "bird", "spider", "mouse", "duck", "pig", "frog"],
    answer: 0,
    explanation: "插圖中為張開雙翼的蝙蝠線稿，英文為「bat」。",
    reviewed: true
  }
];

const NEW_VOCAB_AUDIO2PIC = [
  {
    id: "tme-vocab-a2p-09",
    track: "tme-preA1",
    category: "vocab",
    subType: "vocab-audio2pic",
    serialNum: 9,
    taskType: "L-PIC",
    difficulty: 1,
    media: { audioText: "river" },
    question: "請聽語音，選出相符的物品線稿插圖：",
    options: ["圖片 (A)", "圖片 (B)", "圖片 (C)", "圖片 (D)", "圖片 (E)", "圖片 (F)", "圖片 (G)"],
    optionImages: [
      "/assets/exam/preA1/river.png",
      "/assets/exam/preA1/sea.png",
      "/assets/exam/preA1/mountain.png",
      "/assets/exam/preA1/beach.png",
      "/assets/exam/preA1/park.png",
      "/assets/exam/preA1/tree.png",
      "/assets/exam/preA1/cloud.png"
    ],
    answer: 0,
    explanation: "聽力發音為「river（河流）」，故選波光蜿蜒的河流線稿插圖。",
    reviewed: true
  },
  {
    id: "tme-vocab-a2p-10",
    track: "tme-preA1",
    category: "vocab",
    subType: "vocab-audio2pic",
    serialNum: 10,
    taskType: "L-PIC",
    difficulty: 1,
    media: { audioText: "chicken" },
    question: "請聽語音，選出相符的物品線稿插圖：",
    options: ["圖片 (A)", "圖片 (B)", "圖片 (C)", "圖片 (D)", "圖片 (E)", "圖片 (F)", "圖片 (G)"],
    optionImages: [
      "/assets/exam/preA1/chicken.png",
      "/assets/exam/preA1/duck.png",
      "/assets/exam/preA1/bird.png",
      "/assets/exam/preA1/pig.png",
      "/assets/exam/preA1/dog.png",
      "/assets/exam/preA1/cat.png",
      "/assets/exam/preA1/sheep.png"
    ],
    answer: 0,
    explanation: "聽力發音為「chicken（小雞/母雞）」，故選母雞線稿插圖。",
    reviewed: true
  },
  {
    id: "tme-vocab-a2p-11",
    track: "tme-preA1",
    category: "vocab",
    subType: "vocab-audio2pic",
    serialNum: 11,
    taskType: "L-PIC",
    difficulty: 1,
    media: { audioText: "smile" },
    question: "請聽語音，選出相符的物品線稿插圖：",
    options: ["圖片 (A)", "圖片 (B)", "圖片 (C)", "圖片 (D)", "圖片 (E)", "圖片 (F)", "圖片 (G)"],
    optionImages: [
      "/assets/exam/preA1/smile.png",
      "/assets/exam/preA1/face.png",
      "/assets/exam/preA1/head.png",
      "/assets/exam/preA1/eye.png",
      "/assets/exam/preA1/nose.png",
      "/assets/exam/preA1/mouth.png",
      "/assets/exam/preA1/ear.png"
    ],
    answer: 0,
    explanation: "聽力發音為「smile（微笑）」，故選燦爛微笑表情線稿插圖。",
    reviewed: true
  },
  {
    id: "tme-vocab-a2p-12",
    track: "tme-preA1",
    category: "vocab",
    subType: "vocab-audio2pic",
    serialNum: 12,
    taskType: "L-PIC",
    difficulty: 1,
    media: { audioText: "marker" },
    question: "請聽語音，選出相符的物品線稿插圖：",
    options: ["圖片 (A)", "圖片 (B)", "圖片 (C)", "圖片 (D)", "圖片 (E)", "圖片 (F)", "圖片 (G)"],
    optionImages: [
      "/assets/exam/preA1/marker.png",
      "/assets/exam/preA1/pencil.png",
      "/assets/exam/preA1/pen.png",
      "/assets/exam/preA1/ruler.png",
      "/assets/exam/preA1/eraser.png",
      "/assets/exam/preA1/scissors.png",
      "/assets/exam/preA1/notebook.png"
    ],
    answer: 0,
    explanation: "聽力發音為「marker（彩色筆/麥克筆）」，故選麥克筆線稿插圖。",
    reviewed: true
  },
  {
    id: "tme-vocab-a2p-13",
    track: "tme-preA1",
    category: "vocab",
    subType: "vocab-audio2pic",
    serialNum: 13,
    taskType: "L-PIC",
    difficulty: 1,
    media: { audioText: "sea" },
    question: "請聽語音，選出相符的物品線稿插圖：",
    options: ["圖片 (A)", "圖片 (B)", "圖片 (C)", "圖片 (D)", "圖片 (E)", "圖片 (F)", "圖片 (G)"],
    optionImages: [
      "/assets/exam/preA1/sea.png",
      "/assets/exam/preA1/river.png",
      "/assets/exam/preA1/beach.png",
      "/assets/exam/preA1/rain.png",
      "/assets/exam/preA1/rainbow.png",
      "/assets/exam/preA1/sun.png",
      "/assets/exam/preA1/boat.png"
    ],
    answer: 0,
    explanation: "聽力發音為「sea（大海）」，故選壯闊海浪與海平面線稿插圖。",
    reviewed: true
  },
  {
    id: "tme-vocab-a2p-14",
    track: "tme-preA1",
    category: "vocab",
    subType: "vocab-audio2pic",
    serialNum: 14,
    taskType: "L-PIC",
    difficulty: 1,
    media: { audioText: "exit sign" },
    question: "請聽語音，選出相符的物品線稿插圖：",
    options: ["圖片 (A)", "圖片 (B)", "圖片 (C)", "圖片 (D)", "圖片 (E)", "圖片 (F)", "圖片 (G)"],
    optionImages: [
      "/assets/exam/preA1/exit_sign.png",
      "/assets/exam/preA1/door.png",
      "/assets/exam/preA1/window.png",
      "/assets/exam/preA1/school.png",
      "/assets/exam/preA1/hospital.png",
      "/assets/exam/preA1/blackboard.png",
      "/assets/exam/preA1/clock.png"
    ],
    answer: 0,
    explanation: "聽力發音為「exit sign（安全出口標誌）」，故選奔跑小人與 EXIT 標誌線稿插圖。",
    reviewed: true
  }
];

const NEW_LISTEN_PIC2SENT = [
  {
    id: "tme-listen-p2s-08",
    track: "tme-preA1",
    category: "listening",
    subType: "listen-pic2sent",
    serialNum: 8,
    taskType: "L-SENT",
    difficulty: 1,
    image: "/assets/exam/preA1/action_brush_teeth.png",
    media: { audioText: "The boy is brushing his teeth in the morning." },
    question: "看情境線稿插圖並聽語音，選出描述正確的句子：",
    options: [
      "The boy is brushing his teeth.",
      "The boy is washing his face.",
      "The boy is eating breakfast.",
      "The boy is drinking water.",
      "The boy is sleeping in bed.",
      "The boy is reading a book."
    ],
    answer: 0,
    explanation: "插圖為男孩拿牙刷刷牙，聽力內容「The boy is brushing his teeth.（男孩正在刷牙）」，故選 (A)。",
    reviewed: true
  },
  {
    id: "tme-listen-p2s-09",
    track: "tme-preA1",
    category: "listening",
    subType: "listen-pic2sent",
    serialNum: 9,
    taskType: "L-SENT",
    difficulty: 1,
    image: "/assets/exam/preA1/action_play_basketball.png",
    media: { audioText: "The students are playing basketball after school." },
    question: "看情境線稿插圖並聽語音，選出描述正確的句子：",
    options: [
      "The students are playing basketball.",
      "The students are playing soccer.",
      "The students are riding bicycles.",
      "The students are swimming in the pool.",
      "The students are running in the park.",
      "The students are dancing in the gym."
    ],
    answer: 0,
    explanation: "插圖中為投籃打籃球動作，聽力為「The students are playing basketball.（學生正在打籃球）」，故選 (A)。",
    reviewed: true
  },
  {
    id: "tme-listen-p2s-10",
    track: "tme-preA1",
    category: "listening",
    subType: "listen-pic2sent",
    serialNum: 10,
    taskType: "L-SENT",
    difficulty: 1,
    image: "/assets/exam/preA1/action_swim.png",
    media: { audioText: "The girl is swimming like a little fish." },
    question: "看情境線稿插圖並聽語音，選出描述正確的句子：",
    options: [
      "The girl is swimming.",
      "The girl is riding a boat.",
      "The girl is washing her hands.",
      "The girl is drinking milk.",
      "The girl is flying a kite.",
      "The girl is singing a song."
    ],
    answer: 0,
    explanation: "插圖中為女孩游泳踢水情境，聽力為「The girl is swimming.（女孩正在游泳）」，故選 (A)。",
    reviewed: true
  },
  {
    id: "tme-listen-p2s-11",
    track: "tme-preA1",
    category: "listening",
    subType: "listen-pic2sent",
    serialNum: 11,
    taskType: "L-SENT",
    difficulty: 1,
    image: "/assets/exam/preA1/action_read_book.png",
    media: { audioText: "The girl is reading a book in the living room." },
    question: "看情境線稿插圖並聽語音，選出描述正確的句子：",
    options: [
      "The girl is reading a book.",
      "The girl is writing a letter.",
      "The girl is drawing a picture.",
      "The girl is playing the piano.",
      "The girl is cooking in the kitchen.",
      "The girl is climbing a tree."
    ],
    answer: 0,
    explanation: "插圖中為安靜閱讀課本書本情境，聽力為「The girl is reading a book.（女孩正在看書）」，故選 (A)。",
    reviewed: true
  },
  {
    id: "tme-listen-p2s-12",
    track: "tme-preA1",
    category: "listening",
    subType: "listen-pic2sent",
    serialNum: 12,
    taskType: "L-SENT",
    difficulty: 1,
    image: "/assets/exam/preA1/action_sing_song.png",
    media: { audioText: "The boy is singing a song with a microphone." },
    question: "看情境線稿插圖並聽語音，選出描述正確的句子：",
    options: [
      "The boy is singing a song.",
      "The boy is listening to music.",
      "The boy is playing guitar.",
      "The boy is talking on the telephone.",
      "The boy is watching television.",
      "The boy is eating an apple."
    ],
    answer: 0,
    explanation: "插圖中為拿麥克風大聲唱歌情境，聽力為「The boy is singing a song.（男孩正在唱歌）」，故選 (A)。",
    reviewed: true
  }
];

const NEW_LISTEN_DLG2PIC = [
  {
    id: "tme-listen-d2p-08",
    track: "tme-preA1",
    category: "listening",
    subType: "listen-dlg2pic",
    serialNum: 8,
    taskType: "L-CONV",
    difficulty: 2,
    media: { audioText: "Boy: Look up at the sky! Girl: Wow, it is a colorful rainbow after the rain!" },
    question: "聽對話，選出對話中提及之自然景觀線稿插圖：",
    options: ["圖片 (A)", "圖片 (B)", "圖片 (C)", "圖片 (D)", "圖片 (E)", "圖片 (F)"],
    optionImages: [
      "/assets/exam/preA1/rainbow.png",
      "/assets/exam/preA1/sun.png",
      "/assets/exam/preA1/moon.png",
      "/assets/exam/preA1/star.png",
      "/assets/exam/preA1/rain.png",
      "/assets/exam/preA1/cloud.png"
    ],
    answer: 0,
    explanation: "對話中提到「a colorful rainbow after the rain」，故選彩虹 (A)。",
    reviewed: true
  },
  {
    id: "tme-listen-d2p-09",
    track: "tme-preA1",
    category: "listening",
    subType: "listen-dlg2pic",
    serialNum: 9,
    taskType: "L-CONV",
    difficulty: 2,
    media: { audioText: "Girl: Dad, my tooth hurts. Boy: Let us go to the hospital to see a doctor." },
    question: "聽對話，選出爸爸提議前往之地點線稿插圖：",
    options: ["圖片 (A)", "圖片 (B)", "圖片 (C)", "圖片 (D)", "圖片 (E)", "圖片 (F)"],
    optionImages: [
      "/assets/exam/preA1/hospital.png",
      "/assets/exam/preA1/school.png",
      "/assets/exam/preA1/library.png",
      "/assets/exam/preA1/park.png",
      "/assets/exam/preA1/bookstore.png",
      "/assets/exam/preA1/supermarket.png"
    ],
    answer: 0,
    explanation: "對話中提到「Let us go to the hospital」，故前往地點為醫院 (A)。",
    reviewed: true
  },
  {
    id: "tme-listen-d2p-10",
    track: "tme-preA1",
    category: "listening",
    subType: "listen-dlg2pic",
    serialNum: 10,
    taskType: "L-CONV",
    difficulty: 2,
    media: { audioText: "Boy: What do you want to eat for lunch? Girl: I want some hot chicken noodles." },
    question: "聽對話，選出女孩午餐想要吃的主食線稿插圖：",
    options: ["圖片 (A)", "圖片 (B)", "圖片 (C)", "圖片 (D)", "圖片 (E)", "圖片 (F)"],
    optionImages: [
      "/assets/exam/preA1/noodles.png",
      "/assets/exam/preA1/rice.png",
      "/assets/exam/preA1/pizza.png",
      "/assets/exam/preA1/hamburger.png",
      "/assets/exam/preA1/sandwich.png",
      "/assets/exam/preA1/bread.png"
    ],
    answer: 0,
    explanation: "對話中女孩回答「I want some hot chicken noodles」，故選麵條 (A)。",
    reviewed: true
  },
  {
    id: "tme-listen-d2p-11",
    track: "tme-preA1",
    category: "listening",
    subType: "listen-dlg2pic",
    serialNum: 11,
    taskType: "L-CONV",
    difficulty: 2,
    media: { audioText: "Girl: Look at that big animal in the water! Boy: That is a hippo taking a bath." },
    question: "聽對話，選出男孩指出的動物線稿插圖：",
    options: ["圖片 (A)", "圖片 (B)", "圖片 (C)", "圖片 (D)", "圖片 (E)", "圖片 (F)"],
    optionImages: [
      "/assets/exam/preA1/hippo.png",
      "/assets/exam/preA1/elephant.png",
      "/assets/exam/preA1/lion.png",
      "/assets/exam/preA1/bear.png",
      "/assets/exam/preA1/monkey.png",
      "/assets/exam/preA1/tiger.png"
    ],
    answer: 0,
    explanation: "對話中男孩說「That is a hippo」，故選河馬 (A)。",
    reviewed: true
  },
  {
    id: "tme-listen-d2p-12",
    track: "tme-preA1",
    category: "listening",
    subType: "listen-dlg2pic",
    serialNum: 12,
    taskType: "L-CONV",
    difficulty: 2,
    media: { audioText: "Boy: Can you play the piano? Girl: Yes, I can play the piano very well." },
    question: "聽對話，選出女孩會演奏的樂器線稿插圖：",
    options: ["圖片 (A)", "圖片 (B)", "圖片 (C)", "圖片 (D)", "圖片 (E)", "圖片 (F)"],
    optionImages: [
      "/assets/exam/preA1/piano.png",
      "/assets/exam/preA1/guitar.png",
      "/assets/exam/preA1/bell.png",
      "/assets/exam/preA1/robot.png",
      "/assets/exam/preA1/watch.png",
      "/assets/exam/preA1/computer.png"
    ],
    answer: 0,
    explanation: "對話中女孩確認「Yes, I can play the piano」，故選鋼琴 (A)。",
    reviewed: true
  }
];

// 2. Definition of 12 new items for tmePreA1ReadingBank.js
const NEW_READ_PIC2WORD = [
  {
    id: "tme-read-p2w-09",
    track: "tme-preA1",
    category: "reading",
    subType: "read-pic2word",
    serialNum: 9,
    taskType: "V-PIC",
    difficulty: 1,
    image: "/assets/exam/preA1/hospital.png",
    question: "看生活場所線稿插圖，選出正確的英文單字：",
    options: ["hospital", "clinic", "school", "library", "supermarket", "park", "zoo"],
    answer: 0,
    explanation: "插圖為帶有紅十字記號的醫院建築，英文為「hospital」。",
    reviewed: true
  },
  {
    id: "tme-read-p2w-10",
    track: "tme-preA1",
    category: "reading",
    subType: "read-pic2word",
    serialNum: 10,
    taskType: "V-PIC",
    difficulty: 1,
    image: "/assets/exam/preA1/rainbow.png",
    question: "看大自然景觀線稿插圖，選出正確的英文單字：",
    options: ["rainbow", "cloud", "snowman", "river", "sea", "flower", "tree"],
    answer: 0,
    explanation: "插圖為天空中美麗的彩虹，英文為「rainbow」。",
    reviewed: true
  },
  {
    id: "tme-read-p2w-11",
    track: "tme-preA1",
    category: "reading",
    subType: "read-pic2word",
    serialNum: 11,
    taskType: "V-PIC",
    difficulty: 1,
    image: "/assets/exam/preA1/doctor.png",
    question: "看人物職業線稿插圖，選出正確的英文單字：",
    options: ["doctor", "nurse", "teacher", "student", "police officer", "farmer", "cook"],
    answer: 0,
    explanation: "插圖為身著白袍並配戴聽診器的醫師，英文為「doctor」。",
    reviewed: true
  },
  {
    id: "tme-read-p2w-12",
    track: "tme-preA1",
    category: "reading",
    subType: "read-pic2word",
    serialNum: 12,
    taskType: "V-PIC",
    difficulty: 1,
    image: "/assets/exam/preA1/pizza.png",
    question: "看美味食物線稿插圖，選出正確的英文單字：",
    options: ["pizza", "hamburger", "sandwich", "bread", "cake", "noodles", "rice"],
    answer: 0,
    explanation: "插圖為切片起司義式披薩，英文為「pizza」。",
    reviewed: true
  },
  {
    id: "tme-read-p2w-13",
    track: "tme-preA1",
    category: "reading",
    subType: "read-pic2word",
    serialNum: 13,
    taskType: "V-PIC",
    difficulty: 1,
    image: "/assets/exam/preA1/police_officer.png",
    question: "看人物職業線稿插圖，選出正確的英文單字：",
    options: ["police officer", "doctor", "nurse", "teacher", "farmer", "pilot", "student"],
    answer: 0,
    explanation: "插圖為戴大盤警帽值勤的警察人員，英文為「police officer」。",
    reviewed: true
  },
  {
    id: "tme-read-p2w-14",
    track: "tme-preA1",
    category: "reading",
    subType: "read-pic2word",
    serialNum: 14,
    taskType: "V-PIC",
    difficulty: 1,
    image: "/assets/exam/preA1/beach.png",
    question: "看休閒場所線稿插圖，選出正確的英文單字：",
    options: ["beach", "mountain", "river", "park", "zoo", "sea", "forest"],
    answer: 0,
    explanation: "插圖為有陽傘、躺椅與海浪的沙灘海邊，英文為「beach」。",
    reviewed: true
  }
];

const NEW_READ_PIC2SENT = [
  {
    id: "tme-read-p2s-09",
    track: "tme-preA1",
    category: "reading",
    subType: "read-pic2sent",
    serialNum: 9,
    taskType: "G-CTX",
    difficulty: 1,
    image: "/assets/exam/preA1/action_brush_teeth.png",
    question: "看情境線稿插圖，選出描述最相符的句子：",
    options: [
      "The boy brushes his teeth every morning.",
      "The boy is washing his face.",
      "The boy is eating an apple.",
      "The boy is swimming in the pool.",
      "The boy is riding a bicycle.",
      "The boy is sleeping in bed."
    ],
    answer: 0,
    explanation: "插圖中男孩在鏡子前認真刷牙，句子 (A)「The boy brushes his teeth every morning.」完全吻合。",
    reviewed: true
  },
  {
    id: "tme-read-p2s-10",
    track: "tme-preA1",
    category: "reading",
    subType: "read-pic2sent",
    serialNum: 10,
    taskType: "G-CTX",
    difficulty: 1,
    image: "/assets/exam/preA1/action_play_basketball.png",
    question: "看情境線稿插圖，選出描述最相符的句子：",
    options: [
      "The students are playing basketball together.",
      "The students are running in the classroom.",
      "The students are singing in the music room.",
      "The students are flying a kite in the field.",
      "The students are making a snowman.",
      "The students are reading books in the library."
    ],
    answer: 0,
    explanation: "插圖中學生正在球場跳起投籃，句子 (A)「The students are playing basketball together.」完全吻合。",
    reviewed: true
  },
  {
    id: "tme-read-p2s-11",
    track: "tme-preA1",
    category: "reading",
    subType: "read-pic2sent",
    serialNum: 11,
    taskType: "G-CTX",
    difficulty: 1,
    image: "/assets/exam/preA1/action_swim.png",
    question: "看情境線稿插圖，選出描述最相符的句子：",
    options: [
      "The girl can swim very fast.",
      "The girl cannot swim at all.",
      "The girl is cooking noodles.",
      "The girl is riding a horse.",
      "The girl is climbing a tree.",
      "The girl is playing the guitar."
    ],
    answer: 0,
    explanation: "插圖為女孩戴泳鏡在池中游泳，句子 (A)「The girl can swim very fast.」相符。",
    reviewed: true
  },
  {
    id: "tme-read-p2s-12",
    track: "tme-preA1",
    category: "reading",
    subType: "read-pic2sent",
    serialNum: 12,
    taskType: "G-CTX",
    difficulty: 1,
    image: "/assets/exam/preA1/action_read_book.png",
    question: "看情境線稿插圖，選出描述最相符的句子：",
    options: [
      "The student is reading a book carefully.",
      "The student is playing computer games.",
      "The student is watching a movie.",
      "The student is washing the dishes.",
      "The student is dancing to the music.",
      "The student is riding a bus to school."
    ],
    answer: 0,
    explanation: "插圖為學生端坐在書桌前專注看書，句子 (A) 符合圖意。",
    reviewed: true
  },
  {
    id: "tme-read-p2s-13",
    track: "tme-preA1",
    category: "reading",
    subType: "read-pic2sent",
    serialNum: 13,
    taskType: "G-CTX",
    difficulty: 1,
    image: "/assets/exam/preA1/snowman.png",
    question: "看情境線稿插圖，選出描述最相符的句子：",
    options: [
      "It is cold and snowy. There is a snowman.",
      "It is hot and sunny at the beach.",
      "It is rainy. The girl has an umbrella.",
      "There are many animals in the zoo.",
      "The boy is playing soccer in the park.",
      "The family is eating dinner at home."
    ],
    answer: 0,
    explanation: "插圖為雪地裡的戴帽圍巾雪人，句子 (A)「It is cold and snowy. There is a snowman.」符合題意。",
    reviewed: true
  },
  {
    id: "tme-read-p2s-14",
    track: "tme-preA1",
    category: "reading",
    subType: "read-pic2sent",
    serialNum: 14,
    taskType: "G-CTX",
    difficulty: 1,
    image: "/assets/exam/preA1/action_sing_song.png",
    question: "看情境線稿插圖，選出描述最相符的句子：",
    options: [
      "The boy is singing a cheerful song.",
      "The boy is drawing a red flower.",
      "The boy is drinking a glass of water.",
      "The boy is driving a blue car.",
      "The boy is feeding a little dog.",
      "The boy is riding a train."
    ],
    answer: 0,
    explanation: "插圖為男孩手握麥克風歡樂唱歌，句子 (A)「The boy is singing a cheerful song.」最相符。",
    reviewed: true
  }
];

export {
  NEW_VOCAB_WORD2PIC,
  NEW_VOCAB_PIC2WORD,
  NEW_VOCAB_AUDIO2PIC,
  NEW_LISTEN_PIC2SENT,
  NEW_LISTEN_DLG2PIC,
  NEW_READ_PIC2WORD,
  NEW_READ_PIC2SENT
};
