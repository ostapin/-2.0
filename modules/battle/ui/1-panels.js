// modules/battle/ui/1-panels.js
// Боковые панели (существа, очередь)

BattleModule.createSidePanel = function() {
    const container = document.querySelector('#battle-tab');
    if (!container) return;
    
    const panel = document.createElement('div');
    panel.id = 'battleCreaturesPanel';
    panel.style.cssText = `
        position: fixed;
        left: 20px;
        top: 200px;
        width: 250px;
        background: #2a1a0f;
        border: 2px solid #8b4513;
        border-radius: 8px;
        padding: 15px;
        color: #e0d0c0;
        z-index: 1000;
        display: none;
        max-height: 400px;
        flex-direction: column;
    `;
    
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-shrink: 0;">
            <h3 style="color: #d4af37; margin: 0;">👥 Существа на поле</h3>
            <button onclick="document.getElementById('battleCreaturesPanel').style.display = 'none'" 
                    style="background: none; border: none; color: #d4af37; font-size: 18px; cursor: pointer;">✖</button>
        </div>
        <div id="creaturesList" style="min-height: 100px; overflow-y: auto; flex-grow: 1; padding-right: 5px;"></div>
    `;
    
    container.appendChild(panel);
};

BattleModule.createTurnOrderPanel = function() {
    const container = document.querySelector('#battle-tab');
    if (!container) return;
    
    const panel = document.createElement('div');
    panel.id = 'turnOrderPanel';
    panel.style.cssText = `
        position: fixed;
        right: 20px;
        top: 200px;
        width: 250px;
        background: #2a1a0f;
        border: 2px solid #d4af37;
        border-radius: 8px;
        padding: 15px;
        color: #e0d0c0;
        z-index: 1000;
        display: none;
        max-height: 450px;
        flex-direction: column;
    `;
    
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-shrink: 0;">
            <h3 style="color: #d4af37; margin: 0;">⚔️ ОЧЕРЕДНОСТЬ ХОДОВ</h3>
            <button onclick="document.getElementById('turnOrderPanel').style.display = 'none'" 
                    style="background: none; border: none; color: #d4af37; font-size: 18px; cursor: pointer;">✖</button>
        </div>
        <div id="turnOrderList" style="min-height: 50px; overflow-y: auto; flex-grow: 1; margin-bottom: 10px; padding-right: 5px;"></div>
        <div style="display: flex; flex-direction: column; gap: 10px; flex-shrink: 0;">
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button class="btn btn-roll" onclick="BattleModule.startInitiative()">▶ Начать бой</button>
                <button class="btn btn-roll" onclick="BattleModule.nextTurn()">⏭ Следующий ход</button>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button class="btn btn-roll" id="toggleNumbersBtn" onclick="BattleModule.toggleNumbers()" style="flex: 1;">🔢 ВКЛ</button>
            </div>
        </div>
    `;
    
    container.appendChild(panel);
};
