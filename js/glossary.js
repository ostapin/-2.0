// Глобальные переменные
let allMetals = [];
let allWeapons = [];
let allArmor = [];
let allItems = [];
let currencyRates = {};

function loadGlossary() {
    // Загружаем данные
    allMetals = Object.values(metalsData);
    allWeapons = Object.values(weaponsData);
    allArmor = Object.values(armorData);
    
    // Загружаем курсы валют
    if (typeof currencyData !== 'undefined') {
        currencyRates = currencyData;
    }
    
    // Создаем объединенный массив предметов
    buildAllItems();
}

function getCurrencyIdFromString(priceString) {
    const str = priceString.toLowerCase();
    
    // Металлы (первые)
    if (str.includes('мед')) return 'copper';
    if (str.includes('сереб')) return 'silver';
    if (str.includes('золот')) return 'gold';
    if (str.includes('платин')) return 'platinum';
    
    // Сферы
    if (str.includes('янтар') || str.includes('amber')) return 'amber_sphere';
    if (str.includes('кров')) return 'blood_sphere';
    if (str.includes('льд') || str.includes('ice')) return 'ice_sphere';
    if (str.includes('огн') || str.includes('fire')) return 'fire_sphere';
    if (str.includes('земл') || str.includes('earth')) return 'earth_sphere';
    if (str.includes('вод') || str.includes('water')) return 'water_sphere';
    if (str.includes('молн') || str.includes('lightning')) return 'lightning_sphere';
    
    // Кристаллы эфира
    if (str.includes('бесцветный') || str.includes('colorless')) return 'colorless_ether';
    if (str.includes('цветн') || str.includes('colored')) return 'colored_ether';
    
    // По умолчанию - медные
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

function extractCurrency(priceString) {
    const match = priceString.match(/\d+\s*(.+)/);
    return match ? match[1] : '';
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
        
        console.log(`Металл ${metal.name}: ${priceAmount} ${currencyId} = ${baseValue} медных`); // Для отладки
        
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
        
        allWeapons.forEach(weapon => {
            const slots = weapon.craft_slots || 1;
            const itemPrice = priceAmount * slots;
            const baseValue = convertToBaseValue(itemPrice, currencyId);
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
        
        allArmor.forEach(armor => {
            const slots = armor.craft_slots || 1;
            const itemPrice = priceAmount * slots;
            const baseValue = convertToBaseValue(itemPrice, currencyId);
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

function applyFilters() {
    const category = document.getElementById('glossaryCategory').value;
    const searchText = document.getElementById('glossarySearch').value.toLowerCase();
    const priceMin = parseInt(document.getElementById('priceMin').value) || 0;
    const priceMax = parseInt(document.getElementById('priceMax').value) || Infinity;
    const sortBy = document.getElementById('glossarySort').value;
    
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
    
    // Фильтр по цене (конвертируем в базовую валюту)
    filtered = filtered.filter(item => {
        return item.base_value >= priceMin && item.base_value <= priceMax;
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
    if (!resultsList) return;
    
    if (items.length === 0) {
        resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">Ничего не найдено</p>';
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
