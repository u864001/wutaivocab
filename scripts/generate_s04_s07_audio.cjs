const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const fs = require('fs');
const path = require('path');

async function generateSentenceAudio(tts, text, finalFilePath) {
  const tempDir = path.join(__dirname, 'temp_audio_' + Date.now() + '_' + Math.random().toString(36).substring(7));
  fs.mkdirSync(tempDir, { recursive: true });
  try {
    await tts.toFile(tempDir, text);
    const generatedFile = path.join(tempDir, 'audio.mp3');
    if (fs.existsSync(generatedFile)) {
      fs.copyFileSync(generatedFile, finalFilePath);
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

async function run() {
  const outDir = path.join(__dirname, '..', 'public', 'audio', 'halloween');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // 1. Mia (en-US-AnaNeural)
  const ttsMia = new MsEdgeTTS();
  await ttsMia.setMetadata('en-US-AnaNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  // 2. Ben (en-US-SteffanNeural)
  const ttsBen = new MsEdgeTTS();
  await ttsBen.setMetadata('en-US-SteffanNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  // 3. Ms. Lin (en-US-JennyNeural)
  const ttsMsLin = new MsEdgeTTS();
  await ttsMsLin.setMetadata('en-US-JennyNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  console.log('Generating S04~S07 audio clips...');

  // S04
  await generateSentenceAudio(ttsMia, 'How are you?', path.join(outDir, 'S04_L01_MIA.mp3'));
  console.log('✓ S04_L01_MIA: How are you?');

  await generateSentenceAudio(ttsBen, "I'm fine. How are you?", path.join(outDir, 'S04_L02_BEN.mp3'));
  console.log('✓ S04_L02_BEN: I\'m fine. How are you?');

  await generateSentenceAudio(ttsMia, "I'm fine, too.", path.join(outDir, 'S04_L03_MIA.mp3'));
  console.log('✓ S04_L03_MIA: I\'m fine, too.');

  // S05
  await generateSentenceAudio(ttsBen, 'How old are you?', path.join(outDir, 'S05_L01_BEN.mp3'));
  console.log('✓ S05_L01_BEN: How old are you?');

  await generateSentenceAudio(ttsMia, "I'm nine. How old are you?", path.join(outDir, 'S05_L02_MIA.mp3'));
  console.log('✓ S05_L02_MIA: I\'m nine. How old are you?');

  await generateSentenceAudio(ttsBen, "I'm ten years old.", path.join(outDir, 'S05_L03_BEN.mp3'));
  console.log('✓ S05_L03_BEN: I\'m ten years old.');

  // S06
  await generateSentenceAudio(ttsMsLin, 'Good morning! Line up, please.', path.join(outDir, 'S06_L01_MS_LIN.mp3'));
  console.log('✓ S06_L01_MS_LIN: Good morning! Line up, please.');

  await generateSentenceAudio(ttsMia, 'Come on, Ben.', path.join(outDir, 'S06_L02_MIA.mp3'));
  console.log('✓ S06_L02_MIA: Come on, Ben.');

  // S07
  await generateSentenceAudio(ttsMia, 'Look! A pumpkin!', path.join(outDir, 'S07_L01_MIA.mp3'));
  console.log('✓ S07_L01_MIA: Look! A pumpkin!');

  await generateSentenceAudio(ttsBen, 'Wow! Cool!', path.join(outDir, 'S07_L02_BEN.mp3'));
  console.log('✓ S07_L02_BEN: Wow! Cool!');

  await generateSentenceAudio(ttsMsLin, "Let's make a Halloween poster.", path.join(outDir, 'S07_L03_MS_LIN.mp3'));
  console.log('✓ S07_L03_MS_LIN: Let\'s make a Halloween poster.');

  console.log('All S04~S07 audio generated successfully!');
}

run().catch(console.error);
