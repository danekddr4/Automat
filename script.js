// Automat na nápoje - JavaScript funkcionalita

class DrinkMachine {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.initVideoBackground();
        this.checkStatusParameter();
    }

    initVideoBackground() {
        const video = document.querySelector('.video-background video');
        if (video) {
            // Zajištění autoplay na mobilech
            video.addEventListener('loadeddata', () => {
                video.play().catch(e => {
                    console.log('Video autoplay failed:', e);
                });
            });

            // Optimalizace pro mobily
            if (window.innerWidth <= 768) {
                video.muted = true;
                video.playsInline = true;
                video.setAttribute('playsinline', '');
            }

            // Zajištění správného z-index
            video.style.zIndex = '1';
        }
    }

    bindEvents() {
        // Žádné event listenery nejsou potřeba
    }

    // Zpracování status parametrů z URL
    checkStatusParameter() {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
        
        if (status === '1') {
            this.showSuccessStatus();
        } else if (status === '2') {
            this.showErrorStatus();
        }
    }

    showSuccessStatus() {
        const overlay = document.getElementById('statusOverlay');
        const icon = document.getElementById('statusIcon');
        const title = document.getElementById('statusTitle');
        const message = document.getElementById('statusMessage');
        const countdown = document.getElementById('statusCountdown');

        overlay.className = 'status-overlay success';
        icon.textContent = '✅';
        title.textContent = 'Platba úspěšná!';
        message.textContent = 'Váš nápoj byl úspěšně vydán. Děkujeme za nákup!';
        
        overlay.style.display = 'flex';
        
        // Countdown a přesměrování
        this.startCountdown(countdown, 5, () => {
            window.location.href = 'https://drinkomat.cz';
        });
    }

    showErrorStatus() {
        const overlay = document.getElementById('statusOverlay');
        const icon = document.getElementById('statusIcon');
        const title = document.getElementById('statusTitle');
        const message = document.getElementById('statusMessage');
        const countdown = document.getElementById('statusCountdown');

        overlay.className = 'status-overlay error';
        icon.textContent = '❌';
        title.textContent = 'Chyba v platbě';
        message.textContent = 'Omlouváme se, ale při zpracování platby došlo k chybě. Zkuste to prosím znovu.';
        
        overlay.style.display = 'flex';
        
        // Countdown a přesměrování
        this.startCountdown(countdown, 5, () => {
            window.location.href = 'https://drinkomat.cz';
        });
    }

    startCountdown(countdownElement, seconds, callback) {
        let remaining = seconds;
        
        const updateCountdown = () => {
            countdownElement.textContent = `Přesměrování za ${remaining} sekund...`;
            remaining--;
            
            if (remaining < 0) {
                callback();
            } else {
                setTimeout(updateCountdown, 1000);
            }
        };
        
        updateCountdown();
    }
}

// CSS animace
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    @keyframes glow {
        0%, 100% { 
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        }
        50% { 
            box-shadow: 0 0 40px rgba(0, 255, 136, 0.6), 0 0 60px rgba(0, 255, 136, 0.4);
        }
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes sparkle {
        0% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0); }
    }
    
    .glow-animation {
        animation: glow 2s ease-in-out infinite;
    }
    
    .bounce-animation {
        animation: bounce 1s ease-in-out;
    }
    
    .shake-animation {
        animation: shake 0.5s ease-in-out;
    }
    
    .float-animation {
        animation: float 3s ease-in-out infinite;
    }
    
    .sparkle-effect {
        position: relative;
        overflow: hidden;
    }
    
    .sparkle-effect::after {
        content: '✨';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
        animation: sparkle 0.6s ease-in-out;
        pointer-events: none;
    }
`;
document.head.appendChild(style);

// Inicializace aplikace
document.addEventListener('DOMContentLoaded', () => {
    new DrinkMachine();
});

// Uložení instance pro globální přístup
window.drinkMachine = null;
document.addEventListener('DOMContentLoaded', () => {
    window.drinkMachine = new DrinkMachine();
});
