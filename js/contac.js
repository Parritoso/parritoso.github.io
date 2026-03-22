document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnSpinner = document.getElementById('btnSpinner');
    const btnText = document.getElementById('btnText');
    const successAlert = document.getElementById('successAlert');

    // 1. Validación en tiempo real (WCAG 2.2 Feedback)
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.checkValidity()) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
            } else {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
            }
        });
    });

    // 2. Manejo del Envío
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity()) {
            // Estado de carga (Spinner activo)
            submitBtn.disabled = true;
            btnSpinner.classList.remove('d-none');
            btnText.textContent = 'Enviando...';

            // Simulación de envío de API (2 segundos)
            setTimeout(() => {
                btnSpinner.classList.add('d-none');
                btnText.textContent = '¡Enviado!\nRecuerde que es un proyecto educativo y no se enviara ningun correo';
                submitBtn.classList.replace('btn-primary', 'btn-success');
                successAlert.classList.remove('d-none');
                
                form.reset();
                inputs.forEach(i => i.classList.remove('is-valid'));
            }, 2000);
        }

        form.classList.add('was-validated');
    }, false);
});