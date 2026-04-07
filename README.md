# 🐐 GOAT FUEL — Personal Records Tracker

> Feed the GOAT in you. Track PRs, compete, share, grow.

PWA fitness complète avec système de PRs, classement, défis, duels, social feed, coach IA, et monétisation intégrée.

---

## 📁 Structure du projet

```
goatfuel/
├── public/
│   └── icons/              # PWA icons (logo-goat.png, icon-192.png, icon-512.png)
├── src/
│   ├── main.jsx            # Entry point React
│   ├── App.jsx             # Composant principal — routing, state, UI complète
│   ├── data.js             # 55 exercices, niveaux, templates, affiliés, challenges
│   ├── utils.js            # Calcul 1RM, XP, streaks, leaderboard, coach IA
│   ├── prCard.js           # Dessin canvas PR Card + partage Web Share API
│   ├── styles.js           # Constantes de style (thème, composants)
│   └── firebase.js         # Config Firebase Auth + Firestore + helpers CRUD
├── index.html              # HTML avec meta PWA + Apple Web App
├── vite.config.js          # Vite + PWA plugin (Service Worker, manifest)
├── vercel.json             # Config déploiement Vercel
├── package.json
├── .env.example            # Variables d'environnement
└── .gitignore
```

---

## 🚀 Installation & lancement

```bash
# 1. Clone
git clone https://github.com/ton-user/goatfuel.git
cd goatfuel

# 2. Install
npm install

# 3. Config Firebase
cp .env.example .env.local
# → Remplis les clés Firebase

# 4. Dev
npm run dev

# 5. Build
npm run build

# 6. Deploy
npx vercel --prod
```

---

## 🏗️ Architecture & Features

### 📸 55 Exercices (6 catégories)
| Catégorie | Exercices | Badge |
|-----------|-----------|-------|
| Push      | 15        | 🟠 PUSH |
| Pull      | 14        | 🔵 PULL |
| Squat     | 12        | 🔴 SQUAT |
| Olympic   | 5         | 🟡 OLY |
| Core      | 4         | 🟢 CORE |
| Cardio    | 5         | 🔵 CARDIO |

### ⚡ Système de niveaux (15 tiers)
```
LVL 1  Rookie      → 0 XP
LVL 2  Iron        → 100 XP
LVL 3  Bronze      → 250 XP
LVL 4  Warrior     → 500 XP
LVL 5  Silver      → 800 XP
LVL 6  Gold        → 1,200 XP
LVL 7  Platinum    → 1,800 XP
LVL 8  Diamond     → 2,500 XP
LVL 9  Master      → 3,500 XP
LVL 10 Legend      → 5,000 XP
LVL 11 Prestige I  → 7,000 XP
LVL 12 Prestige II → 10,000 XP
LVL 13 Prestige III→ 14,000 XP
LVL 14 Elite       → 20,000 XP
LVL 15 GOAT        → 30,000 XP
```

### 🔥 Streaks & Multiplicateur XP
| Jours consécutifs | Multiplicateur |
|-------------------|---------------|
| 3+                | ×1.1          |
| 7+                | ×1.3          |
| 14+               | ×1.5          |
| 30+               | ×2.0          |

### 🎯 Défis hebdomadaires
- 10 templates de défis (rotation aléatoire, 3 actifs)
- Barre de progression
- Bonus XP à la complétion
- Reset hebdomadaire

### ⚔️ Duels 1v1
- Lancement depuis le feed social
- Comparaison 1RM en temps réel
- 2 duels gratuits, illimité en Premium

### 📸 PR Cards partageables
- 5 templates visuels (Classic, Gold, Neon, Inferno, Diamond)
- Photo depuis appareil photo
- Badges LVL + catégorie + streak
- Partage natif via Web Share API
- Export PNG

### 🧠 Coach IA
- Détection des PRs inactifs (>14 jours)
- Notification streak
- Messages contextuels personnalisés

---

## 💰 Monétisation (3 axes)

### 1. Freemium — 2 tiers
| Feature | Gratuit | Pro (4.99€/mois) | Elite (9.99€/mois) |
|---------|---------|-------------------|---------------------|
| Exercices | 10 | 55 | 55 |
| PR Cards | Watermark | Sans watermark | Templates exclusifs |
| Classement | Hebdo | Global + historique | Badge Prestige |
| Coach IA | 3 msgs | 10 msgs | Illimité |
| Duels | 2 | 5/semaine | Illimité |
| Templates | Classic | +Gold, Neon | Tous |
| Analytics | — | Basique | Complet |
| Programmes | — | — | IA personnalisé |

**Annuel : 39.99€/an (−33%)**

### 2. Achats in-app
- Templates PR Card : 1.99€ – 2.99€ chacun
- Pack 5 templates : 4.99€

### 3. Affiliation équipement
- Recommandations contextuelles post-PR
- Liens affiliés Amazon/Décathlon
- 6 catégories couvertes (ceintures, chaussures, straps, etc.)

---

## 🔧 Config Firebase

### 1. Créer le projet
```
Firebase Console → New Project → "goatfuel"
```

### 2. Activer Auth
```
Authentication → Sign-in method → Google ✅ → Facebook ✅
```

### 3. Firestore
```
Firestore → Create Database → Start in production mode
```

### Collections :
```
users/{uid}
  ├── name, email, photoURL, provider
  ├── xp, streak, premium, ownedTemplates
  └── prs/{exerciseId}
        ├── weight, reps, est, xp, date, photo
        └── history[]

leaderboard/{exerciseId}/entries/{uid}
  └── name, weight, reps, est1rm, level

feed/{docId}
  └── uid, type, exerciseId, weight, reps, createdAt

duels/{docId}
  └── challengerId, challengedId, exerciseId, targetEst, status
```

### Règles Firestore :
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      match /prs/{prId} {
        allow read, write: if request.auth.uid == userId;
      }
    }
    match /leaderboard/{exId}/entries/{userId} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
    match /feed/{docId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
    match /duels/{docId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.challengerId
                    || request.auth.uid == resource.data.challengedId;
    }
  }
}
```

---

## 📱 PWA

Le projet est configuré comme PWA complète :
- **Service Worker** via vite-plugin-pwa (Workbox)
- **Manifest** avec icônes 192/512px
- **Offline** : cache-first pour fonts, runtime caching
- **Install prompt** : détection automatique
- **Apple** : meta tags pour iOS standalone

### Icônes à fournir
Placer dans `public/icons/` :
- `logo-goat.png` (logo principal)
- `icon-192.png` (192×192)
- `icon-512.png` (512×512)
- `favicon.ico`

---

## 📊 Métriques à tracker

| Métrique | Objectif | Outil |
|----------|----------|-------|
| DAU/MAU | >25% | Firebase Analytics |
| Rétention J1 | >60% | Firebase Analytics |
| Rétention J7 | >30% | Firebase Analytics |
| Rétention J30 | >15% | Firebase Analytics |
| Conversion Free→Pro | >5% | Stripe Dashboard |
| ARPU | >2€ | Stripe + affiliés |
| Streak moyen | >5j | Firestore query |

---

## 🗺️ Roadmap

### Phase 1 (Semaine 1-2) ✅
- [x] 55 exercices avec calcul 1RM
- [x] Système de niveaux 15 tiers
- [x] Streaks avec multiplicateur XP
- [x] PR Cards canvas partageables
- [x] Classement par exercice
- [x] Auth Google/Facebook (UI)
- [x] Défis hebdomadaires
- [x] Coach IA contextuel
- [x] Feed social + Duels
- [x] Paywall 2 tiers
- [x] Boutique templates
- [x] Affiliation équipement
- [x] Firebase config + helpers

### Phase 2 (Semaine 3-4)
- [ ] Brancher Firebase Auth réel
- [ ] Firestore sync en temps réel
- [ ] Push notifications (FCM)
- [ ] Stripe Checkout pour paywall
- [ ] Leaderboard live

### Phase 3 (Mois 2)
- [ ] Feed social temps réel (Firestore onSnapshot)
- [ ] Duels avec matchmaking
- [ ] Programmes IA (Claude API)
- [ ] Crews/Teams compétition

### Phase 4 (Mois 3+)
- [ ] Analytics dashboard
- [ ] A/B testing paywall
- [ ] Notifications push contextuelles
- [ ] Partenariats marques fitness
