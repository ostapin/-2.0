// ========== РУЛЕТКА ==========

(function() {
    // Конфигурация
    const NUMBERS = Array.from({length: 37}, (_, i) => i);
    const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
    
    let balance = 1000;
    let currentBet = 10;
    let spinning = false;
    let lastResults = [];
    let currentBets = {
        numbers: {},
        color: null,
        parity: null
    };
    
    // Загрузка баланса
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
                
                <div style="background: #2c5a2c; border-radius: 50%; width: 300px; height: 300px; margin: 0 auto 20px; position: relative; border: 3px solid #d4af37; overflow: hidden;">
                    <div id="rouletteWheel" style="width: 100%; height: 100%; position: relative; transition: transform 3s cubic-bezier(0.2, 0.9, 0.4, 1.1);">
                        ${generateWheelSegments()}
                    </div>
                    <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 15px solid transparent; border-right: 15px solid transparent; border-top: 30px solid #d4af37; z-index: 10;"></div>
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
                    <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin-bottom: 15px;">
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
        
        updateBetDisplay();
        renderHistory();
    };
    
    function generateWheelSegments() {
        let segments = '';
        const angleStep = 360 / 37;
        for (let i = 0; i <= 36; i++) {
            const color = getNumberColor(i);
            const bgColor = color === 'red' ? '#c44536' : (color === 'black' ? '#2c2c2c' : '#2c5a2c');
            segments += `
                <div style="position: absolute; width: 50%; height: 25px; background: ${bgColor}; left: 50%; top: 50%; transform-origin: 0% 50%; transform: rotate(${i * angleStep}deg) translateY(-12px); display: flex; justify-content: flex-end; align-items: center; padding-right: 15px;">
                    <span style="color: white; font-size: 12px; font-weight: bold;">${i}</span>
                </div>
            `;
        }
        return `<div style="position: relative; width: 100%; height: 100%;">${segments}<div style="position: absolute; width: 60px; height: 60px; background: #d4af37; border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div></div>`;
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
        renderRoulette();
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
        renderRoulette();
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
        renderRoulette();
    };
    
    window.changeBet = function(amount) {
        let newBet = currentBet + amount;
        if (newBet >= 5 && newBet <= 500) {
            currentBet = newBet;
            document.getElementById('rouletteBet').textContent = currentBet;
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
        renderRoulette();
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
        document.getElementById('rouletteBalance').textContent = balance;
        
        const result = Math.floor(Math.random() * 37);
        
        const wheel = document.getElementById('rouletteWheel');
        if (wheel) {
            const angleStep = 360 / 37;
            const spinAngle = 360 * 10 + (result * angleStep);
            wheel.style.transform = `rotate(${spinAngle}deg)`;
        }
        
        setTimeout(() => {
            processResult(result, totalBet);
            spinning = false;
            if (spinBtn) spinBtn.disabled = false;
            renderRoulette();
        }, 3000);
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
