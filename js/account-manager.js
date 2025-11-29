// Менеджер аккаунтов и интерфейса пользователя
class AccountManager {
    constructor() {
        this.accountDrawer = null;
        this.init();
    }

    // Инициализация
    init() {
        this.createAccountButton();
        this.createAccountDrawer();
        this.setupEventListeners();
    }

    // Создаем кнопку аккаунта в верхнем правом углу
    createAccountButton() {
        const accountBtn = document.createElement('button');
        accountBtn.id = 'account-btn';
        accountBtn.className = 'account-btn';
        accountBtn.innerHTML = '👤';
        accountBtn.onclick = () => this.toggleAccountDrawer();
        
        // Добавляем кнопку в интерфейс
        const header = document.querySelector('.header');
        if (header) {
            header.style.position = 'relative';
            accountBtn.style.position = 'absolute';
            accountBtn.style.top = '20px';
            accountBtn.style.right = '20px';
            header.appendChild(accountBtn);
        } else {
            // Если нет хедера, добавляем в body
            accountBtn.style.position = 'fixed';
            accountBtn.style.top = '20px';
            accountBtn.style.right = '20px';
            accountBtn.style.zIndex = '1000';
            document.body.appendChild(accountBtn);
        }
    }

    // Создаем шторку аккаунта
    createAccountDrawer() {
        const drawerHTML = `
            <div id="account-drawer" class="account-drawer">
                <div class="drawer-overlay" onclick="accountManager.closeAccountDrawer()"></div>
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
                            👥 Мои персонажи
                        </button>
                        <button class="drawer-menu-item" onclick="accountManager.showSettings()">
                            ⚙️ Настройки
                        </button>
                        <button class="drawer-menu-item" id="master-panel-btn" style="display: none;" onclick="accountManager.showMasterPanel()">
                            👑 Панель мастера
                        </button>
                        <button class="drawer-menu-item" onclick="accountManager.showSyncStatus()">
                            🔄 Статус синхронизации
                        </button>
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
        if (this.accountDrawer.classList.contains('open')) {
            this.closeAccountDrawer();
        } else {
            this.openAccountDrawer();
        }
    }

    // Открываем шторку
    openAccountDrawer() {
        this.updateUserInfo();
        this.accountDrawer.classList.add('open');
        document.body.style.overflow = 'hidden'; // Блокируем скролл
    }

    // Закрываем шторку
    closeAccountDrawer() {
        this.accountDrawer.classList.remove('open');
        document.body.style.overflow = ''; // Разблокируем скролл
    }

    // Обновляем информацию о пользователе
    updateUserInfo() {
        const currentUser = authSystem.currentUser;
        
        if (currentUser) {
            document.getElementById('drawer-user-name').textContent = currentUser.login;
            document.getElementById('drawer-user-role').textContent = 
                currentUser.role === 'master' ? '👑 Мастер' : '🎮 Игрок';
            
            // Показываем/скрываем панель мастера
            const masterBtn = document.getElementById('master-panel-btn');
            masterBtn.style.display = currentUser.role === 'master' ? 'block' : 'none';
        } else {
            document.getElementById('drawer-user-name').textContent = 'Гость';
            document.getElementById('drawer-user-role').textContent = 'Не авторизован';
        }
    }

    // Показываем персонажей пользователя
    showCharacters() {
        this.closeAccountDrawer();
        // Переключаемся на вкладку персонажей
        if (typeof openTab === 'function') {
            openTab('characters');
        }
        alert('Переход к управлению персонажами');
    }

    // Показываем настройки
    showSettings() {
        this.closeAccountDrawer();
        this.showSettingsModal();
    }

    // Модальное окно настроек
    showSettingsModal() {
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
                            <input type="text" id="new-name" placeholder="Новое имя" class="auth-input" value="${authSystem.currentUser?.login || ''}">
                        </div>
                        <button class="auth-btn secondary" onclick="accountManager.changeName()">Сменить имя</button>
                    </div>
                </div>
            </div>
        `;

        // Удаляем старую модалку если есть
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
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

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

        // ВРЕМЕННАЯ ЗАГЛУШКА
        alert('Пароль изменен (временная заглушка)');
        this.closeSettingsModal();
    }

    // Смена имени
    changeName() {
        const newName = document.getElementById('new-name').value;

        if (!newName || newName.length < 3) {
            alert('Имя должно быть не менее 3 символов');
            return;
        }

        // ВРЕМЕННАЯ ЗАГЛУШКА
        if (authSystem.currentUser) {
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
                <div class="auth-container" style="max-width: 600px;">
                    <div class="auth-header">
                        <h2>👑 Панель мастера</h2>
                        <button class="close-btn" onclick="accountManager.closeMasterPanel()">×</button>
                    </div>
                    
                    <div class="master-panel">
                        <h3>Управление игроками</h3>
                        <div id="players-list" class="players-list">
                            <p style="color: #8b7d6b; text-align: center;">Загрузка списка игроков...</p>
                        </div>
                        
                        <div class="master-stats">
                            <h3>Статистика</h3>
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <span class="stat-label">Всего игроков:</span>
                                    <span class="stat-value">0</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">Онлайн:</span>
                                    <span class="stat-value">0</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">Активных игр:</span>
                                    <span class="stat-value">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.loadPlayersList();
    }

    // Загружаем список игроков (заглушка)
    loadPlayersList() {
        const playersList = document.getElementById('players-list');
        playersList.innerHTML = `
            <div class="player-card">
                <span class="player-name">Пример игрока</span>
                <span class="player-status online">🟢 Онлайн</span>
                <button class="btn-small">👀 Персонажи</button>
            </div>
            <p style="color: #8b7d6b; text-align: center; margin-top: 20px;">
                Реальный список игроков появится после подключения Firebase
            </p>
        `;
    }

    // Закрываем панель мастера
    closeMasterPanel() {
        const modal = document.getElementById('master-modal');
        if (modal) modal.remove();
    }

    // Показываем статус синхронизации
    showSyncStatus() {
        this.closeAccountDrawer();
        const stats = syncManager.getStats();
        
        alert(`Статус синхронизации:
📊 Всего изменений: ${stats.total}
✅ Синхронизировано: ${stats.synced}
⏳ В очереди: ${stats.pending}
🌐 Статус: ${stats.isOnline ? 'ОНЛАЙН' : 'ОФФЛАЙН'}`);
    }

    // Выход из системы
    logout() {
        if (confirm('Вы уверены, что хотите выйти?')) {
            authSystem.logout();
            this.closeAccountDrawer();
        }
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        // Закрытие шторки по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.accountDrawer.classList.contains('open')) {
                this.closeAccountDrawer();
            }
        });
    }
}

// Создаем глобальный экземпляр менеджера аккаунтов
const accountManager = new AccountManager();
