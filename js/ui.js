// ============ KEYVIBE UI RENDERER ============

class UI {
    // Show toast notification
    static showToast(message, icon = '📢') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>${icon}</span> ${message}`;
        container.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 3000);
    }
    
    // Toggle theme panel
    static toggleThemePanel() {
        document.getElementById('theme-panel').classList.toggle('show');
    }
    
    // Build theme panel dynamically
    static buildThemePanel() {
        const panel = document.getElementById('theme-panel');
        panel.innerHTML = '';
        
        for (const [key, theme] of Object.entries(THEMES)) {
            const btn = document.createElement('button');
            btn.className = 'theme-option';
            btn.innerHTML = `
                <span class="dot" style="background:${theme.color}"></span>
                ${theme.name}
            `;
            btn.onclick = () => App.setTheme(key);
            panel.appendChild(btn);
        }
    }
    
    // Update all UI components
    static updateAll() {
        this.renderStatsBar();
        this.renderHistory();
        this.renderRankedHistory();
        this.renderLeaderboard();
        this.renderProfile();
    }
    
    // Render stats bar (top 4 cards)
    static renderStatsBar() {
        const data = Auth.getUserData();
        
        document.getElementById('sb-best').textContent = data.bestWpm || 0;
        
        const history = data.history || [];
        const avg = history.length ?
            Math.round(history.reduce((s, x) => s + x.wpm, 0) / history.length) : 0;
        document.getElementById('sb-avg').textContent = avg;
        
        document.getElementById('sb-tests').textContent = data.totalTests || 0;
        
        const rank = getRank(data.bestWpm || 0);
        document.getElementById('sb-rank').innerHTML = `
            <span style="color:${rank.color}">${rank.icon}<br>${rank.name}</span>
        `;
    }
    
    // Render practice history
    static renderHistory() {
        const history = Auth.getUserData().history || [];
        const practiceHistory = history.filter(x => x.mode !== 'ranked');
        
        const html = practiceHistory.slice(0, 10).map(x => `
            <div class="hist-item">
                <span style="color:var(--muted);font-size:10px">${x.time}</span>
                <span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--accent2);font-size:12px">${x.wpm} WPM</span>
                <span style="color:var(--success);font-size:11px">${x.acc}%</span>
                <span style="color:var(--danger);font-size:10px">${x.errors}e</span>
                ${x.maxCombo ? `<span style="color:var(--warning);font-size:9px">🔥${x.maxCombo}</span>` : ''}
            </div>
        `).join('');
        
        document.getElementById('hist-list').innerHTML = html || `
            <div style="text-align:center;padding:20px;color:var(--muted);font-size:12px">No tests yet — start typing above!</div>
        `;
    }
    
    // Render ranked history
    static renderRankedHistory() {
        const history = Auth.getUserData().rankedHistory || [];
        
        const html = history.slice(0, 8).map((x, i) => `
            <div class="hist-item">
                <span style="color:var(--muted);font-size:10px">#${i + 1} · ${x.time}</span>
                <span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--accent2);font-size:12px">${x.wpm} WPM</span>
                <span style="color:var(--success);font-size:11px">${x.acc}%</span>
                ${x.maxCombo ? `<span style="color:var(--warning);font-size:9px">🔥${x.maxCombo}</span>` : ''}
            </div>
        `).join('');
        
        document.getElementById('r-hist-list').innerHTML = html || `
            <div style="text-align:center;padding:20px;color:var(--muted);font-size:12px">No ranked matches yet.</div>
        `;
    }
    
    // Render leaderboard
    static renderLeaderboard() {
        const leaderboard = Storage.getLeaderboard(15);
        const currentUsername = Auth.currentUser ? Auth.currentUser.data.username : null;
        const medals = ['🥇', '🥈', '🥉'];
        
        document.getElementById('lb-body').innerHTML = leaderboard.map((p, i) => {
            const rank = getRank(p.wpm);
            const isYou = currentUsername && p.name === currentUsername;
            
            return `
                <tr class="${isYou ? 'you-row' : ''}">
                    <td style="font-family:'JetBrains Mono',monospace;font-weight:700">
                        ${i < 3 ? medals[i] : '#' + (i + 1)}
                    </td>
                    <td style="font-weight:600">
                        ${p.name}
                        ${isYou ? '<span style="font-size:8px;color:var(--accent);background:rgba(124,106,247,0.15);padding:1px 4px;border-radius:3px">YOU</span>' : ''}
                    </td>
                    <td>
                        <span class="rank-pill" style="background:${rank.bg};color:${rank.color}">
                            ${rank.icon} ${rank.name}
                        </span>
                    </td>
                    <td style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--accent2)">${p.wpm}</td>
                    <td style="color:var(--success)">${p.acc}%</td>
                    <td style="color:var(--muted)">${p.tests}</td>
                </tr>
            `;
        }).join('');
    }
    
    // Render profile
    static renderProfile() {
        const data = Auth.getUserData();
        const name = Auth.currentUser ? Auth.currentUser.data.username : 'Guest';
        const rank = getRank(data.bestWpm || 0);
        
        // Next rank progress
        const rankIndex = RANKS.findIndex(x => x.name === rank.name);
        const nextRank = RANKS[rankIndex + 1];
        const progress = nextRank ?
            Math.min(100, Math.round(((data.bestWpm || 0) - rank.min) / (nextRank.min - rank.min) * 100)) : 100;
        
        // Basic info
        document.getElementById('p-name').textContent = name;
        document.getElementById('p-rank-badge').innerHTML = `${rank.icon} ${rank.name}`;
        document.getElementById('p-rank-badge').style.cssText += `background:${rank.bg};color:${rank.color}`;
        document.getElementById('p-xp').textContent = (data.xp || 0) + ' XP';
        document.getElementById('p-xp-fill').style.width = progress + '%';
        
        // Statistics
        const history = data.history || [];
        const avgWpm = history.length ?
            Math.round(history.reduce((s, x) => s + x.wpm, 0) / history.length) : 0;
        const avgAcc = history.length ?
            Math.round(history.reduce((s, x) => s + x.acc, 0) / history.length) : 0;
        const totalErrors = history.reduce((s, x) => s + (x.errors || 0), 0);
        const bestCombo = data.maxCombo || 0;
        
        document.getElementById('p-stats').innerHTML = `
            <div>🏆 Best WPM: <strong>${data.bestWpm || 0}</strong></div>
            <div>📊 Average WPM: <strong>${avgWpm}</strong></div>
            <div>🎯 Avg Accuracy: <strong>${avgAcc}%</strong></div>
            <div>📝 Tests Done: <strong>${data.totalTests || 0}</strong></div>
            <div>❌ Total Errors: <strong>${totalErrors}</strong></div>
            <div>⚡ Total XP: <strong>${data.xp || 0}</strong></div>
            <div>🔥 Best Combo: <strong>${bestCombo}x</strong></div>
            ${Auth.currentUser ? `<div>📧 Email: <strong>${Auth.currentUser.data.email}</strong></div>` : ''}
        `;
        
        // Achievements
        const achievements = [
            { icon: '🌱', name: 'First Steps', condition: data.totalTests >= 1 },
            { icon: '🔥', name: '50+ WPM', condition: (data.bestWpm || 0) >= 50 },
            { icon: '⌨️', name: 'Typist (65+)', condition: (data.bestWpm || 0) >= 65 },
            { icon: '⚡', name: 'Expert (100+)', condition: (data.bestWpm || 0) >= 100 },
            { icon: '🏆', name: 'Master (120+)', condition: (data.bestWpm || 0) >= 120 },
            { icon: '💎', name: 'GM (150+)', condition: (data.bestWpm || 0) >= 150 },
            { icon: '🎯', name: '100% Accuracy', condition: history.some(x => x.acc === 100) },
            { icon: '👑', name: 'Legend (200+)', condition: (data.bestWpm || 0) >= 200 },
            { icon: '💥', name: '30+ Combo', condition: (data.maxCombo || 0) >= 30 },
            { icon: '🌟', name: '50+ Godlike', condition: (data.maxCombo || 0) >= 50 },
            { icon: '🏅', name: '10 Tests', condition: (data.totalTests || 0) >= 10 },
            { icon: '🎖️', name: '100 Tests', condition: (data.totalTests || 0) >= 100 }
        ];
        
        document.getElementById('p-badges').innerHTML = achievements.map(a => `
            <div class="badge ${a.condition ? 'earned' : 'locked'}">
                ${a.icon} ${a.name}
            </div>
        `).join('');
        
        // Rank progression
        document.getElementById('p-ranks').innerHTML = RANKS.map(rk => {
            const achieved = (data.bestWpm || 0) >= rk.min;
            const isCurrent = rank.name === rk.name;
            
            return `
                <div class="rank-row" style="${isCurrent ? `background:${rk.bg};border-color:${rk.color}` : ''}">
                    <span style="font-size:16px;opacity:${achieved ? 1 : 0.3}">${rk.icon}</span>
                    <div style="flex:1">
                        <div style="font-size:12px;font-weight:600;color:${achieved ? rk.color : 'var(--muted)'}">
                            ${rk.name}
                        </div>
                        <div style="font-size:10px;color:var(--muted)">
                            ${rk.min}+ WPM required
                        </div>
                    </div>
                    ${isCurrent ? `<span style="font-size:9px;color:${rk.color};background:${rk.bg};padding:2px 6px;border-radius:8px">Current</span>` : 
                      achieved ? '<span style="color:var(--success)">✓</span>' : 
                      '<span style="color:var(--muted);font-size:10px">Locked</span>'}
                </div>
            `;
        }).join('');
    }
}