// ============ KEYVIBE CONFIGURATION ============

const LOCAL_CONFIG = window.KEYVIBE_LOCAL_CONFIG || {};

// Supabase Configuration
const SUPABASE_URL = 'https://skkihzfidzukzesnbumu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_FtET1F1wc7yiHcsmJ1r83w_N_j6MGVK';

// Firebase Authentication Configuration
const FIREBASE_CONFIG = {
    apiKey: 'AIzaSyDHUEyDc8Y6AHhmeBdwg8Gr5JCOQLUzAjs',
    authDomain: 'keyvibe-adfe9.firebaseapp.com',
    projectId: 'keyvibe-adfe9',
    appId: '1:923616182428:web:5bc355c5510486bb16ad59',
    messagingSenderId: '923616182428',
    storageBucket: 'keyvibe-adfe9.firebasestorage.app'
};

const OWNER_EMAILS = (LOCAL_CONFIG.ownerEmails || [])
    .map((email) => String(email || '').toLowerCase())
    .filter(Boolean);

// Rank System
const RANKS = [
    { name: 'Beginner', min: 0, color: '#6b6b8a', bg: 'rgba(107,107,138,0.15)', icon: 'BG', motif: 'seed' },
    { name: 'Novice', min: 35, color: '#4fc3a1', bg: 'rgba(79,195,161,0.15)', icon: 'NV', motif: 'leaf' },
    { name: 'Apprentice', min: 50, color: '#64b5f6', bg: 'rgba(100,181,246,0.15)', icon: 'AP', motif: 'spark' },
    { name: 'Typist', min: 65, color: '#7c6af7', bg: 'rgba(124,106,247,0.15)', icon: 'TY', motif: 'keys' },
    { name: 'Skilled', min: 80, color: '#ff8a65', bg: 'rgba(255,138,101,0.15)', icon: 'SK', motif: 'flame' },
    { name: 'Expert', min: 100, color: '#ffd54f', bg: 'rgba(255,213,79,0.15)', icon: 'EX', motif: 'bolt' },
    { name: 'Master', min: 120, color: '#ce93d8', bg: 'rgba(206,147,216,0.15)', icon: 'MS', motif: 'crystal' },
    { name: 'Grandmaster', min: 150, color: '#f06292', bg: 'rgba(240,98,146,0.15)', icon: 'GM', motif: 'crown' },
    { name: 'Legend', min: 200, color: '#ffcc02', bg: 'rgba(255,204,2,0.15)', icon: 'LG', motif: 'star' }
];

function getRank(wpm) {
    let rank = RANKS[0];
    for (let r of RANKS) {
        if (wpm >= r.min) rank = r;
    }
    return rank;
}

const RANK_LABELS = {
    en: { Beginner: 'Beginner', Novice: 'Novice', Apprentice: 'Apprentice', Typist: 'Typist', Skilled: 'Skilled', Expert: 'Expert', Master: 'Master', Grandmaster: 'Grandmaster', Legend: 'Legend' },
    id: { Beginner: 'Pemula', Novice: 'Novice', Apprentice: 'Apprentice', Typist: 'Typist', Skilled: 'Skilled', Expert: 'Expert', Master: 'Master', Grandmaster: 'Grandmaster', Legend: 'Legend' },
    es: { Beginner: 'Principiante', Novice: 'Novato', Apprentice: 'Aprendiz', Typist: 'Mecanografo', Skilled: 'Diestro', Expert: 'Experto', Master: 'Maestro', Grandmaster: 'Gran Maestro', Legend: 'Leyenda' },
    fr: { Beginner: 'Debutant', Novice: 'Novice', Apprentice: 'Apprenti', Typist: 'Dactylo', Skilled: 'Habile', Expert: 'Expert', Master: 'Maitre', Grandmaster: 'Grand Maitre', Legend: 'Legende' },
    de: { Beginner: 'Anfanger', Novice: 'Neuling', Apprentice: 'Lehrling', Typist: 'Tipper', Skilled: 'Geubt', Expert: 'Experte', Master: 'Meister', Grandmaster: 'Grossmeister', Legend: 'Legende' },
    it: { Beginner: 'Principiante', Novice: 'Novizio', Apprentice: 'Apprendista', Typist: 'Dattilografo', Skilled: 'Abile', Expert: 'Esperto', Master: 'Maestro', Grandmaster: 'Gran Maestro', Legend: 'Leggenda' },
    pt: { Beginner: 'Iniciante', Novice: 'Novato', Apprentice: 'Aprendiz', Typist: 'Digitador', Skilled: 'Habilidoso', Expert: 'Especialista', Master: 'Mestre', Grandmaster: 'Grao-Mestre', Legend: 'Lenda' },
    nl: { Beginner: 'Beginner', Novice: 'Nieuweling', Apprentice: 'Leerling', Typist: 'Typist', Skilled: 'Bekwaam', Expert: 'Expert', Master: 'Meester', Grandmaster: 'Grootmeester', Legend: 'Legende' },
    tr: { Beginner: 'Baslangic', Novice: 'Acemi', Apprentice: 'Cirak', Typist: 'Daktilocu', Skilled: 'Yetenekli', Expert: 'Uzman', Master: 'Usta', Grandmaster: 'Buyuk Usta', Legend: 'Efsane' },
    sv: { Beginner: 'Nybörjare', Novice: 'Novis', Apprentice: 'Larling', Typist: 'Maskinskrivare', Skilled: 'Skicklig', Expert: 'Expert', Master: 'Master', Grandmaster: 'Stormastare', Legend: 'Legend' },
    pl: { Beginner: 'Poczatkujacy', Novice: 'Nowicjusz', Apprentice: 'Praktykant', Typist: 'Maszynista', Skilled: 'Wprawny', Expert: 'Ekspert', Master: 'Mistrz', Grandmaster: 'Arcymistrz', Legend: 'Legenda' },
    ro: { Beginner: 'Incepator', Novice: 'Novice', Apprentice: 'Ucenic', Typist: 'Dactilograf', Skilled: 'Priceput', Expert: 'Expert', Master: 'Maestru', Grandmaster: 'Mare Maestru', Legend: 'Legenda' }
};

function getRankLabel(name) {
    const language = getCurrentLanguage();
    const pack = RANK_LABELS[language] || RANK_LABELS.en;
    return pack[name] || RANK_LABELS.en[name] || name;
}

const XP_LEVEL_STEP = 120;

const XP_TITLES = [
    { level: 1, name: 'Rookie' },
    { level: 3, name: 'Flow Finder' },
    { level: 5, name: 'Rhythm Runner' },
    { level: 8, name: 'Vibe Builder' },
    { level: 12, name: 'Key Striker' },
    { level: 16, name: 'Pulse Driver' },
    { level: 20, name: 'Neon Phantom' },
    { level: 25, name: 'Legend Circuit' }
];

function getXpForLevel(level) {
    const safeLevel = Math.max(1, Number(level) || 1);
    return Math.round(Math.pow(safeLevel - 1, 2) * XP_LEVEL_STEP);
}

function getLevelFromXp(xp) {
    const safeXp = Math.max(0, Number(xp) || 0);
    return Math.floor(Math.sqrt(safeXp / XP_LEVEL_STEP)) + 1;
}

function getXpProgress(xp) {
    const safeXp = Math.max(0, Number(xp) || 0);
    const level = getLevelFromXp(safeXp);
    const currentLevelXp = getXpForLevel(level);
    const nextLevelXp = getXpForLevel(level + 1);
    const span = Math.max(1, nextLevelXp - currentLevelXp);
    const progress = Math.min(100, Math.round(((safeXp - currentLevelXp) / span) * 100));

    return {
        level,
        currentLevelXp,
        nextLevelXp,
        progress,
        remainingXp: Math.max(0, nextLevelXp - safeXp)
    };
}

function getXpTitle(level) {
    let title = XP_TITLES[0];
    for (const item of XP_TITLES) {
        if (level >= item.level) {
            title = item;
        }
    }
    return title;
}

const BADGE_DEFINITIONS = [
    { id: 'owner-core', tag: 'OWNR', name: 'Owner Core', motif: 'crown', palette: ['#ffcc02', '#ff8a65'], isUnlocked: (data) => OWNER_EMAILS.includes((data?.email || '').toLowerCase()) },
    { id: 'first-steps', tag: 'START', name: 'First Steps', motif: 'steps', palette: ['#7c6af7', '#4fc3a1'], isUnlocked: (data, meta) => (data.totalTests || 0) >= 1 },
    { id: 'level-5', tag: 'LVL5', name: 'Level 5', motif: 'diamond', palette: ['#6f8cff', '#7c6af7'], isUnlocked: (data, meta) => meta.level >= 5 },
    { id: 'level-10', tag: 'LVL10', name: 'Level 10', motif: 'hex', palette: ['#9f6bff', '#ff78d1'], isUnlocked: (data, meta) => meta.level >= 10 },
    { id: 'wpm-50', tag: 'W50', name: '50+ WPM', motif: 'speed', palette: ['#4fc3a1', '#69f0ae'], isUnlocked: (data) => (data.bestWpm || 0) >= 50 },
    { id: 'typist-65', tag: 'T65', name: 'Typist 65+', motif: 'keys', palette: ['#55d1ff', '#7c6af7'], isUnlocked: (data) => (data.bestWpm || 0) >= 65 },
    { id: 'expert-100', tag: 'X100', name: 'Expert 100+', motif: 'bolt', palette: ['#ffb74d', '#ffd54f'], isUnlocked: (data) => (data.bestWpm || 0) >= 100 },
    { id: 'master-120', tag: 'M120', name: 'Master 120+', motif: 'crystal', palette: ['#ce93d8', '#7c6af7'], isUnlocked: (data) => (data.bestWpm || 0) >= 120 },
    { id: 'gm-150', tag: 'GM150', name: 'Grandmaster 150+', motif: 'crown', palette: ['#f06292', '#ff9fba'], isUnlocked: (data) => (data.bestWpm || 0) >= 150 },
    { id: 'perfect-acc', tag: 'ACC', name: 'Perfect Accuracy', motif: 'target', palette: ['#69f0ae', '#4fc3a1'], isUnlocked: (data) => (data.history || []).some((x) => x.acc === 100) },
    { id: 'legend-200', tag: 'L200', name: 'Legend 200+', motif: 'star', palette: ['#ffcc02', '#ffd54f'], isUnlocked: (data) => (data.bestWpm || 0) >= 200 },
    { id: 'combo-30', tag: 'C30', name: '30 Combo', motif: 'orbit', palette: ['#ff8a65', '#ffb74d'], isUnlocked: (data) => (data.maxCombo || 0) >= 30 },
    { id: 'combo-50', tag: 'C50', name: '50 Combo', motif: 'meteor', palette: ['#f06292', '#ffcc02'], isUnlocked: (data) => (data.maxCombo || 0) >= 50 },
    { id: 'tests-10', tag: 'T10', name: '10 Tests', motif: 'ticket', palette: ['#64b5f6', '#4fc3a1'], isUnlocked: (data) => (data.totalTests || 0) >= 10 },
    { id: 'tests-100', tag: 'T100', name: '100 Tests', motif: 'stack', palette: ['#7c6af7', '#ff8a65'], isUnlocked: (data) => (data.totalTests || 0) >= 100 }
];

function getBadgeCollection(data) {
    const xpMeta = getXpProgress(data?.xp || 0);
    return BADGE_DEFINITIONS.map((badge) => ({
        ...badge,
        unlocked: badge.isUnlocked(data || {}, xpMeta)
    }));
}

function getMotifMarkup(motif, primary, secondary, edge) {
    switch (motif) {
        case 'steps':
            return `
  <path d="M34 50L42 42L48 48L40 56L34 50Z" fill="${primary}" stroke="${edge}" stroke-width="1.2"/>
  <path d="M48 40L56 32L62 38L54 46L48 40Z" fill="${secondary}" stroke="${edge}" stroke-width="1.2"/>`;
        case 'diamond':
            return `
  <polygon points="48,27 63,42 48,57 33,42" fill="${primary}" stroke="${edge}" stroke-width="1.5"/>
  <polygon points="48,34 56,42 48,50 40,42" fill="${secondary}" opacity="0.95"/>`;
        case 'hex':
            return `
  <polygon points="48,27 61,35 61,49 48,57 35,49 35,35" fill="${primary}" stroke="${edge}" stroke-width="1.5"/>
  <path d="M41 38H55M41 46H55" stroke="${secondary}" stroke-width="2" stroke-linecap="round"/>`;
        case 'speed':
            return `
  <path d="M30 46H58" stroke="${primary}" stroke-width="5" stroke-linecap="round"/>
  <path d="M36 38H62" stroke="${secondary}" stroke-width="4" stroke-linecap="round" opacity="0.95"/>
  <path d="M38 54H54" stroke="${edge}" stroke-width="3" stroke-linecap="round" opacity="0.9"/>`;
        case 'keys':
            return `
  <rect x="31" y="33" width="12" height="12" rx="4" fill="${primary}" stroke="${edge}" stroke-width="1.2"/>
  <rect x="45" y="33" width="12" height="12" rx="4" fill="${secondary}" stroke="${edge}" stroke-width="1.2"/>
  <rect x="38" y="47" width="20" height="12" rx="4" fill="#101322" stroke="${edge}" stroke-width="1.2"/>`;
        case 'bolt':
            return `
  <polygon points="50,27 39,45 47,45 42,59 58,39 49,39" fill="${primary}" stroke="${edge}" stroke-width="1.4" stroke-linejoin="round"/>`;
        case 'crystal':
            return `
  <polygon points="48,24 60,38 54,58 42,58 36,38" fill="${primary}" stroke="${edge}" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M48 24V58M36 38H60" stroke="${secondary}" stroke-width="1.6" opacity="0.95"/>`;
        case 'crown':
            return `
  <path d="M32 54L36 34L46 44L54 30L60 44L68 36L64 54H32Z" fill="${primary}" stroke="${edge}" stroke-width="1.4" stroke-linejoin="round"/>
  <circle cx="36" cy="34" r="2.5" fill="${secondary}"/>
  <circle cx="54" cy="30" r="2.5" fill="${secondary}"/>
  <circle cx="68" cy="36" r="2.5" fill="${secondary}"/>`;
        case 'target':
            return `
  <circle cx="48" cy="42" r="14" fill="none" stroke="${primary}" stroke-width="4"/>
  <circle cx="48" cy="42" r="7" fill="none" stroke="${secondary}" stroke-width="3"/>
  <circle cx="48" cy="42" r="3.5" fill="${edge}"/>
  <path d="M48 24V31M48 53V60M30 42H37M59 42H66" stroke="${edge}" stroke-width="2" stroke-linecap="round"/>`;
        case 'star':
            return `
  <polygon points="48,26 53,37 66,39 56,47 59,60 48,53 37,60 40,47 30,39 43,37" fill="${primary}" stroke="${edge}" stroke-width="1.4" stroke-linejoin="round"/>`;
        case 'orbit':
            return `
  <ellipse cx="48" cy="42" rx="16" ry="8" fill="none" stroke="${primary}" stroke-width="2.8"/>
  <ellipse cx="48" cy="42" rx="8" ry="16" fill="none" stroke="${secondary}" stroke-width="2.2"/>
  <circle cx="48" cy="42" r="4" fill="${edge}"/>`;
        case 'meteor':
            return `
  <path d="M32 50C38 42 44 38 54 36L48 46L58 44C50 50 42 54 32 50Z" fill="${secondary}" opacity="0.95"/>
  <circle cx="58" cy="36" r="8" fill="${primary}" stroke="${edge}" stroke-width="1.4"/>`;
        case 'ticket':
            return `
  <path d="M34 33H62V39C59 39 57 41 57 44C57 47 59 49 62 49V55H34V49C37 49 39 47 39 44C39 41 37 39 34 39V33Z" fill="${primary}" stroke="${edge}" stroke-width="1.4"/>
  <path d="M48 35V53" stroke="${secondary}" stroke-width="2" stroke-dasharray="2 3"/>`;
        case 'stack':
            return `
  <rect x="34" y="30" width="22" height="8" rx="3" fill="${primary}" stroke="${edge}" stroke-width="1.2"/>
  <rect x="30" y="41" width="30" height="8" rx="3" fill="${secondary}" stroke="${edge}" stroke-width="1.2"/>
  <rect x="36" y="52" width="18" height="8" rx="3" fill="#101322" stroke="${edge}" stroke-width="1.2"/>`;
        case 'seed':
            return `
  <path d="M48 56C40 53 36 47 36 41C36 34 41 29 48 28C55 29 60 34 60 41C60 47 56 53 48 56Z" fill="${primary}" stroke="${edge}" stroke-width="1.3"/>
  <path d="M48 33V52" stroke="${secondary}" stroke-width="2" stroke-linecap="round"/>`;
        case 'leaf':
            return `
  <path d="M34 48C34 35 44 28 58 28C58 42 52 54 38 58C35 55 34 52 34 48Z" fill="${primary}" stroke="${edge}" stroke-width="1.3"/>
  <path d="M39 52C46 45 50 40 57 33" stroke="${secondary}" stroke-width="2" stroke-linecap="round"/>`;
        case 'spark':
            return `
  <path d="M48 28L52 38L62 42L52 46L48 56L44 46L34 42L44 38L48 28Z" fill="${primary}" stroke="${edge}" stroke-width="1.3" stroke-linejoin="round"/>`;
        case 'flame':
            return `
  <path d="M48 58C40 54 37 48 38 42C39 36 44 33 46 28C49 31 53 35 56 39C59 43 59 51 48 58Z" fill="${primary}" stroke="${edge}" stroke-width="1.3" stroke-linejoin="round"/>
  <path d="M48 52C44 50 43 46 44 43C45 40 47 38 48 35C50 38 52 41 52 44C52 47 51 50 48 52Z" fill="${secondary}" opacity="0.95"/>`;
        default:
            return `
  <circle cx="48" cy="42" r="12" fill="${primary}" stroke="${edge}" stroke-width="1.3"/>
  <circle cx="48" cy="42" r="5" fill="${secondary}"/>`;
    }
}

function getBadgeShellMarkup(motif, primary, secondary, edge, glow) {
    switch (motif) {
        case 'steps':
        case 'speed':
        case 'meteor':
            return `
  <path d="M20 45C20 30 32 20 48 20C64 20 76 30 76 45C76 58 68 71 48 78C28 71 20 58 20 45Z" fill="${glow}" fill-opacity="0.18"/>
  <path d="M48 16L69 27L73 50C70 64 60 76 48 80C36 76 26 64 23 50L27 27L48 16Z" fill="#0f1020" stroke="${edge}" stroke-width="2"/>
  <path d="M48 24L63 32L66 49C64 59 57 68 48 72C39 68 32 59 30 49L33 32L48 24Z" fill="url(#g)" opacity="0.96"/>`;
        case 'diamond':
        case 'hex':
        case 'crystal':
            return `
  <path d="M48 14L70 26L78 48L70 70L48 82L26 70L18 48L26 26L48 14Z" fill="${glow}" fill-opacity="0.16"/>
  <path d="M48 18L66 28L72 48L66 68L48 78L30 68L24 48L30 28L48 18Z" fill="#111325" stroke="${edge}" stroke-width="2"/>
  <path d="M48 24L61 31L66 48L61 65L48 72L35 65L30 48L35 31L48 24Z" fill="url(#g)" opacity="0.95"/>`;
        case 'keys':
        case 'ticket':
        case 'stack':
            return `
  <rect x="16" y="18" width="64" height="60" rx="18" fill="${glow}" fill-opacity="0.16"/>
  <rect x="18" y="20" width="60" height="56" rx="18" fill="#121327" stroke="${edge}" stroke-width="2"/>
  <rect x="24" y="26" width="48" height="44" rx="14" fill="url(#g)" opacity="0.96"/>`;
        case 'crown':
        case 'star':
        case 'target':
            return `
  <circle cx="48" cy="46" r="31" fill="${glow}" fill-opacity="0.18"/>
  <path d="M48 16L56 27L69 24L66 37L78 45L66 53L69 66L56 63L48 74L40 63L27 66L30 53L18 45L30 37L27 24L40 27L48 16Z" fill="#111325" stroke="${edge}" stroke-width="2" stroke-linejoin="round"/>
  <path d="M48 23L54 31L64 29L62 39L71 45L62 51L64 61L54 59L48 67L42 59L32 61L34 51L25 45L34 39L32 29L42 31L48 23Z" fill="url(#g)" opacity="0.95" stroke="${edge}" stroke-opacity="0.18"/>`;
        default:
            return `
  <circle cx="48" cy="48" r="31" fill="${glow}" fill-opacity="0.16"/>
  <circle cx="48" cy="48" r="28" fill="#111325" stroke="${edge}" stroke-width="2"/>
  <circle cx="48" cy="48" r="22" fill="url(#g)" opacity="0.95"/>`;
    }
}

function getRankShellMarkup(rank, primary, edge, achieved, current) {
    const aura = achieved ? rank.bg.replace('0.15', '0.28') : 'rgba(37,37,64,0.55)';
    switch (rank.motif) {
        case 'seed':
        case 'leaf':
        case 'flame':
            return `
  <path d="M42 10L60 16L71 33V51L60 68L42 74L24 68L13 51V33L24 16L42 10Z" fill="${aura}" stroke="${edge}" stroke-width="2"/>
  <circle cx="42" cy="42" r="18" fill="#111325" stroke="${edge}" stroke-opacity="0.45" stroke-width="1.2"/>`;
        case 'spark':
        case 'bolt':
        case 'star':
            return `
  <path d="M42 8L51 18L64 15L61 28L74 36L61 44L64 57L51 54L42 64L33 54L20 57L23 44L10 36L23 28L20 15L33 18L42 8Z" fill="${aura}" stroke="${edge}" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="42" cy="36" r="15" fill="#111325" stroke="${edge}" stroke-opacity="0.45" stroke-width="1.2"/>`;
        case 'keys':
        case 'crystal':
            return `
  <rect x="12" y="12" width="60" height="60" rx="18" fill="${aura}" stroke="${edge}" stroke-width="2"/>
  <rect x="20" y="20" width="44" height="44" rx="14" fill="#111325" stroke="${edge}" stroke-opacity="0.45" stroke-width="1.2"/>`;
        case 'crown':
            return `
  <path d="M16 60L22 24L34 38L42 18L50 38L62 24L68 60H16Z" fill="${aura}" stroke="${edge}" stroke-width="2" stroke-linejoin="round"/>
  <rect x="24" y="48" width="36" height="20" rx="10" fill="#111325" stroke="${edge}" stroke-opacity="0.45" stroke-width="1.2"/>`;
        default:
            return `
  <rect x="10" y="10" width="64" height="64" rx="${current ? '22' : '18'}" fill="${aura}" stroke="${edge}" stroke-width="2"/>
  <circle cx="42" cy="42" r="17" fill="#111325" stroke="${edge}" stroke-opacity="0.45" stroke-width="1.2"/>`;
    }
}

function getBadgeArt(badge, equipped) {
    const colors = badge?.palette || ['#7c6af7', '#4fc3a1'];
    const primary = badge?.unlocked ? colors[0] : '#4b4b62';
    const secondary = badge?.unlocked ? colors[1] : '#2f3146';
    const edge = equipped ? '#ffffff' : (badge?.unlocked ? '#b8b8ff' : '#5a5a7a');
    const glow = badge?.unlocked ? primary : '#252540';
    const status = equipped ? 'EQUIPPED' : (badge?.unlocked ? 'OWNED' : 'LOCKED');

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
  <defs>
    <linearGradient id="g" x1="14" y1="14" x2="82" y2="84" gradientUnits="userSpaceOnUse">
      <stop stop-color="${primary}"/>
      <stop offset="1" stop-color="${secondary}"/>
    </linearGradient>
    <linearGradient id="shine" x1="24" y1="20" x2="72" y2="74" gradientUnits="userSpaceOnUse">
      <stop stop-color="rgba(255,255,255,0.24)"/>
      <stop offset="1" stop-color="rgba(255,255,255,0.04)"/>
    </linearGradient>
  </defs>
  <circle cx="22" cy="22" r="4" fill="${secondary}" opacity="${badge?.unlocked ? '0.75' : '0.3'}"/>
  <circle cx="72" cy="18" r="3" fill="${primary}" opacity="${badge?.unlocked ? '0.8' : '0.3'}"/>
  <circle cx="78" cy="70" r="4" fill="${secondary}" opacity="${badge?.unlocked ? '0.75' : '0.3'}"/>
  <circle cx="18" cy="74" r="2.5" fill="${primary}" opacity="${badge?.unlocked ? '0.7' : '0.3'}"/>
  ${getBadgeShellMarkup(badge?.motif, primary, secondary, edge, glow)}
  <ellipse cx="48" cy="43" rx="17" ry="14" fill="${glow}" fill-opacity="${badge?.unlocked ? '0.18' : '0.08'}"/>
  ${getMotifMarkup(badge?.motif, primary, secondary, edge)}
  <path d="M28 68H68L62 80H34L28 68Z" fill="#0d0f19" stroke="${edge}" stroke-opacity="0.35"/>
  <text x="48" y="76" text-anchor="middle" fill="#F4F5FF" font-family="Outfit, Arial, sans-serif" font-size="8" font-weight="700" letter-spacing="1">${status}</text>
  <path d="M34 28C40 24 56 24 62 28" stroke="url(#shine)" stroke-width="3" stroke-linecap="round" opacity="${badge?.unlocked ? '0.8' : '0.25'}"/>
</svg>`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getRankArt(rank, achieved, current) {
    const primary = current ? getThemeColor() : (achieved ? rank.color : '#4b4b62');
    const secondary = achieved ? '#f6f7ff' : '#2f3146';
    const edge = current ? '#ffffff' : (achieved ? '#b8b8ff' : '#5a5a7a');

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="84" height="84" viewBox="0 0 84 84" fill="none">
  <circle cx="20" cy="20" r="3.5" fill="${primary}" opacity="${achieved ? '0.75' : '0.28'}"/>
  <circle cx="64" cy="19" r="2.5" fill="${secondary}" opacity="${achieved ? '0.8' : '0.28'}"/>
  <circle cx="66" cy="62" r="3.5" fill="${primary}" opacity="${achieved ? '0.75' : '0.28'}"/>
  ${getRankShellMarkup(rank, primary, edge, achieved, current)}
  ${getMotifMarkup(rank.motif, primary, secondary, edge)}
  <path d="M24 64H60" stroke="${edge}" stroke-opacity="0.22" stroke-width="1.2"/>
</svg>`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

// Word Pools
const WORDS = {
    easy: 'the be to of and a in that have it for not on with he as you do at this but his by from they we say her she or will one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us have good great keep same turn old let hand play place'.split(' '),
    medium: 'ability access achieve action active address advance affect afford agree ahead allow amount ancient answer appear apply argue arrive aspect assess assist assume attach attempt attract balance benefit billion border branch bridge budget career careful chance change charge choice claim clear climate collect complex concern conduct confirm connect consider contain control correct create culture current decide define design develop discuss display divide effect effort enable engage ensure entire equal escape estimate evidence evolve examine expand expect explain explore express extend extreme factor feature figure focus formal forward global govern ground growth health impact improve include increase inform involve issue journey justice market method moment natural object opinion pattern period person place point possible present problem produce provide public question reason recent record region relate report result return review search series simple social society source state study subject system theory travel understand value'.split(' '),
    hard: 'accommodate acknowledgment approximately architecture collaboration comprehensive consequently contemporary contradictory conventional deliberately demonstration determination differentiate disambiguation documentation electromagnetic entrepreneurial establishment extraordinary exaggeration experimentation fundamentally hallucination implementation independently infrastructure institutionalize intellectually internationally interpretation investigation knowledgeable manifestation misinterpretation misrepresentation multiplication neighborhoods nevertheless opportunities organizational participation pharmaceutical philosophical predominantly pronunciation psychological recommendations responsibilities sophisticated straightforward subconsciously substantially technological transformation unconventional vulnerability wholeheartedly acknowledgement simultaneously catastrophically'.split(' ')
};

const LANGUAGE_OPTIONS = [
    { key: 'en', nativeLabel: 'English' },
    { key: 'id', nativeLabel: 'Bahasa Indonesia' },
    { key: 'es', nativeLabel: 'Espanol' },
    { key: 'fr', nativeLabel: 'Francais' },
    { key: 'de', nativeLabel: 'Deutsch' },
    { key: 'it', nativeLabel: 'Italiano' },
    { key: 'pt', nativeLabel: 'Portugues' },
    { key: 'nl', nativeLabel: 'Nederlands' },
    { key: 'tr', nativeLabel: 'Turkce' },
    { key: 'sv', nativeLabel: 'Svenska' },
    { key: 'pl', nativeLabel: 'Polski' },
    { key: 'ro', nativeLabel: 'Romana' }
];

function isValidLanguage(code) {
    return LANGUAGE_OPTIONS.some((option) => option.key === code);
}

function getCurrentLanguage() {
    const code = window.App?.currentLanguage;
    return isValidLanguage(code) ? code : 'en';
}

function getLanguageLabel(code) {
    const option = LANGUAGE_OPTIONS.find((entry) => entry.key === code);
    const fallback = option?.nativeLabel || code;
    const translated = t(`language_${code}`);
    return translated !== `language_${code}` ? translated : fallback;
}

function getThemeColor() {
    const themeKey = document.documentElement.getAttribute('data-theme') || 'default';
    return THEMES[themeKey]?.color || THEMES.default.color;
}

function hexToRgba(hex, alpha) {
    const normalized = String(hex || '').replace('#', '');
    const full = normalized.length === 3
        ? normalized.split('').map((char) => char + char).join('')
        : normalized.padEnd(6, '0').slice(0, 6);
    const r = parseInt(full.slice(0, 2), 16) || 0;
    const g = parseInt(full.slice(2, 4), 16) || 0;
    const b = parseInt(full.slice(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const UI_TRANSLATIONS = {
    en: {
        nav_practice: 'Practice',
        nav_multiplayer: 'Multiplayer',
        nav_leaderboard: 'Leaderboard',
        nav_profile: 'Profile',
        owner_badge: 'OWNER',
        auth_subtitle: 'Sign in with Google to sync your progress, nickname, and multiplayer identity.',
        auth_google: 'Continue with Google',
        auth_guest: 'Continue as Guest (instant play)',
        auth_guest_short: 'Continue as Guest',
        auth_opening_google: 'Opening Google...',
        auth_google_connecting: 'Google account connected. Finishing sign-in...',
        auth_google_error: 'Could not sign in with Google.',
        auth_need_signin: 'You need to sign in first.',
        stats_best: 'Best WPM',
        stats_avg: 'Avg WPM',
        stats_tests: 'Tests',
        stats_rank: 'Rank',
        mode_practice: 'Practice',
        mode_ranked: 'Ranked',
        difficulty_easy: 'Easy',
        difficulty_medium: 'Medium',
        difficulty_hard: 'Hard',
        hint_start: 'Click or tap the text box to start typing',
        caps_lock: 'Caps Lock is on',
        recent_results: 'Recent Results',
        no_tests: 'No tests yet - start typing above!',
        ranked_title: 'Ranked Mode',
        ranked_desc: 'Login required. No pausing. 60-second timed test. Give it your best shot!',
        ranked_history: 'Ranked History',
        no_ranked: 'No ranked matches yet.',
        multiplayer_title: 'Multiplayer Arena',
        multiplayer_heading: 'Play Live With Friends',
        multiplayer_sub: 'Create a room or join with a code',
        create_room: 'Create Room',
        join: 'Join',
        room_code: 'Room Code',
        share_room: 'Share this code with friends',
        waiting_players: 'Waiting for players...',
        start_match_need: 'Start Match (need 2+ players)',
        live_room: 'Live room',
        shared_text: 'Shared text',
        waiting_match: 'Waiting for the match to start...',
        leaderboard_title: 'Global Leaderboard',
        leaderboard_player: 'Player',
        profile_photo: 'Profile Photo',
        using_default_photo: 'Using your Google profile photo',
        using_custom_avatar: 'Using your custom avatar',
        nickname: 'Nickname',
        nickname_placeholder: 'How your name should appear',
        upload_avatar: 'Upload Avatar',
        use_default: 'Use Default',
        save_profile: 'Save Profile',
        statistics: 'Statistics',
        badge_collection: 'Badge Collection',
        rank_progression: 'Rank Progression',
        title_label: 'Title',
        equipped_badge: 'Equipped Badge',
        none_yet: 'None yet',
        badges_unlocked: '{{owned}} of {{total}} badges unlocked',
        current_title: 'Current Title',
        level_label: 'Level',
        total_xp: 'Total XP',
        average_wpm: 'Average WPM',
        average_accuracy: 'Average Accuracy',
        tests_done: 'Tests Done',
        total_errors: 'Total Errors',
        xp_to_next: 'XP To Next Level',
        best_combo: 'Best Combo',
        email: 'Email',
        role_owner: 'Role',
        owner_role_value: 'Owner',
        current: 'Current',
        ok: 'OK',
        locked: 'Locked',
        unlocked: 'Unlocked',
        click_to_equip: 'Unlocked - click to equip',
        equipped: 'Equipped',
        language_next_race: 'Language will apply to the next multiplayer race.',
        welcome_user: 'Welcome, {{name}}!',
        sign_in_to_equip: 'Sign in first to equip badges.',
        badge_equipped: 'Badge equipped.',
        badge_cleared: 'Badge cleared.',
        choose_image: 'Please choose an image file.',
        image_under_limit: 'Please use an image under 1 MB.',
        room_created: 'Room created: {{code}}',
        room_joined: 'Joined room: {{code}}',
        room_create_fail: 'Could not create room.',
        room_join_fail: 'Could not join room.',
        room_code_invalid: 'Enter a valid room code.',
        room_connect_fail: 'Could not connect to the multiplayer room.',
        room_left: 'Left multiplayer room.',
        waiting_another_player: 'Waiting for another player...',
        players_connected: '{{count}} players connected',
        host_can_start: '{{count}} players connected. You can start the match.',
        waiting_host_start: '{{count}} players connected. Waiting for the host to start.',
        label_you: 'You',
        label_host: 'Host',
        label_owner: 'Owner',
        label_done: 'Done',
        owner_auto_enabled: 'Owner auto-play enabled.',
        owner_auto_disabled: 'Owner auto-play disabled.',
        owner_auto_enable_btn: 'Enable Owner Auto-Play',
        owner_auto_disable_btn: 'Disable Owner Auto-Play',
        owner_auto_note: 'Owner-only helper. Regular players cannot see this.',
        only_host_start: 'Only the host can start the match.',
        need_two_players: 'Need at least 2 players to start.',
        match_live: 'Match live. Type as fast as you can!',
        multiplayer_started: 'Multiplayer match started!',
        finished_waiting: 'You finished. Waiting for the other players...',
        match_finished_place: 'Match finished. You placed #{{rank}}.',
        match_finished: 'Match finished.'
    },
    id: {
        nav_practice: 'Latihan', nav_multiplayer: 'Multiplayer', nav_leaderboard: 'Papan Skor', nav_profile: 'Profil', owner_badge: 'PEMILIK',
        auth_subtitle: 'Masuk dengan Google untuk menyinkronkan progres, nama panggilan, dan identitas multiplayer.',
        auth_google: 'Lanjut dengan Google', auth_guest: 'Lanjut sebagai Tamu (main instan)', auth_guest_short: 'Lanjut sebagai Tamu',
        auth_opening_google: 'Membuka Google...', auth_google_connecting: 'Akun Google tersambung. Menyelesaikan proses masuk...', auth_google_error: 'Tidak bisa masuk dengan Google.', auth_need_signin: 'Kamu harus masuk dulu.',
        stats_best: 'WPM Terbaik', stats_avg: 'Rata-rata WPM', stats_tests: 'Tes', stats_rank: 'Peringkat',
        mode_practice: 'Latihan', mode_ranked: 'Peringkat', difficulty_easy: 'Mudah', difficulty_medium: 'Sedang', difficulty_hard: 'Sulit',
        hint_start: 'Klik atau ketuk kotak teks untuk mulai mengetik', caps_lock: 'Caps Lock aktif',
        recent_results: 'Hasil Terbaru', no_tests: 'Belum ada tes - mulai mengetik di atas!', ranked_title: 'Mode Peringkat',
        ranked_desc: 'Harus login. Tidak bisa pause. Tes 60 detik. Tunjukkan kemampuanmu!', ranked_history: 'Riwayat Peringkat', no_ranked: 'Belum ada pertandingan peringkat.',
        multiplayer_title: 'Arena Multiplayer', multiplayer_heading: 'Main Langsung Bareng Teman', multiplayer_sub: 'Buat room atau gabung dengan kode',
        create_room: 'Buat Room', join: 'Gabung', room_code: 'Kode Room', share_room: 'Bagikan kode ini ke teman', waiting_players: 'Menunggu pemain...',
        start_match_need: 'Mulai Match (butuh 2+ pemain)', live_room: 'Room langsung', shared_text: 'Teks bersama', waiting_match: 'Menunggu match dimulai...',
        leaderboard_title: 'Papan Skor Global', leaderboard_player: 'Pemain', profile_photo: 'Foto Profil', using_default_photo: 'Menggunakan foto profil Google kamu', using_custom_avatar: 'Menggunakan avatar kustom kamu',
        nickname: 'Nama Panggilan', nickname_placeholder: 'Nama yang akan ditampilkan', upload_avatar: 'Unggah Avatar', use_default: 'Pakai Default', save_profile: 'Simpan Profil',
        statistics: 'Statistik', badge_collection: 'Koleksi Badge', rank_progression: 'Progres Peringkat', title_label: 'Gelar', equipped_badge: 'Badge Aktif', none_yet: 'Belum ada',
        badges_unlocked: '{{owned}} dari {{total}} badge terbuka', current_title: 'Gelar Saat Ini', level_label: 'Level', total_xp: 'Total XP', average_wpm: 'Rata-rata WPM', average_accuracy: 'Rata-rata Akurasi',
        tests_done: 'Tes Selesai', total_errors: 'Total Kesalahan', xp_to_next: 'XP ke Level Berikutnya', best_combo: 'Combo Terbaik', email: 'Email', role_owner: 'Peran', owner_role_value: 'Pemilik',
        current: 'Saat Ini', ok: 'OK', locked: 'Terkunci', unlocked: 'Terbuka', click_to_equip: 'Terbuka - klik untuk pakai', equipped: 'Dipakai',
        language_next_race: 'Bahasa akan diterapkan pada balapan multiplayer berikutnya.', welcome_user: 'Selamat datang, {{name}}!', sign_in_to_equip: 'Masuk dulu untuk memakai badge.', badge_equipped: 'Badge dipakai.', badge_cleared: 'Badge dilepas.',
        choose_image: 'Silakan pilih file gambar.', image_under_limit: 'Gunakan gambar di bawah 1 MB.', room_created: 'Room dibuat: {{code}}', room_joined: 'Bergabung ke room: {{code}}', room_create_fail: 'Tidak bisa membuat room.',
        room_join_fail: 'Tidak bisa bergabung ke room.', room_code_invalid: 'Masukkan kode room yang valid.', room_connect_fail: 'Tidak bisa terhubung ke room multiplayer.', room_left: 'Keluar dari room multiplayer.',
        waiting_another_player: 'Menunggu pemain lain...', players_connected: '{{count}} pemain terhubung', host_can_start: '{{count}} pemain terhubung. Kamu bisa mulai match.', waiting_host_start: '{{count}} pemain terhubung. Menunggu host memulai.',
        label_you: 'Kamu', label_host: 'Host', label_owner: 'Pemilik', label_done: 'Selesai', owner_auto_enabled: 'Auto-play owner aktif.', owner_auto_disabled: 'Auto-play owner nonaktif.',
        owner_auto_enable_btn: 'Aktifkan Auto-Play Owner', owner_auto_disable_btn: 'Nonaktifkan Auto-Play Owner', owner_auto_note: 'Bantuan khusus owner. Pemain biasa tidak bisa melihat ini.',
        only_host_start: 'Hanya host yang bisa memulai match.', need_two_players: 'Butuh minimal 2 pemain untuk mulai.', match_live: 'Match aktif. Ketik secepat mungkin!', multiplayer_started: 'Match multiplayer dimulai!',
        finished_waiting: 'Kamu selesai. Menunggu pemain lain...', match_finished_place: 'Match selesai. Posisi kamu #{{rank}}.', match_finished: 'Match selesai.'
    },
    es: { nav_practice:'Practica', nav_multiplayer:'Multijugador', nav_leaderboard:'Clasificacion', nav_profile:'Perfil', owner_badge:'DUEÑO', auth_subtitle:'Inicia sesion con Google para sincronizar tu progreso, apodo e identidad multijugador.', auth_google:'Continuar con Google', auth_guest:'Continuar como invitado (juego instantaneo)', auth_guest_short:'Continuar como invitado', auth_opening_google:'Abriendo Google...', auth_google_connecting:'Cuenta de Google conectada. Finalizando inicio de sesion...', auth_google_error:'No se pudo iniciar sesion con Google.', auth_need_signin:'Debes iniciar sesion primero.', stats_best:'Mejor WPM', stats_avg:'Prom. WPM', stats_tests:'Pruebas', stats_rank:'Rango', mode_practice:'Practica', mode_ranked:'Ranked', difficulty_easy:'Facil', difficulty_medium:'Medio', difficulty_hard:'Dificil', hint_start:'Haz clic o toca el cuadro de texto para empezar a escribir', caps_lock:'Caps Lock activado', recent_results:'Resultados Recientes', no_tests:'Aun no hay pruebas. Empieza a escribir arriba.', ranked_title:'Modo Ranked', ranked_desc:'Se requiere inicio de sesion. Sin pausa. Prueba de 60 segundos. Da lo mejor de ti.', ranked_history:'Historial Ranked', no_ranked:'Aun no hay partidas ranked.', multiplayer_title:'Arena Multijugador', multiplayer_heading:'Juega En Vivo Con Amigos', multiplayer_sub:'Crea una sala o unete con un codigo', create_room:'Crear Sala', join:'Unirse', room_code:'Codigo de Sala', share_room:'Comparte este codigo con amigos', waiting_players:'Esperando jugadores...', start_match_need:'Iniciar partida (se necesitan 2+ jugadores)', live_room:'Sala en vivo', shared_text:'Texto compartido', waiting_match:'Esperando a que comience la partida...', leaderboard_title:'Clasificacion Global', leaderboard_player:'Jugador', profile_photo:'Foto de Perfil', using_default_photo:'Usando tu foto de Google', using_custom_avatar:'Usando tu avatar personalizado', nickname:'Apodo', nickname_placeholder:'Como debe aparecer tu nombre', upload_avatar:'Subir Avatar', use_default:'Usar Predeterminado', save_profile:'Guardar Perfil', statistics:'Estadisticas', badge_collection:'Coleccion de Insignias', rank_progression:'Progreso de Rango', title_label:'Titulo', equipped_badge:'Insignia Equipada', none_yet:'Aun ninguna', badges_unlocked:'{{owned}} de {{total}} insignias desbloqueadas', current_title:'Titulo Actual', level_label:'Nivel', total_xp:'XP Total', average_wpm:'WPM Promedio', average_accuracy:'Precision Promedio', tests_done:'Pruebas Hechas', total_errors:'Errores Totales', xp_to_next:'XP Hasta El Siguiente Nivel', best_combo:'Mejor Combo', email:'Correo', role_owner:'Rol', owner_role_value:'Dueño', current:'Actual', ok:'OK', locked:'Bloqueado', unlocked:'Desbloqueado', click_to_equip:'Desbloqueado - haz clic para equipar', equipped:'Equipado', language_next_race:'El idioma se aplicara a la siguiente carrera multijugador.', welcome_user:'Bienvenido, {{name}}!', sign_in_to_equip:'Inicia sesion primero para equipar insignias.', badge_equipped:'Insignia equipada.', badge_cleared:'Insignia quitada.', choose_image:'Elige un archivo de imagen.', image_under_limit:'Usa una imagen de menos de 1 MB.', room_created:'Sala creada: {{code}}', room_joined:'Te uniste a la sala: {{code}}', room_create_fail:'No se pudo crear la sala.', room_join_fail:'No se pudo unir a la sala.', room_code_invalid:'Ingresa un codigo de sala valido.', room_connect_fail:'No se pudo conectar a la sala multijugador.', room_left:'Saliste de la sala multijugador.', waiting_another_player:'Esperando a otro jugador...', players_connected:'{{count}} jugadores conectados', host_can_start:'{{count}} jugadores conectados. Puedes iniciar la partida.', waiting_host_start:'{{count}} jugadores conectados. Esperando al anfitrion.', label_you:'Tu', label_host:'Host', label_owner:'Dueño', label_done:'Listo', owner_auto_enabled:'Auto-play del dueño activado.', owner_auto_disabled:'Auto-play del dueño desactivado.', owner_auto_enable_btn:'Activar Auto-Play del Dueño', owner_auto_disable_btn:'Desactivar Auto-Play del Dueño', owner_auto_note:'Ayuda solo para el dueño. Los jugadores normales no pueden verla.', only_host_start:'Solo el anfitrion puede iniciar la partida.', need_two_players:'Se necesitan al menos 2 jugadores para empezar.', match_live:'Partida en vivo. Escribe tan rapido como puedas.', multiplayer_started:'Partida multijugador iniciada.', finished_waiting:'Has terminado. Esperando a los otros jugadores...', match_finished_place:'Partida terminada. Quedaste en el puesto #{{rank}}.', match_finished:'Partida terminada.' },
    fr: { nav_practice:'Entrainement', nav_multiplayer:'Multijoueur', nav_leaderboard:'Classement', nav_profile:'Profil', owner_badge:'PROPRIO', auth_subtitle:'Connectez-vous avec Google pour synchroniser votre progression, pseudo et identite multijoueur.', auth_google:'Continuer avec Google', auth_guest:'Continuer en invite (jeu instantane)', auth_guest_short:'Continuer en invite', auth_opening_google:'Ouverture de Google...', auth_google_connecting:'Compte Google connecte. Finalisation de la connexion...', auth_google_error:'Impossible de se connecter avec Google.', auth_need_signin:'Vous devez d abord vous connecter.', stats_best:'Meilleur WPM', stats_avg:'WPM Moy.', stats_tests:'Tests', stats_rank:'Rang', mode_practice:'Entrainement', mode_ranked:'Classe', difficulty_easy:'Facile', difficulty_medium:'Moyen', difficulty_hard:'Difficile', hint_start:'Cliquez ou touchez la zone de texte pour commencer a taper', caps_lock:'Caps Lock est active', recent_results:'Resultats Recents', no_tests:'Aucun test pour le moment - commencez a taper ci-dessus.', ranked_title:'Mode Classe', ranked_desc:'Connexion requise. Pas de pause. Test de 60 secondes. Donnez le meilleur de vous-meme.', ranked_history:'Historique Classe', no_ranked:'Aucun match classe pour le moment.', multiplayer_title:'Arena Multijoueur', multiplayer_heading:'Jouez En Direct Avec Des Amis', multiplayer_sub:'Creez une salle ou rejoignez avec un code', create_room:'Creer une Salle', join:'Rejoindre', room_code:'Code de Salle', share_room:'Partagez ce code avec vos amis', waiting_players:'En attente des joueurs...', start_match_need:'Lancer le match (2+ joueurs requis)', live_room:'Salle en direct', shared_text:'Texte partage', waiting_match:'En attente du debut du match...', leaderboard_title:'Classement Global', leaderboard_player:'Joueur', profile_photo:'Photo de Profil', using_default_photo:'Utilise votre photo Google', using_custom_avatar:'Utilise votre avatar personnalise', nickname:'Pseudo', nickname_placeholder:'Comment votre nom doit apparaitre', upload_avatar:'Televerser un Avatar', use_default:'Utiliser par Defaut', save_profile:'Enregistrer le Profil', statistics:'Statistiques', badge_collection:'Collection de Badges', rank_progression:'Progression de Rang', title_label:'Titre', equipped_badge:'Badge Equipe', none_yet:'Aucun pour l instant', badges_unlocked:'{{owned}} badges debloques sur {{total}}', current_title:'Titre Actuel', level_label:'Niveau', total_xp:'XP Total', average_wpm:'WPM Moyen', average_accuracy:'Precision Moyenne', tests_done:'Tests Effectues', total_errors:'Erreurs Totales', xp_to_next:'XP Jusqu au Niveau Suivant', best_combo:'Meilleur Combo', email:'Email', role_owner:'Role', owner_role_value:'Proprietaire', current:'Actuel', ok:'OK', locked:'Verrouille', unlocked:'Debloque', click_to_equip:'Debloque - cliquez pour equiper', equipped:'Equipe', language_next_race:'La langue sera appliquee a la prochaine course multijoueur.', welcome_user:'Bienvenue, {{name}} !', sign_in_to_equip:'Connectez-vous d abord pour equiper des badges.', badge_equipped:'Badge equipe.', badge_cleared:'Badge retire.', choose_image:'Veuillez choisir un fichier image.', image_under_limit:'Veuillez utiliser une image de moins de 1 Mo.', room_created:'Salle creee : {{code}}', room_joined:'Salle rejointe : {{code}}', room_create_fail:'Impossible de creer la salle.', room_join_fail:'Impossible de rejoindre la salle.', room_code_invalid:'Entrez un code de salle valide.', room_connect_fail:'Impossible de se connecter a la salle multijoueur.', room_left:'Vous avez quitte la salle multijoueur.', waiting_another_player:'En attente d un autre joueur...', players_connected:'{{count}} joueurs connectes', host_can_start:'{{count}} joueurs connectes. Vous pouvez lancer le match.', waiting_host_start:'{{count}} joueurs connectes. En attente de l hote.', label_you:'Vous', label_host:'Hote', label_owner:'Proprio', label_done:'Fini', owner_auto_enabled:'Lecture auto du proprietaire activee.', owner_auto_disabled:'Lecture auto du proprietaire desactivee.', owner_auto_enable_btn:'Activer la Lecture Auto Proprietaire', owner_auto_disable_btn:'Desactiver la Lecture Auto Proprietaire', owner_auto_note:'Aide reservee au proprietaire. Les joueurs normaux ne peuvent pas la voir.', only_host_start:'Seul l hote peut lancer le match.', need_two_players:'Il faut au moins 2 joueurs pour commencer.', match_live:'Match en direct. Tapez aussi vite que possible !', multiplayer_started:'Match multijoueur demarre.', finished_waiting:'Vous avez termine. En attente des autres joueurs...', match_finished_place:'Match termine. Vous avez fini #{{rank}}.', match_finished:'Match termine.' },
    de: { nav_practice:'Training', nav_multiplayer:'Mehrspieler', nav_leaderboard:'Bestenliste', nav_profile:'Profil', owner_badge:'BESITZER', auth_subtitle:'Melde dich mit Google an, um deinen Fortschritt, Spitznamen und deine Mehrspieler-Identitat zu synchronisieren.', auth_google:'Mit Google fortfahren', auth_guest:'Als Gast fortfahren (sofort spielen)', auth_guest_short:'Als Gast fortfahren', auth_opening_google:'Google wird geoffnet...', auth_google_connecting:'Google-Konto verbunden. Anmeldung wird abgeschlossen...', auth_google_error:'Anmeldung mit Google fehlgeschlagen.', auth_need_signin:'Du musst dich zuerst anmelden.', stats_best:'Beste WPM', stats_avg:'Durchs. WPM', stats_tests:'Tests', stats_rank:'Rang', mode_practice:'Training', mode_ranked:'Gewertet', difficulty_easy:'Leicht', difficulty_medium:'Mittel', difficulty_hard:'Schwer', hint_start:'Klicke oder tippe auf das Textfeld, um zu beginnen', caps_lock:'Feststelltaste ist aktiv', recent_results:'Letzte Ergebnisse', no_tests:'Noch keine Tests - beginne oben zu tippen.', ranked_title:'Gewerteter Modus', ranked_desc:'Anmeldung erforderlich. Keine Pause. 60-Sekunden-Test. Gib dein Bestes.', ranked_history:'Gewertete Historie', no_ranked:'Noch keine gewerteten Spiele.', multiplayer_title:'Mehrspieler-Arena', multiplayer_heading:'Spiele Live Mit Freunden', multiplayer_sub:'Erstelle einen Raum oder tritt mit einem Code bei', create_room:'Raum Erstellen', join:'Beitreten', room_code:'Raumcode', share_room:'Teile diesen Code mit Freunden', waiting_players:'Warte auf Spieler...', start_match_need:'Match starten (2+ Spieler noetig)', live_room:'Live-Raum', shared_text:'Geteilter Text', waiting_match:'Warte auf Match-Start...', leaderboard_title:'Globale Bestenliste', leaderboard_player:'Spieler', profile_photo:'Profilfoto', using_default_photo:'Dein Google-Profilfoto wird verwendet', using_custom_avatar:'Dein benutzerdefinierter Avatar wird verwendet', nickname:'Spitzname', nickname_placeholder:'Wie dein Name angezeigt werden soll', upload_avatar:'Avatar Hochladen', use_default:'Standard Verwenden', save_profile:'Profil Speichern', statistics:'Statistiken', badge_collection:'Badge-Sammlung', rank_progression:'Rangfortschritt', title_label:'Titel', equipped_badge:'Ausgeruestetes Badge', none_yet:'Noch keins', badges_unlocked:'{{owned}} von {{total}} Badges freigeschaltet', current_title:'Aktueller Titel', level_label:'Level', total_xp:'Gesamt-XP', average_wpm:'Durchs. WPM', average_accuracy:'Durchs. Genauigkeit', tests_done:'Abgeschlossene Tests', total_errors:'Gesamtfehler', xp_to_next:'XP bis zum naechsten Level', best_combo:'Bestes Combo', email:'E-Mail', role_owner:'Rolle', owner_role_value:'Besitzer', current:'Aktuell', ok:'OK', locked:'Gesperrt', unlocked:'Freigeschaltet', click_to_equip:'Freigeschaltet - zum Ausruesten klicken', equipped:'Ausgeruestet', language_next_race:'Die Sprache gilt fuer das naechste Mehrspieler-Rennen.', welcome_user:'Willkommen, {{name}}!', sign_in_to_equip:'Melde dich zuerst an, um Badges auszuruesten.', badge_equipped:'Badge ausgeruestet.', badge_cleared:'Badge entfernt.', choose_image:'Bitte waehle eine Bilddatei.', image_under_limit:'Bitte verwende ein Bild unter 1 MB.', room_created:'Raum erstellt: {{code}}', room_joined:'Raum beigetreten: {{code}}', room_create_fail:'Raum konnte nicht erstellt werden.', room_join_fail:'Raum konnte nicht betreten werden.', room_code_invalid:'Gib einen gueltigen Raumcode ein.', room_connect_fail:'Verbindung zum Mehrspieler-Raum fehlgeschlagen.', room_left:'Mehrspieler-Raum verlassen.', waiting_another_player:'Warte auf einen weiteren Spieler...', players_connected:'{{count}} Spieler verbunden', host_can_start:'{{count}} Spieler verbunden. Du kannst das Match starten.', waiting_host_start:'{{count}} Spieler verbunden. Warten auf den Host.', label_you:'Du', label_host:'Host', label_owner:'Besitzer', label_done:'Fertig', owner_auto_enabled:'Besitzer-Autoplay aktiviert.', owner_auto_disabled:'Besitzer-Autoplay deaktiviert.', owner_auto_enable_btn:'Besitzer-Autoplay aktivieren', owner_auto_disable_btn:'Besitzer-Autoplay deaktivieren', owner_auto_note:'Nur fuer den Besitzer. Normale Spieler koennen das nicht sehen.', only_host_start:'Nur der Host kann das Match starten.', need_two_players:'Mindestens 2 Spieler werden zum Starten benoetigt.', match_live:'Match live. Tippe so schnell du kannst!', multiplayer_started:'Mehrspieler-Match gestartet.', finished_waiting:'Du bist fertig. Warten auf die anderen Spieler...', match_finished_place:'Match beendet. Du bist auf Platz #{{rank}}.', match_finished:'Match beendet.' },
    it: { nav_practice:'Pratica', nav_multiplayer:'Multigiocatore', nav_leaderboard:'Classifica', nav_profile:'Profilo', owner_badge:'PROPRIETARIO', auth_subtitle:'Accedi con Google per sincronizzare i tuoi progressi, nickname e identita multigiocatore.', auth_google:'Continua con Google', auth_guest:'Continua come ospite (gioco istantaneo)', auth_guest_short:'Continua come ospite', auth_opening_google:'Apertura di Google...', auth_google_connecting:'Account Google collegato. Completamento dell accesso...', auth_google_error:'Impossibile accedere con Google.', auth_need_signin:'Devi prima accedere.', stats_best:'Miglior WPM', stats_avg:'WPM Medio', stats_tests:'Test', stats_rank:'Rango', mode_practice:'Pratica', mode_ranked:'Classificata', difficulty_easy:'Facile', difficulty_medium:'Medio', difficulty_hard:'Difficile', hint_start:'Fai clic o tocca la casella di testo per iniziare a digitare', caps_lock:'Caps Lock attivo', recent_results:'Risultati Recenti', no_tests:'Nessun test ancora - inizia a digitare sopra.', ranked_title:'Modalita Classificata', ranked_desc:'Accesso richiesto. Nessuna pausa. Test di 60 secondi. Dai il massimo.', ranked_history:'Storico Classificato', no_ranked:'Nessuna partita classificata ancora.', multiplayer_title:'Arena Multigiocatore', multiplayer_heading:'Gioca Live Con Gli Amici', multiplayer_sub:'Crea una stanza o unisciti con un codice', create_room:'Crea Stanza', join:'Unisciti', room_code:'Codice Stanza', share_room:'Condividi questo codice con gli amici', waiting_players:'In attesa dei giocatori...', start_match_need:'Avvia partita (servono 2+ giocatori)', live_room:'Stanza live', shared_text:'Testo condiviso', waiting_match:'In attesa dell inizio della partita...', leaderboard_title:'Classifica Globale', leaderboard_player:'Giocatore', profile_photo:'Foto Profilo', using_default_photo:'Usi la tua foto Google', using_custom_avatar:'Usi il tuo avatar personalizzato', nickname:'Nickname', nickname_placeholder:'Come deve apparire il tuo nome', upload_avatar:'Carica Avatar', use_default:'Usa Predefinito', save_profile:'Salva Profilo', statistics:'Statistiche', badge_collection:'Collezione Badge', rank_progression:'Progressione Rango', title_label:'Titolo', equipped_badge:'Badge Equipaggiato', none_yet:'Nessuno ancora', badges_unlocked:'{{owned}} badge sbloccati su {{total}}', current_title:'Titolo Attuale', level_label:'Livello', total_xp:'XP Totale', average_wpm:'WPM Medio', average_accuracy:'Precisione Media', tests_done:'Test Completati', total_errors:'Errori Totali', xp_to_next:'XP al Livello Successivo', best_combo:'Miglior Combo', email:'Email', role_owner:'Ruolo', owner_role_value:'Proprietario', current:'Attuale', ok:'OK', locked:'Bloccato', unlocked:'Sbloccato', click_to_equip:'Sbloccato - clicca per equipaggiare', equipped:'Equipaggiato', language_next_race:'La lingua verra applicata alla prossima gara multigiocatore.', welcome_user:'Benvenuto, {{name}}!', sign_in_to_equip:'Accedi prima per equipaggiare i badge.', badge_equipped:'Badge equipaggiato.', badge_cleared:'Badge rimosso.', choose_image:'Scegli un file immagine.', image_under_limit:'Usa un immagine inferiore a 1 MB.', room_created:'Stanza creata: {{code}}', room_joined:'Entrato nella stanza: {{code}}', room_create_fail:'Impossibile creare la stanza.', room_join_fail:'Impossibile unirsi alla stanza.', room_code_invalid:'Inserisci un codice stanza valido.', room_connect_fail:'Impossibile connettersi alla stanza multigiocatore.', room_left:'Hai lasciato la stanza multigiocatore.', waiting_another_player:'In attesa di un altro giocatore...', players_connected:'{{count}} giocatori connessi', host_can_start:'{{count}} giocatori connessi. Puoi avviare la partita.', waiting_host_start:'{{count}} giocatori connessi. In attesa dell host.', label_you:'Tu', label_host:'Host', label_owner:'Proprietario', label_done:'Fatto', owner_auto_enabled:'Auto-play proprietario attivato.', owner_auto_disabled:'Auto-play proprietario disattivato.', owner_auto_enable_btn:'Attiva Auto-Play Proprietario', owner_auto_disable_btn:'Disattiva Auto-Play Proprietario', owner_auto_note:'Aiuto solo per il proprietario. I giocatori normali non possono vederlo.', only_host_start:'Solo l host puo avviare la partita.', need_two_players:'Servono almeno 2 giocatori per iniziare.', match_live:'Partita live. Scrivi il piu velocemente possibile!', multiplayer_started:'Partita multigiocatore iniziata.', finished_waiting:'Hai finito. In attesa degli altri giocatori...', match_finished_place:'Partita finita. Hai ottenuto il posto #{{rank}}.', match_finished:'Partita finita.' },
    pt: { nav_practice:'Pratica', nav_multiplayer:'Multijogador', nav_leaderboard:'Leaderboard', nav_profile:'Perfil', owner_badge:'DONO', auth_subtitle:'Entre com o Google para sincronizar seu progresso, apelido e identidade multiplayer.', auth_google:'Continuar com Google', auth_guest:'Continuar como convidado (jogo instantaneo)', auth_guest_short:'Continuar como convidado', auth_opening_google:'Abrindo Google...', auth_google_connecting:'Conta Google conectada. Finalizando login...', auth_google_error:'Nao foi possivel entrar com Google.', auth_need_signin:'Voce precisa entrar primeiro.', stats_best:'Melhor WPM', stats_avg:'WPM Medio', stats_tests:'Testes', stats_rank:'Rank', mode_practice:'Pratica', mode_ranked:'Rankeado', difficulty_easy:'Facil', difficulty_medium:'Medio', difficulty_hard:'Dificil', hint_start:'Clique ou toque na caixa de texto para comecar a digitar', caps_lock:'Caps Lock esta ligado', recent_results:'Resultados Recentes', no_tests:'Nenhum teste ainda - comece a digitar acima.', ranked_title:'Modo Rankeado', ranked_desc:'Login obrigatorio. Sem pausa. Teste de 60 segundos. De o seu melhor.', ranked_history:'Historico Rankeado', no_ranked:'Nenhuma partida ranqueada ainda.', multiplayer_title:'Arena Multijogador', multiplayer_heading:'Jogue Ao Vivo Com Amigos', multiplayer_sub:'Crie uma sala ou entre com um codigo', create_room:'Criar Sala', join:'Entrar', room_code:'Codigo da Sala', share_room:'Compartilhe este codigo com amigos', waiting_players:'Esperando jogadores...', start_match_need:'Iniciar partida (precisa de 2+ jogadores)', live_room:'Sala ao vivo', shared_text:'Texto compartilhado', waiting_match:'Esperando a partida comecar...', leaderboard_title:'Leaderboard Global', leaderboard_player:'Jogador', profile_photo:'Foto de Perfil', using_default_photo:'Usando sua foto do Google', using_custom_avatar:'Usando seu avatar personalizado', nickname:'Apelido', nickname_placeholder:'Como seu nome deve aparecer', upload_avatar:'Enviar Avatar', use_default:'Usar Padrao', save_profile:'Salvar Perfil', statistics:'Estatisticas', badge_collection:'Colecao de Badges', rank_progression:'Progressao de Rank', title_label:'Titulo', equipped_badge:'Badge Equipado', none_yet:'Nenhum ainda', badges_unlocked:'{{owned}} de {{total}} badges desbloqueados', current_title:'Titulo Atual', level_label:'Nivel', total_xp:'XP Total', average_wpm:'WPM Medio', average_accuracy:'Precisao Media', tests_done:'Testes Feitos', total_errors:'Erros Totais', xp_to_next:'XP Ate o Proximo Nivel', best_combo:'Melhor Combo', email:'Email', role_owner:'Papel', owner_role_value:'Dono', current:'Atual', ok:'OK', locked:'Bloqueado', unlocked:'Desbloqueado', click_to_equip:'Desbloqueado - clique para equipar', equipped:'Equipado', language_next_race:'O idioma sera aplicado na proxima corrida multiplayer.', welcome_user:'Bem-vindo, {{name}}!', sign_in_to_equip:'Entre primeiro para equipar badges.', badge_equipped:'Badge equipado.', badge_cleared:'Badge removido.', choose_image:'Escolha um arquivo de imagem.', image_under_limit:'Use uma imagem com menos de 1 MB.', room_created:'Sala criada: {{code}}', room_joined:'Entrou na sala: {{code}}', room_create_fail:'Nao foi possivel criar a sala.', room_join_fail:'Nao foi possivel entrar na sala.', room_code_invalid:'Digite um codigo de sala valido.', room_connect_fail:'Nao foi possivel conectar a sala multiplayer.', room_left:'Voce saiu da sala multiplayer.', waiting_another_player:'Esperando outro jogador...', players_connected:'{{count}} jogadores conectados', host_can_start:'{{count}} jogadores conectados. Voce pode iniciar a partida.', waiting_host_start:'{{count}} jogadores conectados. Esperando o host iniciar.', label_you:'Voce', label_host:'Host', label_owner:'Dono', label_done:'Concluido', owner_auto_enabled:'Auto-play do dono ativado.', owner_auto_disabled:'Auto-play do dono desativado.', owner_auto_enable_btn:'Ativar Auto-Play do Dono', owner_auto_disable_btn:'Desativar Auto-Play do Dono', owner_auto_note:'Ajuda apenas para o dono. Jogadores comuns nao podem ver isto.', only_host_start:'So o host pode iniciar a partida.', need_two_players:'Sao necessarios pelo menos 2 jogadores para iniciar.', match_live:'Partida ao vivo. Digite o mais rapido que puder!', multiplayer_started:'Partida multiplayer iniciada.', finished_waiting:'Voce terminou. Esperando os outros jogadores...', match_finished_place:'Partida finalizada. Voce ficou em #{{rank}}.', match_finished:'Partida finalizada.' },
    nl: { nav_practice:'Oefenen', nav_multiplayer:'Multiplayer', nav_leaderboard:'Ranglijst', nav_profile:'Profiel', owner_badge:'EIGENAAR', auth_subtitle:'Log in met Google om je voortgang, bijnaam en multiplayer-identiteit te synchroniseren.', auth_google:'Doorgaan met Google', auth_guest:'Doorgaan als gast (direct spelen)', auth_guest_short:'Doorgaan als gast', auth_opening_google:'Google openen...', auth_google_connecting:'Google-account verbonden. Inloggen wordt afgerond...', auth_google_error:'Inloggen met Google is mislukt.', auth_need_signin:'Je moet eerst inloggen.', stats_best:'Beste WPM', stats_avg:'Gem. WPM', stats_tests:'Tests', stats_rank:'Rang', mode_practice:'Oefenen', mode_ranked:'Ranked', difficulty_easy:'Makkelijk', difficulty_medium:'Gemiddeld', difficulty_hard:'Moeilijk', hint_start:'Klik of tik op het tekstvak om te beginnen met typen', caps_lock:'Caps Lock staat aan', recent_results:'Recente Resultaten', no_tests:'Nog geen tests - begin hierboven met typen.', ranked_title:'Ranked Modus', ranked_desc:'Inloggen vereist. Geen pauze. Test van 60 seconden. Doe je best.', ranked_history:'Ranked Geschiedenis', no_ranked:'Nog geen ranked matches.', multiplayer_title:'Multiplayer Arena', multiplayer_heading:'Speel Live Met Vrienden', multiplayer_sub:'Maak een kamer of doe mee met een code', create_room:'Kamer Maken', join:'Deelnemen', room_code:'Kamercode', share_room:'Deel deze code met vrienden', waiting_players:'Wachten op spelers...', start_match_need:'Match starten (2+ spelers nodig)', live_room:'Live kamer', shared_text:'Gedeelde tekst', waiting_match:'Wachten tot de match start...', leaderboard_title:'Wereldwijde Ranglijst', leaderboard_player:'Speler', profile_photo:'Profielfoto', using_default_photo:'Je Google-profielfoto wordt gebruikt', using_custom_avatar:'Je aangepaste avatar wordt gebruikt', nickname:'Bijnaam', nickname_placeholder:'Hoe je naam moet verschijnen', upload_avatar:'Avatar Uploaden', use_default:'Standaard Gebruiken', save_profile:'Profiel Opslaan', statistics:'Statistieken', badge_collection:'Badgecollectie', rank_progression:'Rangvoortgang', title_label:'Titel', equipped_badge:'Gekozen Badge', none_yet:'Nog geen', badges_unlocked:'{{owned}} van {{total}} badges ontgrendeld', current_title:'Huidige Titel', level_label:'Niveau', total_xp:'Totale XP', average_wpm:'Gem. WPM', average_accuracy:'Gem. Nauwkeurigheid', tests_done:'Tests Gedaan', total_errors:'Totale Fouten', xp_to_next:'XP Tot Volgend Niveau', best_combo:'Beste Combo', email:'E-mail', role_owner:'Rol', owner_role_value:'Eigenaar', current:'Huidig', ok:'OK', locked:'Vergrendeld', unlocked:'Ontgrendeld', click_to_equip:'Ontgrendeld - klik om te kiezen', equipped:'Gekozen', language_next_race:'De taal wordt toegepast op de volgende multiplayer-race.', welcome_user:'Welkom, {{name}}!', sign_in_to_equip:'Log eerst in om badges uit te rusten.', badge_equipped:'Badge uitgerust.', badge_cleared:'Badge verwijderd.', choose_image:'Kies een afbeeldingsbestand.', image_under_limit:'Gebruik een afbeelding kleiner dan 1 MB.', room_created:'Kamer gemaakt: {{code}}', room_joined:'Toegetreden tot kamer: {{code}}', room_create_fail:'Kon kamer niet maken.', room_join_fail:'Kon niet deelnemen aan kamer.', room_code_invalid:'Voer een geldige kamercode in.', room_connect_fail:'Kon geen verbinding maken met de multiplayer-kamer.', room_left:'Je hebt de multiplayer-kamer verlaten.', waiting_another_player:'Wachten op een andere speler...', players_connected:'{{count}} spelers verbonden', host_can_start:'{{count}} spelers verbonden. Je kunt de match starten.', waiting_host_start:'{{count}} spelers verbonden. Wachten op de host.', label_you:'Jij', label_host:'Host', label_owner:'Eigenaar', label_done:'Klaar', owner_auto_enabled:'Eigenaar auto-play ingeschakeld.', owner_auto_disabled:'Eigenaar auto-play uitgeschakeld.', owner_auto_enable_btn:'Eigenaar Auto-Play Inschakelen', owner_auto_disable_btn:'Eigenaar Auto-Play Uitschakelen', owner_auto_note:'Alleen voor de eigenaar. Gewone spelers kunnen dit niet zien.', only_host_start:'Alleen de host kan de match starten.', need_two_players:'Er zijn minstens 2 spelers nodig om te starten.', match_live:'Match live. Typ zo snel als je kunt!', multiplayer_started:'Multiplayer-match gestart.', finished_waiting:'Je bent klaar. Wachten op de andere spelers...', match_finished_place:'Match afgelopen. Je eindigde op #{{rank}}.', match_finished:'Match afgelopen.' },
    tr: { nav_practice:'Pratik', nav_multiplayer:'Cok Oyunculu', nav_leaderboard:'Liderlik Tablosu', nav_profile:'Profil', owner_badge:'SAHIP', auth_subtitle:'Ilerlemeni, takma adini ve cok oyunculu kimligini senkronize etmek icin Google ile giris yap.', auth_google:'Google ile Devam Et', auth_guest:'Misafir olarak devam et (aninda oyna)', auth_guest_short:'Misafir olarak devam et', auth_opening_google:'Google aciliyor...', auth_google_connecting:'Google hesabi baglandi. Giris tamamlanıyor...', auth_google_error:'Google ile giris yapilamadi.', auth_need_signin:'Once giris yapman gerekiyor.', stats_best:'En Iyi WPM', stats_avg:'Ort. WPM', stats_tests:'Testler', stats_rank:'Rutbe', mode_practice:'Pratik', mode_ranked:'Ranked', difficulty_easy:'Kolay', difficulty_medium:'Orta', difficulty_hard:'Zor', hint_start:'Yazmaya baslamak icin metin kutusuna tikla veya dokun', caps_lock:'Caps Lock acik', recent_results:'Son Sonuclar', no_tests:'Henuz test yok - yukarida yazmaya basla.', ranked_title:'Ranked Modu', ranked_desc:'Giris gerekli. Duraklatma yok. 60 saniyelik test. Elinden gelenin en iyisini yap.', ranked_history:'Ranked Gecmisi', no_ranked:'Henuz ranked mac yok.', multiplayer_title:'Cok Oyunculu Arena', multiplayer_heading:'Arkadaslarla Canli Oyna', multiplayer_sub:'Oda olustur veya kodla katil', create_room:'Oda Olustur', join:'Katil', room_code:'Oda Kodu', share_room:'Bu kodu arkadaslarla paylas', waiting_players:'Oyuncular bekleniyor...', start_match_need:'Maci baslat (2+ oyuncu gerekli)', live_room:'Canli oda', shared_text:'Paylasilan metin', waiting_match:'Macin baslamasi bekleniyor...', leaderboard_title:'Kuresel Liderlik Tablosu', leaderboard_player:'Oyuncu', profile_photo:'Profil Fotografi', using_default_photo:'Google profil fotografin kullaniliyor', using_custom_avatar:'Ozel avatarin kullaniliyor', nickname:'Takma Ad', nickname_placeholder:'Adinin nasil gorunecegi', upload_avatar:'Avatar Yukle', use_default:'Varsayilani Kullan', save_profile:'Profili Kaydet', statistics:'Istatistikler', badge_collection:'Rozet Koleksiyonu', rank_progression:'Rutbe Gelisimi', title_label:'Unvan', equipped_badge:'Takili Rozet', none_yet:'Henuz yok', badges_unlocked:'{{total}} rozetten {{owned}} tanesi acildi', current_title:'Mevcut Unvan', level_label:'Seviye', total_xp:'Toplam XP', average_wpm:'Ort. WPM', average_accuracy:'Ort. Dogruluk', tests_done:'Yapilan Testler', total_errors:'Toplam Hata', xp_to_next:'Sonraki Seviyeye XP', best_combo:'En Iyi Kombo', email:'E-posta', role_owner:'Rol', owner_role_value:'Sahip', current:'Mevcut', ok:'Tamam', locked:'Kilitli', unlocked:'Acik', click_to_equip:'Acik - takmak icin tikla', equipped:'Takili', language_next_race:'Dil bir sonraki cok oyunculu yaris icin uygulanacak.', welcome_user:'Hos geldin, {{name}}!', sign_in_to_equip:'Rozet takmak icin once giris yap.', badge_equipped:'Rozet takildi.', badge_cleared:'Rozet cikarildi.', choose_image:'Lutfen bir gorsel dosyasi sec.', image_under_limit:'Lutfen 1 MB altinda bir gorsel kullan.', room_created:'Oda olusturuldu: {{code}}', room_joined:'Odaya katilindi: {{code}}', room_create_fail:'Oda olusturulamadi.', room_join_fail:'Odaya katilinamadi.', room_code_invalid:'Gecerli bir oda kodu gir.', room_connect_fail:'Cok oyunculu odaya baglanilamadi.', room_left:'Cok oyunculu odadan ayrildin.', waiting_another_player:'Baska bir oyuncu bekleniyor...', players_connected:'{{count}} oyuncu baglandi', host_can_start:'{{count}} oyuncu baglandi. Maci baslatabilirsin.', waiting_host_start:'{{count}} oyuncu baglandi. Host bekleniyor.', label_you:'Sen', label_host:'Host', label_owner:'Sahip', label_done:'Bitti', owner_auto_enabled:'Sahip oto-oyun acildi.', owner_auto_disabled:'Sahip oto-oyun kapatildi.', owner_auto_enable_btn:'Sahip Oto-Play Ac', owner_auto_disable_btn:'Sahip Oto-Play Kapat', owner_auto_note:'Yalnizca sahip yardimi. Normal oyuncular bunu goremez.', only_host_start:'Maci sadece host baslatabilir.', need_two_players:'Baslamak icin en az 2 oyuncu gerekli.', match_live:'Mac canli. Olabildigince hizli yaz!', multiplayer_started:'Cok oyunculu mac basladi.', finished_waiting:'Bitirdin. Diger oyuncular bekleniyor...', match_finished_place:'Mac bitti. Siralaman #{{rank}}.', match_finished:'Mac bitti.' },
    sv: { nav_practice:'Ovning', nav_multiplayer:'Fler spelare', nav_leaderboard:'Topplista', nav_profile:'Profil', owner_badge:'AGARE', auth_subtitle:'Logga in med Google for att synkronisera dina framsteg, smeknamn och flerspelaridentitet.', auth_google:'Fortsatt med Google', auth_guest:'Fortsatt som gast (spela direkt)', auth_guest_short:'Fortsatt som gast', auth_opening_google:'Oppnar Google...', auth_google_connecting:'Google-konto anslutet. Slutfor inloggning...', auth_google_error:'Det gick inte att logga in med Google.', auth_need_signin:'Du maste logga in forst.', stats_best:'Basta WPM', stats_avg:'Snitt WPM', stats_tests:'Tester', stats_rank:'Rank', mode_practice:'Ovning', mode_ranked:'Rankad', difficulty_easy:'Lat', difficulty_medium:'Medel', difficulty_hard:'Svar', hint_start:'Klicka eller tryck pa textrutan for att borja skriva', caps_lock:'Caps Lock ar pa', recent_results:'Senaste Resultat', no_tests:'Inga tester annu - borja skriva ovanfor.', ranked_title:'Rankat Lage', ranked_desc:'Inloggning kravs. Ingen paus. 60-sekunders test. Gor ditt basta.', ranked_history:'Rankad Historik', no_ranked:'Inga rankade matcher annu.', multiplayer_title:'Fler Spelare Arena', multiplayer_heading:'Spela Live Med Vanner', multiplayer_sub:'Skapa ett rum eller ga med med en kod', create_room:'Skapa Rum', join:'Ga Med', room_code:'Rumskod', share_room:'Dela den har koden med vanner', waiting_players:'Vantar pa spelare...', start_match_need:'Starta match (2+ spelare behovs)', live_room:'Live-rum', shared_text:'Delad text', waiting_match:'Vantar pa att matchen ska starta...', leaderboard_title:'Global Topplista', leaderboard_player:'Spelare', profile_photo:'Profilbild', using_default_photo:'Din Google-profilbild anvands', using_custom_avatar:'Din anpassade avatar anvands', nickname:'Smeknamn', nickname_placeholder:'Hur ditt namn ska visas', upload_avatar:'Ladda Upp Avatar', use_default:'Anvand Standard', save_profile:'Spara Profil', statistics:'Statistik', badge_collection:'Badge-samling', rank_progression:'Rankutveckling', title_label:'Titel', equipped_badge:'Utrustad Badge', none_yet:'Ingen annu', badges_unlocked:'{{owned}} av {{total}} badges upplasta', current_title:'Nuvarande Titel', level_label:'Niva', total_xp:'Total XP', average_wpm:'Genomsnittlig WPM', average_accuracy:'Genomsnittlig Noggrannhet', tests_done:'Gjorda Tester', total_errors:'Totala Fel', xp_to_next:'XP Till Nasta Niva', best_combo:'Basta Combo', email:'E-post', role_owner:'Roll', owner_role_value:'Agare', current:'Nuvarande', ok:'OK', locked:'Last', unlocked:'Upplast', click_to_equip:'Upplast - klicka for att utrusta', equipped:'Utrustad', language_next_race:'Spraket galler for nasta flerspelarlopp.', welcome_user:'Valkommen, {{name}}!', sign_in_to_equip:'Logga in forst for att utrusta badges.', badge_equipped:'Badge utrustad.', badge_cleared:'Badge borttagen.', choose_image:'Valj en bildfil.', image_under_limit:'Anvand en bild under 1 MB.', room_created:'Rum skapat: {{code}}', room_joined:'Gick med i rum: {{code}}', room_create_fail:'Det gick inte att skapa rum.', room_join_fail:'Det gick inte att ga med i rum.', room_code_invalid:'Ange en giltig rumskod.', room_connect_fail:'Det gick inte att ansluta till flerspelarrummet.', room_left:'Du lamnade flerspelarrummet.', waiting_another_player:'Vantar pa en annan spelare...', players_connected:'{{count}} spelare anslutna', host_can_start:'{{count}} spelare anslutna. Du kan starta matchen.', waiting_host_start:'{{count}} spelare anslutna. Vantar pa hosten.', label_you:'Du', label_host:'Host', label_owner:'Agare', label_done:'Klar', owner_auto_enabled:'Agarens auto-play aktiverad.', owner_auto_disabled:'Agarens auto-play avaktiverad.', owner_auto_enable_btn:'Aktivera Agarens Auto-Play', owner_auto_disable_btn:'Inaktivera Agarens Auto-Play', owner_auto_note:'Hjalp endast for agaren. Vanliga spelare kan inte se detta.', only_host_start:'Bara hosten kan starta matchen.', need_two_players:'Minst 2 spelare kravs for att starta.', match_live:'Matchen ar live. Skriv sa snabbt du kan!', multiplayer_started:'Flerspelarmatch startad.', finished_waiting:'Du ar klar. Vantar pa de andra spelarna...', match_finished_place:'Matchen ar slut. Du kom pa plats #{{rank}}.', match_finished:'Matchen ar slut.' },
    pl: { nav_practice:'Trening', nav_multiplayer:'Wieloosobowy', nav_leaderboard:'Ranking', nav_profile:'Profil', owner_badge:'WLASCICIEL', auth_subtitle:'Zaloguj sie przez Google, aby zsynchronizowac postepy, pseudonim i tozsamosc multiplayer.', auth_google:'Kontynuuj z Google', auth_guest:'Kontynuuj jako gosc (natychmiastowa gra)', auth_guest_short:'Kontynuuj jako gosc', auth_opening_google:'Otwieranie Google...', auth_google_connecting:'Konto Google polaczone. Konczenie logowania...', auth_google_error:'Nie udalo sie zalogowac przez Google.', auth_need_signin:'Najpierw musisz sie zalogowac.', stats_best:'Najlepsze WPM', stats_avg:'Srednie WPM', stats_tests:'Testy', stats_rank:'Ranga', mode_practice:'Trening', mode_ranked:'Ranking', difficulty_easy:'Latwy', difficulty_medium:'Sredni', difficulty_hard:'Trudny', hint_start:'Kliknij lub dotknij pole tekstowe, aby zaczac pisac', caps_lock:'Caps Lock jest wlaczony', recent_results:'Ostatnie Wyniki', no_tests:'Brak testow - zacznij pisac powyzej.', ranked_title:'Tryb Rankingowy', ranked_desc:'Wymagane logowanie. Bez pauzy. Test 60-sekundowy. Daj z siebie wszystko.', ranked_history:'Historia Rankingowa', no_ranked:'Brak meczow rankingowych.', multiplayer_title:'Arena Wieloosobowa', multiplayer_heading:'Graj Na Zywo Z Przyjaciolmi', multiplayer_sub:'Utworz pokoj lub dolacz kodem', create_room:'Utworz Pokoj', join:'Dolacz', room_code:'Kod Pokoju', share_room:'Udostepnij ten kod znajomym', waiting_players:'Oczekiwanie na graczy...', start_match_need:'Rozpocznij mecz (wymagane 2+ graczy)', live_room:'Pokoj na zywo', shared_text:'Wspolny tekst', waiting_match:'Oczekiwanie na start meczu...', leaderboard_title:'Globalny Ranking', leaderboard_player:'Gracz', profile_photo:'Zdjecie Profilowe', using_default_photo:'Uzywane jest twoje zdjecie Google', using_custom_avatar:'Uzywany jest twoj niestandardowy avatar', nickname:'Pseudonim', nickname_placeholder:'Jak ma byc wyswietlane twoje imie', upload_avatar:'Przeslij Avatar', use_default:'Uzyj Domyslnego', save_profile:'Zapisz Profil', statistics:'Statystyki', badge_collection:'Kolekcja Odznak', rank_progression:'Postep Rangi', title_label:'Tytul', equipped_badge:'Wyposazona Odznaka', none_yet:'Jeszcze brak', badges_unlocked:'Odblokowano {{owned}} z {{total}} odznak', current_title:'Obecny Tytul', level_label:'Poziom', total_xp:'Laczne XP', average_wpm:'Srednie WPM', average_accuracy:'Srednia Dokladnosc', tests_done:'Wykonane Testy', total_errors:'Laczna Liczba Bledow', xp_to_next:'XP do Nastepnego Poziomu', best_combo:'Najlepsze Combo', email:'Email', role_owner:'Rola', owner_role_value:'Wlasciciel', current:'Obecny', ok:'OK', locked:'Zablokowane', unlocked:'Odblokowane', click_to_equip:'Odblokowane - kliknij, aby wyposazyc', equipped:'Wyposazone', language_next_race:'Jezyk zostanie zastosowany w nastepnym wyscigu multiplayer.', welcome_user:'Witaj, {{name}}!', sign_in_to_equip:'Zaloguj sie najpierw, aby wyposazyc odznaki.', badge_equipped:'Odznaka wyposazona.', badge_cleared:'Odznaka usunieta.', choose_image:'Wybierz plik obrazu.', image_under_limit:'Uzyj obrazu mniejszego niz 1 MB.', room_created:'Pokoj utworzony: {{code}}', room_joined:'Dolaczono do pokoju: {{code}}', room_create_fail:'Nie udalo sie utworzyc pokoju.', room_join_fail:'Nie udalo sie dolaczyc do pokoju.', room_code_invalid:'Wpisz prawidlowy kod pokoju.', room_connect_fail:'Nie udalo sie polaczyc z pokojem multiplayer.', room_left:'Opusciles pokoj multiplayer.', waiting_another_player:'Oczekiwanie na innego gracza...', players_connected:'Polaczono {{count}} graczy', host_can_start:'Polaczono {{count}} graczy. Mozesz rozpoczac mecz.', waiting_host_start:'Polaczono {{count}} graczy. Oczekiwanie na hosta.', label_you:'Ty', label_host:'Host', label_owner:'Wlasciciel', label_done:'Gotowe', owner_auto_enabled:'Auto-play wlasciciela wlaczone.', owner_auto_disabled:'Auto-play wlasciciela wylaczone.', owner_auto_enable_btn:'Wlacz Auto-Play Wlasciciela', owner_auto_disable_btn:'Wylacz Auto-Play Wlasciciela', owner_auto_note:'Pomoc tylko dla wlasciciela. Zwykli gracze tego nie widza.', only_host_start:'Tylko host moze rozpoczac mecz.', need_two_players:'Do startu potrzeba co najmniej 2 graczy.', match_live:'Mecz trwa. Pisz tak szybko, jak potrafisz!', multiplayer_started:'Mecz multiplayer rozpoczety.', finished_waiting:'Skonczyles. Oczekiwanie na innych graczy...', match_finished_place:'Mecz zakonczony. Zajales miejsce #{{rank}}.', match_finished:'Mecz zakonczony.' },
    ro: { nav_practice:'Antrenament', nav_multiplayer:'Multiplayer', nav_leaderboard:'Clasament', nav_profile:'Profil', owner_badge:'PROPRIETAR', auth_subtitle:'Conecteaza-te cu Google pentru a sincroniza progresul, porecla si identitatea multiplayer.', auth_google:'Continua cu Google', auth_guest:'Continua ca invitat (joaca instant)', auth_guest_short:'Continua ca invitat', auth_opening_google:'Se deschide Google...', auth_google_connecting:'Cont Google conectat. Se finalizeaza autentificarea...', auth_google_error:'Nu s-a putut autentifica cu Google.', auth_need_signin:'Trebuie sa te autentifici mai intai.', stats_best:'Cel Mai Bun WPM', stats_avg:'WPM Mediu', stats_tests:'Teste', stats_rank:'Rang', mode_practice:'Antrenament', mode_ranked:'Ranked', difficulty_easy:'Usor', difficulty_medium:'Mediu', difficulty_hard:'Greu', hint_start:'Da click sau atinge caseta de text pentru a incepe sa tastezi', caps_lock:'Caps Lock este activ', recent_results:'Rezultate Recente', no_tests:'Niciun test inca - incepe sa tastezi mai sus.', ranked_title:'Mod Ranked', ranked_desc:'Autentificare necesara. Fara pauza. Test de 60 de secunde. Da tot ce ai mai bun.', ranked_history:'Istoric Ranked', no_ranked:'Niciun meci ranked inca.', multiplayer_title:'Arena Multiplayer', multiplayer_heading:'Joaca Live Cu Prietenii', multiplayer_sub:'Creeaza o camera sau intra cu un cod', create_room:'Creeaza Camera', join:'Intra', room_code:'Cod Camera', share_room:'Imparte acest cod cu prietenii', waiting_players:'Se asteapta jucatori...', start_match_need:'Porneste meciul (necesita 2+ jucatori)', live_room:'Camera live', shared_text:'Text comun', waiting_match:'Se asteapta inceperea meciului...', leaderboard_title:'Clasament Global', leaderboard_player:'Jucator', profile_photo:'Fotografie de Profil', using_default_photo:'Se foloseste fotografia ta Google', using_custom_avatar:'Se foloseste avatarul tau personalizat', nickname:'Porecla', nickname_placeholder:'Cum ar trebui sa apara numele tau', upload_avatar:'Incarca Avatar', use_default:'Foloseste Implicit', save_profile:'Salveaza Profilul', statistics:'Statistici', badge_collection:'Colectie de Badge-uri', rank_progression:'Progresul Rangului', title_label:'Titlu', equipped_badge:'Badge Echipat', none_yet:'Niciunul inca', badges_unlocked:'{{owned}} din {{total}} badge-uri deblocate', current_title:'Titlul Curent', level_label:'Nivel', total_xp:'XP Total', average_wpm:'WPM Mediu', average_accuracy:'Acuratete Medie', tests_done:'Teste Facute', total_errors:'Erori Totale', xp_to_next:'XP pana la Nivelul Urmator', best_combo:'Cel Mai Bun Combo', email:'Email', role_owner:'Rol', owner_role_value:'Proprietar', current:'Curent', ok:'OK', locked:'Blocat', unlocked:'Deblocat', click_to_equip:'Deblocat - click pentru echipare', equipped:'Echipat', language_next_race:'Limba va fi aplicata la urmatoarea cursa multiplayer.', welcome_user:'Bine ai venit, {{name}}!', sign_in_to_equip:'Autentifica-te mai intai pentru a echipa badge-uri.', badge_equipped:'Badge echipat.', badge_cleared:'Badge eliminat.', choose_image:'Te rugam sa alegi un fisier imagine.', image_under_limit:'Te rugam sa folosesti o imagine sub 1 MB.', room_created:'Camera creata: {{code}}', room_joined:'Ai intrat in camera: {{code}}', room_create_fail:'Nu s-a putut crea camera.', room_join_fail:'Nu s-a putut intra in camera.', room_code_invalid:'Introdu un cod de camera valid.', room_connect_fail:'Nu s-a putut conecta la camera multiplayer.', room_left:'Ai parasit camera multiplayer.', waiting_another_player:'Se asteapta un alt jucator...', players_connected:'{{count}} jucatori conectati', host_can_start:'{{count}} jucatori conectati. Poti porni meciul.', waiting_host_start:'{{count}} jucatori conectati. Se asteapta gazda.', label_you:'Tu', label_host:'Gazda', label_owner:'Proprietar', label_done:'Gata', owner_auto_enabled:'Auto-play-ul proprietarului este activ.', owner_auto_disabled:'Auto-play-ul proprietarului este dezactivat.', owner_auto_enable_btn:'Activeaza Auto-Play Proprietar', owner_auto_disable_btn:'Dezactiveaza Auto-Play Proprietar', owner_auto_note:'Ajutor doar pentru proprietar. Jucatorii obisnuiti nu pot vedea asta.', only_host_start:'Doar gazda poate porni meciul.', need_two_players:'Sunt necesari cel putin 2 jucatori pentru a incepe.', match_live:'Meci live. Tasteaza cat poti de repede!', multiplayer_started:'Meciul multiplayer a inceput.', finished_waiting:'Ai terminat. Se asteapta ceilalti jucatori...', match_finished_place:'Meci terminat. Ai iesit pe locul #{{rank}}.', match_finished:'Meci terminat.' }
};

Object.assign(UI_TRANSLATIONS.en, {
    profile_updated: 'Profile updated.',
    saving_profile: 'Saving profile...',
    nickname_empty: 'Nickname cannot be empty.',
    sign_out_confirm: 'Sign out?',
    avatar_ready: 'Avatar ready. Click Save Profile to keep it.',
    default_avatar_selected: 'Default avatar selected. Click Save Profile to apply it.'
});

Object.assign(UI_TRANSLATIONS.id, {
    profile_updated: 'Profil diperbarui.',
    saving_profile: 'Menyimpan profil...',
    nickname_empty: 'Nickname tidak boleh kosong.',
    sign_out_confirm: 'Keluar?',
    avatar_ready: 'Avatar siap. Klik Save Profile untuk menyimpannya.',
    default_avatar_selected: 'Avatar default dipilih. Klik Save Profile untuk menerapkannya.'
});

Object.assign(UI_TRANSLATIONS.en, {
    language_en: 'English',
    language_id: 'Indonesian',
    language_es: 'Spanish',
    language_fr: 'French',
    language_de: 'German',
    language_it: 'Italian',
    language_pt: 'Portuguese',
    language_nl: 'Dutch',
    language_tr: 'Turkish',
    language_sv: 'Swedish',
    language_pl: 'Polish',
    language_ro: 'Romanian',
    pause_title: 'Paused',
    pause_subtitle: 'Tap anywhere or press any key to continue',
    result_wpm: 'Words Per Minute',
    result_accuracy: 'Accuracy',
    result_correct: 'Correct',
    result_errors: 'Errors',
    result_try_again: 'Try Again',
    hint_restart: 'Tab to restart',
    combo_label: 'Combo',
    combo_tier_godlike: 'Godlike',
    combo_popup_10: '10 Combo',
    combo_popup_20: '20 Streak',
    combo_popup_30: '30 On Fire',
    combo_popup_50: '50 Godlike',
    result_tier_top: 'Top',
    result_tier_fast: 'Fast',
    result_tier_good: 'Good',
    result_tier_solid: 'Solid',
    result_tier_start: 'Start',
    result_new_best: 'New personal best! +{{xp}} XP{{combo}}{{level}}',
    result_xp_earned: '+{{xp}} XP earned{{combo}}{{level}} - keep going!',
    result_combo_suffix: ' | Max Combo: x{{combo}}',
    result_level_up_suffix: ' | Level Up! Lv.{{level}}',
    result_combo_bonus: 'Best combo streak: {{combo}} | Combo bonus: +{{bonus}} XP',
    xp_to_level: '{{xp}} XP to Level {{level}}',
    rank_requirement: '{{wpm}}+ WPM required',
    ad_banner: 'Advertisement (728x90)',
    ad_tower: 'Ad (160x600)',
    ad_wide: 'Advertisement (728x120)',
    theme_change: 'Change Theme',
    sound_toggle: 'Mute/Unmute'
});

Object.assign(UI_TRANSLATIONS.id, {
    language_en: 'Inggris',
    language_id: 'Indonesia',
    language_es: 'Spanyol',
    language_fr: 'Prancis',
    language_de: 'Jerman',
    language_it: 'Italia',
    language_pt: 'Portugis',
    language_nl: 'Belanda',
    language_tr: 'Turki',
    language_sv: 'Swedia',
    language_pl: 'Polandia',
    language_ro: 'Rumania',
    pause_title: 'Dijeda',
    pause_subtitle: 'Ketuk di mana saja atau tekan tombol apa pun untuk lanjut',
    result_wpm: 'Kata per Menit',
    result_accuracy: 'Akurasi',
    result_correct: 'Benar',
    result_errors: 'Salah',
    result_try_again: 'Coba Lagi',
    hint_restart: 'Tab untuk ulang',
    combo_label: 'Combo',
    combo_tier_godlike: 'Gila',
    combo_popup_10: '10 Combo',
    combo_popup_20: '20 Streak',
    combo_popup_30: '30 Membara',
    combo_popup_50: '50 Gila',
    result_tier_top: 'Top',
    result_tier_fast: 'Cepat',
    result_tier_good: 'Bagus',
    result_tier_solid: 'Mantap',
    result_tier_start: 'Mulai',
    result_new_best: 'Rekor pribadi baru! +{{xp}} XP{{combo}}{{level}}',
    result_xp_earned: '+{{xp}} XP didapat{{combo}}{{level}} - lanjut terus!',
    result_combo_suffix: ' | Combo Maks: x{{combo}}',
    result_level_up_suffix: ' | Naik Level! Lv.{{level}}',
    result_combo_bonus: 'Streak combo terbaik: {{combo}} | Bonus combo: +{{bonus}} XP',
    xp_to_level: '{{xp}} XP ke Level {{level}}',
    rank_requirement: 'Butuh {{wpm}}+ WPM',
    ad_banner: 'Iklan (728x90)',
    ad_tower: 'Iklan (160x600)',
    ad_wide: 'Iklan (728x120)',
    theme_change: 'Ganti Tema',
    sound_toggle: 'Bisu/Nyalakan'
});

function t(key, vars = {}) {
    const language = getCurrentLanguage();
    const pack = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
    const template = pack[key] || UI_TRANSLATIONS.en[key] || key;
    return String(template).replace(/\{\{(\w+)\}\}/g, (_, token) => vars[token] ?? '');
}

const WORD_BANKS = {
    en: WORDS,
    id: {
        common: 'yang dan untuk dari dengan tidak pada ini itu saya kamu kita mereka akan bisa sudah masih lebih karena waktu orang rumah sekolah teman belajar kerja cepat lambat suara warna jalan makan minum pagi malam dunia bahasa pikiran kecil besar indah hidup langkah senyum cerita cahaya ruang udara hujan panas musik layar tombol kunci ritme semangat permainan'.split(' ')
    },
    es: {
        common: 'hola casa tiempo mundo gente amigo escuela trabajo palabra sonido color camino manana noche rapido lento musica ventana puerta sonrisa historia claro espacio lluvia fuego aire ciudad lengua mente pequeno grande comida bebida juego ritmo teclado pantalla'.split(' ')
    },
    fr: {
        common: 'bonjour maison temps monde ami ecole travail parole son couleur chemin matin nuit rapide lent musique fenetre porte sourire histoire espace pluie flamme ville langue pensee petit grand lumiere clavier ecran bouton repas boisson jeu rythme'.split(' ')
    },
    de: {
        common: 'hallo haus zeit welt freund schule arbeit wort klang farbe weg morgen nacht schnell langsam musik fenster tur lachen geschichte raum regen feuer stadt sprache gedanke klein gross licht tastatur bildschirm knopf essen trinken spiel rhythmus'.split(' ')
    },
    it: {
        common: 'ciao casa tempo mondo amico scuola lavoro parola suono colore strada mattina notte veloce lento musica finestra porta sorriso storia spazio pioggia fuoco citta lingua pensiero piccolo grande luce tastiera schermo bottone pranzo bevanda gioco ritmo'.split(' ')
    },
    pt: {
        common: 'ola casa tempo mundo amigo escola trabalho palavra som cor caminho manha noite rapido lento musica janela porta sorriso historia espaco chuva fogo cidade lingua ideia pequeno grande luz teclado tela botao comida bebida jogo ritmo'.split(' ')
    },
    nl: {
        common: 'hallo huis tijd wereld vriend school werk woord geluid kleur straat morgen nacht snel langzaam muziek venster deur glimlach verhaal ruimte regen vuur stad taal gedachte klein groot licht toetsenbord scherm knop eten drinken spel ritme'.split(' ')
    },
    tr: {
        common: 'merhaba ev zaman dunya dost okul is kelime ses renk yol sabah gece hizli yavas muzik pencere kapi gulus hikaye alan yagmur ates sehir dil dusunce kucuk buyuk isik klavye ekran dugme yemek icecek oyun ritim'.split(' ')
    },
    sv: {
        common: 'hej hus tid varld van skola arbete ord ljud farg vag morgon natt snabb langsam musik fonster dorr leende historia rum regn eld stad sprak tanke liten stor ljus tangentbord skarm knapp mat dryck spel rytm'.split(' ')
    },
    pl: {
        common: 'czesc dom czas swiat przyjaciel szkola praca slowo dzwiek kolor droga rano noc szybko wolno muzyka okno drzwi usmiech historia przestrzen deszcz ogien miasto jezyk mysl maly duzy swiatlo klawiatura ekran przycisk jedzenie napoj gra rytm'.split(' ')
    },
    ro: {
        common: 'salut casa timp lume prieten scoala munca cuvant sunet culoare drum dimineata noapte rapid lent muzica fereastra usa zambet poveste spatiu ploaie foc oras limba gand mic mare lumina tastatura ecran buton mancare bautura joc ritm'.split(' ')
    }
};

function getWordsForLanguage(language, difficulty) {
    const key = WORD_BANKS[language] ? language : 'en';
    const bank = WORD_BANKS[key];
    return bank[difficulty] || bank.common || WORDS[difficulty] || WORDS.medium;
}

function getBadgeById(id) {
    return BADGE_DEFINITIONS.find((badge) => badge.id === id) || null;
}

function getFeaturedBadge(data, preferredId) {
    const collection = getBadgeCollection(data || {});
    if (preferredId) {
        const preferred = collection.find((badge) => badge.id === preferredId && badge.unlocked);
        if (preferred) return preferred;
    }
    const unlocked = collection.filter((badge) => badge.unlocked);
    return unlocked[unlocked.length - 1] || null;
}

// Theme Definitions
const THEMES = {
    default: { name: 'Cyberpunk Night', color: '#7c6af7' },
    ocean: { name: 'Deep Ocean', color: '#4da6ff' },
    forest: { name: 'Forest', color: '#4caf50' },
    sunset: { name: 'Sunset', color: '#ff7043' },
    monochrome: { name: 'Monochrome', color: '#a0a0a0' },
    matrix: { name: 'Matrix', color: '#00ff41' },
    midnight: { name: 'Midnight Blue', color: '#7c7cff' },
    candy: { name: 'Candy Pop', color: '#e91e63' }
};

// Mock Players for Leaderboard
const MOCK_PLAYERS = [
    { name: 'SpeedDemon99', wpm: 194, acc: 98.2, tests: 342 },
    { name: 'QuantumFingers', wpm: 172, acc: 97.5, tests: 211 },
    { name: 'NightTyper', wpm: 158, acc: 96.8, tests: 456 },
    { name: 'KeyboardWizard', wpm: 143, acc: 99.1, tests: 189 },
    { name: 'SwiftPaws', wpm: 131, acc: 95.4, tests: 303 },
    { name: 'TypeLord', wpm: 118, acc: 97.8, tests: 267 },
    { name: 'FlashType', wpm: 102, acc: 94.2, tests: 128 },
    { name: 'RapidKeys', wpm: 88, acc: 96.3, tests: 89 }
];

// Bot Names for Multiplayer
const BOT_NAMES = [
    'SwiftTyper', 'KeyMaster', 'SpeedRacer', 'RapidFire',
    'TypeKing', 'NitroKeys', 'VibeFury', 'ZenTypist'
];

