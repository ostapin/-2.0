// Система авторизации и управления аккаунтами
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.MASTER_PASSWORD = "20011997Ostapin3";
        this.init();
    }

    // Инициализация системы
    init() {
        this.checkAuthState();
        this.setupEventListeners();
    }

    // Проверяем состояние авторизации при загрузке
    checkAuthState() {
        const savedUser = localStorage.getItem('currentUser');
        
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.hideAuthPopup();
            this.onLoginSuccess(this.currentUser);
        } else {
            this.showAuthPopup();
        }
    }

    // Показываем попап авторизации
    showAuthPopup() {
        // Удаляем старый попап если есть
        this.hideAuthPopup();
        
        const popupHTML = `
            <div id="auth-popup" class="auth-modal">
                <div class="auth-container">
                    <div class="auth-header">
                        <h2>🔐 Авторизация</h2>
                        <button class="close-btn" onclick="authSystem.hideAuthPopup()">×</button>
                    </div>
                    
                    <!-- Форма входа -->
                    <div id="login-form" class="auth-form">
                        <div class="input-group">
                            <input type="text" id="login-input" placeholder="Логин" class="auth-input">
                        </div>
                        <div class="input-group">
                            <input type="password" id="password-input" placeholder="Пароль" class="auth-input">
                        </div>
                        <button class="auth-btn primary" onclick="authSystem.login()">Войти</button>
                        <button class="auth-btn secondary" onclick="authSystem.showRegisterForm()">Регистрация</button>
                    </div>

                    <!-- Форма регистрации -->
                    <div id="register-form" class="auth-form" style="display: none;">
                        <div class="input-group">
                            <input type="text" id="reg-login" placeholder="Логин" class="auth-input">
                        </div>
                        <div class="input-group">
                            <input type="password" id="reg-password" placeholder="Пароль" class="auth-input">
                        </div>
                        <div class="input-group">
                            <input type="password" id="reg-password-confirm" placeholder="Повторите пароль" class="auth-input">
                        </div>
                        <div class="input-group">
                            <select id="user-type" class="auth-input" onchange="authSystem.toggleMasterPassword()">
                                <option value="player">🎮 Игрок</option>
                                <option value="master">👑 Мастер</option>
                            </select>
                        </div>
                        <div id="master-password-field" class="input-group" style="display: none;">
                            <input type="password" id="master-password" placeholder="Пароль мастера" class="auth-input">
                            <small>Требуется специальный пароль</small>
                        </div>
                        <button class="auth-btn primary" onclick="authSystem.register()">Создать аккаунт</button>
                        <button class="auth-btn secondary" onclick="authSystem.showLoginForm()">Назад к входу</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', popupHTML);
    }

    // Надежное скрытие попапа
    hideAuthPopup() {
        const popup = document.getElementById('auth-popup');
        if (popup) {
            popup.remove();
        }
        // Дополнительно ищем по классу
        const authModals = document.querySelectorAll('.auth-modal');
        authModals.forEach(modal => modal.remove());
    }

    // Показываем форму входа
    showLoginForm() {
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
    }

    // Показываем форму регистрации
    showRegisterForm() {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
    }

    // Переключаем поле пароля мастера
    toggleMasterPassword() {
        const userType = document.getElementById('user-type').value;
        const masterField = document.getElementById('master-password-field');
        if (masterField) {
            masterField.style.display = userType === 'master' ? 'block' : 'none';
        }
    }

    // Вход в систему
    login() {
        const login = document.getElementById('login-input').value;
        const password = document.getElementById('password-input').value;

        if (!this.validateCredentials(login, password)) {
            this.showMessage('Заполните все поля', 'error');
            return;
        }

        const user = {
            id: this.generateId(),
            login: login,
            role: 'player',
            isAuthenticated: true,
            lastLogin: new Date().toISOString()
        };

        this.completeLogin(user);
    }

    // Регистрация
    register() {
        const login = document.getElementById('reg-login').value;
        const password = document.getElementById('reg-password').value;
        const passwordConfirm = document.getElementById('reg-password-confirm').value;
        const userType = document.getElementById('user-type').value;
        const masterPassword = document.getElementById('master-password').value;

        if (!this.validateRegistration(login, password, passwordConfirm, userType, masterPassword)) {
            return;
        }

        // Проверяем пароль мастера если выбран режим мастера
        if (userType === 'master') {
            if (!this.validateMasterPassword(masterPassword)) {
                this.showMessage('Неверный пароль мастера', 'error');
                return;
            }
        }

        const user = {
            id: this.generateId(),
            login: login,
            role: userType,
            isAuthenticated: true,
            createdAt: new Date().toISOString()
        };

        this.completeLogin(user);
    }

    // Валидация пароля мастера
    validateMasterPassword(password) {
        return password === this.MASTER_PASSWORD;
    }

    // Валидация входа
    validateCredentials(login, password) {
        return login && password && login.length >= 3 && password.length >= 4;
    }

    // Валидация регистрации
    validateRegistration(login, password, passwordConfirm, userType, masterPassword) {
        if (!login || !password || !passwordConfirm) {
            this.showMessage('Заполните все поля', 'error');
            return false;
        }

        if (login.length < 3) {
            this.showMessage('Логин должен быть не менее 3 символов', 'error');
            return false;
        }

        if (password.length < 4) {
            this.showMessage('Пароль должен быть не менее 4 символов', 'error');
            return false;
        }

        if (password !== passwordConfirm) {
            this.showMessage('Пароли не совпадают', 'error');
            return false;
        }

        if (userType === 'master' && !masterPassword) {
            this.showMessage('Введите пароль мастера', 'error');
            return false;
        }

        return true;
    }

    // Завершение входа
    completeLogin(user) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Надежно закрываем попап
        this.hideAuthPopup();
        
        this.onLoginSuccess(user);
        this.showMessage(`Добро пожаловать, ${user.login}! (${user.role === 'master' ? '👑 Мастер' : '🎮 Игрок'})`, 'success');
    }

    // Выход из системы
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.onLogout();
        this.showAuthPopup();
    }

    // Успешный вход
    onLoginSuccess(user) {
        console.log('Пользователь вошел:', user);
        this.updateUI();
        
        // Перезагружаем основные системы
        this.reloadSystems();
    }

    // Выход
    onLogout() {
        console.log('Пользователь вышел');
        this.updateUI();
    }

    // Обновление интерфейса
    updateUI() {
        // Показываем/скрываем кнопку аккаунта
        this.showAccountButton();
        
        // Показываем/скрываем основной интерфейс
        const mainInterface = document.querySelector('.container');
        if (mainInterface) {
            mainInterface.style.opacity = this.currentUser ? '1' : '0.3';
            mainInterface.style.pointerEvents = this.currentUser ? 'auto' : 'none';
        }
    }

    // Показываем кнопку аккаунта
    showAccountButton() {
        // Удаляем старую кнопку если есть
        const oldBtn = document.getElementById('account-btn');
        if (oldBtn) oldBtn.remove();

        if (this.currentUser) {
            const btn = document.createElement('button');
            btn.id = 'account-btn';
            btn.className = 'account-btn';
            btn.innerHTML = '👤';
            btn.onclick = () => accountManager.toggleAccountDrawer();
            
            document.body.appendChild(btn);
        }
    }

    // Перезагрузка систем
    reloadSystems() {
        // Перезагружаем вкладки чтобы они инициализировались для нового пользователя
        if (typeof openTab === 'function') {
            setTimeout(() => openTab('character'), 100);
        }
    }

    // Показ сообщений
    showMessage(text, type = 'info') {
        alert(`[${type.toUpperCase()}] ${text}`);
    }

    // Генерация ID
    generateId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAuthPopup();
            }
        });

        // При клике вне попапа
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('auth-modal')) {
                this.hideAuthPopup();
            }
        });
    }
}

// Создаем глобальный экземпляр системы авторизации
const authSystem = new AuthSystem();
