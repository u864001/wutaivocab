// ── Web Audio 音效合成、吉卜力原聲 BGM 平滑播放器與多角色美語語音指紋引擎 ──

// ============================================================================
// 一、 多角色美語語音指紋管理器 (Voice Persona Registry & Voice Fallback Chain)
// ============================================================================

export const PERSONAS = {
  // 1. 客座外師 Mario (熱情陽光美式男外師，高頻動感、節奏明快)
  mario: {
    id: 'mario',
    nameZh: '客座外師 Mario',
    preferredVoices: ['Guy', 'Microsoft Guy', 'Christopher', 'Nathan', 'Alex', 'David', 'Google US English'],
    lang: 'en-US',
    gender: 'male',
    pitch: 1.05,
    rate: 1.05
  },

  // 2. 客座外師 Ibu (加州陽光親切美式女外師，柔和親切、溫暖易懂)
  ibu: {
    id: 'ibu',
    nameZh: '客座外師 Ibu',
    preferredVoices: ['Jenny', 'Microsoft Jenny', 'Aria', 'Samantha', 'Zira', 'Google US English'],
    lang: 'en-US',
    gender: 'female',
    pitch: 1.08,
    rate: 0.94
  },

  // 3. 霧臺國小 老校長 Principal Hawk (智慧威嚴典雅的英國紳士)
  school: {
    id: 'school',
    nameZh: '老校長 Principal Hawk',
    preferredVoices: ['George', 'Oliver', 'Daniel', 'Google UK English Male', 'en-GB'],
    lang: 'en-GB',
    gender: 'male',
    pitch: 0.80,
    rate: 0.82,
    accent: 'en-GB'
  },

  // 4. 黑熊超市 黑熊店員 Clerk Bear (渾厚低沉壯碩的大黑熊，語調沉著踏實)
  supermarket: {
    id: 'supermarket',
    nameZh: '黑熊店員 Clerk Bear',
    preferredVoices: ['Eric', 'Microsoft Eric', 'David', 'Microsoft David', 'Google UK English Male'],
    lang: 'en-US',
    gender: 'male',
    pitch: 0.62,
    rate: 0.78
  },

  // 5. 山豬影城 野豬售票員 Clerk Boar (粗獷豪爽熱情的野豬，帶叫賣穿透力)
  cinema: {
    id: 'cinema',
    nameZh: '野豬售票員 Clerk Boar',
    preferredVoices: ['Roger', 'Microsoft Roger', 'Steffan', 'David', 'Alex'],
    lang: 'en-US',
    gender: 'male',
    pitch: 0.70,
    rate: 0.95
  },

  // 6. 霧臺客運站 雄鷹站長 Station Master Eagle (俐落威嚴自信的軍旅出發感)
  station: {
    id: 'station',
    nameZh: '雄鷹站長 Station Master Eagle',
    preferredVoices: ['Mark', 'Microsoft Mark', 'Christopher', 'Microsoft David'],
    lang: 'en-US',
    gender: 'male',
    pitch: 0.85,
    rate: 0.90
  },

  // 7. 貓頭鷹診所 貓頭鷹醫師 Dr. Owl (溫和理性撫慰安心的男醫師，慢條斯理)
  clinic: {
    id: 'clinic',
    nameZh: '貓頭鷹醫師 Dr. Owl',
    preferredVoices: ['Arthur', 'Daniel', 'David', 'Google US English'],
    lang: 'en-US',
    gender: 'male',
    pitch: 0.78,
    rate: 0.82
  },

  // 8. 雲豹書局 雲豹店長 Manager Leopard (熱情儒雅書卷氣的青年店長，清晰溫和)
  bookstore: {
    id: 'bookstore',
    nameZh: '雲豹店長 Manager Leopard',
    preferredVoices: ['Nathan', 'Christopher', 'David', 'Alex'],
    lang: 'en-US',
    gender: 'male',
    pitch: 0.96,
    rate: 0.94
  },

  // 9. 飛鼠公園 飛鼠長老 Elder Squirrel (靈巧敏捷快嘴的飛鼠老爺爺，輕快活潑)
  park: {
    id: 'park',
    nameZh: '飛鼠長老 Elder Squirrel',
    preferredVoices: ['Alex', 'Guy', 'David'],
    lang: 'en-US',
    gender: 'male',
    pitch: 1.15,
    rate: 0.98
  },

  // 10. 百步蛇集會所 百合設計師 Stylist Lily (優雅甜美婉約的部落女設計師)
  plaza: {
    id: 'plaza',
    nameZh: '百合設計師 Stylist Lily',
    preferredVoices: ['Zira', 'Victoria', 'Karen', 'Samantha', 'Google US English'],
    lang: 'en-US',
    gender: 'female',
    pitch: 1.18,
    rate: 0.86
  },

  // 11. 學生/孩童發音 (單字庫練習、每日靈感卡)
  student: {
    id: 'student',
    nameZh: '好學生',
    preferredVoices: ['Google US English', 'Samantha', 'Jenny', 'Aria'],
    lang: 'en-US',
    gender: 'female',
    pitch: 1.10,
    rate: 0.92
  }
};

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

class VoiceManager {
  constructor() {
    this.voices = [];
    this.isReady = false;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => this.initVoices();
    }
  }

  initVoices() {
    try {
      this.voices = window.speechSynthesis.getVoices() || [];
      if (this.voices.length > 0) {
        this.isReady = true;
      }
    } catch (e) {
      this.voices = [];
    }
  }

  resolveVoice(persona) {
    if (!this.voices || this.voices.length === 0) {
      this.initVoices();
    }
    if (!this.voices || this.voices.length === 0) return null;

    const englishVoices = this.voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
    const pool = englishVoices.length > 0 ? englishVoices : this.voices;

    // 1. 優先在音色候選名單中逐一精確匹配
    if (persona.preferredVoices && persona.preferredVoices.length > 0) {
      for (const pref of persona.preferredVoices) {
        const found = pool.find(v => (v.name || '').toLowerCase().includes(pref.toLowerCase()));
        if (found) return found;
      }
    }

    // 2. 次順位：依性別尋找最接近的原生音色
    if (persona.gender === 'male') {
      const anyMale = pool.find(v => isExplicitMale(v));
      if (anyMale) return anyMale;
    } else if (persona.gender === 'female') {
      const anyFemale = pool.find(v => isExplicitFemale(v));
      if (anyFemale) return anyFemale;
    }

    // 3. 最末順位：語言匹配
    const langMatch = pool.find(v => v.lang && v.lang.toLowerCase().startsWith(persona.lang ? persona.lang.toLowerCase() : 'en'));
    return langMatch || pool[0] || null;
  }

  speak(text, optionsOrKey = {}) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (soundEngine.isMuted) return;

    this.stop();
    if (!text) return;

    try {
      const utterance = new SpeechSynthesisUtterance(text);

      // 解析角色指紋
      let personaKey = 'mario';
      let customOptions = {};
      if (typeof optionsOrKey === 'string') {
        personaKey = optionsOrKey;
      } else if (typeof optionsOrKey === 'object' && optionsOrKey !== null) {
        personaKey = optionsOrKey.persona || optionsOrKey.locationId || optionsOrKey.id || optionsOrKey.gender || 'mario';
        customOptions = optionsOrKey;
      }

      const persona = PERSONAS[personaKey] || PERSONAS.student || PERSONAS.mario;
      const lang = customOptions.lang || persona.lang || 'en-US';
      utterance.lang = lang;

      const selectedVoice = this.resolveVoice(persona);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      let pitch = typeof customOptions.pitch === 'number' ? customOptions.pitch : persona.pitch;
      let rate = typeof customOptions.rate === 'number' ? customOptions.rate : persona.rate;

      // 男聲保護：如果瀏覽器缺乏原生男聲導致 fallback 至女聲，強制壓低 pitch 至 0.65 模擬厚實男低音
      if (persona.gender === 'male') {
        if (!selectedVoice || isExplicitFemale(selectedVoice)) {
          pitch = Math.min(pitch, 0.65);
        }
      }

      utterance.pitch = pitch;
      utterance.rate = rate;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      // Safe catch
    }
  }

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  }
}

export const voiceManager = new VoiceManager();
export const speakEnglish = (text, optionsOrKey) => voiceManager.speak(text, optionsOrKey);
export const stopSpeech = () => voiceManager.stop();


// ============================================================================
// 二、 真實音訊吉卜力原聲 BGM 播放器 (HTML5 Audio 跨場景平滑 Crossfade)
// ============================================================================

class BgmManager {
  constructor() {
    this.currentAudio = null;
    this.currentScene = null;
    this.cache = new Map();
    this.isMuted = false;
    this.maxVolume = 0.32; // 舒適且清晰的背景音樂音量
    this.fadeTimer = null;
    this.unlocked = false;

    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('wutai_bgm_muted');
        this.isMuted = saved === 'true';
      } catch (e) {}

      // 首次使用者手勢互動時解鎖音訊政策
      const unlockAudio = () => {
        this.unlocked = true;
        if (this.currentAudio && !this.isMuted && this.currentAudio.paused) {
          this.currentAudio.play().catch(() => {});
        }
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };
      window.addEventListener('pointerdown', unlockAudio, { once: true });
      window.addEventListener('click', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });
    }
  }

  getAudioInstance(sceneId) {
    if (!this.cache.has(sceneId)) {
      const audio = new Audio(`/audio/bgm/${sceneId}.mp3`);
      audio.loop = true;
      audio.preload = 'auto';
      this.cache.set(sceneId, audio);
    }
    return this.cache.get(sceneId);
  }

  playScene(sceneId = 'home') {
    if (!sceneId) return;
    if (this.currentScene === sceneId && this.currentAudio && !this.currentAudio.paused) {
      return;
    }

    if (this.fadeTimer) {
      clearInterval(this.fadeTimer);
      this.fadeTimer = null;
    }

    const prevAudio = this.currentAudio;
    const nextAudio = this.getAudioInstance(sceneId);

    this.currentScene = sceneId;
    this.currentAudio = nextAudio;

    if (this.isMuted) {
      if (prevAudio) {
        prevAudio.pause();
        prevAudio.currentTime = 0;
      }
      return;
    }

    // 啟動平滑 Crossfade (1 秒內線性漸強新音樂、漸弱舊音樂)
    try {
      nextAudio.volume = 0;
      const playPromise = nextAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // 瀏覽器未互動時的安全靜默
        });
      }

      let step = 0;
      const totalSteps = 10;
      this.fadeTimer = setInterval(() => {
        step++;
        const progress = step / totalSteps;

        try {
          if (nextAudio) {
            nextAudio.volume = Math.min(this.maxVolume, progress * this.maxVolume);
          }
          if (prevAudio && prevAudio !== nextAudio) {
            prevAudio.volume = Math.max(0, (1 - progress) * this.maxVolume);
          }
        } catch (e) {}

        if (step >= totalSteps) {
          clearInterval(this.fadeTimer);
          this.fadeTimer = null;
          if (prevAudio && prevAudio !== nextAudio) {
            try {
              prevAudio.pause();
              prevAudio.currentTime = 0;
            } catch (e) {}
          }
        }
      }, 100);
    } catch (e) {
      // 容錯保護
    }
  }

  stopBgm() {
    if (this.fadeTimer) {
      clearInterval(this.fadeTimer);
      this.fadeTimer = null;
    }
    if (this.currentAudio) {
      try {
        const audio = this.currentAudio;
        let step = 0;
        const fadeOut = setInterval(() => {
          step++;
          audio.volume = Math.max(0, (1 - step / 5) * this.maxVolume);
          if (step >= 5) {
            clearInterval(fadeOut);
            audio.pause();
            audio.currentTime = 0;
          }
        }, 60);
      } catch (e) {
        this.currentAudio.pause();
      }
    }
    this.currentScene = null;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('wutai_bgm_muted', String(this.isMuted));
      }
    } catch (e) {}

    if (this.isMuted) {
      if (this.currentAudio) {
        this.currentAudio.pause();
      }
      return false; // 現在是靜音
    } else {
      if (this.currentAudio) {
        this.currentAudio.volume = this.maxVolume;
        this.currentAudio.play().catch(() => {});
      } else if (this.currentScene) {
        this.playScene(this.currentScene);
      }
      return true; // 現在播放中
    }
  }

  isBgmActive() {
    return !this.isMuted && Boolean(this.currentAudio && !this.currentAudio.paused);
  }
}

export const bgmManager = new BgmManager();


// ============================================================================
// 三、 遊戲音效引擎 (Web Audio API - 按鈕點擊、答對、答錯、勝利、抽卡旋轉等)
// ============================================================================

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
      this.ctx.resume().catch(() => {});
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      stopSpeech();
      bgmManager.stopBgm();
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

  // 按鈕點擊反饋
  click() {
    this.playTone(400, 'triangle', 0.04, 0.08);
  }

  // 魔法靈感卡 急速旋轉音效
  spinCard() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
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
      this.playTone(260, 'triangle', 0.035, 0.28);
      setTimeout(() => this.playTone(840, 'sine', 0.06, 0.16), 25);
    } catch (e) {}
  }

  // ── 背景音樂介面橋接 (向後完全相容原程式調用) ──
  startSceneBgm(sceneId = 'home') {
    bgmManager.playScene(sceneId);
  }

  stopSceneBgm() {
    bgmManager.stopBgm();
  }

  toggleSceneBgm(sceneId = 'home') {
    if (bgmManager.isBgmActive()) {
      bgmManager.toggleMute();
      return false;
    } else {
      if (bgmManager.isMuted) {
        bgmManager.toggleMute();
      }
      bgmManager.playScene(sceneId);
      return true;
    }
  }

  isSceneBgmActive() {
    return bgmManager.isBgmActive();
  }

  startHomeBgm() {
    bgmManager.playScene('home');
  }

  stopHomeBgm() {
    bgmManager.stopBgm();
  }

  toggleHomeBgm() {
    return this.toggleSceneBgm('home');
  }

  isHomeBgmActive() {
    return bgmManager.isBgmActive();
  }
}

export const soundEngine = new SoundEngine();
