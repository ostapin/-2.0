const skillsStructure = {
    "⚔️ БОЕВЫЕ НАВЫКИ": [
        "Тяжёлая броня", "Лёгкая броня", "Двуручное оружие", 
        "Одноручное оружие", "Стрельба", "Блокирование", 
        "Древковое", "Рукопашный бой", "Метание"
    ],
    "🎭 ОБЩИЕ НАВЫКИ": [
        "Скрытность", "Красноречию", "Ловкость", "Выносливость",
        "Взлом", "Восприятие", "Удача", "Карманные кражи"
    ],
    "⚗️ РЕМЕСЛА": [
        "Алхимия", "Кузнечное дело", "Зачарование", "Ремесло"
    ],
    "🔮 МАГИЯ": [
        "Магия воды", "Магия земли", "Магия воздуха", "Магия крови",
        "Магия огня", "Магия металла", "Магия природы", "Магия света",
        "Магия тьмы", "Магия инферно", "Магия хаоса", "Магия разума",
        "Магия Жизни", "Магия смерти", "Магия пустоты", "Магия Энергии"
    ]
};
function renderSkills() {
    const container = document.getElementById('skillsContainer');
    if (!container) return;
    
    container.innerHTML = '';

    for (const [groupName, skills] of Object.entries(skillsStructure)) {
        const section = document.createElement('div');
        section.className = 'skills-section';
        
        const title = document.createElement('div');
        title.className = 'section-title';
        title.innerHTML = groupName;
        section.appendChild(title);

        skills.forEach(skill => {
            const skillRow = document.createElement('div');
            skillRow.className = 'skill-row';
            const isLocked = isSkillLocked(skill);
            if (isLocked) {
                skillRow.classList.add('skill-locked');
            }
            
            const spellIcon = groupName === "🔮 МАГИЯ" ? 
                `<span class="spell-icon" onclick="showSpells('${skill}')" title="Просмотреть заклинания">🔮</span>` : '';
            
            const lockBtnText = isLocked ? '🔓' : '🔒';
            const lockBtnClass = isLocked ? 'btn-lock locked' : 'btn-lock';
            
            skillRow.innerHTML = `
                <div class="skill-name">
                    <span>🎯</span>
                    <span>${skill}</span>
                    ${spellIcon}
                </div>
                <div class="skill-controls">
                    <button class="btn btn-minus" onclick="decreaseSkill('${skill}')" ${isLocked ? 'disabled' : (getSkillValue(skill) <= 5 ? 'disabled' : '')}>-</button>
                    <span class="skill-value" id="skill-${skill}">${getSkillValue(skill)}</span>
                    <button class="btn btn-plus" onclick="increaseSkill('${skill}')" ${isLocked ? 'disabled' : (getFreePoints() <= 0 ? 'disabled' : '')}>+</button>
                    <button class="${lockBtnClass}" onclick="toggleSkillLock('${skill}')" title="${isLocked ? 'Разблокировать' : 'Заблокировать'}">${lockBtnText}</button>
                    <button class="btn btn-roll" onclick="rollSkill('${skill}')" ${isLocked ? 'disabled' : ''}>Бросок</button>
                </div>
            `;
            section.appendChild(skillRow);
        });
        container.appendChild(section);
    }
    updateUI();
}
function increaseSkill(skillName) {
    if (isSkillLocked(skillName)) {
        alert('❌ Этот навык заблокирован!');
        return;
    }
    
    const isMagicSkill = skillsStructure["🔮 МАГИЯ"].includes(skillName);
    if (isMagicSkill && !availableMagicSchools[skillName] && getSkillValue(skillName) <= 5) {
        const masterPermission = confirm(
            `🔮 Вы пытаетесь изучить недоступную магию!\n\n` +
            `Навык "${skillName}" не доступен для вашей расы.\n` +
            `Вы получили разрешение Мастера на разблокировку этой магии?\n\n` +
            `Нажмите "ОК" для разблокировки (навык станет 5 уровня) или "Отмена" для отмены.`
        );
        
        if (masterPermission) {
            availableMagicSchools[skillName] = true;
            setSkillValue(skillName, 5);
            updateMagicSkillsDisplay();
            updateUI();
            saveCharacterData();
        }
        return;
    }
    
    const freePoints = getFreePoints();
    if (freePoints > 0) {
        const skillValue = getSkillValue(skillName);
        setSkillValue(skillName, skillValue + 1);
        setFreePoints(freePoints - 1);
        updateUI();
        saveCharacterData();
    }
}
window.renderSkills = renderSkills;
window.increaseSkill = increaseSkill;
function decreaseSkill(skillName) {
    if (isSkillLocked(skillName)) {
        alert('❌ Этот навык заблокирован!');
        return;
    }
    
    const skillValue = getSkillValue(skillName);
    if (skillValue > 5) {
        const freePoints = getFreePoints();
        setSkillValue(skillName, skillValue - 1);
        setFreePoints(freePoints + 1);
        updateUI();
        saveCharacterData();
    }
}
window.decreaseSkill = decreaseSkill;

