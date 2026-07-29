// Entry script for about.html (plain script, no bundler required)
(function () {
  const O = window.Ordinora;
  O.bootstrapSite({
    sceneMode: 'ambient',
    onReady: () => {
      O.initTiltCards('.why-card');
    }
  });
})();
