(() => {
  const STYLE_ID = 'caipyra-pretalx-overrides';
  const STYLE_CONTENT = `
    .filter-bar {
      width: 100% !important;
      box-sizing: border-box;
      gap: 8px;
    }

    .filter-bar .filter-controls {
      min-width: 0;
      flex: 1 1 auto;
    }

    .filter-bar .timezone-container {
      margin-left: auto !important;
      padding-right: 8px;
      min-width: 0;
      max-width: 11rem;
      flex: 0 1 auto;
    }

    .filter-bar .timezone-container .timezone-label {
      display: block;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap !important;
      font-size: 12px;
      text-align: right;
    }

    .filter-bar .timezone-container .timezone-select {
      max-width: 100% !important;
      min-width: 0;
    }
  `;

  function applyWidgetOverrides() {
    const widget = document.querySelector('pretalx-schedule');
    if (!widget?.shadowRoot) {
      return false;
    }

    if (widget.shadowRoot.getElementById(STYLE_ID)) {
      return true;
    }

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = STYLE_CONTENT;
    widget.shadowRoot.appendChild(style);

    return true;
  }

  function patchTimezoneLabel() {
    const widget = document.querySelector('pretalx-schedule');
    const label = widget?.shadowRoot?.querySelector('.timezone-label');

    if (!label) {
      return false;
    }

    if (/America\/Sao_Paulo/i.test(label.textContent || '')) {
      label.textContent = 'Horario local (UTC-3)';
      label.title = 'America/Sao_Paulo';
    }

    return true;
  }

  function installWidgetOverrides() {
    if (applyWidgetOverrides() && patchTimezoneLabel()) {
      return;
    }

    let attempts = 0;
    const intervalId = window.setInterval(() => {
      attempts += 1;

      applyWidgetOverrides();

      if (patchTimezoneLabel() || attempts >= 40) {
        window.clearInterval(intervalId);
      }
    }, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installWidgetOverrides, { once: true });
  } else {
    installWidgetOverrides();
  }
})();
