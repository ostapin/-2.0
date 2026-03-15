// Глобальные переменные
let allMetals = [];
let allWeapons = [];
let allArmor = [];
let allCreatures = [];
let allItems = [];
let currencyRates = {};
let allCurrencies = [];

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

function getCurrencyIdFromString(priceString) {
    const str = priceString.toLowerCase();
    
    // Металлы
    if (str.includes('мед')) return 'copper';
    if (str.includes('сереб')) return 'silver';
    if (str.includes('золот')) return 'gold';
    if (str.includes('платин')) return 'platinum';
    
    // Кристаллы эфира (проверяем до сфер!)
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
    
    // Янтарная сфера (или просто "сфера")
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
    
    // Фильтр по поиску (если есть текст)
    if (searchText && searchText.length >= 2) {
        filtered = filtered.filter(currency => 
            currency.name.toLowerCase().includes(searchText)
        );
    }
    
    // Фильтр по цене (конвертируем в медные)
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
        // Находим следующую валюту для отображения курса
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
    
    // Фильтр по поиску (если есть текст)
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
    
    resultsTitle.innerHTML = '🐾 Животные';
    
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

function applyFilters() {
    const category = document.getElementById('glossaryCategory').value;
    const searchText = document.getElementById('glossarySearch').value.toLowerCase();
    const priceCurrency = document.getElementById('priceCurrency').value;
    const priceMin = parseFloat(document.getElementById('priceMin').value) || 0;
    const priceMax = parseFloat(document.getElementById('priceMax').value) || Infinity;
    const sortBy = document.getElementById('glossarySort').value;
    
    // Конвертируем введенный диапазон в базовую валюту
    const minBase = convertToBaseValue(priceMin, priceCurrency);
    const maxBase = convertToBaseValue(priceMax, priceCurrency);
    
    // Если выбрана категория "Валюта"
    if (category === 'currency') {
        const filteredCurrencies = filterCurrencies(searchText, minBase, maxBase);
        renderCurrencies(filteredCurrencies);
        return;
    }
    
    // Если выбрана категория "Животные"
    if (category === 'creatures') {
        const filteredCreatures = filterCreatures(searchText);
        renderCreatures(filteredCreatures);
        return;
    }
    
    // Для остальных категорий
    let filtered = [...allItems];
    
    // Фильтр по категории
    if (category !== 'all') {
        if (category === 'metals') filtered = filtered.filter(item => item.type === 'metal');
        if (category === 'weapons') filtered = filtered.filter(item => item.type === 'weapon');
        if (category === 'armor') filtered = filtered.filter(item => item.type === 'armor');
    }
    
    // Фильтр по поиску
    if (searchText.length >= 2) {
        filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(searchText) || 
            item.description.toLowerCase().includes(searchText)
        );
    }
    
    // Фильтр по цене (в базовой валюте)
    filtered = filtered.filter(item => {
        return item.base_value >= minBase && item.base_value <= maxBase;
    });
    
    // Сортировка
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
    
    resultsTitle.innerHTML = '📋 Результаты';
    
    if (items.length === 0) {
        resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Ничего не найдено</p>';
        return;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
    
    items.forEach(item => {
        const formattedPrice = formatPrice(item.price, item.currency);
        
        if (item.type === 'metal') {
            // Отображение металла
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
            // Отображение оружия
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
            // Отображение брони
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
    document.getElementById('glossaryCategory').value = 'all';
    document.getElementById('glossarySearch').value = '';
    document.getElementById('priceCurrency').value = 'copper';
    document.getElementById('priceMin').value = '';
    document.getElementById('priceMax').value = '';
    document.getElementById('glossarySort').value = 'name_asc';
    
    applyFilters();
}

// Старые функции для обратной совместимости
function showMetals() {
    document.getElementById('glossaryCategory').value = 'metals';
    applyFilters();
}

function showWeaponsForMetal(metalId) {
    const metal = metalsData[metalId];
    if (!metal) return;
    
    document.getElementById('glossaryCategory').value = 'weapons';
    document.getElementById('glossarySearch').value = metal.name;
    applyFilters();
}

function showArmorForMetal(metalId) {
    const metal = metalsData[metalId];
    if (!metal) return;
    
    document.getElementById('glossaryCategory').value = 'armor';
    document.getElementById('glossarySearch').value = metal.name;
    applyFilters();
}

function searchMetals() {
    document.getElementById('glossaryCategory').value = 'metals';
    applyFilters();
}

// Загружаем данные при старте
document.addEventListener('DOMContentLoaded', loadGlossary);
