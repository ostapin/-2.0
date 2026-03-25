// Функция для открытия книги в модальном окне
function openBook(filePath) {
    // Создаём модальное окно
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.85)';
    modal.style.zIndex = '9999';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    
    // Контейнер для содержимого
    const content = document.createElement('div');
    content.style.backgroundColor = '#2a1a0f';
    content.style.border = '2px solid #d4af37';
    content.style.borderRadius = '12px';
    content.style.width = '80%';
    content.style.height = '80%';
    content.style.overflow = 'auto';
    content.style.padding = '30px';
    content.style.position = 'relative';
    content.style.color = '#e0d0c0';
    content.style.fontFamily = 'Georgia, serif';
    content.style.lineHeight = '1.6';
    
    // Кнопка закрытия
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✖';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '15px';
    closeBtn.style.right = '25px';
    closeBtn.style.backgroundColor = '#8b4513';
    closeBtn.style.color = 'white';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '50%';
    closeBtn.style.width = '35px';
    closeBtn.style.height = '35px';
    closeBtn.style.fontSize = '18px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.zIndex = '10000';
    
    closeBtn.onclick = function() {
        document.body.removeChild(modal);
    };
    
    // Загружаем содержимое книги
    fetch(filePath)
        .then(response => response.text())
        .then(html => {
            content.innerHTML = html;
            content.appendChild(closeBtn);
            modal.appendChild(content);
            document.body.appendChild(modal);
        })
        .catch(error => {
            content.innerHTML = `<p style="color: #ff6b6b;">❌ Ошибка загрузки книги: ${error.message}</p>`;
            content.appendChild(closeBtn);
            modal.appendChild(content);
            document.body.appendChild(modal);
        });
    
    // Закрытие по клику вне окна
    modal.onclick = function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
}
