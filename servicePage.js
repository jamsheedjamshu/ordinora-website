// ==========================================================================
// servicePage.js
// Logic specific to services.html: auto-scroll to a service when arriving
// via ?service=slug or #slug (set by the homepage service-card click),
// sticky side-nav active-state tracking, and per-section timeline reveals.
//
// Loaded as a plain script (no bundler required).
// ==========================================================================

(function () {
  const O = window.Ordinora;
  gsap.registerPlugin(ScrollTrigger);

  function initServicesPage(lenis) {
    autoScrollToRequestedService(lenis);
    bindSideNavClicks(lenis);
    trackActiveSection();
    animateServiceDetails();
  }

  function getRequestedSlug() {
    const hash = window.location.hash.replace('#', '');
    if (hash) return hash;
    const params = new URLSearchParams(window.location.search);
    return params.get('service');
  }

  function autoScrollToRequestedService(lenis) {
    const slug = getRequestedSlug();
    if (!slug) return;
    const target = document.getElementById(slug);
    if (!target) return;
    setTimeout(() => O.scrollToTarget(lenis, target, -90), 900);
  }

  function bindSideNavClicks(lenis) {
    document.querySelectorAll('.service-nav-list a').forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href.startsWith('#')) return;
        e.preventDefault();
        const target = document.querySelector(href);
        O.scrollToTarget(lenis, target, -90);
        history.replaceState(null, '', href);
      });
    });
  }

  function trackActiveSection() {
    const sections = document.querySelectorAll('.service-detail');
    const links = document.querySelectorAll('.service-nav-list a');
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActive(section.id),
        onEnterBack: () => setActive(section.id)
      });
    });
    function setActive(id) {
      links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === ('#' + id)));
    }
  }

  function animateServiceDetails() {
    document.querySelectorAll('.service-detail').forEach((section) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 75%' } });
      tl.from(section.querySelector('.service-detail-icon'), { opacity: 0, scale: 0.7, rotate: -10, duration: 0.7, ease: 'back.out(1.7)' })
        .from(section.querySelectorAll('.service-detail-head h2, .service-detail-num'), { opacity: 0, y: 24, duration: 0.7, stagger: 0.1 }, '-=0.4')
        .from(section.querySelectorAll('.benefit-list li'), { opacity: 0, x: -20, duration: 0.5, stagger: 0.08 }, '-=0.3')
        .from(section.querySelectorAll('.process-list li'), { opacity: 0, x: 20, duration: 0.5, stagger: 0.08 }, '-=0.5')
        .from(section.querySelector('.service-cta'), { opacity: 0, y: 20, duration: 0.6 }, '-=0.2');
    });
  }

  window.Ordinora = window.Ordinora || {};
  window.Ordinora.initServicesPage = initServicesPage;
})();
