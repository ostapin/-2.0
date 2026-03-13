// Глобальные переменные
let allMetals = [];
let allWeapons = [];
let allArmor = [];

function loadGlossary() {
    // Загружаем данные
    allMetals = Object.values(metalsData);
    allWeapons = Object.values(weaponsData);
    allArmor = Object.values(armorData);
}

function formatResistance(value) {
    if (typeof value === 'string' && value.includes('%')) {
        return value;
    }
    if (typeof value === 'number') {
        return (value * 100) + '%';
    }
    return value || '0%';
}

function parseResistanceValue(value) {
    if (typeof value === 'string' && value.includes('%')) {
        return parseFloat(value) / 100;
    }
    if (typeof value === 'number') {
        return value;
    }
    return 0;
}

// ===== МЕТАЛЛЫ =====
function showMetals() {
    const metalsSection = document.getElementById('glossaryMetals');
    const metalsList = document.getElementById('metalsList');
    
    if (!metalsSection || !metalsList) return;
    
    metalsSection.style.display = 'block';
    document.getElementById('glossaryWeapons').style.display = 'none';
    document.getElementById('glossaryArmor').style.display = 'none';
    
    renderMetals(allMetals);
}

function renderMetals(metals) {
    const metalsList = document.getElementById('metalsList');
    if (!metalsList) return;
    
    let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
    
    metals.forEach(metal => {
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
                <div style="display: flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
                    <button class="btn btn-small" onclick="showWeaponsForMetal('${metal.id}')" style="background: #8b4513;">⚔️ Оружие</button>
                    <button class="btn btn-small" onclick="showArmorForMetal('${metal.id}')" style="background: #8b4513;">🛡️ Броня</button>
                </div>
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

// ===== ОРУЖИЕ =====
function showWeaponsForMetal(metalId) {
    const metal = metalsData[metalId];
    if (!metal) return;
    
    const weaponsSection = document.getElementById('glossaryWeapons');
    const weaponsList = document.getElementById('weaponsList');
    
    if (!weaponsSection || !weaponsList) return;
    
    weaponsSection.style.display = 'block';
    document.getElementById('glossaryMetals').style.display = 'none';
    document.getElementById('glossaryArmor').style.display = 'none';
    
    document.getElementById('weaponsTitle').innerHTML = `⚔️ Оружие из ${metal.name}`;
    
    let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
    
    allWeapons.forEach(weapon => {
        // Расчет характеристик
        const damage = (weapon.base_damage || 0) + metal.stats.durability;
        const durability = (weapon.base_durability || 0) + metal.stats.durability;
        const magic_potential = metal.stats.magic_potential * (weapon.craft_slots || 1);
        
        // Расчет цены
        let price = 0;
        let currency = '';
        const priceMatch = metal.price_per_ingot.match(/(\d+)\s*(.+)/);
        if (priceMatch) {
            const metalPrice = parseInt(priceMatch[1]);
            currency = priceMatch[2];
            price = metalPrice * (weapon.craft_slots || 1);
        }
        
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">${metal.name} ${weapon.name}</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;">
                    <div><span style="color: #b89a7a;">Урон:</span> ${damage}</div>
                    <div><span style="color: #b89a7a;">Прочность:</span> ${durability}</div>
                    <div><span style="color: #b89a7a;">МП:</span> ${magic_potential} (${magic_potential * 5}% усиления)</div>
                    <div><span style="color: #b89a7a;">Цена:</span> ${price} ${currency}</div>
                    <div><span style="color: #b89a7a;">Крафт:</span> ${weapon.craft_slots} слитков ${weapon.leather ? `+ ${weapon.leather} кожи` : ''}</div>
                </div>
            </div>
        `;
    });
    
    html += '<div style="text-align: center; margin-top: 20px;"><button class="btn btn-roll" onclick="showMetals()">🔙 Назад к металлам</button></div>';
    html += '</div>';
    
    weaponsList.innerHTML = html;
}

// ===== БРОНЯ =====
function showArmorForMetal(metalId) {
    const metal = metalsData[metalId];
    if (!metal) return;
    
    const armorSection = document.getElementById('glossaryArmor');
    const armorList = document.getElementById('armorList');
    
    if (!armorSection || !armorList) return;
    
    armorSection.style.display = 'block';
    document.getElementById('glossaryMetals').style.display = 'none';
    document.getElementById('glossaryWeapons').style.display = 'none';
    
    document.getElementById('armorTitle').innerHTML = `🛡️ Броня из ${metal.name}`;
    
    let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
    
    allArmor.forEach(armor => {
        // Расчет характеристик
        const defense = (armor.base_defense || 0) + metal.stats.durability;
        const durability = (armor.base_durability || 0) + metal.stats.durability;
        
        // Магический потенциал (все слитки)
        const magic_potential = metal.stats.magic_potential * (armor.craft_slots || 1);
        
        // Сопротивление (30% слитков, макс 10)
        let effectiveSlots = Math.floor((armor.craft_slots || 1) * 0.3);
        if (effectiveSlots > 10) effectiveSlots = 10;
        const resistanceValue = parseResistanceValue(metal.stats.resistance);
        const resistance = Math.round(resistanceValue * effectiveSlots * 100) + '%';
        
        // Расчет цены
        let price = 0;
        let currency = '';
        const priceMatch = metal.price_per_ingot.match(/(\d+)\s*(.+)/);
        if (priceMatch) {
            const metalPrice = parseInt(priceMatch[1]);
            currency = priceMatch[2];
            price = metalPrice * (armor.craft_slots || 1);
        }
        
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">${metal.name} ${armor.name}</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;">
                    <div><span style="color: #b89a7a;">Защита:</span> ${defense}</div>
                    <div><span style="color: #b89a7a;">Прочность:</span> ${durability}</div>
                    <div><span style="color: #b89a7a;">МП:</span> ${magic_potential} (${magic_potential * 5}% усиления)</div>
                    <div><span style="color: #b89a7a;">Сопротивление:</span> ${resistance}</div>
                    <div><span style="color: #b89a7a;">Цена:</span> ${price} ${currency}</div>
                    <div><span style="color: #b89a7a;">Крафт:</span> ${armor.craft_slots} слитков ${armor.leather ? `+ ${armor.leather} кожи` : ''}</div>
                </div>
            </div>
        `;
    });
    
    html += '<div style="text-align: center; margin-top: 20px;"><button class="btn btn-roll" onclick="showMetals()">🔙 Назад к металлам</button></div>';
    html += '</div>';
    
    armorList.innerHTML = html;
}

function searchMetals() {
    const searchText = document.getElementById('glossarySearch').value.toLowerCase();
    
    if (searchText.length < 2) {
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
    
    document.getElementById('glossaryMetals').style.display = 'block';
    document.getElementById('glossaryWeapons').style.display = 'none';
    document.getElementById('glossaryArmor').style.display = 'none';
}

// Загружаем данные при старте
document.addEventListener('DOMContentLoaded', loadGlossary);
