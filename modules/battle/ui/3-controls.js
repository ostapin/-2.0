// modules/battle/ui/3-controls.js
if (!window.BattleModule) window.BattleModule = {};

// Создание панели управления (режимы расстановки, выбор существа/объекта)
BattleModule.createControls = function() {
    const panel = document.querySelector('#battle-tab .btn-roll')?.parentNode;
    if (!panel) return;
    
    const controlDiv = document.createElement('div');
    controlDiv.style.marginTop = '15px';
    controlDiv.style.padding = '15px';
    controlDiv.style.background = '#2a1a0f';
    controlDiv.style.borderRadius = '8px';
    controlDiv.style.border = '1px solid #8b4513';
    
    const title = document.createElement('div');
    title.style.color = '#d4af37';
    title.style.marginBottom = '15px';
    title.style.fontSize = '1.2em';
    title.innerHTML = '🐾 РАССТАНОВКА';
    controlDiv.appendChild(title);
    
    const modeRow = document.createElement('div');
    modeRow.style.display = 'flex';
    modeRow.style.gap = '10px';
    modeRow.style.marginBottom = '15px';
    modeRow.style.justifyContent = 'center';
    
    const placeBtn = document.createElement('button');
    placeBtn.className = 'btn btn-plus';
    placeBtn.id = 'placementModeBtn';
    placeBtn.innerHTML = '📌 РЕЖИМ: ВЫКЛ';
    placeBtn.style.flex = '1';
    placeBtn.onclick = () => this.togglePlacementMode();
    modeRow.appendChild(placeBtn);
    
    const eraseBtn = document.createElement('button');
    eraseBtn.className = 'btn btn-minus';
    eraseBtn.id = 'eraseModeBtn';
    eraseBtn.innerHTML = '🧹 УДАЛЕНИЕ: ВЫКЛ';
    eraseBtn.style.flex = '1';
    eraseBtn.onclick = () => this.toggleEraseMode();
    modeRow.appendChild(eraseBtn);
    
    controlDiv.appendChild(modeRow);
    
    const typeRow = document.createElement('div');
    typeRow.style.display = 'flex';
    typeRow.style.gap = '10px';
    typeRow.style.marginBottom = '15px';
    typeRow.style.justifyContent = 'center';
    
    const creatureTypeBtn = document.createElement('button');
    creatureTypeBtn.className = 'btn btn-roll';
    creatureTypeBtn.id = 'creatureTypeBtn';
    creatureTypeBtn.innerHTML = '👤 СУЩЕСТВА';
    creatureTypeBtn.style.flex = '1';
    creatureTypeBtn.style.background = '#4a7a9c';
    creatureTypeBtn.onclick = () => this.setType('creature');
    typeRow.appendChild(creatureTypeBtn);
    
    const objectTypeBtn = document.createElement('button');
    objectTypeBtn.className = 'btn btn-roll';
    objectTypeBtn.id = 'objectTypeBtn';
    objectTypeBtn.innerHTML = '🌲 ОБЪЕКТЫ';
    objectTypeBtn.style.flex = '1';
    objectTypeBtn.style.background = '#6b6b6b';
    objectTypeBtn.onclick = () => this.setType('object');
    typeRow.appendChild(objectTypeBtn);
    
    controlDiv.appendChild(typeRow);
    
    const creatureSelectRow = document.createElement('div');
    creatureSelectRow.id = 'creatureSelectRow';
    creatureSelectRow.style.display = 'flex';
    creatureSelectRow.style.gap = '10px';
    creatureSelectRow.style.alignItems = 'center';
    creatureSelectRow.style.marginBottom = '10px';
    
    const creatureLabel = document.createElement('span');
    creatureLabel.style.color = '#e0d0c0';
    creatureLabel.innerHTML = 'Существо:';
    creatureSelectRow.appendChild(creatureLabel);
    
    const creatureSelect = document.createElement('select');
    creatureSelect.id = 'creatureSelect';
    creatureSelect.style.flex = '2';
    creatureSelect.style.padding = '8px';
    creatureSelect.style.background = '#1a0f0b';
    creatureSelect.style.color = '#e0d0c0';
    creatureSelect.style.border = '2px solid #8b4513';
    creatureSelect.style.borderRadius = '4px';
    
    this.creatures.forEach(creature => {
        const option = document.createElement('option');
        option.value = creature.id;
        option.innerHTML = `${creature.icon} ${creature.name}`;
        creatureSelect.appendChild(option);
    });
    
    creatureSelect.onchange = (e) => this.currentCreature = e.target.value;
    creatureSelectRow.appendChild(creatureSelect);
    controlDiv.appendChild(creatureSelectRow);
    
    const objectSelectRow = document.createElement('div');
    objectSelectRow.id = 'objectSelectRow';
    objectSelectRow.style.display = 'none';
    objectSelectRow.style.gap = '10px';
    objectSelectRow.style.alignItems = 'center';
    objectSelectRow.style.marginBottom = '10px';
    
    const objectLabel = document.createElement('span');
    objectLabel.style.color = '#e0d0c0';
    objectLabel.innerHTML = 'Объект:';
    objectSelectRow.appendChild(objectLabel);
    
    const objectSelect = document.createElement('select');
    objectSelect.id = 'objectSelect';
    objectSelect.style.flex = '2';
    objectSelect.style.padding = '8px';
    objectSelect.style.background = '#1a0f0b';
    objectSelect.style.color = '#e0d0c0';
    objectSelect.style.border = '2px solid #8b4513';
    objectSelect.style.borderRadius = '4px';
    
    this.objects.forEach(object => {
        const option = document.createElement('option');
        option.value = object.id;
        option.innerHTML = `${object.icon} ${object.name}`;
        objectSelect.appendChild(option);
    });
    
    objectSelect.onchange = (e) => this.currentObject = e.target.value;
    objectSelectRow.appendChild(objectSelect);
    controlDiv.appendChild(objectSelectRow);
    
    const infoRow = document.createElement('div');
    infoRow.style.marginTop = '10px';
    infoRow.style.padding = '8px';
    infoRow.style.background = '#1a0f0b';
    infoRow.style.borderRadius = '4px';
    infoRow.style.color = '#b89a7a';
    infoRow.style.fontSize = '0.9em';
    infoRow.style.textAlign = 'center';
    infoRow.innerHTML = '💡 На гексе может быть ИЛИ существо ИЛИ объект, но не оба сразу';
    
    controlDiv.appendChild(infoRow);
    panel.appendChild(controlDiv);
};

// Переключение типа (существо/объект)
BattleModule.setType = function(type) {
    this.currentType = type;
    
    const creatureBtn = document.getElementById('creatureTypeBtn');
    const objectBtn = document.getElementById('objectTypeBtn');
    const creatureRow = document.getElementById('creatureSelectRow');
    const objectRow = document.getElementById('objectSelectRow');
    
    if (type === 'creature') {
        creatureBtn.style.background = '#4a7a9c';
        objectBtn.style.background = '';
        creatureRow.style.display = 'flex';
        objectRow.style.display = 'none';
    } else {
        creatureBtn.style.background = '';
        objectBtn.style.background = '#6b6b6b';
        creatureRow.style.display = 'none';
        objectRow.style.display = 'flex';
    }
};

// Включение/выключение режима расстановки
BattleModule.togglePlacementMode = function() {
    this.placementMode = !this.placementMode;
    if (this.placementMode) {
        this.eraseMode = false;
        this.moveModeActive = false;
        this.attackModeActive = false;
        this.rangedAttackModeActive = false;
    }
    this.updateModeButtons();
};

// Включение/выключение режима удаления
BattleModule.toggleEraseMode = function() {
    this.eraseMode = !this.eraseMode;
    if (this.eraseMode) {
        this.placementMode = false;
        this.moveModeActive = false;
        this.attackModeActive = false;
        this.rangedAttackModeActive = false;
    }
    this.updateModeButtons();
};

// Обновление внешнего вида кнопок режимов
BattleModule.updateModeButtons = function() {
    const placeBtn = document.getElementById('placementModeBtn');
    const eraseBtn = document.getElementById('eraseModeBtn');
    
    if (placeBtn) {
        placeBtn.innerHTML = this.placementMode ? '📌 РЕЖИМ: ВКЛ' : '📌 РЕЖИМ: ВЫКЛ';
        placeBtn.style.background = this.placementMode ? '#5a9c4a' : '';
    }
    
    if (eraseBtn) {
        eraseBtn.innerHTML = this.eraseMode ? '🧹 УДАЛЕНИЕ: ВКЛ' : '🧹 УДАЛЕНИЕ: ВЫКЛ';
        eraseBtn.style.background = this.eraseMode ? '#b34a4a' : '';
    }
};

// Изменение размера гекса
BattleModule.setHexSize = function(size) {
    this.hexSize = parseInt(size);
    document.getElementById('hexSizeValue').textContent = size;
    
    this.generateHexGrid(this.cols, this.rows);
    this.centerView();
    this.drawGrid();
    this.highlightSelected();
};

// Изменение размера поля
BattleModule.setGridSize = function(size) {
    size = parseInt(size);
    
    // Сохраняем существ
    const oldCreatures = this.activeCreatures.map(c => ({
        ...c,
        position: c.position ? { col: c.position.col, row: c.position.row } : null
    }));
    
    // Сохраняем объекты
    const oldObjects = this.hexes.filter(h => h.object).map(h => ({ col: h.col, row: h.row, object: h.object }));
    
    this.cols = size;
    this.rows = size;
    this.generateHexGrid(this.cols, this.rows);
    
    // Восстанавливаем объекты
    oldObjects.forEach(obj => {
        if (obj.col < this.cols && obj.row < this.rows) {
            const hex = this.hexes.find(h => h.col === obj.col && h.row === obj.row);
            if (hex) hex.object = obj.object;
        }
    });
    
    // Восстанавливаем существ
    this.activeCreatures = [];
    oldCreatures.forEach(creature => {
        if (creature.position && creature.position.col < this.cols && creature.position.row < this.rows) {
            const hex = this.hexes.find(h => h.col === creature.position.col && h.row === creature.position.row);
            if (hex) {
                this.activeCreatures.push(creature);
                hex.creature = creature.templateId;
                hex.creatureId = creature.id;
                hex.occupied = true;
            }
        }
    });
    
    this.centerView();
    this.drawGrid();
    this.highlightSelected();
    this.updateCreaturesList();
    this.updateTurnOrder();
};
