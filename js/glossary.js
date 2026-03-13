// Глобальная переменная для хранения всех металлов
let allMetals = [];

function loadGlossary() {
    // Загружаем данные из metalsData
    allMetals = Object.values(metalsData);
}

function formatResistance(value) {
    if (typeof value === 'string' && value.includes('%')) {
        return value; // уже процент
    }
    if (typeof value === 'number') {
        return (value * 100) + '%'; // 0.05 → 5%
    }
    return value || '0%';
}

function showMetals() {
    const metalsSection = document.getElementById('glossaryMetals');
    const metalsList = document.getElementById('metalsList');
    
    if (!metalsSection || !metalsList) return;
    
    // Показываем секцию
    metalsSection.style.display = 'block';
    
    // Рендерим металлы
    renderMetals(allMetals);
}

function renderMetals(metals) {
    const metalsList = document.getElementById('metalsList');
    if (!metalsList) return;
    
    let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
    
    metals.forEach(metal => {
        // Формируем блок навыков, если они есть
        let skillsHtml = '';
        if (metal.skills && metal.skills.length > 0) {
            skillsHtml = '<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #8b4513;">';
            skillsHtml += '<span style="color: #d4af37; font-weight: bold;">✨ Особые свойства:</span>';
            skillsHtml += '<ul style="margin-top: 5px; padding-left: 20px;">';
            metal.skills.forEach(skill => {
                skillsHtml += `<li style="color: #e0d0c0; margin-bottom: 3px;">${skill}</li>`;
            });
            skillsHtml += '</ul></div>';
        }
        
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">${metal.name}</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-bottom: 10px;">
                    <div><span style="color: #b89a7a;">МП:</span> ${metal.stats.magic_potential}</div>
                    <div><span style="color: #b89a7a;">Прочность:</span> ${metal.stats.durability}</div>
                    <div><span style="color: #b89a7a;">Сопротивление:</span> ${formatResistance(metal.stats.resistance)}</div>
                    <div><span style="color: #b89a7a;">Цвет:</span> ${metal.stats.color}</div>
                    <div><span style="color: #b89a7a;">Цена слитка:</span> ${metal.price_per_ingot}</div>
                </div>
                <p style="color: #e0d0c0; margin-top: 10px; font-style: italic;">${metal.description}</p>
                ${skillsHtml}
            </div>
        `;
    });
    
    html += '</div>';
    metalsList.innerHTML = html;
}

function searchMetals() {
    const searchText = document.getElementById('glossarySearch').value.toLowerCase();
    
    if (searchText.length < 2) {
        // Если мало символов, показываем пусто
        document.getElementById('metalsList').innerHTML = '<p style="color: #8b7d6b; text-align: center;">Введите минимум 2 символа для поиска</p>';
        return;
    }
    
    const filtered = allMetals.filter(metal => 
        metal.name.toLowerCase().includes(searchText) || 
        metal.description.toLowerCase().includes(searchText)
    );
    
    if (filtered.length === 0) {
        document.getElementById('metalsList').innerHTML = '<p style="color: #8b7d6b; text-align: center;">Ничего не найдено</p>';
    } else {
        renderMetals(filtered);
    }
    
    // Показываем секцию если скрыта
    document.getElementById('glossaryMetals').style.display = 'block';
}

// Загружаем данные при старте
document.addEventListener('DOMContentLoaded', loadGlossary);
