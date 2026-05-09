// modules/battle/core/2-camera.js
// Управление камерой (зум, центр, сброс)

BattleModule.centerView = function() {
    const hexWidth = this.hexSize * 1.732;
    const vertSpacing = this.hexSize * 1.5;
    const totalWidth = this.cols * hexWidth;
    const totalHeight = this.rows * vertSpacing;
    
    this.offsetX = (this.canvas.width / 2) - (totalWidth / 2) * this.scale;
    this.offsetY = (this.canvas.height / 2) - (totalHeight / 2) * this.scale;
};

BattleModule.zoom = function(factor, mouseX, mouseY) {
    const oldScale = this.scale;
    this.scale *= factor;
    this.scale = Math.min(Math.max(this.scale, 0.3), 5);
    
    const worldX = (mouseX - this.offsetX) / oldScale;
    const worldY = (mouseY - this.offsetY) / oldScale;
    
    this.offsetX = mouseX - worldX * this.scale;
    this.offsetY = mouseY - worldY * this.scale;
    
    this.drawGrid();
    this.highlightSelected();
    this.updateZoomDisplay();
};

BattleModule.zoomIn = function() {
    this.zoom(1.1, this.canvas.width / 2, this.canvas.height / 2);
};

BattleModule.zoomOut = function() {
    this.zoom(0.9, this.canvas.width / 2, this.canvas.height / 2);
};

BattleModule.resetView = function() {
    this.activeCreatures = [];
    this.turnOrder = [];
    this.currentTurnIndex = -1;
    this.turnActive = false;
    this.selectedHex = null;
    this.moveModeActive = false;
    this.attackModeActive = false;
    this.rangedAttackModeActive = false;
    
    this.hexes.forEach(hex => {
        hex.creature = null;
        hex.creatureId = null;
        hex.object = null;
        hex.occupied = false;
    });
    
    this.scale = 1;
    this.centerView();
    
    this.drawGrid();
    this.updateCreaturesList();
    this.updateTurnOrder();
    this.updateZoomDisplay();
    
    const creaturePanel = document.getElementById('creaturePanel');
    if (creaturePanel) creaturePanel.remove();
    
    console.log('Полный сброс выполнен');
};

BattleModule.updateZoomDisplay = function() {
    const zoomLevel = document.getElementById('battleZoomLevel');
    if (zoomLevel) {
        zoomLevel.textContent = Math.round(this.scale * 100) + '%';
    }
};
