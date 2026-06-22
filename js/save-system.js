// ============================================
// УНИВЕРСАЛЬНАЯ СИСТЕМА СОХРАНЕНИЯ
// ============================================

const SAVE_KEY = 'dnd_character_data';

// ============================================
// СОХРАНЕНИЕ ВСЕХ ДАННЫХ
// ============================================
function saveAllData() {
    try {
        // Собираем ВСЕ данные с полей
        const data = {
            // ---- ОСНОВНЫЕ ДАННЫЕ ----
            name: document.getElementById('characterName')?.value || '',
            surname: document.getElementById('characterSurname')?.value || '',
            title: document.getElementById('characterTitle')?.value || '',
            race: document.getElementById('characterRace')?.value || '',
            heritage: document.getElementById('characterHeritage')?.value || '',
            height: document.getElementById('characterHeight')?.value || '',
            weight: document.getElementById('characterWeight')?.value || '',
            age: document.getElementById('characterAge')?.value || '',
            
            // ---- СТАТЫ (ХП, МАНА, КИ) ----
            health: document.getElementById('health')?.value || '100',
            mana: document.getElementById('mana')?.value || '100',
            stamina: document.getElementById('stamina')?.value || '100',
            
            // ---- УРОВЕНЬ И ОПЫТ ----
            level: document.getElementById('currentLevel')?.innerText || '0',
            exp: document.getElementById('currentExp')?.value || '0',
            
            // ---- ОЧКИ НАВЫКОВ ----
            freePoints: document.getElementById('freePoints')?.value || '0',
            
            // ---- НАВЫКИ (если есть система) ----
            skills: {},
            
            // ---- ДАТА ----
            savedAt: new Date().toISOString()
        };
        
        // ---- СОХРАНЯЕМ НАВЫКИ ----
        // Ищем все элементы с навыками
        document.querySelectorAll('.skill-item, .skill-row, [data-skill]').forEach(el => {
            const name = el.dataset.skill || el.dataset.skillName || el.querySelector('.skill-name')?.innerText;
            const value = el.querySelector('input, .skill-value, .skill-level')?.value || 
                         el.querySelector('.skill-value')?.innerText || '0';
            if (name) {
                data.skills[name] = value;
            }
        });
        
        // Ищем навыки в специальных контейнерах
        const skillInputs = document.querySelectorAll('[id*="skill"], [class*="skill-value"]');
        skillInputs.forEach(input => {
            if (input.id && input.id.includes('skill')) {
                const name = input.id.replace('skill-', '').replace('_', ' ');
                data.skills[name] = input.value || '0';
            }
        });
        
        // Сохраняем в localStorage
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        console.log('✅ СОХРАНЕНО:', {
            name: data.name,
            health: data.health,
            mana: data.mana,
            stamina: data.stamina,
            freePoints: data.freePoints,
            level: data.level,
            skillsCount: Object.keys(data.skills).length
        });
        return true;
    } catch (error) {
        console.error('❌ Ошибка сохранения:', error);
        return false;
    }
}

// ============================================
// ЗАГРУЗКА ВСЕХ ДАННЫХ
// ============================================
function loadAllData() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (!saved) {
            console.log('ℹ️ Нет сохраненных данных');
            return false;
        }
        
        const data = JSON.parse(saved);
        console.log('📂 ЗАГРУЖЕНО:', data);
        
        // ---- ЗАГРУЖАЕМ ОСНОВНЫЕ ДАННЫЕ ----
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
        
        // ---- ЗАГРУЖАЕМ СТАТЫ (ВАЖНО!) ----
        if (document.getElementById('health')) {
            document.getElementById('health').value = data.health || '100';
            document.getElementById('mana').value = data.mana || '100';
            document.getElementById('stamina').value = data.stamina || '100';
            console.log('📊 Статы загружены:', {
                health: data.health,
                mana: data.mana,
                stamina: data.stamina
            });
        }
        
        // ---- ЗАГРУЖАЕМ УРОВЕНЬ ----
        if (document.getElementById('currentLevel')) {
            document.getElementById('currentLevel').innerText = data.level || '0';
            document.getElementById('currentExp').value = data.exp || '0';
            
            // Обновляем required exp
            const level = parseInt(data.level) || 0;
            const required = Math.floor(1000 * Math.pow(1.5, level));
            const requiredSpan = document.getElementById('requiredExp');
            if (requiredSpan) requiredSpan.innerText = required;
        }
        
        // ---- ЗАГРУЖАЕМ ОЧКИ НАВЫКОВ (ВАЖНО!) ----
        if (document.getElementById('freePoints')) {
            document.getElementById('freePoints').value = data.freePoints || '0';
            console.log('💎 Очки навыков загружены:', data.freePoints);
        }
        
        // ---- ЗАГРУЖАЕМ НАВЫКИ ----
        if (data.skills) {
            console.log('🎯 Загружаем навыки:', Object.keys(data.skills).length);
            
            // Ищем все элементы навыков
            document.querySelectorAll('.skill-item, .skill-row, [data-skill]').forEach(el => {
                const name = el.dataset.skill || el.dataset.skillName;
                if (name && data.skills[name] !== undefined) {
                    const input = el.querySelector('input, .skill-value, .skill-level');
                    if (input) {
                        input.value = data.skills[name];
                    }
                }
            });
            
            // Ищем по id
            Object.keys(data.skills).forEach(skillName => {
                const id = 'skill-' + skillName.replace(/ /g, '_');
                const input = document.getElementById(id);
                if (input) {
                    input.value = data.skills[skillName];
                }
            });
            
            // Если есть глобальная система навыков
            if (window.skillsSystem && typeof window.skillsSystem.loadSkills === 'function') {
                window.skillsSystem.loadSkills(data.skills);
            }
            
            // Обновляем UI навыков
            if (typeof updateSkillsUI === 'function') {
                updateSkillsUI();
            }
        }
        
        // ---- ОБНОВЛЯЕМ ИНТЕРФЕЙС ----
        // Обновляем отображение опыта
        updateExpDisplay();
        
        console.log('✅ ВСЕ ДАННЫЕ ЗАГРУЖЕНЫ!');
        console.log('📊 Итог:', {
            name: data.name,
            health: data.health,
            mana: data.mana,
            stamina: data.stamina,
            freePoints: data.freePoints,
            level: data.level,
            skills: Object.keys(data.skills || {}).length
        });
        
        return true;
    } catch (error) {
        console.error('❌ Ошибка загрузки:', error);
        return false;
    }
}

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

function updateExpDisplay() {
    const exp = parseInt(document.getElementById('currentExp')?.value) || 0;
    const level = parseInt(document.getElementById('currentLevel')?.innerText) || 0;
    const required = Math.floor(1000 * Math.pow(1.5, level));
    const requiredSpan = document.getElementById('requiredExp');
    if (requiredSpan) requiredSpan.innerText = required;
}

// ============================================
// АВТОСОХРАНЕНИЕ
// ============================================
function setupAutoSave() {
    // Сохраняем при изменении ЛЮБЫХ полей
    const allInputs = document.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => {
        input.addEventListener('change', function() {
            console.log('🔄 Изменено:', this.id || this.className, '=', this.value);
            saveAllData();
        });
        input.addEventListener('input', function() {
            clearTimeout(this._saveTimer);
            this._saveTimer = setTimeout(() => {
                saveAllData();
            }, 500);
        });
    });
    
    // Сохраняем при закрытии
    window.addEventListener('beforeunload', saveAllData);
    
    console.log('🔄 Автосохранение включено для', allInputs.length, 'элементов');
}

// ============================================
// ПРОВЕРКА
// ============================================
function checkSave() {
    const data = localStorage.getItem(SAVE_KEY);
    if (data) {
        const parsed = JSON.parse(data);
        console.log('📊 СОХРАНЕННЫЕ ДАННЫЕ:', parsed);
        alert(
            `✅ ДАННЫЕ СОХРАНЕНЫ:\n\n` +
            `Имя: ${parsed.name || 'не задано'}\n` +
            `Раса: ${parsed.race || 'не задана'}\n` +
            `Уровень: ${parsed.level || '0'}\n` +
            `❤️ Здоровье: ${parsed.health || '100'}\n` +
            `🔮 Мана: ${parsed.mana || '100'}\n` +
            `⚡ Ки: ${parsed.stamina || '100'}\n` +
            `💎 Очки навыков: ${parsed.freePoints || '0'}\n` +
            `📅 Сохранено: ${parsed.savedAt || 'неизвестно'}`
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
// ИНИЦИАЛИЗАЦИЯ
// ============================================
function initSaveSystem() {
    console.log('🚀 Инициализация системы сохранения...');
    
    // Проверяем элементы
    const elements = {
        name: !!document.getElementById('characterName'),
        health: !!document.getElementById('health'),
        mana: !!document.getElementById('mana'),
        stamina: !!document.getElementById('stamina'),
        freePoints: !!document.getElementById('freePoints'),
        level: !!document.getElementById('currentLevel')
    };
    console.log('📋 Найдены элементы:', elements);
    
    // Загружаем данные
    loadAllData();
    
    // Включаем автосохранение
    setupAutoSave();
    
    console.log('✅ Система сохранения готова!');
    console.log('💡 Команды: checkSave(), clearSave(), saveAllData(), loadAllData()');
}

// Запуск
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
window.updateExpDisplay = updateExpDisplay;
