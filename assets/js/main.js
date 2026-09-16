// ==========================================================================
// main.js
// Shared bootstrap loaded on every page: preloader, navigation behaviour,
// Three.js background, smooth scroll, reveal animations, page transitions.
//
// Loaded as a plain script (no bundler required). Depends on threeScene.js,
// scroll.js and animations.js being loaded first (each attaches to the
// shared window.Ordinora namespace).
// ==========================================================================

(function () {
  const O = window.Ordinora;

  // Shared appearance preference: the existing brand palette is Night mode.
  const themeKey = 'ordinora-theme';
  const root = document.documentElement;
  try { root.dataset.theme = localStorage.getItem(themeKey) === 'day' ? 'day' : 'night'; }
  catch { root.dataset.theme = 'night'; }
  const themeStyle = document.createElement('link');
  themeStyle.rel = 'stylesheet';
  themeStyle.href = '/assets/css/theme.css?v=20260916';
  document.head.appendChild(themeStyle);
  function initThemeToggle() {
    const nav = document.querySelector('header.nav > .container');
    if (!nav || nav.querySelector('.theme-toggle')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    const sun = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>';
    const moon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 13.2A8.5 8.5 0 0 1 10.8 3.5 8.5 8.5 0 1 0 20.5 13.2Z"/></svg>';
    const sync = () => {
      const day = root.dataset.theme === 'day';
      button.innerHTML = day ? moon : sun;
      button.setAttribute('aria-label', day ? 'Switch to Night mode' : 'Switch to Day mode');
      button.title = day ? 'Night mode' : 'Day mode';
      button.setAttribute('aria-pressed', String(day));
    };
    button.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'day' ? 'night' : 'day';
      try { localStorage.setItem(themeKey, root.dataset.theme); } catch { /* Storage is optional. */ }
      sync();
    });
    window.addEventListener('storage', (event) => {
      if (event.key === themeKey) { root.dataset.theme = event.newValue === 'day' ? 'day' : 'night'; sync(); }
    });
    nav.insertBefore(button, nav.querySelector('.nav-toggle'));
    sync();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initThemeToggle);
  else initThemeToggle();

  function bootstrapSite(opts) {
    opts = opts || {};
    const sceneMode = opts.sceneMode || 'ambient';
    const onReady = opts.onReady;

    function start() {
      initLoader(() => {
        const scene = initThree(sceneMode);
        const lenis = O.initSmoothScroll({
          onScroll: (p) => scene && scene.setScrollProgress(p)
        });
        initNav(lenis);
        initMobileMenu(lenis);
        O.initRevealAnimations();
        O.initMagneticButtons();
        initPageTransitions();
        O.revealOnEnter();
        if (onReady) onReady({ scene, lenis });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  }

  function initLoader(done) {
    const loader = document.querySelector('.loader');
    if (!loader) return done();
    const finish = () => {
      loader.style.transition = 'opacity 0.6s ease, visibility 0.6s ease';
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
      done();
    };
    if (document.readyState === 'complete') {
      setTimeout(finish, 500);
    } else {
      window.addEventListener('load', () => setTimeout(finish, 500));
    }
  }

  function initThree(mode) {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return null;
    return new O.ThreeScene(canvas, { mode });
  }

  function initNav(lenis) {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    nav.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          O.scrollToTarget(lenis, target);
        }
      });
    });
  }

  function initMobileMenu(lenis) {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.mobile-menu');
    const nav = document.querySelector('.nav');
    if (!toggle || !menu) return;

    function updateNavHeight() {
      if (!nav) return;
      document.documentElement.style.setProperty('--nav-height', nav.offsetHeight + 'px');
    }

    function setMenuOpen(open) {
      menu.classList.toggle('is-open', open);
      toggle.classList.toggle('is-active', open);
      document.body.classList.toggle('menu-open', open);
      document.documentElement.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (lenis) {
        if (open) lenis.stop();
        else lenis.start();
      }
    }

    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);

    toggle.addEventListener('click', () => {
      setMenuOpen(!menu.classList.contains('is-open'));
    });
    menu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setMenuOpen(false));
    });
  }

  function initPageTransitions() {
    document.querySelectorAll('a[data-transition]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href.startsWith('#') || a.target === '_blank') return;
        e.preventDefault();
        O.playPageTransition(href);
      });
    });
  }

  window.Ordinora = window.Ordinora || {};
  window.Ordinora.bootstrapSite = bootstrapSite;
})();
