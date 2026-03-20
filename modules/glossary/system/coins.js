// Система монет и валют
const coinsSystem = {
    // Введение
    introduction: `
        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🪙 ЧТО ЭТО ТАКОЕ:</h3>
            <p style="color: #e0d0c0;">Таблица показывает соотношение между различными видами валют в мире. Все курсы фиксированы и основаны на десятичной системе.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🎲 КАК ЭТО РАБОТАЕТ:</h3>
            <p style="color: #e0d0c0;">1. Монеты и сферы можно обменивать по фиксированному курсу</p>
            <p style="color: #e0d0c0;">2. Обмен возможен как вверх (мелкие в крупные), так и вниз (крупные в мелкие)</p>
            <p style="color: #e0d0c0;">3. Все курсы строго соблюдаются</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">💰 МОНЕТЫ:</h3>
            <p style="color: #e0d0c0;">Используются в основном обычными людьми для повседневных расчётов, торговли и накоплений.</p>
            <ul style="color: #e0d0c0; margin-left: 20px;">
                <li>Медные монеты</li>
                <li>Серебряные монеты</li>
                <li>Золотые монеты</li>
                <li>Платиновые монеты</li>
            </ul>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">✨ СФЕРЫ И КРИСТАЛЛЫ:</h3>
            <p style="color: #e0d0c0;">Используются практиками — воинами, магами, алхимиками, ремесленниками. Сферы и кристаллы — это не только валюта, но и источник энергии. На них работают артефакты, формации, барьеры, руны и тому подобное.</p>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📊 КУРСЫ:</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div style="color: #e0d0c0;">100 медных</div><div style="color: #d4af37;">= 1 серебряная</div>
                <div style="color: #e0d0c0;">100 серебряных</div><div style="color: #d4af37;">= 1 золотая</div>
                <div style="color: #e0d0c0;">100 золотых</div><div style="color: #d4af37;">= 1 платиновая</div>
                <div style="color: #e0d0c0;">100 платиновых</div><div style="color: #d4af37;">= 1 сфера (янтарная)</div>
                <div style="color: #e0d0c0;">100 сфер (янтарных)</div><div style="color: #d4af37;">= 1 сфера (Крови)</div>
                <div style="color: #e0d0c0;">100 сфер (Крови)</div><div style="color: #d4af37;">= 1 сфера (Льда)</div>
                <div style="color: #e0d0c0;">100 сфер (Льда)</div><div style="color: #d4af37;">= 1 сфера (Огня)</div>
                <div style="color: #e0d0c0;">100 сфер (Огня)</div><div style="color: #d4af37;">= 1 сфера (Земли)</div>
                <div style="color: #e0d0c0;">100 сфер (Земли)</div><div style="color: #d4af37;">= 1 сфера (Воды)</div>
                <div style="color: #e0d0c0;">100 сфер (Воды)</div><div style="color: #d4af37;">= 1 сфера (Молнии)</div>
                <div style="color: #e0d0c0;">100 сфер (Молнии)</div><div style="color: #d4af37;">= 1 кристалл эфира (бесцветный)</div>
                <div style="color: #e0d0c0;">10 кристаллов эфира (бесцветных)</div><div style="color: #d4af37;">= 1 кристалл эфира (цветной)</div>
            </div>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">📝 ПРИМЕРЫ:</h3>
            <div style="color: #e0d0c0;">
                500 медных = 5 серебряных<br>
                200 серебряных = 2 золотых<br>
                500 золотых = 5 платиновых<br>
                300 платиновых = 3 янтарные сферы<br>
                5 янтарных сфер = 500 платиновых
            </div>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #2a1a0f; border-radius: 6px;">
            <h3 style="color: #d4af37; margin-bottom: 10px;">🎯 КОНВЕРТЕР ВАЛЮТ:</h3>
            <p style="color: #e0d0c0;">Введите количество и выберите валюту для конвертации.</p>
            
            <div style="display: flex; gap: 10px; align-items: center; margin: 10px 0; flex-wrap: wrap;">
                <span style="color: #e0d0c0;">Количество:</span>
                <input type="number" id="coinAmount" value="100" style="width: 100px; padding: 8px; background: #1a0f0b; color: #e0d0c0; border: 2px solid #8b4513; border-radius: 4px;">
                
                <span style="color: #e0d0c0;">Из:</span>
                <select id="coinFrom" style="padding: 8px; background: #1a0f0b; color: #e0d0c0; border: 2px solid #8b4513; border-radius: 4px;">
                    <option value="copper">Медные</option>
                    <option value="silver">Серебряные</option>
                    <option value="gold">Золотые</option>
                    <option value="platinum">Платиновые</option>
                    <option value="amber">Сфера (янтарная)</option>
                    <option value="blood">Сфера (Крови)</option>
                    <option value="ice">Сфера (Льда)</option>
                    <option value="fire">Сфера (Огня)</option>
                    <option value="earth">Сфера (Земли)</option>
                    <option value="water">Сфера (Воды)</option>
                    <option value="lightning">Сфера (Молнии)</option>
                    <option value="colorless">Кристалл эфира (бесцветный)</option>
                    <option value="colored">Кристалл эфира (цветной)</option>
                </select>
                
                <span style="color: #e0d0c0;">В:</span>
                <select id="coinTo" style="padding: 8px; background: #1a0f0b; color: #e0d0c0; border: 2px solid #8b4513; border-radius: 4px;">
                    <option value="copper">Медные</option>
                    <option value="silver">Серебряные</option>
                    <option value="gold">Золотые</option>
                    <option value="platinum">Платиновые</option>
                    <option value="amber">Сфера (янтарная)</option>
                    <option value="blood">Сфера (Крови)</option>
                    <option value="ice">Сфера (Льда)</option>
                    <option value="fire">Сфера (Огня)</option>
                    <option value="earth">Сфера (Земли)</option>
                    <option value="water">Сфера (Воды)</option>
                    <option value="lightning">Сфера (Молнии)</option>
                    <option value="colorless">Кристалл эфира (бесцветный)</option>
                    <option value="colored">Кристалл эфира (цветной)</option>
                </select>
            </div>
            
            <button class="btn btn-roll" onclick="convertCurrency()" style="margin-top: 10px;">🔄 Конвертировать</button>
            <div id="coinConvertResult" style="margin-top: 15px; color: #d4af37;"></div>
        </div>
    `,
    
    // Курсы обмена (в медных монетах)
    rates: {
        copper: 1,
        silver: 100,
        gold: 10000,
        platinum: 1000000,
        amber: 100000000,
        blood: 10000000000,
        ice: 1000000000000,
        fire: 100000000000000,
        earth: 10000000000000000,
        water: 1000000000000000000,
        lightning: 100000000000000000000,
        colorless: 10000000000000000000000,
        colored: 100000000000000000000000
    },
    
    // Названия валют
    names: {
        copper: "Медные",
        silver: "Серебряные",
        gold: "Золотые",
        platinum: "Платиновые",
        amber: "Сфера (янтарная)",
        blood: "Сфера (Крови)",
        ice: "Сфера (Льда)",
        fire: "Сфера (Огня)",
        earth: "Сфера (Земли)",
        water: "Сфера (Воды)",
        lightning: "Сфера (Молнии)",
        colorless: "Кристалл эфира (бесцветный)",
        colored: "Кристалл эфира (цветной)"
    },
    
    // Конвертация
    convert: function(amount, from, to) {
        const copperValue = amount * this.rates[from];
        const result = copperValue / this.rates[to];
        return result;
    }
};

// Тестовая функция для конвертации
window.convertCurrency = function() {
    const amount = parseFloat(document.getElementById('coinAmount').value);
    const from = document.getElementById('coinFrom').value;
    const to = document.getElementById('coinTo').value;
    
    const result = coinsSystem.convert(amount, from, to);
    
    document.getElementById('coinConvertResult').innerHTML = `
        ${amount} ${coinsSystem.names[from]} = ${result.toFixed(2)} ${coinsSystem.names[to]}
    `;
};
