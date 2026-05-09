// modules/battle/battle-glossary-adapter.js
if (!window.BattleModule) window.BattleModule = {};

function initGlossaryItems() {
    if (typeof metalsData === 'undefined' || typeof weaponsData === 'undefined') {
        console.warn('Глоссарий не загружен, повтор через 200ms');
        setTimeout(initGlossaryItems, 200);
        return;
    }
    
    if (!window.ItemsDB) window.ItemsDB = { items: {} };
    
    let count = 0;
    
    // Оружие
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
                attacks: weapon.attacks || {},
                slots: slots
            };
            count++;
        }
    }
    
    // Броня
    if (typeof armorsData !== 'undefined') {
        for (const armorId in armorsData) {
            const armor = armorsData[armorId];
            const itemId = armorId;
            
            window.ItemsDB.items[itemId] = {
                id: itemId,
                name: armor.name,
                type: 'armor',
                armorClass: armor.armorClass || 10,
                slot: armor.slot || 'chest',
                durability: armor.durability || 0,
                description: armor.description || ''
            };
            count++;
        }
    }
    
    console.log(`✅ Загружено ${count} предметов в ItemsDB (оружие + броня)`);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlossaryItems);
} else {
    initGlossaryItems();
}
