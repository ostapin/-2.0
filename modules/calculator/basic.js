// ========== ИНЖЕНЕРНЫЙ КАЛЬКУЛЯТОР ==========

let displayValue = '0';
let memory = 0;
let lastResult = 0;

function renderCalculator() {
    const container = document.getElementById('calculatorContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div style="max-width: 500px; margin: 20px auto; background: #2c1810; border-radius: 12px; padding: 20px; border: 2px solid #8b4513;">
            <div style="background: #1a0f0b; padding: 20px; margin-bottom: 15px; border-radius: 8px; text-align: right;">
                <div id="calcDisplayMain" style="color: #d4af37; font-size: 2.5em; font-family: monospace; min-height: 70px; word-break: break-all;">0</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px;">
                <!-- 1 ряд -->
                <button onclick="calcMemoryRecall()" style="background: #5a3a2a; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">MR</button>
                <button onclick="calcMemoryClear()" style="background: #5a3a2a; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">MC</button>
                <button onclick="calcMemoryAdd()" style="background: #5a3a2a; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">M+</button>
                <button onclick="calcMemorySubtract()" style="background: #5a3a2a; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">M-</button>
                <button onclick="calcClear()" style="background: #c44536; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">C</button>
                
                <!-- 2 ряд -->
                <button onclick="calcInput('%')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">%</button>
                <button onclick="calcSqrt()" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">√</button>
                <button onclick="calcSquare()" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">x²</button>
                <button onclick="calcReciprocal()" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">1/x</button>
                <button onclick="calcBackspace()" style="background: #8b4513; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">⌫</button>
                
                <!-- 3 ряд -->
                <button onclick="calcInput('7')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">7</button>
                <button onclick="calcInput('8')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">8</button>
                <button onclick="calcInput('9')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">9</button>
                <button onclick="calcOperator('/')" style="background: #d4af37; padding: 12px; border: none; border-radius: 6px; cursor: pointer;">÷</button>
                <button onclick="calcClearEntry()" style="background: #8b4513; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">CE</button>
                
                <!-- 4 ряд -->
                <button onclick="calcInput('4')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">4</button>
                <button onclick="calcInput('5')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">5</button>
                <button onclick="calcInput('6')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">6</button>
                <button onclick="calcOperator('*')" style="background: #d4af37; padding: 12px; border: none; border-radius: 6px; cursor: pointer;">×</button>
                <button onclick="calcToggleSign()" style="background: #8b4513; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">±</button>
                
                <!-- 5 ряд -->
                <button onclick="calcInput('1')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">1</button>
                <button onclick="calcInput('2')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">2</button>
                <button onclick="calcInput('3')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">3</button>
                <button onclick="calcOperator('-')" style="background: #d4af37; padding: 12px; border: none; border-radius: 6px; cursor: pointer;">-</button>
                <button rowspan="2" onclick="calcEquals()" style="background: #27ae60; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">=</button>
                
                <!-- 6 ряд -->
                <button onclick="calcInput('0')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">0</button>
                <button onclick="calcInput('00')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">00</button>
                <button onclick="calcInput('.')" style="background: #3d2418; padding: 12px; border: none; border-radius: 6px; color: white; cursor: pointer;">.</button>
                <button onclick="calcOperator('+')" style="background: #d4af37; padding: 12px; border: none; border-radius: 6px; cursor: pointer;">+</button>
            </div>
        </div>
    `;
}

function calcInput(value) {
    const display = document.getElementById('calcDisplayMain');
    if (!display) return;
    
    if (display.innerText === '0' || display.innerText === 'Ошибка') {
        display.innerText = value;
    } else {
        display.innerText += value;
    }
}

function calcOperator(op) {
    const display = document.getElementById('calcDisplayMain');
    if (!display) return;
    
    const lastChar = display.innerText.slice(-1);
    if (['+', '-', '*', '/', '%'].includes(lastChar)) {
        display.innerText = display.innerText.slice(0, -1) + op;
    } else {
        display.innerText += op;
    }
}

function calcEquals() {
    const display = document.getElementById('calcDisplayMain');
    if (!display) return;
    
    try {
        let expr = display.innerText.replace(/×/g, '*').replace(/÷/g, '/').replace(/%/g, '/100');
        const result = eval(expr);
        lastResult = result;
        display.innerText = String(Math.round(result * 1000000) / 1000000);
    } catch(e) {
        display.innerText = 'Ошибка';
    }
}

function calcClear() {
    const display = document.getElementById('calcDisplayMain');
    if (display) display.innerText = '0';
}

function calcClearEntry() {
    const display = document.getElementById('calcDisplayMain');
    if (display) display.innerText = '0';
}

function calcBackspace() {
    const display = document.getElementById('calcDisplayMain');
    if (!display) return;
    
    if (display.innerText.length === 1 || display.innerText === 'Ошибка') {
        display.innerText = '0';
    } else {
        display.innerText = display.innerText.slice(0, -1);
    }
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
    display.innerText = String(num * num);
}

function calcSqrt() {
    const display = document.getElementById('calcDisplayMain');
    if (!display || display.innerText === 'Ошибка') return;
    
    const num = parseFloat(display.innerText);
    if (num < 0) {
        display.innerText = 'Ошибка';
    } else {
        display.innerText = String(Math.sqrt(num));
    }
}

function calcReciprocal() {
    const display = document.getElementById('calcDisplayMain');
    if (!display || display.innerText === 'Ошибка') return;
    
    const num = parseFloat(display.innerText);
    if (num === 0) {
        display.innerText = 'Ошибка';
    } else {
        display.innerText = String(1 / num);
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
