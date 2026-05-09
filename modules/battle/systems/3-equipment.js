// modules/battle/systems/3-equipment.js
if (!window.BattleModule) window.BattleModule = {};

BattleModule.openEquipmentPanel = function(creatureId) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return;
    
    const oldPanel = document.getElementById('equipmentPanel');
    if (oldPanel) oldPanel.remove();
    
    const panel = document.createElement('div');
    panel.id = 'equipmentPanel';
    panel.style.cssText = `
        position: fixed; left: 700px; top: 100px; width: 400px;
        background: #3d2418; border: 3px solid #d4af37; border-radius: 10px;
        padding: 20px; color: #e0d0c0; z-index: 1002;
        box-shadow: 0 0 20px rgba(0,0,0,0.5); max-height: 80vh; display: flex;
        flex-direction: column;
    `;
    
    // Получаем список уникальных металлов из ItemsDB
    const allItems = (window.ItemsDB && window.ItemsDB.items) ? window.ItemsDB.items : {};
    const metalSet = new Set();
    Object.values(allItems).forEach(item => {
        if (item.metal) metalSet.add(item.metal);
    });
    const metalsList = Array.from(metalSet).sort();
    
    // Кнопки фильтров с прокруткой
    let filterHtml = '<div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 15px; max-height: 100px; overflow-y: auto; padding: 5px;">';
    filterHtml += '<button class="btn btn-small" onclick="BattleModule.currentMetalFilter = null; BattleModule.refreshEquipmentList()">Все</button>';
    metalsList.forEach(metalId => {
        let metalName = metalId;
        if (window.metalsData && window.metalsData[metalId]) {
            metalName = window.metalsData[metalId].name;
        }
        filterHtml += `<button class="btn btn-small" onclick="BattleModule.currentMetalFilter = '${metalId}'; BattleModule.refreshEquipmentList()">${metalName}</button>`;
    });
    filterHtml += '</div>';
    
    // Контейнер для списка предметов с прокруткой
    const itemsContainer = '<div id="equipmentItemsList" style="flex-grow: 1; overflow-y: auto; min-height: 300px; max-height: 400px;"></div>';
    
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
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-shrink: 0;">
            <h3 style="color: #d4af37; margin: 0;">🛡️ ЭКИПИРОВКА</h3>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #d4af37; font-size: 20px; cursor: pointer;">✖</button>
        </div>
        <div style="margin-bottom: 15px; flex-shrink: 0;">
            <button class="btn btn-minus" onclick="BattleModule.unequipWeapon('${creature.id}')">Снять оружие</button>
        </div>
        ${filterHtml}
        ${itemsContainer}
        ${arrowsHtml}
    `;
    
    document.body.appendChild(panel);
    
    // Сохраняем ID существа и показываем список
    BattleModule.currentEquipmentCreatureId = creature.id;
    BattleModule.currentMetalFilter = null;
    BattleModule.refreshEquipmentList();
};

BattleModule.refreshEquipmentList = function() {
    const container = document.getElementById('equipmentItemsList');
    if (!container) return;
    
    const allItems = (window.ItemsDB && window.ItemsDB.items) ? window.ItemsDB.items : {};
    let items = Object.values(allItems);
    
    // Фильтр по металлу
    if (BattleModule.currentMetalFilter) {
        items = items.filter(item => item.metal === BattleModule.currentMetalFilter);
    }
    
    // Разделяем на оружие и броню
    const weapons = items.filter(item => item.type === 'weapon');
    const armors = items.filter(item => item.type === 'armor');
    
    let html = '';
    
    // Оружие
    html += '<div style="margin-bottom: 20px;"><div style="color: #d4af37; font-weight: bold; margin-bottom: 10px;">⚔️ ОРУЖИЕ</div>';
    if (weapons.length === 0) {
        html += '<div style="color: #888; padding: 5px;">Нет оружия</div>';
    } else {
        weapons.forEach(item => {
            html += `
                <div style="background: #1a0f0b; margin-bottom: 8px; padding: 8px; border-radius: 4px; border: 1px solid #8b4513; display: flex; justify-content: space-between; align-items: center;">
                    <div><div style="font-weight: bold;">${item.name}</div><div style="font-size: 11px;">Урон: ${item.damage} | Прочность: ${item.durability}</div></div>
                    <button class="btn btn-small" onclick="BattleModule.equipWeapon('${BattleModule.currentEquipmentCreatureId}', '${item.id}')">Экип.</button>
                </div>
            `;
        });
    }
    html += '</div>';
    
    // Броня
    html += '<div><div style="color: #d4af37; font-weight: bold; margin-bottom: 10px;">🛡️ БРОНЯ</div>';
    if (armors.length === 0) {
        html += '<div style="color: #888; padding: 5px;">Нет брони</div>';
    } else {
        armors.forEach(item => {
            html += `
                <div style="background: #1a0f0b; margin-bottom: 8px; padding: 8px; border-radius: 4px; border: 1px solid #8b4513; display: flex; justify-content: space-between; align-items: center;">
                    <div><div style="font-weight: bold;">${item.name}</div><div style="font-size: 11px;">КБ: ${item.armorClass} | Прочность: ${item.durability}</div></div>
                    <button class="btn btn-small" onclick="BattleModule.equipArmor('${BattleModule.currentEquipmentCreatureId}', '${item.id}')">Экип.</button>
                </div>
            `;
        });
    }
    html += '</div>';
    
    container.innerHTML = html;
};

BattleModule.equipWeapon = function(creatureId, itemId) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return;
    if (!creature.equipment) creature.equipment = {};
    creature.equipment.weapon = itemId;
    const panel = document.getElementById('equipmentPanel');
    if (panel) panel.remove();
    if (this.openCreaturePanel) this.openCreaturePanel(creatureId);
};

BattleModule.equipArmor = function(creatureId, itemId) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return;
    if (!creature.equipment) creature.equipment = {};
    creature.equipment.armor = itemId;
    const panel = document.getElementById('equipmentPanel');
    if (panel) panel.remove();
    if (this.openCreaturePanel) this.openCreaturePanel(creatureId);
};

BattleModule.unequipWeapon = function(creatureId) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return;
    if (creature.equipment) {
        creature.equipment.weapon = null;
    }
    const panel = document.getElementById('equipmentPanel');
    if (panel) panel.remove();
    if (this.openCreaturePanel) this.openCreaturePanel(creatureId);
};

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
