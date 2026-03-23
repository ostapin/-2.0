// ========== КАЛЬКУЛЯТОР ДРАГОЦЕННЫХ КАМНЕЙ ==========

const gemSystem = {
    gemTable: [
        { min: 1, max: 30, name: "Аметист", basePrice: 150 },
        { min: 31, max: 50, name: "Рубин", basePrice: 500 },
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
    
    getGemByName: function(name) {
        for (let i = 0; i < this.gemTable.length; i++) {
            if (this.gemTable[i].name === name) {
                return this.gemTable[i];
            }
        }
        return { name: "Аметист", basePrice: 150 };
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
    
    getSizeVisual: function(size) {
        if (size < 0.5) return "мелкий";
        if (size < 2) return "средний";
        if (size < 10) return "крупный";
        return "огромный";
    },
    
    getPurityVisual: function(multiplier) {
        if (multiplier < 0.8) return "мутный";
        return "прозрачный";
    },
    
    generateOneGemByType: function(gemType) {
        const purityRoll = Math.floor(Math.random() * 100) + 1;
        const suitabilityRoll = Math.floor(Math.random() * 100) + 1;
        const size = this.getSize();
        const purity = this.getPurity(purityRoll);
        const suitability = this.getSuitability(suitabilityRoll);
        const price = this.calculatePrice(gemType.basePrice, size, purity.multiplier, suitability.multiplier);
        return {
            gemName: gemType.name,
            basePrice: gemType.basePrice,
            size: size,
            sizeVisual: this.getSizeVisual(size),
            purityMultiplier: purity.multiplier,
            purityName: purity.name,
            purityVisual: this.getPurityVisual(purity.multiplier),
            suitabilityMultiplier: suitability.multiplier,
            suitabilityName: suitability.name,
            price: price
        };
    },
    
    generateRandomGem: function() {
        const gemRoll = Math.floor(Math.random() * 100) + 1;
        const gemType = this.getGem(gemRoll);
        return this.generateOneGemByType(gemType);
    }
};

let gemHistory = [];
let currentBatchSize = 1;
let isProMode = false;

function renderGemCalculator() {
    const container = document.getElementById('calculatorContainer');
    if (!container) return;
    
    const gemOptions = [
        { name: "Аметист", basePrice: 150 },
        { name: "Рубин", basePrice: 500 },
        { name: "Гранат", basePrice: 400 },
        { name: "Корунд (сапфир)", basePrice: 550 },
        { name: "Берилл (изумруд)", basePrice: 600 },
        { name: "Алмаз", basePrice: 750 }
    ];
    
    let gemSelectHtml = '';
    gemOptions.forEach(g => {
        gemSelectHtml += `<option value="${g.name}">${g.name} (база ${g.basePrice})</option>`;
    });
    
    container.innerHTML = `
        <div style="max-width: 1000px; margin: 0 auto; display: flex; gap: 20px; flex-wrap: wrap;">
            <div style="flex: 2; min-width: 400px; background: #2c1810; border-radius: 12px; padding: 20px; border: 2px solid #8b4513;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="color: #d4af37; margin: 0;">💎 ГЕНЕРАТОР ДРАГОЦЕННЫХ КАМНЕЙ</h3>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <span style="color: #e0d0c0;">Профи</span>
                        <input type="checkbox" id="proModeToggle" ${isProMode ? 'checked' : ''} onchange="toggleProMode()" style="width: 20px; height: 20px; cursor: pointer;">
                    </label>
                </div>
                <div style="margin-bottom: 20px; padding: 15px; background: #1a0f0b; border-radius: 8px;">
                    <p style="color: #e0d0c0;">💎 ОДИН ВИД — все камни одного вида, но с разными параметрами</p>
                    <p style="color: #e0d0c0;">🎲 РАЗНЫЕ ВИДЫ — каждый камень со своим случайным видом</p>
                </div>
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #d4af37; margin-bottom: 10px;">📦 КОЛИЧЕСТВО КАМНЕЙ</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px;">
                        <button onclick="setBatchSizeGem(1)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">1</button>
                        <button onclick="setBatchSizeGem(3)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">3</button>
                        <button onclick="setBatchSizeGem(5)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">5</button>
                        <button onclick="setBatchSizeGem(10)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">10</button>
                        <button onclick="setBatchSizeGem(15)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">15</button>
                        <button onclick="setBatchSizeGem(20)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">20</button>
                        <button onclick="setBatchSizeGem(30)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">30</button>
                        <button onclick="setBatchSizeGem(50)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">50</button>
                        <button onclick="setBatchSizeGem(100)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">100</button>
                    </div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <span style="color: #e0d0c0;">Своё количество:</span>
                        <input type="number" id="customBatchSizeGem" value="1" min="1" style="width: 80px; padding: 5px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513; border-radius: 4px;">
                        <button onclick="setCustomBatchSizeGem()" style="background: #8b4513; padding: 5px 10px; border: none; border-radius: 4px; color: white; cursor: pointer;">Установить</button>
                    </div>
                    <div style="margin-top: 10px; color: #d4af37;">Количество: <span id="currentBatchSizeGem">1</span> камней</div>
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                    <button onclick="generateOneTypeGems()" style="flex: 1; background: #d4af37; color: #2c1810; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">💎 ОДИН ВИД (${currentBatchSize})</button>
                    <button onclick="generateBatchGem()" style="flex: 1; background: #27ae60; color: white; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">🎲 РАЗНЫЕ ВИДЫ (${currentBatchSize})</button>
                </div>
                <div id="gemResult" style="margin-top: 20px; padding: 15px; background: #1a0f0b; border-radius: 8px; display: none; max-height: 400px; overflow-y: auto;"></div>
                <div style="margin-top: 20px; padding: 10px; background: #3d2418; border-radius: 6px;">
                    <h4 style="color: #d4af37; margin-bottom: 10px;">🎲 РУЧНОЙ ВВОД ПАРАМЕТРОВ</h4>
                    <div style="margin-bottom: 10px;">
                        <label style="color: #e0d0c0; display: block; margin-bottom: 5px;">Вид камня:</label>
                        <select id="manualGemSelect" style="width: 100%; padding: 8px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513; border-radius: 4px;">
                            ${gemSelectHtml}
                        </select>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                        <div>
                            <label style="color: #e0d0c0; display: block; margin-bottom: 5px;">Чистота (1-100):</label>
                            <input type="number" id="manualPurityRoll" placeholder="1-100" value="50" style="width: 100%; padding: 8px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513; border-radius: 4px;">
                        </div>
                        <div>
                            <label style="color: #e0d0c0; display: block; margin-bottom: 5px;">Пригодность (1-100):</label>
                            <input type="number" id="manualSuitabilityRoll" placeholder="1-100" value="50" style="width: 100%; padding: 8px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513; border-radius: 4px;">
                        </div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="color: #e0d0c0; display: block; margin-bottom: 5px;">Размер (карат):</label>
                        <div style="display: flex; gap: 10px;">
                            <input type="number" id="manualSize" step="0.1" placeholder="Размер в каратах" style="flex: 2; padding: 8px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513; border-radius: 4px;">
                            <button onclick="generateRandomSizeGem()" style="flex: 1; background: #5a3a2a; padding: 8px; border: none; border-radius: 4px; color: white; cursor: pointer;">🎲 Случайный</button>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button onclick="addManualGem()" style="flex: 1; background: #8b4513; padding: 10px; border: none; border-radius: 4px; color: white; cursor: pointer;">➕ Добавить 1 камень</button>
                        <button onclick="addManualGemBatch()" style="flex: 1; background: #27ae60; padding: 10px; border: none; border-radius: 4px; color: white; cursor: pointer;">📦 Добавить ${currentBatchSize} камней (одинаковых)</button>
                    </div>
                    <div id="manualSizeResult" style="margin-top: 10px; color: #b89a7a; font-size: 0.85em;"></div>
                </div>
            </div>
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
    updateBatchSizeDisplayGem();
}

function addToInventoryFromGems(gemsList, batchInfo) {
    if (typeof window.addCustomItem !== 'function') {
        alert('Ошибка: система инвентаря не загружена');
        return;
    }
    
    let description = '';
    if (isProMode) {
        const grouped = {};
        gemsList.forEach(g => {
            if (!grouped[g.gemName]) grouped[g.gemName] = [];
            grouped[g.gemName].push(g);
        });
        for (const [name, items] of Object.entries(grouped)) {
            description += `${name}: ${items.length} шт\n`;
            items.forEach((g, i) => {
                description += `  ${i+1}. ${g.size.toFixed(2)} карат, ${g.purityName} (x${g.purityMultiplier}), ${g.suitabilityName} (x${g.suitabilityMultiplier}) = ${g.price} зол.\n`;
            });
        }
        description += `\nОбщая сумма: ${batchInfo.totalPrice.toLocaleString()} зол.`;
    } else {
        const grouped = {};
        gemsList.forEach(g => {
            if (!grouped[g.gemName]) grouped[g.gemName] = 0;
            grouped[g.gemName] += 1;
        });
        for (const [name, count] of Object.entries(grouped)) {
            const sample = gemsList.find(g => g.gemName === name);
            description += `${name}: ${count} шт, ${sample.sizeVisual}, ${sample.purityVisual}\n`;
        }
    }
    
    window.addCustomItem({
        name: batchInfo.title,
        quantity: 1,
        category: 'valuables',
        description: description
    });
    
    alert(`✅ ${batchInfo.title} добавлен в инвентарь (раздел "Ценности")`);
}

function toggleProMode() {
    isProMode = document.getElementById('proModeToggle').checked;
    renderGemHistory();
    const resultDiv = document.getElementById('gemResult');
    if (resultDiv && resultDiv.style.display === 'block') {
        const lastEntry = gemHistory[0];
        if (lastEntry) {
            showResultGem(lastEntry.gems, lastEntry.totalPrice);
        }
    }
}

function setBatchSizeGem(size) { currentBatchSize = size; updateBatchSizeDisplayGem(); updateButtonsText(); }
function setCustomBatchSizeGem() { let v = parseInt(document.getElementById('customBatchSizeGem').value); if (isNaN(v) || v < 1) v = 1; currentBatchSize = v; updateBatchSizeDisplayGem(); updateButtonsText(); }
function updateBatchSizeDisplayGem() { let s = document.getElementById('currentBatchSizeGem'); if (s) s.innerText = currentBatchSize; }
function updateButtonsText() { 
    let b1 = document.querySelector('#calculator-tab button[onclick="generateOneTypeGems()"]'); 
    let b2 = document.querySelector('#calculator-tab button[onclick="generateBatchGem()"]'); 
    if (b1) b1.innerHTML = `💎 ОДИН ВИД (${currentBatchSize})`; 
    if (b2) b2.innerHTML = `🎲 РАЗНЫЕ ВИДЫ (${currentBatchSize})`; 
}

function generateOneTypeGems() {
    let count = currentBatchSize;
    let gemRoll = Math.floor(Math.random() * 100) + 1;
    let gemType = gemSystem.getGem(gemRoll);
    let gemsList = [];
    for (let i = 0; i < count; i++) {
        gemsList.push(gemSystem.generateOneGemByType(gemType));
    }
    let totalPrice = gemsList.reduce((s, g) => s + g.price, 0);
    gemHistory.unshift({ id: Date.now(), time: new Date().toLocaleTimeString(), type: 'single_type', batchSize: count, gems: gemsList, totalPrice: totalPrice, gemTypeName: gemType.name });
    if (gemHistory.length > 50) gemHistory.pop();
    renderGemHistory();
    showResultGem(gemsList, totalPrice);
}

function generateBatchGem() {
    let count = currentBatchSize;
    let gemsList = [];
    for (let i = 0; i < count; i++) {
        gemsList.push(gemSystem.generateRandomGem());
    }
    let totalPrice = gemsList.reduce((s, g) => s + g.price, 0);
    gemHistory.unshift({ id: Date.now(), time: new Date().toLocaleTimeString(), type: 'batch', batchSize: count, gems: gemsList, totalPrice: totalPrice });
    if (gemHistory.length > 50) gemHistory.pop();
    renderGemHistory();
    showResultGem(gemsList, totalPrice);
}

function addManualGem() {
    let gemSelect = document.getElementById('manualGemSelect');
    let gemType = gemSystem.getGemByName(gemSelect.value);
    let purityRoll = parseInt(document.getElementById('manualPurityRoll').value);
    let suitabilityRoll = parseInt(document.getElementById('manualSuitabilityRoll').value);
    let size = parseFloat(document.getElementById('manualSize').value);
    if (isNaN(purityRoll) || purityRoll < 1 || purityRoll > 100) { alert('Чистота от 1 до 100'); return; }
    if (isNaN(suitabilityRoll) || suitabilityRoll < 1 || suitabilityRoll > 100) { alert('Пригодность от 1 до 100'); return; }
    if (isNaN(size) || size <= 0) { alert('Введите размер'); return; }
    let purity = gemSystem.getPurity(purityRoll);
    let suitability = gemSystem.getSuitability(suitabilityRoll);
    let price = gemSystem.calculatePrice(gemType.basePrice, size, purity.multiplier, suitability.multiplier);
    let manualGem = {
        gemName: gemType.name,
        basePrice: gemType.basePrice,
        size: size,
        sizeVisual: gemSystem.getSizeVisual(size),
        purityMultiplier: purity.multiplier,
        purityName: purity.name,
        purityVisual: gemSystem.getPurityVisual(purity.multiplier),
        suitabilityMultiplier: suitability.multiplier,
        suitabilityName: suitability.name,
        price: price
    };
    gemHistory.unshift({ id: Date.now(), time: new Date().toLocaleTimeString(), type: 'manual', gems: [manualGem], totalPrice: price });
    if (gemHistory.length > 50) gemHistory.pop();
    renderGemHistory();
    showResultGem([manualGem], price);
}

function addManualGemBatch() {
    let count = currentBatchSize;
    let gemSelect = document.getElementById('manualGemSelect');
    let gemType = gemSystem.getGemByName(gemSelect.value);
    let purityRoll = parseInt(document.getElementById('manualPurityRoll').value);
    let suitabilityRoll = parseInt(document.getElementById('manualSuitabilityRoll').value);
    let size = parseFloat(document.getElementById('manualSize').value);
    if (isNaN(purityRoll) || purityRoll < 1 || purityRoll > 100) { alert('Чистота от 1 до 100'); return; }
    if (isNaN(suitabilityRoll) || suitabilityRoll < 1 || suitabilityRoll > 100) { alert('Пригодность от 1 до 100'); return; }
    if (isNaN(size) || size <= 0) { alert('Введите размер'); return; }
    let purity = gemSystem.getPurity(purityRoll);
    let suitability = gemSystem.getSuitability(suitabilityRoll);
    let pricePerOne = gemSystem.calculatePrice(gemType.basePrice, size, purity.multiplier, suitability.multiplier);
    let totalPrice = pricePerOne * count;
    let gemsList = [];
    for (let i = 0; i < count; i++) {
        gemsList.push({
            gemName: gemType.name,
            basePrice: gemType.basePrice,
            size: size,
            sizeVisual: gemSystem.getSizeVisual(size),
            purityMultiplier: purity.multiplier,
            purityName: purity.name,
            purityVisual: gemSystem.getPurityVisual(purity.multiplier),
            suitabilityMultiplier: suitability.multiplier,
            suitabilityName: suitability.name,
            price: pricePerOne
        });
    }
    gemHistory.unshift({ id: Date.now(), time: new Date().toLocaleTimeString(), type: 'manual_batch', batchSize: count, gems: gemsList, totalPrice: totalPrice, gemTypeName: gemType.name });
    if (gemHistory.length > 50) gemHistory.pop();
    renderGemHistory();
    showResultGem(gemsList, totalPrice);
}

function generateRandomSizeGem() {
    let size = gemSystem.getSize();
    document.getElementById('manualSize').value = size.toFixed(2);
    let range = size < 1 ? "0.1-1 карат" : size < 5 ? "1-5 карат" : size < 10 ? "5-10 карат" : size < 50 ? "10-50 карат" : size < 100 ? "50-100 карат" : size < 1000 ? "100-1000 карат" : "1000-10000 карат";
    document.getElementById('manualSizeResult').innerHTML = `🎲 Размер: ${size.toFixed(2)} карат (${range})`;
}

function getGemDisplay(g) {
    if (isProMode) {
        return `${g.gemName} | ${g.size.toFixed(2)} карат | ${g.purityName} (x${g.purityMultiplier}) | ${g.suitabilityName} (x${g.suitabilityMultiplier}) = ${g.price.toLocaleString()} зол.`;
    } else {
        return `${g.gemName} | ${g.sizeVisual} | ${g.purityVisual}`;
    }
}

function showResultGem(gemsList, totalPrice) {
    let div = document.getElementById('gemResult');
    if (!div) return;
    let sorted = [...gemsList].sort((a, b) => a.gemName.localeCompare(b.gemName));
    
    let batchInfo = {
        title: `Находка: ${sorted[0].gemName}${sorted.length > 1 ? ` (${sorted.length} шт)` : ''}`,
        totalPrice: totalPrice
    };
    
    let html = '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">';
    html += '<h4 style="color:#d4af37; margin:0;">📋 РЕЗУЛЬТАТЫ:</h4>';
    html += `<button onclick="addToInventoryFromGems(${JSON.stringify(gemsList).replace(/"/g, '&quot;')}, ${JSON.stringify(batchInfo).replace(/"/g, '&quot;')})" style="background: #27ae60; padding: 5px 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">📦 В инвентарь</button>`;
    html += '</div><div style="max-height:350px;overflow-y:auto;">';
    
    let grouped = {};
    sorted.forEach(g => { if (!grouped[g.gemName]) grouped[g.gemName] = []; grouped[g.gemName].push(g); });
    for (let [name, items] of Object.entries(grouped)) {
        let groupTotal = items.reduce((s, g) => s + g.price, 0);
        html += `<div style="margin:8px 0;padding:8px;background:#2c1810;border-radius:4px;"><div style="color:#d4af37;font-weight:bold;">${name}: ${items.length} шт — ${isProMode ? groupTotal.toLocaleString() + ' зол.' : ''}</div>`;
        items.forEach((g, idx) => {
            html += `<div style="margin-left:15px;">${idx+1}. ${getGemDisplay(g)}</div>`;
        });
        html += `</div>`;
    }
    html += `</div>`;
    if (isProMode) {
        html += `<div style="margin-top:10px;border-top:1px solid #8b4513;text-align:right;color:#d4af37;">🏆 ОБЩАЯ СУММА: ${totalPrice.toLocaleString()} зол.</div>`;
    }
    div.style.display = 'block';
    div.innerHTML = html;
}

function renderGemHistory() {
    let list = document.getElementById('gemHistoryList');
    if (!list) return;
    if (gemHistory.length === 0) { list.innerHTML = '<p style="color:#8b7d6b;text-align:center;">История пуста</p>'; return; }
    list.innerHTML = gemHistory.map((e, i) => {
        let title = '';
        if (e.type === 'single_type') {
            title = isProMode ? `💎 ${e.gemTypeName} x${e.batchSize} — ${e.totalPrice.toLocaleString()}` : `💎 ${e.gemTypeName} x${e.batchSize}`;
        } else if (e.type === 'batch') {
            title = isProMode ? `🎲 Партия ${e.batchSize} камней — ${e.totalPrice.toLocaleString()}` : `🎲 Партия ${e.batchSize} камней`;
        } else if (e.type === 'manual') {
            title = isProMode ? `✋ ${e.gems[0].gemName} — ${e.totalPrice.toLocaleString()}` : `✋ ${e.gems[0].gemName}`;
        } else {
            title = isProMode ? `📦 ${e.gemTypeName} x${e.batchSize} — ${e.totalPrice.toLocaleString()}` : `📦 ${e.gemTypeName} x${e.batchSize}`;
        }
        let batchInfo = {
            title: title.replace(/[^а-яА-Яa-zA-Z0-9\s]/g, '').trim(),
            totalPrice: e.totalPrice
        };
        let gemsJson = JSON.stringify(e.gems).replace(/"/g, '&quot;');
        let batchJson = JSON.stringify(batchInfo).replace(/"/g, '&quot;');
        return `<div style="background:#1a0f0b;margin-bottom:8px;padding:8px;border-radius:4px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="cursor:pointer; flex:1;" onclick="toggleHistoryDetailsGem(${i})">
                    <div style="color:#b89a7a;font-size:0.7em;">${e.time}</div>
                    <div style="color:#e0d0c0;">${title}</div>
                </div>
                <button onclick="addToInventoryFromGems(${gemsJson}, ${batchJson})" style="background: #27ae60; padding: 4px 8px; border: none; border-radius: 4px; color: white; cursor: pointer; font-size: 0.8em;">📦</button>
            </div>
            <div id="history-details-gem-${i}" style="display:none;margin-top:8px;padding-top:8px;border-top:1px solid #8b4513;"></div>
        </div>`;
    }).join('');
}

function toggleHistoryDetailsGem(i) {
    let d = document.getElementById(`history-details-gem-${i}`);
    if (!d) return;
    if (d.style.display === 'none') {
        let e = gemHistory[i];
        let sorted = [...e.gems].sort((a,b) => a.gemName.localeCompare(b.gemName));
        let html = '<div style="font-size:0.8em;">';
        let grouped = {};
        sorted.forEach(g => { if (!grouped[g.gemName]) grouped[g.gemName] = []; grouped[g.gemName].push(g); });
        for (let [name, items] of Object.entries(grouped)) {
            let groupTotal = items.reduce((s,g) => s + g.price, 0);
            html += `<div><span style="color:#d4af37;">${name}:</span> ${items.length} шт — ${isProMode ? groupTotal.toLocaleString() + ' зол.' : ''}</div>`;
            items.forEach(g => {
                html += `<div style="margin-left:10px;">${getGemDisplay(g)}</div>`;
            });
        }
        if (isProMode) {
            html += `<div style="margin-top:5px;color:#d4af37;">Итого: ${e.totalPrice.toLocaleString()} зол.</div>`;
        }
        html += '</div>';
        d.innerHTML = html;
        d.style.display = 'block';
    } else {
        d.style.display = 'none';
    }
}

function clearGemHistory() { if (confirm('Очистить историю?')) { gemHistory = []; renderGemHistory(); let r = document.getElementById('gemResult'); if (r) r.style.display = 'none'; } }

window.renderGemCalculator = renderGemCalculator;
window.generateOneTypeGems = generateOneTypeGems;
window.generateBatchGem = generateBatchGem;
window.addManualGem = addManualGem;
window.addManualGemBatch = addManualGemBatch;
window.generateRandomSizeGem = generateRandomSizeGem;
window.setBatchSizeGem = setBatchSizeGem;
window.setCustomBatchSizeGem = setCustomBatchSizeGem;
window.clearGemHistory = clearGemHistory;
window.toggleHistoryDetailsGem = toggleHistoryDetailsGem;
window.toggleProMode = toggleProMode;
window.addToInventoryFromGems = addToInventoryFromGems;
