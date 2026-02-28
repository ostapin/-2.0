// Модуль рисовалки
const DrawModule = {
    canvas: null,
    ctx: null,
    drawing: false,
    currentTool: 'brush',
    currentColor: '#000000',
    currentSize: 5,
    drawings: {},
    
    init() {
        this.canvas = document.getElementById('drawCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        this.loadDrawings();
        this.bindEvents();
        console.log('Draw module initialized');
    },
    
    bindEvents() {
        // Рисование
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseleave', () => this.stopDrawing());
        
        // Инструменты
        document.getElementById('drawBrush')?.addEventListener('click', () => this.setTool('brush'));
        document.getElementById('drawEraser')?.addEventListener('click', () => this.setTool('eraser'));
        document.getElementById('drawColor')?.addEventListener('input', (e) => this.setColor(e.target.value));
        document.getElementById('drawSize')?.addEventListener('input', (e) => this.setSize(e.target.value));
        document.getElementById('drawClear')?.addEventListener('click', () => this.clearCanvas());
        document.getElementById('drawSave')?.addEventListener('click', () => this.saveDrawing());
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
