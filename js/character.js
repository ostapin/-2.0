// ========== СИСТЕМА УРОВНЕЙ И ХАРАКТЕРИСТИК ==========

function addExperience() {
    const expToAdd = prompt('Сколько опыта добавить?');
    if (expToAdd && !isNaN(expToAdd)) {
        let currentExp = getCurrentExp();
        currentExp += parseInt(expToAdd);
        setCurrentExp(currentExp);
        checkLevelUp();
        updateLevelDisplay();
        saveCharacterData();
    }
}

function checkLevelUp() {
    let currentLevel = getCurrentLevel();
    let currentExp = getCurrentExp();
    
    if (currentLevel >= 9) return;
    
    while (currentLevel < 9 && currentExp >= levelTable[currentLevel].expRequired) {
        currentLevel++;
        
        const health = getHealth() + levelTable[currentLevel].hp;
        const mana = getMana() + levelTable[currentLevel].mana;
        const stamina = getStamina() + levelTable[currentLevel].stamina;
        const freePoints = getFreePoints() + levelTable[currentLevel].points;
        
        setHealth(health);
        setMana(mana);
        setStamina(stamina);
        setFreePoints(freePoints);
        
        currentExp = currentExp - levelTable[currentLevel-1].expRequired;
        setCurrentExp(currentExp);
        setCurrentLevel(currentLevel);
        
        alert(`🎉 Уровень повышен до ${currentLevel}!`);
    }
}

function editLevel() {
    const newLevel = prompt('Введите новый уровень (0-9):', getCurrentLevel());
    if (newLevel && !isNaN(newLevel) && newLevel >= 0 && newLevel <= 9) {
        setCurrentLevel(parseInt(newLevel));
        updateStatsForLevel();
        updateLevelDisplay();
        saveCharacterData();
    }
}

function updateStatsForLevel() {
    const currentLevel = getCurrentLevel();
    let totalHP = 100, totalMana = 100, totalStamina = 100;
    
    for (let i = 0; i <= currentLevel; i++) {
        totalHP += levelTable[i].hp;
        totalMana += levelTable[i].mana;
        totalStamina += levelTable[i].stamina;
    }
    
    setHealth(totalHP);
    setMana(totalMana);
    setStamina(totalStamina);
}

function convertExpToPoints() {
    const currentExp = getCurrentExp();
    const availablePoints = Math.floor(currentExp / 1000);
    
    if (availablePoints > 0) {
        const expToConvert = availablePoints * 1000;
        setCurrentExp(currentExp - expToConvert);
        setFreePoints(getFreePoints() + availablePoints);
        
        alert(`💎 Конвертировано ${availablePoints} очков навыков!`);
        updateLevelDisplay();
        updateUI();
        saveCharacterData();
    }
}

function updateLevelDisplay() {
    const currentLevel = getCurrentLevel();
    const currentExp = getCurrentExp();
    const convertBtn = document.getElementById('convertBtn');
    
    document.getElementById('currentLevel').textContent = currentLevel;
    document.getElementById('currentExp').value = currentExp;
    
    if (currentLevel < 9) {
        document.getElementById('requiredExp').textContent = levelTable[currentLevel].expRequired;
        convertBtn.style.display = 'none';
    } else {
        document.getElementById('requiredExp').textContent = 'MAX';
        convertBtn.style.display = 'block';
    }
}

function showLevelsTable() {
    const currentLevel = getCurrentLevel();
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <h2 style="color: #d4af37; margin-bottom: 20px;">📊 Таблица уровней</h2>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr><th style="padding: 8px; border: 1px solid #5a3928; background: #3d2418; color: #d4af37;">Ур.</th><th style="padding: 8px; border: 1px solid #5a3928; background: #3d2418; color: #d4af37;">Опыт</th><th style="padding: 8px; border: 1px solid #5a3928; background: #3d2418; color: #d4af37;">ХП</th><th style="padding: 8px; border: 1px solid #5a3928; background: #3d2418; color: #d4af37;">Мана</th><th style="padding: 8px; border: 1px solid #5a3928; background: #3d2418; color: #d4af37;">Стамина</th><th style="padding: 8px; border: 1px solid #5a3928; background: #3d2418; color: #d4af37;">Очки</th></tr>
                ${Object.entries(levelTable).map(([level, data]) => `
                    <tr style="${level == currentLevel ? 'background: #8b4513; font-weight: bold;' : ''}">
                        <td style="padding: 8px; border: 1px solid #5a3928; text-align: center;">${level}</td>
                        <td style="padding: 8px; border: 1px solid #5a3928; text-align: center;">${data.expRequired || 'MAX'}</td>
                        <td style="padding: 8px; border: 1px solid #5a3928; text-align: center;">+${data.hp}</td>
                        <td style="padding: 8px; border: 1px solid #5a3928; text-align: center;">+${data.mana}</td>
                        <td style="padding: 8px; border: 1px solid #5a3928; text-align: center;">+${data.stamina}</td>
                        <td style="padding: 8px; border: 1px solid #5a3928; text-align: center;">+${data.points}</td>
                    </tr>
                `).join('')}
            </table>
            <button class="btn btn-roll" onclick="this.closest('.popup').remove()">Закрыть</button>
        </div>
    `;
    document.body.appendChild(popup);
}

function changeStat(stat, value) {
    const input = document.getElementById(stat);
    let currentValue = parseInt(input.value) || 0;
    let newValue = currentValue + value;
    if (newValue < 0) newValue = 0;
    input.value = newValue;
    saveCharacterData();
}

function editFreePoints() {
    const newPoints = prompt('Введите количество свободных очков:', getFreePoints());
    if (newPoints && !isNaN(newPoints)) {
        setFreePoints(parseInt(newPoints));
        updateUI();
        saveCharacterData();
    }
}
// Рендер списка персонажей
function renderCharactersList() {
    const container = document.getElementById('charactersList');
    if (Object.keys(characters).length === 0) {
        container.innerHTML = '<p style="color: #8b7d6b; text-align: center;">Персонажей пока нет</p>';
        return;
    }

    let html = '';
    Object.values(characters).forEach(character => {
        const isCurrent = currentCharacterId === character.id;
        const raceInfo = races[character.info.race] || { name: 'Неизвестно' };
        
        html += `
            <div class="character-item ${isCurrent ? 'active' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="flex: 1;">
                        <div style="font-weight: bold; color: #d4af37; font-size: 1.1em;">${character.info.name}</div>
                        <div style="color: #b8a28a; font-size: 0.9em; margin-top: 5px;">
                            ${raceInfo.name} | Ур. ${character.level.current} | Опыт: ${character.level.exp}
                        </div>
                        <div style="color: #8b7d6b; font-size: 0.8em; margin-top: 5px;">
                            Создан: ${new Date(character.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 5px; margin-left: 10px;">
                        ${!isCurrent ? 
                            `<button class="btn btn-small" onclick="switchCharacter('${character.id}')" style="background: #27ae60;">🎯 Выбрать</button>` : 
                            `<button class="btn btn-small" disabled style="background: #5a3928;">✅ Активен</button>`
                        }
                        <button class="btn btn-small" onclick="exportSingleCharacter('${character.id}')" style="background: #3498db;">💾 Экспорт</button>
                        <button class="btn btn-small" onclick="showRenameCharacterPopup('${character.id}')" style="background: #f39c12;">✏️ Переименовать</button>
                        <button class="btn btn-small" onclick="showDeleteCharacterPopup('${character.id}')" style="background: #c44536;">❌ Удалить</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}
// Загрузка текущего персонажа
function loadCurrentCharacter() {
    if (!currentCharacterId || !characters[currentCharacterId]) {
        // Если нет персонажей, создаем временного
        if (Object.keys(characters).length === 0) {
            showCreateCharacterPopup();
            return;
        }
        // Или выбираем первого
        currentCharacterId = Object.keys(characters)[0];
    }

    const character = characters[currentCharacterId];

    // Загружаем основные данные
    document.getElementById('characterName').value = character.info.name || '';
    document.getElementById('characterSurname').value = character.info.surname || '';
    document.getElementById('characterTitle').value = character.info.title || '';
    document.getElementById('characterRace').value = character.info.race || '';
    document.getElementById('characterHeritage').value = character.info.heritage || '';
    document.getElementById('characterHeight').value = character.info.height || '';
    document.getElementById('characterWeight').value = character.info.weight || '';
    document.getElementById('characterAge').value = character.info.age || '';

    // Загружаем уровни
    setCurrentLevel(character.level.current || 0);
    setCurrentExp(character.level.exp || 0);

    // Загружаем характеристики
    setHealth(character.stats.health || 100);
    setMana(character.stats.mana || 100);
    setStamina(character.stats.stamina || 100);
    setFreePoints(character.stats.freePoints || 0);

    // Загружаем навыки
    Object.entries(character.skills || {}).forEach(([skill, value]) => {
        setSkillValue(skill, value);
    });

    // Загружаем остальные данные
    lockedSkills = character.lockedSkills || {};
    availableMagicSchools = character.magic.availableSchools || {};
    inventory = character.inventory || { weapons: [], armor: [], potions: [], scrolls: [], resources: [], valuables: [], tools: [], other: [] };
    customCategories = character.customCategories || [];
    notes = character.notes || [];

    // Обновляем интерфейс
    renderSkills();
    renderInventory();
    renderNotes();
    updateCategoryManagement();
}
