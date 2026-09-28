// ── 智慧全螢幕管理 (相容各瀏覽器與 iPad / iOS WebKit) ──

/**
 * 請求進入全螢幕模式
 */
export const enterFullscreen = () => {
  try {
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen().catch(() => {});
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen();
    }
  } catch (e) {
    // 忽略受安全策略限制時的例外
  }
};

/**
 * 退出全螢幕模式，還原正常視窗
 */
export const exitFullscreen = () => {
  try {
    const doc = document;
    if (doc.fullscreenElement || doc.webkitFullscreenElement) {
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch(() => {});
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      }
    }
  } catch (e) {
    // 忽略例外
  }
};

/**
 * 檢查當前是否處於全螢幕
 */
export const isCurrentlyFullscreen = () => {
  return Boolean(document.fullscreenElement || document.webkitFullscreenElement);
};
