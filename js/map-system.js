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
                width: 1200,
                height: 800
            },
            {
                id: 'empire_ruda_right',
                name: '🏛️ Империя Руда (правая)',
                imageUrl: 'maps/empire_ruda_right.jpg',
                width: 1000, 
                height: 700
            },
            {
                id: 'empire_ruda_left', 
                name: '🏛️ Империя Руда (левая)',
                imageUrl: 'maps/empire_ruda_left.jpg',
                width: 1000,
                height: 700
            }
        ];
        
        defaultMaps.forEach(map => {
            this.addMap(map.id, map.name, map.imageUrl, map.width, map.height);
        });
    }
    // Добавление карты в систему
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

    // Удаление карты
    removeMap(mapId) {
        delete this.maps[mapId];
        delete this.mapNotes[mapId];
        delete this.mapMarkers[mapId];
        
        if (this.currentMapId === mapId) {
            this.currentMapId = null;
        }
        
        this.saveMaps();
    }

    // Переключение на другую карту
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

    // Добавление заметки на карту
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

    // Управление масштабом
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

    // Сохранение/загрузка данных
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

    // Рендер текущей карты (будет дополнен в следующих шагах)
    renderCurrentMap() {
        if (!this.currentMapId || !this.maps[this.currentMapId]) {
            console.log('No map selected');
            return;
        }
        console.log('Rendering map:', this.maps[this.currentMapId].name);
    }
}

// Создаем глобальный экземпляр системы карт
const mapSystem = new MapSystem();
// ========== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ==========

// Загружаем данные при старте
mapSystem.loadMaps();
mapSystem.loadMapNotes();
mapSystem.loadCurrentMap();
mapSystem.initializeDefaultMaps(); // ← добавляем эту строку

console.log('✅ Система карт загружена. Карт в системе:', Object.keys(mapSystem.maps).length);
