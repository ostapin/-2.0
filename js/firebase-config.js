// Конфигурация Firebase (пока заглушка)
class FirebaseConfig {
    constructor() {
        this.initialized = false;
        this.config = {
            // Эти данные мы получим позже при создании проекта Firebase
            apiKey: "будет_позже",
            authDomain: "будет_позже",
            projectId: "будет_позже",
            storageBucket: "будет_позже",
            messagingSenderId: "будет_позже",
            appId: "будет_позже"
        };
    }

    // Инициализация Firebase
    async initialize() {
        if (this.initialized) return true;
        
        try {
            // Проверяем доступность Firebase
            if (typeof firebase === 'undefined') {
                console.warn('Firebase не подключен. Работаем в офлайн-режиме.');
                return false;
            }

            // Инициализируем Firebase
            firebase.initializeApp(this.config);
            
            // Инициализируем сервисы
            this.db = firebase.firestore();
            this.auth = firebase.auth();
            
            this.initialized = true;
            console.log('Firebase инициализирован');
            return true;
        } catch (error) {
            console.error('Ошибка инициализации Firebase:', error);
            return false;
        }
    }

    // Получаем экземпляр базы данных
    getDatabase() {
        return this.db;
    }

    // Получаем экземпляр аутентификации
    getAuth() {
        return this.auth;
    }

    // Проверяем онлайн статус
    isOnline() {
        return navigator.onLine && this.initialized;
    }

    // Настройка офлайн-персистентности
    enableOfflinePersistence() {
        if (this.db) {
            this.db.enablePersistence()
                .catch((err) => {
                    console.warn('Офлайн-персистентность не доступна:', err);
                });
        }
    }
}

// Создаем глобальный экземпляр конфигурации
const firebaseConfig = new FirebaseConfig();
