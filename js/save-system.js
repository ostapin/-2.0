const SAVE_KEY = 'dnd_character_data';

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
            skills: {}
        };

        // Сохраняем ВСЕ навыки (автоматически находит любые)
        document.querySelectorAll('.skill-row').forEach(row => {
            const nameSpan = row.querySelector('.skill-name span:last-child');
            const valueSpan = row.querySelector('.skill-value');
            if (nameSpan && valueSpan) {
                const name = nameSpan.textContent.trim();
                const value = valueSpan.textContent.trim();
                if (name && value) {
                    data.skills[name] = value;
                }
            }
        });

        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        console.log('✅ Сохранено! Навыков:', Object.keys(data.skills).length);
        return true;
    } catch (e) {
        console.error('Ошибка сохранения:', e);
        return false;
    }
}

function loadAllData() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (!saved) return false;

        const data = JSON.parse(saved);

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

        // Загружаем ВСЕ навыки
        if (data.skills) {
            document.querySelectorAll('.skill-row').forEach(row => {
                const nameSpan = row.querySelector('.skill-name span:last-child');
                const valueSpan = row.querySelector('.skill-value');
                if (nameSpan && valueSpan) {
                    const name = nameSpan.textContent.trim();
                    if (data.skills[name] !== undefined) {
                        valueSpan.textContent = data.skills[name];
                    }
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

// Запуск
document.addEventListener('DOMContentLoaded', function() {
    loadAllData();

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
    console.log('✅ Система сохранения готова');
});

window.saveAllData = saveAllData;
window.loadAllData = loadAllData;
