# 新對話視窗接手備忘錄 (Handover to New Session)

當開啟新的 AI 對話視窗時，可直接複製本文中的「新視窗接手提示詞 (Prompt)」，貼入新視窗即可 100% 無縫銜接所有專案進度與工程規範。

---

## 完整新視窗接手 Prompt（請全選複製下方引號內文字）

```markdown
我是屏東縣霧臺國小數位學習平台的開發者。我們已在先前的開發階段完成了：
1. 鷹眼神探（單字找不同）與密室逃脫的重大功能與架構收斂。
2. 全校專案已自 Vercel 全面搬遷並部署至 Cloudflare Pages：
   - 英語單字村主站：https://wutaivocab.pages.dev (代碼位於 C:\Users\user\.gemini\antigravity\scratch\wutaivocab，工作分支 dev)
   - 課堂即時問答系統：https://classqna.pages.dev (代碼位於 C:\Users\user\.gemini\antigravity\scratch\class)
   - 校務系統：https://wutpsdata.pages.dev (代碼位於 C:\Users\user\.gemini\antigravity\scratch\wutpsdata，其 LINE LIFF Webhook 仍安全運作於 Vercel Serverless Function /api/line_webhook.js)
3. 翰林 Here We Go 1～9 冊共 763 則課文情境對話（684 句獨立英文）已全數透過 Google Translate 繁體中文引擎直譯校正，消滅了原先 Word 表格錯位的中譯。
4. 雙語聽說探險館 (LanguageLabHub) 與小鎮山豬影城 (CinemaTheaterModal) 的 YouTube 影片已修復為有效之全球嵌入學習短片 (src/data/unitVideoQuestionData.js)。

【工程規範與部署指令】
- 本地主專案目錄：C:\Users\user\.gemini\antigravity\scratch\wutaivocab
- 雙遠端推送：git push origin dev ; git push vercel dev
- Cloudflare Pages 部署指令：
  $env:CLOUDFLARE_API_TOKEN="<CLOUDFLARE_API_TOKEN>" # 老師之 Cloudflare 部署金鑰
  npm run build
  npx wrangler pages deploy dist --project-name=wutaivocab
- 詳細文檔庫已建立於：
  - wutaivocab/docs/ECOSYSTEM_OVERVIEW.md (三大專案總覽與安全規則)
  - wutaivocab/docs/CINEMA_AND_LANGUAGE_LAB_ROADMAP.md (山豬影城與聽說館架構、AI 影片生成工作流)

【本次新視窗的核心任務】
請先檢視 wutaivocab/docs/ 內的文檔與現有代碼，我們接下來要重點推進：
1. 雙語聽說探險館 (LanguageLabHub) 的深度打磨與全冊互動體驗。
2. 小鎮山豬影城 (CinemaTheaterModal) 的影片放映清單擴充、獎勵聯動與觀影介面優化。
3. 協助規劃各單元免費 AI 影片（如 Hedra、CapCut、可靈 AI）的腳本與題庫整合。

請向我確認您已成功讀取專案狀態與工程規範，並為我們列出下一步具體工作建議！
```

---

## 歷史設計文檔快照路徑
若新視窗需要回顧先前的視覺草圖或歷史設計建議，可參閱前次對話目錄：
`C:\Users\user\.gemini\antigravity\brain\c812a7e5-408e-41e0-824b-0b526e5d8465/`
- `language_lab_and_textbook_roadmap.md`
- `spotter_art_direction_and_workflow_proposal.md`
- `escape_room_meta_progression_proposal.md`
