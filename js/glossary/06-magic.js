// 06-magic.js - Магия
function renderMagic() {
    const resultsList = document.getElementById('resultsList');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!resultsList) return;
    
    resultsTitle.innerHTML = '🔮 Магия';
    
    if (typeof magicData === 'undefined') {
        resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные о магии не загружены</p>';
        return;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
    
    if (currentSubcategory === 'spells') {
        if (currentSchool) {
            displaySchoolSpells(currentSchool);
            return;
        }
        
        const schools = Object.values(magicData.spells);
        let hasSpells = false;
        
        schools.forEach(school => {
            const spells = Object.values(school.schools || {});
            
            if (spells.length > 0) {
                hasSpells = true;
                let schoolKey = '';
                for (let key in magicData.spells) {
                    if (magicData.spells[key] === school) {
                        schoolKey = key;
                        break;
                    }
                }
                
                html += `
                    <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37; cursor: pointer;" onclick="selectSchool('${schoolKey}')">
                        <h3 style="color: #d4af37; margin-bottom: 10px;">🔮 ${school.name}</h3>
                        <p style="color: #b89a7a;">Нажмите, чтобы увидеть заклинания</p>
                    </div>
                `;
            }
        });
        
        if (!hasSpells) {
            html += '<p style="color: #8b7d6b; text-align: center;">Нет доступных заклинаний</p>';
        }
        
    } else if (currentSubcategory === 'formation') {
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">🔮 Формация</h3>
                <p style="color: #8b7d6b; text-align: center;">Раздел в разработке</p>
            </div>
        `;
    } else if (currentSubcategory === 'runes') {
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">⚡ Руны</h3>
                <p style="color: #8b7d6b; text-align: center;">Раздел в разработке</p>
            </div>
        `;
    }
    
    html += '</div>';
    resultsList.innerHTML = html;
}

function selectSchool(schoolKey) {
    currentSchool = schoolKey;
    displaySchoolSpells(schoolKey);
}

function displaySchoolSpells(schoolKey) {
    const resultsList = document.getElementById('resultsList');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!resultsList) return;
    
    const school = magicData.spells[schoolKey];
    if (!school || !school.schools) {
        resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Заклинания не найдены</p>';
        return;
    }
    
    resultsTitle.innerHTML = `🔮 ${school.name} - Заклинания <button class="btn btn-small" onclick="backToSchools()" style="margin-left: 10px;">⬅️ Назад</button>`;
    
    let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
    
    const spells = Object.values(school.schools);
    
    spells.forEach(spell => {
        html += `
            <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
                <h4 style="color: #d4af37; margin-bottom: 10px; font-size: 1.2em;">${spell.name}</h4>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; margin: 10px 0;">
                    ${spell.level ? `<div><span style="color: #b89a7a;">📊 Магия ${spell.level} порядка</span></div>` : ''}
                    ${spell.type ? `<div><span style="color: #b89a7a;">🎯 Тип:</span> ${spell.type}</div>` : ''}
                    ${spell.cast_time ? `<div><span style="color: #b89a7a;">⏱️ Время каста:</span> ${spell.cast_time}</div>` : ''}
                    ${spell.duration ? `<div><span style="color: #b89a7a;">⌛ Длительность:</span> ${spell.duration}</div>` : ''}
                    ${spell.cooldown ? `<div><span style="color: #b89a7a;">🔄 Перезарядка:</span> ${spell.cooldown}</div>` : ''}
                    ${spell.cost ? `<div><span style="color: #b89a7a;">💙 Затраты:</span> ${spell.cost}</div>` : ''}
                    ${spell.damage ? `<div><span style="color: #b89a7a;">💥 Урон:</span> ${spell.damage}</div>` : ''}
                    ${spell.debuff ? `<div><span style="color: #b89a7a;">⚠️ Эффект:</span> ${spell.debuff}</div>` : ''}
                    ${spell.escape ? `<div><span style="color: #b89a7a;">🔄 Освобождение:</span> ${spell.escape}</div>` : ''}
                    ${spell.durability ? `<div><span style="color: #b89a7a;">🛡️ Прочность:</span> ${spell.durability}</div>` : ''}
                    ${spell.abilities ? `<div><span style="color: #b89a7a;">✨ Способности:</span> ${spell.abilities}</div>` : ''}
                </div>
                
                <p style="color: #e0d0c0; margin: 10px 0;"><strong>✨ Эффект:</strong> ${spell.effect}</p>
                
                ${spell.enhancement ? `<p style="color: #e0d0c0; margin: 5px 0; white-space: pre-line;"><strong>⚡ Усиление:</strong> ${spell.enhancement}</p>` : ''}
                
                ${addExtraSpellFields(spell)}
            </div>
        `;
    });
    
    html += '</div>';
    resultsList.innerHTML = html;
}

function backToSchools() {
    currentSchool = null;
    renderMagic();
}

function addExtraSpellFields(spell) {
    let extraHtml = '';
    
    const handledFields = ['name', 'level', 'type', 'cast_time', 'duration', 'cooldown', 'cost', 'effect', 'enhancement', 'damage', 'debuff', 'escape', 'durability', 'abilities'];
    
    for (let key in spell) {
        if (!handledFields.includes(key) && spell[key] && spell[key] !== '') {
            let displayName = key;
            switch(key) {
                case 'range': displayName = '📏 Дальность'; break;
                case 'area': displayName = '🌐 Область'; break;
                case 'target': displayName = '🎯 Цель'; break;
                case 'resistance': displayName = '🛡️ Сопротивление'; break;
                case 'requirement': displayName = '📜 Требование'; break;
                case 'material': displayName = '🧪 Материалы'; break;
                case 'skill_check': displayName = '🎲 Проверка навыка'; break;
                case 'heal': displayName = '💚 Лечение'; break;
                case 'shield': displayName = '🛡️ Щит'; break;
                case 'buff': displayName = '✨ Бафф'; break;
                case 'condition': displayName = '📋 Условие'; break;
                default: displayName = `📌 ${key.charAt(0).toUpperCase() + key.slice(1)}`;
            }
            
            let displayValue = spell[key];
            if (Array.isArray(displayValue)) {
                displayValue = displayValue.join(', ');
            } else if (typeof displayValue === 'object') {
                displayValue = JSON.stringify(displayValue);
            }
            
            extraHtml += `<div><span style="color: #b89a7a;">${displayName}:</span> ${displayValue}</div>`;
        }
    }
    
    if (extraHtml) {
        return `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; margin: 10px 0 0 0;">${extraHtml}</div>`;
    }
    
    return '';
}
