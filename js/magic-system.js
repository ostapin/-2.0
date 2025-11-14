// ========== СИСТЕМА ЗАКЛИНАНИЙ ==========

function showSpells(schoolName) {
    if (!availableMagicSchools[schoolName] && getSkillValue(schoolName) <= 5) {
        alert('❌ Эта школа магии недоступна для вашей расы!');
        return;
    }
    
    const spells = spellsBySchool[schoolName] || [];
    const popup = document.createElement('div');
    popup.className = 'popup';
    
    let spellsHTML = '';
    spells.forEach((spell, index) => {
        spellsHTML += `
            <div class="spell-item">
                <div class="spell-header">
                    <span class="spell-name">${spell.name}</span>
                    <span class="spell-order">Порядок ${spell.order}</span>
                </div>
                <div class="spell-details">
                    <p><strong>Эффект:</strong> ${spell.effect}</p>
                    <p><strong>Тип:</strong> ${spell.type}</p>
                    <p><strong>Условия:</strong> ${spell.conditions}</p>
                    <p><strong>Длительность:</strong> ${spell.duration}</p>
                    <p><strong>Затраты:</strong> ${spell.cost}</p>
                </div>
                <div class="spell-learned">
                    <input type="checkbox" id="spell-${schoolName}-${index}" 
                           ${spell.learned ? 'checked' : ''} 
                           onchange="toggleSpellLearned('${schoolName}', ${index})">
                    <label for="spell-${schoolName}-${index}" style="color: #e0d0c0;">Изучено</label>
                </div>
            </div>
        `;
    });
    
    popup.innerHTML = `
        <div class="popup-content spells-content">
            <h2 style="color: #d4af37; text-align: center; margin-bottom: 20px;">🔮 ${schoolName}</h2>
            <div style="max-height: 60vh; overflow-y: auto;">
                ${spellsHTML || '<p style="text-align: center; color: #8b7d6b;">Заклинания не найдены</p>'}
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-roll" onclick="this.closest('.popup').remove()">Закрыть</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
}

function toggleSpellLearned(schoolName, spellIndex) {
    if (spellsBySchool[schoolName] && spellsBySchool[schoolName][spellIndex]) {
        spellsBySchool[schoolName][spellIndex].learned = 
            !spellsBySchool[schoolName][spellIndex].learned;
        saveSpells();
    }
}
