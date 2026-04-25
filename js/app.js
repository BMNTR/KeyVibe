// ============ KEYVIBE MAIN CONTROLLER ============

class App {
    static currentMode = 'practice';
    static currentTab = 'practice';
    
    // ============ INITIALIZATION ============
    static init() {
        Storage.init();
        Sound.init();
        UI.buildThemePanel();
        
        // Load saved theme
        const savedTheme = Storage.loadTheme();
        this.setTheme(savedTheme);
        
        // Create hidden input for mobile keyboard trigger
        this.createMobileInput();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // CHECK PERSISTENT LOGIN
        if (Auth.checkPersistentLogin()) {
            document.getElementById('login-modal').style.display = 'none';
            UI.updateAll();
            this.newTest();
            setTimeout(() => this.focusCurrentTextBox(), 500);
        } else {
            document.getElementById('login-modal').style.display = 'flex';
            UI.updateAll();
            this.newTest();
            setTimeout(() => this.focusCurrentTextBox(), 500);
        }
        
        console.log('🎹 KeyVibe Ready!');
        console.log('Type your vibe. Race your tribe.');
    }
    
    // Create hidden input for mobile keyboard
    static createMobileInput() {
        // Hapus dulu kalo udah ada
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
        
        // Style: kasih posisi fixed tapi tetep bisa di-focus
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
        
        // Handler pas ada input dari mobile
        hiddenInput.addEventListener('input', (e) => {
            const val = e.target.value;
            if (val.length === 0) return;
            
            // Ambil karakter terakhir
            const char = val[val.length - 1];
            
            // Clear input biar bisa nerima karakter berikutnya
            e.target.value = '';
            
            // Jangan proses kalo lagi pause
            if (TypingEngine.state.paused) {
                TypingEngine.resumePause();
                return;
            }
            
            // Start typing kalo belum mulai
            if (!TypingEngine.state.started) {
                TypingEngine.start();
            }
            
            if (!TypingEngine.state.running) return;
            
            // Proses karakter
            TypingEngine.processChar(char);
        });
        
        // Handle backspace di mobile
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
        
        // Focus hidden input for mobile keyboard
        const mobileInput = document.getElementById('mobile-input');
        if (mobileInput && /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent)) {
            mobileInput.focus();
        }
        
        // Update typing engine
        TypingEngine.currentTextBoxId = textBoxId;
    }
    
    // ============ EVENT LISTENERS ============
    static setupEventListeners() {
        // Detect mobile
        const isMobile = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
        
        // Text box CLICK handlers
        document.getElementById('text-box')?.addEventListener('click', (e) => {
            if (TypingEngine.state.paused) TypingEngine.resumePause();
            
            TypingEngine.currentTextBoxId = 'text-box';
            this.currentMode = 'practice';
            TypingEngine.currentMode = 'practice';
            
            // Di mobile, fokus ke hidden input
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
            if (Multiplayer.room && Multiplayer.room.started) return;
            
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
            // Di mobile, keyboard events di-handle sama hidden input
            if (isMobile && document.activeElement?.id !== 'mobile-input') {
                return;
            }
            
            // Skip if typing in form inputs
            const activeElement = document.activeElement;
            if (activeElement && 
                (activeElement.tagName === 'INPUT' || 
                 activeElement.tagName === 'TEXTAREA' ||
                 activeElement.isContentEditable)) {
                if (activeElement.id !== 'mobile-input') {
                    return;
                }
            }
            
            // Caps lock warning
            const isCaps = e.getModifierState('CapsLock');
            const capsWarn = document.getElementById('caps-warn');
            const rCapsWarn = document.getElementById('r-caps-warn');
            if (capsWarn) capsWarn.style.display = isCaps ? 'block' : 'none';
            if (rCapsWarn) rCapsWarn.style.display = isCaps ? 'block' : 'none';
            
            // Tab = restart test
            if (e.key === 'Tab') {
                e.preventDefault();
                if (this.currentTab === 'practice' || this.currentTab === 'multiplayer') {
                    this.newTest();
                }
                return;
            }
            
            // Escape = pause
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
            
            // Single character (desktop only)
            if (!isMobile && !e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) {
                e.preventDefault();
                
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
            
            // Backspace (desktop only)
            if (!isMobile && e.key === 'Backspace') {
                e.preventDefault();
                TypingEngine.backspace();
            }
        });
        
        // Auto-focus on click anywhere
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
        
        // Visibility change = pause
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && TypingEngine.state.running && !TypingEngine.state.paused) {
                TypingEngine.showPause();
            }
        });
        
        // Prevent zoom on double tap
        document.addEventListener('dblclick', (e) => {
            if (e.target.closest('.text-box')) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Close theme panel on outside click
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
            document.querySelectorAll('.nav-btn').forEach(b => {
                const text = b.textContent.trim().toLowerCase();
                if (text.includes(tab.slice(0, 4))) {
                    b.classList.add('active');
                }
            });
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
    
    static setTheme(theme) {
        if (theme === 'default') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        Storage.saveTheme(theme);
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