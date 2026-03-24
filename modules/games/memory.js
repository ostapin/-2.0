// ========== МЕМОРИ (НАЙДИ ПАРУ) ==========

let cards = [];
let flipped = [];
let locked = false;
let matched = [];
let firstIndex = null;
let moves = 0;
let matchesFound = 0;
let gameMode = null;
let gridSize = null;
let totalPairs = 0;
let gameActive = false;
let startTime = null;
let timerInterval = null;

// Рейтинги
let ratings = {
    time: [],
    moves: []
};

// Загрузка рейтингов из localStorage
function loadRatings() {
    const saved = localStorage.getItem('memoryRatings');
    if (saved) {
        ratings = JSON.parse(saved);
    }
}

// Сохранение рейтингов
function saveRatings() {
    localStorage.setItem('memoryRatings', JSON.stringify(ratings));
}

function renderMemory() {
    const container = document.getElementById('activeGameContainer');
    if (!container) return;
    
    if (!gameMode) {
        container.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: #d4af37; margin-bottom: 20px; font-size: 1.8em;">🧠 МЕМОРИ</h3>
                
                <div style="margin: 30px 0;">
                    <button onclick="showGameModes()" style="background: #5a3a2a; color: white; border: none; padding: 15px 40px; margin: 10px; border-radius: 8px; font-size: 1.2em; cursor: pointer;">🎮 ИГРАТЬ</button>
                    <button onclick="showRatings()" style="background: #5a3a2a; color: white; border: none; padding: 15px 40px; margin: 10px; border-radius: 8px; font-size: 1.2em; cursor: pointer;">🏆 РЕЙТИНГ</button>
                </div>
            </div>
        `;
    } else if (gameMode === 'select') {
        container.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: #d4af37; margin-bottom: 20px; font-size: 1.8em;">🧠 ВЫБЕРИ РЕЖИМ</h3>
                
                <div style="margin: 30px 0;">
                    <button onclick="startGameMode('classic', 4)" style="background: #27ae60; color: white; border: none; padding: 15px 40px; margin: 10px; border-radius: 8px; font-size: 1.2em; cursor: pointer;">📊 КЛАССИЧЕСКИЙ (4x4)</button>
                    <button onclick="startGameMode('classic', 8)" style="background: #27ae60; color: white; border: none; padding: 15px 40px; margin: 10px; border-radius: 8px; font-size: 1.2em; cursor: pointer;">📊 КЛАССИЧЕСКИЙ (8x8)</button>
                </div>
                
                <div style="margin-top: 20px;">
                    <button onclick="backToMenu()" style="background: #8b4513; color: white; border: none; padding: 10px 25px; border-radius: 6px; cursor: pointer;">⬅ НАЗАД</button>
                </div>
            </div>
        `;
    } else if (gameMode === 'playing') {
        container.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: #d4af37; margin-bottom: 20px; font-size: 1.8em;">🧠 МЕМОРИ ${gridSize}x${gridSize}</h3>
                <div style="color: #e0d0c0; margin-bottom: 15px;">
                    <span>⏱️ Время: <span id="gameTimer">0</span> сек</span> | 
                    <span>🎯 Ходов: ${moves}</span> | 
                    <span>✅ Найдено: ${matchesFound} / ${totalPairs}</span>
                </div>
                <div id="memory-grid" style="display: grid; grid-template-columns: repeat(${gridSize}, 70px); gap: 8px; justify-content: center; margin: 20px auto;"></div>
                <div style="margin-top: 20px;">
                    <button onclick="resetMemoryGame()" style="background: #8b4513; color: white; border: none; padding: 10px 25px; border-radius: 6px; font-size: 1em; cursor: pointer; margin-right: 10px;">🔄 НОВАЯ ИГРА</button>
                    <button onclick="backToMenu()" style="background: #5a3a2a; color: white; border: none; padding: 10px 25px; border-radius: 6px; font-size: 1em; cursor: pointer;">🏠 ГЛАВНОЕ МЕНЮ</button>
                </div>
            </div>
        `;
        renderMemoryGrid();
    } else if (gameMode === 'ratings') {
        container.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: #d4af37; margin-bottom: 20px; font-size: 1.8em;">🏆 РЕЙТИНГИ</h3>
                
                <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin: 20px 0;">
                    <div style="background: #3d2418; padding: 20px; border-radius: 12px; min-width: 250px;">
                        <h4 style="color: #d4af37;">⏱️ ЛУЧШЕЕ ВРЕМЯ</h4>
                        <div id="timeRatingsList"></div>
                    </div>
                    <div style="background: #3d2418; padding: 20px; border-radius: 12px; min-width: 250px;">
                        <h4 style="color: #d4af37;">🎯 ЛУЧШИЕ ХОДЫ</h4>
                        <div id="movesRatingsList"></div>
                    </div>
                </div>
                
                <div style="margin-top: 20px;">
                    <button onclick="backToMenu()" style="background: #8b4513; color: white; border: none; padding: 10px 25px; border-radius: 6px; cursor: pointer;">⬅ НАЗАД</button>
                </div>
            </div>
        `;
        renderRatings();
    }
}

function showGameModes() {
    gameMode = 'select';
    renderMemory();
}

function showRatings() {
    gameMode = 'ratings';
    renderMemory();
}

function startGameMode(mode, size) {
    gameMode = 'playing';
    gridSize = size;
    totalPairs = (size * size) / 2;
    initMemoryGame();
    startTimer();
    renderMemory();
}

function initMemoryGame() {
    const totalCards = gridSize * gridSize;
    const pairValues = [];
    
    const emojis = ['🐉', '⚔️', '🛡️', '🧙', '🏰', '🗡️', '🔮', '🐲', '👑', '💎', '⚡', '🔥', '❄️', '🌿', '🌙', '☀️', '⭐', '🌈', '🎭', '🏹', '🪄', '📜', '⛓️', '💀'];
    
    for (let i = 0; i < totalPairs; i++) {
        pairValues.push(emojis[i % emojis.length]);
    }
    
    cards = [...pairValues, ...pairValues];
    
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    flipped = new Array(totalCards).fill(false);
    matched = new Array(totalCards).fill(false);
    locked = false;
    firstIndex = null;
    moves = 0;
    matchesFound = 0;
    gameActive = true;
}

function startTimer() {
    startTime = Date.now();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (gameActive && gameMode === 'playing') {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const timerElem = document.getElementById('gameTimer');
            if (timerElem) timerElem.textContent = elapsed;
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function renderMemoryGrid() {
    const grid = document.getElementById('memory-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    const totalCards = gridSize * gridSize;
    
    for (let i = 0; i < totalCards; i++) {
        const card = document.createElement('button');
        
        if (matched[i]) {
            card.textContent = cards[i];
            card.style.background = '#2c5a2c';
            card.style.border = '2px solid #d4af37';
            card.style.cursor = 'default';
        } else if (flipped[i]) {
            card.textContent = cards[i];
            card.style.background = '#3d5a3d';
            card.style.border = '2px solid #d4af37';
        } else {
            card.textContent = '?';
            card.style.background = '#3d2418';
            card.style.border = '2px solid #8b4513';
        }
        
        card.style.width = '70px';
        card.style.height = '70px';
        card.style.borderRadius = '8px';
        card.style.fontSize = '1.8em';
        card.style.cursor = matched[i] ? 'default' : 'pointer';
        card.style.transition = 'all 0.2s';
        
        if (!matched[i] && !locked && gameActive) {
            card.onclick = () => flipCard(i);
        } else {
            card.onclick = null;
        }
        
        grid.appendChild(card);
    }
}

function flipCard(index) {
    if (locked) return;
    if (flipped[index]) return;
    if (matched[index]) return;
    if (!gameActive) return;
    
    flipped[index] = true;
    moves++;
    renderMemoryGrid();
    
    if (firstIndex === null) {
        firstIndex = index;
        return;
    }
    
    const firstCard = cards[firstIndex];
    const secondCard = cards[index];
    
    if (firstCard === secondCard) {
        matched[firstIndex] = true;
        matched[index] = true;
        matchesFound++;
        flipped[firstIndex] = false;
        flipped[index] = false;
        firstIndex = null;
        
        renderMemoryGrid();
        
        if (matchesFound === totalPairs) {
            gameActive = false;
            stopTimer();
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            
            saveResult(elapsed, moves);
            
            const container = document.getElementById('activeGameContainer');
            if (container) {
                const statusDiv = document.createElement('div');
                statusDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #2c1810; border: 3px solid #d4af37; border-radius: 20px; padding: 30px; text-align: center; z-index: 1000;';
                statusDiv.innerHTML = `
                    <h2 style="color: #d4af37;">🏆 ПОБЕДА! 🏆</h2>
                    <p style="color: #e0d0c0; font-size: 1.2em;">Время: ${elapsed} сек | Ходов: ${moves}</p>
                    <button onclick="this.parentElement.remove(); resetMemoryGame()" style="background: #8b4513; color: white; border: none; padding: 10px 25px; border-radius: 6px; font-size: 1em; cursor: pointer; margin-top: 15px;">ИГРАТЬ СНОВА</button>
                    <button onclick="this.parentElement.remove(); backToMenu()" style="background: #5a3a2a; color: white; border: none; padding: 10px 25px; border-radius: 6px; font-size: 1em; cursor: pointer; margin-top: 15px; margin-left: 10px;">ГЛАВНОЕ МЕНЮ</button>
                `;
                document.body.appendChild(statusDiv);
            }
        }
    } else {
        locked = true;
        setTimeout(() => {
            flipped[firstIndex] = false;
            flipped[index] = false;
            firstIndex = null;
            locked = false;
            if (gameActive) renderMemoryGrid();
        }, 800);
    }
}

function saveResult(time, movesCount) {
    loadRatings();
    
    const result = {
        time: time,
        moves: movesCount,
        size: `${gridSize}x${gridSize}`,
        date: new Date().toLocaleDateString()
    };
    
    ratings.time.push(result);
    ratings.moves.push(result);
    
    ratings.time.sort((a, b) => a.time - b.time);
    ratings.moves.sort((a, b) => a.moves - b.moves);
    
    ratings.time = ratings.time.slice(0, 10);
    ratings.moves = ratings.moves.slice(0, 10);
    
    saveRatings();
}

function renderRatings() {
    loadRatings();
    
    const timeList = document.getElementById('timeRatingsList');
    const movesList = document.getElementById('movesRatingsList');
    
    if (timeList) {
        if (ratings.time.length === 0) {
            timeList.innerHTML = '<p style="color: #8b7d6b;">Пока нет результатов</p>';
        } else {
            timeList.innerHTML = ratings.time.map((r, i) => `
                <div style="margin: 8px 0; padding: 8px; background: #1a0f0b; border-radius: 6px;">
                    <span style="color: #d4af37; font-weight: bold;">${i+1}.</span> 
                    <span style="color: #e0d0c0;">${r.time} сек</span>
                    <span style="color: #b89a7a; font-size: 0.8em;"> (${r.size})</span>
                    <div style="color: #8b7d6b; font-size: 0.7em;">${r.date}</div>
                </div>
            `).join('');
        }
    }
    
    if (movesList) {
        if (ratings.moves.length === 0) {
            movesList.innerHTML = '<p style="color: #8b7d6b;">Пока нет результатов</p>';
        } else {
            movesList.innerHTML = ratings.moves.map((r, i) => `
                <div style="margin: 8px 0; padding: 8px; background: #1a0f0b; border-radius: 6px;">
                    <span style="color: #d4af37; font-weight: bold;">${i+1}.</span> 
                    <span style="color: #e0d0c0;">${r.moves} ходов</span>
                    <span style="color: #b89a7a; font-size: 0.8em;"> (${r.size})</span>
                    <div style="color: #8b7d6b; font-size: 0.7em;">${r.date}</div>
                </div>
            `).join('');
        }
    }
}

function resetMemoryGame() {
    stopTimer();
    initMemoryGame();
    startTimer();
    renderMemory();
}

function backToMenu() {
    stopTimer();
    gameMode = null;
    gridSize = null;
    gameActive = false;
    renderMemory();
}

loadRatings();

window.renderMemory = renderMemory;
window.showGameModes = showGameModes;
window.showRatings = showRatings;
window.startGameMode = startGameMode;
window.resetMemoryGame = resetMemoryGame;
window.flipCard = flipCard;
window.backToMenu = backToMenu;
