/* ==========================================================
   Shared site behavior · navigation, reveals, count-ups
   Builds DOM nodes via createElement to avoid innerHTML.
   ========================================================== */

(function () {
  // BU registry — keep in sync with bus/ pages.
  const BUS = [
    { slug: 'dominio',         name: 'Tax Brazil Dominio',       share: '23,5%' },
    { slug: 'legal-br-pro',    name: 'Legal Brazil PRO',         share: '18,5%' },
    { slug: 'corp-br-tax',     name: 'Corp Brazil TAX',          share: '15,7%' },
    { slug: 'bejerman',        name: 'Tax Argentina · Bejerman', share: '9,1%'  },
    { slug: 'corp-br-gtm',     name: 'Corp Brazil GTM',          share: '7,5%'  },
    { slug: 'corp-br-legal',   name: 'Corp Brazil Legal Corp',   share: '7,0%'  },
    { slug: 'onvio',           name: 'Tax Argentina · Onvio',    share: '6,4%'  },
    { slug: 'legal-ar',        name: 'Legal Argentina',          share: '5,4%'  },
    { slug: 'tax-cl',          name: 'Tax Chile',                share: '3,0%'  },
    { slug: 'institucional',   name: 'Institucional',            share: '1,8%'  },
    { slug: 'legal-cl',        name: 'Legal Chile',              share: '1,7%'  },
    { slug: 'highq-ar',        name: 'Legal AR · HighQ KA',      share: '0,2%'  }
  ];

  const isBuPage = window.location.pathname.indexOf('/bus/') !== -1;
  const ASSETS      = isBuPage ? '../assets'           : 'assets';
  const HOME        = isBuPage ? '../index.html'       : 'index.html';
  const DIAGNOSTICO = isBuPage ? '../diagnostico.html' : 'diagnostico.html';
  const BUDGET      = isBuPage ? '../budget.html'      : 'budget.html';
  const TIMELINE    = isBuPage ? '../timeline.html'    : 'timeline.html';
  const GLOSSARY    = isBuPage ? '../glossary.html'    : 'glossary.html';
  const BU_PREFIX = isBuPage ? '' : 'bus/';

  const currentPage = document.body.getAttribute('data-page') || '';
  const currentBu   = document.body.getAttribute('data-bu')   || '';

  // ---------- DOM helper (no innerHTML) ----------
  function h(tag, attrs, children) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        if (k === 'class')        el.className = attrs[k];
        else if (k === 'text')    el.textContent = attrs[k];
        else if (k === 'onClick') el.addEventListener('click', attrs[k]);
        else                      el.setAttribute(k, attrs[k]);
      }
    }
    if (children) {
      (Array.isArray(children) ? children : [children]).forEach(c => {
        if (c == null) return;
        el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
    }
    return el;
  }

  // ---------- Inject top navigation ----------
  function injectNav() {
    const nav = document.getElementById('site-nav');
    if (!nav) return;

    const inner = h('div', { class: 'topnav-inner' }, [
      h('a', { href: HOME, class: 'topnav-brand' }, [
        h('img', { src: ASSETS + '/logo/tr_pri_logo_rgb_color.svg', alt: 'Thomson Reuters' }),
        h('span', { class: 'crumb' }, [ h('strong', { text: 'Paid Media LatAm 2026' }) ])
      ]),
      h('nav', null, [
        h('a', { href: HOME,        class: currentPage === 'home'        ? 'active' : '', text: 'Resumo'      }),
        h('a', { href: DIAGNOSTICO, class: currentPage === 'diagnostico' ? 'active' : '', text: 'Diagnóstico' }),
        h('a', { href: BUDGET,      class: currentPage === 'budget'      ? 'active' : '', text: 'Budget'      }),
        h('a', { href: TIMELINE,    class: currentPage === 'timeline'    ? 'active' : '', text: '90 dias'     }),
        h('a', { href: GLOSSARY,    class: currentPage === 'glossary'    ? 'active' : '', text: 'Glossário'   }),
        buildBuPicker()
      ])
    ]);

    nav.appendChild(inner);
    nav.appendChild(h('div', { class: 'progress-bar', id: 'progress' }));
  }

  function buildBuPicker() {
    const onBu = currentPage === 'bu';
    const currentLabel = onBu
      ? (BUS.find(b => b.slug === currentBu) || {}).name || 'BU'
      : 'Explorar BUs';

    const btn = h('button', { type: 'button', 'aria-haspopup': 'true', 'aria-expanded': 'false', text: currentLabel });

    const menu = h('div', { class: 'bu-menu', role: 'menu' },
      BUS.map(bu =>
        h('a', { href: BU_PREFIX + bu.slug + '.html', class: bu.slug === currentBu ? 'active' : '' }, [
          h('span', { text: bu.name }),
          h('span', { class: 'share', text: bu.share })
        ])
      )
    );

    const picker = h('div', { class: 'bu-picker', id: 'bu-picker' }, [btn, menu]);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      picker.classList.toggle('open');
      btn.setAttribute('aria-expanded', picker.classList.contains('open'));
    });
    document.addEventListener('click', (e) => {
      if (!picker.contains(e.target)) picker.classList.remove('open');
    });

    return picker;
  }

  // ---------- Inject footer ----------
  function injectFooter() {
    const f = document.getElementById('site-footer');
    if (!f) return;

    const text = 'Análise consolidada Jan 1 – 25 Mai 2026. Base YTD: US$ 875,7K · maio: US$ 138,7K. ' +
                 'Classificação de funil por BU conforme oficial do time. Uso interno Thomson Reuters.';

    f.appendChild(h('div', { class: 'page' }, [
      h('div', null, [
        h('h3', { text: 'Paid Media LatAm 2026 YTD · Diagnóstico e plano' }),
        h('p', { text: text }),
        h('div', { class: 'footer-links' }, [
          h('a', { href: HOME,        text: 'Resumo executivo' }),
          h('a', { href: DIAGNOSTICO, text: 'Diagnóstico'      }),
          h('a', { href: BUDGET,      text: 'Budget'           }),
          h('a', { href: TIMELINE,    text: 'Plano 90 dias'    }),
          h('a', { href: GLOSSARY,    text: 'Glossário'        })
        ])
      ]),
      h('img', { src: ASSETS + '/logo/tr_pri_logo_rgb_white.svg', alt: 'Thomson Reuters' })
    ]));
  }

  // ---------- Scroll progress bar ----------
  function bindScrollProgress() {
    const progress = document.getElementById('progress');
    if (!progress) return;
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      progress.style.width = pct + '%';
    }, { passive: true });
  }

  // ---------- Reveal on scroll ----------
  function bindReveals() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }

  // ---------- Treemap tile reveal (staggered) ----------
  function bindTreemap() {
    const tiles = document.querySelectorAll('.treemap-tile');
    if (!tiles.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const idx = parseInt(e.target.dataset.idx || '0', 10);
          setTimeout(() => e.target.classList.add('is-visible'), idx * 60);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    tiles.forEach(el => obs.observe(el));
  }

  // ---------- Count-up ----------
  function animateCount(el) {
    const target = parseFloat(el.dataset.target);
    if (isNaN(target)) return;
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1500;
    const start = performance.now();
    function frame(t) {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals).replace('.', ',');
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = target.toFixed(decimals).replace('.', ',');
    }
    requestAnimationFrame(frame);
  }

  function bindCountups() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCount(e.target);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('.countup').forEach(el => obs.observe(el));
  }

  // ---------- Funnel reveal ----------
  function bindFunnels() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.funnel-compare, .funnel-bar').forEach(el => obs.observe(el));
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectNav();
    injectFooter();
    bindScrollProgress();
    bindReveals();
    bindTreemap();
    bindCountups();
    bindFunnels();
  });
})();
