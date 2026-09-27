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
              請點擊下方按鈕，系統將自動為您重整並返回大廳首頁
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                if (this.props.onReset) this.props.onReset();
              }}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              🔄 返回大廳首頁
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  const [currentView, setCurrentView] = useState('lobby');
  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  // 測驗出題設定 (預設純選定範圍誘答)
  const [settings, setSettings] = useState({
    selectedUnits: [],
    count: '20',
    distractorMode: 'strict'
  });

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
  }, []);

  // 榮譽榜資格判斷：單冊選滿 2 個單元 (或 20 字)，且題數為 20 題或全部
  const qualifyingBook = useMemo(() => {
    const selectedBooks = [...new Set(settings.selectedUnits.map(u => u.split('-')[0]))];
    if (selectedBooks.length !== 1) return null;

    const book = selectedBooks[0];
    const selectedUnitsCount = settings.selectedUnits.length;
    const selectedWordsCount = words.filter(w =>
      settings.selectedUnits.includes(`${w.book}-${w.lesson}`)
    ).length;

    if (selectedWordsCount < 20 && selectedUnitsCount < 2) return null;
    const playCount = settings.count === 'all' ? selectedWordsCount : parseInt(settings.count, 10);
    if (playCount < 20 && settings.count !== 'all') return null;

    return book;
  }, [settings.selectedUnits, settings.count, words]);

  const handleNavigate = (view) => {
    soundEngine.init();
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── 全域管理者快捷鍵 (Ctrl+Shift+A 或 Ctrl+Alt+T) 與 Console 備援通道 ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isModifier = e.ctrlKey || e.metaKey;
      if (isModifier && ((e.shiftKey && (e.key === 'A' || e.key === 'a')) || (e.altKey && (e.key === 't' || e.key === 'T')))) {
        e.preventDefault();
        handleNavigate('teacher-hub');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.openAdminHub = () => handleNavigate('teacher-hub');
    window.__openTeacherHub = () => handleNavigate('teacher-hub');
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      delete window.openAdminHub;
      delete window.__openTeacherHub;
    };
  }, []);

  if (isLoading) {
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

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* 全域導覽列 */}
      <Header
        onOpenTeacherHub={() => handleNavigate('teacher-hub')}
        onOpenLeaderboard={() => handleNavigate('leaderboard')}
        isOnline={isOnline}
      />

      {/* 畫面路由視圖切換 (含全域安全防護熔斷) */}
      <main className="flex-1 flex flex-col">
        <ErrorBoundary
          onReset={() => handleNavigate('lobby')}
          onOpenTeacherHub={() => handleNavigate('teacher-hub')}
        >
          {currentView === 'lobby' && (
            <Lobby
              words={words}
              settings={settings}
              setSettings={setSettings}
              onNavigate={handleNavigate}
              onOpenLeaderboard={() => handleNavigate('leaderboard')}
              onOpenTeacherHub={() => handleNavigate('teacher-hub')}
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
              onOpenTeacherHub={() => handleNavigate('teacher-hub')}
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

          {currentView === 'battle' && (
            <BattleGame
              settings={settings}
              words={words}
              onBack={() => handleNavigate('lobby')}
            />
          )}
        </ErrorBoundary>
      </main>
    </div>
  );
}
export default App;
