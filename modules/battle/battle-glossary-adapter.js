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
    
    // Оружие (с металлами)
    for (const metalId in metalsData) {
        const metal = metalsData[metalId];
        for (const weaponId in weaponsData) {
            const weapon = weaponsData[weaponId];
            const slots = weapon.craft_slots || 1;
            const damage = (weapon.base_damage || 0) + metal.stats.durability;
            const durability = (weapon.base_durability || 0) + metal.stats.durability;
            const magic_potential = metal.stats.magic_potential * slots;
            const itemId = `${metalId}_${weaponId}`;
            
            let attacks = {};
            
            switch (weaponId) {
                case 'dagger':
                    attacks = {
                        slashing: { name: 'Рубящий', cost: 2, materialDamage: { [metalId]: damage } },
                        piercing: { name: 'Колющий', cost: 1, materialDamage: { [metalId]: damage } }
                    };
                    break;
                case 'sword':
                case 'two_handed_sword':
                case 'halberd':
                case 'guandao':
                    attacks = {
                        slashing: { name: 'Рубящий', cost: 2, materialDamage: { [metalId]: damage } },
                        piercing: { name: 'Колющий', cost: 1, materialDamage: { [metalId]: damage } }
                    };
                    break;
                case 'hammer':
                case 'axe':
                case 'hatchet':
                case 'mace':
                    attacks = { slashing: { name: 'Рубящий', cost: 2, materialDamage: { [metalId]: damage } } };
                    break;
                case 'throwing_dagger':
                case 'throwing_star':
                case 'throwing_axe':
                    attacks = { thrown: { name: 'Метание', cost: 1, materialDamage: { [metalId]: damage } } };
                    break;
                case 'bow':
                case 'crossbow':
                    attacks = { shoot: { name: 'Стрельба', cost: 1, materialDamage: { [metalId]: damage } } };
                    break;
                case 'spear':
                    attacks = { piercing: { name: 'Колющий', cost: 1, materialDamage: { [metalId]: damage } } };
                    break;
                default:
                    attacks = { slashing: { name: 'Рубящий', cost: 2, materialDamage: { [metalId]: damage } } };
            }
            
            window.ItemsDB.items[itemId] = {
                id: itemId,
                name: `${metal.name} ${weapon.name}`,
                type: 'weapon',
                damage: damage,
                durability: durability,
                magic_potential: magic_potential,
                attacks: attacks,
                slots: slots,
                metal: metalId
            };
            count++;
        }
    }
    
    // Броня (с металлами)
    for (const metalId in metalsData) {
        const metal = metalsData[metalId];
        for (const armorId in armorData) {
            const armor = armorData[armorId];
            const slots = armor.craft_slots || 1;
            const defense = (armor.base_defense || 0) + metal.stats.durability;
            const durability = (armor.base_durability || 0) + metal.stats.durability;
            const magic_potential = metal.stats.magic_potential * slots;
            const itemId = `${metalId}_${armorId}`;
            
            window.ItemsDB.items[itemId] = {
                id: itemId,
                name: `${metal.name} ${armor.name}`,
                type: 'armor',
                armorClass: defense,
                durability: durability,
                magic_potential: magic_potential,
                slot: armorId.includes('helmet') ? 'helmet' :
                      armorId.includes('gauntlets') ? 'gauntlets' :
                      armorId.includes('cuirass') ? 'chest' :
                      armorId.includes('greaves') ? 'greaves' :
                      armorId.includes('boots') ? 'boots' : 'chest',
                slots: slots,
                metal: metalId
            };
            count++;
        }
    }
    
    console.log(`✅ Загружено ${count} предметов в ItemsDB (оружие + броня с металлами)`);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlossaryItems);
} else {
    initGlossaryItems();
}
