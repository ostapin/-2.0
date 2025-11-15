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
        this.noteMode = false;
        this.markerMode = false;
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

    // НОВЫЙ МЕТОД: Добавление метки на карту
    addMapMarker(mapId, x, y, type, title, description, color = '#ff4444') {
        if (!this.mapMarkers[mapId]) {
            this.mapMarkers[mapId] = [];
        }
        
        const marker = {
            id: 'marker_' + Date.now(),
            x: x,
            y: y,
            type: type, // 'location', 'quest', 'danger', 'npc', 'treasure'
            title: title,
            description: description,
            color: color,
            createdAt: new Date().toISOString(),
            visible: true
        };
        
        this.mapMarkers[mapId].push(marker);
        this.saveMapMarkers();
        this.renderMapMarkers();
        return marker;
    }

    // НОВЫЙ МЕТОД: Удаление метки
    removeMapMarker(mapId, markerId) {
        if (this.mapMarkers[mapId]) {
            this.mapMarkers[mapId] = this.mapMarkers[mapId].filter(m => m.id !== markerId);
            this.saveMapMarkers();
            this.renderMapMarkers();
        }
    }

    // НОВЫЙ МЕТОД: Сохранение меток
    saveMapMarkers() {
        localStorage.setItem('dnd_map_markers', JSON.stringify(this.mapMarkers));
    }

    // НОВЫЙ МЕТОД: Загрузка меток
    loadMapMarkers() {
        const saved = localStorage.getItem('dnd_map_markers');
        if (saved) {
            this.mapMarkers = JSON.parse(saved);
        }
    }

    // НОВЫЙ МЕТОД: Отрисовка меток
    renderMapMarkers() {
        const mapCanvas = document.getElementById('mapCanvas');
        if (!mapCanvas || !this.currentMapId) return;

        // Удаляем старые метки
        const oldMarkers = mapCanvas.querySelectorAll('.map-marker');
        oldMarkers.forEach(marker => marker.remove());

        // Добавляем новые метки
        const markers = this.mapMarkers[this.currentMapId] || [];
        markers.forEach(marker => {
            if (marker.visible) {
                const markerElement = document.createElement('div');
                markerElement.className = 'map-marker';
                markerElement.style.position = 'absolute';
                markerElement.style.left = marker.x + 'px';
                markerElement.style.top = marker.y + 'px';
                markerElement.style.width = '20px';
                markerElement.style.height = '20px';
                markerElement.style.backgroundColor = marker.color;
                markerElement.style.borderRadius = '50%';
                markerElement.style.border = '2px solid white';
                markerElement.style.cursor = 'pointer';
                markerElement.style.transform = 'translate(-50%, -50%)';
                markerElement.style.zIndex = '10';
                markerElement.title = marker.title;

                // Добавляем всплывающую подсказку
                markerElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showMarkerPopup(marker);
                });

                mapCanvas.appendChild(markerElement);
            }
        });
    }

    // НОВЫЙ МЕТОД: Всплывающее окно метки
    showMarkerPopup(marker) {
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.zIndex = '1000';
        popup.style.background = '#2c1810';
        popup.style.border = '2px solid #8b4513';
        popup.style.borderRadius = '8px';
        popup.style.padding = '20px';
        popup.style.minWidth = '300px';

        popup.innerHTML = `
            <div class="popup-content">
                <h3 style="color: #d4af37; margin-bottom: 15px;">${marker.title}</h3>
                <div style="margin-bottom: 15px;">
                    <strong>Тип:</strong> ${this.getMarkerTypeName(marker.type)}<br>
                    <strong>Описание:</strong> ${marker.description || 'Нет описания'}
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button class="btn btn-small" onclick="this.closest('.popup').remove()">Закрыть</button>
                    <button class="btn btn-small" onclick="mapSystem.removeMapMarker('${this.currentMapId}', '${marker.id}'); this.closest('.popup').remove()" style="background: #c44536;">Удалить</button>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        // Закрытие при клике вне попапа
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.remove();
            }
        });
    }

    // НОВЫЙ МЕТОД: Названия типов меток
    getMarkerTypeName(type) {
        const typeNames = {
            'location': '📍 Локация',
            'quest': '🎯 Задание',
            'danger': '⚠️ Опасность',
            'npc': '👤 Персонаж',
            'treasure': '💎 Сокровище'
        };
        return typeNames[type] || type;
    }

    // НОВЫЙ МЕТОД: Переключение режима меток
    toggleMarkerMode() {
        this.markerMode = !this.markerMode;
        this.noteMode = false;
        
        const mapCanvas = document.getElementById('mapCanvas');
        if (mapCanvas) {
            if (this.markerMode) {
                mapCanvas.style.cursor = 'crosshair';
                this.showMarkerModeHelp();
            } else {
                mapCanvas.style.cursor = 'grab';
                this.hideMarkerModeHelp();
            }
        }
        
        return this.markerMode;
    }

    // НОВЫЙ МЕТОД: Помощь в режиме меток
    showMarkerModeHelp() {
        let help = document.getElementById('markerModeHelp');
        if (!help) {
            help = document.createElement('div');
            help.id = 'markerModeHelp';
            help.style.position = 'fixed';
            help.style.top = '10px';
            help.style.right = '10px';
            help.style.background = 'rgba(42, 24, 16, 0.9)';
            help.style.color = '#d4af37';
            help.style.padding = '10px';
            help.style.borderRadius = '4px';
            help.style.zIndex = '1000';
            help.style.border = '1px solid #8b4513';
            document.body.appendChild(help);
        }
        
        help.innerHTML = `
            <strong>🎯 Режим меток</strong><br>
            Кликните на карту чтобы добавить метку<br>
            <button class="btn btn-small" onclick="mapSystem.toggleMarkerMode()" style="margin-top: 5px; background: #c44536;">Отмена</button>
        `;
    }

    hideMarkerModeHelp() {
        const help = document.getElementById('markerModeHelp');
        if (help) {
            help.remove();
        }
    }

    // ОБНОВЛЕННЫЙ МЕТОД: Обработчик кликов для добавления меток
    handleMapClick(e) {
        if (this.markerMode && this.currentMapId) {
            const rect = e.target.getBoundingClientRect();
            const x = (e.clientX - rect.left - this.panOffset.x) / this.zoomLevel;
            const y = (e.clientY - rect.top - this.panOffset.y) / this.zoomLevel;
            
            this.showAddMarkerPopup(x, y);
        }
    }

    // НОВЫЙ МЕТОД: Попап добавления метки
    showAddMarkerPopup(x, y) {
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.zIndex = '1000';
        popup.style.background = '#2c1810';
        popup.style.border = '2px solid #8b4513';
        popup.style.borderRadius = '8px';
        popup.style.padding = '20px';
        popup.style.minWidth = '300px';

        popup.innerHTML = `
            <div class="popup-content">
                <h3 style="color: #d4af37; margin-bottom: 15px;">🎯 Добавить метку</h3>
                <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
                    <input type="text" id="markerTitle" placeholder="Название метки" style="padding: 10px; border: 2px solid #8b4513; border-radius: 4px; background: #1a0f0b; color: #e0d0c0;">
                    <select id="markerType" style="padding: 10px; border: 2px solid #8b4513; border-radius: 4px; background: #1a0f0b; color: #e0d0c0;">
                        <option value="location">📍 Локация</option>
                        <option value="quest">🎯 Задание</option>
                        <option value="danger">⚠️ Опасность</option>
                        <option value="npc">👤 Персонаж</option>
                        <option value="treasure">💎 Сокровище</option>
                    </select>
                    <textarea id="markerDescription" placeholder="Описание метки" style="padding: 10px; border: 2px solid #8b4513; border-radius: 4px; background: #1a0f0b; color: #e0d0c0; min-height: 60px; resize: vertical;"></textarea>
                    <div>
                        <label style="color: #d4af37;">Цвет метки:</label>
                        <input type="color" id="markerColor" value="#ff4444" style="margin-left: 10px;">
                    </div>
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button class="btn btn-small" onclick="this.closest('.popup').remove()">Отмена</button>
                    <button class="btn btn-small" onclick="mapSystem.createMarkerFromPopup(${x}, ${y})" style="background: #27ae60;">Добавить</button>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        // Автофокус на поле названия
        setTimeout(() => {
            const titleInput = document.getElementById('markerTitle');
            if (titleInput) titleInput.focus();
        }, 100);
    }

    // НОВЫЙ МЕТОД: Создание метки из попапа
    createMarkerFromPopup(x, y) {
        const title = document.getElementById('markerTitle').value.trim();
        const type = document.getElementById('markerType').value;
        const description = document.getElementById('markerDescription').value.trim();
        const color = document.getElementById('markerColor').value;

        if (!title) {
            alert('Введите название метки!');
            return;
        }

        this.addMapMarker(this.currentMapId, x, y, type, title, description, color);
        
        // Закрываем попапы
        document.querySelector('.popup').remove();
        this.toggleMarkerMode(); // Выключаем режим меток
    }

    zoomIn() {
        this.zoomLevel = Math.min(this.zoomLevel * 1.2, 5.0);
        this.updateMapTransform();
    }

    zoomOut() {
        this.zoomLevel = Math.max(this.zoomLevel / 1.2, 0.2);
        this.updateMapTransform();
    }

    resetZoom() {
        this.zoomLevel = 1.0;
        this.panOffset = { x: 0, y: 0 };
        this.updateMapTransform();
    }

    // ОПТИМИЗИРОВАННЫЙ МЕТОД - только обновляет трансформацию
    updateMapTransform() {
        const mapCanvas = document.getElementById('mapCanvas');
        if (mapCanvas) {
            mapCanvas.style.transform = `translate(${this.panOffset.x}px, ${this.panOffset.y}px) scale(${this.zoomLevel})`;
        }
        const zoomLevel = document.getElementById('zoomLevel');
        if (zoomLevel) {
            zoomLevel.textContent = Math.round(this.zoomLevel * 100) + '%';
        }
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
        
        // НОВЫЙ ОБРАБОТЧИК: клик для добавления меток
        mapCanvas.addEventListener('click', this.handleMapClick.bind(this));
    }

    handleMouseDown(e) {
        this.isDragging = true;
        this.dragStart = { x: e.clientX - this.panOffset.x, y: e.clientY - this.panOffset.y };
        document.getElementById('mapCanvas').style.cursor = 'grabbing';
        e.preventDefault();
    }

    // ОПТИМИЗИРОВАНО - не вызывает полный рендер
    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        this.panOffset.x = e.clientX - this.dragStart.x;
        this.panOffset.y = e.clientY - this.dragStart.y;
        
        this.updateMapTransform(); // Только обновление позиции
    }

    handleMouseUp() {
        this.isDragging = false;
        document.getElementById('mapCanvas').style.cursor = this.markerMode ? 'crosshair' : 'grab';
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

    // ОПТИМИЗИРОВАНО - не вызывает полный рендер
    handleTouchMove(e) {
        if (!this.isDragging || e.touches.length !== 1) return;
        
        this.panOffset.x = e.touches[0].clientX - this.dragStart.x;
        this.panOffset.y = e.touches[0].clientY - this.dragStart.y;
        
        this.updateMapTransform(); // Только обновление позиции
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

        mapCanvas.innerHTML = '';

        const img = document.createElement('img');
        img.src = currentMap.imageUrl;
        img.style.width = currentMap.width + 'px';
        img.style.height = currentMap.height + 'px';
        img.style.display = 'block';
        
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

        // Обновляем трансформацию после рендера
        this.updateMapTransform();
        
        // Рендерим метки
        this.renderMapMarkers();
        
        setTimeout(() => this.enableDragging(), 100);
    }
}

const mapSystem = new MapSystem();

// ОБНОВЛЕННАЯ ИНИЦИАЛИЗАЦИЯ: загружаем метки
mapSystem.loadMaps();
mapSystem.loadMapNotes();
mapSystem.loadMapMarkers(); // НОВОЕ: загружаем метки
mapSystem.loadCurrentMap();
mapSystem.initializeDefaultMaps();

console.log('✅ Система карт загружена. Карт в системе:', Object.keys(mapSystem.maps).length);
console.log('✅ Метки загружены для карт:', Object.keys(mapSystem.mapMarkers).length);

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

// ОБНОВЛЕННАЯ ФУНКЦИЯ: переключение режима заметок заменено на режим меток
function toggleNoteMode() {
    const isMarkerMode = mapSystem.toggleMarkerMode();
    const button = document.querySelector('button[onclick="toggleNoteMode()"]');
    
    if (isMarkerMode) {
        button.innerHTML = '✅ Режим меток';
        button.style.background = '#27ae60';
    } else {
        button.innerHTML = '📌 Режим меток';
        button.style.background = '#8b4513';
    }
}
