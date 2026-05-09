// modules/battle/systems/2-turn.js
if (!window.BattleModule) window.BattleModule = {};

// Обновление панели очередности ходов
BattleModule.updateTurnOrder = function() {
    const panel = document.getElementById('turnOrderPanel');
    const listDiv = document.getElementById('turnOrderList');
    if (!panel || !listDiv) return;
    
    const aliveCreatures = this.activeCreatures.filter(c => c.currentHp > 0);
    
    if (aliveCreatures.length === 0) {
        panel.style.display = 'none';
        return;
    }
    
    panel.style.display = 'flex';
    
    const sorted = [...aliveCreatures].sort((a, b) => b.currentInitiative - a.currentInitiative);
    this.turnOrder = sorted.map(c => c.id);
    
    let html = '';
    sorted.forEach((creature, index) => {
        const isCurrent = this.turnActive && index === this.currentTurnIndex;
        const bgColor = isCurrent ? '#5a9c4a' : '#1a0f0b';
        const idx = this.activeCreatures.findIndex(c => c.id === creature.id) + 1;
        let statusIcon = '';
        if (creature.isPreparingAttack) statusIcon = ' ⚔️';
        else if (creature.hasPreparedAttack) statusIcon = ' ⚡';
        
        html += `
            <div style="background: ${bgColor}; margin-bottom: 8px; padding: 8px; border-radius: 4px; border: 1px solid #8b4513; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 20px;">${creature.icon}</span>
                <div style="flex: 1;">
                    <div style="font-weight: bold; color: #d4af37;">${creature.name} #${idx}${statusIcon}</div>
                    <div style="font-size: 12px;">Инициатива: ${creature.currentInitiative}</div>
                </div>
                ${isCurrent ? '<span style="color: #ffffaa;">▶ ХОДИТ</span>' : ''}
            </div>
        `;
    });
    
    listDiv.innerHTML = html;
};

// Начать бой (активировать инициативу)
BattleModule.startInitiative = function() {
    const alive = this.activeCreatures.filter(c => c.currentHp > 0);
    if (alive.length === 0) return;
    
    this.turnActive = true;
    this.currentTurnIndex = 0;
    this.updateTurnOrder();
    this.drawGrid();
};

// Следующий ход
BattleModule.nextTurn = function() {
    if (!this.turnActive || this.turnOrder.length === 0) return;
    
    const currentId = this.turnOrder[this.currentTurnIndex];
    const currentCreature = this.activeCreatures.find(c => c.id === currentId);
    
    if (currentCreature && currentCreature.hasPreparedAttack) {
        return;
    }
    
    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.turnOrder.length;
    this.updateTurnOrder();
    this.drawGrid();
};

// Обновление инициативы существа
BattleModule.updateInitiative = function(creatureId) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return;
    
    const input = document.getElementById('initiativeInput');
    const newValue = parseInt(input.value);
    
    if (newValue && newValue > 0) {
        creature.currentInitiative = newValue;
        this.updateTurnOrder();
        this.drawGrid();
        if (this.openCreaturePanel) this.openCreaturePanel(creatureId);
    }
};
