// ============ KEYVIBE AUTHENTICATION (FIREBASE) ============

class Auth {
    static currentUser = null;
    static userData = null;
    static guestData = {
        bestWpm: 0, totalTests: 0, xp: 0,
        history: [], rankedHistory: [],
        streak: 1, maxCombo: 0
    };
    static authReady = false;
    
    // ============ INIT ============
    static init() {
        // Listen for auth state changes
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                // User is signed in
                const result = await FirebaseService.getUserData(user.uid);
                if (result.success) {
                    this.currentUser = user;
                    this.userData = result.data;
                    this.authReady = true;
                    this.onLoginSuccess();
                }
            } else {
                // User is signed out
                this.currentUser = null;
                this.userData = null;
                this.authReady = true;
            }
        });
    }
    
    // Called when login is successful
    static onLoginSuccess() {
        document.getElementById('login-modal').style.display = 'none';
        
        const username = this.userData?.username || this.currentUser?.email?.split('@')[0] || 'User';
        document.getElementById('h-name').textContent = username;
        
        const avatarUrl = this.currentUser?.email ? this.getGmailAvatar(this.currentUser.email) : null;
        this.updateAvatarDisplay(avatarUrl);
        
        UI.updateAll();
        App.newTest();
        UI.showToast(`Welcome, ${username}!`, '👋');
    }

    
    // ============ GET USER DATA ============
    static getUserData() {
        return this.currentUser && this.userData ? this.userData : this.guestData;
    }
    
    // ============ AVATAR ============
    static getGmailAvatar(email) {
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
        
        const username = this.currentUser ? this.userData.username : 'Guest';
        const firstLetter = username[0].toUpperCase();
        
        // Default: inisial
        avatarEl.style.background = 'var(--accent)';
        if (avatarText) {
            avatarText.style.display = 'block';
            avatarText.textContent = firstLetter;
        }
        if (avatarImg) avatarImg.style.display = 'none';
        
        // Coba load avatar
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
    static async login() {
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
        
        const result = await FirebaseService.login(email, password);
        
        if (!result.success) {
            errEl.textContent = this.getErrorMessage(result.error);
            return;
        }
        
        this.currentUser = result.user;
        this.userData = result.userData;
        this.onLoginSuccess();
    }
    
    // ============ REGISTER ============
    static async register() {
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
        
        const result = await FirebaseService.register(email, password, username);
        
        if (!result.success) {
            errEl.textContent = this.getErrorMessage(result.error);
            return;
        }
        
        this.currentUser = result.user;
        this.userData = {
            email: email,
            username: username,
            bestWpm: 0,
            totalTests: 0,
            xp: 0,
            history: [],
            rankedHistory: [],
            maxCombo: 0
        };
        this.onLoginSuccess();
    }
    
    // ============ GUEST ============
    static guest() {
        this.currentUser = null;
        this.userData = null;
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('h-name').textContent = 'Guest';
        this.updateAvatarDisplay(null);
        UI.updateAll();
        App.newTest();
        UI.showToast("Playing as Guest - scores won't be saved", '👋');
    }
    
    // ============ SIGNOUT ============
    static async signout() {
        if (!confirm('Sign out?')) return;
        
        await FirebaseService.signOut();
        
        this.currentUser = null;
        this.userData = null;
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
    
    // ============ SAVE USER DATA TO FIRESTORE ============
    static async saveUserData() {
        if (this.currentUser && this.userData) {
            await FirebaseService.updateUserData(this.currentUser.uid, this.userData);
        }
    }
    
    // ============ ERROR MESSAGES ============
    static getErrorMessage(error) {
        switch (error) {
            case 'auth/email-already-in-use':
                return 'This email is already registered.';
            case 'auth/invalid-email':
                return 'Invalid email address.';
            case 'auth/weak-password':
                return 'Password must be at least 6 characters.';
            case 'auth/user-not-found':
                return 'No account found with this email.';
            case 'auth/wrong-password':
                return 'Wrong password.';
            case 'auth/invalid-credential':
                return 'Invalid email or password.';
            case 'auth/too-many-requests':
                return 'Too many attempts. Please try again later.';
            default:
                return error || 'Something went wrong. Please try again.';
        }
    }
}