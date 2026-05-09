// modules/battle/systems/3-equipment.js
if (!window.BattleModule) window.BattleModule = {};

// Открытие панели экипировки
BattleModule.openEquipmentPanel = function(creatureId) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return;
    
    const oldPanel = document.getElementById('equipmentPanel');
    if (oldPanel) oldPanel.remove();
    
    const panel = document.createElement('div');
    panel.id = 'equipmentPanel';
    panel.style.cssText = `
        position: fixed; left: 700px; top: 100px; width: 350px;
        background: #3d2418; border: 3px solid #d4af37; border-radius: 10px;
        padding: 20px; color: #e0d0c0; z-index: 1002;
        box-shadow: 0 0 20px rgba(0,0,0,0.5); max-height: 80vh; overflow-y: auto;
    `;
    
    const allItems = (window.ItemsDB && window.ItemsDB.items) ? window.ItemsDB.items : {};
    const weaponsList = Object.values(allItems).filter(item => item && item.type === 'weapon');
    const armorsList = Object.values(allItems).filter(item => item && item.type === 'armor');
    
    // Оружие
    let weaponsHtml = '<div style="margin-bottom: 20px;"><div style="color: #d4af37; font-weight: bold; margin-bottom: 10px;">⚔️ ОРУЖИЕ</div>';
    if (weaponsList.length === 0) {
        weaponsHtml += '<div style="color: #ff8888;">Нет оружия в базе</div>';
    } else {
        weaponsList.forEach(item => {
            weaponsHtml += `
                <div style="background: #1a0f0b; margin-bottom: 10px; padding: 10px; border-radius: 4px; border: 1px solid #8b4513;">
                    <div style="font-weight: bold; color: #d4af37;">${item.name || 'Без имени'}</div>
                    <div style="font-size: 12px;">Урон: ${item.damage || 0} | Прочность: ${item.durability || 0}</div>
                    <button class="btn btn-small" style="margin-top: 5px;" onclick="BattleModule.equipWeapon('${creature.id}', '${item.id}')">Экипировать</button>
                </div>
            `;
        });
    }
    weaponsHtml += '</div>';
    
    // Броня
    let armorsHtml = '<div><div style="color: #d4af37; font-weight: bold; margin-bottom: 10px;">🛡️ БРОНЯ</div>';
    if (armorsList.length === 0) {
        armorsHtml += '<div style="color: #ff8888;">Нет брони в базе</div>';
    } else {
        armorsList.forEach(item => {
            armorsHtml += `
                <div style="background: #1a0f0b; margin-bottom: 10px; padding: 10px; border-radius: 4px; border: 1px solid #8b4513;">
                    <div style="font-weight: bold; color: #d4af37;">${item.name || 'Без имени'}</div>
                    <div style="font-size: 12px;">Класс брони: ${item.armorClass || 0} | Слот: ${item.slot || 'chest'}</div>
                    <button class="btn btn-small" style="margin-top: 5px;" onclick="BattleModule.equipArmor('${creature.id}', '${item.id}')">Экипировать</button>
                </div>
            `;
        });
    }
    armorsHtml += '</div>';
    
    // Стрелы
    const arrowsHtml = `
        <div style="background: #1a0f0b; margin-top: 15px; padding: 10px; border-radius: 4px; border: 1px solid #8b4513;">
            <div style="font-weight: bold; color: #d4af37; margin-bottom: 5px;">🏹 СТРЕЛЫ</div>
            <div style="display: flex; gap: 10px; align-items: center;">
                <input type="number" id="arrowCount" value="${creature.equipment?.arrows || 10}" min="1" max="100" style="width: 80px; padding: 6px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513;">
                <button class="btn btn-roll" onclick="BattleModule.equipArrows('${creature.id}')">Добавить стрелы</button>
            </div>
        </div>
    `;
    
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h3 style="color: #d4af37; margin: 0;">🛡️ ЭКИПИРОВКА</h3>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #d4af37; font-size: 20px; cursor: pointer;">✖</button>
        </div>
        <div style="margin-bottom: 15px;">
            <button class="btn btn-minus" style="width: 100%; padding: 8px;" onclick="BattleModule.unequipAll('${creature.id}')">Снять всё</button>
        </div>
        ${weaponsHtml}
        ${armorsHtml}
        ${arrowsHtml}
    `;
    
    document.body.appendChild(panel);
};

// Экипировка оружия
BattleModule.equipWeapon = function(creatureId, itemId) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return;
    if (!creature.equipment) creature.equipment = {};
    creature.equipment.weapon = itemId;
    const panel = document.getElementById('equipmentPanel');
    if (panel) panel.remove();
    if (this.openCreaturePanel) this.openCreaturePanel(creatureId);
};

// Экипировка брони
BattleModule.equipArmor = function(creatureId, itemId) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return;
    if (!creature.equipment) creature.equipment = {};
    const item = window.ItemsDB?.items[itemId];
    if (item && item.slot) {
        creature.equipment[item.slot] = itemId;
    }
    const panel = document.getElementById('equipmentPanel');
    if (panel) panel.remove();
    if (this.openCreaturePanel) this.openCreaturePanel(creatureId);
};

// Добавление стрел
BattleModule.equipArrows = function(creatureId) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return;
    const countInput = document.getElementById('arrowCount');
    if (!creature.equipment) creature.equipment = {};
    creature.equipment.arrows = parseInt(countInput?.value) || 10;
    const panel = document.getElementById('equipmentPanel');
    if (panel) panel.remove();
    if (this.openCreaturePanel) this.openCreaturePanel(creatureId);
};

// Снять всё оружие и броню
BattleModule.unequipAll = function(creatureId) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return;
    if (creature.equipment) {
        creature.equipment.weapon = null;
        creature.equipment.chest = null;
        creature.equipment.shield = null;
        creature.equipment.helmet = null;
        creature.equipment.boots = null;
    }
    const panel = document.getElementById('equipmentPanel');
    if (panel) panel.remove();
    if (this.openCreaturePanel) this.openCreaturePanel(creatureId);
};
