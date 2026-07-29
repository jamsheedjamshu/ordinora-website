// Entry script for contact.html (plain script, no bundler required)
(function () {
  const O = window.Ordinora;
  O.bootstrapSite({
    sceneMode: 'ambient',
    onReady: () => {
      initContactForm();
    }
  });

  function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const submitBtn = document.getElementById('contact-submit');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      // Front-end only: simulate a submission. Wire this to your backend
      // or a form service (e.g. Formspree) to receive real submissions.
      setTimeout(() => {
        form.reset();
        submitBtn.textContent = originalLabel;
        submitBtn.disabled = false;
        status.style.display = 'block';
        gsap.from(status, { opacity: 0, y: 10, duration: 0.5 });
      }, 900);
    });
  }
})();
