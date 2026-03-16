// Глобальные переменные
let allMetals = [];
let allWeapons = [];
let allArmor = [];
let allCreatures = [];
let allUndead = [];
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
    
    // Загружаем нежить (пока пусто, потом добавим)
    allUndead = [];
    
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
    document.getElementById('glossaryFilters').style.display = 'none';
    
    // Показываем нужную подкатегорию
    if (category === 'items') {
        document.getElementById('itemsSubcategory').style.display = 'block';
    } else if (category === 'creatures') {
        document.getElementById('creaturesSubcategory').style.display = 'block';
    }
    
    document.getElementById('resultsTitle').innerHTML = '📋 Выберите подкатегорию';
    document.getElementById('resultsList').innerHTML = '<p style="color: #8b7d6b; text-align: center;">Нажмите на подкатегорию</p>';
}

function selectSubcategory(subcategory) {
    currentSubcategory = subcategory;
    
    // Показываем фильтры
    document.getElementById('glossaryFilters').style.display = 'block';
    
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
    
    // Металлы
    if (str.includes('мед')) return 'copper';
    if (str.includes('сереб')) return 'silver';
    if (str.includes('золот')) return 'gold';
    if (str.includes('платин')) return 'platinum';
    
    // Кристаллы эфира
    if (str.includes('кристалл эфира') || str.includes('кристаллов эфира')) {
        if (str.includes('бесцветный') || str.includes('colorless')) return 'colorless_ether';
        return 'colored_ether';
    }
    
    // Специфичные сферы
    if (str.includes('кров')) return 'blood_sphere';
    if (str.includes('льд') || str.includes('ice')) return 'ice_sphere';
    if (str.includes('огн') || str.includes('fire')) return 'fire_sphere';
    if (str.includes('земл') || str.includes('earth')) return 'earth_sphere';
    if (str.includes('вод') || str.includes('water')) return 'water_sphere';
    if (str.includes('молн') || str.includes('lightning')) return 'lightning_sphere';
    
    // Янтарная сфера
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
    
    // Добавляем металлы
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
    
    // Добавляем оружие (для каждого металла)
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
    
    // Добавляем броню (для каждого металла)
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
            
            // Сопротивление (30% слитков, макс 10)
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

function filterUndead(searchText) {
    let filtered = [...allUndead];
    
    if (searchText && searchText.length >= 2) {
        filtered = filtered.filter(undead => 
            undead.name.toLowerCase().includes(searchText) || 
            undead.description.toLowerCase().includes(searchText)
        );
    }
    
    return filtered;
}

function renderUndead(undead) {
    const resultsList = document.getElementById('resultsList');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!resultsList) return;
    
    resultsTitle.innerHTML = '💀 Нежить';
    
    if (undead.length === 0) {
        resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Пока нет данных</p>';
        return;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
    
    undead.forEach(creature => {
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">💀 ${creature.name}</h3>
                <p style="color: #e0d0c0; margin-bottom: 10px; font-style: italic;">${creature.description}</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
                    <div><span style="color: #b89a7a;">Цена за тушу:</span> ${creature.price_carcass}</div>
                    <div><span style="color: #b89a7a;">Цена за живого:</span> ${creature.price_alive}</div>
                    <div><span style="color: #b89a7a;">Опасность:</span> ${creature.danger}</div>
                    <div><span style="color: #b89a7a;">Обитание:</span> ${creature.habitat}</div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    resultsList.innerHTML = html;
}

function applyFilters() {
    if (!currentSubcategory) return;
    
    const searchText = document.getElementById('glossarySearch').value.toLowerCase();
    const priceCurrency = document.getElementById('priceCurrency').value;
    const priceMin = parseFloat(document.getElementById('priceMin').value) || 0;
    const priceMax = parseFloat(document.getElementById('priceMax').value) || Infinity;
    const sortBy = document.getElementById('glossarySort').value;
    
    const minBase = convertToBaseValue(priceMin, priceCurrency);
    const maxBase = convertToBaseValue(priceMax, priceCurrency);
    
    // Обработка подкатегорий
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
        const filtered = filterUndead(searchText);
        renderUndead(filtered);
        return;
    }
    
    // Для металлов, оружия, брони
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
    
    // Устанавливаем заголовок в зависимости от подкатегории
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

// Функции для обратной совместимости
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

// Загружаем данные при старте
document.addEventListener('DOMContentLoaded', loadGlossary);
