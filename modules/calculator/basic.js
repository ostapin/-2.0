// ========== КАЛЬКУЛЯТОР ==========

let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecond = false;

function renderCalculator() {
    const container = document.getElementById('calculatorContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; min-height: 500px; padding: 20px;">
            <div style="width: 100%; max-width: 400px; background: #2c1810; border-radius: 12px; padding: 20px; border: 2px solid #8b4513; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                <div style="background: #1a0f0b; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: right; min-height: 80px;">
                    <div id="calcDisplay" style="color: #d4af37; font-size: 2.5em; font-weight: bold; word-break: break-all; line-height: 1.2;">0</div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                    <button class="calc-btn" onclick="calcClear()" style="background: #c44536; padding: 15px; font-size: 1.2em; border: none; border-radius: 6px; cursor: pointer; color: white; font-weight: bold;">C</button>
                    <button class="calc-btn" onclick="calcClearEntry()" style="background: #8b4513; padding: 15px; font-size: 1.2em; border: none; border-radius: 6px; cursor: pointer; color: white; font-weight: bold;">CE</button>
                    <button class="calc-btn" onclick="calcBackspace()" style="background: #8b4513; padding: 15px; font-size: 1.2em; border: none; border-radius: 6px; cursor: pointer; color: white; font-weight: bold;">⌫</button>
                    <button class="calc-btn" onclick="calcOperator('/')" style="background: #d4af37; padding: 15px; font-size: 1.5em; border: none; border-radius: 6px; cursor: pointer; color: #2c1810; font-weight: bold;">÷</button>
                    
                    <button class="calc-btn" onclick="calcInput('7')" style="background: #3d2418; padding: 15px; font-size: 1.2em; border: none; border-radius: 6px; cursor: pointer; color: #e0d0c0; font-weight: bold;">7</button>
                    <button class="calc-btn" onclick="calcInput('8')" style="background: #3d2418; padding: 15px; font-size: 1.2em; border: none; border-radius: 6px; cursor: pointer; color: #e0d0c0; font-weight: bold;">8</button>
                    <button class="calc-btn" onclick="calcInput('9')" style="background: #3d2418; padding: 15px; font-size: 1.2em; border: none; border-radius: 6px; cursor: pointer; color: #e0d0c0; font-weight: bold;">9</button>
                    <button class="calc-btn" onclick="calcOperator('*')" style="background: #d4af37; padding: 15px; font-size: 1.5em; border: none; border-radius: 6px; cursor: pointer; color: #2c1810; font-weight: bold;">×</button>
                    
                    <button class="calc-btn" onclick="calcInput('4')" style="background: #3d2418; padding: 15px; font-size: 1.2em; border: none; border-radius: 6px; cursor: pointer; color: #e0d0c0; font-weight: bold;">4</button>
                    <button class="calc-btn" onclick="calcInput('5')" style="background: #3d2418; padding: 15px; font-size: 1.2em; border: none; border-radius: 6px; cursor: pointer; color: #e0d0c0; font-weight: bold;">5</button>
                    <button class="calc-btn" onclick="calcInput('6')" style="background: #3d2418; padding: 15px; font-size: 1.2em; border: none; border-radius: 6px; cursor: pointer; color: #e0d0c0; font-weight: bold;">6</button>
                    <button class="calc-btn" onclick="calcOperator('-')" style="background: #d4af37; padding: 15px; font-size: 1.5em; border: none; border-radius: 6px; cursor: pointer; color: #2c1810; font-weight: bold;">-</button>
                    
                    <button class="calc-btn" onclick="calcInput('1')" style="background: #3d2418; padding: 15px; font-size: 1.2em; border: none; border-radius: 6px; cursor: pointer; color: #e0d0c0; font-weight: bold;">1</button>
                    <button class="calc-btn" onclick="calcInput('2')" style="background: #3d2418; padding: 15px; font-size: 1.2em; border: none; border-radius: 6px; cursor: pointer; color: #e0d0c0; font-weight: bold;">2</button>
                    <button class="calc-btn" onclick="calcInput('3')" style="background: #3d2418; padding: 15px; font-size: 1.2em; border: none; border-radius: 6px; cursor: pointer; color: #e0d0c0; font-weight: bold;">3</button>
                    <button class="calc-btn" onclick="calcOperator('+')" style="background: #d4af37; padding: 15px; font-size: 1.5em; border: none; border-radius: 6px; cursor: pointer; color: #2c1810; font-weight: bold;">+</button>
                    
                    <button class="calc-btn" onclick="calcInput('0')" style="background: #3d2418; padding: 15px; font-size: 1.2em; border: none; border-radius: 6px; cursor: pointer; color: #e0d0c0; font-weight: bold;">0</button>
                    <button class="calc-btn" onclick="calcInput('.')" style="background: #3d2418; padding: 15px; font-size: 1.2em; border: none; border-radius: 6px; cursor: pointer; color: #e0d0c0; font-weight: bold;">.</button>
                    <button class="calc-btn" onclick="calcEquals()" style="background: #27ae60; padding: 15px; font-size: 1.2em; border: none; border-radius: 6px; cursor: pointer; color: white; font-weight: bold; grid-column: span 2;">=</button>
                </div>
            </div>
        </div>
    `;
}

function calcInput(num) {
    if (waitingForSecond) {
        displayValue = num;
        waitingForSecond = false;
    } else {
        displayValue = displayValue === '0' ? num : displayValue + num;
    }
    updateDisplay();
}

function calcOperator(op) {
    if (firstOperand !== null && operator !== null && !waitingForSecond) {
        calcEquals();
    }
    firstOperand = parseFloat(displayValue);
    operator = op;
    waitingForSecond = true;
}

function calcEquals() {
    if (operator === null || firstOperand === null) return;
    
    const second = parseFloat(displayValue);
    let result;
    
    switch (operator) {
        case '+': result = firstOperand + second; break;
        case '-': result = firstOperand - second; break;
        case '*': result = firstOperand * second; break;
        case '/': result = second === 0 ? 'Ошибка' : firstOperand / second; break;
        default: return;
    }
    
    displayValue = typeof result === 'number' ? String(Math.round(result * 100000) / 100000) : result;
    firstOperand = null;
    operator = null;
    waitingForSecond = false;
    updateDisplay();
}

function calcClear() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecond = false;
    updateDisplay();
}

function calcClearEntry() {
    displayValue = '0';
    waitingForSecond = false;
    updateDisplay();
}

function calcBackspace() {
    if (displayValue.length === 1 || (displayValue === '0' && !waitingForSecond)) {
        displayValue = '0';
    } else {
        displayValue = displayValue.slice(0, -1);
    }
    waitingForSecond = false;
    updateDisplay();
}

function updateDisplay() {
    const el = document.getElementById('calcDisplay');
    if (el) el.innerText = displayValue;
}

// Автоматический рендер при открытии вкладки
document.addEventListener('DOMContentLoaded', function() {
    const originalOpenTab = window.openTab;
    window.openTab = function(tabId) {
        if (originalOpenTab) originalOpenTab(tabId);
        if (tabId === 'calculator') {
            setTimeout(renderCalculator, 10);
        }
    };
});
