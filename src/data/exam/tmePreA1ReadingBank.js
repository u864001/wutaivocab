/**
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

export const TME_PRE_A1_READING_BANK = [
  {
    "id": "tme-read-p2w-01",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-pic2word",
    "serialNum": 1,
    "taskType": "V-PIC",
    "difficulty": 1,
    "image": "/assets/exam/preA1/library.svg",
    "question": "看生活場所線稿插圖，選出正確的英文單字：",
    "options": [
      "library",
      "restaurant",
      "zoo",
      "playground",
      "park",
      "school",
      "hospital"
    ],
    "answer": 0,
    "explanation": "插圖為具備三角山牆與書本徽記的圖書館建築，英文為「library」。",
    "reviewed": true
  },
  {
    "id": "tme-read-p2s-01",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-pic2sent",
    "serialNum": 1,
    "taskType": "G-CTX",
    "difficulty": 1,
    "image": "/assets/exam/preA1/rainy_girl.svg",
    "question": "看情境線稿插圖，選出描述最相符的句子：",
    "options": [
      "It is rainy. The girl has an umbrella.",
      "It is sunny. The girl is swimming.",
      "It is windy. The boy is flying a kite.",
      "It is snowy. The children are making a snowman.",
      "The girl is waiting for the school bus.",
      "The girl is wearing a warm winter coat."
    ],
    "answer": 0,
    "explanation": "插圖為下雨天小女孩撐傘情境，句子 (A) 完全吻合。",
    "reviewed": true
  },
  {
    "id": "tme-read-tf-01",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-truefalse",
    "serialNum": 1,
    "taskType": "R-TF",
    "difficulty": 1,
    "question": "閱讀生活情境：\nJason is twelve years old. His sister, Amy, is nine years old.\n\n判斷下列敘述是否相符：\nJason is older than Amy. (Jason 比 Amy 年長)",
    "options": [
      "True (相符)",
      "False (不符)"
    ],
    "answer": 0,
    "explanation": "文中 Jason 12 歲，Amy 9 歲，Jason 確實比妹妹年長，敘述相符，故選 True。",
    "reviewed": true
  },
  {
    "id": "tme-read-tf-02",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-truefalse",
    "serialNum": 2,
    "taskType": "R-TF",
    "difficulty": 1,
    "question": "閱讀生活情境：\nEmma likes apples and oranges, but she doesn't like bananas or papayas.\n\n判斷下列敘述是否相符：\nEmma likes bananas.",
    "options": [
      "True (相符)",
      "False (不符)"
    ],
    "answer": 1,
    "explanation": "文中明確指出「she doesn't like bananas」，故 Emma 喜歡香蕉的敘述與原文不符，選 False。",
    "reviewed": true
  },
  {
    "id": "tme-read-tf-03",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-truefalse",
    "serialNum": 3,
    "taskType": "R-TF",
    "difficulty": 1,
    "question": "閱讀生活情境：\nThe supermarket is open from Monday to Saturday. It is closed on Sunday.\n\n判斷下列敘述是否相符：\nYou can buy food at the supermarket on Sunday.",
    "options": [
      "True (相符)",
      "False (不符)"
    ],
    "answer": 1,
    "explanation": "超市週日公休（closed on Sunday），因此週日無法在超市買東西，敘述不符，選 False。",
    "reviewed": true
  },
  {
    "id": "tme-read-tf-04",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-truefalse",
    "serialNum": 4,
    "taskType": "R-TF",
    "difficulty": 1,
    "question": "閱讀生活情境：\nDavid gets up at 6:30 every morning. He eats breakfast at 7:00 and goes to school at 7:30.\n\n判斷下列敘述是否相符：\nDavid eats breakfast before going to school. (David 在上學前吃早餐)",
    "options": [
      "True (相符)",
      "False (不符)"
    ],
    "answer": 0,
    "explanation": "7:00 吃早餐，7:30 去上學，確實是在上學前吃早餐，敘述相符，選 True。",
    "reviewed": true
  },
  {
    "id": "tme-read-tf-05",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-truefalse",
    "serialNum": 5,
    "taskType": "R-TF",
    "difficulty": 1,
    "question": "閱讀生活情境：\nPeter has two dogs and three cats in his house. All his pets are friendly.\n\n判斷下列敘述是否相符：\nPeter has five pets in total. (Peter 總共有五隻寵物)",
    "options": [
      "True (相符)",
      "False (不符)"
    ],
    "answer": 0,
    "explanation": "2 隻狗加 3 隻貓合計 5 隻寵物，敘述相符，選 True。",
    "reviewed": true
  },
  {
    "id": "tme-read-tf-06",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-truefalse",
    "serialNum": 6,
    "taskType": "R-TF",
    "difficulty": 2,
    "question": "閱讀生活情境：\nThe train to Taipei leaves at 10:15. It is 10:30 now, and Sam is still at home.\n\n判斷下列敘述是否相符：\nSam is on the train now. (Sam 現在正在火車上)",
    "options": [
      "True (相符)",
      "False (不符)"
    ],
    "answer": 1,
    "explanation": "火車 10:15 已開走，現在 10:30 且 Sam 還在家裡，顯然沒搭上火車，敘述不符，選 False。",
    "reviewed": true
  },
  {
    "id": "tme-read-cloze-01",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-cloze",
    "serialNum": 1,
    "taskType": "R-CLOZE",
    "difficulty": 2,
    "passage": {
      "title": "【短文填空】My Pet Dog",
      "text": "I have a cute pet dog. His name is Lucky. Lucky is brown and white. He loves to _______ with a small red ball."
    },
    "question": "依短文文意，空格處應填入哪一個單字？",
    "options": [
      "play",
      "eat",
      "write",
      "sing",
      "draw",
      "sleep"
    ],
    "answer": 0,
    "explanation": "狗狗喜歡「玩」紅色的球，片語為 play with a ball，故選 (A) play。",
    "reviewed": true
  },
  {
    "id": "tme-read-cloze-02",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-cloze",
    "serialNum": 2,
    "taskType": "R-CLOZE",
    "difficulty": 1,
    "passage": {
      "title": "【短文填空】Sunday in the Park",
      "text": "Today is Sunday. It is a sunny day. Mary and her brother go to the park. They ride their _______ happily together."
    },
    "question": "依短文文意，空格處應填入哪一個單字？",
    "options": [
      "bikes",
      "beds",
      "chairs",
      "desks",
      "shoes",
      "boxes"
    ],
    "answer": 0,
    "explanation": "在公園裡騎的是腳踏車（ride bikes），故選 ① bikes。",
    "reviewed": true
  },
  {
    "id": "tme-read-cloze-03",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-cloze",
    "serialNum": 3,
    "taskType": "R-CLOZE",
    "difficulty": 1,
    "passage": {
      "title": "【短文填空】After School Snack",
      "text": "Tom is hungry after school. He opens the refrigerator (冰箱) and takes out some bread. Then he drinks a glass of _______."
    },
    "question": "依短文文意，空格處應填入哪一個單字？",
    "options": [
      "milk",
      "bread",
      "apple",
      "rice",
      "pizza",
      "egg"
    ],
    "answer": 0,
    "explanation": "動詞為 drinks（喝），且單位為 a glass of（一杯），空格只能填可飲用的液體 milk（牛奶），故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-cloze-04",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-cloze",
    "serialNum": 4,
    "taskType": "R-CLOZE",
    "difficulty": 2,
    "passage": {
      "title": "【短文填空】Reading Time",
      "text": "Lisa wants to read an English story. She walks to the _______ and finds a very interesting (有趣的) book on the shelf (書架)."
    },
    "question": "依短文文意，空格處應填入哪一個單字？",
    "options": [
      "library",
      "kitchen",
      "bedroom",
      "park",
      "zoo",
      "hospital"
    ],
    "answer": 0,
    "explanation": "找書與閱讀應前往圖書館（library），故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-cloze-05",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-cloze",
    "serialNum": 5,
    "taskType": "R-CLOZE",
    "difficulty": 1,
    "passage": {
      "title": "【生活短句填空】Rainy Day Reminder",
      "text": "It's cold and rainy today. Don't forget to take an _______ with you."
    },
    "question": "依文意，空格處應填入哪一個單字？",
    "options": [
      "umbrella",
      "pencil",
      "notebook",
      "ruler",
      "jacket",
      "eraser"
    ],
    "answer": 0,
    "explanation": "雨天出門提醒攜帶的應為雨傘（umbrella），冠詞為 an 也符合母音開頭，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-cloze-06",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-cloze",
    "serialNum": 6,
    "taskType": "R-CLOZE",
    "difficulty": 1,
    "passage": {
      "title": "【短文填空】Lunch Break",
      "text": "Kevin has four classes in the morning. At twelve o'clock, he has _______ with his classmates in the classroom."
    },
    "question": "依短文文意，空格處應填入哪一個單字？",
    "options": [
      "lunch",
      "breakfast",
      "dinner",
      "homework",
      "baseball",
      "sleep"
    ],
    "answer": 0,
    "explanation": "中午十二點（twelve o'clock）吃的餐點為午餐（lunch），故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p2w-02",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-pic2word",
    "serialNum": 2,
    "taskType": "V-PIC",
    "difficulty": 1,
    "image": "/assets/exam/preA1/park.svg",
    "question": "看生活場所線稿插圖，選出正確的英文單字：",
    "options": [
      "park",
      "zoo",
      "school",
      "hospital",
      "library",
      "restaurant",
      "playground"
    ],
    "answer": 0,
    "explanation": "插圖為公園綠地與長椅，英文為「park」。",
    "reviewed": true
  },
  {
    "id": "tme-read-p2w-03",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-pic2word",
    "serialNum": 3,
    "taskType": "V-PIC",
    "difficulty": 1,
    "image": "/assets/exam/preA1/school.svg",
    "question": "看生活場所線稿插圖，選出正確的英文單字：",
    "options": [
      "school",
      "library",
      "restaurant",
      "park",
      "zoo",
      "playground",
      "hospital"
    ],
    "answer": 0,
    "explanation": "插圖為帶有鐘樓的學校校舍線稿，英文為「school」。",
    "reviewed": true
  },
  {
    "id": "tme-read-p2w-04",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-pic2word",
    "serialNum": 4,
    "taskType": "V-PIC",
    "difficulty": 1,
    "image": "/assets/exam/preA1/zoo.svg",
    "question": "看生活場所線稿插圖，選出正確的英文單字：",
    "options": [
      "zoo",
      "park",
      "library",
      "playground",
      "school",
      "restaurant",
      "hospital"
    ],
    "answer": 0,
    "explanation": "插圖為動物園入口與柵欄線稿，英文為「zoo」。",
    "reviewed": true
  },
  {
    "id": "tme-read-p2w-05",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-pic2word",
    "serialNum": 5,
    "taskType": "V-PIC",
    "difficulty": 1,
    "image": "/assets/exam/preA1/restaurant.svg",
    "question": "看生活場所線稿插圖，選出正確的英文單字：",
    "options": [
      "restaurant",
      "school",
      "zoo",
      "library",
      "park",
      "playground",
      "hospital"
    ],
    "answer": 0,
    "explanation": "插圖為餐廳與刀叉招牌線稿，英文為「restaurant」。",
    "reviewed": true
  },
  {
    "id": "tme-read-p2w-06",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-pic2word",
    "serialNum": 6,
    "taskType": "V-PIC",
    "difficulty": 1,
    "image": "/assets/exam/preA1/playground.svg",
    "question": "看生活場所線稿插圖，選出正確的英文單字：",
    "options": [
      "playground",
      "park",
      "library",
      "zoo",
      "school",
      "restaurant",
      "hospital"
    ],
    "answer": 0,
    "explanation": "插圖為溜滑梯與遊樂器材線稿，英文為「playground」。",
    "reviewed": true
  },
  {
    "id": "tme-read-p2w-07",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-pic2word",
    "serialNum": 7,
    "taskType": "V-PIC",
    "difficulty": 1,
    "image": "/assets/exam/preA1/bag.svg",
    "question": "看上學用品線稿插圖，選出代表的英文單字：",
    "options": [
      "bag",
      "book",
      "desk",
      "chair",
      "pencil",
      "ruler",
      "eraser"
    ],
    "answer": 0,
    "explanation": "插圖為雙肩書包線稿，英文為「bag」。",
    "reviewed": true
  },
  {
    "id": "tme-read-p2w-08",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-pic2word",
    "serialNum": 8,
    "taskType": "V-PIC",
    "difficulty": 1,
    "image": "/assets/exam/preA1/desk.svg",
    "question": "看教室設備線稿插圖，選出代表的英文單字：",
    "options": [
      "desk",
      "chair",
      "pen",
      "ruler",
      "bag",
      "book",
      "pencil"
    ],
    "answer": 0,
    "explanation": "插圖為附帶抽屜的書桌線稿，英文為「desk」。",
    "reviewed": true
  },
  {
    "id": "tme-read-p2s-02",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-pic2sent",
    "serialNum": 2,
    "taskType": "G-CTX",
    "difficulty": 1,
    "image": "/assets/exam/preA1/bicycle.svg",
    "question": "看情境線稿插圖，選出描述最相符的句子：",
    "options": [
      "The boy has a new bicycle.",
      "The girl is driving a bus.",
      "The train is at the station.",
      "The boat is in the water.",
      "The boy is cleaning his yellow bicycle.",
      "The girl is riding a black horse."
    ],
    "answer": 0,
    "explanation": "插圖為腳踏車線稿，句子 (A) 完全吻合。",
    "reviewed": true
  },
  {
    "id": "tme-read-p2s-03",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-pic2sent",
    "serialNum": 3,
    "taskType": "G-CTX",
    "difficulty": 1,
    "image": "/assets/exam/preA1/dog.svg",
    "question": "看情境線稿插圖，選出描述最相符的句子：",
    "options": [
      "The cute dog is sitting on the floor.",
      "The students are studying in the classroom.",
      "The cat is climbing the tree.",
      "The birds are singing in the sky.",
      "The children are playing basketball.",
      "The teacher is writing on the blackboard."
    ],
    "answer": 0,
    "explanation": "插圖為可愛小狗坐在地上，句子 (A) 完全吻合。",
    "reviewed": true
  },
  {
    "id": "tme-read-p2s-04",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-pic2sent",
    "serialNum": 4,
    "taskType": "G-CTX",
    "difficulty": 1,
    "image": "/assets/exam/preA1/duck.svg",
    "question": "看情境線稿插圖，選出描述最相符的句子：",
    "options": [
      "The little duck is swimming in the water.",
      "There are two birds in the tree.",
      "There is a cat under the chair.",
      "There are four fish in the pond.",
      "There is a monkey climbing the tree.",
      "There are three dogs in the car."
    ],
    "answer": 0,
    "explanation": "插圖為水中游水的小鴨，句子 (A) 最相符。",
    "reviewed": true
  },
  {
    "id": "tme-read-p2s-05",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-pic2sent",
    "serialNum": 5,
    "taskType": "G-CTX",
    "difficulty": 1,
    "image": "/assets/exam/preA1/bus.svg",
    "question": "看情境線稿插圖，選出描述最相符的句子：",
    "options": [
      "The students take the yellow school bus.",
      "The woman is cooking in the kitchen.",
      "The man is sleeping in the bedroom.",
      "The girl is reading in the library.",
      "The boy is washing a bicycle.",
      "The children are swimming in the ocean."
    ],
    "answer": 0,
    "explanation": "插圖為大公車/校車，句子 (A)「搭公車上學」完全吻合。",
    "reviewed": true
  },
  {
    "id": "tme-read-p2s-06",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-pic2sent",
    "serialNum": 6,
    "taskType": "G-CTX",
    "difficulty": 1,
    "image": "/assets/exam/preA1/book.svg",
    "question": "看情境線稿插圖，選出描述最相符的句子：",
    "options": [
      "There is an open English book on the desk.",
      "The children are having fun at the playground.",
      "The cat is sleeping under the bed.",
      "The woman is driving a car.",
      "The children are eating in the restaurant.",
      "The boy is playing basketball."
    ],
    "answer": 0,
    "explanation": "插圖為翻開的書本，句子 (A) 完全相符。",
    "reviewed": true
  },
  {
    "id": "tme-read-p2s-07",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-pic2sent",
    "serialNum": 7,
    "taskType": "G-CTX",
    "difficulty": 1,
    "image": "/assets/exam/preA1/cake.svg",
    "question": "看情境線稿插圖，選出描述最相符的句子：",
    "options": [
      "There is a birthday cake with candles.",
      "The cute cat is sleeping on the sofa.",
      "The big dog is barking at the door.",
      "The little bird is singing on the fence.",
      "The children are playing on the swing.",
      "The students are studying math."
    ],
    "answer": 0,
    "explanation": "插圖為點燃蠟燭的生日蛋糕，句子 (A) 完全吻合。",
    "reviewed": true
  },
  {
    "id": "tme-read-p2s-08",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-pic2sent",
    "serialNum": 8,
    "taskType": "G-CTX",
    "difficulty": 1,
    "image": "/assets/exam/preA1/boat.svg",
    "question": "看情境線稿插圖，選出描述最相符的句子：",
    "options": [
      "A small sailboat is floating on the water.",
      "The family is having a picnic in the park.",
      "The family is watching television at home.",
      "The girl is shopping in the bookstore.",
      "The students are swimming in the ocean.",
      "The boy is flying a kite."
    ],
    "answer": 0,
    "explanation": "插圖為海上的小帆船，句子 (A) 完全吻合。",
    "reviewed": true
  },
  {
    "id": "tme-read-tf-07",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-truefalse",
    "serialNum": 7,
    "taskType": "R-TF",
    "difficulty": 1,
    "question": "閱讀生活情境：\nSandy loves sweet food. She buys three chocolate cookies at the bakery.\n\n判斷下列敘述是否相符：\nSandy bought three cookies. (Sandy 買了三塊餅乾)",
    "options": [
      "True (相符)",
      "False (不符)"
    ],
    "answer": 0,
    "explanation": "文中「She buys three chocolate cookies」，敘述相符，故選 True。",
    "reviewed": true
  },
  {
    "id": "tme-read-tf-08",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-truefalse",
    "serialNum": 8,
    "taskType": "R-TF",
    "difficulty": 1,
    "question": "閱讀生活情境：\nAndy has an English class on Monday morning and a music class on Friday afternoon.\n\n判斷下列敘述是否相符：\nAndy has an English class on Friday. (Andy 週五上英語課)",
    "options": [
      "True (相符)",
      "False (不符)"
    ],
    "answer": 1,
    "explanation": "文中英語課在 Monday（週一），週五是 music class，敘述不符，故選 False。",
    "reviewed": true
  },
  {
    "id": "tme-read-tf-09",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-truefalse",
    "serialNum": 9,
    "taskType": "R-TF",
    "difficulty": 2,
    "question": "閱讀生活情境：\nPeter and his sister Amy ride their bicycles to the park every Sunday morning.\n\n判斷下列敘述是否相符：\nPeter and Amy go to the park by bus. (Peter 和 Amy 搭公車去公園)",
    "options": [
      "True (相符)",
      "False (不符)"
    ],
    "answer": 1,
    "explanation": "文中是「ride their bicycles（騎腳踏車）」，非搭公車，敘述不符，故選 False。",
    "reviewed": true
  },
  {
    "id": "tme-read-tf-10",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-truefalse",
    "serialNum": 10,
    "taskType": "R-TF",
    "difficulty": 2,
    "question": "閱讀生活情境：\nDavid has a big brown dog named Lucky. Lucky is four years old and loves to run.\n\n判斷下列敘述是否相符：\nLucky is the name of David’s pet dog. (Lucky 是 David 寵物狗的名字)",
    "options": [
      "True (相符)",
      "False (不符)"
    ],
    "answer": 0,
    "explanation": "文中「a big brown dog named Lucky」，敘述相符，故選 True。",
    "reviewed": true
  },
  {
    "id": "tme-read-cloze-07",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-cloze",
    "serialNum": 7,
    "taskType": "R-CLOZE",
    "difficulty": 1,
    "passage": {
      "title": "【短文填空】Morning Routine",
      "text": "Every morning, Ben wakes up at seven o'clock. He washes his face and puts on his clean blue _______."
    },
    "question": "依短文文意，空格處應填入哪一個單字？",
    "options": [
      "shirt",
      "pencil",
      "apple",
      "clock",
      "book",
      "desk"
    ],
    "answer": 0,
    "explanation": "動詞為 puts on（穿上），空格只能填衣物類單字 shirt（襯衫/衣物），故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-cloze-08",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-cloze",
    "serialNum": 8,
    "taskType": "R-CLOZE",
    "difficulty": 1,
    "passage": {
      "title": "【短文填空】Thirsty After Running",
      "text": "Andy runs for thirty minutes in the sports field. He is very thirsty and drinks some cold _______."
    },
    "question": "依短文文意，空格處應填入哪一個單字？",
    "options": [
      "water",
      "bread",
      "cookie",
      "pizza",
      "banana",
      "egg"
    ],
    "answer": 0,
    "explanation": "口渴（thirsty）且動詞為 drinks（喝），空格填水（water），故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-cloze-09",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-cloze",
    "serialNum": 9,
    "taskType": "R-CLOZE",
    "difficulty": 2,
    "passage": {
      "title": "【短文填空】At the Zoo",
      "text": "The children visit the zoo with their teacher. They see a giant grey _______ drinking with its long trunk (象鼻)."
    },
    "question": "依短文文意，空格處應填入哪一個單字？",
    "options": [
      "elephant",
      "rabbit",
      "monkey",
      "bird",
      "cat",
      "tiger"
    ],
    "answer": 0,
    "explanation": "有 long trunk（長鼻子）的巨大灰色動物為 elephant（大象），故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-cloze-10",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-cloze",
    "serialNum": 10,
    "taskType": "R-CLOZE",
    "difficulty": 2,
    "passage": {
      "title": "【短文填空】Art Class Project",
      "text": "In the art class, Kelly draws a beautiful red flower. Then she uses her sharp _______ to cut out the paper."
    },
    "question": "依短文文意，空格處應填入哪一個單字？",
    "options": [
      "scissors",
      "pencils",
      "rulers",
      "erasers",
      "crayons",
      "brushes"
    ],
    "answer": 0,
    "explanation": "美勞課剪紙（cut out the paper）使用的工具為 scissors（剪刀），故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p01-01",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 1,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g01",
    "passage": {
      "title": "【在地文化與生活】A Sunny Day in Wutai",
      "text": "Leo and his sister, Maya, live in Wutai. Today is Sunday, and the weather is sunny and warm.\nIn the morning, they help their grandfather in the vegetable garden. They pick fresh red tomatoes and green beans.\nIn the afternoon, they sit outside their stone slab house. Grandfather tells them stories about the mountains while they eat sweet boiled millet cakes.\nLeo loves his mountain home very much.\n\n* stone slab house: 石板屋\n* boiled millet cake: 水煮小米糕\n* fresh: 新鮮的"
    },
    "question": "What is the weather like in Wutai today?",
    "options": [
      "It is sunny and warm.",
      "It is cold and rainy.",
      "It is windy and snowy.",
      "It is cloudy and dark."
    ],
    "answer": 0,
    "explanation": "文中第一段第二句清楚說明「Today is Sunday, and the weather is sunny and warm.（今天天氣晴朗且溫暖）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p01-02",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 2,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g01",
    "passage": {
      "title": "【在地文化與生活】A Sunny Day in Wutai",
      "text": "Leo and his sister, Maya, live in Wutai. Today is Sunday, and the weather is sunny and warm.\nIn the morning, they help their grandfather in the vegetable garden. They pick fresh red tomatoes and green beans.\nIn the afternoon, they sit outside their stone slab house. Grandfather tells them stories about the mountains while they eat sweet boiled millet cakes.\nLeo loves his mountain home very much.\n\n* stone slab house: 石板屋\n* boiled millet cake: 水煮小米糕\n* fresh: 新鮮的"
    },
    "question": "What do Leo and Maya do in the morning?",
    "options": [
      "They help their grandfather in the garden.",
      "They play basketball at school.",
      "They go to the supermarket.",
      "They ride their bicycles in the park."
    ],
    "answer": 0,
    "explanation": "文中說明「In the morning, they help their grandfather in the vegetable garden.（早上他們在菜園幫祖父的忙）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p01-03",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 3,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g01",
    "passage": {
      "title": "【在地文化與生活】A Sunny Day in Wutai",
      "text": "Leo and his sister, Maya, live in Wutai. Today is Sunday, and the weather is sunny and warm.\nIn the morning, they help their grandfather in the vegetable garden. They pick fresh red tomatoes and green beans.\nIn the afternoon, they sit outside their stone slab house. Grandfather tells them stories about the mountains while they eat sweet boiled millet cakes.\nLeo loves his mountain home very much.\n\n* stone slab house: 石板屋\n* boiled millet cake: 水煮小米糕\n* fresh: 新鮮的"
    },
    "question": "Where do the children sit in the afternoon?",
    "options": [
      "Outside their stone slab house",
      "In the school library",
      "On the yellow school bus",
      "Under the bridge"
    ],
    "answer": 0,
    "explanation": "文中說明「In the afternoon, they sit outside their stone slab house.（下午他們坐在石板屋外）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p01-04",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 4,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g01",
    "passage": {
      "title": "【在地文化與生活】A Sunny Day in Wutai",
      "text": "Leo and his sister, Maya, live in Wutai. Today is Sunday, and the weather is sunny and warm.\nIn the morning, they help their grandfather in the vegetable garden. They pick fresh red tomatoes and green beans.\nIn the afternoon, they sit outside their stone slab house. Grandfather tells them stories about the mountains while they eat sweet boiled millet cakes.\nLeo loves his mountain home very much.\n\n* stone slab house: 石板屋\n* boiled millet cake: 水煮小米糕\n* fresh: 新鮮的"
    },
    "question": "What do the children eat while listening to Grandfather's stories?",
    "options": [
      "Sweet boiled millet cakes",
      "Hot hamburgers and French fries",
      "Cold chocolate ice cream",
      "Fresh apples and bananas"
    ],
    "answer": 0,
    "explanation": "文中說明「while they eat sweet boiled millet cakes（邊吃著甜甜的水煮小米糕）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p02-01",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 1,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g02",
    "passage": {
      "title": "【校園生活與告示】School Lost and Found Notice",
      "text": "LOST AND FOUND NOTICE\nDate: November 6th\nPlace Found: Near the school gym (體育館)\n\nA student found a blue pencil case on the bench near the gym after the PE class.\nInside the pencil case, there are:\n- Three black pencils\n- One long yellow ruler\n- A small pink eraser shaped like a rabbit\n\nIf this is your pencil case, please go to the library and talk to Miss Lin.\n\n* lost and found: 失物招領\n* gym: 體育館\n* shaped like: 形狀像..."
    },
    "question": "What color is the lost pencil case?",
    "options": [
      "Blue",
      "Pink",
      "Yellow",
      "Black"
    ],
    "answer": 0,
    "explanation": "告示第一段「A student found a blue pencil case...」，鉛筆盒為藍色，故選 (A) Blue。",
    "reviewed": true
  },
  {
    "id": "tme-read-p02-02",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 2,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g02",
    "passage": {
      "title": "【校園生活與告示】School Lost and Found Notice",
      "text": "LOST AND FOUND NOTICE\nDate: November 6th\nPlace Found: Near the school gym (體育館)\n\nA student found a blue pencil case on the bench near the gym after the PE class.\nInside the pencil case, there are:\n- Three black pencils\n- One long yellow ruler\n- A small pink eraser shaped like a rabbit\n\nIf this is your pencil case, please go to the library and talk to Miss Lin.\n\n* lost and found: 失物招領\n* gym: 體育館\n* shaped like: 形狀像..."
    },
    "question": "Where was the pencil case found?",
    "options": [
      "On the bench near the school gym",
      "In the classroom under the desk",
      "On the table in the cafeteria",
      "In front of the school gate"
    ],
    "answer": 0,
    "explanation": "告示寫明「on the bench near the gym after the PE class（體育課後在體育館附近的長椅上）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p02-03",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 3,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g02",
    "passage": {
      "title": "【校園生活與告示】School Lost and Found Notice",
      "text": "LOST AND FOUND NOTICE\nDate: November 6th\nPlace Found: Near the school gym (體育館)\n\nA student found a blue pencil case on the bench near the gym after the PE class.\nInside the pencil case, there are:\n- Three black pencils\n- One long yellow ruler\n- A small pink eraser shaped like a rabbit\n\nIf this is your pencil case, please go to the library and talk to Miss Lin.\n\n* lost and found: 失物招領\n* gym: 體育館\n* shaped like: 形狀像..."
    },
    "question": "What does the pink eraser look like?",
    "options": [
      "It is shaped like a rabbit.",
      "It looks like a small car.",
      "It is shaped like an apple.",
      "It looks like a yellow star."
    ],
    "answer": 0,
    "explanation": "告示列出「A small pink eraser shaped like a rabbit（一個形狀像小兔子的粉紅色橡皮擦）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p02-04",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 4,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g02",
    "passage": {
      "title": "【校園生活與告示】School Lost and Found Notice",
      "text": "LOST AND FOUND NOTICE\nDate: November 6th\nPlace Found: Near the school gym (體育館)\n\nA student found a blue pencil case on the bench near the gym after the PE class.\nInside the pencil case, there are:\n- Three black pencils\n- One long yellow ruler\n- A small pink eraser shaped like a rabbit\n\nIf this is your pencil case, please go to the library and talk to Miss Lin.\n\n* lost and found: 失物招領\n* gym: 體育館\n* shaped like: 形狀像..."
    },
    "question": "Where should the owner go to get the pencil case back?",
    "options": [
      "The library",
      "The playground",
      "The art classroom",
      "The school office"
    ],
    "answer": 0,
    "explanation": "文末註明「please go to the library and talk to Miss Lin」，失主應前往圖書館找林老師，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p03-01",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 1,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g03",
    "passage": {
      "title": "【社交溝通與邀請函】Kevin's 10th Birthday Party Invitation",
      "text": "YOU ARE INVITED!\nTo: All My Friends\nFrom: Kevin\nEvent: Kevin's 10th Birthday Party!\n\nWhen: Saturday, December 12th, from 2:00 PM to 5:00 PM\nWhere: Kevin's House (No. 8, Green Road, near Central Park)\n\nFun Activities:\n1. Play video games and board games\n2. Make your own mini pizza\n3. Enjoy chocolate birthday cake and orange juice\n\nPlease reply (回覆) to Kevin's mother before December 8th.\nWe hope to see you there!\n\n* invitation: 邀請函\n* event: 活動/盛事\n* board game: 桌上遊戲/桌遊\n* reply: 回覆"
    },
    "question": "Whose birthday party is it?",
    "options": [
      "Kevin's birthday party",
      "Kevin's mother's party",
      "Central Park's festival",
      "Miss Lin's party"
    ],
    "answer": 0,
    "explanation": "邀請函開頭標題「Kevin's 10th Birthday Party!」，為 Kevin 的 10 歲生日派對，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p03-02",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 2,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g03",
    "passage": {
      "title": "【社交溝通與邀請函】Kevin's 10th Birthday Party Invitation",
      "text": "YOU ARE INVITED!\nTo: All My Friends\nFrom: Kevin\nEvent: Kevin's 10th Birthday Party!\n\nWhen: Saturday, December 12th, from 2:00 PM to 5:00 PM\nWhere: Kevin's House (No. 8, Green Road, near Central Park)\n\nFun Activities:\n1. Play video games and board games\n2. Make your own mini pizza\n3. Enjoy chocolate birthday cake and orange juice\n\nPlease reply (回覆) to Kevin's mother before December 8th.\nWe hope to see you there!\n\n* invitation: 邀請函\n* event: 活動/盛事\n* board game: 桌上遊戲/桌遊\n* reply: 回覆"
    },
    "question": "What time does the birthday party start?",
    "options": [
      "At 2:00 PM",
      "At 5:00 PM",
      "At 10:00 AM",
      "At 12:00 PM"
    ],
    "answer": 0,
    "explanation": "時間欄位明確註明「from 2:00 PM to 5:00 PM」，下午 2 點開始，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p03-03",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 3,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g03",
    "passage": {
      "title": "【社交溝通與邀請函】Kevin's 10th Birthday Party Invitation",
      "text": "YOU ARE INVITED!\nTo: All My Friends\nFrom: Kevin\nEvent: Kevin's 10th Birthday Party!\n\nWhen: Saturday, December 12th, from 2:00 PM to 5:00 PM\nWhere: Kevin's House (No. 8, Green Road, near Central Park)\n\nFun Activities:\n1. Play video games and board games\n2. Make your own mini pizza\n3. Enjoy chocolate birthday cake and orange juice\n\nPlease reply (回覆) to Kevin's mother before December 8th.\nWe hope to see you there!\n\n* invitation: 邀請函\n* event: 活動/盛事\n* board game: 桌上遊戲/桌遊\n* reply: 回覆"
    },
    "question": "What food can the guests make by themselves at the party?",
    "options": [
      "Mini pizza",
      "Chocolate cake",
      "Hamburgers",
      "Apple pies"
    ],
    "answer": 0,
    "explanation": "活動第二項標註「Make your own mini pizza（自己做迷你披薩）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p03-04",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 4,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g03",
    "passage": {
      "title": "【社交溝通與邀請函】Kevin's 10th Birthday Party Invitation",
      "text": "YOU ARE INVITED!\nTo: All My Friends\nFrom: Kevin\nEvent: Kevin's 10th Birthday Party!\n\nWhen: Saturday, December 12th, from 2:00 PM to 5:00 PM\nWhere: Kevin's House (No. 8, Green Road, near Central Park)\n\nFun Activities:\n1. Play video games and board games\n2. Make your own mini pizza\n3. Enjoy chocolate birthday cake and orange juice\n\nPlease reply (回覆) to Kevin's mother before December 8th.\nWe hope to see you there!\n\n* invitation: 邀請函\n* event: 活動/盛事\n* board game: 桌上遊戲/桌遊\n* reply: 回覆"
    },
    "question": "When should friends reply to Kevin's mother?",
    "options": [
      "Before December 8th",
      "On December 12th",
      "After 5:00 PM",
      "On Saturday morning"
    ],
    "answer": 0,
    "explanation": "文末明確提醒「Please reply to Kevin's mother before December 8th（請在 12 月 8 日前向媽媽回覆）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p04-01",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 1,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g04",
    "passage": {
      "title": "【日常生活與寵物】A Day with Cookie the Cat",
      "text": "Amy has a very cute white cat named Cookie. Cookie is only one year old, but she is very smart and active.\nEvery morning at six thirty, Cookie walks into Amy's bedroom and licks her hand to wake her up.\nAfter breakfast, Cookie likes to sit on the windowsill and watch the little birds singing in the garden.\nIn the afternoon, Amy plays with Cookie using a red string. Cookie jumps up and down happily.\nAt night, Cookie sleeps quietly at the foot of Amy's bed. Amy loves Cookie so much.\n\n* smart: 聰明的\n* active: 活潑好動的\n* windowsill: 窗台\n* red string: 紅色毛線繩"
    },
    "question": "What animal is Cookie?",
    "options": [
      "A cute white cat",
      "A big brown dog",
      "A yellow bird",
      "A grey rabbit"
    ],
    "answer": 0,
    "explanation": "第一句「Amy has a very cute white cat named Cookie」，Cookie 是一隻白貓，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p04-02",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 2,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g04",
    "passage": {
      "title": "【日常生活與寵物】A Day with Cookie the Cat",
      "text": "Amy has a very cute white cat named Cookie. Cookie is only one year old, but she is very smart and active.\nEvery morning at six thirty, Cookie walks into Amy's bedroom and licks her hand to wake her up.\nAfter breakfast, Cookie likes to sit on the windowsill and watch the little birds singing in the garden.\nIn the afternoon, Amy plays with Cookie using a red string. Cookie jumps up and down happily.\nAt night, Cookie sleeps quietly at the foot of Amy's bed. Amy loves Cookie so much.\n\n* smart: 聰明的\n* active: 活潑好動的\n* windowsill: 窗台\n* red string: 紅色毛線繩"
    },
    "question": "How does Cookie wake Amy up in the morning?",
    "options": [
      "She licks Amy's hand.",
      "She barks loudly.",
      "She sings a song.",
      "She rings a bell."
    ],
    "answer": 0,
    "explanation": "第二段「Cookie walks into Amy's bedroom and licks her hand to wake her up」，Cookie 舔 Amy 的手叫醒她，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p04-03",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 3,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g04",
    "passage": {
      "title": "【日常生活與寵物】A Day with Cookie the Cat",
      "text": "Amy has a very cute white cat named Cookie. Cookie is only one year old, but she is very smart and active.\nEvery morning at six thirty, Cookie walks into Amy's bedroom and licks her hand to wake her up.\nAfter breakfast, Cookie likes to sit on the windowsill and watch the little birds singing in the garden.\nIn the afternoon, Amy plays with Cookie using a red string. Cookie jumps up and down happily.\nAt night, Cookie sleeps quietly at the foot of Amy's bed. Amy loves Cookie so much.\n\n* smart: 聰明的\n* active: 活潑好動的\n* windowsill: 窗台\n* red string: 紅色毛線繩"
    },
    "question": "What does Cookie like to watch from the windowsill?",
    "options": [
      "Little birds in the garden",
      "Cars on the road",
      "Children in the park",
      "Fish in the river"
    ],
    "answer": 0,
    "explanation": "文中說明「watch the little birds singing in the garden（看著花園裡唱歌的小鳥）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p04-04",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 4,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g04",
    "passage": {
      "title": "【日常生活與寵物】A Day with Cookie the Cat",
      "text": "Amy has a very cute white cat named Cookie. Cookie is only one year old, but she is very smart and active.\nEvery morning at six thirty, Cookie walks into Amy's bedroom and licks her hand to wake her up.\nAfter breakfast, Cookie likes to sit on the windowsill and watch the little birds singing in the garden.\nIn the afternoon, Amy plays with Cookie using a red string. Cookie jumps up and down happily.\nAt night, Cookie sleeps quietly at the foot of Amy's bed. Amy loves Cookie so much.\n\n* smart: 聰明的\n* active: 活潑好動的\n* windowsill: 窗台\n* red string: 紅色毛線繩"
    },
    "question": "Where does Cookie sleep at night?",
    "options": [
      "At the foot of Amy's bed",
      "Inside the kitchen closet",
      "On the living room sofa",
      "Under the dining table"
    ],
    "answer": 0,
    "explanation": "倒數第二句「Cookie sleeps quietly at the foot of Amy's bed（在 Amy 的床尾安靜睡覺）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p05-01",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 1,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g05",
    "passage": {
      "title": "【生活常識與健康】Good Morning Habits for School",
      "text": "Having healthy morning habits helps students study well at school.\nFirst, go to bed early and wake up at seven o'clock. Do not stay up late playing computer games.\nSecond, drink a warm cup of water, brush your teeth, and wash your face.\nThird, never skip breakfast! A good breakfast can give your body strong energy. You can eat bread, an egg, and drink a glass of fresh milk.\nFinally, pack your school bag and check your homework before leaving home.\nStart your day happily, and you will have a wonderful day at school!\n\n* habit: 習慣\n* energy: 活力/能量\n* pack: 整理/收拾\n* skip: 略過/不吃"
    },
    "question": "What time does the text suggest students wake up?",
    "options": [
      "At seven o'clock",
      "At eight thirty",
      "At six o'clock",
      "At nine o'clock"
    ],
    "answer": 0,
    "explanation": "文中「First, go to bed early and wake up at seven o'clock」，建議 7 點起床，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p05-02",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 2,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g05",
    "passage": {
      "title": "【生活常識與健康】Good Morning Habits for School",
      "text": "Having healthy morning habits helps students study well at school.\nFirst, go to bed early and wake up at seven o'clock. Do not stay up late playing computer games.\nSecond, drink a warm cup of water, brush your teeth, and wash your face.\nThird, never skip breakfast! A good breakfast can give your body strong energy. You can eat bread, an egg, and drink a glass of fresh milk.\nFinally, pack your school bag and check your homework before leaving home.\nStart your day happily, and you will have a wonderful day at school!\n\n* habit: 習慣\n* energy: 活力/能量\n* pack: 整理/收拾\n* skip: 略過/不吃"
    },
    "question": "What should students drink right after waking up?",
    "options": [
      "A warm cup of water",
      "Cold orange soda",
      "Hot black coffee",
      "Sweet apple juice"
    ],
    "answer": 0,
    "explanation": "文中「Second, drink a warm cup of water」，喝一杯溫水，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p05-03",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 3,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g05",
    "passage": {
      "title": "【生活常識與健康】Good Morning Habits for School",
      "text": "Having healthy morning habits helps students study well at school.\nFirst, go to bed early and wake up at seven o'clock. Do not stay up late playing computer games.\nSecond, drink a warm cup of water, brush your teeth, and wash your face.\nThird, never skip breakfast! A good breakfast can give your body strong energy. You can eat bread, an egg, and drink a glass of fresh milk.\nFinally, pack your school bag and check your homework before leaving home.\nStart your day happily, and you will have a wonderful day at school!\n\n* habit: 習慣\n* energy: 活力/能量\n* pack: 整理/收拾\n* skip: 略過/不吃"
    },
    "question": "Why is eating breakfast very important for students?",
    "options": [
      "It gives the body strong energy.",
      "It makes students sleepy.",
      "It takes a long time to cook.",
      "It is only for weekends."
    ],
    "answer": 0,
    "explanation": "文中「A good breakfast can give your body strong energy.（提供身體充沛活力）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p05-04",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 4,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g05",
    "passage": {
      "title": "【生活常識與健康】Good Morning Habits for School",
      "text": "Having healthy morning habits helps students study well at school.\nFirst, go to bed early and wake up at seven o'clock. Do not stay up late playing computer games.\nSecond, drink a warm cup of water, brush your teeth, and wash your face.\nThird, never skip breakfast! A good breakfast can give your body strong energy. You can eat bread, an egg, and drink a glass of fresh milk.\nFinally, pack your school bag and check your homework before leaving home.\nStart your day happily, and you will have a wonderful day at school!\n\n* habit: 習慣\n* energy: 活力/能量\n* pack: 整理/收拾\n* skip: 略過/不吃"
    },
    "question": "What should you check before leaving home for school?",
    "options": [
      "Pack your school bag and check your homework",
      "Watch a long movie on TV",
      "Play computer games for one hour",
      "Go back to sleep in bed"
    ],
    "answer": 0,
    "explanation": "第四點說明「pack your school bag and check your homework before leaving home」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p06-01",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 1,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g06",
    "passage": {
      "title": "【自然科學與天氣】The Four Seasons in Taiwan",
      "text": "There are four different seasons in a year: spring, summer, fall, and winter.\nIn spring, the weather becomes warm. Flowers bloom in the mountains, and green leaves grow on the trees.\nIn summer, it is sunny and hot. Children like to eat sweet watermelon and go swimming in the cool pool.\nIn fall, the wind is cool. It is the best season to fly kites and have picnics in the park.\nIn winter, it gets cold and windy. People wear warm sweaters, coats, and scarves when they go outside.\nWhich season do you like best?\n\n* season: 季節\n* bloom: 開花\n* sweater: 毛衣\n* scarf / scarves: 圍巾 (複數)"
    },
    "question": "What happens to the trees and flowers in spring?",
    "options": [
      "Flowers bloom and green leaves grow.",
      "All leaves turn brown and fall.",
      "Snow covers the tree branches.",
      "Trees stop growing completely."
    ],
    "answer": 0,
    "explanation": "文中描述春天「Flowers bloom in the mountains, and green leaves grow on the trees.」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p06-02",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 2,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g06",
    "passage": {
      "title": "【自然科學與天氣】The Four Seasons in Taiwan",
      "text": "There are four different seasons in a year: spring, summer, fall, and winter.\nIn spring, the weather becomes warm. Flowers bloom in the mountains, and green leaves grow on the trees.\nIn summer, it is sunny and hot. Children like to eat sweet watermelon and go swimming in the cool pool.\nIn fall, the wind is cool. It is the best season to fly kites and have picnics in the park.\nIn winter, it gets cold and windy. People wear warm sweaters, coats, and scarves when they go outside.\nWhich season do you like best?\n\n* season: 季節\n* bloom: 開花\n* sweater: 毛衣\n* scarf / scarves: 圍巾 (複數)"
    },
    "question": "What do children like to do during the hot summer?",
    "options": [
      "Eat sweet watermelon and go swimming",
      "Make a big snowman outside",
      "Wear thick heavy coats",
      "Sit near the fireplace"
    ],
    "answer": 0,
    "explanation": "夏天段落說明「Children like to eat sweet watermelon and go swimming in the cool pool.」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p06-03",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 3,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g06",
    "passage": {
      "title": "【自然科學與天氣】The Four Seasons in Taiwan",
      "text": "There are four different seasons in a year: spring, summer, fall, and winter.\nIn spring, the weather becomes warm. Flowers bloom in the mountains, and green leaves grow on the trees.\nIn summer, it is sunny and hot. Children like to eat sweet watermelon and go swimming in the cool pool.\nIn fall, the wind is cool. It is the best season to fly kites and have picnics in the park.\nIn winter, it gets cold and windy. People wear warm sweaters, coats, and scarves when they go outside.\nWhich season do you like best?\n\n* season: 季節\n* bloom: 開花\n* sweater: 毛衣\n* scarf / scarves: 圍巾 (複數)"
    },
    "question": "According to the text, what is a great outdoor activity for fall?",
    "options": [
      "Flying kites and having picnics",
      "Swimming in the ocean",
      "Wearing a swimming suit",
      "Staying in bed all day"
    ],
    "answer": 0,
    "explanation": "秋天段落「It is the best season to fly kites and have picnics in the park.」，放風箏與野餐，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-p06-04",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-passage",
    "serialNum": 4,
    "taskType": "R-COMP",
    "difficulty": 1,
    "groupId": "tme-read-g06",
    "passage": {
      "title": "【自然科學與天氣】The Four Seasons in Taiwan",
      "text": "There are four different seasons in a year: spring, summer, fall, and winter.\nIn spring, the weather becomes warm. Flowers bloom in the mountains, and green leaves grow on the trees.\nIn summer, it is sunny and hot. Children like to eat sweet watermelon and go swimming in the cool pool.\nIn fall, the wind is cool. It is the best season to fly kites and have picnics in the park.\nIn winter, it gets cold and windy. People wear warm sweaters, coats, and scarves when they go outside.\nWhich season do you like best?\n\n* season: 季節\n* bloom: 開花\n* sweater: 毛衣\n* scarf / scarves: 圍巾 (複數)"
    },
    "question": "What do people wear when it is cold in winter?",
    "options": [
      "Warm sweaters, coats, and scarves",
      "T-shirts and short pants",
      "Light summer dresses",
      "Swimwear and sunglasses"
    ],
    "answer": 0,
    "explanation": "冬天段落「People wear warm sweaters, coats, and scarves when they go outside.」，穿著毛衣、外套與圍巾，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-read-cloze-11",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-cloze",
    "serialNum": 11,
    "taskType": "R-CLOZE",
    "difficulty": 1,
    "passage": {
      "title": "【短文填空】Weekend at Grandma's House",
      "text": "On Saturday, Peter visits his grandma in the countryside. Grandma has a small pond behind her house. There are five yellow _______ swimming in the clean water.\n\n* countryside: 鄉村/鄉下"
    },
    "question": "依短文文意，空格處應填入哪一個單字？",
    "options": [
      "ducks",
      "desks",
      "books",
      "pens",
      "clocks",
      "cars"
    ],
    "answer": 0,
    "explanation": "在水池中（pond）游泳的水生動物為黃色小鴨（ducks），故選 (A) ducks。",
    "reviewed": true
  },
  {
    "id": "tme-read-cloze-12",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-cloze",
    "serialNum": 12,
    "taskType": "R-CLOZE",
    "difficulty": 1,
    "passage": {
      "title": "【生活短文填空】Making Fresh Fruit Salad",
      "text": "Mom is making fruit salad for lunch. She cuts some sweet apples, red strawberries, and yellow _______. It smells very delicious!\n\n* fruit salad: 水果沙拉\n* strawberry: 草莓"
    },
    "question": "依短文文意，空格處應填入哪一個單字？",
    "options": [
      "bananas",
      "shoes",
      "chairs",
      "bicycles",
      "notebooks",
      "rulers"
    ],
    "answer": 0,
    "explanation": "製作水果沙拉（fruit salad），空格需填黃色水果（yellow bananas），故選 (A) bananas。",
    "reviewed": true
  },
  {
    "id": "tme-read-cloze-13",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-cloze",
    "serialNum": 13,
    "taskType": "R-CLOZE",
    "difficulty": 1,
    "passage": {
      "title": "【生活短文填空】Music Class Performance",
      "text": "Today is Friday. The children have music class in the afternoon. Kelly sits straight and plays the _______ happily for the teacher.\n\n* performance: 表演\n* straight: 筆直地/端正地"
    },
    "question": "依短文文意，空格處應填入哪一個單字？",
    "options": [
      "piano",
      "pencil",
      "pizza",
      "park",
      "plane",
      "paper"
    ],
    "answer": 0,
    "explanation": "音樂課（music class）演奏的樂器為鋼琴（play the piano），故選 (A) piano。",
    "reviewed": true
  },
  {
    "id": "tme-read-cloze-14",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-cloze",
    "serialNum": 14,
    "taskType": "R-CLOZE",
    "difficulty": 1,
    "passage": {
      "title": "【生活短文填空】Sunny Day Sport",
      "text": "The sun is shining brightly today. Andy and his friends take a ball to the court after school. They love to play _______ together.\n\n* court: 球場\n* brightly: 明亮地"
    },
    "question": "依短文文意，空格處應填入哪一個單字？",
    "options": [
      "basketball",
      "breakfast",
      "bedroom",
      "bookstore",
      "bathroom",
      "bottle"
    ],
    "answer": 0,
    "explanation": "放學後在球場（court）玩的球類運動為籃球（play basketball），故選 (A) basketball。",
    "reviewed": true
  },
  {
    "id": "tme-read-cloze-15",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-cloze",
    "serialNum": 15,
    "taskType": "R-CLOZE",
    "difficulty": 1,
    "passage": {
      "title": "【生活短文填空】Bedtime Reminder",
      "text": "It is already nine thirty at night. Dad knocks on Tom's door and says, \"Tom, it is time to brush your _______ and go to sleep.\"\n\n* bedtime: 就寢時間\n* knock: 敲門"
    },
    "question": "依短文文意，空格處應填入哪一個單字？",
    "options": [
      "teeth",
      "shoes",
      "bags",
      "books",
      "desks",
      "chairs"
    ],
    "answer": 0,
    "explanation": "睡前衛生的固定片語為刷牙（brush your teeth），故選 (A) teeth。",
    "reviewed": true
  },
  {
    "id": "tme-read-cloze-16",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-cloze",
    "serialNum": 16,
    "taskType": "R-CLOZE",
    "difficulty": 1,
    "passage": {
      "title": "【生活短文填空】Visiting the Town Hospital",
      "text": "David has a fever and a bad cough today. His mother takes him to the town _______ to see a friendly doctor.\n\n* fever: 發燒\n* cough: 咳嗽"
    },
    "question": "依短文文意，空格處應填入哪一個單字？",
    "options": [
      "hospital",
      "playground",
      "supermarket",
      "bookstore",
      "bakery",
      "zoo"
    ],
    "answer": 0,
    "explanation": "生病看醫生（see a doctor）應前往醫院（hospital），故選 (A) hospital。",
    "reviewed": true
  },
  {
    "id": "tme-read-cloze-17",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-cloze",
    "serialNum": 17,
    "taskType": "R-CLOZE",
    "difficulty": 1,
    "passage": {
      "title": "【生活短文填空】Rainy Walk Home",
      "text": "Dark clouds fill the sky, and heavy rain starts to fall. Luckily, Jenny has a yellow _______ in her backpack, so she does not get wet.\n\n* luckily: 幸好/幸運地\n* get wet: 淋濕"
    },
    "question": "依短文文意，空格處應填入哪一個單字？",
    "options": [
      "umbrella",
      "pencil",
      "clock",
      "ruler",
      "eraser",
      "marker"
    ],
    "answer": 0,
    "explanation": "下大雨防止淋濕的隨身雨具為雨傘（umbrella），故選 (A) umbrella。",
    "reviewed": true
  },
  {
    "id": "tme-read-cloze-18",
    "track": "tme-preA1",
    "category": "reading",
    "subType": "read-cloze",
    "serialNum": 18,
    "taskType": "R-CLOZE",
    "difficulty": 1,
    "passage": {
      "title": "【在地生活填空】Wutai Mountain Trail",
      "text": "Grandpa takes Sam for a morning walk along the green mountain trail. They look up and see a big black _______ flying high in the blue sky.\n\n* trail: 步道/小徑\n* along: 沿著"
    },
    "question": "依短文文意，空格處應填入哪一個單字？",
    "options": [
      "bird",
      "fish",
      "dog",
      "pig",
      "rabbit",
      "cat"
    ],
    "answer": 0,
    "explanation": "在藍天中高高飛翔的動物為鳥類（bird flying high in the sky），故選 (A) bird。",
    "reviewed": true
  }
];
