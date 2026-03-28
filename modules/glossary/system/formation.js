// Данные о формациях
const formationData = {
    introduction: `
        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🔮 ЧТО ТАКОЕ ФОРМАЦИИ:</h3>
            <p style="color: #e0d0c0;">Формации (барьеры) — это магические структуры, создаваемые из чистой энергии с вплетённой в неё информацией. Их часто называют барьерами, так как защитные формации — самый распространённый вид, но на самом деле формации бывают самых разных типов:</p>
            <ul style="color: #e0d0c0; margin-left: 20px;">
                <li>Запрещающие — блокируют колдовство для всех, кроме разрешённых</li>
                <li>Иллюзорные — создают видимые образы, скрывают реальность</li>
                <li>Защитные — поглощают или отражают урон</li>
                <li>Ловушки — активируются при определённых условиях</li>
                <li>Телепортационные — перемещают объекты</li>
                <li>Усиливающие — повышают характеристики в зоне действия</li>
                <li>И многие другие — сотни видов и сотни эффектов</li>
            </ul>
            <p style="color: #e0d0c0; margin-top: 10px;">Практически все формации питаются за счёт <strong>сфер</strong> (янтарных, крови, льда, огня, земли, воды, молнии, кристаллов эфира).</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📜 ЯЗЫК ФОРМАЦИЙ:</h3>
            <p style="color: #e0d0c0;">Для создания формации нужно знать <strong>язык формаций</strong> — это набор иероглифов, где каждый символ имеет своё значение. Также необходимы знания о сложных <strong>орнаментах</strong> и рисунках, из которых строится сама формация.</p>
            <p style="color: #e0d0c0; margin-top: 10px;">Рецепты формаций нужно выучивать. Изучить формацию можно у <strong>учителя</strong> (каждый учитель может обучить только одной формации) или с помощью <strong>кристаллов памяти</strong>.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🏭 ИНСТРУМЕНТЫ ДЛЯ РАБОТЫ С ФОРМАЦИЯМИ:</h3>
            <p style="color: #e0d0c0;">Для построения формации требуются два специальных инструмента:</p>
            <ul style="color: #e0d0c0; margin-left: 20px;">
                <li><strong>Перчатки с кристаллами эфира</strong> — преобразуют ману, которую выпускает маг, в бесцветную магию эфира. Это позволяет создавать формации, не привязанные к конкретной стихии.</li>
                <li><strong>Очки на основе кристаллов эфира</strong> — позволяют видеть магию эфира, которую создают перчатки. Без очков невозможно контролировать процесс построения формации.</li>
            </ul>
            <p style="color: #e0d0c0;">Эти инструменты не нужны тем, кто владеет <strong>магией эфира</strong> — такие маги могут работать с формациями напрямую, без преобразователей.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📊 УРОВНИ ФОРМАЦИЙ:</h3>
            <div style="display: grid; grid-template-columns: 80px 100px 1fr; gap: 8px;">
                <div style="color: #d4af37;">Уровень</div>
                <div style="color: #d4af37;">Размер</div>
                <div style="color: #d4af37;">Кто может создавать</div>
                <div style="color: #e0d0c0;">1</div><div style="color: #e0d0c0;">1×1 м</div><div style="color: #e0d0c0;">Начинающий маг с базовыми инструментами</div>
                <div style="color: #e0d0c0;">2</div><div style="color: #e0d0c0;">2×2 м</div><div style="color: #e0d0c0;">Опытный маг</div>
                <div style="color: #e0d0c0;">3</div><div style="color: #e0d0c0;">3×3 м</div><div style="color: #e0d0c0;">Один из лучших магов</div>
            </div>
            <p style="color: #e0d0c0; margin-top: 10px;">Чем выше уровень, тем сложнее структура, требовательнее к энергии и труднее создание.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">⚙️ ПРОЦЕСС СОЗДАНИЯ ФОРМАЦИИ:</h3>
            <p style="color: #e0d0c0;">Создание формации занимает <strong>часы или десятки часов</strong> — чем сложнее формация, тем дольше. Процесс требует нескольких бросков навыка. При ошибке чаще всего работа идёт насмарку, а энергия тратится впустую. В худшем случае может произойти взрыв.</p>
            <p style="color: #e0d0c0; margin-top: 10px;">Формация может быть:</p>
            <ul style="color: #e0d0c0; margin-left: 20px;">
                <li><strong>Привязана к объекту</strong> — например, на стене, полу, предмете</li>
                <li><strong>Висеть в воздухе</strong> — самостоятельная структура</li>
            </ul>
            <p style="color: #e0d0c0;">Практически невозможно наложить формацию на маленький предмет.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🔋 ПИТАНИЕ ФОРМАЦИЙ:</h3>
            <p style="color: #e0d0c0;">Формации работают на энергии <strong>сфер</strong>. Количество сфер всегда разное — зависит от силы формации, её свойств и уровня. При создании формации мастер закладывает определённое количество сфер — это и есть её энергозапас. Заложить меньше можно, больше — нельзя.</p>
            <p style="color: #e0d0c0;">Формацию можно питать от <strong>нескольких сфер одновременно</strong>. У формации есть определённый расход энергии, который может меняться в зависимости от нагрузки.</p>
            <p style="color: #e0d0c0;">Если энергия закончилась полностью, формация <strong>уничтожается</strong> и её нужно создавать заново. Если энергии становится меньше — это не влияет на работу, пока она совсем не иссякнет.</p>
            <p style="color: #e0d0c0; margin-top: 10px;">Сферы в формации сразу высасываются — их нельзя извлечь или сломать, они просто исчезают, отдав всю энергию.</p>
            <p style="color: #e0d0c0;">Существуют формации, которые могут <strong>питаться энергией окружающей среды</strong>, но это скорее для подпитки, чем для полноценной работы.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🔀 КОМБИНИРОВАНИЕ И УПРАВЛЕНИЕ:</h3>
            <p style="color: #e0d0c0;">Формации можно <strong>комбинировать</strong>, но это непросто — чем больше функций, тем выше расход энергии и сложнее сама формация.</p>
            <p style="color: #e0d0c0;">Отключить формацию может:</p>
            <ul style="color: #e0d0c0; margin-left: 20px;">
                <li>Тот, кто её создал</li>
                <li>Тот, у кого есть <strong>ключ управления</strong></li>
                <li>Принудительно — силой или истощением формации</li>
            </ul>
            <p style="color: #e0d0c0;">Формацию можно <strong>настроить на определённых людей</strong>, но для этого нужна специальная формация-фильтр.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📜 ПЕРЕНОС ФОРМАЦИЙ:</h3>
            <p style="color: #e0d0c0;">Готовую формацию можно <strong>перенести</strong> (например, нарисовать на свитке, а потом развернуть в другом месте), но это очень, очень непросто.</p>
        </div>
    `
};

// Функция для отображения формаций (вызывается из glossary.js)
function renderFormationContent() {
    const container = document.getElementById('resultsList');
    if (!container) return;
    
    if (typeof formationData === 'undefined') {
        container.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные о формациях не загружены</p>';
        return;
    }
    
    container.innerHTML = formationData.introduction;
}
