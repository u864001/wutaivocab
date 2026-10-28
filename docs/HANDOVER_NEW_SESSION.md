# 新對話視窗接手備忘錄 (Handover to New Session)

當開啟新的 AI 對話視窗時，可直接複製本文中的「新視窗接手提示詞 (Prompt)」，貼入新視窗即可 100% 無縫銜接所有專案進度與工程規範。

---

## 完整新視窗接手 Prompt（請全選複製下方引號內文字）

```markdown
我是屏東縣霧臺國小數位學習平台（WutaiVocab）的開發負責人 Mark。
請先閱讀本地專案最新交接指南：
1. `docs/SPOTTER_DESIGN_AND_HANDOVER_MANUAL.md`（找不同全冊改版心法、設計規範與進度總結）
2. `docs/ECOSYSTEM_OVERVIEW.md`（三大專案架構與安全規則）

【目前專案核心進度】：
1. 第 2 冊圖 1（南法普羅旺斯莊園）已驗收上線（commit: c574140）。
2. 密室逃脫排行榜秒數歸零/1秒的 Bug 已徹底根治並通過自動化測試（commit: 344c818）。
3. 本地主專案目錄：C:\Users\user\.gemini\antigravity\scratch\wutaivocab
4. 工作分支：dev 與 main（嚴禁推送至 Vercel，僅限 origin/dev 與 origin/main）。

【本次新對話的首要核心任務】：
進行【第 2 冊圖 2】的大改重製！
- 目標：替換掉現有的京都圖（因包含過多跨冊單字如 cup, bed, umbrella, box, fan）。
- 目標涵蓋單字（依循 Mark 老師親授「單字候選五級金字塔」第一、二、三優先權）：
  1. Unit 4 官方核心學習字（6 大職業）：`cook` (廚師), `driver` (司機), `doctor` (醫生), `nurse` (護理師), `teacher` (教師), `student` (學生)
  2. Phonics 具象字（第 3 級）：`pot` (料理鍋)
  3. Unit 2 官方核心學習字（第 1 級）：`draw` (寫生畫畫)
- 嚴格遵守規範：
  1. 單字候選五級金字塔（1. Unit 1~4 主單元字 > 2. Starter/Festival 節慶字 > 3. Phonics 具象字 > 4. 教育部國小300字 > 5. 小學英檢 GEPT Kids 685字；遊戲必須以 1. 2. 涵蓋為主，再加 3. 4.）。
  2. 構圖自然生活感、三層景深分離、非目標裝飾物干擾、判定框零重疊。
  3. 先文字討論拍板，後調用生圖工具（最省 Token 策略）。

請確認你已讀取上述文檔與掌握工程原則，並請提出【第 2 冊圖 2】的場景設計提案與 8 大單字規劃！
```

---

## 專案歷史文檔與核心手冊清單
- `docs/SPOTTER_DESIGN_AND_HANDOVER_MANUAL.md`：找不同黃金設計規範、三層景深、變異 ABC 合成秘技、各冊涵蓋率總結。
- `docs/ECOSYSTEM_OVERVIEW.md`：霧台三大專案生態總覽（wutaivocab / class / wutpsdata）。
- `docs/CINEMA_AND_LANGUAGE_LAB_ROADMAP.md`：雙語聽說探險館與山豬影城架構。
