function loadGlossary() {
    const metalsDiv = document.getElementById('glossaryMetals');
    if (!metalsDiv) return;
    
    let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
    
    // Перебираем все металлы из metalsData
    for (let key in metalsData) {
        const metal = metalsData[key];
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">${metal.name}</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-bottom: 10px;">
                    <div><span style="color: #b89a7a;">Состояние:</span> ${metal.stats.required_condition || '—'}</div>
                    <div><span style="color: #b89a7a;">МП:</span> ${metal.stats.magic_potential}</div>
                    <div><span style="color: #b89a7a;">Прочность:</span> ${metal.stats.durability}</div>
                    <div><span style="color: #b89a7a;">Сопротивление:</span> ${metal.stats.resistance}</div>
                    <div><span style="color: #b89a7a;">Вес:</span> ${metal.stats.weight || '—'}</div>
                    <div><span style="color: #b89a7a;">Цвет:</span> ${metal.stats.color}</div>
                    <div><span style="color: #b89a7a;">Цена слитка:</span> ${metal.price_per_ingot}</div>
                </div>
                <p style="color: #e0d0c0; margin-top: 10px; font-style: italic;">${metal.description}</p>
            </div>
        `;
    }
    
    html += '</div>';
    metalsDiv.innerHTML = html;
}

// Загружаем при открытии вкладки
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, активна ли вкладка глоссария
    if (document.getElementById('glossary-tab').classList.contains('active')) {
        loadGlossary();
    }
});

// Функция для вызова из кнопки таба
function openGlossaryTab() {
    openTab('glossary');
    loadGlossary();
}
