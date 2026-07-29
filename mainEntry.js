// Entry script for index.html (plain script, no bundler required)
(function () {
  const O = window.Ordinora;
  O.bootstrapSite({
    sceneMode: 'hero',
    onReady: () => {
      O.playHeroIntro();
      O.initAboutAnimation();
      O.initTiltCards('.service-card');
      O.initTiltCards('.why-card');
      O.initTestimonialCarousel();
    }
  });
})();
