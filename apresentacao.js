// Espera todo o conteúdo do HTML (DOM) ser carregado antes de executar o script.
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LÓGICA DOS BOTÕES (Login / Criar Conta) ---
    // (Como solicitado, esta parte vem primeiro)

    // Seleciona os botões da página de apresentação
    const navLoginButton = document.querySelector('.nav-button');
    const createAccountButton = document.querySelector('.action-button.primary');
    const signInButton = document.querySelector('.action-button.secondary');

    // Adiciona evento para o botão "Fazer login" no header
    if (navLoginButton) {
        navLoginButton.addEventListener('click', (e) => {
            e.preventDefault(); // Previne a ação padrão do link '#'
            console.log('Botão "Fazer login" clicado.');
            // Substitua 'login.html' pela sua página de login real
            window.location.href = 'login.html'; 
        });
    }

    // Adiciona evento para o botão "Criar minha conta"
    if (createAccountButton) {
        createAccountButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Botão "Criar minha conta" clicado.');
            // Substitua 'register.html' pela sua página de registro real
            window.location.href = 'cadastro.html';
        });
    }

    // Adiciona evento para o botão "Entrar (Já tenho conta)"
    if (signInButton) {
        signInButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Botão "Entrar" clicado.');
            // Substitua 'login.html' pela sua página de login real
            window.location.href = 'login.html';
        });
    }
    
    const track = document.getElementById('carousel-track');
    const nextButton = document.getElementById('next-btn');
    const prevButton = document.getElementById('prev-btn');
    const dotsNav = document.getElementById('carousel-dots');
    
    if (!track || !nextButton || !prevButton || !dotsNav) {
        console.error('Um ou mais elementos do carrossel não foram encontrados.');
        return;
    }

    const slides = Array.from(track.children);
    
    if (slides.length === 0) return;

    slides.forEach((slide, index) => {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', `Ir para o slide ${index + 1}`);
        if (index === 0) {
            dot.classList.add('active');
        }
        dotsNav.appendChild(dot);
    });

    const dots = Array.from(dotsNav.children);
    let currentIndex = 0; 

    const goToSlide = (index) => {
        if (index < 0 || index >= slides.length) {
            if (index >= slides.length) {
                index = 0;
            } else {
                return; 
            }
        }
        
        track.style.transform = `translateX(-${index * 100}%)`;
        
        dots[currentIndex].classList.remove('active');
        dots[index].classList.add('active');
        
        currentIndex = index;
        
        updateArrows(currentIndex);
    };

    const updateArrows = (index) => {
        prevButton.style.display = (index === 0) ? 'none' : 'block';
        nextButton.style.display = (index === slides.length - 1) ? 'none' : 'block';
    };

    nextButton.addEventListener('click', e => {
        goToSlide(currentIndex + 1);
    });

    prevButton.addEventListener('click', e => {
        goToSlide(currentIndex - 1);
    });

    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button');
        if (!targetDot) return; 

        const targetIndex = dots.findIndex(dot => dot === targetDot);
        goToSlide(targetIndex);
    });

    setInterval(() => {
        let nextIndex = (currentIndex + 1) % slides.length; 
        goToSlide(nextIndex);
    }, 10000); 

    updateArrows(currentIndex);
});

