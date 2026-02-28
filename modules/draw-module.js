// Модуль рисовалки
const DrawModule = {
    canvas: null,
    ctx: null,
    drawing: false,
    currentTool: 'brush',
    currentColor: '#000000',
    currentSize: 5,
    drawings: {},
    gridEnabled: false,
    gridSize: 50,
    gridColor: '#cccccc',
    gridOpacity: 0.5,
    gridType: 'square',
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    
    init() {
        this.canvas = document.getElementById('drawCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        this.loadDrawings();
        this.bindEvents();
        this.addGridControls();
        this.addZoomControls();
        console.log('Draw module initialized');
    },
    
    bindEvents() {
        // Рисование
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseleave', () => this.stopDrawing());
        
        // Зум колесиком
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            this.zoom(delta, e.offsetX, e.offsetY);
        });
        
        // Перемещение (зажатый пробел или средняя кнопка)
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 1 || e.button === 0 && e.altKey) {
                this.isDragging = true;
                this.lastX = e.offsetX;
                this.lastY = e.offsetY;
                this.canvas.style.cursor = 'grabbing';
                e.preventDefault();
            }
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const dx = e.offsetX - this.lastX;
                const dy = e.offsetY - this.lastY;
                this.offsetX += dx;
                this.offsetY += dy;
                this.lastX = e.offsetX;
                this.lastY = e.offsetY;
                this.applyTransform();
            }
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            if (e.button === 1 || e.button === 0) {
                this.isDragging = false;
                this.canvas.style.cursor = 'crosshair';
            }
        });
        
        // Инструменты
        document.getElementById('drawBrush')?.addEventListener('click', () => this.setTool('brush'));
        document.getElementById('drawEraser')?.addEventListener('click', () => this.setTool('eraser'));
        document.getElementById('drawColor')?.addEventListener('input', (e) => this.setColor(e.target.value));
        document.getElementById('drawSize')?.addEventListener('input', (e) => this.setSize(e.target.value));
        document.getElementById('drawClear')?.addEventListener('click', () => this.clearCanvas());
        document.getElementById('drawSave')?.addEventListener('click', () => this.saveDrawing());
    },
    
    addGridControls() {
        const panel = document.querySelector('#draw-tab .btn-roll')?.parentNode;
        if (!panel) return;
        
        // Разделитель
        const separator = document.createElement('span');
        separator.innerHTML = ' | ';
        separator.style.color = '#8b4513';
        separator.style.fontWeight = 'bold';
        panel.appendChild(separator);
        
        // Кнопка сетки
        const gridBtn = document.createElement('button');
        gridBtn.className = 'btn btn-roll';
        gridBtn.id = 'drawGrid';
        gridBtn.innerHTML = '⬜ Сетка';
        gridBtn.style.padding = '5px 10px';
        gridBtn.onclick = () => this.toggleGrid();
        panel.appendChild(gridBtn);
        
        // Размер сетки
        const gridSizeInput = document.createElement('input');
        gridSizeInput.type = 'number';
        gridSizeInput.id = 'gridSize';
        gridSizeInput.value = this.gridSize;
        gridSizeInput.min = '5';
        gridSizeInput.max = '200';
        gridSizeInput.style.width = '60px';
        gridSizeInput.style.padding = '5px';
        gridSizeInput.style.background = '#1a0f0b';
        gridSizeInput.style.color = '#e0d0c0';
        gridSizeInput.style.border = '1px solid #8b4513';
        gridSizeInput.style.marginLeft = '5px';
        gridSizeInput.onchange = (e) => this.setGridSize(parseInt(e.target.value));
        panel.appendChild(gridSizeInput);
        
        // Цвет сетки
        const gridColorInput = document.createElement('input');
        gridColorInput.type = 'color';
        gridColorInput.id = 'gridColor';
        gridColorInput.value = this.gridColor;
        gridColorInput.style.width = '40px';
        gridColorInput.style.height = '30px';
        gridColorInput.style.marginLeft = '5px';
        gridColorInput.onchange = (e) => this.setGridColor(e.target.value);
        panel.appendChild(gridColorInput);
        
        // Прозрачность сетки
        const opacityInput = document.createElement('input');
        opacityInput.type = 'range';
        opacityInput.id = 'gridOpacity';
        opacityInput.min = '0';
        opacityInput.max = '1';
        opacityInput.step = '0.1';
        opacityInput.value = this.gridOpacity;
        opacityInput.style.width = '80px';
        opacityInput.style.marginLeft = '5px';
        opacityInput.oninput = (e) => this.setGridOpacity(parseFloat(e.target.value));
        panel.appendChild(opacityInput);
        
        // Тип сетки
        const gridTypeSelect = document.createElement('select');
        gridTypeSelect.id = 'gridType';
        gridTypeSelect.style.background = '#1a0f0b';
        gridTypeSelect.style.color = '#e0d0c0';
        gridTypeSelect.style.border = '1px solid #8b4513';
        gridTypeSelect.style.padding = '5px';
        gridTypeSelect.style.marginLeft = '5px';
        gridTypeSelect.onchange = (e) => this.setGridType(e.target.value);
        
        const optionSquare = document.createElement('option');
        optionSquare.value = 'square';
        optionSquare.text = 'Квадраты';
        gridTypeSelect.appendChild(optionSquare);
        
        const optionHex = document.createElement('option');
        optionHex.value = 'hex';
        optionHex.text = 'Гексы';
        gridTypeSelect.appendChild(optionHex);
        
        panel.appendChild(gridTypeSelect);
    },
    
    addZoomControls() {
        const panel = document.querySelector('#draw-tab .btn-roll')?.parentNode;
        if (!panel) return;
        
        // Разделитель
        const separator = document.createElement('span');
        separator.innerHTML = ' | ';
        separator.style.color = '#8b4513';
        separator.style.fontWeight = 'bold';
        panel.appendChild(separator);
        
        // Кнопки зума
        const zoomOutBtn = document.createElement('button');
        zoomOutBtn.className = 'btn btn-roll';
        zoomOutBtn.innerHTML = '🔍-';
        zoomOutBtn.style.padding = '5px 10px';
        zoomOutBtn.onclick = () => this.zoom(0.9);
        panel.appendChild(zoomOutBtn);
        
        const zoomInBtn = document.createElement('button');
        zoomInBtn.className = 'btn btn-roll';
        zoomInBtn.innerHTML = '🔍+';
        zoomInBtn.style.padding = '5px 10px';
        zoomInBtn.onclick = () => this.zoom(1.1);
        panel.appendChild(zoomInBtn);
        
        const resetBtn = document.createElement('button');
        resetBtn.className = 'btn btn-roll';
        resetBtn.innerHTML = '↺ Сброс';
        resetBtn.style.padding = '5px 10px';
        resetBtn.onclick = () => this.resetView();
        panel.appendChild(resetBtn);
    },
    
    zoom(factor, mouseX, mouseY) {
        const oldScale = this.scale;
        this.scale *= factor;
        this.scale = Math.min(Math.max(this.scale, 0.1), 5);
        
        // Корректируем offset, чтобы зум был относительно мыши
        if (mouseX !== undefined && mouseY !== undefined) {
            const dx = mouseX - this.offsetX;
            const dy = mouseY - this.offsetY;
            this.offsetX = mouseX - dx * (this.scale / oldScale);
            this.offsetY = mouseY - dy * (this.scale / oldScale);
        }
        
        this.applyTransform();
    },
    
    resetView() {
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.applyTransform();
    },
    
    applyTransform() {
        this.canvas.style.transform = `scale(${this.scale}) translate(${this.offsetX / this.scale}px, ${this.offsetY / this.scale}px)`;
        this.canvas.style.transformOrigin = '0 0';
    },
    
    toggleGrid() {
        this.gridEnabled = !this.gridEnabled;
        const btn = document.getElementById('drawGrid');
        if (btn) {
            btn.innerHTML = this.gridEnabled ? '🔲 Сетка' : '⬜ Сетка';
        }
        this.redrawWithGrid();
    },
    
    setGridSize(size) {
        if (size < 5) size = 5;
        if (size > 200) size = 200;
        this.gridSize = size;
        document.getElementById('gridSize').value = size;
        if (this.gridEnabled) {
            this.redrawWithGrid();
        }
    },
    
    setGridColor(color) {
        this.gridColor = color;
        if (this.gridEnabled) {
            this.redrawWithGrid();
        }
    },
    
    setGridOpacity(opacity) {
        this.gridOpacity = opacity;
        if (this.gridEnabled) {
            this.redrawWithGrid();
        }
    },
    
    setGridType(type) {
        this.gridType = type;
        if (this.gridEnabled) {
            this.redrawWithGrid();
        }
    },
    
    drawGrid() {
        if (!this.gridEnabled) return;
        
        this.ctx.save();
        this.ctx.strokeStyle = this.gridColor;
        this.ctx.lineWidth = 0.5;
        this.ctx.globalAlpha = this.gridOpacity;
        
        if (this.gridType === 'square') {
            this.drawSquareGrid();
        } else {
            this.drawHexGrid();
        }
        
        this.ctx.restore();
    },
    
    drawSquareGrid() {
        for (let x = 0; x <= this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    },
    
    drawHexGrid() {
        const hexWidth = this.gridSize * 1.5;
        const hexHeight = this.gridSize * 1.732; // √3 * размер
        
        // Рассчитываем количество рядов, чтобы покрыть весь холст
        const cols = Math.ceil(this.canvas.width / hexWidth) + 2;
        const rows = Math.ceil(this.canvas.height / (hexHeight * 0.75)) + 2;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // Смещение для четных/нечетных рядов
                const xOffset = (row % 2) * hexWidth / 2;
                const x = col * hexWidth + xOffset - hexWidth;
                const y = row * (hexHeight * 0.75) - hexHeight * 0.5;
                
                this.drawHexagon(x + this.gridSize/2, y + this.gridSize/2, this.gridSize / 1.5);
            }
        }
    },
    
    drawHexagon(x, y, size) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3;
            const hx = x + size * Math.cos(angle);
            const hy = y + size * Math.sin(angle);
            
            if (i === 0) {
                this.ctx.moveTo(hx, hy);
            } else {
                this.ctx.lineTo(hx, hy);
            }
        }
        this.ctx.closePath();
        this.ctx.stroke();
    },
    
    redrawWithGrid() {
        // Сохраняем текущее изображение
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        
        // Полностью очищаем холст
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Восстанавливаем рисунок
        this.ctx.putImageData(imageData, 0, 0);
        
        // Рисуем сетку поверх
        this.drawGrid();
    },
    
    startDrawing(e) {
        this.drawing = true;
        this.ctx.beginPath();
        this.ctx.moveTo(e.offsetX, e.offsetY);
    },
    
    draw(e) {
        if (!this.drawing) return;
        
        this.ctx.strokeStyle = this.currentTool === 'eraser' ? '#ffffff' : this.currentColor;
        this.ctx.lineWidth = this.currentSize;
        this.ctx.lineTo(e.offsetX, e.offsetY);
        this.ctx.stroke();
    },
    
    stopDrawing() {
        this.drawing = false;
        if (this.gridEnabled) {
            this.redrawWithGrid();
        }
    },
    
    setTool(tool) {
        this.currentTool = tool;
    },
    
    setColor(color) {
        this.currentColor = color;
    },
    
    setSize(size) {
        this.currentSize = size;
        document.getElementById('drawSizeValue').textContent = size;
    },
    
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.gridEnabled) {
            this.drawGrid();
        }
    },
    
    saveDrawing() {
        const name = prompt('Введите название рисунка:');
        if (!name) return;
        
        const data = this.canvas.toDataURL();
        this.drawings[name] = data;
        localStorage.setItem('dndDrawings', JSON.stringify(this.drawings));
        this.updateDrawingsList();
    },
    
    loadDrawings() {
        const saved = localStorage.getItem('dndDrawings');
        if (saved) {
            this.drawings = JSON.parse(saved);
            this.updateDrawingsList();
        }
    },
    
    updateDrawingsList() {
        const list = document.getElementById('drawList');
        if (!list) return;
        
        const names = Object.keys(this.drawings);
        if (names.length === 0) {
            list.innerHTML = '<p style="color: #8b7d6b;">Пока нет сохраненных рисунков</p>';
            return;
        }
        
        list.innerHTML = names.map(name => `
            <div style="background: #1a0f0b; padding: 10px; border-radius: 4px; border: 1px solid #8b4513;">
                <span style="color: #e0d0c0;">📄 ${name}</span>
                <button class="btn btn-small" onclick="DrawModule.loadDrawing('${name}')">📂</button>
                <button class="btn btn-small" onclick="DrawModule.deleteDrawing('${name}')">🗑️</button>
            </div>
        `).join('');
    },
    
    loadDrawing(name) {
        const img = new Image();
        img.src = this.drawings[name];
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0);
            if (this.gridEnabled) {
                this.drawGrid();
            }
        };
    },
    
    deleteDrawing(name) {
        if (confirm(`Удалить рисунок "${name}"?`)) {
            delete this.drawings[name];
            localStorage.setItem('dndDrawings', JSON.stringify(this.drawings));
            this.updateDrawingsList();
        }
    }
};

// Инициализация после загрузки страницы
document.addEventListener('DOMContentLoaded', () => DrawModule.init());
