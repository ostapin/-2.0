const SAVE_KEY = 'dnd_character_data';

function saveAllData() {
    try {
        const allSkills = {};
        document.querySelectorAll('.skill-row').forEach(row => {
            const nameSpans = row.querySelectorAll('.skill-name span');
            let name = '';
            for (let span of nameSpans) {
                const text = span.textContent.trim();
                if (text && text !== '🎯' && text !== '🔮') {
                    name = text;
                    break;
                }
            }
            const value = row.querySelector('.skill-value')?.textContent?.trim();
            if (name) allSkills[name] = value;
        });

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
            skills: allSkills,
            savedAt: new Date().toISOString()
        };

        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        console.log('✅ Сохранено! Навыков:', Object.keys(allSkills).length);
        return true;
    } catch (e) {
        console.error('Ошибка сохранения:', e);
        return false;
    }
}

function loadAllData() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (!saved) {
            console.log('Нет сохранений');
            return false;
        }

        const data = JSON.parse(saved);
        console.log('📂 Загрузка... Навыков:', Object.keys(data.skills || {}).length);

        // Основные поля
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

        const levelEl = document.getElementById('currentLevel');
        if (levelEl) levelEl.innerText = data.level || '0';

        // Загружаем навыки
        if (data.skills) {
            document.querySelectorAll('.skill-row').forEach(row => {
                const nameSpans = row.querySelectorAll('.skill-name span');
                let name = '';
                for (let span of nameSpans) {
                    const text = span.textContent.trim();
                    if (text && text !== '🎯' && text !== '🔮') {
                        name = text;
                        break;
                    }
                }
                const valueSpan = row.querySelector('.skill-value');
                if (name && data.skills[name] !== undefined) {
                    valueSpan.textContent = data.skills[name];
                }
            });
        }

        console.log('✅ Загружено!');
        return true;
    } catch (e) {
        console.error('Ошибка загрузки:', e);
        return false;
    }
}

// ========== АВТОЗАГРУЗКА С ЗАДЕРЖКОЙ ==========
function initSaveSystem() {
    console.log('🚀 Инициализация...');
    
    // Ждем когда все элементы загрузятся
    setTimeout(function() {
        loadAllData();
    }, 500);
    
    // Еще одна попытка через 1 секунду (на случай если skills еще не отрендерились)
    setTimeout(function() {
        loadAllData();
    }, 1500);

    // Автосохранение
    document.addEventListener('change', function(e) {
        if (e.target.matches('input, select')) saveAllData();
    });

    document.addEventListener('input', function(e) {
        if (e.target.matches('input, select')) {
            clearTimeout(e.target._timer);
            e.target._timer = setTimeout(saveAllData, 500);
        }
    });

    window.addEventListener('beforeunload', saveAllData);
    console.log('✅ Система сохранения готова!');
}

// Запуск
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSaveSystem);
} else {
    initSaveSystem();
}

window.saveAllData = saveAllData;
window.loadAllData = loadAllData;
