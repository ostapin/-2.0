// Главный модуль настроек
class SettingsModule {
    constructor() {
        this.currentPage = 'main';
        this.ui = null;
        this.avatarSystem = null;
        this.appearance = null;
        this.initialized = false;
    }

    // Инициализация
    init() {
        if (this.initialized) return;
        
        this.initialized = true;
        console.log('✅ Модуль настроек инициализирован');
    }

    // Открыть страницу настроек
    openSettingsPage(page = 'main') {
        this.currentPage = page;
        
        // 1. Закрываем текущие модалки
        this.closeAllModals();
        
        // 2. Блокируем скролл
        document.body.classList.add('no-scroll');
        
        // 3. Создаём контейнер для настроек
        this.createSettingsContainer();
        
        // 4. Загружаем и показываем страницу
        this.loadPage(page);
        
        // 5. Показываем кнопку профиля
        this.showProfileButton();
    }

    // Создаём контейнер для настроек
    createSettingsContainer() {
        // Удаляем старый контейнер если есть
        const oldContainer = document.getElementById('settings-container');
        if (oldContainer) oldContainer.remove();

        const containerHTML = `
            <div id="settings-container" class="settings-container">
                <!-- Шапка с навигацией -->
                <div class="settings-header">
                    <button class="settings-back-btn" onclick="settingsModule.goBack()">← Назад</button>
                    <h2 class="settings-title" id="settings-title">Настройки</h2>
                    <div class="settings-header-spacer"></div>
                </div>
                
                <!-- Основной контент -->
                <div class="settings-content" id="settings-content">
                    <p style="color: #8b7d6b; text-align: center; padding: 50px;">
                        Загрузка настроек...
                    </p>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', containerHTML);
    }

    // Загружаем страницу
    loadPage(page) {
        const content = document.getElementById('settings-content');
        const title = document.getElementById('settings-title');
        
        if (!content || !title) return;
        
        switch(page) {
            case 'main':
                title.textContent = 'Настройки';
                this.loadMainPage(content);
                break;
            case 'profile':
                title.textContent = 'Профиль';
                this.loadProfilePage(content);
                break;
            case 'appearance':
                title.textContent = 'Внешний вид';
                this.loadAppearancePage(content);
                break;
            default:
                title.textContent = 'Настройки';
                content.innerHTML = `<p>Страница "${page}" в разработке</p>`;
        }
    }

    // Главная страница настроек
    loadMainPage(container) {
        container.innerHTML = `
            <div class="settings-grid">
                <div class="settings-item" onclick="settingsModule.openSettingsPage('profile')">
                    <div class="settings-item-icon">👤</div>
                    <div class="settings-item-text">
                        <h3>Профиль и аватар</h3>
                        <p>Имя, аватарка, контакты</p>
                    </div>
                    <div class="settings-item-arrow">→</div>
                </div>
                
                <div class="settings-item" onclick="settingsModule.openSettingsPage('appearance')">
                    <div class="settings-item-icon">🎨</div>
                    <div class="settings-item-text">
                        <h3>Внешний вид</h3>
                        <p>Темы, стили, шрифты</p>
                    </div>
                    <div class="settings-item-arrow">→</div>
                </div>
                
                <div class="settings-item">
                    <div class="settings-item-icon">🔔</div>
                    <div class="settings-item-text">
                        <h3>Уведомления</h3>
                        <p>Звуки, оповещения</p>
                    </div>
                    <div class="settings-item-arrow">→</div>
                </div>
                
                <div class="settings-item">
                    <div class="settings-item-icon">🔒</div>
                    <div class="settings-item-text">
                        <h3>Приватность</h3>
                        <p>Доступ к данным</p>
                    </div>
                    <div class="settings-item-arrow">→</div>
                </div>
                
                <div class="settings-item" onclick="settingsModule.openSyncSettings()">
                    <div class="settings-item-icon">🔄</div>
                    <div class="settings-item-text">
                        <h3>Данные и синхронизация</h3>
                        <p>Облачное сохранение</p>
                    </div>
                    <div class="settings-item-arrow">→</div>
                </div>
            </div>
        `;
    }

    // Страница профиля
    loadProfilePage(container) {
        const currentUser = authSystem?.currentUser;
        container.innerHTML = `
            <div class="profile-settings">
                <div class="avatar-section">
                    <h3>Аватарка</h3>
                    <div class="avatar-preview" id="avatar-preview">
                        <div class="avatar-placeholder">👤</div>
                    </div>
                    <button class="btn btn-roll" onclick="settingsModule.changeAvatar()">🖼️ Сменить аватар</button>
                </div>
                
                <div class="profile-info-section">
                    <h3>Информация профиля</h3>
                    <div class="input-group">
                        <label>Имя пользователя</label>
                        <input type="text" id="profile-username" value="${currentUser?.login || ''}" class="auth-input">
                    </div>
                    <div class="input-group">
                        <label>Email</label>
                        <input type="email" id="profile-email" value="${currentUser?.email || ''}" class="auth-input" placeholder="email@example.com">
                    </div>
                    <button class="btn btn-roll" onclick="settingsModule.saveProfile()">💾 Сохранить</button>
                </div>
                
                <div class="danger-zone">
                    <h3 style="color: #ff6b6b;">Опасная зона</h3>
                    <button class="btn btn-minus" onclick="settingsModule.deleteAccount()">🗑️ Удалить аккаунт</button>
                </div>
            </div>
        `;
    }

    // Страница внешнего вида
    loadAppearancePage(container) {
        container.innerHTML = `
            <div class="appearance-settings">
                <h3>Тема оформления</h3>
                <div class="theme-selector">
                    <div class="theme-option" onclick="settingsModule.setTheme('dark')">
                        <div class="theme-preview dark-theme"></div>
                        <span>Тёмная</span>
                    </div>
                    <div class="theme-option" onclick="settingsModule.setTheme('light')">
                        <div class="theme-preview light-theme"></div>
                        <span>Светлая</span>
                    </div>
                    <div class="theme-option" onclick="settingsModule.setTheme('fantasy')">
                        <div class="theme-preview fantasy-theme"></div>
                        <span>Фэнтези</span>
                    </div>
                </div>
                
                <h3>Размер шрифта</h3>
                <div class="font-size-control">
                    <button class="btn-small" onclick="settingsModule.changeFontSize(-1)">A-</button>
                    <span style="margin: 0 10px;">Стандартный</span>
                    <button class="btn-small" onclick="settingsModule.changeFontSize(1)">A+</button>
                </div>
                
                <h3>Цвет акцентов</h3>
                <div class="color-picker">
                    <input type="color" id="accent-color" value="#d4af37" onchange="settingsModule.changeAccentColor(this.value)">
                    <label for="accent-color">Выберите цвет</label>
                </div>
            </div>
        `;
    }

    // Настройки синхронизации
    openSyncSettings() {
        const container = document.getElementById('settings-content');
        const title = document.getElementById('settings-title');
        
        if (!container || !title) return;
        
        title.textContent = 'Синхронизация';
        
        if (typeof syncManager !== 'undefined') {
            const stats = syncManager.getStats();
            container.innerHTML = `
                <div class="sync-settings">
                    <h3>Статус синхронизации</h3>
                    <div class="sync-stats">
                        <div class="sync-stat">
                            <span class="sync-label">Всего изменений:</span>
                            <span class="sync-value">${stats.total}</span>
                        </div>
                        <div class="sync-stat">
                            <span class="sync-label">Синхронизировано:</span>
                            <span class="sync-value">${stats.synced}</span>
                        </div>
                        <div class="sync-stat">
                            <span class="sync-label">В очереди:</span>
                            <span class="sync-value">${stats.pending}</span>
                        </div>
                        <div class="sync-stat">
                            <span class="sync-label">Статус:</span>
                            <span class="sync-value ${stats.isOnline ? 'online' : 'offline'}">
                                ${stats.isOnline ? 'ОНЛАЙН 🟢' : 'ОФФЛАЙН 🔴'}
                            </span>
                        </div>
                    </div>
                    
                    <div class="sync-controls">
                        <button class="btn btn-roll" onclick="syncManager.forceSync()">🔄 Принудительная синхронизация</button>
                        <button class="btn btn-minus" onclick="syncManager.clearQueue()">🗑️ Очистить очередь</button>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="sync-settings">
                    <p style="color: #ff6b6b;">Менеджер синхронизации не загружен</p>
                </div>
            `;
        }
    }

    // Назад
    goBack() {
        if (this.currentPage === 'main') {
            this.closeSettings();
        } else {
            this.openSettingsPage('main');
        }
    }

    // Закрыть настройки
    closeSettings() {
        const container = document.getElementById('settings-container');
        if (container) container.remove();
        
        // Разблокируем скролл
        document.body.classList.remove('no-scroll');
        
        // Восстанавливаем кнопку профиля
        if (typeof accountManager !== 'undefined') {
            accountManager.createAccountButton();
        }
    }

    // Закрыть все модалки
    closeAllModals() {
        document.querySelectorAll('.modal, .auth-modal, .account-drawer').forEach(el => el.remove());
    }

    // Показать кнопку профиля
    showProfileButton() {
        if (!document.getElementById('account-btn')) {
            accountManager.createAccountButton();
        }
    }

    // Заглушки для будущих функций
    changeAvatar() { alert('Смена аватара - в разработке'); }
    saveProfile() { alert('Профиль сохранён'); }
    deleteAccount() { 
        if (confirm('УДАЛИТЬ АККАУНТ НАВСЕГДА? Это нельзя отменить!')) {
            alert('Удаление аккаунта - в разработке');
        }
    }
    setTheme(theme) { alert(`Тема: ${theme} - в разработке`); }
    changeFontSize(delta) { alert(`Размер шрифта ${delta > 0 ? '+' : '-'} - в разработке`); }
    changeAccentColor(color) { alert(`Цвет акцентов: ${color} - в разработке`); }
}

// Создаём глобальный экземпляр
const settingsModule = new SettingsModule();

// Инициализируем при загрузке
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (typeof authSystem !== 'undefined') {
            settingsModule.init();
        }
    }, 500);
});
