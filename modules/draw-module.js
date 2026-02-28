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
    brushColors: ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'],
    gridColors: ['#cccccc', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#888888', '#000000'],
    brushPickerOpen: false,
    gridPickerOpen: false,
    
    init() {
        this.canvas = document.getElementById('drawCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        this.loadDrawings();
        this.bindEvents();
        this.addControls();
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
        
        // Перемещение (Alt + ЛКМ или средняя кнопка)
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 1 || (e.button === 0 && e.altKey)) {
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
        document.getElementById('drawSize')?.addEventListener('input', (e) => this.setSize(e.target.value));
        document.getElementById('drawClear')?.addEventListener('click', () => this.clearCanvas());
        document.getElementById('drawSave')?.addEventListener('click', () => this.saveDrawing());
        
        // Закрытие палитр при клике вне их
        document.addEventListener('click', (e) => {
            if (this.brushPickerOpen && !e.target.closest('.brush-picker-container')) {
                this.closeBrushPicker();
            }
            if (this.gridPickerOpen && !e.target.closest('.grid-picker-container')) {
                this.closeGridPicker();
            }
        });
    },
    
    addControls() {
        const panel = document.querySelector('#draw-tab .btn-roll')?.parentNode;
        if (!panel) return;
        
        // Разделитель
        const separator = document.createElement('span');
        separator.innerHTML = ' | ';
        separator.style.color = '#8b4513';
        separator.style.fontWeight = 'bold';
        panel.appendChild(separator);
        
        // ===== КНОПКА ЦВЕТА КИСТИ =====
        const brushContainer = document.createElement('div');
        brushContainer.className = 'brush-picker-container';
        brushContainer.style.position = 'relative';
        brushContainer.style.display = 'inline-block';
        brushContainer.style.marginRight = '15px';
        
        // Кнопка текущего цвета кисти
        const brushColorBtn = document.createElement('button');
        brushColorBtn.id = 'brushColorBtn';
        brushColorBtn.style.width = '40px';
        brushColorBtn.style.height = '40px';
        brushColorBtn.style.backgroundColor = this.currentColor;
        brushColorBtn.style.border = '2px solid #8b4513';
        brushColorBtn.style.borderRadius = '4px';
        brushColorBtn.style.cursor = 'pointer';
        brushColorBtn.style.verticalAlign = 'middle';
        brushColorBtn.title = 'Цвет кисти';
        brushColorBtn.onclick = () => this.toggleBrushPicker();
        brushContainer.appendChild(brushColorBtn);
        
        // Пипетка для кисти
        if (window.EyeDropper) {
            const eyeDropperBtn = document.createElement('button');
            eyeDropperBtn.className = 'btn btn-roll';
            eyeDropperBtn.innerHTML = '👁️';
            eyeDropperBtn.style.padding = '5px 10px';
            eyeDropperBtn.style.marginLeft = '5px';
            eyeDropperBtn.title = 'Пипетка';
            eyeDropperBtn.onclick = () => this.useEyeDropper();
            brushContainer.appendChild(eyeDropperBtn);
        }
        
        panel.appendChild(brushContainer);
        
        // ===== КНОПКА ЦВЕТА СЕТКИ =====
        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid-picker-container';
        gridContainer.style.position = 'relative';
        gridContainer.style.display = 'inline-block';
        gridContainer.style.marginRight = '15px';
        
        // Кнопка текущего цвета сетки
        const gridColorBtn = document.createElement('button');
        gridColorBtn.id = 'gridColorBtn';
        gridColorBtn.style.width = '40px';
        gridColorBtn.style.height = '40px';
        gridColorBtn.style.backgroundColor = this.gridColor;
        gridColorBtn.style.border = '2px solid #8b4513';
        gridColorBtn.style.borderRadius = '4px';
        gridColorBtn.style.cursor = 'pointer';
        gridColorBtn.style.verticalAlign = 'middle';
        gridColorBtn.title = 'Цвет сетки';
        gridColorBtn.onclick = () => this.toggleGridPicker();
        gridContainer.appendChild(gridColorBtn);
        
        panel.appendChild(gridContainer);
        
        // ===== ОСТАЛЬНЫЕ КОНТРОЛЫ СЕТКИ =====
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
        
        // Прозрачность сетки
        const opacityLabel = document.createElement('span');
        opacityLabel.innerHTML = 'Прозр:';
        opacityLabel.style.color = '#e0d0c0';
        opacityLabel.style.marginLeft = '10px';
        panel.appendChild(opacityLabel);
        
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
        const typeLabel = document.createElement('span');
        typeLabel.innerHTML = 'Тип:';
        typeLabel.style.color = '#e0d0c0';
        typeLabel.style.marginLeft = '10px';
        panel.appendChild(typeLabel);
        
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
        
        // ===== КНОПКИ ЗУМА =====
        const zoomSeparator = document.createElement('span');
        zoomSeparator.innerHTML = ' | ';
        zoomSeparator.style.color = '#8b4513';
        zoomSeparator.style.fontWeight = 'bold';
        panel.appendChild(zoomSeparator);
        
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
        
        // Создаем палитры
        this.createBrushPalette(brushContainer);
        this.createGridPalette(gridContainer);
    },
    
    createBrushPalette(container) {
        const palette = document.createElement('div');
        palette.id = 'brushPalette';
        palette.style.position = 'absolute';
        palette.style.top = '45px';
        palette.style.left = '0';
        palette.style.backgroundColor = '#3d2418';
        palette.style.border = '2px solid #8b4513';
        palette.style.borderRadius = '8px';
        palette.style.padding = '15px';
        palette.style.zIndex = '1000';
        palette.style.display = 'none';
        palette.style.boxShadow = '0 5px 15px rgba(0,0,0,0.5)';
        
        // Заголовок
        const title = document.createElement('div');
        title.style.color = '#d4af37';
        title.style.marginBottom = '10px';
        title.style.textAlign = 'center';
        title.innerHTML = '🎨 Цвет кисти';
        palette.appendChild(title);
        
        // Сетка частых цветов
        const colorsGrid = document.createElement('div');
        colorsGrid.style.display = 'grid';
        colorsGrid.style.gridTemplateColumns = 'repeat(5, 40px)';
        colorsGrid.style.gap = '5px';
        colorsGrid.style.marginBottom = '15px';
        
        this.brushColors.forEach(color => {
            const colorSquare = document.createElement('div');
            colorSquare.style.width = '40px';
            colorSquare.style.height = '40px';
            colorSquare.style.backgroundColor = color;
            colorSquare.style.border = color === '#ffffff' ? '1px solid #8b4513' : 'none';
            colorSquare.style.borderRadius = '4px';
            colorSquare.style.cursor = 'pointer';
            colorSquare.onclick = () => {
                this.setColor(color);
                this.closeBrushPicker();
            };
            colorsGrid.appendChild(colorSquare);
        });
        
        palette.appendChild(colorsGrid);
        
        // Стандартный color picker
        const standardPicker = document.createElement('input');
        standardPicker.type = 'color';
        standardPicker.id = 'standardBrushPicker';
        standardPicker.value = this.currentColor;
        standardPicker.style.width = '100%';
        standardPicker.style.height = '40px';
        standardPicker.style.border = '1px solid #8b4513';
        standardPicker.style.borderRadius = '4px';
        standardPicker.onchange = (e) => {
            this.setColor(e.target.value);
            this.closeBrushPicker();
        };
        palette.appendChild(standardPicker);
        
        container.appendChild(palette);
    },
    
    createGridPalette(container) {
        const palette = document.createElement('div');
        palette.id = 'gridPalette';
        palette.style.position = 'absolute';
        palette.style.top = '45px';
        palette.style.left = '0';
        palette.style.backgroundColor = '#3d2418';
        palette.style.border = '2px solid #8b4513';
        palette.style.borderRadius = '8px';
        palette.style.padding = '15px';
        palette.style.zIndex = '1000';
        palette.style.display = 'none';
        palette.style.boxShadow = '0 5px 15px rgba(0,0,0,0.5)';
        
        // Заголовок
        const title = document.createElement('div');
        title.style.color = '#d4af37';
        title.style.marginBottom = '10px';
        title.style.textAlign = 'center';
        title.innerHTML = '🎨 Цвет сетки';
        palette.appendChild(title);
        
        // Сетка частых цветов
        const colorsGrid = document.createElement('div');
        colorsGrid.style.display = 'grid';
        colorsGrid.style.gridTemplateColumns = 'repeat(5, 40px)';
        colorsGrid.style.gap = '5px';
        colorsGrid.style.marginBottom = '15px';
        
        this.gridColors.forEach(color => {
            const colorSquare = document.createElement('div');
            colorSquare.style.width = '40px';
            colorSquare.style.height = '40px';
            colorSquare.style.backgroundColor = color;
            colorSquare.style.border = color === '#ffffff' ? '1px solid #8b4513' : 'none';
            colorSquare.style.borderRadius = '4px';
            colorSquare.style.cursor = 'pointer';
            colorSquare.onclick = () => {
                this.setGridColor(color);
                this.closeGridPicker();
            };
            colorsGrid.appendChild(colorSquare);
        });
        
        palette.appendChild(colorsGrid);
        
        // Стандартный color picker
        const standardPicker = document.createElement('input');
        standardPicker.type = 'color';
        standardPicker.id = 'standardGridPicker';
        standardPicker.value = this.gridColor;
        standardPicker.style.width = '100%';
        standardPicker.style.height = '40px';
        standardPicker.style.border = '1px solid #8b4513';
        standardPicker.style.borderRadius = '4px';
        standardPicker.onchange = (e) => {
            this.setGridColor(e.target.value);
            this.closeGridPicker();
        };
        palette.appendChild(standardPicker);
        
        container.appendChild(palette);
    },
    
    toggleBrushPicker() {
        const palette = document.getElementById('brushPalette');
        if (palette) {
            if (this.brushPickerOpen) {
                this.closeBrushPicker();
            } else {
                this.closeGridPicker();
                palette.style.display = 'block';
                this.brushPickerOpen = true;
            }
        }
    },
    
    closeBrushPicker() {
        const palette = document.getElementById('brushPalette');
        if (palette) {
            palette.style.display = 'none';
            this.brushPickerOpen = false;
        }
    },
    
    toggleGridPicker() {
        const palette = document.getElementById('gridPalette');
        if (palette) {
            if (this.gridPickerOpen) {
                this.closeGridPicker();
            } else {
                this.closeBrushPicker();
                palette.style.display = 'block';
                this.gridPickerOpen = true;
            }
        }
    },
    
    closeGridPicker() {
        const palette = document.getElementById('gridPalette');
        if (palette) {
            palette.style.display = 'none';
            this.gridPickerOpen = false;
        }
    },
    
    async useEyeDropper() {
        if (!window.EyeDropper) {
            alert('Пипетка не поддерживается в вашем браузере');
            return;
        }
        
        try {
            const eyeDropper = new EyeDropper();
            const result = await eyeDropper.open();
            this.setColor(result.sRGBHex);
        } catch (e) {
            console.log('Пипетка отменена');
        }
    },
    
    zoom(factor, mouseX, mouseY) {
        const oldScale = this.scale;
        this.scale *= factor;
        this.scale = Math.min(Math.max(this.scale, 0.1), 5);
        
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
        document.getElementById('gridColorBtn').style.backgroundColor = color;
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
        const hexRadius = this.gridSize / 2;
        const hexWidth = hexRadius * 1.732;
        const hexHeight = hexRadius * 2;
        
        const cols = Math.ceil(this.canvas.width / hexWidth) + 2;
        const rows = Math.ceil(this.canvas.height / (hexHeight * 0.75)) + 2;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const xOffset = (row % 2) * hexWidth / 2;
                const x = col * hexWidth + xOffset;
                const y = row * (hexHeight * 0.75);
                
                this.drawHexagon(x, y, hexRadius);
            }
        }
    },
    
    drawHexagon(x, y, radius) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3;
            const hx = x + radius * Math.cos(angle);
            const hy = y + radius * Math.sin(angle);
            
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
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.putImageData(imageData, 0, 0);
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
        document.getElementById('brushColorBtn').style.backgroundColor = color;
        document.getElementById('standardBrushPicker').value = color;
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
