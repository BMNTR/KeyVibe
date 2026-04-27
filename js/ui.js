// ============ KEYVIBE UI RENDERER ============

class UI {
    // Show toast notification
    static showToast(message, icon = '*') {
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

    static buildLanguageSelects() {
        const optionMarkup = LANGUAGE_OPTIONS.map((option) =>
            `<option value="${option.key}">${getLanguageLabel(option.key)}</option>`
        ).join('');

        ['lang-select', 'ranked-lang-select'].forEach((id) => {
            const select = document.getElementById(id);
            if (select) {
                select.innerHTML = optionMarkup;
            }
        });
    }

    static syncLanguageSelects(language) {
        ['lang-select', 'ranked-lang-select'].forEach((id) => {
            const select = document.getElementById(id);
            if (select) {
                select.value = language || 'en';
            }
        });
    }

    static applyLanguage() {
        document.documentElement.lang = getCurrentLanguage();
        document.title = `KeyVibe - ${t('nav_practice')}`;

        const setText = (selector, value) => {
            const el = document.querySelector(selector);
            if (el) el.textContent = value;
        };

        const setHtml = (selector, value) => {
            const el = document.querySelector(selector);
            if (el) el.innerHTML = value;
        };

        const setPlaceholder = (selector, value) => {
            const el = document.querySelector(selector);
            if (el) el.placeholder = value;
        };

        const setTitle = (selector, value) => {
            const el = document.querySelector(selector);
            if (el) el.title = value;
        };

        setHtml('.nav .nav-btn:nth-child(1)', t('nav_practice'));
        setHtml('.nav .nav-btn:nth-child(2)', `${t('nav_multiplayer')} <span class="new-badge">NEW</span>`);
        setHtml('.nav .nav-btn:nth-child(3)', t('nav_leaderboard'));
        setHtml('.nav .nav-btn:nth-child(4)', t('nav_profile'));
        setText('#h-role', t('owner_badge'));
        setText('#auth-subtitle', t('auth_subtitle'));
        setText('#google-signin-btn', t('auth_google'));
        document.querySelectorAll('.guest-link').forEach((button) => {
            button.textContent = t('auth_guest');
        });
        setTitle('.modal-close', t('auth_guest_short'));
        setTitle('#mute-btn', t('sound_toggle'));
        setTitle('.theme-toggle-btn', t('theme_change'));
        setText('.stats-row .stat-card:nth-child(1) .stat-label', t('stats_best'));
        setText('.stats-row .stat-card:nth-child(2) .stat-label', t('stats_avg'));
        setText('.stats-row .stat-card:nth-child(3) .stat-label', t('stats_tests'));
        setText('.stats-row .stat-card:nth-child(4) .stat-label', t('stats_rank'));
        setText('#pause-overlay .pause-title', t('pause_title'));
        setText('#pause-overlay .pause-sub', t('pause_subtitle'));
        setText('#result-overlay .res-label', t('result_wpm'));
        setText('#result-overlay .res-stat:nth-child(1) .res-stat-label', t('result_accuracy'));
        setText('#result-overlay .res-stat:nth-child(2) .res-stat-label', t('result_correct'));
        setText('#result-overlay .res-stat:nth-child(3) .res-stat-label', t('result_errors'));
        setText('#result-overlay .btn-row .btn-p', t('result_try_again'));
        setText('#result-overlay .btn-row .btn-s', t('nav_leaderboard'));
        setText('#m-practice', t('mode_practice'));
        setText('#m-ranked', t('mode_ranked'));
        setText('#mode-practice .tb-group:first-child .tb-btn:nth-child(1)', t('difficulty_easy'));
        setText('#mode-practice .tb-group:first-child .tb-btn:nth-child(2)', t('difficulty_medium'));
        setText('#mode-practice .tb-group:first-child .tb-btn:nth-child(3)', t('difficulty_hard'));
        setText('#hint', t('hint_start'));
        setText('#r-hint', t('hint_start'));
        setText('#caps-warn', t('caps_lock'));
        setText('#r-caps-warn', t('caps_lock'));
        setText('#tab-practice .panel:last-child .panel-title', t('recent_results'));
        setText('#mode-ranked .ranked-info strong', t('ranked_title'));
        const rankedInfo = document.querySelector('#mode-ranked .ranked-info');
        if (rankedInfo) {
            rankedInfo.innerHTML = `<strong>${t('ranked_title')}</strong> - <br>${t('ranked_desc')}`;
        }
        setText('#mode-ranked .panel:last-child .panel-title', t('ranked_history'));
        setText('#tab-multiplayer .panel-title', t('multiplayer_title'));
        setText('#mp-lobby h3', t('multiplayer_heading'));
        setText('#mp-lobby p', t('multiplayer_sub'));
        setText('#mp-lobby .room-actions .btn.btn-p', t('create_room'));
        setText('#mp-lobby .room-actions .btn.btn-s', t('join'));
        setPlaceholder('#mp-room-code', t('room_code').toUpperCase());
        setText('#mp-room-info > div:first-child', t('room_code'));
        setText('#mp-room-info > div:nth-child(3)', t('share_room'));
        setText('#mp-start-btn', t('start_match_need'));
        setText('#mp-race-area .toolbar span:first-child', t('live_room'));
        setText('#mp-race-area .toolbar span:nth-child(2)', t('shared_text'));
        setText('#tab-leaderboard .panel-title', t('leaderboard_title'));
        setText('#tab-leaderboard thead th:nth-child(2)', t('leaderboard_player'));
        setText('#tab-leaderboard thead th:nth-child(4)', t('stats_best'));
        setText('#tab-leaderboard thead th:nth-child(6)', t('stats_tests'));
        setText('.profile-avatar-title', t('profile_photo'));
        setText('#p-avatar-source-label', Auth.getAvatarSourceLabel());
        setText('label[for="p-display-name"]', t('nickname'));
        setPlaceholder('#p-display-name', t('nickname_placeholder'));
        setText('.profile-actions .btn:nth-child(1)', t('upload_avatar'));
        setText('.profile-actions .btn:nth-child(2)', t('use_default'));
        setText('.profile-actions .btn:nth-child(3)', t('save_profile'));
        setText('#tab-profile .p-grid > div:first-child .sec-head', t('statistics'));
        setText('#tab-profile .p-grid > div:nth-child(2) .sec-head', t('badge_collection'));
        setText('#tab-profile > .panel + .ad-slot + .panel .sec-head', t('rank_progression'));
        document.querySelectorAll('.ad-slot.ad-banner').forEach((el) => {
            if (!el.children.length) {
                el.textContent = t('ad_banner');
            }
        });
        document.querySelectorAll('.ad-slot.ad-sidebar').forEach((el) => {
            if (!el.children.length) {
                el.textContent = t('ad_tower');
            }
        });
        document.querySelectorAll('.ad-slot.ad-inline').forEach((el) => {
            if (!el.children.length) {
                el.textContent = t('ad_wide');
            }
        });
    }

    // Update all UI components
    static updateAll() {
        this.applyLanguage();
        this.renderStatsBar();
        this.renderHistory();
        this.renderRankedHistory();
        this.renderLeaderboard();
        this.renderProfile();
        this.renderSideRail();
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
        const rankLabel = getRankLabel(rank.name);
        document.getElementById('sb-rank').innerHTML = `
            <span class="rank-mini">
                <img class="rank-mini-art" src="${getRankArt(rank, true, true)}" alt="${rankLabel} rank"/>
                <span style="color:${rank.color}">${rankLabel}</span>
            </span>
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
                ${x.maxCombo ? `<span style="color:var(--warning);font-size:9px">x${x.maxCombo}</span>` : ''}
            </div>
        `).join('');

        document.getElementById('hist-list').innerHTML = html || `
            <div style="text-align:center;padding:20px;color:var(--muted);font-size:12px">${t('no_tests')}</div>
        `;
    }

    // Render ranked history
    static renderRankedHistory() {
        const history = Auth.getUserData().rankedHistory || [];

        const html = history.slice(0, 8).map((x, i) => `
            <div class="hist-item">
                <span style="color:var(--muted);font-size:10px">#${i + 1} - ${x.time}</span>
                <span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--accent2);font-size:12px">${x.wpm} WPM</span>
                <span style="color:var(--success);font-size:11px">${x.acc}%</span>
                ${x.maxCombo ? `<span style="color:var(--warning);font-size:9px">x${x.maxCombo}</span>` : ''}
            </div>
        `).join('');

        document.getElementById('r-hist-list').innerHTML = html || `
            <div style="text-align:center;padding:20px;color:var(--muted);font-size:12px">${t('no_ranked')}</div>
        `;
    }

    // Render leaderboard
    static renderLeaderboard() {
        SupabaseService.getLeaderboard(15).then(result => {
            const leaderboard = result.data || [];
            const currentUsername = Auth.currentUser ? Auth.userData?.username : null;
            const medals = ['#1', '#2', '#3'];

            document.getElementById('lb-body').innerHTML = leaderboard.map((p, i) => {
                const rank = getRank(p.wpm);
                const isYou = currentUsername && p.name === currentUsername;
                const badge = getFeaturedBadge({
                    bestWpm: p.wpm || 0,
                    totalTests: p.tests || 0,
                    xp: p.xp || 0,
                    maxCombo: p.maxCombo || 0
                }, isYou ? Auth.getEquippedBadge() : p.badgeId);
                const badgeMarkup = badge
                    ? `<img class="mini-badge-art" src="${getBadgeArt(badge, true, true)}" alt="${badge.name} badge"/>`
                    : '';

                return `
                    <tr class="${isYou ? 'you-row' : ''}">
                        <td style="font-family:'JetBrains Mono',monospace;font-weight:700">
                            ${i < 3 ? medals[i] : '#' + (i + 1)}
                        </td>
                        <td style="font-weight:600">
                            <div class="lb-player-meta">
                                ${badgeMarkup}
                                <span>${p.name}</span>
                            </div>
                            ${isYou ? `<span style="font-size:8px;color:var(--accent);background:${hexToRgba(getThemeColor(), 0.15)};padding:1px 4px;border-radius:3px">${t('label_you').toUpperCase()}</span>` : ''}
                        </td>
                        <td>
                            <span class="rank-pill" style="background:${rank.bg};color:${rank.color}">
                                ${rank.icon} ${getRankLabel(rank.name)}
                            </span>
                        </td>
                        <td style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--accent2)">${p.wpm}</td>
                        <td style="color:var(--success)">${p.acc}%</td>
                        <td style="color:var(--muted)">${p.tests}</td>
                    </tr>
                `;
            }).join('');
        });
    }

    // Render profile
    static renderProfile() {
        const data = Auth.getUserData();
        if (!data) return;

        const name = Auth.getProfileName();
        const rank = getRank(data.bestWpm || 0);
        const rankLabel = getRankLabel(rank.name);
        const xpProgress = getXpProgress(data.xp || 0);
        const xpTitle = getXpTitle(xpProgress.level);
        const badgeCollection = getBadgeCollection(data);
        const ownedBadges = badgeCollection.filter((badge) => badge.unlocked);
        const equippedBadgeId = Auth.getEquippedBadge();
        const equippedBadge = ownedBadges.find((badge) => badge.id === equippedBadgeId) || ownedBadges[0] || null;
        const isOwner = Auth.isOwner();
        const themeColor = getThemeColor();

        document.getElementById('p-name').textContent = name;
        document.getElementById('p-rank-badge').innerHTML = `<img class="rank-badge-art" src="${getRankArt(rank, true, true)}" alt="${rankLabel} rank"/> ${rankLabel}`;
        document.getElementById('p-rank-badge').style.cssText += `background:${hexToRgba(themeColor, 0.12)};color:var(--accent2);border:1px solid ${hexToRgba(themeColor, 0.38)}`;
        document.getElementById('p-title').textContent = `${t('title_label')}: ${xpTitle.name}`;
        document.getElementById('p-equipped-badge').textContent = equippedBadge ? `${t('equipped_badge')}: ${equippedBadge.name}` : `${t('equipped_badge')}: ${t('none_yet')}`;
        document.getElementById('p-level').textContent = xpProgress.level;
        document.getElementById('p-xp').textContent = `${data.xp || 0} XP`;
        document.getElementById('p-xp-fill').style.width = xpProgress.progress + '%';
        document.getElementById('p-xp-meta').textContent =
            `${t('level_label')} ${xpProgress.level} - ${t('xp_to_level', { xp: xpProgress.remainingXp, level: xpProgress.level + 1 })}`;
        document.getElementById('p-badge-summary').textContent =
            t('badges_unlocked', { owned: ownedBadges.length, total: badgeCollection.length });

        const nicknameInput = document.getElementById('p-display-name');
        const avatarUrlInput = document.getElementById('p-avatar-url');
        const avatarSourceInput = document.getElementById('p-avatar-source');
        const avatarSourceLabel = document.getElementById('p-avatar-source-label');
        if (nicknameInput && document.activeElement !== nicknameInput) {
            nicknameInput.value = name;
        }
        if (avatarUrlInput) {
            avatarUrlInput.value = Auth.getAvatarSource() === 'custom' ? Auth.getCustomAvatarUrl() : '';
        }
        if (avatarSourceInput) {
            avatarSourceInput.value = Auth.getAvatarSource();
        }
        if (avatarSourceLabel) {
            avatarSourceLabel.textContent = Auth.getAvatarSourceLabel();
        }
        Auth.updateProfilePreview(Auth.getPreferredAvatarUrl());

        const history = data.history || [];
        const avgWpm = history.length ?
            Math.round(history.reduce((s, x) => s + x.wpm, 0) / history.length) : 0;
        const avgAcc = history.length ?
            Math.round(history.reduce((s, x) => s + x.acc, 0) / history.length) : 0;
        const totalErrors = history.reduce((s, x) => s + (x.errors || 0), 0);
        const bestCombo = data.maxCombo || 0;

        const statRows = [
            `<div>${t('nickname')}: <strong>${name}</strong></div>`,
            `<div>${t('current_title')}: <strong>${xpTitle.name}</strong></div>`,
            `<div>${t('level_label')}: <strong>${xpProgress.level}</strong></div>`,
            `<div>${t('stats_best')}: <strong>${data.bestWpm || 0}</strong></div>`,
            `<div>${t('average_wpm')}: <strong>${avgWpm}</strong></div>`,
            `<div>${t('average_accuracy')}: <strong>${avgAcc}%</strong></div>`,
            `<div>${t('tests_done')}: <strong>${data.totalTests || 0}</strong></div>`,
            `<div>${t('total_errors')}: <strong>${totalErrors}</strong></div>`,
            `<div>${t('total_xp')}: <strong>${data.xp || 0}</strong></div>`,
            `<div>${t('xp_to_next')}: <strong>${xpProgress.remainingXp}</strong></div>`,
            `<div>${t('best_combo')}: <strong>${bestCombo}x</strong></div>`
        ];

        if (Auth.currentUser) {
            statRows.push(`<div>${t('email')}: <strong>${Auth.currentUser.email}</strong></div>`);
        }
        if (isOwner) {
            statRows.push(`<div>${t('role_owner')}: <strong>${t('owner_role_value')}</strong></div>`);
        }

        document.getElementById('p-stats').innerHTML = statRows.join('');

        document.getElementById('p-badges').innerHTML = badgeCollection.map((badge) => `
            <button
                type="button"
                class="badge ${badge.unlocked ? 'earned' : 'locked'} ${equippedBadge && equippedBadge.id === badge.id ? 'equipped' : ''}"
                ${badge.unlocked ? `onclick="Auth.setEquippedBadge('${badge.id}')"` : 'disabled'}
                title="${badge.unlocked ? t('click_to_equip') : t('locked')}"
            >
                <img class="badge-art" src="${getBadgeArt(badge, equippedBadge && equippedBadge.id === badge.id)}" alt="${badge.name} badge"/>
                <span class="badge-copy">
                    <span class="badge-name">${badge.name}</span>
                    <span class="badge-state">${equippedBadge && equippedBadge.id === badge.id ? t('equipped') : (badge.unlocked ? t('click_to_equip') : t('locked'))}</span>
                </span>
            </button>
        `).join('');

        document.getElementById('p-ranks').innerHTML = RANKS.map(rk => {
            const achieved = (data.bestWpm || 0) >= rk.min;
            const isCurrent = rank.name === rk.name;

            return `
                <div class="rank-row" style="${isCurrent ? `background:${hexToRgba(themeColor, 0.12)};border-color:var(--accent);box-shadow:0 0 0 1px ${hexToRgba(themeColor, 0.22)}` : ''}">
                    <img class="rank-row-art" src="${getRankArt(rk, achieved, isCurrent)}" alt="${getRankLabel(rk.name)} rank"/>
                    <div style="flex:1">
                        <div style="font-size:12px;font-weight:600;color:${isCurrent ? themeColor : (achieved ? rk.color : 'var(--muted)')}">
                            ${getRankLabel(rk.name)}
                        </div>
                        <div style="font-size:10px;color:var(--muted)">
                            ${t('rank_requirement', { wpm: rk.min })}
                        </div>
                    </div>
                    ${isCurrent ? `<span style="font-size:9px;color:var(--accent2);background:${hexToRgba(themeColor, 0.14)};padding:2px 6px;border-radius:8px">${t('current')}</span>` :
                      achieved ? `<span style="color:var(--success)">${t('ok')}</span>` :
                      `<span style="color:var(--muted);font-size:10px">${t('locked')}</span>`}
                </div>
            `;
        }).join('');
    }

    static updateHeaderRole() {
        const role = document.getElementById('h-role');
        if (!role) return;

        if (Auth.isOwner()) {
            role.textContent = t('owner_badge');
            role.style.display = 'inline-flex';
        } else {
            role.textContent = '';
            role.style.display = 'none';
        }
    }

    static buildTrendPath(points, width, height, minValue, maxValue) {
        if (!points.length) return '';
        const safeMax = Math.max(maxValue, minValue + 1);
        return points.map((value, index) => {
            const x = points.length === 1 ? width / 2 : (index / (points.length - 1)) * width;
            const normalized = (value - minValue) / (safeMax - minValue);
            const y = height - (normalized * (height - 12)) - 6;
            return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
        }).join(' ');
    }

    static buildTrendDots(points, width, height, minValue, maxValue, color) {
        const safeMax = Math.max(maxValue, minValue + 1);
        return points.map((value, index) => {
            const x = points.length === 1 ? width / 2 : (index / (points.length - 1)) * width;
            const normalized = (value - minValue) / (safeMax - minValue);
            const y = height - (normalized * (height - 12)) - 6;
            return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="3" fill="${color}" />`;
        }).join('');
    }

    static renderSideRail() {
        const data = Auth.getUserData() || {};
        const currentRank = getRank(data.bestWpm || 0);
        const nextRank = RANKS.find((rank) => rank.min > (data.bestWpm || 0)) || null;
        const testsDone = Number(data.totalTests || 0);
        const dailyGoal = 5;
        const goalProgress = Math.min(100, Math.round((testsDone / dailyGoal) * 100));
        const badgeCollection = getBadgeCollection(data);
        const nextBadge = badgeCollection.find((badge) => !badge.unlocked) || null;

        const languageMap = {
            en: 'English',
            id: 'Indonesian',
            es: 'Spanish',
            fr: 'French',
            de: 'German',
            it: 'Italian',
            pt: 'Portuguese',
            nl: 'Dutch',
            tr: 'Turkish',
            sv: 'Swedish',
            pl: 'Polish',
            ro: 'Romanian'
        };

        const setText = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        };

        setText('rail-session-title', 'Session Snapshot');
        setText('rail-mode-label', 'Mode');
        setText('rail-language-label', 'Language');
        setText('rail-duration-label', 'Duration');
        setText('rail-mode-value', App.currentTab === 'multiplayer' ? 'Multiplayer' : (App.currentMode === 'ranked' ? 'Ranked' : 'Practice'));
        setText('rail-language-value', languageMap[App.currentLanguage] || 'English');
        setText('rail-duration-value', `${TypingEngine.state.duration || 30}s`);

        setText('rail-goal-title', 'Daily Goal');
        setText('rail-goal-copy', 'Finish 5 tests today to keep your typing rhythm warm.');
        setText('rail-goal-meta', `${Math.min(testsDone, dailyGoal)} / ${dailyGoal} tests completed`);
        const goalFill = document.getElementById('rail-goal-fill');
        if (goalFill) goalFill.style.width = `${goalProgress}%`;

        setText('rail-next-title', 'Next Milestone');
        setText('rail-rank-badge', nextRank ? nextRank.icon : currentRank.icon);
        setText('rail-rank-name', nextRank ? getRankLabel(nextRank.name) : getRankLabel(currentRank.name));
        setText(
            'rail-rank-sub',
            nextRank
                ? `${nextRank.min} WPM needed for your next rank`
                : 'You have reached the highest visible rank tier'
        );

        setText('rail-badge-icon', nextBadge ? nextBadge.tag : 'ALL');
        setText('rail-badge-name', nextBadge ? nextBadge.name : 'Badge Collection Complete');
        setText(
            'rail-badge-sub',
            nextBadge
                ? 'Keep playing to unlock your next badge milestone'
                : 'You have unlocked every currently visible badge'
        );

        const chart = document.getElementById('rail-chart');
        const chartEmpty = document.getElementById('rail-chart-empty');
        const practiceHistory = (data.history || []).filter((entry) => entry.mode !== 'ranked').slice(-8);

        if (chart && chartEmpty) {
            if (!practiceHistory.length) {
                chart.innerHTML = '';
                chartEmpty.style.display = 'flex';
            } else {
                const width = 260;
                const height = 120;
                const wpmPoints = practiceHistory.map((entry) => Number(entry.wpm || 0));
                const accPoints = practiceHistory.map((entry) => Number(entry.acc || 0));
                const maxWpm = Math.max(40, ...wpmPoints);
                const wpmPath = this.buildTrendPath(wpmPoints, width, height, 0, maxWpm);
                const accPath = this.buildTrendPath(accPoints, width, height, 0, 100);
                const accent = getThemeColor();
                const accentTwo = getComputedStyle(document.documentElement).getPropertyValue('--accent2').trim() || '#4fc3a1';

                chart.innerHTML = `
                    <path d="${accPath}" fill="none" stroke="${accentTwo}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.95"></path>
                    <path d="${wpmPath}" fill="none" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    ${this.buildTrendDots(accPoints, width, height, 0, 100, accentTwo)}
                    ${this.buildTrendDots(wpmPoints, width, height, 0, maxWpm, accent)}
                `;
                chartEmpty.style.display = 'none';
            }
        }
    }
}
