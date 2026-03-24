// ========== МЕНЕДЖЕР ИГР ==========

const gamesList = {
    ticTacToe: { name: "❌ Крестики-нолики", icon: "❌", file: "ticTacToe.js", render: "renderTicTacToe" },
    memory: { name: "🧠 Мемори", icon: "🧠", file: "memory.js", render: "renderMemory" }
};

let currentGame = 'ticTacToe';
let gameScriptLoaded = false;

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
    buttonsHtml += '<div id="activeGameContainer" style="background: #2c1810; border-radius: 20px; padding: 40px; border: 2px solid #d4af37; min-height: 400px; text-align: center; display: flex; align-items: center; justify-content: center;"><p style="color: #b89a7a;">🎮 Загрузка...</p></div>';
    
    container.innerHTML = buttonsHtml;
    loadGame(currentGame);
}

function switchGame(gameKey) {
    if (gamesList[gameKey]) {
        currentGame = gameKey;
        renderGamesManager();
    }
}

function loadGame(gameKey) {
    const game = gamesList[gameKey];
    if (!game) return;
    
    const container = document.getElementById('activeGameContainer');
    if (!container) return;
    
    container.innerHTML = '<p style="color: #b89a7a;">🎮 Загрузка игры...</p>';
    
    // Удаляем старый скрипт если есть
    const oldScript = document.getElementById('game-script');
    if (oldScript) oldScript.remove();
    
    // Загружаем новый скрипт игры
    const script = document.createElement('script');
    script.id = 'game-script';
    script.src = `modules/games/${game.file}`;
    script.onload = function() {
        // Ждём немного чтобы скрипт инициализировался
        setTimeout(() => {
            if (typeof window[game.render] === 'function') {
                window[game.render]();
            } else {
                container.innerHTML = '<p style="color: #e74c3c;">❌ Ошибка загрузки игры</p>';
            }
        }, 50);
    };
    script.onerror = function() {
        container.innerHTML = '<p style="color: #e74c3c;">❌ Не удалось загрузить игру. Файл не найден.</p>';
    };
    document.head.appendChild(script);
}

// Глобальные функции
window.renderGamesManager = renderGamesManager;
window.switchGame = switchGame;
