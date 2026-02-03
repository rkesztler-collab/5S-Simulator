// ============================================
// 5S SIMULATOR - MAIN APPLICATION
// ============================================

// DOM Cache
const DOM = {
    _cache: {},

    get(id) {
        if (!this._cache[id]) {
            this._cache[id] = document.getElementById(id);
        }
        return this._cache[id];
    },

    get workspace() { return this.get('workspace'); },
    get timer() { return this.get('timer'); },
    get targetNumber() { return this.get('targetNumber'); },
    get foundCount() { return this.get('foundCount'); },
    get totalCount() { return this.get('totalCount'); },
    get errorCount() { return this.get('errorCount'); },
    get progressBar() { return this.get('progressBar'); },
    get roundBadge() { return this.get('roundBadge'); },
    get eventLog() { return this.get('eventLog'); },
    get roundInfo() { return this.get('roundInfo'); },

    // KPI elements
    get kpiTime() { return this.get('kpiTime'); },
    get kpiErrors() { return this.get('kpiErrors'); },
    get kpiScore() { return this.get('kpiScore'); },
    get kpiImprovement() { return this.get('kpiImprovement'); },
    get kpi5sLevel() { return this.get('kpi5sLevel'); },

    // Overlays
    get dirtOverlay() { return this.get('dirtOverlay'); },
    get zoneOverlay() { return this.get('zoneOverlay'); },
    get labelOverlay() { return this.get('labelOverlay'); },

    // Buttons
    get btnStart() { return this.get('btnStart'); },
    get btnPause() { return this.get('btnPause'); },
    get btnReset() { return this.get('btnReset'); },

    clearCache() {
        this._cache = {};
    }
};

// Animation Manager
const AnimationManager = {
    _timers: new Set(),

    setTimeout(callback, delay) {
        const id = setTimeout(() => {
            this._timers.delete(id);
            callback();
        }, delay);
        this._timers.add(id);
        return id;
    },

    clearAll() {
        this._timers.forEach(id => clearTimeout(id));
        this._timers.clear();
    }
};

// Game State
let gameState = {
    running: false,
    paused: false,
    round: 1,
    tickInterval: null,
    startTimestamp: null,
    pausedDuration: 0,
    pauseStartTime: null,
    roundHistory: [],
    bestTimes: {}
};

// Previous display state (for change detection)
const prevDisplay = {
    time: '',
    target: -1,
    found: -1,
    errors: -1
};

// ============================================
// INITIALIZATION
// ============================================

function initGame() {
    loadFromLocalStorage();
    updateAllTexts();
    updateRoundBadge();
    updateRoundInfo();
    resetDisplays();

    // Show welcome overlay if no progress
    if (gameState.roundHistory.length === 0) {
        showWelcome();
    }
}

// ============================================
// GAME CONTROL FUNCTIONS
// ============================================

function startGame() {
    const roundConfig = ROUNDS[gameState.round];
    const numberCount = getNumberCount();

    // Initialize audio on first user interaction
    initAudio();

    // Generate numbers and clutter
    GameEngine.reset();
    GameEngine.numbers = GameEngine.generateNumberPositions(numberCount, roundConfig.config);

    // Use round's clutter setting or override from settings
    let clutterLevel = roundConfig.config.clutter;
    // For round 1, also consider user's clutter setting
    if (gameState.round === 1) {
        const userClutter = getClutterLevel();
        if (userClutter === 'high') clutterLevel = 'high';
    }

    GameEngine.clutter = GameEngine.generateClutter(clutterLevel, GameEngine.numbers);

    // Render workspace
    renderWorkspace();
    applyRoundConfig(roundConfig.config);

    // Reset displays
    DOM.targetNumber.textContent = '1';
    DOM.foundCount.textContent = '0';
    DOM.totalCount.textContent = numberCount;
    DOM.errorCount.textContent = '0';
    updateProgressBar(0, numberCount);

    // Start game
    gameState.running = true;
    gameState.paused = false;
    gameState.startTimestamp = performance.now();
    gameState.pausedDuration = 0;
    gameState.tickInterval = setInterval(gameTick, TICK_INTERVAL);

    updateButtonStates();
    hideWelcome();
    hideSettingsPanel();

    playStartSound();
    logEvent(`${gameState.round}. ${t('roundStarted')} - ${getRoundName(gameState.round)}`);
}

function gameTick() {
    if (gameState.paused) return;

    const elapsed = (performance.now() - gameState.startTimestamp - gameState.pausedDuration) / 1000;
    GameEngine.elapsedTime = elapsed;

    updateTimerDisplay(elapsed);
    updateKPIs();
}

function togglePause() {
    if (!gameState.running) return;

    gameState.paused = !gameState.paused;

    if (gameState.paused) {
        gameState.pauseStartTime = performance.now();
    } else {
        gameState.pausedDuration += performance.now() - gameState.pauseStartTime;
    }

    updateButtonStates();
}

function resetRound() {
    AnimationManager.clearAll();
    clearInterval(gameState.tickInterval);

    gameState.running = false;
    gameState.paused = false;

    GameEngine.reset();
    resetDisplays();
    clearWorkspace();

    updateButtonStates();
    logEvent(t('pressStart'));
}

function restartGame() {
    AnimationManager.clearAll();
    clearInterval(gameState.tickInterval);

    gameState.round = 1;
    gameState.running = false;
    gameState.paused = false;
    gameState.roundHistory = [];

    GameEngine.reset();
    resetDisplays();
    clearWorkspace();
    updateRoundBadge();
    updateRoundInfo();
    updateButtonStates();

    clearStorage();
    showWelcome();
}

// ============================================
// NUMBER CLICK HANDLING
// ============================================

function handleNumberClick(element, number) {
    if (!gameState.running || gameState.paused) return;

    const result = GameEngine.handleNumberClick(number);
    if (!result) return;

    if (result.success) {
        // Correct number found
        element.classList.add('found');
        playFoundSound();
        animateNumberFound(element);

        // Update displays
        DOM.targetNumber.textContent = GameEngine.currentTarget;
        DOM.foundCount.textContent = GameEngine.foundNumbers.length;
        updateProgressBar(GameEngine.foundNumbers.length, GameEngine.numbers.length);

        if (result.isComplete) {
            endRound();
        }
    } else {
        // Wrong number
        element.classList.add('error');
        playErrorSound();

        AnimationManager.setTimeout(() => {
            element.classList.remove('error');
        }, ANIMATION.errorShake);

        DOM.errorCount.textContent = GameEngine.errors;
        DOM.kpiErrors.textContent = GameEngine.errors;
    }
}

// ============================================
// ROUND END / NEXT ROUND
// ============================================

function endRound() {
    clearInterval(gameState.tickInterval);
    gameState.running = false;

    const time = Math.round(GameEngine.elapsedTime * 10) / 10;
    const errors = GameEngine.errors;
    const score = GameEngine.calculateScore(time, errors, gameState.round);

    // Calculate improvement
    const prevRound = gameState.roundHistory[gameState.round - 2];
    const improvement = prevRound
        ? GameEngine.calculateImprovement(time, prevRound.time)
        : null;

    // Calculate 5S compliance
    const compliance = GameEngine.calculate5SCompliance(gameState.round, time, errors);

    // Save round result
    const roundResult = {
        round: gameState.round,
        sStep: ROUNDS[gameState.round].sStep,
        name: getRoundName(gameState.round),
        time: time,
        errors: errors,
        score: score,
        improvement: improvement,
        compliance: compliance
    };

    gameState.roundHistory.push(roundResult);
    saveBestTime(gameState.round, time);
    saveToLocalStorage();

    // Check achievements
    const achievements = GameEngine.checkAchievements(time, errors, gameState.round, improvement);

    playCompleteSound();

    // Show round end overlay
    showRoundEndOverlay(roundResult, achievements);
}

function nextRound() {
    hideRoundEndOverlay();

    if (gameState.round < 6) {
        gameState.round++;
        updateRoundBadge();
        updateRoundInfo();
        resetDisplays();
        clearWorkspace();
        updateButtonStates();
        logEvent(t('pressStart'));
    } else {
        // Game complete
        showFinalSummary();
    }
}

// ============================================
// WORKSPACE RENDERING
// ============================================

function renderWorkspace() {
    const workspace = DOM.workspace;
    workspace.innerHTML = '';

    // Render numbers
    GameEngine.numbers.forEach(pos => {
        const el = createNumberElement(pos);
        workspace.appendChild(el);
    });

    // Render clutter
    GameEngine.clutter.forEach(item => {
        const el = createClutterElement(item);
        workspace.appendChild(el);
    });
}

function createNumberElement(pos) {
    const el = document.createElement('div');
    el.className = 'number-item';
    el.textContent = pos.number;
    el.style.left = `${pos.x}%`;
    el.style.top = `${pos.y}%`;

    if (pos.zone !== null) {
        el.dataset.zone = pos.zone;
    }

    el.addEventListener('click', (e) => {
        e.stopPropagation();
        handleNumberClick(el, pos.number);
    });

    return el;
}

function createClutterElement(item) {
    const el = document.createElement('div');
    el.className = 'clutter-item';
    el.style.left = `${item.x}%`;
    el.style.top = `${item.y}%`;
    el.style.transform = `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`;
    el.style.opacity = item.opacity;

    if (item.content) {
        el.textContent = item.content;
        el.classList.add('clutter-icon');
    } else if (item.shape) {
        el.classList.add('clutter-shape', `shape-${item.shape}`);
    }

    return el;
}

function clearWorkspace() {
    DOM.workspace.innerHTML = '';
    DOM.dirtOverlay.innerHTML = '';
    DOM.dirtOverlay.classList.remove('visible');
    DOM.zoneOverlay.classList.remove('visible');
    DOM.labelOverlay.classList.remove('visible');
}

// ============================================
// ROUND CONFIGURATION APPLICATION
// ============================================

function applyRoundConfig(config) {
    // Dirt overlay
    if (config.dirt) {
        renderDirtOverlay();
        DOM.dirtOverlay.classList.add('visible');
    } else {
        DOM.dirtOverlay.classList.remove('visible');
    }

    // Zones
    if (config.zones) {
        DOM.zoneOverlay.classList.add('visible');
    } else {
        DOM.zoneOverlay.classList.remove('visible');
    }

    // Labels
    if (config.labels) {
        DOM.labelOverlay.classList.add('visible');
    } else {
        DOM.labelOverlay.classList.remove('visible');
    }

    // Color coding
    if (config.colorCoded) {
        document.querySelectorAll('.number-item').forEach(el => {
            const zone = el.dataset.zone;
            if (zone !== undefined) {
                el.classList.add('color-coded', `zone-color-${zone}`);
            }
        });
    }
}

function renderDirtOverlay() {
    const overlay = DOM.dirtOverlay;
    overlay.innerHTML = '';

    const dirtElements = GameEngine.generateDirtPattern();
    dirtElements.forEach(dirt => {
        const el = document.createElement('div');
        el.className = `dirt-element dirt-${dirt.type}`;
        el.style.left = `${dirt.x}%`;
        el.style.top = `${dirt.y}%`;
        el.style.width = `${dirt.size}%`;
        el.style.height = `${dirt.size}%`;
        el.style.opacity = dirt.opacity;
        el.style.transform = `rotate(${dirt.rotation}deg)`;
        overlay.appendChild(el);
    });
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================

function updateTimerDisplay(elapsed) {
    const minutes = Math.floor(elapsed / 60);
    const seconds = Math.floor(elapsed % 60);
    const ms = Math.floor((elapsed % 1) * 10);

    const timeStr = minutes > 0
        ? `${minutes}:${seconds.toString().padStart(2, '0')}.${ms}`
        : `${seconds}.${ms}`;

    if (timeStr !== prevDisplay.time) {
        prevDisplay.time = timeStr;
        DOM.timer.textContent = timeStr;
        DOM.kpiTime.textContent = timeStr;
    }
}

function updateProgressBar(found, total) {
    const percent = total > 0 ? (found / total) * 100 : 0;
    DOM.progressBar.style.width = `${percent}%`;
}

function updateKPIs() {
    const elapsed = GameEngine.elapsedTime;
    const score = GameEngine.calculateScore(elapsed, GameEngine.errors, gameState.round);

    DOM.kpiScore.textContent = score;

    // 5S compliance based on round
    const compliance = GameEngine.calculate5SCompliance(gameState.round, elapsed, GameEngine.errors);
    DOM.kpi5sLevel.textContent = `${compliance}%`;

    // Improvement (if previous round exists)
    if (gameState.roundHistory.length > 0) {
        const prevTime = gameState.roundHistory[gameState.roundHistory.length - 1].time;
        if (elapsed > 0 && elapsed < prevTime) {
            const improvement = Math.round(((prevTime - elapsed) / prevTime) * 100);
            DOM.kpiImprovement.textContent = `+${improvement}%`;
            DOM.kpiImprovement.classList.add('positive');
            DOM.kpiImprovement.classList.remove('negative');
        } else {
            DOM.kpiImprovement.textContent = '-';
            DOM.kpiImprovement.classList.remove('positive', 'negative');
        }
    }
}

function updateRoundBadge() {
    const roundName = getRoundName(gameState.round);
    DOM.roundBadge.textContent = `${gameState.round}. ${t('round')} - ${roundName}`;

    // Update 5S step indicators
    document.querySelectorAll('.s-step').forEach((el, index) => {
        const stepNum = index + 1;
        el.classList.toggle('active', ROUNDS[gameState.round].sStep >= stepNum);
        el.classList.toggle('current', ROUNDS[gameState.round].sStep === stepNum);
    });
}

function updateRoundInfo() {
    DOM.roundInfo.textContent = getRoundDescription(gameState.round);
}

function updateButtonStates() {
    const btnStart = DOM.btnStart;
    const btnPause = DOM.btnPause;
    const btnReset = DOM.btnReset;

    if (gameState.running) {
        btnStart.style.display = 'none';
        btnPause.style.display = '';
        btnPause.disabled = false;
        btnPause.innerHTML = gameState.paused ? `▶️ ${t('btnContinue')}` : `⏸️ ${t('btnPause')}`;
        btnReset.style.display = '';
    } else {
        btnStart.style.display = '';
        btnPause.style.display = 'none';
        btnReset.style.display = gameState.roundHistory.length > 0 ? '' : 'none';
    }
}

function resetDisplays() {
    DOM.timer.textContent = '0.0';
    DOM.targetNumber.textContent = '1';
    DOM.foundCount.textContent = '0';
    DOM.errorCount.textContent = '0';
    DOM.progressBar.style.width = '0%';
    DOM.kpiTime.textContent = '0.0';
    DOM.kpiErrors.textContent = '0';
    DOM.kpiScore.textContent = '0';
    DOM.kpiImprovement.textContent = '-';
    DOM.kpi5sLevel.textContent = '0%';

    prevDisplay.time = '';
    prevDisplay.target = -1;
    prevDisplay.found = -1;
    prevDisplay.errors = -1;
}

function logEvent(message) {
    DOM.eventLog.textContent = message;
}

// ============================================
// ANIMATIONS
// ============================================

function animateNumberFound(element) {
    element.style.transform = 'translate(-50%, -50%) scale(1.3)';

    AnimationManager.setTimeout(() => {
        element.style.transform = 'translate(-50%, -50%) scale(0)';
        element.style.opacity = '0';
    }, 150);
}

function createConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    const colors = ['#f0a500', '#27ae60', '#3498db', '#e74c3c', '#9b59b6'];

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        confetti.style.animationDuration = `${1.5 + Math.random() * 1.5}s`;
        container.appendChild(confetti);
    }

    AnimationManager.setTimeout(() => {
        container.remove();
    }, ANIMATION.confetti);
}

// ============================================
// OVERLAYS
// ============================================

function showWelcome() {
    document.getElementById('welcomeOverlay').classList.add('visible');
}

function hideWelcome() {
    document.getElementById('welcomeOverlay').classList.remove('visible');
}

function startFromWelcome() {
    hideWelcome();
    startGame();
}

function showRoundEndOverlay(result, achievements) {
    const overlay = document.getElementById('roundEndOverlay');
    const isGameComplete = gameState.round === 6;

    document.getElementById('roundEndTitle').textContent = isGameComplete
        ? t('gameComplete')
        : t('roundComplete');

    document.getElementById('resultTime').textContent = `${result.time} ${t('seconds')}`;
    document.getElementById('resultErrors').textContent = result.errors;
    document.getElementById('resultScore').textContent = result.score;

    const improvementEl = document.getElementById('resultImprovement');
    if (result.improvement !== null) {
        const sign = result.improvement >= 0 ? '+' : '';
        improvementEl.textContent = `${sign}${result.improvement}%`;
        improvementEl.className = 'result-value ' + (result.improvement >= 0 ? 'positive' : 'negative');
    } else {
        improvementEl.textContent = '-';
        improvementEl.className = 'result-value';
    }

    // Achievements
    const achievementEl = document.getElementById('achievementBadge');
    if (achievements.length > 0) {
        achievementEl.innerHTML = achievements.map(a =>
            `<span class="achievement">${a.icon} ${t(a.id)}</span>`
        ).join(' ');
        achievementEl.style.display = '';
        playAchievementSound();
    } else {
        achievementEl.style.display = 'none';
    }

    // Next round info
    const explanationEl = document.getElementById('sExplanation');
    const nextBtnEl = document.getElementById('btnNextRound');

    if (!isGameComplete && gameState.round < 6) {
        const nextRoundNum = gameState.round + 1;
        const principle = get5SPrinciple(nextRoundNum);
        const nextName = getRoundName(nextRoundNum);

        explanationEl.innerHTML = `
            <div class="next-round-preview">
                <strong>${t('nextRound')}: ${nextName}</strong>
                <p>${getRoundDescription(nextRoundNum)}</p>
                ${principle ? `<p class="principle">${principle}</p>` : ''}
            </div>
        `;
        nextBtnEl.textContent = `${nextName} →`;
        nextBtnEl.onclick = nextRound;
    } else {
        explanationEl.innerHTML = `<p>${t('gameComplete')}</p>`;
        nextBtnEl.textContent = t('playAgain');
        nextBtnEl.onclick = restartGame;
    }

    overlay.classList.add('visible');
    createConfetti();
}

function hideRoundEndOverlay() {
    document.getElementById('roundEndOverlay').classList.remove('visible');
}

function showStats() {
    const overlay = document.getElementById('statsOverlay');
    const tbody = document.getElementById('statsBody');
    tbody.innerHTML = '';

    gameState.roundHistory.forEach(r => {
        const row = document.createElement('tr');
        const improvementStr = r.improvement !== null
            ? `${r.improvement >= 0 ? '+' : ''}${r.improvement}%`
            : '-';

        row.innerHTML = `
            <td>${r.round}</td>
            <td>${r.name}</td>
            <td>${r.time}s</td>
            <td>${r.errors}</td>
            <td>${r.score}</td>
            <td class="${r.improvement >= 0 ? 'positive' : ''}">${improvementStr}</td>
        `;
        tbody.appendChild(row);
    });

    overlay.classList.add('visible');
}

function closeStats() {
    document.getElementById('statsOverlay').classList.remove('visible');
}

function showFinalSummary() {
    showStats();
}

function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    panel.classList.toggle('visible');
}

function hideSettingsPanel() {
    document.getElementById('settingsPanel').classList.remove('visible');
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', initGame);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

    switch (e.key.toLowerCase()) {
        case ' ':
        case 'enter':
            e.preventDefault();
            if (!gameState.running) {
                startGame();
            } else {
                togglePause();
            }
            break;
        case 'r':
            if (e.ctrlKey) {
                e.preventDefault();
                restartGame();
            } else {
                resetRound();
            }
            break;
        case 's':
            if (!gameState.running) {
                toggleSettings();
            }
            break;
        case 'escape':
            hideSettingsPanel();
            closeStats();
            hideRoundEndOverlay();
            break;
    }
});
