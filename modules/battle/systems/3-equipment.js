// modules/battle/systems/3-equipment.js
if (!window.BattleModule) window.BattleModule = {};

BattleModule.openEquipmentPanel = function(creatureId) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return;
    
    // Инициализируем инвентарь боеприпасов
    if (!creature.ammo) {
        creature.ammo = {
            arrow: 0,
            bolt: 0,
            throwing_dagger: 0,
            throwing_star: 0,
            throwing_axe: 0
        };
    }
    
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
        if (item.metal && item.type !== 'ammo') metalSet.add(item.metal);
    });
    const metalsList = Array.from(metalSet).sort();
    
    // Выпадающий список металлов
    let filterHtml = `
        <div style="margin-bottom: 15px; flex-shrink: 0;">
            <label style="color: #d4af37; margin-right: 10px;">Фильтр по металлу:</label>
            <select id="metalFilterSelect" style="background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513; padding: 5px 10px; border-radius: 4px;" onchange="BattleModule.currentMetalFilter = this.value === 'all' ? null : this.value; BattleModule.refreshEquipmentList()">
                <option value="all">Все металлы</option>
    `;
    metalsList.forEach(metalId => {
        let metalName = metalId;
        if (window.metalsData && window.metalsData[metalId]) {
            metalName = window.metalsData[metalId].name;
        }
        filterHtml += `<option value="${metalId}">${metalName}</option>`;
    });
    filterHtml += `</select></div>`;
    
    // Боеприпасы
    let ammoHtml = `
        <div style="background: #1a0f0b; margin-top: 15px; padding: 10px; border-radius: 4px; border: 1px solid #8b4513; flex-shrink: 0;">
            <div style="font-weight: bold; color: #d4af37; margin-bottom: 5px;">🏹 БОЕПРИПАСЫ</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                <div><span>Стрелы:</span> ${creature.ammo.arrow} 
                    <button class="btn btn-small" onclick="BattleModule.addAmmo('${creature.id}', 'arrow', 10)">+10</button>
                    <button class="btn btn-small" onclick="BattleModule.addAmmo('${creature.id}', 'arrow', 1)">+1</button>
                </div>
                <div><span>Болты:</span> ${creature.ammo.bolt}
                    <button class="btn btn-small" onclick="BattleModule.addAmmo('${creature.id}', 'bolt', 10)">+10</button>
                    <button class="btn btn-small" onclick="BattleModule.addAmmo('${creature.id}', 'bolt', 1)">+1</button>
                </div>
                <div><span>Мет. кинжалы:</span> ${creature.ammo.throwing_dagger}
                    <button class="btn btn-small" onclick="BattleModule.addAmmo('${creature.id}', 'throwing_dagger', 1)">+1</button>
                </div>
                <div><span>Мет. звёздочки:</span> ${creature.ammo.throwing_star}
                    <button class="btn btn-small" onclick="BattleModule.addAmmo('${creature.id}', 'throwing_star', 1)">+1</button>
                </div>
                <div><span>Мет. топоры:</span> ${creature.ammo.throwing_axe}
                    <button class="btn btn-small" onclick="BattleModule.addAmmo('${creature.id}', 'throwing_axe', 1)">+1</button>
                </div>
            </div>
        </div>
    `;
    
    const itemsContainer = '<div id="equipmentItemsList" style="flex-grow: 1; overflow-y: auto; min-height: 300px; margin-top: 10px;"></div>';
    
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-shrink: 0;">
            <h3 style="color: #d4af37; margin: 0;">🛡️ ЭКИПИРОВКА</h3>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #d4af37; font-size: 20px; cursor: pointer;">✖</button>
        </div>
        <div style="margin-bottom: 15px; flex-shrink: 0;">
            <button class="btn btn-minus" onclick="BattleModule.unequipWeapon('${creature.id}')">Снять оружие</button>
            <button class="btn btn-minus" onclick="BattleModule.unequipArmor('${creature.id}')">Снять броню</button>
        </div>
        ${filterHtml}
        ${itemsContainer}
        ${ammoHtml}
    `;
    
    document.body.appendChild(panel);
    
    BattleModule.currentEquipmentCreatureId = creature.id;
    BattleModule.currentMetalFilter = null;
    BattleModule.refreshEquipmentList();
};

BattleModule.addAmmo = function(creatureId, ammoType, amount) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return;
    if (!creature.ammo) creature.ammo = {};
    creature.ammo[ammoType] = (creature.ammo[ammoType] || 0) + amount;
    this.openEquipmentPanel(creatureId);
};

BattleModule.refreshEquipmentList = function() {
    const container = document.getElementById('equipmentItemsList');
    if (!container) return;
    
    const allItems = (window.ItemsDB && window.ItemsDB.items) ? window.ItemsDB.items : {};
    let items = Object.values(allItems).filter(item => item.type !== 'ammo');
    
    if (BattleModule.currentMetalFilter) {
        items = items.filter(item => item.metal === BattleModule.currentMetalFilter);
    }
    
    const weapons = items.filter(item => item.type === 'weapon');
    const armors = items.filter(item => item.type === 'armor');
    
    let html = '';
    
    html += '<div style="margin-bottom: 20px;"><div style="color: #d4af37; font-weight: bold; margin-bottom: 10px;">⚔️ ОРУЖИЕ</div>';
    weapons.forEach(item => {
        html += `
            <div style="background: #1a0f0b; margin-bottom: 8px; padding: 8px; border-radius: 4px; border: 1px solid #8b4513; display: flex; justify-content: space-between; align-items: center;">
                <div><div style="font-weight: bold;">${item.name}</div><div style="font-size: 11px;">Урон: ${item.damage} | Прочность: ${item.durability}</div></div>
                <button class="btn btn-small" onclick="BattleModule.equipWeapon('${BattleModule.currentEquipmentCreatureId}', '${item.id}')">Экип.</button>
            </div>
        `;
    });
    if (weapons.length === 0) html += '<div style="color: #888; padding: 5px;">Нет оружия</div>';
    html += '</div>';
    
    html += '<div><div style="color: #d4af37; font-weight: bold; margin-bottom: 10px;">🛡️ БРОНЯ</div>';
    armors.forEach(item => {
        html += `
            <div style="background: #1a0f0b; margin-bottom: 8px; padding: 8px; border-radius: 4px; border: 1px solid #8b4513; display: flex; justify-content: space-between; align-items: center;">
                <div><div style="font-weight: bold;">${item.name}</div><div style="font-size: 11px;">КБ: ${item.armorClass} | Прочность: ${item.durability}</div></div>
                <button class="btn btn-small" onclick="BattleModule.equipArmor('${BattleModule.currentEquipmentCreatureId}', '${item.id}')">Экип.</button>
            </div>
        `;
    });
    if (armors.length === 0) html += '<div style="color: #888; padding: 5px;">Нет брони</div>';
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
    if (creature.equipment) creature.equipment.weapon = null;
    const panel = document.getElementById('equipmentPanel');
    if (panel) panel.remove();
    if (this.openCreaturePanel) this.openCreaturePanel(creatureId);
};

BattleModule.unequipArmor = function(creatureId) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return;
    if (creature.equipment) creature.equipment.armor = null;
    const panel = document.getElementById('equipmentPanel');
    if (panel) panel.remove();
    if (this.openCreaturePanel) this.openCreaturePanel(creatureId);
};
