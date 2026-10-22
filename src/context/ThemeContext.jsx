import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

/**
 * 取得精確台灣標準時間 (UTC+8)
 */
export const getTaiwanDateTime = () => {
  try {
    const str = new Date().toLocaleString("en-US", { timeZone: "Asia/Taipei" });
    return new Date(str);
  } catch (e) {
    return new Date();
  }
};

/**
 * 依據台灣時間 (UTC+8) 自動輪替日夜：
 * 1. 週一至週五正常上班上課區間 (08:00 - 18:00 每兩小時輪替)：
 *    08:00 - 10:00 (日)
 *    10:00 - 12:00 (夜)
 *    12:00 - 14:00 (日)
 *    14:00 - 16:00 (夜)
 *    16:00 - 18:00 (日)
 *    其他時段自適應：06:00 - 08:00 (日), 18:00 - 06:00 (夜)
 * 2. 週六與週日：
 *    全天候自然日夜自適應：06:00 - 18:00 (日), 18:00 - 06:00 (夜)
 */
export const getAutoThemeByTime = () => {
  try {
    const twDate = getTaiwanDateTime();
    const day = twDate.getDay(); // 0 是週日, 1-5 是週一至週五, 6 是週六
    const hour = twDate.getHours();

    const isWeekday = day >= 1 && day <= 5;

    if (isWeekday) {
      if (hour >= 8 && hour < 10) return 'light';
      if (hour >= 10 && hour < 12) return 'dark';
      if (hour >= 12 && hour < 14) return 'light';
      if (hour >= 14 && hour < 16) return 'dark';
      if (hour >= 16 && hour < 18) return 'light';
      if (hour >= 6 && hour < 8) return 'light';
      return 'dark';
    } else {
      // 週末自然日夜自適應
      if (hour >= 6 && hour < 18) return 'light';
      return 'dark';
    }
  } catch (e) {
    return 'light';
  }
};

export const ThemeProvider = ({ children }) => {
  // themeMode: 'auto' (隨台灣時鐘隨動) | 'light' (手動強制白天) | 'dark' (手動強制夜間)
  const [themeMode, setThemeMode] = useState(() => {
    // 優先檢查當前分頁 session override，若無則預設為 'auto'
    const sessionOverride = sessionStorage.getItem('wutai_theme_mode');
    if (sessionOverride) return sessionOverride;
    // 清除舊版 localStorage 遺留的強制鎖定，確保預設依真實台灣時鐘自適應
    localStorage.removeItem('wutai_theme_mode');
    return 'auto';
  });

  // 當前實際生效的主題 ('light' | 'dark')
  const [theme, setTheme] = useState(() => {
    const sessionOverride = sessionStorage.getItem('wutai_theme_mode');
    if (sessionOverride === 'light') return 'light';
    if (sessionOverride === 'dark') return 'dark';
    return getAutoThemeByTime();
  });

  // 當 themeMode 為 'auto' 時，監聽時鐘更迭與頁面聚焦
  useEffect(() => {
    if (themeMode === 'auto') {
      const updateFromClock = () => {
        const calculated = getAutoThemeByTime();
        setTheme(calculated);
      };
      updateFromClock();
      const interval = setInterval(updateFromClock, 60000); // 每分鐘校準一次
      const handleVisibility = () => {
        if (document.visibilityState === 'visible') updateFromClock();
      };
      document.addEventListener('visibilitychange', handleVisibility);
      return () => {
        clearInterval(interval);
        document.removeEventListener('visibilitychange', handleVisibility);
      };
    } else {
      setTheme(themeMode);
    }
  }, [themeMode]);

  // 同步套用 HTML 根標籤 class 與持久化儲存
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('wutai_theme', theme);
  }, [theme]);

  // 智慧三態切換：Auto (隨時更迭) -> 手動反向 -> 手動另一向 -> 回歸 Auto
  const toggleTheme = useCallback(() => {
    setThemeMode(prevMode => {
      let nextMode;
      if (prevMode === 'auto') {
        const currentEffective = getAutoThemeByTime();
        nextMode = currentEffective === 'light' ? 'dark' : 'light';
      } else if (prevMode === 'light') {
        nextMode = 'dark';
      } else {
        nextMode = 'auto';
      }

      if (nextMode === 'auto') {
        sessionStorage.removeItem('wutai_theme_mode');
        localStorage.removeItem('wutai_theme_mode');
      } else {
        sessionStorage.setItem('wutai_theme_mode', nextMode);
      }
      return nextMode;
    });
  }, []);

  const isDark = theme === 'dark';
  const isAuto = themeMode === 'auto';

  return (
    <ThemeContext.Provider value={{ theme, themeMode, isDark, isAuto, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
