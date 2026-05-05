// 03-items.js - Предметы (металлы, оружие, броня, валюта)
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
