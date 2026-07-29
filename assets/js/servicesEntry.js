// Entry script for services.html (plain script, no bundler required)
(function () {
  const O = window.Ordinora;
  O.bootstrapSite({
    sceneMode: 'ambient',
    onReady: ({ lenis }) => {
      O.initServicesPage(lenis);
    }
  });
})();
