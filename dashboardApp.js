class MyDashboard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // Только необходимые настройки
        this.settings = {
            theme: "auto",
        };

        // Активный раздел (только два)
        this.activeMenu = "home";

        this.loadSettings();

        // Добавляем демо-данные для тестирования
        this._hass = {
            connected: true,
            states: {
                "light.living_room": {
                    state: "on",
                    attributes: { friendly_name: "Свет в гостиной" }
                },
                "light.kitchen": {
                    state: "off",
                    attributes: { friendly_name: "Свет на кухне" }
                },
                "light.bedroom": {
                    state: "on",
                    attributes: { friendly_name: "Свет в спальне" }
                },
                "light.bathroom": {
                    state: "off",
                    attributes: { friendly_name: "Свет в ванной" }
                },
                "sensor.temperature": {
                    state: "22.5",
                    attributes: { 
                        friendly_name: "Температура",
                        unit_of_measurement: "°C"
                    }
                },
                "sensor.humidity": {
                    state: "45",
                    attributes: { 
                        friendly_name: "Влажность",
                        unit_of_measurement: "%"
                    }
                },
                "binary_sensor.motion_living": {
                    state: "off",
                    attributes: { 
                        friendly_name: "Движение в гостиной",
                        device_class: "motion"
                    }
                },
                "binary_sensor.motion_yard": {
                    state: "on",
                    attributes: { 
                        friendly_name: "Движение во дворе",
                        device_class: "motion"
                    }
                },
                "binary_sensor.door_front": {
                    state: "off",
                    attributes: { 
                        friendly_name: "Входная дверь",
                        device_class: "door"
                    }
                },
                "binary_sensor.window_kitchen": {
                    state: "off",
                    attributes: { 
                        friendly_name: "Окно на кухне",
                        device_class: "window"
                    }
                },
                "binary_sensor.garage_door": {
                    state: "on",
                    attributes: { 
                        friendly_name: "Гаражные ворота",
                        device_class: "garage_door"
                    }
                },
                "binary_sensor.smoke": {
                    state: "off",
                    attributes: { 
                        friendly_name: "Дым",
                        device_class: "smoke"
                    }
                },
                "binary_sensor.water_leak": {
                    state: "off",
                    attributes: { 
                        friendly_name: "Протечка воды",
                        device_class: "moisture"
                    }
                },
                "camera.cam1_yard": {
                    state: "idle",
                    attributes: { 
                        friendly_name: "Камера во дворе"
                    }
                },
                "camera.cam2_door": {
                    state: "idle",
                    attributes: { 
                        friendly_name: "Камера у двери"
                    }
                },
                "camera.cam3_garage": {
                    state: "off",
                    attributes: { 
                        friendly_name: "Камера в гараже"
                    }
                }
            }
        };
    }

    getThemeByTime() {
        const now = new Date();
        const hours = now.getHours();
        return hours >= 7 && hours < 21 ? "light" : "dark";
    }

    connectedCallback() {
        this.render();
        this.applyTheme();
    }

    set hass(hass) {
        this._hass = hass;
        this.render();
    }

    getStyles() {
        return `
        :host {   
            display: block;
            width: 100%;
            height: 100vh;
            padding: 0;
            margin: 0;
            box-sizing: border-box;
            font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: var(--primary-background-color);
            overflow: hidden;
        }

        :host([theme="dark"]) {
            --primary-background-color: #31343c;
            --card-background-color: #252b33;
            --primary-text-color: #e4e6eb;
            --secondary-text-color: #b0b3b8;
            --success-color: #4caf9e;
            --success-bg: rgba(76, 175, 158, 0.15);
            --danger-color: #f28b82;
            --danger-bg: rgba(242, 139, 130, 0.15);
            --info-color: #7aa2f7;
            --info-bg: rgba(122, 162, 247, 0.15);
            --border-color: rgba(255, 255, 255, 0.05);
            --neumo-shadow-dark: #0f1215;
            --neumo-shadow-light: #2f3741;
            --warning-color: #f1c40f;
            --warning-bg: rgba(241, 196, 15, 0.15);
        }

        :host([theme="light"]) {
            --primary-background-color: #EBF3FA;
            --card-background-color: #ffffff;
            --primary-text-color: #2c3e50;
            --secondary-text-color: #5d6f7e;
            --success-color: #2e7d73;
            --success-bg: rgba(46, 125, 115, 0.1);
            --danger-color: #d32f2f;
            --danger-bg: rgba(211, 47, 47, 0.1);
            --info-color: #1976d2;
            --info-bg: rgba(25, 118, 210, 0.1);
            --border-color: rgba(0, 0, 0, 0.05);
            --neumo-shadow-dark: #d1d9e6;
            --neumo-shadow-light: #ffffff;
            --warning-color: #f39c12;
            --warning-bg: rgba(243, 156, 18, 0.1);
        }

        .container {
            max-width: 1024px;
            height: 100vh;
            margin: 0 auto;
            padding: 2rem;
            background-color: transparent;
            box-sizing: border-box;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        /* Неоморфный переключатель темы */
        .theme-toggle {
            width: 80px;
            height: 38px;
            border-radius: 30px;
            background: #EBF3FA;
            box-shadow: inset 5px 5px 10px #a3b1c6, inset -5px -5px 10px #ffffff;
            cursor: pointer;
            position: relative;
            transition: all 0.3s ease;
        }

        .theme-toggle::before {
            content: "";
            position: absolute;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            top: 3px;
            left: 4px;
            background: #e0e5ec;
            box-shadow: 3px 3px 6px #a3b1c6, -3px -3px 6px #ffffff;
            transition: transform 0.3s ease;
            z-index: 1;
        }

        .theme-toggle.dark::before {
            transform: translateX(40px);
        }

        .theme-toggle .icon-sun,
        .theme-toggle .icon-moon {
            position: absolute;
            top: 7px;
            width: 24px;
            height: 24px;
            z-index: 2;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .theme-toggle .icon-sun svg,
        .theme-toggle .icon-moon svg {
            width: 20px;
            height: 20px;
            stroke: currentColor;
            fill: none;
        }

        .theme-toggle .icon-sun {
            left: 8px;
            color: #f39c12;
            opacity: 1;
        }

        .theme-toggle .icon-moon {
            right: 8px;
            color: #f1c40f;
            opacity: 0;
        }

        .theme-toggle.dark .icon-sun {
            opacity: 0;
        }

        .theme-toggle.dark .icon-moon {
            opacity: 1;
        }

        /* Для темной темы */
        :host([theme="dark"]) .theme-toggle {
            background: #2d343c;
            box-shadow: inset 5px 5px 10px #1a1e24, inset -5px -5px 10px #404854;
        }

        :host([theme="dark"]) .theme-toggle::before {
            background: #2d343c;
            box-shadow: 3px 3px 6px #1a1e24, -3px -3px 6px #404854;
        }

        :host([theme="dark"]) .theme-toggle .icon-moon svg {
            stroke: #f1c40f;
        }
        
        /* Хедер с датой и временем */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: transparent;
            flex-shrink: 0;
            margin-bottom: 3rem;
        }

        .header-datetime {
            display: flex;
            align-items: center;
            gap: 3rem;
            color: var(--primary-text-color);
        }

        .header-datetime .time {
            font-size: 7rem;
            font-weight: 300;
            line-height: 1;
            letter-spacing: 2px;
        }

        .header-datetime .date {
            font-size: 2.4rem;
            font-weight: 300;
            opacity: 0.8;
        }

        .header-datetime .weekday {
            font-size: 2.4rem;
            font-weight: 300;
            opacity: 0.8;
        }

        .header-controls {
            display: flex;
            align-items: center;
        }

        /* Стили для меню */
        .menu {
            background-color: var(--card-background-color);
            border-radius: 2rem;
            padding: 0.75rem 0.5rem;
            box-shadow: 8px 8px 16px var(--neumo-shadow-dark),
                        -8px -8px 16px var(--neumo-shadow-light);
            margin-bottom: 1rem;
            flex-shrink: 0;
        }

        .menu-items {
            display: flex;
            justify-content: space-around;
            align-items: center;
        }

        .menu-item {
            min-width: 5.5rem;
            min-height: 5.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 1.5rem;
            color: var(--secondary-text-color);
            font-size: 2rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .menu-item svg {
            width: 2rem;
            height: 2rem;
            fill: currentColor;
        }

        .menu-item.active {
            color: var(--info-color);
            box-shadow: inset 4px 4px 8px var(--neumo-shadow-dark),
                        inset -4px -4px 8px var(--neumo-shadow-light);
            background: var(--primary-background-color);
        }

        .menu-item-label {
            font-size: 0.7rem;
            font-weight: 500;
            margin-top: 0.5rem;
            color: var(--secondary-text-color);
        }

        .menu-item.active .menu-item-label {
            font-weight: 600;
            color: var(--info-color);
        }

        /* Контент */
        .content {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-height: 0;
            overflow: hidden;
        }

        .content-area {
            flex: 1;
            overflow-y: auto;
            min-height: 0;
            scrollbar-width: none;
        }

        .content-area::-webkit-scrollbar {
            display: none;
        }

        /* Сетка для главной страницы */
        .home-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            padding: 0.5rem;
        }

        /* Сетка для страницы безопасности */
        .security-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            padding: 0.5rem;
        }

        /* Базовая карточка в стиле неоморфизм */
        .card {
            background-color: var(--card-background-color);
            border-radius: 2rem;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            box-shadow: 10px 10px 20px var(--neumo-shadow-dark),
                        -10px -10px 20px var(--neumo-shadow-light);
            transition: all 0.3s ease;
        }

        .card-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .card-icon {
            width: 3rem;
            height: 3rem;
            background: var(--primary-background-color);
            border-radius: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            box-shadow: inset 3px 3px 6px var(--neumo-shadow-dark),
                        inset -3px -3px 6px var(--neumo-shadow-light);
        }

        .card-title {
            font-size: 1rem;
            font-weight: 500;
            color: var(--primary-text-color);
        }

        .card-value {
            font-size: 2rem;
            font-weight: 600;
            color: var(--primary-text-color);
            line-height: 1.2;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: auto;
        }

        /* Бейдж в стиле неоморфизм */
        .badge {
            padding: 0.35rem 0.85rem;
            border-radius: 2rem;
            font-size: 0.75rem;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            box-shadow: 3px 3px 6px var(--neumo-shadow-dark),
                        -3px -3px 6px var(--neumo-shadow-light);
        }

        .badge.success {
            background: var(--success-bg);
            color: var(--success-color);
        }

        .badge.danger {
            background: var(--danger-bg);
            color: var(--danger-color);
        }

        .badge.warning {
            background: var(--warning-bg);
            color: var(--warning-color);
        }

        /* Заглушка для контента */
        .placeholder-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 150px;
            background: var(--primary-background-color);
            border-radius: 2rem;
            color: var(--secondary-text-color);
            font-size: 1.2rem;
            gap: 1rem;
            box-shadow: inset 5px 5px 10px var(--neumo-shadow-dark),
                        inset -5px -5px 10px var(--neumo-shadow-light);
        }

        /* Стили для индикаторов */
        .status-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--border-color);
        }

        .status-label {
            color: var(--secondary-text-color);
            font-size: 0.9rem;
        }

        .status-value {
            font-weight: 600;
            color: var(--primary-text-color);
        }

        .status-value.on {
            color: var(--success-color);
        }

        .status-value.off {
            color: var(--danger-color);
        }

        .status-value.success {
            color: var(--success-color);
        }

        .status-value.danger {
            color: var(--danger-color);
        }

        .status-value.warning {
            color: var(--warning-color);
        }

        /* Стили для крупных индикаторов */
        .large-indicator {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
        }

        .large-indicator .icon {
            font-size: 3rem;
        }

        .large-indicator .value {
            font-size: 1.2rem;
            font-weight: 600;
        }

        .large-indicator .label {
            font-size: 0.9rem;
            color: var(--secondary-text-color);
        }

        /* Адаптация для смартфона */
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }

            .header-datetime {
                gap: 1rem;
            }

            .header-datetime .time {
                font-size: 4rem;
            }

            .header-datetime .date,
            .header-datetime .weekday {
                font-size: 1.5rem;
            }

            .menu-item {
                min-width: 4rem;
                min-height: 4rem;
                font-size: 1.5rem;
            }

            .menu-item svg {
                width: 1.5rem;
                height: 1.5rem;
            }

            .home-grid {
                grid-template-columns: 1fr;
            }
            
            .security-grid {
                grid-template-columns: 1fr;
            }

            .theme-toggle {
                width: 70px;
                height: 34px;
            }

            .theme-toggle::before {
                width: 28px;
                height: 28px;
                top: 3px;
                left: 3px;
            }

            .theme-toggle.dark::before {
                transform: translateX(34px);
            }
        }
        `;
    }

    render() {
        const currentTheme = this.getAttribute("theme") || "light";
        const themeClass = currentTheme === "dark" ? "dark" : "light";

        this.shadowRoot.innerHTML = `
            <style>${this.getStyles()}</style>
            <div class="container">
                ${this.renderHeader()}
                <div class="menu">
                    <div class="menu-items">
                        ${this.renderMenuItems()}
                    </div>
                </div>
                
                <div class="content">
                    <div class="content-area">
                        ${this._hass
                        ? this.renderActiveContent()
                        : this.renderLoading()
                    }
                    </div>
                </div>
            </div>
        `;

        // Обработчики для пунктов меню
        this.shadowRoot.querySelectorAll(".menu-item").forEach((item) => {
            item.addEventListener("click", (e) => {
                const menuItem = e.currentTarget;
                const action = menuItem.dataset.action;

                this.shadowRoot
                    .querySelectorAll(".menu-item")
                    .forEach((i) => i.classList.remove("active"));

                menuItem.classList.add("active");
                this.activeMenu = action;

                const contentArea = this.shadowRoot.querySelector(".content-area");

                if (contentArea) {
                    contentArea.innerHTML = this._hass
                        ? this.renderActiveContent()
                        : this.renderLoading();
                }
            });
        });

        // Обработчик для toggle темы
        this.shadowRoot
            .querySelector('.theme-toggle')
            ?.addEventListener("click", () => this.toggleTheme());
    }

    renderMenuItems() {
        const menuItems = [
            {
                action: "home",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z"/>
                </svg>`,
                label: "Главная",
            },
            {
                action: "security",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/>
                </svg>`,
                label: "Безопасность",
            },
        ];

        return menuItems
            .map(
                (item) => `
            <div class="menu-item ${this.activeMenu === item.action ? "active" : ""
                    }" data-action="${item.action}">
                <span>${item.icon}</span>
                <span class="menu-item-label">${item.label}</span>
            </div>
        `
            )
            .join("");
    }

    renderHeader() {
        const currentTheme = this.getAttribute("theme") || "light";
        const themeClass = currentTheme === "dark" ? "dark" : "light";

        // Получаем текущую дату и время
        const now = new Date();
        const timeString = now.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const dateString = now.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long'
        });

        const weekDayString = now.toLocaleDateString('ru-RU', {
            weekday: 'long'
        });

        return `
            <div class="header">
                <div class="header-datetime">
                    <div class="time">${timeString}</div>
                    <div>
                        <div class="date">${dateString}</div>
                        <div class="weekday">${weekDayString}</div>
                    </div>
                </div>
                
                <div class="header-controls">
                    <div class="theme-toggle ${themeClass}" data-action="theme">
                        <span class="icon-moon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                            </svg>
                        </span>
                        <span class="icon-sun">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        `;
    }

    renderActiveContent() {
        switch (this.activeMenu) {
            case "security":
                return this.renderSecurityContent();
            case "home":
            default:
                return this.renderHomeContent();
        }
    }

    renderHomeContent() {
        // Получаем данные из _hass
        const lights = Object.entries(this._hass?.states || {})
            .filter(([id]) => id.startsWith('light.'))
            .map(([id, entity]) => entity);
        
        const lightsOn = lights.filter(l => l.state === 'on').length;
        const temperature = this._hass?.states['sensor.temperature']?.state || '22.5';
        const humidity = this._hass?.states['sensor.humidity']?.state || '45';

        return `
            <div class="home-grid">
                <div class="card">
                    <div class="card-header">
                        <div class="card-icon">🏠</div>
                        <span class="card-title">Главная страница</span>
                    </div>
                    <div class="placeholder-content">
                        <div style="font-size: 3rem;">🏡</div>
                        <div style="font-weight: 500;">Добро пожаловать!</div>
                        <div style="font-size: 0.9rem;">Умный дом под управлением</div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-icon">📊</div>
                        <span class="card-title">Статистика</span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Активных устройств:</span>
                        <span class="status-value">${Object.keys(this._hass?.states || {}).length}</span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Свет включен:</span>
                        <span class="status-value on">${lightsOn}</span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Температура:</span>
                        <span class="status-value">${temperature}°C</span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Влажность:</span>
                        <span class="status-value">${humidity}%</span>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-icon">💡</div>
                        <span class="card-title">Освещение</span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Гостиная:</span>
                        <span class="status-value ${this._hass?.states['light.living_room']?.state === 'on' ? 'on' : 'off'}">
                            ${this._hass?.states['light.living_room']?.state === 'on' ? 'Вкл' : 'Выкл'}
                        </span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Кухня:</span>
                        <span class="status-value ${this._hass?.states['light.kitchen']?.state === 'on' ? 'on' : 'off'}">
                            ${this._hass?.states['light.kitchen']?.state === 'on' ? 'Вкл' : 'Выкл'}
                        </span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Спальня:</span>
                        <span class="status-value ${this._hass?.states['light.bedroom']?.state === 'on' ? 'on' : 'off'}">
                            ${this._hass?.states['light.bedroom']?.state === 'on' ? 'Вкл' : 'Выкл'}
                        </span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Ванная:</span>
                        <span class="status-value ${this._hass?.states['light.bathroom']?.state === 'on' ? 'on' : 'off'}">
                            ${this._hass?.states['light.bathroom']?.state === 'on' ? 'Вкл' : 'Выкл'}
                        </span>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-icon">🌡️</div>
                        <span class="card-title">Климат</span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Текущая температура:</span>
                        <span class="status-value">${temperature}°C</span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Влажность:</span>
                        <span class="status-value">${humidity}%</span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Комфорт:</span>
                        <span class="status-value success">Норма</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderSecurityContent() {
        // Получаем данные из _hass
        const motionSensors = Object.entries(this._hass?.states || {})
            .filter(([id, e]) => id.startsWith('binary_sensor.') && e.attributes.device_class === 'motion');
        
        const doorSensors = Object.entries(this._hass?.states || {})
            .filter(([id, e]) => id.startsWith('binary_sensor.') && 
                ['door', 'window', 'garage_door'].includes(e.attributes.device_class || ''));
        
        const safetySensors = Object.entries(this._hass?.states || {})
            .filter(([id, e]) => id.startsWith('binary_sensor.') && 
                ['smoke', 'moisture', 'gas'].includes(e.attributes.device_class || ''));
        
        const cameras = Object.entries(this._hass?.states || {})
            .filter(([id]) => id.startsWith('camera.'));

        const activeAlerts = Object.entries(this._hass?.states || {})
            .filter(([id, e]) => id.startsWith('binary_sensor.') && e.state === 'on').length;

        const doorOpen = doorSensors.filter(([id, e]) => e.state === 'on').length;
        const motionActive = motionSensors.filter(([id, e]) => e.state === 'on').length;

        return `
            <div class="security-grid">
                <div class="card" style="grid-column: span 3; background-color: ${activeAlerts > 0 ? 'var(--danger-bg)' : 'var(--success-bg)'};">
                    <div class="card-header">
                        <div class="card-icon">🔒</div>
                        <span class="card-title">Система безопасности</span>
                    </div>
                    <div style="display: flex; justify-content: space-around; align-items: center; padding: 1rem 0;">
                        <div class="large-indicator">
                            <div class="icon" style="color: var(--success-color);">${activeAlerts === 0 ? '🟢' : '🔴'}</div>
                            <div class="value">${activeAlerts === 0 ? 'Система активна' : 'Есть тревоги'}</div>
                            <div class="label">Статус</div>
                        </div>
                        <div class="large-indicator">
                            <div class="icon">🚨</div>
                            <div class="value">${activeAlerts}</div>
                            <div class="label">Тревог</div>
                        </div>
                        <div class="large-indicator">
                            <div class="icon">📹</div>
                            <div class="value">${cameras.length}</div>
                            <div class="label">Камеры</div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-icon">🚪</div>
                        <span class="card-title">Двери и окна</span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Входная дверь:</span>
                        <span class="status-value ${this._hass?.states['binary_sensor.door_front']?.state === 'on' ? 'danger' : 'success'}">
                            ${this._hass?.states['binary_sensor.door_front']?.state === 'on' ? 'Открыта' : 'Закрыта'}
                        </span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Окно на кухне:</span>
                        <span class="status-value ${this._hass?.states['binary_sensor.window_kitchen']?.state === 'on' ? 'danger' : 'success'}">
                            ${this._hass?.states['binary_sensor.window_kitchen']?.state === 'on' ? 'Открыто' : 'Закрыто'}
                        </span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Гараж:</span>
                        <span class="status-value ${this._hass?.states['binary_sensor.garage_door']?.state === 'on' ? 'danger' : 'success'}">
                            ${this._hass?.states['binary_sensor.garage_door']?.state === 'on' ? 'Открыт' : 'Закрыт'}
                        </span>
                    </div>
                    <div class="card-footer">
                        <span class="badge ${doorOpen > 0 ? 'warning' : 'success'}">
                            ${doorOpen > 0 ? `${doorOpen} открыто` : 'Всё закрыто'}
                        </span>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-icon">🚶</div>
                        <span class="card-title">Датчики движения</span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Гостиная:</span>
                        <span class="status-value ${this._hass?.states['binary_sensor.motion_living']?.state === 'on' ? 'on' : 'off'}">
                            ${this._hass?.states['binary_sensor.motion_living']?.state === 'on' ? 'Есть' : 'Нет'}
                        </span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Двор:</span>
                        <span class="status-value ${this._hass?.states['binary_sensor.motion_yard']?.state === 'on' ? 'on' : 'off'}">
                            ${this._hass?.states['binary_sensor.motion_yard']?.state === 'on' ? 'Есть' : 'Нет'}
                        </span>
                    </div>
                    <div class="card-footer">
                        <span class="badge ${motionActive > 0 ? 'warning' : 'success'}">
                            ${motionActive > 0 ? `${motionActive} активных` : 'Нет движения'}
                        </span>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-icon">🔥</div>
                        <span class="card-title">Датчики</span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Дым:</span>
                        <span class="status-value ${this._hass?.states['binary_sensor.smoke']?.state === 'on' ? 'danger' : 'success'}">
                            ${this._hass?.states['binary_sensor.smoke']?.state === 'on' ? 'Тревога' : 'Норма'}
                        </span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Протечка воды:</span>
                        <span class="status-value ${this._hass?.states['binary_sensor.water_leak']?.state === 'on' ? 'danger' : 'success'}">
                            ${this._hass?.states['binary_sensor.water_leak']?.state === 'on' ? 'Тревога' : 'Норма'}
                        </span>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-icon">📹</div>
                        <span class="card-title">Камеры</span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Камера во дворе:</span>
                        <span class="status-value ${this._hass?.states['camera.cam1_yard']?.state === 'idle' ? 'success' : 'off'}">
                            ${this._hass?.states['camera.cam1_yard']?.state === 'idle' ? 'Online' : 'Offline'}
                        </span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Камера у двери:</span>
                        <span class="status-value ${this._hass?.states['camera.cam2_door']?.state === 'idle' ? 'success' : 'off'}">
                            ${this._hass?.states['camera.cam2_door']?.state === 'idle' ? 'Online' : 'Offline'}
                        </span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Камера в гараже:</span>
                        <span class="status-value ${this._hass?.states['camera.cam3_garage']?.state === 'idle' ? 'success' : 'off'}">
                            ${this._hass?.states['camera.cam3_garage']?.state === 'idle' ? 'Online' : 'Offline'}
                        </span>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-icon">⏰</div>
                        <span class="card-title">Последние события</span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span class="status-value">Система активна</span>
                    </div>
                    ${motionActive > 0 ? `
                    <div class="status-row">
                        <span class="status-label">${new Date(Date.now() - 5*60000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span class="status-value warning">Движение во дворе</span>
                    </div>
                    ` : ''}
                    ${doorOpen > 0 ? `
                    <div class="status-row">
                        <span class="status-label">${new Date(Date.now() - 15*60000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span class="status-value warning">Открыт гараж</span>
                    </div>
                    ` : ''}
                    <div class="status-row">
                        <span class="status-label">${new Date(Date.now() - 60*60000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span class="status-value success">Система активирована</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderLoading() {
        return `
            <div class="home-grid">
                <div class="card">
                    <div class="placeholder-content">
                        <div>⏳</div>
                        <div>Загрузка...</div>
                    </div>
                </div>
            </div>
        `;
    }

    toggleTheme() {
        if (this.settings.theme === "auto") {
            this.settings.theme =
                this.getAttribute("theme") === "dark" ? "light" : "dark";
        } else {
            this.settings.theme = this.settings.theme === "dark" ? "light" : "dark";
        }

        this.applyTheme();
        this.saveSettings();

        // Обновляем класс на toggle кнопке
        const themeToggle = this.shadowRoot.querySelector(".theme-toggle");
        if (themeToggle) {
            const newTheme = this.getAttribute("theme");
            themeToggle.classList.remove("dark", "light");
            themeToggle.classList.add(newTheme === "dark" ? "dark" : "light");
        }
    }

    applyTheme() {
        let themeToApply;

        if (this.settings.theme === "auto") {
            themeToApply = this.getThemeByTime();
        } else {
            themeToApply = this.settings.theme;
        }

        this.setAttribute("theme", themeToApply);
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem("my-dashboard-app_settings");
            if (saved) {
                const parsed = JSON.parse(saved);
                this.settings = { ...this.settings, ...parsed };
            }
        } catch (e) { }
    }

    saveSettings() {
        try {
            localStorage.setItem(
                "my-dashboard-app_settings",
                JSON.stringify(this.settings)
            );
        } catch (e) { }
    }
}

customElements.define("my-dashboard-app", MyDashboard);