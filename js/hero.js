// --- VARIABLES GLOBALES DE ESTADO ---
const words = ["Fullstack", "DevOps", "Cloud Computing", "Arquitectura"];
let wordIdx = 0, charIdx = 0, isDeleting = false;
let particles = [];
const mouse = { x: null, y: null };

// --- CONFIGURACIÓN MATRIX ---
const matrixChars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲンQWERTYUIOPASDFGHJKLZXCVBNM0123456789".split("");
const fontSize = 16;
let drops = [];
let matrixColor = "#0F0"; // Variable para el cambio de color

document.addEventListener('DOMContentLoaded', () => {

    const htmlElement = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    let matrixInterval = null; // Lo controlamos dinámicamente
    
    // --- 1. LÓGICA DE DETECCIÓN DE TEMA ---
    const getPreferredTheme = () => {
        const stored = localStorage.getItem('theme');
        if (stored) return stored;
        //usamos la preferencia del sistema
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const setTheme = (theme) => {
        htmlElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.checked = (theme === 'dark');
        
        // Control de ejecución de los loops para ahorrar batería/CPU
        if (theme === 'dark') {
            if (!matrixInterval) matrixInterval = setInterval(drawMatrix, 35);
        } else {
            clearInterval(matrixInterval);
            matrixInterval = null;
        }
    };
    // Inicialización inmediata
    let currentTheme = getPreferredTheme();
    setTheme(currentTheme);

    // 1. SELECTORES
    const particleCanvas = document.getElementById('particleCanvas');
    const matrixCanvas = document.getElementById('c');
    const textElement = document.getElementById('typing-text');
    const flipper = document.getElementById('heroImageFlipper');
    const nameText = document.getElementById('hero-name-dynamic');
    const clickArea = document.getElementById('heroImageClickArea');

    // 2. CONTEXTOS
    const pCtx = particleCanvas.getContext('2d');
    const mCtx = matrixCanvas.getContext('2d');

    // 3. INICIALIZACIÓN DE TAMAÑOS
    function initCanvasSizes() {
        particleCanvas.width = matrixCanvas.width = window.innerWidth;
        particleCanvas.height = matrixCanvas.height = window.innerHeight;
        
        // Re-inicializar gotas de Matrix
        const columns = matrixCanvas.width / fontSize;
        drops = Array(Math.floor(columns)).fill(1);
        
        // Re-inicializar partículas
        particles = [];
        for (let i = 0; i < 80; i++) {
            particles.push({
                x: Math.random() * particleCanvas.width,
                y: Math.random() * particleCanvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 1 - 0.5,
                speedY: Math.random() * 1 - 0.5
            });
        }
    }

    // --- LÓGICA DE DIBUJO: PARTÍCULAS ---
    function animateParticles() {
        pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        const color = getComputedStyle(document.documentElement).getPropertyValue('--bs-primary').trim();

        particles.forEach(p => {
            p.x += p.speedX; p.y += p.speedY;
            if (p.x > particleCanvas.width || p.x < 0) p.speedX *= -1;
            if (p.y > particleCanvas.height || p.y < 0) p.speedY *= -1;

            let dx = mouse.x - p.x;
            let dy = mouse.y - p.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 100) {
                pCtx.strokeStyle = color;
                pCtx.lineWidth = 0.2;
                pCtx.beginPath(); pCtx.moveTo(p.x, p.y); pCtx.lineTo(mouse.x, mouse.y); pCtx.stroke();
            }

            pCtx.fillStyle = color;
            pCtx.globalAlpha = 0.3;
            pCtx.beginPath(); pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2); pCtx.fill();
        });
        requestAnimationFrame(animateParticles);
    }

    // --- LÓGICA DE DIBUJO: MATRIX ---
    function drawMatrix() {
        mCtx.fillStyle = "rgba(0, 0, 0, 0.05)";
        mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

        mCtx.fillStyle = matrixColor; 
        mCtx.font = fontSize + "px 'DotGothic16'";

        for (let i = 0; i < drops.length; i++) {
            const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            mCtx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    // --- EFECTO TYPING ---
    function type() {
        const currentWord = words[wordIdx];
        textElement.textContent = isDeleting
            ? currentWord.substring(0, charIdx--)
            : currentWord.substring(0, charIdx++);

        if (!isDeleting && charIdx > currentWord.length) {
            setTimeout(() => isDeleting = true, 2000);
        } else if (isDeleting && charIdx < 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
        }
        setTimeout(type, isDeleting ? 50 : 150);
    }

    // --- EVENTOS ---
    window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });
    window.addEventListener('resize', initCanvasSizes);

    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        setTheme(newTheme);
    });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) { // Solo si el usuario no lo cambió a mano
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
    
    // Lógica del Flip de Imagen
    let isFlipped = false;
    clickArea.addEventListener('click', () => {
        isFlipped = !isFlipped;
        flipper.classList.toggle('is-flipped');

        // 3. CAMBIO DE COLOR DEL MATRIX RAIN
        // Cuando es true (Alias): Azul Cyan (#0FF)
        // Cuando es false (Nombre Real): Verde (#0F0)
        matrixColor = isFlipped ? "#00FFFF" : "#00FF00";

        nameText.classList.add('text-hidden');

        setTimeout(() => {
            nameText.textContent = isFlipped ? "Parritoso" : "Javier Sánchez";
            nameText.classList.remove('text-primary', 'text-info');
            nameText.classList.add(isFlipped ? 'text-info' : 'text-primary');
            nameText.classList.remove('text-hidden');
        }, 300);
    });

    // --- ARRANQUE ---
    initCanvasSizes();
    animateParticles();
    type();

    // Accesibilidad
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        clearInterval(matrixInterval);
    }
});