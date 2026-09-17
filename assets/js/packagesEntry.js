// Entry script for packages.html (plain script, no bundler required)
(function () {
  const O = window.Ordinora;
  O.bootstrapSite({
    sceneMode: 'ambient',
    onReady: ({ lenis }) => {
      O.initTiltCards('.pricing-card');
      O.initTiltCards('.why-card');
      const select = document.getElementById('package-jump-select');
      const jump = document.querySelector('.package-jump');
      const header = document.querySelector('header.nav');
      if (!select || !jump) return;
      const updateOffset = () => {
        jump.style.setProperty('--package-nav-top', `${header ? header.getBoundingClientRect().height : 0}px`);
        document.documentElement.style.setProperty('--package-jump-height', `${jump.getBoundingClientRect().height}px`);
      };
      updateOffset();
      if (window.ResizeObserver) {
        const observer = new ResizeObserver(updateOffset);
        if (header) observer.observe(header);
        observer.observe(jump);
      }
      window.addEventListener('resize', updateOffset);
      select.addEventListener('change', () => {
        const target = document.getElementById(select.value);
        if (!target) return;
        const offset = -((header ? header.getBoundingClientRect().height : 0) + jump.getBoundingClientRect().height + 16);
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          if (lenis) lenis.scrollTo(target, { offset, immediate: true });
          else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: 'instant' });
        } else O.scrollToTarget(lenis, target, offset);
        history.replaceState(null, '', `#${target.id}`);
        // Reset so choosing the same package again works after scrolling away.
        select.value = '';
      });
    }
  });
})();
