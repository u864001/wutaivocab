const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const fs = require('fs');
const path = require('path');

async function generateSentenceAudio(tts, text, finalFilePath) {
  const tempDir = path.join(__dirname, 'temp_tts_' + Date.now() + '_' + Math.random().toString(36).substring(7));
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

  // Mia (en-US-AnaNeural)
  const ttsMia = new MsEdgeTTS();
  await ttsMia.setMetadata('en-US-AnaNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  // Ben (en-US-ChristopherNeural)
  const ttsBen = new MsEdgeTTS();
  await ttsBen.setMetadata('en-US-ChristopherNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  console.log('Generating voice clips for S02 & S03...');

  // S02 L01: Mia: Good morning!
  const s02_l01 = path.join(outDir, 'S02_L01_MIA.mp3');
  await generateSentenceAudio(ttsMia, 'Good morning!', s02_l01);
  console.log('✓ S02_L01_MIA.mp3 generated (' + fs.statSync(s02_l01).size + ' bytes)');

  // S02 L02: Ben: Good morning!
  const s02_l02 = path.join(outDir, 'S02_L02_BEN.mp3');
  await generateSentenceAudio(ttsBen, 'Good morning!', s02_l02);
  console.log('✓ S02_L02_BEN.mp3 generated (' + fs.statSync(s02_l02).size + ' bytes)');

  // S03 L01: Mia: Hi! My name is Mia. What's your name?
  const s03_l01 = path.join(outDir, 'S03_L01_MIA.mp3');
  await generateSentenceAudio(ttsMia, "Hi! My name is Mia. What's your name?", s03_l01);
  console.log('✓ S03_L01_MIA.mp3 generated (' + fs.statSync(s03_l01).size + ' bytes)');

  // S03 L02: Ben: I'm Ben.
  const s03_l02 = path.join(outDir, 'S03_L02_BEN.mp3');
  await generateSentenceAudio(ttsBen, "I'm Ben.", s03_l02);
  console.log('✓ S03_L02_BEN.mp3 generated (' + fs.statSync(s03_l02).size + ' bytes)');

  // S03 L03: Mia: Hello, Ben!
  const s03_l03 = path.join(outDir, 'S03_L03_MIA.mp3');
  await generateSentenceAudio(ttsMia, 'Hello, Ben!', s03_l03);
  console.log('✓ S03_L03_MIA.mp3 generated (' + fs.statSync(s03_l03).size + ' bytes)');

  console.log('All sample audio files generated successfully!');
}

run().catch(console.error);
