// skills-save.js
// Полное управление сохранением навыков и свободных очков

(function() {
    'use strict';

    // Ключ для хранения в localStorage
    const STORAGE_KEY = 'dnd_skills_data';

    // Список всех навыков для инициализации
    const DEFAULT_SKILLS = {
        // БОЕВЫЕ
        'Тяжёлая броня': 5,
        'Лёгкая броня': 5,
        'Двуручное оружие': 5,
        'Одноручное оружие': 5,
        'Стрельба': 5,
        'Блокирование': 5,
        'Древковое': 5,
        'Рукопашный бой': 5,
        'Метание': 5,
        // ОБЩИЕ
        'Скрытность': 5,
        'Красноречие': 5,
        'Ловкость': 5,
        'Выносливость': 5,
        'Взлом': 5,
        'Восприятие': 5,
        'Удача': 5,
        'Карманные кражи': 5,
        // РЕМЕСЛА
        'Алхимия': 5,
        'Кузнечное дело': 5,
        'Зачарование': 5,
        'Ремесло': 5,
        'Формации': 5,
        'Руны': 5,
        // МАГИЯ
        'Магия воды': 5,
        'Магия земли': 5,
        'Магия воздуха': 5,
        'Магия крови': 5,
        'Магия огня': 5,
        'Магия металла': 5,
        'Магия природы': 5,
        'Магия света': 5,
        'Магия тьмы': 5,
        'Магия инферно': 5,
        'Магия хаоса': 5,
        'Магия разума': 5,
        'Магия Жизни': 5,
        'Магия смерти': 5,
        'Магия пустоты': 5,
        'Магия Энергии': 5
    };

    // Текущее состояние
    let skillsData = {
        skills: { ...DEFAULT_SKILLS },
        freePoints: 46
    };

    // ========== ЗАГРУЗКА ==========
    function loadData() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Проверяем, что все навыки есть (на случай добавления новых)
                const mergedSkills = { ...DEFAULT_SKILLS, ...parsed.skills };
                skillsData = {
                    skills: mergedSkills,
                    freePoints: typeof parsed.freePoints === 'number' ? parsed.freePoints : 46
                };
                console.log('✅ Навыки загружены из localStorage');
            } else {
                console.log('ℹ️ Сохранений нет, используется начальная конфигурация');
                saveData(); // Сохраняем начальную конфигурацию
            }
        } catch (e) {
            console.warn('⚠️ Ошибка загрузки, используется начальная конфигурация', e);
            resetToDefaults();
        }
        return skillsData;
    }

    // ========== СОХРАНЕНИЕ ==========
    function saveData() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                skills: skillsData.skills,
                freePoints: skillsData.freePoints
            }));
            console.log('💾 Навыки сохранены');
            return true;
        } catch (e) {
            console.error('❌ Ошибка сохранения:', e);
            return false;
        }
    }

    // ========== СБРОС К ПО УМОЛЧАНИЮ ==========
    function resetToDefaults() {
        skillsData = {
            skills: { ...DEFAULT_SKILLS },
            freePoints: 46
        };
        saveData();
        console.log('🔄 Сброшено к начальным значениям');
        return skillsData;
    }

    // ========== ПОЛУЧИТЬ ЗНАЧЕНИЕ НАВЫКА ==========
    function getSkill(skillName) {
        return skillsData.skills[skillName] ?? 5;
    }

    // ========== УСТАНОВИТЬ ЗНАЧЕНИЕ НАВЫКА ==========
    function setSkill(skillName, value) {
        if (!skillsData.skills.hasOwnProperty(skillName)) {
            console.warn(`⚠️ Навык "${skillName}" не найден`);
            return false;
        }
        // Ограничиваем значение (можно изменить)
        const clampedValue = Math.max(0, Math.min(100, value));
        skillsData.skills[skillName] = clampedValue;
        saveData();
        return true;
    }

    // ========== ИЗМЕНИТЬ НАВЫК ОТНОСИТЕЛЬНО ==========
    function changeSkill(skillName, delta) {
        const current = getSkill(skillName);
        const newValue = current + delta;
        // Проверяем свободные очки при повышении
        if (delta > 0 && skillsData.freePoints < delta) {
            console.warn(`⚠️ Недостаточно свободных очков! Есть: ${skillsData.freePoints}, нужно: ${delta}`);
            return false;
        }
        // Обновляем навык
        const result = setSkill(skillName, newValue);
        if (result && delta > 0) {
            // Уменьшаем свободные очки
            skillsData.freePoints -= delta;
            saveData();
        }
        return result;
    }

    // ========== ПОЛУЧИТЬ СВОБОДНЫЕ ОЧКИ ==========
    function getFreePoints() {
        return skillsData.freePoints;
    }

    // ========== УСТАНОВИТЬ СВОБОДНЫЕ ОЧКИ ==========
    function setFreePoints(value) {
        skillsData.freePoints = Math.max(0, value);
        saveData();
    }

    // ========== ВОССТАНОВИТЬ НАВЫКИ (для дебага) ==========
    function restoreSkills() {
        // Возвращаем все навыки к 5, но сохраняем свободные очки
        skillsData.skills = { ...DEFAULT_SKILLS };
        saveData();
        console.log('🔧 Навыки восстановлены до 5');
        return skillsData;
    }

    // ========== ПРИНЯТЬ ДАННЫЕ ИЗ ДРУГОГО ИСТОЧНИКА ==========
    function importData(data) {
        if (data && typeof data === 'object') {
            if (data.skills) {
                skillsData.skills = { ...DEFAULT_SKILLS, ...data.skills };
            }
            if (typeof data.freePoints === 'number') {
                skillsData.freePoints = data.freePoints;
            }
            saveData();
            console.log('📥 Данные импортированы');
            return true;
        }
        return false;
    }

    // ========== ЭКСПОРТ ДАННЫХ ==========
    function exportData() {
        return {
            skills: { ...skillsData.skills },
            freePoints: skillsData.freePoints
        };
    }

    // ========== ИНИЦИАЛИЗАЦИЯ ==========
    function init() {
        loadData();
        // Если нужно автоматически применить к интерфейсу — раскомментируйте
        // applyToUI();
        console.log('🚀 Skills Save System готов');
        console.log('📊 Текущие данные:', skillsData);
    }

    // ========== ПРИМЕНЕНИЕ К ИНТЕРФЕЙСУ ==========
    // Эту функцию нужно адаптировать под вашу разметку
    function applyToUI() {
        // Найти все элементы навыков по селекторам
        document.querySelectorAll('[data-skill]').forEach(el => {
            const skillName = el.dataset.skill;
            const value = getSkill(skillName);
            // Обновить отображение
            const displayEl = el.querySelector('.skill-value') || el;
            displayEl.textContent = value;
        });
        
        // Обновить отображение свободных очков
        const pointsEl = document.querySelector('[data-free-points]');
        if (pointsEl) {
            pointsEl.textContent = getFreePoints();
        }
    }

    // ========== ПОДПИСКА НА СОБЫТИЯ ==========
    // Автоматически сохранять при закрытии страницы
    window.addEventListener('beforeunload', function() {
        saveData();
    });

    // ========== ЭКСПОРТ API ==========
    window.SkillsSave = {
        // Основные
        load: loadData,
        save: saveData,
        reset: resetToDefaults,
        
        // Навыки
        get: getSkill,
        set: setSkill,
        change: changeSkill,
        restore: restoreSkills,
        
        // Очки
        getPoints: getFreePoints,
        setPoints: setFreePoints,
        
        // Данные
        export: exportData,
        import: importData,
        
        // UI
        applyToUI: applyToUI,
        
        // Состояние
        getState: () => ({ ...skillsData })
    };

    // Автозапуск
    init();

})();
window.SkillsSave = SkillsSave;
