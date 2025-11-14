// ========== МОДУЛЬ ИНВЕНТАРЯ ==========

function showAddItemPopup() {
    const popup = document.createElement('div');
    popup.className = 'popup';
    
    let categoryOptions = '';
    
    const standardCategories = [
        { id: 'weapons', name: '⚔️ Оружие' },
        { id: 'armor', name: '🛡️ Броня' },
        { id: 'potions', name: '🧪 Зелья' },
        { id: 'scrolls', name: '📜 Свитки' },
        { id: 'resources', name: '💎 Ресурсы' },
        { id: 'valuables', name: '💰 Ценности' },
        { id: 'tools', name: '🔧 Инструменты' },
        { id: 'other', name: '🎒 Прочее' }
    ];
    
    standardCategories.forEach(cat => {
        categoryOptions += `<option value="${cat.id}">${cat.name}</option>`;
    });
    
    customCategories.forEach(catId => {
        const catName = getCategoryName(catId);
        categoryOptions += `<option value="${catId}">${catName}</option>`;
    });
    
    popup.innerHTML = `
        <div class="popup-content">
            <h2 style="color: #d4af37;">Добавить предмет</h2>
            <input type="text" id="itemName" placeholder="Название предмета" style="width: 100%; padding: 12px; margin: 10px 0; border: 2px solid #8b4513; border-radius: 4px; background: #1a0f0b; color: #e0d0c0; font-size: 16px;">
            
            <select id="itemCategory" style="width: 100%; padding: 12px; margin: 10px 0; border: 2px solid #8b4513; border-radius: 4px; background: #1a0f0b; color: #e0d0c0; font-size: 16px;">
                ${categoryOptions}
            </select>
            
            <input type="number" id="itemQuantity" placeholder="Количество" value="1" min="1" style="width: 100%; padding: 12px; margin: 10px 0; border: 2px solid #8b4513; border-radius: 4px; background: #1a0f0b; color: #e0d0c0; font-size: 16px;">
            
            <textarea id="itemDescription" placeholder="Описание предмета (опционально)" style="width: 100%; height: 120px; padding: 12px; margin: 10px 0; border: 2px solid #8b4513; border-radius: 4px; background: #1a0f0b; color: #e0d0c0; resize: vertical; font-size: 16px;"></textarea>
            
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn btn-plus" onclick="addItem()">Добавить</button>
                <button class="btn btn-roll" onclick="this.closest('.popup').remove()">Отмена</button>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
}

function addItem() {
    const name = document.getElementById('itemName').value.trim();
    const category = document.getElementById('itemCategory').value;
    const quantity = parseInt(document.getElementById('itemQuantity').value) || 1;
    const description = document.getElementById('itemDescription').value.trim();
    
    if (!name) {
        alert('Введите название предмета!');
        return;
    }
    
    if (!inventory[category]) {
        inventory[category] = [];
    }
    
    inventory[category].push({
        id: Date.now(),
        name,
        quantity,
        description,
        expanded: false
    });
    
    saveInventory();
    renderInventory();
    document.querySelector('.popup').remove();
    alert('✅ Предмет добавлен в инвентарь!');
}

function renderInventory() {
    const container = document.getElementById('inventoryContainer');
    const searchTerm = document.getElementById('inventorySearch').value.toLowerCase();
    
    let inventoryHTML = '';
    
    const standardCategories = ['weapons', 'armor', 'potions', 'scrolls', 'resources', 'valuables', 'tools', 'other'];
    standardCategories.forEach(category => {
        if (inventory[category] && inventory[category].length > 0) {
            let filteredItems = inventory[category];
            if (searchTerm) {
                filteredItems = inventory[category].filter(item => 
                    item.name.toLowerCase().includes(searchTerm) ||
                    (item.description && item.description.toLowerCase().includes(searchTerm)) ||
                    (item.quantity && item.quantity.toString().includes(searchTerm))
                );
            }
            
            if (filteredItems.length > 0) {
                inventoryHTML += createCategoryHTML(category, filteredItems);
            }
        }
    });
    
    customCategories.forEach(categoryId => {
        if (inventory[categoryId] && inventory[categoryId].length > 0) {
            let filteredItems = inventory[categoryId];
            if (searchTerm) {
                filteredItems = inventory[categoryId].filter(item => 
                    item.name.toLowerCase().includes(searchTerm) ||
                    (item.description && item.description.toLowerCase().includes(searchTerm)) ||
                    (item.quantity && item.quantity.toString().includes(searchTerm))
                );
            }
            
            if (filteredItems.length > 0) {
                inventoryHTML += createCategoryHTML(categoryId, filteredItems);
            }
        }
    });
    
    container.innerHTML = inventoryHTML || '<p style="color: #8b7d6b; text-align: center;">Инвентарь пуст</p>';
}

function createCategoryHTML(category, items) {
    return `
        <div class="skills-section">
            <div class="section-title">${getCategoryName(category)}</div>
            ${items.map((item, index) => `
                <div class="inventory-item">
                    <div class="item-header">
                        <div class="item-name">
                            ${getCategoryIcon(category)}
                            ${item.name}
                            ${item.quantity > 1 ? `<span class="item-quantity">×${item.quantity}</span>` : ''}
                        </div>
                        <div class="item-actions">
                            <button class="btn btn-small" onclick="editItem('${category}', ${index})" style="background: #3498db;">✏️</button>
                            <button class="btn btn-small" onclick="deleteItem('${category}', ${index})" style="background: #c44536;">❌</button>
                            ${item.description ? `
                                <button class="btn btn-small" onclick="toggleItemExpand('${category}', ${index})" style="background: #8b4513;">
                                    ${item.expanded ? '▼' : '▶'}
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    ${item.description && item.expanded ? `
                        <div class="item-description">
                            ${item.description}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

function getCategoryName(category) {
    const customName = localStorage.getItem(`category_name_${category}`);
    if (customName) return customName;
    
    const names = {
        weapons: '⚔️ Оружие',
        armor: '🛡️ Броня',
        potions: '🧪 Зелья',
        scrolls: '📜 Свитки',
        resources: '💎 Ресурсы',
        valuables: '💰 Ценности',
        tools: '🔧 Инструменты',
        other: '🎒 Прочее'
    };
    return names[category] || category;
}

function getCategoryIcon(category) {
    const icons = {
        weapons: '⚔️',
        armor: '🛡️',
        potions: '🧪',
        scrolls: '📜',
        resources: '💎',
        valuables: '💰',
        tools: '🔧',
        other: '🎒'
    };
    return icons[category] || '📁';
}

function editItem(category, index) {
    const item = inventory[category][index];
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <h2 style="color: #d4af37;">Редактировать предмет</h2>
            <input type="text" id="editItemName" value="${item.name}" style="width: 100%; padding: 12px; margin: 10px 0; border: 2px solid #8b4513; border-radius: 4px; background: #1a0f0b; color: #e0d0c0; font-size: 16px;">
            
            <select id="editItemCategory" style="width: 100%; padding: 12px; margin: 10px 0; border: 2px solid #8b4513; border-radius: 4px; background: #1a0f0b; color: #e0d0c0; font-size: 16px;">
                <option value="weapons" ${category === 'weapons' ? 'selected' : ''}>⚔️ Оружие</option>
                <option value="armor" ${category === 'armor' ? 'selected' : ''}>🛡️ Броня</option>
                <option value="potions" ${category === 'potions' ? 'selected' : ''}>🧪 Зелья</option>
                <option value="scrolls" ${category === 'scrolls' ? 'selected' : ''}>📜 Свитки</option>
                <option value="resources" ${category === 'resources' ? 'selected' : ''}>💎 Ресурсы</option>
                <option value="valuables" ${category === 'valuables' ? 'selected' : ''}>💰 Ценности</option>
                <option value="tools" ${category === 'tools' ? 'selected' : ''}>🔧 Инструменты</option>
                <option value="other" ${category === 'other' ? 'selected' : ''}>🎒 Прочее</option>
                ${customCategories.map(catId => `
                    <option value="${catId}" ${category === catId ? 'selected' : ''}>${getCategoryName(catId)}</option>
                `).join('')}
            </select>
            
            <input type="number" id="editItemQuantity" value="${item.quantity}" min="1" style="width: 100%; padding: 12px; margin: 10px 0; border: 2px solid #8b4513; border-radius: 4px; background: #1a0f0b; color: #e0d0c0; font-size: 16px;">
            
            <textarea id="editItemDescription" style="width: 100%; height: 120px; padding: 12px; margin: 10px 0; border: 2px solid #8b4513; border-radius: 4px; background: #1a0f0b; color: #e0d0c0; resize: vertical; font-size: 16px;">${item.description}</textarea>
            
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn btn-plus" onclick="saveEditedItem('${category}', ${index})">Сохранить</button>
                <button class="btn btn-roll" onclick="this.closest('.popup').remove()">Отмена</button>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
}

function saveEditedItem(oldCategory, index) {
    const name = document.getElementById('editItemName').value.trim();
    const newCategory = document.getElementById('editItemCategory').value;
    const quantity = parseInt(document.getElementById('editItemQuantity').value) || 1;
    const description = document.getElementById('editItemDescription').value.trim();
    
    if (!name) {
        alert('Введите название предмета!');
        return;
    }
    
    const item = inventory[oldCategory].splice(index, 1)[0];
    
    item.name = name;
    item.quantity = quantity;
    item.description = description;
    
    if (!inventory[newCategory]) {
        inventory[newCategory] = [];
    }
    inventory[newCategory].push(item);
    
    saveInventory();
    renderInventory();
    document.querySelector('.popup').remove();
}

function deleteItem(category, index) {
    if (confirm('Удалить этот предмет?')) {
        inventory[category].splice(index, 1);
        saveInventory();
        renderInventory();
    }
}

function toggleItemExpand(category, index) {
    inventory[category][index].expanded = !inventory[category][index].expanded;
    saveInventory();
    renderInventory();
}

// ========== ПОЛЬЗОВАТЕЛЬСКИЕ КАТЕГОРИИ ==========
function showAddCategoryPopup() {
    document.getElementById('customCategoriesSection').style.display = 'block';
}

function addCustomCategory() {
    const categoryName = document.getElementById('newCategoryName').value.trim();
    if (!categoryName) {
        alert('Введите название раздела!');
        return;
    }

    const categoryId = categoryName.toLowerCase().replace(/[^a-z0-9а-я]/g, '_');
    
    if (inventory.hasOwnProperty(categoryId) || customCategories.includes(categoryId)) {
        alert('Раздел с таким названием уже существует!');
        return;
    }

    customCategories.push(categoryId);
    inventory[categoryId] = [];
    saveCustomCategories();
    saveInventory();
    
    document.getElementById('newCategoryName').value = '';
    updateCategoryManagement();
    renderInventory();
    
    alert(`✅ Раздел "${categoryName}" создан!`);
}

function updateCategoryManagement() {
    const container = document.getElementById('customCategoriesList');
    if (customCategories.length === 0) {
        container.innerHTML = '<p style="color: #8b7d6b; text-align: center;">Пользовательских разделов нет</p>';
        return;
    }

    let html = '';
    customCategories.forEach(categoryId => {
        const categoryName = getCategoryName(categoryId);
        const itemCount = inventory[categoryId] ? inventory[categoryId].length : 0;
        
        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #2c1810; margin: 5px 0; border-radius: 4px;">
                <span>${categoryName} (${itemCount} предметов)</span>
                <div>
                    <button class="btn btn-small" onclick="editCustomCategory('${categoryId}')" style="background: #3498db;">✏️</button>
                    <button class="btn btn-small" onclick="deleteCustomCategory('${categoryId}')" style="background: #c44536;">❌</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function editCustomCategory(categoryId) {
    const newName = prompt('Введите новое название раздела:', getCategoryName(categoryId));
    if (newName && newName.trim()) {
        localStorage.setItem(`category_name_${categoryId}`, newName.trim());
        updateCategoryManagement();
        renderInventory();
    }
}

function deleteCustomCategory(categoryId) {
    if (inventory[categoryId] && inventory[categoryId].length > 0) {
        if (!confirm(`В разделе есть предметы! Удалить раздел "${getCategoryName(categoryId)}" и все его предметы?`)) {
            return;
        }
    } else {
        if (!confirm(`Удалить раздел "${getCategoryName(categoryId)}"?`)) {
            return;
        }
    }

    customCategories = customCategories.filter(id => id !== categoryId);
    delete inventory[categoryId];
    localStorage.removeItem(`category_name_${categoryId}`);
    
    saveCustomCategories();
    saveInventory();
    updateCategoryManagement();
    renderInventory();
}
