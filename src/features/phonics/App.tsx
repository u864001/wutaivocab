import { useState, useEffect, useMemo, useCallback } from 'react';
import type { PhonicsCard, PlacedCard, ThemeMode, Language, AppMode, DeckPreset } from './types/phonics';
import type { PronunciationMode } from './utils/audio';
import { INITIAL_CARDS, PRESET_DECKS } from './data/phonicsData';
import { Header } from './components/Header';
import { BlendingBoard } from './components/BlendingBoard';
import { StagingArea } from './components/StagingArea';
import { SoundBankModal } from './components/SoundBankModal';
import { QuizView } from './components/QuizView';
import { playCardSnapSound } from './utils/audio';

export function App() {
  // Theme state: light or dark
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('phonics_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light'; // default crisp high-contrast light for classroom projectors
  });

  // Language state: zh or en
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('phonics_lang');
    return saved === 'en' ? 'en' : 'zh';
  });

  // Pronunciation mode: 'phoneme' (pure sound / formant) vs 'word' (anchor word like apple)
  const [pronunciationMode, setPronunciationMode] = useState<PronunciationMode>('phoneme');

  // App mode: teaching or quiz
  const [mode, setMode] = useState<AppMode>('teaching');

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen Sound Bank Modal state
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  // All cards catalog (built-in + teacher custom)
  const [allCards, setAllCards] = useState<PhonicsCard[]>(() => {
    const customSaved = localStorage.getItem('phonics_custom_cards');
    if (customSaved) {
      try {
        const parsed = JSON.parse(customSaved);
        return [...INITIAL_CARDS, ...parsed];
      } catch {
        return INITIAL_CARDS;
      }
    }
    return INITIAL_CARDS;
  });

  // Selected card IDs for the staging tray
  // Default to the first preset (CVC starter + some digraphs)
  const [selectedCardIds, setSelectedCardIds] = useState<Set<string>>(() => {
    const initialPreset = PRESET_DECKS[0];
    const initialIds = new Set<string>(initialPreset.cardIds);
    // Add common digraphs
    initialIds.add('cd_ch');
    initialIds.add('cd_sh');
    initialIds.add('cd_ck');
    initialIds.add('cd_ng');
    return initialIds;
  });

  // Cards currently placed on the Magnetic Blending Board
  const [placedCards, setPlacedCards] = useState<PlacedCard[]>([
    {
      instanceId: 'inst_c',
      card: INITIAL_CARDS.find((c) => c.grapheme === 'c') || INITIAL_CARDS[0],
    },
    {
      instanceId: 'inst_a',
      card: INITIAL_CARDS.find((c) => c.grapheme === 'a') || INITIAL_CARDS[0],
    },
    {
      instanceId: 'inst_t',
      card: INITIAL_CARDS.find((c) => c.grapheme === 't') || INITIAL_CARDS[0],
    },
  ]);

  // Sync theme with HTML class and body background
  useEffect(() => {
    localStorage.setItem('phonics_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Sync language with localStorage
  useEffect(() => {
    localStorage.setItem('phonics_lang', lang);
  }, [lang]);

  // Listen to fullscreenchange
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // 5 permanent short vowels for the dispenser
  const infiniteVowels = useMemo(() => {
    return allCards.filter(
      (c) => c.category === 'short_vowels' && ['a', 'e', 'i', 'o', 'u'].includes(c.grapheme)
    );
  }, [allCards]);

  // Staging cards selected in tray
  const stagingCards = useMemo(() => {
    return allCards.filter((c) => selectedCardIds.has(c.id));
  }, [allCards, selectedCardIds]);

  // Sound Bank handlers
  const handleToggleCard = (cardId: string) => {
    setSelectedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  const handleSelectMultiple = (cardIds: string[], add: boolean) => {
    setSelectedCardIds((prev) => {
      const next = new Set(prev);
      cardIds.forEach((id) => {
        if (add) {
          next.add(id);
        } else {
          next.delete(id);
        }
      });
      return next;
    });
  };

  const handleClearAllSelected = () => {
    setSelectedCardIds(new Set());
  };

  const handleAddCustomCard = (newCard: PhonicsCard) => {
    setAllCards((prev) => {
      const updated = [...prev, newCard];
      const customOnly = updated.filter((c) => c.isCustom);
      localStorage.setItem('phonics_custom_cards', JSON.stringify(customOnly));
      return updated;
    });
    setSelectedCardIds((prev) => new Set(prev).add(newCard.id));
  };

  const handleLoadPreset = (preset: DeckPreset) => {
    setSelectedCardIds(new Set(preset.cardIds));
  };

  // Blending board card placement (via drag or tap)
  const handlePlaceCard = useCallback((card: PhonicsCard, targetIndex?: number) => {
    playCardSnapSound();
    const newPlaced: PlacedCard = {
      instanceId: `placed_${card.id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      card,
    };

    setPlacedCards((prev) => {
      const next = [...prev];
      if (typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex <= next.length) {
        next.splice(targetIndex, 0, newPlaced);
      } else {
        next.push(newPlaced);
      }
      return next;
    });
  }, []);

  const handleRemoveCard = (instanceId: string) => {
    setPlacedCards((prev) => prev.filter((p) => p.instanceId !== instanceId));
  };

  const handleClearBoard = () => {
    setPlacedCards([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500/20 font-ui transition-colors duration-200">
      {/* Top Navigation Bar with Mode Switcher & Top-Right Controls */}
      <Header
        mode={mode}
        onModeChange={setMode}
        lang={lang}
        onLangChange={setLang}
        theme={theme}
        onThemeChange={setTheme}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onOpenBank={() => setIsBankModalOpen(true)}
      />

      {/* Main View Area: Teaching Mode OR Quiz Mode */}
      <main className="flex-1 flex flex-col">
        {mode === 'teaching' ? (
          <>
            <BlendingBoard
              placedCards={placedCards}
              onCardsChange={setPlacedCards}
              onDropCard={handlePlaceCard}
              onRemoveCard={handleRemoveCard}
              onClearBoard={handleClearBoard}
              lang={lang}
              pronunciationMode={pronunciationMode}
              onTogglePronunciationMode={() =>
                setPronunciationMode((prev) => (prev === 'phoneme' ? 'word' : 'phoneme'))
              }
            />

            {/* Bottom Staging Area with Infinite Dispenser + Selected Tray */}
            <StagingArea
              infiniteVowels={infiniteVowels}
              stagingCards={stagingCards}
              onPlaceCard={handlePlaceCard}
              onOpenDrawer={() => setIsBankModalOpen(true)}
              lang={lang}
              pronunciationMode={pronunciationMode}
            />
          </>
        ) : (
          <QuizView
            allCards={allCards}
            selectedCardIds={selectedCardIds}
            lang={lang}
            onReturnToTeaching={() => setMode('teaching')}
          />
        )}
      </main>

      {/* Full-Screen 8 Phonics Sound Banks Modal */}
      <SoundBankModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        allCards={allCards}
        selectedCardIds={selectedCardIds}
        onToggleCard={handleToggleCard}
        onSelectMultiple={handleSelectMultiple}
        onClearAllSelected={handleClearAllSelected}
        onAddCustomCard={handleAddCustomCard}
        onLoadPreset={handleLoadPreset}
        lang={lang}
      />
    </div>
  );
}

export default App;
