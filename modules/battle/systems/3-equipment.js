// modules/battle/systems/3-equipment.js
// Экипировка оружия, брони, стрел

BattleModule.openEquipmentPanel = function(creatureId) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return;
    
    const oldPanel = document.getElementById('equipmentPanel');
    if (oldPanel) oldPanel.remove();
    
    const panel = document.createElement('div');
    panel.id = 'equipmentPanel';
    panel.style.cssText = `
        position: fixed;
        left: 700px;
        top: 100px;
        width: 350px;
        background: #3d2418;
        border: 3px solid #d4af37;
        border-radius: 10px;
        padding: 20px;
        color: #e0d0c0;
        z-index: 1002;
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    let weaponsHtml = '';
    Object.entries(ItemsDB.items).forEach(([id, item]) => {
        if (item.type === 'weapon') {
            weaponsHtml += `
                <div style="background: #1a0f0b; margin-bottom: 10px; padding: 10px; border-radius: 4px; border: 1px solid #8b4513;">
                    <div style="font-weight: bold; color: #d4af37; margin-bottom: 5px;">${item.name}</div>
                    <div style="font-size: 12px; margin-bottom: 8px;">${item.description}</div>
                    <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                        ${Object.keys(ItemsDB.materials).map(materialId => {
                            const material = ItemsDB.materials[materialId];
                            return `
                                <button class="btn btn-small" style="padding: 4px 8px; font-size: 11px;" 
                                        onclick="BattleModule.equipWeapon('${creature.id}', '${id}', '${materialId}')">
                                    ${material.name}
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }
    });
    
    weaponsHtml += `
        <div style="background: #1a0f0b; margin-top: 15px; padding: 10px; border-radius: 4px; border: 1px solid #8b4513;">
            <div style="font-weight: bold; color: #d4af37; margin-bottom: 5px;">Стрелы</div>
            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                <select id="arrowMaterialSelect" style="flex: 1; padding: 6px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513;">
                    ${Object.entries(ItemsDB.materials).map(([id, material]) => 
                        `<option value="${id}" ${creature.equipment?.arrowMaterial === id ? 'selected' : ''}>${material.name}</option>`
                    ).join('')}
                </select>
                <input type="number" id="arrowCount" value="${creature.equipment?.arrows || 10}" min="1" max="100" style="width: 60px; padding: 6px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513;">
                <button class="btn btn-roll" style="padding: 6px 12px;" onclick="BattleModule.equipArrows('${creature.id}')">Добавить</button>
            </div>
        </div>
    `;
    
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h3 style="color: #d4af37; margin: 0;">🛡️ ВЫБОР ОРУЖИЯ</h3>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #d4af37; font-size: 20px; cursor: pointer;">✖</button>
        </div>
        <div style="margin-bottom: 15px;">
            <button class="btn btn-minus" style="width: 100%; padding: 8px;" onclick="BattleModule.unequipWeapon('${creature.id}')">Снять оружие</button>
        </div>
        ${weaponsHtml}
    `;
    
    document.body.appendChild(panel);
};

BattleModule.equipWeapon = function(creatureId, weaponId, materialId) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return;
    
    if (!creature.equipment) {
        creature.equipment = {};
    }
    
    creature.equipment.weapon = weaponId;
    creature.equipment.weaponMaterial = materialId;
    
    const panel = document.getElementById('equipmentPanel');
    if (panel) panel.remove();
    
    this.openCreaturePanel(creatureId);
};

BattleModule.equipArrows = function(creatureId) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return;
    
    const materialSelect = document.getElementById('arrowMaterialSelect');
    const countInput = document.getElementById('arrowCount');
    
    if (!creature.equipment) {
        creature.equipment = {};
    }
    
    creature.equipment.arrows = parseInt(countInput.value) || 10;
    creature.equipment.arrowMaterial = materialSelect.value;
    
    const panel = document.getElementById('equipmentPanel');
    if (panel) panel.remove();
    
    this.openCreaturePanel(creatureId);
};

BattleModule.unequipWeapon = function(creatureId) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return;
    
    if (creature.equipment) {
        creature.equipment.weapon = null;
        creature.equipment.weaponMaterial = null;
    }
    
    const panel = document.getElementById('equipmentPanel');
    if (panel) panel.remove();
    
    this.openCreaturePanel(creatureId);
};
