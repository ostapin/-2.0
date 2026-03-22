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

function renderGemCalculator() {
    const container = document.getElementById('calculatorContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto; display: flex; gap: 20px; flex-wrap: wrap;">
            <!-- Основной блок -->
            <div style="flex: 2; min-width: 300px; background: #2c1810; border-radius: 12px; padding: 20px; border: 2px solid #8b4513;">
                <h3 style="color: #d4af37; margin-bottom: 15px;">💎 ГЕНЕРАТОР ДРАГОЦЕННЫХ КАМНЕЙ</h3>
                
                <div style="margin-bottom: 20px; padding: 15px; background: #1a0f0b; border-radius: 8px;">
                    <p style="color: #e0d0c0;">🎲 Бросок d100 определяет тип камня</p>
                    <p style="color: #e0d0c0;">✨ Второй бросок d100 определяет чистоту</p>
                    <p style="color: #d4af37;">💰 Цена = Базовая цена × Множитель чистоты × Количество</p>
                </div>
                
                <!-- Множители количества -->
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #d4af37; margin-bottom: 10px;">📦 МНОЖИТЕЛИ КОЛИЧЕСТВА</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px;">
                        <button onclick="setMultiplier(1)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">x1</button>
                        <button onclick="setMultiplier(3)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">x3</button>
                        <button onclick="setMultiplier(5)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">x5</button>
                        <button onclick="setMultiplier(10)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">x10</button>
                        <button onclick="setMultiplier(15)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">x15</button>
                        <button onclick="setMultiplier(20)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">x20</button>
                        <button onclick="setMultiplier(30)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">x30</button>
                        <button onclick="setMultiplier(40)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">x40</button>
                        <button onclick="setMultiplier(50)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">x50</button>
                        <button onclick="setMultiplier(100)" style="background: #5a3a2a; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer;">x100</button>
                    </div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <span style="color: #e0d0c0;">Свой множитель:</span>
                        <input type="number" id="customMultiplier" value="1" min="1" style="width: 80px; padding: 5px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513; border-radius: 4px;">
                        <button onclick="setCustomMultiplier()" style="background: #8b4513; padding: 5px 10px; border: none; border-radius: 4px; color: white; cursor: pointer;">Установить</button>
                    </div>
                    <div style="margin-top: 10px; color: #d4af37;">Текущий множитель: <span id="currentMultiplier">1</span>x</div>
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
                
                <button onclick="generateGem()" style="width: 100%; background: #d4af37; color: #2c1810; padding: 15px; border: none; border-radius: 8px; font-size: 1.2em; font-weight: bold; cursor: pointer;">💎 СГЕНЕРИРОВАТЬ КАМЕНЬ</button>
                
                <div id="gemResult" style="margin-top: 20px; padding: 15px; background: #1a0f0b; border-radius: 8px; text-align: center; display: none;"></div>
                
                <div style="margin-top: 20px; padding: 10px; background: #3d2418; border-radius: 6px;">
                    <h4 style="color: #d4af37; margin-bottom: 10px;">🎲 Ручной ввод</h4>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <input type="number" id="manualGemRoll" placeholder="Камень (1-100)" style="flex: 1; padding: 8px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513; border-radius: 4px;">
                        <input type="number" id="manualPurityRoll" placeholder="Чистота (1-100)" style="flex: 1; padding: 8px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513; border-radius: 4px;">
                        <button onclick="generateGemManual()" style="background: #8b4513; padding: 8px 15px; border: none; border-radius: 4px; color: white; cursor: pointer;">Рассчитать</button>
                    </div>
                </div>
            </div>
            
            <!-- Блок истории -->
            <div style="flex: 1; min-width: 250px; background: #2c1810; border-radius: 12px; padding: 15px; border: 2px solid #8b4513;">
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
    updateMultiplierDisplay();
}

let currentMultiplier = 1;

function setMultiplier(mult) {
    currentMultiplier = mult;
    updateMultiplierDisplay();
}

function setCustomMultiplier() {
    const input = document.getElementById('customMultiplier');
    let val = parseInt(input.value);
    if (isNaN(val) || val < 1) val = 1;
    currentMultiplier = val;
    updateMultiplierDisplay();
}

function updateMultiplierDisplay() {
    const span = document.getElementById('currentMultiplier');
    if (span) span.innerText = currentMultiplier;
}

function addToGemHistory(entry) {
    const time = new Date().toLocaleTimeString();
    gemHistory.unshift({ time, ...entry });
    if (gemHistory.length > 50) gemHistory.pop();
    renderGemHistory();
}

function renderGemHistory() {
    const historyList = document.getElementById('gemHistoryList');
    if (!historyList) return;
    
    if (gemHistory.length === 0) {
        historyList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">История пуста</p>';
        return;
    }
    
    let totalValue = 0;
    historyList.innerHTML = gemHistory.map(item => {
        totalValue += item.totalPrice;
        return `
            <div style="background: #1a0f0b; margin-bottom: 8px; padding: 8px; border-radius: 4px;">
                <div style="color: #b89a7a; font-size: 0.7em;">${item.time}</div>
                <div style="color: #e0d0c0;">${item.gemName} (${item.quantity}x)</div>
                <div style="color: #e0d0c0;">${item.quality} x${item.purityMultiplier}</div>
                <div style="color: #d4af37; font-weight: bold;">💰 ${item.totalPrice}</div>
            </div>
        `;
    }).join('');
    
    // Добавляем итог
    const totalDiv = document.createElement('div');
    totalDiv.style.cssText = 'margin-top: 10px; padding-top: 10px; border-top: 2px solid #8b4513; color: #d4af37; font-weight: bold; text-align: right;';
    totalDiv.innerHTML = `🏆 Общая сумма: ${totalValue}`;
    historyList.appendChild(totalDiv);
}

function clearGemHistory() {
    gemHistory = [];
    renderGemHistory();
}

function generateGem() {
    const gemRoll = Math.floor(Math.random() * 100) + 1;
    const purityRoll = Math.floor(Math.random() * 100) + 1;
    const gem = gemCalculator.getGem(gemRoll);
    const purity = gemCalculator.getPurity(purityRoll);
    const pricePerOne = gemCalculator.calculatePrice(gem.basePrice, purity.multiplier);
    const totalPrice = pricePerOne * currentMultiplier;
    
    addToGemHistory({
        gemName: gem.name,
        quantity: currentMultiplier,
        quality: purity.quality,
        purityMultiplier: purity.multiplier,
        totalPrice: totalPrice
    });
    
    const resultDiv = document.getElementById('gemResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style="font-size: 1.2em; margin-bottom: 10px;">💎 <strong style="color: #d4af37;">${gem.name}</strong></div>
        <div>🎲 Бросок камня: ${gemRoll}</div>
        <div>💰 Цена за 1 шт: ${pricePerOne}</div>
        <div>✨ Бросок чистоты: ${purityRoll}</div>
        <div>📊 Качество: ${purity.quality} (x${purity.multiplier})</div>
        <div>📦 Количество: ${currentMultiplier}x</div>
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #8b4513; font-size: 1.3em; color: #d4af37;">🏷️ Итоговая цена: ${totalPrice}</div>
    `;
}

function generateGemManual() {
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
    const pricePerOne = gemCalculator.calculatePrice(gem.basePrice, purity.multiplier);
    const totalPrice = pricePerOne * currentMultiplier;
    
    addToGemHistory({
        gemName: gem.name,
        quantity: currentMultiplier,
        quality: purity.quality,
        purityMultiplier: purity.multiplier,
        totalPrice: totalPrice
    });
    
    const resultDiv = document.getElementById('gemResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style="font-size: 1.2em; margin-bottom: 10px;">💎 <strong style="color: #d4af37;">${gem.name}</strong></div>
        <div>🎲 Бросок камня: ${gemRoll}</div>
        <div>💰 Цена за 1 шт: ${pricePerOne}</div>
        <div>✨ Бросок чистоты: ${purityRoll}</div>
        <div>📊 Качество: ${purity.quality} (x${purity.multiplier})</div>
        <div>📦 Количество: ${currentMultiplier}x</div>
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #8b4513; font-size: 1.3em; color: #d4af37;">🏷️ Итоговая цена: ${totalPrice}</div>
    `;
}
