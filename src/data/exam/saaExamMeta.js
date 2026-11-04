/**
 * 教育部縣市學力檢測 (SAA 臺灣學生學習成就評量) 實戰模考規格定義
 * 參考臺中教育大學「臺灣學生學習成就評量」公開歷年國小英語檢測試卷
 * 網址: https://saaassessment.ntcu.edu.tw/ExamReleases
 *
 * 施測對象: 國小 4、5、6 年級學生
 * 試卷題數: 25～30 題 (依年級微調，聽力約 15 題 + 閱讀約 15 題)
 * 評量層級: 三大等第制 (精熟 Proficient / 基礎 Basic / 待加強 Developing)
 */

export const SAA_EXAM_SPEC = {
  id: 'ministry-assessment',
  title: '教育部縣市學力檢測 (SAA) 英語學習成就模擬試卷',
  grades: [4, 5, 6],
  tiers: [
    {
      code: 'proficient',
      name: '精熟 (Proficient)',
      minPercentage: 85,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      description: '具備極佳的英語語意理解與長篇訊息統整能力，能順暢理解聽力與生活圖表。'
    },
    {
      code: 'basic',
      name: '基礎 (Basic)',
      minPercentage: 60,
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      description: '具備教育部國小英語課綱之基本學力，能理解日常生活基本句型與字彙。'
    },
    {
      code: 'developing',
      name: '待加強 (Developing)',
      minPercentage: 0,
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      description: '基礎字彙、基本發音與核心句型需要持續練習與複習以鞏固基底。'
    }
  ],
  sections: [
    {
      id: 'listening',
      name: '第一部分：聽力測驗 (Listening Test)',
      parts: [
        {
          code: 'L-SENT',
          name: '第一大題：辨識句意',
          prompt: '請聽語音播放的句子，選出與句意相符的圖片。',
          description: '測驗單句完整語意與情境動作之關聯辨識。'
        },
        {
          code: 'L-QA',
          name: '第二大題：基本問答',
          prompt: '請聽語音播放的問句或日常用語，選出最適當的應對回答。',
          description: '測驗日常功能性問句（問時間、位置、感受、天氣等）的應答反應。'
        },
        {
          code: 'L-CONV',
          name: '第三大題：言談理解',
          prompt: '請聽一段簡短對話或生活廣播短文，回答所提出的問題。',
          description: '測驗多輪對話關鍵訊息擷取、說話者關係與意圖判斷。'
        }
      ]
    },
    {
      id: 'reading',
      name: '第二部分：閱讀測驗 (Reading Test)',
      parts: [
        {
          code: 'G-MC',
          name: '第一大題：單題（字彙與語法）',
          prompt: '請依各題題意，選出一個最適當的單字或句子填入空格。',
          description: '測驗單元生活核心字彙、動詞時態、主動受格與句構。'
        },
        {
          code: 'R-PASSAGE',
          name: '第二大題：題組（篇章理解）',
          prompt: '請閱讀所附之生活篇章（海報、菜單、書信或短文），回答後續題目。',
          description: '素養導向題組，每組提供情境文本或圖表，延伸 2～3 題資訊擷取與主旨理解。'
        }
      ]
    }
  ]
};

/**
 * SAA 篇章閱讀題組 (Passage) 資料結構規範
 */
export const SAA_PASSAGE_SAMPLE_SCHEMA = {
  groupId: "saa_g6_market_01",
  track: "ministry-assessment",
  targetGrade: 6,
  passage: {
    title: "Mountain Forest Eco Camp Schedule",
    type: "schedule", // 'dialogue' | 'story' | 'poster' | 'menu' | 'schedule' | 'email'
    imageUrl: "/assets/exam/passages/camp_schedule.webp",
    text: "Welcome to the Wutai Forest Camp!\n09:00 - 10:30 Bird Watching\n11:00 - 12:30 Pottery Workshop\n14:00 - 16:00 Traditional Singing"
  },
  questions: [
    {
      id: "saa_g6_q21",
      taskType: "R-PASSAGE",
      question: "What activity starts at 11:00?",
      options: ["Bird Watching", "Pottery Workshop", "Traditional Singing", "Lunch Time"],
      answer: 1,
      explanation: "根據活動時刻表，11:00 至 12:30 為 Pottery Workshop (陶藝工作坊)。"
    }
  ]
};
