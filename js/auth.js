// Система авторизации и управления аккаунтами
class AuthSystem {
    constructor() {
        this.currentUser = null;
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
            this.onLoginSuccess(this.currentUser);
        } else {
            this.showAuthPopup();
        }
    }

    // Показываем попап авторизации
    showAuthPopup() {
        // Создаем попап если его нет
        if (!document.getElementById('auth-popup')) {
            this.createAuthPopup();
        }
        document.getElementById('auth-popup').style.display = 'flex';
    }

    // Создаем HTML для попапа авторизации
    createAuthPopup() {
        const popupHTML = `
            <div id="auth-popup" class="auth-modal">
                <div class="auth-container">
                    <div class="auth-header">
                        <h2>🔐 Авторизация</h2>
                        <button class="close-btn" onclick="authSystem.closeAuthPopup()">×</button>
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
                        </div>
                        <button class="auth-btn primary" onclick="authSystem.register()">Создать аккаунт</button>
                        <button class="auth-btn secondary" onclick="authSystem.showLoginForm()">Назад к входу</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', popupHTML);
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
        masterField.style.display = userType === 'master' ? 'block' : 'none';
    }

    // Закрываем попап
closeAuthPopup() {
    const authPopup = document.getElementById('auth-popup');
    if (authPopup) {
        authPopup.style.display = 'none';
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

        // ВРЕМЕННАЯ ЗАГЛУШКА - потом заменим на реальную авторизацию
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

        // ВРЕМЕННАЯ ЗАГЛУШКА
        const user = {
            id: this.generateId(),
            login: login,
            role: userType,
            isAuthenticated: true,
            createdAt: new Date().toISOString()
        };

        this.completeLogin(user);
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
        this.onLoginSuccess(user);
        this.closeAuthPopup();
        this.showMessage(`Добро пожаловать, ${user.login}!`, 'success');
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
        // Здесь будем обновлять интерфейс
        this.updateUI();
    }

    // Выход
    onLogout() {
        console.log('Пользователь вышел');
        // Сбрасываем интерфейс
        this.updateUI();
    }

    // Обновление интерфейса
    updateUI() {
        // Здесь будем показывать/скрывать кнопку аккаунта
        console.log('Обновляем интерфейс для пользователя:', this.currentUser);
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
        // Добавим позже
    }
}

// Создаем глобальный экземпляр системы авторизации
const authSystem = new AuthSystem();
