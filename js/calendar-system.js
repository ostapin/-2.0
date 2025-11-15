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
    
    // Время восхода и закат
    const sunrise = (CALENDAR_CONSTANTS.HOURS_PER_DAY - dayLength) / 2;
    const sunset = sunrise + dayLength;
    
    // Форматирование в часы:минуты
    const formatTime = (decimalHours) => {
        const hours = Math.floor(decimalHours);
        const minutes = Math.round((decimalHours - hours) * 60);
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    };
    
    // Форматирование длины дня
    const formatDayLength = (decimalHours) => {
        const hours = Math.floor(decimalHours);
        const minutes = Math.round((decimalHours - hours) * 60);
        return `${hours} часа ${minutes} минут`;
    };
    
    return {
        sunrise: formatTime(sunrise),
        sunset: formatTime(sunset),
        dayLength: formatDayLength(dayLength)
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
    updateCalendarDisplay(); 
}

function loadCalendarState() {
    const saved = localStorage.getItem('fantasyCalendar');
    if (saved) {
        currentDate = JSON.parse(saved);
    }
}

// Функция отрисовки визуального календаря
function renderVisualCalendar() {
   const container = document.getElementById('calendarVisual');
    if (!container) return;
    
    const monthName = MONTHS[currentDate.month];
    const dayNumber = currentDate.day + 1;
    const year = currentDate.year;
    const era = currentDate.era;
    
    // Определяем дыхание для цветового кодирования
    let breath = '';
    let breathColor = '#8b7d6b';
    
    if (currentDate.month < 6) {
        breath = 'Дыхание Света';
        breathColor = '#d4af37'; // золотой
    } else if (currentDate.month < 12) {
        breath = 'Дыхание Тьмы'; 
        breathColor = '#6b8cff'; // синий
    } else if (currentDate.month === 12) {
        breath = 'Переход';
        breathColor = '#a0a0a0'; // серый
    } else {
        breath = 'Дыхание Сталей';
        breathColor = '#ff6b6b'; // красный
    }
    
    // Создаем сетку дней (7x6 = 42 дня)
    let daysGrid = '';
    for (let i = 0; i < 42; i++) {
        const day = i + 1;
        const isCurrentDay = day === dayNumber;
        const dayClass = isCurrentDay ? 'calendar-day current' : 'calendar-day';
        
        daysGrid += `<div class="${dayClass}">${day}</div>`;
    }
    
    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <div style="font-size: 1.2em; color: ${breathColor}; margin-bottom: 5px;">${breath}</div>
            <div style="font-size: 1.4em; font-weight: bold; color: #d4af37;">${monthName}</div>
            <div style="color: #e0d0c0;">${year} год, ${era} эра</div>
        </div>
        <div class="calendar-grid">
            ${daysGrid}
        </div>
    `;
}

// Обновление отображения календаря
function updateCalendarDisplay() {
    // Обновляем дату
    const dateDisplay = document.getElementById('currentDateDisplay');
    if (dateDisplay) {
        dateDisplay.textContent = getCurrentDate();
    }
    
    // Обновляем время восхода/заката
    const sunDisplay = document.getElementById('sunTimesDisplay');
    if (sunDisplay) {
        const sunTimes = calculateSunTimes(currentDate.month, currentDate.day);
        sunDisplay.innerHTML = `
            <strong>🌅 Восход:</strong> ${sunTimes.sunrise} часа<br>
            <strong>🌇 Закат:</strong> ${sunTimes.sunset} часа<br>
            <strong>📏 День:</strong> ${sunTimes.dayLength} часа
        `;
    }
    
    // Обновляем визуальный календарь
    renderVisualCalendar();
}

// Инициализация календаря
function initCalendar() {
    loadCalendarState();
    updateCalendarDisplay(); 
    renderVisualCalendar();
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
