// ============ KEYVIBE AUTHENTICATION (SUPABASE) ============

class Auth {
    static currentUser = null;
    static userData = null;
    static guestData = {
        bestWpm: 0, totalTests: 0, xp: 0,
        history: [], rankedHistory: [],
        streak: 1, maxCombo: 0
    };
    
    // ============ INIT ============
    static init() {
        supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                console.log('Auth state: User detected', session.user.email);
                this.currentUser = session.user;
                
                this.userData = {
                    email: session.user.email,
                    username: session.user.email.split('@')[0],
                    bestWpm: 0, totalTests: 0, xp: 0,
                    history: [], rankedHistory: [], maxCombo: 0
                };
                
                SupabaseService.getUserData(session.user.id).then(result => {
                    if (result.success && result.data) {
                        this.userData = result.data;
                    }
                    this.onLoginSuccess();
                });
            } else {
                console.log('Auth state: No user');
                this.currentUser = null;
                this.userData = null;
            }
        });
    }
    
    static onLoginSuccess() {
        document.getElementById('login-modal').style.display = 'none';
        const username = this.userData?.username || 'User';
        document.getElementById('h-name').textContent = username;
        
        if (this.currentUser?.email) {
            this.updateAvatarDisplay(this.getGmailAvatar(this.currentUser.email));
        }
        
        UI.updateAll();
        App.newTest();
        UI.showToast(`Welcome, ${username}!`, '👋');
    }
    
    static getUserData() {
        return this.userData || this.guestData;
    }
    
    static getGmailAvatar(email) {
        const hash = this.simpleHash(email.toLowerCase().trim());
        return `https://www.gravatar.com/avatar/${hash}?d=404&s=80`;
    }
    
    static simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).padStart(32, '0');
    }
    
    static updateAvatarDisplay(avatarUrl) {
        const avatarEl = document.getElementById('h-avatar');
        const avatarImg = document.getElementById('h-avatar-img');
        const avatarText = document.getElementById('h-avatar-text');
        if (!avatarEl) return;
        
        const username = this.userData?.username || 'U';
        const firstLetter = username[0].toUpperCase();
        
        avatarEl.style.background = 'var(--accent)';
        if (avatarText) { avatarText.style.display = 'block'; avatarText.textContent = firstLetter; }
        if (avatarImg) avatarImg.style.display = 'none';
    }
    
    static closeModal() {
        document.getElementById('login-modal').style.display = 'none';
        if (!this.currentUser) this.guest();
    }
    
    static switchTab(tab) {
        document.getElementById('tab-signin').classList.toggle('active', tab === 'signin');
        document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
        document.getElementById('form-signin').classList.toggle('active', tab === 'signin');
        document.getElementById('form-signup').classList.toggle('active', tab === 'signup');
        document.getElementById('si-err').textContent = '';
        document.getElementById('su-err').textContent = '';
    }
    
    static async login() {
        const email = document.getElementById('si-email').value.trim().toLowerCase();
        const password = document.getElementById('si-pass').value;
        const errEl = document.getElementById('si-err');
        
        if (!email || !password) { errEl.textContent = 'Fill all fields.'; return; }
        
        try {
            await supabase.auth.signInWithPassword({ email, password });
        } catch (error) {
            errEl.textContent = error.message || 'Login failed';
        }
    }
    
    static async register() {
        const email = document.getElementById('su-email').value.trim().toLowerCase();
        const username = document.getElementById('su-user').value.trim();
        const password = document.getElementById('su-pass').value;
        const password2 = document.getElementById('su-pass2').value;
        const errEl = document.getElementById('su-err');
        
        if (!email || !username || !password || !password2) { errEl.textContent = 'Fill all fields.'; return; }
        if (password !== password2) { errEl.textContent = 'Passwords do not match.'; return; }
        if (password.length < 6) { errEl.textContent = 'Password min 6 characters.'; return; }
        
        try {
            const result = await SupabaseService.register(email, password, username);
            if (!result.success) errEl.textContent = result.error;
        } catch (error) {
            errEl.textContent = error.message || 'Registration failed';
        }
    }
    
    static guest() {
        this.currentUser = null;
        this.userData = null;
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('h-name').textContent = 'Guest';
        document.getElementById('h-avatar-text').textContent = 'G';
        UI.updateAll();
        App.newTest();
    }
    
    static async signout() {
        if (!confirm('Sign out?')) return;
        await supabase.auth.signOut();
        this.guest();
        document.getElementById('login-modal').style.display = 'flex';
    }
    
    static async saveUserData() {
        if (this.currentUser && this.userData) {
            await SupabaseService.updateUserData(this.currentUser.id, this.userData);
        }
    }
}