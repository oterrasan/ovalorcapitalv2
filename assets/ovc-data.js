/* OVC - dados reais (home) */
(function () {
  function fmtBRL(n) {
    try {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
    } catch (e) {
      return 'R$ ' + (Math.round(n * 100) / 100).toFixed(2).replace('.', ',');
    }
  }

  async function initImpostometro() {
    const el = document.getElementById('impostometro');
    if (!el) return;
    // fallback visual: nunca mostrar 0,00 se a API falhar
    if (!el.textContent || /0,00/.test(el.textContent)) el.textContent = 'R$ —';
    try {
      const r = await fetch('/api/impostometro', { cache: 'no-store' });
      if (!r.ok) { el.textContent = 'R$ —'; return; }
      const data = await r.json();
      if (data && data.formatted) el.textContent = data.formatted;
    } catch (_) {}
  }

  async function initPTAX() {
    const items = Array.from(document.querySelectorAll('.ticker-item'));
    if (!items.length) return;

    const labelToCode = (label) => {
      const l = (label || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (l.includes('dolar')) return 'USD';
      if (l.includes('euro')) return 'EUR';
      return null;
    };

    const targets = items
      .map((it) => {
        const lab = it.querySelector('.ticker-label')?.textContent?.trim();
        const code = labelToCode(lab);
        return code ? { it, code } : null;
      })
      .filter(Boolean);

    if (!targets.length) return;

    try {
      const codes = Array.from(new Set(targets.map((t) => t.code))).join(',');
      const r = await fetch('/api/ptax?codes=' + encodeURIComponent(codes), { cache: 'no-store' });
      if (!r.ok) { el.textContent = 'R$ —'; return; }
      const data = await r.json();
      targets.forEach(({ it, code }) => {
        const v = data?.rates?.[code]?.sell;
        if (typeof v !== 'number') return;
        const valueEl = it.querySelector('.ticker-value');
        if (valueEl) valueEl.textContent = fmtBRL(v);
        const ch = data?.rates?.[code]?.pctChange;
        const chEl = it.querySelector('.ticker-change');
        if (chEl && typeof ch === 'number') {
          const sign = ch >= 0 ? '+' : '';
          chEl.textContent = `${sign}${ch.toFixed(2).replace('.', ',')}%`;
          chEl.className = 'ticker-change ' + (ch >= 0 ? 'up' : 'down');
        }
      });
    } catch (_) {}
  }

  function initTradingViewTape() {
    const wrap = document.getElementById('tv-tape');
    if (!wrap) return;
    // Do not double-inject.
    if (wrap.dataset.loaded === '1') return;
    wrap.dataset.loaded = '1';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;

    const config = {
      symbols: [
        { proName: "BMFBOVESPA:IBOV", title: "IBOV" },
        { proName: "SP:SPX", title: "S&P 500" },
        { proName: "NASDAQ:NDX", title: "NASDAQ 100" },
        { proName: "FX_IDC:USDBRL", title: "USD/BRL" },
        { proName: "FX_IDC:EURBRL", title: "EUR/BRL" },
        { proName: "BITSTAMP:BTCUSD", title: "BTC" },
        { proName: "TVC:GOLD", title: "OURO" }
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "br"
    };

    script.textContent = JSON.stringify(config);
    wrap.appendChild(script);
    document.body.classList.add('has-tv-tape');
  }

  function boot() {
    initTradingViewTape();
    initImpostometro();
    initPTAX();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
