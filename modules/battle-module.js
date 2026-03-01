// modules/battle-module.js
const BattleModule = {
    canvas: null,
    ctx: null,
    hexSize: 40, // размер гекса (радиус)
    gridColor: '#8b4513',
    highlightColor: '#d4af37',
    selectedHex: null,
    hexes: [], // координаты всех гексов
    offsetX: 100, // смещение сетки по X
    offsetY: 100, // смещение сетки по Y
    
    init() {
        this.canvas = document.getElementById('battleCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.generateHexGrid(10, 10); // 10x10 гексов
        this.drawGrid();
        this.bindEvents();
        
        console.log('Battle module initialized');
    },
    
    generateHexGrid(cols, rows) {
        this.hexes = [];
        const hexWidth = this.hexSize * 1.732; // ширина гекса
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // смещение для четных/нечетных рядов
                const xOffset = (row % 2) * hexWidth / 2;
                const x = col * hexWidth + xOffset + this.offsetX;
                const y = row * (this.hexSize * 1.5) + this.offsetY;
                
                this.hexes.push({
                    x, y,
                    col, row,
                    occupied: false,
                    unit: null
                });
            }
        }
    },
    
    drawGrid() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.strokeStyle = this.gridColor;
        this.ctx.lineWidth = 2;
        
        this.hexes.forEach(hex => {
            this.drawHexagon(hex.x, hex.y);
        });
    },
    
    drawHexagon(x, y) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3;
            const hx = x + this.hexSize * Math.cos(angle);
            const hy = y + this.hexSize * Math.sin(angle);
            
            if (i === 0) this.ctx.moveTo(hx, hy);
            else this.ctx.lineTo(hx, hy);
        }
        this.ctx.closePath();
        this.ctx.stroke();
    },
    
    bindEvents() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleHover(e));
    },
    
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const hex = this.findHexByPosition(x, y);
        if (hex) {
            this.selectHex(hex);
        }
    },
    
    handleHover(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.drawGrid(); // перерисовываем
        
        const hex = this.findHexByPosition(x, y);
        if (hex) {
            this.highlightHex(hex);
        }
    },
    
    findHexByPosition(x, y) {
        return this.hexes.find(hex => this.isPointInHex(x, y, hex));
    },
    
    isPointInHex(px, py, hex) {
        // простая проверка расстояния до центра
        const dx = px - hex.x;
        const dy = py - hex.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        return dist < this.hexSize;
    },
    
    highlightHex(hex) {
        this.ctx.strokeStyle = this.highlightColor;
        this.ctx.lineWidth = 3;
        this.drawHexagon(hex.x, hex.y);
        this.ctx.strokeStyle = this.gridColor; // возвращаем
        this.ctx.lineWidth = 2;
    },
    
    selectHex(hex) {
        if (this.selectedHex) {
            // снимаем выделение с предыдущего
            this.drawGrid();
        }
        
        this.selectedHex = hex;
        this.highlightHex(hex);
        console.log(`Выбран гекс: ряд ${hex.row}, колонка ${hex.col}`);
    }
};

// Инициализация после загрузки страницы
document.addEventListener('DOMContentLoaded', () => BattleModule.init());
