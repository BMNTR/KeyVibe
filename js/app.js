// ============ KEYVIBE MAIN CONTROLLER ============

class App {
    static currentMode = 'practice';
    static currentTab = 'practice';
    static currentLanguage = 'en';
    
    // ============ INITIALIZATION ============
    static async init() {
        Sound.init();
        UI.buildThemePanel();
        UI.buildLanguageSelects?.();
        const savedTheme = SupabaseService.loadTheme();
        const savedLanguage = SupabaseService.loadLanguage();
        this.setTheme(savedTheme);
        this.currentLanguage = isValidLanguage(savedLanguage) ? savedLanguage : 'en';
        TypingEngine.currentLanguage = this.currentLanguage;
        UI.buildLanguageSelects?.();
        this.createMobileInput();
        this.setupEventListeners();
        await Auth.init();
        
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
            loginModal.style.display = Auth.currentUser ? 'none' : 'flex';
        }

        UI.updateAll();
        UI.updateHeaderRole?.();
        UI.syncLanguageSelects?.(this.currentLanguage);
        UI.applyLanguage?.();
        
        // WAJIB: init typing engine dulu
        this.currentMode = 'practice';
        TypingEngine.currentMode = 'practice';
        this.setMode('practice');  // Ensure mode-practice div is visible
        this.newTest();
        
        setTimeout(() => {
            this.focusCurrentTextBox();
        }, 500);
        
        console.log('KeyVibe Ready!');
    }
    
    // Create hidden input for mobile keyboard
    static createMobileInput() {
        const old = document.getElementById('mobile-input');
        if (old) old.remove();
        
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'text';
        hiddenInput.id = 'mobile-input';
        hiddenInput.setAttribute('autocomplete', 'off');
        hiddenInput.setAttribute('autocorrect', 'off');
        hiddenInput.setAttribute('autocapitalize', 'off');
        hiddenInput.setAttribute('spellcheck', 'false');
        hiddenInput.setAttribute('inputmode', 'text');
        hiddenInput.setAttribute('enterkeyhint', 'done');
        
        hiddenInput.style.cssText = `
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 1px !important;
            height: 1px !important;
            opacity: 0.01 !important;
            z-index: 9999 !important;
            font-size: 16px !important;
            pointer-events: auto !important;
        `;
        
        document.body.appendChild(hiddenInput);
        
        hiddenInput.addEventListener('input', (e) => {
            const val = e.target.value;
            if (val.length === 0) return;
            
            const char = val[val.length - 1];
            e.target.value = '';

            if (this.currentTab === 'multiplayer' && !Multiplayer.canAcceptTyping()) {
                return;
            }
            
            if (TypingEngine.state.paused) {
                TypingEngine.resumePause();
                return;
            }
            
            if (!TypingEngine.state.started) {
                TypingEngine.start();
            }
            
            if (!TypingEngine.state.running) return;
            
            TypingEngine.processChar(char);
        });
        
        hiddenInput.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace') {
                e.preventDefault();
                TypingEngine.backspace();
            }
        });
    }
    
    // Focus current text box
    static focusCurrentTextBox() {
        let textBoxId;
        if (this.currentMode === 'ranked') {
            textBoxId = 'r-text-box';
        } else if (this.currentTab === 'multiplayer') {
            textBoxId = 'mp-text-box';
        } else {
            textBoxId = 'text-box';
        }
        
        const mobileInput = document.getElementById('mobile-input');
        if (mobileInput && /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent)) {
            mobileInput.focus();
        }
        
        TypingEngine.currentTextBoxId = textBoxId;
    }
    
    // ============ EVENT LISTENERS ============
    static setupEventListeners() {
        const isMobile = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
        
        // Text box click handlers
        document.getElementById('text-box')?.addEventListener('click', (e) => {
            if (TypingEngine.state.paused) TypingEngine.resumePause();
            
            TypingEngine.currentTextBoxId = 'text-box';
            this.currentMode = 'practice';
            TypingEngine.currentMode = 'practice';
            
            if (isMobile) {
                e.preventDefault();
                const mobileInput = document.getElementById('mobile-input');
                if (mobileInput) {
                    mobileInput.focus();
                    mobileInput.click();
                }
            } else {
                document.getElementById('text-box').focus();
            }
        });
        
        document.getElementById('r-text-box')?.addEventListener('click', (e) => {
            if (TypingEngine.state.paused) TypingEngine.resumePause();
            
            TypingEngine.currentTextBoxId = 'r-text-box';
            this.currentMode = 'ranked';
            TypingEngine.currentMode = 'ranked';
            
            if (isMobile) {
                e.preventDefault();
                const mobileInput = document.getElementById('mobile-input');
                if (mobileInput) {
                    mobileInput.focus();
                    mobileInput.click();
                }
            } else {
                document.getElementById('r-text-box').focus();
            }
        });
        
        document.getElementById('mp-text-box')?.addEventListener('click', (e) => {
            TypingEngine.currentTextBoxId = 'mp-text-box';
            this.currentMode = 'multiplayer';
            TypingEngine.currentMode = 'multiplayer';
            
            if (isMobile) {
                e.preventDefault();
                const mobileInput = document.getElementById('mobile-input');
                if (mobileInput) {
                    mobileInput.focus();
                    mobileInput.click();
                }
            } else {
                document.getElementById('mp-text-box').focus();
            }
        });
        
        // Desktop keyboard handler
        document.addEventListener('keydown', (e) => {
            if (isMobile && document.activeElement?.id !== 'mobile-input') {
                return;
            }
            
            const activeElement = document.activeElement;
            if (activeElement && 
                (activeElement.tagName === 'INPUT' || 
                 activeElement.tagName === 'TEXTAREA' ||
                 activeElement.isContentEditable)) {
                if (activeElement.id !== 'mobile-input') {
                    return;
                }
            }
            
            const isCaps = e.getModifierState('CapsLock');
            const capsWarn = document.getElementById('caps-warn');
            const rCapsWarn = document.getElementById('r-caps-warn');
            if (capsWarn) capsWarn.style.display = isCaps ? 'block' : 'none';
            if (rCapsWarn) rCapsWarn.style.display = isCaps ? 'block' : 'none';
            
            if (e.key === 'Tab') {
                e.preventDefault();
                if (this.currentTab === 'practice' || this.currentTab === 'multiplayer') {
                    this.newTest();
                }
                return;
            }
            
            if (e.key === 'Escape') {
                if (this.currentMode !== 'ranked') {
                    if (TypingEngine.state.running && !TypingEngine.state.paused) {
                        TypingEngine.showPause();
                    } else if (TypingEngine.state.paused) {
                        TypingEngine.resumePause();
                    }
                }
                return;
            }
            
            if (!isMobile && !e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) {
                e.preventDefault();

                if (this.currentTab === 'multiplayer' && !Multiplayer.canAcceptTyping()) {
                    return;
                }
                
                if (TypingEngine.state.paused) {
                    TypingEngine.resumePause();
                    return;
                }
                
                if (!TypingEngine.state.started) {
                    TypingEngine.start();
                }
                
                if (!TypingEngine.state.running) return;
                
                TypingEngine.processChar(e.key);
                return;
            }
            
            if (!isMobile && e.key === 'Backspace') {
                e.preventDefault();
                if (this.currentTab === 'multiplayer' && !Multiplayer.canAcceptTyping()) {
                    return;
                }
                TypingEngine.backspace();
            }
        });
        
        document.addEventListener('click', (e) => {
            if (e.target.closest('input, textarea, button, select')) return;
            if (e.target.closest('.modal-backdrop, .overlay, .theme-switcher, .text-box')) return;
            
            if (this.currentTab === 'practice' || this.currentTab === 'multiplayer') {
                if (isMobile) {
                    const mobileInput = document.getElementById('mobile-input');
                    if (mobileInput) mobileInput.focus();
                }
            }
        });
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && TypingEngine.state.running && !TypingEngine.state.paused) {
                TypingEngine.showPause();
            }
        });
        
        document.addEventListener('dblclick', (e) => {
            if (e.target.closest('.text-box')) {
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.theme-switcher')) {
                document.getElementById('theme-panel')?.classList.remove('show');
            }
        });
    }
    
    // ============ NAVIGATION ============
    static goTab(tab, btn) {
        this.currentTab = tab;
        
        document.querySelectorAll('.tab-c').forEach(el => el.classList.remove('active'));
        const tabEl = document.getElementById('tab-' + tab);
        if (tabEl) tabEl.classList.add('active');
        
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        if (btn) {
            btn.classList.add('active');
        } else {
            document.querySelector(`.nav-btn[data-tab="${tab}"]`)?.classList.add('active');
        }
        
        if (tab === 'leaderboard') UI.renderLeaderboard();
        if (tab === 'profile') UI.renderProfile();
        if (tab === 'multiplayer') {
            TypingEngine.currentTextBoxId = 'mp-text-box';
            TypingEngine.currentMode = 'multiplayer';
            this.newTest();
            Multiplayer.updateRoomDisplay();
        }
        if (tab === 'practice') {
            TypingEngine.currentTextBoxId = 'text-box';
            TypingEngine.currentMode = 'practice';
            this.currentMode = 'practice';
            this.setMode('practice');
        }
        
        setTimeout(() => this.focusCurrentTextBox(), 200);
    }
    
    // ============ MODE SWITCHING ============
    static setMode(mode) {
        this.currentMode = mode;
        TypingEngine.currentMode = mode;
        
        const mPractice = document.getElementById('m-practice');
        const mRanked = document.getElementById('m-ranked');
        const modePractice = document.getElementById('mode-practice');
        const modeRanked = document.getElementById('mode-ranked');
        
        if (mPractice) mPractice.classList.toggle('active', mode === 'practice');
        if (mRanked) mRanked.classList.toggle('active', mode === 'ranked');
        if (modePractice) modePractice.style.display = mode === 'practice' ? 'block' : 'none';
        if (modeRanked) modeRanked.style.display = mode === 'ranked' ? 'block' : 'none';
        
        TypingEngine.state.paused = false;
        TypingEngine.hidePause();
        this.newTest();
    }
    
    // ============ SETTINGS ============
    static setDifficulty(diff, btn) {
        TypingEngine.state.diff = diff;
        document.querySelectorAll('#mode-practice .tb-group:first-child .tb-btn')
            .forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        this.newTest();
    }
    
    static setDuration(dur, btn) {
        TypingEngine.state.duration = dur;
        document.querySelectorAll('[id^="d"]').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        this.newTest();
    }

    static setLanguage(language) {
        const nextLanguage = isValidLanguage(language) ? language : 'en';
        this.currentLanguage = nextLanguage;
        TypingEngine.currentLanguage = nextLanguage;
        SupabaseService.saveLanguage(nextLanguage);
        UI.buildLanguageSelects?.();
        UI.syncLanguageSelects?.(nextLanguage);
        UI.applyLanguage?.();
        UI.updateAll?.();

        if (window.Multiplayer?.room) {
            Multiplayer.updateRoomDisplay?.();
            Multiplayer.refreshStartButton?.();
            const mpHint = document.getElementById('mp-hint');
            const mpStatus = document.getElementById('mp-status');
            if (Multiplayer.room.started) {
                if (mpHint) mpHint.textContent = t('match_live');
            } else {
                if (mpHint) mpHint.textContent = t('waiting_match');
                if (mpStatus && (Multiplayer.room.players || []).length <= 1) {
                    mpStatus.textContent = t('waiting_another_player');
                }
            }
        }

        if (this.currentTab === 'multiplayer' && Multiplayer.room?.started) {
            UI.showToast(t('language_next_race'), '*');
            return;
        }

        this.newTest();
    }
    
    static setTheme(theme) {
        if (theme === 'default') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        SupabaseService.saveTheme(theme);
        UI.renderStatsBar?.();
        UI.renderLeaderboard?.();
        UI.renderProfile?.();
    }
    
    // ============ TEST CONTROL ============
    static newTest() {
        clearInterval(TypingEngine.state.interval);
        clearInterval(TypingEngine.state.liveInt);
        
        let textBoxId;
        if (this.currentMode === 'ranked') {
            textBoxId = 'r-text-box';
        } else if (this.currentTab === 'multiplayer') {
            textBoxId = 'mp-text-box';
        } else {
            textBoxId = 'text-box';
        }
        
        TypingEngine.currentTextBoxId = textBoxId;
        TypingEngine.buildText(textBoxId);
        
        setTimeout(() => this.focusCurrentTextBox(), 150);
    }
    
    // ============ OVERLAY CONTROLS ============
    static closeResult() {
        document.getElementById('result-overlay').classList.remove('show');
    }
    
    static hidePause() {
        TypingEngine.hidePause();
    }
    
    static resumePause() {
        TypingEngine.resumePause();
        
        setTimeout(() => {
            const mobileInput = document.getElementById('mobile-input');
            if (mobileInput) mobileInput.focus();
        }, 100);
    }
}

// ============ START APP ============
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
