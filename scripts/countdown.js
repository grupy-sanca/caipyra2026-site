(() => {
    // ===== Contagem regressiva até 04/06/2026 09:00 (America/Sao_Paulo) =====
    // Nota: o horário é aproximado e pode ser ajustado.
    const target = new Date('2026-06-04T09:00:00-03:00');
    const $d = document.getElementById('d');
    const $h = document.getElementById('h');
    const $m = document.getElementById('m');
    const $s = document.getElementById('s');
    const tick = () => {
      const now = new Date();
      let diff = Math.max(0, target - now);
      const days = Math.floor(diff / (1000*60*60*24)); diff -= days*(1000*60*60*24);
      const hours = Math.floor(diff / (1000*60*60)); diff -= hours*(1000*60*60);
      const mins = Math.floor(diff / (1000*60)); diff -= mins*(1000*60);
      const secs = Math.floor(diff / 1000);
      $d.textContent = String(days);
      $h.textContent = String(hours).padStart(2,'0');
      $m.textContent = String(mins).padStart(2,'0');
      $s.textContent = String(secs).padStart(2,'0');
    };
    tick(); setInterval(tick, 1000);
})();