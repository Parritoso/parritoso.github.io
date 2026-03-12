document.addEventListener('DOMContentLoaded', () => {
    // Inicializar ScrollSpy manualmente
    const scrollSpy = new bootstrap.ScrollSpy(document.body, {
        target: '#navbarNav',
        offset: 80 // Ajusta este valor según la altura de tu navbar
    });

    // Microinteracción extra: Cerrar el menú móvil al hacer clic en un link
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('navbarNav');
    const bsCollapse = new bootstrap.Collapse(menuToggle, { toggle: false });

    navLinks.forEach((l) => {
        l.addEventListener('click', () => {
            if (window.innerWidth < 992) { // Solo en dispositivos móviles
                bsCollapse.hide();
            }
        });
    });
});