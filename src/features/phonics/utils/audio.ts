import type { PhonicsCard } from '../types/phonics';

// Audio Context singleton for pure Web Audio API sound synthesis
let audioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export async function ensureAudioContext(): Promise<AudioContext | null> {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch (e) {}
  }
  return ctx;
}

// UI Sound Effects
export function playCardSnapSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}

export function playRemoveSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(560, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);

  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}

export function playSuccessChime() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + index * 0.1;
    const duration = 0.35;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.18, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  });
}

export function playErrorBonk() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(220, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(130, ctx.currentTime + 0.25);

  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

/**
 * Pure Vowel Formant Synthesizer (Acoustic Phonetics Model)
 * Generates natural isolated human vowel sounds (/æ/, /ɛ/, /ɪ/, /ɒ/, /ʌ/)
 * Eliminates the problem where TTS spells out abbreviations (e.g. "ih" -> "eye aitch").
 */
export function playVowelFormant(vowel: 'a' | 'e' | 'i' | 'o' | 'u'): Promise<void> {
  return new Promise((resolve) => {
    const ctx = getAudioContext();
    if (!ctx) {
      resolve();
      return;
    }

    const formantMap: Record<string, { f1: number; f2: number; f3: number }> = {
      'a': { f1: 820, f2: 1650, f3: 2500 }, // /æ/ as in cat / apple
      'e': { f1: 530, f2: 1850, f3: 2600 }, // /ɛ/ as in egg / bed
      'i': { f1: 390, f2: 2150, f3: 2850 }, // /ɪ/ as in in / igloo
      'o': { f1: 580, f2: 950,  f3: 2450 }, // /ɒ/ as in octopus / on
      'u': { f1: 640, f2: 1250, f3: 2600 }, // /ʌ/ as in cup / umbrella
    };

    const formants = formantMap[vowel];
    if (!formants) {
      resolve();
      return;
    }

    const sampleRate = ctx.sampleRate;
    const duration = 0.38;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, numSamples, sampleRate);
    const channelData = buffer.getChannelData(0);

    const f0 = 195; // Friendly vocal pitch ~195Hz
    const period = sampleRate / f0;

    // Resonator filter helper (2-pole IIR bandpass resonator)
    function makeResonator(freq: number, bandwidth: number) {
      const r = Math.exp((-Math.PI * bandwidth) / sampleRate);
      const theta = (2 * Math.PI * freq) / sampleRate;
      const a1 = 2 * r * Math.cos(theta);
      const a2 = -r * r;
      const b0 = 1 - a1 - a2;
      let y1 = 0;
      let y2 = 0;
      return (x: number) => {
        const y = b0 * x + a1 * y1 + a2 * y2;
        y2 = y1;
        y1 = y;
        return y;
      };
    }

    const r1 = makeResonator(formants.f1, 80);
    const r2 = makeResonator(formants.f2, 100);
    const r3 = makeResonator(formants.f3, 130);

    for (let n = 0; n < numSamples; n++) {
      const t = n / sampleRate;
      // Vocal envelope with smooth attack and decay
      let env = 1;
      if (t < 0.04) {
        env = t / 0.04;
      } else if (t > duration - 0.08) {
        env = Math.max(0, (duration - t) / 0.08);
      }

      // Glottal excitation pulse
      const phase = (n % period) / period;
      let glottal = 0;
      if (phase < 0.65) {
        glottal = Math.sin(Math.PI * (phase / 0.65));
      } else {
        glottal = -Math.sin(Math.PI * ((phase - 0.65) / 0.35)) * 0.18;
      }

      const excitation = glottal * env;
      const out = r1(excitation) * 0.65 + r2(excitation) * 0.4 + r3(excitation) * 0.18;
      channelData[n] = Math.max(-1, Math.min(1, out * 1.6));
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.65, now);
    source.connect(gain);
    gain.connect(ctx.destination);

    let finished = false;
    const done = () => {
      if (!finished) {
        finished = true;
        resolve();
      }
    };
    source.onended = done;
    setTimeout(done, Math.ceil(duration * 1000) + 100);
    try {
      source.start(now);
    } catch (e) {
      done();
    }
  });
}

// Phoneme pronunciation hint mapping for Web Speech API (using words that don't spell abbreviations)
const PHONEME_SPEECH_MAP: Record<string, string> = {
  // 5 Short Vowels (/æ/, /ɛ/, /ɪ/, /ɒ/, /ʌ/)
  'a': 'ah',
  'e': 'eh',
  'i': 'ih',
  'o': 'ah',
  'u': 'uh',

  // Silent e / Split digraphs
  'a_e': 'ay',
  'e_e': 'ee',
  'i_e': 'eye',
  'o_e': 'oh',
  'u_e': 'you',

  // Consonant Digraphs
  'ch': 'ch',
  'sh': 'sh',
  'th(voiced)': 'the',
  'th(unvoiced)': 'th',
  'wh': 'w',
  'ph': 'f',
  'ck': 'k',
  'ng': 'ng',
  'qu': 'kw',

  // Blends
  'bl': 'bl',
  'cl': 'cl',
  'fl': 'fl',
  'gl': 'gl',
  'pl': 'pl',
  'sl': 'sl',
  'br': 'br',
  'cr': 'cr',
  'dr': 'dr',
  'fr': 'fr',
  'gr': 'gr',
  'pr': 'pr',
  'tr': 'tr',
  'sk': 'sk',
  'sm': 'sm',
  'sn': 'sn',
  'sp': 'sp',
  'st': 'st',
  'sw': 'sw',
  'nd': 'nd',
  'nk': 'nk',
  'nt': 'nt',
  'mp': 'mp',
  'ld': 'ld',
  'lk': 'lk',
  'ft': 'ft',

  // Vowel Teams
  'ai': 'ay',
  'ay': 'ay',
  'ee': 'ee',
  'ea': 'ee',
  'igh': 'eye',
  'oa': 'oh',
  'ow': 'ow',
  'oi': 'oy',
  'oy': 'oy',
  'ou': 'ow',
  'oo': 'oo',
  'au': 'aw',
  'aw': 'aw',
  'ew': 'you',

  // Bossy R
  'ar': 'ar',
  'er': 'er',
  'ir': 'er',
  'or': 'or',
  'ur': 'er',
  'air': 'air',
  'are': 'air',
  'ear': 'ear',
  'ore': 'or',

  // Silent Letters & Rules
  'kn': 'n',
  'wr': 'r',
  'gn': 'n',
  'mb': 'm',
  'tch': 'ch',
  'dge': 'j',
  'c(s)': 's',
  'g(j)': 'j',
};

// Anchor words for short vowels so TTS can speak clear real words
const VOWEL_ANCHORS: Record<string, string> = {
  'a': 'apple',
  'e': 'egg',
  'i': 'igloo',
  'o': 'octopus',
  'u': 'umbrella',
};

let preferredEnglishVoice: SpeechSynthesisVoice | null = null;

function getEnglishVoice(): SpeechSynthesisVoice | null {
  if (preferredEnglishVoice) return preferredEnglishVoice;
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  const naturalUS = voices.find(
    (v) =>
      (v.lang.startsWith('en-US') || v.lang.startsWith('en_US')) &&
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny'))
  );
  if (naturalUS) {
    preferredEnglishVoice = naturalUS;
    return naturalUS;
  }
  const anyUS = voices.find((v) => v.lang.startsWith('en-US') || v.lang.startsWith('en_US'));
  if (anyUS) {
    preferredEnglishVoice = anyUS;
    return anyUS;
  }
  const anyEN = voices.find((v) => v.lang.startsWith('en'));
  if (anyEN) {
    preferredEnglishVoice = anyEN;
    return anyEN;
  }
  return null;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    preferredEnglishVoice = null;
    getEnglishVoice();
  };
}

export type PronunciationMode = 'phoneme' | 'word';

/**
 * Speaks a phonics card.
 * For the 5 short vowels (a, e, i, o, u):
 * - If mode is 'phoneme': uses pure Web Audio formant model (avoiding TTS "ih", "eh" abbreviation spelling issues).
 * - If mode is 'word': speaks the anchor word (apple, egg, igloo, octopus, umbrella).
 */
export async function speakPhoneme(card: PhonicsCard, mode: PronunciationMode = 'phoneme'): Promise<void> {
  playCardSnapSound();

  const g = card.grapheme.toLowerCase();

  // If it's one of the 5 basic short vowels
  if (card.category === 'short_vowels' && (g === 'a' || g === 'e' || g === 'i' || g === 'o' || g === 'u')) {
    if (mode === 'word') {
      const anchor = VOWEL_ANCHORS[g] || card.sampleWord || g;
      await speakWord(anchor, 0.85);
      return;
    }

    // In 'phoneme' mode:
    // 1. Trigger acoustic formant synthesis (non-blocking)
    playVowelFormant(g as 'a' | 'e' | 'i' | 'o' | 'u').catch(() => {});

    // 2. Pronounce natural human phoneme sound via Web Speech API
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const utteranceText = PHONEME_SPEECH_MAP[g] || g;
      const utterance = new SpeechSynthesisUtterance(utteranceText);
      utterance.lang = 'en-US';
      utterance.rate = 0.82;
      utterance.pitch = 1.05;

      const voice = getEnglishVoice();
      if (voice) utterance.voice = voice;

      let settled = false;
      const finish = () => {
        if (!settled) {
          settled = true;
          resolve();
        }
      };

      utterance.onend = finish;
      utterance.onerror = finish;
      setTimeout(finish, 1000); // Safety timeout so blending never blocks

      window.speechSynthesis.speak(utterance);
    });
  }

  // Other phonemes via Web Speech API
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();

    const utteranceText = PHONEME_SPEECH_MAP[card.grapheme] || card.grapheme.replace(/[^a-zA-Z]/g, '');
    const utterance = new SpeechSynthesisUtterance(utteranceText);
    utterance.lang = 'en-US';
    utterance.rate = 0.82;
    utterance.pitch = 1.05;

    const voice = getEnglishVoice();
    if (voice) utterance.voice = voice;

    let settled = false;
    const finish = () => {
      if (!settled) {
        settled = true;
        resolve();
      }
    };

    utterance.onend = finish;
    utterance.onerror = finish;
    setTimeout(finish, 1000); // Safety timeout

    window.speechSynthesis.speak(utterance);
  });
}

export function speakWord(word: string, rate: number = 0.85): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();

    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanWord);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const voice = getEnglishVoice();
    if (voice) utterance.voice = voice;

    let settled = false;
    const finish = () => {
      if (!settled) {
        settled = true;
        resolve();
      }
    };

    utterance.onend = finish;
    utterance.onerror = finish;
    setTimeout(finish, 1500); // Safety timeout

    window.speechSynthesis.speak(utterance);
  });
}

// Blends phonemes sequentially with highlight callback
export async function blendPhonemeSequence(
  cards: PhonicsCard[],
  isSlow: boolean,
  onHighlight: (index: number | null) => void,
  blendedWord: string,
  mode: PronunciationMode = 'phoneme'
): Promise<void> {
  if (cards.length === 0) return;

  // Step 1: Speak each phoneme sequentially
  for (let i = 0; i < cards.length; i++) {
    onHighlight(i);
    await speakPhoneme(cards[i], mode);
    const pauseTime = isSlow ? 650 : 380;
    await new Promise((r) => setTimeout(r, pauseTime));
  }

  // Brief pause before blending all together
  onHighlight(null);
  await new Promise((r) => setTimeout(r, 220));

  // Step 2: Highlight entire board (-1 flag for all) and speak combined word
  onHighlight(-1);
  await speakWord(blendedWord, isSlow ? 0.75 : 0.88);
  await new Promise((r) => setTimeout(r, 400));
  onHighlight(null);
}
