// script.js
document.addEventListener('DOMContentLoaded', function () {
    // Элементы для даты и времени
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');
    const weekdayElement = document.getElementById('weekday');

    // Элемент переключателя темы
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.querySelector('.theme-icon use');

    // Элемент переключателя устройства
    const deviceSwitch = document.getElementById('deviceSwitch');

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

    // Функция для переключения состояния deviceSwitch
    function toggleDeviceSwitch() {
        deviceSwitch.classList.toggle('on');
        const isOn = deviceSwitch.classList.contains('on');
        deviceSwitch.setAttribute('aria-checked', isOn);
        
        // Здесь можно добавить логику для Home Assistant
        console.log(`Устройство ${isOn ? 'включено' : 'выключено'}`);
        
        // Пример отправки события в Home Assistant (через WebSocket или API)
        // Если вы интегрируете это в Home Assistant, раскомментируйте:
        /*
        if (window.hassConnection) {
            hassConnection.then(({ auth, conn }) => {
                conn.sendMessage({
                    type: 'call_service',
                    domain: 'switch',
                    service: isOn ? 'turn_on' : 'turn_off',
                    service_data: {
                        entity_id: 'switch.device_switch' // Замените на ваш entity_id
                    }
                });
            });
        }
        */
    }

    // Обработчик для переключателя устройства
    if (deviceSwitch) {
        deviceSwitch.addEventListener('click', toggleDeviceSwitch);
        
        // Добавляем поддержку клавиатуры (пробел и Enter)
        deviceSwitch.addEventListener('keydown', function (e) {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                toggleDeviceSwitch();
            }
        });
    }

    // Обработчики для чекбоксов сценариев
    const scenarioCheckboxes = document.querySelectorAll('.button-checkbox');
    scenarioCheckboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', function () {
            console.log(`Сценарий ${index + 1} ${this.checked ? 'включен' : 'выключен'}`);
            // Здесь можно добавить логику для управления сценариями
        });
    });
});