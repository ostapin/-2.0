// Система таблицы боя
const battleTableSystem = {
    // Таблица урона
    damageTable: [
        { level: 5, piercing: "2d6-5", slashing: "2d6-5", shooting: "2d6-5", throwing: "2d6-5", melee: "2d6-5" },
        { level: 6, piercing: "2d6-4", slashing: "2d6-4", shooting: "2d6-4", throwing: "2d6-5", melee: "2d6-4" },
        { level: 7, piercing: "2d6-3", slashing: "2d6-2", shooting: "2d6-3", throwing: "2d6-4", melee: "2d6-3" },
        { level: 8, piercing: "2d6-2", slashing: "2d6-1", shooting: "2d6-2", throwing: "2d6-4", melee: "2d6-2" },
        { level: 9, piercing: "2d6-1", slashing: "2d6", shooting: "2d6-1", throwing: "2d6-3", melee: "2d6-1" },
        { level: 10, piercing: "2d6", slashing: "2d6+4", shooting: "2d6", throwing: "2d6-3", melee: "2d6" },
        { level: 11, piercing: "2d6+2", slashing: "2d6+6", shooting: "2d6+4", throwing: "2d6-2", melee: "2d6+2" },
        { level: 12, piercing: "2d6+4", slashing: "4d6", shooting: "2d6+6", throwing: "2d6-2", melee: "2d6+4" },
        { level: 13, piercing: "2d6+6", slashing: "4d6+2", shooting: "4d6", throwing: "2d6-1", melee: "2d6+6" },
        { level: 14, piercing: "4d6", slashing: "6d6+4", shooting: "4d6+2", throwing: "2d6-1", melee: "4d6" },
        { level: 15, piercing: "4d6+2", slashing: "6d6+6", shooting: "4d6+4", throwing: "2d6", melee: "4d6+2" },
        { level: 16, piercing: "4d6+4", slashing: "8d6", shooting: "4d6+6", throwing: "2d6", melee: "4d6+4" },
        { level: 17, piercing: "4d6+6", slashing: "8d6+4", shooting: "6d6", throwing: "2d6+1", melee: "4d6+6" },
        { level: 18, piercing: "6d6", slashing: "8d6+6", shooting: "6d6+2", throwing: "2d6+2", melee: "6d6+2" },
        { level: 19, piercing: "6d6+2", slashing: "10d6", shooting: "6d6+4", throwing: "2d6+3", melee: "6d6+4" },
        { level: 20, piercing: "6d6+4", slashing: "10d6+2", shooting: "6d6+6", throwing: "5d6", melee: "6d6+6" },
        { level: 21, piercing: "12d6", slashing: "20d6", shooting: "12d6", throwing: "6d6", melee: "12d6" },
        { level: 22, piercing: "14d6", slashing: "26d6", shooting: "14d6", throwing: "7d6", melee: "14d6" },
        { level: 23, piercing: "16d6", slashing: "32d6", shooting: "16d6", throwing: "8d6", melee: "16d6" },
        { level: 24, piercing: "18d6", slashing: "38d6", shooting: "18d6", throwing: "9d6", melee: "18d6" },
        { level: 25, piercing: "20d6", slashing: "44d6", shooting: "20d6", throwing: "10d6", melee: "20d6" }
    ],
    
    // Введение
    introduction: `
        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">⚔️ ЧТО ЭТО ТАКОЕ:</h3>
            <p style="color: #e0d0c0;">Таблица показывает, какой урон наносит персонаж в зависимости от навыка владения оружием и типа атаки.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🎲 КАК ЭТО РАБОТАЕТ:</h3>
            <p style="color: #e0d0c0;">1. Игрок кидает 3d6 для попадания (нужно выкинуть меньше или равно навыку)</p>
            <p style="color: #e0d0c0;">2. При попадании урон считается по формуле из таблицы</p>
            <p style="color: #e0d0c0;">3. В таблице указано сколько кубиков кидать и какие модификаторы добавлять</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📝 ПРИМЕР:</h3>
            <div style="color: #e0d0c0;">
                Навык рубящего оружия 14<br>
                По таблице: 6d6+4<br>
                Игрок кидает 6 шестигранных кубиков и прибавляет 4
            </div>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📊 ТАБЛИЦА УРОНА:</h3>
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; color: #e0d0c0;">
                    <thead>
                        <tr style="background: #4a2a1f; color: #d4af37;">
                            <th style="padding: 8px; border: 1px solid #8b4513;">Уровень</th>
                            <th style="padding: 8px; border: 1px solid #8b4513;">Колющий</th>
                            <th style="padding: 8px; border: 1px solid #8b4513;">Рубящий</th>
                            <th style="padding: 8px; border: 1px solid #8b4513;">Стрельба</th>
                            <th style="padding: 8px; border: 1px solid #8b4513;">Метание</th>
                            <th style="padding: 8px; border: 1px solid #8b4513;">Рукопашный</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.damageTable.map(row => `
                            <tr style="background: #2a1a0f;">
                                <td style="padding: 8px; border: 1px solid #8b4513; text-align: center;">${row.level}</td>
                                <td style="padding: 8px; border: 1px solid #8b4513; text-align: center;">${row.piercing}</td>
                                <td style="padding: 8px; border: 1px solid #8b4513; text-align: center;">${row.slashing}</td>
                                <td style="padding: 8px; border: 1px solid #8b4513; text-align: center;">${row.shooting}</td>
                                <td style="padding: 8px; border: 1px solid #8b4513; text-align: center;">${row.throwing}</td>
                                <td style="padding: 8px; border: 1px solid #8b4513; text-align: center;">${row.melee}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🎯 ТЕСТ УРОНА:</h3>
            <p style="color: #e0d0c0;">Выберите уровень навыка, тип атаки и нажмите кнопку для тестового броска урона.</p>
            
            <div style="display: flex; gap: 10px; align-items: center; margin: 10px 0; flex-wrap: wrap;">
                <span style="color: #e0d0c0;">Уровень навыка:</span>
                <select id="battleSkillLevel" style="padding: 8px; background: #1a0f0b; color: #e0d0c0; border: 2px solid #8b4513; border-radius: 4px;">
                    ${Array.from({ length: 21 }, (_, i) => i + 5).map(level => `
                        <option value="${level}">${level}</option>
                    `).join('')}
                </select>
                
                <span style="color: #e0d0c0;">Тип атаки:</span>
                <select id="battleAttackType" style="padding: 8px; background: #1a0f0b; color: #e0d0c0; border: 2px solid #8b4513; border-radius: 4px;">
                    <option value="piercing">Колющий</option>
                    <option value="slashing">Рубящий</option>
                    <option value="shooting">Стрельба</option>
                    <option value="throwing">Метание</option>
                    <option value="melee">Рукопашный</option>
                </select>
            </div>
            
            <button class="btn btn-roll" onclick="testBattleDamage()" style="margin-top: 10px;">⚔️ Тест урона</button>
            <div id="battleTestResult" style="margin-top: 15px; color: #d4af37;"></div>
        </div>
    `,
    
    // Функция для получения формулы урона
    getDamageFormula: function(level, attackType) {
        const row = this.damageTable.find(r => r.level === level);
        if (!row) return "0";
        
        switch(attackType) {
            case "piercing": return row.piercing;
            case "slashing": return row.slashing;
            case "shooting": return row.shooting;
            case "throwing": return row.throwing;
            case "melee": return row.melee;
            default: return "0";
        }
    },
    
    // Функция для броска урона по формуле
    rollDamage: function(formula) {
        // Парсим формулу вида "Xd6+Y" или "Xd6-Y"
        const match = formula.match(/(\d+)d6([+-]\d+)?/);
        if (!match) return 0;
        
        const diceCount = parseInt(match[1]);
        const modifier = match[2] ? parseInt(match[2]) : 0;
        
        let total = 0;
        for (let i = 0; i < diceCount; i++) {
            total += Math.floor(Math.random() * 6) + 1;
        }
        total += modifier;
        
        return Math.max(0, total); // Урон не может быть отрицательным
    }
};

// Тестовая функция для таблицы боя
window.testBattleDamage = function() {
    const level = parseInt(document.getElementById('battleSkillLevel').value);
    const attackType = document.getElementById('battleAttackType').value;
    
    const typeNames = {
        piercing: "Колющий",
        slashing: "Рубящий",
        shooting: "Стрельба",
        throwing: "Метание",
        melee: "Рукопашный"
    };
    
    const formula = battleTableSystem.getDamageFormula(level, attackType);
    const damage = battleTableSystem.rollDamage(formula);
    
    // Для наглядности показываем отдельные кубики
    const diceMatch = formula.match(/(\d+)d6([+-]\d+)?/);
    let diceDetails = "";
    if (diceMatch) {
        const diceCount = parseInt(diceMatch[1]);
        const rolls = [];
        for (let i = 0; i < diceCount; i++) {
            rolls.push(Math.floor(Math.random() * 6) + 1);
        }
        const sum = rolls.reduce((a, b) => a + b, 0);
        const modifier = diceMatch[2] ? parseInt(diceMatch[2]) : 0;
        const total = sum + modifier;
        
        diceDetails = `
            <br>🎲 Кубики: ${rolls.join(' + ')} = ${sum}
            ${modifier !== 0 ? (modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`) : ''}
            <br>📊 Итого: ${total}
        `;
    }
    
    document.getElementById('battleTestResult').innerHTML = `
        ⚔️ Уровень навыка: ${level}<br>
        🗡️ Тип атаки: ${typeNames[attackType]}<br>
        📝 Формула урона: ${formula}<br>
        ${diceDetails}
    `;
};
