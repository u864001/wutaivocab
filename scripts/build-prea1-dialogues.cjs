const fs = require('fs');
const path = require('path');

const DIALOGUE_VARIANTS = {
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
          en: "Good morning! Welcome to school. How are you today?",
          zh: "早安！歡迎來到學校。你今天好嗎？",
          options: [
            { text_en: "I am happy and ready to learn!", text_zh: "我很好，準備好學習了！", target_id: 'quest_intro' },
            { text_en: "What classes do we have today?", text_zh: "我們今天有哪些課呢？", target_id: 'classes' },
            { text_en: "I am a little tired today.", text_zh: "我今天有一點累。", target_id: 'encourage' }
          ]
        },
        quest_intro: {
          id: 'quest_intro',
          speaker: '校長 (Principal)',
          en: "Great! Look at the Quest Board. Complete quests to win stars and coins!",
          zh: "太棒了！看看任務公佈欄。完成任務可以贏得星星和金幣喔！",
          options: [
            { text_en: "Open the Quest Board!", text_zh: "開啟任務公佈欄！", action: 'OPEN_QUESTS' },
            { text_en: "Thank you, Principal!", text_zh: "謝謝校長！", target_id: 'farewell' }
          ]
        },
        classes: {
          id: 'classes',
          speaker: '校長 (Principal)',
          en: "We have English, Math, and PE today! Do you like PE?",
          zh: "我們今天有英文課、數學課和體育課！你喜歡體育課嗎？",
          options: [
            { text_en: "Yes! I love English and PE!", text_zh: "喜歡！我最喜歡英文課和體育課！", target_id: 'quest_intro' },
            { text_en: "I will get my books ready.", text_zh: "我會準備好我的課本。", target_id: 'farewell' }
          ]
        },
        encourage: {
          id: 'encourage',
          speaker: '校長 (Principal)',
          en: "Drink some water and take a deep breath. You can do it!",
          zh: "喝點水，深呼吸一下。你可以做到的！",
          options: [
            { text_en: "Thank you! I feel better now.", text_zh: "謝謝校長！我感覺好多了。", target_id: 'quest_intro' }
          ]
        },
        farewell: {
          id: 'farewell',
          speaker: '校長 (Principal)',
          en: "Have a great day at Wutai Elementary School! Have fun!",
          zh: "在霧臺國小度過美好的一天吧！玩得開心！",
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
          en: "Hello! Do you have your pencil and eraser today?",
          zh: "哈囉！你今天有帶鉛筆和橡皮擦嗎？",
          options: [
            { text_en: "Yes! I have my pencil, eraser, and ruler.", text_zh: "有！我有鉛筆、橡皮擦和直尺。", target_id: 'bag_check' },
            { text_en: "Oh no! I forgot my eraser at home.", text_zh: "糟了！我把橡皮擦忘在家裡了。", target_id: 'bookstore_tip' }
          ]
        },
        bag_check: {
          id: 'bag_check',
          speaker: '校長 (Principal)',
          en: "Good job! You are ready to learn. Check the Quest Board for new missions!",
          zh: "做得好！你準備好認真學習了。看看任務布告欄有沒有新任務！",
          options: [
            { text_en: "Open Quest Board!", text_zh: "開啟任務公佈欄！", action: 'OPEN_QUESTS' }
          ]
        },
        bookstore_tip: {
          id: 'bookstore_tip',
          speaker: '校長 (Principal)',
          en: "Don't worry! You can buy a new eraser at Cloud Leopard Bookstore.",
          zh: "別擔心！你可以去雲豹書局買一個新的橡皮擦。",
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
          en: "Good morning! Did you say hello to your friends today?",
          zh: "早安！你今天向你的朋友們打招呼了嗎？",
          options: [
            { text_en: "Yes! I said 'Good morning' to everyone!", text_zh: "有！我跟大家說了『早安』！", target_id: 'praise_manners' },
            { text_en: "What are the polite words in English?", text_zh: "英語裡有哪些禮貌的話呢？", target_id: 'magic_words' }
          ]
        },
        praise_manners: {
          id: 'praise_manners',
          speaker: '校長 (Principal)',
          en: "Wonderful! You are very polite. A smile makes everyone happy!",
          zh: "太棒了！你非常有禮貌。微笑會讓大家都感到快樂！",
          options: [
            { text_en: "I want to do today's school quests!", text_zh: "我想挑戰今天的校園任務！", action: 'OPEN_QUESTS' },
            { text_en: "Thank you, Principal!", text_zh: "謝謝校長！", target_id: 'END' }
          ]
        },
        magic_words: {
          id: 'magic_words',
          speaker: '校長 (Principal)',
          en: "'Please', 'Thank you', and 'Excuse me'! Say them every day!",
          zh: "『Please（請）』、『Thank you（謝謝）』還有『Excuse me（不好意思）』！每天都要常常說喔！",
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
          en: "Look outside! The green mountains are so big and pretty. Do you like nature?",
          zh: "看看窗外！大山又大又綠、好漂亮。你喜歡大自然嗎？",
          options: [
            { text_en: "Yes, I like birds and trees!", text_zh: "喜歡，我喜歡小鳥和大樹！", target_id: 'nature_praise' },
            { text_en: "What can we see in the park today?", text_zh: "今天在公園能看到什麼呢？", target_id: 'park_recommend' }
          ]
        },
        nature_praise: {
          id: 'nature_praise',
          speaker: '校長 (Principal)',
          en: "Look at the birds and butterflies! Nature is our best classroom.",
          zh: "看看小鳥和蝴蝶！大自然是我們最棒的教室。",
          options: [
            { text_en: "Let's check the nature quests!", text_zh: "我們來看看大自然任務！", action: 'OPEN_QUESTS' }
          ]
        },
        park_recommend: {
          id: 'park_recommend',
          speaker: '校長 (Principal)',
          en: "Visit Flying Squirrel Park! Elder Squirrel is in the big tree.",
          zh: "去飛鼠公園看看吧！飛鼠長老就在大樹上等著你呢。",
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
          en: "Hello, little star! Are you ready for today's English challenge?",
          zh: "哈囉，小明星！你準備好迎接今天的英語挑戰了嗎？",
          options: [
            { text_en: "Yes, I am ready! I can do it!", text_zh: "我準備好了！我可以做到的！", target_id: 'rank_boost' },
            { text_en: "What if I make a mistake?", text_zh: "如果我講錯了怎麼辦？", target_id: 'courage_speech' }
          ]
        },
        rank_boost: {
          id: 'rank_boost',
          speaker: '校長 (Principal)',
          en: "You are brave! Complete quests and get top stars on the board!",
          zh: "你真勇敢！完成任務，在榮譽榜上獲得最亮眼的星星吧！",
          options: [
            { text_en: "Open Quest Board now!", text_zh: "現在就打開任務公佈欄！", action: 'OPEN_QUESTS' }
          ]
        },
        courage_speech: {
          id: 'courage_speech',
          speaker: '校長 (Principal)',
          en: "Don't be afraid! Making mistakes helps you learn and grow.",
          zh: "不要害怕！犯錯能幫助你學習和進步。",
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
          en: "Welcome to Cloud Leopard Bookstore! What do you need today?",
          zh: "歡迎光臨雲豹書局！你今天需要什麼文具呢？",
          options: [
            { text_en: "I need a pencil and an eraser, please.", text_zh: "我需要一枝鉛筆和一塊橡皮擦，謝謝。", target_id: 'stationery_shelf' },
            { text_en: "May I see the shop items?", text_zh: "我可以看看商店的商品嗎？", action: 'OPEN_SHOP' },
            { text_en: "Just looking around today, thank you!", text_zh: "今天只是逛逛看，謝謝！", target_id: 'browse' }
          ]
        },
        stationery_shelf: {
          id: 'stationery_shelf',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "Here are the pencils and erasers! They are great for writing.",
          zh: "鉛筆和橡皮擦在這裡！用它們寫字非常棒喔。",
          options: [
            { text_en: "Open shop to buy them!", text_zh: "打開商店購買！", action: 'OPEN_SHOP' },
            { text_en: "How much are they?", text_zh: "請問它們多少錢？", target_id: 'price_info' }
          ]
        },
        price_info: {
          id: 'price_info',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "A pencil is fifteen coins, and an eraser is ten coins.",
          zh: "一枝鉛筆 15 個金幣，一塊橡皮擦 10 個金幣。",
          options: [
            { text_en: "Let me buy them in the shop!", text_zh: "讓我在商店買下它們！", action: 'OPEN_SHOP' },
            { text_en: "I will save up my coins!", text_zh: "我會好好存金幣！", target_id: 'END' }
          ]
        },
        browse: {
          id: 'browse',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "Take your time! We have books, pens, and paper here.",
          zh: "慢慢看！我們這裡有書本、筆和紙張喔。",
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
          en: "Hello! Do you like reading storybooks?",
          zh: "哈囉！你喜歡閱讀故事繪本嗎？",
          options: [
            { text_en: "Yes! Tell me a story, please.", text_zh: "喜歡！請說一個故事給我聽。", target_id: 'story_tell' },
            { text_en: "Do you have storybooks in the shop?", text_zh: "商店裡有賣故事書嗎？", target_id: 'storybook_shop' }
          ]
        },
        story_tell: {
          id: 'story_tell',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "It is about a squirrel and a boar. They help each other in the forest!",
          zh: "這是一個關於飛鼠和山豬的故事。牠們在森林裡互相幫忙！",
          options: [
            { text_en: "They are good friends!", text_zh: "牠們是好朋友！", target_id: 'END' }
          ]
        },
        storybook_shop: {
          id: 'storybook_shop',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "Yes, we do! Open the shop to see all our books and notebooks.",
          zh: "當然有！打開商店就能看到我們所有的書本和筆記本。",
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
          en: "Look at the color pencils! Red, blue, yellow, and green. What color do you like?",
          zh: "看這些彩色鉛筆！紅色、藍色、黃色和綠色。你喜歡什麼顏色？",
          options: [
            { text_en: "I like blue!", text_zh: "我喜歡藍色！", target_id: 'color_blue' },
            { text_en: "I like yellow and red!", text_zh: "我喜歡黃色和紅色！", target_id: 'color_rainbow' },
            { text_en: "Can I buy drawing paper?", text_zh: "我可以買畫畫紙嗎？", action: 'OPEN_SHOP' }
          ]
        },
        color_blue: {
          id: 'color_blue',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "Blue like the mountain sky! It is a cool color.",
          zh: "像山上的天空一樣蔚藍！這是很棒的顏色。",
          options: [
            { text_en: "I want to draw the sky!", text_zh: "我想畫下天空！", action: 'OPEN_SHOP' },
            { text_en: "Thank you!", text_zh: "謝謝店長！", target_id: 'END' }
          ]
        },
        color_rainbow: {
          id: 'color_rainbow',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "Yellow like the sun, red like an apple! You can draw a rainbow.",
          zh: "黃色像太陽，紅色像蘋果！你可以畫出一道彩虹。",
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
          en: "Welcome! Practice asking in English: 'Excuse me, how much is this?'",
          zh: "歡迎！試著用英文問：『Excuse me, how much is this?』",
          options: [
            { text_en: "Excuse me, how much is this notebook?", text_zh: "不好意思，請問這本筆記本多少錢？", target_id: 'notebook_price' },
            { text_en: "Can I see the shop items, please?", text_zh: "請讓我看看商品，好嗎？", action: 'OPEN_SHOP' }
          ]
        },
        notebook_price: {
          id: 'notebook_price',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "This notebook is twenty-five coins. It has white paper inside.",
          zh: "這本筆記本是 25 個金幣。裡面有乾淨的白紙喔。",
          options: [
            { text_en: "I want to buy it!", text_zh: "我想買下它！", action: 'OPEN_SHOP' },
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
          en: "Do you write a diary? Writing in English is fun!",
          zh: "你有寫日記嗎？用英文寫日記很好玩喔！",
          options: [
            { text_en: "Yes, I write new English words every day!", text_zh: "有，我每天都寫新的英文單字！", target_id: 'journal_praise' },
            { text_en: "What can I write in my diary?", text_zh: "我日記裡可以寫些什麼呢？", target_id: 'journal_tips' }
          ]
        },
        journal_praise: {
          id: 'journal_praise',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "Great job! Practicing every day makes you smart and happy.",
          zh: "做得好！每天練習會讓你變得聰明又快樂。",
          options: [
            { text_en: "Open shop for new pens and notebooks!", text_zh: "開啟商店挑選新筆與筆記本！", action: 'OPEN_SHOP' }
          ]
        },
        journal_tips: {
          id: 'journal_tips',
          speaker: '雲豹店長 (Manager Leopard)',
          en: "Write: 'Today is sunny. I am happy. I like apples.' Easy and cool!",
          zh: "你可以寫：『Today is sunny. I am happy. I like apples.』簡單又帥氣！",
          options: [
            { text_en: "I will try today! Thank you!", text_zh: "我今天就來試試看！謝謝店長！", target_id: 'END' }
          ]
        }
      }
    }
  ],

  // ── 🍎 3. 黑熊超市 店員 Clerk Bear (5 套食物與生活補給主題) ──
  supermarket: [
    {
      variantId: 'supermarket_v0',
      title: '美味點心與水果補給篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "Hello! Welcome to the supermarket. Are you hungry?",
          zh: "哈囉！歡迎光臨黑熊超市。你肚子餓了嗎？",
          options: [
            { text_en: "Yes! I want some fruit, please.", text_zh: "對！我想要一些水果，謝謝。", target_id: 'snack_recommend' },
            { text_en: "Do you have cold drinks?", text_zh: "你們有冰涼的飲料嗎？", target_id: 'drink_recommend' },
            { text_en: "Can I look at the snacks in the shop?", text_zh: "我可以看看商店裡的點心嗎？", action: 'OPEN_SHOP' }
          ]
        },
        snack_recommend: {
          id: 'snack_recommend',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "We have red apples and yellow bananas! Do you like apples?",
          zh: "我們有紅蘋果和黃香蕉！你喜歡蘋果嗎？",
          options: [
            { text_en: "Yes, I like red apples!", text_zh: "喜歡，我喜歡紅蘋果！", target_id: 'apple_wisdom' },
            { text_en: "I want to buy some fruit in the shop!", text_zh: "我想在商店裡買一些水果！", action: 'OPEN_SHOP' }
          ]
        },
        apple_wisdom: {
          id: 'apple_wisdom',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "An apple a day keeps the doctor away! Apples are sweet and healthy.",
          zh: "一天一蘋果，醫生遠離我！蘋果又甜又健康。",
          options: [
            { text_en: "Let's open the shop!", text_zh: "我們來打開商店！", action: 'OPEN_SHOP' }
          ]
        },
        drink_recommend: {
          id: 'drink_recommend',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "We have cold milk and fresh juice. Which one do you want?",
          zh: "我們有冰牛奶和新鮮果汁。你想要哪一種呢？",
          options: [
            { text_en: "I want orange juice, please!", text_zh: "我想要柳橙汁，謝謝！", action: 'OPEN_SHOP' },
            { text_en: "I want milk, please!", text_zh: "我想要牛奶，謝謝！", action: 'OPEN_SHOP' }
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
          en: "Good morning! Did you eat breakfast today?",
          zh: "早安！你今天吃早餐了嗎？",
          options: [
            { text_en: "Yes! I ate bread and drank milk.", text_zh: "吃了！我吃了麵包和喝了牛奶。", target_id: 'healthy_choice' },
            { text_en: "I ate a yellow banana!", text_zh: "我吃了一根黃香蕉！", target_id: 'banana_power' },
            { text_en: "I did not eat breakfast yet.", text_zh: "我還沒有吃早餐。", target_id: 'must_eat' }
          ]
        },
        healthy_choice: {
          id: 'healthy_choice',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "Bread and milk! That gives you power to run and play.",
          zh: "麵包和牛奶！這會給你跑步和玩耍的滿滿活力。",
          options: [
            { text_en: "Open shop for more food!", text_zh: "開啟商店挑選更多美食！", action: 'OPEN_SHOP' }
          ]
        },
        banana_power: {
          id: 'banana_power',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "Bananas are great! Monkeys and bears love bananas too.",
          zh: "香蕉太棒了！猴子和黑熊也最喜歡香蕉了。",
          options: [
            { text_en: "I want to buy a banana!", text_zh: "我想買一根香蕉！", action: 'OPEN_SHOP' }
          ]
        },
        must_eat: {
          id: 'must_eat',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "Eat breakfast every day! It makes you strong and tall.",
          zh: "每天都要吃早餐喔！這會讓你長得高又壯。",
          options: [
            { text_en: "I will eat breakfast! Thank you.", text_zh: "我會吃早餐的！謝謝黑熊店員。", target_id: 'END' }
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
          en: "Look at the colorful vegetables! Red tomatoes and green peppers. What do you see?",
          zh: "看這些五顏六色的蔬菜！紅番茄和青椒。你看到了什麼？",
          options: [
            { text_en: "I see orange carrots!", text_zh: "我看見了橘色的紅蘿蔔！", target_id: 'rainbow_explain' },
            { text_en: "Can I buy some vegetables in the shop?", text_zh: "我可以在商店買蔬菜嗎？", action: 'OPEN_SHOP' }
          ]
        },
        rainbow_explain: {
          id: 'rainbow_explain',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "Carrots are good for your eyes! Eat colorful vegetables every day.",
          zh: "紅蘿蔔對眼睛很好喔！每天都要多吃彩色的蔬菜。",
          options: [
            { text_en: "Open the supermarket shop!", text_zh: "打開超市商店！", action: 'OPEN_SHOP' }
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
          en: "Let's have a picnic in the park! What food should we bring?",
          zh: "我們去公園野餐吧！我們應該帶什麼食物呢？",
          options: [
            { text_en: "Sandwiches, apples, and water!", text_zh: "三明治、蘋果和大水壺！", target_id: 'picnic_ideas' },
            { text_en: "Let me buy picnic food in the shop!", text_zh: "讓我在商店買野餐食物！", action: 'OPEN_SHOP' }
          ]
        },
        picnic_ideas: {
          id: 'picnic_ideas',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "Yummy! Put the sandwiches in your basket. Let's go picnic!",
          zh: "好好吃喔！把三明治放進籃子裡。我們出發去野餐吧！",
          options: [
            { text_en: "Open shop to pack my basket!", text_zh: "打開商店打包我的野餐籃！", action: 'OPEN_SHOP' }
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
          en: "Hello! Put your items on the counter. How many apples do you have?",
          zh: "哈囉！請把商品放在櫃檯上。你有幾顆蘋果呢？",
          options: [
            { text_en: "I have two apples and one juice.", text_zh: "我有兩顆蘋果和一瓶果汁。", target_id: 'payment_done' },
            { text_en: "How much is it in total?", text_zh: "請問總共多少錢？", target_id: 'payment_done' }
          ]
        },
        payment_done: {
          id: 'payment_done',
          speaker: '黑熊店員 (Clerk Bear)',
          en: "That is twelve coins, please. Here is your bag. Thank you!",
          zh: "總共是 12 個金幣。這是你的袋子，謝謝光臨！",
          options: [
            { text_en: "Here are twelve coins. Thank you!", text_zh: "這是 12 個金幣，謝謝店員！", target_id: 'END' },
            { text_en: "Open shop to get more items!", text_zh: "打開商店選購更多商品！", action: 'OPEN_SHOP' }
          ]
        }
      }
    }
  ],

  // ── 🌳 4. 飛鼠公園 長老 Elder Squirrel (5 套天氣與動物戶外主題) ──
  park: [
    {
      variantId: 'park_v0',
      title: '四季天氣與大自然觀察篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Hello, little friend! Look at the sky. How is the weather today?",
          zh: "哈囉，小朋友！看天空。今天天氣如何？",
          options: [
            { text_en: "It is sunny and warm!", text_zh: "今天天氣晴朗又溫暖！", target_id: 'sunny_talk' },
            { text_en: "It is windy today!", text_zh: "今天風好大！", target_id: 'windy_talk' },
            { text_en: "Is it hot in summer and cold in winter?", text_zh: "夏天熱、冬天冷嗎？", target_id: 'seasons_talk' }
          ]
        },
        sunny_talk: {
          id: 'sunny_talk',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "The sun is big and bright! Put on your cap and drink water.",
          zh: "太陽又大又亮！記得戴帽子，多喝水喔。",
          options: [
            { text_en: "I have my cap and water bottle!", text_zh: "我有戴帽子和帶水壺！", target_id: 'farewell' }
          ]
        },
        windy_talk: {
          id: 'windy_talk',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Whoosh! The wind blows the green leaves. Can you fly like me?",
          zh: "呼～風吹拂著綠色的樹葉。你能像我一樣飛起來嗎？",
          options: [
            { text_en: "I cannot fly, but I can run fast!", text_zh: "我不會飛，但我可以跑很快！", target_id: 'farewell' }
          ]
        },
        seasons_talk: {
          id: 'seasons_talk',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Yes! Spring is warm, summer is hot, autumn is cool, and winter is cold.",
          zh: "沒錯！春天溫暖，夏天炎熱，秋天涼爽，冬天寒冷。",
          options: [
            { text_en: "I like warm spring days!", text_zh: "我喜歡溫暖的春天！", target_id: 'farewell' }
          ]
        },
        farewell: {
          id: 'farewell',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Enjoy the park today! Play safely and have fun!",
          zh: "今天好好享受公園時光吧！注意安全，玩得開心！",
          options: [
            { text_en: "Thank you, Elder Squirrel! Goodbye!", text_zh: "謝謝飛鼠長老！再見！", target_id: 'END' }
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
          en: "Look around the trees! What animals can you see?",
          zh: "看看周圍的大樹！你看見了什麼動物？",
          options: [
            { text_en: "I see birds in the tree!", text_zh: "我看見樹上的小鳥！", target_id: 'birds_talk' },
            { text_en: "I see a colorful butterfly!", text_zh: "我看見一隻彩色的蝴蝶！", target_id: 'butterfly_talk' }
          ]
        },
        birds_talk: {
          id: 'birds_talk',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Tweet-tweet! The birds are singing. They have two wings and can fly high.",
          zh: "啾啾！小鳥正在唱歌。牠們有兩隻翅膀，可以飛得好高。",
          options: [
            { text_en: "The birds sing so nicely!", text_zh: "小鳥唱歌真好聽！", target_id: 'END' }
          ]
        },
        butterfly_talk: {
          id: 'butterfly_talk',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "The butterfly has pretty wings! Red, yellow, and blue.",
          zh: "蝴蝶有一對好漂亮的翅膀！有紅色、黃色和藍色。",
          options: [
            { text_en: "Butterflies love sweet flowers!", text_zh: "蝴蝶最喜歡甜甜的花朵了！", target_id: 'END' }
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
          en: "Look at the green grass! Can you run and jump?",
          zh: "看這片綠草地！你會跑步和跳躍嗎？",
          options: [
            { text_en: "Yes! I can run very fast!", text_zh: "會！我可以跑得非常快！", target_id: 'run_praise' },
            { text_en: "Can you teach me how to jump?", text_zh: "你可以教我怎麼跳躍嗎？", target_id: 'jump_lesson' }
          ]
        },
        run_praise: {
          id: 'run_praise',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Running makes your legs strong and your heart happy! One, two, three, go!",
          zh: "跑步讓雙腿有力，心情快樂！一、二、三，出發！",
          options: [
            { text_en: "Let's run together!", text_zh: "我們一起跑步吧！", target_id: 'END' }
          ]
        },
        jump_lesson: {
          id: 'jump_lesson',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Bend your knees and jump up high! Up, up, up into the air!",
          zh: "彎曲膝蓋，用力向上跳！跳高、跳高、跳到半空中！",
          options: [
            { text_en: "That was fun! Jump!", text_zh: "太好玩了！跳！", target_id: 'END' }
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
          en: "Look at the sky after the rain! What can you see?",
          zh: "看下過雨後的天空！你能看見什麼？",
          options: [
            { text_en: "I see a beautiful rainbow!", text_zh: "我看見一道美麗的彩虹！", target_id: 'rainbow_story' },
            { text_en: "I see white clouds and green trees!", text_zh: "我看見白雲和綠樹！", target_id: 'mist_story' }
          ]
        },
        rainbow_story: {
          id: 'rainbow_story',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Red, orange, yellow, green, blue! Five and more colors in the sky!",
          zh: "紅色、橙色、黃色、綠色、藍色！天空中好多美麗的顏色！",
          options: [
            { text_en: "The rainbow is so pretty!", text_zh: "彩虹真的太漂亮了！", target_id: 'END' }
          ]
        },
        mist_story: {
          id: 'mist_story',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "The air is cool and clean. Take a deep breath of fresh air!",
          zh: "空氣好涼爽、好乾淨。大口深呼吸清新的空氣吧！",
          options: [
            { text_en: "The air feels so good!", text_zh: "空氣感覺真舒服！", target_id: 'END' }
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
          en: "Look up at the night sky! Can you see the stars?",
          zh: "抬頭看夜空！你能看見天上的星星嗎？",
          options: [
            { text_en: "Yes! Twinkle, twinkle, little star!", text_zh: "有！一閃一閃亮晶晶！", target_id: 'stars_twinkle' },
            { text_en: "What do squirrels do at night?", text_zh: "飛鼠晚上都在做什麼呢？", target_id: 'nocturnal_life' }
          ]
        },
        stars_twinkle: {
          id: 'stars_twinkle',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "Millions of stars! They shine bright like little lights.",
          zh: "成千上萬顆星星！牠們像小燈泡一樣閃閃發光。",
          options: [
            { text_en: "I love the night sky!", text_zh: "我喜歡美麗的夜空！", target_id: 'END' }
          ]
        },
        nocturnal_life: {
          id: 'nocturnal_life',
          speaker: '飛鼠長老 (Elder Squirrel)',
          en: "We glide from tree to tree under the moon! We watch over the town.",
          zh: "我們在月光下從一棵樹滑翔到另一棵樹！我們守護著小鎮。",
          options: [
            { text_en: "Good night, Elder Squirrel!", text_zh: "晚安，飛鼠長老！", target_id: 'END' }
          ]
        }
      }
    }
  ],

  // ── 🚌 5. 霧臺客運站 站長 Station Master Eagle (5 套交通與旅行主題) ──
  station: [
    {
      variantId: 'station_v0',
      title: '出發旅行與客運車票篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "Good morning! The green bus is here. Where are you going?",
          zh: "早安！綠色公車來了。你要去哪裡呢？",
          options: [
            { text_en: "I am going to Pingtung!", text_zh: "我要去屏東！", target_id: 'bus_ticket' },
            { text_en: "Can I buy a bus ticket in the shop?", text_zh: "我可以在商店買公車票嗎？", action: 'OPEN_SHOP' },
            { text_en: "What is the famous bridge on the road?", text_zh: "路上那座有名的橋是什麼呢？", target_id: 'bridge_info' }
          ]
        },
        bus_ticket: {
          id: 'bus_ticket',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "The bus leaves soon. Buy a ticket, take a seat, and buckle up!",
          zh: "公車馬上要發車了。買張票、坐好，繫上安全帶喔！",
          options: [
            { text_en: "Open shop to buy tickets!", text_zh: "開啟商店購買車票！", action: 'OPEN_SHOP' }
          ]
        },
        bridge_info: {
          id: 'bridge_info',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "It is Guchuan Bridge! It is ninety-nine meters tall above the river.",
          zh: "那是谷川大橋！它在河流上方有 99 公尺那麼高喔。",
          options: [
            { text_en: "Wow, ninety-nine meters is so high!", text_zh: "哇，99 公尺好高喔！", target_id: 'farewell' }
          ]
        },
        farewell: {
          id: 'farewell',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "Safety first on every trip! Safe travels!",
          zh: "每次旅途安全第一！祝你旅途平安！",
          options: [
            { text_en: "Thank you, Station Master!", text_zh: "謝謝站長！", target_id: 'END' }
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
          en: "Hello! Do you ride a bicycle? Always remember safety!",
          zh: "哈囉！你會騎腳踏車嗎？要隨時注意安全喔！",
          options: [
            { text_en: "Yes! I always wear my helmet.", text_zh: "會！我一定會戴安全帽。", target_id: 'helmet_praise' },
            { text_en: "What are the traffic rules?", text_zh: "有哪些重要的交通規則呢？", target_id: 'safety_rules' }
          ]
        },
        helmet_praise: {
          id: 'helmet_praise',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "Good job! A helmet protects your head. Both hands on the bike!",
          zh: "做得好！安全帽能保護你的頭。雙手要握緊把手喔！",
          options: [
            { text_en: "Check shop for cycling items!", text_zh: "到商店看看自行車與旅行配備！", action: 'OPEN_SHOP' }
          ]
        },
        safety_rules: {
          id: 'safety_rules',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "Red light means stop, green light means go! Don't ride too fast.",
          zh: "紅燈停、綠燈行！不要騎得太快喔。",
          options: [
            { text_en: "I will follow the rules!", text_zh: "我會遵守交通規則！", target_id: 'END' }
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
          en: "Look at the big clock! What time is it now?",
          zh: "看那個大時鐘！現在是幾點鐘了？",
          options: [
            { text_en: "It is eight o'clock! When does the bus come?", text_zh: "現在是八點整！公車什麼時候來？", target_id: 'timetable_read' },
            { text_en: "Can I buy a souvenir ticket?", text_zh: "我可以買一張紀念車票嗎？", action: 'OPEN_SHOP' }
          ]
        },
        timetable_read: {
          id: 'timetable_read',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "The bus comes at eight thirty. Be on time and don't be late!",
          zh: "公車在八點半會來。要準時，不要遲到喔！",
          options: [
            { text_en: "I am on time! Thank you!", text_zh: "我很準時！謝謝站長！", target_id: 'END' }
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
          en: "What do you have in your travel backpack today?",
          zh: "你今天的旅行背包裡裝了些什麼呢？",
          options: [
            { text_en: "I have water, a hat, a map, and a ticket!", text_zh: "我有水壺、帽子、地圖和車票！", target_id: 'gear_ready' },
            { text_en: "I need a ticket from the shop.", text_zh: "我需要去商店買一張車票。", action: 'OPEN_SHOP' }
          ]
        },
        gear_ready: {
          id: 'gear_ready',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "One hundred points! You are ready for a big trip. Let's go!",
          zh: "一百分！你已經準備好出發大旅行了。走吧！",
          options: [
            { text_en: "Ready for the trip! Thank you!", text_zh: "準備出發！謝謝站長！", target_id: 'END' }
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
          en: "Look out the bus window! Do you see the river and mountains?",
          zh: "望向公車窗外！你看見底下的河流和大山了嗎？",
          options: [
            { text_en: "Yes! The mountains are very green and tall.", text_zh: "看見了！大山又綠又高。", target_id: 'scenery_share' },
            { text_en: "Can I buy a postcard or ticket in the shop?", text_zh: "我可以買明信片或車票紀念嗎？", action: 'OPEN_SHOP' }
          ]
        },
        scenery_share: {
          id: 'scenery_share',
          speaker: '雄鷹站長 (Station Master Eagle)',
          en: "The view is wonderful! Wutai is so beautiful. Enjoy the ride!",
          zh: "風景太棒了！霧臺真的好美麗。好好享受兜風吧！",
          options: [
            { text_en: "Thank you, Station Master! Goodbye!", text_zh: "謝謝站長！再見！", target_id: 'END' }
          ]
        }
      }
    }
  ],

  // ── 🏥 6. 貓頭鷹診所 醫師 Dr. Owl (5 套健康與身體護理主題) ──
  clinic: [
    {
      variantId: 'clinic_v0',
      title: '感冒預防與喉嚨照護篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '貓頭鷹醫生 (Dr. Owl)',
          en: "Hello, little one! What is the matter today?",
          zh: "哈囉，小朋友！你今天哪裡不舒服嗎？",
          options: [
            { text_en: "My throat hurts.", text_zh: "我的喉嚨痛痛的。", target_id: 'throat_check' },
            { text_en: "I am healthy and happy today!", text_zh: "我今天很健康、很快樂！", target_id: 'healthy_praise' },
            { text_en: "Can I see medicine items in the shop?", text_zh: "我可以看看商店裡的保健用品嗎？", action: 'OPEN_SHOP' }
          ]
        },
        throat_check: {
          id: 'throat_check',
          speaker: '貓頭鷹醫生 (Dr. Owl)',
          en: "Open your mouth and say 'Ah'! Drink warm water and get some rest.",
          zh: "嘴巴張開說『啊～』！多喝溫開水，好好休息。",
          options: [
            { text_en: "Open shop for warm tea!", text_zh: "開啟商店選購溫茶與口罩！", action: 'OPEN_SHOP' },
            { text_en: "Thank you, doctor!", text_zh: "謝謝貓頭鷹醫生！", target_id: 'farewell' }
          ]
        },
        healthy_praise: {
          id: 'healthy_praise',
          speaker: '貓頭鷹醫生 (Dr. Owl)',
          en: "Great! Wash your hands before eating, and wear a mask when crowded.",
          zh: "太棒了！吃東西前要洗手，人多的地方要戴口罩喔。",
          options: [
            { text_en: "I will wash my hands!", text_zh: "我會常洗手的！", target_id: 'farewell' }
          ]
        },
        farewell: {
          id: 'farewell',
          speaker: '貓頭鷹醫生 (Dr. Owl)',
          en: "Stay healthy and stay strong! Goodbye!",
          zh: "保持健康、保持強壯！再見！",
          options: [
            { text_en: "Goodbye, Dr. Owl!", text_zh: "再見，貓頭鷹醫生！", target_id: 'END' }
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
          speaker: '貓頭鷹醫生 (Dr. Owl)',
          en: "Are you sleepy? What time do you go to bed at night?",
          zh: "你想睡覺嗎？你晚上都幾點上床睡覺呢？",
          options: [
            { text_en: "I go to bed at nine o'clock!", text_zh: "我晚上九點睡覺！", target_id: 'sleep_champion' },
            { text_en: "I play games late at night.", text_zh: "我晚上很晚還在玩遊戲。", target_id: 'sleep_advice' }
          ]
        },
        sleep_champion: {
          id: 'sleep_champion',
          speaker: '貓頭鷹醫生 (Dr. Owl)',
          en: "Nine o'clock is great! Good sleep helps you grow tall and smart.",
          zh: "九點很棒！充足的睡眠能幫助你長高又變聰明。",
          options: [
            { text_en: "I will sleep well every night!", text_zh: "我每天晚上都會睡好覺！", target_id: 'END' }
          ]
        },
        sleep_advice: {
          id: 'sleep_advice',
          speaker: '貓頭鷹醫生 (Dr. Owl)',
          en: "Sleep early, my friend! Eight hours of sleep makes you strong.",
          zh: "早點睡覺，小夥計！睡滿八小時會讓你變強壯。",
          options: [
            { text_en: "I will go to bed early! Thank you.", text_zh: "我會早點睡覺的！謝謝醫生。", target_id: 'END' }
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
          speaker: '貓頭鷹醫生 (Dr. Owl)',
          en: "Oh no! Did you fall down? Where does it hurt?",
          zh: "哎呀！你跌倒了嗎？哪裡痛痛的？",
          options: [
            { text_en: "My knee hurts! It has a little scratch.", text_zh: "我的膝蓋痛痛的！有一點點擦傷。", target_id: 'first_aid_care' },
            { text_en: "I am okay, no hurts today!", text_zh: "我沒事，今天沒有受傷！", target_id: 'safety_praise' }
          ]
        },
        first_aid_care: {
          id: 'first_aid_care',
          speaker: '貓頭鷹醫生 (Dr. Owl)',
          en: "Let's clean it and put a bandage on it. All better now!",
          zh: "我們把它消毒乾淨，貼上一張可愛的 OK 繃。沒事囉！",
          options: [
            { text_en: "Open shop for bandages!", text_zh: "開啟商店挑選急救護理用品！", action: 'OPEN_SHOP' },
            { text_en: "Thank you, doctor!", text_zh: "謝謝醫生！", target_id: 'END' }
          ]
        },
        safety_praise: {
          id: 'safety_praise',
          speaker: '貓頭鷹醫生 (Dr. Owl)',
          en: "Good! When you run and play, watch your step.",
          zh: "很好！跑步玩耍時，記得注意腳步喔。",
          options: [
            { text_en: "I will be careful! Thank you.", text_zh: "我會小心的！謝謝醫生。", target_id: 'END' }
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
          speaker: '貓頭鷹醫生 (Dr. Owl)',
          en: "Show me your teeth! Do you brush your teeth every day?",
          zh: "讓我看看你的牙齒！你每天都有刷牙嗎？",
          options: [
            { text_en: "Yes! I brush my teeth twice a day.", text_zh: "有！我一天刷兩次牙。", target_id: 'brush_praise' },
            { text_en: "Do sweet candies make cavities?", text_zh: "甜甜的糖果會造成蛀牙嗎？", target_id: 'candy_advice' }
          ]
        },
        brush_praise: {
          id: 'brush_praise',
          speaker: '貓頭鷹醫生 (Dr. Owl)',
          en: "Your teeth are so white and clean! Keep brushing morning and night.",
          zh: "你的牙齒好白好乾淨！早晚都要記得好好刷牙喔。",
          options: [
            { text_en: "I love having clean teeth!", text_zh: "我喜歡牙齒乾乾淨淨的！", target_id: 'END' }
          ]
        },
        candy_advice: {
          id: 'candy_advice',
          speaker: '貓頭鷹醫生 (Dr. Owl)',
          en: "Yes! Sweet candies hurt your teeth. Brush after eating snacks, okay?",
          zh: "對！吃太多糖果會傷害牙齒。吃完點心要刷牙或漱口喔！",
          options: [
            { text_en: "Yes, doctor! I will brush my teeth.", text_zh: "好的，醫生！我會去刷牙。", target_id: 'END' }
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
          speaker: '貓頭鷹醫生 (Dr. Owl)',
          en: "Are you worried or tired? Take a deep breath with me!",
          zh: "你感到擔心或疲累嗎？跟我一起深呼吸！",
          options: [
            { text_en: "Breathe in, and breathe out!", text_zh: "吸氣，然後吐氣！", target_id: 'breathe_lesson' },
            { text_en: "I feel happy and relaxed today!", text_zh: "我今天心情很好、很放鬆！", target_id: 'peace_praise' }
          ]
        },
        breathe_lesson: {
          id: 'breathe_lesson',
          speaker: '貓頭鷹醫生 (Dr. Owl)',
          en: "Breathe in fresh air, breathe out worries. Smile! You are amazing.",
          zh: "吸進新鮮空氣，吐出煩惱。微笑一下！你很棒的。",
          options: [
            { text_en: "I feel so much better now!", text_zh: "我現在感覺好多了！", target_id: 'END' }
          ]
        },
        peace_praise: {
          id: 'peace_praise',
          speaker: '貓頭鷹醫生 (Dr. Owl)',
          en: "A happy heart is the best medicine! Keep smiling every day.",
          zh: "快樂的心就是最好的良藥！每天都要開開心心的喔。",
          options: [
            { text_en: "Thank you, Dr. Owl!", text_zh: "謝謝貓頭鷹醫生！", target_id: 'END' }
          ]
        }
      }
    }
  ],

  // ── 🏛️ 7. 百步蛇集會所 百合設計師 Stylist Lily (5 套服飾與魯凱文化主題) ──
  plaza: [
    {
      variantId: 'plaza_v0',
      title: '部落工藝與七彩琉璃珠篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '百合設計師 (Stylist Lily)',
          en: "Sabau! Welcome to the plaza! Look at my glass beads. What color do you like?",
          zh: "Sabau！歡迎來到集會所！看我的琉璃珠。你喜歡什麼顏色？",
          options: [
            { text_en: "I like red and yellow beads!", text_zh: "我喜歡紅色和黃色的琉璃珠！", target_id: 'bead_meaning' },
            { text_en: "I like blue and green beads!", text_zh: "我喜歡藍色和綠色的琉璃珠！", target_id: 'craft_praise' },
            { text_en: "Can I buy beads in the shop?", text_zh: "我可以在商店買琉璃珠嗎？", action: 'OPEN_SHOP' }
          ]
        },
        bead_meaning: {
          id: 'bead_meaning',
          speaker: '百合設計師 (Stylist Lily)',
          en: "Red is for courage! Yellow is for sunlight. Each bead has a story.",
          zh: "紅色代表勇氣！黃色代表陽光。每顆琉璃珠都有它的故事喔。",
          options: [
            { text_en: "Open shop to see the beads!", text_zh: "開啟商店欣賞琉璃飾品！", action: 'OPEN_SHOP' },
            { text_en: "Thank you for telling me!", text_zh: "謝謝百合設計師告訴我！", target_id: 'farewell' }
          ]
        },
        craft_praise: {
          id: 'craft_praise',
          speaker: '百合設計師 (Stylist Lily)',
          en: "Blue is for water, green is for the forest. You have great taste!",
          zh: "藍色代表流水，綠色代表森林。你的眼光真好！",
          options: [
            { text_en: "I love mountain colors!", text_zh: "我喜歡大山的顏色！", target_id: 'farewell' }
          ]
        },
        farewell: {
          id: 'farewell',
          speaker: '百合設計師 (Stylist Lily)',
          en: "Wear your beads with pride! Have a wonderful day!",
          zh: "自豪地佩戴你的琉璃珠吧！祝你有美好的一天！",
          options: [
            { text_en: "Thank you, Lily! Goodbye!", text_zh: "謝謝百合設計師！再見！", target_id: 'END' }
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
          en: "Look at my hat! Do you see the white flower?",
          zh: "看我的帽子！你看見那朵白色的花朵了嗎？",
          options: [
            { text_en: "Yes! It is a pretty white lily!", text_zh: "有！是一朵漂亮的白百合花！", target_id: 'lily_honor' },
            { text_en: "Can I buy a lily brooch in the shop?", text_zh: "我可以在商店買百合胸針嗎？", action: 'OPEN_SHOP' }
          ]
        },
        lily_honor: {
          id: 'lily_honor',
          speaker: '百合設計師 (Stylist Lily)',
          en: "The lily flower stands for honor and bravery in Rukai culture!",
          zh: "在魯凱族文化中，百合花象徵著榮譽與勇敢喔！",
          options: [
            { text_en: "I want to be brave and kind!", text_zh: "我想成為勇敢又善良的人！", target_id: 'END' }
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
          en: "Look at this clay pot! What animal do you see on it?",
          zh: "看這個陶壺！你在上面看見了什麼動物？",
          options: [
            { text_en: "I see the hundred-pace snake!", text_zh: "我看見了百步蛇！", target_id: 'guardian_story' },
            { text_en: "Can I see cultural items in the shop?", text_zh: "我可以看商店裡的文化藝品嗎？", action: 'OPEN_SHOP' }
          ]
        },
        guardian_story: {
          id: 'guardian_story',
          speaker: '百合設計師 (Stylist Lily)',
          en: "The snake is our guardian friend! It protects our mountains.",
          zh: "百步蛇是我們守護者朋友！牠保護著我們的大山。",
          options: [
            { text_en: "That is so cool! Thank you.", text_zh: "太帥了！謝謝設計師。", target_id: 'END' }
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
          en: "Listen to the music! Can you dance with us?",
          zh: "聽這個音樂！你能和我們一起跳舞嗎？",
          options: [
            { text_en: "Yes! Let's hold hands and dance!", text_zh: "好！大家手牽手一起跳舞吧！", target_id: 'dance_joy' },
            { text_en: "Can I buy dance clothes in the shop?", text_zh: "我可以在商店買舞蹈服飾嗎？", action: 'OPEN_SHOP' }
          ]
        },
        dance_joy: {
          id: 'dance_joy',
          speaker: '百合設計師 (Stylist Lily)',
          en: "One, two, step! Ring the bells! Dancing together brings joy to all.",
          zh: "一、二、踩步！搖響小鈴鐺！一起跳舞讓大家都開心。",
          options: [
            { text_en: "Dancing is so much fun!", text_zh: "跳舞真的好好玩！", target_id: 'END' }
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
          en: "Do you want to wear a flower crown on your head?",
          zh: "你想在頭上戴一頂花環嗎？",
          options: [
            { text_en: "Yes, please! It looks so pretty.", text_zh: "好啊，謝謝！看起來好漂亮。", target_id: 'crown_gift' },
            { text_en: "Can I see crowns in the shop?", text_zh: "我可以在商店看花環嗎？", action: 'OPEN_SHOP' }
          ]
        },
        crown_gift: {
          id: 'crown_gift',
          speaker: '百合設計師 (Stylist Lily)',
          en: "Green leaves and red flowers! Put it on. You look lovely!",
          zh: "綠色的葉子和紅色的花朵！戴上它，你真好看！",
          options: [
            { text_en: "Thank you! I love it!", text_zh: "謝謝設計師！我很喜歡！", target_id: 'END' }
          ]
        }
      }
    }
  ],

  // ── 🎬 8. 山豬影城 售票員 Clerk Boar (5 套電影與歡樂娛樂主題) ──
  cinema: [
    {
      variantId: 'cinema_v0',
      title: '強檔 3D 動畫冒險電影篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '山豬售票員 (Clerk Boar)',
          en: "Welcome to Wild Boar Cinema! Do you want to watch a movie?",
          zh: "歡迎光臨山豬影城！你想看電影嗎？",
          options: [
            { text_en: "Yes! What movie do you have today?", text_zh: "想！今天有什麼電影呢？", target_id: 'movie_leopard' },
            { text_en: "Can I buy movie tickets in the shop?", text_zh: "我可以在商店買電影票嗎？", action: 'OPEN_SHOP' },
            { text_en: "Do you have popcorn and juice?", text_zh: "你們有爆米花和果汁嗎？", target_id: 'movie_list' }
          ]
        },
        movie_leopard: {
          id: 'movie_leopard',
          speaker: '山豬售票員 (Clerk Boar)',
          en: "We have 'The Fast Cloud Leopard'! It is a 3D animal adventure.",
          zh: "我們有《奔跑的雲豹》！這是一部 3D 動物冒險電影。",
          options: [
            { text_en: "Open shop to buy tickets!", text_zh: "開啟商店購買電影票！", action: 'OPEN_SHOP' }
          ]
        },
        movie_list: {
          id: 'movie_list',
          speaker: '山豬售票員 (Clerk Boar)',
          en: "Yes! Popcorn, juice, and tickets are in our shop. Check them out!",
          zh: "有！爆米花、果汁和電影票都在商店裡。來看看吧！",
          options: [
            { text_en: "Let's check the cinema shop!", text_zh: "我們來看看影城商店！", action: 'OPEN_SHOP' }
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
          speaker: '山豬售票員 (Clerk Boar)',
          en: "Before the movie starts, what are the cinema rules?",
          zh: "在電影開始前，電影院有哪些規則呢？",
          options: [
            { text_en: "Be quiet and turn off phones!", text_zh: "保持安靜，把手機關掉！", target_id: 'etiquette_praise' },
            { text_en: "Do not kick the seat in front!", text_zh: "不要踢前面的椅子！", target_id: 'no_kicking' }
          ]
        },
        etiquette_praise: {
          id: 'etiquette_praise',
          speaker: '山豬售票員 (Clerk Boar)',
          en: "Good job! Whispering and quiet popcorn eating makes everyone happy.",
          zh: "做得好！輕聲細語、安靜吃爆米花，讓每個人都享受電影。",
          options: [
            { text_en: "Open shop for snacks!", text_zh: "開啟商店選購觀影點心！", action: 'OPEN_SHOP' },
            { text_en: "I will be very polite!", text_zh: "我會非常有禮貌的！", target_id: 'END' }
          ]
        },
        no_kicking: {
          id: 'no_kicking',
          speaker: '山豬售票員 (Clerk Boar)',
          en: "Exactly! Keep your feet down. You are a super polite movie fan!",
          zh: "沒錯！腳放好不踢前座。你是超級有禮貌的小影迷！",
          options: [
            { text_en: "Thank you, Clerk Boar!", text_zh: "謝謝山豬售票員！", target_id: 'END' }
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
          speaker: '山豬售票員 (Clerk Boar)',
          en: "Mmm, smell the fresh popcorn! What flavor do you like?",
          zh: "嗯～聞聞新鮮爆米花的香味！你喜歡什麼口味呢？",
          options: [
            { text_en: "I like sweet caramel popcorn!", text_zh: "我喜歡甜甜的焦糖爆米花！", target_id: 'popcorn_caramel' },
            { text_en: "Can I buy snacks in the shop?", text_zh: "我可以在商店買點心嗎？", action: 'OPEN_SHOP' }
          ]
        },
        popcorn_caramel: {
          id: 'popcorn_caramel',
          speaker: '山豬售票員 (Clerk Boar)',
          en: "Sweet and crunchy! Share with your friends. Grab a box in the shop!",
          zh: "又甜又脆！和你的朋友一起分享。在商店買一盒吧！",
          options: [
            { text_en: "Open shop for popcorn!", text_zh: "開啟商店買爆米花！", action: 'OPEN_SHOP' }
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
          speaker: '山豬售票員 (Clerk Boar)',
          en: "Look at the poster! 'The Snake Guardian'. Do you like superhero movies?",
          zh: "看這張海報！《百步蛇守護者》。你喜歡超級英雄電影嗎？",
          options: [
            { text_en: "Yes! Can the hero run fast and fly?", text_zh: "喜歡！英雄跑得快又會飛嗎？", target_id: 'hero_preview' },
            { text_en: "Can I buy movie tickets in the shop?", text_zh: "我可以在商店買電影票嗎？", action: 'OPEN_SHOP' }
          ]
        },
        hero_preview: {
          id: 'hero_preview',
          speaker: '山豬售票員 (Clerk Boar)',
          en: "He is fast like the wind and protects the mountain! Very exciting.",
          zh: "他跑得像風一樣快，還守護著大山！非常刺激精彩。",
          options: [
            { text_en: "I want to watch it! Open shop!", text_zh: "我想看這部片！打開商店！", action: 'OPEN_SHOP' }
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
          speaker: '山豬售票員 (Clerk Boar)',
          en: "Who do you like to watch movies with?",
          zh: "你最喜歡跟誰一起看電影呢？",
          options: [
            { text_en: "I watch movies with my family!", text_zh: "我和我的家人一起看電影！", target_id: 'family_movie' },
            { text_en: "I watch movies with my friends!", text_zh: "我和我的好朋友一起看電影！", target_id: 'friends_movie' }
          ]
        },
        family_movie: {
          id: 'family_movie',
          speaker: '山豬售票員 (Clerk Boar)',
          en: "Watching movies with Mom and Dad is so warm and happy!",
          zh: "和爸爸媽媽一起看電影最溫暖、最開心了！",
          options: [
            { text_en: "We love family movie time!", text_zh: "我們最喜歡全家看電影的時間！", target_id: 'END' }
          ]
        },
        friends_movie: {
          id: 'friends_movie',
          speaker: '山豬售票員 (Clerk Boar)',
          en: "Laughing together with friends is the best! Enjoy the show!",
          zh: "和好朋友一起哈哈大笑是最棒的事！好好享受電影吧！",
          options: [
            { text_en: "Thank you, Clerk Boar!", text_zh: "謝謝山豬售票員！", target_id: 'END' }
          ]
        }
      }
    }
  ]
};

const VISITING_TEACHER_VARIANTS = {
  // ── 🌟 1. 客座外師 Mario (熱情陽光美式男外師，5 套動態英語對話) ──
  mario: [
    {
      variantId: 'mario_v0',
      title: '熱情活力相遇與大武山微風篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Hi there! I am Mario from the USA. What is your name?",
          zh: "哈囉！我是來自美國的 Mario 老師。你叫什麼名字？",
          options: [
            { text_en: "Nice to meet you, Teacher Mario!", text_zh: "很高興認識你，Mario 老師！", target_id: 'mario_cheer' },
            { text_en: "Where is the USA?", text_zh: "美國在哪裡呢？", target_id: 'mario_mission' },
            { text_en: "Can I practice English with you?", text_zh: "我可以跟你一起練習英文嗎？", target_id: 'mario_practice' }
          ]
        },
        mario_cheer: {
          id: 'mario_cheer',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Nice to meet you too! Your English pronunciation is awesome. High five!",
          zh: "我也很高興認識你！你的英語發音太讚了。擊掌！",
          options: [
            { text_en: "High five! Let's practice English!", text_zh: "擊掌！我們一起練習英文！", target_id: 'mario_reward' }
          ]
        },
        mario_mission: {
          id: 'mario_mission',
          speaker: '外師 Mario (Teacher Mario)',
          en: "The USA is across the big ocean. But Wutai is my favorite place in Taiwan!",
          zh: "美國在大洋彼岸。但霧臺是我在台灣最喜歡的地方！",
          options: [
            { text_en: "Wutai is great! High five!", text_zh: "霧臺很棒！擊掌！", target_id: 'mario_reward' }
          ]
        },
        mario_practice: {
          id: 'mario_practice',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Yes! Every day we speak English, we learn more words. Let's do it!",
          zh: "好啊！我們每天說英語，就會學到更多單字。一起加油！",
          options: [
            { text_en: "Yes! Words are superpowers!", text_zh: "沒錯！單字就是超能力！", target_id: 'mario_reward' }
          ]
        },
        mario_reward: {
          id: 'mario_reward',
          speaker: '外師 Mario (Teacher Mario)',
          en: "You did great today! Here are your Mario bonus points! Keep talking!",
          zh: "你今天表現得太棒了！這是給你的 Mario 獎勵積分！繼續多開口說話喔！",
          options: [
            { text_en: "Thank you, Teacher Mario! See you!", text_zh: "謝謝 Mario 老師！再見！", action: 'CLAIM_TEACHER_BONUS' }
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
          en: "I love sports! What sport do you like to play?",
          zh: "我熱愛運動！你喜歡做什麼運動呢？",
          options: [
            { text_en: "I like to play basketball!", text_zh: "我喜歡打籃球！", target_id: 'sports_hoops' },
            { text_en: "I like to play soccer!", text_zh: "我喜歡踢足球！", target_id: 'sports_soccer' },
            { text_en: "I like to ride my bicycle!", text_zh: "我喜歡騎腳踏車！", target_id: 'sports_bike' }
          ]
        },
        sports_hoops: {
          id: 'sports_hoops',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Basketball is fun! Dribble, pass, and shoot the ball! Swish!",
          zh: "籃球很好玩！運球、傳球、投籃！進球！",
          options: [
            { text_en: "Teamwork is awesome!", text_zh: "團隊合作太棒了！", target_id: 'mario_reward' }
          ]
        },
        sports_soccer: {
          id: 'sports_soccer',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Kick the soccer ball into the goal! Goooal! Great exercise!",
          zh: "把足球踢進球門！進球～！很棒的運動！",
          options: [
            { text_en: "Let's score goals together!", text_zh: "我們一起踢進更多球！", target_id: 'mario_reward' }
          ]
        },
        sports_bike: {
          id: 'sports_bike',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Riding a bicycle is great! Remember your helmet. Safety first!",
          zh: "騎自行車太讚了！記得戴安全帽，安全第一！",
          options: [
            { text_en: "Safety first! High five!", text_zh: "安全第一！擊掌！", target_id: 'mario_reward' }
          ]
        },
        mario_reward: {
          id: 'mario_reward',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Awesome! Active body, active mind. Here is your bonus!",
          zh: "太棒了！活力滿滿的身體，敏捷聰明的大腦。這是給你的獎勵！",
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
          en: "What is Mario's secret to learning English fast?",
          zh: "學好英語的第一大秘訣是什麼？",
          options: [
            { text_en: "Speak loud and don't be shy!", text_zh: "大聲說，不要害羞！", target_id: 'loud_proud' },
            { text_en: "Make mistakes and try again!", text_zh: "說錯沒關係，再試一次！", target_id: 'mistake_rule' }
          ]
        },
        loud_proud: {
          id: 'loud_proud',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Speak loud and be proud! When you speak loud, your brain remembers!",
          zh: "大聲說、抬頭挺胸！當你大聲說出來，大腦就記住了！",
          options: [
            { text_en: "I am not shy! High five!", text_zh: "我不害羞！擊掌！", target_id: 'mario_reward' }
          ]
        },
        mistake_rule: {
          id: 'mistake_rule',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Mistakes are okay! Every mistake helps you learn. Keep trying!",
          zh: "說錯沒關係的！每一個錯誤都能幫助你學習。繼續加油！",
          options: [
            { text_en: "I will keep trying my best!", text_zh: "我會繼續全力以赴！", target_id: 'mario_reward' }
          ]
        },
        mario_reward: {
          id: 'mario_reward',
          speaker: '外師 Mario (Teacher Mario)',
          en: "You have super courage! Claim your daily bonus points now!",
          zh: "你有超級勇氣！現在就領取你的每日獎勵積分吧！",
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
          en: "I am hungry! What is your favorite food?",
          zh: "我肚子餓了！你最喜歡吃什麼食物？",
          options: [
            { text_en: "I like pizza and hamburgers!", text_zh: "我喜歡披薩和漢堡！", target_id: 'pizza_love' },
            { text_en: "I like wild boar meat and donuts!", text_zh: "我喜歡烤山豬肉和小米甜甜圈！", target_id: 'local_food' },
            { text_en: "I like apples and bananas!", text_zh: "我喜歡蘋果和香蕉！", target_id: 'fruit_love' }
          ]
        },
        pizza_love: {
          id: 'pizza_love',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Yum! Pizza with cheese and big hamburgers! Delicious!",
          zh: "好好吃！滿滿起司的披薩和大漢堡！美味極了！",
          options: [
            { text_en: "Let's share a slice! High five!", text_zh: "我們一人分一塊！擊掌！", target_id: 'mario_reward' }
          ]
        },
        local_food: {
          id: 'local_food',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Millet donuts are sweet, and wild boar meat is tasty! Wutai food is number one!",
          zh: "小米甜甜圈好甜，烤山豬肉好香！霧臺美食天下第一！",
          options: [
            { text_en: "Wutai food is the best!", text_zh: "霧臺美食最棒了！", target_id: 'mario_reward' }
          ]
        },
        fruit_love: {
          id: 'fruit_love',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Fresh fruits! Sweet apples and bananas give you healthy energy!",
          zh: "新鮮水果！甜甜的蘋果和香蕉給你健康滿滿的能量！",
          options: [
            { text_en: "Eating fruit is healthy!", text_zh: "吃水果很健康！", target_id: 'mario_reward' }
          ]
        },
        mario_reward: {
          id: 'mario_reward',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Talking about food makes me happy! Here is your daily reward!",
          zh: "聊美食真開心！這是給你的每日獎勵！",
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
          en: "Can you give me three English words right now?",
          zh: "你現在能馬上說出三個英文單字嗎？",
          options: [
            { text_en: "Yes! Test me, Teacher Mario!", text_zh: "可以！考考我吧，Mario 老師！", target_id: 'mission_accept' },
            { text_en: "Apple, book, and cat!", text_zh: "蘋果、書本和貓咪！", target_id: 'word_ideas' }
          ]
        },
        mission_accept: {
          id: 'mission_accept',
          speaker: '外師 Mario (Teacher Mario)',
          en: "Say: 'Hello! I am a student. I like English!' Can you say it?",
          zh: "說說看：『Hello! I am a student. I like English!』你會說嗎？",
          options: [
            { text_en: "Hello! I am a student! I like English!", text_zh: "哈囉！我是小學生！我喜歡英文！", target_id: 'mario_reward' }
          ]
        },
        word_ideas: {
          id: 'word_ideas',
          speaker: '外師 Mario (Teacher Mario)',
          en: "A is for apple, B is for book, C is for cat! Super job!",
          zh: "A 是蘋果、B 是書本、C 是貓咪！超級棒！",
          options: [
            { text_en: "Those are great words! High five!", text_zh: "這些單字太棒了！擊掌！", target_id: 'mario_reward' }
          ]
        },
        mario_reward: {
          id: 'mario_reward',
          speaker: '外師 Mario (Teacher Mario)',
          en: "You passed Mario's English challenge! Here is your gold bonus!",
          zh: "你通過了 Mario 老師的英語大挑戰！這是給你的黃金獎勵！",
          options: [
            { text_en: "Thank you, Teacher Mario! Bye!", text_zh: "謝謝 Mario 老師！拜拜！", action: 'CLAIM_TEACHER_BONUS' }
          ]
        }
      }
    }
  ],

  // ── 🌸 2. 客座外師 Ibu (溫暖親切部落在地雙語外師，5 套情境對話) ──
  ibu: [
    {
      variantId: 'ibu_v0',
      title: '陽光初遇與魯凱族問候 Sabau 篇',
      startNode: 'welcome',
      nodes: {
        welcome: {
          id: 'welcome',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Hello, my dear! Sabau! Do you know what 'Sabau' means in Rukai?",
          zh: "哈囉，親愛的小朋友！Sabau！你知道魯凱族的『Sabau』是什麼意思嗎？",
          options: [
            { text_en: "It means Hello and Thank you!", text_zh: "它代表『你好』和『謝謝』！", target_id: 'ibu_greet' },
            { text_en: "Where are you from, Teacher Ibu?", text_zh: "Ibu 老師，你來自哪裡呢？", target_id: 'ibu_origin' },
            { text_en: "Can you teach me English and Rukai?", text_zh: "你可以教我英語和魯凱語嗎？", target_id: 'ibu_warm' }
          ]
        },
        ibu_greet: {
          id: 'ibu_greet',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Yes! 'Sabau' is hello, thank you, and well done! A beautiful word.",
          zh: "沒錯！『Sabau』包含著你好、謝謝、辛苦了的意思！是很美麗的話。",
          options: [
            { text_en: "Sabau, Teacher Ibu!", text_zh: "Sabau，Ibu 老師！", target_id: 'ibu_reward' }
          ]
        },
        ibu_origin: {
          id: 'ibu_origin',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "I grew up here in Wutai! I love our mountains and our children.",
          zh: "我在霧臺長大！我深深熱愛我們的大山和這裡的孩子們。",
          options: [
            { text_en: "We love Wutai too!", text_zh: "我們也很喜歡霧臺！", target_id: 'ibu_reward' }
          ]
        },
        ibu_warm: {
          id: 'ibu_warm',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Speak with a smile and listen with your heart. You can learn fast!",
          zh: "帶著微笑說話，用你的心傾聽。你會學得很快的！",
          options: [
            { text_en: "Thank you, Teacher Ibu!", text_zh: "謝謝 Ibu 老師！", target_id: 'ibu_reward' }
          ]
        },
        ibu_reward: {
          id: 'ibu_reward',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Thank you for chatting today! Here is your special bonus reward!",
          zh: "謝謝你今天跟我聊天！這是送給你的特別獎勵積分！",
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
          en: "Look at the flowers around us! What colors do you see?",
          zh: "看看我們身邊的花朵！你看見了什麼顏色？",
          options: [
            { text_en: "I see white lilies and green leaves!", text_zh: "我看見白百合和綠樹葉！", target_id: 'colors_green_white' },
            { text_en: "I see the blue sky and yellow sun!", text_zh: "我看見藍色的天空和黃色的太陽！", target_id: 'colors_sky_sun' }
          ]
        },
        colors_green_white: {
          id: 'colors_green_white',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "White and green! White is pure, and green is full of life.",
          zh: "白色和綠色！白色象徵純潔，綠色充滿生機。",
          options: [
            { text_en: "Nature is so pretty!", text_zh: "大自然好漂亮！", target_id: 'ibu_reward' }
          ]
        },
        colors_sky_sun: {
          id: 'colors_sky_sun',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Yellow brings warmth, and blue brings peace. Beautiful colors!",
          zh: "黃色帶來溫暖，藍色帶來平靜。多麼美麗的顏色！",
          options: [
            { text_en: "I love sunny days!", text_zh: "我喜歡晴天！", target_id: 'ibu_reward' }
          ]
        },
        ibu_reward: {
          id: 'ibu_reward',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "You see the beauty of nature! Here are your bonus points!",
          zh: "你看見了大自然的美麗！這是給你的獎勵積分！",
          options: [
            { text_en: "Thank you, Teacher Ibu! Have a great day!", text_zh: "謝謝 Ibu 老師！祝老師有美好的一天！", action: 'CLAIM_TEACHER_BONUS' }
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
          en: "Hello, sunshine! How do you feel today?",
          zh: "哈囉，小太陽！你今天感覺怎麼樣呢？",
          options: [
            { text_en: "I feel very happy today!", text_zh: "我今天感覺非常快樂！", target_id: 'feel_happy' },
            { text_en: "I feel calm and quiet.", text_zh: "我覺得很平靜、很放鬆。", target_id: 'feel_calm' },
            { text_en: "I was a little nervous before.", text_zh: "我剛剛原本有一點點緊張。", target_id: 'feel_relieved' }
          ]
        },
        feel_happy: {
          id: 'feel_happy',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Your smile is bright! When you smile, everyone smiles with you.",
          zh: "你的微笑好燦爛！當你微笑時，大家也會跟著開心。",
          options: [
            { text_en: "Smiles make us happy!", text_zh: "微笑讓我們都快樂！", target_id: 'ibu_reward' }
          ]
        },
        feel_calm: {
          id: 'feel_calm',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "A calm heart is peaceful. You can listen and learn so well.",
          zh: "平靜的心最舒服。這樣你能聽得清楚、學得很好。",
          options: [
            { text_en: "Thank you, Teacher Ibu!", text_zh: "謝謝 Ibu 老師！", target_id: 'ibu_reward' }
          ]
        },
        feel_relieved: {
          id: 'feel_relieved',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Don't worry! You are safe and loved here. Take a gentle breath.",
          zh: "別擔心！在這裡你很安全、大家都很愛你。輕輕深呼吸一下。",
          options: [
            { text_en: "I feel warm and safe now! Thank you!", text_zh: "我現在感覺心裡暖暖的安全了！謝謝老師！", target_id: 'ibu_reward' }
          ]
        },
        ibu_reward: {
          id: 'ibu_reward',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "You shared your feelings bravely! Here is your reward bonus!",
          zh: "你勇敢分享了你的心情！這是給你的獎勵積分！",
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
          en: "Do you know what a dog says in English?",
          zh: "你知道小狗在英文裡是怎麼叫的嗎？",
          options: [
            { text_en: "A dog says 'Woof-woof'!", text_zh: "小狗叫『Woof-woof』！", target_id: 'dog_sound' },
            { text_en: "What does a bird say?", text_zh: "小鳥是怎麼叫的呢？", target_id: 'bird_sound' }
          ]
        },
        dog_sound: {
          id: 'dog_sound',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Yes! Woof-woof! And what about a cat? Cats say 'Meow-meow'!",
          zh: "沒錯！Woof-woof！那小貓呢？小貓叫『Meow-meow』！",
          options: [
            { text_en: "Meow-meow! Cats are cute!", text_zh: "喵喵！貓咪好可愛！", target_id: 'ibu_reward' }
          ]
        },
        bird_sound: {
          id: 'bird_sound',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Birds say 'Tweet-tweet'! Tweet-tweet in the tall trees!",
          zh: "小鳥會叫『Tweet-tweet』！在高大的樹上啾啾唱著歌！",
          options: [
            { text_en: "Tweet-tweet! I like singing birds!", text_zh: "啾啾！我喜歡唱歌的小鳥！", target_id: 'ibu_reward' }
          ]
        },
        ibu_reward: {
          id: 'ibu_reward',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "You know animal sounds so well! Here is your bonus!",
          zh: "你很熟悉動物的叫聲呢！這是給你的獎勵積分！",
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
          en: "What do you want to be when you grow up?",
          zh: "你長大後想成為什麼樣的人呢？",
          options: [
            { text_en: "I want to be an explorer!", text_zh: "我想成為探險家！", target_id: 'dream_explorer' },
            { text_en: "I want to be a teacher or doctor!", text_zh: "我想當老師或醫生！", target_id: 'dream_helper' },
            { text_en: "I want to be an artist!", text_zh: "我想成為藝術家！", target_id: 'dream_artist' }
          ]
        },
        dream_explorer: {
          id: 'dream_explorer',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "The world is big and wonderful! English will help you explore.",
          zh: "世界好大又好精彩！英語會幫助你探索世界。",
          options: [
            { text_en: "I will study hard and explore!", text_zh: "我會認真學習去探險！", target_id: 'ibu_reward' }
          ]
        },
        dream_helper: {
          id: 'dream_helper',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Helping people is so kind! You have a golden heart.",
          zh: "幫助別人太善良了！你有一顆金子般的心。",
          options: [
            { text_en: "Kindness is important!", text_zh: "善良很重要！", target_id: 'ibu_reward' }
          ]
        },
        dream_artist: {
          id: 'dream_artist',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Paint your dreams with bright colors! Art makes people smile.",
          zh: "用明亮的色彩畫出你的夢想！藝術讓人們展露笑容。",
          options: [
            { text_en: "I love painting!", text_zh: "我喜歡畫畫！", target_id: 'ibu_reward' }
          ]
        },
        ibu_reward: {
          id: 'ibu_reward',
          speaker: '外師 Ibu (Teacher Ibu)',
          en: "Believe in yourself! Your dreams will come true. Here is your bonus!",
          zh: "相信自己！你的夢想一定會實現。這是給你的獎勵積分！",
          options: [
            { text_en: "Thank you so much, Teacher Ibu! Sabau!", text_zh: "非常謝謝 Ibu 老師！Sabau！", action: 'CLAIM_TEACHER_BONUS' }
          ]
        }
      }
    }
  ]
};

// Generate townDialogueData.js file
const fileHeader = `/**
 * 霧臺英語宇宙 2.0 - 霧臺小鎮 50 套完整對話樹資料庫 (CEFR Pre-A1 / 108 課綱優化版)
 * 涵蓋 8 大生活地標角色 + 2 位客座外師，每個角色均擁有 5 套適合國小全年級的生動主題對話樹！
 * 嚴格符合 Pre-A1 基礎核心句型 (STARTERS) 與國小生活對話，高頻單字、句構精準、朗朗上口。
 */

`;

const code = fileHeader +
  'export const DIALOGUE_VARIANTS = ' + JSON.stringify(DIALOGUE_VARIANTS, null, 2) + ';\n\n' +
  'export const VISITING_TEACHER_VARIANTS = ' + JSON.stringify(VISITING_TEACHER_VARIANTS, null, 2) + ';\n';

const outPath = path.resolve(__dirname, '../src/games/town/townDialogueData.js');
fs.writeFileSync(outPath, code, 'utf-8');
console.log('Successfully wrote Pre-A1 dialogues to', outPath);
