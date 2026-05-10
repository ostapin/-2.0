// modules/battle/systems/3-equipment.js
if (!window.BattleModule) window.BattleModule = {};

BattleModule.openEquipmentPanel = function(creatureId) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return;
    
    if (!creature.ammo) {
        creature.ammo = {
            arrow: 0, bolt: 0,
            throwing_dagger: 0, throwing_star: 0, throwing_axe: 0
        };
    }
    
    const oldPanel = document.getElementById('equipmentPanel');
    if (oldPanel) oldPanel.remove();
    
    const panel = document.createElement('div');
    panel.id = 'equipmentPanel';
    panel.style.cssText = `
        position: fixed;
        right: 20px;
        top: 80px;
        width: 420px;
        background: #2a1a0f;
        border: 3px solid #d4af37;
        border-radius: 12px;
        padding: 15px;
        color: #e0d0c0;
        z-index: 1002;
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
        max-height: 85vh;
        display: flex;
        flex-direction: column;
    `;
    
    // Заголовок
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-shrink: 0;">
            <h3 style="color: #d4af37; margin: 0;">🛡️ ЭКИПИРОВКА</h3>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #d4af37; font-size: 24px; cursor: pointer;">✖</button>
        </div>
        
        <!-- Кнопки снятия -->
        <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-shrink: 0;">
            <button class="btn btn-minus" style="flex:1;" onclick="BattleModule.unequipWeapon('${creature.id}')">🗡️ Снять оружие</button>
            <button class="btn btn-minus" style="flex:1;" onclick="BattleModule.unequipArmor('${creature.id}')">🛡️ Снять броню</button>
        </div>
        
        <!-- Фильтр по металлу -->
        <div style="margin-bottom: 10px; flex-shrink: 0;">
            <label style="color: #d4af37; margin-right: 10px;">🔍 Фильтр:</label>
            <select id="metalFilterSelect" style="background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513; padding: 5px; border-radius: 4px;">
                <option value="all">Все металлы</option>
            </select>
        </div>
        
        <!-- Список предметов (оружие + броня) с прокруткой -->
        <div id="equipmentItemsList" style="flex-grow: 1; overflow-y: auto; min-height: 200px; max-height: 350px; margin-bottom: 10px;"></div>
        
        <!-- Боеприпасы (компактно снизу) -->
        <div style="background: #1a0f0b; border-radius: 8px; padding: 8px; margin-top: 5px; flex-shrink: 0; border: 1px solid #8b4513;">
            <div style="font-weight: bold; color: #d4af37; margin-bottom: 8px; font-size: 13px;">🏹 БОЕПРИПАСЫ</div>
            <div id="ammoContainer" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;"></div>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // Заполняем фильтр металлами
    const allItems = window.ItemsDB?.items || {};
    const metals = [...new Set(Object.values(allItems).filter(i => i.metal).map(i => i.metal))].sort();
    const select = document.getElementById('metalFilterSelect');
    metals.forEach(metal => {
        const option = document.createElement('option');
        option.value = metal;
        option.textContent = window.metalsData?.[metal]?.name || metal;
        select.appendChild(option);
    });
    select.onchange = () => {
        BattleModule.currentMetalFilter = select.value === 'all' ? null : select.value;
        BattleModule.refreshEquipmentList();
    };
    
    // Заполняем боеприпасы
    const ammoContainer = document.getElementById('ammoContainer');
    const ammoTypes = [
        { id: 'arrow', name: '🏹 Стрелы', step: 10 },
        { id: 'bolt', name: '⚙️ Болты', step: 10 },
        { id: 'throwing_dagger', name: '🗡️ Кинжалы', step: 1 },
        { id: 'throwing_star', name: '⭐ Звёздочки', step: 1 },
        { id: 'throwing_axe', name: '🪓 Топоры', step: 1 }
    ];
    
    ammoContainer.innerHTML = ammoTypes.map(ammo => `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 5px; background: #0f0a07; padding: 4px 8px; border-radius: 6px;">
            <span style="font-size: 12px; min-width: 65px;">${ammo.name}:</span>
            <div style="display: flex; align-items: center; gap: 3px;">
                <button class="btn btn-small" style="padding: 2px 5px; font-size: 10px;" onclick="BattleModule.addAmmo('${creature.id}', '${ammo.id}', -${ammo.step})">-${ammo.step}</button>
                <span id="ammo_${ammo.id}" style="min-width: 35px; text-align: center; font-weight: bold;">${creature.ammo[ammo.id] || 0}</span>
                <button class="btn btn-small" style="padding: 2px 5px; font-size: 10px;" onclick="BattleModule.addAmmo('${creature.id}', '${ammo.id}', ${ammo.step})">+${ammo.step}</button>
                <button class="btn btn-small" style="padding: 2px 5px; font-size: 10px;" onclick="BattleModule.addAmmo('${creature.id}', '${ammo.id}', 1)">+1</button>
            </div>
        </div>
    `).join('');
    
    BattleModule.currentEquipmentCreatureId = creature.id;
    BattleModule.currentMetalFilter = null;
    BattleModule.refreshEquipmentList();
};

BattleModule.addAmmo = function(creatureId, ammoType, amount) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return;
    if (!creature.ammo) creature.ammo = {};
    const newVal = Math.max(0, (creature.ammo[ammoType] || 0) + amount);
    creature.ammo[ammoType] = newVal;
    
    // Обновляем отображение
    const span = document.getElementById(`ammo_${ammoType}`);
    if (span) span.textContent = newVal;
};

BattleModule.refreshEquipmentList = function() {
    const container = document.getElementById('equipmentItemsList');
    if (!container) return;
    
    const allItems = window.ItemsDB?.items || {};
    let items = Object.values(allItems).filter(i => i.type !== 'ammo');
    
    if (BattleModule.currentMetalFilter) {
        items = items.filter(i => i.metal === BattleModule.currentMetalFilter);
    }
    
    const weapons = items.filter(i => i.type === 'weapon');
    const armors = items.filter(i => i.type === 'armor');
    
    let html = '';
    
    // Оружие
    html += `<div style="margin-bottom: 15px;">
        <div style="color: #d4af37; font-weight: bold; margin-bottom: 8px;">⚔️ ОРУЖИЕ (${weapons.length})</div>`;
    if (weapons.length === 0) {
        html += '<div style="color: #888; padding: 8px; text-align: center;">Нет оружия</div>';
    } else {
        weapons.slice(0, 30).forEach(item => {
            const attackNames = item.attacks ? Object.values(item.attacks).map(a => a.name).join(', ') : '';
            html += `
                <div style="background: #1a0f0b; margin-bottom: 5px; padding: 6px 8px; border-radius: 6px; border: 1px solid #5a3a2a; display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex:1;">
                        <div style="font-weight: bold; font-size: 13px;">${item.name}</div>
                        <div style="font-size: 10px; color: #b89a7a;">⚡${item.damage} 🔧${item.durability}</div>
                        <div style="font-size: 9px; color: #9a7a5a;">${attackNames}</div>
                    </div>
                    <button class="btn btn-small" style="padding: 4px 10px;" onclick="BattleModule.equipWeapon('${BattleModule.currentEquipmentCreatureId}', '${item.id}')">Экип.</button>
                </div>
            `;
        });
    }
    html += `</div>`;
    
    // Броня
    html += `<div>
        <div style="color: #d4af37; font-weight: bold; margin-bottom: 8px;">🛡️ БРОНЯ (${armors.length})</div>`;
    if (armors.length === 0) {
        html += '<div style="color: #888; padding: 8px; text-align: center;">Нет брони</div>';
    } else {
        armors.slice(0, 30).forEach(item => {
            html += `
                <div style="background: #1a0f0b; margin-bottom: 5px; padding: 6px 8px; border-radius: 6px; border: 1px solid #5a3a2a; display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex:1;">
                        <div style="font-weight: bold; font-size: 13px;">${item.name}</div>
                        <div style="font-size: 10px; color: #b89a7a;">🛡️${item.armorClass} 🔧${item.durability} 📍${item.slot}</div>
                    </div>
                    <button class="btn btn-small" style="padding: 4px 10px;" onclick="BattleModule.equipArmor('${BattleModule.currentEquipmentCreatureId}', '${item.id}')">Экип.</button>
                </div>
            `;
        });
    }
    html += `</div>`;
    
    container.innerHTML = html;
};

// Остальные методы без изменений
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
    if (item && item.slot) creature.equipment[item.slot] = itemId;
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
        ['chest', 'helmet', 'gauntlets', 'greaves', 'boots'].forEach(slot => {
            delete creature.equipment[slot];
        });
    }
    const panel = document.getElementById('equipmentPanel');
    if (panel) panel.remove();
    if (this.openCreaturePanel) this.openCreaturePanel(creatureId);
};
