// Система взлома замков
const hackingSystem = {
    // Сложность замков
    difficulties: [
        { name: "Легкий замок", penalty: 0, description: "Простейший замок, даже ребёнок откроет" },
        { name: "Обычный замок", penalty: 2, description: "Стандартный замок для дверей в домах" },
        { name: "Средний замок", penalty: 4, description: "Более надёжный замок, требует сноровки" },
        { name: "Сложный замок", penalty: 6, description: "Замок с хитрым механизмом" },
        { name: "Тяжелый замок", penalty: 8, description: "Качественный замок, просто так не открыть" },
        { name: "Эпический замок", penalty: 10, description: "Замок мастера-кузнеца, очень надёжный" },
        { name: "Легендарный замок", penalty: 15, description: "Уникальный механизм, почти не взломать" },
        { name: "Мифический замок", penalty: 20, description: "Древний замок с магической защитой" },
        { name: "Особый замок", penalty: "ситуативно", description: "Сложность определяется ведущим" }
    ],
    
    // Введение (объяснение механики)
    introduction: `
        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🔓 КОГДА ЭТО ИСПОЛЬЗУЕТСЯ:</h3>
            <p style="color: #e0d0c0;">Когда персонаж пытается открыть запертый замок отмычками, взломать механическую ловушку или обойти защиту.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🎲 КАК РАБОТАЕТ МЕХАНИКА:</h3>
            <p style="color: #e0d0c0;">1. Игрок кидает 3d6 для проверки навыка "Взлом"</p>
            <p style="color: #e0d0c0;">2. От результата отнимается штраф сложности замка</p>
            <p style="color: #e0d0c0;">3. Полученное число сравнивается с навыком персонажа</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📊 ОПРЕДЕЛЕНИЕ РЕЗУЛЬТАТА:</h3>
            <p style="color: #e0d0c0;">✅ Если результат броска (после штрафа) БОЛЬШЕ или РАВЕН навыку - замок открыт</p>
            <p style="color: #e0d0c0;">❌ Если результат броска (после штрафа) МЕНЬШЕ навыка - замок не открыт</p>
        </div>

                <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">⚡ КРИТИЧЕСКИЕ СЛУЧАИ:</h3>
            <p style="color: #d4af37; margin-bottom: 5px;">🔥 Критический успех (3 или 4):</p>
            <p style="color: #e0d0c0;">Если выпало 3 (1,1,1) или 4 (1,1,2) - ведущий сам решает, что происходит: замок открывается мгновенно, отмычка не ломается, замок не издаёт звука, или что-то ещё.</p>
            
            <p style="color: #d4af37; margin-top: 15px; margin-bottom: 5px;">💥 Критический провал (18 или 17):</p>
            <p style="color: #e0d0c0;">Если выпало 18 (6,6,6) или 17 (6,6,5) - ведущий сам решает, что происходит: отмычка ломается, замок блокируется, поднимается шум, или что-то ещё.</p>
        </div>

                     <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📝 ПРИМЕР:</h3>
            <div style="color: #e0d0c0;">
                У персонажа навык "Взлом" = 14<br>
                Он пытается открыть Сложный замок (штраф -6)<br>
                Эффективный навык: 14 - 6 = 8<br>
                Бросок 3d6: 5<br>
                5 ≤ 8 → ✅ замок открыт
            </div>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🔧 ТАБЛИЦА СЛОЖНОСТИ ЗАМКОВ:</h3>
            <div style="display: grid; grid-template-columns: 150px 80px 1fr; gap: 10px; align-items: start;">
                <div style="color: #d4af37; font-weight: bold;">Тип замка</div>
                <div style="color: #d4af37; font-weight: bold;">Штраф</div>
                <div style="color: #d4af37; font-weight: bold;">Описание</div>
                
                <div style="color: #e0d0c0;">Легкий замок</div><div style="color: #e0d0c0;">0</div><div style="color: #e0d0c0;">Простейший замок, даже ребёнок откроет</div>
                <div style="color: #e0d0c0;">Обычный замок</div><div style="color: #e0d0c0;">-2</div><div style="color: #e0d0c0;">Стандартный замок для дверей в домах</div>
                <div style="color: #e0d0c0;">Средний замок</div><div style="color: #e0d0c0;">-4</div><div style="color: #e0d0c0;">Более надёжный замок, требует сноровки</div>
                <div style="color: #e0d0c0;">Сложный замок</div><div style="color: #e0d0c0;">-6</div><div style="color: #e0d0c0;">Замок с хитрым механизмом</div>
                <div style="color: #e0d0c0;">Тяжелый замок</div><div style="color: #e0d0c0;">-8</div><div style="color: #e0d0c0;">Качественный замок, просто так не открыть</div>
                <div style="color: #e0d0c0;">Эпический замок</div><div style="color: #e0d0c0;">-10</div><div style="color: #e0d0c0;">Замок мастера-кузнеца, очень надёжный</div>
                <div style="color: #e0d0c0;">Легендарный замок</div><div style="color: #e0d0c0;">-15</div><div style="color: #e0d0c0;">Уникальный механизм, почти не взломать</div>
                <div style="color: #e0d0c0;">Мифический замок</div><div style="color: #e0d0c0;">-20</div><div style="color: #e0d0c0;">Древний замок с магической защитой</div>
                <div style="color: #e0d0c0;">Особый замок</div><div style="color: #e0d0c0;">?</div><div style="color: #e0d0c0;">Сложность определяется ведущим</div>
            </div>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🎯 ТЕСТ ВЗЛОМА:</h3>
            <p style="color: #e0d0c0;">Выберите тип замка и нажмите кнопку для тестового броска.</p>
            <select id="hackingDifficulty" style="width: 100%; padding: 10px; margin: 10px 0; background: #1a0f0b; color: #e0d0c0; border: 2px solid #8b4513; border-radius: 4px;">
                <option value="0">Легкий замок (штраф 0)</option>
                <option value="2">Обычный замок (штраф -2)</option>
                <option value="4">Средний замок (штраф -4)</option>
                <option value="6">Сложный замок (штраф -6)</option>
                <option value="8">Тяжелый замок (штраф -8)</option>
                <option value="10">Эпический замок (штраф -10)</option>
                <option value="15">Легендарный замок (штраф -15)</option>
                <option value="20">Мифический замок (штраф -20)</option>
            </select>
            <button class="btn btn-roll" onclick="testHacking()" style="margin-top: 10px;">🔓 Тест взлома</button>
            <div id="hackingTestResult" style="margin-top: 15px; color: #d4af37;"></div>
        </div>
    `,
    
    // Функция для проверки взлома
checkHack: function(skill, roll, penalty) {
    const effectiveSkill = skill - penalty;  // эффективный навык = навык - штраф
    const success = roll <= effectiveSkill;   // успех если бросок МЕНЬШЕ ИЛИ РАВНО эффективному навыку
    return {
        effectiveSkill: effectiveSkill,
        roll: roll,
        success: success
    };
}
    
    // Функция для определения критического результата
getCritical: function(roll) {
    if (roll === 3 || roll === 4) return "critical_success";
    if (roll === 18 || roll === 17) return "critical_fail";
    return "normal";
}
};

// Тестовая функция для взлома
window.testHacking = function() {
    const hackSkill = 14; // Можно потом сделать ввод
    const select = document.getElementById('hackingDifficulty');
    const penalty = parseInt(select.value);
    const difficultyName = select.options[select.selectedIndex].text.split(' ')[0];
    
    const roll = Math.floor(Math.random() * 16) + 3; // 3d6 (3-18)
    const critical = hackingSystem.getCritical(roll);
    const result = hackingSystem.checkHack(hackSkill, roll, penalty);
    
    let criticalText = "";
    let resultText = "";
    
    if (critical === "critical_success") {
        criticalText = "🔥 КРИТИЧЕСКИЙ УСПЕХ! Ведущий решает, что происходит.";
        resultText = "Особый случай";
    } else if (critical === "critical_fail") {
        criticalText = "💥 КРИТИЧЕСКИЙ ПРОВАЛ! Ведущий решает, что происходит.";
        resultText = "Особый случай";
    } else {
        resultText = result.success ? "✅ Замок открыт!" : "❌ Замок не открыт";
    }
    
    document.getElementById('hackingTestResult').innerHTML = `
        🎯 Навык взлома: ${hackSkill}<br>
        🔒 Тип замка: ${difficultyName} (штраф -${penalty})<br>
        🎲 Бросок 3d6: ${roll}<br>
        ${critical ? `⚡ ${criticalText}<br>` : ""}
        📊 Итог: ${roll} - ${penalty} = ${result.finalRoll}<br>
        🔓 Результат: ${resultText}
    `;
};
