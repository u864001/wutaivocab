import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

/**
 * 依據校園作息沉浸式排程自動輪替日夜：
 * 00:00-06:00(夜)、06:00-10:00(日)、10:00-12:00(夜)、12:00-14:00(日)、
 * 14:00-16:00(夜)、16:00-18:00(日)、18:00-24:00(夜)
 */
export const getAutoThemeByTime = () => {
  try {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) return 'light';
    if (hour >= 10 && hour < 12) return 'dark';
    if (hour >= 12 && hour < 14) return 'light';
    if (hour >= 14 && hour < 16) return 'dark';
    if (hour >= 16 && hour < 18) return 'light';
    return 'dark';
  } catch (e) {
    return 'light';
  }
};

export const ThemeProvider = ({ children }) => {
  // themeMode: 'auto' (隨真實時間時鐘隨動) | 'light' (手動強制白天) | 'dark' (手動強制夜間)
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('wutai_theme_mode') || 'auto';
  });

  // 當前實際生效的主題 ('light' | 'dark')
  const [theme, setTheme] = useState(() => {
    const savedMode = localStorage.getItem('wutai_theme_mode') || 'auto';
    if (savedMode === 'light') return 'light';
    if (savedMode === 'dark') return 'dark';
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
    localStorage.setItem('wutai_theme_mode', themeMode);
  }, [theme, themeMode]);

  // 智慧三態切換：Auto (隨時更迭) -> 手動反向 -> 手動另一向 -> 回歸 Auto
  const toggleTheme = useCallback(() => {
    setThemeMode(prevMode => {
      if (prevMode === 'auto') {
        // 若在自動模式下點擊，切換為當前狀態的反向手動模式
        const currentEffective = getAutoThemeByTime();
        return currentEffective === 'light' ? 'dark' : 'light';
      }
      if (prevMode === 'light') {
        return 'dark';
      }
      // 從 dark 切換回 auto 依時鐘隨動
      return 'auto';
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
