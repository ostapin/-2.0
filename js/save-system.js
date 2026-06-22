// ============================================
// СИСТЕМА СОХРАНЕНИЯ И ЗАГРУЗКИ
// ============================================

const SAVE_KEY = 'dnd_character_data';

// Сохранение всех данных
function saveAllData() {
    try {
        const data = {
            // Основные данные персонажа
            character: {
                name: document.getElementById('characterName')?.value || '',
                surname: document.getElementById('characterSurname')?.value || '',
                title: document.getElementById('characterTitle')?.value || '',
                race: document.getElementById('characterRace')?.value || '',
                heritage: document.getElementById('characterHeritage')?.value || '',
                height: document.getElementById('characterHeight')?.value || '',
                weight: document.getElementById('characterWeight')?.value || '',
                age: document.getElementById('characterAge')?.value || '',
            },
            // Статы
            stats: {
                health: document.getElementById('health')?.value || '100',
                mana: document.getElementById('mana')?.value || '100',
                stamina: document.getElementById('stamina')?.value || '100',
            },
            // Уровень и опыт
            level: {
                current: document.getElementById('currentLevel')?.innerText || '0',
                exp: document.getElementById('currentExp')?.value || '0',
            },
            // Очки навыков
            freePoints: document.getElementById('freePoints')?.value || '0',
            // Навыки (если они сохраняются в skillsSystem)
            skills: window.skillsSystem?.getAllSkills?.() || {},
            // Инвентарь
            inventory: window.inventorySystem?.getAllItems?.() || [],
            // Заметки
            notes: window.notesSystem?.getAllNotes?.() || [],
            // Карты
            maps: window.mapSystem?.getAllMaps?.() || [],
            // Персонажи
            characters: window.charactersManager?.getAllCharacters?.() || [],
            // Календарь
            calendar: window.calendarSystem?.getState?.() || {},
            // Дата сохранения
            savedAt: new Date().toISOString()
        };
        
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        console.log('✅ Данные сохранены!');
        return true;
    } catch (error) {
        console.error('❌ Ошибка сохранения:', error);
        return false;
    }
}

// Загрузка всех данных
function loadAllData() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (!saved) {
            console.log('ℹ️ Нет сохраненных данных');
            return false;
        }
        
        const data = JSON.parse(saved);
        console.log('📂 Данные загружены:', data);
        
        // Загружаем данные персонажа
        if (data.character) {
            document.getElementById('characterName').value = data.character.name || '';
            document.getElementById('characterSurname').value = data.character.surname || '';
            document.getElementById('characterTitle').value = data.character.title || '';
            document.getElementById('characterRace').value = data.character.race || '';
            document.getElementById('characterHeritage').value = data.character.heritage || '';
            document.getElementById('characterHeight').value = data.character.height || '';
            document.getElementById('characterWeight').value = data.character.weight || '';
            document.getElementById('characterAge').value = data.character.age || '';
        }
        
        // Загружаем статы
        if (data.stats) {
            document.getElementById('health').value = data.stats.health || '100';
            document.getElementById('mana').value = data.stats.mana || '100';
            document.getElementById('stamina').value = data.stats.stamina || '100';
        }
        
        // Загружаем уровень и опыт
        if (data.level) {
            document.getElementById('currentLevel').innerText = data.level.current || '0';
            document.getElementById('currentExp').value = data.level.exp || '0';
            updateExpDisplay(); // Функция обновления XP (если есть)
        }
        
        // Загружаем очки навыков
        if (data.freePoints !== undefined) {
            document.getElementById('freePoints').value = data.freePoints;
        }
        
        // Загружаем навыки (если есть функция)
        if (data.skills && window.skillsSystem?.loadSkills) {
            window.skillsSystem.loadSkills(data.skills);
        }
        
        // Загружаем инвентарь
        if (data.inventory && window.inventorySystem?.loadItems) {
            window.inventorySystem.loadItems(data.inventory);
        }
        
        // Загружаем заметки
        if (data.notes && window.notesSystem?.loadNotes) {
            window.notesSystem.loadNotes(data.notes);
        }
        
        // Загружаем карты
        if (data.maps && window.mapSystem?.loadMaps) {
            window.mapSystem.loadMaps(data.maps);
        }
        
        // Загружаем персонажей
        if (data.characters && window.charactersManager?.loadCharacters) {
            window.charactersManager.loadCharacters(data.characters);
        }
        
        // Загружаем календарь
        if (data.calendar && window.calendarSystem?.loadState) {
            window.calendarSystem.loadState(data.calendar);
        }
        
        // Обновляем интерфейс
        if (typeof updateUI === 'function') {
            updateUI();
        }
        
        console.log('✅ Данные успешно загружены!');
        return true;
    } catch (error) {
        console.error('❌ Ошибка загрузки:', error);
        return false;
    }
}

// Функция обновления отображения опыта
function updateExpDisplay() {
    const exp = parseInt(document.getElementById('currentExp').value) || 0;
    const required = getRequiredExp(parseInt(document.getElementById('currentLevel').innerText) || 0);
    document.getElementById('requiredExp').innerText = required;
}

// Получение необходимого опыта для уровня
function getRequiredExp(level) {
    return Math.floor(1000 * Math.pow(1.5, level));
}

// Автосохранение при изменении
function setupAutoSave() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('change', saveAllData);
        input.addEventListener('input', debounce(saveAllData, 500));
    });
    
    // Сохраняем при закрытии вкладки
    window.addEventListener('beforeunload', saveAllData);
    
    // Сохраняем при потере фокуса
    window.addEventListener('blur', saveAllData);
}

// Вспомогательная функция debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Экспорт данных в файл (резервное копирование)
function exportAllData() {
    const data = localStorage.getItem(SAVE_KEY);
    if (!data) {
        alert('Нет данных для экспорта!');
        return;
    }
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dnd_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Импорт данных из файла
function importAllData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                localStorage.setItem(SAVE_KEY, JSON.stringify(data));
                alert('✅ Данные импортированы! Перезагрузите страницу.');
                location.reload();
            } catch (error) {
                alert('❌ Ошибка импорта: неверный формат файла');
                console.error(error);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// ИНИЦИАЛИЗАЦИЯ
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Загрузка системы сохранения...');
    
    // Загружаем сохраненные данные
    loadAllData();
    
    // Настраиваем автосохранение
    setupAutoSave();
    
    // Добавляем кнопки экспорта/импорта в интерфейс
    addBackupButtons();
    
    console.log('✅ Система сохранения готова!');
});

// Добавление кнопок бэкапа
function addBackupButtons() {
    const container = document.querySelector('.export-import');
    if (!container) return;
    
    const backupBtn = document.createElement('button');
    backupBtn.className = 'btn btn-roll';
    backupBtn.innerHTML = '💾 Скачать бэкап';
    backupBtn.onclick = exportAllData;
    backupBtn.style.marginLeft = '10px';
    
    const restoreBtn = document.createElement('button');
    restoreBtn.className = 'btn btn-roll';
    restoreBtn.innerHTML = '📂 Загрузить бэкап';
    restoreBtn.onclick = importAllData;
    restoreBtn.style.marginLeft = '10px';
    
    container.appendChild(backupBtn);
    container.appendChild(restoreBtn);
}

// Проверка сохранения (для отладки)
function checkSave() {
    const data = localStorage.getItem(SAVE_KEY);
    if (data) {
        const parsed = JSON.parse(data);
        console.log('📊 Сохраненные данные:', parsed);
        alert(`✅ Данные сохранены!\nРазмер: ${(data.length / 1024).toFixed(1)} KB\nДата: ${parsed.savedAt}`);
    } else {
        alert('❌ Нет сохраненных данных!');
    }
}

// Сделаем функции глобальными для доступа из консоли
window.saveAllData = saveAllData;
window.loadAllData = loadAllData;
window.exportAllData = exportAllData;
window.importAllData = importAllData;
window.checkSave = checkSave;
