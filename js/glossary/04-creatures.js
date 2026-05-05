// 04-creatures.js - Существа (животные, нежить, демоны, великаны)
function filterCreatures(searchText) {
    let filtered = [...allCreatures];
    
    if (searchText && searchText.length >= 2) {
        filtered = filtered.filter(creature => 
            creature.name.toLowerCase().includes(searchText) || 
            creature.description.toLowerCase().includes(searchText)
        );
    }
    
    return filtered;
}

function renderCreatures(creatures) {
    const resultsList = document.getElementById('resultsList');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!resultsList) return;
    
    resultsTitle.innerHTML = '🐄 Животные';
    
    if (creatures.length === 0) {
        resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Ничего не найдено</p>';
        return;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
    
    creatures.forEach(creature => {
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">🐾 ${creature.name}</h3>
                <p style="color: #e0d0c0; margin-bottom: 10px; font-style: italic;">${creature.description}</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
                    <div><span style="color: #b89a7a;">Цена за тушу:</span> ${creature.price_carcass}</div>
                    <div><span style="color: #b89a7a;">Цена за живого:</span> ${creature.price_alive}</div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    resultsList.innerHTML = html;
}

function renderUndead() {
    const resultsList = document.getElementById('resultsList');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!resultsList) return;
    
    resultsTitle.innerHTML = '💀 Нежить';
    
    if (typeof undeadData === 'undefined') {
        resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные о нежити не загружены</p>';
        return;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
    
    if (undeadData.general && undeadData.general.description) {
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">📜 Легенда о происхождении</h3>
                <p style="color: #e0d0c0; font-style: italic; white-space: pre-line;">${undeadData.general.description}</p>
            </div>
        `;
    }
    
    if (undeadData.necromancy) {
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">📖 Что такое некромантия?</h3>
                <p style="color: #e0d0c0; white-space: pre-line;">${undeadData.necromancy}</p>
            </div>
        `;
    }
    
    if (undeadData.traits && undeadData.traits.length > 0) {
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">⚙️ Особенности нежити</h3>
                <div style="color: #e0d0c0;">
        `;
        undeadData.traits.forEach(trait => {
            html += `<p style="margin-bottom: 10px;">${trait}</p>`;
        });
        html += `</div></div>`;
    }
    
    const groups = [
        { key: 'low', name: 'Низшая нежить', icon: '🦴' },
        { key: 'intelligent', name: 'Разумная нежить', icon: '🧠' },
        { key: 'high', name: 'Высшая нежить', icon: '👑' },
        { key: 'incorporeal', name: 'Бесплотные', icon: '👻' }
    ];
    
    groups.forEach(group => {
        if (undeadData.groups && undeadData.groups[group.key]) {
            const groupData = undeadData.groups[group.key];
            const creatures = Object.values(groupData.creatures || {});
            
            if (creatures.length > 0) {
                html += `
                    <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                        <h3 style="color: #d4af37; margin-bottom: 15px;">${group.icon} ${group.name}</h3>
                `;
                
                creatures.forEach(creature => {
                    html += `
                        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
                            <h4 style="color: #d4af37; margin-bottom: 10px; font-size: 1.2em;">${creature.name}</h4>
                            
                            ${creature.lore ? `<p style="color: #b89a7a; margin-bottom: 8px;"><strong>Справка:</strong> ${creature.lore}</p>` : ''}
                            ${creature.appearance ? `<p style="color: #e0d0c0; font-style: italic; margin-bottom: 8px;"><strong>Описание внешности:</strong> ${creature.appearance}</p>` : ''}
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; margin: 10px 0;">
                                ${creature.hp ? `<div><span style="color: #b89a7a;">❤️ ХП:</span> ${creature.hp}</div>` : ''}
                                ${creature.skills ? `<div><span style="color: #b89a7a;">⚔️ Общие навыки:</span> ${creature.skills}</div>` : ''}
                                ${creature.class_skills ? `<div><span style="color: #b89a7a;">🔮 Классовые навыки:</span> ${creature.class_skills}</div>` : ''}
                            </div>
                            
                            ${creature.other_skills ? `<p style="color: #e0d0c0; margin: 5px 0;"><strong>Прочие навыки:</strong> ${creature.other_skills}</p>` : ''}
                            
                            ${creature.variants ? `
                                <div style="margin-top: 10px;">
                                    <span style="color: #d4af37;">Разновидности:</span>
                                    <ul style="color: #e0d0c0; margin-left: 20px; margin-top: 5px;">
                                        ${creature.variants.map(v => `<li>${v}</li>`).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                        </div>
                    `;
                });
                
                html += `</div>`;
            }
        }
    });
    
    html += '</div>';
    resultsList.innerHTML = html;
}

function renderDemons() {
    const resultsList = document.getElementById('resultsList');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!resultsList) return;
    
    resultsTitle.innerHTML = '👿 Демоны';
    
    if (typeof demonsData === 'undefined') {
        resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные о демонах не загружены</p>';
        return;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
    
    if (demonsData.general && demonsData.general.description) {
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">📜 Легенда о происхождении</h3>
                <p style="color: #e0d0c0; font-style: italic; white-space: pre-line;">${demonsData.general.description}</p>
            </div>
        `;
    }
    
    if (demonsData.demonology) {
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">📖 Устройство Плана Демонов</h3>
                <p style="color: #e0d0c0; white-space: pre-line;">${demonsData.demonology}</p>
            </div>
        `;
    }
    
    if (demonsData.traits && demonsData.traits.length > 0) {
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">⚙️ Особенности демонов</h3>
                <div style="color: #e0d0c0;">
        `;
        demonsData.traits.forEach(trait => {
            html += `<p style="margin-bottom: 10px;">${trait}</p>`;
        });
        html += `</div></div>`;
    }
    
    if (demonsData.groups) {
        const groups = Object.values(demonsData.groups);
        groups.forEach(group => {
            const creatures = Object.values(group.creatures || {});
            
            if (creatures.length > 0) {
                html += `
                    <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                        <h3 style="color: #d4af37; margin-bottom: 15px;">👿 ${group.name}</h3>
                `;
                
                creatures.forEach(creature => {
                    html += `
                        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
                            <h4 style="color: #d4af37; margin-bottom: 10px; font-size: 1.2em;">${creature.name}</h4>
                            
                            ${creature.lore ? `<p style="color: #b89a7a; margin-bottom: 8px;"><strong>Справка:</strong> ${creature.lore}</p>` : ''}
                            ${creature.appearance ? `<p style="color: #e0d0c0; font-style: italic; margin-bottom: 8px;"><strong>Описание внешности:</strong> ${creature.appearance}</p>` : ''}
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; margin: 10px 0;">
                                ${creature.hp ? `<div><span style="color: #b89a7a;">❤️ ХП:</span> ${creature.hp}</div>` : ''}
                                ${creature.skills ? `<div><span style="color: #b89a7a;">⚔️ Навыки:</span> ${creature.skills}</div>` : ''}
                            </div>
                            
                            ${creature.other_skills ? `<p style="color: #e0d0c0; margin: 5px 0;"><strong>Прочие навыки:</strong> ${creature.other_skills}</p>` : ''}
                        </div>
                    `;
                });
                
                html += `</div>`;
            }
        });
    }
    
    html += '</div>';
    resultsList.innerHTML = html;
}

function renderGiants() {
    const resultsList = document.getElementById('resultsList');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!resultsList) return;
    
    resultsTitle.innerHTML = '🪨 Великаны';
    
    if (typeof giantsData === 'undefined') {
        resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные о великанах не загружены</p>';
        return;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
    
    if (giantsData.general && giantsData.general.description) {
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">📜 Легенда о происхождении</h3>
                <p style="color: #e0d0c0; font-style: italic; white-space: pre-line;">${giantsData.general.description}</p>
            </div>
        `;
    }
    
    if (giantsData.giant_lore) {
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">📖 О великанах</h3>
                <p style="color: #e0d0c0; white-space: pre-line;">${giantsData.giant_lore}</p>
            </div>
        `;
    }
    
    if (giantsData.traits && giantsData.traits.length > 0) {
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">⚙️ Особенности великанов</h3>
                <div style="color: #e0d0c0;">
        `;
        giantsData.traits.forEach(trait => {
            html += `<p style="margin-bottom: 10px;">${trait}</p>`;
        });
        html += `</div></div>`;
    }
    
    if (giantsData.groups) {
        const groups = Object.values(giantsData.groups);
        groups.forEach(group => {
            const creatures = Object.values(group.creatures || {});
            
            if (creatures.length > 0) {
                html += `
                    <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                        <h3 style="color: #d4af37; margin-bottom: 15px;">🪨 ${group.name}</h3>
                `;
                
                creatures.forEach(creature => {
                    html += `
                        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
                            <h4 style="color: #d4af37; margin-bottom: 10px; font-size: 1.2em;">${creature.name}</h4>
                            
                            ${creature.lore ? `<p style="color: #b89a7a; margin-bottom: 8px;"><strong>Справка:</strong> ${creature.lore}</p>` : ''}
                            ${creature.appearance ? `<p style="color: #e0d0c0; font-style: italic; margin-bottom: 8px;"><strong>Описание внешности:</strong> ${creature.appearance}</p>` : ''}
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; margin: 10px 0;">
                                ${creature.hp ? `<div><span style="color: #b89a7a;">❤️ ХП:</span> ${creature.hp}</div>` : ''}
                                ${creature.skills ? `<div><span style="color: #b89a7a;">⚔️ Навыки:</span> ${creature.skills}</div>` : ''}
                            </div>
                            
                            ${creature.other_skills ? `<p style="color: #e0d0c0; margin: 5px 0;"><strong>Прочие навыки:</strong> ${creature.other_skills}</p>` : ''}
                        </div>
                    `;
                });
                
                html += `</div>`;
            }
        });
    }
    
    html += '</div>';
    resultsList.innerHTML = html;
}
