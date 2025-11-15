// ========== СИСТЕМА КАРТ ==========

class MapSystem {
    constructor() {
        this.maps = {};
        this.currentMapId = null;
        this.mapNotes = {};
        this.mapMarkers = {};
        this.zoomLevel = 1.0;
        this.panOffset = { x: 0, y: 0 };
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
    }

    initializeDefaultMaps() {
        if (Object.keys(this.maps).length > 0) return;
        
        const defaultMaps = [
            {
                id: 'world_map',
                name: '🗺️ Карта мира', 
                imageUrl: 'maps/world_map.jpg',
                width: 4096,
                height: 3072
            },
            {
                id: 'empire_ruda_right',
                name: '🏛️ Империя Руда (правая)',
                imageUrl: 'maps/empire_ruda_right.jpg.jpeg',
                width: 3841,
                height: 4096
            },
            {
                id: 'empire_ruda_left', 
                name: '🏛️ Империя Руда (левая)',
                imageUrl: 'maps/empire_ruda_left.jpg',
                width: 3630,
                height: 4096
            }
        ];
        
        defaultMaps.forEach(map => {
            this.addMap(map.id, map.name, map.imageUrl, map.width, map.height);
        });
    }

    addMap(mapId, name, imageUrl, width, height) {
        this.maps[mapId] = {
            id: mapId,
            name: name,
            imageUrl: imageUrl,
            width: width,
            height: height,
            createdAt: new Date().toISOString()
        };
        
        if (!this.mapNotes[mapId]) {
            this.mapNotes[mapId] = [];
        }
        
        if (!this.mapMarkers[mapId]) {
            this.mapMarkers[mapId] = [];
        }
        
        this.saveMaps();
    }

    removeMap(mapId) {
        delete this.maps[mapId];
        delete this.mapNotes[mapId];
        delete this.mapMarkers[mapId];
        
        if (this.currentMapId === mapId) {
            this.currentMapId = null;
        }
        
        this.saveMaps();
    }

    switchMap(mapId) {
        if (this.maps[mapId]) {
            this.currentMapId = mapId;
            this.zoomLevel = 1.0;
            this.panOffset = { x: 0, y: 0 };
            this.saveCurrentMap();
            this.renderCurrentMap();
            return true;
        }
        return false;
    }

    addMapNote(mapId, x, y, title, content, color = '#ffeb3b') {
        if (!this.mapNotes[mapId]) {
            this.mapNotes[mapId] = [];
        }
        
        const note = {
            id: 'note_' + Date.now(),
            x: x,
            y: y,
            title: title,
            content: content,
            color: color,
            createdAt: new Date().toISOString(),
            expanded: false
        };
        
        this.mapNotes[mapId].push(note);
        this.saveMapNotes();
        return note;
    }

    zoomIn() {
        this.zoomLevel = Math.min(this.zoomLevel * 1.2, 5.0);
        this.renderCurrentMap();
    }

    zoomOut() {
        this.zoomLevel = Math.max(this.zoomLevel / 1.2, 0.2);
        this.renderCurrentMap();
    }

    resetZoom() {
        this.zoomLevel = 1.0;
        this.panOffset = { x: 0, y: 0 };
        this.renderCurrentMap();
    }

    enableDragging() {
        const mapCanvas = document.getElementById('mapCanvas');
        if (!mapCanvas) return;

        mapCanvas.style.cursor = 'grab';
        
        mapCanvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        mapCanvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('touchmove', this.handleTouchMove.bind(this));
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    handleMouseDown(e) {
        this.isDragging = true;
        this.dragStart = { x: e.clientX - this.panOffset.x, y: e.clientY - this.panOffset.y };
        document.getElementById('mapCanvas').style.cursor = 'grabbing';
        e.preventDefault();
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        this.panOffset.x = e.clientX - this.dragStart.x;
        this.panOffset.y = e.clientY - this.dragStart.y;
        
        this.renderCurrentMap();
    }

    handleMouseUp() {
        this.isDragging = false;
        document.getElementById('mapCanvas').style.cursor = 'grab';
    }

    handleTouchStart(e) {
        if (e.touches.length === 1) {
            this.isDragging = true;
            this.dragStart = { 
                x: e.touches[0].clientX - this.panOffset.x, 
                y: e.touches[0].clientY - this.panOffset.y 
            };
            e.preventDefault();
        }
    }

    handleTouchMove(e) {
        if (!this.isDragging || e.touches.length !== 1) return;
        
        this.panOffset.x = e.touches[0].clientX - this.dragStart.x;
        this.panOffset.y = e.touches[0].clientY - this.dragStart.y;
        
        this.renderCurrentMap();
        e.preventDefault();
    }

    handleTouchEnd() {
        this.isDragging = false;
    }

    saveMaps() {
        localStorage.setItem('dnd_maps', JSON.stringify(this.maps));
    }

    loadMaps() {
        const saved = localStorage.getItem('dnd_maps');
        if (saved) {
            this.maps = JSON.parse(saved);
        }
    }

    saveMapNotes() {
        localStorage.setItem('dnd_map_notes', JSON.stringify(this.mapNotes));
    }

    loadMapNotes() {
        const saved = localStorage.getItem('dnd_map_notes');
        if (saved) {
            this.mapNotes = JSON.parse(saved);
        }
    }

    saveCurrentMap() {
        localStorage.setItem('current_map_id', this.currentMapId);
    }

    loadCurrentMap() {
        this.currentMapId = localStorage.getItem('current_map_id');
    }

    renderCurrentMap() {
        const mapContainer = document.getElementById('mapContainer');
        const mapCanvas = document.getElementById('mapCanvas');
        const noMapMessage = document.getElementById('noMapMessage');
        const mapControls = document.querySelector('.map-controls');
        const zoomLevel = document.getElementById('zoomLevel');

        if (!this.currentMapId || !this.maps[this.currentMapId]) {
            mapContainer.style.display = 'none';
            noMapMessage.style.display = 'block';
            mapControls.style.display = 'none';
            return;
        }

        mapContainer.style.display = 'block';
        noMapMessage.style.display = 'none';
        mapControls.style.display = 'flex';
        
        const currentMap = this.maps[this.currentMapId];
        zoomLevel.textContent = Math.round(this.zoomLevel * 100) + '%';

        mapCanvas.innerHTML = '';

        const img = document.createElement('img');
        img.src = currentMap.imageUrl;
        img.style.width = currentMap.width + 'px';
        img.style.height = currentMap.height + 'px';
        img.style.display = 'block';
        
        mapCanvas.style.transform = `translate(${this.panOffset.x}px, ${this.panOffset.y}px) scale(${this.zoomLevel})`;
        mapCanvas.appendChild(img);

        const info = document.createElement('div');
        info.style.position = 'absolute';
        info.style.top = '10px';
        info.style.left = '10px';
        info.style.background = 'rgba(42, 24, 16, 0.8)';
        info.style.color = '#d4af37';
        info.style.padding = '5px 10px';
        info.style.borderRadius = '4px';
        info.style.fontSize = '14px';
        info.textContent = `${currentMap.name} | ${currentMap.width}x${currentMap.height}`;
        mapCanvas.appendChild(info);

        setTimeout(() => this.enableDragging(), 100);
    }
}

const mapSystem = new MapSystem();

mapSystem.loadMaps();
mapSystem.loadMapNotes();
mapSystem.loadCurrentMap();
mapSystem.initializeDefaultMaps();

console.log('✅ Система карт загружена. Карт в системе:', Object.keys(mapSystem.maps).length);

function showMapsList() {
    const popup = document.createElement('div');
    popup.className = 'popup';
    
    let mapsHTML = '';
    Object.values(mapSystem.maps).forEach(map => {
        const isCurrent = mapSystem.currentMapId === map.id;
        mapsHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #2c1810; margin: 5px 0; border-radius: 4px;">
                <span>${map.name}</span>
                <div>
                    ${!isCurrent ? 
                        `<button class="btn btn-small" onclick="switchToMap('${map.id}')" style="background: #27ae60;">🎯 Выбрать</button>` : 
                        `<button class="btn btn-small" disabled style="background: #5a3928;">✅ Активна</button>`
                    }
                    <button class="btn btn-small" onclick="deleteMap('${map.id}')" style="background: #c44536;">❌ Удалить</button>
                </div>
            </div>
        `;
    });
    
    popup.innerHTML = `
        <div class="popup-content">
            <h2 style="color: #d4af37;">📋 Список карт</h2>
            <div style="max-height: 400px; overflow-y: auto;">
                ${mapsHTML || '<p style="color: #8b7d6b; text-align: center;">Карт нет</p>'}
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-roll" onclick="this.closest('.popup').remove()">Закрыть</button>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
}

function switchToMap(mapId) {
    if (mapSystem.switchMap(mapId)) {
        document.querySelector('.popup').remove();
    }
}

function deleteMap(mapId) {
    if (confirm('Удалить эту карту?')) {
        mapSystem.removeMap(mapId);
        document.querySelector('.popup').remove();
        showMapsList();
    }
}

function showAddMapPopup() {
    alert('Функция добавления карты будет в следующем шаге!');
}

function toggleNoteMode() {
    alert('Режим заметок будет в следующем шаге!');
}
