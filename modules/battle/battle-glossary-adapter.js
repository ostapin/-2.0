// modules/battle/battle-glossary-adapter.js
// Адаптер для получения данных из глоссария
if (!window.BattleModule) window.BattleModule = {};

BattleModule.getItem = function(metalId, weaponId) {
    // Проверяем, загружен ли глоссарий
    if (!window.Glossary || !window.Glossary.getAllItems) {
        console.error('Глоссарий не загружен');
        return null;
    }
    
    // Получаем все предметы из глоссария
    const allItems = window.Glossary.getAllItems();
    const metalName = metalsData[metalId]?.name || metalId;
    const weaponName = weaponsData[weaponId]?.name || weaponId;
    const itemName = `${metalName} ${weaponName}`;
    
    // Ищем предмет по имени
    const item = allItems.find(i => i.name === itemName);
    if (!item) {
        console.warn(`Предмет не найден: ${itemName}`);
        return null;
    }
    
    // Приводим к формату, понятному боевке
    return {
        name: item.name,
        type: 'weapon',
        damage: item.damage,
        durability: item.durability,
        magic_potential: item.magic_potential,
        price: item.price,
        attacks: weaponsData[weaponId]?.attacks || {}
    };
};

// Загрузка всех предметов при старте
BattleModule.loadAllItems = function() {
    if (!window.Glossary || !window.Glossary.getAllItems) {
        console.warn('Глоссарий не загружен, ждём...');
        setTimeout(() => this.loadAllItems(), 500);
        return;
    }
    
    const allItems = window.Glossary.getAllItems();
    console.log(`Загружено ${allItems.length} предметов из глоссария`);
    
    // Можно сохранить в кэш для быстрого доступа
    this.itemCache = {};
    allItems.forEach(item => {
        this.itemCache[item.name] = item;
    });
};
