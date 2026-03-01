// modules/battle-module.js (обновленная версия с окном характеристик)

const BattleModule = {
    canvas: null,
    ctx: null,
    hexSize: 40,
    gridColor: '#8b4513',
    highlightColor: '#d4af37',
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
    activeCreatures: [], // массив существ, которые сейчас на поле
    
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
                    creatureId: null, // ID существа из activeCreatures
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
        
        // Рисуем гексы
        this.ctx.strokeStyle = this.gridColor;
        this.ctx.lineWidth = 2 / this.scale;
        this.ctx.fillStyle = '#2a1a0f';
        
        this.hexes.forEach(hex => {
            this.drawHexagon(hex.x, hex.y, false);
        });
        
        this.ctx.strokeStyle = this.gridColor;
        this.ctx.lineWidth = 2 / this.scale;
        this.hexes.forEach(hex => {
            this.drawHexagon(hex.x, hex.y, true);
        });
        
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
        
        // Заливка цветом существа
        this.ctx.fillStyle = creature.color;
        this.ctx.globalAlpha = 0.7;
        this.drawHexagon(hex.x, hex.y, false);
        this.ctx.globalAlpha = 1;
        
        // Иконка
        this.ctx.font = `${this.hexSize * 1.2}px Arial`;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(creature.icon, hex.x, hex.y);
        
        // Полоска HP (если есть данные из БД)
        if (hex.creatureId) {
            const creatureData = this.activeCreatures.find(c => c.id === hex.creatureId);
            if (creatureData) {
                const hpPercent = creatureData.currentHp / creatureData.maxHp;
                const barWidth = this.hexSize * 1.5;
                const barHeight = 4;
                const barX = hex.x - barWidth/2;
                const barY = hex.y - this.hexSize * 0.8;
                
                // Фон полоски
                this.ctx.fillStyle = '#330000';
                this.ctx.fillRect(barX, barY, barWidth, barHeight);
                
                // Текущее HP
                this.ctx.fillStyle = hpPercent > 0.5 ? '#00aa00' : (hpPercent > 0.2 ? '#aaaa00' : '#aa0000');
                this.ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);
            }
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
        
        // Обработка клика
        this.canvas.addEventListener('click', (e) => {
            if (this.isDragging) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left - this.offsetX) / this.scale;
            const y = (e.clientY - rect.top - this.offsetY) / this.scale;
            
            const hex = this.findHexByPosition(x, y);
            if (hex) {
                if (this.eraseMode) {
                    this.eraseHex(hex);
                } else if (this.placementMode) {
                    this.placeOnHex(hex);
                } else {
                    this.selectHex(hex);
                }
            }
        });
        
        // Двойной клик - открытие окна характеристик
        this.canvas.addEventListener('dblclick', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left - this.offsetX) / this.scale;
            const y = (e.clientY - rect.top - this.offsetY) / this.scale;
            
            const hex = this.findHexByPosition(x, y);
            if (hex && hex.creatureId) {
                this.openCreatureWindow(hex.creatureId);
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
    
    // Создание боковой панели со списком существ
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
        `;
        
        panel.innerHTML = `
            <h3 style="color: #d4af37; margin-bottom: 15px; text-align: center;">👥 Существа на поле</h3>
            <div id="creaturesList" style="min-height: 100px;">
                <p style="color: #8b7d6b; text-align: center;">Пока нет существ</p>
            </div>
        `;
        
        container.appendChild(panel);
    },
    
    // Обновление списка существ
    updateCreaturesList() {
        const listDiv = document.getElementById('creaturesList');
        if (!listDiv) return;
        
        if (this.activeCreatures.length === 0) {
            listDiv.innerHTML = '<p style="color: #8b7d6b; text-align: center;">Пока нет существ</p>';
            return;
        }
        
        let html = '';
        this.activeCreatures.forEach(creature => {
            const hpPercent = (creature.currentHp / creature.maxHp) * 100;
            const hpColor = hpPercent > 50 ? '#00aa00' : (hpPercent > 20 ? '#aaaa00' : '#aa0000');
            
            html += `
                <div style="background: #1a0f0b; margin-bottom: 10px; padding: 10px; border-radius: 4px; border: 1px solid #8b4513; cursor: pointer;" 
                     onclick="BattleModule.selectCreatureById('${creature.id}')"
                     ondblclick="BattleModule.openCreatureWindow('${creature.id}')">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 24px;">${creature.icon}</span>
                        <div style="flex: 1;">
                            <div style="font-weight: bold; color: #d4af37;">${creature.name}</div>
                            <div style="font-size: 12px;">HP: ${creature.currentHp}/${creature.maxHp}</div>
                            <div style="height: 4px; background: #330000; margin-top: 5px;">
                                <div style="height: 4px; width: ${hpPercent}%; background: ${hpColor};"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        listDiv.innerHTML = html;
    },
    
    // Выбор существа по ID
    selectCreatureById(id) {
        const creature = this.activeCreatures.find(c => c.id === id);
        if (creature && creature.position) {
            const hex = this.hexes.find(h => h.col === creature.position.col && h.row === creature.position.row);
            if (hex) {
                this.selectHex(hex);
            }
        }
    },
    
    // Открытие окна характеристик
    openCreatureWindow(creatureId) {
        const creature = this.activeCreatures.find(c => c.id === creatureId);
        if (!creature) return;
        
        // Убираем предыдущее окно если было
        const oldWindow = document.getElementById('creatureWindow');
        if (oldWindow) oldWindow.remove();
        
        // Создаем окно
        const window = document.createElement('div');
        window.id = 'creatureWindow';
        window.style.cssText = `
            position: fixed;
            left: 300px;
            top: 200px;
            width: 300px;
            background: #3d2418;
            border: 3px solid #d4af37;
            border-radius: 10px;
            padding: 20px;
            color: #e0d0c0;
            z-index: 1001;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        `;
        
        const hpPercent = (creature.currentHp / creature.maxHp) * 100;
        
        window.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h2 style="color: #d4af37; margin: 0;">${creature.icon} ${creature.name}</h2>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #d4af37; font-size: 20px; cursor: pointer;">✖</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>❤️ Здоровье:</span>
                    <span>${creature.currentHp} / ${creature.maxHp}</span>
                </div>
                <div style="height: 20px; background: #1a0f0b; border-radius: 10px; overflow: hidden;">
                    <div style="height: 20px; width: ${hpPercent}%; background: ${hpPercent > 50 ? '#00aa00' : (hpPercent > 20 ? '#aaaa00' : '#aa0000')};"></div>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <button class="btn btn-minus" style="flex: 1;" onclick="BattleModule.damageCreature('${creature.id}', 5)">-5 HP</button>
                <button class="btn btn-plus" style="flex: 1;" onclick="BattleModule.healCreature('${creature.id}', 5)">+5 HP</button>
            </div>
            
            <div style="display: flex; gap: 10px;">
                <input type="number" id="damageAmount" value="10" min="1" style="flex: 1; padding: 5px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513;">
                <button class="btn btn-minus" onclick="BattleModule.damageCreature('${creature.id}', document.getElementById('damageAmount').value)">Нанести урон</button>
            </div>
            
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #8b4513;">
                <div>🛡️ Класс брони: ${creature.ac || 12}</div>
                <div>⚡ Скорость: ${creature.speed || 6} гексов</div>
            </div>
        `;
        
        document.body.appendChild(window);
    },
    
    // Нанесение урона
    damageCreature(creatureId, amount) {
        amount = parseInt(amount) || 0;
        const creature = this.activeCreatures.find(c => c.id === creatureId);
        if (!creature) return;
        
        creature.currentHp = Math.max(0, creature.currentHp - amount);
        
        if (creature.currentHp === 0) {
            // Существо умерло - убираем с карты
            const hex = this.hexes.find(h => h.creatureId === creatureId);
            if (hex) {
                hex.creature = null;
                hex.creatureId = null;
                hex.occupied = false;
            }
            this.activeCreatures = this.activeCreatures.filter(c => c.id !== creatureId);
            
            // Закрываем окно
            const window = document.getElementById('creatureWindow');
            if (window) window.remove();
        }
        
        this.drawGrid();
        this.updateCreaturesList();
        
        // Обновляем окно если открыто
        this.openCreatureWindow(creatureId);
    },
    
    // Лечение
    healCreature(creatureId, amount) {
        amount = parseInt(amount) || 0;
        const creature = this.activeCreatures.find(c => c.id === creatureId);
        if (!creature) return;
        
        creature.currentHp = Math.min(creature.maxHp, creature.currentHp + amount);
        
        this.drawGrid();
        this.updateCreaturesList();
        this.openCreatureWindow(creatureId);
    },
    
    placeOnHex(hex) {
        if (this.currentType === 'creature') {
            if (!hex.object) {
                // Создаем существо из базы данных
                const creatureData = CreaturesDB.createForBattle(this.currentCreature);
                if (creatureData) {
                    const creatureId = `${this.currentCreature}_${Date.now()}`;
                    creatureData.id = creatureId;
                    creatureData.position = { col: hex.col, row: hex.row };
                    
                    this.activeCreatures.push(creatureData);
                    
                    hex.creature = this.currentCreature;
                    hex.creatureId = creatureId;
                    hex.occupied = true;
                }
            } else {
                alert('На этом гексе уже есть объект!');
                return;
            }
        } else {
            if (!hex.creature) {
                hex.object = this.currentObject;
            } else {
                alert('На этом гексе уже есть существо!');
                return;
            }
        }
        
        this.drawGrid();
        this.highlightSelected();
        this.updateHexInfo(hex);
        this.updateCreaturesList();
    },
    
    eraseHex(hex) {
        if (hex.creatureId) {
            // Удаляем из activeCreatures
            this.activeCreatures = this.activeCreatures.filter(c => c.id !== hex.creatureId);
        }
        
        hex.creature = null;
        hex.creatureId = null;
        hex.object = null;
        
        this.drawGrid();
        this.highlightSelected();
        this.updateHexInfo(hex);
        this.updateCreaturesList();
        
        // Закрываем окно если было открыто для этого существа
        const window = document.getElementById('creatureWindow');
        if (window) window.remove();
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
        }
        this.updateModeButtons();
    },
    
    toggleEraseMode() {
        this.eraseMode = !this.eraseMode;
        if (this.eraseMode) {
            this.placementMode = false;
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
    
    // Добавляем метод createControls, который был потерян
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
