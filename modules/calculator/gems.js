// ========== КАЛЬКУЛЯТОР ДРАГОЦЕННЫХ КАМНЕЙ ==========

const gemsSystem = {
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
        gemSelectHtml += `<option value="${g.name}" data-price="${g.basePrice}">${g.name} (база ${g.basePrice})</option>`;
    });
    
    container.innerHTML = `
        <div style="max-width: 1000px; margin: 0 auto; display: flex; gap: 20px; flex-wrap: wrap;">
            <div style="flex: 2; min-width: 400px; background: #2c1810; border-radius: 12px; padding: 20px; border: 2px solid #8b4513;">
                <h3 style="color: #d4af37; margin-bottom: 15px;">💎 ГЕНЕРАТОР ДРАГОЦЕННЫХ КАМНЕЙ</h3>
                
                <div style="margin-bottom: 20px; padding: 15px; background: #1a0f0b; border-radius: 8px;">
                    <p style="color: #e0d0c0;">💎 ОДИН ВИД — все камни одинаковые (один бросок на параметры)</p>
                    <p style="color: #e0d0c0;">🎲 РАЗНЫЕ ВИДЫ — каждый камень со своим броском</p>
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

function setBatchSizeGem(size) {
    currentBatchSize = size;
    updateBatchSizeDisplayGem();
    const btn1 = document.querySelector('#calculator-tab button[onclick="generateOneTypeGems()"]');
    const btn2 = document.querySelector('#calculator-tab button[onclick="generateBatchGem()"]');
    if (btn1) btn1.innerHTML = `💎 ОДИН ВИД (${currentBatchSize})`;
    if (btn2) btn2.innerHTML = `🎲 РАЗНЫЕ ВИДЫ (${currentBatchSize})`;
}

function setCustomBatchSizeGem() {
    const input = document.getElementById('customBatchSizeGem');
    let val = parseInt(input.value);
    if (isNaN(val) || val < 1) val = 1;
    currentBatchSize = val;
    updateBatchSizeDisplayGem();
    const btn1 = document.querySelector('#calculator-tab button[onclick="generateOneTypeGems()"]');
    const btn2 = document.querySelector('#calculator-tab button[onclick="generateBatchGem()"]');
    if (btn1) btn1.innerHTML = `💎 ОДИН ВИД (${currentBatchSize})`;
    if (btn2) btn2.innerHTML = `🎲 РАЗНЫЕ ВИДЫ (${currentBatchSize})`;
}

function updateBatchSizeDisplayGem() {
    const span = document.getElementById('currentBatchSizeGem');
    if (span) span.innerText = currentBatchSize;
}

function generateOneTypeGems() {
    const count = currentBatchSize;
    if (count < 1) return;
    
    const gemRoll = Math.floor(Math.random() * 100) + 1;
    const purityRoll = Math.floor(Math.random() * 100) + 1;
    const suitabilityRoll = Math.floor(Math.random() * 100) + 1;
    
    const gem = gemsSystem.getGem(gemRoll);
    const purity = gemsSystem.getPurity(purityRoll);
    const suitability = gemsSystem.getSuitability(suitabilityRoll);
    const size = gemsSystem.getSize();
    const pricePerOne = gemsSystem.calculatePrice(gem.basePrice, size, purity.multiplier, suitability.multiplier);
    const totalPrice = pricePerOne * count;
    
    const gemsList = [];
    for (let i = 0; i < count; i++) {
        gemsList.push({
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
            price: pricePerOne
        });
    }
    
    const entry = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        type: 'single_type',
        batchSize: count,
        gems: gemsList,
        totalPrice: totalPrice
    };
    
    gemHistory.unshift(entry);
    if (gemHistory.length > 50) gemHistory.pop();
    renderGemHistory();
    showResultGem(gemsList, totalPrice);
}

function generateBatchGem() {
    const count = currentBatchSize;
    if (count < 1) return;
    
    const gemsList = [];
    for (let i = 0; i < count; i++) {
        gemsList.push(gemsSystem.generateOneGem());
    }
    const totalPrice = gemsList.reduce((sum, g) => sum + g.price, 0);
    
    const entry = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        type: 'batch',
        batchSize: count,
        gems: gemsList,
        totalPrice: totalPrice
    };
    
    gemHistory.unshift(entry);
    if (gemHistory.length > 50) gemHistory.pop();
    renderGemHistory();
    showResultGem(gemsList, totalPrice);
}

function addManualGem() {
    const gemSelect = document.getElementById('manualGemSelect');
    const selectedGemName = gemSelect.value;
    const gem = gemsSystem.getGemByName(selectedGemName);
    
    const purityRoll = parseInt(document.getElementById('manualPurityRoll').value);
    const suitabilityRoll = parseInt(document.getElementById('manualSuitabilityRoll').value);
    let size = parseFloat(document.getElementById('manualSize').value);
    
    if (isNaN(purityRoll) || purityRoll < 1 || purityRoll > 100) {
        alert('Введите число от 1 до 100 для чистоты');
        return;
    }
    if (isNaN(suitabilityRoll) || suitabilityRoll < 1 || suitabilityRoll > 100) {
        alert('Введите число от 1 до 100 для пригодности');
        return;
    }
    if (isNaN(size) || size <= 0) {
        alert('Введите положительный размер в каратах');
        return;
    }
    
    const purity = gemsSystem.getPurity(purityRoll);
    const suitability = gemsSystem.getSuitability(suitabilityRoll);
    const price = gemsSystem.calculatePrice(gem.basePrice, size, purity.multiplier, suitability.multiplier);
    
    const manualGem = {
        gemName: gem.name,
        gemRoll: null,
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
        type: 'manual',
        gems: [manualGem],
        totalPrice: price
    };
    
    gemHistory.unshift(entry);
    if (gemHistory.length > 50) gemHistory.pop();
    renderGemHistory();
    showResultGem([manualGem], price);
}

function addManualGemBatch() {
    const count = currentBatchSize;
    if (count < 1) return;
    
    const gemSelect = document.getElementById('manualGemSelect');
    const selectedGemName = gemSelect.value;
    const gem = gemsSystem.getGemByName(selectedGemName);
    
    const purityRoll = parseInt(document.getElementById('manualPurityRoll').value);
    const suitabilityRoll = parseInt(document.getElementById('manualSuitabilityRoll').value);
    let size = parseFloat(document.getElementById('manualSize').value);
    
    if (isNaN(purityRoll) || purityRoll < 1 || purityRoll > 100) {
        alert('Введите число от 1 до 100 для чистоты');
        return;
    }
    if (isNaN(suitabilityRoll) || suitabilityRoll < 1 || suitabilityRoll > 100) {
        alert('Введите число от 1 до 100 для пригодности');
        return;
    }
    if (isNaN(size) || size <= 0) {
        alert('Введите положительный размер в каратах');
        return;
    }
    
    const purity = gemsSystem.getPurity(purityRoll);
    const suitability = gemsSystem.getSuitability(suitabilityRoll);
    const pricePerOne = gemsSystem.calculatePrice(gem.basePrice, size, purity.multiplier, suitability.multiplier);
    const totalPrice = pricePerOne * count;
    
    const gemsList = [];
    for (let i = 0; i < count; i++) {
        gemsList.push({
            gemName: gem.name,
            gemRoll: null,
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
            price: pricePerOne
        });
    }
    
    const entry = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        type: 'manual_batch',
        batchSize: count,
        gems: gemsList,
        totalPrice: totalPrice
    };
    
    gemHistory.unshift(entry);
    if (gemHistory.length > 50) gemHistory.pop();
    renderGemHistory();
    showResultGem(gemsList, totalPrice);
}

function generateRandomSizeGem() {
    const size = gemsSystem.getSize();
    let range = "";
    if (size < 1) range = "0.1-1 карат";
    else if (size < 5) range = "1-5 карат";
    else if (size < 10) range = "5-10 карат";
    else if (size < 50) range = "10-50 карат";
    else if (size < 100) range = "50-100 карат";
    else if (size < 1000) range = "100-1000 карат";
    else range = "1000-10000 карат";
    
    document.getElementById('manualSize').value = size.toFixed(2);
    document.getElementById('manualSizeResult').innerHTML = `🎲 Размер: ${size.toFixed(2)} карат (${range})`;
}

function showResultGem(gemsList, totalPrice) {
    const resultDiv = document.getElementById('gemResult');
    if (!resultDiv) return;
    
    const sorted = [...gemsList].sort((a, b) => a.gemName.localeCompare(b.gemName));
    
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
        });
        html += `</div>`;
    }
    
    html += '</div>';
    html += `<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #8b4513; font-size: 1.2em; color: #d4af37; text-align: right;">🏆 ОБЩАЯ СУММА: ${totalPrice.toLocaleString()} зол.</div>`;
    
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = html;
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderGemHistory() {
    const historyList = document.getElementById('gemHistoryList');
    if (!historyList) return;
    
    if (gemHistory.length === 0) {
        historyList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">История пуста</p>';
        return;
    }
    
    historyList.innerHTML = gemHistory.map((entry, idx) => {
        let title = '';
        if (entry.type === 'single_type') {
            title = `💎 ${entry.gems[0].gemName} x${entry.batchSize} — ${entry.totalPrice.toLocaleString()}`;
        } else if (entry.type === 'batch') {
            title = `🎲 Партия ${entry.batchSize} камней — ${entry.totalPrice.toLocaleString()}`;
        } else if (entry.type === 'manual') {
            title = `✋ ${entry.gems[0].gemName} — ${entry.totalPrice.toLocaleString()}`;
        } else {
            title = `📦 ${entry.gems[0].gemName} x${entry.batchSize} — ${entry.totalPrice.toLocaleString()}`;
        }
        
        return `
            <div style="background: #1a0f0b; margin-bottom: 8px; padding: 8px; border-radius: 4px; cursor: pointer;" onclick="toggleHistoryDetailsGem(${idx})">
                <div style="color: #b89a7a; font-size: 0.7em;">${entry.time}</div>
                <div style="color: #e0d0c0;">${title}</div>
                <div id="history-details-gem-${idx}" style="display: none; margin-top: 8px; padding-top: 8px; border-top: 1px solid #8b4513;"></div>
            </div>
        `;
    }).join('');
}

function toggleHistoryDetailsGem(index) {
    const detailsDiv = document.getElementById(`history-details-gem-${index}`);
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
        
        html += `<div style="margin-top: 5px; color: #d4af37;">Итого: ${entry.totalPrice.toLocaleString()}</div>`;
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
