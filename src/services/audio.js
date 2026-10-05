// ── Web Audio 音效合成、語音朗讀與溫馨背景音樂引擎 ──

const HOME_NOTES = {
  C2: 65.41, F2: 87.31, G2: 98.00, A2: 110.00,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D4: 293.66, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.00
};

// 溫暖八音盒與木屋晨光 16 步拍子循環樂譜 (Cmaj7 -> Am7 -> Fmaj7 -> G7sus4)
const HOME_MUSIC_PATTERN = [
  // ── 小節 1: Cmaj7 (晨曦木屋) ──
  { bass: HOME_NOTES.C3, chords: [HOME_NOTES.E3, HOME_NOTES.G3], melody: HOME_NOTES.E4 },
  { chords: [HOME_NOTES.B3], melody: HOME_NOTES.G4 },
  { chords: [HOME_NOTES.C4], melody: HOME_NOTES.B4 },
  { chords: [HOME_NOTES.E4], melody: HOME_NOTES.C5 },

  // ── 小節 2: Am7 (大武山微風) ──
  { bass: HOME_NOTES.A2, chords: [HOME_NOTES.C3, HOME_NOTES.E3], melody: HOME_NOTES.A4 },
  { chords: [HOME_NOTES.G3], melody: HOME_NOTES.E4 },
  { chords: [HOME_NOTES.C4], melody: HOME_NOTES.G4 },
  { chords: [HOME_NOTES.E4], melody: HOME_NOTES.A4 },

  // ── 小節 3: Fmaj7 (溫暖的柴火) ──
  { bass: HOME_NOTES.F2, chords: [HOME_NOTES.A2, HOME_NOTES.C3], melody: HOME_NOTES.F4 },
  { chords: [HOME_NOTES.E3], melody: HOME_NOTES.A4 },
  { chords: [HOME_NOTES.A3], melody: HOME_NOTES.C5 },
  { chords: [HOME_NOTES.C4], melody: HOME_NOTES.E5 },

  // ── 小節 4: G7sus4 -> G (安心避風港) ──
  { bass: HOME_NOTES.G2, chords: [HOME_NOTES.D3, HOME_NOTES.G3], melody: HOME_NOTES.D5 },
  { chords: [HOME_NOTES.B3], melody: HOME_NOTES.B4 },
  { chords: [HOME_NOTES.D4], melody: HOME_NOTES.G4 },
  { chords: [HOME_NOTES.G4], melody: HOME_NOTES.E4 }
];

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.homeBgmRunning = false;
    this.homeBgmTimer = null;
    this.homeBgmMasterGain = null;
    this.homeBgmFilter = null;
    this.homeBgmDelay = null;
    this.homeBgmDelayGain = null;
    this.homeBgmStep = 0;
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
      this.stopHomeBgm();
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

  // ── 溫馨的家：吉卜力八音盒與溫暖房間循環背景音樂 (Procedural Warm Home BGM) ──
  startHomeBgm() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.homeBgmRunning) return;

    this.homeBgmRunning = true;
    this.homeBgmStep = 0;

    try {
      // 建立 BGM 專屬母音量與暖色低通濾波器
      this.homeBgmMasterGain = this.ctx.createGain();
      this.homeBgmMasterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      // 柔和淡入 0.8 秒
      this.homeBgmMasterGain.gain.exponentialRampToValueAtTime(0.12, this.ctx.currentTime + 0.8);

      // 溫暖低通濾波器 (去除尖銳高頻，營造日系手繪木屋的溫潤空間感)
      this.homeBgmFilter = this.ctx.createBiquadFilter();
      this.homeBgmFilter.type = 'lowpass';
      this.homeBgmFilter.frequency.setValueAtTime(1100, this.ctx.currentTime);

      // 空間微迴音延遲 (Delay)
      this.homeBgmDelay = this.ctx.createDelay();
      this.homeBgmDelay.delayTime.setValueAtTime(0.36, this.ctx.currentTime);
      this.homeBgmDelayGain = this.ctx.createGain();
      this.homeBgmDelayGain.gain.setValueAtTime(0.22, this.ctx.currentTime);

      this.homeBgmDelay.connect(this.homeBgmDelayGain);
      this.homeBgmDelayGain.connect(this.homeBgmDelay);
      this.homeBgmDelayGain.connect(this.homeBgmMasterGain);

      this.homeBgmFilter.connect(this.homeBgmMasterGain);
      this.homeBgmFilter.connect(this.homeBgmDelay);
      this.homeBgmMasterGain.connect(this.ctx.destination);
    } catch (e) {
      return;
    }

    const stepIntervalMs = 540; // 每個步長約 0.54 秒，舒服悠閒的節奏

    const tick = () => {
      if (!this.homeBgmRunning || !this.ctx || this.isMuted) return;

      const idx = this.homeBgmStep % HOME_MUSIC_PATTERN.length;
      const beat = HOME_MUSIC_PATTERN[idx];
      const now = this.ctx.currentTime;

      // 1. 溫暖低音 (Bass)
      if (beat.bass) {
        this.scheduleWarmTone(beat.bass, 'triangle', now, 0.9, 0.08);
      }
      // 2. 溫柔和弦伴奏 (Chords)
      if (beat.chords && beat.chords.length > 0) {
        beat.chords.forEach(freq => {
          this.scheduleWarmTone(freq, 'sine', now + 0.02, 0.65, 0.035);
        });
      }
      // 3. 八音盒清脆主旋律 (Music Box Bell)
      if (beat.melody) {
        this.scheduleMusicBoxNote(beat.melody, now, 0.8, 0.07);
      }

      this.homeBgmStep++;
      this.homeBgmTimer = setTimeout(tick, stepIntervalMs);
    };

    tick();
  }

  scheduleWarmTone(freq, type, startTime, duration, vol) {
    if (!this.ctx || !this.homeBgmFilter) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.homeBgmFilter);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    } catch (e) {}
  }

  scheduleMusicBoxNote(freq, startTime, duration, vol) {
    if (!this.ctx || !this.homeBgmFilter) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // 八音盒音色：敲擊清脆迅速，隨後緩慢長尾迴響
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.homeBgmFilter);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    } catch (e) {}
  }

  stopHomeBgm() {
    this.homeBgmRunning = false;
    if (this.homeBgmTimer) {
      clearTimeout(this.homeBgmTimer);
      this.homeBgmTimer = null;
    }
    if (this.homeBgmMasterGain && this.ctx) {
      try {
        // 柔和淡出 0.3 秒，避免突然截斷產生爆音
        this.homeBgmMasterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
        setTimeout(() => {
          try {
            if (this.homeBgmMasterGain) {
              this.homeBgmMasterGain.disconnect();
              this.homeBgmMasterGain = null;
            }
          } catch (e) {}
        }, 350);
      } catch (e) {
        this.homeBgmMasterGain = null;
      }
    }
  }

  toggleHomeBgm() {
    if (this.homeBgmRunning) {
      this.stopHomeBgm();
      return false;
    } else {
      this.startHomeBgm();
      return true;
    }
  }

  isHomeBgmActive() {
    return Boolean(this.homeBgmRunning);
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
