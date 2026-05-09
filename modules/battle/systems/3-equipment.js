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
        position: fixed; left: 700px; top: 100px; width: 400px;
        background: #3d2418; border: 3px solid #d4af37; border-radius: 10px;
        padding: 20px; color: #e0d0c0; z-index: 1002;
        box-shadow: 0 0 20px rgba(0,0,0,0.5); max-height: 80vh; display: flex;
        flex-direction: column;
    `;
    
    // Получаем все предметы
    const allItems = (window.ItemsDB && window.ItemsDB.items) ? window.ItemsDB.items : {};
    
    // Группируем по металлам
    const metals = {};
    Object.values(allItems).forEach(item => {
        if (item.metal) {
            if (!metals[item.metal]) metals[item.metal] = [];
            metals[item.metal].push(item);
        }
    });
    
    // Создаём HTML с вкладками по металлам
    let metalsHtml = '<div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 15px;">';
    for (const metalId in metals) {
        const metalName = metalsData[metalId]?.name || metalId;
        metalsHtml += `<button class="btn btn-small" onclick="BattleModule.filterEquipment('${metalId}')">${metalName}</button>`;
    }
    metalsHtml += `<button class="btn btn-small" onclick="BattleModule.filterEquipment('all')">Все</button></div>`;
    
    // Контейнер для предметов
    const itemsContainer = '<div id="equipmentItemsList" style="flex-grow: 1; overflow-y: auto; min-height: 300px;"></div>';
    
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
        ${metalsHtml}
        ${itemsContainer}
        ${arrowsHtml}
    `;
    
    document.body.appendChild(panel);
    
    // Показываем все предметы по умолчанию
    BattleModule.filterEquipment('all', creature.id);
};

// Фильтрация предметов по металлу
BattleModule.filterEquipment = function(metalId, creatureId) {
    const container = document.getElementById('equipmentItemsList');
    if (!container) return;
    
    const allItems = (window.ItemsDB && window.ItemsDB.items) ? window.ItemsDB.items : {};
    
    let filteredItems = Object.values(allItems);
    if (metalId !== 'all') {
        filteredItems = filteredItems.filter(item => item.metal === metalId);
    }
    
    // Разделяем на оружие и броню
    const weapons = filteredItems.filter(item => item.type === 'weapon');
    const armors = filteredItems.filter(item => item.type === 'armor');
    
    let html = '';
    
    // Оружие
    html += '<div style="margin-bottom: 20px;"><div style="color: #d4af37; font-weight: bold; margin-bottom: 10px;">⚔️ ОРУЖИЕ</div>';
    if (weapons.length === 0) {
        html += '<div style="color: #ff8888;">Нет оружия</div>';
    } else {
        weapons.forEach(item => {
            html += `
                <div style="background: #1a0f0b; margin-bottom: 8px; padding: 8px; border-radius: 4px; border: 1px solid #8b4513; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: bold; color: #d4af37;">${item.name}</div>
                        <div style="font-size: 11px;">Урон: ${item.damage} | Прочность: ${item.durability}</div>
                    </div>
                    <button class="btn btn-small" onclick="BattleModule.equipWeapon('${creatureId || BattleModule.selectedCreatureId}', '${item.id}')">Экип.</button>
                </div>
            `;
        });
    }
    html += '</div>';
    
    // Броня
    html += '<div><div style="color: #d4af37; font-weight: bold; margin-bottom: 10px;">🛡️ БРОНЯ</div>';
    if (armors.length === 0) {
        html += '<div style="color: #ff8888;">Нет брони</div>';
    } else {
        armors.forEach(item => {
            html += `
                <div style="background: #1a0f0b; margin-bottom: 8px; padding: 8px; border-radius: 4px; border: 1px solid #8b4513; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: bold; color: #d4af37;">${item.name}</div>
                        <div style="font-size: 11px;">КБ: ${item.armorClass} | Прочность: ${item.durability}</div>
                    </div>
                    <button class="btn btn-small" onclick="BattleModule.equipArmor('${creatureId || BattleModule.selectedCreatureId}', '${item.id}')">Экип.</button>
                </div>
            `;
        });
    }
    html += '</div>';
    
    container.innerHTML = html;
};

// Сохраняем ID существа для фильтрации
BattleModule.selectedCreatureId = null;

// Обновляем openEquipmentPanel, чтобы сохранять ID
BattleModule.openEquipmentPanel = function(creatureId) {
    this.selectedCreatureId = creatureId;
    // ... остальной код openEquipmentPanel (как выше)
};

// Остальные методы (equipWeapon, equipArmor, equipArrows, unequipAll) остаются без изменений
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
    const item = window.ItemsDB?.items[itemId];
    if (item && item.slot) {
        creature.equipment[item.slot] = itemId;
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
