// ============ KEYVIBE FIREBASE SERVICE ============

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

db.settings({
    experimentalForceLongPolling: true,
});

class FirebaseService {
    // ============ AUTHENTICATION ============
    
    // Register new user
    static async register(email, password, username) {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Save user data to Firestore
            await db.collection('users').doc(user.uid).set({
                email: email,
                username: username,
                bestWpm: 0,
                totalTests: 0,
                xp: 0,
                history: [],
                rankedHistory: [],
                maxCombo: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { success: true, user, username };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // Login
    static async login() {
        const email = document.getElementById('si-email').value.trim().toLowerCase();
        const password = document.getElementById('si-pass').value;
        const errEl = document.getElementById('si-err');
        
        if (!email || !password) {
            errEl.textContent = 'Please fill all fields.';
            return;
        }
        
        try {
            // Coba login pake Firebase Auth dulu
            const result = await FirebaseService.login(email, password);
            
            if (result.success) {
                // Login berhasil, pakai data dari Auth
                const user = result.user;
                
                // Bikin userData minimal dari Auth
                const userData = {
                    email: user.email,
                    username: user.email.split('@')[0], // Fallback username
                    bestWpm: 0,
                    totalTests: 0,
                    xp: 0,
                    history: [],
                    rankedHistory: [],
                    maxCombo: 0
                };
                
                // Coba ambil dari Firestore (optional, ga ngeblok login)
                FirebaseService.getUserData(user.uid).then(res => {
                    if (res.success) {
                        Auth.userData = res.data;
                        document.getElementById('h-name').textContent = res.data.username;
                    }
                }).catch(() => {});
                
                Auth.currentUser = user;
                Auth.userData = userData;
                Auth.onLoginSuccess();
            } else {
                errEl.textContent = result.error || 'Login failed.';
            }
        } catch (error) {
            errEl.textContent = 'Login error. Check your connection.';
            console.error(error);
        }
    }

    
    // Sign out
    static async signOut() {
        try {
            await auth.signOut();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // Get current user data from Firestore
    static async getUserData(uid) {
        try {
            const doc = await db.collection('users').doc(uid).get();
            if (doc.exists) {
                return { success: true, data: doc.data() };
            }
            return { success: false, error: 'User not found' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // Update user data
    static async updateUserData(uid, data) {
        try {
            await db.collection('users').doc(uid).update(data);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // ============ LEADERBOARD ============
    
    // Get leaderboard
    static async getLeaderboard(limit = 15) {
        try {
            const snapshot = await db.collection('leaderboard')
                .orderBy('wpm', 'desc')
                .limit(limit)
                .get();
            
            const leaderboard = [];
            snapshot.forEach(doc => {
                leaderboard.push({ id: doc.id, ...doc.data() });
            });
            
            // If empty, seed with mock data
            if (leaderboard.length === 0) {
                await this.seedLeaderboard();
                return await this.getLeaderboard(limit);
            }
            
            return { success: true, data: leaderboard };
        } catch (error) {
            return { success: false, error: error.message, data: [] };
        }
    }
    
    // Update leaderboard entry
    static async updateLeaderboard(username, wpm, acc) {
        try {
            // Cek existing entry
            const snapshot = await db.collection('leaderboard')
                .where('name', '==', username)
                .get();
            
            if (snapshot.empty) {
                // New entry
                await db.collection('leaderboard').add({
                    name: username,
                    wpm: wpm,
                    acc: acc,
                    tests: 1,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            } else {
                // Update existing
                const doc = snapshot.docs[0];
                const data = doc.data();
                await db.collection('leaderboard').doc(doc.id).update({
                    wpm: Math.max(wpm, data.wpm || 0),
                    acc: acc,
                    tests: (data.tests || 0) + 1
                });
            }
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
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
        
        const batch = db.batch();
        mocks.forEach(mock => {
            const ref = db.collection('leaderboard').doc();
            batch.set(ref, {
                ...mock,
                mock: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        });
        
        await batch.commit();
    }
    
    // ============ THEME & PREFERENCES (LocalStorage) ============
    
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