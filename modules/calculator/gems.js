// ========== КАЛЬКУЛЯТОР ДРАГОЦЕННЫХ КАМНЕЙ ==========

const gemCalculator = {
    gemTable: [
        { min: 1, max: 50, name: "Аметист", basePrice: 150 },
        { min: 51, max: 65, name: "Гранат", basePrice: 400 },
        { min: 66, max: 80, name: "Корунд (сапфир)", basePrice: 550 },
        { min: 81, max: 92, name: "Берилл (изумруд)", basePrice: 600 },
        { min: 93, max: 100, name: "Алмаз", basePrice: 750 }
    ],
    
    purityTable: [
        { min: 0, max: 20, multiplier: 0.5, quality: "Ужасная" },
        { min: 21, max: 40, multiplier: 0.7, quality: "Плохая" },
        { min: 41, max: 60, multiplier: 1.0, quality: "Средняя" },
        { min: 61, max: 80, multiplier: 1.2, quality: "Хорошая" },
        { min: 81, max: 100, multiplier: 1.5, quality: "Идеальная" }
    ],
    
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
        return { multiplier: 1.0, quality: "Средняя" };
    },
    
    calculatePrice: function(basePrice, multiplier) {
        return Math.floor(basePrice * multiplier);
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
                    <p style="color: #e0d0c0;">🎲 Бросок d100 определяет тип камня</p>
                    <p style="color: #e0d0c0;">✨ Второй бросок d100 определяет чистоту</p>
                    <p style="color: #d4af37;">💰 Цена = Базовая цена × Множитель чистоты</p>
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
                
                <!-- Таблицы -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div>
                        <h4 style="color: #d4af37;">📊 Камни (d100)</h4>
                        <div style="font-size: 0.8em; color: #e0d0c0;">
                            <div>1-50: Аметист (150)</div>
                            <div>51-65: Гранат (400)</div>
                            <div>66-80: Корунд (550)</div>
                            <div>81-92: Берилл (600)</div>
                            <div>93-100: Алмаз (750)</div>
                        </div>
                    </div>
                    <div>
                        <h4 style="color: #d4af37;">✨ Чистота (d100)</h4>
                        <div style="font-size: 0.8em; color: #e0d0c0;">
                            <div>0-20: Ужасная (x0.5)</div>
                            <div>21-40: Плохая (x0.7)</div>
                            <div>41-60: Средняя (x1.0)</div>
                            <div>61-80: Хорошая (x1.2)</div>
                            <div>81-100: Идеальная (x1.5)</div>
                        </div>
                    </div>
                </div>
                
                <!-- Результат текущей генерации -->
                <div id="gemResult" style="margin-top: 20px; padding: 15px; background: #1a0f0b; border-radius: 8px; display: none; max-height: 300px; overflow-y: auto;"></div>
                
                <!-- Ручной ввод -->
                <div style="margin-top: 20px; padding: 10px; background: #3d2418; border-radius: 6px;">
                    <h4 style="color: #d4af37; margin-bottom: 10px;">🎲 Ручной ввод бросков</h4>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <input type="number" id="manualGemRoll" placeholder="Камень (1-100)" style="flex: 1; padding: 8px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513; border-radius: 4px;">
                        <input type="number" id="manualPurityRoll" placeholder="Чистота (1-100)" style="flex: 1; padding: 8px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513; border-radius: 4px;">
                        <button onclick="addManualGem()" style="background: #8b4513; padding: 8px 15px; border: none; border-radius: 4px; color: white; cursor: pointer;">Добавить</button>
                    </div>
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
    const gemRoll = Math.floor(Math.random() * 100) + 1;
    const purityRoll = Math.floor(Math.random() * 100) + 1;
    const gem = gemCalculator.getGem(gemRoll);
    const purity = gemCalculator.getPurity(purityRoll);
    const price = gemCalculator.calculatePrice(gem.basePrice, purity.multiplier);
    
    const entry = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        type: 'single',
        gems: [{
            gemName: gem.name,
            gemRoll: gemRoll,
            quality: purity.quality,
            purityMultiplier: purity.multiplier,
            purityRoll: purityRoll,
            price: price
        }]
    };
    
    gemHistory.unshift(entry);
    if (gemHistory.length > 50) gemHistory.pop();
    renderGemHistory();
    showResult(entry.gems);
}

// Генерация партии (разные виды)
function generateBatch() {
    const count = currentBatchSize;
    const gemsList = [];
    
    for (let i = 0; i < count; i++) {
        const gemRoll = Math.floor(Math.random() * 100) + 1;
        const purityRoll = Math.floor(Math.random() * 100) + 1;
        const gem = gemCalculator.getGem(gemRoll);
        const purity = gemCalculator.getPurity(purityRoll);
        const price = gemCalculator.calculatePrice(gem.basePrice, purity.multiplier);
        
        gemsList.push({
            gemName: gem.name,
            gemRoll: gemRoll,
            quality: purity.quality,
            purityMultiplier: purity.multiplier,
            purityRoll: purityRoll,
            price: price
        });
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
    
    if (isNaN(gemRoll) || gemRoll < 1 || gemRoll > 100) {
        alert('Введите число от 1 до 100 для броска камня');
        return;
    }
    if (isNaN(purityRoll) || purityRoll < 1 || purityRoll > 100) {
        alert('Введите число от 1 до 100 для броска чистоты');
        return;
    }
    
    const gem = gemCalculator.getGem(gemRoll);
    const purity = gemCalculator.getPurity(purityRoll);
    const price = gemCalculator.calculatePrice(gem.basePrice, purity.multiplier);
    
    const entry = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        type: 'single',
        gems: [{
            gemName: gem.name,
            gemRoll: gemRoll,
            quality: purity.quality,
            purityMultiplier: purity.multiplier,
            purityRoll: purityRoll,
            price: price
        }]
    };
    
    gemHistory.unshift(entry);
    if (gemHistory.length > 50) gemHistory.pop();
    renderGemHistory();
    showResult(entry.gems);
    
    document.getElementById('manualGemRoll').value = '';
    document.getElementById('manualPurityRoll').value = '';
}

// Показать результат текущей генерации
function showResult(gemsList) {
    const resultDiv = document.getElementById('gemResult');
    if (!resultDiv) return;
    
    // Сортировка по названию камня
    const sorted = [...gemsList].sort((a, b) => a.gemName.localeCompare(b.gemName));
    
    let totalPrice = 0;
    let html = '<h4 style="color: #d4af37; margin-bottom: 10px;">📋 РЕЗУЛЬТАТЫ (сортировка по названию):</h4>';
    
    html += '<div style="max-height: 250px; overflow-y: auto;">';
    
    // Группировка по названию
    const grouped = {};
    sorted.forEach(g => {
        if (!grouped[g.gemName]) grouped[g.gemName] = [];
        grouped[g.gemName].push(g);
    });
    
    for (const [gemName, items] of Object.entries(grouped)) {
        html += `<div style="margin: 5px 0; padding: 5px; background: #2c1810; border-radius: 4px;">`;
        html += `<div style="color: #d4af37; font-weight: bold;">${gemName}: ${items.length} шт</div>`;
        
        // Сортируем внутри группы по цене
        items.sort((a, b) => a.price - b.price);
        
        items.forEach((g, idx) => {
            html += `<div style="margin-left: 15px; font-size: 0.85em;">`;
            html += `${idx+1}. ${g.quality} (x${g.purityMultiplier}) = ${g.price}`;
            html += ` <span style="color: #8b7d6b;">[чистота: ${g.purityRoll}]</span>`;
            html += `</div>`;
            totalPrice += g.price;
        });
        html += `</div>`;
    }
    
    html += '</div>';
    html += `<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #8b4513; font-size: 1.2em; color: #d4af37; text-align: right;">🏆 ОБЩАЯ СУММА: ${totalPrice}</div>`;
    
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
            ? `💎 ${entry.gems[0].gemName} — ${entry.gems[0].price}`
            : `🎲 Партия ${entry.batchSize} камней — ${totalPrice}`;
        
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
        
        // Сортировка по названию
        const sorted = [...entry.gems].sort((a, b) => a.gemName.localeCompare(b.gemName));
        
        let html = '<div style="font-size: 0.85em;">';
        
        // Группировка
        const grouped = {};
        sorted.forEach(g => {
            if (!grouped[g.gemName]) grouped[g.gemName] = [];
            grouped[g.gemName].push(g);
        });
        
        for (const [gemName, items] of Object.entries(grouped)) {
            html += `<div style="margin-top: 5px;"><span style="color: #d4af37;">${gemName}:</span> ${items.length} шт</div>`;
            items.forEach(g => {
                html += `<div style="margin-left: 10px;">${g.quality} (x${g.purityMultiplier}) = ${g.price}</div>`;
            });
        }
        
        html += `<div style="margin-top: 5px; color: #d4af37;">Итого: ${entry.gems.reduce((s, g) => s + g.price, 0)}</div>`;
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
