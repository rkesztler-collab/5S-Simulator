// ============================================
// 5S SIMULATOR - INTERNATIONALIZATION (i18n)
// ============================================

let currentLang = 'hu';

const translations = {
    hu: {
        // Header
        title: '5S Számkereső',
        subtitle: 'Munkahelyi szervezés szimulátor',

        // Round Names
        round: 'FORDULÓ',
        chaos: 'Káosz',
        seiri: 'Seiri - Szelektálás',
        seiton: 'Seiton - Sorbarendezés',
        seiso: 'Seiso - Söprés/Takarítás',
        seiketsu: 'Seiketsu - Szabványosítás',
        shitsuke: 'Shitsuke - Fenntartás',

        // Round Descriptions
        chaosDesc: 'A munkaterület teljesen rendezetlen. Sok zavaró elem között kell megtalálni a számokat.',
        seiriDesc: 'Eltávolítjuk a felesleges elemeket. Csak az marad, amire szükség van.',
        seitonDesc: 'Minden elemnek meghatározott helye van. A számok logikus zónákban helyezkednek el.',
        seisoDesc: 'Megtisztítjuk a munkaterületet. A tisztaság javítja a láthatóságot.',
        seiketsuDesc: 'Szabványokat vezetünk be: színkódolás és címkézés segíti a gyors azonosítást.',
        shitsukeDesc: 'A rendszer fenntartása: teszteld a tökéletesen szervezett munkaterületet!',

        // 5S Principles
        seiriPrinciple: '„Ha kétséges, dobd ki!" - Csak a valóban szükséges dolgokat tartsuk meg.',
        seitonPrinciple: '„Minden dolgnak megvan a helye, és minden a helyén van."',
        seisoPrinciple: 'A tiszta munkaterület lehetővé teszi a problémák azonnali észrevételét.',
        seiketsuPrinciple: 'Vizuális szabványok megkönnyítik az eltérések észrevételét.',
        shitsukePrinciple: 'A fegyelem és a szokások tartják fenn az elért eredményeket.',

        // Controls
        btnStart: 'Indítás',
        btnPause: 'Szünet',
        btnContinue: 'Folytatás',
        btnReset: 'Újra',
        btnStats: 'Statisztika',
        btnSettings: 'Beállítások',
        btnHelp: 'Segítség',
        btnSoundOn: 'Hang',
        btnSoundOff: 'Némítva',
        btnClose: 'Bezárás',

        // Game UI
        nextNumber: 'Következő szám:',
        found: 'Megtalálva:',
        errors: 'Hibák:',
        time: 'Idő:',
        score: 'Pontszám:',
        improvement: 'Javulás:',
        compliance: '5S Szint:',

        // Settings
        numberCount: 'Számok mennyisége:',
        easy: 'könnyű',
        normal: 'normál',
        hard: 'nehéz',
        expert: 'szakértő',
        clutterLevel: 'Zavaró elemek:',
        low: 'Kevés',
        medium: 'Közepes',
        high: 'Sok',

        // Results
        roundComplete: 'Forduló Vége!',
        gameComplete: 'Gratulálok! Teljesítetted mind a 6 fordulót!',
        yourTime: 'Időd:',
        yourErrors: 'Hibáid:',
        yourScore: 'Pontszámod:',
        improvementVsPrev: 'Javulás az előzőhöz képest:',
        nextRound: 'Következő forduló',
        playAgain: 'Újra játszom',

        // Statistics
        statsTitle: '5S Előrehaladás',
        roundCol: 'Forduló',
        sStepCol: '5S Lépés',
        timeCol: 'Idő',
        errorsCol: 'Hibák',
        scoreCol: 'Pontszám',
        improvementCol: 'Javulás',

        // Achievements
        achievementUnlocked: 'Új kitüntetés!',
        speedDemon: 'Villámgyors',
        perfectionist: 'Tökéletesség',
        improver: 'Fejlődő',
        master5s: '5S Mester',
        lightning: 'Szuperszonikus',

        // Zone Labels
        zone1: '1-8',
        zone2: '9-16',
        zone3: '17-23',
        zone4: '24-30',

        // Welcome Screen
        welcomeTitle: '5S Számkereső Szimulátor',
        welcomeSubtitle: 'Munkahelyi szervezés játékosan',
        welcomeIntro: 'Üdvözöllek! Ez a szimulátor segít megérteni a <strong>5S módszertan</strong> erejét egy egyszerű játékon keresztül.',
        welcomeGoal: '<strong>A játék:</strong> Keresd meg és kattints a számokra sorrendben (1, 2, 3, ... 30)!',
        welcomeRounds: 'Minden forduló egy 5S lépést alkalmaz:',
        welcomeTip: '<strong>Cél:</strong> Figyeld meg, hogyan javul az időd és csökkennek a hibáid minden 5S lépés után!',
        welcomeReady: 'Készen állsz?',
        welcomeStart: 'Igen, kezdjük!',

        // Events
        roundStarted: 'forduló indult',
        foundNumber: 'Megtalálva',
        wrongNumber: 'Hibás kattintás!',
        pressStart: 'Nyomd meg az Indítás gombot!',

        // Tips
        tip1: 'A káoszban nehéz dolgozni - ezért kezdünk a rendetlenséggel.',
        tip2: 'A Seiri (szelektálás) után már kevesebb zavaró elem van.',
        tip3: 'A Seiton (sorbarendezés) után a számok logikus zónákban vannak.',
        tip4: 'A Seiso (takarítás) után tisztább és átláthatóbb a munkaterület.',
        tip5: 'A Seiketsu (szabványosítás) színkódolással és címkékkel segít.',
        tip6: 'A Shitsuke (fenntartás) a tökéletes rend állapota.',

        // Units
        seconds: 'mp',
        points: 'pont',
        pieces: 'db',
        percent: '%'
    },
    en: {
        // Header
        title: '5S Numbers Hunt',
        subtitle: 'Workplace Organization Simulator',

        // Round Names
        round: 'ROUND',
        chaos: 'Chaos',
        seiri: 'Seiri - Sort',
        seiton: 'Seiton - Set in Order',
        seiso: 'Seiso - Shine',
        seiketsu: 'Seiketsu - Standardize',
        shitsuke: 'Shitsuke - Sustain',

        // Round Descriptions
        chaosDesc: 'The workspace is completely disorganized. Find the numbers among many distracting elements.',
        seiriDesc: 'Remove unnecessary items. Only what is needed remains.',
        seitonDesc: 'Everything has a designated place. Numbers are organized in logical zones.',
        seisoDesc: 'Clean the workspace. Cleanliness improves visibility.',
        seiketsuDesc: 'Establish standards: color coding and labels help quick identification.',
        shitsukeDesc: 'Sustain the system: test the perfectly organized workspace!',

        // 5S Principles
        seiriPrinciple: '"When in doubt, throw it out!" - Keep only what is truly needed.',
        seitonPrinciple: '"A place for everything, and everything in its place."',
        seisoPrinciple: 'A clean workspace enables immediate detection of problems.',
        seiketsuPrinciple: 'Visual standards make deviations easy to spot.',
        shitsukePrinciple: 'Discipline and habits sustain the achieved results.',

        // Controls
        btnStart: 'Start',
        btnPause: 'Pause',
        btnContinue: 'Continue',
        btnReset: 'Restart',
        btnStats: 'Statistics',
        btnSettings: 'Settings',
        btnHelp: 'Help',
        btnSoundOn: 'Sound',
        btnSoundOff: 'Muted',
        btnClose: 'Close',

        // Game UI
        nextNumber: 'Next number:',
        found: 'Found:',
        errors: 'Errors:',
        time: 'Time:',
        score: 'Score:',
        improvement: 'Improvement:',
        compliance: '5S Level:',

        // Settings
        numberCount: 'Number count:',
        easy: 'easy',
        normal: 'normal',
        hard: 'hard',
        expert: 'expert',
        clutterLevel: 'Clutter level:',
        low: 'Low',
        medium: 'Medium',
        high: 'High',

        // Results
        roundComplete: 'Round Complete!',
        gameComplete: 'Congratulations! You completed all 6 rounds!',
        yourTime: 'Your time:',
        yourErrors: 'Your errors:',
        yourScore: 'Your score:',
        improvementVsPrev: 'Improvement vs previous:',
        nextRound: 'Next round',
        playAgain: 'Play again',

        // Statistics
        statsTitle: '5S Progress',
        roundCol: 'Round',
        sStepCol: '5S Step',
        timeCol: 'Time',
        errorsCol: 'Errors',
        scoreCol: 'Score',
        improvementCol: 'Improvement',

        // Achievements
        achievementUnlocked: 'Achievement Unlocked!',
        speedDemon: 'Speed Demon',
        perfectionist: 'Perfectionist',
        improver: 'Improver',
        master5s: '5S Master',
        lightning: 'Supersonic',

        // Zone Labels
        zone1: '1-8',
        zone2: '9-16',
        zone3: '17-23',
        zone4: '24-30',

        // Welcome Screen
        welcomeTitle: '5S Numbers Hunt Simulator',
        welcomeSubtitle: 'Workplace Organization Made Fun',
        welcomeIntro: 'Welcome! This simulator helps you understand the power of the <strong>5S methodology</strong> through a simple game.',
        welcomeGoal: '<strong>The game:</strong> Find and click the numbers in order (1, 2, 3, ... 30)!',
        welcomeRounds: 'Each round applies a 5S step:',
        welcomeTip: '<strong>Goal:</strong> Watch how your time improves and errors decrease with each 5S step!',
        welcomeReady: 'Are you ready?',
        welcomeStart: "Yes, let's go!",

        // Events
        roundStarted: 'round started',
        foundNumber: 'Found',
        wrongNumber: 'Wrong click!',
        pressStart: 'Press Start to begin!',

        // Tips
        tip1: 'Working in chaos is hard - that\'s why we start with disorder.',
        tip2: 'After Seiri (sort), there are fewer distracting elements.',
        tip3: 'After Seiton (set in order), numbers are in logical zones.',
        tip4: 'After Seiso (shine), the workspace is cleaner and clearer.',
        tip5: 'Seiketsu (standardize) helps with color coding and labels.',
        tip6: 'Shitsuke (sustain) is the state of perfect order.',

        // Units
        seconds: 's',
        points: 'pts',
        pieces: 'pcs',
        percent: '%'
    }
};

// Translation function
function t(key) {
    return translations[currentLang][key] || translations['hu'][key] || key;
}

// Get round name
function getRoundName(roundNum) {
    const names = ['', 'chaos', 'seiri', 'seiton', 'seiso', 'seiketsu', 'shitsuke'];
    return t(names[roundNum] || 'chaos');
}

// Get round description
function getRoundDescription(roundNum) {
    const descs = ['', 'chaosDesc', 'seiriDesc', 'seitonDesc', 'seisoDesc', 'seiketsuDesc', 'shitsukeDesc'];
    return t(descs[roundNum] || 'chaosDesc');
}

// Get 5S principle
function get5SPrinciple(roundNum) {
    const principles = ['', '', 'seiriPrinciple', 'seitonPrinciple', 'seisoPrinciple', 'seiketsuPrinciple', 'shitsukePrinciple'];
    return t(principles[roundNum] || '');
}

// Get tip for round
function getRoundTip(roundNum) {
    return t('tip' + roundNum);
}

// Toggle language
function toggleLanguage() {
    currentLang = currentLang === 'hu' ? 'en' : 'hu';
    updateAllTexts();
    saveToLocalStorage();
}

// Update all UI texts
function updateAllTexts() {
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (el.tagName === 'INPUT' && el.type === 'text') {
            el.placeholder = t(key);
        } else {
            el.textContent = t(key);
        }
    });

    // Update elements with data-i18n-html attribute (allows HTML)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.dataset.i18nHtml;
        el.innerHTML = t(key);
    });

    // Update language button
    const btnLang = document.getElementById('btnLang');
    if (btnLang) {
        btnLang.textContent = currentLang === 'hu' ? '🇬🇧' : '🇭🇺';
        btnLang.title = currentLang === 'hu' ? 'Switch to English' : 'Váltás magyarra';
    }

    // Update page title
    document.title = t('title') + ' - 5S';
}
