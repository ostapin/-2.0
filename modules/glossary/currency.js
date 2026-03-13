const currencyData = {
    copper: {
        id: "copper",
        name: "Медные",
        base_value: 1,
        order: 1
    },
    silver: {
        id: "silver",
        name: "Серебряные",
        base_value: 100,
        order: 2
    },
    gold: {
        id: "gold",
        name: "Золотые",
        base_value: 10000,
        order: 3
    },
    platinum: {
        id: "platinum",
        name: "Платиновые",
        base_value: 10000000,
        order: 4
    },
    amber_sphere: {
        id: "amber_sphere",
        name: "Сфера (янтарная)",
        base_value: 10000000000,
        order: 5
    },
    blood_sphere: {
        id: "blood_sphere",
        name: "Сфера (Крови)",
        base_value: 10000000000000,
        order: 6
    },
    ice_sphere: {
        id: "ice_sphere",
        name: "Сфера (Льда)",
        base_value: 10000000000000000,
        order: 7
    },
    fire_sphere: {
        id: "fire_sphere",
        name: "Сфера (Огня)",
        base_value: 10000000000000000000,
        order: 8
    },
    earth_sphere: {
        id: "earth_sphere",
        name: "Сфера (Земли)",
        base_value: 10000000000000000000000,
        order: 9
    },
    water_sphere: {
        id: "water_sphere",
        name: "Сфера (Воды)",
        base_value: 10000000000000000000000000,
        order: 10
    },
    lightning_sphere: {
        id: "lightning_sphere",
        name: "Сфера (Молнии)",
        base_value: 10000000000000000000000000000,
        order: 11
    },
    colorless_ether: {
        id: "colorless_ether",
        name: "Кристалл эфира (Бесцветный)",
        base_value: 10000000000000000000000000000000,
        order: 12
    },
    colored_ether: {
        id: "colored_ether",
        name: "Кристалл эфира (цветной)",
        base_value: 100000000000000000000000000000000,
        order: 13
    }
};

// Для доступа из других модулей
if (typeof module !== 'undefined' && module.exports) {
    module.exports = currencyData;
}
