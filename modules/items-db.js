// modules/items-db.js
const ItemsDB = {
    // База данных материалов
    materials: {
        'tin': { name: 'Олово', multiplier: 1 },
        'manganese': { name: 'Марганец', multiplier: 1 },
        'copper': { name: 'Медь', multiplier: 1 },
        'brass': { name: 'Латунь', multiplier: 1 },
        'bronze': { name: 'Бронза', multiplier: 1 },
        'melchior': { name: 'Мельхиор', multiplier: 1 },
        'iron': { name: 'Железо', multiplier: 1 },
        'steel': { name: 'Сталь', multiplier: 1 }
    },

    // База данных предметов
    items: {
        // Кинжал
        'dagger': {
            name: 'Кинжал',
            type: 'weapon',
            hands: 1,
            attacks: {
                slashing: { name: 'Рубящий', cost: 2, materialDamage: {
                    'tin': 5, 'manganese': 8, 'copper': 8, 'brass': 4,
                    'bronze': 10, 'melchior': 5, 'iron': 12, 'steel': 16
                }},
                piercing: { name: 'Колющий', cost: 1, materialDamage: {
                    'tin': 5, 'manganese': 8, 'copper': 8, 'brass': 4,
                    'bronze': 10, 'melchior': 5, 'iron': 12, 'steel': 16
                }}
            },
            description: 'Короткий клинок для ближнего боя'
        },

        // Меч одноручный
        'sword': {
            name: 'Меч',
            type: 'weapon',
            hands: 1,
            attacks: {
                slashing: { name: 'Рубящий', cost: 2, materialDamage: {
                    'tin': 7, 'manganese': 10, 'copper': 10, 'brass': 6,
                    'bronze': 12, 'melchior': 7, 'iron': 14, 'steel': 18
                }},
                piercing: { name: 'Колющий', cost: 1, materialDamage: {
                    'tin': 7, 'manganese': 10, 'copper': 10, 'brass': 6,
                    'bronze': 12, 'melchior': 7, 'iron': 14, 'steel': 18
                }}
            },
            description: 'Универсальный одноручный меч'
        },

        // Двуручный меч
        'twohanded_sword': {
            name: 'Двуручный меч',
            type: 'weapon',
            hands: 2,
            attacks: {
                slashing: { name: 'Рубящий', cost: 2, materialDamage: {
                    'tin': 11, 'manganese': 14, 'copper': 14, 'brass': 10,
                    'bronze': 16, 'melchior': 11, 'iron': 18, 'steel': 22
                }},
                piercing: { name: 'Колющий', cost: 1, materialDamage: {
                    'tin': 11, 'manganese': 14, 'copper': 14, 'brass': 10,
                    'bronze': 16, 'melchior': 11, 'iron': 18, 'steel': 22
                }}
            },
            description: 'Большой меч для двух рук'
        },

        // Молот
        'hammer': {
            name: 'Молот',
            type: 'weapon',
            hands: 2,
            attacks: {
                slashing: { name: 'Рубящий', cost: 2, materialDamage: {
                    'tin': 12, 'manganese': 15, 'copper': 15, 'brass': 11,
                    'bronze': 17, 'melchior': 12, 'iron': 19, 'steel': 23
                }}
            },
            description: 'Тяжёлый двуручный молот'
        },

        // Секира
        'broad_axe': {
            name: 'Секира',
            type: 'weapon',
            hands: 1,
            attacks: {
                slashing: { name: 'Рубящий', cost: 2, materialDamage: {
                    'tin': 12, 'manganese': 15, 'copper': 15, 'brass': 11,
                    'bronze': 17, 'melchior': 12, 'iron': 19, 'steel': 23
                }}
            },
            description: 'Широкое лезвие на древке'
        },

        // Топор
        'axe': {
            name: 'Топор',
            type: 'weapon',
            hands: 1,
            attacks: {
                slashing: { name: 'Рубящий', cost: 2, materialDamage: {
                    'tin': 8, 'manganese': 11, 'copper': 11, 'brass': 7,
                    'bronze': 13, 'melchior': 8, 'iron': 15, 'steel': 19
                }}
            },
            description: 'Одноручный топор'
        },

        // Булава
        'mace': {
            name: 'Булава',
            type: 'weapon',
            hands: 1,
            attacks: {
                slashing: { name: 'Рубящий', cost: 2, materialDamage: {
                    'tin': 14, 'manganese': 17, 'copper': 17, 'brass': 13,
                    'bronze': 19, 'melchior': 14, 'iron': 21, 'steel': 25
                }}
            },
            description: 'Дробящее оружие с шипами'
        },

        // Метательный кинжал
        'throwing_dagger': {
            name: 'Метательный кинжал',
            type: 'weapon',
            hands: 1,
            attacks: {
                thrown: { name: 'Метательный', cost: 1, materialDamage: {
                    'tin': 5, 'manganese': 8, 'copper': 8, 'brass': 4,
                    'bronze': 10, 'melchior': 5, 'iron': 12, 'steel': 16
                }}
            },
            throwable: true,
            description: 'Кинжал для метания'
        },

        // Метательная звездочка
        'throwing_star': {
            name: 'Метательная звездочка',
            type: 'weapon',
            hands: 1,
            attacks: {
                thrown: { name: 'Метательный', cost: 1, materialDamage: {
                    'tin': 6, 'manganese': 9, 'copper': 9, 'brass': 5,
                    'bronze': 11, 'melchior': 6, 'iron': 13, 'steel': 17
                }}
            },
            throwable: true,
            description: 'Звездочка для метания'
        },

        // Метательный топор
        'throwing_axe': {
            name: 'Метательный топор',
            type: 'weapon',
            hands: 1,
            attacks: {
                thrown: { name: 'Метательный', cost: 1, materialDamage: {
                    'tin': 9, 'manganese': 12, 'copper': 12, 'brass': 8,
                    'bronze': 14, 'melchior': 9, 'iron': 16, 'steel': 20
                }}
            },
            throwable: true,
            description: 'Небольшой топор для метания'
        },

        // Лук
        'bow': {
            name: 'Лук',
            type: 'weapon',
            hands: 2,
            attacks: {
                shoot: { name: 'Выстрел', cost: 1, materialDamage: {
                    'tin': 11, 'manganese': 14, 'copper': 14, 'brass': 10,
                    'bronze': 16, 'melchior': 11, 'iron': 18, 'steel': 22
                }}
            },
            ammoType: 'arrow',
            description: 'Дальнобойное оружие'
        },

        // Стрела
        'arrow': {
            name: 'Стрела',
            type: 'ammo',
            ammoFor: ['bow'],
            materialDamage: {
                'tin': 5, 'manganese': 8, 'copper': 8, 'brass': 4,
                'bronze': 10, 'melchior': 5, 'iron': 12, 'steel': 16
            },
            description: 'Боеприпас для лука'
        },

        // Копье
        'spear': {
            name: 'Копьё',
            type: 'weapon',
            hands: 2,
            attacks: {
                piercing: { name: 'Колющий', cost: 1, materialDamage: {
                    'tin': 8, 'manganese': 11, 'copper': 11, 'brass': 7,
                    'bronze': 13, 'melchior': 8, 'iron': 15, 'steel': 19
                }}
            },
            description: 'Длинное древковое оружие'
        },

        // Алебарда
        'halberd': {
            name: 'Алебарда',
            type: 'weapon',
            hands: 2,
            attacks: {
                slashing: { name: 'Рубящий', cost: 2, materialDamage: {
                    'tin': 10, 'manganese': 13, 'copper': 13, 'brass': 9,
                    'bronze': 15, 'melchior': 10, 'iron': 16, 'steel': 21
                }},
                piercing: { name: 'Колющий', cost: 1, materialDamage: {
                    'tin': 10, 'manganese': 13, 'copper': 13, 'brass': 9,
                    'bronze': 15, 'melchior': 10, 'iron': 16, 'steel': 21
                }}
            },
            description: 'Комбинированное древковое оружие'
        },

        // Гуаньдао
        'guandao': {
            name: 'Гуаньдао',
            type: 'weapon',
            hands: 2,
            attacks: {
                slashing: { name: 'Рубящий', cost: 2, materialDamage: {
                    'tin': 16, 'manganese': 19, 'copper': 19, 'brass': 15,
                    'bronze': 21, 'melchior': 16, 'iron': 23, 'steel': 27
                }},
                piercing: { name: 'Колющий', cost: 1, materialDamage: {
                    'tin': 16, 'manganese': 19, 'copper': 19, 'brass': 15,
                    'bronze': 21, 'melchior': 16, 'iron': 23, 'steel': 27
                }}
            },
            description: 'Китайское древковое оружие'
        }
    },
    
    // Получить предмет по ID
    get(id) {
        return this.items[id] || null;
    },
    
    // Получить материал по ID
    getMaterial(id) {
        return this.materials[id] || null;
    },
    
    // Рассчитать урон оружия с учетом материала
    calculateDamage(weaponId, materialId, attackType) {
        const weapon = this.get(weaponId);
        if (!weapon || !weapon.attacks[attackType]) return 0;
        
        const damageValue = weapon.attacks[attackType].materialDamage[materialId];
        return damageValue || 0;
    },
    
    // Рассчитать урон выстрела из лука (лук + стрела)
    calculateBowDamage(bowId, arrowId, materialId) {
        const bow = this.get(bowId);
        const arrow = this.get(arrowId);
        if (!bow || !arrow) return 0;
        
        const bowDamage = bow.attacks.shoot.materialDamage[materialId] || 0;
        const arrowDamage = arrow.materialDamage[materialId] || 0;
        
        return bowDamage + arrowDamage;
    },
    
    // Подсчитать общий класс брони из экипировки
    calculateAC(equipment) {
        let baseAC = 10;
        let hasArmor = false;
        
        if (equipment) {
            Object.values(equipment).forEach(itemId => {
                if (itemId) {
                    const item = this.get(itemId);
                    if (item && item.type === 'armor') {
                        if (item.slot === 'chest') {
                            baseAC = item.armorClass;
                            hasArmor = true;
                        } else if (item.slot === 'shield' && hasArmor) {
                            baseAC += item.armorClass;
                        }
                    }
                }
            });
        }
        
        return baseAC;
    }
};
