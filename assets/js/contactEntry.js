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

    const params = new URLSearchParams(window.location.search);
    const requestedService = params.get('service');
    const investmentMode = requestedService === 'Investor & Business Partner Facilitation' || requestedService === 'investor-business-partner-facilitation';
    if (investmentMode) {
      document.querySelectorAll('.investment-fields').forEach((field) => { field.hidden = false; });
      form.querySelector('#contact-form-title').textContent = 'Submit an Investment Opportunity';
      form.querySelector('#company-label').textContent = 'Company / Organisation';
      form.querySelector('#message-label').textContent = 'Brief Non-Confidential Description *';
      form.querySelector('#message').setAttribute('placeholder', 'Share a brief, non-confidential introduction to your proposal.');
    }
    if (requestedService) {
      const serviceField = form.querySelector('#service');
      const matchingOption = [...serviceField.options].find((option) => option.textContent === requestedService || (investmentMode && option.textContent === 'Investor & Business Partner Facilitation'));
      if (matchingOption) serviceField.value = matchingOption.value;
    }
    if (params.get('subject') === 'submit-investment-opportunity') form.querySelector('#contact-form-title').textContent = 'Submit an Investment Opportunity';

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
      const service = form.querySelector('#service')?.value.trim() || '';
      const message = form.querySelector('#message')?.value.trim() || '';
      const consent = form.querySelector('[name="consent"]')?.checked || false;

      if (!fullName || !email || !service || !message || (investmentMode && (!form.querySelector('#country').value.trim() || !form.querySelector('#phone').value.trim() || !consent))) {
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

      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;
      showStatus('Sending your enquiry...');

      try {
        const response = await fetch('/.netlify/functions/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fullName,
            companyName,
            email,
            service,
            message,
            position: form.querySelector('#position')?.value.trim() || '',
            country: form.querySelector('#country')?.value.trim() || '',
            phone: form.querySelector('#phone')?.value.trim() || '',
            opportunityTitle: form.querySelector('#opportunity-title')?.value.trim() || '',
            industrySector: form.querySelector('#industry-sector')?.value.trim() || '',
            opportunityType: form.querySelector('#opportunity-type')?.value.trim() || '',
            supportRequired: form.querySelector('#support-required')?.value || '',
            preferredContactMethod: form.querySelector('#preferred-contact')?.value || '',
            consent: investmentMode && consent ? 'Agreed' : 'Not applicable',
            enquirySubject: params.get('subject') === 'submit-investment-opportunity' ? 'Submit an Investment Opportunity' : 'General Enquiry',
            submissionDate: new Date().toISOString()
          })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || 'Unable to send your enquiry right now. Please try again.');
        }

        form.reset();
        showStatus(investmentMode ? 'Thank you for submitting your investment opportunity enquiry. Ordinora Business Services Sdn Bhd will review the information provided and may contact you to discuss the next steps.' : 'Thank you! Your enquiry has been sent successfully. We will contact you shortly.');
      } catch (error) {
        showStatus(error.message || 'Sorry, there was a problem sending your enquiry. Please try again.', true);
      } finally {
        submitBtn.textContent = originalLabel;
        submitBtn.disabled = false;
      }
    });
  }
})();
