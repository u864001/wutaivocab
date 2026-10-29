# 單字密室逃脫 (`VocabEscapeGame`)、字母迷宮 (`AlphabetMazeGame`) 與星際記憶翻牌 (`MemoryGameSingle`) 專屬規範

> **對應檔案**：`src/games/escape/VocabEscapeGame.jsx`、`src/games/escape/puzzles/SpellingPuzzle.jsx`、`src/games/maze/AlphabetMazeGame.jsx`、`src/games/memory/MemoryGameSingle.jsx`

---

## 一、 單字密室逃脫 (`VocabEscapeGame.jsx`) 核心規範

1. **過關秒數鎖定與防止 `addQuestPoints` 觸發重置鐵律**：
   - 當學生解完最後一道謎題通關時，會呼叫 `addQuestPoints` 更新 `StudentContext` 的 `currentStudent`。
   - **絕對禁止**將 `currentStudent` 放入 `initCampaign` 的 `useCallback` 依賴陣列，且 `initCampaign` 開頭必須檢查 `if (gameStateRef.current === 'playing' || gameStateRef.current === 'victory') return;`，否則發放積分當下會觸發 `initCampaign` 將 `timeElapsed` 歸零，造成排行榜出現「1 秒通關」異常！
   - 通關瞬間將秒數鎖定於 `finalTime` 與 `finalTimeRef.current`（最小合法秒數 `>= 2` 秒）。
2. **排行榜排位規則（秒數低優先）**：
   - 密室逃脫與找不同在 `supabase.js` 的排行榜排序為 `time ASC`（秒數越短名次越高），同秒數再比 `score DESC`（剩餘愛心數 1~3）。
   - 資料庫與前端皆嚴格過濾 `time <= 1` 的歷史異常秒數。
3. **長單字拼字謎題 (`SpellingPuzzle.jsx`)**：
   - 複合詞依空格自動切分為獨立膠囊群組；`>= 10` 字母動態縮小卡槽並支援 `flex-wrap`，中央常駐「⌫ 刪除上一格」與「🔄 全部重排」按鈕。

---

## 二、 星際記憶翻牌 (`MemoryGameSingle.jsx` & `OlympianCardArt.jsx`) 規範

1. **20 張複合牌組與奧林帕斯八大希臘眾神神卡架構**：
   - 每局由 8 組中英單字配對（16 張）＋ 4 張從完整 8 大希臘眾神池隨機抽取的神卡組成共 20 張牌：
     1. ⚡ **宙斯 • 雷霆閃電 (`lightning`)**：天雷保送自動配對一組單字＋開啟 Bonus 回合。
     2. 👁️ **雅典娜 • 智慧神眸 (`peek`)**：黃金貓頭鷹透視 2 張暗牌 5 秒。
     3. ❄️ **博雷阿斯 • 極北寒霜 (`freeze`)**：極寒冰晶結界（單人獲 +20 分與 Bonus 回合／多人凍結敵隊）。
     4. 🪙 **普路托斯 • 天界金幣雨 (`coin`)**：傾倒黃金豐饒之角，進入 10 秒接古希臘貓頭鷹金幣 (+1) 與翡翠聖石 (+3)、躲避冥界黑火炸彈小遊戲。
     5. 🔒 **赫菲斯托斯 • 神匠金鎖 (`lock`)**：鍛造黃金符文鎖鏈，單人鎖定並透視一組配對 5 秒 (+15 分)／多人獨占鎖牌。
     6. 💎 **阿波羅 • 太陽神榮耀 (`bonus`)**：萬丈日輪與金豎琴賜福，立即 +30 分暴擊。
     7. 📡 **赫利奧斯 • 全視天眼 (`radar`)**：天穹星盤 360 度全息波紋，全場 20 張牌同時微光透視 5 秒。
     8. 🤝 **雙子神 • 星辰同盟 (`winwin`)**：卡斯托耳與波魯克斯雙子座契約，獲得 +25 雙贏祝福並開啟 Bonus 回合。
2. **TCG 收藏級卡背、花紋單字卡面與 1.35 秒眾神降臨動效 (`OlympianCardArt.jsx`)**：
   - **【重要美術規範 — 必須使用 Nano Banana (`image-generator`) 繪製真遊戲級插畫】**：
     - Mark 老師明確指示：純程式 SVG 幾何圖形無法達到商業卡牌遊戲質感，**記憶翻牌的遊戲背景、魯凱日/夜卡背、單字雕花卡面、八大希臘眾神卡面、以及金幣雨場景與物件，一律必須使用 Nano Banana (`image-generator`) 繪製高細節遊戲原畫**，再於原畫上方疊加 1.35 秒動態神力特效（如閃電劈落、冰晶擴散、貓頭鷹神光等）！
     - **待生圖資源清單（因 2026-10-29 當日 `gemini-3.1-flash-image` 額度暫滿 429，額度恢復後第一優先調用 `image-generator` 補齊至 `public/assets/memory/`）**：
       1. `board_bg_olympus.jpg`：奧林帕斯星辰神殿牌桌背景（16:9）
       2. `card_back_rukai_day.jpg`：魯凱族百合花與太陽紋卡背（日之章）
       3. `card_back_slate_night.jpg`：霧臺古老雕花石板與雲豹琉璃珠卡背（夜之章）
       4. `word_card_frame.jpg`：古典希臘金邊花紋羊皮紙單字卡底框（中央留白供清晰顯示單字）
       5. 八大希臘眾神全幅插畫卡面：`god_lightning_zeus.jpg`（宙斯）、`god_peek_athena.jpg`（雅典娜）、`god_freeze_boreas.jpg`（博雷阿斯）、`god_coin_plutus.jpg`（普路托斯）、`god_lock_hephaestus.jpg`（赫菲斯托斯）、`god_bonus_apollo.jpg`（阿波羅）、`god_radar_helios.jpg`（赫利奧斯）、`god_winwin_gemini.jpg`（雙子神）
       6. 貪食蛇正俯視高細節地圖（`public/assets/snake/snake_bg_day.jpg`、`snake_bg_night.jpg`）
   - **翻牌動效 (`OlympianAwakeningStage`)**：翻開神卡瞬間於 Banana 原畫卡面上方觸發 1.35 秒無遮擋（`pointer-events-none`）全場神力特效，執行一次後定格為高畫質原畫卡面。
3. **連擊防呆與空值保護**：
   - 在已翻開 2 張比對中、已配對或偷看狀態時鎖定重複點擊。
   - 讀取 `settings?.selectedUnits` 必須加 `(settings?.selectedUnits || [])` 防護。

---

## 三、 字母迷宮探險 (`AlphabetMazeGame.jsx`) 規範

1. **大廳直通與方向控制**：
   - 支援鍵盤方向鍵與畫面觸控按鈕巡航收集字母，完成時自動觸發榮譽榜結算卡。
