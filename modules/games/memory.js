// ========== МЕМОРИ (НАЙДИ ПАРУ) ==========

let cards = [];
let flipped = [];
let locked = false;
let matched = [];
let firstIndex = null;
let moves = 0;
let matchesFound = 0;

function renderMemory() {
    const container = document.getElementById('activeGameContainer');
    if (!container) return;
    
    if (cards.length === 0) {
        initMemoryGame();
    }
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3 style="color: #d4af37; margin-bottom: 20px; font-size: 1.8em;">🧠 МЕМОРИ</h3>
            <div style="color: #e0d0c0; margin-bottom: 15px;">
                <span>Ходов: ${moves}</span> | 
                <span>Пар найдено: ${matchesFound} / 8</span>
            </div>
            <div id="memory-grid" style="display: grid; grid-template-columns: repeat(4, 90px); gap: 12px; justify-content: center; margin: 20px auto;"></div>
            <div style="margin-top: 20px;">
                <button onclick="resetMemoryGame()" style="background: #8b4513; color: white; border: none; padding: 10px 25px; border-radius: 6px; font-size: 1em; cursor: pointer; margin-right: 10px;">🔄 НОВАЯ ИГРА</button>
                <button onclick="backToMenu()" style="background: #5a3a2a; color: white; border: none; padding: 10px 25px; border-radius: 6px; font-size: 1em; cursor: pointer;">🏠 ГЛАВНОЕ МЕНЮ</button>
            </div>
        </div>
    `;
    renderMemoryGrid();
}

function initMemoryGame() {
    // 8 пар карточек с фэнтези тематикой
    const cardValues = ['🐉', '⚔️', '🛡️', '🧙', '🏰', '🗡️', '🔮', '🐲'];
    cards = [...cardValues, ...cardValues];
    // Перемешиваем
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    flipped = new Array(16).fill(false);
    matched = new Array(16).fill(false);
    locked = false;
    firstIndex = null;
    moves = 0;
    matchesFound = 0;
}

function renderMemoryGrid() {
    const grid = document.getElementById('memory-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    for (let i = 0; i < 16; i++) {
        const card = document.createElement('button');
        card.setAttribute('data-index', i);
        
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
        
        card.style.width = '90px';
        card.style.height = '90px';
        card.style.borderRadius = '10px';
        card.style.fontSize = '2.5em';
        card.style.cursor = matched[i] ? 'default' : 'pointer';
        card.style.transition = 'all 0.2s';
        
        if (!matched[i] && !locked) {
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
    
    flipped[index] = true;
    moves++;
    renderMemoryGrid();
    
    if (firstIndex === null) {
        firstIndex = index;
        return;
    }
    
    // Проверяем пару
    const firstCard = cards[firstIndex];
    const secondCard = cards[index];
    
    if (firstCard === secondCard) {
        // Найдена пара
        matched[firstIndex] = true;
        matched[index] = true;
        matchesFound++;
        flipped[firstIndex] = false;
        flipped[index] = false;
        firstIndex = null;
        
        renderMemoryGrid();
        
        // Проверка победы
        if (matchesFound === 8) {
            const container = document.getElementById('activeGameContainer');
            if (container) {
                const statusDiv = document.createElement('div');
                statusDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #2c1810; border: 3px solid #d4af37; border-radius: 20px; padding: 30px; text-align: center; z-index: 1000;';
                statusDiv.innerHTML = `
                    <h2 style="color: #d4af37;">🏆 ПОБЕДА! 🏆</h2>
                    <p style="color: #e0d0c0; font-size: 1.2em;">Вы нашли все ${moves} ходов!</p>
                    <button onclick="this.parentElement.remove(); resetMemoryGame()" style="background: #8b4513; color: white; border: none; padding: 10px 25px; border-radius: 6px; font-size: 1em; cursor: pointer; margin-top: 15px;">ИГРАТЬ СНОВА</button>
                `;
                document.body.appendChild(statusDiv);
            }
        }
    } else {
        // Не пара, переворачиваем обратно
        locked = true;
        setTimeout(() => {
            flipped[firstIndex] = false;
            flipped[index] = false;
            firstIndex = null;
            locked = false;
            renderMemoryGrid();
        }, 800);
    }
}

function resetMemoryGame() {
    initMemoryGame();
    renderMemory();
}

function backToMenu() {
    const container = document.getElementById('activeGameContainer');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center;">
                <p style="color: #b89a7a; font-size: 1.2em;">🎮 Выберите игру</p>
            </div>
        `;
    }
    // Возвращаем в главное меню games-manager
    if (typeof renderGamesManager === 'function') {
        renderGamesManager();
    }
}

// Глобальные функции
window.renderMemory = renderMemory;
window.resetMemoryGame = resetMemoryGame;
window.flipCard = flipCard;
window.backToMenu = backToMenu;
