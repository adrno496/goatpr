// ═══════════════════════════════════
// Global style constants
// ═══════════════════════════════════
import { SHOP_THEMES } from './data';

export function getThemeColors(themeId, mode = 'dark') {
  const t = SHOP_THEMES.find(th => th.id === themeId) || SHOP_THEMES[0];
  return t[mode] || t.dark;
}

export const theme = {
  bg: '#0a0a0a',
  surface: 'rgba(255,255,255,0.03)',
  surfaceHover: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.06)',
  borderLight: 'rgba(255,255,255,0.08)',
  accent: '#FF6B35',
  accentLight: '#FF6B3522',
  gold: '#FFD700',
  goldLight: '#FFD70022',
  text: '#ffffff',
  textMuted: '#888888',
  textDim: '#666666',
  textDark: '#444444',
  success: '#69F0AE',
  danger: '#FF5252',
  font: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
};

export const S = {
  root: {
    background: theme.bg,
    minHeight: '100vh',
    fontFamily: theme.font,
    color: theme.text,
    maxWidth: 480,
    margin: '0 auto',
    position: 'relative',
  },

  // ── Auth ──
  authBtn: {
    width: '100%',
    maxWidth: 300,
    padding: '14px 0',
    borderRadius: 12,
    border: `1px solid ${theme.borderLight}`,
    background: '#fff',
    color: '#222',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  // ── Tabs ──
  tabs: {
    display: 'flex',
    borderBottom: `1px solid ${theme.border}`,
  },
  tabActive: {
    flex: 1, padding: '10px 0', background: 'none', border: 'none',
    borderBottom: `2px solid ${theme.accent}`, color: theme.accent,
    fontWeight: 700, fontSize: 13, cursor: 'pointer',
  },
  tabInactive: {
    flex: 1, padding: '10px 0', background: 'none', border: 'none',
    borderBottom: '2px solid transparent', color: theme.textDim,
    fontWeight: 600, fontSize: 13, cursor: 'pointer',
  },

  // ── Inputs ──
  searchInput: {
    width: '100%', background: theme.surface,
    border: `1px solid ${theme.borderLight}`, borderRadius: 10,
    padding: '9px 12px', color: theme.text, fontSize: 12, outline: 'none',
    marginBottom: 8,
  },
  input: {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: `2px solid ${theme.accentLight}`, borderRadius: 12,
    padding: 14, color: theme.text, fontSize: 22, fontWeight: 800,
    textAlign: 'center', outline: 'none',
  },
  label: {
    display: 'block', color: theme.textMuted, fontSize: 11,
    fontWeight: 600, marginBottom: 4, marginTop: 14, textAlign: 'left',
  },

  // ── Buttons ──
  miniBtn: {
    border: 'none', borderRadius: 8, width: 32, height: 32,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, cursor: 'pointer', fontWeight: 800,
  },
  photoBtn: {
    display: 'block', width: '100%', padding: '12px 0', borderRadius: 12,
    background: theme.surface, border: `1px solid ${theme.borderLight}`,
    color: '#ccc', fontSize: 14, fontWeight: 600, textAlign: 'center',
    marginTop: 12, cursor: 'pointer',
  },
  shareBtn: {
    display: 'block', width: '100%', padding: '14px 0', borderRadius: 14,
    background: theme.accent, border: 'none', color: '#fff', fontSize: 15,
    fontWeight: 800, textAlign: 'center', marginTop: 10, cursor: 'pointer',
  },
  backBtn: {
    background: 'none', border: 'none', color: theme.accent,
    fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0,
  },

  // ── Toast ──
  toast: {
    position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
    zIndex: 10000, background: `linear-gradient(135deg, ${theme.accent}, #FF8F00)`,
    color: '#fff', padding: '10px 22px', borderRadius: 12, fontWeight: 700,
    fontSize: 12, boxShadow: '0 4px 20px rgba(255,107,53,0.4)',
    animation: 'toastIn .3s ease', maxWidth: '90%', textAlign: 'center',
  },

  // ── Cards ──
  card: {
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: 12,
    padding: '12px 14px',
    marginBottom: 6,
  },
  cardHighlight: {
    background: 'rgba(255,107,53,0.04)',
    border: '1px solid rgba(255,107,53,0.12)',
    borderRadius: 12,
    padding: '12px 14px',
    marginBottom: 6,
  },
};
