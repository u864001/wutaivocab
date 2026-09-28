export type PhonicsCategory =
  | 'short_vowels'
  | 'silent_e'
  | 'consonant_digraphs'
  | 'beginning_blends'
  | 'ending_blends'
  | 'vowel_teams'
  | 'r_controlled'
  | 'silent_letters'
  | 'basic_consonants'
  | 'custom';

export interface PhonicsCard {
  id: string;
  grapheme: string;
  displayText?: string;
  category: PhonicsCategory;
  phonemeSound: string; // IPA or pronunciation hint
  sampleWord?: string;
  sampleWordZh?: string;
  emoji?: string;
  isSplit?: boolean; // For a_e, e_e, etc.
  isCustom?: boolean;
}

export interface PlacedCard {
  instanceId: string;
  card: PhonicsCard;
}

export type ThemeMode = 'light' | 'dark';
export type Language = 'zh' | 'en';
export type AppMode = 'teaching' | 'quiz';

export interface QuizQuestion {
  id: string;
  word: string;
  phonemes: string[]; // Card graphemes needed to build the word
  meaningZh: string;
  meaningEn: string;
  emoji: string;
  distractors: string[]; // 2-3 distractor graphemes
  categoryHint: PhonicsCategory;
  level: number; // 1: CVC, 2: Digraphs, 3: Silent-e, 4: Teams/Blends, 5: Advanced
}

export interface CategoryMeta {
  id: PhonicsCategory;
  nameZh: string;
  nameEn: string;
  descriptionZh: string;
  descriptionEn: string;
  colorName: string;
  bgLight: string;
  bgDark: string;
  borderLight: string;
  borderDark: string;
  textLight: string;
  textDark: string;
  badgeBg: string;
}

export interface DeckPreset {
  id: string;
  nameZh: string;
  nameEn: string;
  descriptionZh: string;
  descriptionEn: string;
  cardIds: string[];
}
