// ========== КРЕСТИКИ-НОЛИКИ ==========

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameOver = false;
let gameMode = null;
let difficulty = null;

function renderTicTacToe() {
    const container = document.getElementById('activeGameContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3 style="color: #d4af37; margin-bottom: 20px; font-size: 1.8em;">❌ КРЕСТИКИ-НОЛИКИ</h3>
            
            ${!gameMode ? `
                <div style="margin: 30px 0;">
                    <button onclick="startGame('2player')" style="background: #5a3a2a; color: white; border: none; padding: 15px 40px; margin: 10px; border-radius: 8px; font-size: 1.2em; cursor: pointer;">👥 2 ИГРОКА</button>
                    <button onclick="showDifficultyMenu()" style="background: #5a3a2a; color: white; border: none; padding: 15px 40px; margin: 10px; border-radius: 8px; font-size: 1.2em; cursor: pointer;">🤖 ПРОТИВ КОМПЬЮТЕРА</button>
                </div>
            ` : ''}
            
            ${gameMode === 'difficulty' ? `
                <div style="margin: 30px 0;">
                    <h4 style="color: #d4af37; margin-bottom: 20px;">ВЫБЕРИ СЛОЖНОСТЬ</h4>
                    <button onclick="startGame('computer', 'easy')" style="background: #27ae60; color: white; border: none; padding: 12px 30px; margin: 5px; border-radius: 8px; font-size: 1em; cursor: pointer;">🟢 ЛЁГКИЙ</button>
                    <button onclick="startGame('computer', 'medium')" style="background: #f39c12; color: white; border: none; padding: 12px 30px; margin: 5px; border-radius: 8px; font-size: 1em; cursor: pointer;">🟡 СРЕДНИЙ</button>
                    <button onclick="startGame('computer', 'hard')" style="background: #e67e22; color: white; border: none; padding: 12px 30px; margin: 5px; border-radius: 8px; font-size: 1em; cursor: pointer;">🟠 СЛОЖНЫЙ</button>
                    <button onclick="startGame('computer', 'impossible')" style="background: #c0392b; color: white; border: none; padding: 12px 30px; margin: 5px; border-radius: 8px; font-size: 1em; cursor: pointer;">🔴 НЕПОБЕДИМЫЙ</button>
                    <div style="margin-top: 20px;">
                        <button onclick="backToMenu()" style="background: #8b4513; color: white; border: none; padding: 10px 25px; border-radius: 6px; cursor: pointer;">⬅ НАЗАД</button>
                    </div>
                </div>
            ` : ''}
            
            ${gameMode && gameMode !== 'difficulty' ? `
                <div style="display: grid; grid-template-columns: repeat(3, 100px); gap: 8px; justify-content: center; margin: 20px auto;">
                    ${board.map((cell, i) => `
                        <button onclick="makeMove(${i})" id="cell-${i}" style="width: 100px; height: 100px; background: #3d2418; border: 2px solid #8b4513; border-radius: 8px; font-size: 3em; color: #d4af37; cursor: pointer;">${cell === 'X' ? '❌' : cell === 'O' ? '⭕' : ' '}</button>
                    `).join('')}
                </div>
                <div id="game-status" style="color: #e0d0c0; font-size: 1.2em; margin: 15px 0;">
                    ${!gameOver ? `Ход: ${currentPlayer === 'X' ? '❌' : '⭕'}` : ''}
                </div>
                <button onclick="resetGame()" style="background: #8b4513; color: white; border: none; padding: 10px 25px; border-radius: 6px; font-size: 1em; cursor: pointer; margin-right: 10px;">🔄 НОВАЯ ИГРА</button>
                <button onclick="backToMenu()" style="background: #5a3a2a; color: white; border: none; padding: 10px 25px; border-radius: 6px; font-size: 1em; cursor: pointer;">🏠 ГЛАВНОЕ МЕНЮ</button>
            ` : ''}
        </div>
    `;
}

function showDifficultyMenu() {
    gameMode = 'difficulty';
    renderTicTacToe();
}

function backToMenu() {
    gameMode = null;
    difficulty = null;
    resetGameState();
    renderTicTacToe();
}

function startGame(mode, diff = null) {
    gameMode = mode;
    difficulty = diff;
    resetGameState();
    renderTicTacToe();
    
    if (gameMode === 'computer' && currentPlayer === 'O') {
        setTimeout(() => computerMove(), 500);
    }
}

function resetGameState() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameOver = false;
}

function resetGame() {
    resetGameState();
    renderTicTacToe();
    
    if (gameMode === 'computer' && currentPlayer === 'O') {
        setTimeout(() => computerMove(), 500);
    }
}

function makeMove(index) {
    if (gameOver) return;
    if (board[index] !== '') return;
    
    board[index] = currentPlayer;
    renderTicTacToe();
    
    const winner = checkWinner();
    if (winner) {
        gameOver = true;
        const statusDiv = document.getElementById('game-status');
        if (statusDiv) statusDiv.innerHTML = `🏆 ПОБЕДА: ${winner === 'X' ? '❌' : '⭕'} 🏆`;
        return;
    }
    
    if (board.every(cell => cell !== '')) {
        gameOver = true;
        const statusDiv = document.getElementById('game-status');
        if (statusDiv) statusDiv.innerHTML = '🤝 НИЧЬЯ 🤝';
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    renderTicTacToe();
    
    if (gameMode === 'computer' && !gameOver && currentPlayer === 'O') {
        setTimeout(() => computerMove(), 500);
    }
}

function computerMove() {
    if (gameOver) return;
    
    let moveIndex = -1;
    
    if (difficulty === 'easy') {
        moveIndex = getRandomMove();
    } else if (difficulty === 'medium') {
        if (Math.random() < 0.5) {
            moveIndex = getBlockingMove();
            if (moveIndex === -1) moveIndex = getRandomMove();
        } else {
            moveIndex = getRandomMove();
        }
    } else if (difficulty === 'hard') {
        moveIndex = getBlockingMove();
        if (moveIndex === -1) moveIndex = getWinningMove();
        if (moveIndex === -1) moveIndex = getRandomMove();
    } else if (difficulty === 'impossible') {
        moveIndex = getBestMove();
    }
    
    if (moveIndex !== -1) {
        board[moveIndex] = 'O';
        renderTicTacToe();
        
        const winner = checkWinner();
        if (winner) {
            gameOver = true;
            const statusDiv = document.getElementById('game-status');
            if (statusDiv) statusDiv.innerHTML = `🏆 ПОБЕДА: ${winner === 'X' ? '❌' : '⭕'} 🏆`;
            return;
        }
        
        if (board.every(cell => cell !== '')) {
            gameOver = true;
            const statusDiv = document.getElementById('game-status');
            if (statusDiv) statusDiv.innerHTML = '🤝 НИЧЬЯ 🤝';
            return;
        }
        
        currentPlayer = 'X';
        renderTicTacToe();
    }
}

function getRandomMove() {
    const empty = [];
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') empty.push(i);
    }
    if (empty.length === 0) return -1;
    return empty[Math.floor(Math.random() * empty.length)];
}

function getWinningMove() {
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            if (checkWinner() === 'O') {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }
    return -1;
}

function getBlockingMove() {
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'X';
            if (checkWinner() === 'X') {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }
    return -1;
}

function getBestMove() {
    let bestScore = -Infinity;
    let bestMove = -1;
    
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

function minimax(boardState, depth, isMaximizing) {
    const winner = checkWinnerOnBoard(boardState);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (boardState.every(cell => cell !== '')) return 0;
    
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (boardState[i] === '') {
                boardState[i] = 'O';
                let score = minimax(boardState, depth + 1, false);
                boardState[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (boardState[i] === '') {
                boardState[i] = 'X';
                let score = minimax(boardState, depth + 1, true);
                boardState[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinnerOnBoard(boardState) {
    const lines = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];
    for (let line of lines) {
        const [a,b,c] = line;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return boardState[a];
        }
    }
    return null;
}

function checkWinner() {
    return checkWinnerOnBoard(board);
}

window.renderTicTacToe = renderTicTacToe;
window.startGame = startGame;
window.makeMove = makeMove;
window.resetGame = resetGame;
window.backToMenu = backToMenu;
window.showDifficultyMenu = showDifficultyMenu;
