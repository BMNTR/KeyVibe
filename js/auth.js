// ============ KEYVIBE AUTHENTICATION (FIREBASE + SUPABASE DATA) ============

class Auth {
    static currentUser = null;
    static userData = null;
    static isReady = false;
    static readyPromise = Promise.resolve();
    static guestData = {
        bestWpm: 0, totalTests: 0, xp: 0,
        history: [], rankedHistory: [],
        streak: 1, maxCombo: 0
    };

    static getLocalProfileKey(email) {
        return email ? `keyvibe_profile_${email.toLowerCase()}` : '';
    }

    static loadLocalProfile(email) {
        const key = this.getLocalProfileKey(email);
        if (!key) return {};
        try {
            return JSON.parse(localStorage.getItem(key) || '{}');
        } catch (error) {
            console.warn('Failed to load local profile cache:', error);
            return {};
        }
    }

    static saveLocalProfile(profile) {
        const key = this.getLocalProfileKey(profile?.email || this.currentUser?.email);
        if (!key) return;
        const payload = {
            displayName: profile?.displayName || '',
            username: profile?.username || '',
            avatarUrl: profile?.avatarUrl || '',
            avatarSource: profile?.avatarSource || 'default',
            equippedBadge: profile?.equippedBadge || ''
        };
        localStorage.setItem(key, JSON.stringify(payload));
    }

    static init() {
        const savedGuestData = localStorage.getItem('keyvibe_guest_data');
        if (savedGuestData) {
            try {
                this.guestData = JSON.parse(savedGuestData);
            } catch (error) {
                console.warn('Failed to load guest data:', error);
            }
        }

        if (!window.FirebaseAuthProvider) {
            this.setAuthMessage('Firebase auth provider is missing.', 'error');
            this.isReady = true;
            return Promise.resolve();
        }

        const providerState = window.FirebaseAuthProvider.init();
        if (!providerState.success) {
            this.setAuthMessage(providerState.error || 'Firebase is not configured yet.', 'error');
            this.isReady = true;
            return Promise.resolve();
        }

        this.readyPromise = new Promise((resolve) => {
            let firstEvent = true;
            window.FirebaseAuthProvider.onAuthStateChanged(async (user) => {
                await this.applyUser(user);
                if (firstEvent) {
                    firstEvent = false;
                    this.isReady = true;
                    resolve();
                }
            });
        });

        return this.readyPromise;
    }

    static async applyUser(user) {
        if (!user) {
            console.log('Auth state: No user');
            this.currentUser = null;
            this.userData = null;
            return;
        }

        console.log('Auth state: User detected', user.email);
        this.currentUser = user;
        this.setAuthMessage('');
        const localProfile = this.loadLocalProfile(user.email);

        const profileResult = await SupabaseService.ensureUserProfile(user);
        if (profileResult.success && profileResult.data) {
            this.userData = {
                ...profileResult.data,
                email: profileResult.data.email || user.email || '',
                username: localProfile.username || profileResult.data.username || user.user_metadata?.display_name || user.email?.split('@')[0] || 'Player',
                displayName: localProfile.displayName || profileResult.data.displayName || user.user_metadata?.display_name || user.email?.split('@')[0] || 'Player',
                avatarUrl: localProfile.avatarUrl || profileResult.data.avatarUrl || '',
                avatarSource: localProfile.avatarSource || profileResult.data.avatarSource || 'default',
                equippedBadge: localProfile.equippedBadge || profileResult.data.equippedBadge || ''
            };
        } else {
            console.warn('Profile sync failed:', profileResult.error);
            this.userData = {
                dbId: '',
                email: user.email || '',
                username: localProfile.username || user.user_metadata?.display_name || user.email?.split('@')[0] || 'Player',
                displayName: localProfile.displayName || user.user_metadata?.display_name || user.email?.split('@')[0] || 'Player',
                avatarUrl: localProfile.avatarUrl || '',
                avatarSource: localProfile.avatarSource || 'default',
                equippedBadge: localProfile.equippedBadge || '',
                bestWpm: 0,
                totalTests: 0,
                xp: 0,
                history: [],
                rankedHistory: [],
                maxCombo: 0
            };
        }

        this.onLoginSuccess();
    }

    static onLoginSuccess() {
        const modal = document.getElementById('login-modal');
        if (modal) modal.style.display = 'none';

        const username = this.getProfileName();
        const headerName = document.getElementById('h-name');
        if (headerName) headerName.textContent = username;
        this.updateAvatarDisplay(this.getPreferredAvatarUrl());

        UI.updateAll();
        UI.updateHeaderRole?.();
        if (window.Multiplayer?.handleAuthIdentityChanged) {
            Multiplayer.handleAuthIdentityChanged();
        }
        App.newTest();
        UI.showToast(t('welcome_user', { name: username }), '*');
    }

    static getUserData() {
        const data = this.userData || this.guestData;
        if (!this.currentUser) {
            localStorage.setItem('keyvibe_guest_data', JSON.stringify(data));
        }
        return data;
    }

    static isAuthenticated() {
        return !!this.currentUser;
    }

    static getUserId() {
        return (
            this.currentUser?.uid ||
            this.currentUser?.id ||
            this.currentUser?.email ||
            'guest'
        );
    }

    static isOwner() {
        const email = (this.currentUser?.email || this.userData?.email || '').toLowerCase();
        return !!email && OWNER_EMAILS.includes(email);
    }

    static setAuthMessage(message, type) {
        const errEl = document.getElementById('si-err');
        if (!errEl) return;
        errEl.style.color = '';
        if (type === 'success') errEl.style.color = 'var(--success)';
        if (type === 'error') errEl.style.color = 'var(--danger)';
        if (type === 'muted') errEl.style.color = 'var(--muted)';
        errEl.textContent = message || '';
    }

    static getGmailAvatar(email) {
        const hash = this.md5Hash(email.toLowerCase().trim());
        return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=80`;
    }

    static getProfileName() {
        if (!this.currentUser) return t('auth_guest_short');
        return (
            this.userData?.displayName ||
            this.userData?.username ||
            this.currentUser?.displayName ||
            this.currentUser?.user_metadata?.display_name ||
            this.currentUser?.user_metadata?.full_name ||
            this.currentUser?.email?.split('@')[0] ||
            'User'
        );
    }

    static getDefaultAvatarUrl() {
        const meta = this.currentUser?.user_metadata || {};
        return (
            this.currentUser?.photoURL ||
            meta.avatar_url ||
            meta.picture ||
            (this.currentUser?.email ? this.getGmailAvatar(this.currentUser.email) : '')
        );
    }

    static getCustomAvatarUrl() {
        return this.userData?.avatarUrl || '';
    }

    static getAvatarSource() {
        const source = this.userData?.avatarSource || 'default';
        if (source === 'custom' && this.getCustomAvatarUrl()) {
            return 'custom';
        }
        return 'default';
    }

    static getPreferredAvatarUrl() {
        return this.getAvatarSource() === 'custom'
            ? this.getCustomAvatarUrl()
            : this.getDefaultAvatarUrl();
    }

    static getAvatarSourceLabel() {
        return this.getAvatarSource() === 'custom'
            ? t('using_custom_avatar')
            : t('using_default_photo');
    }

    static getEquippedBadge() {
        return this.userData?.equippedBadge || '';
    }

    static setEquippedBadge(badgeId) {
        if (!this.currentUser || !this.userData) {
            this.setProfileMessage(t('sign_in_to_equip'), 'error');
            return;
        }

        this.userData.equippedBadge = badgeId || '';
        this.saveLocalProfile(this.userData);
        UI.renderProfile();
        UI.updateHeaderRole?.();
        if (window.Multiplayer?.handleAuthIdentityChanged) {
            Multiplayer.handleAuthIdentityChanged();
        }
        this.setProfileMessage(badgeId ? t('badge_equipped') : t('badge_cleared'), 'success');
    }

    static md5Hash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash &= hash;
        }
        return Math.abs(hash).toString(16).padStart(32, '0').substring(0, 32);
    }

    static updateAvatarDisplay(avatarUrl) {
        const avatarEl = document.getElementById('h-avatar');
        const avatarImg = document.getElementById('h-avatar-img');
        const avatarText = document.getElementById('h-avatar-text');
        if (!avatarEl) return;

        const username = this.getProfileName() || 'U';
        const firstLetter = username[0].toUpperCase();

        avatarEl.style.background = 'var(--accent)';

        if (avatarUrl && avatarImg) {
            avatarImg.src = avatarUrl;
            avatarImg.style.display = 'block';
            if (avatarText) avatarText.style.display = 'none';
            return;
        }

        if (avatarText) {
            avatarText.style.display = 'block';
            avatarText.textContent = firstLetter;
        }
        if (avatarImg) avatarImg.style.display = 'none';
    }

    static updateProfilePreview(avatarUrl) {
        const preview = document.getElementById('p-avatar-preview');
        const avatarImg = document.getElementById('p-avatar-preview-img');
        const avatarText = document.getElementById('p-avatar-preview-text');
        if (!preview) return;

        const firstLetter = (this.getProfileName() || 'U')[0].toUpperCase();
        preview.style.background = 'var(--accent)';

        if (avatarUrl && avatarImg) {
            avatarImg.src = avatarUrl;
            avatarImg.style.display = 'block';
            if (avatarText) avatarText.style.display = 'none';
            return;
        }

        if (avatarText) {
            avatarText.textContent = firstLetter;
            avatarText.style.display = 'block';
        }
        if (avatarImg) avatarImg.style.display = 'none';
    }

    static setProfileMessage(message, type) {
        const el = document.getElementById('p-profile-msg');
        if (!el) return;
        el.textContent = message || '';
        el.className = 'profile-msg';
        if (type) el.classList.add(type);
    }

    static pickAvatar() {
        const input = document.getElementById('p-avatar-file');
        if (input) input.click();
    }

    static handleAvatarUpload(event) {
        const file = event?.target?.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.setProfileMessage(t('choose_image'), 'error');
            return;
        }

        if (file.size > 1024 * 1024) {
            this.setProfileMessage(t('image_under_limit'), 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const avatarUrl = typeof reader.result === 'string' ? reader.result : '';
            const avatarUrlInput = document.getElementById('p-avatar-url');
            const avatarSourceInput = document.getElementById('p-avatar-source');
            const sourceLabel = document.getElementById('p-avatar-source-label');

            if (avatarUrlInput) avatarUrlInput.value = avatarUrl;
            if (avatarSourceInput) avatarSourceInput.value = avatarUrl ? 'custom' : 'default';
            if (sourceLabel) sourceLabel.textContent = avatarUrl ? t('using_custom_avatar') : this.getAvatarSourceLabel();

            this.updateProfilePreview(avatarUrl || this.getPreferredAvatarUrl());
            this.setProfileMessage(t('avatar_ready'), 'success');
        };
        reader.readAsDataURL(file);
    }

    static resetAvatarToDefault() {
        const avatarUrlInput = document.getElementById('p-avatar-url');
        const avatarSourceInput = document.getElementById('p-avatar-source');
        const fileInput = document.getElementById('p-avatar-file');
        const sourceLabel = document.getElementById('p-avatar-source-label');

        if (avatarUrlInput) avatarUrlInput.value = '';
        if (avatarSourceInput) avatarSourceInput.value = 'default';
        if (fileInput) fileInput.value = '';
        if (sourceLabel) sourceLabel.textContent = this.getAvatarSourceLabel();

        this.updateProfilePreview(this.getDefaultAvatarUrl());
        this.setProfileMessage(t('default_avatar_selected'), 'success');
    }

    static async loginWithGoogle() {
        this.setAuthMessage('');
        const button = document.getElementById('google-signin-btn');
        if (button) {
            button.disabled = true;
            button.textContent = t('auth_opening_google');
        }

        try {
            const result = await window.FirebaseAuthProvider.signInWithGoogle();
            if (!result.success) {
                this.setAuthMessage(result.error || t('auth_google_error'), 'error');
            } else {
                this.setAuthMessage(t('auth_google_connecting'), 'success');
            }
        } catch (error) {
            this.setAuthMessage(error.message || t('auth_google_error'), 'error');
        } finally {
            if (button) {
                button.disabled = false;
                button.textContent = t('auth_google');
            }
        }
    }

    static async updateAccountMetadata(patch) {
        if (!this.currentUser) {
            return { success: false, error: t('auth_need_signin') };
        }

        const displayName = patch.display_name || patch.preferred_username || this.getProfileName();
        const currentPhoto = this.currentUser?.user_metadata?.picture || this.currentUser?.user_metadata?.avatar_url || null;
        const nextPhoto = patch.avatar_source === 'default' ? currentPhoto : currentPhoto;

        const result = await window.FirebaseAuthProvider.updateProfile({
            displayName,
            photoURL: nextPhoto
        });

        if (!result.success) {
            return result;
        }

        this.currentUser = result.user || this.currentUser;
        return { success: true, data: this.currentUser };
    }

    static closeModal() {
        const modal = document.getElementById('login-modal');
        if (modal) modal.style.display = 'none';
        if (!this.currentUser) this.guest();
    }

    static switchTab() {
        const signIn = document.getElementById('form-signin');
        const signUp = document.getElementById('form-signup');
        if (signIn) signIn.classList.add('active');
        if (signUp) signUp.classList.remove('active');
    }

    static guest() {
        this.currentUser = null;
        this.userData = null;
        const modal = document.getElementById('login-modal');
        if (modal) modal.style.display = 'none';

        const headerName = document.getElementById('h-name');
        if (headerName) headerName.textContent = t('auth_guest_short');

        const avatarText = document.getElementById('h-avatar-text');
        const avatarImg = document.getElementById('h-avatar-img');
        const avatarWrap = document.getElementById('h-avatar');
        if (avatarText) avatarText.textContent = (t('auth_guest_short')[0] || 'G').toUpperCase();
        if (avatarImg) avatarImg.style.display = 'none';
        if (avatarWrap) avatarWrap.style.background = 'var(--accent)';

        UI.updateAll();
        UI.updateHeaderRole?.();
        if (window.Multiplayer?.handleAuthIdentityChanged) {
            Multiplayer.handleAuthIdentityChanged();
        }
        App.newTest();
    }

    static async saveProfileSettings() {
        if (!this.currentUser || !this.userData) {
            this.setProfileMessage(t('auth_need_signin'), 'error');
            return;
        }

        const nicknameInput = document.getElementById('p-display-name');
        const avatarUrlInput = document.getElementById('p-avatar-url');
        const avatarSourceInput = document.getElementById('p-avatar-source');

        const displayName = (nicknameInput?.value || '').trim().replace(/\s+/g, ' ').slice(0, 24);
        if (!displayName) {
            this.setProfileMessage(t('nickname_empty'), 'error');
            return;
        }

        const avatarSource = avatarSourceInput?.value === 'custom' && avatarUrlInput?.value ? 'custom' : 'default';
        const avatarUrl = avatarSource === 'custom' ? avatarUrlInput.value : '';
        const previousUsername = this.userData.username;

        this.setProfileMessage(t('saving_profile'), '');

        const metadataResult = await this.updateAccountMetadata({
            display_name: displayName,
            preferred_username: displayName,
            avatar_source: avatarSource,
            custom_avatar_url: avatarUrl || null
        });

        if (!metadataResult.success) {
            this.setProfileMessage(metadataResult.error, 'error');
            return;
        }

        this.userData.email = this.currentUser.email || this.userData.email || '';
        this.userData.username = displayName;
        this.userData.displayName = displayName;
        this.userData.avatarSource = avatarSource;
        this.userData.avatarUrl = avatarUrl;
        this.saveLocalProfile(this.userData);

        const saveResult = await SupabaseService.updateUserData(this.userData.dbId || this.currentUser.email, this.userData);
        if (!saveResult.success) {
            this.setProfileMessage(saveResult.error || 'Profile saved partly, but app data sync failed.', 'error');
            return;
        }

        const leaderboardRename = await SupabaseService.renameLeaderboardEntry(previousUsername, displayName);
        if (!leaderboardRename.success) {
            console.warn('Leaderboard rename skipped:', leaderboardRename.error);
        }

        const headerName = document.getElementById('h-name');
        if (headerName) headerName.textContent = displayName;
        this.updateAvatarDisplay(this.getPreferredAvatarUrl());
        UI.renderProfile();
        UI.renderLeaderboard();
        this.setProfileMessage(t('profile_updated'), 'success');
        UI.showToast(t('profile_updated'), '*');
    }

    static async signout() {
        if (!confirm(t('sign_out_confirm'))) return;
        if (window.Multiplayer?.leaveRoom) {
            await Multiplayer.leaveRoom(false);
        }
        try {
            await window.FirebaseAuthProvider.signOut();
        } catch (error) {
            console.error('Signout error:', error);
        }
        this.guest();
        const modal = document.getElementById('login-modal');
        if (modal) modal.style.display = 'flex';
        this.setAuthMessage('');
    }

    static async saveUserData() {
        if (this.currentUser && this.userData) {
            await SupabaseService.updateUserData(this.userData.dbId || this.currentUser.email, this.userData);
        }
    }
}
