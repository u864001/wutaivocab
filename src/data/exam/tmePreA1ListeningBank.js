/**
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

export const TME_PRE_A1_LISTENING_BANK = [
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
    "reviewed": true
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
    "id": "tme-listen-resp-11",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-resp",
    "serialNum": 11,
    "taskType": "L-QA",
    "difficulty": 1,
    "media": {
      "audioText": "I am so sorry I broke your yellow crayon, Kelly."
    },
    "question": "請聽道歉句，選出最適當的回應句子：",
    "options": [
      "That's all right. Don't worry.",
      "I like red crayons.",
      "Yes, I do.",
      "He is nine years old.",
      "It is ten dollars.",
      "Good morning, Kelly."
    ],
    "answer": 0,
    "explanation": "對方道歉「I am so sorry...」，安慰與包容的標準禮貌回應為「That's all right. Don't worry.（沒關係，別擔心）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-resp-12",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-resp",
    "serialNum": 12,
    "taskType": "L-QA",
    "difficulty": 1,
    "media": {
      "audioText": "What's wrong, Andy? You look very tired."
    },
    "question": "請聽關心問句，選出最適當的回應句子：",
    "options": [
      "I have a headache and a fever.",
      "I like to eat apples.",
      "Yes, she can swim.",
      "It is on the chair.",
      "My name is Peter.",
      "At seven o'clock."
    ],
    "answer": 0,
    "explanation": "問句關心「What's wrong? You look very tired.（你怎麼了？你看起來很累）」，回答身體不適症狀「I have a headache and a fever.（我頭痛而且發燒）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-resp-13",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-resp",
    "serialNum": 13,
    "taskType": "L-QA",
    "difficulty": 1,
    "media": {
      "audioText": "It is a beautiful sunny day. Let's go swimming!"
    },
    "question": "請聽提議句，選出最適當的回應句子：",
    "options": [
      "Great idea! Let's go!",
      "No, I am not a teacher.",
      "It is twelve o'clock.",
      "I have three brothers.",
      "She is at home.",
      "It is twenty dollars."
    ],
    "answer": 0,
    "explanation": "對方提議「Let's go swimming!（我們去游泳吧！）」，欣然贊同回答「Great idea! Let's go!（好主意！我們走吧！）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-resp-14",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-resp",
    "serialNum": 14,
    "taskType": "L-QA",
    "difficulty": 1,
    "media": {
      "audioText": "How is the weather outside today, Mom?"
    },
    "question": "請聽天氣問句，選出最適當的回應句子：",
    "options": [
      "It is rainy and cold. Take your umbrella.",
      "I am ten years old.",
      "She is cooking lunch.",
      "Yes, I can play basketball.",
      "It is on the second floor.",
      "I want two bananas."
    ],
    "answer": 0,
    "explanation": "問句詢問「How is the weather outside today?（今天外面天氣如何？）」，回答天氣狀況「It is rainy and cold. Take your umbrella.（下雨又冷，帶上雨傘）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-resp-15",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-resp",
    "serialNum": 15,
    "taskType": "L-QA",
    "difficulty": 2,
    "media": {
      "audioText": "Excuse me, how much are these three red notebooks?"
    },
    "question": "請聽詢問價格問句，選出最適當的回應句子：",
    "options": [
      "They are fifty dollars.",
      "They are on the desk.",
      "They are very happy.",
      "Yes, they can.",
      "I like red notebooks.",
      "There are three books."
    ],
    "answer": 0,
    "explanation": "問句詢問價格「How much are these three red notebooks?」，應回答金額「They are fifty dollars.（五十元）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-resp-16",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-resp",
    "serialNum": 16,
    "taskType": "L-QA",
    "difficulty": 1,
    "media": {
      "audioText": "Your new shoes are so cool, Peter!"
    },
    "question": "請聽稱讚讚美，選出最適當的回應句子：",
    "options": [
      "Thank you! My mother bought them for me.",
      "You are welcome.",
      "I am sorry.",
      "Goodbye, see you tomorrow.",
      "They are pencils.",
      "No, they are not doctors."
    ],
    "answer": 0,
    "explanation": "對方讚美新球鞋「Your new shoes are so cool!」，禮貌接受讚美道謝「Thank you! My mother bought them for me.（謝謝！媽媽買給我的）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-resp-17",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-resp",
    "serialNum": 17,
    "taskType": "L-QA",
    "difficulty": 1,
    "media": {
      "audioText": "Do you like bananas or papayas, Lisa?"
    },
    "question": "請聽選擇喜好問句，選出最適當的回應句子：",
    "options": [
      "I like bananas. They are sweet.",
      "Yes, I do.",
      "No, I am not.",
      "It is nine o'clock.",
      "He is my brother.",
      "At the supermarket."
    ],
    "answer": 0,
    "explanation": "問句使用 or 提供二選一「Do you like bananas or papayas?」，不可回答 Yes/No，應選特定喜好「I like bananas. They are sweet.」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-resp-18",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-resp",
    "serialNum": 18,
    "taskType": "L-QA",
    "difficulty": 1,
    "media": {
      "audioText": "Please open your English book and turn to page twenty."
    },
    "question": "請聽老師課堂指令，選出學生最適當的回應：",
    "options": [
      "Okay, Teacher. Page twenty.",
      "Good night, Mom.",
      "You are welcome.",
      "I like to play piano.",
      "It is three dollars.",
      "No, it isn't blue."
    ],
    "answer": 0,
    "explanation": "老師課堂指令「Please open your English book and turn to page twenty.」，學生確認執行回答「Okay, Teacher. Page twenty.」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-resp-19",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-resp",
    "serialNum": 19,
    "taskType": "L-QA",
    "difficulty": 1,
    "media": {
      "audioText": "Can I borrow your eraser for a minute, Tom?"
    },
    "question": "請聽借用物品請求，選出最適當的回應句子：",
    "options": [
      "Sure! Here you are.",
      "I am ten years old.",
      "Yes, I have an eraser.",
      "He is in the library.",
      "It is very big.",
      "No, thank you."
    ],
    "answer": 0,
    "explanation": "同學借用橡皮擦「Can I borrow your eraser...?」，樂意出借回答「Sure! Here you are.（當然！拿去吧！）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-resp-20",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-resp",
    "serialNum": 20,
    "taskType": "L-QA",
    "difficulty": 1,
    "media": {
      "audioText": "What do you usually do on Sunday, Kevin?"
    },
    "question": "請聽日常作息問句，選出最適當的回應句子：",
    "options": [
      "I usually ride my bicycle with my father.",
      "Today is Sunday.",
      "It is sunny today.",
      "Yes, I like Sunday.",
      "I am in the classroom.",
      "He is nine years old."
    ],
    "answer": 0,
    "explanation": "問句詢問「What do you usually do on Sunday?（你週日通常做什麼？）」，回答日常活動「I usually ride my bicycle with my father.（我通常跟爸爸去騎腳踏車）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-resp-21",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-resp",
    "serialNum": 21,
    "taskType": "L-QA",
    "difficulty": 2,
    "media": {
      "audioText": "Who is that tall man standing next to the tree?"
    },
    "question": "請聽人物詢問問句，選出最適當的回應句子：",
    "options": [
      "He is our new PE teacher, Mr. Chen.",
      "He is cooking dinner.",
      "It is a big tree.",
      "Yes, he is tall.",
      "He likes apples.",
      "At three thirty."
    ],
    "answer": 0,
    "explanation": "問句使用 Who 詢問人物身分「Who is that tall man...?」，回答「He is our new PE teacher, Mr. Chen.（他是我們新來的體育老師陳老師）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-resp-22",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-resp",
    "serialNum": 22,
    "taskType": "L-QA",
    "difficulty": 1,
    "media": {
      "audioText": "Goodbye, everyone! Have a safe trip home!"
    },
    "question": "請聽放學道別祝福，選出最適當的回應句子：",
    "options": [
      "Thank you, Teacher! See you tomorrow!",
      "I am sorry.",
      "You are welcome.",
      "It is under the desk.",
      "I want an apple.",
      "Yes, I can."
    ],
    "answer": 0,
    "explanation": "放學道別並祝回家路上小心「Have a safe trip home!」，禮貌回應「Thank you, Teacher! See you tomorrow!（謝謝老師！明天見！）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-qa-11",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-conv-qa",
    "serialNum": 11,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Boy: Mom, I am so hungry after basketball practice. Mom: There is some bread and sweet strawberry jam on the table. Boy: Thank you, Mom! Can I also have a glass of milk? Mom: Sure, it is in the refrigerator. Question: What does the boy want to drink?"
    },
    "question": "聽對話，回答問題：What does the boy want to drink?",
    "options": [
      "Milk",
      "Orange juice",
      "Water",
      "Hot tea",
      "Coffee",
      "Apple juice"
    ],
    "answer": 0,
    "explanation": "男孩詢問「Can I also have a glass of milk?」，故想喝的飲料為牛奶 (Milk)，選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-qa-12",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-conv-qa",
    "serialNum": 12,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Girl: Excuse me, Mr. Wu. Where can I find books about animals? Librarian: They are on shelf number four, next to the window. Girl: Thank you very much! Question: Where are the animal books?"
    },
    "question": "聽對話，回答問題：Where are the animal books?",
    "options": [
      "On shelf number four",
      "On the teacher's desk",
      "In the computer room",
      "Under the chair",
      "Near the front door",
      "On shelf number one"
    ],
    "answer": 0,
    "explanation": "圖書館員回答「They are on shelf number four, next to the window.」，在第四號書架上，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-qa-13",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-conv-qa",
    "serialNum": 13,
    "taskType": "L-CONV",
    "difficulty": 1,
    "media": {
      "audioText": "Dad: It's Saturday morning! Do you want to go to the zoo or the museum, Leo? Leo: The zoo! I really want to see the baby monkeys. Dad: Okay, let's take the bus there right now. Question: Where are Leo and his father going?"
    },
    "question": "聽對話，回答問題：Where are Leo and his father going?",
    "options": [
      "The zoo",
      "The museum",
      "The hospital",
      "The library",
      "The supermarket",
      "The school"
    ],
    "answer": 0,
    "explanation": "Leo 明確回答「The zoo! I really want to see the baby monkeys.」，父子前往動物園，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-qa-14",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-conv-qa",
    "serialNum": 14,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Girl: Oh no! Where is my favorite red pencil? Boy: Look under your chair, Kelly. Girl: No, that's a black pen. Boy: How about inside your English textbook? Girl: Wow, you found it! Thank you! Question: Where was Kelly's red pencil?"
    },
    "question": "聽對話，回答問題：Where was Kelly's red pencil?",
    "options": [
      "Inside her English textbook",
      "Under her chair",
      "In her backpack",
      "On the teacher's desk",
      "In the trash can",
      "At home on her bed"
    ],
    "answer": 0,
    "explanation": "男孩提醒「How about inside your English textbook?」女孩驚呼「you found it!」，故鉛筆在英語課本裡，選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-qa-15",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-conv-qa",
    "serialNum": 15,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Boy: Is that your mother in the white coat, Amy? Girl: Yes, she works at Wutai Health Center. She helps sick people every day. Boy: Wow, she is a great nurse! Question: What does Amy's mother do?"
    },
    "question": "聽對話，回答問題：What does Amy's mother do?",
    "options": [
      "She is a nurse.",
      "She is a teacher.",
      "She is a bus driver.",
      "She is a cook.",
      "She is a farmer.",
      "She is a police officer."
    ],
    "answer": 0,
    "explanation": "對話中最後明確提到「she is a great nurse!（她是一位很棒的護理師）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-qa-16",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-conv-qa",
    "serialNum": 16,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Girl: Can you play the recorder, Peter? Boy: No, I can't. But I can play the drums! Girl: That's awesome! I can play the piano. Let's practice together for the school concert! Question: What instrument can Peter play?"
    },
    "question": "聽對話，回答問題：What instrument can Peter play?",
    "options": [
      "The drums",
      "The piano",
      "The recorder",
      "The guitar",
      "The violin",
      "The flute"
    ],
    "answer": 0,
    "explanation": "Peter 說明「No, I can't [play the recorder]. But I can play the drums!」，Peter 會打鼓，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-qa-17",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-conv-qa",
    "serialNum": 17,
    "taskType": "L-CONV",
    "difficulty": 1,
    "media": {
      "audioText": "Mom: Listen to the radio, Ben. It will rain this afternoon. Ben: But it is sunny right now, Mom! Mom: Yes, but clouds are coming from the mountains. Take your blue raincoat. Ben: Okay, Mom. Question: What will the weather be like this afternoon?"
    },
    "question": "聽對話，回答問題：What will the weather be like this afternoon?",
    "options": [
      "It will rain.",
      "It will be hot and sunny.",
      "It will snow.",
      "It will be very windy.",
      "It will be foggy.",
      "It will be warm."
    ],
    "answer": 0,
    "explanation": "媽媽提醒「Listen to the radio... It will rain this afternoon.」，下午將會下雨，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-qa-18",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-conv-qa",
    "serialNum": 18,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Teacher: Class, tomorrow is Lisa's birthday. Boy: Can we sing a birthday song for her? Teacher: Yes! And Tony bought ten colorful balloons. Girl: I made a big birthday card. Question: How many balloons did Tony buy?"
    },
    "question": "聽對話，回答問題：How many balloons did Tony buy?",
    "options": [
      "Ten balloons",
      "Two balloons",
      "Twenty balloons",
      "Five balloons",
      "Twelve balloons",
      "Eight balloons"
    ],
    "answer": 0,
    "explanation": "老師說明「Tony bought ten colorful balloons.（Tony 買了 10 顆彩色氣球）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-qa-19",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-conv-qa",
    "serialNum": 19,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Cafeteria Staff: Hello, Andy! Would you like chicken noodles or beef fried rice today? Andy: I ate noodles yesterday. Can I have beef fried rice, please? Staff: Here you are. Enjoy your lunch! Question: What does Andy have for lunch today?"
    },
    "question": "聽對話，回答問題：What does Andy have for lunch today?",
    "options": [
      "Beef fried rice",
      "Chicken noodles",
      "A hamburger",
      "Tomato pizza",
      "A vegetable sandwich",
      "Fruit salad"
    ],
    "answer": 0,
    "explanation": "Andy 選擇「Can I have beef fried rice, please?」，Andy 今天吃牛肉炒飯，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-qa-20",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-conv-qa",
    "serialNum": 20,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Girl: Are you ready for Sports Day tomorrow, Kevin? Boy: Yes! I am running the 100-meter race. Girl: Good luck! I am playing in the dodgeball game at two o'clock. Question: What is Kevin doing on Sports Day?"
    },
    "question": "聽對話，回答問題：What is Kevin doing on Sports Day?",
    "options": [
      "Running the 100-meter race",
      "Playing dodgeball",
      "Swimming in the pool",
      "Playing basketball",
      "Singing on the stage",
      "Jumping high"
    ],
    "answer": 0,
    "explanation": "Kevin 說明「I am running the 100-meter race（我參加一百公尺賽跑）」，故選 (A)。",
    "reviewed": true
  },
  {
    "id": "tme-listen-qa-21",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-conv-qa",
    "serialNum": 21,
    "taskType": "L-CONV",
    "difficulty": 1,
    "media": {
      "audioText": "Boy: Excuse me, did you see a small brown puppy near the park gate? Girl: Yes! A cute puppy was playing near the flower bed five minutes ago. Boy: Thank you so much! That is my puppy, Lucky! Question: What color is Lucky the puppy?"
    },
    "question": "聽對話，回答問題：What color is Lucky the puppy?",
    "options": [
      "Brown",
      "Black",
      "White",
      "Yellow",
      "Grey",
      "Orange"
    ],
    "answer": 0,
    "explanation": "男孩尋找「a small brown puppy」，小狗是棕色的，故選 (A) Brown。",
    "reviewed": true
  },
  {
    "id": "tme-listen-qa-22",
    "track": "tme-preA1",
    "category": "listening",
    "subType": "listen-conv-qa",
    "serialNum": 22,
    "taskType": "L-CONV",
    "difficulty": 2,
    "media": {
      "audioText": "Girl: What time should we meet at the school gate on Saturday morning, Tom? Tom: How about eight o'clock? Girl: Eight is a bit early. Can we meet at eight thirty? Tom: Sure! Eight thirty is perfect. Question: What time will they meet on Saturday?"
    },
    "question": "聽對話，回答問題：What time will they meet on Saturday?",
    "options": [
      "At eight thirty",
      "At eight o'clock",
      "At nine o'clock",
      "At seven thirty",
      "At ten o'clock",
      "At eight fifteen"
    ],
    "answer": 0,
    "explanation": "兩人協商後最終確認「Sure! Eight thirty is perfect.（八點半太完美了）」，約定在 8:30，故選 (A)。",
    "reviewed": true
  }
];
