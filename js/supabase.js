// ============ KEYVIBE SUPABASE SERVICE ============

(function () {
    const storage = {
        theme: 'keyvibe_theme',
        muted: 'keyvibe_muted',
        language: 'keyvibe_language'
    };

    function toAppUser(row, fallback) {
        const source = row || {};
        const base = fallback || {};
        return {
            dbId: source.id || base.dbId || '',
            email: source.email || base.email || '',
            username: source.username || base.username || '',
            displayName: source.username || base.displayName || base.username || '',
            avatarUrl: base.avatarUrl || '',
            avatarSource: base.avatarSource || 'default',
            bestWpm: source.best_wpm ?? source.bestWpm ?? base.bestWpm ?? 0,
            totalTests: source.total_tests ?? source.totalTests ?? base.totalTests ?? 0,
            xp: source.xp ?? base.xp ?? 0,
            history: source.history || base.history || [],
            rankedHistory: source.ranked_history || source.rankedHistory || base.rankedHistory || [],
            maxCombo: source.max_combo ?? source.maxCombo ?? base.maxCombo ?? 0
        };
    }

    function cleanDisplayName(value, fallback) {
        const text = typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
        return (text || fallback || 'Player').slice(0, 24);
    }

    function deriveDisplayName(user) {
        const meta = user?.user_metadata || {};
        const candidates = [
            meta.display_name,
            meta.username,
            meta.user_name,
            meta.preferred_username,
            meta.full_name,
            meta.name,
            user?.displayName,
            user?.email ? user.email.split('@')[0] : ''
        ];

        const picked = candidates.find((value) => typeof value === 'string' && value.trim());
        return cleanDisplayName(picked, 'Player');
    }

    const createClient = window.supabase?.createClient;
    const supabaseClient = createClient ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

    window.supabaseClient = supabaseClient;
    window.supabase = supabaseClient;

    class SupabaseService {
        static get client() {
            return window.supabaseClient;
        }

        static loadTheme() {
            return localStorage.getItem(storage.theme) || 'default';
        }

        static saveTheme(theme) {
            localStorage.setItem(storage.theme, theme || 'default');
        }

        static loadMuted() {
            return localStorage.getItem(storage.muted) === '1';
        }

        static saveMuted(muted) {
            localStorage.setItem(storage.muted, muted ? '1' : '0');
        }

        static loadLanguage() {
            return localStorage.getItem(storage.language) || 'en';
        }

        static saveLanguage(language) {
            localStorage.setItem(storage.language, language || 'en');
        }

        static async register(email, password, username) {
            return { success: false, error: 'Password auth is no longer used in this build.' };
        }

        static async loginWithGoogle() {
            return { success: false, error: 'Google login is handled by Firebase in this build.' };
        }

        static async signOut() {
            if (!this.client) {
                return { success: false, error: 'Supabase client not initialized.' };
            }

            const { error } = await this.client.auth.signOut();
            return { success: !error, error: error?.message };
        }

        static async getUserData(identifier) {
            if (!this.client) {
                return { success: false, error: 'Supabase client not initialized.' };
            }

            if (!identifier) {
                return { success: true, data: null };
            }

            let query = this.client.from('users').select('*');
            if (typeof identifier === 'string' && identifier.includes('@')) {
                query = query.eq('email', identifier);
            } else {
                query = query.eq('id', identifier);
            }

            const { data, error } = await query.maybeSingle();

            if (error) return { success: false, error: error.message };
            return { success: true, data: data ? toAppUser(data) : null };
        }

        static async getUserDataByEmail(email) {
            return this.getUserData(email);
        }

        static async mutateUsers(operation, matcher, payload) {
            if (!this.client) {
                return { success: false, error: 'Supabase client not initialized.' };
            }

            const builder = operation === 'insert'
                ? this.client.from('users').insert(payload)
                : this.client.from('users').update(payload).match(matcher);

            const { data, error } = await builder.select('*').single();
            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, data };
        }

        static async ensureUserProfile(user, overrides = {}) {
            if (!this.client) {
                return { success: false, error: 'Supabase client not initialized.' };
            }

            if (!user?.email) {
                return { success: false, error: 'User email is missing.' };
            }

            const displayName = cleanDisplayName(
                overrides.username || overrides.displayName || deriveDisplayName(user),
                'Player'
            );

            const existingResult = await this.getUserDataByEmail(user.email);
            if (!existingResult.success) {
                return existingResult;
            }

            if (existingResult.data) {
                const payload = {
                    email: user.email,
                    username: existingResult.data.username || displayName,
                    max_combo: existingResult.data.maxCombo ?? 0,
                    best_wpm: existingResult.data.bestWpm ?? 0,
                    total_tests: existingResult.data.totalTests ?? 0,
                    xp: existingResult.data.xp ?? 0
                };
                const result = await this.mutateUsers('update', { id: existingResult.data.dbId }, payload);
                if (!result.success) {
                    return result;
                }
                return { success: true, data: toAppUser(result.data, existingResult.data) };
            }

            const payload = {
                id: crypto.randomUUID(),
                email: user.email,
                username: displayName,
                password: '',
                best_wpm: 0,
                total_tests: 0,
                xp: 0,
                max_combo: 0
            };

            const result = await this.mutateUsers('insert', null, payload);
            if (!result.success) {
                return result;
            }
            return { success: true, data: toAppUser(result.data, payload) };
        }

        static async updateUserData(identifier, data) {
            if (!this.client) {
                return { success: false, error: 'Supabase client not initialized.' };
            }

            const payload = {
                email: data.email,
                username: data.username || data.displayName,
                best_wpm: data.bestWpm ?? data.best_wpm ?? 0,
                total_tests: data.totalTests ?? data.total_tests ?? 0,
                xp: data.xp ?? 0,
                max_combo: data.maxCombo ?? data.max_combo ?? 0
            };

            const key = data.dbId || identifier;
            const matcher = (typeof key === 'string' && key.includes('@'))
                ? { email: key }
                : { id: key };

            const result = await this.mutateUsers('update', matcher, payload);
            return { success: result.success, error: result.error };
        }

        static async updateLeaderboard(username, wpm, acc) {
            if (!this.client || !username) {
                return { success: false, error: 'Leaderboard unavailable.' };
            }

            const { error } = await this.client
                .from('leaderboard')
                .upsert({
                    name: username,
                    wpm,
                    acc,
                    tests: 1,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'name' });

            return { success: !error, error: error?.message };
        }

        static async renameLeaderboardEntry(previousName, nextName) {
            if (!this.client || !previousName || !nextName || previousName === nextName) {
                return { success: true };
            }

            const { error } = await this.client
                .from('leaderboard')
                .update({ name: nextName })
                .eq('name', previousName);

            return { success: !error, error: error?.message };
        }

        static async getLeaderboard(limit = 15) {
            if (!this.client) {
                return { success: false, data: [] };
            }

            const { data, error } = await this.client
                .from('leaderboard')
                .select('name,wpm,acc,tests')
                .order('wpm', { ascending: false })
                .limit(limit);

            if (error) {
                console.warn('Leaderboard fetch failed:', error.message);
                return { success: false, data: [] };
            }

            return { success: true, data: data || [] };
        }
    }

    window.SupabaseService = SupabaseService;
})();
