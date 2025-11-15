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
// ========== ИНТЕРФЕЙСНЫЕ ФУНКЦИИ ==========

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
        renderCurrentMap();
        document.querySelector('.popup').remove();
    }
}

function deleteMap(mapId) {
    if (confirm('Удалить эту карту?')) {
        mapSystem.removeMap(mapId);
        document.querySelector('.popup').remove();
        showMapsList(); // Обновляем список
    }
}

// Заглушки для остальных функций (добавим позже)
function showAddMapPopup() {
    alert('Функция добавления карты будет в следующем шаге!');
}

function renderCurrentMap() {
    const mapContainer = document.getElementById('mapContainer');
    const mapCanvas = document.getElementById('mapCanvas');
    const noMapMessage = document.getElementById('noMapMessage');
    const mapControls = document.querySelector('.map-controls');
    const zoomLevel = document.getElementById('zoomLevel');

    if (!mapSystem.currentMapId || !mapSystem.maps[mapSystem.currentMapId]) {
        // Нет карты - показываем сообщение
        mapContainer.style.display = 'none';
        noMapMessage.style.display = 'block';
        mapControls.style.display = 'none';
        return;
    }

    // Показываем карту и управление
    mapContainer.style.display = 'block';
    noMapMessage.style.display = 'none';
    mapControls.style.display = 'flex';
    
    const currentMap = mapSystem.maps[mapSystem.currentMapId];
    zoomLevel.textContent = Math.round(mapSystem.zoomLevel * 100) + '%';

    // Очищаем canvas
    mapCanvas.innerHTML = '';

    // Создаем изображение карты
    const img = document.createElement('img');
    img.src = currentMap.imageUrl;
    img.style.width = currentMap.width + 'px';
    img.style.height = currentMap.height + 'px';
    img.style.display = 'block';
    
    // Применяем трансформации (зум и панорамирование)
    mapCanvas.style.transform = `translate(${mapSystem.panOffset.x}px, ${mapSystem.panOffset.y}px) scale(${mapSystem.zoomLevel})`;
    
    mapCanvas.appendChild(img);

    // Показываем информацию о карте
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

    console.log('✅ Карта отрендерена:', currentMap.name);
}

function toggleNoteMode() {
    alert('Режим заметок будет в следующем шаге!');
}
