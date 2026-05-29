/* ==========================================================
   Shared site behavior · navigation, reveals, count-ups, lang toggle
   Builds DOM nodes via createElement to avoid innerHTML.
   ========================================================== */

(function () {
  // BU registry — keep in sync with bus/ pages. Names per language.
  const BUS = [
    { slug: 'dominio',         pt: 'Tax Brazil Dominio',       es: 'Tax Brazil Dominio',         share: '23,5%' },
    { slug: 'legal-br-pro',    pt: 'Legal Brazil PRO',         es: 'Legal Brazil PRO',           share: '18,5%' },
    { slug: 'corp-br-tax',     pt: 'Corp Brazil TAX',          es: 'Corp Brazil TAX',            share: '15,7%' },
    { slug: 'bejerman',        pt: 'Tax Argentina · Bejerman', es: 'Tax Argentina · Bejerman',   share: '9,1%'  },
    { slug: 'corp-br-gtm',     pt: 'Corp Brazil GTM',          es: 'Corp Brazil GTM',            share: '7,5%'  },
    { slug: 'corp-br-legal',   pt: 'Corp Brazil Legal Corp',   es: 'Corp Brazil Legal Corp',     share: '7,0%'  },
    { slug: 'onvio',           pt: 'Tax Argentina · Onvio',    es: 'Tax Argentina · Onvio',      share: '6,4%'  },
    { slug: 'legal-ar',        pt: 'Legal Argentina',          es: 'Legal Argentina',            share: '5,4%'  },
    { slug: 'tax-cl',          pt: 'Tax Chile',                es: 'Tax Chile',                  share: '3,0%'  },
    { slug: 'institucional',   pt: 'Institucional',            es: 'Institucional',              share: '1,8%'  },
    { slug: 'legal-cl',        pt: 'Legal Chile',              es: 'Legal Chile',                share: '1,7%'  },
    { slug: 'highq-ar',        pt: 'Legal AR · HighQ KA',      es: 'Legal AR · HighQ KA',        share: '0,2%'  }
  ];

  // ---------- Path analysis ----------
  const path = window.location.pathname;
  const isEs = /\/es(\/|$)/.test(path);
  const isBuPage = /\/bus\//.test(path);

  // Within the same language, paths are relative to the current directory
  const PARENT = isBuPage ? '../' : '';
  const HOME        = PARENT + 'index.html';
  const DIAGNOSTICO = PARENT + 'diagnostico.html';
  const BUDGET      = PARENT + 'budget.html';
  const TIMELINE    = PARENT + 'timeline.html';
  const GLOSSARY    = PARENT + 'glossary.html';
  const BU_PREFIX   = isBuPage ? '' : 'bus/';

  // Assets live at the site root, so /es/ adds one more "../"
  const ASSETS = PARENT + (isEs ? '../' : '') + 'assets';

  // ---------- Current language strings ----------
  const t = isEs
    ? {
        resumo: 'Resumen',
        diagnostico: 'Diagnóstico',
        budget: 'Presupuesto',
        '90dias': '90 días',
        glossario: 'Glosario',
        explorarBUs: 'Explorar BUs',
        crumb: 'Paid Media LatAm 2026',
        footerH3: 'Paid Media LatAm 2026 YTD · Diagnóstico y plan',
        footerText: 'Análisis consolidado 1 ene – 25 may 2026. Base YTD: US$ 875,7K · mayo: US$ 138,7K. Clasificación de funnel por BU según definición oficial del equipo. Uso interno Thomson Reuters.',
        linkResumo: 'Resumen ejecutivo',
        linkBudget: 'Presupuesto',
        linkTimeline: 'Plan 90 días',
        linkGlossario: 'Glosario',
        linkDiagnostico: 'Diagnóstico'
      }
    : {
        resumo: 'Resumo',
        diagnostico: 'Diagnóstico',
        budget: 'Budget',
        '90dias': '90 dias',
        glossario: 'Glossário',
        explorarBUs: 'Explorar BUs',
        crumb: 'Paid Media LatAm 2026',
        footerH3: 'Paid Media LatAm 2026 YTD · Diagnóstico e plano',
        footerText: 'Análise consolidada Jan 1 – 25 Mai 2026. Base YTD: US$ 875,7K · maio: US$ 138,7K. Classificação de funil por BU conforme oficial do time. Uso interno Thomson Reuters.',
        linkResumo: 'Resumo executivo',
        linkBudget: 'Budget',
        linkTimeline: 'Plano 90 dias',
        linkGlossario: 'Glossário',
        linkDiagnostico: 'Diagnóstico'
      };

  const currentPage = document.body.getAttribute('data-page') || '';
  const currentBu   = document.body.getAttribute('data-bu')   || '';

  // ---------- Cross-language toggle target ----------
  function buildLangToggleHrefs() {
    // Determine current filename, default to 'index.html' if path ends with '/'
    const segs = path.split('/').filter(s => s.length > 0);
    const last = segs[segs.length - 1] || '';
    const filename = last.endsWith('.html') ? last : 'index.html';

    // Build hrefs going to ES vs PT versions of the current page,
    // computed relative to current path so it works on Vercel and locally.
    let toPt, toEs;
    if (isEs) {
      // We're in /es/... — go to PT by removing the /es/ segment
      // /es/index.html       -> ../index.html
      // /es/bus/dominio.html -> ../../bus/dominio.html
      toPt = (isBuPage ? '../../' : '../') + (isBuPage ? 'bus/' : '') + filename;
      toEs = filename; // current page (no change)
    } else {
      // We're in PT — go to ES by adding /es/ segment
      // /index.html       -> es/index.html
      // /bus/dominio.html -> ../es/bus/dominio.html
      toEs = (isBuPage ? '../es/bus/' : 'es/') + filename;
      toPt = filename; // current page (no change)
    }
    return { toPt, toEs };
  }

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

  // ---------- Build lang toggle ----------
  function buildLangToggle() {
    const { toPt, toEs } = buildLangToggleHrefs();
    return h('div', { class: 'lang-toggle', role: 'group', 'aria-label': 'Language' }, [
      h('a', { href: toPt, class: !isEs ? 'active' : '', text: 'PT' }),
      h('a', { href: toEs, class:  isEs ? 'active' : '', text: 'ES' })
    ]);
  }

  // ---------- Build BU picker ----------
  function buildBuPicker() {
    const onBu = currentPage === 'bu';
    const currentLabel = onBu
      ? (BUS.find(b => b.slug === currentBu) || {})[isEs ? 'es' : 'pt'] || 'BU'
      : t.explorarBUs;

    const btn = h('button', { type: 'button', 'aria-haspopup': 'true', 'aria-expanded': 'false', text: currentLabel });

    const menu = h('div', { class: 'bu-menu', role: 'menu' },
      BUS.map(bu =>
        h('a', { href: BU_PREFIX + bu.slug + '.html', class: bu.slug === currentBu ? 'active' : '' }, [
          h('span', { text: isEs ? bu.es : bu.pt }),
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

  // ---------- Inject top navigation ----------
  function injectNav() {
    const nav = document.getElementById('site-nav');
    if (!nav) return;

    const inner = h('div', { class: 'topnav-inner' }, [
      h('a', { href: HOME, class: 'topnav-brand' }, [
        h('img', { src: ASSETS + '/logo/tr_pri_logo_rgb_color.svg', alt: 'Thomson Reuters' }),
        h('span', { class: 'crumb' }, [ h('strong', { text: t.crumb }) ])
      ]),
      h('nav', null, [
        h('a', { href: HOME,        class: currentPage === 'home'        ? 'active' : '', text: t.resumo      }),
        h('a', { href: DIAGNOSTICO, class: currentPage === 'diagnostico' ? 'active' : '', text: t.diagnostico }),
        h('a', { href: BUDGET,      class: currentPage === 'budget'      ? 'active' : '', text: t.budget      }),
        h('a', { href: TIMELINE,    class: currentPage === 'timeline'    ? 'active' : '', text: t['90dias']   }),
        h('a', { href: GLOSSARY,    class: currentPage === 'glossary'    ? 'active' : '', text: t.glossario   }),
        buildLangToggle(),
        buildBuPicker()
      ])
    ]);

    nav.appendChild(inner);
    nav.appendChild(h('div', { class: 'progress-bar', id: 'progress' }));
  }

  // ---------- Inject footer ----------
  function injectFooter() {
    const f = document.getElementById('site-footer');
    if (!f) return;

    f.appendChild(h('div', { class: 'page' }, [
      h('div', null, [
        h('h3', { text: t.footerH3 }),
        h('p', { text: t.footerText }),
        h('div', { class: 'footer-links' }, [
          h('a', { href: HOME,        text: t.linkResumo       }),
          h('a', { href: DIAGNOSTICO, text: t.linkDiagnostico  }),
          h('a', { href: BUDGET,      text: t.linkBudget       }),
          h('a', { href: TIMELINE,    text: t.linkTimeline     }),
          h('a', { href: GLOSSARY,    text: t.linkGlossario    })
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
      const doc = document.documentElement;
      const pct = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
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
    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
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
