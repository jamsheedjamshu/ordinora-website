// ==========================================================================
// scroll.js
// Lenis smooth scroll wired into GSAP's ticker + ScrollTrigger, plus the
// shared "reveal" scroll animations used across every page.
//
// Loaded as a plain script (no bundler required). Depends on the global
// Lenis and gsap/ScrollTrigger objects from the vendor <script> tags loaded
// before this file.
// ==========================================================================

(function () {
  gsap.registerPlugin(ScrollTrigger);

  function initSmoothScroll(opts) {
    opts = opts || {};
    const onScroll = opts.onScroll;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration: reducedMotion ? 0.1 : 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: !reducedMotion,
      wheelMultiplier: 1
    });

    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      if (onScroll) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        onScroll(max > 0 ? e.scroll / max : 0);
      }
    });

    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    document.documentElement.classList.add('lenis');

    return lenis;
  }

  function initRevealAnimations(root) {
    root = root || document;

    const ups = root.querySelectorAll('.reveal-up');
    ups.forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        delay: (i % 3) * 0.08,
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    const fades = root.querySelectorAll('.reveal-fade');
    fades.forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });

    const scales = root.querySelectorAll('.reveal-scale');
    scales.forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: 'back.out(1.6)',
        delay: (i % 4) * 0.06,
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });
  }

  function scrollToTarget(lenis, target, offset) {
    offset = offset === undefined ? -80 : offset;
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset, duration: 1.3 });
    else target.scrollIntoView({ behavior: 'smooth' });
  }

  window.Ordinora = window.Ordinora || {};
  window.Ordinora.initSmoothScroll = initSmoothScroll;
  window.Ordinora.initRevealAnimations = initRevealAnimations;
  window.Ordinora.scrollToTarget = scrollToTarget;
})();
