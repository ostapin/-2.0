// modules/battle/core/1-grid.js
// Генерация гексагональной сетки

BattleModule.generateHexGrid = function(cols, rows) {
    const oldHexes = [...this.hexes];
    
    this.hexes = [];
    const hexWidth = this.hexSize * 1.732;
    const vertSpacing = this.hexSize * 1.5;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const xOffset = (row % 2) * (hexWidth / 2);
            const x = col * hexWidth + xOffset;
            const y = row * vertSpacing;
            
            const oldHex = oldHexes.find(h => h.col === col && h.row === row);
            
            this.hexes.push({
                x, y,
                col, row,
                occupied: oldHex ? oldHex.occupied : false,
                creature: oldHex ? oldHex.creature : null,
                creatureId: oldHex ? oldHex.creatureId : null,
                object: oldHex ? oldHex.object : null
            });
        }
    }
    
    this.activeCreatures.forEach(creature => {
        if (creature.position) {
            const hex = this.hexes.find(h => 
                h.col === creature.position.col && 
                h.row === creature.position.row
            );
            if (hex) {
                hex.creature = creature.templateId;
                hex.creatureId = creature.id;
                hex.occupied = true;
            }
        }
    });
};
