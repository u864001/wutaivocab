import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Lobby } from './components/Lobby';
import { TeacherHub } from './components/TeacherHub';
import { LeaderboardView } from './components/LeaderboardView';
import { StandardQuiz } from './games/quiz/StandardQuiz';
import { SpellingGame } from './games/spelling/SpellingGame';
import { MeteorGame } from './games/meteor/MeteorGame';
import { SnakeGame } from './games/snake/SnakeGame';
import { MemoryGameSingle } from './games/memory/MemoryGameSingle';
import { BattleGame } from './games/battle/BattleGame';
import { AlphabetMazeGame } from './games/maze/AlphabetMazeGame';
import { SwipeCardGame } from './games/swipe/SwipeCardGame';
import { PhonicsBoard } from './features/phonics/PhonicsBoard';
import { Portal } from './components/Portal';
import { TeacherAuthModal } from './components/TeacherAuthModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { useI18n } from './context/I18nContext';
import { useTheme } from './context/ThemeContext';
import { fetchWordsFromDb } from './services/supabase';
import { soundEngine } from './services/audio';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.clickCount = 0;
    this.clickTimer = null;
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }
  handleIconClick = () => {
    this.clickCount += 1;
    if (this.clickTimer) clearTimeout(this.clickTimer);
    this.clickTimer = setTimeout(() => { this.clickCount = 0; }, 2000);
    if (this.clickCount >= 5) {
      this.clickCount = 0;
      this.setState({ hasError: false });
      if (this.props.onOpenTeacherHub) this.props.onOpenTeacherHub();
    }
  };
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
          <div className="max-w-md w-full p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700">
            <div
              onClick={this.handleIconClick}
              className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 text-2xl font-black cursor-pointer select-none active:scale-95 transition-transform"
              title="點擊 5 次啟動後台備援"
            >
              ⚠️
            </div>
            <h2 className="text-xl font-heading font-black text-slate-800 dark:text-slate-100 mb-2">
              畫面載入遇到小插曲
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-bold">
              請點擊下方按鈕，系統將自動為您重整並返回單字學習館
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                if (this.props.onReset) this.props.onReset();
              }}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              🔄 返回單字學習館
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  const { lang, setLang } = useI18n();
  const { isDark, toggleTheme } = useTheme();

  const [currentView, setCurrentView] = useState(() => {
    try {
      const path = window.location.pathname.toLowerCase();
      const urlParams = new URLSearchParams(window.location.search);
      if (path === '/phonics' || path.endsWith('/phonics') || urlParams.get('view') === 'phonics') {
        return 'phonics';
      }
      if (path === '/vocab' || path === '/lobby' || urlParams.get('view') === 'lobby' || urlParams.get('view') === 'vocab') {
        return 'lobby';
      }
      if (urlParams.get('join')) {
        return 'battle';
      }
    } catch (e) {}
    return 'portal';
  });

  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  // 測驗出題設定 (預設純選定範圍誘答)
  const [settings, setSettings] = useState({
    selectedUnits: [],
    count: '20',
    distractorMode: 'strict'
  });

  const [autoJoinCode, setAutoJoinCode] = useState(null);

  const loadWords = async () => {
    setIsLoading(true);
    try {
      const data = await fetchWordsFromDb();
      setWords(data);
      setIsOnline(true);
    } catch (e) {
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWords();

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const joinParam = urlParams.get('join');
      if (joinParam) {
        setAutoJoinCode(joinParam);
        setCurrentView('battle');
      }
    } catch (e) {}
  }, []);

  // 監聽瀏覽器上一頁/下一頁返回事件 (POPSTATE)
  useEffect(() => {
    const handlePopState = () => {
      try {
        const path = window.location.pathname.toLowerCase();
        if (path === '/phonics' || path.endsWith('/phonics')) {
          setCurrentView('phonics');
        } else if (path === '/vocab' || path === '/lobby') {
          setCurrentView('lobby');
        } else {
          setCurrentView('portal');
        }
      } catch (e) {}
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 榮譽榜資格判斷：單冊選滿 2 個單元，總字數與出題數均必須達到至少 20 題
  const qualifyingBook = useMemo(() => {
    const selectedBooks = [...new Set(settings.selectedUnits.map(u => u.split('-')[0]))];
    if (selectedBooks.length !== 1) return null;

    const book = selectedBooks[0];
    const selectedUnitsCount = settings.selectedUnits.length;
    const selectedWordsCount = words.filter(w =>
      settings.selectedUnits.includes(`${w.book}-${w.lesson}`)
    ).length;

    // 嚴格規定：單冊至少 2 單元、題庫至少 20 字
    if (selectedWordsCount < 20 || selectedUnitsCount < 2) return null;
    const playCount = settings.count === 'all' ? selectedWordsCount : parseInt(settings.count, 10);
    // 嚴格規定：實際出題數必須 >= 20 題
    if (playCount < 20) return null;

    return book;
  }, [settings.selectedUnits, settings.count, words]);

  const [isTeacherAuthOpen, setIsTeacherAuthOpen] = useState(false);

  const handleOpenTeacherHub = () => {
    if (sessionStorage.getItem('wutai_teacher_authed') === 'true') {
      handleNavigate('teacher-hub');
    } else {
      setIsTeacherAuthOpen(true);
    }
  };

  const handleNavigate = (view) => {
    soundEngine.init();
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      if (view === 'phonics') {
        if (window.location.pathname !== '/phonics') {
          window.history.pushState({ view: 'phonics' }, '', '/phonics');
        }
      } else if (view === 'lobby') {
        if (window.location.pathname !== '/vocab') {
          window.history.pushState({ view: 'lobby' }, '', '/vocab');
        }
      } else if (view === 'portal') {
        if (window.location.pathname !== '/') {
          window.history.pushState({ view: 'portal' }, '', '/');
        }
      }
    } catch (e) {}
  };

  // ── 全域管理者快捷鍵 (Ctrl+Shift+A 或 Ctrl+Alt+T) 與 Console 備援通道 ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isModifier = e.ctrlKey || e.metaKey;
      if (isModifier && ((e.shiftKey && (e.key === 'A' || e.key === 'a')) || (e.altKey && (e.key === 't' || e.key === 'T')))) {
        e.preventDefault();
        handleOpenTeacherHub();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.openAdminHub = handleOpenTeacherHub;
    window.__openTeacherHub = handleOpenTeacherHub;
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      delete window.openAdminHub;
      delete window.__openTeacherHub;
    };
  }, []);

  // 當處於單字學習遊戲或大廳且單字尚未同步完成時顯示輕量載入動畫
  if (isLoading && words.length === 0 && currentView !== 'portal' && currentView !== 'phonics') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mb-4" />
        <h2 className="text-xl font-heading font-black text-slate-700 dark:text-slate-200">
          正在同步雲端單字庫...
        </h2>
        <p className="text-xs font-bold text-slate-400 mt-1">
          Wutai English Adventure World Loading
        </p>
      </div>
    );
  }

  const handleGoParent = () => {
    // 依層級關係精確返回上一層：
    // 若當前在單字學習館大廳 (lobby) 或自然發音 (phonics)，上一層為學習宇宙首頁 (portal)
    if (currentView === 'lobby' || currentView === 'phonics') {
      handleNavigate('portal');
    } else if (currentView !== 'portal') {
      // 若當前在任何單字遊戲、字母迷宮、排行榜或教師後台，上一層為單字學習館 (lobby)
      handleNavigate('lobby');
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* 全域統一導覽列 (全頁面維持一致的學校標誌、回上一層、語言與主題開關) */}
      <Header
        onOpenTeacherHub={handleOpenTeacherHub}
        onOpenLeaderboard={() => handleNavigate('leaderboard')}
        onOpenPhonics={() => handleNavigate('phonics')}
        onGoParent={handleGoParent}
        onGoHome={() => handleNavigate('portal')}
        currentView={currentView}
        isOnline={isOnline}
      />

      {/* 畫面路由視圖切換 (含全域安全防護熔斷) */}
      <main className="flex-1 flex flex-col">
        <ErrorBoundary
          onReset={() => handleNavigate(currentView === 'portal' || currentView === 'phonics' ? 'portal' : 'lobby')}
          onOpenTeacherHub={handleOpenTeacherHub}
        >
          {currentView === 'portal' && (
            <Portal
              onNavigate={handleNavigate}
              onOpenLeaderboard={() => handleNavigate('leaderboard')}
              onOpenTeacherHub={handleOpenTeacherHub}
              wordsCount={words.length}
            />
          )}

          {currentView === 'lobby' && (
            <Lobby
              words={words}
              settings={settings}
              setSettings={setSettings}
              onNavigate={handleNavigate}
              onOpenLeaderboard={() => handleNavigate('leaderboard')}
              onOpenTeacherHub={handleOpenTeacherHub}
              qualifyingBook={qualifyingBook}
            />
          )}

          {currentView === 'teacher-hub' && (
            <TeacherHub
              words={words}
              onBack={() => handleNavigate('lobby')}
              onRefreshWords={loadWords}
            />
          )}

          {currentView === 'leaderboard' && (
            <LeaderboardView
              words={words}
              onBack={() => handleNavigate('lobby')}
              onOpenTeacherHub={handleOpenTeacherHub}
            />
          )}

          {currentView.startsWith('quiz-') && (
            <StandardQuiz
              mode={currentView}
              settings={settings}
              words={words}
              qualifyingBook={qualifyingBook}
              onBack={() => handleNavigate('lobby')}
            />
          )}

          {currentView === 'spelling' && (
            <SpellingGame
              settings={settings}
              words={words}
              qualifyingBook={qualifyingBook}
              onBack={() => handleNavigate('lobby')}
            />
          )}

          {currentView === 'meteor' && (
            <MeteorGame
              settings={settings}
              words={words}
              qualifyingBook={qualifyingBook}
              onBack={() => handleNavigate('lobby')}
            />
          )}

          {currentView === 'snake' && (
            <SnakeGame
              settings={settings}
              words={words}
              qualifyingBook={qualifyingBook}
              onBack={() => handleNavigate('lobby')}
            />
          )}

          {currentView === 'memory' && (
            <MemoryGameSingle
              settings={settings}
              words={words}
              qualifyingBook={qualifyingBook}
              onBack={() => handleNavigate('lobby')}
            />
          )}

          {currentView === 'maze' && (
            <AlphabetMazeGame
              qualifyingBook={qualifyingBook}
              onBack={() => handleNavigate('lobby')}
            />
          )}

          {currentView === 'swipe' && (
            <SwipeCardGame
              settings={settings}
              words={words}
              qualifyingBook={qualifyingBook}
              onBack={() => handleNavigate('lobby')}
            />
          )}

          {currentView === 'battle' && (
            <BattleGame
              settings={settings}
              words={words}
              autoJoinCode={autoJoinCode}
              onBack={() => {
                setAutoJoinCode(null);
                handleNavigate('lobby');
              }}
            />
          )}

          {currentView === 'phonics' && (
            <PhonicsBoard
              onBackToLobby={() => handleNavigate('portal')}
              initialLang={lang === 'en' ? 'en' : 'zh'}
              initialTheme={isDark ? 'dark' : 'light'}
              onLangChangeGlobal={(newPhonicsLang) => {
                setLang(newPhonicsLang === 'en' ? 'en' : 'zh-TW');
              }}
              onThemeChangeGlobal={(newPhonicsTheme) => {
                if ((newPhonicsTheme === 'dark') !== isDark) {
                  toggleTheme();
                }
              }}
            />
          )}
        </ErrorBoundary>
      </main>

      {/* 教師工作台通行驗證彈窗 (密碼: wt7902230) */}
      <TeacherAuthModal
        isOpen={isTeacherAuthOpen}
        onClose={() => setIsTeacherAuthOpen(false)}
        onSuccess={() => {
          setIsTeacherAuthOpen(false);
          handleNavigate('teacher-hub');
        }}
      />

      {/* 學生 6 碼雲端漫遊通行證彈窗 */}
      <StudentProfileModal />
    </div>
  );
}
export default App;
