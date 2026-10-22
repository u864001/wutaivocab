import fs from 'fs';

// ── 1. Update src/games/snake/snakeJungleTheme.js ──
let themeCode = fs.readFileSync('src/games/snake/snakeJungleTheme.js', 'utf8');

// Replace drawLetterPod with upgraded high-contrast, crystal-clear glowing version
const oldPodRegex = /\/\/ ── 4\. 繪製字母標的 \(Letter Pods\) ──[\s\S]*?export const drawLetterPod = \(ctx, letter, theme, isNextTarget, time\) => \{[\s\S]*?ctx\.restore\(\);\s*\};/;

const newPodCode = `// ── 4. 繪製字母標的 (Letter Pods - 晶亮發光且字體超清晰高對比，學生一眼即能辨識) ──
export const drawLetterPod = (ctx, letter, theme, isNextTarget, time, isDark = false) => {
  ctx.save();
  ctx.translate(letter.renderX, letter.renderY);

  const bounce = isNextTarget ? Math.sin(time * 6) * 3 : 0;
  ctx.translate(0, bounce);

  const charUpper = (letter.char || '').toUpperCase();

  if (theme === 'indigenous') {
    // ⛰️ 霧台神山百步蛇主題：板岩金紋符石 (Runic Slate Block)
    if (isNextTarget) {
      // 1. 外圍神聖光暈層 (只對外圈光暈生效，文字繪製前務必清空 shadowBlur，確保文字極致清晰！)
      ctx.save();
      const pulseSize = 22 + Math.sin(time * 8) * 3;
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 24;
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, pulseSize, 0, Math.PI * 2);
      ctx.stroke();

      // 4 個對稱神聖光芒菱形星芒
      const rot = time * 1.5;
      for (let i = 0; i < 4; i++) {
        const ang = rot + (i * Math.PI) / 2;
        const rx = Math.cos(ang) * (pulseSize + 4);
        const ry = Math.sin(ang) * (pulseSize + 4);
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(rx, ry, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 2. 板岩符石本體 (徹底重設 shadowBlur = 0，消除一切字體模糊暈染)
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';

    // 符石底色：發光目標使用更深邃高對比黑曜板岩，非目標使用深青岩
    ctx.fillStyle = isNextTarget ? '#0f172a' : (isDark ? '#1e293b' : '#1e293b');
    ctx.strokeStyle = isNextTarget ? '#facc15' : '#64748b';
    ctx.lineWidth = isNextTarget ? 3.5 : 2;
    ctx.beginPath();
    ctx.roundRect(-19, -19, 38, 38, 11);
    ctx.fill();
    ctx.stroke();

    // 內嵌金屬刻紋 (菱形圖騰角飾)
    ctx.strokeStyle = isNextTarget ? '#fde047' : '#475569';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-14, -14, 28, 28);

    // 3. 字母本體渲染：極致銳利，純黑外描邊 + 亮白/亮金高飽和填充，學生一眼即可看穿！
    ctx.shadowBlur = 0;
    ctx.font = '900 22px Fredoka, Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 先以厚實深黑描邊建立強烈邊界對比 (避免光芒淹沒字型)
    ctx.strokeStyle = isNextTarget ? '#000000' : '#0f172a';
    ctx.lineWidth = 4.5;
    ctx.strokeText(charUpper, 0, 1);

    // 再填入高亮純白/高純金，字體立體剔透！
    ctx.fillStyle = isNextTarget ? '#ffffff' : '#e2e8f0';
    ctx.fillText(charUpper, 0, 1);

    // 發光目標文字中央加一抹金色點綴
    if (isNextTarget) {
      ctx.fillStyle = '#fef08a';
      ctx.fillText(charUpper, 0, 1);
    }
  } else {
    // 🌿 熱帶雨林主題：翠綠仙果 / 叢林寶石 (Jungle Gem Fruit)
    if (isNextTarget) {
      ctx.save();
      const pulseSize = 21 + Math.sin(time * 8) * 3;
      ctx.shadowColor = '#4ade80';
      ctx.shadowBlur = 24;
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, pulseSize, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = isNextTarget ? '#064e3b' : '#ffffff';
    ctx.strokeStyle = isNextTarget ? '#22c55e' : '#10b981';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 0, 19, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 葉片
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.ellipse(0, -19, 6, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // 字母字型：銳利黑描邊 + 亮白/深綠字體
    ctx.shadowBlur = 0;
    ctx.font = '900 22px Fredoka, Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.strokeStyle = isNextTarget ? '#000000' : '#0f172a';
    ctx.lineWidth = isNextTarget ? 4 : 2;
    ctx.strokeText(charUpper, 0, 1);

    ctx.fillStyle = isNextTarget ? '#ffffff' : '#064e3b';
    ctx.fillText(charUpper, 0, 1);
  }

  ctx.restore();
};`;

if (oldPodRegex.test(themeCode)) {
  themeCode = themeCode.replace(oldPodRegex, newPodCode);
  fs.writeFileSync('src/games/snake/snakeJungleTheme.js', themeCode, 'utf8');
  console.log('snakeJungleTheme.js upgraded drawLetterPod!');
} else {
  console.log('Regex did not match oldPodRegex');
}
