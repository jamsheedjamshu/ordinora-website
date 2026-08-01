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

    const showStatus = (message, isError = false) => {
      if (!status) return;
      status.textContent = message;
      status.style.display = 'block';
      status.style.color = isError ? '#ffb3b3' : 'var(--gold-light)';
      status.setAttribute('aria-live', 'polite');
      if (window.gsap) {
        window.gsap.fromTo(status, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 });
      }
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullName = form.querySelector('#name')?.value.trim() || '';
      const companyName = form.querySelector('#company')?.value.trim() || '';
      const email = form.querySelector('#email')?.value.trim() || '';
      const phone = form.querySelector('#phone')?.value.trim() || '';
      const service = form.querySelector('#service')?.value.trim() || '';
      const message = form.querySelector('#message')?.value.trim() || '';

      if (!fullName || !email || !phone || !service || !message) {
        showStatus('Please complete all required fields before sending your enquiry.', true);
        form.reportValidity();
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showStatus('Please enter a valid email address.', true);
        form.querySelector('#email')?.focus();
        return;
      }

      const messageBody = [
        'Hello Ordinora Business Services,',
        '',
        'I would like to enquire about your services.',
        '',
        '━━━━━━━━━━━━━━━━━━',
        '',
        'Name:',
        fullName,
        '',
        'Email:',
        email,
        '',
        'Phone:',
        phone,
        '',
        'Service:',
        service,
        '',
        'Message:',
        message,
        '',
        '━━━━━━━━━━━━━━━━━━',
        '',
        'Sent from:',
        'www.ordinorabs.com'
      ].join('\n');

      const whatsappUrl = 'https://wa.me/6738199924?text=' + encodeURIComponent(messageBody);
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'Opening WhatsApp…';
      submitBtn.disabled = true;
      showStatus('Preparing your WhatsApp enquiry...');

      try {
        const opened = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        if (!opened) {
          window.location.href = whatsappUrl;
        }
        form.reset();
        showStatus('Your enquiry is ready to send in WhatsApp.');
      } catch (error) {
        window.location.href = whatsappUrl;
      } finally {
        submitBtn.textContent = originalLabel;
        submitBtn.disabled = false;
      }
    });
  }
})();
