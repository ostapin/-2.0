// Данные о кузнечном деле
const smithingData = {
    introduction: `
        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">⚒️ ЧТО ТАКОЕ КУЗНЕЧНОЕ ДЕЛО:</h3>
            <p style="color: #e0d0c0;">Кузнечное дело — это искусство создания брони, оружия и других металлических и не только изделий. Оно охватывает широкий спектр ремёсел: от ковки металла до работы с кожей, деревом и другими материалами.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🔧 ИНСТРУМЕНТЫ:</h3>
            
            <h4 style="color: #b89a7a; margin-top: 10px;">Для работы с металлом:</h4>
            <ul style="color: #e0d0c0; margin-left: 20px;">
                <li><strong>Горн</strong> — очаг с углём и воздуходувкой для нагрева металла</li>
                <li><strong>Наковальня</strong> — массивная металлическая тумба для ковки</li>
                <li><strong>Молот кузнечный</strong> — тяжёлый молот для основной ковки</li>
                <li><strong>Кузнечные клещи</strong> — для удержания раскалённого металла</li>
                <li><strong>Кузнечный рог</strong> — конический выступ наковальни для гибки колец</li>
                <li><strong>Зубило</strong> — для рубки горячего и холодного металла</li>
                <li><strong>Обжимка</strong> — инструмент для придания формы поковке</li>
                <li><strong>Подбойка</strong> — для выравнивания внутренних поверхностей</li>
                <li><strong>Бородок</strong> — для пробивки отверстий</li>
                <li><strong>Кернер</strong> — для разметки точек сверления</li>
                <li><strong>Напильники (разной зернистости)</strong> — для обработки и доводки</li>
                <li><strong>Тиски слесарные</strong> — для зажима детали при обработке</li>
                <li><strong>Точильный камень (ручной или ножной)</strong> — для заточки и шлифовки</li>
                <li><strong>Водяной бак</strong> — для закалки</li>
            </ul>
            
            <h4 style="color: #b89a7a; margin-top: 10px;">Для работы с кожей:</h4>
            <ul style="color: #e0d0c0; margin-left: 20px;">
                <li><strong>Скобель (тупой нож)</strong> — для снятия мездры с внутренней стороны шкуры</li>
                <li><strong>Нож кожевенный (полукруглый)</strong> — для раскроя и строгания кожи</li>
                <li><strong>Струг</strong> — для равномерного утоньшения кожи</li>
                <li><strong>Косяк</strong> — нож с косым лезвием для резки по линейке</li>
                <li><strong>Пробойник (дырокол)</strong> — для пробивки отверстий под шов</li>
                <li><strong>Шило</strong> — для прокалывания отверстий при ручном шитье</li>
                <li><strong>Иглы кожевенные (трёхгранные)</strong> — для сшивания толстой кожи</li>
                <li><strong>Вощёная нить</strong> — для прочного шва</li>
                <li><strong>Клёпки и заклёпки (ручная установка)</strong> — для соединения без шитья</li>
                <li><strong>Доска для резки (торцевая)</strong> — поверхность для раскроя</li>
                <li><strong>Гладилка (костяная или металлическая)</strong> — для разглаживания и полировки кромок</li>
                <li><strong>Фальцебель</strong> — рубанок для выборки пазов и обработки кромок</li>
                <li><strong>Кромкорез</strong> — для снятия фаски с края кожи</li>
                <li><strong>Растяжка (правилка)</strong> — деревянная форма для сушки и придания формы</li>
            </ul>
            
            <h4 style="color: #b89a7a; margin-top: 10px;">Магические инструменты:</h4>
            <p style="color: #e0d0c0;">Те же устройства, но усиленные магией. Они облегчают работу, дают бонусы к созданию и снижают штрафы при первых приготовлениях. На качество готового предмета инструменты не влияют.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📚 ИЗУЧЕНИЕ РЕЦЕПТОВ:</h3>
            <p style="color: #e0d0c0;">Рецепты можно получить:</p>
            <ul style="color: #e0d0c0; margin-left: 20px;">
                <li><strong>Разбором предмета</strong> — предмет уничтожается, вы изучаете его форму</li>
                <li><strong>У учителя</strong> — каждый учитель может обучить одному рецепту</li>
                <li><strong>Из кристалла памяти</strong></li>
            </ul>
            <p style="color: #e0d0c0; margin-top: 10px;">Без рецепта создать предмет нельзя, даже если есть образец.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">⚙️ ПРОЦЕСС СОЗДАНИЯ:</h3>
            <p style="color: #e0d0c0;">Чтобы создать предмет, необходимо:</p>
            <ol style="color: #e0d0c0; margin-left: 20px;">
                <li>Знать <strong>рецепт</strong> предмета</li>
                <li>Иметь <strong>материалы</strong> (металл, кожу, дерево и т.д.)</li>
                <li>Сделать <strong>броски навыка</strong> на создание</li>
            </ol>
            <p style="color: #e0d0c0;">Время создания зависит от предмета и может занимать несколько часов.</p>
            
            <h4 style="color: #b89a7a; margin-top: 10px;">При провале:</h4>
            <p style="color: #e0d0c0;">Материалы превращаются в металлолом (или непригодные остатки), могут испортиться инструменты.</p>
            
            <h4 style="color: #b89a7a; margin-top: 10px;">Изучение рецепта (штрафы):</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div style="background: #1a0f0b; padding: 10px; border-radius: 4px;">
                    <strong style="color: #d4af37;">Обычные инструменты</strong>
                    <ul style="color: #e0d0c0; margin-top: 5px;">
                        <li>Первые 2 предмета: −5</li>
                        <li>Затем −4, −3, −2, −1</li>
                        <li>Далее без штрафа</li>
                    </ul>
                </div>
                <div style="background: #1a0f0b; padding: 10px; border-radius: 4px;">
                    <strong style="color: #d4af37;">Магические инструменты</strong>
                    <ul style="color: #e0d0c0; margin-top: 5px;">
                        <li>Первые 3 предмета: −3</li>
                        <li>Затем −2, −1</li>
                        <li>Далее без штрафа</li>
                    </ul>
                </div>
            </div>
            <p style="color: #e0d0c0; margin-top: 10px;">После 10 успешных приготовлений рецепт считается изученным.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🏅 МАСТЕРСТВО МЕТАЛЛА:</h3>
            <p style="color: #e0d0c0;">Чтобы получить <strong>понимание металла</strong> (мастерство работы с ним), нужно выучить <strong>10 разных рецептов из этого металла</strong> — например, несколько видов оружия и несколько видов брони.</p>
            <p style="color: #e0d0c0;">Когда у вас есть понимание металла, вы можете создавать предметы из этого металла, даже если оригинальный рецепт был из другого материала.</p>
            
            <h4 style="color: #b89a7a; margin-top: 10px;">Пример:</h4>
            <p style="color: #e0d0c0;">Вы разбираете стальной имперский нагрудник и выучиваете его форму. Чтобы сделать такой же нагрудник из золота, нужно иметь <strong>понимание золота</strong> (выученные рецепты из золота).</p>
            <p style="color: #b89a7a;">Комбинировать разные металлы в одном предмете нельзя.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🔧 РЕМОНТ И УЛУЧШЕНИЕ:</h3>
            <ul style="color: #e0d0c0; margin-left: 20px;">
                <li><strong>Чинить</strong> можно, если у предмета есть хотя бы 1 единица прочности.</li>
                <li><strong>Улучшить</strong> уже созданный предмет нельзя.</li>
                <li><strong>Уникальные предметы</strong> создавать нельзя.</li>
            </ul>
        </div>
    `
};

// Функция для отображения кузнечного дела (вызывается из glossary.js)
function renderSmithingContent() {
    const container = document.getElementById('resultsList');
    if (!container) return;
    
    if (typeof smithingData === 'undefined') {
        container.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные о кузнечном деле не загружены</p>';
        return;
    }
    
    container.innerHTML = smithingData.introduction;
}
