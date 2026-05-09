// modules/battle/systems/5-ranged.js
if (!window.BattleModule) window.BattleModule = {};

// Специфические методы для дальнобойных атак
// Основная логика уже в 4-attacks.js (findRangedTargets, checkLineOfSight, getLinePoints)

// Проверка возможности выстрела (можно ли стрелять в цель)
BattleModule.canShoot = function(attackerPos, targetPos, maxRange = 50) {
    const distance = this.getHexDistance(attackerPos, targetPos);
    if (distance > maxRange) return false;
    
    const firstTarget = this.checkLineOfSight(attackerPos, targetPos);
    return firstTarget && firstTarget.col === targetPos.col && firstTarget.row === targetPos.row;
};
