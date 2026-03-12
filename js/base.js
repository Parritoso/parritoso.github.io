// Lógica simple para Dark Mode
const toggle = document.getElementById('themeToggle');
toggle.addEventListener('change', () => {
    const theme = toggle.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', theme);
});

// Inicializar Tooltips (Bootstrap requiere JS para esto)
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el))

// Interceptor de scroll para animaciones "Narrativas"
window.addEventListener('scroll', () => {
    document.querySelectorAll('.reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add('active');
        }
    });
});