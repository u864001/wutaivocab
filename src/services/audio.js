// ── Web Audio 音效合成與語音朗讀引擎 ──

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      stopSpeech();
    }
    return this.isMuted;
  }

  playTone(freq, type = 'sine', duration = 0.15, vol = 0.15) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio error safely caught
    }
  }

  // 答對音效：清脆雙和弦
  correct() {
    this.playTone(659.25, 'sine', 0.12, 0.18); // E5
    setTimeout(() => this.playTone(880.00, 'sine', 0.20, 0.20), 80); // A5
  }

  // 答錯音效：低沉鋸齒波
  wrong() {
    this.playTone(160, 'sawtooth', 0.25, 0.16);
  }

  // 連擊 Combo 特效音
  combo(streak = 2) {
    const baseFreq = 500 + Math.min(streak * 70, 600);
    this.playTone(baseFreq, 'sine', 0.15, 0.22);
    setTimeout(() => this.playTone(baseFreq * 1.25, 'sine', 0.22, 0.25), 90);
  }

  // 雷射發射
  laser() {
    this.playTone(700, 'square', 0.08, 0.06);
    setTimeout(() => this.playTone(450, 'square', 0.08, 0.06), 40);
  }

  // 爆炸音效
  explosion() {
    this.playTone(90, 'sawtooth', 0.35, 0.25);
  }

  // 勝利通關旋律
  win() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.2, 0.15), idx * 120);
    });
  }

  // 按鈕點擊感
  click() {
    this.playTone(400, 'triangle', 0.04, 0.08);
  }
}

export const soundEngine = new SoundEngine();

// ── 語音庫快取與性別音色匹配系統 ──
let cachedVoices = [];

const loadVoices = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      cachedVoices = window.speechSynthesis.getVoices() || [];
    } catch (e) {
      cachedVoices = [];
    }
  }
};

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

const findBestVoice = (gender = 'male', preferredLang = 'en-US') => {
  if (!cachedVoices || cachedVoices.length === 0) {
    loadVoices();
  }
  if (!cachedVoices || cachedVoices.length === 0) return null;

  const englishVoices = cachedVoices.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
  if (englishVoices.length === 0) return null;

  // 常見男聲關鍵字 (Windows / macOS / Chrome / Edge / iOS)
  const maleKeywords = [
    'david', 'mark', 'guy', 'george', 'male', 'james', 'richard',
    'stefan', 'ryan', 'daniel', 'oliver', 'tom', 'alex', 'fred', 'bruce'
  ];
  // 常見女聲關鍵字
  const femaleKeywords = [
    'zira', 'jenny', 'aria', 'hazel', 'susan', 'female', 'catherine',
    'linda', 'samantha', 'victoria', 'karen', 'anna', 'stephanie', 'fiona'
  ];

  if (gender === 'male') {
    const maleVoice = englishVoices.find(v => {
      const name = v.name.toLowerCase();
      return maleKeywords.some(kw => name.includes(kw));
    });
    if (maleVoice) return maleVoice;
  } else if (gender === 'female') {
    const femaleVoice = englishVoices.find(v => {
      const name = v.name.toLowerCase();
      return femaleKeywords.some(kw => name.includes(kw));
    });
    if (femaleVoice) return femaleVoice;
  }

  // 若無直接關鍵字命中，優先使用指定語系聲音 (如 en-US)
  const langMatch = englishVoices.find(v => v.lang.toLowerCase() === preferredLang.toLowerCase());
  return langMatch || englishVoices[0];
};

// ── 立即強制中斷所有 TTS 語音朗讀 ──
export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // Safe ignore
    }
  }
};

// ── 英文單字與對話樹語音播放 (TTS - 支援人物專屬音色、音調與性別) ──
export const speakEnglish = (text, options = {}) => {
  if (soundEngine.isMuted) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  // 1. 播放新句子前，立即中斷上一句，防止聲音疊加或延遲殘留
  stopSpeech();

  if (!text) return;

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    const lang = options.lang || 'en-US';
    utterance.lang = lang;

    // 2. 應用角色專屬語速與音調 (Pitch & Rate)
    // 音調 Pitch：0.5 ~ 2.0 (男性低沉野獸/大熊音約 0.65~0.75，高亢活潑飛鼠約 1.35)
    utterance.rate = typeof options.rate === 'number' ? options.rate : 0.88;
    utterance.pitch = typeof options.pitch === 'number' ? options.pitch : 1.0;

    // 3. 匹配男女專屬音色 (Voice)
    const voice = findBestVoice(options.gender || 'male', lang);
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    // Safe caught
  }
};
