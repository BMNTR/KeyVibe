// ============ KEYVIBE MULTIPLAYER SYSTEM ============

class Multiplayer {
    static room = null;
    static simInterval = null;
    
    // Create a room
    static createRoom() {
        // Generate random 5-char code
        let code = '';
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        for (let i = 0; i < 5; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        
        this.room = {
            code: code,
            players: [{
                name: Auth.currentUser ? Auth.currentUser.data.username : 'Guest',
                wpm: 0,
                progress: 0,
                finished: false,
                typing: false,
                isYou: true
            }],
            started: false,
            raceStartTime: null
        };
        
        // Add 2-3 bots with varying skill levels
        const numBots = Math.floor(Math.random() * 2) + 2; // 2-3 bots
        const shuffled = [...BOT_NAMES].sort(() => Math.random() - 0.5);
        for (let i = 0; i < numBots && i < shuffled.length; i++) {
            this.room.players.push({
                name: shuffled[i],
                wpm: 0,
                progress: 0,
                finished: false,
                typing: false,
                isBot: true,
                targetWpm: Math.floor(Math.random() * 40) + 70, // 70-110 WPM
                consistency: Math.random() * 0.3 + 0.7 // 0.7-1.0
            });
        }
        
        // Update UI
        document.getElementById('mp-lobby').style.display = 'block';
        document.getElementById('mp-race-area').classList.remove('active');
        document.getElementById('mp-room-info').classList.add('active');
        document.getElementById('mp-code-display').textContent = code;
        document.getElementById('mp-start-btn').disabled = false;
        document.getElementById('mp-status').textContent = `${this.room.players.length} players ready!`;
        
        this.updateRoomDisplay();
        UI.showToast('Room created! Share code: ' + code, '🏠');
    }
    
    // Join a room
    static joinRoom() {
        const code = document.getElementById('mp-room-code').value.trim().toUpperCase();
        
        if (!code || code.length < 3) {
            UI.showToast('Enter a valid room code', '❌');
            return;
        }
        
        this.room = {
            code: code,
            players: [{
                name: Auth.currentUser ? Auth.currentUser.data.username : 'Guest',
                wpm: 0,
                progress: 0,
                finished: false,
                typing: false,
                isYou: true
            }],
            started: false,
            raceStartTime: null
        };
        
        // Simulate other players in the room
        const numBots = Math.floor(Math.random() * 3) + 2; // 2-4 bots
        const shuffled = [...BOT_NAMES].sort(() => Math.random() - 0.5);
        for (let i = 0; i < numBots && i < shuffled.length; i++) {
            this.room.players.push({
                name: shuffled[i],
                wpm: 0,
                progress: 0,
                finished: false,
                typing: false,
                isBot: true,
                targetWpm: Math.floor(Math.random() * 40) + 70,
                consistency: Math.random() * 0.3 + 0.7
            });
        }
        
        document.getElementById('mp-lobby').style.display = 'block';
        document.getElementById('mp-race-area').classList.remove('active');
        document.getElementById('mp-room-info').classList.add('active');
        document.getElementById('mp-code-display').textContent = code;
        document.getElementById('mp-start-btn').disabled = true; // Can't start in joined room
        document.getElementById('mp-status').textContent = `${this.room.players.length} players in room`;
        
        this.updateRoomDisplay();
        UI.showToast('Joined room: ' + code, '✅');
    }
    
    // Start the race
    static startRace() {
        if (!this.room || this.room.players.length < 2) {
            UI.showToast('Need at least 2 players to start', '❌');
            return;
        }
        
        this.room.started = true;
        this.room.raceStartTime = Date.now();
        
        // Reset all players
        this.room.players.forEach(p => {
            p.wpm = 0;
            p.progress = 0;
            p.finished = false;
            p.typing = false;
        });
        
        // Switch to race view
        document.getElementById('mp-lobby').style.display = 'none';
        document.getElementById('mp-race-area').classList.add('active');
        
        // Set up typing for the player
        TypingEngine.currentTextBoxId = 'mp-text-box';
        App.currentMode = 'multiplayer';
        TypingEngine.currentMode = 'multiplayer';
        App.newTest();
        
        setTimeout(() => {
            document.getElementById('mp-text-box').focus();
        }, 150);
        
        // Start simulating bots
        this.simInterval = setInterval(() => this.simulateBots(), 500);
        
        Sound.raceStart();
        UI.showToast('Race started! GO! 🏁', '🏁');
    }
    
    // Simulate bot progress
    static simulateBots() {
        if (!this.room || !this.room.started) return;
        
        const elapsed = (Date.now() - this.room.raceStartTime) / 60000;
        
        this.room.players.forEach(p => {
            if (p.isYou) {
                // Update real player progress
                const st = TypingEngine.state;
                p.wpm = st.started && st.running ? 
                    Math.round(st.correctCount / 5 / Math.max(elapsed, 0.01)) : 0;
                p.progress = Math.min(100, Math.round((st.correctCount / (5 * 200)) * 100));
                p.finished = p.progress >= 100;
                p.typing = st.started && st.running;
            } else if (p.isBot && !p.finished) {
                // Simulate bot typing
                const variance = (Math.random() - 0.5) * 20;
                p.wpm = Math.round(Math.max(30, p.targetWpm * p.consistency + variance));
                p.progress += Math.random() * 8 + 2; // Progress per 500ms tick
                if (p.progress >= 100) {
                    p.progress = 100;
                    p.finished = true;
                }
                p.typing = !p.finished && Math.random() > 0.1;
            }
        });
        
        this.updatePlayerProgress();
        
        // Check if race is over
        const allFinished = this.room.players.every(p => p.finished);
        if (allFinished || elapsed >= 1) {
            clearInterval(this.simInterval);
            this.endRace();
        }
    }
    
    // Update room player list
    static updateRoomDisplay() {
        if (!this.room) return;
        
        const container = document.getElementById('mp-players');
        container.innerHTML = this.room.players.map(p => `
            <div class="mp-player-chip ${p.isYou ? 'leader' : ''}">
                <span class="mp-dot" style="background:${p.isYou ? 'var(--accent)' : 'var(--muted)'}"></span>
                ${p.name}${p.isYou ? ' (You)' : ''}${p.isBot ? ' 🤖' : ''}
            </div>
        `).join('');
    }
    
    // Update player progress bars during race
    static updatePlayerProgress() {
        if (!this.room) return;
        
        const container = document.getElementById('mp-player-progress');
        const sorted = [...this.room.players].sort((a, b) => b.progress - a.progress);
        
        container.innerHTML = sorted.map(p => `
            <div class="mp-player-row">
                <span style="width:100px;font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                    ${p.name}${p.isYou ? ' (You)' : ''}${p.finished ? ' ✅' : ''}
                </span>
                <div class="mp-progress-bar" style="flex:1">
                    <div class="mp-progress-fill" style="
                        width:${p.progress}%;
                        background:${p.finished ? 'var(--success)' : p.isYou ? 'var(--accent)' : 'var(--accent2)'}
                    "></div>
                </div>
                <span style="font-size:9px;width:45px;text-align:right;font-family:'JetBrains Mono',monospace">
                    ${p.wpm}wpm
                </span>
            </div>
        `).join('');
    }
    
    // End the race
    static endRace() {
        clearInterval(this.simInterval);
        
        const sorted = [...this.room.players].sort((a, b) => b.progress - a.progress);
        const yourRank = sorted.findIndex(p => p.isYou) + 1;
        const medals = ['🥇', '🥈', '🥉', '4th', '5th', '6th'];
        
        UI.showToast(`Race finished! You placed ${medals[yourRank - 1] || '#' + yourRank}`, '🏁');
        
        // End typing if still running
        if (TypingEngine.state.running) {
            TypingEngine.end();
        }
        
        // Show results in lobby
        document.getElementById('mp-lobby').style.display = 'block';
        document.getElementById('mp-race-area').classList.remove('active');
        
        const container = document.getElementById('mp-players');
        container.innerHTML = sorted.map((p, i) => `
            <div class="mp-player-chip ${p.isYou ? 'leader' : ''} ${p.finished ? 'finished' : ''}">
                <span>${i < 3 ? medals[i] : ''}</span>
                <span class="mp-dot" style="background:${p.finished ? 'var(--success)' : 'var(--muted)'}"></span>
                ${p.name}${p.isYou ? ' (You)' : ''} - ${p.wpm} wpm
            </div>
        `).join('');
        
        document.getElementById('mp-status').textContent = 'Race complete!';
    }
}