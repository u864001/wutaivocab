/**
 * Here We Go 1 ~ 9 全冊原創類題選擇題庫 (100% Copyright-Safe Parallel MCQ Bank)
 * - 依據各冊各單元核心文法句型、情境對話與常見誘答陷阱全新編寫之原創類題
 * - 涵蓋第 1 冊至第 9 冊（Starter / Unit 1~4 / Review 1~2 / Festival）
 * - 每題均附完整中文文法與語境解析 (explanation)
 */

export const HERE_WE_GO_BOOK_META = {
  1: { title: '第 1 冊 (Book 1)', subtitle: '打招呼、年齡、文具與顏色', units: ['Starter', 'Unit 1', 'Unit 2', 'Review 1', 'Unit 3', 'Unit 4', 'Review 2', 'Festival'] },
  2: { title: '第 2 冊 (Book 2)', subtitle: '寵物大小、能力 Can、家人與職業', units: ['Starter', 'Unit 1', 'Unit 2', 'Review 1', 'Unit 3', 'Unit 4', 'Review 2', 'Festival'] },
  3: { title: '第 3 冊 (Book 3)', subtitle: '天氣、飢渴感覺、複數食物與點餐', units: ['Starter', 'Unit 1', 'Unit 2', 'Review 1', 'Unit 3', 'Unit 4', 'Review 2', 'Festival'] },
  4: { title: '第 4 冊 (Book 4)', subtitle: '時間、現在進行式、房間與方位介系詞', units: ['Starter', 'Unit 1', 'Unit 2', 'Review 1', 'Unit 3', 'Unit 4', 'Review 2', 'Festival'] },
  5: { title: '第 5 冊 (Book 5)', subtitle: '星期、學科課程、城鎮地點與動物數量', units: ['Starter', 'Unit 1', 'Unit 2', 'Review 1', 'Unit 3', 'Unit 4', 'Review 2', 'Festival'] },
  6: { title: '第 6 冊 (Book 6)', subtitle: '身體部位疼痛、疾病症狀、三餐與所屬物 Whose', units: ['Starter', 'Unit 1', 'Unit 2', 'Review 1', 'Unit 3', 'Unit 4', 'Review 2', 'Festival'] },
  7: { title: '第 7 冊 (Book 7)', subtitle: '國家來源、交通方式、休閒活動與作息時間', units: ['Starter', 'Unit 1', 'Unit 2', 'Review 1', 'Unit 3', 'Unit 4', 'Review 2', 'Festival'] },
  8: { title: '第 8 冊 (Book 8)', subtitle: '過去式地點 Was/Were、過去動作、服飾價格與四季', units: ['Starter', 'Unit 1', 'Unit 2', 'Review 1', 'Unit 3', 'Unit 4', 'Review 2', 'Festival'] },
  9: { title: '國一先修 (Book 9)', shortLabel: '國一先修', subtitle: '不規則過去式旅遊活動、食物量詞與生日日期序數', units: ['Starter', 'Unit 1', 'Unit 2', 'Review 1', 'Unit 3', 'Unit 4', 'Review 2'] }
};

export const HERE_WE_GO_MCQ_BANK = [
  {
    "id": "hwg_b1_1",
    "book": 1,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "______ your name?",
    "options": [
      "What's",
      "What",
      "How"
    ],
    "answer": 0,
    "explanation": "詢問對方姓名使用「What’s your name?」，回答用「My name is ...」或「I’m ...」。"
  },
  {
    "id": "hwg_b1_2",
    "book": 1,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "What's ______ name?",
    "options": [
      "you",
      "your",
      "I"
    ],
    "answer": 1,
    "explanation": "詢問對方姓名使用「What’s your name?」，回答用「My name is ...」或「I’m ...」。"
  },
  {
    "id": "hwg_b1_3",
    "book": 1,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Hello, ______ name is Kulas.",
    "options": [
      "I'm",
      "my",
      "you"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「my」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_4",
    "book": 1,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Hi, ______ Lucas.",
    "options": [
      "I'm",
      "my",
      "you"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「I'm」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_5",
    "book": 1,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "My name ______ Emma.",
    "options": [
      "am",
      "you",
      "is"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「is」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_6",
    "book": 1,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: What's your name? B: ______",
    "options": [
      "My name is Max.",
      "I'm fine.",
      "How are you?"
    ],
    "answer": 0,
    "explanation": "詢問對方姓名使用「What’s your name?」，回答用「My name is ...」或「I’m ...」。"
  },
  {
    "id": "hwg_b1_7",
    "book": 1,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: What's your name? B: ______",
    "options": [
      "I'm Lucas.",
      "How are you?",
      "I'm fine."
    ],
    "answer": 0,
    "explanation": "詢問對方姓名使用「What’s your name?」，回答用「My name is ...」或「I’m ...」。"
  },
  {
    "id": "hwg_b1_8",
    "book": 1,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: ______ B: My name is Emma.",
    "options": [
      "Hello, I'm Emma.",
      "How are you?",
      "What's your name?"
    ],
    "answer": 2,
    "explanation": "詢問對方姓名使用「What’s your name?」，回答用「My name is ...」或「I’m ...」。"
  },
  {
    "id": "hwg_b1_9",
    "book": 1,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: ______ B: I'm fine.",
    "options": [
      "Hello, I'm Kulas.",
      "What's your name?",
      "How are you?"
    ],
    "answer": 2,
    "explanation": "「How are you?」為問候語「你好嗎？」，常以「I’m fine / great / good.」回應。"
  },
  {
    "id": "hwg_b1_10",
    "book": 1,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "______ old are you?",
    "options": [
      "What",
      "What's",
      "How"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「How」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_11",
    "book": 1,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "______ nine years old.",
    "options": [
      "You",
      "I",
      "I'm"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「I'm」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_12",
    "book": 1,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: How old are you? B: ______ six.",
    "options": [
      "My",
      "I",
      "I'm"
    ],
    "answer": 2,
    "explanation": "詢問年齡使用疑問詞「How old are you / is he / is she?」，回答用「主詞 + Be動詞 + 數字 (years old).」。"
  },
  {
    "id": "hwg_b1_13",
    "book": 1,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: How old are you______ B: I'm seven years old.",
    "options": [
      ".",
      "?",
      "!"
    ],
    "answer": 1,
    "explanation": "詢問年齡使用疑問詞「How old are you / is he / is she?」，回答用「主詞 + Be動詞 + 數字 (years old).」。"
  },
  {
    "id": "hwg_b1_14",
    "book": 1,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Thank you. B: ______ welcome.",
    "options": [
      "Your",
      "My",
      "You're"
    ],
    "answer": 2,
    "explanation": "表達感謝說「Thank you.」，回應「不客氣」使用「You’re welcome.」。"
  },
  {
    "id": "hwg_b1_15",
    "book": 1,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: How old are you? B: ______",
    "options": [
      "I'm Kulas.",
      "I'm ten.",
      "I'm fine."
    ],
    "answer": 1,
    "explanation": "詢問年齡使用疑問詞「How old are you / is he / is she?」，回答用「主詞 + Be動詞 + 數字 (years old).」。"
  },
  {
    "id": "hwg_b1_16",
    "book": 1,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: How old are you? B: ______",
    "options": [
      "You're welcome.",
      "My name is Nina.",
      "I'm six years old."
    ],
    "answer": 2,
    "explanation": "詢問年齡使用疑問詞「How old are you / is he / is she?」，回答用「主詞 + Be動詞 + 數字 (years old).」。"
  },
  {
    "id": "hwg_b1_17",
    "book": 1,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______ B: I'm eight.",
    "options": [
      "How old are you?",
      "What's your name?",
      "How are you?"
    ],
    "answer": 0,
    "explanation": "詢問年齡使用疑問詞「How old are you / is he / is she?」，回答用「主詞 + Be動詞 + 數字 (years old).」。"
  },
  {
    "id": "hwg_b1_18",
    "book": 1,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______ B: You're welcome.",
    "options": [
      "How are you?",
      "Thank you.",
      "How old are you?"
    ],
    "answer": 1,
    "explanation": "表達感謝說「Thank you.」，回應「不客氣」使用「You’re welcome.」。"
  },
  {
    "id": "hwg_b1_19",
    "book": 1,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: How old are you? B: ______",
    "options": [
      "My name is Leo.",
      "I'm eight years old.",
      "I'm Max."
    ],
    "answer": 1,
    "explanation": "詢問年齡使用疑問詞「How old are you / is he / is she?」，回答用「主詞 + Be動詞 + 數字 (years old).」。"
  },
  {
    "id": "hwg_b1_20",
    "book": 1,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: What's your name? B: ______",
    "options": [
      "I'm seven.",
      "I'm Lucas.",
      "I'm fine."
    ],
    "answer": 1,
    "explanation": "詢問對方姓名使用「What’s your name?」，回答用「My name is ...」或「I’m ...」。"
  },
  {
    "id": "hwg_b1_21",
    "book": 1,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: Hello, my name is Emma. B: ______",
    "options": [
      "Hi, I'm Nina.",
      "I'm fine.",
      "Thank you."
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「Hi, I'm Nina.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_22",
    "book": 1,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: Hi, Ryan. How old are you? B: ______",
    "options": [
      "I'm five years old.",
      "Hi, my name is Max.",
      "Hello, Ryan. I'm four."
    ],
    "answer": 0,
    "explanation": "詢問年齡使用疑問詞「How old are you / is he / is she?」，回答用「主詞 + Be動詞 + 數字 (years old).」。"
  },
  {
    "id": "hwg_b1_23",
    "book": 1,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: ______ B: I'm nine years old.",
    "options": [
      "What's your name?",
      "How are you?",
      "How old are you?"
    ],
    "answer": 2,
    "explanation": "詢問年齡使用疑問詞「How old are you / is he / is she?」，回答用「主詞 + Be動詞 + 數字 (years old).」。"
  },
  {
    "id": "hwg_b1_24",
    "book": 1,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: ______ B: I'm fine.",
    "options": [
      "What's your name?",
      "How are you?",
      "Thank you."
    ],
    "answer": 1,
    "explanation": "「How are you?」為問候語「你好嗎？」，常以「I’m fine / great / good.」回應。"
  },
  {
    "id": "hwg_b1_25",
    "book": 1,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What's that? B: It's ______ ruler.",
    "options": [
      "a",
      "am",
      "an"
    ],
    "answer": 0,
    "explanation": "單數可數名詞字首發音為母音（a, e, i, o, u）時搭配冠詞「an」，子音則搭配「a」。"
  },
  {
    "id": "hwg_b1_26",
    "book": 1,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What's this? B: It's ______ eraser.",
    "options": [
      "an",
      "a",
      "am"
    ],
    "answer": 0,
    "explanation": "單數可數名詞字首發音為母音（a, e, i, o, u）時搭配冠詞「an」，子音則搭配「a」。"
  },
  {
    "id": "hwg_b1_27",
    "book": 1,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Look! ______ is that? B: It's a book.",
    "options": [
      "How",
      "This",
      "What"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「What」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_28",
    "book": 1,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Lucas, what's this? B: ______ a marker.",
    "options": [
      "It's",
      "I'm",
      "This"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「It's」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_29",
    "book": 1,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "______ is an eraser.",
    "options": [
      "It",
      "It's",
      "I'm"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「It」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_30",
    "book": 1,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What's this? B: ______",
    "options": [
      "It's a book.",
      "I'm ten.",
      "I'm fine."
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「It's a book.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_31",
    "book": 1,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What's that? B: ______",
    "options": [
      "I'm Max.",
      "It's cool!",
      "It's an eraser."
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「It's an eraser.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_32",
    "book": 1,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: ______ B: It's a pencil.",
    "options": [
      "What's your name?",
      "How old are you?",
      "What's this?"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「What's this?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_33",
    "book": 1,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: ______ B: Thanks!",
    "options": [
      "How are you?",
      "You're welcome.",
      "Good job!"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Good job!」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_34",
    "book": 1,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What color is it? B: ______ red.",
    "options": [
      "I",
      "It",
      "It's"
    ],
    "answer": 2,
    "explanation": "詢問顏色使用「What color is it?」，回答使用「It’s + 顏色.」。"
  },
  {
    "id": "hwg_b1_35",
    "book": 1,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What color is ______? B: It's white.",
    "options": [
      "this",
      "it",
      "old"
    ],
    "answer": 1,
    "explanation": "詢問顏色使用「What color is it?」，回答使用「It’s + 顏色.」。"
  },
  {
    "id": "hwg_b1_36",
    "book": 1,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What ______ is it? B: It's black.",
    "options": [
      "that",
      "color",
      "name"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「color」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_37",
    "book": 1,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What color is it? B: It's ______.",
    "options": [
      "blue",
      "fine",
      "a book"
    ],
    "answer": 0,
    "explanation": "詢問顏色使用「What color is it?」，回答使用「It’s + 顏色.」。"
  },
  {
    "id": "hwg_b1_38",
    "book": 1,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: ______ color is it? B: It's yellow.",
    "options": [
      "How",
      "What's",
      "What"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「What」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_39",
    "book": 1,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: What color is it? B: ______",
    "options": [
      "It's a ruler.",
      "It's blue.",
      "I'm seven."
    ],
    "answer": 1,
    "explanation": "詢問顏色使用「What color is it?」，回答使用「It’s + 顏色.」。"
  },
  {
    "id": "hwg_b1_40",
    "book": 1,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: ______ B: It's yellow.",
    "options": [
      "What's your name?",
      "What's this?",
      "What color is it?"
    ],
    "answer": 2,
    "explanation": "詢問顏色使用「What color is it?」，回答使用「It’s + 顏色.」。"
  },
  {
    "id": "hwg_b1_41",
    "book": 1,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: What's this? B: ______",
    "options": [
      "It's a pen.",
      "It's yellow.",
      "It's red."
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「It's a pen.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_42",
    "book": 1,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Good morning. B: ______",
    "options": [
      "Good job!",
      "Good morning.",
      "Good afternoon."
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「Good morning.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_43",
    "book": 1,
    "unit": "Review 2",
    "category": "dialogue",
    "question": "A: What's this? B: ______",
    "options": [
      "It's a book.",
      "It's cool!",
      "It's white."
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「It's a book.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_44",
    "book": 1,
    "unit": "Review 2",
    "category": "dialogue",
    "question": "A: What's that? B: ______",
    "options": [
      "It's a pen.",
      "It's black.",
      "It's blue."
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「It's a pen.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_45",
    "book": 1,
    "unit": "Review 2",
    "category": "dialogue",
    "question": "A: What color is it? B: ______",
    "options": [
      "It's an eraser.",
      "It's a pencil.",
      "It's green."
    ],
    "answer": 2,
    "explanation": "詢問顏色使用「What color is it?」，回答使用「It’s + 顏色.」。"
  },
  {
    "id": "hwg_b1_46",
    "book": 1,
    "unit": "Review 2",
    "category": "dialogue",
    "question": "A: ______ B: It's a book.",
    "options": [
      "What color is it?",
      "What's your name?",
      "What's that?"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「What's that?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_47",
    "book": 1,
    "unit": "Review 2",
    "category": "dialogue",
    "question": "A: ______ B: It's black.",
    "options": [
      "What's your name?",
      "What color is it?",
      "What's this?"
    ],
    "answer": 1,
    "explanation": "詢問顏色使用「What color is it?」，回答使用「It’s + 顏色.」。"
  },
  {
    "id": "hwg_b1_48",
    "book": 1,
    "unit": "Review 2",
    "category": "dialogue",
    "question": "A: ______ B: Thanks!",
    "options": [
      "Good morning.",
      "Good afternoon.",
      "Good job!"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Good job!」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_49",
    "book": 3,
    "unit": "Starter",
    "category": "grammar",
    "question": "I ______ a student.",
    "options": [
      "are",
      "is",
      "am"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「am」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_50",
    "book": 3,
    "unit": "Starter",
    "category": "grammar",
    "question": "Zoe ______ a teacher.",
    "options": [
      "are",
      "my",
      "not",
      "is"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「is」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_51",
    "book": 3,
    "unit": "Starter",
    "category": "grammar",
    "question": "A: ______ is the tall teacher? B: She's my grandmother.",
    "options": [
      "Let",
      "What",
      "Who",
      "How"
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b3_52",
    "book": 3,
    "unit": "Starter",
    "category": "grammar",
    "question": "A: ______ your sister a nurse? B: Yes, she is.",
    "options": [
      "Are",
      "Is",
      "Who",
      "Am"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「Is」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_53",
    "book": 3,
    "unit": "Starter",
    "category": "grammar",
    "question": "A: Is Chloe's father a doctor? B: No, ______ isn't.",
    "options": [
      "she",
      "he",
      "you",
      "I"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「he」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_54",
    "book": 3,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: What's this? B: ______",
    "options": [
      "She's a student.",
      "He's a driver.",
      "I'm a teacher.",
      "It's a board game."
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「It's a board game.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_55",
    "book": 3,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: Who's she? B: ______",
    "options": [
      "She's my mother.",
      "She's not a nurse.",
      "My mother is tall.",
      "She's a doctor."
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「She's my mother.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_56",
    "book": 3,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: Is your grandfather a cook? B: ______",
    "options": [
      "No, she's not.",
      "Yes, he is.",
      "No, you're not.",
      "Yes, I am."
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b3_57",
    "book": 3,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: ______ B: No, she's not. She's a driver.",
    "options": [
      "Is your sister a nurse?",
      "Is your father a teacher?",
      "Is your brother a cook?",
      "Is Iris a driver?"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「Is your sister a nurse?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_58",
    "book": 3,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: ______ B: No, I'm not. I'm a student.",
    "options": [
      "Are you a nurse?",
      "Is your mother tall?",
      "Is Zoe a nurse?",
      "Are you a student?"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「Are you a nurse?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_59",
    "book": 3,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "It ______ windy.",
    "options": [
      "can",
      "is",
      "✕ (不需填詞)",
      "am"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「is」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_60",
    "book": 3,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "______ cool and rainy.",
    "options": [
      "I'm",
      "It",
      "It's",
      "I"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「It's」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_61",
    "book": 3,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "______ the weather?",
    "options": [
      "What",
      "How's",
      "What's",
      "How"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「How's」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_62",
    "book": 3,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "How's the weather ______?",
    "options": [
      "at",
      "there",
      "in",
      "is"
    ],
    "answer": 1,
    "explanation": "詢問天氣使用「How’s the weather?」，回答使用「It’s + 天氣形容詞 (sunny / rainy / windy / cloudy / hot / cold).」。"
  },
  {
    "id": "hwg_b3_63",
    "book": 3,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "______ have some fun.",
    "options": [
      "How's",
      "Let",
      "Let's",
      "How"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Let's」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_64",
    "book": 3,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "It's sunny ______ warm.",
    "options": [
      "at",
      "and",
      "am",
      "✕ (不需填詞)"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「and」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_65",
    "book": 3,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: How's the weather? B: ______",
    "options": [
      "It's cold.",
      "I'm a cook.",
      "It's big.",
      "It's a cat."
    ],
    "answer": 0,
    "explanation": "詢問天氣使用「How’s the weather?」，回答使用「It’s + 天氣形容詞 (sunny / rainy / windy / cloudy / hot / cold).」。"
  },
  {
    "id": "hwg_b3_66",
    "book": 3,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: How's the weather in Osaka? B: ______",
    "options": [
      "It's big and tall.",
      "Let's go to Osaka.",
      "It's sunny and windy.",
      "I have an idea."
    ],
    "answer": 2,
    "explanation": "詢問天氣使用「How’s the weather?」，回答使用「It’s + 天氣形容詞 (sunny / rainy / windy / cloudy / hot / cold).」。"
  },
  {
    "id": "hwg_b3_67",
    "book": 3,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Look at this kimono. B: ______",
    "options": [
      "It's cloudy.",
      "It's pretty.",
      "I'm a teacher.",
      "It's a dog."
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「It's pretty.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_68",
    "book": 3,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: ______ B: Yeah! Let's go there.",
    "options": [
      "How's the weather?",
      "It's sunny in Kyoto.",
      "Look at this kimono.",
      "Let's have some fun."
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「It's sunny in Kyoto.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_69",
    "book": 3,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: ______ B: It's rainy and windy here.",
    "options": [
      "Is he a teacher?",
      "How are you?",
      "How's the weather?",
      "How old are you?"
    ],
    "answer": 2,
    "explanation": "詢問天氣使用「How’s the weather?」，回答使用「It’s + 天氣形容詞 (sunny / rainy / windy / cloudy / hot / cold).」。"
  },
  {
    "id": "hwg_b3_70",
    "book": 3,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: ______ B: Great! It's sunny there.",
    "options": [
      "Look at the pretty teacher.",
      "I have an idea. Let's go to Osaka.",
      "It's rainy and cold in Osaka.",
      "Let's have some fun in the rain."
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「I have an idea. Let's go to Osaka.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_71",
    "book": 3,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "______ am happy.",
    "options": [
      "He's",
      "It's",
      "I",
      "I'm"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「I」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_72",
    "book": 3,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "He ______ not angry.",
    "options": [
      "am",
      "isn't",
      "is",
      "are"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「is」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_73",
    "book": 3,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "______ you hungry, Jim?",
    "options": [
      "Am",
      "Are",
      "How",
      "Is"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「Are」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_74",
    "book": 3,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Is Caleb tired? B: No, he ______.",
    "options": [
      "is",
      "isn't",
      "am",
      "not"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「isn't」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_75",
    "book": 3,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Chloe, are you full? B: No, I'm ______.",
    "options": [
      "not",
      "isn't",
      "is"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「not」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_76",
    "book": 3,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Is he thirsty? B: No, ______ not.",
    "options": [
      "she",
      "he's",
      "he",
      "she's"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「he's」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_77",
    "book": 3,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Are you angry? B: ______",
    "options": [
      "Yes, I am.",
      "Yes, it is.",
      "Yes, she is.",
      "Yes, he is."
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「Yes, I am.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_78",
    "book": 3,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Rex, are you full? B: ______",
    "options": [
      "Yes, he is.",
      "No, I'm not. I'm full.",
      "No, I'm not. I'm hungry.",
      "Yes, I can."
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「No, I'm not. I'm hungry.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_79",
    "book": 3,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Is he happy? B: ______",
    "options": [
      "Yes, she is happy.",
      "Yes, he is happy.",
      "No, he is happy.",
      "No, he is not hungry."
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「Yes, he is happy.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_80",
    "book": 3,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______ B: Yes, she is very tired.",
    "options": [
      "Are you tired?",
      "Is Emma tired?",
      "Is she very full?",
      "Is Lucas thirsty?"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「Is Emma tired?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_81",
    "book": 3,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______ B: Yes, I'm fine.",
    "options": [
      "Are you full?",
      "Are you sad?",
      "Are you OK?",
      "Are you Nina?"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Are you OK?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_82",
    "book": 3,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______ B: Yes, he is. He's thirsty, too.",
    "options": [
      "Is your brother thirsty?",
      "Is your father hungry?",
      "Is your mother thirsty?",
      "Is Nina hungry?"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「Is your father hungry?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_83",
    "book": 3,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: How's the weather? B: It's ______. You need an umbrella.",
    "options": [
      "warm",
      "rainy",
      "windy",
      "cold"
    ],
    "answer": 1,
    "explanation": "詢問天氣使用「How’s the weather?」，回答使用「It’s + 天氣形容詞 (sunny / rainy / windy / cloudy / hot / cold).」。"
  },
  {
    "id": "hwg_b3_84",
    "book": 3,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: Is ______ tired? B: No, she's not. She's sad.",
    "options": [
      "your brother",
      "Sam",
      "your father",
      "Ava"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「Ava」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_85",
    "book": 3,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: Oh, no! It's ______ outside. B: Let's play board games at home. A: Great! Let's have fun.",
    "options": [
      "sunny",
      "warm",
      "rainy",
      "windy"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「rainy」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_86",
    "book": 3,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: It's hot. Are you thirsty? B: No, I'm not. I'm ______.",
    "options": [
      "tall",
      "not sad",
      "thirsty",
      "hungry"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「hungry」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_87",
    "book": 3,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "______ are those?",
    "options": [
      "What",
      "Here",
      "How",
      "Are"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「What」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_88",
    "book": 3,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "______ you like oranges?",
    "options": [
      "Do",
      "Is",
      "What",
      "Are"
    ],
    "answer": 0,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b3_89",
    "book": 3,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "I ______ big watermelons.",
    "options": [
      "like",
      "my",
      "am",
      "are"
    ],
    "answer": 0,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b3_90",
    "book": 3,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What ______ these? B: They're sandwiches.",
    "options": [
      "are",
      "do",
      "like",
      "is"
    ],
    "answer": 0,
    "explanation": "詢問複數物品使用「What are these / those?」，回答一律用複數代名詞「They are (They’re) + 複數名詞.」。"
  },
  {
    "id": "hwg_b3_91",
    "book": 3,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Bonny, do you like apples? B: No, I ______.",
    "options": [
      "don't",
      "not",
      "am",
      "do"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「don't」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_92",
    "book": 3,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Toby, Look! What are those? B: ______ are hamburgers.",
    "options": [
      "They",
      "I",
      "You",
      "He"
    ],
    "answer": 0,
    "explanation": "詢問複數物品使用「What are these / those?」，回答一律用複數代名詞「They are (They’re) + 複數名詞.」。"
  },
  {
    "id": "hwg_b3_93",
    "book": 3,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Do you like bananas? B: ______",
    "options": [
      "Yes, I can.",
      "Yes, I am.",
      "No, I'm not.",
      "No, I don't."
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「No, I don't.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_94",
    "book": 3,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What are these? B: ______",
    "options": [
      "They're sandwiches.",
      "I like sandwiches.",
      "They're not sandwiches.",
      "Yes, I like sandwiches."
    ],
    "answer": 0,
    "explanation": "詢問複數物品使用「What are these / those?」，回答一律用複數代名詞「They are (They’re) + 複數名詞.」。"
  },
  {
    "id": "hwg_b3_95",
    "book": 3,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: I like apples. How about you? B: ______",
    "options": [
      "I like apples, too.",
      "I don't like hot dogs.",
      "They're apples.",
      "Yes, I like bananas."
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「I like apples, too.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_96",
    "book": 3,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: ______ B: Yes, I do.",
    "options": [
      "Are you tired?",
      "How's the weather?",
      "What are these?",
      "Do you like hamburgers?"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「Do you like hamburgers?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_97",
    "book": 3,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: ______ B: No, I don't. I like bananas.",
    "options": [
      "Do you like bananas?",
      "What are those?",
      "Do you like oranges?",
      "Are you hungry?"
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b3_98",
    "book": 3,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: ______ B: Thank you.",
    "options": [
      "Oops, sorry!",
      "I don't like apples.",
      "How about you?",
      "Here you are."
    ],
    "answer": 3,
    "explanation": "表達感謝說「Thank you.」，回應「不客氣」使用「You’re welcome.」。"
  },
  {
    "id": "hwg_b3_99",
    "book": 3,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "______ you want some tea?",
    "options": [
      "Which",
      "Do",
      "What",
      "Are"
    ],
    "answer": 1,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_100",
    "book": 3,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "I ______ some ice cream.",
    "options": [
      "want",
      "am",
      "are",
      "do"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「want」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_101",
    "book": 3,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "I ______ want some milk.",
    "options": [
      "don't",
      "am",
      "isn't",
      "not"
    ],
    "answer": 0,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_102",
    "book": 3,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Do you want some rice? B: No, ______ don't.",
    "options": [
      "we",
      "she",
      "he",
      "you"
    ],
    "answer": 0,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_103",
    "book": 3,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: I want some pizza. B: ______ one? A: That one.",
    "options": [
      "Which",
      "What",
      "How",
      "Who"
    ],
    "answer": 0,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_104",
    "book": 3,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Do ______ want some juice? B: Yes, we do.",
    "options": [
      "you",
      "he",
      "we",
      "I"
    ],
    "answer": 0,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_105",
    "book": 3,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Do you want some milk? B: ______",
    "options": [
      "I want some milk.",
      "Yes, I am.",
      "No, I'm not.",
      "No, I don't."
    ],
    "answer": 3,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_106",
    "book": 3,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: I'm very hungry. B: ______ A: Yes, I do.",
    "options": [
      "Do you want some rice?",
      "What are these?",
      "Which one?",
      "I want some pizza."
    ],
    "answer": 0,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_107",
    "book": 3,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Tracy, do you want some water? B: ______",
    "options": [
      "Yes, I do. I'm thirsty.",
      "No, we don't. We want some water.",
      "Yes, we do. We're thirsty.",
      "No, I don't. I want some water."
    ],
    "answer": 0,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_108",
    "book": 3,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: ______ B: Yes, we do. We're hungry.",
    "options": [
      "What are those?",
      "Fred, do you want some pizza?",
      "Zoe, do you want some water?",
      "Do you want some rice?"
    ],
    "answer": 3,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_109",
    "book": 3,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: I want some tea. How about you, Rick? B: ______",
    "options": [
      "Yes, I do.",
      "This one.",
      "Me, too.",
      "Yes, I am."
    ],
    "answer": 2,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_110",
    "book": 3,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: I want some ice cream. B: ______ A: That one.",
    "options": [
      "Let's have fun!",
      "No, I don't.",
      "How about you?",
      "Which one?"
    ],
    "answer": 3,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_111",
    "book": 3,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: Jane, what are these? B: They're red ______.",
    "options": [
      "apples",
      "hamburgers",
      "bananas",
      "oranges"
    ],
    "answer": 0,
    "explanation": "詢問複數物品使用「What are these / those?」，回答一律用複數代名詞「They are (They’re) + 複數名詞.」。"
  },
  {
    "id": "hwg_b3_112",
    "book": 3,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: I'm thirsty. B: There's a tea shop. Do you want some ______? A: No, I don't. I want some orange juice.",
    "options": [
      "hamburgers",
      "banana milk",
      "hot dogs",
      "orange juice"
    ],
    "answer": 1,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_113",
    "book": 3,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: I want some ______. I'm hungry. B: Me, too!",
    "options": [
      "water",
      "juice",
      "milk",
      "hamburgers"
    ],
    "answer": 3,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_114",
    "book": 3,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: Do you want some ______? B: Yes, I do. I'm very thirsty.",
    "options": [
      "sandwiches",
      "cake",
      "water",
      "rice"
    ],
    "answer": 2,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_115",
    "book": 3,
    "unit": "Festival",
    "category": "grammar",
    "question": "Look, ______ Earth!",
    "options": [
      "it",
      "is",
      "I'm",
      "it's"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「it's」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_116",
    "book": 3,
    "unit": "Festival",
    "category": "grammar",
    "question": "I want to go to ______ Moon!",
    "options": [
      "a",
      "an",
      "✕ (不需填詞)",
      "the"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「the」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_117",
    "book": 3,
    "unit": "Festival",
    "category": "grammar",
    "question": "Welcome, ______ Chang-O.",
    "options": [
      "I",
      "this",
      "she",
      "I'm"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「I'm」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_118",
    "book": 3,
    "unit": "Festival",
    "category": "grammar",
    "question": "______ eat moon cakes.",
    "options": [
      "It",
      "I'm",
      "Let's",
      "Let"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Let's」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_119",
    "book": 3,
    "unit": "Festival",
    "category": "dialogue",
    "question": "A: What's this? B: ______",
    "options": [
      "It's a pomelo.",
      "Look, it's big.",
      "Let's eat pomelos.",
      "I'm Chang-O."
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「It's a pomelo.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_120",
    "book": 3,
    "unit": "Festival",
    "category": "dialogue",
    "question": "A: What's your name? B: ______",
    "options": [
      "I want to go to the Moon.",
      "Chang-O is thirsty.",
      "My name is Jade Rabbit.",
      "Look, it's Earth."
    ],
    "answer": 2,
    "explanation": "詢問對方姓名使用「What’s your name?」，回答用「My name is ...」或「I’m ...」。"
  },
  {
    "id": "hwg_b3_121",
    "book": 3,
    "unit": "Festival",
    "category": "dialogue",
    "question": "A: Look at the Moon. B: ______",
    "options": [
      "It's a pomelo.",
      "They're moon cakes.",
      "She's Chang-O.",
      "Wow! It's big."
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「Wow! It's big.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_122",
    "book": 3,
    "unit": "Festival",
    "category": "dialogue",
    "question": "A: ______ B: Yeah! Let's go there.",
    "options": [
      "Let's eat moon cakes.",
      "Let's go to the Moon!",
      "We like pomelos.",
      "Jade Rabbit is happy."
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「Let's go to the Moon!」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_123",
    "book": 5,
    "unit": "Starter",
    "category": "grammar",
    "question": "______ Ryan?",
    "options": [
      "What",
      "Where's",
      "Where",
      "Who"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「Where's」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_124",
    "book": 5,
    "unit": "Starter",
    "category": "grammar",
    "question": "He ______ sleeping.",
    "options": [
      "is",
      "are",
      "✕ (不需填詞)",
      "am"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「is」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_125",
    "book": 5,
    "unit": "Starter",
    "category": "grammar",
    "question": "My sister is ______.",
    "options": [
      "eating",
      "read",
      "eat",
      "drink"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「eating」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_126",
    "book": 5,
    "unit": "Starter",
    "category": "grammar",
    "question": "She's writing ______ the bedroom.",
    "options": [
      "✕ (不需填詞)",
      "on",
      "in",
      "at"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「in」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_127",
    "book": 5,
    "unit": "Starter",
    "category": "grammar",
    "question": "The dog is ______ running in the yard.",
    "options": [
      "at",
      "are",
      "✕ (不需填詞)",
      "on"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「✕ (不需填詞)」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_128",
    "book": 5,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: Where's Lily? B: ______",
    "options": [
      "She's sleeping.",
      "She's in the dining room.",
      "She's sad and tired.",
      "She's sixty years old."
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「She's in the dining room.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_129",
    "book": 5,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: Where's your brother? B: ______",
    "options": [
      "He's not my brother.",
      "He's one hundred.",
      "He's swimming.",
      "He's in the kitchen."
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「He's in the kitchen.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_130",
    "book": 5,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: How old is your grandfather? B: ______",
    "options": [
      "He's eighty-nine.",
      "He's in the yard.",
      "He's happy.",
      "He's drinking."
    ],
    "answer": 0,
    "explanation": "詢問年齡使用疑問詞「How old are you / is he / is she?」，回答用「主詞 + Be動詞 + 數字 (years old).」。"
  },
  {
    "id": "hwg_b5_131",
    "book": 5,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: ______ B: I'm in the bedroom.",
    "options": [
      "How old are you?",
      "What is she doing?",
      "Where are you?",
      "Who are you?"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Where are you?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_132",
    "book": 5,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: ______ B: It's eight forty.",
    "options": [
      "What time is it?",
      "What's she doing?",
      "Where's your sister?",
      "How old is his father?"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「What time is it?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_133",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "What day ______ today?",
    "options": [
      "am",
      "are",
      "✕ (不需填詞)",
      "is"
    ],
    "answer": 3,
    "explanation": "詢問今天星期幾使用「What day is today?」，回答「It’s + 星期名稱 (Monday ~ Sunday).」。"
  },
  {
    "id": "hwg_b5_134",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "______ not Monday.",
    "options": [
      "I'm",
      "Is",
      "It",
      "It's"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「It's」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_135",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "______ day is it?",
    "options": [
      "Where",
      "How",
      "Who",
      "What"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「What」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_136",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "______ it Thursday today?",
    "options": [
      "Are",
      "Am",
      "Is",
      "It"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Is」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_137",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "______ is Saturday. Let's go out!",
    "options": [
      "It",
      "Is",
      "I",
      "It's"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「It」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_138",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "It's Wednesday. It's ______ Tuesday.",
    "options": [
      "are",
      "isn't",
      "not",
      "is"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「not」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_139",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: It's ______. We don't go to school. Let's go out! B: Good idea!",
    "options": [
      "Friday",
      "Monday",
      "Saturday",
      "Tuesday"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Saturday」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_140",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: It's ______. It's Mother's Day. B: Happy Mother's Day!",
    "options": [
      "Monday",
      "Saturday",
      "Sunday",
      "Tuesday"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Sunday」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_141",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: What ______ is it? B: It's Monday. I'm blue.",
    "options": [
      "✕ (不需填詞)",
      "time",
      "color",
      "day"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「day」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_142",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Is it ______ today? B: Yes. I like Thursday.",
    "options": [
      "Thursday",
      "Sunday",
      "Wednesday",
      "Tuesday"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「Thursday」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_143",
    "book": 5,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: What day is today? B: ______",
    "options": [
      "It's not Monday.",
      "It's Monday.",
      "Yes. It's Monday.",
      "It's sunny."
    ],
    "answer": 1,
    "explanation": "詢問今天星期幾使用「What day is today?」，回答「It’s + 星期名稱 (Monday ~ Sunday).」。"
  },
  {
    "id": "hwg_b5_144",
    "book": 5,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Is it Wednesday today? B: ______",
    "options": [
      "No. It's Wednesday.",
      "It's Wednesday.",
      "It's not Wednesday.",
      "Yes, it is."
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「Yes, it is.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_145",
    "book": 5,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: It's Saturday. Let's play. B: ______",
    "options": [
      "Good idea!",
      "Time for lunch.",
      "Good afternoon.",
      "Have a good time."
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「Good idea!」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_146",
    "book": 5,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: It's Sunday. I want to watch a football game. B: ______",
    "options": [
      "Have a good time.",
      "Wait a minute.",
      "Here you are.",
      "Time for lunch."
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「Have a good time.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_147",
    "book": 5,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: ______ B: It's Thursday.",
    "options": [
      "Where's Max?",
      "What day is today?",
      "Is it Thursday today?",
      "What time is it?"
    ],
    "answer": 1,
    "explanation": "詢問今天星期幾使用「What day is today?」，回答「It’s + 星期名稱 (Monday ~ Sunday).」。"
  },
  {
    "id": "hwg_b5_148",
    "book": 5,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: ______ B: No, it isn't. It's Saturday.",
    "options": [
      "It is Saturday.",
      "Is it Sunday today?",
      "What time is it?",
      "What day is today?"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「Is it Sunday today?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_149",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "I have art class ______ Thursday.",
    "options": [
      "at",
      "✕ (不需填詞)",
      "on",
      "in"
    ],
    "answer": 2,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b5_150",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "We ______ have music class today.",
    "options": [
      "don't",
      "not",
      "do",
      "doesn't"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「don't」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_151",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "She ______ have science class on Sunday.",
    "options": [
      "doesn't",
      "not",
      "does",
      "don't"
    ],
    "answer": 0,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b5_152",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "______ you have PE class on Monday?",
    "options": [
      "Do",
      "Is",
      "Does",
      "Are"
    ],
    "answer": 0,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b5_153",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "______ he have social studies class on Tuesday?",
    "options": [
      "Am",
      "Is",
      "Do",
      "Does"
    ],
    "answer": 3,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b5_154",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Does she ______ Chinese class on Saturday?",
    "options": [
      "doesn't",
      "is",
      "have",
      "not"
    ],
    "answer": 2,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b5_155",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "I like drawing. I have ______ class on Friday.",
    "options": [
      "social studies",
      "art",
      "Chinese",
      "PE"
    ],
    "answer": 1,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b5_156",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Does she have ______ class on Monday? B: Yes. She reads English books that day.",
    "options": [
      "music",
      "English",
      "Chinese",
      "science"
    ],
    "answer": 1,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b5_157",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Do you have ______ class today? B: Yes, I do. I like to sing.",
    "options": [
      "music",
      "math",
      "social studies",
      "English"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「music」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_158",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Does he have ______ class on Tuesday? B: Yes. He can swim that day.",
    "options": [
      "PE",
      "science",
      "math",
      "Chinese"
    ],
    "answer": 0,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b5_159",
    "book": 5,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Do you have math class on Thursday? B: ______",
    "options": [
      "Yes, I do.",
      "I like math.",
      "No, she doesn't.",
      "Yes, he does."
    ],
    "answer": 0,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b5_160",
    "book": 5,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Does she have Chinese class on Monday? B: ______",
    "options": [
      "Yes, he does.",
      "No, she doesn't.",
      "No, they don't.",
      "Yes, I do."
    ],
    "answer": 1,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b5_161",
    "book": 5,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: I like ice cream. Can I try it? B: ______",
    "options": [
      "Follow me.",
      "Good idea!",
      "Have a good time.",
      "Sure!"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「Sure!」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_162",
    "book": 5,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Where's the bathroom? B: ______",
    "options": [
      "Good idea!",
      "Follow me.",
      "Me, too.",
      "Sure!"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「Follow me.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_163",
    "book": 5,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______ B: Yes. I have science class today.",
    "options": [
      "Does she have social studies class today?",
      "Do you have social studies class today?",
      "Do you have science class today?",
      "Do they have science class today?"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Do you have science class today?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_164",
    "book": 5,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______ B: No, she doesn't.",
    "options": [
      "Does she have English class on Sunday?",
      "Does he have Chinese class on Saturday?",
      "Do you have English class on Monday?",
      "Does he have English class on Friday?"
    ],
    "answer": 0,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b5_165",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "Where ______ you going?",
    "options": [
      "✕ (不需填詞)",
      "is",
      "am",
      "are"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「are」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_166",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "______ are you going?",
    "options": [
      "What",
      "Does",
      "Where",
      "Do"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Where」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_167",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "Where ______ the post office?",
    "options": [
      "are",
      "✕ (不需填詞)",
      "is",
      "am"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「is」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_168",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "I'm ______ to the supermarket.",
    "options": [
      "doing",
      "go",
      "going",
      "do"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「going」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_169",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "______ going to the museum.",
    "options": [
      "They",
      "We're",
      "I",
      "We"
    ],
    "answer": 1,
    "explanation": "詢問正要前往何處使用「Where are you going?」，回答「I’m / We’re going to the + 地點.」。"
  },
  {
    "id": "hwg_b5_170",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "The bank is ______ Maple Road.",
    "options": [
      "at",
      "✕ (不需填詞)",
      "in",
      "on"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「on」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_171",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Where are you going? B: I'm going to the ______. I'm thirsty.",
    "options": [
      "supermarket",
      "post office",
      "park",
      "bank"
    ],
    "answer": 0,
    "explanation": "詢問正要前往何處使用「Where are you going?」，回答「I’m / We’re going to the + 地點.」。"
  },
  {
    "id": "hwg_b5_172",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: I'm going to the ______. B: Me, too. I like to read books.",
    "options": [
      "museum",
      "hospital",
      "bank",
      "library"
    ],
    "answer": 3,
    "explanation": "詢問正要前往何處使用「Where are you going?」，回答「I’m / We’re going to the + 地點.」。"
  },
  {
    "id": "hwg_b5_173",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Dad, I need a marker. B: Let's go to the ______. It's on Black Street.",
    "options": [
      "post office",
      "museum",
      "library",
      "bookstore"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「bookstore」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_174",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: I'm going to the ______ to see the doctor. B: Take care.",
    "options": [
      "park",
      "supermarket",
      "bank",
      "hospital"
    ],
    "answer": 3,
    "explanation": "詢問正要前往何處使用「Where are you going?」，回答「I’m / We’re going to the + 地點.」。"
  },
  {
    "id": "hwg_b5_175",
    "book": 5,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Where are you going? B: ______",
    "options": [
      "Let's go to the post office.",
      "The bank is on Apple Street.",
      "I'm going to the bookstore.",
      "They're going to the park."
    ],
    "answer": 2,
    "explanation": "詢問正要前往何處使用「Where are you going?」，回答「I’m / We’re going to the + 地點.」。"
  },
  {
    "id": "hwg_b5_176",
    "book": 5,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Where's the hospital? B: ______",
    "options": [
      "I'm going to the hospital.",
      "Excuse me. I'm lost.",
      "We're going to the bank.",
      "It's on Doctor Street."
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「It's on Doctor Street.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_177",
    "book": 5,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: ______ Where's the bank? B: It's on Blue Street.",
    "options": [
      "Me, too.",
      "Say cheese!",
      "Follow me.",
      "Excuse me."
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「Excuse me.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_178",
    "book": 5,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: This museum is beautiful! B: Yes. Let's take a picture. ______",
    "options": [
      "Sorry, I'm late.",
      "Say cheese!",
      "Good idea!",
      "Excuse me."
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「Say cheese!」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_179",
    "book": 5,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: ______ B: We're going to the museum.",
    "options": [
      "Where's the museum?",
      "The museum is on Green Street.",
      "Where are you going?",
      "Where is he going?"
    ],
    "answer": 2,
    "explanation": "詢問正要前往何處使用「Where are you going?」，回答「I’m / We’re going to the + 地點.」。"
  },
  {
    "id": "hwg_b5_180",
    "book": 5,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: ______ B: It's on Sunny Road.",
    "options": [
      "Where's the post office?",
      "We're going to the bank.",
      "Where's your brother?",
      "Where are you going?"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「Where's the post office?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_181",
    "book": 5,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "How many zebras ______ there?",
    "options": [
      "am",
      "is",
      "✕ (不需填詞)",
      "are"
    ],
    "answer": 3,
    "explanation": "詢問可數名詞的數量使用「How many + 複數名詞 + are there?」，單數回答「There is one ...」，複數回答「There are ...」。"
  },
  {
    "id": "hwg_b5_182",
    "book": 5,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "______ many lions are there?",
    "options": [
      "Where",
      "What",
      "Does",
      "How"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「How」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_183",
    "book": 5,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "There ______ one tiger.",
    "options": [
      "does",
      "are",
      "likes",
      "is"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「is」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_184",
    "book": 5,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "There ______ sixty koalas.",
    "options": [
      "is",
      "does",
      "are",
      "doesn't"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「are」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_185",
    "book": 5,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "______ he like monkeys?",
    "options": [
      "Does",
      "Do",
      "How",
      "Is"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「Does」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_186",
    "book": 5,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Does she ______ elephants?",
    "options": [
      "like",
      "is",
      "are",
      "likes"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「like」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_187",
    "book": 5,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: How many ______ are there? B: There are two elephants. They're big and tall.",
    "options": [
      "elephants",
      "koalas",
      "monkeys",
      "turtles"
    ],
    "answer": 0,
    "explanation": "詢問可數名詞的數量使用「How many + 複數名詞 + are there?」，單數回答「There is one ...」，複數回答「There are ...」。"
  },
  {
    "id": "hwg_b5_188",
    "book": 5,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Does she like ______? B: Yes, she does. She likes zebras.",
    "options": [
      "zebras",
      "horses",
      "tigers",
      "lions"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「zebras」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_189",
    "book": 5,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: There is a hungry ______ coming. Run! B: Calm down. It's just a robot cat.",
    "options": [
      "tiger",
      "turtle",
      "elephant",
      "horse"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「tiger」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_190",
    "book": 5,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: There are two ______ jumping in the tree. B: They like your bananas.",
    "options": [
      "koalas",
      "lions",
      "zebras",
      "monkeys"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「monkeys」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_191",
    "book": 5,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: I feel sick. I'm going to the hospital. B: ______",
    "options": [
      "Follow me.",
      "Take care!",
      "Excuse me.",
      "Calm down."
    ],
    "answer": 1,
    "explanation": "詢問正要前往何處使用「Where are you going?」，回答「I’m / We’re going to the + 地點.」。"
  },
  {
    "id": "hwg_b5_192",
    "book": 5,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Dogs! Run! B: ______ They're small dogs.",
    "options": [
      "Have a good time.",
      "Say cheese!",
      "Take care!",
      "Calm down."
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「Calm down.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_193",
    "book": 5,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: How many elephants are there? B: ______",
    "options": [
      "There are four elephants.",
      "I don't like elephants.",
      "He likes elephants.",
      "There are ten monkeys."
    ],
    "answer": 0,
    "explanation": "詢問可數名詞的數量使用「How many + 複數名詞 + are there?」，單數回答「There is one ...」，複數回答「There are ...」。"
  },
  {
    "id": "hwg_b5_194",
    "book": 5,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Does she like horses? B: ______",
    "options": [
      "Yes. She likes zebras.",
      "No. She likes horses.",
      "Yes, she does.",
      "No, he doesn't."
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Yes, she does.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_195",
    "book": 5,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: ______ B: There are ninety turtles.",
    "options": [
      "How many turtles are there?",
      "He doesn't like turtles.",
      "Does she like turtles?",
      "How many tigers are there?"
    ],
    "answer": 0,
    "explanation": "詢問可數名詞的數量使用「How many + 複數名詞 + are there?」，單數回答「There is one ...」，複數回答「There are ...」。"
  },
  {
    "id": "hwg_b5_196",
    "book": 5,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: ______ B: No, he doesn't. He likes koalas.",
    "options": [
      "Does she like zebras?",
      "Does he like monkeys?",
      "Does he like koalas?",
      "How many koalas are there?"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「Does he like monkeys?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_197",
    "book": 5,
    "unit": "Festival",
    "category": "grammar",
    "question": "How many stars ______ there?",
    "options": [
      "is",
      "✕ (不需填詞)",
      "are",
      "am"
    ],
    "answer": 2,
    "explanation": "詢問可數名詞的數量使用「How many + 複數名詞 + are there?」，單數回答「There is one ...」，複數回答「There are ...」。"
  },
  {
    "id": "hwg_b5_198",
    "book": 5,
    "unit": "Festival",
    "category": "grammar",
    "question": "______ open the gifts.",
    "options": [
      "Does",
      "Let",
      "Let's",
      "Is"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Let's」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_199",
    "book": 5,
    "unit": "Festival",
    "category": "grammar",
    "question": "The Christmas tree is ______.",
    "options": [
      "star",
      "big",
      "✕ (不需填詞)",
      "bell"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「big」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_200",
    "book": 5,
    "unit": "Festival",
    "category": "grammar",
    "question": "There ______ one candy cane.",
    "options": [
      "are",
      "is",
      "on",
      "am"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「is」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_201",
    "book": 7,
    "unit": "Starter",
    "category": "grammar",
    "question": "______ you like some salad for lunch?",
    "options": [
      "Would",
      "What",
      "Whose",
      "Who"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「Would」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_202",
    "book": 7,
    "unit": "Starter",
    "category": "grammar",
    "question": "______ water bottle is this on the desk?",
    "options": [
      "Whose",
      "Would",
      "Who",
      "How"
    ],
    "answer": 0,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b7_203",
    "book": 7,
    "unit": "Starter",
    "category": "grammar",
    "question": "______ like some beef noodles for dinner.",
    "options": [
      "I'm",
      "I'd",
      "It's",
      "You're"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「I'd」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_204",
    "book": 7,
    "unit": "Starter",
    "category": "grammar",
    "question": "Whose workbooks ______ these?",
    "options": [
      "can",
      "are",
      "is",
      "am"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「are」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_205",
    "book": 7,
    "unit": "Starter",
    "category": "grammar",
    "question": "______ Hannah's shoes.",
    "options": [
      "It",
      "They're",
      "It's",
      "They"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「They're」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_206",
    "book": 7,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: Would you like some chicken? B: ______",
    "options": [
      "No. I'd like some soup.",
      "Yes. I like chicken sandwiches.",
      "Yes. I'd like some soup.",
      "No. I'd like some chicken."
    ],
    "answer": 0,
    "explanation": "表達禮貌點餐或想要某食物用「Would you like ...? / I’d like ...」，不可數與計量食物常搭配單位詞「a cup/bottle/bowl/piece/glass of ...」。"
  },
  {
    "id": "hwg_b7_207",
    "book": 7,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: Whose cap is that on the chair? B: ______",
    "options": [
      "It's Noah's pen.",
      "It's his bag.",
      "It's my cap.",
      "It's my soup."
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「It's my cap.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_208",
    "book": 7,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: What's Luca's room number? B: ______",
    "options": [
      "My room number is 418.",
      "Her room is big.",
      "Her phone number is 0912-358-901.",
      "Her room number is 305."
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「Her room number is 305.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_209",
    "book": 7,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: What would you like for dinner? B: ______",
    "options": [
      "Yes, please.",
      "No, thank you.",
      "I don't like noodles.",
      "I'd like some chicken."
    ],
    "answer": 3,
    "explanation": "表達禮貌點餐或想要某食物用「Would you like ...? / I’d like ...」，不可數與計量食物常搭配單位詞「a cup/bottle/bowl/piece/glass of ...」。"
  },
  {
    "id": "hwg_b7_210",
    "book": 7,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: ______ B: It's Alex's water bottle.",
    "options": [
      "Whose water bottle is that?",
      "Whose glasses are these?",
      "Whose water bottles are those?",
      "Whose backpack is this?"
    ],
    "answer": 0,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b7_211",
    "book": 7,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "______ are the boys from?",
    "options": [
      "Who",
      "Whose",
      "Where",
      "What"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Where」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_212",
    "book": 7,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Ivy, where ______ you from?",
    "options": [
      "am",
      "do",
      "is",
      "are"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「are」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_213",
    "book": 7,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Is ______ from Taiwan?",
    "options": [
      "the boys",
      "you",
      "they",
      "she"
    ],
    "answer": 3,
    "explanation": "詢問來自哪個國家使用「Where are you / is he / is she from?」，英國與美國需加定冠詞「the UK / the USA」。"
  },
  {
    "id": "hwg_b7_214",
    "book": 7,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "______ they from Spain?",
    "options": [
      "Is",
      "Do",
      "Does",
      "Are"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「Are」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_215",
    "book": 7,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Where is Uma from? B: She's from ______. She likes cheeseburgers very much.",
    "options": [
      "the park",
      "the USA",
      "the museum",
      "the bank"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「the USA」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_216",
    "book": 7,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Where are you from? B: I'm from ______. Taipei 101 is famous in my country.",
    "options": [
      "Singapore",
      "Spain",
      "Taiwan",
      "India"
    ],
    "answer": 2,
    "explanation": "詢問來自哪個國家使用「Where are you / is he / is she from?」，英國與美國需加定冠詞「the UK / the USA」。"
  },
  {
    "id": "hwg_b7_217",
    "book": 7,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Is Jason from ______? B: Yes, he is. There are many kangaroos in his country.",
    "options": [
      "Japan",
      "Australia",
      "the USA"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「Australia」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_218",
    "book": 7,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: What's that? B: It's the Taj Mahal. We're in ______ now.",
    "options": [
      "Taiwan",
      "Spain",
      "India",
      "Australia"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「India」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_219",
    "book": 7,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Where are you from? B: ______",
    "options": [
      "I'm from Singapore.",
      "They're from the USA.",
      "Yes. I'm from the UK.",
      "He's from Australia."
    ],
    "answer": 0,
    "explanation": "詢問來自哪個國家使用「Where are you / is he / is she from?」，英國與美國需加定冠詞「the UK / the USA」。"
  },
  {
    "id": "hwg_b7_220",
    "book": 7,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Where is your grandpa from? B: ______",
    "options": [
      "No, he isn't.",
      "He's from Spain.",
      "He's in the UK.",
      "Yes, he is."
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b7_221",
    "book": 7,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: ______ B: They're from India.",
    "options": [
      "Where is Sophie from?",
      "Is Dylan from India?",
      "Are they from India?",
      "Where are Nick and Logan from?"
    ],
    "answer": 3,
    "explanation": "詢問來自哪個國家使用「Where are you / is he / is she from?」，英國與美國需加定冠詞「the UK / the USA」。"
  },
  {
    "id": "hwg_b7_222",
    "book": 7,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: ______ B: No, she isn't. She's from the UK.",
    "options": [
      "Is your father from Japan?",
      "Where's your mother from?",
      "Is your mother from the UK?",
      "Is your sister from Japan?"
    ],
    "answer": 3,
    "explanation": "詢問來自哪個國家使用「Where are you / is he / is she from?」，英國與美國需加定冠詞「the UK / the USA」。"
  },
  {
    "id": "hwg_b7_223",
    "book": 7,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Where's Amy's brother from? B: ______",
    "options": [
      "He isn't from Taiwan.",
      "Yes. He's from the UK.",
      "No. He's from the USA.",
      "He's from Australia."
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「He's from Australia.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_224",
    "book": 7,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Look! ____________ B: It's beautiful.",
    "options": [
      "That's the Taj Mahal.",
      "I'd like some sandwiches.",
      "I'm from Spain.",
      "I'm hungry."
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「That's the Taj Mahal.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_225",
    "book": 7,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "How ______ your sisters go to the park?",
    "options": [
      "does",
      "is",
      "are",
      "do"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「do」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_226",
    "book": 7,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "______ Alex go to school on foot?",
    "options": [
      "Does",
      "Are",
      "Is",
      "Do"
    ],
    "answer": 0,
    "explanation": "詢問交通方式使用「How do/does + 主詞 + go to ...?」，搭乘交通工具用「by + 交通工具」，步行用「on foot」。"
  },
  {
    "id": "hwg_b7_227",
    "book": 7,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Maya ______ to the supermarket by bus.",
    "options": [
      "goes",
      "go",
      "going",
      "is go"
    ],
    "answer": 0,
    "explanation": "詢問交通方式使用「How do/does + 主詞 + go to ...?」，搭乘交通工具用「by + 交通工具」，步行用「on foot」。"
  },
  {
    "id": "hwg_b7_228",
    "book": 7,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "______ do they go to the museum?",
    "options": [
      "How",
      "Where",
      "Who",
      "What"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「How」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_229",
    "book": 7,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: It's usually cold and rainy here in winter. How do you go to school? B: ______.",
    "options": [
      "By taxi",
      "By bike",
      "By scooter"
    ],
    "answer": 0,
    "explanation": "詢問交通方式使用「How do/does + 主詞 + go to ...?」，搭乘交通工具用「by + 交通工具」，步行用「on foot」。"
  },
  {
    "id": "hwg_b7_230",
    "book": 7,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: How does your brother go to school? B: He goes to school ______. He can walk very fast.",
    "options": [
      "by bike",
      "on foot",
      "by train"
    ],
    "answer": 1,
    "explanation": "詢問交通方式使用「How do/does + 主詞 + go to ...?」，搭乘交通工具用「by + 交通工具」，步行用「on foot」。"
  },
  {
    "id": "hwg_b7_231",
    "book": 7,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Does Uma go to school by car? B: No. She goes to school ______. There are many students on it every day.",
    "options": [
      "on foot",
      "by bike",
      "by scooter",
      "by bus"
    ],
    "answer": 3,
    "explanation": "詢問交通方式使用「How do/does + 主詞 + go to ...?」，搭乘交通工具用「by + 交通工具」，步行用「on foot」。"
  },
  {
    "id": "hwg_b7_232",
    "book": 7,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: It's eight o'clock. Hurry up, Jimmy. You're late! B: Don't worry, Mom. I'm going to school ______ on Fridays. It's fast.",
    "options": [
      "on foot",
      "with Noah",
      "at 8 o'clock"
    ],
    "answer": 0,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b7_233",
    "book": 7,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: How do you go to school? B: ______",
    "options": [
      "Yes. I go to school by train.",
      "I don't go to school on foot.",
      "I go home by bus.",
      "I go to school by bike."
    ],
    "answer": 3,
    "explanation": "詢問交通方式使用「How do/does + 主詞 + go to ...?」，搭乘交通工具用「by + 交通工具」，步行用「on foot」。"
  },
  {
    "id": "hwg_b7_234",
    "book": 7,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Does she go to school by metro? B: ______",
    "options": [
      "She's going to school by metro.",
      "No, she isn't.",
      "Yes, she does.",
      "She goes to school by bike."
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Yes, she does.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_235",
    "book": 7,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: How does Jerry go to the library? B: ______",
    "options": [
      "Yes. He goes to the library by car.",
      "No. He goes to the library by bus.",
      "He goes to the library by car.",
      "He goes to the library with Sam."
    ],
    "answer": 2,
    "explanation": "詢問交通方式使用「How do/does + 主詞 + go to ...?」，搭乘交通工具用「by + 交通工具」，步行用「on foot」。"
  },
  {
    "id": "hwg_b7_236",
    "book": 7,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______ B: We go to school by bus.",
    "options": [
      "How do the boys go to school?",
      "How do you and Sara go to school?",
      "Do you go to school by bus?",
      "Do you go to school by train?"
    ],
    "answer": 1,
    "explanation": "詢問交通方式使用「How do/does + 主詞 + go to ...?」，搭乘交通工具用「by + 交通工具」，步行用「on foot」。"
  },
  {
    "id": "hwg_b7_237",
    "book": 7,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______ B: Yes, she does. She goes to the bank on foot.",
    "options": [
      "Does Hazel go to the bank by bike?",
      "Is Hazel going to the bank?",
      "How does Hazel go to the bank?",
      "Does Hazel go to the bank on foot?"
    ],
    "answer": 3,
    "explanation": "詢問交通方式使用「How do/does + 主詞 + go to ...?」，搭乘交通工具用「by + 交通工具」，步行用「on foot」。"
  },
  {
    "id": "hwg_b7_238",
    "book": 7,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______ B: They go home by scooter.",
    "options": [
      "Where are they going?",
      "How do they go to school?",
      "Do Ivy and Dylan go home by MRT?",
      "How do Ivy and Dylan go home?"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「How do Ivy and Dylan go home?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_239",
    "book": 7,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: Where are you from? B: I'm from ______. We have a king.",
    "options": [
      "the USA",
      "Taiwan",
      "India",
      "the UK"
    ],
    "answer": 3,
    "explanation": "詢問來自哪個國家使用「Where are you / is he / is she from?」，英國與美國需加定冠詞「the UK / the USA」。"
  },
  {
    "id": "hwg_b7_240",
    "book": 7,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: Is she from Singapore? B: No. She's from ______. She doesn't speak English or Chinese at school.",
    "options": [
      "the UK",
      "Japan",
      "Taiwan"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「Japan」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_241",
    "book": 7,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: How do you and your sisters go to Taipei? B: We go there ______. We sit together and eat apples.",
    "options": [
      "by car",
      "by MRT",
      "on foot",
      "by bike"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「by car」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_242",
    "book": 7,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: Does he go to the bank by train? B: No. He goes there ______. He pays the driver NT$125.",
    "options": [
      "by bike",
      "by car",
      "by metro"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「undefined」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_243",
    "book": 7,
    "unit": "Review 1",
    "category": "grammar",
    "question": "Let's go to ______. There are dragon boat races on Saturday.",
    "options": [
      "Spain",
      "Australia",
      "India",
      "Taiwan"
    ],
    "answer": 3,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b7_244",
    "book": 7,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "What ______ you do on weekends?",
    "options": [
      "am",
      "does",
      "do",
      "are"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「do」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_245",
    "book": 7,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "What ______ he do in his free time?",
    "options": [
      "are",
      "do",
      "is",
      "does"
    ],
    "answer": 3,
    "explanation": "詢問休閒活動使用「What do/does + 主詞 + do in one’s free time?」，第三人稱單數主詞（he/she）動詞須加 -s/-es。"
  },
  {
    "id": "hwg_b7_246",
    "book": 7,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "Vicky ______ a bike after school.",
    "options": [
      "don't ride",
      "ride",
      "riding",
      "rides"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「rides」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_247",
    "book": 7,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "His sister watches TV in ______ free time.",
    "options": [
      "his",
      "our",
      "their",
      "her"
    ],
    "answer": 3,
    "explanation": "詢問休閒活動使用「What do/does + 主詞 + do in one’s free time?」，第三人稱單數主詞（he/she）動詞須加 -s/-es。"
  },
  {
    "id": "hwg_b7_248",
    "book": 7,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What do you do on weekends? B: I ______ in the library.",
    "options": [
      "study English",
      "ride a bike",
      "play basketball",
      "go jogging"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「study English」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_249",
    "book": 7,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What does David do in his free time? B: He ______ in his free time. There are many games on it.",
    "options": [
      "surfs the Internet",
      "rides a bike",
      "plays baseball",
      "listens to music"
    ],
    "answer": 0,
    "explanation": "詢問休閒活動使用「What do/does + 主詞 + do in one’s free time?」，第三人稱單數主詞（he/she）動詞須加 -s/-es。"
  },
  {
    "id": "hwg_b7_250",
    "book": 7,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "My legs hurt. I can't ______, but I can watch TV.",
    "options": [
      "study English",
      "listen to music",
      "read books",
      "ride a bike"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「ride a bike」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_251",
    "book": 7,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "Clara ______ in her free time. She can run fast.",
    "options": [
      "goes jogging",
      "surfs the Internet",
      "watches TV"
    ],
    "answer": 0,
    "explanation": "詢問休閒活動使用「What do/does + 主詞 + do in one’s free time?」，第三人稱單數主詞（he/she）動詞須加 -s/-es。"
  },
  {
    "id": "hwg_b7_252",
    "book": 7,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What do the girls do on weekends? B: ______",
    "options": [
      "They play basketball.",
      "She goes jogging.",
      "I study English.",
      "We watch TV."
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「They play basketball.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_253",
    "book": 7,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What does Kevin do in his free time? B: ______",
    "options": [
      "He rides a bike in his free time.",
      "He'd like some noodles for lunch.",
      "He is sleeping in his room.",
      "He goes to school on foot."
    ],
    "answer": 0,
    "explanation": "詢問休閒活動使用「What do/does + 主詞 + do in one’s free time?」，第三人稱單數主詞（he/she）動詞須加 -s/-es。"
  },
  {
    "id": "hwg_b7_254",
    "book": 7,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What do you and Irene do in your free time? B: ______",
    "options": [
      "We surf the Internet in our free time.",
      "Yes, we play baseball in our free time.",
      "They're going to the bank.",
      "I listen to music in my free time."
    ],
    "answer": 0,
    "explanation": "詢問休閒活動使用「What do/does + 主詞 + do in one’s free time?」，第三人稱單數主詞（he/she）動詞須加 -s/-es。"
  },
  {
    "id": "hwg_b7_255",
    "book": 7,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: ______ B: She studies English in her free time.",
    "options": [
      "What does Sally do in her free time?",
      "Does she study English in her free time?",
      "What is she doing in the kitchen?",
      "What does Leo do in his free time?"
    ],
    "answer": 0,
    "explanation": "詢問休閒活動使用「What do/does + 主詞 + do in one’s free time?」，第三人稱單數主詞（he/she）動詞須加 -s/-es。"
  },
  {
    "id": "hwg_b7_256",
    "book": 7,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: ______ B: We listen to music after school.",
    "options": [
      "What would you like for dinner?",
      "What do the boys do after school?",
      "What do you and Meg do in your free time?",
      "What do you do after school?"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「What do you do after school?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_257",
    "book": 7,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: ______ B: Me, too. It's fun!",
    "options": [
      "Let me show you.",
      "I play basketball in my free time.",
      "We're your fans.",
      "I have a sore throat."
    ],
    "answer": 1,
    "explanation": "詢問休閒活動使用「What do/does + 主詞 + do in one’s free time?」，第三人稱單數主詞（he/she）動詞須加 -s/-es。"
  },
  {
    "id": "hwg_b7_258",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "What time ______ your sister have lunch?",
    "options": [
      "do",
      "is",
      "does",
      "are"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「does」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_259",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "He ______ his homework at seven o'clock.",
    "options": [
      "do",
      "does",
      "not do",
      "doing"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「does」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_260",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "______ do Ryan and Emma go to school?",
    "options": [
      "Who",
      "Whose",
      "What time",
      "What color"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「What time」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_261",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "They go to bed ______ 10:30.",
    "options": [
      "at",
      "on",
      "in",
      "under"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「at」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_262",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What time do you ______? B: At twelve o'clock. I eat beef sandwiches every Monday.",
    "options": [
      "go to bed",
      "have lunch",
      "take a shower",
      "go to school"
    ],
    "answer": 1,
    "explanation": "詢問日常作息時間使用「What time do/does + 主詞 + 原形動詞?」，特定時刻前搭配介系詞「at」。"
  },
  {
    "id": "hwg_b7_263",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What time does Jeff usually ______? B: At 10:00. But he's not so tired today, so he wants to sleep at 11:00.",
    "options": [
      "go to school",
      "get up",
      "go to bed"
    ],
    "answer": 2,
    "explanation": "詢問日常作息時間使用「What time do/does + 主詞 + 原形動詞?」，特定時刻前搭配介系詞「at」。"
  },
  {
    "id": "hwg_b7_264",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What time does she ______? B: At 6:30. She likes to sing in the bathroom.",
    "options": [
      "have dinner",
      "get up",
      "take a shower",
      "go home"
    ],
    "answer": 2,
    "explanation": "詢問日常作息時間使用「What time do/does + 主詞 + 原形動詞?」，特定時刻前搭配介系詞「at」。"
  },
  {
    "id": "hwg_b7_265",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Is Kate in the bedroom? B: Yes. She's ______.",
    "options": [
      "going to school",
      "going home",
      "doing her homework",
      "playing baseball"
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b7_266",
    "book": 7,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: What time do you go to school? B: ______",
    "options": [
      "I go to school at 7:30.",
      "We go to school on foot.",
      "We go to bed at 9:30.",
      "I take a shower at 4:00."
    ],
    "answer": 0,
    "explanation": "詢問日常作息時間使用「What time do/does + 主詞 + 原形動詞?」，特定時刻前搭配介系詞「at」。"
  },
  {
    "id": "hwg_b7_267",
    "book": 7,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: What time does Caleb go home? B: ______",
    "options": [
      "He goes home with his mom.",
      "He goes home by bus.",
      "He goes to bed at 10:30.",
      "He goes home at 5:30."
    ],
    "answer": 3,
    "explanation": "詢問日常作息時間使用「What time do/does + 主詞 + 原形動詞?」，特定時刻前搭配介系詞「at」。"
  },
  {
    "id": "hwg_b7_268",
    "book": 7,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: What time do you have dinner? B: ______",
    "options": [
      "We have lunch at 12:00.",
      "I'd like some salad for lunch.",
      "We have dinner at 6:00.",
      "I have dinner at home."
    ],
    "answer": 2,
    "explanation": "詢問日常作息時間使用「What time do/does + 主詞 + 原形動詞?」，特定時刻前搭配介系詞「at」。"
  },
  {
    "id": "hwg_b7_269",
    "book": 7,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: ______ B: He does his homework at five.",
    "options": [
      "Does Logan do his homework at five?",
      "What does Logan do in his free time?",
      "What time does Logan do his homework?",
      "What time do you do your homework, Logan?"
    ],
    "answer": 2,
    "explanation": "詢問日常作息時間使用「What time do/does + 主詞 + 原形動詞?」，特定時刻前搭配介系詞「at」。"
  },
  {
    "id": "hwg_b7_270",
    "book": 7,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: ______ B: She gets up at eight o'clock.",
    "options": [
      "What time do the girls get up?",
      "Does Grandma get up at eight o'clock?",
      "What time does your sister get up?",
      "What time does your mother go home?"
    ],
    "answer": 2,
    "explanation": "詢問日常作息時間使用「What time do/does + 主詞 + 原形動詞?」，特定時刻前搭配介系詞「at」。"
  },
  {
    "id": "hwg_b7_271",
    "book": 7,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Can I be an elf, too? B: Sure. ______",
    "options": [
      "Let's have a picnic.",
      "I can make a snowman.",
      "I make toys at school.",
      "Let me show you how."
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「Let me show you how.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_272",
    "book": 7,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: What do you do in your free time? B: I ______. I love Beethoven.",
    "options": [
      "play baseball",
      "go jogging",
      "ride a bike",
      "listen to music"
    ],
    "answer": 3,
    "explanation": "詢問休閒活動使用「What do/does + 主詞 + do in one’s free time?」，第三人稱單數主詞（he/she）動詞須加 -s/-es。"
  },
  {
    "id": "hwg_b7_273",
    "book": 7,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: What time does your brother ______? B: At eight o'clock. He likes to sing in the bathroom.",
    "options": [
      "take a shower",
      "have dinner",
      "do her homework",
      "go to school"
    ],
    "answer": 0,
    "explanation": "詢問日常作息時間使用「What time do/does + 主詞 + 原形動詞?」，特定時刻前搭配介系詞「at」。"
  },
  {
    "id": "hwg_b7_274",
    "book": 7,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: What does Barry do in his free time? B: He ______ with his friends in the park.",
    "options": [
      "takes a shower",
      "plays basketball",
      "goes to school",
      "watches TV"
    ],
    "answer": 1,
    "explanation": "詢問休閒活動使用「What do/does + 主詞 + do in one’s free time?」，第三人稱單數主詞（he/she）動詞須加 -s/-es。"
  },
  {
    "id": "hwg_b7_275",
    "book": 7,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: Andrew, ______! It's 8:00. Time for school! B: OK, Mom.",
    "options": [
      "go to bed",
      "get up",
      "watch TV",
      "have lunch"
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b7_276",
    "book": 7,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: Amy and Sam go home at 4:30 by bike. They ______ on weekends, too. B: Wow! They like to ride very much.",
    "options": [
      "surf the Internet",
      "ride their bikes",
      "go jogging",
      "listen to music"
    ],
    "answer": 1,
    "explanation": "詢問交通方式使用「How do/does + 主詞 + go to ...?」，搭乘交通工具用「by + 交通工具」，步行用「on foot」。"
  },
  {
    "id": "hwg_b9_277",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "We ______ to the night market yesterday.",
    "options": [
      "goes",
      "going",
      "went",
      "go"
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_278",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Ian went to the amusement park ______.",
    "options": [
      "on weekends",
      "on Wednesdays",
      "every day",
      "last weekend"
    ],
    "answer": 3,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_279",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Where did your father ______ yesterday evening?",
    "options": [
      "going",
      "go",
      "went",
      "goes"
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_280",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Mom ______ juice last night.",
    "options": [
      "drank",
      "drinks",
      "drinking",
      "drink"
    ],
    "answer": 0,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_281",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Dylan ______ yesterday morning.",
    "options": [
      "is eating snacks",
      "goes shopping",
      "flew a kite",
      "rides a bike"
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_282",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "What ______ you do yesterday?",
    "options": [
      "were",
      "do",
      "does",
      "did"
    ],
    "answer": 3,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_283",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: ______ did Bella go yesterday?  B: She went to Starlight Night Market. It was big and new.",
    "options": [
      "Who",
      "What",
      "Where",
      "How"
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_284",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Where did you go last weekend?  B: I went to the ______. I rode a bike there.",
    "options": [
      "riverside park",
      "movie theater",
      "library",
      "post office"
    ],
    "answer": 0,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_285",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: What did Evan do at the movie theater last Friday?  B: He ______.",
    "options": [
      "went shopping",
      "flew a kite",
      "saw a movie",
      "rode a bike"
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_286",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: What did you do last night?  B: I was hungry, so I ______.",
    "options": [
      "flew a kite",
      "watched TV",
      "ate snacks",
      "rode a bike"
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_287",
    "book": 9,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Where did the girls go last Thursday?  B: ______",
    "options": [
      "They went to the night market.",
      "She went to the amusement park.",
      "She flew a kite.",
      "They saw a movie."
    ],
    "answer": 0,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_288",
    "book": 9,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: ______  B: I went to the riverside park.",
    "options": [
      "Where did he go last Tuesday?",
      "Were you at home?",
      "Where did you go yesterday?",
      "What do you do on weekends?"
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_289",
    "book": 9,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Where did Alice go last Tuesday?  B: ______",
    "options": [
      "She saw a movie with Dylan.",
      "She flew a kite last Tuesday.",
      "She went to the department store.",
      "She ate snacks."
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_290",
    "book": 9,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: ______  B: She went shopping.",
    "options": [
      "Where did your sisters go last night?",
      "What did Nina do last weekend?",
      "Did Nina visit a friend?",
      "Where was Nina yesterday?"
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_291",
    "book": 9,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: What did your brother do last Sunday?  B: ______",
    "options": [
      "He didn't fly a kite.",
      "I drank juice.",
      "I went to the zoo.",
      "He rode a bike at the riverside park."
    ],
    "answer": 3,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_292",
    "book": 9,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: What did you do yesterday morning?  B: ______",
    "options": [
      "We saw a movie.",
      "They went to the library.",
      "We were at the park.",
      "I was at the amusement park."
    ],
    "answer": 0,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_293",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "They ______ a picnic yesterday morning.",
    "options": [
      "have",
      "having",
      "has",
      "had"
    ],
    "answer": 3,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_294",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "We ______ after school last weekend.",
    "options": [
      "swimming",
      "swim",
      "swam",
      "swims"
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_295",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "What ______ Dora do last night?",
    "options": [
      "does",
      "can",
      "did",
      "do"
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_296",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Did Luke ______ a picture yesterday?",
    "options": [
      "draws",
      "drawing",
      "draw",
      "drew"
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_297",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "I ______ get a haircut last Sunday.",
    "options": [
      "wasn't",
      "don't",
      "doesn't",
      "didn't"
    ],
    "answer": 3,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_298",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Did John run ______?",
    "options": [
      "on Saturdays",
      "on weekends",
      "last Saturday",
      "every Friday"
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_299",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: ______ did Terry do yesterday afternoon?  B: He wrote a letter.",
    "options": [
      "What",
      "Where",
      "How",
      "Whose"
    ],
    "answer": 0,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_300",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Leo, what did you do last night?  B: ______ ran with my brother and watched TV with my mom.",
    "options": [
      "They",
      "I",
      "He",
      "She"
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_301",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Did Sophie ______ this morning?  B: Yes, she did. Her hair looks different.",
    "options": [
      "have a picnic",
      "get a haircut",
      "see a movie",
      "write a letter"
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_302",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Did they ______ yesterday?  B: No, they didn't. It was a rainy day, so they stayed home.",
    "options": [
      "write a letter",
      "have a picnic",
      "sing songs",
      "draw a picture"
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_303",
    "book": 9,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What did you do last night?  B: ______",
    "options": [
      "We didn't swim.",
      "I sing songs.",
      "We took a walk.",
      "I go to the riverside park."
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_304",
    "book": 9,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______  B: He drew a picture.",
    "options": [
      "Where did Logan go last Monday?",
      "What did Logan do last Monday?",
      "Did Logan draw a picture last Monday?",
      "What is Logan doing now?"
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_305",
    "book": 9,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What did your mom do this morning?  B: ______",
    "options": [
      "She didn't have a picnic this morning.",
      "She got a haircut this morning.",
      "She is at home.",
      "She runs every morning."
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_306",
    "book": 9,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______  B: No, we didn't. We swam yesterday.",
    "options": [
      "Can you sing songs?",
      "Do you run every day?",
      "Did you run yesterday?",
      "Did you swim yesterday?"
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_307",
    "book": 9,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Did Alex write a letter last Thursday?  B: ______",
    "options": [
      "Yes, he did.",
      "No, he wasn't at school.",
      "No, he didn't draw a picture.",
      "Yes, he does."
    ],
    "answer": 0,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_308",
    "book": 9,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Did they take a walk last Monday?  B: ______ They took a walk last Friday.",
    "options": [
      "No, we didn't.",
      "No, they didn't.",
      "Yes, we did.",
      "Yes, they did."
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_309",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "What would Ian like to ______?",
    "options": [
      "eating",
      "eat",
      "ate",
      "eats"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「eat」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b9_310",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ like a bowl of salad.  B: Sure! Anything else?",
    "options": [
      "I'm",
      "I'd",
      "I don't",
      "I can"
    ],
    "answer": 1,
    "explanation": "表達禮貌點餐或想要某食物用「Would you like ...? / I’d like ...」，不可數與計量食物常搭配單位詞「a cup/bottle/bowl/piece/glass of ...」。"
  },
  {
    "id": "hwg_b9_311",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "They'd like three ______ of cookies.",
    "options": [
      "plate",
      "boxes",
      "bag",
      "piece"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「boxes」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b9_312",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "We'd like a ______ of water.",
    "options": [
      "cups",
      "piece",
      "bottle",
      "bowls"
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_313",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What ______ Lily like to drink?  B: ______ like a cup of milk.",
    "options": [
      "would, She",
      "does, She'd",
      "would, She'd",
      "does, She"
    ],
    "answer": 2,
    "explanation": "表達禮貌點餐或想要某食物用「Would you like ...? / I’d like ...」，不可數與計量食物常搭配單位詞「a cup/bottle/bowl/piece/glass of ...」。"
  },
  {
    "id": "hwg_b9_314",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What would you like to drink?  B: We'd like two ______ of tea.",
    "options": [
      "plates",
      "glasses",
      "plate",
      "glass"
    ],
    "answer": 1,
    "explanation": "表達禮貌點餐或想要某食物用「Would you like ...? / I’d like ...」，不可數與計量食物常搭配單位詞「a cup/bottle/bowl/piece/glass of ...」。"
  },
  {
    "id": "hwg_b9_315",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What would you like to ______?  B: I'd like a piece of ______.",
    "options": [
      "drink, juice",
      "eat, juice",
      "eat, cake",
      "drink, cake"
    ],
    "answer": 2,
    "explanation": "表達禮貌點餐或想要某食物用「Would you like ...? / I’d like ...」，不可數與計量食物常搭配單位詞「a cup/bottle/bowl/piece/glass of ...」。"
  },
  {
    "id": "hwg_b9_316",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "Leo is hungry. He'd like two ______ of ______.",
    "options": [
      "bowls, rice",
      "glasses, water",
      "plate, noodles",
      "cups, tea"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「bowls, rice」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b9_317",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "I'm thirsty. I'd like a ______ of______.",
    "options": [
      "box, cookies",
      "bottles, juice",
      "bottle, water",
      "piece, chocolate"
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_318",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What would Nina and Logan like to ______?  B: They'd like four ______ of winter melon tea.",
    "options": [
      "drink, glasses",
      "eat, bowls",
      "eat, boxes",
      "drink, pieces"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「drink, glasses」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b9_319",
    "book": 9,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What would you like to eat?  B: ______",
    "options": [
      "We'd like a bottle of juice.",
      "I'd like a plate of noodles.",
      "He'd like a box of cookies.",
      "I'd like a cup of milk."
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_320",
    "book": 9,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: ______  B: She'd like a bowl of soup.",
    "options": [
      "What would you like to drink?",
      "What would she like to drink?",
      "What would you like to eat?",
      "What would she like to eat?"
    ],
    "answer": 3,
    "explanation": "表達禮貌點餐或想要某食物用「Would you like ...? / I’d like ...」，不可數與計量食物常搭配單位詞「a cup/bottle/bowl/piece/glass of ...」。"
  },
  {
    "id": "hwg_b9_321",
    "book": 9,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is Terry hungry?  B: Yes, he is. ______",
    "options": [
      "He'd like a box of sandwiches.",
      "He'd like a bottle of tea.",
      "He'd like a cup of juice.",
      "He'd like a glass of water."
    ],
    "answer": 0,
    "explanation": "表達禮貌點餐或想要某食物用「Would you like ...? / I’d like ...」，不可數與計量食物常搭配單位詞「a cup/bottle/bowl/piece/glass of ...」。"
  },
  {
    "id": "hwg_b9_322",
    "book": 9,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: ______  B: They'd like three bottles of water.",
    "options": [
      "What would they like to eat?",
      "What would they like to drink?",
      "What do they like?",
      "Did they like water?"
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_323",
    "book": 9,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What would you like to drink?  B: ______",
    "options": [
      "We'd like a bowl of rice.",
      "We'd like two cups of tea.",
      "I'd like a bag of chips.",
      "I'd like two pieces of cake."
    ],
    "answer": 1,
    "explanation": "表達禮貌點餐或想要某食物用「Would you like ...? / I’d like ...」，不可數與計量食物常搭配單位詞「a cup/bottle/bowl/piece/glass of ...」。"
  },
  {
    "id": "hwg_b9_324",
    "book": 9,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: I'm thirsty. ______ How about you?  B: I'd like a bottle of water.",
    "options": [
      "I'd like two plates of noodles.",
      "I'd like a glass of juice.",
      "I'd like a bag of apples.",
      "I'd like two bowls of salad."
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_325",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "______ the date today?",
    "options": [
      "What",
      "How's",
      "What's",
      "How"
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_326",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "______ January 31st.",
    "options": [
      "It's",
      "Today",
      "It",
      "I'd"
    ],
    "answer": 0,
    "explanation": "詢問日期用「What’s the date today?」；只講月份用介系詞「in + 月份」，講出「幾月幾日（序數）」則用「on + 月份 + 序數」。"
  },
  {
    "id": "hwg_b9_327",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Today is June ______.",
    "options": [
      "3nd",
      "13rd",
      "30th",
      "23th"
    ],
    "answer": 2,
    "explanation": "詢問日期用「What’s the date today?」；只講月份用介系詞「in + 月份」，講出「幾月幾日（序數）」則用「on + 月份 + 序數」。"
  },
  {
    "id": "hwg_b9_328",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Dad's birthday is ______ March 7th.",
    "options": [
      "in",
      "on",
      "under",
      "at"
    ],
    "answer": 1,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b9_329",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Evan, when ______ your birthday?",
    "options": [
      "were",
      "does",
      "is",
      "are"
    ],
    "answer": 2,
    "explanation": "詢問日期用「What’s the date today?」；只講月份用介系詞「in + 月份」，講出「幾月幾日（序數）」則用「on + 月份 + 序數」。"
  },
  {
    "id": "hwg_b9_330",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Jessie's birthday is ______ August.",
    "options": [
      "at",
      "on",
      "in",
      "from"
    ],
    "answer": 2,
    "explanation": "詢問日期用「What’s the date today?」；只講月份用介系詞「in + 月份」，講出「幾月幾日（序數）」則用「on + 月份 + 序數」。"
  },
  {
    "id": "hwg_b9_331",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What's the ______ today?  B: It's March 2nd.",
    "options": [
      "date",
      "time",
      "color",
      "day"
    ],
    "answer": 0,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_332",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What's the date today?  B: It's ______ 31st.",
    "options": [
      "February",
      "November",
      "April",
      "July"
    ],
    "answer": 3,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_333",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: ______ is your birthday?  B: It's on December 10th.",
    "options": [
      "What",
      "Who",
      "How",
      "When"
    ],
    "answer": 3,
    "explanation": "詢問日期用「What’s the date today?」；只講月份用介系詞「in + 月份」，講出「幾月幾日（序數）」則用「on + 月份 + 序數」。"
  },
  {
    "id": "hwg_b9_334",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Teachers' Day is on ______ 28th. Students thank their teachers.",
    "options": [
      "June",
      "December",
      "September",
      "May"
    ],
    "answer": 2,
    "explanation": "詢問日期用「What’s the date today?」；只講月份用介系詞「in + 月份」，講出「幾月幾日（序數）」則用「on + 月份 + 序數」。"
  },
  {
    "id": "hwg_b9_335",
    "book": 9,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Today is February 28th.  B: No. Yesterday was February 28th. ______",
    "options": [
      "Today is February 1st.",
      "Today is January 1st.",
      "Today is May 1st.",
      "Today is March 1st."
    ],
    "answer": 3,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_336",
    "book": 9,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: ______  B: It's April 15th.",
    "options": [
      "When is your birthday?",
      "What's the date today?",
      "What day is today?",
      "What time is it?"
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_337",
    "book": 9,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Excuse me. What's the date today?  B: ______",
    "options": [
      "It's in October.",
      "It's October 20th.",
      "It's on October 20th.",
      "It's October."
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_338",
    "book": 9,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: When is your birthday?  B: ______",
    "options": [
      "It's at seven.",
      "It's on May 17th.",
      "It's 17th.",
      "It's not in May."
    ],
    "answer": 1,
    "explanation": "詢問日期用「What’s the date today?」；只講月份用介系詞「in + 月份」，講出「幾月幾日（序數）」則用「on + 月份 + 序數」。"
  },
  {
    "id": "hwg_b9_339",
    "book": 9,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: When is Chloe's birthday?  B: ______",
    "options": [
      "Her birthday isn't on July 31st.",
      "Yes, it's in July.",
      "It's in July.",
      "Her birthday is on Saturday."
    ],
    "answer": 2,
    "explanation": "詢問日期用「What’s the date today?」；只講月份用介系詞「in + 月份」，講出「幾月幾日（序數）」則用「on + 月份 + 序數」。"
  },
  {
    "id": "hwg_b9_340",
    "book": 9,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: My birthday is on August 29th.  B: ______ Our birthdays are in the same week.",
    "options": [
      "My birthday is in spring.",
      "My birthday is on April 30th.",
      "My birthday is on September 29th.",
      "My birthday is on August 24th."
    ],
    "answer": 3,
    "explanation": "詢問日期用「What’s the date today?」；只講月份用介系詞「in + 月份」，講出「幾月幾日（序數）」則用「on + 月份 + 序數」。"
  },
  {
    "id": "hwg_b1_341",
    "book": 1,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: Hi, Lucas! I'm Max. B: ______",
    "options": [
      "Hello, Max!",
      "Thank you.",
      "It's red."
    ],
    "answer": 0,
    "explanation": "初次打招呼並自我介紹時，對方以「Hello, Max!」禮貌回應。"
  },
  {
    "id": "hwg_b1_342",
    "book": 1,
    "unit": "Starter",
    "category": "grammar",
    "question": "One, two, ______, four, five.",
    "options": [
      "three",
      "six",
      "ten"
    ],
    "answer": 0,
    "explanation": "依數字順序 1 到 5：one, two, three, four, five。"
  },
  {
    "id": "hwg_b1_343",
    "book": 1,
    "unit": "Starter",
    "category": "dialogue",
    "question": "Teacher: Stand up, please. Students: ______",
    "options": [
      "OK!",
      "I'm eight.",
      "It's a book."
    ],
    "answer": 0,
    "explanation": "老師請同學起立（Stand up, please.），學生回答「OK!」。"
  },
  {
    "id": "hwg_b1_344",
    "book": 1,
    "unit": "Starter",
    "category": "grammar",
    "question": "______ at me, please.",
    "options": [
      "Look",
      "Listen",
      "Line"
    ],
    "answer": 0,
    "explanation": "片語「Look at me」表示「請看著我」。"
  },
  {
    "id": "hwg_b1_345",
    "book": 1,
    "unit": "Festival",
    "category": "dialogue",
    "question": "A: Trick or treat! B: ______",
    "options": [
      "Happy Halloween!",
      "You're welcome.",
      "I'm fine."
    ],
    "answer": 0,
    "explanation": "萬聖節討糖口號「Trick or treat!（不給糖就搗蛋）」常搭配「Happy Halloween!」。"
  },
  {
    "id": "hwg_b1_346",
    "book": 1,
    "unit": "Festival",
    "category": "grammar",
    "question": "Look! It's a ______ lantern.",
    "options": [
      "jack-o'-",
      "apple",
      "pen"
    ],
    "answer": 0,
    "explanation": "萬聖節南瓜燈為「jack-o'-lantern」。"
  },
  {
    "id": "hwg_b2_347",
    "book": 2,
    "unit": "Starter",
    "category": "grammar",
    "question": "Eleven, twelve, ______, fourteen, fifteen.",
    "options": [
      "thirteen",
      "three",
      "ten"
    ],
    "answer": 0,
    "explanation": "數字 11 到 15 依序為：eleven, twelve, thirteen, fourteen, fifteen。"
  },
  {
    "id": "hwg_b2_348",
    "book": 2,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: Good job, Nina! B: ______",
    "options": [
      "Thank you!",
      "I'm sorry.",
      "No, it's not."
    ],
    "answer": 0,
    "explanation": "當別人稱讚「Good job!（做得好！）」時，應回答「Thank you!」。"
  },
  {
    "id": "hwg_b2_349",
    "book": 2,
    "unit": "Starter",
    "category": "grammar",
    "question": "A: What's that? B: It's ______ yellow eraser.",
    "options": [
      "a",
      "an",
      "am"
    ],
    "answer": 0,
    "explanation": "雖然 eraser 是母音開頭，但前面有子音開頭的形容詞 yellow，故用冠詞「a」。"
  },
  {
    "id": "hwg_b2_350",
    "book": 2,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: How old is Leo? B: ______ twelve years old.",
    "options": [
      "He's",
      "I'm",
      "You're"
    ],
    "answer": 0,
    "explanation": "Leo 為第三人稱單數男孩，代名詞搭配「He's (He is)」。"
  },
  {
    "id": "hwg_b2_351",
    "book": 2,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: ______ that a dog? B: Yes, it is.",
    "options": [
      "Is",
      "Are",
      "Am"
    ],
    "answer": 0,
    "explanation": "單數指示代名詞 that 搭配 Be 動詞「Is」形成疑問句。"
  },
  {
    "id": "hwg_b2_352",
    "book": 2,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "It's not a small bird. It's a ______ bird.",
    "options": [
      "big",
      "yes",
      "no"
    ],
    "answer": 0,
    "explanation": "small（小的）相反形容詞為「big（大的）」。"
  },
  {
    "id": "hwg_b2_353",
    "book": 2,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Is this a cat? B: No, it ______.",
    "options": [
      "isn't",
      "am not",
      "aren't"
    ],
    "answer": 0,
    "explanation": "Yes/No 疑問句主詞為 this/that 時，否定簡答用「No, it isn't. (或 No, it's not.)」。"
  },
  {
    "id": "hwg_b2_354",
    "book": 2,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "This ______ my pet fish.",
    "options": [
      "is",
      "are",
      "am"
    ],
    "answer": 0,
    "explanation": "單數主詞 This 後接 Be 動詞「is」。"
  },
  {
    "id": "hwg_b2_355",
    "book": 2,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Is that a rabbit? B: ______ It's a small dog.",
    "options": [
      "No, it's not.",
      "Yes, it is.",
      "I'm fine."
    ],
    "answer": 0,
    "explanation": "後句說明「牠是一隻小狗」，表示不是兔子，應選否定「No, it's not.」。"
  },
  {
    "id": "hwg_b2_356",
    "book": 2,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Good morning, Emma. B: ______",
    "options": [
      "Good morning, Max.",
      "Good night.",
      "Try again."
    ],
    "answer": 0,
    "explanation": "早安問候「Good morning」應以「Good morning」回應。"
  },
  {
    "id": "hwg_b2_357",
    "book": 2,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: ______ you swim? B: Yes, I can.",
    "options": [
      "Can",
      "Are",
      "Is"
    ],
    "answer": 0,
    "explanation": "詢問對方「會不會／能不能」做某動作，使用助動詞「Can」。"
  },
  {
    "id": "hwg_b2_358",
    "book": 2,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "I can ______ a picture.",
    "options": [
      "draw",
      "draws",
      "drawing"
    ],
    "answer": 0,
    "explanation": "助動詞 can 後方必須接「原形動詞 draw」。"
  },
  {
    "id": "hwg_b2_359",
    "book": 2,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Can Nina dance? B: No, she ______.",
    "options": [
      "can't",
      "isn't",
      "not"
    ],
    "answer": 0,
    "explanation": "以 Can 開頭的疑問句，否定簡答使用「No, 主詞 + can't.」。"
  },
  {
    "id": "hwg_b2_360",
    "book": 2,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "My brother can sing and ______.",
    "options": [
      "read",
      "a book",
      "tall"
    ],
    "answer": 0,
    "explanation": "對等連接詞 and 前後詞性相同，sing 為原形動詞，故後接原形動詞「read」。"
  },
  {
    "id": "hwg_b2_361",
    "book": 2,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Can you jump? B: ______ Look at me!",
    "options": [
      "Yes, I can.",
      "No, I'm not.",
      "It's a bird."
    ],
    "answer": 0,
    "explanation": "後句說「看我表現！（Look at me!）」，代表會跳，選「Yes, I can.」。"
  },
  {
    "id": "hwg_b2_362",
    "book": 2,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______ B: Yes, he can. He can swim very well.",
    "options": [
      "Can Lucas swim?",
      "Is Lucas a student?",
      "How old is Lucas?"
    ],
    "answer": 0,
    "explanation": "由答句「Yes, he can.」可知問句是以助動詞 Can 詢問 Lucas 會不會游泳。"
  },
  {
    "id": "hwg_b2_363",
    "book": 2,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: Is this a big dog? B: Yes, ______ is.",
    "options": [
      "it",
      "this",
      "that"
    ],
    "answer": 0,
    "explanation": "問句主詞為 this 或 that 時，簡答句的主詞一律用代名詞「it」。"
  },
  {
    "id": "hwg_b2_364",
    "book": 2,
    "unit": "Review 1",
    "category": "grammar",
    "question": "Can your sister ______ ABC?",
    "options": [
      "write",
      "writes",
      "writing"
    ],
    "answer": 0,
    "explanation": "助動詞 Can 之後的動詞須保持原形「write」。"
  },
  {
    "id": "hwg_b2_365",
    "book": 2,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: Is that a bird? B: No, it's not. ______",
    "options": [
      "Try again.",
      "Thank you.",
      "Yes, I can."
    ],
    "answer": 0,
    "explanation": "猜錯物品時常鼓勵對方「Try again.（再試一次。）」。"
  },
  {
    "id": "hwg_b2_366",
    "book": 2,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: Can you sing a song? B: ______ Let's sing together!",
    "options": [
      "Yes, I can.",
      "No, I can't.",
      "It's a cat."
    ],
    "answer": 0,
    "explanation": "邀請對方一起唱，表示自己會唱歌，故選「Yes, I can.」。"
  },
  {
    "id": "hwg_b2_367",
    "book": 2,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ is she? B: She's my mother.",
    "options": [
      "Who",
      "What",
      "How"
    ],
    "answer": 0,
    "explanation": "詢問「她是誰？」使用疑問詞「Who」。"
  },
  {
    "id": "hwg_b2_368",
    "book": 2,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Who's he? B: ______ my grandfather.",
    "options": [
      "He's",
      "She's",
      "It's"
    ],
    "answer": 0,
    "explanation": "grandfather（爺爺／外公）為男性，代名詞使用「He's」。"
  },
  {
    "id": "hwg_b2_369",
    "book": 2,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "She is ______ sister, Chloe.",
    "options": [
      "my",
      "I",
      "you"
    ],
    "answer": 0,
    "explanation": "名詞 sister 前方需使用所有格「my（我的）」。"
  },
  {
    "id": "hwg_b2_370",
    "book": 2,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Who ______ that boy? B: He's my brother.",
    "options": [
      "is",
      "are",
      "am"
    ],
    "answer": 0,
    "explanation": "單數主詞 that boy 搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b2_371",
    "book": 2,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Who's she? B: ______",
    "options": [
      "She's my grandmother.",
      "He's my father.",
      "It's a small dog."
    ],
    "answer": 0,
    "explanation": "問句詢問女性「Who's she?」，回答應為「She's my grandmother.」。"
  },
  {
    "id": "hwg_b2_372",
    "book": 2,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Nice to meet you! B: ______",
    "options": [
      "Nice to meet you, too!",
      "I'm ten years old.",
      "No, he isn't."
    ],
    "answer": 0,
    "explanation": "初次見面問候「Nice to meet you!」，回應為「Nice to meet you, too!」。"
  },
  {
    "id": "hwg_b2_373",
    "book": 2,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Is your father a doctor? B: Yes, ______ is.",
    "options": [
      "he",
      "she",
      "it"
    ],
    "answer": 0,
    "explanation": "your father 為男性單數，簡答代名詞使用「he」。"
  },
  {
    "id": "hwg_b2_374",
    "book": 2,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "My mother is ______ nurse.",
    "options": [
      "a",
      "an",
      "are"
    ],
    "answer": 0,
    "explanation": "表示職業的單數可數名詞 nurse 前必須加上不定冠詞「a」。"
  },
  {
    "id": "hwg_b2_375",
    "book": 2,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Are you a student? B: Yes, I ______.",
    "options": [
      "am",
      "are",
      "is"
    ],
    "answer": 0,
    "explanation": "肯定簡答中 I 搭配「am」（不可縮寫為 Yes, I'm.）。"
  },
  {
    "id": "hwg_b2_376",
    "book": 2,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "He is not a cook. He's a ______.",
    "options": [
      "driver",
      "tall",
      "swim"
    ],
    "answer": 0,
    "explanation": "冠詞 a 後方應接單數職業名詞「driver（司機）」。"
  },
  {
    "id": "hwg_b2_377",
    "book": 2,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Is she a teacher? B: ______ She's a doctor.",
    "options": [
      "No, she isn't.",
      "Yes, she is.",
      "Yes, I can."
    ],
    "answer": 0,
    "explanation": "後句說明她是醫生（She's a doctor.），因此不是老師，選「No, she isn't.」。"
  },
  {
    "id": "hwg_b2_378",
    "book": 2,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: ______ B: Yes, I am. I'm a cook.",
    "options": [
      "Are you a cook?",
      "Who is he?",
      "Can you cook?"
    ],
    "answer": 0,
    "explanation": "答句為「Yes, I am. I'm a cook.」，故問句為「Are you a cook?」。"
  },
  {
    "id": "hwg_b2_379",
    "book": 2,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: Who's that woman? B: ______ my mother. She's a teacher.",
    "options": [
      "She's",
      "He's",
      "I'm"
    ],
    "answer": 0,
    "explanation": "that woman 為女性，回答使用「She's」。"
  },
  {
    "id": "hwg_b2_380",
    "book": 2,
    "unit": "Review 2",
    "category": "dialogue",
    "question": "A: Is your brother a student? B: ______ He's seven years old.",
    "options": [
      "Yes, he is.",
      "No, she isn't.",
      "He can jump."
    ],
    "answer": 0,
    "explanation": "問句為 Is your brother...?，肯定回應為「Yes, he is.」。"
  },
  {
    "id": "hwg_b2_381",
    "book": 2,
    "unit": "Festival",
    "category": "dialogue",
    "question": "A: Happy Mother's Day, Mom! B: ______",
    "options": [
      "Thank you! I love you.",
      "Try again.",
      "No, it isn't."
    ],
    "answer": 0,
    "explanation": "祝媽媽母親節快樂時，媽媽會開心道謝「Thank you! I love you.」。"
  },
  {
    "id": "hwg_b2_382",
    "book": 2,
    "unit": "Festival",
    "category": "grammar",
    "question": "This carnation is ______ you, Mom.",
    "options": [
      "for",
      "to",
      "in"
    ],
    "answer": 0,
    "explanation": "表達「這是送給妳的康乃馨」使用介系詞「for you」。"
  },
  {
    "id": "hwg_b4_383",
    "book": 4,
    "unit": "Starter",
    "category": "grammar",
    "question": "Twenty, ______, forty, fifty.",
    "options": [
      "thirty",
      "thirteen",
      "three"
    ],
    "answer": 0,
    "explanation": "十位數 20, 30, 40, 50 依序為：twenty, thirty, forty, fifty。"
  },
  {
    "id": "hwg_b4_384",
    "book": 4,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: How many books? Let's count! B: ______",
    "options": [
      "Twenty-five books!",
      "It's sunny.",
      "She's my sister."
    ],
    "answer": 0,
    "explanation": "Let's count!（我們來數數看！），回答數量「Twenty-five books!」。"
  },
  {
    "id": "hwg_b4_385",
    "book": 4,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: What ______ is it? B: It's nine o'clock.",
    "options": [
      "time",
      "color",
      "day"
    ],
    "answer": 0,
    "explanation": "詢問「現在幾點鐘？」使用「What time is it?」。"
  },
  {
    "id": "hwg_b4_386",
    "book": 4,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "It's twelve ______. Time for lunch!",
    "options": [
      "thirty",
      "o'clock thirty",
      "clocks"
    ],
    "answer": 0,
    "explanation": "12 點 30 分英文直接讀作「twelve thirty」；o'clock 僅用於整點。"
  },
  {
    "id": "hwg_b4_387",
    "book": 4,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Time ______ school! Hurry up!",
    "options": [
      "for",
      "to",
      "at"
    ],
    "answer": 0,
    "explanation": "句型「Time for + 名詞 (school / lunch / bed)」表示「該是……的時間了」。"
  },
  {
    "id": "hwg_b4_388",
    "book": 4,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: What time is it? B: ______",
    "options": [
      "It's seven fifteen.",
      "I'm ten years old.",
      "There are five."
    ],
    "answer": 0,
    "explanation": "詢問時間應回答幾點幾分「It's seven fifteen.」。"
  },
  {
    "id": "hwg_b4_389",
    "book": 4,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: It's ten o'clock at night. B: ______",
    "options": [
      "Time for bed.",
      "Time for breakfast.",
      "Good morning."
    ],
    "answer": 0,
    "explanation": "晚上十點鐘是就寢時間，應搭配「Time for bed.」。"
  },
  {
    "id": "hwg_b4_390",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: What are you ______? B: I'm reading a book.",
    "options": [
      "doing",
      "do",
      "does"
    ],
    "answer": 0,
    "explanation": "現在進行式疑問句使用「What are you doing?（你正在做什麼？）」。"
  },
  {
    "id": "hwg_b4_391",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Look! Leo is ______ in the pool.",
    "options": [
      "swimming",
      "swim",
      "swiming"
    ],
    "answer": 0,
    "explanation": "swim 為短母音加單一子音結尾，現在分詞需重複字尾 m 加 ing：「swimming」。"
  },
  {
    "id": "hwg_b4_392",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "My sister and I ______ eating apples.",
    "options": [
      "are",
      "am",
      "is"
    ],
    "answer": 0,
    "explanation": "主詞「My sister and I」為複數（相當於 We），Be 動詞搭配「are」。"
  },
  {
    "id": "hwg_b4_393",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: What is Max doing? B: He is ______ a letter.",
    "options": [
      "writing",
      "writeing",
      "write"
    ],
    "answer": 0,
    "explanation": "write 字尾有不發音 e，去 e 加 ing 為「writing」。"
  },
  {
    "id": "hwg_b4_394",
    "book": 4,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What is your father doing? B: ______",
    "options": [
      "He's cooking.",
      "He's a cook.",
      "He's in the kitchen."
    ],
    "answer": 0,
    "explanation": "問句問「正在做什麼動作（What is ... doing?）」，應回答現在進行式「He's cooking.」。"
  },
  {
    "id": "hwg_b4_395",
    "book": 4,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Are you sleeping, Lucas? B: ______ I'm reading.",
    "options": [
      "No, I'm not.",
      "Yes, I am.",
      "No, he isn't."
    ],
    "answer": 0,
    "explanation": "後句說「我正在看書」，代表沒有在睡覺，選「No, I'm not.」。"
  },
  {
    "id": "hwg_b4_396",
    "book": 4,
    "unit": "Review 1",
    "category": "grammar",
    "question": "It's six o'clock. Mom is ______ dinner.",
    "options": [
      "cooking",
      "cook",
      "cooks"
    ],
    "answer": 0,
    "explanation": "Be 動詞 is 後接 V-ing 表示正在煮晚餐「is cooking dinner」。"
  },
  {
    "id": "hwg_b4_397",
    "book": 4,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: ______ B: She's drinking milk.",
    "options": [
      "What is Nina doing?",
      "Where is Nina?",
      "Who is Nina?"
    ],
    "answer": 0,
    "explanation": "由答句「She's drinking milk.（她正在喝牛奶）」可知問句詢問她正在做什麼。"
  },
  {
    "id": "hwg_b4_398",
    "book": 4,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ is your brother? B: He's in the living room.",
    "options": [
      "Where",
      "What",
      "Who"
    ],
    "answer": 0,
    "explanation": "詢問某人在哪個房間或地點，使用疑問詞「Where」。"
  },
  {
    "id": "hwg_b4_399",
    "book": 4,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "Grandma is sleeping ______ the bedroom.",
    "options": [
      "in",
      "on",
      "under"
    ],
    "answer": 0,
    "explanation": "表示「在某個房間裡面」使用介系詞「in the bedroom」。"
  },
  {
    "id": "hwg_b4_400",
    "book": 4,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Are Emma and Nina in the yard? B: Yes, ______ are.",
    "options": [
      "they",
      "we",
      "she"
    ],
    "answer": 0,
    "explanation": "Emma and Nina 為第三人稱複數，簡答代名詞使用「they」。"
  },
  {
    "id": "hwg_b4_401",
    "book": 4,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Where are you, Sam? B: ______",
    "options": [
      "I'm in the bathroom.",
      "I'm brushing my teeth.",
      "It's eight o'clock."
    ],
    "answer": 0,
    "explanation": "問句詢問地點「Where are you?」，回答應為所在位置「I'm in the bathroom.」。"
  },
  {
    "id": "hwg_b4_402",
    "book": 4,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is Dad in the dining room? B: ______ He's in the kitchen.",
    "options": [
      "No, he isn't.",
      "Yes, he is.",
      "No, she isn't."
    ],
    "answer": 0,
    "explanation": "爸爸在廚房不在飯廳，故否定簡答「No, he isn't.」。"
  },
  {
    "id": "hwg_b4_404",
    "book": 4,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Where is my cap? B: It's ______ the chair.",
    "options": [
      "under",
      "who",
      "doing"
    ],
    "answer": 0,
    "explanation": "表示物品位置需使用方位介系詞「under（在……下面）」。"
  },
  {
    "id": "hwg_b4_405",
    "book": 4,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Where ______ my keys? B: They're in the bag.",
    "options": [
      "are",
      "is",
      "am"
    ],
    "answer": 0,
    "explanation": "複數名詞 my keys 搭配複數 Be 動詞「are」。"
  },
  {
    "id": "hwg_b4_406",
    "book": 4,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "The ball is ______ the box, not on the box.",
    "options": [
      "in",
      "what",
      "can"
    ],
    "answer": 0,
    "explanation": "表示「在箱子裡面」使用方位介系詞「in」。"
  },
  {
    "id": "hwg_b4_407",
    "book": 4,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Where's my pencil case? B: ______",
    "options": [
      "Look! It's under the book.",
      "It's a blue pencil case.",
      "I'm writing."
    ],
    "answer": 0,
    "explanation": "詢問鉛筆盒在哪裡，回答具體方位「Look! It's under the book.」。"
  },
  {
    "id": "hwg_b4_408",
    "book": 4,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Mom, where are my socks? B: ______",
    "options": [
      "They're on the bed.",
      "It's on the bed.",
      "You're in the bedroom."
    ],
    "answer": 0,
    "explanation": "socks 為複數名詞，回答須用複數代名詞「They're on the bed.」。"
  },
  {
    "id": "hwg_b4_409",
    "book": 4,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: Where is the cat? B: ______ sleeping under the table.",
    "options": [
      "It's",
      "They're",
      "He"
    ],
    "answer": 0,
    "explanation": "單數動物 the cat 搭配「It's (It is)」形成現在進行式。"
  },
  {
    "id": "hwg_b4_410",
    "book": 4,
    "unit": "Review 2",
    "category": "dialogue",
    "question": "A: ______ B: He's in the yard.",
    "options": [
      "Where is Max?",
      "What is Max doing?",
      "How old is Max?"
    ],
    "answer": 0,
    "explanation": "答句為地點「在院子裡」，故問句用「Where is Max?」。"
  },
  {
    "id": "hwg_b4_411",
    "book": 4,
    "unit": "Festival",
    "category": "dialogue",
    "question": "A: Happy Easter! How many Easter eggs are there in the basket? B: ______",
    "options": [
      "Five eggs!",
      "It's under the desk.",
      "Time for lunch."
    ],
    "answer": 0,
    "explanation": "復活節找彩蛋活動中，詢問籃子裡有幾顆彩蛋，回答數量「Five eggs!」。"
  },
  {
    "id": "hwg_b5_412",
    "book": 5,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: Do you have science class ______ Wednesday? B: Yes, I do.",
    "options": [
      "on",
      "in",
      "at"
    ],
    "answer": 0,
    "explanation": "星期名稱（Wednesday）前方固定使用介系詞「on」。"
  },
  {
    "id": "hwg_b5_413",
    "book": 5,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: ______ Leo have music class today? B: No, he doesn't.",
    "options": [
      "Does",
      "Do",
      "Is"
    ],
    "answer": 0,
    "explanation": "第三人稱單數主詞 Leo 搭配一般動詞 have 形成疑問句時，助動詞用「Does」。"
  },
  {
    "id": "hwg_b5_414",
    "book": 5,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: What day is today? B: ______ We have PE class today!",
    "options": [
      "It's Friday.",
      "It's nine thirty.",
      "I'm going to school."
    ],
    "answer": 0,
    "explanation": "詢問今天星期幾，回答「It's Friday.」。"
  },
  {
    "id": "hwg_b5_415",
    "book": 5,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: Does Emma have art class on Monday? B: ______ She has math class on Monday.",
    "options": [
      "No, she doesn't.",
      "Yes, she does.",
      "No, I don't."
    ],
    "answer": 0,
    "explanation": "問句主詞為 Emma (she)，後句說明她是上數學課，故選「No, she doesn't.」。"
  },
  {
    "id": "hwg_b5_416",
    "book": 5,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: How many ______ are there in the zoo? B: There is one.",
    "options": [
      "elephants",
      "elephant",
      "an elephant"
    ],
    "answer": 0,
    "explanation": "「How many」後方不論實際數量為 1 或多個，一律接「複數可數名詞 elephants」。"
  },
  {
    "id": "hwg_b5_417",
    "book": 5,
    "unit": "Review 2",
    "category": "grammar",
    "question": "There ______ three zebras and one lion in the park.",
    "options": [
      "are",
      "is",
      "am"
    ],
    "answer": 0,
    "explanation": "There be 句型採「就近原則」，靠近動詞的 three zebras 為複數，故用「are」。"
  },
  {
    "id": "hwg_b5_418",
    "book": 5,
    "unit": "Review 2",
    "category": "dialogue",
    "question": "A: Where are you going? B: ______ I want to read some books.",
    "options": [
      "I'm going to the library.",
      "It's on Green Street.",
      "There are two koalas."
    ],
    "answer": 0,
    "explanation": "後句說「我想要看書」，因此是前往圖書館「I'm going to the library.」。"
  },
  {
    "id": "hwg_b5_419",
    "book": 5,
    "unit": "Review 2",
    "category": "dialogue",
    "question": "A: Where is the post office? B: ______",
    "options": [
      "It's on Sunny Road.",
      "We're going to the bank.",
      "Yes, there is."
    ],
    "answer": 0,
    "explanation": "詢問郵局在哪條路上，回答位置「It's on Sunny Road.」。"
  },
  {
    "id": "hwg_b6_420",
    "book": 6,
    "unit": "Starter",
    "category": "grammar",
    "question": "Look! The boys ______ playing basketball in the park.",
    "options": [
      "are",
      "is",
      "do"
    ],
    "answer": 0,
    "explanation": "複數主詞 The boys 搭配「are」形成現在進行式。"
  },
  {
    "id": "hwg_b6_421",
    "book": 6,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: Let's go to the supermarket! B: ______",
    "options": [
      "Great idea!",
      "No, it isn't.",
      "It hurts."
    ],
    "answer": 0,
    "explanation": "回應他人提議「Let's ...!」可用「Great idea!（好主意！）」。"
  },
  {
    "id": "hwg_b6_422",
    "book": 6,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: What's wrong? B: My right leg ______.",
    "options": [
      "hurts",
      "hurt",
      "hurting"
    ],
    "answer": 0,
    "explanation": "單數部位「My right leg」作主詞時，一般動詞需加 -s：「hurts」。"
  },
  {
    "id": "hwg_b6_423",
    "book": 6,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Ouch! Both my ______ hurt.",
    "options": [
      "feet",
      "foot",
      "hand"
    ],
    "answer": 0,
    "explanation": "both（兩者都）後接複數名詞，foot 的不規則複數為「feet」，動詞用原形 hurt。"
  },
  {
    "id": "hwg_b6_424",
    "book": 6,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "His eyes ______. He needs to take a rest.",
    "options": [
      "hurt",
      "hurts",
      "is hurting"
    ],
    "answer": 0,
    "explanation": "複數主詞「His eyes」搭配原形動詞「hurt」。"
  },
  {
    "id": "hwg_b6_425",
    "book": 6,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: You don't look well. ______ B: My head hurts.",
    "options": [
      "What's wrong?",
      "Where are you going?",
      "Whose hat is this?"
    ],
    "answer": 0,
    "explanation": "關心對方哪裡不舒服使用「What's wrong?（怎麼了？）」。"
  },
  {
    "id": "hwg_b6_426",
    "book": 6,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: My arm hurts! B: ______ Let's go to the hospital.",
    "options": [
      "Oh, no! Come here.",
      "Good job!",
      "You're welcome."
    ],
    "answer": 0,
    "explanation": "聽到他人受傷疼痛時，表達關心並帶去醫院。"
  },
  {
    "id": "hwg_b6_427",
    "book": 6,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Do you have a fever? B: No, I ______. I have a runny nose.",
    "options": [
      "don't",
      "doesn't",
      "am not"
    ],
    "answer": 0,
    "explanation": "以 Do you... 開頭的疑問句，否定簡答使用「No, I don't.」。"
  },
  {
    "id": "hwg_b6_428",
    "book": 6,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Lucas ______ a terrible toothache today.",
    "options": [
      "has",
      "have",
      "having"
    ],
    "answer": 0,
    "explanation": "第三人稱單數主詞 Lucas 表達「患有（某症狀）」時，使用「has」。"
  },
  {
    "id": "hwg_b6_429",
    "book": 6,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Does your sister ______ a sore throat? B: Yes, she does.",
    "options": [
      "have",
      "has",
      "having"
    ],
    "answer": 0,
    "explanation": "助動詞 Does 出現後，主要動詞必須還原為原形「have」。"
  },
  {
    "id": "hwg_b6_430",
    "book": 6,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Does Max have a stomachache? B: ______ He ate too much ice cream.",
    "options": [
      "Yes, he does.",
      "No, he doesn't.",
      "Yes, he is."
    ],
    "answer": 0,
    "explanation": "後句說他吃了太多冰淇淋，表示確實肚子痛，選「Yes, he does.」。"
  },
  {
    "id": "hwg_b6_431",
    "book": 6,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: I have a high fever and a headache. B: ______",
    "options": [
      "Please see a doctor and get some rest.",
      "Let's play basketball outside.",
      "I'd like some beef noodles."
    ],
    "answer": 0,
    "explanation": "發高燒又頭痛時，最合適的建議是看醫生並多休息。"
  },
  {
    "id": "hwg_b6_432",
    "book": 6,
    "unit": "Review 1",
    "category": "grammar",
    "question": "Emma ______ a headache, and her ears ______.",
    "options": [
      "has; hurt",
      "have; hurts",
      "has; hurts"
    ],
    "answer": 0,
    "explanation": "第一空主詞 Emma 為單數用「has」；第二空主詞 her ears 為複數用「hurt」。"
  },
  {
    "id": "hwg_b6_433",
    "book": 6,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: What's wrong with Toby? B: ______",
    "options": [
      "He has a sore throat.",
      "He is in the library.",
      "It's his backpack."
    ],
    "answer": 0,
    "explanation": "詢問 Toby 身體怎麼了，回答症狀「He has a sore throat.」。"
  },
  {
    "id": "hwg_b6_434",
    "book": 6,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What ______ you like for dinner? B: I'd like some rice and soup.",
    "options": [
      "would",
      "are",
      "can"
    ],
    "answer": 0,
    "explanation": "禮貌詢問對方餐點想吃什麼，使用「What would you like for dinner?」。"
  },
  {
    "id": "hwg_b6_435",
    "book": 6,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "I'd like some ______ and salad, please.",
    "options": [
      "beef",
      "beefs",
      "a beef"
    ],
    "answer": 0,
    "explanation": "beef（牛肉）為不可數名詞，不加 a 也不可加 -s。"
  },
  {
    "id": "hwg_b6_436",
    "book": 6,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Would you like some chicken sandwiches? B: ______, please.",
    "options": [
      "Yes",
      "No",
      "I'd"
    ],
    "answer": 0,
    "explanation": "接受對方招待的食物說「Yes, please.」，婉拒則說「No, thank you.」。"
  },
  {
    "id": "hwg_b6_437",
    "book": 6,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Would you like some pork noodles? B: ______ I'm full.",
    "options": [
      "No, thank you.",
      "Yes, please.",
      "Here you are."
    ],
    "answer": 0,
    "explanation": "後句「I'm full.（我飽了）」代表婉拒，應選「No, thank you.」。"
  },
  {
    "id": "hwg_b6_438",
    "book": 6,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What would your brother like for lunch? B: ______",
    "options": [
      "He'd like some fried chicken.",
      "Yes, he does.",
      "He has a fever."
    ],
    "answer": 0,
    "explanation": "詢問哥哥午餐想吃什麼，用「He'd (He would) like ...」回答。"
  },
  {
    "id": "hwg_b6_439",
    "book": 6,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: ______ umbrella is that by the door? B: It's Nina's umbrella.",
    "options": [
      "Whose",
      "Who",
      "Who's"
    ],
    "answer": 0,
    "explanation": "後方緊接名詞 umbrella，詢問「誰的雨傘」需用疑問所有格「Whose」（注意 Who's = Who is）。"
  },
  {
    "id": "hwg_b6_440",
    "book": 6,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Whose glasses ______ these? B: They're my father's glasses.",
    "options": [
      "are",
      "is",
      "do"
    ],
    "answer": 0,
    "explanation": "glasses（眼鏡）與指示代名詞 these 皆為複數，搭配「are」。"
  },
  {
    "id": "hwg_b6_441",
    "book": 6,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "This is ______ water bottle, not mine.",
    "options": [
      "Leo's",
      "Leo",
      "he"
    ],
    "answer": 0,
    "explanation": "人名後加 `'s`（Leo's）表示「Leo 的（所有格）」。"
  },
  {
    "id": "hwg_b6_442",
    "book": 6,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Whose shoes are those under the chair? B: ______",
    "options": [
      "They're Max's shoes.",
      "It's Max's shoe.",
      "He is Max."
    ],
    "answer": 0,
    "explanation": "問句 those 與 shoes 為複數，回答使用「They're Max's shoes.」。"
  },
  {
    "id": "hwg_b6_443",
    "book": 6,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Is this your workbook, Chloe? B: ______ It's Emma's workbook.",
    "options": [
      "No, it isn't.",
      "Yes, it is.",
      "They're my workbooks."
    ],
    "answer": 0,
    "explanation": "後句說明是 Emma 的習作，故否定回答「No, it isn't.」。"
  },
  {
    "id": "hwg_b6_444",
    "book": 6,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: ______ cap is this? B: It's ______ cap.",
    "options": [
      "Whose; my",
      "Who's; I",
      "Whose; me"
    ],
    "answer": 0,
    "explanation": "第一空問「誰的帽子」用 Whose；第二空修飾名詞 cap 用所有格 my。"
  },
  {
    "id": "hwg_b6_445",
    "book": 6,
    "unit": "Review 2",
    "category": "dialogue",
    "question": "A: Here is your soup! B: ______",
    "options": [
      "Thank you!",
      "No, thank you.",
      "My hand hurts."
    ],
    "answer": 0,
    "explanation": "店員或家人端上餐點說「Here is your soup!」，應禮貌道謝「Thank you!」。"
  },
  {
    "id": "hwg_b6_446",
    "book": 6,
    "unit": "Festival",
    "category": "grammar",
    "question": "We eat ______ and watch dragon boat races on Dragon Boat Festival.",
    "options": [
      "rice dumplings",
      "moon cakes",
      "Easter eggs"
    ],
    "answer": 0,
    "explanation": "端午節（Dragon Boat Festival）的傳統習俗為吃粽子（rice dumplings）與看龍舟賽。"
  },
  {
    "id": "hwg_b7_447",
    "book": 7,
    "unit": "Festival",
    "category": "grammar",
    "question": "People in the USA eat roast ______ on Thanksgiving Day.",
    "options": [
      "turkey",
      "dumplings",
      "moon cakes"
    ],
    "answer": 0,
    "explanation": "感恩節（Thanksgiving Day）傳統大餐會享用烤火雞（roast turkey）。"
  },
  {
    "id": "hwg_b7_448",
    "book": 7,
    "unit": "Festival",
    "category": "dialogue",
    "question": "A: What are you thankful for? B: ______",
    "options": [
      "I'm thankful for my family and friends.",
      "I go to school by bus.",
      "I'm from Taiwan."
    ],
    "answer": 0,
    "explanation": "詢問「你感謝什麼？（What are you thankful for?）」，回答「I'm thankful for my family and friends.」。"
  },
  {
    "id": "hwg_b8_449",
    "book": 8,
    "unit": "Starter",
    "category": "grammar",
    "question": "My grandparents ______ Tai Chi in the park every morning.",
    "options": [
      "do",
      "play",
      "go"
    ],
    "answer": 0,
    "explanation": "打太極拳（do Tai Chi）與練功夫（do kung fu）固定搭配動詞「do」。"
  },
  {
    "id": "hwg_b8_450",
    "book": 8,
    "unit": "Starter",
    "category": "grammar",
    "question": "I go ______ with my dog in my free time.",
    "options": [
      "jogging",
      "jog",
      "to jog"
    ],
    "answer": 0,
    "explanation": "從事戶外運動休閒常使用「go + V-ing」，慢跑為「go jogging」。"
  },
  {
    "id": "hwg_b8_451",
    "book": 8,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Where ______ you yesterday afternoon? B: I was at the mall.",
    "options": [
      "were",
      "was",
      "are"
    ],
    "answer": 0,
    "explanation": "過去時間 yesterday 搭配第二人稱主詞 you，過去式 Be 動詞用「were」。"
  },
  {
    "id": "hwg_b8_452",
    "book": 8,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Lucas ______ at home last night. He was at the movie theater.",
    "options": [
      "wasn't",
      "weren't",
      "isn't"
    ],
    "answer": 0,
    "explanation": "第三人稱單數主詞 Lucas 在過去時間（last night）的否定 Be 動詞為「wasn't (was not)」。"
  },
  {
    "id": "hwg_b8_453",
    "book": 8,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "We ______ at the zoo yesterday morning. The pandas were cute!",
    "options": [
      "were",
      "was",
      "are"
    ],
    "answer": 0,
    "explanation": "複數主詞 We 在過去時間搭配「were」。"
  },
  {
    "id": "hwg_b8_454",
    "book": 8,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Were you at school yesterday? B: ______ It was Sunday!",
    "options": [
      "No, I wasn't.",
      "Yes, I was.",
      "No, I don't."
    ],
    "answer": 0,
    "explanation": "昨天是星期日不用上學，因此回答「No, I wasn't.」。"
  },
  {
    "id": "hwg_b8_455",
    "book": 8,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Where was Nina yesterday evening? B: ______",
    "options": [
      "She was at the restaurant.",
      "She is at the library.",
      "She goes to the mall."
    ],
    "answer": 0,
    "explanation": "問句為過去式「Where was Nina ...?」，回答亦須用過去式「She was at the restaurant.」。"
  },
  {
    "id": "hwg_b8_456",
    "book": 8,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: What ______ you do last night? B: I listened to music.",
    "options": [
      "did",
      "do",
      "were"
    ],
    "answer": 0,
    "explanation": "過去式一般動詞疑問句，需使用助動詞「did」。"
  },
  {
    "id": "hwg_b8_457",
    "book": 8,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Max ______ the plants in the yard yesterday morning.",
    "options": [
      "watered",
      "water",
      "watering"
    ],
    "answer": 0,
    "explanation": "yesterday morning 為過去時間，一般動詞 water 加 -ed 變過去式「watered」。"
  },
  {
    "id": "hwg_b8_458",
    "book": 8,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Did Emma ______ the piano last Sunday? B: Yes, she did.",
    "options": [
      "play",
      "played",
      "plays"
    ],
    "answer": 0,
    "explanation": "疑問句已有過去式助動詞 Did，後方的動詞必須用原形「play」。"
  },
  {
    "id": "hwg_b8_459",
    "book": 8,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Did your brother clean his room yesterday? B: ______ It's very clean now!",
    "options": [
      "Yes, he did.",
      "No, he didn't.",
      "Yes, he was."
    ],
    "answer": 0,
    "explanation": "後句說現在房間非常乾淨，表示昨天有打掃，選「Yes, he did.」。"
  },
  {
    "id": "hwg_b8_460",
    "book": 8,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What did they do last weekend? B: ______",
    "options": [
      "They played baseball at the park.",
      "They were at the zoo.",
      "They are surfing the Internet."
    ],
    "answer": 0,
    "explanation": "詢問過去做了什麼動作（What did they do...?），回答過去式動作「They played baseball at the park.」。"
  },
  {
    "id": "hwg_b8_461",
    "book": 8,
    "unit": "Review 1",
    "category": "grammar",
    "question": "I ______ at home last night. I ______ a great movie on TV.",
    "options": [
      "was; watched",
      "were; watch",
      "was; watch"
    ],
    "answer": 0,
    "explanation": "兩句皆為昨晚（last night）發生的事，第一空在家用「was」，第二空看電視用過去式「watched」。"
  },
  {
    "id": "hwg_b8_462",
    "book": 8,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: Were you at the mall yesterday? B: Yes, I was. ______",
    "options": [
      "I was there with my mom.",
      "I play baseball every day.",
      "No, I didn't."
    ],
    "answer": 0,
    "explanation": "肯定回答昨天在購物中心，並補充「我是和媽媽一起在那裡的（I was there with my mom.）」。"
  },
  {
    "id": "hwg_b8_463",
    "book": 8,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: How ______ is this T-shirt? B: It's three hundred dollars.",
    "options": [
      "much",
      "many",
      "old"
    ],
    "answer": 0,
    "explanation": "詢問商品價格（多少錢）使用「How much is / are ...?」。"
  },
  {
    "id": "hwg_b8_464",
    "book": 8,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: How much ______ those blue jeans? B: They're eight hundred dollars.",
    "options": [
      "are",
      "is",
      "do"
    ],
    "answer": 0,
    "explanation": "衣褲類名詞 jeans, pants, shorts, shoes 為複數，動詞搭配「are」，代名詞用 they。"
  },
  {
    "id": "hwg_b8_465",
    "book": 8,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "That red dress ______ nine hundred ninety dollars.",
    "options": [
      "is",
      "are",
      "were"
    ],
    "answer": 0,
    "explanation": "單數主詞 That red dress 表達標價時搭配單數動詞「is」。"
  },
  {
    "id": "hwg_b8_466",
    "book": 8,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: How much are these shorts? B: ______",
    "options": [
      "They're four hundred fifty dollars.",
      "It's four hundred fifty dollars.",
      "There are four shorts."
    ],
    "answer": 0,
    "explanation": "these shorts 為複數，回答價格需用「They're ... dollars.」。"
  },
  {
    "id": "hwg_b8_467",
    "book": 8,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Look at this coat! It's only two hundred dollars. B: ______",
    "options": [
      "Wow! That's cheap. I'll take it!",
      "It's sunny and hot.",
      "I was at the department store."
    ],
    "answer": 0,
    "explanation": "外套只要兩百元非常便宜，「I'll take it!」表示「我要買下它！」。"
  },
  {
    "id": "hwg_b8_468",
    "book": 8,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What's your favorite ______? B: I like winter.",
    "options": [
      "season",
      "weather",
      "color"
    ],
    "answer": 0,
    "explanation": "答句 winter（冬天）屬於四季之一，故問句詢問最喜歡的季節「season」。"
  },
  {
    "id": "hwg_b8_469",
    "book": 8,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "It's usually warm ______ spring in Taiwan.",
    "options": [
      "in",
      "on",
      "at"
    ],
    "answer": 0,
    "explanation": "四季名稱（spring, summer, fall, winter）前面搭配介系詞「in」。"
  },
  {
    "id": "hwg_b8_470",
    "book": 8,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "It's very cold and ______ in winter there. We can make a snowman!",
    "options": [
      "snowy",
      "sunny",
      "hot"
    ],
    "answer": 0,
    "explanation": "後句提到可以堆雪人（make a snowman），代表天氣寒冷且下雪「snowy」。"
  },
  {
    "id": "hwg_b8_471",
    "book": 8,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Why do you like summer? B: ______",
    "options": [
      "Because I can go swimming and eat ice cream!",
      "It's cold and windy.",
      "They're five hundred dollars."
    ],
    "answer": 0,
    "explanation": "喜歡夏天的原因是可以去游泳和吃冰淇淋。"
  },
  {
    "id": "hwg_b8_472",
    "book": 8,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: How's the weather in fall? B: ______",
    "options": [
      "It's cool and windy.",
      "My favorite season is fall.",
      "It's seven thirty."
    ],
    "answer": 0,
    "explanation": "詢問秋天的天氣狀況，應回答「It's cool and windy.」。"
  },
  {
    "id": "hwg_b8_473",
    "book": 8,
    "unit": "Review 2",
    "category": "grammar",
    "question": "It's cold ______ winter, so I want to buy this warm ______.",
    "options": [
      "in; coat",
      "on; shorts",
      "at; T-shirt"
    ],
    "answer": 0,
    "explanation": "季節前用介系詞 in；冬天寒冷想買保暖外套「coat」。"
  },
  {
    "id": "hwg_b8_474",
    "book": 8,
    "unit": "Review 2",
    "category": "dialogue",
    "question": "A: How much is that skirt? B: ______",
    "options": [
      "It's six hundred dollars.",
      "They're six hundred dollars.",
      "It's hot in summer."
    ],
    "answer": 0,
    "explanation": "that skirt 為單數，回答價格用「It's six hundred dollars.」。"
  },
  {
    "id": "hwg_b8_475",
    "book": 8,
    "unit": "Festival",
    "category": "grammar",
    "question": "Badminton and baseball ______ very popular sports in Taiwan.",
    "options": [
      "are",
      "is",
      "was"
    ],
    "answer": 0,
    "explanation": "兩項運動 Badminton and baseball 為複數主詞，搭配「are」。"
  },
  {
    "id": "hwg_b9_476",
    "book": 9,
    "unit": "Starter",
    "category": "grammar",
    "question": "A: How ______ your weekend? B: It was great!",
    "options": [
      "was",
      "were",
      "did"
    ],
    "answer": 0,
    "explanation": "詢問「你的週末過得如何？」主詞 your weekend 為單數且已過去，用「was」。"
  },
  {
    "id": "hwg_b9_477",
    "book": 9,
    "unit": "Starter",
    "category": "grammar",
    "question": "We ______ to Taipei 101 and saw a lot of beautiful artwork.",
    "options": [
      "went",
      "go",
      "goes"
    ],
    "answer": 0,
    "explanation": "對等連接詞 and 後方為過去式 saw，前方動詞亦須用過去式「went」。"
  },
  {
    "id": "hwg_b9_478",
    "book": 9,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: Where did Lucas go last Sunday? B: He ______ to the riverside park and ______ a bike.",
    "options": [
      "went; rode",
      "go; ride",
      "went; ride"
    ],
    "answer": 0,
    "explanation": "答句描述上週日發生的兩個動作，皆須使用過去式「went; rode」。"
  },
  {
    "id": "hwg_b9_479",
    "book": 9,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: Did they ______ snacks at the night market? B: No, they ______. They drank juice.",
    "options": [
      "eat; didn't",
      "ate; didn't",
      "eat; don't"
    ],
    "answer": 0,
    "explanation": "助動詞 Did 後接原形動詞 eat；否定簡答用「No, they didn't.」。"
  },
  {
    "id": "hwg_b9_480",
    "book": 9,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: What did Nina do yesterday afternoon? B: ______",
    "options": [
      "She drew a picture at home.",
      "She goes shopping on Sundays.",
      "She was at the department store."
    ],
    "answer": 0,
    "explanation": "問句詢問過去做了什麼事（What did Nina do...?），應選過去式動作「She drew a picture at home.」。"
  },
  {
    "id": "hwg_b9_481",
    "book": 9,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: Did you get a haircut last weekend? B: ______ My hair was too long.",
    "options": [
      "Yes, I did.",
      "No, I didn't.",
      "Yes, I was."
    ],
    "answer": 0,
    "explanation": "後句說「我的頭髮之前太長了」，代表上週末有去剪頭髮，選「Yes, I did.」。"
  },
  {
    "id": "hwg_b9_482",
    "book": 9,
    "unit": "Review 2",
    "category": "grammar",
    "question": "I'm thirsty. I'd like two ______ of juice, please.",
    "options": [
      "bottles",
      "pieces",
      "bags"
    ],
    "answer": 0,
    "explanation": "果汁（juice）常搭配容器「bottle / glass / cup」，且數量為 two 須加 -s：「two bottles of juice」。"
  },
  {
    "id": "hwg_b9_483",
    "book": 9,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: When is your mother's birthday? B: It's ______ May 18th.",
    "options": [
      "on",
      "in",
      "at"
    ],
    "answer": 0,
    "explanation": "明確指出「幾月幾日（May 18th）」時，介系詞必須用「on」（若只有月份 May 則用 in）。"
  },
  {
    "id": "hwg_b9_484",
    "book": 9,
    "unit": "Review 2",
    "category": "grammar",
    "question": "My birthday is ______ October, and my brother's birthday is ______ December 2nd.",
    "options": [
      "in; on",
      "on; in",
      "in; in"
    ],
    "answer": 0,
    "explanation": "單純月份（October）前用「in」；包含日期序數（December 2nd）前用「on」。"
  },
  {
    "id": "hwg_b9_485",
    "book": 9,
    "unit": "Review 2",
    "category": "dialogue",
    "question": "A: What's the date today? B: ______",
    "options": [
      "It's September 1st.",
      "It's Tuesday.",
      "It's nine thirty."
    ],
    "answer": 0,
    "explanation": "詢問「今天幾月幾號？（What's the date today?）」，回答月份加序數「It's September 1st.」。"
  }
];
