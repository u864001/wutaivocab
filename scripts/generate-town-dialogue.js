import fs from 'fs';
import path from 'path';

// Generator script to produce complete 5-variant dialogue trees for all 10 characters
// (8 town characters + 2 visiting teachers = 50 dialogue trees total)

export const DIALOGUE_DATA_CONTENT = `/**
 * 霧臺英語宇宙 2.0 - 霧臺小鎮 50 套完整對話樹資料庫
 * 涵蓋 8 大生活地標角色 + 2 位客座外師，每個角色均擁有 5 套適合國小全年級的豐富主題對話樹！
 */

export const DIALOGUE_VARIANTS = {
  // ── 🏫 1. 霧臺國小 老校長 Principal Hawk (5 套日常輪替主題) ──
  school: [
    {
      variantId: 'school_v0',
      title: '晨光朝氣與全校任務篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '校長 (Principal)',
          en: "Good morning, young learner! Welcome back to Wutai Elementary School. How are you today?",
          zh: "早安，優秀的小小冒險家！歡迎回到霧臺國小。你今天好嗎？",
          options: [
            { text_en: "I am happy and ready to learn!", text_zh: "我很快樂，準備好學習了！", target_id: 'quest_intro' },
            { text_en: "What classes do we have today?", text_zh: "我們今天有哪些課呢？", target_id: 'classes' },
            { text_en: "I am a little tired today.", text_zh: "我今天有點累。", target_id: 'encourage' }
          ]
        },
        quest_intro: {
          id: 'quest_intro',
          speaker: '校長 (Principal)',
          en: "Wonderful energy! The school bulletin board has daily quests today. Complete them to earn Quest Points for our school honor roll!",
          zh: "太棒的朝氣了！學校布告欄今天有每日探索任務。完成它們可以為我們學校的榮譽榜贏得探索積分喔！",
          options: [
            { text_en: "Let me check the Quest Board!", text_zh: "讓我看看任務布告欄！", action: 'OPEN_QUESTS' },
            { text_en: "Thank you, Principal!", text_zh: "謝謝校長！", target_id: 'farewell' }
          ]
        },
        classes: {
          id: 'classes',
          speaker: '校長 (Principal)',
          en: "Today is an exciting day! We have English, Math, and PE on the sports ground. Remember to bring your workbook and water bottle!",
          zh: "今天是很充實的一天！我們在操場有英語課、數學課和體育課。記得帶你的作業本和大水壺喔！",
          options: [
            { text_en: "I love English and PE!", text_zh: "我最喜歡英語課和體育課！", target_id: 'quest_intro' },
            { text_en: "I will get my workbook ready.", text_zh: "我會準備好我的作業本。", target_id: 'farewell' }
          ]
        },
        encourage: {
          id: 'encourage',
          speaker: '校長 (Principal)',
          en: "Take a deep breath of our fresh mountain air! Drink some warm water, and visit the park after class to see the green trees.",
          zh: "深呼吸一口我們大武山清新的空氣吧！喝點溫水，下課後去公園看看綠樹放鬆一下。",
          options: [
            { text_en: "Thank you, I feel better now!", text_zh: "謝謝您，我感覺好多了！", target_id: 'quest_intro' }
          ]
        },
        farewell: {
          id: 'farewell',
          speaker: '校長 (Principal)',
          en: "Work hard and enjoy your day at Wutai Elementary! Have fun!",
          zh: "認真學習，享受你在霧臺國小的一天！祝你玩得開心！",
          options: [
            { text_en: "Goodbye, Principal!", text_zh: "再見，校長！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'school_v1',
      title: '學用品準備與書局推薦篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '校長 (Principal)',
          en: "Hello, diligent student! Did you pack your school bag and pencil case before coming to school?",
          zh: "你好，勤奮的同學！來學校前，你的書包和鉛筆盒都收拾好了嗎？",
          options: [
            { text_en: "Yes, I have my pencil, eraser, and ruler!", text_zh: "是的，我有鉛筆、橡皮擦和直尺！", target_id: 'bag_check' },
            { text_en: "I forgot my eraser at home.", text_zh: "我把橡皮擦忘在家裡了。", target_id: 'bookstore_tip' }
          ]
        },
        bag_check: {
          id: 'bag_check',
          speaker: '校長 (Principal)',
          en: "Excellent preparation! Being organized is the first step to successful learning. Check the bulletin board for new adventures!",
          zh: "太優秀的準備了！有條不紊是成功學習的第一步。快看看布告欄上有沒有新的冒險吧！",
          options: [
            { text_en: "Open Quest Board!", text_zh: "開啟任務公佈欄！", action: 'OPEN_QUESTS' }
          ]
        },
        bookstore_tip: {
          id: 'bookstore_tip',
          speaker: '校長 (Principal)',
          en: "Don't worry! You can visit Cloud Leopard Bookstore to get a colorful eraser with your student coins.",
          zh: "別擔心！你可以去雲豹書局用你獲得的學生金幣挑選一個彩色橡皮擦。",
          options: [
            { text_en: "I will visit the bookstore!", text_zh: "我等一下去書局看看！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'school_v2',
      title: '校園友愛與禮貌問候篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '校長 (Principal)',
          en: "Good day! A cheerful smile and polite words make our school a happy family. Did you greet your friends today?",
          zh: "你好！燦爛的微笑和有禮貌的話語讓我們的學校像個快樂的大家庭。你今天向朋友們打招呼了嗎？",
          options: [
            { text_en: "Yes! I said 'Good morning' to everyone!", text_zh: "有！我跟大家說了『早安』！", target_id: 'praise_manners' },
            { text_en: "What are the magic polite words in English?", text_zh: "英語裡有哪些神奇的禮貌用語呢？", target_id: 'magic_words' }
          ]
        },
        praise_manners: {
          id: 'praise_manners',
          speaker: '校長 (Principal)',
          en: "Splendid! Kindness is a bright light. When you share warmth, everyone smiles back at you!",
          zh: "太好了！善良就像一盞明亮的燈。當你分享溫暖時，大家也會對你回以微笑！",
          options: [
            { text_en: "I want to do today's school quests!", text_zh: "我想挑戰今天的校園任務！", action: 'OPEN_QUESTS' },
            { text_en: "Thank you, Principal!", text_zh: "謝謝校長！", target_id: 'END' }
          ]
        },
        magic_words: {
          id: 'magic_words',
          speaker: '校長 (Principal)',
          en: "'Please', 'Thank you', and 'Excuse me'! Remember these three magic words, and you will make friends everywhere in the world.",
          zh: "『Please（請）』、『Thank you（謝謝）』還有『Excuse me（不好意思）』！記住這三個神奇單字，你在世界各地都能交到好朋友。",
          options: [
            { text_en: "Thank you for teaching me!", text_zh: "謝謝校長的教導！", target_id: 'praise_manners' }
          ]
        }
      }
    },
    {
      variantId: 'school_v3',
      title: '大武山生態與戶外探索篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '校長 (Principal)',
          en: "Look at the magnificent mountains around our campus! Nature is our greatest outdoor classroom. Do you love outdoor learning?",
          zh: "看看環繞我們校園的大武山群！大自然是我們最棒的戶外教室。你喜歡戶外學習嗎？",
          options: [
            { text_en: "I love exploring plants and animals!", text_zh: "我最喜歡探索植物和動物了！", target_id: 'nature_praise' },
            { text_en: "What can we see in the park today?", text_zh: "今天去公園能看到什麼呢？", target_id: 'park_recommend' }
          ]
        },
        nature_praise: {
          id: 'nature_praise',
          speaker: '校長 (Principal)',
          en: "Curiosity is the key to wisdom! Listen to the birds singing and watch the butterflies dance during break time.",
          zh: "好奇心是通往智慧的鑰匙！下課時間不妨聽聽鳥兒的歌唱，看看蝴蝶翩翩起舞。",
          options: [
            { text_en: "I am ready for nature quests!", text_zh: "我準備好進行自然探索任務了！", action: 'OPEN_QUESTS' }
          ]
        },
        park_recommend: {
          id: 'park_recommend',
          speaker: '校長 (Principal)',
          en: "You can visit Flying Squirrel Park! Elder Squirrel knows all about the mountain breeze and tall trees.",
          zh: "你可以去飛鼠公園看看！飛鼠長老知道所有關於山風與高大樹木的故事。",
          options: [
            { text_en: "I will visit the park later!", text_zh: "我等一下去公園走走！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'school_v4',
      title: '勇氣挑戰與榮譽榜衝刺篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '校長 (Principal)',
          en: "Welcome, champion! Every new English word you speak makes you stronger. Are you ready for today's challenge?",
          zh: "歡迎你，小勇士！你說出的每一個新英語單字，都讓你變得更強大。準備好迎接今天的挑戰了嗎？",
          options: [
            { text_en: "I am ready! I want to reach the top rank!", text_zh: "我準備好了！我想衝刺榮譽榜第一名！", target_id: 'rank_boost' },
            { text_en: "What if I make a mistake?", text_zh: "如果我講錯了怎麼辦？", target_id: 'courage_speech' }
          ]
        },
        rank_boost: {
          id: 'rank_boost',
          speaker: '校長 (Principal)',
          en: "That is the spirit of a true Wutai hero! Complete your daily dialogue quests, and watch your stars shine brightly on the leaderboard!",
          zh: "這就是真正的霧臺小勇士精神！完成你的每日對話任務，看你的星星在排行榜上閃閃發光吧！",
          options: [
            { text_en: "Open Quest Board now!", text_zh: "現在就打開任務公佈欄！", action: 'OPEN_QUESTS' }
          ]
        },
        courage_speech: {
          id: 'courage_speech',
          speaker: '校長 (Principal)',
          en: "Mistakes are proof that you are trying! Never be afraid. Every great explorer learns by taking the first brave step.",
          zh: "犯錯正是你在努力嘗試的證明！永遠不要害怕。每一個偉大的探險家都是從勇敢邁出第一步開始學習的。",
          options: [
            { text_en: "I will be brave and try my best!", text_zh: "我會勇敢盡全力的！", target_id: 'rank_boost' }
          ]
        }
      }
    }
  ],

  // ── 📖 2. 雲豹書局 店長 Manager Leopard (5 套文具與繪本主題) ──
  bookstore: [
    {
      variantId: 'bookstore_v0',
      title: '開學文具挑選篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "Welcome to Cloud Leopard Bookstore! We have colorful pencils, notebooks, and rulers. What can I get for you?",
          zh: "歡迎光臨雲豹書局！我們有彩色鉛筆、筆記本和直尺。今天想找點什麼呢？",
          options: [
            { text_en: "I need a pencil and an eraser.", text_zh: "我需要一枝鉛筆和一塊橡皮擦。", target_id: 'stationery_shelf' },
            { text_en: "May I browse your store catalog?", text_zh: "我可以看看商品目錄嗎？", action: 'OPEN_SHOP' },
            { text_en: "Just looking around today, thank you!", text_zh: "今天只是到處逛逛，謝謝！", target_id: 'browse' }
          ]
        },
        stationery_shelf: {
          id: 'stationery_shelf',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "Great choices! Our 2B pencils write super smoothly, and the soft erasers wipe mistakes away like magic!",
          zh: "太棒的選擇！我們的 2B 鉛筆寫起來超滑順，柔軟的橡皮擦能像魔法一樣把筆誤擦得乾乾淨淨！",
          options: [
            { text_en: "Open shop to buy them!", text_zh: "打開商店購買！", action: 'OPEN_SHOP' },
            { text_en: "How many coins are they?", text_zh: "請問需要多少金幣呢？", target_id: 'price_info' }
          ]
        },
        price_info: {
          id: 'price_info',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "A pencil is only 15 coins, and an eraser is 10 coins. You can earn coins by playing vocab games!",
          zh: "鉛筆只要 15 金幣，橡皮擦只要 10 金幣。認真玩單字遊戲就能賺取金幣喔！",
          options: [
            { text_en: "Let's check the store!", text_zh: "我們來看看商店！", action: 'OPEN_SHOP' },
            { text_en: "I will save up my coins!", text_zh: "我會好好存金幣！", target_id: 'END' }
          ]
        },
        browse: {
          id: 'browse',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "Feel free to look around! The smell of new paper and books is the most relaxing scent in the mountains.",
          zh: "隨意逛逛吧！新書和紙張的香氣，是這座山林裡最讓人放鬆的味道。",
          options: [
            { text_en: "Thank you, Manager Leopard!", text_zh: "謝謝雲豹店長！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'bookstore_v1',
      title: '山林冒險故事繪本篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "Hello, book lover! Have you heard our legendary story about the Flying Squirrel and the Wild Boar?",
          zh: "哈囉，愛看書的朋友！你聽過我們大武山飛鼠與野豬的冒險傳奇故事嗎？",
          options: [
            { text_en: "Tell me the story, please!", text_zh: "請說給我聽！", target_id: 'story_tell' },
            { text_en: "Do you sell storybooks here?", text_zh: "你們這裡有賣故事繪本嗎？", target_id: 'storybook_shop' }
          ]
        },
        story_tell: {
          id: 'story_tell',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "They worked together to protect the ancient forest! Working as a team makes any mission easy and fun.",
          zh: "牠們齊心協力守護了古老森林！團隊合作能讓任何冒險任務變得輕鬆又有趣。",
          options: [
            { text_en: "Teamwork is powerful!", text_zh: "團隊合作真有力量！", target_id: 'END' }
          ]
        },
        storybook_shop: {
          id: 'storybook_shop',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "Yes, we do! Open the store catalog to check out all our adventure books and notebooks.",
          zh: "當然有！打開商店目錄就能看到我們所有的冒險筆記本和繪本喔。",
          options: [
            { text_en: "Open Store Catalog!", text_zh: "開啟商品目錄！", action: 'OPEN_SHOP' }
          ]
        }
      }
    },
    {
      variantId: 'bookstore_v2',
      title: '繽紛色彩與彩繪天地篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "Look at our brand-new color pencils! Red, blue, yellow, and green. What is your favorite color?",
          zh: "看我們剛進貨的彩色鉛筆！紅色、藍色、黃色還有綠色。你最喜歡什麼顏色？",
          options: [
            { text_en: "My favorite color is blue!", text_zh: "我最喜歡藍色！", target_id: 'color_blue' },
            { text_en: "I love bright rainbow colors!", text_zh: "我喜歡明亮的彩虹顏色！", target_id: 'color_rainbow' },
            { text_en: "Can I buy drawing paper?", text_zh: "我可以買畫畫紙嗎？", action: 'OPEN_SHOP' }
          ]
        },
        color_blue: {
          id: 'color_blue',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "Blue like the clear sky above Wutai! Blue makes people feel calm, peaceful, and smart.",
          zh: "就像霧臺上方清澈的蔚藍天空！藍色讓人感到平靜、安心又聰明。",
          options: [
            { text_en: "I want to draw the sky!", text_zh: "我想畫下天空！", action: 'OPEN_SHOP' },
            { text_en: "Thank you for sharing!", text_zh: "謝謝店長分享！", target_id: 'END' }
          ]
        },
        color_rainbow: {
          id: 'color_rainbow',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "Rainbows bring joy and hope! With a 12-color set, you can draw all the birds and flowers in our mountains.",
          zh: "彩虹帶來歡樂與希望！有了 12 色彩色筆，你就能畫出山裡所有的花鳥樹木。",
          options: [
            { text_en: "Let me check the bookstore items!", text_zh: "讓我看看書局商品！", action: 'OPEN_SHOP' }
          ]
        }
      }
    },
    {
      variantId: 'bookstore_v3',
      title: '禮貌詢價與文具購物篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "Welcome! Practicing polite English while shopping is very fun! Try asking me: 'Excuse me, how much is this?'",
          zh: "歡迎！在買東西時練習禮貌的英語非常有趣！試著問我看看：『Excuse me, how much is this?』吧！",
          options: [
            { text_en: "Excuse me, how much is this notebook?", text_zh: "不好意思，請問這本筆記本多少錢？", target_id: 'notebook_price' },
            { text_en: "Can I see the shop items, please?", text_zh: "請讓我看看商品，好嗎？", action: 'OPEN_SHOP' }
          ]
        },
        notebook_price: {
          id: 'notebook_price',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "This adventure notebook is 25 coins! It has smooth blank pages perfect for recording new English words.",
          zh: "這本探險筆記本只要 25 金幣！裡面有平滑的空白頁面，最適合記錄學會的新單字了。",
          options: [
            { text_en: "I would like to buy it!", text_zh: "我想買下它！", action: 'OPEN_SHOP' },
            { text_en: "Thank you for telling me!", text_zh: "謝謝店長告訴我！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'bookstore_v4',
      title: '探險筆記與每日日記篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "A wise explorer writes in a journal every single day. Do you keep a diary of your adventures in Wutai?",
          zh: "智慧的探險家每天都會寫日記。你在霧臺的冒險有寫日記記錄下來嗎？",
          options: [
            { text_en: "Yes, I write new English words every day!", text_zh: "有，我每天都寫下新的英語單字！", target_id: 'journal_praise' },
            { text_en: "What should I write in my diary?", text_zh: "我日記裡可以寫些什麼呢？", target_id: 'journal_tips' }
          ]
        },
        journal_praise: {
          id: 'journal_praise',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "That is wonderful! Reviewing your words daily is the secret of top students. Keep shining!",
          zh: "太棒了！每天複習單字正是學霸的第一名秘訣。繼續保持喔！",
          options: [
            { text_en: "Open shop for new pens and notebooks!", text_zh: "開啟商店挑選新文具與筆記本！", action: 'OPEN_SHOP' }
          ]
        },
        journal_tips: {
          id: 'journal_tips',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "Write the date, the weather, what you ate, and one fun sentence! Writing in English is easy and cool.",
          zh: "寫下日期、今天的天氣、吃了什麼好吃的，還有一句有趣的話！用英文寫日記既簡單又帥氣。",
          options: [
            { text_en: "I will start today! Thank you!", text_zh: "我今天就開始寫！謝謝店長！", target_id: 'END' }
          ]
        }
      }
    }
  ],

  // ── 🛒 3. 黑熊超市 店員 Clerk Bear (5 套美食、蔬果與購物主題) ──
  supermarket: [
    {
      variantId: 'supermarket_v0',
      title: '美味點心與水果補給篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "Hello, little friend! Are you hungry or thirsty after exploring? Welcome to Black Bear Supermarket!",
          zh: "你好呀，小朋友！探險走累了肚子餓或口渴了嗎？歡迎光臨黑熊超市！",
          options: [
            { text_en: "I am hungry! What snacks do you have?", text_zh: "我肚子餓了！有什麼好吃的點心？", target_id: 'snack_recommend' },
            { text_en: "I would like to open the supermarket shop.", text_zh: "我想打開超市商店採買。", action: 'OPEN_SHOP' },
            { text_en: "I am thirsty. Do you have fresh water?", text_zh: "我好渴，有純淨的水嗎？", target_id: 'drink_recommend' }
          ]
        },
        snack_recommend: {
          id: 'snack_recommend',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "We have sweet red apples, fresh sandwiches, and warm cheese pizza! Eating good food gives you big energy!",
          zh: "我們有甜脆的紅蘋果、新鮮的三明治，還有剛出爐的起司披薩！吃好食物能給你滿滿的活力！",
          options: [
            { text_en: "Let me buy some snacks!", text_zh: "讓我買點點心吧！", action: 'OPEN_SHOP' },
            { text_en: "An apple a day keeps the doctor away!", text_zh: "一天一蘋果，醫生遠離我！", target_id: 'apple_wisdom' }
          ]
        },
        apple_wisdom: {
          id: 'apple_wisdom',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "Haha! Exactly! Dr. Owl at the clinic told me the same thing. Apples are crunchy and full of vitamins!",
          zh: "哈哈！沒錯！診所的貓頭鷹醫師也是這麼跟我說的。蘋果清脆又富含維他命！",
          options: [
            { text_en: "I will buy an apple!", text_zh: "我要買一顆蘋果！", action: 'OPEN_SHOP' }
          ]
        },
        drink_recommend: {
          id: 'drink_recommend',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "Yes! Pure mountain water and fresh orange juice. Stay hydrated while hiking in Wutai!",
          zh: "有的！純淨的山泉水還有鮮榨柳橙汁。在霧臺健行一定要隨時補充水分喔！",
          options: [
            { text_en: "Open shop for drinks!", text_zh: "打開商店買飲料！", action: 'OPEN_SHOP' }
          ]
        }
      }
    },
    {
      variantId: 'supermarket_v1',
      title: '健康早餐與元氣補給篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "Good morning! A nutritious breakfast is the fuel of your brain. What did you eat this morning?",
          zh: "早安！營養豐富的早餐是大腦的最佳燃料。你今天早上吃了什麼呢？",
          options: [
            { text_en: "I had milk and bread!", text_zh: "我喝了牛奶吃了麵包！", target_id: 'healthy_choice' },
            { text_en: "I had eggs and a yellow banana!", text_zh: "我吃了雞蛋和一根黃香蕉！", target_id: 'banana_power' },
            { text_en: "I did not eat breakfast yet.", text_zh: "我還沒吃早餐呢。", target_id: 'must_eat' }
          ]
        },
        healthy_choice: {
          id: 'healthy_choice',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "Milk builds strong bones, and bread gives you stamina! You are ready for a super learning day!",
          zh: "牛奶讓骨骼強健，麵包給你滿滿耐力！你已經準備好迎接超級充實的一天了！",
          options: [
            { text_en: "Open store for school snacks!", text_zh: "打開商店挑選課間點心！", action: 'OPEN_SHOP' }
          ]
        },
        banana_power: {
          id: 'banana_power',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "Bananas are athletes' favorite fruit! They give you instant power for running and jumping.",
          zh: "香蕉是運動員最愛的水果！它能為跑步和跳躍提供最即時的爆發力。",
          options: [
            { text_en: "Thank you, Clerk Bear!", text_zh: "謝謝黑熊店員！", target_id: 'END' }
          ]
        },
        must_eat: {
          id: 'must_eat',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "Oh no! Never skip breakfast. Come grab a fresh sandwich and milk so you don't get tired in class.",
          zh: "哎呀！千萬不能不吃早餐。快來挑個新鮮三明治和牛奶，上課才不會無精打采喔。",
          options: [
            { text_en: "I will get a sandwich now!", text_zh: "我現在就來買個三明治！", action: 'OPEN_SHOP' }
          ]
        }
      }
    },
    {
      variantId: 'supermarket_v2',
      title: '蔬果彩虹與健康生活篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "Welcome! Have you heard of the Rainbow Food rule? Eating foods of different colors keeps you healthy and strong!",
          zh: "歡迎！你聽過『彩虹食物法則』嗎？吃各種不同顏色的食物能讓你健康又強壯！",
          options: [
            { text_en: "What colors of food should I eat?", text_zh: "我應該吃哪些顏色的食物呢？", target_id: 'rainbow_explain' },
            { text_en: "Can I buy fresh fruit here?", text_zh: "我可以在這裡買新鮮水果嗎？", action: 'OPEN_SHOP' }
          ]
        },
        rainbow_explain: {
          id: 'rainbow_explain',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "Red apples, orange carrots, yellow bananas, green veggies, and purple grapes! Try eating a rainbow every week!",
          zh: "紅蘋果、橘胡蘿蔔、黃香蕉、綠蔬菜還有紫葡萄！每週試著把整道彩虹吃進肚子裡吧！",
          options: [
            { text_en: "I love colorful fruits!", text_zh: "我最喜歡繽紛的水果了！", action: 'OPEN_SHOP' }
          ]
        }
      }
    },
    {
      variantId: 'supermarket_v3',
      title: '山林野餐與戶外派對篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "The weather in Wutai is so sunny today! It is the perfect day for a picnic on the grass. Are you preparing for a hike?",
          zh: "今天霧臺的天氣太好啦！正是草地野餐的絕佳日子。你正在準備去山林健行嗎？",
          options: [
            { text_en: "Yes! What picnic food do you recommend?", text_zh: "對呀！你有推薦什麼野餐美食嗎？", target_id: 'picnic_ideas' },
            { text_en: "Let's open the grocery shop!", text_zh: "我們直接打開超市採購吧！", action: 'OPEN_SHOP' }
          ]
        },
        picnic_ideas: {
          id: 'picnic_ideas',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "Pack two sandwiches, two bottles of water, and some cookies to share with friends. Sharing makes food taste twice as good!",
          zh: "帶兩個三明治、兩瓶水，還有一些跟朋友分享的餅乾。學會分享能讓食物變得雙倍美味喔！",
          options: [
            { text_en: "I will buy picnic supplies!", text_zh: "我要採買野餐物資！", action: 'OPEN_SHOP' }
          ]
        }
      }
    },
    {
      variantId: 'supermarket_v4',
      title: '超市結帳與小小收銀員篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "Welcome to the checkout counter! When you buy items, remember to check your receipt and say 'Thank you'!",
          zh: "歡迎來到結帳櫃檯！買東西時，記得核對明細並有禮貌地說聲『Thank you』喔！",
          options: [
            { text_en: "Here are my student coins!", text_zh: "這是我的學生金幣！", target_id: 'payment_done' },
            { text_en: "Let me select my items first.", text_zh: "讓我先挑選要買的商品。", action: 'OPEN_SHOP' }
          ]
        },
        payment_done: {
          id: 'payment_done',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "Thank you very much! Here is your grocery bag. Have a delicious and energetic day in Wutai!",
          zh: "非常謝謝你！這是你的購物袋。祝你在霧臺度過美味又充滿活力的一天！",
          options: [
            { text_en: "Thank you, Clerk Bear! Goodbye!", text_zh: "謝謝黑熊店員！再見！", target_id: 'END' }
          ]
        }
      }
    }
  ],

  // ── 🐿️ 4. 飛鼠公園 長老 Elder Squirrel (5 套自然、天氣與生態主題) ──
  park: [
    {
      variantId: 'park_v0',
      title: '四季天氣與大自然觀察篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Squeak! Welcome to Flying Squirrel Park! Feel the gentle mountain breeze. How is the weather today?",
          zh: "吱吱！歡迎來到飛鼠公園！感受一下溫柔的山風吧。你覺得今天的天氣如何？",
          options: [
            { text_en: "It is sunny and bright!", text_zh: "今天是晴天，陽光燦爛！", target_id: 'sunny_talk' },
            { text_en: "It is cool and windy.", text_zh: "天氣很涼爽，微風吹拂。", target_id: 'windy_talk' },
            { text_en: "What are the four seasons?", text_zh: "一年中的四季有哪些呢？", target_id: 'seasons_talk' }
          ]
        },
        sunny_talk: {
          id: 'sunny_talk',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Sunny days are wonderful! The sunshine helps flowers bloom and gives warm energy to all mountain animals.",
          zh: "晴天太棒了！溫暖的陽光讓百花盛開，給所有山林動物帶來充沛的活力。",
          options: [
            { text_en: "I love sunny days in Wutai!", text_zh: "我喜歡霧臺的晴天！", target_id: 'farewell' }
          ]
        },
        windy_talk: {
          id: 'windy_talk',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "When the wind blows, I can glide high between the tall cedar trees! Squeak! Flying in the wind is my favorite trick.",
          zh: "當山風吹起時，我就能在高聳的杉樹間乘風滑翔！吱吱！在風中滑翔是我最拿手的絕技。",
          options: [
            { text_en: "Flying squirrels are so cool!", text_zh: "飛鼠真的太酷了！", target_id: 'farewell' }
          ]
        },
        seasons_talk: {
          id: 'seasons_talk',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Spring, Summer, Autumn, and Winter! In spring, flowers bloom. In autumn, leaves turn golden. Nature is magical!",
          zh: "春、夏、秋、冬！春天百花齊放，秋天落葉金黃。大自然真的充滿魔法！",
          options: [
            { text_en: "Nature is amazing!", text_zh: "大自然真是太神奇了！", target_id: 'farewell' }
          ]
        },
        farewell: {
          id: 'farewell',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Take a stroll on our green lawn and look for colorful butterflies! Have a peaceful day!",
          zh: "在綠色草地上漫步，找找彩色的蝴蝶吧！祝你有個平靜愉快的一天！",
          options: [
            { text_en: "Goodbye, Elder Squirrel!", text_zh: "再見，飛鼠長老！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'park_v1',
      title: '山林野生動物朋友篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Listen closely! The forest is full of sounds. Do you hear the little birds singing in the treetops?",
          zh: "仔細聽！森林裡充滿了聲音。你有聽見樹梢上小鳥的歌唱聲嗎？",
          options: [
            { text_en: "Yes! What birds live here?", text_zh: "有！這裡住著哪些鳥兒呢？", target_id: 'birds_talk' },
            { text_en: "I saw a beautiful butterfly!", text_zh: "我剛看見一隻美麗的蝴蝶！", target_id: 'butterfly_talk' }
          ]
        },
        birds_talk: {
          id: 'birds_talk',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "We have blue birds, swallows, and eagles! They wake up early to welcome the sunrise with sweet songs.",
          zh: "我們這裡有台灣藍鵲、燕子還有雄鷹！牠們清晨早起，用甜美的歌聲迎接日出。",
          options: [
            { text_en: "I love birds singing!", text_zh: "我喜歡聽鳥兒唱歌！", target_id: 'END' }
          ]
        },
        butterfly_talk: {
          id: 'butterfly_talk',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Butterflies sip sweet nectar from white lilies. Treat them gently, and they will dance around you!",
          zh: "蝴蝶在純白百合花間吸吮甜美花蜜。溫柔地對待牠們，牠們就會圍繞著你翩翩起舞喔！",
          options: [
            { text_en: "I will be gentle with nature!", text_zh: "我會溫柔守護大自然！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'park_v2',
      title: '草地運動與活力慢跑篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Squeak! Look at this wide, soft grass! Running and playing games here makes your body strong and healthy.",
          zh: "吱吱！看這片寬闊柔軟的草地！在這裡跑步玩遊戲能讓身體健康又強壯。",
          options: [
            { text_en: "I love running on the grass!", text_zh: "我最喜歡在草地上奔跑了！", target_id: 'run_praise' },
            { text_en: "Can you teach me how to jump high?", text_zh: "長老可以教我怎麼跳得高嗎？", target_id: 'jump_lesson' }
          ]
        },
        run_praise: {
          id: 'run_praise',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Running in mountain air clears your lungs and puts a big smile on your face! Don't forget to drink water.",
          zh: "在山林清新的空氣中跑步能活絡心肺，讓你臉上洋溢笑容！別忘了隨時喝水喔。",
          options: [
            { text_en: "I have my water bottle ready!", text_zh: "我已經準備好大水壺了！", target_id: 'END' }
          ]
        },
        jump_lesson: {
          id: 'jump_lesson',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Bend your knees, swing your arms, and leap into the air! 1, 2, 3, jump! You fly like a little squirrel!",
          zh: "膝蓋微彎，擺動手臂，然後用力躍向空中！一、二、三，跳！你就像一隻靈動的小飛鼠！",
          options: [
            { text_en: "That was fun! Squeak!", text_zh: "太好玩了！吱吱！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'park_v3',
      title: '雨過天晴與彩虹奇景篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Rain in the mountains washes the green leaves clean. And after the rain, do you know what appears in the sky?",
          zh: "山裡的雨水把綠葉洗刷得乾乾淨淨。雨過天晴後，你知道天空中會出現什麼嗎？",
          options: [
            { text_en: "A beautiful rainbow!", text_zh: "一道美麗的彩虹！", target_id: 'rainbow_story' },
            { text_en: "Fresh mist and cool breeze!", text_zh: "清新的山嵐與涼爽的微風！", target_id: 'mist_story' }
          ]
        },
        rainbow_story: {
          id: 'rainbow_story',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Red, orange, yellow, green, blue, indigo, and violet! Seven colors bridging the two mountain peaks. A symbol of peace!",
          zh: "紅、橙、黃、綠、藍、靛、紫！七種顏色橫跨在兩座山頭之間，象徵著和平與希望！",
          options: [
            { text_en: "Rainbows are so magical!", text_zh: "彩虹真的太有魔力了！", target_id: 'END' }
          ]
        },
        mist_story: {
          id: 'mist_story',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "The white mist floats like fluffy cotton candy among the mountains. Take a deep breath of clean air!",
          zh: "白色的山嵐就像鬆軟的棉花糖漂浮在群山之間。大口深呼吸清新的空氣吧！",
          options: [
            { text_en: "The air in Wutai is the best!", text_zh: "霧臺的空氣是最棒的！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'park_v4',
      title: '靜謐星空與大武山守護篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "When night falls, millions of stars sparkle above Wutai. Do you like looking at the bright stars?",
          zh: "當夜幕降臨，千萬顆星星在霧臺上空閃耀。你喜歡看明亮的星星嗎？",
          options: [
            { text_en: "Yes! Can we see shooting stars?", text_zh: "喜歡！我們能看見流星嗎？", target_id: 'stars_twinkle' },
            { text_en: "What do squirrels do at night?", text_zh: "飛鼠晚上都在做什麼呢？", target_id: 'nocturnal_life' }
          ]
        },
        stars_twinkle: {
          id: 'stars_twinkle',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "On clear nights, shooting stars streak across the sky! Make a wish for your learning and your family.",
          zh: "在晴朗的夜晚，流星會劃破夜空！記得為你的學業和家人許下美好的心願喔。",
          options: [
            { text_en: "I wish to speak great English!", text_zh: "我希望我的英文能說得超棒！", target_id: 'END' }
          ]
        },
        nocturnal_life: {
          id: 'nocturnal_life',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "We are night explorers! We glide under the moonlight and guard the sweet dreams of all children in Wutai.",
          zh: "我們是夜行探險家！我們在月光下優雅滑翔，守護著霧臺所有孩子們的甜美夢鄉。",
          options: [
            { text_en: "Thank you for watching over us!", text_zh: "謝謝長老默默守護著我們！", target_id: 'END' }
          ]
        }
      }
    }
  ],

  // ── 🦅 5. 霧臺客運站 雄鷹站長 Station Master Eagle (5 套交通、車票與旅行主題) ──
  station: [
    {
      variantId: 'station_v0',
      title: '出發旅行與客運車票篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "Salute! Station Master Eagle reporting! Green buses connect Wutai to Pingtung and Kaohsiung. Where do you want to travel?",
          zh: "敬禮！雄鷹站長向你報到！綠色客運連接霧臺到屏東與高雄。你今天想去哪裡旅行？",
          options: [
            { text_en: "I want to take the bus to Pingtung!", text_zh: "我想搭公車去屏東！", target_id: 'bus_ticket' },
            { text_en: "Can I buy a travel ticket?", text_zh: "我可以買車票嗎？", action: 'OPEN_SHOP' },
            { text_en: "What is the famous bridge on the route?", text_zh: "沿途那座著名的橋是什麼呢？", target_id: 'bridge_info' }
          ]
        },
        bus_ticket: {
          id: 'bus_ticket',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "The bus arrives right on schedule! Buy a ticket in our shop, take your seat, and buckle your seatbelt for safety.",
          zh: "公車非常準時抵達！在我們商店買張車票，就座後記得繫上安全帶喔！",
          options: [
            { text_en: "Open shop for bus tickets!", text_zh: "開啟商店購買車票！", action: 'OPEN_SHOP' }
          ]
        },
        bridge_info: {
          id: 'bridge_info',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "That is the Guchuan Bridge! It has the highest bridge pier in Taiwan, rising 99 meters above the valley!",
          zh: "那是著名的谷川大橋！它擁有全台灣最高的橋墩，高達 99 公尺矗立在山谷之間！",
          options: [
            { text_en: "99 meters is amazing!", text_zh: "99 公尺真是太壯觀了！", target_id: 'farewell' }
          ]
        },
        farewell: {
          id: 'farewell',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "Always remember: safety first on every journey! Safe travels!",
          zh: "旅途時刻謹記：安全第一！祝你旅途平安！",
          options: [
            { text_en: "Thank you, Station Master!", text_zh: "謝謝雄鷹站長！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'station_v1',
      title: '自行車漫遊與道路安全篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "Attention, cyclist! Riding a bicycle along Provincial Highway 24 is great exercise, but road safety is top priority!",
          zh: "注意囉，小小騎士！沿著台 24 線騎自行車是絕佳運動，但道路安全永遠是第一要務！",
          options: [
            { text_en: "I always wear my safety helmet!", text_zh: "我騎車一定會戴安全帽！", target_id: 'helmet_praise' },
            { text_en: "What are the rules of the road?", text_zh: "騎車有哪些重要的道路規則？", target_id: 'safety_rules' }
          ]
        },
        helmet_praise: {
          id: 'helmet_praise',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "Outstanding discipline! A safety helmet protects your head like a shield. Keep both hands on the handlebars!",
          zh: "紀律太優秀了！安全帽就像盾牌一樣保護你的頭部。雙手要穩穩握好把手喔！",
          options: [
            { text_en: "Check the shop for cycling items!", text_zh: "到商店看看自行車與旅行配備！", action: 'OPEN_SHOP' }
          ]
        },
        safety_rules: {
          id: 'safety_rules',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "Stop at red lights, ring your bell when turning, and never speed down steep hills. Protect yourself and others!",
          zh: "紅燈停、轉彎鳴鈴提醒，下坡時絕對不超速。保護好自己，也保護他人！",
          options: [
            { text_en: "I will follow all safety rules!", text_zh: "我會遵守所有安全規則！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'station_v2',
      title: '準時出發與時刻表探秘篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "Tick-tock! Time is precious. Being punctual is the mark of a true leader. Do you know how to read the bus timetable?",
          zh: "滴答滴答！時間非常寶貴。守時是真正領袖的標誌。你會看公車時刻表嗎？",
          options: [
            { text_en: "Yes! What time is the next bus?", text_zh: "會！下一班公車是幾點呢？", target_id: 'timetable_read' },
            { text_en: "Can I buy a travel souvenir ticket?", text_zh: "我可以買一張旅行紀念車票嗎？", action: 'OPEN_SHOP' }
          ]
        },
        timetable_read: {
          id: 'timetable_read',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "The morning express departs at 8:00 AM, and the afternoon bus leaves at 2:00 PM. Arrive 5 minutes early!",
          zh: "早班特快車在早上 8:00 出發，下午班次在 2:00 發車。提早 5 分鐘抵達是最好的習慣！",
          options: [
            { text_en: "Being punctual is awesome!", text_zh: "守時的感覺真棒！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'station_v3',
      title: '旅行背包與冒險裝備篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "Before departing on any long journey, a good explorer checks their gear. What is in your travel backpack today?",
          zh: "在展開任何長途旅行之前，優秀的探險家都會檢查裝備。你今天的旅行背包裡裝了些什麼？",
          options: [
            { text_en: "I have water, map, cap, and ticket!", text_zh: "我有水壺、地圖、帽子和車票！", target_id: 'gear_ready' },
            { text_en: "I need to get a bus ticket from the shop.", text_zh: "我需要去商店買一張車票。", action: 'OPEN_SHOP' }
          ]
        },
        gear_ready: {
          id: 'gear_ready',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "100 points! You are fully equipped for any mountain quest. Step aboard with confidence!",
          zh: "一百分！你已經為任何山林任務做好了萬全準備。自信地踏上旅途吧！",
          options: [
            { text_en: "Ready for departure! Thank you!", text_zh: "準備出發！謝謝站長！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'station_v4',
      title: '美麗谷川大橋與山間旅行篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "As the bus crosses the Guchuan Bridge, look out the window! The view of Ailiao River winding below is breathtaking.",
          zh: "當公車穿過谷川大橋時，記得望向窗外！隘寮溪在腳下蜿蜒流淌的景色令人屏息。",
          options: [
            { text_en: "I love the mountain view from the bridge!", text_zh: "我喜歡從橋上看出去的山景！", target_id: 'scenery_share' },
            { text_en: "Can I buy a postcard or ticket souvenir?", text_zh: "我可以買明信片或紀念票當紀念嗎？", action: 'OPEN_SHOP' }
          ]
        },
        scenery_share: {
          id: 'scenery_share',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "High mountains, green ridges, and flowing rivers. Taiwan is so beautiful! Traveling broadens your horizons.",
          zh: "崇山峻嶺、蒼翠山脊、滔滔流水。台灣真的好美！旅行能開闊你的視野與胸襟。",
          options: [
            { text_en: "Thank you for the wonderful journey!", text_zh: "謝謝站長帶給我們美好的旅程！", target_id: 'END' }
          ]
        }
      }
    }
  ],

  // ── 🦉 6. 貓頭鷹診所 醫師 Dr. Owl (5 套健康、生活習慣與衛教主題) ──
  clinic: [
    {
      variantId: 'clinic_v0',
      title: '感冒預防與喉嚨照護篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '貓頭鷹醫師 (Dr. Owl)',
          en: "Hoot-hoot! Welcome to Owl Health Clinic. I am Dr. Owl. How are you feeling today, my dear student?",
          zh: "咕咕！歡迎來到貓頭鷹健康診所。我是貓頭鷹醫師。親愛的同學，你今天感覺身體怎麼樣？",
          options: [
            { text_en: "I have a sore throat.", text_zh: "我的喉嚨有點痛痛的。", target_id: 'throat_check' },
            { text_en: "I am feeling super healthy!", text_zh: "我覺得我非常健康！", target_id: 'healthy_praise' },
            { text_en: "Can I buy throat candies in your clinic?", text_zh: "我可以在診所買薄荷潤喉糖嗎？", action: 'OPEN_SHOP' }
          ]
        },
        throat_check: {
          id: 'throat_check',
          speaker: '貓頭鷹醫師 (Dr. Owl)',
          en: "Open your mouth and say 'Ahhh'! Ah, it is slightly red. Drink plenty of warm water and try our soothing mint lozenges.",
          zh: "張開嘴巴說『啊——』！嗯，喉嚨稍微有點紅腫呢。多喝溫水，吃一顆舒緩薄荷潤喉糖吧。",
          options: [
            { text_en: "Open shop to get mint lozenges!", text_zh: "打開商店領取潤喉糖！", action: 'OPEN_SHOP' },
            { text_en: "Thank you, Dr. Owl!", text_zh: "謝謝貓頭鷹醫師！", target_id: 'farewell' }
          ]
        },
        healthy_praise: {
          id: 'healthy_praise',
          speaker: '貓頭鷹醫師 (Dr. Owl)',
          en: "Wonderful! Healthy eyes, energetic voice, and good posture. Keep washing your hands before meals!",
          zh: "太棒了！眼睛明亮、聲音有精神、坐姿端正。飯前一定要記得常洗手喔！",
          options: [
            { text_en: "I will keep up my healthy habits!", text_zh: "我會保持良好的健康習慣！", target_id: 'farewell' }
          ]
        },
        farewell: {
          id: 'farewell',
          speaker: '貓頭鷹醫師 (Dr. Owl)',
          en: "Remember: good health is your greatest treasure! Take care and stay warm!",
          zh: "記住：健康是你最寶貴的財富！好好照顧自己，注意保暖喔！",
          options: [
            { text_en: "Goodbye, Dr. Owl!", text_zh: "再見，貓頭鷹醫師！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'clinic_v1',
      title: '活力作息與充足睡眠篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '貓頭鷹醫師 (Dr. Owl)',
          en: "Hoot! As an owl, I know all about the power of sleep! How many hours of sleep did you get last night?",
          zh: "咕咕！身為貓頭鷹，我最懂睡眠的神奇力量了！你昨晚睡了幾個小時呢？",
          options: [
            { text_en: "I slept for 8 full hours!", text_zh: "我睡滿了整整 8 個小時！", target_id: 'sleep_champion' },
            { text_en: "I stayed up late playing games.", text_zh: "我昨晚太晚睡，在玩遊戲。", target_id: 'sleep_advice' }
          ]
        },
        sleep_champion: {
          id: 'sleep_champion',
          speaker: '貓頭鷹醫師 (Dr. Owl)',
          en: "Gold star! 8 to 9 hours of sleep helps children grow taller and helps your brain remember English words faster!",
          zh: "金牌模範生！睡滿 8 到 9 個小時能幫助孩子長高，還能幫大腦快速記住英文單字！",
          options: [
            { text_en: "Sleep is so magical! Thank you!", text_zh: "睡覺真的太神奇了！謝謝醫師！", target_id: 'END' }
          ]
        },
        sleep_advice: {
          id: 'sleep_advice',
          speaker: '貓頭鷹醫師 (Dr. Owl)',
          en: "Going to bed early gives you superpowers. Put your screen away by 9:00 PM, and wake up refreshed like the morning sun!",
          zh: "早睡早起能賦予你超能力。晚上 9 點前放下螢幕，早晨就能像朝陽一樣容光煥發！",
          options: [
            { text_en: "I will sleep early tonight!", text_zh: "我今晚一定早點睡！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'clinic_v2',
      title: '運動擦傷與急救箱篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '貓頭鷹醫師 (Dr. Owl)',
          en: "Hoot! Active kids sometimes scrape their knees while playing tag on the playground. Did you get any scratches today?",
          zh: "咕咕！活潑好動的孩子在操場玩抓人遊戲時偶爾會擦傷膝蓋。你今天身上有任何擦傷嗎？",
          options: [
            { text_en: "I scraped my knee a little.", text_zh: "我的膝蓋稍微擦破皮了。", target_id: 'first_aid_care' },
            { text_en: "No scrapes, I was very careful!", text_zh: "沒有擦傷，我跑步非常注意安全！", target_id: 'safety_praise' }
          ]
        },
        first_aid_care: {
          id: 'first_aid_care',
          speaker: '貓頭鷹醫師 (Dr. Owl)',
          en: "Let's clean it with water, apply antiseptic, and put on a brave bandaid. You will be running fast again soon!",
          zh: "我們先用清水沖洗乾淨、塗上消毒藥水，再貼上一塊勇氣 ok 繃。很快就能再次健步如飛囉！",
          options: [
            { text_en: "Thank you for the bandaid!", text_zh: "謝謝醫師幫我貼 ok 繃！", action: 'OPEN_SHOP' }
          ]
        },
        safety_praise: {
          id: 'safety_praise',
          speaker: '貓頭鷹醫師 (Dr. Owl)',
          en: "Well done! Being mindful of your surroundings keeps sports fun and safe for everyone.",
          zh: "做得好！時刻注意周圍環境，運動才能玩得開心又安全。",
          options: [
            { text_en: "Safety first!", text_zh: "安全第一！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'clinic_v3',
      title: '潔白牙齒與微笑力量篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '貓頭鷹醫師 (Dr. Owl)',
          en: "Show me your bright smile! Clean white teeth give you the confidence to speak English clearly. Do you brush twice a day?",
          zh: "讓我看看你燦爛的微笑！潔白健康的牙齒能讓你自信大聲說英語。你每天都有刷兩次牙嗎？",
          options: [
            { text_en: "Yes! Every morning and before bed!", text_zh: "有！每天早晨和睡前都有刷牙！", target_id: 'brush_praise' },
            { text_en: "I love sweet candy. Is candy bad for teeth?", text_zh: "我好喜歡吃糖果。糖果對牙齒不好嗎？", target_id: 'candy_advice' }
          ]
        },
        brush_praise: {
          id: 'brush_praise',
          speaker: '貓頭鷹醫師 (Dr. Owl)',
          en: "Sparkling clean! Brushing for two minutes keeps tooth monsters far away. Your smile is radiant!",
          zh: "晶瑩潔白！每次認真刷滿兩分鐘，蛀牙小怪獸就不敢靠近。你的笑容真是太迷人了！",
          options: [
            { text_en: "I love having clean teeth!", text_zh: "我喜歡牙齒乾乾淨淨的感覺！", target_id: 'END' }
          ]
        },
        candy_advice: {
          id: 'candy_advice',
          speaker: '貓頭鷹醫師 (Dr. Owl)',
          en: "Candy is yummy, but sugar feeds cavity germs! Remember to rinse with water after sweets, or choose fresh fruits instead.",
          zh: "糖果很甜，但糖分會餵飽蛀牙菌！吃完甜食記得一定要漱口，或者多吃新鮮水果替代糖果喔。",
          options: [
            { text_en: "I will rinse my mouth after sweets!", text_zh: "我吃完甜食一定漱口！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'clinic_v4',
      title: '深呼吸放鬆與心靈陽光篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '貓頭鷹醫師 (Dr. Owl)',
          en: "Sometimes school tests or busy days make us feel nervous. How is your heart feeling right now?",
          zh: "有時候學校考試或忙碌的日子會讓我們感到緊張。你現在的心情感覺如何？",
          options: [
            { text_en: "I feel a little nervous about tests.", text_zh: "我對考試有點緊張。", target_id: 'breathe_lesson' },
            { text_en: "I feel calm and happy!", text_zh: "我覺得心情很平靜快樂！", target_id: 'peace_praise' }
          ]
        },
        breathe_lesson: {
          id: 'breathe_lesson',
          speaker: '貓頭鷹醫師 (Dr. Owl)',
          en: "Let's do Dr. Owl's magic breath: Breathe in through your nose for 4 seconds, hold, and breathe out slowly. Feel the peace?",
          zh: "來試試貓頭鷹醫師的深呼吸魔法：用鼻子吸氣 4 秒鐘，屏住氣，然後慢慢呼氣。感覺平靜放鬆了嗎？",
          options: [
            { text_en: "Ah, I feel so much calmer now!", text_zh: "哇，我感覺輕鬆多了！", target_id: 'END' }
          ]
        },
        peace_praise: {
          id: 'peace_praise',
          speaker: '貓頭鷹醫師 (Dr. Owl)',
          en: "A cheerful heart is the best medicine in the world! Keep shining your inner light wherever you go.",
          zh: "喜樂的心是世界上最好的良藥！無論走到哪裡，都繼續散發你內心的陽光吧。",
          options: [
            { text_en: "Thank you for the warm words, Dr. Owl!", text_zh: "謝謝貓頭鷹醫師溫暖的話！", target_id: 'END' }
          ]
        }
      }
    }
  ],

  // ── 🌺 7. 百步蛇集會所 百合設計師 Stylist Lily (5 套部落文化、服飾與傳統藝術主題) ──
  plaza: [
    {
      variantId: 'plaza_v0',
      title: '部落工藝與七彩琉璃珠篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '百合設計師 (Stylist Lily)',
          en: "Sabau! Welcome to Hundred-Pace Gathering Hall. Look at these hand-crafted glass beads! Each bead tells a mountain story.",
          zh: "Sabau（平安問候）！歡迎來到百步蛇集會所。看看這些純手工琉璃珠！每一顆珠子都訴說著一段大武山的故事。",
          options: [
            { text_en: "What do the glass bead colors mean?", text_zh: "琉璃珠的顏色代表什麼意義呢？", target_id: 'bead_meaning' },
            { text_en: "Can I buy a traditional necklace in the shop?", text_zh: "我可以在商店買一條傳統項鍊嗎？", action: 'OPEN_SHOP' },
            { text_en: "They are so beautiful!", text_zh: "它們真的太美麗了！", target_id: 'craft_praise' }
          ]
        },
        bead_meaning: {
          id: 'bead_meaning',
          speaker: '百合設計師 (Stylist Lily)',
          en: "Green beads symbolize brave warriors, yellow beads represent nobility, and rainbow beads stand for friendship!",
          zh: "綠色琉璃珠象徵英勇勇士，黃色珠子代表高貴榮耀，七彩琉璃珠則象徵珍貴的友誼！",
          options: [
            { text_en: "Open shop for cultural treasures!", text_zh: "開啟商店收藏文化寶物！", action: 'OPEN_SHOP' },
            { text_en: "I want the bead of friendship!", text_zh: "我想要友誼琉璃珠！", target_id: 'farewell' }
          ]
        },
        craft_praise: {
          id: 'craft_praise',
          speaker: '百合設計師 (Stylist Lily)',
          en: "Thank you! Our Rukai artisans weave ancient wisdom into every thread and stone. Tradition lives forever!",
          zh: "謝謝你！我們魯凱族的工藝師把古老智慧編織進每根線與石板中。傳統將永遠延續！",
          options: [
            { text_en: "Tradition is so precious!", text_zh: "傳統文化真是太珍貴了！", target_id: 'farewell' }
          ]
        },
        farewell: {
          id: 'farewell',
          speaker: '百合設計師 (Stylist Lily)',
          en: "Wear your traditions with pride! May the mountain spirits bless your steps!",
          zh: "自豪地佩戴傳統吧！願山林祖靈祝福你的每一步步伐！",
          options: [
            { text_en: "Sabau! Goodbye, Stylist Lily!", text_zh: "Sabau！再見，百合設計師！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'plaza_v1',
      title: '純潔百合勇士榮譽精神篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '百合設計師 (Stylist Lily)',
          en: "Do you see the white lily in my hair? In our culture, the white lily flower is the highest badge of purity and courage.",
          zh: "看見我髮間別著的純白百合花了嗎？在我們的文化中，白百合是代表純潔與勇氣的最高榮譽象徵。",
          options: [
            { text_en: "How does one earn the white lily?", text_zh: "要如何才能獲得白百合花的肯定呢？", target_id: 'lily_honor' },
            { text_en: "Do you have hunter vests in the shop?", text_zh: "你們商店有帥氣的勇士背心嗎？", action: 'OPEN_SHOP' }
          ]
        },
        lily_honor: {
          id: 'lily_honor',
          speaker: '百合設計師 (Stylist Lily)',
          en: "By protecting your community, showing deep kindness to elders, and speaking truth with bravery!",
          zh: "透過守護部落、孝順敬重長輩，以及帶著無畏的勇氣說出真理！",
          options: [
            { text_en: "I will strive to be a brave hero!", text_zh: "我會努力成為勇敢的英雄！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'plaza_v2',
      title: '陶壺百步蛇圖騰傳奇篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '百合設計師 (Stylist Lily)',
          en: "Welcome! Notice the geometric patterns carved on these stone slates? The hundred-pace snake is our sacred mountain guardian.",
          zh: "歡迎！有注意到石板上雕刻的幾何圖騰嗎？百步蛇是我們神聖的山林守護者。",
          options: [
            { text_en: "Why is the snake sacred?", text_zh: "為什麼百步蛇是神聖的守護者呢？", target_id: 'guardian_story' },
            { text_en: "Show me the traditional crafts!", text_zh: "請讓我看看傳統工藝品！", action: 'OPEN_SHOP' }
          ]
        },
        guardian_story: {
          id: 'guardian_story',
          speaker: '百合設計師 (Stylist Lily)',
          en: "It represents quiet strength, patience, and loyalty to our homeland. We live in harmony with all mountain creatures.",
          zh: "牠代表著沉穩的力量、耐心，以及對土地的忠誠。我們與山林中的所有生靈和諧共存。",
          options: [
            { text_en: "Harmony with nature is beautiful!", text_zh: "與大自然和諧共存真美好！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'plaza_v3',
      title: '豐年祭歌舞與歡慶盛裝篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '百合設計師 (Stylist Lily)',
          en: "When festival season arrives, drums beat and silver bells ring on our costumes! Dancing in a circle holding hands brings everyone together.",
          zh: "當小米豐年祭到來，鼓聲齊鳴，盛裝上的銀鈴叮噹作響！大家手牽著手圍成圓圈跳舞，心緊緊連在一起。",
          options: [
            { text_en: "I want to join the festival dance!", text_zh: "我想加入祭典跳舞！", target_id: 'dance_joy' },
            { text_en: "Can I wear traditional garments?", text_zh: "我可以穿著傳統服飾嗎？", action: 'OPEN_SHOP' }
          ]
        },
        dance_joy: {
          id: 'dance_joy',
          speaker: '百合設計師 (Stylist Lily)',
          en: "Step left, step right, and sing aloud! The rhythm of the mountains beats inside everyone's heart.",
          zh: "左踏一步、右踏一步，放聲歌唱！大山的節奏在每個人的心中跳動。",
          options: [
            { text_en: "Music brings us all together!", text_zh: "音樂讓我們緊緊相連！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'plaza_v4',
      title: '手編花環與植物美學篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '百合設計師 (Stylist Lily)',
          en: "Look at this handmade flower crown woven from fresh ferns and blooming orchids! We give flower crowns to welcome special guests.",
          zh: "看看這個用新鮮蕨類與盛開蘭花編織的手工花環！我們用花環熱情歡迎遠道而來的尊貴客人。",
          options: [
            { text_en: "It looks so fragrant and fresh!", text_zh: "聞起來好清香又新鮮！", target_id: 'crown_gift' },
            { text_en: "Check out the cultural gifts!", text_zh: "挑選文化紀念禮物！", action: 'OPEN_SHOP' }
          ]
        },
        crown_gift: {
          id: 'crown_gift',
          speaker: '百合設計師 (Stylist Lily)',
          en: "Here, wear this flower crown today! Walk with honor, and let your smile brighten every street in Wutai.",
          zh: "來，今天為你戴上這個花環！帶著榮譽漫步，讓你的笑容點亮霧臺的每一條街道。",
          options: [
            { text_en: "Thank you, Stylist Lily! Sabau!", text_zh: "謝謝百合設計師！Sabau！", target_id: 'END' }
          ]
        }
      }
    }
  ],

  // ── 🐗 8. 山豬影城 售票員 Clerk Boar (5 套電影、觀影禮儀與娛樂主題) ──
  cinema: [
    {
      variantId: 'cinema_v0',
      title: '強檔 3D 動畫冒險電影篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '野豬售票員 (Clerk Boar)',
          en: "Oink-oink! Welcome to Boar Cinema! Grab a giant tub of butter popcorn! What movie are you watching today?",
          zh: "呼嚕嚕！歡迎來到山豬影城！來一大桶香噴噴的奶油爆米花吧！今天想看哪部電影？",
          options: [
            { text_en: "I want to watch 'Cloud Leopard 3D'!", text_zh: "我想看《雲豹大冒險 3D》！", target_id: 'movie_leopard' },
            { text_en: "Let me buy tickets and popcorn!", text_zh: "我要買電影票和爆米花！", action: 'OPEN_SHOP' },
            { text_en: "What movies are playing today?", text_zh: "今天有上映哪些精彩電影？", target_id: 'movie_list' }
          ]
        },
        movie_leopard: {
          id: 'movie_leopard',
          speaker: '野豬售票員 (Clerk Boar)',
          en: "Epic choice! The 3D effects will make cloud leopards feel like they are leaping right over your head!",
          zh: "超棒的選擇！3D 特效逼真到像雲豹正從你頭頂上一躍而過一樣！",
          options: [
            { text_en: "Get my 3D ticket now!", text_zh: "現在就買 3D 電影票！", action: 'OPEN_SHOP' }
          ]
        },
        movie_list: {
          id: 'movie_list',
          speaker: '野豬售票員 (Clerk Boar)',
          en: "We have 'The Legend of Cloud Leopard 3D' and 'Flying Squirrel Speedster'! Both films are packed with action and laughter!",
          zh: "我們現正熱映《雲豹大冒險 3D》和《飛鼠快俠與星空探險》！兩部都充滿刺激冒險和歡樂笑聲！",
          options: [
            { text_en: "Open shop to get tickets!", text_zh: "打開商店買票！", action: 'OPEN_SHOP' }
          ]
        }
      }
    },
    {
      variantId: 'cinema_v1',
      title: '影廳觀影禮儀與安靜欣賞篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '野豬售票員 (Clerk Boar)',
          en: "Attention, movie fans! A great movie watcher always follows cinema etiquette. Do you know the golden rules?",
          zh: "電影迷們請注意！優秀的觀眾一定會遵守觀影禮儀。你知道看電影的黃金法則嗎？",
          options: [
            { text_en: "Turn off phones and stay quiet!", text_zh: "手機關靜音、保持安靜！", target_id: 'etiquette_praise' },
            { text_en: "Can I kick the front seat?", text_zh: "可以踢前方的椅子嗎？", target_id: 'no_kicking' }
          ]
        },
        etiquette_praise: {
          id: 'etiquette_praise',
          speaker: '野豬售票員 (Clerk Boar)',
          en: "Perfect! Keeping quiet lets everyone immerse in the magic of cinema. And take your popcorn box when leaving!",
          zh: "太完美了！保持安靜能讓所有人沉浸在電影的魔力中。散場時也記得隨手把爆米花盒帶走喔！",
          options: [
            { text_en: "Open cinema shop!", text_zh: "開啟影城商店買零食！", action: 'OPEN_SHOP' }
          ]
        },
        no_kicking: {
          id: 'no_kicking',
          speaker: '野豬售票員 (Clerk Boar)',
          en: "Never kick seats! Be thoughtful and polite so everyone enjoys a comfortable, happy movie experience.",
          zh: "絕對不能踢前座喔！貼心有禮貌，大家才能享受舒適開心的觀影體驗。",
          options: [
            { text_en: "I will be a polite audience!", text_zh: "我會當個有禮貌的觀眾！", target_id: 'END' }
          ]
        }
      }
    },
    {
      variantId: 'cinema_v2',
      title: '電影爆米花特選與雙人套餐篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '野豬售票員 (Clerk Boar)',
          en: "Smell that sweet aroma? Sweet caramel popcorn or savory cheese popcorn? Which one is your all-time favorite?",
          zh: "聞到這撲鼻香氣了嗎？香甜焦糖爆米花還是濃郁起司爆米花？哪一個是你的最愛？",
          options: [
            { text_en: "I love sweet caramel popcorn!", text_zh: "我最喜歡香甜焦糖爆米花！", target_id: 'popcorn_caramel' },
            { text_en: "Give me the combo set with drinks!", text_zh: "我要有爆米花加飲料的豪華套餐！", action: 'OPEN_SHOP' }
          ]
        },
        popcorn_caramel: {
          id: 'popcorn_caramel',
          speaker: '野豬售票員 (Clerk Boar)',
          en: "Warm, crunchy, and coated in golden caramel! Crunching popcorn while watching movies is pure happiness.",
          zh: "熱騰騰、香脆無比，裹上金黃焦糖！邊看電影邊嚼爆米花就是純粹的幸福。",
          options: [
            { text_en: "Open shop to buy popcorn!", text_zh: "開啟商店購買爆米花！", action: 'OPEN_SHOP' }
          ]
        }
      }
    },
    {
      variantId: 'cinema_v3',
      title: '奇幻動作片《百步蛇守護者》篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '野豬售票員 (Clerk Boar)',
          en: "Tonight is the grand premiere of 'The Hundred-Pace Guardian'! It tells the story of an ancient mountain hero.",
          zh: "今晚是奇幻動作鉅片《百步蛇傳奇守護者》的首映會！講述的是古老山林英雄的故事。",
          options: [
            { text_en: "Tell me about the hero!", text_zh: "告訴我關於英雄的故事！", target_id: 'hero_preview' },
            { text_en: "I want a ticket for the premiere!", text_zh: "我要買首映會的電影票！", action: 'OPEN_SHOP' }
          ]
        },
        hero_preview: {
          id: 'hero_preview',
          speaker: '野豬售票員 (Clerk Boar)',
          en: "The hero defends the mountain with a shield of courage and a heart of compassion! You will be on the edge of your seat!",
          zh: "英雄用勇氣之盾和仁慈之心守護這座大山！精彩刺激的劇情會讓你全程屏息以待！",
          options: [
            { text_en: "Get tickets now!", text_zh: "現在就買票！", action: 'OPEN_SHOP' }
          ]
        }
      }
    },
    {
      variantId: 'cinema_v4',
      title: '週末家庭歡樂與電影回顧篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '野豬售票員 (Clerk Boar)',
          en: "Movies make us laugh, cry, and dream big dreams! Who do you love watching movies with?",
          zh: "電影讓我們歡笑、感動，並懷抱遠大的夢想！你最喜歡跟誰一起看電影呢？",
          options: [
            { text_en: "I love watching with my family!", text_zh: "我最喜歡和家人一起看電影！", target_id: 'family_movie' },
            { text_en: "I love watching with school friends!", text_zh: "我喜歡和學校同學一起看電影！", target_id: 'friends_movie' }
          ]
        },
        family_movie: {
          id: 'family_movie',
          speaker: '野豬售票員 (Clerk Boar)',
          en: "Family time is the sweetest! Sharing laughter in the dark theater creates memories that last forever.",
          zh: "家庭時光是最溫暖的！在電影院裡共享歡笑，會成為一輩子難忘的回憶。",
          options: [
            { text_en: "Thank you, Clerk Boar! Have a great day!", text_zh: "謝謝山豬售票員！祝你有個美好的一天！", target_id: 'END' }
          ]
        },
        friends_movie: {
          id: 'friends_movie',
          speaker: '野豬售票員 (Clerk Boar)',
          en: "Going to the cinema with best friends is the ultimate weekend adventure! Enjoy the show!",
          zh: "和好朋友一起去電影院是週末最棒的冒險！好好享受電影吧！",
          options: [
            { text_en: "Thank you! Goodbye!", text_zh: "謝謝！再見！", target_id: 'END' }
          ]
        }
      }
    }
  ]
};

// ── 🌟 9 & 10. 客座巡迴外師專屬 5 套每日輪替對話樹 (Mario & Ibu) ──
export const VISITING_TEACHER_VARIANTS = {
  mario: [
    {
      variantId: 'mario_v0',
      title: '熱情活力相遇與大武山微風篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '外師 Mario (Teacher Mario)',
          en: "What's up, superstar! I am Teacher Mario! What a great surprise to meet you here in Wutai! How is your day going?",
          zh: "嗨，大明星！我是 Mario 老師！真驚喜能在霧臺這裡遇見你！你今天過得如何？",
          options: [
            { text_en: "It is awesome to meet you, Teacher Mario!", text_zh: "太酷了，很高興遇到 Mario 老師！", target_id: 'mario_cheer' },
            { text_en: "What are you doing here today?", text_zh: "老師今天怎麼會在這裡呢？", target_id: 'mario_mission' },
            { text_en: "I love learning English with you!", text_zh: "我最喜歡和老師一起學英語了！", target_id: 'mario_practice' }
          ]
        },
        mario_cheer: {
          id: 'mario_cheer',
          speaker: '外師 Mario (Teacher Mario)',
          en: "You have fantastic energy! Keep speaking English loud and proud. Give me a high five!",
          zh: "你的朝氣真是太棒了！繼續大聲又自信地說英語。來和我擊個掌吧！",
          options: [
            { text_en: "High five! Let's practice English!", text_zh: "擊掌！我們一起練習英文！", target_id: 'mario_reward' }
          ]
        },
        mario_mission: {
          id: 'mario_mission',
          speaker: '外師 Mario (Teacher Mario)',
          en: "I am exploring our wonderful Wutai town! I love the fresh mountain breeze, delicious pizza, and friendly smiles everywhere.",
          zh: "我正在探索我們美麗的霧臺小鎮！我好喜歡這裡清新的山風、美味的披薩，還有大家親切的笑容。",
          options: [
            { text_en: "Wutai is the best place ever!", text_zh: "霧臺是最棒的地方！", target_id: 'mario_reward' }
          ]
        },
        mario_practice: {
          id: 'mario_practice',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Remember my golden rule: Don't be afraid of making mistakes. Every new English word is your superpower!",
          zh: "記住我的黃金法則：不要害怕犯錯。每一個學會的新英語單字都是你的超能力！",
          options: [
            { text_en: "Yes! Every word is a superpower!", text_zh: "沒錯！每個單字都是超能力！", target_id: 'mario_reward' }
          ]
        },
        mario_reward: {
          id: 'mario_reward',
          speaker: '外師 Mario (Teacher Mario)',
          en: "You did an incredible job speaking English with me today! Here is your daily mystery bonus points! Have an amazing day!",
          zh: "你今天和我練習英語表現得太棒了！這是送給你的每日驚喜探索積分！祝你有個精彩的一天！",
          options: [
            { text_en: "Thank you so much, Teacher Mario! See you!", text_zh: "非常謝謝 Mario 老師！再見！", action: 'CLAIM_TEACHER_BONUS' }
          ]
        }
      }
    },
    {
      variantId: 'mario_v1',
      title: '最喜歡的運動與校園生活篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Hey buddy! Look at the playground! I love playing sports in the afternoon. What is your favorite sport?",
          zh: "嘿，小夥伴！看那邊的操場！我最喜歡在下午做運動了。你最喜歡什麼運動？",
          options: [
            { text_en: "I love playing basketball and running!", text_zh: "我最喜歡打籃球和跑步！", target_id: 'sports_hoops' },
            { text_en: "I love soccer! Kick the ball!", text_zh: "我喜歡踢足球！射門！", target_id: 'sports_soccer' },
            { text_en: "I like riding bicycles!", text_zh: "我喜歡騎腳踏車！", target_id: 'sports_bike' }
          ]
        },
        sports_hoops: {
          id: 'sports_hoops',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Swish! Three points! Basketball builds teamwork and speed. Keep moving and stay healthy!",
          zh: "刷！三分球進！籃球能培養團隊默契和速度。多動多健康！",
          options: [
            { text_en: "Teamwork makes the dream work!", text_zh: "團隊合作實現夢想！", target_id: 'mario_reward' }
          ]
        },
        sports_soccer: {
          id: 'sports_soccer',
          speaker: '外師 Mario (Teacher Mario)',
          en: "GOAAAL! Soccer requires great stamina! You must be super fast on the field!",
          zh: "球進了！足球需要極佳的耐力！你在球場上一定跑得飛快！",
          options: [
            { text_en: "Yeah! Let's score goals together!", text_zh: "耶！我們一起踢進更多球！", target_id: 'mario_reward' }
          ]
        },
        sports_bike: {
          id: 'sports_bike',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Cycling along the mountain highway with the breeze in your hair feels fantastic. Remember to wear a helmet!",
          zh: "沿著山路騎車、微風輕拂過頭髮的感覺太棒了。記得要戴好安全帽喔！",
          options: [
            { text_en: "Safety first! High five!", text_zh: "安全第一！擊掌！", target_id: 'mario_reward' }
          ]
        },
        mario_reward: {
          id: 'mario_reward',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Boom! You spoke with great confidence today! Here is your teacher bonus reward! Keep rocking!",
          zh: "太讚了！你今天說得充滿自信！這是外師特別獎勵積分！繼續加油！",
          options: [
            { text_en: "Awesome! Thank you, Teacher Mario!", text_zh: "太棒了！謝謝 Mario 老師！", action: 'CLAIM_TEACHER_BONUS' }
          ]
        }
      }
    },
    {
      variantId: 'mario_v2',
      title: '大聲自信說英語黃金法則篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Ready for Mario's English Power Challenge? What is the number one secret to learning English fast?",
          zh: "準備好接受 Mario 老師的英語能量挑戰了嗎？學好英語的第一大秘訣是什麼？",
          options: [
            { text_en: "Speak loud, speak proud, and don't be shy!", text_zh: "大聲說、自信說、不要害羞！", target_id: 'loud_proud' },
            { text_en: "Is it okay if I make a mistake?", text_zh: "如果我講錯了真的沒關係嗎？", target_id: 'mistake_rule' }
          ]
        },
        loud_proud: {
          id: 'loud_proud',
          speaker: '外師 Mario (Teacher Mario)',
          en: "YES! Exactly! Speak with your heart! Every time you open your mouth to practice, your brain grows stronger!",
          zh: "沒錯！正是如此！用心開口說！每次你開口練習，你的大腦就變得更強大！",
          options: [
            { text_en: "I am not shy anymore! High five!", text_zh: "我不再害羞了！擊掌！", target_id: 'mario_reward' }
          ]
        },
        mistake_rule: {
          id: 'mistake_rule',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Mistakes are your best friends in language learning! When you stumble, you learn, and next time you do it even better!",
          zh: "犯錯是語言學習中最要好的朋友！跌倒了就學到了，下一次你會表現得更好！",
          options: [
            { text_en: "I will keep trying my best!", text_zh: "我會繼續全力以赴！", target_id: 'mario_reward' }
          ]
        },
        mario_reward: {
          id: 'mario_reward',
          speaker: '外師 Mario (Teacher Mario)',
          en: "You have true courage, superstar! Claim your daily mystery bonus points now!",
          zh: "大明星，你擁有真正的勇氣！快領取你今日的驚喜獎勵積分吧！",
          options: [
            { text_en: "Thank you, Teacher Mario! See you!", text_zh: "謝謝 Mario 老師！再見！", action: 'CLAIM_TEACHER_BONUS' }
          ]
        }
      }
    },
    {
      variantId: 'mario_v3',
      title: '美食與點心大冒險篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Mmmm! I smell something delicious from the town market! What is your absolute favorite food to eat?",
          zh: "嗯～！我聞到小鎮市集傳來美味的香氣！你最最最喜歡吃的食物是什麼？",
          options: [
            { text_en: "I love cheese pizza and warm bread!", text_zh: "我喜歡起司披薩和熱麵包！", target_id: 'pizza_love' },
            { text_en: "I love mountain roast meat and sweet potatoes!", text_zh: "我喜歡石板烤肉和香甜地瓜！", target_id: 'local_food' },
            { text_en: "I love fresh red apples and bananas!", text_zh: "我喜歡新鮮的紅蘋果和香蕉！", target_id: 'fruit_love' }
          ]
        },
        pizza_love: {
          id: 'pizza_love',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Pizza is life! Gooey melted cheese and crispy crust. Now that makes me hungry!",
          zh: "披薩就是生命！牽絲的濃起司和香脆餅皮，光想像就讓我流口水啦！",
          options: [
            { text_en: "Let's share a slice! High five!", text_zh: "我們一人分一塊！擊掌！", target_id: 'mario_reward' }
          ]
        },
        local_food: {
          id: 'local_food',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Wutai traditional roast meat is world-famous! Smoked with wood fire, it is incredibly tasty!",
          zh: "霧臺的石板烤肉舉世聞名！柴火煙燻烘烤，味道簡直絕妙無比！",
          options: [
            { text_en: "Wutai food is number one!", text_zh: "霧臺美食天下第一！", target_id: 'mario_reward' }
          ]
        },
        fruit_love: {
          id: 'fruit_love',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Healthy and crisp! Natural vitamins keep your mind sharp and your body quick!",
          zh: "健康又清脆！天然維生素能讓大腦思緒清晰、反應靈敏！",
          options: [
            { text_en: "Eating healthy is awesome!", text_zh: "健康飲食太讚了！", target_id: 'mario_reward' }
          ]
        },
        mario_reward: {
          id: 'mario_reward',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Talking about yummy food with you was so much fun! Here are your daily explorer bonus points!",
          zh: "和你用英文聊美食太有趣了！這是送給你的每日探索獎勵積分！",
          options: [
            { text_en: "Thank you, Teacher Mario!", text_zh: "謝謝 Mario 老師！", action: 'CLAIM_TEACHER_BONUS' }
          ]
        }
      }
    },
    {
      variantId: 'mario_v4',
      title: '每日神奇挑戰與英語超能力篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Attention, secret agent of English! Here is your special secret mission for today: Can you use three new words before sunset?",
          zh: "英語特務請注意！這是為你指派的今日特別秘密任務：你能在太陽下山前用出三個新單字嗎？",
          options: [
            { text_en: "Challenge accepted! I can do it!", text_zh: "接受挑戰！我一定能做到！", target_id: 'mission_accept' },
            { text_en: "What three words should I try?", text_zh: "我有什麼單字可以嘗試呢？", target_id: 'word_ideas' }
          ]
        },
        mission_accept: {
          id: 'mission_accept',
          speaker: '外師 Mario (Teacher Mario)',
          en: "That's my champion! Practice them with your teacher, your friends, and at home. You are unstoppable!",
          zh: "真不愧是我的小冠軍！跟老師練習、跟朋友練習、在家也練習。你無可限量！",
          options: [
            { text_en: "I am ready! Give me my bonus!", text_zh: "我準備好了！領取獎勵！", target_id: 'mario_reward' }
          ]
        },
        word_ideas: {
          id: 'word_ideas',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Try 'Magnificent', 'Adventure', and 'Kindness'! Three powerful words that make people happy!",
          zh: "試試看『Magnificent（壯麗）』、『Adventure（冒險）』還有『Kindness（善良）』！這三個充滿力量的單字能帶給人快樂！",
          options: [
            { text_en: "Those are great words! High five!", text_zh: "這些字太棒了！擊掌！", target_id: 'mario_reward' }
          ]
        },
        mario_reward: {
          id: 'mario_reward',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Mission completed with flying colors! Here is your daily bonus points! Keep shining like a superstar!",
          zh: "任務圓滿達成！這是給你的每日獎勵積分！繼續像超級巨星一樣閃耀吧！",
          options: [
            { text_en: "Thank you, Teacher Mario! Bye!", text_zh: "謝謝 Mario 老師！拜拜！", action: 'CLAIM_TEACHER_BONUS' }
          ]
        }
      }
    }
  ],

  ibu: [
    {
      variantId: 'ibu_v0',
      title: '陽光初遇與魯凱族問候 Sabau 篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Hello, my wonderful learner! Sabau! I am Teacher Ibu! It is lovely to see you walking in the bright sunshine today.",
          zh: "你好，可愛的學生！Sabau！我是 Ibu 老師！真高興在明媚的陽光下遇見你。",
          options: [
            { text_en: "Sabau, Teacher Ibu! Nice to meet you!", text_zh: "Sabau，Ibu 老師！很高興見到妳！", target_id: 'ibu_greet' },
            { text_en: "Where are you from, Teacher Ibu?", text_zh: "Ibu 老師來自哪裡呢？", target_id: 'ibu_origin' },
            { text_en: "Can you help me practice English?", text_zh: "老師可以陪我練習英語嗎？", target_id: 'ibu_warm' }
          ]
        },
        ibu_greet: {
          id: 'ibu_greet',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Your pronunciation of 'Sabau' is so beautiful! Connecting our local culture with English is our superpower.",
          zh: "你說『Sabau』的發音真標準、真好聽！把我們的在地文化與英語結合，正是我們的超能力。",
          options: [
            { text_en: "I love our Wutai mountain home!", text_zh: "我好喜歡我們大武山的家鄉！", target_id: 'ibu_reward' }
          ]
        },
        ibu_origin: {
          id: 'ibu_origin',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "I came from sunny California! The Pacific Ocean connects California and Taiwan, and now we are family here in Wutai!",
          zh: "我來自陽光明媚的加州！太平洋把加州和台灣連在一起，而現在我們在霧臺成了一家人！",
          options: [
            { text_en: "Welcome to Wutai, Teacher Ibu!", text_zh: "歡迎來到霧臺，Ibu 老師！", target_id: 'ibu_reward' }
          ]
        },
        ibu_warm: {
          id: 'ibu_warm',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Of course, sweetheart! Speak gently, listen with your heart, and smile. Learning a language is like making a lifelong friend.",
          zh: "當然可以，親愛的！溫柔地說、用耳朵用心傾聽、帶著微笑。學習語言就像結交一輩子的摯友。",
          options: [
            { text_en: "Thank you for being so kind!", text_zh: "謝謝老師這麼親切！", target_id: 'ibu_reward' }
          ]
        },
        ibu_reward: {
          id: 'ibu_reward',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Thank you for chatting with me today! Here are your special bonus points! Keep shining, my dear student!",
          zh: "謝謝你今天和我練習英語！這是給你的特別獎勵積分。繼續閃閃發亮吧，親愛的孩子！",
          options: [
            { text_en: "Thank you, Teacher Ibu! Goodbye!", text_zh: "謝謝 Ibu 老師！再見！", action: 'CLAIM_TEACHER_BONUS' }
          ]
        }
      }
    },
    {
      variantId: 'ibu_v1',
      title: '大自然的美麗色彩篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Look at the colorful flowers around us! Nature has painted Wutai with the sweetest palette. What colors do you see?",
          zh: "看看我們身邊繽紛的花朵！大自然用最甜美的調色盤彩繪了霧臺。你看見了哪些顏色？",
          options: [
            { text_en: "I see white lilies and green ferns!", text_zh: "我看見純白的百合和翠綠的蕨類！", target_id: 'colors_green_white' },
            { text_en: "I see the blue sky and yellow sunshine!", text_zh: "我看見藍色的天空和金黃的陽光！", target_id: 'colors_sky_sun' }
          ]
        },
        colors_green_white: {
          id: 'colors_green_white',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "White and green! White means pure peace, and green means life and growth. You describe nature so poetically!",
          zh: "白與綠！白色代表純潔與和平，綠色象徵生命與茁壯。你對大自然的描述真有詩意！",
          options: [
            { text_en: "Nature is our classroom!", text_zh: "大自然是我們的教室！", target_id: 'ibu_reward' }
          ]
        },
        colors_sky_sun: {
          id: 'colors_sky_sun',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Yellow brings warmth to our cheeks, and blue gives calm to our thoughts. Beautiful observation!",
          zh: "黃色給我們的臉頰帶來溫暖，藍色給我們的心靈帶來平靜。多麼棒的觀察呀！",
          options: [
            { text_en: "I love bright sunshine!", text_zh: "我喜歡燦爛的陽光！", target_id: 'ibu_reward' }
          ]
        },
        ibu_reward: {
          id: 'ibu_reward',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "You have an artist's heart! Here is your daily mystery bonus points! Have a wonderful day in the sunshine!",
          zh: "你有一顆藝術家般的心！這是送給你的每日驚喜探索積分！在陽光下度過美好的一天吧！",
          options: [
            { text_en: "Thank you, Teacher Ibu! Have a great day!", text_zh: "謝謝 Ibu 老師！祝老師也有美好的一天！", action: 'CLAIM_TEACHER_BONUS' }
          ]
        }
      }
    },
    {
      variantId: 'ibu_v2',
      title: '今天的心情與快樂微笑篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Hello, my sunshine! How are you feeling in your heart today? Happy, excited, peaceful, or a little sleepy?",
          zh: "哈囉，我的小太陽！今天你的心裡感覺如何呢？快樂、興奮、平靜，還是有點想睡覺？",
          options: [
            { text_en: "I feel very happy and cheerful!", text_zh: "我感覺非常快樂、精神飽滿！", target_id: 'feel_happy' },
            { text_en: "I feel peaceful like a quiet river.", text_zh: "我感覺心裡像平靜的河流一樣寧靜。", target_id: 'feel_calm' },
            { text_en: "I was a little nervous, but seeing you helped!", text_zh: "我原本有點緊張，但看到老師就放鬆了！", target_id: 'feel_relieved' }
          ]
        },
        feel_happy: {
          id: 'feel_happy',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Your happiness is contagious! When you smile, the whole world smiles with you. Keep sharing your joy!",
          zh: "你的快樂會感染大家！當你微笑時，整個世界都在對你微笑。繼續分享這份喜悅吧！",
          options: [
            { text_en: "Smiles are free superpowers!", text_zh: "微笑是免費的超能力！", target_id: 'ibu_reward' }
          ]
        },
        feel_calm: {
          id: 'feel_calm',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "A calm mind is full of wisdom. When we are peaceful, we can listen and learn so deeply.",
          zh: "平靜的心靈充滿智慧。當我們心平氣和時，我們能傾聽得更深、學得更多。",
          options: [
            { text_en: "Thank you for understanding me!", text_zh: "謝謝老師理解我！", target_id: 'ibu_reward' }
          ]
        },
        feel_relieved: {
          id: 'feel_relieved',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Big hug! Remember you are always safe and loved here. Take a gentle breath, you are doing wonderfully.",
          zh: "給你一個大大的擁抱！記得在這裡你永遠是被愛和支持的。輕輕深吸一口氣，你表現得太棒了。",
          options: [
            { text_en: "I feel warm inside! Thank you!", text_zh: "我心裡暖洋洋的！謝謝老師！", target_id: 'ibu_reward' }
          ]
        },
        ibu_reward: {
          id: 'ibu_reward',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "You shared your genuine feelings today. That takes courage! Here is your daily reward bonus!",
          zh: "你今天真誠地分享了內心的感受，這需要很大的勇氣！這是給你的每日獎勵積分！",
          options: [
            { text_en: "Thank you, Teacher Ibu! Bye-bye!", text_zh: "謝謝 Ibu 老師！拜拜！", action: 'CLAIM_TEACHER_BONUS' }
          ]
        }
      }
    },
    {
      variantId: 'ibu_v3',
      title: '動物朋友與奇妙叫聲篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Animal sounds in English are so much fun! Do you know what a puppy says in English?",
          zh: "英語裡的動物叫聲太有趣了！你知道小狗在英文裡是怎麼叫的嗎？",
          options: [
            { text_en: "Woof-woof! A dog barks woof-woof!", text_zh: "汪汪！小狗叫 Woof-woof！", target_id: 'dog_sound' },
            { text_en: "What does a little bird say?", text_zh: "小鳥在英文裡是怎麼叫的呢？", target_id: 'bird_sound' }
          ]
        },
        dog_sound: {
          id: 'dog_sound',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Yes! Woof-woof! And what about a cat? In English, cats say 'Meow-meow'! You know your animal words so well!",
          zh: "沒錯！Woof-woof！那小貓呢？在英文裡貓咪叫『Meow-meow』！你的動物單字記得真清楚！",
          options: [
            { text_en: "Meow-meow! Animals are so cute!", text_zh: "喵～喵！動物真的好可愛！", target_id: 'ibu_reward' }
          ]
        },
        bird_sound: {
          id: 'bird_sound',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Little birds say 'Tweet-tweet' or 'Chirp-chirp'! Like singing music in the morning treetops.",
          zh: "小鳥會叫『Tweet-tweet』或是『Chirp-chirp』！就像清晨在樹梢吹奏樂曲一樣。",
          options: [
            { text_en: "Tweet-tweet! I love singing birds!", text_zh: "啾啾！我喜歡唱歌的小鳥！", target_id: 'ibu_reward' }
          ]
        },
        ibu_reward: {
          id: 'ibu_reward',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "You are a natural language learner! Here is your daily mystery bonus points! Have a sweet day!",
          zh: "你真是天生的語言學習家！這是送給你的每日驚喜探索積分！祝你有個甜美的一天！",
          options: [
            { text_en: "Thank you, Teacher Ibu! Goodbye!", text_zh: "謝謝 Ibu 老師！再見！", action: 'CLAIM_TEACHER_BONUS' }
          ]
        }
      }
    },
    {
      variantId: 'ibu_v4',
      title: '未來夢想與勇敢探險家篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "My dear student, the future is vast like the ocean! What is your dream? What would you like to be when you grow up?",
          zh: "親愛的學生，未來就像大海一樣廣闊！你的夢想是什麼？長大後你想成為什麼樣的人呢？",
          options: [
            { text_en: "I want to be an explorer and travel the world!", text_zh: "我想成為環遊世界的探險家！", target_id: 'dream_explorer' },
            { text_en: "I want to be a teacher or a doctor to help people!", text_zh: "我想當老師或醫生，幫助更多人！", target_id: 'dream_helper' },
            { text_en: "I want to be an artist and create beautiful things!", text_zh: "我想成為藝術家，創造美麗的事物！", target_id: 'dream_artist' }
          ]
        },
        dream_explorer: {
          id: 'dream_explorer',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "The whole world is waiting for you! English will be your passport to make friends in every country.",
          zh: "全世界都在等著你！英語將會是你通往每個國家、結交朋友的最棒護照。",
          options: [
            { text_en: "I will study hard and explore the world!", text_zh: "我會認真學習，探索全世界！", target_id: 'ibu_reward' }
          ]
        },
        dream_helper: {
          id: 'dream_helper',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "What a noble, kind heart! Healing others and sharing knowledge makes the world so much better.",
          zh: "多麼崇高、善良的心啊！醫治他人、傳播知識，能讓世界變得無比美好。",
          options: [
            { text_en: "Kindness is my superpower!", text_zh: "善良就是我的超能力！", target_id: 'ibu_reward' }
          ]
        },
        dream_artist: {
          id: 'dream_artist',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Art speaks to the soul across all languages! Paint your dreams with courage and bright colors.",
          zh: "藝術能跨越所有語言打動心靈！用勇氣與繽紛的色彩描繪你的夢想吧。",
          options: [
            { text_en: "I will paint my dreams brightly!", text_zh: "我會彩繪出最耀眼的夢想！", target_id: 'ibu_reward' }
          ]
        },
        ibu_reward: {
          id: 'ibu_reward',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Believe in yourself, and your dreams will take flight! Here is your special bonus reward! Go conquer the world!",
          zh: "相信自己，你的夢想一定會展翅高飛！這是特別送給你的獎勵積分！勇敢去探索世界吧！",
          options: [
            { text_en: "Thank you so much, Teacher Ibu! Sabau!", text_zh: "非常謝謝 Ibu 老師！Sabau！", action: 'CLAIM_TEACHER_BONUS' }
          ]
        }
      }
    }
  ]
};
`;

const outputPath = path.resolve('src/games/town/townDialogueData.js');
fs.writeFileSync(outputPath, DIALOGUE_DATA_CONTENT, 'utf8');
console.log('Successfully generated ' + outputPath);
