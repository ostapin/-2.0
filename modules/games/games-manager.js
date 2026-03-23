// ========== МЕНЕДЖЕР ИГР ==========

const gamesList = {
    ticTacToe: { name: "❌ Крестики-нолики", icon: "❌", func: renderTicTacToe },
    memory: { name: "🧠 Мемори", icon: "🧠", func: renderMemory }
};

let currentGame = 'ticTacToe';

function renderGamesManager() {
    const container = document.getElementById('gamesContainer');
    if (!container) {
        console.error('gamesContainer не найден');
        return;
    }
    
    // Кнопки выбора игр
    let buttonsHtml = '<div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 20px; flex-wrap: wrap;">';
    for (const [key, game] of Object.entries(gamesList)) {
        buttonsHtml += `<button class="btn" onclick="switchGame('${key}')" style="background: ${currentGame === key ? '#d4af37' : '#8b4513'}; color: ${currentGame === key ? '#2c1810' : 'white'};">${game.icon} ${game.name}</button>`;
    }
    buttonsHtml += '</div>';
    
    // Контейнер для активной игры
    buttonsHtml += '<div id="activeGameContainer" style="background: #2c1810; border-radius: 12px; padding: 20px; border: 2px solid #8b4513;"></div>';
    
    container.innerHTML = buttonsHtml;
    
    // Рендерим активную игру
    renderCurrentGame();
}

function switchGame(gameKey) {
    if (gamesList[gameKey]) {
        currentGame = gameKey;
        renderGamesManager();
    }
}

function renderCurrentGame() {
    const container = document.getElementById('activeGameContainer');
    if (!container) return;
    
    const game = gamesList[currentGame];
    if (game && game.func) {
        game.func(container);
    }
}

// ========== ИГРА: КРЕСТИКИ-НОЛИКИ ==========
function renderTicTacToe(container) {
    container.innerHTML = `
        <h3 style="color: #d4af37; text-align: center; margin-bottom: 20px;">❌ КРЕСТИКИ-НОЛИКИ</h3>
        <div style="text-align: center; padding: 20px;">
            <p style="color: #e0d0c0;">🎮 Игра в разработке</p>
            <p style="color: #8b7d6b;">Скоро будет доступна</p>
        </div>
    `;
}

// ========== ИГРА: МЕМОРИ ==========
function renderMemory(container) {
    container.innerHTML = `
        <h3 style="color: #d4af37; text-align: center; margin-bottom: 20px;">🧠 МЕМОРИ</h3>
        <div style="text-align: center; padding: 20px;">
            <p style="color: #e0d0c0;">🎮 Игра в разработке</p>
            <p style="color: #8b7d6b;">Скоро будет доступна</p>
        </div>
    `;
}
