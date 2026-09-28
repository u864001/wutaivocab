import React, { useState, useMemo } from 'react';
import type { PhonicsCard, PhonicsCategory, Language, DeckPreset } from '../types/phonics';
import { CATEGORIES_META, PRESET_DECKS } from '../data/phonicsData';
import { PhonicsCardView } from './PhonicsCardView';
import { getT } from '../utils/i18n';
import {
  X,
  Search,
  CheckSquare,
  Square,
  Trash2,
  Plus,
  Bookmark,
  Download,
  Upload,
  Layers,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface CardBankDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  allCards: PhonicsCard[];
  selectedCardIds: Set<string>;
  onToggleCard: (cardId: string) => void;
  onSelectMultiple: (cardIds: string[], add: boolean) => void;
  onClearAllSelected: () => void;
  onAddCustomCard: (card: PhonicsCard) => void;
  onLoadPreset: (preset: DeckPreset) => void;
  lang: Language;
}

export const CardBankDrawer: React.FC<CardBankDrawerProps> = ({
  isOpen,
  onClose,
  allCards,
  selectedCardIds,
  onToggleCard,
  onSelectMultiple,
  onClearAllSelected,
  onAddCustomCard,
  onLoadPreset,
  lang,
}) => {
  const t = getT(lang);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [customGrapheme, setCustomGrapheme] = useState('');
  const [customSound, setCustomSound] = useState('');
  const [customCategory, setCustomCategory] = useState<PhonicsCategory>('custom');
  const [activeTab, setActiveTab] = useState<'cards' | 'presets'>('cards');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Group all available categories
  const categoriesList = useMemo(() => {
    return Object.values(CATEGORIES_META);
  }, []);

  // Filter cards based on search and category
  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        card.grapheme.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.phonemeSound.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (card.sampleWord && card.sampleWord.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = activeCategory === 'all' || card.category === activeCategory;

      return matchesSearch && matchesCat;
    });
  }, [allCards, searchQuery, activeCategory]);

  // Group filtered cards by category for structured layout
  const cardsByCategory = useMemo(() => {
    const groups: Record<string, PhonicsCard[]> = {};
    filteredCards.forEach((c) => {
      if (!groups[c.category]) groups[c.category] = [];
      groups[c.category].push(c);
    });
    return groups;
  }, [filteredCards]);

  const handleSelectAllCategory = (catId: string) => {
    const idsInCat = allCards.filter((c) => c.category === catId).map((c) => c.id);
    onSelectMultiple(idsInCat, true);
  };

  const handleDeselectCategory = (catId: string) => {
    const idsInCat = allCards.filter((c) => c.category === catId).map((c) => c.id);
    onSelectMultiple(idsInCat, false);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGrapheme.trim()) return;

    const newCard: PhonicsCard = {
      id: `custom_${Date.now()}`,
      grapheme: customGrapheme.trim().toLowerCase(),
      displayText: customGrapheme.trim(),
      category: customCategory,
      phonemeSound: customSound.trim() || `/${customGrapheme.trim()}/`,
      sampleWord: 'custom',
      isCustom: true,
      isSplit: customGrapheme.includes('_'),
    };

    onAddCustomCard(newCard);
    setCustomGrapheme('');
    setCustomSound('');
    showToast(lang === 'zh' ? '已成功建立自訂字卡！' : 'Custom card added!');
  };

  // Save / Load Deck with LocalStorage
  const handleSaveDeckToLocal = () => {
    const ids = Array.from(selectedCardIds);
    localStorage.setItem('phonics_saved_deck', JSON.stringify(ids));
    showToast(t.deckSavedSuccess);
  };

  const handleLoadDeckFromLocal = () => {
    try {
      const saved = localStorage.getItem('phonics_saved_deck');
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        onSelectMultiple(ids, true);
        showToast(t.deckLoadedSuccess);
      } else {
        showToast(t.noSavedDeck);
      }
    } catch {
      showToast('Error loading deck');
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    const ids = Array.from(selectedCardIds);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ cards: ids, exportDate: new Date().toISOString() }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `phonics_lesson_deck_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.cards && Array.isArray(parsed.cards)) {
          onSelectMultiple(parsed.cards, true);
          showToast(t.deckLoadedSuccess);
        }
      } catch {
        showToast('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-out border-r border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                {t.drawerTitle}
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500 text-white">
                  {selectedCardIds.size} {t.cardsSelected}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.drawerDesc}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Sub-tabs: Sound Cards vs Curriculum Presets */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 bg-slate-50/50 dark:bg-slate-900/40">
          <button
            type="button"
            onClick={() => setActiveTab('cards')}
            className={`py-2.5 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'cards'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{lang === 'zh' ? '發音卡總庫' : 'Phonics Cards'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`py-2.5 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'presets'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>{t.presetDecksTitle}</span>
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'cards' ? (
          <>
            {/* Search and Action Bar */}
            <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-9.5 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                />
              </div>

              {/* Category Pills Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                    activeCategory === 'all'
                      ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {t.allCategories}
                </button>
                {categoriesList.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      activeCategory === cat.id
                        ? `${cat.badgeBg} shadow-xs font-semibold`
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    <span>{lang === 'zh' ? cat.nameZh : cat.nameEn}</span>
                  </button>
                ))}
              </div>

              {/* Batch Action Buttons */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2">
                  {activeCategory !== 'all' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSelectAllCategory(activeCategory)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-medium"
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>{t.selectAll}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeselectCategory(activeCategory)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 font-medium"
                      >
                        <Square className="w-3.5 h-3.5" />
                        <span>{t.deselectCategory}</span>
                      </button>
                    </>
                  )}
                </div>

                {selectedCardIds.size > 0 && (
                  <button
                    type="button"
                    onClick={onClearAllSelected}
                    className="flex items-center gap-1 text-rose-500 hover:text-rose-600 font-medium px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t.clearAllSelected}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Card Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
              {Object.keys(cardsByCategory).length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-base font-medium">沒有符合條件的發音卡片</p>
                  <p className="text-xs mt-1">請嘗試不同的關鍵字或類別</p>
                </div>
              ) : (
                Object.entries(cardsByCategory).map(([catKey, cards]) => {
                  const catMeta = CATEGORIES_META[catKey] || CATEGORIES_META.basic_consonants;
                  return (
                    <div key={catKey} className="space-y-2.5">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${catMeta.badgeBg}`}></span>
                          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {lang === 'zh' ? catMeta.nameZh : catMeta.nameEn}
                          </h3>
                          <span className="text-xs text-slate-400">({cards.length})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleSelectAllCategory(catKey)}
                            title={t.selectAll}
                            className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline px-1.5 py-0.5"
                          >
                            {t.selectAll}
                          </button>
                        </div>
                      </div>

                      {/* Phonics Cards Grid */}
                      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2.5 sm:gap-3">
                        {cards.map((card) => {
                          const isSelected = selectedCardIds.has(card.id);
                          return (
                            <div key={card.id} className="relative group">
                              <PhonicsCardView
                                card={card}
                                size="sm"
                                draggable={false}
                                onClick={() => onToggleCard(card.id)}
                                className={`w-full! h-20! ${
                                  isSelected
                                    ? 'ring-3 ring-indigo-500 ring-offset-2 scale-102 shadow-md'
                                    : 'opacity-70 hover:opacity-100'
                                }`}
                              />
                              {isSelected && (
                                <div className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white rounded-full p-0.5 shadow-sm pointer-events-none">
                                  <CheckSquare className="w-3.5 h-3.5" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Teacher Custom Card Creator */}
            <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
              <form onSubmit={handleAddCustom} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {t.customCardTitle}
                  </span>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as PhonicsCategory)}
                    className="text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300"
                  >
                    {categoriesList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {lang === 'zh' ? c.nameZh : c.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customGrapheme}
                    onChange={(e) => setCustomGrapheme(e.target.value)}
                    placeholder={t.customCardPlaceholder}
                    maxLength={6}
                    className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 font-phonics text-base font-bold"
                  />
                  <input
                    type="text"
                    value={customSound}
                    onChange={(e) => setCustomSound(e.target.value)}
                    placeholder={t.customSoundPlaceholder}
                    maxLength={10}
                    className="w-24 sm:w-28 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                  />
                  <button
                    type="submit"
                    disabled={!customGrapheme.trim()}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-sm transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.addCard}</span>
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          /* Lesson Presets & Deck Management */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                {t.presetDecksTitle}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                {lang === 'zh'
                  ? '精選符合 TESOL / Orton-Gillingham 漸進式教學教案，點選直接載入'
                  : 'Curated curriculum decks following Orton-Gillingham progression'}
              </p>

              <div className="space-y-3">
                {PRESET_DECKS.map((preset) => (
                  <div
                    key={preset.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {lang === 'zh' ? preset.nameZh : preset.nameEn}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {lang === 'zh' ? preset.descriptionZh : preset.descriptionEn}
                      </p>
                      <span className="inline-block mt-2 text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                        {preset.cardIds.length} {lang === 'zh' ? '張核心字卡' : 'Core cards'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onLoadPreset(preset);
                        showToast(t.deckLoadedSuccess);
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-sm self-start sm:self-center transition-colors"
                    >
                      <span>{t.loadPreset}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Deck Storage */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                {lang === 'zh' ? '教師自訂教案備份與載入' : 'Teacher Deck Storage & Export'}
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                {lang === 'zh'
                  ? '將目前候用區挑選的字卡存入瀏覽器，或匯出為 JSON 檔案攜帶至其他教室'
                  : 'Save your current card palette to browser storage or export as a JSON file'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={handleSaveDeckToLocal}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex flex-col items-center justify-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors shadow-2xs"
                >
                  <Bookmark className="w-4 h-4 text-indigo-500" />
                  <span>{t.saveDeck}</span>
                </button>

                <button
                  type="button"
                  onClick={handleLoadDeckFromLocal}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex flex-col items-center justify-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors shadow-2xs"
                >
                  <Layers className="w-4 h-4 text-emerald-500" />
                  <span>{t.loadSavedDeck}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex flex-col items-center justify-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors shadow-2xs"
                >
                  <Download className="w-4 h-4 text-blue-500" />
                  <span>匯出 JSON</span>
                </button>

                <label className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex flex-col items-center justify-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors shadow-2xs cursor-pointer">
                  <Upload className="w-4 h-4 text-purple-500" />
                  <span>匯入 JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Toast notification */}
        {toastMsg && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2 rounded-xl shadow-lg border border-slate-700 animate-pop">
            {toastMsg}
          </div>
        )}
      </div>
    </div>
  );
};
