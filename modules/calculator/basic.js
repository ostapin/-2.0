// ========== КАЛЬКУЛЯТОР ==========

function renderCalculator() {
    const container = document.getElementById('calculatorContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #2c1810; padding: 20px; border-radius: 12px; border: 2px solid #8b4513; z-index: 9999;">
            <div style="background: #1a0f0b; padding: 20px; margin-bottom: 10px; border-radius: 8px; text-align: right;">
                <div id="calcDisplayMain" style="color: #d4af37; font-size: 2em; min-height: 50px;">0</div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
                <button onclick="calcInput('7')" style="background: #3d2418; padding: 15px; border: none; border-radius: 6px; color: white; cursor: pointer;">7</button>
                <button onclick="calcInput('8')" style="background: #3d2418; padding: 15px; border: none; border-radius: 6px; color: white; cursor: pointer;">8</button>
                <button onclick="calcInput('9')" style="background: #3d2418; padding: 15px; border: none; border-radius: 6px; color: white; cursor: pointer;">9</button>
                <button onclick="calcOperator('/')" style="background: #d4af37; padding: 15px; border: none; border-radius: 6px; cursor: pointer;">÷</button>
                
                <button onclick="calcInput('4')" style="background: #3d2418; padding: 15px; border: none; border-radius: 6px; color: white; cursor: pointer;">4</button>
                <button onclick="calcInput('5')" style="background: #3d2418; padding: 15px; border: none; border-radius: 6px; color: white; cursor: pointer;">5</button>
                <button onclick="calcInput('6')" style="background: #3d2418; padding: 15px; border: none; border-radius: 6px; color: white; cursor: pointer;">6</button>
                <button onclick="calcOperator('*')" style="background: #d4af37; padding: 15px; border: none; border-radius: 6px; cursor: pointer;">×</button>
                
                <button onclick="calcInput('1')" style="background: #3d2418; padding: 15px; border: none; border-radius: 6px; color: white; cursor: pointer;">1</button>
                <button onclick="calcInput('2')" style="background: #3d2418; padding: 15px; border: none; border-radius: 6px; color: white; cursor: pointer;">2</button>
                <button onclick="calcInput('3')" style="background: #3d2418; padding: 15px; border: none; border-radius: 6px; color: white; cursor: pointer;">3</button>
                <button onclick="calcOperator('-')" style="background: #d4af37; padding: 15px; border: none; border-radius: 6px; cursor: pointer;">-</button>
                
                <button onclick="calcInput('0')" style="background: #3d2418; padding: 15px; border: none; border-radius: 6px; color: white; cursor: pointer;">0</button>
                <button onclick="calcInput('.')" style="background: #3d2418; padding: 15px; border: none; border-radius: 6px; color: white; cursor: pointer;">.</button>
                <button onclick="calcEquals()" style="background: #27ae60; padding: 15px; border: none; border-radius: 6px; color: white; cursor: pointer;">=</button>
                <button onclick="calcOperator('+')" style="background: #d4af37; padding: 15px; border: none; border-radius: 6px; cursor: pointer;">+</button>
                
                <button onclick="calcClear()" style="background: #c44536; padding: 15px; border: none; border-radius: 6px; color: white; cursor: pointer; grid-column: span 4;">C</button>
            </div>
        </div>
    `;
}

let calcExpression = '';

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
    if (['+', '-', '*', '/'].includes(lastChar)) {
        display.innerText = display.innerText.slice(0, -1) + op;
    } else {
        display.innerText += op;
    }
}

function calcEquals() {
    const display = document.getElementById('calcDisplayMain');
    if (!display) return;
    
    try {
        let expr = display.innerText.replace(/×/g, '*').replace(/÷/g, '/');
        const result = eval(expr);
        display.innerText = result;
    } catch(e) {
        display.innerText = 'Ошибка';
    }
}

function calcClear() {
    const display = document.getElementById('calcDisplayMain');
    if (display) display.innerText = '0';
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
