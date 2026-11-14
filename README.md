# 屏東縣霧臺國小 沉浸式英語學習平台 (WutaiVocab 2.0)

> 專為原鄉國小學童設計的 3D 與 2D 沉浸式英語單字學習村、霧臺小鎮 RPG、雙語聽說探險館、霧臺英語檢定館、自然發音探索館、電子教科書與多人競技遊戲平台。

* **正式發布網站**：[https://wutaivocab.pages.dev](https://wutaivocab.pages.dev)（綁定 `origin/main` Cloudflare Pages）
* **生態系關聯專案**：
  * 課堂即時問答系統：[https://classqna.pages.dev](https://classqna.pages.dev)
  * 霧臺國小校務管理系統：[https://wutpsdata.pages.dev](https://wutpsdata.pages.dev)

---

## 專案交接與規範導覽

* **[全域工程鐵律 (`AGENTS.md`)](./AGENTS.md)**：Supabase 資料保護、6 階段自動化防回歸測試、React 規範與 Git 推送原則。
* **[唯一現況交接總手冊 (`HANDOVER.md`)](./HANDOVER.md)**：全站 7 大主館與 14 款遊戲現況、歷次錯誤嘗試與避坑清單、題庫與 SAA 截取 SOP、待辦清單。

---

## 常用指令

```bash
# 本地開發預覽
npm run dev

# 生產建置與 6 階段全自動回歸測試（推送前必跑）
npm run build && node scripts/smoke_test.mjs

# 推送至主倉庫（Cloudflare Pages 自動部署，日常勿推 vercel）
git push origin main
```