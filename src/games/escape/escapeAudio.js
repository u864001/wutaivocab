// ── 密室逃脫專屬：電影級高品質環境背景音樂 (OGG) ＆ 逼真環境音效 ＆ 10大美英雙語外師語音 ──
// 使用 public/audio/escape/ 靜態高清環境音檔 (零 Supabase 頻寬消耗，CDN 高速快取)

class EscapeAudioEngine {
  constructor() {
    this.ctx = null;
    this.bgmAudio = null;
    this.currentTrack = null;
    this.currentUrl = null;
    this.isMuted = false;
    this.bgmVolume = 0.32;
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

  /**
   * 取得各密室主題對應之高品質低頻寬環境音檔路徑
   */
  getBgmUrl(themeId = 'temple') {
    const tid = String(themeId).toLowerCase();
    if (tid.startsWith('dungeon')) {
      return '/audio/escape/escape_dungeon.ogg';
    }
    if (tid.startsWith('tomb')) {
      return '/audio/escape/escape_tomb.ogg';
    }
    if (tid.startsWith('asylum')) {
      return '/audio/escape/escape_asylum.ogg';
    }
    // 預設與古神殿 / 書庫 / 星象祭壇
    return '/audio/escape/escape_temple.ogg';
  }

  /**
   * 播放房間專屬高品質環境音 (具備平滑淡入與同曲去重)
   */
  playRoomBgm(themeId = 'temple') {
    this.currentTrack = themeId;
    const targetUrl = this.getBgmUrl(themeId);

    // 若同一首音訊正在播放且未中斷，無需重新加載
    if (this.bgmAudio && this.currentUrl === targetUrl && !this.bgmAudio.paused) {
      return;
    }

    // 淡出並關閉前一首
    if (this.bgmAudio) {
      const oldAudio = this.bgmAudio;
      let fadeVol = oldAudio.volume;
      const fadeInterval = setInterval(() => {
        fadeVol = Math.max(0, fadeVol - 0.08);
        oldAudio.volume = fadeVol;
        if (fadeVol <= 0.02) {
          clearInterval(fadeInterval);
          try {
            oldAudio.pause();
            oldAudio.currentTime = 0;
          } catch (e) {}
        }
      }, 50);
      this.bgmAudio = null;
    }

    if (this.isMuted) {
      this.currentUrl = targetUrl;
      return;
    }

    try {
      const audio = new Audio(targetUrl);
      audio.loop = true;
      audio.volume = 0.05;
      this.bgmAudio = audio;
      this.currentUrl = targetUrl;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // 平滑淡入至目標音量
            let v = 0.05;
            const fadeInTimer = setInterval(() => {
              if (!this.bgmAudio || this.isMuted) {
                clearInterval(fadeInTimer);
                return;
              }
              v = Math.min(this.bgmVolume, v + 0.05);
              this.bgmAudio.volume = v;
              if (v >= this.bgmVolume) {
                clearInterval(fadeInTimer);
              }
            }, 60);
          })
          .catch((err) => {
            console.log('密室 BGM 自動播放受瀏覽器政策限制或待互動:', err);
          });
      }
    } catch (e) {
      console.warn('密室環境音播放異常:', e);
    }
  }

  stopCurrentMusic() {
    if (this.bgmAudio) {
      try {
        this.bgmAudio.pause();
        this.bgmAudio.currentTime = 0;
      } catch (e) {}
      this.bgmAudio = null;
    }
    this.currentUrl = null;
    this.currentTrack = null;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      if (this.bgmAudio) {
        this.bgmAudio.volume = 0;
      }
    } else {
      if (this.bgmAudio) {
        this.bgmAudio.volume = this.bgmVolume;
        if (this.bgmAudio.paused) {
          this.bgmAudio.play().catch(() => {});
        }
      } else if (this.currentTrack) {
        this.playRoomBgm(this.currentTrack);
      }
    }
    return this.isMuted;
  }

  /**
   * 偶發環境彩蛋：極輕柔逼真的老鼠「吱」聲 (純 Web Audio 振盪器高頻滑音，零外加音檔)
   */
  playMouseSqueak() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const ctx = this.ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(3100, now);
      osc.frequency.linearRampToValueAtTime(3850, now + 0.035);
      osc.frequency.linearRampToValueAtTime(3200, now + 0.08);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  /**
   * 鐘樓夜雨環境彩蛋：遠處逼真低頻滾動雷鳴 (Procedural Brown Noise Sweep)
   */
  playThunderRumble() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const ctx = this.ctx;
      const now = ctx.currentTime;

      // 生成 2.6 秒 Brown Noise 緩衝區
      const bufferSize = Math.floor(ctx.sampleRate * 2.6);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.025 * white)) / 1.025;
        lastOut = output[i];
        output[i] *= 3.8;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      // 深層低通共鳴濾波器，模擬遠處穿透石牆的沉悶雷響
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);
      filter.frequency.linearRampToValueAtTime(200, now + 0.35);
      filter.frequency.exponentialRampToValueAtTime(40, now + 2.5);
      filter.Q.setValueAtTime(2.2, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.24, now + 0.3);
      gain.gain.linearRampToValueAtTime(0.14, now + 1.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + 2.6);
    } catch (e) {
      console.warn('Thunder rumble error:', e);
    }
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
