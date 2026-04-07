// ═══════════════════════════════════
// PR Card — Canvas drawing
// ═══════════════════════════════════
import { CARD_TEMPLATES, BADGE_COLORS } from './data';
import { getLevel, getStreakMultiplier } from './utils';

export function drawPRCard(canvas, { cardData, user, totalXP, selectedTpl, streak }) {
  const ctx = canvas.getContext('2d');
  const W = 540, H = 760;
  canvas.width = W;
  canvas.height = H;

  const tpl = CARD_TEMPLATES.find(t => t.id === selectedTpl) || CARD_TEMPLATES[0];
  const lvl = getLevel(totalXP);
  const mult = getStreakMultiplier(streak.count);

  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, tpl.bg1);
  bg.addColorStop(0.5, tpl.bg2);
  bg.addColorStop(1, tpl.bg1);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Border — effects
  let skipDefaultBorder = false;
  let borderStrokeStyle = tpl.border;

  if (tpl.effect) {
    switch (tpl.effect) {
      case "rainbow": {
        const grad = ctx.createLinearGradient(24, 24, W - 24, H - 24);
        grad.addColorStop(0, "#FF6D00");
        grad.addColorStop(0.25, "#E040FB");
        grad.addColorStop(0.5, "#00E5FF");
        grad.addColorStop(0.75, "#76FF03");
        grad.addColorStop(1, "#FF6D00");
        borderStrokeStyle = grad;
        break;
      }
      case "double_glow": {
        ctx.shadowColor = tpl.border; ctx.shadowBlur = 40;
        ctx.strokeStyle = tpl.border + "66"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.roundRect(20, 20, W - 40, H - 40, 18); ctx.stroke();
        ctx.shadowBlur = 20; ctx.strokeStyle = tpl.border; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(24, 24, W - 48, H - 48, 16); ctx.stroke();
        ctx.shadowBlur = 0;
        skipDefaultBorder = true;
        break;
      }
      case "double_border": {
        ctx.shadowColor = "#FF1744"; ctx.shadowBlur = 20;
        ctx.strokeStyle = "#FF1744"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.roundRect(20, 20, W - 40, H - 40, 18); ctx.stroke();
        ctx.shadowColor = "#FFD700"; ctx.shadowBlur = 15;
        ctx.strokeStyle = "#FFD700"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(28, 28, W - 56, H - 56, 14); ctx.stroke();
        ctx.shadowBlur = 0;
        skipDefaultBorder = true;
        break;
      }
      case "chrome": {
        const chromeGrad = ctx.createLinearGradient(24, 0, W - 24, 0);
        chromeGrad.addColorStop(0, "#ffffff");
        chromeGrad.addColorStop(0.3, "#90A4AE");
        chromeGrad.addColorStop(0.5, "#ffffff");
        chromeGrad.addColorStop(0.7, "#90A4AE");
        chromeGrad.addColorStop(1, "#ffffff");
        borderStrokeStyle = chromeGrad;
        break;
      }
      case "particles": {
        for (let i = 0; i < 40; i++) {
          const px = 30 + Math.random() * (W - 60);
          const py = 30 + Math.random() * (H - 60);
          const pr = 2 + Math.random() * 6;
          ctx.fillStyle = "rgba(0,230,118,0.04)";
          ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.fill();
        }
        break;
      }
      case "stars": {
        for (let i = 0; i < 90; i++) {
          const sx = 30 + Math.random() * (W - 60);
          const sy = 30 + Math.random() * (H - 60);
          const sr = 0.5 + Math.random() * 1.5;
          ctx.fillStyle = `rgba(255,255,255,${0.1 + Math.random() * 0.4})`;
          ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
        }
        break;
      }
      case "triple_gold": {
        ctx.shadowColor = "#FFD700"; ctx.shadowBlur = 35;
        ctx.strokeStyle = "#FFD700"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.roundRect(18, 18, W - 36, H - 36, 20); ctx.stroke();
        ctx.strokeStyle = "#FF6B35"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(24, 24, W - 48, H - 48, 16); ctx.stroke();
        ctx.strokeStyle = "#FFD700"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.roundRect(30, 30, W - 60, H - 60, 12); ctx.stroke();
        ctx.shadowBlur = 0;
        const goldGrad = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, 350);
        goldGrad.addColorStop(0, "rgba(255,215,0,0.08)");
        goldGrad.addColorStop(1, "transparent");
        ctx.fillStyle = goldGrad; ctx.fillRect(0, 0, W, H);
        skipDefaultBorder = true;
        break;
      }
    }
  }

  if (!skipDefaultBorder) {
    ctx.shadowColor = tpl.border;
    ctx.shadowBlur = 25;
    ctx.strokeStyle = borderStrokeStyle;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(24, 24, W - 48, H - 48, 16);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Inner radial
  const ig = ctx.createRadialGradient(W / 2, 200, 50, W / 2, 200, 300);
  ig.addColorStop(0, tpl.border + '14');
  ig.addColorStop(1, 'transparent');
  ctx.fillStyle = ig;
  ctx.fillRect(0, 0, W, H);

  // Header
  ctx.textAlign = 'center';
  ctx.fillStyle = tpl.border;
  ctx.font = "600 13px 'Segoe UI', sans-serif";
  ctx.fillText('🐐 GOAT FUEL', W / 2, 60);

  ctx.fillStyle = '#fff';
  ctx.font = "900 26px 'Segoe UI', sans-serif";
  ctx.fillText('NOUVEAU PR', W / 2, 100);

  ctx.fillStyle = '#FFD700';
  ctx.font = '28px sans-serif';
  ctx.fillText('🏆', W / 2, 132);

  // Photo zone
  const pY = 155, pH = 240, pW = W - 100;
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect((W - pW) / 2, pY, pW, pH, 12);
  ctx.fill();
  ctx.stroke();

  // Photo frame glow
  ctx.shadowColor = tpl.border;
  ctx.shadowBlur = 15;
  ctx.strokeStyle = tpl.border + '88';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect((W - pW) / 2, pY, pW, pH, 12);
  ctx.stroke();
  ctx.shadowBlur = 0;

  const drawBottom = () => {
    const bY = pY + pH + 35;

    // Exercise name
    ctx.fillStyle = '#fff';
    ctx.font = "bold 24px 'Segoe UI', sans-serif";
    ctx.fillText(cardData.ex.n, W / 2, bY);

    // Performance
    ctx.fillStyle = tpl.border;
    ctx.font = "bold 22px 'Segoe UI', sans-serif";
    const u = cardData.ex.u;
    const perf = u === 'reps' ? `${cardData.reps} reps`
      : u === 'sec' ? `${cardData.weight} sec`
      : u === 'min' ? `${cardData.weight} min`
      : `${cardData.weight} kg  ×  ${cardData.reps} reps`;
    ctx.fillText(perf, W / 2, bY + 35);

    // 1RM estimate
    if (u === 'kg' && cardData.reps > 1) {
      ctx.fillStyle = '#888';
      ctx.font = "14px 'Segoe UI', sans-serif";
      ctx.fillText(`~${cardData.est} kg  1RM estimé`, W / 2, bY + 60);
    }

    // User + date
    ctx.fillStyle = '#777';
    ctx.font = "13px 'Segoe UI', sans-serif";
    const ds = new Date(cardData.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    const userName = user?.name || '@user';
    const textOffset = user?.photoURL ? 18 : 0;

    if (user?.photoURL) {
      const profileImg = new Image();
      profileImg.onload = () => {
        ctx.save();
        const circleX = W / 2 - ctx.measureText(`${userName}  ·  ${ds}`).width / 2 - textOffset - 4;
        const circleY = bY + 95 - 10;
        ctx.beginPath();
        ctx.arc(circleX, circleY, 12, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(profileImg, circleX - 12, circleY - 12, 24, 24);
        ctx.restore();
      };
      profileImg.src = user.photoURL;
    }
    ctx.fillText(`${userName}  ·  ${ds}`, W / 2 + textOffset, bY + 95);

    // Level badge
    ctx.font = "bold 11px 'Segoe UI', sans-serif";
    const lt = `⚡ LVL ${lvl.l} · ${lvl.n}`;
    const bw1 = ctx.measureText(lt).width + 20;
    const bx1 = W / 2 - bw1 / 2 - 40;
    ctx.fillStyle = lvl.c + '22';
    ctx.strokeStyle = lvl.c + '66';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(bx1, bY + 115, bw1, 26, 13);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = lvl.c;
    ctx.fillText(lt, bx1 + bw1 / 2, bY + 132);

    // Category badge
    const ct = `🏋️ ${cardData.ex.b}`;
    const bw2 = ctx.measureText(ct).width + 20;
    const bx2 = W / 2 + 40 - bw2 / 2;
    const bc2 = BADGE_COLORS[cardData.ex.b] || '#FF6B35';
    ctx.fillStyle = bc2 + '22';
    ctx.strokeStyle = bc2 + '66';
    ctx.beginPath();
    ctx.roundRect(bx2, bY + 115, bw2, 26, 13);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = bc2;
    ctx.fillText(ct, bx2 + bw2 / 2, bY + 132);

    // Streak badge
    if (streak.count >= 3) {
      ctx.fillStyle = '#FF6B3522';
      ctx.strokeStyle = '#FF6B3566';
      const st = `🔥 ${streak.count}j × ${mult}`;
      const sw = ctx.measureText(st).width + 20;
      ctx.beginPath();
      ctx.roundRect(W / 2 - sw / 2, bY + 150, sw, 24, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FF6B35';
      ctx.fillText(st, W / 2, bY + 166);
    }

    // Footer
    ctx.fillStyle = '#555';
    ctx.font = "12px 'Segoe UI', sans-serif";
    ctx.fillText('🐐 GOAT FUEL', W / 2, H - 40);
  };

  // Draw photo or rank badge
  if (cardData.photo) {
    const img = new Image();
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect((W - pW) / 2, pY, pW, pH, 12);
      ctx.clip();
      const sc = Math.max(pW / img.width, pH / img.height);
      const dw = img.width * sc, dh = img.height * sc;
      ctx.drawImage(img, (W - dw) / 2, pY + (pH - dh) / 2, dw, dh);
      ctx.restore();
      drawBottom();
    };
    img.src = cardData.photo;
  } else {
    ctx.fillStyle = '#444';
    ctx.font = '60px sans-serif';
    ctx.fillText(lvl.l <= 4 ? '🥉' : lvl.l <= 8 ? '🥈' : '🥇', W / 2, pY + pH / 2 + 10);
    ctx.fillStyle = '#888';
    ctx.font = "bold 18px 'Segoe UI', sans-serif";
    ctx.fillText(lvl.n.toUpperCase(), W / 2, pY + pH / 2 + 50);
    drawBottom();
  }
}

export async function shareCardImage(canvas, cardData) {
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: `PR ${cardData.ex.n}`,
            text: `🏆 Nouveau PR ${cardData.ex.n}: ${cardData.weight}${cardData.ex.u} × ${cardData.reps} reps ! #GoatFuel`,
            files: [new File([blob], 'goatfuel-pr.png', { type: 'image/png' })],
          });
        } catch {}
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'goatfuel-pr.png';
        a.click();
        URL.revokeObjectURL(url);
      }
      resolve();
    }, 'image/png');
  });
}
