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
    } catch {}
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

  gain.gain.setValueAtTime(0.10, ctx.currentTime);
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
 * Standard Acoustic Formant Model for American English Short Vowels:
 * /æ/ (ă - butterfly a, cat, apple)
 * /ɛ/ (ĕ - bed, egg)
 * /ɪ/ (ĭ - igloo, in, it)
 * /ɒ/ (ŏ - octopus, on, top)
 * /ʌ/ (ŭ - umbrella, up, cup)
 */
interface FormantSpec {
  f1: number;
  f2: number;
  f3: number;
  f4: number;
  bw1: number;
  bw2: number;
  bw3: number;
  bw4: number;
  g1: number;
  g2: number;
  g3: number;
  g4: number;
}

const SHORT_VOWEL_FORMANTS: Record<'a' | 'e' | 'i' | 'o' | 'u', FormantSpec> = {
  // /æ/ Butterfly A (apple, cat, bat): High F1 (open jaw), high F2 (fronted tongue)
  'a': {
    f1: 850, f2: 1720, f3: 2650, f4: 3500,
    bw1: 80, bw2: 110, bw3: 140, bw4: 200,
    g1: 1.0, g2: 0.60, g3: 0.28, g4: 0.10,
  },
  // /ɛ/ Short E (egg, bed, red): Mid F1, front high F2
  'e': {
    f1: 540, f2: 1850, f3: 2600, f4: 3600,
    bw1: 70, bw2: 90,  bw3: 130, bw4: 200,
    g1: 1.0, g2: 0.50, g3: 0.22, g4: 0.08,
  },
  // /ɪ/ Short I (igloo, in, fish): Low F1, high front F2 (lax front vowel, never spelled "ih")
  'i': {
    f1: 390, f2: 2150, f3: 2750, f4: 3650,
    bw1: 60, bw2: 85,  bw3: 125, bw4: 200,
    g1: 1.0, g2: 0.45, g3: 0.20, g4: 0.08,
  },
  // /ɒ/ Short O (octopus, pot, top): Open back vowel
  'o': {
    f1: 600, f2: 960,  f3: 2450, f4: 3400,
    bw1: 70, bw2: 90,  bw3: 140, bw4: 200,
    g1: 1.0, g2: 0.65, g3: 0.18, g4: 0.06,
  },
  // /ʌ/ Short U (umbrella, cup, bus): Open-mid central vowel
  'u': {
    f1: 650, f2: 1220, f3: 2550, f4: 3500,
    bw1: 70, bw2: 90,  bw3: 130, bw4: 200,
    g1: 1.0, g2: 0.55, g3: 0.20, g4: 0.06,
  },
};

// In-memory pre-rendered AudioBuffer cache for 0ms latency playback
const vowelBufferCache: Partial<Record<'a' | 'e' | 'i' | 'o' | 'u', AudioBuffer>> = {};

function createVowelBuffer(ctx: AudioContext, vowel: 'a' | 'e' | 'i' | 'o' | 'u'): AudioBuffer {
  const spec = SHORT_VOWEL_FORMANTS[vowel];
  const sampleRate = ctx.sampleRate || 44100;
  const duration = 0.36; // 360ms optimal human speech modeling duration
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const channelData = buffer.getChannelData(0);

  function makeResonator(f: number, bw: number) {
    const r = Math.exp((-Math.PI * bw) / sampleRate);
    const theta = (2 * Math.PI * f) / sampleRate;
    const a1 = 2 * r * Math.cos(theta);
    const a2 = -r * r;
    const b0 = (1 - r) * Math.sin(theta);
    let y1 = 0;
    let y2 = 0;
    return (x: number) => {
      const y = b0 * x + a1 * y1 + a2 * y2;
      y2 = y1;
      y1 = y;
      return y;
    };
  }

  const r1 = makeResonator(spec.f1, spec.bw1);
  const r2 = makeResonator(spec.f2, spec.bw2);
  const r3 = makeResonator(spec.f3, spec.bw3);
  const r4 = makeResonator(spec.f4, spec.bw4);

  let phase = 0;
  let maxAbs = 0;
  const rawSignal = new Float32Array(numSamples);

  for (let n = 0; n < numSamples; n++) {
    const t = n / sampleRate;
    // Human inflection: subtle downward pitch contour from 208Hz to 182Hz
    const f0 = 208 - 26 * (t / duration) + 1.8 * Math.sin(2 * Math.PI * 5 * t);
    phase += f0 / sampleRate;
    if (phase >= 1.0) phase -= 1.0;

    // Liljencrants-Fant glottal flow model
    let glottal = 0;
    if (phase < 0.68) {
      glottal = Math.sin((Math.PI * phase) / 0.68);
    } else {
      glottal = -Math.exp(-12 * (phase - 0.68)) * 0.35;
    }

    // Envelope: 20ms soft attack, steady body, 70ms natural exponential release
    let env = 1.0;
    if (t < 0.02) {
      env = t / 0.02;
    } else if (t > duration - 0.07) {
      const rel = (duration - t) / 0.07;
      env = Math.max(0, rel * rel);
    }

    // Subtle breathiness / vocal cord shimmer
    const noise = (Math.random() * 2 - 1) * 0.012;
    const excitation = (glottal + noise) * env;

    const out =
      r1(excitation) * spec.g1 +
      r2(excitation) * spec.g2 +
      r3(excitation) * spec.g3 +
      r4(excitation) * spec.g4;

    rawSignal[n] = out;
    const absVal = Math.abs(out);
    if (absVal > maxAbs) maxAbs = absVal;
  }

  // Peak normalization to 0.85 (crystal-clear, loud, no clipping)
  const scale = maxAbs > 0 ? 0.85 / maxAbs : 1.0;
  for (let n = 0; n < numSamples; n++) {
    channelData[n] = Math.max(-1, Math.min(1, rawSignal[n] * scale));
  }

  return buffer;
}

/**
 * Pure Vowel Formant Synthesizer (Acoustic Phonetics Model)
 * Generates natural isolated human vowel sounds (/æ/, /ɛ/, /ɪ/, /ɒ/, /ʌ/) with 0ms latency.
 */
export function playVowelFormant(vowel: 'a' | 'e' | 'i' | 'o' | 'u'): Promise<void> {
  return new Promise((resolve) => {
    const ctx = getAudioContext();
    if (!ctx) {
      resolve();
      return;
    }

    if (!vowelBufferCache[vowel]) {
      vowelBufferCache[vowel] = createVowelBuffer(ctx, vowel);
    }
    const buffer = vowelBufferCache[vowel]!;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.9, now);
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
    setTimeout(done, Math.ceil(buffer.duration * 1000) + 50);

    try {
      source.start(now);
    } catch {
      done();
    }
  });
}

// Phoneme pronunciation hint mapping for Web Speech API
const PHONEME_SPEECH_MAP: Record<string, string> = {
  // Silent e / Split digraphs
  'a_e': 'ay',
  'e_e': 'ee',
  'i_e': 'eye',
  'o_e': 'oh',
  'u_e': 'you',

  // Consonant Digraphs
  'ch': 'chair',
  'sh': 'ship',
  'th(voiced)': 'the',
  'th(unvoiced)': 'thumb',
  'wh': 'whale',
  'ph': 'phone',
  'ck': 'duck',
  'ng': 'ring',
  'qu': 'queen',

  // Blends
  'bl': 'blue',
  'cl': 'clap',
  'fl': 'flag',
  'gl': 'glad',
  'pl': 'play',
  'sl': 'slow',
  'br': 'brown',
  'cr': 'crab',
  'dr': 'drum',
  'fr': 'frog',
  'gr': 'green',
  'pr': 'print',
  'tr': 'tree',
  'sk': 'skip',
  'sm': 'smile',
  'sn': 'snake',
  'sp': 'spot',
  'st': 'stop',
  'sw': 'swim',
  'nd': 'hand',
  'nk': 'pink',
  'nt': 'tent',
  'mp': 'lamp',
  'ld': 'cold',
  'lk': 'milk',
  'ft': 'gift',

  // Vowel Teams
  'ai': 'rain',
  'ay': 'day',
  'ee': 'see',
  'ea': 'tea',
  'igh': 'night',
  'oa': 'boat',
  'ow': 'snow',
  'oi': 'coin',
  'oy': 'boy',
  'ou': 'cloud',
  'oo': 'moon',
  'au': 'autumn',
  'aw': 'draw',
  'ew': 'new',

  // Bossy R
  'ar': 'car',
  'er': 'her',
  'ir': 'bird',
  'or': 'fork',
  'ur': 'nurse',
  'air': 'chair',
  'are': 'care',
  'ear': 'bear',
  'ore': 'more',

  // Silent Letters & Rules
  'kn': 'knee',
  'wr': 'write',
  'gn': 'sign',
  'mb': 'lamb',
  'tch': 'watch',
  'dge': 'bridge',
  'c(s)': 'city',
  'g(j)': 'gem',
};

// Anchor words for short vowels so teachers/students can hear clear standard words
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
 * - If mode is 'phoneme': uses pure Web Audio formant model with 0ms delay (/æ/, /ɛ/, /ɪ/, /ɒ/, /ʌ/).
 * - If mode is 'word': speaks standard anchor word (apple, egg, igloo, octopus, umbrella).
 */
export async function speakPhoneme(card: PhonicsCard, mode: PronunciationMode = 'phoneme'): Promise<void> {
  const g = card.grapheme.toLowerCase();

  // If it's one of the 5 basic short vowels
  if (card.category === 'short_vowels' && (g === 'a' || g === 'e' || g === 'i' || g === 'o' || g === 'u')) {
    if (mode === 'word') {
      const anchor = VOWEL_ANCHORS[g] || card.sampleWord || g;
      await speakWord(anchor, 0.85);
      return;
    }

    // In 'phoneme' mode:
    // Pure, instantaneous 0ms acoustic formant synthesis (/æ/, /ɛ/, /ɪ/, /ɒ/, /ʌ/)
    // Never calls SpeechSynthesis, completely eliminating delayed TTS and "eye-aitch" pronunciation bugs!
    await playVowelFormant(g as 'a' | 'e' | 'i' | 'o' | 'u');
    return;
  }

  // In word mode for other cards, speak the sample word if available
  if (mode === 'word' && card.sampleWord) {
    await speakWord(card.sampleWord, 0.85);
    return;
  }

  // Other phonemes via Web Speech API
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve();
      return;
    }

    // Only cancel if speech is actively speaking to prevent resetting the browser audio pipeline
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

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

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

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
