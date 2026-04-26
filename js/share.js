// ============ KEYVIBE SHARE SYSTEM ============

class Share {
    // Open share overlay
    static open() {
        const result = TypingEngine.lastResult;
        
        document.getElementById('share-wpm').textContent = result.wpm;
        document.getElementById('share-acc').textContent = result.acc + '%';
        document.getElementById('share-combo').textContent = result.combo;
        
        document.getElementById('share-overlay').classList.add('show');
    }
    
    // Close share overlay
    static close() {
        document.getElementById('share-overlay').classList.remove('show');
    }
    
    // Share to Twitter
    static twitter() {
        const result = TypingEngine.lastResult;
        const text = `I just typed at ${result.wpm} WPM with ${result.acc}% accuracy on KeyVibe! 🎹\n\nCan you beat me? https://keyvibe.app`;
        
        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
            '_blank'
        );
        
        this.close();
    }
    
    // Share to Facebook
    static facebook() {
        const result = TypingEngine.lastResult;
        const text = `I just typed at ${result.wpm} WPM with ${result.acc}% accuracy on KeyVibe! 🎹`;
        const url = 'https://keyvibe.app';
        
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
            '_blank'
        );
        
        this.close();
    }
    
    // Copy result to clipboard
    static copy() {
        const result = TypingEngine.lastResult;
        const text = `🎹 KeyVibe Result:\n⚡ ${result.wpm} WPM\n🎯 ${result.acc}% Accuracy\n🔥 Max Combo: ${result.combo}x\n\nPlay at: https://keyvibe.app`;
        
        navigator.clipboard.writeText(text).then(() => {
            UI.showToast('Copied to clipboard!', '📋');
            this.close();
        }).catch(() => {
            UI.showToast('Failed to copy', '❌');
        });
    }
    
    // Download result as PNG
    static download() {
        const result = TypingEngine.lastResult;
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 250;
        const ctx = canvas.getContext('2d');
        
        // Background
        const bgColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--surface2').trim() || '#161625';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 400, 250);
        
        // WPM
        const accentColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--accent').trim() || '#7c6af7';
        ctx.fillStyle = accentColor;
        ctx.font = 'bold 48px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(result.wpm + ' WPM', 200, 80);
        
        // Stats
        const textColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--text').trim() || '#e8e8f2';
        ctx.fillStyle = textColor;
        ctx.font = '16px Outfit, sans-serif';
        ctx.fillText(
            result.acc + '% Accuracy | Max Combo: ' + result.combo + 'x',
            200, 130
        );
        
        // Watermark
        const mutedColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--muted').trim() || '#5a5a7a';
        ctx.fillStyle = mutedColor;
        ctx.font = '12px Outfit, sans-serif';
        ctx.fillText('keyvibe.app', 200, 200);
        
        // Download
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'keyvibe-result.png';
            a.click();
            URL.revokeObjectURL(url);
            
            UI.showToast('Image downloaded!', '💾');
            this.close();
        });
    }
}