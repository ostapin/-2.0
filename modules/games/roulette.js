// ========== РУЛЕТКА ==========

(function() {
    const NUMBERS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    
    let balance = 1000;
    let currentBet = 10;
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
    
    window.renderRoulette = function() {
        const container = document.getElementById('activeGameContainer');
        if (!container) return;
        
        loadBalance();
        
        container.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: #d4af37; margin-bottom: 15px; font-size: 1.8em;">🎰 РУЛЕТКА</h3>
                
                <div style="position: relative; width: 400px; height: 400px; margin: 0 auto 20px;">
                    <canvas id="rouletteCanvas" width="400" height="400" style="width: 400px; height: 400px; border-radius: 50%; box-shadow: 0 0 20px rgba(0,0,0,0.5);"></canvas>
                    <div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 20px solid transparent; border-right: 20px solid transparent; border-top: 40px solid #d4af37; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.5)); z-index: 10;"></div>
                </div>
                
                <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px; flex-wrap: wrap;">
                    <div style="background: #3d2418; padding: 10px 20px; border-radius: 8px;">
                        <span style="color: #e0d0c0;">💰 БАЛАНС:</span>
                        <span id="rouletteBalance" style="color: #d4af37; font-size: 1.5em; font-weight: bold; margin-left: 10px;">${balance}</span>
                    </div>
                    <div style="background: #3d2418; padding: 10px 20px; border-radius: 8px;">
                        <span style="color: #e0d0c0;">🎲 СТАВКА:</span>
                        <button onclick="window.changeBet(-10)" style="background: #8b4513; border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer;">-</button>
                        <span id="rouletteBet" style="color: #d4af37; font-size: 1.2em; margin: 0 10px;">${currentBet}</span>
                        <button onclick="window.changeBet(10)" style="background: #8b4513; border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer;">+</button>
                    </div>
                </div>
                
                <div style="background: #2c1810; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="color: #d4af37; margin-bottom: 10px;">🎯 СТАВКИ</h4>
                    <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; margin-bottom: 15px;">
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
                
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="spinBtn" onclick="window.spinRoulette()" style="background: #27ae60; color: white; border: none; padding: 12px 40px; border-radius: 8px; font-size: 1.2em; font-weight: bold; cursor: pointer;">🎲 КРУТИТЬ</button>
                    <button onclick="window.clearBets()" style="background: #8b4513; color: white; border: none; padding: 12px 30px; border-radius: 8px; cursor: pointer;">🗑️ ОЧИСТИТЬ СТАВКИ</button>
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
            ctx.font = 'bold 14px Arial';
            ctx.fillStyle = 'white';
            ctx.shadowBlur = 0;
            ctx.fillText(number.toString(), radius - 25, 0);
            ctx.restore();
        }
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
        ctx.fillStyle = '#d4af37';
        ctx.fill();
        ctx.strokeStyle = '#2c1810';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    function generateNumberButtons() {
        let html = '';
        const standardOrder = Array.from({length: 37}, (_, i) => i);
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
    
    window.changeBet = function(amount) {
        let newBet = currentBet + amount;
        if (newBet >= 5 && newBet <= 500) {
            currentBet = newBet;
            const betSpan = document.getElementById('rouletteBet');
            if (betSpan) betSpan.textContent = currentBet;
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
            display.innerHTML = `📌 Ставки: ${bets.join(' | ')} | 💰 Сумма: ${totalBet}`;
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
        if (balanceSpan) balanceSpan.textContent = balance;
        
        const resultIndex = Math.floor(Math.random() * NUMBERS.length);
        const resultNumber = NUMBERS[resultIndex];
        
        const angleStep = (Math.PI * 2) / NUMBERS.length;
        const currentPointerAngle = (Math.PI * 2) - (Math.PI / 2);
        
        let resultAngle = resultIndex * angleStep + angleStep / 2;
        let targetRotation = (currentPointerAngle - resultAngle) + (Math.PI * 2) * 6;
        
        targetRotation = targetRotation % (Math.PI * 2);
        
        let startRotation = currentRotation;
        let startTime = null;
        const duration = 2500;
        
        function animateSpin(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(1, elapsed / duration);
            
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
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
                winDetails.push(`Число ${num}: +${win}`);
            }
        }
        
        if (currentBets.color && currentBets.color === resultColor && result !== 0) {
            const win = currentBet * 2;
            winnings += win;
            winDetails.push(`${currentBets.color === 'red' ? 'Красное' : 'Черное'}: +${win}`);
        }
        
        if (currentBets.parity && resultParity === currentBets.parity && result !== 0) {
            const win = currentBet * 2;
            winnings += win;
            winDetails.push(`${currentBets.parity === 'even' ? 'Четное' : 'Нечетное'}: +${win}`);
        }
        
        balance += winnings;
        saveBalance();
        
        const resultDisplay = document.getElementById('resultDisplay');
        const balanceSpan = document.getElementById('rouletteBalance');
        if (balanceSpan) balanceSpan.textContent = balance;
        
        if (resultDisplay) {
            const colorDisplay = resultColor === 'red' ? '🔴' : (resultColor === 'black' ? '⚫' : '🟢');
            resultDisplay.style.display = 'block';
            resultDisplay.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 1.5em;">🎲 ВЫПАЛО: <span style="color: ${resultColor === 'red' ? '#c44536' : (resultColor === 'black' ? '#fff' : '#2c5a2c')}">${result} ${colorDisplay}</span></div>
                    ${winDetails.length > 0 ? `<div style="color: #27ae60;">Выигрыш: +${winnings}</div>` : '<div style="color: #c44536;">Проигрыш</div>'}
                    <div style="color: #d4af37;">Новый баланс: ${balance}</div>
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
