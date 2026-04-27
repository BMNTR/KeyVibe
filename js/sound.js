// ============ KEYVIBE SOUND SYSTEM ============

class Sound {
    static muted = false;
    static audioCtx = null;
    
    // Initialize
    static init() {
        // Safe initialization - use try/catch to handle SupabaseService not available yet
        try {
            if (typeof SupabaseService !== 'undefined' && SupabaseService.loadMuted) {
                this.muted = SupabaseService.loadMuted();
            } else {
                // Fallback to localStorage if SupabaseService not ready
                this.muted = localStorage.getItem('keyvibe_muted') === '1';
            }
        } catch (e) {
            console.warn('Sound.init() - SupabaseService not ready, using fallback');
            this.muted = localStorage.getItem('keyvibe_muted') === '1';
        }
        this.updateMuteButton();
    }
    
    // Lazy init audio context (requires user interaction)
    static getContext() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.audioCtx;
    }
    
    // Resume audio context (for iOS/Safari)
    static resumeContext() {
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }
    
    // Play a tone
    static play(freq, duration, type = 'sine', volume = 0.1) {
        if (this.muted) return;
        
        try {
            this.resumeContext();
            const ctx = this.getContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            
            gain.gain.setValueAtTime(volume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            // Silently fail - audio is not critical
        }
    }
    
    // Sound effects
    static keyPress() { 
        this.play(800, 0.04, 'sine', 0.05); 
    }
    
    static error() { 
        this.play(150, 0.12, 'square', 0.06); 
    }
    
    static combo(level) {
        if (level >= 40) {
            this.play(1200, 0.08, 'sine', 0.1);
            setTimeout(() => this.play(1600, 0.12, 'sine', 0.1), 80);
        } else if (level >= 20) {
            this.play(900, 0.06, 'sine', 0.08);
        } else {
            this.play(600, 0.05, 'sine', 0.06);
        }
    }
    
    static milestone() {
        this.play(523, 0.08, 'sine', 0.08);
        setTimeout(() => this.play(659, 0.08, 'sine', 0.08), 80);
        setTimeout(() => this.play(784, 0.12, 'sine', 0.1), 160);
    }
    
    static raceStart() {
        this.play(400, 0.08, 'square', 0.06);
        setTimeout(() => this.play(600, 0.08, 'square', 0.06), 120);
        setTimeout(() => this.play(800, 0.12, 'square', 0.08), 240);
    }
    
    static achievement() {
        this.play(660, 0.1, 'sine', 0.08);
        setTimeout(() => this.play(880, 0.1, 'sine', 0.08), 100);
        setTimeout(() => this.play(1100, 0.15, 'sine', 0.1), 200);
    }
    
    static countdown() {
        this.play(440, 0.1, 'sine', 0.07);
    }
    
    static gameOver() {
        this.play(330, 0.15, 'triangle', 0.08);
        setTimeout(() => this.play(220, 0.2, 'triangle', 0.08), 150);
        setTimeout(() => this.play(110, 0.3, 'triangle', 0.08), 300);
    }
    
    // Toggle mute
    static toggle() {
        this.muted = !this.muted;
        SupabaseService.saveMuted(this.muted);
        this.updateMuteButton();
        UI.showToast(this.muted ? 'Sound muted 🔇' : 'Sound on 🔊');
    }
    
    // Update mute button UI
    static updateMuteButton() {
        const btn = document.getElementById('mute-btn');
        if (!btn) return;
        
        if (this.muted) {
            btn.textContent = '🔇';
            btn.classList.add('muted');
        } else {
            btn.textContent = '🔊';
            btn.classList.remove('muted');
        }
    }
}