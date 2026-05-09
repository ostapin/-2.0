// modules/battle/core/2-camera.js
if (!window.BattleModule) window.BattleModule = {};

// Центрирование камеры
BattleModule.centerView = function() {
    const hexWidth = this.hexSize * 1.732;
    const vertSpacing = this.hexSize * 1.5;
    const totalWidth = this.cols * hexWidth;
    const totalHeight = this.rows * vertSpacing;
    
    this.offsetX = (this.canvas.width / 2) - (totalWidth / 2) * this.scale;
    this.offsetY = (this.canvas.height / 2) - (totalHeight / 2) * this.scale;
    
    if (this.drawGrid) this.drawGrid();
};

// Зум колесиком
BattleModule.zoom = function(factor, mouseX, mouseY) {
    const oldScale = this.scale;
    this.scale *= factor;
    this.scale = Math.min(Math.max(this.scale, 0.3), 5);
    
    const worldX = (mouseX - this.offsetX) / oldScale;
    const worldY = (mouseY - this.offsetY) / oldScale;
    
    this.offsetX = mouseX - worldX * this.scale;
    this.offsetY = mouseY - worldY * this.scale;
    
    if (this.drawGrid) this.drawGrid();
    if (this.highlightSelected) this.highlightSelected();
    if (this.updateZoomDisplay) this.updateZoomDisplay();
};

BattleModule.zoomIn = function() {
    if (this.canvas) {
        this.zoom(1.1, this.canvas.width / 2, this.canvas.height / 2);
    }
};

BattleModule.zoomOut = function() {
    if (this.canvas) {
        this.zoom(0.9, this.canvas.width / 2, this.canvas.height / 2);
    }
};

BattleModule.updateZoomDisplay = function() {
    const zoomLevel = document.getElementById('battleZoomLevel');
    if (zoomLevel) {
        zoomLevel.textContent = Math.round(this.scale * 100) + '%';
    }
};

// Полный сброс
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
    if (this.centerView) this.centerView();
    if (this.drawGrid) this.drawGrid();
    if (this.updateCreaturesList) this.updateCreaturesList();
    if (this.updateTurnOrder) this.updateTurnOrder();
    if (this.updateZoomDisplay) this.updateZoomDisplay();
    
    const creaturePanel = document.getElementById('creaturePanel');
    if (creaturePanel) creaturePanel.remove();
    
    console.log('Полный сброс выполнен');
};
