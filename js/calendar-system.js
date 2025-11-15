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

// Форматирование даты в красивый текст
function formatDate(month, day, year, era) {
    const monthName = MONTHS[month];
    return `${day + 1} ${monthName} ${year} года, ${era} эра`;
}

// Функция получения текущей даты
function getCurrentDate() {
    return formatDate(
        currentDate.month, 
        currentDate.day, 
        currentDate.year, 
        currentDate.era
    );
}

// Функции управления датой
function changeYear(delta) {
    currentDate.year += delta;
    // Проверка смены эры
    if (currentDate.year >= CALENDAR_CONSTANTS.YEARS_PER_ERA) {
        currentDate.era++;
        currentDate.year = 0;
    } else if (currentDate.year < 0) {
        currentDate.era--;
        currentDate.year = CALENDAR_CONSTANTS.YEARS_PER_ERA - 1;
    }
    saveCalendarState();
}

function changeMonth(delta) {
    currentDate.month += delta;
    if (currentDate.month >= CALENDAR_CONSTANTS.MONTH_COUNT) {
        changeYear(1);
        currentDate.month = 0;
    } else if (currentDate.month < 0) {
        changeYear(-1);
        currentDate.month = CALENDAR_CONSTANTS.MONTH_COUNT - 1;
    }
    saveCalendarState();
}

function changeDay(delta) {
    currentDate.day += delta;
    if (currentDate.day >= CALENDAR_CONSTANTS.DAYS_PER_MONTH) {
        changeMonth(1);
        currentDate.day = 0;
    } else if (currentDate.day < 0) {
        changeMonth(-1);
        currentDate.day = CALENDAR_CONSTANTS.DAYS_PER_MONTH - 1;
    }
    saveCalendarState();
}

// Сохранение и загрузка состояния календаря
function saveCalendarState() {
    localStorage.setItem('fantasyCalendar', JSON.stringify(currentDate));
}

function loadCalendarState() {
    const saved = localStorage.getItem('fantasyCalendar');
    if (saved) {
        currentDate = JSON.parse(saved);
    }
}

// Инициализация календаря
function initCalendar() {
    loadCalendarState();
    console.log("Календарь инициализирован:", getCurrentDate());
}

// Проверка работы
console.log("=== КАЛЕНДАРЬ ЗАГРУЖЕН ===");
console.log("Месяцев:", MONTHS.length);
console.log("Текущая дата:", getCurrentDate());
console.log("Время для 20 Зимобора:", calculateSunTimes(10, 19));
console.log("Время для 1 Солнцеворота:", calculateSunTimes(0, 0));

// Авто-инициализация при загрузке
document.addEventListener('DOMContentLoaded', initCalendar);
