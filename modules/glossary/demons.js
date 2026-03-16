const demonsData = {
    general: {
        description: "Здесь будет общее описание демонов, их происхождение и легенды..."
    },
    
    traits: [
        "1. Особенность первая...",
        "2. Особенность вторая...",
        "3. Особенность третья..."
    ],
    
    groups: {
        // Здесь будут группы демонов
        lesser: {
            name: "Низшие демоны",
            creatures: {}
        },
        greater: {
            name: "Высшие демоны",
            creatures: {}
        },
        lords: {
            name: "Повелители демонов",
            creatures: {}
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = demonsData;
}
