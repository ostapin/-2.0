// modules/battle/battle-glossary-adapter.js
if (!window.BattleModule) window.BattleModule = {};

// Функция получения предмета
BattleModule.getItem = function(metalId, weaponId) {
    if (!window.metalsData || !window.weaponsData) {
        console.error('Глоссарий не загружен');
        return null;
    }
    
    const metal = metalsData[metalId];
    const weapon = weaponsData[weaponId];
    
    if (!metal || !weapon) return null;
    
    const slots = weapon.craft_slots || 1;
    const damage = (weapon.base_damage || 0) + metal.stats.durability;
    const durability = (weapon.base_durability || 0) + metal.stats.durability;
    const magic_potential = metal.stats.magic_potential * slots;
    
    return {
        id: `${metalId}_${weaponId}`,
        name: `${metal.name} ${weapon.name}`,
        type: 'weapon',
        damage: damage,
        durability: durability,
        magic_potential: magic_potential,
        metal: metalId,
        weapon: weaponId,
        slots: slots
    };
};

// Заполняем предметы в ItemsDB (для совместимости со старым кодом)
BattleModule.initGlossaryItems = function() {
    if (!window.metalsData || !window.weaponsData) {
        setTimeout(() => this.initGlossaryItems(), 100);
        return;
    }
    
    window.ItemsDB = window.ItemsDB || { items: {} };
    let count = 0;
    
    for (const metalId in metalsData) {
        for (const weaponId in weaponsData) {
            const item = this.getItem(metalId, weaponId);
            if (item) {
                window.ItemsDB.items[item.id] = item;
                count++;
            }
        }
    }
    
    console.log(`Загружено ${count} предметов в ItemsDB из глоссария`);
};

// Запускаем заполнение после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    BattleModule.initGlossaryItems();
});
