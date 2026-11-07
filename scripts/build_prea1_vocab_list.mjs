import fs from 'node:fs';
import path from 'node:path';

// Pre-A1 官方核心 200 詞 (涵蓋教育部 Pre-A1 考綱與 Here We Go Books 1-8)
const CORE_200 = [
  // 1. 數字與時間 (Numbers & Time - 18 words)
  { word: 'one', pos: 'num.', phonics: '/wʌn/', zh: '一', cat: 'numbers_time', ex: 'I have one blue pen.' },
  { word: 'two', pos: 'num.', phonics: '/tuː/', zh: '二', cat: 'numbers_time', ex: 'There are two red apples.' },
  { word: 'three', pos: 'num.', phonics: '/θriː/', zh: '三', cat: 'numbers_time', ex: 'I see three little birds.' },
  { word: 'four', pos: 'num.', phonics: '/fɔːr/', zh: '四', cat: 'numbers_time', ex: 'A car has four wheels.' },
  { word: 'five', pos: 'num.', phonics: '/faɪv/', zh: '五', cat: 'numbers_time', ex: 'She has five crayons.' },
  { word: 'six', pos: 'num.', phonics: '/sɪks/', zh: '六', cat: 'numbers_time', ex: 'Peter is six years old.' },
  { word: 'seven', pos: 'num.', phonics: '/ˈsev.ən/', zh: '七', cat: 'numbers_time', ex: 'There are seven days in a week.' },
  { word: 'eight', pos: 'num.', phonics: '/eɪt/', zh: '八', cat: 'numbers_time', ex: 'We meet at eight o\'clock.' },
  { word: 'nine', pos: 'num.', phonics: '/naɪn/', zh: '九', cat: 'numbers_time', ex: 'He has nine storybooks.' },
  { word: 'ten', pos: 'num.', phonics: '/ten/', zh: '十', cat: 'numbers_time', ex: 'Count from one to ten.' },
  { word: 'morning', pos: 'n.', phonics: '/ˈmɔːr.nɪŋ/', zh: '早晨；上午', cat: 'numbers_time', ex: 'Good morning, teacher!' },
  { word: 'afternoon', pos: 'n.', phonics: '/ˌæf.tɚˈnuːn/', zh: '下午', cat: 'numbers_time', ex: 'Good afternoon, class.' },
  { word: 'night', pos: 'n.', phonics: '/naɪt/', zh: '夜晚', cat: 'numbers_time', ex: 'Good night, Mom and Dad.' },
  { word: 'Sunday', pos: 'n.', phonics: '/ˈsʌn.deɪ/', zh: '星期日', cat: 'numbers_time', ex: 'We go to church on Sunday.' },
  { word: 'Saturday', pos: 'n.', phonics: '/ˈsæt̬.ɚ.deɪ/', zh: '星期六', cat: 'numbers_time', ex: 'I play soccer on Saturday.' },
  { word: 'weekend', pos: 'n.', phonics: '/ˈwiːk.end/', zh: '週末', cat: 'numbers_time', ex: 'Have a nice weekend!' },
  { word: 'time', pos: 'n.', phonics: '/taɪm/', zh: '時間', cat: 'numbers_time', ex: 'What time is it now?' },
  { word: 'clock', pos: 'n.', phonics: '/klɑːk/', zh: '時鐘', cat: 'numbers_time', ex: 'Look at the round clock.' },

  // 2. 顏色與特徵形容詞 (Colors & Attributes - 20 words)
  { word: 'red', pos: 'adj./n.', phonics: '/red/', zh: '紅色的；紅色', cat: 'colors_appearance', ex: 'I like red apples.' },
  { word: 'blue', pos: 'adj./n.', phonics: '/bluː/', zh: '藍色的；藍色', cat: 'colors_appearance', ex: 'The sky is very blue.' },
  { word: 'yellow', pos: 'adj./n.', phonics: '/ˈjel.oʊ/', zh: '黃色的；黃色', cat: 'colors_appearance', ex: 'She has a yellow hat.' },
  { word: 'green', pos: 'adj./n.', phonics: '/ɡriːn/', zh: '綠色的；綠色', cat: 'colors_appearance', ex: 'The grass is fresh and green.' },
  { word: 'orange', pos: 'adj./n.', phonics: '/ˈɔːr.ɪndʒ/', zh: '橘色的；橘子', cat: 'colors_appearance', ex: 'He is wearing an orange shirt.' },
  { word: 'pink', pos: 'adj./n.', phonics: '/pɪŋk/', zh: '粉紅色的', cat: 'colors_appearance', ex: 'Jenny has a pink bag.' },
  { word: 'purple', pos: 'adj./n.', phonics: '/ˈpɝː.pəl/', zh: '紫色的', cat: 'colors_appearance', ex: 'These are purple grapes.' },
  { word: 'black', pos: 'adj./n.', phonics: '/blæk/', zh: '黑色的', cat: 'colors_appearance', ex: 'The cat is black and small.' },
  { word: 'white', pos: 'adj./n.', phonics: '/waɪt/', zh: '白色的', cat: 'colors_appearance', ex: 'He wears white socks.' },
  { word: 'brown', pos: 'adj./n.', phonics: '/braʊn/', zh: '棕色的；咖啡色的', cat: 'colors_appearance', ex: 'A big brown bear is sleeping.' },
  { word: 'big', pos: 'adj.', phonics: '/bɪɡ/', zh: '大的', cat: 'colors_appearance', ex: 'The elephant is very big.' },
  { word: 'small', pos: 'adj.', phonics: '/smɑːl/', zh: '小的', cat: 'colors_appearance', ex: 'A mouse is very small.' },
  { word: 'tall', pos: 'adj.', phonics: '/tɑːl/', zh: '高的', cat: 'colors_appearance', ex: 'My brother is very tall.' },
  { word: 'short', pos: 'adj.', phonics: '/ʃɔːrt/', zh: '矮的；短的', cat: 'colors_appearance', ex: 'This ruler is very short.' },
  { word: 'long', pos: 'adj.', phonics: '/lɑːŋ/', zh: '長的', cat: 'colors_appearance', ex: 'The train is very long.' },
  { word: 'happy', pos: 'adj.', phonics: '/ˈhæp.i/', zh: '快樂的', cat: 'colors_appearance', ex: 'The children look happy.' },
  { word: 'sad', pos: 'adj.', phonics: '/sæd/', zh: '難過的', cat: 'colors_appearance', ex: 'Why is the puppy sad?' },
  { word: 'hot', pos: 'adj.', phonics: '/hɑːt/', zh: '炎熱的；燙的', cat: 'colors_appearance', ex: 'Summer in Taiwan is hot.' },
  { word: 'cold', pos: 'adj.', phonics: '/koʊld/', zh: '寒冷的；冰的', cat: 'colors_appearance', ex: 'Winter in the mountains is cold.' },
  { word: 'warm', pos: 'adj.', phonics: '/wɔːrm/', zh: '溫暖的', cat: 'colors_appearance', ex: 'Put on your warm coat.' },

  // 3. 動物世界 (Animals - 20 words)
  { word: 'dog', pos: 'n.', phonics: '/dɑːɡ/', zh: '狗', cat: 'animals', ex: 'The friendly dog wags its tail.' },
  { word: 'cat', pos: 'n.', phonics: '/kæt/', zh: '貓', cat: 'animals', ex: 'Cookie is a cute white cat.' },
  { word: 'rabbit', pos: 'n.', phonics: '/ˈræb.ɪt/', zh: '兔子', cat: 'animals', ex: 'The rabbit hops quickly.' },
  { word: 'bear', pos: 'n.', phonics: '/ber/', zh: '熊', cat: 'animals', ex: 'We saw a black bear in the zoo.' },
  { word: 'bird', pos: 'n.', phonics: '/bɝːd/', zh: '鳥', cat: 'animals', ex: 'A little bird sings in the tree.' },
  { word: 'duck', pos: 'n.', phonics: '/dʌk/', zh: '鴨子', cat: 'animals', ex: 'Three yellow ducks swim in the pond.' },
  { word: 'pig', pos: 'n.', phonics: '/pɪɡ/', zh: '豬', cat: 'animals', ex: 'The pink pig is eating.' },
  { word: 'fish', pos: 'n.', phonics: '/fɪʃ/', zh: '魚', cat: 'animals', ex: 'Goldfish swim in the water.' },
  { word: 'elephant', pos: 'n.', phonics: '/ˈel.ə.fənt/', zh: '大象', cat: 'animals', ex: 'The elephant has a long nose.' },
  { word: 'monkey', pos: 'n.', phonics: '/ˈmʌŋ.ki/', zh: '猴子', cat: 'animals', ex: 'The monkey climbs the tree.' },
  { word: 'tiger', pos: 'n.', phonics: '/ˈtaɪ.ɡɚ/', zh: '老虎', cat: 'animals', ex: 'The tiger runs very fast.' },
  { word: 'lion', pos: 'n.', phonics: '/ˈlaɪ.ən/', zh: '獅子', cat: 'animals', ex: 'The lion roars loudly.' },
  { word: 'horse', pos: 'n.', phonics: '/hɔːrs/', zh: '馬', cat: 'animals', ex: 'He can ride a brown horse.' },
  { word: 'sheep', pos: 'n.', phonics: '/ʃiːp/', zh: '綿羊', cat: 'animals', ex: 'White sheep eat green grass.' },
  { word: 'cow', pos: 'n.', phonics: '/kaʊ/', zh: '乳牛', cat: 'animals', ex: 'The cow gives fresh milk.' },
  { word: 'frog', pos: 'n.', phonics: '/frɑːɡ/', zh: '青蛙', cat: 'animals', ex: 'The green frog jumps high.' },
  { word: 'snake', pos: 'n.', phonics: '/sneɪk/', zh: '百步蛇；蛇', cat: 'animals', ex: 'The snake rests on the stone.' },
  { word: 'mouse', pos: 'n.', phonics: '/maʊs/', zh: '老鼠', cat: 'animals', ex: 'The small mouse hides under the bed.' },
  { word: 'spider', pos: 'n.', phonics: '/ˈspaɪ.dɚ/', zh: '蜘蛛', cat: 'animals', ex: 'A spider makes a round web.' },
  { word: 'hippo', pos: 'n.', phonics: '/ˈhɪp.oʊ/', zh: '河馬', cat: 'animals', ex: 'The hippo stays in the river.' },

  // 4. 校園生活與文具 (School & Stationery - 18 words)
  { word: 'school', pos: 'n.', phonics: '/skuːl/', zh: '學校', cat: 'school_stationery', ex: 'We walk to school together.' },
  { word: 'teacher', pos: 'n.', phonics: '/ˈtiː.tʃɚ/', zh: '老師', cat: 'school_stationery', ex: 'Our English teacher is kind.' },
  { word: 'student', pos: 'n.', phonics: '/ˈstuː.dənt/', zh: '學生', cat: 'school_stationery', ex: 'Andy is a smart student.' },
  { word: 'book', pos: 'n.', phonics: '/bʊk/', zh: '書本', cat: 'school_stationery', ex: 'I read an English story book.' },
  { word: 'pen', pos: 'n.', phonics: '/pen/', zh: '原子筆', cat: 'school_stationery', ex: 'Can I borrow your blue pen?' },
  { word: 'pencil', pos: 'n.', phonics: '/ˈpen.səl/', zh: '鉛筆', cat: 'school_stationery', ex: 'Write your name with a pencil.' },
  { word: 'eraser', pos: 'n.', phonics: '/ɪˈreɪ.sɚ/', zh: '橡皮擦', cat: 'school_stationery', ex: 'Use an eraser to fix mistakes.' },
  { word: 'ruler', pos: 'n.', phonics: '/ˈruː.lɚ/', zh: '尺', cat: 'school_stationery', ex: 'Measure the line with a ruler.' },
  { word: 'desk', pos: 'n.', phonics: '/desk/', zh: '書桌', cat: 'school_stationery', ex: 'Clean your desk before class.' },
  { word: 'chair', pos: 'n.', phonics: '/tʃer/', zh: '椅子', cat: 'school_stationery', ex: 'Please sit on the chair.' },
  { word: 'bag', pos: 'n.', phonics: '/bæɡ/', zh: '書包；袋子', cat: 'school_stationery', ex: 'Put your books into your bag.' },
  { word: 'computer', pos: 'n.', phonics: '/kəmˈpjuː.t̬ɚ/', zh: '電腦', cat: 'school_stationery', ex: 'We study in the computer room.' },
  { word: 'blackboard', pos: 'n.', phonics: '/ˈblæk.bɔːrd/', zh: '黑板', cat: 'school_stationery', ex: 'Look at the teacher on the blackboard.' },
  { word: 'crayon', pos: 'n.', phonics: '/ˈkreɪ.ɑːn/', zh: '蠟筆', cat: 'school_stationery', ex: 'Color the rainbow with crayons.' },
  { word: 'glue', pos: 'n.', phonics: '/ɡluː/', zh: '膠水', cat: 'school_stationery', ex: 'Paste the paper with glue.' },
  { word: 'scissors', pos: 'n.', phonics: '/ˈsɪz.ɚz/', zh: '剪刀', cat: 'school_stationery', ex: 'Be careful when using scissors.' },
  { word: 'paper', pos: 'n.', phonics: '/ˈpeɪ.pɚ/', zh: '紙張', cat: 'school_stationery', ex: 'Draw a tree on white paper.' },
  { word: 'box', pos: 'n.', phonics: '/bɑːks/', zh: '盒子；箱子', cat: 'school_stationery', ex: 'Put the toys into the box.' },

  // 5. 美味飲食 (Food & Drinks - 22 words)
  { word: 'apple', pos: 'n.', phonics: '/ˈæp.əl/', zh: '蘋果', cat: 'food_drinks', ex: 'An apple a day keeps the doctor away.' },
  { word: 'banana', pos: 'n.', phonics: '/bəˈnæn.ə/', zh: '香蕉', cat: 'food_drinks', ex: 'Monkeys like to eat yellow bananas.' },
  { word: 'orange', pos: 'n.', phonics: '/ˈɔːr.ɪndʒ/', zh: '柳橙', cat: 'food_drinks', ex: 'Fresh orange is sweet and juicy.' },
  { word: 'cake', pos: 'n.', phonics: '/keɪk/', zh: '蛋糕', cat: 'food_drinks', ex: 'We ate chocolate birthday cake.' },
  { word: 'bread', pos: 'n.', phonics: '/bred/', zh: '麵包', cat: 'food_drinks', ex: 'Mom bakes warm bread in the morning.' },
  { word: 'cookie', pos: 'n.', phonics: '/ˈkʊk.i/', zh: '餅乾', cat: 'food_drinks', ex: 'Would you like some cookies?' },
  { word: 'pizza', pos: 'n.', phonics: '/ˈpiːt.sə/', zh: '披薩', cat: 'food_drinks', ex: 'We ordered a cheese pizza for lunch.' },
  { word: 'milk', pos: 'n.', phonics: '/mɪlk/', zh: '牛奶', cat: 'food_drinks', ex: 'Drink a glass of warm milk before bed.' },
  { word: 'water', pos: 'n.', phonics: '/ˈwɑː.t̬ɚ/', zh: '開水', cat: 'food_drinks', ex: 'Please drink more water after running.' },
  { word: 'juice', pos: 'n.', phonics: '/dʒuːs/', zh: '果汁', cat: 'food_drinks', ex: 'I like apple juice with ice.' },
  { word: 'tea', pos: 'n.', phonics: '/tiː/', zh: '茶', cat: 'food_drinks', ex: 'Grandpa drinks hot black tea.' },
  { word: 'cheese', pos: 'n.', phonics: '/tʃiːz/', zh: '起司；乳酪', cat: 'food_drinks', ex: 'The yellow cheese tastes rich.' },
  { word: 'tomato', pos: 'n.', phonics: '/təˈmeɪ.t̬oʊ/', zh: '番茄', cat: 'food_drinks', ex: 'Tomatoes are red and fresh.' },
  { word: 'carrot', pos: 'n.', phonics: '/ˈker.ət/', zh: '胡蘿蔔', cat: 'food_drinks', ex: 'Rabbits love crunchy carrots.' },
  { word: 'sandwich', pos: 'n.', phonics: '/ˈsæn.wɪtʃ/', zh: '三明治', cat: 'food_drinks', ex: 'I eat an egg sandwich for breakfast.' },
  { word: 'hamburger', pos: 'n.', phonics: '/ˈhæmˌbɝː.ɡɚ/', zh: '漢堡', cat: 'food_drinks', ex: 'He likes beef hamburgers.' },
  { word: 'rice', pos: 'n.', phonics: '/raɪs/', zh: '米飯', cat: 'food_drinks', ex: 'We have hot rice for dinner.' },
  { word: 'noodles', pos: 'n.', phonics: '/ˈnuː.dəlz/', zh: '麵條', cat: 'food_drinks', ex: 'Beef noodles in Taiwan are delicious.' },
  { word: 'egg', pos: 'n.', phonics: '/eɡ/', zh: '雞蛋', cat: 'food_drinks', ex: 'Fry an egg with olive oil.' },
  { word: 'candy', pos: 'n.', phonics: '/ˈkæn.di/', zh: '糖果', cat: 'food_drinks', ex: 'Do not eat too much candy.' },
  { word: 'chocolate', pos: 'n.', phonics: '/ˈtʃɑːk.lət/', zh: '巧克力', cat: 'food_drinks', ex: 'Dark chocolate is sweet and bitter.' },
  { word: 'chicken', pos: 'n.', phonics: '/ˈtʃɪk.ɪn/', zh: '雞肉', cat: 'food_drinks', ex: 'We have roast chicken for Sunday lunch.' },

  // 6. 交通工具 (Vehicles & Transportation - 10 words)
  { word: 'bus', pos: 'n.', phonics: '/bʌs/', zh: '公車', cat: 'vehicles', ex: 'Take the yellow school bus home.' },
  { word: 'car', pos: 'n.', phonics: '/kɑːr/', zh: '轎車；汽車', cat: 'vehicles', ex: 'Dad drives a blue car.' },
  { word: 'train', pos: 'n.', phonics: '/treɪn/', zh: '火車', cat: 'vehicles', ex: 'The fast train stops at Taipei Station.' },
  { word: 'boat', pos: 'n.', phonics: '/boʊt/', zh: '小船', cat: 'vehicles', ex: 'The wooden boat floats on the lake.' },
  { word: 'plane', pos: 'n.', phonics: '/pleɪn/', zh: '飛機', cat: 'vehicles', ex: 'The silver plane flies in the sky.' },
  { word: 'bicycle', pos: 'n.', phonics: '/ˈbaɪ.sə.kəl/', zh: '腳踏車', cat: 'vehicles', ex: 'Peter rides his bicycle to the park.' },
  { word: 'truck', pos: 'n.', phonics: '/trʌk/', zh: '卡車', cat: 'vehicles', ex: 'The heavy truck carries fruits.' },
  { word: 'motorcycle', pos: 'n.', phonics: '/ˈmoʊ.t̬ɚˌsaɪ.kəl/', zh: '機車；摩托車', cat: 'vehicles', ex: 'He wears a helmet when riding a motorcycle.' },
  { word: 'taxi', pos: 'n.', phonics: '/ˈtæk.si/', zh: '計程車', cat: 'vehicles', ex: 'We took a yellow taxi to the hospital.' },
  { word: 'ship', pos: 'n.', phonics: '/ʃɪp/', zh: '輪船', cat: 'vehicles', ex: 'The giant ship sails in the harbor.' },

  // 7. 家庭生活與場所 (Home & Places - 18 words)
  { word: 'bed', pos: 'n.', phonics: '/bed/', zh: '床', cat: 'home_living', ex: 'Go to bed early and sleep well.' },
  { word: 'sofa', pos: 'n.', phonics: '/ˈsoʊ.fə/', zh: '沙發', cat: 'home_living', ex: 'Grandpa sits comfortably on the sofa.' },
  { word: 'table', pos: 'n.', phonics: '/ˈteɪ.bəl/', zh: '餐桌；桌子', cat: 'home_living', ex: 'Put the plates on the dining table.' },
  { word: 'lamp', pos: 'n.', phonics: '/læmp/', zh: '檯燈；燈', cat: 'home_living', ex: 'Turn on the desk lamp to read.' },
  { word: 'door', pos: 'n.', phonics: '/dɔːr/', zh: '門', cat: 'home_living', ex: 'Please close the front door.' },
  { word: 'window', pos: 'n.', phonics: '/ˈwɪn.doʊ/', zh: '窗戶', cat: 'home_living', ex: 'Open the window for fresh air.' },
  { word: 'cup', pos: 'n.', phonics: '/kʌp/', zh: '杯子', cat: 'home_living', ex: 'A cup of hot green tea.' },
  { word: 'plate', pos: 'n.', phonics: '/pleɪt/', zh: '盤子', cat: 'home_living', ex: 'Put the sandwich on a clean plate.' },
  { word: 'house', pos: 'n.', phonics: '/haʊs/', zh: '房子；住宅', cat: 'home_living', ex: 'Traditional stone slab houses in Wutai.' },
  { word: 'kitchen', pos: 'n.', phonics: '/ˈkɪtʃ.ən/', zh: '廚房', cat: 'home_living', ex: 'Mom is cooking dinner in the kitchen.' },
  { word: 'garden', pos: 'n.', phonics: '/ˈɡɑːr.dən/', zh: '花園；菜園', cat: 'home_living', ex: 'Butterflies dance in the garden.' },
  { word: 'park', pos: 'n.', phonics: '/pɑːrk/', zh: '公園', cat: 'home_living', ex: 'We have a picnic at the park.' },
  { word: 'zoo', pos: 'n.', phonics: '/zuː/', zh: '動物園', cat: 'home_living', ex: 'We visited the zoo on Saturday.' },
  { word: 'library', pos: 'n.', phonics: '/ˈlaɪ.brer.i/', zh: '圖書館', cat: 'home_living', ex: 'Please stay quiet in the library.' },
  { word: 'hospital', pos: 'n.', phonics: '/ˈhɑː.spɪ.t̬əl/', zh: '醫院', cat: 'home_living', ex: 'Amy\'s mother works at the hospital.' },
  { word: 'supermarket', pos: 'n.', phonics: '/ˈsuː.pɚˌmɑːr.kɪt/', zh: '超級市場', cat: 'home_living', ex: 'Buy fresh vegetables at the supermarket.' },
  { word: 'bookstore', pos: 'n.', phonics: '/ˈbʊk.stɔːr/', zh: '書店', cat: 'home_living', ex: 'I bought this dictionary at the bookstore.' },
  { word: 'beach', pos: 'n.', phonics: '/biːtʃ/', zh: '海灘', cat: 'home_living', ex: 'Build sandcastles on the beach.' },

  // 8. 自然與天氣 (Nature & Weather - 16 words)
  { word: 'sun', pos: 'n.', phonics: '/sʌn/', zh: '太陽', cat: 'nature_weather', ex: 'The golden sun shines brightly.' },
  { word: 'moon', pos: 'n.', phonics: '/muːn/', zh: '月亮', cat: 'nature_weather', ex: 'Look at the full round moon.' },
  { word: 'star', pos: 'n.', phonics: '/stɑːr/', zh: '星星', cat: 'nature_weather', ex: 'Stars twinkle in the mountain night.' },
  { word: 'cloud', pos: 'n.', phonics: '/klaʊd/', zh: '雲朵', cat: 'nature_weather', ex: 'Fluffy white clouds in the blue sky.' },
  { word: 'rain', pos: 'n./v.', phonics: '/reɪn/', zh: '雨；下雨', cat: 'nature_weather', ex: 'Take an umbrella when it rains.' },
  { word: 'tree', pos: 'n.', phonics: '/triː/', zh: '樹木', cat: 'nature_weather', ex: 'Birds rest in the tall cedar tree.' },
  { word: 'flower', pos: 'n.', phonics: '/ˈflaʊ.ɚ/', zh: '花朵', cat: 'nature_weather', ex: 'Beautiful lilies bloom in spring.' },
  { word: 'grass', pos: 'n.', phonics: '/ɡræs/', zh: '青草', cat: 'nature_weather', ex: 'Walk barefoot on soft grass.' },
  { word: 'mountain', pos: 'n.', phonics: '/ˈmaʊn.tən/', zh: '高山', cat: 'nature_weather', ex: 'Mount Dawu is sacred and majestic.' },
  { word: 'river', pos: 'n.', phonics: '/ˈrɪv.ɚ/', zh: '河流', cat: 'nature_weather', ex: 'Cool water flows in the stream.' },
  { word: 'sea', pos: 'n.', phonics: '/siː/', zh: '海洋', cat: 'nature_weather', ex: 'Ships sail on the deep blue sea.' },
  { word: 'rainbow', pos: 'n.', phonics: '/ˈreɪn.boʊ/', zh: '彩虹', cat: 'nature_weather', ex: 'A colorful rainbow after the rain.' },
  { word: 'snowman', pos: 'n.', phonics: '/ˈsnoʊ.mæn/', zh: '雪人', cat: 'nature_weather', ex: 'Build a cute snowman with carrots.' },
  { word: 'sky', pos: 'n.', phonics: '/skaɪ/', zh: '天空', cat: 'nature_weather', ex: 'Eagles soar high in the open sky.' },
  { word: 'umbrella', pos: 'n.', phonics: '/ʌmˈbrel.ə/', zh: '雨傘', cat: 'nature_weather', ex: 'Open your yellow umbrella.' },
  { word: 'wind', pos: 'n.', phonics: '/wɪnd/', zh: '微風；風', cat: 'nature_weather', ex: 'The cool mountain wind blows gently.' },

  // 9. 身體部位與五官 (Body & Senses - 14 words)
  { word: 'eye', pos: 'n.', phonics: '/aɪ/', zh: '眼睛', cat: 'body_health', ex: 'She has big brown eyes.' },
  { word: 'ear', pos: 'n.', phonics: '/ɪr/', zh: '耳朵', cat: 'body_health', ex: 'Rabbits have two long ears.' },
  { word: 'nose', pos: 'n.', phonics: '/noʊz/', zh: '鼻子', cat: 'body_health', ex: 'Elephants have a very long nose.' },
  { word: 'mouth', pos: 'n.', phonics: '/maʊθ/', zh: '嘴巴', cat: 'body_health', ex: 'Open your mouth and say Ah.' },
  { word: 'hand', pos: 'n.', phonics: '/hænd/', zh: '手', cat: 'body_health', ex: 'Wash your hands before eating.' },
  { word: 'foot', pos: 'n.', phonics: '/fʊt/', zh: '腳', cat: 'body_health', ex: 'My left foot is sore.' },
  { word: 'arm', pos: 'n.', phonics: '/ɑːrm/', zh: '手臂', cat: 'body_health', ex: 'Raise your right arm.' },
  { word: 'leg', pos: 'n.', phonics: '/leɡ/', zh: '腿', cat: 'body_health', ex: 'He has long legs for running.' },
  { word: 'hair', pos: 'n.', phonics: '/her/', zh: '頭髮', cat: 'body_health', ex: 'Lisa has long curly hair.' },
  { word: 'face', pos: 'n.', phonics: '/feɪs/', zh: '臉龐', cat: 'body_health', ex: 'Wash your face with cold water.' },
  { word: 'teeth', pos: 'n.', phonics: '/tiːθ/', zh: '牙齒 (複數)', cat: 'body_health', ex: 'Brush your teeth twice a day.' },
  { word: 'head', pos: 'n.', phonics: '/hed/', zh: '頭部', cat: 'body_health', ex: 'Nod your head to say yes.' },
  { word: 'smile', pos: 'n./v.', phonics: '/smaɪl/', zh: '微笑', cat: 'body_health', ex: 'She greeted us with a warm smile.' },
  { word: 'heart', pos: 'n.', phonics: '/hɑːrt/', zh: '心臟；愛心', cat: 'body_health', ex: 'Draw a red heart on the card.' },

  // 10. 衣物與配件 (Clothing & Accessories - 12 words)
  { word: 'hat', pos: 'n.', phonics: '/hæt/', zh: '帽子 (有邊)', cat: 'clothing_accessories', ex: 'Wear a sun hat in summer.' },
  { word: 'cap', pos: 'n.', phonics: '/kæp/', zh: '棒球帽', cat: 'clothing_accessories', ex: 'He wears a blue baseball cap.' },
  { word: 'coat', pos: 'n.', phonics: '/koʊt/', zh: '大衣；外套', cat: 'clothing_accessories', ex: 'Put on your thick winter coat.' },
  { word: 'jacket', pos: 'n.', phonics: '/ˈdʒæk.ɪt/', zh: '夾克', cat: 'clothing_accessories', ex: 'A warm zipper jacket.' },
  { word: 'dress', pos: 'n.', phonics: '/dres/', zh: '洋裝', cat: 'clothing_accessories', ex: 'The girl wears a pretty pink dress.' },
  { word: 'skirt', pos: 'n.', phonics: '/skɝːt/', zh: '裙子', cat: 'clothing_accessories', ex: 'She wears a pleated school skirt.' },
  { word: 'pants', pos: 'n.', phonics: '/pænts/', zh: '長褲', cat: 'clothing_accessories', ex: 'Blue denim pants.' },
  { word: 'shirt', pos: 'n.', phonics: '/ʃɝːt/', zh: '襯衫', cat: 'clothing_accessories', ex: 'A clean white school shirt.' },
  { word: 'sock', pos: 'n.', phonics: '/sɑːk/', zh: '襪子', cat: 'clothing_accessories', ex: 'Wear clean cotton socks.' },
  { word: 'shoe', pos: 'n.', phonics: '/ʃuː/', zh: '鞋子', cat: 'clothing_accessories', ex: 'Tie your shoe laces carefully.' },
  { word: 'glasses', pos: 'n.', phonics: '/ˈɡlæs.ɪz/', zh: '眼鏡', cat: 'clothing_accessories', ex: 'He wears black-rimmed glasses.' },
  { word: 'watch', pos: 'n.', phonics: '/wɑːtʃ/', zh: '手錶', cat: 'clothing_accessories', ex: 'Look at my new digital watch.' },

  // 11. 休閒運動與動作動詞 (Recreation, Sports & Action Verbs - 22 words)
  { word: 'read', pos: 'v.', phonics: '/riːd/', zh: '閱讀', cat: 'sports_activities', ex: 'I like to read fairy tales.' },
  { word: 'draw', pos: 'v.', phonics: '/drɔː/', zh: '畫畫', cat: 'sports_activities', ex: 'She can draw beautiful flowers.' },
  { word: 'listen', pos: 'v.', phonics: '/ˈlɪs.ən/', zh: '聆聽', cat: 'sports_activities', ex: 'Listen to the birds singing.' },
  { word: 'sing', pos: 'v.', phonics: '/sɪŋ/', zh: '唱歌', cat: 'sports_activities', ex: 'We sing an English song together.' },
  { word: 'eat', pos: 'v.', phonics: '/iːt/', zh: '吃', cat: 'sports_activities', ex: 'Eat breakfast before going to school.' },
  { word: 'drink', pos: 'v.', phonics: '/drɪŋk/', zh: '喝', cat: 'sports_activities', ex: 'Drink plenty of water every day.' },
  { word: 'sleep', pos: 'v.', phonics: '/sliːp/', zh: '睡覺', cat: 'sports_activities', ex: 'Babies sleep ten hours a night.' },
  { word: 'swim', pos: 'v.', phonics: '/swɪm/', zh: '游泳', cat: 'sports_activities', ex: 'Can you swim in the pool?' },
  { word: 'cook', pos: 'v.', phonics: '/kʊk/', zh: '煮飯；烹飪', cat: 'sports_activities', ex: 'Dad can cook delicious noodles.' },
  { word: 'wash', pos: 'v.', phonics: '/wɑːʃ/', zh: '洗', cat: 'sports_activities', ex: 'Wash your hands with soap.' },
  { word: 'brush', pos: 'v.', phonics: '/brʌʃ/', zh: '刷', cat: 'sports_activities', ex: 'Brush your teeth after dinner.' },
  { word: 'climb', pos: 'v.', phonics: '/klaɪm/', zh: '攀爬', cat: 'sports_activities', ex: 'Do not climb tall trees.' },
  { word: 'ride', pos: 'v.', phonics: '/raɪd/', zh: '騎', cat: 'sports_activities', ex: 'He learned to ride a bicycle.' },
  { word: 'play', pos: 'v.', phonics: '/pleɪ/', zh: '玩耍；打球', cat: 'sports_activities', ex: 'Let\'s play basketball at the court.' },
  { word: 'ball', pos: 'n.', phonics: '/bɑːl/', zh: '球', cat: 'sports_activities', ex: 'Pass the orange basketball.' },
  { word: 'kite', pos: 'n.', phonics: '/kaɪt/', zh: '風箏', cat: 'sports_activities', ex: 'Fly a kite in the windy park.' },
  { word: 'robot', pos: 'n.', phonics: '/ˈroʊ.bɑːt/', zh: '機器人', cat: 'sports_activities', ex: 'The toy robot can walk and talk.' },
  { word: 'doll', pos: 'n.', phonics: '/dɑːl/', zh: '洋娃娃', cat: 'sports_activities', ex: 'She hugs her soft doll.' },
  { word: 'soccer', pos: 'n.', phonics: '/ˈsɑː.kɚ/', zh: '足球', cat: 'sports_activities', ex: 'We play soccer after school.' },
  { word: 'baseball', pos: 'n.', phonics: '/ˈbeɪs.bɑːl/', zh: '棒球', cat: 'sports_activities', ex: 'Baseball is popular in Taiwan.' },
  { word: 'piano', pos: 'n.', phonics: '/piˈæn.oʊ/', zh: '鋼琴', cat: 'sports_activities', ex: 'She practices piano every evening.' },
  { word: 'guitar', pos: 'n.', phonics: '/ɡɪˈtɑːr/', zh: '吉他', cat: 'sports_activities', ex: 'Grandpa plays acoustic guitar.' },

  // 12. 人物、家庭與職業 (People, Family & Occupations - 14 words)
  { word: 'father', pos: 'n.', phonics: '/ˈfɑː.ðɚ/', zh: '父親；爸爸', cat: 'people_occupations', ex: 'My father is a teacher.' },
  { word: 'mother', pos: 'n.', phonics: '/ˈmʌð.ɚ/', zh: '母親；媽媽', cat: 'people_occupations', ex: 'My mother is very caring.' },
  { word: 'brother', pos: 'n.', phonics: '/ˈbrʌð.ɚ/', zh: '兄弟；哥哥弟弟', cat: 'people_occupations', ex: 'I share toys with my little brother.' },
  { word: 'sister', pos: 'n.', phonics: '/ˈsɪs.tɚ/', zh: '姊妹；姊姊妹妹', cat: 'people_occupations', ex: 'My older sister is in grade five.' },
  { word: 'friend', pos: 'n.', phonics: '/frend/', zh: '朋友', cat: 'people_occupations', ex: 'Andy and Peter are best friends.' },
  { word: 'boy', pos: 'n.', phonics: '/bɔɪ/', zh: '男孩', cat: 'people_occupations', ex: 'The little boy is running.' },
  { word: 'girl', pos: 'n.', phonics: '/ɡɝːl/', zh: '女孩', cat: 'people_occupations', ex: 'The smiling girl is reading.' },
  { word: 'baby', pos: 'n.', phonics: '/ˈbeɪ.bi/', zh: '嬰兒', cat: 'people_occupations', ex: 'The cute baby is sleeping peacefully.' },
  { word: 'doctor', pos: 'n.', phonics: '/ˈdɑːk.tɚ/', zh: '醫生', cat: 'people_occupations', ex: 'The doctor helps sick people.' },
  { word: 'nurse', pos: 'n.', phonics: '/nɝːs/', zh: '護理師', cat: 'people_occupations', ex: 'The kind nurse takes my temperature.' },
  { word: 'cook', pos: 'n.', phonics: '/kʊk/', zh: '廚師', cat: 'people_occupations', ex: 'The head cook prepares lunch.' },
  { word: 'farmer', pos: 'n.', phonics: '/ˈfɑːr.mɚ/', zh: '農夫', cat: 'people_occupations', ex: 'The hardworking farmer grows millet.' },
  { word: 'pilot', pos: 'n.', phonics: '/ˈpaɪ.lət/', zh: '飛行員', cat: 'people_occupations', ex: 'The brave pilot flies the airplane.' },
  { word: 'police officer', pos: 'n.', phonics: '/pəˈliːs ˌɑː.fɪ.sɚ/', zh: '警察', cat: 'people_occupations', ex: 'The police officer keeps our town safe.' }
];

console.log(`Loaded ${CORE_200.length} Core 200 items.`);

// Verify image paths
const publicPreA1Dir = path.resolve('public/assets/exam/preA1');
const availableFiles = fs.readdirSync(publicPreA1Dir);

const mappedVocab = CORE_200.map((item, idx) => {
  const normWord = item.word.toLowerCase().replace(/\s+/g, '_');
  let matchedImage = null;

  // Check matching png or svg
  if (availableFiles.includes(`${normWord}.png`)) {
    matchedImage = `/assets/exam/preA1/${normWord}.png`;
  } else if (availableFiles.includes(`${normWord}.svg`)) {
    matchedImage = `/assets/exam/preA1/${normWord}.svg`;
  } else if (availableFiles.includes(`action_${normWord}.png`)) {
    matchedImage = `/assets/exam/preA1/action_${normWord}.png`;
  }

  return {
    id: `preA1-vocab-${String(idx + 1).padStart(3, '0')}`,
    word: item.word,
    pos: item.pos,
    phonics: item.phonics,
    zh: item.zh,
    category: item.cat,
    image: matchedImage,
    example: item.ex,
    audioText: item.word
  };
});

const imageCount = mappedVocab.filter(v => !!v.image).length;
console.log(`Image coverage: ${imageCount} / ${CORE_200.length} (${Math.round((imageCount / CORE_200.length) * 100)}%)`);

// Generate src/data/exam/tmePreA1VocabList.js
const outPath = path.resolve('src/data/exam/tmePreA1VocabList.js');
const fileContent = `/**
 * Test My English Pre-A1 官方核心 200 詞字表 (The Core 200 Vocabulary Triad)
 * 涵蓋十二大生活情境主題領域，三位一體（字形、國際音標/發音、視覺線稿錨點圖資）全對照
 */

export const TME_PRE_A1_VOCAB_CATEGORIES = {
  numbers_time: { id: 'numbers_time', label: '數字與時間 (Numbers & Time)', icon: '⏱️' },
  colors_appearance: { id: 'colors_appearance', label: '顏色與外貌特徵 (Colors & Attributes)', icon: '🎨' },
  animals: { id: 'animals', label: '動物世界 (Animals)', icon: '🐾' },
  school_stationery: { id: 'school_stationery', label: '校園生活與文具 (School & Stationery)', icon: '📚' },
  food_drinks: { id: 'food_drinks', label: '美味飲食 (Food & Drinks)', icon: '🍎' },
  vehicles: { id: 'vehicles', label: '交通工具 (Vehicles & Transportation)', icon: '🚗' },
  home_living: { id: 'home_living', label: '家庭生活與場所 (Home & Places)', icon: '🏠' },
  nature_weather: { id: 'nature_weather', label: '自然與天氣 (Nature & Weather)', icon: '⛅' },
  body_health: { id: 'body_health', label: '身體與五官 (Body & Senses)', icon: '👀' },
  clothing_accessories: { id: 'clothing_accessories', label: '衣物與配件 (Clothing & Accessories)', icon: '🧢' },
  sports_activities: { id: 'sports_activities', label: '休閒、運動與動作動詞 (Sports & Activities)', icon: '⚽' },
  people_occupations: { id: 'people_occupations', label: '人物、家庭與職業 (People & Occupations)', icon: '👨‍👩‍👦' }
};

export const TME_PRE_A1_CORE_VOCAB = ${JSON.stringify(mappedVocab, null, 2)};

export default TME_PRE_A1_CORE_VOCAB;
`;

fs.writeFileSync(outPath, fileContent, 'utf8');
console.log(`Successfully generated ${outPath}!`);
