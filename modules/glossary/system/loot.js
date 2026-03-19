// Таблица лута
const lootSystem = {
    // Введение (объяснение механики)
    introduction: `
        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📦 КОГДА ЭТО ИСПОЛЬЗУЕТСЯ:</h3>
            <p style="color: #e0d0c0;">Эта таблица применяется каждый раз, когда персонажи пытаются найти что-то ценное в мире. Например:</p>
            <ul style="color: #e0d0c0; margin-left: 20px;">
                <li>После победы над врагами, когда игроки обыскивают тела</li>
                <li>Когда открывают запертые сундуки в подземельях</li>
                <li>Когда исследуют древние руины и находят тайники</li>
                <li>Когда грабят сокровищницы или склады</li>
                <li>Когда снимают трофеи с поверженных монстров</li>
                <li>Когда разбирают завалы или ищут тайники в стенах</li>
                <li>Когда получают награду от торговцев за выполненное задание</li>
            </ul>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🎲 ЧТО ВЛИЯЕТ НА РЕЗУЛЬТАТ:</h3>
            <p style="color: #e0d0c0;">В отличие от простого броска кубика, здесь есть два фактора: случайность и мастерство персонажа. Случайность — это сам бросок d100. Мастерство — это навык "Удача", который показывает, насколько персонаж везуч от природы и насколько хорошо умеет искать ценности.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🍀 КАК РАБОТАЕТ НАВЫК "УДАЧА":</h3>
            <p style="color: #e0d0c0;">Навык "Удача" измеряется числами от 3 до 18 (как и все остальные навыки в игре). Чем выше число, тем везучее персонаж. Но просто иметь высокий навык недостаточно — нужно ещё и удачно кинуть 3d6.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🎯 ПОЧЕМУ 3d6:</h3>
            <p style="color: #e0d0c0;">Три шестигранных кубика дают распределение результатов от 3 до 18, но с разной вероятностью. Чаще всего выпадает 10-11, реже всего 3 или 18. Это сделано специально, чтобы крайние значения (критический провал или критический успех) случались нечасто.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📊 ЧТО ТАКОЕ РАЗНИЦА:</h3>
            <p style="color: #e0d0c0;">Разница = навык удачи минус результат броска 3d6.</p>
            <ul style="color: #e0d0c0; margin-left: 20px;">
                <li>Если разница положительная: персонажу повезло, он сработал лучше своего навыка</li>
                <li>Если разница отрицательная: персонажу не повезло, он сработал хуже своего навыка</li>
                <li>Если разница равна нулю: ровно на свой уровень</li>
            </ul>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🧮 КАК СЧИТАЕТСЯ БОНУС ИЛИ ШТРАФ:</h3>
            <p style="color: #e0d0c0;">Каждая единица положительной разницы даёт +5% к итоговому результату. Каждая единица отрицательной разницы даёт -5% к итоговому результату.</p>
            
            <h4 style="color: #b89a7a; margin: 10px 0;">Таблица бонусов:</h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px;">
                <div style="color: #e0d0c0;">Разница +1 = +5%</div>
                <div style="color: #e0d0c0;">Разница +2 = +10%</div>
                <div style="color: #e0d0c0;">Разница +3 = +15%</div>
                <div style="color: #e0d0c0;">Разница +4 = +20%</div>
                <div style="color: #e0d0c0;">Разница +5 = +25%</div>
                <div style="color: #e0d0c0;">Разница +6 = +30%</div>
                <div style="color: #e0d0c0;">Разница +7 = +35%</div>
                <div style="color: #e0d0c0;">Разница +8 = +40%</div>
                <div style="color: #e0d0c0;">Разница +9 = +45%</div>
                <div style="color: #e0d0c0;">Разница +10 = +50%</div>
            </div>
            <p style="color: #8b7d6b; margin-top: 5px;">И так далее до максимальной разницы +15</p>

            <h4 style="color: #b89a7a; margin: 10px 0;">Таблица штрафов:</h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px;">
                <div style="color: #e0d0c0;">Разница -1 = -5%</div>
                <div style="color: #e0d0c0;">Разница -2 = -10%</div>
                <div style="color: #e0d0c0;">Разница -3 = -15%</div>
                <div style="color: #e0d0c0;">Разница -4 = -20%</div>
                <div style="color: #e0d0c0;">Разница -5 = -25%</div>
                <div style="color: #e0d0c0;">Разница -6 = -30%</div>
                <div style="color: #e0d0c0;">Разница -7 = -35%</div>
                <div style="color: #e0d0c0;">Разница -8 = -40%</div>
                <div style="color: #e0d0c0;">Разница -9 = -45%</div>
                <div style="color: #e0d0c0;">Разница -10 = -50%</div>
            </div>
            <p style="color: #8b7d6b; margin-top: 5px;">И так далее до максимальной разницы -15</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">⚡ ЧТО ПРОИСХОДИТ С БАЗОВЫМ БРОСКОМ:</h3>
            <p style="color: #e0d0c0;">Сначала игрок кидает d100 и получает число от 1 до 100. Это базовая ценность находки в процентах. Потом к этому числу прибавляются или вычитаются процентные пункты от бонуса или штрафа удачи.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📝 ПРИМЕРЫ:</h3>
            
            <h4 style="color: #b89a7a; margin: 10px 0;">Пример 1 (положительный):</h4>
            <div style="color: #e0d0c0;">
                Навык удачи: 15<br>
                Бросок 3d6: 10<br>
                Разница: +5<br>
                Бонус: +25%<br>
                Базовый бросок d100: 65<br>
                Итог: 65 + 25 = 90%
            </div>

            <h4 style="color: #b89a7a; margin: 10px 0;">Пример 2 (отрицательный):</h4>
            <div style="color: #e0d0c0;">
                Навык удачи: 12<br>
                Бросок 3d6: 16<br>
                Разница: -4<br>
                Штраф: -20%<br>
                Базовый бросок d100: 50<br>
                Итог: 50 - 20 = 30%
            </div>

            <h4 style="color: #b89a7a; margin: 10px 0;">Пример 3 (нулевой):</h4>
            <div style="color: #e0d0c0;">
                Навык удачи: 14<br>
                Бросок 3d6: 14<br>
                Разница: 0<br>
                Бонус: 0%<br>
                Базовый бросок d100: 70<br>
                Итог: 70%
            </div>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📋 ЧТО ОЗНАЧАЮТ РЕЗУЛЬТАТЫ В ТАБЛИЦЕ:</h3>
            <div style="display: grid; grid-template-columns: 120px 1fr; gap: 8px;">
                <div style="color: #d4af37;">-10% - 0%</div><div style="color: #e0d0c0;">Потеря или поломка ценного предмета</div>
                <div style="color: #d4af37;">10% - 20%</div><div style="color: #e0d0c0;">Золото</div>
                <div style="color: #d4af37;">30% - 40%</div><div style="color: #e0d0c0;">Золото и ресурсы</div>
                <div style="color: #d4af37;">50% - 60%</div><div style="color: #e0d0c0;">Золото, ресурсы, драгоценности</div>
                <div style="color: #d4af37;">70% - 80%</div><div style="color: #e0d0c0;">Золото, ресурсы/драгоценности, редкая вещь</div>
                <div style="color: #d4af37;">90% - 100%</div><div style="color: #e0d0c0;">Золото х2, ресурсы/драгоценности, особо ценная вещь</div>
                <div style="color: #d4af37;">110% - 120%</div><div style="color: #e0d0c0;">Золото х5, ресурсы/драгоценности, особо ценная вещь х2</div>
                <div style="color: #d4af37;">130% - 140%</div><div style="color: #e0d0c0;">Золото х10, ресурсы/драгоценности х5, особо ценная вещь х2</div>
                <div style="color: #d4af37;">150% - 160%</div><div style="color: #e0d0c0;">Золото х100</div>
                <div style="color: #d4af37;">170% - 180%</div><div style="color: #e0d0c0;">Драгоценности х20</div>
                <div style="color: #d4af37;">190% - 200%</div><div style="color: #e0d0c0;">Особенная вещь</div>
            </div>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">❓ ЧТО ТАКОЕ "ОСОБЕННАЯ ВЕЩЬ":</h3>
            <p style="color: #e0d0c0;">Это не просто редкий предмет. Это может быть:</p>
            <ul style="color: #e0d0c0; margin-left: 20px;">
                <li>Магический предмет</li>
                <li>Древний артефакт</li>
                <li>Ключ к тайнику</li>
                <li>Карта сокровищ</li>
                <li>Ингредиент для зелья</li>
                <li>Свиток с заклинанием</li>
                <li>Оружие из особого металла</li>
            </ul>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🔮 ЧТО ТАКОЕ "РЕДКАЯ ВЕЩЬ":</h3>
            <p style="color: #e0d0c0;">Это что-то ценное, но не уникальное:</p>
            <ul style="color: #e0d0c0; margin-left: 20px;">
                <li>Магический свиток</li>
                <li>Хорошее оружие или броня</li>
                <li>Драгоценный камень</li>
                <li>Редкий ресурс</li>
                <li>Книга</li>
                <li>Зелье</li>
                <li>Ювелирное украшение</li>
            </ul>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">⛏️ ЧТО ТАКОЕ "РЕСУРСЫ":</h3>
            <p style="color: #e0d0c0;">Это расходные материалы:</p>
            <ul style="color: #e0d0c0; margin-left: 20px;">
                <li>Железо, сталь, медь</li>
                <li>Кожа, шкуры, меха</li>
                <li>Ткани, нитки</li>
                <li>Древесина, уголь</li>
                <li>Травы, коренья</li>
                <li>Кости, зубы, когти</li>
                <li>Стекло, глина</li>
                <li>Краски, масла</li>
            </ul>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">💎 ЧТО ТАКОЕ "ДРАГОЦЕННОСТИ":</h3>
            <p style="color: #e0d0c0;">Это камни и украшения:</p>
            <ul style="color: #e0d0c0; margin-left: 20px;">
                <li>Алмазы, рубины, сапфиры, изумруды</li>
                <li>Ювелирные изделия</li>
                <li>Статуэтки из драгоценных металлов</li>
                <li>Монеты древних государств</li>
                <li>Жемчуг, янтарь, кораллы</li>
            </ul>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">⚖️ КАК ОПРЕДЕЛЯТЬ КОЛИЧЕСТВО:</h3>
            <p style="color: #e0d0c0;">Ведущий сам решает, сколько именно золота, ресурсов и драгоценностей выпало, исходя из контекста:</p>
            <ul style="color: #e0d0c0; margin-left: 20px;">
                <li>В кармане гоблина будет меньше, чем в сундуке дракона</li>
                <li>В руинах древней цивилизации может быть больше ценностей, чем в разбойничьем логове</li>
                <li>На теле капитана пиратов может быть больше, чем на простом матросе</li>
            </ul>
        </div>
    `,
    
    // Таблица лута
    lootTable: [
        { min: -10, max: 0, reward: "❌ Потеря или поломка ценного предмета" },
        { min: 10, max: 20, reward: "💰 Золото" },
        { min: 30, max: 40, reward: "💰 Золото и ресурсы" },
        { min: 50, max: 60, reward: "💰 Золото, ресурсы, драгоценности" },
        { min: 70, max: 80, reward: "💰 Золото, ресурсы/драгоценности, редкая вещь" },
        { min: 90, max: 100, reward: "💰 Золото х2, ресурсы/драгоценности, особо ценная вещь" },
        { min: 110, max: 120, reward: "💰 Золото х5, ресурсы/драгоценности, особо ценная вещь х2" },
        { min: 130, max: 140, reward: "💰 Золото х10, ресурсы/драгоценности х5, особо ценная вещь х2" },
        { min: 150, max: 160, reward: "💰 Золото х100" },
        { min: 170, max: 180, reward: "💎 Драгоценности х20" },
        { min: 190, max: 200, reward: "✨ Особенная вещь" }
    ],
    
    // Функция для получения результата по числу
    getLoot: function(roll) {
        for (let i = 0; i < this.lootTable.length; i++) {
            if (roll >= this.lootTable[i].min && roll <= this.lootTable[i].max) {
                return this.lootTable[i].reward;
            }
        }
        return "❌ Ничего не найдено";
    }
};
