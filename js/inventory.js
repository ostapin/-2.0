// ========== СИСТЕМА ЗАМЕТОК ==========

function showAddNotePopup() {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <h2 style="color: #d4af37;">Добавить заметку</h2>
            <input type="text" id="noteTitle" placeholder="Название заметки" style="width: 100%; padding: 12px; margin: 10px 0; border: 2px solid #8b4513; border-radius: 4px; background: #1a0f0b; color: #e0d0c0; font-size: 16px;">
            <textarea id="noteContent" placeholder="Текст заметки" style="width: 100%; height: 200px; padding: 12px; margin: 10px 0; border: 2px solid #8b4513; border-radius: 4px; background: #1a0f0b; color: #e0d0c0; resize: vertical; font-size: 16px;"></textarea>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn btn-plus" onclick="addNote()">Добавить</button>
                <button class="btn btn-roll" onclick="this.closest('.popup').remove()">Отмена</button>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
}

function addNote() {
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    
    if (!title) {
        alert('Введите название заметки!');
        return;
    }
    
    notes.push({
        id: Date.now(),
        title,
        content,
        expanded: false
    });
    
    saveNotes();
    renderNotes();
    document.querySelector('.popup').remove();
}

function renderNotes() {
    const container = document.getElementById('notesContainer');
    const searchTerm = document.getElementById('notesSearch').value.toLowerCase();
    
    let filteredNotes = notes;
    if (searchTerm) {
        filteredNotes = notes.filter(note => 
            note.title.toLowerCase().includes(searchTerm) || 
            note.content.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filteredNotes.length === 0) {
        container.innerHTML = '<p style="color: #8b7d6b; text-align: center;">Заметок нет</p>';
        return;
    }
    
    let notesHTML = '';
    filteredNotes.forEach((note, index) => {
        const preview = note.content.length > 100 ? note.content.substring(0, 100) + '...' : note.content;
        notesHTML += `
            <div class="note-item">
                <div class="note-header">
                    <span class="note-title">${note.title}</span>
                    <div class="note-actions">
                        <button class="btn btn-small" onclick="editNote(${index})" style="background: #3498db;">✏️</button>
                        <button class="btn btn-small" onclick="deleteNote(${index})" style="background: #c44536;">❌</button>
                        <button class="btn btn-small" onclick="toggleNoteExpand(${index})" style="background: #8b4513;">
                            ${note.expanded ? '▼' : '▶'}
                        </button>
                    </div>
                </div>
                <div class="note-preview">
                    ${note.expanded ? note.content : preview}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = notesHTML;
}

function editNote(index) {
    const note = notes[index];
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <h2 style="color: #d4af37;">Редактировать заметку</h2>
            <input type="text" id="editNoteTitle" value="${note.title}" style="width: 100%; padding: 12px; margin: 10px 0; border: 2px solid #8b4513; border-radius: 4px; background: #1a0f0b; color: #e0d0c0; font-size: 16px;">
            <textarea id="editNoteContent" style="width: 100%; height: 200px; padding: 12px; margin: 10px 0; border: 2px solid #8b4513; border-radius: 4px; background: #1a0f0b; color: #e0d0c0; resize: vertical; font-size: 16px;">${note.content}</textarea>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn btn-plus" onclick="saveEditedNote(${index})">Сохранить</button>
                <button class="btn btn-roll" onclick="this.closest('.popup').remove()">Отмена</button>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
}

function saveEditedNote(index) {
    const title = document.getElementById('editNoteTitle').value.trim();
    const content = document.getElementById('editNoteContent').value.trim();
    
    if (!title) {
        alert('Введите название заметки!');
        return;
    }
    
    notes[index].title = title;
    notes[index].content = content;
    
    saveNotes();
    renderNotes();
    document.querySelector('.popup').remove();
}

function deleteNote(index) {
    if (confirm('Удалить эту заметку?')) {
        notes.splice(index, 1);
        saveNotes();
        renderNotes();
    }
}

function toggleNoteExpand(index) {
    notes[index].expanded = !notes[index].expanded;
    saveNotes();
    renderNotes();
}
