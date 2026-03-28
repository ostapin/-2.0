// Глобальные переменные
let allMetals = [];
let allWeapons = [];
let allArmor = [];
let allCreatures = [];
let allItems = [];
let currencyRates = {};
let allCurrencies = [];

let currentCategory = '';
let currentSubcategory = '';

function loadGlossary() {
    // Загружаем данные
    allMetals = Object.values(metalsData);
    allWeapons = Object.values(weaponsData);
    allArmor = Object.values(armorData);
    
    // Загружаем животных
    if (typeof creaturesData !== 'undefined') {
        allCreatures = Object.values(creaturesData);
    }
    
    // Загружаем курсы валют
    if (typeof currencyData !== 'undefined') {
        currencyRates = currencyData;
        allCurrencies = Object.values(currencyData);
        allCurrencies.sort((a, b) => a.order - b.order);
    }
    
    // Создаем объединенный массив предметов
    buildAllItems();
}

function selectCategory(category) {
    currentCategory = category;
    currentSubcategory = '';
    
    // Скрываем все подкатегории
    document.getElementById('itemsSubcategory').style.display = 'none';
    document.getElementById('creaturesSubcategory').style.display = 'none';
    document.getElementById('magicSubcategory').style.display = 'none';
    document.getElementById('systemSubcategory').style.display = 'none';
    
    // Показываем нужную подкатегорию
    if (category === 'items') {
        document.getElementById('itemsSubcategory').style.display = 'block';
    } else if (category === 'creatures') {
        document.getElementById('creaturesSubcategory').style.display = 'block';
    } else if (category === 'magic') {
        document.getElementById('magicSubcategory').style.display = 'block';
    } else if (category === 'system') {
        document.getElementById('systemSubcategory').style.display = 'block';
    }
    
    document.getElementById('resultsTitle').innerHTML = '📋 Выберите подкатегорию';
    document.getElementById('resultsList').innerHTML = '<p style="color: #8b7d6b; text-align: center;">Нажмите на подкатегорию</p>';
}

function selectSubcategory(subcategory) {
    currentSubcategory = subcategory;
    
    // Очищаем поиск
    document.getElementById('glossarySearch').value = '';
    document.getElementById('priceMin').value = '';
    document.getElementById('priceMax').value = '';
    document.getElementById('glossarySort').value = 'name_asc';
    
    // Применяем фильтры
    applyFilters();
}

function getCurrencyIdFromString(priceString) {
    const str = priceString.toLowerCase();
    
    if (str.includes('мед')) return 'copper';
    if (str.includes('сереб')) return 'silver';
    if (str.includes('золот')) return 'gold';
    if (str.includes('платин')) return 'platinum';
    
    if (str.includes('кристалл эфира') || str.includes('кристаллов эфира')) {
        if (str.includes('бесцветный') || str.includes('colorless')) return 'colorless_ether';
        return 'colored_ether';
    }
    
    if (str.includes('кров')) return 'blood_sphere';
    if (str.includes('льд') || str.includes('ice')) return 'ice_sphere';
    if (str.includes('огн') || str.includes('fire')) return 'fire_sphere';
    if (str.includes('земл') || str.includes('earth')) return 'earth_sphere';
    if (str.includes('вод') || str.includes('water')) return 'water_sphere';
    if (str.includes('молн') || str.includes('lightning')) return 'lightning_sphere';
    
    if (str.includes('янтар') || str.includes('amber') || str.includes('сфер')) return 'amber_sphere';
    
    return 'copper';
}

function convertToBaseValue(amount, currencyId) {
    const currency = currencyRates[currencyId];
    if (!currency) return amount;
    return amount * currency.base_value;
}

function formatPrice(amount, currencyId) {
    const currency = currencyRates[currencyId];
    if (!currency) return `${amount}`;
    return `${amount} ${currency.name}`;
}

function extractPrice(priceString) {
    const match = priceString.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
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

function buildAllItems() {
    allItems = [];
    
    allMetals.forEach(metal => {
        const priceAmount = extractPrice(metal.price_per_ingot);
        const currencyId = getCurrencyIdFromString(metal.price_per_ingot);
        const baseValue = convertToBaseValue(priceAmount, currencyId);
        
        allItems.push({
            id: metal.id,
            type: 'metal',
            category: 'Металл',
            name: metal.name,
            description: metal.description,
            price: priceAmount,
            currency: currencyId,
            base_value: baseValue,
            durability: metal.stats.durability,
            magic_potential: metal.stats.magic_potential,
            resistance: metal.stats.resistance,
            metal: metal
        });
    });
    
    allMetals.forEach(metal => {
        const priceAmount = extractPrice(metal.price_per_ingot);
        const currencyId = getCurrencyIdFromString(metal.price_per_ingot);
        const metalBaseValue = convertToBaseValue(priceAmount, currencyId);
        
        allWeapons.forEach(weapon => {
            const slots = weapon.craft_slots || 1;
            const itemPrice = priceAmount * slots;
            const baseValue = metalBaseValue * slots;
            const durability = (weapon.base_durability || 0) + metal.stats.durability;
            const magic_potential = metal.stats.magic_potential * slots;
            
            allItems.push({
                id: `${metal.id}_${weapon.name}`,
                type: 'weapon',
                category: 'Оружие',
                name: `${metal.name} ${weapon.name}`,
                description: `Оружие из ${metal.name}`,
                price: itemPrice,
                currency: currencyId,
                base_value: baseValue,
                durability: durability,
                magic_potential: magic_potential,
                damage: (weapon.base_damage || 0) + metal.stats.durability,
                metal: metal,
                weapon: weapon
            });
        });
    });
    
    allMetals.forEach(metal => {
        const priceAmount = extractPrice(metal.price_per_ingot);
        const currencyId = getCurrencyIdFromString(metal.price_per_ingot);
        const metalBaseValue = convertToBaseValue(priceAmount, currencyId);
        
        allArmor.forEach(armor => {
            const slots = armor.craft_slots || 1;
            const itemPrice = priceAmount * slots;
            const baseValue = metalBaseValue * slots;
            const durability = (armor.base_durability || 0) + metal.stats.durability;
            const magic_potential = metal.stats.magic_potential * slots;
            
            let effectiveSlots = Math.floor(slots * 0.3);
            if (effectiveSlots > 10) effectiveSlots = 10;
            const resistanceValue = parseResistanceValue(metal.stats.resistance);
            const resistance = resistanceValue * effectiveSlots;
            
            allItems.push({
                id: `${metal.id}_${armor.name}`,
                type: 'armor',
                category: 'Броня',
                name: `${metal.name} ${armor.name}`,
                description: `Броня из ${metal.name}`,
                price: itemPrice,
                currency: currencyId,
                base_value: baseValue,
                durability: durability,
                magic_potential: magic_potential,
                defense: (armor.base_defense || 0) + metal.stats.durability,
                resistance: resistance,
                resistance_text: Math.round(resistance * 100) + '%',
                metal: metal,
                armor: armor
            });
        });
    });
}

function filterCurrencies(searchText, minBase, maxBase) {
    let filtered = [...allCurrencies];
    
    if (searchText && searchText.length >= 2) {
        filtered = filtered.filter(currency => 
            currency.name.toLowerCase().includes(searchText)
        );
    }
    
    if (minBase > 0 || maxBase < Infinity) {
        filtered = filtered.filter(currency => {
            return currency.base_value >= minBase && currency.base_value <= maxBase;
        });
    }
    
    return filtered;
}

function renderCurrencies(currencies) {
    const resultsList = document.getElementById('resultsList');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!resultsList) return;
    
    resultsTitle.innerHTML = '💰 Валюта';
    
    if (currencies.length === 0) {
        resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Ничего не найдено</p>';
        return;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
    
    currencies.forEach((currency, index) => {
        const nextCurrency = allCurrencies[index + 1];
        
        let rateText = '';
        if (nextCurrency) {
            const rate = nextCurrency.base_value / currency.base_value;
            rateText = `<div><span style="color: #b89a7a;">${rate} ${currency.name} =</span> 1 ${nextCurrency.name}</div>`;
        }
        
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">💰 ${currency.name}</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; margin-bottom: 10px;">
                    <div><span style="color: #b89a7a;">1 ${currency.name} =</span> ${currency.base_value} 🟤 Медных</div>
                    ${rateText}
                </div>
                <p style="color: #e0d0c0; margin-top: 10px; font-style: italic; border-top: 1px solid #8b4513; padding-top: 10px;">
                    ${currency.description || 'Нет описания'}
                </p>
            </div>
        `;
    });
    
    html += '</div>';
    resultsList.innerHTML = html;
}

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

// Отображение магии
function renderMagic() {
    const resultsList = document.getElementById('resultsList');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!resultsList) return;
    
    resultsTitle.innerHTML = '🔮 Магия';
    
    if (typeof magicData === 'undefined') {
        resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные о магии не загружены</p>';
        return;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
    
    if (currentSubcategory === 'spells') {
        // Показываем все школы магии
        const schools = Object.values(magicData.spells);
        
        schools.forEach(school => {
            const spells = Object.values(school.schools || {});
            
            if (spells.length > 0) {
                html += `
                    <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                        <h3 style="color: #d4af37; margin-bottom: 15px;">🔮 ${school.name}</h3>
                `;
                
                spells.forEach(spell => {
                    html += `
                        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
                            <h4 style="color: #d4af37; margin-bottom: 10px; font-size: 1.2em;">${spell.name}</h4>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; margin: 10px 0;">
                                ${spell.level ? `<div><span style="color: #b89a7a;">📊 Уровень:</span> ${spell.level}</div>` : ''}
                                ${spell.type ? `<div><span style="color: #b89a7a;">🎯 Тип:</span> ${spell.type}</div>` : ''}
                                ${spell.cast_time ? `<div><span style="color: #b89a7a;">⏱️ Время каста:</span> ${spell.cast_time}</div>` : ''}
                                ${spell.duration ? `<div><span style="color: #b89a7a;">⌛ Длительность:</span> ${spell.duration}</div>` : ''}
                                ${spell.cooldown ? `<div><span style="color: #b89a7a;">🔄 Перезарядка:</span> ${spell.cooldown}</div>` : ''}
                                ${spell.cost ? `<div><span style="color: #b89a7a;">💙 Затраты:</span> ${spell.cost}</div>` : ''}
                            </div>
                            
                            <p style="color: #e0d0c0; margin: 10px 0;"><strong>✨ Эффект:</strong> ${spell.effect}</p>
                            
                            ${spell.enhancement ? `<p style="color: #e0d0c0; margin: 5px 0;"><strong>⚡ Усиление:</strong> ${spell.enhancement}</p>` : ''}
                        </div>
                    `;
                });
                
                html += `</div>`;
            }
        });
    } else if (currentSubcategory === 'formation') {
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">🔮 Формация</h3>
                <p style="color: #8b7d6b; text-align: center;">Раздел в разработке</p>
            </div>
        `;
    } else if (currentSubcategory === 'runes') {
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">⚡ Руны</h3>
                <p style="color: #8b7d6b; text-align: center;">Раздел в разработке</p>
            </div>
        `;
    }
    
    html += '</div>';
    resultsList.innerHTML = html;
}

// Отображение системы
function renderSystem() {
    const resultsList = document.getElementById('resultsList');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!resultsList) return;
    
    if (currentSubcategory === 'loot') {
        resultsTitle.innerHTML = '📦 Таблица лута';
        
        if (typeof lootSystem === 'undefined') {
            resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные не загружены</p>';
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
        
        // Введение
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">📖 Как это работает</h3>
                <div style="color: #e0d0c0; line-height: 1.6;">
                    ${lootSystem.introduction}
                </div>
            </div>
        `;
        
        // Таблица лута
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 15px;">📊 Таблица лута</h3>
                <div style="display: flex; flex-direction: column; gap: 8px;">
        `;
        
        lootSystem.lootTable.forEach(row => {
            let bgColor = '#2a1a0f';
            if (row.min >= 150) bgColor = '#4a2a1f';
            if (row.min >= 170) bgColor = '#5a3a2a';
            if (row.min >= 190) bgColor = '#6a4a3a';
            
            html += `
                <div style="display: grid; grid-template-columns: 100px 1fr; background: ${bgColor}; border-radius: 4px; padding: 10px;">
                    <div style="color: #d4af37; font-weight: bold;">${row.min} - ${row.max}</div>
                    <div style="color: #e0d0c0;">${row.reward}</div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
            
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">🎲 Пример использования</h3>
                <p style="color: #e0d0c0;">Игрок с навыком "Удача" 15 кинул 3d6 и получил 10. Разница: 5 → +25% к броску.</p>
                <p style="color: #e0d0c0;">Бросок d100: 65 + 25 = 90. Результат: Золото х2, ресурсы/драгоценности, особо ценная вещь.</p>
                <button class="btn btn-roll" onclick="testLoot()" style="margin-top: 10px;">🎲 Тест броска</button>
                <div id="lootTestResult" style="margin-top: 10px; color: #d4af37;"></div>
            </div>
        `;
        
        html += '</div>';
        resultsList.innerHTML = html;
        
    } else if (currentSubcategory === 'hacking') {
        resultsTitle.innerHTML = '🔓 Взлом';
        
        if (typeof hackingSystem === 'undefined') {
            resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные не загружены</p>';
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
        
        // Введение
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">📖 Система взлома</h3>
                <div style="color: #e0d0c0; line-height: 1.6;">
                    ${hackingSystem.introduction}
                </div>
            </div>
        `;
        
        html += '</div>';
        resultsList.innerHTML = html;
        
    } else if (currentSubcategory === 'reaction') {
        resultsTitle.innerHTML = '😊 Реакция на персонажа';
        
        if (typeof reactionSystem === 'undefined') {
            resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные не загружены</p>';
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
        
        // Введение
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">📖 Система реакции</h3>
                <div style="color: #e0d0c0; line-height: 1.6;">
                    ${reactionSystem.introduction}
                </div>
            </div>
        `;
        
        html += '</div>';
        resultsList.innerHTML = html;
        
    } else if (currentSubcategory === 'aimed') {
        resultsTitle.innerHTML = '🎯 Прицельный огонь';
        
        if (typeof aimedSystem === 'undefined') {
            resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные не загружены</p>';
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
        
        // Введение
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">📖 Система прицельного огня</h3>
                <div style="color: #e0d0c0; line-height: 1.6;">
                    ${aimedSystem.introduction}
                </div>
            </div>
        `;
        
        html += '</div>';
        resultsList.innerHTML = html;
        
    } else if (currentSubcategory === 'battle') {
        resultsTitle.innerHTML = '⚔️ Таблица боя';
        
        if (typeof battleTableSystem === 'undefined') {
            resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные не загружены</p>';
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
        
        // Введение
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">📖 Таблица боя</h3>
                <div style="color: #e0d0c0; line-height: 1.6;">
                    ${battleTableSystem.introduction}
                </div>
            </div>
        `;
        
        html += '</div>';
        resultsList.innerHTML = html;
        
    } else if (currentSubcategory === 'gems') {
        resultsTitle.innerHTML = '💎 Ценность камней';
        
        if (typeof gemsSystem === 'undefined') {
            resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные не загружены</p>';
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
        
        // Введение
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">📖 Таблица драгоценных камней</h3>
                <div style="color: #e0d0c0; line-height: 1.6;">
                    ${gemsSystem.introduction}
                </div>
            </div>
        `;
        
        html += '</div>';
        resultsList.innerHTML = html;
        
    } else if (currentSubcategory === 'coins') {
        resultsTitle.innerHTML = '🪙 Таблица монет';
        
        if (typeof coinsSystem === 'undefined') {
            resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные не загружены</p>';
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
        
        // Введение
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">📖 Таблица монет и валют</h3>
                <div style="color: #e0d0c0; line-height: 1.6;">
                    ${coinsSystem.introduction}
                </div>
            </div>
        `;
        
        html += '</div>';
        resultsList.innerHTML = html;
        
    }
}

// Исправленная тестовая функция для лута
window.testLoot = function() {
    const luckSkill = 15;
    const luckRoll = Math.floor(Math.random() * 16) + 3; // 3d6 (3-18)
    const diff = luckSkill - luckRoll;
    const bonus = diff * 5;
    
    const baseRoll = Math.floor(Math.random() * 100) + 1;
    const finalRoll = baseRoll + bonus;
    
    const result = lootSystem.getLoot(finalRoll);
    
    document.getElementById('lootTestResult').innerHTML = `
        🎯 Навык удачи: ${luckSkill}<br>
        🎲 Бросок 3d6: ${luckRoll}<br>
        📊 Разница: ${diff}<br>
        ✨ Бонус: ${bonus}%<br>
        🎯 База d100: ${baseRoll}<br>
        🔢 Итог: ${finalRoll}<br>
        📦 Результат: ${result}
    `;
};

function applyFilters() {
    if (!currentSubcategory) return;
    
    const searchText = document.getElementById('glossarySearch').value.toLowerCase();
    const priceCurrency = document.getElementById('priceCurrency').value;
    const priceMin = parseFloat(document.getElementById('priceMin').value) || 0;
    const priceMax = parseFloat(document.getElementById('priceMax').value) || Infinity;
    const sortBy = document.getElementById('glossarySort').value;
    
    const minBase = convertToBaseValue(priceMin, priceCurrency);
    const maxBase = convertToBaseValue(priceMax, priceCurrency);
    
    if (currentSubcategory === 'currency') {
        const filtered = filterCurrencies(searchText, minBase, maxBase);
        renderCurrencies(filtered);
        return;
    }
    
    if (currentSubcategory === 'animals') {
        const filtered = filterCreatures(searchText);
        renderCreatures(filtered);
        return;
    }
    
    if (currentSubcategory === 'undead') {
        renderUndead();
        return;
    }
    
    if (currentSubcategory === 'demons') {
        renderDemons();
        return;
    }
    
    if (currentSubcategory === 'giants') {
        renderGiants();
        return;
    }
    
    if (currentSubcategory === 'books') {
        renderBooks();
        return;
    }
    if (currentSubcategory === 'perks') {
    renderPerks();
    return;
}
    if (currentSubcategory === 'enchanting') {
    renderEnchanting();
    return;
}
    if (currentSubcategory === 'alchemy') {
    renderAlchemy();
    return;
}
if (currentSubcategory === 'runes') {
    renderRunes();
    return;
}
if (currentSubcategory === 'formation') {
    renderFormation();
    return;
}
if (currentSubcategory === 'crafting') {
    renderCrafting();
    return;
}
if (currentSubcategory === 'smithing') {
    renderSmithing();
    return;
}
    // Обработка магии
    if (currentSubcategory === 'spells' || currentSubcategory === 'formation' || currentSubcategory === 'runes') {
        renderMagic();
        return;
    }
    
    // Обработка системы
    if (currentSubcategory === 'loot' || currentSubcategory === 'hacking' || currentSubcategory === 'reaction' || 
        currentSubcategory === 'aimed' || currentSubcategory === 'battle' || currentSubcategory === 'gems' || 
        currentSubcategory === 'coins') {
        renderSystem();
        return;
    }
    
    let filtered = [...allItems];
    
    if (currentSubcategory === 'metals') {
        filtered = filtered.filter(item => item.type === 'metal');
    } else if (currentSubcategory === 'weapons') {
        filtered = filtered.filter(item => item.type === 'weapon');
    } else if (currentSubcategory === 'armor') {
        filtered = filtered.filter(item => item.type === 'armor');
    }
    
    if (searchText.length >= 2) {
        filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(searchText) || 
            item.description.toLowerCase().includes(searchText)
        );
    }
    
    filtered = filtered.filter(item => {
        return item.base_value >= minBase && item.base_value <= maxBase;
    });
    
    filtered.sort((a, b) => {
        switch(sortBy) {
            case 'name_asc': return a.name.localeCompare(b.name);
            case 'name_desc': return b.name.localeCompare(a.name);
            case 'price_asc': return a.base_value - b.base_value;
            case 'price_desc': return b.base_value - a.base_value;
            case 'durability_asc': return (a.durability || 0) - (b.durability || 0);
            case 'durability_desc': return (b.durability || 0) - (a.durability || 0);
            case 'mp_asc': return (a.magic_potential || 0) - (b.magic_potential || 0);
            case 'mp_desc': return (b.magic_potential || 0) - (a.magic_potential || 0);
            default: return 0;
        }
    });
    
    renderResults(filtered);
}

function renderResults(items) {
    const resultsList = document.getElementById('resultsList');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!resultsList) return;
    
    if (currentSubcategory === 'metals') resultsTitle.innerHTML = '⚒️ Металлы';
    else if (currentSubcategory === 'weapons') resultsTitle.innerHTML = '⚔️ Оружие';
    else if (currentSubcategory === 'armor') resultsTitle.innerHTML = '🛡️ Броня';
    else resultsTitle.innerHTML = '📋 Результаты';
    
    if (items.length === 0) {
        resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Ничего не найдено</p>';
        return;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
    
    items.forEach(item => {
        const formattedPrice = formatPrice(item.price, item.currency);
        
        if (item.type === 'metal') {
            let skillsHtml = '';
            if (item.metal.skills && item.metal.skills.length > 0) {
                skillsHtml = '<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #8b4513;">';
                skillsHtml += '<span style="color: #d4af37; font-weight: bold;">✨ Особые свойства:</span>';
                skillsHtml += '<ul style="margin-top: 5px; padding-left: 20px;">';
                item.metal.skills.forEach(skill => {
                    skillsHtml += `<li style="color: #e0d0c0; margin-bottom: 3px;">${skill}</li>`;
                });
                skillsHtml += '</ul></div>';
            }
            
            html += `
                <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                    <h3 style="color: #d4af37; margin-bottom: 10px;">⚒️ ${item.name}</h3>
                    <div style="display: flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
                        <button class="btn btn-small" onclick="showWeaponsForMetal('${item.metal.id}')" style="background: #8b4513;">⚔️ Оружие</button>
                        <button class="btn btn-small" onclick="showArmorForMetal('${item.metal.id}')" style="background: #8b4513;">🛡️ Броня</button>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-bottom: 10px;">
                        <div><span style="color: #b89a7a;">МП:</span> ${item.magic_potential}</div>
                        <div><span style="color: #b89a7a;">Прочность:</span> ${item.durability}</div>
                        <div><span style="color: #b89a7a;">Сопротивление:</span> ${formatResistance(item.resistance)}</div>
                        <div><span style="color: #b89a7a;">Цена:</span> ${formattedPrice}</div>
                    </div>
                    <p style="color: #e0d0c0; margin-top: 10px; font-style: italic;">${item.description}</p>
                    ${skillsHtml}
                </div>
            `;
        } else if (item.type === 'weapon') {
            html += `
                <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                    <h3 style="color: #d4af37; margin-bottom: 10px;">⚔️ ${item.name}</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;">
                        <div><span style="color: #b89a7a;">Урон:</span> ${item.damage}</div>
                        <div><span style="color: #b89a7a;">Прочность:</span> ${item.durability}</div>
                        <div><span style="color: #b89a7a;">МП:</span> ${item.magic_potential} (${item.magic_potential * 5}% усиления)</div>
                        <div><span style="color: #b89a7a;">Цена:</span> ${formattedPrice}</div>
                    </div>
                </div>
            `;
        } else if (item.type === 'armor') {
            html += `
                <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                    <h3 style="color: #d4af37; margin-bottom: 10px;">🛡️ ${item.name}</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;">
                        <div><span style="color: #b89a7a;">Защита:</span> ${item.defense}</div>
                        <div><span style="color: #b89a7a;">Прочность:</span> ${item.durability}</div>
                        <div><span style="color: #b89a7a;">МП:</span> ${item.magic_potential} (${item.magic_potential * 5}% усиления)</div>
                        <div><span style="color: #b89a7a;">Сопротивление:</span> ${item.resistance_text}</div>
                        <div><span style="color: #b89a7a;">Цена:</span> ${formattedPrice}</div>
                    </div>
                </div>
            `;
        }
    });
    
    html += '</div>';
    resultsList.innerHTML = html;
}

function resetFilters() {
    document.getElementById('glossarySearch').value = '';
    document.getElementById('priceCurrency').value = 'copper';
    document.getElementById('priceMin').value = '';
    document.getElementById('priceMax').value = '';
    document.getElementById('glossarySort').value = 'name_asc';
    
    applyFilters();
}

function showMetals() {
    selectCategory('items');
    setTimeout(() => selectSubcategory('metals'), 100);
}

function showWeaponsForMetal(metalId) {
    selectCategory('items');
    setTimeout(() => {
        selectSubcategory('weapons');
        document.getElementById('glossarySearch').value = metalsData[metalId].name;
        applyFilters();
    }, 100);
}

function showArmorForMetal(metalId) {
    selectCategory('items');
    setTimeout(() => {
        selectSubcategory('armor');
        document.getElementById('glossarySearch').value = metalsData[metalId].name;
        applyFilters();
    }, 100);
}

function renderBooks() {
    const resultsList = document.getElementById('resultsList');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!resultsList) return;
    
    resultsTitle.innerHTML = '📚 Книги';
    
    if (typeof booksData === 'undefined') {
        resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные о книгах не загружены</p>';
        return;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
    
    booksData.forEach(book => {
        let readButton = '';
        // Если есть файл и он не пустой — показываем кнопку
        if (book.file && book.file !== '') {
            readButton = `<button class="btn btn-roll" onclick="openBook('${book.file}')" style="background: #8b4513;">📖 Читать</button>`;
        }
        
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 5px;">📖 ${book.title}</h3>
                ${book.author ? `<p style="color: #b89a7a; margin-bottom: 10px;">Автор: ${book.author}</p>` : ''}
                <p style="color: #e0d0c0; margin-bottom: 15px;">${book.description}</p>
                ${readButton}
            </div>
        `;
    });
    
    html += '</div>';
    resultsList.innerHTML = html;
}
function renderPerks() {
    const resultsList = document.getElementById('resultsList');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!resultsList) return;
    
    resultsTitle.innerHTML = '✨ Перки';
    
    if (typeof perksData === 'undefined') {
        resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные о перках не загружены</p>';
        return;
    }
    
    // Описание системы перков
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
    
    // Список навыков
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
    
    // Добавляем обработчик на выпадающий список
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
// Загружаем данные при старте
document.addEventListener('DOMContentLoaded', loadGlossary);
