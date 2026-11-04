/**
 * 教育部縣市學力檢測 (SAA 臺灣學生學習成就評量) 實戰題庫
 * 依據臺中教育大學 SAA 歷年國小 4、5、6 年級試卷結構編製
 * 涵蓋聽力三大題 (辨識句意、基本問答、言談理解) 與閱讀二大題 (單題、生活題組)
 * 合法依據：著作權法第 9 條第 1 項第 5 款公立考試試題非著作權標的
 */

import { SAA_115_ALL_QUESTIONS } from './saa';

const SAA_SIMULATED_BANK = [
  {
    "id": "saa_g4_01",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "listening",
    "taskType": "L-SENT",
    "difficulty": 1,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "The girl is reading a book under the tree.",
      "imageId": null
    },
    "question": "【聽力：辨識句意】請聽音檔，選出最相符的情境描述：\n（音檔：The girl is reading a book under the tree.）",
    "options": [
      "女孩在樹下看書",
      "女孩在房間裡睡覺",
      "女孩在操場上跑步"
    ],
    "answer": 0,
    "explanation": "錄音內容為「The girl is reading a book under the tree.（女孩正在樹下閱讀一本書）」，關鍵字為 reading a book（閱讀看書）與 under the tree（在樹下），故選第一項。"
  },
  {
    "id": "saa_g4_02",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "listening",
    "taskType": "L-SENT",
    "difficulty": 1,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "It is rainy today. Don't forget your umbrella.",
      "imageId": null
    },
    "question": "【聽力：辨識句意】請聽音檔，選出相符的天氣與攜帶物品：\n（音檔：It is rainy today. Don't forget your umbrella.）",
    "options": [
      "晴天戴帽子",
      "雨天帶雨傘",
      "刮風穿外套"
    ],
    "answer": 1,
    "explanation": "關鍵詞 rainy（下雨的）與 umbrella（雨傘），整句意為「今天下雨，別忘了帶傘」，相符情境為雨天帶雨傘。"
  },
  {
    "id": "saa_g4_03",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "listening",
    "taskType": "L-SENT",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "There are four apples and two bananas on the table.",
      "imageId": null
    },
    "question": "【聽力：辨識句意】請聽音檔，選出桌上水果的數量：\n（音檔：There are four apples and two bananas on the table.）",
    "options": [
      "4 顆蘋果與 2 根香蕉",
      "2 顆蘋果與 4 根香蕉",
      "5 顆橘子與 2 顆蘋果"
    ],
    "answer": 0,
    "explanation": "聽力明確提到 four apples（4 顆蘋果）以及 two bananas（2 根香蕉），故答案為 4 顆蘋果與 2 根香蕉。"
  },
  {
    "id": "saa_g4_04",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "listening",
    "taskType": "L-SENT",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "My brother can play basketball, but he cannot swim.",
      "imageId": null
    },
    "question": "【聽力：辨識句意】請聽音檔，選出弟弟的能力敘述：\n（音檔：My brother can play basketball, but he cannot swim.）",
    "options": [
      "會游泳但不會打籃球",
      "會打籃球但不會游泳",
      "既會打籃球也會游泳"
    ],
    "answer": 1,
    "explanation": "can play basketball 代表「會打籃球」，but he cannot swim 代表「但他不會游泳」，故選第二項。"
  },
  {
    "id": "saa_g4_05",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "listening",
    "taskType": "L-SENT",
    "difficulty": 1,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "The cat is sleeping under the chair.",
      "imageId": null
    },
    "question": "【聽力：辨識句意】請聽音檔，選出小貓的位置與動作：\n（音檔：The cat is sleeping under the chair.）",
    "options": [
      "貓咪在椅子上跳躍",
      "貓咪在桌子旁吃魚",
      "貓咪在椅子下睡覺"
    ],
    "answer": 2,
    "explanation": "sleeping 為正在睡覺，under the chair 為在椅子下方，兩者結合即為「貓咪在椅子下睡覺」。"
  },
  {
    "id": "saa_g4_06",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "listening",
    "taskType": "L-QA",
    "difficulty": 1,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "What time is it now?",
      "imageId": null
    },
    "question": "【聽力：基本問答】請聽問句，選出最適當的回應：\n（問句：What time is it now?）",
    "options": [
      "It is ten o'clock.",
      "It is on the desk.",
      "I am ten years old."
    ],
    "answer": 0,
    "explanation": "「What time is it now?」詢問現在幾點，應用時間回應「It is ten o'clock.（現在十點鐘）」；選項 B 回答位置，選項 C 回答年齡。"
  },
  {
    "id": "saa_g4_07",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "listening",
    "taskType": "L-QA",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "Where is my pencil box?",
      "imageId": null
    },
    "question": "【聽力：基本問答】請聽問句，選出最適當的回應：\n（問句：Where is my pencil box?）",
    "options": [
      "It is red and blue.",
      "It is in your schoolbag.",
      "Yes, I have a pencil."
    ],
    "answer": 1,
    "explanation": "「Where is...」詢問地點位置，應以方位介系詞回答「It is in your schoolbag.（在你的書包裡）」；A 回答顏色，C 為 Yes/No 答句不合邏輯。"
  },
  {
    "id": "saa_g4_08",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "listening",
    "taskType": "L-QA",
    "difficulty": 1,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "How is the weather today?",
      "imageId": null
    },
    "question": "【聽力：基本問答】請聽問句，選出最適當的回應：\n（問句：How is the weather today?）",
    "options": [
      "I like sunny days.",
      "It is sunny and warm.",
      "I am doing my homework."
    ],
    "answer": 1,
    "explanation": "「How is the weather today?」詢問今天天氣狀況，最適應答為「It is sunny and warm.（天氣晴朗且溫暖）」。"
  },
  {
    "id": "saa_g4_09",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "listening",
    "taskType": "L-QA",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "Can you ride a bicycle?",
      "imageId": null
    },
    "question": "【聽力：基本問答】請聽問句，選出最適當的回應：\n（問句：Can you ride a bicycle?）",
    "options": [
      "Yes, I can. It's fun.",
      "No, I am not tired.",
      "I have two bicycles."
    ],
    "answer": 0,
    "explanation": "助動詞「Can you...」的問句應以「Yes, I can.」或「No, I cannot.」簡答，故「Yes, I can. It's fun.（會的，騎腳踏車很好玩）」為正解。"
  },
  {
    "id": "saa_g4_10",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "listening",
    "taskType": "L-QA",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "What are you doing, Tina?",
      "imageId": null
    },
    "question": "【聽力：基本問答】請聽問句，選出最適當的回應：\n（問句：What are you doing, Tina?）",
    "options": [
      "She is my sister.",
      "I am drawing a picture.",
      "You are very kind."
    ],
    "answer": 1,
    "explanation": "「What are you doing?」詢問目前正在進行的動作，需用現在進行式「I am + V-ing」回答，故選「I am drawing a picture.（我正在畫畫）」。"
  },
  {
    "id": "saa_g4_11",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "listening",
    "taskType": "L-CONV",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "Boy: Happy birthday, Amy! This gift is for you. Girl: Wow, a cute teddy bear! Thank you so much! Question: What is the birthday gift?",
      "imageId": null
    },
    "question": "【聽力：言談理解】請聽對話與問題，選出正確答案：\n（對話：Boy: Happy birthday, Amy! This gift is for you. Girl: Wow, a cute teddy bear! Thank you so much! 問題：What is the birthday gift?）",
    "options": [
      "A storybook",
      "A teddy bear",
      "A bicycle"
    ],
    "answer": 1,
    "explanation": "女孩收到禮物時高興地說「Wow, a cute teddy bear!（哇，一隻可愛的泰迪熊玩具！）」因此生日禮物是一隻泰迪熊 (A teddy bear)。"
  },
  {
    "id": "saa_g4_12",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "listening",
    "taskType": "L-CONV",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "Mom: Tom, it's seven thirty. Time for school! Tom: Okay, Mom. Where is my yellow cap? Mom: It's on your bed. Question: Where is Tom's yellow cap?",
      "imageId": null
    },
    "question": "【聽力：言談理解】請聽對話與問題，選出正確答案：\n（對話：Mom: Tom, it's seven thirty. Time for school! Tom: Okay, Mom. Where is my yellow cap? Mom: It's on your bed. 問題：Where is Tom's yellow cap?）",
    "options": [
      "Under the desk",
      "On his bed",
      "In his bag"
    ],
    "answer": 1,
    "explanation": "媽媽回答「It's on your bed.（在你的床上）」，故黃色帽子在床上 (On his bed)。"
  },
  {
    "id": "saa_g4_13",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "listening",
    "taskType": "L-CONV",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "Girl: Look at the dog! It is running so fast! Boy: Yes, that is Max. He loves chasing balls in the park. Question: Where are the boy and girl?",
      "imageId": null
    },
    "question": "【聽力：言談理解】請聽對話與問題，選出正確答案：\n（對話：Girl: Look at the dog! It is running so fast! Boy: Yes, that is Max. He loves chasing balls in the park. 問題：Where are the boy and girl?）",
    "options": [
      "In the park",
      "In the classroom",
      "At the supermarket"
    ],
    "answer": 0,
    "explanation": "男孩提到狗在公園裡追球「in the park」，且兩人在看狗快跑，推論出他們現在身處公園 (In the park)。"
  },
  {
    "id": "saa_g4_14",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "listening",
    "taskType": "L-CONV",
    "difficulty": 3,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "Man: Welcome to Good Food Diner. May I help you? Woman: Yes, please. I'd like a chicken sandwich and a glass of milk. Man: That will be eighty dollars. Question: How much does the woman pay?",
      "imageId": null
    },
    "question": "【聽力：言談理解】請聽對話與問題，選出正確答案：\n（對話：Man: May I help you? Woman: I'd like a chicken sandwich and milk. Man: That will be eighty dollars. 問題：How much does the woman pay?）",
    "options": [
      "Eighteen dollars",
      "Eighty dollars",
      "Eighty-five dollars"
    ],
    "answer": 1,
    "explanation": "店員說「That will be eighty dollars.」，eighty 為 80 元（注意與 eighteen 18 元的聽音區別），故選 80 元。"
  },
  {
    "id": "saa_g4_15",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "listening",
    "taskType": "L-CONV",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "Teacher: Class, open your English books to page twelve. Please read the story quietly. Question: What class is it?",
      "imageId": null
    },
    "question": "【聽力：言談理解】請聽廣播指令與問題，選出正確答案：\n（廣播：Teacher: Class, open your English books to page twelve. Please read quietly. 問題：What class is it?）",
    "options": [
      "English class",
      "Math class",
      "PE class"
    ],
    "answer": 0,
    "explanation": "老師說「open your English books（打開你們的英文課本）」，很明確目前正在上英語課 (English class)。"
  },
  {
    "id": "saa_g4_16",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "vocabulary",
    "taskType": "V-MEAN",
    "difficulty": 1,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "I am thirsty. I want to drink some ______.",
    "options": [
      "water",
      "bread",
      "rice",
      "cookies"
    ],
    "answer": 0,
    "explanation": "句意為「我口渴了 (thirsty)，我想喝點……」。water 為水（液體可喝）；bread（麵包）、rice（米飯）、cookies（餅乾）皆為固體食物。"
  },
  {
    "id": "saa_g4_17",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "grammar",
    "taskType": "G-MC",
    "difficulty": 1,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "Look! The monkeys ______ climbing the tall trees.",
    "options": [
      "is",
      "are",
      "am",
      "be"
    ],
    "answer": 1,
    "explanation": "主詞「The monkeys」為複數名詞，現在進行式（be + V-ing）應搭配複數 be 動詞「are」。"
  },
  {
    "id": "saa_g4_18",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "vocabulary",
    "taskType": "V-MEAN",
    "difficulty": 1,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "My father is a ______. He helps sick people in the hospital.",
    "options": [
      "cook",
      "pilot",
      "doctor",
      "farmer"
    ],
    "answer": 2,
    "explanation": "在醫院（hospital）照顧生病的人（sick people）的職業是「doctor（醫生）」；cook 為廚師，pilot 為飛行員，farmer 為農夫。"
  },
  {
    "id": "saa_g4_19",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "grammar",
    "taskType": "G-MC",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "A: Whose eraser is this?\nB: It is ______ eraser. Thank you!",
    "options": [
      "my",
      "me",
      "I",
      "mine"
    ],
    "answer": 0,
    "explanation": "修飾後方的名詞 eraser 需要所有格形容詞「my（我的）」。me 為受格，I 為主格，mine 為所有格代名詞後面不接名詞。"
  },
  {
    "id": "saa_g4_20",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "grammar",
    "taskType": "G-MC",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "Ken ______ like green bell peppers. He thinks they taste bitter.",
    "options": [
      "don't",
      "doesn't",
      "isn't",
      "aren't"
    ],
    "answer": 1,
    "explanation": "主詞 Ken 為第三人稱單數，一般動詞 like 的否定句須藉由助動詞「doesn't + 原形動詞」形成否定。"
  },
  {
    "id": "saa_g4_21",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "vocabulary",
    "taskType": "V-MEAN",
    "difficulty": 1,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "Today is Wednesday. Tomorrow will be ______.",
    "options": [
      "Tuesday",
      "Thursday",
      "Friday",
      "Sunday"
    ],
    "answer": 1,
    "explanation": "今天星期三 (Wednesday)，明天 (Tomorrow) 是星期四 (Thursday)。Tuesday 為星期二，Friday 為星期五。"
  },
  {
    "id": "saa_g4_22",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "grammar",
    "taskType": "G-MC",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "A: ______ ruler do you want, the blue one or the yellow one?\nB: The yellow one, please.",
    "options": [
      "Which",
      "Where",
      "Who",
      "How"
    ],
    "answer": 0,
    "explanation": "在有限的特定選項中做選擇（the blue one or the yellow one）使用疑問詞「Which（哪一個）」。Where 問地點，Who 問人，How 問方式。"
  },
  {
    "id": "saa_g4_23",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "grammar",
    "taskType": "G-MC",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "Please ______ quiet in the library. People are studying.",
    "options": [
      "be",
      "is",
      "are",
      "do"
    ],
    "answer": 0,
    "explanation": "祈使句以原形動詞開頭，形容詞 quiet 前方需搭配原形 be 動詞「be」，故選「Please be quiet.（請保持安靜）」。"
  },
  {
    "id": "saa_g4_24",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "vocabulary",
    "taskType": "V-MEAN",
    "difficulty": 1,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "Elephants have four strong legs and two big ______.",
    "options": [
      "ears",
      "hands",
      "shoes",
      "wings"
    ],
    "answer": 0,
    "explanation": "大象擁有強壯的四條腿與兩隻大「耳朵 (ears)」；大象沒有 hands（手）或 wings（翅膀）。"
  },
  {
    "id": "saa_g4_25",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "grammar",
    "taskType": "G-MC",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "A: ______ are you going?\nB: I am going to the art museum.",
    "options": [
      "Where",
      "When",
      "What",
      "Who"
    ],
    "answer": 0,
    "explanation": "回答是地點「art museum（美術館）」，因此問句必須用詢問地點的疑問詞「Where（哪裡）」。"
  },
  {
    "id": "saa_g4_26",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "grammar",
    "taskType": "G-MC",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "My birthday is ______ May 15th.",
    "options": [
      "on",
      "in",
      "at",
      "to"
    ],
    "answer": 0,
    "explanation": "特定具體日期（May 15th，五月十五日）前使用的時間介系詞為「on」；若只有月份（May）則用 in。"
  },
  {
    "id": "saa_g4_27",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "grammar",
    "taskType": "G-MC",
    "difficulty": 1,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "A: Can an eagle fly high in the sky?\nB: Yes, ______.",
    "options": [
      "it can",
      "it does",
      "it is",
      "they can"
    ],
    "answer": 0,
    "explanation": "主詞 an eagle 為單數動物代名詞 it，問句開頭為 Can，簡答應為「Yes, it can.」。"
  },
  {
    "id": "saa_g4_28",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "reading",
    "taskType": "R-COMP",
    "difficulty": 2,
    "reviewed": true,
    "groupId": "saa_g4_passage_lost_found",
    "passage": {
      "title": "【校園生活告示】Wutai Elementary School - Lost & Found",
      "text": "LOST & FOUND NOTICE\nDate: October 20th\n\nFound Items in the Gym:\n1. A blue water bottle with dinosaur stickers.\n2. A yellow jacket (Size: M).\n3. A black pencil case with five gel pens.\n\n* Please come to the Health Center to claim your item before Friday (Oct 24th).\n* Contact Teacher Lin at Ext. 204."
    },
    "question": "Where were the lost items found according to the notice?",
    "options": [
      "In the gym",
      "In the library",
      "In the cafeteria",
      "In the classroom"
    ],
    "answer": 0,
    "explanation": "告示第一段明確寫道「Found Items in the Gym（在體育館內撿到的遺失物）」，故地點為體育館 (In the gym)。"
  },
  {
    "id": "saa_g4_29",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "reading",
    "taskType": "R-COMP",
    "difficulty": 2,
    "reviewed": true,
    "groupId": "saa_g4_passage_lost_found",
    "passage": {
      "title": "【校園生活告示】Wutai Elementary School - Lost & Found",
      "text": "LOST & FOUND NOTICE\nDate: October 20th\n\nFound Items in the Gym:\n1. A blue water bottle with dinosaur stickers.\n2. A yellow jacket (Size: M).\n3. A black pencil case with five gel pens.\n\n* Please come to the Health Center to claim your item before Friday (Oct 24th).\n* Contact Teacher Lin at Ext. 204."
    },
    "question": "What color is the lost water bottle?",
    "options": [
      "Yellow",
      "Blue",
      "Black",
      "Green"
    ],
    "answer": 1,
    "explanation": "第一項遺失物描述為「A blue water bottle with dinosaur stickers（印有恐龍貼紙的藍色水壺）」，故顏色為藍色 (Blue)。"
  },
  {
    "id": "saa_g4_30",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "reading",
    "taskType": "R-COMP",
    "difficulty": 2,
    "reviewed": true,
    "groupId": "saa_g4_passage_lost_found",
    "passage": {
      "title": "【校園生活告示】Wutai Elementary School - Lost & Found",
      "text": "LOST & FOUND NOTICE\nDate: October 20th\n\nFound Items in the Gym:\n1. A blue water bottle with dinosaur stickers.\n2. A yellow jacket (Size: M).\n3. A black pencil case with five gel pens.\n\n* Please come to the Health Center to claim your item before Friday (Oct 24th).\n* Contact Teacher Lin at Ext. 204."
    },
    "question": "Where should students go to claim their lost items?",
    "options": [
      "The Principal's Office",
      "The Health Center",
      "The Computer Room",
      "The Guard Room"
    ],
    "answer": 1,
    "explanation": "告示第四行指引：「Please come to the Health Center to claim your item（請至健康中心認領您的物品）」，故選健康中心 (The Health Center)。"
  },
  {
    "id": "saa_g4_31",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "reading",
    "taskType": "R-COMP",
    "difficulty": 3,
    "reviewed": true,
    "groupId": "saa_g4_passage_lost_found",
    "passage": {
      "title": "【校園生活告示】Wutai Elementary School - Lost & Found",
      "text": "LOST & FOUND NOTICE\nDate: October 20th\n\nFound Items in the Gym:\n1. A blue water bottle with dinosaur stickers.\n2. A yellow jacket (Size: M).\n3. A black pencil case with five gel pens.\n\n* Please come to the Health Center to claim your item before Friday (Oct 24th).\n* Contact Teacher Lin at Ext. 204."
    },
    "question": "When is the deadline to claim the lost items?",
    "options": [
      "October 20th",
      "October 24th",
      "October 31st",
      "November 1st"
    ],
    "answer": 1,
    "explanation": "告示註明「before Friday (Oct 24th)（在 10 月 24 日星期五之前）」，故認領期限為 10 月 24 日。"
  },
  {
    "id": "saa_g4_32",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "reading",
    "taskType": "R-COMP",
    "difficulty": 2,
    "reviewed": true,
    "groupId": "saa_g4_passage_bakery_menu",
    "passage": {
      "title": "【生活價目表】Sunshine Bakery Menu & Prices",
      "text": "SUNSHINE BAKERY\nOpening Hours: 07:30 - 18:00\n\nBread & Treats:\n• Strawberry Cake: $45\n• Chocolate Muffin: $30\n• Toast Bread: $35\n• Apple Pie: $40\n\nDrinks:\n• Fresh Orange Juice: $25\n• Black Tea: $20\n\n* Special Offer: Buy two muffins, get $5 off!"
    },
    "question": "How much is a slice of strawberry cake?",
    "options": [
      "$30",
      "$35",
      "$40",
      "$45"
    ],
    "answer": 3,
    "explanation": "價目表中 Strawberry Cake（草莓蛋糕）標示為 $45，故答案為 45 元。"
  },
  {
    "id": "saa_g4_33",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "reading",
    "taskType": "R-COMP",
    "difficulty": 2,
    "reviewed": true,
    "groupId": "saa_g4_passage_bakery_menu",
    "passage": {
      "title": "【生活價目表】Sunshine Bakery Menu & Prices",
      "text": "SUNSHINE BAKERY\nOpening Hours: 07:30 - 18:00\n\nBread & Treats:\n• Strawberry Cake: $45\n• Chocolate Muffin: $30\n• Toast Bread: $35\n• Apple Pie: $40\n\nDrinks:\n• Fresh Orange Juice: $25\n• Black Tea: $20\n\n* Special Offer: Buy two muffins, get $5 off!"
    },
    "question": "Which drink is the cheapest on the menu?",
    "options": [
      "Apple juice",
      "Black tea",
      "Fresh orange juice",
      "Milk tea"
    ],
    "answer": 1,
    "explanation": "菜單上只有兩款飲料：Fresh Orange Juice ($25) 與 Black Tea ($20)，最便宜的為 Black Tea（20 元）。"
  },
  {
    "id": "saa_g4_34",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "reading",
    "taskType": "R-COMP",
    "difficulty": 3,
    "reviewed": true,
    "groupId": "saa_g4_passage_bakery_menu",
    "passage": {
      "title": "【生活價目表】Sunshine Bakery Menu & Prices",
      "text": "SUNSHINE BAKERY\nOpening Hours: 07:30 - 18:00\n\nBread & Treats:\n• Strawberry Cake: $45\n• Chocolate Muffin: $30\n• Toast Bread: $35\n• Apple Pie: $40\n\nDrinks:\n• Fresh Orange Juice: $25\n• Black Tea: $20\n\n* Special Offer: Buy two muffins, get $5 off!"
    },
    "question": "Leo buys an apple pie and a black tea. How much does he spend in total?",
    "options": [
      "$55",
      "$60",
      "$65",
      "$70"
    ],
    "answer": 1,
    "explanation": "Apple Pie 為 40 元，Black Tea 為 20 元，合計 40 + 20 = 60 元 ($60)。"
  },
  {
    "id": "saa_g4_35",
    "track": "ministry-assessment",
    "targetGrade": 4,
    "book": 4,
    "unit": "SAA 四年級學力檢測",
    "section": "reading",
    "taskType": "R-COMP",
    "difficulty": 3,
    "reviewed": true,
    "groupId": "saa_g4_passage_bakery_menu",
    "passage": {
      "title": "【生活價目表】Sunshine Bakery Menu & Prices",
      "text": "SUNSHINE BAKERY\nOpening Hours: 07:30 - 18:00\n\nBread & Treats:\n• Strawberry Cake: $45\n• Chocolate Muffin: $30\n• Toast Bread: $35\n• Apple Pie: $40\n\nDrinks:\n• Fresh Orange Juice: $25\n• Black Tea: $20\n\n* Special Offer: Buy two muffins, get $5 off!"
    },
    "question": "According to the special offer, how much are two chocolate muffins?",
    "options": [
      "$50",
      "$55",
      "$60",
      "$65"
    ],
    "answer": 1,
    "explanation": "一個馬芬 30 元，兩個原價 60 元；特別優惠註明「Buy two muffins, get $5 off!（買兩個馬芬折 5 元）」，因此為 60 - 5 = 55 元。"
  },
  {
    "id": "saa_g5_01",
    "track": "ministry-assessment",
    "targetGrade": 5,
    "book": 5,
    "unit": "SAA 五年級學力檢測",
    "section": "listening",
    "taskType": "L-SENT",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "The post office is between the bank and the bookstore.",
      "imageId": null
    },
    "question": "【聽力：辨識句意】請聽音檔，選出郵局的位置描述：\n（音檔：The post office is between the bank and the bookstore.）",
    "options": [
      "郵局在銀行與書店的中間",
      "郵局在銀行的對面",
      "郵局在書店的後方"
    ],
    "answer": 0,
    "explanation": "介系詞「between A and B」代表在 A 與 B 兩者之間，故郵局在銀行與書店的中間。"
  },
  {
    "id": "saa_g5_02",
    "track": "ministry-assessment",
    "targetGrade": 5,
    "book": 5,
    "unit": "SAA 五年級學力檢測",
    "section": "listening",
    "taskType": "L-SENT",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "We usually have science class on Thursday morning.",
      "imageId": null
    },
    "question": "【聽力：辨識句意】請聽音檔，選出自然科學課的時間：\n（音檔：We usually have science class on Thursday morning.）",
    "options": [
      "星期二下午",
      "星期四上午",
      "星期五上午"
    ],
    "answer": 1,
    "explanation": "關鍵詞 science class（自然科學課）與 Thursday morning（星期四上午），相符選項為星期四上午。"
  },
  {
    "id": "saa_g5_03",
    "track": "ministry-assessment",
    "targetGrade": 5,
    "book": 5,
    "unit": "SAA 五年級學力檢測",
    "section": "listening",
    "taskType": "L-QA",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "How do you usually go to school?",
      "imageId": null
    },
    "question": "【聽力：基本問答】請聽問句，選出最適當的回應：\n（問句：How do you usually go to school?）",
    "options": [
      "I usually go to school on foot.",
      "At seven o'clock.",
      "Yes, I like my school."
    ],
    "answer": 0,
    "explanation": "How 詢問前往學校的交通方式，應回答「on foot（步行）」或 by bus 等交通方式。"
  },
  {
    "id": "saa_g5_04",
    "track": "ministry-assessment",
    "targetGrade": 5,
    "book": 5,
    "unit": "SAA 五年級學力檢測",
    "section": "listening",
    "taskType": "L-QA",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "What does your uncle do?",
      "imageId": null
    },
    "question": "【聽力：基本問答】請聽問句，選出最適當的回應：\n（問句：What does your uncle do?）",
    "options": [
      "He is watching TV.",
      "He is a police officer.",
      "He is in the living room."
    ],
    "answer": 1,
    "explanation": "「What does someone do?」為詢問職業身分的固定句型，故回答「He is a police officer.（他是一名警察）」。"
  },
  {
    "id": "saa_g5_05",
    "track": "ministry-assessment",
    "targetGrade": 5,
    "book": 5,
    "unit": "SAA 五年級學力檢測",
    "section": "listening",
    "taskType": "L-CONV",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "Boy: Excuse me, how can I get to the train station? Girl: Go straight for two blocks and turn left. It's next to the library. Question: Where is the train station?",
      "imageId": null
    },
    "question": "【聽力：言談理解】請聽對話與問題，選出正確答案：\n（對話：Boy: How can I get to the train station? Girl: Go straight and turn left. It's next to the library. 問題：Where is the train station?）",
    "options": [
      "Next to the library",
      "Behind the school",
      "Inside the park"
    ],
    "answer": 0,
    "explanation": "女孩給予路線指引並說明「It's next to the library.（它就在圖書館隔壁）」，故選 Next to the library。"
  },
  {
    "id": "saa_g5_06",
    "track": "ministry-assessment",
    "targetGrade": 5,
    "book": 5,
    "unit": "SAA 五年級學力檢測",
    "section": "listening",
    "taskType": "L-SENT",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "The students are planting trees in the garden.",
      "imageId": null
    },
    "question": "【聽力：辨識句意】請聽音檔，選出學生在花園裡的動作：\n（音檔：The students are planting trees in the garden.）",
    "options": [
      "在花園裡種樹",
      "在操場上踢足球",
      "在教室裡擦黑板"
    ],
    "answer": 0,
    "explanation": "planting trees 為「正在種樹」，in the garden 為「在花園裡」，故選在花園裡種樹。"
  },
  {
    "id": "saa_g5_07",
    "track": "ministry-assessment",
    "targetGrade": 5,
    "book": 5,
    "unit": "SAA 五年級學力檢測",
    "section": "listening",
    "taskType": "L-QA",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "How much are these new sneakers?",
      "imageId": null
    },
    "question": "【聽力：基本問答】請聽問句，選出最適當的回應：\n（問句：How much are these new sneakers?）",
    "options": [
      "They are size nine.",
      "They are nine hundred dollars.",
      "Yes, they are very cool."
    ],
    "answer": 1,
    "explanation": "「How much are...」詢問複數物品價格，應回答金額「They are nine hundred dollars.（這雙九百元）」。"
  },
  {
    "id": "saa_g5_08",
    "track": "ministry-assessment",
    "targetGrade": 5,
    "book": 5,
    "unit": "SAA 五年級學力檢測",
    "section": "listening",
    "taskType": "L-CONV",
    "difficulty": 3,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "Girl: Did you go to Kenting National Park last weekend, Eric? Boy: Yes! The ocean was so blue, and we saw many beautiful corals. Question: Where was Eric last weekend?",
      "imageId": null
    },
    "question": "【聽力：言談理解】請聽對話與問題，選出正確答案：\n（對話：Girl: Did you go to Kenting last weekend? Boy: Yes! The ocean was blue and we saw corals. 問題：Where was Eric last weekend?）",
    "options": [
      "At Kenting National Park",
      "At Taipei 101",
      "In the mountains"
    ],
    "answer": 0,
    "explanation": "對話中女孩詢問是否去墾丁國家公園，男孩回答「Yes!」，因此上週末在墾丁國家公園。"
  },
  {
    "id": "saa_g5_09",
    "track": "ministry-assessment",
    "targetGrade": 5,
    "book": 5,
    "unit": "SAA 五年級學力檢測",
    "section": "listening",
    "taskType": "L-QA",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "What is your favorite subject at school?",
      "imageId": null
    },
    "question": "【聽力：基本問答】請聽問句，選出最適當的回應：\n（問句：What is your favorite subject at school?）",
    "options": [
      "I love art because I like painting.",
      "I go home at four.",
      "My teacher is Mr. Wang."
    ],
    "answer": 0,
    "explanation": "「What is your favorite subject?」詢問最喜愛的學校科目，回答「I love art...（我最喜歡美術課）」最切合。"
  },
  {
    "id": "saa_g5_10",
    "track": "ministry-assessment",
    "targetGrade": 5,
    "book": 5,
    "unit": "SAA 五年級學力檢測",
    "section": "listening",
    "taskType": "L-CONV",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "Woman: May I take your order? Boy: I would like beef noodles and green tea, please. Woman: For here or to go? Boy: To go, please. Question: Will the boy eat the food in the restaurant?",
      "imageId": null
    },
    "question": "【聽力：言談理解】請聽對話與問題，選出正確答案：\n（對話：Woman: For here or to go? Boy: To go, please. 問題：Will the boy eat the food in the restaurant?）",
    "options": [
      "No, he will take it away.",
      "Yes, he will eat here.",
      "He does not want any food."
    ],
    "answer": 0,
    "explanation": "男孩回答「To go, please.（外帶）」，因此他不會在餐廳內吃，而是帶走 (take it away)。"
  },
  {
    "id": "saa_g5_11",
    "track": "ministry-assessment",
    "targetGrade": 5,
    "book": 5,
    "unit": "SAA 五年級學力檢測",
    "section": "vocabulary",
    "taskType": "V-MEAN",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "My grandfather goes to the ______ every morning to buy fresh vegetables and fish.",
    "options": [
      "market",
      "cinema",
      "museum",
      "station"
    ],
    "answer": 0,
    "explanation": "買新鮮蔬菜與魚類的地點為傳統市場 (market)；cinema 為電影院，museum 為博物館。"
  },
  {
    "id": "saa_g5_12",
    "track": "ministry-assessment",
    "targetGrade": 5,
    "book": 5,
    "unit": "SAA 五年級學力檢測",
    "section": "grammar",
    "taskType": "G-MC",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "Yesterday afternoon, my family ______ a wonderful movie together.",
    "options": [
      "watched",
      "watch",
      "watching",
      "watches"
    ],
    "answer": 0,
    "explanation": "時間副詞「Yesterday afternoon（昨天下午）」為過去時間，動詞應使用過去式「watched」。"
  },
  {
    "id": "saa_g5_13",
    "track": "ministry-assessment",
    "targetGrade": 5,
    "book": 5,
    "unit": "SAA 五年級學力檢測",
    "section": "grammar",
    "taskType": "G-MC",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "How ______ milk do we need for the pancake recipe?",
    "options": [
      "much",
      "many",
      "long",
      "often"
    ],
    "answer": 0,
    "explanation": "milk（牛奶）為不可數名詞，詢問不可數名詞的數量應使用「How much」；How many 接可數複數名詞。"
  },
  {
    "id": "saa_g5_14",
    "track": "ministry-assessment",
    "targetGrade": 5,
    "book": 5,
    "unit": "SAA 五年級學力檢測",
    "section": "grammar",
    "taskType": "G-MC",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "Sam is taller ______ his elder sister Amy.",
    "options": [
      "than",
      "then",
      "that",
      "with"
    ],
    "answer": 0,
    "explanation": "形容詞比較級（taller）需搭配連接詞「than（比……）」引導比較對象。"
  },
  {
    "id": "saa_g5_15",
    "track": "ministry-assessment",
    "targetGrade": 5,
    "book": 5,
    "unit": "SAA 五年級學力檢測",
    "section": "vocabulary",
    "taskType": "V-MEAN",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "We should cross the street safely at the ______.",
    "options": [
      "crosswalk",
      "playground",
      "bedroom",
      "balcony"
    ],
    "answer": 0,
    "explanation": "安全穿越馬路的地點為斑馬線／行人穿越道 (crosswalk)。"
  },
  {
    "id": "saa_g5_16",
    "track": "ministry-assessment",
    "targetGrade": 5,
    "book": 5,
    "unit": "SAA 五年級學力檢測",
    "section": "grammar",
    "taskType": "G-MC",
    "difficulty": 3,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "A: Did your parents ______ to Tainan by high-speed rail?\nB: Yes, they did.",
    "options": [
      "travel",
      "traveled",
      "traveling",
      "travels"
    ],
    "answer": 0,
    "explanation": "助動詞 Did 引導的過去式問句，後方主要動詞必須還原為原形動詞「travel」。"
  },
  {
    "id": "saa_g5_17",
    "track": "ministry-assessment",
    "targetGrade": 5,
    "book": 5,
    "unit": "SAA 五年級學力檢測",
    "section": "reading",
    "taskType": "R-COMP",
    "difficulty": 2,
    "reviewed": true,
    "groupId": "saa_g5_passage_scout",
    "passage": {
      "title": "【營隊通告】Grade 5 Scout Summer Camp",
      "text": "WUTAI SCOUT ADVENTURE CAMP\nDates: July 12 - July 14\nLocation: Mountain Stream Camp Area\n\nDaily Activities:\n• Day 1: Tent Pitching & Campfire Welcome (18:30)\n• Day 2: Forest Trail Hiking & Bird Watching (08:30 - 15:00)\n• Day 3: River Safety & Graduation Badge Award\n\n* Things to bring: Flashlight, insect spray, refillable bottle, sports shoes.\n* Emergency contact: Scout Leader Chen (0912-345-678)"
    },
    "question": "How long is the Scout Summer Camp?",
    "options": [
      "Two days",
      "Three days",
      "Five days",
      "One week"
    ],
    "answer": 1,
    "explanation": "營隊日期為 July 12 至 July 14，共計三天 (Three days)。"
  },
  {
    "id": "saa_g5_18",
    "track": "ministry-assessment",
    "targetGrade": 5,
    "book": 5,
    "unit": "SAA 五年級學力檢測",
    "section": "reading",
    "taskType": "R-COMP",
    "difficulty": 2,
    "reviewed": true,
    "groupId": "saa_g5_passage_scout",
    "passage": {
      "title": "【營隊通告】Grade 5 Scout Summer Camp",
      "text": "WUTAI SCOUT ADVENTURE CAMP\nDates: July 12 - July 14\nLocation: Mountain Stream Camp Area\n\nDaily Activities:\n• Day 1: Tent Pitching & Campfire Welcome (18:30)\n• Day 2: Forest Trail Hiking & Bird Watching (08:30 - 15:00)\n• Day 3: River Safety & Graduation Badge Award\n\n* Things to bring: Flashlight, insect spray, refillable bottle, sports shoes.\n* Emergency contact: Scout Leader Chen (0912-345-678)"
    },
    "question": "On which day will students go hiking on the forest trail?",
    "options": [
      "Day 1",
      "Day 2",
      "Day 3",
      "Every evening"
    ],
    "answer": 1,
    "explanation": "日程表寫明「Day 2: Forest Trail Hiking & Bird Watching」，故在第二天 (Day 2)。"
  },
  {
    "id": "saa_g5_19",
    "track": "ministry-assessment",
    "targetGrade": 5,
    "book": 5,
    "unit": "SAA 五年級學力檢測",
    "section": "reading",
    "taskType": "R-COMP",
    "difficulty": 2,
    "reviewed": true,
    "groupId": "saa_g5_passage_scout",
    "passage": {
      "title": "【營隊通告】Grade 5 Scout Summer Camp",
      "text": "WUTAI SCOUT ADVENTURE CAMP\nDates: July 12 - July 14\nLocation: Mountain Stream Camp Area\n\nDaily Activities:\n• Day 1: Tent Pitching & Campfire Welcome (18:30)\n• Day 2: Forest Trail Hiking & Bird Watching (08:30 - 15:00)\n• Day 3: River Safety & Graduation Badge Award\n\n* Things to bring: Flashlight, insect spray, refillable bottle, sports shoes.\n* Emergency contact: Scout Leader Chen (0912-345-678)"
    },
    "question": "Which item is NOT on the list of things to bring?",
    "options": [
      "Flashlight",
      "Insect spray",
      "Smartphone gaming console",
      "Sports shoes"
    ],
    "answer": 2,
    "explanation": "攜帶清單包含手電筒 (Flashlight)、防蚊液 (Insect spray)、水壺與球鞋，未包含電玩遊戲機。"
  },
  {
    "id": "saa_g5_20",
    "track": "ministry-assessment",
    "targetGrade": 5,
    "book": 5,
    "unit": "SAA 五年級學力檢測",
    "section": "reading",
    "taskType": "R-COMP",
    "difficulty": 3,
    "reviewed": true,
    "groupId": "saa_g5_passage_scout",
    "passage": {
      "title": "【營隊通告】Grade 5 Scout Summer Camp",
      "text": "WUTAI SCOUT ADVENTURE CAMP\nDates: July 12 - July 14\nLocation: Mountain Stream Camp Area\n\nDaily Activities:\n• Day 1: Tent Pitching & Campfire Welcome (18:30)\n• Day 2: Forest Trail Hiking & Bird Watching (08:30 - 15:00)\n• Day 3: River Safety & Graduation Badge Award\n\n* Things to bring: Flashlight, insect spray, refillable bottle, sports shoes.\n* Emergency contact: Scout Leader Chen (0912-345-678)"
    },
    "question": "If a parent has an emergency, who should they call?",
    "options": [
      "Teacher Lin",
      "Scout Leader Chen",
      "The camp chef",
      "The bus driver"
    ],
    "answer": 1,
    "explanation": "通告末尾標示緊急聯絡人為「Scout Leader Chen（陳童軍團長）」，故選 Scout Leader Chen。"
  },
  {
    "id": "saa_g6_01",
    "track": "ministry-assessment",
    "targetGrade": 6,
    "book": 6,
    "unit": "SAA 六年級學力檢測",
    "section": "listening",
    "taskType": "L-SENT",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "Jenny is going to travel to Japan with her family next month.",
      "imageId": null
    },
    "question": "【聽力：辨識句意】請聽音檔，選出 Jenny 未來的計畫：\n（音檔：Jenny is going to travel to Japan with her family next month.）",
    "options": [
      "下個月將與家人去日本旅遊",
      "上個月剛從日本留學回國",
      "正在接待日本來的交換學生"
    ],
    "answer": 0,
    "explanation": "「is going to travel... next month」為未來式結構，表示下個月將去日本旅遊。"
  },
  {
    "id": "saa_g6_02",
    "track": "ministry-assessment",
    "targetGrade": 6,
    "book": 6,
    "unit": "SAA 六年級學力檢測",
    "section": "listening",
    "taskType": "L-QA",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "What's the matter with you, Kevin? You look pale.",
      "imageId": null
    },
    "question": "【聽力：基本問答】請聽問句，選出最適當的回應：\n（問句：What's the matter with you, Kevin? You look pale.）",
    "options": [
      "I have a terrible headache and fever.",
      "I am twelve years old.",
      "Yes, I am a good student."
    ],
    "answer": 0,
    "explanation": "「What's the matter? You look pale.」關心身體不適狀況（臉色蒼白），應回答身體症狀「I have a terrible headache and fever.（我頭痛且發燒）」。"
  },
  {
    "id": "saa_g6_03",
    "track": "ministry-assessment",
    "targetGrade": 6,
    "book": 6,
    "unit": "SAA 六年級學力檢測",
    "section": "listening",
    "taskType": "L-CONV",
    "difficulty": 3,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "Girl: Are you ready for the graduation speech tomorrow? Boy: I am so nervous! What if I forget the lines? Girl: Take a deep breath. You practiced many times and you will do great! Question: How does the boy feel?",
      "imageId": null
    },
    "question": "【聽力：言談理解】請聽對話與問題，選出正確答案：\n（對話：Girl: Ready for speech? Boy: I am nervous! Girl: Take a deep breath, you'll do great! 問題：How does the boy feel?）",
    "options": [
      "He feels nervous.",
      "He feels angry.",
      "He feels bored."
    ],
    "answer": 0,
    "explanation": "男孩說「I am so nervous!（我好緊張！）」，故心情為 nervous（緊張焦慮的）。"
  },
  {
    "id": "saa_g6_04",
    "track": "ministry-assessment",
    "targetGrade": 6,
    "book": 6,
    "unit": "SAA 六年級學力檢測",
    "section": "listening",
    "taskType": "L-SENT",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "Taking the metro is more convenient than driving in the city center.",
      "imageId": null
    },
    "question": "【聽力：辨識句意】請聽音檔，選出說話者的比較觀點：\n（音檔：Taking the metro is more convenient than driving in the city center.）",
    "options": [
      "在市中心搭捷運比開車更方便",
      "在市中心開車比搭捷運更快速",
      "在市中心走路比搭公車更輕鬆"
    ],
    "answer": 0,
    "explanation": "metro 為捷運，more convenient 為更方便，than driving 為比開車，整句意指在市中心搭捷運比開車更便利。"
  },
  {
    "id": "saa_g6_05",
    "track": "ministry-assessment",
    "targetGrade": 6,
    "book": 6,
    "unit": "SAA 六年級學力檢測",
    "section": "listening",
    "taskType": "L-QA",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "Have you ever been to the National Palace Museum in Taipei?",
      "imageId": null
    },
    "question": "【聽力：基本問答】請聽問句，選出最適當的回應：\n（問句：Have you ever been to the National Palace Museum?）",
    "options": [
      "Yes, I visited there with my classmates last year.",
      "No, I don't like reading books.",
      "It is ten o'clock."
    ],
    "answer": 0,
    "explanation": "現在完成式「Have you ever been to...」詢問曾否去過某地的經驗，回答「Yes, I visited there... last year.」完全吻合。"
  },
  {
    "id": "saa_g6_06",
    "track": "ministry-assessment",
    "targetGrade": 6,
    "book": 6,
    "unit": "SAA 六年級學力檢測",
    "section": "listening",
    "taskType": "L-CONV",
    "difficulty": 3,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "Man: Can you pass me the salt, please? Woman: Here you are. The soup smells delicious! Did you cook it yourself? Man: Yes, with fresh mushrooms from Wutai. Question: What are they doing?",
      "imageId": null
    },
    "question": "【聽力：言談理解】請聽對話與問題，選出正確答案：\n（對話：Man: Pass me the salt. Woman: Soup smells delicious! Did you cook it? Man: Yes. 問題：What are they doing?）",
    "options": [
      "Having a meal together",
      "Buying vegetables at a shop",
      "Playing a sport"
    ],
    "answer": 0,
    "explanation": "對話中互相傳遞鹽巴 (salt) 並稱讚湯聞起來美味 (soup smells delicious)，推論兩人正在一同用餐 (Having a meal together)。"
  },
  {
    "id": "saa_g6_07",
    "track": "ministry-assessment",
    "targetGrade": 6,
    "book": 6,
    "unit": "SAA 六年級學力檢測",
    "section": "listening",
    "taskType": "L-SENT",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "Although it was raining heavily, the soccer match continued.",
      "imageId": null
    },
    "question": "【聽力：辨識句意】請聽音檔，選出相符的事實情境：\n（音檔：Although it was raining heavily, the soccer match continued.）",
    "options": [
      "雖然下著大雨，足球賽仍持續進行",
      "因為雨勢過大，足球比賽被取消了",
      "足球隊員在室內體育館練習踢球"
    ],
    "answer": 0,
    "explanation": "Although 引導讓步子句（雖然下大雨），主句 the soccer match continued 表示比賽繼續進行。"
  },
  {
    "id": "saa_g6_08",
    "track": "ministry-assessment",
    "targetGrade": 6,
    "book": 6,
    "unit": "SAA 六年級學力檢測",
    "section": "listening",
    "taskType": "L-QA",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "Which sport do you like better, badminton or table tennis?",
      "imageId": null
    },
    "question": "【聽力：基本問答】請聽問句，選出最適當的回應：\n（問句：Which sport do you like better, badminton or table tennis?）",
    "options": [
      "I prefer badminton because it's fast and exciting.",
      "I have three rackets.",
      "The court is very clean."
    ],
    "answer": 0,
    "explanation": "詢問羽毛球與桌球更喜歡哪一個，回答「I prefer badminton...（我更喜歡羽毛球）」為標準對應答句。"
  },
  {
    "id": "saa_g6_09",
    "track": "ministry-assessment",
    "targetGrade": 6,
    "book": 6,
    "unit": "SAA 六年級學力檢測",
    "section": "listening",
    "taskType": "L-CONV",
    "difficulty": 3,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "Girl: Excuse me, does this train go to Kaohsiung? Conductor: No, miss. This is the local train to Pingtung. The express train to Kaohsiung is on platform three. Question: Where should the girl go?",
      "imageId": null
    },
    "question": "【聽力：言談理解】請聽對話與問題，選出正確答案：\n（對話：Girl: Does this train go to Kaohsiung? Conductor: No, express train is on platform 3. 問題：Where should the girl go?）",
    "options": [
      "To platform three",
      "To the ticket counter",
      "To the restroom"
    ],
    "answer": 0,
    "explanation": "列車長明確指引「The express train to Kaohsiung is on platform three.（往高雄的自強號在第三月台）」，故女孩應前往第三月台。"
  },
  {
    "id": "saa_g6_10",
    "track": "ministry-assessment",
    "targetGrade": 6,
    "book": 6,
    "unit": "SAA 六年級學力檢測",
    "section": "listening",
    "taskType": "L-QA",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": "Could you please help me carry this heavy carton of books?",
      "imageId": null
    },
    "question": "【聽力：基本問答】請聽問句，選出最適當的回應：\n（問句：Could you please help me carry this heavy carton of books?）",
    "options": [
      "No problem, let me take that for you.",
      "The book is very interesting.",
      "I bought it yesterday."
    ],
    "answer": 0,
    "explanation": "「Could you please help me...」請求幫忙搬重物，禮貌回應「No problem, let me take that for you.（沒問題，我來幫你拿）」最得體合宜。"
  },
  {
    "id": "saa_g6_11",
    "track": "ministry-assessment",
    "targetGrade": 6,
    "book": 6,
    "unit": "SAA 六年級學力檢測",
    "section": "grammar",
    "taskType": "G-MC",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "If it ______ sunny this Saturday, our class will go on a picnic in the botanical garden.",
    "options": [
      "is",
      "will be",
      "was",
      "were"
    ],
    "answer": 0,
    "explanation": "If 引導的條件子句中，若主要子句為未來式 (will go)，條件子句須用現在式 (is) 代替未來式。"
  },
  {
    "id": "saa_g6_12",
    "track": "ministry-assessment",
    "targetGrade": 6,
    "book": 6,
    "unit": "SAA 六年級學力檢測",
    "section": "vocabulary",
    "taskType": "V-MEAN",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "Saving electricity and reducing plastic waste are good ways to protect the ______.",
    "options": [
      "environment",
      "experiment",
      "instrument",
      "department"
    ],
    "answer": 0,
    "explanation": "節約用電與減少塑膠垃圾是保護「環境 (environment)」的好方法；experiment 為實驗，instrument 為樂器/儀器。"
  },
  {
    "id": "saa_g6_13",
    "track": "ministry-assessment",
    "targetGrade": 6,
    "book": 6,
    "unit": "SAA 六年級學力檢測",
    "section": "grammar",
    "taskType": "G-MC",
    "difficulty": 3,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "Linda enjoys ______ novels in her spare time.",
    "options": [
      "reading",
      "to read",
      "read",
      "reads"
    ],
    "answer": 0,
    "explanation": "動詞 enjoy 後方接動詞時，固定接動名詞 (V-ing)，故使用 reading。"
  },
  {
    "id": "saa_g6_14",
    "track": "ministry-assessment",
    "targetGrade": 6,
    "book": 6,
    "unit": "SAA 六年級學力檢測",
    "section": "vocabulary",
    "taskType": "V-MEAN",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "Our teacher asked us to speak ______ so that everyone in the big classroom could hear.",
    "options": [
      "loudly",
      "loud",
      "quietly",
      "hardly"
    ],
    "answer": 0,
    "explanation": "修飾動詞 speak 需用副詞「loudly（大聲地）」，使大教室裡的每個人都能聽見。"
  },
  {
    "id": "saa_g6_15",
    "track": "ministry-assessment",
    "targetGrade": 6,
    "book": 6,
    "unit": "SAA 六年級學力檢測",
    "section": "grammar",
    "taskType": "G-MC",
    "difficulty": 3,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "Mount Jade (Yushan) is the ______ mountain in Taiwan.",
    "options": [
      "highest",
      "higher",
      "high",
      "most high"
    ],
    "answer": 0,
    "explanation": "全臺灣最高峰（三者以上比較）須使用形容詞最高級「the highest」。"
  },
  {
    "id": "saa_g6_16",
    "track": "ministry-assessment",
    "targetGrade": 6,
    "book": 6,
    "unit": "SAA 六年級學力檢測",
    "section": "grammar",
    "taskType": "G-MC",
    "difficulty": 2,
    "reviewed": true,
    "groupId": null,
    "media": {
      "audioText": null,
      "imageId": null
    },
    "question": "Neither Mark nor his twin brothers ______ going to the concert tonight.",
    "options": [
      "are",
      "is",
      "am",
      "be"
    ],
    "answer": 0,
    "explanation": "Neither A nor B 連接兩主詞時，動詞形式依照最接近的動詞主詞決定；his twin brothers 為複數，故動詞用「are」。"
  },
  {
    "id": "saa_g6_17",
    "track": "ministry-assessment",
    "targetGrade": 6,
    "book": 6,
    "unit": "SAA 六年級學力檢測",
    "section": "reading",
    "taskType": "R-COMP",
    "difficulty": 2,
    "reviewed": true,
    "groupId": "saa_g6_passage_culture",
    "passage": {
      "title": "【文化特展】Rukai Indigenous Heritage Exhibition",
      "text": "SPECIAL EXHIBITION: SPIRIT OF THE MOUNTAIN STONE\nVenue: Wutai Indigenous Cultural Center\nPeriod: November 1 - December 31, 2026\nAdmission: Free for all students with school ID (Adults: $100)\n\nExhibition Highlights:\n1. Slate Stone Architecture: Learn how traditional slate stone slab houses keep cool in summer and warm in winter.\n2. Lily Flower & Hundred-Pacer Snake Symbolism: Discover sacred symbols in Rukai embroidery and woodcarving.\n3. Daily Guided Tours: 10:00 & 14:30 (45 minutes per session).\n\n* Audio guides in English, Chinese, and Rukai are available at the service desk."
    },
    "question": "How much is the admission fee for students with a school ID?",
    "options": [
      "Free",
      "$50",
      "$100",
      "$200"
    ],
    "answer": 0,
    "explanation": "展覽門票註明「Admission: Free for all students with school ID（學生持學生證免費入場）」，故為 Free（免費）。"
  },
  {
    "id": "saa_g6_18",
    "track": "ministry-assessment",
    "targetGrade": 6,
    "book": 6,
    "unit": "SAA 六年級學力檢測",
    "section": "reading",
    "taskType": "R-COMP",
    "difficulty": 2,
    "reviewed": true,
    "groupId": "saa_g6_passage_culture",
    "passage": {
      "title": "【文化特展】Rukai Indigenous Heritage Exhibition",
      "text": "SPECIAL EXHIBITION: SPIRIT OF THE MOUNTAIN STONE\nVenue: Wutai Indigenous Cultural Center\nPeriod: November 1 - December 31, 2026\nAdmission: Free for all students with school ID (Adults: $100)\n\nExhibition Highlights:\n1. Slate Stone Architecture: Learn how traditional slate stone slab houses keep cool in summer and warm in winter.\n2. Lily Flower & Hundred-Pacer Snake Symbolism: Discover sacred symbols in Rukai embroidery and woodcarving.\n3. Daily Guided Tours: 10:00 & 14:30 (45 minutes per session).\n\n* Audio guides in English, Chinese, and Rukai are available at the service desk."
    },
    "question": "What is special about the traditional slate stone slab houses?",
    "options": [
      "They keep cool in summer and warm in winter.",
      "They are made entirely of wood and glass.",
      "They can be moved easily from place to place.",
      "They have swimming pools inside."
    ],
    "answer": 0,
    "explanation": "亮點 1 說明石板屋的特點為「keep cool in summer and warm in winter（冬暖夏涼）」。"
  },
  {
    "id": "saa_g6_19",
    "track": "ministry-assessment",
    "targetGrade": 6,
    "book": 6,
    "unit": "SAA 六年級學力檢測",
    "section": "reading",
    "taskType": "R-COMP",
    "difficulty": 2,
    "reviewed": true,
    "groupId": "saa_g6_passage_culture",
    "passage": {
      "title": "【文化特展】Rukai Indigenous Heritage Exhibition",
      "text": "SPECIAL EXHIBITION: SPIRIT OF THE MOUNTAIN STONE\nVenue: Wutai Indigenous Cultural Center\nPeriod: November 1 - December 31, 2026\nAdmission: Free for all students with school ID (Adults: $100)\n\nExhibition Highlights:\n1. Slate Stone Architecture: Learn how traditional slate stone slab houses keep cool in summer and warm in winter.\n2. Lily Flower & Hundred-Pacer Snake Symbolism: Discover sacred symbols in Rukai embroidery and woodcarving.\n3. Daily Guided Tours: 10:00 & 14:30 (45 minutes per session).\n\n* Audio guides in English, Chinese, and Rukai are available at the service desk."
    },
    "question": "At what times can visitors join the guided tours?",
    "options": [
      "09:00 & 13:00",
      "10:00 & 14:30",
      "11:30 & 16:00",
      "Only on weekends"
    ],
    "answer": 1,
    "explanation": "亮點 3 註明每日導覽時段為「10:00 & 14:30」。"
  },
  {
    "id": "saa_g6_20",
    "track": "ministry-assessment",
    "targetGrade": 6,
    "book": 6,
    "unit": "SAA 六年級學力檢測",
    "section": "reading",
    "taskType": "R-COMP",
    "difficulty": 2,
    "reviewed": true,
    "groupId": "saa_g6_passage_culture",
    "passage": {
      "title": "【文化特展】Rukai Indigenous Heritage Exhibition",
      "text": "SPECIAL EXHIBITION: SPIRIT OF THE MOUNTAIN STONE\nVenue: Wutai Indigenous Cultural Center\nPeriod: November 1 - December 31, 2026\nAdmission: Free for all students with school ID (Adults: $100)\n\nExhibition Highlights:\n1. Slate Stone Architecture: Learn how traditional slate stone slab houses keep cool in summer and warm in winter.\n2. Lily Flower & Hundred-Pacer Snake Symbolism: Discover sacred symbols in Rukai embroidery and woodcarving.\n3. Daily Guided Tours: 10:00 & 14:30 (45 minutes per session).\n\n* Audio guides in English, Chinese, and Rukai are available at the service desk."
    },
    "question": "Which languages are supported by the exhibition's audio guides?",
    "options": [
      "English, Chinese, and Rukai",
      "English, French, and German",
      "Japanese, Korean, and Chinese",
      "Only English"
    ],
    "answer": 0,
    "explanation": "特展備註指明「Audio guides in English, Chinese, and Rukai are available（提供英語、中文與魯凱語語音導覽）」。"
  }
];

export const SAA_EXAM_BANK = [
  ...SAA_115_ALL_QUESTIONS,
  ...SAA_SIMULATED_BANK
];
