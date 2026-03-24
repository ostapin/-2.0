// ========== РУЛЕТКА ==========

(function() {
    // Порядок чисел на европейской рулетке
    const NUMBERS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    
    // Курсы валют (полные)
    const CURRENCY_RATES = {
        chips: 1,
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
        chips: "Фишки",
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
    
    let balance = 1000;
    let currentBet = 10;
    let currentCurrency = "chips";
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
        if (currentCurrency === 'chips') {
            return `${balance} ${CURRENCY_NAMES.chips}`;
        }
        
        let value = balance;
        const rates = Object.entries(CURRENCY_RATES).sort((a,b) => b[1] - a[1]);
        
        for (let [currency, rate] of rates) {
            if (value >= rate && rate > 1 && currency !== 'chips') {
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
        if (currentCurrency === 'chips') {
            return `${amount} фишек`;
        }
        if (amount < 100) return `${amount} медных`;
        if (amount < 10000) return `${Math.floor(amount / 100)} серебряных`;
        if (amount < 1000000) return `${Math.floor(amount / 10000)} золотых`;
        return `${Math.floor(amount / 1000000)} платиновых`;
    }
    
    // Отрисовка колеса с ограничителями
    function drawWheel(rotationAngle) {
        const canvas = document.getElementById('rouletteCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const size = 420;
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size / 2 - 15;
        const pocketRadius = radius - 10;
        
        canvas.width = size;
        canvas.height = size;
        ctx.clearRect(0, 0, size, size);
        
        const angleStep = (Math.PI * 2) / NUMBERS.length;
        
        // Рисуем карманы
        for (let i = 0; i < NUMBERS.length; i++) {
            const startAngle = i * angleStep + rotationAngle;
            const endAngle = (i + 1) * angleStep + rotationAngle;
            const number = NUMBERS[i];
            const color = getNumberColor(number);
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, pocketRadius, startAngle, endAngle);
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
            ctx.font = 'bold 11px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText(number.toString(), pocketRadius - 20, 0);
            ctx.restore();
        }
        
        // Ограничители (штырьки) между карманами
        for (let i = 0; i < NUMBERS.length; i++) {
            const pinAngle = i * angleStep + angleStep / 2 + rotationAngle;
            const pinX = centerX + (radius - 6) * Math.cos(pinAngle);
            const pinY = centerY + (radius - 6) * Math.sin(pinAngle);
            
            ctx.beginPath();
            ctx.arc(pinX, pinY, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#b89a7a';
            ctx.fill();
            ctx.fillStyle = '#5a3a2a';
            ctx.beginPath();
            ctx.arc(pinX - 1, pinY - 1, 1, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Центр
        ctx.beginPath();
        ctx.arc(centerX, centerY, 28, 0, Math.PI * 2);
        ctx.fillStyle = '#d4af37';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX, centerY, 18, 0, Math.PI * 2);
        ctx.fillStyle = '#2c1810';
        ctx.fill();
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
        updateBetDisplay();
        window.renderRoulette();
    };
    
    window.setBalance = function() {
        const newBalance = prompt(`Введите новый баланс (в ${CURRENCY_NAMES[currentCurrency]}):`, balance);
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
    
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
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
        const pointerAngle = Math.PI / 2;
        
        const targetSegmentAngle = resultIndex * angleStep + angleStep / 2;
        let targetRotation = (pointerAngle - targetSegmentAngle) % (Math.PI * 2);
        if (targetRotation < 0) targetRotation += Math.PI * 2;
        
        const fullSpins = 8 + Math.floor(Math.random() * 5);
        const totalDelta = targetRotation + (Math.PI * 2 * fullSpins);
        
        const startRotation = currentRotation;
        const startTime = performance.now();
        const duration = 4000;
        
        function animateSpin(now) {
            const elapsed = now - startTime;
            let progress = Math.min(1, elapsed / duration);
            const easedProgress = easeOutCubic(progress);
            
            currentRotation = startRotation + totalDelta * easedProgress;
            drawWheel(currentRotation % (Math.PI * 2));
            
            if (progress < 1) {
                requestAnimationFrame(animateSpin);
            } else {
                currentRotation = (startRotation + totalDelta) % (Math.PI * 2);
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
        const colorName = resultColor === 'red' ? 'КРАСНОЕ' : (resultColor === 'black' ? 'ЧЕРНОЕ' : 'ЗЕРО');
        const colorIcon = resultColor === 'red' ? '🔴' : (resultColor === 'black' ? '⚫' : '🟢');
        
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
        
        const netChange = winnings - totalBet;
        const netChangeText = netChange >= 0 ? `+${formatBet(netChange)}` : formatBet(netChange);
        
        const resultDisplay = document.getElementById('resultDisplay');
        const balanceSpan = document.getElementById('rouletteBalance');
        if (balanceSpan) balanceSpan.textContent = formatBalance();
        
        if (resultDisplay) {
            resultDisplay.style.display = 'block';
            resultDisplay.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 2em; margin-bottom: 15px;">
                        🎲 <span style="color: ${resultColor === 'red' ? '#c44536' : (resultColor === 'black' ? '#fff' : '#2c5a2c')}; font-weight: bold;">${result}</span> ${colorIcon}
                    </div>
                    <div style="font-size: 1.2em; margin-bottom: 15px; color: #d4af37;">${colorName}</div>
                    ${winDetails.length > 0 ? `<div style="color: #27ae60; margin: 10px 0;">🏆 ВЫИГРЫШ: ${winDetails.join(', ')}</div>` : '<div style="color: #c44536; margin: 10px 0;">💔 ПРОИГРЫШ</div>'}
                    <div style="border-top: 1px solid #8b4513; padding-top: 12px; margin-top: 12px;">
                        <div>💰 СТАВКА: ${formatBet(totalBet)}</div>
                        <div>🎁 ВЫИГРЫШ: ${formatBet(winnings)}</div>
                        <div style="color: ${netChange >= 0 ? '#27ae60' : '#c44536'};">📊 ИТОГ: ${netChangeText}</div>
                        <div style="color: #d4af37;">💎 БАЛАНС: ${formatBalance()}</div>
                    </div>
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
            <div style="background: ${r.color === 'red' ? '#c44536' : (r.color === 'black' ? '#2c2c2c' : '#2c5a2c')}; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${r.num}</div>
        `).join('');
    }
    
    window.renderRoulette = function() {
        const container = document.getElementById('activeGameContainer');
        if (!container) return;
        
        loadBalance();
        
        container.innerHTML = `
            <div style="text-align: center; max-width: 950px; margin: 0 auto;">
                <h3 style="color: #d4af37; margin-bottom: 15px; font-size: 1.8em;">🎰 РУЛЕТКА</h3>
                
                <div style="background: #3d2418; padding: 15px; border-radius: 12px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="color: #e0d0c0;">💰 БАЛАНС:</span>
                            <span id="rouletteBalance" style="color: #d4af37; font-size: 1.3em; font-weight: bold;">${formatBalance()}</span>
                            <button onclick="window.setBalance()" style="background: #8b4513; border: none; color: white; padding: 5px 12px; border-radius: 4px; cursor: pointer;">✏️</button>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="color: #e0d0c0;">💱 ВАЛЮТА:</span>
                            <select id="currencySelect" onchange="window.changeCurrency()" style="background: #1a0f0b; color: #e0d0c0; border: 2px solid #8b4513; border-radius: 4px; padding: 5px;">
                                <option value="chips" ${currentCurrency === 'chips' ? 'selected' : ''}>🎲 Фишки</option>
                                <option value="copper" ${currentCurrency === 'copper' ? 'selected' : ''}>🟤 Медные</option>
                                <option value="silver" ${currentCurrency === 'silver' ? 'selected' : ''}>⚪ Серебряные</option>
                                <option value="gold" ${currentCurrency === 'gold' ? 'selected' : ''}>🟡 Золотые</option>
                                <option value="platinum" ${currentCurrency === 'platinum' ? 'selected' : ''}>🔵 Платиновые</option>
                                <option value="amber_sphere" ${currentCurrency === 'amber_sphere' ? 'selected' : ''}>🟠 Сфера (янтарная)</option>
                                <option value="blood_sphere" ${currentCurrency === 'blood_sphere' ? 'selected' : ''}>🔴 Сфера (Крови)</option>
                                <option value="ice_sphere" ${currentCurrency === 'ice_sphere' ? 'selected' : ''}>🔵 Сфера (Льда)</option>
                                <option value="fire_sphere" ${currentCurrency === 'fire_sphere' ? 'selected' : ''}>🔥 Сфера (Огня)</option>
                                <option value="earth_sphere" ${currentCurrency === 'earth_sphere' ? 'selected' : ''}>⛰️ Сфера (Земли)</option>
                                <option value="water_sphere" ${currentCurrency === 'water_sphere' ? 'selected' : ''}>💧 Сфера (Воды)</option>
                                <option value="lightning_sphere" ${currentCurrency === 'lightning_sphere' ? 'selected' : ''}>⚡ Сфера (Молнии)</option>
                                <option value="colorless_ether" ${currentCurrency === 'colorless_ether' ? 'selected' : ''}>💎 Кристалл эфира (бесцветный)</option>
                                <option value="elemental_ether" ${currentCurrency === 'elemental_ether' ? 'selected' : ''}>🌈 Кристалл эфира (цветной)</option>
                            </select>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="color: #e0d0c0;">🎲 СТАВКА:</span>
                            <input type="number" id="betInput" value="${currentBet}" min="1" step="1" style="width: 90px; padding: 5px; background: #1a0f0b; color: #e0d0c0; border: 2px solid #8b4513; border-radius: 4px;">
                            <button onclick="window.updateBet()" style="background: #8b4513; border: none; color: white; padding: 5px 12px; border-radius: 4px; cursor: pointer;">Уст.</button>
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <button id="spinBtn" onclick="window.spinRoulette()" style="background: #27ae60; color: white; border: none; padding: 15px 60px; border-radius: 12px; font-size: 1.4em; font-weight: bold; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">🎲 КРУТИТЬ</button>
                </div>
                
                <div style="position: relative; width: 420px; height: 420px; margin: 0 auto 20px;">
                    <canvas id="rouletteCanvas" width="420" height="420" style="width: 420px; height: 420px; border-radius: 50%; box-shadow: 0 0 20px rgba(0,0,0,0.5);"></canvas>
                    <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 20px solid transparent; border-right: 20px solid transparent; border-top: 40px solid #d4af37; z-index: 10;"></div>
                </div>
                
                <div style="background: #2c1810; padding: 15px; border-radius: 12px; margin-bottom: 20px;">
                    <h4 style="color: #d4af37; margin-bottom: 10px;">🎯 СТАВКИ</h4>
                    <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; margin-bottom: 15px; max-height: 180px; overflow-y: auto; padding: 5px;">
                        ${generateNumberButtons()}
                    </div>
                    <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                        <button onclick="window.placeColorBet('red')" style="background: #c44536; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">🔴 КРАСНОЕ (x2)</button>
                        <button onclick="window.placeColorBet('black')" style="background: #2c2c2c; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">⚫ ЧЕРНОЕ (x2)</button>
                        <button onclick="window.placeParityBet('even')" style="background: #5a3a2a; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">🔢 ЧЕТНОЕ (x2)</button>
                        <button onclick="window.placeParityBet('odd')" style="background: #5a3a2a; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">🔢 НЕЧЕТНОЕ (x2)</button>
                    </div>
                    <div id="betDisplay" style="margin-top: 12px; color: #b89a7a;"></div>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 20px;">
                    <button onclick="window.clearBets()" style="background: #8b4513; color: white; border: none; padding: 10px 30px; border-radius: 6px; cursor: pointer;">🗑️ ОЧИСТИТЬ СТАВКИ</button>
                </div>
                
                <div id="resultDisplay" style="margin-top: 20px; padding: 15px; background: #1a0f0b; border-radius: 12px; display: none; border: 1px solid #d4af37;"></div>
                
                <div style="margin-top: 20px;">
                    <h4 style="color: #d4af37;">📜 ИСТОРИЯ ПОСЛЕДНИХ 10 СПИНОВ</h4>
                    <div id="historyDisplay" style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 10px;"></div>
                </div>
                
                <div style="margin-top: 20px;">
                    <button onclick="window.backToMenu()" style="background: #5a3a2a; color: white; border: none; padding: 10px 30px; border-radius: 6px; cursor: pointer;">🏠 ГЛАВНОЕ МЕНЮ</button>
                </div>
            </div>
        `;
        
        drawWheel(currentRotation);
        updateBetDisplay();
        renderHistory();
    };
    
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
