/**
 * 課本題庫檢定館全冊百題題庫 (一年級大寫字母、二年級大小寫字母、Here We Go 1 ~ 8 冊 + 國一先修)
 * - 全部 11 冊每冊均超過 100 題（全站共 1289 題），通過 7 道自動化品質閘門驗證
 * - 一、二年級為純字母順序、填空、大小寫配對與轉換題（零單字門檻、中文題幹＋語音讀題）
 * - 三～六年級涵蓋各冊各單元之「文法選擇 (grammar)」與「依題意與情境對話選答 (dialogue)」
 */

export const HERE_WE_GO_BOOK_META = {
  g1: { title: '一年級大寫字母檢定 (A~Z)', shortLabel: '1年級大寫', grade: 1, subtitle: '大寫字母 A~Z 前後順序、空格填空与正確排列（純字母無單字）', units: ['Unit 1 (A~G)', 'Unit 2 (H~N)', 'Unit 3 (O~T)', 'Unit 4 (U~Z)'] },
  g2: { title: '二年級大小寫字母檢定 (Aa~Zz)', shortLabel: '2年級大小寫', grade: 2, subtitle: '大小寫配對、大轉小、小轉大與小寫字母順序填空（純字母無單字）', units: ['Unit 1 (Aa~Gg)', 'Unit 2 (Hh~Nn)', 'Unit 3 (Oo~Tt)', 'Unit 4 (Uu~Zz)'] },
  1: { title: '第 1 冊 (Book 1)', shortLabel: '第 1 冊', grade: 3, subtitle: '打招呼、年齡、文具與顏色', units: ['Starter', 'Unit 1', 'Unit 2', 'Review 1', 'Unit 3', 'Unit 4', 'Review 2', 'Festival'] },
  2: { title: '第 2 冊 (Book 2)', shortLabel: '第 2 冊', grade: 3, subtitle: '寵物大小、能力 Can、家人與職業', units: ['Starter', 'Unit 1', 'Unit 2', 'Review 1', 'Unit 3', 'Unit 4', 'Review 2', 'Festival'] },
  3: { title: '第 3 冊 (Book 3)', shortLabel: '第 3 冊', grade: 4, subtitle: '天氣、飢渴感覺、複數食物與點餐', units: ['Starter', 'Unit 1', 'Unit 2', 'Review 1', 'Unit 3', 'Unit 4', 'Review 2', 'Festival'] },
  4: { title: '第 4 冊 (Book 4)', shortLabel: '第 4 冊', grade: 4, subtitle: '時間、現在進行式、房間與方位介系詞', units: ['Starter', 'Unit 1', 'Unit 2', 'Review 1', 'Unit 3', 'Unit 4', 'Review 2', 'Festival'] },
  5: { title: '第 5 冊 (Book 5)', shortLabel: '第 5 冊', grade: 5, subtitle: '星期、學科課程、城鎮地點與動物數量', units: ['Starter', 'Unit 1', 'Unit 2', 'Review 1', 'Unit 3', 'Unit 4', 'Review 2', 'Festival'] },
  6: { title: '第 6 冊 (Book 6)', shortLabel: '第 6 冊', grade: 5, subtitle: '身體部位疼痛、疾病症狀、三餐與所屬物 Whose', units: ['Starter', 'Unit 1', 'Unit 2', 'Review 1', 'Unit 3', 'Unit 4', 'Review 2', 'Festival'] },
  7: { title: '第 7 冊 (Book 7)', shortLabel: '第 7 冊', grade: 6, subtitle: '國家來源、交通方式、休閒活動與作息時間', units: ['Starter', 'Unit 1', 'Unit 2', 'Review 1', 'Unit 3', 'Unit 4', 'Review 2', 'Festival'] },
  8: { title: '第 8 冊 (Book 8)', shortLabel: '第 8 冊', grade: 6, subtitle: '過去式地點 Was/Were、過去動作、服飾價格與四季', units: ['Starter', 'Unit 1', 'Unit 2', 'Review 1', 'Unit 3', 'Unit 4', 'Review 2', 'Festival'] },
  9: { title: '國一先修 (Book 9)', shortLabel: '國一先修', grade: 6, subtitle: '不規則過去式旅遊活動、食物量詞與生日日期序數', units: ['Starter', 'Unit 1', 'Unit 2', 'Review 1', 'Unit 3', 'Unit 4', 'Review 2'] }
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
      "you",
      "I'm",
      "my"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「my」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_4",
    "book": 1,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Hi, ______ Lucas.",
    "options": [
      "you",
      "I'm",
      "my"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「I'm」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_5",
    "book": 1,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "My name ______ Emma.",
    "options": [
      "you",
      "is",
      "am"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「is」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_6",
    "book": 1,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: What's your name? B: ______",
    "options": [
      "I'm fine.",
      "How are you?",
      "My name is Max."
    ],
    "answer": 2,
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
      "How are you?",
      "Hello, I'm Kulas.",
      "What's your name?"
    ],
    "answer": 0,
    "explanation": "「How are you?」為問候語「你好嗎？」，常以「I’m fine / great / good.」回應。"
  },
  {
    "id": "hwg_b1_10",
    "book": 1,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "______ old are you?",
    "options": [
      "How",
      "What",
      "What's"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「How」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_11",
    "book": 1,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "______ nine years old.",
    "options": [
      "I",
      "I'm",
      "You"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「I'm」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_12",
    "book": 1,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: How old are you? B: ______ six.",
    "options": [
      "I",
      "I'm",
      "My"
    ],
    "answer": 1,
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
      "I'm fine.",
      "I'm Kulas.",
      "I'm ten."
    ],
    "answer": 2,
    "explanation": "詢問年齡使用疑問詞「How old are you / is he / is she?」，回答用「主詞 + Be動詞 + 數字 (years old).」。"
  },
  {
    "id": "hwg_b1_16",
    "book": 1,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: How old are you? B: ______",
    "options": [
      "I'm six years old.",
      "You're welcome.",
      "My name is Nina."
    ],
    "answer": 0,
    "explanation": "詢問年齡使用疑問詞「How old are you / is he / is she?」，回答用「主詞 + Be動詞 + 數字 (years old).」。"
  },
  {
    "id": "hwg_b1_17",
    "book": 1,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______ B: I'm eight.",
    "options": [
      "What's your name?",
      "How are you?",
      "How old are you?"
    ],
    "answer": 2,
    "explanation": "詢問年齡使用疑問詞「How old are you / is he / is she?」，回答用「主詞 + Be動詞 + 數字 (years old).」。"
  },
  {
    "id": "hwg_b1_18",
    "book": 1,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______ B: You're welcome.",
    "options": [
      "Thank you.",
      "How old are you?",
      "How are you?"
    ],
    "answer": 0,
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
    "question": "A: Hello, my name is Emma. B: ______",
    "options": [
      "I'm fine.",
      "Thank you.",
      "Hi, I'm Nina."
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Hi, I'm Nina.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_21",
    "book": 1,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: Hi, Ryan. How old are you? B: ______",
    "options": [
      "Hi, my name is Max.",
      "Hello, Ryan. I'm four.",
      "I'm five years old."
    ],
    "answer": 2,
    "explanation": "詢問年齡使用疑問詞「How old are you / is he / is she?」，回答用「主詞 + Be動詞 + 數字 (years old).」。"
  },
  {
    "id": "hwg_b1_22",
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
    "id": "hwg_b1_23",
    "book": 1,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What's that? B: It's ______ ruler.",
    "options": [
      "am",
      "an",
      "a"
    ],
    "answer": 2,
    "explanation": "單數可數名詞字首發音為母音（a, e, i, o, u）時搭配冠詞「an」，子音則搭配「a」。"
  },
  {
    "id": "hwg_b1_24",
    "book": 1,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What's this? B: It's ______ eraser.",
    "options": [
      "a",
      "am",
      "an"
    ],
    "answer": 2,
    "explanation": "單數可數名詞字首發音為母音（a, e, i, o, u）時搭配冠詞「an」，子音則搭配「a」。"
  },
  {
    "id": "hwg_b1_25",
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
    "id": "hwg_b1_26",
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
    "id": "hwg_b1_27",
    "book": 1,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "______ is an eraser.",
    "options": [
      "I'm",
      "It",
      "It's"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「It」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_28",
    "book": 1,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What's this? B: ______",
    "options": [
      "I'm fine.",
      "It's a book.",
      "I'm ten."
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「It's a book.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_29",
    "book": 1,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What's that? B: ______",
    "options": [
      "It's cool!",
      "It's an eraser.",
      "I'm Max."
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「It's an eraser.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_30",
    "book": 1,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: ______ B: It's a pencil.",
    "options": [
      "How old are you?",
      "What's this?",
      "What's your name?"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「What's this?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_31",
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
    "id": "hwg_b1_32",
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
    "id": "hwg_b1_33",
    "book": 1,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What color is ______? B: It's white.",
    "options": [
      "old",
      "this",
      "it"
    ],
    "answer": 2,
    "explanation": "詢問顏色使用「What color is it?」，回答使用「It’s + 顏色.」。"
  },
  {
    "id": "hwg_b1_34",
    "book": 1,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What ______ is it? B: It's black.",
    "options": [
      "name",
      "that",
      "color"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「color」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_35",
    "book": 1,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What color is it? B: It's ______.",
    "options": [
      "fine",
      "a book",
      "blue"
    ],
    "answer": 2,
    "explanation": "詢問顏色使用「What color is it?」，回答使用「It’s + 顏色.」。"
  },
  {
    "id": "hwg_b1_36",
    "book": 1,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: ______ color is it? B: It's yellow.",
    "options": [
      "What's",
      "What",
      "How"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「What」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_37",
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
    "id": "hwg_b1_38",
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
    "id": "hwg_b1_39",
    "book": 1,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: What's this? B: ______",
    "options": [
      "It's red.",
      "It's a pen.",
      "It's yellow."
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「It's a pen.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_40",
    "book": 1,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Good morning. B: ______",
    "options": [
      "Good afternoon.",
      "Good job!",
      "Good morning."
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Good morning.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_41",
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
    "id": "hwg_b1_42",
    "book": 1,
    "unit": "Review 2",
    "category": "dialogue",
    "question": "A: What color is it? B: ______",
    "options": [
      "It's green.",
      "It's an eraser.",
      "It's a pencil."
    ],
    "answer": 0,
    "explanation": "詢問顏色使用「What color is it?」，回答使用「It’s + 顏色.」。"
  },
  {
    "id": "hwg_b1_43",
    "book": 1,
    "unit": "Review 2",
    "category": "dialogue",
    "question": "A: ______ B: It's a book.",
    "options": [
      "What's that?",
      "What color is it?",
      "What's your name?"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「What's that?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b1_44",
    "book": 1,
    "unit": "Review 2",
    "category": "dialogue",
    "question": "A: ______ B: It's black.",
    "options": [
      "What color is it?",
      "What's this?",
      "What's your name?"
    ],
    "answer": 0,
    "explanation": "詢問顏色使用「What color is it?」，回答使用「It’s + 顏色.」。"
  },
  {
    "id": "hwg_b3_45",
    "book": 3,
    "unit": "Starter",
    "category": "grammar",
    "question": "I ______ a student.",
    "options": [
      "am",
      "are",
      "is"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「am」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_46",
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
    "id": "hwg_b3_47",
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
    "id": "hwg_b3_48",
    "book": 3,
    "unit": "Starter",
    "category": "grammar",
    "question": "A: ______ your sister a nurse? B: Yes, she is.",
    "options": [
      "Am",
      "Are",
      "Is",
      "Who"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Is」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_49",
    "book": 3,
    "unit": "Starter",
    "category": "grammar",
    "question": "A: Is Chloe's father a doctor? B: No, ______ isn't.",
    "options": [
      "I",
      "she",
      "he",
      "you"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「he」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_50",
    "book": 3,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: What's this? B: ______",
    "options": [
      "It's a board game.",
      "She's a student.",
      "He's a driver.",
      "I'm a teacher."
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「It's a board game.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_51",
    "book": 3,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: Who's she? B: ______",
    "options": [
      "My mother is tall.",
      "She's a doctor.",
      "She's my mother.",
      "She's not a nurse."
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「She's my mother.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_52",
    "book": 3,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: Is your grandfather a cook? B: ______",
    "options": [
      "No, you're not.",
      "Yes, I am.",
      "No, she's not.",
      "Yes, he is."
    ],
    "answer": 3,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b3_53",
    "book": 3,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: ______ B: No, she's not. She's a driver.",
    "options": [
      "Is your brother a cook?",
      "Is Iris a driver?",
      "Is your sister a nurse?",
      "Is your father a teacher?"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Is your sister a nurse?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_54",
    "book": 3,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: ______ B: No, I'm not. I'm a student.",
    "options": [
      "Is your mother tall?",
      "Is Zoe a nurse?",
      "Are you a student?",
      "Are you a nurse?"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「Are you a nurse?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_55",
    "book": 3,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "It ______ windy.",
    "options": [
      "is",
      "✕ (不需填詞)",
      "am",
      "can"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「is」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_56",
    "book": 3,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "______ cool and rainy.",
    "options": [
      "It",
      "It's",
      "I",
      "I'm"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「It's」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_57",
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
    "id": "hwg_b3_58",
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
    "id": "hwg_b3_59",
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
    "id": "hwg_b3_60",
    "book": 3,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "It's sunny ______ warm.",
    "options": [
      "✕ (不需填詞)",
      "at",
      "and",
      "am"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「and」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_61",
    "book": 3,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: How's the weather? B: ______",
    "options": [
      "It's a cat.",
      "It's cold.",
      "I'm a cook.",
      "It's big."
    ],
    "answer": 1,
    "explanation": "詢問天氣使用「How’s the weather?」，回答使用「It’s + 天氣形容詞 (sunny / rainy / windy / cloudy / hot / cold).」。"
  },
  {
    "id": "hwg_b3_62",
    "book": 3,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: How's the weather in Osaka? B: ______",
    "options": [
      "I have an idea.",
      "It's big and tall.",
      "Let's go to Osaka.",
      "It's sunny and windy."
    ],
    "answer": 3,
    "explanation": "詢問天氣使用「How’s the weather?」，回答使用「It’s + 天氣形容詞 (sunny / rainy / windy / cloudy / hot / cold).」。"
  },
  {
    "id": "hwg_b3_63",
    "book": 3,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Look at this kimono. B: ______",
    "options": [
      "I'm a teacher.",
      "It's a dog.",
      "It's cloudy.",
      "It's pretty."
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「It's pretty.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_64",
    "book": 3,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: ______ B: Yeah! Let's go there.",
    "options": [
      "Look at this kimono.",
      "Let's have some fun.",
      "How's the weather?",
      "It's sunny in Kyoto."
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「It's sunny in Kyoto.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_65",
    "book": 3,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: ______ B: It's rainy and windy here.",
    "options": [
      "How's the weather?",
      "How old are you?",
      "Is he a teacher?",
      "How are you?"
    ],
    "answer": 0,
    "explanation": "詢問天氣使用「How’s the weather?」，回答使用「It’s + 天氣形容詞 (sunny / rainy / windy / cloudy / hot / cold).」。"
  },
  {
    "id": "hwg_b3_66",
    "book": 3,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: ______ B: Great! It's sunny there.",
    "options": [
      "I have an idea. Let's go to Osaka.",
      "It's rainy and cold in Osaka.",
      "Let's have some fun in the rain.",
      "Look at the pretty teacher."
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「I have an idea. Let's go to Osaka.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_67",
    "book": 3,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "______ am happy.",
    "options": [
      "It's",
      "I",
      "I'm",
      "He's"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「I」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_68",
    "book": 3,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "He ______ not angry.",
    "options": [
      "isn't",
      "is",
      "are",
      "am"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「is」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_69",
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
    "id": "hwg_b3_70",
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
    "id": "hwg_b3_71",
    "book": 3,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Chloe, are you full? B: No, I'm ______.",
    "options": [
      "isn't",
      "is",
      "not"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「not」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_72",
    "book": 3,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Is he thirsty? B: No, ______ not.",
    "options": [
      "she's",
      "she",
      "he's",
      "he"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「he's」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_73",
    "book": 3,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Are you angry? B: ______",
    "options": [
      "Yes, he is.",
      "Yes, I am.",
      "Yes, it is.",
      "Yes, she is."
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「Yes, I am.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_74",
    "book": 3,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Rex, are you full? B: ______",
    "options": [
      "Yes, I can.",
      "Yes, he is.",
      "No, I'm not. I'm full.",
      "No, I'm not. I'm hungry."
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「No, I'm not. I'm hungry.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_75",
    "book": 3,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Is he happy? B: ______",
    "options": [
      "No, he is happy.",
      "No, he is not hungry.",
      "Yes, she is happy.",
      "Yes, he is happy."
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「Yes, he is happy.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_76",
    "book": 3,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______ B: Yes, she is very tired.",
    "options": [
      "Is she very full?",
      "Is Lucas thirsty?",
      "Are you tired?",
      "Is Emma tired?"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「Is Emma tired?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_77",
    "book": 3,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______ B: Yes, I'm fine.",
    "options": [
      "Are you OK?",
      "Are you Nina?",
      "Are you full?",
      "Are you sad?"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「Are you OK?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_78",
    "book": 3,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______ B: Yes, he is. He's thirsty, too.",
    "options": [
      "Is your father hungry?",
      "Is your mother thirsty?",
      "Is Nina hungry?",
      "Is your brother thirsty?"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「Is your father hungry?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_79",
    "book": 3,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: How's the weather? B: It's ______. You need an umbrella.",
    "options": [
      "rainy",
      "windy",
      "cold",
      "warm"
    ],
    "answer": 0,
    "explanation": "詢問天氣使用「How’s the weather?」，回答使用「It’s + 天氣形容詞 (sunny / rainy / windy / cloudy / hot / cold).」。"
  },
  {
    "id": "hwg_b3_80",
    "book": 3,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: Is ______ tired? B: No, she's not. She's sad.",
    "options": [
      "Sam",
      "your father",
      "Ava",
      "your brother"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Ava」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_81",
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
    "id": "hwg_b3_82",
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
    "id": "hwg_b3_83",
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
    "id": "hwg_b3_84",
    "book": 3,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "______ you like oranges?",
    "options": [
      "Are",
      "Do",
      "Is",
      "What"
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b3_85",
    "book": 3,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "I ______ big watermelons.",
    "options": [
      "are",
      "like",
      "my",
      "am"
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b3_86",
    "book": 3,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What ______ these? B: They're sandwiches.",
    "options": [
      "is",
      "are",
      "do",
      "like"
    ],
    "answer": 1,
    "explanation": "詢問複數物品使用「What are these / those?」，回答一律用複數代名詞「They are (They’re) + 複數名詞.」。"
  },
  {
    "id": "hwg_b3_87",
    "book": 3,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Bonny, do you like apples? B: No, I ______.",
    "options": [
      "am",
      "do",
      "don't",
      "not"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「don't」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_88",
    "book": 3,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Toby, Look! What are those? B: ______ are hamburgers.",
    "options": [
      "You",
      "He",
      "They",
      "I"
    ],
    "answer": 2,
    "explanation": "詢問複數物品使用「What are these / those?」，回答一律用複數代名詞「They are (They’re) + 複數名詞.」。"
  },
  {
    "id": "hwg_b3_89",
    "book": 3,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Do you like bananas? B: ______",
    "options": [
      "No, I'm not.",
      "No, I don't.",
      "Yes, I can.",
      "Yes, I am."
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「No, I don't.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_90",
    "book": 3,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What are these? B: ______",
    "options": [
      "I like sandwiches.",
      "They're not sandwiches.",
      "Yes, I like sandwiches.",
      "They're sandwiches."
    ],
    "answer": 3,
    "explanation": "詢問複數物品使用「What are these / those?」，回答一律用複數代名詞「They are (They’re) + 複數名詞.」。"
  },
  {
    "id": "hwg_b3_91",
    "book": 3,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: I like apples. How about you? B: ______",
    "options": [
      "I don't like hot dogs.",
      "They're apples.",
      "Yes, I like bananas.",
      "I like apples, too."
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「I like apples, too.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_92",
    "book": 3,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: ______ B: Yes, I do.",
    "options": [
      "How's the weather?",
      "What are these?",
      "Do you like hamburgers?",
      "Are you tired?"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Do you like hamburgers?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_93",
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
    "id": "hwg_b3_94",
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
    "id": "hwg_b3_95",
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
    "id": "hwg_b3_96",
    "book": 3,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "I ______ some ice cream.",
    "options": [
      "do",
      "want",
      "am",
      "are"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「want」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_97",
    "book": 3,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "I ______ want some milk.",
    "options": [
      "not",
      "don't",
      "am",
      "isn't"
    ],
    "answer": 1,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_98",
    "book": 3,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Do you want some rice? B: No, ______ don't.",
    "options": [
      "you",
      "we",
      "she",
      "he"
    ],
    "answer": 1,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_99",
    "book": 3,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: I want some pizza. B: ______ one? A: That one.",
    "options": [
      "How",
      "Who",
      "Which",
      "What"
    ],
    "answer": 2,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_100",
    "book": 3,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Do ______ want some juice? B: Yes, we do.",
    "options": [
      "we",
      "I",
      "you",
      "he"
    ],
    "answer": 2,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_101",
    "book": 3,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Do you want some milk? B: ______",
    "options": [
      "No, I'm not.",
      "No, I don't.",
      "I want some milk.",
      "Yes, I am."
    ],
    "answer": 1,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_102",
    "book": 3,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: I'm very hungry. B: ______ A: Yes, I do.",
    "options": [
      "What are these?",
      "Which one?",
      "I want some pizza.",
      "Do you want some rice?"
    ],
    "answer": 3,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_103",
    "book": 3,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Tracy, do you want some water? B: ______",
    "options": [
      "No, we don't. We want some water.",
      "Yes, we do. We're thirsty.",
      "No, I don't. I want some water.",
      "Yes, I do. I'm thirsty."
    ],
    "answer": 3,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_104",
    "book": 3,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: ______ B: Yes, we do. We're hungry.",
    "options": [
      "Fred, do you want some pizza?",
      "Zoe, do you want some water?",
      "Do you want some rice?",
      "What are those?"
    ],
    "answer": 2,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_105",
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
    "id": "hwg_b3_106",
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
    "id": "hwg_b3_107",
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
    "id": "hwg_b3_108",
    "book": 3,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: I'm thirsty. B: There's a tea shop. Do you want some ______? A: No, I don't. I want some orange juice.",
    "options": [
      "orange juice",
      "hamburgers",
      "banana milk",
      "hot dogs"
    ],
    "answer": 2,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_109",
    "book": 3,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: I want some ______. I'm hungry. B: Me, too!",
    "options": [
      "hamburgers",
      "water",
      "juice",
      "milk"
    ],
    "answer": 0,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_110",
    "book": 3,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: Do you want some ______? B: Yes, I do. I'm very thirsty.",
    "options": [
      "rice",
      "sandwiches",
      "cake",
      "water"
    ],
    "answer": 3,
    "explanation": "詢問對方是否想要某食物用「Do you want some ...?」，肯定簡答「Yes, I/we do.」，否定「No, I/we don’t.」。"
  },
  {
    "id": "hwg_b3_111",
    "book": 3,
    "unit": "Festival",
    "category": "grammar",
    "question": "Look, ______ Earth!",
    "options": [
      "I'm",
      "it's",
      "it",
      "is"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「it's」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_112",
    "book": 3,
    "unit": "Festival",
    "category": "grammar",
    "question": "I want to go to ______ Moon!",
    "options": [
      "✕ (不需填詞)",
      "the",
      "a",
      "an"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「the」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_113",
    "book": 3,
    "unit": "Festival",
    "category": "grammar",
    "question": "Welcome, ______ Chang-O.",
    "options": [
      "she",
      "I'm",
      "I",
      "this"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「I'm」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_114",
    "book": 3,
    "unit": "Festival",
    "category": "grammar",
    "question": "______ eat moon cakes.",
    "options": [
      "I'm",
      "Let's",
      "Let",
      "It"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「Let's」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_115",
    "book": 3,
    "unit": "Festival",
    "category": "dialogue",
    "question": "A: What's this? B: ______",
    "options": [
      "Look, it's big.",
      "Let's eat pomelos.",
      "I'm Chang-O.",
      "It's a pomelo."
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「It's a pomelo.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b3_116",
    "book": 3,
    "unit": "Festival",
    "category": "dialogue",
    "question": "A: What's your name? B: ______",
    "options": [
      "Chang-O is thirsty.",
      "My name is Jade Rabbit.",
      "Look, it's Earth.",
      "I want to go to the Moon."
    ],
    "answer": 1,
    "explanation": "詢問對方姓名使用「What’s your name?」，回答用「My name is ...」或「I’m ...」。"
  },
  {
    "id": "hwg_b3_117",
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
    "id": "hwg_b3_118",
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
    "id": "hwg_b5_119",
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
    "id": "hwg_b5_120",
    "book": 5,
    "unit": "Starter",
    "category": "grammar",
    "question": "He ______ sleeping.",
    "options": [
      "am",
      "is",
      "are",
      "✕ (不需填詞)"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「is」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_121",
    "book": 5,
    "unit": "Starter",
    "category": "grammar",
    "question": "My sister is ______.",
    "options": [
      "drink",
      "eating",
      "read",
      "eat"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「eating」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_122",
    "book": 5,
    "unit": "Starter",
    "category": "grammar",
    "question": "She's writing ______ the bedroom.",
    "options": [
      "at",
      "✕ (不需填詞)",
      "on",
      "in"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「in」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_123",
    "book": 5,
    "unit": "Starter",
    "category": "grammar",
    "question": "The dog is ______ running in the yard.",
    "options": [
      "✕ (不需填詞)",
      "on",
      "at",
      "are"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「✕ (不需填詞)」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_124",
    "book": 5,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: Where's Lily? B: ______",
    "options": [
      "She's sad and tired.",
      "She's sixty years old.",
      "She's sleeping.",
      "She's in the dining room."
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「She's in the dining room.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_125",
    "book": 5,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: Where's your brother? B: ______",
    "options": [
      "He's swimming.",
      "He's in the kitchen.",
      "He's not my brother.",
      "He's one hundred."
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「He's in the kitchen.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_126",
    "book": 5,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: How old is your grandfather? B: ______",
    "options": [
      "He's in the yard.",
      "He's happy.",
      "He's drinking.",
      "He's eighty-nine."
    ],
    "answer": 3,
    "explanation": "詢問年齡使用疑問詞「How old are you / is he / is she?」，回答用「主詞 + Be動詞 + 數字 (years old).」。"
  },
  {
    "id": "hwg_b5_127",
    "book": 5,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: ______ B: I'm in the bedroom.",
    "options": [
      "What is she doing?",
      "Where are you?",
      "Who are you?",
      "How old are you?"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「Where are you?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_128",
    "book": 5,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: ______ B: It's eight forty.",
    "options": [
      "What's she doing?",
      "Where's your sister?",
      "How old is his father?",
      "What time is it?"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「What time is it?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_129",
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
    "id": "hwg_b5_130",
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
    "id": "hwg_b5_131",
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
    "id": "hwg_b5_132",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "______ it Thursday today?",
    "options": [
      "It",
      "Are",
      "Am",
      "Is"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「Is」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_133",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "______ is Saturday. Let's go out!",
    "options": [
      "It's",
      "It",
      "Is",
      "I"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「It」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_134",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "It's Wednesday. It's ______ Tuesday.",
    "options": [
      "is",
      "are",
      "isn't",
      "not"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「not」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_135",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: It's ______. We don't go to school. Let's go out! B: Good idea!",
    "options": [
      "Saturday",
      "Tuesday",
      "Friday",
      "Monday"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「Saturday」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_136",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: It's ______. It's Mother's Day. B: Happy Mother's Day!",
    "options": [
      "Sunday",
      "Tuesday",
      "Monday",
      "Saturday"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「Sunday」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_137",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: What ______ is it? B: It's Monday. I'm blue.",
    "options": [
      "color",
      "day",
      "✕ (不需填詞)",
      "time"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「day」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_138",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Is it ______ today? B: Yes. I like Thursday.",
    "options": [
      "Sunday",
      "Wednesday",
      "Tuesday",
      "Thursday"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「Thursday」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_139",
    "book": 5,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: What day is today? B: ______",
    "options": [
      "It's Monday.",
      "Yes. It's Monday.",
      "It's sunny.",
      "It's not Monday."
    ],
    "answer": 0,
    "explanation": "詢問今天星期幾使用「What day is today?」，回答「It’s + 星期名稱 (Monday ~ Sunday).」。"
  },
  {
    "id": "hwg_b5_140",
    "book": 5,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Is it Wednesday today? B: ______",
    "options": [
      "It's Wednesday.",
      "It's not Wednesday.",
      "Yes, it is.",
      "No. It's Wednesday."
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Yes, it is.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_141",
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
    "id": "hwg_b5_142",
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
    "id": "hwg_b5_143",
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
    "id": "hwg_b5_144",
    "book": 5,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: ______ B: No, it isn't. It's Saturday.",
    "options": [
      "What day is today?",
      "It is Saturday.",
      "Is it Sunday today?",
      "What time is it?"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Is it Sunday today?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_145",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "I have art class ______ Thursday.",
    "options": [
      "in",
      "at",
      "✕ (不需填詞)",
      "on"
    ],
    "answer": 3,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b5_146",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "We ______ have music class today.",
    "options": [
      "doesn't",
      "don't",
      "not",
      "do"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「don't」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_147",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "She ______ have science class on Sunday.",
    "options": [
      "does",
      "don't",
      "doesn't",
      "not"
    ],
    "answer": 2,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b5_148",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "______ you have PE class on Monday?",
    "options": [
      "Does",
      "Are",
      "Do",
      "Is"
    ],
    "answer": 2,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b5_149",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "______ he have social studies class on Tuesday?",
    "options": [
      "Do",
      "Does",
      "Am",
      "Is"
    ],
    "answer": 1,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b5_150",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Does she ______ Chinese class on Saturday?",
    "options": [
      "is",
      "have",
      "not",
      "doesn't"
    ],
    "answer": 1,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b5_151",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "I like drawing. I have ______ class on Friday.",
    "options": [
      "art",
      "Chinese",
      "PE",
      "social studies"
    ],
    "answer": 0,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b5_152",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Does she have ______ class on Monday? B: Yes. She reads English books that day.",
    "options": [
      "English",
      "Chinese",
      "science",
      "music"
    ],
    "answer": 0,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b5_153",
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
    "id": "hwg_b5_154",
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
    "id": "hwg_b5_155",
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
    "id": "hwg_b5_156",
    "book": 5,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Does she have Chinese class on Monday? B: ______",
    "options": [
      "Yes, I do.",
      "Yes, he does.",
      "No, she doesn't.",
      "No, they don't."
    ],
    "answer": 2,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b5_157",
    "book": 5,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: I like ice cream. Can I try it? B: ______",
    "options": [
      "Sure!",
      "Follow me.",
      "Good idea!",
      "Have a good time."
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「Sure!」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_158",
    "book": 5,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Where's the bathroom? B: ______",
    "options": [
      "Sure!",
      "Good idea!",
      "Follow me.",
      "Me, too."
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Follow me.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_159",
    "book": 5,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______ B: Yes. I have science class today.",
    "options": [
      "Do you have science class today?",
      "Do they have science class today?",
      "Does she have social studies class today?",
      "Do you have social studies class today?"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「Do you have science class today?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_160",
    "book": 5,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______ B: No, she doesn't.",
    "options": [
      "Do you have English class on Monday?",
      "Does he have English class on Friday?",
      "Does she have English class on Sunday?",
      "Does he have Chinese class on Saturday?"
    ],
    "answer": 2,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b5_161",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "Where ______ you going?",
    "options": [
      "am",
      "are",
      "✕ (不需填詞)",
      "is"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「are」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_162",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "______ are you going?",
    "options": [
      "Does",
      "Where",
      "Do",
      "What"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「Where」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_163",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "Where ______ the post office?",
    "options": [
      "✕ (不需填詞)",
      "is",
      "am",
      "are"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「is」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_164",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "I'm ______ to the supermarket.",
    "options": [
      "go",
      "going",
      "do",
      "doing"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「going」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_165",
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
    "id": "hwg_b5_166",
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
    "id": "hwg_b5_167",
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
    "id": "hwg_b5_168",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: I'm going to the ______. B: Me, too. I like to read books.",
    "options": [
      "library",
      "museum",
      "hospital",
      "bank"
    ],
    "answer": 0,
    "explanation": "詢問正要前往何處使用「Where are you going?」，回答「I’m / We’re going to the + 地點.」。"
  },
  {
    "id": "hwg_b5_169",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Dad, I need a marker. B: Let's go to the ______. It's on Black Street.",
    "options": [
      "bookstore",
      "post office",
      "museum",
      "library"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「bookstore」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_170",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: I'm going to the ______ to see the doctor. B: Take care.",
    "options": [
      "hospital",
      "park",
      "supermarket",
      "bank"
    ],
    "answer": 0,
    "explanation": "詢問正要前往何處使用「Where are you going?」，回答「I’m / We’re going to the + 地點.」。"
  },
  {
    "id": "hwg_b5_171",
    "book": 5,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Where are you going? B: ______",
    "options": [
      "I'm going to the bookstore.",
      "They're going to the park.",
      "Let's go to the post office.",
      "The bank is on Apple Street."
    ],
    "answer": 0,
    "explanation": "詢問正要前往何處使用「Where are you going?」，回答「I’m / We’re going to the + 地點.」。"
  },
  {
    "id": "hwg_b5_172",
    "book": 5,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Where's the hospital? B: ______",
    "options": [
      "We're going to the bank.",
      "It's on Doctor Street.",
      "I'm going to the hospital.",
      "Excuse me. I'm lost."
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「It's on Doctor Street.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_173",
    "book": 5,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: ______ Where's the bank? B: It's on Blue Street.",
    "options": [
      "Follow me.",
      "Excuse me.",
      "Me, too.",
      "Say cheese!"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「Excuse me.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_174",
    "book": 5,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: This museum is beautiful! B: Yes. Let's take a picture. ______",
    "options": [
      "Say cheese!",
      "Good idea!",
      "Excuse me.",
      "Sorry, I'm late."
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「Say cheese!」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_175",
    "book": 5,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: ______ B: We're going to the museum.",
    "options": [
      "The museum is on Green Street.",
      "Where are you going?",
      "Where is he going?",
      "Where's the museum?"
    ],
    "answer": 1,
    "explanation": "詢問正要前往何處使用「Where are you going?」，回答「I’m / We’re going to the + 地點.」。"
  },
  {
    "id": "hwg_b5_176",
    "book": 5,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: ______ B: It's on Sunny Road.",
    "options": [
      "We're going to the bank.",
      "Where's your brother?",
      "Where are you going?",
      "Where's the post office?"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「Where's the post office?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_177",
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
    "id": "hwg_b5_178",
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
    "id": "hwg_b5_179",
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
    "id": "hwg_b5_180",
    "book": 5,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "There ______ sixty koalas.",
    "options": [
      "doesn't",
      "is",
      "does",
      "are"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「are」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_181",
    "book": 5,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "______ he like monkeys?",
    "options": [
      "Is",
      "Does",
      "Do",
      "How"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「Does」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_182",
    "book": 5,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Does she ______ elephants?",
    "options": [
      "likes",
      "like",
      "is",
      "are"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「like」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_183",
    "book": 5,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: How many ______ are there? B: There are two elephants. They're big and tall.",
    "options": [
      "monkeys",
      "turtles",
      "elephants",
      "koalas"
    ],
    "answer": 2,
    "explanation": "詢問可數名詞的數量使用「How many + 複數名詞 + are there?」，單數回答「There is one ...」，複數回答「There are ...」。"
  },
  {
    "id": "hwg_b5_184",
    "book": 5,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Does she like ______? B: Yes, she does. She likes zebras.",
    "options": [
      "tigers",
      "lions",
      "zebras",
      "horses"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「zebras」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_185",
    "book": 5,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: There is a hungry ______ coming. Run! B: Calm down. It's just a robot cat.",
    "options": [
      "elephant",
      "horse",
      "tiger",
      "turtle"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「tiger」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_186",
    "book": 5,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: There are two ______ jumping in the tree. B: They like your bananas.",
    "options": [
      "lions",
      "zebras",
      "monkeys",
      "koalas"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「monkeys」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_187",
    "book": 5,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: I feel sick. I'm going to the hospital. B: ______",
    "options": [
      "Take care!",
      "Excuse me.",
      "Calm down.",
      "Follow me."
    ],
    "answer": 0,
    "explanation": "詢問正要前往何處使用「Where are you going?」，回答「I’m / We’re going to the + 地點.」。"
  },
  {
    "id": "hwg_b5_188",
    "book": 5,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Dogs! Run! B: ______ They're small dogs.",
    "options": [
      "Say cheese!",
      "Take care!",
      "Calm down.",
      "Have a good time."
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Calm down.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_189",
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
    "id": "hwg_b5_190",
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
    "id": "hwg_b5_191",
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
    "id": "hwg_b5_192",
    "book": 5,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: ______ B: No, he doesn't. He likes koalas.",
    "options": [
      "How many koalas are there?",
      "Does she like zebras?",
      "Does he like monkeys?",
      "Does he like koalas?"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Does he like monkeys?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_193",
    "book": 5,
    "unit": "Festival",
    "category": "grammar",
    "question": "How many stars ______ there?",
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
    "id": "hwg_b5_194",
    "book": 5,
    "unit": "Festival",
    "category": "grammar",
    "question": "______ open the gifts.",
    "options": [
      "Is",
      "Does",
      "Let",
      "Let's"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「Let's」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_195",
    "book": 5,
    "unit": "Festival",
    "category": "grammar",
    "question": "The Christmas tree is ______.",
    "options": [
      "✕ (不需填詞)",
      "bell",
      "star",
      "big"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「big」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b5_196",
    "book": 5,
    "unit": "Festival",
    "category": "grammar",
    "question": "There ______ one candy cane.",
    "options": [
      "on",
      "am",
      "are",
      "is"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「is」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_197",
    "book": 7,
    "unit": "Starter",
    "category": "grammar",
    "question": "______ you like some salad for lunch?",
    "options": [
      "Whose",
      "Who",
      "Would",
      "What"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Would」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_198",
    "book": 7,
    "unit": "Starter",
    "category": "grammar",
    "question": "______ water bottle is this on the desk?",
    "options": [
      "Would",
      "Who",
      "How",
      "Whose"
    ],
    "answer": 3,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b7_199",
    "book": 7,
    "unit": "Starter",
    "category": "grammar",
    "question": "______ like some beef noodles for dinner.",
    "options": [
      "I'd",
      "It's",
      "You're",
      "I'm"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「I'd」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_200",
    "book": 7,
    "unit": "Starter",
    "category": "grammar",
    "question": "Whose workbooks ______ these?",
    "options": [
      "are",
      "is",
      "am",
      "can"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「are」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_201",
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
    "id": "hwg_b7_202",
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
    "id": "hwg_b7_203",
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
    "id": "hwg_b7_204",
    "book": 7,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: What's Luca's room number? B: ______",
    "options": [
      "Her room number is 305.",
      "My room number is 418.",
      "Her room is big.",
      "Her phone number is 0912-358-901."
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「Her room number is 305.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_205",
    "book": 7,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: What would you like for dinner? B: ______",
    "options": [
      "I'd like some chicken.",
      "Yes, please.",
      "No, thank you.",
      "I don't like noodles."
    ],
    "answer": 0,
    "explanation": "表達禮貌點餐或想要某食物用「Would you like ...? / I’d like ...」，不可數與計量食物常搭配單位詞「a cup/bottle/bowl/piece/glass of ...」。"
  },
  {
    "id": "hwg_b7_206",
    "book": 7,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: ______ B: It's Alex's water bottle.",
    "options": [
      "Whose backpack is this?",
      "Whose water bottle is that?",
      "Whose glasses are these?",
      "Whose water bottles are those?"
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b7_207",
    "book": 7,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "______ are the boys from?",
    "options": [
      "Where",
      "What",
      "Who",
      "Whose"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「Where」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_208",
    "book": 7,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Ivy, where ______ you from?",
    "options": [
      "is",
      "are",
      "am",
      "do"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「are」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_209",
    "book": 7,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Is ______ from Taiwan?",
    "options": [
      "they",
      "she",
      "the boys",
      "you"
    ],
    "answer": 1,
    "explanation": "詢問來自哪個國家使用「Where are you / is he / is she from?」，英國與美國需加定冠詞「the UK / the USA」。"
  },
  {
    "id": "hwg_b7_210",
    "book": 7,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "______ they from Spain?",
    "options": [
      "Do",
      "Does",
      "Are",
      "Is"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Are」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_211",
    "book": 7,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Where is Uma from? B: She's from ______. She likes cheeseburgers very much.",
    "options": [
      "the USA",
      "the museum",
      "the bank",
      "the park"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「the USA」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_212",
    "book": 7,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Where are you from? B: I'm from ______. Taipei 101 is famous in my country.",
    "options": [
      "Spain",
      "Taiwan",
      "India",
      "Singapore"
    ],
    "answer": 1,
    "explanation": "詢問來自哪個國家使用「Where are you / is he / is she from?」，英國與美國需加定冠詞「the UK / the USA」。"
  },
  {
    "id": "hwg_b7_213",
    "book": 7,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Is Jason from ______? B: Yes, he is. There are many kangaroos in his country.",
    "options": [
      "the USA",
      "Japan",
      "Australia"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Australia」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_214",
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
    "id": "hwg_b7_215",
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
    "id": "hwg_b7_216",
    "book": 7,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Where is your grandpa from? B: ______",
    "options": [
      "Yes, he is.",
      "No, he isn't.",
      "He's from Spain.",
      "He's in the UK."
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b7_217",
    "book": 7,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: ______ B: They're from India.",
    "options": [
      "Where are Nick and Logan from?",
      "Where is Sophie from?",
      "Is Dylan from India?",
      "Are they from India?"
    ],
    "answer": 0,
    "explanation": "詢問來自哪個國家使用「Where are you / is he / is she from?」，英國與美國需加定冠詞「the UK / the USA」。"
  },
  {
    "id": "hwg_b7_218",
    "book": 7,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: ______ B: No, she isn't. She's from the UK.",
    "options": [
      "Is your sister from Japan?",
      "Is your father from Japan?",
      "Where's your mother from?",
      "Is your mother from the UK?"
    ],
    "answer": 0,
    "explanation": "詢問來自哪個國家使用「Where are you / is he / is she from?」，英國與美國需加定冠詞「the UK / the USA」。"
  },
  {
    "id": "hwg_b7_219",
    "book": 7,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Where's Amy's brother from? B: ______",
    "options": [
      "No. He's from the USA.",
      "He's from Australia.",
      "He isn't from Taiwan.",
      "Yes. He's from the UK."
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「He's from Australia.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_220",
    "book": 7,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Look! ____________ B: It's beautiful.",
    "options": [
      "I'm from Spain.",
      "I'm hungry.",
      "That's the Taj Mahal.",
      "I'd like some sandwiches."
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「That's the Taj Mahal.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_221",
    "book": 7,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "How ______ your sisters go to the park?",
    "options": [
      "are",
      "do",
      "does",
      "is"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「do」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_222",
    "book": 7,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "______ Alex go to school on foot?",
    "options": [
      "Are",
      "Is",
      "Do",
      "Does"
    ],
    "answer": 3,
    "explanation": "詢問交通方式使用「How do/does + 主詞 + go to ...?」，搭乘交通工具用「by + 交通工具」，步行用「on foot」。"
  },
  {
    "id": "hwg_b7_223",
    "book": 7,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Maya ______ to the supermarket by bus.",
    "options": [
      "go",
      "going",
      "is go",
      "goes"
    ],
    "answer": 3,
    "explanation": "詢問交通方式使用「How do/does + 主詞 + go to ...?」，搭乘交通工具用「by + 交通工具」，步行用「on foot」。"
  },
  {
    "id": "hwg_b7_224",
    "book": 7,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "______ do they go to the museum?",
    "options": [
      "Where",
      "Who",
      "What",
      "How"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「How」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_225",
    "book": 7,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: It's usually cold and rainy here in winter. How do you go to school? B: ______.",
    "options": [
      "By scooter",
      "By taxi",
      "By bike"
    ],
    "answer": 1,
    "explanation": "詢問交通方式使用「How do/does + 主詞 + go to ...?」，搭乘交通工具用「by + 交通工具」，步行用「on foot」。"
  },
  {
    "id": "hwg_b7_226",
    "book": 7,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: How does your brother go to school? B: He goes to school ______. He can walk very fast.",
    "options": [
      "by train",
      "by bike",
      "on foot"
    ],
    "answer": 2,
    "explanation": "詢問交通方式使用「How do/does + 主詞 + go to ...?」，搭乘交通工具用「by + 交通工具」，步行用「on foot」。"
  },
  {
    "id": "hwg_b7_227",
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
    "id": "hwg_b7_228",
    "book": 7,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: How do you go to school? B: ______",
    "options": [
      "I go home by bus.",
      "I go to school by bike.",
      "Yes. I go to school by train.",
      "I don't go to school on foot."
    ],
    "answer": 1,
    "explanation": "詢問交通方式使用「How do/does + 主詞 + go to ...?」，搭乘交通工具用「by + 交通工具」，步行用「on foot」。"
  },
  {
    "id": "hwg_b7_229",
    "book": 7,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Does she go to school by metro? B: ______",
    "options": [
      "Yes, she does.",
      "She goes to school by bike.",
      "She's going to school by metro.",
      "No, she isn't."
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「Yes, she does.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_230",
    "book": 7,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: How does Jerry go to the library? B: ______",
    "options": [
      "No. He goes to the library by bus.",
      "He goes to the library by car.",
      "He goes to the library with Sam.",
      "Yes. He goes to the library by car."
    ],
    "answer": 1,
    "explanation": "詢問交通方式使用「How do/does + 主詞 + go to ...?」，搭乘交通工具用「by + 交通工具」，步行用「on foot」。"
  },
  {
    "id": "hwg_b7_231",
    "book": 7,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______ B: We go to school by bus.",
    "options": [
      "How do you and Sara go to school?",
      "Do you go to school by bus?",
      "Do you go to school by train?",
      "How do the boys go to school?"
    ],
    "answer": 0,
    "explanation": "詢問交通方式使用「How do/does + 主詞 + go to ...?」，搭乘交通工具用「by + 交通工具」，步行用「on foot」。"
  },
  {
    "id": "hwg_b7_232",
    "book": 7,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______ B: Yes, she does. She goes to the bank on foot.",
    "options": [
      "Is Hazel going to the bank?",
      "How does Hazel go to the bank?",
      "Does Hazel go to the bank on foot?",
      "Does Hazel go to the bank by bike?"
    ],
    "answer": 2,
    "explanation": "詢問交通方式使用「How do/does + 主詞 + go to ...?」，搭乘交通工具用「by + 交通工具」，步行用「on foot」。"
  },
  {
    "id": "hwg_b7_233",
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
    "id": "hwg_b7_234",
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
    "id": "hwg_b7_235",
    "book": 7,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: Is she from Singapore? B: No. She's from ______. She doesn't speak English or Chinese at school.",
    "options": [
      "Taiwan",
      "the UK",
      "Japan"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「Japan」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_236",
    "book": 7,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: How do you and your sisters go to Taipei? B: We go there ______. We sit together and eat apples.",
    "options": [
      "by bike",
      "by car",
      "by MRT",
      "on foot"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「by car」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_237",
    "book": 7,
    "unit": "Review 1",
    "category": "grammar",
    "question": "Let's go to ______. There are dragon boat races on Saturday.",
    "options": [
      "India",
      "Taiwan",
      "Spain",
      "Australia"
    ],
    "answer": 1,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b7_238",
    "book": 7,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "What ______ you do on weekends?",
    "options": [
      "does",
      "do",
      "are",
      "am"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「do」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_239",
    "book": 7,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "What ______ he do in his free time?",
    "options": [
      "do",
      "is",
      "does",
      "are"
    ],
    "answer": 2,
    "explanation": "詢問休閒活動使用「What do/does + 主詞 + do in one’s free time?」，第三人稱單數主詞（he/she）動詞須加 -s/-es。"
  },
  {
    "id": "hwg_b7_240",
    "book": 7,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "Vicky ______ a bike after school.",
    "options": [
      "ride",
      "riding",
      "rides",
      "don't ride"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「rides」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_241",
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
    "id": "hwg_b7_242",
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
    "id": "hwg_b7_243",
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
    "id": "hwg_b7_244",
    "book": 7,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "My legs hurt. I can't ______, but I can watch TV.",
    "options": [
      "ride a bike",
      "study English",
      "listen to music",
      "read books"
    ],
    "answer": 0,
    "explanation": "依據本課核心句型與前後文語意，「ride a bike」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_245",
    "book": 7,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "Clara ______ in her free time. She can run fast.",
    "options": [
      "surfs the Internet",
      "watches TV",
      "goes jogging"
    ],
    "answer": 2,
    "explanation": "詢問休閒活動使用「What do/does + 主詞 + do in one’s free time?」，第三人稱單數主詞（he/she）動詞須加 -s/-es。"
  },
  {
    "id": "hwg_b7_246",
    "book": 7,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What do the girls do on weekends? B: ______",
    "options": [
      "We watch TV.",
      "They play basketball.",
      "She goes jogging.",
      "I study English."
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「They play basketball.」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_247",
    "book": 7,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What does Kevin do in his free time? B: ______",
    "options": [
      "He is sleeping in his room.",
      "He goes to school on foot.",
      "He rides a bike in his free time.",
      "He'd like some noodles for lunch."
    ],
    "answer": 2,
    "explanation": "詢問休閒活動使用「What do/does + 主詞 + do in one’s free time?」，第三人稱單數主詞（he/she）動詞須加 -s/-es。"
  },
  {
    "id": "hwg_b7_248",
    "book": 7,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What do you and Irene do in your free time? B: ______",
    "options": [
      "They're going to the bank.",
      "I listen to music in my free time.",
      "We surf the Internet in our free time.",
      "Yes, we play baseball in our free time."
    ],
    "answer": 2,
    "explanation": "詢問休閒活動使用「What do/does + 主詞 + do in one’s free time?」，第三人稱單數主詞（he/she）動詞須加 -s/-es。"
  },
  {
    "id": "hwg_b7_249",
    "book": 7,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: ______ B: She studies English in her free time.",
    "options": [
      "What is she doing in the kitchen?",
      "What does Leo do in his free time?",
      "What does Sally do in her free time?",
      "Does she study English in her free time?"
    ],
    "answer": 2,
    "explanation": "詢問休閒活動使用「What do/does + 主詞 + do in one’s free time?」，第三人稱單數主詞（he/she）動詞須加 -s/-es。"
  },
  {
    "id": "hwg_b7_250",
    "book": 7,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: ______ B: We listen to music after school.",
    "options": [
      "What do the boys do after school?",
      "What do you and Meg do in your free time?",
      "What do you do after school?",
      "What would you like for dinner?"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「What do you do after school?」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_251",
    "book": 7,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: ______ B: Me, too. It's fun!",
    "options": [
      "I play basketball in my free time.",
      "We're your fans.",
      "I have a sore throat.",
      "Let me show you."
    ],
    "answer": 0,
    "explanation": "詢問休閒活動使用「What do/does + 主詞 + do in one’s free time?」，第三人稱單數主詞（he/she）動詞須加 -s/-es。"
  },
  {
    "id": "hwg_b7_252",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "What time ______ your sister have lunch?",
    "options": [
      "is",
      "does",
      "are",
      "do"
    ],
    "answer": 1,
    "explanation": "依據本課核心句型與前後文語意，「does」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b7_253",
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
    "id": "hwg_b7_254",
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
    "id": "hwg_b7_255",
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
    "id": "hwg_b7_256",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What time do you ______? B: At twelve o'clock. I eat beef sandwiches every Monday.",
    "options": [
      "go to school",
      "go to bed",
      "have lunch",
      "take a shower"
    ],
    "answer": 2,
    "explanation": "詢問日常作息時間使用「What time do/does + 主詞 + 原形動詞?」，特定時刻前搭配介系詞「at」。"
  },
  {
    "id": "hwg_b7_257",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What time does Jeff usually ______? B: At 10:00. But he's not so tired today, so he wants to sleep at 11:00.",
    "options": [
      "get up",
      "go to bed",
      "go to school"
    ],
    "answer": 1,
    "explanation": "詢問日常作息時間使用「What time do/does + 主詞 + 原形動詞?」，特定時刻前搭配介系詞「at」。"
  },
  {
    "id": "hwg_b7_258",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What time does she ______? B: At 6:30. She likes to sing in the bathroom.",
    "options": [
      "go home",
      "have dinner",
      "get up",
      "take a shower"
    ],
    "answer": 3,
    "explanation": "詢問日常作息時間使用「What time do/does + 主詞 + 原形動詞?」，特定時刻前搭配介系詞「at」。"
  },
  {
    "id": "hwg_b7_259",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Is Kate in the bedroom? B: Yes. She's ______.",
    "options": [
      "doing her homework",
      "playing baseball",
      "going to school",
      "going home"
    ],
    "answer": 0,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b7_260",
    "book": 7,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: What time do you go to school? B: ______",
    "options": [
      "We go to bed at 9:30.",
      "I take a shower at 4:00.",
      "I go to school at 7:30.",
      "We go to school on foot."
    ],
    "answer": 2,
    "explanation": "詢問日常作息時間使用「What time do/does + 主詞 + 原形動詞?」，特定時刻前搭配介系詞「at」。"
  },
  {
    "id": "hwg_b7_261",
    "book": 7,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: What time does Caleb go home? B: ______",
    "options": [
      "He goes to bed at 10:30.",
      "He goes home at 5:30.",
      "He goes home with his mom.",
      "He goes home by bus."
    ],
    "answer": 1,
    "explanation": "詢問日常作息時間使用「What time do/does + 主詞 + 原形動詞?」，特定時刻前搭配介系詞「at」。"
  },
  {
    "id": "hwg_b7_262",
    "book": 7,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: What time do you have dinner? B: ______",
    "options": [
      "I'd like some salad for lunch.",
      "We have dinner at 6:00.",
      "I have dinner at home.",
      "We have lunch at 12:00."
    ],
    "answer": 1,
    "explanation": "詢問日常作息時間使用「What time do/does + 主詞 + 原形動詞?」，特定時刻前搭配介系詞「at」。"
  },
  {
    "id": "hwg_b7_263",
    "book": 7,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: ______ B: He does his homework at five.",
    "options": [
      "What does Logan do in his free time?",
      "What time does Logan do his homework?",
      "What time do you do your homework, Logan?",
      "Does Logan do his homework at five?"
    ],
    "answer": 1,
    "explanation": "詢問日常作息時間使用「What time do/does + 主詞 + 原形動詞?」，特定時刻前搭配介系詞「at」。"
  },
  {
    "id": "hwg_b7_264",
    "book": 7,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: ______ B: She gets up at eight o'clock.",
    "options": [
      "Does Grandma get up at eight o'clock?",
      "What time does your sister get up?",
      "What time does your mother go home?",
      "What time do the girls get up?"
    ],
    "answer": 1,
    "explanation": "詢問日常作息時間使用「What time do/does + 主詞 + 原形動詞?」，特定時刻前搭配介系詞「at」。"
  },
  {
    "id": "hwg_b7_265",
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
    "id": "hwg_b7_266",
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
    "id": "hwg_b7_267",
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
    "id": "hwg_b7_268",
    "book": 7,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: What does Barry do in his free time? B: He ______ with his friends in the park.",
    "options": [
      "watches TV",
      "takes a shower",
      "plays basketball",
      "goes to school"
    ],
    "answer": 2,
    "explanation": "詢問休閒活動使用「What do/does + 主詞 + do in one’s free time?」，第三人稱單數主詞（he/she）動詞須加 -s/-es。"
  },
  {
    "id": "hwg_b7_269",
    "book": 7,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: Andrew, ______! It's 8:00. Time for school! B: OK, Mom.",
    "options": [
      "have lunch",
      "go to bed",
      "get up",
      "watch TV"
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b7_270",
    "book": 7,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: Amy and Sam go home at 4:30 by bike. They ______ on weekends, too. B: Wow! They like to ride very much.",
    "options": [
      "listen to music",
      "surf the Internet",
      "ride their bikes",
      "go jogging"
    ],
    "answer": 2,
    "explanation": "詢問交通方式使用「How do/does + 主詞 + go to ...?」，搭乘交通工具用「by + 交通工具」，步行用「on foot」。"
  },
  {
    "id": "hwg_b9_271",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "We ______ to the night market yesterday.",
    "options": [
      "went",
      "go",
      "goes",
      "going"
    ],
    "answer": 0,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_272",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Ian went to the amusement park ______.",
    "options": [
      "every day",
      "last weekend",
      "on weekends",
      "on Wednesdays"
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_273",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Where did your father ______ yesterday evening?",
    "options": [
      "went",
      "goes",
      "going",
      "go"
    ],
    "answer": 3,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_274",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Mom ______ juice last night.",
    "options": [
      "drinks",
      "drinking",
      "drink",
      "drank"
    ],
    "answer": 3,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_275",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Dylan ______ yesterday morning.",
    "options": [
      "goes shopping",
      "flew a kite",
      "rides a bike",
      "is eating snacks"
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_276",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "What ______ you do yesterday?",
    "options": [
      "do",
      "does",
      "did",
      "were"
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_277",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: ______ did Bella go yesterday? B: She went to Starlight Night Market. It was big and new.",
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
    "id": "hwg_b9_278",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Where did you go last weekend? B: I went to the ______. I rode a bike there.",
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
    "id": "hwg_b9_279",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: What did Evan do at the movie theater last Friday? B: He ______.",
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
    "id": "hwg_b9_280",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: What did you do last night? B: I was hungry, so I ______.",
    "options": [
      "rode a bike",
      "flew a kite",
      "watched TV",
      "ate snacks"
    ],
    "answer": 3,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_281",
    "book": 9,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Where did the girls go last Thursday? B: ______",
    "options": [
      "They saw a movie.",
      "They went to the night market.",
      "She went to the amusement park.",
      "She flew a kite."
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_282",
    "book": 9,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: ______ B: I went to the riverside park.",
    "options": [
      "What do you do on weekends?",
      "Where did he go last Tuesday?",
      "Were you at home?",
      "Where did you go yesterday?"
    ],
    "answer": 3,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_283",
    "book": 9,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Where did Alice go last Tuesday? B: ______",
    "options": [
      "She went to the department store.",
      "She ate snacks.",
      "She saw a movie with Dylan.",
      "She flew a kite last Tuesday."
    ],
    "answer": 0,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_284",
    "book": 9,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: ______ B: She went shopping.",
    "options": [
      "Did Nina visit a friend?",
      "Where was Nina yesterday?",
      "Where did your sisters go last night?",
      "What did Nina do last weekend?"
    ],
    "answer": 3,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_285",
    "book": 9,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: What did your brother do last Sunday? B: ______",
    "options": [
      "I went to the zoo.",
      "He rode a bike at the riverside park.",
      "He didn't fly a kite.",
      "I drank juice."
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_286",
    "book": 9,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: What did you do yesterday morning? B: ______",
    "options": [
      "They went to the library.",
      "We were at the park.",
      "I was at the amusement park.",
      "We saw a movie."
    ],
    "answer": 3,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_287",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "They ______ a picnic yesterday morning.",
    "options": [
      "having",
      "has",
      "had",
      "have"
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_288",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "We ______ after school last weekend.",
    "options": [
      "swim",
      "swam",
      "swims",
      "swimming"
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_289",
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
    "id": "hwg_b9_290",
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
    "id": "hwg_b9_291",
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
    "id": "hwg_b9_292",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Did John run ______?",
    "options": [
      "every Friday",
      "on Saturdays",
      "on weekends",
      "last Saturday"
    ],
    "answer": 3,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_293",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: ______ did Terry do yesterday afternoon? B: He wrote a letter.",
    "options": [
      "Whose",
      "What",
      "Where",
      "How"
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_294",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Leo, what did you do last night? B: ______ ran with my brother and watched TV with my mom.",
    "options": [
      "She",
      "They",
      "I",
      "He"
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_295",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Did Sophie ______ this morning? B: Yes, she did. Her hair looks different.",
    "options": [
      "see a movie",
      "write a letter",
      "have a picnic",
      "get a haircut"
    ],
    "answer": 3,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_296",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Did they ______ yesterday? B: No, they didn't. It was a rainy day, so they stayed home.",
    "options": [
      "sing songs",
      "draw a picture",
      "write a letter",
      "have a picnic"
    ],
    "answer": 3,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_297",
    "book": 9,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What did you do last night? B: ______",
    "options": [
      "We took a walk.",
      "I go to the riverside park.",
      "We didn't swim.",
      "I sing songs."
    ],
    "answer": 0,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_298",
    "book": 9,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______ B: He drew a picture.",
    "options": [
      "What did Logan do last Monday?",
      "Did Logan draw a picture last Monday?",
      "What is Logan doing now?",
      "Where did Logan go last Monday?"
    ],
    "answer": 0,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_299",
    "book": 9,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What did your mom do this morning? B: ______",
    "options": [
      "She got a haircut this morning.",
      "She is at home.",
      "She runs every morning.",
      "She didn't have a picnic this morning."
    ],
    "answer": 0,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_300",
    "book": 9,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: ______ B: No, we didn't. We swam yesterday.",
    "options": [
      "Do you run every day?",
      "Did you run yesterday?",
      "Did you swim yesterday?",
      "Can you sing songs?"
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_301",
    "book": 9,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Did Alex write a letter last Thursday? B: ______",
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
    "id": "hwg_b9_302",
    "book": 9,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Did they take a walk last Monday? B: ______ They took a walk last Friday.",
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
    "id": "hwg_b9_303",
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
    "id": "hwg_b9_304",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ like a bowl of salad. B: Sure! Anything else?",
    "options": [
      "I can",
      "I'm",
      "I'd",
      "I don't"
    ],
    "answer": 2,
    "explanation": "表達禮貌點餐或想要某食物用「Would you like ...? / I’d like ...」，不可數與計量食物常搭配單位詞「a cup/bottle/bowl/piece/glass of ...」。"
  },
  {
    "id": "hwg_b9_305",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "They'd like three ______ of cookies.",
    "options": [
      "piece",
      "plate",
      "boxes",
      "bag"
    ],
    "answer": 2,
    "explanation": "依據本課核心句型與前後文語意，「boxes」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b9_306",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "We'd like a ______ of water.",
    "options": [
      "bowls",
      "cups",
      "piece",
      "bottle"
    ],
    "answer": 3,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_307",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What ______ Lily like to drink? B: ______ like a cup of milk.",
    "options": [
      "would, She'd",
      "does, She",
      "would, She",
      "does, She'd"
    ],
    "answer": 0,
    "explanation": "表達禮貌點餐或想要某食物用「Would you like ...? / I’d like ...」，不可數與計量食物常搭配單位詞「a cup/bottle/bowl/piece/glass of ...」。"
  },
  {
    "id": "hwg_b9_308",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What would you like to drink? B: We'd like two ______ of tea.",
    "options": [
      "plate",
      "glass",
      "plates",
      "glasses"
    ],
    "answer": 3,
    "explanation": "表達禮貌點餐或想要某食物用「Would you like ...? / I’d like ...」，不可數與計量食物常搭配單位詞「a cup/bottle/bowl/piece/glass of ...」。"
  },
  {
    "id": "hwg_b9_309",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What would you like to ______? B: I'd like a piece of ______.",
    "options": [
      "eat, cake",
      "drink, cake",
      "drink, juice",
      "eat, juice"
    ],
    "answer": 0,
    "explanation": "表達禮貌點餐或想要某食物用「Would you like ...? / I’d like ...」，不可數與計量食物常搭配單位詞「a cup/bottle/bowl/piece/glass of ...」。"
  },
  {
    "id": "hwg_b9_310",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "Leo is hungry. He'd like two ______ of ______.",
    "options": [
      "glasses, water",
      "plate, noodles",
      "cups, tea",
      "bowls, rice"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「bowls, rice」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b9_311",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "I'm thirsty. I'd like a ______ of______.",
    "options": [
      "bottles, juice",
      "bottle, water",
      "piece, chocolate",
      "box, cookies"
    ],
    "answer": 1,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_312",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What would Nina and Logan like to ______? B: They'd like four ______ of winter melon tea.",
    "options": [
      "eat, bowls",
      "eat, boxes",
      "drink, pieces",
      "drink, glasses"
    ],
    "answer": 3,
    "explanation": "依據本課核心句型與前後文語意，「drink, glasses」最符合主詞人稱、時態與情境搭配。"
  },
  {
    "id": "hwg_b9_313",
    "book": 9,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What would you like to eat? B: ______",
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
    "id": "hwg_b9_314",
    "book": 9,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: ______ B: She'd like a bowl of soup.",
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
    "id": "hwg_b9_315",
    "book": 9,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is Terry hungry? B: Yes, he is. ______",
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
    "id": "hwg_b9_316",
    "book": 9,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: ______ B: They'd like three bottles of water.",
    "options": [
      "Did they like water?",
      "What would they like to eat?",
      "What would they like to drink?",
      "What do they like?"
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_317",
    "book": 9,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What would you like to drink? B: ______",
    "options": [
      "I'd like two pieces of cake.",
      "We'd like a bowl of rice.",
      "We'd like two cups of tea.",
      "I'd like a bag of chips."
    ],
    "answer": 2,
    "explanation": "表達禮貌點餐或想要某食物用「Would you like ...? / I’d like ...」，不可數與計量食物常搭配單位詞「a cup/bottle/bowl/piece/glass of ...」。"
  },
  {
    "id": "hwg_b9_318",
    "book": 9,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: I'm thirsty. ______ How about you? B: I'd like a bottle of water.",
    "options": [
      "I'd like two bowls of salad.",
      "I'd like two plates of noodles.",
      "I'd like a glass of juice.",
      "I'd like a bag of apples."
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_319",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "______ the date today?",
    "options": [
      "What's",
      "How",
      "What",
      "How's"
    ],
    "answer": 0,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_320",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "______ January 31st.",
    "options": [
      "It",
      "I'd",
      "It's",
      "Today"
    ],
    "answer": 2,
    "explanation": "詢問日期用「What’s the date today?」；只講月份用介系詞「in + 月份」，講出「幾月幾日（序數）」則用「on + 月份 + 序數」。"
  },
  {
    "id": "hwg_b9_321",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Today is June ______.",
    "options": [
      "30th",
      "23th",
      "3nd",
      "13rd"
    ],
    "answer": 0,
    "explanation": "詢問日期用「What’s the date today?」；只講月份用介系詞「in + 月份」，講出「幾月幾日（序數）」則用「on + 月份 + 序數」。"
  },
  {
    "id": "hwg_b9_322",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Dad's birthday is ______ March 7th.",
    "options": [
      "on",
      "under",
      "at",
      "in"
    ],
    "answer": 0,
    "explanation": "特定星期幾（如 Monday, Thursday）前面固定搭配介系詞「on」。"
  },
  {
    "id": "hwg_b9_323",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Evan, when ______ your birthday?",
    "options": [
      "does",
      "is",
      "are",
      "were"
    ],
    "answer": 1,
    "explanation": "詢問日期用「What’s the date today?」；只講月份用介系詞「in + 月份」，講出「幾月幾日（序數）」則用「on + 月份 + 序數」。"
  },
  {
    "id": "hwg_b9_324",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Jessie's birthday is ______ August.",
    "options": [
      "on",
      "in",
      "from",
      "at"
    ],
    "answer": 1,
    "explanation": "詢問日期用「What’s the date today?」；只講月份用介系詞「in + 月份」，講出「幾月幾日（序數）」則用「on + 月份 + 序數」。"
  },
  {
    "id": "hwg_b9_325",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What's the ______ today? B: It's March 2nd.",
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
    "id": "hwg_b9_326",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What's the date today? B: It's ______ 31st.",
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
    "id": "hwg_b9_327",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: ______ is your birthday? B: It's on December 10th.",
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
    "id": "hwg_b9_328",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Teachers' Day is on ______ 28th. Students thank their teachers.",
    "options": [
      "May",
      "June",
      "December",
      "September"
    ],
    "answer": 3,
    "explanation": "詢問日期用「What’s the date today?」；只講月份用介系詞「in + 月份」，講出「幾月幾日（序數）」則用「on + 月份 + 序數」。"
  },
  {
    "id": "hwg_b9_329",
    "book": 9,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Today is February 28th. B: No. Yesterday was February 28th. ______",
    "options": [
      "Today is March 1st.",
      "Today is February 1st.",
      "Today is January 1st.",
      "Today is May 1st."
    ],
    "answer": 0,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_330",
    "book": 9,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: ______ B: It's April 15th.",
    "options": [
      "What time is it?",
      "When is your birthday?",
      "What's the date today?",
      "What day is today?"
    ],
    "answer": 2,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_331",
    "book": 9,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Excuse me. What's the date today? B: ______",
    "options": [
      "It's on October 20th.",
      "It's October.",
      "It's in October.",
      "It's October 20th."
    ],
    "answer": 3,
    "explanation": "句子含有過去時間（yesterday, last weekend 等）時使用過去式；助動詞「did / didn’t」後方的動詞必須還原為原形動詞。"
  },
  {
    "id": "hwg_b9_332",
    "book": 9,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: When is your birthday? B: ______",
    "options": [
      "It's 17th.",
      "It's not in May.",
      "It's at seven.",
      "It's on May 17th."
    ],
    "answer": 3,
    "explanation": "詢問日期用「What’s the date today?」；只講月份用介系詞「in + 月份」，講出「幾月幾日（序數）」則用「on + 月份 + 序數」。"
  },
  {
    "id": "hwg_b9_333",
    "book": 9,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: When is Chloe's birthday? B: ______",
    "options": [
      "It's in July.",
      "Her birthday is on Saturday.",
      "Her birthday isn't on July 31st.",
      "Yes, it's in July."
    ],
    "answer": 0,
    "explanation": "詢問日期用「What’s the date today?」；只講月份用介系詞「in + 月份」，講出「幾月幾日（序數）」則用「on + 月份 + 序數」。"
  },
  {
    "id": "hwg_b9_334",
    "book": 9,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: My birthday is on August 29th. B: ______ Our birthdays are in the same week.",
    "options": [
      "My birthday is on April 30th.",
      "My birthday is on September 29th.",
      "My birthday is on August 24th.",
      "My birthday is in spring."
    ],
    "answer": 2,
    "explanation": "詢問日期用「What’s the date today?」；只講月份用介系詞「in + 月份」，講出「幾月幾日（序數）」則用「on + 月份 + 序數」。"
  },
  {
    "id": "hwg_b1_335",
    "book": 1,
    "unit": "Starter",
    "category": "grammar",
    "question": "Stand ______ , please.",
    "options": [
      "at",
      "up",
      "down"
    ],
    "answer": 1,
    "explanation": "片語「Stand up」表示「起立」。"
  },
  {
    "id": "hwg_b1_336",
    "book": 1,
    "unit": "Starter",
    "category": "grammar",
    "question": "Sit ______, please.",
    "options": [
      "down",
      "up",
      "in"
    ],
    "answer": 0,
    "explanation": "片語「Sit down」表示「坐下」。"
  },
  {
    "id": "hwg_b1_337",
    "book": 1,
    "unit": "Starter",
    "category": "grammar",
    "question": "Look ______ me, please.",
    "options": [
      "to",
      "in",
      "at"
    ],
    "answer": 2,
    "explanation": "片語「Look at me」表示「請看著我」。"
  },
  {
    "id": "hwg_b1_338",
    "book": 1,
    "unit": "Starter",
    "category": "grammar",
    "question": "Line ______, everyone.",
    "options": [
      "at",
      "up",
      "on"
    ],
    "answer": 1,
    "explanation": "片語「Line up」表示「排隊」。"
  },
  {
    "id": "hwg_b1_339",
    "book": 1,
    "unit": "Starter",
    "category": "grammar",
    "question": "Open ______ book, please.",
    "options": [
      "your",
      "you",
      "I"
    ],
    "answer": 0,
    "explanation": "名詞 book 前方使用所有格「your（你的）」。"
  },
  {
    "id": "hwg_b1_340",
    "book": 1,
    "unit": "Starter",
    "category": "grammar",
    "question": "Close ______ book, please.",
    "options": [
      "you",
      "am",
      "your"
    ],
    "answer": 2,
    "explanation": "名詞 book 前方使用所有格「your（你的）」。"
  },
  {
    "id": "hwg_b1_341",
    "book": 1,
    "unit": "Starter",
    "category": "grammar",
    "question": "One, two, ______, four, five.",
    "options": [
      "eight",
      "three",
      "six"
    ],
    "answer": 1,
    "explanation": "數字 1 到 5 依序為 one, two, three, four, five。"
  },
  {
    "id": "hwg_b1_342",
    "book": 1,
    "unit": "Starter",
    "category": "grammar",
    "question": "Two, three, ______, five.",
    "options": [
      "four",
      "one",
      "nine"
    ],
    "answer": 0,
    "explanation": "3 與 5 中間的數字為「four（四）」。"
  },
  {
    "id": "hwg_b1_343",
    "book": 1,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: Listen, please! B: ______",
    "options": [
      "I'm seven.",
      "It's red.",
      "OK!"
    ],
    "answer": 2,
    "explanation": "回應老師課室指令使用「OK!」。"
  },
  {
    "id": "hwg_b1_344",
    "book": 1,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: Hi, I am Lucas. B: ______",
    "options": [
      "It's a pen.",
      "Hello, Lucas!",
      "Thank you."
    ],
    "answer": 1,
    "explanation": "初次打招呼自我介紹時，以「Hello, ...!」回應。"
  },
  {
    "id": "hwg_b1_345",
    "book": 1,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Hello! My name ______ Lucas.",
    "options": [
      "is",
      "am",
      "are"
    ],
    "answer": 0,
    "explanation": "單數主詞「My name」搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b1_346",
    "book": 1,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Hi, I ______ Emma.",
    "options": [
      "is",
      "your",
      "am"
    ],
    "answer": 2,
    "explanation": "第一人稱單數主詞「I」固定搭配 Be 動詞「am」。"
  },
  {
    "id": "hwg_b1_347",
    "book": 1,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: What's your name? B: ______",
    "options": [
      "You are welcome.",
      "My name is Emma.",
      "I'm eight."
    ],
    "answer": 1,
    "explanation": "詢問姓名「What’s your name?」，回答「My name is ...」。"
  },
  {
    "id": "hwg_b1_348",
    "book": 1,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: How are you, Lucas? B: ______",
    "options": [
      "I'm fine, thank you.",
      "My name is Lucas.",
      "It's blue."
    ],
    "answer": 0,
    "explanation": "問候「How are you?」以「I’m fine, thank you.」回答。"
  },
  {
    "id": "hwg_b1_349",
    "book": 1,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Hello! My name ______ Max.",
    "options": [
      "am",
      "are",
      "is"
    ],
    "answer": 2,
    "explanation": "單數主詞「My name」搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b1_350",
    "book": 1,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Hi, I ______ Nina.",
    "options": [
      "your",
      "am",
      "is"
    ],
    "answer": 1,
    "explanation": "第一人稱單數主詞「I」固定搭配 Be 動詞「am」。"
  },
  {
    "id": "hwg_b1_351",
    "book": 1,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: What's your name? B: ______",
    "options": [
      "My name is Nina.",
      "I'm eight.",
      "You are welcome."
    ],
    "answer": 0,
    "explanation": "詢問姓名「What’s your name?」，回答「My name is ...」。"
  },
  {
    "id": "hwg_b1_352",
    "book": 1,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: How are you, Max? B: ______",
    "options": [
      "My name is Max.",
      "It's blue.",
      "I'm fine, thank you."
    ],
    "answer": 2,
    "explanation": "問候「How are you?」以「I’m fine, thank you.」回答。"
  },
  {
    "id": "hwg_b1_353",
    "book": 1,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Hello! My name ______ Leo.",
    "options": [
      "are",
      "is",
      "am"
    ],
    "answer": 1,
    "explanation": "單數主詞「My name」搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b1_354",
    "book": 1,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Hi, I ______ Chloe.",
    "options": [
      "am",
      "is",
      "your"
    ],
    "answer": 0,
    "explanation": "第一人稱單數主詞「I」固定搭配 Be 動詞「am」。"
  },
  {
    "id": "hwg_b1_355",
    "book": 1,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: What's your name? B: ______",
    "options": [
      "I'm eight.",
      "You are welcome.",
      "My name is Chloe."
    ],
    "answer": 2,
    "explanation": "詢問姓名「What’s your name?」，回答「My name is ...」。"
  },
  {
    "id": "hwg_b1_356",
    "book": 1,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: How are you, Leo? B: ______",
    "options": [
      "It's blue.",
      "I'm fine, thank you.",
      "My name is Leo."
    ],
    "answer": 1,
    "explanation": "問候「How are you?」以「I’m fine, thank you.」回答。"
  },
  {
    "id": "hwg_b1_357",
    "book": 1,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Hello! My name ______ Kulas.",
    "options": [
      "is",
      "am",
      "are"
    ],
    "answer": 0,
    "explanation": "單數主詞「My name」搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b1_358",
    "book": 1,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Hi, I ______ Sophie.",
    "options": [
      "is",
      "your",
      "am"
    ],
    "answer": 2,
    "explanation": "第一人稱單數主詞「I」固定搭配 Be 動詞「am」。"
  },
  {
    "id": "hwg_b1_359",
    "book": 1,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: What's your name? B: ______",
    "options": [
      "You are welcome.",
      "My name is Sophie.",
      "I'm eight."
    ],
    "answer": 1,
    "explanation": "詢問姓名「What’s your name?」，回答「My name is ...」。"
  },
  {
    "id": "hwg_b1_360",
    "book": 1,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: How are you, Kulas? B: ______",
    "options": [
      "I'm fine, thank you.",
      "My name is Kulas.",
      "It's blue."
    ],
    "answer": 0,
    "explanation": "問候「How are you?」以「I’m fine, thank you.」回答。"
  },
  {
    "id": "hwg_b1_361",
    "book": 1,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Hello! My name ______ Ryan.",
    "options": [
      "am",
      "are",
      "is"
    ],
    "answer": 2,
    "explanation": "單數主詞「My name」搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b1_362",
    "book": 1,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Hi, I ______ Hannah.",
    "options": [
      "your",
      "am",
      "is"
    ],
    "answer": 1,
    "explanation": "第一人稱單數主詞「I」固定搭配 Be 動詞「am」。"
  },
  {
    "id": "hwg_b1_363",
    "book": 1,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: What's your name? B: ______",
    "options": [
      "My name is Hannah.",
      "I'm eight.",
      "You are welcome."
    ],
    "answer": 0,
    "explanation": "詢問姓名「What’s your name?」，回答「My name is ...」。"
  },
  {
    "id": "hwg_b1_364",
    "book": 1,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: How are you, Ryan? B: ______",
    "options": [
      "My name is Ryan.",
      "It's blue.",
      "I'm fine, thank you."
    ],
    "answer": 2,
    "explanation": "問候「How are you?」以「I’m fine, thank you.」回答。"
  },
  {
    "id": "hwg_b1_365",
    "book": 1,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: How old ______ you? B: I'm six.",
    "options": [
      "am",
      "are",
      "is"
    ],
    "answer": 1,
    "explanation": "主詞「you」固定搭配 Be 動詞「are」。"
  },
  {
    "id": "hwg_b1_366",
    "book": 1,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "I am six ______ old.",
    "options": [
      "years",
      "year",
      "name"
    ],
    "answer": 0,
    "explanation": "大於 1 歲時，year 必須加 -s 成為複數「years old」。"
  },
  {
    "id": "hwg_b1_367",
    "book": 1,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Happy birthday, Lucas! How old are you? B: ______",
    "options": [
      "I'm fine.",
      "It's a ruler.",
      "I'm six years old."
    ],
    "answer": 2,
    "explanation": "詢問年齡「How old are you?」，回答「I’m ... years old.」。"
  },
  {
    "id": "hwg_b1_368",
    "book": 1,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: How old ______ you? B: I'm seven.",
    "options": [
      "am",
      "are",
      "is"
    ],
    "answer": 1,
    "explanation": "主詞「you」固定搭配 Be 動詞「are」。"
  },
  {
    "id": "hwg_b1_369",
    "book": 1,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "I am seven ______ old.",
    "options": [
      "years",
      "year",
      "name"
    ],
    "answer": 0,
    "explanation": "大於 1 歲時，year 必須加 -s 成為複數「years old」。"
  },
  {
    "id": "hwg_b1_370",
    "book": 1,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Happy birthday, Max! How old are you? B: ______",
    "options": [
      "I'm fine.",
      "It's a ruler.",
      "I'm seven years old."
    ],
    "answer": 2,
    "explanation": "詢問年齡「How old are you?」，回答「I’m ... years old.」。"
  },
  {
    "id": "hwg_b1_371",
    "book": 1,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: How old ______ you? B: I'm eight.",
    "options": [
      "am",
      "are",
      "is"
    ],
    "answer": 1,
    "explanation": "主詞「you」固定搭配 Be 動詞「are」。"
  },
  {
    "id": "hwg_b1_372",
    "book": 1,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "I am eight ______ old.",
    "options": [
      "years",
      "year",
      "name"
    ],
    "answer": 0,
    "explanation": "大於 1 歲時，year 必須加 -s 成為複數「years old」。"
  },
  {
    "id": "hwg_b1_373",
    "book": 1,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Happy birthday, Leo! How old are you? B: ______",
    "options": [
      "I'm fine.",
      "It's a ruler.",
      "I'm eight years old."
    ],
    "answer": 2,
    "explanation": "詢問年齡「How old are you?」，回答「I’m ... years old.」。"
  },
  {
    "id": "hwg_b1_374",
    "book": 1,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: How old ______ you? B: I'm nine.",
    "options": [
      "am",
      "are",
      "is"
    ],
    "answer": 1,
    "explanation": "主詞「you」固定搭配 Be 動詞「are」。"
  },
  {
    "id": "hwg_b1_375",
    "book": 1,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "I am nine ______ old.",
    "options": [
      "years",
      "year",
      "name"
    ],
    "answer": 0,
    "explanation": "大於 1 歲時，year 必須加 -s 成為複數「years old」。"
  },
  {
    "id": "hwg_b1_376",
    "book": 1,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Happy birthday, Kulas! How old are you? B: ______",
    "options": [
      "I'm fine.",
      "It's a ruler.",
      "I'm nine years old."
    ],
    "answer": 2,
    "explanation": "詢問年齡「How old are you?」，回答「I’m ... years old.」。"
  },
  {
    "id": "hwg_b1_377",
    "book": 1,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: How old ______ you? B: I'm ten.",
    "options": [
      "am",
      "are",
      "is"
    ],
    "answer": 1,
    "explanation": "主詞「you」固定搭配 Be 動詞「are」。"
  },
  {
    "id": "hwg_b1_378",
    "book": 1,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "I am ten ______ old.",
    "options": [
      "years",
      "year",
      "name"
    ],
    "answer": 0,
    "explanation": "大於 1 歲時，year 必須加 -s 成為複數「years old」。"
  },
  {
    "id": "hwg_b1_379",
    "book": 1,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Happy birthday, Ryan! How old are you? B: ______",
    "options": [
      "I'm fine.",
      "It's a ruler.",
      "I'm ten years old."
    ],
    "answer": 2,
    "explanation": "詢問年齡「How old are you?」，回答「I’m ... years old.」。"
  },
  {
    "id": "hwg_b1_380",
    "book": 1,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: Thank you very much! B: ______",
    "options": [
      "My name is Leo.",
      "You're welcome.",
      "I'm ten."
    ],
    "answer": 1,
    "explanation": "對方道謝說「Thank you」，應回答「You’re welcome.（不客氣）」。"
  },
  {
    "id": "hwg_b1_381",
    "book": 1,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: ______ your name? B: I am Chloe.",
    "options": [
      "What's",
      "How's",
      "How old"
    ],
    "answer": 0,
    "explanation": "答句回答名字，故問句為「What’s your name?」。"
  },
  {
    "id": "hwg_b1_382",
    "book": 1,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: ______ old are you? B: I am nine.",
    "options": [
      "What",
      "Who",
      "How"
    ],
    "answer": 2,
    "explanation": "詢問幾歲使用疑問詞「How old」。"
  },
  {
    "id": "hwg_b1_383",
    "book": 1,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What's this? B: It's ______ book.",
    "options": [
      "am",
      "a",
      "an"
    ],
    "answer": 1,
    "explanation": "單數名詞「book」字首為子音發音，搭配不定冠詞「a」。"
  },
  {
    "id": "hwg_b1_384",
    "book": 1,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is this a book? B: ______ It's a book.",
    "options": [
      "Yes, it is.",
      "No, it's not.",
      "I'm seven."
    ],
    "answer": 0,
    "explanation": "前後名詞一致，肯定回答「Yes, it is.」。"
  },
  {
    "id": "hwg_b1_385",
    "book": 1,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is that a book? B: ______ It's a bag.",
    "options": [
      "Yes, it is.",
      "Thank you.",
      "No, it's not."
    ],
    "answer": 2,
    "explanation": "後句說明它是 bag，故否定回答「No, it's not.」。"
  },
  {
    "id": "hwg_b1_386",
    "book": 1,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What's this? B: It's ______ pencil.",
    "options": [
      "am",
      "a",
      "an"
    ],
    "answer": 1,
    "explanation": "單數名詞「pencil」字首為子音發音，搭配不定冠詞「a」。"
  },
  {
    "id": "hwg_b1_387",
    "book": 1,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is this a pencil? B: ______ It's a pencil.",
    "options": [
      "Yes, it is.",
      "No, it's not.",
      "I'm seven."
    ],
    "answer": 0,
    "explanation": "前後名詞一致，肯定回答「Yes, it is.」。"
  },
  {
    "id": "hwg_b1_388",
    "book": 1,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is that a pencil? B: ______ It's a eraser.",
    "options": [
      "Yes, it is.",
      "Thank you.",
      "No, it's not."
    ],
    "answer": 2,
    "explanation": "後句說明它是 eraser，故否定回答「No, it's not.」。"
  },
  {
    "id": "hwg_b1_389",
    "book": 1,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What's this? B: It's ______ ruler.",
    "options": [
      "am",
      "a",
      "an"
    ],
    "answer": 1,
    "explanation": "單數名詞「ruler」字首為子音發音，搭配不定冠詞「a」。"
  },
  {
    "id": "hwg_b1_390",
    "book": 1,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is this a ruler? B: ______ It's a ruler.",
    "options": [
      "Yes, it is.",
      "No, it's not.",
      "I'm seven."
    ],
    "answer": 0,
    "explanation": "前後名詞一致，肯定回答「Yes, it is.」。"
  },
  {
    "id": "hwg_b1_391",
    "book": 1,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is that a ruler? B: ______ It's a marker.",
    "options": [
      "Yes, it is.",
      "Thank you.",
      "No, it's not."
    ],
    "answer": 2,
    "explanation": "後句說明它是 marker，故否定回答「No, it's not.」。"
  },
  {
    "id": "hwg_b1_392",
    "book": 1,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is this an eraser? B: ______ It's an eraser.",
    "options": [
      "I'm seven.",
      "Yes, it is.",
      "No, it's not."
    ],
    "answer": 1,
    "explanation": "前後名詞一致，肯定回答「Yes, it is.」。"
  },
  {
    "id": "hwg_b1_393",
    "book": 1,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is that an eraser? B: ______ It's a pencil.",
    "options": [
      "No, it's not.",
      "Yes, it is.",
      "Thank you."
    ],
    "answer": 0,
    "explanation": "後句說明它是 pencil，故否定回答「No, it's not.」。"
  },
  {
    "id": "hwg_b1_394",
    "book": 1,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What's this? B: It's ______ apple.",
    "options": [
      "a",
      "am",
      "an"
    ],
    "answer": 2,
    "explanation": "單數名詞「apple」字首為母音發音，搭配不定冠詞「an」。"
  },
  {
    "id": "hwg_b1_395",
    "book": 1,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is this an apple? B: ______ It's an apple.",
    "options": [
      "I'm seven.",
      "Yes, it is.",
      "No, it's not."
    ],
    "answer": 1,
    "explanation": "前後名詞一致，肯定回答「Yes, it is.」。"
  },
  {
    "id": "hwg_b1_396",
    "book": 1,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is that an apple? B: ______ It's a book.",
    "options": [
      "No, it's not.",
      "Yes, it is.",
      "Thank you."
    ],
    "answer": 0,
    "explanation": "後句說明它是 book，故否定回答「No, it's not.」。"
  },
  {
    "id": "hwg_b1_397",
    "book": 1,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What's this? B: It's ______ bag.",
    "options": [
      "an",
      "am",
      "a"
    ],
    "answer": 2,
    "explanation": "單數名詞「bag」字首為子音發音，搭配不定冠詞「a」。"
  },
  {
    "id": "hwg_b1_398",
    "book": 1,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is this a bag? B: ______ It's a bag.",
    "options": [
      "I'm seven.",
      "Yes, it is.",
      "No, it's not."
    ],
    "answer": 1,
    "explanation": "前後名詞一致，肯定回答「Yes, it is.」。"
  },
  {
    "id": "hwg_b1_399",
    "book": 1,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is that a bag? B: ______ It's a ruler.",
    "options": [
      "No, it's not.",
      "Yes, it is.",
      "Thank you."
    ],
    "answer": 0,
    "explanation": "後句說明它是 ruler，故否定回答「No, it's not.」。"
  },
  {
    "id": "hwg_b1_400",
    "book": 1,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What ______ is the pen? B: It's red.",
    "options": [
      "name",
      "old",
      "color"
    ],
    "answer": 2,
    "explanation": "答句「It's red.」為顏色，故問句使用「What color」。"
  },
  {
    "id": "hwg_b1_401",
    "book": 1,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: What color is your bag? B: ______",
    "options": [
      "I'm nine years old.",
      "It's red and blue.",
      "It's a bag."
    ],
    "answer": 1,
    "explanation": "詢問物品顏色，以「It’s + 顏色.」回答。"
  },
  {
    "id": "hwg_b1_402",
    "book": 1,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What ______ is the pen? B: It's blue.",
    "options": [
      "color",
      "name",
      "old"
    ],
    "answer": 0,
    "explanation": "答句「It's blue.」為顏色，故問句使用「What color」。"
  },
  {
    "id": "hwg_b1_403",
    "book": 1,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: What color is your bag? B: ______",
    "options": [
      "It's a bag.",
      "I'm nine years old.",
      "It's blue and yellow."
    ],
    "answer": 2,
    "explanation": "詢問物品顏色，以「It’s + 顏色.」回答。"
  },
  {
    "id": "hwg_b1_404",
    "book": 1,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What ______ is the pen? B: It's yellow.",
    "options": [
      "old",
      "color",
      "name"
    ],
    "answer": 1,
    "explanation": "答句「It's yellow.」為顏色，故問句使用「What color」。"
  },
  {
    "id": "hwg_b1_405",
    "book": 1,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: What color is your bag? B: ______",
    "options": [
      "It's yellow and green.",
      "It's a bag.",
      "I'm nine years old."
    ],
    "answer": 0,
    "explanation": "詢問物品顏色，以「It’s + 顏色.」回答。"
  },
  {
    "id": "hwg_b1_406",
    "book": 1,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What ______ is the pen? B: It's green.",
    "options": [
      "name",
      "old",
      "color"
    ],
    "answer": 2,
    "explanation": "答句「It's green.」為顏色，故問句使用「What color」。"
  },
  {
    "id": "hwg_b1_407",
    "book": 1,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: What color is your bag? B: ______",
    "options": [
      "I'm nine years old.",
      "It's green and black.",
      "It's a bag."
    ],
    "answer": 1,
    "explanation": "詢問物品顏色，以「It’s + 顏色.」回答。"
  },
  {
    "id": "hwg_b1_408",
    "book": 1,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What ______ is the pen? B: It's black.",
    "options": [
      "color",
      "name",
      "old"
    ],
    "answer": 0,
    "explanation": "答句「It's black.」為顏色，故問句使用「What color」。"
  },
  {
    "id": "hwg_b1_409",
    "book": 1,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: What color is your bag? B: ______",
    "options": [
      "It's a bag.",
      "I'm nine years old.",
      "It's black and white."
    ],
    "answer": 2,
    "explanation": "詢問物品顏色，以「It’s + 顏色.」回答。"
  },
  {
    "id": "hwg_b1_410",
    "book": 1,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What ______ is the pen? B: It's white.",
    "options": [
      "old",
      "color",
      "name"
    ],
    "answer": 1,
    "explanation": "答句「It's white.」為顏色，故問句使用「What color」。"
  },
  {
    "id": "hwg_b1_411",
    "book": 1,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: What color is your bag? B: ______",
    "options": [
      "It's white and red.",
      "It's a bag.",
      "I'm nine years old."
    ],
    "answer": 0,
    "explanation": "詢問物品顏色，以「It’s + 顏色.」回答。"
  },
  {
    "id": "hwg_b1_412",
    "book": 1,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: What's this? B: ______ a yellow pencil.",
    "options": [
      "It",
      "I'm",
      "It's"
    ],
    "answer": 2,
    "explanation": "回答單數物品需包含主詞與動詞「It’s (It is)」。"
  },
  {
    "id": "hwg_b1_413",
    "book": 1,
    "unit": "Review 2",
    "category": "dialogue",
    "question": "A: What color is the eraser? B: ______",
    "options": [
      "Yes, it is.",
      "It's blue.",
      "It's an eraser."
    ],
    "answer": 1,
    "explanation": "詢問顏色「What color is ...?」應回答顏色而非物品名稱。"
  },
  {
    "id": "hwg_b1_414",
    "book": 1,
    "unit": "Festival",
    "category": "dialogue",
    "question": "A: Trick or treat! B: ______",
    "options": [
      "Happy Halloween! Here are some candies.",
      "You're welcome.",
      "It's a book."
    ],
    "answer": 0,
    "explanation": "萬聖節口號「Trick or treat!」搭配「Happy Halloween!」。"
  },
  {
    "id": "hwg_b1_415",
    "book": 1,
    "unit": "Festival",
    "category": "grammar",
    "question": "Look! It's ______ orange pumpkin.",
    "options": [
      "a",
      "am",
      "an"
    ],
    "answer": 2,
    "explanation": "orange 為母音開頭，單數可數名詞前搭配冠詞「an」。"
  },
  {
    "id": "hwg_b2_416",
    "book": 2,
    "unit": "Starter",
    "category": "grammar",
    "question": "Eleven, ______, thirteen.",
    "options": [
      "twenty",
      "twelve",
      "seven"
    ],
    "answer": 1,
    "explanation": "依數字順序：eleven, twelve, thirteen。"
  },
  {
    "id": "hwg_b2_417",
    "book": 2,
    "unit": "Starter",
    "category": "grammar",
    "question": "Twelve, ______, fourteen.",
    "options": [
      "thirteen",
      "seven",
      "twenty"
    ],
    "answer": 0,
    "explanation": "依數字順序：twelve, thirteen, fourteen。"
  },
  {
    "id": "hwg_b2_418",
    "book": 2,
    "unit": "Starter",
    "category": "grammar",
    "question": "Thirteen, ______, fifteen.",
    "options": [
      "seven",
      "twenty",
      "fourteen"
    ],
    "answer": 2,
    "explanation": "依數字順序：thirteen, fourteen, fifteen。"
  },
  {
    "id": "hwg_b2_419",
    "book": 2,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: Count with me! Eleven, twelve, thirteen! B: ______",
    "options": [
      "No, I cannot.",
      "Fourteen, fifteen!",
      "I'm fine."
    ],
    "answer": 1,
    "explanation": "接著 11, 12, 13 往下數為「Fourteen, fifteen!」。"
  },
  {
    "id": "hwg_b2_420",
    "book": 2,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: Good job, Lucas! B: ______",
    "options": [
      "Thank you!",
      "Try again.",
      "No, it isn't."
    ],
    "answer": 0,
    "explanation": "受到稱讚「Good job!」時應禮貌回答「Thank you!」。"
  },
  {
    "id": "hwg_b2_421",
    "book": 2,
    "unit": "Starter",
    "category": "grammar",
    "question": "A: What's that? B: It's ______ small cat.",
    "options": [
      "an",
      "are",
      "a"
    ],
    "answer": 2,
    "explanation": "small 為子音開頭，搭配不定冠詞「a」。"
  },
  {
    "id": "hwg_b2_422",
    "book": 2,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: ______ that a dog? B: Yes, it is.",
    "options": [
      "Can",
      "Is",
      "Are"
    ],
    "answer": 1,
    "explanation": "單數指示代名詞 that 搭配 Be 動詞「Is」。"
  },
  {
    "id": "hwg_b2_423",
    "book": 2,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Look! It's a big ______.",
    "options": [
      "dog",
      "swim",
      "tall"
    ],
    "answer": 0,
    "explanation": "冠詞 a 與形容詞 big 後方應接單數動物名詞「dog」。"
  },
  {
    "id": "hwg_b2_424",
    "book": 2,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Is this a dog? B: ______ It's a cat.",
    "options": [
      "Yes, it is.",
      "Yes, I can.",
      "No, it's not."
    ],
    "answer": 2,
    "explanation": "後句說明它是 cat，故否定回答「No, it's not.」。"
  },
  {
    "id": "hwg_b2_425",
    "book": 2,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Is that your dog? B: ______ It's very cute.",
    "options": [
      "I'm ten.",
      "Yes, it is.",
      "No, I cannot."
    ],
    "answer": 1,
    "explanation": "詢問是否為你的寵物，肯定回答「Yes, it is.」。"
  },
  {
    "id": "hwg_b2_426",
    "book": 2,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: ______ that a cat? B: Yes, it is.",
    "options": [
      "Is",
      "Are",
      "Can"
    ],
    "answer": 0,
    "explanation": "單數指示代名詞 that 搭配 Be 動詞「Is」。"
  },
  {
    "id": "hwg_b2_427",
    "book": 2,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Look! It's a small ______.",
    "options": [
      "swim",
      "tall",
      "cat"
    ],
    "answer": 2,
    "explanation": "冠詞 a 與形容詞 small 後方應接單數動物名詞「cat」。"
  },
  {
    "id": "hwg_b2_428",
    "book": 2,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Is this a cat? B: ______ It's a bird.",
    "options": [
      "Yes, I can.",
      "No, it's not.",
      "Yes, it is."
    ],
    "answer": 1,
    "explanation": "後句說明它是 bird，故否定回答「No, it's not.」。"
  },
  {
    "id": "hwg_b2_429",
    "book": 2,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Is that your cat? B: ______ It's very cute.",
    "options": [
      "Yes, it is.",
      "No, I cannot.",
      "I'm ten."
    ],
    "answer": 0,
    "explanation": "詢問是否為你的寵物，肯定回答「Yes, it is.」。"
  },
  {
    "id": "hwg_b2_430",
    "book": 2,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: ______ that a bird? B: Yes, it is.",
    "options": [
      "Are",
      "Can",
      "Is"
    ],
    "answer": 2,
    "explanation": "單數指示代名詞 that 搭配 Be 動詞「Is」。"
  },
  {
    "id": "hwg_b2_431",
    "book": 2,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Look! It's a big ______.",
    "options": [
      "tall",
      "bird",
      "swim"
    ],
    "answer": 1,
    "explanation": "冠詞 a 與形容詞 big 後方應接單數動物名詞「bird」。"
  },
  {
    "id": "hwg_b2_432",
    "book": 2,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Is this a bird? B: ______ It's a fish.",
    "options": [
      "No, it's not.",
      "Yes, it is.",
      "Yes, I can."
    ],
    "answer": 0,
    "explanation": "後句說明它是 fish，故否定回答「No, it's not.」。"
  },
  {
    "id": "hwg_b2_433",
    "book": 2,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Is that your bird? B: ______ It's very cute.",
    "options": [
      "No, I cannot.",
      "I'm ten.",
      "Yes, it is."
    ],
    "answer": 2,
    "explanation": "詢問是否為你的寵物，肯定回答「Yes, it is.」。"
  },
  {
    "id": "hwg_b2_434",
    "book": 2,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: ______ that a fish? B: Yes, it is.",
    "options": [
      "Can",
      "Is",
      "Are"
    ],
    "answer": 1,
    "explanation": "單數指示代名詞 that 搭配 Be 動詞「Is」。"
  },
  {
    "id": "hwg_b2_435",
    "book": 2,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Look! It's a small ______.",
    "options": [
      "fish",
      "swim",
      "tall"
    ],
    "answer": 0,
    "explanation": "冠詞 a 與形容詞 small 後方應接單數動物名詞「fish」。"
  },
  {
    "id": "hwg_b2_436",
    "book": 2,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Is this a fish? B: ______ It's a rabbit.",
    "options": [
      "Yes, it is.",
      "Yes, I can.",
      "No, it's not."
    ],
    "answer": 2,
    "explanation": "後句說明它是 rabbit，故否定回答「No, it's not.」。"
  },
  {
    "id": "hwg_b2_437",
    "book": 2,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Is that your fish? B: ______ It's very cute.",
    "options": [
      "I'm ten.",
      "Yes, it is.",
      "No, I cannot."
    ],
    "answer": 1,
    "explanation": "詢問是否為你的寵物，肯定回答「Yes, it is.」。"
  },
  {
    "id": "hwg_b2_438",
    "book": 2,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: ______ that a rabbit? B: Yes, it is.",
    "options": [
      "Is",
      "Are",
      "Can"
    ],
    "answer": 0,
    "explanation": "單數指示代名詞 that 搭配 Be 動詞「Is」。"
  },
  {
    "id": "hwg_b2_439",
    "book": 2,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Look! It's a big ______.",
    "options": [
      "swim",
      "tall",
      "rabbit"
    ],
    "answer": 2,
    "explanation": "冠詞 a 與形容詞 big 後方應接單數動物名詞「rabbit」。"
  },
  {
    "id": "hwg_b2_440",
    "book": 2,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Is this a rabbit? B: ______ It's a turtle.",
    "options": [
      "Yes, I can.",
      "No, it's not.",
      "Yes, it is."
    ],
    "answer": 1,
    "explanation": "後句說明它是 turtle，故否定回答「No, it's not.」。"
  },
  {
    "id": "hwg_b2_441",
    "book": 2,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Is that your rabbit? B: ______ It's very cute.",
    "options": [
      "Yes, it is.",
      "No, I cannot.",
      "I'm ten."
    ],
    "answer": 0,
    "explanation": "詢問是否為你的寵物，肯定回答「Yes, it is.」。"
  },
  {
    "id": "hwg_b2_442",
    "book": 2,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: ______ that a turtle? B: Yes, it is.",
    "options": [
      "Are",
      "Can",
      "Is"
    ],
    "answer": 2,
    "explanation": "單數指示代名詞 that 搭配 Be 動詞「Is」。"
  },
  {
    "id": "hwg_b2_443",
    "book": 2,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Look! It's a small ______.",
    "options": [
      "tall",
      "turtle",
      "swim"
    ],
    "answer": 1,
    "explanation": "冠詞 a 與形容詞 small 後方應接單數動物名詞「turtle」。"
  },
  {
    "id": "hwg_b2_444",
    "book": 2,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Is this a turtle? B: ______ It's a dog.",
    "options": [
      "No, it's not.",
      "Yes, it is.",
      "Yes, I can."
    ],
    "answer": 0,
    "explanation": "後句說明它是 dog，故否定回答「No, it's not.」。"
  },
  {
    "id": "hwg_b2_445",
    "book": 2,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Is that your turtle? B: ______ It's very cute.",
    "options": [
      "No, I cannot.",
      "I'm ten.",
      "Yes, it is."
    ],
    "answer": 2,
    "explanation": "詢問是否為你的寵物，肯定回答「Yes, it is.」。"
  },
  {
    "id": "hwg_b2_446",
    "book": 2,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Can you dance? B: Yes, I ______.",
    "options": [
      "do",
      "can",
      "am"
    ],
    "answer": 1,
    "explanation": "以助動詞 Can 提問，肯定簡答使用「Yes, I can.」。"
  },
  {
    "id": "hwg_b2_447",
    "book": 2,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Lucas can ______ very well.",
    "options": [
      "dance",
      "dances",
      "danceing"
    ],
    "answer": 0,
    "explanation": "助動詞 can 後方必須接原形動詞「dance」。"
  },
  {
    "id": "hwg_b2_448",
    "book": 2,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Can Lucas dance? B: ______",
    "options": [
      "Yes, he is.",
      "No, it's not.",
      "Yes, he can."
    ],
    "answer": 2,
    "explanation": "Can 疑問句搭配主詞 Lucas (he)，簡答用「Yes, he can.」。"
  },
  {
    "id": "hwg_b2_449",
    "book": 2,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Can you dance, Leo? B: ______ But I can sing.",
    "options": [
      "It's a dog.",
      "No, I can't.",
      "Yes, I can."
    ],
    "answer": 1,
    "explanation": "後句「But I can sing.（但我會唱歌）」表轉折，故前句為否定「No, I can’t.」。"
  },
  {
    "id": "hwg_b2_450",
    "book": 2,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Can you draw? B: Yes, I ______.",
    "options": [
      "can",
      "am",
      "do"
    ],
    "answer": 0,
    "explanation": "以助動詞 Can 提問，肯定簡答使用「Yes, I can.」。"
  },
  {
    "id": "hwg_b2_451",
    "book": 2,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Nina can ______ very well.",
    "options": [
      "draws",
      "drawing",
      "draw"
    ],
    "answer": 2,
    "explanation": "助動詞 can 後方必須接原形動詞「draw」。"
  },
  {
    "id": "hwg_b2_452",
    "book": 2,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Can Nina draw? B: ______",
    "options": [
      "No, it's not.",
      "Yes, she can.",
      "Yes, she is."
    ],
    "answer": 1,
    "explanation": "Can 疑問句搭配主詞 Nina (she)，簡答用「Yes, she can.」。"
  },
  {
    "id": "hwg_b2_453",
    "book": 2,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Can you draw, Leo? B: ______ But I can sing.",
    "options": [
      "No, I can't.",
      "Yes, I can.",
      "It's a dog."
    ],
    "answer": 0,
    "explanation": "後句「But I can sing.（但我會唱歌）」表轉折，故前句為否定「No, I can’t.」。"
  },
  {
    "id": "hwg_b2_454",
    "book": 2,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Can you jump? B: Yes, I ______.",
    "options": [
      "am",
      "do",
      "can"
    ],
    "answer": 2,
    "explanation": "以助動詞 Can 提問，肯定簡答使用「Yes, I can.」。"
  },
  {
    "id": "hwg_b2_455",
    "book": 2,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Leo can ______ very well.",
    "options": [
      "jumping",
      "jump",
      "jumps"
    ],
    "answer": 1,
    "explanation": "助動詞 can 後方必須接原形動詞「jump」。"
  },
  {
    "id": "hwg_b2_456",
    "book": 2,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Can Leo jump? B: ______",
    "options": [
      "Yes, he can.",
      "Yes, he is.",
      "No, it's not."
    ],
    "answer": 0,
    "explanation": "Can 疑問句搭配主詞 Leo (he)，簡答用「Yes, he can.」。"
  },
  {
    "id": "hwg_b2_457",
    "book": 2,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Can you jump, Leo? B: ______ But I can sing.",
    "options": [
      "Yes, I can.",
      "It's a dog.",
      "No, I can't."
    ],
    "answer": 2,
    "explanation": "後句「But I can sing.（但我會唱歌）」表轉折，故前句為否定「No, I can’t.」。"
  },
  {
    "id": "hwg_b2_458",
    "book": 2,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Can you read? B: Yes, I ______.",
    "options": [
      "do",
      "can",
      "am"
    ],
    "answer": 1,
    "explanation": "以助動詞 Can 提問，肯定簡答使用「Yes, I can.」。"
  },
  {
    "id": "hwg_b2_459",
    "book": 2,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Sophie can ______ very well.",
    "options": [
      "read",
      "reads",
      "reading"
    ],
    "answer": 0,
    "explanation": "助動詞 can 後方必須接原形動詞「read」。"
  },
  {
    "id": "hwg_b2_460",
    "book": 2,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Can Sophie read? B: ______",
    "options": [
      "Yes, she is.",
      "No, it's not.",
      "Yes, she can."
    ],
    "answer": 2,
    "explanation": "Can 疑問句搭配主詞 Sophie (she)，簡答用「Yes, she can.」。"
  },
  {
    "id": "hwg_b2_461",
    "book": 2,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Can you read, Leo? B: ______ But I can sing.",
    "options": [
      "It's a dog.",
      "No, I can't.",
      "Yes, I can."
    ],
    "answer": 1,
    "explanation": "後句「But I can sing.（但我會唱歌）」表轉折，故前句為否定「No, I can’t.」。"
  },
  {
    "id": "hwg_b2_462",
    "book": 2,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Can you sing? B: Yes, I ______.",
    "options": [
      "can",
      "am",
      "do"
    ],
    "answer": 0,
    "explanation": "以助動詞 Can 提問，肯定簡答使用「Yes, I can.」。"
  },
  {
    "id": "hwg_b2_463",
    "book": 2,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Ryan can ______ very well.",
    "options": [
      "sings",
      "singing",
      "sing"
    ],
    "answer": 2,
    "explanation": "助動詞 can 後方必須接原形動詞「sing」。"
  },
  {
    "id": "hwg_b2_464",
    "book": 2,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Can Ryan sing? B: ______",
    "options": [
      "No, it's not.",
      "Yes, he can.",
      "Yes, he is."
    ],
    "answer": 1,
    "explanation": "Can 疑問句搭配主詞 Ryan (he)，簡答用「Yes, he can.」。"
  },
  {
    "id": "hwg_b2_465",
    "book": 2,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Can you sing, Leo? B: ______ But I can sing.",
    "options": [
      "No, I can't.",
      "Yes, I can.",
      "It's a dog."
    ],
    "answer": 0,
    "explanation": "後句「But I can sing.（但我會唱歌）」表轉折，故前句為否定「No, I can’t.」。"
  },
  {
    "id": "hwg_b2_466",
    "book": 2,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Can you swim? B: Yes, I ______.",
    "options": [
      "am",
      "do",
      "can"
    ],
    "answer": 2,
    "explanation": "以助動詞 Can 提問，肯定簡答使用「Yes, I can.」。"
  },
  {
    "id": "hwg_b2_467",
    "book": 2,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Maya can ______ very well.",
    "options": [
      "swiming",
      "swim",
      "swims"
    ],
    "answer": 1,
    "explanation": "助動詞 can 後方必須接原形動詞「swim」。"
  },
  {
    "id": "hwg_b2_468",
    "book": 2,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Can Maya swim? B: ______",
    "options": [
      "Yes, she can.",
      "Yes, she is.",
      "No, it's not."
    ],
    "answer": 0,
    "explanation": "Can 疑問句搭配主詞 Maya (she)，簡答用「Yes, she can.」。"
  },
  {
    "id": "hwg_b2_469",
    "book": 2,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Can you swim, Leo? B: ______ But I can sing.",
    "options": [
      "Yes, I can.",
      "It's a dog.",
      "No, I can't."
    ],
    "answer": 2,
    "explanation": "後句「But I can sing.（但我會唱歌）」表轉折，故前句為否定「No, I can’t.」。"
  },
  {
    "id": "hwg_b2_470",
    "book": 2,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Can you write? B: Yes, I ______.",
    "options": [
      "do",
      "can",
      "am"
    ],
    "answer": 1,
    "explanation": "以助動詞 Can 提問，肯定簡答使用「Yes, I can.」。"
  },
  {
    "id": "hwg_b2_471",
    "book": 2,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Noah can ______ very well.",
    "options": [
      "write",
      "writes",
      "writeing"
    ],
    "answer": 0,
    "explanation": "助動詞 can 後方必須接原形動詞「write」。"
  },
  {
    "id": "hwg_b2_472",
    "book": 2,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Can Noah write? B: ______",
    "options": [
      "Yes, he is.",
      "No, it's not.",
      "Yes, he can."
    ],
    "answer": 2,
    "explanation": "Can 疑問句搭配主詞 Noah (he)，簡答用「Yes, he can.」。"
  },
  {
    "id": "hwg_b2_473",
    "book": 2,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Can you write, Leo? B: ______ But I can sing.",
    "options": [
      "It's a dog.",
      "No, I can't.",
      "Yes, I can."
    ],
    "answer": 1,
    "explanation": "後句「But I can sing.（但我會唱歌）」表轉折，故前句為否定「No, I can’t.」。"
  },
  {
    "id": "hwg_b2_474",
    "book": 2,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: Is that a big dog? B: No, ______ isn't.",
    "options": [
      "it",
      "that",
      "he"
    ],
    "answer": 0,
    "explanation": "主詞為 this/that 時，簡答句代名詞一律用「it」。"
  },
  {
    "id": "hwg_b2_475",
    "book": 2,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: ______ B: Yes, I can. I can dance!",
    "options": [
      "Are you Lucas?",
      "What is that?",
      "Can you dance?"
    ],
    "answer": 2,
    "explanation": "答句為「Yes, I can.」，問句必以助動詞「Can you ...?」開頭。"
  },
  {
    "id": "hwg_b2_476",
    "book": 2,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: Is that a big cat? B: No, ______ isn't.",
    "options": [
      "he",
      "it",
      "that"
    ],
    "answer": 1,
    "explanation": "主詞為 this/that 時，簡答句代名詞一律用「it」。"
  },
  {
    "id": "hwg_b2_477",
    "book": 2,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: ______ B: Yes, I can. I can draw!",
    "options": [
      "Can you draw?",
      "Are you Max?",
      "What is that?"
    ],
    "answer": 0,
    "explanation": "答句為「Yes, I can.」，問句必以助動詞「Can you ...?」開頭。"
  },
  {
    "id": "hwg_b2_478",
    "book": 2,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: Is that a big bird? B: No, ______ isn't.",
    "options": [
      "that",
      "he",
      "it"
    ],
    "answer": 2,
    "explanation": "主詞為 this/that 時，簡答句代名詞一律用「it」。"
  },
  {
    "id": "hwg_b2_479",
    "book": 2,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: ______ B: Yes, I can. I can jump!",
    "options": [
      "What is that?",
      "Can you jump?",
      "Are you Leo?"
    ],
    "answer": 1,
    "explanation": "答句為「Yes, I can.」，問句必以助動詞「Can you ...?」開頭。"
  },
  {
    "id": "hwg_b2_480",
    "book": 2,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: Is that a big fish? B: No, ______ isn't.",
    "options": [
      "it",
      "that",
      "he"
    ],
    "answer": 0,
    "explanation": "主詞為 this/that 時，簡答句代名詞一律用「it」。"
  },
  {
    "id": "hwg_b2_481",
    "book": 2,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: ______ B: Yes, I can. I can read!",
    "options": [
      "Are you Kulas?",
      "What is that?",
      "Can you read?"
    ],
    "answer": 2,
    "explanation": "答句為「Yes, I can.」，問句必以助動詞「Can you ...?」開頭。"
  },
  {
    "id": "hwg_b2_482",
    "book": 2,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: Is that a big rabbit? B: No, ______ isn't.",
    "options": [
      "he",
      "it",
      "that"
    ],
    "answer": 1,
    "explanation": "主詞為 this/that 時，簡答句代名詞一律用「it」。"
  },
  {
    "id": "hwg_b2_483",
    "book": 2,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: ______ B: Yes, I can. I can sing!",
    "options": [
      "Can you sing?",
      "Are you Ryan?",
      "What is that?"
    ],
    "answer": 0,
    "explanation": "答句為「Yes, I can.」，問句必以助動詞「Can you ...?」開頭。"
  },
  {
    "id": "hwg_b2_484",
    "book": 2,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: Is that a big turtle? B: No, ______ isn't.",
    "options": [
      "that",
      "he",
      "it"
    ],
    "answer": 2,
    "explanation": "主詞為 this/that 時，簡答句代名詞一律用「it」。"
  },
  {
    "id": "hwg_b2_485",
    "book": 2,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: ______ B: Yes, I can. I can swim!",
    "options": [
      "What is that?",
      "Can you swim?",
      "Are you Owen?"
    ],
    "answer": 1,
    "explanation": "答句為「Yes, I can.」，問句必以助動詞「Can you ...?」開頭。"
  },
  {
    "id": "hwg_b2_486",
    "book": 2,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ is he? B: He's my father.",
    "options": [
      "Who",
      "What",
      "How"
    ],
    "answer": 0,
    "explanation": "詢問人物身分關係「他／她是誰？」使用疑問詞「Who」。"
  },
  {
    "id": "hwg_b2_487",
    "book": 2,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Who's he? B: ______ my father.",
    "options": [
      "She's",
      "It's",
      "He's"
    ],
    "answer": 2,
    "explanation": "father 性別對應的主詞＋Be動詞為「He's」。"
  },
  {
    "id": "hwg_b2_488",
    "book": 2,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Who is that man? B: ______",
    "options": [
      "Yes, I can.",
      "He's my father.",
      "She's my father."
    ],
    "answer": 1,
    "explanation": "詢問「那位男士是誰？」，回答「He's my father.」。"
  },
  {
    "id": "hwg_b2_489",
    "book": 2,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is he your father? B: ______",
    "options": [
      "Yes, he is.",
      "No, he can't.",
      "It's a bird."
    ],
    "answer": 0,
    "explanation": "以 Is he...? 提問，肯定簡答為「Yes, he is.」。"
  },
  {
    "id": "hwg_b2_490",
    "book": 2,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ is she? B: She's my mother.",
    "options": [
      "What",
      "How",
      "Who"
    ],
    "answer": 2,
    "explanation": "詢問人物身分關係「他／她是誰？」使用疑問詞「Who」。"
  },
  {
    "id": "hwg_b2_491",
    "book": 2,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Who's she? B: ______ my mother.",
    "options": [
      "It's",
      "She's",
      "He's"
    ],
    "answer": 1,
    "explanation": "mother 性別對應的主詞＋Be動詞為「She's」。"
  },
  {
    "id": "hwg_b2_492",
    "book": 2,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Who is that woman? B: ______",
    "options": [
      "She's my mother.",
      "He's my mother.",
      "Yes, I can."
    ],
    "answer": 0,
    "explanation": "詢問「那位女士是誰？」，回答「She's my mother.」。"
  },
  {
    "id": "hwg_b2_493",
    "book": 2,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is she your mother? B: ______",
    "options": [
      "No, she can't.",
      "It's a bird.",
      "Yes, she is."
    ],
    "answer": 2,
    "explanation": "以 Is she...? 提問，肯定簡答為「Yes, she is.」。"
  },
  {
    "id": "hwg_b2_494",
    "book": 2,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ is he? B: He's my brother.",
    "options": [
      "How",
      "Who",
      "What"
    ],
    "answer": 1,
    "explanation": "詢問人物身分關係「他／她是誰？」使用疑問詞「Who」。"
  },
  {
    "id": "hwg_b2_495",
    "book": 2,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Who's he? B: ______ my brother.",
    "options": [
      "He's",
      "She's",
      "It's"
    ],
    "answer": 0,
    "explanation": "brother 性別對應的主詞＋Be動詞為「He's」。"
  },
  {
    "id": "hwg_b2_496",
    "book": 2,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Who is that man? B: ______",
    "options": [
      "She's my brother.",
      "Yes, I can.",
      "He's my brother."
    ],
    "answer": 2,
    "explanation": "詢問「那位男士是誰？」，回答「He's my brother.」。"
  },
  {
    "id": "hwg_b2_497",
    "book": 2,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is he your brother? B: ______",
    "options": [
      "It's a bird.",
      "Yes, he is.",
      "No, he can't."
    ],
    "answer": 1,
    "explanation": "以 Is he...? 提問，肯定簡答為「Yes, he is.」。"
  },
  {
    "id": "hwg_b2_498",
    "book": 2,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ is she? B: She's my sister.",
    "options": [
      "Who",
      "What",
      "How"
    ],
    "answer": 0,
    "explanation": "詢問人物身分關係「他／她是誰？」使用疑問詞「Who」。"
  },
  {
    "id": "hwg_b2_499",
    "book": 2,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Who's she? B: ______ my sister.",
    "options": [
      "He's",
      "It's",
      "She's"
    ],
    "answer": 2,
    "explanation": "sister 性別對應的主詞＋Be動詞為「She's」。"
  },
  {
    "id": "hwg_b2_500",
    "book": 2,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Who is that woman? B: ______",
    "options": [
      "Yes, I can.",
      "She's my sister.",
      "He's my sister."
    ],
    "answer": 1,
    "explanation": "詢問「那位女士是誰？」，回答「She's my sister.」。"
  },
  {
    "id": "hwg_b2_501",
    "book": 2,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is she your sister? B: ______",
    "options": [
      "Yes, she is.",
      "No, she can't.",
      "It's a bird."
    ],
    "answer": 0,
    "explanation": "以 Is she...? 提問，肯定簡答為「Yes, she is.」。"
  },
  {
    "id": "hwg_b2_502",
    "book": 2,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ is he? B: He's my grandfather.",
    "options": [
      "What",
      "How",
      "Who"
    ],
    "answer": 2,
    "explanation": "詢問人物身分關係「他／她是誰？」使用疑問詞「Who」。"
  },
  {
    "id": "hwg_b2_503",
    "book": 2,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Who's he? B: ______ my grandfather.",
    "options": [
      "It's",
      "He's",
      "She's"
    ],
    "answer": 1,
    "explanation": "grandfather 性別對應的主詞＋Be動詞為「He's」。"
  },
  {
    "id": "hwg_b2_504",
    "book": 2,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Who is that man? B: ______",
    "options": [
      "He's my grandfather.",
      "She's my grandfather.",
      "Yes, I can."
    ],
    "answer": 0,
    "explanation": "詢問「那位男士是誰？」，回答「He's my grandfather.」。"
  },
  {
    "id": "hwg_b2_505",
    "book": 2,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is he your grandfather? B: ______",
    "options": [
      "No, he can't.",
      "It's a bird.",
      "Yes, he is."
    ],
    "answer": 2,
    "explanation": "以 Is he...? 提問，肯定簡答為「Yes, he is.」。"
  },
  {
    "id": "hwg_b2_506",
    "book": 2,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ is she? B: She's my grandmother.",
    "options": [
      "How",
      "Who",
      "What"
    ],
    "answer": 1,
    "explanation": "詢問人物身分關係「他／她是誰？」使用疑問詞「Who」。"
  },
  {
    "id": "hwg_b2_507",
    "book": 2,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Who's she? B: ______ my grandmother.",
    "options": [
      "She's",
      "He's",
      "It's"
    ],
    "answer": 0,
    "explanation": "grandmother 性別對應的主詞＋Be動詞為「She's」。"
  },
  {
    "id": "hwg_b2_508",
    "book": 2,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Who is that woman? B: ______",
    "options": [
      "He's my grandmother.",
      "Yes, I can.",
      "She's my grandmother."
    ],
    "answer": 2,
    "explanation": "詢問「那位女士是誰？」，回答「She's my grandmother.」。"
  },
  {
    "id": "hwg_b2_509",
    "book": 2,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is she your grandmother? B: ______",
    "options": [
      "It's a bird.",
      "Yes, she is.",
      "No, she can't."
    ],
    "answer": 1,
    "explanation": "以 Is she...? 提問，肯定簡答為「Yes, she is.」。"
  },
  {
    "id": "hwg_b2_510",
    "book": 2,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "My father is ______ doctor.",
    "options": [
      "a",
      "an",
      "are"
    ],
    "answer": 0,
    "explanation": "單數職業名詞「doctor」為子音開頭，前面需加不定冠詞「a」。"
  },
  {
    "id": "hwg_b2_511",
    "book": 2,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Is Lucas a doctor? B: No, he ______.",
    "options": [
      "not",
      "can't",
      "isn't"
    ],
    "answer": 2,
    "explanation": "Be 動詞 Is 提問，否定簡答使用「No, he isn't.」。"
  },
  {
    "id": "hwg_b2_512",
    "book": 2,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Is Lucas a doctor? B: ______ He's a cook.",
    "options": [
      "Yes, I am.",
      "No, he isn't.",
      "Yes, he is."
    ],
    "answer": 1,
    "explanation": "後句說明職業其實是 cook，故否定回答「No, he isn't.」。"
  },
  {
    "id": "hwg_b2_513",
    "book": 2,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Are you a doctor? B: ______",
    "options": [
      "Yes, I am.",
      "Yes, you are.",
      "No, he is not."
    ],
    "answer": 0,
    "explanation": "問句主詞為「you（你）」，回答主詞應轉換為「I（我）」：「Yes, I am.」。"
  },
  {
    "id": "hwg_b2_514",
    "book": 2,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "My mother is ______ nurse.",
    "options": [
      "an",
      "are",
      "a"
    ],
    "answer": 2,
    "explanation": "單數職業名詞「nurse」為子音開頭，前面需加不定冠詞「a」。"
  },
  {
    "id": "hwg_b2_515",
    "book": 2,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Is Nina a nurse? B: No, she ______.",
    "options": [
      "can't",
      "isn't",
      "not"
    ],
    "answer": 1,
    "explanation": "Be 動詞 Is 提問，否定簡答使用「No, she isn't.」。"
  },
  {
    "id": "hwg_b2_516",
    "book": 2,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Is Nina a nurse? B: ______ She's a driver.",
    "options": [
      "No, she isn't.",
      "Yes, she is.",
      "Yes, I am."
    ],
    "answer": 0,
    "explanation": "後句說明職業其實是 driver，故否定回答「No, she isn't.」。"
  },
  {
    "id": "hwg_b2_517",
    "book": 2,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Are you a nurse? B: ______",
    "options": [
      "Yes, you are.",
      "No, he is not.",
      "Yes, I am."
    ],
    "answer": 2,
    "explanation": "問句主詞為「you（你）」，回答主詞應轉換為「I（我）」：「Yes, I am.」。"
  },
  {
    "id": "hwg_b2_518",
    "book": 2,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "My mother is ______ teacher.",
    "options": [
      "are",
      "a",
      "an"
    ],
    "answer": 1,
    "explanation": "單數職業名詞「teacher」為子音開頭，前面需加不定冠詞「a」。"
  },
  {
    "id": "hwg_b2_519",
    "book": 2,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Is Chloe a teacher? B: No, she ______.",
    "options": [
      "isn't",
      "not",
      "can't"
    ],
    "answer": 0,
    "explanation": "Be 動詞 Is 提問，否定簡答使用「No, she isn't.」。"
  },
  {
    "id": "hwg_b2_520",
    "book": 2,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Is Chloe a teacher? B: ______ She's a doctor.",
    "options": [
      "Yes, she is.",
      "Yes, I am.",
      "No, she isn't."
    ],
    "answer": 2,
    "explanation": "後句說明職業其實是 doctor，故否定回答「No, she isn't.」。"
  },
  {
    "id": "hwg_b2_521",
    "book": 2,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Are you a teacher? B: ______",
    "options": [
      "No, he is not.",
      "Yes, I am.",
      "Yes, you are."
    ],
    "answer": 1,
    "explanation": "問句主詞為「you（你）」，回答主詞應轉換為「I（我）」：「Yes, I am.」。"
  },
  {
    "id": "hwg_b2_522",
    "book": 2,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "My father is ______ student.",
    "options": [
      "a",
      "an",
      "are"
    ],
    "answer": 0,
    "explanation": "單數職業名詞「student」為子音開頭，前面需加不定冠詞「a」。"
  },
  {
    "id": "hwg_b2_523",
    "book": 2,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Is Kulas a student? B: No, he ______.",
    "options": [
      "not",
      "can't",
      "isn't"
    ],
    "answer": 2,
    "explanation": "Be 動詞 Is 提問，否定簡答使用「No, he isn't.」。"
  },
  {
    "id": "hwg_b2_524",
    "book": 2,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Is Kulas a student? B: ______ He's a teacher.",
    "options": [
      "Yes, I am.",
      "No, he isn't.",
      "Yes, he is."
    ],
    "answer": 1,
    "explanation": "後句說明職業其實是 teacher，故否定回答「No, he isn't.」。"
  },
  {
    "id": "hwg_b2_525",
    "book": 2,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Are you a student? B: ______",
    "options": [
      "Yes, I am.",
      "Yes, you are.",
      "No, he is not."
    ],
    "answer": 0,
    "explanation": "問句主詞為「you（你）」，回答主詞應轉換為「I（我）」：「Yes, I am.」。"
  },
  {
    "id": "hwg_b2_526",
    "book": 2,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "My father is ______ driver.",
    "options": [
      "an",
      "are",
      "a"
    ],
    "answer": 2,
    "explanation": "單數職業名詞「driver」為子音開頭，前面需加不定冠詞「a」。"
  },
  {
    "id": "hwg_b2_527",
    "book": 2,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Is Ryan a driver? B: No, he ______.",
    "options": [
      "can't",
      "isn't",
      "not"
    ],
    "answer": 1,
    "explanation": "Be 動詞 Is 提問，否定簡答使用「No, he isn't.」。"
  },
  {
    "id": "hwg_b2_528",
    "book": 2,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Is Ryan a driver? B: ______ He's a nurse.",
    "options": [
      "No, he isn't.",
      "Yes, he is.",
      "Yes, I am."
    ],
    "answer": 0,
    "explanation": "後句說明職業其實是 nurse，故否定回答「No, he isn't.」。"
  },
  {
    "id": "hwg_b2_529",
    "book": 2,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Are you a driver? B: ______",
    "options": [
      "Yes, you are.",
      "No, he is not.",
      "Yes, I am."
    ],
    "answer": 2,
    "explanation": "問句主詞為「you（你）」，回答主詞應轉換為「I（我）」：「Yes, I am.」。"
  },
  {
    "id": "hwg_b2_530",
    "book": 2,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "My mother is ______ cook.",
    "options": [
      "are",
      "a",
      "an"
    ],
    "answer": 1,
    "explanation": "單數職業名詞「cook」為子音開頭，前面需加不定冠詞「a」。"
  },
  {
    "id": "hwg_b2_531",
    "book": 2,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Is Maya a cook? B: No, she ______.",
    "options": [
      "isn't",
      "not",
      "can't"
    ],
    "answer": 0,
    "explanation": "Be 動詞 Is 提問，否定簡答使用「No, she isn't.」。"
  },
  {
    "id": "hwg_b2_532",
    "book": 2,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Is Maya a cook? B: ______ She's a student.",
    "options": [
      "Yes, she is.",
      "Yes, I am.",
      "No, she isn't."
    ],
    "answer": 2,
    "explanation": "後句說明職業其實是 student，故否定回答「No, she isn't.」。"
  },
  {
    "id": "hwg_b2_533",
    "book": 2,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Are you a cook? B: ______",
    "options": [
      "No, he is not.",
      "Yes, I am.",
      "Yes, you are."
    ],
    "answer": 1,
    "explanation": "問句主詞為「you（你）」，回答主詞應轉換為「I（我）」：「Yes, I am.」。"
  },
  {
    "id": "hwg_b2_534",
    "book": 2,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: Who's he? B: He is ______ brother. He's a doctor.",
    "options": [
      "my",
      "I",
      "you"
    ],
    "answer": 0,
    "explanation": "名詞 brother 前須使用所有格代名詞「my」。"
  },
  {
    "id": "hwg_b2_535",
    "book": 2,
    "unit": "Review 2",
    "category": "dialogue",
    "question": "A: Nice to meet you, Emma. B: ______",
    "options": [
      "I'm a student.",
      "Thank you.",
      "Nice to meet you, too."
    ],
    "answer": 2,
    "explanation": "初次見面問候「Nice to meet you.」，回應「Nice to meet you, too.」。"
  },
  {
    "id": "hwg_b2_536",
    "book": 2,
    "unit": "Festival",
    "category": "dialogue",
    "question": "A: Happy Mother's Day, Mom! This card is for you. B: ______",
    "options": [
      "Try again.",
      "Thank you, sweetie! I love you.",
      "No, it's not."
    ],
    "answer": 1,
    "explanation": "送給媽媽母親節卡片，媽媽回應「Thank you, sweetie! I love you.」。"
  },
  {
    "id": "hwg_b2_537",
    "book": 2,
    "unit": "Festival",
    "category": "grammar",
    "question": "I love ______ mother very much.",
    "options": [
      "my",
      "I",
      "she"
    ],
    "answer": 0,
    "explanation": "名詞 mother 前方使用所有格「my」。"
  },
  {
    "id": "hwg_b3_538",
    "book": 3,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: How ______ the weather in Taipei? B: It's sunny.",
    "options": [
      "am",
      "can",
      "is",
      "are"
    ],
    "answer": 2,
    "explanation": "單數不可數名詞 the weather 搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b3_539",
    "book": 3,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: How's the weather today? B: ______ Let's take an umbrella.",
    "options": [
      "They're apples.",
      "It's rainy.",
      "It's sunny and hot.",
      "I'm hungry."
    ],
    "answer": 1,
    "explanation": "後句提到「帶把雨傘（take an umbrella）」，代表天氣下雨「It’s rainy.」。"
  },
  {
    "id": "hwg_b3_540",
    "book": 3,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: How ______ the weather in Tokyo? B: It's rainy.",
    "options": [
      "is",
      "are",
      "am",
      "can"
    ],
    "answer": 0,
    "explanation": "單數不可數名詞 the weather 搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b3_541",
    "book": 3,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: How ______ the weather in London? B: It's windy.",
    "options": [
      "are",
      "am",
      "can",
      "is"
    ],
    "answer": 3,
    "explanation": "單數不可數名詞 the weather 搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b3_542",
    "book": 3,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: How ______ the weather in Sydney? B: It's cloudy.",
    "options": [
      "am",
      "can",
      "is",
      "are"
    ],
    "answer": 2,
    "explanation": "單數不可數名詞 the weather 搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b3_543",
    "book": 3,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: How ______ the weather in New York? B: It's hot.",
    "options": [
      "can",
      "is",
      "are",
      "am"
    ],
    "answer": 1,
    "explanation": "單數不可數名詞 the weather 搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b3_544",
    "book": 3,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: How ______ the weather in Seoul? B: It's cold.",
    "options": [
      "is",
      "are",
      "am",
      "can"
    ],
    "answer": 0,
    "explanation": "單數不可數名詞 the weather 搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b3_545",
    "book": 3,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: How ______ the weather in Taipei? B: It's warm.",
    "options": [
      "are",
      "am",
      "can",
      "is"
    ],
    "answer": 3,
    "explanation": "單數不可數名詞 the weather 搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b3_546",
    "book": 3,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: How ______ the weather in Tokyo? B: It's cool.",
    "options": [
      "am",
      "can",
      "is",
      "are"
    ],
    "answer": 2,
    "explanation": "單數不可數名詞 the weather 搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b3_547",
    "book": 3,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Are you hungry, Lucas? B: Yes, I ______.",
    "options": [
      "do",
      "am",
      "are",
      "is"
    ],
    "answer": 1,
    "explanation": "Are you...? 的肯定簡答為「Yes, I am.」。"
  },
  {
    "id": "hwg_b3_548",
    "book": 3,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Are you hungry? B: Yes, I am. I want to eat some noodles.",
    "options": [
      "Yes, I am.",
      "No, I'm not.",
      "Yes, he is.",
      "It's windy."
    ],
    "answer": 0,
    "explanation": "後句表示想要 eat some noodles，故肯定回答「Yes, I am.」。"
  },
  {
    "id": "hwg_b3_549",
    "book": 3,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Are you thirsty, Max? B: Yes, I ______.",
    "options": [
      "are",
      "is",
      "do",
      "am"
    ],
    "answer": 3,
    "explanation": "Are you...? 的肯定簡答為「Yes, I am.」。"
  },
  {
    "id": "hwg_b3_550",
    "book": 3,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Are you thirsty? B: Yes, I am. I want to drink some juice.",
    "options": [
      "Yes, he is.",
      "It's windy.",
      "Yes, I am.",
      "No, I'm not."
    ],
    "answer": 2,
    "explanation": "後句表示想要 drink some juice，故肯定回答「Yes, I am.」。"
  },
  {
    "id": "hwg_b3_551",
    "book": 3,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Are you tired, Leo? B: Yes, I ______.",
    "options": [
      "do",
      "am",
      "are",
      "is"
    ],
    "answer": 1,
    "explanation": "Are you...? 的肯定簡答為「Yes, I am.」。"
  },
  {
    "id": "hwg_b3_552",
    "book": 3,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Are you tired? B: Yes, I am. I want to take a rest.",
    "options": [
      "Yes, I am.",
      "No, I'm not.",
      "Yes, he is.",
      "It's windy."
    ],
    "answer": 0,
    "explanation": "後句表示想要 take a rest，故肯定回答「Yes, I am.」。"
  },
  {
    "id": "hwg_b3_553",
    "book": 3,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Are you happy, Kulas? B: Yes, I ______.",
    "options": [
      "are",
      "is",
      "do",
      "am"
    ],
    "answer": 3,
    "explanation": "Are you...? 的肯定簡答為「Yes, I am.」。"
  },
  {
    "id": "hwg_b3_554",
    "book": 3,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Are you happy? B: Yes, I am. I want to sing a song.",
    "options": [
      "Yes, he is.",
      "It's windy.",
      "Yes, I am.",
      "No, I'm not."
    ],
    "answer": 2,
    "explanation": "後句表示想要 sing a song，故肯定回答「Yes, I am.」。"
  },
  {
    "id": "hwg_b3_555",
    "book": 3,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Are you sad, Ryan? B: Yes, I ______.",
    "options": [
      "do",
      "am",
      "are",
      "is"
    ],
    "answer": 1,
    "explanation": "Are you...? 的肯定簡答為「Yes, I am.」。"
  },
  {
    "id": "hwg_b3_556",
    "book": 3,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Are you sad? B: Yes, I am. I want to talk to Mom.",
    "options": [
      "Yes, I am.",
      "No, I'm not.",
      "Yes, he is.",
      "It's windy."
    ],
    "answer": 0,
    "explanation": "後句表示想要 talk to Mom，故肯定回答「Yes, I am.」。"
  },
  {
    "id": "hwg_b3_557",
    "book": 3,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Are you full, Owen? B: Yes, I ______.",
    "options": [
      "are",
      "is",
      "do",
      "am"
    ],
    "answer": 3,
    "explanation": "Are you...? 的肯定簡答為「Yes, I am.」。"
  },
  {
    "id": "hwg_b3_558",
    "book": 3,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Are you full? B: Yes, I am. I want to take a walk.",
    "options": [
      "Yes, he is.",
      "It's windy.",
      "Yes, I am.",
      "No, I'm not."
    ],
    "answer": 2,
    "explanation": "後句表示想要 take a walk，故肯定回答「Yes, I am.」。"
  },
  {
    "id": "hwg_b3_559",
    "book": 3,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What are these? B: ______ are apples.",
    "options": [
      "That",
      "They",
      "It",
      "This"
    ],
    "answer": 1,
    "explanation": "詢問複數「What are these?」，回答主詞一律使用「They」。"
  },
  {
    "id": "hwg_b3_560",
    "book": 3,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Are these apples? B: ______ They're sweet and yummy!",
    "options": [
      "Yes, they are.",
      "Yes, it is.",
      "No, they aren't.",
      "It's sunny."
    ],
    "answer": 0,
    "explanation": "後句稱讚香甜好吃，且主詞為複數，故選「Yes, they are.」。"
  },
  {
    "id": "hwg_b3_561",
    "book": 3,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What are those? B: ______ are bananas.",
    "options": [
      "It",
      "This",
      "That",
      "They"
    ],
    "answer": 3,
    "explanation": "詢問複數「What are those?」，回答主詞一律使用「They」。"
  },
  {
    "id": "hwg_b3_562",
    "book": 3,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Are those bananas? B: ______ They're sweet and yummy!",
    "options": [
      "No, they aren't.",
      "It's sunny.",
      "Yes, they are.",
      "Yes, it is."
    ],
    "answer": 2,
    "explanation": "後句稱讚香甜好吃，且主詞為複數，故選「Yes, they are.」。"
  },
  {
    "id": "hwg_b3_563",
    "book": 3,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What are these? B: ______ are oranges.",
    "options": [
      "That",
      "They",
      "It",
      "This"
    ],
    "answer": 1,
    "explanation": "詢問複數「What are these?」，回答主詞一律使用「They」。"
  },
  {
    "id": "hwg_b3_564",
    "book": 3,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Are these oranges? B: ______ They're sweet and yummy!",
    "options": [
      "Yes, they are.",
      "Yes, it is.",
      "No, they aren't.",
      "It's sunny."
    ],
    "answer": 0,
    "explanation": "後句稱讚香甜好吃，且主詞為複數，故選「Yes, they are.」。"
  },
  {
    "id": "hwg_b3_565",
    "book": 3,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What are those? B: ______ are tomatoes.",
    "options": [
      "It",
      "This",
      "That",
      "They"
    ],
    "answer": 3,
    "explanation": "詢問複數「What are those?」，回答主詞一律使用「They」。"
  },
  {
    "id": "hwg_b3_566",
    "book": 3,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Are those tomatoes? B: ______ They're sweet and yummy!",
    "options": [
      "No, they aren't.",
      "It's sunny.",
      "Yes, they are.",
      "Yes, it is."
    ],
    "answer": 2,
    "explanation": "後句稱讚香甜好吃，且主詞為複數，故選「Yes, they are.」。"
  },
  {
    "id": "hwg_b3_567",
    "book": 3,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What are these? B: ______ are hamburgers.",
    "options": [
      "That",
      "They",
      "It",
      "This"
    ],
    "answer": 1,
    "explanation": "詢問複數「What are these?」，回答主詞一律使用「They」。"
  },
  {
    "id": "hwg_b3_568",
    "book": 3,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Are these hamburgers? B: ______ They're sweet and yummy!",
    "options": [
      "Yes, they are.",
      "Yes, it is.",
      "No, they aren't.",
      "It's sunny."
    ],
    "answer": 0,
    "explanation": "後句稱讚香甜好吃，且主詞為複數，故選「Yes, they are.」。"
  },
  {
    "id": "hwg_b3_569",
    "book": 3,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What are those? B: ______ are hot dogs.",
    "options": [
      "It",
      "This",
      "That",
      "They"
    ],
    "answer": 3,
    "explanation": "詢問複數「What are those?」，回答主詞一律使用「They」。"
  },
  {
    "id": "hwg_b3_570",
    "book": 3,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Are those hot dogs? B: ______ They're sweet and yummy!",
    "options": [
      "No, they aren't.",
      "It's sunny.",
      "Yes, they are.",
      "Yes, it is."
    ],
    "answer": 2,
    "explanation": "後句稱讚香甜好吃，且主詞為複數，故選「Yes, they are.」。"
  },
  {
    "id": "hwg_b3_571",
    "book": 3,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What are these? B: ______ are sandwiches.",
    "options": [
      "That",
      "They",
      "It",
      "This"
    ],
    "answer": 1,
    "explanation": "詢問複數「What are these?」，回答主詞一律使用「They」。"
  },
  {
    "id": "hwg_b3_572",
    "book": 3,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Are these sandwiches? B: ______ They're sweet and yummy!",
    "options": [
      "Yes, they are.",
      "Yes, it is.",
      "No, they aren't.",
      "It's sunny."
    ],
    "answer": 0,
    "explanation": "後句稱讚香甜好吃，且主詞為複數，故選「Yes, they are.」。"
  },
  {
    "id": "hwg_b3_573",
    "book": 3,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What are those? B: ______ are cookies.",
    "options": [
      "It",
      "This",
      "That",
      "They"
    ],
    "answer": 3,
    "explanation": "詢問複數「What are those?」，回答主詞一律使用「They」。"
  },
  {
    "id": "hwg_b3_574",
    "book": 3,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Are those cookies? B: ______ They're sweet and yummy!",
    "options": [
      "No, they aren't.",
      "It's sunny.",
      "Yes, they are.",
      "Yes, it is."
    ],
    "answer": 2,
    "explanation": "後句稱讚香甜好吃，且主詞為複數，故選「Yes, they are.」。"
  },
  {
    "id": "hwg_b3_575",
    "book": 3,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: ______ you want some pizza? B: Yes, please.",
    "options": [
      "Can",
      "Do",
      "Are",
      "Is"
    ],
    "answer": 1,
    "explanation": "一般動詞 want 的第二人稱疑問句使用助動詞「Do」。"
  },
  {
    "id": "hwg_b3_576",
    "book": 3,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Do you want some pizza, Emma? B: ______ I want some water.",
    "options": [
      "No, thank you.",
      "Yes, please.",
      "Yes, I am.",
      "They're bananas."
    ],
    "answer": 0,
    "explanation": "後句說「我想要水」，代表婉拒對方的提議，禮貌回答「No, thank you.」。"
  },
  {
    "id": "hwg_b3_577",
    "book": 3,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: ______ you want some juice? B: Yes, please.",
    "options": [
      "Are",
      "Is",
      "Can",
      "Do"
    ],
    "answer": 3,
    "explanation": "一般動詞 want 的第二人稱疑問句使用助動詞「Do」。"
  },
  {
    "id": "hwg_b3_578",
    "book": 3,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Do you want some juice, Nina? B: ______ I want some water.",
    "options": [
      "Yes, I am.",
      "They're bananas.",
      "No, thank you.",
      "Yes, please."
    ],
    "answer": 2,
    "explanation": "後句說「我想要水」，代表婉拒對方的提議，禮貌回答「No, thank you.」。"
  },
  {
    "id": "hwg_b3_579",
    "book": 3,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: ______ you want some milk? B: Yes, please.",
    "options": [
      "Can",
      "Do",
      "Are",
      "Is"
    ],
    "answer": 1,
    "explanation": "一般動詞 want 的第二人稱疑問句使用助動詞「Do」。"
  },
  {
    "id": "hwg_b3_580",
    "book": 3,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Do you want some milk, Chloe? B: ______ I want some water.",
    "options": [
      "No, thank you.",
      "Yes, please.",
      "Yes, I am.",
      "They're bananas."
    ],
    "answer": 0,
    "explanation": "後句說「我想要水」，代表婉拒對方的提議，禮貌回答「No, thank you.」。"
  },
  {
    "id": "hwg_b3_581",
    "book": 3,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: ______ you want some water? B: Yes, please.",
    "options": [
      "Are",
      "Is",
      "Can",
      "Do"
    ],
    "answer": 3,
    "explanation": "一般動詞 want 的第二人稱疑問句使用助動詞「Do」。"
  },
  {
    "id": "hwg_b3_582",
    "book": 3,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Do you want some water, Sophie? B: ______ I want some water.",
    "options": [
      "Yes, I am.",
      "They're bananas.",
      "No, thank you.",
      "Yes, please."
    ],
    "answer": 2,
    "explanation": "後句說「我想要水」，代表婉拒對方的提議，禮貌回答「No, thank you.」。"
  },
  {
    "id": "hwg_b3_583",
    "book": 3,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: ______ you want some cake? B: Yes, please.",
    "options": [
      "Can",
      "Do",
      "Are",
      "Is"
    ],
    "answer": 1,
    "explanation": "一般動詞 want 的第二人稱疑問句使用助動詞「Do」。"
  },
  {
    "id": "hwg_b3_584",
    "book": 3,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Do you want some cake, Hannah? B: ______ I want some water.",
    "options": [
      "No, thank you.",
      "Yes, please.",
      "Yes, I am.",
      "They're bananas."
    ],
    "answer": 0,
    "explanation": "後句說「我想要水」，代表婉拒對方的提議，禮貌回答「No, thank you.」。"
  },
  {
    "id": "hwg_b3_585",
    "book": 3,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: ______ you want some ice cream? B: Yes, please.",
    "options": [
      "Are",
      "Is",
      "Can",
      "Do"
    ],
    "answer": 3,
    "explanation": "一般動詞 want 的第二人稱疑問句使用助動詞「Do」。"
  },
  {
    "id": "hwg_b3_586",
    "book": 3,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Do you want some ice cream, Maya? B: ______ I want some water.",
    "options": [
      "Yes, I am.",
      "They're bananas.",
      "No, thank you.",
      "Yes, please."
    ],
    "answer": 2,
    "explanation": "後句說「我想要水」，代表婉拒對方的提議，禮貌回答「No, thank you.」。"
  },
  {
    "id": "hwg_b3_587",
    "book": 3,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: ______ you want some soup? B: Yes, please.",
    "options": [
      "Can",
      "Do",
      "Are",
      "Is"
    ],
    "answer": 1,
    "explanation": "一般動詞 want 的第二人稱疑問句使用助動詞「Do」。"
  },
  {
    "id": "hwg_b3_588",
    "book": 3,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Do you want some soup, Lily? B: ______ I want some water.",
    "options": [
      "No, thank you.",
      "Yes, please.",
      "Yes, I am.",
      "They're bananas."
    ],
    "answer": 0,
    "explanation": "後句說「我想要水」，代表婉拒對方的提議，禮貌回答「No, thank you.」。"
  },
  {
    "id": "hwg_b3_589",
    "book": 3,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: ______ you want some tea? B: Yes, please.",
    "options": [
      "Are",
      "Is",
      "Can",
      "Do"
    ],
    "answer": 3,
    "explanation": "一般動詞 want 的第二人稱疑問句使用助動詞「Do」。"
  },
  {
    "id": "hwg_b3_590",
    "book": 3,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Do you want some tea, Ava? B: ______ I want some water.",
    "options": [
      "Yes, I am.",
      "They're bananas.",
      "No, thank you.",
      "Yes, please."
    ],
    "answer": 2,
    "explanation": "後句說「我想要水」，代表婉拒對方的提議，禮貌回答「No, thank you.」。"
  },
  {
    "id": "hwg_b4_591",
    "book": 4,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "It's seven o'clock. Time ______ breakfast!",
    "options": [
      "in",
      "for",
      "to",
      "at"
    ],
    "answer": 1,
    "explanation": "名詞「breakfast」前使用「Time for + 名詞」表示該是……的時間了。"
  },
  {
    "id": "hwg_b4_592",
    "book": 4,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Excuse me. What time is it? B: ______",
    "options": [
      "It's seven o'clock.",
      "It's under the chair.",
      "I'm reading.",
      "Yes, it is."
    ],
    "answer": 0,
    "explanation": "詢問時間「What time is it?」，回答「It’s + 時間.」。"
  },
  {
    "id": "hwg_b4_593",
    "book": 4,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: ______ time is it now? B: It's seven o'clock.",
    "options": [
      "How",
      "Where",
      "Who",
      "What"
    ],
    "answer": 3,
    "explanation": "詢問幾點鐘使用疑問詞「What time」。"
  },
  {
    "id": "hwg_b4_594",
    "book": 4,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "It's twelve o'clock. Time ______ lunch!",
    "options": [
      "at",
      "in",
      "for",
      "to"
    ],
    "answer": 2,
    "explanation": "名詞「lunch」前使用「Time for + 名詞」表示該是……的時間了。"
  },
  {
    "id": "hwg_b4_595",
    "book": 4,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Excuse me. What time is it? B: ______",
    "options": [
      "Yes, it is.",
      "It's twelve o'clock.",
      "It's under the chair.",
      "I'm reading."
    ],
    "answer": 1,
    "explanation": "詢問時間「What time is it?」，回答「It’s + 時間.」。"
  },
  {
    "id": "hwg_b4_596",
    "book": 4,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: ______ time is it now? B: It's twelve o'clock.",
    "options": [
      "What",
      "How",
      "Where",
      "Who"
    ],
    "answer": 0,
    "explanation": "詢問幾點鐘使用疑問詞「What time」。"
  },
  {
    "id": "hwg_b4_597",
    "book": 4,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "It's six thirty. Time ______ dinner!",
    "options": [
      "to",
      "at",
      "in",
      "for"
    ],
    "answer": 3,
    "explanation": "名詞「dinner」前使用「Time for + 名詞」表示該是……的時間了。"
  },
  {
    "id": "hwg_b4_598",
    "book": 4,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Excuse me. What time is it? B: ______",
    "options": [
      "I'm reading.",
      "Yes, it is.",
      "It's six thirty.",
      "It's under the chair."
    ],
    "answer": 2,
    "explanation": "詢問時間「What time is it?」，回答「It’s + 時間.」。"
  },
  {
    "id": "hwg_b4_599",
    "book": 4,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: ______ time is it now? B: It's six thirty.",
    "options": [
      "Who",
      "What",
      "How",
      "Where"
    ],
    "answer": 1,
    "explanation": "詢問幾點鐘使用疑問詞「What time」。"
  },
  {
    "id": "hwg_b4_600",
    "book": 4,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "It's nine thirty. Time ______ bed!",
    "options": [
      "for",
      "to",
      "at",
      "in"
    ],
    "answer": 0,
    "explanation": "名詞「bed」前使用「Time for + 名詞」表示該是……的時間了。"
  },
  {
    "id": "hwg_b4_601",
    "book": 4,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Excuse me. What time is it? B: ______",
    "options": [
      "It's under the chair.",
      "I'm reading.",
      "Yes, it is.",
      "It's nine thirty."
    ],
    "answer": 3,
    "explanation": "詢問時間「What time is it?」，回答「It’s + 時間.」。"
  },
  {
    "id": "hwg_b4_602",
    "book": 4,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: ______ time is it now? B: It's nine thirty.",
    "options": [
      "Where",
      "Who",
      "What",
      "How"
    ],
    "answer": 2,
    "explanation": "詢問幾點鐘使用疑問詞「What time」。"
  },
  {
    "id": "hwg_b4_603",
    "book": 4,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "It's eight o'clock. Time ______ school!",
    "options": [
      "in",
      "for",
      "to",
      "at"
    ],
    "answer": 1,
    "explanation": "名詞「school」前使用「Time for + 名詞」表示該是……的時間了。"
  },
  {
    "id": "hwg_b4_604",
    "book": 4,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Excuse me. What time is it? B: ______",
    "options": [
      "It's eight o'clock.",
      "It's under the chair.",
      "I'm reading.",
      "Yes, it is."
    ],
    "answer": 0,
    "explanation": "詢問時間「What time is it?」，回答「It’s + 時間.」。"
  },
  {
    "id": "hwg_b4_605",
    "book": 4,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: ______ time is it now? B: It's eight o'clock.",
    "options": [
      "How",
      "Where",
      "Who",
      "What"
    ],
    "answer": 3,
    "explanation": "詢問幾點鐘使用疑問詞「What time」。"
  },
  {
    "id": "hwg_b4_606",
    "book": 4,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "It's four fifteen. Time ______ home!",
    "options": [
      "at",
      "in",
      "for",
      "to"
    ],
    "answer": 2,
    "explanation": "名詞「home」前使用「Time for + 名詞」表示該是……的時間了。"
  },
  {
    "id": "hwg_b4_607",
    "book": 4,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Excuse me. What time is it? B: ______",
    "options": [
      "Yes, it is.",
      "It's four fifteen.",
      "It's under the chair.",
      "I'm reading."
    ],
    "answer": 1,
    "explanation": "詢問時間「What time is it?」，回答「It’s + 時間.」。"
  },
  {
    "id": "hwg_b4_608",
    "book": 4,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: ______ time is it now? B: It's four fifteen.",
    "options": [
      "What",
      "How",
      "Where",
      "Who"
    ],
    "answer": 0,
    "explanation": "詢問幾點鐘使用疑問詞「What time」。"
  },
  {
    "id": "hwg_b4_609",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Look! Lucas is ______ in the kitchen.",
    "options": [
      "cook",
      "cooks",
      "to cook",
      "cooking"
    ],
    "answer": 3,
    "explanation": "Be 動詞 is 後方須接現在分詞 V-ing「cooking」表示正在進行的動作。"
  },
  {
    "id": "hwg_b4_610",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: What ______ Emma doing? B: She is cooking.",
    "options": [
      "am",
      "does",
      "is",
      "are"
    ],
    "answer": 2,
    "explanation": "第三人稱單數主詞 Emma 在現在進行式疑問句中搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b4_611",
    "book": 4,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What are you doing, Lucas? B: ______",
    "options": [
      "It's ten o'clock.",
      "I'm cooking.",
      "He's cooking.",
      "I can cook."
    ],
    "answer": 1,
    "explanation": "問句問「你正在做什麼（What are you doing?）」，回答「I’m + V-ing.」。"
  },
  {
    "id": "hwg_b4_612",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Look! Max is ______ in the dining room.",
    "options": [
      "eating",
      "eat",
      "eats",
      "to eat"
    ],
    "answer": 0,
    "explanation": "Be 動詞 is 後方須接現在分詞 V-ing「eating」表示正在進行的動作。"
  },
  {
    "id": "hwg_b4_613",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: What ______ Nina doing? B: She is eating.",
    "options": [
      "are",
      "am",
      "does",
      "is"
    ],
    "answer": 3,
    "explanation": "第三人稱單數主詞 Nina 在現在進行式疑問句中搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b4_614",
    "book": 4,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What are you doing, Max? B: ______",
    "options": [
      "I can eat.",
      "It's ten o'clock.",
      "I'm eating.",
      "He's eating."
    ],
    "answer": 2,
    "explanation": "問句問「你正在做什麼（What are you doing?）」，回答「I’m + V-ing.」。"
  },
  {
    "id": "hwg_b4_615",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Look! Leo is ______ in the bedroom.",
    "options": [
      "to sleep",
      "sleeping",
      "sleep",
      "sleeps"
    ],
    "answer": 1,
    "explanation": "Be 動詞 is 後方須接現在分詞 V-ing「sleeping」表示正在進行的動作。"
  },
  {
    "id": "hwg_b4_616",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: What ______ Chloe doing? B: She is sleeping.",
    "options": [
      "is",
      "are",
      "am",
      "does"
    ],
    "answer": 0,
    "explanation": "第三人稱單數主詞 Chloe 在現在進行式疑問句中搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b4_617",
    "book": 4,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What are you doing, Leo? B: ______",
    "options": [
      "He's sleeping.",
      "I can sleep.",
      "It's ten o'clock.",
      "I'm sleeping."
    ],
    "answer": 3,
    "explanation": "問句問「你正在做什麼（What are you doing?）」，回答「I’m + V-ing.」。"
  },
  {
    "id": "hwg_b4_618",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Look! Kulas is ______ in the living room.",
    "options": [
      "reads",
      "to read",
      "reading",
      "read"
    ],
    "answer": 2,
    "explanation": "Be 動詞 is 後方須接現在分詞 V-ing「reading」表示正在進行的動作。"
  },
  {
    "id": "hwg_b4_619",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: What ______ Sophie doing? B: She is reading.",
    "options": [
      "does",
      "is",
      "are",
      "am"
    ],
    "answer": 1,
    "explanation": "第三人稱單數主詞 Sophie 在現在進行式疑問句中搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b4_620",
    "book": 4,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What are you doing, Kulas? B: ______",
    "options": [
      "I'm reading.",
      "He's reading.",
      "I can read.",
      "It's ten o'clock."
    ],
    "answer": 0,
    "explanation": "問句問「你正在做什麼（What are you doing?）」，回答「I’m + V-ing.」。"
  },
  {
    "id": "hwg_b4_621",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Look! Ryan is ______ in the pool.",
    "options": [
      "swim",
      "swims",
      "to swim",
      "swimming"
    ],
    "answer": 3,
    "explanation": "Be 動詞 is 後方須接現在分詞 V-ing「swimming」表示正在進行的動作。"
  },
  {
    "id": "hwg_b4_622",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: What ______ Hannah doing? B: She is swimming.",
    "options": [
      "am",
      "does",
      "is",
      "are"
    ],
    "answer": 2,
    "explanation": "第三人稱單數主詞 Hannah 在現在進行式疑問句中搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b4_623",
    "book": 4,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What are you doing, Ryan? B: ______",
    "options": [
      "It's ten o'clock.",
      "I'm swimming.",
      "He's swimming.",
      "I can swim."
    ],
    "answer": 1,
    "explanation": "問句問「你正在做什麼（What are you doing?）」，回答「I’m + V-ing.」。"
  },
  {
    "id": "hwg_b4_624",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Look! Owen is ______ in the yard.",
    "options": [
      "running",
      "run",
      "runs",
      "to run"
    ],
    "answer": 0,
    "explanation": "Be 動詞 is 後方須接現在分詞 V-ing「running」表示正在進行的動作。"
  },
  {
    "id": "hwg_b4_625",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: What ______ Maya doing? B: She is running.",
    "options": [
      "are",
      "am",
      "does",
      "is"
    ],
    "answer": 3,
    "explanation": "第三人稱單數主詞 Maya 在現在進行式疑問句中搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b4_626",
    "book": 4,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What are you doing, Owen? B: ______",
    "options": [
      "I can run.",
      "It's ten o'clock.",
      "I'm running.",
      "He's running."
    ],
    "answer": 2,
    "explanation": "問句問「你正在做什麼（What are you doing?）」，回答「I’m + V-ing.」。"
  },
  {
    "id": "hwg_b4_627",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Look! Noah is ______ at the desk.",
    "options": [
      "to write",
      "writing",
      "write",
      "writes"
    ],
    "answer": 1,
    "explanation": "Be 動詞 is 後方須接現在分詞 V-ing「writing」表示正在進行的動作。"
  },
  {
    "id": "hwg_b4_628",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: What ______ Lily doing? B: She is writing.",
    "options": [
      "is",
      "are",
      "am",
      "does"
    ],
    "answer": 0,
    "explanation": "第三人稱單數主詞 Lily 在現在進行式疑問句中搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b4_629",
    "book": 4,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What are you doing, Noah? B: ______",
    "options": [
      "He's writing.",
      "I can write.",
      "It's ten o'clock.",
      "I'm writing."
    ],
    "answer": 3,
    "explanation": "問句問「你正在做什麼（What are you doing?）」，回答「I’m + V-ing.」。"
  },
  {
    "id": "hwg_b4_630",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Look! Alex is ______ some milk.",
    "options": [
      "drinks",
      "to drink",
      "drinking",
      "drink"
    ],
    "answer": 2,
    "explanation": "Be 動詞 is 後方須接現在分詞 V-ing「drinking」表示正在進行的動作。"
  },
  {
    "id": "hwg_b4_631",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: What ______ Ava doing? B: She is drinking.",
    "options": [
      "does",
      "is",
      "are",
      "am"
    ],
    "answer": 1,
    "explanation": "第三人稱單數主詞 Ava 在現在進行式疑問句中搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b4_632",
    "book": 4,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What are you doing, Alex? B: ______",
    "options": [
      "I'm drinking.",
      "He's drinking.",
      "I can drink.",
      "It's ten o'clock."
    ],
    "answer": 0,
    "explanation": "問句問「你正在做什麼（What are you doing?）」，回答「I’m + V-ing.」。"
  },
  {
    "id": "hwg_b4_633",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Look! Ethan is ______ a picture.",
    "options": [
      "draw",
      "draws",
      "to draw",
      "drawing"
    ],
    "answer": 3,
    "explanation": "Be 動詞 is 後方須接現在分詞 V-ing「drawing」表示正在進行的動作。"
  },
  {
    "id": "hwg_b4_634",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: What ______ Bella doing? B: She is drawing.",
    "options": [
      "am",
      "does",
      "is",
      "are"
    ],
    "answer": 2,
    "explanation": "第三人稱單數主詞 Bella 在現在進行式疑問句中搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b4_635",
    "book": 4,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What are you doing, Ethan? B: ______",
    "options": [
      "It's ten o'clock.",
      "I'm drawing.",
      "He's drawing.",
      "I can draw."
    ],
    "answer": 1,
    "explanation": "問句問「你正在做什麼（What are you doing?）」，回答「I’m + V-ing.」。"
  },
  {
    "id": "hwg_b4_636",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Look! Dylan is ______ in the room.",
    "options": [
      "dancing",
      "dance",
      "dances",
      "to dance"
    ],
    "answer": 0,
    "explanation": "Be 動詞 is 後方須接現在分詞 V-ing「dancing」表示正在進行的動作。"
  },
  {
    "id": "hwg_b4_637",
    "book": 4,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: What ______ Uma doing? B: She is dancing.",
    "options": [
      "are",
      "am",
      "does",
      "is"
    ],
    "answer": 3,
    "explanation": "第三人稱單數主詞 Uma 在現在進行式疑問句中搭配 Be 動詞「is」。"
  },
  {
    "id": "hwg_b4_638",
    "book": 4,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What are you doing, Dylan? B: ______",
    "options": [
      "I can dance.",
      "It's ten o'clock.",
      "I'm dancing.",
      "He's dancing."
    ],
    "answer": 2,
    "explanation": "問句問「你正在做什麼（What are you doing?）」，回答「I’m + V-ing.」。"
  },
  {
    "id": "hwg_b4_639",
    "book": 4,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ is Lucas? B: He's in the bedroom.",
    "options": [
      "How",
      "Where",
      "What",
      "Who"
    ],
    "answer": 1,
    "explanation": "答句「in the bedroom」為所在房間位置，故疑問詞用「Where」。"
  },
  {
    "id": "hwg_b4_640",
    "book": 4,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "Emma is reading ______ the bedroom.",
    "options": [
      "in",
      "on",
      "under",
      "to"
    ],
    "answer": 0,
    "explanation": "表示在某個房間或院子裡使用介系詞「in the bedroom」。"
  },
  {
    "id": "hwg_b4_641",
    "book": 4,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is your brother in the bedroom? B: ______ He's in the kitchen.",
    "options": [
      "Yes, he is.",
      "No, she isn't.",
      "He is cooking.",
      "No, he isn't."
    ],
    "answer": 3,
    "explanation": "後句說明他在廚房，因此不在該房間，選否定「No, he isn’t.」。"
  },
  {
    "id": "hwg_b4_642",
    "book": 4,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ is Max? B: He's in the bathroom.",
    "options": [
      "Who",
      "How",
      "Where",
      "What"
    ],
    "answer": 2,
    "explanation": "答句「in the bathroom」為所在房間位置，故疑問詞用「Where」。"
  },
  {
    "id": "hwg_b4_643",
    "book": 4,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "Nina is reading ______ the bathroom.",
    "options": [
      "to",
      "in",
      "on",
      "under"
    ],
    "answer": 1,
    "explanation": "表示在某個房間或院子裡使用介系詞「in the bathroom」。"
  },
  {
    "id": "hwg_b4_644",
    "book": 4,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is your brother in the bathroom? B: ______ He's in the kitchen.",
    "options": [
      "No, he isn't.",
      "Yes, he is.",
      "No, she isn't.",
      "He is cooking."
    ],
    "answer": 0,
    "explanation": "後句說明他在廚房，因此不在該房間，選否定「No, he isn’t.」。"
  },
  {
    "id": "hwg_b4_645",
    "book": 4,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ is Leo? B: He's in the living room.",
    "options": [
      "What",
      "Who",
      "How",
      "Where"
    ],
    "answer": 3,
    "explanation": "答句「in the living room」為所在房間位置，故疑問詞用「Where」。"
  },
  {
    "id": "hwg_b4_646",
    "book": 4,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "Chloe is reading ______ the living room.",
    "options": [
      "under",
      "to",
      "in",
      "on"
    ],
    "answer": 2,
    "explanation": "表示在某個房間或院子裡使用介系詞「in the living room」。"
  },
  {
    "id": "hwg_b4_647",
    "book": 4,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is your brother in the living room? B: ______ He's in the kitchen.",
    "options": [
      "He is cooking.",
      "No, he isn't.",
      "Yes, he is.",
      "No, she isn't."
    ],
    "answer": 1,
    "explanation": "後句說明他在廚房，因此不在該房間，選否定「No, he isn’t.」。"
  },
  {
    "id": "hwg_b4_648",
    "book": 4,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ is Kulas? B: He's in the dining room.",
    "options": [
      "Where",
      "What",
      "Who",
      "How"
    ],
    "answer": 0,
    "explanation": "答句「in the dining room」為所在房間位置，故疑問詞用「Where」。"
  },
  {
    "id": "hwg_b4_649",
    "book": 4,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "Sophie is reading ______ the dining room.",
    "options": [
      "on",
      "under",
      "to",
      "in"
    ],
    "answer": 3,
    "explanation": "表示在某個房間或院子裡使用介系詞「in the dining room」。"
  },
  {
    "id": "hwg_b4_650",
    "book": 4,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is your brother in the dining room? B: ______ He's in the kitchen.",
    "options": [
      "No, she isn't.",
      "He is cooking.",
      "No, he isn't.",
      "Yes, he is."
    ],
    "answer": 2,
    "explanation": "後句說明他在廚房，因此不在該房間，選否定「No, he isn’t.」。"
  },
  {
    "id": "hwg_b4_651",
    "book": 4,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ is Ryan? B: He's in the kitchen.",
    "options": [
      "How",
      "Where",
      "What",
      "Who"
    ],
    "answer": 1,
    "explanation": "答句「in the kitchen」為所在房間位置，故疑問詞用「Where」。"
  },
  {
    "id": "hwg_b4_652",
    "book": 4,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "Hannah is reading ______ the kitchen.",
    "options": [
      "in",
      "on",
      "under",
      "to"
    ],
    "answer": 0,
    "explanation": "表示在某個房間或院子裡使用介系詞「in the kitchen」。"
  },
  {
    "id": "hwg_b4_653",
    "book": 4,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is your brother in the kitchen? B: ______ He's in the kitchen.",
    "options": [
      "Yes, he is.",
      "No, she isn't.",
      "He is cooking.",
      "No, he isn't."
    ],
    "answer": 3,
    "explanation": "後句說明他在廚房，因此不在該房間，選否定「No, he isn’t.」。"
  },
  {
    "id": "hwg_b4_654",
    "book": 4,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ is Owen? B: He's in the yard.",
    "options": [
      "Who",
      "How",
      "Where",
      "What"
    ],
    "answer": 2,
    "explanation": "答句「in the yard」為所在房間位置，故疑問詞用「Where」。"
  },
  {
    "id": "hwg_b4_655",
    "book": 4,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "Maya is reading ______ the yard.",
    "options": [
      "to",
      "in",
      "on",
      "under"
    ],
    "answer": 1,
    "explanation": "表示在某個房間或院子裡使用介系詞「in the yard」。"
  },
  {
    "id": "hwg_b4_656",
    "book": 4,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: Is your brother in the yard? B: ______ He's in the kitchen.",
    "options": [
      "No, he isn't.",
      "Yes, he is.",
      "No, she isn't.",
      "He is cooking."
    ],
    "answer": 0,
    "explanation": "後句說明他在廚房，因此不在該房間，選否定「No, he isn’t.」。"
  },
  {
    "id": "hwg_b4_657",
    "book": 4,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Where is my hat? B: It's on the chair.",
    "options": [
      "are",
      "am",
      "do",
      "is"
    ],
    "answer": 3,
    "explanation": "hat 為單數名詞，Be 動詞搭配「is」。"
  },
  {
    "id": "hwg_b4_658",
    "book": 4,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Where is the hat? B: ______",
    "options": [
      "I'm in the bedroom.",
      "It's twelve thirty.",
      "It's on the chair.",
      "They're on the chair."
    ],
    "answer": 2,
    "explanation": "單數物品應以「It's + 介系詞片語」回答位置。"
  },
  {
    "id": "hwg_b4_659",
    "book": 4,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Where is my bag? B: It's under the desk.",
    "options": [
      "do",
      "is",
      "are",
      "am"
    ],
    "answer": 1,
    "explanation": "bag 為單數名詞，Be 動詞搭配「is」。"
  },
  {
    "id": "hwg_b4_660",
    "book": 4,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Where is the bag? B: ______",
    "options": [
      "It's under the desk.",
      "They're under the desk.",
      "I'm in the bedroom.",
      "It's twelve thirty."
    ],
    "answer": 0,
    "explanation": "單數物品應以「It's + 介系詞片語」回答位置。"
  },
  {
    "id": "hwg_b4_661",
    "book": 4,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Where is my pencil case? B: It's in the box.",
    "options": [
      "are",
      "am",
      "do",
      "is"
    ],
    "answer": 3,
    "explanation": "pencil case 為單數名詞，Be 動詞搭配「is」。"
  },
  {
    "id": "hwg_b4_662",
    "book": 4,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Where is the pencil case? B: ______",
    "options": [
      "I'm in the bedroom.",
      "It's twelve thirty.",
      "It's in the box.",
      "They're in the box."
    ],
    "answer": 2,
    "explanation": "單數物品應以「It's + 介系詞片語」回答位置。"
  },
  {
    "id": "hwg_b4_663",
    "book": 4,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Where is my watch? B: It's on the table.",
    "options": [
      "do",
      "is",
      "are",
      "am"
    ],
    "answer": 1,
    "explanation": "watch 為單數名詞，Be 動詞搭配「is」。"
  },
  {
    "id": "hwg_b4_664",
    "book": 4,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Where is the watch? B: ______",
    "options": [
      "It's on the table.",
      "They're on the table.",
      "I'm in the bedroom.",
      "It's twelve thirty."
    ],
    "answer": 0,
    "explanation": "單數物品應以「It's + 介系詞片語」回答位置。"
  },
  {
    "id": "hwg_b4_665",
    "book": 4,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Where are my keys? B: They're in the bag.",
    "options": [
      "is",
      "am",
      "do",
      "are"
    ],
    "answer": 3,
    "explanation": "keys 為複數名詞，Be 動詞搭配「are」。"
  },
  {
    "id": "hwg_b4_666",
    "book": 4,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Where are the keys? B: ______",
    "options": [
      "I'm in the bedroom.",
      "It's twelve thirty.",
      "They're in the bag.",
      "It's in the bag."
    ],
    "answer": 2,
    "explanation": "複數物品應以「They're + 介系詞片語」回答位置。"
  },
  {
    "id": "hwg_b4_667",
    "book": 4,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Where are my glasses? B: They're on the book.",
    "options": [
      "do",
      "are",
      "is",
      "am"
    ],
    "answer": 1,
    "explanation": "glasses 為複數名詞，Be 動詞搭配「are」。"
  },
  {
    "id": "hwg_b4_668",
    "book": 4,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Where are the glasses? B: ______",
    "options": [
      "They're on the book.",
      "It's on the book.",
      "I'm in the bedroom.",
      "It's twelve thirty."
    ],
    "answer": 0,
    "explanation": "複數物品應以「They're + 介系詞片語」回答位置。"
  },
  {
    "id": "hwg_b4_669",
    "book": 4,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Where are my shoes? B: They're under the bed.",
    "options": [
      "is",
      "am",
      "do",
      "are"
    ],
    "answer": 3,
    "explanation": "shoes 為複數名詞，Be 動詞搭配「are」。"
  },
  {
    "id": "hwg_b4_670",
    "book": 4,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Where are the shoes? B: ______",
    "options": [
      "I'm in the bedroom.",
      "It's twelve thirty.",
      "They're under the bed.",
      "It's under the bed."
    ],
    "answer": 2,
    "explanation": "複數物品應以「They're + 介系詞片語」回答位置。"
  },
  {
    "id": "hwg_b4_671",
    "book": 4,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Where are my socks? B: They're in the box.",
    "options": [
      "do",
      "are",
      "is",
      "am"
    ],
    "answer": 1,
    "explanation": "socks 為複數名詞，Be 動詞搭配「are」。"
  },
  {
    "id": "hwg_b4_672",
    "book": 4,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Where are the socks? B: ______",
    "options": [
      "They're in the box.",
      "It's in the box.",
      "I'm in the bedroom.",
      "It's twelve thirty."
    ],
    "answer": 0,
    "explanation": "複數物品應以「They're + 介系詞片語」回答位置。"
  },
  {
    "id": "hwg_b4_673",
    "book": 4,
    "unit": "Starter",
    "category": "grammar",
    "question": "A: How many desks are there? B: Twenty, twenty-one, ______!",
    "options": [
      "twelve",
      "two",
      "ten",
      "twenty-two"
    ],
    "answer": 3,
    "explanation": "依數字順序：20 (twenty), 21 (twenty-one), 22 (twenty-two)。"
  },
  {
    "id": "hwg_b4_674",
    "book": 4,
    "unit": "Review 1",
    "category": "grammar",
    "question": "It's eight o'clock. Lucas and Emma ______ reading in the living room.",
    "options": [
      "am",
      "can",
      "are",
      "is"
    ],
    "answer": 2,
    "explanation": "兩個人並列為複數主詞，現在進行式搭配 Be 動詞「are」。"
  },
  {
    "id": "hwg_b4_675",
    "book": 4,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: Are you cooking, Lucas? B: ______ I'm doing my homework.",
    "options": [
      "It's nine o'clock.",
      "No, I'm not.",
      "Yes, I am.",
      "No, he isn't."
    ],
    "answer": 1,
    "explanation": "後句說明自己正在寫作業，故否定回答「No, I’m not.」。"
  },
  {
    "id": "hwg_b4_676",
    "book": 4,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: Where are my pencil case? B: Look! ______ under the chair.",
    "options": [
      "They're",
      "It's",
      "He's",
      "She's"
    ],
    "answer": 0,
    "explanation": "複數物品代名詞使用「They’re (They are)」。"
  },
  {
    "id": "hwg_b4_677",
    "book": 4,
    "unit": "Review 2",
    "category": "dialogue",
    "question": "A: Is the hat on the chair? B: ______ Here it is!",
    "options": [
      "Yes, they are.",
      "No, I'm not.",
      "He is in the yard.",
      "Yes, it is."
    ],
    "answer": 3,
    "explanation": "單數物品位置確認，肯定簡答「Yes, it is.」。"
  },
  {
    "id": "hwg_b4_678",
    "book": 4,
    "unit": "Review 1",
    "category": "grammar",
    "question": "It's eight o'clock. Max and Nina ______ reading in the living room.",
    "options": [
      "am",
      "can",
      "are",
      "is"
    ],
    "answer": 2,
    "explanation": "兩個人並列為複數主詞，現在進行式搭配 Be 動詞「are」。"
  },
  {
    "id": "hwg_b4_679",
    "book": 4,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: Are you eating, Max? B: ______ I'm doing my homework.",
    "options": [
      "It's nine o'clock.",
      "No, I'm not.",
      "Yes, I am.",
      "No, he isn't."
    ],
    "answer": 1,
    "explanation": "後句說明自己正在寫作業，故否定回答「No, I’m not.」。"
  },
  {
    "id": "hwg_b4_680",
    "book": 4,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: Where are my watch? B: Look! ______ under the chair.",
    "options": [
      "They're",
      "It's",
      "He's",
      "She's"
    ],
    "answer": 0,
    "explanation": "複數物品代名詞使用「They’re (They are)」。"
  },
  {
    "id": "hwg_b4_681",
    "book": 4,
    "unit": "Review 2",
    "category": "dialogue",
    "question": "A: Is the bag under the desk? B: ______ Here it is!",
    "options": [
      "Yes, they are.",
      "No, I'm not.",
      "He is in the yard.",
      "Yes, it is."
    ],
    "answer": 3,
    "explanation": "單數物品位置確認，肯定簡答「Yes, it is.」。"
  },
  {
    "id": "hwg_b4_682",
    "book": 4,
    "unit": "Review 1",
    "category": "grammar",
    "question": "It's eight o'clock. Leo and Chloe ______ reading in the living room.",
    "options": [
      "am",
      "can",
      "are",
      "is"
    ],
    "answer": 2,
    "explanation": "兩個人並列為複數主詞，現在進行式搭配 Be 動詞「are」。"
  },
  {
    "id": "hwg_b4_683",
    "book": 4,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: Are you sleeping, Leo? B: ______ I'm doing my homework.",
    "options": [
      "It's nine o'clock.",
      "No, I'm not.",
      "Yes, I am.",
      "No, he isn't."
    ],
    "answer": 1,
    "explanation": "後句說明自己正在寫作業，故否定回答「No, I’m not.」。"
  },
  {
    "id": "hwg_b4_684",
    "book": 4,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: Where are my keys? B: Look! ______ under the chair.",
    "options": [
      "They're",
      "It's",
      "He's",
      "She's"
    ],
    "answer": 0,
    "explanation": "複數物品代名詞使用「They’re (They are)」。"
  },
  {
    "id": "hwg_b4_685",
    "book": 4,
    "unit": "Review 2",
    "category": "dialogue",
    "question": "A: Is the pencil case in the box? B: ______ Here it is!",
    "options": [
      "Yes, they are.",
      "No, I'm not.",
      "He is in the yard.",
      "Yes, it is."
    ],
    "answer": 3,
    "explanation": "單數物品位置確認，肯定簡答「Yes, it is.」。"
  },
  {
    "id": "hwg_b4_686",
    "book": 4,
    "unit": "Review 1",
    "category": "grammar",
    "question": "It's eight o'clock. Kulas and Sophie ______ reading in the living room.",
    "options": [
      "am",
      "can",
      "are",
      "is"
    ],
    "answer": 2,
    "explanation": "兩個人並列為複數主詞，現在進行式搭配 Be 動詞「are」。"
  },
  {
    "id": "hwg_b4_687",
    "book": 4,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: Are you reading, Kulas? B: ______ I'm doing my homework.",
    "options": [
      "It's nine o'clock.",
      "No, I'm not.",
      "Yes, I am.",
      "No, he isn't."
    ],
    "answer": 1,
    "explanation": "後句說明自己正在寫作業，故否定回答「No, I’m not.」。"
  },
  {
    "id": "hwg_b4_688",
    "book": 4,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: Where are my glasses? B: Look! ______ under the chair.",
    "options": [
      "They're",
      "It's",
      "He's",
      "She's"
    ],
    "answer": 0,
    "explanation": "複數物品代名詞使用「They’re (They are)」。"
  },
  {
    "id": "hwg_b4_689",
    "book": 4,
    "unit": "Review 2",
    "category": "dialogue",
    "question": "A: Is the watch on the table? B: ______ Here it is!",
    "options": [
      "Yes, they are.",
      "No, I'm not.",
      "He is in the yard.",
      "Yes, it is."
    ],
    "answer": 3,
    "explanation": "單數物品位置確認，肯定簡答「Yes, it is.」。"
  },
  {
    "id": "hwg_b4_690",
    "book": 4,
    "unit": "Review 1",
    "category": "grammar",
    "question": "It's eight o'clock. Ryan and Hannah ______ reading in the living room.",
    "options": [
      "am",
      "can",
      "are",
      "is"
    ],
    "answer": 2,
    "explanation": "兩個人並列為複數主詞，現在進行式搭配 Be 動詞「are」。"
  },
  {
    "id": "hwg_b4_691",
    "book": 4,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: Are you swimming, Ryan? B: ______ I'm doing my homework.",
    "options": [
      "It's nine o'clock.",
      "No, I'm not.",
      "Yes, I am.",
      "No, he isn't."
    ],
    "answer": 1,
    "explanation": "後句說明自己正在寫作業，故否定回答「No, I’m not.」。"
  },
  {
    "id": "hwg_b4_692",
    "book": 4,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: Where are my shoes? B: Look! ______ under the chair.",
    "options": [
      "They're",
      "It's",
      "He's",
      "She's"
    ],
    "answer": 0,
    "explanation": "複數物品代名詞使用「They’re (They are)」。"
  },
  {
    "id": "hwg_b4_693",
    "book": 4,
    "unit": "Review 1",
    "category": "grammar",
    "question": "It's eight o'clock. Owen and Maya ______ reading in the living room.",
    "options": [
      "is",
      "am",
      "can",
      "are"
    ],
    "answer": 3,
    "explanation": "兩個人並列為複數主詞，現在進行式搭配 Be 動詞「are」。"
  },
  {
    "id": "hwg_b4_694",
    "book": 4,
    "unit": "Review 1",
    "category": "dialogue",
    "question": "A: Are you running, Owen? B: ______ I'm doing my homework.",
    "options": [
      "No, he isn't.",
      "It's nine o'clock.",
      "No, I'm not.",
      "Yes, I am."
    ],
    "answer": 2,
    "explanation": "後句說明自己正在寫作業，故否定回答「No, I’m not.」。"
  },
  {
    "id": "hwg_b4_695",
    "book": 4,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: Where are my socks? B: Look! ______ under the chair.",
    "options": [
      "She's",
      "They're",
      "It's",
      "He's"
    ],
    "answer": 1,
    "explanation": "複數物品代名詞使用「They’re (They are)」。"
  },
  {
    "id": "hwg_b4_696",
    "book": 4,
    "unit": "Starter",
    "category": "grammar",
    "question": "Twenty-five, twenty-six, ______, twenty-eight.",
    "options": [
      "twenty-seven",
      "seventeen",
      "seven",
      "thirty"
    ],
    "answer": 0,
    "explanation": "26 與 28 中間的數字為「twenty-seven (27)」。"
  },
  {
    "id": "hwg_b4_697",
    "book": 4,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: Hurry up! It is seven fifty! B: ______",
    "options": [
      "It's under the bed.",
      "Yes, he is.",
      "Thank you.",
      "Oh, no! I'm late for school!"
    ],
    "answer": 3,
    "explanation": "對方催促「快一點！已經七點五十分了！」，回應「糟了！我上學要遲到了！」。"
  },
  {
    "id": "hwg_b4_698",
    "book": 4,
    "unit": "Festival",
    "category": "dialogue",
    "question": "A: Happy Dragon Boat Festival! Do you like rice dumplings? B: ______",
    "options": [
      "No, he isn't.",
      "It's six o'clock.",
      "Yes, I do. They are yummy!",
      "It's under the table."
    ],
    "answer": 2,
    "explanation": "詢問端午節是否喜歡吃粽子（Do you like ...?），肯定回答「Yes, I do.」。"
  },
  {
    "id": "hwg_b4_699",
    "book": 4,
    "unit": "Festival",
    "category": "grammar",
    "question": "Look! They ______ rowing a dragon boat on the river.",
    "options": [
      "do",
      "are",
      "is",
      "am"
    ],
    "answer": 1,
    "explanation": "複數主詞 They 搭配 Be 動詞「are」構成現在進行式。"
  },
  {
    "id": "hwg_b5_700",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Is today Monday? B: Yes, ______ is.",
    "options": [
      "it",
      "today",
      "they",
      "he"
    ],
    "answer": 0,
    "explanation": "詢問今天星期幾（Is today ...?），簡答句主詞一律用代名詞「it」。"
  },
  {
    "id": "hwg_b5_701",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Lucas ______ English class on Monday.",
    "options": [
      "have",
      "having",
      "is",
      "has"
    ],
    "answer": 3,
    "explanation": "第三人稱單數主詞 Lucas 表達「有……課」，一般動詞用「has」。"
  },
  {
    "id": "hwg_b5_702",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Does Lucas ______ English class on Monday? B: Yes, he does.",
    "options": [
      "having",
      "had",
      "have",
      "has"
    ],
    "answer": 2,
    "explanation": "助動詞 Does 之後的主要動詞必須還原為原形「have」。"
  },
  {
    "id": "hwg_b5_703",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Is today Tuesday? B: Yes, ______ is.",
    "options": [
      "he",
      "it",
      "today",
      "they"
    ],
    "answer": 1,
    "explanation": "詢問今天星期幾（Is today ...?），簡答句主詞一律用代名詞「it」。"
  },
  {
    "id": "hwg_b5_704",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Max ______ math class on Tuesday.",
    "options": [
      "has",
      "have",
      "having",
      "is"
    ],
    "answer": 0,
    "explanation": "第三人稱單數主詞 Max 表達「有……課」，一般動詞用「has」。"
  },
  {
    "id": "hwg_b5_705",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Does Max ______ math class on Tuesday? B: Yes, he does.",
    "options": [
      "has",
      "having",
      "had",
      "have"
    ],
    "answer": 3,
    "explanation": "助動詞 Does 之後的主要動詞必須還原為原形「have」。"
  },
  {
    "id": "hwg_b5_706",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Is today Wednesday? B: Yes, ______ is.",
    "options": [
      "they",
      "he",
      "it",
      "today"
    ],
    "answer": 2,
    "explanation": "詢問今天星期幾（Is today ...?），簡答句主詞一律用代名詞「it」。"
  },
  {
    "id": "hwg_b5_707",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Leo ______ music class on Wednesday.",
    "options": [
      "is",
      "has",
      "have",
      "having"
    ],
    "answer": 1,
    "explanation": "第三人稱單數主詞 Leo 表達「有……課」，一般動詞用「has」。"
  },
  {
    "id": "hwg_b5_708",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Does Leo ______ music class on Wednesday? B: Yes, he does.",
    "options": [
      "have",
      "has",
      "having",
      "had"
    ],
    "answer": 0,
    "explanation": "助動詞 Does 之後的主要動詞必須還原為原形「have」。"
  },
  {
    "id": "hwg_b5_709",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Is today Thursday? B: Yes, ______ is.",
    "options": [
      "today",
      "they",
      "he",
      "it"
    ],
    "answer": 3,
    "explanation": "詢問今天星期幾（Is today ...?），簡答句主詞一律用代名詞「it」。"
  },
  {
    "id": "hwg_b5_710",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Kulas ______ art class on Thursday.",
    "options": [
      "having",
      "is",
      "has",
      "have"
    ],
    "answer": 2,
    "explanation": "第三人稱單數主詞 Kulas 表達「有……課」，一般動詞用「has」。"
  },
  {
    "id": "hwg_b5_711",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Does Kulas ______ art class on Thursday? B: Yes, he does.",
    "options": [
      "had",
      "have",
      "has",
      "having"
    ],
    "answer": 1,
    "explanation": "助動詞 Does 之後的主要動詞必須還原為原形「have」。"
  },
  {
    "id": "hwg_b5_712",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Is today Friday? B: Yes, ______ is.",
    "options": [
      "it",
      "today",
      "they",
      "he"
    ],
    "answer": 0,
    "explanation": "詢問今天星期幾（Is today ...?），簡答句主詞一律用代名詞「it」。"
  },
  {
    "id": "hwg_b5_713",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Ryan ______ PE class on Friday.",
    "options": [
      "have",
      "having",
      "is",
      "has"
    ],
    "answer": 3,
    "explanation": "第三人稱單數主詞 Ryan 表達「有……課」，一般動詞用「has」。"
  },
  {
    "id": "hwg_b5_714",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Does Ryan ______ PE class on Friday? B: Yes, he does.",
    "options": [
      "having",
      "had",
      "have",
      "has"
    ],
    "answer": 2,
    "explanation": "助動詞 Does 之後的主要動詞必須還原為原形「have」。"
  },
  {
    "id": "hwg_b5_715",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Is today Saturday? B: Yes, ______ is.",
    "options": [
      "he",
      "it",
      "today",
      "they"
    ],
    "answer": 1,
    "explanation": "詢問今天星期幾（Is today ...?），簡答句主詞一律用代名詞「it」。"
  },
  {
    "id": "hwg_b5_716",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Owen ______ science class on Saturday.",
    "options": [
      "has",
      "have",
      "having",
      "is"
    ],
    "answer": 0,
    "explanation": "第三人稱單數主詞 Owen 表達「有……課」，一般動詞用「has」。"
  },
  {
    "id": "hwg_b5_717",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Does Owen ______ science class on Saturday? B: Yes, he does.",
    "options": [
      "has",
      "having",
      "had",
      "have"
    ],
    "answer": 3,
    "explanation": "助動詞 Does 之後的主要動詞必須還原為原形「have」。"
  },
  {
    "id": "hwg_b5_718",
    "book": 5,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Is today Sunday? B: Yes, ______ is.",
    "options": [
      "they",
      "he",
      "it",
      "today"
    ],
    "answer": 2,
    "explanation": "詢問今天星期幾（Is today ...?），簡答句主詞一律用代名詞「it」。"
  },
  {
    "id": "hwg_b5_719",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Noah ______ social studies class on Sunday.",
    "options": [
      "is",
      "has",
      "have",
      "having"
    ],
    "answer": 1,
    "explanation": "第三人稱單數主詞 Noah 表達「有……課」，一般動詞用「has」。"
  },
  {
    "id": "hwg_b5_720",
    "book": 5,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Does Noah ______ social studies class on Sunday? B: Yes, he does.",
    "options": [
      "have",
      "has",
      "having",
      "had"
    ],
    "answer": 0,
    "explanation": "助動詞 Does 之後的主要動詞必須還原為原形「have」。"
  },
  {
    "id": "hwg_b5_721",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Where is Emma going? B: She ______ going to the library.",
    "options": [
      "are",
      "am",
      "does",
      "is"
    ],
    "answer": 3,
    "explanation": "第三人稱單數主詞 She 搭配「is」形成「is going to the library」。"
  },
  {
    "id": "hwg_b5_722",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Where is Nina going? B: She ______ going to the post office.",
    "options": [
      "am",
      "does",
      "is",
      "are"
    ],
    "answer": 2,
    "explanation": "第三人稱單數主詞 She 搭配「is」形成「is going to the post office」。"
  },
  {
    "id": "hwg_b5_723",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Where is Chloe going? B: She ______ going to the hospital.",
    "options": [
      "does",
      "is",
      "are",
      "am"
    ],
    "answer": 1,
    "explanation": "第三人稱單數主詞 She 搭配「is」形成「is going to the hospital」。"
  },
  {
    "id": "hwg_b5_724",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Where is Sophie going? B: She ______ going to the supermarket.",
    "options": [
      "is",
      "are",
      "am",
      "does"
    ],
    "answer": 0,
    "explanation": "第三人稱單數主詞 She 搭配「is」形成「is going to the supermarket」。"
  },
  {
    "id": "hwg_b5_725",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Where is Hannah going? B: She ______ going to the bookstore.",
    "options": [
      "are",
      "am",
      "does",
      "is"
    ],
    "answer": 3,
    "explanation": "第三人稱單數主詞 She 搭配「is」形成「is going to the bookstore」。"
  },
  {
    "id": "hwg_b5_726",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Where is Maya going? B: She ______ going to the museum.",
    "options": [
      "am",
      "does",
      "is",
      "are"
    ],
    "answer": 2,
    "explanation": "第三人稱單數主詞 She 搭配「is」形成「is going to the museum」。"
  },
  {
    "id": "hwg_b5_727",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Where is Lily going? B: She ______ going to the bank.",
    "options": [
      "does",
      "is",
      "are",
      "am"
    ],
    "answer": 1,
    "explanation": "第三人稱單數主詞 She 搭配「is」形成「is going to the bank」。"
  },
  {
    "id": "hwg_b5_728",
    "book": 5,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: Where is Ava going? B: She ______ going to the park.",
    "options": [
      "is",
      "are",
      "am",
      "does"
    ],
    "answer": 0,
    "explanation": "第三人稱單數主詞 She 搭配「is」形成「is going to the park」。"
  },
  {
    "id": "hwg_b6_729",
    "book": 6,
    "unit": "Starter",
    "category": "grammar",
    "question": "A: What is Lucas doing? B: He ______ playing basketball.",
    "options": [
      "are",
      "does",
      "can",
      "is"
    ],
    "answer": 3,
    "explanation": "單數主詞 He 搭配 Be 動詞「is」形成現在進行式。"
  },
  {
    "id": "hwg_b6_730",
    "book": 6,
    "unit": "Starter",
    "category": "grammar",
    "question": "A: What is Max doing? B: He ______ playing basketball.",
    "options": [
      "does",
      "can",
      "is",
      "are"
    ],
    "answer": 2,
    "explanation": "單數主詞 He 搭配 Be 動詞「is」形成現在進行式。"
  },
  {
    "id": "hwg_b6_731",
    "book": 6,
    "unit": "Starter",
    "category": "grammar",
    "question": "A: What is Leo doing? B: He ______ playing basketball.",
    "options": [
      "can",
      "is",
      "are",
      "does"
    ],
    "answer": 1,
    "explanation": "單數主詞 He 搭配 Be 動詞「is」形成現在進行式。"
  },
  {
    "id": "hwg_b6_732",
    "book": 6,
    "unit": "Starter",
    "category": "grammar",
    "question": "A: What is Kulas doing? B: He ______ playing basketball.",
    "options": [
      "is",
      "are",
      "does",
      "can"
    ],
    "answer": 0,
    "explanation": "單數主詞 He 搭配 Be 動詞「is」形成現在進行式。"
  },
  {
    "id": "hwg_b6_733",
    "book": 6,
    "unit": "Starter",
    "category": "grammar",
    "question": "A: What is Ryan doing? B: He ______ playing basketball.",
    "options": [
      "are",
      "does",
      "can",
      "is"
    ],
    "answer": 3,
    "explanation": "單數主詞 He 搭配 Be 動詞「is」形成現在進行式。"
  },
  {
    "id": "hwg_b6_734",
    "book": 6,
    "unit": "Starter",
    "category": "grammar",
    "question": "A: What is Owen doing? B: He ______ playing basketball.",
    "options": [
      "does",
      "can",
      "is",
      "are"
    ],
    "answer": 2,
    "explanation": "單數主詞 He 搭配 Be 動詞「is」形成現在進行式。"
  },
  {
    "id": "hwg_b6_735",
    "book": 6,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Ouch! My head ______!",
    "options": [
      "is hurt",
      "hurts",
      "hurt",
      "hurting"
    ],
    "answer": 1,
    "explanation": "單數身體部位「My head」作主詞，一般動詞加 -s 為「hurts」。"
  },
  {
    "id": "hwg_b6_736",
    "book": 6,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: What's wrong with Lucas? B: ______",
    "options": [
      "His head hurts.",
      "His head hurt.",
      "He is in the park.",
      "It's his cap."
    ],
    "answer": 0,
    "explanation": "單數部位「His head」搭配單數動詞「hurts」。"
  },
  {
    "id": "hwg_b6_737",
    "book": 6,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Ouch! My right arm ______!",
    "options": [
      "hurt",
      "hurting",
      "is hurt",
      "hurts"
    ],
    "answer": 3,
    "explanation": "單數身體部位「My right arm」作主詞，一般動詞加 -s 為「hurts」。"
  },
  {
    "id": "hwg_b6_738",
    "book": 6,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: What's wrong with Max? B: ______",
    "options": [
      "He is in the park.",
      "It's his cap.",
      "His right arm hurts.",
      "His right arm hurt."
    ],
    "answer": 2,
    "explanation": "單數部位「His right arm」搭配單數動詞「hurts」。"
  },
  {
    "id": "hwg_b6_739",
    "book": 6,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Ouch! My left leg ______!",
    "options": [
      "is hurt",
      "hurts",
      "hurt",
      "hurting"
    ],
    "answer": 1,
    "explanation": "單數身體部位「My left leg」作主詞，一般動詞加 -s 為「hurts」。"
  },
  {
    "id": "hwg_b6_740",
    "book": 6,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: What's wrong with Leo? B: ______",
    "options": [
      "His left leg hurts.",
      "His left leg hurt.",
      "He is in the park.",
      "It's his cap."
    ],
    "answer": 0,
    "explanation": "單數部位「His left leg」搭配單數動詞「hurts」。"
  },
  {
    "id": "hwg_b6_741",
    "book": 6,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Ouch! My right hand ______!",
    "options": [
      "hurt",
      "hurting",
      "is hurt",
      "hurts"
    ],
    "answer": 3,
    "explanation": "單數身體部位「My right hand」作主詞，一般動詞加 -s 為「hurts」。"
  },
  {
    "id": "hwg_b6_742",
    "book": 6,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: What's wrong with Kulas? B: ______",
    "options": [
      "He is in the park.",
      "It's his cap.",
      "His right hand hurts.",
      "His right hand hurt."
    ],
    "answer": 2,
    "explanation": "單數部位「His right hand」搭配單數動詞「hurts」。"
  },
  {
    "id": "hwg_b6_743",
    "book": 6,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Ouch! My left foot ______!",
    "options": [
      "is hurt",
      "hurts",
      "hurt",
      "hurting"
    ],
    "answer": 1,
    "explanation": "單數身體部位「My left foot」作主詞，一般動詞加 -s 為「hurts」。"
  },
  {
    "id": "hwg_b6_744",
    "book": 6,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: What's wrong with Ryan? B: ______",
    "options": [
      "His left foot hurts.",
      "His left foot hurt.",
      "He is in the park.",
      "It's his cap."
    ],
    "answer": 0,
    "explanation": "單數部位「His left foot」搭配單數動詞「hurts」。"
  },
  {
    "id": "hwg_b6_745",
    "book": 6,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Ouch! My neck ______!",
    "options": [
      "hurt",
      "hurting",
      "is hurt",
      "hurts"
    ],
    "answer": 3,
    "explanation": "單數身體部位「My neck」作主詞，一般動詞加 -s 為「hurts」。"
  },
  {
    "id": "hwg_b6_746",
    "book": 6,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: What's wrong with Owen? B: ______",
    "options": [
      "He is in the park.",
      "It's his cap.",
      "His neck hurts.",
      "His neck hurt."
    ],
    "answer": 2,
    "explanation": "單數部位「His neck」搭配單數動詞「hurts」。"
  },
  {
    "id": "hwg_b6_747",
    "book": 6,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Ouch! My back ______!",
    "options": [
      "is hurt",
      "hurts",
      "hurt",
      "hurting"
    ],
    "answer": 1,
    "explanation": "單數身體部位「My back」作主詞，一般動詞加 -s 為「hurts」。"
  },
  {
    "id": "hwg_b6_748",
    "book": 6,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: What's wrong with Noah? B: ______",
    "options": [
      "His back hurts.",
      "His back hurt.",
      "He is in the park.",
      "It's his cap."
    ],
    "answer": 0,
    "explanation": "單數部位「His back」搭配單數動詞「hurts」。"
  },
  {
    "id": "hwg_b6_749",
    "book": 6,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Ouch! My nose ______!",
    "options": [
      "hurt",
      "hurting",
      "is hurt",
      "hurts"
    ],
    "answer": 3,
    "explanation": "單數身體部位「My nose」作主詞，一般動詞加 -s 為「hurts」。"
  },
  {
    "id": "hwg_b6_750",
    "book": 6,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: What's wrong with Alex? B: ______",
    "options": [
      "He is in the park.",
      "It's his cap.",
      "His nose hurts.",
      "His nose hurt."
    ],
    "answer": 2,
    "explanation": "單數部位「His nose」搭配單數動詞「hurts」。"
  },
  {
    "id": "hwg_b6_751",
    "book": 6,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Emma's eyes ______ very much.",
    "options": [
      "are hurt",
      "hurt",
      "hurts",
      "hurting"
    ],
    "answer": 1,
    "explanation": "複數身體部位「eyes」作主詞，一般動詞用原形「hurt」。"
  },
  {
    "id": "hwg_b6_752",
    "book": 6,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Do your eyes hurt? B: ______ I need to see a doctor.",
    "options": [
      "Yes, they do.",
      "Yes, it does.",
      "No, they don't.",
      "Yes, I am."
    ],
    "answer": 0,
    "explanation": "複數部位「your eyes」代名詞用 they，肯定簡答「Yes, they do.」。"
  },
  {
    "id": "hwg_b6_753",
    "book": 6,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Nina's ears ______ very much.",
    "options": [
      "hurts",
      "hurting",
      "are hurt",
      "hurt"
    ],
    "answer": 3,
    "explanation": "複數身體部位「ears」作主詞，一般動詞用原形「hurt」。"
  },
  {
    "id": "hwg_b6_754",
    "book": 6,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Do your ears hurt? B: ______ I need to see a doctor.",
    "options": [
      "No, they don't.",
      "Yes, I am.",
      "Yes, they do.",
      "Yes, it does."
    ],
    "answer": 2,
    "explanation": "複數部位「your ears」代名詞用 they，肯定簡答「Yes, they do.」。"
  },
  {
    "id": "hwg_b6_755",
    "book": 6,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Chloe's hands ______ very much.",
    "options": [
      "are hurt",
      "hurt",
      "hurts",
      "hurting"
    ],
    "answer": 1,
    "explanation": "複數身體部位「hands」作主詞，一般動詞用原形「hurt」。"
  },
  {
    "id": "hwg_b6_756",
    "book": 6,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Do your hands hurt? B: ______ I need to see a doctor.",
    "options": [
      "Yes, they do.",
      "Yes, it does.",
      "No, they don't.",
      "Yes, I am."
    ],
    "answer": 0,
    "explanation": "複數部位「your hands」代名詞用 they，肯定簡答「Yes, they do.」。"
  },
  {
    "id": "hwg_b6_757",
    "book": 6,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Sophie's legs ______ very much.",
    "options": [
      "hurts",
      "hurting",
      "are hurt",
      "hurt"
    ],
    "answer": 3,
    "explanation": "複數身體部位「legs」作主詞，一般動詞用原形「hurt」。"
  },
  {
    "id": "hwg_b6_758",
    "book": 6,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Do your legs hurt? B: ______ I need to see a doctor.",
    "options": [
      "No, they don't.",
      "Yes, I am.",
      "Yes, they do.",
      "Yes, it does."
    ],
    "answer": 2,
    "explanation": "複數部位「your legs」代名詞用 they，肯定簡答「Yes, they do.」。"
  },
  {
    "id": "hwg_b6_759",
    "book": 6,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Hannah's feet ______ very much.",
    "options": [
      "are hurt",
      "hurt",
      "hurts",
      "hurting"
    ],
    "answer": 1,
    "explanation": "複數身體部位「feet」作主詞，一般動詞用原形「hurt」。"
  },
  {
    "id": "hwg_b6_760",
    "book": 6,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Do your feet hurt? B: ______ I need to see a doctor.",
    "options": [
      "Yes, they do.",
      "Yes, it does.",
      "No, they don't.",
      "Yes, I am."
    ],
    "answer": 0,
    "explanation": "複數部位「your feet」代名詞用 they，肯定簡答「Yes, they do.」。"
  },
  {
    "id": "hwg_b6_761",
    "book": 6,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Maya's arms ______ very much.",
    "options": [
      "hurts",
      "hurting",
      "are hurt",
      "hurt"
    ],
    "answer": 3,
    "explanation": "複數身體部位「arms」作主詞，一般動詞用原形「hurt」。"
  },
  {
    "id": "hwg_b6_762",
    "book": 6,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Do your arms hurt? B: ______ I need to see a doctor.",
    "options": [
      "No, they don't.",
      "Yes, I am.",
      "Yes, they do.",
      "Yes, it does."
    ],
    "answer": 2,
    "explanation": "複數部位「your arms」代名詞用 they，肯定簡答「Yes, they do.」。"
  },
  {
    "id": "hwg_b6_763",
    "book": 6,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Lily's knees ______ very much.",
    "options": [
      "are hurt",
      "hurt",
      "hurts",
      "hurting"
    ],
    "answer": 1,
    "explanation": "複數身體部位「knees」作主詞，一般動詞用原形「hurt」。"
  },
  {
    "id": "hwg_b6_764",
    "book": 6,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Do your knees hurt? B: ______ I need to see a doctor.",
    "options": [
      "Yes, they do.",
      "Yes, it does.",
      "No, they don't.",
      "Yes, I am."
    ],
    "answer": 0,
    "explanation": "複數部位「your knees」代名詞用 they，肯定簡答「Yes, they do.」。"
  },
  {
    "id": "hwg_b6_765",
    "book": 6,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Ava's shoulders ______ very much.",
    "options": [
      "hurts",
      "hurting",
      "are hurt",
      "hurt"
    ],
    "answer": 3,
    "explanation": "複數身體部位「shoulders」作主詞，一般動詞用原形「hurt」。"
  },
  {
    "id": "hwg_b6_766",
    "book": 6,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Do your shoulders hurt? B: ______ I need to see a doctor.",
    "options": [
      "No, they don't.",
      "Yes, I am.",
      "Yes, they do.",
      "Yes, it does."
    ],
    "answer": 2,
    "explanation": "複數部位「your shoulders」代名詞用 they，肯定簡答「Yes, they do.」。"
  },
  {
    "id": "hwg_b6_767",
    "book": 6,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Does Lucas have a headache? B: Yes, he ______.",
    "options": [
      "is",
      "does",
      "do",
      "has"
    ],
    "answer": 1,
    "explanation": "以助動詞 Does 提問，肯定簡答使用「Yes, he does.」。"
  },
  {
    "id": "hwg_b6_768",
    "book": 6,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Emma doesn't ______ a headache. She is fine.",
    "options": [
      "have",
      "has",
      "having",
      "had"
    ],
    "answer": 0,
    "explanation": "否定助動詞 doesn't 後方必須接原形動詞「have」。"
  },
  {
    "id": "hwg_b6_769",
    "book": 6,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Do you have a headache? B: ______ I feel great today!",
    "options": [
      "Yes, I do.",
      "No, he doesn't.",
      "I'd like some soup.",
      "No, I don't."
    ],
    "answer": 3,
    "explanation": "後句說「我今天感覺很棒！」，故否定回答「No, I don’t.」。"
  },
  {
    "id": "hwg_b6_770",
    "book": 6,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Does Max have a toothache? B: Yes, he ______.",
    "options": [
      "has",
      "is",
      "does",
      "do"
    ],
    "answer": 2,
    "explanation": "以助動詞 Does 提問，肯定簡答使用「Yes, he does.」。"
  },
  {
    "id": "hwg_b6_771",
    "book": 6,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Nina doesn't ______ a toothache. She is fine.",
    "options": [
      "had",
      "have",
      "has",
      "having"
    ],
    "answer": 1,
    "explanation": "否定助動詞 doesn't 後方必須接原形動詞「have」。"
  },
  {
    "id": "hwg_b6_772",
    "book": 6,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Do you have a toothache? B: ______ I feel great today!",
    "options": [
      "No, I don't.",
      "Yes, I do.",
      "No, he doesn't.",
      "I'd like some soup."
    ],
    "answer": 0,
    "explanation": "後句說「我今天感覺很棒！」，故否定回答「No, I don’t.」。"
  },
  {
    "id": "hwg_b6_773",
    "book": 6,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Does Leo have a stomachache? B: Yes, he ______.",
    "options": [
      "do",
      "has",
      "is",
      "does"
    ],
    "answer": 3,
    "explanation": "以助動詞 Does 提問，肯定簡答使用「Yes, he does.」。"
  },
  {
    "id": "hwg_b6_774",
    "book": 6,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Chloe doesn't ______ a stomachache. She is fine.",
    "options": [
      "having",
      "had",
      "have",
      "has"
    ],
    "answer": 2,
    "explanation": "否定助動詞 doesn't 後方必須接原形動詞「have」。"
  },
  {
    "id": "hwg_b6_775",
    "book": 6,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Do you have a stomachache? B: ______ I feel great today!",
    "options": [
      "I'd like some soup.",
      "No, I don't.",
      "Yes, I do.",
      "No, he doesn't."
    ],
    "answer": 1,
    "explanation": "後句說「我今天感覺很棒！」，故否定回答「No, I don’t.」。"
  },
  {
    "id": "hwg_b6_776",
    "book": 6,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Does Kulas have a fever? B: Yes, he ______.",
    "options": [
      "does",
      "do",
      "has",
      "is"
    ],
    "answer": 0,
    "explanation": "以助動詞 Does 提問，肯定簡答使用「Yes, he does.」。"
  },
  {
    "id": "hwg_b6_777",
    "book": 6,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Sophie doesn't ______ a fever. She is fine.",
    "options": [
      "has",
      "having",
      "had",
      "have"
    ],
    "answer": 3,
    "explanation": "否定助動詞 doesn't 後方必須接原形動詞「have」。"
  },
  {
    "id": "hwg_b6_778",
    "book": 6,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Do you have a fever? B: ______ I feel great today!",
    "options": [
      "No, he doesn't.",
      "I'd like some soup.",
      "No, I don't.",
      "Yes, I do."
    ],
    "answer": 2,
    "explanation": "後句說「我今天感覺很棒！」，故否定回答「No, I don’t.」。"
  },
  {
    "id": "hwg_b6_779",
    "book": 6,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Does Ryan have a runny nose? B: Yes, he ______.",
    "options": [
      "is",
      "does",
      "do",
      "has"
    ],
    "answer": 1,
    "explanation": "以助動詞 Does 提問，肯定簡答使用「Yes, he does.」。"
  },
  {
    "id": "hwg_b6_780",
    "book": 6,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Hannah doesn't ______ a runny nose. She is fine.",
    "options": [
      "have",
      "has",
      "having",
      "had"
    ],
    "answer": 0,
    "explanation": "否定助動詞 doesn't 後方必須接原形動詞「have」。"
  },
  {
    "id": "hwg_b6_781",
    "book": 6,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Do you have a runny nose? B: ______ I feel great today!",
    "options": [
      "Yes, I do.",
      "No, he doesn't.",
      "I'd like some soup.",
      "No, I don't."
    ],
    "answer": 3,
    "explanation": "後句說「我今天感覺很棒！」，故否定回答「No, I don’t.」。"
  },
  {
    "id": "hwg_b6_782",
    "book": 6,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Does Owen have a sore throat? B: Yes, he ______.",
    "options": [
      "has",
      "is",
      "does",
      "do"
    ],
    "answer": 2,
    "explanation": "以助動詞 Does 提問，肯定簡答使用「Yes, he does.」。"
  },
  {
    "id": "hwg_b6_783",
    "book": 6,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Maya doesn't ______ a sore throat. She is fine.",
    "options": [
      "had",
      "have",
      "has",
      "having"
    ],
    "answer": 1,
    "explanation": "否定助動詞 doesn't 後方必須接原形動詞「have」。"
  },
  {
    "id": "hwg_b6_784",
    "book": 6,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Do you have a sore throat? B: ______ I feel great today!",
    "options": [
      "No, I don't.",
      "Yes, I do.",
      "No, he doesn't.",
      "I'd like some soup."
    ],
    "answer": 0,
    "explanation": "後句說「我今天感覺很棒！」，故否定回答「No, I don’t.」。"
  },
  {
    "id": "hwg_b6_785",
    "book": 6,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Does Noah have a cold? B: Yes, he ______.",
    "options": [
      "do",
      "has",
      "is",
      "does"
    ],
    "answer": 3,
    "explanation": "以助動詞 Does 提問，肯定簡答使用「Yes, he does.」。"
  },
  {
    "id": "hwg_b6_786",
    "book": 6,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Lily doesn't ______ a cold. She is fine.",
    "options": [
      "having",
      "had",
      "have",
      "has"
    ],
    "answer": 2,
    "explanation": "否定助動詞 doesn't 後方必須接原形動詞「have」。"
  },
  {
    "id": "hwg_b6_787",
    "book": 6,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: Do you have a cold? B: ______ I feel great today!",
    "options": [
      "I'd like some soup.",
      "No, I don't.",
      "Yes, I do.",
      "No, he doesn't."
    ],
    "answer": 1,
    "explanation": "後句說「我今天感覺很棒！」，故否定回答「No, I don’t.」。"
  },
  {
    "id": "hwg_b6_788",
    "book": 6,
    "unit": "Review 1",
    "category": "grammar",
    "question": "My head ______, and I ______ a fever.",
    "options": [
      "hurts; have",
      "hurt; has",
      "hurts; has",
      "hurt; have"
    ],
    "answer": 0,
    "explanation": "第一空單數部位用「hurts」；第二空主詞 I 搭配原形動詞「have」。"
  },
  {
    "id": "hwg_b6_789",
    "book": 6,
    "unit": "Review 1",
    "category": "grammar",
    "question": "My right arm ______, and I ______ a fever.",
    "options": [
      "hurt; has",
      "hurts; has",
      "hurt; have",
      "hurts; have"
    ],
    "answer": 3,
    "explanation": "第一空單數部位用「hurts」；第二空主詞 I 搭配原形動詞「have」。"
  },
  {
    "id": "hwg_b6_790",
    "book": 6,
    "unit": "Review 1",
    "category": "grammar",
    "question": "My left leg ______, and I ______ a fever.",
    "options": [
      "hurts; has",
      "hurt; have",
      "hurts; have",
      "hurt; has"
    ],
    "answer": 2,
    "explanation": "第一空單數部位用「hurts」；第二空主詞 I 搭配原形動詞「have」。"
  },
  {
    "id": "hwg_b6_791",
    "book": 6,
    "unit": "Review 1",
    "category": "grammar",
    "question": "My right hand ______, and I ______ a fever.",
    "options": [
      "hurt; have",
      "hurts; have",
      "hurt; has",
      "hurts; has"
    ],
    "answer": 1,
    "explanation": "第一空單數部位用「hurts」；第二空主詞 I 搭配原形動詞「have」。"
  },
  {
    "id": "hwg_b6_792",
    "book": 6,
    "unit": "Review 1",
    "category": "grammar",
    "question": "My left foot ______, and I ______ a fever.",
    "options": [
      "hurts; have",
      "hurt; has",
      "hurts; has",
      "hurt; have"
    ],
    "answer": 0,
    "explanation": "第一空單數部位用「hurts」；第二空主詞 I 搭配原形動詞「have」。"
  },
  {
    "id": "hwg_b6_793",
    "book": 6,
    "unit": "Review 1",
    "category": "grammar",
    "question": "My neck ______, and I ______ a fever.",
    "options": [
      "hurt; has",
      "hurts; has",
      "hurt; have",
      "hurts; have"
    ],
    "answer": 3,
    "explanation": "第一空單數部位用「hurts」；第二空主詞 I 搭配原形動詞「have」。"
  },
  {
    "id": "hwg_b6_794",
    "book": 6,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What would Lucas like for breakfast? B: He ______ like some beef noodles.",
    "options": [
      "can",
      "does",
      "would",
      "is"
    ],
    "answer": 2,
    "explanation": "問句使用 would like，答句同樣使用「He would (He’d) like ...」。"
  },
  {
    "id": "hwg_b6_795",
    "book": 6,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ you like some beef noodles for breakfast? B: Yes, please.",
    "options": [
      "What",
      "Would",
      "Are",
      "Can"
    ],
    "answer": 1,
    "explanation": "禮貌詢問對方是否想要某餐點使用「Would you like some ...?」。"
  },
  {
    "id": "hwg_b6_796",
    "book": 6,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What would you like for breakfast? B: ______",
    "options": [
      "I'd like some beef noodles.",
      "Yes, please.",
      "No, I don't.",
      "My leg hurts."
    ],
    "answer": 0,
    "explanation": "What 開頭的疑問句詢問想吃什麼，應具體回答食物「I’d like some ...」。"
  },
  {
    "id": "hwg_b6_797",
    "book": 6,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What would Max like for lunch? B: He ______ like some pork rice.",
    "options": [
      "is",
      "can",
      "does",
      "would"
    ],
    "answer": 3,
    "explanation": "問句使用 would like，答句同樣使用「He would (He’d) like ...」。"
  },
  {
    "id": "hwg_b6_798",
    "book": 6,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ you like some pork rice for lunch? B: Yes, please.",
    "options": [
      "Can",
      "What",
      "Would",
      "Are"
    ],
    "answer": 2,
    "explanation": "禮貌詢問對方是否想要某餐點使用「Would you like some ...?」。"
  },
  {
    "id": "hwg_b6_799",
    "book": 6,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What would you like for lunch? B: ______",
    "options": [
      "My leg hurts.",
      "I'd like some pork rice.",
      "Yes, please.",
      "No, I don't."
    ],
    "answer": 1,
    "explanation": "What 開頭的疑問句詢問想吃什麼，應具體回答食物「I’d like some ...」。"
  },
  {
    "id": "hwg_b6_800",
    "book": 6,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What would Leo like for dinner? B: He ______ like some chicken soup.",
    "options": [
      "would",
      "is",
      "can",
      "does"
    ],
    "answer": 0,
    "explanation": "問句使用 would like，答句同樣使用「He would (He’d) like ...」。"
  },
  {
    "id": "hwg_b6_801",
    "book": 6,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ you like some chicken soup for dinner? B: Yes, please.",
    "options": [
      "Are",
      "Can",
      "What",
      "Would"
    ],
    "answer": 3,
    "explanation": "禮貌詢問對方是否想要某餐點使用「Would you like some ...?」。"
  },
  {
    "id": "hwg_b6_802",
    "book": 6,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What would you like for dinner? B: ______",
    "options": [
      "No, I don't.",
      "My leg hurts.",
      "I'd like some chicken soup.",
      "Yes, please."
    ],
    "answer": 2,
    "explanation": "What 開頭的疑問句詢問想吃什麼，應具體回答食物「I’d like some ...」。"
  },
  {
    "id": "hwg_b6_803",
    "book": 6,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What would Kulas like for breakfast? B: He ______ like some fried rice.",
    "options": [
      "does",
      "would",
      "is",
      "can"
    ],
    "answer": 1,
    "explanation": "問句使用 would like，答句同樣使用「He would (He’d) like ...」。"
  },
  {
    "id": "hwg_b6_804",
    "book": 6,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ you like some fried rice for breakfast? B: Yes, please.",
    "options": [
      "Would",
      "Are",
      "Can",
      "What"
    ],
    "answer": 0,
    "explanation": "禮貌詢問對方是否想要某餐點使用「Would you like some ...?」。"
  },
  {
    "id": "hwg_b6_805",
    "book": 6,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What would you like for breakfast? B: ______",
    "options": [
      "Yes, please.",
      "No, I don't.",
      "My leg hurts.",
      "I'd like some fried rice."
    ],
    "answer": 3,
    "explanation": "What 開頭的疑問句詢問想吃什麼，應具體回答食物「I’d like some ...」。"
  },
  {
    "id": "hwg_b6_806",
    "book": 6,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What would Ryan like for lunch? B: He ______ like some vegetable salad.",
    "options": [
      "can",
      "does",
      "would",
      "is"
    ],
    "answer": 2,
    "explanation": "問句使用 would like，答句同樣使用「He would (He’d) like ...」。"
  },
  {
    "id": "hwg_b6_807",
    "book": 6,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ you like some vegetable salad for lunch? B: Yes, please.",
    "options": [
      "What",
      "Would",
      "Are",
      "Can"
    ],
    "answer": 1,
    "explanation": "禮貌詢問對方是否想要某餐點使用「Would you like some ...?」。"
  },
  {
    "id": "hwg_b6_808",
    "book": 6,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What would you like for lunch? B: ______",
    "options": [
      "I'd like some vegetable salad.",
      "Yes, please.",
      "No, I don't.",
      "My leg hurts."
    ],
    "answer": 0,
    "explanation": "What 開頭的疑問句詢問想吃什麼，應具體回答食物「I’d like some ...」。"
  },
  {
    "id": "hwg_b6_809",
    "book": 6,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What would Owen like for dinner? B: He ______ like some ham sandwiches.",
    "options": [
      "is",
      "can",
      "does",
      "would"
    ],
    "answer": 3,
    "explanation": "問句使用 would like，答句同樣使用「He would (He’d) like ...」。"
  },
  {
    "id": "hwg_b6_810",
    "book": 6,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ you like some ham sandwiches for dinner? B: Yes, please.",
    "options": [
      "Can",
      "What",
      "Would",
      "Are"
    ],
    "answer": 2,
    "explanation": "禮貌詢問對方是否想要某餐點使用「Would you like some ...?」。"
  },
  {
    "id": "hwg_b6_811",
    "book": 6,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What would you like for dinner? B: ______",
    "options": [
      "My leg hurts.",
      "I'd like some ham sandwiches.",
      "Yes, please.",
      "No, I don't."
    ],
    "answer": 1,
    "explanation": "What 開頭的疑問句詢問想吃什麼，應具體回答食物「I’d like some ...」。"
  },
  {
    "id": "hwg_b6_812",
    "book": 6,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What would Noah like for breakfast? B: He ______ like some fish soup.",
    "options": [
      "would",
      "is",
      "can",
      "does"
    ],
    "answer": 0,
    "explanation": "問句使用 would like，答句同樣使用「He would (He’d) like ...」。"
  },
  {
    "id": "hwg_b6_813",
    "book": 6,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ you like some fish soup for breakfast? B: Yes, please.",
    "options": [
      "Are",
      "Can",
      "What",
      "Would"
    ],
    "answer": 3,
    "explanation": "禮貌詢問對方是否想要某餐點使用「Would you like some ...?」。"
  },
  {
    "id": "hwg_b6_814",
    "book": 6,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What would you like for breakfast? B: ______",
    "options": [
      "No, I don't.",
      "My leg hurts.",
      "I'd like some fish soup.",
      "Yes, please."
    ],
    "answer": 2,
    "explanation": "What 開頭的疑問句詢問想吃什麼，應具體回答食物「I’d like some ...」。"
  },
  {
    "id": "hwg_b6_815",
    "book": 6,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: What would Alex like for lunch? B: He ______ like some cheese burgers.",
    "options": [
      "does",
      "would",
      "is",
      "can"
    ],
    "answer": 1,
    "explanation": "問句使用 would like，答句同樣使用「He would (He’d) like ...」。"
  },
  {
    "id": "hwg_b6_816",
    "book": 6,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: ______ you like some cheese burgers for lunch? B: Yes, please.",
    "options": [
      "Would",
      "Are",
      "Can",
      "What"
    ],
    "answer": 0,
    "explanation": "禮貌詢問對方是否想要某餐點使用「Would you like some ...?」。"
  },
  {
    "id": "hwg_b6_817",
    "book": 6,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: What would you like for lunch? B: ______",
    "options": [
      "Yes, please.",
      "No, I don't.",
      "My leg hurts.",
      "I'd like some cheese burgers."
    ],
    "answer": 3,
    "explanation": "What 開頭的疑問句詢問想吃什麼，應具體回答食物「I’d like some ...」。"
  },
  {
    "id": "hwg_b6_818",
    "book": 6,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: ______ backpack is this? B: It's Emma's backpack.",
    "options": [
      "Who's",
      "What",
      "Whose",
      "Who"
    ],
    "answer": 2,
    "explanation": "詢問「誰的backpack」使用疑問所有格「Whose」。"
  },
  {
    "id": "hwg_b6_819",
    "book": 6,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Whose backpack is that on the desk? B: ______",
    "options": [
      "I'd like some rice.",
      "It's Emma's backpack.",
      "They're Emma's backpack.",
      "She is Emma."
    ],
    "answer": 1,
    "explanation": "單數物品 that backpack 回答使用「It's + 人名's + 單數名詞.」。"
  },
  {
    "id": "hwg_b6_820",
    "book": 6,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: ______ umbrella is this? B: It's Nina's umbrella.",
    "options": [
      "Whose",
      "Who",
      "Who's",
      "What"
    ],
    "answer": 0,
    "explanation": "詢問「誰的umbrella」使用疑問所有格「Whose」。"
  },
  {
    "id": "hwg_b6_821",
    "book": 6,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Whose umbrella is that on the desk? B: ______",
    "options": [
      "They're Nina's umbrella.",
      "She is Nina.",
      "I'd like some rice.",
      "It's Nina's umbrella."
    ],
    "answer": 3,
    "explanation": "單數物品 that umbrella 回答使用「It's + 人名's + 單數名詞.」。"
  },
  {
    "id": "hwg_b6_822",
    "book": 6,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: ______ water bottle is this? B: It's Chloe's water bottle.",
    "options": [
      "Who's",
      "What",
      "Whose",
      "Who"
    ],
    "answer": 2,
    "explanation": "詢問「誰的water bottle」使用疑問所有格「Whose」。"
  },
  {
    "id": "hwg_b6_823",
    "book": 6,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Whose water bottle is that on the desk? B: ______",
    "options": [
      "I'd like some rice.",
      "It's Chloe's water bottle.",
      "They're Chloe's water bottle.",
      "She is Chloe."
    ],
    "answer": 1,
    "explanation": "單數物品 that water bottle 回答使用「It's + 人名's + 單數名詞.」。"
  },
  {
    "id": "hwg_b6_824",
    "book": 6,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: ______ cap is this? B: It's Sophie's cap.",
    "options": [
      "Whose",
      "Who",
      "Who's",
      "What"
    ],
    "answer": 0,
    "explanation": "詢問「誰的cap」使用疑問所有格「Whose」。"
  },
  {
    "id": "hwg_b6_825",
    "book": 6,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Whose cap is that on the desk? B: ______",
    "options": [
      "They're Sophie's cap.",
      "She is Sophie.",
      "I'd like some rice.",
      "It's Sophie's cap."
    ],
    "answer": 3,
    "explanation": "單數物品 that cap 回答使用「It's + 人名's + 單數名詞.」。"
  },
  {
    "id": "hwg_b6_826",
    "book": 6,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: ______ workbook is this? B: It's Hannah's workbook.",
    "options": [
      "Who's",
      "What",
      "Whose",
      "Who"
    ],
    "answer": 2,
    "explanation": "詢問「誰的workbook」使用疑問所有格「Whose」。"
  },
  {
    "id": "hwg_b6_827",
    "book": 6,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Whose workbook is that on the desk? B: ______",
    "options": [
      "I'd like some rice.",
      "It's Hannah's workbook.",
      "They're Hannah's workbook.",
      "She is Hannah."
    ],
    "answer": 1,
    "explanation": "單數物品 that workbook 回答使用「It's + 人名's + 單數名詞.」。"
  },
  {
    "id": "hwg_b6_828",
    "book": 6,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: ______ jacket is this? B: It's Maya's jacket.",
    "options": [
      "Whose",
      "Who",
      "Who's",
      "What"
    ],
    "answer": 0,
    "explanation": "詢問「誰的jacket」使用疑問所有格「Whose」。"
  },
  {
    "id": "hwg_b6_829",
    "book": 6,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Whose jacket is that on the desk? B: ______",
    "options": [
      "They're Maya's jacket.",
      "She is Maya.",
      "I'd like some rice.",
      "It's Maya's jacket."
    ],
    "answer": 3,
    "explanation": "單數物品 that jacket 回答使用「It's + 人名's + 單數名詞.」。"
  },
  {
    "id": "hwg_b6_830",
    "book": 6,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: ______ lunchbox is this? B: It's Lily's lunchbox.",
    "options": [
      "Who's",
      "What",
      "Whose",
      "Who"
    ],
    "answer": 2,
    "explanation": "詢問「誰的lunchbox」使用疑問所有格「Whose」。"
  },
  {
    "id": "hwg_b6_831",
    "book": 6,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Whose lunchbox is that on the desk? B: ______",
    "options": [
      "I'd like some rice.",
      "It's Lily's lunchbox.",
      "They're Lily's lunchbox.",
      "She is Lily."
    ],
    "answer": 1,
    "explanation": "單數物品 that lunchbox 回答使用「It's + 人名's + 單數名詞.」。"
  },
  {
    "id": "hwg_b6_832",
    "book": 6,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: ______ watch is this? B: It's Ava's watch.",
    "options": [
      "Whose",
      "Who",
      "Who's",
      "What"
    ],
    "answer": 0,
    "explanation": "詢問「誰的watch」使用疑問所有格「Whose」。"
  },
  {
    "id": "hwg_b6_833",
    "book": 6,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Whose watch is that on the desk? B: ______",
    "options": [
      "They're Ava's watch.",
      "She is Ava.",
      "I'd like some rice.",
      "It's Ava's watch."
    ],
    "answer": 3,
    "explanation": "單數物品 that watch 回答使用「It's + 人名's + 單數名詞.」。"
  },
  {
    "id": "hwg_b6_834",
    "book": 6,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Whose glasses ______ those? B: They're Lucas's glasses.",
    "options": [
      "am",
      "do",
      "are",
      "is"
    ],
    "answer": 2,
    "explanation": "複數名詞 glasses 與指示代名詞 those 搭配複數 Be 動詞「are」。"
  },
  {
    "id": "hwg_b6_835",
    "book": 6,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Are these Lucas's glasses? B: ______ They're my glasses.",
    "options": [
      "Yes, it is.",
      "No, they aren't.",
      "Yes, they are.",
      "No, it isn't."
    ],
    "answer": 1,
    "explanation": "後句說明是我的 glasses，且主詞為複數，故選「No, they aren't.」。"
  },
  {
    "id": "hwg_b6_836",
    "book": 6,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Whose shoes ______ those? B: They're Max's shoes.",
    "options": [
      "are",
      "is",
      "am",
      "do"
    ],
    "answer": 0,
    "explanation": "複數名詞 shoes 與指示代名詞 those 搭配複數 Be 動詞「are」。"
  },
  {
    "id": "hwg_b6_837",
    "book": 6,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Are these Max's shoes? B: ______ They're my shoes.",
    "options": [
      "Yes, they are.",
      "No, it isn't.",
      "Yes, it is.",
      "No, they aren't."
    ],
    "answer": 3,
    "explanation": "後句說明是我的 shoes，且主詞為複數，故選「No, they aren't.」。"
  },
  {
    "id": "hwg_b6_838",
    "book": 6,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Whose socks ______ those? B: They're Leo's socks.",
    "options": [
      "am",
      "do",
      "are",
      "is"
    ],
    "answer": 2,
    "explanation": "複數名詞 socks 與指示代名詞 those 搭配複數 Be 動詞「are」。"
  },
  {
    "id": "hwg_b6_839",
    "book": 6,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Are these Leo's socks? B: ______ They're my socks.",
    "options": [
      "Yes, it is.",
      "No, they aren't.",
      "Yes, they are.",
      "No, it isn't."
    ],
    "answer": 1,
    "explanation": "後句說明是我的 socks，且主詞為複數，故選「No, they aren't.」。"
  },
  {
    "id": "hwg_b6_840",
    "book": 6,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Whose gloves ______ those? B: They're Kulas's gloves.",
    "options": [
      "are",
      "is",
      "am",
      "do"
    ],
    "answer": 0,
    "explanation": "複數名詞 gloves 與指示代名詞 those 搭配複數 Be 動詞「are」。"
  },
  {
    "id": "hwg_b6_841",
    "book": 6,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Are these Kulas's gloves? B: ______ They're my gloves.",
    "options": [
      "Yes, they are.",
      "No, it isn't.",
      "Yes, it is.",
      "No, they aren't."
    ],
    "answer": 3,
    "explanation": "後句說明是我的 gloves，且主詞為複數，故選「No, they aren't.」。"
  },
  {
    "id": "hwg_b6_842",
    "book": 6,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Whose pants ______ those? B: They're Ryan's pants.",
    "options": [
      "am",
      "do",
      "are",
      "is"
    ],
    "answer": 2,
    "explanation": "複數名詞 pants 與指示代名詞 those 搭配複數 Be 動詞「are」。"
  },
  {
    "id": "hwg_b6_843",
    "book": 6,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Are these Ryan's pants? B: ______ They're my pants.",
    "options": [
      "Yes, it is.",
      "No, they aren't.",
      "Yes, they are.",
      "No, it isn't."
    ],
    "answer": 1,
    "explanation": "後句說明是我的 pants，且主詞為複數，故選「No, they aren't.」。"
  },
  {
    "id": "hwg_b6_844",
    "book": 6,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Whose notebooks ______ those? B: They're Owen's notebooks.",
    "options": [
      "are",
      "is",
      "am",
      "do"
    ],
    "answer": 0,
    "explanation": "複數名詞 notebooks 與指示代名詞 those 搭配複數 Be 動詞「are」。"
  },
  {
    "id": "hwg_b6_845",
    "book": 6,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Are these Owen's notebooks? B: ______ They're my notebooks.",
    "options": [
      "Yes, they are.",
      "No, it isn't.",
      "Yes, it is.",
      "No, they aren't."
    ],
    "answer": 3,
    "explanation": "後句說明是我的 notebooks，且主詞為複數，故選「No, they aren't.」。"
  },
  {
    "id": "hwg_b6_846",
    "book": 6,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Whose brushes ______ those? B: They're Noah's brushes.",
    "options": [
      "am",
      "do",
      "are",
      "is"
    ],
    "answer": 2,
    "explanation": "複數名詞 brushes 與指示代名詞 those 搭配複數 Be 動詞「are」。"
  },
  {
    "id": "hwg_b6_847",
    "book": 6,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Are these Noah's brushes? B: ______ They're my brushes.",
    "options": [
      "Yes, it is.",
      "No, they aren't.",
      "Yes, they are.",
      "No, it isn't."
    ],
    "answer": 1,
    "explanation": "後句說明是我的 brushes，且主詞為複數，故選「No, they aren't.」。"
  },
  {
    "id": "hwg_b6_848",
    "book": 6,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: Whose keys ______ those? B: They're Alex's keys.",
    "options": [
      "are",
      "is",
      "am",
      "do"
    ],
    "answer": 0,
    "explanation": "複數名詞 keys 與指示代名詞 those 搭配複數 Be 動詞「are」。"
  },
  {
    "id": "hwg_b6_849",
    "book": 6,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Are these Alex's keys? B: ______ They're my keys.",
    "options": [
      "Yes, they are.",
      "No, it isn't.",
      "Yes, it is.",
      "No, they aren't."
    ],
    "answer": 3,
    "explanation": "後句說明是我的 keys，且主詞為複數，故選「No, they aren't.」。"
  },
  {
    "id": "hwg_b6_850",
    "book": 6,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: Whose backpack is this? B: It's ______ backpack.",
    "options": [
      "he",
      "they",
      "Lucas's",
      "Lucas"
    ],
    "answer": 2,
    "explanation": "表示某人的物品需在人名後加所有格「’s」。"
  },
  {
    "id": "hwg_b6_851",
    "book": 6,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: Whose umbrella is this? B: It's ______ umbrella.",
    "options": [
      "they",
      "Max's",
      "Max",
      "he"
    ],
    "answer": 1,
    "explanation": "表示某人的物品需在人名後加所有格「’s」。"
  },
  {
    "id": "hwg_b6_852",
    "book": 6,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: Whose water bottle is this? B: It's ______ water bottle.",
    "options": [
      "Leo's",
      "Leo",
      "he",
      "they"
    ],
    "answer": 0,
    "explanation": "表示某人的物品需在人名後加所有格「’s」。"
  },
  {
    "id": "hwg_b6_853",
    "book": 6,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: Whose cap is this? B: It's ______ cap.",
    "options": [
      "Kulas",
      "he",
      "they",
      "Kulas's"
    ],
    "answer": 3,
    "explanation": "表示某人的物品需在人名後加所有格「’s」。"
  },
  {
    "id": "hwg_b6_854",
    "book": 6,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: Whose workbook is this? B: It's ______ workbook.",
    "options": [
      "he",
      "they",
      "Ryan's",
      "Ryan"
    ],
    "answer": 2,
    "explanation": "表示某人的物品需在人名後加所有格「’s」。"
  },
  {
    "id": "hwg_b6_855",
    "book": 6,
    "unit": "Review 2",
    "category": "grammar",
    "question": "A: Whose jacket is this? B: It's ______ jacket.",
    "options": [
      "they",
      "Owen's",
      "Owen",
      "he"
    ],
    "answer": 1,
    "explanation": "表示某人的物品需在人名後加所有格「’s」。"
  },
  {
    "id": "hwg_b7_856",
    "book": 7,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Where ______ Lucas from? B: He's from Taiwan.",
    "options": [
      "is",
      "are",
      "am",
      "does"
    ],
    "answer": 0,
    "explanation": "單數主詞 Lucas 搭配 Be 動詞「is」（Where is ... from?）。"
  },
  {
    "id": "hwg_b7_857",
    "book": 7,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Where ______ Max from? B: He's from Japan.",
    "options": [
      "are",
      "am",
      "does",
      "is"
    ],
    "answer": 3,
    "explanation": "單數主詞 Max 搭配 Be 動詞「is」（Where is ... from?）。"
  },
  {
    "id": "hwg_b7_858",
    "book": 7,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Where ______ Leo from? B: He's from Australia.",
    "options": [
      "am",
      "does",
      "is",
      "are"
    ],
    "answer": 2,
    "explanation": "單數主詞 Leo 搭配 Be 動詞「is」（Where is ... from?）。"
  },
  {
    "id": "hwg_b7_859",
    "book": 7,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Where ______ Kulas from? B: He's from India.",
    "options": [
      "does",
      "is",
      "are",
      "am"
    ],
    "answer": 1,
    "explanation": "單數主詞 Kulas 搭配 Be 動詞「is」（Where is ... from?）。"
  },
  {
    "id": "hwg_b7_860",
    "book": 7,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Where ______ Ryan from? B: He's from Singapore.",
    "options": [
      "is",
      "are",
      "am",
      "does"
    ],
    "answer": 0,
    "explanation": "單數主詞 Ryan 搭配 Be 動詞「is」（Where is ... from?）。"
  },
  {
    "id": "hwg_b7_861",
    "book": 7,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Where ______ Owen from? B: He's from Spain.",
    "options": [
      "are",
      "am",
      "does",
      "is"
    ],
    "answer": 3,
    "explanation": "單數主詞 Owen 搭配 Be 動詞「is」（Where is ... from?）。"
  },
  {
    "id": "hwg_b7_862",
    "book": 7,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Where ______ Noah from? B: He's from the UK.",
    "options": [
      "am",
      "does",
      "is",
      "are"
    ],
    "answer": 2,
    "explanation": "單數主詞 Noah 搭配 Be 動詞「is」（Where is ... from?）。"
  },
  {
    "id": "hwg_b7_863",
    "book": 7,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Where ______ Alex from? B: He's from the USA.",
    "options": [
      "does",
      "is",
      "are",
      "am"
    ],
    "answer": 1,
    "explanation": "單數主詞 Alex 搭配 Be 動詞「is」（Where is ... from?）。"
  },
  {
    "id": "hwg_b7_864",
    "book": 7,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Emma goes to school ______ bus every morning.",
    "options": [
      "by",
      "on",
      "in",
      "at"
    ],
    "answer": 0,
    "explanation": "搭乘交通工具「bus」使用介系詞「by bus」（中間不加冠詞）。"
  },
  {
    "id": "hwg_b7_865",
    "book": 7,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Nina goes to school ______ MRT every morning.",
    "options": [
      "on",
      "in",
      "at",
      "by"
    ],
    "answer": 3,
    "explanation": "搭乘交通工具「MRT」使用介系詞「by MRT」（中間不加冠詞）。"
  },
  {
    "id": "hwg_b7_866",
    "book": 7,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Chloe goes to school ______ bike every morning.",
    "options": [
      "in",
      "at",
      "by",
      "on"
    ],
    "answer": 2,
    "explanation": "搭乘交通工具「bike」使用介系詞「by bike」（中間不加冠詞）。"
  },
  {
    "id": "hwg_b7_867",
    "book": 7,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Sophie goes to school ______ car every morning.",
    "options": [
      "at",
      "by",
      "on",
      "in"
    ],
    "answer": 1,
    "explanation": "搭乘交通工具「car」使用介系詞「by car」（中間不加冠詞）。"
  },
  {
    "id": "hwg_b7_868",
    "book": 7,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Hannah goes to school ______ train every morning.",
    "options": [
      "by",
      "on",
      "in",
      "at"
    ],
    "answer": 0,
    "explanation": "搭乘交通工具「train」使用介系詞「by train」（中間不加冠詞）。"
  },
  {
    "id": "hwg_b7_869",
    "book": 7,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Maya goes to school ______ scooter every morning.",
    "options": [
      "on",
      "in",
      "at",
      "by"
    ],
    "answer": 3,
    "explanation": "搭乘交通工具「scooter」使用介系詞「by scooter」（中間不加冠詞）。"
  },
  {
    "id": "hwg_b7_870",
    "book": 7,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Lily goes to school ______ foot every morning.",
    "options": [
      "in",
      "at",
      "on",
      "by"
    ],
    "answer": 2,
    "explanation": "步行去上學固定使用片語「on foot」。"
  },
  {
    "id": "hwg_b7_871",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Lucas usually ______ at 6:30.",
    "options": [
      "to get up",
      "gets up",
      "get up",
      "geting"
    ],
    "answer": 1,
    "explanation": "第三人稱單數主詞 Lucas 描述日常習慣，動詞使用第三人稱單數形「gets up」。"
  },
  {
    "id": "hwg_b7_872",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What time does Lucas get up? B: He gets up ______ 6:30.",
    "options": [
      "at",
      "on",
      "in",
      "to"
    ],
    "answer": 0,
    "explanation": "特定時刻「6:30」前面固定使用介系詞「at」。"
  },
  {
    "id": "hwg_b7_873",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Max usually ______ at 7:20.",
    "options": [
      "go to school",
      "going",
      "to go to school",
      "goes to school"
    ],
    "answer": 3,
    "explanation": "第三人稱單數主詞 Max 描述日常習慣，動詞使用第三人稱單數形「goes to school」。"
  },
  {
    "id": "hwg_b7_874",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What time does Max go to school? B: He goes to school ______ 7:20.",
    "options": [
      "in",
      "to",
      "at",
      "on"
    ],
    "answer": 2,
    "explanation": "特定時刻「7:20」前面固定使用介系詞「at」。"
  },
  {
    "id": "hwg_b7_875",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Leo usually ______ at 12:00.",
    "options": [
      "to have lunch",
      "has lunch",
      "have lunch",
      "haveing"
    ],
    "answer": 1,
    "explanation": "第三人稱單數主詞 Leo 描述日常習慣，動詞使用第三人稱單數形「has lunch」。"
  },
  {
    "id": "hwg_b7_876",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What time does Leo have lunch? B: He has lunch ______ 12:00.",
    "options": [
      "at",
      "on",
      "in",
      "to"
    ],
    "answer": 0,
    "explanation": "特定時刻「12:00」前面固定使用介系詞「at」。"
  },
  {
    "id": "hwg_b7_877",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Kulas usually ______ at 4:15.",
    "options": [
      "go home",
      "going",
      "to go home",
      "goes home"
    ],
    "answer": 3,
    "explanation": "第三人稱單數主詞 Kulas 描述日常習慣，動詞使用第三人稱單數形「goes home」。"
  },
  {
    "id": "hwg_b7_878",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What time does Kulas go home? B: He goes home ______ 4:15.",
    "options": [
      "in",
      "to",
      "at",
      "on"
    ],
    "answer": 2,
    "explanation": "特定時刻「4:15」前面固定使用介系詞「at」。"
  },
  {
    "id": "hwg_b7_879",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Ryan usually ______ at 5:00.",
    "options": [
      "to do homework",
      "does homework",
      "do homework",
      "doing"
    ],
    "answer": 1,
    "explanation": "第三人稱單數主詞 Ryan 描述日常習慣，動詞使用第三人稱單數形「does homework」。"
  },
  {
    "id": "hwg_b7_880",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What time does Ryan do homework? B: He does homework ______ 5:00.",
    "options": [
      "at",
      "on",
      "in",
      "to"
    ],
    "answer": 0,
    "explanation": "特定時刻「5:00」前面固定使用介系詞「at」。"
  },
  {
    "id": "hwg_b7_881",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Owen usually ______ at 6:30.",
    "options": [
      "have dinner",
      "haveing",
      "to have dinner",
      "has dinner"
    ],
    "answer": 3,
    "explanation": "第三人稱單數主詞 Owen 描述日常習慣，動詞使用第三人稱單數形「has dinner」。"
  },
  {
    "id": "hwg_b7_882",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What time does Owen have dinner? B: He has dinner ______ 6:30.",
    "options": [
      "in",
      "to",
      "at",
      "on"
    ],
    "answer": 2,
    "explanation": "特定時刻「6:30」前面固定使用介系詞「at」。"
  },
  {
    "id": "hwg_b7_883",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Noah usually ______ at 8:00.",
    "options": [
      "to take a shower",
      "takes a shower",
      "take a shower",
      "takeing"
    ],
    "answer": 1,
    "explanation": "第三人稱單數主詞 Noah 描述日常習慣，動詞使用第三人稱單數形「takes a shower」。"
  },
  {
    "id": "hwg_b7_884",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What time does Noah take a shower? B: He takes a shower ______ 8:00.",
    "options": [
      "at",
      "on",
      "in",
      "to"
    ],
    "answer": 0,
    "explanation": "特定時刻「8:00」前面固定使用介系詞「at」。"
  },
  {
    "id": "hwg_b7_885",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Alex usually ______ at 9:30.",
    "options": [
      "go to bed",
      "going",
      "to go to bed",
      "goes to bed"
    ],
    "answer": 3,
    "explanation": "第三人稱單數主詞 Alex 描述日常習慣，動詞使用第三人稱單數形「goes to bed」。"
  },
  {
    "id": "hwg_b7_886",
    "book": 7,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: What time does Alex go to bed? B: He goes to bed ______ 9:30.",
    "options": [
      "in",
      "to",
      "at",
      "on"
    ],
    "answer": 2,
    "explanation": "特定時刻「9:30」前面固定使用介系詞「at」。"
  },
  {
    "id": "hwg_b8_887",
    "book": 8,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: What do you do in your free time, Lucas? B: ______",
    "options": [
      "I like winter.",
      "I do Tai Chi in my free time.",
      "I was at home yesterday.",
      "It's five hundred dollars."
    ],
    "answer": 1,
    "explanation": "詢問平時休閒活動使用現在簡單式回答「I ... in my free time.」。"
  },
  {
    "id": "hwg_b8_888",
    "book": 8,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: What do you do in your free time, Max? B: ______",
    "options": [
      "I do kung fu in my free time.",
      "I was at home yesterday.",
      "It's five hundred dollars.",
      "I like winter."
    ],
    "answer": 0,
    "explanation": "詢問平時休閒活動使用現在簡單式回答「I ... in my free time.」。"
  },
  {
    "id": "hwg_b8_889",
    "book": 8,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: What do you do in your free time, Leo? B: ______",
    "options": [
      "I was at home yesterday.",
      "It's five hundred dollars.",
      "I like winter.",
      "I go jogging in my free time."
    ],
    "answer": 3,
    "explanation": "詢問平時休閒活動使用現在簡單式回答「I ... in my free time.」。"
  },
  {
    "id": "hwg_b8_890",
    "book": 8,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: What do you do in your free time, Kulas? B: ______",
    "options": [
      "It's five hundred dollars.",
      "I like winter.",
      "I go camping in my free time.",
      "I was at home yesterday."
    ],
    "answer": 2,
    "explanation": "詢問平時休閒活動使用現在簡單式回答「I ... in my free time.」。"
  },
  {
    "id": "hwg_b8_891",
    "book": 8,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: What do you do in your free time, Ryan? B: ______",
    "options": [
      "I like winter.",
      "I play badminton in my free time.",
      "I was at home yesterday.",
      "It's five hundred dollars."
    ],
    "answer": 1,
    "explanation": "詢問平時休閒活動使用現在簡單式回答「I ... in my free time.」。"
  },
  {
    "id": "hwg_b8_892",
    "book": 8,
    "unit": "Starter",
    "category": "dialogue",
    "question": "A: What do you do in your free time, Owen? B: ______",
    "options": [
      "I go fishing in my free time.",
      "I was at home yesterday.",
      "It's five hundred dollars.",
      "I like winter."
    ],
    "answer": 0,
    "explanation": "詢問平時休閒活動使用現在簡單式回答「I ... in my free time.」。"
  },
  {
    "id": "hwg_b8_893",
    "book": 8,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Where ______ Lucas yesterday morning? B: He was at home.",
    "options": [
      "were",
      "is",
      "did",
      "was"
    ],
    "answer": 3,
    "explanation": "過去時間 yesterday 搭配第三人稱單數主詞 Lucas，Be 動詞用過去式「was」。"
  },
  {
    "id": "hwg_b8_894",
    "book": 8,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Lucas and Emma ______ at home yesterday afternoon.",
    "options": [
      "are",
      "did",
      "were",
      "was"
    ],
    "answer": 2,
    "explanation": "兩人並列為複數主詞，在過去時間 yesterday 搭配過去式 Be 動詞「were」。"
  },
  {
    "id": "hwg_b8_895",
    "book": 8,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Was Emma at home last night? B: ______ She was at home.",
    "options": [
      "No, they weren't.",
      "No, she wasn't.",
      "Yes, she was.",
      "No, she didn't."
    ],
    "answer": 1,
    "explanation": "以 Was Emma...? 提問且後句說明她在家，故否定簡答「No, she wasn't.」。"
  },
  {
    "id": "hwg_b8_896",
    "book": 8,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Where ______ Max yesterday morning? B: He was at school.",
    "options": [
      "was",
      "were",
      "is",
      "did"
    ],
    "answer": 0,
    "explanation": "過去時間 yesterday 搭配第三人稱單數主詞 Max，Be 動詞用過去式「was」。"
  },
  {
    "id": "hwg_b8_897",
    "book": 8,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Max and Nina ______ at school yesterday afternoon.",
    "options": [
      "was",
      "are",
      "did",
      "were"
    ],
    "answer": 3,
    "explanation": "兩人並列為複數主詞，在過去時間 yesterday 搭配過去式 Be 動詞「were」。"
  },
  {
    "id": "hwg_b8_898",
    "book": 8,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Was Nina at school last night? B: ______ She was at home.",
    "options": [
      "No, she didn't.",
      "No, they weren't.",
      "No, she wasn't.",
      "Yes, she was."
    ],
    "answer": 2,
    "explanation": "以 Was Nina...? 提問且後句說明她在家，故否定簡答「No, she wasn't.」。"
  },
  {
    "id": "hwg_b8_899",
    "book": 8,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Where ______ Leo yesterday morning? B: He was at the mall.",
    "options": [
      "did",
      "was",
      "were",
      "is"
    ],
    "answer": 1,
    "explanation": "過去時間 yesterday 搭配第三人稱單數主詞 Leo，Be 動詞用過去式「was」。"
  },
  {
    "id": "hwg_b8_900",
    "book": 8,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Leo and Chloe ______ at the mall yesterday afternoon.",
    "options": [
      "were",
      "was",
      "are",
      "did"
    ],
    "answer": 0,
    "explanation": "兩人並列為複數主詞，在過去時間 yesterday 搭配過去式 Be 動詞「were」。"
  },
  {
    "id": "hwg_b8_901",
    "book": 8,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Was Chloe at the mall last night? B: ______ She was at home.",
    "options": [
      "Yes, she was.",
      "No, she didn't.",
      "No, they weren't.",
      "No, she wasn't."
    ],
    "answer": 3,
    "explanation": "以 Was Chloe...? 提問且後句說明她在家，故否定簡答「No, she wasn't.」。"
  },
  {
    "id": "hwg_b8_902",
    "book": 8,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Where ______ Kulas yesterday morning? B: He was at the movie theater.",
    "options": [
      "is",
      "did",
      "was",
      "were"
    ],
    "answer": 2,
    "explanation": "過去時間 yesterday 搭配第三人稱單數主詞 Kulas，Be 動詞用過去式「was」。"
  },
  {
    "id": "hwg_b8_903",
    "book": 8,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Kulas and Sophie ______ at the movie theater yesterday afternoon.",
    "options": [
      "did",
      "were",
      "was",
      "are"
    ],
    "answer": 1,
    "explanation": "兩人並列為複數主詞，在過去時間 yesterday 搭配過去式 Be 動詞「were」。"
  },
  {
    "id": "hwg_b8_904",
    "book": 8,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Was Sophie at the movie theater last night? B: ______ She was at home.",
    "options": [
      "No, she wasn't.",
      "Yes, she was.",
      "No, she didn't.",
      "No, they weren't."
    ],
    "answer": 0,
    "explanation": "以 Was Sophie...? 提問且後句說明她在家，故否定簡答「No, she wasn't.」。"
  },
  {
    "id": "hwg_b8_905",
    "book": 8,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Where ______ Ryan yesterday morning? B: He was at the restaurant.",
    "options": [
      "were",
      "is",
      "did",
      "was"
    ],
    "answer": 3,
    "explanation": "過去時間 yesterday 搭配第三人稱單數主詞 Ryan，Be 動詞用過去式「was」。"
  },
  {
    "id": "hwg_b8_906",
    "book": 8,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Ryan and Hannah ______ at the restaurant yesterday afternoon.",
    "options": [
      "are",
      "did",
      "were",
      "was"
    ],
    "answer": 2,
    "explanation": "兩人並列為複數主詞，在過去時間 yesterday 搭配過去式 Be 動詞「were」。"
  },
  {
    "id": "hwg_b8_907",
    "book": 8,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Was Hannah at the restaurant last night? B: ______ She was at home.",
    "options": [
      "No, they weren't.",
      "No, she wasn't.",
      "Yes, she was.",
      "No, she didn't."
    ],
    "answer": 1,
    "explanation": "以 Was Hannah...? 提問且後句說明她在家，故否定簡答「No, she wasn't.」。"
  },
  {
    "id": "hwg_b8_908",
    "book": 8,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Where ______ Owen yesterday morning? B: He was at the zoo.",
    "options": [
      "was",
      "were",
      "is",
      "did"
    ],
    "answer": 0,
    "explanation": "過去時間 yesterday 搭配第三人稱單數主詞 Owen，Be 動詞用過去式「was」。"
  },
  {
    "id": "hwg_b8_909",
    "book": 8,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Owen and Maya ______ at the zoo yesterday afternoon.",
    "options": [
      "was",
      "are",
      "did",
      "were"
    ],
    "answer": 3,
    "explanation": "兩人並列為複數主詞，在過去時間 yesterday 搭配過去式 Be 動詞「were」。"
  },
  {
    "id": "hwg_b8_910",
    "book": 8,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Was Maya at the zoo last night? B: ______ She was at home.",
    "options": [
      "No, she didn't.",
      "No, they weren't.",
      "No, she wasn't.",
      "Yes, she was."
    ],
    "answer": 2,
    "explanation": "以 Was Maya...? 提問且後句說明她在家，故否定簡答「No, she wasn't.」。"
  },
  {
    "id": "hwg_b8_911",
    "book": 8,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Where ______ Noah yesterday morning? B: He was at the park.",
    "options": [
      "did",
      "was",
      "were",
      "is"
    ],
    "answer": 1,
    "explanation": "過去時間 yesterday 搭配第三人稱單數主詞 Noah，Be 動詞用過去式「was」。"
  },
  {
    "id": "hwg_b8_912",
    "book": 8,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Noah and Lily ______ at the park yesterday afternoon.",
    "options": [
      "were",
      "was",
      "are",
      "did"
    ],
    "answer": 0,
    "explanation": "兩人並列為複數主詞，在過去時間 yesterday 搭配過去式 Be 動詞「were」。"
  },
  {
    "id": "hwg_b8_913",
    "book": 8,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Was Lily at the park last night? B: ______ She was at home.",
    "options": [
      "Yes, she was.",
      "No, she didn't.",
      "No, they weren't.",
      "No, she wasn't."
    ],
    "answer": 3,
    "explanation": "以 Was Lily...? 提問且後句說明她在家，故否定簡答「No, she wasn't.」。"
  },
  {
    "id": "hwg_b8_914",
    "book": 8,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Where ______ Alex yesterday morning? B: He was at the library.",
    "options": [
      "is",
      "did",
      "was",
      "were"
    ],
    "answer": 2,
    "explanation": "過去時間 yesterday 搭配第三人稱單數主詞 Alex，Be 動詞用過去式「was」。"
  },
  {
    "id": "hwg_b8_915",
    "book": 8,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Alex and Ava ______ at the library yesterday afternoon.",
    "options": [
      "did",
      "were",
      "was",
      "are"
    ],
    "answer": 1,
    "explanation": "兩人並列為複數主詞，在過去時間 yesterday 搭配過去式 Be 動詞「were」。"
  },
  {
    "id": "hwg_b8_916",
    "book": 8,
    "unit": "Unit 1",
    "category": "dialogue",
    "question": "A: Was Ava at the library last night? B: ______ She was at home.",
    "options": [
      "No, she wasn't.",
      "Yes, she was.",
      "No, she didn't.",
      "No, they weren't."
    ],
    "answer": 0,
    "explanation": "以 Was Ava...? 提問且後句說明她在家，故否定簡答「No, she wasn't.」。"
  },
  {
    "id": "hwg_b8_917",
    "book": 8,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Lucas ______ last night.",
    "options": [
      "play the piano",
      "plays the piano",
      "is playing",
      "played the piano"
    ],
    "answer": 3,
    "explanation": "句尾有過去時間「last night」，動詞須使用過去式（-ed）。"
  },
  {
    "id": "hwg_b8_918",
    "book": 8,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Did Emma ______ yesterday? B: Yes, she did.",
    "options": [
      "plays the piano",
      "playing",
      "play the piano",
      "played the piano"
    ],
    "answer": 2,
    "explanation": "過去式助動詞 Did 後方的動詞必須還原為原形「play the piano」。"
  },
  {
    "id": "hwg_b8_919",
    "book": 8,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What did Lucas do yesterday evening? B: ______",
    "options": [
      "Yes, he did.",
      "He played the piano.",
      "He plays the piano every day.",
      "He was at the mall."
    ],
    "answer": 1,
    "explanation": "詢問昨晚做了什麼事（What did ... do?），回答過去式動作。"
  },
  {
    "id": "hwg_b8_920",
    "book": 8,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Max ______ last night.",
    "options": [
      "played baseball",
      "play baseball",
      "plays baseball",
      "is playing"
    ],
    "answer": 0,
    "explanation": "句尾有過去時間「last night」，動詞須使用過去式（-ed）。"
  },
  {
    "id": "hwg_b8_921",
    "book": 8,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Did Nina ______ yesterday? B: Yes, she did.",
    "options": [
      "played baseball",
      "plays baseball",
      "playing",
      "play baseball"
    ],
    "answer": 3,
    "explanation": "過去式助動詞 Did 後方的動詞必須還原為原形「play baseball」。"
  },
  {
    "id": "hwg_b8_922",
    "book": 8,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What did Max do yesterday evening? B: ______",
    "options": [
      "He was at the mall.",
      "Yes, he did.",
      "He played baseball.",
      "He plays baseball every day."
    ],
    "answer": 2,
    "explanation": "詢問昨晚做了什麼事（What did ... do?），回答過去式動作。"
  },
  {
    "id": "hwg_b8_923",
    "book": 8,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Leo ______ last night.",
    "options": [
      "is surfing",
      "surfed the Internet",
      "surf the Internet",
      "surfs the Internet"
    ],
    "answer": 1,
    "explanation": "句尾有過去時間「last night」，動詞須使用過去式（-ed）。"
  },
  {
    "id": "hwg_b8_924",
    "book": 8,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Did Chloe ______ yesterday? B: Yes, she did.",
    "options": [
      "surf the Internet",
      "surfed the Internet",
      "surfs the Internet",
      "surfing"
    ],
    "answer": 0,
    "explanation": "過去式助動詞 Did 後方的動詞必須還原為原形「surf the Internet」。"
  },
  {
    "id": "hwg_b8_925",
    "book": 8,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What did Leo do yesterday evening? B: ______",
    "options": [
      "He surfs the Internet every day.",
      "He was at the mall.",
      "Yes, he did.",
      "He surfed the Internet."
    ],
    "answer": 3,
    "explanation": "詢問昨晚做了什麼事（What did ... do?），回答過去式動作。"
  },
  {
    "id": "hwg_b8_926",
    "book": 8,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Kulas ______ last night.",
    "options": [
      "waters the plants",
      "is watering",
      "watered the plants",
      "water the plants"
    ],
    "answer": 2,
    "explanation": "句尾有過去時間「last night」，動詞須使用過去式（-ed）。"
  },
  {
    "id": "hwg_b8_927",
    "book": 8,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Did Sophie ______ yesterday? B: Yes, she did.",
    "options": [
      "watering",
      "water the plants",
      "watered the plants",
      "waters the plants"
    ],
    "answer": 1,
    "explanation": "過去式助動詞 Did 後方的動詞必須還原為原形「water the plants」。"
  },
  {
    "id": "hwg_b8_928",
    "book": 8,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What did Kulas do yesterday evening? B: ______",
    "options": [
      "He watered the plants.",
      "He waters the plants every day.",
      "He was at the mall.",
      "Yes, he did."
    ],
    "answer": 0,
    "explanation": "詢問昨晚做了什麼事（What did ... do?），回答過去式動作。"
  },
  {
    "id": "hwg_b8_929",
    "book": 8,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Ryan ______ last night.",
    "options": [
      "watch a movie",
      "watches a movie",
      "is watching",
      "watched a movie"
    ],
    "answer": 3,
    "explanation": "句尾有過去時間「last night」，動詞須使用過去式（-ed）。"
  },
  {
    "id": "hwg_b8_930",
    "book": 8,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Did Hannah ______ yesterday? B: Yes, she did.",
    "options": [
      "watches a movie",
      "watching",
      "watch a movie",
      "watched a movie"
    ],
    "answer": 2,
    "explanation": "過去式助動詞 Did 後方的動詞必須還原為原形「watch a movie」。"
  },
  {
    "id": "hwg_b8_931",
    "book": 8,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What did Ryan do yesterday evening? B: ______",
    "options": [
      "Yes, he did.",
      "He watched a movie.",
      "He watches a movie every day.",
      "He was at the mall."
    ],
    "answer": 1,
    "explanation": "詢問昨晚做了什麼事（What did ... do?），回答過去式動作。"
  },
  {
    "id": "hwg_b8_932",
    "book": 8,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Owen ______ last night.",
    "options": [
      "listened to music",
      "listen to music",
      "listens to music",
      "is listening"
    ],
    "answer": 0,
    "explanation": "句尾有過去時間「last night」，動詞須使用過去式（-ed）。"
  },
  {
    "id": "hwg_b8_933",
    "book": 8,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Did Maya ______ yesterday? B: Yes, she did.",
    "options": [
      "listened to music",
      "listens to music",
      "listening",
      "listen to music"
    ],
    "answer": 3,
    "explanation": "過去式助動詞 Did 後方的動詞必須還原為原形「listen to music」。"
  },
  {
    "id": "hwg_b8_934",
    "book": 8,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What did Owen do yesterday evening? B: ______",
    "options": [
      "He was at the mall.",
      "Yes, he did.",
      "He listened to music.",
      "He listens to music every day."
    ],
    "answer": 2,
    "explanation": "詢問昨晚做了什麼事（What did ... do?），回答過去式動作。"
  },
  {
    "id": "hwg_b8_935",
    "book": 8,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Noah ______ last night.",
    "options": [
      "is cleaning",
      "cleaned the room",
      "clean the room",
      "cleans the room"
    ],
    "answer": 1,
    "explanation": "句尾有過去時間「last night」，動詞須使用過去式（-ed）。"
  },
  {
    "id": "hwg_b8_936",
    "book": 8,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Did Lily ______ yesterday? B: Yes, she did.",
    "options": [
      "clean the room",
      "cleaned the room",
      "cleans the room",
      "cleaning"
    ],
    "answer": 0,
    "explanation": "過去式助動詞 Did 後方的動詞必須還原為原形「clean the room」。"
  },
  {
    "id": "hwg_b8_937",
    "book": 8,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What did Noah do yesterday evening? B: ______",
    "options": [
      "He cleans the room every day.",
      "He was at the mall.",
      "Yes, he did.",
      "He cleaned the room."
    ],
    "answer": 3,
    "explanation": "詢問昨晚做了什麼事（What did ... do?），回答過去式動作。"
  },
  {
    "id": "hwg_b8_938",
    "book": 8,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Alex ______ last night.",
    "options": [
      "walks the dog",
      "is walking",
      "walked the dog",
      "walk the dog"
    ],
    "answer": 2,
    "explanation": "句尾有過去時間「last night」，動詞須使用過去式（-ed）。"
  },
  {
    "id": "hwg_b8_939",
    "book": 8,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Did Ava ______ yesterday? B: Yes, she did.",
    "options": [
      "walking",
      "walk the dog",
      "walked the dog",
      "walks the dog"
    ],
    "answer": 1,
    "explanation": "過去式助動詞 Did 後方的動詞必須還原為原形「walk the dog」。"
  },
  {
    "id": "hwg_b8_940",
    "book": 8,
    "unit": "Unit 2",
    "category": "dialogue",
    "question": "A: What did Alex do yesterday evening? B: ______",
    "options": [
      "He walked the dog.",
      "He walks the dog every day.",
      "He was at the mall.",
      "Yes, he did."
    ],
    "answer": 0,
    "explanation": "詢問昨晚做了什麼事（What did ... do?），回答過去式動作。"
  },
  {
    "id": "hwg_b8_941",
    "book": 8,
    "unit": "Review 1",
    "category": "grammar",
    "question": "A: ______ you at home last night? B: Yes, I ______. I watched TV.",
    "options": [
      "Was; were",
      "Did; did",
      "Were; were",
      "Were; was"
    ],
    "answer": 3,
    "explanation": "第一空主詞 you 搭配「Were」；第二空主詞 I 搭配「was」。"
  },
  {
    "id": "hwg_b8_942",
    "book": 8,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: How much ______ this T-shirt? B: It's two hundred dollars.",
    "options": [
      "does",
      "can",
      "is",
      "are"
    ],
    "answer": 2,
    "explanation": "單數服飾「this T-shirt」詢問價格時搭配單數 Be 動詞「is」。"
  },
  {
    "id": "hwg_b8_943",
    "book": 8,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: How much is that T-shirt? B: ______",
    "options": [
      "It's warm in spring.",
      "It's two hundred dollars.",
      "They're two hundred dollars.",
      "There are two coats."
    ],
    "answer": 1,
    "explanation": "單數服飾以「It's + 金額 + dollars.」回答價格。"
  },
  {
    "id": "hwg_b8_944",
    "book": 8,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: How much ______ this coat? B: It's nine hundred dollars.",
    "options": [
      "is",
      "are",
      "does",
      "can"
    ],
    "answer": 0,
    "explanation": "單數服飾「this coat」詢問價格時搭配單數 Be 動詞「is」。"
  },
  {
    "id": "hwg_b8_945",
    "book": 8,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: How much is that coat? B: ______",
    "options": [
      "They're nine hundred dollars.",
      "There are two coats.",
      "It's warm in spring.",
      "It's nine hundred dollars."
    ],
    "answer": 3,
    "explanation": "單數服飾以「It's + 金額 + dollars.」回答價格。"
  },
  {
    "id": "hwg_b8_946",
    "book": 8,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: How much ______ this dress? B: It's seven hundred fifty dollars.",
    "options": [
      "does",
      "can",
      "is",
      "are"
    ],
    "answer": 2,
    "explanation": "單數服飾「this dress」詢問價格時搭配單數 Be 動詞「is」。"
  },
  {
    "id": "hwg_b8_947",
    "book": 8,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: How much is that dress? B: ______",
    "options": [
      "It's warm in spring.",
      "It's seven hundred fifty dollars.",
      "They're seven hundred fifty dollars.",
      "There are two coats."
    ],
    "answer": 1,
    "explanation": "單數服飾以「It's + 金額 + dollars.」回答價格。"
  },
  {
    "id": "hwg_b8_948",
    "book": 8,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: How much ______ this skirt? B: It's four hundred dollars.",
    "options": [
      "is",
      "are",
      "does",
      "can"
    ],
    "answer": 0,
    "explanation": "單數服飾「this skirt」詢問價格時搭配單數 Be 動詞「is」。"
  },
  {
    "id": "hwg_b8_949",
    "book": 8,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: How much is that skirt? B: ______",
    "options": [
      "They're four hundred dollars.",
      "There are two coats.",
      "It's warm in spring.",
      "It's four hundred dollars."
    ],
    "answer": 3,
    "explanation": "單數服飾以「It's + 金額 + dollars.」回答價格。"
  },
  {
    "id": "hwg_b8_950",
    "book": 8,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: How much ______ this jacket? B: It's eight hundred dollars.",
    "options": [
      "does",
      "can",
      "is",
      "are"
    ],
    "answer": 2,
    "explanation": "單數服飾「this jacket」詢問價格時搭配單數 Be 動詞「is」。"
  },
  {
    "id": "hwg_b8_951",
    "book": 8,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: How much is that jacket? B: ______",
    "options": [
      "It's warm in spring.",
      "It's eight hundred dollars.",
      "They're eight hundred dollars.",
      "There are two coats."
    ],
    "answer": 1,
    "explanation": "單數服飾以「It's + 金額 + dollars.」回答價格。"
  },
  {
    "id": "hwg_b8_952",
    "book": 8,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: How much ______ this hat? B: It's one hundred fifty dollars.",
    "options": [
      "is",
      "are",
      "does",
      "can"
    ],
    "answer": 0,
    "explanation": "單數服飾「this hat」詢問價格時搭配單數 Be 動詞「is」。"
  },
  {
    "id": "hwg_b8_953",
    "book": 8,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: How much is that hat? B: ______",
    "options": [
      "They're one hundred fifty dollars.",
      "There are two coats.",
      "It's warm in spring.",
      "It's one hundred fifty dollars."
    ],
    "answer": 3,
    "explanation": "單數服飾以「It's + 金額 + dollars.」回答價格。"
  },
  {
    "id": "hwg_b8_954",
    "book": 8,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: How much ______ this shirt? B: It's three hundred dollars.",
    "options": [
      "does",
      "can",
      "is",
      "are"
    ],
    "answer": 2,
    "explanation": "單數服飾「this shirt」詢問價格時搭配單數 Be 動詞「is」。"
  },
  {
    "id": "hwg_b8_955",
    "book": 8,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: How much is that shirt? B: ______",
    "options": [
      "It's warm in spring.",
      "It's three hundred dollars.",
      "They're three hundred dollars.",
      "There are two coats."
    ],
    "answer": 1,
    "explanation": "單數服飾以「It's + 金額 + dollars.」回答價格。"
  },
  {
    "id": "hwg_b8_956",
    "book": 8,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: How much ______ this sweater? B: It's six hundred dollars.",
    "options": [
      "is",
      "are",
      "does",
      "can"
    ],
    "answer": 0,
    "explanation": "單數服飾「this sweater」詢問價格時搭配單數 Be 動詞「is」。"
  },
  {
    "id": "hwg_b8_957",
    "book": 8,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: How much is that sweater? B: ______",
    "options": [
      "They're six hundred dollars.",
      "There are two coats.",
      "It's warm in spring.",
      "It's six hundred dollars."
    ],
    "answer": 3,
    "explanation": "單數服飾以「It's + 金額 + dollars.」回答價格。"
  },
  {
    "id": "hwg_b8_958",
    "book": 8,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: How much ______ these jeans? B: They're eight hundred dollars.",
    "options": [
      "do",
      "was",
      "are",
      "is"
    ],
    "answer": 2,
    "explanation": "成雙或複數服飾「these jeans」搭配複數 Be 動詞「are」。"
  },
  {
    "id": "hwg_b8_959",
    "book": 8,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: How much are those jeans? B: ______",
    "options": [
      "I was at the department store.",
      "They're eight hundred dollars.",
      "It's eight hundred dollars.",
      "Yes, they are."
    ],
    "answer": 1,
    "explanation": "複數服飾「those jeans」回答價格使用「They're + 金額 + dollars.」。"
  },
  {
    "id": "hwg_b8_960",
    "book": 8,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: How much ______ these pants? B: They're five hundred dollars.",
    "options": [
      "are",
      "is",
      "do",
      "was"
    ],
    "answer": 0,
    "explanation": "成雙或複數服飾「these pants」搭配複數 Be 動詞「are」。"
  },
  {
    "id": "hwg_b8_961",
    "book": 8,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: How much are those pants? B: ______",
    "options": [
      "It's five hundred dollars.",
      "Yes, they are.",
      "I was at the department store.",
      "They're five hundred dollars."
    ],
    "answer": 3,
    "explanation": "複數服飾「those pants」回答價格使用「They're + 金額 + dollars.」。"
  },
  {
    "id": "hwg_b8_962",
    "book": 8,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: How much ______ these shorts? B: They're three hundred fifty dollars.",
    "options": [
      "do",
      "was",
      "are",
      "is"
    ],
    "answer": 2,
    "explanation": "成雙或複數服飾「these shorts」搭配複數 Be 動詞「are」。"
  },
  {
    "id": "hwg_b8_963",
    "book": 8,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: How much are those shorts? B: ______",
    "options": [
      "I was at the department store.",
      "They're three hundred fifty dollars.",
      "It's three hundred fifty dollars.",
      "Yes, they are."
    ],
    "answer": 1,
    "explanation": "複數服飾「those shorts」回答價格使用「They're + 金額 + dollars.」。"
  },
  {
    "id": "hwg_b8_964",
    "book": 8,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: How much ______ these shoes? B: They're nine hundred ninety dollars.",
    "options": [
      "are",
      "is",
      "do",
      "was"
    ],
    "answer": 0,
    "explanation": "成雙或複數服飾「these shoes」搭配複數 Be 動詞「are」。"
  },
  {
    "id": "hwg_b8_965",
    "book": 8,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: How much are those shoes? B: ______",
    "options": [
      "It's nine hundred ninety dollars.",
      "Yes, they are.",
      "I was at the department store.",
      "They're nine hundred ninety dollars."
    ],
    "answer": 3,
    "explanation": "複數服飾「those shoes」回答價格使用「They're + 金額 + dollars.」。"
  },
  {
    "id": "hwg_b8_966",
    "book": 8,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: How much ______ these socks? B: They're one hundred dollars.",
    "options": [
      "do",
      "was",
      "are",
      "is"
    ],
    "answer": 2,
    "explanation": "成雙或複數服飾「these socks」搭配複數 Be 動詞「are」。"
  },
  {
    "id": "hwg_b8_967",
    "book": 8,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: How much are those socks? B: ______",
    "options": [
      "I was at the department store.",
      "They're one hundred dollars.",
      "It's one hundred dollars.",
      "Yes, they are."
    ],
    "answer": 1,
    "explanation": "複數服飾「those socks」回答價格使用「They're + 金額 + dollars.」。"
  },
  {
    "id": "hwg_b8_968",
    "book": 8,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: How much ______ these boots? B: They're seven hundred dollars.",
    "options": [
      "are",
      "is",
      "do",
      "was"
    ],
    "answer": 0,
    "explanation": "成雙或複數服飾「these boots」搭配複數 Be 動詞「are」。"
  },
  {
    "id": "hwg_b8_969",
    "book": 8,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: How much are those boots? B: ______",
    "options": [
      "It's seven hundred dollars.",
      "Yes, they are.",
      "I was at the department store.",
      "They're seven hundred dollars."
    ],
    "answer": 3,
    "explanation": "複數服飾「those boots」回答價格使用「They're + 金額 + dollars.」。"
  },
  {
    "id": "hwg_b8_970",
    "book": 8,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: How much ______ these glasses? B: They're six hundred fifty dollars.",
    "options": [
      "do",
      "was",
      "are",
      "is"
    ],
    "answer": 2,
    "explanation": "成雙或複數服飾「these glasses」搭配複數 Be 動詞「are」。"
  },
  {
    "id": "hwg_b8_971",
    "book": 8,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: How much are those glasses? B: ______",
    "options": [
      "I was at the department store.",
      "They're six hundred fifty dollars.",
      "It's six hundred fifty dollars.",
      "Yes, they are."
    ],
    "answer": 1,
    "explanation": "複數服飾「those glasses」回答價格使用「They're + 金額 + dollars.」。"
  },
  {
    "id": "hwg_b8_972",
    "book": 8,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "A: How much ______ these gloves? B: They're two hundred fifty dollars.",
    "options": [
      "are",
      "is",
      "do",
      "was"
    ],
    "answer": 0,
    "explanation": "成雙或複數服飾「these gloves」搭配複數 Be 動詞「are」。"
  },
  {
    "id": "hwg_b8_973",
    "book": 8,
    "unit": "Unit 3",
    "category": "dialogue",
    "question": "A: How much are those gloves? B: ______",
    "options": [
      "It's two hundred fifty dollars.",
      "Yes, they are.",
      "I was at the department store.",
      "They're two hundred fifty dollars."
    ],
    "answer": 3,
    "explanation": "複數服飾「those gloves」回答價格使用「They're + 金額 + dollars.」。"
  },
  {
    "id": "hwg_b8_974",
    "book": 8,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: How's the weather ______ spring? B: It's warm and rainy.",
    "options": [
      "at",
      "for",
      "in",
      "on"
    ],
    "answer": 2,
    "explanation": "四季名稱「spring」前面固定使用介系詞「in」。"
  },
  {
    "id": "hwg_b8_975",
    "book": 8,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: What's Lucas's favorite season? B: ______ He likes to plant flowers.",
    "options": [
      "They're five hundred dollars.",
      "He likes spring.",
      "It's warm and rainy.",
      "He was at the zoo."
    ],
    "answer": 1,
    "explanation": "詢問最喜歡的季節（What's ... favorite season?），回答「He likes spring.」。"
  },
  {
    "id": "hwg_b8_976",
    "book": 8,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Is it warm and rainy in spring there, Emma? B: ______",
    "options": [
      "Yes, it is.",
      "Yes, I do.",
      "No, I was not.",
      "My favorite season is spring."
    ],
    "answer": 0,
    "explanation": "以 Is it ...? 詢問天氣，肯定簡答使用「Yes, it is.」。"
  },
  {
    "id": "hwg_b8_977",
    "book": 8,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: How's the weather ______ summer? B: It's hot and sunny.",
    "options": [
      "on",
      "at",
      "for",
      "in"
    ],
    "answer": 3,
    "explanation": "四季名稱「summer」前面固定使用介系詞「in」。"
  },
  {
    "id": "hwg_b8_978",
    "book": 8,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: What's Max's favorite season? B: ______ He likes to go swimming at the beach.",
    "options": [
      "He was at the zoo.",
      "They're five hundred dollars.",
      "He likes summer.",
      "It's hot and sunny."
    ],
    "answer": 2,
    "explanation": "詢問最喜歡的季節（What's ... favorite season?），回答「He likes summer.」。"
  },
  {
    "id": "hwg_b8_979",
    "book": 8,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Is it hot and sunny in summer there, Nina? B: ______",
    "options": [
      "My favorite season is summer.",
      "Yes, it is.",
      "Yes, I do.",
      "No, I was not."
    ],
    "answer": 1,
    "explanation": "以 Is it ...? 詢問天氣，肯定簡答使用「Yes, it is.」。"
  },
  {
    "id": "hwg_b8_980",
    "book": 8,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: How's the weather ______ fall? B: It's cool and windy.",
    "options": [
      "in",
      "on",
      "at",
      "for"
    ],
    "answer": 0,
    "explanation": "四季名稱「fall」前面固定使用介系詞「in」。"
  },
  {
    "id": "hwg_b8_981",
    "book": 8,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: What's Leo's favorite season? B: ______ He likes to fly a kite in the park.",
    "options": [
      "It's cool and windy.",
      "He was at the zoo.",
      "They're five hundred dollars.",
      "He likes fall."
    ],
    "answer": 3,
    "explanation": "詢問最喜歡的季節（What's ... favorite season?），回答「He likes fall.」。"
  },
  {
    "id": "hwg_b8_982",
    "book": 8,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Is it cool and windy in fall there, Chloe? B: ______",
    "options": [
      "No, I was not.",
      "My favorite season is fall.",
      "Yes, it is.",
      "Yes, I do."
    ],
    "answer": 2,
    "explanation": "以 Is it ...? 詢問天氣，肯定簡答使用「Yes, it is.」。"
  },
  {
    "id": "hwg_b8_983",
    "book": 8,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "A: How's the weather ______ winter? B: It's cold and snowy.",
    "options": [
      "for",
      "in",
      "on",
      "at"
    ],
    "answer": 1,
    "explanation": "四季名稱「winter」前面固定使用介系詞「in」。"
  },
  {
    "id": "hwg_b8_984",
    "book": 8,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: What's Kulas's favorite season? B: ______ He likes to make a snowman.",
    "options": [
      "He likes winter.",
      "It's cold and snowy.",
      "He was at the zoo.",
      "They're five hundred dollars."
    ],
    "answer": 0,
    "explanation": "詢問最喜歡的季節（What's ... favorite season?），回答「He likes winter.」。"
  },
  {
    "id": "hwg_b8_985",
    "book": 8,
    "unit": "Unit 4",
    "category": "dialogue",
    "question": "A: Is it cold and snowy in winter there, Sophie? B: ______",
    "options": [
      "Yes, I do.",
      "No, I was not.",
      "My favorite season is winter.",
      "Yes, it is."
    ],
    "answer": 3,
    "explanation": "以 Is it ...? 詢問天氣，肯定簡答使用「Yes, it is.」。"
  },
  {
    "id": "hwg_b8_986",
    "book": 8,
    "unit": "Review 2",
    "category": "grammar",
    "question": "It's very cold in winter. How much ______ those warm jeans?",
    "options": [
      "was",
      "do",
      "are",
      "is"
    ],
    "answer": 2,
    "explanation": "複數服飾「those warm jeans」搭配複數動詞「are」。"
  },
  {
    "id": "hwg_b8_987",
    "book": 8,
    "unit": "Review 2",
    "category": "grammar",
    "question": "It's very cold in winter. How much ______ those warm pants?",
    "options": [
      "do",
      "are",
      "is",
      "was"
    ],
    "answer": 1,
    "explanation": "複數服飾「those warm pants」搭配複數動詞「are」。"
  },
  {
    "id": "hwg_b8_988",
    "book": 8,
    "unit": "Review 2",
    "category": "grammar",
    "question": "It's very cold in winter. How much ______ those warm shorts?",
    "options": [
      "are",
      "is",
      "was",
      "do"
    ],
    "answer": 0,
    "explanation": "複數服飾「those warm shorts」搭配複數動詞「are」。"
  },
  {
    "id": "hwg_b8_989",
    "book": 8,
    "unit": "Review 2",
    "category": "grammar",
    "question": "It's very cold in winter. How much ______ those warm shoes?",
    "options": [
      "is",
      "was",
      "do",
      "are"
    ],
    "answer": 3,
    "explanation": "複數服飾「those warm shoes」搭配複數動詞「are」。"
  },
  {
    "id": "hwg_b8_990",
    "book": 8,
    "unit": "Review 2",
    "category": "grammar",
    "question": "It's very cold in winter. How much ______ those warm socks?",
    "options": [
      "was",
      "do",
      "are",
      "is"
    ],
    "answer": 2,
    "explanation": "複數服飾「those warm socks」搭配複數動詞「are」。"
  },
  {
    "id": "hwg_b8_991",
    "book": 8,
    "unit": "Review 2",
    "category": "grammar",
    "question": "It's very cold in winter. How much ______ those warm boots?",
    "options": [
      "do",
      "are",
      "is",
      "was"
    ],
    "answer": 1,
    "explanation": "複數服飾「those warm boots」搭配複數動詞「are」。"
  },
  {
    "id": "hwg_b9_992",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Lucas ______ at the department store yesterday.",
    "options": [
      "went shopping",
      "go shopping",
      "gos",
      "is going"
    ],
    "answer": 0,
    "explanation": "句中有過去時間 yesterday，需使用不規則過去式「went shopping」。"
  },
  {
    "id": "hwg_b9_993",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Did Lucas ______ yesterday? B: No, he didn't.",
    "options": [
      "went shopping",
      "gos",
      "to go shopping",
      "go shopping"
    ],
    "answer": 3,
    "explanation": "助動詞 Did 之後的動詞須還原為原形「go shopping」。"
  },
  {
    "id": "hwg_b9_994",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Max ______ at the night market yesterday.",
    "options": [
      "eats",
      "is eating",
      "ate snacks",
      "eat snacks"
    ],
    "answer": 2,
    "explanation": "句中有過去時間 yesterday，需使用不規則過去式「ate snacks」。"
  },
  {
    "id": "hwg_b9_995",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Did Max ______ yesterday? B: No, he didn't.",
    "options": [
      "to eat snacks",
      "eat snacks",
      "ate snacks",
      "eats"
    ],
    "answer": 1,
    "explanation": "助動詞 Did 之後的動詞須還原為原形「eat snacks」。"
  },
  {
    "id": "hwg_b9_996",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Leo ______ at the restaurant yesterday.",
    "options": [
      "drank juice",
      "drink juice",
      "drinks",
      "is drinking"
    ],
    "answer": 0,
    "explanation": "句中有過去時間 yesterday，需使用不規則過去式「drank juice」。"
  },
  {
    "id": "hwg_b9_997",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Did Leo ______ yesterday? B: No, he didn't.",
    "options": [
      "drank juice",
      "drinks",
      "to drink juice",
      "drink juice"
    ],
    "answer": 3,
    "explanation": "助動詞 Did 之後的動詞須還原為原形「drink juice」。"
  },
  {
    "id": "hwg_b9_998",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Kulas ______ at the riverside park yesterday.",
    "options": [
      "flys",
      "is flying",
      "flew a kite",
      "fly a kite"
    ],
    "answer": 2,
    "explanation": "句中有過去時間 yesterday，需使用不規則過去式「flew a kite」。"
  },
  {
    "id": "hwg_b9_999",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Did Kulas ______ yesterday? B: No, he didn't.",
    "options": [
      "to fly a kite",
      "fly a kite",
      "flew a kite",
      "flys"
    ],
    "answer": 1,
    "explanation": "助動詞 Did 之後的動詞須還原為原形「fly a kite」。"
  },
  {
    "id": "hwg_b9_1000",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Ryan ______ in the park yesterday.",
    "options": [
      "rode a bike",
      "ride a bike",
      "rides",
      "is rideing"
    ],
    "answer": 0,
    "explanation": "句中有過去時間 yesterday，需使用不規則過去式「rode a bike」。"
  },
  {
    "id": "hwg_b9_1001",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Did Ryan ______ yesterday? B: No, he didn't.",
    "options": [
      "rode a bike",
      "rides",
      "to ride a bike",
      "ride a bike"
    ],
    "answer": 3,
    "explanation": "助動詞 Did 之後的動詞須還原為原形「ride a bike」。"
  },
  {
    "id": "hwg_b9_1002",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "Owen ______ at the movie theater yesterday.",
    "options": [
      "sees",
      "is seeing",
      "saw a movie",
      "see a movie"
    ],
    "answer": 2,
    "explanation": "句中有過去時間 yesterday，需使用不規則過去式「saw a movie」。"
  },
  {
    "id": "hwg_b9_1003",
    "book": 9,
    "unit": "Unit 1",
    "category": "grammar",
    "question": "A: Did Owen ______ yesterday? B: No, he didn't.",
    "options": [
      "to see a movie",
      "see a movie",
      "saw a movie",
      "sees"
    ],
    "answer": 1,
    "explanation": "助動詞 Did 之後的動詞須還原為原形「see a movie」。"
  },
  {
    "id": "hwg_b9_1004",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Noah ______ in the pool yesterday.",
    "options": [
      "swam",
      "swim",
      "swims",
      "is swiming"
    ],
    "answer": 0,
    "explanation": "句中有過去時間 yesterday，需使用不規則過去式「swam」。"
  },
  {
    "id": "hwg_b9_1005",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Did Noah ______ yesterday? B: No, he didn't.",
    "options": [
      "swam",
      "swims",
      "to swim",
      "swim"
    ],
    "answer": 3,
    "explanation": "助動詞 Did 之後的動詞須還原為原形「swim」。"
  },
  {
    "id": "hwg_b9_1006",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Alex ______ at the party yesterday.",
    "options": [
      "sings",
      "is singing",
      "sang songs",
      "sing songs"
    ],
    "answer": 2,
    "explanation": "句中有過去時間 yesterday，需使用不規則過去式「sang songs」。"
  },
  {
    "id": "hwg_b9_1007",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Did Alex ______ yesterday? B: No, he didn't.",
    "options": [
      "to sing songs",
      "sing songs",
      "sang songs",
      "sings"
    ],
    "answer": 1,
    "explanation": "助動詞 Did 之後的動詞須還原為原形「sing songs」。"
  },
  {
    "id": "hwg_b9_1008",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Ethan ______ in art class yesterday.",
    "options": [
      "drew a picture",
      "draw a picture",
      "draws",
      "is drawing"
    ],
    "answer": 0,
    "explanation": "句中有過去時間 yesterday，需使用不規則過去式「drew a picture」。"
  },
  {
    "id": "hwg_b9_1009",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Did Ethan ______ yesterday? B: No, he didn't.",
    "options": [
      "drew a picture",
      "draws",
      "to draw a picture",
      "draw a picture"
    ],
    "answer": 3,
    "explanation": "助動詞 Did 之後的動詞須還原為原形「draw a picture」。"
  },
  {
    "id": "hwg_b9_1010",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Dylan ______ to Grandma yesterday.",
    "options": [
      "writes",
      "is writeing",
      "wrote a letter",
      "write a letter"
    ],
    "answer": 2,
    "explanation": "句中有過去時間 yesterday，需使用不規則過去式「wrote a letter」。"
  },
  {
    "id": "hwg_b9_1011",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Did Dylan ______ yesterday? B: No, he didn't.",
    "options": [
      "to write a letter",
      "write a letter",
      "wrote a letter",
      "writes"
    ],
    "answer": 1,
    "explanation": "助動詞 Did 之後的動詞須還原為原形「write a letter」。"
  },
  {
    "id": "hwg_b9_1012",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Lucas ______ after dinner yesterday.",
    "options": [
      "took a walk",
      "take a walk",
      "takes",
      "is takeing"
    ],
    "answer": 0,
    "explanation": "句中有過去時間 yesterday，需使用不規則過去式「took a walk」。"
  },
  {
    "id": "hwg_b9_1013",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Did Lucas ______ yesterday? B: No, he didn't.",
    "options": [
      "took a walk",
      "takes",
      "to take a walk",
      "take a walk"
    ],
    "answer": 3,
    "explanation": "助動詞 Did 之後的動詞須還原為原形「take a walk」。"
  },
  {
    "id": "hwg_b9_1014",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "Max ______ last Sunday yesterday.",
    "options": [
      "haves",
      "is haveing",
      "had a picnic",
      "have a picnic"
    ],
    "answer": 2,
    "explanation": "句中有過去時間 yesterday，需使用不規則過去式「had a picnic」。"
  },
  {
    "id": "hwg_b9_1015",
    "book": 9,
    "unit": "Unit 2",
    "category": "grammar",
    "question": "A: Did Max ______ yesterday? B: No, he didn't.",
    "options": [
      "to have a picnic",
      "have a picnic",
      "had a picnic",
      "haves"
    ],
    "answer": 1,
    "explanation": "助動詞 Did 之後的動詞須還原為原形「have a picnic」。"
  },
  {
    "id": "hwg_b9_1016",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "Nina would like three ______ of water.",
    "options": [
      "bottles",
      "bottle",
      "bottlees",
      "piece"
    ],
    "answer": 0,
    "explanation": "數量超過 1（three）時，計量單位詞須用複數「bottles」。"
  },
  {
    "id": "hwg_b9_1017",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "Chloe would like two ______ of tea.",
    "options": [
      "cup",
      "cupes",
      "piece",
      "cups"
    ],
    "answer": 3,
    "explanation": "數量超過 1（two）時，計量單位詞須用複數「cups」。"
  },
  {
    "id": "hwg_b9_1018",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "Hannah would like two ______ of soup.",
    "options": [
      "bowles",
      "piece",
      "bowls",
      "bowl"
    ],
    "answer": 2,
    "explanation": "數量超過 1（two）時，計量單位詞須用複數「bowls」。"
  },
  {
    "id": "hwg_b9_1019",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "Maya would like three ______ of noodles.",
    "options": [
      "piece",
      "plates",
      "plate",
      "platees"
    ],
    "answer": 1,
    "explanation": "數量超過 1（three）時，計量單位詞須用複數「plates」。"
  },
  {
    "id": "hwg_b9_1020",
    "book": 9,
    "unit": "Unit 3",
    "category": "grammar",
    "question": "Lily would like two ______ of chips.",
    "options": [
      "bags",
      "bag",
      "bages",
      "piece"
    ],
    "answer": 0,
    "explanation": "數量超過 1（two）時，計量單位詞須用複數「bags」。"
  },
  {
    "id": "hwg_b9_1021",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Lucas's birthday is ______ January 1st.",
    "options": [
      "in",
      "at",
      "of",
      "on"
    ],
    "answer": 3,
    "explanation": "明確指出「幾月幾日（January 1st）」時，介系詞固定用「on」。"
  },
  {
    "id": "hwg_b9_1022",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "My sister's birthday is ______ January.",
    "options": [
      "at",
      "for",
      "in",
      "on"
    ],
    "answer": 2,
    "explanation": "僅指出「月份（January）」而無日期數字時，介系詞固定用「in」。"
  },
  {
    "id": "hwg_b9_1023",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Max's birthday is ______ February 14th.",
    "options": [
      "of",
      "on",
      "in",
      "at"
    ],
    "answer": 1,
    "explanation": "明確指出「幾月幾日（February 14th）」時，介系詞固定用「on」。"
  },
  {
    "id": "hwg_b9_1024",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "My sister's birthday is ______ February.",
    "options": [
      "in",
      "on",
      "at",
      "for"
    ],
    "answer": 0,
    "explanation": "僅指出「月份（February）」而無日期數字時，介系詞固定用「in」。"
  },
  {
    "id": "hwg_b9_1025",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Leo's birthday is ______ March 8th.",
    "options": [
      "in",
      "at",
      "of",
      "on"
    ],
    "answer": 3,
    "explanation": "明確指出「幾月幾日（March 8th）」時，介系詞固定用「on」。"
  },
  {
    "id": "hwg_b9_1026",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "My sister's birthday is ______ March.",
    "options": [
      "at",
      "for",
      "in",
      "on"
    ],
    "answer": 2,
    "explanation": "僅指出「月份（March）」而無日期數字時，介系詞固定用「in」。"
  },
  {
    "id": "hwg_b9_1027",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Kulas's birthday is ______ April 22nd.",
    "options": [
      "of",
      "on",
      "in",
      "at"
    ],
    "answer": 1,
    "explanation": "明確指出「幾月幾日（April 22nd）」時，介系詞固定用「on」。"
  },
  {
    "id": "hwg_b9_1028",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "My sister's birthday is ______ April.",
    "options": [
      "in",
      "on",
      "at",
      "for"
    ],
    "answer": 0,
    "explanation": "僅指出「月份（April）」而無日期數字時，介系詞固定用「in」。"
  },
  {
    "id": "hwg_b9_1029",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Ryan's birthday is ______ May 12th.",
    "options": [
      "in",
      "at",
      "of",
      "on"
    ],
    "answer": 3,
    "explanation": "明確指出「幾月幾日（May 12th）」時，介系詞固定用「on」。"
  },
  {
    "id": "hwg_b9_1030",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "My sister's birthday is ______ May.",
    "options": [
      "at",
      "for",
      "in",
      "on"
    ],
    "answer": 2,
    "explanation": "僅指出「月份（May）」而無日期數字時，介系詞固定用「in」。"
  },
  {
    "id": "hwg_b9_1031",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Owen's birthday is ______ June 3rd.",
    "options": [
      "of",
      "on",
      "in",
      "at"
    ],
    "answer": 1,
    "explanation": "明確指出「幾月幾日（June 3rd）」時，介系詞固定用「on」。"
  },
  {
    "id": "hwg_b9_1032",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "My sister's birthday is ______ June.",
    "options": [
      "in",
      "on",
      "at",
      "for"
    ],
    "answer": 0,
    "explanation": "僅指出「月份（June）」而無日期數字時，介系詞固定用「in」。"
  },
  {
    "id": "hwg_b9_1033",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Noah's birthday is ______ July 15th.",
    "options": [
      "in",
      "at",
      "of",
      "on"
    ],
    "answer": 3,
    "explanation": "明確指出「幾月幾日（July 15th）」時，介系詞固定用「on」。"
  },
  {
    "id": "hwg_b9_1034",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "My sister's birthday is ______ July.",
    "options": [
      "at",
      "for",
      "in",
      "on"
    ],
    "answer": 2,
    "explanation": "僅指出「月份（July）」而無日期數字時，介系詞固定用「in」。"
  },
  {
    "id": "hwg_b9_1035",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Alex's birthday is ______ August 23rd.",
    "options": [
      "of",
      "on",
      "in",
      "at"
    ],
    "answer": 1,
    "explanation": "明確指出「幾月幾日（August 23rd）」時，介系詞固定用「on」。"
  },
  {
    "id": "hwg_b9_1036",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "My sister's birthday is ______ August.",
    "options": [
      "in",
      "on",
      "at",
      "for"
    ],
    "answer": 0,
    "explanation": "僅指出「月份（August）」而無日期數字時，介系詞固定用「in」。"
  },
  {
    "id": "hwg_b9_1037",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Ethan's birthday is ______ September 28th.",
    "options": [
      "in",
      "at",
      "of",
      "on"
    ],
    "answer": 3,
    "explanation": "明確指出「幾月幾日（September 28th）」時，介系詞固定用「on」。"
  },
  {
    "id": "hwg_b9_1038",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "My sister's birthday is ______ September.",
    "options": [
      "at",
      "for",
      "in",
      "on"
    ],
    "answer": 2,
    "explanation": "僅指出「月份（September）」而無日期數字時，介系詞固定用「in」。"
  },
  {
    "id": "hwg_b9_1039",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Dylan's birthday is ______ October 10th.",
    "options": [
      "of",
      "on",
      "in",
      "at"
    ],
    "answer": 1,
    "explanation": "明確指出「幾月幾日（October 10th）」時，介系詞固定用「on」。"
  },
  {
    "id": "hwg_b9_1040",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "My sister's birthday is ______ October.",
    "options": [
      "in",
      "on",
      "at",
      "for"
    ],
    "answer": 0,
    "explanation": "僅指出「月份（October）」而無日期數字時，介系詞固定用「in」。"
  },
  {
    "id": "hwg_b9_1041",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Lucas's birthday is ______ November 5th.",
    "options": [
      "in",
      "at",
      "of",
      "on"
    ],
    "answer": 3,
    "explanation": "明確指出「幾月幾日（November 5th）」時，介系詞固定用「on」。"
  },
  {
    "id": "hwg_b9_1042",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "My sister's birthday is ______ November.",
    "options": [
      "at",
      "for",
      "in",
      "on"
    ],
    "answer": 2,
    "explanation": "僅指出「月份（November）」而無日期數字時，介系詞固定用「in」。"
  },
  {
    "id": "hwg_b9_1043",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "Max's birthday is ______ December 25th.",
    "options": [
      "of",
      "on",
      "in",
      "at"
    ],
    "answer": 1,
    "explanation": "明確指出「幾月幾日（December 25th）」時，介系詞固定用「on」。"
  },
  {
    "id": "hwg_b9_1044",
    "book": 9,
    "unit": "Unit 4",
    "category": "grammar",
    "question": "My sister's birthday is ______ December.",
    "options": [
      "in",
      "on",
      "at",
      "for"
    ],
    "answer": 0,
    "explanation": "僅指出「月份（December）」而無日期數字時，介系詞固定用「in」。"
  },
  {
    "id": "hwg_bg1_1045",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請問在大寫字母「A」後面的字母是哪一個？",
    "options": [
      "D",
      "P",
      "R",
      "B"
    ],
    "answer": 3,
    "explanation": "依照字母順序 A 接下來的字母是「B」。"
  },
  {
    "id": "hwg_bg1_1046",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請問在大寫字母「B」後面的字母是哪一個？",
    "options": [
      "O",
      "Q",
      "C",
      "G"
    ],
    "answer": 2,
    "explanation": "依照字母順序 B 接下來的字母是「C」。"
  },
  {
    "id": "hwg_bg1_1047",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請問在大寫字母「C」後面的字母是哪一個？",
    "options": [
      "P",
      "D",
      "B",
      "O"
    ],
    "answer": 1,
    "explanation": "依照字母順序 C 接下來的字母是「D」。"
  },
  {
    "id": "hwg_bg1_1048",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請問在大寫字母「D」後面的字母是哪一個？",
    "options": [
      "E",
      "F",
      "B",
      "H"
    ],
    "answer": 0,
    "explanation": "依照字母順序 D 接下來的字母是「E」。"
  },
  {
    "id": "hwg_bg1_1049",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請問在大寫字母「E」後面的字母是哪一個？",
    "options": [
      "P",
      "F",
      "T"
    ],
    "answer": 1,
    "explanation": "依照字母順序 E 接下來的字母是「F」。"
  },
  {
    "id": "hwg_bg1_1050",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請問在大寫字母「F」後面的字母是哪一個？",
    "options": [
      "O",
      "Q",
      "G",
      "C"
    ],
    "answer": 2,
    "explanation": "依照字母順序 F 接下來的字母是「G」。"
  },
  {
    "id": "hwg_bg1_1051",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請問在大寫字母「G」後面的字母是哪一個？",
    "options": [
      "A",
      "H",
      "N",
      "M"
    ],
    "answer": 1,
    "explanation": "依照字母順序 G 接下來的字母是「H」。"
  },
  {
    "id": "hwg_bg1_1052",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請問在大寫字母「H」後面的字母是哪一個？",
    "options": [
      "I",
      "J",
      "L",
      "T"
    ],
    "answer": 0,
    "explanation": "依照字母順序 H 接下來的字母是「I」。"
  },
  {
    "id": "hwg_bg1_1053",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請問在大寫字母「I」後面的字母是哪一個？",
    "options": [
      "J",
      "L",
      "U"
    ],
    "answer": 0,
    "explanation": "依照字母順序 I 接下來的字母是「J」。"
  },
  {
    "id": "hwg_bg1_1054",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請問在大寫字母「J」後面的字母是哪一個？",
    "options": [
      "Y",
      "R",
      "K",
      "X"
    ],
    "answer": 2,
    "explanation": "依照字母順序 J 接下來的字母是「K」。"
  },
  {
    "id": "hwg_bg1_1055",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請問在大寫字母「K」後面的字母是哪一個？",
    "options": [
      "T",
      "L",
      "I",
      "J"
    ],
    "answer": 1,
    "explanation": "依照字母順序 K 接下來的字母是「L」。"
  },
  {
    "id": "hwg_bg1_1056",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請問在大寫字母「L」後面的字母是哪一個？",
    "options": [
      "M",
      "W",
      "N",
      "V"
    ],
    "answer": 0,
    "explanation": "依照字母順序 L 接下來的字母是「M」。"
  },
  {
    "id": "hwg_bg1_1057",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請問在大寫字母「M」後面的字母是哪一個？",
    "options": [
      "Z",
      "H",
      "N"
    ],
    "answer": 2,
    "explanation": "依照字母順序 M 接下來的字母是「N」。"
  },
  {
    "id": "hwg_bg1_1058",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請問在大寫字母「N」後面的字母是哪一個？",
    "options": [
      "C",
      "D",
      "O",
      "Q"
    ],
    "answer": 2,
    "explanation": "依照字母順序 N 接下來的字母是「O」。"
  },
  {
    "id": "hwg_bg1_1059",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請問在大寫字母「O」後面的字母是哪一個？",
    "options": [
      "F",
      "P",
      "R",
      "B"
    ],
    "answer": 1,
    "explanation": "依照字母順序 O 接下來的字母是「P」。"
  },
  {
    "id": "hwg_bg1_1060",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請問在大寫字母「P」後面的字母是哪一個？",
    "options": [
      "Q",
      "O",
      "G",
      "C"
    ],
    "answer": 0,
    "explanation": "依照字母順序 P 接下來的字母是「Q」。"
  },
  {
    "id": "hwg_bg1_1061",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請問在大寫字母「Q」後面的字母是哪一個？",
    "options": [
      "P",
      "B",
      "K",
      "R"
    ],
    "answer": 3,
    "explanation": "依照字母順序 Q 接下來的字母是「R」。"
  },
  {
    "id": "hwg_bg1_1062",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請問在大寫字母「R」後面的字母是哪一個？",
    "options": [
      "C",
      "G",
      "S",
      "Z"
    ],
    "answer": 2,
    "explanation": "依照字母順序 R 接下來的字母是「S」。"
  },
  {
    "id": "hwg_bg1_1063",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請問在大寫字母「S」後面的字母是哪一個？",
    "options": [
      "L",
      "T",
      "I",
      "F"
    ],
    "answer": 1,
    "explanation": "依照字母順序 S 接下來的字母是「T」。"
  },
  {
    "id": "hwg_bg1_1064",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請問在大寫字母「T」後面的字母是哪一個？",
    "options": [
      "U",
      "V",
      "W",
      "J"
    ],
    "answer": 0,
    "explanation": "依照字母順序 T 接下來的字母是「U」。"
  },
  {
    "id": "hwg_bg1_1065",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "grammar",
    "question": "請問在大寫字母「U」後面的字母是哪一個？",
    "options": [
      "V",
      "W",
      "Y"
    ],
    "answer": 0,
    "explanation": "依照字母順序 U 接下來的字母是「V」。"
  },
  {
    "id": "hwg_bg1_1066",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "grammar",
    "question": "請問在大寫字母「V」後面的字母是哪一個？",
    "options": [
      "M",
      "U",
      "W"
    ],
    "answer": 2,
    "explanation": "依照字母順序 V 接下來的字母是「W」。"
  },
  {
    "id": "hwg_bg1_1067",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "grammar",
    "question": "請問在大寫字母「W」後面的字母是哪一個？",
    "options": [
      "Z",
      "X",
      "K",
      "Y"
    ],
    "answer": 1,
    "explanation": "依照字母順序 W 接下來的字母是「X」。"
  },
  {
    "id": "hwg_bg1_1068",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "grammar",
    "question": "請問在大寫字母「X」後面的字母是哪一個？",
    "options": [
      "Y",
      "V",
      "T"
    ],
    "answer": 0,
    "explanation": "依照字母順序 X 接下來的字母是「Y」。"
  },
  {
    "id": "hwg_bg1_1069",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "grammar",
    "question": "請問在大寫字母「Y」後面的字母是哪一個？",
    "options": [
      "S",
      "N",
      "X",
      "Z"
    ],
    "answer": 3,
    "explanation": "依照字母順序 Y 接下來的字母是「Z」。"
  },
  {
    "id": "hwg_bg1_1070",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請問在大寫字母「B」前面的字母是哪一個？",
    "options": [
      "H",
      "X",
      "A",
      "V"
    ],
    "answer": 2,
    "explanation": "依照字母順序排在 B 前面的字母是「A」。"
  },
  {
    "id": "hwg_bg1_1071",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請問在大寫字母「C」前面的字母是哪一個？",
    "options": [
      "R",
      "B",
      "D",
      "P"
    ],
    "answer": 1,
    "explanation": "依照字母順序排在 C 前面的字母是「B」。"
  },
  {
    "id": "hwg_bg1_1072",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請問在大寫字母「D」前面的字母是哪一個？",
    "options": [
      "C",
      "G",
      "O",
      "Q"
    ],
    "answer": 0,
    "explanation": "依照字母順序排在 D 前面的字母是「C」。"
  },
  {
    "id": "hwg_bg1_1073",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請問在大寫字母「E」前面的字母是哪一個？",
    "options": [
      "B",
      "O",
      "P",
      "D"
    ],
    "answer": 3,
    "explanation": "依照字母順序排在 E 前面的字母是「D」。"
  },
  {
    "id": "hwg_bg1_1074",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請問在大寫字母「F」前面的字母是哪一個？",
    "options": [
      "E",
      "B",
      "H"
    ],
    "answer": 0,
    "explanation": "依照字母順序排在 F 前面的字母是「E」。"
  },
  {
    "id": "hwg_bg1_1075",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請問在大寫字母「G」前面的字母是哪一個？",
    "options": [
      "P",
      "F",
      "E",
      "T"
    ],
    "answer": 1,
    "explanation": "依照字母順序排在 G 前面的字母是「F」。"
  },
  {
    "id": "hwg_bg1_1076",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請問在大寫字母「H」前面的字母是哪一個？",
    "options": [
      "G",
      "C",
      "O",
      "Q"
    ],
    "answer": 0,
    "explanation": "依照字母順序排在 H 前面的字母是「G」。"
  },
  {
    "id": "hwg_bg1_1077",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請問在大寫字母「I」前面的字母是哪一個？",
    "options": [
      "N",
      "M",
      "A",
      "H"
    ],
    "answer": 3,
    "explanation": "依照字母順序排在 I 前面的字母是「H」。"
  },
  {
    "id": "hwg_bg1_1078",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請問在大寫字母「J」前面的字母是哪一個？",
    "options": [
      "L",
      "T",
      "I"
    ],
    "answer": 2,
    "explanation": "依照字母順序排在 J 前面的字母是「I」。"
  },
  {
    "id": "hwg_bg1_1079",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請問在大寫字母「K」前面的字母是哪一個？",
    "options": [
      "U",
      "J",
      "I",
      "L"
    ],
    "answer": 1,
    "explanation": "依照字母順序排在 K 前面的字母是「J」。"
  },
  {
    "id": "hwg_bg1_1080",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請問在大寫字母「L」前面的字母是哪一個？",
    "options": [
      "K",
      "X",
      "Y",
      "R"
    ],
    "answer": 0,
    "explanation": "依照字母順序排在 L 前面的字母是「K」。"
  },
  {
    "id": "hwg_bg1_1081",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請問在大寫字母「M」前面的字母是哪一個？",
    "options": [
      "I",
      "J",
      "T",
      "L"
    ],
    "answer": 3,
    "explanation": "依照字母順序排在 M 前面的字母是「L」。"
  },
  {
    "id": "hwg_bg1_1082",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請問在大寫字母「N」前面的字母是哪一個？",
    "options": [
      "V",
      "M",
      "W"
    ],
    "answer": 1,
    "explanation": "依照字母順序排在 N 前面的字母是「M」。"
  },
  {
    "id": "hwg_bg1_1083",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請問在大寫字母「O」前面的字母是哪一個？",
    "options": [
      "H",
      "N",
      "M",
      "Z"
    ],
    "answer": 1,
    "explanation": "依照字母順序排在 O 前面的字母是「N」。"
  },
  {
    "id": "hwg_bg1_1084",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請問在大寫字母「P」前面的字母是哪一個？",
    "options": [
      "O",
      "Q",
      "C",
      "D"
    ],
    "answer": 0,
    "explanation": "依照字母順序排在 P 前面的字母是「O」。"
  },
  {
    "id": "hwg_bg1_1085",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請問在大寫字母「Q」前面的字母是哪一個？",
    "options": [
      "R",
      "B",
      "F",
      "P"
    ],
    "answer": 3,
    "explanation": "依照字母順序排在 Q 前面的字母是「P」。"
  },
  {
    "id": "hwg_bg1_1086",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請問在大寫字母「R」前面的字母是哪一個？",
    "options": [
      "G",
      "C",
      "Q",
      "O"
    ],
    "answer": 2,
    "explanation": "依照字母順序排在 R 前面的字母是「Q」。"
  },
  {
    "id": "hwg_bg1_1087",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請問在大寫字母「S」前面的字母是哪一個？",
    "options": [
      "K",
      "R",
      "P",
      "B"
    ],
    "answer": 1,
    "explanation": "依照字母順序排在 S 前面的字母是「R」。"
  },
  {
    "id": "hwg_bg1_1088",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請問在大寫字母「T」前面的字母是哪一個？",
    "options": [
      "S",
      "Z",
      "C",
      "G"
    ],
    "answer": 0,
    "explanation": "依照字母順序排在 T 前面的字母是「S」。"
  },
  {
    "id": "hwg_bg1_1089",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "grammar",
    "question": "請問在大寫字母「U」前面的字母是哪一個？",
    "options": [
      "I",
      "F",
      "L",
      "T"
    ],
    "answer": 3,
    "explanation": "依照字母順序排在 U 前面的字母是「T」。"
  },
  {
    "id": "hwg_bg1_1090",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "grammar",
    "question": "請問在大寫字母「V」前面的字母是哪一個？",
    "options": [
      "W",
      "J",
      "U"
    ],
    "answer": 2,
    "explanation": "依照字母順序排在 V 前面的字母是「U」。"
  },
  {
    "id": "hwg_bg1_1091",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "grammar",
    "question": "請問在大寫字母「W」前面的字母是哪一個？",
    "options": [
      "Y",
      "V",
      "U"
    ],
    "answer": 1,
    "explanation": "依照字母順序排在 W 前面的字母是「V」。"
  },
  {
    "id": "hwg_bg1_1092",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "grammar",
    "question": "請問在大寫字母「X」前面的字母是哪一個？",
    "options": [
      "W",
      "M",
      "V",
      "U"
    ],
    "answer": 0,
    "explanation": "依照字母順序排在 X 前面的字母是「W」。"
  },
  {
    "id": "hwg_bg1_1093",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "grammar",
    "question": "請問在大寫字母「Y」前面的字母是哪一個？",
    "options": [
      "K",
      "Z",
      "X"
    ],
    "answer": 2,
    "explanation": "依照字母順序排在 Y 前面的字母是「X」。"
  },
  {
    "id": "hwg_bg1_1094",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "grammar",
    "question": "請問在大寫字母「Z」前面的字母是哪一個？",
    "options": [
      "X",
      "T",
      "Y",
      "V"
    ],
    "answer": 2,
    "explanation": "依照字母順序排在 Z 前面的字母是「Y」。"
  },
  {
    "id": "hwg_bg1_1095",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：A, ______, C, D",
    "options": [
      "R",
      "B",
      "D",
      "P"
    ],
    "answer": 1,
    "explanation": "依照大寫字母順序為：A, B, C, D，故空格應填「B」。"
  },
  {
    "id": "hwg_bg1_1096",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：A, B, ______, D",
    "options": [
      "C",
      "G",
      "O",
      "Q"
    ],
    "answer": 0,
    "explanation": "依照大寫字母順序為：A, B, C, D，故空格應填「C」。"
  },
  {
    "id": "hwg_bg1_1097",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：B, ______, D, E",
    "options": [
      "G",
      "O",
      "Q",
      "C"
    ],
    "answer": 3,
    "explanation": "依照大寫字母順序為：B, C, D, E，故空格應填「C」。"
  },
  {
    "id": "hwg_bg1_1098",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：B, C, ______, E",
    "options": [
      "O",
      "P",
      "D",
      "B"
    ],
    "answer": 2,
    "explanation": "依照大寫字母順序為：B, C, D, E，故空格應填「D」。"
  },
  {
    "id": "hwg_bg1_1099",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：C, ______, E, F",
    "options": [
      "P",
      "D",
      "B",
      "O"
    ],
    "answer": 1,
    "explanation": "依照大寫字母順序為：C, D, E, F，故空格應填「D」。"
  },
  {
    "id": "hwg_bg1_1100",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：C, D, ______, F",
    "options": [
      "E",
      "F",
      "B",
      "H"
    ],
    "answer": 0,
    "explanation": "依照大寫字母順序為：C, D, E, F，故空格應填「E」。"
  },
  {
    "id": "hwg_bg1_1101",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：D, ______, F, G",
    "options": [
      "F",
      "B",
      "H",
      "E"
    ],
    "answer": 3,
    "explanation": "依照大寫字母順序為：D, E, F, G，故空格應填「E」。"
  },
  {
    "id": "hwg_bg1_1102",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：D, E, ______, G",
    "options": [
      "T",
      "P",
      "F",
      "E"
    ],
    "answer": 2,
    "explanation": "依照大寫字母順序為：D, E, F, G，故空格應填「F」。"
  },
  {
    "id": "hwg_bg1_1103",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：E, ______, G, H",
    "options": [
      "P",
      "F",
      "E",
      "T"
    ],
    "answer": 1,
    "explanation": "依照大寫字母順序為：E, F, G, H，故空格應填「F」。"
  },
  {
    "id": "hwg_bg1_1104",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：E, F, ______, H",
    "options": [
      "G",
      "C",
      "O",
      "Q"
    ],
    "answer": 0,
    "explanation": "依照大寫字母順序為：E, F, G, H，故空格應填「G」。"
  },
  {
    "id": "hwg_bg1_1105",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：F, ______, H, I",
    "options": [
      "C",
      "O",
      "Q",
      "G"
    ],
    "answer": 3,
    "explanation": "依照大寫字母順序為：F, G, H, I，故空格應填「G」。"
  },
  {
    "id": "hwg_bg1_1106",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：F, G, ______, I",
    "options": [
      "M",
      "A",
      "H",
      "N"
    ],
    "answer": 2,
    "explanation": "依照大寫字母順序為：F, G, H, I，故空格應填「H」。"
  },
  {
    "id": "hwg_bg1_1107",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：G, ______, I, J",
    "options": [
      "A",
      "H",
      "N",
      "M"
    ],
    "answer": 1,
    "explanation": "依照大寫字母順序為：G, H, I, J，故空格應填「H」。"
  },
  {
    "id": "hwg_bg1_1108",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：G, H, ______, J",
    "options": [
      "I",
      "J",
      "L",
      "T"
    ],
    "answer": 0,
    "explanation": "依照大寫字母順序為：G, H, I, J，故空格應填「I」。"
  },
  {
    "id": "hwg_bg1_1109",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：H, ______, J, K",
    "options": [
      "J",
      "L",
      "T",
      "I"
    ],
    "answer": 3,
    "explanation": "依照大寫字母順序為：H, I, J, K，故空格應填「I」。"
  },
  {
    "id": "hwg_bg1_1110",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：H, I, ______, K",
    "options": [
      "L",
      "U",
      "J",
      "I"
    ],
    "answer": 2,
    "explanation": "依照大寫字母順序為：H, I, J, K，故空格應填「J」。"
  },
  {
    "id": "hwg_bg1_1111",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：I, ______, K, L",
    "options": [
      "U",
      "J",
      "I",
      "L"
    ],
    "answer": 1,
    "explanation": "依照大寫字母順序為：I, J, K, L，故空格應填「J」。"
  },
  {
    "id": "hwg_bg1_1112",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：I, J, ______, L",
    "options": [
      "K",
      "X",
      "Y",
      "R"
    ],
    "answer": 0,
    "explanation": "依照大寫字母順序為：I, J, K, L，故空格應填「K」。"
  },
  {
    "id": "hwg_bg1_1113",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：J, ______, L, M",
    "options": [
      "X",
      "Y",
      "R",
      "K"
    ],
    "answer": 3,
    "explanation": "依照大寫字母順序為：J, K, L, M，故空格應填「K」。"
  },
  {
    "id": "hwg_bg1_1114",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：J, K, ______, M",
    "options": [
      "J",
      "T",
      "L",
      "I"
    ],
    "answer": 2,
    "explanation": "依照大寫字母順序為：J, K, L, M，故空格應填「L」。"
  },
  {
    "id": "hwg_bg1_1115",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：K, ______, M, N",
    "options": [
      "T",
      "L",
      "I",
      "J"
    ],
    "answer": 1,
    "explanation": "依照大寫字母順序為：K, L, M, N，故空格應填「L」。"
  },
  {
    "id": "hwg_bg1_1116",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：K, L, ______, N",
    "options": [
      "M",
      "W",
      "N",
      "V"
    ],
    "answer": 0,
    "explanation": "依照大寫字母順序為：K, L, M, N，故空格應填「M」。"
  },
  {
    "id": "hwg_bg1_1117",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：L, ______, N, O",
    "options": [
      "W",
      "N",
      "V",
      "M"
    ],
    "answer": 3,
    "explanation": "依照大寫字母順序為：L, M, N, O，故空格應填「M」。"
  },
  {
    "id": "hwg_bg1_1118",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：L, M, ______, O",
    "options": [
      "Z",
      "H",
      "N",
      "M"
    ],
    "answer": 2,
    "explanation": "依照大寫字母順序為：L, M, N, O，故空格應填「N」。"
  },
  {
    "id": "hwg_bg1_1119",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：M, ______, O, P",
    "options": [
      "H",
      "N",
      "M",
      "Z"
    ],
    "answer": 1,
    "explanation": "依照大寫字母順序為：M, N, O, P，故空格應填「N」。"
  },
  {
    "id": "hwg_bg1_1120",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：M, N, ______, P",
    "options": [
      "O",
      "Q",
      "C",
      "D"
    ],
    "answer": 0,
    "explanation": "依照大寫字母順序為：M, N, O, P，故空格應填「O」。"
  },
  {
    "id": "hwg_bg1_1121",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：N, ______, P, Q",
    "options": [
      "Q",
      "C",
      "D",
      "O"
    ],
    "answer": 3,
    "explanation": "依照大寫字母順序為：N, O, P, Q，故空格應填「O」。"
  },
  {
    "id": "hwg_bg1_1122",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：N, O, ______, Q",
    "options": [
      "B",
      "F",
      "P",
      "R"
    ],
    "answer": 2,
    "explanation": "依照大寫字母順序為：N, O, P, Q，故空格應填「P」。"
  },
  {
    "id": "hwg_bg1_1123",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：O, ______, Q, R",
    "options": [
      "F",
      "P",
      "R",
      "B"
    ],
    "answer": 1,
    "explanation": "依照大寫字母順序為：O, P, Q, R，故空格應填「P」。"
  },
  {
    "id": "hwg_bg1_1124",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：O, P, ______, R",
    "options": [
      "Q",
      "O",
      "G",
      "C"
    ],
    "answer": 0,
    "explanation": "依照大寫字母順序為：O, P, Q, R，故空格應填「Q」。"
  },
  {
    "id": "hwg_bg1_1125",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：P, ______, R, S",
    "options": [
      "O",
      "G",
      "C",
      "Q"
    ],
    "answer": 3,
    "explanation": "依照大寫字母順序為：P, Q, R, S，故空格應填「Q」。"
  },
  {
    "id": "hwg_bg1_1126",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：P, Q, ______, S",
    "options": [
      "B",
      "K",
      "R",
      "P"
    ],
    "answer": 2,
    "explanation": "依照大寫字母順序為：P, Q, R, S，故空格應填「R」。"
  },
  {
    "id": "hwg_bg1_1127",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：Q, ______, S, T",
    "options": [
      "K",
      "R",
      "P",
      "B"
    ],
    "answer": 1,
    "explanation": "依照大寫字母順序為：Q, R, S, T，故空格應填「R」。"
  },
  {
    "id": "hwg_bg1_1128",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：Q, R, ______, T",
    "options": [
      "S",
      "Z",
      "C",
      "G"
    ],
    "answer": 0,
    "explanation": "依照大寫字母順序為：Q, R, S, T，故空格應填「S」。"
  },
  {
    "id": "hwg_bg1_1129",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：R, ______, T, U",
    "options": [
      "Z",
      "C",
      "G",
      "S"
    ],
    "answer": 3,
    "explanation": "依照大寫字母順序為：R, S, T, U，故空格應填「S」。"
  },
  {
    "id": "hwg_bg1_1130",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：R, S, ______, U",
    "options": [
      "F",
      "L",
      "T",
      "I"
    ],
    "answer": 2,
    "explanation": "依照大寫字母順序為：R, S, T, U，故空格應填「T」。"
  },
  {
    "id": "hwg_bg1_1131",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：S, ______, U, V",
    "options": [
      "L",
      "T",
      "I",
      "F"
    ],
    "answer": 1,
    "explanation": "依照大寫字母順序為：S, T, U, V，故空格應填「T」。"
  },
  {
    "id": "hwg_bg1_1132",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：S, T, ______, V",
    "options": [
      "U",
      "V",
      "W",
      "J"
    ],
    "answer": 0,
    "explanation": "依照大寫字母順序為：S, T, U, V，故空格應填「U」。"
  },
  {
    "id": "hwg_bg1_1133",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：T, ______, V, W",
    "options": [
      "V",
      "W",
      "J",
      "U"
    ],
    "answer": 3,
    "explanation": "依照大寫字母順序為：T, U, V, W，故空格應填「U」。"
  },
  {
    "id": "hwg_bg1_1134",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：T, U, ______, W",
    "options": [
      "W",
      "Y",
      "V",
      "U"
    ],
    "answer": 2,
    "explanation": "依照大寫字母順序為：T, U, V, W，故空格應填「V」。"
  },
  {
    "id": "hwg_bg1_1135",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：U, ______, W, X",
    "options": [
      "Y",
      "V",
      "U",
      "W"
    ],
    "answer": 1,
    "explanation": "依照大寫字母順序為：U, V, W, X，故空格應填「V」。"
  },
  {
    "id": "hwg_bg1_1136",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：U, V, ______, X",
    "options": [
      "W",
      "M",
      "V",
      "U"
    ],
    "answer": 0,
    "explanation": "依照大寫字母順序為：U, V, W, X，故空格應填「W」。"
  },
  {
    "id": "hwg_bg1_1137",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：V, ______, X, Y",
    "options": [
      "M",
      "V",
      "U",
      "W"
    ],
    "answer": 3,
    "explanation": "依照大寫字母順序為：V, W, X, Y，故空格應填「W」。"
  },
  {
    "id": "hwg_bg1_1138",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：V, W, ______, Y",
    "options": [
      "Y",
      "Z",
      "X",
      "K"
    ],
    "answer": 2,
    "explanation": "依照大寫字母順序為：V, W, X, Y，故空格應填「X」。"
  },
  {
    "id": "hwg_bg1_1139",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：W, ______, Y, Z",
    "options": [
      "Z",
      "X",
      "K",
      "Y"
    ],
    "answer": 1,
    "explanation": "依照大寫字母順序為：W, X, Y, Z，故空格應填「X」。"
  },
  {
    "id": "hwg_bg1_1140",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "grammar",
    "question": "請選出空格中正確的大寫字母：W, X, ______, Z",
    "options": [
      "Y",
      "V",
      "X",
      "T"
    ],
    "answer": 0,
    "explanation": "依照大寫字母順序為：W, X, Y, Z，故空格應填「Y」。"
  },
  {
    "id": "hwg_bg1_1141",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "A, C, B",
      "B, A, C",
      "C, B, A",
      "A, B, C"
    ],
    "answer": 3,
    "explanation": "正確的大寫字母順序為「A, B, C」。"
  },
  {
    "id": "hwg_bg1_1142",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "C, B, D",
      "D, C, B",
      "B, C, D",
      "B, D, C"
    ],
    "answer": 2,
    "explanation": "正確的大寫字母順序為「B, C, D」。"
  },
  {
    "id": "hwg_bg1_1143",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "E, D, C",
      "C, D, E",
      "C, E, D",
      "D, C, E"
    ],
    "answer": 1,
    "explanation": "正確的大寫字母順序為「C, D, E」。"
  },
  {
    "id": "hwg_bg1_1144",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "D, E, F",
      "D, F, E",
      "E, D, F",
      "F, E, D"
    ],
    "answer": 0,
    "explanation": "正確的大寫字母順序為「D, E, F」。"
  },
  {
    "id": "hwg_bg1_1145",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "E, G, F",
      "F, E, G",
      "G, F, E",
      "E, F, G"
    ],
    "answer": 3,
    "explanation": "正確的大寫字母順序為「E, F, G」。"
  },
  {
    "id": "hwg_bg1_1146",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "G, F, H",
      "H, G, F",
      "F, G, H",
      "F, H, G"
    ],
    "answer": 2,
    "explanation": "正確的大寫字母順序為「F, G, H」。"
  },
  {
    "id": "hwg_bg1_1147",
    "book": "g1",
    "unit": "Unit 1 (A~G)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "I, H, G",
      "G, H, I",
      "G, I, H",
      "H, G, I"
    ],
    "answer": 1,
    "explanation": "正確的大寫字母順序為「G, H, I」。"
  },
  {
    "id": "hwg_bg1_1148",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "H, I, J",
      "H, J, I",
      "I, H, J",
      "J, I, H"
    ],
    "answer": 0,
    "explanation": "正確的大寫字母順序為「H, I, J」。"
  },
  {
    "id": "hwg_bg1_1149",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "I, K, J",
      "J, I, K",
      "K, J, I",
      "I, J, K"
    ],
    "answer": 3,
    "explanation": "正確的大寫字母順序為「I, J, K」。"
  },
  {
    "id": "hwg_bg1_1150",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "K, J, L",
      "L, K, J",
      "J, K, L",
      "J, L, K"
    ],
    "answer": 2,
    "explanation": "正確的大寫字母順序為「J, K, L」。"
  },
  {
    "id": "hwg_bg1_1151",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "M, L, K",
      "K, L, M",
      "K, M, L",
      "L, K, M"
    ],
    "answer": 1,
    "explanation": "正確的大寫字母順序為「K, L, M」。"
  },
  {
    "id": "hwg_bg1_1152",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "L, M, N",
      "L, N, M",
      "M, L, N",
      "N, M, L"
    ],
    "answer": 0,
    "explanation": "正確的大寫字母順序為「L, M, N」。"
  },
  {
    "id": "hwg_bg1_1153",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "M, O, N",
      "N, M, O",
      "O, N, M",
      "M, N, O"
    ],
    "answer": 3,
    "explanation": "正確的大寫字母順序為「M, N, O」。"
  },
  {
    "id": "hwg_bg1_1154",
    "book": "g1",
    "unit": "Unit 2 (H~N)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "O, N, P",
      "P, O, N",
      "N, O, P",
      "N, P, O"
    ],
    "answer": 2,
    "explanation": "正確的大寫字母順序為「N, O, P」。"
  },
  {
    "id": "hwg_bg1_1155",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "Q, P, O",
      "O, P, Q",
      "O, Q, P",
      "P, O, Q"
    ],
    "answer": 1,
    "explanation": "正確的大寫字母順序為「O, P, Q」。"
  },
  {
    "id": "hwg_bg1_1156",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "P, Q, R",
      "P, R, Q",
      "Q, P, R",
      "R, Q, P"
    ],
    "answer": 0,
    "explanation": "正確的大寫字母順序為「P, Q, R」。"
  },
  {
    "id": "hwg_bg1_1157",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "Q, S, R",
      "R, Q, S",
      "S, R, Q",
      "Q, R, S"
    ],
    "answer": 3,
    "explanation": "正確的大寫字母順序為「Q, R, S」。"
  },
  {
    "id": "hwg_bg1_1158",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "S, R, T",
      "T, S, R",
      "R, S, T",
      "R, T, S"
    ],
    "answer": 2,
    "explanation": "正確的大寫字母順序為「R, S, T」。"
  },
  {
    "id": "hwg_bg1_1159",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "U, T, S",
      "S, T, U",
      "S, U, T",
      "T, S, U"
    ],
    "answer": 1,
    "explanation": "正確的大寫字母順序為「S, T, U」。"
  },
  {
    "id": "hwg_bg1_1160",
    "book": "g1",
    "unit": "Unit 3 (O~T)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "T, U, V",
      "T, V, U",
      "U, T, V",
      "V, U, T"
    ],
    "answer": 0,
    "explanation": "正確的大寫字母順序為「T, U, V」。"
  },
  {
    "id": "hwg_bg1_1161",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "U, W, V",
      "V, U, W",
      "W, V, U",
      "U, V, W"
    ],
    "answer": 3,
    "explanation": "正確的大寫字母順序為「U, V, W」。"
  },
  {
    "id": "hwg_bg1_1162",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "W, V, X",
      "X, W, V",
      "V, W, X",
      "V, X, W"
    ],
    "answer": 2,
    "explanation": "正確的大寫字母順序為「V, W, X」。"
  },
  {
    "id": "hwg_bg1_1163",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "Y, X, W",
      "W, X, Y",
      "W, Y, X",
      "X, W, Y"
    ],
    "answer": 1,
    "explanation": "正確的大寫字母順序為「W, X, Y」。"
  },
  {
    "id": "hwg_bg1_1164",
    "book": "g1",
    "unit": "Unit 4 (U~Z)",
    "category": "dialogue",
    "question": "請問下列哪一組大寫字母的「先後順序」是正確的？",
    "options": [
      "X, Y, Z",
      "X, Z, Y",
      "Y, X, Z",
      "Z, Y, X"
    ],
    "answer": 0,
    "explanation": "正確的大寫字母順序為「X, Y, Z」。"
  },
  {
    "id": "hwg_bg2_1165",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "grammar",
    "question": "請問大寫字母「A」的小寫是哪一個？",
    "options": [
      "o",
      "e",
      "c",
      "a"
    ],
    "answer": 3,
    "explanation": "大寫字母「A」對應的小寫字母為「a」。"
  },
  {
    "id": "hwg_bg2_1166",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "grammar",
    "question": "請問大寫字母「B」的小寫是哪一個？",
    "options": [
      "p",
      "q",
      "b",
      "d"
    ],
    "answer": 2,
    "explanation": "大寫字母「B」對應的小寫字母為「b」。"
  },
  {
    "id": "hwg_bg2_1167",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "grammar",
    "question": "請問大寫字母「C」的小寫是哪一個？",
    "options": [
      "a",
      "c",
      "o",
      "e"
    ],
    "answer": 1,
    "explanation": "大寫字母「C」對應的小寫字母為「c」。"
  },
  {
    "id": "hwg_bg2_1168",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "grammar",
    "question": "請問大寫字母「D」的小寫是哪一個？",
    "options": [
      "d",
      "b",
      "p",
      "q"
    ],
    "answer": 0,
    "explanation": "大寫字母「D」對應的小寫字母為「d」。"
  },
  {
    "id": "hwg_bg2_1169",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "grammar",
    "question": "請問大寫字母「E」的小寫是哪一個？",
    "options": [
      "c",
      "a",
      "o",
      "e"
    ],
    "answer": 3,
    "explanation": "大寫字母「E」對應的小寫字母為「e」。"
  },
  {
    "id": "hwg_bg2_1170",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "grammar",
    "question": "請問大寫字母「F」的小寫是哪一個？",
    "options": [
      "r",
      "l",
      "f",
      "t"
    ],
    "answer": 2,
    "explanation": "大寫字母「F」對應的小寫字母為「f」。"
  },
  {
    "id": "hwg_bg2_1171",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "grammar",
    "question": "請問大寫字母「G」的小寫是哪一個？",
    "options": [
      "y",
      "g",
      "q",
      "j"
    ],
    "answer": 1,
    "explanation": "大寫字母「G」對應的小寫字母為「g」。"
  },
  {
    "id": "hwg_bg2_1172",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "grammar",
    "question": "請問大寫字母「H」的小寫是哪一個？",
    "options": [
      "h",
      "n",
      "r",
      "b"
    ],
    "answer": 0,
    "explanation": "大寫字母「H」對應的小寫字母為「h」。"
  },
  {
    "id": "hwg_bg2_1173",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "grammar",
    "question": "請問大寫字母「I」的小寫是哪一個？",
    "options": [
      "j",
      "l",
      "t",
      "i"
    ],
    "answer": 3,
    "explanation": "大寫字母「I」對應的小寫字母為「i」。"
  },
  {
    "id": "hwg_bg2_1174",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "grammar",
    "question": "請問大寫字母「J」的小寫是哪一個？",
    "options": [
      "g",
      "y",
      "j",
      "i"
    ],
    "answer": 2,
    "explanation": "大寫字母「J」對應的小寫字母為「j」。"
  },
  {
    "id": "hwg_bg2_1175",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "grammar",
    "question": "請問大寫字母「K」的小寫是哪一個？",
    "options": [
      "r",
      "k",
      "h",
      "x"
    ],
    "answer": 1,
    "explanation": "大寫字母「K」對應的小寫字母為「k」。"
  },
  {
    "id": "hwg_bg2_1176",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "grammar",
    "question": "請問大寫字母「L」的小寫是哪一個？",
    "options": [
      "l",
      "i",
      "t",
      "j"
    ],
    "answer": 0,
    "explanation": "大寫字母「L」對應的小寫字母為「l」。"
  },
  {
    "id": "hwg_bg2_1177",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "grammar",
    "question": "請問大寫字母「M」的小寫是哪一個？",
    "options": [
      "n",
      "w",
      "u",
      "m"
    ],
    "answer": 3,
    "explanation": "大寫字母「M」對應的小寫字母為「m」。"
  },
  {
    "id": "hwg_bg2_1178",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "grammar",
    "question": "請問大寫字母「N」的小寫是哪一個？",
    "options": [
      "u",
      "h",
      "n",
      "m"
    ],
    "answer": 2,
    "explanation": "大寫字母「N」對應的小寫字母為「n」。"
  },
  {
    "id": "hwg_bg2_1179",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "grammar",
    "question": "請問大寫字母「O」的小寫是哪一個？",
    "options": [
      "e",
      "o",
      "c",
      "a"
    ],
    "answer": 1,
    "explanation": "大寫字母「O」對應的小寫字母為「o」。"
  },
  {
    "id": "hwg_bg2_1180",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "grammar",
    "question": "請問大寫字母「P」的小寫是哪一個？",
    "options": [
      "p",
      "q",
      "b",
      "d"
    ],
    "answer": 0,
    "explanation": "大寫字母「P」對應的小寫字母為「p」。"
  },
  {
    "id": "hwg_bg2_1181",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "grammar",
    "question": "請問大寫字母「Q」的小寫是哪一個？",
    "options": [
      "p",
      "g",
      "d",
      "q"
    ],
    "answer": 3,
    "explanation": "大寫字母「Q」對應的小寫字母為「q」。"
  },
  {
    "id": "hwg_bg2_1182",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "grammar",
    "question": "請問大寫字母「R」的小寫是哪一個？",
    "options": [
      "v",
      "f",
      "r",
      "n"
    ],
    "answer": 2,
    "explanation": "大寫字母「R」對應的小寫字母為「r」。"
  },
  {
    "id": "hwg_bg2_1183",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "grammar",
    "question": "請問大寫字母「S」的小寫是哪一個？",
    "options": [
      "x",
      "s",
      "z",
      "c"
    ],
    "answer": 1,
    "explanation": "大寫字母「S」對應的小寫字母為「s」。"
  },
  {
    "id": "hwg_bg2_1184",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "grammar",
    "question": "請問大寫字母「T」的小寫是哪一個？",
    "options": [
      "t",
      "f",
      "l",
      "i"
    ],
    "answer": 0,
    "explanation": "大寫字母「T」對應的小寫字母為「t」。"
  },
  {
    "id": "hwg_bg2_1185",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "grammar",
    "question": "請問大寫字母「U」的小寫是哪一個？",
    "options": [
      "n",
      "v",
      "w",
      "u"
    ],
    "answer": 3,
    "explanation": "大寫字母「U」對應的小寫字母為「u」。"
  },
  {
    "id": "hwg_bg2_1186",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "grammar",
    "question": "請問大寫字母「V」的小寫是哪一個？",
    "options": [
      "w",
      "y",
      "v",
      "u"
    ],
    "answer": 2,
    "explanation": "大寫字母「V」對應的小寫字母為「v」。"
  },
  {
    "id": "hwg_bg2_1187",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "grammar",
    "question": "請問大寫字母「W」的小寫是哪一個？",
    "options": [
      "u",
      "w",
      "m",
      "v"
    ],
    "answer": 1,
    "explanation": "大寫字母「W」對應的小寫字母為「w」。"
  },
  {
    "id": "hwg_bg2_1188",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "grammar",
    "question": "請問大寫字母「X」的小寫是哪一個？",
    "options": [
      "x",
      "k",
      "z",
      "s"
    ],
    "answer": 0,
    "explanation": "大寫字母「X」對應的小寫字母為「x」。"
  },
  {
    "id": "hwg_bg2_1189",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "grammar",
    "question": "請問大寫字母「Y」的小寫是哪一個？",
    "options": [
      "g",
      "j",
      "v",
      "y"
    ],
    "answer": 3,
    "explanation": "大寫字母「Y」對應的小寫字母為「y」。"
  },
  {
    "id": "hwg_bg2_1190",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "grammar",
    "question": "請問大寫字母「Z」的小寫是哪一個？",
    "options": [
      "x",
      "n",
      "z",
      "s"
    ],
    "answer": 2,
    "explanation": "大寫字母「Z」對應的小寫字母為「z」。"
  },
  {
    "id": "hwg_bg2_1191",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "grammar",
    "question": "請問小寫字母「a」的大寫是哪一個？",
    "options": [
      "C",
      "A",
      "O",
      "E"
    ],
    "answer": 1,
    "explanation": "小寫字母「a」對應的大寫字母為「A」。"
  },
  {
    "id": "hwg_bg2_1192",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "grammar",
    "question": "請問小寫字母「b」的大寫是哪一個？",
    "options": [
      "B",
      "D",
      "P",
      "Q"
    ],
    "answer": 0,
    "explanation": "小寫字母「b」對應的大寫字母為「B」。"
  },
  {
    "id": "hwg_bg2_1193",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "grammar",
    "question": "請問小寫字母「c」的大寫是哪一個？",
    "options": [
      "O",
      "E",
      "A",
      "C"
    ],
    "answer": 3,
    "explanation": "小寫字母「c」對應的大寫字母為「C」。"
  },
  {
    "id": "hwg_bg2_1194",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "grammar",
    "question": "請問小寫字母「d」的大寫是哪一個？",
    "options": [
      "P",
      "Q",
      "D",
      "B"
    ],
    "answer": 2,
    "explanation": "小寫字母「d」對應的大寫字母為「D」。"
  },
  {
    "id": "hwg_bg2_1195",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "grammar",
    "question": "請問小寫字母「e」的大寫是哪一個？",
    "options": [
      "O",
      "E",
      "C",
      "A"
    ],
    "answer": 1,
    "explanation": "小寫字母「e」對應的大寫字母為「E」。"
  },
  {
    "id": "hwg_bg2_1196",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "grammar",
    "question": "請問小寫字母「f」的大寫是哪一個？",
    "options": [
      "F",
      "T",
      "R",
      "L"
    ],
    "answer": 0,
    "explanation": "小寫字母「f」對應的大寫字母為「F」。"
  },
  {
    "id": "hwg_bg2_1197",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "grammar",
    "question": "請問小寫字母「g」的大寫是哪一個？",
    "options": [
      "Q",
      "J",
      "Y",
      "G"
    ],
    "answer": 3,
    "explanation": "小寫字母「g」對應的大寫字母為「G」。"
  },
  {
    "id": "hwg_bg2_1198",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "grammar",
    "question": "請問小寫字母「h」的大寫是哪一個？",
    "options": [
      "R",
      "B",
      "H",
      "N"
    ],
    "answer": 2,
    "explanation": "小寫字母「h」對應的大寫字母為「H」。"
  },
  {
    "id": "hwg_bg2_1199",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "grammar",
    "question": "請問小寫字母「i」的大寫是哪一個？",
    "options": [
      "T",
      "I",
      "J",
      "L"
    ],
    "answer": 1,
    "explanation": "小寫字母「i」對應的大寫字母為「I」。"
  },
  {
    "id": "hwg_bg2_1200",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "grammar",
    "question": "請問小寫字母「j」的大寫是哪一個？",
    "options": [
      "J",
      "I",
      "G",
      "Y"
    ],
    "answer": 0,
    "explanation": "小寫字母「j」對應的大寫字母為「J」。"
  },
  {
    "id": "hwg_bg2_1201",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "grammar",
    "question": "請問小寫字母「k」的大寫是哪一個？",
    "options": [
      "H",
      "X",
      "R",
      "K"
    ],
    "answer": 3,
    "explanation": "小寫字母「k」對應的大寫字母為「K」。"
  },
  {
    "id": "hwg_bg2_1202",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "grammar",
    "question": "請問小寫字母「l」的大寫是哪一個？",
    "options": [
      "T",
      "J",
      "L",
      "I"
    ],
    "answer": 2,
    "explanation": "小寫字母「l」對應的大寫字母為「L」。"
  },
  {
    "id": "hwg_bg2_1203",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "grammar",
    "question": "請問小寫字母「m」的大寫是哪一個？",
    "options": [
      "U",
      "M",
      "N",
      "W"
    ],
    "answer": 1,
    "explanation": "小寫字母「m」對應的大寫字母為「M」。"
  },
  {
    "id": "hwg_bg2_1204",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "grammar",
    "question": "請問小寫字母「n」的大寫是哪一個？",
    "options": [
      "N",
      "M",
      "U",
      "H"
    ],
    "answer": 0,
    "explanation": "小寫字母「n」對應的大寫字母為「N」。"
  },
  {
    "id": "hwg_bg2_1205",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "grammar",
    "question": "請問小寫字母「o」的大寫是哪一個？",
    "options": [
      "C",
      "A",
      "E",
      "O"
    ],
    "answer": 3,
    "explanation": "小寫字母「o」對應的大寫字母為「O」。"
  },
  {
    "id": "hwg_bg2_1206",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "grammar",
    "question": "請問小寫字母「p」的大寫是哪一個？",
    "options": [
      "B",
      "D",
      "P",
      "Q"
    ],
    "answer": 2,
    "explanation": "小寫字母「p」對應的大寫字母為「P」。"
  },
  {
    "id": "hwg_bg2_1207",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "grammar",
    "question": "請問小寫字母「q」的大寫是哪一個？",
    "options": [
      "D",
      "Q",
      "P",
      "G"
    ],
    "answer": 1,
    "explanation": "小寫字母「q」對應的大寫字母為「Q」。"
  },
  {
    "id": "hwg_bg2_1208",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "grammar",
    "question": "請問小寫字母「r」的大寫是哪一個？",
    "options": [
      "R",
      "N",
      "V",
      "F"
    ],
    "answer": 0,
    "explanation": "小寫字母「r」對應的大寫字母為「R」。"
  },
  {
    "id": "hwg_bg2_1209",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "grammar",
    "question": "請問小寫字母「s」的大寫是哪一個？",
    "options": [
      "Z",
      "C",
      "X",
      "S"
    ],
    "answer": 3,
    "explanation": "小寫字母「s」對應的大寫字母為「S」。"
  },
  {
    "id": "hwg_bg2_1210",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "grammar",
    "question": "請問小寫字母「t」的大寫是哪一個？",
    "options": [
      "L",
      "I",
      "T",
      "F"
    ],
    "answer": 2,
    "explanation": "小寫字母「t」對應的大寫字母為「T」。"
  },
  {
    "id": "hwg_bg2_1211",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "grammar",
    "question": "請問小寫字母「u」的大寫是哪一個？",
    "options": [
      "W",
      "U",
      "N",
      "V"
    ],
    "answer": 1,
    "explanation": "小寫字母「u」對應的大寫字母為「U」。"
  },
  {
    "id": "hwg_bg2_1212",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "grammar",
    "question": "請問小寫字母「v」的大寫是哪一個？",
    "options": [
      "V",
      "U",
      "W",
      "Y"
    ],
    "answer": 0,
    "explanation": "小寫字母「v」對應的大寫字母為「V」。"
  },
  {
    "id": "hwg_bg2_1213",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "grammar",
    "question": "請問小寫字母「w」的大寫是哪一個？",
    "options": [
      "M",
      "V",
      "U",
      "W"
    ],
    "answer": 3,
    "explanation": "小寫字母「w」對應的大寫字母為「W」。"
  },
  {
    "id": "hwg_bg2_1214",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "grammar",
    "question": "請問小寫字母「x」的大寫是哪一個？",
    "options": [
      "Z",
      "S",
      "X",
      "K"
    ],
    "answer": 2,
    "explanation": "小寫字母「x」對應的大寫字母為「X」。"
  },
  {
    "id": "hwg_bg2_1215",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "grammar",
    "question": "請問小寫字母「y」的大寫是哪一個？",
    "options": [
      "V",
      "Y",
      "G",
      "J"
    ],
    "answer": 1,
    "explanation": "小寫字母「y」對應的大寫字母為「Y」。"
  },
  {
    "id": "hwg_bg2_1216",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "grammar",
    "question": "請問小寫字母「z」的大寫是哪一個？",
    "options": [
      "Z",
      "S",
      "X",
      "N"
    ],
    "answer": 0,
    "explanation": "小寫字母「z」對應的大寫字母為「Z」。"
  },
  {
    "id": "hwg_bg2_1217",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "A o",
      "A e",
      "A c",
      "A a"
    ],
    "answer": 3,
    "explanation": "大寫「A」與小寫「a」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1218",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "B p",
      "B q",
      "B b",
      "B d"
    ],
    "answer": 2,
    "explanation": "大寫「B」與小寫「b」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1219",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "C a",
      "C c",
      "C o",
      "C e"
    ],
    "answer": 1,
    "explanation": "大寫「C」與小寫「c」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1220",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "D d",
      "D b",
      "D p",
      "D q"
    ],
    "answer": 0,
    "explanation": "大寫「D」與小寫「d」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1221",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "E c",
      "E a",
      "E o",
      "E e"
    ],
    "answer": 3,
    "explanation": "大寫「E」與小寫「e」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1222",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "F r",
      "F l",
      "F f",
      "F t"
    ],
    "answer": 2,
    "explanation": "大寫「F」與小寫「f」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1223",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "G y",
      "G g",
      "G q",
      "G j"
    ],
    "answer": 1,
    "explanation": "大寫「G」與小寫「g」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1224",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "H h",
      "H n",
      "H r",
      "H b"
    ],
    "answer": 0,
    "explanation": "大寫「H」與小寫「h」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1225",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "I j",
      "I l",
      "I t",
      "I i"
    ],
    "answer": 3,
    "explanation": "大寫「I」與小寫「i」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1226",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "J g",
      "J y",
      "J j",
      "J i"
    ],
    "answer": 2,
    "explanation": "大寫「J」與小寫「j」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1227",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "K r",
      "K k",
      "K h",
      "K x"
    ],
    "answer": 1,
    "explanation": "大寫「K」與小寫「k」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1228",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "L l",
      "L i",
      "L t",
      "L j"
    ],
    "answer": 0,
    "explanation": "大寫「L」與小寫「l」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1229",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "M n",
      "M w",
      "M u",
      "M m"
    ],
    "answer": 3,
    "explanation": "大寫「M」與小寫「m」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1230",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "N u",
      "N h",
      "N n",
      "N m"
    ],
    "answer": 2,
    "explanation": "大寫「N」與小寫「n」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1231",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "O e",
      "O o",
      "O c",
      "O a"
    ],
    "answer": 1,
    "explanation": "大寫「O」與小寫「o」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1232",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "P p",
      "P q",
      "P b",
      "P d"
    ],
    "answer": 0,
    "explanation": "大寫「P」與小寫「p」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1233",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "Q p",
      "Q g",
      "Q d",
      "Q q"
    ],
    "answer": 3,
    "explanation": "大寫「Q」與小寫「q」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1234",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "R v",
      "R f",
      "R r",
      "R n"
    ],
    "answer": 2,
    "explanation": "大寫「R」與小寫「r」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1235",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "S x",
      "S s",
      "S z",
      "S c"
    ],
    "answer": 1,
    "explanation": "大寫「S」與小寫「s」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1236",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "T t",
      "T f",
      "T l",
      "T i"
    ],
    "answer": 0,
    "explanation": "大寫「T」與小寫「t」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1237",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "U n",
      "U v",
      "U w",
      "U u"
    ],
    "answer": 3,
    "explanation": "大寫「U」與小寫「u」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1238",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "V w",
      "V y",
      "V v",
      "V u"
    ],
    "answer": 2,
    "explanation": "大寫「V」與小寫「v」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1239",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "W u",
      "W w",
      "W m",
      "W v"
    ],
    "answer": 1,
    "explanation": "大寫「W」與小寫「w」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1240",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "X x",
      "X k",
      "X z",
      "X s"
    ],
    "answer": 0,
    "explanation": "大寫「X」與小寫「x」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1241",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "Y g",
      "Y j",
      "Y v",
      "Y y"
    ],
    "answer": 3,
    "explanation": "大寫「Y」與小寫「y」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1242",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "dialogue",
    "question": "請問下列哪一組「大小寫字母配對」是正確的？",
    "options": [
      "Z x",
      "Z n",
      "Z z",
      "Z s"
    ],
    "answer": 2,
    "explanation": "大寫「Z」與小寫「z」才是正確的大小寫配對。"
  },
  {
    "id": "hwg_bg2_1243",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "grammar",
    "question": "請選出空格中正確的小寫字母：a, b, ______, d",
    "options": [
      "a",
      "c",
      "o",
      "e"
    ],
    "answer": 1,
    "explanation": "依照小寫字母順序為：a, b, c, d，故空格應填「c」。"
  },
  {
    "id": "hwg_bg2_1244",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "grammar",
    "question": "請選出空格中正確的小寫字母：b, c, ______, e",
    "options": [
      "d",
      "b",
      "p",
      "q"
    ],
    "answer": 0,
    "explanation": "依照小寫字母順序為：b, c, d, e，故空格應填「d」。"
  },
  {
    "id": "hwg_bg2_1245",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "grammar",
    "question": "請選出空格中正確的小寫字母：c, d, ______, f",
    "options": [
      "c",
      "a",
      "o",
      "e"
    ],
    "answer": 3,
    "explanation": "依照小寫字母順序為：c, d, e, f，故空格應填「e」。"
  },
  {
    "id": "hwg_bg2_1246",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "grammar",
    "question": "請選出空格中正確的小寫字母：d, e, ______, g",
    "options": [
      "r",
      "l",
      "f",
      "t"
    ],
    "answer": 2,
    "explanation": "依照小寫字母順序為：d, e, f, g，故空格應填「f」。"
  },
  {
    "id": "hwg_bg2_1247",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "grammar",
    "question": "請選出空格中正確的小寫字母：e, f, ______, h",
    "options": [
      "y",
      "g",
      "q",
      "j"
    ],
    "answer": 1,
    "explanation": "依照小寫字母順序為：e, f, g, h，故空格應填「g」。"
  },
  {
    "id": "hwg_bg2_1248",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "grammar",
    "question": "請選出空格中正確的小寫字母：f, g, ______, i",
    "options": [
      "h",
      "n",
      "r",
      "b"
    ],
    "answer": 0,
    "explanation": "依照小寫字母順序為：f, g, h, i，故空格應填「h」。"
  },
  {
    "id": "hwg_bg2_1249",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "grammar",
    "question": "請選出空格中正確的小寫字母：g, h, ______, j",
    "options": [
      "j",
      "l",
      "t",
      "i"
    ],
    "answer": 3,
    "explanation": "依照小寫字母順序為：g, h, i, j，故空格應填「i」。"
  },
  {
    "id": "hwg_bg2_1250",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "grammar",
    "question": "請選出空格中正確的小寫字母：h, i, ______, k",
    "options": [
      "g",
      "y",
      "j",
      "i"
    ],
    "answer": 2,
    "explanation": "依照小寫字母順序為：h, i, j, k，故空格應填「j」。"
  },
  {
    "id": "hwg_bg2_1251",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "grammar",
    "question": "請選出空格中正確的小寫字母：i, j, ______, l",
    "options": [
      "r",
      "k",
      "h",
      "x"
    ],
    "answer": 1,
    "explanation": "依照小寫字母順序為：i, j, k, l，故空格應填「k」。"
  },
  {
    "id": "hwg_bg2_1252",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "grammar",
    "question": "請選出空格中正確的小寫字母：j, k, ______, m",
    "options": [
      "l",
      "i",
      "t",
      "j"
    ],
    "answer": 0,
    "explanation": "依照小寫字母順序為：j, k, l, m，故空格應填「l」。"
  },
  {
    "id": "hwg_bg2_1253",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "grammar",
    "question": "請選出空格中正確的小寫字母：k, l, ______, n",
    "options": [
      "n",
      "w",
      "u",
      "m"
    ],
    "answer": 3,
    "explanation": "依照小寫字母順序為：k, l, m, n，故空格應填「m」。"
  },
  {
    "id": "hwg_bg2_1254",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "grammar",
    "question": "請選出空格中正確的小寫字母：l, m, ______, o",
    "options": [
      "u",
      "h",
      "n",
      "m"
    ],
    "answer": 2,
    "explanation": "依照小寫字母順序為：l, m, n, o，故空格應填「n」。"
  },
  {
    "id": "hwg_bg2_1255",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "grammar",
    "question": "請選出空格中正確的小寫字母：m, n, ______, p",
    "options": [
      "e",
      "o",
      "c",
      "a"
    ],
    "answer": 1,
    "explanation": "依照小寫字母順序為：m, n, o, p，故空格應填「o」。"
  },
  {
    "id": "hwg_bg2_1256",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "grammar",
    "question": "請選出空格中正確的小寫字母：n, o, ______, q",
    "options": [
      "p",
      "q",
      "b",
      "d"
    ],
    "answer": 0,
    "explanation": "依照小寫字母順序為：n, o, p, q，故空格應填「p」。"
  },
  {
    "id": "hwg_bg2_1257",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "grammar",
    "question": "請選出空格中正確的小寫字母：o, p, ______, r",
    "options": [
      "p",
      "g",
      "d",
      "q"
    ],
    "answer": 3,
    "explanation": "依照小寫字母順序為：o, p, q, r，故空格應填「q」。"
  },
  {
    "id": "hwg_bg2_1258",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "grammar",
    "question": "請選出空格中正確的小寫字母：p, q, ______, s",
    "options": [
      "v",
      "f",
      "r",
      "n"
    ],
    "answer": 2,
    "explanation": "依照小寫字母順序為：p, q, r, s，故空格應填「r」。"
  },
  {
    "id": "hwg_bg2_1259",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "grammar",
    "question": "請選出空格中正確的小寫字母：q, r, ______, t",
    "options": [
      "x",
      "s",
      "z",
      "c"
    ],
    "answer": 1,
    "explanation": "依照小寫字母順序為：q, r, s, t，故空格應填「s」。"
  },
  {
    "id": "hwg_bg2_1260",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "grammar",
    "question": "請選出空格中正確的小寫字母：r, s, ______, u",
    "options": [
      "t",
      "f",
      "l",
      "i"
    ],
    "answer": 0,
    "explanation": "依照小寫字母順序為：r, s, t, u，故空格應填「t」。"
  },
  {
    "id": "hwg_bg2_1261",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "grammar",
    "question": "請選出空格中正確的小寫字母：s, t, ______, v",
    "options": [
      "n",
      "v",
      "w",
      "u"
    ],
    "answer": 3,
    "explanation": "依照小寫字母順序為：s, t, u, v，故空格應填「u」。"
  },
  {
    "id": "hwg_bg2_1262",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "grammar",
    "question": "請選出空格中正確的小寫字母：t, u, ______, w",
    "options": [
      "w",
      "y",
      "v",
      "u"
    ],
    "answer": 2,
    "explanation": "依照小寫字母順序為：t, u, v, w，故空格應填「v」。"
  },
  {
    "id": "hwg_bg2_1263",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "grammar",
    "question": "請選出空格中正確的小寫字母：u, v, ______, x",
    "options": [
      "u",
      "w",
      "m",
      "v"
    ],
    "answer": 1,
    "explanation": "依照小寫字母順序為：u, v, w, x，故空格應填「w」。"
  },
  {
    "id": "hwg_bg2_1264",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "grammar",
    "question": "請選出空格中正確的小寫字母：v, w, ______, y",
    "options": [
      "x",
      "k",
      "z",
      "s"
    ],
    "answer": 0,
    "explanation": "依照小寫字母順序為：v, w, x, y，故空格應填「x」。"
  },
  {
    "id": "hwg_bg2_1265",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "grammar",
    "question": "請選出空格中正確的小寫字母：w, x, ______, z",
    "options": [
      "g",
      "j",
      "v",
      "y"
    ],
    "answer": 3,
    "explanation": "依照小寫字母順序為：w, x, y, z，故空格應填「y」。"
  },
  {
    "id": "hwg_bg2_1266",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "b, a, c",
      "c, b, a",
      "a, b, c",
      "a, c, b"
    ],
    "answer": 2,
    "explanation": "正確的小寫字母順序為「a, b, c」。"
  },
  {
    "id": "hwg_bg2_1267",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "d, c, b",
      "b, c, d",
      "b, d, c",
      "c, b, d"
    ],
    "answer": 1,
    "explanation": "正確的小寫字母順序為「b, c, d」。"
  },
  {
    "id": "hwg_bg2_1268",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "c, d, e",
      "c, e, d",
      "d, c, e",
      "e, d, c"
    ],
    "answer": 0,
    "explanation": "正確的小寫字母順序為「c, d, e」。"
  },
  {
    "id": "hwg_bg2_1269",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "d, f, e",
      "e, d, f",
      "f, e, d",
      "d, e, f"
    ],
    "answer": 3,
    "explanation": "正確的小寫字母順序為「d, e, f」。"
  },
  {
    "id": "hwg_bg2_1270",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "f, e, g",
      "g, f, e",
      "e, f, g",
      "e, g, f"
    ],
    "answer": 2,
    "explanation": "正確的小寫字母順序為「e, f, g」。"
  },
  {
    "id": "hwg_bg2_1271",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "h, g, f",
      "f, g, h",
      "f, h, g",
      "g, f, h"
    ],
    "answer": 1,
    "explanation": "正確的小寫字母順序為「f, g, h」。"
  },
  {
    "id": "hwg_bg2_1272",
    "book": "g2",
    "unit": "Unit 1 (Aa~Gg)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "g, h, i",
      "g, i, h",
      "h, g, i",
      "i, h, g"
    ],
    "answer": 0,
    "explanation": "正確的小寫字母順序為「g, h, i」。"
  },
  {
    "id": "hwg_bg2_1273",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "h, j, i",
      "i, h, j",
      "j, i, h",
      "h, i, j"
    ],
    "answer": 3,
    "explanation": "正確的小寫字母順序為「h, i, j」。"
  },
  {
    "id": "hwg_bg2_1274",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "j, i, k",
      "k, j, i",
      "i, j, k",
      "i, k, j"
    ],
    "answer": 2,
    "explanation": "正確的小寫字母順序為「i, j, k」。"
  },
  {
    "id": "hwg_bg2_1275",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "l, k, j",
      "j, k, l",
      "j, l, k",
      "k, j, l"
    ],
    "answer": 1,
    "explanation": "正確的小寫字母順序為「j, k, l」。"
  },
  {
    "id": "hwg_bg2_1276",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "k, l, m",
      "k, m, l",
      "l, k, m",
      "m, l, k"
    ],
    "answer": 0,
    "explanation": "正確的小寫字母順序為「k, l, m」。"
  },
  {
    "id": "hwg_bg2_1277",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "l, n, m",
      "m, l, n",
      "n, m, l",
      "l, m, n"
    ],
    "answer": 3,
    "explanation": "正確的小寫字母順序為「l, m, n」。"
  },
  {
    "id": "hwg_bg2_1278",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "n, m, o",
      "o, n, m",
      "m, n, o",
      "m, o, n"
    ],
    "answer": 2,
    "explanation": "正確的小寫字母順序為「m, n, o」。"
  },
  {
    "id": "hwg_bg2_1279",
    "book": "g2",
    "unit": "Unit 2 (Hh~Nn)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "p, o, n",
      "n, o, p",
      "n, p, o",
      "o, n, p"
    ],
    "answer": 1,
    "explanation": "正確的小寫字母順序為「n, o, p」。"
  },
  {
    "id": "hwg_bg2_1280",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "o, p, q",
      "o, q, p",
      "p, o, q",
      "q, p, o"
    ],
    "answer": 0,
    "explanation": "正確的小寫字母順序為「o, p, q」。"
  },
  {
    "id": "hwg_bg2_1281",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "p, r, q",
      "q, p, r",
      "r, q, p",
      "p, q, r"
    ],
    "answer": 3,
    "explanation": "正確的小寫字母順序為「p, q, r」。"
  },
  {
    "id": "hwg_bg2_1282",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "r, q, s",
      "s, r, q",
      "q, r, s",
      "q, s, r"
    ],
    "answer": 2,
    "explanation": "正確的小寫字母順序為「q, r, s」。"
  },
  {
    "id": "hwg_bg2_1283",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "t, s, r",
      "r, s, t",
      "r, t, s",
      "s, r, t"
    ],
    "answer": 1,
    "explanation": "正確的小寫字母順序為「r, s, t」。"
  },
  {
    "id": "hwg_bg2_1284",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "s, t, u",
      "s, u, t",
      "t, s, u",
      "u, t, s"
    ],
    "answer": 0,
    "explanation": "正確的小寫字母順序為「s, t, u」。"
  },
  {
    "id": "hwg_bg2_1285",
    "book": "g2",
    "unit": "Unit 3 (Oo~Tt)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "t, v, u",
      "u, t, v",
      "v, u, t",
      "t, u, v"
    ],
    "answer": 3,
    "explanation": "正確的小寫字母順序為「t, u, v」。"
  },
  {
    "id": "hwg_bg2_1286",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "v, u, w",
      "w, v, u",
      "u, v, w",
      "u, w, v"
    ],
    "answer": 2,
    "explanation": "正確的小寫字母順序為「u, v, w」。"
  },
  {
    "id": "hwg_bg2_1287",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "x, w, v",
      "v, w, x",
      "v, x, w",
      "w, v, x"
    ],
    "answer": 1,
    "explanation": "正確的小寫字母順序為「v, w, x」。"
  },
  {
    "id": "hwg_bg2_1288",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "w, x, y",
      "w, y, x",
      "x, w, y",
      "y, x, w"
    ],
    "answer": 0,
    "explanation": "正確的小寫字母順序為「w, x, y」。"
  },
  {
    "id": "hwg_bg2_1289",
    "book": "g2",
    "unit": "Unit 4 (Uu~Zz)",
    "category": "dialogue",
    "question": "請問下列哪一組小寫字母的「先後順序」是正確的？",
    "options": [
      "x, z, y",
      "y, x, z",
      "z, y, x",
      "x, y, z"
    ],
    "answer": 3,
    "explanation": "正確的小寫字母順序為「x, y, z」。"
  }
];
