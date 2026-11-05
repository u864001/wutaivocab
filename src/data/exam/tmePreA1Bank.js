/**
 * Test My English Pre-A1 官方模擬題庫 (Phase 2 全量擴充版)
 *
 * 涵蓋 Pre-A1 五大面向與 17 種子題型：
 * 1. 字彙 (vocab): 看字選圖 (8)、看圖選字 (8)、聽音選圖 (8)、聽音選字 (8)
 * 2. 聽力 (listening): 看圖選句 (7)、聽對話選圖 (7)、選正確回應 (10)、聽對話答題 (10)
 * 3. 閱讀 (reading): 看圖選字 (8)、看圖選句 (8)、是非判斷 (10)、短文填空 (10)
 * 4. 寫作 (writing): 重組答句 (10)、重組問句 (10)
 * 5. 口說 (speaking): 單字朗讀 (6)、短句朗讀 (6)、長句朗讀 (4)
 * 總計 138 題。
 *
 * 架構規範：
 * - 選擇題歸檔正解固定在 options[0] (A)，組卷時由學生端引擎自動執行 Fisher-Yates 隨機洗牌
 * - 是非題固定 A: True / B: False
 * - 寫作重組單字塊純詞彙無句末標點洩題，選項為完整標點大小寫標準句
 */

export const TME_PRE_A1_BANK = [
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
      "圖片 (D)"
    ],
    "optionImages": [
      "/assets/exam/preA1/apple.svg",
      "/assets/exam/preA1/banana.svg",
      "/assets/exam/preA1/orange.svg",
      "/assets/exam/preA1/grape.svg"
    ],
    "answer": 0,
    "explanation": "英文「apple」意為蘋果，對應圖片 (A)。",
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
      "圖片 (D)"
    ],
    "optionImages": [
      "/assets/exam/preA1/ruler.svg",
      "/assets/exam/preA1/pencil.svg",
      "/assets/exam/preA1/book.svg",
      "/assets/exam/preA1/scissors.svg"
    ],
    "answer": 1,
    "explanation": "英文「pencil」意為鉛筆，對應圖片 (B)。",
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
      "dog",
      "cat",
      "pig",
      "bird"
    ],
    "answer": 1,
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
      "圖片 (D)"
    ],
    "optionImages": [
      "/assets/exam/preA1/umbrella.svg",
      "/assets/exam/preA1/cap.svg",
      "/assets/exam/preA1/shoe.svg",
      "/assets/exam/preA1/jacket.svg"
    ],
    "answer": 0,
    "explanation": "聽力發音為「umbrella（雨傘）」，故選圖片 (A)。",
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
      "yellw"
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
      "The boy is reading a book."
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
      "圖片 (D)"
    ],
    "optionImages": [
      "/assets/exam/preA1/library.svg",
      "/assets/exam/preA1/zoo.svg",
      "/assets/exam/preA1/playground.svg",
      "/assets/exam/preA1/restaurant.svg"
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
      "It is a pen."
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
      "It is sunny today."
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
      "Good night, Mom.",
      "You are welcome.",
      "I am very sorry."
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
      "I don't have letters.",
      "It is fifty dollars.",
      "I am eating lunch."
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
      "No, it's not an orange.",
      "I can jump very high.",
      "She is my sister."
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
      "I like blue jackets.",
      "It is eighty dollars.",
      "She is reading a book."
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
      "Tea"
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
      "The museum"
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
      "Sixty dollars ($60)",
      "Sixteen dollars ($16)",
      "Six dollars ($6)",
      "Six hundred dollars ($600)"
    ],
    "answer": 0,
    "explanation": "店員回答「It is sixty dollars.（60元）」，選項 ① 正確。",
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
      "By bus",
      "On foot",
      "By car"
    ],
    "answer": 0,
    "explanation": "Andy 回答「I ride my bicycle with Peter」，交通方式為騎腳踏車（By bicycle）。",
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
      "Monday",
      "Friday",
      "Sunday"
    ],
    "answer": 0,
    "explanation": "全班回答「Today is Wednesday!（今天星期三）」，故選 ①。",
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
      "A doctor",
      "A teacher",
      "A cook"
    ],
    "answer": 0,
    "explanation": "Ben 明確說明「No, he is a bus driver.（不，他是一位公車司機）」，故選 ①。",
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
      "playground"
    ],
    "answer": 0,
    "explanation": "插圖為擺滿書架與安靜閱讀桌椅之場所，英文為「圖書館（library）」，故選 (A)。",
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
      "It is snowy. The children are making a snowman."
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
      "sing"
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
      "desks"
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
      "pens",
      "shoes",
      "books"
    ],
    "answer": 0,
    "explanation": "動詞為 drinks（喝），且單位為 a glass of（一杯），空格只能填可飲用的液體 milk（牛奶）。",
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
      "bathroom"
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
      "apple",
      "orange",
      "eraser"
    ],
    "answer": 0,
    "explanation": "雨天出門提醒攜帶的應為雨傘（umbrella），冠詞為 an 也符合母音開頭。",
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
      "supper"
    ],
    "answer": 0,
    "explanation": "中午十二點（twelve o'clock）吃的餐點為午餐（lunch），故選 ①。",
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
    "id": "tme-write-sr-01",
    "track": "tme-preA1",
    "category": "writing",
    "subType": "write-scramble-resp",
    "serialNum": 1,
    "taskType": "W-SCRAMBLE",
    "difficulty": 1,
    "question": "【重組答句】看問句「Where is the book?」，將單字依序重組成正確答句：",
    "scrambledWords": [
      "is",
      "on",
      "It",
      "the",
      "desk"
    ],
    "targetSentence": "It is on the desk.",
    "options": [
      "It is on the desk.",
      "On the desk it is.",
      "The desk is on it.",
      "It desk is on the."
    ],
    "answer": 0,
    "explanation": "正確答句主詞為 It，後接 be 動詞 is 與介系詞片語 on the desk。",
    "reviewed": true
  },
  {
    "id": "tme-write-sr-02",
    "track": "tme-preA1",
    "category": "writing",
    "subType": "write-scramble-resp",
    "serialNum": 2,
    "taskType": "W-SCRAMBLE",
    "difficulty": 1,
    "question": "【重組答句】看問句「What time is it now?」，將單字依序重組成正確答句：",
    "scrambledWords": [
      "is",
      "o’clock",
      "It",
      "three"
    ],
    "targetSentence": "It is three o’clock.",
    "options": [
      "It is three o’clock.",
      "Three o’clock it is.",
      "It three is o’clock.",
      "Is it three o’clock."
    ],
    "answer": 0,
    "explanation": "回答時間標準句型為「It is + 數字 + o’clock.」。",
    "reviewed": true
  },
  {
    "id": "tme-write-sr-03",
    "track": "tme-preA1",
    "category": "writing",
    "subType": "write-scramble-resp",
    "serialNum": 3,
    "taskType": "W-SCRAMBLE",
    "difficulty": 1,
    "question": "【重組答句】看問句「Do you like apples?」，將單字依序重組成正確答句：",
    "scrambledWords": [
      "do",
      "I",
      "Yes",
      "like",
      "them"
    ],
    "targetSentence": "Yes, I like them.",
    "options": [
      "Yes, I like them.",
      "I like them, yes do.",
      "Yes, them I like.",
      "Do I like them, yes."
    ],
    "answer": 0,
    "explanation": "簡答肯定的完整肯定句為「Yes, I like them.（是的，我喜歡它們）」。",
    "reviewed": true
  },
  {
    "id": "tme-write-sr-04",
    "track": "tme-preA1",
    "category": "writing",
    "subType": "write-scramble-resp",
    "serialNum": 4,
    "taskType": "W-SCRAMBLE",
    "difficulty": 1,
    "question": "【重組答句】看問句「How is the weather today?」，將單字依序重組成正確答句：",
    "scrambledWords": [
      "sunny",
      "It",
      "today",
      "is"
    ],
    "targetSentence": "It is sunny today.",
    "options": [
      "It is sunny today.",
      "Today sunny is it.",
      "Is it sunny today.",
      "It sunny is today."
    ],
    "answer": 0,
    "explanation": "回答天氣句型為「It is + 天氣形容詞 + today.」。",
    "reviewed": true
  },
  {
    "id": "tme-write-sr-05",
    "track": "tme-preA1",
    "category": "writing",
    "subType": "write-scramble-resp",
    "serialNum": 5,
    "taskType": "W-SCRAMBLE",
    "difficulty": 2,
    "question": "【重組答句】看問句「Can you play basketball?」，將單字依序重組成正確答句：",
    "scrambledWords": [
      "can",
      "Yes",
      "play",
      "I"
    ],
    "targetSentence": "Yes, I can play.",
    "options": [
      "Yes, I can play.",
      "I can play, yes.",
      "Can I play, yes.",
      "Yes, play I can."
    ],
    "answer": 0,
    "explanation": "Can 疑問句的肯定答句為「Yes, I can play.（是的，我會打）」。",
    "reviewed": true
  },
  {
    "id": "tme-write-sr-06",
    "track": "tme-preA1",
    "category": "writing",
    "subType": "write-scramble-resp",
    "serialNum": 6,
    "taskType": "W-SCRAMBLE",
    "difficulty": 2,
    "question": "【重組答句】看問句「What does your sister want?」，將單字依序重組成正確答句：",
    "scrambledWords": [
      "She",
      "some",
      "wants",
      "milk"
    ],
    "targetSentence": "She wants some milk.",
    "options": [
      "She wants some milk.",
      "Some milk she wants.",
      "Wants she some milk.",
      "She some milk wants."
    ],
    "answer": 0,
    "explanation": "第三人稱單數主詞 She，動詞要加 s 為 wants，後接受詞 some milk。",
    "reviewed": true
  },
  {
    "id": "tme-write-sq-01",
    "track": "tme-preA1",
    "category": "writing",
    "subType": "write-scramble-q",
    "serialNum": 1,
    "taskType": "W-SCRAMBLE",
    "difficulty": 1,
    "question": "【重組問句】看答句「I am ten years old.」，將單字依序重組成適當的疑問句：",
    "scrambledWords": [
      "are",
      "old",
      "How",
      "you"
    ],
    "targetSentence": "How old are you?",
    "options": [
      "How old are you?",
      "How are you old?",
      "Are you how old?",
      "Old how are you?"
    ],
    "answer": 0,
    "explanation": "詢問年齡標準句型為「How old + are you?」，字首 H 大寫，句尾加問號。",
    "reviewed": true
  },
  {
    "id": "tme-write-sq-02",
    "track": "tme-preA1",
    "category": "writing",
    "subType": "write-scramble-q",
    "serialNum": 2,
    "taskType": "W-SCRAMBLE",
    "difficulty": 1,
    "question": "【重組問句】看答句「I am from Taiwan.」，將單字依序重組成適當的疑問句：",
    "scrambledWords": [
      "you",
      "Where",
      "from",
      "are"
    ],
    "targetSentence": "Where are you from?",
    "options": [
      "Where are you from?",
      "Where from are you?",
      "Are you where from?",
      "You are from where?"
    ],
    "answer": 0,
    "explanation": "詢問來自何處句型為「Where are you from?」。",
    "reviewed": true
  },
  {
    "id": "tme-write-sq-03",
    "track": "tme-preA1",
    "category": "writing",
    "subType": "write-scramble-q",
    "serialNum": 3,
    "taskType": "W-SCRAMBLE",
    "difficulty": 2,
    "question": "【重組問句】看答句「My favorite color is blue.」，將單字依序重組成適當的疑問句：",
    "scrambledWords": [
      "color",
      "What",
      "your",
      "favorite",
      "is"
    ],
    "targetSentence": "What is your favorite color?",
    "options": [
      "What is your favorite color?",
      "What color is favorite your?",
      "Your favorite color is what?",
      "Is what your favorite color?"
    ],
    "answer": 0,
    "explanation": "詢問最喜歡的顏色句型為「What is your favorite color?」。",
    "reviewed": true
  },
  {
    "id": "tme-write-sq-04",
    "track": "tme-preA1",
    "category": "writing",
    "subType": "write-scramble-q",
    "serialNum": 4,
    "taskType": "W-SCRAMBLE",
    "difficulty": 1,
    "question": "【重組問句】看答句「Yes, she can swim very well.」，將單字依序重組成適當的疑問句：",
    "scrambledWords": [
      "swim",
      "she",
      "Can"
    ],
    "targetSentence": "Can she swim?",
    "options": [
      "Can she swim?",
      "She can swim?",
      "Swim can she?",
      "Can swim she?"
    ],
    "answer": 0,
    "explanation": "答句為 Yes/No，含有助動詞 can，問句應為「Can + 主詞 + 原形動詞?」即「Can she swim?」。",
    "reviewed": true
  },
  {
    "id": "tme-write-sq-05",
    "track": "tme-preA1",
    "category": "writing",
    "subType": "write-scramble-q",
    "serialNum": 5,
    "taskType": "W-SCRAMBLE",
    "difficulty": 1,
    "question": "【重組問句】看答句「He is in the kitchen.」，將單字依序重組成適當的疑問句：",
    "scrambledWords": [
      "is",
      "he",
      "Where"
    ],
    "targetSentence": "Where is he?",
    "options": [
      "Where is he?",
      "Where he is?",
      "Is he where?",
      "He is where?"
    ],
    "answer": 0,
    "explanation": "答句告知地點「in the kitchen」，問句應為 Where 開頭的倒裝問句「Where is he?」。",
    "reviewed": true
  },
  {
    "id": "tme-write-sq-06",
    "track": "tme-preA1",
    "category": "writing",
    "subType": "write-scramble-q",
    "serialNum": 6,
    "taskType": "W-SCRAMBLE",
    "difficulty": 2,
    "question": "【重組問句】看答句「No, they don't like hot dogs.」，將單字依序重組成適當的疑問句：",
    "scrambledWords": [
      "hot dogs",
      "like",
      "they",
      "Do"
    ],
    "targetSentence": "Do they like hot dogs?",
    "options": [
      "Do they like hot dogs?",
      "Do like they hot dogs?",
      "They do like hot dogs?",
      "Like they do hot dogs?"
    ],
    "answer": 0,
    "explanation": "答句為「No, they don't like...」，一般動詞 like 的複數主詞問句使用助動詞 Do 開頭：「Do they like hot dogs?」。",
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
      "圖片 (D)"
    ],
    "optionImages": [
      "/assets/exam/preA1/cake.svg",
      "/assets/exam/preA1/bread.svg",
      "/assets/exam/preA1/cookie.svg",
      "/assets/exam/preA1/pizza.svg"
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
      "圖片 (D)"
    ],
    "optionImages": [
      "/assets/exam/preA1/rabbit.svg",
      "/assets/exam/preA1/bear.svg",
      "/assets/exam/preA1/elephant.svg",
      "/assets/exam/preA1/monkey.svg"
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
      "圖片 (D)"
    ],
    "optionImages": [
      "/assets/exam/preA1/desk.svg",
      "/assets/exam/preA1/chair.svg",
      "/assets/exam/preA1/bag.svg",
      "/assets/exam/preA1/book.svg"
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
      "圖片 (D)"
    ],
    "optionImages": [
      "/assets/exam/preA1/bus.svg",
      "/assets/exam/preA1/car.svg",
      "/assets/exam/preA1/train.svg",
      "/assets/exam/preA1/boat.svg"
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
      "圖片 (D)"
    ],
    "optionImages": [
      "/assets/exam/preA1/milk.svg",
      "/assets/exam/preA1/water.svg",
      "/assets/exam/preA1/orange.svg",
      "/assets/exam/preA1/apple.svg"
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
      "圖片 (D)"
    ],
    "optionImages": [
      "/assets/exam/preA1/fish.svg",
      "/assets/exam/preA1/duck.svg",
      "/assets/exam/preA1/bird.svg",
      "/assets/exam/preA1/pig.svg"
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
      "duck"
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
      "rabbit"
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
      "sofa"
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
      "boat"
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
      "cat"
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
      "scissors"
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
      "cookie"
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
      "圖片 (D)"
    ],
    "optionImages": [
      "/assets/exam/preA1/bear.svg",
      "/assets/exam/preA1/dog.svg",
      "/assets/exam/preA1/cat.svg",
      "/assets/exam/preA1/rabbit.svg"
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
      "圖片 (D)"
    ],
    "optionImages": [
      "/assets/exam/preA1/pen.svg",
      "/assets/exam/preA1/pencil.svg",
      "/assets/exam/preA1/ruler.svg",
      "/assets/exam/preA1/eraser.svg"
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
      "圖片 (D)"
    ],
    "optionImages": [
      "/assets/exam/preA1/train.svg",
      "/assets/exam/preA1/bus.svg",
      "/assets/exam/preA1/car.svg",
      "/assets/exam/preA1/bicycle.svg"
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
      "圖片 (D)"
    ],
    "optionImages": [
      "/assets/exam/preA1/hat.svg",
      "/assets/exam/preA1/cap.svg",
      "/assets/exam/preA1/shoe.svg",
      "/assets/exam/preA1/jacket.svg"
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
      "圖片 (D)"
    ],
    "optionImages": [
      "/assets/exam/preA1/cookie.svg",
      "/assets/exam/preA1/cake.svg",
      "/assets/exam/preA1/bread.svg",
      "/assets/exam/preA1/pizza.svg"
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
      "圖片 (D)"
    ],
    "optionImages": [
      "/assets/exam/preA1/boat.svg",
      "/assets/exam/preA1/bicycle.svg",
      "/assets/exam/preA1/car.svg",
      "/assets/exam/preA1/bus.svg"
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
      "圖片 (D)"
    ],
    "optionImages": [
      "/assets/exam/preA1/bag.svg",
      "/assets/exam/preA1/book.svg",
      "/assets/exam/preA1/desk.svg",
      "/assets/exam/preA1/chair.svg"
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
      "gren"
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
      "blu",
      "bloo"
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
      "ruller",
      "rooler",
      "rula"
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
      "pencl",
      "pencel"
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
      "breed"
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
      "wator",
      "watter",
      "watar"
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
      "cher"
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
      "The duck is swimming."
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
      "The school bus is stopping here.",
      "The train is moving fast.",
      "The plane is in the sky.",
      "The boat is on the water."
    ],
    "answer": 0,
    "explanation": "插圖為校車公車，聽力為「The yellow school bus is stopping here.」，故選 (A)。",
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
      "There is a birthday cake.",
      "There is an apple on the table.",
      "They are eating ice cream.",
      "The boy has a big cookie."
    ],
    "answer": 0,
    "explanation": "插圖為生日蛋糕，聽力內容「There are three candles on the birthday cake.」，故選 (A)。",
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
      "There is a bench in the park.",
      "The girl is in the library.",
      "The monkey is at the zoo.",
      "The students are in the classroom."
    ],
    "answer": 0,
    "explanation": "插圖為公園與長椅，聽力「There is a bench under the green tree in the park.」，故選 (A)。",
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
      "The small fish is swimming.",
      "The rabbit is jumping.",
      "The elephant is drinking water.",
      "The bird is in the tree."
    ],
    "answer": 0,
    "explanation": "插圖為水裡的小魚，聽力「The small fish is swimming...」，故選 (A)。",
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
      "The boat is on the sea.",
      "The car is on the road.",
      "The bus is coming.",
      "The bicycle is very fast."
    ],
    "answer": 0,
    "explanation": "插圖為帆船小艇，聽力「A white sailboat is floating on the blue sea.」，故選 (A)。",
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
      "圖片 (D)"
    ],
    "optionImages": [
      "/assets/exam/preA1/bread.svg",
      "/assets/exam/preA1/pizza.svg",
      "/assets/exam/preA1/cookie.svg",
      "/assets/exam/preA1/cake.svg"
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
      "圖片 (D)"
    ],
    "optionImages": [
      "/assets/exam/preA1/zoo.svg",
      "/assets/exam/preA1/library.svg",
      "/assets/exam/preA1/school.svg",
      "/assets/exam/preA1/restaurant.svg"
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
      "圖片 (D)"
    ],
    "optionImages": [
      "/assets/exam/preA1/elephant.svg",
      "/assets/exam/preA1/rabbit.svg",
      "/assets/exam/preA1/pig.svg",
      "/assets/exam/preA1/duck.svg"
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
      "圖片 (D)"
    ],
    "optionImages": [
      "/assets/exam/preA1/eraser.svg",
      "/assets/exam/preA1/pencil.svg",
      "/assets/exam/preA1/ruler.svg",
      "/assets/exam/preA1/scissors.svg"
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
      "圖片 (D)"
    ],
    "optionImages": [
      "/assets/exam/preA1/jacket.svg",
      "/assets/exam/preA1/cap.svg",
      "/assets/exam/preA1/shoe.svg",
      "/assets/exam/preA1/umbrella.svg"
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
      "圖片 (D)"
    ],
    "optionImages": [
      "/assets/exam/preA1/duck.svg",
      "/assets/exam/preA1/fish.svg",
      "/assets/exam/preA1/dog.svg",
      "/assets/exam/preA1/bird.svg"
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
      "I am ten years old.",
      "Thank you very much.",
      "It is on the desk."
    ],
    "answer": 0,
    "explanation": "初次見面打招呼「Nice to meet you」，標準禮貌回應為「Nice to meet you, too.」。",
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
      "Good morning, teacher.",
      "I have two pencils.",
      "Yes, she can swim."
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
      "My name is Lisa.",
      "I want some milk.",
      "It is cold today."
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
      "It is three o’clock.",
      "I like blue jackets.",
      "She is my teacher."
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
      "A new jacket",
      "A toy car",
      "A basketball"
    ],
    "answer": 0,
    "explanation": "Ben 明確回答「I want a red bicycle」，故選 (A)。",
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
      "On the teacher’s desk",
      "In the library",
      "Under her chair"
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
      "He is hungry.",
      "He is thirsty.",
      "He is tired.",
      "He is sleepy."
    ],
    "answer": 0,
    "explanation": "Andy 回答「I am very hungry（我很餓）」，故選 (A)。",
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
      "Drinking some milk",
      "Reading a story book",
      "Washing his hands"
    ],
    "answer": 0,
    "explanation": "Tom 回答「I am making a chocolate cake for Mom」，故選 (A)。",
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
      "hospital"
    ],
    "answer": 0,
    "explanation": "插圖為綠樹與休閒長椅之場所，代表「公園（park）」，故選 (A)。",
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
      "park"
    ],
    "answer": 0,
    "explanation": "插圖為帶有鐘樓與教室大門之校舍建築，代表「學校（school）」，故選 (A)。",
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
      "playground"
    ],
    "answer": 0,
    "explanation": "插圖為觀賞動物的拱門場所「動物園（zoo）」，故選 (A)。",
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
      "library"
    ],
    "answer": 0,
    "explanation": "插圖為餐桌椅與餐具齊備之用餐場所「餐廳（restaurant）」，故選 (A)。",
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
      "zoo"
    ],
    "answer": 0,
    "explanation": "插圖為學校遊樂設施與滑梯場所「操場/遊戲區（playground）」，故選 (A)。",
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
      "chair"
    ],
    "answer": 0,
    "explanation": "插圖為雙肩學生書包，英文為「bag」，故選 (A)。",
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
      "ruler"
    ],
    "answer": 0,
    "explanation": "插圖為學生課桌，英文為「desk」，故選 (A)。",
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
      "The boat is in the water."
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
      "The puppy dog is very cute.",
      "The cat is sleeping on the bed.",
      "The bird is in the sky.",
      "The pig is eating an apple."
    ],
    "answer": 0,
    "explanation": "插圖為可愛小狗，句子 (A) 完全吻合。",
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
      "The duck is swimming in the pond.",
      "The rabbit is running fast.",
      "The bear is climbing a mountain.",
      "The monkey is eating a banana."
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
      "The children go to school by bus.",
      "They ride bicycles to the park.",
      "The boat sails across the river.",
      "The train arrives at the station."
    ],
    "answer": 0,
    "explanation": "插圖為大公車/校車，句子 (A)「搭公車上學」吻合。",
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
      "The book is open on the desk.",
      "The boy is cutting paper with scissors.",
      "The ruler is thirty centimeters long.",
      "She writes with a red pencil."
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
      "Today is Mary’s birthday party.",
      "We eat pizza for lunch.",
      "The cookie is very sweet.",
      "He drinks a glass of cold water."
    ],
    "answer": 0,
    "explanation": "插圖為點燃蠟燭的生日蛋糕，句子 (A) 生日聚會最吻合。",
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
      "The white sailboat is on the sea.",
      "The yellow car is in the garage.",
      "The airplane flies above the clouds.",
      "The bicycle is parked by the tree."
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
      "tshirt",
      "table",
      "pencil",
      "eraser"
    ],
    "answer": 0,
    "explanation": "動詞為 puts on（穿上），空格只能填衣物類單字 tshirt（T恤），故選 (A)。",
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
      "cake",
      "cookie"
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
      "duck",
      "cat"
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
      "chair",
      "desk",
      "shoe"
    ],
    "answer": 0,
    "explanation": "美勞課剪紙（cut out the paper）使用的工具為 scissors（剪刀），故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-write-sr-07",
    "track": "tme-preA1",
    "category": "writing",
    "subType": "write-scramble-resp",
    "serialNum": 7,
    "taskType": "W-SCRAMBLE",
    "difficulty": 1,
    "question": "【重組答句】看問句「Where is your cat?」，將單字依序重組成正確答句：",
    "scrambledWords": [
      "is",
      "the",
      "It",
      "under",
      "chair"
    ],
    "targetSentence": "It is under the chair.",
    "options": [
      "It is under the chair.",
      "Under the chair it is.",
      "It chair is under the.",
      "The chair is under it."
    ],
    "answer": 0,
    "explanation": "回答地點句型為「It is under the chair.（牠在椅子下面）」。",
    "reviewed": true
  },
  {
    "id": "tme-write-sr-08",
    "track": "tme-preA1",
    "category": "writing",
    "subType": "write-scramble-resp",
    "serialNum": 8,
    "taskType": "W-SCRAMBLE",
    "difficulty": 2,
    "question": "【重組答句】看問句「What is that on the desk?」，將單字依序重組成正確答句：",
    "scrambledWords": [
      "is",
      "an",
      "It",
      "eraser"
    ],
    "targetSentence": "It is an eraser.",
    "options": [
      "It is an eraser.",
      "An eraser is it.",
      "It eraser is an.",
      "Is it an eraser."
    ],
    "answer": 0,
    "explanation": "回答單數物品句型為「It is an eraser.（它是一個橡皮擦）」，eraser 前使用冠詞 an。",
    "reviewed": true
  },
  {
    "id": "tme-write-sr-09",
    "track": "tme-preA1",
    "category": "writing",
    "subType": "write-scramble-resp",
    "serialNum": 9,
    "taskType": "W-SCRAMBLE",
    "difficulty": 2,
    "question": "【重組答句】看問句「Are they happy today?」，將單字依序重組成正確答句：",
    "scrambledWords": [
      "are",
      "Yes",
      "they"
    ],
    "targetSentence": "Yes, they are.",
    "options": [
      "Yes, they are.",
      "They are, yes.",
      "Are they, yes.",
      "Yes, are they."
    ],
    "answer": 0,
    "explanation": "Are they...? 的肯定簡答為「Yes, they are.」。",
    "reviewed": true
  },
  {
    "id": "tme-write-sr-10",
    "track": "tme-preA1",
    "category": "writing",
    "subType": "write-scramble-resp",
    "serialNum": 10,
    "taskType": "W-SCRAMBLE",
    "difficulty": 2,
    "question": "【重組答句】看問句「Who is that tall girl?」，將單字依序重組成正確答句：",
    "scrambledWords": [
      "is",
      "sister",
      "She",
      "my"
    ],
    "targetSentence": "She is my sister.",
    "options": [
      "She is my sister.",
      "My sister she is.",
      "She sister is my.",
      "Is she my sister."
    ],
    "answer": 0,
    "explanation": "回答女性人物為「She is my sister.（她是我的姊妹）」。",
    "reviewed": true
  },
  {
    "id": "tme-write-sq-07",
    "track": "tme-preA1",
    "category": "writing",
    "subType": "write-scramble-q",
    "serialNum": 7,
    "taskType": "W-SCRAMBLE",
    "difficulty": 1,
    "question": "【重組問句】看答句「My name is Tony.」，將單字依序重組成適當的疑問句：",
    "scrambledWords": [
      "name",
      "What",
      "is",
      "your"
    ],
    "targetSentence": "What is your name?",
    "options": [
      "What is your name?",
      "What name is your?",
      "Your name is what?",
      "Is what your name?"
    ],
    "answer": 0,
    "explanation": "詢問姓名標準句型為「What is your name?」。",
    "reviewed": true
  },
  {
    "id": "tme-write-sq-08",
    "track": "tme-preA1",
    "category": "writing",
    "subType": "write-scramble-q",
    "serialNum": 8,
    "taskType": "W-SCRAMBLE",
    "difficulty": 2,
    "question": "【重組問句】看答句「It is five dollars.」，將單字依序重組成適當的疑問句：",
    "scrambledWords": [
      "much",
      "is",
      "How",
      "it"
    ],
    "targetSentence": "How much is it?",
    "options": [
      "How much is it?",
      "How is it much?",
      "Much how is it?",
      "Is it how much?"
    ],
    "answer": 0,
    "explanation": "詢問價格標準句型為「How much is it?」。",
    "reviewed": true
  },
  {
    "id": "tme-write-sq-09",
    "track": "tme-preA1",
    "category": "writing",
    "subType": "write-scramble-q",
    "serialNum": 9,
    "taskType": "W-SCRAMBLE",
    "difficulty": 2,
    "question": "【重組問句】看答句「I have two pencils.」，將單字依序重組成適當的疑問句：",
    "scrambledWords": [
      "many",
      "pencils",
      "How",
      "do",
      "have",
      "you"
    ],
    "targetSentence": "How many pencils do you have?",
    "options": [
      "How many pencils do you have?",
      "How do you have many pencils?",
      "Many pencils how do you have?",
      "Do you have how many pencils?"
    ],
    "answer": 0,
    "explanation": "詢問可數名詞數量為「How many + 複數名詞 + do you have?」。",
    "reviewed": true
  },
  {
    "id": "tme-write-sq-10",
    "track": "tme-preA1",
    "category": "writing",
    "subType": "write-scramble-q",
    "serialNum": 10,
    "taskType": "W-SCRAMBLE",
    "difficulty": 2,
    "question": "【重組問句】看答句「Yes, I am a student.」，將單字依序重組成適當的疑問句：",
    "scrambledWords": [
      "you",
      "a",
      "Are",
      "student"
    ],
    "targetSentence": "Are you a student?",
    "options": [
      "Are you a student?",
      "You are a student?",
      "A student are you?",
      "Student are you a?"
    ],
    "answer": 0,
    "explanation": "回答「Yes, I am a student.」，問句為 be 動詞倒裝「Are you a student?」。",
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
