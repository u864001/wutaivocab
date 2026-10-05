// ── Web Audio 音效合成、語音朗讀與 9 大場景專屬背景音樂引擎 ──

const NOTES = {
  C2: 65.41, D2: 73.42, Eb2: 77.78, E2: 82.41, F2: 87.31, G2: 98.00, Ab2: 103.83, A2: 110.00, Bb2: 116.54, B2: 123.47,
  C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, Fs3: 185.00, G3: 196.00, Ab3: 207.65, A3: 220.00, Bb3: 233.08, B3: 246.94,
  C4: 261.63, Cs4: 277.18, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.00, Ab4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
  C5: 523.25, Cs5: 554.37, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99, Ab5: 830.61, A5: 880.00, Bb5: 932.33, B5: 987.77,
  C6: 1046.50
};

// ── 10 大場景專屬純程式化音律庫 (0 流量負擔，100% 本地數學合成，每場景獨特樂器音色與風格) ──
const SCENE_BGM_CONFIGS = {
  // 0. 霧臺小鎮全景大地圖 (山林晨光號角冒險進行曲)
  town: {
    stepIntervalMs: 410,
    filterFreq: 2200,
    instrument: 'brass_fanfare',
    pattern: [
      { bass: NOTES.D2, chords: [NOTES.Fs3, NOTES.A3], melody: NOTES.D4, drum: 'kick' },
      { chords: [NOTES.A3], melody: NOTES.Fs4 },
      { bass: NOTES.A2, chords: [NOTES.D4], melody: NOTES.A4 },
      { chords: [NOTES.Fs3], melody: NOTES.D5 },
      { bass: NOTES.G2, chords: [NOTES.B3, NOTES.D4], melody: NOTES.G4, drum: 'kick' },
      { chords: [NOTES.D4], melody: NOTES.B4 },
      { bass: NOTES.D3, chords: [NOTES.G4], melody: NOTES.D5 },
      { chords: [NOTES.B3], melody: NOTES.G5 },
      { bass: NOTES.A2, chords: [NOTES.Cs4, NOTES.E4], melody: NOTES.A4, drum: 'kick' },
      { chords: [NOTES.E4], melody: NOTES.Cs5 },
      { bass: NOTES.E2, chords: [NOTES.A4], melody: NOTES.E5 },
      { chords: [NOTES.Cs4], melody: NOTES.A5 },
      { bass: NOTES.D3, chords: [NOTES.Fs3, NOTES.A3], melody: NOTES.D5, drum: 'kick' },
      { chords: [NOTES.A3], melody: NOTES.Fs4 },
      { bass: NOTES.A2, chords: [NOTES.D4], melody: NOTES.E4 },
      { chords: [NOTES.Fs3], melody: NOTES.D4 }
    ]
  },

  // 1. 學生溫馨的家 (溫暖吉卜力夢幻八音盒)
  home: {
    stepIntervalMs: 540,
    filterFreq: 1700,
    instrument: 'musicbox',
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

  // 2. 霧臺國小 (英式威斯敏斯特清晨鐘聲與活力晨號)
  school: {
    stepIntervalMs: 460,
    filterFreq: 2600,
    instrument: 'bells',
    pattern: [
      { bass: NOTES.D3, chords: [NOTES.Fs3, NOTES.A3], melody: NOTES.E4 },
      { chords: [NOTES.A3], melody: NOTES.G4 },
      { bass: NOTES.A2, chords: [NOTES.Cs4], melody: NOTES.Fs4 },
      { chords: [NOTES.Fs3], melody: NOTES.B3 },
      { bass: NOTES.G2, chords: [NOTES.B3, NOTES.D4], melody: NOTES.E4 },
      { chords: [NOTES.D4], melody: NOTES.Fs4 },
      { bass: NOTES.D3, chords: [NOTES.A3], melody: NOTES.G4 },
      { chords: [NOTES.B3], melody: NOTES.E4 },
      { bass: NOTES.D3, chords: [NOTES.Fs3, NOTES.A3], melody: NOTES.D5 },
      { chords: [NOTES.A3], melody: NOTES.Fs4 },
      { bass: NOTES.A2, chords: [NOTES.Cs4], melody: NOTES.A4 },
      { chords: [NOTES.Fs3], melody: NOTES.D5 },
      { bass: NOTES.D3, chords: [NOTES.Fs3, NOTES.A3], melody: NOTES.D5 },
      { chords: [NOTES.A3], melody: NOTES.Fs4 },
      { bass: NOTES.A2, chords: [NOTES.D3], melody: NOTES.E4 },
      { chords: [NOTES.D3], melody: NOTES.D4 }
    ]
  },

  // 3. 雲豹書局 (巴洛克古典羽管鍵琴琶音 Harpsichord)
  bookstore: {
    stepIntervalMs: 500,
    filterFreq: 1500,
    instrument: 'harpsichord',
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

  // 4. 黑熊超市 (輕快俏皮木琴撥弦跳躍市集風 Marimba)
  supermarket: {
    stepIntervalMs: 370,
    filterFreq: 2800,
    instrument: 'marimba',
    pattern: [
      { bass: NOTES.F2, chords: [NOTES.A3], melody: NOTES.C5, drum: 'wood' },
      { chords: [NOTES.C3], melody: NOTES.F4 },
      { bass: NOTES.C3, chords: [NOTES.F3], melody: NOTES.A4, drum: 'wood' },
      { chords: [NOTES.A3], melody: NOTES.C5 },
      { bass: NOTES.Bb2, chords: [NOTES.D3], melody: NOTES.D5, drum: 'wood' },
      { chords: [NOTES.F3], melody: NOTES.Bb4 },
      { bass: NOTES.F2, chords: [NOTES.Bb3], melody: NOTES.F4, drum: 'wood' },
      { chords: [NOTES.D3], melody: NOTES.D5 },
      { bass: NOTES.C3, chords: [NOTES.E3], melody: NOTES.E5, drum: 'wood' },
      { chords: [NOTES.G3], melody: NOTES.C5 },
      { bass: NOTES.G2, chords: [NOTES.C4], melody: NOTES.G4, drum: 'wood' },
      { chords: [NOTES.E3], melody: NOTES.E5 },
      { bass: NOTES.F2, chords: [NOTES.A3], melody: NOTES.F5, drum: 'wood' },
      { chords: [NOTES.C3], melody: NOTES.A4 },
      { bass: NOTES.C3, chords: [NOTES.F3], melody: NOTES.C5, drum: 'wood' },
      { chords: [NOTES.F2], melody: NOTES.F4 }
    ]
  },

  // 5. 飛鼠公園 (清晨高山水滴微風與空靈風鈴 Water Droplets & Wind Chimes)
  park: {
    stepIntervalMs: 620,
    filterFreq: 2000,
    instrument: 'water_chime',
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

  // 6. 貓頭鷹診所 (身心療癒水晶豎琴與溫柔慢板 Crystal Harp Lullaby)
  clinic: {
    stepIntervalMs: 680,
    filterFreq: 1000,
    instrument: 'crystal_harp',
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

  // 7. 霧臺客運站 (公路旅行鄉村民謠木吉他掃弦 Folk Guitar Arpeggio)
  station: {
    stepIntervalMs: 440,
    filterFreq: 2100,
    instrument: 'folk_guitar',
    pattern: [
      { bass: NOTES.E2, chords: [NOTES.B2, NOTES.E3], melody: NOTES.E4 },
      { chords: [NOTES.Ab3], melody: NOTES.B4 },
      { bass: NOTES.B2, chords: [NOTES.E3], melody: NOTES.Ab4 },
      { chords: [NOTES.E3], melody: NOTES.E5 },
      { bass: NOTES.A2, chords: [NOTES.E3, NOTES.A3], melody: NOTES.Cs5 },
      { chords: [NOTES.A3], melody: NOTES.E4 },
      { bass: NOTES.E2, chords: [NOTES.A3], melody: NOTES.A4 },
      { chords: [NOTES.A2], melody: NOTES.Cs5 },
      { bass: NOTES.B2, chords: [NOTES.Fs3, NOTES.B3], melody: NOTES.Ds5 },
      { chords: [NOTES.B3], melody: NOTES.Fs4 },
      { bass: NOTES.Fs2, chords: [NOTES.B3], melody: NOTES.B4 },
      { chords: [NOTES.B2], melody: NOTES.Ds5 },
      { bass: NOTES.E2, chords: [NOTES.B2, NOTES.E3], melody: NOTES.E5 },
      { chords: [NOTES.Ab3], melody: NOTES.E4 },
      { bass: NOTES.B2, chords: [NOTES.E3], melody: NOTES.Ab4 },
      { chords: [NOTES.E2], melody: NOTES.E4 }
    ]
  },

  // 8. 百步蛇集會所 (原民古調五聲音階竹笛與大地木鼓心跳 Tribal Flute & Wood Drum)
  plaza: {
    stepIntervalMs: 520,
    filterFreq: 1600,
    instrument: 'tribal_flute',
    pattern: [
      { bass: NOTES.D2, chords: [NOTES.A2], melody: NOTES.D4, drum: 'kick' },
      { chords: [NOTES.F3], melody: NOTES.A4, drum: 'wood' },
      { bass: NOTES.A2, chords: [NOTES.D3], melody: NOTES.F4 },
      { chords: [NOTES.D3], melody: NOTES.D5, drum: 'wood' },
      { bass: NOTES.G2, chords: [NOTES.D3], melody: NOTES.G4, drum: 'kick' },
      { chords: [NOTES.Bb3], melody: NOTES.D5, drum: 'wood' },
      { bass: NOTES.D2, chords: [NOTES.G3], melody: NOTES.C5 },
      { chords: [NOTES.G2], melody: NOTES.A4, drum: 'wood' },
      { bass: NOTES.C2, chords: [NOTES.G2], melody: NOTES.C5, drum: 'kick' },
      { chords: [NOTES.E3], melody: NOTES.G4, drum: 'wood' },
      { bass: NOTES.G2, chords: [NOTES.C3], melody: NOTES.E4 },
      { chords: [NOTES.C3], melody: NOTES.G4, drum: 'wood' },
      { bass: NOTES.D2, chords: [NOTES.A2], melody: NOTES.A4, drum: 'kick' },
      { chords: [NOTES.F3], melody: NOTES.D4, drum: 'wood' },
      { bass: NOTES.A2, chords: [NOTES.D3], melody: NOTES.F4 },
      { chords: [NOTES.D2], melody: NOTES.D4, drum: 'wood' }
    ]
  },

  // 9. 山豬影城 (復古微醺爵士薩克斯風與行走低音 Vintage Swing Sax & Walking Bass)
  cinema: {
    stepIntervalMs: 560,
    filterFreq: 650,
    instrument: 'jazz_sax',
    pattern: [
      { bass: NOTES.Bb2, chords: [NOTES.D3, NOTES.F3], melody: NOTES.F4 },
      { chords: [NOTES.D3], melody: NOTES.Bb4 },
      { bass: NOTES.D2, chords: [NOTES.F3], melody: NOTES.D4 },
      { chords: [NOTES.Bb2], melody: NOTES.F5 },
      { bass: NOTES.G2, chords: [NOTES.Bb2, NOTES.D3], melody: NOTES.D4 },
      { chords: [NOTES.Bb2], melody: NOTES.G4 },
      { bass: NOTES.Bb2, chords: [NOTES.D3], melody: NOTES.Bb4 },
      { chords: [NOTES.G2], melody: NOTES.D5 },
      { bass: NOTES.C3, chords: [NOTES.Eb3, NOTES.G3], melody: NOTES.G4 },
      { chords: [NOTES.Eb3], melody: NOTES.C5 },
      { bass: NOTES.Eb2, chords: [NOTES.G3], melody: NOTES.Eb4 },
      { chords: [NOTES.C3], melody: NOTES.G5 },
      { bass: NOTES.F2, chords: [NOTES.A2, NOTES.C3], melody: NOTES.F4 },
      { chords: [NOTES.C3], melody: NOTES.A4 },
      { bass: NOTES.A2, chords: [NOTES.C3], melody: NOTES.F4 },
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

    // 首次使用者點擊/按鍵時強制解鎖音訊上下文，並啟動待播場景背景音
    if (typeof window !== 'undefined' && !this._unlocked) {
      const unlock = () => {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().then(() => {
            this._unlocked = true;
            if (this.sceneBgmRunning && this.currentSceneId) {
              const current = this.currentSceneId;
              this.sceneBgmRunning = false;
              this.startSceneBgm(current);
            }
          }).catch(() => {});
        } else {
          this._unlocked = true;
        }
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
        window.removeEventListener('click', unlock);
      };
      window.addEventListener('pointerdown', unlock, { once: true });
      window.addEventListener('keydown', unlock, { once: true });
      window.addEventListener('click', unlock, { once: true });
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
  // 點擊按鈕反饋
  click() {
    this.playTone(400, 'triangle', 0.04, 0.08);
  }

  // 魔法靈感卡 2160 度急速陀螺旋轉音效 (急速升頻旋轉呼嘯)
  spinCard() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // 模擬陀螺風嘯與星辰微粒旋轉音
      const count = 16;
      for (let i = 0; i < count; i++) {
        const offset = Math.pow(i / count, 1.35) * 1.5;
        const freq = 320 + i * 55;
        const vol = 0.08 + (i / count) * 0.12;
        setTimeout(() => {
          this.playTone(freq, 'sine', 0.07, vol);
        }, offset * 1000);
      }
    } catch (e) {}
  }

  // 實體卡牌釘在榮譽告示板上的清脆木質圖釘聲
  pinCard() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      // 仿木質圖釘下壓反饋音 (低沉木塊擊打 + 亮微金屬反饋)
      this.playTone(260, 'triangle', 0.035, 0.28);
      setTimeout(() => this.playTone(840, 'sine', 0.06, 0.16), 25);
    } catch (e) {}
  }

  // ── 10 大場景專屬背景音樂啟動 (0 頻寬負擔，純演算法合成) ──
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
      // 溫柔淡入 0.6 秒 (0.36 音量)
      this.sceneBgmMasterGain.gain.exponentialRampToValueAtTime(0.36, now + 0.6);

      // 低通暖色濾波 (依場景設定)
      this.sceneBgmFilter = this.ctx.createBiquadFilter();
      this.sceneBgmFilter.type = 'lowpass';
      this.sceneBgmFilter.frequency.setValueAtTime(config.filterFreq || 1600, now);

      // 空間微延遲
      this.sceneBgmDelay = this.ctx.createDelay();
      this.sceneBgmDelay.delayTime.setValueAtTime(0.32, now);
      this.sceneBgmDelayGain = this.ctx.createGain();
      this.sceneBgmDelayGain.gain.setValueAtTime(0.22, now);

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
      const inst = config.instrument || 'musicbox';

      // 0. 特色節奏鼓點 (Drum Beat)
      if (beat.drum) {
        this.scheduleDrum(beat.drum, now);
      }

      // 1. 低音旋律 (Bass)
      if (beat.bass) {
        const bassWave = inst === 'jazz_sax' ? 'sawtooth' : (inst === 'marimba' || inst === 'harpsichord' ? 'square' : 'triangle');
        const bassDur = inst === 'marimba' ? 0.16 : (inst === 'harpsichord' ? 0.22 : 0.82);
        this.scheduleWarmTone(beat.bass, bassWave, now, bassDur, 0.20);
      }

      // 2. 和弦伴奏 (Chords)
      if (beat.chords && beat.chords.length > 0) {
        beat.chords.forEach(freq => {
          this.scheduleWarmTone(freq, inst === 'harpsichord' ? 'sawtooth' : 'sine', now + 0.02, 0.45, 0.08);
        });
      }

      // 3. 專屬主奏樂器音色合成 (Melody)
      if (beat.melody) {
        this.scheduleInstrumentNote(beat.melody, inst, now);
      }

      this.sceneBgmStep++;
      this.sceneBgmTimer = setTimeout(tick, stepIntervalMs);
    };

    tick();
  }

  // 程式化特色打擊樂音 (木塊擊打、低音踩鼓)
  scheduleDrum(type, startTime) {
    if (!this.ctx || !this.sceneBgmFilter) return;
    try {
      const now = this.ctx.currentTime;
      const start = Math.max(startTime, now + 0.005);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (type === 'wood') {
        // 清脆木塊木琴敲擊 (快速降頻三角波)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(750, start);
        osc.frequency.exponentialRampToValueAtTime(220, start + 0.03);
        gain.gain.setValueAtTime(0.16, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.035);
        osc.connect(gain);
        gain.connect(this.sceneBgmFilter);
        osc.start(start);
        osc.stop(start + 0.04);
      } else if (type === 'kick') {
        // 山林大地心跳鼓動 (柔和正弦低音)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(130, start);
        osc.frequency.exponentialRampToValueAtTime(45, start + 0.09);
        gain.gain.setValueAtTime(0.24, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.11);
        osc.connect(gain);
        gain.connect(this.sceneBgmFilter);
        osc.start(start);
        osc.stop(start + 0.12);
      }
    } catch (e) {}
  }

  // 各場景獨特樂器主旋律音色合成器
  scheduleInstrumentNote(freq, instrument, startTime) {
    if (!this.ctx || !this.sceneBgmFilter) return;
    try {
      const now = this.ctx.currentTime;
      const start = Math.max(startTime, now + 0.005);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      switch (instrument) {
        case 'marimba': // 黑熊超市：跳躍空心木琴 (快速木板敲擊衰減)
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.22, start + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.08);
          osc.connect(gain);
          gain.connect(this.sceneBgmFilter);
          osc.start(start);
          osc.stop(start + 0.09);
          break;

        case 'harpsichord': // 雲豹書局：巴洛克古典羽管鍵琴 (鋸齒波撥弦斷奏)
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.20, start + 0.004);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
          osc.connect(gain);
          gain.connect(this.sceneBgmFilter);
          osc.start(start);
          osc.stop(start + 0.19);
          break;

        case 'bells': // 霧臺國小：威斯敏斯特清晨鐘聲 (雙音和聲敲鐘泛音)
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.22, start + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.1);
          osc.connect(gain);
          gain.connect(this.sceneBgmFilter);
          osc.start(start);
          osc.stop(start + 1.15);

          // 泛音疊加 (2.756 倍高八度鐘聲共鳴)
          try {
            const bellHarmonic = this.ctx.createOscillator();
            const bellGain = this.ctx.createGain();
            bellHarmonic.type = 'sine';
            bellHarmonic.frequency.setValueAtTime(freq * 2.756, start);
            bellGain.gain.setValueAtTime(0.001, start);
            bellGain.gain.linearRampToValueAtTime(0.07, start + 0.01);
            bellGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.75);
            bellHarmonic.connect(bellGain);
            bellGain.connect(this.sceneBgmFilter);
            bellHarmonic.start(start);
            bellHarmonic.stop(start + 0.8);
          } catch (e) {}
          break;

        case 'water_chime': // 飛鼠公園：高山清泉水滴滑音與風鈴 (水滴清脆滑落音)
          osc.type = 'sine';
          // 頻率自高滑降至基音，模擬清澈水滴墜入山泉聲
          osc.frequency.setValueAtTime(freq * 1.14, start);
          osc.frequency.exponentialRampToValueAtTime(freq, start + 0.045);
          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.23, start + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.55);
          osc.connect(gain);
          gain.connect(this.sceneBgmFilter);
          osc.start(start);
          osc.stop(start + 0.6);
          break;

        case 'crystal_harp': // 貓頭鷹診所：療癒水晶豎琴 (緩慢柔和漸強、悠遠舒緩餘韻)
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.22, start + 0.06);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.45);
          osc.connect(gain);
          gain.connect(this.sceneBgmFilter);
          osc.start(start);
          osc.stop(start + 1.5);
          break;

        case 'folk_guitar': // 霧臺客運站：公路民謠吉他掃弦 (清脆三角波撥弦)
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.24, start + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.32);
          osc.connect(gain);
          gain.connect(this.sceneBgmFilter);
          osc.start(start);
          osc.stop(start + 0.35);
          break;

        case 'tribal_flute': // 百步蛇集會所：原民竹笛氣息長音
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.23, start + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.65);
          osc.connect(gain);
          gain.connect(this.sceneBgmFilter);
          osc.start(start);
          osc.stop(start + 0.7);
          break;

        case 'jazz_sax': // 山豬影城：復古微醺薩克斯風 (柔化鋸齒波長延音)
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.21, start + 0.035);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.52);
          osc.connect(gain);
          gain.connect(this.sceneBgmFilter);
          osc.start(start);
          osc.stop(start + 0.55);
          break;

        case 'brass_fanfare': // 霧臺小鎮全景：晨光登山號角進行曲
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.24, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.40);
          osc.connect(gain);
          gain.connect(this.sceneBgmFilter);
          osc.start(start);
          osc.stop(start + 0.42);
          break;

        case 'musicbox': // 學生溫馨房間：八音盒純淨晶瑩泛音
        default:
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.25, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.85);
          osc.connect(gain);
          gain.connect(this.sceneBgmFilter);
          osc.start(start);
          osc.stop(start + 0.9);
          break;
      }
    } catch (e) {}
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
        const gainToFade = this.sceneBgmMasterGain;
        this.sceneBgmMasterGain = null; // 立即清空成員變數，避免延遲的 disconnect 誤切斷下個場景的新節點！
        gainToFade.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
        setTimeout(() => {
          try {
            gainToFade.disconnect();
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

// ── 性別與腔調智慧語音選擇器 ──
const isExplicitMale = (v) => {
  const name = (v.name || '').toLowerCase();
  const femaleSignals = [
    'female', 'woman', 'girl', 'zira', 'jenny', 'samantha', 'aria', 'hazel', 
    'victoria', 'karen', 'linda', 'anna', 'michelle', 'ana', 'ava', 'emma', 
    'susan', 'heera', 'catherine', 'clara', 'natasha', 'sonia', 'neerja', 
    'stephanie', 'alice', 'julie', 'sarah', 'google us english', 'google uk english female'
  ];
  if (femaleSignals.some(f => name.includes(f))) return false;

  const maleSignals = [
    'male', 'david', 'guy', 'mark', 'christopher', 'eric', 'roger', 'steffan', 
    'alex', 'fred', 'daniel', 'george', 'oliver', 'tom', 'aaron', 'bruce', 
    'richard', 'ryan', 'james', 'john', 'paul', 'william', 'charles', 'google uk english male'
  ];
  return maleSignals.some(m => name.includes(m));
};

const isExplicitFemale = (v) => {
  const name = (v.name || '').toLowerCase();
  const maleSignals = [
    'david', 'guy', 'mark', 'christopher', 'eric', 'roger', 'steffan', 
    'alex', 'fred', 'daniel', 'george', 'oliver', 'tom', 'aaron', 'bruce', 
    'richard', 'ryan', 'google uk english male'
  ];
  if (maleSignals.some(m => name.includes(m)) && !name.includes('female')) return false;

  const femaleSignals = [
    'female', 'woman', 'girl', 'zira', 'jenny', 'samantha', 'aria', 'hazel', 
    'victoria', 'karen', 'linda', 'anna', 'michelle', 'ana', 'ava', 'emma', 
    'susan', 'heera', 'catherine', 'clara', 'natasha', 'sonia', 'neerja', 
    'stephanie', 'alice', 'julie', 'sarah', 'google us english', 'google uk english female'
  ];
  return femaleSignals.some(f => name.includes(f));
};

const findBestVoice = (gender = 'male', preferredLang = 'en-US', accent = 'en-US') => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  let voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    loadVoices();
    voices = cachedVoices;
  }
  if (!voices || voices.length === 0) return null;

  const englishVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
  if (englishVoices.length === 0) return voices[0] || null;

  // 1. 若角色指定英國腔 (例如校長 Principal Hawk)
  if (accent === 'en-GB') {
    const gbVoices = englishVoices.filter(v => 
      v.lang.toLowerCase().includes('gb') || 
      v.name.toLowerCase().includes('uk') || 
      v.name.toLowerCase().includes('british')
    );
    if (gender === 'male') {
      const gbMale = gbVoices.find(isExplicitMale) || englishVoices.find(v => isExplicitMale(v) && v.name.toLowerCase().includes('uk'));
      if (gbMale) return gbMale;
      const anyMale = englishVoices.find(isExplicitMale);
      if (anyMale) return anyMale;
    } else {
      const gbFemale = gbVoices.find(isExplicitFemale);
      if (gbFemale) return gbFemale;
    }
  }

  // 2. 男性角色 (gender === 'male')：嚴格確保性別一致，絕不 fallback 到女性聲音
  if (gender === 'male') {
    // 優先 A：美語原生男聲 (US Male: David, Guy, Christopher, Mark, Eric, Alex, etc.)
    const usMale = englishVoices.find(v => {
      const isUS = v.lang.toLowerCase().includes('us') || v.name.toLowerCase().includes('united states') || v.name.toLowerCase().includes('us english');
      return isUS && isExplicitMale(v);
    });
    if (usMale) return usMale;

    // 優先 B：任何英語男聲 (絕不讓男性角色被 Chrome 預設指派為 Google US English 女聲！例如 Google UK English Male, Daniel 等)
    const anyEnglishMale = englishVoices.find(isExplicitMale);
    if (anyEnglishMale) return anyEnglishMale;

    // 優先 C：排除明確為女聲的聲音
    const nonFemale = englishVoices.find(v => !isExplicitFemale(v));
    if (nonFemale) return nonFemale;

    // 若系統完全無男聲安裝，返回 null，由 speakEnglish 強制壓低 pitch 調頻為男低音
    return null;
  }

  // 3. 女性角色 (gender === 'female')
  if (gender === 'female') {
    // 優先 A：美語女聲 (US Female: Samantha, Jenny, Zira, Aria, Google US English 等)
    const usFemale = englishVoices.find(v => {
      const isUS = v.lang.toLowerCase().includes('us') || v.name.toLowerCase().includes('united states') || v.name.toLowerCase().includes('us english');
      return isUS && isExplicitFemale(v);
    });
    if (usFemale) return usFemale;

    // 優先 B：任何英語女聲
    const anyEnglishFemale = englishVoices.find(isExplicitFemale);
    if (anyEnglishFemale) return anyEnglishFemale;

    return englishVoices[0];
  }

  return englishVoices[0];
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

// ── 英文單字與對話樹語音播放 (TTS - 支援人物專屬音色、音調與性別保護) ──
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

    const gender = options.gender || 'male';
    const accent = options.accent || 'en-US';

    // 2. 匹配男女專屬音色與腔調 (Voice & Accent)
    const voice = findBestVoice(gender, lang, accent);
    if (voice) {
      utterance.voice = voice;
    }

    // 3. 角色聲線深度差異化與性別保護 (Pitch & Rate Modulation)
    // 預設男性低厚穩重，女性柔和明亮
    let pitch = typeof options.pitch === 'number' ? options.pitch : (gender === 'male' ? 0.78 : 1.10);
    if (gender === 'male') {
      // 若系統沒有原生男聲而回退到女聲或 null，強制調低 pitch (0.60 ~ 0.70) 轉為渾厚男低音
      if (!voice || isExplicitFemale(voice)) {
        pitch = Math.min(pitch, 0.68);
      }
    } else if (gender === 'female') {
      // 女性角色確保音調柔和清脆 (1.05 ~ 1.25)
      pitch = Math.max(pitch, 1.05);
    }

    utterance.pitch = pitch;
    utterance.rate = typeof options.rate === 'number' ? options.rate : 0.88;

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    // Safe caught
  }
};
