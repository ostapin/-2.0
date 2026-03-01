// modules/creatures-db.js
const CreaturesDB = {
    // База данных существ
    list: {
        'human': {
            name: '👤 Человек',
            icon: '👤',
            hp: 100,
            maxHp: 100,
            ac: 12,
            speed: 6,
            description: 'Обычный человек'
        }
    },
    
    // Получить данные существа по ID
    get(id) {
        return this.list[id] || null;
    },
    
    // Получить копию существа для размещения на карте
    createForBattle(id) {
        const template = this.get(id);
        if (!template) return null;
        
        return {
            id: id,
            name: template.name,
            icon: template.icon,
            currentHp: template.hp,
            maxHp: template.maxHp,
            ac: template.ac,
            speed: template.speed
        };
    }
};
