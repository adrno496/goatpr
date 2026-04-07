import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  EXERCISES, CATEGORIES, BADGE_COLORS, CARD_TEMPLATES, AFFILIATES,
  SHOP_AVATARS, SHOP_FRAMES, SHOP_THEMES, DAILY_QUEST_POOL, ACHIEVEMENTS, TITLES
} from './data';
import {
  getLevel, getNextLevel, getLevelProgress, calc1RM, calcXP, getStreakMultiplier,
  formatDate, timeAgo, generateFakeScores, generateFakeFeed, generateCoachMessages,
  generateChallenges, generatePRSummary, checkAchievements, loadLocal, saveLocal
} from './utils';
import { drawPRCard, shareCardImage } from './prCard';
import { S, theme } from './styles';

// ── Avatar Component ──
function Avatar({ user, size = 28, frame = null }) {
  const eqFrame = frame || null;
  const frameStyle = eqFrame ? {
    border: `3px solid ${eqFrame.color?.startsWith('linear') ? '#FFD700' : eqFrame.color}`,
    boxShadow: `0 0 12px ${eqFrame.color?.startsWith('linear') ? '#FFD700' : eqFrame.color}44`,
  } : { border: '2px solid rgba(255,107,53,0.25)' };

  const base = { width: size, height: size, borderRadius: '50%', objectFit: 'cover', ...frameStyle, flexShrink: 0 };

  if (user?.photoURL) {
    return <img src={user.photoURL} alt="" style={base} />;
  }
  return (
    <span style={{
      fontSize: size * 0.55, display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size, borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
      ...frameStyle, flexShrink: 0,
    }}>
      {user?.av || '🐐'}
    </span>
  );
}

export default function App() {
  // ── State ──
  const [user, setUser] = useState(() => loadLocal('gf_u', null));
  const [prs, setPrs] = useState(() => loadLocal('gf_p', {}));
  const [streak, setStreak] = useState(() => loadLocal('gf_streak', { count: 0, last: null }));
  const [premium, setPremium] = useState(() => loadLocal('gf_prem', null));
  const [ownedTemplates, setOwnedTemplates] = useState(() => loadLocal('gf_tpl', ['classic']));
  const [selectedTpl, setSelectedTpl] = useState('classic');
  const [challenges, setChallenges] = useState(() => loadLocal('gf_ch', []));
  const [duels, setDuels] = useState(() => loadLocal('gf_duels', []));

  // New state
  const [sub, setSub] = useState(null); // "coach" modal
  const [sessions, setSessions] = useState(() => loadLocal('gf_sessions', []));
  const [activeSession, setActiveSession] = useState(null);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(null); // { total, remaining }
  const [motionTab, setMotionTab] = useState('seance');
  const [sessionType, setSessionType] = useState('Push');
  const [sessionPickEx, setSessionPickEx] = useState(false);
  const [sessionNote, setSessionNote] = useState('');
  const [sessionRating, setSessionRating] = useState(0);
  const [showSessionRecap, setShowSessionRecap] = useState(false);
  const [sessionDetail, setSessionDetail] = useState(null);

  const [ownedAvatars, setOwnedAvatars] = useState(() => loadLocal('gf_avatars', ['goat_classic']));
  const [ownedFrames, setOwnedFrames] = useState(() => loadLocal('gf_frames', ['frame_white']));
  const [ownedThemes, setOwnedThemes] = useState(() => loadLocal('gf_themes', ['goat_classic']));
  const [equippedAvatar, setEquippedAvatar] = useState(() => loadLocal('gf_eq_av', 'goat_classic'));
  const [equippedFrame, setEquippedFrame] = useState(() => loadLocal('gf_eq_fr', 'frame_white'));
  const [equippedTheme, setEquippedTheme] = useState(() => loadLocal('gf_eq_th', 'goat_classic'));
  const [shopTab, setShopTab] = useState('templates');

  const [dailyQuests, setDailyQuests] = useState(() => loadLocal('gf_dq', { date: null, quests: [] }));
  const [unlockedAch, setUnlockedAch] = useState(() => loadLocal('gf_ach', []));
  const [dailyReward, setDailyReward] = useState(() => loadLocal('gf_dr', { day: 0, lastClaimed: null }));
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [missions30, setMissions30] = useState(() => loadLocal('gf_m30', { startDate: null, prs: 0, sessionCount: 0 }));
  const [equippedTitle, setEquippedTitle] = useState(() => loadLocal('gf_eq_title', 'none'));
  const [ownedTitles, setOwnedTitles] = useState(() => loadLocal('gf_owned_titles', ['none']));
  const [sharesCount, setSharesCount] = useState(() => loadLocal('gf_shares', 0));
  const [purchaseCount, setPurchaseCount] = useState(() => loadLocal('gf_purchases', 0));

  // UI
  const [page, setPage] = useState('home');
  const [subView, setSubView] = useState(null);
  const [selEx, setSelEx] = useState(null);
  const [selCat, setSelCat] = useState('Tous');
  const [search, setSearch] = useState('');
  const [formW, setFormW] = useState('');
  const [formR, setFormR] = useState('1');
  const [photo, setPhoto] = useState(null);
  const [cardData, setCardData] = useState(null);
  const [toast, setToast] = useState(null);
  const [tab2, setTab2] = useState('list');
  const [rankEx, setRankEx] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [socialTab, setSocialTab] = useState('feed');
  const [shopPreview, setShopPreview] = useState(null); // item being previewed
  const canvasRef = useRef(null);
  const sessionIntervalRef = useRef(null);
  const restIntervalRef = useRef(null);

  // ── Persist ──
  useEffect(() => { saveLocal('gf_p', prs) }, [prs]);
  useEffect(() => { if (user) saveLocal('gf_u', user) }, [user]);
  useEffect(() => { saveLocal('gf_streak', streak) }, [streak]);
  useEffect(() => { saveLocal('gf_prem', premium) }, [premium]);
  useEffect(() => { saveLocal('gf_tpl', ownedTemplates) }, [ownedTemplates]);
  useEffect(() => { saveLocal('gf_ch', challenges) }, [challenges]);
  useEffect(() => { saveLocal('gf_duels', duels) }, [duels]);
  useEffect(() => { saveLocal('gf_sessions', sessions) }, [sessions]);
  useEffect(() => { saveLocal('gf_avatars', ownedAvatars) }, [ownedAvatars]);
  useEffect(() => { saveLocal('gf_frames', ownedFrames) }, [ownedFrames]);
  useEffect(() => { saveLocal('gf_themes', ownedThemes) }, [ownedThemes]);
  useEffect(() => { saveLocal('gf_eq_av', equippedAvatar) }, [equippedAvatar]);
  useEffect(() => { saveLocal('gf_eq_fr', equippedFrame) }, [equippedFrame]);
  useEffect(() => { saveLocal('gf_eq_th', equippedTheme) }, [equippedTheme]);
  useEffect(() => { saveLocal('gf_dq', dailyQuests) }, [dailyQuests]);
  useEffect(() => { saveLocal('gf_ach', unlockedAch) }, [unlockedAch]);
  useEffect(() => { saveLocal('gf_dr', dailyReward) }, [dailyReward]);
  useEffect(() => { saveLocal('gf_m30', missions30) }, [missions30]);
  useEffect(() => { saveLocal('gf_eq_title', equippedTitle) }, [equippedTitle]);
  useEffect(() => { saveLocal('gf_owned_titles', ownedTitles) }, [ownedTitles]);
  useEffect(() => { saveLocal('gf_shares', sharesCount) }, [sharesCount]);
  useEffect(() => { saveLocal('gf_purchases', purchaseCount) }, [purchaseCount]);

  // ── Theme colors ──
  const themeColors = useMemo(() => {
    const th = SHOP_THEMES.find(t => t.id === equippedTheme) || SHOP_THEMES[0];
    return th.dark;
  }, [equippedTheme]);

  // ── Equipped frame object ──
  const equippedFrameObj = useMemo(() => SHOP_FRAMES.find(f => f.id === equippedFrame) || null, [equippedFrame]);

  // ── Init challenges ──
  useEffect(() => {
    if (challenges.length === 0 && user) setChallenges(generateChallenges(3));
  }, [user]);

  // ── Streak check ──
  useEffect(() => {
    if (!user) return;
    const today = new Date().toDateString();
    if (streak.last === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    setStreak({ count: streak.last === yesterday ? streak.count + 1 : 1, last: today });
  }, [user]);

  // ── Daily quests reset ──
  useEffect(() => {
    if (!user) return;
    const today = new Date().toDateString();
    if (dailyQuests.date !== today) {
      const shuffled = [...DAILY_QUEST_POOL].sort(() => Math.random() - 0.5);
      setDailyQuests({ date: today, quests: shuffled.slice(0, 3).map(q => ({ ...q, progress: 0, done: false })) });
    }
  }, [user]);

  // ── Daily reward check ──
  useEffect(() => {
    if (!user) return;
    const today = new Date().toDateString();
    if (dailyReward.lastClaimed !== today) {
      setShowDailyReward(true);
    }
  }, [user]);

  // ── Missions 30 init ──
  useEffect(() => {
    if (!user || missions30.startDate) return;
    setMissions30({ startDate: new Date().toISOString(), prs: 0, sessionCount: 0 });
  }, [user]);

  // ── Session timer ──
  useEffect(() => {
    if (activeSession) {
      sessionIntervalRef.current = setInterval(() => {
        setSessionTimer(Math.floor((Date.now() - activeSession.startTime) / 1000));
      }, 1000);
    } else {
      clearInterval(sessionIntervalRef.current);
      setSessionTimer(0);
    }
    return () => clearInterval(sessionIntervalRef.current);
  }, [activeSession?.startTime]);

  // ── Rest timer ──
  useEffect(() => {
    if (!restTimer || restTimer.remaining <= 0) {
      clearInterval(restIntervalRef.current);
      if (restTimer?.remaining <= 0) {
        if (navigator.vibrate) navigator.vibrate(200);
        setTimeout(() => setRestTimer(null), 800);
      }
      return;
    }
    restIntervalRef.current = setInterval(() => {
      setRestTimer(prev => prev ? { ...prev, remaining: prev.remaining - 1 } : null);
    }, 1000);
    return () => clearInterval(restIntervalRef.current);
  }, [restTimer?.remaining]);

  // ── Derived ──
  const flash = useCallback(m => { setToast(m); setTimeout(() => setToast(null), 3000); }, []);
  const mult = getStreakMultiplier(streak.count);
  const totalXP = useMemo(() => Object.values(prs).reduce((s, p) => s + (p.xp || 0), 0), [prs]);
  const lvl = getLevel(totalXP);
  const nxt = getNextLevel(totalXP);
  const progress = getLevelProgress(totalXP);
  const coachMsgs = useMemo(() => generateCoachMessages(prs, streak.count), [prs, streak.count]);
  const feed = useMemo(() => generateFakeFeed(), []);
  const prCount = Object.keys(prs).length;
  const filtered = EXERCISES.filter(e => (selCat === 'Tous' || e.c === selCat) && (!search || e.n.toLowerCase().includes(search.toLowerCase())));

  // Covered categories for achievements
  const coveredCats = useMemo(() => {
    const cats = new Set();
    Object.keys(prs).forEach(id => {
      const ex = EXERCISES.find(e => e.id === id);
      if (ex) cats.add(ex.b);
    });
    return cats.size;
  }, [prs]);

  // ── Check achievements helper ──
  const runAchievementCheck = useCallback((extraContext = {}) => {
    const context = {
      prCount: Object.keys(prs).length,
      coveredCats,
      streak: streak.count,
      prs,
      sessionCount: sessions.length,
      duelsWon: duels.filter(d => d.done).length,
      sharesCount,
      purchaseCount,
      premium: !!premium,
      ...extraContext,
    };
    const newAch = checkAchievements(context, unlockedAch);
    if (newAch.length > 0) {
      const ids = newAch.map(a => a.id);
      setUnlockedAch(prev => [...prev, ...ids]);
      newAch.forEach(a => flash(`🏆 Achievement débloqué : ${a.name} +${a.xp} XP`));
    }
  }, [prs, coveredCats, streak.count, sessions.length, duels, sharesCount, purchaseCount, premium, unlockedAch, flash]);

  // ── Save PR ──
  const savePR = () => {
    if (!selEx || !formW) return;
    const w = parseFloat(formW), r = parseInt(formR) || 1;
    if (isNaN(w) || w <= 0) return;
    const est = calc1RM(w, r), xp = calcXP(w, r, selEx.u, mult);
    const old = prs[selEx.id];
    const isNew = !old || est > (old.est || 0);
    const updatedPrs = {
      ...prs,
      [selEx.id]: {
        weight: isNew ? w : old.weight, reps: isNew ? r : old.reps,
        est: isNew ? est : old.est, xp: isNew ? xp : old.xp,
        date: isNew ? new Date().toISOString() : old.date,
        photo: isNew ? (photo || old?.photo) : old.photo,
        history: [...(old?.history || []), { w, r, est, date: new Date().toISOString() }],
      }
    };
    setPrs(updatedPrs);

    // Update missions
    if (isNew) {
      setMissions30(prev => ({ ...prev, prs: (prev.prs || 0) + 1 }));
    }

    // Challenges
    setChallenges(prev => prev.map(ch => {
      if (ch.done) return ch;
      if (ch.ex && ch.ex === selEx.id && isNew) return { ...ch, done: true, progress: 1 };
      if (ch.count && ch.badge && ch.badge === selEx.b) { const p = ch.progress + 1; return { ...ch, progress: p, done: p >= ch.count }; }
      if (ch.count && !ch.badge && !ch.ex) { const p = ch.progress + 1; return { ...ch, progress: p, done: p >= ch.count }; }
      return ch;
    }));

    // Daily quests
    if (isNew) {
      setDailyQuests(prev => ({
        ...prev,
        quests: prev.quests.map(q => {
          if (q.done) return q;
          if (q.type === 'new_pr') { const p = q.progress + 1; return { ...q, progress: p, done: p >= q.target }; }
          if (q.type === 'badge_pull' && selEx.b === 'PULL') { const p = q.progress + 1; return { ...q, progress: p, done: p >= q.target }; }
          if (q.type === 'badge_squat' && selEx.b === 'SQUAT') { const p = q.progress + 1; return { ...q, progress: p, done: p >= q.target }; }
          return q;
        }),
      }));
    }

    // Duels
    setDuels(prev => prev.map(d => d.exId === selEx.id && !d.done ? { ...d, myEst: est, done: est > d.targetEst } : d));

    if (isNew) {
      flash(`🏆 NOUVEAU PR ! ${selEx.n}: ${w}${selEx.u} × ${r} — +${xp} XP${mult > 1 ? ` (×${mult})` : ''}`);
      setCardData({ ex: selEx, weight: w, reps: r, est, date: new Date().toISOString(), photo });
      setSubView('card');
    } else {
      flash(`Enregistré (PR: ${old.weight}${selEx.u}×${old.reps})`);
      setSubView(null); setSelEx(null);
    }
    setFormW(''); setFormR('1'); setPhoto(null);

    setTimeout(() => runAchievementCheck({ prCount: Object.keys(updatedPrs).length }), 500);
  };

  // ── Duel ──
  const startDuel = (ex) => {
    const sc = generateFakeScores(ex.id);
    const opp = sc[Math.floor(Math.random() * Math.min(3, sc.length))];
    setDuels(prev => [...prev, {
      id: Date.now(), exId: ex.id, exName: ex.n, opponent: opp,
      targetEst: calc1RM(opp.w, opp.r), myEst: prs[ex.id]?.est || 0, done: false,
      created: new Date().toISOString(),
    }]);
    flash(`⚔️ Duel contre ${opp.name} sur ${ex.n} !`);
  };

  // ── Canvas ──
  useEffect(() => {
    if (subView === 'card' && cardData && canvasRef.current) {
      drawPRCard(canvasRef.current, { cardData, user, totalXP, selectedTpl, streak });
    }
  }, [subView, cardData, user, totalXP, selectedTpl, streak]);

  const handlePhoto = e => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = ev => setPhoto(ev.target.result); r.readAsDataURL(f);
  };

  // ── Profile photo handler (resize to 200×200 JPEG 70%) ──
  const handleProfilePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const canvas = document.createElement('canvas');
    const ctx2 = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      const size = 200;
      canvas.width = size; canvas.height = size;
      const scale = Math.max(size / img.width, size / img.height);
      const w = img.width * scale, h = img.height * scale;
      ctx2.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      setUser(prev => ({ ...prev, photoURL: dataUrl }));
    };
    img.src = URL.createObjectURL(file);
  };

  // ── Session helpers ──
  const startSession = () => {
    setActiveSession({ startTime: Date.now(), type: sessionType, exercises: [] });
    setSessionTimer(0);
  };

  const addExerciseToSession = (ex) => {
    setActiveSession(prev => ({
      ...prev,
      exercises: [...prev.exercises, { exId: ex.id, exName: ex.n, exUnit: ex.u, exBadge: ex.b, sets: [] }]
    }));
    setSessionPickEx(false);
  };

  const addSetToSession = (exIdx, w, r) => {
    const wNum = parseFloat(w), rNum = parseInt(r) || 1;
    if (!wNum || wNum <= 0) return;
    const est = calc1RM(wNum, rNum);
    const ex = EXERCISES.find(e => e.id === activeSession.exercises[exIdx].exId);
    // Check PR
    const oldPr = prs[activeSession.exercises[exIdx].exId];
    const isNewPr = !oldPr || est > (oldPr.est || 0);
    if (isNewPr && ex) {
      const xp = calcXP(wNum, rNum, ex.u, mult);
      const updPrs = {
        ...prs,
        [ex.id]: {
          weight: wNum, reps: rNum, est, xp,
          date: new Date().toISOString(),
          history: [...(oldPr?.history || []), { w: wNum, r: rNum, est, date: new Date().toISOString() }],
        }
      };
      setPrs(updPrs);
      flash(`🏆 NOUVEAU PR en séance ! ${ex.n}: ${wNum}${ex.u} × ${rNum}`);
    }
    setActiveSession(prev => {
      const exs = [...prev.exercises];
      exs[exIdx] = { ...exs[exIdx], sets: [...exs[exIdx].sets, { w: wNum, r: rNum, est, isNewPr }] };
      return { ...prev, exercises: exs };
    });
    setRestTimer({ total: 90, remaining: 90 });
  };

  const finishSession = () => {
    const duration = Math.floor(sessionTimer / 60);
    const prsBeat = activeSession.exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.isNewPr).length, 0);
    const xpEarned = Math.round((50 + activeSession.exercises.length * 10 + prsBeat * 25) * mult);
    const session = {
      id: Date.now(),
      type: activeSession.type,
      startTime: activeSession.startTime,
      duration,
      exercises: activeSession.exercises,
      note: sessionNote,
      rating: sessionRating,
      xp: xpEarned,
      prsBeat,
      date: new Date().toISOString(),
    };
    setSessions(prev => [session, ...prev]);
    setMissions30(prev => ({ ...prev, sessionCount: (prev.sessionCount || 0) + 1 }));
    setActiveSession(null);
    setSessionNote('');
    setSessionRating(0);
    setShowSessionRecap(false);
    flash(`✅ Séance terminée ! +${xpEarned} XP`);

    // Daily quest: session_count, session_finished
    setDailyQuests(prev => ({
      ...prev,
      quests: prev.quests.map(q => {
        if (q.done) return q;
        if (q.type === 'session_count' || q.type === 'session_finished') { const p = q.progress + 1; return { ...q, progress: p, done: p >= q.target }; }
        if (q.type === 'session_duration' && duration >= q.target) return { ...q, progress: 1, done: true };
        return q;
      }),
    }));

    setTimeout(() => runAchievementCheck({ sessionCount: sessions.length + 1 }), 500);
  };

  // ── Buy item helper ──
  const buyItem = (itemId, itemType, price, onOwn) => {
    const newCount = purchaseCount + 1;
    setPurchaseCount(newCount);
    onOwn();
    flash(`🎉 Acheté : ${itemId}`);
    setTimeout(() => runAchievementCheck({ purchaseCount: newCount }), 300);
  };

  // ── Share card ──
  const handleShare = async () => {
    await shareCardImage(canvasRef.current, cardData);
    const newCount = sharesCount + 1;
    setSharesCount(newCount);
    setTimeout(() => runAchievementCheck({ sharesCount: newCount }), 300);
  };

  // ── Claim daily reward ──
  const claimDailyReward = () => {
    const DAILY_REWARDS = [
      { day: 1, xp: 10 }, { day: 2, xp: 15 }, { day: 3, xp: 20 },
      { day: 4, xp: 30 }, { day: 5, xp: 50 }, { day: 6, xp: 75 }, { day: 7, xp: 100 },
    ];
    const nextDay = (dailyReward.day % 7) + 1;
    const reward = DAILY_REWARDS[nextDay - 1];
    const today = new Date().toDateString();
    setDailyReward({ day: nextDay, lastClaimed: today });
    // Add XP via a fake PR entry boost
    flash(`🎁 +${reward.xp} XP récompense quotidienne (Jour ${nextDay}/7) !`);
    setShowDailyReward(false);
  };

  // ── Timer format ──
  const fmtTimer = (secs) => {
    const m = Math.floor(secs / 60), s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // ── Coach summary ──
  const coachSummary = useMemo(() => {
    if (!user) return '';
    return generatePRSummary(prs, EXERCISES, user, lvl, streak, mult);
  }, [prs, user, lvl, streak, mult]);

  // ═══════ LOGIN ═══════
  if (!user) return (
    <div style={{ ...S.root, background: themeColors.bg }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '0 32px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%,-50%)', width: 350, height: 350, borderRadius: '50%', background: `radial-gradient(circle,${themeColors.accentLight} 0%,transparent 70%)`, pointerEvents: 'none' }} />
        <h1 style={{ color: themeColors.text, fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: 2 }}>GOAT FUEL</h1>
        <p style={{ color: themeColors.accent, fontSize: 12, letterSpacing: 4, margin: '6px 0 36px', textTransform: 'uppercase' }}>Feed the GOAT in you</p>
        <button onClick={() => { setUser({ name: '@axel', provider: 'google', av: '🔴' }); flash('✅ Connecté') }} style={{ ...S.authBtn, marginBottom: 12 }}>
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 019.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 000 24c0 3.77.87 7.34 2.44 10.51l8.09-5.92z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /></svg>
          Connexion Google
        </button>
        <button onClick={() => { setUser({ name: '@axel', provider: 'facebook', av: '🔵' }); flash('✅ Connecté') }} style={{ ...S.authBtn, background: '#1877F2', color: '#fff', border: 'none' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.33l-.53 3.49h-2.8v8.44C19.61 23.08 24 18.09 24 12.07z" /></svg>
          Connexion Facebook
        </button>
      </div>
    </div>
  );

  // ═══════ PAYWALL ═══════
  const Paywall = () => (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,.9)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ maxWidth: 400, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 48 }}>🏆</div>
          <h2 style={{ color: themeColors.gold, fontSize: 22, fontWeight: 900, margin: '8px 0 4px' }}>Passe Premium</h2>
          <p style={{ color: themeColors.textMuted, fontSize: 13 }}>Débloque tout le potentiel GOAT FUEL</p>
        </div>
        <div onClick={() => { setPremium('pro'); setShowPaywall(false); flash('🎉 Premium Pro !') }} style={{ background: `${themeColors.accent}12`, border: `2px solid ${themeColors.accent}44`, borderRadius: 16, padding: '18px 16px', marginBottom: 12, cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ color: themeColors.accent, fontWeight: 800, fontSize: 16 }}>⚡ Pro</span>
            <span style={{ color: themeColors.accent, fontWeight: 900, fontSize: 18 }}>4.99€<span style={{ fontSize: 11, fontWeight: 400 }}>/mois</span></span>
          </div>
          <div style={{ color: themeColors.textMuted, fontSize: 12, lineHeight: 1.6 }}>✅ 55 exercices · ✅ Cards sans watermark · ✅ Classement global · ✅ Analytics · ✅ Templates Gold & Neon</div>
        </div>
        <div onClick={() => { setPremium('elite'); setShowPaywall(false); flash('🎉 Premium Elite !') }} style={{ background: `linear-gradient(135deg,${themeColors.gold}10,${themeColors.accent}10)`, border: `2px solid ${themeColors.gold}66`, borderRadius: 16, padding: '18px 16px', marginBottom: 12, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -1, right: 16, background: themeColors.gold, color: '#000', padding: '2px 12px', borderRadius: '0 0 8px 8px', fontSize: 10, fontWeight: 800 }}>POPULAIRE</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ color: themeColors.gold, fontWeight: 800, fontSize: 16 }}>👑 Elite</span>
            <span style={{ color: themeColors.gold, fontWeight: 900, fontSize: 18 }}>9.99€<span style={{ fontSize: 11, fontWeight: 400 }}>/mois</span></span>
          </div>
          <div style={{ color: themeColors.textMuted, fontSize: 12, lineHeight: 1.6 }}>✅ Tout Pro + ✅ Coach IA · ✅ Duels illimités · ✅ Templates exclusifs · ✅ Badge Prestige</div>
        </div>
        <button onClick={() => setShowPaywall(false)} style={{ background: 'none', border: 'none', color: themeColors.textMuted, width: '100%', padding: 16, fontSize: 14, cursor: 'pointer' }}>Plus tard</button>
      </div>
    </div>
  );

  // ═══════ DAILY REWARD MODAL ═══════
  const DailyRewardModal = () => {
    const DAILY_REWARDS = [
      { day: 1, xp: 10, label: '+10 XP' }, { day: 2, xp: 15, label: '+15 XP' },
      { day: 3, xp: 20, label: '+20 XP' }, { day: 4, xp: 30, label: '+30 XP' },
      { day: 5, xp: 50, label: '+50 XP' }, { day: 6, xp: 75, label: '+75 XP' },
      { day: 7, xp: 100, label: '+100 XP 🎁' },
    ];
    const nextDay = (dailyReward.day % 7) + 1;
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div style={{ background: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: 20, padding: 24, maxWidth: 380, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎁</div>
          <h2 style={{ color: themeColors.text, fontWeight: 900, fontSize: 20, margin: '0 0 6px' }}>Récompense quotidienne</h2>
          <p style={{ color: themeColors.textMuted, fontSize: 12, marginBottom: 20 }}>Reviens chaque jour pour des bonus croissants !</p>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
            {DAILY_REWARDS.map(r => (
              <div key={r.day} style={{ width: 44, textAlign: 'center', padding: '8px 4px', borderRadius: 10, background: r.day === nextDay ? `${themeColors.accent}33` : r.day < nextDay ? `${themeColors.gold}15` : themeColors.surface, border: r.day === nextDay ? `2px solid ${themeColors.accent}` : `1px solid ${themeColors.border}` }}>
                <div style={{ fontSize: 9, color: themeColors.textMuted }}>J{r.day}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: r.day === nextDay ? themeColors.accent : r.day < nextDay ? themeColors.gold : themeColors.textDim }}>{r.xp}</div>
              </div>
            ))}
          </div>
          <button onClick={claimDailyReward} style={{ ...S.shareBtn, background: themeColors.accent }}>🎁 Récupérer +{DAILY_REWARDS[nextDay - 1].xp} XP</button>
          <button onClick={() => setShowDailyReward(false)} style={{ background: 'none', border: 'none', color: themeColors.textMuted, width: '100%', padding: '12px 0', fontSize: 13, cursor: 'pointer' }}>Plus tard</button>
        </div>
      </div>
    );
  };

  // ═══════ COACH MODAL ═══════
  const CoachModal = () => {
    const prompts = [
      { l: '📊 Analyse mes points faibles', p: 'Analyse mes points faibles et dis-moi quels muscles je néglige.' },
      { l: '📋 Programme push/pull/legs', p: 'Crée-moi un programme Push/Pull/Legs basé sur mes PRs.' },
      { l: '🎯 PRs à viser ce mois', p: 'Quels PRs devrais-je viser d\'améliorer ce mois ?' },
      { l: '⚖️ Ratio push/pull équilibré ?', p: 'Mon ratio push/pull est-il équilibré ? Que corriger ?' },
    ];
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 9997, background: 'rgba(0,0,0,.92)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', maxWidth: 480, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 16px 8px', borderBottom: `1px solid ${themeColors.border}` }}>
          <h2 style={{ color: themeColors.text, fontWeight: 900, fontSize: 18, margin: 0 }}>🧠 GOAT Coach</h2>
          <button onClick={() => setSub(null)} style={{ background: 'none', border: 'none', color: themeColors.textMuted, fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          <pre style={{ background: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: 12, padding: 14, fontSize: 11, color: themeColors.textMuted, whiteSpace: 'pre-wrap', fontFamily: 'monospace', maxHeight: 280, overflowY: 'auto', margin: '0 0 12px' }}>{coachSummary}</pre>
          <button onClick={() => { navigator.clipboard?.writeText(coachSummary); flash('✅ PRs copiés !') }} style={{ ...S.shareBtn, background: themeColors.surface, border: `1px solid ${themeColors.border}`, color: themeColors.text, marginBottom: 16 }}>📋 Copier mes PRs</button>
          <p style={{ color: themeColors.textMuted, fontSize: 11, marginBottom: 8 }}>Prompts rapides — colle dans Claude ou ChatGPT :</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {prompts.map((p, i) => (
              <button key={i} onClick={() => { navigator.clipboard?.writeText(coachSummary + '\n\n---\n\n' + p.p); flash('✅ Copié ! Colle dans Claude ou ChatGPT') }} style={{ background: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: 10, padding: '10px 14px', color: themeColors.text, fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>{p.l}</button>
            ))}
          </div>
          <p style={{ color: themeColors.textMuted, fontSize: 11, marginBottom: 8 }}>Messages du coach :</p>
          {coachMsgs.map((m, i) => (
            <div key={i} style={{ background: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: 10, padding: '10px 12px', marginBottom: 6, display: 'flex', gap: 8 }}>
              <span style={{ fontSize: 18 }}>{m.icon}</span>
              <div><div style={{ color: themeColors.text, fontWeight: 700, fontSize: 12 }}>{m.t}</div><div style={{ color: themeColors.textMuted, fontSize: 11 }}>{m.d}</div></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ═══════ CARD VIEW ═══════
  if (subView === 'card' && cardData) return (
    <div style={{ ...S.root, background: themeColors.bg }}>
      {toast && <div style={S.toast}>{toast}</div>}
      <div style={{ padding: 16, textAlign: 'center' }}>
        <p style={{ color: themeColors.textDim, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Aperçu carte PR</p>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
          {CARD_TEMPLATES.map(t => {
            const owned = t.free || ownedTemplates.includes(t.id) || premium === 'elite' || (premium === 'pro' && t.tier === 'pro');
            return (
              <button key={t.id} onClick={() => owned ? setSelectedTpl(t.id) : setShowPaywall(true)} style={{ padding: '6px 12px', borderRadius: 10, fontSize: 10, fontWeight: 700, cursor: 'pointer', background: selectedTpl === t.id ? t.border + '33' : 'rgba(255,255,255,0.04)', border: `1px solid ${selectedTpl === t.id ? t.border : 'rgba(255,255,255,0.06)'}`, color: selectedTpl === t.id ? t.border : owned ? '#aaa' : '#444', opacity: owned ? 1 : 0.5 }}>
                {t.name}{!owned && ' 🔒'}
              </button>
            );
          })}
        </div>
        <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: '52vh', borderRadius: 16, border: `2px solid ${themeColors.accent}33` }} />
        <label style={S.photoBtn}>📸 Ajouter ma photo<input type="file" accept="image/*" capture="environment" onChange={e => { handlePhoto(e); setTimeout(() => setCardData(p => ({ ...p })), 500) }} style={{ display: 'none' }} /></label>
        <button onClick={handleShare} style={{ ...S.shareBtn, background: themeColors.accent }}>📦 Partager ma PR</button>
        {AFFILIATES[cardData.ex.b] && (
          <div style={{ marginTop: 16, textAlign: 'left' }}>
            <p style={{ color: themeColors.textMuted, fontSize: 11, marginBottom: 8 }}>💡 Recommandé pour toi</p>
            {AFFILIATES[cardData.ex.b].slice(0, 1).map((a, i) => (
              <a key={i} href={a.link} target="_blank" rel="noopener" style={{ textDecoration: 'none', display: 'flex', background: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: 12, padding: '12px 14px', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>{a.img}</span>
                <div style={{ flex: 1 }}><div style={{ color: themeColors.text, fontSize: 13, fontWeight: 600 }}>{a.name}</div><div style={{ color: themeColors.textMuted, fontSize: 11 }}>{a.brand} · {a.price}</div></div>
                <span style={{ color: themeColors.accent, fontSize: 11, fontWeight: 700 }}>Voir →</span>
              </a>
            ))}
          </div>
        )}
        <button onClick={() => { setSubView(null); setCardData(null) }} style={{ background: 'none', border: 'none', color: themeColors.accent, fontSize: 14, cursor: 'pointer', marginTop: 16, fontWeight: 600 }}>Fermer</button>
      </div>
      {showPaywall && <Paywall />}
    </div>
  );

  // ═══════ ADD PR ═══════
  if (subView === 'add' && selEx) return (
    <div style={{ ...S.root, background: themeColors.bg }}>
      {toast && <div style={S.toast}>{toast}</div>}
      <div style={{ padding: '20px 16px' }}>
        <button onClick={() => { setSubView(null); setSelEx(null) }} style={{ ...S.backBtn, color: themeColors.accent }}>← Retour</button>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 16, background: BADGE_COLORS[selEx.b] + '22', border: `1px solid ${BADGE_COLORS[selEx.b]}44`, color: BADGE_COLORS[selEx.b], fontSize: 11, fontWeight: 700, marginBottom: 10 }}>🏋️ {selEx.b}</div>
          <h2 style={{ color: themeColors.text, fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>{selEx.n}</h2>
          {prs[selEx.id] && (
            <div style={{ background: `${themeColors.accent}12`, border: `1px solid ${themeColors.accent}33`, borderRadius: 12, padding: '10px 16px', marginTop: 12 }}>
              <span style={{ color: themeColors.accent, fontWeight: 800, fontSize: 15 }}>PR: {prs[selEx.id].weight}{selEx.u} × {prs[selEx.id].reps}</span>
              <span style={{ color: themeColors.textMuted, fontSize: 11, marginLeft: 8 }}>~{prs[selEx.id].est} 1RM</span>
            </div>
          )}
          {mult > 1 && <div style={{ marginTop: 10, padding: '6px 14px', borderRadius: 10, background: `${themeColors.accent}15`, display: 'inline-block' }}><span style={{ color: themeColors.accent, fontSize: 12, fontWeight: 700 }}>🔥 Streak {streak.count}j — ×{mult} XP</span></div>}
        </div>
        <div style={{ marginTop: 24 }}>
          <label style={S.label}>{selEx.u === 'reps' ? 'Reps' : selEx.u === 'sec' || selEx.u === 'min' ? `Temps (${selEx.u})` : 'Poids (kg)'}</label>
          <input type="number" value={formW} onChange={e => setFormW(e.target.value)} style={S.input} autoFocus />
          {selEx.u === 'kg' && (<><label style={S.label}>Reps</label><input type="number" value={formR} onChange={e => setFormR(e.target.value)} style={S.input} /></>)}
          {selEx.u === 'kg' && formW && <div style={{ color: themeColors.textMuted, fontSize: 13, textAlign: 'center', marginTop: 8 }}>~{calc1RM(parseFloat(formW) || 0, parseInt(formR) || 1)} kg 1RM · +{calcXP(parseFloat(formW) || 0, parseInt(formR) || 1, selEx.u, mult)} XP</div>}
          <label style={S.photoBtn}>📸 Photo<input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{ display: 'none' }} /></label>
          {photo && <div style={{ color: theme.success, fontSize: 11, textAlign: 'center' }}>✅ Photo ajoutée</div>}
          <button onClick={savePR} style={{ ...S.shareBtn, background: themeColors.accent }}>🔥 Enregistrer le PR</button>
        </div>
      </div>
    </div>
  );

  // ═══════ EXERCISE RANKING ═══════
  if (subView === 'exRank' && rankEx) {
    const sc = generateFakeScores(rankEx.id);
    const my = prs[rankEx.id];
    const all = my ? [...sc, { name: user.name, lvl: lvl.l, pres: lvl.n, av: user.av, w: my.weight, r: my.reps }].sort((a, b) => calc1RM(b.w, b.r) - calc1RM(a.w, a.r)) : sc;
    return (
      <div style={{ ...S.root, background: themeColors.bg }}>
        <div style={{ padding: 16 }}>
          <button onClick={() => { setSubView(null); setRankEx(null) }} style={{ ...S.backBtn, color: themeColors.accent }}>← Retour</button>
          <h2 style={{ color: themeColors.text, fontSize: 18, fontWeight: 800, marginTop: 14 }}>🏆 {rankEx.n}</h2>
          <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 14, background: BADGE_COLORS[rankEx.b] + '22', color: BADGE_COLORS[rankEx.b], fontSize: 10, fontWeight: 700, marginBottom: 14 }}>{rankEx.b}</div>
          {all.map((e, i) => {
            const me = e.name === user.name;
            return (
              <div key={i} style={{ background: me ? `${themeColors.accent}12` : themeColors.surface, border: me ? `1px solid ${themeColors.accent}44` : `1px solid ${themeColors.border}`, borderRadius: 14, padding: '12px 14px', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, background: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'rgba(255,255,255,0.06)', color: i < 3 ? '#000' : themeColors.textMuted }}>{i + 1}</span>
                  <div>
                    {me ? <Avatar user={user} size={24} frame={equippedFrameObj} /> : <span style={{ fontSize: 18 }}>{e.av}</span>}
                    <div style={{ color: me ? themeColors.accent : themeColors.text, fontWeight: 700, fontSize: 13 }}>{e.name}</div>
                    <div style={{ color: themeColors.textDim, fontSize: 10 }}>LVL {e.lvl} · {e.pres}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}><div style={{ color: themeColors.text, fontWeight: 800, fontSize: 14 }}>{e.w}kg × {e.r}</div><div style={{ color: themeColors.textMuted, fontSize: 10 }}>~{calc1RM(e.w, e.r)} 1RM</div></div>
              </div>
            );
          })}
        </div>
        <div style={{ height: 90 }} />
      </div>
    );
  }

  // ═══════ SESSION DETAIL ═══════
  if (sessionDetail) return (
    <div style={{ ...S.root, background: themeColors.bg }}>
      <div style={{ padding: 16 }}>
        <button onClick={() => setSessionDetail(null)} style={{ ...S.backBtn, color: themeColors.accent }}>← Retour</button>
        <h2 style={{ color: themeColors.text, fontSize: 18, fontWeight: 800, marginTop: 14 }}>💪 {sessionDetail.type}</h2>
        <div style={{ color: themeColors.textMuted, fontSize: 12, marginBottom: 16 }}>{formatDate(sessionDetail.date)} · {sessionDetail.duration}min · +{sessionDetail.xp} XP</div>
        {sessionDetail.exercises.map((ex, i) => (
          <div key={i} style={{ background: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: 12, padding: '12px 14px', marginBottom: 8 }}>
            <div style={{ color: themeColors.text, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{ex.exName}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {ex.sets.map((s, j) => (
                <span key={j} style={{ background: s.isNewPr ? `${themeColors.accent}22` : 'rgba(255,255,255,0.06)', border: `1px solid ${s.isNewPr ? themeColors.accent : themeColors.border}33`, borderRadius: 6, padding: '3px 8px', fontSize: 11, color: s.isNewPr ? themeColors.accent : themeColors.textMuted }}>
                  {s.w}×{s.r}{s.isNewPr ? ' 🏆' : ''}
                </span>
              ))}
            </div>
          </div>
        ))}
        {sessionDetail.note && <div style={{ background: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: 12, padding: '12px 14px' }}><div style={{ color: themeColors.textMuted, fontSize: 11, marginBottom: 4 }}>Note</div><div style={{ color: themeColors.text, fontSize: 13 }}>{sessionDetail.note}</div></div>}
      </div>
      <div style={{ height: 90 }} />
    </div>
  );

  // ═══════ MAIN ═══════
  return (
    <div style={{ ...S.root, background: themeColors.bg }}>
      {toast && <div style={S.toast}>{toast}</div>}
      {showPaywall && <Paywall />}
      {showDailyReward && <DailyRewardModal />}
      {sub === 'coach' && <CoachModal />}

      {/* ── HOME ── */}
      {page === 'home' && (
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar user={user} size={32} frame={equippedFrameObj} />
              <div>
                <div style={{ color: themeColors.text, fontWeight: 800, fontSize: 15 }}>{user.name}</div>
                <div style={{ color: lvl.c, fontSize: 11, fontWeight: 600 }}>⚡ LVL {lvl.l} · {lvl.n}</div>
              </div>
            </div>
            {!premium && <button onClick={() => setShowPaywall(true)} style={{ background: 'linear-gradient(135deg,#FFD700,#FF6B35)', border: 'none', borderRadius: 10, padding: '6px 12px', color: '#000', fontWeight: 800, fontSize: 11, cursor: 'pointer' }}>👑 Premium</button>}
          </div>
          {/* XP bar */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}><span style={{ color: themeColors.textMuted, fontSize: 10 }}>{totalXP} XP</span><span style={{ color: themeColors.textMuted, fontSize: 10 }}>{nxt ? `${nxt.xp} XP` : 'MAX'}</span></div>
            <div style={{ background: themeColors.border, borderRadius: 6, height: 6, overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: `linear-gradient(90deg,${themeColors.accent},${lvl.c})`, borderRadius: 6, transition: 'width .5s' }} />
            </div>
          </div>
          {/* Streak */}
          {streak.count >= 1 && (
            <div style={{ background: `linear-gradient(135deg,${themeColors.accent}20,${themeColors.accent}10)`, border: `1px solid ${themeColors.accent}33`, borderRadius: 14, padding: '14px 16px', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div><div style={{ color: themeColors.accent, fontWeight: 900, fontSize: 18 }}>🔥 {streak.count}J STREAK</div><div style={{ color: themeColors.textMuted, fontSize: 11, marginTop: 2 }}>Multiplicateur ×{mult} XP</div></div>
              <div style={{ color: themeColors.accent, fontSize: 28, fontWeight: 900 }}>×{mult}</div>
            </div>
          )}
          {/* Daily quests */}
          <h3 style={{ color: themeColors.gold, fontSize: 14, fontWeight: 700, margin: '12px 0 8px' }}>⚡ Quêtes du jour</h3>
          {dailyQuests.quests.map((q, i) => (
            <div key={i} style={{ background: q.done ? `${theme.success}0A` : themeColors.surface, border: q.done ? `1px solid ${theme.success}33` : `1px solid ${themeColors.border}`, borderRadius: 10, padding: '10px 12px', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: q.done ? theme.success : themeColors.text, fontWeight: 700, fontSize: 12 }}>{q.t}</div>
              <span style={{ color: q.done ? theme.success : themeColors.gold, fontSize: 11, fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>+{q.xp} XP{q.done ? ' ✅' : ''}</span>
            </div>
          ))}
          {/* 30-day missions */}
          <h3 style={{ color: themeColors.gold, fontSize: 14, fontWeight: 700, margin: '14px 0 8px' }}>🎯 Missions 30 jours</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            {[
              { l: 'PRs', cur: missions30.prs, target: 30, icon: '🏆' },
              { l: 'Streak', cur: streak.count, target: 30, icon: '🔥' },
              { l: 'Séances', cur: missions30.sessionCount, target: 50, icon: '💪' },
            ].map(m => {
              const p = Math.min((m.cur / m.target) * 100, 100);
              return (
                <div key={m.l} style={{ background: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{m.icon}</div>
                  <svg width="44" height="44" viewBox="0 0 44 44" style={{ display: 'block', margin: '0 auto 4px' }}>
                    <circle cx="22" cy="22" r="18" fill="none" stroke={themeColors.border} strokeWidth="4" />
                    <circle cx="22" cy="22" r="18" fill="none" stroke={themeColors.accent} strokeWidth="4" strokeDasharray={`${2 * Math.PI * 18}`} strokeDashoffset={`${2 * Math.PI * 18 * (1 - p / 100)}`} strokeLinecap="round" transform="rotate(-90 22 22)" />
                  </svg>
                  <div style={{ color: themeColors.text, fontWeight: 800, fontSize: 12 }}>{m.cur}/{m.target}</div>
                  <div style={{ color: themeColors.textMuted, fontSize: 9 }}>{m.l}</div>
                </div>
              );
            })}
          </div>
          {/* Coach messages */}
          {coachMsgs.slice(0, 2).map((m, i) => (
            <div key={i} style={{ background: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: 12, padding: '12px 14px', marginBottom: 6, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{m.icon}</span>
              <div><div style={{ color: themeColors.text, fontWeight: 700, fontSize: 13 }}>{m.t}</div><div style={{ color: themeColors.textMuted, fontSize: 11, marginTop: 2 }}>{m.d}</div></div>
            </div>
          ))}
          {/* Challenges */}
          <h3 style={{ color: themeColors.gold, fontSize: 14, fontWeight: 700, margin: '12px 0 8px' }}>🎯 Défis de la semaine</h3>
          {challenges.map((ch, i) => (
            <div key={i} style={{ background: ch.done ? `${theme.success}0A` : themeColors.surface, border: ch.done ? `1px solid ${theme.success}33` : `1px solid ${themeColors.border}`, borderRadius: 12, padding: '12px 14px', marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: ch.done ? theme.success : themeColors.text, fontWeight: 700, fontSize: 13 }}>{ch.t}</div>
                <span style={{ color: ch.done ? theme.success : themeColors.gold, fontSize: 12, fontWeight: 700 }}>+{ch.xp} XP</span>
              </div>
              <div style={{ color: themeColors.textMuted, fontSize: 11, marginTop: 3 }}>{ch.d}</div>
              {ch.count && !ch.done && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ background: themeColors.border, borderRadius: 4, height: 4, overflow: 'hidden' }}><div style={{ width: `${(ch.progress / ch.count) * 100}%`, height: '100%', background: themeColors.accent, borderRadius: 4 }} /></div>
                  <div style={{ color: themeColors.textDim, fontSize: 10, marginTop: 2 }}>{ch.progress}/{ch.count}</div>
                </div>
              )}
              {ch.done && <div style={{ color: theme.success, fontSize: 11, fontWeight: 700, marginTop: 4 }}>✅ Complété !</div>}
            </div>
          ))}
          {/* Social shortcut */}
          <button onClick={() => setPage('social')} style={{ width: '100%', marginTop: 8, marginBottom: 4, padding: '12px 0', borderRadius: 12, background: themeColors.surface, border: `1px solid ${themeColors.border}`, color: themeColors.text, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>💬 Voir le feed social</button>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, margin: '12px 0' }}>
            {[{ l: 'PRs', v: prCount, i: '⚡' }, { l: 'XP', v: totalXP, i: '🏆' }, { l: 'Streak', v: `${streak.count}j`, i: '🔥' }].map(s => (
              <div key={s.l} style={{ background: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: 12, padding: '14px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>{s.i}</div><div style={{ color: themeColors.text, fontWeight: 800, fontSize: 20, marginTop: 4 }}>{s.v}</div><div style={{ color: themeColors.textDim, fontSize: 10 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PRs ── */}
      {page === 'prs' && (
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0 8px' }}>
            <h2 style={{ color: themeColors.text, fontSize: 20, fontWeight: 800, margin: 0 }}>📸 PRs</h2>
            <span style={{ color: themeColors.textMuted, fontSize: 12 }}>{prCount} PRs</span>
          </div>
          <div style={S.tabs}>
            <button onClick={() => setTab2('list')} style={tab2 === 'list' ? { ...S.tabActive, color: themeColors.accent, borderBottomColor: themeColors.accent } : { ...S.tabInactive, color: themeColors.textDim }}>Mes PRs</button>
            <button onClick={() => setTab2('classement')} style={tab2 === 'classement' ? { ...S.tabActive, color: themeColors.accent, borderBottomColor: themeColors.accent } : { ...S.tabInactive, color: themeColors.textDim }}>🏆 Classement</button>
          </div>
          {tab2 === 'list' && (
            <>
              <h3 style={{ color: themeColors.gold, fontSize: 14, fontWeight: 700, margin: '12px 0 8px' }}>🏆 Mes records</h3>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." style={{ ...S.searchInput, background: themeColors.surface, border: `1px solid ${themeColors.border}`, color: themeColors.text }} />
              <div style={{ display: 'flex', gap: 5, overflowX: 'auto', paddingBottom: 8 }}>
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setSelCat(c)} style={{ padding: '5px 12px', borderRadius: 16, fontSize: 10, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, background: selCat === c ? themeColors.accent : 'rgba(255,255,255,0.04)', color: selCat === c ? '#fff' : themeColors.textMuted, border: selCat === c ? `1px solid ${themeColors.accent}` : `1px solid ${themeColors.border}` }}>{c}</button>
                ))}
              </div>
              {filtered.map(ex => {
                const pr = prs[ex.id]; const bc = BADGE_COLORS[ex.b];
                return (
                  <div key={ex.id} style={{ background: pr ? `${themeColors.accent}08` : themeColors.surface, border: pr ? `1px solid ${themeColors.accent}22` : `1px solid ${themeColors.border}`, borderRadius: 12, padding: '12px 14px', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1, cursor: pr ? 'pointer' : 'default' }} onClick={() => { if (pr) { setCardData({ ex, weight: pr.weight, reps: pr.reps, est: pr.est, date: pr.date, photo: pr.photo }); setSubView('card') } }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: themeColors.text, fontWeight: 700, fontSize: 13 }}>{ex.n}</span>
                        <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 6, background: bc + '22', color: bc }}>{ex.b}</span>
                      </div>
                      {pr ? <div style={{ color: themeColors.accent, fontSize: 12, fontWeight: 700, marginTop: 2 }}>{pr.weight}{ex.u}×{pr.reps} <span style={{ color: themeColors.textDim, fontWeight: 400, fontSize: 10 }}>~{pr.est} 1RM</span></div> : <div style={{ color: themeColors.textDim, fontSize: 10, marginTop: 2 }}>—</div>}
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => { setRankEx(ex); setSubView('exRank') }} style={{ ...S.miniBtn, background: `${themeColors.gold}12`, color: themeColors.gold, border: `1px solid ${themeColors.gold}33` }}>🏆</button>
                      <button onClick={() => { setSelEx(ex); setFormW(''); setFormR('1'); setPhoto(null); setSubView('add') }} style={{ ...S.miniBtn, background: themeColors.accent, color: '#fff' }}>+</button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
          {tab2 === 'classement' && (
            <>
              <h3 style={{ color: themeColors.gold, fontSize: 14, fontWeight: 700, margin: '12px 0 6px' }}>🏆 Classement par exercice</h3>
              {prCount === 0 ? <div style={{ textAlign: 'center', padding: 40, color: themeColors.textDim }}><div style={{ fontSize: 40 }}>🏅</div><div style={{ fontSize: 13, marginTop: 8 }}>Enregistre ton premier PR</div></div>
                : EXERCISES.filter(e => prs[e.id]).map(ex => {
                  const pr = prs[ex.id], sc = generateFakeScores(ex.id), myR = sc.filter(s => calc1RM(s.w, s.r) > pr.est).length + 1;
                  return (
                    <div key={ex.id} onClick={() => { setRankEx(ex); setSubView('exRank') }} style={{ background: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: 12, padding: '12px 14px', marginBottom: 6, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ color: themeColors.text, fontWeight: 700, fontSize: 13 }}>{ex.n}</span>
                        <span style={{ fontSize: 8, padding: '2px 6px', borderRadius: 6, background: BADGE_COLORS[ex.b] + '22', color: BADGE_COLORS[ex.b], fontWeight: 700, marginLeft: 6 }}>{ex.b}</span>
                        <div style={{ color: themeColors.accent, fontSize: 12, fontWeight: 700, marginTop: 3 }}>{pr.weight}kg×{pr.reps} <span style={{ color: themeColors.textDim, fontSize: 10, fontWeight: 400 }}>~{pr.est}</span></div>
                      </div>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: myR <= 3 ? `${themeColors.gold}22` : 'rgba(255,255,255,0.04)', border: myR <= 3 ? `1px solid ${themeColors.gold}44` : `1px solid ${themeColors.border}`, color: myR <= 3 ? themeColors.gold : themeColors.textMuted, fontWeight: 900, fontSize: 13 }}>#{myR}</div>
                    </div>
                  );
                })}
            </>
          )}
        </div>
      )}

      {/* ── MOTION (Sessions) ── */}
      {page === 'motion' && (
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0 8px' }}>
            <h2 style={{ color: themeColors.text, fontSize: 20, fontWeight: 800, margin: 0 }}>💪 Motion</h2>
            {activeSession && <span style={{ color: themeColors.accent, fontWeight: 800, fontSize: 18 }}>⏱ {fmtTimer(sessionTimer)}</span>}
          </div>
          <div style={S.tabs}>
            <button onClick={() => setMotionTab('seance')} style={motionTab === 'seance' ? { ...S.tabActive, color: themeColors.accent, borderBottomColor: themeColors.accent } : { ...S.tabInactive, color: themeColors.textDim }}>⚡ Séance</button>
            <button onClick={() => setMotionTab('historique')} style={motionTab === 'historique' ? { ...S.tabActive, color: themeColors.accent, borderBottomColor: themeColors.accent } : { ...S.tabInactive, color: themeColors.textDim }}>📋 Historique</button>
          </div>

          {motionTab === 'seance' && !activeSession && !sessionPickEx && (
            <div style={{ paddingTop: 20 }}>
              <p style={{ color: themeColors.textMuted, fontSize: 13, marginBottom: 12 }}>Type de séance :</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {['Push', 'Pull', 'Squat', 'Full', 'Cardio', 'Libre'].map(t => (
                  <button key={t} onClick={() => setSessionType(t)} style={{ padding: '8px 16px', borderRadius: 16, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: sessionType === t ? themeColors.accent : themeColors.surface, color: sessionType === t ? '#fff' : themeColors.textMuted, border: `1px solid ${sessionType === t ? themeColors.accent : themeColors.border}` }}>{t}</button>
                ))}
              </div>
              <button onClick={startSession} style={{ ...S.shareBtn, background: `linear-gradient(135deg,${themeColors.accent},#FF8F00)` }}>🔥 Démarrer la séance</button>
            </div>
          )}

          {motionTab === 'seance' && activeSession && !sessionPickEx && !showSessionRecap && (
            <div style={{ paddingTop: 12 }}>
              {/* Rest timer */}
              {restTimer && (
                <div style={{ background: `${themeColors.accent}15`, border: `1px solid ${themeColors.accent}33`, borderRadius: 14, padding: '14px 16px', marginBottom: 12, textAlign: 'center' }}>
                  <div style={{ color: themeColors.textMuted, fontSize: 11, marginBottom: 6 }}>⏱ Repos</div>
                  <svg width="60" height="60" viewBox="0 0 60 60" style={{ display: 'block', margin: '0 auto 8px' }}>
                    <circle cx="30" cy="30" r="25" fill="none" stroke={themeColors.border} strokeWidth="4" />
                    <circle cx="30" cy="30" r="25" fill="none" stroke={themeColors.accent} strokeWidth="4" strokeDasharray={`${2 * Math.PI * 25}`} strokeDashoffset={`${2 * Math.PI * 25 * (1 - restTimer.remaining / restTimer.total)}`} strokeLinecap="round" transform="rotate(-90 30 30)" />
                    <text x="30" y="35" textAnchor="middle" fill={themeColors.text} fontSize="14" fontWeight="800">{restTimer.remaining}s</text>
                  </svg>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {[60, 90, 120, 180].map(s => <button key={s} onClick={() => setRestTimer({ total: s, remaining: s })} style={{ padding: '4px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, cursor: 'pointer', background: themeColors.surface, border: `1px solid ${themeColors.border}`, color: themeColors.textMuted }}>{s}s</button>)}
                    <button onClick={() => setRestTimer(null)} style={{ padding: '4px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, cursor: 'pointer', background: themeColors.accent, border: 'none', color: '#fff' }}>Skip</button>
                  </div>
                </div>
              )}

              {/* Exercise list */}
              {activeSession.exercises.map((ex, exIdx) => {
                const [setW, setSetW] = [null, null]; // handled inline
                return (
                  <SessionExercise
                    key={exIdx}
                    ex={ex}
                    exIdx={exIdx}
                    themeColors={themeColors}
                    onAddSet={(w, r) => addSetToSession(exIdx, w, r)}
                  />
                );
              })}

              <button onClick={() => setSessionPickEx(true)} style={{ ...S.shareBtn, background: themeColors.surface, border: `1px solid ${themeColors.border}`, color: themeColors.text, marginBottom: 8 }}>+ Exercice</button>
              <button onClick={() => setShowSessionRecap(true)} style={{ ...S.shareBtn, background: `linear-gradient(135deg,${theme.success},#00C853)` }}>✅ Terminer la séance</button>
            </div>
          )}

          {motionTab === 'seance' && sessionPickEx && (
            <div style={{ paddingTop: 12 }}>
              <button onClick={() => setSessionPickEx(false)} style={{ ...S.backBtn, color: themeColors.accent, marginBottom: 12 }}>← Annuler</button>
              <input placeholder="Rechercher..." style={{ ...S.searchInput, background: themeColors.surface, border: `1px solid ${themeColors.border}`, color: themeColors.text }} onChange={e => setSearch(e.target.value)} value={search} />
              <div style={{ display: 'flex', gap: 5, overflowX: 'auto', paddingBottom: 8 }}>
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setSelCat(c)} style={{ padding: '5px 12px', borderRadius: 16, fontSize: 10, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, background: selCat === c ? themeColors.accent : 'rgba(255,255,255,0.04)', color: selCat === c ? '#fff' : themeColors.textMuted, border: selCat === c ? `1px solid ${themeColors.accent}` : `1px solid ${themeColors.border}` }}>{c}</button>
                ))}
              </div>
              {filtered.map(ex => (
                <div key={ex.id} onClick={() => addExerciseToSession(ex)} style={{ background: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: 12, padding: '12px 14px', marginBottom: 6, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ color: themeColors.text, fontWeight: 700, fontSize: 13 }}>{ex.n}</span>
                    <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 6, background: BADGE_COLORS[ex.b] + '22', color: BADGE_COLORS[ex.b], marginLeft: 6 }}>{ex.b}</span>
                  </div>
                  <span style={{ color: themeColors.accent, fontSize: 18 }}>+</span>
                </div>
              ))}
            </div>
          )}

          {motionTab === 'seance' && showSessionRecap && (
            <div style={{ paddingTop: 12 }}>
              <h3 style={{ color: themeColors.text, fontWeight: 800, fontSize: 16, marginBottom: 12 }}>✅ Récapitulatif</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                {[
                  { l: 'Durée', v: `${fmtTimer(sessionTimer)}` },
                  { l: 'Exercices', v: activeSession.exercises.length },
                  { l: 'PRs battus', v: activeSession.exercises.reduce((a, ex) => a + ex.sets.filter(s => s.isNewPr).length, 0) },
                  { l: 'XP', v: `+${Math.round((50 + activeSession.exercises.length * 10 + activeSession.exercises.reduce((a, ex) => a + ex.sets.filter(s => s.isNewPr).length, 0) * 25) * mult)}` },
                ].map(s => (
                  <div key={s.l} style={{ background: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
                    <div style={{ color: themeColors.text, fontWeight: 800, fontSize: 16 }}>{s.v}</div>
                    <div style={{ color: themeColors.textMuted, fontSize: 10 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <label style={S.label}>Note</label>
              <textarea value={sessionNote} onChange={e => setSessionNote(e.target.value)} style={{ width: '100%', background: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: 10, padding: 10, color: themeColors.text, fontSize: 13, minHeight: 70, outline: 'none', resize: 'none', boxSizing: 'border-box' }} placeholder="Séance de folie..." />
              <label style={S.label}>Rating</label>
              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setSessionRating(s)} style={{ fontSize: 24, background: 'none', border: 'none', cursor: 'pointer', opacity: s <= sessionRating ? 1 : 0.3 }}>⭐</button>
                ))}
              </div>
              <button onClick={finishSession} style={{ ...S.shareBtn, background: `linear-gradient(135deg,${themeColors.accent},#FF8F00)` }}>💾 Enregistrer</button>
              <button onClick={() => setShowSessionRecap(false)} style={{ background: 'none', border: 'none', color: themeColors.textMuted, width: '100%', padding: '10px 0', fontSize: 13, cursor: 'pointer' }}>← Retour</button>
            </div>
          )}

          {motionTab === 'historique' && (
            sessions.length === 0
              ? <div style={{ textAlign: 'center', padding: 40, color: themeColors.textDim }}><div style={{ fontSize: 40 }}>💪</div><div style={{ fontSize: 13, marginTop: 8 }}>Aucune séance enregistrée</div></div>
              : sessions.map((s, i) => (
                <div key={i} onClick={() => setSessionDetail(s)} style={{ background: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: 12, padding: '12px 14px', marginBottom: 8, marginTop: i === 0 ? 10 : 0, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ background: `${themeColors.accent}22`, border: `1px solid ${themeColors.accent}44`, borderRadius: 8, padding: '2px 8px', color: themeColors.accent, fontSize: 10, fontWeight: 700 }}>{s.type}</span>
                    <span style={{ color: themeColors.textMuted, fontSize: 10 }}>{formatDate(s.date)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: themeColors.text, fontSize: 13, fontWeight: 600 }}>{s.exercises.length} exercices · {s.duration}min</div>
                    <div style={{ color: themeColors.gold, fontSize: 12, fontWeight: 700 }}>+{s.xp} XP</div>
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* ── SOCIAL ── */}
      {page === 'social' && (
        <div style={{ padding: '0 16px' }}>
          <h2 style={{ color: themeColors.text, fontSize: 20, fontWeight: 800, padding: '16px 0 8px', margin: 0 }}>💬 Social</h2>
          <div style={S.tabs}>
            <button onClick={() => setSocialTab('feed')} style={socialTab === 'feed' ? { ...S.tabActive, color: themeColors.accent, borderBottomColor: themeColors.accent } : { ...S.tabInactive, color: themeColors.textDim }}>🔥 Feed</button>
            <button onClick={() => setSocialTab('duels')} style={socialTab === 'duels' ? { ...S.tabActive, color: themeColors.accent, borderBottomColor: themeColors.accent } : { ...S.tabInactive, color: themeColors.textDim }}>⚔️ Duels</button>
          </div>
          {socialTab === 'feed' && feed.map((f, i) => (
            <div key={i} style={{ background: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: 12, padding: '12px 14px', marginBottom: 6, marginTop: i === 0 ? 10 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 20 }}>{f.user.av}</span>
                <span style={{ color: themeColors.text, fontWeight: 700, fontSize: 13 }}>{f.user.name}</span>
                <span style={{ color: themeColors.textDim, fontSize: 10, marginLeft: 'auto' }}>{timeAgo(f.time)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ color: themeColors.accent, fontWeight: 700, fontSize: 13 }}>🏆 {f.ex.n}</span>
                  <div style={{ color: themeColors.textMuted, fontSize: 12, marginTop: 2 }}>{f.weight}kg × {f.reps} <span style={{ color: themeColors.textDim }}>~{calc1RM(f.weight, f.reps)} 1RM</span></div>
                </div>
                <button onClick={() => { if (!premium && duels.length >= 2) { setShowPaywall(true); return } startDuel(f.ex) }} style={{ background: `${themeColors.accent}22`, border: `1px solid ${themeColors.accent}44`, borderRadius: 10, padding: '6px 12px', color: themeColors.accent, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>⚔️ Défier</button>
              </div>
            </div>
          ))}
          {socialTab === 'duels' && (
            duels.length === 0 ? <div style={{ textAlign: 'center', padding: 30, color: themeColors.textDim }}><div style={{ fontSize: 36 }}>⚔️</div><div style={{ fontSize: 13, marginTop: 8 }}>Lance un duel depuis le feed !</div></div>
              : duels.map((d, i) => (
                <div key={i} style={{ background: d.done ? `${theme.success}08` : themeColors.surface, border: d.done ? `1px solid ${theme.success}33` : `1px solid ${themeColors.border}`, borderRadius: 14, padding: '14px 16px', marginBottom: 8, marginTop: i === 0 ? 10 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ color: themeColors.text, fontWeight: 700, fontSize: 14 }}>⚔️ {d.exName}</span>
                    {d.done ? <span style={{ color: theme.success, fontSize: 12, fontWeight: 700 }}>✅ Gagné</span> : <span style={{ color: themeColors.accent, fontSize: 11, fontWeight: 600 }}>En cours</span>}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: themeColors.textMuted, fontSize: 10 }}>Toi</div>
                      <Avatar user={user} size={20} frame={equippedFrameObj} />
                      <div style={{ color: themeColors.accent, fontWeight: 800, fontSize: 16 }}>{d.myEst || '—'}</div>
                    </div>
                    <div style={{ color: themeColors.textDim, fontSize: 18, alignSelf: 'center' }}>VS</div>
                    <div style={{ textAlign: 'center' }}><div style={{ color: themeColors.textMuted, fontSize: 10 }}>{d.opponent.name}</div><div style={{ color: themeColors.text, fontWeight: 800, fontSize: 16 }}>{d.targetEst}</div></div>
                  </div>
                  {!d.done && <button onClick={() => { setSelEx(EXERCISES.find(e => e.id === d.exId)); setFormW(''); setFormR('1'); setPhoto(null); setSubView('add') }} style={{ ...S.shareBtn, background: themeColors.accent, padding: '10px 0', fontSize: 13, marginTop: 10 }}>💪 Battre ce record</button>}
                </div>
              ))
          )}
        </div>
      )}

      {/* ── SHOP ── */}
      {page === 'shop' && (
        <div style={{ padding: '0 16px' }}>
          <h2 style={{ color: themeColors.text, fontSize: 20, fontWeight: 800, padding: '16px 0 8px', margin: 0 }}>🛒 Shop</h2>
          {!premium && (
            <div onClick={() => setShowPaywall(true)} style={{ background: `linear-gradient(135deg,${themeColors.gold}15,${themeColors.accent}15)`, border: `1px solid ${themeColors.gold}33`, borderRadius: 16, padding: '14px 16px', marginBottom: 12, cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: 24 }}>👑</div><div style={{ color: themeColors.gold, fontWeight: 800, fontSize: 14, marginTop: 4 }}>Passe Premium · dès 4.99€/mois</div>
            </div>
          )}

          {/* Shop tabs */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 12 }}>
            {[{ id: 'templates', l: '🎨 Templates' }, { id: 'avatars', l: '😀 Avatars' }, { id: 'frames', l: '🖼️ Cadres' }, { id: 'themes', l: '🎭 Thèmes' }].map(t => (
              <button key={t.id} onClick={() => setShopTab(t.id)} style={{ padding: '7px 14px', borderRadius: 16, fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, background: shopTab === t.id ? themeColors.accent : themeColors.surface, color: shopTab === t.id ? '#fff' : themeColors.textMuted, border: `1px solid ${shopTab === t.id ? themeColors.accent : themeColors.border}` }}>{t.l}</button>
            ))}
          </div>

          {/* Templates tab */}
          {shopTab === 'templates' && CARD_TEMPLATES.map(t => {
            const owned = t.free || ownedTemplates.includes(t.id) || premium === 'elite' || (premium === 'pro' && t.tier === 'pro');
            return (
              <div key={t.id} style={{ background: themeColors.surface, border: `1px solid ${t.border}33`, borderRadius: 12, padding: '12px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: t.bg1, border: `2px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><div style={{ width: 20, height: 20, borderRadius: 4, background: t.border + '44' }} /></div>
                  <div>
                    <div style={{ color: themeColors.text, fontWeight: 700, fontSize: 13 }}>{t.name}</div>
                    <div style={{ color: themeColors.textMuted, fontSize: 11 }}>{owned ? '✅ Débloqué' : t.price || 'Gratuit'}{t.tier && <span style={{ marginLeft: 6, padding: '1px 6px', borderRadius: 5, background: `${t.border}22`, color: t.border, fontSize: 9 }}>{t.tier}</span>}</div>
                  </div>
                </div>
                {!owned ? (
                  <button onClick={() => buyItem(t.id, 'template', t.price, () => setOwnedTemplates(p => [...p, t.id]))} style={{ background: t.border, border: 'none', borderRadius: 10, padding: '7px 12px', color: '#000', fontWeight: 800, fontSize: 11, cursor: 'pointer' }}>{t.price}</button>
                ) : (
                  <span style={{ color: theme.success, fontSize: 11, fontWeight: 600 }}>✅</span>
                )}
              </div>
            );
          })}

          {/* Avatars tab */}
          {shopTab === 'avatars' && (() => {
            const cats = [...new Set(SHOP_AVATARS.map(a => a.cat))];
            return cats.map(cat => (
              <div key={cat}>
                <h4 style={{ color: themeColors.textMuted, fontSize: 11, fontWeight: 700, margin: '10px 0 6px', textTransform: 'uppercase' }}>{cat}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {SHOP_AVATARS.filter(a => a.cat === cat).map(av => {
                    const owned = av.free || ownedAvatars.includes(av.id);
                    const equipped = equippedAvatar === av.id;
                    return (
                      <div key={av.id} style={{ background: equipped ? `${themeColors.accent}12` : themeColors.surface, border: `1px solid ${equipped ? themeColors.accent : themeColors.border}`, borderRadius: 12, padding: '12px', textAlign: 'center', cursor: 'pointer' }}
                        onClick={() => {
                          if (owned) { setEquippedAvatar(av.id); flash(`Avatar équipé : ${av.name}`); }
                          else buyItem(av.id, 'avatar', av.price, () => { setOwnedAvatars(p => [...p, av.id]); setEquippedAvatar(av.id); });
                        }}>
                        <div style={{ fontSize: 32, marginBottom: 4 }}>{av.emoji}</div>
                        <div style={{ color: themeColors.text, fontWeight: 700, fontSize: 11 }}>{av.name}</div>
                        <div style={{ color: equipped ? themeColors.accent : owned ? theme.success : themeColors.textMuted, fontSize: 10, marginTop: 2 }}>{equipped ? '⚡ Équipé' : owned ? '✅ Acheté' : av.price || 'Gratuit'}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ));
          })()}

          {/* Frames tab */}
          {shopTab === 'frames' && SHOP_FRAMES.map(fr => {
            const owned = fr.free || ownedFrames.includes(fr.id);
            const equipped = equippedFrame === fr.id;
            const borderColor = fr.color?.startsWith('linear') ? '#FFD700' : fr.color;
            return (
              <div key={fr.id} style={{ background: equipped ? `${themeColors.accent}12` : themeColors.surface, border: `1px solid ${equipped ? themeColors.accent : themeColors.border}`, borderRadius: 12, padding: '12px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                onClick={() => { if (owned) { setEquippedFrame(fr.id); flash(`Cadre équipé : ${fr.name}`); } }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${borderColor}`, boxShadow: `0 0 8px ${borderColor}44`, flexShrink: 0 }} />
                  <div>
                    <div style={{ color: themeColors.text, fontWeight: 700, fontSize: 13 }}>{fr.name}</div>
                    <div style={{ color: equipped ? themeColors.accent : owned ? theme.success : themeColors.textMuted, fontSize: 11 }}>{equipped ? '⚡ Équipé' : owned ? '✅ Acheté' : fr.price}</div>
                  </div>
                </div>
                {!owned && (
                  <button onClick={e => { e.stopPropagation(); buyItem(fr.id, 'frame', fr.price, () => { setOwnedFrames(p => [...p, fr.id]); setEquippedFrame(fr.id); }) }} style={{ background: themeColors.accent, border: 'none', borderRadius: 10, padding: '7px 12px', color: '#fff', fontWeight: 800, fontSize: 11, cursor: 'pointer' }}>{fr.price}</button>
                )}
              </div>
            );
          })}

          {/* Themes tab */}
          {shopTab === 'themes' && SHOP_THEMES.map(th => {
            const owned = th.free || ownedThemes.includes(th.id);
            const equipped = equippedTheme === th.id;
            return (
              <div key={th.id} style={{ background: th.dark.surface, border: `2px solid ${equipped ? th.dark.accent : th.dark.border}`, borderRadius: 14, padding: '14px 16px', marginBottom: 10, cursor: 'pointer' }}
                onClick={() => {
                  if (owned) { setEquippedTheme(th.id); flash(`Thème équipé : ${th.name}`); }
                  else buyItem(th.id, 'theme', th.price, () => { setOwnedThemes(p => [...p, th.id]); setEquippedTheme(th.id); });
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ color: th.dark.text, fontWeight: 800, fontSize: 14 }}>{th.name}</span>
                  <span style={{ color: equipped ? th.dark.accent : owned ? theme.success : th.dark.gold, fontSize: 12, fontWeight: 700 }}>{equipped ? '⚡ Actif' : owned ? '✅' : th.price || 'Gratuit'}</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[th.dark.bg, th.dark.surface, th.dark.accent, th.dark.gold].map((c, i) => (
                    <div key={i} style={{ width: 20, height: 20, borderRadius: 5, background: c, border: `1px solid ${th.dark.border}` }} />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Affiliates */}
          <h3 style={{ color: themeColors.text, fontSize: 15, fontWeight: 700, margin: '20px 0 10px' }}>💪 Équipement</h3>
          {Object.entries(AFFILIATES).map(([cat, items]) => (
            <div key={cat}>
              <div style={{ color: BADGE_COLORS[cat], fontSize: 11, fontWeight: 700, margin: '10px 0 6px' }}>{cat}</div>
              {items.map((a, i) => (
                <a key={i} href={a.link} target="_blank" rel="noopener" style={{ textDecoration: 'none', display: 'flex', background: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: 12, padding: '12px 14px', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 24 }}>{a.img}</span>
                  <div style={{ flex: 1 }}><div style={{ color: themeColors.text, fontSize: 12, fontWeight: 600 }}>{a.name}</div><div style={{ color: themeColors.textMuted, fontSize: 10 }}>{a.brand} · {a.price}</div></div>
                  <span style={{ color: themeColors.accent, fontSize: 10, fontWeight: 700 }}>Voir →</span>
                </a>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ── PROFILE ── */}
      {page === 'profile' && (
        <div style={{ padding: 16 }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <label style={{ cursor: 'pointer', display: 'inline-block', position: 'relative' }}>
              <Avatar user={user} size={80} frame={equippedFrameObj} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, background: themeColors.accent, borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>📷</div>
              <input type="file" accept="image/*" onChange={handleProfilePhoto} style={{ display: 'none' }} />
            </label>
            <h2 style={{ color: themeColors.text, fontSize: 20, fontWeight: 800, margin: '8px 0 2px' }}>{user.name}</h2>
            {equippedTitle !== 'none' && <div style={{ color: themeColors.accent, fontSize: 11, fontStyle: 'italic', marginBottom: 2 }}>{TITLES.find(t => t.id === equippedTitle)?.name}</div>}
            <div style={{ color: lvl.c, fontSize: 12, fontWeight: 600 }}>⚡ LVL {lvl.l} · {lvl.n}</div>
            {premium && <div style={{ color: themeColors.gold, fontSize: 11, fontWeight: 700, marginTop: 4 }}>👑 {premium.toUpperCase()}</div>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
            {[{ l: 'PRs', v: prCount }, { l: 'XP', v: totalXP }, { l: 'Streak', v: `${streak.count}j` }, { l: 'Niveau', v: `LVL ${lvl.l}` }].map(s => (
              <div key={s.l} style={{ background: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: 12, padding: 14, textAlign: 'center' }}><div style={{ color: themeColors.text, fontWeight: 800, fontSize: 20 }}>{s.v}</div><div style={{ color: themeColors.textDim, fontSize: 10, marginTop: 2 }}>{s.l}</div></div>
            ))}
          </div>
          {/* Achievements */}
          <h3 style={{ color: themeColors.text, fontSize: 14, fontWeight: 700, marginBottom: 8 }}>🏆 Achievements</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
            {ACHIEVEMENTS.map(a => {
              const unlocked = unlockedAch.includes(a.id);
              return (
                <div key={a.id} style={{ background: themeColors.surface, border: `1px solid ${unlocked ? themeColors.gold : themeColors.border}`, borderRadius: 10, padding: '8px 4px', textAlign: 'center', opacity: unlocked ? 1 : 0.3, filter: unlocked ? 'none' : 'grayscale(1)' }}>
                  <div style={{ fontSize: 20 }}>{a.icon}</div>
                  <div style={{ color: themeColors.text, fontSize: 8, fontWeight: 600, marginTop: 2, lineHeight: 1.2 }}>{a.name}</div>
                </div>
              );
            })}
          </div>
          {/* Progression */}
          <h3 style={{ color: themeColors.text, fontSize: 14, fontWeight: 700, marginBottom: 8 }}>📈 Progression</h3>
          {EXERCISES.filter(e => prs[e.id]?.history?.length > 1).slice(0, 5).map(ex => {
            const h = prs[ex.id].history, d = h[h.length - 1].est - h[0].est;
            return <div key={ex.id} style={{ background: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: 12, padding: '10px 14px', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: themeColors.text, fontSize: 12, fontWeight: 600 }}>{ex.n}</span><span style={{ color: d > 0 ? theme.success : theme.danger, fontSize: 12, fontWeight: 700 }}>{d > 0 ? '+' : ''}{d} kg</span></div>;
          })}
          {!premium && <button onClick={() => setShowPaywall(true)} style={{ ...S.shareBtn, background: themeColors.accent, marginTop: 16 }}>👑 Premium</button>}
          <button onClick={() => { setUser(null); localStorage.removeItem('gf_u'); setPage('home') }} style={{ width: '100%', marginTop: 12, padding: '14px 0', borderRadius: 14, background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)', color: '#ff5050', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Déconnexion</button>
        </div>
      )}

      <div style={{ height: 85 }} />

      {/* ── Floating Coach Button ── */}
      {user && (
        <button onClick={() => setSub('coach')} style={{ position: 'fixed', bottom: 90, right: 16, zIndex: 99, width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#FF6B35,#FFD700)', border: 'none', fontSize: 24, cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,107,53,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>🧠</button>
      )}

      {/* ── NAV ── */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: 480, margin: '0 auto', background: `${themeColors.bg}f5`, backdropFilter: 'blur(20px)', borderTop: `1px solid ${themeColors.border}`, display: 'flex', justifyContent: 'space-around', padding: '6px 0 22px', zIndex: 100 }}>
        {[
          { id: 'home', ic: '🏠', l: 'Accueil' },
          { id: 'prs', ic: '📸', l: 'PRs' },
          { id: 'motion', ic: '💪', l: 'Motion' },
          { id: 'shop', ic: '🛒', l: 'Shop' },
          { id: 'profile', ic: '👤', l: 'Profil' },
        ].map(t => (
          <button key={t.id} onClick={() => { setPage(t.id); setSubView(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '4px 10px', opacity: page === t.id ? 1 : 0.4 }}>
            <span style={{ fontSize: 20 }}>{t.ic}</span>
            <span style={{ color: page === t.id ? themeColors.accent : themeColors.textMuted, fontSize: 9, fontWeight: 600 }}>{t.l}</span>
          </button>
        ))}
      </nav>

      <style>{`
        @keyframes toastIn { from { opacity:0; transform:translateX(-50%) translateY(-10px) } to { opacity:1; transform:translateX(-50%) translateY(0) } }
        @keyframes framePulse { 0%,100% { opacity:1 } 50% { opacity:0.6 } }
      `}</style>
    </div>
  );
}

// ── Session Exercise Sub-component ──
function SessionExercise({ ex, exIdx, themeColors, onAddSet }) {
  const [w, setW] = useState('');
  const [r, setR] = useState('1');
  return (
    <div style={{ background: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: 12, padding: '12px 14px', marginBottom: 8 }}>
      <div style={{ color: themeColors.text, fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{ex.exName}</div>
      {ex.sets.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
          {ex.sets.map((s, j) => (
            <span key={j} style={{ background: s.isNewPr ? `${themeColors.accent}22` : 'rgba(255,255,255,0.06)', border: `1px solid ${s.isNewPr ? themeColors.accent : themeColors.border}33`, borderRadius: 6, padding: '3px 8px', fontSize: 11, color: s.isNewPr ? themeColors.accent : themeColors.textMuted }}>
              {s.w}×{s.r}{s.isNewPr ? ' 🏆' : ''}
            </span>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input type="number" placeholder="kg" value={w} onChange={e => setW(e.target.value)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: `1px solid ${themeColors.border}`, borderRadius: 8, padding: '8px 10px', color: themeColors.text, fontSize: 14, textAlign: 'center', outline: 'none' }} />
        {ex.exUnit === 'kg' && <input type="number" placeholder="reps" value={r} onChange={e => setR(e.target.value)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: `1px solid ${themeColors.border}`, borderRadius: 8, padding: '8px 10px', color: themeColors.text, fontSize: 14, textAlign: 'center', outline: 'none' }} />}
        <button onClick={() => { onAddSet(w, r); setW(''); }} style={{ background: themeColors.accent, border: 'none', borderRadius: 8, width: 36, height: 36, color: '#fff', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
      </div>
    </div>
  );
}
