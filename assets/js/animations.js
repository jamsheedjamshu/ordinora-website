// ==========================================================================
// animations.js
// GSAP timelines: hero entrance, About cards, service card hover-tilt,
// testimonial 3D carousel, magnetic buttons, ripple clicks, page transitions.
//
// Loaded as a plain script (no bundler required). Depends on the global
// gsap/ScrollTrigger objects from the vendor <script> tags loaded before
// this file.
// ==========================================================================

(function () {
  gsap.registerPlugin(ScrollTrigger);

  /** Hero entrance: logo reveal → headline fade → actions rise. */
  function playHeroIntro() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero .eyebrow', { opacity: 0, y: 20, duration: 0.8 })
      .from('.hero h1', { opacity: 0, y: 40, duration: 1.1 }, '-=0.5')
      .from('.hero p.lead', { opacity: 0, y: 30, duration: 0.9 }, '-=0.7')
      .from('.hero-actions .btn', { opacity: 0, y: 24, stagger: 0.12, duration: 0.7 }, '-=0.6')
      .from('.hero-scroll-cue', { opacity: 0, duration: 1 }, '-=0.3');
    return tl;
  }

  /** About section: cards rise in 3D, image rotates in. */
  function initAboutAnimation() {
    const visual = document.querySelector('.about-visual');
    if (visual) {
      gsap.from(visual, {
        opacity: 0,
        rotateY: 25,
        x: -60,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: visual, start: 'top 80%' }
      });
    }
    gsap.utils.toArray('.stat-card').forEach((card, i) => {
      gsap.from(card, {
        opacity: 0,
        y: 40,
        rotateX: -20,
        duration: 0.9,
        delay: i * 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 90%' }
      });
    });
  }

  /** Service / why-us cards: subtle 3D tilt that follows the pointer. */
  function initTiltCards(selector) {
    const cards = document.querySelectorAll(selector);
    cards.forEach((card) => {
      let rect;
      const onMove = (e) => {
        rect = rect || card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, { rotateY: x * 10, rotateX: -y * 10, duration: 0.5, ease: 'power2.out' });
      };
      const onLeave = () => {
        rect = null;
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' });
      };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });
  }

  /** Magnetic hover for buttons. */
  function initMagneticButtons() {
    document.querySelectorAll('.btn').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(btn, { x: x * 0.25, y: y * 0.35, duration: 0.4, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      });
      btn.addEventListener('click', (e) => {
        const r = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = (e.clientX - r.left) + 'px';
        ripple.style.top = (e.clientY - r.top) + 'px';
        ripple.style.width = ripple.style.height = Math.max(r.width, r.height) + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
      });
    });
  }

  /** Testimonial carousel: horizontal track with autoplay. */
  function initTestimonialCarousel(trackSelector) {
    const track = document.querySelector(trackSelector || '.testimonial-track');
    if (!track) return;
    const parent = track.parentElement;
    if (!parent) return;

    Array.from(track.children).forEach((card) => {
      card.style.flexShrink = '0';
    });

    const count = track.children.length;
    let index = 0;
    let autoTimer = null;

    const logoStrip = parent.querySelector('.logo-strip');
    const logoItems = logoStrip ? Array.from(logoStrip.children) : [];

    function updateActiveLabel(i) {
      logoItems.forEach(function (item, idx) {
        item.classList.toggle('is-active', idx === i);
      });
    }

    function goTo(i, animate) {
      if (animate === undefined) animate = true;
      index = ((i % count) + count) % count;
      Array.from(track.children).forEach(function (card, idx) {
        card.classList.toggle('is-active', idx === index);
      });
      const card = track.children[index];
      if (!card) return;
      const offset = card.offsetLeft - (parent.clientWidth - card.offsetWidth) / 2;
      gsap.to(track, {
        x: -offset,
        duration: animate ? 0.75 : 0,
        ease: 'power3.inOut',
        overwrite: 'auto'
      });
      updateActiveLabel(index);
    }

    function startAutoplay() {
      stopAutoplay();
      autoTimer = setInterval(function () {
        goTo(index + 1);
      }, 4500);
    }

    function stopAutoplay() {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = null;
    }

    parent.addEventListener('mouseenter', stopAutoplay);
    parent.addEventListener('mouseleave', startAutoplay);

    logoItems.forEach(function (item, i) {
      item.addEventListener('mouseenter', function () {
        stopAutoplay();
        goTo(i);
      });
    });

    function boot() {
      goTo(0, false);
      startAutoplay();
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        requestAnimationFrame(boot);
      });
    } else {
      requestAnimationFrame(boot);
    }

    window.addEventListener('resize', function () {
      goTo(index, false);
    });

    return {
      goTo: goTo,
      next: function () { goTo(index + 1); },
      prev: function () { goTo(index - 1); },
      startAutoplay: startAutoplay,
      stopAutoplay: stopAutoplay
    };
  }

  /** Page transition: gold-tinted ink wipe. */
  function playPageTransition(href) {
    const overlay = document.querySelector('.page-transition');
    if (!overlay) {
      window.location.href = href;
      return;
    }
    const tl = gsap.timeline({
      onComplete: () => { window.location.href = href; }
    });
    overlay.classList.add('active');
    tl.set(overlay, { transformOrigin: 'bottom' })
      .to(overlay, { scaleY: 1, duration: 0.55, ease: 'power4.inOut' })
      .to('.page-shell', { scale: 1.04, opacity: 0.4, duration: 0.55, ease: 'power4.inOut' }, '<');
  }

  /** Reveals content on load after a page transition (fade + slight zoom out). */
  function revealOnEnter() {
    gsap.from('.page-shell', { opacity: 0, scale: 1.04, duration: 0.7, ease: 'power3.out' });
    const overlay = document.querySelector('.page-transition');
    if (overlay) {
      gsap.set(overlay, { transformOrigin: 'top' });
      gsap.to(overlay, {
        scaleY: 0,
        duration: 0.7,
        ease: 'power4.inOut',
        onComplete: () => overlay.classList.remove('active')
      });
    }
  }

  window.Ordinora = window.Ordinora || {};
  window.Ordinora.playHeroIntro = playHeroIntro;
  window.Ordinora.initAboutAnimation = initAboutAnimation;
  window.Ordinora.initTiltCards = initTiltCards;
  window.Ordinora.initMagneticButtons = initMagneticButtons;
  window.Ordinora.initTestimonialCarousel = initTestimonialCarousel;
  window.Ordinora.playPageTransition = playPageTransition;
  window.Ordinora.revealOnEnter = revealOnEnter;
})();
