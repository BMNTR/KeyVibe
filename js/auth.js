// ============ KEYVIBE AUTHENTICATION ============

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
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                console.log('Auth state: User detected', user.email);
                Auth.currentUser = user;
                
                // Default data - gunakan displayName dari Google jika ada
                Auth.userData = {
                    email: user.email,
                    username: user.displayName || user.email.split('@')[0],
                    photoURL: user.photoURL || null,
                    bestWpm: 0, totalTests: 0, xp: 0,
                    history: [], rankedHistory: [], maxCombo: 0
                };
                
                // Try Firestore
                try {
                    const doc = await db.collection('users').doc(user.uid).get();
                    if (doc.exists) {
                        const firestoreData = doc.data();
                        Auth.userData = {
                            ...firestoreData,
                            // Selalu update photoURL dari Firebase Auth (paling fresh)
                            photoURL: user.photoURL || firestoreData.photoURL || null,
                            username: firestoreData.username || user.displayName || user.email.split('@')[0]
                        };
                        console.log('User data loaded from Firestore');
                    } else {
                        // Simpan data awal ke Firestore jika user baru
                        try {
                            await db.collection('users').doc(user.uid).set({
                                email: user.email,
                                username: Auth.userData.username,
                                photoURL: user.photoURL || null,
                                bestWpm: 0, totalTests: 0, xp: 0,
                                history: [], rankedHistory: [], maxCombo: 0,
                                createdAt: firebase.firestore.FieldValue.serverTimestamp()
                            });
                        } catch (e) {
                            console.warn('Could not save initial user data:', e);
                        }
                    }
                } catch (e) {
                    console.warn('Using default user data:', e);
                }
                
                Auth.onLoginSuccess();
            } else {
                console.log('Auth state: No user');
                Auth.currentUser = null;
                Auth.userData = null;
            }
        });
    }
    
    static onLoginSuccess() {
        document.getElementById('login-modal').style.display = 'none';
        const username = this.userData?.username || 'User';
        document.getElementById('h-name').textContent = username;
        
        // Update avatar: prioritaskan foto Google
        const photoURL = this.currentUser?.photoURL || this.userData?.photoURL || null;
        this.updateAvatarDisplay(photoURL);
        
        UI.updateAll();
        App.newTest();
        UI.showToast(`Welcome, ${username}!`, 'wave');
    }
    
    static getUserData() {
        return this.userData || this.guestData;
    }
    
    // Update avatar display - mendukung foto Google dan fallback ke huruf
    static updateAvatarDisplay(photoURL) {
        const avatarEl = document.getElementById('h-avatar');
        const avatarImg = document.getElementById('h-avatar-img');
        const avatarText = document.getElementById('h-avatar-text');
        if (!avatarEl) return;
        
        const username = this.userData?.username || 'U';
        const firstLetter = username[0].toUpperCase();
        
        if (photoURL) {
            // Tampilkan foto profil Google
            if (avatarImg) {
                avatarImg.src = photoURL;
                avatarImg.style.display = 'block';
                avatarImg.onerror = () => {
                    // Fallback ke huruf jika foto gagal load
                    avatarImg.style.display = 'none';
                    if (avatarText) {
                        avatarText.style.display = 'block';
                        avatarText.textContent = firstLetter;
                    }
                    avatarEl.style.background = 'var(--accent)';
                };
            }
            if (avatarText) avatarText.style.display = 'none';
            avatarEl.style.background = 'transparent';
        } else {
            // Fallback ke huruf pertama username
            avatarEl.style.background = 'var(--accent)';
            if (avatarText) { avatarText.style.display = 'block'; avatarText.textContent = firstLetter; }
            if (avatarImg) avatarImg.style.display = 'none';
        }
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
        
        errEl.textContent = 'Signing in...';
        
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            console.log('Login success:', result.user.email);
            // onAuthStateChanged will handle the rest
        } catch (error) {
            console.error('Login error:', error);
            errEl.textContent = Auth._getErrorMessage(error.code || error.message);
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
        
        errEl.textContent = 'Creating account...';
        
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Update displayName di Firebase Auth
            try {
                await user.updateProfile({ displayName: username });
            } catch (e) {
                console.warn('Could not update display name:', e);
            }
            
            // Save to Firestore
            try {
                await db.collection('users').doc(user.uid).set({
                    email, username,
                    photoURL: null,
                    bestWpm: 0, totalTests: 0, xp: 0,
                    history: [], rankedHistory: [], maxCombo: 0,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            } catch (e) { console.warn('Firestore save skipped:', e); }
            
            console.log('Register success:', user.email);
            // onAuthStateChanged will handle the rest
        } catch (error) {
            console.error('Register error:', error);
            errEl.textContent = Auth._getErrorMessage(error.code || error.message);
        }
    }
    
    // Terjemahkan error code Firebase ke pesan yang mudah dimengerti
    static _getErrorMessage(code) {
        const messages = {
            'auth/user-not-found': 'No account found with this email.',
            'auth/wrong-password': 'Incorrect password.',
            'auth/invalid-email': 'Invalid email address.',
            'auth/email-already-in-use': 'Email already registered.',
            'auth/weak-password': 'Password is too weak (min 6 chars).',
            'auth/too-many-requests': 'Too many attempts. Try again later.',
            'auth/network-request-failed': 'Network error. Check connection.',
            'auth/invalid-credential': 'Invalid email or password.',
            'auth/user-disabled': 'This account has been disabled.',
        };
        return messages[code] || 'Authentication error. Please try again.';
    }
    
    static guest() {
        this.currentUser = null;
        this.userData = null;
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('h-name').textContent = 'Guest';
        
        const avatarText = document.getElementById('h-avatar-text');
        const avatarImg = document.getElementById('h-avatar-img');
        const avatarEl = document.getElementById('h-avatar');
        if (avatarText) avatarText.textContent = 'G';
        if (avatarImg) avatarImg.style.display = 'none';
        if (avatarEl) avatarEl.style.background = 'var(--accent)';
        
        UI.updateAll();
        App.newTest();
    }
    
    static async signout() {
        if (!confirm('Sign out?')) return;
        try {
            await auth.signOut();
        } catch (e) {
            console.error('Signout error:', e);
        }
        this.guest();
        document.getElementById('login-modal').style.display = 'flex';
    }
    
    static async saveUserData() {
        if (this.currentUser && this.userData) {
            try {
                await db.collection('users').doc(this.currentUser.uid).update(this.userData);
            } catch (e) {
                console.warn('Could not save user data:', e);
            }
        }
    }
}
