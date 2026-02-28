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
        
        // Закрытие палитр при клике вне их
        document.addEventListener('click', (e) => {
            if (this.brushPickerOpen && !e.target.closest('.brush-palette-container')) {
                this.closeBrushPicker();
            }
            if (this.gridPickerOpen && !e.target.closest('.grid-palette-container')) {
                this.closeGridPicker();
            }
        });
    },
    
    addControls() {
        const panel = document.querySelector('#draw-tab .btn-roll')?.parentNode;
        if (!panel) return;
        
        // Очищаем панель
        panel.innerHTML = '';
        
        // ===== КИСТЬ И ЛАСТИК =====
        const brushBtn = document.createElement('button');
        brushBtn.className = 'btn btn-roll';
        brushBtn.id = 'drawBrush';
        brushBtn.innerHTML = '🖌️ Кисть';
        brushBtn.style.padding = '5px 10px';
        panel.appendChild(brushBtn);
        
        const eraserBtn = document.createElement('button');
        eraserBtn.className = 'btn btn-roll';
        eraserBtn.id = 'drawEraser';
        eraserBtn.innerHTML = '🧽 Ластик';
        eraserBtn.style.padding = '5px 10px';
        panel.appendChild(eraserBtn);
        
        // ===== РАЗМЕР КИСТИ =====
        const sizeLabel = document.createElement('span');
        sizeLabel.innerHTML = 'Размер:';
        sizeLabel.style.color = '#e0d0c0';
        sizeLabel.style.marginLeft = '10px';
        panel.appendChild(sizeLabel);
        
        const sizeInput = document.createElement('input');
        sizeInput.type = 'range';
        sizeInput.id = 'drawSize';
        sizeInput.min = '1';
        sizeInput.max = '100';
        sizeInput.value = this.currentSize;
        sizeInput.style.width = '100px';
        sizeInput.style.marginLeft = '5px';
        sizeInput.oninput = (e) => this.setSize(e.target.value);
        panel.appendChild(sizeInput);
        
        const sizeValue = document.createElement('span');
        sizeValue.id = 'drawSizeValue';
        sizeValue.innerHTML = this.currentSize;
        sizeValue.style.color = '#e0d0c0';
        sizeValue.style.marginLeft = '5px';
        panel.appendChild(sizeValue);
        
        // ===== ЦВЕТ КИСТИ =====
        // Стандартный color picker (радуга)
        const standardColorPicker = document.createElement('input');
        standardColorPicker.type = 'color';
        standardColorPicker.id = 'standardColorPicker';
        standardColorPicker.value = this.currentColor;
        standardColorPicker.style.width = '40px';
        standardColorPicker.style.height = '40px';
        standardColorPicker.style.border = '2px solid #8b4513';
        standardColorPicker.style.borderRadius = '4px';
        standardColorPicker.style.marginLeft = '10px';
        standardColorPicker.style.cursor = 'pointer';
        standardColorPicker.onchange = (e) => this.setColor(e.target.value);
        panel.appendChild(standardColorPicker);
        
        // Контейнер для палитры частых цветов
        const brushPaletteContainer = document.createElement('div');
        brushPaletteContainer.className = 'brush-palette-container';
        brushPaletteContainer.style.position = 'relative';
        brushPaletteContainer.style.display = 'inline-block';
        
        // Кнопка открытия палитры частых цветов
        const paletteBtn = document.createElement('button');
        paletteBtn.className = 'btn btn-roll';
        paletteBtn.innerHTML = '🎨';
        paletteBtn.style.padding = '5px 10px';
        paletteBtn.style.marginLeft = '5px';
        paletteBtn.title = 'Частые цвета';
        paletteBtn.onclick = () => this.toggleBrushPicker();
        brushPaletteContainer.appendChild(paletteBtn);
        
        panel.appendChild(brushPaletteContainer);
        
        // Пипетка
        if (window.EyeDropper) {
            const eyeDropperBtn = document.createElement('button');
            eyeDropperBtn.className = 'btn btn-roll';
            eyeDropperBtn.innerHTML = '👁️';
            eyeDropperBtn.style.padding = '5px 10px';
            eyeDropperBtn.style.marginLeft = '5px';
            eyeDropperBtn.title = 'Пипетка';
            eyeDropperBtn.onclick = () => this.useEyeDropper();
            panel.appendChild(eyeDropperBtn);
        }
        
        // ===== Разделитель =====
        const sep1 = document.createElement('span');
        sep1.innerHTML = ' | ';
        sep1.style.color = '#8b4513';
        sep1.style.fontWeight = 'bold';
        sep1.style.margin = '0 10px';
        panel.appendChild(sep1);
        
        // ===== СЕТКА =====
        const gridBtn = document.createElement('button');
        gridBtn.className = 'btn btn-roll';
        gridBtn.id = 'drawGrid';
        gridBtn.innerHTML = '⬜ Сетка';
        gridBtn.style.padding = '5px 10px';
        gridBtn.onclick = () => this.toggleGrid();
        panel.appendChild(gridBtn);
        
        // Размер сетки
        const gridSizeLabel = document.createElement('span');
        gridSizeLabel.innerHTML = 'Размер:';
        gridSizeLabel.style.color = '#e0d0c0';
        gridSizeLabel.style.marginLeft = '10px';
        panel.appendChild(gridSizeLabel);
        
        const gridSizeInput = document.createElement('input');
        gridSizeInput.type = 'number';
        gridSizeInput.id = 'gridSize';
        gridSizeInput.value = this.gridSize;
        gridSizeInput.min = '5';
        gridSizeInput.max = '200';
        gridSizeInput.style.width = '60px';
        gridSizeInput.style.padding = '3px';
        gridSizeInput.style.background = '#1a0f0b';
        gridSizeInput.style.color = '#e0d0c0';
        gridSizeInput.style.border = '1px solid #8b4513';
        gridSizeInput.style.marginLeft = '5px';
        gridSizeInput.onchange = (e) => this.setGridSize(parseInt(e.target.value));
        panel.appendChild(gridSizeInput);
        
        // Цвет сетки - стандартный color picker
        const gridColorPicker = document.createElement('input');
        gridColorPicker.type = 'color';
        gridColorPicker.id = 'gridColorPicker';
        gridColorPicker.value = this.gridColor;
        gridColorPicker.style.width = '30px';
        gridColorPicker.style.height = '30px';
        gridColorPicker.style.border = '2px solid #8b4513';
        gridColorPicker.style.borderRadius = '4px';
        gridColorPicker.style.marginLeft = '10px';
        gridColorPicker.style.cursor = 'pointer';
        gridColorPicker.onchange = (e) => this.setGridColor(e.target.value);
        panel.appendChild(gridColorPicker);
        
        // Контейнер для палитры частых цветов сетки
        const gridPaletteContainer = document.createElement('div');
        gridPaletteContainer.className = 'grid-palette-container';
        gridPaletteContainer.style.position = 'relative';
        gridPaletteContainer.style.display = 'inline-block';
        
        // Кнопка открытия палитры частых цветов для сетки
        const gridPaletteBtn = document.createElement('button');
        gridPaletteBtn.className = 'btn btn-roll';
        gridPaletteBtn.innerHTML = '🎨';
        gridPaletteBtn.style.padding = '2px 8px';
        gridPaletteBtn.style.marginLeft = '3px';
        gridPaletteBtn.title = 'Частые цвета для сетки';
        gridPaletteBtn.onclick = () => this.toggleGridPicker();
        gridPaletteContainer.appendChild(gridPaletteBtn);
        
        panel.appendChild(gridPaletteContainer);
        
        // Прозрачность сетки
        const opacityLabel = document.createElement('span');
        opacityLabel.innerHTML = 'Прозрачность:';
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
        gridTypeSelect.style.padding = '3px';
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
        
        // ===== Разделитель =====
        const sep2 = document.createElement('span');
        sep2.innerHTML = ' | ';
        sep2.style.color = '#8b4513';
        sep2.style.fontWeight = 'bold';
        sep2.style.margin = '0 10px';
        panel.appendChild(sep2);
        
        // ===== ЗУМ =====
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
        
        // ===== Разделитель =====
        const sep3 = document.createElement('span');
        sep3.innerHTML = ' | ';
        sep3.style.color = '#8b4513';
        sep3.style.fontWeight = 'bold';
        sep3.style.margin = '0 10px';
        panel.appendChild(sep3);
        
        // ===== СОХРАНИТЬ И ОЧИСТИТЬ =====
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn btn-plus';
        saveBtn.id = 'drawSave';
        saveBtn.innerHTML = '💾 Сохранить';
        saveBtn.style.padding = '5px 10px';
        saveBtn.onclick = () => this.saveDrawing();
        panel.appendChild(saveBtn);
        
        const clearBtn = document.createElement('button');
        clearBtn.className = 'btn btn-minus';
        clearBtn.id = 'drawClear';
        clearBtn.innerHTML = '🗑️ Очистить';
        clearBtn.style.padding = '5px 10px';
        clearBtn.style.marginLeft = '5px';
        clearBtn.onclick = () => this.clearCanvas();
        panel.appendChild(clearBtn);
        
        // Создаем палитры частых цветов
        this.createBrushPalette(brushPaletteContainer);
        this.createGridPalette(gridPaletteContainer);
    },
    
    createBrushPalette(container) {
        const palette = document.createElement('div');
        palette.id = 'brushPalette';
        palette.style.position = 'absolute';
        palette.style.top = '35px';
        palette.style.left = '0';
        palette.style.backgroundColor = '#3d2418';
        palette.style.border = '2px solid #8b4513';
        palette.style.borderRadius = '8px';
        palette.style.padding = '15px';
        palette.style.zIndex = '1000';
        palette.style.display = 'none';
        palette.style.boxShadow = '0 5px 15px rgba(0,0,0,0.5)';
        
        const title = document.createElement('div');
        title.style.color = '#d4af37';
        title.style.marginBottom = '10px';
        title.style.textAlign = 'center';
        title.innerHTML = '🎨 Частые цвета';
        palette.appendChild(title);
        
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
        container.appendChild(palette);
    },
    
    createGridPalette(container) {
        const palette = document.createElement('div');
        palette.id = 'gridPalette';
        palette.style.position = 'absolute';
        palette.style.top = '35px';
        palette.style.left = '0';
        palette.style.backgroundColor = '#3d2418';
        palette.style.border = '2px solid #8b4513';
        palette.style.borderRadius = '8px';
        palette.style.padding = '15px';
        palette.style.zIndex = '1000';
        palette.style.display = 'none';
        palette.style.boxShadow = '0 5px 15px rgba(0,0,0,0.5)';
        
        const title = document.createElement('div');
        title.style.color = '#d4af37';
        title.style.marginBottom = '10px';
        title.style.textAlign = 'center';
        title.innerHTML = '🎨 Частые цвета';
        palette.appendChild(title);
        
        const colorsGrid = document.createElement('div');
        colorsGrid.style.display = 'grid';
        colorsGrid.style.gridTemplateColumns = 'repeat(5, 40px)';
        colorsGrid.style.gap = '5px';
        
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
        document.getElementById('gridColorPicker').value = color;
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
        if (tool === 'eraser') {
            this.setColor('#ffffff');
            document.getElementById('drawSize').max = '200';
        } else {
            document.getElementById('drawSize').max = '100';
        }
    },
    
    setColor(color) {
        this.currentColor = color;
        document.getElementById('standardColorPicker').value = color;
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
