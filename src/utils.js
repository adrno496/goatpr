// ═══════════════════════════════════
// Utility & helper functions
// ═══════════════════════════════════
import { LEVELS, FAKE_USERS, EXERCISES, CHALLENGE_TEMPLATES, ACHIEVEMENTS } from './data';

// ── Level system ──
export function getLevel(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xp) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getNextLevel(xp) {
  const cur = getLevel(xp);
  const idx = LEVELS.findIndex(l => l.l === cur.l);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

export function getLevelProgress(xp) {
  const cur = getLevel(xp);
  const next = getNextLevel(xp);
  if (!next) return 100;
  return Math.min(((xp - cur.xp) / (next.xp - cur.xp)) * 100, 100);
}

// ── 1RM (Epley formula) ──
export function calc1RM(weight, reps) {
  if (reps <= 0 || weight <= 0) return weight;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

// ── XP calculation ──
export function calcXP(weight, reps, unit, multiplier = 1) {
  let base;
  if (unit === 'reps') base = reps * 5;
  else if (unit === 'sec' || unit === 'min') base = weight * 2;
  else base = calc1RM(weight, reps) * 0.5;
  return Math.round(base * multiplier);
}

// ── Streak multiplier ──
export function getStreakMultiplier(streakDays) {
  if (streakDays >= 30) return 2.0;
  if (streakDays >= 14) return 1.5;
  if (streakDays >= 7) return 1.3;
  if (streakDays >= 3) return 1.1;
  return 1.0;
}

// ── Date formatting ──
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function timeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}j`;
}

// ── Fake leaderboard scores ──
export function generateFakeScores(exerciseId) {
  const seed = exerciseId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return FAKE_USERS.map((u, i) => ({
    ...u,
    w: Math.round((200 - i * 18 + (seed % 40)) * 10) / 10,
    r: 1 + (seed + i) % 8,
  })).sort((a, b) => calc1RM(b.w, b.r) - calc1RM(a.w, a.r));
}

// ── Fake social feed ──
export function generateFakeFeed() {
  const feed = [];
  const now = Date.now();
  FAKE_USERS.forEach((u, i) => {
    const ex = EXERCISES[(i * 7 + 3) % EXERCISES.length];
    feed.push({
      user: u,
      ex,
      weight: Math.round(80 + i * 15 + Math.random() * 20),
      reps: 1 + Math.floor(Math.random() * 5),
      time: now - (i * 3600000 + Math.random() * 7200000),
      type: 'pr',
    });
  });
  return feed.sort((a, b) => b.time - a.time);
}

// ── Coach AI messages ──
export function generateCoachMessages(prs, streakCount) {
  const msgs = [];
  const prKeys = Object.keys(prs);
  const now = Date.now();

  if (prKeys.length === 0) {
    msgs.push({ icon: '🐐', t: 'Bienvenue !', d: 'Enregistre ton premier PR pour commencer ta progression.' });
  }

  if (streakCount >= 7) {
    msgs.push({
      icon: '🔥',
      t: `${streakCount}J STREAK`,
      d: `Incroyable ! Multiplicateur ×${getStreakMultiplier(streakCount)} XP actif !`,
    });
  }

  // Stale PRs
  prKeys.forEach(k => {
    const pr = prs[k];
    const days = Math.floor((now - new Date(pr.date).getTime()) / 86400000);
    if (days > 14 && msgs.length < 4) {
      const ex = EXERCISES.find(e => e.id === k);
      if (ex) {
        msgs.push({
          icon: '💪',
          t: `${ex.n} — ${days}j sans PR`,
          d: `Ton PR est de ${pr.weight}${ex.u}×${pr.reps}. Prêt à le casser ?`,
        });
      }
    }
  });

  if (msgs.length < 2) {
    msgs.push({ icon: '🏆', t: 'Coach', d: `Tu as ${prKeys.length} PRs. Continue !` });
  }

  return msgs;
}

// ── Generate weekly challenges ──
export function generateChallenges(count = 3) {
  const shuffled = [...CHALLENGE_TEMPLATES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(c => ({ ...c, done: false, progress: 0 }));
}

// ── PR Summary for Coach ──
export function generatePRSummary(prs, exercises, user, level, streak, mult) {
  const cats = {};
  Object.entries(prs).forEach(([id, pr]) => {
    const ex = exercises.find(e => e.id === id);
    if (!ex) return;
    if (!cats[ex.b]) cats[ex.b] = [];
    cats[ex.b].push({ ex, pr });
  });

  let text = `📊 MES PERSONAL RECORDS — GOAT FUEL\n`;
  text += `Profil : ${user.name} | LVL ${level.l} · ${level.n} | Streak : ${streak.count}j (×${mult})\n\n`;

  const badgeLabels = {
    PUSH: "🏋️ PUSH",
    PULL: "🚣 PULL",
    SQUAT: "🦵 SQUAT",
    OLY: "🥇 OLYMPIC",
    CORE: "🧘 CORE",
    CARDIO: "🏃 CARDIO",
  };

  Object.entries(badgeLabels).forEach(([badge, label]) => {
    if (!cats[badge]?.length) return;
    text += `${label}\n`;
    cats[badge]
      .sort((a, b) => (b.pr.est || 0) - (a.pr.est || 0))
      .forEach(({ ex, pr }) => {
        const dateStr = new Date(pr.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
        if (ex.u === 'kg') {
          text += `- ${ex.n} : ${pr.weight} kg × ${pr.reps} reps (~${pr.est} kg 1RM) — ${dateStr}\n`;
        } else {
          text += `- ${ex.n} : ${pr.weight} ${ex.u} — ${dateStr}\n`;
        }
      });
    text += `\n`;
  });

  const coveredCats = new Set(Object.keys(cats));
  text += `📈 STATS\n`;
  text += `- Total PRs : ${Object.keys(prs).length}\n`;
  text += `- Niveau : LVL ${level.l} (${level.n})\n`;
  text += `- Streak : ${streak.count}j (×${mult})\n`;
  text += `- Catégories couvertes : ${coveredCats.size}/6\n`;

  return text;
}

// ── Check achievements ──
export function checkAchievements(context, unlockedAch) {
  const newlyUnlocked = [];
  for (const ach of ACHIEVEMENTS) {
    if (unlockedAch.includes(ach.id)) continue;
    try {
      if (ach.check(context)) {
        newlyUnlocked.push(ach);
      }
    } catch {
      // ignore check errors (e.g. missing data)
    }
  }
  return newlyUnlocked;
}

// ── Local storage helpers ──
export function loadLocal(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

export function saveLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
