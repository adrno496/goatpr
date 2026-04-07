// ═══════════════════════════════════════
// EXERCISES · LEVELS · TEMPLATES · DATA
// ═══════════════════════════════════════

export const EXERCISES = [
  // PUSH (15)
  {id:"bench",n:"Développé couché",c:"Push",u:"kg",b:"PUSH"},
  {id:"incline_bench",n:"Développé incliné",c:"Push",u:"kg",b:"PUSH"},
  {id:"decline_bench",n:"Développé décliné",c:"Push",u:"kg",b:"PUSH"},
  {id:"db_bench",n:"Développé haltères",c:"Push",u:"kg",b:"PUSH"},
  {id:"ohp",n:"Développé militaire",c:"Push",u:"kg",b:"PUSH"},
  {id:"db_ohp",n:"Press épaules DB",c:"Push",u:"kg",b:"PUSH"},
  {id:"arnold",n:"Arnold Press",c:"Push",u:"kg",b:"PUSH"},
  {id:"dips",n:"Dips",c:"Push",u:"kg",b:"PUSH"},
  {id:"pushups",n:"Pompes",c:"Push",u:"reps",b:"PUSH"},
  {id:"fly",n:"Écarté poulie",c:"Push",u:"kg",b:"PUSH"},
  {id:"lat_raise",n:"Élévation latérale",c:"Push",u:"kg",b:"PUSH"},
  {id:"front_raise",n:"Élévation frontale",c:"Push",u:"kg",b:"PUSH"},
  {id:"tri_push",n:"Pushdown triceps",c:"Push",u:"kg",b:"PUSH"},
  {id:"skull",n:"Skull Crusher",c:"Push",u:"kg",b:"PUSH"},
  {id:"cg_bench",n:"Développé serré",c:"Push",u:"kg",b:"PUSH"},
  // PULL (14)
  {id:"deadlift",n:"Soulevé de terre",c:"Pull",u:"kg",b:"PULL"},
  {id:"bb_row",n:"Rowing barre",c:"Pull",u:"kg",b:"PULL"},
  {id:"pullups",n:"Tractions",c:"Pull",u:"reps",b:"PULL"},
  {id:"chinups",n:"Tractions supination",c:"Pull",u:"reps",b:"PULL"},
  {id:"lat_pull",n:"Tirage vertical",c:"Pull",u:"kg",b:"PULL"},
  {id:"seated_row",n:"Tirage horizontal",c:"Pull",u:"kg",b:"PULL"},
  {id:"tbar",n:"T-Bar Row",c:"Pull",u:"kg",b:"PULL"},
  {id:"face_pull",n:"Face Pull",c:"Pull",u:"kg",b:"PULL"},
  {id:"rev_fly",n:"Oiseau inversé",c:"Pull",u:"kg",b:"PULL"},
  {id:"bb_curl",n:"Curl barre",c:"Pull",u:"kg",b:"PULL"},
  {id:"db_curl",n:"Curl haltères",c:"Pull",u:"kg",b:"PULL"},
  {id:"hammer",n:"Curl marteau",c:"Pull",u:"kg",b:"PULL"},
  {id:"preacher",n:"Curl pupitre",c:"Pull",u:"kg",b:"PULL"},
  {id:"conc_curl",n:"Curl concentration",c:"Pull",u:"kg",b:"PULL"},
  // SQUAT / LEGS (12)
  {id:"squat",n:"Back Squat",c:"Squat",u:"kg",b:"SQUAT"},
  {id:"front_sq",n:"Front Squat",c:"Squat",u:"kg",b:"SQUAT"},
  {id:"leg_press",n:"Presse à cuisses",c:"Squat",u:"kg",b:"SQUAT"},
  {id:"hack_sq",n:"Hack Squat",c:"Squat",u:"kg",b:"SQUAT"},
  {id:"goblet",n:"Goblet Squat",c:"Squat",u:"kg",b:"SQUAT"},
  {id:"bulgarian",n:"Bulgarian Split Squat",c:"Squat",u:"kg",b:"SQUAT"},
  {id:"rdl",n:"Soulevé roumain",c:"Squat",u:"kg",b:"SQUAT"},
  {id:"hip_thrust",n:"Hip Thrust",c:"Squat",u:"kg",b:"SQUAT"},
  {id:"leg_curl",n:"Leg Curl",c:"Squat",u:"kg",b:"SQUAT"},
  {id:"leg_ext",n:"Leg Extension",c:"Squat",u:"kg",b:"SQUAT"},
  {id:"calf",n:"Mollets debout",c:"Squat",u:"kg",b:"SQUAT"},
  {id:"lunges",n:"Fentes",c:"Squat",u:"kg",b:"SQUAT"},
  // OLYMPIC (5)
  {id:"clean_jerk",n:"Épaulé-jeté",c:"Olympic",u:"kg",b:"OLY"},
  {id:"snatch",n:"Arraché",c:"Olympic",u:"kg",b:"OLY"},
  {id:"pclean",n:"Power Clean",c:"Olympic",u:"kg",b:"OLY"},
  {id:"clean_pull",n:"Clean Pull",c:"Olympic",u:"kg",b:"OLY"},
  {id:"push_press",n:"Push Press",c:"Olympic",u:"kg",b:"OLY"},
  // CORE (4)
  {id:"plank",n:"Planche",c:"Core",u:"sec",b:"CORE"},
  {id:"hang_leg",n:"Relevé de jambes",c:"Core",u:"reps",b:"CORE"},
  {id:"ab_wheel",n:"Ab Wheel",c:"Core",u:"reps",b:"CORE"},
  {id:"cable_crunch",n:"Crunch poulie",c:"Core",u:"kg",b:"CORE"},
  // CARDIO (5)
  {id:"run5k",n:"5K Course",c:"Cardio",u:"min",b:"CARDIO"},
  {id:"run10k",n:"10K Course",c:"Cardio",u:"min",b:"CARDIO"},
  {id:"row500",n:"500m Rameur",c:"Cardio",u:"sec",b:"CARDIO"},
  {id:"row2k",n:"2K Rameur",c:"Cardio",u:"min",b:"CARDIO"},
  {id:"bike50",n:"Assault Bike 50cal",c:"Cardio",u:"sec",b:"CARDIO"},
];

export const CATEGORIES = ["Tous","Push","Pull","Squat","Olympic","Core","Cardio"];

export const BADGE_COLORS = {
  PUSH: "#FF6B35",
  PULL: "#2979FF",
  SQUAT: "#FF4081",
  OLY: "#FFD700",
  CORE: "#69F0AE",
  CARDIO: "#00E5FF",
};

// ── LEVELS (15) ──
export const LEVELS = [
  { l:1,  n:"Rookie",       xp:0,     c:"#9E9E9E" },
  { l:2,  n:"Iron",         xp:100,   c:"#78909C" },
  { l:3,  n:"Bronze",       xp:250,   c:"#CD7F32" },
  { l:4,  n:"Warrior",      xp:500,   c:"#FF6B35" },
  { l:5,  n:"Silver",       xp:800,   c:"#C0C0C0" },
  { l:6,  n:"Gold",         xp:1200,  c:"#FFD700" },
  { l:7,  n:"Platinum",     xp:1800,  c:"#E5E4E2" },
  { l:8,  n:"Diamond",      xp:2500,  c:"#B9F2FF" },
  { l:9,  n:"Master",       xp:3500,  c:"#FF4081" },
  { l:10, n:"Legend",        xp:5000,  c:"#FF6B35" },
  { l:11, n:"Prestige I",   xp:7000,  c:"#FFD700" },
  { l:12, n:"Prestige II",  xp:10000, c:"#FFD700" },
  { l:13, n:"Prestige III", xp:14000, c:"#FFD700" },
  { l:14, n:"Elite",        xp:20000, c:"#FF6B35" },
  { l:15, n:"GOAT",         xp:30000, c:"#FFD700" },
];

// ── CARD TEMPLATES (25) ──
export const CARD_TEMPLATES = [
  // Basiques (5) — effect: null
  { id:"classic",     name:"Classique",      border:"#FF6B35", bg1:"#1a1008", bg2:"#0d0d0d", free:true,  effect:null },
  { id:"gold",        name:"Gold Prestige",  border:"#FFD700", bg1:"#1a1500", bg2:"#0d0a00", free:false, price:"0.99€", tier:"pro",        effect:null },
  { id:"neon",        name:"Neon Beast",     border:"#00E5FF", bg1:"#001a1a", bg2:"#000d0d", free:false, price:"0.99€", tier:"pro",        effect:null },
  { id:"fire",        name:"Inferno",        border:"#FF1744", bg1:"#1a0500", bg2:"#0d0000", free:false, price:"0.99€", tier:"elite",      effect:null },
  { id:"diamond",     name:"Diamond",        border:"#B9F2FF", bg1:"#0a1218", bg2:"#050a0d", free:false, price:"0.99€", tier:"elite",      effect:null },
  // Pro 1.99€
  { id:"emerald",     name:"Emerald",        border:"#00C853", bg1:"#0a1a0e", bg2:"#050d07", free:false, price:"0.99€", tier:"pro",        effect:null },
  { id:"sunset",      name:"Sunset",         border:"#FF6D00", bg1:"#1a1008", bg2:"#0d0805", free:false, price:"0.99€", tier:"pro",        effect:null },
  { id:"arctic",      name:"Arctic",         border:"#40C4FF", bg1:"#081a22", bg2:"#040d11", free:false, price:"0.99€", tier:"pro",        effect:null },
  { id:"rose_gold",   name:"Rose Gold",      border:"#E91E63", bg1:"#1a0a10", bg2:"#0d0508", free:false, price:"0.99€", tier:"pro",        effect:null },
  { id:"stealth",     name:"Stealth",        border:"#616161", bg1:"#141414", bg2:"#0a0a0a", free:false, price:"0.99€", tier:"pro",        effect:null },
  { id:"toxic",       name:"Toxic",          border:"#76FF03", bg1:"#0a1a02", bg2:"#050d01", free:false, price:"0.99€", tier:"pro",        effect:null },
  // Elite 2.99€
  { id:"obsidian",    name:"Obsidian",       border:"#7C4DFF", bg1:"#0a0520", bg2:"#050310", free:false, price:"0.99€", tier:"elite",      effect:null },
  { id:"magma",       name:"Magma",          border:"#DD2C00", bg1:"#1a0800", bg2:"#0d0400", free:false, price:"0.99€", tier:"elite",      effect:null },
  { id:"cyber",       name:"Cyber",          border:"#F50057", bg1:"#0d0518", bg2:"#07030c", free:false, price:"0.99€", tier:"elite",      effect:null },
  { id:"thunder",     name:"Thunder",        border:"#FFEA00", bg1:"#1a1800", bg2:"#0d0c00", free:false, price:"0.99€", tier:"elite",      effect:null },
  { id:"ocean_depth", name:"Ocean Depth",    border:"#0D47A1", bg1:"#040e1a", bg2:"#02070d", free:false, price:"0.99€", tier:"elite",      effect:null },
  { id:"blood_moon",  name:"Blood Moon",     border:"#B71C1C", bg1:"#1a0808", bg2:"#0d0404", free:false, price:"0.99€", tier:"elite",      effect:null },
  { id:"frost",       name:"Frost",          border:"#E0E0E0", bg1:"#101418", bg2:"#080a0c", free:false, price:"0.99€", tier:"elite",      effect:null },
  // Legendary 4.99€ — avec effets canvas
  { id:"supernova",   name:"Supernova",      border:"#FF6D00", bg1:"#1a0a00", bg2:"#0d0500", free:false, price:"0.99€", tier:"legendary",  effect:"rainbow" },
  { id:"void",        name:"Void",           border:"#B388FF", bg1:"#050005", bg2:"#020002", free:false, price:"0.99€", tier:"legendary",  effect:"double_glow" },
  { id:"dragon",      name:"Dragon",         border:"#FF1744", bg1:"#1a0500", bg2:"#0d0300", free:false, price:"0.99€", tier:"legendary",  effect:"double_border" },
  { id:"titan",       name:"Titan",          border:"#CFD8DC", bg1:"#0c0c0e", bg2:"#060608", free:false, price:"0.99€", tier:"legendary",  effect:"chrome" },
  { id:"phantom",     name:"Phantom",        border:"#00E676", bg1:"#041a0c", bg2:"#020d06", free:false, price:"0.99€", tier:"legendary",  effect:"particles" },
  { id:"celestial",   name:"Celestial",      border:"#304FFE", bg1:"#050820", bg2:"#030410", free:false, price:"0.99€", tier:"legendary",  effect:"stars" },
  { id:"goat_edition",name:"GOAT Edition",   border:"#FFD700", bg1:"#1a1500", bg2:"#0d0a00", free:false, price:"0.99€", tier:"legendary",  effect:"triple_gold", minLevel:10 },
];

// ── CHALLENGE TEMPLATES ──
export const CHALLENGE_TEMPLATES = [
  { id:"beat_bench",    t:"🔥 Bats ton PR Bench",      d:"Enregistre un nouveau PR au développé couché", ex:"bench",    xp:100 },
  { id:"beat_squat",    t:"🦵 Bats ton PR Squat",      d:"Enregistre un nouveau PR au squat",            ex:"squat",    xp:100 },
  { id:"beat_deadlift", t:"💀 Bats ton PR Deadlift",   d:"Enregistre un nouveau PR au soulevé de terre", ex:"deadlift", xp:100 },
  { id:"log_5",         t:"📋 5 PRs cette semaine",    d:"Enregistre 5 performances cette semaine",      count:5,       xp:150 },
  { id:"log_3_cats",    t:"🎯 3 catégories",           d:"Enregistre des PRs dans 3 catégories",         cats:3,        xp:120 },
  { id:"pull_day",      t:"🚣 Journée Pull",           d:"Enregistre 3 PRs Pull aujourd'hui",            badge:"PULL",  count:3, xp:80 },
  { id:"push_day",      t:"💪 Journée Push",           d:"Enregistre 3 PRs Push aujourd'hui",            badge:"PUSH",  count:3, xp:80 },
  { id:"leg_day",       t:"🦵 Leg Day",                d:"Enregistre 3 PRs Squat aujourd'hui",           badge:"SQUAT", count:3, xp:80 },
  { id:"oly_pr",        t:"🥇 PR Olympique",           d:"Bats un PR dans un mouvement olympique",       badge:"OLY",   count:1, xp:120 },
  { id:"core_3",        t:"🧘 3 PRs Core",             d:"Enregistre 3 PRs Core cette semaine",          badge:"CORE",  count:3, xp:80 },
];

// ── AFFILIATE PRODUCTS ──
export const AFFILIATES = {
  SQUAT: [
    { name:"Ceinture de force cuir", brand:"RDX", price:"34.99€", link:"https://amzn.to/example1", img:"🏋️" },
    { name:"Chaussures haltérophilie", brand:"Adidas Powerlift", price:"89.99€", link:"https://amzn.to/example2", img:"👟" },
    { name:"Genouillères 7mm", brand:"SBD", price:"79.99€", link:"https://amzn.to/example3", img:"🦵" },
  ],
  PUSH: [
    { name:"Bandes de poignets", brand:"Schiek", price:"19.99€", link:"https://amzn.to/example4", img:"🤜" },
    { name:"Magnésie liquide", brand:"Liquid Grip", price:"12.99€", link:"https://amzn.to/example5", img:"🧴" },
  ],
  PULL: [
    { name:"Straps de tirage", brand:"Versa Gripps", price:"49.99€", link:"https://amzn.to/example6", img:"🪢" },
    { name:"Ceinture deadlift", brand:"Pioneer", price:"89.99€", link:"https://amzn.to/example7", img:"🏋️" },
  ],
  OLY: [
    { name:"Chaussures haltéro", brand:"Nike Romaleos", price:"199.99€", link:"https://amzn.to/example8", img:"👟" },
  ],
  CORE: [
    { name:"Ab Wheel Pro", brand:"Perfect Fitness", price:"24.99€", link:"https://amzn.to/example9", img:"🎡" },
  ],
  CARDIO: [
    { name:"Corde à sauter speed", brand:"Rx Smart Gear", price:"39.99€", link:"https://amzn.to/example10", img:"🪢" },
  ],
};

// ── FAKE USERS (leaderboard / social) ──
export const FAKE_USERS = [
  { name:"@coach_k",    lvl:14, pres:"Elite",      av:"🏋️" },
  { name:"@ironmind",   lvl:11, pres:"Prestige I",  av:"💪" },
  { name:"@fitboss92",  lvl:9,  pres:"Master",      av:"🔥" },
  { name:"@mika_lift",  lvl:14, pres:"Elite",       av:"🦁" },
  { name:"@harline",    lvl:8,  pres:"Diamond",     av:"💎" },
  { name:"@beast_mode", lvl:6,  pres:"Gold",        av:"👑" },
  { name:"@starter_gym",lvl:2,  pres:"Iron",        av:"🌱" },
];

// ── SHOP AVATARS (50) ──
export const SHOP_AVATARS = [
  // Animaux (10)
  { id:"goat_classic", name:"Goat Classic",     emoji:"🐐",   cat:"Animaux",   free:true },
  { id:"lion",         name:"Lion Alpha",        emoji:"🦁",   cat:"Animaux",   price:"0.99€" },
  { id:"wolf",         name:"Loup Sigma",        emoji:"🐺",   cat:"Animaux",   price:"0.99€" },
  { id:"eagle",        name:"Aigle Royal",       emoji:"🦅",   cat:"Animaux",   price:"0.99€" },
  { id:"bull",         name:"Taureau Furieux",   emoji:"🐂",   cat:"Animaux",   price:"0.99€" },
  { id:"panther",      name:"Panthère Noire",    emoji:"🐆",   cat:"Animaux",   price:"0.99€" },
  { id:"bear",         name:"Ours Grizzly",      emoji:"🐻",   cat:"Animaux",   price:"0.99€" },
  { id:"shark",        name:"Requin",            emoji:"🦈",   cat:"Animaux",   price:"0.99€" },
  { id:"dragon_av",    name:"Dragon",            emoji:"🐉",   cat:"Animaux",   price:"0.99€" },
  { id:"phoenix",      name:"Phoenix",           emoji:"🔥",   cat:"Animaux",   price:"0.99€" },
  // Sport (10)
  { id:"lifter",       name:"Haltère Gold",      emoji:"🏋️",  cat:"Sport",     price:"0.99€" },
  { id:"boxer",        name:"Boxeur",            emoji:"🥊",   cat:"Sport",     price:"0.99€" },
  { id:"sprinter",     name:"Sprinter",          emoji:"⚡",   cat:"Sport",     price:"0.99€" },
  { id:"yogi",         name:"Yogiste",           emoji:"🧘",   cat:"Sport",     price:"0.99€" },
  { id:"swimmer",      name:"Nageur",            emoji:"🏊",   cat:"Sport",     price:"0.99€" },
  { id:"cyclist",      name:"Cycliste",          emoji:"🚴",   cat:"Sport",     price:"0.99€" },
  { id:"football",     name:"Footballeur",       emoji:"⚽",   cat:"Sport",     price:"0.99€" },
  { id:"basket",       name:"Basketteur",        emoji:"🏀",   cat:"Sport",     price:"0.99€" },
  { id:"mma",          name:"MMA Fighter",       emoji:"🥋",   cat:"Sport",     price:"0.99€" },
  { id:"gymnast",      name:"Gymnaste",          emoji:"🤸",   cat:"Sport",     price:"0.99€" },
  // Lifestyle (10)
  { id:"chef",         name:"Chef Cuisto",       emoji:"👨‍🍳", cat:"Lifestyle", price:"0.99€" },
  { id:"scientist",    name:"Scientifique",      emoji:"🧬",   cat:"Lifestyle", price:"0.99€" },
  { id:"astronaut",    name:"Astronaute",        emoji:"🚀",   cat:"Lifestyle", price:"0.99€" },
  { id:"dj",           name:"DJ",                emoji:"🎧",   cat:"Lifestyle", price:"0.99€" },
  { id:"gamer",        name:"Gamer",             emoji:"🎮",   cat:"Lifestyle", price:"0.99€" },
  { id:"entrepreneur", name:"Entrepreneur",      emoji:"💼",   cat:"Lifestyle", price:"0.99€" },
  { id:"artist",       name:"Artiste",           emoji:"🎨",   cat:"Lifestyle", price:"0.99€" },
  { id:"samurai",      name:"Samouraï",          emoji:"⚔️",   cat:"Lifestyle", price:"0.99€" },
  { id:"viking",       name:"Viking",            emoji:"🪓",   cat:"Lifestyle", price:"0.99€" },
  { id:"ninja",        name:"Ninja",             emoji:"🥷",   cat:"Lifestyle", price:"0.99€" },
  // Premium (10)
  { id:"diamond_av",   name:"Diamant",           emoji:"💎",   cat:"Premium",   price:"0.99€" },
  { id:"crown",        name:"Couronne Royale",   emoji:"👑",   cat:"Premium",   price:"0.99€" },
  { id:"skull_neon",   name:"Crâne Néon",        emoji:"💀",   cat:"Premium",   price:"0.99€" },
  { id:"robot",        name:"Robot Cyber",       emoji:"🤖",   cat:"Premium",   price:"0.99€" },
  { id:"alien",        name:"Alien",             emoji:"👽",   cat:"Premium",   price:"0.99€" },
  { id:"infernal",     name:"Feu Infernal",      emoji:"🔥",   cat:"Premium",   price:"0.99€" },
  { id:"ice",          name:"Glace Arctique",    emoji:"❄️",   cat:"Premium",   price:"0.99€" },
  { id:"cosmic_star",  name:"Étoile Cosmique",   emoji:"⭐",   cat:"Premium",   price:"0.99€" },
  { id:"goat_gold",    name:"GOAT Doré",         emoji:"🐐✨",  cat:"Premium",   price:"0.99€" },
  { id:"goat_diamond", name:"GOAT Diamant",      emoji:"🐐💎",  cat:"Premium",   price:"0.99€" },
  // Exclusifs (10)
  { id:"muscle_skull", name:"Squelette Musclé",  emoji:"💀💪",  cat:"Exclusif",  price:"0.99€" },
  { id:"jellyfish",    name:"Méduse Néon",        emoji:"🪼",   cat:"Exclusif",  price:"0.99€" },
  { id:"illuminati",   name:"Oeil Illuminati",   emoji:"👁️",   cat:"Exclusif",  price:"0.99€" },
  { id:"dark_moon",    name:"Lune Sombre",        emoji:"🌑",   cat:"Exclusif",  price:"0.99€" },
  { id:"sun",          name:"Soleil Ardent",      emoji:"☀️",   cat:"Exclusif",  price:"0.99€" },
  { id:"storm",        name:"Tempête",            emoji:"⛈️",   cat:"Exclusif",  price:"0.99€" },
  { id:"volcano",      name:"Volcan",             emoji:"🌋",   cat:"Exclusif",  price:"0.99€" },
  { id:"galaxy",       name:"Galaxie",            emoji:"🌌",   cat:"Exclusif",  price:"0.99€" },
  { id:"ancient",      name:"Légende Antique",    emoji:"🏛️",   cat:"Exclusif",  price:"0.99€" },
  { id:"goat_ultimate",name:"GOAT Ultime",        emoji:"🐐🔥👑",cat:"Exclusif",  price:"0.99€" },
];

// ── SHOP FRAMES (25) ──
export const SHOP_FRAMES = [
  // Basiques (5)
  { id:"frame_white",         name:"Cadre Blanc",          color:"#ffffff",                                                    style:"solid",    animation:null,      free:true },
  { id:"frame_black",         name:"Cadre Noir",           color:"#333333",                                                    style:"solid",    animation:null,      price:"0.99€",  tier:"basic" },
  { id:"frame_steel",         name:"Cadre Acier",          color:"#78909C",                                                    style:"solid",    animation:null,      price:"0.99€",  tier:"basic" },
  { id:"frame_navy",          name:"Cadre Bleu Nuit",      color:"#1a237e",                                                    style:"solid",    animation:null,      price:"0.99€",  tier:"basic" },
  { id:"frame_forest",        name:"Cadre Vert Forêt",     color:"#1b5e20",                                                    style:"solid",    animation:null,      price:"0.99€",  tier:"basic" },
  // Dégradés (5)
  { id:"grad_sunset",         name:"Gradient Sunset",      color:"linear-gradient(135deg,#FF6D00,#E040FB)",                    style:"gradient", animation:null,      price:"0.99€",  tier:"gradient" },
  { id:"grad_ocean",          name:"Gradient Ocean",       color:"linear-gradient(135deg,#00B4D8,#0077B6)",                    style:"gradient", animation:null,      price:"0.99€",  tier:"gradient" },
  { id:"grad_flame",          name:"Gradient Flamme",      color:"linear-gradient(135deg,#FF1744,#FF6D00)",                    style:"gradient", animation:null,      price:"0.99€",  tier:"gradient" },
  { id:"grad_aurora",         name:"Gradient Aurore",      color:"linear-gradient(135deg,#00E676,#2979FF,#E040FB)",            style:"gradient", animation:null,      price:"0.99€",  tier:"gradient" },
  { id:"grad_neon",           name:"Gradient Néon",        color:"linear-gradient(135deg,#F50057,#00E5FF)",                    style:"gradient", animation:null,      price:"0.99€",  tier:"gradient" },
  // Animés (5)
  { id:"anim_gold_pulse",     name:"Pulse Doré",           color:"#FFD700",                                                    style:"solid",    animation:"pulse",   price:"0.99€",  tier:"animated" },
  { id:"anim_rainbow",        name:"Rotation Arc-en-ciel", color:"rainbow",                                                    style:"animated", animation:"rotate",  price:"0.99€",  tier:"animated" },
  { id:"anim_sparkle",        name:"Étincelles",           color:"#FFD700",                                                    style:"solid",    animation:"sparkle", price:"0.99€",  tier:"animated" },
  { id:"anim_glitch",         name:"Glitch Cyber",         color:"#F50057",                                                    style:"solid",    animation:"glitch",  price:"0.99€",  tier:"animated" },
  { id:"anim_flames",         name:"Flammes Animées",      color:"#FF6D00",                                                    style:"solid",    animation:"flames",  price:"0.99€",  tier:"animated" },
  // Premium (5)
  { id:"prem_diamond_rotate", name:"Diamant Rotatif",      color:"#B9F2FF",                                                    style:"solid",    animation:"rotate",  price:"0.99€",  tier:"premium" },
  { id:"prem_lava",           name:"Cadre Lave",           color:"linear-gradient(135deg,#DD2C00,#FF6D00)",                    style:"gradient", animation:"pulse",   price:"0.99€",  tier:"premium" },
  { id:"prem_holo",           name:"Holographique",        color:"linear-gradient(135deg,#E040FB,#00E5FF,#76FF03)",            style:"gradient", animation:"rotate",  price:"0.99€",  tier:"premium" },
  { id:"prem_lightning",      name:"Lightning",            color:"#FFEA00",                                                    style:"solid",    animation:"flash",   price:"0.99€",  tier:"premium" },
  { id:"prem_plasma",         name:"Plasma",               color:"linear-gradient(135deg,#7C4DFF,#00E5FF)",                    style:"gradient", animation:"pulse",   price:"0.99€",  tier:"premium" },
  // Légendaires (5)
  { id:"leg_goat_gold",       name:"GOAT Doré",            color:"#FFD700",                                                    style:"solid",    animation:"pulse",   price:"0.99€",  tier:"legendary" },
  { id:"leg_galaxy",          name:"Galaxie Animé",        color:"linear-gradient(135deg,#304FFE,#E040FB,#00E5FF)",            style:"gradient", animation:"rotate",  price:"0.99€",  tier:"legendary" },
  { id:"leg_divine",          name:"Feu Divin",            color:"linear-gradient(135deg,#FFD700,#FF1744)",                    style:"gradient", animation:"flames",  price:"0.99€", tier:"legendary" },
  { id:"leg_royal",           name:"Couronne Royale",      color:"#FFD700",                                                    style:"solid",    animation:"sparkle", price:"0.99€", tier:"legendary" },
  { id:"leg_ultimate",        name:"GOAT Ultime",          color:"linear-gradient(135deg,#FFD700,#FF6B35,#FF1744)",            style:"gradient", animation:"flames",  price:"0.99€", tier:"legendary" },
];

// ── SHOP THEMES (10) ──
export const SHOP_THEMES = [
  { id:"goat_classic",   name:"GOAT Classic",   price:null, free:true,
    dark:{  bg:"#0a0a0a", surface:"rgba(255,255,255,0.03)", border:"rgba(255,255,255,0.06)", accent:"#FF6B35", accentLight:"#FF6B3522", text:"#ffffff", textMuted:"#888888", textDim:"#666666", gold:"#FFD700" },
    light:{ bg:"#f5f5f0", surface:"#ffffff",                border:"#e0e0e0",                accent:"#FF6B35", accentLight:"#FF6B3515", text:"#111111", textMuted:"#666666", textDim:"#999999", gold:"#D4A017" } },
  { id:"midnight_blue",  name:"Midnight Blue",  price:"0.99€",
    dark:{  bg:"#0a1628", surface:"#112240",                border:"#1a3360",                accent:"#4a9eff", accentLight:"#4a9eff22", text:"#e0e8f0", textMuted:"#7a8da8", textDim:"#506680", gold:"#FFD700" },
    light:{ bg:"#f0f4f8", surface:"#ffffff",                border:"#d0dae8",                accent:"#1e3a5f", accentLight:"#1e3a5f15", text:"#1a1a1a", textMuted:"#5a6a7a", textDim:"#8a9aaa", gold:"#D4A017" } },
  { id:"crimson_fire",   name:"Crimson Fire",   price:"0.99€",
    dark:{  bg:"#1a0a0a", surface:"#2d1111",                border:"#3d1a1a",                accent:"#e74c3c", accentLight:"#e74c3c22", text:"#f0e0e0", textMuted:"#a07070", textDim:"#705050", gold:"#FFD700" },
    light:{ bg:"#fef5f5", surface:"#ffffff",                border:"#f0d0d0",                accent:"#c0392b", accentLight:"#c0392b15", text:"#1a1a1a", textMuted:"#7a5050", textDim:"#aa8080", gold:"#D4A017" } },
  { id:"forest",         name:"Forest",         price:"0.99€",
    dark:{  bg:"#0a1a0e", surface:"#112d18",                border:"#1a3d22",                accent:"#2ecc71", accentLight:"#2ecc7122", text:"#e0f0e0", textMuted:"#70a080", textDim:"#507060", gold:"#FFD700" },
    light:{ bg:"#f0f7f0", surface:"#ffffff",                border:"#c0e0c8",                accent:"#27ae60", accentLight:"#27ae6015", text:"#1a1a1a", textMuted:"#508060", textDim:"#80aa90", gold:"#D4A017" } },
  { id:"cyber_neon",     name:"Cyber Neon",     price:"0.99€",
    dark:{  bg:"#0d0015", surface:"#1a0030",                border:"#2a0050",                accent:"#e056fd", accentLight:"#e056fd22", text:"#f0e0ff", textMuted:"#9060b0", textDim:"#604080", gold:"#FFD700" },
    light:{ bg:"#f8f5ff", surface:"#ffffff",                border:"#e0d0f0",                accent:"#8e44ad", accentLight:"#8e44ad15", text:"#1a1a1a", textMuted:"#705090", textDim:"#a080c0", gold:"#D4A017" } },
  { id:"sunset_gold",    name:"Sunset Gold",    price:"0.99€",
    dark:{  bg:"#1a1000", surface:"#2d1d05",                border:"#3d2a0a",                accent:"#f39c12", accentLight:"#f39c1222", text:"#f0e8d0", textMuted:"#a08850", textDim:"#706040", gold:"#FFD700" },
    light:{ bg:"#fffaf0", surface:"#ffffff",                border:"#f0e0c0",                accent:"#e67e22", accentLight:"#e67e2215", text:"#1a1a1a", textMuted:"#7a6040", textDim:"#aa9070", gold:"#D4A017" } },
  { id:"arctic_ice",     name:"Arctic Ice",     price:"0.99€",
    dark:{  bg:"#001520", surface:"#002535",                border:"#003548",                accent:"#48cae4", accentLight:"#48cae422", text:"#e0f0f8", textMuted:"#6090a8", textDim:"#407080", gold:"#FFD700" },
    light:{ bg:"#f0faff", surface:"#ffffff",                border:"#c0e8f8",                accent:"#00b4d8", accentLight:"#00b4d815", text:"#1a1a1a", textMuted:"#4080a0", textDim:"#80b0c8", gold:"#D4A017" } },
  { id:"stealth_theme",  name:"Stealth",        price:"0.99€",
    dark:{  bg:"#0a0a0a", surface:"#151515",                border:"#222222",                accent:"#888888", accentLight:"#88888822", text:"#cccccc", textMuted:"#666666", textDim:"#444444", gold:"#999999" },
    light:{ bg:"#f5f5f5", surface:"#e0e0e0",                border:"#cccccc",                accent:"#555555", accentLight:"#55555515", text:"#222222", textMuted:"#777777", textDim:"#aaaaaa", gold:"#888888" } },
  { id:"luxury_gold",    name:"Luxury Gold",    price:"0.99€",
    dark:{  bg:"#0f0d05", surface:"#1a1608",                border:"#2a220a",                accent:"#f1c40f", accentLight:"#f1c40f22", text:"#f0e8d0", textMuted:"#a09060", textDim:"#706040", gold:"#FFD700" },
    light:{ bg:"#fffdf5", surface:"#fffff0",                border:"#e8e0c0",                accent:"#d4a017", accentLight:"#d4a01715", text:"#1a1a0a", textMuted:"#8a7a40", textDim:"#bba870", gold:"#D4A017" } },
  { id:"goat_prestige",  name:"GOAT Prestige",  price:"0.99€",
    dark:{  bg:"#050505", surface:"#0f0f0f",                border:"#1a1608",                accent:"#FFD700", accentLight:"#FFD70022", text:"#f0e8d0", textMuted:"#a09060", textDim:"#605838", gold:"#FFD700" },
    light:{ bg:"#ffffff", surface:"#fafaf5",                border:"#e8e0c0",                accent:"#1a1a1a", accentLight:"#1a1a1a10", text:"#0a0a0a", textMuted:"#5a5a4a", textDim:"#9a9a8a", gold:"#D4A017" } },
];

// ── DAILY QUEST POOL ──
export const DAILY_QUEST_POOL = [
  { t:"Log 1 séance",                 type:"session_count",    target:1,  xp:30 },
  { t:"Enregistre un PR",             type:"new_pr",           target:1,  xp:50 },
  { t:"Log 3 exercices",              type:"exercise_count",   target:3,  xp:25 },
  { t:"Séance > 45 min",              type:"session_duration", target:45, xp:40 },
  { t:"Log un exercice Pull",         type:"badge_pull",       target:1,  xp:20 },
  { t:"Log un exercice Squat",        type:"badge_squat",      target:1,  xp:20 },
  { t:"Bats un record vieux de 7j+",  type:"beat_old_pr",      target:7,  xp:60 },
  { t:"Termine une séance complète",  type:"session_finished", target:1,  xp:35 },
];

// ── ACHIEVEMENTS (18) ──
export const ACHIEVEMENTS = [
  { id:"first_pr",    name:"Premier PR",        desc:"Enregistre ton premier PR",         icon:"🏆", xp:50,   check:(ctx)=>ctx.prCount>=1 },
  { id:"10_prs",      name:"Collectionneur",    desc:"10 PRs enregistrés",                icon:"📦", xp:100,  check:(ctx)=>ctx.prCount>=10 },
  { id:"25_prs",      name:"Obsédé",            desc:"25 PRs",                            icon:"🔥", xp:200,  check:(ctx)=>ctx.prCount>=25 },
  { id:"50_prs",      name:"Machine",           desc:"50 PRs",                            icon:"🤖", xp:500,  check:(ctx)=>ctx.prCount>=50 },
  { id:"all_cats",    name:"Polyvalent",        desc:"PR dans 6 catégories",              icon:"🌈", xp:150,  check:(ctx)=>ctx.coveredCats>=6 },
  { id:"7_streak",    name:"Semaine parfaite",  desc:"7j de streak",                      icon:"🔥", xp:100,  check:(ctx)=>ctx.streak>=7 },
  { id:"30_streak",   name:"Mois de feu",       desc:"30j de streak",                     icon:"💀", xp:500,  check:(ctx)=>ctx.streak>=30 },
  { id:"100_streak",  name:"Légende",           desc:"100j de streak",                    icon:"🐐", xp:2000, check:(ctx)=>ctx.streak>=100 },
  { id:"bench_100",   name:"Club des 100",      desc:"100kg+ au bench",                   icon:"💯", xp:200,  check:(ctx)=>(ctx.prs.bench?.est||0)>=100 },
  { id:"squat_140",   name:"Squat Beast",       desc:"140kg+ au squat",                   icon:"🦵", xp:200,  check:(ctx)=>(ctx.prs.squat?.est||0)>=140 },
  { id:"deadlift_180",name:"Deadlift King",     desc:"180kg+ au deadlift",                icon:"👑", xp:200,  check:(ctx)=>(ctx.prs.deadlift?.est||0)>=180 },
  { id:"10_sessions", name:"Régulier",          desc:"10 séances",                        icon:"📋", xp:100,  check:(ctx)=>ctx.sessionCount>=10 },
  { id:"50_sessions", name:"Athlète",           desc:"50 séances",                        icon:"🏅", xp:300,  check:(ctx)=>ctx.sessionCount>=50 },
  { id:"first_duel",  name:"Challenger",        desc:"Gagne 1 duel",                      icon:"⚔️", xp:75,   check:(ctx)=>ctx.duelsWon>=1 },
  { id:"5_duels",     name:"Gladiateur",        desc:"Gagne 5 duels",                     icon:"🗡️", xp:200,  check:(ctx)=>ctx.duelsWon>=5 },
  { id:"share_card",  name:"Influenceur",       desc:"Partage 1 PR card",                 icon:"📤", xp:50,   check:(ctx)=>ctx.sharesCount>=1 },
  { id:"buy_skin",    name:"Stylé",             desc:"Achète 1 cosmétique",               icon:"🎨", xp:25,   check:(ctx)=>ctx.purchaseCount>=1 },
  { id:"premium_ach", name:"VIP",              desc:"Passe Premium",                      icon:"👑", xp:100,  check:(ctx)=>!!ctx.premium },
];

// ── TITLES (11) ──
export const TITLES = [
  { id:"none",        name:"Aucun",              free:true },
  { id:"beast",       name:"La Bête",            price:"0.99€" },
  { id:"machine",     name:"The Machine",        price:"0.99€" },
  { id:"iron_will",   name:"Volonté de fer",     price:"0.99€" },
  { id:"goat_title",  name:"The GOAT",           price:"0.99€", minLevel:10 },
  { id:"legend",      name:"Légende vivante",    price:"0.99€", minLevel:12 },
  { id:"unstoppable", name:"Inarrêtable",        price:"0.99€" },
  { id:"destroyer",   name:"Le Destructeur",     price:"0.99€" },
  { id:"iron_mind",   name:"Mental d'acier",     price:"0.99€" },
  { id:"no_excuses",  name:"No Excuses",         price:"0.99€" },
  { id:"king",        name:"Le Roi",             price:"0.99€", minLevel:8 },
];
