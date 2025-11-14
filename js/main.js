// ========== СИСТЕМА КУБИКОВ ==========

function rollDice(diceType) {
    const count = parseInt(document.getElementById('diceCount').value) || 1;
    let results = [];
    let total = 0;
    
    if (diceType === 'coin') {
        for (let i = 0; i < count; i++) {
            const result = Math.random() > 0.5 ? 'Орёл' : 'Решка';
            results.push(result);
        }
    } else {
        for (let i = 0; i < count; i++) {
            const result = Math.floor(Math.random() * diceType) + 1;
            results.push(result);
            total += result;
        }
    }
    
    displayDiceResults(diceType, count, results, total);
    addToDiceHistory(diceType, count, results, total);
}

function rollCustomDice() {
    const sides = parseInt(document.getElementById('customDiceSides').value) || 6;
    if (sides < 2) {
        alert('Количество граней должно быть не меньше 2!');
        return;
    }
    rollDice(sides);
}

function displayDiceResults(diceType, count, results, total) {
    const container = document.getElementById('diceResults');
    let resultHTML = '';
    
    if (diceType === 'coin') {
        resultHTML = `<h3 style="color: #d4af37;">Монетка (${count} раз):</h3>`;
        resultHTML += `<div style="font-size: 1.2em; margin: 10px 0;">${results.join(', ')}</div>`;
    } else {
        const diceName = diceType === 0 ? 'Кастомный' : `D${diceType}`;
        resultHTML = `<h3 style="color: #d4af37;">Бросок ${count}d${diceType}:</h3>`;
        resultHTML += `<div style="font-size: 1.2em; margin: 10px 0;">${results.join(' + ')}`;
        if (count > 1) {
            resultHTML += ` = <strong>${total}</strong>`;
        }
        resultHTML += `</div>`;
    }
    
    container.innerHTML = resultHTML;
}

function addToDiceHistory(diceType, count, results, total) {
    const timestamp = new Date().toLocaleTimeString();
    let entry = {
        timestamp,
        diceType: diceType === 'coin' ? 'Монетка' : `D${diceType}`,
        count,
        results: [...results],
        total
    };
    
    diceHistory.unshift(entry);
    if (diceHistory.length > 10) diceHistory.pop();
    renderDiceHistory();
}

function renderDiceHistory() {
    const container = document.getElementById('diceHistory');
    if (diceHistory.length === 0) {
        container.innerHTML = '<p style="color: #8b7d6b; text-align: center;">История бросков пуста</p>';
        return;
    }
    
    let historyHTML = '<h4 style="color: #d4af37; margin-bottom: 10px;">История бросков:</h4>';
    diceHistory.forEach(entry => {
        if (entry.diceType === 'Монетка') {
            historyHTML += `<p style="margin: 5px 0;">${entry.timestamp} - ${entry.diceType}: ${entry.results.join(', ')}</p>`;
        } else {
            historyHTML += `<p style="margin: 5px 0;">${entry.timestamp} - ${entry.count}${entry.diceType}: [${entry.results.join(', ')}]`;
            if (entry.count > 1) {
                historyHTML += ` = ${entry.total}`;
            }
            historyHTML += `</p>`;
        }
    });
    
    container.innerHTML = historyHTML;
}

// ========== ГЕНЕРАТОРЫ ==========

function generateNameForRace(raceId, gender = null) {
    if (!nameGenerators[raceId]) return null;
    
    const generator = nameGenerators[raceId];
    
    if (!gender) {
        gender = Math.random() > 0.5 ? 'male' : 'female';
    }
    
    const firstNames = generator[gender];
    const surnames = generator.surnames;
    
    if (!firstNames || !surnames) return null;
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const surname = surnames[Math.floor(Math.random() * surnames.length)];
    
    return {
        firstName,
        surname,
        gender: gender === 'male' ? 'Мужское' : 'Женское'
    };
}

function generateRandomAge(raceId) {
    const race = races[raceId];
    const lifespan = parseInt(race.lifespan) || 300;
    return Math.max(15, Math.floor(Math.random() * lifespan * 0.3) + 15);
}

function generateRandomTrait() {
    const types = Object.keys(traits);
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomTrait = traits[randomType].general[Math.floor(Math.random() * traits[randomType].general.length)];
    return randomTrait;
}

function generateRandomNickname() {
    const types = Object.keys(nicknames);
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomNickname = nicknames[randomType][Math.floor(Math.random() * nicknames[randomType].length)];
    return randomNickname;
}

function generateFullCharacter() {
    const race = document.getElementById('genRace').value;
    const gender = document.getElementById('genGender').value;
    
    if (!race) {
        alert('Выберите расу!');
        return;
    }
    
    const finalGender = gender === 'random' ? (Math.random() > 0.5 ? 'male' : 'female') : gender;
    const nameData = generateNameForRace(race, finalGender);
    const height = generateRandomHeight(race);
    const age = generateRandomAge(race);
    const trait = generateRandomTrait();
    const nickname = generateRandomNickname();
    
    const resultDiv = document.getElementById('characterResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h3 style="color: #d4af37; margin-bottom: 15px;">🎭 Сгенерированный персонаж</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div><strong>Имя:</strong> ${nameData.firstName}</div>
            <div><strong>Фамилия:</strong> ${nameData.surname}</div>
            <div><strong>Раса:</strong> ${races[race].name}</div>
            <div><strong>Пол:</strong> ${nameData.gender}</div>
            <div><strong>Рост:</strong> ${height} см</div>
            <div><strong>Возраст:</strong> ${age} лет</div>
        </div>
        <div style="margin-top: 15px;">
            <strong>Отличительная черта:</strong> ${trait}<br>
            <strong>Прозвище:</strong> "${nickname}"
        </div>
        <button class="btn btn-plus" onclick="applyGeneratedCharacter('${nameData.firstName}', '${nameData.surname}', ${height}, ${age})" style="margin-top: 15px; width: 100%;">
            ✅ Применить к персонажу
        </button>
    `;
}

function generateName() {
    const nameType = document.getElementById('nameType').value;
    const theme = document.getElementById('nameTheme').value.toLowerCase();
    
    let name = '';
    
    if (nameTemplates[nameType]) {
        const template = nameTemplates[nameType];
        const prefix = template.prefixes[Math.floor(Math.random() * template.prefixes.length)];
        const base = template.bases[Math.floor(Math.random() * template.bases.length)];
        const suffix = template.suffixes[Math.floor(Math.random() * template.suffixes.length)];
        
        name = `${prefix} ${base}${suffix}`;
        
        if (theme) {
            const themedSuffixes = {
                sea: [" у Причала", " Моряка", " Волны", " Прилива", " Океана"],
                forest: [" у Леса", " Охотника", " Тропы", " Рощи", " Дерева"],
                mountain: [" в Горах", " Скалы", " Утеса", " Вершины", " Ущелья"],
                fire: [" Огня", " Пламени", " Вулкана", " Жара", " Пепла"],
                river: [" у Реки", " Ручья", " Брода", " Водопада", " Истока"]
            };
            
            if (themedSuffixes[theme]) {
                const themedSuffix = themedSuffixes[theme][Math.floor(Math.random() * themedSuffixes[theme].length)];
                name += themedSuffix;
            }
        }
    }
    
    const resultDiv = document.getElementById('nameResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h4 style="color: #d4af37; margin-bottom: 10px;">${getIconForNameType(nameType)} ${name}</h4>
        <button class="btn btn-small" onclick="copyToClipboard('${name}')" style="background: #27ae60;">📋 Копировать</button>
    `;
}

function generateTrait() {
    const traitType = document.getElementById('traitType').value;
    const theme = document.getElementById('traitTheme').value.toLowerCase();
    
    let trait = '';
    
    if (theme && traits[traitType].themes[theme]) {
        const themedTraits = traits[traitType].themes[theme];
        trait = themedTraits[Math.floor(Math.random() * themedTraits.length)];
    } else {
        const generalTraits = traits[traitType].general;
        trait = generalTraits[Math.floor(Math.random() * generalTraits.length)];
    }
    
    const resultDiv = document.getElementById('traitResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h4 style="color: #d4af37; margin-bottom: 10px;">🎭 ${trait}</h4>
        <button class="btn btn-small" onclick="copyToClipboard('${trait}')" style="background: #27ae60;">📋 Копировать</button>
    `;
}

function generateNickname() {
    const nicknameType = document.getElementById('nicknameType').value;
    const nicknameList = nicknames[nicknameType];
    const nickname = nicknameList[Math.floor(Math.random() * nicknameList.length)];
    
    const resultDiv = document.getElementById('nicknameResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h4 style="color: #d4af37; margin-bottom: 10px;">🎯 "${nickname}"</h4>
        <button class="btn btn-small" onclick="copyToClipboard('${nickname}')" style="background: #27ae60;">📋 Копировать</button>
    `;
}

function applyGeneratedCharacter(firstName, surname, height, age) {
    document.getElementById('characterName').value = firstName;
    document.getElementById('characterSurname').value = surname;
    document.getElementById('characterHeight').value = height;
    document.getElementById('characterAge').value = age;
    saveCharacterData();
    
    alert(`✅ Персонаж "${firstName} ${surname}" применен!`);
    openTab('character');
}

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let characters = {};
let currentCharacterId = null;
let availableMagicSchools = {};
let notes = [];
let inventory = {
    weapons: [],
    armor: [],
    potions: [],
    scrolls: [],
    resources: [],
    valuables: [],
    tools: [],
    other: []
};
let diceHistory = [];
let lockedSkills = {};
let customCategories = [];
let skillRollHistory = {};

// ========== ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем систему персонажей
    loadCharacters();
    setupAutoSave();
    
    // Загружаем текущего персонажа
    loadCurrentCharacter();
    
    // Загружаем остальные данные
    loadNotes();
    loadInventory();
    loadSpells();
    loadLockedSkills();
    loadCustomCategories();
    loadSkillRollHistory();
    
    // Инициализируем навыки
    initializeSkills();
    
    // Рендер всех компонентов
    setTimeout(() => {
        renderSkills();
        renderInventory();
        renderNotes();
        updateUI();
        updateLevelDisplay();
        updateMagicSkillsDisplay();
        renderCharactersList();
    }, 100);
    
    // Настройка слушателей событий
    document.getElementById('characterName').addEventListener('input', saveCharacterData);
    document.getElementById('characterSurname').addEventListener('input', saveCharacterData);
    document.getElementById('characterTitle').addEventListener('input', saveCharacterData);
    document.getElementById('characterRace').addEventListener('change', saveCharacterData);
    document.getElementById('characterHeritage').addEventListener('input', saveCharacterData);
    document.getElementById('characterHeight').addEventListener('input', saveCharacterData);
    document.getElementById('characterWeight').addEventListener('input', saveCharacterData);
    document.getElementById('characterAge').addEventListener('input', saveCharacterData);
    document.getElementById('health').addEventListener('input', saveCharacterData);
    document.getElementById('mana').addEventListener('input', saveCharacterData);
    document.getElementById('stamina').addEventListener('input', saveCharacterData);
    
    document.getElementById('freePoints').addEventListener('input', function() {
        updateUI();
        saveCharacterData();
    });
    
    document.getElementById('currentExp').addEventListener('input', function() {
        setCurrentExp(parseInt(this.value) || 0);
        checkLevelUp();
        updateLevelDisplay();
        saveCharacterData();
    });
    
    // Слушатели поиска
    const inventorySearch = document.getElementById('inventorySearch');
    const notesSearch = document.getElementById('notesSearch');
    
    if (inventorySearch) {
        inventorySearch.addEventListener('input', renderInventory);
    }
    
    if (notesSearch) {
        notesSearch.addEventListener('input', renderNotes);
    }
    
    console.log('✅ D&D Character Sheet загружен!');
    console.log(`👥 Загружено персонажей: ${Object.keys(characters).length}`);
    if (currentCharacterId) {
        console.log(`🎯 Текущий персонаж: ${characters[currentCharacterId].info.name}`);
    }
});
