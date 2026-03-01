// modules/battle-module.js
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
    
    // Существа
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
    currentCreature: 'human',
    placementMode: false,
    eraseMode: false,     // режим удаления
    
    init() {
        this.canvas = document.getElementById('battleCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.generateHexGrid(this.cols, this.rows);
        this.drawGrid();
        this.bindEvents();
        this.createControls();
        
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
                    creature: null
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
                if (this.eraseMode) {
                    // Режим удаления
                    this.eraseCreature(hex);
                } else if (this.placementMode) {
                    // Режим расстановки
                    this.placeCreature(hex);
                } else {
                    // Обычный режим - выбираем гекс
                    this.selectHex(hex);
                }
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
    
    createControls() {
        const panel = document.querySelector('#battle-tab .btn-roll')?.parentNode;
        if (!panel) return;
        
        // Контейнер для управления существами
        const creatureDiv = document.createElement('div');
        creatureDiv.style.marginTop = '15px';
        creatureDiv.style.padding = '15px';
        creatureDiv.style.background = '#2a1a0f';
        creatureDiv.style.borderRadius = '8px';
        creatureDiv.style.border = '1px solid #8b4513';
        
        const title = document.createElement('div');
        title.style.color = '#d4af37';
        title.style.marginBottom = '15px';
        title.style.fontSize = '1.2em';
        title.innerHTML = '🐾 УПРАВЛЕНИЕ СУЩЕСТВАМИ';
        creatureDiv.appendChild(title);
        
        // Верхний ряд кнопок режимов
        const modeRow = document.createElement('div');
        modeRow.style.display = 'flex';
        modeRow.style.gap = '10px';
        modeRow.style.marginBottom = '15px';
        modeRow.style.justifyContent = 'center';
        
        // Кнопка режима расстановки
        const placeBtn = document.createElement('button');
        placeBtn.className = 'btn btn-plus';
        placeBtn.id = 'placementModeBtn';
        placeBtn.innerHTML = '📌 РЕЖИМ: ВЫКЛ';
        placeBtn.style.flex = '1';
        placeBtn.onclick = () => this.togglePlacementMode();
        modeRow.appendChild(placeBtn);
        
        // Кнопка режима удаления
        const eraseBtn = document.createElement('button');
        eraseBtn.className = 'btn btn-minus';
        eraseBtn.id = 'eraseModeBtn';
        eraseBtn.innerHTML = '🧹 УДАЛЕНИЕ: ВЫКЛ';
        eraseBtn.style.flex = '1';
        eraseBtn.onclick = () => this.toggleEraseMode();
        modeRow.appendChild(eraseBtn);
        
        creatureDiv.appendChild(modeRow);
        
        // Выпадающий список существ
        const selectRow = document.createElement('div');
        selectRow.style.display = 'flex';
        selectRow.style.gap = '10px';
        selectRow.style.alignItems = 'center';
        selectRow.style.marginBottom = '10px';
        
        const selectLabel = document.createElement('span');
        selectLabel.style.color = '#e0d0c0';
        selectLabel.innerHTML = 'Выбрать существо:';
        selectRow.appendChild(selectLabel);
        
        const select = document.createElement('select');
        select.id = 'creatureSelect';
        select.style.flex = '2';
        select.style.padding = '8px';
        select.style.background = '#1a0f0b';
        select.style.color = '#e0d0c0';
        select.style.border = '2px solid #8b4513';
        select.style.borderRadius = '4px';
        
        this.creatures.forEach(creature => {
            const option = document.createElement('option');
            option.value = creature.id;
            option.innerHTML = `${creature.icon} ${creature.name}`;
            select.appendChild(option);
        });
        
        select.onchange = (e) => this.selectCreature(e.target.value);
        selectRow.appendChild(select);
        creatureDiv.appendChild(selectRow);
        
        // Информация о режимах
        const infoRow = document.createElement('div');
        infoRow.style.marginTop = '10px';
        infoRow.style.padding = '8px';
        infoRow.style.background = '#1a0f0b';
        infoRow.style.borderRadius = '4px';
        infoRow.style.color = '#b89a7a';
        infoRow.style.fontSize = '0.9em';
        infoRow.style.textAlign = 'center';
        infoRow.innerHTML = '💡 Режим расстановки: клик по гексу ставит существо<br>💡 Режим удаления: клик по гексу убирает существо';
        
        creatureDiv.appendChild(infoRow);
        panel.appendChild(creatureDiv);
    },
    
    selectCreature(id) {
        this.currentCreature = id;
        console.log('Выбрано существо:', this.creatures.find(c => c.id === id).name);
    },
    
    togglePlacementMode() {
        this.placementMode = !this.placementMode;
        if (this.placementMode) {
            this.eraseMode = false; // выключаем удаление
        }
        this.updateModeButtons();
    },
    
    toggleEraseMode() {
        this.eraseMode = !this.eraseMode;
        if (this.eraseMode) {
            this.placementMode = false; // выключаем расстановку
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
    
    placeCreature(hex) {
        hex.creature = this.currentCreature;
        hex.occupied = true;
        
        this.drawGrid();
        this.highlightSelected();
        this.updateHexInfo(hex);
    },
    
    eraseCreature(hex) {
        if (hex.creature) {
            hex.creature = null;
            hex.occupied = false;
            
            this.drawGrid();
            this.highlightSelected();
            this.updateHexInfo(hex);
        }
    },
    
    updateHexInfo(hex) {
        const info = document.getElementById('hexInfo');
        if (info) {
            const creature = hex.creature ? this.creatures.find(c => c.id === hex.creature).name : 'пусто';
            info.innerHTML = `Гекс: ряд ${hex.row + 1}, колонка ${hex.col + 1}<br>Существо: ${creature}`;
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
    }
};

document.addEventListener('DOMContentLoaded', () => BattleModule.init());
