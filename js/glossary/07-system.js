// 07-system.js - Система (лут, взлом, реакция, прицельный, бой, камни, монеты)
function renderSystem() {
    const resultsList = document.getElementById('resultsList');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!resultsList) return;
    
    if (currentSubcategory === 'loot') {
        resultsTitle.innerHTML = '📦 Таблица лута';
        
        if (typeof lootSystem === 'undefined') {
            resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные не загружены</p>';
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
        
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">📖 Как это работает</h3>
                <div style="color: #e0d0c0; line-height: 1.6;">
                    ${lootSystem.introduction}
                </div>
            </div>
            
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 15px;">📊 Таблица лута</h3>
                <div style="display: flex; flex-direction: column; gap: 8px;">
        `;
        
        lootSystem.lootTable.forEach(row => {
            let bgColor = '#2a1a0f';
            if (row.min >= 150) bgColor = '#4a2a1f';
            if (row.min >= 170) bgColor = '#5a3a2a';
            if (row.min >= 190) bgColor = '#6a4a3a';
            
            html += `
                <div style="display: grid; grid-template-columns: 100px 1fr; background: ${bgColor}; border-radius: 4px; padding: 10px;">
                    <div style="color: #d4af37; font-weight: bold;">${row.min} - ${row.max}</div>
                    <div style="color: #e0d0c0;">${row.reward}</div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
            
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">🎲 Пример использования</h3>
                <p style="color: #e0d0c0;">Игрок с навыком "Удача" 15 кинул 3d6 и получил 10. Разница: 5 → +25% к броску.</p>
                <p style="color: #e0d0c0;">Бросок d100: 65 + 25 = 90. Результат: Золото х2, ресурсы/драгоценности, особо ценная вещь.</p>
                <button class="btn btn-roll" onclick="testLoot()" style="margin-top: 10px;">🎲 Тест броска</button>
                <div id="lootTestResult" style="margin-top: 10px; color: #d4af37;"></div>
            </div>
        `;
        
        html += '</div>';
        resultsList.innerHTML = html;
        
    } else if (currentSubcategory === 'hacking') {
        resultsTitle.innerHTML = '🔓 Взлом';
        
        if (typeof hackingSystem === 'undefined') {
            resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные не загружены</p>';
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">📖 Система взлома</h3>
                <div style="color: #e0d0c0; line-height: 1.6;">
                    ${hackingSystem.introduction}
                </div>
            </div>
        `;
        html += '</div>';
        resultsList.innerHTML = html;
        
    } else if (currentSubcategory === 'reaction') {
        resultsTitle.innerHTML = '😊 Реакция на персонажа';
        
        if (typeof reactionSystem === 'undefined') {
            resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные не загружены</p>';
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">📖 Система реакции</h3>
                <div style="color: #e0d0c0; line-height: 1.6;">
                    ${reactionSystem.introduction}
                </div>
            </div>
        `;
        html += '</div>';
        resultsList.innerHTML = html;
        
    } else if (currentSubcategory === 'aimed') {
        resultsTitle.innerHTML = '🎯 Прицельный огонь';
        
        if (typeof aimedSystem === 'undefined') {
            resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные не загружены</p>';
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">📖 Система прицельного огня</h3>
                <div style="color: #e0d0c0; line-height: 1.6;">
                    ${aimedSystem.introduction}
                </div>
            </div>
        `;
        html += '</div>';
        resultsList.innerHTML = html;
        
    } else if (currentSubcategory === 'battle') {
        resultsTitle.innerHTML = '⚔️ Таблица боя';
        
        if (typeof battleTableSystem === 'undefined') {
            resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные не загружены</p>';
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">📖 Таблица боя</h3>
                <div style="color: #e0d0c0; line-height: 1.6;">
                    ${battleTableSystem.introduction}
                </div>
            </div>
        `;
        html += '</div>';
        resultsList.innerHTML = html;
        
    } else if (currentSubcategory === 'gems') {
        resultsTitle.innerHTML = '💎 Ценность камней';
        
        if (typeof gemsSystem === 'undefined') {
            resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные не загружены</p>';
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">📖 Таблица драгоценных камней</h3>
                <div style="color: #e0d0c0; line-height: 1.6;">
                    ${gemsSystem.introduction}
                </div>
            </div>
        `;
        html += '</div>';
        resultsList.innerHTML = html;
        
    } else if (currentSubcategory === 'coins') {
        resultsTitle.innerHTML = '🪙 Таблица монет';
        
        if (typeof coinsSystem === 'undefined') {
            resultsList.innerHTML = '<p style="color: #8b7d6b; text-align: center;">❌ Данные не загружены</p>';
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
        html += `
            <div style="background: #3d2418; border-radius: 6px; padding: 15px; border-left: 4px solid #d4af37;">
                <h3 style="color: #d4af37; margin-bottom: 10px;">📖 Таблица монет и валют</h3>
                <div style="color: #e0d0c0; line-height: 1.6;">
                    ${coinsSystem.introduction}
                </div>
            </div>
        `;
        html += '</div>';
        resultsList.innerHTML = html;
    }
}

window.testLoot = function() {
    const luckSkill = 15;
    const luckRoll = Math.floor(Math.random() * 16) + 3;
    const diff = luckSkill - luckRoll;
    const bonus = diff * 5;
    
    const baseRoll = Math.floor(Math.random() * 100) + 1;
    const finalRoll = baseRoll + bonus;
    
    const result = lootSystem.getLoot(finalRoll);
    
    document.getElementById('lootTestResult').innerHTML = `
        🎯 Навык удачи: ${luckSkill}<br>
        🎲 Бросок 3d6: ${luckRoll}<br>
        📊 Разница: ${diff}<br>
        ✨ Бонус: ${bonus}%<br>
        🎯 База d100: ${baseRoll}<br>
        🔢 Итог: ${finalRoll}<br>
        📦 Результат: ${result}
    `;
};
