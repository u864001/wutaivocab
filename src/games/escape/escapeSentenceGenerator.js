// ── 密室逃脫：教學級英漢語句與語意分類生成引擎 ──
// 確保護航：全冊全單字 100% 生成語法正確、語義自然、適合國小學生的優質閱讀句型與詞序重組題

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

export function cleanZh(zh) {
  if (!zh) return '';
  return zh.split('、')[0].split('(')[0].split('（')[0].trim();
}

export function getIndefiniteArticle(word) {
  if (!word) return 'a';
  const first = word.trim().toLowerCase()[0];
  return VOWELS.has(first) ? 'an' : 'a';
}

// ── 特殊文法詞、片語與邊界單字專屬字典 (100% 訂製教學句子) ──
export const SPECIAL_WORD_DICT = {
  // 過去式助動詞與副詞 (Book 8)
  'was': {
    category: 'past_verb',
    cloze: { prompt: "He ___ at the park yesterday morning.", zh: "他昨天早晨在公園【是/在】。", voice: "He was at the park yesterday morning." },
    order: { tokens: ['He', 'was', 'at', 'home'], zh: "他昨天在家。" }
  },
  'were': {
    category: 'past_verb',
    cloze: { prompt: "They ___ very happy at the party.", zh: "他們在聚會上非常【是/感到】高興。", voice: "They were very happy at the party." },
    order: { tokens: ['We', 'were', 'very', 'happy'], zh: "我們感到非常快樂。" }
  },
  'did': {
    category: 'past_verb',
    cloze: { prompt: "What ___ you do last weekend?", zh: "你上個週末【做】了什麼？", voice: "What did you do last weekend?" },
    order: { tokens: ['What', 'did', 'you', 'do'], zh: "你做了什麼事？" }
  },
  'yesterday': {
    category: 'time_adverb',
    cloze: { prompt: "It rained heavily all day ___.", zh: "【昨天】一整天都下著大雨。", voice: "It rained heavily all day yesterday." },
    order: { tokens: ['I', 'saw', 'him', 'yesterday'], zh: "我昨天看見了他。" }
  },
  'last': {
    category: 'time_adverb',
    cloze: { prompt: "We visited our grandma ___ Sunday.", zh: "我們【上個】星期天去拜訪了祖母。", voice: "We visited our grandma last Sunday." },
    order: { tokens: ['We', 'met', 'last', 'night'], zh: "我們昨晚碰面了。" }
  },
  'night': {
    category: 'time_adverb',
    cloze: { prompt: "The stars shine brightly in the dark ___.", zh: "星星在漆黑的【夜晚】閃爍發光。", voice: "The stars shine brightly in the dark night." },
    order: { tokens: ['Stars', 'shine', 'at', 'night'], zh: "星星在夜晚閃耀。" }
  },
  'how much': {
    category: 'question_phrase',
    cloze: { prompt: "Excuse me, ___ is this red apple?", zh: "請問這顆紅蘋果要【多少錢】？", voice: "Excuse me, how much is this red apple?" },
    order: { tokens: ['How much', 'is', 'the', 'book'], zh: "這本書要多少錢？" }
  },
  'dollar': {
    category: 'currency',
    cloze: { prompt: "The pencil costs one ___ at the store.", zh: "這枝鉛筆在文具店賣一【元】。", voice: "The pencil costs one dollar at the store." },
    order: { tokens: ['It', 'is', 'one', 'dollar'], zh: "它是一元。" }
  },
  'favorite': {
    category: 'adjective',
    cloze: { prompt: "Summer is my ___ season of the year.", zh: "夏天是我一年當中最【特別喜愛】的季節。", voice: "Summer is my favorite season of the year." },
    order: { tokens: ['Blue', 'is', 'my', 'favorite', 'color'], zh: "藍色是我最喜歡的顏色。" }
  },
  'how many': {
    category: 'question_phrase',
    cloze: { prompt: "___ books do you have in your bag?", zh: "你的書包裡有【多少】本書？", voice: "How many books do you have in your bag?" },
    order: { tokens: ['How many', 'dogs', 'do', 'you', 'see'], zh: "你看到多少隻狗？" }
  },
  'would like': {
    category: 'verb_phrase',
    cloze: { prompt: "I ___ a cup of warm water, please.", zh: "我【想要】一杯溫水，謝謝。", voice: "I would like a cup of warm water, please." },
    order: { tokens: ['I', 'would like', 'some', 'water'], zh: "我想要一些水。" }
  },
  'please': {
    category: 'polite_word',
    cloze: { prompt: "Could you pass me the salt, ___?", zh: "能把鹽遞給我嗎，【請/拜託】？", voice: "Could you pass me the salt, please?" },
    order: { tokens: ['Open', 'your', 'book', 'please'], zh: "請打開你的書本。" }
  },
  'whose': {
    category: 'question_word',
    cloze: { prompt: "___ red pencil is this on the floor?", zh: "地上這枝紅鉛筆是【誰的】？", voice: "Whose red pencil is this on the floor?" },
    order: { tokens: ['Whose', 'pencil', 'is', 'this'], zh: "這是誰的鉛筆？" }
  },
  'wrong': {
    category: 'adjective',
    cloze: { prompt: "What is ___ with your left hand?", zh: "你的左手怎麼了/有什麼【不對勁】嗎？", voice: "What is wrong with your left hand?" },
    order: { tokens: ['What', 'is', 'wrong', 'today'], zh: "今天怎麼了？" }
  },
  'hurt': {
    category: 'verb',
    cloze: { prompt: "My legs ___ after running a long race.", zh: "長跑之後，我的雙腿好【疼痛】。", voice: "My legs hurt after running a long race." },
    order: { tokens: ['My', 'arms', 'hurt', 'today'], zh: "我的手臂今天很痛。" }
  },
  'from': {
    category: 'preposition',
    cloze: { prompt: "Where are you ___? I am from Taiwan.", zh: "你【來自】哪裡？我來自台灣。", voice: "Where are you from? I am from Taiwan." },
    order: { tokens: ['Where', 'are', 'you', 'from'], zh: "你來自哪裡？" }
  },
  'in': {
    category: 'preposition',
    cloze: { prompt: "The cat is sleeping ___ the big box.", zh: "小貓正在大箱子【裡面】睡覺。", voice: "The cat is sleeping in the big box." },
    order: { tokens: ['The', 'cat', 'is', 'in', 'the', 'box'], zh: "小貓在箱子裡。" }
  },
  'on': {
    category: 'preposition',
    cloze: { prompt: "The book is ___ the wooden desk.", zh: "書本在木頭書桌【上面】。", voice: "The book is on the wooden desk." },
    order: { tokens: ['The', 'book', 'is', 'on', 'the', 'desk'], zh: "書本在書桌上。" }
  },
  'under': {
    category: 'preposition',
    cloze: { prompt: "The puppy is hiding ___ the green chair.", zh: "小狗正躲在綠色椅子【下面】。", voice: "The puppy is hiding under the green chair." },
    order: { tokens: ['The', 'dog', 'is', 'under', 'the', 'chair'], zh: "狗在椅子下面。" }
  },
  'by': {
    category: 'preposition',
    cloze: { prompt: "Sit ___ the window and enjoy the sunshine.", zh: "坐在窗戶【旁邊】，享受溫暖陽光。", voice: "Sit by the window and enjoy the sunshine." },
    order: { tokens: ['Sit', 'by', 'the', 'tree'], zh: "坐在大樹旁邊。" }
  },
  'where': {
    category: 'question_word',
    cloze: { prompt: "___ is my new English notebook?", zh: "我的新英文筆記本在【哪裡】？", voice: "Where is my new English notebook?" },
    order: { tokens: ['Where', 'is', 'my', 'book'], zh: "我的書在哪裡？" }
  },
  'who': {
    category: 'question_word',
    cloze: { prompt: "___ is that tall girl in the front?", zh: "前面那個高個子女孩是【誰】？", voice: "Who is that tall girl in the front?" },
    order: { tokens: ['Who', 'is', 'that', 'boy'], zh: "那個男孩是誰？" }
  },
  'what': {
    category: 'question_word',
    cloze: { prompt: "___ is your name? My name is Leo.", zh: "你的名字是【什麼】？我叫里歐。", voice: "What is your name? My name is Leo." },
    order: { tokens: ['What', 'is', 'your', 'name'], zh: "你叫什麼名字？" }
  },
  'this': {
    category: 'demonstrative',
    cloze: { prompt: "___ is my favorite toy robot.", zh: "【這個】是我最喜愛的玩具機器人。", voice: "This is my favorite toy robot." },
    order: { tokens: ['This', 'is', 'my', 'cat'], zh: "這是我的貓。" }
  },
  'that': {
    category: 'demonstrative',
    cloze: { prompt: "___ is a tall tree over there.", zh: "那邊【那個】是一棵高大的樹。", voice: "That is a tall tree over there." },
    order: { tokens: ['That', 'is', 'a', 'big', 'dog'], zh: "那是一隻大狗。" }
  },
  'these': {
    category: 'demonstrative',
    cloze: { prompt: "___ are sweet red apples on the table.", zh: "桌上【這些】是香甜的紅蘋果。", voice: "These are sweet red apples on the table." },
    order: { tokens: ['These', 'are', 'sweet', 'apples'], zh: "這些是甜蘋果。" }
  },
  'those': {
    category: 'demonstrative',
    cloze: { prompt: "___ are colorful birds in the sky.", zh: "天空中的【那些】是五彩斑斕的鳥兒。", voice: "Those are colorful birds in the sky." },
    order: { tokens: ['Those', 'are', 'big', 'trees'], zh: "那些是大樹。" }
  },
  'some': {
    category: 'determiner',
    cloze: { prompt: "May I have ___ fresh orange juice, please?", zh: "我可以喝【一些】新鮮柳橙汁嗎？", voice: "May I have some fresh orange juice, please?" },
    order: { tokens: ['I', 'want', 'some', 'juice'], zh: "我想要一些果汁。" }
  },
  'can': {
    category: 'modal_verb',
    cloze: { prompt: "Birds ___ fly high in the blue sky.", zh: "鳥兒【能夠/會】在藍天中高高飛翔。", voice: "Birds can fly high in the blue sky." },
    order: { tokens: ['I', 'can', 'swim', 'fast'], zh: "我會游得很快。" }
  },
  'do': {
    category: 'verb',
    cloze: { prompt: "What do you ___ after school every day?", zh: "你每天放學後都【做】什麼？", voice: "What do you do after school every day?" },
    order: { tokens: ['What', 'can', 'you', 'do'], zh: "你能做什麼？" }
  },
  'have': {
    category: 'verb',
    cloze: { prompt: "I ___ a cute little puppy at home.", zh: "我家裡【有】一隻可愛的小狗。", voice: "I have a cute little puppy at home." },
    order: { tokens: ['I', 'have', 'two', 'pencils'], zh: "我有兩枝鉛筆。" }
  },
  'has': {
    category: 'verb',
    cloze: { prompt: "She ___ two big and bright eyes.", zh: "她【有】一雙又大又明亮的眼睛。", voice: "She has two big and bright eyes." },
    order: { tokens: ['She', 'has', 'a', 'cute', 'cat'], zh: "她有一隻可愛的貓。" }
  },
  'like': {
    category: 'verb',
    cloze: { prompt: "Kids ___ to eat sweet ice cream.", zh: "小朋友們【喜歡】吃甜甜的冰淇淋。", voice: "Kids like to eat sweet ice cream." },
    order: { tokens: ['I', 'like', 'sweet', 'apples'], zh: "我喜歡甜蘋果。" }
  },
  'want': {
    category: 'verb',
    cloze: { prompt: "I ___ to drink some cold water.", zh: "我【想要】喝一些冰涼的水。", voice: "I want to drink some cold water." },
    order: { tokens: ['I', 'want', 'some', 'water'], zh: "我想要一些水。" }
  },
  'eat': {
    category: 'verb',
    cloze: { prompt: "Monkeys ___ sweet yellow bananas.", zh: "猴子們【吃】香甜的黃香蕉。", voice: "Monkeys eat sweet yellow bananas." },
    order: { tokens: ['We', 'eat', 'dinner', 'together'], zh: "我們一起吃晚餐。" }
  },
  'go': {
    category: 'verb',
    cloze: { prompt: "Let us ___ to the library to read.", zh: "讓我們【去】圖書館看書吧。", voice: "Let us go to the library to read." },
    order: { tokens: ['Let', 'us', 'go', 'home'], zh: "讓我們回家吧。" }
  },
  'yes': {
    category: 'response',
    cloze: { prompt: "Are you ready? ___, I am ready!", zh: "你準備好了嗎？【是的】，我準備好了！", voice: "Are you ready? Yes, I am ready!" },
    order: { tokens: ['Yes', 'I', 'can', 'swim'], zh: "是的，我會游泳。" }
  },
  'no': {
    category: 'response',
    cloze: { prompt: "Is this your book? ___, it is not mine.", zh: "這是你的書嗎？【不】，這不是我的。", voice: "Is this your book? No, it is not mine." },
    order: { tokens: ['No', 'it', 'is', 'not'], zh: "不，不是的。" }
  },
  'not': {
    category: 'adverb',
    cloze: { prompt: "The little cat is ___ afraid of water.", zh: "那隻小貓【並非/不】害怕水。", voice: "The little cat is not afraid of water." },
    order: { tokens: ['I', 'am', 'not', 'sad'], zh: "我並不傷心。" }
  },
  'a': {
    category: 'article',
    cloze: { prompt: "I can see ___ bird singing in the tree.", zh: "我看見【一隻】鳥兒在樹上歌唱。", voice: "I can see a bird singing in the tree." },
    order: { tokens: ['This', 'is', 'a', 'pen'], zh: "這是一枝筆。" }
  },
  'it': {
    category: 'pronoun',
    cloze: { prompt: "Look at the puppy! ___ is very cute.", zh: "看那隻小狗！【牠】非常可愛。", voice: "Look at the puppy! It is very cute." },
    order: { tokens: ['It', 'is', 'very', 'cute'], zh: "牠非常可愛。" }
  },
  'i': {
    category: 'pronoun',
    cloze: { prompt: "___ am a happy student at Wutai School.", zh: "【我】是霧臺國小的一名快樂學生。", voice: "I am a happy student at Wutai School." },
    order: { tokens: ['I', 'am', 'a', 'student'], zh: "我是一名學生。" }
  },
  'you': {
    category: 'pronoun',
    cloze: { prompt: "How old are ___? I am nine.", zh: "【你】今年幾歲？我九歲。", voice: "How old are you? I am nine." },
    order: { tokens: ['How', 'are', 'you', 'today'], zh: "你今天好嗎？" }
  },
  'he': {
    category: 'pronoun',
    cloze: { prompt: "___ is my tall and strong brother.", zh: "【他】是我高大又強壯的哥哥。", voice: "He is my tall and strong brother." },
    order: { tokens: ['He', 'is', 'my', 'brother'], zh: "他是我的哥哥。" }
  },
  'she': {
    category: 'pronoun',
    cloze: { prompt: "___ is a wonderful teacher in our school.", zh: "【她】是我們學校一位極好的老師。", voice: "She is a wonderful teacher in our school." },
    order: { tokens: ['She', 'is', 'my', 'sister'], zh: "她是我的妹妹。" }
  },
  'my': {
    category: 'possessive',
    cloze: { prompt: "This is ___ favorite blue backpack.", zh: "這是【我的】最喜愛的藍色背包。", voice: "This is my favorite blue backpack." },
    order: { tokens: ['This', 'is', 'my', 'book'], zh: "這是我的書。" }
  },
  'your': {
    category: 'possessive',
    cloze: { prompt: "Please open ___ English book to page ten.", zh: "請打開【你的】英文書到第十頁。", voice: "Please open your English book to page ten." },
    order: { tokens: ['Show', 'me', 'your', 'pencil'], zh: "給我看你的鉛筆。" }
  },
  'am': {
    category: 'be_verb',
    cloze: { prompt: "I ___ so happy to see you today.", zh: "我今天看見你【感到】好高興。", voice: "I am so happy to see you today." },
    order: { tokens: ['I', 'am', 'very', 'happy'], zh: "我非常快樂。" }
  },
  'is': {
    category: 'be_verb',
    cloze: { prompt: "The sun ___ shining bright and warm.", zh: "太陽【正】照耀得溫暖明亮。", voice: "The sun is shining bright and warm." },
    order: { tokens: ['It', 'is', 'sunny', 'today'], zh: "今天天氣晴朗。" }
  },
  'are': {
    category: 'be_verb',
    cloze: { prompt: "We ___ good friends forever.", zh: "我們永遠【是】好朋友。", voice: "We are good friends forever." },
    order: { tokens: ['We', 'are', 'good', 'friends'], zh: "我們是好朋友。" }
  },
  'name': {
    category: 'noun',
    cloze: { prompt: "My ___ is Tony and I am ten.", zh: "我的【名字】是東尼，我十歲。", voice: "My name is Tony and I am ten." },
    order: { tokens: ['My', 'name', 'is', 'Tony'], zh: "我的名字叫東尼。" }
  },
  'year': {
    category: 'noun',
    cloze: { prompt: "Happy New ___ to everyone!", zh: "祝大家新【年】快樂！", voice: "Happy New Year to everyone!" },
    order: { tokens: ['Happy', 'New', 'Year', 'friends'], zh: "朋友們新年快樂。" }
  },
  'how old': {
    category: 'question_phrase',
    cloze: { prompt: "___ are you? I am ten years old.", zh: "你【幾歲】呢？我十歲。", voice: "How old are you? I am ten years old." },
    order: { tokens: ['How old', 'are', 'you', 'now'], zh: "你現在幾歲？" }
  },
  'color': {
    category: 'noun',
    cloze: { prompt: "What is your favorite ___? I like blue.", zh: "你最喜愛的【顏色】是什麼？我喜歡藍色。", voice: "What is your favorite color? I like blue." },
    order: { tokens: ['Blue', 'is', 'my', 'color'], zh: "藍色是我的顏色。" }
  },
  'time': {
    category: 'noun',
    cloze: { prompt: "What ___ is it? It is three o'clock.", zh: "現在【時間】是幾點？現在三點了。", voice: "What time is it? It is three o'clock." },
    order: { tokens: ['What', 'time', 'is', 'it'], zh: "現在幾點鐘？" }
  },
  'weather': {
    category: 'noun',
    cloze: { prompt: "What is the ___ like today? It is sunny.", zh: "今天的【天氣】如何？今天陽光普照。", voice: "What is the weather like today? It is sunny." },
    order: { tokens: ['The', 'weather', 'is', 'sunny'], zh: "天氣很晴朗。" }
  },
  'season': {
    category: 'noun',
    cloze: { prompt: "Spring is a beautiful and warm ___.", zh: "春天是一個美麗溫暖的【季節】。", voice: "Spring is a beautiful and warm season." },
    order: { tokens: ['Spring', 'is', 'my', 'favorite', 'season'], zh: "春天是我最喜歡的季節。" }
  },
  'weekend': {
    category: 'noun',
    cloze: { prompt: "Have a wonderful and fun ___ with family!", zh: "和家人度過一個美好的【週末】吧！", voice: "Have a wonderful and fun weekend with family!" },
    order: { tokens: ['Have', 'a', 'great', 'weekend'], zh: "週末愉快。" }
  },
  'free time': {
    category: 'noun',
    cloze: { prompt: "What do you do in your ___? I read books.", zh: "你在【休閒時間】都做些什麼？我看書。", voice: "What do you do in your free time? I read books." },
    order: { tokens: ['I', 'read', 'in', 'free time'], zh: "我在休閒時間閱讀。" }
  },
  'class': {
    category: 'noun',
    cloze: { prompt: "Please listen quietly in English ___.", zh: "在英語【課】上請安靜聆聽。", voice: "Please listen quietly in English class." },
    order: { tokens: ['We', 'have', 'English', 'class'], zh: "我們在上英語課。" }
  },
  'road': {
    category: 'noun',
    cloze: { prompt: "Look both ways before crossing the ___.", zh: "穿越【馬路】之前要看左右兩邊。", voice: "Look both ways before crossing the road." },
    order: { tokens: ['Cross', 'the', 'road', 'safely'], zh: "安全穿越馬路。" }
  },
  'street': {
    category: 'noun',
    cloze: { prompt: "There are busy cars on the city ___.", zh: "城市【街道】上有繁忙的車輛。", voice: "There are busy cars on the city street." },
    order: { tokens: ['Walk', 'on', 'the', 'street'], zh: "走在街道上。" }
  },
  'basketball': {
    category: 'sports',
    cloze: { prompt: "We like to play ___ on the school court.", zh: "我們喜歡在學校球場上打【籃球】。", voice: "We like to play basketball on the school court." },
    order: { tokens: ['We', 'play', 'basketball', 'together'], zh: "我們一起打籃球。" }
  },
  'soccer': {
    category: 'sports',
    cloze: { prompt: "He can kick the ___ into the goal.", zh: "他能將【足球】踢進球門中。", voice: "He can kick the soccer into the goal." },
    order: { tokens: ['He', 'plays', 'soccer', 'well'], zh: "他足球踢得很好。" }
  },
  'heart': {
    category: 'symbol',
    cloze: { prompt: "Draw a warm red ___ on the Mother's Day card.", zh: "在母親節卡片上畫一顆溫暖的紅【心】。", voice: "Draw a warm red heart on the Mother's Day card." },
    order: { tokens: ['Draw', 'a', 'red', 'heart'], zh: "畫一顆紅心。" }
  },
  'love': {
    category: 'feeling_verb',
    cloze: { prompt: "I ___ my wonderful family very much.", zh: "我非常【愛】我美好的家庭。", voice: "I love my wonderful family very much." },
    order: { tokens: ['I', 'love', 'my', 'family'], zh: "我愛我的家人。" }
  },
  'easter': {
    category: 'festival',
    cloze: { prompt: "Children search for colorful eggs during ___.", zh: "孩子們在【復活節】期間尋找彩蛋。", voice: "Children search for colorful eggs during Easter." },
    order: { tokens: ['We', 'celebrate', 'Easter', 'happily'], zh: "我們快樂地慶祝復活節。" }
  },
  'christmas tree': {
    category: 'festival',
    cloze: { prompt: "We decorated the sparkling ___ with shiny lights.", zh: "我們用閃亮的燈飾裝飾【聖誕樹】。", voice: "We decorated the sparkling Christmas tree with shiny lights." },
    order: { tokens: ['Look', 'at', 'the', 'Christmas tree'], zh: "看那棵聖誕樹。" }
  }
};

const NUMBER_WORDS = new Set([
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
  'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four', 'twenty-five', 'twenty-six', 'twenty-seven', 'twenty-eight', 'twenty-nine', 'thirty',
  'thirty-five', 'forty', 'forty-five', 'fifty', 'fifty-five', 'sixty', 'seventy', 'eighty', 'ninety',
  'one hundred', 'two hundred', 'three hundred', 'four hundred', 'five hundred', 'six hundred', 'seven hundred', 'eight hundred', 'nine hundred', 'one thousand'
]);

const ANIMALS = new Set([
  'cat', 'dog', 'bird', 'fish', 'elephant', 'lion', 'tiger', 'monkey', 'bear', 'zebra', 'turtle', 'koala',
  'rabbit', 'horse', 'bat', 'spider', 'duck', 'cow', 'pig', 'sheep', 'bunny', 'frog', 'butterfly', 'jade rabbit'
]);

const COUNTABLE_FRUITS = new Set([
  'apple', 'banana', 'grape', 'orange', 'watermelon', 'pomelo'
]);

const COUNTABLE_FOOD = new Set([
  'hot dog', 'hamburger', 'sandwich', 'moon cake', 'candy cane', 'zongzi'
]);

const DRINKS_LIQUIDS = new Set([
  'juice', 'milk', 'water', 'tea', 'soup'
]);

const UNCOUNTABLE_FOOD = new Set([
  'cake', 'pizza', 'rice', 'bread', 'chicken', 'salad', 'ice cream', 'noodles'
]);

const MEALS = new Set([
  'breakfast', 'lunch', 'dinner'
]);

const COLORS = new Set([
  'red', 'blue', 'yellow', 'green', 'black', 'white', 'pink', 'purple', 'brown'
]);

const FEELINGS = new Set([
  'happy', 'sad', 'angry', 'tired', 'hungry', 'thirsty', 'full', 'sick', 'good', 'fine'
]);

const WEATHER_ADJ = new Set([
  'sunny', 'rainy', 'cloudy', 'windy', 'hot', 'warm', 'cool', 'cold', 'dry', 'wet', 'foggy', 'snowy'
]);

const SEASONS = new Set([
  'spring', 'summer', 'fall', 'winter'
]);

const FAMILY = new Set([
  'father', 'mother', 'brother', 'sister', 'grandfather', 'grandmother', 'dad', 'mom', 'boy', 'girl', 'friend'
]);

const JOBS = new Set([
  'teacher', 'student', 'doctor', 'nurse', 'cook', 'driver'
]);

const BODY_PLURAL = new Set([
  'eyes', 'ears', 'hands', 'arms', 'legs', 'feet'
]);

const BODY_SINGULAR = new Set([
  'nose', 'mouth', 'foot'
]);

const CLOTHES_PLURAL = new Set([
  'jeans', 'pants', 'shorts', 'shoes', 'glasses'
]);

const CLOTHES_SINGULAR = new Set([
  'coat', 'dress', 'hat', 'jacket', 'skirt', 't-shirt', 'cap', 'stocking'
]);

const ROOMS = new Set([
  'bathroom', 'bedroom', 'dining room', 'living room', 'kitchen', 'yard'
]);

const PUBLIC_PLACES = new Set([
  'bank', 'bookstore', 'hospital', 'library', 'museum', 'park', 'post office', 'supermarket',
  'zoo', 'restaurant', 'mall', 'movie theater', 'station', 'cinema', 'school', 'classroom'
]);

const COUNTRIES = new Set([
  'australia', 'india', 'japan', 'singapore', 'spain', 'taiwan', 'the uk', 'the usa'
]);

const SUBJECTS = new Set([
  'art', 'chinese', 'english', 'math', 'music', 'pe', 'science', 'social studies'
]);

const DAYS_OF_WEEK = new Set([
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'today'
]);

const ILLNESSES = new Set([
  'cold', 'fever', 'runny nose', 'sore throat', 'headache', 'toothache', 'stomachache'
]);

const ACTION_VERBS = new Set([
  'dance', 'draw', 'jump', 'read', 'sing', 'swim', 'write', 'run', 'walk', 'fly', 'climb', 'sleep'
]);

const NATURE_ITEMS = new Set([
  'mountain', 'river', 'flower', 'star', 'tree', 'sun', 'moon', 'leaf', 'stone', 'grass'
]);

const SIZE_AGE_ADJ = new Set([
  'big', 'small', 'tall', 'short', 'new', 'old'
]);

const CLASSROOM_ITEMS = new Set([
  'book', 'pen', 'pencil', 'eraser', 'ruler', 'marker', 'desk', 'chair', 'bag', 'backpack',
  'computer', 'table', 'lunchbox', 'umbrella', 'waterbottle', 'workbook', 'bell', 'box', 'basket', 'card', 'gift', 'sachet'
]);

const FESTIVAL_CHARACTERS = new Set([
  'santa claus', 'chang-o', 'witch', 'vampire', 'ghost', 'pumpkin'
]);

/**
 * 取得單字語意分類代碼
 */
export function getWordSemanticCategory(word) {
  if (!word || !word.en) return 'general_noun';
  const lowerEn = word.en.trim().toLowerCase();

  if (SPECIAL_WORD_DICT[lowerEn]) return SPECIAL_WORD_DICT[lowerEn].category;
  if (lowerEn.startsWith('by ') || lowerEn === 'on foot') return 'transport';
  if (lowerEn.startsWith('at ')) return 'past_places';
  if (lowerEn.startsWith('cleaned ') || lowerEn.startsWith('listened ') || lowerEn.startsWith('played ') || lowerEn.startsWith('walked ') || lowerEn.startsWith('watched ') || lowerEn.startsWith('visited ')) return 'past_activities';
  if (lowerEn.endsWith('ing')) return 'activities_ing';
  if (lowerEn.includes(' ') && (lowerEn.startsWith('play ') || lowerEn.startsWith('ride ') || lowerEn.startsWith('study ') || lowerEn.startsWith('surf ') || lowerEn.startsWith('watch ') || lowerEn.startsWith('go ') || lowerEn.startsWith('listen ') || lowerEn.startsWith('get ') || lowerEn.startsWith('have ') || lowerEn.startsWith('do ') || lowerEn.startsWith('take ') || lowerEn.startsWith('stand ') || lowerEn.startsWith('dragon '))) return 'routine_phrase';

  if (COUNTRIES.has(lowerEn)) return 'countries';
  if (NUMBER_WORDS.has(lowerEn)) return 'numbers';
  if (ANIMALS.has(lowerEn)) return 'animals';
  if (COUNTABLE_FRUITS.has(lowerEn)) return 'fruits';
  if (COUNTABLE_FOOD.has(lowerEn)) return 'foods_countable';
  if (DRINKS_LIQUIDS.has(lowerEn)) return 'drinks';
  if (UNCOUNTABLE_FOOD.has(lowerEn)) return 'foods_uncountable';
  if (MEALS.has(lowerEn)) return 'meals';
  if (COLORS.has(lowerEn)) return 'colors';
  if (FEELINGS.has(lowerEn)) return 'feelings';
  if (WEATHER_ADJ.has(lowerEn)) return 'weather';
  if (SEASONS.has(lowerEn)) return 'seasons';
  if (FAMILY.has(lowerEn)) return 'family';
  if (JOBS.has(lowerEn)) return 'jobs';
  if (BODY_PLURAL.has(lowerEn)) return 'body_plural';
  if (BODY_SINGULAR.has(lowerEn)) return 'body_singular';
  if (CLOTHES_PLURAL.has(lowerEn)) return 'clothes_plural';
  if (CLOTHES_SINGULAR.has(lowerEn)) return 'clothes_singular';
  if (ROOMS.has(lowerEn)) return 'rooms';
  if (PUBLIC_PLACES.has(lowerEn)) return 'places';
  if (SUBJECTS.has(lowerEn)) return 'subjects';
  if (DAYS_OF_WEEK.has(lowerEn)) return 'days';
  if (ILLNESSES.has(lowerEn)) return 'illnesses';
  if (ACTION_VERBS.has(lowerEn)) return 'verbs';
  if (NATURE_ITEMS.has(lowerEn)) return 'nature';
  if (SIZE_AGE_ADJ.has(lowerEn)) return 'adjectives';
  if (CLASSROOM_ITEMS.has(lowerEn)) return 'classroom';
  if (FESTIVAL_CHARACTERS.has(lowerEn)) return 'festival';

  return 'general_noun';
}

/**
 * 核心：為任意單字生成教學級無違和 Cloze (克漏字) 題目資料
 */
export function generatePedagogicalCloze(targetWord) {
  const en = (targetWord.en || '').trim();
  const lowerEn = en.toLowerCase();
  const zh = cleanZh(targetWord.zh);

  // 1. 特殊單字客製化
  if (SPECIAL_WORD_DICT[lowerEn]) {
    const s = SPECIAL_WORD_DICT[lowerEn];
    return {
      category: s.category,
      englishPrompt: s.cloze.prompt,
      chineseClue: s.cloze.zh,
      voiceText: s.cloze.voice
    };
  }

  // 2. 交通方式片語
  if (lowerEn.startsWith('by ') || lowerEn === 'on foot') {
    return {
      category: 'transport',
      englishPrompt: `Students go to school ___ every morning.`,
      chineseClue: `學生們每天早晨【${zh}】去上學。`,
      voiceText: `Students go to school ${en} every morning.`
    };
  }

  // 3. 過去地點片語
  if (lowerEn.startsWith('at ')) {
    return {
      category: 'past_places',
      englishPrompt: `We were having fun ___ yesterday afternoon.`,
      chineseClue: `昨天下午我們【${zh}】玩得很開心。`,
      voiceText: `We were having fun ${en} yesterday afternoon.`
    };
  }

  // 4. 過去動作片語
  if (lowerEn.startsWith('cleaned ') || lowerEn.startsWith('listened ') || lowerEn.startsWith('played ') || lowerEn.startsWith('walked ') || lowerEn.startsWith('watched ') || lowerEn.startsWith('visited ')) {
    return {
      category: 'past_activities',
      englishPrompt: `Yesterday afternoon, I stayed home and ___ happily.`,
      chineseClue: `昨天下午我待在家裡，開心地【${zh}】。`,
      voiceText: `Yesterday afternoon, I stayed home and ${en} happily.`
    };
  }

  // 5. 進行式動作 -ing
  if (lowerEn.endsWith('ing')) {
    return {
      category: 'activities_ing',
      englishPrompt: `The boy is ___ in his room right now.`,
      chineseClue: `那個男孩現在正在房間裡【${zh}】。`,
      voiceText: `The boy is ${en} in his room right now.`
    };
  }

  // 6. 動詞片語 / 日常活動
  if (lowerEn.includes(' ') && (lowerEn.startsWith('play ') || lowerEn.startsWith('ride ') || lowerEn.startsWith('study ') || lowerEn.startsWith('surf ') || lowerEn.startsWith('watch ') || lowerEn.startsWith('go ') || lowerEn.startsWith('listen ') || lowerEn.startsWith('get ') || lowerEn.startsWith('have ') || lowerEn.startsWith('do ') || lowerEn.startsWith('take ') || lowerEn.startsWith('stand ') || lowerEn.startsWith('dragon '))) {
    return {
      category: 'routine_phrase',
      englishPrompt: `After school, we like to ___ with our friends.`,
      chineseClue: `放學後，我們喜歡和朋友一起【${zh}】。`,
      voiceText: `After school, we like to ${en} with our friends.`
    };
  }

  // 7. 國家
  if (COUNTRIES.has(lowerEn)) {
    return {
      category: 'countries',
      englishPrompt: `My good pen pal comes from ___ and loves tea.`,
      chineseClue: `我的筆友來自【${zh}】，而且很喜歡茶。`,
      voiceText: `My good pen pal comes from ${en} and loves tea.`
    };
  }

  // 8. 數字
  if (NUMBER_WORDS.has(lowerEn)) {
    return {
      category: 'numbers',
      englishPrompt: `There are ___ bright stars in the night sky.`,
      chineseClue: `夜空中看得到【${zh}】顆明亮的星星。`,
      voiceText: `There are ${en} bright stars in the night sky.`
    };
  }

  // 9. 動物
  if (ANIMALS.has(lowerEn)) {
    return {
      category: 'animals',
      englishPrompt: `Look at that cute ___ sleeping under the green tree.`,
      chineseClue: `看那隻在綠樹下睡覺的可愛【${zh}】。`,
      voiceText: `Look at that cute ${en} sleeping under the green tree.`
    };
  }

  // 10. 可數水果
  if (COUNTABLE_FRUITS.has(lowerEn)) {
    return {
      category: 'fruits',
      englishPrompt: `I eat a sweet and fresh ___ for my snack.`,
      chineseClue: `我吃了一顆香甜新鮮的【${zh}】當點心。`,
      voiceText: `I eat a sweet and fresh ${en} for my snack.`
    };
  }

  // 11. 可數食物
  if (COUNTABLE_FOOD.has(lowerEn)) {
    return {
      category: 'foods_countable',
      englishPrompt: `Mom prepared a delicious ___ for our picnic today.`,
      chineseClue: `媽媽今天為我們的野餐準備了一個美味的【${zh}】。`,
      voiceText: `Mom prepared a delicious ${en} for our picnic today.`
    };
  }

  // 12. 飲品液體
  if (DRINKS_LIQUIDS.has(lowerEn)) {
    return {
      category: 'drinks',
      englishPrompt: `Please drink some fresh ___ when you feel thirsty.`,
      chineseClue: `口渴時，請喝一些新鮮的【${zh}】。`,
      voiceText: `Please drink some fresh ${en} when you feel thirsty.`
    };
  }

  // 13. 不可數美食
  if (UNCOUNTABLE_FOOD.has(lowerEn)) {
    return {
      category: 'foods_uncountable',
      englishPrompt: `We had warm and delicious ___ for dinner tonight.`,
      chineseClue: `我們今晚享用了溫暖美味的【${zh}】當晚餐。`,
      voiceText: `We had warm and delicious ${en} for dinner tonight.`
    };
  }

  // 14. 三餐
  if (MEALS.has(lowerEn)) {
    return {
      category: 'meals',
      englishPrompt: `We eat a healthy and balanced ___ every single day.`,
      chineseClue: `我們每天都吃健康均衡的【${zh}】。`,
      voiceText: `We eat a healthy and balanced ${en} every single day.`
    };
  }

  // 15. 顏色
  if (COLORS.has(lowerEn)) {
    return {
      category: 'colors',
      englishPrompt: `The pretty little bird has bright ___ feathers.`,
      chineseClue: `那隻美麗的小鳥長著明亮【${zh}】的羽毛。`,
      voiceText: `The pretty little bird has bright ${en} feathers.`
    };
  }

  // 16. 心情與感受
  if (FEELINGS.has(lowerEn)) {
    return {
      category: 'feelings',
      englishPrompt: `I feel so ___ after having fun with my classmates.`,
      chineseClue: `和同學們一起玩耍後，我感到好【${zh}】。`,
      voiceText: `I feel so ${en} after having fun with my classmates.`
    };
  }

  // 17. 天氣形容詞
  if (WEATHER_ADJ.has(lowerEn)) {
    return {
      category: 'weather',
      englishPrompt: `It is a very ___ and pleasant day outside today.`,
      chineseClue: `今天外面是一個非常【${zh}】且舒適的好天氣。`,
      voiceText: `It is a very ${en} and pleasant day outside today.`
    };
  }

  // 18. 季節
  if (SEASONS.has(lowerEn)) {
    return {
      category: 'seasons',
      englishPrompt: `The weather is always pleasant and warm in ___.`,
      chineseClue: `在【${zh}】時天氣總是怡人又溫暖。`,
      voiceText: `The weather is always pleasant and warm in ${en}.`
    };
  }

  // 19. 家庭成員
  if (FAMILY.has(lowerEn)) {
    return {
      category: 'family',
      englishPrompt: `My ___ is smiling warmly and telling me a bedtime story.`,
      chineseClue: `我的【${zh}】正溫暖地微笑著，並給我講睡前故事。`,
      voiceText: `My ${en} is smiling warmly and telling me a bedtime story.`
    };
  }

  // 20. 職業
  if (JOBS.has(lowerEn)) {
    return {
      category: 'jobs',
      englishPrompt: `She works diligently every day as a helpful ___.`,
      chineseClue: `她每天都作為一名樂於助人的【${zh}】認真工作。`,
      voiceText: `She works diligently every day as a helpful ${en}.`
    };
  }

  // 21. 複數身體部位
  if (BODY_PLURAL.has(lowerEn)) {
    return {
      category: 'body_plural',
      englishPrompt: `Please wash your ___ before having lunch at school.`,
      chineseClue: `在學校吃午餐之前，請先洗淨你的【${zh}】。`,
      voiceText: `Please wash your ${en} before having lunch at school.`
    };
  }

  // 22. 單數身體部位
  if (BODY_SINGULAR.has(lowerEn)) {
    return {
      category: 'body_singular',
      englishPrompt: `Gently touch your ___ with your clean finger.`,
      chineseClue: `用你乾淨的手指輕輕觸碰你的【${zh}】。`,
      voiceText: `Gently touch your ${en} with your clean finger.`
    };
  }

  // 23. 複數衣物
  if (CLOTHES_PLURAL.has(lowerEn)) {
    return {
      category: 'clothes_plural',
      englishPrompt: `He puts on his clean blue ___ to go to school.`,
      chineseClue: `他穿上整潔的藍色【${zh}】去上學。`,
      voiceText: `He puts on his clean blue ${en} to go to school.`
    };
  }

  // 24. 單數衣物
  if (CLOTHES_SINGULAR.has(lowerEn)) {
    return {
      category: 'clothes_singular',
      englishPrompt: `Remember to wear your warm ___ when it is chilly.`,
      chineseClue: `天氣轉涼時，記得穿上你保暖的【${zh}】。`,
      voiceText: `Remember to wear your warm ${en} when it is chilly.`
    };
  }

  // 25. 居家房間
  if (ROOMS.has(lowerEn)) {
    return {
      category: 'rooms',
      englishPrompt: `Mom is making dinner in the ___ right now.`,
      chineseClue: `媽媽現在正在【${zh}】做晚餐。`,
      voiceText: `Mom is making dinner in the ${en} right now.`
    };
  }

  // 26. 公共場所
  if (PUBLIC_PLACES.has(lowerEn)) {
    return {
      category: 'places',
      englishPrompt: `We can borrow and read great books from the ___.`,
      chineseClue: `我們可以去【${zh}】借閱很棒的書本。`,
      voiceText: `We can borrow and read great books from the ${en}.`
    };
  }

  // 27. 學校科目
  if (SUBJECTS.has(lowerEn)) {
    return {
      category: 'subjects',
      englishPrompt: `We have an interesting and active ___ class on Monday.`,
      chineseClue: `我們在星期一有一堂生動有趣的【${zh}】課。`,
      voiceText: `We have an interesting and active ${en} class on Monday.`
    };
  }

  // 28. 星期日程
  if (DAYS_OF_WEEK.has(lowerEn)) {
    return {
      category: 'days',
      englishPrompt: `We do not need to attend school on ___.`,
      chineseClue: `我們在【${zh}】不需要到學校上課。`,
      voiceText: `We do not need to attend school on ${en}.`
    };
  }

  // 29. 症狀疾病
  if (ILLNESSES.has(lowerEn)) {
    return {
      category: 'illnesses',
      englishPrompt: `The poor child has a painful ___ and must rest.`,
      chineseClue: `可憐的孩子得了難受的【${zh}】，必須好好休息。`,
      voiceText: `The poor child has a painful ${en} and must rest.`
    };
  }

  // 30. 一般動作動詞
  if (ACTION_VERBS.has(lowerEn)) {
    return {
      category: 'verbs',
      englishPrompt: `Children can ___ happily together during the recess.`,
      chineseClue: `下課時間小朋友們可以一起開心地【${zh}】。`,
      voiceText: `Children can ${en} happily together during the recess.`
    };
  }

  // 31. 自然景物
  if (NATURE_ITEMS.has(lowerEn)) {
    return {
      category: 'nature',
      englishPrompt: `We can see a majestic ___ towering in the landscape.`,
      chineseClue: `我們能看見壯麗的【${zh}】聳立在大自然中。`,
      voiceText: `We can see a majestic ${en} towering in the landscape.`
    };
  }

  // 32. 體型與新舊形容詞
  if (SIZE_AGE_ADJ.has(lowerEn)) {
    return {
      category: 'adjectives',
      englishPrompt: `The friendly elephant is surprisingly ___ and gentle.`,
      chineseClue: `那隻友善的大象非常【${zh}】而且溫柔。`,
      voiceText: `The friendly elephant is surprisingly ${en} and gentle.`
    };
  }

  // 33. 學校文具用品
  if (CLASSROOM_ITEMS.has(lowerEn)) {
    return {
      category: 'classroom',
      englishPrompt: `Please place your useful ___ on the wooden desk.`,
      chineseClue: `請把實用的【${zh}】放在木頭書桌上。`,
      voiceText: `Please place your useful ${en} on the wooden desk.`
    };
  }

  // 34. 節慶人物
  if (FESTIVAL_CHARACTERS.has(lowerEn)) {
    return {
      category: 'festival',
      englishPrompt: `Children love the cheerful story of ___ during the holiday.`,
      chineseClue: `在節日裡，孩子們最喜歡聽關於【${zh}】的歡樂故事。`,
      voiceText: `Children love the cheerful story of ${en} during the holiday.`
    };
  }

  // 35. 終極保底：高品質通用句型
  return {
    category: 'general_noun',
    englishPrompt: `We discovered a special sign for ___ in our adventure.`,
    chineseClue: `在這次探險中，我們發現了代表【${zh}】的特別印記。`,
    voiceText: `We discovered a special sign for ${en} in our adventure.`
  };
}

/**
 * 核心：為任意單字生成教學級無違和 Sentence Order (句子重組) 題目資料
 */
export function generatePedagogicalSentenceOrder(targetWord) {
  const en = (targetWord.en || '').trim();
  const lowerEn = en.toLowerCase();
  const zh = cleanZh(targetWord.zh);

  // 1. 特殊單字專屬重組
  if (SPECIAL_WORD_DICT[lowerEn]) {
    const s = SPECIAL_WORD_DICT[lowerEn];
    return {
      tokens: s.order.tokens,
      zh: s.order.zh
    };
  }

  // 2. 交通方式
  if (lowerEn.startsWith('by ') || lowerEn === 'on foot') {
    return {
      tokens: ['We', 'go', 'to', 'school', en],
      zh: `我們${zh}去上學。`
    };
  }

  // 3. 過去地點
  if (lowerEn.startsWith('at ')) {
    return {
      tokens: ['We', 'were', en, 'yesterday'],
      zh: `我們昨天${zh}。`
    };
  }

  // 4. 過去活動
  if (lowerEn.startsWith('cleaned ') || lowerEn.startsWith('listened ') || lowerEn.startsWith('played ') || lowerEn.startsWith('walked ') || lowerEn.startsWith('watched ') || lowerEn.startsWith('visited ')) {
    return {
      tokens: ['Yesterday', 'I', en],
      zh: `昨天我${zh}。`
    };
  }

  // 5. 進行式
  if (lowerEn.endsWith('ing')) {
    return {
      tokens: ['He', 'is', en, 'now'],
      zh: `他現在正在${zh}。`
    };
  }

  // 6. 日常片語
  if (lowerEn.includes(' ') && (lowerEn.startsWith('play ') || lowerEn.startsWith('ride ') || lowerEn.startsWith('study ') || lowerEn.startsWith('surf ') || lowerEn.startsWith('watch ') || lowerEn.startsWith('go ') || lowerEn.startsWith('listen ') || lowerEn.startsWith('get ') || lowerEn.startsWith('have ') || lowerEn.startsWith('do ') || lowerEn.startsWith('take ') || lowerEn.startsWith('stand ') || lowerEn.startsWith('dragon '))) {
    return {
      tokens: ['I', 'like', 'to', en],
      zh: `我喜歡${zh}。`
    };
  }

  // 7. 國家
  if (COUNTRIES.has(lowerEn)) {
    return {
      tokens: ['She', 'comes', 'from', en],
      zh: `她來自${zh}。`
    };
  }

  // 8. 數字
  if (NUMBER_WORDS.has(lowerEn)) {
    return {
      tokens: ['I', 'have', en, 'books'],
      zh: `我有${zh}本書。`
    };
  }

  // 9. 動物
  if (ANIMALS.has(lowerEn)) {
    return {
      tokens: ['Look', 'at', 'the', 'cute', en],
      zh: `看那隻可愛的${zh}。`
    };
  }

  // 10. 水果
  if (COUNTABLE_FRUITS.has(lowerEn)) {
    return {
      tokens: ['I', 'want', 'a', 'sweet', en],
      zh: `我想要一顆甜${zh}。`
    };
  }

  // 11. 可數食物
  if (COUNTABLE_FOOD.has(lowerEn)) {
    return {
      tokens: ['Mom', 'made', 'a', 'tasty', en],
      zh: `媽媽做了一個好吃的${zh}。`
    };
  }

  // 12. 飲品
  if (DRINKS_LIQUIDS.has(lowerEn)) {
    return {
      tokens: ['I', 'drink', 'some', en],
      zh: `我喝了一些${zh}。`
    };
  }

  // 13. 不可數食物
  if (UNCOUNTABLE_FOOD.has(lowerEn)) {
    return {
      tokens: ['We', 'like', 'to', 'eat', en],
      zh: `我們喜歡吃${zh}。`
    };
  }

  // 14. 三餐
  if (MEALS.has(lowerEn)) {
    return {
      tokens: ['I', 'eat', en, 'with', 'family'],
      zh: `我和家人一起吃${zh}。`
    };
  }

  // 15. 顏色
  if (COLORS.has(lowerEn)) {
    return {
      tokens: ['I', 'like', 'the', en, 'car'],
      zh: `我喜歡那輛${zh}的車。`
    };
  }

  // 16. 心情
  if (FEELINGS.has(lowerEn)) {
    return {
      tokens: ['We', 'feel', 'very', en],
      zh: `我們感到很${zh}。`
    };
  }

  // 17. 天氣
  if (WEATHER_ADJ.has(lowerEn)) {
    return {
      tokens: ['It', 'is', en, 'today'],
      zh: `今天天氣很${zh}。`
    };
  }

  // 18. 季節
  if (SEASONS.has(lowerEn)) {
    return {
      tokens: ['I', 'love', 'the', en],
      zh: `我喜愛${zh}。`
    };
  }

  // 19. 家庭
  if (FAMILY.has(lowerEn)) {
    return {
      tokens: ['My', en, 'is', 'very', 'kind'],
      zh: `我的${zh}非常親切。`
    };
  }

  // 20. 職業
  if (JOBS.has(lowerEn)) {
    return {
      tokens: ['He', 'is', 'a', 'great', en],
      zh: `他是一位棒極了的${zh}。`
    };
  }

  // 21. 複數身體
  if (BODY_PLURAL.has(lowerEn)) {
    return {
      tokens: ['Wash', 'your', en, 'well'],
      zh: `把你的${zh}洗乾淨。`
    };
  }

  // 22. 單數身體
  if (BODY_SINGULAR.has(lowerEn)) {
    return {
      tokens: ['Touch', 'your', en, 'gently'],
      zh: `輕輕碰碰你的${zh}。`
    };
  }

  // 23. 複數衣物
  if (CLOTHES_PLURAL.has(lowerEn)) {
    return {
      tokens: ['He', 'wears', 'blue', en],
      zh: `他穿著藍色的${zh}。`
    };
  }

  // 24. 單數衣物
  if (CLOTHES_SINGULAR.has(lowerEn)) {
    return {
      tokens: ['Put', 'on', 'your', en],
      zh: `穿上你的${zh}。`
    };
  }

  // 25. 房間
  if (ROOMS.has(lowerEn)) {
    return {
      tokens: ['Dad', 'is', 'in', 'the', en],
      zh: `爸爸正在${zh}裡面。`
    };
  }

  // 26. 地點
  if (PUBLIC_PLACES.has(lowerEn)) {
    return {
      tokens: ['Let', 'us', 'visit', 'the', en],
      zh: `讓我們一起去${zh}。`
    };
  }

  // 27. 科目
  if (SUBJECTS.has(lowerEn)) {
    return {
      tokens: ['I', 'like', 'my', en, 'class'],
      zh: `我喜歡我的${zh}課。`
    };
  }

  // 28. 星期
  if (DAYS_OF_WEEK.has(lowerEn)) {
    return {
      tokens: ['Today', 'is', 'a', 'fine', en],
      zh: `今天是個美好的${zh}。`
    };
  }

  // 29. 症狀
  if (ILLNESSES.has(lowerEn)) {
    return {
      tokens: ['He', 'has', 'a', 'bad', en],
      zh: `他患了嚴重的${zh}。`
    };
  }

  // 30. 動詞
  if (ACTION_VERBS.has(lowerEn)) {
    return {
      tokens: ['I', 'can', en, 'very', 'well'],
      zh: `我可以${zh}得很好。`
    };
  }

  // 31. 自然景物
  if (NATURE_ITEMS.has(lowerEn)) {
    return {
      tokens: ['Look', 'at', 'that', 'pretty', en],
      zh: `看那美麗的${zh}。`
    };
  }

  // 32. 體型形容詞
  if (SIZE_AGE_ADJ.has(lowerEn)) {
    return {
      tokens: ['The', 'dog', 'is', 'very', en],
      zh: `這隻狗非常${zh}。`
    };
  }

  // 33. 文具課堂物品
  if (CLASSROOM_ITEMS.has(lowerEn)) {
    return {
      tokens: ['This', 'is', 'my', 'new', en],
      zh: `這是我的新${zh}。`
    };
  }

  // 34. 節慶人物
  if (FESTIVAL_CHARACTERS.has(lowerEn)) {
    return {
      tokens: ['We', 'saw', 'a', 'friendly', en],
      zh: `我們看見了一位親切的${zh}。`
    };
  }

  // 35. 通用名詞保底
  return {
    tokens: ['This', 'is', 'a', 'special', en],
    zh: `這是一個特別的${zh}。`
  };
}
