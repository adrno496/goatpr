// ═══════════════════════════════════════════════════
// Supabase — OFFLINE STUBS
// Toutes les fonctions simulent les appels en localStorage
// Passer ONLINE_MODE à true quand Supabase sera branché
// ═══════════════════════════════════════════════════

const ONLINE_MODE = false;

// TODO: import { createClient } from '@supabase/supabase-js'
// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

/*
Schema Supabase prévu :

-- users (id uuid PK, name text, email text, photo_url text, provider text, xp int,
--        streak_count int, streak_last date, premium_tier text,
--        equipped_avatar text, equipped_frame text, equipped_theme text, equipped_title text,
--        created_at timestamptz)

-- prs (id serial PK, user_id uuid FK, exercise_id text, weight float, reps int,
--       est_1rm float, xp int, date timestamptz, photo_url text)

-- pr_history (id serial PK, user_id uuid FK, exercise_id text, weight float, reps int,
--             est_1rm float, date timestamptz)

-- sessions (id serial PK, user_id uuid FK, name text, type text, duration int,
--           exercises jsonb, note text, rating int, xp int, date timestamptz)

-- purchases (id serial PK, user_id uuid FK, item_id text, item_type text, price text,
--            simulated boolean DEFAULT true, created_at timestamptz)

-- achievements_unlocked (id serial PK, user_id uuid FK, achievement_id text, unlocked_at timestamptz)

-- duels (id serial PK, challenger_id uuid, challenged_id uuid, exercise_id text,
--        target_est float, challenger_est float, status text, created_at timestamptz)

-- feed (id serial PK, user_id uuid FK, type text, exercise_id text, weight float,
--       reps int, created_at timestamptz)

-- leaderboard (id serial PK, user_id uuid FK, exercise_id text, est_1rm float, updated_at timestamptz)

RLS policies :
- users : select pour tous, update/insert pour auth.uid() = id
- prs, sessions, purchases, achievements_unlocked : CRUD pour auth.uid() = user_id
- leaderboard, feed : select pour tous, insert pour auth.uid() = user_id
- duels : select/update pour challenger_id ou challenged_id = auth.uid(), insert pour auth
*/

import { loadLocal, saveLocal } from './utils';

// ── Auth ──

export async function loginWithGoogle() {
  // TODO: const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
  console.log('[OFFLINE] loginWithGoogle simulé');
  return { name: '@user', provider: 'google', av: '🔴' };
}

export async function loginWithFacebook() {
  // TODO: const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'facebook' })
  console.log('[OFFLINE] loginWithFacebook simulé');
  return { name: '@user', provider: 'facebook', av: '🔵' };
}

export async function logoutUser() {
  // TODO: await supabase.auth.signOut()
  localStorage.removeItem('gf_u');
}

// ── PRs ──

export async function savePR(userId, exerciseId, prData) {
  // TODO: await supabase.from('prs').upsert({ user_id: userId, exercise_id: exerciseId, ...prData })
  const prs = loadLocal('gf_p', {});
  prs[exerciseId] = prData;
  saveLocal('gf_p', prs);
  return prData;
}

export async function loadPRs(userId) {
  // TODO: const { data } = await supabase.from('prs').select('*').eq('user_id', userId)
  return loadLocal('gf_p', {});
}

// ── Sessions ──

export async function saveSession(userId, session) {
  // TODO: await supabase.from('sessions').insert({ user_id: userId, ...session })
  const sessions = loadLocal('gf_sessions', []);
  sessions.push(session);
  saveLocal('gf_sessions', sessions);
  return session;
}

export async function loadSessions(userId) {
  // TODO: const { data } = await supabase.from('sessions').select('*').eq('user_id', userId).order('date', { ascending: false })
  return loadLocal('gf_sessions', []);
}

// ── Purchases ──

export async function savePurchase(userId, itemId, itemType, price) {
  // TODO: await supabase.from('purchases').insert({ user_id: userId, item_id: itemId, item_type: itemType, price, simulated: true })
  console.log(`[OFFLINE] Achat simulé: ${itemType}/${itemId} — ${price}`);
  return { itemId, itemType, price, simulated: true };
}

// ── Leaderboard ──

export async function getLeaderboard(exerciseId, limit = 20) {
  // TODO: const { data } = await supabase.from('leaderboard').select('*, users(name, photo_url)')
  //         .eq('exercise_id', exerciseId).order('est_1rm', { ascending: false }).limit(limit)
  return []; // Fake data générée côté client pour l'instant
}

export async function postToLeaderboard(userId, exerciseId, est1rm) {
  // TODO: await supabase.from('leaderboard').upsert({ user_id: userId, exercise_id: exerciseId, est_1rm: est1rm })
  console.log(`[OFFLINE] Leaderboard: ${exerciseId} = ${est1rm}`);
}

// ── Feed ──

export async function postToFeed(userId, feedItem) {
  // TODO: await supabase.from('feed').insert({ user_id: userId, ...feedItem })
  console.log('[OFFLINE] Feed post simulé');
}

export async function subscribeFeed(callback) {
  // TODO: supabase.channel('feed')
  //   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'feed' }, payload => callback(payload.new))
  //   .subscribe()
  callback([]); // Fake feed côté client
  return () => {}; // unsubscribe
}

// ── Duels ──

export async function createDuel(duelData) {
  // TODO: const { data } = await supabase.from('duels').insert(duelData).select().single()
  const duels = loadLocal('gf_du', []);
  const duel = { ...duelData, id: Date.now() };
  duels.push(duel);
  saveLocal('gf_du', duels);
  return duel;
}

// ── User Profile ──

export async function updateUserProfile(userId, data) {
  // TODO: await supabase.from('users').update(data).eq('id', userId)
  const user = loadLocal('gf_u', {});
  saveLocal('gf_u', { ...user, ...data });
}

export async function getUserProfile(userId) {
  // TODO: const { data } = await supabase.from('users').select('*').eq('id', userId).single()
  return loadLocal('gf_u', null);
}
