// Данные об алхимии
const alchemyData = {
    introduction: `
        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🧪 ЧТО ТАКОЕ АЛХИМИЯ:</h3>
            <p style="color: #e0d0c0;">Алхимия — это наука о создании зелий, масел, ядов и других алхимических субстанций. Она объединяет знания о свойствах ингредиентов, химических и магических процессах. С её помощью можно создавать лечебные зелья, усиливающие зелья, яды, масла для оружия и брони, а также специальные зелья с уникальными эффектами.</p>
            <p style="color: #e0d0c0; margin-top: 10px;">Алхимия активно использует магию — многие процессы требуют магического воздействия, а сами зелья могут быть пропитаны магической энергией.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🏭 ЛАБОРАТОРИЯ АЛХИМИИ:</h3>
            <p style="color: #e0d0c0;">Для создания алхимических продуктов необходима лаборатория. Без лаборатории и хороших условий зелья варить нельзя.</p>
            
            <h4 style="color: #b89a7a; margin-top: 10px;">Обычные инструменты:</h4>
            <ul style="color: #e0d0c0; margin-left: 20px;">
                <li><strong>Атанор</strong> — печь для длительного равномерного нагрева.</li>
                <li><strong>Алембик</strong> — перегонный куб для дистилляции.</li>
                <li><strong>Реторта</strong> — колба с отводом для перегонки.</li>
                <li><strong>Тигель</strong> — огнеупорный сосуд для плавки и прокаливания.</li>
                <li><strong>Ступа с пестиком</strong> — для измельчения твёрдых веществ.</li>
                <li><strong>Спатула</strong> — лопатка для перемешивания и соскабливания.</li>
                <li><strong>Фильтровальная бумага</strong> — для отделения осадка от жидкости.</li>
                <li><strong>Эксикатор</strong> — закрытый сосуд для сушки веществ.</li>
                <li><strong>Муфельная печь</strong> — печь с камерой для равномерного обжига.</li>
                <li><strong>Фарфоровая чашка</strong> — для выпаривания жидкостей.</li>
                <li><strong>Штатив с кольцами</strong> — для крепления сосудов над огнём.</li>
                <li><strong>Весы</strong> — для точного взвешивания ингредиентов.</li>
                <li><strong>Ареометр</strong> — для измерения плотности жидкости.</li>
                <li><strong>Колбы (круглодонные, плоскодонные)</strong> — для нагрева и хранения.</li>
                <li><strong>Холодильник Манхиа</strong> — трубка для охлаждения паров при перегонке.</li>
                <li><strong>Щипцы</strong> — для захвата горячих тиглей и посуды.</li>
            </ul>
            
            <h4 style="color: #b89a7a; margin-top: 10px;">Магические инструменты:</h4>
            <p style="color: #e0d0c0;">Те же самые устройства, но усиленные магией. Они дают бонусы к приготовлению зелий, работают быстрее и точнее, их сложнее повредить при провале.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📚 ИЗУЧЕНИЕ РЕЦЕПТОВ:</h3>
            <p style="color: #e0d0c0;">Рецепты можно получить следующими способами:</p>
            <ul style="color: #e0d0c0; margin-left: 20px;">
                <li><strong>Книги</strong> — содержат один рецепт.</li>
                <li><strong>Свитки</strong> — содержат один рецепт.</li>
                <li><strong>Мастера алхимии</strong> — каждый мастер может научить одному рецепту.</li>
            </ul>
            <p style="color: #e0d0c0;">Разбирать готовые зелья для изучения рецептов нельзя. Экспериментальное смешивание даёт непредсказуемый эффект.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">⚙️ ПРОЦЕСС ВАРКИ:</h3>
            <p style="color: #e0d0c0;">Для создания зелья (масла, яда и т.д.) необходимо:</p>
            <ol style="color: #e0d0c0; margin-left: 20px;">
                <li>Иметь лабораторию.</li>
                <li>Иметь ингредиенты (травы, минералы, органика, магические компоненты).</li>
                <li>Знать рецепт (пропорции, последовательность действий, условия).</li>
            </ol>
            
            <h4 style="color: #b89a7a; margin-top: 10px;">Сложность варки:</h4>
            <p style="color: #e0d0c0;">У каждого рецепта есть своя сложность. Для успеха нужно бросить кубики и получить результат, равный или превышающий сложность.</p>
            
            <h4 style="color: #b89a7a; margin-top: 10px;">Первые приготовления:</h4>
            <p style="color: #e0d0c0;">При варке нового (неизученного) зелья действуют штрафы:</p>
            <ul style="color: #e0d0c0; margin-left: 20px;">
                <li>Первые 3 варки: −3 к броску</li>
                <li>Следующие 3 варки: −2 к броску</li>
                <li>Следующие 3 варки: −1 к броску</li>
                <li>10-я и последующие варки: без штрафа</li>
            </ul>
            <p style="color: #e0d0c0;">Если 10 первых варок прошли успешно, рецепт считается полностью изученным, и все следующие приготовления идут без штрафа.</p>
            
            <h4 style="color: #b89a7a; margin-top: 10px;">Провал:</h4>
            <p style="color: #e0d0c0;">При провале ингредиенты портятся. Обычные инструменты могут повредиться, магические — сложнее повредить.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📏 РАЗМЕРЫ ЗЕЛИЙ И СКЛЯНОК:</h3>
            <div style="display: grid; grid-template-columns: 150px 80px; gap: 8px;">
                <div style="color: #d4af37;">Тип</div>
                <div style="color: #d4af37;">Объём</div>
                <div style="color: #e0d0c0;">Маленькое зелье</div><div style="color: #e0d0c0;">30 мл</div>
                <div style="color: #e0d0c0;">Обычное зелье</div><div style="color: #e0d0c0;">40 мл</div>
                <div style="color: #e0d0c0;">Среднее зелье</div><div style="color: #e0d0c0;">50 мл</div>
                <div style="color: #e0d0c0;">Большое зелье</div><div style="color: #e0d0c0;">70 мл</div>
                <div style="color: #e0d0c0;">Гигантское зелье</div><div style="color: #e0d0c0;">80 мл</div>
                <div style="color: #e0d0c0;">Легендарное зелье</div><div style="color: #e0d0c0;">90 мл</div>
                <div style="color: #e0d0c0;">Мифическое зелье</div><div style="color: #e0d0c0;">100 мл</div>
            </div>
            <p style="color: #b89a7a; margin-top: 10px;">Размер зелья влияет на эффективность эффекта и на интоксикацию.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">⚠️ ИНТОКСИКАЦИЯ:</h3>
            <p style="color: #e0d0c0;">У каждого зелья есть показатель интоксикации — нагрузка на организм. Она зависит от силы зелья:</p>
            <ul style="color: #e0d0c0; margin-left: 20px;">
                <li>Слабые зелья — 1 интоксикация</li>
                <li>Более вредные — 2</li>
                <li>Очень вредные, мощные — 3</li>
            </ul>
            <p style="color: #e0d0c0;">Всего шкала интоксикации — 10 единиц. Если накопленная интоксикация превышает 10, начинаются негативные эффекты.</p>
            
            <h4 style="color: #b89a7a; margin-top: 10px;">Таблица интоксикации:</h4>
            <div style="display: grid; grid-template-columns: 100px 1fr 120px; gap: 8px;">
                <div style="color: #d4af37;">Уровень</div>
                <div style="color: #d4af37;">Эффект</div>
                <div style="color: #d4af37;">Снятие 1 ед.</div>
                <div style="color: #e0d0c0;">1–10</div><div style="color: #e0d0c0;">Нормально</div><div style="color: #e0d0c0;">2 часа</div>
                <div style="color: #e0d0c0;">11–15</div><div style="color: #e0d0c0;">–1 ко всем физическим навыкам</div><div style="color: #e0d0c0;">5 часов</div>
                <div style="color: #e0d0c0;">16–20</div><div style="color: #e0d0c0;">–3 ко всем навыкам</div><div style="color: #e0d0c0;">10 часов</div>
                <div style="color: #e0d0c0;">21–30</div><div style="color: #e0d0c0;">–10 ко всем навыкам, каждый час –10% опыта</div><div style="color: #e0d0c0;">1 сутки</div>
                <div style="color: #e0d0c0;">31+</div><div style="color: #e0d0c0;">Смерть</div><div style="color: #e0d0c0;">—</div>
            </div>
            
            <h4 style="color: #b89a7a; margin-top: 10px;">Как работает снятие интоксикации:</h4>
            <p style="color: #e0d0c0;">Интоксикация складывается от всех выпитых зелий. Если текущий уровень <strong>11–15</strong>, то каждая единица выше 10 снимается со скоростью <strong>5 часов</strong>. Когда уровень опускается до 10, оставшиеся единицы снимаются со скоростью <strong>2 часа</strong>.</p>
            <p style="color: #e0d0c0;">Если уровень <strong>16–20</strong>, единицы в этой зоне снимаются по 10 часов. Если <strong>21–30</strong> — по 24 часа.</p>
            
            <h4 style="color: #b89a7a; margin-top: 10px;">Примеры:</h4>
            <p style="color: #e0d0c0;"><strong>Интоксикация 12:</strong> 2 единицы (11–12) × 5 часов = 10 часов, затем уровень 10.</p>
            <p style="color: #e0d0c0;"><strong>Интоксикация 16:</strong> 5 единиц (11–15) × 5 часов = 25 часов, 1 единица (16) × 10 часов = 10 часов. Итого 35 часов.</p>
            <p style="color: #e0d0c0;"><strong>Интоксикация 22:</strong> 5 ед. (11–15) × 5 = 25 ч, 5 ед. (16–20) × 10 = 50 ч, 2 ед. (21–22) × 24 = 48 ч. Итого 123 часа.</p>
            
            <h4 style="color: #b89a7a; margin-top: 10px;">Снятие интоксикации:</h4>
            <p style="color: #e0d0c0;">Существуют зелья, которые ускоряют снятие интоксикации в два раза. У таких зелий нет собственной интоксикации.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📦 ХРАНЕНИЕ ЗЕЛИЙ:</h3>
            <p style="color: #e0d0c0;">При должных условиях зелья хранятся довольно долго. У каждого зелья свои сроки, но в основном это месяцы или даже годы.</p>
        </div>
    `
};

// Функция для отображения алхимии (вызывается из glossary.js)
function renderAlchemyContent() {
    const container = document.getElementById('resultsList');
    if (!container) return;
    
    if (typeof alchemyData === 'undefined') {
        container.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные об алхимии не загружены</p>';
        return;
    }
    
    container.innerHTML = alchemyData.introduction;
}
