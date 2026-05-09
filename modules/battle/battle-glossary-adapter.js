// modules/battle/battle-glossary-adapter.js
if (!window.BattleModule) window.BattleModule = {};

// Получить предмет из глоссария по металлу и оружию
BattleModule.getItem = function(metalId, weaponId) {
    // Получаем данные из глобальных переменных
    const metal = metalsData[metalId];
    const weapon = weaponsData[weaponId];
    
    if (!metal) {
        console.error(`Металл не найден: ${metalId}`);
        return null;
    }
    if (!weapon) {
        console.error(`Оружие не найдено: ${weaponId}`);
        return null;
    }
    
    // Рассчитываем характеристики
    const slots = weapon.craft_slots || 1;
    const damage = (weapon.base_damage || 0) + metal.stats.durability;
    const durability = (weapon.base_durability || 0) + metal.stats.durability;
    const magic_potential = metal.stats.magic_potential * slots;
    
    // Формируем объект в формате, понятном боевке
    return {
        id: `${metalId}_${weaponId}`,
        name: `${metal.name} ${weapon.name}`,
        type: 'weapon',
        damage: damage,
        durability: durability,
        magic_potential: magic_potential,
        metal: metalId,
        weapon: weaponId,
        slots: slots,
        attacks: weapon.attacks || {}
    };
};

// Загрузить все предметы в кэш (опционально)
BattleModule.loadAllItems = function() {
    if (!window.metalsData || !window.weaponsData) {
        console.warn('Глоссарий не загружен, повтор через 500ms');
        setTimeout(() => this.loadAllItems(), 500);
        return;
    }
    
    this.itemCache = {};
    let count = 0;
    
    for (const metalId in metalsData) {
        for (const weaponId in weaponsData) {
            const item = this.getItem(metalId, weaponId);
            if (item) {
                this.itemCache[item.name] = item;
                count++;
            }
        }
    }
    
    console.log(`Загружено ${count} предметов из глоссария`);
};
