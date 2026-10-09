# 屏東縣霧臺國小 沉浸式英語學習平台 (WutaiVocab 2.0)

> 專為原鄉國小學童設計的 3D 與 2D 沉浸式英語單字學習村、雙語聽說探險館、山豬影城與多人競技遊戲平台。

* **正式發布網站**：[https://wutaivocab.pages.dev](https://wutaivocab.pages.dev)
* **生態系關聯專案**：
  * 課堂即時問答系統：[https://classqna.pages.dev](https://classqna.pages.dev)
  * 霧臺國小校務管理系統：[https://wutpsdata.pages.dev](https://wutpsdata.pages.dev)

---

## 專案文檔導覽 (Documentation)

完整技術規格、架構設計與維護手冊已歸檔於 `docs/` 目錄：

1. [生態系總覽與部署指南 (`docs/ECOSYSTEM_OVERVIEW.md`)](./docs/ECOSYSTEM_OVERVIEW.md)
   - `wutaivocab`、`classqna`、`wutpsdata` 三大專案本地目錄與遠端倉庫。
   - Cloudflare Pages 建置與 CLI 部署參數。
   - LINE LIFF Webhook 安全架構與防護規範。

2. [山豬影城與雙語聽說探險館研發手冊 (`docs/CINEMA_AND_LANGUAGE_LAB_ROADMAP.md`)](./docs/CINEMA_AND_LANGUAGE_LAB_ROADMAP.md)
   - 16:9 YouTube 零伺服器流量播放技術架構。
   - 題庫資料格式與微秒級時間戳記剪輯機制。
   - 免費 AI 影片生成平台（Hedra, CapCut, 可靈 AI, Pika）操作教學與 YouTube 上傳 SOP。

3. [新對話視窗接手備忘錄 (`docs/HANDOVER_NEW_SESSION.md`)](./docs/HANDOVER_NEW_SESSION.md)
   - 開啟新交談視窗時之一鍵接手完整 Prompt。

---

## 常用指令

```powershell
# 本地開發預覽
npm run dev

# 生產建置
npm run build

# Cloudflare Pages 生產部署
$env:CLOUDFLARE_API_TOKEN="<CLOUDFLARE_API_TOKEN>" # 使用專屬部署 Token
npx wrangler pages deploy dist --project-name=wutaivocab

# 雙遠端倉庫推送
git push origin dev
git push vercel dev
```