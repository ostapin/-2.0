// Перезаписываем loadAllData прямо в браузере
window.loadAllData = function() {
    console.log('🔄 НОВАЯ загрузка...');
    const saved = localStorage.getItem('dnd_character_data');
    if (!saved) {
        console.log('Нет сохранений');
        return false;
    }
    
    const data = JSON.parse(saved);
    console.log('📂 Данные загружены, навыков:', Object.keys(data.skills || {}).length);
    
    // Основные поля
    const fields = ['characterName','characterSurname','characterTitle','characterRace',
                    'characterHeritage','characterHeight','characterWeight','characterAge',
                    'health','mana','stamina','currentExp','freePoints'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el && data[id] !== undefined) el.value = data[id];
    });
    
    const levelEl = document.getElementById('currentLevel');
    if (levelEl) levelEl.innerText = data.level || '0';
    
    // Навыки
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
        console.log('✅ Загружено навыков:', Object.keys(data.skills).length);
    }
    return true;
};

// Сохраняем данные заново
function forceSaveNow() {
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
    
    const data = JSON.parse(localStorage.getItem('dnd_character_data') || '{}');
    data.skills = allSkills;
    localStorage.setItem('dnd_character_data', JSON.stringify(data));
    console.log('✅ Сохранено навыков:', Object.keys(allSkills).length);
}

// Сохраняем и загружаем
forceSaveNow();
window.loadAllData();
