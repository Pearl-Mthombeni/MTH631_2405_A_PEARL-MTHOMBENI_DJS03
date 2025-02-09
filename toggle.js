class ThemeToggle extends HTMLElement {
    constructor() {
        super();
        
        const shadow = this.attachShadow({ mode: 'open' });

        const container = document.createElement('select');
        container.setAttribute('id', 'theme-toggle');

        const dayOption = document.createElement('option');
        dayOption.value = 'day';
        dayOption.textContent = 'Day';
        container.appendChild(dayOption);

        const nightOption = document.createElement('option');
        nightOption.value = 'night';
        nightOption.textContent = 'Night';
        container.appendChild(nightOption);

        container.addEventListener('change', this.onChangeTheme);

        shadow.appendChild(container);
    }

    onChangeTheme(event) {
        const theme = event.target.value;
        if (theme === 'night') {
            document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
            document.documentElement.style.setProperty("--color-light", "10, 10, 20");
        } else {
            document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
            document.documentElement.style.setProperty("--color-light", "255, 255, 255");
        }
    }
}

customElements.define('theme-toggle', ThemeToggle);