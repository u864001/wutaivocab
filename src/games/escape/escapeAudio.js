// ── 密室逃脫專屬：純 Web Audio 懸疑探險／星際奇幻合成音樂引擎 ＆ 10大美英雙語外師語音 ──
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
      const tid = String(themeId);
      if (tid === 'temple' || tid.startsWith('dungeon_1') || tid.startsWith('tomb_1')) {
        this.startTempleAmbience();
      } else if (tid === 'library' || tid.startsWith('dungeon_2') || tid.startsWith('tomb_2') || tid.startsWith('asylum_1') || tid.startsWith('asylum_2')) {
        this.startLibraryAmbience();
      } else if (tid === 'observatory' || tid.startsWith('dungeon_3') || tid.startsWith('tomb_3') || tid.startsWith('asylum_3')) {
        this.startObservatoryAmbience();
      } else {
        this.startTempleAmbience();
      }
    } catch (e) {
      console.warn('密室環境音播放異常:', e);
    }
  }

  // 1. 第一室 神廟密室：遠古石窟空靈共鳴 (D3 146Hz ~ D4 293Hz 溫暖厚實) + 青銅頌缽古磬音
  startTempleAmbience() {
    const ctx = this.ctx;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.14, ctx.currentTime);
    masterGain.connect(ctx.destination);
    this.nodes.push(masterGain);

    // 溫暖厚實的遠古石室中低頻襯底 (D3 146.83Hz + A3 220Hz + D4 293.66Hz)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(146.83, ctx.currentTime); // D3
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(220.00, ctx.currentTime); // A3
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(293.66, ctx.currentTime); // D4

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(480, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(masterGain);

    osc1.start();
    osc2.start();
    osc3.start();
    this.nodes.push(osc1, osc2, osc3, filter);

    // 週期性遠古青銅石鐘／空靈頌缽古磬音 (每 2.8 秒隨機敲響一記)
    const templeChimes = [293.66, 349.23, 392.00, 440.00, 523.25, 587.33]; // D小調五聲
    this.intervalId = setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      try {
        const chimeOsc = ctx.createOscillator();
        const chimeHarmonic = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        const f = templeChimes[Math.floor(Math.random() * templeChimes.length)];

        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(f, ctx.currentTime);

        chimeHarmonic.type = 'triangle';
        chimeHarmonic.frequency.setValueAtTime(f * 2, ctx.currentTime);

        chimeGain.gain.setValueAtTime(0.11, ctx.currentTime);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.2);

        chimeOsc.connect(chimeGain);
        chimeHarmonic.connect(chimeGain);
        chimeGain.connect(ctx.destination);

        chimeOsc.start();
        chimeHarmonic.start();
        chimeOsc.stop(ctx.currentTime + 3.2);
        chimeHarmonic.stop(ctx.currentTime + 3.2);
      } catch (e) {}
    }, 2800);
  }

  // 2. 第二室 魔法圖書館：奇幻典籍和弦呼吸 (F大調 174~440Hz 柔和明亮) + 漂浮魔法豎琴琶音
  startLibraryAmbience() {
    const ctx = this.ctx;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.13, ctx.currentTime);
    masterGain.connect(ctx.destination);
    this.nodes.push(masterGain);

    // 奇幻典籍溫暖和弦 (F3 174.61Hz + C4 261.63Hz + A4 440Hz)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(174.61, ctx.currentTime); // F3
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(261.63, ctx.currentTime); // C4

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, ctx.currentTime);
    filter.Q.setValueAtTime(1.0, ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(masterGain);

    osc1.start();
    osc2.start();
    this.nodes.push(osc1, osc2, filter);

    // 每 2.4 秒隨機撥動漂浮魔法豎琴與水晶大鍵琴音 (F, A, C, E, F, A)
    const harpNotes = [349.23, 440.00, 523.25, 659.25, 698.46, 880.00];
    this.intervalId = setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      try {
        const noteOsc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        const f = harpNotes[Math.floor(Math.random() * harpNotes.length)];

        noteOsc.type = 'sine';
        noteOsc.frequency.setValueAtTime(f, ctx.currentTime);

        noteGain.gain.setValueAtTime(0.10, ctx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

        noteOsc.connect(noteGain);
        noteGain.connect(ctx.destination);

        noteOsc.start();
        noteOsc.stop(ctx.currentTime + 2.5);
      } catch (e) {}
    }, 2400);
  }

  // 3. 第三室 星象鐘樓：浩瀚星河太空脈衝 + 璀璨水晶星核閃爍 (維持清晰並微調平衡)
  startObservatoryAmbience() {
    const ctx = this.ctx;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.14, ctx.currentTime);
    masterGain.connect(ctx.destination);
    this.nodes.push(masterGain);

    // 浩瀚深邃太空雙振盪器 (E2 82.41Hz + B2 123.47Hz + E3 164.81Hz)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(82.41, ctx.currentTime); // E2
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(123.47, ctx.currentTime); // B2

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(masterGain);

    osc1.start();
    osc2.start();
    this.nodes.push(osc1, osc2, filter);

    // 每 2.8 秒一次璀璨星座星塵閃爍 (High Crystal Shimmer: E5, G#5, B5, E6)
    const starFrequencies = [659.25, 830.61, 987.77, 1318.51];
    this.intervalId = setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      try {
        const starOsc = ctx.createOscillator();
        const starGain = ctx.createGain();
        const freq = starFrequencies[Math.floor(Math.random() * starFrequencies.length)];

        starOsc.type = 'triangle';
        starOsc.frequency.setValueAtTime(freq, ctx.currentTime);

        starGain.gain.setValueAtTime(0.09, ctx.currentTime);
        starGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.4);

        starOsc.connect(starGain);
        starGain.connect(ctx.destination);

        starOsc.start();
        starOsc.stop(ctx.currentTime + 2.4);
      } catch (e) {}
    }, 2800);
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

// ── 10大神秘外師語音人格 (8種美語腔調 en-US + 2種英語腔調 en-GB，7男聲 3女聲) ──
export const ESCAPE_VOICE_PERSONAS = [
  // 1. 美語男聲 1：探險隊長 (威嚴沉穩、帶領探險隊)
  {
    id: 'us_male_captain',
    nameZh: '美式探險隊長',
    lang: 'en-US',
    gender: 'male',
    preferredNames: ['David', 'Microsoft David', 'Guy', 'Microsoft Guy', 'Alex'],
    pitch: 0.76,
    rate: 0.85
  },
  // 2. 美語男聲 2：古代學者 (深邃冷靜、考古學家)
  {
    id: 'us_male_scholar',
    nameZh: '美式考古學者',
    lang: 'en-US',
    gender: 'male',
    preferredNames: ['Christopher', 'Microsoft Christopher', 'Mark', 'Microsoft Mark'],
    pitch: 0.82,
    rate: 0.84
  },
  // 3. 美語男聲 3：地宮守護者 (渾厚重低音、神秘長老)
  {
    id: 'us_male_guardian',
    nameZh: '美式地宮長老',
    lang: 'en-US',
    gender: 'male',
    preferredNames: ['Nathan', 'Microsoft Nathan', 'Eric', 'Microsoft Eric'],
    pitch: 0.70,
    rate: 0.80
  },
  // 4. 美語男聲 4：荒野拓荒者 (粗獷俐落、歷經滄桑)
  {
    id: 'us_male_pioneer',
    nameZh: '美式拓荒者',
    lang: 'en-US',
    gender: 'male',
    preferredNames: ['Roger', 'Microsoft Roger', 'Fred', 'Microsoft Steffan'],
    pitch: 0.74,
    rate: 0.88
  },
  // 5. 美語男聲 5：廣播導引官 (清晰磁性、美式標準播音)
  {
    id: 'us_male_guide',
    nameZh: '美式磁性導讀官',
    lang: 'en-US',
    gender: 'male',
    preferredNames: ['Google US English', 'Guy', 'Alex', 'David'],
    pitch: 0.84,
    rate: 0.86
  },
  // 6. 美語男聲 6：青年探索家 (敏捷機警、好奇充滿活力)
  {
    id: 'us_male_explorer',
    nameZh: '美式青年探索者',
    lang: 'en-US',
    gender: 'male',
    preferredNames: ['Steffan', 'Christopher', 'David', 'Alex'],
    pitch: 0.88,
    rate: 0.88
  },
  // 7. 美語女聲 1：秘境女法師 (冷靜睿智、優雅清晰)
  {
    id: 'us_female_mage',
    nameZh: '美式秘境女法師',
    lang: 'en-US',
    gender: 'female',
    preferredNames: ['Jenny', 'Microsoft Jenny', 'Aria', 'Samantha'],
    pitch: 0.92,
    rate: 0.86
  },
  // 8. 美語女聲 2：遠古女先知 (空靈低語、洞察古今)
  {
    id: 'us_female_oracle',
    nameZh: '美式遠古女先知',
    lang: 'en-US',
    gender: 'female',
    preferredNames: ['Zira', 'Microsoft Zira', 'Ava', 'Google US English'],
    pitch: 0.86,
    rate: 0.82
  },
  // 9. 英語男聲 1：皇家博物館長 (典雅英國紳士男音)
  {
    id: 'uk_male_curator',
    nameZh: '英式皇家館長',
    lang: 'en-GB',
    gender: 'male',
    preferredNames: ['George', 'Microsoft George', 'Oliver', 'Daniel', 'Arthur', 'Google UK English Male'],
    pitch: 0.78,
    rate: 0.82
  },
  // 10. 英語女聲 1：古卷典籍守護人 (古典英倫女音)
  {
    id: 'uk_female_librarian',
    nameZh: '英式典籍守護者',
    lang: 'en-GB',
    gender: 'female',
    preferredNames: ['Susan', 'Microsoft Susan', 'Hazel', 'Serena', 'Google UK English Female', 'Kate'],
    pitch: 0.90,
    rate: 0.85
  }
];

/**
 * 密室外師神秘語音播報：隨機使用 8 種美語腔調與 2 種英語腔調 (7男聲 3女聲)
 */
export const speakMysteriousEnglish = (text) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // 隨機抽選 10 大外師人格 (80% 美語 en-US，20% 英語 en-GB；70% 男聲，30% 女聲)
    const persona = ESCAPE_VOICE_PERSONAS[Math.floor(Math.random() * ESCAPE_VOICE_PERSONAS.length)];

    utterance.lang = persona.lang;
    utterance.pitch = persona.pitch;
    utterance.rate = persona.rate;

    const allVoices = window.speechSynthesis.getVoices() || [];
    if (allVoices.length > 0) {
      let matchedVoice = null;

      // 1. 優先嘗試喜好名稱精確匹配
      for (const prefName of persona.preferredNames) {
        matchedVoice = allVoices.find(v => v.name.toLowerCase().includes(prefName.toLowerCase()));
        if (matchedVoice) break;
      }

      // 2. 次優嘗試依語系與性別線索匹配
      if (!matchedVoice) {
        const langVoices = allVoices.filter(v => v.lang.startsWith(persona.lang));
        if (langVoices.length > 0) {
          if (persona.gender === 'female') {
            matchedVoice = langVoices.find(v => {
              const n = v.name.toLowerCase();
              return n.includes('female') || n.includes('woman') || n.includes('jenny') || n.includes('zira') || n.includes('aria') || n.includes('samantha') || n.includes('susan') || n.includes('hazel');
            }) || langVoices[0];
          } else {
            matchedVoice = langVoices.find(v => {
              const n = v.name.toLowerCase();
              return n.includes('male') || n.includes('david') || n.includes('guy') || n.includes('mark') || n.includes('george') || n.includes('alex') || n.includes('daniel') || n.includes('christopher');
            }) || langVoices[0];
          }
        }
      }

      // 3. 若找不到特定語系，退回美語或任何英文語音
      if (!matchedVoice) {
        matchedVoice = allVoices.find(v => v.lang.startsWith('en-US')) ||
                       allVoices.find(v => v.lang.startsWith('en'));
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang || persona.lang;
      }
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('TTS Error:', e);
  }
};
