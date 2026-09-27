import React, { createContext, useContext, useState, useEffect } from 'react';

const DICTIONARY = {
  'zh-TW': {
    appName: '霧臺國小 英文學習宇宙',
    subtitle: 'Wutai English Adventure World',
    connected: '雲端同步',
    offline: '離線護航',
    soundOn: '音效開啟',
    soundOff: '靜音模式',
    themeDay: '陽光叢林',
    themeNight: '極光星空',
    teacherHub: '教師工作台',
    leaderboard: '全校英雄榜',
    
    // 大廳區塊
    rangeTitle: '1. 設定複習範圍',
    officialBooks: '教育部教材',
    teacherSections: '任課教師專區',
    selectAll: '全選單元',
    clearAll: '清空選擇',
    selectedCount: '已選 {count} 字',
    unitCount: '每次出題數量',
    q5: '隨機 5 題',
    q10: '隨機 10 題',
    q20: '隨機 20 題',
    qAll: '範圍內全部',
    rankQualified: '🎯 範圍達標！挑戰榮譽榜',
    rankHint: '需選滿單冊 2 個單元（或 20 字），且選擇 20 題或全部即可登錄榜單。',
    
    // 遊戲類別
    secSolo: '🚀 單人冒險挑戰',
    secMulti: '⚔️ 多人連線競技',
    secClassic: '📝 經典學習測驗',
    
    // 遊戲名稱與描述
    meteorTitle: '隕石防衛戰',
    meteorDesc: '射擊墜落的單字隕石，守護地球防線！',
    snakeTitle: '叢林貪食蛇',
    snakeDesc: '在翠綠草地上按字母順序吞食拼字！',
    spellingTitle: '拖曳拼字大師',
    spellingDesc: '聆聽發音，滑動字母填滿單字槽！',
    memoryTitle: '星際記憶翻牌',
    memoryDesc: '考驗記憶力！中英單字配對與金幣雨！',
    battleTitle: '星際死鬥競技場',
    battleDesc: '2~4 人即時連線，答對發動隕石突襲對手！',
    quizZhEn: '中翻英打字',
    quizEnZh: '英翻中打字',
    quizListening: '英語聽力測驗',
    quizHard: '魔王綜合考驗',
    
    // 遊戲中互動反饋
    backLobby: '回大廳',
    quitGame: '放棄挑戰',
    startChallenge: '開始挑戰',
    correct: '答對了！太棒了！',
    wrong: '再試一次！',
    combo: '連擊！',
    perfect: '完美無瑕！',
    timesUp: '時間到！',
    heartsDepleted: '愛心耗盡！正確答案是：',
    finalScore: '挑戰結算',
    spentTime: '耗費時間',
    totalCorrect: '答對題數',
    submitHonor: '留名榮譽榜',
    enterName: '輸入英雄暱稱 (1~6字)',
    submitting: '上傳中...',
    submitted: '已登錄榮譽榜！',
    playAgain: '再玩一次',
    
    // 掃描加入
    scanToJoin: '掃描 QR Code 隨時加入冒險',
    developer: '霧臺國小 教師研發團隊製作'
  },
  'en': {
    appName: 'Wutai English Adventure',
    subtitle: 'Wutai English Adventure World',
    connected: 'Cloud Synced',
    offline: 'Offline Ready',
    soundOn: 'Sound On',
    soundOff: 'Muted',
    themeDay: 'Sunny Jungle',
    themeNight: 'Cosmic Aurora',
    teacherHub: 'Teacher Hub',
    leaderboard: 'Hall of Fame',
    
    // Lobby sections
    rangeTitle: '1. Select Review Range',
    officialBooks: 'Official Curriculum',
    teacherSections: 'Teacher Wordbanks',
    selectAll: 'Select All',
    clearAll: 'Clear',
    selectedCount: '{count} words selected',
    unitCount: 'Questions per round',
    q5: '5 Questions',
    q10: '10 Questions',
    q20: '20 Questions',
    qAll: 'All in Range',
    rankQualified: '🎯 Qualified for Leaderboard!',
    rankHint: 'Select at least 2 units (or 20 words) from a single book and pick 20 or All questions to qualify.',
    
    // Game categories
    secSolo: '🚀 Solo Adventures',
    secMulti: '⚔️ Multiplayer Arena',
    secClassic: '📝 Classic Practice',
    
    // Game titles & descriptions
    meteorTitle: 'Meteor Defense',
    meteorDesc: 'Shoot down falling vocabulary meteors to defend base!',
    snakeTitle: 'Jungle Snake',
    snakeDesc: 'Guide the snake to eat letters in spelling order!',
    spellingTitle: 'Spelling Master',
    spellingDesc: 'Listen, drag & place letters into the slots!',
    memoryTitle: 'Cosmic Memory Match',
    memoryDesc: 'Pair English & Chinese cards + catch Coin Rain!',
    battleTitle: 'Horizon Deathmatch',
    battleDesc: '2-4 players live battle! Correct answers launch assaults!',
    quizZhEn: 'ZH to EN Typing',
    quizEnZh: 'EN to ZH Typing',
    quizListening: 'Listening Quiz',
    quizHard: 'Hardcore Master Quiz',
    
    // In-game feedbacks
    backLobby: 'Back to Lobby',
    quitGame: 'Quit Game',
    startChallenge: 'Start Challenge',
    correct: 'Awesome! Correct!',
    wrong: 'Try Again!',
    combo: 'Combo!',
    perfect: 'Flawless Victory!',
    timesUp: "Time's Up!",
    heartsDepleted: 'Hearts depleted! Correct answer was:',
    finalScore: 'Challenge Results',
    spentTime: 'Time Elapsed',
    totalCorrect: 'Correct Answers',
    submitHonor: 'Submit to Leaderboard',
    enterName: 'Enter Hero Name (1-6 chars)',
    submitting: 'Submitting...',
    submitted: 'Saved to Hall of Fame!',
    playAgain: 'Play Again',
    
    // Footer
    scanToJoin: 'Scan QR Code to join on tablet/mobile',
    developer: 'Crafted by Wutai Elementary School Teachers'
  }
};

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('wutai_lang') || 'zh-TW';
  });

  useEffect(() => {
    localStorage.setItem('wutai_lang', lang);
  }, [lang]);

  const toggleLang = () => {
    setLang(prev => (prev === 'zh-TW' ? 'en' : 'zh-TW'));
  };

  const t = DICTIONARY[lang] || DICTIONARY['zh-TW'];

  return (
    <I18nContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
