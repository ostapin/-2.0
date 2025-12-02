// Менеджер аккаунтов и интерфейса пользователя
class AccountManager {
    constructor() {
        this.accountDrawer = null;
        this.currentImpersonation = null;
    }

    // Инициализация (вызывается после загрузки authSystem)
    init() {
        this.createAccountButton();
        this.createAccountDrawer();
        this.setupEventListeners();
    }

    // Создаем кнопку аккаунта в верхнем правом углу
    createAccountButton() {
        const oldBtn = document.getElementById('account-btn');
        if (oldBtn) oldBtn.remove();

        const accountBtn = document.createElement('button');
        accountBtn.id = 'account-btn';
        accountBtn.className = 'account-btn';
        accountBtn.innerHTML = '👤';
        accountBtn.onclick = () => this.toggleAccountDrawer();
        
        accountBtn.style.position = 'fixed';
        accountBtn.style.top = '25px';
        accountBtn.style.right = '25px';
        accountBtn.style.zIndex = '1001';
        
        document.body.appendChild(accountBtn);
    }
    
    // 🔥 ИСПРАВЛЕННЫЙ ОБРАБОТЧИК:
    accountBtn.onclick = () => {
        // Если открыты настройки - закрываем их и открываем шторку
        const settingsContainer = document.getElementById('settings-container');
        const masterContainer = document.getElementById('master-container');
        
        if (settingsContainer || masterContainer) {
            // Закрываем открытые страницы
            if (settingsContainer) settingsModule.closeSettings();
            if (masterContainer) accountManager.closeMasterPanel();
            
            // Даём время на анимацию закрытия
            setTimeout(() => this.toggleAccountDrawer(), 50);
        } else {
            // Если ничего не открыто - просто открываем шторку
            this.toggleAccountDrawer();
        }
    };
    
    accountBtn.style.position = 'fixed';
    accountBtn.style.top = '25px';
    accountBtn.style.right = '25px';
    accountBtn.style.zIndex = '1001'; // Важно: выше чем настройки
    
    document.body.appendChild(accountBtn);
}
        
    // Создаем шторку аккаунта
    createAccountDrawer() {
        const oldDrawer = document.getElementById('account-drawer');
        if (oldDrawer) oldDrawer.remove();

        const currentUser = authSystem?.currentUser;
        const isImpersonated = currentUser?.isImpersonated;
        const isMaster = currentUser?.role === 'master' || currentUser?.originalRole === 'master';

        const drawerHTML = `
            <div id="account-drawer" class="account-drawer">
                <div class="drawer-content">
                    <div class="drawer-header">
                        <h3>👤 Аккаунт</h3>
                        <button class="close-drawer-btn" onclick="accountManager.closeAccountDrawer()">×</button>
                    </div>
                    
                    <div class="user-info">
                        <div class="user-avatar">👤</div>
                        <div class="user-details">
                            <span class="user-name" id="drawer-user-name">Гость</span>
                            <span class="user-role" id="drawer-user-role">Не авторизован</span>
                        </div>
                    </div>

                    <div class="drawer-menu">
                        <button class="drawer-menu-item" onclick="accountManager.showCharacters()">
                            👥 ${isImpersonated ? 'Персонажи игрока' : 'Мои персонажи'}
                        </button>
                        ${isImpersonated ? 
                            '<button class="drawer-menu-item" onclick="accountManager.stopImpersonating()">🚪 Вернуться в свой аккаунт</button>' : 
                            '<button class="drawer-menu-item" onclick="accountManager.showSettings()">⚙️ Настройки</button>'
                        }
                        ${isMaster ? 
                            '<button class="drawer-menu-item" id="master-panel-btn" onclick="accountManager.showMasterPanel()">👑 Панель мастера</button>' : 
                            ''
                        }
                        <button class="drawer-menu-item logout-btn" onclick="accountManager.logout()">
                            🚪 Выйти
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', drawerHTML);
        this.accountDrawer = document.getElementById('account-drawer');
    }

    // Открываем/закрываем шторку
    toggleAccountDrawer() {
        if (!this.accountDrawer) {
            this.createAccountDrawer();
        }
        
        if (this.accountDrawer.classList.contains('open')) {
            this.closeAccountDrawer();
        } else {
            this.openAccountDrawer();
        }
    }

    // Открываем шторку
    openAccountDrawer() {
        if (!this.accountDrawer) this.createAccountDrawer();
        this.updateUserInfo();
        this.accountDrawer.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    // Закрываем шторку
    closeAccountDrawer() {
        if (this.accountDrawer) {
            this.accountDrawer.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    // Обновляем информацию о пользователе
    updateUserInfo() {
        if (typeof authSystem === 'undefined') return;

        const currentUser = authSystem.currentUser;
        const userNameElement = document.getElementById('drawer-user-name');
        const userRoleElement = document.getElementById('drawer-user-role');
        
        if (!userNameElement || !userRoleElement) return;
        
        if (currentUser) {
            if (currentUser.isImpersonated) {
                userNameElement.textContent = `🔁 ${currentUser.login}`;
                userRoleElement.textContent = '🎮 Игрок (режим мастера)';
            } else {
                userNameElement.textContent = currentUser.login || 'Гость';
                userRoleElement.textContent = currentUser.role === 'master' ? '👑 Мастер' : '🎮 Игрок';
            }
            
            // Всегда показываем панель мастера если пользователь мастер или в режиме переключения
            const masterBtn = document.getElementById('master-panel-btn');
            if (masterBtn) {
                const showMasterBtn = currentUser.role === 'master' || 
                                      currentUser.originalRole === 'master' ||
                                      currentUser.isImpersonated;
                masterBtn.style.display = showMasterBtn ? 'block' : 'none';
            }
        } else {
            userNameElement.textContent = 'Гость';
            userRoleElement.textContent = 'Не авторизован';
        }
    }

    // Показываем персонажей пользователя
    showCharacters() {
        this.closeAccountDrawer();
        if (typeof openTab === 'function') openTab('characters');
    }

    // Показываем настройки
    showSettings() {
        this.closeAccountDrawer();
        if (typeof settingsModule !== 'undefined') {
            settingsModule.openSettingsPage();
        } else {
            this.showSettingsModal();
        }
    }

    // Модальное окно настроек
    showSettingsModal() {
        const currentUser = authSystem?.currentUser;
        const modalHTML = `
            <div class="modal" id="settings-modal">
                <div class="auth-container">
                    <div class="auth-header">
                        <h2>⚙️ Настройки аккаунта</h2>
                        <button class="close-btn" onclick="accountManager.closeSettingsModal()">×</button>
                    </div>
                    
                    <div class="settings-form">
                        <h3>Смена пароля</h3>
                        <div class="input-group">
                            <input type="password" id="current-password" placeholder="Текущий пароль" class="auth-input">
                        </div>
                        <div class="input-group">
                            <input type="password" id="new-password" placeholder="Новый пароль" class="auth-input">
                        </div>
                        <div class="input-group">
                            <input type="password" id="confirm-password" placeholder="Повторите новый пароль" class="auth-input">
                        </div>
                        <button class="auth-btn primary" onclick="accountManager.changePassword()">Сменить пароль</button>

                        <h3>Смена имени</h3>
                        <div class="input-group">
                            <input type="text" id="new-name" placeholder="Новое имя" class="auth-input" value="${currentUser?.login || ''}">
                        </div>
                        <button class="auth-btn secondary" onclick="accountManager.changeName()">Сменить имя</button>
                    </div>
                </div>
            </div>
        `;

        const oldModal = document.getElementById('settings-modal');
        if (oldModal) oldModal.remove();
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Закрываем модалку настроек
    closeSettingsModal() {
        const modal = document.getElementById('settings-modal');
        if (modal) modal.remove();
    }

    // Смена пароля
    changePassword() {
        const currentPassword = document.getElementById('current-password')?.value;
        const newPassword = document.getElementById('new-password')?.value;
        const confirmPassword = document.getElementById('confirm-password')?.value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Заполните все поля');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('Новые пароли не совпадают');
            return;
        }

        if (newPassword.length < 4) {
            alert('Новый пароль должен быть не менее 4 символов');
            return;
        }

        alert('Пароль изменен (временная заглушка)');
        this.closeSettingsModal();
    }

    // Смена имени
    changeName() {
        const newName = document.getElementById('new-name')?.value;
        if (!newName || newName.length < 3) {
            alert('Имя должно быть не менее 3 символов');
            return;
        }

        if (authSystem?.currentUser) {
            authSystem.currentUser.login = newName;
            localStorage.setItem('currentUser', JSON.stringify(authSystem.currentUser));
            this.updateUserInfo();
            alert('Имя изменено');
        }
        
        this.closeSettingsModal();
    }

    // Показываем панель мастера
    showMasterPanel() {
        this.closeAccountDrawer();
        this.showMasterPanelModal();
    }

    // Модальное окно панели мастера
    showMasterPanelModal() {
        const modalHTML = `
            <div class="modal" id="master-modal">
                <div class="auth-container" style="max-width: 800px;">
                    <div class="auth-header">
                        <h2>👑 Панель мастера</h2>
                        <button class="close-btn" onclick="accountManager.closeMasterPanel()">×</button>
                    </div>
                    
                    <div class="master-panel">
                        <div class="master-stats">
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <span class="stat-label">Всего игроков:</span>
                                    <span class="stat-value" id="total-players">0</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">Онлайн:</span>
                                    <span class="stat-value" id="online-players">0</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">Персонажей:</span>
                                    <span class="stat-value" id="total-characters">0</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="players-section">
                            <h3>👥 Игроки</h3>
                            <div class="search-box">
                                <input type="text" id="search-players" placeholder="🔍 Поиск игрока..." 
                                       oninput="accountManager.searchPlayers(this.value)">
                            </div>
                            <div id="players-list" class="players-list">
                                <p style="color: #8b7d6b; text-align: center;">Загрузка...</p>
                            </div>
                        </div>
                        
                        <div class="impersonate-section" style="display: none; margin-top: 20px;">
                            <h3>🔁 Переключение на игрока</h3>
                            <div id="impersonate-info"></div>
                            <button class="btn btn-roll" onclick="accountManager.switchToPlayer()">🔄 Войти как этот игрок</button>
                            <button class="btn btn-minus" onclick="accountManager.stopImpersonating()">🚪 Вернуться в свой аккаунт</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.loadPlayersList();
    }

    // Загружаем список игроков
    async loadPlayersList() {
        try {
            const db = firebaseConfig.getDatabase();
            const usersSnapshot = await db.collection('users').get();
            const charactersSnapshot = await db.collection('characters').get();
            
            const players = [];
            usersSnapshot.forEach(doc => {
                if (doc.data().role !== 'master') {
                    players.push({
                        id: doc.id,
                        ...doc.data(),
                        charactersCount: 0,
                        lastSeen: null
                    });
                }
            });
            
            players.forEach(player => {
                player.charactersCount = charactersSnapshot.docs
                    .filter(char => char.data().userId === player.id).length;
            });
            
            this.renderPlayersList(players);
            this.updateStats(players, charactersSnapshot.size);
        } catch (error) {
            console.error('Ошибка загрузки игроков:', error);
            const container = document.getElementById('players-list');
            if (container) {
                container.innerHTML = '<p style="color: #ff6b6b;">Ошибка загрузки</p>';
            }
        }
    }

    // Рендер списка игроков
    renderPlayersList(players) {
        const container = document.getElementById('players-list');
        if (!container) return;
        
        if (players.length === 0) {
            container.innerHTML = '<p style="color: #8b7d6b;">Игроков нет</p>';
            return;
        }
        
        container.innerHTML = players.map(player => `
            <div class="player-card" data-user-id="${player.id}">
                <div class="player-info">
                    <div class="player-name-row">
                        <span class="player-name">${player.login}</span>
                        <span class="player-status ${this.getPlayerStatus(player)}">
                            ${this.getPlayerStatus(player) === 'online' ? '🟢' : '⚫'}
                        </span>
                    </div>
                    <div class="player-details">
                        <span class="player-role">🎮 Игрок</span>
                        <span class="player-characters">🧙 ${player.charactersCount} перс.</span>
                        <span class="player-last-seen">🕒 ${this.formatLastSeen(player.lastLogin)}</span>
                    </div>
                </div>
                <div class="player-actions">
                    <button class="btn-small" onclick="accountManager.viewPlayerCharacters('${player.id}', '${player.login}')">
                        👀 Персонажи
                    </button>
                    <button class="btn-small" onclick="accountManager.impersonatePlayer('${player.id}', '${player.login}')">
                        🔄 Переключиться
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Просмотр персонажей игрока
    viewPlayerCharacters(userId, userName) {
        if (typeof openTab === 'function') openTab('characters');
        console.log(`👀 Просмотр персонажей игрока ${userName}`);
    }

    // Переключение на аккаунт игрока
    impersonatePlayer(userId, userName) {
        this.currentImpersonation = { userId, userName };
        
        const infoDiv = document.getElementById('impersonate-info');
        const section = document.querySelector('.impersonate-section');
        
        if (infoDiv && section) {
            infoDiv.innerHTML = `
                <p>Вы переключаетесь на аккаунт: <strong>${userName}</strong></p>
                <p>Вы сможете видеть и редактировать его персонажей</p>
            `;
            section.style.display = 'block';
        }
    }

    // Реальное переключение на игрока
    async switchToPlayer() {
        if (!this.currentImpersonation) return;
        
        const originalUser = authSystem.currentUser;
        if (originalUser.role === 'master') {
            originalUser.originalRole = 'master';
        }
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
            
            accountManager.updateUserInfo();
            authSystem.updateUI();
            
            alert(`✅ Теперь вы вошли как: ${userData.login}`);
            this.closeMasterPanel();
        }
    }

    // Выход из режима переключения
    stopImpersonating() {
        const originalUser = JSON.parse(localStorage.getItem('originalUser'));
        
        if (originalUser) {
            authSystem.currentUser = originalUser;
            localStorage.setItem('currentUser', JSON.stringify(originalUser));
            localStorage.removeItem('originalUser');
            
            accountManager.updateUserInfo();
            authSystem.updateUI();
            
            alert('✅ Вы вернулись в свой аккаунт');
        }
        
        this.currentImpersonation = null;
        const section = document.querySelector('.impersonate-section');
        if (section) section.style.display = 'none';
    }

    // Определяем статус онлайн/оффлайн
    getPlayerStatus(player) {
        return player.lastLogin && 
               (Date.now() - new Date(player.lastLogin).getTime() < 5 * 60 * 1000) 
               ? 'online' : 'offline';
    }

    // Форматируем время последнего входа
    formatLastSeen(timestamp) {
        if (!timestamp) return 'никогда';
        
        const date = new Date(timestamp);
        const now = new Date();
        const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffHours < 1) return 'только что';
        if (diffHours < 24) return `${diffHours} ч назад`;
        return date.toLocaleDateString();
    }

    // Обновление статистики
    updateStats(players, totalCharacters) {
        const totalEl = document.getElementById('total-players');
        const onlineEl = document.getElementById('online-players');
        const charsEl = document.getElementById('total-characters');
        
        if (totalEl) totalEl.textContent = players.length;
        if (onlineEl) onlineEl.textContent = players.filter(p => this.getPlayerStatus(p) === 'online').length;
        if (charsEl) charsEl.textContent = totalCharacters;
    }

    // Поиск игроков
    searchPlayers(query) {
        console.log('Поиск:', query);
    }

    // Закрываем панель мастера
    closeMasterPanel() {
        const modal = document.getElementById('master-modal');
        if (modal) modal.remove();
    }

    // Выход из системы
    logout() {
        if (confirm('Вы уверены, что хотите выйти?')) {
            if (authSystem) authSystem.logout();
            this.closeAccountDrawer();
        }
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.accountDrawer?.classList.contains('open')) {
                this.closeAccountDrawer();
            }
        });
    }
}

// Создаем глобальный экземпляр
const accountManager = new AccountManager();

// Инициализируем после загрузки
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (typeof authSystem !== 'undefined') {
            accountManager.init();
        }
    }, 100);
});
