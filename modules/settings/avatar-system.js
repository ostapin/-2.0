// Система аватарок и изображений профиля
class AvatarSystem {
    constructor() {
        this.defaultAvatars = [
            '👤', '👨', '👩', '🧙', '👑', '⚔️', '🛡️', '🔮', '🏹', '⚗️',
            '🧝', '🧙‍♂️', '🧙‍♀️', '🧛', '🧟', '🐉', '🐲', '🦄', '🐺', '🦅'
        ];
        
        this.raceAvatars = {
            atski: ['🔥', '👳', '🗡️', '🏹'],
            knofi: ['🗣️', '🏛️', '⚔️', '🛡️'],
            vorki: ['❄️', '🐻', '⚔️', '🪓'],
            minci: ['🎯', '🥷', '🗡️', '🏹'],
            kaei: ['⚒️', '🔨', '⛏️', '⚔️'],
            forest_elf: ['🌿', '🏹', '🍃', '🦌'],
            high_elf: ['✨', '🔮', '👑', '💫'],
            dark_elf: ['🌑', '🗡️', '🕷️', '☠️'],
            dwarf: ['⛰️', '⛏️', '🪓', '🍺'],
            gnome: ['🔮', '⚙️', '🔧', '💎'],
            orc: ['💀', '🪓', '⚔️', '🦷'],
            goblin: ['👹', '🗡️', '💰', '💎']
        };
        
        this.avatar = null;
    }

    init() {
        this.loadAvatar();
    }

    loadAvatar() {
        if (!authSystem?.currentUser?.id) return;
        
        // Пробуем загрузить из локального хранилища
        const localAvatar = localStorage.getItem(`avatar_${authSystem.currentUser.id}`);
        if (localAvatar) {
            this.avatar = localAvatar;
            this.updateAllAvatars();
            return;
        }
        
        // Если нет локально, пробуем из Firestore
        this.loadAvatarFromFirestore();
    }

    async loadAvatarFromFirestore() {
        if (!firebaseConfig.isOnline() || !authSystem?.currentUser?.id) return;
        
        try {
            const db = firebaseConfig.getDatabase();
            const userDoc = await db.collection('users')
                .doc(authSystem.currentUser.id)
                .get();
                
            if (userDoc.exists && userDoc.data().avatar) {
                this.avatar = userDoc.data().avatar;
                localStorage.setItem(`avatar_${authSystem.currentUser.id}`, this.avatar);
                this.updateAllAvatars();
            }
        } catch (error) {
            console.error('Ошибка загрузки аватарки:', error);
        }
    }

    async saveAvatar(avatar) {
        if (!authSystem?.currentUser?.id) return false;
        
        this.avatar = avatar;
        
        // Сохраняем локально
        localStorage.setItem(`avatar_${authSystem.currentUser.id}`, avatar);
        
        // Сохраняем в Firestore если онлайн
        if (firebaseConfig.isOnline()) {
            try {
                const db = firebaseConfig.getDatabase();
                await db.collection('users')
                    .doc(authSystem.currentUser.id)
                    .set({
                        avatar: avatar,
                        updatedAt: new Date().toISOString()
                    }, { merge: true });
                    
                console.log('✅ Аватарка сохранена в облако');
                return true;
            } catch (error) {
                console.error('❌ Ошибка сохранения аватарки:', error);
                return false;
            }
        }
        
        return true;
    }

    // Определяет тип аватара
    getAvatarType(avatar) {
        if (!avatar) return 'emoji';
        
        // Проверяем base64 картинку
        if (avatar.startsWith('data:image/')) {
            return 'image';
        }
        
        // Проверяем URL картинки
        if (avatar.startsWith('http') && 
            (avatar.includes('.jpg') || avatar.includes('.png') || 
             avatar.includes('.jpeg') || avatar.includes('.gif') ||
             avatar.includes('.webp'))) {
            return 'image';
        }
        
        // Проверяем эмодзи (простая проверка)
        if (avatar.length <= 3 || this.isEmoji(avatar)) {
            return 'emoji';
        }
        
        // По умолчанию считаем текстом
        return 'text';
    }

    updateAvatarPreview() {
        const preview = document.getElementById('avatar-preview');
        if (!preview || !this.avatar) return;
        
        preview.innerHTML = '';
        const type = this.getAvatarType(this.avatar);
        
        if (type === 'image') {
            // Это картинка - создаем img элемент
            const imgEl = document.createElement('img');
            imgEl.className = 'avatar-image';
            imgEl.src = this.avatar;
            imgEl.alt = 'Аватар';
            preview.appendChild(imgEl);
        } 
        else if (type === 'emoji') {
            // Это эмодзи - показываем как текст
            const emojiEl = document.createElement('div');
            emojiEl.className = 'avatar-emoji';
            emojiEl.textContent = this.avatar;
            preview.appendChild(emojiEl);
        }
        else {
            // Простой текст (первая буква)
            const textEl = document.createElement('div');
            textEl.className = 'avatar-text';
            textEl.textContent = this.avatar.charAt(0).toUpperCase();
            preview.appendChild(textEl);
        }
    }

    // Проверка является ли строка эмодзи
    isEmoji(str) {
        // Простая проверка: эмодзи обычно 2 символа или 1 символ с высоким кодом
        return str.length === 2 || 
               (str.length === 1 && str.charCodeAt(0) > 127) ||
               str.includes('️'); // Символ вариационного селектора
    }

    // Обновление всех аватаров на странице
    updateAllAvatars() {
        if (!this.avatar) return;
        
        const type = this.getAvatarType(this.avatar);
        
        // Обновляем превью в настройках
        this.updateAvatarPreview();
        
        // Обновляем кнопку аккаунта
        const accountBtn = document.getElementById('account-btn');
        if (accountBtn) {
            if (type === 'image') {
                accountBtn.innerHTML = '🖼️'; // Иконка для картинки
            } else {
                accountBtn.innerHTML = this.avatar;
            }
        }
        
        // Обновляем аватар в шторке
        const drawerAvatar = document.querySelector('.user-avatar');
        if (drawerAvatar) {
            if (type === 'image') {
                drawerAvatar.innerHTML = '<span style="font-size:0.8em;">🖼️</span>';
            } else {
                drawerAvatar.textContent = this.avatar;
            }
        }
        
        // Обновляем все элементы с классом .account-avatar
        const accountAvatars = document.querySelectorAll('.account-avatar');
        accountAvatars.forEach(el => {
            if (type === 'image') {
                el.innerHTML = '<span style="font-size:0.8em;">🖼️</span>';
            } else {
                el.textContent = this.avatar;
            }
        });
    }

    showAvatarSelector() {
        const modalHTML = `
            <div class="modal" id="avatar-selector-modal">
                <div class="auth-container">
                    <div class="auth-header">
                        <h2>🖼️ Выберите аватарку</h2>
                        <button class="close-btn" onclick="avatarSystem.closeSelector()">×</button>
                    </div>
                    
                    <div class="avatar-selector-content">
                        <!-- Стандартные аватары -->
                        <div class="avatar-category">
                            <h3>Стандартные</h3>
                            <div class="avatar-grid" id="default-avatars">
                                ${this.defaultAvatars.map(avatar => `
                                    <div class="avatar-option" onclick="avatarSystem.selectAvatar('${avatar}')">
                                        ${avatar}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- По расам -->
                        <div class="avatar-category">
                            <h3>По расам</h3>
                            ${Object.entries(this.raceAvatars).map(([race, avatars]) => `
                                <div class="avatar-race-group">
                                    <h4>${races[race]?.name || race}</h4>
                                    <div class="avatar-grid">
                                        ${avatars.map(avatar => `
                                            <div class="avatar-option" onclick="avatarSystem.selectAvatar('${avatar}')">
                                                ${avatar}
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <!-- Загрузка своего -->
                        <div class="avatar-category">
                            <h3>Загрузить своё изображение</h3>
                            <input type="file" id="avatar-upload" accept="image/*" 
                                   onchange="avatarSystem.handleImageUpload(event)" style="display: none;">
                            <button class="btn btn-roll" onclick="document.getElementById('avatar-upload').click()">
                                📁 Выбрать файл
                            </button>
                            <p style="color: #8b7d6b; font-size: 0.9em; margin-top: 10px;">
                                Поддерживаются PNG, JPG до 2MB
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    selectAvatar(avatar) {
        this.saveAvatar(avatar);
        this.closeSelector();
        this.updateAllAvatars();
    }

    async handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Проверяем размер
        if (file.size > 2 * 1024 * 1024) {
            alert('Файл слишком большой! Максимум 2MB');
            return;
        }
        
        // Проверяем тип
        if (!file.type.startsWith('image/')) {
            alert('Выберите изображение!');
            return;
        }
        
        // Конвертируем в base64
        const reader = new FileReader();
        reader.onload = (e) => {
            this.selectAvatar(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    closeSelector() {
        const modal = document.getElementById('avatar-selector-modal');
        if (modal) modal.remove();
    }

    // Генерация аватарки по имени
    generateAvatarFromName(name) {
        if (!name) return '👤';
        
        // Цвет на основе имени
        const colors = [
            '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0',
            '#118AB2', '#EF476F', '#073B4C', '#7209B7'
        ];
        const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
        
        // Первая буква имени
        const initial = name.charAt(0).toUpperCase();
        
        return `
            <div style="
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background: ${colors[colorIndex]};
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 40px;
                font-weight: bold;
                color: white;
            ">
                ${initial}
            </div>
        `;
    }

    getCurrentAvatar() {
        return this.avatar || '👤';
    }
}

// Создаём глобальный экземпляр
const avatarSystem = new AvatarSystem();

// Инициализируем при загрузке
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (typeof authSystem !== 'undefined') {
            avatarSystem.init();
        }
    }, 500);
});
