/**
 * 雙語聽說探險館 & 山豬影城 影片題庫資料集
 * 整合 YouTube 串流（0 頻寬負擔）+ 時間戳記精確播放（start & end 秒數）
 * 支援小鎮山豬影城全片放映，與聽說館微秒級出題選答句
 */

export const UNIT_VIDEO_LIBRARY = [
  {
    id: 'demo_hwg_g7',
    title: 'Here We Go 國一先修：Taipei 101 & Travel Adventure',
    book: 9,
    unit: 'Unit 1',
    description: 'Amber, Edison 與 Thor 在臺北 101 與故宮的冒險對話，全片情境會話放映。',
    youtubeId: 'bO8-Q_9sV1E', // 支援替換為學校自製或任何 YouTube 影片 ID
    fallbackYoutubeId: '74mS_r0V8vM',
    totalDuration: 180, // 秒
    clips: [
      {
        id: 'c1',
        start: 5,
        end: 12,
        promptZh: '仔細看影片片段中的人物對話，主角剛剛問了什麼？選出正確的句子：',
        targetEn: 'Where did you go last weekend?',
        targetZh: '你上週末去了哪裡？',
        speaker: 'Edison',
        choices: [
          { key: 'A', text: 'Where did you go last weekend?', isCorrect: true },
          { key: 'B', text: 'What are you doing now?', isCorrect: false },
          { key: 'C', text: 'How is the weather today?', isCorrect: false },
          { key: 'D', text: 'Can you speak English?', isCorrect: false }
        ]
      },
      {
        id: 'c2',
        start: 13,
        end: 20,
        promptZh: '聆聽這段影片對話，主角回答了什麼？選出正確答句：',
        targetEn: 'I went to Taipei 101 with Amber.',
        targetZh: '我和 Amber 去了臺北 101。',
        speaker: 'Amber',
        choices: [
          { key: 'A', text: 'She is sleeping at home.', isCorrect: false },
          { key: 'B', text: 'I went to Taipei 101 with Amber.', isCorrect: true },
          { key: 'C', text: 'They like beef noodles.', isCorrect: false },
          { key: 'D', text: 'It was ten o’clock.', isCorrect: false }
        ]
      },
      {
        id: 'c3',
        start: 22,
        end: 30,
        promptZh: '看影片主角在餐廳的情境，選出最適合的應答句：',
        targetEn: 'What did you eat for lunch?',
        targetZh: '你們午餐吃了什麼？',
        speaker: 'Peter',
        choices: [
          { key: 'A', text: 'We ate beef noodles and drank juice.', isCorrect: true },
          { key: 'B', text: 'I am playing football.', isCorrect: false },
          { key: 'C', text: 'No, it is not sunny.', isCorrect: false },
          { key: 'D', text: 'He went to bed early.', isCorrect: false }
        ]
      },
      {
        id: 'c4',
        start: 32,
        end: 41,
        promptZh: '主角在故宮博物院看到了什麼？選出影片中的正確句子：',
        targetEn: 'We saw a lot of beautiful artwork.',
        targetZh: '我們看到了許多美麗的藝術品。',
        speaker: 'Edison',
        choices: [
          { key: 'A', text: 'I have a headache.', isCorrect: false },
          { key: 'B', text: 'It’s twenty dollars.', isCorrect: false },
          { key: 'C', text: 'We saw a lot of beautiful artwork.', isCorrect: true },
          { key: 'D', text: 'Where is the bus station?', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'demo_hwg_g3',
    title: 'Here We Go 第 1 冊：Hello! What’s Your Name?',
    book: 1,
    unit: 'Unit 1',
    description: '初學美語必備：親切自我介紹、打招呼與問候姓名。',
    youtubeId: 'kJQP7kiw5Fk', // 支援自由自訂
    totalDuration: 120,
    clips: [
      {
        id: 'c1_1',
        start: 3,
        end: 9,
        promptZh: '請看影片中新同學互相打招呼，選出正確的問句：',
        targetEn: 'Hello! What’s your name?',
        targetZh: '哈囉！你叫什麼名字？',
        speaker: 'Teacher',
        choices: [
          { key: 'A', text: 'Hello! What’s your name?', isCorrect: true },
          { key: 'B', text: 'How old are you?', isCorrect: false },
          { key: 'C', text: 'Are you okay?', isCorrect: false },
          { key: 'D', text: 'Goodbye, see you tomorrow!', isCorrect: false }
        ]
      },
      {
        id: 'c1_2',
        start: 10,
        end: 17,
        promptZh: '新同學自我介紹時說了哪一句？選出正確句子：',
        targetEn: 'My name is Peter. Nice to meet you!',
        targetZh: '我的名字是 Peter。很高興認識你！',
        speaker: 'Peter',
        choices: [
          { key: 'A', text: 'I have two cats.', isCorrect: false },
          { key: 'B', text: 'My name is Peter. Nice to meet you!', isCorrect: true },
          { key: 'C', text: 'This is my bag.', isCorrect: false },
          { key: 'D', text: 'Good night, sleep tight.', isCorrect: false }
        ]
      }
    ]
  }
];

export function getVideoLibrary() {
  return UNIT_VIDEO_LIBRARY;
}

export function getVideoById(id) {
  return UNIT_VIDEO_LIBRARY.find(v => v.id === id) || UNIT_VIDEO_LIBRARY[0];
}
