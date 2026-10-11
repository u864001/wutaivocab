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
    } else {
      throw new Error(`File not generated for: ${text}`);
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

async function run() {
  const outDir = path.join(__dirname, '..', 'public', 'audio', 'halloween');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const ttsMia = new MsEdgeTTS();
  await ttsMia.setMetadata('en-US-AnaNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  const ttsBen = new MsEdgeTTS();
  await ttsBen.setMetadata('en-US-SteffanNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  const ttsMsLin = new MsEdgeTTS();
  await ttsMsLin.setMetadata('en-US-JennyNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  const clips = [
    // S08
    { speaker: 'MIA', tts: ttsMia, text: "What's this?", file: 'S08_L01_MIA.mp3' },
    { speaker: 'BEN', tts: ttsBen, text: "It's a pencil.", file: 'S08_L02_BEN.mp3' },
    { speaker: 'BEN', tts: ttsBen, text: "What's that?", file: 'S08_L03_BEN.mp3' },
    { speaker: 'MIA', tts: ttsMia, text: "It's an eraser.", file: 'S08_L04_MIA.mp3' },

    // S09
    { speaker: 'MIA', tts: ttsMia, text: "What's this?", file: 'S09_L01_MIA.mp3' },
    { speaker: 'BEN', tts: ttsBen, text: "It's a book.", file: 'S09_L02_BEN.mp3' },
    { speaker: 'MIA', tts: ttsMia, text: "And this?", file: 'S09_L03_MIA.mp3' },
    { speaker: 'BEN', tts: ttsBen, text: "It's a pen.", file: 'S09_L04_BEN.mp3' },

    // S10
    { speaker: 'MIA', tts: ttsMia, text: "What's that?", file: 'S10_L01_MIA.mp3' },
    { speaker: 'BEN', tts: ttsBen, text: "It's a ruler.", file: 'S10_L02_BEN.mp3' },
    { speaker: 'MIA', tts: ttsMia, text: "What color is it?", file: 'S10_L03_MIA.mp3' },
    { speaker: 'BEN', tts: ttsBen, text: "It's blue.", file: 'S10_L04_BEN.mp3' },

    // S11
    { speaker: 'MIA', tts: ttsMia, text: "What's this?", file: 'S11_L01_MIA.mp3' },
    { speaker: 'BEN', tts: ttsBen, text: "It's a marker.", file: 'S11_L02_BEN.mp3' },
    { speaker: 'MIA', tts: ttsMia, text: "What color is it?", file: 'S11_L03_MIA.mp3' },
    { speaker: 'BEN', tts: ttsBen, text: "It's green.", file: 'S11_L04_BEN.mp3' },

    // S12
    { speaker: 'MIA', tts: ttsMia, text: "Oh, no! My marker!", file: 'S12_L01_MIA.mp3' },
    { speaker: 'BEN', tts: ttsBen, text: "What color is it?", file: 'S12_L02_BEN.mp3' },
    { speaker: 'MIA', tts: ttsMia, text: "It's black.", file: 'S12_L03_MIA.mp3' },

    // S13
    { speaker: 'BEN', tts: ttsBen, text: "Red?", file: 'S13_L01_BEN.mp3' },
    { speaker: 'MIA', tts: ttsMia, text: "No, that's red.", file: 'S13_L02_MIA.mp3' },
    { speaker: 'BEN', tts: ttsBen, text: "Yellow?", file: 'S13_L03_BEN.mp3' },
    { speaker: 'MIA', tts: ttsMia, text: "No, that's yellow. It's black.", file: 'S13_L04_MIA.mp3' },

    // S14
    { speaker: 'BEN', tts: ttsBen, text: "What's that?", file: 'S14_L01_BEN.mp3' },
    { speaker: 'MIA', tts: ttsMia, text: "It's a box.", file: 'S14_L02_MIA.mp3' },
    { speaker: 'BEN', tts: ttsBen, text: "Look!", file: 'S14_L03_BEN.mp3' },
    { speaker: 'MIA', tts: ttsMia, text: "That's my marker! Thanks!", file: 'S14_L04_MIA.mp3' },
    { speaker: 'BEN', tts: ttsBen, text: "You're welcome.", file: 'S14_L05_BEN.mp3' },

    // S15
    { speaker: 'MIA', tts: ttsMia, text: "A ghost!", file: 'S15_L01_MIA.mp3' },
    { speaker: 'BEN', tts: ttsBen, text: "A bat!", file: 'S15_L02_BEN.mp3' },
    { speaker: 'MS_LIN', tts: ttsMsLin, text: "And a spider. Good job!", file: 'S15_L03_MS_LIN.mp3' },
    { speaker: 'MIA', tts: ttsMia, text: "Thank you!", file: 'S15_L04_MIA.mp3' },

    // S16 (Numbers with slight pauses between each number)
    { speaker: 'MIA', tts: ttsMia, text: "One, two, three, four, five.", file: 'S16_L01_MIA.mp3' },
    { speaker: 'BEN', tts: ttsBen, text: "Six, seven, eight, nine, ten!", file: 'S16_L02_BEN.mp3' },

    // S17
    { speaker: 'MIA', tts: ttsMia, text: "Look! I'm a witch!", file: 'S17_L01_MIA.mp3' },
    { speaker: 'BEN', tts: ttsBen, text: "I'm a vampire!", file: 'S17_L02_BEN.mp3' },

    // S18
    { speaker: 'MS_LIN', tts: ttsMsLin, text: "Happy Halloween!", file: 'S18_L01_MS_LIN.mp3' },
    { speaker: 'MIA', tts: ttsMia, text: "Happy Halloween!", file: 'S18_L02_MIA.mp3' },
    { speaker: 'BEN', tts: ttsBen, text: "Trick or treat!", file: 'S18_L03_BEN.mp3' },
    { speaker: 'MIA', tts: ttsMia, text: "Thank you!", file: 'S18_L04_MIA.mp3' },
    { speaker: 'MS_LIN', tts: ttsMsLin, text: "You're welcome.", file: 'S18_L05_MS_LIN.mp3' }
  ];

  console.log(`Starting generation of ${clips.length} audio clips for S08~S18...`);
  for (const item of clips) {
    const dest = path.join(outDir, item.file);
    await generateSentenceAudio(item.tts, item.text, dest);
    console.log(`✓ [${item.speaker}] ${item.file}: "${item.text}"`);
    // Short pause to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }
  console.log('All S08~S18 audio clips generated successfully!');
}

run().catch(err => {
  console.error('Error generating audio:', err);
  process.exit(1);
});
