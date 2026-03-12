function initSkillsSection() {
    const skillsSection = document.querySelector('#stack');
    const progressBars = document.querySelectorAll('.progress-bar');
    const revealLeft = document.querySelector('.reveal-left'); // Puede ser null

    // 1. Inicializar Tooltips de Bootstrap (con el nuevo método)
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // 2. Observer para animar las barras al hacer scroll
    const observerOptions = {
        threshold: 0.2 // Se dispara un poco antes para que el usuario vea la animación
    };

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Check de seguridad: Solo animamos revealLeft si existe
                if (revealLeft) {
                    revealLeft.classList.add('active');
                }
                
                // Animamos las barras de progreso
                progressBars.forEach(bar => {
                    // Buscamos el contenedor .progress más cercano para leer el valor
                    const parent = bar.closest('.progress');
                    if (parent) {
                        const targetValue = parent.getAttribute('aria-valuenow');
                        bar.style.width = targetValue + '%';
                    }
                });
                
                // Dejamos de observar para no repetir la animación innecesariamente
                skillsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSkillsSection()
});