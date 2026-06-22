// ============================================
// СИСТЕМА СОХРАНЕНИЯ (с автоматической загрузкой)
// ============================================

const SAVE_KEY = 'dnd_character_data';
let isLoading = false; // Защита от циклической загрузки

// ============================================
// СОХРАНЕНИЕ
// ============================================
function saveAllData() {
    if (isLoading) return; // Не сохраняем во время загрузки
    
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

// ============================================
// ЗАГРУЗКА (с защитой)
// ============================================
function loadAllData() {
    if (isLoading) {
        console.log('⏳ Загрузка уже выполняется...');
        return false;
    }
    
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (!saved) {
            console.log('ℹ️ Нет сохраненных данных');
            return false;
        }
        
        isLoading = true;
        const data = JSON.parse(saved);
        console.log('📂 ЗАГРУЖАЮ ДАННЫЕ:', data);
        
        // Проверяем, что элементы существуют
        const elements = {
            name: document.getElementById('characterName'),
            surname: document.getElementById('characterSurname'),
            title: document.getElementById('characterTitle'),
            race: document.getElementById('characterRace'),
            heritage: document.getElementById('characterHeritage'),
            height: document.getElementById('characterHeight'),
            weight: document.getElementById('characterWeight'),
            age: document.getElementById('characterAge'),
            health: document.getElementById('health'),
            mana: document.getElementById('mana'),
            stamina: document.getElementById('stamina'),
            level: document.getElementById('currentLevel'),
            exp: document.getElementById('currentExp'),
            freePoints: document.getElementById('freePoints')
        };
        
        // Загружаем данные, если элементы найдены
        if (elements.name) elements.name.value = data.name || '';
        if (elements.surname) elements.surname.value = data.surname || '';
        if (elements.title) elements.title.value = data.title || '';
        if (elements.race) elements.race.value = data.race || '';
        if (elements.heritage) elements.heritage.value = data.heritage || '';
        if (elements.height) elements.height.value = data.height || '';
        if (elements.weight) elements.weight.value = data.weight || '';
        if (elements.age) elements.age.value = data.age || '';
        if (elements.health) elements.health.value = data.health || '100';
        if (elements.mana) elements.mana.value = data.mana || '100';
        if (elements.stamina) elements.stamina.value = data.stamina || '100';
        if (elements.level) elements.level.innerText = data.level || '0';
        if (elements.exp) elements.exp.value = data.exp || '0';
        if (elements.freePoints) elements.freePoints.value = data.freePoints || '0';
        
        // Обновляем required exp
        const level = parseInt(data.level) || 0;
        const required = Math.floor(1000 * Math.pow(1.5, level));
        const requiredSpan = document.getElementById('requiredExp');
        if (requiredSpan) requiredSpan.innerText = required;
        
        console.log('✅ ЗАГРУЖЕНО!', {
            health: data.health,
            mana: data.mana,
            stamina: data.stamina,
            freePoints: data.freePoints,
            level: data.level
        });
        
        isLoading = false;
        return true;
    } catch (error) {
        console.error('❌ Ошибка загрузки:', error);
        isLoading = false;
        return false;
    }
}

// ============================================
// АВТОСОХРАНЕНИЕ
// ============================================
function setupAutoSave() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            if (!isLoading) {
                console.log('🔄 Автосохранение:', this.id || this.className);
                saveAllData();
            }
        });
        input.addEventListener('input', function() {
            clearTimeout(this._saveTimer);
            this._saveTimer = setTimeout(() => {
                if (!isLoading) {
                    saveAllData();
                }
            }, 1000);
        });
    });
    
    window.addEventListener('beforeunload', function() {
        if (!isLoading) {
            saveAllData();
        }
    });
    
    console.log('🔄 Автосохранение включено');
}

// ============================================
// КНОПКИ ДЛЯ ТЕСТА
// ============================================
function addTestButtons() {
    const container = document.querySelector('.export-import');
    if (!container) {
        // Если нет контейнера, создаем внизу страницы
        const body = document.body;
        const div = document.createElement('div');
        div.style.cssText = 'position:fixed; bottom:10px; left:50%; transform:translateX(-50%); z-index:9999; display:flex; gap:10px; background:#2c1810; padding:10px; border-radius:8px; border:2px solid #8b4513;';
        body.appendChild(div);
        container = div;
    }
    
    // Кнопка сохранения
    const btnSave = document.createElement('button');
    btnSave.className = 'btn btn-plus';
    btnSave.innerHTML = '💾 СОХРАНИТЬ';
    btnSave.onclick = function() {
        saveAllData();
        alert('✅ Сохранено!');
    };
    btnSave.style.margin = '5px';
    btnSave.style.padding = '10px 20px';
    
    // Кнопка загрузки
    const btnLoad = document.createElement('button');
    btnLoad.className = 'btn btn-roll';
    btnLoad.innerHTML = '📂 ЗАГРУЗИТЬ';
    btnLoad.onclick = function() {
        loadAllData();
        alert('✅ Загружено!');
    };
    btnLoad.style.margin = '5px';
    btnLoad.style.padding = '10px 20px';
    
    // Кнопка проверки
    const btnCheck = document.createElement('button');
    btnCheck.className = 'btn btn-roll';
    btnCheck.innerHTML = '🔍 ПРОВЕРИТЬ';
    btnCheck.onclick = checkSave;
    btnCheck.style.margin = '5px';
    btnCheck.style.padding = '10px 20px';
    
    container.appendChild(btnSave);
    container.appendChild(btnLoad);
    container.appendChild(btnCheck);
}

// ============================================
// ПРОВЕРКА
// ============================================
function checkSave() {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
        const data = JSON.parse(saved);
        alert(
            `📊 СОХРАНЕННЫЕ ДАННЫЕ:\n\n` +
            `Имя: ${data.name || 'не задано'}\n` +
            `Раса: ${data.race || 'не задана'}\n` +
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
        alert('🗑️ Данные удалены! Обновите страницу.');
        location.reload();
    }
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ (ГЛАВНОЕ!)
// ============================================
function initSaveSystem() {
    console.log('🚀 Инициализация системы сохранения...');
    
    // Проверяем элементы
    const elements = {
        name: !!document.getElementById('characterName'),
        health: !!document.getElementById('health'),
        freePoints: !!document.getElementById('freePoints')
    };
    console.log('📋 Элементы найдены:', elements);
    
    // ============================================
    // 🔥 ГЛАВНОЕ: АВТОМАТИЧЕСКАЯ ЗАГРУЗКА
    // ============================================
    setTimeout(function() {
        console.log('📂 Выполняю автоматическую загрузку...');
        loadAllData();
    }, 300); // Задержка 300ms чтобы все элементы точно загрузились
    
    // Включаем автосохранение
    setTimeout(function() {
        setupAutoSave();
    }, 500);
    
    // Добавляем кнопки
    setTimeout(function() {
        addTestButtons();
    }, 600);
    
    console.log('✅ Система сохранения готова!');
    console.log('💡 Команды: saveAllData(), loadAllData(), checkSave()');
}

// ЗАПУСК
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSaveSystem);
} else {
    initSaveSystem();
}

// Глобальные функции
window.saveAllData = saveAllData;
window.loadAllData = loadAllData;
window.checkSave = checkSave;
window.clearSave = clearSave;
window.forceSave = function() { saveAllData(); alert('✅ Сохранено!'); };
window.forceLoad = function() { loadAllData(); alert('✅ Загружено!'); };
