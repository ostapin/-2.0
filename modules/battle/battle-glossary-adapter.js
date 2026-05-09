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
    if (typeof armorData !== 'undefined') {
        for (const armorId in armorData) {
            const armor = armorData[armorId];
            const itemId = armorId;
            
            window.ItemsDB.items[itemId] = {
                id: itemId,
                name: armor.name,
                type: 'armor',
                armorClass: armor.base_defense + (armor.material ? armor.material.stats.durability : 0),
                slot: armorId.includes('helmet') ? 'helmet' :
                      armorId.includes('gauntlets') ? 'gauntlets' :
                      armorId.includes('cuirass') ? 'chest' :
                      armorId.includes('greaves') ? 'greaves' :
                      armorId.includes('boots') ? 'boots' : 'chest',
                durability: armor.base_durability || 0
            };
            count++;
        }
    } else {
        console.warn('armorData не найдена');
    }
    
    console.log(`✅ Загружено ${count} предметов в ItemsDB (оружие + броня)`);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlossaryItems);
} else {
    initGlossaryItems();
}
