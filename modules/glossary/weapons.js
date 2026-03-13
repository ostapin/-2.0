const weaponsData = {
    // ID: { name, base_damage, base_durability, craft_slots, special }
    
    dagger: {
        name: "Кинжал",
        base_damage: 1,
        base_durability: 4,
        craft_slots: 1,
        leather: 1
    },
    
    sword: {
        name: "Меч",
        base_damage: 3,
        base_durability: 5,
        craft_slots: 2,
        leather: 5
    },
    
    two_handed_sword: {
        name: "Двуручный меч",
        base_damage: 7,
        base_durability: 7,
        craft_slots: 4,
        leather: 3
    },
    
    hammer: {
        name: "Молот",
        base_damage: 8,
        base_durability: 9,
        craft_slots: 5,
        leather: 4
    },
    
    axe: {
        name: "Секира",
        base_damage: 8,
        base_durability: 7,
        craft_slots: 5,
        leather: 4
    },
    
    hatchet: {
        name: "Топор",
        base_damage: 4,
        base_durability: 5,
        craft_slots: 2,
        leather: 2
    },
    
    mace: {
        name: "Булава",
        base_damage: 10,
        base_durability: 3,
        craft_slots: 3,
        leather: 2
    },
    
    throwing_dagger: {
        name: "Метательный кинжал",
        base_damage: 1,
        base_durability: 1,
        craft_slots: 1,
        note: "На 3 кинжала",
        multiply: 3
    },
    
    throwing_star: {
        name: "Метательная звездочка",
        base_damage: 2,
        base_durability: 1,
        craft_slots: 1,
        note: "На 4 звездочки",
        multiply: 4
    },
    
    throwing_axe: {
        name: "Метательный топор",
        base_damage: 5,
        base_durability: 3,
        craft_slots: 1,
        leather: 1
    },
    
    bow: {
        name: "Лук",
        base_damage: 7,
        base_durability: 6,
        craft_slots: 1,
        need_string: true
    },
    
    crossbow: {
        name: "Арбалет",
        base_damage: 0,
        base_durability: 0,
        craft_slots: 1,
        need_string: true,
        leather: 2,
        need_mechanisms: true
    },
    
    arrow: {
        name: "Стрела",
        base_damage: 1,
        base_durability: 1,
        craft_slots: 1,
        note: "На 10 наконечников",
        multiply: 10,
        need_wood: 10,
        need_feathers: 10
    },
    
    bolt: {
        name: "Болт",
        base_damage: 2,
        base_durability: 1,
        craft_slots: 1,
        note: "На 10 болтов",
        multiply: 10,
        need_wood: 10,
        need_feathers: 10
    },
    
    spear: {
        name: "Копьё",
        base_damage: 4,
        base_durability: 5,
        craft_slots: 2,
        need_wood: 1
    },
    
    halberd: {
        name: "Алебарда",
        base_damage: 6,
        base_durability: 7,
        craft_slots: 3,
        need_wood: 1
    },
    
    guandao: {
        name: "Гуаньдао",
        base_damage: 12,
        base_durability: 4,
        craft_slots: 6,
        need_wood: 1
    }
};

// Для доступа из других модулей
if (typeof module !== 'undefined' && module.exports) {
    module.exports = weaponsData;
}
