// Система прицельного огня
const aimedSystem = {
    // Таблица частей тела
    bodyParts: [
        { name: "Торс", penalty: 0, effect: "Без эффекта", effectChance: 0 },
        { name: "Голова", penalty: 5, effect: "30% сбить с ног", effectChance: 30 },
        { name: "Глаз", penalty: 9, effect: "10% убить мгновенно (только стрельба/метание)", effectChance: 10 },
        { name: "Шея", penalty: 7, effect: "Двойной урон", effectChance: 100 },
        { name: "Рука/нога", penalty: 2, effect: "10% вывести конечность из строя", effectChance: 10 },
        { name: "Кисть/ступня", penalty: 4, effect: "50% выбить оружие + вывести конечность", effectChance: 50 },
        { name: "Оружие (мал)", penalty: 5, effect: "50% выбить оружие", effectChance: 50 },
        { name: "Оружие (сред)", penalty: 4, effect: "50% выбить оружие", effectChance: 50 },
        { name: "Оружие (бол)", penalty: 3, effect: "50% выбить оружие", effectChance: 50 },
        { name: "Важные органы", penalty: 5, effect: "Двойной урон (только стрельба)", effectChance: 100 }
    ],
    
    // Введение
    introduction: `
        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🎯 ЧТО ЭТО ТАКОЕ:</h3>
            <p style="color: #e0d0c0;">Когда персонаж атакует противника, он может целиться обычным образом (тогда попадание в случайную часть тела) или прицельно (тогда он выбирает конкретную часть тела, но получает штраф к броску атаки).</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🎲 КАК ЭТО РАБОТАЕТ:</h3>
            <p style="color: #e0d0c0;">1. Игрок объявляет, что целится в конкретную часть тела</p>
            <p style="color: #e0d0c0;">2. От навыка атаки отнимается штраф за цель</p>
            <p style="color: #e0d0c0;">3. Игрок кидает 3d6</p>
            <p style="color: #e0d0c0;">4. Если бросок МЕНЬШЕ ИЛИ РАВЕН (навык - штраф) - попадание</p>
            <p style="color: #e0d0c0;">5. При попадании срабатывает особый эффект</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📊 ТАБЛИЦА ПРИЦЕЛЬНОЙ СТРЕЛЬБЫ:</h3>
            <div style="display: grid; grid-template-columns: 120px 80px 1fr; gap: 10px; align-items: start;">
                <div style="color: #d4af37; font-weight: bold;">Часть тела</div>
                <div style="color: #d4af37; font-weight: bold;">Штраф</div>
                <div style="color: #d4af37; font-weight: bold;">Эффект</div>
                
                <div style="color: #e0d0c0;">Торс</div><div style="color: #e0d0c0;">0</div><div style="color: #e0d0c0;">Без эффекта</div>
                <div style="color: #e0d0c0;">Голова</div><div style="color: #e0d0c0;">-5</div><div style="color: #e0d0c0;">30% сбить с ног</div>
                <div style="color: #e0d0c0;">Глаз</div><div style="color: #e0d0c0;">-9</div><div style="color: #e0d0c0;">10% убить мгновенно (только стрельба/метание)</div>
                <div style="color: #e0d0c0;">Шея</div><div style="color: #e0d0c0;">-7</div><div style="color: #e0d0c0;">Двойной урон</div>
                <div style="color: #e0d0c0;">Рука/нога</div><div style="color: #e0d0c0;">-2</div><div style="color: #e0d0c0;">10% вывести конечность из строя</div>
                <div style="color: #e0d0c0;">Кисть/ступня</div><div style="color: #e0d0c0;">-4</div><div style="color: #e0d0c0;">50% выбить оружие + вывести конечность</div>
                <div style="color: #e0d0c0;">Оружие (мал)</div><div style="color: #e0d0c0;">-5</div><div style="color: #e0d0c0;">50% выбить оружие</div>
                <div style="color: #e0d0c0;">Оружие (сред)</div><div style="color: #e0d0c0;">-4</div><div style="color: #e0d0c0;">50% выбить оружие</div>
                <div style="color: #e0d0c0;">Оружие (бол)</div><div style="color: #e0d0c0;">-3</div><div style="color: #e0d0c0;">50% выбить оружие</div>
                <div style="color: #e0d0c0;">Важные органы</div><div style="color: #e0d0c0;">-5</div><div style="color: #e0d0c0;">Двойной урон (только стрельба)</div>
            </div>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📝 ПРИМЕР:</h3>
            <div style="color: #e0d0c0;">
                У персонажа навык стрельбы = 14<br>
                Он целится в голову (штраф -5)<br>
                Нужно выкинуть: 14 - 5 = 9 или меньше<br>
                Бросок 3d6: 7 → 7 ≤ 9 → ✅ Попадание!<br>
                Проверка эффекта: кидаем d100, нужно 30 или меньше<br>
                Выпало 25 → 💥 Противник сбит с ног
            </div>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🎯 ТЕСТ ПРИЦЕЛЬНОГО ОГНЯ:</h3>
            <p style="color: #e0d0c0;">Введите навык атаки, выберите часть тела и нажмите кнопку для тестового выстрела.</p>
            
            <div style="display: flex; gap: 10px; align-items: center; margin: 10px 0; flex-wrap: wrap;">
                <span style="color: #e0d0c0;">Навык атаки:</span>
                <input type="number" id="aimSkill" value="14" min="3" max="18" style="width: 80px; padding: 8px; background: #1a0f0b; color: #e0d0c0; border: 2px solid #8b4513; border-radius: 4px;">
                
                <span style="color: #e0d0c0;">Часть тела:</span>
                <select id="aimBodyPart" style="padding: 8px; background: #1a0f0b; color: #e0d0c0; border: 2px solid #8b4513; border-radius: 4px;">
                    <option value="0">Торс (штраф 0)</option>
                    <option value="5">Голова (штраф -5)</option>
                    <option value="9">Глаз (штраф -9)</option>
                    <option value="7">Шея (штраф -7)</option>
                    <option value="2">Рука/нога (штраф -2)</option>
                    <option value="4">Кисть/ступня (штраф -4)</option>
                    <option value="5">Оружие (мал) (штраф -5)</option>
                    <option value="4">Оружие (сред) (штраф -4)</option>
                    <option value="3">Оружие (бол) (штраф -3)</option>
                    <option value="5">Важные органы (штраф -5)</option>
                </select>
            </div>
            
            <button class="btn btn-roll" onclick="testAimed()" style="margin-top: 10px;">🎯 Тест выстрела</button>
            <div id="aimTestResult" style="margin-top: 15px; color: #d4af37;"></div>
        </div>
    `,
    
    // Функция для получения эффекта по части тела
    getEffect: function(partIndex) {
        const parts = [
            { name: "Торс", effect: "Без эффекта", chance: 0 },
            { name: "Голова", effect: "сбит с ног", chance: 30 },
            { name: "Глаз", effect: "убит мгновенно", chance: 10 },
            { name: "Шея", effect: "двойной урон", chance: 100 },
            { name: "Рука/нога", effect: "конечность выведена из строя", chance: 10 },
            { name: "Кисть/ступня", effect: "оружие выбито, конечность выведена", chance: 50 },
            { name: "Оружие (мал)", effect: "оружие выбито", chance: 50 },
            { name: "Оружие (сред)", effect: "оружие выбито", chance: 50 },
            { name: "Оружие (бол)", effect: "оружие выбито", chance: 50 },
            { name: "Важные органы", effect: "двойной урон", chance: 100 }
        ];
        return parts[partIndex];
    }
};

// Тестовая функция для прицельного огня
window.testAimed = function() {
    const skill = parseInt(document.getElementById('aimSkill').value) || 14;
    const select = document.getElementById('aimBodyPart');
    const partIndex = select.selectedIndex;
    const penalty = parseInt(select.value);
    
    const partName = select.options[partIndex].text.split(' ')[0];
    const effect = aimedSystem.getEffect(partIndex);
    
    const roll = Math.floor(Math.random() * 16) + 3; // 3d6 (3-18)
    const target = skill - penalty;
    const hit = roll <= target;
    
    let resultText = `${hit ? "✅ ПОПАДАНИЕ!" : "❌ ПРОМАХ"}`;
    let effectText = "";
    
    if (hit && effect.chance > 0) {
        if (effect.chance === 100) {
            effectText = `✨ Эффект: ${effect.effect}`;
        } else {
            const effectRoll = Math.floor(Math.random() * 100) + 1;
            if (effectRoll <= effect.chance) {
                effectText = `✨ Эффект сработал! (${effectRoll} ≤ ${effect.chance}) → ${effect.effect}`;
            } else {
                effectText = `✨ Эффект не сработал (${effectRoll} > ${effect.chance})`;
            }
        }
    } else if (hit) {
        effectText = `✨ Без эффекта`;
    }
    
    document.getElementById('aimTestResult').innerHTML = `
        🎯 Навык атаки: ${skill}<br>
        🎯 Цель: ${partName} (штраф -${penalty})<br>
        📊 Нужно выкинуть: ${target} или меньше<br>
        🎲 Бросок 3d6: ${roll}<br>
        🔫 Результат: ${resultText}<br>
        ${effectText}
    `;
};
