# Szimulátor Alkalmazás Sablon és Architektúra

> **Cél:** Ez a dokumentáció egy új session-ben átadható tudásbázis egy hasonló szimulációs alkalmazás készítéséhez. Tartalmazza az architektúrát, best practice-eket, teljesítmény optimalizálási mintákat és a moduláris felépítést.

---

## 1. Projekt Struktúra

```
simulator-app/
├── index.html              # Fő HTML - SPA struktúra
├── css/
│   ├── styles.css          # Fő stíluslap (vagy moduláris)
│   └── modules/            # Opcionális: CSS modulok
│       ├── _variables.css
│       ├── _base.css
│       ├── _header.css
│       ├── _controls.css
│       ├── _animations.css
│       └── _responsive.css
├── js/
│   ├── app.js              # Fő alkalmazás logika
│   ├── constants.js        # Konstansok és konfigurációk
│   ├── i18n.js             # Többnyelvűség
│   ├── chart.js            # Canvas alapú grafikonok
│   ├── audio.js            # Hangeffektek (Web Audio API)
│   ├── storage.js          # localStorage kezelés
│   ├── tutorial.js         # Tutorial/onboarding
│   └── [domain].js         # Domain-specifikus modulok
└── docs/
    └── *.md                # Dokumentációk
```

---

## 2. Alapvető Architektúra Minta

### 2.1 HTML Struktúra

```html
<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Szimulátor</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body role="application" aria-label="Szimulátor neve">

<!-- Skip link akadálymentesítéshez -->
<a href="#main-content" class="skip-link">Ugrás a fő tartalomhoz</a>

<!-- FEJLÉC -->
<header class="header">
    <div class="header-left">
        <h1>Alkalmazás Címe<br><span class="header-subtitle">Alcím</span></h1>
    </div>
    <div class="header-info">
        <span class="round-badge" id="roundBadge">1. FORDULÓ</span>
        <div class="timer" id="timer">1:00</div>
        <button class="btn-lang" id="btnLang" onclick="toggleLanguage()">🇬🇧</button>
    </div>
</header>

<!-- VEZÉRLÉS -->
<nav class="controls" role="toolbar" aria-label="Vezérlés">
    <button class="btn btn-start" id="btnStart" onclick="startSimulation()">▶️ Indítás</button>
    <button class="btn btn-pause" id="btnPause" onclick="togglePause()" disabled>⏸️ Szünet</button>
    <button class="btn btn-reset" id="btnReset" onclick="resetSimulation()">🔄 Reset</button>
    <button class="btn btn-stats" id="btnStats" onclick="showStats()" disabled>📊 Statisztika</button>
    <button class="btn btn-params" id="btnParams" onclick="toggleSettings()">⚙️ Paraméterek</button>
</nav>

<!-- BEÁLLÍTÁSOK PANEL -->
<section class="settings-panel hidden" id="settingsPanel">
    <!-- Paraméter inputok -->
</section>

<!-- FŐ TARTALOM -->
<main id="main-content" class="main-area">
    <!-- Szimuláció vizuális megjelenítése -->
</main>

<!-- KPI DASHBOARD -->
<section class="kpi-dashboard" id="kpiDashboard">
    <!-- KPI kártyák -->
</section>

<!-- OVERLAY-EK (Modális ablakok) -->
<div class="overlay hidden" id="statsOverlay">
    <!-- Statisztika tartalom -->
</div>

<!-- JAVASCRIPT - defer használata -->
<script src="js/constants.js" defer></script>
<script src="js/i18n.js" defer></script>
<script src="js/storage.js" defer></script>
<script src="js/audio.js" defer></script>
<script src="js/chart.js" defer></script>
<script src="js/tutorial.js" defer></script>
<script src="js/app.js" defer></script>

</body>
</html>
```

### 2.2 JavaScript Modul Struktúra

#### constants.js - Konfiguráció

```javascript
// ============================================
// KONSTANSOK (Magic number-ök helyett)
// ============================================

// Időzítés
const ROUND_TIME = 60;              // Forduló időtartam (másodperc)
const TICK_INTERVAL = 100;          // Frissítési gyakoriság (ms) - 10 FPS
const CHART_UPDATE_INTERVAL = 1;    // Grafikon frissítés (másodperc)

// Elemek száma
const ELEMENT_COUNT = 4;
const ELEMENT_NAMES = ['Elem1', 'Elem2', 'Elem3', 'Elem4'];

// Alapértelmezett értékek
const DEFAULTS = {
    values: [1, 2, 3, 4],
    batchSize: 10
};

// Validációs határok
const VALIDATION = {
    MIN: 1,
    MAX: 100
};

// Küszöbértékek (színezéshez)
const THRESHOLDS = {
    WARNING: 10,
    CRITICAL: 20,
    GOOD: 85
};

// Animáció
const ANIMATION = {
    DURATION: 450,
    PARTICLE_COUNT: 150
};

// Megjelenítés
const DISPLAY = {
    MAX_VISIBLE_ITEMS: 20
};

// Preset szcenáriók
const PRESETS = {
    default: {
        name: { hu: 'Alapértelmezett', en: 'Default' },
        description: { hu: 'Leírás', en: 'Description' },
        values: [1, 2, 3, 4]
    },
    // további presetek...
};
```

#### app.js - Fő Alkalmazás

```javascript
// ============================================
// DOM ELEM CACHE (Teljesítmény optimalizálás)
// ============================================

const DOM = {
    _cache: {},

    get(id) {
        if (!this._cache[id]) {
            this._cache[id] = document.getElementById(id);
        }
        return this._cache[id];
    },

    // Gyakran használt elemek
    get timer() { return this.get('timer'); },
    get btnStart() { return this.get('btnStart'); },
    get btnPause() { return this.get('btnPause'); },

    // Összetett elemek (pl. munkaállomások)
    element(i) {
        const key = `element${i}`;
        if (!this._cache[key]) {
            this._cache[key] = {
                el: document.getElementById(`element${i}`),
                progress: document.getElementById(`element${i}Progress`),
                status: document.getElementById(`element${i}Status`)
                // további al-elemek...
            };
        }
        return this._cache[key];
    },

    clearCache() {
        this._cache = {};
    }
};

// ============================================
// TELJESÍTMÉNY OPTIMALIZÁLÁS
// ============================================

// Előző állapot cache (változás-detektáláshoz)
const prevDisplayState = {
    counts: new Array(ELEMENT_COUNT).fill(-1),
    finished: -1
};

// Számítás cache
let cachedValue = 0;
let valueCacheTime = 0;

function calculateValue(forceRecalc = false) {
    const now = performance.now();
    if (!forceRecalc && now - valueCacheTime < 50) {
        return cachedValue;
    }
    // számítás...
    cachedValue = result;
    valueCacheTime = now;
    return cachedValue;
}

// Animáció timer kezelő (memória szivárgás megelőzés)
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

// ============================================
// SZIMULÁCIÓ ÁLLAPOT
// ============================================

let simState = {
    running: false,
    paused: false,
    timeLeft: ROUND_TIME,
    totalTime: ROUND_TIME,
    round: 1,
    tickInterval: null,
    roundHistory: []
};

// ============================================
// FŐ FÜGGVÉNYEK
// ============================================

function startSimulation() {
    simState.running = true;
    simState.tickInterval = setInterval(simulationTick, TICK_INTERVAL);
    updateUI();
}

function simulationTick() {
    const dt = TICK_INTERVAL / 1000;
    simState.timeLeft -= dt;

    if (simState.timeLeft <= 0) {
        endRound();
        return;
    }

    // Szimuláció logika...

    updateTimerDisplay();
    updateAllDisplays();
}

function resetSimulation() {
    AnimationManager.clearAll();
    clearInterval(simState.tickInterval);
    simState.running = false;
    simState.paused = false;
    simState.timeLeft = ROUND_TIME;
    resetInternalState();
    updateAllDisplays();
}

function resetInternalState() {
    // Állapot reset
    prevDisplayState.counts.fill(-1);
    prevDisplayState.finished = -1;
    cachedValue = 0;
    valueCacheTime = 0;
}

// ============================================
// MEGJELENÍTÉS FRISSÍTÉS (OPTIMALIZÁLVA)
// ============================================

function updateAllDisplays() {
    // DOM cache használata
    for (let i = 0; i < ELEMENT_COUNT; i++) {
        const elemCache = DOM.element(i);
        const count = data[i].length;

        // Csak ha változott
        if (count !== prevDisplayState.counts[i]) {
            prevDisplayState.counts[i] = count;

            // DocumentFragment használata
            const fragment = document.createDocumentFragment();
            const showCount = Math.min(count, DISPLAY.MAX_VISIBLE_ITEMS);
            for (let j = 0; j < showCount; j++) {
                const div = document.createElement('div');
                div.className = 'item';
                fragment.appendChild(div);
            }
            elemCache.items.textContent = '';
            elemCache.items.appendChild(fragment);
        }
    }
}
```

---

## 3. Teljesítmény Optimalizálási Minták

### 3.1 DOM Optimalizálás

```javascript
// ❌ ROSSZ - Minden tick-nél DOM lekérdezés
function update() {
    document.getElementById('elem1').textContent = value;
    document.getElementById('elem2').textContent = value;
}

// ✅ JÓ - DOM cache
const DOM = {
    _cache: {},
    get(id) {
        if (!this._cache[id]) {
            this._cache[id] = document.getElementById(id);
        }
        return this._cache[id];
    }
};

function update() {
    DOM.get('elem1').textContent = value;
    DOM.get('elem2').textContent = value;
}
```

### 3.2 Változás-detektálás

```javascript
// ❌ ROSSZ - Minden tick-nél újrarajzol
function updateItems(count) {
    itemsEl.innerHTML = '';
    for (let i = 0; i < count; i++) {
        itemsEl.appendChild(createItem());
    }
}

// ✅ JÓ - Csak ha változott
let prevCount = -1;
function updateItems(count) {
    if (count === prevCount) return;
    prevCount = count;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        fragment.appendChild(createItem());
    }
    itemsEl.textContent = '';  // Gyorsabb mint innerHTML = ''
    itemsEl.appendChild(fragment);
}
```

### 3.3 Számítás Cache

```javascript
// ❌ ROSSZ - Ismétlődő számítás
function tick() {
    const wip = calculateWip();  // Drága számítás
    updateDisplay(wip);
    updateKpi(wip);
    updateChart(wip);
}

// ✅ JÓ - Cache-elt számítás
let cachedWip = 0;
let wipCacheTime = 0;

function calculateWip(forceRecalc = false) {
    const now = performance.now();
    if (!forceRecalc && now - wipCacheTime < 50) {
        return cachedWip;
    }
    cachedWip = /* számítás */;
    wipCacheTime = now;
    return cachedWip;
}
```

### 3.4 CSS Animáció Optimalizálás

```css
/* ❌ ROSSZ - box-shadow animáció (repaint) */
@keyframes glow {
    0%, 100% { box-shadow: 0 0 8px rgba(0,0,0,0.3); }
    50% { box-shadow: 0 0 20px rgba(0,0,0,0.6); }
}

/* ✅ JÓ - opacity animáció (GPU) */
.element {
    position: relative;
    will-change: border-color;
}

.element::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: inherit;
    box-shadow: 0 0 20px rgba(0,0,0,0.6);
    opacity: 0;
    pointer-events: none;
}

.element.active::after {
    animation: glowPulse 1s ease-in-out infinite;
}

@keyframes glowPulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
}

/* GPU hintek */
.animated-element {
    will-change: transform, opacity;
}
```

### 3.5 Tömb Műveletek

```javascript
// ❌ ROSSZ - splice() O(n) animációs loopban
for (let i = arr.length - 1; i >= 0; i--) {
    if (shouldRemove(arr[i])) {
        arr.splice(i, 1);  // O(n) minden törléskor
    }
}

// ✅ JÓ - swap-and-pop O(1)
let i = arr.length;
while (i--) {
    if (shouldRemove(arr[i])) {
        const last = arr.length - 1;
        if (i !== last) arr[i] = arr[last];
        arr.pop();
    }
}
```

### 3.6 Canvas Optimalizálás

```javascript
// ❌ ROSSZ - Minden frame-nél resize
function draw() {
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    // rajzolás...
}

// ✅ JÓ - Resize csak ha változott
let lastSize = { w: 0, h: 0 };

function draw() {
    const newW = rect.width * dpr;
    const newH = rect.height * dpr;

    if (newW !== lastSize.w || newH !== lastSize.h) {
        canvas.width = newW;
        canvas.height = newH;
        lastSize = { w: newW, h: newH };
    }
    // rajzolás...
}
```

---

## 4. Modulok Részletes Leírása

### 4.1 i18n.js - Többnyelvűség

```javascript
let currentLang = 'hu';

const translations = {
    hu: {
        start: 'Indítás',
        pause: 'Szünet',
        // ...
    },
    en: {
        start: 'Start',
        pause: 'Pause',
        // ...
    }
};

function t(key) {
    return translations[currentLang][key] || translations['hu'][key] || key;
}

function toggleLanguage() {
    currentLang = currentLang === 'hu' ? 'en' : 'hu';
    updateAllTexts();
    saveToLocalStorage();
}

function updateAllTexts() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        el.textContent = t(key);
    });
}
```

### 4.2 storage.js - Perzisztencia

```javascript
const STORAGE_KEY = 'simulator_state';

function saveToLocalStorage() {
    const state = {
        round: simState.round,
        settings: getSettings(),
        history: simState.roundHistory,
        lang: currentLang
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const state = JSON.parse(saved);
            // állapot visszaállítása...
            return true;
        }
    } catch (e) {
        console.warn('Storage load failed:', e);
    }
    return false;
}

function clearStorage() {
    localStorage.removeItem(STORAGE_KEY);
}
```

### 4.3 audio.js - Hangeffektek

```javascript
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(type) {
    if (!soundEnabled) return;
    initAudio();

    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        switch (type) {
            case 'success':
                osc.frequency.value = 880;
                gain.gain.value = 0.1;
                break;
            case 'warning':
                osc.frequency.value = 440;
                gain.gain.value = 0.15;
                break;
        }

        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
        // Audio not supported
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    updateSoundButton();
}
```

### 4.4 chart.js - Canvas Grafikonok

```javascript
const chartData = {
    values: [],
    maxDataPoints: 60
};

let chartCache = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0
};

let maxValueCache = {
    value: 10,
    timestamp: 0
};

function initChart() {
    chartData.values = [];
    maxValueCache.value = 10;
    maxValueCache.timestamp = 0;
}

function updateChartData(value) {
    chartData.values.push(value);
    if (chartData.values.length > chartData.maxDataPoints) {
        chartData.values.shift();
    }
    maxValueCache.timestamp = 0;  // invalidate cache
}

function drawChart() {
    const canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartCache.canvas !== canvas) {
        chartCache.canvas = canvas;
        chartCache.ctx = canvas.getContext('2d');
    }

    const ctx = chartCache.ctx;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Resize only if changed
    const newW = rect.width * dpr;
    const newH = rect.height * dpr;
    if (newW !== chartCache.width || newH !== chartCache.height) {
        canvas.width = newW;
        canvas.height = newH;
        ctx.scale(dpr, dpr);
        chartCache.width = newW;
        chartCache.height = newH;
    }

    // Clear
    ctx.fillStyle = '#141c28';
    ctx.fillRect(0, 0, rect.width, rect.height);

    if (chartData.values.length === 0) return;

    // Calculate max with cache
    const now = performance.now();
    if (now - maxValueCache.timestamp > 1000) {
        let max = 10;
        for (const v of chartData.values) {
            if (v > max) max = v;
        }
        maxValueCache.value = max;
        maxValueCache.timestamp = now;
    }

    // Draw...
}
```

---

## 5. CSS Architektúra

### 5.1 CSS Változók (Design Tokens)

```css
:root {
    /* Színek */
    --color-bg-primary: #0a0e14;
    --color-bg-secondary: #141c28;
    --color-bg-tertiary: #1a2332;

    --color-text-primary: #e8ecf0;
    --color-text-secondary: #a8b4c0;
    --color-text-muted: #5a6a7a;

    --color-accent-gold: #f0a500;
    --color-accent-green: #27ae60;
    --color-accent-red: #e74c3c;
    --color-accent-orange: #f39c12;
    --color-accent-blue: #3498db;

    --color-border: #2a3a4a;

    /* Távolságok */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;

    /* Border radius */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;

    /* Árnyékok */
    --shadow-sm: 0 2px 4px rgba(0,0,0,0.2);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.3);
    --shadow-lg: 0 8px 24px rgba(0,0,0,0.4);

    /* Átmenetek */
    --transition-fast: 0.15s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;

    /* Tipográfia */
    --font-family: 'Segoe UI', system-ui, sans-serif;
    --font-size-xs: 10px;
    --font-size-sm: 12px;
    --font-size-md: 14px;
    --font-size-lg: 18px;
    --font-size-xl: 24px;
}
```

### 5.2 Reszponzív Breakpoints

```css
/* Mobile first approach */

/* Tablet */
@media (min-width: 768px) {
    .container {
        flex-direction: row;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .kpi-dashboard {
        grid-template-columns: repeat(4, 1fr);
    }
}

/* Large desktop */
@media (min-width: 1440px) {
    .main-area {
        max-width: 1400px;
    }
}

/* Mobile landscape */
@media (max-height: 500px) and (orientation: landscape) {
    .header { height: 50px; }
    .controls { padding: 4px; }
}
```

---

## 6. Akadálymentesítés (a11y)

```html
<!-- Skip link -->
<a href="#main-content" class="skip-link">Ugrás a fő tartalomhoz</a>

<!-- ARIA szerepek -->
<nav role="toolbar" aria-label="Vezérlés">
    <button aria-label="Indítás" aria-describedby="startDesc" accesskey="s">
        ▶️ Indítás
    </button>
    <span id="startDesc" class="sr-only">Szimuláció indítása</span>
</nav>

<!-- Élő régiók -->
<div role="alert" aria-live="polite" id="notifications"></div>
<div role="status" aria-live="polite" id="timerDisplay"></div>

<!-- Billentyű hozzáférés -->
<button accesskey="s">Start</button>     <!-- Alt+S -->
<button accesskey="p">Pause</button>     <!-- Alt+P -->
<button accesskey="r">Reset</button>     <!-- Alt+R -->
```

```css
/* Screen reader only */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
}

/* Skip link */
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--color-accent-gold);
    color: #000;
    padding: 8px;
    z-index: 100;
}

.skip-link:focus {
    top: 0;
}

/* Focus visible */
:focus-visible {
    outline: 2px solid var(--color-accent-gold);
    outline-offset: 2px;
}
```

---

## 7. Ellenőrzőlista Új Projekthez

### 7.1 Inicializálás
- [ ] Projekt struktúra létrehozása
- [ ] CSS változók definiálása
- [ ] Konstansok fájl elkészítése
- [ ] i18n alapok beállítása
- [ ] DOM cache implementálása

### 7.2 Fő Funkciók
- [ ] Szimuláció állapot kezelés
- [ ] Tick loop implementálása
- [ ] Start/Pause/Reset funkciók
- [ ] Forduló kezelés
- [ ] Statisztika gyűjtés

### 7.3 UI Komponensek
- [ ] Header (timer, forduló badge)
- [ ] Vezérlő gombok
- [ ] Beállítások panel
- [ ] Fő szimuláció terület
- [ ] KPI dashboard
- [ ] Statisztika overlay

### 7.4 Optimalizálás
- [ ] DOM cache használata
- [ ] Változás-detektálás implementálása
- [ ] Számítás cache-ek
- [ ] AnimationManager
- [ ] CSS will-change hintek

### 7.5 Kiegészítők
- [ ] localStorage perzisztencia
- [ ] Többnyelvűség
- [ ] Hangeffektek
- [ ] Tutorial rendszer
- [ ] Preset szcenáriók

### 7.6 Tesztelés
- [ ] Szintaxis ellenőrzés
- [ ] Funkcionális teszt böngészőben
- [ ] Teljesítmény mérés (DevTools)
- [ ] Reszponzivitás tesztelés
- [ ] Akadálymentesítés ellenőrzés

---

## 8. Használat Új Session-ben

Új szimulátor projekt indításához másold be ezt a dokumentációt a session elejére:

```
Szeretnék egy új szimulációs alkalmazást készíteni a következő témában: [TÉMA]

Kérlek olvasd el a csatolt architektúra dokumentációt és használd fel
a mintákat, teljesítmény optimalizálási technikákat.

[Dokumentáció tartalma ide másolva vagy fájl útvonal megadva]

Az új alkalmazás követelményei:
- [Követelmény 1]
- [Követelmény 2]
- ...
```

---

## 9. Referencia Projekt

**Eredeti projekt:** Lean Termelési Szimulátor
**Útvonal:** `B:\030-PBIX ONLINE\Claude Code\Lean szimulátor`

**Fájlok mérete:**
- `app.js`: ~4000 sor (fő logika)
- `styles.css`: ~2400 sor
- `constants.js`: ~200 sor
- `i18n.js`: ~450 sor
- Összesen: ~10 JS modul

**Főbb funkciók:**
- 60 másodperces fordulók
- 4 munkaállomásos gyártósor
- Batch gyártás szimuláció
- OEE számítás
- Operátor mozgás optimalizálás
- Valós idejű grafikonok
- Többnyelvűség (HU/EN)
- Tutorial rendszer
- Preset szcenáriók
- localStorage perzisztencia

---

*Dokumentáció generálva: 2025*
