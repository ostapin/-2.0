// ========== ОБЫЧНЫЙ КАЛЬКУЛЯТОР ==========

let displayValue = '0';
let memory = 0;
let history = [];
let currentExpression = '';

function renderCalculator() {
    const container = document.getElementById('calculatorContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div style="max-width: 500px; margin: 0 auto;">
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
                <div id="historyList" style="max-height: 300px; overflow-y: auto;"><p style="color: #8b7d6b; text-align: center;">История пуста</p></div>
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
    if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
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
