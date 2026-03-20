<div id="calculator-tab" class="tab-content">
    <h2 style="color: #d4af37; text-align: center; margin-bottom: 25px;">🧮 КАЛЬКУЛЯТОР</h2>
    
    <div style="background: #3d2418; padding: 20px; border-radius: 8px; max-width: 300px; margin: 0 auto;">
        <input type="text" id="calculatorDisplay" class="calculator-display" readonly style="width: 100%; padding: 15px; font-size: 1.5em; text-align: right; background: #1a0f0b; color: #e0d0c0; border: 2px solid #8b4513; border-radius: 4px; margin-bottom: 15px;">
        
        <div class="calculator-buttons" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
            <button class="btn btn-roll" onclick="calculatorNumber('7')">7</button>
            <button class="btn btn-roll" onclick="calculatorNumber('8')">8</button>
            <button class="btn btn-roll" onclick="calculatorNumber('9')">9</button>
            <button class="btn btn-minus" onclick="calculatorOperatorClick('/')">÷</button>
            
            <button class="btn btn-roll" onclick="calculatorNumber('4')">4</button>
            <button class="btn btn-roll" onclick="calculatorNumber('5')">5</button>
            <button class="btn btn-roll" onclick="calculatorNumber('6')">6</button>
            <button class="btn btn-minus" onclick="calculatorOperatorClick('*')">×</button>
            
            <button class="btn btn-roll" onclick="calculatorNumber('1')">1</button>
            <button class="btn btn-roll" onclick="calculatorNumber('2')">2</button>
            <button class="btn btn-roll" onclick="calculatorNumber('3')">3</button>
            <button class="btn btn-minus" onclick="calculatorOperatorClick('-')">-</button>
            
            <button class="btn btn-roll" onclick="calculatorNumber('0')">0</button>
            <button class="btn btn-roll" onclick="calculatorNumber('.')">.</button>
            <button class="btn btn-roll" onclick="calculatorCalculate()">=</button>
            <button class="btn btn-plus" onclick="calculatorOperatorClick('+')">+</button>
            
            <button class="btn btn-roll" onclick="calculatorClear()" style="grid-column: span 4; background: #8b4513;">C</button>
        </div>
    </div>
</div>
