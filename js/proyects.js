document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Animate On Scroll
    AOS.init({
        duration: 800,
        once: true,
        mirror: false
    });

    // Lógica de filtrado de proyectos
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Cambiar clase activa en botones
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.classList.remove('hide');
                    // Pequeño timeout para re-activar AOS si fuera necesario
                    setTimeout(() => item.style.opacity = '1', 10);
                } else {
                    item.classList.add('hide');
                    item.style.opacity = '0';
                }
            });
            
            // Refrescar AOS para que recalcule posiciones
            AOS.refresh();
        });
    });
});