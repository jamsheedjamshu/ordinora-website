(function () {
  const opportunities = window.OrdinoraInvestmentOpportunities || [];
  const app = document.getElementById('investment-app');
  if (!window.OrdinoraSiteConfig?.investmentOpportunitiesEnabled) {
    window.Ordinora.bootstrapSite({ sceneMode: 'ambient', onReady: () => {
      if (app) app.innerHTML = '<section class="page-hero container"><div><p class="eyebrow">Ordinora Business Services</p><h1>Page not found.</h1><p class="lead" style="margin-top:1.2rem;">The page you requested is not available.</p><a href="/" class="btn btn-primary" style="margin-top:1.5rem;">Return Home</a></div></section>';
    } });
    return;
  }
  const statusLabels = { Open: 'Expression of Interest Open', 'Under Discussion': 'Discussions Underway', Closed: 'Expression of Interest Closed' };
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const list = (items) => `<ul class="opportunity-list">${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`;
  const date = (value) => new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const badge = (status) => `<span class="opportunity-status opportunity-status--${status.toLowerCase().replace(' ', '-')}">${esc(statusLabels[status] || status)}</span>`;

  function card(opportunity) {
    const detailUrl = `./${encodeURIComponent(opportunity.slug)}`;
    return `<article class="opportunity-card glass"><div class="opportunity-card-top"><span class="opportunity-reference">${esc(opportunity.id)}</span>${badge(opportunity.status)}</div><h3>${esc(opportunity.title)}</h3><div class="opportunity-meta"><span><strong>Sector</strong>${esc(opportunity.sector)}</span><span><strong>Industry</strong>${esc(opportunity.industry)}</span><span><strong>Location</strong>${esc(opportunity.location)}</span></div><p>${esc(opportunity.shortDescription)}</p><div class="opportunity-types">${opportunity.opportunityTypes.map((type) => `<span>${esc(type)}</span>`).join('')}</div><div class="opportunity-card-bottom"><small>Published ${date(opportunity.publishedDate)}</small>${opportunity.status === 'Closed' ? '' : `<a class="btn btn-primary" href="${detailUrl}">View Investment Opportunity</a>`}</div></article>`;
  }

  function filters() {
    const sectors = [...new Set(opportunities.map((item) => item.sector))];
    const types = [...new Set(opportunities.flatMap((item) => item.opportunityTypes))];
    return `<div class="opportunity-filters glass" aria-label="Filter investment opportunities"><label>Search investment opportunities<input id="opportunity-search" type="search" placeholder="Search investment opportunities" /></label><label>Sector<select id="opportunity-sector"><option value="">All sectors</option>${sectors.map((item) => `<option>${esc(item)}</option>`).join('')}</select></label><label>Opportunity Type<select id="opportunity-type"><option value="">All types</option>${types.map((item) => `<option>${esc(item)}</option>`).join('')}</select></label><label>Status<select id="opportunity-status"><option value="">All statuses</option><option value="Open">Expression of Interest Open</option><option value="Under Discussion">Discussions Underway</option><option value="Closed">Expression of Interest Closed</option></select></label><button class="btn btn-ghost" id="clear-filters" type="button">Clear filters</button></div>`;
  }

  function renderListing() {
    app.innerHTML = `<section class="page-hero container"><div><div class="breadcrumb"><a href="../index.html">Home</a> / <span>Investment Opportunities</span></div><p class="eyebrow">Business Facilitation</p><h1>Investment Opportunities in Brunei Darussalam</h1><p class="lead" style="margin-top:1.2rem;">Explore selected business and investment opportunities facilitated by Ordinora Business Services Sdn Bhd. These opportunities may include businesses seeking strategic investors, equity participation, joint venture partners, local partners or other commercial collaborations.</p></div></section><section class="section section--tight"><div class="container"><div class="opportunity-disclaimer" role="note">Ordinora acts as a business facilitation and introduction service. Publication of an opportunity does not constitute financial advice, investment advice, an offer of securities or a guarantee of investment returns.</div>${filters()}<div id="opportunity-results"></div></div></section><section class="section section--tight"><div class="container"><div class="service-cta glass opportunity-cta"><div><p class="eyebrow">For Project Owners</p><h3>Looking for Investors or Business Partners?</h3><p>Ordinora assists businesses and project owners with the promotion of selected investment opportunities, Expression of Interest campaigns and coordination of introductions with interested parties.</p></div><a href="../contact.html?service=Investor%20%26%20Business%20Partner%20Facilitation" class="btn btn-primary">Promote Your Investment Opportunity</a></div></div></section>`;
    const result = document.getElementById('opportunity-results');
    const render = () => {
      const query = document.getElementById('opportunity-search').value.toLowerCase().trim();
      const sector = document.getElementById('opportunity-sector').value;
      const type = document.getElementById('opportunity-type').value;
      const status = document.getElementById('opportunity-status').value;
      const matches = opportunities.filter((item) => (!query || [item.title, item.sector, item.industry, item.location, item.shortDescription].join(' ').toLowerCase().includes(query)) && (!sector || item.sector === sector) && (!type || item.opportunityTypes.includes(type)) && (!status || item.status === status));
      const featured = matches.filter((item) => item.featured);
      const all = matches.filter((item) => !item.featured);
      result.innerHTML = `${featured.length ? `<section class="opportunity-group"><div class="section-head"><p class="eyebrow">Selected Projects</p><h2>Featured Opportunities</h2></div><div class="opportunity-grid">${featured.map(card).join('')}</div></section>` : ''}<section class="opportunity-group"><div class="section-head"><p class="eyebrow">Browse the register</p><h2>All Investment Opportunities</h2></div>${all.length ? `<div class="opportunity-grid">${all.map(card).join('')}</div>` : featured.length ? '<p class="opportunity-empty">Featured opportunities are shown above.</p>' : '<div class="opportunity-empty glass"><h3>No opportunities match those filters.</h3><p>Try broadening your search or clearing the filters.</p></div>'}</section>`;
    };
    ['opportunity-search', 'opportunity-sector', 'opportunity-type', 'opportunity-status'].forEach((id) => document.getElementById(id).addEventListener('input', render));
    document.getElementById('clear-filters').addEventListener('click', () => { document.querySelectorAll('.opportunity-filters input, .opportunity-filters select').forEach((field) => { field.value = ''; }); render(); });
    render();
  }

  function renderForm(opportunity) {
    return `<section class="section section--tight"><div class="container"><div class="detail-form-grid"><div><p class="eyebrow">Expression of Interest</p><h2>Interested in this Opportunity?</h2><p class="lead">Qualified investors, businesses and strategic partners interested in learning more about this opportunity may submit an Expression of Interest to Ordinora Business Services Sdn Bhd.</p></div><form class="contact-form glass" id="eoi-form" novalidate><input type="hidden" name="opportunityReference" value="${esc(opportunity.id)}"><input type="hidden" name="opportunityTitle" value="${esc(opportunity.title)}"><div class="field"><label for="eoi-name">Full Name *</label><input id="eoi-name" name="fullName" required autocomplete="name"></div><div class="field"><label for="eoi-company">Company / Organisation</label><input id="eoi-company" name="companyName" autocomplete="organization"></div><div class="field"><label for="eoi-position">Position / Designation</label><input id="eoi-position" name="position"></div><div class="field"><label for="eoi-country">Country *</label><input id="eoi-country" name="country" required autocomplete="country-name"></div><div class="field"><label for="eoi-email">Email *</label><input id="eoi-email" type="email" name="email" required autocomplete="email"></div><div class="field"><label for="eoi-phone">Contact Number *</label><input id="eoi-phone" name="phone" required autocomplete="tel"></div><div class="field"><label for="eoi-type">Investor / Partner Type *</label><select id="eoi-type" name="investorType" required><option value="">Select a type</option>${['Individual Investor', 'Corporate Investor', 'Strategic Partner', 'Joint Venture Partner', 'Local Brunei Partner', 'Distributor', 'Other'].map((item) => `<option>${item}</option>`).join('')}</select></div><div class="field"><label for="eoi-capacity">Indicative Investment Capacity</label><input id="eoi-capacity" name="investmentCapacity"></div><div class="field"><label for="eoi-interest">Area of Interest</label><input id="eoi-interest" name="areaOfInterest"></div><div class="field"><label for="eoi-message">Brief Introduction / Message *</label><textarea id="eoi-message" name="message" required></textarea></div><div class="field"><label for="eoi-contact">Preferred Contact Method</label><select id="eoi-contact" name="preferredContactMethod"><option value="">Select a method</option><option>Email</option><option>Phone</option><option>WhatsApp</option></select></div><label class="checkbox-field"><input type="checkbox" name="informationConfirmation"> <span>I confirm that the information provided is accurate and I understand that submission of this Expression of Interest does not create any obligation between me, Ordinora Business Services Sdn Bhd, or the project owner.</span></label><label class="checkbox-field"><input type="checkbox" name="contactConsent" required> <span>I agree to be contacted by Ordinora Business Services Sdn Bhd regarding this investment opportunity. *</span></label><button type="submit" class="btn btn-primary" id="eoi-submit">Submit Expression of Interest</button><p class="form-status" id="eoi-status" role="status" aria-live="polite"></p></form></div></div></section>`;
  }

  function renderDetail(opportunity) {
    document.title = `${opportunity.title} | Ordinora Business Services`;
    document.querySelector('meta[name="description"]').setAttribute('content', opportunity.shortDescription);
    document.querySelector('meta[property="og:title"]').setAttribute('content', document.title);
    document.querySelector('meta[property="og:description"]').setAttribute('content', opportunity.shortDescription);
    document.querySelector('link[rel="canonical"]').setAttribute('href', `https://ordinorabs.com/investment-opportunities/${opportunity.slug}`);
    app.innerHTML = `<section class="page-hero container"><div><div class="breadcrumb"><a href="./">Investment Opportunities</a> / <span>${esc(opportunity.title)}</span></div><p class="eyebrow">${esc(opportunity.id)}</p><h1>${esc(opportunity.title)}</h1><p class="lead" style="margin-top:1.2rem;">${esc(opportunity.shortDescription)}</p><div class="detail-status">${badge(opportunity.status)}</div></div></section><section class="section section--tight"><div class="container opportunity-detail"><div class="detail-facts glass"><div><strong>Reference</strong><span>${esc(opportunity.id)}</span></div><div><strong>Sector</strong><span>${esc(opportunity.sector)}</span></div><div><strong>Industry</strong><span>${esc(opportunity.industry)}</span></div><div><strong>Location</strong><span>${esc(opportunity.location)}</span></div></div><div class="detail-copy"><div><p class="eyebrow">Project Overview</p><h2>About the opportunity</h2><p>${esc(opportunity.overview)}</p></div><div><h3>Products / Business Activities</h3>${list(opportunity.products)}</div><div><h3>Investment / Partnership Opportunity</h3><p>${esc(opportunity.investmentRequirement)}</p></div><div><h3>Opportunity Types</h3>${list(opportunity.opportunityTypes)}</div><div><h3>Preferred Investor / Partner Profile</h3>${list(opportunity.investorProfile)}</div><div><h3>Confidential Information Notice</h3><p>${esc(opportunity.confidentialNote)}</p><p class="detail-note">Additional project information may be made available to qualified interested parties following preliminary review and subject to project owner approval.</p></div><p class="detail-published">Published ${date(opportunity.publishedDate)} · ${esc(statusLabels[opportunity.status])}</p></div></div></section>${renderForm(opportunity)}`;
    initForm(opportunity);
  }

  function initForm(opportunity) {
    const form = document.getElementById('eoi-form');
    if (!form) return;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const button = document.getElementById('eoi-submit');
      const status = document.getElementById('eoi-status');
      button.disabled = true; button.textContent = 'Sending...'; status.textContent = 'Sending your Expression of Interest...';
      const values = Object.fromEntries(new FormData(form).entries());
      values.service = 'Investor & Business Partner Facilitation';
      values.informationConfirmation = form.elements.informationConfirmation.checked ? 'Confirmed' : 'Not confirmed';
      values.contactConsent = form.elements.contactConsent.checked ? 'Agreed' : 'Not agreed';
      values.submissionDate = new Date().toISOString();
      try {
        const response = await fetch('/.netlify/functions/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || 'Unable to send your Expression of Interest right now.');
        form.reset(); status.textContent = 'Thank you for submitting your Expression of Interest. Ordinora Business Services Sdn Bhd will review your submission and may contact you regarding the next stage of the introduction process.';
      } catch (error) { status.textContent = error.message; status.classList.add('is-error'); button.disabled = false; button.textContent = 'Submit Expression of Interest'; }
    });
  }

  const pathParts = window.location.pathname.replace(/\/$/, '').split('/').filter(Boolean);
  const slug = decodeURIComponent(pathParts[pathParts.length - 1] || '');
  const opportunity = opportunities.find((item) => item.slug === slug);
  const isDetailPath = pathParts[0] === 'investment-opportunities' && pathParts.length > 1;
  window.Ordinora.bootstrapSite({ sceneMode: 'ambient', onReady: () => {
    if (opportunity) renderDetail(opportunity);
    else if (isDetailPath) app.innerHTML = '<section class="page-hero container"><div><p class="eyebrow">Investment Opportunities</p><h1>Opportunity not found.</h1><p class="lead" style="margin-top:1.2rem;">This opportunity may have been closed or the link may be incorrect.</p><a href="./" class="btn btn-primary" style="margin-top:1.5rem;">View All Opportunities</a></div></section>';
    else renderListing();
  } });
})();