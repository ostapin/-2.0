// modules/battle/ui/2-popup.js
if (!window.BattleModule) window.BattleModule = {};

// Открытие окна персонажа
BattleModule.openCreaturePanel = function(creatureId) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return;
    
    const template = CreaturesDB.get(creature.templateId);
    const speed = template ? template.speed : 5;
    
    if (!creature.skills) creature.skills = { ...this.defaultSkills };
    if (!creature.equipment) {
        creature.equipment = {
            weapon: null, weaponMaterial: null, armor: null, shield: null,
            helmet: null, boots: null, arrows: 0, arrowMaterial: 'steel'
        };
    }
    if (creature.isPreparingAttack === undefined) {
        creature.isPreparingAttack = false;
        creature.hasPreparedAttack = false;
        creature.preparedAttackType = null;
    }
    
    const oldPanel = document.getElementById('creaturePanel');
    if (oldPanel) oldPanel.remove();
    
    const panel = document.createElement('div');
    panel.id = 'creaturePanel';
    panel.style.cssText = `
        position: fixed; left: 300px; top: 100px; width: 380px; max-width: 90vw;
        background: #3d2418; border: 3px solid #d4af37; border-radius: 10px;
        padding: 20px; color: #e0d0c0; z-index: 1001;
        box-shadow: 0 0 20px rgba(0,0,0,0.5); max-height: 80vh; overflow-y: auto;
    `;
    
    const hpPercent = (creature.currentHp / creature.maxHp) * 100;
    const isDead = creature.currentHp <= 0;
    const weapon = creature.equipment.weapon ? (window.ItemsDB?.items[creature.equipment.weapon] || null) : null;
    
    let equipHtml = '';
    if (!isDead) {
        equipHtml = `
            <div style="margin-bottom: 15px; background: #2a1a0f; padding: 12px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="color: #d4af37; font-weight: bold;">🛡️ ЭКИПИРОВКА</span>
                    <button class="btn btn-roll" style="padding: 4px 10px; font-size: 12px;" onclick="BattleModule.openEquipmentPanel('${creature.id}')">✏️ Сменить</button>
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px; font-size: 12px;">
                    <div><span style="color: #b89a7a;">Оружие:</span> ${creature.equipment.weapon ? (window.ItemsDB?.items[creature.equipment.weapon]?.name || 'пусто') : 'пусто'}</div>
                    <div><span style="color: #b89a7a;">Броня:</span> пусто</div>
                    <div><span style="color: #b89a7a;">Щит:</span> пусто</div>
                </div>
            </div>
        `;
    }
    
    let attackHtml = '';
    if (!isDead && weapon) {
        attackHtml = `<div style="margin-bottom: 15px; background: #2a1a0f; padding: 12px; border-radius: 8px;">
            <div style="color: #d4af37; font-weight: bold; margin-bottom: 10px;">⚔️ ДОСТУПНЫЕ АТАКИ</div>`;
        
        Object.entries(weapon.attacks || {}).forEach(([key, attack]) => {
            const isPreparing = creature.isPreparingAttack && creature.preparedAttackType === key;
            const hasPrepared = creature.hasPreparedAttack && creature.preparedAttackType === key;
            let buttonText = '';
            if (hasPrepared) buttonText = 'Использовать';
            else if (isPreparing) buttonText = 'Готовится...';
            else buttonText = attack.cost === 2 ? 'Подготовить' : 'Атаковать';
            
            attackHtml += `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 5px; background: #1a0f0b; border-radius: 4px;">
                    <div><span style="font-weight: bold;">${attack.name}</span> <span style="font-size: 11px; color: #b89a7a;"> (${attack.cost} ход)</span></div>
                    ${isPreparing ? '<span style="color: #ffaa00;">⚔️ ГОТОВИТСЯ</span>' : ''}
                    ${hasPrepared ? '<span style="color: #ff5500;">⚡ ГОТОВО</span>' : ''}
                    <button class="btn btn-roll" style="padding: 4px 8px; font-size: 11px;" 
                            onclick="BattleModule.prepareAttack('${creature.id}', '${key}')" ${isPreparing ? 'disabled' : ''}>
                        ${buttonText}
                    </button>
                </div>
            `;
        });
        attackHtml += `</div>`;
    }
    
    let skillsHtml = '';
    if (!isDead) {
        const sortedSkills = Object.keys(creature.skills).sort();
        sortedSkills.forEach(skill => {
            skillsHtml += `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; padding: 4px 8px; background: #1a0f0b; border-radius: 4px;">
                    <span style="font-size: 12px;">${skill}</span>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <button class="btn btn-small" style="padding: 2px 6px; font-size: 12px;" onclick="BattleModule.modifySkill('${creature.id}', '${skill}', -1)">-</button>
                        <span id="skill_${creature.id}_${skill}" style="min-width: 25px; text-align: center; font-size: 13px;">${creature.skills[skill]}</span>
                        <button class="btn btn-small" style="padding: 2px 6px; font-size: 12px;" onclick="BattleModule.modifySkill('${creature.id}', '${skill}', 1)">+</button>
                    </div>
                </div>
            `;
        });
    }
    
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #8b4513; padding-bottom: 10px;">
            <h3 style="color: #d4af37; margin: 0;">${creature.icon} ${creature.name}</h3>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #d4af37; font-size: 24px; cursor: pointer;">✖</button>
        </div>
        
        <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>❤️ Здоровье:</span> <span>${creature.currentHp}/${creature.maxHp}</span>
            </div>
            <div style="height: 12px; background: #1a0f0b; border-radius: 6px; overflow: hidden;">
                <div style="height: 12px; width: ${hpPercent}%; background: ${hpPercent > 50 ? '#00aa00' : (hpPercent > 20 ? '#aaaa00' : '#aa0000')};"></div>
            </div>
        </div>
        
        <div style="margin-bottom: 15px; background: #2a1a0f; padding: 8px 12px; border-radius: 6px; display: flex; align-items: center; gap: 10px;">
            <span style="min-width: 70px;">⚡ Инициатива:</span>
            <input type="number" id="initiativeInput" value="${creature.currentInitiative}" min="1" max="30" style="width: 60px; padding: 4px 6px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513; border-radius: 4px;">
            <button class="btn btn-small" onclick="BattleModule.updateInitiative('${creature.id}')">✓</button>
        </div>
        
        ${!isDead ? `
            <div style="display: flex; gap: 6px; margin-bottom: 12px;">
                <button class="btn btn-minus" style="flex: 1; padding: 4px 2px;" onclick="BattleModule.damageCreature('${creature.id}', 5)">-5 HP</button>
                <button class="btn btn-plus" style="flex: 1; padding: 4px 2px;" onclick="BattleModule.healCreature('${creature.id}', 5)">+5 HP</button>
                <input type="number" id="damageInput" value="10" min="1" style="width: 50px; padding: 4px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513; border-radius: 4px; text-align: center;">
                <button class="btn btn-minus" style="flex: 1; padding: 4px 2px;" onclick="BattleModule.damageCreature('${creature.id}', document.getElementById('damageInput').value)">Урон</button>
            </div>
            
            ${equipHtml}
            ${attackHtml}
            
            <div style="margin-bottom: 15px; background: #2a1a0f; padding: 10px 12px; border-radius: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>⚡ Скорость: <strong>${speed}</strong> гексов</span>
                    <button class="btn btn-roll" onclick="BattleModule.activateMoveMode('${creature.id}')">🚶 Движение</button>
                </div>
            </div>
            
            <div style="margin-top: 10px; border-top: 2px solid #8b4513; padding-top: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; background: #2a1a0f; padding: 8px 12px; border-radius: 6px;">
                    <span style="font-size: 15px; color: #d4af37; font-weight: bold;">📊 НАВЫКИ</span>
                    <button class="btn btn-roll" style="padding: 4px 12px;" onclick="BattleModule.toggleSkills('${creature.id}')">Показать/скрыть</button>
                </div>
                <div id="skillsList_${creature.id}" style="display: none; max-height: 250px; overflow-y: auto; padding-right: 5px;">
                    ${skillsHtml}
                </div>
            </div>
        ` : '<div style="color: #ff6666; text-align: center; padding: 20px;">💀 СУЩЕСТВО МЕРТВО</div>'}
    `;
    
    document.body.appendChild(panel);
};

// Показать/скрыть навыки
BattleModule.toggleSkills = function(creatureId) {
    const skillsDiv = document.getElementById(`skillsList_${creatureId}`);
    if (skillsDiv) {
        skillsDiv.style.display = skillsDiv.style.display === 'none' ? 'block' : 'none';
    }
};

// Изменение навыка
BattleModule.modifySkill = function(creatureId, skillName, change) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature || !creature.skills) return;
    
    creature.skills[skillName] = (creature.skills[skillName] || 10) + change;
    if (creature.skills[skillName] < 0) creature.skills[skillName] = 0;
    if (creature.skills[skillName] > 30) creature.skills[skillName] = 30;
    
    const skillSpan = document.getElementById(`skill_${creatureId}_${skillName}`);
    if (skillSpan) skillSpan.textContent = creature.skills[skillName];
};
