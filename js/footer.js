document.addEventListener('DOMContentLoaded', () => {
    const pet = document.getElementById('cockatiel-pet');
    const petImg = document.getElementById('cockatiel-img');
    const footer = document.querySelector('footer');

    // --- CONFIGURACIÓN TÉCNICA ---
    const CONFIG = {
        totalTime: 30000, // 30 segundos de paseo
        speeds: { walk: 1.5, fast: 3.5, run: 6, stop: 0 },
        gifs: {
            walk: "resources/images/gray_walk_8fps.gif",
            fast: "resources/images/gray_walk_fast_8fps.gif",
            run: "resources/images/gray_run_8fps.gif",
            swipe: "resources/images/gray_swipe_8fps.gif"
        }
    };

    let state = "IDLE"; // IDLE, ENTERING, WANDERING, EXITING
    let subState = "STOPPED"; // Para el estado WANDERING: WALKING, FAST, STOPPED
    let posX = window.innerWidth + 100;
    let targetX = window.innerWidth - 200;
    let direction = -1;
    let isActive = false;
    let wanderTimeout = null;

    // --- PANEL DE DEBUG ---
    const debug = document.createElement('div');
    debug.id = 'cockatiel-debug';
    document.body.appendChild(debug);

    function updateLog() {
        debug.innerHTML = `[PARRITOSO_OS]<br>STATE: ${state}<br>SUB: ${subState}<br>X: ${Math.round(posX)} -> TARGET: ${Math.round(targetX)}`;
    }

    // --- SISTEMA DE DECISIONES (IA) ---
    function decideNextAction() {
        if (state !== "WANDERING") return;

        // Elegimos una acción aleatoria
        const rand = Math.random();

        if (rand < 0.3) {
            // DETENERSE A ACICALARSE (Swipe)
            subState = "STOPPED";
            petImg.src = CONFIG.gifs.swipe;
            wanderTimeout = setTimeout(decideNextAction, Math.random() * 3000 + 2000); // Se para 2-5 seg
        } else {
            // CAMINAR A UN PUNTO ALEATORIO
            subState = rand > 0.7 ? "FAST" : "WALKING";
            petImg.src = subState === "FAST" ? CONFIG.gifs.fast : CONFIG.gifs.walk;

            // Definir un destino aleatorio dentro de la pantalla (con margen)
            targetX = Math.random() * (window.innerWidth - 200) + 100;
            direction = targetX > posX ? 1 : -1;
        }
    }

    // --- MOTOR DE MOVIMIENTO ---
    function update() {
        if (!isActive) return;

        let currentSpeed = 0;
        if (state === "ENTERING") currentSpeed = CONFIG.speeds.walk;
        else if (state === "EXITING") currentSpeed = CONFIG.speeds.run;
        else if (state === "WANDERING") {
            if (subState === "WALKING") currentSpeed = CONFIG.speeds.walk;
            else if (subState === "FAST") currentSpeed = CONFIG.speeds.fast;
        }

        // Mover si no hemos llegado al target o si estamos saliendo
        if (state === "EXITING" || (subState !== "STOPPED" && Math.abs(posX - targetX) > 5)) {
            posX += currentSpeed * direction;
            pet.style.left = posX + 'px';
        } else if (state === "WANDERING" && subState !== "STOPPED") {
            // Si llegó al target y no estaba parado, decide qué hacer ahora
            decideNextAction();
        }

        // Orientación (Girar si va a la izquierda, ya que el GIF mira a la derecha)
        if (direction === -1) pet.classList.add('look-left');
        else pet.classList.remove('look-left');

        updateLog();
        requestAnimationFrame(update);
    }

    // --- CICLO DE VIDA ---
    function spawn() {
        isActive = true;
        state = "ENTERING";
        posX = window.innerWidth + 100;
        targetX = window.innerWidth - 150;
        direction = -1;

        pet.classList.remove('cockatiel-hidden');
        debug.style.display = 'block';
        petImg.src = CONFIG.gifs.walk;

        // MENSAJE SECRETO POR CONSOLA
        console.log("%c [SYSTEM]: Parritoso.exe has joined the session. 🦜", "color: #00ff00; font-weight: bold; background: #000; padding: 5px;");
        console.warn("Monitoring user engagement... Stay cool.");

        update();

        // Tras entrar, empieza a deambular
        setTimeout(() => {
            if (isActive) {
                state = "WANDERING";
                decideNextAction();
            }
        }, 3000);

        // Programar salida
        setTimeout(initExit, CONFIG.totalTime);
    }

    function initExit() {
        state = "EXITING";
        subState = "RUNNING";
        petImg.src = CONFIG.gifs.run;
        clearTimeout(wanderTimeout);

        // Elige el lado más cercano para huir
        direction = posX > window.innerWidth / 2 ? 1 : -1;

        const checkExit = setInterval(() => {
            if (posX < -150 || posX > window.innerWidth + 150) {
                clearInterval(checkExit);
                isActive = false;
                state = "IDLE";
                pet.classList.add('cockatiel-hidden');
                debug.style.display = 'none';
                console.log("%c [SYSTEM]: Parritoso has left the server. Session secured. ", "color: #00ffff; font-style: italic;");
            }
        }, 100);
    }

    const SPAWN_CHANCE = 0.3; // 30% de probabilidad cada vez que llegas al footer
    const MOBILE_BREAKPOINT = 768;

    // --- DISPARADOR ---
    const observer = new IntersectionObserver((entries) => {
        const isVisible = entries[0].isIntersecting;

        if (isVisible && state === "IDLE") {
            // 1. Verificación de pantalla (Mobile Guard)
            if (window.innerWidth < MOBILE_BREAKPOINT) {
                console.log("[SYSTEM]: Parritoso is resting. Screen too small for a safe walk.");
                return;
            }

            // 2. Verificación de Probabilidad (Dice Roll)
            const roll = Math.random();
            if (roll <= SPAWN_CHANCE) {
                spawn();
            } else {
                // Log sutil para que tú sepas que el sistema funciona aunque no salga la ninfa
                console.log(`[DEBUG]: Parritoso roll failed (${roll.toFixed(2)} > ${SPAWN_CHANCE}). Better luck next scroll!`);
            }
        }
    }, { threshold: 0.5 });

    observer.observe(footer);
});