// 08-other-systems.js - Перки, зачарование, алхимия, руны, формация, ремесло, кузнечное дело
function renderPerks() {
    const resultsList = document.getElementById('resultsList');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!resultsList) return;
    
    resultsTitle.innerHTML = '✨ Перки';
    
    if (typeof perksData === 'undefined') {
        resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные о перках не загружены</p>';
        return;
    }
    
    let html = `
        <div style="background: #3d2418; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">✨ Что такое перки?</h3>
            <p style="color: #e0d0c0; margin-bottom: 10px;">Когда навык персонажа достигает 20 уровня, ему становятся доступны особые способности — <strong>перки</strong>.</p>
            <p style="color: #e0d0c0; margin-bottom: 10px;">Каждый перк стоит <strong>10 очков</strong> для распределения.</p>
            <p style="color: #e0d0c0; margin-bottom: 5px;">Перки делятся на два типа:</p>
            <ul style="color: #e0d0c0; margin-left: 20px;">
                <li><span style="color: #2ecc71;">● Пассивные</span> — действуют постоянно, не требуют активации.</li>
                <li><span style="color: #e67e22;">● Активные</span> — можно использовать <strong>1 раз в сутки</strong> для конкретных целей.</li>
            </ul>
        </div>
    `;
    
    const skills = Object.keys(perksData);
    
    html += `
        <div style="background: #3d2418; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
            <label style="color: #d4af37; display: block; margin-bottom: 10px;">Выберите навык:</label>
            <select id="perkSkillSelect" style="width: 100%; padding: 10px; background: #1a0f0b; color: #e0d0c0; border: 2px solid #8b4513; border-radius: 4px;">
                <option value="">-- Выберите навык --</option>
                ${skills.map(skill => `<option value="${skill}">${skill}</option>`).join('')}
            </select>
        </div>
        <div id="perksContainer"></div>
    `;
    
    resultsList.innerHTML = html;
    
    const skillSelect = document.getElementById('perkSkillSelect');
    if (skillSelect) {
        skillSelect.addEventListener('change', function() {
            const selectedSkill = this.value;
            const container = document.getElementById('perksContainer');
            
            if (!selectedSkill || !perksData[selectedSkill]) {
                container.innerHTML = '<p style="color: #8b7d6b; text-align: center;">Выберите навык для просмотра перков</p>';
                return;
            }
            
            const perks = perksData[selectedSkill];
            let perksHtml = '<div style="display: flex; flex-direction: column; gap: 15px;">';
            
            perks.forEach(perk => {
                let typeColor = '#2ecc71';
                if (perk.type.includes('Активный')) {
                    typeColor = '#e67e22';
                }
                
                perksHtml += `
                    <div style="background: #2a1a0f; border-radius: 6px; padding: 15px; border-left: 4px solid ${typeColor};">
                        <h4 style="color: #d4af37; margin-bottom: 8px;">✨ ${perk.name}</h4>
                        <p style="color: #b89a7a; margin-bottom: 8px; font-size: 0.9em;">Тип: <span style="color: ${typeColor};">${perk.type}</span></p>
                        <p style="color: #e0d0c0;">${perk.description}</p>
                    </div>
                `;
            });
            
            perksHtml += '</div>';
            container.innerHTML = perksHtml;
        });
    }
}

function renderEnchanting() {
    const resultsList = document.getElementById('resultsList');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!resultsList) return;
    
    resultsTitle.innerHTML = '🔮 Зачарование';
    
    if (typeof enchantingData === 'undefined') {
        resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные о зачаровании не загружены</p>';
        return;
    }
    
    resultsList.innerHTML = enchantingData.introduction;
}

function renderAlchemy() {
    const resultsList = document.getElementById('resultsList');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!resultsList) return;
    
    resultsTitle.innerHTML = '🧪 Алхимия';
    
    if (typeof alchemyData === 'undefined') {
        resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные об алхимии не загружены</p>';
        return;
    }
    
    renderAlchemyContent();
}

function renderRunes() {
    const resultsList = document.getElementById('resultsList');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!resultsList) return;
    
    resultsTitle.innerHTML = '⚡ Руны';
    
    if (typeof runesData === 'undefined') {
        resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные о рунах не загружены</p>';
        return;
    }
    
    renderRunesContent();
}

function renderFormation() {
    const resultsList = document.getElementById('resultsList');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!resultsList) return;
    
    resultsTitle.innerHTML = '🔮 Формация';
    
    if (typeof formationData === 'undefined') {
        resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные о формациях не загружены</p>';
        return;
    }
    
    renderFormationContent();
}

function renderCrafting() {
    const resultsList = document.getElementById('resultsList');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!resultsList) return;
    
    resultsTitle.innerHTML = '🛠️ Ремесло';
    
    if (typeof craftingData === 'undefined') {
        resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные о ремесле не загружены</p>';
        return;
    }
    
    renderCraftingContent();
}

function renderSmithing() {
    const resultsList = document.getElementById('resultsList');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!resultsList) return;
    
    resultsTitle.innerHTML = '⚒️ Кузнечное дело';
    
    if (typeof smithingData === 'undefined') {
        resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные о кузнечном деле не загружены</p>';
        return;
    }
    
    renderSmithingContent();
}
