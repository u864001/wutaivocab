/**
 * Test My English Pre-A1 官方模擬測驗規格定義與題型體系
 * 參考教育部「英語能力檢測平台」(Test My English) Pre-A1 級別規範
 * 網址: https://www.testmyenglish.edu.tw/local/list_english_test/prea1.php
 *
 * 五大能力面向：字彙 (Vocabulary)、聽力 (Listening)、閱讀 (Reading)、口說 (Speaking)、寫作 (Writing)
 */

export const TME_PRE_A1_CATEGORIES = {
  vocab: {
    id: 'vocab',
    label: '字彙 (Vocabulary)',
    icon: '🔤',
    subTypes: [
      { code: 'vocab-word2pic', label: '看字選圖', prompt: '看英文單字，選出正確的圖片。' },
      { code: 'vocab-pic2word', label: '看圖選字', prompt: '看圖片內容，選出正確的英文單字。' },
      { code: 'vocab-audio2pic', label: '聽音選圖', prompt: '聽語音單字，選出相符的圖片。', audio: true },
      { code: 'vocab-audio2word', label: '聽音選字', prompt: '聽語音單字，選出拼寫正確的單字。', audio: true }
    ]
  },
  listening: {
    id: 'listening',
    label: '聽力 (Listening)',
    icon: '🎧',
    subTypes: [
      { code: 'listen-pic2sent', label: '看圖選句', prompt: '看圖片並聽語音，選出描述正確的句子。', audio: true },
      { code: 'listen-dlg2pic', label: '聽對話選圖', prompt: '聽一段對話，選出對話相符的圖片。', audio: true },
      { code: 'listen-resp', label: '選正確回應', prompt: '聽日常問句，選出最適當的回應句子。', audio: true },
      { code: 'listen-conv-qa', label: '聽對話答選擇題', prompt: '聽男女對話與問題，選出正確的答案。', audio: true }
    ]
  },
  reading: {
    id: 'reading',
    label: '閱讀 (Reading)',
    icon: '📖',
    subTypes: [
      { code: 'read-pic2word', label: '看圖選字', prompt: '看生活圖卡或告示，選出正確的單字。' },
      { code: 'read-truefalse', label: '是非判斷', prompt: '閱讀英文句子並對照圖片，選出 True (相符) 或 False (不符)。' },
      { code: 'read-pic2sent', label: '看圖選句', prompt: '看生活情境圖片，選出最相符的英文句子。' },
      { code: 'read-cloze', label: '段落填空', prompt: '閱讀簡短短文，在空格中選出最適當的單字。' }
    ]
  },
  speaking: {
    id: 'speaking',
    label: '口說 (Speaking)',
    icon: '🎙️',
    subTypes: [
      { code: 'speak-word', label: '單字片語朗讀', prompt: '看螢幕上的單字或片語，按下錄音並清晰朗讀。', audio: true },
      { code: 'speak-short', label: '短句朗讀', prompt: '看日常問候或問句，按下錄音並自然朗讀。', audio: true },
      { code: 'speak-long', label: '長句朗讀', prompt: '看生活情境敘述長句，注意連音與語調完整朗讀。', audio: true }
    ]
  },
  writing: {
    id: 'writing',
    label: '寫作 (Writing)',
    icon: '✍️',
    subTypes: [
      { code: 'write-scramble-resp', label: '看問句重組答句', prompt: '閱讀上方英文問句，將下方打散的單字依序重組成合適的答句。' },
      { code: 'write-scramble-q', label: '看答句重組問句', prompt: '閱讀上方英文答句，將下方打散的單字依序重組成合適的疑問句。' }
    ]
  }
};

export const TME_PRE_A1_SPEC = {
  id: 'tme-preA1',
  title: 'Test My English Pre-A1 英語能力檢定模擬試卷',
  cefrLevel: 'Pre-A1',
  standardMinutes: 35,
  totalQuestions: 30,
  passThresholdScore: 21, // 21/30 = 70%
  categories: TME_PRE_A1_CATEGORIES
};
