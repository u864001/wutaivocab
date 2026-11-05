/**
 * dialogueSpeaker.js
 * 
 * 專為英語能力檢測（SAA / TME Pre-A1）打造之多角色真實對話語音引擎
 * 支援依對話角色（男聲、女聲、大人、小孩、考官/旁白）動態調度 Web Speech API 最佳美語音色與音調
 * 徹底區隔不同男性角色（如爸爸 vs 兒子 Andy）與不同女性角色，優先採用美式發音 (en-US)
 */

import { soundEngine } from './audio';

// 判斷是否為美語發音 (en-US)
const isAmericanEnglish = (v) => {
  const lang = (v.lang || '').toLowerCase().replace('_', '-');
  return lang.startsWith('en-us');
};

// 判斷是否為明確男性音色
const isExplicitMale = (v) => {
  const name = (v.name || '').toLowerCase();
  const femaleSignals = [
    'female', 'woman', 'girl', 'zira', 'jenny', 'samantha', 'aria', 'hazel', 
    'victoria', 'karen', 'linda', 'anna', 'michelle', 'ana', 'ava', 'emma', 
    'susan', 'heera', 'catherine', 'clara', 'natasha', 'sonia', 'neerja', 
    'stephanie', 'alice', 'julie', 'sarah'
  ];
  if (femaleSignals.some(f => name.includes(f))) return false;

  const maleSignals = [
    'male', 'david', 'guy', 'mark', 'christopher', 'eric', 'roger', 'steffan', 
    'alex', 'fred', 'daniel', 'george', 'oliver', 'tom', 'aaron', 'bruce', 
    'richard', 'ryan', 'james', 'john', 'paul', 'william', 'charles'
  ];
  return maleSignals.some(m => name.includes(m));
};

// 判斷是否為明確女性音色
const isExplicitFemale = (v) => {
  const name = (v.name || '').toLowerCase();
  const maleSignals = [
    'david', 'guy', 'mark', 'christopher', 'eric', 'roger', 'steffan', 
    'alex', 'fred', 'daniel', 'george', 'oliver', 'tom', 'aaron', 'bruce', 
    'richard', 'ryan'
  ];
  if (maleSignals.some(m => name.includes(m)) && !name.includes('female')) return false;

  const femaleSignals = [
    'female', 'woman', 'girl', 'zira', 'jenny', 'samantha', 'aria', 'hazel', 
    'victoria', 'karen', 'linda', 'anna', 'michelle', 'ana', 'ava', 'emma', 
    'susan', 'heera', 'catherine', 'clara', 'natasha', 'sonia', 'neerja', 
    'stephanie', 'alice', 'julie', 'sarah', 'google us english'
  ];
  return femaleSignals.some(f => name.includes(f));
};

// 細緻判定角色性別與年齡人設 (大人 vs 學生/小孩 vs 考官)
export const detectSpeakerPersona = (speakerRaw = '', fallbackIndex = 0) => {
  const s = speakerRaw.trim().toLowerCase();
  
  if (s.includes('question') || s.includes('narrator') || s.includes('test') || s === 'q') {
    return { gender: 'narrator', role: 'narrator', age: 'adult' };
  }

  // 女性大人
  const adultFemale = ['mom', 'mother', 'mrs', 'ms', 'lady', 'aunt', 'grandma', 'grandmother', 'teacher'];
  if (adultFemale.some(k => s === k || s.startsWith(k + ' ') || s.endsWith(' ' + k))) {
    return { gender: 'female', role: 'adult-female', age: 'adult' };
  }

  // 女性學生/小孩
  const childFemale = ['girl', 'miss', 'sister', 'amy', 'linda', 'kelly', 'mary', 'emma', 'lucy', 'sarah', 'lisa', 'helen', 'betty', 'judy', 'anna', 'sandy', 'wendy', 'jane', 'clara', 'eva', 'daughter'];
  if (childFemale.some(k => s === k || s.startsWith(k + ' ') || s.endsWith(' ' + k))) {
    return { gender: 'female', role: 'child-female', age: 'child' };
  }

  // 男性大人
  const adultMale = ['dad', 'father', 'mr', 'man', 'gentleman', 'uncle', 'grandpa', 'grandfather', 'driver', 'doctor', 'officer', 'clerk'];
  if (adultMale.some(k => s === k || s.startsWith(k + ' ') || s.endsWith(' ' + k))) {
    return { gender: 'male', role: 'adult-male', age: 'adult' };
  }

  // 男性學生/小孩
  const childMale = ['boy', 'son', 'brother', 'tom', 'peter', 'andy', 'ben', 'mike', 'jack', 'tony', 'ken', 'sam', 'john', 'david', 'bob', 'kid', 'student'];
  if (childMale.some(k => s === k || s.startsWith(k + ' ') || s.endsWith(' ' + k))) {
    return { gender: 'male', role: 'child-male', age: 'child' };
  }

  // 通用交替回退
  const isFemale = fallbackIndex % 2 === 0;
  return {
    gender: isFemale ? 'female' : 'male',
    role: isFemale ? 'child-female' : 'child-male',
    age: 'child'
  };
};

export const detectSpeakerGender = (speakerRaw = '', fallbackIndex = 0) => {
  return detectSpeakerPersona(speakerRaw, fallbackIndex).gender;
};

/**
 * 解析對話文本為角色語音片段陣列
 */
export const parseDialogueTurns = (rawText = '') => {
  if (!rawText || typeof rawText !== 'string') return [];

  const cleaned = rawText.trim().replace(/^["']|["']$/g, '');

  const pattern = /(?:^|\s+)(Mom|Dad|Boy|Girl|Man|Woman|Tom|Peter|Kelly|Andy|Ben|Linda|Teacher|Students?|Clerk|Doctor|Narrator|Question|Speaker\s*[A-Z]|[A-Z])\s*:\s*/gi;
  
  const matches = [];
  let match;
  while ((match = pattern.exec(cleaned)) !== null) {
    matches.push({
      speaker: match[1].trim(),
      startIdx: match.index,
      fullLength: match[0].length
    });
  }

  if (matches.length < 2) {
    if (matches.length === 1 && matches[0].startIdx === 0) {
      const content = cleaned.substring(matches[0].fullLength).trim();
      const persona = detectSpeakerPersona(matches[0].speaker, 0);
      return [{
        speaker: matches[0].speaker,
        text: content,
        gender: persona.gender,
        role: persona.role,
        age: persona.age
      }];
    }
    return [{
      speaker: 'Narrator',
      text: cleaned,
      gender: 'narrator',
      role: 'narrator',
      age: 'adult'
    }];
  }

  const turns = [];
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const textStart = current.startIdx + current.fullLength;
    const textEnd = i + 1 < matches.length ? matches[i + 1].startIdx : cleaned.length;
    const text = cleaned.substring(textStart, textEnd).trim();

    if (text) {
      const persona = detectSpeakerPersona(current.speaker, i);
      turns.push({
        speaker: current.speaker,
        text,
        gender: persona.gender,
        role: persona.role,
        age: persona.age
      });
    }
  }

  return turns;
};

export const isDialogue = (text = '') => {
  const turns = parseDialogueTurns(text);
  return turns.length > 1;
};

/**
 * 對話播放控制類別（全自動美語優先與人設音調調度）
 */
class DialoguePlayer {
  constructor() {
    this.isPlaying = false;
    this.currentTurnIndex = -1;
    this.turns = [];
    this.token = 0;
    this.timer = null;
    this.onTurnChange = null;
    this.onFinish = null;
    this.onError = null;
  }

  getVoices() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return [];
    const all = window.speechSynthesis.getVoices() || [];
    // 優先美語 en-US，其餘 en 語系次之
    const enVoices = all.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
    const usVoices = enVoices.filter(v => isAmericanEnglish(v));
    const nonUsVoices = enVoices.filter(v => !isAmericanEnglish(v));
    return [...usVoices, ...nonUsVoices];
  }

  resolveVoiceForTurn(turn, voices, speakerHistory = {}) {
    if (!voices || voices.length === 0) return null;

    // 優先從美語列表中尋找
    const candidateVoices = voices;

    if (turn.gender === 'female') {
      const femaleVoices = candidateVoices.filter(v => isExplicitFemale(v));
      if (femaleVoices.length > 0) {
        // 若有不同女性，輪替音色
        const idx = Object.keys(speakerHistory).filter(k => speakerHistory[k]?.gender === 'female').length;
        return femaleVoices[idx % femaleVoices.length];
      }
    } else if (turn.gender === 'male') {
      const maleVoices = candidateVoices.filter(v => isExplicitMale(v));
      if (maleVoices.length > 0) {
        // 大人優先第一音色（如 David），少年/小孩優先第二音色（如 Mark / Guy / Alex）
        if (turn.role === 'adult-male') {
          return maleVoices[0];
        } else {
          return maleVoices.length > 1 ? maleVoices[1] : maleVoices[0];
        }
      }
    } else {
      // 考官/旁白：優先自然流暢的美式音色
      const usVoice = candidateVoices.find(v => isAmericanEnglish(v));
      if (usVoice) return usVoice;
    }

    return candidateVoices[0] || null;
  }

  stop() {
    this.isPlaying = false;
    this.currentTurnIndex = -1;
    this.token += 1;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  }

  play({ text, onTurnChange, onFinish, onError }) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (onError) onError('SpeechSynthesis is not supported');
      return;
    }

    if (soundEngine?.isMuted) return;

    this.stop();

    this.turns = parseDialogueTurns(text);
    if (this.turns.length === 0) {
      if (onFinish) onFinish();
      return;
    }

    this.isPlaying = true;
    this.currentTurnIndex = 0;
    this.onTurnChange = onTurnChange;
    this.onFinish = onFinish;
    this.onError = onError;

    const currentToken = this.token;
    const voices = this.getVoices();
    const speakerHistory = {};

    const playNextTurn = (idx) => {
      if (!this.isPlaying || this.token !== currentToken) return;

      if (idx >= this.turns.length) {
        this.isPlaying = false;
        this.currentTurnIndex = -1;
        if (this.onTurnChange) this.onTurnChange(-1, null);
        if (this.onFinish) this.onFinish();
        return;
      }

      this.currentTurnIndex = idx;
      const turn = this.turns[idx];
      if (this.onTurnChange) this.onTurnChange(idx, turn);

      const utterance = new SpeechSynthesisUtterance(turn.text);
      utterance.lang = 'en-US';

      // 依性別與人設指派適配美語音色
      const voice = this.resolveVoiceForTurn(turn, voices, speakerHistory);
      if (voice) {
        utterance.voice = voice;
        speakerHistory[turn.speaker] = { voice: voice.name, gender: turn.gender, role: turn.role };
      }

      // 關鍵人設音調與語速差異化（即便系統只有單一音色，也能立體區隔爸爸與小孩）
      if (turn.role === 'adult-male') {
        utterance.pitch = 0.74; // 沉穩深厚成熟男聲（如 Dad、爸爸）
        utterance.rate = 0.88;
      } else if (turn.role === 'child-male') {
        utterance.pitch = 1.18; // 清亮活潑少年/學生男聲（如 Andy、Tom）
        utterance.rate = 0.94;
      } else if (turn.role === 'adult-female') {
        utterance.pitch = 1.02; // 溫和成熟女聲（如 Mom、老師）
        utterance.rate = 0.88;
      } else if (turn.role === 'child-female') {
        utterance.pitch = 1.25; // 清脆靈動女孩聲（如 Amy、Girl）
        utterance.rate = 0.92;
      } else {
        // 考官 / Narrator
        utterance.pitch = 1.0;  // 中性清晰播報音調
        utterance.rate = 0.90;
      }

      utterance.onend = () => {
        if (!this.isPlaying || this.token !== currentToken) return;
        this.timer = setTimeout(() => {
          playNextTurn(idx + 1);
        }, 360);
      };

      utterance.onerror = (e) => {
        console.warn('Dialogue speech turn error:', e);
        if (!this.isPlaying || this.token !== currentToken) return;
        this.timer = setTimeout(() => {
          playNextTurn(idx + 1);
        }, 200);
      };

      window.speechSynthesis.speak(utterance);
    };

    playNextTurn(0);
  }
}

export const dialoguePlayer = new DialoguePlayer();

export const playDialogueSpeech = (options) => dialoguePlayer.play(options);
export const stopDialogueSpeech = () => dialoguePlayer.stop();
