// ============================================
// 5S SIMULATOR - GAME ENGINE MODULE
// ============================================

const GameEngine = {
    // State
    numbers: [],
    clutter: [],
    currentTarget: 1,
    foundNumbers: [],
    errors: 0,
    elapsedTime: 0,

    // ============================================
    // NUMBER PLACEMENT ALGORITHMS
    // ============================================

    generateNumberPositions(count, roundConfig) {
        if (roundConfig.organized) {
            return this.generateOrganizedPositions(count);
        } else {
            return this.generateRandomPositions(count);
        }
    },

    // Random placement with collision avoidance
    generateRandomPositions(count) {
        const positions = [];
        const padding = WORKSPACE.padding;
        const minDistance = WORKSPACE.minDistance;
        const maxAttempts = 150;

        for (let i = 1; i <= count; i++) {
            let attempts = 0;
            let position = null;

            while (attempts < maxAttempts) {
                const x = padding + Math.random() * (100 - 2 * padding);
                const y = padding + Math.random() * (100 - 2 * padding);

                if (this.isValidPosition(x, y, positions, minDistance)) {
                    position = { number: i, x, y, zone: null };
                    break;
                }
                attempts++;
            }

            // Fallback with reduced distance requirement
            if (!position) {
                let fallbackAttempts = 0;
                while (fallbackAttempts < 50) {
                    const x = padding + Math.random() * (100 - 2 * padding);
                    const y = padding + Math.random() * (100 - 2 * padding);

                    if (this.isValidPosition(x, y, positions, minDistance * 0.5)) {
                        position = { number: i, x, y, zone: null };
                        break;
                    }
                    fallbackAttempts++;
                }

                // Final fallback - just place it
                if (!position) {
                    const x = padding + Math.random() * (100 - 2 * padding);
                    const y = padding + Math.random() * (100 - 2 * padding);
                    position = { number: i, x, y, zone: null };
                }
            }

            positions.push(position);
        }

        return positions;
    },

    // Organized placement in zones (for Seiton and later)
    generateOrganizedPositions(count) {
        const positions = [];
        const zones = ZONES;
        const numbersPerZone = Math.ceil(count / zones.length);

        let numberIndex = 1;

        for (let zoneIndex = 0; zoneIndex < zones.length && numberIndex <= count; zoneIndex++) {
            const zone = zones[zoneIndex];
            const startNum = numberIndex;
            const endNum = Math.min(startNum + numbersPerZone - 1, count);
            const zoneCount = endNum - startNum + 1;

            // Calculate grid positions within zone
            const gridPositions = this.calculateGridInZone(zone, zoneCount);

            for (let i = 0; i < zoneCount && numberIndex <= count; i++) {
                const gridPos = gridPositions[i];
                positions.push({
                    number: numberIndex,
                    x: gridPos.x,
                    y: gridPos.y,
                    zone: zoneIndex
                });
                numberIndex++;
            }
        }

        return positions;
    },

    // Calculate grid positions within a zone
    calculateGridInZone(zone, count) {
        const positions = [];
        const cols = Math.ceil(Math.sqrt(count * 1.3)); // Slightly wider than tall
        const rows = Math.ceil(count / cols);

        const zoneWidth = zone.x2 - zone.x1;
        const zoneHeight = zone.y2 - zone.y1;
        const cellWidth = zoneWidth / (cols + 0.5);
        const cellHeight = zoneHeight / (rows + 0.5);

        const offsetX = cellWidth * 0.5;
        const offsetY = cellHeight * 0.5;

        for (let i = 0; i < count; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);

            positions.push({
                x: zone.x1 + offsetX + cellWidth * col,
                y: zone.y1 + offsetY + cellHeight * row
            });
        }

        return positions;
    },

    // Check if position is valid (no collision)
    isValidPosition(x, y, existing, minDistance) {
        for (const pos of existing) {
            const distance = Math.sqrt(
                Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2)
            );
            if (distance < minDistance) return false;
        }
        return true;
    },

    // ============================================
    // CLUTTER GENERATION
    // ============================================

    generateClutter(level, numberPositions) {
        if (level === 'none') return [];

        const config = CLUTTER_LEVELS[level];
        if (!config || config.count === 0) return [];

        const clutter = [];
        const padding = 3;

        for (let i = 0; i < config.count; i++) {
            // Try to avoid placing directly on numbers
            let x, y;
            let attempts = 0;

            do {
                x = padding + Math.random() * (100 - 2 * padding);
                y = padding + Math.random() * (100 - 2 * padding);
                attempts++;
            } while (
                this.overlapsNumber(x, y, numberPositions, 5) &&
                attempts < 30
            );

            const typeGroup = CLUTTER_TYPES[
                Math.floor(Math.random() * CLUTTER_TYPES.length)
            ];

            clutter.push({
                id: i,
                x,
                y,
                type: typeGroup.type,
                content: typeGroup.icons
                    ? typeGroup.icons[Math.floor(Math.random() * typeGroup.icons.length)]
                    : null,
                shape: typeGroup.shapes
                    ? typeGroup.shapes[Math.floor(Math.random() * typeGroup.shapes.length)]
                    : null,
                rotation: Math.random() * 360,
                scale: 0.6 + Math.random() * 0.7,
                opacity: config.opacity * (0.4 + Math.random() * 0.6)
            });
        }

        return clutter;
    },

    // Check if position overlaps a number
    overlapsNumber(x, y, numberPositions, threshold) {
        return numberPositions.some(pos =>
            Math.abs(x - pos.x) < threshold &&
            Math.abs(y - pos.y) < threshold
        );
    },

    // ============================================
    // DIRT PATTERN GENERATION
    // ============================================

    generateDirtPattern() {
        const dirtElements = [];
        const count = 25 + Math.floor(Math.random() * 20);

        for (let i = 0; i < count; i++) {
            dirtElements.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: 2 + Math.random() * 10,
                opacity: 0.08 + Math.random() * 0.18,
                type: Math.random() > 0.6 ? 'stain' : 'dust',
                rotation: Math.random() * 360
            });
        }

        return dirtElements;
    },

    // ============================================
    // GAME LOGIC
    // ============================================

    // Handle number click
    handleNumberClick(clickedNumber) {
        if (clickedNumber === this.currentTarget) {
            // Correct!
            this.foundNumbers.push(clickedNumber);
            this.currentTarget++;

            return {
                success: true,
                isComplete: this.currentTarget > this.numbers.length
            };
        } else {
            // Wrong number
            this.errors++;
            return {
                success: false,
                isComplete: false
            };
        }
    },

    // Calculate score
    calculateScore(time, errors, round) {
        let score = SCORE.basePoints;

        // Time penalty (less points for longer time)
        score -= Math.floor(time * SCORE.timeMultiplier);

        // Error penalty
        score -= errors * SCORE.errorPenalty;

        // Perfect bonus (no errors)
        if (errors === 0) {
            score += SCORE.perfectBonus;
        }

        // Never go below 0
        return Math.max(0, Math.round(score));
    },

    // Calculate improvement percentage
    calculateImprovement(currentTime, previousTime) {
        if (!previousTime || previousTime === 0) return null;
        const improvement = ((previousTime - currentTime) / previousTime) * 100;
        return Math.round(improvement * 10) / 10;
    },

    // Calculate 5S compliance score
    calculate5SCompliance(round, time, errors) {
        // Base score by round (each S step adds 20%)
        const sLevels = [0, 20, 40, 60, 80, 100];
        let compliance = sLevels[round - 1] || 0;

        // Performance adjustment
        if (errors === 0) {
            compliance = Math.min(100, compliance + 5);
        } else if (errors > 5) {
            compliance = Math.max(0, compliance - 10);
        }

        return compliance;
    },

    // Check for achievements
    checkAchievements(time, errors, round, improvement) {
        const earned = [];

        for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
            if (achievement.condition(time, errors, round, improvement)) {
                earned.push({
                    id: key,
                    icon: achievement.icon
                });
            }
        }

        return earned;
    },

    // Reset for new round
    reset() {
        this.numbers = [];
        this.clutter = [];
        this.currentTarget = 1;
        this.foundNumbers = [];
        this.errors = 0;
        this.elapsedTime = 0;
    }
};
