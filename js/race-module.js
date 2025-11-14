// ========== СИСТЕМА РАС ==========

function onRaceChange() {
    const raceId = document.getElementById('characterRace').value;
    if (raceId) {
        showRaceInfo(raceId);
    }
}

function showRaceInfo(raceId) {
    const race = races[raceId];
    if (!race) return;

    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <h2 style="color: #d4af37; margin-bottom: 15px;">${race.name}</h2>
            <p style="margin-bottom: 10px;"><strong>Описание:</strong> ${race.description}</p>
            <p style="margin-bottom: 10px;"><strong>Продолжительность жизни:</strong> ${race.lifespan}</p>
            
            ${Object.keys(race.bonuses).length > 0 ? `
                <p style="margin-bottom: 5px;"><strong>Бонусы:</strong></p>
                <ul style="margin-bottom: 15px; margin-left: 20px;">
                    ${Object.entries(race.bonuses).map(([skill, bonus]) => 
                        `<li>${skill}: +${bonus}</li>`
                    ).join('')}
                </ul>
            ` : ''}
            
            ${Object.keys(race.limitations).length > 0 ? `
                <p style="margin-bottom: 5px;"><strong>Ограничения:</strong></p>
                <ul style="margin-bottom: 15px; margin-left: 20px;">
                    ${Object.entries(race.limitations).map(([skill, limit]) => 
                        `<li>${skill}: максимум ${limit === 0 ? 'недоступно' : limit}</li>`
                    ).join('')}
                </ul>
            ` : ''}
            
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn btn-plus" onclick="setRace('${raceId}')">✅ Выбрать расу</button>
                <button class="btn btn-roll" onclick="this.closest('.popup').remove()">Отмена</button>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
}

function setRace(raceId) {
    const race = races[raceId];
    if (!race) return;
    
    availableMagicSchools = {};
    document.getElementById('characterRace').value = raceId;
    
    const randomHeight = generateRandomHeight(raceId);
    document.getElementById('characterHeight').value = randomHeight;
    
    const lifespan = parseInt(race.lifespan);
    document.getElementById('characterAge').value = Math.max(15, Math.floor(lifespan * 0.1));
    
    document.getElementById('generateHeightBtn').disabled = true;
    
    determineAvailableMagicSchools(raceId);
    applyRaceBonuses(raceId);
    
    saveCharacterData();
    document.querySelector('.popup').remove();
    alert(`✅ Раса "${race.name}" выбрана!\n📏 Рост: ${randomHeight} см`);
}

function determineAvailableMagicSchools(raceId) {
    availableMagicSchools = {};
    
    switch(raceId) {
        case 'forest_elf':
            availableMagicSchools["Магия природы"] = true;
            break;
        case 'dark_elf':
            availableMagicSchools["Магия тьмы"] = true;
            break;
        case 'high_elf':
            const shuffled = [...baseMagicSchools].sort(() => 0.5 - Math.random());
            availableMagicSchools[shuffled[0]] = true;
            availableMagicSchools[shuffled[1]] = true;
            break;
        case 'goblin':
            break;
        default:
            const randomSchool = baseMagicSchools[Math.floor(Math.random() * baseMagicSchools.length)];
            availableMagicSchools[randomSchool] = true;
    }
    
    const race = races[raceId];
    if (race && race.limitations) {
        Object.keys(race.limitations).forEach(school => {
            if (race.limitations[school] === 0) {
                availableMagicSchools[school] = false;
            }
        });
    }
    
    updateMagicSkillsDisplay();
}

function applyRaceBonuses(raceId) {
    const race = races[raceId];
    if (!race || !race.bonuses) return;
    
    Object.entries(race.bonuses).forEach(([skill, bonus]) => {
        const currentValue = getSkillValue(skill);
        setSkillValue(skill, currentValue + bonus);
    });
    
    updateUI();
}
