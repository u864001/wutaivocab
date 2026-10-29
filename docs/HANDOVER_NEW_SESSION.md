# 新對話視窗接手備忘錄 (Handover to New Session)

當開啟新的 AI 對話視窗時，可直接複製本文中的「新視窗接手提示詞 (Prompt)」，貼入新視窗即可 100% 無縫銜接所有專案進度與工程規範。

---

## 完整新視窗接手 Prompt（請全選複製下方引號內文字）

```markdown
我是屏東縣霧臺國小數位學習平台（WutaiVocab）的開發負責人 Mark。
請先詳細閱讀本地專案最新交接指南：
1. `docs/SPOTTER_DESIGN_AND_HANDOVER_MANUAL.md`（找不同全冊改版心法、鐵律0~6、動態出題架構與設計規範）
2. `docs/ECOSYSTEM_OVERVIEW.md`（三大專案架構與安全規則）

【目前專案核心進度】：
1. 第 2 冊圖 1（南法普羅旺斯莊園）已驗收上線（commit: c574140）。
2. 第 2 冊圖 2（舊金山漁人碼頭 Pier 39 工藝廣場）**Base 基準圖已正式拍板驗收並成功部署至正式線上環境**（commit: 5ef0af8，`https://wutaivocab.pages.dev/assets/spotter/book2_scene2_base.jpg` HTTP 200 OK）。
3. 8 大目標單字（100% 依循 Mark 老師親授「單字候選五級金字塔」）：
   - Unit 4 官方核心學習字（6 大職業）：`cook` (廚師), `driver` (司機), `doctor` (醫生), `nurse` (護理師), `teacher` (教師), `student` (學生)
   - Phonics 具象字（第 3 級）：`pot` (料理鍋，與廚師呼應)
   - Unit 2 官方核心學習字（第 1 級）：`draw` (寫生畫畫)
4. 本地主專案目錄：C:\Users\user\.gemini\antigravity\scratch\wutaivocab
5. 工作分支：dev 與 main（推送到 origin 與 vercel）。
6. **Mark 專屬後門入口**：遊戲中在「**放大鏡圖標 (Magnifier)**」連續快速點擊 5 下（或網址帶 `?view=spotter-test`），可隨時直達 `SpotterTestWorkbench` 檢視 Base 與 ABCD 變異、切片對比與判定框。

【極重要出圖鐵律（鐵律 6）— 嚴禁全景重畫變異圖！】：
- 找不同遊戲底層採用「8 取 5」動態插槽引擎（Dynamic Slot Engine）：
  - 每一局從 8 個單字隨機選 5 個作為相異點，每個相異點隨機抽取 A/B/C 三種變異之一（共 $C(8,5) \times 3^5 = 13,608$ 種排列組合）。
  - 左圖渲染 Base 圖；右圖**底層同樣是 100% 相同的同一張 Base 圖**，僅在被抽中的 5 個單字槽位覆蓋透明羽化 PNG 補丁！
  - **未被抽中的另外 3 個單字與所有背景元素，左右兩圖完全一模一樣（100% 像素完全相同）！**
- **嚴禁致命錯誤**：變異圖絕不能全景重新生圖（背景、建築、海水、橋樑全部會位移），前次 session 就是因全景重新生圖導致 ABC 變異圖全部畫錯！
- **正確做法**：基於 Base 圖，以 8 個單字各自製作/繪製 Variant A, B, C 的形態，切出 24 個透明羽化 PNG 補丁（存於 `public/assets/spotter/patches/b2_s2/`），再由 Sharp 腳本以 Base 為底蓋上補丁合成純淨的 `diff.jpg`、`diff_varb.jpg`、`diff_varc.jpg`（全圖非目標背景差異度嚴格維持在 15%~20% 之間）。

【本次新對話的首要核心任務】：
進行【第 2 冊圖 2】8 個單字的 Variant A/B/C 變異形態規劃與透明羽化補丁產製。
- 嚴格遵守規範：先文字討論拍板，後調用生圖工具，絕不未溝通就擅自出圖消耗 Token。
- 請確認你已完整理解上述引擎架構與鐵律，並與我確認下一步執行步驟！
```

---

## 專案歷史文檔與核心手冊清單
- `docs/SPOTTER_DESIGN_AND_HANDOVER_MANUAL.md`：找不同黃金設計規範、三層景深、變異 ABC 合成秘技、8取5動態引擎架構、各冊涵蓋率總結。
- `docs/ECOSYSTEM_OVERVIEW.md`：霧台三大專案生態總覽（wutaivocab / class / wutpsdata）。
- `docs/CINEMA_AND_LANGUAGE_LAB_ROADMAP.md`：雙語聽說探險館與山豬影城架構。
