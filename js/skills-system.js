// ========== СИСТЕМА УПРАВЛЕНИЯ ПЕРСОНАЖАМИ ==========

// Загрузка списка персонажей
function loadCharacters() {
    const saved = localStorage.getItem('dnd_characters');
    if (saved) {
        characters = JSON.parse(saved);
    }
    const savedCurrent = localStorage.getItem('current_character_id');
    if (savedCurrent) {
        currentCharacterId = savedCurrent;
    }
    renderCharactersList();
}

// Сохранение списка персонажей
function saveCharacters() {
    localStorage.setItem('dnd_characters', JSON.stringify(characters));
    localStorage.setItem('current_character_id', currentCharacterId);
}

// Экспорт персонажей
function exportSingleCharacter(characterId) {
    const character = characters[characterId];
    const dataStr = JSON.stringify(character, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `character_${character.info.name || 'unknown'}.json`;
    link.click();
    
    alert(`✅ Персонаж "${character.info.name}" экспортирован!`);
}

function exportAllCharacters() {
    if (Object.keys(characters).length === 0) {
        alert('Нет персонажей для экспорта!');
        return;
    }

    const dataStr = JSON.stringify(characters, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `dnd_characters_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    alert(`✅ Все персонажи (${Object.keys(characters).length} шт.) экспортированы!`);
}

function showImportCharacterPopup() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const characterData = JSON.parse(e.target.result);
                importCharacterData(characterData);
            } catch (error) {
                alert('❌ Ошибка загрузки файла!');
                console.error(error);
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

function importCharacterData(characterData) {
    // Проверяем структуру файла
    if (!characterData.info || !characterData.info.name) {
        // Если это файл с несколькими персонажами
        if (characterData.info === undefined && Object.keys(characterData).length > 0) {
            let importedCount = 0;
            Object.values(characterData).forEach(char => {
                if (char.info && char.info.name) {
                    const newId = 'char_import_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                    characters[newId] = char;
                    characters[newId].id = newId;
                    characters[newId].updatedAt = new Date().toISOString();
                    importedCount++;
                }
            });
            saveCharacters();
            renderCharactersList();
            alert(`✅ Импортировано ${importedCount} персонажей!`);
            return;
        }
        alert('❌ Неверный формат файла персонажа!');
        return;
    }

    // Если это одиночный персонаж
    const newId = 'char_import_' + Date.now();
    characters[newId] = characterData;
    characters[newId].id = newId;
    characters[newId].updatedAt = new Date().toISOString();
    
    saveCharacters();
    renderCharactersList();
    alert(`✅ Персонаж "${characterData.info.name}" импортирован!`);
}

// Экспорт текущего персонажа
function exportCharacter() {
    if (!currentCharacterId || !characters[currentCharacterId]) {
        alert('❌ Нет активного персонажа для экспорта!');
        return;
    }
    exportSingleCharacter(currentCharacterId);
}

// Импорт персонажа
function importCharacter() {
    showImportCharacterPopup();
}

// Автосохранение при изменении данных
function setupAutoSave() {
    // Переопределяем saveCharacterData для автосохранения
    const originalSaveCharacterData = saveCharacterData;
    saveCharacterData = function() {
        originalSaveCharacterData();
        if (currentCharacterId) {
            saveCurrentCharacter();
        }
    };

    // Автосохранение при изменении инвентаря
    const originalSaveInventory = saveInventory;
    saveInventory = function() {
        originalSaveInventory();
        if (currentCharacterId) {
            saveCurrentCharacter();
        }
    };

    // Автосохранение при изменении заметок
    const originalSaveNotes = saveNotes;
    saveNotes = function() {
        originalSaveNotes();
        if (currentCharacterId) {
            saveCurrentCharacter();
        }
    };
}
