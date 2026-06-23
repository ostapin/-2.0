// ============================================
// АВТОМАТИЧЕСКАЯ СИСТЕМА СОХРАНЕНИЯ
// ============================================

const SAVE_KEY = 'dnd_character_data';
let isLoading = false;

// ============================================
// СОХРАНЕНИЕ
// ============================================
function saveAllData() {
    if (isLoading) return;
    
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
        return true;
    } catch (error) {
        console.error('❌ Ошибка сохранения:', error);
        return false;
    }
}

// ============================================
// ЗАГРУЗКА (автоматическая)
// ============================================
function loadAllData() {
    if (isLoading) return false;
    
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (!saved) return false;
        
        isLoading = true;
        const data = JSON.parse(saved);
        
        // Загружаем ВСЕ данные
        const fields = {
            characterName: data.name,
            characterSurname: data.surname,
            characterTitle: data.title,
            characterRace: data.race,
            characterHeritage: data.heritage,
            characterHeight: data.height,
            characterWeight: data.weight,
            characterAge: data.age,
            health: data.health,
            mana: data.mana,
            stamina: data.stamina,
            currentExp: data.exp,
            freePoints: data.freePoints
        };
        
        Object.keys(fields).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = fields[id] || '';
        });
        
        // Уровень
        const levelEl = document.getElementById('currentLevel');
        if (levelEl) levelEl.innerText = data.level || '0';
        
        // Required exp
        const level = parseInt(data.level) || 0;
        const required = Math.floor(1000 * Math.pow(1.5, level));
        const requiredSpan = document.getElementById('requiredExp');
        if (requiredSpan) requiredSpan.innerText = required;
        
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
    // Сохраняем при любом изменении
    document.addEventListener('change', function(e) {
        if (e.target.matches('input, select, textarea')) {
            saveAllData();
        }
    });
    
    // Сохраняем при вводе (с задержкой)
    document.addEventListener('input', function(e) {
        if (e.target.matches('input, select, textarea')) {
            clearTimeout(e.target._saveTimer);
            e.target._saveTimer = setTimeout(saveAllData, 500);
        }
    });
    
    // Сохраняем перед закрытием
    window.addEventListener('beforeunload', saveAllData);
}

// ============================================
// ЗАПУСК
// ============================================
function initSaveSystem() {
    console.log('🚀 Загрузка системы...');
    
    // Загружаем данные сразу
    loadAllData();
    
    // Включаем автосохранение
    setupAutoSave();
    
    // Повторная загрузка через секунду (на случай если элементы еще не загрузились)
    setTimeout(loadAllData, 1000);
    
    console.log('✅ Система готова! Данные сохраняются автоматически.');
}

// Запускаем
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSaveSystem);
} else {
    initSaveSystem();
}

// Делаем функции доступными
window.saveAllData = saveAllData;
window.loadAllData = loadAllData;
