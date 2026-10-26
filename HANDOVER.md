# 霧臺國小英語自主學習宇宙 (Wutai Vocab Adventure 2.0)
## 專案對話交接文檔 (Project Handover Document)

> **產生時間**：2026-10-26
> **當前分支**：`dev` (準備合併至 `main` 並部署至正式線上環境)
> **線上正式環境網址**：https://wutaivocab.pages.dev

---

### 一、新對話開場引導 (Instructions for Next Agent)

若你是接收此專案的新對話 AI 助理，請依下列步驟快速就位：
1. **工作目錄**：`c:\Users\user\.gemini\antigravity\scratch\wutaivocab`
2. **驗證指令**：任何代碼變更後，請一律執行 `npm run verify`（包含 ESLint 靜態語法檢查、Vite 生產級打包構建、以及無頭 Chrome 深度自動化測試 14 款遊戲全冊各身分）。
3. **Git 推播流程 (僅限 origin，嚴禁日常推送 vercel)**：
   > [!WARNING]
   > **【嚴禁日常推送 Vercel】** 因 Vercel Hobby 方案每日/每月構建配額極易耗盡，日常開發中**一律只推送到 `origin` 遠端**！正式生產環境以 Cloudflare Pages (`wutaivocab.pages.dev` 綁定 `origin/main`) 為準。除非有重大版本發布且經 Mark 特別指示，否則**切勿執行 `git push vercel`**。
   ```powershell
   git add <files>
   git commit -m "<type>(<scope>): <description>"
   git push origin dev
   git checkout main ; git merge dev ; git push origin main ; git checkout dev
   ```
4. **Cloudflare 生產部署**：
   ```powershell
   $env:CLOUDFLARE_API_TOKEN="<YOUR_CLOUDFLARE_API_TOKEN>" ; npx wrangler pages deploy dist --project-name=wutaivocab --branch=main
   ```

---

### 二、專案技術架構與環境設定

* **前端框架**：React 18.3.1 + Vite 6.1.0 + Tailwind CSS 3.4.17
* **圖形與遊戲引擎**：HTML5 Canvas 2D / 3D (Three.js 0.186.1)
* **狀態與音訊**：
  * Web Audio API 自研音效合成器 (`src/services/audio.js`)，支援音效快取、合成器備援與多音軌 BGM。
  * Web Speech API + edge-tts 語音發音與口說辨識評測。
* **資料庫與後端**：Supabase (`src/services/supabase.js`)，支援離線模式與遊客訪客本地降級機制。
* **主要遠端倉庫**：
  * GitHub `origin`：`https://github.com/u864001/wutaivocab.git`
  * GitHub `vercel`：`https://github.com/u8640012026/wutaivocab.git`
* **主機發布服務**：Cloudflare Pages (`wutaivocab.pages.dev`)

---

### 三、近期已完成的核心修復與功能里程碑

#### 1. 貪食蛇 (Snake Game)
* **發光字母極致辨識度** (`src/games/snake/snakeJungleTheme.js`):
  * 解決過去因全域開啟 `ctx.shadowBlur` 導致字母文字被黃色光團吞沒模糊的問題。
  * 光暈限制在外圍呼吸環，文字本體清空 `shadowBlur = 0`，以 900 特粗純黑描邊（4.5px）+ 亮純白/高純金雙層填充，達成 4K 極致字體銳利度。
* **操作靈敏度全面重構** (`src/games/snake/SnakeGame.jsx`):
  * **轉向指令隊列（Input Queue）**：引入 `inputQueueRef`，防止連續快速按鍵覆蓋或掉指令。
  * **平滑連續滑動（Continuous Swipe）**：在 `touchmove` 實時判定轉向（閾值 16px），無需抬起手指即可連續多向引導。
  * **虛擬十字鍵零延遲**：升級為 `onPointerDown`（0ms 延遲），徹底移除行動瀏覽器 300ms 點擊延遲。
* **日夜版視覺升級** (`src/games/snake/SnakeCanvas2D.jsx`):
  * 支援白晝晨曦 ☀️ 與星月夜景 🌙 切換，夜景模式加入黑曜板岩、月夜星華冷色漸層，以及 6 隻帶著呼吸光暈漫舞的夜光山林螢火蟲。

#### 2. 聽說館：聽句子選英文 (`src/services/hereWeGoQuestionBank.js`, `src/data/hereWeGoTextbookData.js`)
* **清除課文數據中的中文殘留**：校準了 14 筆中英顛倒之課文句子（如 Book 4 Unit 4 `看！帽子舞！` 修正為 `Look! The hat dance!`）。
* **嚴格防禦過濾器**：加入 `isValidEnglishSentence`，保證目標句與所有干擾選項中**絕對不包含任何漢字**（自動化 100 次題庫抽查，中文選項出現率 0%）。

#### 3. 密室逃脫：長單字排版自適應與多詞膠囊 (`src/games/escape/puzzles/SpellingPuzzle.jsx`)
* **複合詞智慧分組膠囊**：遇到像 `social studies` 等長單字時，自動依空格切分為獨立詞塊膠囊（如 `[S,O,C,I,A,L]` 與 `[S,T,U,D,I,E,S]`）。
* **響應式卡槽縮放與折行**：$\ge 10$ 字母的單字動態縮小為緊湊尺寸，並支援 `flex-wrap` 自適應換行，解決衝出版面導致末端字母被截斷的問題。
* **常駐快捷控制列**：中央提供「⌫ 刪除上一格」退格鍵與「🔄 全部重排」重設鍵，任何螢幕都不會被推到螢幕外。

#### 4. 霧臺小鎮：頂部場所點擊判定優化 (`src/games/town/WutaiTownGame.jsx`, `src/games/town/townData.js`)
* **解除頂部 HUD 遮蔽**：橫幅容器改為 `pointer-events-none`，僅保留實體按鈕為 `pointer-events-auto`，空隙不攔截點擊，直接穿透至地圖。
* **擴大頂部場所熱區**：聚會所、雲豹書局、黑熊超市熱區垂直向下延伸，點擊建築屋頂、門窗或前階梯均能 100% 進入。

#### 5. 8 大冊「找不同」精確校準與零交疊 (`src/games/spotter/SpotterScene.jsx`, `src/games/spotter/spotterData.js`)
* **橢圓幾何判定升級**：支援長條形物件（火車、客機、直尺等）完整包覆。
* **Book 7 像素級校準**：火車頭全包覆 (rx:175, ry:45)、地圖精確脫離河水面、明信片對準紅色郵筒。
* **全冊 64 個相異目標兩兩距離檢驗**：交疊數為 0 (`TOTAL OVERLAPS: 0`)。

#### 6. 手寫字母判定彈窗修正 (`src/games/handwriting/HandwritingGame.jsx`)
* 判定彈窗脫離四線三格 aspect-ratio 容器，做成全螢幕獨立浮層，下方的「下一題」操作按鈕在任何裝置螢幕上皆完整露出且可點擊。

#### 7. 手機頂部導航精簡化 (`src/components/Lobby.jsx`, `src/components/LeaderboardView.jsx`, `src/components/TextbookViewer.jsx`)
* **標題超載折行全面根除**：大廳、排行榜、課本電子書之頂部橫幅在小螢幕（`< 640px`）將「返回主大廳」、「英雄榜」、「電子書聽讀」等長文字隱藏，統一以大圖標解決；學生身份資料在手機直立版精簡為大頭貼與宇宙金幣，確保 360px 極限螢幕下頂部永遠維持單行，騰出寶貴垂直視野。

#### 8. 密室逃脫「0 秒通關」漏洞根治與排行榜修復 (`src/services/supabase.js`, `src/games/escape/VocabEscapeGame.jsx`, `src/components/LeaderboardView.jsx`)
* **排位依據校準**：密室逃脫與找不同統一確立為「秒數低優先（time ASC），相同秒數再比剩餘愛心（score DESC）」。通關上傳分數 `score` 修正為上傳「剩餘愛心數（1~3）」，而非原本錯誤的謎題總數。
* **資料庫多重防護**：
  * `uploadScore` 與 `checkIfQualifiesForTop50`：針對耗時類型遊戲加入強硬防禦 `time > 0`，小於等於 0 秒直接拒絕入榜；若歷史紀錄為 0 秒則允許被正常有效秒數覆蓋更新。
  * `fetchLeaderboard`：資料庫查詢加上 `.gt('time', 0)`，前端抓取時亦雙重過濾跳過 `time <= 0`，歷史異常的 0 秒資料全面隱形消失。
  * 通關秒數計算以 `Math.max(1, Math.floor((Date.now() - startTimeRef.current) / 1000))` 強制確保秒數 $\ge 1$。

#### 9. 結算畫面智慧自動上榜與零捲動壓縮 (`src/components/HonorSubmissionCard.jsx`, `src/components/CertificateModal.jsx`)
* **已登入學生自動非同步登錄**：登入學生遊戲結束進入結算時，系統自動於背景調用 `uploadScore`，杜絕學生誤按列印或返回導致辛苦成績未送出的問題，畫面直接展示「🏆 成績已成功登錄全校英雄榜！」。
* **iPad / 手機零捲動排版**：將原本冗長的結算內容壓縮至精巧的成就彩帶（整合答對率、金幣、圖鑑星數），並內嵌與本作設計風格一致的 `Printer` 按鈕，點擊一鍵叫出 A4 大武山/百合花風格獎狀列印預覽。

#### 10. 子遊戲次級選單整併與直通開始 (`src/components/Lobby.jsx`, `src/games/*`)
* **全面拔除二次開始彈窗**：針對 6 款早期遊戲（貪食蛇、3D 隕石、記憶翻牌、極速滑牌、標準測驗、單字積木），移除掛載時阻斷流程的開始遊戲全螢幕彈窗或黑底次級選單，點選遊戲後 0 延遲直接進入遊戲畫面。
* **大廳整備室（分流 B）子模式一站式收納**：所有遊戲難度與呈現維度（如貪食蛇普通/進階/大師、記憶對對碰圖文/英中、標準測驗聽力子模式等）統一收納於大廳進入遊戲前的設定膠囊，並於 `localStorage` 自動記住學生偏好與提供推薦預設，達成 iPad 螢幕零捲動一站式點選。

#### 11. 叢林神山貪食蛇：2D 正俯視視野與日夜雙視覺升級 (`src/games/snake/SnakeCanvas2D.jsx`, `src/games/snake/snakeJungleTheme.js`)
* **真 2D 俯視視角**：告別早期山脈天空側視違和感，轉為正俯視鬱鬱蔥蔥的叢林地景。
* **白晝晨曦版**：翠綠草地磁磚棋盤網格、晨光漫射、邊緣矮灌木裝飾、以及 3 隻靈動翩躚的翠鳳蝶。
* **星月夜景版 (`isDark`)**：深邃月夜草坪、每 7 秒一次自左上至右下的 45° 金屬月光微亮掃光；空中點綴 6 隻發出 2.5s 柔和呼吸冷色光暈的夜光螢火蟲；蛇身採用黑曜岩深色底紋，菱形幾何紋理隨移動節奏散發琥珀金呼吸光，徹底避免「整條螢光棒」的刺眼感；字母改以高純度晶體水晶顯示，維持黑夜高對比度。

#### 12. 3D 隕石防衛戰視野拉伸與多人突襲防塞車調校 (`src/games/meteor/MeteorCanvas3D.jsx`, `src/games/battle/BattleGame.jsx`, `src/games/battle/EmergencyRaidMeteor.jsx`)
* **相機視野與生成深度拉長**：攝影機由 `z: 18` 後拉至 `z: 27`，隕石生成起點由 `-40` 深化至 `-75`，大幅延長學生反應判讀時間，抵達時比例亦不再臃腫遮蔽。
* **螢幕上限 1 顆突襲隕石與隊列嚴格防塞車**：學生畫面上同時最多僅允許 1 顆同學突襲隕石正在下墜，等待隊列嚴格限制最多暫存 1 顆，超量突襲直接拋棄（Drop），並在每顆突襲結束後保留 1.5 秒冷卻緩衝，徹底杜絕多位同學同時空襲造成學生手忙腳亂、排隊無窮無盡的挫折感。
* **精準空域動態落點**：同學突襲隕石起始位置隨機分佈於左翼安全空域（18%~30%），完全避開中央題目隕石區（35%~65%）與右上角 Combo 氣球灌氣區（74%~96%），且不緊貼螢幕左壁。
* **科技折線引導 HUD 框**：突襲隕石上方加入 Cyber 科技風格動態引導折線與半透明戰術卡，清楚標示突襲來源同學、倒數進度與點擊防衛次數。

#### 13. 地球能量防護罩機制與 Cloudflare GitHub Actions 自動部署 (`.github/workflows/deploy-cloudflare.yml`, `src/games/meteor/*`, `src/games/battle/*`)
* **每 50 分自動生成地球防護罩**：單人模式與多人對戰中，學生成績累計每達 50 分整數倍，自動生成一層「地球能量防護罩」。累計層數邏輯無上限，3D WebGL 場景與外太空同心白色呼吸光圈最多顯示 5 層（隨層數外擴至半徑 91，越多層呼吸光芒越耀眼），避免畫面死白。
* **傷害抵擋與連擊歸零規則**：當題目隕石墜地或受到毀滅級烈焰空襲時，優先扣除一層防護罩抵禦傷害（免扣愛心生命值）；但若是自身題目隕石墜地或未答對，因為題目未能成功解出，該題 Combo 必須嚴格歸零重算。
* **Cloudflare 自動部署流水線**：建立 `.github/workflows/deploy-cloudflare.yml`，在 GitHub 倉庫設定 `CLOUDFLARE_API_TOKEN` 後，只要推送 `main` 分支，GitHub Actions 將全自動執行語法檢查、生產打包與 Cloudflare Pages 部署，達成與 Vercel 相同的 100% 免手動自動發布！

#### 14. 鷹眼神探找不同：低年級隱形熱區、第 8 冊判斷框精準校準與 Word Bank iPad 零捲動 (`src/games/spotter/*`, `scripts/debug_overlay.js`)
* **低年級 ABC 缺漏自然探索**：拔除原本右托盤缺漏字母處過於直白的紅色虛線方框與「❓ 缺漏」提示，改為純隱形熱區（`opacity-0`），由小學生自主觀察探索，點擊破解後才亮起翠綠光環與已找齊勾選徽章。
* **第 8 冊（四季時光庭園）像素級判斷框校準**：
  * 天鵝 (`swan`) 修正為 `(295, 485)`，精準鎖定白/黑天鵝本體。
  * 園藝鏟 (`spade`) 修正為 `(138, 635)`，完整涵蓋花圃金黃鏟柄至鏟刃。
  * 徹底撥正長笛 (`flute`, `(980, 515)`) 與大衣 (`coat`, `(952, 340)`) 顛倒之座標與標籤。
  * 派 (`pie`) 微調為 `(704, 528)`，所有 8 處相異點皆經圖像質心演算法校正，100% 貼合無交疊。
* **Word Bank 超長單字自適應與 iPad 零捲動**：長度大於 14 字母之長單字自動調降字級至 `text-[10px]`，收緊選項網格與內距，確保 iPad 橫向視圖絕不產生縱向捲動條。
* **可視化檢驗工具腳本**：新增 `scripts/debug_overlay.js`，可隨時將指定冊次之判定框與文字標籤無失真疊加至底圖產出檢驗圖。

#### 15. 鷹眼神探 Round 2：阿姆斯特丹新場景、動態 8 選 5 變異引擎與專屬檢驗工作台 (`src/games/spotter/*`, `public/assets/spotter/*`)
* **Book 1 Scene 2（阿姆斯特丹贊斯風車運河果園集市）**：
  * 完成成對 1376×768 3D 立體紙雕底圖與變異圖。
  * 經專案負責人 Mark 審查校準：大象噴泉下移至地面花園廣場、葡萄判定圈全域擴大包覆木藤架 (rx:185, ry:125)、狗狗判定圈擴大同時覆蓋柴犬與趴臥大麥町 (rx:95, ry:85)、蘋果判定圈擴大涵蓋箱外落果 (rx:110, ry:70)；背景豐富融合 bicycle, lamppost, bench, bread, Gouda cheese, backpack, trees, boat 等複習元素。
* **A 方案升級版 • 雙圖槽位動態 8 選 5 變異引擎**：
  * 每局由系統隨機抽選 5 個單字覆蓋羽化透明補丁 (`patches/b1_s2/{word}_variantA.png`)。
  * 未被抽選之 3 個單字，左右兩圖 100% 呈現完全相同之基準圖素（物理像素完全相同），徹底杜絕幽靈差異與誤觸扣心，破除學生背死圖之限制。
* **專案負責人 Mark 專屬審核平台：變異檢驗工作台 (`SpotterTestWorkbench.jsx`)**：
  * 支援直接路由 `/spotter-test`（或 `?view=spotter-test`），並在神探遊戲中提供「🔬 變異工作台」一鍵直達按鈕。
  * 具備 4 大檢驗模式：
    1. **全幅雙圖對照 (Side-by-Side Canvas)**：底圖 vs 變異圖左右並列，支援判定圈、單字膠囊、羽化槽位框開關與單字點選聚焦。
    2. **8 大目標顯微驗收矩陣 (Zoom Matrix)**：提供每個單字之高解析局部比對卡片 (`crops/b1_s2/{word}_compare.jpg` 與 `crops/b1_s1/`)、座標、半徑、變化描述與 Variant A~G 演進進程。
    3. **A 方案動態 8 選 5 即時抽題模擬 (Dynamic Engine Simulator)**：可隨機抽題，實機驗證 5 個變異點與 3 個未選中立點的點擊防禦。
    4. **全套教材 8 冊 40 場景藍圖 (Master Roadmap)**：統整 1~8 冊各 5 個場景之進度狀態與核心單字池規劃。

#### 16. 鷹眼神探 第 2 至 8 冊判定框與相異目標全量校準及顯微驗收矩陣部署 (`spotterData.js`, `SpotterTestWorkbench.jsx`)
* **全冊次舊版 B 方案場景校準完備（遵照專案負責人 Mark 規範通過審核，新場景全數朝動態 A 方案施作）**：
  * **第 2 冊（陽光農莊與可愛動物公園）**：徹底更換先前誤植之「溫馨派對」題目，回歸 Here We Go 第 2 冊核心寵物與玩具單字（`cat` 貓咪、`ball` 球、`dog` 狗狗、`rabbit` 兔子、`turtle` 烏龜、`frog` 青蛙、`kite` 風箏、`bird` 小鳥），精準校驗 8 大相異點座標。
  * **第 3 冊（微風野餐湖畔）**：修正太陽（`sun`）判定框偏右圈到雲層問題，校準至太陽本體中心 `(690, 100)`，半徑改為 `rx: 80, ry: 75`，精準包覆光芒與笑臉。
  * **第 4 冊（英倫透視家居）**：
    * 互換 `bed`（二樓床鋪，`x: 275, y: 395`）與 `hat`（二樓衣帽架，`x: 275, y: 210`）判定框。
    * 擴大雙層公車（`bus`）判定框至 `(210, 665, rx: 110, ry: 130)`，完整包覆整輛英倫紅色雙層巴士。
    * 校準 `computer`（二樓書桌筆電，`x: 605, y: 310`）、`sofa`（客廳沙發，`x: 435, y: 765`）、`book`（茶几讀本，`x: 535, y: 775`）、`bag`（玄關背包，`x: 792, y: 792`）。
  * **第 5 冊（巴黎羅浮宮廣場）**：
    * 校正台階守護石獅（`lion`，`x: 385, y: 345`，原誤植為 milk）。
    * 校正左側大樹上的無尾熊（`koala`，`x: 88, y: 275`，原位置偏移）。
    * 校正矮牆上的玻璃牛奶瓶（`milk`，`x: 230, y: 725`）。
    * 將誤植之調色盤替換為圓木凳上的切片蛋糕（`cake`，`x: 828, y: 790`）。
  * **第 6 冊（星際與自然歷史博物館）**：
    * 校正展覽廳中央大象（`elephant`，`x: 500, y: 520`，原誤植為 sunglasses）。
    * 校正前方絲絨展台上的墨鏡（`sunglasses`，`x: 500, y: 760`，原指派於大象）。
    * 精準微調博物館長椅生菜沙拉（`salad`，`x: 685, y: 645`）與邊几拉麵（`noodles`，`x: 345, y: 585`）。
  * **第 7 冊（世界節慶與環球港灣）**：
    * 擴大觀景台世界地圖判定框（`map`，`x: 640, y: 630, rx: 140, ry: 125`），全域涵蓋整張彩色地圖。
    * 擴大長椅旁行李箱判定框（`suitcase`，`x: 925, y: 635, rx: 120, ry: 125`），與地圖完全獨立、零重疊誤觸。
  * **第 8 冊（四季時光庭園）**：
    * 擴大池中天鵝判定框（`swan`，`x: 250, y: 580, rx: 95, ry: 90`），完整包覆天鵝頭頸、羽翼與身軀。
    * 修正鏟子嚴重錯位問題，整體向右上移（`spade`，`x: 145, y: 610, rx: 65, ry: 160`），完整涵蓋手柄至入土鏟刃。
    * 往上微調大衣判定框（`coat`，`x: 952, y: 310, rx: 80, ry: 105`），完美包覆風衣領口。
* **鷹眼神探 QA 檢驗工作台（`/spotter-test`）全量顯微裁切矩陣自動生成**：
  * 生成 56 張 650x276 高解析「BASE vs VAR A」局部對比圖（`/assets/spotter/crops/b2_s1/` ～ `b8_s1/`），供負責人 Mark 於工作台一鍵逐卡檢視判定規格與羽化邊緣。
  * 生成第 2 至 8 冊全圖判定框標籤對照圖（`book2_side_by_side_boxes.jpg` ～ `book8_side_by_side_boxes.jpg`）。
  * CI 測試 `npm test`（14 款遊戲 4 身分）與 `test_spotter_workbench.mjs`（無頭 Chrome CDP 自動驗收）均 100% 通過。

#### 17. 鷹眼神探 第 2 至 8 冊最終實體驗收校準、旋轉橢圓判定與博物館展館無食物規範修訂 (`spotterData.js`, `SpotterTestWorkbench.jsx`, `SpotterScene.jsx`, `public/assets/spotter/*`)
* **背景與專案負責人 Mark 驗收審查意見**：
  * 專案負責人 Mark 逐冊深度審查 `/spotter-test` 提出精密反饋：
    1. **二冊**：烏龜判定框下移、青蛙判定框下移一個圓半徑（約 50px）、風箏框連飄逸尾穗一併完整包含；圖 2 京都未繪圖前不載入底圖避免混淆。
    2. **三冊**：太陽與雲朵合併圈選（右圖白雲消失，單圈太陽會漏圈相異本體）。
    3. **四冊**：僅時鐘正確，其餘 7 處徹底復原實體像素（左側英倫雙層大紅公車、2F 床鋪、2F 衣帽架草帽、2F 書桌筆電、1F 客廳沙發、1F 茶几讀本、1F 玄關地毯背包）。
    4. **五冊**：足球、蛋糕、相機正確；長棍麵包判定框向右收斂避免涵蓋牛奶瓶；復原左樹無尾熊、台階石獅、矮牆牛奶、畫架蒙娜麗莎畫作。
    5. **六冊（重要規範）**：**展館內禁止飲食，嚴格禁止畫食物進博物館！** 透過像素級修復修補博物館長椅面與垂直木飾板（完全抹除生菜沙拉碗與拉麵熱氣），展台墨鏡 (`695, 585`) 與中央大象 (`685, 405`) 標籤顛倒徹底撥正。
    6. **七冊**：世界地圖向右微調包覆整張地圖（`705, 570`），與右側行李箱（`965, 580`）完美脫鉤 0 重疊。
    7. **八冊**：天鵝判定框往右上移動包覆完整身軀羽翼（`325, 460`）；花圃鏟子為配合傾斜角度導入**旋轉橢圓技術**（`rotate: -14`，`rx: 38, ry: 135`），由把手至鏟刃緊密包覆且 100% 脫離天鵝框；鼓面判定框往上微調涵蓋鼓棒（`288, 250`）；野餐派判定框往下微調包覆完整派盤（`704, 546`）。
* **物理像素校準成果（透過 Sharp 像素級實體定位）**：
  * **Book 2**：`turtle` (`805, 580, rx:55, ry:50`)、`frog` (`1115, 605, rx:55, ry:50`)、`kite` (`830, 185, rx:95, ry:155`，含尾穗)。
  * **Book 3**：`sun`（太陽與雲朵，`750, 100, rx:140, ry:80`）。
  * **Book 4**：`bus` (`235, 515, rx:160, ry:135`，左側大紅雙層公車)、`hat` (`395, 158, rx:60, ry:48`，2F 衣帽架草帽)、`bed` (`370, 305, rx:85, ry:65`，2F 床鋪)、`computer` (`840, 242, rx:75, ry:50`，2F 書桌筆電)、`sofa` (`560, 580, rx:85, ry:85`，1F 沙發)、`book` (`725, 590, rx:65, ry:65`，茶几繪本)、`bag` (`1095, 610, rx:65, ry:75`，玄關地毯後背包)、`clock` (`1180, 165, rx:45, ry:48`，大笨鐘面)。
  * **Book 5**：`koala` (`145, 175, rx:75, ry:75`，樹上無尾熊)、`lion` (`535, 260, rx:80, ry:90`，基座石獅)、`milk` (`330, 560, rx:45, ry:75`，矮牆玻璃奶瓶)、`bread` (`450, 560, rx:60, ry:75`，竹籃麵包，零交疊牛奶)、`football` (`755, 580, rx:60, ry:60`)、`painting` (`1020, 390, rx:55, ry:65`，畫架蒙娜麗莎)、`cake` (`1140, 610, rx:60, ry:60`)、`camera` (`1265, 490, rx:65, ry:65`)。
  * **Book 6**：食物完全抹除！`cap`（圓几棒球帽，`480, 466, rx:65, ry:55`）與 `umbrella`（長椅雨傘，`945, 493, rx:55, ry:45`）；`mask` (`104, 422`)、`rocket` (`400, 188`)、`elephant` (`685, 405, rx:130, ry:65`，展館中央大象)、`sunglasses` (`695, 585, rx:75, ry:40`，前方紅絲絨展台墨鏡)、`dinosaur` (`1000, 193`)、`backpack` (`1151, 597`)。
  * **Book 7**：`map` (`705, 570, rx:165, ry:95`，向右全包地圖)、`suitcase` (`965, 580, rx:75, ry:85`，向右緊湊)，兩者淨間距 20px，完全 0 重疊。
  * **Book 8**：
    * `swan` (`325, 460, rx:70, ry:55`，右上整隻天鵝)。
    * `spade` (`200, 535, rx:38, ry:135, rotate: -14`，逆時針 14 度傾斜橢圓全包鏟子，與天鵝間距 35px 零交疊)。
    * `drum` (`288, 250, rx:66, ry:58`，含鼓面與鼓棒)。
    * `pie` (`704, 546, rx:96, ry:52`，全包派盤與餡餅)。
    * `dress` (`1256, 348, rx:110, ry:142`，中心由 390 大幅向上拉升至 348，垂直半徑擴大至 142，完美涵蓋人型模特兒頭頸旋鈕、雙肩、洋裝裙擺至木腳架全域)。
    * `rose` (`698, 268, rx:76, ry:74`，中心中央鮮紅玫瑰花叢轉金黃玫瑰花叢；**拱門兩側纏繞之背景玫瑰花已於兩圖 100% 統一顏色**，徹底抹除背景意外色差)。
    * `coat` (`957, 310, rx:75, ry:95`)、`flute` (`998, 505, rx:105, ry:35`)。
* **引擎與檢驗工作台旋轉橢圓擴充**：
  * 在 `spotterData.js` 的相異點定義中引入 `rotate` 參數（例如 `rotate: -14`）。
  * 在 `SpotterScene.jsx` 與 `SpotterTestWorkbench.jsx` 實裝反向旋轉點擊判定幾何學：
    $$\begin{pmatrix} dx' \\ dy' \end{pmatrix} = \begin{pmatrix} \cos(-\theta) & -\sin(-\theta) \\ \sin(-\theta) & \cos(-\theta) \end{pmatrix} \begin{pmatrix} x - c_x \\ y - c_y \end{pmatrix}$$
    並檢驗點擊是否滿足 $\left(\frac{dx'}{r_x}\right)^2 + \left(\frac{dy'}{r_y}\right)^2 \le 1.0$。
  * SVG 判定外框支援 `transform="rotate(\theta, cx, cy)"`，檢驗工作台視覺呈現與點擊反饋達到像素級精準。
* **資源更新與測試驗證**：
  * 重新產出全冊次 56 張 650×276 高解析局部對照圖與 7 幅全景標籤對照圖。
  * `npm run lint` 0 errors，`npm run build` 打包順暢。
  * `scripts/smoke_test.mjs`（14 款遊戲 4 身分）與 `scripts/test_spotter_workbench.mjs` 均 100% 通過。
  * 遵照 Mark 規範：既有場景校準驗收通過，後續所有新場景統一朝 A 方案（動態 Slot 變異 + 8 選 5）標準化施作。

#### 18. 鷹眼神探 雙圖視野最大化、精簡單列 HUD、變異工作台 5 擊隱藏彩蛋與 Word Bank 預設無中文緊湊排版 (`VocabSpotterGame.jsx`, `SpotterWordBank.jsx`, `SpotterScene.jsx`)
* **背景與專案負責人 Mark 重點指示**：
  * 舊圖已全數校準驗收完畢，新圖全數朝動態 A 方案推進。
  * 針對遊戲內畫面進行極致瘦身：縮小上下多餘冗餘文字，將可視範圍最大化給左右雙圖。
  * 遊戲內頂部第一列：回大廳、放大鏡圖標、鷹眼神探（4 字，手機僅剩圖標）、第一冊（手機僅剩「一」）、愛心、進度、秒數、放大鏡、提示、換題。
  * 變異工作台改為 Mark 專屬隱藏入口（放大鏡圖標點 5 下直通）。
  * 移除手動場景切換按鈕（點換題自動切換場景）與場景長文本說明；整列拿掉 6 大相異類型橫幅。
  * 下方 Word Bank 預設不顯示中文翻譯，顯示中文按鈕整併在狀態列靠右處，極致壓縮卡槽垂直高度。
  * 手機直立版精簡所有說明文字，避免大段前言造成學生每次開遊戲都要下滑。
* **重構成果**：
  1. **頂部控制列（HUD）單列極簡化**：整合回大廳、放大鏡圖標、鷹眼神探、冊次徽章、愛心條、進度、秒數、放大鏡檢視、提示與換題於單一精緻橫幅，桌面與平板 100% 單行不換行。
  2. **放大鏡 5 連擊直通彩蛋**：`secretClicksRef` 監聽放大鏡圖標，2 秒內連點 5 下播放提示音並無縫跳轉 `/spotter-test` 變異工作台，從公開介面徹底拔除突兀的工作台按鈕。
  3. **垂直視野釋放 > 150px**：剔除場景副標題、場景切換標籤與 6 大相異類型橫幅列，雙圖畫卷向上提昇，視野面積顯著放大。
  4. **Word Bank 預設純英文無中文卡片**：預設不渲染中文釋義行，單字卡高度大幅收緊 35%；在「點擊不扣心」狀態列靠右處整併 `[📖 顯示中文]` 膠囊按鈕供自主切換。
  5. **手機直立視圖優化**：雙圖排版升級為 `grid-cols-1 landscape:grid-cols-2 md:grid-cols-2`。在手機直立方向下自然呈現「上圖 vs 下圖」雙層堆疊，頂部角標自動切換為「上圖 / 下圖」；在手機橫向、摺疊機展開或電腦寬螢幕下呈現「左圖 vs 右圖」，頂部角標無縫切換為「左圖 / 右圖」。

#### 19. 鷹眼神探 第 2 冊場景 2【日本京都花見小路與職人小鎮】A 方案動態 8 選 5 補丁引擎實裝 (`spotterData.js`, `SpotterScene.jsx`, `SpotterTestWorkbench.jsx`, `public/assets/spotter/*`)
* **背景與專案負責人 Mark 規範**：
  * 舊圖已全數校準驗收完畢，第 2 冊起所有新圖全面採用 A 方案（動態 Slot 8 選 5 補丁合成技術）。
  * 左右兩圖未被抽選中的 3 個目標在右圖不疊加補丁，保持與左圖 100% 完全相同（型態 A），徹底杜絕任何 AI 背景幻覺與幽靈差異誤扣心。
* **場景規格與精確單字槽位**：
  * **主題**：日本京都花見小路與職人小鎮（1376×768 3D 立體紙雕 diorama）。
  * **8 大相異目標與幾何槽位**：
    1. `cup` (茶杯，`x: 146, y: 595, rx: 58, ry: 48`)：茶屋木長凳托盤上的白瓷茶杯轉為綠釉抹茶陶杯。
    2. `bed` (榻榻米床鋪，`x: 318, y: 230, rx: 115, ry: 52`)：町家二樓臥室日式榻榻米布團轉為木床架被褥。
    3. `umbrella` (和傘，`x: 468, y: 536, rx: 118, ry: 78`)：戶外歇腳處展開之大紅番傘轉為金黃油紙傘。
    4. `doll` (博多人偶，`x: 583, y: 422, rx: 48, ry: 72`)：街角日式展示木櫃內精緻和服娃娃轉為木芥子娃娃。
    5. `fish` (錦鯉，`x: 910, y: 694, rx: 72, ry: 38`)：右下方石疊步道旁清澈錦鯉池紅白錦鯉轉為金黃錦鯉。
    6. `fan` (京折扇，`x: 1072, y: 432, rx: 88, ry: 48`)：右側工藝品攤位展示架金箔折扇轉為櫻花折扇。
    7. `bird` (白腹琉璃，`x: 1231, y: 141, rx: 78, ry: 68`)：右上方木造町家屋簷櫻花枝頭棲息之小鳥羽色與動態轉換。
    8. `box` (桐木手作工藝盒，`x: 1277, y: 531, rx: 78, ry: 58`)：右下石台展示之原色桐木盒轉為深黑漆器彩繪錦盒。
  * **兩兩空間零交疊檢驗**：8 處目標分佈於不同景深與方位，最小間距為 umbrella 與 doll（162px），全場景交疊數嚴格為 0。
* **羽化透明補丁生成與實裝**：
  * 透過 Sharp 批次擷取 8 處羽化邊緣 PNG 透明補丁（`public/assets/spotter/patches/b2_s2/`）。
  * `SpotterScene.jsx` 升級支援動態 Slot 渲染：左圖使用底圖，右圖以相同底圖為基底，僅針對本局隨機抽中的 5 個有效目標疊加羽化補丁，未選中的 3 個目標與周圍所有背景在左右兩圖完全一致（相同型態 A）。
* **QA 檢驗工作台升級**：
  * `/spotter-test` 支援 Book 2 圖 1 與圖 2 切換。
  * 生成 8 組 650×276 高解析單字顯微對比卡（`public/assets/spotter/crops/b2_s2/`）與全幅判定框對照圖。
  * 藍圖總覽（Master Roadmap）更新 Book 2 Scene 2 為「⚡ 動態 Slot 實裝就緒」。

#### 20. 鷹眼神探 第 2 冊場景 2【京都職人小鎮】變異型態 Variant B 與 C 擴充實裝 (`spotterData.js`, `SpotterTestWorkbench.jsx`, `public/assets/spotter/*`)
* **背景與專案負責人 Mark 工作流規範**：
  * 遵照 Mark 指示：「變異型態 BCD 等可以一次出完，因為這樣符合同一張底圖的工作流。但若該位置變化不適合 CDE 或不適合 BD 就不用勉強，不是每個物品都一定要四五種變化」。
  * 自然篩選 7 處具備高品質 Variant C 的目標（茶杯、和傘、人偶、錦鯉、折扇、小鳥、點心盒），而 2F 和室床鋪（bed）換至櫻粉櫻花和室被鋪後即維持最和諧飽滿狀態，不勉強湊第 4 種，兼顧藝術協調與單元教學自然度。
* **全新擴充變異補丁與型態清單**：
  1. `cup` (茶杯)：
     * Base: 白瓷茶杯 $\to$ Var A: 綠釉抹茶陶杯 $\to$ Var B: 朱紅漆器茶托杯 $\to$ Var C: 紫砂陶茶杯。
  2. `bed` (榻榻米床鋪)：
     * Base: 暖黃藺草蓆被鋪 $\to$ Var A: 青藍浪紋日式被鋪 $\to$ Var B: 櫻粉櫻花棉褥和室被鋪 (自然 3 型態)。
  3. `umbrella` (和傘)：
     * Base: 緋紅蛇目油紙傘 $\to$ Var A: 紫羅蘭碎花和傘 $\to$ Var B: 陽光金黃節慶和傘 $\to$ Var C: 青竹翠綠和傘。
  4. `doll` (木芥子人偶)：
     * Base: 紅色和服木芥子 $\to$ Var A: 藍條紋鳴子人偶 $\to$ Var B: 招財貓木雕人偶 $\to$ Var C: 金黃達摩吉祥木偶。
  5. `fish` (錦鯉)：
     * Base: 紅白相間錦鯉 $\to$ Var A: 水墨黑白斑紋錦鯉 $\to$ Var B: 金黃招財黃金錦鯉 $\to$ Var C: 碧藍錦鯉與翠綠荷葉。
  6. `fan` (摺扇)：
     * Base: 櫻花金箔摺扇 $\to$ Var A: 富士山青藍摺扇 $\to$ Var B: 秋季金黃銀杏圓團扇 $\to$ Var C: 素雅紫藤水墨摺扇。
  7. `bird` (小鳥)：
     * Base: 翠綠枝頭小雀鳥 $\to$ Var A: 雪白灰羽小鳥 $\to$ Var B: 暖橘紅喉知更鳥 $\to$ Var C: 靛藍琉璃鳥。
  8. `box` (點心盒)：
     * Base: 原色桐木工藝盒 $\to$ Var A: 黑漆描金點心盒 $\to$ Var B: 朱紅櫻花禮品盒 $\to$ Var C: 雙層竹編精緻點心籠。
* **工作台多型態交互檢視支援 (`SpotterTestWorkbench.jsx`)**：
  * **模式 1 (全幅雙圖對照)**：右上角提供「變異 A / 變異 B / 變異 C」切換膠囊，一鍵切換整幅成對變異全圖。
  * **模式 2 (顯微驗收矩陣)**：
    * 頂部提供全域「批次切換型態：變異 A / 變異 B / 變異 C」一鍵同步。
    * 每張單字卡獨立提供 `[Base]`、`[Var A]`、`[Var B]`、`[Var C]` 互動切換膠囊，點選可立即檢視該變異型態的高解析裁切對比圖與詳細變異描述。
  * **模式 3 (動態 8 選 5 抽題模擬器)**：
    * 每次隨機抽題時，抽中的 5 個目標自動從其已就緒的變異補丁庫（Var A、Var B、Var C）中隨機分派型態，並即時於目標清單標註（如 `茶杯 (變異 B • 朱紅漆器茶托杯)`），達成上百種排列組合之動態體驗。
* **測試與驗證**：
  * 全套 15 款羽化透明補丁（`public/assets/spotter/patches/b2_s2/`）與對應對照卡全數生成就緒。
  * `npm run lint` 0 錯誤、`npm run build` 通過、`scripts/smoke_test.mjs`（14 款遊戲 4 身分）與 `test_spotter_workbench.mjs` 均 100% 通過。

#### 21. 鷹眼神探 第 3 冊場景 2【瑞士阿爾卑斯湖畔與木屋野餐台】A 方案動態 8 選 5 多型態 (Var A/B/C) 全量實裝與校準 (`spotterData.js`, `SpotterTestWorkbench.jsx`, `public/assets/spotter/*`)
* **背景與課綱單字配置**：
  * 遵照 Mark 規範與「同一底圖工作流一次出完自然不勉強」原則，推進 Here We Go 第 3 冊（四年級上學期）場景 2。
  * **主題**：瑞士阿爾卑斯湖畔與木屋野餐台（Swiss Alpine Lake & Chalet Picnic Terrace，1376×768 3D 立體紙雕 diorama）。
  * **8 大相異目標（100% 符合第 3 冊課綱核心單字，經 Mark 指導完成二度精準校準）**：
    1. `cloud` (白雲，`x: 410, y: 100, rx: 110, ry: 65`)：
       * 原圖雲朵位於中央偏左山巔。Mark 裁示將判定框往右移統一覆蓋白雲，並將變異 A 之彩虹徹底移除，改為前後兩層立體疊加白雲。
       * Base: 單層棉花白雲 $\to$ Var A: 前後雙層疊加白雲 (無彩虹) $\to$ Var B: 夕陽金霞雲 $\to$ Var C: 愛心夢幻雲。
    2. `milk` (牛奶，`x: 124, y: 493, rx: 50, ry: 75`)：Base 玻璃奶瓶 $\to$ Var A: 藍白紙盒牛奶 $\to$ Var B: 肉桂熱牛奶 $\to$ Var C: 吸管隨行杯。
    3. `tea` (茶，`x: 440, y: 584, rx: 75, ry: 58`)：Base 琥珀熱紅茶 $\to$ Var A: 薄荷綠茶杯 $\to$ Var B: 黃檸檬冰茶 $\to$ Var C: 茶包馬克杯。
    4. `sandwich` (三明治，`x: 648, y: 553, rx: 72, ry: 52`)：Base 雙層三明治 $\to$ Var A: 法式潛艇堡 $\to$ Var B: 火腿可頌堡 $\to$ Var C: 芝麻貝果堡。
    5. `rice` (飯糰，`x: 820, y: 553, rx: 58, ry: 52`)：Base 海苔三角飯糰 $\to$ Var A: 櫻花醃漬飯糰 $\to$ Var B: 瓷碗香米飯 $\to$ Var C: 醬油烤飯糰。
    6. `watermelon` (西瓜，`x: 980, y: 625, rx: 90, ry: 80`)：
       * 校正原誤植之草叢花叢座標，精準框定右側木長凳白瓷盤上的西瓜。
       * Base: 紅肉切片西瓜 $\to$ Var A: 金黃小玉切片西瓜 $\to$ Var B: 條紋完整西瓜 $\to$ Var C: 薄荷西瓜切塊。
    7. `water` (水壺，`x: 1228, y: 468, rx: 48, ry: 80`)：Base 玻璃冷水壺 $\to$ Var A: 金屬保溫水壺 $\to$ Var B: 高腳氣泡水杯 $\to$ Var C: 刻度運動水瓶。
    8. `orange` (柳橙，`x: 1240, y: 680, rx: 90, ry: 60`)：
       * 校正原誤疊至長凳西瓜之座標，精準框定右下方木棧露台木碗中的柳橙。
       * Base: 鮮採綠葉甜橙 $\to$ Var A: 晶透切片輪盤 $\to$ Var B: 剝開飽滿橙瓣 $\to$ Var C: 編籃黃金大橙。
  * **兩兩空間零交疊檢驗**：8 物件 28 組對距全部經過嚴格幾何演算法驗證，最小淨間距 $\ge 30$px，總交疊數嚴格為 0。
* **動態合成與工作台支援**：
  * 生成全套 24 款羽化透明 PNG 補丁（`public/assets/spotter/patches/b3_s2/`）與高解析裁切對比卡（`public/assets/spotter/crops/b3_s2/`）。
  * 生成全幅標籤判定外框圖（`book3_scene2_side_by_side_boxes.jpg`、`_varb.jpg`、`_varc.jpg`）。
  * 工作台（`/spotter-test`）支援第 3 冊圖 1 與圖 2 切換、全幅成對變異底圖切換、顯微矩陣多型態卡片互動切換、以及動態 8 選 5 抽題模擬器。
  * 藍圖總覽（Master Roadmap）更新進度為「11 場景已就緒 / 29 場景排程中」。
* **景深層次與物件分布空間架構原則 (Mark 指導原則)**：
  * **反思與洞見**：Mark 指出大景深構圖中，若所有目標物件過度集中在前景平台（露台桌椅），會導致「天上物件無遮蔽、前景過密、中景空泛」。
  * **後續新圖規範 (自 Book 4 Scene 2 起實施)**：構圖前預先規劃「三層景深停靠點（Foreground / Midground / Background Depth Anchors）」，例如街景之近景長椅/路燈、中景商店櫥窗/巴士車窗/遮雨棚、遠景鐘樓/摩天輪/橋纜，讓 8 個物件自然錯落分布於不同景深層次，兼具視覺平衡、故事性與解謎樂趣。

#### 22. 鷹眼神探 第 4 冊場景 2【倫敦泰晤士河畔與皇家地標公園街景】A 方案動態 8 選 5 多型態 (Var A/B/C) 全量實裝與三層景深架構實踐 (`spotterData.js`, `SpotterTestWorkbench.jsx`, `public/assets/spotter/*`)
* **背景與課綱單字配置**：
  * 貫徹 Mark 指導之「近、中、遠三層景深空間架構原則」，成功打破前代全部集中在前景平台的侷限。
  * **主題**：倫敦泰晤士河畔與皇家地標公園街景（London Thames Riverside & Royal Landmark Plaza，1376×768 3D 立體紙雕 diorama）。
  * **8 大相異目標（100% 符合第 4 冊課綱核心單字，依三層景深自然停靠，零交疊零死角）**：
    1. **前景層 (Foreground)**：
       * `chair` (椅子，`x: 185, y: 598, rx: 140, ry: 110`)：Base 墨綠英倫長椅 $\to$ Var A: 白色維多利亞鐵藝雕花椅 $\to$ Var B: 暖木色實木單人椅佐蘇格蘭格紋軟墊 $\to$ Var C: 熱情亮紅街角咖啡館金屬椅。
       * `table` (桌子，`x: 635, y: 620, rx: 80, ry: 90`)：Base 原木咖啡圓桌 $\to$ Var A: 白色波浪蕾絲桌巾 $\to$ Var B: 彩色地中海馬賽克瓷磚拼花六角桌 $\to$ Var C: 原木風粗獷方型野餐實木小桌。
       * `bag` (提包，`x: 890, y: 635, rx: 85, ry: 85`)：Base 焦糖皮質公事包 $\to$ Var A: 橄欖綠帆布休閒後背包 $\to$ Var B: 海軍藍深紅英式硬挺學生雙肩包 $\to$ Var C: 復古刺繡提花大容量托特包。
       * `basket` (提籃，`x: 1210, y: 645, rx: 100, ry: 90`)：Base 蜂蜜色藤編野餐籃 $\to$ Var A: 盛滿薰衣草與玫瑰白鐵絲花籃 $\to$ Var B: 裝滿鮮紅蘋果與香酥英式糕點深褐色藤籃 $\to$ Var C: 原色竹編圓弧提把野餐購物提籃。
    2. **中景層 (Midground)**：
       * `hat` (帽子，`x: 383, y: 219, rx: 65, ry: 80`)：Base 路燈臂黑色圓頂禮帽 $\to$ Var A: 金棕毛呢獵鹿帽 $\to$ Var B: 米白平頂草帽佐海軍藍緞帶 $\to$ Var C: 深墨綠針織圓頂禮帽佐羽毛。
       * `bus` (公車，`x: 540, y: 322, rx: 115, ry: 80`)：Base 經典紅雙層巴士 $\to$ Var A: 皇家海軍藍觀光巴士 $\to$ Var B: 復古奶油白與酒紅雙層敞篷巴士 $\to$ Var C: 銀亮金屬流線雙層油電巴士。
       * `box` (禮盒，`x: 885, y: 382, rx: 90, ry: 70`)：Base 石欄基座紫色金緞帶禮盒 $\to$ Var A: 英倫花草彩繪鐵盒茶罐 $\to$ Var B: 溫潤紅木雕花珠寶盒佐黃銅鎖扣 $\to$ Var C: 亮麗英國米字旗彩繪金屬紀念盒。
    3. **遠景層 (Background)**：
       * `clock` (時鐘，`x: 1147, y: 153, rx: 75, ry: 75`)：Base 遠景大笨鐘金色羅馬鐘面 $\to$ Var A: 珍珠白簡約夜光鐘面 $\to$ Var B: 維多利亞墨綠底金漆花絲古典鐘面 $\to$ Var C: 夕陽暖橘金色背光三點鐘下午茶鐘面。
  * **精確像素差分與零交疊驗證**：8 目標 28 組兩兩外圍間距全部為正數，總交疊數為 0 (`TOTAL OVERLAPS: 0`)。
* **動態合成與工作台支援**：
  * 生成全套 24 款羽化透明 PNG 補丁（`public/assets/spotter/patches/b4_s2/`）與清晰 650x276 雙聯特寫對比卡（`public/assets/spotter/crops/b4_s2/`）。
  * 生成全幅標籤判定外框圖（`book4_scene2_side_by_side_boxes.jpg`、`_varb.jpg`、`_varc.jpg`）。
  * 工作台（`/spotter-test`）支援第 4 冊圖 1（英倫家居）與圖 2（泰晤士皇家地標廣場）快速切換、成對底圖與動態 8 選 5 抽題模擬器。
  * 藍圖總覽（Master Roadmap）更新進度為「12 場景已就緒 / 28 場景排程中」。

#### 23. 找不同高階繪圖規範確立：已學單字全環境融入與真實視覺干擾物架構 (Mark 指導原則) 及 Vercel 部署禁令
* **核心遊戲性缺陷反思 (Mark 深度指導)**：
  * Mark 指出：若畫面中「除了欲測的 8 個單字外，完全沒有其他可辨識之單字物件」，學生只要照著單字庫把畫面上僅有的 8 個東西各點一遍即通關，失去「找不同」的搜索與細部比對精神。尤其在四、五、六年級中高年級教材中，缺乏足夠的細節與干擾物，無法體現「鷹眼神探」的探索價值。
* **高階繪圖新規範 (自後續新圖起全面落實)**：
  1. **全單字庫背景融入 (15～25 個背景靜態已學物件)**：
     * 畫面構圖時，必須將學生已經學過的單元（包含本冊其他單元以及**所有前冊**單字，如低年級學過的 `dog`, `cat`, `bird`, `apple`, `book`, `pencil`, `bike`, `umbrella`, `boat`, `tree`, `flower`, `ball` 等）作為自然景物畫入背景。
     * 這些背景物件在左右兩圖**完全靜態、左右保持 100% 相同像素（不發生變異）**。
  2. **真實可見的干擾選項 (Real Visible Distractors)**：
     * Word Bank 提供的干擾單字（Distractors）不再是畫面中不存在的單字，而是學生**在畫面上確實能看見該物體、但仔細比對後發現左右完全相同**的已學單字。
     * 學生必須同時進行「視覺搜索＋單字對應＋微觀比對」，徹底杜絕「看字點物」的無腦通關現象。
* **Vercel 推送禁令生效**：
  * 因 Vercel Hobby 方案構建額度有限，日常微調頻繁推送容易導致配額耗盡。正式確立：**日常開發嚴格禁止執行 `git push vercel`**，所有發布與構建一律由 Cloudflare Pages (`origin/main`) 承載；僅在重大里程碑經 Mark 裁示時方可推送 Vercel。

#### 24. 鷹眼神探 第 5 冊場景 2【巴黎蒙馬特小丘畫家村與聖心堂露天咖啡街】A 方案動態 8 選 5 多型態 (Var A/B/C) 全量實裝與單字普及覆蓋率實踐 (`spotterData.js`, `SpotterTestWorkbench.jsx`, `public/assets/spotter/*`)
* **單字範圍權威準則與涵蓋率審查 (Mark 指導原則)**：
  * **最高選詞準則**：
    1. **必出現範圍**：翰林《Here We Go》第 1～8 冊教材核心單字。
    2. **可出現、可練習範圍**：教育部國民中小學基本 1,200 核心單字。
    3. **超出規範者嚴禁入題**：原暫訂之高中級別字 `palette`（調色盤）經 Mark 指示正名汰除，完美替換為教育部 1,200 核心單字 **`brush`（畫筆）**。
  * 全面清查既有場景目標字頻率，淘汰高頻重複詞（如 `bird` 4次, `umbrella` 4次, `bag` 3次），保留其作為真實靜態背景。
  * 精選 8 大五年級藝文、活動與生活核心欲測單字，歷史平均出題次數降至 **0.88 次**：
    - `brush` (畫筆, 0 次初登場，教育部 1200 核心字)
    - `guitar` (木吉他, 0 次初登場)
    - `bell` (銅鐘, 0 次初登場)
    - `camera` (相機, 1 次)
    - `painting` (畫作, 1 次)
    - `bread` (長棍麵包, 1 次)
    - `flag` (法國三色旗, 1 次)
    - `cake` (法式蛋糕, 2 次)
* **16 個 100% 靜態背景干擾單字融入（真實世界剪影，拒絕生硬風箏）**：
  * `cat` (黑貓), `dog` (法鬥), `bike`, `book`, `cup`, `flower`, `tree`, `car` (雪鐵龍 2CV), `chair`, `table`, `bag`, `lamp`, `bird` (白鴿), `apple`, `clock`, `umbrella`。
  * 左右圖在非欲測區完全靜態，100% 像元鎖定不變。
* **三大多態變異 (Variants A / B / C) 與 24 羽化補丁全量產出**：
  * 產出 `book5_scene2_base.jpg`, `book5_scene2_diff.jpg`, `book5_scene2_diff_varb.jpg`, `book5_scene2_diff_varc.jpg` (1376x768)。
  * 產出 24 個透明羽化 PNG 補丁 (`public/assets/spotter/patches/b5_s2/`) 與 24 張特寫比較卡 (`public/assets/spotter/crops/b5_s2/`)。
* **判定框精密校準（Mark 深度驗收反饋）**：
  * 遵照 Mark 指導：「畫架的判定框再低一些，要含括整個畫布。其餘均通過。」
  * `painting` 判定框精準下調並延伸垂直半徑：由 `(x: 765, y: 385, rx: 70, ry: 100)` 調整為 `(x: 765, y: 415, rx: 78, ry: 115)`，頂部至 `y = 300`、底部延伸至 `y = 530`，將整個畫布本體與下方木畫架托架完整涵蓋，徹底避免學生點擊畫作下緣判定無效之情形。
* **幾何驗證零交疊**：
  * 全數 28 對幾何距離均維持正距，`painting` 與下方大理石桌上的 `cake` 垂直淨距保持 50.3px，全圖最小間隙為 24.9px (`guitar` <-> `brush`)，Total Overlaps = 0 / 28 pairs。
* **進度里程碑**：
  * 累積就緒關卡達到 **13 / 40**！
  * B5S2（巴黎蒙馬特小丘畫家村）經 Mark 審查全項通過！

#### 25. 鷹眼神探 第 6 冊場景 2【新加坡濱海灣花園超級樹與戶外美食步道】A 方案動態 8 選 5 實裝與下輪交接規範儲備 (`spotterData.js`, `SpotterTestWorkbench.jsx`, `public/assets/spotter/*`)
* **單字選用最高權威階層規範 (Mark 確立之最高準則)**：
  1. **必出現範圍 (Mandatory Scope - 首選題目)**：翰林《Here We Go》第 1～8 冊教材核心單字。
  2. **可出現、可練習範圍 (Permissible Scope - 次選題目)**：教育部國民中小學基本 1,200 核心單字。
  3. **超綱詞彙嚴格禁令**：超出教育部 1,200 字與 Here We Go 教材之高中、成人或專門領域單字（如原暫訂之 palette），一律禁止作為題目！
* **找不同繪圖與遊戲性高階規範 (Mark 核心指導原則)**：
  1. **拒絕「看字點物」**：整張圖絕不能只有 8 個目標物。必須將學生已學過的單元（包含本冊與前冊 15～25 個單字）作為自然景物畫入背景。
  2. **真實可見的靜態干擾物 (Real Visible Distractors)**：左右兩圖的背景物件保持 100% 相同像元（絕對不發生變異）。Word Bank 的干擾選項必須是畫面中真實存在的背景物件，迫使學生同時進行視覺搜索、單字對應與細節比對。
  3. **自然三層景深錨定 (Foreground / Midground / Background)**：避免物件過度集中在前景平台，遠景地標/天空、中景建築/車輛/雕塑、近景桌椅/道具錯落有致。
  4. **因地制宜、真實世界剪影 (Diegetic Realism)**：道具必須契合地景故事，絕不在不合理場景硬塞風箏或紙箱。
  5. **場景特例規範**：博物館展館內嚴格禁止畫食物 (`No food inside museum`)。
* **第 6 冊場景 2 主題與目標配置（方案 A：新加坡超級樹與戶外美食步道）**：
  * **主題**：新加坡濱海灣花園超級樹與戶外美食步道 (Singapore Gardens by the Bay & Waterfront Promenade，1376x768 3D 立體紙雕 diorama)。
  * **課本出處**：Book 6 Unit 3（食物與渴餓：`noodles`, `soup`, `salad`, `water`）＋ Culture Explore（新加坡超級樹 Supertrees、魚尾獅 Merlion）。
  * **8 大相異目標物（100% 符 Here We Go 6 或教育部 1200 字）**：
    1. **前景層**：`noodles` (麵條，B6 U3)、`salad` (沙拉，B6 U3)、`soup` (熱湯，B6 U3)、`water` (隨身水瓶，B6 U3)、`fan` (手持小風扇，熱帶避暑必備，教育部 1200 字)。
    2. **中景層**：`statue` (噴水魚尾獅雕像，B6 探索單元)、`boat` (觀光遊船/復古駁船，教育部 1200 字)、`tree` (熱帶雞蛋花樹/超級樹，B6 U3)。
  * **16 個完全靜態背景已學干擾物**：
    * `bird`, `cat`, `dog`, `bike`, `cup`, `table`, `chair`, `bag`, `lamp`, `bridge`, `clock`, `flower`, `umbrella`, `box`, `apple`, `book`。
* **未來方案儲備庫（留待下一輪討論之候選企劃）**：
  * **【方案 B：肯亞馬賽馬拉非洲大草原探險營地 (Kenya Safari Camp)】**：
    * **課本對應**：Book 6 Unit 4（野生動物與冒險：斑馬、大象、午餐炸雞、後背包、太陽眼鏡掉落情節）＋ Culture Explore（肯亞非洲大五霸）。
    * **核心目標單字**：`zebra` (斑馬), `chicken` (烤雞), `sunglasses` (墨鏡), `backpack` (登山包), `tent` (帳篷), `jeep/truck` (越野車), `hat` (探險帽), `lion` (獅子)。
    * **靜態背景物**：金合歡樹、犀鳥、遠景大象、野營折疊桌、導演椅、露營鋼杯、望遠鏡、煤油營燈。
  * **【Book 7 候選方案：威尼斯水都大運河貢多拉與聖馬可廣場 (Venice Grand Canal)】**：
    * 對應教材：Book 7 Unit 1~4（交通工具、旅行明信片、相機、地圖）。
  * **【Book 8 候選方案：紐約中央公園與時代廣場畢業旅行 (New York Central Park)】**：
    * 對應教材：Book 8 Unit 1~4（四季、畢業、活動、城市生活）。

#### 26. 鷹眼神探 本冊核心單字出題本位主義與全景背景豐富化規範 (Mark 核心指導原則)
* **本冊單字出題本位主義 (True Within-Book Testing Principle)**：
  * **有效出題定義**：該冊單字必須在該冊找不同單元遊戲中以相異目標出現，才算達成有效涵蓋。
  * **杜絕跨冊充數**：絕不能將某冊單字分散在其他冊次出現，就視為該單元已出題過。
  * **跨冊出現之教育意義**：某單字若跨冊出現在其他冊次中，代表其為「高頻核心學習單字」（如生活高頻字），但其原生冊次仍負有在該冊找不同遊戲中涵蓋與驗收的教學責任。
  * **第三圖 (Round 3) 規劃準則**：往後進入下一輪第 3 場景規劃時，必須嚴謹審酌該冊單字是否已在本冊範圍內盡量含括並充分出題。
* **全景背景豐富化與真實視覺干擾 (Avoid Sparse 8-Object Scenes)**：
  * 學過的單字以及先前較少登場的單字，均應大量自然融入作為背景景物，堅決避免全圖「只有 8 個物件」的稀疏感。
  * 這些背景物件在左右兩圖 **100% 保持相同像素（絕對不變異）**，並作為 Word Bank 干擾選項，迫使學生進行高階視覺搜索與細微比對。
* **第 7 冊場景 2 確立配置（方案 A：都會現代捷運轉運站與景觀大道）**：
  * **8 大欲測目標（100% 第 7 冊原生單字，全部 0 次初登場，杜絕 clock, camera, flower, fan, bus, bag）**：
    1. `metro`（高架捷運列車 / 現代地鐵車廂，B7 U2）
    2. `taxi`（計程車，B7 U2）
    3. `car`（自用休旅車，B7 U2）
    4. `scooter`（機車 / 速克達，B7 U2）
    5. `bike`（自行車 / 共享單車站架，B7 U2）
    6. `ticket`（自動售票機出票口捷運車票 / 票卡，B7 U2/U3 & 教育部1200）
    7. `sandwich`（露天轉運吧台切片三明治，B7 Starter）
    8. `soda`（吧台蘇打汽水瓶，B7 Starter）
  * **18 個 100% 靜態背景干擾單字融入**：
    * `dog`（導盲柴犬）、`cat`（街角長椅貓咪）、`bird`（廣場白鴿）、`tree`（林蔭路樹）、`chair`（長椅）、`table`（吧台咖啡桌）、`lamp`（太陽能街燈）、`umbrella`（遮陽傘）、`backpack`（旅客背包）、`book`（閱讀書本）、`cup`（咖啡紙杯）、`clock`（轉運站時鐘）、`box`（木箱）、`ball`（草坪球類）、`apple`（水果籃蘋果）、`hat`（遮陽帽）、`bridge`（天橋）、`map`（導覽地圖看板）。
  * **全目標判定座標與幾何（Mark 校驗定案）**：
    * `metro`: `x: 423, y: 185, rx: 258, ry: 40, rotate: 4.8`（配合高架軌道 4.8° 斜度，以寬扁旋轉橢圓含括全列 3 節車廂，端到端 516px 完美貼合）
    * `taxi`: `x: 650, y: 405, rx: 75, ry: 45`（轉運車道計程車）
    * `car`: `x: 940, y: 435, rx: 88, ry: 80`（右側車道休旅/電動車，往上擴大完整含括車頂行李架與全車身）
    * `scooter`: `x: 1205, y: 460, rx: 68, ry: 60`（右側路旁機車）
    * `bike`: `x: 560, y: 550, rx: 72, ry: 82`（中央廣場共享單車，往上擴大完整含括手把與車籃）
    * `ticket`: `x: 350, y: 470, rx: 24, ry: 22`（售票機票卡）
    * `sandwich`: `x: 250, y: 655, rx: 46, ry: 30`（轉運吧台切片三明治）
    * `soda`: `x: 340, y: 585, rx: 32, ry: 78`（吧台氣泡汽水瓶，上下擴大含括整瓶汽水吸管與底座，與三明治維持 38px 零重疊淨空間）
    * **幾何防重疊驗證**：28 對兩兩目標外緣間距 $\ge 16.8$px（sandwich 與 soda 間隙 38.0px），總重疊數為 **0**。
    * **動態羽化圖層 (Method A)**：由 `scripts/build_b7_s2_assets.cjs` 產生 24 款透明 PNG 羽化補丁，支援旋轉橢圓遮罩，基準靜態背景 100% 絕對一致。同時輸出無標籤版比對圖（`book7_scene2_clean_boxes.jpg`）。

#### 27. 第 8 冊場景 2 確立配置（紐約第五大道時尚名店街）與情境協調反硬塞原則
* **情境協調與反硬塞原則 (Organic Context Harmony Principle - Mark 核心指示)**：
  * **拒絕機械式湊單字**：靜態背景干擾單字必須嚴格服膺於場景自然世界觀與環境邏輯，絕不為了強湊單字而讓不協調的物件（如頂級名店街硬放流浪貓狗或農場物品）為出現而出現。
  * **第五大道自然背景單字**：挑選 14 個 100% 契合紐約精品大道與露天咖啡座的已學單字：`taxi`（黃色計程車）、`car`（黑轎車）、`bus`（觀光巴士）、`gift`（精品禮物盒）、`box`（鞋履收納盒）、`bag`（精品手提袋）、`chair`（法式咖啡椅）、`table`（大理石圓桌）、`lamp`（古典黑鐵街燈）、`umbrella`（咖啡座遮陽傘）、`tree`（林蔭景觀盆景）、`cup`（骨瓷咖啡杯）、`clock`（街角名牌立鐘）、`book`（時尚精裝雜誌）。徹底剔除貓狗等突兀動物。
* **8 大相異目標（100% 第 8 冊原生單字，依據 Mark 指示完成精確校準，全部 0 次初登場）**：
  1. `suit`：`x: 280, y: 305, rx: 75, ry: 130`（左側櫥窗西裝人台，上下左右大幅擴展包覆整件深藍西裝領口、袖管與下擺）
  2. `jacket`：`x: 500, y: 365, rx: 85, ry: 120`（立架皮夾克，大幅擴大包覆整件棕色飛行夾克羊羔毛大翻領、左右袖管與拉鍊）
  3. `skirt`：`x: 140, y: 440, rx: 70, ry: 115`（左側人台粉色百褶裙，大幅往上延伸至腰際並往左擴大包覆整件百褶裙裙擺）
  4. `jeans`：`x: 235, y: 565, rx: 72, ry: 45`（展示木桌牛仔褲，大幅往左延伸至裙子下方，完整包覆整疊牛仔褲皮標、車線與後口袋）
  5. `blanket`：`x: 815, y: 515, rx: 70, ry: 105`（校準定位至露天咖啡椅背，包覆整件英倫紅黑格紋流蘇毛毯）
  6. `glass`：`x: 958, y: 565, rx: 32, ry: 65`（校準往右平移至露天大理石桌，精準框住整只透明八角冰晶長飲杯）
  7. `toast`：`x: 1085, y: 610, rx: 80, ry: 50`（校準定位至大理石桌餐盤，完整框住整盤金黃烤吐司與奶油邊緣）
  8. `peach`：`x: 1170, y: 505, rx: 45, ry: 55`（校準定位至右方金色甜點高腳托盤，精準框住整顆粉嫩鮮採水蜜桃與綠葉）
* **幾何防重疊驗證**：全部 28 對兩兩目標外緣淨間距 $\ge 15.7$px（skirt 與 jeans 間隙 15.7px，suit 與 skirt 間隙 19.6px），**總重疊數：0**。
* **動態圖層羽化補丁 (Method A)**：由 `scripts/build_b8_s2_assets.cjs` 產生 24 款透明 PNG 羽化補丁，基準靜態背景 100% 絕對一致。同時輸出純淨校準對比圖（`book8_scene2_clean_boxes.jpg`）。
* **全系列 1~8 冊第 2 場景完成度**：**16 / 40 場景全面就緒（達成率 40%）**！


---

### 四、核心目錄與關鍵模組結構

```
src/
├── App.jsx                       # 主路由狀態機、全局 ErrorBoundary、各功能路由
├── components/
│   ├── Lobby.jsx                 # 大廳、年級切換、14 款遊戲入口、單元範圍選擇
│   ├── Header.jsx                # 頂部導航、音量、全螢幕、教師管理後台開關
│   ├── TeacherHub.jsx            # 教師管理後台、診斷中心、學生成績管理
│   ├── LeaderboardView.jsx       # 跨年級榮譽榜、各項遊戲積分排行榜
│   ├── StudentProfileModal.jsx   # 學生個人檔案、勇士探險執照
│   └── TextbookViewer.jsx        # 電子教科書翻頁瀏覽器
├── features/
│   ├── langlab/LanguageLabHub.jsx # 聽說語言學習館 (聽力測驗、口說跟讀、影音教室)
│   └── phonics/PhonicsBoard.jsx  # 自然發音 Phonics 互動音標盤
├── games/
│   ├── battle/                   # 多人即時對戰 (Battle Arena)
│   ├── escape/                   # 單字密室逃脫 (Vocab Escape Room)
│   ├── handwriting/              # 字母與單字手寫實驗室 (四線三格、手寫評測)
│   ├── maze/                     # 字母迷宮神山巡航 (Alphabet Maze)
│   ├── memory/                   # 翻牌記憶對對碰 (Memory Flip)
│   ├── meteor/                   # 3D 隕石防衛戰 (Three.js 3D Typing Defense)
│   ├── mole/                     # 單字打地鼠 (Whack-a-Mole Arcade)
│   ├── quiz/                     # 標準單字測驗 (Standard Quiz)
│   ├── snake/                    # 叢林神山貪食蛇 (Snake Game - 日夜版)
│   ├── spelling/                 # 單字積木拼裝 (Word Block Assembly)
│   ├── spotter/                  # 8 大冊視覺找不同 (Spot the Differences)
│   ├── swipe/                    # 極速是非滑牌 (Speed Swipe)
│   └── town/                     # 霧臺生活小鎮 (RPG Town, 9 大建築, 對話樹)
├── services/
│   ├── audio.js                  # 自研 Web Audio 合成器與音效引擎
│   ├── hereWeGoQuestionBank.js   # 翰林 Here We Go 1~9 冊題庫生成與安全過濾
│   ├── listeningQuestionBank.js  # 生活對話情境聽力題庫
│   ├── alphabetEngine.js         # 字母演算法與階梯生成
│   └── supabase.js               # Supabase 雲端資料庫串接與離線快取
└── scripts/
    └── smoke_test.mjs            # 無頭 Chrome 14 款遊戲自動化煙霧測試腳本
```

---

### 五、重要指令備忘錄 (Cheatsheet)

| 操作 | 指令 |
| :--- | :--- |
| **啟動本地開發伺服器** | `npm run dev` |
| **執行完整驗證流水線 (必跑)** | `npm run verify` |
| **僅執行自動化端對端測試** | `npm test` |
| **生產環境打包** | `npm run build` |
| **部署至 Cloudflare Pages** | 推送至 `main` 分支自動透過 GitHub Actions 觸發部署，亦可手動執行：`npx wrangler pages deploy dist --project-name=wutaivocab --branch=main` |

---

### 六、自動化部署管線 (CI/CD Pipeline)

* **GitHub Actions Workflow**: `.github/workflows/deploy-cloudflare.yml`
* **觸發條件**: 推送至 `main` 分支或手動 `workflow_dispatch`
* **部署標的**: Cloudflare Pages (`wutaivocab` 專案)
* **憑證依賴**: GitHub Secret `CLOUDFLARE_API_TOKEN` (具備 `Account > Cloudflare Pages > Edit` 權限) 與 Account ID `4cd48161aad48dd1884b350e37ba7c75`

