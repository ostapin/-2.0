// ========== МОДУЛЬ НАВЫКОВ ==========

// ========== ФУНКЦИИ РАБОТЫ С НАВЫКАМИ (НОВАЯ ВЕРСИЯ - ИСПОЛЬЗУЕТ SkillsSave) ==========
function getSkillValue(skillName) {
    if (typeof SkillsSave !== 'undefined') {
        return SkillsSave.get(skillName);
    }
    // fallback если SkillsSave не загружен
    if (!currentCharacterId || !characters[currentCharacterId]) return 5;
    const character = characters[currentCharacterId];
    return character.skills?.[skillName] || 5;
}

function setSkillValue(skillName, value) {
    if (typeof SkillsSave !== 'undefined') {
        SkillsSave.set(skillName, value);
        return;
    }
    // fallback
    if (!currentCharacterId || !characters[currentCharacterId]) return;
    if (!characters[currentCharacterId].skills) {
        characters[currentCharacterId].skills = {};
    }
    characters[currentCharacterId].skills[skillName] = Math.max(5, value);
    saveCharacters();
}

function getFreePoints() {
    if (typeof SkillsSave !== 'undefined') {
        return SkillsSave.getPoints();
    }
    // fallback
    if (!currentCharacterId || !characters[currentCharacterId]) return 0;
    return characters[currentCharacterId].freePoints || 0;
}

function setFreePoints(value) {
    if (typeof SkillsSave !== 'undefined') {
        SkillsSave.setPoints(value);
        return;
    }
    // fallback
    if (!currentCharacterId || !characters[currentCharacterId]) return;
    characters[currentCharacterId].freePoints = Math.max(0, value);
    updateUI();
}

function renderSkills() {
    const container = document.getElementById('skillsContainer');
    if (!container) return;
    
    container.innerHTML = '';

    // Проверяем существование skillsStructure
    if (typeof skillsStructure === 'undefined') {
        console.error('skillsStructure не определён!');
        container.innerHTML = '<p>Ошибка: структура навыков не загружена</p>';
        return;
    }

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
            
            const skillValue = getSkillValue(skill);
            const freePoints = getFreePoints();
            
            skillRow.innerHTML = `
                <div class="skill-name">
                    <span>🎯</span>
                    <span>${skill}</span>
                    ${spellIcon}
                </div>
                <div class="skill-controls">
                    <button class="btn btn-minus" onclick="decreaseSkill('${skill}')" ${isLocked ? 'disabled' : (skillValue <= 5 ? 'disabled' : '')}>-</button>
                    <span class="skill-value" id="skill-${skill}">${skillValue}</span>
                    <button class="btn btn-plus" onclick="increaseSkill('${skill}')" ${isLocked ? 'disabled' : (freePoints <= 0 ? 'disabled' : '')}>+</button>
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

function isSkillLocked(skillName) {
    return lockedSkills[skillName] || false;
}

function toggleSkillLock(skillName) {
    const currentlyLocked = isSkillLocked(skillName);
    
    // Список навыков, требующих разрешения мастера
    const masterApprovalSkills = ["Руны", "Формации", "Ремесло"];
    if (typeof skillsStructure !== 'undefined' && skillsStructure["🔮 МАГИЯ"]) {
        masterApprovalSkills.push(...skillsStructure["🔮 МАГИЯ"]);
    }
    
    if (currentlyLocked) {
        // РАЗБЛОКИРОВКА
        let unlockMessage = `🔓 Разблокировать навык "${skillName}"?\n\nНавык станет доступным для использования и прокачки.`;
        
        // Особое сообщение для изначально заблокированных навыков
        if (masterApprovalSkills.includes(skillName)) {
            unlockMessage = `🔓 Вы получили разрешение Мастера на разблокировку навыка "${skillName}"?\n\nНажмите "ОК" для разблокировки или "Отмена" для отмены.`;
        }
        
        const unlock = confirm(unlockMessage);
        if (unlock) {
            lockedSkills[skillName] = false;
            saveLockedSkills();
            renderSkills();
            updateUI();
            alert(`✅ Навык "${skillName}" разблокирован!`);
        }
    } else {
        // БЛОКИРОВКА - стандартное сообщение
        const lock = confirm(`🔒 Заблокировать навык "${skillName}"?\n\nНавык станет недоступным для использования и прокачки.`);
        if (lock) {
            lockedSkills[skillName] = true;
            saveLockedSkills();
            renderSkills();
            updateUI();
            alert(`✅ Навык "${skillName}" заблокирован!`);
        }
    }
}

function increaseSkill(skillName) {
    if (isSkillLocked(skillName)) {
        alert('❌ Этот навык заблокирован!');
        return;
    }
    
    // Проверка на магию
    if (typeof skillsStructure !== 'undefined' && 
        skillsStructure["🔮 МАГИЯ"] && 
        skillsStructure["🔮 МАГИЯ"].includes(skillName) && 
        !availableMagicSchools[skillName] && 
        getSkillValue(skillName) <= 5) {
        
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
            renderSkills();
        }
        return;
    }
    
    // ИСПОЛЬЗУЕМ НОВУЮ СИСТЕМУ СОХРАНЕНИЯ
    if (typeof SkillsSave !== 'undefined') {
        const result = SkillsSave.change(skillName, 1);
        
        if (result) {
            // Обновляем отображение
            updateUI();
            renderSkills();
        } else {
            alert('❌ Недостаточно свободных очков навыков!');
        }
    } else {
        // fallback на старую систему
        const freePoints = getFreePoints();
        if (freePoints > 0) {
            const skillValue = getSkillValue(skillName);
            setSkillValue(skillName, skillValue + 1);
            setFreePoints(freePoints - 1);
            updateUI();
            renderSkills();
        }
    }
}

function decreaseSkill(skillName) {
    if (isSkillLocked(skillName)) {
        alert('❌ Этот навык заблокирован!');
        return;
    }
    
    const skillValue = getSkillValue(skillName);
    if (skillValue > 5) {
        // ИСПОЛЬЗУЕМ НОВУЮ СИСТЕМУ СОХРАНЕНИЯ
        if (typeof SkillsSave !== 'undefined') {
            SkillsSave.change(skillName, -1);
        } else {
            // fallback
            const freePoints = getFreePoints();
            setSkillValue(skillName, skillValue - 1);
            setFreePoints(freePoints + 1);
        }
        
        // Обновляем отображение
        updateUI();
        renderSkills();
    }
}

function addToSkillHistory(skillName, rollData) {
    if (typeof skillRollHistory === 'undefined') {
        window.skillRollHistory = {};
    }
    if (!skillRollHistory[skillName]) {
        skillRollHistory[skillName] = [];
    }
    
    skillRollHistory[skillName].unshift({
        timestamp: new Date().toLocaleTimeString(),
        ...rollData
    });
    
    if (skillRollHistory[skillName].length > 10) {
        skillRollHistory[skillName].pop();
    }
    
    if (typeof saveSkillRollHistory === 'function') {
        saveSkillRollHistory();
    }
}

function getSkillHistory(skillName) {
    if (typeof skillRollHistory === 'undefined') {
        window.skillRollHistory = {};
    }
    return skillRollHistory[skillName] || [];
}

function rollSkill(skillName) {
    if (isSkillLocked(skillName)) {
        alert('❌ Этот навык заблокирован и недоступен для использования!');
        return;
    }
    
    const skillValue = getSkillValue(skillName);
    const roll1 = Math.floor(Math.random() * 6) + 1;
    const roll2 = Math.floor(Math.random() * 6) + 1;
    const roll3 = Math.floor(Math.random() * 6) + 1;
    const totalRoll = roll1 + roll2 + roll3;

    let resultText, resultClass;
    if (totalRoll === 3 || totalRoll === 4) {
        resultText = "💫 КРИТИЧЕСКИЙ УСПЕХ!";
        resultClass = "success";
    } else if (totalRoll === 17 || totalRoll === 18) {
        resultText = "💥 КРИТИЧЕСКИЙ ПРОВАЛ!";
        resultClass = "failure";
    } else if (totalRoll <= skillValue) {
        resultText = "✅ УСПЕХ!";
        resultClass = "success";
    } else {
        resultText = "❌ НЕУДАЧА!";
        resultClass = "failure";
    }

    showRollResult(skillName, skillValue, [roll1, roll2, roll3], totalRoll, resultText, resultClass);
}

function showRollResult(skillName, skillValue, dice, total, resultText, resultClass) {
    addToSkillHistory(skillName, {
        skillValue: skillValue,
        dice: dice,
        total: total,
        result: resultText,
        success: resultClass === "success"
    });
    
    const history = getSkillHistory(skillName);
    let historyHTML = '';
    
    if (history.length > 0) {
        historyHTML = `
            <div style="margin-top: 20px; border-top: 2px solid #5a3928; padding-top: 15px;">
                <h4 style="color: #d4af37; margin-bottom: 10px;">📊 История бросков (${history.length}/10):</h4>
                <div style="max-height: 150px; overflow-y: auto;">
        `;
        
        history.forEach((roll, index) => {
            const successIcon = roll.success ? '✅' : '❌';
            historyHTML += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid #3d2418;">
                    <span style="font-size: 0.9em;">${roll.timestamp}</span>
                    <span style="font-size: 0.9em;">${roll.dice.join('+')}=${roll.total}</span>
                    <span>${successIcon}</span>
                </div>
            `;
        });
        
        historyHTML += `</div></div>`;
    }
    
    // Удаляем старый попап если есть
    const oldPopup = document.querySelector('.popup');
    if (oldPopup) oldPopup.remove();
    
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <h2 style="color: #d4af37;">Бросок на "${skillName}" (${skillValue})</h2>
            <div class="dice-rolls">
                <div class="dice">${dice[0]}</div>
                <div class="dice">${dice[1]}</div>
                <div class="dice">${dice[2]}</div>
            </div>
            <div style="font-size: 1.5em; margin: 20px 0; color: #e0d0c0;">${dice.join(' + ')} = ${total}</div>
            <div class="${resultClass}">${resultText}</div>
            
            <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                <button class="btn btn-roll" onclick="rollSkill('${skillName}'); this.closest('.popup').remove();">🎲 Кинуть еще</button>
                <button class="btn btn-roll" onclick="this.closest('.popup').remove()">Закрыть</button>
            </div>
            
            ${historyHTML}
        </div>
    `;
    document.body.appendChild(popup);
}

// ========== БЛОКИРОВКА НАЧАЛЬНЫХ НАВЫКОВ ==========
// Эта функция вызывается при инициализации
function initSkillLocks() {
    // Если lockedSkills не определён, создаём
    if (typeof lockedSkills === 'undefined') {
        window.lockedSkills = {};
    }
    
    // Загружаем сохранённые блокировки
    if (typeof loadLockedSkills === 'function') {
        loadLockedSkills();
    }
}

// Вызываем инициализацию при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSkillLocks);
} else {
    initSkillLocks();
}

console.log('✅ Модуль навыков загружен (использует SkillsSave)');
