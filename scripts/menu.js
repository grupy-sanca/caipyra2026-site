(() => {

    const navEl = document.querySelector('nav.nav');
    const toggleBtn = document.querySelector('.menu-toggle');
    const menuLinks = document.getElementById('menu-links');

    if (toggleBtn && navEl) {
        toggleBtn.addEventListener('click', () => {
            const isOpen = navEl.getAttribute('data-open') === 'true';
            navEl.setAttribute('data-open', String(!isOpen));
            toggleBtn.setAttribute('aria-expanded', String(!isOpen));
        });
        // Fechar ao clicar num link
        if (menuLinks) menuLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            navEl.removeAttribute('data-open');
            toggleBtn.setAttribute('aria-expanded', 'false');
        }));
        // Fechar com ESC
        window.addEventListener('keydown', (ev) => {
            if (ev.key === 'Escape') {
                navEl.removeAttribute('data-open');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

})();