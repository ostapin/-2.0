// 09-books.js - Книги
function renderBooks() {
    const resultsList = document.getElementById('resultsList');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!resultsList) return;
    
    resultsTitle.innerHTML = '📚 Книги';
    
    let allBooks = [];
    let ids = new Set();
    
    if (typeof booksData !== 'undefined') {
        for (let i = 0; i < booksData.length; i++) {
            if (!ids.has(booksData[i].id)) {
                ids.add(booksData[i].id);
                allBooks.push(booksData[i]);
            }
        }
    }
    
    if (typeof booksDataSkills !== 'undefined') {
        for (let i = 0; i < booksDataSkills.length; i++) {
            if (!ids.has(booksDataSkills[i].id)) {
                ids.add(booksDataSkills[i].id);
                allBooks.push(booksDataSkills[i]);
            }
        }
    }
    
    if (allBooks.length === 0) {
        resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные о книгах не загружены</p>';
        return;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
    
    for (let i = 0; i < allBooks.length; i++) {
        const book = allBooks[i];
        let readButton = '';
        if (book.file && book.file !== '') {
            readButton = `<button class="btn btn-roll" onclick="openBook('${book.file}')" style="background: #8b4513;">📖 Читать</button>`;
        }
        
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 5px;">📖 ${book.title}</h3>
                ${book.author ? `<p style="color: #b89a7a; margin-bottom: 10px;">Автор: ${book.author}</p>` : ''}
                <p style="color: #e0d0c0; margin-bottom: 15px;">${book.description}</p>
                ${readButton}
            </div>
        `;
    }
    
    html += '</div>';
    resultsList.innerHTML = html;
}

function openBook(filePath) {
    if (!filePath) return;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: #1a0f0b;
        border: 3px solid #d4af37;
        border-radius: 8px;
        width: 80%;
        max-width: 900px;
        height: 80%;
        display: flex;
        flex-direction: column;
        position: relative;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✖';
    closeBtn.style.cssText = `
        position: absolute;
        right: 10px;
        top: 10px;
        background: #8b4513;
        color: #d4af37;
        border: none;
        font-size: 20px;
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 4px;
        z-index: 10;
    `;
    closeBtn.onclick = () => modal.remove();
    
    const textContainer = document.createElement('div');
    textContainer.style.cssText = `
        flex: 1;
        overflow-y: auto;
        padding: 30px;
        color: #e0d0c0;
        font-family: 'Arial', serif;
        line-height: 1.6;
    `;
    textContainer.innerHTML = '<p style="color: #8b7d6b; text-align: center;">Загрузка книги...</p>';
    
    content.appendChild(closeBtn);
    content.appendChild(textContainer);
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    fetch(filePath)
        .then(response => {
            if (!response.ok) throw new Error('Книга не найдена');
            return response.text();
        })
        .then(html => {
            textContainer.innerHTML = html;
        })
        .catch(error => {
            textContainer.innerHTML = '<p style="color: #b89a7a; text-align: center;">❌ Ошибка загрузки книги</p>';
            console.error('Ошибка:', error);
        });
    
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}
