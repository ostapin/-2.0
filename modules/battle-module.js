// modules/battle-module.js (ПОЛНАЯ ВЕРСИЯ)

const BattleModule = {
    canvas: null,
    ctx: null,
    hexSize: 40,
    gridColor: '#8b4513',
    highlightColor: '#d4af37',
    moveHighlightColor: '#5a9c4a',
    currentTurnHighlight: '#ffaa00',
    selectedHex: null,
    hexes: [],
    offsetX: 500,
    offsetY: 300,
    scale: 1,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    cols: 20,
    rows: 20,
    
    // Существа на поле
    activeCreatures: [],
    
    // Очередность ходов
    turnOrder: [],
    currentTurnIndex: -1,
    turnActive: false,
    
    // Режимы
    moveModeActive: false,
    movingCreatureId: null,
    availableMoveHexes: [],
    
    creatures: [
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
    ],
    
    objects: [
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
    ],
    
    currentType: 'creature',
    currentCreature: 'human',
    currentObject: 'tree',
    placementMode: false,
    eraseMode: false,
    
    init() {
        this.canvas = document.getElementById('battleCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.generateHexGrid(this.cols, this.rows);
        this.drawGrid();
        this.bindEvents();
        this.createControls();
        this.createSidePanel();
        this.createTurnOrderPanel();
        
        console.log('Battle module initialized');
    },
    
    generateHexGrid(cols, rows) {
        this.hexes = [];
        const hexWidth = this.hexSize * 1.732;
        const vertSpacing = this.hexSize * 1.5;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const xOffset = (row % 2) * (hexWidth / 2);
                const x = col * hexWidth + xOffset;
                const y = row * vertSpacing;
                
                this.hexes.push({
                    x, y,
                    col, row,
                    occupied: false,
                    creature: null,
                    creatureId: null,
                    object: null
                });
            }
        }
    },
    
    drawGrid() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.save();
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.scale, this.scale);
        
        // Рисуем все гексы (фон)
        this.ctx.strokeStyle = this.gridColor;
        this.ctx.lineWidth = 2 / this.scale;
        this.ctx.fillStyle = '#2a1a0f';
        
        this.hexes.forEach(hex => {
            this.drawHexagon(hex.x, hex.y, false);
        });
        
        // Подсвечиваем доступные для движения клетки
        if (this.moveModeActive && this.availableMoveHexes.length > 0) {
            this.ctx.fillStyle = this.moveHighlightColor;
            this.ctx.globalAlpha = 0.3;
            this.availableMoveHexes.forEach(hex => {
                this.drawHexagon(hex.x, hex.y, false);
            });
            this.ctx.globalAlpha = 1;
        }
        
        // Рисуем объекты
        this.hexes.forEach(hex => {
            if (hex.object) {
                this.drawObject(hex);
            }
        });
        
        // Рисуем существ
        this.hexes.forEach(hex => {
            if (hex.creature) {
                this.drawCreature(hex);
            }
        });
        
        // Обводка гексов (поверх всего)
        this.ctx.strokeStyle = this.gridColor;
        this.ctx.lineWidth = 2 / this.scale;
        this.hexes.forEach(hex => {
            this.drawHexagon(hex.x, hex.y, true);
        });
        
        this.ctx.restore();
    },
    
    drawHexagon(x, y, stroke = true) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3 - Math.PI / 6;
            const hx = x + this.hexSize * Math.cos(angle);
            const hy = y + this.hexSize * Math.sin(angle);
            
            if (i === 0) {
                this.ctx.moveTo(hx, hy);
            } else {
                this.ctx.lineTo(hx, hy);
            }
        }
        this.ctx.closePath();
        
        if (stroke) {
            this.ctx.stroke();
        } else {
            this.ctx.fill();
        }
    },
    
    drawCreature(hex) {
        const creature = this.creatures.find(c => c.id === hex.creature);
        if (!creature) return;
        
        const creatureData = this.activeCreatures.find(c => c.id === hex.creatureId);
        const isDead = creatureData && creatureData.currentHp <= 0;
        
        const isCurrentTurn = this.turnActive && 
                             this.turnOrder[this.currentTurnIndex] === hex.creatureId;
        
        let fillColor = creature.color;
        if (isDead) {
            fillColor = '#555555';
        } else if (isCurrentTurn) {
            fillColor = this.currentTurnHighlight;
        }
        
        this.ctx.fillStyle = fillColor;
        this.ctx.globalAlpha = isDead ? 0.5 : (isCurrentTurn ? 0.9 : 0.7);
        this.drawHexagon(hex.x, hex.y, false);
        this.ctx.globalAlpha = 1;
        
        this.ctx.font = `${this.hexSize * 1.2}px Arial`;
        this.ctx.fillStyle = isDead ? '#888888' : '#ffffff';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(creature.icon, hex.x, hex.y);
        
        if (isDead) {
            this.ctx.strokeStyle = '#ff0000';
            this.ctx.lineWidth = 3 / this.scale;
            this.ctx.beginPath();
            this.ctx.moveTo(hex.x - this.hexSize/2, hex.y - this.hexSize/2);
            this.ctx.lineTo(hex.x + this.hexSize/2, hex.y + this.hexSize/2);
            this.ctx.moveTo(hex.x + this.hexSize/2, hex.y - this.hexSize/2);
            this.ctx.lineTo(hex.x - this.hexSize/2, hex.y + this.hexSize/2);
            this.ctx.stroke();
        }
        
        if (!isDead && creatureData) {
            const hpPercent = creatureData.currentHp / creatureData.maxHp;
            const barWidth = this.hexSize * 1.5;
            const barHeight = 4;
            const barX = hex.x - barWidth/2;
            const barY = hex.y - this.hexSize * 0.8;
            
            this.ctx.fillStyle = '#330000';
            this.ctx.fillRect(barX, barY, barWidth, barHeight);
            
            this.ctx.fillStyle = hpPercent > 0.5 ? '#00aa00' : (hpPercent > 0.2 ? '#aaaa00' : '#aa0000');
            this.ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);
            
            this.ctx.font = `${this.hexSize * 0.5}px Arial`;
            this.ctx.fillStyle = '#ffffaa';
            this.ctx.fillText(creatureData.currentInitiative, hex.x + this.hexSize/2, hex.y - this.hexSize/2);
        }
    },
    
    drawObject(hex) {
        const object = this.objects.find(o => o.id === hex.object);
        if (!object) return;
        
        this.ctx.fillStyle = object.color;
        this.ctx.globalAlpha = 0.4;
        this.drawHexagon(hex.x, hex.y, false);
        this.ctx.globalAlpha = 1;
        
        this.ctx.font = `${this.hexSize * 1}px Arial`;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(object.icon, hex.x, hex.y);
    },
    
    bindEvents() {
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
                if (this.moveModeActive) {
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
    },
    
    // Панель очередности ходов
    createTurnOrderPanel() {
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
        `;
        
        panel.innerHTML = `
            <h3 style="color: #d4af37; margin-bottom: 15px; text-align: center;">⚔️ ОЧЕРЕДНОСТЬ ХОДОВ</h3>
            <div id="turnOrderList" style="min-height: 50px; margin-bottom: 10px;"></div>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button class="btn btn-roll" onclick="BattleModule.startInitiative()">▶ Начать бой</button>
                <button class="btn btn-roll" onclick="BattleModule.nextTurn()">⏭ Следующий ход</button>
            </div>
        `;
        
        container.appendChild(panel);
    },
    
    updateTurnOrder() {
        const panel = document.getElementById('turnOrderPanel');
        const listDiv = document.getElementById('turnOrderList');
        
        if (!panel || !listDiv) return;
        
        if (this.activeCreatures.length === 0) {
            panel.style.display = 'none';
            return;
        }
        
        panel.style.display = 'block';
        
        const sorted = [...this.activeCreatures]
            .filter(c => c.currentHp > 0)
            .sort((a, b) => b.currentInitiative - a.currentInitiative);
        
        this.turnOrder = sorted.map(c => c.id);
        
        if (sorted.length === 0) {
            listDiv.innerHTML = '<p style="color: #8b7d6b; text-align: center;">Нет живых существ</p>';
            return;
        }
        
        let html = '';
        sorted.forEach((creature, index) => {
            const isCurrent = this.turnActive && index === this.currentTurnIndex;
            const bgColor = isCurrent ? '#5a9c4a' : '#1a0f0b';
            
            html += `
                <div style="background: ${bgColor}; margin-bottom: 8px; padding: 8px; border-radius: 4px; border: 1px solid #8b4513; display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px;">${creature.icon}</span>
                    <div style="flex: 1;">
                        <div style="font-weight: bold; color: #d4af37;">${creature.name}</div>
                        <div style="font-size: 12px;">Инициатива: ${creature.currentInitiative}</div>
                    </div>
                    ${isCurrent ? '<span style="color: #ffffaa;">▶ ХОДИТ</span>' : ''}
                </div>
            `;
        });
        
        listDiv.innerHTML = html;
    },
    
    startInitiative() {
        const alive = this.activeCreatures.filter(c => c.currentHp > 0);
        if (alive.length === 0) return;
        
        this.turnActive = true;
        this.currentTurnIndex = 0;
        this.updateTurnOrder();
        this.drawGrid();
        
        console.log('Бой начат! Ходит:', this.activeCreatures.find(c => c.id === this.turnOrder[0])?.name);
    },
    
    nextTurn() {
        if (!this.turnActive || this.turnOrder.length === 0) return;
        
        this.currentTurnIndex = (this.currentTurnIndex + 1) % this.turnOrder.length;
        this.updateTurnOrder();
        this.drawGrid();
        
        const currentId = this.turnOrder[this.currentTurnIndex];
        const current = this.activeCreatures.find(c => c.id === currentId);
        console.log('Следующий ход:', current?.name);
    },
    
    // Панель персонажа
    openCreaturePanel(creatureId) {
        const creature = this.activeCreatures.find(c => c.id === creatureId);
        if (!creature) return;
        
        const template = CreaturesDB.get(creature.templateId);
        const speed = template ? template.speed : 5;
        
        const oldPanel = document.getElementById('creaturePanel');
        if (oldPanel) oldPanel.remove();
        
        const panel = document.createElement('div');
        panel.id = 'creaturePanel';
        panel.style.cssText = `
            position: fixed;
            left: 300px;
            top: 200px;
            width: 250px;
            background: #3d2418;
            border: 3px solid #d4af37;
            border-radius: 10px;
            padding: 15px;
            color: #e0d0c0;
            z-index: 1001;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        `;
        
        const hpPercent = (creature.currentHp / creature.maxHp) * 100;
        const isDead = creature.currentHp <= 0;
        
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="color: #d4af37; margin: 0;">${creature.icon} ${creature.name}</h3>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #d4af37; font-size: 20px; cursor: pointer;">✖</button>
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>❤️ HP:</span>
                    <span>${creature.currentHp}/${creature.maxHp}</span>
                </div>
                <div style="height: 15px; background: #1a0f0b; border-radius: 8px; overflow: hidden;">
                    <div style="height: 15px; width: ${hpPercent}%; background: ${hpPercent > 50 ? '#00aa00' : (hpPercent > 20 ? '#aaaa00' : '#aa0000')};"></div>
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span>⚡ Инициатива:</span>
                    <input type="number" id="initiativeInput" value="${creature.currentInitiative}" min="1" max="30" style="width: 60px; padding: 5px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513;">
                    <button class="btn btn-small" onclick="BattleModule.updateInitiative('${creature.id}')">✓</button>
                </div>
            </div>
            
            ${!isDead ? `
                <div style="display: flex; gap: 5px; margin-bottom: 15px;">
                    <button class="btn btn-minus" style="flex: 1;" onclick="BattleModule.damageCreature('${creature.id}', 5)">-5</button>
                    <button class="btn btn-plus" style="flex: 1;" onclick="BattleModule.healCreature('${creature.id}', 5)">+5</button>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <input type="number" id="damageInput" value="10" min="1" style="width: 80px; padding: 5px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513; margin-right: 5px;">
                    <button class="btn btn-minus" onclick="BattleModule.damageCreature('${creature.id}', document.getElementById('damageInput').value)">Урон</button>
                </div>
                
                <div style="border-top: 1px solid #8b4513; padding-top: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span>⚡ Скорость: ${speed} гексов</span>
                        <button class="btn btn-roll" onclick="BattleModule.activateMoveMode('${creature.id}')">🚶 Движение</button>
                    </div>
                </div>
            ` : '<div style="color: #ff6666; text-align: center; padding: 10px;">💀 СУЩЕСТВО МЕРТВО</div>'}
            
            <div style="font-size: 12px; color: #b89a7a; text-align: center; margin-top: 10px;">
                🛡️ КБ: ${creature.ac || 12}
            </div>
        `;
        
        document.body.appendChild(panel);
    },
    
    updateInitiative(creatureId) {
        const creature = this.activeCreatures.find(c => c.id === creatureId);
        if (!creature) return;
        
        const input = document.getElementById('initiativeInput');
        const newValue = parseInt(input.value);
        
        if (newValue && newValue > 0) {
            creature.currentInitiative = newValue;
            this.updateTurnOrder();
            this.drawGrid();
            this.openCreaturePanel(creatureId);
        }
    },
    
    activateMoveMode(creatureId) {
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
    },
    
    findReachableHexes(startHex, maxDistance) {
        const reachable = [];
        const distances = new Map();
        const queue = [{ hex: startHex, dist: 0 }];
        
        const hexKey = (hex) => `${hex.col},${hex.row}`;
        distances.set(hexKey(startHex), 0);
        
        while (queue.length > 0) {
            const { hex, dist } = queue.shift();
            
            if (dist > 0 && dist <= maxDistance) {
                if (!hex.object && !hex.creature) {
                    reachable.push(hex);
                }
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
    },
    
    tryMoveToHex(targetHex) {
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
                
                console.log(`Существо перемещено на [${targetHex.col}, ${targetHex.row}]`);
                
                if (this.turnActive) {
                    this.nextTurn();
                }
            }
        }
        
        this.moveModeActive = false;
        this.movingCreatureId = null;
        this.availableMoveHexes = [];
        
        this.drawGrid();
        this.highlightSelected();
    },
    
    damageCreature(creatureId, amount) {
        amount = parseInt(amount) || 0;
        const creature = this.activeCreatures.find(c => c.id === creatureId);
        if (!creature) return;
        
        creature.currentHp = Math.max(0, creature.currentHp - amount);
        
        if (creature.currentHp === 0) {
            console.log(`Существо ${creature.name} погибло`);
            this.updateTurnOrder();
            
            const panel = document.getElementById('creaturePanel');
            if (panel) panel.remove();
        }
        
        this.drawGrid();
        this.updateCreaturesList();
        this.updateTurnOrder();
        
        const panel = document.getElementById('creaturePanel');
        if (panel && panel.innerHTML.includes(creatureId)) {
            this.openCreaturePanel(creatureId);
        }
    },
    
    healCreature(creatureId, amount) {
        amount = parseInt(amount) || 0;
        const creature = this.activeCreatures.find(c => c.id === creatureId);
        if (!creature || creature.currentHp <= 0) return;
        
        creature.currentHp = Math.min(creature.maxHp, creature.currentHp + amount);
        
        this.drawGrid();
        this.updateCreaturesList();
        this.updateTurnOrder();
        
        const panel = document.getElementById('creaturePanel');
        if (panel) {
            this.openCreaturePanel(creatureId);
        }
    },
    
    createSidePanel() {
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
            max-height: 500px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
        `;
        
        panel.innerHTML = `
            <h3 style="color: #d4af37; margin-bottom: 15px; text-align: center;">👥 Существа на поле</h3>
            <div id="creaturesList" style="min-height: 100px;"></div>
        `;
        
        container.appendChild(panel);
    },
    
    updateCreaturesList() {
        const panel = document.getElementById('battleCreaturesPanel');
        const listDiv = document.getElementById('creaturesList');
        
        if (!panel || !listDiv) return;
        
        if (this.activeCreatures.length === 0) {
            panel.style.display = 'none';
            return;
        }
        
        panel.style.display = 'block';
        
        let html = '';
        this.activeCreatures.forEach(creature => {
            const isDead = creature.currentHp <= 0;
            const hpPercent = isDead ? 0 : (creature.currentHp / creature.maxHp) * 100;
            const hpColor = hpPercent > 50 ? '#00aa00' : (hpPercent > 20 ? '#aaaa00' : '#aa0000');
            
            html += `
                <div style="background: ${isDead ? '#330000' : '#1a0f0b'}; margin-bottom: 10px; padding: 10px; border-radius: 4px; border: 1px solid #8b4513; cursor: pointer; ${isDead ? 'opacity: 0.7;' : ''}" 
                     onclick="BattleModule.selectCreatureById('${creature.id}')"
                     ondblclick="BattleModule.openCreaturePanel('${creature.id}')">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 24px; ${isDead ? 'filter: grayscale(100%);' : ''}">${creature.icon}</span>
                        <div style="flex: 1;">
                            <div style="font-weight: bold; color: ${isDead ? '#aaaaaa' : '#d4af37'};">
                                ${creature.name} ${isDead ? '💀' : ''}
                            </div>
                            <div style="font-size: 12px; color: ${isDead ? '#888888' : '#e0d0c0'};">
                                HP: ${creature.currentHp}/${creature.maxHp} | Иниц: ${creature.currentInitiative}
                            </div>
                            ${!isDead ? `
                                <div style="height: 4px; background: #330000; margin-top: 5px;">
                                    <div style="height: 4px; width: ${hpPercent}%; background: ${hpColor};"></div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
        
        listDiv.innerHTML = html;
    },
    
    selectCreatureById(id) {
        const creature = this.activeCreatures.find(c => c.id === id);
        if (creature && creature.position) {
            const hex = this.hexes.find(h => h.col === creature.position.col && h.row === creature.position.row);
            if (hex) {
                this.selectHex(hex);
            }
        }
    },
    
    placeOnHex(hex) {
        if (this.currentType === 'creature') {
            if (!hex.object && !hex.creature) {
                const creatureData = CreaturesDB.createForBattle(this.currentCreature);
                if (creatureData) {
                    const creatureId = `${this.currentCreature}_${Date.now()}`;
                    creatureData.id = creatureId;
                    creatureData.templateId = this.currentCreature;
                    creatureData.position = { col: hex.col, row: hex.row };
                    
                    this.activeCreatures.push(creatureData);
                    
                    hex.creature = this.currentCreature;
                    hex.creatureId = creatureId;
                    hex.occupied = true;
                    
                    this.updateCreaturesList();
                    this.updateTurnOrder();
                }
            } else {
                alert('На этом гексе уже есть что-то!');
                return;
            }
        } else {
            if (!hex.creature && !hex.object) {
                hex.object = this.currentObject;
            } else {
                alert('На этом гексе уже есть что-то!');
                return;
            }
        }
        
        this.drawGrid();
        this.highlightSelected();
        this.updateHexInfo(hex);
    },
    
    eraseHex(hex) {
        if (hex.creatureId) {
            this.activeCreatures = this.activeCreatures.filter(c => c.id !== hex.creatureId);
        }
        
        hex.creature = null;
        hex.creatureId = null;
        hex.object = null;
        
        this.drawGrid();
        this.highlightSelected();
        this.updateHexInfo(hex);
        
        this.updateCreaturesList();
        this.updateTurnOrder();
        
        const panel = document.getElementById('creaturePanel');
        if (panel) panel.remove();
    },
    
    setType(type) {
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
    },
    
    togglePlacementMode() {
        this.placementMode = !this.placementMode;
        if (this.placementMode) {
            this.eraseMode = false;
            this.moveModeActive = false;
        }
        this.updateModeButtons();
    },
    
    toggleEraseMode() {
        this.eraseMode = !this.eraseMode;
        if (this.eraseMode) {
            this.placementMode = false;
            this.moveModeActive = false;
        }
        this.updateModeButtons();
    },
    
    updateModeButtons() {
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
    },
    
    updateHexInfo(hex) {
        const info = document.getElementById('hexInfo');
        if (info) {
            let creatureText = 'пусто';
            let objectText = 'пусто';
            
            if (hex.creature) {
                const creature = this.creatures.find(c => c.id === hex.creature);
                creatureText = creature ? creature.name : 'неизвестно';
            }
            
            if (hex.object) {
                const object = this.objects.find(o => o.id === hex.object);
                objectText = object ? object.name : 'неизвестно';
            }
            
            info.innerHTML = `Гекс: ряд ${hex.row + 1}, колонка ${hex.col + 1}<br>👤 Существо: ${creatureText}<br>🌲 Объект: ${objectText}`;
        }
    },
    
    zoom(factor, mouseX, mouseY) {
        const oldScale = this.scale;
        this.scale *= factor;
        this.scale = Math.min(Math.max(this.scale, 0.3), 5);
        
        const worldX = (mouseX - this.offsetX) / oldScale;
        const worldY = (mouseY - this.offsetY) / oldScale;
        
        this.offsetX = mouseX - worldX * this.scale;
        this.offsetY = mouseY - worldY * this.scale;
        
        this.drawGrid();
        this.highlightSelected();
        this.updateZoomDisplay();
    },
    
    zoomIn() {
        this.zoom(1.1, this.canvas.width / 2, this.canvas.height / 2);
    },
    
    zoomOut() {
        this.zoom(0.9, this.canvas.width / 2, this.canvas.height / 2);
    },
    
    resetView() {
        this.scale = 1;
        this.offsetX = 500;
        this.offsetY = 300;
        this.drawGrid();
        this.highlightSelected();
        this.updateZoomDisplay();
    },
    
    updateZoomDisplay() {
        const zoomLevel = document.getElementById('battleZoomLevel');
        if (zoomLevel) {
            zoomLevel.textContent = Math.round(this.scale * 100) + '%';
        }
    },
    
    findHexByPosition(px, py) {
        let closestHex = null;
        let minDist = this.hexSize;
        
        this.hexes.forEach(hex => {
            const dx = px - hex.x;
            const dy = py - hex.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < minDist) {
                minDist = dist;
                closestHex = hex;
            }
        });
        
        return closestHex;
    },
    
    highlightHex(hex, isHover = false) {
        this.ctx.save();
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.scale, this.scale);
        
        this.ctx.strokeStyle = isHover ? '#ffd700' : this.highlightColor;
        this.ctx.lineWidth = (isHover ? 3 : 4) / this.scale;
        
        this.drawHexagon(hex.x, hex.y, true);
        
        this.ctx.restore();
    },
    
    highlightSelected() {
        if (this.selectedHex) {
            this.highlightHex(this.selectedHex);
        }
    },
    
    selectHex(hex) {
        this.selectedHex = hex;
        this.drawGrid();
        this.highlightSelected();
        this.updateHexInfo(hex);
    },
    
    setHexSize(size) {
        this.hexSize = parseInt(size);
        document.getElementById('hexSizeValue').textContent = size;
        this.generateHexGrid(this.cols, this.rows);
        this.drawGrid();
        this.highlightSelected();
    },
    
    setGridSize(size) {
        size = parseInt(size);
        this.cols = size;
        this.rows = size;
        this.generateHexGrid(this.cols, this.rows);
        this.drawGrid();
        this.highlightSelected();
        
        if (this.selectedHex) {
            this.updateHexInfo(this.selectedHex);
        }
    },
    
    createControls() {
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
    }
};

document.addEventListener('DOMContentLoaded', () => BattleModule.init());
