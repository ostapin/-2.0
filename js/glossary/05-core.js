// 05-core.js - Ядро глоссария
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
    
    // Собираем магию из отдельных файлов
    if (typeof window.magicData === 'undefined') {
        window.magicData = { spells: {}, formation: {}, runes: {} };
    }
    
    // Добавляем каждую школу, если она определена
    if (typeof fireMagic !== 'undefined') window.magicData.spells.fire = fireMagic;
    if (typeof waterMagic !== 'undefined') window.magicData.spells.water = waterMagic;
    if (typeof earthMagic !== 'undefined') window.magicData.spells.earth = earthMagic;
    if (typeof airMagic !== 'undefined') window.magicData.spells.air = airMagic;
    if (typeof metalMagic !== 'undefined') window.magicData.spells.metal = metalMagic;
    if (typeof natureMagic !== 'undefined') window.magicData.spells.nature = natureMagic;
    if (typeof lightMagic !== 'undefined') window.magicData.spells.light = lightMagic;
    if (typeof darkMagic !== 'undefined') window.magicData.spells.dark = darkMagic;
    if (typeof infernoMagic !== 'undefined') window.magicData.spells.inferno = infernoMagic;
    if (typeof chaosMagic !== 'undefined') window.magicData.spells.chaos = chaosMagic;
    if (typeof mindMagic !== 'undefined') window.magicData.spells.mind = mindMagic;
    if (typeof lifeMagic !== 'undefined') window.magicData.spells.life = lifeMagic;
    if (typeof deathMagic !== 'undefined') window.magicData.spells.death = deathMagic;
    if (typeof voidMagic !== 'undefined') window.magicData.spells.void = voidMagic;
    if (typeof bloodMagic !== 'undefined') window.magicData.spells.blood = bloodMagic;
    if (typeof energyMagic !== 'undefined') window.magicData.spells.energy = energyMagic;
    if (typeof etherMagic !== 'undefined') window.magicData.spells.ether = etherMagic;
    
    // Создаем объединенный массив предметов
    buildAllItems();
}

function selectCategory(category) {
    currentCategory = category;
    currentSubcategory = '';
    
    document.getElementById('itemsSubcategory').style.display = 'none';
    document.getElementById('creaturesSubcategory').style.display = 'none';
    document.getElementById('magicSubcategory').style.display = 'none';
    document.getElementById('systemSubcategory').style.display = 'none';
    document.getElementById('skillsSubcategory').style.display = 'none';
    
    if (category === 'items') {
        document.getElementById('itemsSubcategory').style.display = 'block';
    } else if (category === 'creatures') {
        document.getElementById('creaturesSubcategory').style.display = 'block';
    } else if (category === 'magic') {
        document.getElementById('magicSubcategory').style.display = 'block';
    } else if (category === 'system') {
        document.getElementById('systemSubcategory').style.display = 'block';
    } else if (category === 'skills') {
        document.getElementById('skillsSubcategory').style.display = 'block';
    }
    
    document.getElementById('resultsTitle').innerHTML = '📋 Выберите подкатегорию';
    document.getElementById('resultsList').innerHTML = '<p style="color: #8b7d6b; text-align: center;">Нажмите на подкатегорию</p>';
}

function selectSubcategory(subcategory) {
    currentSubcategory = subcategory;
    
    document.getElementById('glossarySearch').value = '';
    document.getElementById('priceMin').value = '';
    document.getElementById('priceMax').value = '';
    document.getElementById('glossarySort').value = 'name_asc';
    
    applyFilters();
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
    
    if (currentSubcategory === 'spells' || currentSubcategory === 'formation' || currentSubcategory === 'runes') {
        renderMagic();
        return;
    }
    
    if (currentSubcategory === 'loot' || currentSubcategory === 'hacking' || currentSubcategory === 'reaction' || 
        currentSubcategory === 'aimed' || currentSubcategory === 'battle' || currentSubcategory === 'gems' || 
        currentSubcategory === 'coins') {
        renderSystem();
        return;
    }
    
    if (currentSubcategory === 'skills') {
        renderSkills();
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
