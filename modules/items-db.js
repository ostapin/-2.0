// modules/items-db.js
const ItemsDB = {
    // База данных предметов
    items: {
        // Броня
        'leather_armor': {
            name: '🟫 Кожаная броня',
            type: 'armor',
            armorClass: 11,
            slot: 'chest',
            description: 'Лёгкая броня из кожи'
        },
        'chainmail': {
            name: '⛓️ Кольчуга',
            type: 'armor',
            armorClass: 13,
            slot: 'chest',
            description: 'Средняя броня из металлических колец'
        },
        'plate_armor': {
            name: '🛡️ Латы',
            type: 'armor',
            armorClass: 16,
            slot: 'chest',
            description: 'Тяжёлая пластинчатая броня'
        },
        'shield': {
            name: '🛡️ Щит',
            type: 'armor',
            armorClass: 2,
            slot: 'shield',
            description: 'Дополнительная защита'
        },
        
        // Оружие
        'dagger': {
            name: '🔪 Кинжал',
            type: 'weapon',
            damage: '1d4',
            hands: 1,
            slot: 'weapon',
            description: 'Маленькое колющее оружие'
        },
        'sword': {
            name: '⚔️ Меч',
            type: 'weapon',
            damage: '1d8',
            hands: 1,
            slot: 'weapon',
            description: 'Универсальное оружие'
        },
        'axe': {
            name: '🪓 Топор',
            type: 'weapon',
            damage: '1d8',
            hands: 1,
            slot: 'weapon',
            description: 'Рубящее оружие'
        },
        'bow': {
            name: '🏹 Лук',
            type: 'weapon',
            damage: '1d6',
            hands: 2,
            slot: 'weapon',
            description: 'Дальнобойное оружие'
        },
        'staff': {
            name: '🪄 Посох',
            type: 'weapon',
            damage: '1d4',
            hands: 2,
            slot: 'weapon',
            description: 'Магический фокус'
        }
    },
    
    // Получить предмет по ID
    get(id) {
        return this.items[id] || null;
    },
    
    // Подсчитать общий класс брони из экипировки
    calculateAC(equipment) {
        let baseAC = 10; // Базовая броня без ничего
        let hasArmor = false;
        
        if (equipment) {
            Object.values(equipment).forEach(itemId => {
                if (itemId) {
                    const item = this.get(itemId);
                    if (item && item.type === 'armor') {
                        if (item.slot === 'chest') {
                            baseAC = item.armorClass; // Броня заменяет базовый AC
                            hasArmor = true;
                        } else if (item.slot === 'shield' && hasArmor) {
                            baseAC += item.armorClass; // Щит добавляет к броне
                        }
                    }
                }
            });
        }
        
        return baseAC;
    }
};
