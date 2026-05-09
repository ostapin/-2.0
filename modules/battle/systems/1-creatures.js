// modules/battle/systems/1-creatures.js
if (!window.BattleModule) window.BattleModule = {};

// Обновление списка существ на панели
BattleModule.updateCreaturesList = function() {
    const panel = document.getElementById('battleCreaturesPanel');
    const listDiv = document.getElementById('creaturesList');
    if (!panel || !listDiv) return;
    
    if (this.activeCreatures.length === 0) {
        panel.style.display = 'none';
        return;
    }
    
    panel.style.display = 'flex';
    
    let html = '';
    this.activeCreatures.forEach((creature, index) => {
        const isDead = creature.currentHp <= 0;
        const hpPercent = isDead ? 0 : (creature.currentHp / creature.maxHp) * 100;
        const hpColor = hpPercent > 50 ? '#00aa00' : (hpPercent > 20 ? '#aaaa00' : '#aa0000');
        let statusIcon = '';
        if (creature.isPreparingAttack) statusIcon = ' ⚔️';
        else if (creature.hasPreparedAttack) statusIcon = ' ⚡';
        
        html += `
            <div style="background: ${isDead ? '#330000' : '#1a0f0b'}; margin-bottom: 10px; padding: 10px; border-radius: 4px; border: 1px solid #8b4513; cursor: pointer; ${isDead ? 'opacity: 0.7;' : ''}" 
                 onclick="BattleModule.selectCreatureById('${creature.id}')"
                 ondblclick="BattleModule.openCreaturePanel('${creature.id}')">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 24px; ${isDead ? 'filter: grayscale(100%);' : ''}">${creature.icon}</span>
                    <div style="flex: 1;">
                        <div style="font-weight: bold; color: ${isDead ? '#aaaaaa' : '#d4af37'};">
                            ${creature.name} #${index + 1}${statusIcon} ${isDead ? '💀' : ''}
                        </div>
                        <div style="font-size: 12px; color: ${isDead ? '#888888' : '#e0d0c0'};">
                            HP: ${creature.currentHp}/${creature.maxHp} | Иниц: ${creature.currentInitiative}
                        </div>
                        ${!isDead ? `<div style="height: 4px; background: #330000; margin-top: 5px;"><div style="height: 4px; width: ${hpPercent}%; background: ${hpColor};"></div></div>` : ''}
                    </div>
                </div>
            </div>
        `;
    });
    
    listDiv.innerHTML = html;
};

// Выбор существа по ID
BattleModule.selectCreatureById = function(id) {
    const creature = this.activeCreatures.find(c => c.id === id);
    if (creature && creature.position) {
        const hex = this.hexes.find(h => h.col === creature.position.col && h.row === creature.position.row);
        if (hex && this.selectHex) this.selectHex(hex);
    }
};

// Размещение существа на гексе (режим расстановки)
BattleModule.placeOnHex = function(hex) {
    if (this.currentType === 'creature') {
        if (!hex.object && !hex.creature) {
            const creatureData = CreaturesDB.createForBattle(this.currentCreature);
            if (creatureData) {
                const creatureId = `${this.currentCreature}_${Date.now()}`;
                creatureData.id = creatureId;
                creatureData.templateId = this.currentCreature;
                creatureData.position = { col: hex.col, row: hex.row };
                creatureData.skills = { ...this.defaultSkills };
                creatureData.isPreparingAttack = false;
                creatureData.hasPreparedAttack = false;
                creatureData.preparedAttackType = null;
                creatureData.equipment = {
                    weapon: null, weaponMaterial: null, armor: null, shield: null,
                    helmet: null, boots: null, arrows: 0, arrowMaterial: 'steel'
                };
                
                this.activeCreatures.push(creatureData);
                hex.creature = this.currentCreature;
                hex.creatureId = creatureId;
                hex.occupied = true;
                
                if (this.updateCreaturesList) this.updateCreaturesList();
                if (this.updateTurnOrder) this.updateTurnOrder();
            }
        } else {
            alert('На этом гексе уже есть что-то!');
            return;
        }
    } else {
        if (!hex.creature && !hex.object) hex.object = this.currentObject;
        else {
            alert('На этом гексе уже есть что-то!');
            return;
        }
    }
    
    this.drawGrid();
    this.highlightSelected();
    if (this.updateHexInfo) this.updateHexInfo(hex);
};

// Удаление всего с гекса
BattleModule.eraseHex = function(hex) {
    if (hex.creatureId) {
        this.activeCreatures = this.activeCreatures.filter(c => c.id !== hex.creatureId);
    }
    
    hex.creature = null;
    hex.creatureId = null;
    hex.object = null;
    
    this.drawGrid();
    this.highlightSelected();
    if (this.updateHexInfo) this.updateHexInfo(hex);
    if (this.updateCreaturesList) this.updateCreaturesList();
    if (this.updateTurnOrder) this.updateTurnOrder();
    
    const panel = document.getElementById('creaturePanel');
    if (panel) panel.remove();
};

// Нанесение урона существу
BattleModule.damageCreature = function(creatureId, amount) {
    amount = parseInt(amount) || 0;
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return;
    
    creature.currentHp = Math.max(0, creature.currentHp - amount);
    
    if (creature.currentHp === 0) {
        creature.isPreparingAttack = false;
        creature.hasPreparedAttack = false;
        const hex = this.hexes.find(h => h.creatureId === creature.id);
        if (hex) {
            hex.creature = null;
            hex.creatureId = null;
            hex.occupied = false;
        }
        if (this.updateTurnOrder) this.updateTurnOrder();
        const panel = document.getElementById('creaturePanel');
        if (panel) panel.remove();
    }
    
    this.drawGrid();
    if (this.updateCreaturesList) this.updateCreaturesList();
    if (this.updateTurnOrder) this.updateTurnOrder();
    
    const panel = document.getElementById('creaturePanel');
    if (panel && panel.innerHTML.includes(creatureId) && this.openCreaturePanel) {
        this.openCreaturePanel(creatureId);
    }
};

// Лечение существа
BattleModule.healCreature = function(creatureId, amount) {
    amount = parseInt(amount) || 0;
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature || creature.currentHp <= 0) return;
    
    creature.currentHp = Math.min(creature.maxHp, creature.currentHp + amount);
    
    this.drawGrid();
    if (this.updateCreaturesList) this.updateCreaturesList();
    if (this.updateTurnOrder) this.updateTurnOrder();
    
    const panel = document.getElementById('creaturePanel');
    if (panel && this.openCreaturePanel) this.openCreaturePanel(creatureId);
};
