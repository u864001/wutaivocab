// ── Web Audio 音效合成、語音朗讀與 9 大場景專屬背景音樂引擎 ──

const NOTES = {
  C2: 65.41, D2: 73.42, Eb2: 77.78, E2: 82.41, F2: 87.31, G2: 98.00, Ab2: 103.83, A2: 110.00, Bb2: 116.54, B2: 123.47,
  C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, Fs3: 185.00, G3: 196.00, Ab3: 207.65, A3: 220.00, Bb3: 233.08, B3: 246.94,
  C4: 261.63, Cs4: 277.18, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.00, Ab4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
  C5: 523.25, Cs5: 554.37, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99, Ab5: 830.61, A5: 880.00, Bb5: 932.33, B5: 987.77,
  C6: 1046.50
};

// ── 9 大場景專屬純程式化音律庫 (0 流量負擔，100% 本地數學合成) ──
const SCENE_BGM_CONFIGS = {
  // 1. 學生溫馨的家 (溫暖吉卜力八音盒)
  home: {
    stepIntervalMs: 520,
    filterFreq: 1600,
    waveType: 'sine',
    pattern: [
      { bass: NOTES.C3, chords: [NOTES.E3, NOTES.G3], melody: NOTES.E4 },
      { chords: [NOTES.B3], melody: NOTES.G4 },
      { chords: [NOTES.C4], melody: NOTES.B4 },
      { chords: [NOTES.E4], melody: NOTES.C5 },
      { bass: NOTES.A2, chords: [NOTES.C3, NOTES.E3], melody: NOTES.A4 },
      { chords: [NOTES.G3], melody: NOTES.E4 },
      { chords: [NOTES.C4], melody: NOTES.G4 },
      { chords: [NOTES.E4], melody: NOTES.A4 },
      { bass: NOTES.F2, chords: [NOTES.A2, NOTES.C3], melody: NOTES.F4 },
      { chords: [NOTES.E3], melody: NOTES.A4 },
      { chords: [NOTES.A3], melody: NOTES.C5 },
      { chords: [NOTES.C4], melody: NOTES.E5 },
      { bass: NOTES.G2, chords: [NOTES.D3, NOTES.G3], melody: NOTES.D5 },
      { chords: [NOTES.B3], melody: NOTES.B4 },
      { chords: [NOTES.D4], melody: NOTES.G4 },
      { chords: [NOTES.G4], melody: NOTES.E4 }
    ]
  },

  // 2. 霧臺國小校長室/活動大廳 (明亮晨會鐘聲與朝氣進行曲)
  school: {
    stepIntervalMs: 480,
    filterFreq: 2200,
    waveType: 'triangle',
    pattern: [
      { bass: NOTES.D3, chords: [NOTES.Fs3, NOTES.A3], melody: NOTES.D5 },
      { chords: [NOTES.A3], melody: NOTES.Fs4 },
      { chords: [NOTES.B3], melody: NOTES.G4 },
      { chords: [NOTES.Cs4], melody: NOTES.E5 },
      { bass: NOTES.G2, chords: [NOTES.B3, NOTES.D4], melody: NOTES.G4 },
      { chords: [NOTES.D4], melody: NOTES.B4 },
      { chords: [NOTES.A3], melody: NOTES.E4 },
      { chords: [NOTES.Fs4], melody: NOTES.D5 },
      { bass: NOTES.A2, chords: [NOTES.Cs4, NOTES.E4], melody: NOTES.A4 },
      { chords: [NOTES.E4], melody: NOTES.Cs5 },
      { chords: [NOTES.D4], melody: NOTES.Fs4 },
      { chords: [NOTES.E4], melody: NOTES.G4 },
      { bass: NOTES.D3, chords: [NOTES.Fs3, NOTES.A3], melody: NOTES.D5 },
      { chords: [NOTES.A3], melody: NOTES.Fs4 },
      { chords: [NOTES.A2], melody: NOTES.E4 },
      { chords: [NOTES.D3], melody: NOTES.D4 }
    ]
  },

  // 3. 雲豹書局 (巴洛克書香古典羽管鍵琴琶音)
  bookstore: {
    stepIntervalMs: 560,
    filterFreq: 1400,
    waveType: 'sine',
    pattern: [
      { bass: NOTES.A2, chords: [NOTES.C3, NOTES.E3], melody: NOTES.A4 },
      { chords: [NOTES.E3], melody: NOTES.C4 },
      { chords: [NOTES.C4], melody: NOTES.E4 },
      { chords: [NOTES.E4], melody: NOTES.A4 },
      { bass: NOTES.D3, chords: [NOTES.F3, NOTES.A3], melody: NOTES.D5 },
      { chords: [NOTES.A3], melody: NOTES.F4 },
      { chords: [NOTES.F4], melody: NOTES.D4 },
      { chords: [NOTES.D4], melody: NOTES.F4 },
      { bass: NOTES.E2, chords: [NOTES.Ab3, NOTES.B3], melody: NOTES.E5 },
      { chords: [NOTES.B3], melody: NOTES.Ab4 },
      { chords: [NOTES.Ab4], melody: NOTES.E4 },
      { chords: [NOTES.B3], melody: NOTES.D4 },
      { bass: NOTES.A2, chords: [NOTES.C3, NOTES.E3], melody: NOTES.C5 },
      { chords: [NOTES.E3], melody: NOTES.B4 },
      { chords: [NOTES.C3], melody: NOTES.A4 },
      { chords: [NOTES.A2], melody: NOTES.E4 }
    ]
  },

  // 4. 黑熊超市 (輕快活潑木琴撥弦跳躍市集風)
  supermarket: {
    stepIntervalMs: 460,
    filterFreq: 2400,
    waveType: 'triangle',
    pattern: [
      { bass: NOTES.F2, chords: [NOTES.A3, NOTES.C4], melody: NOTES.C5 },
      { chords: [NOTES.C3], melody: NOTES.F4 },
      { chords: [NOTES.A3], melody: NOTES.A4 },
      { chords: [NOTES.C4], melody: NOTES.C5 },
      { bass: NOTES.Bb2, chords: [NOTES.D3, NOTES.F3], melody: NOTES.D5 },
      { chords: [NOTES.D3], melody: NOTES.Bb4 },
      { chords: [NOTES.F3], melody: NOTES.F4 },
      { chords: [NOTES.Bb3], melody: NOTES.D5 },
      { bass: NOTES.C3, chords: [NOTES.E3, NOTES.G3], melody: NOTES.E5 },
      { chords: [NOTES.G3], melody: NOTES.C5 },
      { chords: [NOTES.E3], melody: NOTES.G4 },
      { chords: [NOTES.G3], melody: NOTES.E5 },
      { bass: NOTES.F2, chords: [NOTES.A3, NOTES.C4], melody: NOTES.F5 },
      { chords: [NOTES.C3], melody: NOTES.A4 },
      { chords: [NOTES.A2], melody: NOTES.C5 },
      { chords: [NOTES.F2], melody: NOTES.F4 }
    ]
  },

  // 5. 飛鼠公園 (清涼高山森林鳥鳴與清泉微風水滴)
  park: {
    stepIntervalMs: 600,
    filterFreq: 1900,
    waveType: 'sine',
    pattern: [
      { bass: NOTES.G2, chords: [NOTES.D3, NOTES.G3], melody: NOTES.B4 },
      { chords: [NOTES.B3], melody: NOTES.G5 },
      { chords: [NOTES.D4], melody: NOTES.D5 },
      { chords: [NOTES.G4], melody: NOTES.B5 },
      { bass: NOTES.E2, chords: [NOTES.B2, NOTES.E3], melody: NOTES.E5 },
      { chords: [NOTES.G3], melody: NOTES.B4 },
      { chords: [NOTES.B3], melody: NOTES.E5 },
      { chords: [NOTES.E4], melody: NOTES.G5 },
      { bass: NOTES.C3, chords: [NOTES.G3, NOTES.C4], melody: NOTES.G5 },
      { chords: [NOTES.E3], melody: NOTES.E5 },
      { chords: [NOTES.G3], melody: NOTES.D5 },
      { chords: [NOTES.C4], melody: NOTES.B4 },
      { bass: NOTES.D2, chords: [NOTES.A2, NOTES.D3], melody: NOTES.A5 },
      { chords: [NOTES.Fs3], melody: NOTES.D5 },
      { chords: [NOTES.A3], melody: NOTES.Fs5 },
      { chords: [NOTES.D3], melody: NOTES.G4 }
    ]
  },

  // 6. 貓頭鷹診所 (療癒溫柔水晶豎琴與舒緩微風)
  clinic: {
    stepIntervalMs: 640,
    filterFreq: 1300,
    waveType: 'sine',
    pattern: [
      { bass: NOTES.Eb2, chords: [NOTES.Bb2, NOTES.G3], melody: NOTES.Eb5 },
      { chords: [NOTES.G3], melody: NOTES.Bb4 },
      { chords: [NOTES.Bb3], melody: NOTES.G5 },
      { chords: [NOTES.Eb4], melody: NOTES.Eb5 },
      { bass: NOTES.Ab2, chords: [NOTES.C3, NOTES.Eb3], melody: NOTES.C5 },
      { chords: [NOTES.Eb3], melody: NOTES.Ab4 },
      { chords: [NOTES.Ab3], melody: NOTES.C5 },
      { chords: [NOTES.C4], melody: NOTES.Eb5 },
      { bass: NOTES.Bb2, chords: [NOTES.D3, NOTES.F3], melody: NOTES.D5 },
      { chords: [NOTES.F3], melody: NOTES.Bb4 },
      { chords: [NOTES.D3], melody: NOTES.F4 },
      { chords: [NOTES.F3], melody: NOTES.D5 },
      { bass: NOTES.Eb2, chords: [NOTES.G3, NOTES.Bb3], melody: NOTES.Bb4 },
      { chords: [NOTES.Bb3], melody: NOTES.G4 },
      { chords: [NOTES.G3], melody: NOTES.Eb4 },
      { chords: [NOTES.Eb2], melody: NOTES.Bb3 }
    ]
  },

  // 7. 霧臺客運站 (公路旅行民謠原木吉他掃弦)
  station: {
    stepIntervalMs: 490,
    filterFreq: 2000,
    waveType: 'triangle',
    pattern: [
      { bass: NOTES.E2, chords: [NOTES.B2, NOTES.E3], melody: NOTES.E4 },
      { chords: [NOTES.Ab3], melody: NOTES.B4 },
      { chords: [NOTES.B2], melody: NOTES.Ab4 },
      { chords: [NOTES.E3], melody: NOTES.E5 },
      { bass: NOTES.A2, chords: [NOTES.E3, NOTES.A3], melody: NOTES.Cs5 },
      { chords: [NOTES.A3], melody: NOTES.E4 },
      { chords: [NOTES.E3], melody: NOTES.A4 },
      { chords: [NOTES.A2], melody: NOTES.Cs5 },
      { bass: NOTES.B2, chords: [NOTES.Fs3, NOTES.B3], melody: NOTES.Ds5 },
      { chords: [NOTES.B3], melody: NOTES.Fs4 },
      { chords: [NOTES.Fs3], melody: NOTES.B4 },
      { chords: [NOTES.B2], melody: NOTES.Ds5 },
      { bass: NOTES.E2, chords: [NOTES.B2, NOTES.E3], melody: NOTES.E5 },
      { chords: [NOTES.Ab3], melody: NOTES.E4 },
      { chords: [NOTES.B2], melody: NOTES.Ab4 },
      { chords: [NOTES.E2], melody: NOTES.E4 }
    ]
  },

  // 8. 百步蛇集會所 (原民古調五聲音階與部落竹笛木鼓心跳律動)
  plaza: {
    stepIntervalMs: 540,
    filterFreq: 1500,
    waveType: 'triangle',
    pattern: [
      { bass: NOTES.D2, chords: [NOTES.A2, NOTES.D3], melody: NOTES.D4 },
      { chords: [NOTES.F3], melody: NOTES.A4 },
      { chords: [NOTES.A2], melody: NOTES.F4 },
      { chords: [NOTES.D3], melody: NOTES.D5 },
      { bass: NOTES.G2, chords: [NOTES.D3, NOTES.G3], melody: NOTES.G4 },
      { chords: [NOTES.Bb3], melody: NOTES.D5 },
      { chords: [NOTES.D3], melody: NOTES.C5 },
      { chords: [NOTES.G2], melody: NOTES.A4 },
      { bass: NOTES.C2, chords: [NOTES.G2, NOTES.C3], melody: NOTES.C5 },
      { chords: [NOTES.E3], melody: NOTES.G4 },
      { chords: [NOTES.G2], melody: NOTES.E4 },
      { chords: [NOTES.C3], melody: NOTES.G4 },
      { bass: NOTES.D2, chords: [NOTES.A2, NOTES.D3], melody: NOTES.A4 },
      { chords: [NOTES.F3], melody: NOTES.D4 },
      { chords: [NOTES.A2], melody: NOTES.F4 },
      { chords: [NOTES.D2], melody: NOTES.D4 }
    ]
  },

  // 9. 山豬影城 (復古爆米花微醺老爵士搖擺沙發風)
  cinema: {
    stepIntervalMs: 530,
    filterFreq: 1700,
    waveType: 'triangle',
    pattern: [
      { bass: NOTES.Bb2, chords: [NOTES.D3, NOTES.F3], melody: NOTES.F4 },
      { chords: [NOTES.D3], melody: NOTES.Bb4 },
      { chords: [NOTES.F2], melody: NOTES.D4 },
      { chords: [NOTES.Bb2], melody: NOTES.F5 },
      { bass: NOTES.G2, chords: [NOTES.Bb2, NOTES.D3], melody: NOTES.D4 },
      { chords: [NOTES.Bb2], melody: NOTES.G4 },
      { chords: [NOTES.D2], melody: NOTES.Bb4 },
      { chords: [NOTES.G2], melody: NOTES.D5 },
      { bass: NOTES.C3, chords: [NOTES.Eb3, NOTES.G3], melody: NOTES.G4 },
      { chords: [NOTES.Eb3], melody: NOTES.C5 },
      { chords: [NOTES.G2], melody: NOTES.Eb4 },
      { chords: [NOTES.C3], melody: NOTES.G5 },
      { bass: NOTES.F2, chords: [NOTES.A2, NOTES.C3], melody: NOTES.F4 },
      { chords: [NOTES.C3], melody: NOTES.A4 },
      { chords: [NOTES.A2], melody: NOTES.F4 },
      { chords: [NOTES.F2], melody: NOTES.C4 }
    ]
  }
};

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.currentSceneId = null;
    this.sceneBgmRunning = false;
    this.sceneBgmTimer = null;
    this.sceneBgmMasterGain = null;
    this.sceneBgmFilter = null;
    this.sceneBgmDelay = null;
    this.sceneBgmDelayGain = null;
    this.sceneBgmStep = 0;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      stopSpeech();
      this.stopSceneBgm();
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

  // ── 9 大場景專屬背景音樂啟動 (0 頻寬負擔，純演算法合成) ──
  startSceneBgm(sceneId = 'home') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    // 若同一場景正在播放，避免重啟
    if (this.sceneBgmRunning && this.currentSceneId === sceneId) return;

    // 先停止前一個場景
    if (this.sceneBgmRunning) {
      this.stopSceneBgm();
    }

    const config = SCENE_BGM_CONFIGS[sceneId] || SCENE_BGM_CONFIGS.home;
    this.currentSceneId = sceneId;
    this.sceneBgmRunning = true;
    this.sceneBgmStep = 0;

    try {
      this.sceneBgmMasterGain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      this.sceneBgmMasterGain.gain.setValueAtTime(0.001, now);
      // 溫柔淡入 0.6 秒 (0.38 音量)
      this.sceneBgmMasterGain.gain.exponentialRampToValueAtTime(0.38, now + 0.6);

      // 低通暖色濾波
      this.sceneBgmFilter = this.ctx.createBiquadFilter();
      this.sceneBgmFilter.type = 'lowpass';
      this.sceneBgmFilter.frequency.setValueAtTime(config.filterFreq || 1600, now);

      // 空間微延遲
      this.sceneBgmDelay = this.ctx.createDelay();
      this.sceneBgmDelay.delayTime.setValueAtTime(0.32, now);
      this.sceneBgmDelayGain = this.ctx.createGain();
      this.sceneBgmDelayGain.gain.setValueAtTime(0.24, now);

      this.sceneBgmDelay.connect(this.sceneBgmDelayGain);
      this.sceneBgmDelayGain.connect(this.sceneBgmDelay);
      this.sceneBgmDelayGain.connect(this.sceneBgmMasterGain);

      this.sceneBgmFilter.connect(this.sceneBgmMasterGain);
      this.sceneBgmFilter.connect(this.sceneBgmDelay);
      this.sceneBgmMasterGain.connect(this.ctx.destination);
    } catch (e) {
      return;
    }

    const stepIntervalMs = config.stepIntervalMs || 520;

    const tick = () => {
      if (!this.sceneBgmRunning || !this.ctx || this.isMuted) return;

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const idx = this.sceneBgmStep % config.pattern.length;
      const beat = config.pattern[idx];
      const now = this.ctx.currentTime;

      // 1. 低音旋律 (Bass)
      if (beat.bass) {
        this.scheduleWarmTone(beat.bass, config.waveType || 'triangle', now, 0.9, 0.22);
      }
      // 2. 和弦伴奏 (Chords)
      if (beat.chords && beat.chords.length > 0) {
        beat.chords.forEach(freq => {
          this.scheduleWarmTone(freq, 'sine', now + 0.02, 0.65, 0.10);
        });
      }
      // 3. 主旋律音符 (Melody)
      if (beat.melody) {
        this.scheduleMusicBoxNote(beat.melody, now, 0.85, 0.26, config.waveType);
      }

      this.sceneBgmStep++;
      this.sceneBgmTimer = setTimeout(tick, stepIntervalMs);
    };

    tick();
  }

  scheduleWarmTone(freq, type, startTime, duration = 0.9, vol = 0.22) {
    if (!this.ctx || !this.sceneBgmFilter) return;
    try {
      const now = this.ctx.currentTime;
      const start = Math.max(startTime, now + 0.01);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(vol, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      osc.connect(gain);
      gain.connect(this.sceneBgmFilter);

      osc.start(start);
      osc.stop(start + duration + 0.05);
    } catch (e) {}
  }

  scheduleMusicBoxNote(freq, startTime, duration = 0.85, vol = 0.26, waveType = 'sine') {
    if (!this.ctx || !this.sceneBgmFilter) return;
    try {
      const now = this.ctx.currentTime;
      const start = Math.max(startTime, now + 0.01);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(vol, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      osc.connect(gain);
      gain.connect(this.sceneBgmFilter);

      osc.start(start);
      osc.stop(start + duration + 0.05);
    } catch (e) {}
  }

  stopSceneBgm() {
    this.sceneBgmRunning = false;
    this.currentSceneId = null;
    if (this.sceneBgmTimer) {
      clearTimeout(this.sceneBgmTimer);
      this.sceneBgmTimer = null;
    }
    if (this.sceneBgmMasterGain && this.ctx) {
      try {
        this.sceneBgmMasterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
        setTimeout(() => {
          try {
            if (this.sceneBgmMasterGain) {
              this.sceneBgmMasterGain.disconnect();
              this.sceneBgmMasterGain = null;
            }
          } catch (e) {}
        }, 350);
      } catch (e) {
        this.sceneBgmMasterGain = null;
      }
    }
  }

  // 相容函式別名 (Backward Compatibility)
  startHomeBgm() {
    this.startSceneBgm('home');
  }

  stopHomeBgm() {
    this.stopSceneBgm();
  }

  toggleHomeBgm() {
    return this.toggleSceneBgm('home');
  }

  toggleSceneBgm(sceneId = 'home') {
    if (this.sceneBgmRunning) {
      this.stopSceneBgm();
      return false;
    } else {
      this.startSceneBgm(sceneId);
      return true;
    }
  }

  isHomeBgmActive() {
    return Boolean(this.sceneBgmRunning);
  }

  isSceneBgmActive() {
    return Boolean(this.sceneBgmRunning);
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
