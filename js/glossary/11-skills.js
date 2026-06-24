// 11-skills.js - Навыки
function renderSkills() {
    const resultsList = document.getElementById('resultsList');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!resultsList) return;
    
    resultsTitle.innerHTML = '🎯 Навыки';
    
    const skillNames = {
        'heavy_armor': 'Тяжёлая броня',
        'light_armor': 'Лёгкая броня',
        'two_handed': 'Двуручное оружие',
        'one_handed': 'Одноручное оружие',
        'shooting': 'Стрельба',
        'blocking': 'Блокирование',
        'polearm': 'Древковое',
        'hand_to_hand': 'Рукопашный бой',
        'throwing': 'Метание',
        'stealth': 'Скрытность',
        'eloquence': 'Красноречие',
        'dexterity': 'Ловкость',
        'endurance': 'Выносливость',
        'hacking': 'Взлом',
        'perception': 'Восприятие',
        'luck': 'Удача',
        'pickpocket': 'Карманные кражи',
        'alchemy': 'Алхимия',
        'smithing': 'Кузнечное дело',
        'enchanting': 'Зачарование',
        'crafting': 'Ремесло',
        'formations': 'Формации',
        'runes': 'Руны',
        'water_magic': 'Магия воды',
        'earth_magic': 'Магия земли',
        'air_magic': 'Магия воздуха',
        'blood_magic': 'Магия крови',
        'fire_magic': 'Магия огня',
        'metal_magic': 'Магия металла',
        'nature_magic': 'Магия природы',
        'light_magic': 'Магия света',
        'dark_magic': 'Магия тьмы',
        'inferno_magic': 'Магия инферно',
        'chaos_magic': 'Магия хаоса',
        'mind_magic': 'Магия разума',
        'life_magic': 'Магия жизни',
        'death_magic': 'Магия смерти',
        'void_magic': 'Магия пустоты',
        'energy_magic': 'Магия энергии'
    };
    
    const skillTypes = {
        'heavy_armor': 'Боевой',
        'light_armor': 'Боевой',
        'two_handed': 'Боевой',
        'one_handed': 'Боевой',
        'shooting': 'Боевой',
        'blocking': 'Боевой',
        'polearm': 'Боевой',
        'hand_to_hand': 'Боевой',
        'throwing': 'Боевой',
        'stealth': 'Общий',
        'eloquence': 'Общий',
        'dexterity': 'Общий',
        'endurance': 'Общий',
        'hacking': 'Общий',
        'perception': 'Общий',
        'luck': 'Общий',
        'pickpocket': 'Общий',
        'alchemy': 'Ремесло',
        'smithing': 'Ремесло',
        'enchanting': 'Ремесло',
        'crafting': 'Ремесло',
        'formations': 'Ремесло',
        'runes': 'Ремесло',
        'water_magic': 'Магия',
        'earth_magic': 'Магия',
        'air_magic': 'Магия',
        'blood_magic': 'Магия',
        'fire_magic': 'Магия',
        'metal_magic': 'Магия',
        'nature_magic': 'Магия',
        'light_magic': 'Магия',
        'dark_magic': 'Магия',
        'inferno_magic': 'Магия',
        'chaos_magic': 'Магия',
        'mind_magic': 'Магия',
        'life_magic': 'Магия',
        'death_magic': 'Магия',
        'void_magic': 'Магия',
        'energy_magic': 'Магия'
    };
    
    let html = '<div style="display: flex; flex-direction: column; gap: 10px;">';
    
    Object.entries(skillNames).forEach(([key, name]) => {
        const type = skillTypes[key] || 'Навык';
        let color = '#d4af37';
        if (type === 'Боевой') color = '#e74c3c';
        else if (type === 'Общий') color = '#3498db';
        else if (type === 'Ремесло') color = '#2ecc71';
        else if (type === 'Магия') color = '#9b59b6';
        
        html += `
            <div style="background: #3d2418; border-radius: 4px; padding: 12px 15px; border-left: 4px solid ${color}; cursor: pointer;" onclick="selectSubcategory('${key}')">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #d4af37; font-weight: bold;">${name}</span>
                    <span style="color: #b89a7a; font-size: 0.85em;">${type}</span>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    resultsList.innerHTML = html;
}
