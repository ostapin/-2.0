// ========== МЕНЕДЖЕР ИГР ==========

const gamesList = {
    ticTacToe: { name: "❌ Крестики-нолики", icon: "❌" },
    memory: { name: "🧠 Мемори", icon: "🧠" }
};

let currentGame = 'ticTacToe';

function renderGamesManager() {
    const container = document.getElementById('gamesContainer');
    if (!container) return;
    
    let buttonsHtml = `
        <div style="display: flex; gap: 20px; justify-content: center; margin-bottom: 40px; flex-wrap: wrap;">
    `;
    for (const [key, game] of Object.entries(gamesList)) {
        buttonsHtml += `
            <button onclick="switchGame('${key}')" style="
                background: ${currentGame === key ? '#d4af37' : '#5a3a2a'};
                color: ${currentGame === key ? '#2c1810' : '#e0d0c0'};
                border: none;
                padding: 15px 40px;
                font-size: 1.3em;
                font-weight: bold;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            " onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
                ${game.icon} ${game.name}
            </button>
        `;
    }
    buttonsHtml += '</div>';
    buttonsHtml += `
        <div id="activeGameContainer" style="
            background: #2c1810;
            border-radius: 20px;
            padding: 40px;
            border: 2px solid #d4af37;
            min-height: 400px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <p style="color: #b89a7a; font-size: 1.2em;">🎮 Выберите игру</p>
        </div>
    `;
    
    container.innerHTML = buttonsHtml;
}

function switchGame(gameKey) {
    if (gamesList[gameKey]) {
        currentGame = gameKey;
        renderGamesManager();
        
        const container = document.getElementById('activeGameContainer');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center;">
                    <p style="color: #d4af37; font-size: 1.5em; margin-bottom: 20px;">${gamesList[currentGame].icon} ${gamesList[currentGame].name}</p>
                    <p style="color: #b89a7a;">📁 Игра будет загружена из отдельного файла</p>
                    <p style="color: #8b7d6b; font-size: 0.9em;">modules/games/${currentGame}/game.js</p>
                </div>
            `;
        }
    }
}

window.renderGamesManager = renderGamesManager;
window.switchGame = switchGame;
