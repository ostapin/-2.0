// modules/battle/systems/4-attacks.js
// Атаки, урон, подготовка, дальность

BattleModule.prepareAttack = function(creatureId, attackType) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature || creature.currentHp <= 0) return;
    
    if (this.turnActive && this.turnOrder[this.currentTurnIndex] !== creatureId) {
        alert('Сейчас не ход этого существа!');
        return;
    }
    
    // Если у существа уже есть подготовленная атака, используем её
    if (creature.hasPreparedAttack && creature.preparedAttackType === attackType) {
        const weapon = creature.equipment.weapon ? ItemsDB.get(creature.equipment.weapon) : null;
        if (!weapon) return;
        
        const attack = weapon.attacks[attackType];
        if (!attack) return;
        
        // Определяем тип атаки (ближняя или дальняя)
        if (attackType === 'shoot' || attackType === 'thrown') {
            this.activateRangedAttackMode(creatureId, attackType);
        } else {
            this.activateAttackMode(creatureId, attackType);
        }
        
        // Сбрасываем подготовку
        creature.hasPreparedAttack = false;
        creature.isPreparingAttack = false;
        creature.preparedAttackType = null;
        
        const panel = document.getElementById('creaturePanel');
        if (panel) panel.remove();
        
        return;
    }
    
    const weapon = creature.equipment.weapon ? ItemsDB.get(creature.equipment.weapon) : null;
    if (!weapon) {
        alert('Нет оружия!');
        return;
    }
    
    const attack = weapon.attacks[attackType];
    if (!attack) return;
    
    const panel = document.getElementById('creaturePanel');
    if (panel) panel.remove();
    
    if (attack.cost === 1) {
        // Атака в 1 ход - сразу выбираем цель
        if (attackType === 'shoot' || attackType === 'thrown') {
            this.activateRangedAttackMode(creatureId, attackType);
        } else {
            this.activateAttackMode(creatureId, attackType);
        }
    } else {
        // Атака в 2 хода - подготовка
        creature.isPreparingAttack = true;
        creature.hasPreparedAttack = false;
        creature.preparedAttackType = attackType;
        this.updateTurnOrder();
        this.drawGrid();
        
        if (this.turnActive) {
            this.nextTurn();
        }
    }
};

BattleModule.activateAttackMode = function(creatureId, attackType) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature || !creature.position) return;
    
    this.attackModeActive = true;
    this.rangedAttackModeActive = false;
    this.movingCreatureId = creatureId;
    this.preparedAttackType = attackType;
    
    this.availableAttackTargets = this.findAttackTargets(creature.position);
    this.availableRangedTargets = [];
    
    this.drawGrid();
};

BattleModule.activateRangedAttackMode = function(creatureId, attackType) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature || !creature.position) return;
    
    this.attackModeActive = false;
    this.rangedAttackModeActive = true;
    this.movingCreatureId = creatureId;
    this.preparedAttackType = attackType;
    
    this.availableRangedTargets = this.findRangedTargets(creature.position);
    this.availableAttackTargets = [];
    
    this.drawGrid();
};

BattleModule.findAttackTargets = function(position) {
    const targets = [];
    const currentHex = this.hexes.find(h => h.col === position.col && h.row === position.row);
    if (!currentHex) return targets;
    
    let neighbors = [];
    if (currentHex.row % 2 === 0) {
        neighbors = [
            { col: currentHex.col + 1, row: currentHex.row },
            { col: currentHex.col - 1, row: currentHex.row },
            { col: currentHex.col, row: currentHex.row - 1 },
            { col: currentHex.col - 1, row: currentHex.row - 1 },
            { col: currentHex.col, row: currentHex.row + 1 },
            { col: currentHex.col - 1, row: currentHex.row + 1 }
        ];
    } else {
        neighbors = [
            { col: currentHex.col + 1, row: currentHex.row },
            { col: currentHex.col - 1, row: currentHex.row },
            { col: currentHex.col + 1, row: currentHex.row - 1 },
            { col: currentHex.col, row: currentHex.row - 1 },
            { col: currentHex.col + 1, row: currentHex.row + 1 },
            { col: currentHex.col, row: currentHex.row + 1 }
        ];
    }
    
    neighbors.forEach(pos => {
        if (pos.col >= 0 && pos.col < this.cols && pos.row >= 0 && pos.row < this.rows) {
            const hex = this.hexes.find(h => h.col === pos.col && h.row === pos.row);
            if (hex && hex.creatureId) {
                const targetCreature = this.activeCreatures.find(c => c.id === hex.creatureId);
                if (targetCreature && targetCreature.currentHp > 0) {
                    targets.push(hex);
                }
            }
        }
    });
    
    return targets;
};

BattleModule.findRangedTargets = function(position) {
    const targets = [];
    const maxRange = 50;
    
    for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
            if (col === position.col && row === position.row) continue;
            
            const hex = this.hexes.find(h => h.col === col && h.row === row);
            if (!hex || !hex.creatureId) continue;
            
            const targetCreature = this.activeCreatures.find(c => c.id === hex.creatureId);
            if (!targetCreature || targetCreature.currentHp <= 0) continue;
            
            // Проверяем расстояние
            const distance = this.getHexDistance(position, {col, row});
            if (distance > maxRange) continue;
            
            // Проверяем линию видимости
            const firstTarget = this.checkLineOfSight(position, {col, row});
            if (firstTarget && firstTarget.col === col && firstTarget.row === row) {
                targets.push(hex);
            }
        }
    }
    
    return targets;
};

BattleModule.getHexDistance = function(pos1, pos2) {
    const dx = Math.abs(pos1.col - pos2.col);
    const dy = Math.abs(pos1.row - pos2.row);
    
    if (pos1.row % 2 === 0) {
        return Math.max(dx, dy);
    } else {
        return Math.max(dx, dy);
    }
};

BattleModule.checkLineOfSight = function(start, end) {
    const points = this.getLinePoints(start, end);
    
    for (let i = 1; i < points.length - 1; i++) {
        const point = points[i];
        const hex = this.hexes.find(h => h.col === point.col && h.row === point.row);
        
        if (hex && hex.object) {
            return null;
        }
        
        if (hex && hex.creatureId) {
            return hex;
        }
    }
    
    const endHex = this.hexes.find(h => h.col === end.col && h.row === end.row);
    return endHex;
};

BattleModule.getLinePoints = function(start, end) {
    const points = [];
    let x0 = start.col;
    let y0 = start.row;
    let x1 = end.col;
    let y1 = end.row;
    
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    
    while (true) {
        points.push({col: x0, row: y0});
        
        if (x0 === x1 && y0 === y1) break;
        
        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
    
    return points;
};

BattleModule.tryAttackTarget = function(targetHex) {
    if (!this.attackModeActive || !this.movingCreatureId) {
        this.attackModeActive = false;
        this.availableAttackTargets = [];
        this.drawGrid();
        return;
    }
    
    const isTarget = this.availableAttackTargets.some(h => h.col === targetHex.col && h.row === targetHex.row);
    
    if (isTarget) {
        const attacker = this.activeCreatures.find(c => c.id === this.movingCreatureId);
        const defender = this.activeCreatures.find(c => c.id === targetHex.creatureId);
        
        if (attacker && defender) {
            this.performAttack(attacker, defender, this.preparedAttackType);
        }
    }
    
    this.attackModeActive = false;
    this.movingCreatureId = null;
    this.preparedAttackType = null;
    this.availableAttackTargets = [];
    
    this.drawGrid();
    
    if (this.turnActive) {
        this.nextTurn();
    }
};

BattleModule.tryRangedAttack = function(targetHex) {
    if (!this.rangedAttackModeActive || !this.movingCreatureId) {
        this.rangedAttackModeActive = false;
        this.availableRangedTargets = [];
        this.drawGrid();
        return;
    }
    
    const isTarget = this.availableRangedTargets.some(h => h.col === targetHex.col && h.row === targetHex.row);
    
    if (isTarget) {
        const attacker = this.activeCreatures.find(c => c.id === this.movingCreatureId);
        const defender = this.activeCreatures.find(c => c.id === targetHex.creatureId);
        
        if (attacker && defender) {
            this.performAttack(attacker, defender, this.preparedAttackType);
        }
    }
    
    this.rangedAttackModeActive = false;
    this.movingCreatureId = null;
    this.preparedAttackType = null;
    this.availableRangedTargets = [];
    
    this.drawGrid();
    
    if (this.turnActive) {
        this.nextTurn();
    }
};

BattleModule.performAttack = function(attacker, defender, attackType) {
    const weapon = attacker.equipment.weapon ? ItemsDB.get(attacker.equipment.weapon) : null;
    if (!weapon) return;
    
    const attack = weapon.attacks[attackType];
    if (!attack) return;
    
    const material = attacker.equipment.weaponMaterial || 'steel';
    
    let damage = attack.materialDamage[material] || 0;
    
    if (weapon.ammoType === 'arrow' && attacker.equipment.arrows > 0) {
        const arrowDamage = ItemsDB.get('arrow').materialDamage[attacker.equipment.arrowMaterial || 'steel'] || 0;
        damage += arrowDamage;
        attacker.equipment.arrows--;
    }
    
    defender.currentHp = Math.max(0, defender.currentHp - damage);
    
    console.log(`${attacker.name} атакует ${defender.name} на ${damage} урона`);
    
    const hex = this.hexes.find(h => h.creatureId === defender.id);
    if (hex && defender.currentHp === 0) {
        console.log(`${defender.name} погиб!`);
        hex.creature = null;
        hex.creatureId = null;
        hex.occupied = false;
        this.updateTurnOrder();
    }
    
    this.drawGrid();
    this.updateCreaturesList();
};
