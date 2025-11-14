// ========== ФУНКЦИИ ЗАГРУЗКИ И СОХРАНЕНИЯ ДАННЫХ ==========

function loadSkillRollHistory() {
    const saved = localStorage.getItem('skillRollHistory');
    if (saved) {
        skillRollHistory = JSON.parse(saved);
    }
}

function saveSkillRollHistory() {
    localStorage.setItem('skillRollHistory', JSON.stringify(skillRollHistory));
}

function loadLockedSkills() {
    const saved = localStorage.getItem('lockedSkills');
    if (saved) {
        lockedSkills = JSON.parse(saved);
    }
}

function saveLockedSkills() {
    localStorage.setItem('lockedSkills', JSON.stringify(lockedSkills));
}

function loadCustomCategories() {
    const saved = localStorage.getItem('customCategories');
    if (saved) {
        customCategories = JSON.parse(saved);
        updateCategoryManagement();
    }
}

function saveCustomCategories() {
    localStorage.setItem('customCategories', JSON.stringify(customCategories));
}

function loadSpells() {
    const saved = localStorage.getItem('characterSpells');
    if (saved) {
        const data = JSON.parse(saved);
        Object.keys(spellsBySchool).forEach(school => {
            if (data[school]) {
                spellsBySchool[school] = data[school];
            }
        });
    }
}

function saveSpells() {
    localStorage.setItem('characterSpells', JSON.stringify(spellsBySchool));
}

function loadNotes() {
    const saved = localStorage.getItem('characterNotes');
    if (saved) {
        notes = JSON.parse(saved);
    }
}

function saveNotes() {
    localStorage.setItem('characterNotes', JSON.stringify(notes));
}

function loadInventory() {
    const saved = localStorage.getItem('inventoryData');
    if (saved) {
        inventory = JSON.parse(saved);
    }
}

function saveInventory() {
    localStorage.setItem('inventoryData', JSON.stringify(inventory));
}

// Сохранение/загрузка основных данных персонажа
function saveCharacterData() {
    localStorage.setItem('characterName', document.getElementById('characterName').value);
    localStorage.setItem('characterSurname', document.getElementById('characterSurname').value);
    localStorage.setItem('characterTitle', document.getElementById('characterTitle').value);
    localStorage.setItem('characterRace', document.getElementById('characterRace').value);
    localStorage.setItem('characterHeritage', document.getElementById('characterHeritage').value);
    localStorage.setItem('characterHeight', document.getElementById('characterHeight').value);
    localStorage.setItem('characterWeight', document.getElementById('characterWeight').value);
    localStorage.setItem('characterAge', document.getElementById('characterAge').value);
    localStorage.setItem('availableMagicSchools', JSON.stringify(availableMagicSchools));
}

function loadCharacterData() {
    document.getElementById('characterName').value = localStorage.getItem('characterName') || '';
    document.getElementById('characterSurname').value = localStorage.getItem('characterSurname') || '';
    document.getElementById('characterTitle').value = localStorage.getItem('characterTitle') || '';
    document.getElementById('characterRace').value = localStorage.getItem('characterRace') || '';
    document.getElementById('characterHeritage').value = localStorage.getItem('characterHeritage') || '';
    document.getElementById('characterHeight').value = localStorage.getItem('characterHeight') || '';
    document.getElementById('characterWeight').value = localStorage.getItem('characterWeight') || '';
    document.getElementById('characterAge').value = localStorage.getItem('characterAge') || '';
    
    const savedMagicSchools = localStorage.getItem('availableMagicSchools');
    if (savedMagicSchools) {
        availableMagicSchools = JSON.parse(savedMagicSchools);
    }
    
    if (localStorage.getItem('characterRace')) {
        document.getElementById('generateHeightBtn').disabled = true;
    }
}

// Инициализация всех навыков при первом запуске
function initializeSkills() {
    Object.values(skillsStructure).forEach(skillGroup => {
        skillGroup.forEach(skill => {
            if (localStorage.getItem(`skill_${skill}`) === null) {
                setSkillValue(skill, 5);
            }
        });
    });
}
