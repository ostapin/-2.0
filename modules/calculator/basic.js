// ========== КАЛЬКУЛЯТОР С РАЗДЕЛАМИ ==========

let calculatorMode = 'basic'; // 'basic' или 'gems'

function renderCalculator() {
    const container = document.getElementById('calculatorContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div style="max-width: 700px; margin: 20px auto;">
            <!-- Переключатель режимов -->
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <button onclick="setCalculatorMode('basic')" id="modeBasicBtn" style="flex: 1; padding: 10px; background: ${calculatorMode === 'basic' ? '#d4af37' : '#2c1810'}; color: ${calculatorMode === 'basic' ? '#2c1810' : '#d4af37'}; border: 2px solid #8b4513; border-radius: 8px; cursor: pointer; font-weight: bold;">🧮 Калькулятор</button>
                <button onclick="setCalculatorMode('gems')" id="modeGemsBtn" style="flex: 1; padding: 10px; background: ${calculatorMode === 'gems' ? '#d4af37' : '#2c1810'}; color: ${calculatorMode === 'gems' ? '#2c1810' : '#d4af37'}; border: 2px solid #8b4513; border-radius: 8px; cursor: pointer; font-weight: bold;">💎 Драгоценные камни</button>
            </div>
            
            <!-- Контент -->
            <div id="calculatorContent"></div>
        </div>
    `;
    
    renderModeContent();
}

function setCalculatorMode(mode) {
    calculatorMode = mode;
    renderModeContent();
    
    const basicBtn = document.getElementById('modeBasicBtn');
    const gemsBtn = document.getElementById('modeGemsBtn');
    if (basicBtn && gemsBtn) {
        basicBtn.style.background = mode === 'basic' ? '#d4af37' : '#2c1810';
        basicBtn.style.color = mode === 'basic' ? '#2c1810' : '#d4af37';
        gemsBtn.style.background = mode === 'gems' ? '#d4af37' : '#2c1810';
        gemsBtn.style.color = mode === 'gems' ? '#2c1810' : '#d4af37';
    }
}

function renderModeContent() {
    const contentDiv = document.getElementById('calculatorContent');
    if (!contentDiv) return;
    
    if (calculatorMode === 'basic') {
        renderBasicCalculator(contentDiv);
    } else {
        renderGemCalculator(contentDiv);
    }
}

// ========== БАЗОВЫЙ КАЛЬКУЛЯТОР ==========
let displayValue = '0';
let memory = 0;
let history = [];
let currentExpression = '';

function renderBasicCalculator(container) {
    container.innerHTML = `
        <div style="background: #2c1810; border-radius: 12px; padding: 20px; border: 2px solid #8b4513;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <button onclick="toggleHistory()" style="background: #5a3a2a; padding: 8px 15px; border: none; border-radius: 6px; color: white; cursor: pointer;">📜 История</button>
                <button onclick="clearHistory()" style="background: #8b4513; padding: 8px 15px; border: none; border-radius: 6px; color: white; cursor: pointer;">🗑️ Очистить</button>
            </div>
            <div style="background: #1a0f0b; padding: 20px; margin-bottom: 15px; border-radius: 8px; text-align: right;">
                <div style="color: #8b7d6b; font-size: 0.9em; min-height: 20px;" id="calcExpression">${currentExpression}</div>
                <div id="calcDisplayMain" style="color: #d4af37; font-size: 2.5em; font-family: monospace; min-height: 70px; word-break: break-all;">${displayValue}</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px;">
                <button onclick="calcMemoryRecall()" style="background: #5a3a2a; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">MR</button>
                <button onclick="calcMemoryClear()" style="background: #5a3a2a; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">MC</button>
                <button onclick="calcMemoryAdd()" style="background: #5a3a2a; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">M+</button>
                <button onclick="calcMemorySubtract()" style="background: #5a3a2a; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">M-</button>
                <button onclick="calcClear()" style="background: #c44536; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">C</button>
                
                <button onclick="calcInput('%')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">%</button>
                <button onclick="calcSqrt()" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">√</button>
                <button onclick="calcSquare()" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">x²</button>
                <button onclick="calcReciprocal()" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">1/x</button>
                <button onclick="calcBackspace()" style="background: #8b4513; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">⌫</button>
                
                <button onclick="calcInput('7')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">7</button>
                <button onclick="calcInput('8')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">8</button>
                <button onclick="calcInput('9')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">9</button>
                <button onclick="calcOperator('/')" style="background: #d4af37; padding: 12px; border: none; border-radius: 6px; cursor: pointer;">÷</button>
                <button onclick="calcClearEntry()" style="background: #8b4513; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">CE</button>
                
                <button onclick="calcInput('4')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">4</button>
                <button onclick="calcInput('5')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">5</button>
                <button onclick="calcInput('6')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">6</button>
                <button onclick="calcOperator('*')" style="background: #d4af37; padding: 12px; border: none; border-radius: 6px; cursor: pointer;">×</button>
                <button onclick="calcToggleSign()" style="background: #8b4513; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">±</button>
                
                <button onclick="calcInput('1')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">1</button>
                <button onclick="calcInput('2')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">2</button>
                <button onclick="calcInput('3')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">3</button>
                <button onclick="calcOperator('-')" style="background: #d4af37; padding: 12px; border: none; border-radius: 6px; cursor: pointer;">-</button>
                <button onclick="calcEquals()" style="background: #27ae60; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">=</button>
                
                <button onclick="calcInput('0')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">0</button>
                <button onclick="calcInput('00')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">00</button>
                <button onclick="calcInput('.')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">.</button>
                <button onclick="calcOperator('+')" style="background: #d4af37; padding: 12px; border: none; border-radius: 6px; cursor: pointer;">+</button>
            </div>
        </div>
        
        <div id="historyPanel" style="margin-top: 15px; background: #2c1810; border-radius: 12px; padding: 15px; border: 2px solid #8b4513; display: none;">
            <h3 style="color: #d4af37; margin: 0 0 10px 0; text-align: center;">📜 История</h3>
            <div id="historyList" style="max-height: 300px; overflow-y: auto;">
                <p style="color: #8b7d6b; text-align: center;">История пуста</p>
            </div>
        </div>
    `;
    renderHistory();
}

function addToHistory(expression, result) {
    const time = new Date().toLocaleTimeString();
    history.unshift({ time, expression, result });
    if (history.length > 50) history.pop();
    renderHistory();
}

function renderHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    if (history.length === 0) {
        historyList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">История пуста</p>';
        return;
    }
    
    historyList.innerHTML = history.map(item => `
        <div style="background: #1a0f0b; margin-bottom: 8px; padding: 8px; border-radius: 4px; cursor: pointer;" onclick="restoreFromHistory('${item.result.replace(/'/g, "\\'")}')">
            <div style="color: #b89a7a; font-size: 0.7em;">${item.time}</div>
            <div style="color: #e0d0c0;">${item.expression} =</div>
            <div style="color: #d4af37; font-weight: bold;">${item.result}</div>
        </div>
    `).join('');
}

function restoreFromHistory(value) {
    const display = document.getElementById('calcDisplayMain');
    if (display) display.innerText = value;
    toggleHistory();
}

function toggleHistory() {
    const panel = document.getElementById('historyPanel');
    if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
}

function clearHistory() {
    history = [];
    renderHistory();
}

function calcInput(value) {
    const display = document.getElementById('calcDisplayMain');
    const expr = document.getElementById('calcExpression');
    if (!display) return;
    
    if (display.innerText === '0' || display.innerText === 'Ошибка') {
        display.innerText = value;
    } else {
        display.innerText += value;
    }
    if (expr) expr.innerText = display.innerText;
}

function calcOperator(op) {
    const display = document.getElementById('calcDisplayMain');
    const expr = document.getElementById('calcExpression');
    if (!display) return;
    
    const lastChar = display.innerText.slice(-1);
    if (['+', '-', '*', '/', '%'].includes(lastChar)) {
        display.innerText = display.innerText.slice(0, -1) + op;
    } else {
        display.innerText += op;
    }
    if (expr) expr.innerText = display.innerText;
}

function calcEquals() {
    const display = document.getElementById('calcDisplayMain');
    const expr = document.getElementById('calcExpression');
    if (!display) return;
    
    try {
        let expression = display.innerText;
        let exprForEval = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/%/g, '/100');
        const result = eval(exprForEval);
        const formattedResult = String(Math.round(result * 1000000) / 1000000);
        
        addToHistory(expression, formattedResult);
        
        display.innerText = formattedResult;
        if (expr) expr.innerText = '';
    } catch(e) {
        display.innerText = 'Ошибка';
        if (expr) expr.innerText = '';
    }
}

function calcClear() {
    const display = document.getElementById('calcDisplayMain');
    const expr = document.getElementById('calcExpression');
    if (display) display.innerText = '0';
    if (expr) expr.innerText = '';
}

function calcClearEntry() {
    const display = document.getElementById('calcDisplayMain');
    if (display) display.innerText = '0';
}

function calcBackspace() {
    const display = document.getElementById('calcDisplayMain');
    const expr = document.getElementById('calcExpression');
    if (!display) return;
    
    if (display.innerText.length === 1 || display.innerText === 'Ошибка') {
        display.innerText = '0';
    } else {
        display.innerText = display.innerText.slice(0, -1);
    }
    if (expr) expr.innerText = display.innerText;
}

function calcToggleSign() {
    const display = document.getElementById('calcDisplayMain');
    if (!display || display.innerText === 'Ошибка') return;
    
    if (display.innerText.startsWith('-')) {
        display.innerText = display.innerText.slice(1);
    } else if (display.innerText !== '0') {
        display.innerText = '-' + display.innerText;
    }
}

function calcSquare() {
    const display = document.getElementById('calcDisplayMain');
    if (!display || display.innerText === 'Ошибка') return;
    
    const num = parseFloat(display.innerText);
    const result = num * num;
    addToHistory(`${num}²`, String(result));
    display.innerText = String(result);
}

function calcSqrt() {
    const display = document.getElementById('calcDisplayMain');
    if (!display || display.innerText === 'Ошибка') return;
    
    const num = parseFloat(display.innerText);
    if (num < 0) {
        display.innerText = 'Ошибка';
    } else {
        const result = Math.sqrt(num);
        addToHistory(`√${num}`, String(result));
        display.innerText = String(result);
    }
}

function calcReciprocal() {
    const display = document.getElementById('calcDisplayMain');
    if (!display || display.innerText === 'Ошибка') return;
    
    const num = parseFloat(display.innerText);
    if (num === 0) {
        display.innerText = 'Ошибка';
    } else {
        const result = 1 / num;
        addToHistory(`1/${num}`, String(result));
        display.innerText = String(result);
    }
}

function calcMemoryAdd() {
    const display = document.getElementById('calcDisplayMain');
    if (!display || display.innerText === 'Ошибка') return;
    memory += parseFloat(display.innerText);
}

function calcMemorySubtract() {
    const display = document.getElementById('calcDisplayMain');
    if (!display || display.innerText === 'Ошибка') return;
    memory -= parseFloat(display.innerText);
}

function calcMemoryRecall() {
    const display = document.getElementById('calcDisplayMain');
    if (!display) return;
    display.innerText = String(memory);
}

function calcMemoryClear() {
    memory = 0;
}

// ========== КАЛЬКУЛЯТОР КАМНЕЙ ==========

const gemsSystem = {
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

function renderGemCalculator(container) {
    container.innerHTML = `
        <div style="background: #2c1810; border-radius: 12px; padding: 20px; border: 2px solid #8b4513;">
            <h3 style="color: #d4af37; margin-bottom: 15px;">💎 ГЕНЕРАТОР ДРАГОЦЕННЫХ КАМНЕЙ</h3>
            
            <div style="margin-bottom: 20px; padding: 15px; background: #1a0f0b; border-radius: 8px;">
                <p style="color: #e0d0c0;">🎲 Бросок d100 определяет тип камня</p>
                <p style="color: #e0d0c0;">✨ Второй бросок d100 определяет чистоту (множитель цены)</p>
                <p style="color: #d4af37;">💰 Цена = Базовая цена × Множитель</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div>
                    <h4 style="color: #d4af37;">📊 Камни (d100)</h4>
                    <div style="font-size: 0.9em; color: #e0d0c0;">
                        <div>1-50: Аметист (150)</div>
                        <div>51-65: Гранат (400)</div>
                        <div>66-80: Корунд (550)</div>
                        <div>81-92: Берилл (600)</div>
                        <div>93-100: Алмаз (750)</div>
                    </div>
                </div>
                <div>
                    <h4 style="color: #d4af37;">✨ Чистота (d100)</h4>
                    <div style="font-size: 0.9em; color: #e0d0c0;">
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
                    <input type="number" id="manualGemRoll" placeholder="Бросок камня (1-100)" style="flex: 1; padding: 8px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513; border-radius: 4px;">
                    <input type="number" id="manualPurityRoll" placeholder="Бросок чистоты (1-100)" style="flex: 1; padding: 8px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513; border-radius: 4px;">
                    <button onclick="generateGemManual()" style="background: #8b4513; padding: 8px 15px; border: none; border-radius: 4px; color: white; cursor: pointer;">Рассчитать</button>
                </div>
            </div>
        </div>
    `;
}

function generateGem() {
    const gemRoll = Math.floor(Math.random() * 100) + 1;
    const purityRoll = Math.floor(Math.random() * 100) + 1;
    
    const gem = gemsSystem.getGem(gemRoll);
    const purity = gemsSystem.getPurity(purityRoll);
    const price = gemsSystem.calculatePrice(gem.basePrice, purity.multiplier);
    
    const resultDiv = document.getElementById('gemResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style="font-size: 1.2em; margin-bottom: 10px;">💎 <strong style="color: #d4af37;">${gem.name}</strong></div>
        <div>🎲 Бросок камня: ${gemRoll}</div>
        <div>💰 Базовая цена: ${gem.basePrice}</div>
        <div>✨ Бросок чистоты: ${purityRoll}</div>
        <div>📊 Качество: ${purity.quality} (x${purity.multiplier})</div>
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #8b4513; font-size: 1.3em; color: #d4af37;">🏷️ Итоговая цена: ${price}</div>
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
    
    const gem = gemsSystem.getGem(gemRoll);
    const purity = gemsSystem.getPurity(purityRoll);
    const price = gemsSystem.calculatePrice(gem.basePrice, purity.multiplier);
    
    const resultDiv = document.getElementById('gemResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style="font-size: 1.2em; margin-bottom: 10px;">💎 <strong style="color: #d4af37;">${gem.name}</strong></div>
        <div>🎲 Бросок камня: ${gemRoll}</div>
        <div>💰 Базовая цена: ${gem.basePrice}</div>
        <div>✨ Бросок чистоты: ${purityRoll}</div>
        <div>📊 Качество: ${purity.quality} (x${purity.multiplier})</div>
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #8b4513; font-size: 1.3em; color: #d4af37;">🏷️ Итоговая цена: ${price}</div>
    `;
}

window.generateGem = generateGem;
window.generateGemManual = generateGemManual;

// Рендер при открытии вкладки
document.addEventListener('DOMContentLoaded', function() {
    const originalOpenTab = window.openTab;
    window.openTab = function(tabId) {
        if (originalOpenTab) originalOpenTab(tabId);
        if (tabId === 'calculator') {
            setTimeout(renderCalculator, 10);
        }
    };
});
