/**
 * 雙語聽說探險館 & 山豬影城 影片題庫資料集
 * 整合 YouTube 串流（0 頻寬負擔）+ 時間戳記精確播放（start & end 秒數）
 * 支援小鎮山豬影城全片放映，與聽說館微秒級出題選答句（三選一精緻毛玻璃版面）
 */

export const UNIT_VIDEO_LIBRARY = [
  {
    id: 'demo_hwg_g3',
    title: 'Here We Go 第 1 冊：Hello! What’s Your Name?',
    book: 1,
    unit: 'Unit 1',
    description: '初學美語必備：親切自我介紹、打招呼與問候姓名（純正美語對話情境）。',
    youtubeId: '3AOPZk_QjDk', // 正式美語情境對話：Hello! What is your name?
    totalDuration: 120,
    clips: [
      {
        id: 'c1_1',
        start: 3,
        end: 11,
        promptZh: '看影片中同學親切打招呼，選出劇中的正確問句：',
        targetEn: 'Hello! What’s your name?',
        targetZh: '哈囉！你叫什麼名字？',
        speaker: 'Teacher',
        choices: [
          { key: 'A', text: 'Hello! What’s your name?', isCorrect: true },
          { key: 'B', text: 'How old are you?', isCorrect: false },
          { key: 'C', text: 'Goodbye, see you tomorrow!', isCorrect: false }
        ]
      },
      {
        id: 'c1_2',
        start: 12,
        end: 20,
        promptZh: '同學自我介紹時回答了哪一句？選出正確答句：',
        targetEn: 'My name is Peter. Nice to meet you!',
        targetZh: '我的名字是 Peter。很高興認識你！',
        speaker: 'Peter',
        choices: [
          { key: 'A', text: 'I have two cats.', isCorrect: false },
          { key: 'B', text: 'My name is Peter. Nice to meet you!', isCorrect: true },
          { key: 'C', text: 'Good night, sleep tight.', isCorrect: false }
        ]
      },
      {
        id: 'c1_3',
        start: 21,
        end: 29,
        promptZh: '聽影片中的日常問候，選出正確的應對禮貌句：',
        targetEn: 'Nice to meet you, too!',
        targetZh: '我也很高興認識你！',
        speaker: 'Friend',
        choices: [
          { key: 'A', text: 'Nice to meet you, too!', isCorrect: true },
          { key: 'B', text: 'I am eleven years old.', isCorrect: false },
          { key: 'C', text: 'No, thank you.', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'demo_hwg_g7',
    title: 'Here We Go 國一先修：Taipei 101 & Weekend Adventure',
    book: 9,
    unit: 'Unit 1',
    description: 'Amber, Edison 與 Thor 在臺北 101 與故宮的冒險對話，全片情境會話放映。',
    youtubeId: 'bO8-Q_9sV1E',
    totalDuration: 180,
    clips: [
      {
        id: 'c7_1',
        start: 5,
        end: 12,
        promptZh: '看影片主角詢問週末生活，選出正確問句：',
        targetEn: 'Where did you go last weekend?',
        targetZh: '你上週末去了哪裡？',
        speaker: 'Edison',
        choices: [
          { key: 'A', text: 'Where did you go last weekend?', isCorrect: true },
          { key: 'B', text: 'What are you doing now?', isCorrect: false },
          { key: 'C', text: 'How is the weather today?', isCorrect: false }
        ]
      },
      {
        id: 'c7_2',
        start: 13,
        end: 20,
        promptZh: '聆聽這段影片對話，主角回答了什麼？選出正確答句：',
        targetEn: 'I went to Taipei 101 with Amber.',
        targetZh: '我和 Amber 去了臺北 101。',
        speaker: 'Amber',
        choices: [
          { key: 'A', text: 'She is sleeping at home.', isCorrect: false },
          { key: 'B', text: 'I went to Taipei 101 with Amber.', isCorrect: true },
          { key: 'C', text: 'They like beef noodles.', isCorrect: false }
        ]
      },
      {
        id: 'c7_3',
        start: 22,
        end: 30,
        promptZh: '看影片主角在餐廳的情境，選出最適合的應答句：',
        targetEn: 'We ate beef noodles and drank juice.',
        targetZh: '我們吃了牛肉麵並喝了果汁。',
        speaker: 'Peter',
        choices: [
          { key: 'A', text: 'We ate beef noodles and drank juice.', isCorrect: true },
          { key: 'B', text: 'I am playing football.', isCorrect: false },
          { key: 'C', text: 'No, it is not sunny.', isCorrect: false }
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
