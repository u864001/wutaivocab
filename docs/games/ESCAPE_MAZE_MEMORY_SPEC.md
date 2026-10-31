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
2. **TCG 收藏級卡背、花紋單字卡面、8 秒同步金屬流光與 3D 轉盤眾神圖鑑 (`OlympianCardArt.jsx`, `PowerUpCodexModal.jsx`)**：
   - **【美術原畫資源全數就位 (Nano Banana Sliced Assets)】**：
     - 已於 `public/assets/memory/` 部署完成 12 款切圖原畫（JPEG 92% mozjpeg，平均 60~90 KB 高速載入）：
       1. `board_bg_olympus.jpg`：奧林帕斯星辰神殿牌桌背景（遊戲中央微光透視）
       2. `card_back_rukai_day.jpg`：魯凱族百合花與太陽紋卡背（日之章）
       3. `card_back_slate_night.jpg`：霧臺古老雕花石板與雲豹琉璃珠卡背（夜之章）
       4. `word_card_frame.jpg`：古典希臘金邊花紋羊皮紙單字卡底框（中央留白清晰閱讀英文單字與中文釋義）
       5. 八大希臘眾神全幅插畫：`god_lightning.jpg` (宙斯)、`god_peek.jpg` (雅典娜)、`god_freeze.jpg` (博雷阿斯)、`god_coin.jpg` (普路托斯)、`god_lock.jpg` (赫菲斯托斯)、`god_bonus.jpg` (阿波羅)、`god_radar.jpg` (赫利奧斯)、`god_winwin.jpg` (雙子神)
   - **【卡背金屬流光與懸浮防頻閃設計】**：
     - **全場同步 8 秒週期柔和金屬流光 (`olympusAmbientSheen`)**：全場所有暗牌卡背以 8 秒為週期（6 秒靜止、2 秒柔和掠過），同步微波金屬掃光，展現神殿古老儀式感。
     - **滑鼠懸浮 (Hover) 無頻閃防呆**：Hover 僅觸發卡牌實體輕微浮起 (`-translate-y-1 scale-[1.025]`) 與溫潤邊框光暈 (`hover:shadow-[0_0_18px_rgba(251,191,36,0.45)]`)，絕對不觸發重複刺眼掃光。
     - **正面卡牌 100% 靜態高對比**：翻開後無論單字卡或神卡完全靜止穩定，零動態雜訊干擾閱讀。
   - **【3D 轉盤選角眾神圖鑑 (`PowerUpCodexModal.jsx`)】**：
     - 左側 3D 景深旋轉舞台：支援左右箭頭、觸控左右滑動 (Touch Swipe)、鍵盤方向鍵 (←/→) 輪轉 8 大神卡。
     - 實時神力沙盒微縮循環 (`MiniSandboxCanvas`)：在 3D 卡牌下方實時演示神力技能。
     - 右側雙語神話與戰略：內建希臘神話起源典故中英雙語 (`mythLoreZh` / `mythLoreEn`)、技能運作機制、高手戰略指南與雙語語音報讀 (`handleSpeakCard`)。
     - 提供「3D 輪播」與「宮格總覽」兩種檢視模式無縫切換。
   - **翻牌動效 (`OlympianAwakeningStage`)**：翻開神卡瞬間於原畫卡面上方觸發 1.35 秒無遮擋（`pointer-events-none`）全場神力特效，執行一次後定格為高畫質原畫卡面。
3. **連擊防呆與空值保護**：
   - 在已翻開 2 張比對中、已配對或偷看狀態時鎖定重複點擊。
   - 讀取 `settings?.selectedUnits` 必須加 `(settings?.selectedUnits || [])` 防護。

---

## 三、 字母迷宮探險 (`AlphabetMazeGame.jsx`) 規範

1. **大廳直通與方向控制**：
   - 支援鍵盤方向鍵與畫面觸控按鈕巡航收集字母，完成時自動觸發榮譽榜結算卡。
