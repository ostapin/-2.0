// 02-utils.js - Вспомогательные функции
function getCurrencyIdFromString(priceString) {
    const str = priceString.toLowerCase();
    
    if (str.includes('мед')) return 'copper';
    if (str.includes('сереб')) return 'silver';
    if (str.includes('золот')) return 'gold';
    if (str.includes('платин')) return 'platinum';
    
    if (str.includes('кристалл эфира') || str.includes('кристаллов эфира')) {
        if (str.includes('бесцветный') || str.includes('colorless')) return 'colorless_ether';
        return 'colored_ether';
    }
    
    if (str.includes('кров')) return 'blood_sphere';
    if (str.includes('льд') || str.includes('ice')) return 'ice_sphere';
    if (str.includes('огн') || str.includes('fire')) return 'fire_sphere';
    if (str.includes('земл') || str.includes('earth')) return 'earth_sphere';
    if (str.includes('вод') || str.includes('water')) return 'water_sphere';
    if (str.includes('молн') || str.includes('lightning')) return 'lightning_sphere';
    
    if (str.includes('янтар') || str.includes('amber') || str.includes('сфер')) return 'amber_sphere';
    
    return 'copper';
}

function convertToBaseValue(amount, currencyId) {
    const currency = currencyRates[currencyId];
    if (!currency) return amount;
    return amount * currency.base_value;
}

function formatPrice(amount, currencyId) {
    const currency = currencyRates[currencyId];
    if (!currency) return `${amount}`;
    return `${amount} ${currency.name}`;
}

function extractPrice(priceString) {
    const match = priceString.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
}

function formatResistance(value) {
    if (typeof value === 'string' && value.includes('%')) {
        return value;
    }
    if (typeof value === 'number') {
        return (value * 100) + '%';
    }
    return value || '0%';
}

function parseResistanceValue(value) {
    if (typeof value === 'string' && value.includes('%')) {
        return parseFloat(value) / 100;
    }
    if (typeof value === 'number') {
        return value;
    }
    return 0;
}
