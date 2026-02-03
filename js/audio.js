// ============================================
// 5S SIMULATOR - AUDIO MODULE
// ============================================

let audioCtx = null;
let soundEnabled = true;

// Initialize audio context (must be triggered by user interaction)
function initAudio() {
    if (!audioCtx) {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }
    return audioCtx;
}

// Play a sound effect
function playSound(type) {
    if (!soundEnabled) return;
    if (!initAudio()) return;

    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        switch (type) {
            case 'found':
                // Pleasant "ding" for correct number
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.setValueAtTime(1100, now + 0.05);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;

            case 'error':
                // Low buzz for wrong number
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.setValueAtTime(100, now + 0.1);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;

            case 'complete':
                // Victory fanfare
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523, now);
                osc.frequency.setValueAtTime(659, now + 0.1);
                osc.frequency.setValueAtTime(784, now + 0.2);
                osc.frequency.setValueAtTime(1047, now + 0.3);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.setValueAtTime(0.15, now + 0.35);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
                break;

            case 'start':
                // Game start beep
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.setValueAtTime(660, now + 0.08);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;

            case 'tick':
                // Subtle tick (for timer warning)
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;

            case 'achievement':
                // Achievement unlock
                osc.type = 'sine';
                osc.frequency.setValueAtTime(587, now);
                osc.frequency.setValueAtTime(784, now + 0.1);
                osc.frequency.setValueAtTime(988, now + 0.2);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.setValueAtTime(0.12, now + 0.25);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
                break;
        }
    } catch (e) {
        // Audio error - fail silently
    }
}

// Convenience functions
function playFoundSound() {
    playSound('found');
}

function playErrorSound() {
    playSound('error');
}

function playCompleteSound() {
    playSound('complete');
}

function playStartSound() {
    playSound('start');
}

function playAchievementSound() {
    playSound('achievement');
}

// Toggle sound on/off
function toggleSound() {
    soundEnabled = !soundEnabled;
    updateSoundButton();

    // Play a test sound if enabled
    if (soundEnabled) {
        playSound('tick');
    }

    return soundEnabled;
}

// Update sound button appearance
function updateSoundButton() {
    const btn = document.getElementById('btnSound');
    if (btn) {
        btn.innerHTML = soundEnabled ? '🔊 ' + t('btnSoundOn') : '🔇 ' + t('btnSoundOff');
        btn.classList.toggle('muted', !soundEnabled);
    }
}

// Get current sound state
function isSoundEnabled() {
    return soundEnabled;
}

// Set sound state (for loading from storage)
function setSoundEnabled(enabled) {
    soundEnabled = enabled;
    updateSoundButton();
}
