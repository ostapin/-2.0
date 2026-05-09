// modules/battle/0-init.js
if (!window.BattleModule) window.BattleModule = {};

// Инициализация боевого модуля
BattleModule.init = function() {
    this.canvas = document.getElementById('battleCanvas');
    if (!this.canvas) {
        console.error('battleCanvas не найден');
        return;
    }
    
    this.ctx = this.canvas.getContext('2d');
    
    // Свойства
    this.hexSize = 40;
    this.gridColor = '#8b4513';
    this.highlightColor = '#d4af37';
    this.moveHighlightColor = '#5a9c4a';
    this.attackHighlightColor = '#b34a4a';
    this.currentTurnHighlight = '#ffaa00';
    this.selectedHex = null;
    this.hexes = [];
    this.offsetX = 500;
    this.offsetY = 300;
    this.scale = 1;
    this.isDragging = false;
    this.lastX = 0;
    this.lastY = 0;
    this.cols = 20;
    this.rows = 20;
    
    this.activeCreatures = [];
    this.turnOrder = [];
    this.currentTurnIndex = -1;
    this.turnActive = false;
    
    this.moveModeActive = false;
    this.attackModeActive = false;
    this.rangedAttackModeActive = false;
    this.preparingAttackCreatureId = null;
    this.preparedAttackType = null;
    this.movingCreatureId = null;
    this.availableMoveHexes = [];
    this.availableAttackTargets = [];
    this.availableRangedTargets = [];
    
    this.showNumbers = true;
    
    this.defaultSkills = {
        'Тяжёлая броня': 10, 'Лёгкая броня': 10, 'Двуручное оружие': 10,
        'Одноручное оружие': 10, 'Стрельба': 10, 'Блокирование': 10,
        'Древковое': 10, 'Рукопашный бой': 10, 'Метание': 10,
        'Скрытность': 10, 'Выносливость': 10, 'Восприятие': 10, 'Ловкость': 10
    };
    
    this.creatures = [
        { id: 'human', name: '👤 Человек', color: '#4a7a9c', icon: '👤' },
        { id: 'wolf', name: '🐺 Волк', color: '#7c7c7c', icon: '🐺' },
        { id: 'bear', name: '🐻 Медведь', color: '#8b5a2b', icon: '🐻' },
        { id: 'goblin', name: '👺 Гоблин', color: '#2d5a27', icon: '👺' },
        { id: 'orc', name: '👹 Орк', color: '#4a2d1a', icon: '👹' },
        { id: 'dragon', name: '🐉 Дракон', color: '#b31e1e', icon: '🐉' },
        { id: 'elf', name: '🧝 Эльф', color: '#2d7a4a', icon: '🧝' },
        { id: 'dwarf', name: '⛰️ Дварф', color: '#6b4a2d', icon: '⛰️' },
        { id: 'skeleton', name: '💀 Скелет', color: '#a0a0a0', icon: '💀' },
        { id: 'ghost', name: '👻 Призрак', color: '#d0d0ff', icon: '👻' }
    ];
    
    this.objects = [
        { id: 'tree', name: '🌲 Дерево', color: '#2d5a27', icon: '🌲' },
        { id: 'rock', name: '🪨 Камень', color: '#6b6b6b', icon: '🪨' },
        { id: 'wall', name: '🧱 Стена', color: '#8b4513', icon: '🧱' },
        { id: 'water', name: '💧 Вода', color: '#2d5a9c', icon: '💧' },
        { id: 'fire', name: '🔥 Огонь', color: '#b34a2d', icon: '🔥' },
        { id: 'chest', name: '📦 Сундук', color: '#d4af37', icon: '📦' },
        { id: 'door', name: '🚪 Дверь', color: '#6b4a2d', icon: '🚪' },
        { id: 'stairs', name: '⬆️ Лестница', color: '#8b6b4a', icon: '⬆️' },
        { id: 'trap', name: '⚠️ Ловушка', color: '#b34a4a', icon: '⚠️' },
        { id: 'altar', name: '🕯️ Алтарь', color: '#9c7a4a', icon: '🕯️' }
    ];
    
    this.currentType = 'creature';
    this.currentCreature = 'human';
    this.currentObject = 'tree';
    this.placementMode = false;
    this.eraseMode = false;
    
    // Генерация поля и отрисовка
    this.generateHexGrid(this.cols, this.rows);
    this.centerView();
    this.drawGrid();
    this.bindEvents();
    this.createControls();
    this.createSidePanel();
    this.createTurnOrderPanel();
    
    console.log('Battle module initialized');
};

// Обработка событий мыши
BattleModule.bindEvents = function() {
    this.canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        this.zoom(delta, mouseX, mouseY);
    });
    
    this.canvas.addEventListener('mousedown', (e) => {
        if (e.button === 1 || (e.button === 0 && e.altKey)) {
            this.isDragging = true;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
            this.canvas.style.cursor = 'grabbing';
            e.preventDefault();
        }
    });
    
    window.addEventListener('mousemove', (e) => {
        if (this.isDragging) {
            const dx = e.clientX - this.lastX;
            const dy = e.clientY - this.lastY;
            this.offsetX += dx;
            this.offsetY += dy;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
            this.drawGrid();
            this.highlightSelected();
        }
    });
    
    window.addEventListener('mouseup', (e) => {
        if (e.button === 1 || e.button === 0) {
            this.isDragging = false;
            this.canvas.style.cursor = 'crosshair';
        }
    });
    
    this.canvas.addEventListener('click', (e) => {
        if (this.isDragging) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - this.offsetX) / this.scale;
        const y = (e.clientY - rect.top - this.offsetY) / this.scale;
        
        const hex = this.findHexByPosition(x, y);
        if (hex) {
            if (this.attackModeActive) {
                this.tryAttackTarget(hex);
            } else if (this.rangedAttackModeActive) {
                this.tryRangedAttack(hex);
            } else if (this.moveModeActive) {
                this.tryMoveToHex(hex);
            } else if (this.eraseMode) {
                this.eraseHex(hex);
            } else if (this.placementMode) {
                this.placeOnHex(hex);
            } else {
                this.selectHex(hex);
            }
        }
    });
    
    this.canvas.addEventListener('dblclick', (e) => {
        if (this.placementMode || this.eraseMode) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - this.offsetX) / this.scale;
        const y = (e.clientY - rect.top - this.offsetY) / this.scale;
        
        const hex = this.findHexByPosition(x, y);
        if (hex && hex.creatureId) {
            this.openCreaturePanel(hex.creatureId);
        }
    });
    
    this.canvas.addEventListener('mousemove', (e) => {
        if (this.isDragging) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - this.offsetX) / this.scale;
        const y = (e.clientY - rect.top - this.offsetY) / this.scale;
        
        this.drawGrid();
        this.highlightSelected();
        
        const hex = this.findHexByPosition(x, y);
        if (hex && hex !== this.selectedHex) {
            this.highlightHex(hex, true);
        }
    });
    
    this.canvas.addEventListener('mouseleave', () => {
        this.drawGrid();
        this.highlightSelected();
    });
};

// Движение существа
BattleModule.activateMoveMode = function(creatureId) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature || !creature.position || creature.currentHp <= 0) return;
    
    if (this.turnActive && this.turnOrder[this.currentTurnIndex] !== creatureId) {
        alert('Сейчас не ход этого существа!');
        return;
    }
    
    const panel = document.getElementById('creaturePanel');
    if (panel) panel.remove();
    
    const template = CreaturesDB.get(creature.templateId);
    const speed = template ? template.speed : 5;
    
    const currentHex = this.hexes.find(h => h.col === creature.position.col && h.row === creature.position.row);
    if (!currentHex) return;
    
    this.moveModeActive = true;
    this.movingCreatureId = creatureId;
    this.availableMoveHexes = this.findReachableHexes(currentHex, speed);
    
    this.selectedHex = currentHex;
    this.drawGrid();
    this.highlightSelected();
};

// Поиск доступных для движения гексов
BattleModule.findReachableHexes = function(startHex, maxDistance) {
    const reachable = [];
    const distances = new Map();
    const queue = [{ hex: startHex, dist: 0 }];
    
    const hexKey = (hex) => `${hex.col},${hex.row}`;
    distances.set(hexKey(startHex), 0);
    
    while (queue.length > 0) {
        const { hex, dist } = queue.shift();
        
        if (dist > 0 && dist <= maxDistance) {
            if (!hex.object && !hex.creature) reachable.push(hex);
        }
        
        if (dist < maxDistance) {
            let neighbors = [];
            if (hex.row % 2 === 0) {
                neighbors = [
                    { col: hex.col + 1, row: hex.row },
                    { col: hex.col - 1, row: hex.row },
                    { col: hex.col, row: hex.row - 1 },
                    { col: hex.col - 1, row: hex.row - 1 },
                    { col: hex.col, row: hex.row + 1 },
                    { col: hex.col - 1, row: hex.row + 1 }
                ];
            } else {
                neighbors = [
                    { col: hex.col + 1, row: hex.row },
                    { col: hex.col - 1, row: hex.row },
                    { col: hex.col + 1, row: hex.row - 1 },
                    { col: hex.col, row: hex.row - 1 },
                    { col: hex.col + 1, row: hex.row + 1 },
                    { col: hex.col, row: hex.row + 1 }
                ];
            }
            
            neighbors.forEach(pos => {
                if (pos.col >= 0 && pos.col < this.cols && pos.row >= 0 && pos.row < this.rows) {
                    const neighbor = this.hexes.find(h => h.col === pos.col && h.row === pos.row);
                    if (neighbor) {
                        const key = hexKey(neighbor);
                        if (!distances.has(key) || distances.get(key) > dist + 1) {
                            distances.set(key, dist + 1);
                            queue.push({ hex: neighbor, dist: dist + 1 });
                        }
                    }
                }
            });
        }
    }
    
    return reachable;
};

// Попытка перемещения на гекс
BattleModule.tryMoveToHex = function(targetHex) {
    if (!this.moveModeActive || !this.movingCreatureId) {
        this.moveModeActive = false;
        this.availableMoveHexes = [];
        this.drawGrid();
        return;
    }
    
    const isAvailable = this.availableMoveHexes.some(h => h.col === targetHex.col && h.row === targetHex.row);
    
    if (isAvailable) {
        const creature = this.activeCreatures.find(c => c.id === this.movingCreatureId);
        if (creature && creature.position && creature.currentHp > 0) {
            const oldHex = this.hexes.find(h => h.col === creature.position.col && h.row === creature.position.row);
            if (oldHex) {
                oldHex.creature = null;
                oldHex.creatureId = null;
                oldHex.occupied = false;
            }
            
            targetHex.creature = creature.templateId;
            targetHex.creatureId = creature.id;
            targetHex.occupied = true;
            creature.position = { col: targetHex.col, row: targetHex.row };
            
            if (this.turnActive) this.nextTurn();
        }
    }
    
    this.moveModeActive = false;
    this.movingCreatureId = null;
    this.availableMoveHexes = [];
    this.drawGrid();
    this.highlightSelected();
};

// Запуск после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    if (window.BattleModule && window.BattleModule.init) {
        window.BattleModule.init();
    } else {
        console.error('BattleModule не загружен или init не найден');
    }
});
