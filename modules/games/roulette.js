// ========== РУЛЕТКА ==========

(function() {
    const NUMBERS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    
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
    let lastResultDetail = null;
    let currentBets = {
        numbers: {},
        color: null,
        parity: null
    };
    let currentRotation = 0;
    let canvas = null;
    let ctx = null;
    
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
        if (currentCurrency === 'chips') return `${balance} ${CURRENCY_NAMES.chips}`;
        let value = balance;
        if (value < 100) return `${value} ${CURRENCY_NAMES.copper}`;
        if (value < 10000) return `${Math.floor(value / 100)} ${CURRENCY_NAMES.silver}`;
        if (value < 1000000) return `${Math.floor(value / 10000)} ${CURRENCY_NAMES.gold}`;
        if (value < 100000000) return `${Math.floor(value / 1000000)} ${CURRENCY_NAMES.platinum}`;
        return `${balance} ${CURRENCY_NAMES.copper}`;
    }
    
    function formatBet(amount) {
        if (currentCurrency === 'chips') return `${amount} фишек`;
        if (amount < 100) return `${amount} медных`;
        if (amount < 10000) return `${Math.floor(amount / 100)} серебряных`;
        if (amount < 1000000) return `${Math.floor(amount / 10000)} золотых`;
        return `${Math.floor(amount / 1000000)} платиновых`;
    }
    
    function initCanvas() {
        canvas = document.getElementById('rouletteCanvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        drawWheel(0);
    }
    
    function drawWheel(rotationAngle) {
        if (!canvas || !ctx) return;
        
        const size = 420;
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size / 2 - 15;
        const pocketRadius = radius - 10;
        
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
        
        for (let i = 0; i < NUMBERS.length; i++) {
            const pinAngle = i * angleStep + angleStep / 2 + rotationAngle;
            const pinX = centerX + (radius - 6) * Math.cos(pinAngle);
            const pinY = centerY + (radius - 6) * Math.sin(pinAngle);
            
            ctx.beginPath();
            ctx.arc(pinX, pinY, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#b89a7a';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(pinX - 1, pinY - 1, 1, 0, Math.PI * 2);
            ctx.fillStyle = '#e0d0c0';
            ctx.fill();
        }
        
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
            const isActive = currentBets.numbers[i];
            const betAmount = isActive || 0;
            
            html += `
                <button onclick="window.placeNumberBet(${i})" style="
                    background: ${bgColor};
                    color: white;
                    border: ${isActive ? '3px solid #d4af37' : '1px solid #8b4513'};
                    padding: 8px 0;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 1em;
                    min-width: 44px;
                    height: 52px;
                    transition: all 0.1s;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                ">
                    <span>${i}</span>
                    ${betAmount > 0 ? `<span style="font-size: 0.65em; color: #d4af37; margin-top: 2px;">${betAmount}</span>` : '<span style="font-size: 0.65em; visibility: hidden;">.</span>'}
                </button>
            `;
        }
        return html;
    }
    
    window.placeNumberBet = function(num) {
        if (spinning) { alert("Дождитесь окончания вращения!"); return; }
        if (balance < currentBet) { alert("Недостаточно средств!"); return; }
        
        if (currentBets.numbers[num]) {
            delete currentBets.numbers[num];
        } else {
            currentBets.numbers[num] = (currentBets.numbers[num] || 0) + currentBet;
        }
        updateBetDisplay();
        window.renderRoulette();
    };
    
    window.placeColorBet = function(color) {
        if (spinning) { alert("Дождитесь окончания вращения!"); return; }
        if (balance < currentBet) { alert("Недостаточно средств!"); return; }
        
        if (currentBets.color === color) {
            currentBets.color = null;
        } else {
            currentBets.color = color;
        }
        updateBetDisplay();
        window.renderRoulette();
    };
    
    window.placeParityBet = function(parity) {
        if (spinning) { alert("Дождитесь окончания вращения!"); return; }
        if (balance < currentBet) { alert("Недостаточно средств!"); return; }
        
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
        window.renderRoulette();
    };
    
    window.setBalance = function() {
        const newBalance = prompt(`Введите новый баланс (в ${CURRENCY_NAMES[currentCurrency]}):`, balance);
        if (newBalance !== null && !isNaN(parseInt(newBalance))) {
            balance = parseInt(newBalance);
            saveBalance();
            window.renderRoulette();
        }
    };
    
    function updateBetDisplay() {
        const display = document.getElementById('betDisplay');
        if (!display) return;
        
        let bets = [];
        if (Object.keys(currentBets.numbers).length > 0) bets.push(`Числа: ${Object.keys(currentBets.numbers).join(', ')}`);
        if (currentBets.color) bets.push(`${currentBets.color === 'red' ? '🔴 Красное' : '⚫ Черное'}`);
        if (currentBets.parity) bets.push(`${currentBets.parity === 'even' ? 'Четное' : 'Нечетное'}`);
        
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
        if (spinning) { alert("Дождитесь окончания вращения!"); return; }
        currentBets = { numbers: {}, color: null, parity: null };
        updateBetDisplay();
        window.renderRoulette();
    };
    
    // Функция для плавного вращения с CSS-анимацией (без рывков)
    window.spinRoulette = function() {
        if (spinning) return;
        
        let totalBet = 0;
        totalBet += Object.values(currentBets.numbers).reduce((a,b) => a + b, 0);
        if (currentBets.color) totalBet += currentBet;
        if (currentBets.parity) totalBet += currentBet;
        
        if (totalBet === 0) { alert("Сделайте ставку!"); return; }
        if (balance < totalBet) { alert("Недостаточно средств!"); return; }
        
        spinning = true;
        const spinBtn = document.getElementById('spinBtn');
        if (spinBtn) spinBtn.disabled = true;
        
        balance -= totalBet;
        saveBalance();
        
        // Выбираем случайный выигрышный номер
        const resultNumber = Math.floor(Math.random() * 37);
        
        const angleStep = 360 / NUMBERS.length;
        const resultIndex = NUMBERS.indexOf(resultNumber);
        
        // Базовое количество оборотов (от 8 до 12)
        const baseRotations = 8 + Math.floor(Math.random() * 5);
        
        // Вычисляем финальный угол: база * 360 + смещение до нужного сектора
        // Сектор 0 (число 0) находится на угле 0
        // Чтобы стрелка (вверху, 12 часов) указывала на нужный сектор,
        // нужно повернуть колесо так, чтобы центр сектора оказался под стрелкой
        const sectorCenterAngle = resultIndex * angleStep + angleStep / 2;
        // Стрелка на 12 часах = 90 градусов
        // Нужный угол поворота = (стрелка - центр сектора) + обороты*360
        let finalAngle = (90 - sectorCenterAngle) + (baseRotations * 360);
        finalAngle = finalAngle % 360;
        
        // Сохраняем текущий угол как начальный
        const startAngle = currentRotation;
        const totalDelta = finalAngle - startAngle;
        
        // Используем requestAnimationFrame с ease-out функцией для плавного замедления
        const startTime = performance.now();
        const duration = 4000;
        
        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }
        
        function animateSpin(now) {
            const elapsed = now - startTime;
            let progress = Math.min(1, elapsed / duration);
            const eased = easeOutCubic(progress);
            
            currentRotation = startAngle + totalDelta * eased;
            drawWheel(currentRotation * Math.PI / 180);
            
            if (progress < 1) {
                requestAnimationFrame(animateSpin);
            } else {
                // Фиксируем точный финальный угол
                currentRotation = finalAngle;
                drawWheel(currentRotation * Math.PI / 180);
                
                // Определяем выигрышное число по реальному положению колеса
                // Вычисляем, какой сектор сейчас под стрелкой
                let pointerAngle = 90; // стрелка на 12 часов
                let wheelAngle = currentRotation % 360;
                let angleFromPointer = (pointerAngle - wheelAngle + 360) % 360;
                let sectorIndex = Math.floor(angleFromPointer / angleStep);
                if (sectorIndex >= NUMBERS.length) sectorIndex = 0;
                const finalNumber = NUMBERS[sectorIndex];
                
                processResult(finalNumber, totalBet);
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
        
        lastResultDetail = {
            result,
            resultColor,
            colorName,
            colorIcon,
            totalBet,
            winnings,
            winDetails,
            netChange
        };
        
        lastResults.unshift({ num: result, color: resultColor });
        if (lastResults.length > 10) lastResults.pop();
        
        currentBets = { numbers: {}, color: null, parity: null };
        updateBetDisplay();
        window.renderRoulette();
    }
    
    function renderLastResult() {
        if (!lastResultDetail) return '';
        
        const r = lastResultDetail;
        const netChangeText = r.netChange >= 0 ? `+${formatBet(r.netChange)}` : formatBet(r.netChange);
        
        return `
            <div style="background: #2c1810; border: 2px solid #d4af37; border-radius: 12px; padding: 15px; margin-bottom: 20px;">
                <h4 style="color: #d4af37; margin-bottom: 10px; text-align: center;">🎲 ПОСЛЕДНИЙ РЕЗУЛЬТАТ</h4>
                <div style="text-align: center;">
                    <div style="font-size: 2em; margin-bottom: 8px;">
                        <span style="color: ${r.resultColor === 'red' ? '#c44536' : (r.resultColor === 'black' ? '#fff' : '#2c5a2c')}; font-weight: bold;">${r.result}</span> ${r.colorIcon}
                    </div>
                    <div style="font-size: 1em; margin-bottom: 10px; color: #e0d0c0;">${r.colorName}</div>
                    ${r.winDetails.length > 0 ? `<div style="color: #27ae60; font-size: 0.9em;">${r.winDetails.join('<br>')}</div>` : '<div style="color: #c44536;">ПРОИГРЫШ</div>'}
                    <div style="border-top: 1px solid #8b4513; padding-top: 8px; margin-top: 8px; font-size: 0.85em;">
                        <div>💰 Ставка: ${formatBet(r.totalBet)}</div>
                        <div>🎁 Выигрыш: ${formatBet(r.winnings)}</div>
                        <div style="color: ${r.netChange >= 0 ? '#27ae60' : '#c44536'};">📊 Итог: ${netChangeText}</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    function renderHistory() {
        if (lastResults.length === 0) return '<span style="color: #8b7d6b;">Нет результатов</span>';
        
        return lastResults.map(r => `
            <div style="background: ${r.color === 'red' ? '#c44536' : (r.color === 'black' ? '#2c2c2c' : '#2c5a2c')}; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${r.num}</div>
        `).join('');
    }
    
    window.renderRoulette = function() {
        const container = document.getElementById('activeGameContainer');
        if (!container) return;
        
        loadBalance();
        
        container.innerHTML = `
            <div style="display: flex; gap: 20px; max-width: 1200px; margin: 0 auto; flex-wrap: wrap;">
                <div style="flex: 2; min-width: 450px;">
                    <h3 style="color: #d4af37; margin-bottom: 15px; text-align: center;">🎰 РУЛЕТКА</h3>
                    
                    <div style="background: #3d2418; padding: 12px; border-radius: 12px; margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                            <div><span style="color: #e0d0c0;">💰 БАЛАНС:</span> <span id="rouletteBalance" style="color: #d4af37; font-size: 1.2em; font-weight: bold;">${formatBalance()}</span> <button onclick="window.setBalance()" style="background: #8b4513; border: none; color: white; padding: 3px 8px; border-radius: 4px; cursor: pointer;">✏️</button></div>
                            <div><span style="color: #e0d0c0;">💱 ВАЛЮТА:</span> <select id="currencySelect" onchange="window.changeCurrency()" style="background: #1a0f0b; color: #e0d0c0; border: 2px solid #8b4513; border-radius: 4px; padding: 5px;">
                                <option value="chips" ${currentCurrency === 'chips' ? 'selected' : ''}>🎲 Фишки</option>
                                <option value="copper" ${currentCurrency === 'copper' ? 'selected' : ''}>🟤 Медные</option>
                                <option value="silver" ${currentCurrency === 'silver' ? 'selected' : ''}>⚪ Серебряные</option>
                                <option value="gold" ${currentCurrency === 'gold' ? 'selected' : ''}>🟡 Золотые</option>
                                <option value="platinum" ${currentCurrency === 'platinum' ? 'selected' : ''}>🔵 Платиновые</option>
                                <option value="amber_sphere" ${currentCurrency === 'amber_sphere' ? 'selected' : ''}>🟠 Сфера</option>
                                <option value="blood_sphere" ${currentCurrency === 'blood_sphere' ? 'selected' : ''}>🔴 Сфера(Крови)</option>
                                <option value="ice_sphere" ${currentCurrency === 'ice_sphere' ? 'selected' : ''}>🔵 Сфера(Льда)</option>
                                <option value="fire_sphere" ${currentCurrency === 'fire_sphere' ? 'selected' : ''}>🔥 Сфера(Огня)</option>
                                <option value="earth_sphere" ${currentCurrency === 'earth_sphere' ? 'selected' : ''}>⛰️ Сфера(Земли)</option>
                                <option value="water_sphere" ${currentCurrency === 'water_sphere' ? 'selected' : ''}>💧 Сфера(Воды)</option>
                                <option value="lightning_sphere" ${currentCurrency === 'lightning_sphere' ? 'selected' : ''}>⚡ Сфера(Молнии)</option>
                                <option value="colorless_ether" ${currentCurrency === 'colorless_ether' ? 'selected' : ''}>💎 Кристалл(бесцв)</option>
                                <option value="elemental_ether" ${currentCurrency === 'elemental_ether' ? 'selected' : ''}>🌈 Кристалл(цветной)</option>
                            </select></div>
                            <div><span style="color: #e0d0c0;">🎲 СТАВКА:</span> <input type="number" id="betInput" value="${currentBet}" min="1" style="width: 80px; padding: 4px; background: #1a0f0b; color: #e0d0c0; border: 2px solid #8b4513; border-radius: 4px;"> <button onclick="window.updateBet()" style="background: #8b4513; border: none; color: white; padding: 4px 10px; border-radius: 4px; cursor: pointer;">Уст.</button></div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-bottom: 15px;">
                        <button id="spinBtn" onclick="window.spinRoulette()" style="background: #27ae60; color: white; border: none; padding: 12px 50px; border-radius: 12px; font-size: 1.3em; font-weight: bold; cursor: pointer;">🎲 КРУТИТЬ</button>
                    </div>
                    
                    <div style="position: relative; width: 420px; height: 420px; margin: 0 auto 20px;">
                        <canvas id="rouletteCanvas" width="420" height="420" style="width: 420px; height: 420px; border-radius: 50%; box-shadow: 0 0 20px rgba(0,0,0,0.5);"></canvas>
                        <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 20px solid transparent; border-right: 20px solid transparent; border-top: 40px solid #d4af37; z-index: 10;"></div>
                    </div>
                    
                    <div style="background: #2c1810; padding: 12px; border-radius: 12px;">
                        <h4 style="color: #d4af37; margin-bottom: 8px; text-align: center;">🎯 СТАВКИ НА ЧИСЛА</h4>
                        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; margin-bottom: 12px;">
                            ${generateNumberButtons()}
                        </div>
                        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                            <button onclick="window.placeColorBet('red')" style="background: #c44536; color: white; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;">🔴 КРАСНОЕ (x2)</button>
                            <button onclick="window.placeColorBet('black')" style="background: #2c2c2c; color: white; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;">⚫ ЧЕРНОЕ (x2)</button>
                            <button onclick="window.placeParityBet('even')" style="background: #5a3a2a; color: white; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer;">ЧЕТНОЕ (x2)</button>
                            <button onclick="window.placeParityBet('odd')" style="background: #5a3a2a; color: white; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer;">НЕЧЕТНОЕ (x2)</button>
                        </div>
                        <div id="betDisplay" style="margin-top: 10px; color: #b89a7a; text-align: center;"></div>
                        <div style="text-align: center; margin-top: 10px;">
                            <button onclick="window.clearBets()" style="background: #8b4513; color: white; border: none; padding: 6px 20px; border-radius: 6px; cursor: pointer;">🗑️ ОЧИСТИТЬ СТАВКИ</button>
                        </div>
                    </div>
                </div>
                
                <div style="flex: 1; min-width: 280px;">
                    ${renderLastResult()}
                    
                    <div style="background: #2c1810; border-radius: 12px; padding: 12px; border: 1px solid #8b4513;">
                        <h4 style="color: #d4af37; margin-bottom: 10px; text-align: center;">📜 ИСТОРИЯ</h4>
                        <div id="historyDisplay" style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                            ${renderHistory()}
                        </div>
                    </div>
                    
                    <div style="margin-top: 15px; text-align: center;">
                        <button onclick="window.backToMenu()" style="background: #5a3a2a; color: white; border: none; padding: 8px 25px; border-radius: 6px; cursor: pointer;">🏠 ГЛАВНОЕ МЕНЮ</button>
                    </div>
                </div>
            </div>
        `;
        
        initCanvas();
        updateBetDisplay();
    };
    
    window.backToMenu = function() {
        const container = document.getElementById('activeGameContainer');
        if (container) {
            container.innerHTML = `<div style="text-align: center;"><p style="color: #b89a7a; font-size: 1.2em;">🎮 Выберите игру</p></div>`;
        }
        if (typeof renderGamesManager === 'function') renderGamesManager();
    };
    
    loadBalance();
})();
