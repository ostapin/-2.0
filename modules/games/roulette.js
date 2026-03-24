// ========== РУЛЕТКА ==========

(function() {
    // Порядок чисел на колесе (европейская рулетка)
    const NUMBERS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    
    // Курсы валют
    const CURRENCY_RATES = {
        copper: 1,
        silver: 100,
        gold: 10000,
        platinum: 1000000,
        amber_sphere: 100000000,
        blood_sphere: 10000000000,
        ice_sphere: 1000000000000,
        fire_sphere: 100000000000000,
        earth_sphere: 10000000000000000,
        water_sphere: 1000000000000000000,
        lightning_sphere: 100000000000000000000,
        colorless_ether: 10000000000000000000000,
        elemental_ether: 100000000000000000000000
    };
    
    const CURRENCY_NAMES = {
        copper: "Медные",
        silver: "Серебряные",
        gold: "Золотые",
        platinum: "Платиновые",
        amber_sphere: "Сфера (янтарная)",
        blood_sphere: "Сфера (Крови)",
        ice_sphere: "Сфера (Льда)",
        fire_sphere: "Сфера (Огня)",
        earth_sphere: "Сфера (Земли)",
        water_sphere: "Сфера (Воды)",
        lightning_sphere: "Сфера (Молнии)",
        colorless_ether: "Кристалл эфира (бесцветный)",
        elemental_ether: "Кристалл эфира (цветной)"
    };
    
    let balance = 1000; // в медных
    let currentBet = 10; // в медных
    let currentCurrency = "copper";
    let spinning = false;
    let lastResults = [];
    let currentBets = {
        numbers: {},
        color: null,
        parity: null
    };
    let currentRotation = 0;
    
    function loadBalance() {
        const saved = localStorage.getItem('rouletteBalance');
        if (saved) balance = parseInt(saved);
    }
    
    function saveBalance() {
        localStorage.setItem('rouletteBalance', balance);
    }
    
    function getNumberColor(num) {
        if (num === 0) return 'green';
        if (RED_NUMBERS.includes(num)) return 'red';
        return 'black';
    }
    
    function formatBalance() {
        let value = balance;
        const rates = Object.entries(CURRENCY_RATES).sort((a,b) => b[1] - a[1]);
        
        for (let [currency, rate] of rates) {
            if (value >= rate && rate > 1) {
                const amount = Math.floor(value / rate);
                const remainder = value % rate;
                if (remainder === 0) {
                    return `${amount} ${CURRENCY_NAMES[currency]}`;
                } else {
                    const remainderFormatted = formatBalanceSmall(remainder);
                    return `${amount} ${CURRENCY_NAMES[currency]}, ${remainderFormatted}`;
                }
            }
        }
        return `${value} ${CURRENCY_NAMES.copper}`;
    }
    
    function formatBalanceSmall(value) {
        if (value === 0) return '';
        if (value < 100) return `${value} ${CURRENCY_NAMES.copper}`;
        if (value < 10000) {
            const silver = Math.floor(value / 100);
            const copper = value % 100;
            if (copper === 0) return `${silver} ${CURRENCY_NAMES.silver}`;
            return `${silver} ${CURRENCY_NAMES.silver}, ${copper} ${CURRENCY_NAMES.copper}`;
        }
        return `${value} ${CURRENCY_NAMES.copper}`;
    }
    
    function formatBet(amount) {
        if (amount < 100) return `${amount} медных`;
        if (amount < 10000) return `${Math.floor(amount / 100)} серебряных`;
        if (amount < 1000000) return `${Math.floor(amount / 10000)} золотых`;
        return `${Math.floor(amount / 1000000)} платиновых`;
    }
    
    window.renderRoulette = function() {
        const container = document.getElementById('activeGameContainer');
        if (!container) return;
        
        loadBalance();
        
        container.innerHTML = `
            <div style="text-align: center; max-width: 900px; margin: 0 auto;">
                <h3 style="color: #d4af37; margin-bottom: 15px; font-size: 1.8em;">🎰 РУЛЕТКА</h3>
                
                <!-- Верхняя панель с балансом и валютой -->
                <div style="background: #3d2418; padding: 15px; border-radius: 12px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="color: #e0d0c0;">💰 БАЛАНС:</span>
                            <span id="rouletteBalance" style="color: #d4af37; font-size: 1.3em; font-weight: bold;">${formatBalance()}</span>
                            <button onclick="window.setBalance()" style="background: #8b4513; border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer;">✏️ Установить</button>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="color: #e0d0c0;">💱 ВАЛЮТА:</span>
                            <select id="currencySelect" onchange="window.changeCurrency()" style="background: #1a0f0b; color: #e0d0c0; border: 2px solid #8b4513; border-radius: 4px; padding: 5px;">
                                <option value="copper" ${currentCurrency === 'copper' ? 'selected' : ''}>Медные</option>
                                <option value="silver" ${currentCurrency === 'silver' ? 'selected' : ''}>Серебряные</option>
                                <option value="gold" ${currentCurrency === 'gold' ? 'selected' : ''}>Золотые</option>
                                <option value="platinum" ${currentCurrency === 'platinum' ? 'selected' : ''}>Платиновые</option>
                                <option value="amber_sphere" ${currentCurrency === 'amber_sphere' ? 'selected' : ''}>Сфера (янтарная)</option>
                                <option value="blood_sphere" ${currentCurrency === 'blood_sphere' ? 'selected' : ''}>Сфера (Крови)</option>
                                <option value="ice_sphere" ${currentCurrency === 'ice_sphere' ? 'selected' : ''}>Сфера (Льда)</option>
                                <option value="fire_sphere" ${currentCurrency === 'fire_sphere' ? 'selected' : ''}>Сфера (Огня)</option>
                                <option value="earth_sphere" ${currentCurrency === 'earth_sphere' ? 'selected' : ''}>Сфера (Земли)</option>
                                <option value="water_sphere" ${currentCurrency === 'water_sphere' ? 'selected' : ''}>Сфера (Воды)</option>
                                <option value="lightning_sphere" ${currentCurrency === 'lightning_sphere' ? 'selected' : ''}>Сфера (Молнии)</option>
                                <option value="colorless_ether" ${currentCurrency === 'colorless_ether' ? 'selected' : ''}>Кристалл эфира (бесцветный)</option>
                                <option value="elemental_ether" ${currentCurrency === 'elemental_ether' ? 'selected' : ''}>Кристалл эфира (цветной)</option>
                            </select>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="color: #e0d0c0;">🎲 СТАВКА:</span>
                            <input type="number" id="betInput" value="${currentBet}" min="1" step="1" style="width: 100px; padding: 5px; background: #1a0f0b; color: #e0d0c0; border: 2px solid #8b4513; border-radius: 4px;">
                            <button onclick="window.updateBet()" style="background: #8b4513; border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Установить</button>
                        </div>
                    </div>
                </div>
                
                <!-- Кнопка крутить сверху -->
                <div style="margin-bottom: 15px;">
                    <button id="spinBtn" onclick="window.spinRoulette()" style="background: #27ae60; color: white; border: none; padding: 15px 50px; border-radius: 12px; font-size: 1.4em; font-weight: bold; cursor: pointer;">🎲 КРУТИТЬ</button>
                </div>
                
                <!-- Колесо -->
                <div style="position: relative; width: 400px; height: 400px; margin: 0 auto 20px;">
                    <canvas id="rouletteCanvas" width="400" height="400" style="width: 400px; height: 400px; border-radius: 50%; box-shadow: 0 0 20px rgba(0,0,0,0.5);"></canvas>
                    <div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 20px solid transparent; border-right: 20px solid transparent; border-top: 40px solid #d4af37; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.5)); z-index: 10;"></div>
                </div>
                
                <!-- Ставки -->
                <div style="background: #2c1810; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="color: #d4af37; margin-bottom: 10px;">🎯 СТАВКИ</h4>
                    <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; margin-bottom: 15px; max-height: 200px; overflow-y: auto; padding: 5px;">
                        ${generateNumberButtons()}
                    </div>
                    <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                        <button onclick="window.placeColorBet('red')" style="background: #c44536; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">🔴 КРАСНОЕ (x2)</button>
                        <button onclick="window.placeColorBet('black')" style="background: #2c2c2c; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">⚫ ЧЕРНОЕ (x2)</button>
                        <button onclick="window.placeParityBet('even')" style="background: #5a3a2a; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">🔢 ЧЕТНОЕ (x2)</button>
                        <button onclick="window.placeParityBet('odd')" style="background: #5a3a2a; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">🔢 НЕЧЕТНОЕ (x2)</button>
                    </div>
                    <div id="betDisplay" style="margin-top: 10px; color: #b89a7a; font-size: 0.9em;"></div>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 20px;">
                    <button onclick="window.clearBets()" style="background: #8b4513; color: white; border: none; padding: 10px 25px; border-radius: 6px; cursor: pointer;">🗑️ ОЧИСТИТЬ СТАВКИ</button>
                </div>
                
                <div id="resultDisplay" style="margin-top: 20px; padding: 15px; background: #3d2418; border-radius: 8px; display: none;"></div>
                
                <div style="margin-top: 20px;">
                    <h4 style="color: #d4af37;">📜 ИСТОРИЯ</h4>
                    <div id="historyDisplay" style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;"></div>
                </div>
                
                <div style="margin-top: 20px;">
                    <button onclick="window.backToMenu()" style="background: #5a3a2a; color: white; border: none; padding: 10px 25px; border-radius: 6px; cursor: pointer;">🏠 ГЛАВНОЕ МЕНЮ</button>
                </div>
            </div>
        `;
        
        drawWheel(currentRotation);
        updateBetDisplay();
        renderHistory();
    };
    
    function drawWheel(rotationAngle) {
        const canvas = document.getElementById('rouletteCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const size = 400;
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size / 2 - 10;
        
        canvas.width = size;
        canvas.height = size;
        
        ctx.clearRect(0, 0, size, size);
        
        const angleStep = (Math.PI * 2) / NUMBERS.length;
        
        for (let i = 0; i < NUMBERS.length; i++) {
            const startAngle = i * angleStep + rotationAngle;
            const endAngle = (i + 1) * angleStep + rotationAngle;
            const number = NUMBERS[i];
            const color = getNumberColor(number);
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            
            ctx.fillStyle = color === 'red' ? '#c44536' : (color === 'black' ? '#2c2c2c' : '#2c5a2c');
            ctx.fill();
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + angleStep / 2);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 12px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText(number.toString(), radius - 22, 0);
            ctx.restore();
        }
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 28, 0, Math.PI * 2);
        ctx.fillStyle = '#d4af37';
        ctx.fill();
        ctx.strokeStyle = '#2c1810';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    function generateNumberButtons() {
        let html = '';
        for (let i = 0; i <= 36; i++) {
            const color = getNumberColor(i);
            const bgColor = color === 'red' ? '#c44536' : (color === 'black' ? '#2c2c2c' : '#2c5a2c');
            const isActive = currentBets.numbers[i] ? '3px solid #d4af37' : 'none';
            html += `
                <button onclick="window.placeNumberBet(${i})" style="background: ${bgColor}; color: white; border: ${isActive}; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: bold;">${i}</button>
            `;
        }
        return html;
    }
    
    window.placeNumberBet = function(num) {
        if (spinning) {
            alert("Сначала дождитесь окончания вращения!");
            return;
        }
        if (balance < currentBet) {
            alert("Недостаточно средств!");
            return;
        }
        
        if (currentBets.numbers[num]) {
            delete currentBets.numbers[num];
        } else {
            currentBets.numbers[num] = (currentBets.numbers[num] || 0) + currentBet;
        }
        updateBetDisplay();
        window.renderRoulette();
    };
    
    window.placeColorBet = function(color) {
        if (spinning) {
            alert("Сначала дождитесь окончания вращения!");
            return;
        }
        if (balance < currentBet) {
            alert("Недостаточно средств!");
            return;
        }
        
        if (currentBets.color === color) {
            currentBets.color = null;
        } else {
            currentBets.color = color;
        }
        updateBetDisplay();
        window.renderRoulette();
    };
    
    window.placeParityBet = function(parity) {
        if (spinning) {
            alert("Сначала дождитесь окончания вращения!");
            return;
        }
        if (balance < currentBet) {
            alert("Недостаточно средств!");
            return;
        }
        
        if (currentBets.parity === parity) {
            currentBets.parity = null;
        } else {
            currentBets.parity = parity;
        }
        updateBetDisplay();
        window.renderRoulette();
    };
    
    window.updateBet = function() {
        const input = document.getElementById('betInput');
        let value = parseInt(input.value);
        if (isNaN(value) || value < 1) value = 1;
        currentBet = value;
        document.getElementById('betInput').value = currentBet;
    };
    
    window.changeCurrency = function() {
        const select = document.getElementById('currencySelect');
        currentCurrency = select.value;
        const rate = CURRENCY_RATES[currentCurrency];
        const displayBet = Math.floor(currentBet / rate);
        const betInput = document.getElementById('betInput');
        if (betInput) betInput.value = displayBet || 1;
        updateBetDisplay();
    };
    
    window.setBalance = function() {
        const newBalance = prompt("Введите новый баланс (в медных монетах):", balance);
        if (newBalance !== null && !isNaN(parseInt(newBalance))) {
            balance = parseInt(newBalance);
            saveBalance();
            const balanceSpan = document.getElementById('rouletteBalance');
            if (balanceSpan) balanceSpan.textContent = formatBalance();
        }
    };
    
    function updateBetDisplay() {
        const display = document.getElementById('betDisplay');
        if (!display) return;
        
        let bets = [];
        if (Object.keys(currentBets.numbers).length > 0) {
            bets.push(`Числа: ${Object.keys(currentBets.numbers).join(', ')}`);
        }
        if (currentBets.color) {
            bets.push(`${currentBets.color === 'red' ? '🔴 Красное' : '⚫ Черное'}`);
        }
        if (currentBets.parity) {
            bets.push(`${currentBets.parity === 'even' ? 'Четное' : 'Нечетное'}`);
        }
        
        let totalBet = 0;
        totalBet += Object.values(currentBets.numbers).reduce((a,b) => a + b, 0);
        if (currentBets.color) totalBet += currentBet;
        if (currentBets.parity) totalBet += currentBet;
        
        if (bets.length === 0) {
            display.innerHTML = '❌ Нет активных ставок';
        } else {
            display.innerHTML = `📌 Ставки: ${bets.join(' | ')} | 💰 Сумма: ${formatBet(totalBet)}`;
        }
    }
    
    window.clearBets = function() {
        if (spinning) {
            alert("Сначала дождитесь окончания вращения!");
            return;
        }
        currentBets = { numbers: {}, color: null, parity: null };
        updateBetDisplay();
        window.renderRoulette();
    };
    
    window.spinRoulette = function() {
        if (spinning) return;
        
        let totalBet = 0;
        totalBet += Object.values(currentBets.numbers).reduce((a,b) => a + b, 0);
        if (currentBets.color) totalBet += currentBet;
        if (currentBets.parity) totalBet += currentBet;
        
        if (totalBet === 0) {
            alert("Сделайте ставку!");
            return;
        }
        
        if (balance < totalBet) {
            alert("Недостаточно средств!");
            return;
        }
        
        spinning = true;
        const spinBtn = document.getElementById('spinBtn');
        if (spinBtn) spinBtn.disabled = true;
        
        balance -= totalBet;
        saveBalance();
        const balanceSpan = document.getElementById('rouletteBalance');
        if (balanceSpan) balanceSpan.textContent = formatBalance();
        
        const resultIndex = Math.floor(Math.random() * NUMBERS.length);
        const resultNumber = NUMBERS[resultIndex];
        
        const angleStep = (Math.PI * 2) / NUMBERS.length;
        const currentPointerAngle = (Math.PI * 2) - (Math.PI / 2);
        
        let resultAngle = resultIndex * angleStep + angleStep / 2;
        let targetRotation = (currentPointerAngle - resultAngle) + (Math.PI * 2) * 12;
        
        targetRotation = targetRotation % (Math.PI * 2);
        
        let startRotation = currentRotation;
        let startTime = null;
        const duration = 4000;
        
        function animateSpin(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(1, elapsed / duration);
            
            const easeOut = 1 - Math.pow(1 - progress, 4);
            
            currentRotation = startRotation + (targetRotation - startRotation) * easeOut;
            drawWheel(currentRotation);
            
            if (progress < 1) {
                requestAnimationFrame(animateSpin);
            } else {
                currentRotation = targetRotation;
                drawWheel(currentRotation);
                processResult(resultNumber, totalBet);
                spinning = false;
                if (spinBtn) spinBtn.disabled = false;
            }
        }
        
        requestAnimationFrame(animateSpin);
    };
    
    function processResult(result, totalBet) {
        let winnings = 0;
        let winDetails = [];
        
        const resultColor = getNumberColor(result);
        const resultParity = result === 0 ? 'zero' : (result % 2 === 0 ? 'even' : 'odd');
        
        for (const [num, bet] of Object.entries(currentBets.numbers)) {
            if (parseInt(num) === result) {
                const win = bet * 35;
                winnings += win;
                winDetails.push(`Число ${num}: +${formatBet(win)}`);
            }
        }
        
        if (currentBets.color && currentBets.color === resultColor && result !== 0) {
            const win = currentBet * 2;
            winnings += win;
            winDetails.push(`${currentBets.color === 'red' ? 'Красное' : 'Черное'}: +${formatBet(win)}`);
        }
        
        if (currentBets.parity && resultParity === currentBets.parity && result !== 0) {
            const win = currentBet * 2;
            winnings += win;
            winDetails.push(`${currentBets.parity === 'even' ? 'Четное' : 'Нечетное'}: +${formatBet(win)}`);
        }
        
        balance += winnings;
        saveBalance();
        
        const resultDisplay = document.getElementById('resultDisplay');
        const balanceSpan = document.getElementById('rouletteBalance');
        if (balanceSpan) balanceSpan.textContent = formatBalance();
        
        if (resultDisplay) {
            const colorDisplay = resultColor === 'red' ? '🔴' : (resultColor === 'black' ? '⚫' : '🟢');
            resultDisplay.style.display = 'block';
            resultDisplay.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 1.5em;">🎲 ВЫПАЛО: <span style="color: ${resultColor === 'red' ? '#c44536' : (resultColor === 'black' ? '#fff' : '#2c5a2c')}">${result} ${colorDisplay}</span></div>
                    ${winDetails.length > 0 ? `<div style="color: #27ae60;">Выигрыш: ${winDetails.join(', ')}</div>` : '<div style="color: #c44536;">Проигрыш</div>'}
                    <div style="color: #d4af37;">Новый баланс: ${formatBalance()}</div>
                </div>
            `;
        }
        
        lastResults.unshift({ num: result, color: resultColor });
        if (lastResults.length > 10) lastResults.pop();
        renderHistory();
        
        currentBets = { numbers: {}, color: null, parity: null };
        updateBetDisplay();
        window.renderRoulette();
    }
    
    function renderHistory() {
        const historyDiv = document.getElementById('historyDisplay');
        if (!historyDiv) return;
        
        if (lastResults.length === 0) {
            historyDiv.innerHTML = '<span style="color: #8b7d6b;">Нет результатов</span>';
            return;
        }
        
        historyDiv.innerHTML = lastResults.map(r => `
            <div style="background: ${r.color === 'red' ? '#c44536' : (r.color === 'black' ? '#2c2c2c' : '#2c5a2c')}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${r.num}</div>
        `).join('');
    }
    
    window.backToMenu = function() {
        const container = document.getElementById('activeGameContainer');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center;">
                    <p style="color: #b89a7a; font-size: 1.2em;">🎮 Выберите игру</p>
                </div>
            `;
        }
        if (typeof renderGamesManager === 'function') {
            renderGamesManager();
        }
    };
    
    loadBalance();
})();
