/**
 * 雙語聽說探險館 & 山豬影城 影片題庫資料集
 * 整合 YouTube 官方無限制全球嵌入串流（0 伺服器頻寬負擔）+ 時間戳記精確播放（start & end 秒數）
 * 支援小鎮山豬影城【A 廳/B 廳 放映時刻表】全片放映，與聽說館微秒級出題選答句
 */

export const UNIT_VIDEO_LIBRARY = [
  // ── 🏛️ A 廳：黑熊巨幕微電影特映場 (優先首位，開屏即見) ──
  {
    id: 'halloween_movie_yt',
    title: '🎬 Mia & Ben Halloween at School (ChatGPT 動畫短片)',
    shortTitle: '萬聖節動畫短片 (YouTube)',
    book: 1,
    unit: 'Halloween Special',
    hall: 'A',
    hallName: 'A 廳 (黑熊巨幕廳)',
    showtime: '14:00',
    showtimeLabel: '午後首映 14:00',
    description: '老師上傳之 ChatGPT 動畫微電影（片長 66 秒）• YouTube 官方串流放映。',
    youtubeId: 'cEO7iS9LNew',
    thumbnail: 'https://i.ytimg.com/vi/cEO7iS9LNew/hqdefault.jpg',
    badge: 'YouTube 官方串流',
    genre: '校園節慶英語動畫',
    totalDuration: 66,
    clips: [
      {
        id: 'hw_yt_1',
        start: 2,
        end: 11,
        promptZh: 'Mia 在校門口說了 "Good morning!"，Ben 的回答是：',
        targetEn: 'Good morning!',
        targetZh: '早安！',
        speaker: 'Ben',
        choices: [
          { text: 'Good morning!', isCorrect: true },
          { text: 'Goodbye!', isCorrect: false },
          { text: 'Good night!', isCorrect: false }
        ]
      },
      {
        id: 'hw_yt_2',
        start: 11,
        end: 22,
        promptZh: 'Mia 詢問 "What\'s your name?"，Ben 的回答是：',
        targetEn: "I'm Ben.",
        targetZh: '我是 Ben。',
        speaker: 'Ben',
        choices: [
          { text: 'My name is Ben.', isCorrect: false },
          { text: "I'm Ben.", isCorrect: true },
          { text: "I'm fine.", isCorrect: false }
        ]
      },
      {
        id: 'hw_yt_3',
        start: 22,
        end: 32,
        promptZh: 'Ben 問 Mia 幾歲時，Mia 的回答是：',
        targetEn: "I'm nine. How old are you?",
        targetZh: '我九歲。你幾歲？',
        speaker: 'Mia',
        choices: [
          { text: "I'm seven years old.", isCorrect: false },
          { text: "I'm nine. How old are you?", isCorrect: true },
          { text: "I'm ten years old.", isCorrect: false }
        ]
      },
      {
        id: 'hw_yt_4',
        start: 33,
        end: 45,
        promptZh: '詢問教室文具是什麼顏色時，Ben 的回答是：',
        targetEn: "It's blue.",
        targetZh: '它是藍色的。',
        speaker: 'Ben',
        choices: [
          { text: "It's red.", isCorrect: false },
          { text: "It's blue.", isCorrect: true },
          { text: "It's green.", isCorrect: false }
        ]
      },
      {
        id: 'hw_yt_5',
        start: 46,
        end: 56,
        promptZh: '在海報前練習數數時，數出了哪些數字？',
        targetEn: "Six, seven, eight, nine, ten!",
        targetZh: '六、七、八、九、十！',
        speaker: 'Ben',
        choices: [
          { text: "Six, seven, eight, nine, ten!", isCorrect: true },
          { text: "One, two, three, four, five.", isCorrect: false },
          { text: "Ten, nine, eight, seven, six.", isCorrect: false }
        ]
      },
      {
        id: 'hw_yt_6',
        start: 56,
        end: 65,
        promptZh: '萬聖節領糖果慶祝時，Ben 說了哪一句話？',
        targetEn: "Trick or treat!",
        targetZh: '不給糖就搗蛋！',
        speaker: 'Ben',
        choices: [
          { text: "Trick or treat!", isCorrect: true },
          { text: "Happy New Year!", isCorrect: false },
          { text: "Line up, please!", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'halloween_movie',
    title: '🎃 Mia & Ben Halloween School Day (30幕原畫微電影)',
    shortTitle: '萬聖節微電影 (原生原畫)',
    book: 1,
    unit: 'Halloween Special',
    hall: 'A',
    hallName: 'A 廳 (黑熊巨幕廳)',
    showtime: '10:00',
    showtimeLabel: '晨間早場 10:00',
    description: '30 張原生插圖電影級運鏡 • 美語情境會話 • 獨立外掛字幕與純聽力特訓。',
    isLocalPlayer: true,
    localUrl: '/halloween/index.html',
    thumbnail: '/assets/langlab/halloween/full_frames/S01_A_arrival.png',
    badge: '自研 2.5D 原生微電影',
    genre: '繪本情境冒險微電影',
    totalDuration: 214,
    clips: [
      {
        id: 'hw_1',
        start: 4,
        end: 12,
        promptZh: 'Mia 在校門口說了 "Good morning!"，Ben 的回答是：',
        targetEn: 'Good morning!',
        targetZh: '早安！',
        speaker: 'Ben',
        choices: [
          { text: 'Good morning!', isCorrect: true },
          { text: 'Good night!', isCorrect: false },
          { text: 'Goodbye!', isCorrect: false }
        ]
      },
      {
        id: 'hw_2',
        start: 13,
        end: 25,
        promptZh: 'Mia 詢問 "What\'s your name?"，Ben 的回答是：',
        targetEn: "I'm Ben.",
        targetZh: '我是 Ben。',
        speaker: 'Ben',
        choices: [
          { text: 'My name is Ben.', isCorrect: false },
          { text: "I'm Ben.", isCorrect: true },
          { text: "I'm fine.", isCorrect: false }
        ]
      },
      {
        id: 'hw_3',
        start: 29,
        end: 37,
        promptZh: 'Mia 在走廊問候 "How are you?"，Ben 的回答是：',
        targetEn: "I'm fine. How are you?",
        targetZh: '我很好。那你呢？',
        speaker: 'Ben',
        choices: [
          { text: "I'm fine. How are you?", isCorrect: true },
          { text: "I'm ten years old.", isCorrect: false },
          { text: 'Nice to meet you.', isCorrect: false }
        ]
      },
      {
        id: 'hw_4',
        start: 39,
        end: 47,
        promptZh: 'Ben 詢問 Mia 的年齡，Mia 的回答是：',
        targetEn: "I'm nine. How old are you?",
        targetZh: '我九歲。你幾歲？',
        speaker: 'Mia',
        choices: [
          { text: "I'm seven years old.", isCorrect: false },
          { text: "I'm nine. How old are you?", isCorrect: true },
          { text: "I'm fine, thank you.", isCorrect: false }
        ]
      },
      {
        id: 'hw_5',
        start: 42,
        end: 51,
        promptZh: 'Mia 反問 Ben 幾歲，Ben 的回答是：',
        targetEn: "I'm ten years old.",
        targetZh: '我十歲。',
        speaker: 'Ben',
        choices: [
          { text: "I'm ten years old.", isCorrect: true },
          { text: "I'm nine years old.", isCorrect: false },
          { text: "I'm eight years old.", isCorrect: false }
        ]
      },
      {
        id: 'hw_6',
        start: 51,
        end: 60,
        promptZh: 'Ms. Lin 在教室門口迎接學生，說了什麼排隊指令？',
        targetEn: 'Line up, please.',
        targetZh: '請排好隊。',
        speaker: 'Ms. Lin',
        choices: [
          { text: 'Line up, please.', isCorrect: true },
          { text: 'Sit down, please.', isCorrect: false },
          { text: 'Open your book, please.', isCorrect: false }
        ]
      },
      {
        id: 'hw_7',
        start: 72,
        end: 79,
        promptZh: 'Mia 指著桌上的文具問 "What\'s this?"，Ben 的回答是：',
        targetEn: "It's a pencil.",
        targetZh: '這是一枝鉛筆。',
        speaker: 'Ben',
        choices: [
          { text: "It's a pencil.", isCorrect: true },
          { text: "It's an eraser.", isCorrect: false },
          { text: "It's a ruler.", isCorrect: false }
        ]
      },
      {
        id: 'hw_8',
        start: 79,
        end: 86,
        promptZh: 'Ben 指著遠處桌面的文具問 "What\'s that?"，Mia 的回答是：',
        targetEn: "It's an eraser.",
        targetZh: '那是一個橡皮擦。',
        speaker: 'Mia',
        choices: [
          { text: "It's a pen.", isCorrect: false },
          { text: "It's a book.", isCorrect: false },
          { text: "It's an eraser.", isCorrect: true }
        ]
      },
      {
        id: 'hw_9',
        start: 104,
        end: 111,
        promptZh: 'Mia 詢問 "What color is it?"，Ben 拿著尺的回答是：',
        targetEn: "It's blue.",
        targetZh: '它是藍色的。',
        speaker: 'Ben',
        choices: [
          { text: "It's red.", isCorrect: false },
          { text: "It's blue.", isCorrect: true },
          { text: "It's green.", isCorrect: false }
        ]
      },
      {
        id: 'hw_10',
        start: 128,
        end: 138,
        promptZh: 'Ben 詢問遺失的彩色筆是什麼顏色，Mia 的回答是：',
        targetEn: "It's black.",
        targetZh: '它是黑色的。',
        speaker: 'Mia',
        choices: [
          { text: "It's yellow.", isCorrect: false },
          { text: "It's black.", isCorrect: true },
          { text: "It's red.", isCorrect: false }
        ]
      },
      {
        id: 'hw_11',
        start: 157,
        end: 164,
        promptZh: 'Mia 找到彩色筆向 Ben 道謝 "Thanks!"，Ben 的禮貌回答是：',
        targetEn: "You're welcome.",
        targetZh: '不客氣。',
        speaker: 'Ben',
        choices: [
          { text: "You're welcome.", isCorrect: true },
          { text: "Good job.", isCorrect: false },
          { text: "I'm sorry.", isCorrect: false }
        ]
      },
      {
        id: 'hw_12',
        start: 184,
        end: 190,
        promptZh: '聽影片中 Ben 數海報上的貼紙，他數出了哪些數字？',
        targetEn: "Six, seven, eight, nine, ten!",
        targetZh: '六、七、八、九、十！',
        speaker: 'Ben',
        choices: [
          { text: "Six, seven, eight, nine, ten!", isCorrect: true },
          { text: "One, two, three, four, five.", isCorrect: false },
          { text: "Ten, nine, eight, seven, six.", isCorrect: false }
        ]
      },
      {
        id: 'hw_13',
        start: 192,
        end: 200,
        promptZh: 'Mia 說她是女巫 (a witch)，Ben 穿上披風說了什麼？',
        targetEn: "I'm a vampire!",
        targetZh: '我是吸血鬼！',
        speaker: 'Ben',
        choices: [
          { text: "I'm a ghost!", isCorrect: false },
          { text: "I'm a vampire!", isCorrect: true },
          { text: "I'm a monster!", isCorrect: false }
        ]
      },
      {
        id: 'hw_14',
        start: 204,
        end: 211,
        promptZh: '全班萬聖節慶祝領糖果時，Ben 說了哪一句經典名句？',
        targetEn: "Trick or treat!",
        targetZh: '不給糖就搗蛋！',
        speaker: 'Ben',
        choices: [
          { text: "Trick or treat!", isCorrect: true },
          { text: "Happy New Year!", isCorrect: false },
          { text: "Line up, please!", isCorrect: false }
        ]
      }
    ]
  },

  // ── 🎪 B 廳：百步蛇音樂與生活英語劇場 ──
  {
    id: 'demo_hwg_g3',
    title: 'Here We Go 第 1 冊：Hello! What’s Your Name?',
    shortTitle: 'HWG 1: What’s Your Name?',
    book: 1,
    unit: 'Unit 1',
    hall: 'B',
    hallName: 'B 廳 (百步蛇音樂廳)',
    showtime: '09:30',
    showtimeLabel: '晨光美語 09:30',
    description: '初學美語必備：親切自我介紹、打招呼與問候姓名（Super Simple Songs 純正美語情境）。',
    youtubeId: 'zMdq9jSaNLg',
    thumbnail: 'https://i.ytimg.com/vi/zMdq9jSaNLg/hqdefault.jpg',
    badge: 'Super Simple Songs',
    genre: '兒童歌謠律動',
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
          { text: 'Hello, hello, what’s your name?', isCorrect: true },
          { text: 'How old are you today?', isCorrect: false },
          { text: 'Goodbye, see you tomorrow!', isCorrect: false }
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
          { text: 'I have two brown cats.', isCorrect: false },
          { text: 'My name is Noodle. Nice to meet you!', isCorrect: true },
          { text: 'Good night, sleep tight.', isCorrect: false }
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
          { text: 'My name is Blossom. Nice to meet you!', isCorrect: true },
          { text: 'I am eleven years old.', isCorrect: false },
          { text: 'No, thank you very much.', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'demo_hwg_daily',
    title: 'Here We Go 第 1 冊：Hello! How Are You?',
    shortTitle: 'HWG 1: How Are You?',
    book: 2,
    unit: 'Unit 2',
    hall: 'B',
    hallName: 'B 廳 (百步蛇音樂廳)',
    showtime: '11:00',
    showtimeLabel: '生活問候 11:00',
    description: '兒童常用生活英語：打招呼、問候心情與感受（Super Simple Songs 純正美語情境）。',
    youtubeId: 'tVlcKp3bWH8',
    thumbnail: 'https://i.ytimg.com/vi/tVlcKp3bWH8/hqdefault.jpg',
    badge: '生活美語歌曲',
    genre: '生活心情問答',
    totalDuration: 85,
    clips: [
      {
        id: 'c2_1',
        start: 3,
        end: 14,
        promptZh: '看影片主角歡樂問候，選出問候朋友的問句：',
        targetEn: 'Hello, hello, hello, how are you?',
        targetZh: '哈囉，你好嗎？',
        speaker: 'Super Simple Puppets',
        choices: [
          { text: 'Hello, hello, hello, how are you?', isCorrect: true },
          { text: 'Good night, see you tomorrow!', isCorrect: false },
          { text: 'Where are my crayons?', isCorrect: false }
        ]
      },
      {
        id: 'c2_2',
        start: 14,
        end: 25,
        promptZh: '主角精神飽滿地回答自己心情如何？選出正確答句：',
        targetEn: "I'm good! I'm great! I'm wonderful!",
        targetZh: '我很好！我很棒！我太棒了！',
        speaker: 'Super Simple Puppets',
        choices: [
          { text: "I'm good! I'm great! I'm wonderful!", isCorrect: true },
          { text: "I have five red apples.", isCorrect: false },
          { text: "No, I can't swim.", isCorrect: false }
        ]
      },
      {
        id: 'c2_3',
        start: 40,
        end: 53,
        promptZh: '主角換成疲累與肚子餓時，唱出了哪句心情回答？',
        targetEn: "I'm tired. I'm hungry. I'm not so good.",
        targetZh: '我累了。我肚子餓。我不太好。',
        speaker: 'Super Simple Puppets',
        choices: [
          { text: "I'm tired. I'm hungry. I'm not so good.", isCorrect: true },
          { text: "Yes, I like pizza very much.", isCorrect: false },
          { text: "She is my English teacher.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'demo_hwg_practice',
    title: '基礎英語會話問答：English Conversation Practice',
    shortTitle: '日常會話精選',
    book: 7,
    unit: 'Unit 1',
    hall: 'B',
    hallName: 'B 廳 (百步蛇音樂廳)',
    showtime: '15:00',
    showtimeLabel: '口語會話 15:00',
    description: '日常生活問答精選：問候、自我介紹與休閒對話，零負擔精熟聆聽練習。',
    youtubeId: 'K-U5cx2uKPc',
    thumbnail: 'https://i.ytimg.com/vi/K-U5cx2uKPc/hqdefault.jpg',
    badge: '基礎情境問答',
    genre: '實用生活對話',
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
          { text: 'Nice to meet you! How are you doing?', isCorrect: true },
          { text: 'Where did you put the book?', isCorrect: false },
          { text: 'Do you have five pens?', isCorrect: false }
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
          { text: 'I am fine, thank you. And you?', isCorrect: true },
          { text: 'I am playing basketball.', isCorrect: false },
          { text: 'No, it is not sunny today.', isCorrect: false }
        ]
      }
    ]
  }
];

// 🏛️ 山豬影城 • 放映廳廳別與即將上映排程資料
export const CINEMA_HALL_SCHEDULES = [
  {
    hallId: 'A',
    hallName: 'A 廳 • 黑熊巨幕廳',
    hallSubtitle: '旗艦巨幕！原創節慶微電影與精緻動畫特映場',
    tag: '微電影旗艦',
    themeColor: 'from-amber-950/90 via-stone-900 to-rose-950/80',
    accentBorder: 'border-amber-500/60',
    movieIds: ['halloween_movie_yt', 'halloween_movie'],
    comingSoon: [
      {
        id: 'cs_a_1',
        title: '🍂 Thanksgiving School Play (感恩節校園特別篇)',
        showtimeLabel: '黃金特映 16:30',
        duration: '籌劃中',
        badge: '即將上映',
        description: '節慶情境英語微電影續篇，野豬導演緊鑼密鼓籌備中！敬請期待！'
      }
    ]
  },
  {
    hallId: 'B',
    hallName: 'B 廳 • 百步蛇音樂廳',
    hallSubtitle: '純正美語！課文歌曲律動與生活實用語境劇場',
    tag: '課文生活美語',
    themeColor: 'from-indigo-950/90 via-stone-900 to-slate-950/80',
    accentBorder: 'border-indigo-500/60',
    movieIds: ['demo_hwg_g3', 'demo_hwg_daily', 'demo_hwg_practice'],
    comingSoon: [
      {
        id: 'cs_b_1',
        title: '🎄 Christmas Caroling (聖誕歡樂頌歌特輯)',
        showtimeLabel: '晚間歌謠 17:00',
        duration: '籌劃中',
        badge: '即將上映',
        description: '溫馨校園聖誕歌謠與生活英語會話，即將上映！敬請期待！'
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

export function getCinemaHalls() {
  return CINEMA_HALL_SCHEDULES;
}
