// ============================================
// ПРОСТАЯ СИСТЕМА СОХРАНЕНИЯ
// ============================================

const SAVE_KEY = 'dnd_character_data';

// СОХРАНЕНИЕ
function saveAllData() {
    try {
        const data = {
            // Имя персонажа
            name: document.getElementById('characterName')?.value || '',
            surname: document.getElementById('characterSurname')?.value || '',
            title: document.getElementById('characterTitle')?.value || '',
            race: document.getElementById('characterRace')?.value || '',
            heritage: document.getElementById('characterHeritage')?.value || '',
            height: document.getElementById('characterHeight')?.value || '',
            weight: document.getElementById('characterWeight')?.value || '',
            age: document.getElementById('characterAge')?.value || '',
            
            // Статы (ЗДОРОВЬЕ, МАНА, КИ)
            health: document.getElementById('health')?.value || '100',
            mana: document.getElementById('mana')?.value || '100',
            stamina: document.getElementById('stamina')?.value || '100',
            
            // Уровень и опыт
            level: document.getElementById('currentLevel')?.innerText || '0',
            exp: document.getElementById('currentExp')?.value || '0',
            
            // Очки навыков
            freePoints: document.getElementById('freePoints')?.value || '0',
            
            // Дата сохранения
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
        console.log('📂 ЗАГРУЖЕНО:', data);
        
        // Загружаем данные персонажа
        if (document.getElementById('characterName')) {
            document.getElementById('characterName').value = data.name || '';
            document.getElementById('characterSurname').value = data.surname || '';
            document.getElementById('characterTitle').value = data.title || '';
            document.getElementById('characterRace').value = data.race || '';
            document.getElementById('characterHeritage').value = data.heritage || '';
            document.getElementById('characterHeight').value = data.height || '';
            document.getElementById('characterWeight').value = data.weight || '';
            document.getElementById('characterAge').value = data.age || '';
        }
        
        // Загружаем статы
        if (document.getElementById('health')) {
            document.getElementById('health').value = data.health || '100';
            document.getElementById('mana').value = data.mana || '100';
            document.getElementById('stamina').value = data.stamina || '100';
        }
        
        // Загружаем уровень
        if (document.getElementById('currentLevel')) {
            document.getElementById('currentLevel').innerText = data.level || '0';
        }
        
        // Загружаем опыт
        if (document.getElementById('currentExp')) {
            document.getElementById('currentExp').value = data.exp || '0';
            // Обновляем required exp
            const level = parseInt(data.level) || 0;
            const required = Math.floor(1000 * Math.pow(1.5, level));
            const requiredSpan = document.getElementById('requiredExp');
            if (requiredSpan) requiredSpan.innerText = required;
        }
        
        // Загружаем очки навыков
        if (document.getElementById('freePoints')) {
            document.getElementById('freePoints').value = data.freePoints || '0';
        }
        
        console.log('✅ ДАННЫЕ ВОССТАНОВЛЕНЫ!');
        return true;
    } catch (error) {
        console.error('❌ Ошибка загрузки:', error);
        return false;
    }
}

// АВТОСОХРАНЕНИЕ
function setupAutoSave() {
    // Сохраняем при изменении любых полей
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', saveAllData);
        input.addEventListener('input', function() {
            // Сохраняем с задержкой, чтобы не нагружать
            clearTimeout(this._saveTimer);
            this._saveTimer = setTimeout(saveAllData, 1000);
        });
    });
    
    // Сохраняем при закрытии страницы
    window.addEventListener('beforeunload', saveAllData);
    
    console.log('🔄 Автосохранение включено');
}

// ПРОВЕРКА СОХРАНЕНИЯ (для консоли)
function checkSave() {
    const data = localStorage.getItem(SAVE_KEY);
    if (data) {
        const parsed = JSON.parse(data);
        console.log('📊 СОХРАНЕННЫЕ ДАННЫЕ:', parsed);
        alert(`✅ Данные сохранены!\nИмя: ${parsed.name || 'не задано'}\nУровень: ${parsed.level}\nЗдоровье: ${parsed.health}\nДата: ${parsed.savedAt}`);
    } else {
        alert('❌ Нет сохраненных данных!');
    }
}

// ОЧИСТКА СОХРАНЕНИЯ (на случай ошибок)
function clearSave() {
    if (confirm('Удалить все сохраненные данные?')) {
        localStorage.removeItem(SAVE_KEY);
        alert('🗑️ Данные удалены!');
        console.log('🗑️ Данные удалены');
    }
}

// ============================================
// ЗАПУСК ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Загрузка системы сохранения...');
    
    // Загружаем данные
    loadAllData();
    
    // Включаем автосохранение
    setupAutoSave();
    
    console.log('✅ Система сохранения готова!');
    console.log('💡 Команды для консоли:');
    console.log('  checkSave() - проверить сохраненные данные');
    console.log('  clearSave() - очистить сохранение');
    console.log('  saveAllData() - сохранить вручную');
});

// Делаем функции глобальными
window.saveAllData = saveAllData;
window.loadAllData = loadAllData;
window.checkSave = checkSave;
window.clearSave = clearSave;
