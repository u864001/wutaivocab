/**
 * 課本題庫檢定館四大測驗軌道 (Exam Tracks) 核心定義與規格
 *
 * 1. textbook: 課本同步檢定 (Here We Go 1~8 冊、字母專冊與國一先修，現有 1,689 題)
 * 2. tme-preA1: 教育部 Test My English Pre-A1 官方模擬檢定 (聽力 15 + 閱讀 15，共 30 題標準卷)
 * 3. ministry-assessment: 教育部/縣市學力檢測 (SAA 臺灣學生學習成就評量，國小 4~6 年級實戰模考)
 * 4. mistakes: 個人易錯題弱點擊破室 (跨軌道智慧複習，連續答對 2 次出庫)
 */

export const EXAM_TRACKS = {
  textbook: {
    id: 'textbook',
    name: '課本單元進度檢定',
    badge: '基礎精熟',
    shortName: '課本檢定',
    icon: 'BookOpen',
    themeColor: 'emerald',
    description: '同步翰林 Here We Go 1～8 冊、字母專冊與國一先修，自選冊別與題數隨堂練習。',
    status: 'active', // 'active' | 'preparing'
    targetGrades: [1, 2, 3, 4, 5, 6],
    features: [
      '涵蓋 1~8 冊、國一先修及 1~2 年級字母專冊',
      '全站現有 1,689 題原創類題庫',
      '支援自選 10 題、20 題、50 題規格',
      '本年級達標 60% 即可賺取宇宙學習金幣'
    ]
  },
  'tme-preA1': {
    id: 'tme-preA1',
    name: 'Test My English Pre-A1 官方模擬',
    badge: '教育部認證規格',
    shortName: 'Pre-A1 模擬',
    icon: 'Award',
    themeColor: 'sky',
    description: '教育部 Test My English 英語能力檢測標準規格：聽力 15 題 + 閱讀 15 題全真生活情境。',
    status: 'preparing',
    targetGrades: [3, 4, 5],
    standardQuestionCount: 30,
    structure: {
      listening: {
        total: 15,
        parts: [
          { type: 'L-PIC', name: '聽音選圖', count: 5, desc: '聽日常短句或單字，選出相符之情境插圖' },
          { type: 'L-WORD', name: '聽音選字', count: 5, desc: '聽讀音選出正確拼寫之核心單字' },
          { type: 'L-RESP', name: '聽問句選回應', count: 5, desc: '聽日常問句，選出合乎邏輯之社交應答' }
        ]
      },
      reading: {
        total: 15,
        parts: [
          { type: 'V-PIC', name: '看圖選單字', count: 5, desc: '看日常生活物品或動作照片/線稿，選出正確單字' },
          { type: 'R-MATCH', name: '生活圖表配合', count: 5, desc: '看簡易生活標誌、時間表或告示牌選出正解' },
          { type: 'R-TF', name: '短句是非判斷', count: 5, desc: '閱讀短句並對照生活插圖判斷真偽' }
        ]
      }
    },
    scoring: {
      passThresholdPercent: 70, // 答對 21/30 題以上通過 Pre-A1
      targetCefr: 'CEFR Pre-A1'
    },
    features: [
      '官方全真 30 題標準卷（聽力 15 + 閱讀 15）',
      '聽力語音標準播音 2 次規範',
      '結合日常生活告示、短句與生活圖表',
      '提供 Pre-A1 能力通過預估診斷'
    ]
  },
  'ministry-assessment': {
    id: 'ministry-assessment',
    name: '教育部縣市學力檢測 (SAA) 實戰模考',
    badge: 'SAA 標準化學測',
    shortName: '學力檢測模考',
    icon: 'ClipboardCheck',
    themeColor: 'indigo',
    description: '臺中教育大學 SAA 臺灣學生學習成就評量：聽力三大題 + 閱讀二大題（含長篇/圖表題組）。',
    status: 'preparing',
    targetGrades: [4, 5, 6],
    tiers: [
      { name: '精熟 (Proficient)', minScorePercent: 85, color: 'text-emerald-400', desc: '英語核心素養優異，能靈活統整長篇訊息' },
      { name: '基礎 (Basic)', minScorePercent: 60, color: 'text-amber-400', desc: '具備該年級教育部課綱之基本學力' },
      { name: '待加強 (Developing)', minScorePercent: 0, color: 'text-rose-400', desc: '基礎字彙與基本句型需持續加強複習' }
    ],
    structure: {
      part1_listening: {
        name: '第一部分：聽力測驗',
        sections: [
          { type: 'L-SENT', name: '一、辨識句意', desc: '聽句子，選出符合句意的圖片' },
          { type: 'L-QA', name: '二、基本問答', desc: '聽單一問句，選出最適合的答覆' },
          { type: 'L-CONV', name: '三、言談理解', desc: '聽對話或日常短文廣播，回答所提出的問題' }
        ]
      },
      part2_reading: {
        name: '第二部分：閱讀測驗',
        sections: [
          { type: 'G-MC', name: '一、單題（字彙與語法）', desc: '檢測基本字彙辨析、句型結構與日常生活會話' },
          { type: 'R-PASSAGE', name: '二、題組（篇章理解）', desc: '閱讀海報、菜單、書信或短篇故事，回答 2～3 題延伸問題' }
        ]
      }
    },
    features: [
      '對標國小 4、5、6 年級縣市英語學力檢測標準題型',
      '標準化試卷三大聽力題型 + 二大閱讀題型',
      '素養導向：融入生活菜單、活動海報、時刻表與篇章題組',
      '結算產出 精熟 / 基礎 / 待加強 三級成就診斷報告'
    ]
  },
  mistakes: {
    id: 'mistakes',
    name: '個人易錯題弱點擊破室',
    badge: '弱點專區',
    shortName: '易錯題複習',
    icon: 'RotateCcw',
    themeColor: 'purple',
    description: '跨軌道自動記錄錯題，專門針對個人弱點強化練習，連續答對 2 次自動移除出庫。',
    status: 'active',
    targetGrades: [1, 2, 3, 4, 5, 6],
    features: [
      '系統自動收納各次檢定作答失誤題目',
      '答對即增加連續正解紀錄 (Streak)',
      '連續答對 2 次自動從易錯題庫解除歸檔',
      '題目不足目標題數時自動由本年級題庫隨機補充'
    ]
  }
};
