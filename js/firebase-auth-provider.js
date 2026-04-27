// ============ KEYVIBE FIREBASE AUTH PROVIDER ============

(function () {
    function hasFirebaseConfig() {
        const config = typeof FIREBASE_CONFIG !== 'undefined' ? FIREBASE_CONFIG : null;
        return Boolean(
            config &&
            config.apiKey &&
            config.authDomain &&
            config.projectId &&
            config.appId
        );
    }

    function normalizeUser(user) {
        if (!user) return null;

        const providerProfile = user.providerData?.find((entry) => entry?.providerId === 'google.com') || user.providerData?.[0] || {};
        const displayName = user.displayName || providerProfile.displayName || user.email?.split('@')[0] || 'User';
        const photoURL = user.photoURL || providerProfile.photoURL || '';

        return {
            id: user.uid,
            uid: user.uid,
            email: user.email || '',
            displayName,
            photoURL,
            providerId: providerProfile.providerId || '',
            user_metadata: {
                display_name: displayName,
                full_name: displayName,
                picture: photoURL,
                avatar_url: photoURL
            }
        };
    }

    function isMobileDevice() {
        return /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
    }

    class FirebaseAuthProvider {
        static auth = null;

        static init() {
            if (!hasFirebaseConfig()) {
                return { success: false, error: 'Add your Firebase web config in js/config.js before using Google sign-in.' };
            }

            if (!window.firebase) {
                return { success: false, error: 'Firebase SDK failed to load.' };
            }

            if (!window.firebase.apps.length) {
                window.firebase.initializeApp(FIREBASE_CONFIG);
            }

            this.auth = window.firebase.auth();
            this.auth.setPersistence(window.firebase.auth.Auth.Persistence.LOCAL).catch((error) => {
                console.warn('Could not persist Firebase auth session:', error);
            });

            this.auth.getRedirectResult().catch((error) => {
                console.warn('Firebase redirect sign-in result failed:', error);
            });

            return { success: true };
        }

        static isConfigured() {
            return hasFirebaseConfig();
        }

        static onAuthStateChanged(callback) {
            if (!this.auth) return () => {};
            return this.auth.onAuthStateChanged((user) => callback(normalizeUser(user)));
        }

        static async signInWithGoogle() {
            if (!this.auth) {
                return { success: false, error: 'Firebase auth is not ready.' };
            }

            const provider = new window.firebase.auth.GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });

            try {
                if (isMobileDevice()) {
                    await this.auth.signInWithRedirect(provider);
                    return { success: true, redirecting: true };
                }

                const result = await this.auth.signInWithPopup(provider);
                return { success: true, user: normalizeUser(result.user) };
            } catch (error) {
                return { success: false, error: error.message || 'Google sign-in failed.' };
            }
        }

        static async signOut() {
            if (!this.auth) {
                return { success: false, error: 'Firebase auth is not ready.' };
            }
            await this.auth.signOut();
            return { success: true };
        }

        static async updateProfile(patch) {
            const user = this.auth?.currentUser;
            if (!user) {
                return { success: false, error: 'No active Firebase user.' };
            }

            try {
                await user.updateProfile({
                    displayName: patch.displayName ?? user.displayName,
                    photoURL: patch.photoURL ?? user.photoURL
                });
                await user.reload();
                return { success: true, user: normalizeUser(this.auth.currentUser) };
            } catch (error) {
                return { success: false, error: error.message || 'Could not update Firebase profile.' };
            }
        }
    }

    window.FirebaseAuthProvider = FirebaseAuthProvider;
})();
