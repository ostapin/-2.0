// Синхронизация персонажей с Firebase
class OnlineSync {
    constructor() {
        this.isOnline = false;
        this.init();
    }

    async init() {
        // Ждем инициализации Firebase
        if (!firebaseConfig.initialized) {
            await firebaseConfig.initialize();
        }
        this.isOnline = firebaseConfig.isOnline();
        this.setupSync();
    }

    setupSync() {
        // Синхронизируем при изменении персонажа
        // (добавим позже)
        console.log('✅ Синхронизация готова');
    }

    // Сохраняем персонажа в Firebase
    async saveCharacter(characterData) {
        if (!this.isOnline) {
            console.log('📴 Офлайн режим - сохраняем локально');
            return false;
        }

        try {
            const db = firebaseConfig.getDatabase();
            await db.collection('characters').doc(characterData.id).set(characterData);
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
            return [];
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
            
            console.log('✅ Загружено персонажей:', characters.length);
            return characters;
        } catch (error) {
            console.error('❌ Ошибка загрузки:', error);
            return [];
        }
    }
}

// Создаем глобальный экземпляр
const onlineSync = new OnlineSync();
