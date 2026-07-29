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
        initMobileMenu();
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
    const onScroll = () => {
      if (window.scrollY > 40) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

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

  function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.mobile-menu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', () => {
      menu.classList.toggle('is-open');
      toggle.classList.toggle('is-active');
    });
    menu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => menu.classList.remove('is-open'));
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
