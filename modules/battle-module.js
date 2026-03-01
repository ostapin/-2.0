// modules/battle-module.js
const BattleModule = {
    canvas: null,
    ctx: null,
    hexSize: 40,          // радиус гекса (расстояние от центра до вершины)
    gridColor: '#8b4513',
    highlightColor: '#d4af37',
    selectedHex: null,
    hexes: [],            // координаты всех гексов
    offsetX: 100,
    offsetY: 100,
    
    init() {
        this.canvas = document.getElementById('battleCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.generateHexGrid(8, 8); // 8x8 гексов
        this.drawGrid();
        this.bindEvents();
        
        console.log('Battle module initialized with corrected hex grid');
    },
    
    generateHexGrid(cols, rows) {
        this.hexes = [];
        
        // Правильные размеры для pointy-top гексов [citation:6]
        const hexWidth = this.hexSize * 1.732; // ширина = sqrt(3) * radius
        const hexHeight = this.hexSize * 2;     // высота = 2 * radius
        const vertSpacing = this.hexSize * 1.5; // вертикальное смещение = 1.5 * radius
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // Смещение по X для нечетных рядов (как в сотах)
                const xOffset = (row % 2) * (hexWidth / 2);
                const x = col * hexWidth + xOffset + this.offsetX;
                const y = row * vertSpacing + this.offsetY;
                
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
        this.ctx.fillStyle = '#2a1a0f';
        
        this.hexes.forEach(hex => {
            this.fillHexagon(hex.x, hex.y);
            this.strokeHexagon(hex.x, hex.y);
        });
    },
    
    strokeHexagon(x, y) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            // Угол для pointy-top гекса: вершины сверху и снизу [citation:6][citation:10]
            const angle = i * Math.PI / 3; // 0°, 60°, 120°, 180°, 240°, 300°
            const hx = x + this.hexSize * Math.cos(angle);
            const hy = y + this.hexSize * Math.sin(angle);
            
            if (i === 0) {
                this.ctx.moveTo(hx, hy);
            } else {
                this.ctx.lineTo(hx, hy);
            }
        }
        this.ctx.closePath();
        this.ctx.stroke();
    },
    
    fillHexagon(x, y) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3;
            const hx = x + this.hexSize * Math.cos(angle);
            const hy = y + this.hexSize * Math.sin(angle);
            
            if (i === 0) {
                this.ctx.moveTo(hx, hy);
            } else {
                this.ctx.lineTo(hx, hy);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
    },
    
    bindEvents() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleHover(e));
        this.canvas.addEventListener('mouseleave', () => {
            this.drawGrid();
            if (this.selectedHex) {
                this.highlightHex(this.selectedHex);
            }
        });
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
        
        if (this.selectedHex) {
            this.highlightHex(this.selectedHex);
        }
        
        const hex = this.findHexByPosition(x, y);
        if (hex && hex !== this.selectedHex) {
            this.highlightHex(hex, true); // подсветка при наведении
        }
    },
    
    findHexByPosition(px, py) {
        // Поиск ближайшего гекса по центру
        let closestHex = null;
        let minDist = this.hexSize; // Радиус поиска
        
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
        const oldStrokeStyle = this.ctx.strokeStyle;
        const oldLineWidth = this.ctx.lineWidth;
        
        this.ctx.strokeStyle = isHover ? '#ffd700' : this.highlightColor;
        this.ctx.lineWidth = isHover ? 2.5 : 3;
        
        this.strokeHexagon(hex.x, hex.y);
        
        this.ctx.strokeStyle = oldStrokeStyle;
        this.ctx.lineWidth = oldLineWidth;
    },
    
    selectHex(hex) {
        if (this.selectedHex) {
            // снимаем выделение с предыдущего
            this.drawGrid();
        }
        
        this.selectedHex = hex;
        this.highlightHex(hex);
        
        // обновляем информацию
        const info = document.getElementById('hexInfo');
        if (info) {
            info.innerHTML = `Выбран гекс: ряд ${hex.row + 1}, колонка ${hex.col + 1}<br>Координаты: X=${Math.round(hex.x)}, Y=${Math.round(hex.y)}`;
        }
        
        console.log(`Выбран гекс: ряд ${hex.row}, колонка ${hex.col}`);
    },
    
    setHexSize(size) {
        this.hexSize = parseInt(size);
        document.getElementById('hexSizeValue').textContent = size;
        this.generateHexGrid(8, 8);
        this.drawGrid();
        
        if (this.selectedHex) {
            const hex = this.hexes.find(h => 
                h.row === this.selectedHex.row && 
                h.col === this.selectedHex.col
            );
            if (hex) {
                this.selectedHex = hex;
                this.highlightHex(hex);
            }
        }
    },
    
    resetView() {
        this.offsetX = 100;
        this.offsetY = 100;
        this.generateHexGrid(8, 8);
        this.drawGrid();
        
        if (this.selectedHex) {
            const hex = this.hexes.find(h => 
                h.row === this.selectedHex.row && 
                h.col === this.selectedHex.col
            );
            if (hex) {
                this.selectedHex = hex;
                this.highlightHex(hex);
            }
        }
    }
};

// Инициализация после загрузки страницы
document.addEventListener('DOMContentLoaded', () => BattleModule.init());
