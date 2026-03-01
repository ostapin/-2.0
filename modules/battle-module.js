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
    
    // Новое: существа
    creatures: {
        'human': { name: '👤 Человек', color: '#4a7a9c', icon: '👤' },
        'wolf': { name: '🐺 Волк', color: '#7c7c7c', icon: '🐺' },
        'bear': { name: '🐻 Медведь', color: '#8b5a2b', icon: '🐻' },
        'goblin': { name: '👺 Гоблин', color: '#2d5a27', icon: '👺' },
        'orc': { name: '👹 Орк', color: '#4a2d1a', icon: '👹' },
        'dragon': { name: '🐉 Дракон', color: '#b31e1e', icon: '🐉' }
    },
    currentCreature: 'human',  // выбранное существо
    placementMode: false,      // режим расстановки
    
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
                    creature: null  // существо на гексе
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
    
    // Новое: рисование существа
    drawCreature(hex) {
        const creature = this.creatures[hex.creature];
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
                if (this.placementMode) {
                    // Режим расстановки - ставим существо
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
    
    // Новое: создание панели управления существами
    createControls() {
        const panel = document.querySelector('#battle-tab .btn-roll')?.parentNode;
        if (!panel) return;
        
        // Добавляем кнопки существ после существующих кнопок
        const creatureDiv = document.createElement('div');
        creatureDiv.style.marginTop = '10px';
        creatureDiv.style.padding = '10px';
        creatureDiv.style.background = '#2a1a0f';
        creatureDiv.style.borderRadius = '8px';
        creatureDiv.style.border = '1px solid #8b4513';
        
        const title = document.createElement('div');
        title.style.color = '#d4af37';
        title.style.marginBottom = '10px';
        title.innerHTML = '🐾 Существа:';
        creatureDiv.appendChild(title);
        
        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.display = 'flex';
        buttonsDiv.style.gap = '10px';
        buttonsDiv.style.flexWrap = 'wrap';
        buttonsDiv.style.justifyContent = 'center';
        
        // Кнопки для каждого существа
        Object.keys(this.creatures).forEach(key => {
            const creature = this.creatures[key];
            const btn = document.createElement('button');
            btn.className = 'btn btn-roll';
            btn.innerHTML = `${creature.icon} ${creature.name}`;
            btn.style.background = this.currentCreature === key ? '#8b4513' : '';
            btn.onclick = () => this.selectCreature(key);
            buttonsDiv.appendChild(btn);
        });
        
        // Кнопка режима расстановки
        const modeBtn = document.createElement('button');
        modeBtn.className = 'btn btn-plus';
        modeBtn.id = 'placementModeBtn';
        modeBtn.innerHTML = '📌 Режим расстановки: ВЫКЛ';
        modeBtn.style.marginLeft = '10px';
        modeBtn.onclick = () => this.togglePlacementMode();
        
        // Кнопка очистки гекса
        const clearBtn = document.createElement('button');
        clearBtn.className = 'btn btn-minus';
        clearBtn.innerHTML = '🧹 Очистить гекс';
        clearBtn.onclick = () => this.clearSelectedHex();
        
        creatureDiv.appendChild(buttonsDiv);
        
        const bottomDiv = document.createElement('div');
        bottomDiv.style.marginTop = '10px';
        bottomDiv.style.display = 'flex';
        bottomDiv.style.gap = '10px';
        bottomDiv.style.justifyContent = 'center';
        bottomDiv.appendChild(modeBtn);
        bottomDiv.appendChild(clearBtn);
        
        creatureDiv.appendChild(bottomDiv);
        panel.appendChild(creatureDiv);
    },
    
    // Новое: выбор существа
    selectCreature(key) {
        this.currentCreature = key;
        console.log('Выбрано существо:', this.creatures[key].name);
        
        // Подсвечиваем выбранную кнопку
        const buttons = document.querySelectorAll('#battle-tab .btn-roll');
        buttons.forEach(btn => {
            if (btn.innerHTML.includes(this.creatures[key].icon)) {
                btn.style.background = '#8b4513';
            } else if (btn.innerHTML.includes('👤') || btn.innerHTML.includes('🐺') || 
                       btn.innerHTML.includes('🐻') || btn.innerHTML.includes('👺') ||
                       btn.innerHTML.includes('👹') || btn.innerHTML.includes('🐉')) {
                btn.style.background = '';
            }
        });
    },
    
    // Новое: переключение режима расстановки
    togglePlacementMode() {
        this.placementMode = !this.placementMode;
        const btn = document.getElementById('placementModeBtn');
        if (btn) {
            btn.innerHTML = this.placementMode ? '📌 Режим расстановки: ВКЛ' : '📌 Режим расстановки: ВЫКЛ';
            btn.style.background = this.placementMode ? '#5a9c4a' : '';
        }
    },
    
    // Новое: размещение существа
    placeCreature(hex) {
        if (hex.creature === this.currentCreature) {
            // Если то же существо - убираем
            hex.creature = null;
            hex.occupied = false;
        } else {
            // Ставим новое
            hex.creature = this.currentCreature;
            hex.occupied = true;
        }
        
        this.drawGrid();
        this.highlightSelected();
        
        const info = document.getElementById('hexInfo');
        if (info) {
            const creature = hex.creature ? this.creatures[hex.creature].name : 'пусто';
            info.innerHTML = `Гекс: ряд ${hex.row + 1}, колонка ${hex.col + 1}<br>Существо: ${creature}`;
        }
    },
    
    // Новое: очистка выбранного гекса
    clearSelectedHex() {
        if (this.selectedHex) {
            this.selectedHex.creature = null;
            this.selectedHex.occupied = false;
            this.drawGrid();
            this.highlightSelected();
            
            const info = document.getElementById('hexInfo');
            if (info) {
                info.innerHTML = `Гекс: ряд ${this.selectedHex.row + 1}, колонка ${this.selectedHex.col + 1}<br>Существо: пусто`;
            }
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
        
        const info = document.getElementById('hexInfo');
        if (info) {
            const creature = hex.creature ? this.creatures[hex.creature].name : 'пусто';
            info.innerHTML = `Гекс: ряд ${hex.row + 1}, колонка ${hex.col + 1} (из ${this.rows}x${this.cols})<br>Существо: ${creature}`;
        }
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
        
        const info = document.getElementById('hexInfo');
        if (info && this.selectedHex) {
            const creature = this.selectedHex.creature ? this.creatures[this.selectedHex.creature].name : 'пусто';
            info.innerHTML = `Гекс: ряд ${this.selectedHex.row + 1}, колонка ${this.selectedHex.col + 1} (из ${this.rows}x${this.cols})<br>Существо: ${creature}`;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => BattleModule.init());
