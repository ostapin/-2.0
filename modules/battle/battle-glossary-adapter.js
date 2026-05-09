// modules/battle/battle-glossary-adapter.js
if (!window.BattleModule) window.BattleModule = {};

function initGlossaryItems() {
    // Проверяем наличие данных
    if (typeof metalsData === 'undefined' || typeof weaponsData === 'undefined') {
        console.warn('Глоссарий не загружен, повтор через 200ms');
        setTimeout(initGlossaryItems, 200);
        return;
    }
    
    if (!window.ItemsDB) window.ItemsDB = { items: {} };
    
    let count = 0;
    for (const metalId in metalsData) {
        for (const weaponId in weaponsData) {
            const metal = metalsData[metalId];
            const weapon = weaponsData[weaponId];
            const slots = weapon.craft_slots || 1;
            const damage = (weapon.base_damage || 0) + metal.stats.durability;
            const durability = (weapon.base_durability || 0) + metal.stats.durability;
            const magic_potential = metal.stats.magic_potential * slots;
            const itemId = `${metalId}_${weaponId}`;
            
            window.ItemsDB.items[itemId] = {
                id: itemId,
                name: `${metal.name} ${weapon.name}`,
                type: 'weapon',
                damage: damage,
                durability: durability,
                magic_potential: magic_potential,
                attacks: weapon.attacks || {}
            };
            count++;
        }
    }
    console.log(`✅ Загружено ${count} предметов в ItemsDB из глоссария`);
}

// Запускаем после загрузки страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlossaryItems);
} else {
    initGlossaryItems();
}
