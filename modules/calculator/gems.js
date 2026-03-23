// ========== КАЛЬКУЛЯТОР ДРАГОЦЕННЫХ КАМНЕЙ ==========

const gemsSystem = {
    gemTable: [
        { min: 1, max: 30, name: "Аметист", basePrice: 150 },
        { min: 31, max: 50, name: "Аметист", basePrice: 150 },
        { min: 51, max: 65, name: "Гранат", basePrice: 400 },
        { min: 66, max: 80, name: "Корунд (сапфир)", basePrice: 550 },
        { min: 81, max: 92, name: "Берилл (изумруд)", basePrice: 600 },
        { min: 93, max: 100, name: "Алмаз", basePrice: 750 }
    ],
    
    purityTable: [
        { min: 0, max: 20, multiplier: 0.5, name: "Плохая" },
        { min: 21, max: 40, multiplier: 0.7, name: "Низкая" },
        { min: 41, max: 60, multiplier: 1.0, name: "Средняя" },
        { min: 61, max: 80, multiplier: 1.2, name: "Хорошая" },
        { min: 81, max: 100, multiplier: 1.5, name: "Отличная" }
    ],
    
    suitabilityTable: [
        { min: 1, max: 10, multiplier: 0.2, name: "Ужасная", loss: "80%" },
        { min: 11, max: 25, multiplier: 0.5, name: "Плохая", loss: "50%" },
        { min: 26, max: 50, multiplier: 0.7, name: "Средняя", loss: "30%" },
        { min: 51, max: 75, multiplier: 0.8, name: "Хорошая", loss: "20%" },
        { min: 76, max: 90, multiplier: 0.9, name: "Отличная", loss: "10%" },
        { min: 91, max: 100, multiplier: 0.95, name: "Идеальная", loss: "5%" }
    ],
    
    getSizeMultiplier: function(size) {
        if (size < 1) return 1;
        if (size < 5) return 5;
        if (size < 10) return 25;
        if (size < 50) return 125;
        if (size < 100) return 625;
        if (size < 1000) return 3125;
        return 15625;
    },
    
    getSize: function() {
        const rand = Math.random() * 1000;
        
        if (rand < 900) {
            const subRand = Math.random() * 100;
            if (subRand < 50) return 0.1 + Math.random() * 0.1;
            if (subRand < 70) return 0.2 + Math.random() * 0.1;
            if (subRand < 85) return 0.3 + Math.random() * 0.2;
            if (subRand < 95) return 0.5 + Math.random() * 0.2;
            return 0.7 + Math.random() * 0.3;
        }
        else if (rand < 980) {
            const subRand = Math.random() * 100;
            if (subRand < 40) return 1 + Math.random() * 0.5;
            if (subRand < 65) return 1.5 + Math.random() * 0.5;
            if (subRand < 85) return 2 + Math.random() * 1;
            if (subRand < 95) return 3 + Math.random() * 1;
            return 4 + Math.random() * 1;
        }
        else if (rand < 995) {
            const subRand = Math.random() * 100;
            if (subRand < 45) return 5 + Math.random() * 1;
            if (subRand < 70) return 6 + Math.random() * 1;
            if (subRand < 85) return 7 + Math.random() * 1;
            if (subRand < 95) return 8 + Math.random() * 1;
            return 9 + Math.random() * 1;
        }
        else if (rand < 999) {
            const subRand = Math.random() * 100;
            if (subRand < 50) return 10 + Math.random() * 5;
            if (subRand < 75) return 15 + Math.random() * 5;
            if (subRand < 90) return 20 + Math.random() * 10;
            if (subRand < 97) return 30 + Math.random() * 10;
            return 40 + Math.random() * 10;
        }
        else if (rand < 999.8) {
            const subRand = Math.random() * 100;
            if (subRand < 55) return 50 + Math.random() * 10;
            if (subRand < 80) return 60 + Math.random() * 10;
            if (subRand < 92) return 70 + Math.random() * 10;
            if (subRand < 97) return 80 + Math.random() * 10;
            return 90 + Math.random() * 10;
        }
        else if (rand < 1000) {
            const subRand = Math.random() * 100;
            if (subRand < 60) return 100 + Math.random() * 100;
            if (subRand < 80) return 200 + Math.random() * 100;
            if (subRand < 92) return 300 + Math.random() * 200;
            if (subRand < 97) return 500 + Math.random() * 200;
            return 700 + Math.random() * 300;
        }
        else {
            const subRand = Math.random() * 100;
            if (subRand < 65) return 1000 + Math.random() * 1000;
            if (subRand < 85) return 2000 + Math.random() * 1000;
            if (subRand < 95) return 3000 + Math.random() * 2000;
            if (subRand < 98) return 5000 + Math.random() * 2000;
            return 7000 + Math.random() * 3000;
        }
    },
    
    getGem: function(roll) {
        for (let i = 0; i < this.gemTable.length; i++) {
            if (roll >= this.gemTable[i].min && roll <= this.gemTable[i].max) {
                return this.gemTable[i];
            }
        }
        return { name: "Неизвестный камень", basePrice: 0 };
    },
    
    getPurity: function(roll) {
        for (let i = 0; i < this.purityTable.length; i++) {
            if (roll >= this.purityTable[i].min && roll <= this.purityTable[i].max) {
                return this.purityTable[i];
            }
        }
        return { multiplier: 1.0, name: "Средняя" };
    },
    
    getSuitability: function(roll) {
        for (let i = 0; i < this.suitabilityTable.length; i++) {
            if (roll >= this.suitabilityTable[i].min && roll <= this.suitabilityTable[i].max) {
                return this.suitabilityTable[i];
            }
        }
        return { multiplier: 0.7, name: "Средняя", loss: "30%" };
    },
    
    calculatePrice: function(basePrice, size, purityMultiplier, suitabilityMultiplier) {
        const pricePerCarat = basePrice * 10;
        const sizeMultiplier = this.getSizeMultiplier(size);
        return Math.floor(pricePerCarat * size * sizeMultiplier * purityMultiplier * suitabilityMultiplier);
    },
    
    generateOneGem: function() {
        const gemRoll = Math.floor(Math.random() * 100) + 1;
        const purityRoll = Math.floor(Math.random() * 100) + 1;
        const suitabilityRoll = Math.floor(Math.random() * 100) + 1;
        
        const gem = this.getGem(gemRoll);
        const purity = this.getPurity(purityRoll);
        const suitability = this.getSuitability(suitabilityRoll);
        const size = this.getSize();
        const price = this.calculatePrice(gem.basePrice, size, purity.multiplier, suitability.multiplier);
        
        return {
            gemName: gem.name,
            gemRoll: gemRoll,
            basePrice: gem.basePrice,
            size: size,
            sizeMultiplier: this.getSizeMultiplier(size),
            purityName: purity.name,
            purityMultiplier: purity.multiplier,
            purityRoll: purityRoll,
            suitabilityName: suitability.name,
            suitabilityMultiplier: suitability.multiplier,
            suitabilityRoll: suitabilityRoll,
            suitabilityLoss: suitability.loss,
            price: price
        };
    }
};

let gemHistory = [];
let currentBatchSize = 1;

function renderGemCalculator() {
    const container = document.getElementById('calculatorContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div style="max-width: 1000px; margin: 0 auto; display: flex; gap: 20px; flex-wrap: wrap;">
            <!-- Основной блок -->
            <div style="flex: 2; min-width: 400px; background: #2c1810; border-radius: 12px; padding: 20px; border: 2px solid #8b4513;">
                <h3 style="color: #d4af37; margin-bottom: 15px;">💎 ГЕНЕРАТОР ДРАГОЦЕННЫХ КАМНЕЙ</h3>
                
                <div style="margin-bottom: 20px; padding: 15px; background: #1a0f0b; border-radius: 8px;">
                    <p style="color: #e0d0c0;">🎲 Один вид — один камень со случайными параметрами</p>
                    <p style="color: #e0d0c0;">🎲 Разные виды — несколько камней, каждый со своим броском</p>
                    <p style="color: #d4af37;">💰 Цена = (база×10) × размер × множитель_размера × чистоту × пригодность</p>
                </div>
                
                <!-- Множители количества для партии -->
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #d4af37; margin-bottom: 10px;">📦 КОЛИЧЕСТВО КАМНЕЙ В ПАРТИИ</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px;">
                        <button onclick="setBatchSize(1)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">1</button>
                        <button onclick="setBatchSize(3)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">3</button>
                        <button onclick="setBatchSize(5)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">5</button>
                        <button onclick="setBatchSize(10)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">10</button>
                        <button onclick="setBatchSize(15)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">15</button>
                        <button onclick="setBatchSize(20)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">20</button>
                        <button onclick="setBatchSize(30)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">30</button>
                        <button onclick="setBatchSize(50)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">50</button>
                        <button onclick="setBatchSize(100)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">100</button>
                    </div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <span style="color: #e0d0c0;">Своё количество:</span>
                        <input type="number" id="customBatchSize" value="1" min="1" style="width: 80px; padding: 5px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513; border-radius: 4px;">
                        <button onclick="setCustomBatchSize()" style="background: #8b4513; padding: 5px 10px; border: none; border-radius: 4px; color: white; cursor: pointer;">Установить</button>
                    </div>
                    <div style="margin-top: 10px; color: #d4af37;">Партия: <span id="currentBatchSize">1</span> камней</div>
                </div>
                
                <!-- Кнопки -->
                <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                    <button onclick="generateOneGem()" style="flex: 1; background: #d4af37; color: #2c1810; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">💎 ОДИН ВИД</button>
                    <button onclick="generateBatch()" style="flex: 1; background: #27ae60; color: white; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">🎲 РАЗНЫЕ ВИДЫ (${currentBatchSize})</button>
                </div>
                
                <!-- Результат текущей генерации -->
                <div id="gemResult" style="margin-top: 20px; padding: 15px; background: #1a0f0b; border-radius: 8px; display: none; max-height: 400px; overflow-y: auto;"></div>
                
                <!-- Ручной ввод -->
                <div style="margin-top: 20px; padding: 10px; background: #3d2418; border-radius: 6px;">
                    <h4 style="color: #d4af37; margin-bottom: 10px;">🎲 РУЧНОЙ ВВОД БРОСКОВ</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                        <input type="number" id="manualGemRoll" placeholder="Камень (1-100)" style="padding: 8px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513; border-radius: 4px;">
                        <input type="number" id="manualPurityRoll" placeholder="Чистота (1-100)" style="padding: 8px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513; border-radius: 4px;">
                        <input type="number" id="manualSuitabilityRoll" placeholder="Пригодность (1-100)" style="padding: 8px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513; border-radius: 4px;">
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="addManualGem()" style="flex: 1; background: #8b4513; padding: 8px; border: none; border-radius: 4px; color: white; cursor: pointer;">Добавить камень</button>
                        <button onclick="generateRandomSize()" style="flex: 1; background: #5a3a2a; padding: 8px; border: none; border-radius: 4px; color: white; cursor: pointer;">🎲 Случайный размер</button>
                    </div>
                    <div id="manualSizeResult" style="margin-top: 10px; color: #b89a7a; font-size: 0.85em;"></div>
                </div>
            </div>
            
            <!-- Блок истории -->
            <div style="flex: 1; min-width: 300px; background: #2c1810; border-radius: 12px; padding: 15px; border: 2px solid #8b4513;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="color: #d4af37; margin: 0;">📜 История</h3>
                    <button onclick="clearGemHistory()" style="background: #c44536; padding: 5px 10px; border: none; border-radius: 4px; color: white; cursor: pointer;">Очистить</button>
                </div>
                <div id="gemHistoryList" style="max-height: 500px; overflow-y: auto;">
                    <p style="color: #8b7d6b; text-align: center;">История пуста</p>
                </div>
            </div>
        </div>
    `;
    renderGemHistory();
    updateBatchSizeDisplay();
}

function setBatchSize(size) {
    currentBatchSize = size;
    updateBatchSizeDisplay();
    const btn = document.querySelector('#calculator-tab button[onclick="generateBatch()"]');
    if (btn) btn.innerHTML = `🎲 РАЗНЫЕ ВИДЫ (${currentBatchSize})`;
}

function setCustomBatchSize() {
    const input = document.getElementById('customBatchSize');
    let val = parseInt(input.value);
    if (isNaN(val) || val < 1) val = 1;
    currentBatchSize = val;
    updateBatchSizeDisplay();
    const btn = document.querySelector('#calculator-tab button[onclick="generateBatch()"]');
    if (btn) btn.innerHTML = `🎲 РАЗНЫЕ ВИДЫ (${currentBatchSize})`;
}

function updateBatchSizeDisplay() {
    const span = document.getElementById('currentBatchSize');
    if (span) span.innerText = currentBatchSize;
}

// Генерация одного камня (один вид)
function generateOneGem() {
    const gem = gemsSystem.generateOneGem();
    
    const entry = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        type: 'single',
        gems: [gem]
    };
    
    gemHistory.unshift(entry);
    if (gemHistory.length > 50) gemHistory.pop();
    renderGemHistory();
    showResult([gem]);
}

// Генерация партии (разные виды)
function generateBatch() {
    const count = currentBatchSize;
    const gemsList = [];
    
    for (let i = 0; i < count; i++) {
        gemsList.push(gemsSystem.generateOneGem());
    }
    
    const entry = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        type: 'batch',
        batchSize: count,
        gems: gemsList
    };
    
    gemHistory.unshift(entry);
    if (gemHistory.length > 50) gemHistory.pop();
    renderGemHistory();
    showResult(gemsList);
}

// Добавление камня вручную
function addManualGem() {
    const gemRoll = parseInt(document.getElementById('manualGemRoll').value);
    const purityRoll = parseInt(document.getElementById('manualPurityRoll').value);
    const suitabilityRoll = parseInt(document.getElementById('manualSuitabilityRoll').value);
    
    if (isNaN(gemRoll) || gemRoll < 1 || gemRoll > 100) {
        alert('Введите число от 1 до 100 для броска камня');
        return;
    }
    if (isNaN(purityRoll) || purityRoll < 1 || purityRoll > 100) {
        alert('Введите число от 1 до 100 для броска чистоты');
        return;
    }
    if (isNaN(suitabilityRoll) || suitabilityRoll < 1 || suitabilityRoll > 100) {
        alert('Введите число от 1 до 100 для броска пригодности');
        return;
    }
    
    const gem = gemsSystem.getGem(gemRoll);
    const purity = gemsSystem.getPurity(purityRoll);
    const suitability = gemsSystem.getSuitability(suitabilityRoll);
    const size = gemsSystem.getSize();
    const price = gemsSystem.calculatePrice(gem.basePrice, size, purity.multiplier, suitability.multiplier);
    
    const manualGem = {
        gemName: gem.name,
        gemRoll: gemRoll,
        basePrice: gem.basePrice,
        size: size,
        sizeMultiplier: gemsSystem.getSizeMultiplier(size),
        purityName: purity.name,
        purityMultiplier: purity.multiplier,
        purityRoll: purityRoll,
        suitabilityName: suitability.name,
        suitabilityMultiplier: suitability.multiplier,
        suitabilityRoll: suitabilityRoll,
        suitabilityLoss: suitability.loss,
        price: price
    };
    
    const entry = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        type: 'single',
        gems: [manualGem]
    };
    
    gemHistory.unshift(entry);
    if (gemHistory.length > 50) gemHistory.pop();
    renderGemHistory();
    showResult([manualGem]);
    
    document.getElementById('manualGemRoll').value = '';
    document.getElementById('manualPurityRoll').value = '';
    document.getElementById('manualSuitabilityRoll').value = '';
    document.getElementById('manualSizeResult').innerHTML = '';
}

function generateRandomSize() {
    const size = gemsSystem.getSize();
    let range = "";
    if (size < 1) range = "0.1-1 карат";
    else if (size < 5) range = "1-5 карат";
    else if (size < 10) range = "5-10 карат";
    else if (size < 50) range = "10-50 карат";
    else if (size < 100) range = "50-100 карат";
    else if (size < 1000) range = "100-1000 карат";
    else range = "1000-10000 карат";
    
    document.getElementById('manualSizeResult').innerHTML = `🎲 Размер: ${size.toFixed(2)} карат (${range})`;
}

// Показать результат текущей генерации
function showResult(gemsList) {
    const resultDiv = document.getElementById('gemResult');
    if (!resultDiv) return;
    
    const sorted = [...gemsList].sort((a, b) => a.gemName.localeCompare(b.gemName));
    
    let totalPrice = 0;
    let html = '<h4 style="color: #d4af37; margin-bottom: 10px;">📋 РЕЗУЛЬТАТЫ (сортировка по названию):</h4>';
    html += '<div style="max-height: 350px; overflow-y: auto;">';
    
    const grouped = {};
    sorted.forEach(g => {
        if (!grouped[g.gemName]) grouped[g.gemName] = [];
        grouped[g.gemName].push(g);
    });
    
    for (const [gemName, items] of Object.entries(grouped)) {
        let groupTotal = items.reduce((sum, g) => sum + g.price, 0);
        html += `<div style="margin: 8px 0; padding: 8px; background: #2c1810; border-radius: 4px;">`;
        html += `<div style="color: #d4af37; font-weight: bold;">${gemName}: ${items.length} шт — ${groupTotal.toLocaleString()} зол.</div>`;
        
        items.sort((a, b) => a.price - b.price);
        
        items.forEach((g, idx) => {
            html += `<div style="margin-left: 15px; font-size: 0.8em; padding: 2px 0;">`;
            html += `${idx+1}. ${g.purityName} / ${g.suitabilityName} | `;
            html += `${g.size.toFixed(2)} карат | `;
            html += `<span style="color: #d4af37;">${g.price.toLocaleString()}</span>`;
            html += `</div>`;
            totalPrice += g.price;
        });
        html += `</div>`;
    }
    
    html += '</div>';
    html += `<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #8b4513; font-size: 1.2em; color: #d4af37; text-align: right;">🏆 ОБЩАЯ СУММА: ${totalPrice.toLocaleString()} зол.</div>`;
    
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = html;
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Рендер истории
function renderGemHistory() {
    const historyList = document.getElementById('gemHistoryList');
    if (!historyList) return;
    
    if (gemHistory.length === 0) {
        historyList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">История пуста</p>';
        return;
    }
    
    historyList.innerHTML = gemHistory.map((entry, idx) => {
        let totalPrice = entry.gems.reduce((sum, g) => sum + g.price, 0);
        let title = entry.type === 'single' 
            ? `💎 ${entry.gems[0].gemName} — ${entry.gems[0].price.toLocaleString()}`
            : `🎲 Партия ${entry.batchSize} камней — ${totalPrice.toLocaleString()}`;
        
        return `
            <div style="background: #1a0f0b; margin-bottom: 8px; padding: 8px; border-radius: 4px; cursor: pointer;" onclick="toggleHistoryDetails(${idx})">
                <div style="color: #b89a7a; font-size: 0.7em;">${entry.time}</div>
                <div style="color: #e0d0c0;">${title}</div>
                <div id="history-details-${idx}" style="display: none; margin-top: 8px; padding-top: 8px; border-top: 1px solid #8b4513;"></div>
            </div>
        `;
    }).join('');
}

// Показать/скрыть детали истории
function toggleHistoryDetails(index) {
    const detailsDiv = document.getElementById(`history-details-${index}`);
    if (!detailsDiv) return;
    
    if (detailsDiv.style.display === 'none') {
        const entry = gemHistory[index];
        const sorted = [...entry.gems].sort((a, b) => a.gemName.localeCompare(b.gemName));
        
        let html = '<div style="font-size: 0.8em;">';
        
        const grouped = {};
        sorted.forEach(g => {
            if (!grouped[g.gemName]) grouped[g.gemName] = [];
            grouped[g.gemName].push(g);
        });
        
        for (const [gemName, items] of Object.entries(grouped)) {
            let groupTotal = items.reduce((sum, g) => sum + g.price, 0);
            html += `<div style="margin-top: 5px;"><span style="color: #d4af37;">${gemName}:</span> ${items.length} шт — ${groupTotal.toLocaleString()}</div>`;
            items.forEach(g => {
                html += `<div style="margin-left: 10px;">${g.purityName}/${g.suitabilityName} | ${g.size.toFixed(2)} карат = ${g.price.toLocaleString()}</div>`;
            });
        }
        
        html += `<div style="margin-top: 5px; color: #d4af37;">Итого: ${entry.gems.reduce((s, g) => s + g.price, 0).toLocaleString()}</div>`;
        html += '</div>';
        
        detailsDiv.innerHTML = html;
        detailsDiv.style.display = 'block';
    } else {
        detailsDiv.style.display = 'none';
    }
}

function clearGemHistory() {
    if (confirm('Очистить всю историю?')) {
        gemHistory = [];
        renderGemHistory();
        const resultDiv = document.getElementById('gemResult');
        if (resultDiv) resultDiv.style.display = 'none';
    }
}

window.generateOneGem = generateOneGem;
window.generateBatch = generateBatch;
window.addManualGem = addManualGem;
window.generateRandomSize = generateRandomSize;
window.setBatchSize = setBatchSize;
window.setCustomBatchSize = setCustomBatchSize;
window.clearGemHistory = clearGemHistory;
window.toggleHistoryDetails = toggleHistoryDetails;
