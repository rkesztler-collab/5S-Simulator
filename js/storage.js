// ============================================
// 5S SIMULATOR - STORAGE MODULE
// ============================================

// Save state to localStorage
function saveToLocalStorage() {
    try {
        const state = {
            round: gameState.round,
            roundHistory: gameState.roundHistory,
            settings: {
                numberCount: getNumberCount(),
                clutterLevel: getClutterLevel(),
                soundEnabled: isSoundEnabled()
            },
            lang: currentLang,
            bestTimes: gameState.bestTimes || {},
            timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.warn('Failed to save to localStorage:', e);
    }
}

// Load state from localStorage
function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const state = JSON.parse(saved);

            // Restore language
            if (state.lang) {
                currentLang = state.lang;
            }

            // Restore round (only if game was in progress)
            if (state.round && state.roundHistory && state.roundHistory.length > 0) {
                gameState.round = state.round;
                gameState.roundHistory = state.roundHistory;
            }

            // Restore best times
            if (state.bestTimes) {
                gameState.bestTimes = state.bestTimes;
            }

            // Restore settings
            if (state.settings) {
                if (state.settings.numberCount) {
                    setNumberCount(state.settings.numberCount);
                }
                if (state.settings.clutterLevel) {
                    setClutterLevel(state.settings.clutterLevel);
                }
                if (typeof state.settings.soundEnabled !== 'undefined') {
                    setSoundEnabled(state.settings.soundEnabled);
                }
            }

            return true;
        }
    } catch (e) {
        console.warn('Failed to load from localStorage:', e);
    }
    return false;
}

// Clear saved state
function clearStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.warn('Failed to clear localStorage:', e);
    }
}

// Save best time for a round
function saveBestTime(round, time) {
    if (!gameState.bestTimes) {
        gameState.bestTimes = {};
    }

    const currentBest = gameState.bestTimes[round];
    if (!currentBest || time < currentBest) {
        gameState.bestTimes[round] = time;
        saveToLocalStorage();
        return true; // New record
    }
    return false;
}

// Get best time for a round
function getBestTime(round) {
    return gameState.bestTimes ? gameState.bestTimes[round] : null;
}

// Helper functions for settings (will be defined in app.js)
function getNumberCount() {
    const select = document.getElementById('numberCount');
    return select ? parseInt(select.value) : DEFAULT_NUMBER_COUNT;
}

function setNumberCount(count) {
    const select = document.getElementById('numberCount');
    if (select) {
        select.value = count.toString();
    }
}

function getClutterLevel() {
    const select = document.getElementById('clutterLevel');
    return select ? select.value : 'medium';
}

function setClutterLevel(level) {
    const select = document.getElementById('clutterLevel');
    if (select) {
        select.value = level;
    }
}
