// script.js
document.addEventListener('DOMContentLoaded', function () {
    // Элементы для даты и времени
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');
    const weekdayElement = document.getElementById('weekday');

    // Элемент переключателя темы
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.querySelector('.theme-icon use');

    // Функция обновления даты и времени
    function updateDateTime() {
        const now = new Date();

        // Форматирование времени (ЧЧ:ММ)
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;

        // Форматирование даты (ДД МЕСЯЦ ГГГГ)
        const day = now.getDate().toString().padStart(2, '0');
        const months = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];
        const month = months[now.getMonth()];
        const year = now.getFullYear();
        dateElement.textContent = `${day} ${month} ${year}`;

        // Форматирование дня недели
        const weekdays = [
            'воскресенье', 'понедельник', 'вторник', 'среда',
            'четверг', 'пятница', 'суббота'
        ];
        const weekday = weekdays[now.getDay()];
        weekdayElement.textContent = weekday;
    }

    // Обновляем сразу и запускаем интервал
    updateDateTime();
    setInterval(updateDateTime, 60000); // Обновляем каждую минуту

    // Функция обновления иконки темы
    function updateThemeIcon(isDark) {
        if (isDark) {
            themeIcon.setAttribute('href', '#icon-moon');
        } else {
            themeIcon.setAttribute('href', '#icon-sun');
        }
    }

    // Обработчик переключения темы
    themeToggle.addEventListener('click', function () {
        // Переключаем класс на body
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');

        // Переключаем класс на переключателе
        themeToggle.classList.toggle('dark');
        themeToggle.classList.toggle('light');

        // Обновляем иконку
        const isDark = document.body.classList.contains('dark-theme');
        updateThemeIcon(isDark);

        // Сохраняем выбор темы в localStorage
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Загрузка сохраненной темы
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        themeToggle.classList.add('dark');
        themeToggle.classList.remove('light');
        updateThemeIcon(true);
    } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
        themeToggle.classList.add('light');
        themeToggle.classList.remove('dark');
        updateThemeIcon(false);
    }

    // Обработчики для чекбоксов сценариев (пример)
    const scenarioCheckboxes = document.querySelectorAll('.scenario-checkbox');
    scenarioCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            console.log(`Сценарий ${this.id} ${this.checked ? 'включен' : 'выключен'}`);
            // Здесь можно добавить логику для управления сценариями
        });
    });
});