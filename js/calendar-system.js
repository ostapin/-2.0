// ========== ФЭНТЕЗИ-КАЛЕНДАРЬ "ТРЕХ ДЫХАНИЙ" ==========

// Константы календаря
const CALENDAR_CONSTANTS = {
    YEAR_DAYS: 741,
    MONTH_COUNT: 19,
    DAYS_PER_MONTH: 39,
    HOURS_PER_DAY: 35,
    START_YEAR: 356,
    START_ERA: 5,
    YEARS_PER_ERA: 10000
};

// Названия месяцев по Дыханиям
const MONTHS = [
    // Дыхание Света
    "Солнцеворот", "Златолит", "Плодосбор", "Рдяный Венец", "Медвяный Излом", "Равноденствие Стран",
    // Дыхание Тьмы  
    "Прядение Инея", "Призрачное Бдение", "Безмолвие", "Глубь Зимы", "Черное Зеркало", "Зимобор",
    // Переход
    "Эхо Теней",
    // Дыхание Сталей
    "Протальник", "Стальное Небо", "Ручейник", "Пробуждение Кряжа", "Равноденствие Клинков", "Предзноймие"
];

// Текущая дата
let currentDate = {
    year: CALENDAR_CONSTANTS.START_YEAR,
    era: CALENDAR_CONSTANTS.START_ERA,
    month: 0,  // 0-18
    day: 0     // 0-38
};
// Расчет времени восхода/заката для даты
function calculateSunTimes(month, day) {
    // Номер дня года (1-741)
    const dayOfYear = (month * CALENDAR_CONSTANTS.DAYS_PER_MONTH) + day + 1;
    
    // Длина светового дня (формула из твоего описания)
    const dayLength = 17.5 * Math.cos(2 * Math.PI * (dayOfYear - 20) / CALENDAR_CONSTANTS.YEAR_DAYS) + 17.5;
    
    // Время восхода и заката
    const sunrise = (CALENDAR_CONSTANTS.HOURS_PER_DAY - dayLength) / 2;
    const sunset = sunrise + dayLength;
    
    return {
        sunrise: sunrise.toFixed(2),
        sunset: sunset.toFixed(2),
        dayLength: dayLength.toFixed(2)
    };
}

// Проверка работы (добавь временно)
console.log("Время для 20 Зимобора:", calculateSunTimes(10, 19)); // 10 месяц, 20 день
console.log("Календарь загружен! Месяцев:", MONTHS.length);
