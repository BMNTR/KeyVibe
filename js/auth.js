// ============ KEYVIBE AUTHENTICATION ============

class Auth {
    static currentUser = null;
    static guestData = {
        bestWpm: 0, totalTests: 0, xp: 0,
        history: [], rankedHistory: [],
        streak: 1, maxCombo: 0
    };
    
    // ============ GET USER DATA ============
    static getUserData() {
        return this.currentUser ? this.currentUser.data : this.guestData;
    }
    
    // ============ SAVE CURRENT USER ============
    static saveCurrentUser() {
        if (this.currentUser) {
            Storage.saveUser(this.currentUser.email, this.currentUser.data);
        }
    }
    
    // ============ PERSISTENT LOGIN ============
    static checkPersistentLogin() {
        const savedEmail = localStorage.getItem('keyvibe_session');
        if (savedEmail) {
            const userData = Storage.getUser(savedEmail);
            if (userData) {
                this.currentUser = { email: savedEmail, data: userData };
                document.getElementById('h-name').textContent = userData.username;
                const avatarUrl = this.getGmailAvatar(savedEmail);
                this.updateAvatarDisplay(avatarUrl);
                return true;
            }
        }
        return false;
    }
    
    static saveSession() {
        if (this.currentUser) {
            localStorage.setItem('keyvibe_session', this.currentUser.email);
        }
    }
    
    static clearSession() {
        localStorage.removeItem('keyvibe_session');
    }
    
    // ============ AVATAR ============
    static getGmailAvatar(email) {
        // Pake Gravatar
        const hash = this.simpleHash(email.toLowerCase().trim());
        return `https://www.gravatar.com/avatar/${hash}?d=404&s=80`;
    }
    
    static simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).padStart(32, '0');
    }
    
    static updateAvatarDisplay(avatarUrl) {
        const avatarEl = document.getElementById('h-avatar');
        const avatarImg = document.getElementById('h-avatar-img');
        const avatarText = document.getElementById('h-avatar-text');
        
        if (!avatarEl) return;
        
        const username = this.currentUser ? this.currentUser.data.username : 'Guest';
        const firstLetter = username[0].toUpperCase();
        
        // Default: tampilin inisial
        avatarEl.style.background = 'var(--accent)';
        if (avatarText) {
            avatarText.style.display = 'block';
            avatarText.textContent = firstLetter;
        }
        if (avatarImg) avatarImg.style.display = 'none';
        
        // Kalo ada avatar URL, coba load
        if (avatarUrl) {
            const img = avatarImg || document.createElement('img');
            img.id = 'h-avatar-img';
            img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:50%;display:none;';
            
            img.onload = () => {
                img.style.display = 'block';
                if (avatarText) avatarText.style.display = 'none';
                avatarEl.style.background = 'transparent';
            };
            
            img.onerror = () => {
                // Fallback ke inisial
                img.style.display = 'none';
                if (avatarText) avatarText.style.display = 'block';
                avatarEl.style.background = 'var(--accent)';
            };
            
            img.src = avatarUrl;
            if (!avatarImg) avatarEl.appendChild(img);
        }
    }
    
    // ============ MODAL ============
    static closeModal() {
        document.getElementById('login-modal').style.display = 'none';
        if (!this.currentUser) {
            this.guest();
        }
    }
    
    static switchTab(tab) {
        document.getElementById('tab-signin').classList.toggle('active', tab === 'signin');
        document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
        document.getElementById('form-signin').classList.toggle('active', tab === 'signin');
        document.getElementById('form-signup').classList.toggle('active', tab === 'signup');
        
        document.getElementById('si-err').textContent = '';
        document.getElementById('su-err').textContent = '';
    }
    
    // ============ LOGIN ============
    static login() {
        const email = document.getElementById('si-email').value.trim().toLowerCase();
        const password = document.getElementById('si-pass').value;
        const errEl = document.getElementById('si-err');
        
        if (!email || !password) {
            errEl.textContent = 'Please fill all fields.';
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errEl.textContent = 'Please enter a valid email address.';
            return;
        }
        
        const userData = Storage.getUser(email);
        
        if (!userData || userData.password !== btoa(password)) {
            errEl.textContent = 'Wrong email or password.';
            return;
        }
        
        this.setUser(email, userData);
    }
    
    // ============ REGISTER ============
    static register() {
        const email = document.getElementById('su-email').value.trim().toLowerCase();
        const username = document.getElementById('su-user').value.trim();
        const password = document.getElementById('su-pass').value;
        const password2 = document.getElementById('su-pass2').value;
        const errEl = document.getElementById('su-err');
        
        if (!email || !username || !password || !password2) {
            errEl.textContent = 'Please fill all fields.';
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errEl.textContent = 'Please enter a valid email address.';
            return;
        }
        
        if (username.length < 3) {
            errEl.textContent = 'Username must be 3+ characters.';
            return;
        }
        
        if (/[^a-zA-Z0-9_]/.test(username)) {
            errEl.textContent = 'Letters, numbers, underscores only.';
            return;
        }
        
        if (password.length < 6) {
            errEl.textContent = 'Password must be 6+ characters.';
            return;
        }
        
        if (password !== password2) {
            errEl.textContent = 'Passwords do not match.';
            return;
        }
        
        if (Storage.getUser(email)) {
            errEl.textContent = 'This email is already registered.';
            return;
        }
        
        const allUsers = Storage.getAllUsers();
        if (allUsers.some(u => u.username && u.username.toLowerCase() === username.toLowerCase())) {
            errEl.textContent = 'Username already taken.';
            return;
        }
        
        const userData = {
            email: email,
            username: username,
            password: btoa(password),
            bestWpm: 0,
            totalTests: 0,
            xp: 0,
            history: [],
            rankedHistory: [],
            streak: 1,
            maxCombo: 0
        };
        
        Storage.saveUser(email, userData);
        this.setUser(email, userData);
    }
    
    // ============ GUEST ============
    static guest() {
        this.currentUser = null;
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('h-name').textContent = 'Guest';
        this.updateAvatarDisplay(null);
        UI.updateAll();
        App.newTest();
        UI.showToast("Playing as Guest - scores won't be saved", '👋');
    }
    
    // ============ SET USER ============
    static setUser(email, data) {
        if (!data.maxCombo) data.maxCombo = 0;
        if (!data.rankedHistory) data.rankedHistory = [];
        
        this.currentUser = { email, data };
        this.saveSession(); // ← PERSISTENT LOGIN
        
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('h-name').textContent = data.username;
        
        const avatarUrl = this.getGmailAvatar(email);
        this.updateAvatarDisplay(avatarUrl);
        
        UI.updateAll();
        App.newTest();
        UI.showToast(`Welcome, ${data.username}!`, '👋');
    }
    
    // ============ SIGNOUT ============
    static signout() {
        if (!confirm('Sign out? Your guest data will be cleared.')) return;
        
        this.currentUser = null;
        this.clearSession(); // ← CLEAR SESSION
        
        this.guestData = {
            bestWpm: 0, totalTests: 0, xp: 0,
            history: [], rankedHistory: [],
            streak: 1, maxCombo: 0
        };
        
        document.getElementById('login-modal').style.display = 'flex';
        document.getElementById('h-name').textContent = 'Guest';
        this.updateAvatarDisplay(null);
        
        UI.updateAll();
        App.newTest();
    }
}