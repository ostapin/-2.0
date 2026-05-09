// modules/battle/systems/5-ranged.js
// Дальнобойные атаки (лук, арбалет, метательное)

// findRangedTargets уже есть в 4-attacks.js, но для порядка перенесём сюда методы дальности

BattleModule.activateRangedAttackMode = function(creatureId, attackType) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature || !creature.position) return;
    
    this.attackModeActive = false;
    this.rangedAttackModeActive = true;
    this.movingCreatureId = creatureId;
    this.preparedAttackType = attackType;
    
    // Для лука проверяем наличие стрел
    const weapon = creature.equipment.weapon ? ItemsDB.get(creature.equipment.weapon) : null;
    if (weapon && weapon.ammoType === 'arrow' && creature.equipment.arrows <= 0) {
        alert('Нет стрел!');
        this.rangedAttackModeActive = false;
        return;
    }
    
    this.availableRangedTargets = this.findRangedTargets(creature.position);
    this.availableAttackTargets = [];
    
    this.drawGrid();
};

BattleModule.getHexDistance = function(pos1, pos2) {
    const dx = Math.abs(pos1.col - pos2.col);
    const dy = Math.abs(pos1.row - pos2.row);
    
    // Для гексагональной сетки с острым верхом
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
        
        // Объект блокирует обзор
        if (hex && hex.object) {
            return null;
        }
        
        // Другое существо блокирует обзор (нельзя стрелять сквозь)
        if (hex && hex.creatureId && hex.creatureId !== this.movingCreatureId) {
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

// Добавим метод для проверки возможности выстрела
BattleModule.canShoot = function(attackerPos, targetPos, maxRange = 50) {
    const distance = this.getHexDistance(attackerPos, targetPos);
    if (distance > maxRange) return false;
    
    const firstTarget = this.checkLineOfSight(attackerPos, targetPos);
    return firstTarget && firstTarget.col === targetPos.col && firstTarget.row === targetPos.row;
};
