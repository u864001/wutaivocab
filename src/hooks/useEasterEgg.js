import { useRef, useCallback } from 'react';
import { soundEngine } from '../services/audio';

/**
 * 連續點擊彩蛋觸發 Hook (預設 5 次，2 秒內)
 * 完全脫離 React 狀態隊列，使用 useRef 避免重繪與並發衝突
 * 
 * @param {Function} onTrigger - 達成點擊次數時觸發的回呼函式
 * @param {number} targetClicks - 目標連續點擊次數 (預設 5 次)
 * @param {number} timeoutMs - 兩次點擊間隔重置時間 (預設 2000 毫秒)
 * @returns {Function} - 綁定至元素的 onClick 處理器
 */
export function useEasterEgg(onTrigger, targetClicks = 5, timeoutMs = 2000) {
  const countRef = useRef(0);
  const timerRef = useRef(null);

  const handleClick = useCallback((e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    
    countRef.current += 1;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      countRef.current = 0;
    }, timeoutMs);

    if (countRef.current >= targetClicks) {
      countRef.current = 0;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      try {
        soundEngine.correct();
      } catch (err) {}
      if (typeof onTrigger === 'function') {
        onTrigger();
      }
    }
  }, [onTrigger, targetClicks, timeoutMs]);

  return handleClick;
}
