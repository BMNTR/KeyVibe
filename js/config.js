// ============ KEYVIBE CONFIGURATION ============

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDHUEyDc8Y6AHhmeBdwg8Gr5JCOQLUzAjs",
    authDomain: "keyvibe-adfe9.firebaseapp.com",
    projectId: "keyvibe-adfe9",
    storageBucket: "keyvibe-adfe9.firebasestorage.app",
    messagingSenderId: "923616182428",
    appId: "1:923616182428:web:5bc355c5510486bb16ad59",
    measurementId: "G-7663DGZ84F"
};

// Rank System
const RANKS = [
    { name: "Beginner", min: 0, color: "#6b6b8a", bg: "rgba(107,107,138,0.15)", icon: "🐣" },
    { name: "Novice", min: 35, color: "#4fc3a1", bg: "rgba(79,195,161,0.15)", icon: "🌱" },
    { name: "Apprentice", min: 50, color: "#64b5f6", bg: "rgba(100,181,246,0.15)", icon: "📝" },
    { name: "Typist", min: 65, color: "#7c6af7", bg: "rgba(124,106,247,0.15)", icon: "⌨" },
    { name: "Skilled", min: 80, color: "#ff8a65", bg: "rgba(255,138,101,0.15)", icon: "🔥" },
    { name: "Expert", min: 100, color: "#ffd54f", bg: "rgba(255,213,79,0.15)", icon: "⚡" },
    { name: "Master", min: 120, color: "#ce93d8", bg: "rgba(206,147,216,0.15)", icon: "🏆" },
    { name: "Grandmaster", min: 150, color: "#f06292", bg: "rgba(240,98,146,0.15)", icon: "👑" },
    { name: "Legend", min: 200, color: "#ffcc02", bg: "rgba(255,204,2,0.15)", icon: "🌟" }
];

function getRank(wpm) {
    let rank = RANKS[0];
    for (let r of RANKS) {
        if (wpm >= r.min) rank = r;
    }
    return rank;
}

// Word Pools
const WORDS = {
    easy: "the be to of and a in that have it for not on with he as you do at this but his by from they we say her she or will one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us have good great keep same turn old let hand play place".split(" "),
    
    medium: "ability access achieve action active address advance affect afford agree ahead allow amount ancient answer appear apply argue arrive aspect assess assist assume attach attempt attract balance benefit billion border branch bridge budget career careful chance change charge choice claim clear climate collect complex concern conduct confirm connect consider contain control correct create culture current decide define design develop discuss display divide effect effort enable engage ensure entire equal escape estimate evidence evolve examine expand expect explain explore express extend extreme factor feature figure focus formal forward global govern ground growth health impact improve include increase inform involve issue journey justice market method moment natural object opinion pattern period person place point possible present problem produce provide public question reason recent record region relate report result return review search series simple social society source state study subject system theory travel understand value".split(" "),
    
    hard: "accommodate acknowledgment approximately architecture collaboration comprehensive consequently contemporary contradictory conventional deliberately demonstration determination differentiate disambiguation documentation electromagnetic entrepreneurial establishment extraordinary exaggeration experimentation fundamentally hallucination implementation independently infrastructure institutionalize intellectually internationally interpretation investigation knowledgeable manifestation misinterpretation misrepresentation multiplication neighborhoods nevertheless opportunities organizational participation pharmaceutical philosophical predominantly pronunciation psychological recommendations responsibilities sophisticated straightforward subconsciously substantially technological transformation unconventional vulnerability wholeheartedly acknowledgement simultaneously catastrophically".split(" ")
};

// Theme Definitions
const THEMES = {
    'default': { name: 'Cyberpunk Night', color: '#7c6af7' },
    'ocean': { name: 'Deep Ocean', color: '#4da6ff' },
    'forest': { name: 'Forest', color: '#4caf50' },
    'sunset': { name: 'Sunset', color: '#ff7043' },
    'monochrome': { name: 'Monochrome', color: '#a0a0a0' },
    'matrix': { name: 'Matrix', color: '#00ff41' },
    'midnight': { name: 'Midnight Blue', color: '#7c7cff' },
    'candy': { name: 'Candy Pop', color: '#e91e63' }
};

// Mock Players for Leaderboard (First time only)
const MOCK_PLAYERS = [
    { name: "SpeedDemon99", wpm: 194, acc: 98.2, tests: 342 },
    { name: "QuantumFingers", wpm: 172, acc: 97.5, tests: 211 },
    { name: "NightTyper", wpm: 158, acc: 96.8, tests: 456 },
    { name: "KeyboardWizard", wpm: 143, acc: 99.1, tests: 189 },
    { name: "SwiftPaws", wpm: 131, acc: 95.4, tests: 303 },
    { name: "TypeLord", wpm: 118, acc: 97.8, tests: 267 },
    { name: "FlashType", wpm: 102, acc: 94.2, tests: 128 },
    { name: "RapidKeys", wpm: 88, acc: 96.3, tests: 89 }
];

// Bot Names for Multiplayer
const BOT_NAMES = [
    'SwiftTyper', 'KeyMaster', 'SpeedRacer', 'RapidFire', 
    'TypeKing', 'NitroKeys', 'VibeFury', 'ZenTypist'
];