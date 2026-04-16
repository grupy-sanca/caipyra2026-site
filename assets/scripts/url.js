(() => {
    // ===== Configurações simples =====
    const TICKETS_URL = "https://ingressos.python.org.br/caipyra/2026/"; // TODO: substituir pela URL real da bilheteria
    document.getElementById('cta-tickets').href = TICKETS_URL;
    document.getElementById('link-ingressos').href = TICKETS_URL;

    // Link de patrocínio (temporário e fácil de trocar)
    const SPONSOR_URL = "https://docs.google.com/presentation/d/1o5Wyz15ahUSsMLPCiYwr000VS8-bYbVU9SY8XLNhkfs/edit?pli=1&slide=id.p#slide=id.p"; // TODO: substituir pela URL real do prospecto
    const $sponsor = document.getElementById('link-patrocinio');
    if ($sponsor) $sponsor.href = SPONSOR_URL;

    // Acesso direto a patrocínio via querystring (?patrocinio ou ?sponsor)
    try {
        const q = new URLSearchParams(location.search);
        if (q.has('patrocinio') || q.has('sponsor')) {
        const el = document.getElementById('patrocinio');
        if (el) el.scrollIntoView({behavior:'smooth'});
        }
    } catch (e) {}

})();