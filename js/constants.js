// ============================================
// 5S SIMULATOR - CONSTANTS AND CONFIGURATION
// ============================================

// Timing
const TICK_INTERVAL = 100;           // Update frequency (ms)
const SCORE_BASE_TIME = 60;          // Base time for score calculation

// Game Settings
const DEFAULT_NUMBER_COUNT = 30;
const MIN_NUMBER_COUNT = 20;
const MAX_NUMBER_COUNT = 50;

// Workspace Dimensions (percentages)
const WORKSPACE = {
    padding: 6,           // % padding from edges
    minDistance: 7        // Minimum % distance between numbers
};

// Clutter Settings
const CLUTTER_LEVELS = {
    none: { count: 0, opacity: 0 },
    low: { count: 12, opacity: 0.5 },
    medium: { count: 25, opacity: 0.65 },
    high: { count: 45, opacity: 0.8 }
};

// Score Calculation
const SCORE = {
    basePoints: 1000,
    timeMultiplier: 8,    // Points lost per second
    errorPenalty: 50,     // Points lost per error
    perfectBonus: 500,    // Bonus for 0 errors
    improvementBonus: 8   // Bonus per % improvement
};

// Animation Durations (ms)
const ANIMATION = {
    numberFound: 300,
    errorShake: 400,
    clutterFade: 500,
    zoneReveal: 600,
    dirtClean: 500,
    confetti: 3000
};

// ============================================
// 5S ROUND CONFIGURATIONS
// ============================================

const ROUNDS = {
    1: {
        id: 'chaos',
        sStep: 0,
        japaneseName: '',
        config: {
            clutter: 'high',
            dirt: true,
            zones: false,
            labels: false,
            organized: false,
            colorCoded: false
        }
    },
    2: {
        id: 'seiri',
        sStep: 1,
        japaneseName: '整理',
        config: {
            clutter: 'low',
            dirt: true,
            zones: false,
            labels: false,
            organized: false,
            colorCoded: false
        }
    },
    3: {
        id: 'seiton',
        sStep: 2,
        japaneseName: '整頓',
        config: {
            clutter: 'low',
            dirt: true,
            zones: true,
            labels: false,
            organized: true,
            colorCoded: false
        }
    },
    4: {
        id: 'seiso',
        sStep: 3,
        japaneseName: '清掃',
        config: {
            clutter: 'low',
            dirt: false,
            zones: true,
            labels: false,
            organized: true,
            colorCoded: false
        }
    },
    5: {
        id: 'seiketsu',
        sStep: 4,
        japaneseName: '清潔',
        config: {
            clutter: 'low',
            dirt: false,
            zones: true,
            labels: true,
            organized: true,
            colorCoded: true
        }
    },
    6: {
        id: 'shitsuke',
        sStep: 5,
        japaneseName: '躾',
        config: {
            clutter: 'none',
            dirt: false,
            zones: true,
            labels: true,
            organized: true,
            colorCoded: true
        }
    }
};

// Clutter Item Types
const CLUTTER_TYPES = [
    { type: 'tool', icons: ['🔧', '🔨', '🪛', '🔩', '⚙️', '🗜️', '🪚', '📐'] },
    { type: 'paper', icons: ['📄', '📋', '📝', '📦', '🗂️', '📁', '🗃️'] },
    { type: 'random', icons: ['☕', '🥤', '🎧', '📱', '🔑', '👓', '🧤', '⌚', '🔋', '💡'] },
    { type: 'debris', shapes: ['circle', 'square', 'triangle', 'blob'] }
];

// Achievement Badges
const ACHIEVEMENTS = {
    speedDemon: {
        icon: '⚡',
        condition: (time, errors, round) => round >= 4 && time < 30
    },
    perfectionist: {
        icon: '🎯',
        condition: (time, errors) => errors === 0
    },
    improver: {
        icon: '📈',
        condition: (time, errors, round, improvement) => improvement !== null && improvement > 30
    },
    master5s: {
        icon: '🏆',
        condition: (time, errors, round) => round === 6 && time < 25 && errors === 0
    },
    lightning: {
        icon: '🚀',
        condition: (time, errors, round) => round === 6 && time < 18
    }
};

// Zone Definitions (4 quadrants)
const ZONES = [
    { id: 0, x1: 3, y1: 3, x2: 48, y2: 48 },
    { id: 1, x1: 52, y1: 3, x2: 97, y2: 48 },
    { id: 2, x1: 3, y1: 52, x2: 48, y2: 97 },
    { id: 3, x1: 52, y1: 52, x2: 97, y2: 97 }
];

// Storage Key
const STORAGE_KEY = '5s_simulator_state';
