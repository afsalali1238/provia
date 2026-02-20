// localStorage-based data store for Provia
// Replaces the old UserProfile with ProviaProfile (Hero Credits economy)

export interface ProviaProfile {
    // ── Identity ──
    userId: string;
    displayName: string;
    territory: string | null;       // DHA / MOH / HAAD / SCFHS
    specialty: 'Pharmacist';

    // ── Roadmap State ──
    currentDay: number;              // Highest unlocked day (1–45)
    completedDays: number[];         // Days passed with ≥80%
    dayScores: Record<number, number>; // Best score % per day

    // ── Economy ──
    heroCredits: number;             // Replaces XP/LP
    freeMocksRemaining: number;      // Starts at 2
    mockTestsTaken: number;
    mockTestScores: number[];        // Score % per mock test

    // ── Streaks ──
    streakCount: number;
    lastActiveDate: string;          // ISO date for streak calculation

    // ── Battle ──
    battlesWon: number;
    battlesPlayed: number;

    // ── Cooldown ──
    cooldownUntil: string | null;    // ISO timestamp when cooldown expires
    lastFailedDay: number | null;    // Which day triggered cooldown

    // ── Achievements ──
    unlockedAchievements: string[];

    // ── Meta ──
    createdAt: string;
    selectedMode: 'challenge' | 'mock_center' | null;
}

const PROFILE_KEY = 'provia_profile';
const COOLDOWN_MINUTES = 15; // Cooldown after failing a topic test

export const proviaStore = {
    // ── Profile ──
    getProfile(): ProviaProfile {
        try {
            const data = localStorage.getItem(PROFILE_KEY);
            if (data) {
                return JSON.parse(data) as ProviaProfile;
            }
        } catch {
            // corrupted data, create fresh
        }
        return proviaStore.createDefaultProfile();
    },

    createDefaultProfile(): ProviaProfile {
        const profile: ProviaProfile = {
            userId: 'local_user',
            displayName: 'Pharmacist',
            territory: null,
            specialty: 'Pharmacist',
            currentDay: 1,
            completedDays: [],
            dayScores: {},
            heroCredits: 0,
            freeMocksRemaining: 2,
            mockTestsTaken: 0,
            mockTestScores: [],
            streakCount: 0,
            lastActiveDate: new Date().toISOString().split('T')[0],
            battlesWon: 0,
            battlesPlayed: 0,
            cooldownUntil: null,
            lastFailedDay: null,
            unlockedAchievements: [],
            createdAt: new Date().toISOString(),
            selectedMode: null,
        };
        proviaStore.saveProfile(profile);
        return profile;
    },

    saveProfile(profile: ProviaProfile) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    },

    updateProfile(updates: Partial<ProviaProfile>) {
        const profile = proviaStore.getProfile();
        Object.assign(profile, updates);
        proviaStore.saveProfile(profile);
        return profile;
    },

    // ── Day Completion ──
    completeDay(day: number, scorePercent: number): { passed: boolean; profile: ProviaProfile } {
        const profile = proviaStore.getProfile();
        const passed = scorePercent >= 80;

        // Update best score for this day
        profile.dayScores[day] = Math.max(profile.dayScores[day] || 0, scorePercent);

        if (passed) {
            // Add to completed days
            if (!profile.completedDays.includes(day)) {
                profile.completedDays.push(day);
                profile.heroCredits += 20; // Earn 20 HC per day completed
            }
            // Unlock next day
            profile.currentDay = Math.max(profile.currentDay, day + 1);
            // Update streak
            profile.streakCount += 1;
            // Clear cooldown
            profile.cooldownUntil = null;
            profile.lastFailedDay = null;
        } else {
            // Failed — set cooldown
            const cooldownEnd = new Date(Date.now() + COOLDOWN_MINUTES * 60 * 1000);
            profile.cooldownUntil = cooldownEnd.toISOString();
            profile.lastFailedDay = day;
        }

        profile.lastActiveDate = new Date().toISOString().split('T')[0];
        proviaStore.saveProfile(profile);
        return { passed, profile };
    },

    // ── Mock Test ──
    canTakeMockTest(profile: ProviaProfile): { canTake: boolean; reason: string } {
        if (profile.freeMocksRemaining > 0) {
            return { canTake: true, reason: `${profile.freeMocksRemaining} free mock(s) remaining` };
        }
        if (profile.heroCredits >= 100) {
            return { canTake: true, reason: 'Costs 100 HC' };
        }
        return { canTake: false, reason: `Need 100 HC (you have ${profile.heroCredits})` };
    },

    startMockTest(profile: ProviaProfile): ProviaProfile {
        if (profile.freeMocksRemaining > 0) {
            profile.freeMocksRemaining -= 1;
        } else {
            profile.heroCredits -= 100;
        }
        proviaStore.saveProfile(profile);
        return profile;
    },

    completeMockTest(scorePercent: number): ProviaProfile {
        const profile = proviaStore.getProfile();
        profile.mockTestsTaken += 1;
        profile.mockTestScores.push(scorePercent);
        proviaStore.saveProfile(profile);
        return profile;
    },

    // ── Cooldown ──
    getCooldownRemaining(): number {
        const profile = proviaStore.getProfile();
        if (!profile.cooldownUntil) return 0;
        const remaining = new Date(profile.cooldownUntil).getTime() - Date.now();
        return Math.max(0, remaining);
    },

    isOnCooldown(): boolean {
        return proviaStore.getCooldownRemaining() > 0;
    },

    // ── Questions ──
    async loadQuestions(): Promise<any[]> {
        const data = await import('../features/questions/data/mockQuestions');
        return Object.values(data.MOCK_QUESTIONS).flat();
    },

    getQuestionsForDay(allQuestions: any[], day: number): any[] {
        return allQuestions.filter((q: any) => q.day === day);
    },

    getQuestionsForMockTest(allQuestions: any[], count: number = 120): any[] {
        // Shuffle and pick `count` questions from all available
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    },

    // ── Clear ──
    clearAll() {
        localStorage.removeItem(PROFILE_KEY);
    },
};
