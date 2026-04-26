// ============ KEYVIBE TYPING ENGINE ============

class TypingEngine {
    // State
    static state = {
        diff: 'easy',
        duration: 30,
        timer: 30,
        running: false,
        started: false,
        paused: false,
        wordIdx: 0,
        charIdx: 0,
        errorCount: 0,
        correctCount: 0,
        startTime: null,
        interval: null,
        liveInt: null,
        combo: 0,
        maxCombo: 0,
        lastCorrect: true
    };
    
    static wordSpans = [];
    static currentTextBoxId = 'text-box';
    static idleTimeout = null;
    static lastResult = { wpm: 0, acc: 0, combo: 0 };
    static currentMode = 'practice';
    
    // Generate word pool
    static getWordPool() {
        const textBoxId = this.currentTextBoxId;
        
        let pool;
        if (this.currentMode === 'ranked') pool = WORDS.medium;
        else if (textBoxId === 'mp-text-box') pool = WORDS.medium;
        else pool = WORDS[this.state.diff];
        
        const out = [];
        while (out.length < 100) {
            out.push(pool[Math.floor(Math.random() * pool.length)]);
        }
        return out;
    }
    
    // Build text in a container
    static buildText(textBoxId) {
        this.currentTextBoxId = textBoxId;
        
        const dur = this.currentMode === 'ranked' ? 60 : 
                    (textBoxId === 'mp-text-box' ? 60 : this.state.duration);
        
        // Reset state
        this.state.timer = dur;
        this.state.wordIdx = 0;
        this.state.charIdx = 0;
        this.state.correctCount = 0;
        this.state.errorCount = 0;
        this.state.running = false;
        this.state.started = false;
        this.state.combo = 0;
        this.state.maxCombo = 0;
        this.state.lastCorrect = true;
        
        // Get container
        const wrapId = textBoxId === 'r-text-box' ? 'r-words-wrap' : 
                       (textBoxId === 'mp-text-box' ? 'mp-words-wrap' : 'words-wrap');
        const container = document.getElementById(wrapId);
        
        if (!container) {
            console.error('Container not found:', wrapId);
            return;
        }
        
        container.innerHTML = '';
        container.scrollTop = 0;
        
        // Build word spans
        this.wordSpans = [];
        const words = this.getWordPool();
        
        for (let wi = 0; wi < words.length; wi++) {
            const wg = document.createElement('span');
            wg.className = 'word-group';
            
            const chars = [...words[wi]];
            const cSpans = [];
            
            for (let ci = 0; ci < chars.length; ci++) {
                const s = document.createElement('span');
                s.className = 'char untyped';
                s.textContent = chars[ci];
                wg.appendChild(s);
                cSpans.push(s);
            }
            
            // Space after word
            const sp = document.createElement('span');
            sp.className = 'char untyped sp';
            sp.innerHTML = '&nbsp;';
            wg.appendChild(sp);
            cSpans.push(sp);
            
            this.wordSpans.push({ group: wg, chars: cSpans, spaceSpan: sp });
            container.appendChild(wg);
        }
        
        // Highlight first word with cursor
        if (this.wordSpans.length > 0) {
            this.wordSpans[0].group.classList.add('current-word');
            this.wordSpans[0].chars[0].classList.add('cursor');
        }
        
        // Update UI elements
        this.updateTimerDisplay(textBoxId, dur);
        this.updateProgressBar(textBoxId, 0);
        this.updateHint(textBoxId);
        this.updateComboDisplay(textBoxId);
        this.updateLiveStats(textBoxId, '—', '—');
    }
    
    // Start typing
    static start() {
        if (this.state.started) return;
        
        this.state.started = true;
        this.state.running = true;
        this.state.startTime = Date.now();
        
        const dur = this.currentMode === 'ranked' ? 60 : 
                    (this.currentTextBoxId === 'mp-text-box' ? 60 : this.state.duration);
        
        const hintId = this.getHintId();
        const hintEl = document.getElementById(hintId);
        if (hintEl) hintEl.textContent = 'Tab to restart';
        
        Sound.raceStart();
        
        // Timer interval
        this.state.interval = setInterval(() => {
            if (this.state.paused) return;
            
            this.state.timer--;
            if (this.state.timer < 0) this.state.timer = 0;
            
            const progress = ((1 - this.state.timer / dur) * 100);
            this.updateProgressBar(this.currentTextBoxId, progress);
            this.updateTimerDisplay(this.currentTextBoxId, this.state.timer);
            
            if (this.state.timer <= 10) {
                const pillId = this.getTimerPillId();
                const pill = document.getElementById(pillId);
                if (pill) pill.style.color = 'var(--danger)';
            }
            
            if (this.state.timer <= 0) {
                this.end();
            }
        }, 1000);
        
        // Live stats interval
        this.state.liveInt = setInterval(() => {
            if (this.state.paused || !this.state.started) return;
            
            const elapsed = (Date.now() - this.state.startTime) / 60000;
            const wpm = elapsed > 0.001 ? Math.round(this.state.correctCount / 5 / elapsed) : 0;
            const total = this.state.correctCount + this.state.errorCount;
            const acc = total > 0 ? Math.round(this.state.correctCount / total * 100) : 100;
            
            this.updateLiveStats(this.currentTextBoxId, wpm, acc + '%');
        }, 300);
    }
    
    // Process a typed character
    static processChar(typed) {
        if (this.state.wordIdx >= this.wordSpans.length) return;
        
        const ws = this.wordSpans[this.state.wordIdx];
        if (!ws) return;
        
        const el = ws.chars[this.state.charIdx];
        if (!el) return;
        
        const isSpace = el.classList.contains('sp');
        const expected = isSpace ? ' ' : el.textContent;
        
        // Remove cursor from ALL characters
        for (let w of this.wordSpans) {
            for (let s of w.chars) {
                s.classList.remove('cursor');
            }
        }
        
        if (typed === expected) {
            // CORRECT!
            el.classList.remove('untyped', 'wrong');
            el.classList.add('correct');
            this.state.correctCount++;
            this.state.charIdx++;
            
            // COMBO SYSTEM
            if (this.state.lastCorrect || this.state.combo === 0) {
                this.state.combo++;
                if (this.state.combo > this.state.maxCombo) {
                    this.state.maxCombo = this.state.combo;
                }
                this.updateComboDisplay(this.currentTextBoxId);
                
                // Combo milestones
                if (this.state.combo === 10) this.showComboPopup('10 COMBO! 🔥');
                else if (this.state.combo === 20) this.showComboPopup('20 STREAK! ⚡');
                else if (this.state.combo === 30) this.showComboPopup('30 ON FIRE! 💥');
                else if (this.state.combo === 50) this.showComboPopup('50 GODLIKE! 👑');
                
                if (this.state.combo % 10 === 0) Sound.combo(this.state.combo);
            }
            this.state.lastCorrect = true;
            Sound.keyPress();
            
            // Move to next word if space
            if (isSpace) {
                ws.group.classList.remove('current-word');
                this.state.wordIdx++;
                this.state.charIdx = 0;
                
                if (this.state.wordIdx >= this.wordSpans.length) {
                    this.end();
                    return;
                }
                
                this.wordSpans[this.state.wordIdx].group.classList.add('current-word');
                this.scrollToCurrent();
            }
        } else {
            // WRONG!
            el.classList.remove('untyped', 'correct');
            el.classList.add('wrong');
            this.state.errorCount++;
            this.state.charIdx++;
            this.state.combo = 0;
            this.state.lastCorrect = false;
            this.updateComboDisplay(this.currentTextBoxId);
            Sound.error();
            
            if (isSpace) {
                ws.group.classList.remove('current-word');
                this.state.wordIdx++;
                this.state.charIdx = 0;
                
                if (this.state.wordIdx >= this.wordSpans.length) {
                    this.end();
                    return;
                }
                
                this.wordSpans[this.state.wordIdx].group.classList.add('current-word');
                this.scrollToCurrent();
            }
        }
        
        // Set cursor on next char
        if (this.state.wordIdx < this.wordSpans.length) {
            const nextSpan = this.wordSpans[this.state.wordIdx].chars[this.state.charIdx];
            if (nextSpan) {
                nextSpan.classList.add('cursor');
                this.ensureCursorVisible(nextSpan);
            } else {
                this.end();
            }
        }
        
        this.resetIdleTimer();
    }
    
    // Handle backspace
    static backspace() {
        if (this.state.wordIdx >= this.wordSpans.length) return;
        
        if (this.state.charIdx > 0) {
            this.state.charIdx--;
            const el = this.wordSpans[this.state.wordIdx].chars[this.state.charIdx];
            el.classList.remove('correct', 'wrong', 'cursor');
            el.classList.add('untyped');
            
            // Remove cursor from next char
            if (this.state.charIdx + 1 < this.wordSpans[this.state.wordIdx].chars.length) {
                this.wordSpans[this.state.wordIdx].chars[this.state.charIdx + 1].classList.remove('cursor');
            }
            
            el.classList.add('cursor');
            
            // Adjust counts
            if (this.state.correctCount > 0) this.state.correctCount--;
            if (this.state.errorCount > 0) this.state.errorCount--;
            
            this.state.combo = 0;
            this.state.lastCorrect = false;
            this.updateComboDisplay(this.currentTextBoxId);
        }
    }
    
    // End the test
    static end() {
        clearInterval(this.state.interval);
        clearInterval(this.state.liveInt);
        this.state.running = false;
        
        App.hidePause();
        
        const elapsed = (Date.now() - this.state.startTime) / 60000 || (this.state.duration / 60);
        const wpm = Math.round(this.state.correctCount / 5 / Math.max(elapsed, 0.001));
        const total = this.state.correctCount + this.state.errorCount;
        const acc = total > 0 ? Math.round(this.state.correctCount / total * 100) : 100;
        const prevBest = Auth.getUserData().bestWpm || 0;
        
        // Update user data
        const userData = Auth.getUserData();
        if (wpm > userData.bestWpm) {
            userData.bestWpm = wpm;
            Sound.milestone();
        }
        
        userData.totalTests = (userData.totalTests || 0) + 1;
        
        const comboBonus = Math.floor(this.state.maxCombo / 10) * 5;
        const xpGained = Math.round(wpm * 0.6 + acc * 0.4) + comboBonus;
        userData.xp = (userData.xp || 0) + xpGained;
        
        if (this.state.maxCombo > (userData.maxCombo || 0)) {
            userData.maxCombo = this.state.maxCombo;
        }
        
        // Save to history
        userData.history = userData.history || [];
        userData.history.unshift({
            wpm, acc,
            errors: this.state.errorCount,
            maxCombo: this.state.maxCombo,
            time: new Date().toLocaleTimeString(),
            mode: this.currentMode
        });
        if (userData.history.length > 20) userData.history.pop();
        
        // Ranked mode - push to Firebase Leaderboard
        if (this.currentMode === 'ranked' && Auth.currentUser) {
            userData.rankedHistory = userData.rankedHistory || [];
            userData.rankedHistory.unshift({
                wpm, acc,
                maxCombo: this.state.maxCombo,
                time: new Date().toLocaleTimeString()
            });
            // Update Firebase Leaderboard
            FirebaseService.updateLeaderboard(Auth.userData.username, wpm, acc);
        }
        
        // Save to Firebase
        Auth.saveUserData();
        
        // Store and show result
        this.lastResult = { wpm, acc, combo: this.state.maxCombo };
        UI.updateAll();
        this.showResult(wpm, acc, this.state.errorCount, this.state.correctCount, prevBest, xpGained);
    }
    
    // Show result overlay
    static showResult(wpm, acc, errors, correct, prevBest, xpGained) {
        document.getElementById('res-wpm').textContent = wpm;
        document.getElementById('r-acc').textContent = acc + '%';
        document.getElementById('r-chars').textContent = correct;
        document.getElementById('r-err').textContent = errors;
        
        document.getElementById('res-emoji').textContent = 
            wpm >= 150 ? '🚀' : wpm >= 100 ? '⚡' : wpm >= 70 ? '🎉' : wpm >= 50 ? '💪' : '🌱';
        
        const comboStr = this.state.maxCombo >= 50 ? ' | Max Combo: 👑' + this.state.maxCombo :
                         this.state.maxCombo >= 20 ? ' | Combo: 🔥' + this.state.maxCombo : '';
        
        document.getElementById('r-msg').textContent = 
            wpm > prevBest && prevBest > 0 ?
            `🎊 New personal best! +${xpGained} XP${comboStr}` :
            `+${xpGained} XP earned${comboStr} — keep going!`;
        
        document.getElementById('r-combo-info').textContent = 
            this.state.maxCombo >= 10 ?
            `Best combo streak: ${this.state.maxCombo} | Combo bonus: +${Math.floor(this.state.maxCombo / 10) * 5} XP` : '';
        
        document.getElementById('result-overlay').classList.add('show');
    }
    
    // Combo popup animation
    static showComboPopup(text) {
        const popup = document.createElement('div');
        popup.className = 'combo-popup';
        popup.textContent = text;
        popup.style.color = this.state.combo >= 50 ? '#ffd700' : 
                           this.state.combo >= 30 ? 'var(--danger)' : 'var(--warning)';
        document.body.appendChild(popup);
        setTimeout(() => {
            if (popup.parentNode) popup.remove();
        }, 1300);
    }
    
    // Pause/resume
    static showPause() {
        if (!this.state.running || this.state.paused) return;
        this.state.paused = true;
        document.getElementById('pause-overlay').classList.add('show');
    }
    
    static hidePause() {
        this.state.paused = false;
        document.getElementById('pause-overlay').classList.remove('show');
    }
    
    static resumePause() {
        if (!this.state.running) return;
        this.hidePause();
        document.getElementById(this.currentTextBoxId)?.focus();
        this.resetIdleTimer();
    }
    
    static resetIdleTimer() {
        clearTimeout(this.idleTimeout);
        if (this.state.running && !this.state.paused) {
            this.idleTimeout = setTimeout(() => this.showPause(), 8000);
        }
    }
    
    // Scroll helpers
    static scrollToCurrent() {
        const wrapId = this.currentTextBoxId === 'r-text-box' ? 'r-words-wrap' : 
                       (this.currentTextBoxId === 'mp-text-box' ? 'mp-words-wrap' : 'words-wrap');
        const container = document.getElementById(wrapId);
        const ws = this.wordSpans[this.state.wordIdx];
        if (!ws || !ws.chars[0]) return;
        
        const ct = container.getBoundingClientRect().top;
        const et = ws.chars[0].getBoundingClientRect().top;
        const lh = parseFloat(getComputedStyle(container).lineHeight) || 40;
        
        if (et - ct > lh * 1.3) {
            container.scrollTop += et - ct - lh;
        }
    }
    
    static ensureCursorVisible(charEl) {
        const container = charEl.closest('.words-wrap');
        if (!container) return;
        
        const cr = container.getBoundingClientRect();
        const er = charEl.getBoundingClientRect();
        const lh = parseFloat(getComputedStyle(container).lineHeight) || 40;
        
        if (er.bottom > cr.bottom - lh * 0.5) {
            container.scrollTop += er.bottom - cr.bottom + lh;
        }
        if (er.top < cr.top + lh * 0.3) {
            container.scrollTop += er.top - cr.top - lh;
        }
    }
    
    // Helper methods
    static getHintId() {
        return this.currentTextBoxId === 'r-text-box' ? 'r-hint' :
               this.currentTextBoxId === 'mp-text-box' ? 'mp-hint' : 'hint';
    }
    
    static getTimerPillId() {
        return this.currentTextBoxId === 'r-text-box' ? 'ranked-timer-pill' :
               this.currentTextBoxId === 'mp-text-box' ? 'timer-pill' : 'timer-pill';
    }
    
    static updateTimerDisplay(textBoxId, value) {
        const pillId = textBoxId === 'r-text-box' ? 'ranked-timer-pill' :
                       textBoxId === 'mp-text-box' ? 'timer-pill' : 'timer-pill';
        const pill = document.getElementById(pillId);
        if (pill) {
            pill.textContent = typeof value === 'number' ? value + 's' : value;
        }
    }
    
    static updateProgressBar(textBoxId, percent) {
        const progId = textBoxId === 'r-text-box' ? 'r-prog' :
                       textBoxId === 'mp-text-box' ? 'prog' : 'prog';
        const prog = document.getElementById(progId);
        if (prog) prog.style.width = percent + '%';
    }
    
    static updateHint(textBoxId) {
        const hintId = textBoxId === 'r-text-box' ? 'r-hint' :
                       textBoxId === 'mp-text-box' ? 'mp-hint' : 'hint';
        const hint = document.getElementById(hintId);
        if (hint) {
            hint.textContent = textBoxId === 'mp-text-box' ? 
                'Race started! Type as fast as you can!' : 
                'Click or tap the text box to start typing';
        }
    }
    
    static updateComboDisplay(textBoxId) {
        const comboId = textBoxId === 'r-text-box' ? 'r-combo-counter' :
                        textBoxId === 'mp-text-box' ? 'mp-combo-counter' : 'combo-counter';
        const cc = document.getElementById(comboId);
        if (!cc) return;
        
        if (this.state.combo >= 10) {
            cc.classList.add('active');
            cc.textContent = '🔥 x' + this.state.combo;
            if (this.state.combo >= 30) {
                cc.classList.add('fire');
                cc.classList.remove('godlike');
            }
            if (this.state.combo >= 50) {
                cc.classList.add('godlike');
                cc.textContent = '👑 x' + this.state.combo;
            }
        } else if (this.state.combo > 0) {
            cc.classList.add('active');
            cc.classList.remove('fire', 'godlike');
            cc.textContent = '🔥 x' + this.state.combo;
        } else {
            cc.classList.remove('active', 'fire', 'godlike');
            cc.textContent = '🔥 x0';
        }
    }
    
    static updateLiveStats(textBoxId, wpm, acc) {
        const wpmId = textBoxId === 'r-text-box' ? 'r-live-wpm' :
                      textBoxId === 'mp-text-box' ? 'mp-live-wpm' : 'live-wpm';
        const accId = textBoxId === 'r-text-box' ? 'r-live-acc' :
                      textBoxId === 'mp-text-box' ? 'mp-live-acc' : 'live-acc';
        
        const wpmEl = document.getElementById(wpmId);
        const accEl = document.getElementById(accId);
        if (wpmEl) wpmEl.textContent = wpm;
        if (accEl) accEl.textContent = acc;
    }
}