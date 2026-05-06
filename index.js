document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MODO CLARO / OSCURO AUTOMÁTICO ---
    const checkTimeAndSetTheme = () => {
        const hour = new Date().getHours();
        // Modo oscuro de 19:00 (7 PM) a 05:59 (5 AM)
        if (hour >= 19 || hour < 6) {
            document.documentElement.classList.add('dark-theme');
        } else {
            // Modo claro de 06:00 a 18:59
            document.documentElement.classList.remove('dark-theme');
        }
    };
    
    // Ejecutar al cargar
    checkTimeAndSetTheme();
    // Actualizar cada minuto por si cruza el umbral
    setInterval(checkTimeAndSetTheme, 60000);


    // --- 2. ANIMACIONES AL HACER SCROLL ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));


    // --- 3. ACORDEÓN PARA FAQ ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });

    // --- 4. SCROLL SUAVE ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    // --- 5. SIMULACIÓN DE CHAT WHATSAPP ---
    const chatContainer = document.getElementById('chat-container');
    if (!chatContainer) return;

    // Helper para calcular tiempo de lectura (aprox 50ms por carácter, min 1.5s)
    const getReadingDelay = (text) => {
        return Math.max(1500, text.length * 50);
    };

    // Helper para crear burbujas
    const createBubble = (text, type, isImage = false, imgSrc = '') => {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${type}`;
        
        if (isImage) {
            bubble.innerHTML = `<img src="${imgSrc}" class="chat-img" alt="Foto enviada"> ${text}`;
        } else {
            bubble.textContent = text;
        }
        
        return bubble;
    };

    // Helper para indicador escribiendo
    const createTypingIndicator = () => {
        const typing = document.createElement('div');
        typing.className = 'typing-indicator';
        typing.id = 'typing-indicator';
        typing.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        return typing;
    };

    // Helper para auto-scroll al final del chat
    const scrollToBottom = () => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };

    // Secuencia de animación del chat
    const runChatSimulation = async () => {
        // Limpiar chat
        chatContainer.innerHTML = '';
        
        // Pausa inicial
        await new Promise(r => setTimeout(r, 1000));

        // --- ESCENARIO 1: CLIMA ---
        const msg1 = "¿Cómo va a estar el clima hoy para mis plantas? 🌤️";
        chatContainer.appendChild(createBubble(msg1, "out"));
        scrollToBottom();
        await new Promise(r => setTimeout(r, getReadingDelay(msg1)));

        // Bot escribe
        const typing1 = createTypingIndicator();
        chatContainer.appendChild(typing1);
        scrollToBottom();
        await new Promise(r => setTimeout(r, 2000)); // Tiempo de "pensar"

        // Bot responde
        typing1.remove();
        const resp1 = "Hola Martín 🌿. Hoy en tu ciudad tendremos 32°C con sol fuerte. ¡No olvides regar tus suculentas antes del mediodía para evitar estrés térmico! 💧";
        chatContainer.appendChild(createBubble(resp1, "in"));
        scrollToBottom();
        await new Promise(r => setTimeout(r, getReadingDelay(resp1))); // Tiempo para leer respuesta
        
        // Pausa entre escenarios
        await new Promise(r => setTimeout(r, 2000));

        // --- ESCENARIO 2: PLANTA ENFERMA ---
        const msg2 = "¿Qué le pasa a mi Monstera? Las hojas se están poniendo así.";
        chatContainer.appendChild(createBubble(msg2, "out", true, "plant.png"));
        scrollToBottom();
        await new Promise(r => setTimeout(r, getReadingDelay(msg2) + 1000)); // Extra por la imagen

        // Bot escribe
        const typing2 = createTypingIndicator();
        chatContainer.appendChild(typing2);
        scrollToBottom();
        await new Promise(r => setTimeout(r, 2500));

        // Bot responde
        typing2.remove();
        const resp2 = "Parece que tiene exceso de riego (hojas amarillas y blandas). Te recomiendo dejar secar el sustrato por completo unos 4 días y asegurarte de que la maceta tenga buen drenaje. ¿Quieres que te avise en 4 días para revisarla?";
        chatContainer.appendChild(createBubble(resp2, "in"));
        scrollToBottom();
        
        // TIEMPO FINAL PARA LEER EL ÚLTIMO MENSAJE (importante!)
        await new Promise(r => setTimeout(r, getReadingDelay(resp2) + 4000));

        // Reiniciar el ciclo
        runChatSimulation();
    };

    // Iniciar simulación
    runChatSimulation();
});
