(() => {
    const menuToggleButton = document.getElementById('mobile-menu-toggle');
    const navMenuMobile = document.getElementById('nav-menu-mobile');
    const mobileMenuLinks = navMenuMobile?.querySelectorAll('a') ?? [];

    if (!menuToggleButton || !navMenuMobile) {
        return;
    }

    function closeMenu(shouldFocusToggle = false) {
        navMenuMobile.classList.remove('is-open');
        menuToggleButton.classList.remove('active');
        menuToggleButton.setAttribute('aria-expanded', 'false');

        if (shouldFocusToggle) {
            menuToggleButton.focus();
        }
    }

    menuToggleButton.addEventListener('click', function () {
        const isOpen = navMenuMobile.classList.toggle('is-open');

        // Atualiza o atributo ARIA
        this.setAttribute('aria-expanded', String(isOpen));
        this.classList.toggle('active', isOpen);
    });

    mobileMenuLinks.forEach((link) => {
        link.addEventListener('click', () => {
            closeMenu();
        });

        link.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                closeMenu();
            }
        });
    });

    // fecha o menu se o usuário clicar fora dele
    document.addEventListener('click', function (event) {
        // verifica se o clique foi fora do menu e fora do botão de toggle
        if (!navMenuMobile.contains(event.target) && !menuToggleButton.contains(event.target)) {
            if (navMenuMobile.classList.contains('is-open')) {
                closeMenu();
            }
        }
    });

    document.addEventListener('keydown', function (event) {
        // verifica se a tecla pressionada foi 'Escape' E se o menu está aberto
        if (event.key === 'Escape' && navMenuMobile.classList.contains('is-open')) {
            closeMenu(true);
        }
    });
})();
