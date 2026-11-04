/**
 * Test My English Pre-A1 官方模擬測驗規格定義
 * 參考教育部「英語能力檢測平台」(Test My English) Pre-A1 級別規範
 * 網址: https://www.testmyenglish.edu.tw/local/list_english_test/prea1.php
 *
 * 目標對象: 國小 3～5 年級學生
 * 能力級別: CEFR Pre-A1
 * 題數標準: 30 題 (聽力 15 題 + 閱讀 15 題)
 * 測驗時間: 建議 35 分鐘
 * 通過標準: 答對 21 題以上 (>= 70%)
 */

export const TME_PRE_A1_SPEC = {
  id: 'tme-preA1',
  title: 'Test My English Pre-A1 英語能力檢定模擬試卷',
  cefrLevel: 'Pre-A1',
  standardMinutes: 35,
  totalQuestions: 30,
  passThresholdScore: 21, // 21/30 = 70%
  sections: [
    {
      id: 'listening',
      name: '第一部分：聽力測驗 (Listening)',
      totalQuestions: 15,
      audioRepeatCount: 2, // 官方規格每題播音 2 次
      taskTypes: [
        {
          code: 'L-PIC',
          label: '聽音選圖',
          count: 5,
          prompt: '請聽語音內容，選出最相符的圖片。',
          description: '測驗單字與簡短單句之具象聽解能力。'
        },
        {
          code: 'L-WORD',
          label: '聽音選字',
          count: 5,
          prompt: '請聽語音單字讀音，選出拼寫正確的單字。',
          description: '測驗字母拼讀 (Phonics) 與生活高頻字之聽音辨字。'
        },
        {
          code: 'L-RESP',
          label: '聽問句選回應',
          count: 5,
          prompt: '請聽語音問句，選出適當的應答語。',
          description: '測驗打招呼、年齡、喜好、位置等日常問答聽解。'
        }
      ]
    },
    {
      id: 'reading',
      name: '第二部分：閱讀測驗 (Reading)',
      totalQuestions: 15,
      taskTypes: [
        {
          code: 'V-PIC',
          label: '看圖選字',
          count: 5,
          prompt: '看圖片內容，選出正確的英文單字。',
          description: '測驗日常生活文具、動物、食物、家人等基本字彙。'
        },
        {
          code: 'R-MATCH',
          label: '圖文告示配合',
          count: 5,
          prompt: '觀察生活標誌或告示牌，選出正確說明。',
          description: '測驗生活標誌 (Stop, Open, Exit 等) 與簡易時間表。'
        },
        {
          code: 'R-TF',
          label: '看圖判斷是非',
          count: 5,
          prompt: '閱讀英文句子並對照圖片，選出敘述是否相符。',
          description: '測驗基本主詞與動詞、顏色、數量之圖文語意比對。'
        }
      ]
    }
  ]
};

/**
 * 試題範例 Schema 規格範本（供後續擴充 Pre-A1 題庫時作為標準模板）
 */
export const TME_PRE_A1_SAMPLE_SCHEMA = {
  id: "tme_sample_01",
  track: "tme-preA1",
  section: "listening", // 'listening' | 'reading'
  taskType: "L-PIC",    // 'L-PIC' | 'L-WORD' | 'L-RESP' | 'V-PIC' | 'R-MATCH' | 'R-TF'
  difficulty: 1,        // 1(易) / 2(中) / 3(難)
  targetGrade: 3,
  reviewed: true,
  media: {
    audioText: "The cat is on the chair.",
    audioRepeat: 2,
    imageType: "svg",   // 'svg' | 'webp'
    imageId: "cat_on_chair"
  },
  question: "Look at the pictures. Where is the cat?",
  options: ["Picture A", "Picture B", "Picture C"],
  answer: 0,
  explanation: "語音為「The cat is on the chair.」(貓咪在椅子上)，選項 A 顯示貓在椅子上，故選 A。"
};
