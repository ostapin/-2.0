// Система переключения между аккаунтами
class AccountSwitcher {
    constructor() {
        this.container = null;
        this.accounts = this.loadAccounts();
    }

    // Загрузить сохранённые аккаунты
    loadAccounts() {
        return JSON.parse(localStorage.getItem('savedAccounts') || '[]');
    }

    // Сохранить аккаунты
    saveAccounts() {
        localStorage.setItem('savedAccounts', JSON.stringify(this.accounts));
    }

    // Открыть страницу аккаунтов
    openAccountsPage() {
        this.closeAllModals();
        document.body.classList.add('no-scroll');
        this.createContainer();
        this.renderAccounts();
    }

    // Создать контейнер
    createContainer() {
        this.closeAccountsPage();

        const containerHTML = `
            <div id="accounts-container" class="accounts-container">
                <div class="accounts-header">
                    <button class="accounts-back-btn" onclick="accountSwitcher.closeAccountsPage()">← Назад</button>
                    <h2 class="accounts-title">👥 Управление аккаунтами</h2>
                    <div class="accounts-header-spacer"></div>
                </div>
                
                <div class="accounts-content" id="accounts-content">
                    <div class="current-account-section">
                        <h3>👤 Текущий аккаунт</h3>
                        <div id="current-account-info" class="account-card current">
                            <div class="account-avatar">👤</div>
                            <div class="account-details">
                                <div class="account-name">${authSystem?.currentUser?.login || 'Гость'}</div>
                                <div class="account-role">${authSystem?.currentUser?.role === 'master' ? '👑 Мастер' : '🎮 Игрок'}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="saved-accounts-section">
                        <div class="section-header">
                            <h3>💾 Сохранённые аккаунты (${this.accounts.length})</h3>
                            <button class="btn btn-plus" onclick="accountSwitcher.showAddAccountForm()">
                                ➕ Добавить аккаунт
                            </button>
                        </div>
                        <div id="saved-accounts-list" class="accounts-list">
                            ${this.accounts.length === 0 ? 
                                '<p class="empty-message">Нет сохранённых аккаунтов</p>' : 
                                ''
                            }
                        </div>
                    </div>
                    
                    <div class="add-account-section" id="add-account-section" style="display: none;">
                        <h3>🔐 Добавить новый аккаунт</h3>
                        <div class="auth-form">
                            <input type="text" id="add-account-login" class="auth-input" placeholder="Логин">
                            <input type="password" id="add-account-password" class="auth-input" placeholder="Пароль">
                            <div class="form-buttons">
                                <button class="btn btn-roll" onclick="accountSwitcher.saveAccount()">💾 Сохранить аккаунт</button>
                                <button class="btn btn-minus" onclick="accountSwitcher.hideAddAccountForm()">❌ Отмена</button>
                            </div>
                            <p class="form-note">⚠️ Пароль сохраняется локально на этом устройстве</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', containerHTML);
        this.container = document.getElementById('accounts-container');
    }

    // Рендер списка аккаунтов
    renderAccounts() {
        const list = document.getElementById('saved-accounts-list');
        if (!list) return;

        if (this.accounts.length === 0) {
            list.innerHTML = '<p class="empty-message">Нет сохранённых аккаунтов</p>';
            return;
        }

        list.innerHTML = this.accounts.map((account, index) => `
            <div class="account-card saved" data-index="${index}">
                <div class="account-info">
                    <div class="account-avatar">👤</div>
                    <div class="account-details">
                        <div class="account-name">${account.login}</div>
                        <div class="account-meta">
                            <span class="account-role">${account.role === 'master' ? '👑 Мастер' : '🎮 Игрок'}</span>
                            <span class="account-last-used">🕒 ${this.formatDate(account.lastUsed)}</span>
                        </div>
                    </div>
                </div>
                <div class="account-actions">
                    <button class="btn-small" onclick="accountSwitcher.switchToAccount(${index})">
                        🔄 Переключиться
                    </button>
                    <button class="btn-small btn-danger" onclick="accountSwitcher.removeAccount(${index})">
                        🗑️ Удалить
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Показать форму добавления
    showAddAccountForm() {
        const section = document.getElementById('add-account-section');
        if (section) {
            section.style.display = 'block';
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Скрыть форму добавления
    hideAddAccountForm() {
        const section = document.getElementById('add-account-section');
        if (section) section.style.display = 'none';
    }

    // Сохранить новый аккаунт
    async saveAccount() {
        const login = document.getElementById('add-account-login').value;
        const password = document.getElementById('add-account-password').value;

        if (!login || !password) {
            alert('Заполните логин и пароль');
            return;
        }

        try {
            // Пробуем войти чтобы проверить аккаунт
            const auth = firebaseConfig.getAuth();
            await auth.signInWithEmailAndPassword(login + '@ostapin-games.com', password);
            
            // Добавляем аккаунт в список
            this.accounts.push({
                login,
                password, // ⚠️ В реальном приложении НЕ хранить пароли в открытом виде!
                role: 'player', // или получать из Firebase
                lastUsed: new Date().toISOString(),
                addedAt: new Date().toISOString()
            });
            
            this.saveAccounts();
            this.hideAddAccountForm();
            this.renderAccounts();
            alert('✅ Аккаунт сохранён!');
            
            // Выходим чтобы не оставаться в новом аккаунте
            await auth.signOut();
        } catch (error) {
            console.error('Ошибка сохранения аккаунта:', error);
            alert('Неверный логин или пароль');
        }
    }

    // Переключиться на аккаунт
    async switchToAccount(index) {
        const account = this.accounts[index];
        if (!account) return;

        try {
            const auth = firebaseConfig.getAuth();
            const userCredential = await auth.signInWithEmailAndPassword(
                account.login + '@ostapin-games.com', 
                account.password
            );
            
            // Обновляем дату последнего использования
            account.lastUsed = new Date().toISOString();
            this.saveAccounts();
            
            // Обновляем интерфейс
            if (typeof authSystem !== 'undefined') {
                await authSystem.completeLogin({
                    id: userCredential.user.uid,
                    login: account.login,
                    role: account.role,
                    isAuthenticated: true
                });
            }
            
            this.closeAccountsPage();
            alert(`✅ Переключено на аккаунт: ${account.login}`);
        } catch (error) {
            console.error('Ошибка переключения:', error);
            alert('Ошибка входа. Возможно пароль изменён.');
            this.removeAccount(index); // Удаляем нерабочий аккаунт
        }
    }

    // Удалить аккаунт
    removeAccount(index) {
        if (confirm('Удалить этот аккаунт из сохранённых?')) {
            this.accounts.splice(index, 1);
            this.saveAccounts();
            this.renderAccounts();
        }
    }

    // Форматировать дату
    formatDate(isoString) {
        if (!isoString) return 'никогда';
        const date = new Date(isoString);
        return date.toLocaleDateString();
    }

    // Закрыть страницу
    closeAccountsPage() {
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
        document.body.classList.remove('no-scroll');
    }

    // Закрыть все модалки
    closeAllModals() {
        document.querySelectorAll('.modal, .auth-modal, .settings-container, .master-container').forEach(el => el.remove());
    }
}

// Создаём глобальный экземпляр
const accountSwitcher = new AccountSwitcher();
