(() => {
    // TODO: fechar menu mobile ao clicar em uma opção
    const menuToggleButton = document.getElementById('mobile-menu-toggle');
    const navMenuMobile = document.getElementById('nav-menu-mobile');

    if (menuToggleButton && navMenuMobile) {
        menuToggleButton.addEventListener('click', function () {
            const isOpen = navMenuMobile.classList.toggle('is-open');

            // Atualiza o atributo ARIA
            this.setAttribute('aria-expanded', isOpen);

            this.classList.toggle('active');
        });
    }

    // fecha o menu se o usuário clicar fora dele
    document.addEventListener('click', function (event) {
        // verifica se o clique foi fora do menu e fora do botão de toggle
        if (!navMenuMobile.contains(event.target) && !menuToggleButton.contains(event.target)) {
            if (navMenuMobile.classList.contains('is-open')) {
                navMenuMobile.classList.remove('is-open');
                menuToggleButton.classList.remove('active');
                menuToggleButton.setAttribute('aria-expanded', 'false');
            }
        }
    });

    document.addEventListener('keydown', function (event) {
        // verifica se a tecla pressionada foi 'Escape' E se o menu está aberto
        if (event.key === 'Escape' && navMenuMobile.classList.contains('is-open')) {

            navMenuMobile.classList.remove('is-open');
            menuToggleButton.setAttribute('aria-expanded', 'false');
            menuToggleButton.classList.remove('active');

            // focar de volta no botão de toggle após fechar o menu
            menuToggleButton.focus();
        }
    });
})();