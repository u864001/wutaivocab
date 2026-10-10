# Mia and Ben Halloween School Day

製作腳本 v3｜Here We Go 1 句型與 Pre A1 小書角色｜2026 年 10 月 10 日

Mia 在萬聖節活動日認識 Ben，兩人合作完成教室海報，並在尋找黑色彩色筆的過程中成為朋友。本片採 2D 卡通，保留小書角色可辨識的外觀特徵。英文句型來源為 Here We Go 1，PDF 用來確認角色而非替換教材目標。下列英文是配音與字幕母稿，中文場景說明不進入影片。

---

## 製作設定

- **角色外觀**：已檢視 PDF 第 3、9、10、35 頁與專案角色影格圖。Mia 保留棕色短髮、黃色髮夾、奶油色上衣、珊瑚裙與同色書包；Ben 保留蓬鬆深棕短髮、藍色上衣、卡其短褲、綠書包與藍鞋。背景統一為柔和 2D 卡通校園。
- **硬體與算力設定**：本機檢查顯示 Intel UHD Graphics。採既有角色 PNG/JPG 分層、平移縮放、姿勢切換和獨立配音。大型影片生成模型不作必要步驟。
- **畫面規格**：目標輸出 16:9、1920 × 1080、24 fps；合成輸出解析度不代表原素材具有原生 1080p 細節。
- **人物年齡與性格**：依小書第 10、11 頁修正：Mia 九歲，Ben 十歲；老師為 Ms. Lin。Mia 主動親切，Ben 初到班上稍拘謹後主動幫忙。
- **角色聲音規範**：三個固定角色聲音，標準美語，清楚自然，不重疊發話。先試聽再決定 voice。
- **音訊設計**：無旁白；對話期間降低音樂，不在句首句尾放響亮音效。
- **美術風格**：改用乾淨線條、柔和明暗與簡化卡通造型。用側光、景深、前景遮擋與反打建立電影感。
- **表情與動作交代**：初版以說話者近景、手勢、聆聽反應及物品特寫交代對白。
- **片長規劃**：暫排 213 秒，約 3 分 33 秒。增加呼吸及動作空間。實際片長於配音後確定。
- **字幕架構**：不燒錄字幕、人物名字或教學標籤；英文與繁中字幕獨立外掛，聽力模式關閉字幕軌。
- **本地素材位置**：
  - `public/assets/langlab/halloween/s01_s03_mia_wave.jpg`
  - `public/assets/langlab/halloween/s01_s03_both_idle.jpg`
  - `public/assets/langlab/halloween/s01_s03_ben_wave.jpg`

---

## 場景連貫

兩個主要場景為校門及相連走廊、教室。晨光固定從畫面左側進入。工作桌上有用品袋、右側開口紙盒與海報。紙盒從第一次桌面鏡頭就出現。

固定道具：藍色尺、綠色彩色筆、黑色彩色筆、紅色彩色筆、黃色彩色筆，另有鉛筆、橡皮擦、書和原子筆。黑色筆在 S11 滾入紙盒，是 S14 找回的伏筆。海報的鬼、蝙蝠、蜘蛛與十張貼紙逐步增加。

---

## 分鏡與配音母稿

所有秒數為剪輯暫排，不是正式教學起迄點。每句分開存 WAV，例如 `S02_L01_MIA.wav`；L01 是該片段內句序。每段可拆成多個短鏡頭，不需一次生成整段長片。

### S01 00:00 至 00:03 校園清晨
紙雕校園遠景。Mia 走向校門，Ben 在前方等候。南瓜裝飾、晨光、慢速推近。只有鳥鳴、腳步與輕柔配樂，無對白。

### S02 00:03 至 00:11 早安
Mia 停步微笑。Mia 中近景，再反打 Ben。兩句間保留短暫呼吸。
1. MIA: Good morning!
2. BEN: Good morning!
目標：Good morning.。

### S03 00:11 至 00:27 認識新朋友
同一校門背景，Mia 主動靠近，Ben 微笑。衣服、書包位置一致。
1. MIA: Hi! My name is Mia. What's your name?
2. BEN: I'm Ben.
3. MIA: Hello, Ben!
目標：My name is... / What's your name? / I'm...。

### S04 00:27 至 00:37 一起走
走廊側面雙人鏡頭與反應近景，Ben 漸漸放鬆。用分層平移表現移動。
1. MIA: How are you?
2. BEN: I'm fine. How are you?
3. MIA: I'm fine, too.
目標：How are you? / I'm fine.。

### S05 00:37 至 00:50 年齡
走廊窗邊短暫停步、眼神交流。不用手指比數字，讓學生聽出年齡。
1. BEN: How old are you?
2. MIA: I'm nine. How old are you?
3. BEN: I'm ten years old.
目標：年齡問句、短答與完整答句。

### S06 00:50 至 00:59 進教室
老師在門口迎接學生，背景學生用無台詞卡通剪影。Mia 示意 Ben 排在後方。
1. MS_LIN: Good morning! Line up, please.
2. MIA: Come on, Ben.
目標：Line up, please.。第二句為故事銜接語。

### S07 00:59 至 01:11 海報任務
老師展開只有南瓜輪廓的海報。用品袋、右側紙盒與袋口旁黑色筆入鏡。
1. MIA: Look! A pumpkin!
2. BEN: Wow! Cool!
3. MS_LIN: Let's make a Halloween poster.
目標：pumpkin、Wow! Cool!。最後一句是任務銜接語。

### S08 01:11 至 01:25 鉛筆與橡皮擦
Mia 手持鉛筆在近處問。Ben 隨後指向桌子另一端橡皮擦。先用同框交代遠近，再切物品特寫。
1. MIA: What's this?
2. BEN: It's a pencil.
3. BEN: What's that?
4. MIA: It's an eraser.
目標：this / that、a / an、pencil / eraser。問 that 時橡皮擦不在 Ben 手上。

### S09 01:25 至 01:36 書與原子筆
Ben 拿出無文字封面的萬聖節圖畫書，再拿出原子筆。Mia 指向近處物品。書用作畫圖參考。
1. MIA: What's this?
2. BEN: It's a book.
3. MIA: And this?
4. BEN: It's a pen.
目標：book / pen。And this? 須配前兩句理解。

### S10 01:36 至 01:50 藍色尺
Mia 要畫邊框，指向 Ben 那一側的藍色尺。回答後 Ben 遞給 Mia。顏色問句時鏡頭仍保持同一把尺。
1. MIA: What's that?
2. BEN: It's a ruler.
3. MIA: What color is it?
4. BEN: It's blue.
目標：ruler、What color is it? / It's blue.。

### S11 01:50 至 02:03 綠色彩色筆
Mia 手持綠色彩色筆，Ben 回答後她畫葉子。對白結束後袋子被挪動，黑色筆滾進紙盒；伏筆動作不插入考題音訊。
1. MIA: What's this?
2. BEN: It's a marker.
3. MIA: What color is it?
4. BEN: It's green.
目標：marker / green。筆身或筆帽顏色清楚。

### S12 02:03 至 02:17 黑色筆不見了
Mia 準備描邊，檢查袋子和桌面。Ben 停下工作轉向她。對話時配樂保持低音量。
1. MIA: Oh, no! My marker!
2. BEN: What color is it?
3. MIA: It's black.
目標：What color is it? / It's black.。it 指的是遺失的彩色筆。

### S13 02:17 至 02:29 試著幫忙
Ben 先拿起紅色筆再拿黃色筆，詢問是不是要找的那枝。Mia 微笑搖頭。
1. BEN: Red?
2. MIA: No, that's red.
3. BEN: Yellow?
4. MIA: No, that's yellow. It's black.
目標：red / yellow / black、No, that's...。須配 S12 播放，讓 No 的意思是拒絕拿錯的筆，而不是否認顏色。

### S14 02:29 至 02:43 找到了
Ben 指向桌子另一端已存在的紙盒，Mia 回答後他看進去。黑色筆在盒內。先拍 Ben 發現，再拍黑色筆與 Mia 笑容。
1. BEN: What's that?
2. MIA: It's a box.
3. BEN: Look!
4. MIA: That's my marker! Thanks!
5. BEN: You're welcome.
目標：box、That's my... / Thanks! / You're welcome.。

### S15 02:43 至 02:56 海報完成
畫圖蒙太奇：Mia 畫鬼、Ben 畫蝙蝠、老師指蜘蛛。白鬼放深色底紙，聲音與物品同步。尚未貼十張小蝙蝠貼紙。
1. MIA: A ghost!
2. BEN: A bat!
3. MS_LIN: And a spider. Good job!
4. MIA: Thank you!
目標：ghost / bat / spider / Good job! / Thank you!。white 只在畫面呈現，不能列為已完成口語教學。

### S16 02:56 至 03:09 數一數
十張貼紙先排好。每數一個數字才貼一張。前五張 Mia 貼、後五張 Ben 貼。鏡頭避開其他蝙蝠圖案，確保可數區只有十張。
1. MIA: One, two, three, four, five.
2. BEN: Six, seven, eight, nine, ten!
目標：one 至 ten。每個數字有可辨識間隔，不快速念唱。

### S17 03:09 至 03:19 換上道具
收好文具後從道具區拿帽子與披風。Mia 戴女巫帽，Ben 穿吸血鬼披風，基礎造型與小書一致。道具友善。
1. MIA: Look! I'm a witch!
2. BEN: I'm a vampire!
目標：I'm a... / witch / vampire。

### S18 03:19 至 03:33 班級慶祝
老師在完成海報旁拿糖果籃，兩人伸出小袋子。依次發話；放入糖果後才致謝。最後留約兩秒笑容及環境聲。
1. MS_LIN: Happy Halloween!
2. MIA: Happy Halloween!
3. BEN: Trick or treat!
4. MIA: Thank you!
5. MS_LIN: You're welcome.
目標：萬聖節祝賀、討糖、致謝。

---

## 教材涵蓋

四單元核心問答、六項文具 `book` / `pen` / `pencil` / `eraser` / `ruler` / `marker`、五項顏色 `blue` / `green` / `black` / `red` / `yellow`、`one` 至 `ten`，以及六項萬聖節字詞均有口語。

第二部補 `white` 的問答、`Are you OK? / I'm fine.`、`I lost my bag.`、`I see a rainbow.`。動物、食物與其他 phonics 字彙安排戶外故事。教材人物名字與口號不是必須沿用的教學內容。

---

## 配音與字幕

先試聽 S02、S03、S14。每個角色固定同一 voice，不將說話者 ID 混入 TTS 對白。有合法可用的小書配音可優先沿用。
英文字幕依實際聲音製作，繁中在英文語音母稿鎖定後翻譯。最終交付 `lesson.mp4`、`lesson.en-US.srt`、`lesson.zh-TW.srt`、`lesson.clips.json`。

---

## 停頓點與工作流守則

- 本批完成文字製作包並保存進版本庫。
- 下一步：核對角色圖、試聽聲音、製作 S01 至 S03 的 27 秒樣片。
- 樣片驗收通過後，按組分段推進：
  - 組 1：S04 至 S07
  - 組 2：S08 至 S11
  - 組 3：S12 至 S14
  - 組 4：S15 至 S18
- 每組完成保存專案，不自動連跑下一組。
