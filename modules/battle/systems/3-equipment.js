// modules/battle/systems/3-equipment.js
if (!window.BattleModule) window.BattleModule = {};

BattleModule.openEquipmentPanel = function(creatureId) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return;
    
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
        position: fixed; left: 700px; top: 80px; width: 450px;
        background: #3d2418; border: 3px solid #d4af37; border-radius: 10px;
        padding: 15px; color: #e0d0c0; z-index: 1002;
        box-shadow: 0 0 20px rgba(0,0,0,0.5); max-height: 85vh; display: flex;
        flex-direction: column;
    `;
    
    // Получаем список металлов из ItemsDB
    const allItems = (window.ItemsDB && window.ItemsDB.items) ? window.ItemsDB.items : {};
    const metalSet = new Set();
    Object.values(allItems).forEach(item => {
        if (item.metal && item.type !== 'ammo') metalSet.add(item.metal);
    });
    const metalsList = Array.from(metalSet).sort();
    
    // Выпадающий список металлов
    let filterHtml = `
        <div style="margin-bottom: 10px; flex-shrink: 0; display: flex; gap: 10px; align-items: center;">
            <label style="color: #d4af37;">Фильтр по металлу:</label>
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
    
    // Боеприпасы (сверху, компактно)
    let ammoHtml = `
        <div style="background: #1a0f0b; margin-bottom: 10px; padding: 8px; border-radius: 4px; border: 1px solid #8b4513; flex-shrink: 0;">
            <div style="font-weight: bold; color: #d4af37; margin-bottom: 8px;">🏹 БОЕПРИПАСЫ</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span>🏹 Стрелы:</span>
                    <div>
                        <button class="btn btn-small" onclick="BattleModule.addAmmo('${creature.id}', 'arrow', -10)" style="font-size: 10px;">-10</button>
                        <span style="min-width: 35px; text-align: center; display: inline-block;">${creature.ammo.arrow}</span>
                        <button class="btn btn-small" onclick="BattleModule.addAmmo('${creature.id}', 'arrow', 10)" style="font-size: 10px;">+10</button>
                        <button class="btn btn-small" onclick="BattleModule.addAmmo('${creature.id}', 'arrow', 1)" style="font-size: 10px;">+1</button>
                    </div>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span>⚙️ Болты:</span>
                    <div>
                        <button class="btn btn-small" onclick="BattleModule.addAmmo('${creature.id}', 'bolt', -10)" style="font-size: 10px;">-10</button>
                        <span style="min-width: 35px; text-align: center; display: inline-block;">${creature.ammo.bolt}</span>
                        <button class="btn btn-small" onclick="BattleModule.addAmmo('${creature.id}', 'bolt', 10)" style="font-size: 10px;">+10</button>
                        <button class="btn btn-small" onclick="BattleModule.addAmmo('${creature.id}', 'bolt', 1)" style="font-size: 10px;">+1</button>
                    </div>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span>🗡️ Мет. кинжалы:</span>
                    <div>
                        <button class="btn btn-small" onclick="BattleModule.addAmmo('${creature.id}', 'throwing_dagger', -1)" style="font-size: 10px;">-1</button>
                        <span style="min-width: 35px; text-align: center; display: inline-block;">${creature.ammo.throwing_dagger}</span>
                        <button class="btn btn-small" onclick="BattleModule.addAmmo('${creature.id}', 'throwing_dagger', 1)" style="font-size: 10px;">+1</button>
                    </div>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span>⭐ Мет. звёздочки:</span>
                    <div>
                        <button class="btn btn-small" onclick="BattleModule.addAmmo('${creature.id}', 'throwing_star', -1)" style="font-size: 10px;">-1</button>
                        <span style="min-width: 35px; text-align: center; display: inline-block;">${creature.ammo.throwing_star}</span>
                        <button class="btn btn-small" onclick="BattleModule.addAmmo('${creature.id}', 'throwing_star', 1)" style="font-size: 10px;">+1</button>
                    </div>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span>🪓 Мет. топоры:</span>
                    <div>
                        <button class="btn btn-small" onclick="BattleModule.addAmmo('${creature.id}', 'throwing_axe', -1)" style="font-size: 10px;">-1</button>
                        <span style="min-width: 35px; text-align: center; display: inline-block;">${creature.ammo.throwing_axe}</span>
                        <button class="btn btn-small" onclick="BattleModule.addAmmo('${creature.id}', 'throwing_axe', 1)" style="font-size: 10px;">+1</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Кнопки управления
    let controlHtml = `
        <div style="margin-bottom: 10px; flex-shrink: 0; display: flex; gap: 10px;">
            <button class="btn btn-minus" style="padding: 5px 10px;" onclick="BattleModule.unequipWeapon('${creature.id}')">Снять оружие</button>
            <button class="btn btn-minus" style="padding: 5px 10px;" onclick="BattleModule.unequipArmor('${creature.id}')">Снять броню</button>
        </div>
    `;
    
    // Контейнер для списка предметов с прокруткой
    const itemsContainer = '<div id="equipmentItemsList" style="flex-grow: 1; overflow-y: auto; min-height: 200px; max-height: 400px; margin-top: 10px;"></div>';
    
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-shrink: 0;">
            <h3 style="color: #d4af37; margin: 0;">🛡️ ЭКИПИРОВКА</h3>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #d4af37; font-size: 20px; cursor: pointer;">✖</button>
        </div>
        ${controlHtml}
        ${ammoHtml}
        ${filterHtml}
        ${itemsContainer}
    `;
    
    document.body.appendChild(panel);
    
    BattleModule.currentEquipmentCreatureId = creature.id;
    BattleModule.currentMetalFilter = null;
    BattleModule.refreshEquipmentList();
};

// Остальные методы (addAmmo, refreshEquipmentList, equipWeapon, equipArmor, unequipWeapon, unequipArmor) остаются без изменений
BattleModule.addAmmo = function(creatureId, ammoType, amount) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return;
    if (!creature.ammo) creature.ammo = {};
    const current = creature.ammo[ammoType] || 0;
    const newValue = Math.max(0, current + amount);
    creature.ammo[ammoType] = newValue;
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
    
    // Оружие
    html += '<div style="margin-bottom: 15px;"><div style="color: #d4af37; font-weight: bold; margin-bottom: 8px;">⚔️ ОРУЖИЕ</div>';
    if (weapons.length === 0) {
        html += '<div style="color: #888; padding: 5px;">Нет оружия</div>';
    } else {
        weapons.forEach(item => {
            let attackInfo = '';
            if (item.attacks) {
                const attackNames = Object.values(item.attacks).map(a => a.name).join(', ');
                attackInfo = `<div style="font-size: 10px; color: #b89a7a;">Атаки: ${attackNames}</div>`;
            }
            html += `
                <div style="background: #1a0f0b; margin-bottom: 6px; padding: 6px; border-radius: 4px; border: 1px solid #8b4513; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: bold; font-size: 13px;">${item.name}</div>
                        <div style="font-size: 10px;">Урон: ${item.damage} | Прочность: ${item.durability}</div>
                        ${attackInfo}
                    </div>
                    <button class="btn btn-small" style="padding: 2px 8px;" onclick="BattleModule.equipWeapon('${BattleModule.currentEquipmentCreatureId}', '${item.id}')">Экип.</button>
                </div>
            `;
        });
    }
    html += '</div>';
    
    // Броня
    html += '<div><div style="color: #d4af37; font-weight: bold; margin-bottom: 8px;">🛡️ БРОНЯ</div>';
    if (armors.length === 0) {
        html += '<div style="color: #888; padding: 5px;">Нет брони</div>';
    } else {
        armors.forEach(item => {
            html += `
                <div style="background: #1a0f0b; margin-bottom: 6px; padding: 6px; border-radius: 4px; border: 1px solid #8b4513; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: bold; font-size: 13px;">${item.name}</div>
                        <div style="font-size: 10px;">КБ: ${item.armorClass} | Прочность: ${item.durability}</div>
                        <div style="font-size: 10px; color: #b89a7a;">Слот: ${item.slot}</div>
                    </div>
                    <button class="btn btn-small" style="padding: 2px 8px;" onclick="BattleModule.equipArmor('${BattleModule.currentEquipmentCreatureId}', '${item.id}')">Экип.</button>
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
    const item = window.ItemsDB?.items[itemId];
    if (item && item.slot) {
        creature.equipment[item.slot] = itemId;
    }
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
    if (creature.equipment) {
        creature.equipment.chest = null;
        creature.equipment.helmet = null;
        creature.equipment.gauntlets = null;
        creature.equipment.greaves = null;
        creature.equipment.boots = null;
    }
    const panel = document.getElementById('equipmentPanel');
    if (panel) panel.remove();
    if (this.openCreaturePanel) this.openCreaturePanel(creatureId);
};
