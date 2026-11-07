/**
 * Test My English Pre-A1 官方模擬題庫 — 口說專項題庫模組 (Speaking Bank)
 * 依據教育部「Test My English」Pre-A1 評量標準與 Here We Go 第 1～8 冊課綱詞彙句型規劃。
 *
 * 涵蓋三大口說子面向：
 * 1. 單字片語朗讀 (speak-word / S-WORD) - 10 題 (w-01 ~ w-10)
 *    評量基礎單字、常見問候語之自然發音、重音位置與清晰度。
 * 2. 短句朗讀 (speak-short / S-SENT) - 12 題 (s-01 ~ s-12)
 *    評量日常生活 4~6 字核心問答與祈使句，著重 Wh-問句降調、Yes/No 問句升調與連音。
 * 3. 長句朗讀 (speak-long / S-READ) - 10 題 (l-01 ~ l-10)
 *    評量 8~14 字連貫情境敘述，著重意群切分（Sense Groups）、對等連接詞停頓與語調流暢度。
 *
 * 總題數：32 題
 */

export const TME_PRE_A1_SPEAKING_BANK = [
  // ==========================================
  // Part 1: 單字片語朗讀 (speak-word / S-WORD, 10 題)
  // ==========================================
  {
    id: "tme-speak-w-01",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-word",
    serialNum: 1,
    taskType: "S-WORD",
    difficulty: 1,
    prepSeconds: 5,
    recordSeconds: 8,
    targetText: "Good morning",
    phonics: "/ɡʊd ˈmɔːr.nɪŋ/",
    translation: "早安",
    question: "【口說測驗：單字朗讀】請看螢幕上的英文，依指示清晰朗讀：",
    media: {
      audioText: "Good morning"
    },
    options: ["Good morning"],
    answer: 0,
    explanation: "口說評測目標為「Good morning（早安）」，評量重點在於發音清晰度與語調。",
    reviewed: true
  },
  {
    id: "tme-speak-w-02",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-word",
    serialNum: 2,
    taskType: "S-WORD",
    difficulty: 1,
    prepSeconds: 5,
    recordSeconds: 8,
    targetText: "orange",
    phonics: "/ˈɔːr.ɪndʒ/",
    translation: "柳橙",
    question: "【口說測驗：單字朗讀】請看螢幕上的英文，依指示清晰朗讀：",
    media: {
      audioText: "orange"
    },
    options: ["orange"],
    answer: 0,
    explanation: "口說評測目標為「orange（柳橙）」，評量重點在於雙音節重音及 /dʒ/ 發音清晰度。",
    reviewed: true
  },
  {
    id: "tme-speak-w-03",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-word",
    serialNum: 3,
    taskType: "S-WORD",
    difficulty: 1,
    prepSeconds: 5,
    recordSeconds: 8,
    targetText: "pencil",
    phonics: "/ˈpen.səl/",
    translation: "鉛筆",
    question: "【口說測驗：單字朗讀】請看螢幕上的英文，依指示清晰朗讀：",
    media: {
      audioText: "pencil"
    },
    options: ["pencil"],
    answer: 0,
    explanation: "口說評測目標為「pencil（鉛筆）」，評量重點在於字首爆破音 /p/ 與字尾軟齶邊音 /l/。",
    reviewed: true
  },
  {
    id: "tme-speak-w-04",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-word",
    serialNum: 4,
    taskType: "S-WORD",
    difficulty: 1,
    prepSeconds: 5,
    recordSeconds: 8,
    targetText: "school",
    phonics: "/skuːl/",
    translation: "學校",
    question: "【口說測驗：單字朗讀】請看螢幕上的英文，依指示清晰朗讀：",
    media: {
      audioText: "school"
    },
    options: ["school"],
    answer: 0,
    explanation: "口說評測目標為「school（學校）」，評量重點在於 /sk/ 子音群與長母音 /uː/ 發音。",
    reviewed: true
  },
  {
    id: "tme-speak-w-05",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-word",
    serialNum: 5,
    taskType: "S-WORD",
    difficulty: 1,
    prepSeconds: 5,
    recordSeconds: 8,
    targetText: "rabbit",
    phonics: "/ˈræb.ɪt/",
    translation: "兔子",
    question: "【口說測驗：單字朗讀】請看螢幕上的英文，依指示清晰朗讀：",
    media: {
      audioText: "rabbit"
    },
    options: ["rabbit"],
    answer: 0,
    explanation: "口說評測目標為「rabbit（兔子）」，評量重點在於捲舌音 /r/ 與短母音 /æ/ 發音。",
    reviewed: true
  },
  {
    id: "tme-speak-w-06",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-word",
    serialNum: 6,
    taskType: "S-WORD",
    difficulty: 1,
    prepSeconds: 5,
    recordSeconds: 8,
    targetText: "bicycle",
    phonics: "/ˈbaɪ.sə.kəl/",
    translation: "腳踏車",
    question: "【口說測驗：單字朗讀】請看螢幕上的英文，依指示清晰朗讀：",
    media: {
      audioText: "bicycle"
    },
    options: ["bicycle"],
    answer: 0,
    explanation: "口說評測目標為「bicycle（腳踏車）」，評量重點在於三音節節奏與雙母音 /aɪ/ 之流暢度。",
    reviewed: true
  },
  {
    id: "tme-speak-w-07",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-word",
    serialNum: 7,
    taskType: "S-WORD",
    difficulty: 1,
    prepSeconds: 5,
    recordSeconds: 8,
    targetText: "yellow",
    phonics: "/ˈjel.oʊ/",
    translation: "黃色",
    question: "【口說測驗：單字朗讀】請看螢幕上的英文，依指示清晰朗讀：",
    media: {
      audioText: "yellow"
    },
    options: ["yellow"],
    answer: 0,
    explanation: "口說評測目標為「yellow（黃色）」，評量重點在於半母音 /j/ 與雙母音 /oʊ/ 圓唇發音。",
    reviewed: true
  },
  {
    id: "tme-speak-w-08",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-word",
    serialNum: 8,
    taskType: "S-WORD",
    difficulty: 1,
    prepSeconds: 5,
    recordSeconds: 8,
    targetText: "elephant",
    phonics: "/ˈel.ə.fənt/",
    translation: "大象",
    question: "【口說測驗：單字朗讀】請看螢幕上的英文，依指示清晰朗讀：",
    media: {
      audioText: "elephant"
    },
    options: ["elephant"],
    answer: 0,
    explanation: "口說評測目標為「elephant（大象）」，評量重點在於三音節第一音節重音與唇齒擦音 /f/。",
    reviewed: true
  },
  {
    id: "tme-speak-w-09",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-word",
    serialNum: 9,
    taskType: "S-WORD",
    difficulty: 1,
    prepSeconds: 5,
    recordSeconds: 8,
    targetText: "teacher",
    phonics: "/ˈtiː.tʃɚ/",
    translation: "老師",
    question: "【口說測驗：單字朗讀】請看螢幕上的英文，依指示清晰朗讀：",
    media: {
      audioText: "teacher"
    },
    options: ["teacher"],
    answer: 0,
    explanation: "口說評測目標為「teacher（老師）」，評量重點在於長母音 /iː/ 與塞擦音 /tʃ/。",
    reviewed: true
  },
  {
    id: "tme-speak-w-10",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-word",
    serialNum: 10,
    taskType: "S-WORD",
    difficulty: 1,
    prepSeconds: 5,
    recordSeconds: 8,
    targetText: "thank you",
    phonics: "/ˈθæŋk ˌjuː/",
    translation: "謝謝",
    question: "【口說測驗：單字朗讀】請看螢幕上的英文，依指示清晰朗讀：",
    media: {
      audioText: "thank you"
    },
    options: ["thank you"],
    answer: 0,
    explanation: "口說評測目標為「thank you（謝謝）」，評量重點在於齒間擦音 /θ/ 與連音流暢度。",
    reviewed: true
  },

  // ==========================================
  // Part 2: 短句朗讀 (speak-short / S-SENT, 12 題)
  // ==========================================
  {
    id: "tme-speak-s-01",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-short",
    serialNum: 1,
    taskType: "S-SENT",
    difficulty: 1,
    prepSeconds: 5,
    recordSeconds: 10,
    targetText: "What is your name?",
    phonics: "/wɑːt ɪz jʊr neɪm/",
    translation: "你叫什麼名字？",
    question: "【口說測驗：短句朗讀】請看螢幕上的英文句子，依指示自然朗讀：",
    media: {
      audioText: "What is your name?"
    },
    options: ["What is your name?"],
    answer: 0,
    explanation: "口說評測目標為 Wh- 疑問句「What is your name?（你叫什麼名字？）」，評量重點在於句尾降調與連音。",
    reviewed: true
  },
  {
    id: "tme-speak-s-02",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-short",
    serialNum: 2,
    taskType: "S-SENT",
    difficulty: 1,
    prepSeconds: 5,
    recordSeconds: 10,
    targetText: "I like red apples.",
    phonics: "/aɪ laɪk red ˈæp.əlz/",
    translation: "我喜歡紅蘋果。",
    question: "【口說測驗：短句朗讀】請看螢幕上的英文句子，依指示自然朗讀：",
    media: {
      audioText: "I like red apples."
    },
    options: ["I like red apples."],
    answer: 0,
    explanation: "口說評測目標為陳述句「I like red apples.（我喜歡紅蘋果。）」，評量重點在於主詞動詞連音及名詞複數 /z/ 音。",
    reviewed: true
  },
  {
    id: "tme-speak-s-03",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-short",
    serialNum: 3,
    taskType: "S-SENT",
    difficulty: 1,
    prepSeconds: 5,
    recordSeconds: 10,
    targetText: "Where is my school bag?",
    phonics: "/wer ɪz maɪ skuːl bæɡ/",
    translation: "我的書包在哪裡？",
    question: "【口說測驗：短句朗讀】請看螢幕上的英文句子，依指示自然朗讀：",
    media: {
      audioText: "Where is my school bag?"
    },
    options: ["Where is my school bag?"],
    answer: 0,
    explanation: "口說評測目標為 Wh- 疑問句「Where is my school bag?（我的書包在哪裡？）」，評量重點在於疑問詞重音與複合名詞發音。",
    reviewed: true
  },
  {
    id: "tme-speak-s-04",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-short",
    serialNum: 4,
    taskType: "S-SENT",
    difficulty: 1,
    prepSeconds: 5,
    recordSeconds: 10,
    targetText: "It is a sunny Sunday.",
    phonics: "/ɪt ɪz ə ˈsʌn.i ˈsʌn.deɪ/",
    translation: "今天是個晴朗的星期天。",
    question: "【口說測驗：短句朗讀】請看螢幕上的英文句子，依指示自然朗讀：",
    media: {
      audioText: "It is a sunny Sunday."
    },
    options: ["It is a sunny Sunday."],
    answer: 0,
    explanation: "口說評測目標為天氣日常描述句「It is a sunny Sunday.（今天是個晴朗的星期天。）」，評量重點在於頭韻 /s/ 及連音節奏。",
    reviewed: true
  },
  {
    id: "tme-speak-s-05",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-short",
    serialNum: 5,
    taskType: "S-SENT",
    difficulty: 1,
    prepSeconds: 5,
    recordSeconds: 10,
    targetText: "How many pens do you have?",
    phonics: "/haʊ ˈmen.i penz duː juː hæv/",
    translation: "你有幾枝原子筆？",
    question: "【口說測驗：短句朗讀】請看螢幕上的英文句子，依指示自然朗讀：",
    media: {
      audioText: "How many pens do you have?"
    },
    options: ["How many pens do you have?"],
    answer: 0,
    explanation: "口說評測目標為數量疑問句「How many pens do you have?（你有幾枝原子筆？）」，評量重點在於問句語調與名詞複數發音。",
    reviewed: true
  },
  {
    id: "tme-speak-s-06",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-short",
    serialNum: 6,
    taskType: "S-SENT",
    difficulty: 1,
    prepSeconds: 5,
    recordSeconds: 10,
    targetText: "She is reading a story book.",
    phonics: "/ʃiː ɪz ˈriː.dɪŋ ə ˈstɔːr.i bʊk/",
    translation: "她正在讀一本故事書。",
    question: "【口說測驗：短句朗讀】請看螢幕上的英文句子，依指示自然朗讀：",
    media: {
      audioText: "She is reading a story book."
    },
    options: ["She is reading a story book."],
    answer: 0,
    explanation: "口說評測目標為現在進行式「She is reading a story book.（她正在讀一本故事書。）」，評量重點在於 -ing 尾音與複合名詞節奏。",
    reviewed: true
  },
  {
    id: "tme-speak-s-07",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-short",
    serialNum: 7,
    taskType: "S-SENT",
    difficulty: 1,
    prepSeconds: 5,
    recordSeconds: 10,
    targetText: "This is my pet cat.",
    phonics: "/ðɪs ɪz maɪ pet kæt/",
    translation: "這是我的寵物貓。",
    question: "【口說測驗：短句朗讀】請看螢幕上的英文句子，依指示自然朗讀：",
    media: {
      audioText: "This is my pet cat."
    },
    options: ["This is my pet cat."],
    answer: 0,
    explanation: "口說評測目標為介紹句「This is my pet cat.（這是我的寵物貓。）」，評量重點在於 /ð/ 咬舌發音與爆破音清脆度。",
    reviewed: true
  },
  {
    id: "tme-speak-s-08",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-short",
    serialNum: 8,
    taskType: "S-SENT",
    difficulty: 1,
    prepSeconds: 5,
    recordSeconds: 10,
    targetText: "Can you swim fast?",
    phonics: "/kæn juː swɪm fæst/",
    translation: "你會游得很快嗎？",
    question: "【口說測驗：短句朗讀】請看螢幕上的英文句子，依指示自然朗讀：",
    media: {
      audioText: "Can you swim fast?"
    },
    options: ["Can you swim fast?"],
    answer: 0,
    explanation: "口說評測目標為 Can Yes/No 疑問句「Can you swim fast?（你會游得很快嗎？）」，評量重點在於句末升調。",
    reviewed: true
  },
  {
    id: "tme-speak-s-09",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-short",
    serialNum: 9,
    taskType: "S-SENT",
    difficulty: 1,
    prepSeconds: 5,
    recordSeconds: 10,
    targetText: "It is time for lunch.",
    phonics: "/ɪt ɪz taɪm fɔːr lʌntʃ/",
    translation: "該吃午餐了。",
    question: "【口說測驗：短句朗讀】請看螢幕上的英文句子，依指示自然朗讀：",
    media: {
      audioText: "It is time for lunch."
    },
    options: ["It is time for lunch."],
    answer: 0,
    explanation: "口說評測目標為時間生活短句「It is time for lunch.（該吃午餐了。）」，評量重點在於介系詞弱化與 /tʃ/ 發音。",
    reviewed: true
  },
  {
    id: "tme-speak-s-10",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-short",
    serialNum: 10,
    taskType: "S-SENT",
    difficulty: 1,
    prepSeconds: 5,
    recordSeconds: 10,
    targetText: "Stand up and look here.",
    phonics: "/stænd ʌp ænd lʊk hɪr/",
    translation: "站起來並看這裡。",
    question: "【口說測驗：短句朗讀】請看螢幕上的英文句子，依指示自然朗讀：",
    media: {
      audioText: "Stand up and look here."
    },
    options: ["Stand up and look here."],
    answer: 0,
    explanation: "口說評測目標為課堂祈使句「Stand up and look here.（站起來並看這裡。）」，評量重點在於「stand up」連音朗讀與語調。",
    reviewed: true
  },
  {
    id: "tme-speak-s-11",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-short",
    serialNum: 11,
    taskType: "S-SENT",
    difficulty: 1,
    prepSeconds: 5,
    recordSeconds: 10,
    targetText: "Put on your warm coat.",
    phonics: "/pʊt ɑːn jʊr wɔːrm koʊt/",
    translation: "穿上你保暖的外套。",
    question: "【口說測驗：短句朗讀】請看螢幕上的英文句子，依指示自然朗讀：",
    media: {
      audioText: "Put on your warm coat."
    },
    options: ["Put on your warm coat."],
    answer: 0,
    explanation: "口說評測目標為生活叮嚀祈使句「Put on your warm coat.（穿上你保暖的外套。）」，評量重點在於動詞片語「put on」連音與長母音 /ɔː/。",
    reviewed: true
  },
  {
    id: "tme-speak-s-12",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-short",
    serialNum: 12,
    taskType: "S-SENT",
    difficulty: 1,
    prepSeconds: 5,
    recordSeconds: 10,
    targetText: "What time do you wake up?",
    phonics: "/wɑːt taɪm duː juː weɪk ʌp/",
    translation: "你幾點醒來？",
    question: "【口說測驗：短句朗讀】請看螢幕上的英文句子，依指示自然朗讀：",
    media: {
      audioText: "What time do you wake up?"
    },
    options: ["What time do you wake up?"],
    answer: 0,
    explanation: "口說評測目標為時間問句「What time do you wake up?（你幾點醒來？）」，評量重點在於 Wh- 問句句尾降調及「wake up」連音。",
    reviewed: true
  },

  // ==========================================
  // Part 3: 長句朗讀 (speak-long / S-READ, 10 題)
  // ==========================================
  {
    id: "tme-speak-l-01",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-long",
    serialNum: 1,
    taskType: "S-READ",
    difficulty: 2,
    prepSeconds: 5,
    recordSeconds: 15,
    targetText: "I like to play basketball with my friends on Sunday.",
    phonics: "/aɪ laɪk tə pleɪ ˈbæs.kət.bɑːl wɪð maɪ frendz ɑːn ˈsʌn.deɪ/",
    translation: "我喜歡在星期天和我的朋友們一起打籃球。",
    question: "【口說測驗：長句朗讀】請看螢幕上的長句，注意連音與斷句完整朗讀：",
    media: {
      audioText: "I like to play basketball with my friends on Sunday."
    },
    options: ["I like to play basketball with my friends on Sunday."],
    answer: 0,
    explanation: "口說評測目標為生活休閒敘述句「I like to play basketball with my friends on Sunday.（我喜歡在星期天和我的朋友們一起打籃球。）」，評量重點在於動詞片語「play basketball」、介系詞片語意群停頓與語調流暢度。",
    reviewed: true
  },
  {
    id: "tme-speak-l-02",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-long",
    serialNum: 2,
    taskType: "S-READ",
    difficulty: 2,
    prepSeconds: 5,
    recordSeconds: 15,
    targetText: "Peter rides his blue bicycle to the park with his sister every weekend.",
    phonics: "/ˈpiː.tɚ raɪdz hɪz bluː ˈbaɪ.sə.kəl tə ðə pɑːrk wɪð hɪz ˈsɪs.tɚ ˈev.ri ˈwiːk.end/",
    translation: "Peter 每個週末都和他的妹妹一起騎著他的藍色腳踏車去公園。",
    question: "【口說測驗：長句朗讀】請看螢幕上的長句，注意連音與斷句完整朗讀：",
    media: {
      audioText: "Peter rides his blue bicycle to the park with his sister every weekend."
    },
    options: ["Peter rides his blue bicycle to the park with his sister every weekend."],
    answer: 0,
    explanation: "口說評測目標為週末活動敘述句「Peter rides his blue bicycle to the park with his sister every weekend.」，評量重點在於第三人稱單數動詞加 s（rides）之清濁音、地點介系詞片語及時間副詞之意群切分。",
    reviewed: true
  },
  {
    id: "tme-speak-l-03",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-long",
    serialNum: 3,
    taskType: "S-READ",
    difficulty: 2,
    prepSeconds: 5,
    recordSeconds: 15,
    targetText: "Lisa visits the school library after lunch to find an interesting English book.",
    phonics: "/ˈliː.sə ˈvɪz.ɪts ðə skuːl ˈlaɪ.brer.i ˈæf.tɚ lʌntʃ tə faɪnd ən ˈɪn.trɪs.tɪŋ ˈɪŋ.ɡlɪʃ bʊk/",
    translation: "Lisa 午餐後去參觀學校圖書館，想找一本有趣的英文書。",
    question: "【口說測驗：長句朗讀】請看螢幕上的長句，注意連音與斷句完整朗讀：",
    media: {
      audioText: "Lisa visits the school library after lunch to find an interesting English book."
    },
    options: ["Lisa visits the school library after lunch to find an interesting English book."],
    answer: 0,
    explanation: "口說評測目標為學校生活情境敘述「Lisa visits the school library after lunch to find an interesting English book.」，評量重點在於動詞不定詞「to find」連音及多音節單字「interesting」發音流暢度。",
    reviewed: true
  },
  {
    id: "tme-speak-l-04",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-long",
    serialNum: 4,
    taskType: "S-READ",
    difficulty: 2,
    prepSeconds: 5,
    recordSeconds: 15,
    targetText: "It is cold and rainy today, so please remember to take an umbrella with you.",
    phonics: "/ɪt ɪz koʊld ænd ˈreɪ.ni təˈdeɪ soʊ pliːz rɪˈmem.bɚ tə teɪk ən ʌmˈbrel.ə wɪð juː/",
    translation: "今天天氣又冷又下雨，所以請記得帶一把雨傘出門。",
    question: "【口說測驗：長句朗讀】請看螢幕上的長句，注意連音與斷句完整朗讀：",
    media: {
      audioText: "It is cold and rainy today, so please remember to take an umbrella with you."
    },
    options: ["It is cold and rainy today, so please remember to take an umbrella with you."],
    answer: 0,
    explanation: "口說評測目標為複合因果敘述句「It is cold and rainy today, so please remember to take an umbrella with you.」，評量重點在於對等連接詞「so」前後之停頓意群，以及「an umbrella」連音技巧。",
    reviewed: true
  },
  {
    id: "tme-speak-l-05",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-long",
    serialNum: 5,
    taskType: "S-READ",
    difficulty: 2,
    prepSeconds: 5,
    recordSeconds: 15,
    targetText: "My father is cooking dinner in the kitchen while my mother washes the dishes.",
    phonics: "/maɪ ˈfɑː.ðɚ ɪz ˈkʊk.ɪŋ ˈdɪn.ɚ ɪn ðə ˈkɪtʃ.ən waɪl maɪ ˈmʌð.ɚ ˈwɑː.ʃɪz ðə dɪʃ.ɪz/",
    translation: "我的父親正在廚房煮晚餐，而我的母親正在洗碗盤。",
    question: "【口說測驗：長句朗讀】請看螢幕上的長句，注意連音與斷句完整朗讀：",
    media: {
      audioText: "My father is cooking dinner in the kitchen while my mother washes the dishes."
    },
    options: ["My father is cooking dinner in the kitchen while my mother washes the dishes."],
    answer: 0,
    explanation: "口說評測目標為家庭生活雙重動作敘述「My father is cooking dinner in the kitchen while my mother washes the dishes.」，評量重點在於進行式與第三人稱單數動詞變化（washes /ˈwɑː.ʃɪz/）發音準確度。",
    reviewed: true
  },
  {
    id: "tme-speak-l-06",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-long",
    serialNum: 6,
    taskType: "S-READ",
    difficulty: 2,
    prepSeconds: 5,
    recordSeconds: 15,
    targetText: "There are many colorful flowers and tall trees in our beautiful school garden.",
    phonics: "/ðer ɑːr ˈmen.i ˈkʌl.ɚ.fəl ˈflaʊ.ɚz ænd tɔːl triːz ɪn ˈaʊ.ɚ ˈbjuː.t̬ə.fəl skuːl ˈɡɑːr.dən/",
    translation: "在我們美麗的校園花園裡，有許多色彩繽紛的花朵和高大的樹木。",
    question: "【口說測驗：長句朗讀】請看螢幕上的長句，注意連音與斷句完整朗讀：",
    media: {
      audioText: "There are many colorful flowers and tall trees in our beautiful school garden."
    },
    options: ["There are many colorful flowers and tall trees in our beautiful school garden."],
    answer: 0,
    explanation: "口說評測目標為存在句（There are）與校園環境描述「There are many colorful flowers and tall trees in our beautiful school garden.」，評量重點在於形容詞修飾名詞群之重音節奏與介系詞片語意群停頓。",
    reviewed: true
  },
  {
    id: "tme-speak-l-07",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-long",
    serialNum: 7,
    taskType: "S-READ",
    difficulty: 2,
    prepSeconds: 5,
    recordSeconds: 15,
    targetText: "Andy does his English homework carefully every night before he goes to bed.",
    phonics: "/ˈæn.di dʌz hɪz ˈɪŋ.ɡlɪʃ ˈhoʊm.wɝːk ˈker.fəl.i ˈev.ri naɪt bɪˈfɔːr hiː ɡoʊz tə bed/",
    translation: "Andy 每天晚上就寢前都會認真地寫英文作業。",
    question: "【口說測驗：長句朗讀】請看螢幕上的長句，注意連音與斷句完整朗讀：",
    media: {
      audioText: "Andy does his English homework carefully every night before he goes to bed."
    },
    options: ["Andy does his English homework carefully every night before he goes to bed."],
    answer: 0,
    explanation: "口說評測目標為日常作息敘述句「Andy does his English homework carefully every night before he goes to bed.」，評量重點在於副詞「carefully」修飾動詞之朗讀語調，以及時間子句「before...」之節奏切分。",
    reviewed: true
  },
  {
    id: "tme-speak-l-08",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-long",
    serialNum: 8,
    taskType: "S-READ",
    difficulty: 2,
    prepSeconds: 5,
    recordSeconds: 15,
    targetText: "We will go camping in the mountains next Saturday morning with our family.",
    phonics: "/wiː wɪl ɡoʊ ˈkæm.pɪŋ ɪn ðə ˈmaʊn.tənz nekst ˈsæt̬.ɚ.deɪ ˈmɔːr.nɪŋ wɪð ˈaʊ.ɚ ˈfæm.əl.i/",
    translation: "下星期六早上我們要和家人一起去山裡露營。",
    question: "【口說測驗：長句朗讀】請看螢幕上的長句，注意連音與斷句完整朗讀：",
    media: {
      audioText: "We will go camping in the mountains next Saturday morning with our family."
    },
    options: ["We will go camping in the mountains next Saturday morning with our family."],
    answer: 0,
    explanation: "口說評測目標為未來計畫與戶外活動敘述「We will go camping in the mountains next Saturday morning with our family.」，評量重點在於助動詞「will」語流弱化、名詞複數與時間片語之流暢表達。",
    reviewed: true
  },
  {
    id: "tme-speak-l-09",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-long",
    serialNum: 9,
    taskType: "S-READ",
    difficulty: 2,
    prepSeconds: 5,
    recordSeconds: 15,
    targetText: "Jenny washes her hands before eating lunch and brushes her teeth after dinner.",
    phonics: "/ˈdʒen.i ˈwɑː.ʃɪz hɚ hændz bɪˈfɔːr ˈiː.tɪŋ lʌntʃ ænd ˈbrʌʃ.ɪz hɚ tiːθ ˈæf.tɚ ˈdɪn.ɚ/",
    translation: "Jenny 吃午餐前會洗手，晚餐後會刷牙。",
    question: "【口說測驗：長句朗讀】請看螢幕上的長句，注意連音與斷句完整朗讀：",
    media: {
      audioText: "Jenny washes her hands before eating lunch and brushes her teeth after dinner."
    },
    options: ["Jenny washes her hands before eating lunch and brushes her teeth after dinner."],
    answer: 0,
    explanation: "口說評測目標為個人良好衛生習慣平行對稱句「Jenny washes her hands before eating lunch and brushes her teeth after dinner.」，評量重點在於對等連接詞「and」前後兩子句節奏平穩度與齒間音 /θ/。",
    reviewed: true
  },
  {
    id: "tme-speak-l-10",
    track: "tme-preA1",
    category: "speaking",
    subType: "speak-long",
    serialNum: 10,
    taskType: "S-READ",
    difficulty: 2,
    prepSeconds: 5,
    recordSeconds: 15,
    targetText: "Tomorrow is sports day, so everyone should wear sneakers and white socks.",
    phonics: "/təˈmɔːr.oʊ ɪz spɔːrts deɪ soʊ ˈev.ri.wʌn ʃʊd wer ˈsniː.kɚz ænd waɪt sɑːks/",
    translation: "明天是運動會，所以每個人都應該穿球鞋和白襪子。",
    question: "【口說測驗：長句朗讀】請看螢幕上的長句，注意連音與斷句完整朗讀：",
    media: {
      audioText: "Tomorrow is sports day, so everyone should wear sneakers and white socks."
    },
    options: ["Tomorrow is sports day, so everyone should wear sneakers and white socks."],
    answer: 0,
    explanation: "口說評測目標為學校活動通知因果敘述句「Tomorrow is sports day, so everyone should wear sneakers and white socks.」，評量重點在於情態助動詞「should」後接動詞原形、子音群 /sk/, /sn/ 與逗號停頓技巧。",
    reviewed: true
  }
];

export default TME_PRE_A1_SPEAKING_BANK;
