// Система драгоценных камней
const gemsSystem = {
    // Таблица выпадения камней
    gemTable: [
        { min: 1, max: 30, name: "Аметист", basePrice: 150 },
        { min: 31, max: 50, name: "Аметист", basePrice: 150 },
        { min: 51, max: 65, name: "Гранат", basePrice: 400 },
        { min: 66, max: 80, name: "Корунд (сапфир)", basePrice: 550 },
        { min: 81, max: 92, name: "Берилл (изумруд)", basePrice: 600 },
        { min: 93, max: 100, name: "Алмаз", basePrice: 750 }
    ],
    
    // Таблица чистоты
    purityTable: [
        { min: 0, max: 20, multiplier: 0.5 },
        { min: 21, max: 40, multiplier: 0.7 },
        { min: 41, max: 60, multiplier: 1.0 },
        { min: 61, max: 80, multiplier: 1.2 },
        { min: 81, max: 100, multiplier: 1.5 }
    ],
    
    // Введение
    introduction: `
        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">💎 ЧТО ЭТО ТАКОЕ:</h3>
            <p style="color: #e0d0c0;">Таблица используется для определения того, какой драгоценный камень находит персонаж и сколько он стоит. Каждый камень имеет базовую цену, которая умножается на множитель чистоты.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🎲 КАК ЭТО РАБОТАЕТ:</h3>
            <p style="color: #e0d0c0;">1. Первый бросок d100 определяет, какой камень выпал</p>
            <p style="color: #e0d0c0;">2. Второй бросок d100 определяет чистоту камня</p>
            <p style="color: #e0d0c0;">3. Цена камня = базовая цена × множитель чистоты</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📊 ТАБЛИЦА ВЫПАДЕНИЯ КАМНЕЙ (d100):</h3>
            <div style="display: grid; grid-template-columns: 100px 1fr; gap: 8px;">
                <div style="color: #d4af37;">1-30</div><div style="color: #e0d0c0;">Аметист</div>
                <div style="color: #d4af37;">31-50</div><div style="color: #e0d0c0;">Аметист</div>
                <div style="color: #d4af37;">51-65</div><div style="color: #e0d0c0;">Гранат</div>
                <div style="color: #d4af37;">66-80</div><div style="color: #e0d0c0;">Корунд (сапфир)</div>
                <div style="color: #d4af37;">81-92</div><div style="color: #e0d0c0;">Берилл (изумруд)</div>
                <div style="color: #d4af37;">93-100</div><div style="color: #e0d0c0;">Алмаз</div>
            </div>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📊 ТАБЛИЦА ЧИСТОТЫ КАМНЯ (d100):</h3>
            <div style="display: grid; grid-template-columns: 100px 1fr; gap: 8px;">
                <div style="color: #d4af37;">0-20</div><div style="color: #e0d0c0;">Множитель 0.5</div>
                <div style="color: #d4af37;">21-40</div><div style="color: #e0d0c0;">Множитель 0.7</div>
                <div style="color: #d4af37;">41-60</div><div style="color: #e0d0c0;">Множитель 1.0</div>
                <div style="color: #d4af37;">61-80</div><div style="color: #e0d0c0;">Множитель 1.2</div>
                <div style="color: #d4af37;">81-100</div><div style="color: #e0d0c0;">Множитель 1.5</div>
            </div>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">💰 БАЗОВЫЕ ЦЕНЫ КАМНЕЙ:</h3>
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 8px;">
                <div style="color: #d4af37;">Аметист</div><div style="color: #e0d0c0;">150</div>
                <div style="color: #d4af37;">Гранат</div><div style="color: #e0d0c0;">400</div>
                <div style="color: #d4af37;">Корунд (сапфир)</div><div style="color: #e0d0c0;">550</div>
                <div style="color: #d4af37;">Берилл (изумруд)</div><div style="color: #e0d0c0;">600</div>
                <div style="color: #d4af37;">Алмаз</div><div style="color: #e0d0c0;">750</div>
            </div>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📝 ПРИМЕР:</h3>
            <div style="color: #e0d0c0;">
                Первый бросок d100: 45 → Аметист (база 150)<br>
                Второй бросок d100: 85 → множитель 1.5<br>
                Итоговая цена: 150 × 1.5 = 225
            </div>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🎯 ТЕСТ ДРОБИЛКИ:</h3>
            <p style="color: #e0d0c0;">Нажмите кнопку для тестового поиска драгоценного камня.</p>
            <button class="btn btn-roll" onclick="testGem()" style="margin-top: 10px;">💎 Найти камень</button>
            <div id="gemTestResult" style="margin-top: 15px; color: #d4af37;"></div>
        </div>
    `,
    
    // Функция для получения камня по броску
    getGem: function(roll) {
        for (let i = 0; i < this.gemTable.length; i++) {
            if (roll >= this.gemTable[i].min && roll <= this.gemTable[i].max) {
                return this.gemTable[i];
            }
        }
        return { name: "Неизвестный камень", basePrice: 0 };
    },
    
    // Функция для получения множителя чистоты
    getPurity: function(roll) {
        for (let i = 0; i < this.purityTable.length; i++) {
            if (roll >= this.purityTable[i].min && roll <= this.purityTable[i].max) {
                return this.purityTable[i];
            }
        }
        return { multiplier: 1.0 };
    },
    
    // Функция для расчёта цены
    calculatePrice: function(basePrice, multiplier) {
        return Math.floor(basePrice * multiplier);
    }
};

// Тестовая функция для камней
window.testGem = function() {
    const gemRoll = Math.floor(Math.random() * 100) + 1;
    const purityRoll = Math.floor(Math.random() * 100) + 1;
    
    const gem = gemsSystem.getGem(gemRoll);
    const purity = gemsSystem.getPurity(purityRoll);
    const price = gemsSystem.calculatePrice(gem.basePrice, purity.multiplier);
    
    document.getElementById('gemTestResult').innerHTML = `
        💎 Первый бросок (камень): ${gemRoll}<br>
        🪨 Камень: ${gem.name}<br>
        💰 Базовая цена: ${gem.basePrice}<br>
        🧼 Второй бросок (чистота): ${purityRoll}<br>
        📊 Множитель: ${purity.multiplier}<br>
        ✨ Итоговая цена: ${price}
    `;
};
