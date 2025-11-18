// ========== МОДУЛЬ ПЕРСОНАЖА ==========

// Создание нового персонажа
function showCreateCharacterPopup() {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <h2 style="color: #d4af37;">Создание нового персонажа</h2>
            <input type="text" id="newCharacterName" placeholder="Имя персонажа" style="width: 100%; padding: 12px; margin: 10px 0; border: 2px solid #8b4513; border-radius: 4px; background: #1a0f0b; color: #e0d0c0;">
            <select id="newCharacterRace" style="width: 100%; padding: 12px; margin: 10px 0; border: 2px solid #8b4513; border-radius: 4px; background: #1a0f0b; color: #e0d0c0;">
                <option value="">Выберите расу</option>
                <option value="atski">Ацки</option>
                <option value="knofi">Кнофы</option>
                <option value="vorki">Ворки</option>
                <option value="minci">Минцы</option>
                <option value="kaei">Каэйцы</option>
                <option value="forest_elf">Лесные эльфы</option>
                <option value="high_elf">Высшие эльфы</option>
                <option value="dark_elf">Темные эльфы</option>
                <option value="dwarf">Дварфы</option>
                <option value="gnome">Гномы</option>
                <option value="orc">Орки</option>
                <option value="goblin">Гоблины</option>
            </select>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn btn-plus" onclick="createNewCharacter()">Создать</button>
                <button class="btn btn-roll" onclick="this.closest('.popup').remove()">Отмена</button>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
}

function createNewCharacter() {
    const name = document.getElementById('newCharacterName').value.trim();
    const race = document.getElementById('newCharacterRace').value;
    
    if (!name) {
        alert('Введите имя персонажа!');
        return;
    }
    if (!race) {
        alert('Выберите расу персонажа!');
        return;
    }

    const characterId = 'char_' + Date.now();
    const randomHeight = generateRandomHeight(race);

    // Создаем базового персонажа
    const newCharacter = {
        id: characterId,
        name: name,
        info: {
            name: name,
            surname: "",
            title: "",
            race: race,
            heritage: "",
            height: randomHeight,
            weight: "",
            age: Math.max(15, Math.floor(parseInt(races[race].lifespan) * 0.1))
        },
        level: {
            current: 0,
            exp: 0
        },
        stats: {
            health: 100,
            mana: 100,
            stamina: 100,
            freePoints: 0
        },
        skills: {},
        lockedSkills: {},
        magic: {
            availableSchools: {},
            spells: JSON.parse(JSON.stringify(spellsBySchool))
        },
        inventory: {
            weapons: [], armor: [], potions: [], scrolls: [], 
            resources: [], valuables: [], tools: [], other: []
        },
        customCategories: [],
        notes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Инициализируем навыки
    Object.values(skillsStructure).forEach(skillGroup => {
        skillGroup.forEach(skill => {
            newCharacter.skills[skill] = 5;
        });
    });

    // Определяем доступные школы магии
    determineAvailableMagicSchoolsForCharacter(newCharacter, race);
    
    // Блокируем начальные навыки
    
    characters[characterId] = newCharacter;
    saveCharacters();
    
    // Переключаемся на нового персонажа
    switchCharacter(characterId);
    document.querySelector('.popup').remove();
    alert(`✅ Персонаж "${name}" создан!`);
}

function determineAvailableMagicSchoolsForCharacter(character, raceId) {
    character.magic.availableSchools = {};
    
    switch(raceId) {
        case 'forest_elf':
            character.magic.availableSchools["Магия природы"] = true;
            break;
        case 'dark_elf':
            character.magic.availableSchools["Магия тьмы"] = true;
            break;
        case 'high_elf':
            const shuffled = [...baseMagicSchools].sort(() => 0.5 - Math.random());
            character.magic.availableSchools[shuffled[0]] = true;
            character.magic.availableSchools[shuffled[1]] = true;
            break;
        case 'goblin':
            break;
            case 'kaei':
    character.magic.availableSchools["Магия металла"] = true;
    break;
case 'atski': // ДОБАВЬ ЭТОТ КЕЙС
    character.magic.availableSchools["Магия огня"] = true;
    break;
case 'vorki': // ДОБАВЬ ЭТОТ КЕЙС
    character.magic.availableSchools["Магия воды"] = true;
    break;
        default:
            const randomSchool = baseMagicSchools[Math.floor(Math.random() * baseMagicSchools.length)];
            character.magic.availableSchools[randomSchool] = true;
    }

    const race = races[raceId];
    if (race && race.limitations) {
        Object.keys(race.limitations).forEach(school => {
            if (race.limitations[school] === 0) {
                character.magic.availableSchools[school] = false;
            }
        });
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

// Переключение между персонажами
function switchCharacter(characterId) {
    if (!characters[characterId]) {
        alert('Персонаж не найден!');
        return;
    }

    // Сохраняем текущего персонажа если он есть
    if (currentCharacterId && characters[currentCharacterId]) {
        saveCurrentCharacter();
    }

    // Загружаем нового персонажа
    currentCharacterId = characterId;
    loadCurrentCharacter();
    saveCharacters();

    // Обновляем интерфейс
    renderCharactersList();
    updateUI();
    updateLevelDisplay();

    // Переключаемся на вкладку персонажа
    openTab('character');
    alert(`✅ Переключен на персонажа: ${characters[characterId].info.name}`);
}

// Сохранение текущего персонажа
function saveCurrentCharacter() {
    if (!currentCharacterId) return;
    
    const character = characters[currentCharacterId];
    if (!character) return;

    // Сохраняем все данные текущего персонажа
    character.info = {
        name: document.getElementById('characterName').value,
        surname: document.getElementById('characterSurname').value,
        title: document.getElementById('characterTitle').value,
        race: document.getElementById('characterRace').value,
        heritage: document.getElementById('characterHeritage').value,
        height: document.getElementById('characterHeight').value,
        weight: document.getElementById('characterWeight').value,
        age: document.getElementById('characterAge').value
    };

    character.level = {
        current: getCurrentLevel(),
        exp: getCurrentExp()
    };

    character.stats = {
        health: getHealth(),
        mana: getMana(),
        stamina: getStamina(),
        freePoints: getFreePoints()
    };

    // Сохраняем навыки
    character.skills = {};
    Object.values(skillsStructure).forEach(skillGroup => {
        skillGroup.forEach(skill => {
            character.skills[skill] = getSkillValue(skill);
        });
    });

    character.lockedSkills = lockedSkills;
    character.magic.availableSchools = availableMagicSchools;
    character.inventory = inventory;
    character.customCategories = customCategories;
    character.notes = notes;
    character.updatedAt = new Date().toISOString();

    saveCharacters();
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

// Управление персонажами
function showRenameCharacterPopup(characterId) {
    const character = characters[characterId];
    const newName = prompt('Введите новое имя персонажа:', character.info.name);
    if (newName && newName.trim()) {
        character.info.name = newName.trim();
        character.updatedAt = new Date().toISOString();
        saveCharacters();
        renderCharactersList();
        alert('✅ Имя персонажа изменено!');
    }
}

function showDeleteCharacterPopup(characterId) {
    const character = characters[characterId];
    
    if (Object.keys(characters).length <= 1) {
        alert('❌ Нельзя удалить последнего персонажа!');
        return;
    }

    if (confirm(`Удалить персонажа "${character.info.name}"? Это действие нельзя отменить!`)) {
        delete characters[characterId];
        
        // Если удаляем текущего персонажа, переключаемся на другого
        if (currentCharacterId === characterId) {
            const remainingIds = Object.keys(characters);
            if (remainingIds.length > 0) {
                switchCharacter(remainingIds[0]);
            } else {
                currentCharacterId = null;
            }
        }
        
        saveCharacters();
        renderCharactersList();
        alert('✅ Персонаж удален!');
    }
}

function showClearAllPopup() {
    if (Object.keys(characters).length === 0) {
        alert('Нет персонажей для удаления!');
        return;
    }

    if (confirm(`❌ ВЫ УВЕРЕНЫ?\n\nЭто удалит ВСЕХ персонажей (${Object.keys(characters).length} шт.)!\nЭто действие нельзя отменить!`)) {
        characters = {};
        currentCharacterId = null;
        saveCharacters();
        location.reload();
    }
}
