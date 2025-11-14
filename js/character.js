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
