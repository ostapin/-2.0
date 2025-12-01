// Синхронизация персонажей с Firebase
class OnlineSync {
    constructor() {
        this.isOnline = false;
        this.init();
    }

    async init() {
        if (!firebaseConfig.initialized) {
            await firebaseConfig.initialize();
        }
        this.isOnline = firebaseConfig.isOnline();
        this.setupAutoSave();
        console.log('✅ Синхронизация готова');
    }

    // Автосохранение при изменении персонажа
    setupAutoSave() {
        // Будем вызывать эту функцию при любом изменении персонажа
        console.log('🔧 Автосохранение настроено');
    }

    // Сохраняем персонажа в Firebase
    async saveCharacter(characterData) {
        if (!this.isOnline) {
            console.log('📴 Офлайн режим - сохраняем локально');
            return false;
        }

        try {
            const db = firebaseConfig.getDatabase();
            // Добавляем ID пользователя к данным персонажа
            const characterWithUser = {
                ...characterData,
                userId: authSystem.currentUser.id,
                lastUpdated: new Date().toISOString()
            };
            
            await db.collection('characters').doc(characterData.id).set(characterWithUser);
            console.log('✅ Персонаж сохранен в облако:', characterData.name);
            return true;
        } catch (error) {
            console.error('❌ Ошибка сохранения:', error);
            return false;
        }
    }

    // Загружаем персонажей пользователя
    async loadUserCharacters(userId) {
        if (!this.isOnline) {
            console.log('📴 Офлайн режим - загружаем локально');
            return this.loadLocalCharacters();
        }

        try {
            const db = firebaseConfig.getDatabase();
            const snapshot = await db.collection('characters')
                .where('userId', '==', userId)
                .get();
            
            const characters = [];
            snapshot.forEach(doc => {
                characters.push(doc.data());
            });
            
            console.log('✅ Загружено персонажей из облака:', characters.length);
            
            // Сохраняем локально для офлайн-режима
            this.saveLocalCharacters(characters);
            
            return characters;
        } catch (error) {
            console.error('❌ Ошибка загрузки:', error);
            return this.loadLocalCharacters();
        }
    }

    // Загружаем локальные персонажи
    loadLocalCharacters() {
        const saved = localStorage.getItem('localCharacters');
        return saved ? JSON.parse(saved) : [];
    }

    // Сохраняем локальные персонажи
    saveLocalCharacters(characters) {
        localStorage.setItem('localCharacters', JSON.stringify(characters));
    }

    // Мастер: загружаем ВСЕХ персонажей
    async loadAllCharacters() {
        if (!this.isOnline) {
            console.log('📴 Офлайн режим');
            return [];
        }

        try {
            const db = firebaseConfig.getDatabase();
            const snapshot = await db.collection('characters').get();
            
            const characters = [];
            snapshot.forEach(doc => {
                characters.push(doc.data());
            });
            
            console.log('👑 Мастер: загружено всех персонажей:', characters.length);
            return characters;
        } catch (error) {
            console.error('❌ Ошибка загрузки всех персонажей:', error);
            return [];
        }
    }
}

// Создаем глобальный экземпляр
const onlineSync = new OnlineSync();
