# 霧臺雲端家園 (`WutaiTownGame`)、多寶格藏寶閣 (`CurioBackpackModal`)、學生通行證與雙語聽說實驗室規範

> **對應檔案**：`src/games/town/WutaiTownGame.jsx`、`src/games/town/CurioBackpackModal.jsx`、`src/utils/inventoryHelper.js`、`src/components/StudentProfileModal.jsx`、`src/games/town/CinemaTheaterModal.jsx`、`src/features/langlab/LanguageLabHub.jsx`、`src/services/hereWeGoQuestionBank.js`、`src/features/phonics/PhonicsBoard.jsx`、`src/components/TextbookViewer.jsx`

---

## 一、 霧臺雲端家園 (`WutaiTownGame.jsx`) 核心規範

1. **頂部 HUD 穿透與建築點擊熱區**：
   - 頂部橫幅容器必須保持 `pointer-events-none`（僅內部實體按鈕設為 `pointer-events-auto`），確保點擊頂部空隙能穿透至後方地圖建築（聚會所、雲豹書局、黑熊超市）。
2. **家園建材購買與雲端雙軌同步**：
   - 學生購買建材或植物時，透過 `StudentContext` 呼叫 `spendCoins` 與 `updateInventory`，自動同步至本機快取、`student_profiles` 與 `leaderboard (mode = 'profile-sync')`。
3. **山豬影城 (`CinemaTheaterModal.jsx`)**：
   - 採用 16:9 劇院模式串流 YouTube 英語教學影片，零伺服器流量負擔。

---

## 二、 學生背包多寶格 (`CurioBackpackModal`) 與元數據解析 (`inventoryHelper.js`)

1. **徹底消滅「無名快遞紙箱 📦」鐵律 (`resolveItemMetadata`)**：
   - 無論學生背包資料儲存的是舊版純字串（如 `'pencil'`、`'apple'`、`'sacred_urn'`、`'glass_bead'`、`'item_1'`）或是缺少屬性的物件，在讀取與陳列時**一律通過 `resolveItemMetadata` 自動解析**：
     - 🏺 **神聖排灣陶甕** (`sacred_urn`, `urn`, `pottery`, `item_1`)
     - 🗡️ **原住民雕花禮刀** (`ceremonial_knife`, `knife`, `sword`, `item_2`)
     - 🪶 **熊鷹羽毛頭飾** (`eagle_feather`, `feather`, `item_3`)
     - 📿 **七彩琉璃珠項鍊** (`glass_bead`, `bead`, `necklace`, `item_4`)
     - ⚜️ **純潔百合榮譽章** (`lily_badge`, `lily`)
     - 🍎 **香甜紅蘋果**、🥛 **純淨牛奶**、✏️ **木質鉛筆**、🎒 **探險背包**、🎫 **客運票券** 等 30+ 款真實文化生活物品。
   - 兜底保護：若遇到未定義之生僻 ID，自動賦予「神山守護古物（🏺）」形象，**絕對嚴禁出現無名快遞紙箱 📦**。
2. **24 格多寶格展示櫃與自動摺疊堆疊**：
   - 學生擁有多件同款物品時（如 10 顆紅蘋果），自動摺疊為 1 格並在右下角以金色立體角標標記 `x10`。
   - 多寶格陳列位置自訂並持久化至 `localStorage`（`wutai_curio_layout_<student_id>`），讀取時亦防禦性經過 `resolveItemMetadata` 洗滌。
3. **沉浸式「打開把玩」動態聲光與原民文化回音 (`handlePlayItem`)**：
   - **依道具類型變更動作標籤**：
     - 食物類：`😋 品嚐享用`
     - 裝備/琉璃珠/羽毛：`✨ 佩戴加持`
     - 文具類：`✍️ 揮毫練習`
     - 傳統古物：`🏺 撫摸把玩`
   - **把玩時聲光特效不閃退**：
     - 道具圖標 1.25x 放大並觸發金色旋轉光暈環與 `animate-bounce` 彈跳。
     - 觸發雙軌音效：`soundEngine.powerUp()` 魔法升級音 ＋ `speakEnglish(item.nameEn)` 標準英音朗讀。
     - 粒子爆發：`confetti({ particleCount: 40, spread: 60 })`。
     - 文化回音面板：下方展開專屬傳奇典故（如輕撫陶甕聽見祖靈低語、佩戴禮刀燃起勇者之魂、轉動琉璃珠獲得平安加持等），兼具趣味與原民文化底蘊。

---

## 三、 學生個人通行證 (`StudentProfileModal.jsx`) 核心規範

1. **新遊戲/改動自動同步機制（集中註冊驅動）**：
   - 通行證 TOP 3 殿堂榮譽榜**嚴禁寫死模式名稱**，全面由 `src/components/LeaderboardView.jsx` 導出的集中模式註冊表 `CONSOLIDATED_GAME_MODES` 動態映射。
   - 未來只要在系統中註冊新遊戲模式，通行證自動納入查核，並以 `Promise.allSettled` 並發平行查詢，零延遲且免人工修改通行證代碼。
2. **單頁古代石板純淨展示（杜絕橫向滾動條）**：
   - 槽位 6（背包道具槽）移除橫向滾動條 (`overflow-x-auto`) 與微縮圖陣列。
   - 改採由 `getInventorySummary` 計算之精緻概括膠囊：
     - 有道具：`🎒 冒險行囊：共 X 件 • Y 類寶物 ➔ 開啟大背包`
     - 無道具：`行囊輕便 • 開啟大背包 ➔`
   - 點擊後開啟高畫質大背包多寶格展示彈窗，確保通行證石板本體 100% 保持在嚴格的 768:1024 單頁物理版面中，零跑版、零捲動條。

---

## 四、 雙語聽說實驗室 (`LanguageLabHub.jsx`) 與題庫規範

1. **口說跟讀評測雙擊流程**：
   - 第 1 次點擊麥克風按鈕：啟動錄音（Web Speech API）。
   - 第 2 次點擊麥克風按鈕（或語音結束）：立即結束錄音並計算匹配度評分，渲染評分回饋卡片（含 Perfect / Good job 等級與重測按鈕）。
2. **聽句子選英文「零漢字」嚴格過濾 (`hereWeGoQuestionBank.js`)**：
   - 所有英文句子題目與干擾選項皆通過 `isValidEnglishSentence` 過濾，確保英文選項中 **100% 不包含任何中文字元**。
