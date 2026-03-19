// Система реакции NPC
const reactionSystem = {
    // Таблица реакции
    reactionTable: [
        { min: -100, max: -3, description: "Уничтожит чего бы это не стоило — NPC готов на всё, чтобы уничтожить персонажа, даже ценой своей жизни" },
        { min: -2, max: -1, description: "Ненавидит — ничего не убедит от убийства, будет нападать при первой возможности" },
        { min: 0, max: 0, description: "Катастрофическое — персонаж действует против, вредит при каждом удобном случае" },
        { min: 1, max: 3, description: "Очень плохое — действует против, если ему это удобно или выгодно" },
        { min: 4, max: 6, description: "Плохое — не интересуется персонажем, пока не получит выгоду от враждебных действий" },
        { min: 7, max: 9, description: "Слабое — могут угрожать, требовать взятку, унижать, но до открытой агрессии не доходит" },
        { min: 10, max: 12, description: "Нейтральное — соблюдают протокол, отвечают сухо, делают свою работу, ничего лишнего" },
        { min: 13, max: 15, description: "Хорошее — выполняют небольшие просьбы, дают информацию, могут помочь по мелочи" },
        { min: 16, max: 18, description: "Очень хорошее — помогают по мере возможности, искренне стараются быть полезными" },
        { min: 19, max: 20, description: "Прекрасное — помогут, если это не слишком сложно, относятся с симпатией и уважением" },
        { min: 21, max: 22, description: "Обожает — помогут, если это в их силах, готовы рисковать ради персонажа" },
        { min: 23, max: 24, description: "Боготворит — свернут горы, продадут дом, но помогут. Готовы на любые жертвы" },
        { min: 25, max: 100, description: "Боготворит — свернут горы, продадут дом, но помогут. Готовы на любые жертвы" }
    ],
    
    // Введение
    introduction: `
        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">😊 ЧТО ЭТО ТАКОЕ:</h3>
            <p style="color: #e0d0c0;">Когда игрок впервые встречается с каким-либо персонажем (стражник, торговец, случайный прохожий), мастер кидает бросок по этой таблице. Это нужно чтобы убрать предвзятость мастера и дать чистую случайность — например, стражник может оказаться расистом и отнестись враждебно просто потому что так выпало, а не потому что мастер так захотел.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🎲 КАК ЭТО РАБОТАЕТ:</h3>
            <p style="color: #e0d0c0;">1. Бросается 3d6 (от 3 до 18) — это базовая реакция</p>
            <p style="color: #e0d0c0;">2. Если у персонажа есть бонусы — они прибавляются к броску</p>
            <p style="color: #e0d0c0;">3. Если есть штрафы — они вычитаются из броска</p>
            <p style="color: #e0d0c0;">4. Итоговое число смотрится в таблице</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">➕ БОНУСЫ И ШТРАФЫ:</h3>
            <p style="color: #e0d0c0;"><span style="color: #d4af37;">Положительные:</span> персонаж помог NPC, у них общие цели, игрок хорошо отыгрывает, красивая внешность, высокая харизма</p>
            <p style="color: #e0d0c0;"><span style="color: #d4af37;">Отрицательные:</span> персонаж принадлежит к расе, которую этот NPC не любит, у него плохая репутация, он угрожал, воняет, выглядит подозрительно</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📝 ПРИМЕРЫ:</h3>
            
            <h4 style="color: #b89a7a; margin: 10px 0;">Пример 1 (нейтральный):</h4>
            <div style="color: #e0d0c0;">
                Игрок заходит в город и обращается к стражнику. У стражника нет причин любить или ненавидеть персонажа — бросок идёт без модификаторов.<br>
                Бросок 3d6: выпало 10.<br>
                По таблице 10-12 = Нейтральное. Стражник просто соблюдает протокол, отвечает сухо но по делу.
            </div>

            <h4 style="color: #b89a7a; margin: 10px 0;">Пример 2 (с бонусом):</h4>
            <div style="color: #e0d0c0;">
                Игрок помог стражнику поймать вора, теперь у него есть повод относиться лучше. Бонус +5.<br>
                Бросок 3d6: выпало 15. Итог: 15 + 5 = 20.<br>
                По таблице 19-20 = Прекрасное. Стражник поможет, если это не слишком запарно.
            </div>

            <h4 style="color: #b89a7a; margin: 10px 0;">Пример 3 (со штрафом):</h4>
            <div style="color: #e0d0c0;">
                Игрок — орк, а стражник — человек, который ненавидит орков. Штраф -4.<br>
                Бросок 3d6: выпало 8. Итог: 8 - 4 = 4.<br>
                По таблице 4-6 = Плохое. Стражник не интересуется персонажем, пока не получит выгоду от враждебных действий.
            </div>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📊 ТАБЛИЦА РЕАКЦИИ:</h3>
            <div style="display: grid; grid-template-columns: 100px 1fr; gap: 8px;">
                <div style="color: #d4af37;">-3 и ниже</div><div style="color: #e0d0c0;">Уничтожит чего бы это не стоило — NPC готов на всё, чтобы уничтожить персонажа, даже ценой своей жизни</div>
                <div style="color: #d4af37;">-2 - -1</div><div style="color: #e0d0c0;">Ненавидит — ничего не убедит от убийства, будет нападать при первой возможности</div>
                <div style="color: #d4af37;">0</div><div style="color: #e0d0c0;">Катастрофическое — персонаж действует против, вредит при каждом удобном случае</div>
                <div style="color: #d4af37;">1-3</div><div style="color: #e0d0c0;">Очень плохое — действует против, если ему это удобно или выгодно</div>
                <div style="color: #d4af37;">4-6</div><div style="color: #e0d0c0;">Плохое — не интересуется персонажем, пока не получит выгоду от враждебных действий</div>
                <div style="color: #d4af37;">7-9</div><div style="color: #e0d0c0;">Слабое — могут угрожать, требовать взятку, унижать, но до открытой агрессии не доходит</div>
                <div style="color: #d4af37;">10-12</div><div style="color: #e0d0c0;">Нейтральное — соблюдают протокол, отвечают сухо, делают свою работу, ничего лишнего</div>
                <div style="color: #d4af37;">13-15</div><div style="color: #e0d0c0;">Хорошее — выполняют небольшие просьбы, дают информацию, могут помочь по мелочи</div>
                <div style="color: #d4af37;">16-18</div><div style="color: #e0d0c0;">Очень хорошее — помогают по мере возможности, искренне стараются быть полезными</div>
                <div style="color: #d4af37;">19-20</div><div style="color: #e0d0c0;">Прекрасное — помогут, если это не слишком сложно, относятся с симпатией и уважением</div>
                <div style="color: #d4af37;">21-22</div><div style="color: #e0d0c0;">Обожает — помогут, если это в их силах, готовы рисковать ради персонажа</div>
                <div style="color: #d4af37;">23-24</div><div style="color: #e0d0c0;">Боготворит — свернут горы, продадут дом, но помогут. Готовы на любые жертвы</div>
                <div style="color: #d4af37;">25+</div><div style="color: #e0d0c0;">Боготворит — свернут горы, продадут дом, но помогут. Готовы на любые жертвы</div>
            </div>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🎯 ТЕСТ РЕАКЦИИ:</h3>
            <p style="color: #e0d0c0;">Введите модификатор (бонус или штраф) и нажмите кнопку для тестового броска.</p>
            <div style="display: flex; gap: 10px; align-items: center; margin: 10px 0;">
                <span style="color: #e0d0c0;">Модификатор:</span>
                <input type="number" id="reactionModifier" value="0" style="width: 80px; padding: 8px; background: #1a0f0b; color: #e0d0c0; border: 2px solid #8b4513; border-radius: 4px;">
            </div>
            <button class="btn btn-roll" onclick="testReaction()" style="margin-top: 10px;">😊 Тест реакции</button>
            <div id="reactionTestResult" style="margin-top: 15px; color: #d4af37;"></div>
        </div>
    `,
    
    // Функция для получения реакции по числу
    getReaction: function(roll) {
        for (let i = 0; i < this.reactionTable.length; i++) {
            if (roll >= this.reactionTable[i].min && roll <= this.reactionTable[i].max) {
                return this.reactionTable[i].description;
            }
        }
        return "❌ Неопределённая реакция";
    }
};

// Тестовая функция для реакции
window.testReaction = function() {
    const modifier = parseInt(document.getElementById('reactionModifier').value) || 0;
    
    const roll = Math.floor(Math.random() * 16) + 3; // 3d6 (3-18)
    const finalRoll = roll + modifier;
    
    const result = reactionSystem.getReaction(finalRoll);
    
    document.getElementById('reactionTestResult').innerHTML = `
        🎲 Бросок 3d6: ${roll}<br>
        ➕ Модификатор: ${modifier}<br>
        📊 Итог: ${finalRoll}<br>
        😊 Реакция: ${result}
    `;
};
