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
        
        // Правильное склонение минут
        let minutesText = 'минут';
        if (minutes === 1) minutesText = 'минута';
        else if (minutes >= 2 && minutes <= 4) minutesText = 'минуты';
        
        return `${hours} часов ${minutes} ${minutesText}`;
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

function changeEra(delta) {
    currentDate.era += delta;
    // Защита от отрицательной эры
    if (currentDate.era < 1) {
        currentDate.era = 1;
    }
    saveCalendarState();
}

// Функция открытия модального окна для изменения даты
function openDateChangeModal() {
    // Создаём модальное окно
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.85)';
    modal.style.zIndex = '9999';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    
    // Контейнер
    const content = document.createElement('div');
    content.style.backgroundColor = '#2a1a0f';
    content.style.border = '2px solid #d4af37';
    content.style.borderRadius = '12px';
    content.style.width = '350px';
    content.style.padding = '25px';
    content.style.position = 'relative';
    
    // Заголовок
    const title = document.createElement('h3');
    title.textContent = 'Изменить дату';
    title.style.color = '#d4af37';
    title.style.marginBottom = '20px';
    title.style.textAlign = 'center';
    
    // Поле для года
    const yearLabel = document.createElement('label');
    yearLabel.textContent = 'Год:';
    yearLabel.style.color = '#e0d0c0';
    yearLabel.style.display = 'block';
    yearLabel.style.marginBottom = '5px';
    
    const yearInput = document.createElement('input');
    yearInput.type = 'number';
    yearInput.value = currentDate.year;
    yearInput.style.width = '100%';
    yearInput.style.padding = '8px';
    yearInput.style.marginBottom = '15px';
    yearInput.style.backgroundColor = '#1a0f0b';
    yearInput.style.color = '#e0d0c0';
    yearInput.style.border = '1px solid #8b4513';
    yearInput.style.borderRadius = '4px';
    
    // Поле для эры
    const eraLabel = document.createElement('label');
    eraLabel.textContent = 'Эра:';
    eraLabel.style.color = '#e0d0c0';
    eraLabel.style.display = 'block';
    eraLabel.style.marginBottom = '5px';
    
    const eraInput = document.createElement('input');
    eraInput.type = 'number';
    eraInput.value = currentDate.era;
    eraInput.style.width = '100%';
    eraInput.style.padding = '8px';
    eraInput.style.marginBottom = '15px';
    eraInput.style.backgroundColor = '#1a0f0b';
    eraInput.style.color = '#e0d0c0';
    eraInput.style.border = '1px solid #8b4513';
    eraInput.style.borderRadius = '4px';
    
    // Поле для месяца (выпадающий список)
    const monthLabel = document.createElement('label');
    monthLabel.textContent = 'Месяц:';
    monthLabel.style.color = '#e0d0c0';
    monthLabel.style.display = 'block';
    monthLabel.style.marginBottom = '5px';
    
    const monthSelect = document.createElement('select');
    monthSelect.style.width = '100%';
    monthSelect.style.padding = '8px';
    monthSelect.style.marginBottom = '15px';
    monthSelect.style.backgroundColor = '#1a0f0b';
    monthSelect.style.color = '#e0d0c0';
    monthSelect.style.border = '1px solid #8b4513';
    monthSelect.style.borderRadius = '4px';
    
    MONTHS.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${month} (${index + 1})`;
        if (index === currentDate.month) option.selected = true;
        monthSelect.appendChild(option);
    });
    
    // Поле для дня
    const dayLabel = document.createElement('label');
    dayLabel.textContent = 'День (1-39):';
    dayLabel.style.color = '#e0d0c0';
    dayLabel.style.display = 'block';
    dayLabel.style.marginBottom = '5px';
    
    const dayInput = document.createElement('input');
    dayInput.type = 'number';
    dayInput.value = currentDate.day + 1;
    dayInput.min = 1;
    dayInput.max = 39;
    dayInput.style.width = '100%';
    dayInput.style.padding = '8px';
    dayInput.style.marginBottom = '20px';
    dayInput.style.backgroundColor = '#1a0f0b';
    dayInput.style.color = '#e0d0c0';
    dayInput.style.border = '1px solid #8b4513';
    dayInput.style.borderRadius = '4px';
    
    // Кнопки
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Сохранить';
    saveBtn.style.flex = '1';
    saveBtn.style.padding = '10px';
    saveBtn.style.backgroundColor = '#8b4513';
    saveBtn.style.color = 'white';
    saveBtn.style.border = 'none';
    saveBtn.style.borderRadius = '4px';
    saveBtn.style.cursor = 'pointer';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Отмена';
    cancelBtn.style.flex = '1';
    cancelBtn.style.padding = '10px';
    cancelBtn.style.backgroundColor = '#5a3a2a';
    cancelBtn.style.color = 'white';
    cancelBtn.style.border = 'none';
    cancelBtn.style.borderRadius = '4px';
    cancelBtn.style.cursor = 'pointer';
    
    buttonContainer.appendChild(saveBtn);
    buttonContainer.appendChild(cancelBtn);
    
    // Собираем всё
    content.appendChild(title);
    content.appendChild(yearLabel);
    content.appendChild(yearInput);
    content.appendChild(eraLabel);
    content.appendChild(eraInput);
    content.appendChild(monthLabel);
    content.appendChild(monthSelect);
    content.appendChild(dayLabel);
    content.appendChild(dayInput);
    content.appendChild(buttonContainer);
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Закрытие по клику вне окна
    modal.onclick = function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
    
    // Сохранение
    saveBtn.onclick = function() {
        let newYear = parseInt(yearInput.value);
        let newEra = parseInt(eraInput.value);
        let newMonth = parseInt(monthSelect.value);
        let newDay = parseInt(dayInput.value) - 1;
        
        // Валидация
        if (isNaN(newYear)) newYear = 0;
        if (isNaN(newEra)) newEra = 1;
        if (newEra < 1) newEra = 1;
        if (newDay < 0) newDay = 0;
        if (newDay >= 39) newDay = 38;
        
        currentDate.year = newYear;
        currentDate.era = newEra;
        currentDate.month = newMonth;
        currentDate.day = newDay;
        
        saveCalendarState();
        document.body.removeChild(modal);
    };
    
    cancelBtn.onclick = function() {
        document.body.removeChild(modal);
    };
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
    
   // Создаем сетку дней (6x7 = 42 ячейки, но показываем только 39 дней)
let daysGrid = '';
const totalCells = 42; // 6 рядов по 7 дней
const totalDays = 39;   // дней в месяце

for (let i = 0; i < totalCells; i++) {
    const day = i + 1;
    const isCurrentDay = day === dayNumber;
    const dayClass = isCurrentDay ? 'calendar-day current' : 'calendar-day';
    
    if (day <= totalDays) {
        // Показываем только существующие дни (1-39)
        daysGrid += `<div class="${dayClass}">${day}</div>`;
    } else {
        // Пустые ячейки для оставшихся мест в сетке
        daysGrid += `<div class="calendar-day empty"></div>`;
    }
}
    
    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <div style="font-size: 1.2em; color: ${breathColor}; margin-bottom: 5px;">${breath}</div>
            <div style="font-size: 1.4em; font-weight: bold; color: #d4af37;">${monthName} (${currentDate.month + 1})</div>
            <div style="color: #e0d0c0;">${year} год, ${era} эра</div>
            <button class="btn btn-roll" onclick="openDateChangeModal()" style="margin-top: 10px;">✏️ Изменить дату</button>
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
            <strong>🌅 Восход:</strong> ${sunTimes.sunrise}<br>
            <strong>🌇 Закат:</strong> ${sunTimes.sunset}<br>
            <strong>📏 День:</strong> ${sunTimes.dayLength}
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
