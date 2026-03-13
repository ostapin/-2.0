const armorData = {
    // Тяжелая броня
    helmet_heavy: {
        name: "Шлем (тяжелый)",
        base_defense: 10,
        base_durability: 15,
        craft_slots: 5,
        leather: 5
    },
    
    gauntlets_heavy: {
        name: "Перчатки (тяжелые)",
        base_defense: 8,
        base_durability: 14,
        craft_slots: 4,
        leather: 4
    },
    
    cuirass_heavy: {
        name: "Нагрудник (тяжелый)",
        base_defense: 20,
        base_durability: 20,
        craft_slots: 12,
        leather: 4
    },
    
    greaves_heavy: {
        name: "Поножи (тяжелые)",
        base_defense: 12,
        base_durability: 17,
        craft_slots: 8,
        leather: 2
    },
    
    boots_heavy: {
        name: "Сапоги (тяжелые)",
        base_defense: 10,
        base_durability: 14,
        craft_slots: 6,
        leather: 2
    },
    
    chainmail_heavy: {
        name: "Кольчуга (тяжелая)",
        base_defense: 8,
        base_durability: 12,
        craft_slots: 10,
        leather: 4
    },
    
    // Легкая броня
    helmet_light: {
        name: "Шлем (легкий)",
        base_defense: 6,
        base_durability: 4,
        craft_slots: 1,
        leather: 5
    },
    
    gauntlets_light: {
        name: "Перчатки (легкие)",
        base_defense: 5,
        base_durability: 4,
        craft_slots: 2,
        leather: 6
    },
    
    cuirass_light: {
        name: "Нагрудник (легкий)",
        base_defense: 10,
        base_durability: 8,
        craft_slots: 4,
        leather: 8
    },
    
    greaves_light: {
        name: "Поножи (легкие)",
        base_defense: 7,
        base_durability: 6,
        craft_slots: 2,
        leather: 4
    },
    
    boots_light: {
        name: "Сапоги (легкие)",
        base_defense: 6,
        base_durability: 4,
        craft_slots: 2,
        leather: 4
    },
    
    chainmail_light: {
        name: "Кольчуга (легкая)",
        base_defense: 4,
        base_durability: 10,
        craft_slots: 4,
        leather: 4
    }
};

// Для доступа из других модулей
if (typeof module !== 'undefined' && module.exports) {
    module.exports = armorData;
}
