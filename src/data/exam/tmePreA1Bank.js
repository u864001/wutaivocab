import { TME_PRE_A1_LISTENING_BANK } from './tmePreA1ListeningBank.js';
import { TME_PRE_A1_READING_BANK } from './tmePreA1ReadingBank.js';
/**
 * Test My English Pre-A1 官方模擬題庫 (Phase 3 擴充版 - 整合國小十大核心句型重組題庫)
 *
 * 涵蓋 Pre-A1 五大面向：
 * 1. 字彙 (vocab): 看字選圖 (8)、看圖選字 (8)、聽音選圖 (8)、聽音選字 (8) [共 32 題]
 * 2. 聽力 (listening): 看圖選句 (7)、聽對話選圖 (7)、選正確回應 (10)、聽對話答題 (10) [共 34 題]
 * 3. 閱讀 (reading): 看圖選字 (8)、看圖選句 (8)、是非判斷 (10)、短文填空 (10) [共 36 題]
 * 4. 寫作 (writing): 國小十大核心句型重組題庫 (各句型 6 題，共 60 題，立體磁吸積木) [共 60 題]
 * 5. 口說 (speaking): 單字朗讀 (6)、短句朗讀 (6)、長句朗讀 (4) [共 16 題]
 * 總計 178 題。
 *
 * 架構規範：
 * - 選擇題正解固定在 options[0] (A)，組卷時由學生端引擎自動執行 Fisher-Yates 隨機洗牌
 * - 全量支援「動態誘答項抽樣 (Dynamic Distractor Sampling)」：選擇題具備多答項池，組卷時動態抽樣
 * - 寫作題支援彩色立體磁吸單字積木 (3D Magnetic Word Blocks)
 */

import { TME_PRE_A1_SCRAMBLE_BANK, TME_SCRAMBLE_PATTERNS } from './tmePreA1ScrambleBank.js';


const NON_WRITING_ITEMS = [
  {
    "id": "tme-vocab-w2p-01",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-word2pic",
    "serialNum": 1,
    "taskType": "V-PIC",
    "difficulty": 1,
    "question": "看單字選出相符的物品線稿插圖：apple",
    "options": [
      "圖片 (A)",
      "圖片 (B)",
      "圖片 (C)",
      "圖片 (D)",
      "圖片 (E)",
      "圖片 (F)",
      "圖片 (G)"
    ],
    "optionImages": [
      "/assets/exam/preA1/apple.svg",
      "/assets/exam/preA1/banana.svg",
      "/assets/exam/preA1/orange.svg",
      "/assets/exam/preA1/grape.svg",
      "/assets/exam/preA1/cake.svg",
      "/assets/exam/preA1/bread.svg",
      "/assets/exam/preA1/cookie.svg"
    ],
    "answer": 0,
    "explanation": "英文「apple」意為蘋果，對應蘋果線稿插圖。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-w2p-02",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-word2pic",
    "serialNum": 2,
    "taskType": "V-PIC",
    "difficulty": 1,
    "question": "看單字選出相符的物品線稿插圖：pencil",
    "options": [
      "圖片 (A)",
      "圖片 (B)",
      "圖片 (C)",
      "圖片 (D)",
      "圖片 (E)",
      "圖片 (F)",
      "圖片 (G)"
    ],
    "optionImages": [
      "/assets/exam/preA1/pencil.svg",
      "/assets/exam/preA1/ruler.svg",
      "/assets/exam/preA1/book.svg",
      "/assets/exam/preA1/scissors.svg",
      "/assets/exam/preA1/eraser.svg",
      "/assets/exam/preA1/pen.svg",
      "/assets/exam/preA1/desk.svg"
    ],
    "answer": 0,
    "explanation": "英文「pencil」意為鉛筆，對應鉛筆線稿插圖。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-p2w-01",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-pic2word",
    "serialNum": 1,
    "taskType": "V-MEAN",
    "difficulty": 1,
    "question": "看題目線稿插圖，選出正確的英文單字：",
    "image": "/assets/exam/preA1/cat.svg",
    "options": [
      "cat",
      "dog",
      "pig",
      "bird",
      "rabbit",
      "elephant",
      "monkey"
    ],
    "answer": 0,
    "explanation": "插圖中為貓咪線稿，英文為「cat」。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-a2p-01",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-audio2pic",
    "serialNum": 1,
    "taskType": "L-PIC",
    "difficulty": 1,
    "media": {
      "audioText": "umbrella"
    },
    "question": "請聽語音，選出相符的物品線稿插圖：",
    "options": [
      "圖片 (A)",
      "圖片 (B)",
      "圖片 (C)",
      "圖片 (D)",
      "圖片 (E)",
      "圖片 (F)"
    ],
    "optionImages": [
      "/assets/exam/preA1/umbrella.svg",
      "/assets/exam/preA1/cap.svg",
      "/assets/exam/preA1/shoe.svg",
      "/assets/exam/preA1/jacket.svg",
      "/assets/exam/preA1/hat.svg",
      "/assets/exam/preA1/tshirt.svg"
    ],
    "answer": 0,
    "explanation": "聽力發音為「umbrella（雨傘）」，故選雨傘線稿插圖。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-a2w-01",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-audio2word",
    "serialNum": 1,
    "taskType": "L-WORD",
    "difficulty": 1,
    "media": {
      "audioText": "yellow"
    },
    "question": "請聽語音，選出拼寫正確的單字：",
    "options": [
      "yellow",
      "yallow",
      "yollow",
      "yellw",
      "yello",
      "yelow"
    ],
    "answer": 0,
    "explanation": "聽力發音為顏色「yellow（黃色）」，正確拼字為 y-e-l-l-o-w。",
    "reviewed": false
  },
  {
    "id": "tme-listen-p2s-01",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-pic2sent",
    "serialNum": 1,
    "taskType": "L-SENT",
    "difficulty": 1,
    "image": "/assets/exam/preA1/bicycle.svg",
    "media": {
      "audioText": "The boy is riding a bicycle in the park."
    },
    "question": "看情境線稿插圖並聽語音，選出描述正確的句子：",
    "options": [
      "The boy is riding a bicycle.",
      "The boy is swimming.",
      "The boy is sleeping.",
      "The boy is reading a book.",
      "The boy is running in the park.",
      "The boy is playing with a ball."
    ],
    "answer": 0,
    "explanation": "插圖為腳踏車，且聽力內容「The boy is riding a bicycle.（男孩正在騎腳踏車）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-d2p-01",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-dlg2pic",
    "serialNum": 1,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Girl: Where are you going, Peter? Boy: I am going to the library to read books."
    },
    "question": "聽對話，選出 Peter 前往地點相符的線稿插圖：",
    "options": [
      "圖片 (A)",
      "圖片 (B)",
      "圖片 (C)",
      "圖片 (D)",
      "圖片 (E)",
      "圖片 (F)"
    ],
    "optionImages": [
      "/assets/exam/preA1/library.svg",
      "/assets/exam/preA1/zoo.svg",
      "/assets/exam/preA1/playground.svg",
      "/assets/exam/preA1/restaurant.svg",
      "/assets/exam/preA1/park.svg",
      "/assets/exam/preA1/school.svg"
    ],
    "answer": 0,
    "explanation": "對話中 Peter 說「I am going to the library」，故前往地點為圖書館 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-resp-01",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-resp",
    "serialNum": 1,
    "taskType": "L-QA",
    "difficulty": 1,
    "media": {
      "audioText": "How are you doing today?"
    },
    "question": "請聽日常問句，選出最適當的回應句子：",
    "options": [
      "I'm fine, thank you.",
      "I'm ten years old.",
      "I like apples.",
      "It is a pen.",
      "My name is John.",
      "Yes, I do."
    ],
    "answer": 0,
    "explanation": "問句「How are you doing today?（你今天好嗎？）」，標準應答為「I’m fine, thank you.」。",
    "reviewed": true
  },
  {
    "id": "tme-listen-resp-02",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-resp",
    "serialNum": 2,
    "taskType": "L-QA",
    "difficulty": 1,
    "media": {
      "audioText": "What time is it now?"
    },
    "question": "請聽日常問句，選出最適當的回應句子：",
    "options": [
      "It is three thirty.",
      "It is on the table.",
      "I have three books.",
      "It is sunny today.",
      "It is very big.",
      "At the school gate."
    ],
    "answer": 0,
    "explanation": "問句「What time is it now?（現在幾點？）」，詢問時間應回答「It is three thirty.（現在三點半）」。",
    "reviewed": true
  },
  {
    "id": "tme-listen-resp-03",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-resp",
    "serialNum": 3,
    "taskType": "L-QA",
    "difficulty": 1,
    "media": {
      "audioText": "Nice to meet you, Linda."
    },
    "question": "請聽禮貌問候，選出最適當的回應句子：",
    "options": [
      "Nice to meet you, too.",
      "It is in your bag.",
      "It is five dollars.",
      "She is my sister.",
      "I can swim.",
      "He is ten years old."
],
    "answer": 0,
    "explanation": "初次見面問候「Nice to meet you.（很高興認識你）」，標準回應為「Nice to meet you, too.」。",
    "reviewed": true
  },
  {
    "id": "tme-listen-resp-04",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-resp",
    "serialNum": 4,
    "taskType": "L-QA",
    "difficulty": 2,
    "media": {
      "audioText": "Where is the post office, please?"
    },
    "question": "請聽問路問句，選出最適當的回應句子：",
    "options": [
      "It is next to the bookstore.",
      "Yes, I do.",
      "No, it isn't.",
      "I am a student.",
      "It is red.",
      "They are fine."
],
    "answer": 0,
    "explanation": "問句詢問郵局地點（Where is the post office?），應回答具體方位「It is next to the bookstore.（在書店隔壁）」。",
    "reviewed": true
  },
  {
    "id": "tme-listen-resp-05",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-resp",
    "serialNum": 5,
    "taskType": "L-QA",
    "difficulty": 1,
    "media": {
      "audioText": "Do you want some orange juice?"
    },
    "question": "請聽日常問句，選出最適當的回應句子：",
    "options": [
      "Yes, please. I am thirsty.",
      "It is blue.",
      "It is my brother's.",
      "I have two caps.",
      "It is on the desk.",
      "I like blue caps."
],
    "answer": 0,
    "explanation": "對方禮貌詢問「Do you want some orange juice?（要喝點柳橙汁嗎？）」，接受時回答「Yes, please. I am thirsty.（好的請給我，我很渴）」。",
    "reviewed": true
  },
  {
    "id": "tme-listen-resp-06",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-resp",
    "serialNum": 6,
    "taskType": "L-QA",
    "difficulty": 2,
    "media": {
      "audioText": "Whose jacket is this on the chair?"
    },
    "question": "請聽日常問句，選出最適當的回應句子：",
    "options": [
      "It is Tony's jacket.",
      "Yes, I can.",
      "Yes, I am.",
      "No, they don't.",
      "I like swimming.",
      "It is five o'clock."
],
    "answer": 0,
    "explanation": "問句使用 Whose（誰的）詢問夾克所有權，回答應為所有格「It is Tony's jacket.（那是東尼的外套）」。",
    "reviewed": true
  },
  {
    "id": "tme-listen-qa-01",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-conv-qa",
    "serialNum": 1,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Mom: Do you want some milk, Tom? Tom: No, thank you, Mom. I want some water. Question: What does Tom want?"
    },
    "question": "聽對話，回答問題：What does Tom want?",
    "options": [
      "Water",
      "Milk",
      "Juice",
      "Tea",
      "Coffee",
      "Soda"
    ],
    "answer": 0,
    "explanation": "Tom 回答「I want some water」，故 Tom 想要水。",
    "reviewed": true
  },
  {
    "id": "tme-listen-qa-02",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-conv-qa",
    "serialNum": 2,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Boy: Where are you going, Kelly? Girl: I am going to the zoo to see the pandas. Question: Where is Kelly going?"
    },
    "question": "聽對話，回答問題：Where is Kelly going?",
    "options": [
      "The zoo",
      "The park",
      "The school",
      "The museum",
      "The library",
      "The hospital"
    ],
    "answer": 0,
    "explanation": "對話中 Kelly 清楚表示「I am going to the zoo to see the pandas」，故前往動物園。",
    "reviewed": true
  },
  {
    "id": "tme-listen-qa-03",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-conv-qa",
    "serialNum": 3,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Girl: How much is that red pencil box? Clerk: It is sixty dollars. Question: How much is the pencil box?"
    },
    "question": "聽對話，回答問題：How much is the pencil box?",
    "options": [
      "Sixty dollars",
      "The elephant",
      "The rabbit",
      "The monkey",
      "Sixteen dollars",
      "Six dollars"
],
    "answer": 0,
    "explanation": "店員回答「It is sixty dollars.（60元）」，故選 (A) Sixty dollars。",
    "reviewed": true
  },
  {
    "id": "tme-listen-qa-04",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-conv-qa",
    "serialNum": 4,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Dad: How do you go to school today, Andy? Andy: I ride my bicycle with Peter. Question: How does Andy go to school?"
    },
    "question": "聽對話，回答問題：How does Andy go to school?",
    "options": [
      "By bicycle",
      "At eight ten",
      "By bus",
      "On foot",
      "By car",
      "By train"
],
    "answer": 0,
    "explanation": "Andy 回答「I ride my bicycle with Peter」，交通方式為騎腳踏車（By bicycle），故選 (A)。",
    "reviewed": false
  },
  {
    "id": "tme-listen-qa-05",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-conv-qa",
    "serialNum": 5,
    "taskType": "L-CONV",
    "difficulty": 1,
    "media": {
      "audioText": "Teacher: What day is today, class? Students: Today is Wednesday! Question: What day is today?"
    },
    "question": "聽對話，回答問題：What day is today?",
    "options": [
      "Wednesday",
      "Three",
      "Monday",
      "Friday",
      "Sunday",
      "Thursday"
],
    "answer": 0,
    "explanation": "全班回答「Today is Wednesday!（今天星期三）」，故選 (A) Wednesday。",
    "reviewed": true
  },
  {
    "id": "tme-listen-qa-06",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-conv-qa",
    "serialNum": 6,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Girl: Is your father a doctor, Ben? Boy: No, he is a bus driver. Question: What is Ben's father?"
    },
    "question": "聽對話，回答問題：What is Ben's father?",
    "options": [
      "A bus driver",
      "Cooking dinner",
      "A doctor",
      "A teacher",
      "A cook",
      "A police officer"
],
    "answer": 0,
    "explanation": "Ben 明確說明「No, he is a bus driver.（不，他是一位公車司機）」，故選 (A) A bus driver。",
    "reviewed": true
  },
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
    "reviewed": false
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
    "reviewed": false
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
    "reviewed": false
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
    "reviewed": false
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
    "reviewed": false
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
    "id": "tme-speak-w-01",
    "track": "tme-preA1",
    "category": "speaking",
    "subType": "speak-word",
    "serialNum": 1,
    "taskType": "S-WORD",
    "difficulty": 1,
    "media": {
      "audioText": "Good morning"
    },
    "targetText": "Good morning",
    "question": "【單字片語朗讀】請看螢幕文字並清晰朗讀：Good morning",
    "options": [
      "朗讀標的：Good morning (早安)"
    ],
    "answer": 0,
    "explanation": "測驗打招呼常見片語發音清晰度與語調。",
    "reviewed": true
  },
  {
    "id": "tme-speak-s-01",
    "track": "tme-preA1",
    "category": "speaking",
    "subType": "speak-short",
    "serialNum": 1,
    "taskType": "S-SENT",
    "difficulty": 1,
    "media": {
      "audioText": "What is your name?"
    },
    "targetText": "What is your name?",
    "question": "【短句朗讀】請看日常問句並自然朗讀：What is your name?",
    "options": [
      "朗讀標的：What is your name? (你叫什麼名字？)"
    ],
    "answer": 0,
    "explanation": "測驗疑問句語調（Wh-問句句尾降調）。",
    "reviewed": true
  },
  {
    "id": "tme-speak-l-01",
    "track": "tme-preA1",
    "category": "speaking",
    "subType": "speak-long",
    "serialNum": 1,
    "taskType": "S-SENT",
    "difficulty": 2,
    "media": {
      "audioText": "I like to play basketball with my friends on Sunday."
    },
    "targetText": "I like to play basketball with my friends on Sunday.",
    "question": "【長句朗讀】請注意斷句與連音，完整朗讀：I like to play basketball with my friends on Sunday.",
    "options": [
      "朗讀標的：I like to play basketball with my friends on Sunday."
    ],
    "answer": 0,
    "explanation": "測驗連貫朗讀、動詞片語與時間副詞連音。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-w2p-03",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-word2pic",
    "serialNum": 3,
    "taskType": "V-PIC",
    "difficulty": 1,
    "question": "看英文單字「cake」，選出正確的物品線稿插圖：",
    "options": [
      "圖片 (A)",
      "圖片 (B)",
      "圖片 (C)",
      "圖片 (D)",
      "圖片 (E)",
      "圖片 (F)",
      "圖片 (G)"
    ],
    "optionImages": [
      "/assets/exam/preA1/cake.svg",
      "/assets/exam/preA1/bread.svg",
      "/assets/exam/preA1/cookie.svg",
      "/assets/exam/preA1/pizza.svg",
      "/assets/exam/preA1/apple.svg",
      "/assets/exam/preA1/banana.svg",
      "/assets/exam/preA1/orange.svg"
    ],
    "answer": 0,
    "explanation": "英文「cake」中文為「蛋糕」，故選圖片 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-w2p-04",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-word2pic",
    "serialNum": 4,
    "taskType": "V-PIC",
    "difficulty": 1,
    "question": "看英文單字「rabbit」，選出正確的動物線稿插圖：",
    "options": [
      "圖片 (A)",
      "圖片 (B)",
      "圖片 (C)",
      "圖片 (D)",
      "圖片 (E)",
      "圖片 (F)",
      "圖片 (G)"
    ],
    "optionImages": [
      "/assets/exam/preA1/rabbit.svg",
      "/assets/exam/preA1/bear.svg",
      "/assets/exam/preA1/elephant.svg",
      "/assets/exam/preA1/monkey.svg",
      "/assets/exam/preA1/cat.svg",
      "/assets/exam/preA1/dog.svg",
      "/assets/exam/preA1/duck.svg"
    ],
    "answer": 0,
    "explanation": "英文「rabbit」為長耳朵的「兔子」，故選圖片 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-w2p-05",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-word2pic",
    "serialNum": 5,
    "taskType": "V-PIC",
    "difficulty": 1,
    "question": "看英文單字「desk」，選出正確的物品線稿插圖：",
    "options": [
      "圖片 (A)",
      "圖片 (B)",
      "圖片 (C)",
      "圖片 (D)",
      "圖片 (E)",
      "圖片 (F)",
      "圖片 (G)"
    ],
    "optionImages": [
      "/assets/exam/preA1/desk.svg",
      "/assets/exam/preA1/chair.svg",
      "/assets/exam/preA1/bag.svg",
      "/assets/exam/preA1/book.svg",
      "/assets/exam/preA1/pencil.svg",
      "/assets/exam/preA1/ruler.svg",
      "/assets/exam/preA1/pen.svg"
    ],
    "answer": 0,
    "explanation": "英文「desk」為學校教室裡的「書桌/課桌」，故選圖片 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-w2p-06",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-word2pic",
    "serialNum": 6,
    "taskType": "V-PIC",
    "difficulty": 1,
    "question": "看英文單字「bus」，選出正確的交通工具線稿插圖：",
    "options": [
      "圖片 (A)",
      "圖片 (B)",
      "圖片 (C)",
      "圖片 (D)",
      "圖片 (E)",
      "圖片 (F)",
      "圖片 (G)"
    ],
    "optionImages": [
      "/assets/exam/preA1/bus.svg",
      "/assets/exam/preA1/car.svg",
      "/assets/exam/preA1/train.svg",
      "/assets/exam/preA1/boat.svg",
      "/assets/exam/preA1/bicycle.svg",
      "/assets/exam/preA1/park.svg",
      "/assets/exam/preA1/playground.svg"
    ],
    "answer": 0,
    "explanation": "英文「bus」為大眾運輸工具「公車/巴士」，故選圖片 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-w2p-07",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-word2pic",
    "serialNum": 7,
    "taskType": "V-PIC",
    "difficulty": 1,
    "question": "看英文單字「milk」，選出正確的飲品線稿插圖：",
    "options": [
      "圖片 (A)",
      "圖片 (B)",
      "圖片 (C)",
      "圖片 (D)",
      "圖片 (E)",
      "圖片 (F)",
      "圖片 (G)"
    ],
    "optionImages": [
      "/assets/exam/preA1/milk.svg",
      "/assets/exam/preA1/water.svg",
      "/assets/exam/preA1/orange.svg",
      "/assets/exam/preA1/apple.svg",
      "/assets/exam/preA1/cake.svg",
      "/assets/exam/preA1/bread.svg",
      "/assets/exam/preA1/egg.svg"
    ],
    "answer": 0,
    "explanation": "英文「milk」為白色飲品「牛奶」，故選圖片 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-w2p-08",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-word2pic",
    "serialNum": 8,
    "taskType": "V-PIC",
    "difficulty": 1,
    "question": "看英文單字「fish」，選出正確的動物線稿插圖：",
    "options": [
      "圖片 (A)",
      "圖片 (B)",
      "圖片 (C)",
      "圖片 (D)",
      "圖片 (E)",
      "圖片 (F)",
      "圖片 (G)"
    ],
    "optionImages": [
      "/assets/exam/preA1/fish.svg",
      "/assets/exam/preA1/duck.svg",
      "/assets/exam/preA1/bird.svg",
      "/assets/exam/preA1/pig.svg",
      "/assets/exam/preA1/cat.svg",
      "/assets/exam/preA1/dog.svg",
      "/assets/exam/preA1/rabbit.svg"
    ],
    "answer": 0,
    "explanation": "英文「fish」為水裡游的「魚」，故選圖片 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-p2w-02",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-pic2word",
    "serialNum": 2,
    "taskType": "V-MEAN",
    "difficulty": 1,
    "question": "看題目線稿插圖，選出正確的英文單字：",
    "image": "/assets/exam/preA1/dog.svg",
    "options": [
      "dog",
      "cat",
      "pig",
      "duck",
      "rabbit",
      "bear",
      "fish"
    ],
    "answer": 0,
    "explanation": "插圖中為小狗線稿，英文單字為「dog」。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-p2w-03",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-pic2word",
    "serialNum": 3,
    "taskType": "V-MEAN",
    "difficulty": 1,
    "question": "看題目線稿插圖，選出正確的英文單字：",
    "image": "/assets/exam/preA1/elephant.svg",
    "options": [
      "elephant",
      "monkey",
      "bear",
      "rabbit",
      "cat",
      "dog",
      "duck"
    ],
    "answer": 0,
    "explanation": "插圖中為大耳朵長鼻子的大象線稿，英文為「elephant」。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-p2w-04",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-pic2word",
    "serialNum": 4,
    "taskType": "V-MEAN",
    "difficulty": 1,
    "question": "看題目線稿插圖，選出正確的英文單字：",
    "image": "/assets/exam/preA1/chair.svg",
    "options": [
      "chair",
      "desk",
      "bed",
      "sofa",
      "door",
      "clock",
      "box"
    ],
    "answer": 0,
    "explanation": "插圖為附帶靠背的椅子線稿，英文為「chair」。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-p2w-05",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-pic2word",
    "serialNum": 5,
    "taskType": "V-MEAN",
    "difficulty": 1,
    "question": "看題目線稿插圖，選出正確的英文單字：",
    "image": "/assets/exam/preA1/car.svg",
    "options": [
      "car",
      "bus",
      "train",
      "boat",
      "bike",
      "truck",
      "plane"
    ],
    "answer": 0,
    "explanation": "插圖為小客車線稿，英文為「car」。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-p2w-06",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-pic2word",
    "serialNum": 6,
    "taskType": "V-MEAN",
    "difficulty": 1,
    "question": "看題目線稿插圖，選出正確的英文單字：",
    "image": "/assets/exam/preA1/duck.svg",
    "options": [
      "duck",
      "bird",
      "pig",
      "cat",
      "dog",
      "rabbit",
      "fish"
    ],
    "answer": 0,
    "explanation": "插圖為浮在水上的扁嘴小鴨線稿，英文為「duck」。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-p2w-07",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-pic2word",
    "serialNum": 7,
    "taskType": "V-MEAN",
    "difficulty": 1,
    "question": "看題目線稿插圖，選出正確的英文單字：",
    "image": "/assets/exam/preA1/eraser.svg",
    "options": [
      "eraser",
      "pencil",
      "ruler",
      "scissors",
      "pen",
      "book",
      "bag"
    ],
    "answer": 0,
    "explanation": "插圖為削斜角擦拭用的橡皮擦，英文為「eraser」。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-p2w-08",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-pic2word",
    "serialNum": 8,
    "taskType": "V-MEAN",
    "difficulty": 1,
    "question": "看題目線稿插圖，選出正確的英文單字：",
    "image": "/assets/exam/preA1/pizza.svg",
    "options": [
      "pizza",
      "cake",
      "bread",
      "cookie",
      "egg",
      "milk",
      "ice cream"
    ],
    "answer": 0,
    "explanation": "插圖為切片帶起司與香腸片的披薩線稿，英文為「pizza」。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-a2p-02",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-audio2pic",
    "serialNum": 2,
    "taskType": "L-PIC",
    "difficulty": 1,
    "media": {
      "audioText": "bear"
    },
    "question": "請聽語音，選出相符的動物線稿插圖：",
    "options": [
      "圖片 (A)",
      "圖片 (B)",
      "圖片 (C)",
      "圖片 (D)",
      "圖片 (E)",
      "圖片 (F)",
      "圖片 (G)"
    ],
    "optionImages": [
      "/assets/exam/preA1/bear.svg",
      "/assets/exam/preA1/dog.svg",
      "/assets/exam/preA1/cat.svg",
      "/assets/exam/preA1/rabbit.svg",
      "/assets/exam/preA1/elephant.svg",
      "/assets/exam/preA1/monkey.svg",
      "/assets/exam/preA1/duck.svg"
    ],
    "answer": 0,
    "explanation": "語音播放「bear（熊）」，故選圖片 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-a2p-03",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-audio2pic",
    "serialNum": 3,
    "taskType": "L-PIC",
    "difficulty": 1,
    "media": {
      "audioText": "pen"
    },
    "question": "請聽語音，選出相符的文具線稿插圖：",
    "options": [
      "圖片 (A)",
      "圖片 (B)",
      "圖片 (C)",
      "圖片 (D)",
      "圖片 (E)",
      "圖片 (F)",
      "圖片 (G)"
    ],
    "optionImages": [
      "/assets/exam/preA1/pen.svg",
      "/assets/exam/preA1/pencil.svg",
      "/assets/exam/preA1/ruler.svg",
      "/assets/exam/preA1/eraser.svg",
      "/assets/exam/preA1/scissors.svg",
      "/assets/exam/preA1/book.svg",
      "/assets/exam/preA1/bag.svg"
    ],
    "answer": 0,
    "explanation": "語音播放「pen（原子筆）」，故選圖片 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-a2p-04",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-audio2pic",
    "serialNum": 4,
    "taskType": "L-PIC",
    "difficulty": 1,
    "media": {
      "audioText": "train"
    },
    "question": "請聽語音，選出相符的交通工具線稿插圖：",
    "options": [
      "圖片 (A)",
      "圖片 (B)",
      "圖片 (C)",
      "圖片 (D)",
      "圖片 (E)",
      "圖片 (F)",
      "圖片 (G)"
    ],
    "optionImages": [
      "/assets/exam/preA1/train.svg",
      "/assets/exam/preA1/bus.svg",
      "/assets/exam/preA1/car.svg",
      "/assets/exam/preA1/bicycle.svg",
      "/assets/exam/preA1/boat.svg",
      "/assets/exam/preA1/park.svg",
      "/assets/exam/preA1/playground.svg"
    ],
    "answer": 0,
    "explanation": "語音播放「train（火車）」，故選圖片 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-a2p-05",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-audio2pic",
    "serialNum": 5,
    "taskType": "L-PIC",
    "difficulty": 1,
    "media": {
      "audioText": "hat"
    },
    "question": "請聽語音，選出相符的服飾線稿插圖：",
    "options": [
      "圖片 (A)",
      "圖片 (B)",
      "圖片 (C)",
      "圖片 (D)",
      "圖片 (E)",
      "圖片 (F)",
      "圖片 (G)"
    ],
    "optionImages": [
      "/assets/exam/preA1/hat.svg",
      "/assets/exam/preA1/cap.svg",
      "/assets/exam/preA1/shoe.svg",
      "/assets/exam/preA1/jacket.svg",
      "/assets/exam/preA1/tshirt.svg",
      "/assets/exam/preA1/umbrella.svg",
      "/assets/exam/preA1/bag.svg"
    ],
    "answer": 0,
    "explanation": "語音播放「hat（寬緣帽子）」，故選圖片 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-a2p-06",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-audio2pic",
    "serialNum": 6,
    "taskType": "L-PIC",
    "difficulty": 1,
    "media": {
      "audioText": "cookie"
    },
    "question": "請聽語音，選出相符的食物線稿插圖：",
    "options": [
      "圖片 (A)",
      "圖片 (B)",
      "圖片 (C)",
      "圖片 (D)",
      "圖片 (E)",
      "圖片 (F)",
      "圖片 (G)"
    ],
    "optionImages": [
      "/assets/exam/preA1/cookie.svg",
      "/assets/exam/preA1/cake.svg",
      "/assets/exam/preA1/bread.svg",
      "/assets/exam/preA1/pizza.svg",
      "/assets/exam/preA1/milk.svg",
      "/assets/exam/preA1/egg.svg",
      "/assets/exam/preA1/apple.svg"
    ],
    "answer": 0,
    "explanation": "語音播放「cookie（餅乾）」，故選圖片 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-a2p-07",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-audio2pic",
    "serialNum": 7,
    "taskType": "L-PIC",
    "difficulty": 1,
    "media": {
      "audioText": "boat"
    },
    "question": "請聽語音，選出相符的水上交通線稿插圖：",
    "options": [
      "圖片 (A)",
      "圖片 (B)",
      "圖片 (C)",
      "圖片 (D)",
      "圖片 (E)",
      "圖片 (F)",
      "圖片 (G)"
    ],
    "optionImages": [
      "/assets/exam/preA1/boat.svg",
      "/assets/exam/preA1/bicycle.svg",
      "/assets/exam/preA1/car.svg",
      "/assets/exam/preA1/bus.svg",
      "/assets/exam/preA1/train.svg",
      "/assets/exam/preA1/park.svg",
      "/assets/exam/preA1/playground.svg"
    ],
    "answer": 0,
    "explanation": "語音播放「boat（小船/帆船）」，故選圖片 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-a2p-08",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-audio2pic",
    "serialNum": 8,
    "taskType": "L-PIC",
    "difficulty": 1,
    "media": {
      "audioText": "bag"
    },
    "question": "請聽語音，選出相符的隨身物品線稿插圖：",
    "options": [
      "圖片 (A)",
      "圖片 (B)",
      "圖片 (C)",
      "圖片 (D)",
      "圖片 (E)",
      "圖片 (F)",
      "圖片 (G)"
    ],
    "optionImages": [
      "/assets/exam/preA1/bag.svg",
      "/assets/exam/preA1/book.svg",
      "/assets/exam/preA1/desk.svg",
      "/assets/exam/preA1/chair.svg",
      "/assets/exam/preA1/pencil.svg",
      "/assets/exam/preA1/ruler.svg",
      "/assets/exam/preA1/pen.svg"
    ],
    "answer": 0,
    "explanation": "語音播放「bag（書包/袋子）」，故選圖片 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-a2w-02",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-audio2word",
    "serialNum": 2,
    "taskType": "L-WORD",
    "difficulty": 1,
    "media": {
      "audioText": "green"
    },
    "question": "請聽語音，選出拼寫正確的顏色單字：",
    "options": [
      "green",
      "greeen",
      "grin",
      "gren",
      "grene",
      "gean"
    ],
    "answer": 0,
    "explanation": "聽力發音為「green（綠色）」，正確拼字為 g-r-e-e-n。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-a2w-03",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-audio2word",
    "serialNum": 3,
    "taskType": "L-WORD",
    "difficulty": 1,
    "media": {
      "audioText": "blue"
    },
    "question": "請聽語音，選出拼寫正確的顏色單字：",
    "options": [
      "blue",
      "bleu",
      "bloo",
      "blu",
      "blew",
      "bolue"
],
    "answer": 0,
    "explanation": "聽力發音為「blue（藍色）」，正確拼字為 b-l-u-e。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-a2w-04",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-audio2word",
    "serialNum": 4,
    "taskType": "L-WORD",
    "difficulty": 1,
    "media": {
      "audioText": "ruler"
    },
    "question": "請聽語音，選出拼寫正確的文具單字：",
    "options": [
      "ruler",
      "rular",
      "rouler",
      "ruller",
      "rulor",
      "rurle"
],
    "answer": 0,
    "explanation": "聽力發音為「ruler（直尺）」，正確拼字為 r-u-l-e-r。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-a2w-05",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-audio2word",
    "serialNum": 5,
    "taskType": "L-WORD",
    "difficulty": 1,
    "media": {
      "audioText": "pencil"
    },
    "question": "請聽語音，選出拼寫正確的文具單字：",
    "options": [
      "pencil",
      "pensil",
      "pencel",
      "pencle",
      "pensle",
      "pincil"
],
    "answer": 0,
    "explanation": "聽力發音為「pencil（鉛筆）」，正確拼字為 p-e-n-c-i-l。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-a2w-06",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-audio2word",
    "serialNum": 6,
    "taskType": "L-WORD",
    "difficulty": 1,
    "media": {
      "audioText": "bread"
    },
    "question": "請聽語音，選出拼寫正確的食物單字：",
    "options": [
      "bread",
      "bred",
      "braed",
      "breed",
      "briad",
      "brede"
],
    "answer": 0,
    "explanation": "聽力發音為「bread（麵包）」，正確拼字為 b-r-e-a-d。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-a2w-07",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-audio2word",
    "serialNum": 7,
    "taskType": "L-WORD",
    "difficulty": 1,
    "media": {
      "audioText": "water"
    },
    "question": "請聽語音，選出拼寫正確的飲品單字：",
    "options": [
      "water",
      "watar",
      "woter",
      "watter",
      "wator",
      "wateur"
],
    "answer": 0,
    "explanation": "聽力發音為「water（水）」，正確拼字為 w-a-t-e-r。",
    "reviewed": true
  },
  {
    "id": "tme-vocab-a2w-08",
    "track": "tme-preA1",
    "category": "vocab",
    "subType": "vocab-audio2word",
    "serialNum": 8,
    "taskType": "L-WORD",
    "difficulty": 1,
    "media": {
      "audioText": "chair"
    },
    "question": "請聽語音，選出拼寫正確的家具單字：",
    "options": [
      "chair",
      "chare",
      "cheir",
      "chiar",
      "chaer",
      "char"
],
    "answer": 0,
    "explanation": "聽力發音為「chair（椅子）」，正確拼字為 c-h-a-i-r。",
    "reviewed": true
  },
  {
    "id": "tme-listen-p2s-02",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-pic2sent",
    "serialNum": 2,
    "taskType": "L-SENT",
    "difficulty": 1,
    "image": "/assets/exam/preA1/dog.svg",
    "media": {
      "audioText": "The cute dog is sitting on the floor."
    },
    "question": "看情境線稿插圖並聽語音，選出描述正確的句子：",
    "options": [
      "The cute dog is sitting.",
      "The cat is climbing a tree.",
      "The bird is flying.",
      "The duck is swimming.",
      "The dog is barking loudly.",
      "The dog is chasing a ball."
    ],
    "answer": 0,
    "explanation": "插圖為小狗坐在地上，聽力敘述為「The cute dog is sitting...」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-p2s-03",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-pic2sent",
    "serialNum": 3,
    "taskType": "L-SENT",
    "difficulty": 1,
    "image": "/assets/exam/preA1/bus.svg",
    "media": {
      "audioText": "The yellow school bus is stopping here."
    },
    "question": "看情境線稿插圖並聽語音，選出描述正確的句子：",
    "options": [
      "The yellow school bus is stopping here.",
      "The children are studying at school.",
      "The boy is riding a blue bicycle.",
      "The white boat is in the water.",
      "The cute dog is sleeping.",
      "The girl is eating a red apple."
],
    "answer": 0,
    "explanation": "插圖為校車公車，聽力為「The yellow school bus is stopping here.（黃色校車停在這邊）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-p2s-04",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-pic2sent",
    "serialNum": 4,
    "taskType": "L-SENT",
    "difficulty": 1,
    "image": "/assets/exam/preA1/cake.svg",
    "media": {
      "audioText": "There are three candles on the birthday cake."
    },
    "question": "看情境線稿插圖並聽語音，選出描述正確的句子：",
    "options": [
      "There are three candles on the birthday cake.",
      "The girl is eating a delicious apple.",
      "The boy is playing with a toy car.",
      "The students are reading in the library.",
      "The dog is running in the park.",
      "The yellow bus is driving fast."
],
    "answer": 0,
    "explanation": "插圖為生日蛋糕，聽力內容「There are three candles on the birthday cake.（生日蛋糕上有三支蠟燭）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-p2s-05",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-pic2sent",
    "serialNum": 5,
    "taskType": "L-SENT",
    "difficulty": 1,
    "image": "/assets/exam/preA1/park.svg",
    "media": {
      "audioText": "There is a bench under the green tree in the park."
    },
    "question": "看情境線稿插圖並聽語音，選出描述正確的句子：",
    "options": [
      "There is a bench under the green tree in the park.",
      "The family is visiting the animals in the zoo.",
      "The children are having lunch at home.",
      "The boy is washing his bicycle.",
      "The cat is sleeping on the sofa.",
      "The students are singing in the classroom."
],
    "answer": 0,
    "explanation": "插圖為公園與長椅，聽力「There is a bench under the green tree in the park.（公園裡的綠樹下有一張長椅）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-p2s-06",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-pic2sent",
    "serialNum": 6,
    "taskType": "L-SENT",
    "difficulty": 1,
    "image": "/assets/exam/preA1/fish.svg",
    "media": {
      "audioText": "The small fish is swimming happily in the water."
    },
    "question": "看情境線稿插圖並聽語音，選出描述正確的句子：",
    "options": [
      "The small fish is swimming happily in the water.",
      "The yellow bus is stopping on the road.",
      "The girl is writing with a pencil.",
      "The mother is cooking in the kitchen.",
      "The birds are flying in the sky.",
      "The boy is reading a book under the tree."
],
    "answer": 0,
    "explanation": "插圖為水裡的小魚，聽力「The small fish is swimming happily in the water.（小魚在水裡開心地游著）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-p2s-07",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-pic2sent",
    "serialNum": 7,
    "taskType": "L-SENT",
    "difficulty": 1,
    "image": "/assets/exam/preA1/boat.svg",
    "media": {
      "audioText": "A white sailboat is floating on the blue sea."
    },
    "question": "看情境線稿插圖並聽語音，選出描述正確的句子：",
    "options": [
      "A white sailboat is floating on the blue sea.",
      "The girl is reading books in the library.",
      "The children are eating cake at the party.",
      "The cat is playing with a ball.",
      "The teacher is writing on the blackboard.",
      "The students are running in the gym."
],
    "answer": 0,
    "explanation": "插圖為帆船小艇，聽力「A white sailboat is floating on the blue sea.（一艘白色帆船漂浮在藍色海面上）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-d2p-02",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-dlg2pic",
    "serialNum": 2,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Mom: What do you want for breakfast, Tom? Tom: I want some milk and bread, please."
    },
    "question": "聽對話，選出 Tom 早餐想要的食物線稿插圖：",
    "options": [
      "圖片 (A)",
      "圖片 (B)",
      "圖片 (C)",
      "圖片 (D)",
      "圖片 (E)",
      "圖片 (F)",
      "圖片 (G)"
    ],
    "optionImages": [
      "/assets/exam/preA1/bread.svg",
      "/assets/exam/preA1/pizza.svg",
      "/assets/exam/preA1/cookie.svg",
      "/assets/exam/preA1/cake.svg",
      "/assets/exam/preA1/egg.svg",
      "/assets/exam/preA1/milk.svg",
      "/assets/exam/preA1/apple.svg"
    ],
    "answer": 0,
    "explanation": "Tom 回答「I want some milk and bread」，對應麵包吐司線稿圖片 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-d2p-03",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-dlg2pic",
    "serialNum": 3,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Girl: Where are we going today, Dad? Dad: Let us go to the zoo to see monkeys and bears!"
    },
    "question": "聽對話，選出爸爸提議前往的地點線稿插圖：",
    "options": [
      "圖片 (A)",
      "圖片 (B)",
      "圖片 (C)",
      "圖片 (D)",
      "圖片 (E)",
      "圖片 (F)"
    ],
    "optionImages": [
      "/assets/exam/preA1/zoo.svg",
      "/assets/exam/preA1/library.svg",
      "/assets/exam/preA1/school.svg",
      "/assets/exam/preA1/restaurant.svg",
      "/assets/exam/preA1/park.svg",
      "/assets/exam/preA1/playground.svg"
    ],
    "answer": 0,
    "explanation": "爸爸回答「Let us go to the zoo」，前往動物園，對應動物園拱門圖片 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-d2p-04",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-dlg2pic",
    "serialNum": 4,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Teacher: What animal do you like, Andy? Andy: I like the big elephant with a long nose."
    },
    "question": "聽對話，選出 Andy 喜歡的動物線稿插圖：",
    "options": [
      "圖片 (A)",
      "圖片 (B)",
      "圖片 (C)",
      "圖片 (D)",
      "圖片 (E)",
      "圖片 (F)",
      "圖片 (G)"
    ],
    "optionImages": [
      "/assets/exam/preA1/elephant.svg",
      "/assets/exam/preA1/rabbit.svg",
      "/assets/exam/preA1/pig.svg",
      "/assets/exam/preA1/duck.svg",
      "/assets/exam/preA1/bear.svg",
      "/assets/exam/preA1/monkey.svg",
      "/assets/exam/preA1/cat.svg"
    ],
    "answer": 0,
    "explanation": "Andy 說「I like the big elephant」，故選大象插圖 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-d2p-05",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-dlg2pic",
    "serialNum": 5,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Girl: What did you buy at the bookstore? Boy: I bought a new blue eraser for my English class."
    },
    "question": "聽對話，選出男孩在書店購買的文具線稿插圖：",
    "options": [
      "圖片 (A)",
      "圖片 (B)",
      "圖片 (C)",
      "圖片 (D)",
      "圖片 (E)",
      "圖片 (F)",
      "圖片 (G)"
    ],
    "optionImages": [
      "/assets/exam/preA1/eraser.svg",
      "/assets/exam/preA1/pencil.svg",
      "/assets/exam/preA1/ruler.svg",
      "/assets/exam/preA1/scissors.svg",
      "/assets/exam/preA1/pen.svg",
      "/assets/exam/preA1/book.svg",
      "/assets/exam/preA1/bag.svg"
    ],
    "answer": 0,
    "explanation": "男孩說「I bought a new blue eraser」，故選橡皮擦圖片 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-d2p-06",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-dlg2pic",
    "serialNum": 6,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Mom: Don not forget to wear your jacket, Peter. Peter: Okay, Mom. I will put it on now."
    },
    "question": "聽對話，選出媽媽提醒 Peter 穿上的衣物線稿插圖：",
    "options": [
      "圖片 (A)",
      "圖片 (B)",
      "圖片 (C)",
      "圖片 (D)",
      "圖片 (E)",
      "圖片 (F)"
    ],
    "optionImages": [
      "/assets/exam/preA1/jacket.svg",
      "/assets/exam/preA1/cap.svg",
      "/assets/exam/preA1/shoe.svg",
      "/assets/exam/preA1/umbrella.svg",
      "/assets/exam/preA1/hat.svg",
      "/assets/exam/preA1/tshirt.svg"
    ],
    "answer": 0,
    "explanation": "媽媽提醒「wear your jacket（穿上夾克外衣）」，故選夾克圖片 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-d2p-07",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-dlg2pic",
    "serialNum": 7,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Girl: Look at the pond! Boy: Wow, the cute duck is swimming fast."
    },
    "question": "聽對話，選出池塘裡被討論的動物線稿插圖：",
    "options": [
      "圖片 (A)",
      "圖片 (B)",
      "圖片 (C)",
      "圖片 (D)",
      "圖片 (E)",
      "圖片 (F)",
      "圖片 (G)"
    ],
    "optionImages": [
      "/assets/exam/preA1/duck.svg",
      "/assets/exam/preA1/fish.svg",
      "/assets/exam/preA1/dog.svg",
      "/assets/exam/preA1/bird.svg",
      "/assets/exam/preA1/cat.svg",
      "/assets/exam/preA1/pig.svg",
      "/assets/exam/preA1/rabbit.svg"
    ],
    "answer": 0,
    "explanation": "男孩驚呼「the cute duck is swimming」，故選小鴨插圖 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-resp-07",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-resp",
    "serialNum": 7,
    "taskType": "L-QA",
    "difficulty": 1,
    "media": {
      "audioText": "Nice to meet you, Kelly!"
    },
    "question": "請聽日常問句，選出最適當的回應句子：",
    "options": [
      "Nice to meet you, too.",
      "He is my brother.",
      "He is at home.",
      "He has a red cap.",
      "Yes, he does.",
      "He is ten."
],
    "answer": 0,
    "explanation": "初次見面打招呼「Nice to meet you」，標準禮貌回應為「Nice to meet you, too.（我也很高興認識你）」。",
    "reviewed": true
  },
  {
    "id": "tme-listen-resp-08",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-resp",
    "serialNum": 8,
    "taskType": "L-QA",
    "difficulty": 1,
    "media": {
      "audioText": "Thank you for your help, Peter."
    },
    "question": "請聽日常問句，選出最適當的回應句子：",
    "options": [
      "You are welcome.",
      "I am nine years old.",
      "I'm in Grade 3.",
      "There are nine pens.",
      "It is nine o'clock.",
      "I am fine, thanks."
],
    "answer": 0,
    "explanation": "對方道謝「Thank you...」，客氣回應「You are welcome.（不客氣）」。",
    "reviewed": true
  },
  {
    "id": "tme-listen-resp-09",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-resp",
    "serialNum": 9,
    "taskType": "L-QA",
    "difficulty": 2,
    "media": {
      "audioText": "Goodbye, Lisa! Have a nice weekend!"
    },
    "question": "請聽日常道別，選出最適當的回應句子：",
    "options": [
      "Goodbye! You, too!",
      "It is a notebook.",
      "It is under the desk.",
      "It is very happy.",
      "They are pencils.",
      "Yes, it is."
],
    "answer": 0,
    "explanation": "道別祝週末愉快，回答「Goodbye! You, too!（再見！你也是！）」。",
    "reviewed": true
  },
  {
    "id": "tme-listen-resp-10",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-resp",
    "serialNum": 10,
    "taskType": "L-QA",
    "difficulty": 2,
    "media": {
      "audioText": "Can you help me carry this heavy box, Andy?"
    },
    "question": "請聽日常請求，選出最適當的回應句子：",
    "options": [
      "Sure, no problem!",
      "You're welcome.",
      "Good night, Mom.",
      "See you tomorrow.",
      "I am sorry.",
      "Thank you very much."
],
    "answer": 0,
    "explanation": "請求協助「Can you help me...」，樂意幫忙時回答「Sure, no problem!（當然沒問題！）」。",
    "reviewed": true
  },
  {
    "id": "tme-listen-qa-07",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-conv-qa",
    "serialNum": 7,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Mom: What do you want for your birthday, Ben? Ben: I want a red bicycle, Mom. Question: What does Ben want for his birthday?"
    },
    "question": "聽對話，回答問題：What does Ben want for his birthday?",
    "options": [
      "A red bicycle",
      "Red",
      "A basketball",
      "A toy robot",
      "A blue notebook",
      "A teddy bear"
],
    "answer": 0,
    "explanation": "Ben 明確回答「I want a red bicycle」，故選 (A) A red bicycle。",
    "reviewed": true
  },
  {
    "id": "tme-listen-qa-08",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-conv-qa",
    "serialNum": 8,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Teacher: Where is your homework, Amy? Amy: It is in my school bag at home. Question: Where is Amy’s homework?"
    },
    "question": "聽對話，回答問題：Where is Amy’s homework?",
    "options": [
      "In her school bag at home",
      "Under the chair",
      "On the teacher's desk",
      "In the locker",
      "In the library",
      "Under her bed"
],
    "answer": 0,
    "explanation": "Amy 回答作業「in my school bag at home（在家裡的書包中）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-qa-09",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-conv-qa",
    "serialNum": 9,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Dad: Are you ready for dinner, Andy? Andy: Yes, Dad! I am very hungry! Question: How does Andy feel?"
    },
    "question": "聽對話，回答問題：How does Andy feel?",
    "options": [
      "Hungry",
      "Peter",
      "Thirsty",
      "Tired",
      "Happy",
      "Angry"
],
    "answer": 0,
    "explanation": "Andy 回答「I am very hungry（我很餓）」，故選 (A) Hungry。",
    "reviewed": true
  },
  {
    "id": "tme-listen-qa-10",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-conv-qa",
    "serialNum": 10,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Girl: What are you doing in the kitchen, Tom? Tom: I am making a chocolate cake for Mom. Question: What is Tom doing?"
    },
    "question": "聽對話，回答問題：What is Tom doing?",
    "options": [
      "Making a chocolate cake",
      "Rainy",
      "Washing the dishes",
      "Drinking milk",
      "Eating breakfast",
      "Reading a book"
],
    "answer": 0,
    "explanation": "Tom 回答「I am making a chocolate cake for Mom」，故選 (A) Making a chocolate cake。",
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
    "id": "tme-speak-w-02",
    "track": "tme-preA1",
    "category": "speaking",
    "subType": "speak-word",
    "serialNum": 2,
    "taskType": "S-READ",
    "difficulty": 1,
    "targetText": "orange",
    "phonics": "/ˈɔːr.ɪndʒ/",
    "question": "【口說：單字朗讀】請點擊麥克風，清晰朗讀出螢幕上的英文單字：",
    "options": [
      "orange"
    ],
    "answer": 0,
    "explanation": "口說單字朗讀標的為「orange（柳橙）」。",
    "reviewed": true
  },
  {
    "id": "tme-speak-w-03",
    "track": "tme-preA1",
    "category": "speaking",
    "subType": "speak-word",
    "serialNum": 3,
    "taskType": "S-READ",
    "difficulty": 1,
    "targetText": "pencil",
    "phonics": "/ˈpen.səl/",
    "question": "【口說：單字朗讀】請點擊麥克風，清晰朗讀出螢幕上的英文單字：",
    "options": [
      "pencil"
    ],
    "answer": 0,
    "explanation": "口說單字朗讀標的為「pencil（鉛筆）」。",
    "reviewed": true
  },
  {
    "id": "tme-speak-w-04",
    "track": "tme-preA1",
    "category": "speaking",
    "subType": "speak-word",
    "serialNum": 4,
    "taskType": "S-READ",
    "difficulty": 1,
    "targetText": "school",
    "phonics": "/skuːl/",
    "question": "【口說：單字朗讀】請點擊麥克風，清晰朗讀出螢幕上的英文單字：",
    "options": [
      "school"
    ],
    "answer": 0,
    "explanation": "口說單字朗讀標的為「school（學校）」。",
    "reviewed": true
  },
  {
    "id": "tme-speak-w-05",
    "track": "tme-preA1",
    "category": "speaking",
    "subType": "speak-word",
    "serialNum": 5,
    "taskType": "S-READ",
    "difficulty": 1,
    "targetText": "rabbit",
    "phonics": "/ˈræb.ɪt/",
    "question": "【口說：單字朗讀】請點擊麥克風，清晰朗讀出螢幕上的英文單字：",
    "options": [
      "rabbit"
    ],
    "answer": 0,
    "explanation": "口說單字朗讀標的為「rabbit（兔子）」。",
    "reviewed": true
  },
  {
    "id": "tme-speak-w-06",
    "track": "tme-preA1",
    "category": "speaking",
    "subType": "speak-word",
    "serialNum": 6,
    "taskType": "S-READ",
    "difficulty": 1,
    "targetText": "bicycle",
    "phonics": "/ˈbaɪ.sə.kəl/",
    "question": "【口說：單字朗讀】請點擊麥克風，清晰朗讀出螢幕上的英文單字：",
    "options": [
      "bicycle"
    ],
    "answer": 0,
    "explanation": "口說單字朗讀標的為「bicycle（腳踏車）」。",
    "reviewed": true
  },
  {
    "id": "tme-speak-s-02",
    "track": "tme-preA1",
    "category": "speaking",
    "subType": "speak-short",
    "serialNum": 2,
    "taskType": "S-READ",
    "difficulty": 1,
    "targetText": "I like red apples.",
    "question": "【口說：短句朗讀】請點擊麥克風，流暢朗讀出下列英文短句：",
    "options": [
      "I like red apples."
    ],
    "answer": 0,
    "explanation": "標的短句為「I like red apples.（我喜歡紅蘋果）」。",
    "reviewed": true
  },
  {
    "id": "tme-speak-s-03",
    "track": "tme-preA1",
    "category": "speaking",
    "subType": "speak-short",
    "serialNum": 3,
    "taskType": "S-READ",
    "difficulty": 1,
    "targetText": "Where is my school bag?",
    "question": "【口說：短句朗讀】請點擊麥克風，流暢朗讀出下列英文問句：",
    "options": [
      "Where is my school bag?"
    ],
    "answer": 0,
    "explanation": "標的短句為「Where is my school bag?（我的書包在哪裡？）」。",
    "reviewed": true
  },
  {
    "id": "tme-speak-s-04",
    "track": "tme-preA1",
    "category": "speaking",
    "subType": "speak-short",
    "serialNum": 4,
    "taskType": "S-READ",
    "difficulty": 1,
    "targetText": "It is a sunny Sunday.",
    "question": "【口說：短句朗讀】請點擊麥克風，流暢朗讀出下列英文短句：",
    "options": [
      "It is a sunny Sunday."
    ],
    "answer": 0,
    "explanation": "標的短句為「It is a sunny Sunday.（今天是一個晴朗的星期天）」。",
    "reviewed": true
  },
  {
    "id": "tme-speak-s-05",
    "track": "tme-preA1",
    "category": "speaking",
    "subType": "speak-short",
    "serialNum": 5,
    "taskType": "S-READ",
    "difficulty": 2,
    "targetText": "How many pens do you have?",
    "question": "【口說：短句朗讀】請點擊麥克風，流暢朗讀出下列英文問句：",
    "options": [
      "How many pens do you have?"
    ],
    "answer": 0,
    "explanation": "標的短句為「How many pens do you have?（你有幾支筆？）」。",
    "reviewed": true
  },
  {
    "id": "tme-speak-s-06",
    "track": "tme-preA1",
    "category": "speaking",
    "subType": "speak-short",
    "serialNum": 6,
    "taskType": "S-READ",
    "difficulty": 2,
    "targetText": "She is reading a story book.",
    "question": "【口說：短句朗讀】請點擊麥克風，流暢朗讀出下列英文短句：",
    "options": [
      "She is reading a story book."
    ],
    "answer": 0,
    "explanation": "標的短句為「She is reading a story book.（她正在讀一本故事書）」。",
    "reviewed": true
  },
  {
    "id": "tme-speak-l-02",
    "track": "tme-preA1",
    "category": "speaking",
    "subType": "speak-long",
    "serialNum": 2,
    "taskType": "S-READ",
    "difficulty": 2,
    "targetText": "Peter rides his blue bicycle to the park with his sister every weekend.",
    "question": "【口說：長句朗讀】請注意斷句與語調，完整朗讀下列英文長句：",
    "options": [
      "Peter rides his blue bicycle to the park with his sister every weekend."
    ],
    "answer": 0,
    "explanation": "長句朗讀評測標的，注意 bicycle 與 weekend 之發音。",
    "reviewed": true
  },
  {
    "id": "tme-speak-l-03",
    "track": "tme-preA1",
    "category": "speaking",
    "subType": "speak-long",
    "serialNum": 3,
    "taskType": "S-READ",
    "difficulty": 2,
    "targetText": "Lisa visits the school library after lunch to find an interesting English book.",
    "question": "【口說：長句朗讀】請注意斷句與語調，完整朗讀下列英文長句：",
    "options": [
      "Lisa visits the school library after lunch to find an interesting English book."
    ],
    "answer": 0,
    "explanation": "長句朗讀評測標的，注意 library 與 interesting 之發音。",
    "reviewed": true
  },
  {
    "id": "tme-speak-l-04",
    "track": "tme-preA1",
    "category": "speaking",
    "subType": "speak-long",
    "serialNum": 4,
    "taskType": "S-READ",
    "difficulty": 2,
    "targetText": "It is cold and rainy today, so please remember to take an umbrella with you.",
    "question": "【口說：長句朗讀】請注意斷句與語調，完整朗讀下列英文長句：",
    "options": [
      "It is cold and rainy today, so please remember to take an umbrella with you."
    ],
    "answer": 0,
    "explanation": "長句朗讀評測標的，注意 remember 與 umbrella 之連音與語調。",
    "reviewed": true
  }
];

// Filter out old reading and listening items from NON_WRITING_ITEMS to ensure no duplicate questions
const BASE_ITEMS = NON_WRITING_ITEMS.filter(q => q.category !== 'reading' && q.category !== 'listening');

export { TME_PRE_A1_READING_BANK, TME_PRE_A1_LISTENING_BANK, TME_PRE_A1_SCRAMBLE_BANK, TME_SCRAMBLE_PATTERNS };

export const TME_PRE_A1_BANK = [
  ...BASE_ITEMS,
  ...TME_PRE_A1_LISTENING_BANK,
  ...TME_PRE_A1_READING_BANK,
  ...TME_PRE_A1_SCRAMBLE_BANK
];
