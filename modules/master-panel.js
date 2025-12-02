// Панель мастера как отдельная страница
class MasterPanel {
    constructor() {
        this.container = null;
        this.currentImpersonation = null;
    }

    // Открыть панель мастера
    openMasterPanel() {
        // Закрываем другие модалки
        this.closeAllModals();
        
        // Блокируем скролл
        document.body.classList.add('no-scroll');
        
        // Создаём контейнер
        this.createContainer();
        
        // Загружаем данные
        this.loadData();
    }

    // Создаём контейнер
    createContainer() {
        // Удаляем старый если есть
        this.closeMasterPanel();

        const containerHTML = `
            <div id="master-container" class="master-container">
                <div class="master-header">
                    <button class="master-back-btn" onclick="masterPanel.closeMasterPanel()">← Назад</button>
                    <h2 class="master-title">👑 Панель мастера</h2>
                    <div class="master-header-spacer"></div>
                </div>
                
                <div class="master-content" id="master-content">
                    <p style="color: #8b7d6b; text-align: center; padding: 50px;">
                        Загрузка данных...
                    </p>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', containerHTML);
        this.container = document.getElementById('master-container');
    }

    // Загружаем данные
    async loadData() {
        const content = document.getElementById('master-content');
        if (!content) return;

        try {
            const db = firebaseConfig.getDatabase();
            const [usersSnapshot, charactersSnapshot] = await Promise.all([
                db.collection('users').get(),
                db.collection('characters').get()
            ]);
            
            const players = [];
            usersSnapshot.forEach(doc => {
                if (doc.data().role !== 'master') {
                    players.push({
                        id: doc.id,
                        ...doc.data(),
                        charactersCount: 0
                    });
                }
            });
            
            players.forEach(player => {
                player.charactersCount = charactersSnapshot.docs
                    .filter(char => char.data().userId === player.id).length;
            });
            
            this.renderPanel(players, charactersSnapshot.size);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            content.innerHTML = '<p style="color: #ff6b6b;">Ошибка загрузки данных</p>';
        }
    }

    // Рендер панели
    renderPanel(players, totalCharacters) {
        const content = document.getElementById('master-content');
        if (!content) return;

        content.innerHTML = `
            <div class="master-panel">
                <div class="master-stats">
                    <h3>📊 Статистика</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-label">Всего игроков:</span>
                            <span class="stat-value">${players.length}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Онлайн:</span>
                            <span class="stat-value">${players.filter(p => this.getPlayerStatus(p) === 'online').length}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Персонажей:</span>
                            <span class="stat-value">${totalCharacters}</span>
                        </div>
                    </div>
                </div>
                
                <div class="players-section">
                    <div class="section-header">
                        <h3>👥 Игроки (${players.length})</h3>
                        <input type="text" class="search-input" id="search-players" 
                               placeholder="🔍 Поиск игрока..." oninput="masterPanel.searchPlayers(this.value)">
                    </div>
                    <div id="players-list" class="players-list">
                        ${players.length === 0 ? 
                            '<p style="color: #8b7d6b; text-align: center; padding: 20px;">Игроков нет</p>' : 
                            players.map(player => this.renderPlayerCard(player)).join('')
                        }
                    </div>
                </div>
                
                <div class="impersonate-section" id="impersonate-section" style="display: none; margin-top: 30px;">
                    <h3>🔁 Переключение на игрока</h3>
                    <div id="impersonate-info" style="margin: 15px 0;"></div>
                    <div class="impersonate-buttons">
                        <button class="btn btn-roll" onclick="masterPanel.switchToPlayer()">🔄 Войти как этот игрок</button>
                        <button class="btn btn-minus" onclick="masterPanel.stopImpersonating()">🚪 Вернуться в свой аккаунт</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Рендер карточки игрока
    renderPlayerCard(player) {
        return `
            <div class="player-card" data-user-id="${player.id}">
                <div class="player-info">
                    <div class="player-name-row">
                        <span class="player-name">${player.login}</span>
                        <span class="player-status ${this.getPlayerStatus(player)}">
                            ${this.getPlayerStatus(player) === 'online' ? '🟢 Онлайн' : '⚫ Офлайн'}
                        </span>
                    </div>
                    <div class="player-details">
                        <span class="player-characters">🧙 ${player.charactersCount} перс.</span>
                        <span class="player-last-seen">🕒 ${this.formatLastSeen(player.lastLogin)}</span>
                        <span class="player-created">📅 ${new Date(player.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="player-actions">
                    <button class="btn-small" onclick="masterPanel.viewPlayerCharacters('${player.id}', '${player.login}')">
                        👀 Персонажи
                    </button>
                    <button class="btn-small" onclick="masterPanel.impersonatePlayer('${player.id}', '${player.login}')">
                        🔄 Переключиться
                    </button>
                </div>
            </div>
        `;
    }

    // Вспомогательные методы
    getPlayerStatus(player) {
        return player.lastLogin && 
               (Date.now() - new Date(player.lastLogin).getTime() < 5 * 60 * 1000) 
               ? 'online' : 'offline';
    }

    formatLastSeen(timestamp) {
        if (!timestamp) return 'никогда';
        const date = new Date(timestamp);
        const now = new Date();
        const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
        if (diffHours < 1) return 'только что';
        if (diffHours < 24) return `${diffHours} ч назад`;
        return date.toLocaleDateString();
    }

    // Поиск игроков
    searchPlayers(query) {
        const players = document.querySelectorAll('.player-card');
        players.forEach(player => {
            const name = player.querySelector('.player-name').textContent.toLowerCase();
            player.style.display = name.includes(query.toLowerCase()) ? '' : 'none';
        });
    }

    // Просмотр персонажей игрока
    viewPlayerCharacters(userId, userName) {
        console.log(`Просмотр персонажей игрока ${userName}`);
        // TODO: открыть вкладку с фильтрацией по userId
        if (typeof window.openTab === 'function') {
            window.openTab('characters');
        }
    }

    // Переключение на игрока
    impersonatePlayer(userId, userName) {
        this.currentImpersonation = { userId, userName };
        
        const infoDiv = document.getElementById('impersonate-info');
        const section = document.getElementById('impersonate-section');
        
        if (infoDiv && section) {
            infoDiv.innerHTML = `
                <p>Вы переключаетесь на аккаунт: <strong>${userName}</strong></p>
                <p><small>Вы сможете видеть и редактировать его персонажей</small></p>
            `;
            section.style.display = 'block';
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Реальное переключение
    async switchToPlayer() {
        if (!this.currentImpersonation) return;
        
        try {
            const originalUser = authSystem.currentUser;
            localStorage.setItem('originalUser', JSON.stringify(originalUser));
            
            const db = firebaseConfig.getDatabase();
            const userDoc = await db.collection('users').doc(this.currentImpersonation.userId).get();
            
            if (userDoc.exists) {
                const userData = userDoc.data();
                const impersonatedUser = {
                    id: this.currentImpersonation.userId,
                    login: userData.login,
                    role: userData.role,
                    isAuthenticated: true,
                    isImpersonated: true,
                    originalRole: originalUser.role === 'master' ? 'master' : null
                };
                
                authSystem.currentUser = impersonatedUser;
                localStorage.setItem('currentUser', JSON.stringify(impersonatedUser));
                
                // Обновляем интерфейс
                if (typeof accountManager !== 'undefined') {
                    accountManager.updateUserInfo();
                }
                if (typeof authSystem !== 'undefined') {
                    authSystem.updateUI();
                }
                
                this.closeMasterPanel();
                alert(`✅ Теперь вы вошли как: ${userData.login}`);
            }
        } catch (error) {
            console.error('Ошибка переключения:', error);
            alert('Ошибка переключения на игрока');
        }
    }

    // Выход из режима переключения
    stopImpersonating() {
        const originalUser = JSON.parse(localStorage.getItem('originalUser'));
        
        if (originalUser) {
            authSystem.currentUser = originalUser;
            localStorage.setItem('currentUser', JSON.stringify(originalUser));
            localStorage.removeItem('originalUser');
            
            if (typeof accountManager !== 'undefined') {
                accountManager.updateUserInfo();
            }
            if (typeof authSystem !== 'undefined') {
                authSystem.updateUI();
            }
            
            alert('✅ Вы вернулись в свой аккаунт');
        }
        
        this.currentImpersonation = null;
        const section = document.getElementById('impersonate-section');
        if (section) section.style.display = 'none';
    }

    // Закрыть панель мастера
    closeMasterPanel() {
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
        document.body.classList.remove('no-scroll');
    }

    // Закрыть все модалки (кроме шторки)
    closeAllModals() {
        document.querySelectorAll('.modal, .auth-modal, .settings-container').forEach(el => el.remove());
        // НЕ удаляем .account-drawer!
    }
}

// Создаём глобальный экземпляр
const masterPanel = new MasterPanel();
