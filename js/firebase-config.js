// Конфигурация Firebase
class FirebaseConfig {
    constructor() {
        this.initialized = false;
        this.config = {
            apiKey: "AIzaSyB4dwuKayRlendiLcRvLxuuJ5ksELXYk70",
            authDomain: "ostapin-games.firebaseapp.com",
            projectId: "ostapin-games",
            storageBucket: "ostapin-games.firebasestorage.app",
            messagingSenderId: "868166452130",
            appId: "1:868166452130:web:b968aab55adec1264ea8fb"
        };
    }

    async initialize() {
        if (this.initialized) return true;
        
        try {
            if (typeof firebase === 'undefined') {
                console.warn('Firebase не подключен. Работаем в офлайн-режиме.');
                return false;
            }

            // Инициализируем Firebase
            firebase.initializeApp(this.config);
            
            // Инициализируем сервисы
            this.db = firebase.firestore();
            this.auth = firebase.auth();
            
            // Включаем офлайн-поддержку
            this.db.enablePersistence().catch((err) => {
                console.warn('Офлайн-режим не доступен:', err);
            });
            
            this.initialized = true;
            console.log('✅ Firebase инициализирован');
            return true;
        } catch (error) {
            console.error('❌ Ошибка Firebase:', error);
            return false;
        }
    }

    getDatabase() {
        return this.db;
    }

    getAuth() {
        return this.auth;
    }

    isOnline() {
        return navigator.onLine && this.initialized;
    }
}

// Создаем глобальный экземпляр конфигурации
const firebaseConfig = new FirebaseConfig();
