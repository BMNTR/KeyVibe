// ============ KEYVIBE SUPABASE SERVICE ============

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

class SupabaseService {
    
    // ============ AUTHENTICATION ============
    
    // Register new user
    static async register(email, password, username) {
        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
            });
            
            if (authError) throw authError;
            
            const user = authData.user;
            
            const { error: dbError } = await supabase
                .from('users')
                .insert({
                    id: user.id,
                    email: email,
                    username: username,
                    password: '',
                    best_wpm: 0,
                    total_tests: 0,
                    xp: 0,
                    max_combo: 0
                });
            
            if (dbError) throw dbError;
            
            return { success: true, user, username };
        } catch (error) {
            return { success: false, error: error.message || 'Registration failed' };
        }
    }
    
    // Login
    static async login(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            
            if (error) throw error;
            
            const { data: userData, error: dbError } = await supabase
                .from('users')
                .select('*')
                .eq('id', data.user.id)
                .single();
            
            return { 
                success: true, 
                user: data.user, 
                userData: userData || {
                    email: email,
                    username: email.split('@')[0],
                    best_wpm: 0,
                    total_tests: 0,
                    xp: 0,
                    max_combo: 0
                }
            };
        } catch (error) {
            return { success: false, error: error.message || 'Login failed' };
        }
    }
    
    // Sign out
    static async signOut() {
        const { error } = await supabase.auth.signOut();
        return { success: !error };
    }
    
    // Get user data
    static async getUserData(uid) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', uid)
            .single();
        
        if (error) return { success: false, error: error.message };
        return { success: true, data };
    }
    
    // Update user data
    static async updateUserData(uid, data) {
        const { error } = await supabase
            .from('users')
            .update({
                best_wpm: data.bestWpm || data.best_wpm || 0,
                total_tests: data.totalTests || data.total_tests || 0,
                xp: data.xp || 0,
                max_combo: data.maxCombo || data.max_combo || 0
            })
            .eq('id', uid);
        
        return { success: !error };
    }
    
    // ============ LEADERBOARD ============
    
    // Get leaderboard
    static async getLeaderboard(limit = 15) {
        const { data, error } = await supabase
            .from('leaderboard')
            .select('*')
            .order('wpm', { ascending: false })
            .limit(limit);
        
        if (error || !data || data.length === 0) {
            await this.seedLeaderboard();
            const { data: newData } = await supabase
                .from('leaderboard')
                .select('*')
                .order('wpm', { ascending: false })
                .limit(limit);
            return { success: true, data: newData || [] };
        }
        
        return { success: true, data: data };
    }
    
    // Update leaderboard entry
    static async updateLeaderboard(username, wpm, acc) {
        const { data: existing } = await supabase
            .from('leaderboard')
            .select('*')
            .eq('name', username)
            .single();
        
        if (existing) {
            await supabase
                .from('leaderboard')
                .update({
                    wpm: Math.max(wpm, existing.wpm || 0),
                    acc: acc,
                    tests: (existing.tests || 0) + 1
                })
                .eq('name', username);
        } else {
            await supabase
                .from('leaderboard')
                .insert({
                    name: username,
                    wpm: wpm,
                    acc: acc,
                    tests: 1
                });
        }
        
        return { success: true };
    }
    
    // Seed leaderboard with mock data
    static async seedLeaderboard() {
        const mocks = [
            { name: "SpeedDemon99", wpm: 194, acc: 98.2, tests: 342 },
            { name: "QuantumFingers", wpm: 172, acc: 97.5, tests: 211 },
            { name: "NightTyper", wpm: 158, acc: 96.8, tests: 456 },
            { name: "KeyboardWizard", wpm: 143, acc: 99.1, tests: 189 },
            { name: "SwiftPaws", wpm: 131, acc: 95.4, tests: 303 },
            { name: "TypeLord", wpm: 118, acc: 97.8, tests: 267 },
            { name: "FlashType", wpm: 102, acc: 94.2, tests: 128 },
            { name: "RapidKeys", wpm: 88, acc: 96.3, tests: 89 }
        ];
        
        for (let mock of mocks) {
            await supabase.from('leaderboard').insert(mock);
        }
    }
    
    // ============ THEME & PREFERENCES ============
    
    static saveTheme(theme) {
        if (theme === 'default') {
            localStorage.removeItem('keyvibe_theme');
        } else {
            localStorage.setItem('keyvibe_theme', theme);
        }
    }
    
    static loadTheme() {
        return localStorage.getItem('keyvibe_theme') || 'default';
    }
    
    static saveMuted(muted) {
        localStorage.setItem('keyvibe_muted', muted ? '1' : '0');
    }
    
    static loadMuted() {
        return localStorage.getItem('keyvibe_muted') === '1';
    }
}