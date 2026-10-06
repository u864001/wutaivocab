// ── 密室逃脫專屬：純 Web Audio 懸疑探險／星際奇幻合成音樂引擎 ──
// 零頻寬消耗、零外加音檔、純瀏覽器原生振盪器與濾波器生成電影級環境音

class EscapeAudioEngine {
  constructor() {
    this.ctx = null;
    this.currentTrack = null;
    this.isMuted = false;
    this.nodes = [];
    this.intervalId = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  stopCurrentMusic() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.nodes.forEach(n => {
      try {
        if (n.stop) n.stop();
        if (n.disconnect) n.disconnect();
      } catch (e) {}
    });
    this.nodes = [];
    this.currentTrack = null;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopCurrentMusic();
    }
    return this.isMuted;
  }

  /**
   * 播放房間專屬環境音 (temple | library | observatory)
   */
  playRoomBgm(themeId = 'temple') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.currentTrack === themeId) return;

    this.stopCurrentMusic();
    this.currentTrack = themeId;

    try {
      if (themeId === 'temple') {
        this.startTempleAmbience();
      } else if (themeId === 'library') {
        this.startLibraryAmbience();
      } else if (themeId === 'observatory') {
        this.startObservatoryAmbience();
      }
    } catch (e) {
      console.warn('密室環境音播放異常:', e);
    }
  }

  // 1. 神廟密室：深邃地宮低頻無人機聲 (Deep Subterranean Drone) + 遠古頌缽微光
  startTempleAmbience() {
    const ctx = this.ctx;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
    masterGain.connect(ctx.destination);
    this.nodes.push(masterGain);

    // 低頻共鳴嗡鳴 (55Hz A1 + 82.5Hz E2)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, ctx.currentTime);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(82.41, ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(masterGain);

    osc1.start();
    osc2.start();
    this.nodes.push(osc1, osc2, filter);

    // 週期性神秘遠古青銅石柱共鳴 (每 6 秒一次飄渺和弦音)
    const chimeFrequencies = [220, 277.18, 329.63, 440];
    this.intervalId = setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      try {
        const chimeOsc = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        const freq = chimeFrequencies[Math.floor(Math.random() * chimeFrequencies.length)];

        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(freq, ctx.currentTime);

        chimeGain.gain.setValueAtTime(0.04, ctx.currentTime);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(ctx.destination);

        chimeOsc.start();
        chimeOsc.stop(ctx.currentTime + 3.5);
      } catch (e) {}
    }, 5500);
  }

  // 2. 魔法圖書館：神秘書卷古音、微光漂浮琶音與溫暖壁爐和弦 (Arcane Library Chord Swells)
  startLibraryAmbience() {
    const ctx = this.ctx;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.07, ctx.currentTime);
    masterGain.connect(ctx.destination);
    this.nodes.push(masterGain);

    // 柔和溫暖中頻旋律襯底 (D小調溫暖音色)
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(146.83, ctx.currentTime); // D3

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(260, ctx.currentTime);
    filter.Q.setValueAtTime(2.0, ctx.currentTime);

    osc.connect(filter);
    filter.connect(masterGain);
    osc.start();
    this.nodes.push(osc, filter);

    // 每 4 秒隨機撥動漂浮魔法豎琴泛音
    const harpNotes = [293.66, 349.23, 440.00, 523.25, 587.33]; // D, F, A, C, D
    this.intervalId = setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      try {
        const noteOsc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        const f = harpNotes[Math.floor(Math.random() * harpNotes.length)];

        noteOsc.type = 'sine';
        noteOsc.frequency.setValueAtTime(f, ctx.currentTime);

        noteGain.gain.setValueAtTime(0.05, ctx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.8);

        noteOsc.connect(noteGain);
        noteGain.connect(ctx.destination);

        noteOsc.start();
        noteOsc.stop(ctx.currentTime + 2.8);
      } catch (e) {}
    }, 4200);
  }

  // 3. 星象鐘樓：浩瀚星河太空脈衝、天體運轉齒輪與超自然水晶回音 (Cosmic Sanctuary Pad)
  startObservatoryAmbience() {
    const ctx = this.ctx;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.09, ctx.currentTime);
    masterGain.connect(ctx.destination);
    this.nodes.push(masterGain);

    // 浩瀚深邃太空雙振盪器 (E1 + B1 立體泛音)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(82.41, ctx.currentTime); // E2
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(123.47, ctx.currentTime); // B2

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(masterGain);

    osc1.start();
    osc2.start();
    this.nodes.push(osc1, osc2, filter);

    // 每 3.2 秒一次璀璨星座星塵閃爍 (High Crystal Shimmer)
    const starFrequencies = [659.25, 830.61, 987.77, 1318.51]; // E5, G#5, B5, E6
    this.intervalId = setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      try {
        const starOsc = ctx.createOscillator();
        const starGain = ctx.createGain();
        const freq = starFrequencies[Math.floor(Math.random() * starFrequencies.length)];

        starOsc.type = 'triangle';
        starOsc.frequency.setValueAtTime(freq, ctx.currentTime);

        starGain.gain.setValueAtTime(0.045, ctx.currentTime);
        starGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.4);

        starOsc.connect(starGain);
        starGain.connect(ctx.destination);

        starOsc.start();
        starOsc.stop(ctx.currentTime + 2.4);
      } catch (e) {}
    }, 3200);
  }

  // 播放重型石門緩緩升起開啟音效
  playDoorUnlockSound() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(45, this.ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 1.2);
    } catch (e) {}
  }
}

export const escapeAudio = new EscapeAudioEngine();

/**
 * 低沉神秘外師語音朗讀 (Deep Mysterious Narrator TTS)
 */
export const speakMysteriousEnglish = (text) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.pitch = 0.72; // 低沉神秘
    utterance.rate = 0.82;  // 慢速懸疑

    const voices = window.speechSynthesis.getVoices() || [];
    // 優先選取深沉有磁性的英式或美式男聲
    const preferred = voices.find(v =>
      v.name.includes('George') ||
      v.name.includes('Daniel') ||
      v.name.includes('Oliver') ||
      v.name.includes('David') ||
      v.name.includes('Guy') ||
      (v.lang.startsWith('en') && v.name.toLowerCase().includes('male'))
    );
    if (preferred) {
      utterance.voice = preferred;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('TTS Error:', e);
  }
};

