// ========== ИГРА: КРЕСТИКИ-НОЛИКИ ==========
function renderTicTacToe(container) {
    container.innerHTML = `
        <h3>❌ КРЕСТИКИ-НОЛИКИ</h3>
        <p>Игра в разработке</p>
    `;
}

// ========== ИГРА: МЕМОРИ ==========
function renderMemory(container) {
    container.innerHTML = `
        <h3>🧠 МЕМОРИ</h3>
        <p>Игра в разработке</p>
    `;
}

// ========== МЕНЕДЖЕР ИГР ==========
const gamesList = {
    ticTacToe: { name: "❌ Крестики-нолики", icon: "❌", func: renderTicTacToe },
    memory: { name: "🧠 Мемори", icon: "🧠", func: renderMemory }
};

let currentGame = 'ticTacToe';

function renderGamesManager() {
    const container = document.getElementById('gamesContainer');
    if (!container) return;
    
    let buttonsHtml = '<div>';
    for (const [key, game] of Object.entries(gamesList)) {
        buttonsHtml += `<button onclick="switchGame('${key}')">${game.icon} ${game.name}</button>`;
    }
    buttonsHtml += '</div><div id="activeGameContainer"></div>';
    
    container.innerHTML = buttonsHtml;
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
    if (game && game.func) game.func(container);
}
