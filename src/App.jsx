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

      {/* 畫面路由視圖切換 */}
      <main className="flex-1 flex flex-col">
        {currentView === 'lobby' && (
          <Lobby
            words={words}
            settings={settings}
            setSettings={setSettings}
            onNavigate={handleNavigate}
            onOpenLeaderboard={() => handleNavigate('leaderboard')}
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
      </main>
    </div>
  );
}
export default App;
