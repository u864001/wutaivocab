/**
 * dialogueSpeaker.js
 * 
 * 專為英語能力檢測（SAA / TME Pre-A1）打造之多角色真實對話語音引擎
 * 支援依對話角色（男聲、女聲、考官/旁白）動態調度 Web Speech API 最佳英語音色與音調
 */

import { soundEngine } from './audio';

// 判斷是否為明確男性音色
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

// 判斷是否為明確女性音色
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

// 判斷角色性別與角色指紋
export const detectSpeakerGender = (speakerRaw = '', fallbackIndex = 0) => {
  const s = speakerRaw.trim().toLowerCase();
  
  if (s.includes('question') || s.includes('narrator') || s.includes('test') || s === 'q') {
    return 'narrator';
  }

  const femaleKeywords = [
    'girl', 'woman', 'mom', 'mother', 'mrs', 'ms', 'miss', 'sister', 'aunt',
    'grandma', 'grandmother', 'lady', 'amy', 'linda', 'kelly', 'mary', 'emma',
    'lucy', 'sarah', 'lisa', 'helen', 'betty', 'judy', 'anna', 'sandy', 'wendy',
    'jane', 'clara', 'eva'
  ];
  if (femaleKeywords.some(k => s === k || s.startsWith(k + ' ') || s.endsWith(' ' + k))) {
    return 'female';
  }

  const maleKeywords = [
    'boy', 'man', 'dad', 'father', 'mr', 'brother', 'uncle', 'grandpa',
    'grandfather', 'gentleman', 'tom', 'peter', 'andy', 'ben', 'mike', 'jack',
    'tony', 'ken', 'sam', 'john', 'david', 'bob', 'clerk', 'driver', 'doctor'
  ];
  if (maleKeywords.some(k => s === k || s.startsWith(k + ' ') || s.endsWith(' ' + k))) {
    return 'male';
  }

  if (s.includes('teacher') || s.includes('student') || s.includes('clerk')) {
    return fallbackIndex % 2 === 0 ? 'female' : 'male';
  }

  // 若為 Speaker A / Speaker B 或無法辨識，依輪次交替男女聲
  return fallbackIndex % 2 === 0 ? 'female' : 'male';
};

/**
 * 解析對話文本為角色語音片段陣列
 * 支援格式：
 * "Girl: Where are you going? Boy: I am going to the zoo. Question: Where is the boy going?"
 * "Mom: Do you want milk? \nTom: Yes, please."
 */
export const parseDialogueTurns = (rawText = '') => {
  if (!rawText || typeof rawText !== 'string') return [];

  // 清除前後引號與空白
  const cleaned = rawText.trim().replace(/^["']|["']$/g, '');

  // 尋找符合 "Speaker:" 的位置
  // 匹配常見角色標籤如 Mom:, Dad:, Girl:, Boy:, Tom:, Question:, Clerk:, A:, B:
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

  // 若沒有找到至少 2 個角色對話標籤，視為單人純文本
  if (matches.length < 2) {
    // 檢查是否有單一 Question: 或只有 1 個標籤
    if (matches.length === 1 && matches[0].startIdx === 0) {
      const content = cleaned.substring(matches[0].fullLength).trim();
      return [{
        speaker: matches[0].speaker,
        text: content,
        gender: detectSpeakerGender(matches[0].speaker, 0)
      }];
    }
    return [{
      speaker: 'Narrator',
      text: cleaned,
      gender: 'narrator'
    }];
  }

  const turns = [];
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const textStart = current.startIdx + current.fullLength;
    const textEnd = i + 1 < matches.length ? matches[i + 1].startIdx : cleaned.length;
    const text = cleaned.substring(textStart, textEnd).trim();

    if (text) {
      turns.push({
        speaker: current.speaker,
        text,
        gender: detectSpeakerGender(current.speaker, i)
      });
    }
  }

  return turns;
};

/**
 * 判斷文本是否包含多角色對話
 */
export const isDialogue = (text = '') => {
  const turns = parseDialogueTurns(text);
  return turns.length > 1;
};

/**
 * 對話播放控制類別
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
    return all.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
  }

  resolveVoiceForGender(gender, voices) {
    if (!voices || voices.length === 0) return null;

    if (gender === 'female') {
      const female = voices.find(v => isExplicitFemale(v));
      if (female) return female;
      const namedFemale = voices.find(v => {
        const n = (v.name || '').toLowerCase();
        return n.includes('zira') || n.includes('samantha') || n.includes('jenny') || n.includes('victoria');
      });
      if (namedFemale) return namedFemale;
    } else if (gender === 'male') {
      const male = voices.find(v => isExplicitMale(v));
      if (male) return male;
      const namedMale = voices.find(v => {
        const n = (v.name || '').toLowerCase();
        return n.includes('david') || n.includes('mark') || n.includes('guy') || n.includes('george');
      });
      if (namedMale) return namedMale;
    }

    return voices[0] || null;
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

      // 依性別指派適配音色與音調
      const voice = this.resolveVoiceForGender(turn.gender, voices);
      if (voice) {
        utterance.voice = voice;
      }

      // 性別音調與語速微調 (營造真實年齡與性別差異)
      if (turn.gender === 'female') {
        utterance.pitch = 1.15; // 較清脆優雅女聲
        utterance.rate = 0.90;
      } else if (turn.gender === 'male') {
        utterance.pitch = 0.86; // 穩重男聲
        utterance.rate = 0.90;
      } else {
        // narrator / 考官
        utterance.pitch = 1.0;
        utterance.rate = 0.88;
      }

      utterance.onend = () => {
        if (!this.isPlaying || this.token !== currentToken) return;
        // 角色交替間隔停頓 350ms，更加自然流暢
        this.timer = setTimeout(() => {
          playNextTurn(idx + 1);
        }, 350);
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

    // 啟動首位角色對話
    playNextTurn(0);
  }
}

export const dialoguePlayer = new DialoguePlayer();

export const playDialogueSpeech = (options) => dialoguePlayer.play(options);
export const stopDialogueSpeech = () => dialoguePlayer.stop();
