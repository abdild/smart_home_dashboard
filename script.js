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
    setInterval(updateDateTime, 60000);

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
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');

        themeToggle.classList.toggle('dark');
        themeToggle.classList.toggle('light');

        const isDark = document.body.classList.contains('dark-theme');
        updateThemeIcon(isDark);

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

    // Функция для обновления цвета иконки устройства
    function updateDeviceIcon(deviceElement, isOn) {
        const deviceIcon = deviceElement.querySelector('.device-icon');
        if (deviceIcon) {
            if (isOn) {
                deviceIcon.classList.add('device-on');
            } else {
                deviceIcon.classList.remove('device-on');
            }
        }
    }

    // Функция для создания обработчика переключателя
    function createSwitchHandler(switchElement, deviceName, deviceElement) {
        return function toggleSwitch() {
            switchElement.classList.toggle('on');
            const isOn = switchElement.classList.contains('on');
            switchElement.setAttribute('aria-checked', isOn);

            console.log(`${deviceName}: ${isOn ? 'включено' : 'выключено'}`);

            // Обновляем цвет иконки устройства
            if (deviceElement) {
                updateDeviceIcon(deviceElement, isOn);
            }
        };
    }

    // Инициализация всех переключателей с привязкой к устройствам
    const switches = [
        { element: document.getElementById('deviceSwitch1'), name: 'Свет в гостиной', deviceId: 'device1' },
        { element: document.getElementById('deviceSwitch2'), name: 'Телевизор в спальне', deviceId: 'device2' },
        { element: document.getElementById('deviceSwitch3'), name: 'Замок входной двери', deviceId: 'device3' },
        { element: document.getElementById('deviceSwitch4'), name: 'Термостат', deviceId: 'device4' },
        { element: document.getElementById('deviceSwitch5'), name: 'Камера', deviceId: 'device5' },
        { element: document.getElementById('cameraSwitch'), name: 'Камера', deviceId: null }
    ];

    switches.forEach(switchConfig => {
        const switchElement = switchConfig.element;
        const deviceName = switchConfig.name;
        const deviceElement = switchConfig.deviceId ? document.getElementById(switchConfig.deviceId) : null;

        if (switchElement) {
            const toggleHandler = createSwitchHandler(switchElement, deviceName, deviceElement);

            switchElement.addEventListener('click', toggleHandler);

            switchElement.addEventListener('keydown', function (e) {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    toggleHandler();
                }
            });

            // Устанавливаем начальное состояние иконки
            if (deviceElement) {
                const isOn = switchElement.classList.contains('on');
                updateDeviceIcon(deviceElement, isOn);
            }
        }
    });

    // Обработчики для обычных чекбоксов сценариев
    const scenarioCheckboxes = document.querySelectorAll('.button-checkbox');
    scenarioCheckboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', function () {
            console.log(`Обычная кнопка ${index + 1}: ${this.checked ? 'включена' : 'выключена'}`);
        });
    });

    // Обработчики для круглых чекбоксов
    const roundCheckboxes = document.querySelectorAll('.round-checkbox');
    roundCheckboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', function () {
            console.log(`Круглая кнопка ${index + 1}: ${this.checked ? 'включена' : 'выключена'}`);
        });
    });
});