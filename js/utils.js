// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========

// Геттеры/сеттеры для характеристик
function getFreePoints() { 
    const element = document.getElementById('freePoints');
    return element ? parseInt(element.value) || 0 : 0; 
}

function setFreePoints(value) { 
    const element = document.getElementById('freePoints');
    if (element) element.value = value; 
}

function getCurrentLevel() { 
    return parseInt(localStorage.getItem('currentLevel')) || 0; 
}

function setCurrentLevel(value) { 
    localStorage.setItem('currentLevel', value); 
}

function getCurrentExp() { 
    return parseInt(localStorage.getItem('currentExp')) || 0; 
}

function setCurrentExp(value) { 
    localStorage.setItem('currentExp', value); 
}

function getHealth() { 
    const element = document.getElementById('health');
    return element ? parseInt(element.value) || 100 : 100; 
}

function setHealth(value) { 
    const element = document.getElementById('health');
    if (element) element.value = value; 
}

function getMana() { 
    const element = document.getElementById('mana');
    return element ? parseInt(element.value) || 100 : 100; 
}

function setMana(value) { 
    const element = document.getElementById('mana');
    if (element) element.value = value; 
}

function getStamina() { 
    const element = document.getElementById('stamina');
    return element ? parseInt(element.value) || 100 : 100; 
}

function setStamina(value) { 
    const element = document.getElementById('stamina');
    if (element) element.value = value; 
}

function getSkillValue(skillName) { 
    return parseInt(localStorage.getItem(`skill_${skillName}`)) || 5; 
}

function setSkillValue(skillName, value) { 
    localStorage.setItem(`skill_${skillName}`, value); 
}

// Функции для работы с UI
function updateUI() {
    const freePoints = getFreePoints();
    
    document.querySelectorAll('.skill-row').forEach(row => {
        const skillName = row.querySelector('.skill-name span:nth-child(2)').textContent;
        const skillValue = getSkillValue(skillName);
        const isLocked = isSkillLocked(skillName);
        const minusBtn = row.querySelector('.btn-minus');
        const plusBtn = row.querySelector('.btn-plus');
        const rollBtn = row.querySelector('.btn-roll');
        
        row.querySelector('.skill-value').textContent = skillValue;
        
        if (isLocked) {
            minusBtn.disabled = true;
            plusBtn.disabled = true;
            rollBtn.disabled = true;
            row.classList.add('skill-locked');
        } else {
            minusBtn.disabled = skillValue <= 5;
            plusBtn.disabled = freePoints <= 0;
            rollBtn.disabled = false;
            row.classList.remove('skill-locked');
        }
    });
    
    updateMagicSkillsDisplay();
    document.getElementById('freePoints').value = freePoints;
}

function updateMagicSkillsDisplay() {
    const magicSkills = skillsStructure["🔮 МАГИЯ"];
    magicSkills.forEach(skill => {
        const skillElement = document.getElementById(`skill-${skill}`);
        if (skillElement) {
            const skillRow = skillElement.closest('.skill-row');
            const isAvailable = availableMagicSchools[skill] || getSkillValue(skill) > 5;
            if (skillRow) {
                skillRow.classList.toggle('skill-disabled', !isAvailable);
                
                if (!isAvailable && getSkillValue(skill) <= 5) {
                    const minusBtn = skillRow.querySelector('.btn-minus');
                    const plusBtn = skillRow.querySelector('.btn-plus');
                    const rollBtn = skillRow.querySelector('.btn-roll');
                    
                    minusBtn.disabled = true;
                    plusBtn.disabled = true;
                    rollBtn.disabled = true;
                }
            }
        }
    });
}

function forceRenderSkills() {
    const container = document.getElementById('skillsContainer');
    if (!container) return;
    renderSkills();
}

function debugSkills() {
    console.log('🔍 ДЕБАГ НАВЫКОВ:');
    Object.values(skillsStructure).forEach((skillGroup, groupIndex) => {
        console.log(`Группа ${groupIndex + 1}:`);
        skillGroup.forEach(skill => {
            const value = getSkillValue(skill);
            console.log(`  ${skill}: ${value}`);
        });
    });
}

function repairSkills() {
    Object.values(skillsStructure).forEach(skillGroup => {
        skillGroup.forEach(skill => {
            const currentValue = getSkillValue(skill);
            if (currentValue < 5 || isNaN(currentValue)) {
                setSkillValue(skill, 5);
            }
        });
    });
    renderSkills();
    updateUI();
}

// Функции для работы с вкладками
function openTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName + '-tab').classList.add('active');
    document.querySelector(`.tab-btn[onclick*="${tabName}"]`).classList.add('active');
}

// Функции для работы с буфером обмена
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ Скопировано в буфер обмена!');
    });
}

// Функции для работы с иконками
function getIconForNameType(type) {
    const icons = {
        tavern: "🍺", inn: "🏚️", shop: "🛍️", blacksmith: "⚒️",
        temple: "⛪", city: "🏰", kingdom: "👑", ship: "⛵", gang: "💀"
    };
    return icons[type] || "🏛️";
}

// Простая функция для проверки загрузки
function checkSystem() {
    console.log('🎯 System check passed');
    return true;
}

// Глобальные функции доступные в консоли
function resetAllData() {
    if (confirm('❌ ВЫ УВЕРЕНЫ?\n\nЭто удалит ВСЕ данные всех персонажей!\nЭто действие нельзя отменить!')) {
        localStorage.clear();
        location.reload();
    }
}

// Получение всех навыков для экспорта
function getAllSkills() {
    const skills = {};
    Object.values(skillsStructure).forEach(skillGroup => {
        skillGroup.forEach(skill => {
            skills[skill] = getSkillValue(skill);
        });
    });
    return skills;
}
