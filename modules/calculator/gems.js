// ========== КАЛЬКУЛЯТОР ДРАГОЦЕННЫХ КАМНЕЙ ==========

const gemsSystem = {
    gemTable: [
        { min: 1, max: 50, name: "Аметист", basePrice: 150 },
        { min: 51, max: 65, name: "Гранат", basePrice: 400 },
        { min: 66, max: 80, name: "Корунд (сапфир)", basePrice: 550 },
        { min: 81, max: 92, name: "Берилл (изумруд)", basePrice: 600 },
        { min: 93, max: 100, name: "Алмаз", basePrice: 750 }
    ],
    
    purityTable: [
        { min: 0, max: 20, multiplier: 0.5, quality: "Ужасная" },
        { min: 21, max: 40, multiplier: 0.7, quality: "Плохая" },
        { min: 41, max: 60, multiplier: 1.0, quality: "Средняя" },
        { min: 61, max: 80, multiplier: 1.2, quality: "Хорошая" },
        { min: 81, max: 100, multiplier: 1.5, quality: "Идеальная" }
    ],
    
    getGem: function(roll) {
        for (let i = 0; i < this.gemTable.length; i++) {
            if (roll >= this.gemTable[i].min && roll <= this.gemTable[i].max) {
                return this.gemTable[i];
            }
        }
        return { name: "Неизвестный камень", basePrice: 0 };
    },
    
    getPurity: function(roll) {
        for (let i = 0; i < this.purityTable.length; i++) {
            if (roll >= this.purityTable[i].min && roll <= this.purityTable[i].max) {
                return this.purityTable[i];
            }
        }
        return { multiplier: 1.0, quality: "Средняя" };
    },
    
    calculatePrice: function(basePrice, multiplier) {
        return Math.floor(basePrice * multiplier);
    }
};

function renderGemCalculator(container) {
    container.innerHTML = `
        <div style="background: #2c1810; border-radius: 12px; padding: 20px; border: 2px solid #8b4513;">
            <h3 style="color: #d4af37; margin-bottom: 15px;">💎 ГЕНЕРАТОР ДРАГОЦЕННЫХ КАМНЕЙ</h3>
            <div style="margin-bottom: 20px; padding: 15px; background: #1a0f0b; border-radius: 8px;">
                <p style="color: #e0d0c0;">🎲 Бросок d100 определяет тип камня</p>
                <p style="color: #e0d0c0;">✨ Второй бросок d100 определяет чистоту (множитель цены)</p>
                <p style="color: #d4af37;">💰 Цена = Базовая цена × Множитель</p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div>
                    <h4 style="color: #d4af37;">📊 Камни (d100)</h4>
                    <div style="font-size: 0.9em; color: #e0d0c0;">
                        <div>1-50: Аметист (150)</div>
                        <div>51-65: Гранат (400)</div>
                        <div>66-80: Корунд (550)</div>
                        <div>81-92: Берилл (600)</div>
                        <div>93-100: Алмаз (750)</div>
                    </div>
                </div>
                <div>
                    <h4 style="color: #d4af37;">✨ Чистота (d100)</h4>
                    <div style="font-size: 0.9em; color: #e0d0c0;">
                        <div>0-20: Ужасная (x0.5)</div>
                        <div>21-40: Плохая (x0.7)</div>
                        <div>41-60: Средняя (x1.0)</div>
                        <div>61-80: Хорошая (x1.2)</div>
                        <div>81-100: Идеальная (x1.5)</div>
                    </div>
                </div>
            </div>
            <button onclick="generateGem()" style="width: 100%; background: #d4af37; color: #2c1810; padding: 15px; border: none; border-radius: 8px; font-size: 1.2em; font-weight: bold; cursor: pointer;">💎 СГЕНЕРИРОВАТЬ КАМЕНЬ</button>
            <div id="gemResult" style="margin-top: 20px; padding: 15px; background: #1a0f0b; border-radius: 8px; text-align: center; display: none;"></div>
            <div style="margin-top: 20px; padding: 10px; background: #3d2418; border-radius: 6px;">
                <h4 style="color: #d4af37; margin-bottom: 10px;">🎲 Ручной ввод</h4>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <input type="number" id="manualGemRoll" placeholder="Бросок камня (1-100)" style="flex: 1; padding: 8px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513; border-radius: 4px;">
                    <input type="number" id="manualPurityRoll" placeholder="Бросок чистоты (1-100)" style="flex: 1; padding: 8px; background: #1a0f0b; color: #e0d0c0; border: 1px solid #8b4513; border-radius: 4px;">
                    <button onclick="generateGemManual()" style="background: #8b4513; padding: 8px 15px; border: none; border-radius: 4px; color: white; cursor: pointer;">Рассчитать</button>
                </div>
            </div>
        </div>
    `;
}

function generateGem() {
    const gemRoll = Math.floor(Math.random() * 100) + 1;
    const purityRoll = Math.floor(Math.random() * 100) + 1;
    const gem = gemsSystem.getGem(gemRoll);
    const purity = gemsSystem.getPurity(purityRoll);
    const price = gemsSystem.calculatePrice(gem.basePrice, purity.multiplier);
    const resultDiv = document.getElementById('gemResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style="font-size: 1.2em; margin-bottom: 10px;">💎 <strong style="color: #d4af37;">${gem.name}</strong></div>
        <div>🎲 Бросок камня: ${gemRoll}</div>
        <div>💰 Базовая цена: ${gem.basePrice}</div>
        <div>✨ Бросок чистоты: ${purityRoll}</div>
        <div>📊 Качество: ${purity.quality} (x${purity.multiplier})</div>
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #8b4513; font-size: 1.3em; color: #d4af37;">🏷️ Итоговая цена: ${price}</div>
    `;
}

function generateGemManual() {
    const gemRoll = parseInt(document.getElementById('manualGemRoll').value);
    const purityRoll = parseInt(document.getElementById('manualPurityRoll').value);
    if (isNaN(gemRoll) || gemRoll < 1 || gemRoll > 100) {
        alert('Введите число от 1 до 100 для броска камня');
        return;
    }
    if (isNaN(purityRoll) || purityRoll < 1 || purityRoll > 100) {
        alert('Введите число от 1 до 100 для броска чистоты');
        return;
    }
    const gem = gemsSystem.getGem(gemRoll);
    const purity = gemsSystem.getPurity(purityRoll);
    const price = gemsSystem.calculatePrice(gem.basePrice, purity.multiplier);
    const resultDiv = document.getElementById('gemResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style="font-size: 1.2em; margin-bottom: 10px;">💎 <strong style="color: #d4af37;">${gem.name}</strong></div>
        <div>🎲 Бросок камня: ${gemRoll}</div>
        <div>💰 Базовая цена: ${gem.basePrice}</div>
        <div>✨ Бросок чистоты: ${purityRoll}</div>
        <div>📊 Качество: ${purity.quality} (x${purity.multiplier})</div>
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #8b4513; font-size: 1.3em; color: #d4af37;">🏷️ Итоговая цена: ${price}</div>
    `;
}

window.generateGem = generateGem;
window.generateGemManual = generateGemManual;
