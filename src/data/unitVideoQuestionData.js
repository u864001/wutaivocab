/**
 * 雙語聽說探險館 & 山豬影城 影片題庫資料集
 * 整合 YouTube 官方無限制全球嵌入串流（0 伺服器頻寬負擔）+ 時間戳記精確播放（start & end 秒數）
 * 支援小鎮山豬影城全片放映，與聽說館微秒級出題選答句（三選一精緻毛玻璃版面）
 */

export const UNIT_VIDEO_LIBRARY = [
  {
    id: 'demo_hwg_g3',
    title: 'Here We Go 第 1 冊：Hello! What’s Your Name?',
    book: 1,
    unit: 'Unit 1',
    description: '初學美語必備：親切自我介紹、打招呼與問候姓名（Super Simple Songs 純正美語情境）。',
    youtubeId: 'zMdq9jSaNLg', // Super Simple Songs: What's Your Name?
    totalDuration: 100,
    clips: [
      {
        id: 'c1_1',
        start: 5,
        end: 17,
        promptZh: '看影片中親切打招呼，選出反覆詢問的問候句：',
        targetEn: 'Hello, hello, what’s your name?',
        targetZh: '哈囉，哈囉，你叫什麼名字？',
        speaker: 'Noodle & Friends',
        choices: [
          { key: 'A', text: 'Hello, hello, what’s your name?', isCorrect: true },
          { key: 'B', text: 'How old are you today?', isCorrect: false },
          { key: 'C', text: 'Goodbye, see you tomorrow!', isCorrect: false }
        ]
      },
      {
        id: 'c1_2',
        start: 18,
        end: 28,
        promptZh: '布偶 Noodle 自我介紹時回答了哪一句？選出正確答句：',
        targetEn: 'My name is Noodle. Nice to meet you!',
        targetZh: '我的名字是 Noodle。很高興認識你！',
        speaker: 'Noodle',
        choices: [
          { key: 'A', text: 'I have two brown cats.', isCorrect: false },
          { key: 'B', text: 'My name is Noodle. Nice to meet you!', isCorrect: true },
          { key: 'C', text: 'Good night, sleep tight.', isCorrect: false }
        ]
      },
      {
        id: 'c1_3',
        start: 40,
        end: 51,
        promptZh: '第二位主角 Blossom 出場自我介紹，選出正確答句：',
        targetEn: 'My name is Blossom. Nice to meet you!',
        targetZh: '我的名字是 Blossom。很高興認識你！',
        speaker: 'Blossom',
        choices: [
          { key: 'A', text: 'My name is Blossom. Nice to meet you!', isCorrect: true },
          { key: 'B', text: 'I am eleven years old.', isCorrect: false },
          { key: 'C', text: 'No, thank you very much.', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'demo_hwg_daily',
    title: '情境英語生活會話：Daily Conversation for Kids',
    book: 4,
    unit: 'Unit 2',
    description: '兒童常用生活英語：打招呼、問候心情、學校日常與禮貌用語（山豬影城 & 聽說館放映）。',
    youtubeId: 'OH7dusC7P2U',
    totalDuration: 180,
    clips: [
      {
        id: 'c2_1',
        start: 4,
        end: 14,
        promptZh: '看影片主角親切問候，選出劇中的正確會話問句：',
        targetEn: 'Hello, how are you today?',
        targetZh: '哈囉，你今天好嗎？',
        speaker: 'Emma',
        choices: [
          { key: 'A', text: 'Hello, how are you today?', isCorrect: true },
          { key: 'B', text: 'What time is it now?', isCorrect: false },
          { key: 'C', text: 'Where is my school bag?', isCorrect: false }
        ]
      },
      {
        id: 'c2_2',
        start: 15,
        end: 25,
        promptZh: '聆聽這段影片對話，主角熱情回答了什麼？選出正確答句：',
        targetEn: 'I am doing great, thank you!',
        targetZh: '我很好，謝謝你！',
        speaker: 'Alex',
        choices: [
          { key: 'A', text: 'I am doing great, thank you!', isCorrect: true },
          { key: 'B', text: 'She is eating an apple.', isCorrect: false },
          { key: 'C', text: 'It is rainy and cold.', isCorrect: false }
        ]
      },
      {
        id: 'c2_3',
        start: 26,
        end: 36,
        promptZh: '主角向朋友禮貌道別時，說了哪一句最標準的祝福語？',
        targetEn: 'See you later, have a nice day!',
        targetZh: '待會見，祝你有美好的一天！',
        speaker: 'Emma',
        choices: [
          { key: 'A', text: 'See you later, have a nice day!', isCorrect: true },
          { key: 'B', text: 'I don’t want to go.', isCorrect: false },
          { key: 'C', text: 'They are my best friends.', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'demo_hwg_practice',
    title: '基礎英語會話問答：English Conversation Practice',
    book: 7,
    unit: 'Unit 1',
    description: '日常生活問答精選：問候、自我介紹與休閒對話，零負擔精熟聆聽練習。',
    youtubeId: 'K-U5cx2uKPc',
    totalDuration: 210,
    clips: [
      {
        id: 'c3_1',
        start: 3,
        end: 14,
        promptZh: '聆聽影片中的日常對話，選出問候朋友的問句：',
        targetEn: 'Nice to meet you! How are you doing?',
        targetZh: '很高興認識你！你最近好嗎？',
        speaker: 'Host',
        choices: [
          { key: 'A', text: 'Nice to meet you! How are you doing?', isCorrect: true },
          { key: 'B', text: 'Where did you put the book?', isCorrect: false },
          { key: 'C', text: 'Do you have five pens?', isCorrect: false }
        ]
      },
      {
        id: 'c3_2',
        start: 15,
        end: 26,
        promptZh: '對方回應近況時說了哪一句？選出正確答句：',
        targetEn: 'I am fine, thank you. And you?',
        targetZh: '我很好，謝謝你。那你呢？',
        speaker: 'Guest',
        choices: [
          { key: 'A', text: 'I am fine, thank you. And you?', isCorrect: true },
          { key: 'B', text: 'I am playing basketball.', isCorrect: false },
          { key: 'C', text: 'No, it is not sunny today.', isCorrect: false }
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
