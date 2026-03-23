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
        { min: 0, max: 20, multiplier: 0.5, name: "Плохая" },
        { min: 21, max: 40, multiplier: 0.7, name: "Низкая" },
        { min: 41, max: 60, multiplier: 1.0, name: "Средняя" },
        { min: 61, max: 80, multiplier: 1.2, name: "Хорошая" },
        { min: 81, max: 100, multiplier: 1.5, name: "Отличная" }
    ],
    
    // Таблица пригодности огранки
    suitabilityTable: [
        { min: 1, max: 10, multiplier: 0.2, name: "Ужасная", loss: "80%" },
        { min: 11, max: 25, multiplier: 0.5, name: "Плохая", loss: "50%" },
        { min: 26, max: 50, multiplier: 0.7, name: "Средняя", loss: "30%" },
        { min: 51, max: 75, multiplier: 0.8, name: "Хорошая", loss: "20%" },
        { min: 76, max: 90, multiplier: 0.9, name: "Отличная", loss: "10%" },
        { min: 91, max: 100, multiplier: 0.95, name: "Идеальная", loss: "5%" }
    ],
    
    // Функция для получения размера камня (с весовыми коэффициентами)
    getSize: function() {
        const rand = Math.random() * 1000;
        
        if (rand < 900) {
            // 90% - 0.1-1 карат
            return 0.1 + Math.random() * 0.9;
        }
        else if (rand < 980) {
            // 8% - 1-5 карат
            return 1 + Math.random() * 4;
        }
        else if (rand < 995) {
            // 1.5% - 5-10 карат
            return 5 + Math.random() * 5;
        }
        else if (rand < 999) {
            // 0.4% - 10-50 карат
            return 10 + Math.random() * 40;
        }
        else if (rand < 999.8) {
            // 0.08% - 50-100 карат
            return 50 + Math.random() * 50;
        }
        else if (rand < 1000) {
            // 0.02% - 100-1000 карат
            return 100 + Math.random() * 900;
        }
        else {
            // 0.0005% - 1000-10000 карат
            return 1000 + Math.random() * 9000;
        }
    },
    
    // Функция для получения размера с внутренним распределением (для диапазона)
    getSizeInRange: function(min, max, distribution) {
        const rand = Math.random() * 100;
        let cumulative = 0;
        
        for (let i = 0; i < distribution.length; i++) {
            cumulative += distribution[i].chance;
            if (rand < cumulative) {
                const subMin = distribution[i].min;
                const subMax = distribution[i].max;
                return subMin + Math.random() * (subMax - subMin);
            }
        }
        return min + Math.random() * (max - min);
    },
    
    // Введение
    introduction: `
        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">💎 ЧТО ЭТО ТАКОЕ:</h3>
            <p style="color: #e0d0c0;">Система генерации драгоценных камней с учётом типа, чистоты, размера и пригодности огранки. Все параметры определяются случайно.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🎲 КАК ЭТО РАБОТАЕТ:</h3>
            <p style="color: #e0d0c0;">1. Первый бросок d100 определяет тип камня</p>
            <p style="color: #e0d0c0;">2. Второй бросок d100 определяет чистоту камня (множитель 0.5-1.5)</p>
            <p style="color: #e0d0c0;">3. Третий бросок определяет размер в каратах (чем крупнее, тем реже)</p>
            <p style="color: #e0d0c0;">4. Четвёртый бросок d100 определяет пригодность огранки (множитель 0.2-0.95)</p>
            <p style="color: #e0d0c0;">5. Цена = базовая цена × размер × чистоту × пригодность</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📊 ТАБЛИЦА ВЫПАДЕНИЯ КАМНЕЙ (d100):</h3>
            <div style="display: grid; grid-template-columns: 100px 1fr 100px; gap: 8px;">
                <div style="color: #d4af37;">Диапазон</div>
                <div style="color: #d4af37;">Камень</div>
                <div style="color: #d4af37;">Цена/карат</div>
                <div style="color: #e0d0c0;">1-30</div><div style="color: #e0d0c0;">Аметист</div><div style="color: #e0d0c0;">150</div>
                <div style="color: #e0d0c0;">31-50</div><div style="color: #e0d0c0;">Аметист</div><div style="color: #e0d0c0;">150</div>
                <div style="color: #e0d0c0;">51-65</div><div style="color: #e0d0c0;">Гранат</div><div style="color: #e0d0c0;">400</div>
                <div style="color: #e0d0c0;">66-80</div><div style="color: #e0d0c0;">Корунд (сапфир)</div><div style="color: #e0d0c0;">550</div>
                <div style="color: #e0d0c0;">81-92</div><div style="color: #e0d0c0;">Берилл (изумруд)</div><div style="color: #e0d0c0;">600</div>
                <div style="color: #e0d0c0;">93-100</div><div style="color: #e0d0c0;">Алмаз</div><div style="color: #e0d0c0;">750</div>
            </div>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📊 ТАБЛИЦА ЧИСТОТЫ (d100):</h3>
            <div style="display: grid; grid-template-columns: 100px 1fr 80px; gap: 8px;">
                <div style="color: #d4af37;">Диапазон</div>
                <div style="color: #d4af37;">Качество</div>
                <div style="color: #d4af37;">Множитель</div>
                <div style="color: #e0d0c0;">0-20</div><div style="color: #e0d0c0;">Плохая</div><div style="color: #e0d0c0;">0.5</div>
                <div style="color: #e0d0c0;">21-40</div><div style="color: #e0d0c0;">Низкая</div><div style="color: #e0d0c0;">0.7</div>
                <div style="color: #e0d0c0;">41-60</div><div style="color: #e0d0c0;">Средняя</div><div style="color: #e0d0c0;">1.0</div>
                <div style="color: #e0d0c0;">61-80</div><div style="color: #e0d0c0;">Хорошая</div><div style="color: #e0d0c0;">1.2</div>
                <div style="color: #e0d0c0;">81-100</div><div style="color: #e0d0c0;">Отличная</div><div style="color: #e0d0c0;">1.5</div>
            </div>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📊 ТАБЛИЦА ПРИГОДНОСТИ ОГРАНКИ (d100):</h3>
            <div style="display: grid; grid-template-columns: 100px 1fr 80px 80px; gap: 8px;">
                <div style="color: #d4af37;">Диапазон</div>
                <div style="color: #d4af37;">Пригодность</div>
                <div style="color: #d4af37;">Множитель</div>
                <div style="color: #d4af37;">Потери</div>
                <div style="color: #e0d0c0;">1-10</div><div style="color: #e0d0c0;">Ужасная</div><div style="color: #e0d0c0;">0.2</div><div style="color: #e0d0c0;">80%</div>
                <div style="color: #e0d0c0;">11-25</div><div style="color: #e0d0c0;">Плохая</div><div style="color: #e0d0c0;">0.5</div><div style="color: #e0d0c0;">50%</div>
                <div style="color: #e0d0c0;">26-50</div><div style="color: #e0d0c0;">Средняя</div><div style="color: #e0d0c0;">0.7</div><div style="color: #e0d0c0;">30%</div>
                <div style="color: #e0d0c0;">51-75</div><div style="color: #e0d0c0;">Хорошая</div><div style="color: #e0d0c0;">0.8</div><div style="color: #e0d0c0;">20%</div>
                <div style="color: #e0d0c0;">76-90</div><div style="color: #e0d0c0;">Отличная</div><div style="color: #e0d0c0;">0.9</div><div style="color: #e0d0c0;">10%</div>
                <div style="color: #e0d0c0;">91-100</div><div style="color: #e0d0c0;">Идеальная</div><div style="color: #e0d0c0;">0.95</div><div style="color: #e0d0c0;">5%</div>
            </div>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📊 РАСПРЕДЕЛЕНИЕ РАЗМЕРОВ:</h3>
            <div style="display: grid; grid-template-columns: 150px 1fr; gap: 8px;">
                <div style="color: #d4af37;">0.1-1 карат</div><div style="color: #e0d0c0;">90% камней</div>
                <div style="color: #d4af37;">1-5 карат</div><div style="color: #e0d0c0;">8% камней</div>
                <div style="color: #d4af37;">5-10 карат</div><div style="color: #e0d0c0;">1.5% камней</div>
                <div style="color: #d4af37;">10-50 карат</div><div style="color: #e0d0c0;">0.4% камней</div>
                <div style="color: #d4af37;">50-100 карат</div><div style="color: #e0d0c0;">0.08% камней</div>
                <div style="color: #d4af37;">100-1000 карат</div><div style="color: #e0d0c0;">0.02% камней</div>
                <div style="color: #d4af37;">1000-10000 карат</div><div style="color: #e0d0c0;">0.0005% камней</div>
            </div>
            <p style="color: #8b7d6b; margin-top: 10px;">* Внутри каждого диапазона камни ближе к нижней границе встречаются чаще</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📝 ПРИМЕР:</h3>
            <div style="color: #e0d0c0;">
                Бросок на тип: 95 → Алмаз (база 750)<br>
                Бросок на чистоту: 85 → отличная (1.5)<br>
                Бросок на размер: попадание в 0.4% → 27.8 карат<br>
                Бросок на пригодность: 95 → идеальная (0.95)<br>
                Итог: 750 × 27.8 × 1.5 × 0.95 = 29,711 золотых
            </div>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🎯 ТЕСТ ГЕНЕРАЦИИ:</h3>
            <p style="color: #e0d0c0;">Нажмите кнопку для тестовой генерации драгоценного камня.</p>
            <button class="btn btn-roll" onclick="testGem()" style="margin-top: 10px;">💎 Сгенерировать камень</button>
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
        return { multiplier: 1.0, name: "Средняя" };
    },
    
    // Функция для получения множителя пригодности
    getSuitability: function(roll) {
        for (let i = 0; i < this.suitabilityTable.length; i++) {
            if (roll >= this.suitabilityTable[i].min && roll <= this.suitabilityTable[i].max) {
                return this.suitabilityTable[i];
            }
        }
        return { multiplier: 0.7, name: "Средняя", loss: "30%" };
    },
    
    // Функция для расчёта цены
    calculatePrice: function(basePrice, size, purityMultiplier, suitabilityMultiplier) {
        return Math.floor(basePrice * size * purityMultiplier * suitabilityMultiplier);
    }
};

// Тестовая функция для камней
window.testGem = function() {
    const gemRoll = Math.floor(Math.random() * 100) + 1;
    const purityRoll = Math.floor(Math.random() * 100) + 1;
    const suitabilityRoll = Math.floor(Math.random() * 100) + 1;
    
    const gem = gemsSystem.getGem(gemRoll);
    const purity = gemsSystem.getPurity(purityRoll);
    const suitability = gemsSystem.getSuitability(suitabilityRoll);
    const size = gemsSystem.getSize();
    const price = gemsSystem.calculatePrice(gem.basePrice, size, purity.multiplier, suitability.multiplier);
    
    document.getElementById('gemTestResult').innerHTML = `
        💎 Первый бросок (камень): ${gemRoll}<br>
        🪨 Камень: ${gem.name}<br>
        💰 Базовая цена за карат: ${gem.basePrice}<br>
        🧼 Второй бросок (чистота): ${purityRoll}<br>
        📊 Чистота: ${purity.name} (×${purity.multiplier})<br>
        📏 Размер: ${size.toFixed(2)} карат<br>
        ✨ Третий бросок (пригодность): ${suitabilityRoll}<br>
        🔪 Пригодность огранки: ${suitability.name} (×${suitability.multiplier}, потери ${suitability.loss})<br>
        💎 Итоговая цена: ${price.toLocaleString()} золотых
    `;
};
