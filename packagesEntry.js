// Entry script for packages.html (plain script, no bundler required)
(function () {
  const O = window.Ordinora;
  O.bootstrapSite({
    sceneMode: 'ambient',
    onReady: () => {
      O.initTiltCards('.pricing-card');
      O.initTiltCards('.why-card');
    }
  });
})();
