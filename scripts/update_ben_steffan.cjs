const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const fs = require('fs');
const path = require('path');

async function generateBen() {
  const tempDir = path.join(__dirname, 'temp_steffan_' + Date.now());
  fs.mkdirSync(tempDir, { recursive: true });

  const pub = path.join(__dirname, '..', 'public', 'audio', 'halloween');

  // 1. Steffan (美國男童音，標準 10 歲男孩聲線)
  const ttsSteffan = new MsEdgeTTS();
  await ttsSteffan.setMetadata('en-US-SteffanNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  // S02_L02_BEN: Good morning!
  await ttsSteffan.toFile(tempDir, 'Good morning!');
  fs.copyFileSync(path.join(tempDir, 'audio.mp3'), path.join(pub, 'S02_L02_BEN.mp3'));
  console.log('✓ Updated S02_L02_BEN with Steffan');

  // S03_L02_BEN: I'm Ben.
  await ttsSteffan.toFile(tempDir, "I'm Ben.");
  fs.copyFileSync(path.join(tempDir, 'audio.mp3'), path.join(pub, 'S03_L02_BEN.mp3'));
  console.log('✓ Updated S03_L02_BEN with Steffan');

  // 候選人試聽檔案：
  // Steffan: "Good morning! I'm Ben. Nice to meet you!"
  await ttsSteffan.toFile(tempDir, "Good morning! I'm Ben. Nice to meet you!");
  fs.copyFileSync(path.join(tempDir, 'audio.mp3'), path.join(pub, 'ben_steffan_intro.mp3'));

  // Andrew: "Good morning! I'm Ben. Nice to meet you!"
  const ttsAndrew = new MsEdgeTTS();
  await ttsAndrew.setMetadata('en-US-AndrewNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  await ttsAndrew.toFile(tempDir, "Good morning! I'm Ben. Nice to meet you!");
  fs.copyFileSync(path.join(tempDir, 'audio.mp3'), path.join(pub, 'ben_andrew_intro.mp3'));

  // Eric: "Good morning! I'm Ben. Nice to meet you!"
  const ttsEric = new MsEdgeTTS();
  await ttsEric.setMetadata('en-US-EricNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  await ttsEric.toFile(tempDir, "Good morning! I'm Ben. Nice to meet you!");
  fs.copyFileSync(path.join(tempDir, 'audio.mp3'), path.join(pub, 'ben_eric_intro.mp3'));

  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log('All Ben candidate voices updated successfully!');
}

generateBen().catch(console.error);
