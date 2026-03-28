// Данные о ремесле
const craftingData = {
    introduction: `
        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🛠️ ЧТО ТАКОЕ РЕМЕСЛО:</h3>
            <p style="color: #e0d0c0;">Ремесло — это навык создания полноценных магических артефактов и магических механизмов. В отличие от зачарования, рун или формаций, где нужно строго следовать рецепту и нельзя придумать что-то своё, <strong>ремесло позволяет игроку самому придумывать механизмы и вещи</strong>.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">⚙️ КАК ЭТО РАБОТАЕТ:</h3>
            <p style="color: #e0d0c0;">Чтобы создать артефакт (например, магическую пушку, летающий предмет, сложный механизм), игрок должен:</p>
            <ol style="color: #e0d0c0; margin-left: 20px;">
                <li><strong>Изучить теорию</strong> — прочитать тома книг, связанные с созданием конкретного типа артефактов. Это нужно, чтобы обосновать идею и понять механику.</li>
                <li><strong>Описать мастеру</strong> — игрок полностью описывает механику будущего артефакта, объясняет, как он должен работать.</li>
                <li><strong>Получить список материалов</strong> — мастер перечисляет материалы, необходимые для создания.</li>
            </ol>
            <p style="color: #b89a7a; margin-top: 10px;"><strong>Важно:</strong> если игрок не знает, какие материалы ему понадобятся (например, не слышал о камне левитации), он не сможет создать артефакт, пока не узнает о существовании этого предмета.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📊 СЛОЖНОСТЬ СОЗДАНИЯ:</h3>
            <p style="color: #e0d0c0;">Сложность создания артефакта зависит от его силы. Чем мощнее артефакт, тем сложнее его создать. Процесс требует <strong>множества бросков навыка</strong> — это очень непростая задача.</p>
            <p style="color: #e0d0c0; margin-top: 10px;">При ошибке может произойти всё что угодно — от взрыва до полного отсутствия результата (материалы портятся, работа идёт насмарку).</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🏭 УСЛОВИЯ ДЛЯ СОЗДАНИЯ:</h3>
            <p style="color: #e0d0c0;">Для создания артефакта нужна <strong>специальная лаборатория или мастерская</strong>. В зависимости от артефакта может потребоваться разное оборудование и инструменты.</p>
            <p style="color: #e0d0c0; margin-top: 10px;">Можно создать артефакт, который работает <strong>без магической энергии</strong> (чисто механический), но это очень трудно.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">✨ УНИКАЛЬНОСТЬ АРТЕФАКТОВ:</h3>
            <p style="color: #e0d0c0;">Каждый созданный артефакт <strong>уникален</strong>. Можно создать несколько похожих, но они всё равно будут чем-то отличаться — хоть немного, но каждый экземпляр уникален.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🔧 РЕМОНТ И РАЗБОР:</h3>
            <ul style="color: #e0d0c0; margin-left: 20px;">
                <li>Если артефакт уничтожен, его <strong>нельзя починить</strong> — нужно создавать новый с нуля.</li>
                <li>Разобрать готовый артефакт <strong>нельзя</strong>.</li>
                <li>Улучшить уже созданный артефакт <strong>нельзя</strong>.</li>
            </ul>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📚 ИЗУЧЕНИЕ ТЕОРИИ:</h3>
            <p style="color: #e0d0c0;">Книги для изучения можно найти в разных местах — в библиотеках, у торговцев, в древних руинах. Чтобы изучить книгу, её нужно прочитать.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📝 ПРИМЕР:</h3>
            <div style="color: #e0d0c0;">
                <p><strong>Игрок хочет создать артефакт, позволяющий летать.</strong></p>
                <p>1. Ему нужно прочитать <strong>3 тома книг</strong>, связанных с летательными артефактами.</p>
                <p>2. После изучения он описывает мастеру механику: как именно артефакт будет работать, как им управлять, какие ограничения.</p>
                <p>3. Мастер определяет, что для создания нужен <strong>камень левитации</strong> как основа.</p>
                <p>4. Если игрок не знает о существовании камня левитации — он не сможет создать артефакт, пока не узнает об этом материале (через книги, изучение, поиск информации).</p>
            </div>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🔄 ОТЛИЧИЯ ОТ ДРУГИХ СИСТЕМ:</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div style="background: #1a0f0b; padding: 10px; border-radius: 4px;">
                    <strong style="color: #d4af37;">Зачарование / Руны / Формации</strong>
                    <ul style="color: #e0d0c0; margin-top: 5px;">
                        <li>Строгое следование рецепту</li>
                        <li>Нельзя придумать своё</li>
                        <li>Рецепты дают готовый результат</li>
                        <li>Материалы известны из рецепта</li>
                        <li>Артефакты не уникальны</li>
                    </ul>
                </div>
                <div style="background: #1a0f0b; padding: 10px; border-radius: 4px;">
                    <strong style="color: #d4af37;">Ремесло</strong>
                    <ul style="color: #e0d0c0; margin-top: 5px;">
                        <li>Свободное творчество игрока</li>
                        <li>Можно придумывать любые механизмы</li>
                        <li>Нужно изучать теорию и описывать механику</li>
                        <li>Материалы определяет мастер, игрок должен их знать</li>
                        <li>Каждый артефакт уникален</li>
                    </ul>
                </div>
            </div>
        </div>
    `
};

// Функция для отображения ремесла (вызывается из glossary.js)
function renderCraftingContent() {
    const container = document.getElementById('resultsList');
    if (!container) return;
    
    if (typeof craftingData === 'undefined') {
        container.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные о ремесле не загружены</p>';
        return;
    }
    
    container.innerHTML = craftingData.introduction;
}
