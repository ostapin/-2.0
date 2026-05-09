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
        position: fixed; left: 700px; top: 100px; width: 350px;
        background: #3d2418; border: 3px solid #d4af37; border-radius: 10px;
        padding: 20px; color: #e0d0c0; z-index: 1002;
        box-shadow: 0 0 20px rgba(0,0,0,0.5); max-height: 80vh; overflow-y: auto;
    `;
    
    const allItems = (window.ItemsDB && window.ItemsDB.items) ? window.ItemsDB.items : {};
    const weaponsList = Object.values(allItems).filter(item => item && item.type === 'weapon');
    
    let weaponsHtml = '';
    weaponsList.forEach(item => {
        weaponsHtml += `
            <div style="background: #1a0f0b; margin-bottom: 10px; padding: 10px; border-radius: 4px; border: 1px solid #8b4513;">
                <div style="font-weight: bold; color: #d4af37;">${item.name}</div>
                <div style="font-size: 12px;">Урон: ${item.damage} | Прочность: ${item.durability}</div>
                <button class="btn btn-small" onclick="BattleModule.equipWeapon('${creature.id}', '${item.id}')">Экипировать</button>
            </div>
        `;
    });
    
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h3 style="color: #d4af37; margin: 0;">🛡️ ВЫБОР ОРУЖИЯ</h3>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #d4af37; font-size: 20px; cursor: pointer;">✖</button>
        </div>
        <div style="margin-bottom: 15px;">
            <button class="btn btn-minus" onclick="BattleModule.unequipWeapon('${creature.id}')">Снять оружие</button>
        </div>
        ${weaponsHtml}
    `;
    
    document.body.appendChild(panel);
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
