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
export { renderSkills, skillsStructure };
