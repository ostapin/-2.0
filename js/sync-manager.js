// Менеджер синхронизации онлайн/офлайн
class SyncManager {
    constructor() {
        this.pendingChanges = [];
        this.isOnline = false;
        this.syncInterval = null;
        this.init();
    }

    // Инициализация
    init() {
        this.checkOnlineStatus();
        this.setupEventListeners();
        this.startSyncInterval();
    }

    // Проверяем онлайн статус
    checkOnlineStatus() {
        this.isOnline = navigator.onLine;
        console.log(`Статус: ${this.isOnline ? 'ОНЛАЙН' : 'ОФФЛАЙН'}`);
        
        if (this.isOnline) {
            this.syncPendingChanges();
        }
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('Интернет подключен');
            this.syncPendingChanges();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('Интернет отключен');
        });
    }

    // Запускаем интервал синхронизации
    startSyncInterval() {
        this.syncInterval = setInterval(() => {
            if (this.isOnline && this.pendingChanges.length > 0) {
                this.syncPendingChanges();
            }
        }, 30000); // Проверяем каждые 30 секунд
    }

    // Добавляем изменение в очередь
    addChange(changeType, data) {
        const change = {
            id: this.generateChangeId(),
            type: changeType,
            data: data,
            timestamp: new Date().toISOString(),
            synced: false
        };

        this.pendingChanges.push(change);
        this.savePendingChanges();
        
        console.log(`Добавлено изменение в очередь: ${changeType}`, change);
        
        // Если онлайн - пытаемся сразу синхронизировать
        if (this.isOnline) {
            this.syncPendingChanges();
        }
    }

    // Синхронизируем ожидающие изменения
    async syncPendingChanges() {
        if (!this.isOnline || this.pendingChanges.length === 0) {
            return;
        }

        console.log(`Синхронизация ${this.pendingChanges.length} изменений...`);

        const successfulSyncs = [];
        const failedSyncs = [];

        for (const change of this.pendingChanges) {
            if (change.synced) continue;

            try {
                await this.processChange(change);
                change.synced = true;
                successfulSyncs.push(change.id);
            } catch (error) {
                console.error(`Ошибка синхронизации изменения ${change.id}:`, error);
                failedSyncs.push(change.id);
            }
        }

        // Удаляем успешно синхронизированные изменения
        this.pendingChanges = this.pendingChanges.filter(change => 
            !successfulSyncs.includes(change.id)
        );

        this.savePendingChanges();

        if (successfulSyncs.length > 0) {
            console.log(`Успешно синхронизировано: ${successfulSyncs.length} изменений`);
        }
        if (failedSyncs.length > 0) {
            console.warn(`Не удалось синхронизировать: ${failedSyncs.length} изменений`);
        }
    }

    // Обрабатываем конкретное изменение
    async processChange(change) {
        // ВРЕМЕННАЯ ЗАГЛУШКА - позже заменим на реальную логику Firebase
        console.log(`Обрабатываем изменение: ${change.type}`, change.data);
        
        // Имитируем задержку сети
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Здесь будет реальная синхронизация с Firebase
        switch (change.type) {
            case 'character_save':
                // await this.syncCharacter(change.data);
                break;
            case 'character_update':
                // await this.updateCharacter(change.data);
                break;
            case 'inventory_update':
                // await this.syncInventory(change.data);
                break;
            default:
                console.warn(`Неизвестный тип изменения: ${change.type}`);
        }
    }

    // Сохраняем очередь изменений в localStorage
    savePendingChanges() {
        localStorage.setItem('pendingSyncChanges', JSON.stringify(this.pendingChanges));
    }

    // Загружаем очередь изменений из localStorage
    loadPendingChanges() {
        const saved = localStorage.getItem('pendingSyncChanges');
        if (saved) {
            this.pendingChanges = JSON.parse(saved);
            console.log(`Загружено ${this.pendingChanges.length} изменений из очереди`);
        }
    }

    // Генерация ID для изменения
    generateChangeId() {
        return 'change_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Получаем статистику синхронизации
    getStats() {
        const total = this.pendingChanges.length;
        const synced = this.pendingChanges.filter(c => c.synced).length;
        const pending = total - synced;

        return {
            total,
            synced,
            pending,
            isOnline: this.isOnline
        };
    }

    // Очищаем очередь (для отладки)
    clearQueue() {
        this.pendingChanges = [];
        this.savePendingChanges();
        console.log('Очередь синхронизации очищена');
    }
}

// Создаем глобальный экземпляр менеджера синхронизации
const syncManager = new SyncManager();
