// ── Web Audio 純程式碼合成地鼠專屬歡樂背景音樂引擎 ──
// 0 KB 外部資源下載、零流量、無版權疑慮、動態 BPM 節奏控制與狂暴期加速

class MoleBgmEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.tempo = 118; // 正常 BPM
    this.step = 0;
    this.timer = null;
    this.masterGain = null;

    // 森林地鼠輕快節奏旋律譜 (F Major / D minor 自然歡樂曲風)
    // 每個元素: [主音高 Hz, 貝斯音 Hz, 節奏型態]
    this.melody = [
      // 第一小節 (F - A - C - F)
      { lead: 349.23, bass: 174.61, type: 'lead' },  // F4, F3
      { lead: 440.00, bass: 0,      type: 'tick' },  // A4
      { lead: 523.25, bass: 174.61, type: 'bass' },  // C5
      { lead: 698.46, bass: 0,      type: 'lead' },  // F5

      // 第二小節 (Bb - D - F - D)
      { lead: 466.16, bass: 233.08, type: 'lead' },  // Bb4, Bb3
      { lead: 587.33, bass: 0,      type: 'tick' },  // D5
      { lead: 698.46, bass: 233.08, type: 'bass' },  // F5
      { lead: 587.33, bass: 0,      type: 'lead' },  // D5

      // 第三小節 (C - E - G - Bb)
      { lead: 523.25, bass: 130.81, type: 'lead' },  // C5, C3
      { lead: 659.25, bass: 0,      type: 'tick' },  // E5
      { lead: 783.99, bass: 130.81, type: 'bass' },  // G5
      { lead: 932.33, bass: 0,      type: 'lead' },  // Bb5

      // 第四小節 (A - F - C - F 回合停頓)
      { lead: 880.00, bass: 174.61, type: 'lead' },  // A5, F3
      { lead: 698.46, bass: 0,      type: 'lead' },  // F5
      { lead: 523.25, bass: 174.61, type: 'bass' },  // C5
      { lead: 349.23, bass: 0,      type: 'tick' },  // F4
    ];
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime); // 舒適輕快背景音量
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playNote(freq, type = 'sine', duration = 0.12, vol = 0.08) {
    if (!this.ctx || this.isMuted || freq <= 0) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  // 輕巧節奏打擊（Woodblock / Hi-hat 模擬森林自然打擊聲）
  playPercussion(isAccent = false) {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isAccent ? 800 : 540, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(isAccent ? 0.04 : 0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  tick() {
    if (!this.isPlaying) return;

    const currentNote = this.melody[this.step % this.melody.length];

    // 播放主旋律 (可愛俏皮的木琴/鐘琴三角波)
    if (currentNote.lead) {
      this.playNote(currentNote.lead, 'triangle', 0.14, 0.07);
    }

    // 播放低音貝斯 (沉穩彈跳的正弦低音)
    if (currentNote.bass) {
      this.playNote(currentNote.bass, 'sine', 0.20, 0.09);
    }

    // 伴隨打擊敲擊聲 (加強律動)
    this.playPercussion(this.step % 4 === 0);

    this.step++;

    // 依當前 tempo 排定下一個 16 分音符拍點
    const intervalMs = (60 / this.tempo) * 250; // 16分音符拍距
    this.timer = setTimeout(() => this.tick(), intervalMs);
  }

  start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.step = 0;
    this.tempo = 118;
    this.tick();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  setBerserk(isBerserk) {
    if (isBerserk) {
      this.tempo = 156; // 狂暴期急速激勵節奏
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(0.11, this.ctx.currentTime);
      }
    } else {
      this.tempo = 118; // 正常歡樂節奏
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      }
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

export const moleBgm = new MoleBgmEngine();
