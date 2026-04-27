// ============ KEYVIBE MULTIPLAYER SYSTEM ============

class Multiplayer {
    static room = null;
    static channel = null;
    static presenceKey = null;
    static progressInterval = null;
    static finishing = false;
    static ownerAutoEnabled = false;
    static ownerAutoInterval = null;

    static canAcceptTyping() {
        return !!(this.room && this.room.started && !this.room.finished);
    }

    static getPlayerName() {
        if (window.Auth?.isAuthenticated?.()) {
            const resolvedName = (
                window.Auth?.userData?.displayName ||
                window.Auth?.userData?.username ||
                window.Auth?.currentUser?.displayName ||
                window.Auth?.currentUser?.user_metadata?.display_name ||
                window.Auth?.currentUser?.user_metadata?.full_name ||
                window.Auth?.currentUser?.email?.split('@')[0] ||
                ''
            ).trim();
            if (resolvedName) return resolvedName;
            return t('leaderboard_player');
        }
        const headerName = document.getElementById('h-name')?.textContent?.trim();
        if (headerName && headerName !== t('auth_guest_short')) return headerName;
        return t('auth_guest_short');
    }

    static generateRoomCode() {
        let code = '';
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        for (let i = 0; i < 5; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        return code;
    }

    static generateRaceWords() {
        const words = [];
        const pool = getWordsForLanguage(TypingEngine.currentLanguage || 'en', 'medium');
        while (words.length < 100) {
            words.push(pool[Math.floor(Math.random() * pool.length)]);
        }
        return words;
    }

    static buildPresencePayload() {
        return {
            id: this.presenceKey,
            name: this.getPlayerName(),
            isHost: !!this.room?.isHost,
            isOwner: !!window.Auth?.isOwner?.(),
            badgeId: window.Auth?.getEquippedBadge?.() || '',
            joinedAt: Date.now()
        };
    }

    static async createRoom() {
        const code = this.generateRoomCode();
        const result = await this.openRoom(code, true);
        if (result.success) {
            UI.showToast(t('room_created', { code }), '*');
        } else {
            UI.showToast(result.error || t('room_create_fail'), '*');
        }
    }

    static async joinRoom() {
        const code = document.getElementById('mp-room-code').value.trim().toUpperCase();
        if (!code || code.length < 3) {
            UI.showToast(t('room_code_invalid'), '*');
            return;
        }

        const result = await this.openRoom(code, false);
        if (result.success) {
            UI.showToast(t('room_joined', { code }), '*');
        } else {
            UI.showToast(result.error || t('room_join_fail'), '*');
        }
    }

    static async openRoom(code, isHost) {
        const client = SupabaseService.client;
        if (!client) {
            return { success: false, error: t('room_connect_fail') };
        }

        if (window.Auth?.readyPromise) {
            await Auth.readyPromise;
        }

        await this.leaveRoom(false);

        const basePresence = window.Auth?.getUserId
            ? Auth.getUserId()
            : (Auth.currentUser?.uid || Auth.currentUser?.id || 'guest');
        this.presenceKey = `${basePresence}-${Math.random().toString(36).slice(2, 10)}`;
        this.room = {
            code,
            isHost,
            started: false,
            finished: false,
            raceId: null,
            players: [],
            localPlayer: {
                id: this.presenceKey,
                name: this.getPlayerName(),
                progress: 0,
                wpm: 0,
                acc: 100,
                finished: false,
                isYou: true,
                isHost,
                isOwner: Auth.isOwner(),
                badgeId: Auth.getEquippedBadge() || ''
            }
        };

        this.channel = client.channel(`keyvibe-room-${code}`, {
            config: {
                presence: { key: this.presenceKey },
                broadcast: { self: false }
            }
        });

        this.channel
            .on('presence', { event: 'sync' }, () => this.handlePresenceSync())
            .on('broadcast', { event: 'room-state' }, ({ payload }) => this.handleRoomState(payload))
            .on('broadcast', { event: 'race-start' }, ({ payload }) => this.handleRaceStart(payload))
            .on('broadcast', { event: 'player-progress' }, ({ payload }) => this.handleRemoteProgress(payload))
            .on('broadcast', { event: 'race-finished' }, ({ payload }) => this.handleRaceFinished(payload));

        return await new Promise((resolve) => {
            this.channel.subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await this.channel.track(this.buildPresencePayload());
                    this.showLobbyUi();
                    this.updateRoomDisplay();
                    this.refreshStartButton();
                    await this.broadcastRoomState();
                    resolve({ success: true });
                } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                    resolve({ success: false, error: t('room_connect_fail') });
                }
            });
        });
    }

    static async handleAuthIdentityChanged() {
        if (!this.room || !this.channel || !this.presenceKey) return;

        if (this.room.localPlayer) {
            this.room.localPlayer.name = this.getPlayerName();
            this.room.localPlayer.isOwner = Auth.isOwner();
            this.room.localPlayer.badgeId = Auth.getEquippedBadge() || '';
        }

        try {
            await this.channel.track(this.buildPresencePayload());
        } catch (error) {
            console.warn('Multiplayer identity refresh failed:', error);
        }

        this.updateRoomDisplay();
        this.renderOwnerControls();
    }

    static async leaveRoom(showToast = true) {
        this.stopProgressLoop();

        if (this.channel) {
            try {
                await this.channel.untrack();
            } catch (error) {
                console.warn('Multiplayer untrack failed:', error);
            }
            try {
                await SupabaseService.client.removeChannel(this.channel);
            } catch (error) {
                console.warn('Multiplayer removeChannel failed:', error);
            }
        }

        this.channel = null;
        this.room = null;
        this.presenceKey = null;
        this.finishing = false;
        this.stopOwnerAutoPlay();
        TypingEngine.sharedWords = null;
        this.showLobbyUi();
        this.clearRoomDisplay();

        if (showToast) {
            UI.showToast(t('room_left'), '*');
        }
    }

    static showLobbyUi() {
        const lobby = document.getElementById('mp-lobby');
        const raceArea = document.getElementById('mp-race-area');
        if (lobby) lobby.style.display = 'block';
        if (raceArea) raceArea.classList.remove('active');
    }

    static showRaceUi() {
        const lobby = document.getElementById('mp-lobby');
        const raceArea = document.getElementById('mp-race-area');
        if (lobby) lobby.style.display = 'none';
        if (raceArea) raceArea.classList.add('active');
    }

    static clearRoomDisplay() {
        const info = document.getElementById('mp-room-info');
        const players = document.getElementById('mp-players');
        const status = document.getElementById('mp-status');
        const code = document.getElementById('mp-code-display');
        const progress = document.getElementById('mp-player-progress');
        const startBtn = document.getElementById('mp-start-btn');
        const hint = document.getElementById('mp-hint');

        if (info) info.classList.remove('active');
        if (players) players.innerHTML = '';
        if (status) status.textContent = t('waiting_players');
        if (code) code.textContent = '—';
        if (progress) progress.innerHTML = '';
        if (startBtn) startBtn.disabled = true;
        if (hint) hint.textContent = t('waiting_match');
    }

    static getPresencePlayers() {
        if (!this.channel) return [];
        const state = this.channel.presenceState();
        const players = [];

        Object.values(state).forEach((entries) => {
            (entries || []).forEach((entry) => {
                players.push({
                    id: entry.id,
                    name: entry.name || t('leaderboard_player'),
                    isHost: !!entry.isHost,
                    isOwner: !!entry.isOwner,
                    badgeId: entry.badgeId || ''
                });
            });
        });

        return players;
    }

    static handlePresenceSync() {
        if (!this.room) return;

        const existingProgress = new Map((this.room.players || []).map((player) => [player.id, player]));
        this.room.players = this.getPresencePlayers().map((player) => {
            const previous = existingProgress.get(player.id) || {};
            return {
                id: player.id,
                name: player.name,
                isHost: player.isHost,
                isOwner: player.isOwner,
                badgeId: player.badgeId || '',
                isYou: player.id === this.presenceKey,
                progress: previous.progress || 0,
                wpm: previous.wpm || 0,
                acc: previous.acc ?? 100,
                finished: previous.finished || false
            };
        });

        this.room.localPlayer = this.room.players.find((player) => player.id === this.presenceKey) || this.room.localPlayer;
        this.updateRoomDisplay();
        this.refreshStartButton();
    }

    static async broadcastRoomState() {
        if (!this.channel || !this.room) return;

        await this.channel.send({
            type: 'broadcast',
            event: 'room-state',
            payload: {
                code: this.room.code,
                isHost: this.room.isHost,
                started: this.room.started,
                playerCount: (this.room.players || []).length
            }
        });
    }

    static handleRoomState(payload) {
        if (!this.room || !payload) return;
        if (!this.room.started) {
            const status = document.getElementById('mp-status');
            if (status && typeof payload.playerCount === 'number') {
                status.textContent = payload.playerCount > 1
                    ? t('players_connected', { count: payload.playerCount })
                    : t('waiting_players');
            }
        }
    }

    static refreshStartButton() {
        const startBtn = document.getElementById('mp-start-btn');
        const status = document.getElementById('mp-status');
        const count = (this.room?.players || []).length;

        if (!startBtn || !this.room) return;

        startBtn.disabled = !this.room.isHost || count < 2 || this.room.started;

        if (status && !this.room.started) {
            if (count < 2) {
                status.textContent = t('waiting_another_player');
            } else if (this.room.isHost) {
                status.textContent = t('host_can_start', { count });
            } else {
                status.textContent = t('waiting_host_start', { count });
            }
        }
        this.renderOwnerControls();
    }

    static updateRoomDisplay() {
        if (!this.room) return;

        const info = document.getElementById('mp-room-info');
        const code = document.getElementById('mp-code-display');
        const container = document.getElementById('mp-players');
        if (info) info.classList.add('active');
        if (code) code.textContent = this.room.code;

        if (container) {
            container.innerHTML = (this.room.players || []).map((player) => `
                <div class="mp-player-chip ${player.isYou ? 'leader' : ''} ${player.isOwner ? 'owner' : ''}">
                    <span class="mp-dot" style="background:${player.isYou ? 'var(--accent)' : 'var(--muted)'}"></span>
                    ${player.badgeId && getBadgeById(player.badgeId) ? `<img class="mp-badge-art" src="${getBadgeArt(getBadgeById(player.badgeId), true, true)}" alt="${player.badgeId} badge"/>` : ''}
                    ${player.name}${player.isYou ? ` (${t('label_you')})` : ''}${player.isHost ? ` [${t('label_host')}]` : ''}${player.isOwner ? ` [${t('label_owner')}]` : ''}
                </div>
            `).join('');
        }
        this.renderOwnerControls();
    }

    static toggleOwnerAutoPlay() {
        if (!Auth.isOwner()) return;
        this.ownerAutoEnabled = !this.ownerAutoEnabled;

        if (!this.ownerAutoEnabled) {
            this.stopOwnerAutoPlay();
        } else if (this.room?.started) {
            this.startOwnerAutoPlay();
        }

        this.renderOwnerControls();
        UI.showToast(this.ownerAutoEnabled ? t('owner_auto_enabled') : t('owner_auto_disabled'), '*');
    }

    static renderOwnerControls() {
        const wrap = document.getElementById('mp-owner-tools');
        if (!wrap) return;

        if (!Auth.isOwner()) {
            wrap.innerHTML = '';
            wrap.style.display = 'none';
            return;
        }

        wrap.style.display = 'flex';
        wrap.innerHTML = `
            <button class="btn btn-s" type="button" onclick="Multiplayer.toggleOwnerAutoPlay()">
                ${this.ownerAutoEnabled ? t('owner_auto_disable_btn') : t('owner_auto_enable_btn')}
            </button>
            <span class="mp-owner-note">${t('owner_auto_note')}</span>
        `;
    }

    static async startRace() {
        if (!this.room || !this.room.isHost) {
            UI.showToast(t('only_host_start'), '*');
            return;
        }

        if ((this.room.players || []).length < 2) {
            UI.showToast(t('need_two_players'), '*');
            return;
        }

        const payload = {
            raceId: `${this.room.code}-${Date.now()}`,
            words: this.generateRaceWords()
        };

        await this.channel.send({
            type: 'broadcast',
            event: 'race-start',
            payload
        });

        this.handleRaceStart(payload);
    }

    static handleRaceStart(payload) {
        if (!this.room || !payload?.words?.length) return;

        this.room.started = true;
        this.room.finished = false;
        this.room.raceId = payload.raceId;
        this.finishing = false;

        this.room.players = (this.room.players || []).map((player) => ({
            ...player,
            progress: 0,
            wpm: 0,
            acc: 100,
            finished: false
        }));

        TypingEngine.sharedWords = payload.words.slice();
        TypingEngine.currentTextBoxId = 'mp-text-box';
        TypingEngine.currentMode = 'multiplayer';
        App.currentTab = 'multiplayer';
        App.currentMode = 'multiplayer';

        this.showRaceUi();
        TypingEngine.buildText('mp-text-box');
        this.updateRaceProgressDisplay();
        this.startProgressLoop();
        this.renderOwnerControls();

        const hint = document.getElementById('mp-hint');
        if (hint) hint.textContent = t('match_live');

        if (this.ownerAutoEnabled && Auth.isOwner()) {
            this.startOwnerAutoPlay();
        }

        setTimeout(() => {
            document.getElementById('mp-text-box')?.focus();
        }, 120);

        UI.showToast(t('multiplayer_started'), '*');
    }

    static startProgressLoop() {
        this.stopProgressLoop();
        this.progressInterval = setInterval(() => this.pushLocalProgress(), 250);
    }

    static stopProgressLoop() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    static startOwnerAutoPlay() {
        if (!Auth.isOwner() || !this.room?.started) return;

        this.stopOwnerAutoPlay();
        this.ownerAutoInterval = setInterval(() => {
            if (!this.room?.started || !this.ownerAutoEnabled) {
                this.stopOwnerAutoPlay();
                return;
            }

            if (!TypingEngine.state.started) {
                TypingEngine.start();
            }

            const ws = TypingEngine.wordSpans[TypingEngine.state.wordIdx];
            if (!ws) {
                this.stopOwnerAutoPlay();
                return;
            }

            const el = ws.chars[TypingEngine.state.charIdx];
            if (!el) return;

            const typed = el.classList.contains('sp') ? ' ' : el.textContent;
            TypingEngine.processChar(typed);
        }, 38);
    }

    static stopOwnerAutoPlay() {
        if (this.ownerAutoInterval) {
            clearInterval(this.ownerAutoInterval);
            this.ownerAutoInterval = null;
        }
    }

    static getTotalChars() {
        return TypingEngine.wordSpans.reduce((sum, word) => sum + word.chars.length, 0) || 1;
    }

    static getLocalProgressSnapshot() {
        const state = TypingEngine.state;
        const elapsed = state.startTime ? (Date.now() - state.startTime) / 60000 : 0;
        const total = state.correctCount + state.errorCount;
        const progress = Math.min(100, Math.round(((state.wordIdx + state.charIdx) / this.getTotalChars()) * 100));
        const wpm = elapsed > 0.001 ? Math.round(state.correctCount / 5 / elapsed) : 0;
        const acc = total > 0 ? Math.round(state.correctCount / total * 100) : 100;

        return {
            id: this.presenceKey,
            name: this.getPlayerName(),
            progress,
            wpm,
            acc,
            finished: !state.running && state.started ? progress >= 100 || state.timer <= 0 : false,
            isOwner: Auth.isOwner(),
            badgeId: Auth.getEquippedBadge() || ''
        };
    }

    static async pushLocalProgress(force = false) {
        if (!this.channel || !this.room || !this.room.started) return;
        if (!force && !TypingEngine.state.started) return;

        const snapshot = this.getLocalProgressSnapshot();
        this.handleRemoteProgress(snapshot, true);

        await this.channel.send({
            type: 'broadcast',
            event: 'player-progress',
            payload: snapshot
        });

        this.checkForRaceCompletion();
    }

    static handleRemoteProgress(payload, isLocal = false) {
        if (!this.room || !payload?.id) return;

        const index = this.room.players.findIndex((player) => player.id === payload.id);
        if (index === -1) return;

        this.room.players[index] = {
            ...this.room.players[index],
            name: payload.name || this.room.players[index].name,
            progress: payload.progress ?? this.room.players[index].progress,
            wpm: payload.wpm ?? this.room.players[index].wpm,
            acc: payload.acc ?? this.room.players[index].acc,
            finished: !!payload.finished,
            isOwner: payload.isOwner ?? this.room.players[index].isOwner,
            badgeId: payload.badgeId ?? this.room.players[index].badgeId
        };

        if (isLocal) {
            this.room.localPlayer = this.room.players[index];
        }

        this.updateRaceProgressDisplay();
    }

    static updateRaceProgressDisplay() {
        const container = document.getElementById('mp-player-progress');
        if (!container || !this.room) return;

        const sorted = [...(this.room.players || [])].sort((a, b) => {
            if (b.progress !== a.progress) return b.progress - a.progress;
            return (b.wpm || 0) - (a.wpm || 0);
        });

        container.innerHTML = sorted.map((player) => `
            <div class="mp-player-row">
                <span class="mp-player-label">
                    ${player.badgeId && getBadgeById(player.badgeId) ? `<img class="mp-badge-art" src="${getBadgeArt(getBadgeById(player.badgeId), true, true)}" alt="${player.badgeId} badge"/>` : ''}
                    ${player.name}${player.isYou ? ` (${t('label_you')})` : ''}${player.finished ? ` [${t('label_done')}]` : ''}
                </span>
                <div class="mp-progress-bar" style="flex:1">
                    <div class="mp-progress-fill" style="
                        width:${player.progress || 0}%;
                        background:${player.finished ? 'var(--success)' : player.isYou ? 'var(--accent)' : 'var(--accent2)'}
                    "></div>
                </div>
                <span style="font-size:9px;width:54px;text-align:right;font-family:'JetBrains Mono',monospace">
                    ${player.wpm || 0} wpm
                </span>
            </div>
        `).join('');
    }

    static async handleLocalFinish(result) {
        if (!this.room || !this.room.started) return;

        const snapshot = this.getLocalProgressSnapshot();
        const payload = {
            id: this.presenceKey,
            name: this.getPlayerName(),
            progress: snapshot.progress,
            wpm: result.wpm,
            acc: result.acc,
            finished: true,
            isOwner: Auth.isOwner(),
            badgeId: Auth.getEquippedBadge() || ''
        };

        await this.pushLocalProgress(true);
        this.handleRemoteProgress(payload, true);
        await this.channel.send({
            type: 'broadcast',
            event: 'player-progress',
            payload
        });

        const hint = document.getElementById('mp-hint');
        if (hint) hint.textContent = t('finished_waiting');

        this.checkForRaceCompletion();
    }

    static checkForRaceCompletion() {
        if (!this.room || !this.room.started || this.finishing) return;

        const players = this.room.players || [];
        if (players.length === 0) return;

        if (players.every((player) => player.finished)) {
            this.finishRace();
        }
    }

    static async finishRace() {
        if (!this.room || this.finishing) return;

        this.finishing = true;
        this.room.started = false;
        this.room.finished = true;
        this.stopProgressLoop();
        this.stopOwnerAutoPlay();

        const results = [...(this.room.players || [])]
            .sort((a, b) => {
                if ((b.progress || 0) !== (a.progress || 0)) return (b.progress || 0) - (a.progress || 0);
                return (b.wpm || 0) - (a.wpm || 0);
            })
            .map((player) => ({
                id: player.id,
                name: player.name,
                progress: player.progress || 0,
                wpm: player.wpm || 0,
                acc: player.acc ?? 100,
                finished: !!player.finished,
                isOwner: !!player.isOwner,
                badgeId: player.badgeId || ''
            }));

        await this.channel.send({
            type: 'broadcast',
            event: 'race-finished',
            payload: { results }
        });

        this.handleRaceFinished({ results });
    }

    static handleRaceFinished(payload) {
        if (!this.room || !payload?.results) return;

        this.room.players = payload.results.map((player) => ({
            ...player,
            isYou: player.id === this.presenceKey,
            isHost: this.room.players.find((existing) => existing.id === player.id)?.isHost || false,
            isOwner: !!player.isOwner,
            badgeId: player.badgeId || ''
        }));

        this.room.started = false;
        this.room.finished = true;
        this.finishing = false;
        this.stopProgressLoop();
        this.stopOwnerAutoPlay();
        TypingEngine.sharedWords = null;

        const yourRank = this.room.players.findIndex((player) => player.id === this.presenceKey) + 1;
        const status = document.getElementById('mp-status');
        const hint = document.getElementById('mp-hint');

        this.showLobbyUi();
        this.updateRoomDisplay();
        this.refreshStartButton();

        if (status) {
            status.textContent = yourRank > 0
                ? t('match_finished_place', { rank: yourRank })
                : t('match_finished');
        }
        if (hint) {
            hint.textContent = t('waiting_match');
        }

        UI.showToast(yourRank > 0 ? t('match_finished_place', { rank: yourRank }) : t('match_finished'), '*');
    }
}
