// ============ KEYVIBE STORAGE SYSTEM ============

class Storage {
    static DB_KEY = 'keyvibe_db';
    static THEME_KEY = 'keyvibe_theme';
    static MUTED_KEY = 'keyvibe_muted';
    
    static db = { users: {}, leaderboard: [] };
    
    // Initialize database
    static init() {
        try {
            const saved = localStorage.getItem(this.DB_KEY);
            if (saved) {
                this.db = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load database, starting fresh');
        }
        
        // Inject mock data if first time
        if (!this.db._initialized) {
            this.db._initialized = true;
            for (let mock of MOCK_PLAYERS) {
                this.db.leaderboard.push({
                    name: mock.name,
                    wpm: mock.wpm,
                    acc: mock.acc,
                    tests: mock.tests,
                    mock: true
                });
            }
            this.save();
        }
    }
    
    // Save database to localStorage
    static save() {
        try {
            localStorage.setItem(this.DB_KEY, JSON.stringify(this.db));
        } catch (e) {
            console.error('Failed to save database');
        }
    }
    
    // Get user by email (primary key)
    static getUser(email) {
        return this.db.users[email.toLowerCase()] || null;
    }
    
    // Get all users (for username lookup)
    static getAllUsers() {
        return Object.values(this.db.users);
    }
    
    // Find user by username (for login with username)
    static getUserByUsername(username) {
        const all = this.getAllUsers();
        return all.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
    }
    
    // Save user data
    static saveUser(email, data) {
        this.db.users[email.toLowerCase()] = data;
        this.save();
    }
    
    // Update leaderboard entry
    static updateLeaderboard(username, wpm, acc) {
        let entry = this.db.leaderboard.find(e => e.name === username && !e.mock);
        
        if (!entry) {
            entry = { name: username, wpm, acc, tests: 1 };
            this.db.leaderboard.push(entry);
        } else {
            if (wpm > entry.wpm) entry.wpm = wpm;
            entry.tests++;
            entry.acc = acc;
        }
        
        this.save();
        return entry;
    }
    
    // Get sorted leaderboard
    static getLeaderboard(limit = 15) {
        return [...this.db.leaderboard]
            .sort((a, b) => b.wpm - a.wpm)
            .slice(0, limit);
    }
    
    // Save theme preference
    static saveTheme(theme) {
        if (theme === 'default') {
            localStorage.removeItem(this.THEME_KEY);
        } else {
            localStorage.setItem(this.THEME_KEY, theme);
        }
    }
    
    // Load theme preference
    static loadTheme() {
        try {
            return localStorage.getItem(this.THEME_KEY) || 'default';
        } catch (e) {
            return 'default';
        }
    }
    
    // Save mute preference
    static saveMuted(muted) {
        localStorage.setItem(this.MUTED_KEY, muted ? '1' : '0');
    }
    
    // Load mute preference
    static loadMuted() {
        try {
            return localStorage.getItem(this.MUTED_KEY) === '1';
        } catch (e) {
            return false;
        }
    }
    
    // Clear all data (for testing)
    static clearAll() {
        localStorage.removeItem(this.DB_KEY);
        localStorage.removeItem(this.THEME_KEY);
        localStorage.removeItem(this.MUTED_KEY);
        this.db = { users: {}, leaderboard: [] };
    }
}