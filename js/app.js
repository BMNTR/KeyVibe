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
        
        // CHECK PERSISTENT LOGIN
        if (Auth.checkPersistentLogin()) {
            // User already logged in
            document.getElementById('login-modal').style.display = 'none';
            UI.updateAll();
            this.newTest();
            setTimeout(() => {
                const box = document.getElementById('text-box');
                if (box) box.focus();
            }, 500);
        } else {
            // Show login modal
            document.getElementById('login-modal').style.display = 'flex';
            UI.updateAll();
            this.newTest();
            setTimeout(() => {
                const box = document.getElementById('text-box');
                if (box) box.focus();
            }, 500);
        }
        
        // Set up event listeners
        this.setupEventListeners();
        
        console.log('🎹 KeyVibe Ready!');
        console.log('Type your vibe. Race your tribe.');
    }
    
    // ============ EVENT LISTENERS ============
    static setupEventListeners() {
        // Keyboard handler
        document.addEventListener('keydown', (e) => {
            // Skip if typing in an input field (login, room code, etc)
            const activeElement = document.activeElement;
            
            if (activeElement && 
                (activeElement.tagName === 'INPUT' || 
                 activeElement.tagName === 'TEXTAREA' ||
                 activeElement.isContentEditable)) {
                return;
            }
            
            // Caps lock warning
            const isCaps = e.getModifierState('CapsLock');
            const capsWarn = document.getElementById('caps-warn');
            const rCapsWarn = document.getElementById('r-caps-warn');
            if (capsWarn) capsWarn.style.display = isCaps ? 'block' : 'none';
            if (rCapsWarn) rCapsWarn.style.display = isCaps ? 'block' : 'none';
            
            // Determine which text box
            let textBoxId = null;
            
            if (activeElement && activeElement.classList.contains('text-box')) {
                textBoxId = activeElement.id;
            } else if (this.currentTab === 'practice') {
                textBoxId = this.currentMode === 'ranked' ? 'r-text-box' : 'text-box';
                const box = document.getElementById(textBoxId);
                if (box) box.focus();
            } else if (this.currentTab === 'multiplayer') {
                textBoxId = 'mp-text-box';
                const box = document.getElementById(textBoxId);
                if (box) box.focus();
            } else {
                return;
            }
            
            if (!textBoxId) return;
            
            TypingEngine.currentTextBoxId = textBoxId;
            
            // Set mode
            if (textBoxId === 'r-text-box') {
                this.currentMode = 'ranked';
                TypingEngine.currentMode = 'ranked';
            } else if (textBoxId === 'mp-text-box') {
                this.currentMode = 'multiplayer';
                TypingEngine.currentMode = 'multiplayer';
            } else {
                this.currentMode = 'practice';
                TypingEngine.currentMode = 'practice';
            }
            
            // Tab = restart test
            if (e.key === 'Tab') {
                e.preventDefault();
                if (this.currentTab === 'practice' || this.currentTab === 'multiplayer') {
                    this.newTest();
                }
                return;
            }
            
            // Escape = pause (not in ranked)
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
            
            // Single character input
            if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) {
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
            
            // Backspace
            if (e.key === 'Backspace') {
                e.preventDefault();
                TypingEngine.backspace();
            }
        });
        
        // Text box click handlers
        document.getElementById('text-box')?.addEventListener('click', function(e) {
            if (TypingEngine.state.paused) TypingEngine.resumePause();
            this.focus();
        });
        
        document.getElementById('r-text-box')?.addEventListener('click', function(e) {
            if (TypingEngine.state.paused) TypingEngine.resumePause();
            this.focus();
        });
        
        document.getElementById('mp-text-box')?.addEventListener('click', function(e) {
            if (Multiplayer.room && Multiplayer.room.started) return;
            this.focus();
        });
        
        // Auto-focus text box on click anywhere
        document.addEventListener('click', function(e) {
            if (e.target.closest('input')) return;
            if (e.target.closest('textarea')) return;
            if (e.target.closest('button')) return;
            if (e.target.closest('select')) return;
            if (e.target.closest('.modal-backdrop')) return;
            if (e.target.closest('.overlay')) return;
            if (e.target.closest('.theme-switcher')) return;
            if (e.target.closest('.text-box')) return;
            
            if (App.currentTab === 'practice') {
                const boxId = App.currentMode === 'ranked' ? 'r-text-box' : 'text-box';
                const box = document.getElementById(boxId);
                if (box && document.activeElement !== box) {
                    box.focus();
                }
            } else if (App.currentTab === 'multiplayer') {
                const box = document.getElementById('mp-text-box');
                if (box && document.activeElement !== box) {
                    box.focus();
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
        
        // Hide all tabs
        document.querySelectorAll('.tab-c').forEach(el => el.classList.remove('active'));
        const tabEl = document.getElementById('tab-' + tab);
        if (tabEl) tabEl.classList.add('active');
        
        // Update nav buttons
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
        
        // Tab-specific actions
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
        
        // Focus text box
        setTimeout(() => {
            if (tab === 'practice') {
                document.getElementById('text-box')?.focus();
            } else if (tab === 'multiplayer') {
                document.getElementById('mp-text-box')?.focus();
            }
        }, 200);
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
        
        // Auto focus
        setTimeout(() => {
            const box = document.getElementById(textBoxId);
            if (box) box.focus();
        }, 150);
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
    }
}

// ============ START APP ============
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});