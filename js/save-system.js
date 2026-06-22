// ============================================
// ПРОСТАЯ СИСТЕМА СОХРАНЕНИЯ (без авто)
// ============================================

const SAVE_KEY = 'dnd_character_data';

// СОХРАНЕНИЕ
function saveAllData() {
    try {
        const data = {
            name: document.getElementById('characterName')?.value || '',
            surname: document.getElementById('characterSurname')?.value || '',
            title: document.getElementById('characterTitle')?.value || '',
            race: document.getElementById('characterRace')?.value || '',
            heritage: document.getElementById('characterHeritage')?.value || '',
            height: document.getElementById('characterHeight')?.value || '',
            weight: document.getElementById('characterWeight')?.value || '',
            age: document.getElementById('characterAge')?.value || '',
            health: document.getElementById('health')?.value || '100',
            mana: document.getElementById('mana')?.value || '100',
            stamina: document.getElementById('stamina')?.value || '100',
            level: document.getElementById('currentLevel')?.innerText || '0',
            exp: document.getElementById('currentExp')?.value || '0',
            freePoints: document.getElementById('freePoints')?.value || '0',
            savedAt: new Date().toISOString()
        };
        
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        console.log('✅ СОХРАНЕНО:', data);
        return true;
    } catch (error) {
        console.error('❌ Ошибка сохранения:', error);
        return false;
    }
}

// ЗАГРУЗКА
function loadAllData() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (!saved) {
            console.log('ℹ️ Нет сохраненных данных');
            return false;
        }
        
        const data = JSON.parse(saved);
        console.log('📂 ЗАГРУЖАЮ:', data);
        
        document.getElementById('characterName').value = data.name || '';
        document.getElementById('characterSurname').value = data.surname || '';
        document.getElementById('characterTitle').value = data.title || '';
        document.getElementById('characterRace').value = data.race || '';
        document.getElementById('characterHeritage').value = data.heritage || '';
        document.getElementById('characterHeight').value = data.height || '';
        document.getElementById('characterWeight').value = data.weight || '';
        document.getElementById('characterAge').value = data.age || '';
        document.getElementById('health').value = data.health || '100';
        document.getElementById('mana').value = data.mana || '100';
        document.getElementById('stamina').value = data.stamina || '100';
        document.getElementById('currentLevel').innerText = data.level || '0';
        document.getElementById('currentExp').value = data.exp || '0';
        document.getElementById('freePoints').value = data.freePoints || '0';
        
        console.log('✅ ЗАГРУЖЕНО! health=', data.health, 'freePoints=', data.freePoints);
        return true;
    } catch (error) {
        console.error('❌ Ошибка загрузки:', error);
        return false;
    }
}

// ============================================
// РУЧНОЕ УПРАВЛЕНИЕ
// ============================================

function forceSave() {
    saveAllData();
    alert('💾 Сохранено!');
}

function forceLoad() {
    loadAllData();
    alert('📂 Загружено! Проверьте значения.');
}

function checkSave() {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
        const data = JSON.parse(saved);
        alert(
            `📊 СОХРАНЕННЫЕ ДАННЫЕ:\n\n` +
            `Имя: ${data.name || 'не задано'}\n` +
            `❤️ Здоровье: ${data.health || '100'}\n` +
            `🔮 Мана: ${data.mana || '100'}\n` +
            `⚡ Ки: ${data.stamina || '100'}\n` +
            `💎 Очки навыков: ${data.freePoints || '0'}\n` +
            `📅 Сохранено: ${data.savedAt || 'неизвестно'}`
        );
    } else {
        alert('❌ Нет сохраненных данных!');
    }
}

function clearSave() {
    if (confirm('Удалить все сохраненные данные?')) {
        localStorage.removeItem(SAVE_KEY);
        alert('🗑️ Удалено!');
        location.reload();
    }
}

// ============================================
// КНОПКИ ДЛЯ ТЕСТА
// ============================================
function addTestButtons() {
    const container = document.querySelector('.export-import');
    if (!container) return;
    
    const btnSave = document.createElement('button');
    btnSave.className = 'btn btn-plus';
    btnSave.innerHTML = '💾 СОХРАНИТЬ (принудительно)';
    btnSave.onclick = forceSave;
    btnSave.style.margin = '5px';
    
    const btnLoad = document.createElement('button');
    btnLoad.className = 'btn btn-roll';
    btnLoad.innerHTML = '📂 ЗАГРУЗИТЬ (принудительно)';
    btnLoad.onclick = forceLoad;
    btnLoad.style.margin = '5px';
    
    container.appendChild(btnSave);
    container.appendChild(btnLoad);
}

// Запускаем при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Загрузка...');
    
    // НЕ загружаем автоматически!
    // loadAllData(); // <- ЗАКОММЕНТИРОВАНО
    
    addTestButtons();
    
    console.log('✅ Готово! Используйте кнопки для сохранения/загрузки.');
    console.log('💡 Команды: forceSave(), forceLoad(), checkSave()');
});

window.saveAllData = saveAllData;
window.loadAllData = loadAllData;
window.forceSave = forceSave;
window.forceLoad = forceLoad;
window.checkSave = checkSave;
window.clearSave = clearSave;
