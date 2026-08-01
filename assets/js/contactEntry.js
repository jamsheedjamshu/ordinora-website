// Entry script for consultation form UI (plain script, no backend connection yet)
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
    const clearBtn = document.getElementById('clear-form');
    if (!form) return;

    const showStatus = (message, isError = false) => {
      if (!status) return;
      status.textContent = message;
      status.style.color = isError ? '#ffb3b3' : 'var(--gold-light)';
      status.setAttribute('aria-live', 'polite');
      if (window.gsap) {
        window.gsap.fromTo(status, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35 });
      }
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const requiredFields = ['fullName', 'email', 'phone', 'country', 'service', 'message'];
      const allFilled = requiredFields.every((field) => {
        const input = form.elements.namedItem(field);
        return input && input.value.trim() !== '';
      });

      if (!allFilled) {
        form.reportValidity();
        showStatus('Please complete all required fields before continuing.', true);
        return;
      }

      showStatus('The consultation form is ready to be connected. Please use WhatsApp to continue for now.');
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        form.reset();
        showStatus('The form has been cleared.');
      });
    }
  }
})();
