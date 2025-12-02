// theme.js - Управление темами с правильными цветами

class ThemeManager {
    constructor() {
        this.themes = {
            light: {
                '--primary-color': '#e10600',
                '--secondary-color': '#1e1e1e',
                '--light-color': '#f5f5f5',
                '--dark-color': '#ffffff',
                '--text-color': '#333333',
                '--text-light': '#ffffff',
                '--accent-color': '#ffcc00',
                '--card-bg': '#ffffff',
                '--section-bg': '#ffffff',
                '--footer-bg': '#1e1e1e',
                '--header-bg': '#1e1e1e',
                '--border-color': '#e0e0e0',
                '--shadow-color': 'rgba(0, 0, 0, 0.1)'
            },
            dark: {
                '--primary-color': '#ff6b6b',
                '--secondary-color': '#2d2d2d',
                '--light-color': '#1a1a1a',
                '--dark-color': '#121212',
                '--text-color': '#e0e0e0',
                '--text-light': '#ffffff',
                '--accent-color': '#ffcc00',
                '--card-bg': '#2d2d2d',
                '--section-bg': '#2d2d2d',
                '--footer-bg': '#121212',
                '--header-bg': '#121212',
                '--border-color': '#404040',
                '--shadow-color': 'rgba(0, 0, 0, 0.3)'
            }
        };
        
        this.init();
    }

    init() {
        // Проверяем сохраненную тему или системные настройки
        let savedTheme = localStorage.getItem('f1-theme');
        
        if (!savedTheme) {
            // Проверяем системные настройки
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            savedTheme = prefersDark ? 'dark' : 'light';
        }
        
        this.setTheme(savedTheme);
        this.initThemeToggle();
        this.initCustomization();
        
        // Слушаем изменения системной темы
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('f1-theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        const themeColors = this.themes[theme];
        const root = document.documentElement;
        
        // Применяем все переменные CSS
        Object.entries(themeColors).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
        
        // Устанавливаем атрибут для body
        document.body.setAttribute('data-theme', theme);
        
        // Сохраняем в localStorage
        localStorage.setItem('f1-theme', theme);
        
        // Обновляем переключатель
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.textContent = theme === 'dark' ? '☀️ Светлая' : '🌙 Темная';
            toggle.title = `Переключить на ${theme === 'dark' ? 'светлую' : 'темную'} тему`;
        }
        
        // Обновляем мета-тег theme-color
        this.updateMetaThemeColor(themeColors['--header-bg']);
        
        console.log(`Тема установлена: ${theme}`);
    }

    updateMetaThemeColor(color) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.content = color;
    }

    initThemeToggle() {
        // Удаляем старый переключатель, если есть
        const oldToggle = document.querySelector('.theme-toggle');
        if (oldToggle) oldToggle.remove();
        
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'theme-toggle';
        toggleBtn.innerHTML = '🌙 Темная';
        toggleBtn.title = 'Переключить тему';
        
        // Добавляем стили для переключателя
        toggleBtn.style.cssText = `
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: auto;
            min-width: 120px;
            height: 50px;
            border-radius: 25px;
            background: var(--primary-color);
            color: var(--text-light);
            border: none;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 600;
            z-index: 1000;
            box-shadow: var(--shadow);
            transition: all 0.3s ease;
            padding: 0 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            white-space: nowrap;
        `;

        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const currentTheme = document.body.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Анимация нажатия
            toggleBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                toggleBtn.style.transform = 'scale(1)';
            }, 200);
            
            this.setTheme(newTheme);
        });

        // Добавляем hover эффект
        toggleBtn.addEventListener('mouseenter', () => {
            toggleBtn.style.transform = 'translateY(-2px)';
            toggleBtn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
        });
        
        toggleBtn.addEventListener('mouseleave', () => {
            toggleBtn.style.transform = '';
            toggleBtn.style.boxShadow = 'var(--shadow)';
        });

        document.body.appendChild(toggleBtn);
        
        // Обновляем текст кнопки
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        toggleBtn.textContent = currentTheme === 'dark' ? '☀️ Светлая' : '🌙 Темная';
    }

    initCustomization() {
        this.createCustomizationPanel();
        this.loadCustomSettings();
    }

    createCustomizationPanel() {
        // Удаляем старую панель, если есть
        const oldPanel = document.getElementById('customization-panel');
        if (oldPanel) oldPanel.remove();
        
        const oldSettingsBtn = document.querySelector('.settings-toggle');
        if (oldSettingsBtn) oldSettingsBtn.remove();

        const panel = document.createElement('div');
        panel.id = 'customization-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 160px;
            right: 20px;
            background: var(--section-bg);
            border: 2px solid var(--primary-color);
            border-radius: 12px;
            padding: 20px;
            width: 280px;
            box-shadow: var(--shadow);
            z-index: 999;
            display: none;
            color: var(--text-color);
            font-family: inherit;
        `;

        panel.innerHTML = `
            <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                <h3 style="margin: 0; color: var(--primary-color); font-size: 1.1rem;">Настройки отображения</h3>
                <button class="close-panel" style="background: none; border: none; color: var(--text-color); font-size: 1.5rem; cursor: pointer; line-height: 1;">×</button>
            </div>
            
            <div class="setting" style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-color);">Размер текста:</label>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 0.9rem; color: var(--primary-color);">A-</span>
                    <input type="range" id="fontSize" min="12" max="24" value="16" step="1" style="flex: 1; accent-color: var(--primary-color);">
                    <span style="font-size: 1.1rem; color: var(--primary-color);">A+</span>
                </div>
                <div style="text-align: center; margin-top: 5px; font-size: 0.8rem; color: var(--text-color); opacity: 0.7;" id="fontSizeValue">16px</div>
            </div>
            
            <div class="setting" style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-color);">Яркость интерфейса:</label>
                <input type="range" id="brightness" min="80" max="120" value="100" step="1" style="width: 100%; accent-color: var(--primary-color);">
                <div style="text-align: center; margin-top: 5px; font-size: 0.8rem; color: var(--text-color); opacity: 0.7;" id="brightnessValue">100%</div>
            </div>
            
            <div class="setting" style="margin-bottom: 25px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-color);">Контрастность:</label>
                <input type="range" id="contrast" min="90" max="110" value="100" step="1" style="width: 100%; accent-color: var(--primary-color);">
                <div style="text-align: center; margin-top: 5px; font-size: 0.8rem; color: var(--text-color); opacity: 0.7;" id="contrastValue">100%</div>
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 15px;">
                <button id="applySettings" style="flex: 1; padding: 12px; background: var(--primary-color); color: var(--text-light); border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">
                    Применить
                </button>
                <button id="resetSettings" style="flex: 1; padding: 12px; background: var(--secondary-color); color: var(--text-light); border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">
                    Сбросить
                </button>
            </div>
        `;

        document.body.appendChild(panel);

        // Кнопка для открытия панели
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'settings-toggle';
        settingsBtn.innerHTML = '⚙️ Настройки';
        settingsBtn.title = 'Настройки отображения';
        settingsBtn.style.cssText = `
            position: fixed;
            bottom: 150px;
            right: 20px;
            width: auto;
            min-width: 140px;
            height: 50px;
            border-radius: 25px;
            background: var(--secondary-color);
            color: var(--text-light);
            border: none;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 600;
            z-index: 1000;
            box-shadow: var(--shadow);
            transition: all 0.3s ease;
            padding: 0 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            white-space: nowrap;
        `;

        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const panel = document.getElementById('customization-panel');
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        });

        settingsBtn.addEventListener('mouseenter', () => {
            settingsBtn.style.transform = 'translateY(-2px)';
            settingsBtn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
        });
        
        settingsBtn.addEventListener('mouseleave', () => {
            settingsBtn.style.transform = '';
            settingsBtn.style.boxShadow = 'var(--shadow)';
        });

        document.body.appendChild(settingsBtn);

        // Обновление значений при движении слайдеров
        document.getElementById('fontSize').addEventListener('input', (e) => {
            document.getElementById('fontSizeValue').textContent = `${e.target.value}px`;
        });
        
        document.getElementById('brightness').addEventListener('input', (e) => {
            document.getElementById('brightnessValue').textContent = `${e.target.value}%`;
        });
        
        document.getElementById('contrast').addEventListener('input', (e) => {
            document.getElementById('contrastValue').textContent = `${e.target.value}%`;
        });

        // Закрытие панели
        panel.querySelector('.close-panel').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        // Применение настроек
        document.getElementById('applySettings').addEventListener('click', () => {
            this.applyCustomSettings();
        });

        // Сброс настроек
        document.getElementById('resetSettings').addEventListener('click', () => {
            this.resetCustomSettings();
        });

        // Закрытие по клику вне панели
        document.addEventListener('click', (e) => {
            const panel = document.getElementById('customization-panel');
            const settingsBtn = document.querySelector('.settings-toggle');
            
            if (panel && panel.style.display === 'block' && 
                !panel.contains(e.target) && 
                !settingsBtn.contains(e.target)) {
                panel.style.display = 'none';
            }
        });
    }

    applyCustomSettings() {
        const fontSize = document.getElementById('fontSize').value;
        const brightness = document.getElementById('brightness').value;
        const contrast = document.getElementById('contrast').value;

        // Применяем настройки
        document.body.style.fontSize = `${fontSize}px`;
        document.body.style.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

        // Сохраняем в localStorage
        localStorage.setItem('f1-fontSize', fontSize);
        localStorage.setItem('f1-brightness', brightness);
        localStorage.setItem('f1-contrast', contrast);

        // Показываем уведомление
        this.showNotification('Настройки применены!');
        
        // Закрываем панель через 1 секунду
        setTimeout(() => {
            const panel = document.getElementById('customization-panel');
            panel.style.display = 'none';
        }, 1000);
    }

    resetCustomSettings() {
        // Сбрасываем значения
        document.getElementById('fontSize').value = 16;
        document.getElementById('brightness').value = 100;
        document.getElementById('contrast').value = 100;
        
        document.getElementById('fontSizeValue').textContent = '16px';
        document.getElementById('brightnessValue').textContent = '100%';
        document.getElementById('contrastValue').textContent = '100%';
        
        // Сбрасываем стили
        document.body.style.fontSize = '';
        document.body.style.filter = '';
        
        // Удаляем из localStorage
        localStorage.removeItem('f1-fontSize');
        localStorage.removeItem('f1-brightness');
        localStorage.removeItem('f1-contrast');

        // Показываем уведомление
        this.showNotification('Настройки сброшены!');
    }

    loadCustomSettings() {
        const fontSize = localStorage.getItem('f1-fontSize');
        const brightness = localStorage.getItem('f1-brightness');
        const contrast = localStorage.getItem('f1-contrast');

        if (fontSize) {
            document.getElementById('fontSize').value = fontSize;
            document.getElementById('fontSizeValue').textContent = `${fontSize}px`;
            document.body.style.fontSize = `${fontSize}px`;
        }

        if (brightness && contrast) {
            document.getElementById('brightness').value = brightness;
            document.getElementById('contrast').value = contrast;
            
            document.getElementById('brightnessValue').textContent = `${brightness}%`;
            document.getElementById('contrastValue').textContent = `${contrast}%`;
            
            document.body.style.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
        }
    }

    showNotification(message) {
        // Удаляем старое уведомление, если есть
        const oldNotification = document.querySelector('.custom-notification');
        if (oldNotification) oldNotification.remove();

        const notification = document.createElement('div');
        notification.className = 'custom-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 220px;
            right: 20px;
            background: var(--primary-color);
            color: var(--text-light);
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: var(--shadow);
            z-index: 1001;
            animation: notificationSlideIn 0.3s ease;
            font-weight: 600;
            max-width: 250px;
            text-align: center;
        `;

        document.body.appendChild(notification);

        // Добавляем CSS анимацию
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes notificationSlideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes notificationSlideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            notification.style.animation = 'notificationSlideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Создаем глобальный объект только если его нет
    if (!window.themeManager) {
        window.themeManager = new ThemeManager();
    }
    
    // Добавляем CSS переменные по умолчанию
    if (!document.querySelector('#theme-variables')) {
        const style = document.createElement('style');
        style.id = 'theme-variables';
        style.textContent = `
            :root {
                --primary-color: #e10600;
                --secondary-color: #1e1e1e;
                --light-color: #f5f5f5;
                --dark-color: #ffffff;
                --text-color: #333333;
                --text-light: #ffffff;
                --accent-color: #ffcc00;
                --card-bg: #ffffff;
                --section-bg: #ffffff;
                --footer-bg: #1e1e1e;
                --header-bg: #1e1e1e;
                --border-color: #e0e0e0;
                --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            body[data-theme="dark"] {
                --primary-color: #ff6b6b;
                --secondary-color: #2d2d2d;
                --light-color: #1a1a1a;
                --dark-color: #121212;
                --text-color: #e0e0e0;
                --text-light: #ffffff;
                --accent-color: #ffcc00;
                --card-bg: #2d2d2d;
                --section-bg: #2d2d2d;
                --footer-bg: #121212;
                --header-bg: #121212;
                --border-color: #404040;
                --shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            }
            
            /* Стили для переключателей */
            .theme-toggle:hover,
            .settings-toggle:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 6px 20px rgba(0,0,0,0.2) !important;
            }
            
            .theme-toggle:active,
            .settings-toggle:active {
                transform: scale(0.95) !important;
            }
            
            #customization-panel {
                backdrop-filter: blur(10px);
                background: rgba(var(--section-bg-rgb), 0.95) !important;
            }
            
            /* Улучшаем видимость слайдеров */
            input[type="range"] {
                height: 6px;
                border-radius: 3px;
                background: var(--border-color);
            }
            
            input[type="range"]::-webkit-slider-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: var(--primary-color);
                cursor: pointer;
                border: 2px solid var(--text-light);
            }
        `;
        document.head.appendChild(style);
    }
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager };
}