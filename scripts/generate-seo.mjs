import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const domain = 'https://ordinorabs.com';
const insightsSource = fs.readFileSync(path.join(root, 'assets/js/insightsData.js'), 'utf8');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(insightsSource, context);
const articles = context.window.OrdinoraInsights.articles;

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const absolute = (url) => url.startsWith('http') ? url : `${domain}${url}`;
const formatDate = (value) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T00:00:00Z`));
const jsonLd = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

const services = [
  ['company-incorporation', 'Company Registration in Brunei', 'Register a Brunei company with clear guidance on structure, documents, submission and post-incorporation requirements.'],
  ['business-name-registration', 'Business Name Registration in Brunei', 'Register a business name in Brunei with application preparation, document checks and submission support.'],
  ['business-licensing', 'Business Licence Assistance in Brunei', 'Identify and secure the licences and approvals required to operate your business legally in Brunei Darussalam.'],
  ['corporate-secretarial', 'Corporate Secretarial Services in Brunei', 'Maintain statutory registers, resolutions, annual returns and corporate records with professional company secretarial support.'],
  ['accounting-bookkeeping', 'Accounting and Bookkeeping Services in Brunei', 'Keep accurate books, reconciliations and management reports with reliable accounting and bookkeeping support.'],
  ['payroll', 'Payroll Services in Brunei', 'Run accurate monthly payroll, payslips and statutory contribution calculations for local and foreign employees.'],
  ['tax-compliance', 'Corporate Tax Compliance Services in Brunei', 'Prepare corporate tax computations, supporting schedules and submissions with clear, timely compliance support.'],
  ['business-advisory', 'Business Advisory and Consulting Services in Brunei', 'Make informed market-entry, operating-model, structural, expansion and shareholder decisions with practical Brunei-focused advice and implementation support.'],
  ['visa-work-permit', 'Visa and Work Permit Assistance in Brunei', 'Coordinate employment pass, quota and work permit applications and renewals for foreign employees in Brunei.'],
  ['trademark-registration', 'Trademark Registration in Brunei', 'Protect your business name and brand with trademark clearance, filing and application support.']
];

const organization = {
  '@context': 'https://schema.org',
  '@graph': [{
    '@type': ['Organization', 'ProfessionalService'],
    '@id': `${domain}/#organization`,
    name: 'Ordinora Business Services Sdn Bhd',
    url: `${domain}/`,
    logo: `${domain}/assets/images/logo.png`,
    image: `${domain}/assets/images/social-preview.jpg`,
    email: 'info@ordinorabs.com',
    telephone: '+6738199924',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'No. 7, 1st Floor, Bangunan Haji Abd Rahman, Kg Menglait, Gadong',
      postalCode: 'BE3919',
      addressLocality: 'Bandar Seri Begawan',
      addressCountry: 'BN'
    },
    areaServed: { '@type': 'Country', name: 'Brunei Darussalam' },
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00', closes: '17:00'
    }],
    sameAs: [
      'https://www.facebook.com/profile.php?id=61592071780994',
      'https://www.instagram.com/ordinorabusiness/',
      'https://www.linkedin.com/company/143034542/'
    ]
  }, {
    '@type': 'WebSite',
    '@id': `${domain}/#website`,
    url: `${domain}/`,
    name: 'Ordinora Business Services',
    publisher: { '@id': `${domain}/#organization` },
    inLanguage: 'en-BN'
  }]
};

function loader() {
  return `<div class="loader" aria-hidden="true"><svg viewBox="0 0 100 100"><g fill="#ca9731"><rect class="bar" x="30" y="40" width="12" height="45"/><rect class="bar" x="48" y="25" width="12" height="60"/><rect class="bar" x="66" y="10" width="12" height="75"/></g></svg><span>ORDINORA</span></div>`;
}

function header(active = '') {
  const links = [['/', 'Home'], ['/about.html', 'About'], ['/services.html', 'Services'], ['/packages.html', 'Packages'], ['/insights/', 'Insights'], ['/investment-opportunities/', 'Investment Opportunities'], ['/contact.html', 'Contact']];
  const nav = links.map(([href, label]) => `<a href="${href}"${active === label ? ' class="active"' : ''} data-transition>${label}</a>`).join('');
  return `<header class="nav"><div class="container"><a href="/" data-transition class="nav-logo" aria-label="Ordinora home"><img src="/assets/images/logo.png" width="140" height="140" alt="Ordinora Business Services logo"/><span class="nav-brand"><span class="nav-brand-name">Ordinora</span><span class="nav-brand-sub">Business Services Sdn Bhd</span></span></a><nav class="nav-links" aria-label="Primary">${nav}</nav><button class="nav-toggle" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button></div></header><div class="mobile-menu" aria-hidden="true">${nav}</div>`;
}

function footer() {
  const facebook = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3h-3.1V7.3c0-.9.3-1.5 1.7-1.5h1.8V2.9c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.7-4.5 4.7V11H7v3h2.8v8h3.7Z"/></svg>';
  const instagram = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.3A5.7 5.7 0 1 1 6.3 13 5.7 5.7 0 0 1 12 7.3Zm0 2A3.7 3.7 0 1 0 15.7 13 3.7 3.7 0 0 0 12 9.3Z"/></svg>';
  const linkedin = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.94 8.36A1.39 1.39 0 1 1 6.94 5.58a1.39 1.39 0 0 1 0 2.78ZM5.37 9.94h3.14v8.51H5.37zm5.05 0h3.01v1.16h.04c.42-.79 1.45-1.63 2.99-1.63 3.2 0 3.79 2.1 3.79 4.84v4.14h-3.14v-3.88c0-1.05-.02-2.4-1.46-2.4-1.47 0-1.7 1.14-1.7 2.32v3.96h-3.14V9.94Z"/></svg>';
  return `<footer class="footer"><div class="container"><div class="footer-grid"><div class="footer-brand"><img src="/assets/images/logo.png" width="140" height="140" alt="Ordinora Business Services logo"/><p>Corporate services for businesses built to last — incorporation, compliance and advisory under one roof.</p></div><div class="footer-col"><h4>Company</h4><a href="/about.html">About Us</a><a href="/services.html">Services</a><a href="/packages.html">Packages</a><a href="/insights/">Insights</a><a href="/contact.html">Contact</a></div><div class="footer-col"><h4>Services</h4><a href="/services/company-incorporation/">Company Registration</a><a href="/services/corporate-secretarial/">Corporate Secretarial</a><a href="/services/tax-compliance/">Tax Compliance</a></div><div class="footer-col"><h4>Contact</h4><p>Bandar Seri Begawan, Brunei</p><a href="mailto:info@ordinorabs.com">info@ordinorabs.com</a><a href="tel:+6738199924">+673 819 9924</a></div></div><div class="footer-bottom"><span>© 2026 Ordinora Business Services Sdn Bhd. All rights reserved.</span><div class="footer-follow"><span class="footer-follow-title">Follow Us</span><div class="footer-social"><a href="https://www.facebook.com/profile.php?id=61592071780994" target="_blank" rel="noopener" aria-label="Facebook">${facebook}</a><a href="https://www.instagram.com/ordinorabusiness/" target="_blank" rel="noopener" aria-label="Instagram">${instagram}</a><a href="https://www.linkedin.com/company/143034542/" target="_blank" rel="noopener" aria-label="LinkedIn">${linkedin}</a></div></div></div></div></footer>`;
}

function documentTemplate({ title, description, canonical, ogType = 'website', image = '/assets/images/social-preview.jpg', schema, active, body }) {
  return `<!DOCTYPE html>
<html lang="en-BN"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"/><link rel="canonical" href="${canonical}"/>
<meta property="og:type" content="${ogType}"/><meta property="og:site_name" content="Ordinora Business Services Sdn Bhd"/><meta property="og:title" content="${escapeHtml(title)}"/><meta property="og:description" content="${escapeHtml(description)}"/><meta property="og:url" content="${canonical}"/><meta property="og:image" content="${absolute(image)}"/><meta property="og:locale" content="en_BN"/>
<meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${escapeHtml(title)}"/><meta name="twitter:description" content="${escapeHtml(description)}"/><meta name="twitter:image" content="${absolute(image)}"/>
<link rel="icon" href="/assets/images/logo.png" type="image/png"/><link rel="stylesheet" href="/assets/css/style.css?v=20260917"/><link rel="stylesheet" href="/assets/css/responsive.css?v=20260917"/><script type="application/ld+json">${jsonLd(schema)}</script></head><body>${loader()}<div class="page-transition" aria-hidden="true"></div><canvas id="three-canvas" aria-hidden="true"></canvas><div class="page-shell">${header(active)}<main>${body}</main>${footer()}</div><a href="https://wa.me/6738199924" class="whatsapp-fab" aria-label="Chat with us on WhatsApp" target="_blank" rel="noopener"><svg width="26" height="26" viewBox="0 0 24 24" fill="#003333" aria-hidden="true"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5.1-1.3A10 10 0 1012 2zm5.6 14.2c-.2.6-1.4 1.2-2 1.3-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.6-.6-2.9-1.3-4.8-4.2-4.9-4.4-.1-.2-1.2-1.6-1.2-3s.8-2.1 1-2.4c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.6.7 1.9.8 2.1.1.2.1.4 0 .6-.1.2-.1.3-.3.5-.1.2-.3.4-.4.5-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.7-.1.3.1 1.8.9 2.1 1 .3.2.5.2.6.3.1.2.1.9-.1 1.5z"/></svg></a><script src="/assets/vendor/three.min.js"></script><script src="/assets/vendor/gsap.min.js"></script><script src="/assets/vendor/ScrollTrigger.min.js"></script><script src="/assets/vendor/lenis.umd.js"></script><script src="/assets/js/threeScene.js?v=20260917"></script><script src="/assets/js/scroll.js?v=20260917"></script><script src="/assets/js/animations.js?v=20260917"></script><script src="/assets/js/main.js?v=20260917"></script></body></html>`;
}

function articleBody(article) {
  const sections = article.content.map((block, index) => `<section id="article-section-${index}"><h2>${block.heading}</h2>${block.body}</section>`).join('');
  const toc = article.content.map((block, index) => `<li><a href="#article-section-${index}">${escapeHtml(block.heading)}</a></li>`).join('');
  const sources = article.officialSources.length ? `<ul>${article.officialSources.filter((source) => source.url).map((source) => `<li><a href="${source.url}" target="_blank" rel="noopener">${escapeHtml(source.label)}</a></li>`).join('')}</ul>` : '<p>This general educational article does not rely on a specific regulatory source.</p>';
  const related = (article.relatedArticles || []).map((slug) => articles.find((candidate) => candidate.slug === slug)).filter(Boolean).slice(0, 3).map((item) => `<li><a href="/insights/${item.slug}/">${escapeHtml(item.title)}</a></li>`).join('');
  const relatedServices = (article.relatedServices || []).map((service) => {
    const href = service.href.replace(/^\.\.\/services\.html#/, '/services/').replace(/\/$/, '') + '/';
    return `<a href="${href}" class="btn btn-ghost">${escapeHtml(service.label)}</a>`;
  }).join('');
  const image = article.featuredImage && article.featuredImage !== '/assets/images/social-preview.jpg' ? `<figure class="article-featured-image"><img src="${article.featuredImage}" width="1536" height="1024" loading="eager" fetchpriority="high" alt="${escapeHtml(article.imageAlt)}"/></figure>` : '';
  return `<section class="page-hero container"><div class="article-header"><div class="breadcrumb"><a href="/">Home</a> / <a href="/insights/">Insights</a> / <span>${escapeHtml(article.category)}</span></div><p class="eyebrow">${escapeHtml(article.category)}</p><h1>${escapeHtml(article.title)}</h1><p class="article-excerpt">${escapeHtml(article.excerpt)}</p><div class="article-meta"><span>Published: ${formatDate(article.publishedAt)}</span><span>Updated: ${formatDate(article.updatedAt)}</span><span>${escapeHtml(article.readingTime)}</span><span>Author: ${escapeHtml(article.author)}</span></div></div></section><section class="section section--tight"><div class="container article-layout"><aside class="article-toc glass"><p class="eyebrow">On this page</p><ol>${toc}</ol></aside><article class="article-main">${image}<div class="article-content">${sections}</div><div class="article-takeaways glass"><h2>Key Takeaways</h2><ul>${article.takeaways.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div><section class="article-sources"><h2>Official Sources</h2>${sources}</section>${article.disclaimer ? `<p class="article-disclaimer">${escapeHtml(article.disclaimer)}</p>` : ''}<section class="related-articles"><h2>Related Insights</h2><ul>${related}</ul></section>${relatedServices ? `<section><h2>Related Services</h2><div class="hero-actions">${relatedServices}</div></section>` : ''}<div class="service-cta glass"><div><h2>Need help with your business?</h2><p>Talk to Ordinora about accounting, tax, company secretarial and business support in Brunei.</p></div><a href="/contact.html" class="btn btn-primary">Request a Consultation</a></div></article></div></section>`;
}

for (const article of articles) {
  const canonical = `${domain}/insights/${article.slug}/`;
  const schema = { '@context': 'https://schema.org', '@graph': [{ '@type': 'Article', headline: article.title, description: article.excerpt, image: [absolute(article.featuredImage)], datePublished: article.publishedAt, dateModified: article.updatedAt, author: { '@type': 'Organization', name: article.author }, publisher: { '@id': `${domain}/#organization` }, mainEntityOfPage: canonical }, { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${domain}/` }, { '@type': 'ListItem', position: 2, name: 'Insights', item: `${domain}/insights/` }, { '@type': 'ListItem', position: 3, name: article.title, item: canonical }] }] };
  const output = documentTemplate({ title: article.seoTitle, description: article.seoDescription, canonical, ogType: 'article', image: article.featuredImage, schema, active: 'Insights', body: articleBody(article) });
  const directory = path.join(root, 'insights', article.slug);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'index.html'), output);
}

const servicesHtml = fs.readFileSync(path.join(root, 'services.html'), 'utf8');
for (const [slug, title, description] of services) {
  const match = servicesHtml.match(new RegExp(`<article class="service-detail" id="${slug}">([\\s\\S]*?)<\\/article>`));
  if (!match) throw new Error(`Could not find service section: ${slug}`);
  const canonical = `${domain}/services/${slug}/`;
  const schema = { '@context': 'https://schema.org', '@graph': [{ '@type': 'Service', name: title, description, url: canonical, areaServed: { '@type': 'Country', name: 'Brunei Darussalam' }, provider: { '@id': `${domain}/#organization` } }, { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${domain}/` }, { '@type': 'ListItem', position: 2, name: 'Services', item: `${domain}/services.html` }, { '@type': 'ListItem', position: 3, name: title, item: canonical }] }] };
  const body = `<section class="page-hero container"><div><div class="breadcrumb"><a href="/">Home</a> / <a href="/services.html">Services</a> / <span>${escapeHtml(title)}</span></div><p class="eyebrow">Professional Business Support</p><h1>${escapeHtml(title)}</h1><p class="lead" style="margin-top:1.2rem">${escapeHtml(description)}</p></div></section><section class="section section--tight"><div class="container service-content"><article class="service-detail is-active" id="${slug}">${match[1]}</article><div class="service-cta glass"><div><h2>Discuss your requirements</h2><p>Tell us about your business and we will explain the scope, process and next steps.</p></div><a href="/contact.html" class="btn btn-primary">Book a Consultation</a></div></div></section>`;
  const output = documentTemplate({ title: `${title} | Ordinora`, description, canonical, schema, active: 'Services', body });
  const directory = path.join(root, 'services', slug);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'index.html'), output);
}

// Preserve the retired Consulting URL without retaining a duplicate service.
fs.writeFileSync(path.join(root, 'services/business-consulting/index.html'), '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Business Advisory and Consulting | Ordinora</title><meta name="robots" content="noindex"><link rel="canonical" href="https://ordinorabs.com/services/business-advisory/"><meta http-equiv="refresh" content="0;url=/services/business-advisory/"></head><body><a href="/services/business-advisory/">Business Advisory &amp; Consulting</a></body></html>');

const staticUrls = ['/', '/about.html', '/services.html', '/packages.html', '/contact.html', '/insights/', '/investment-opportunities/'];
const urls = [...staticUrls, ...services.map(([slug]) => `/services/${slug}/`), ...articles.map((article) => `/insights/${article.slug}/`)];
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${domain}${url}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(root, 'public', 'sitemap.xml'), sitemap);

const linkTargets = [
  'index.html', 'about.html', 'contact.html', 'packages.html', 'services.html',
  'insights/index.html', 'insights/article.html', 'investment-opportunities/index.html',
  'assets/js/insightsData.js', 'netlify/functions/contact.js'
];
const linkReplacements = new Map([
  ['services.html#company-incorporation', 'services/company-incorporation/'],
  ['services.html#business-licensing', 'services/business-licensing/'],
  ['services.html#corporate-secretarial', 'services/corporate-secretarial/'],
  ['services.html#accounting-bookkeeping', 'services/accounting-bookkeeping/'],
  ['services.html#payroll', 'services/payroll/'],
  ['services.html#tax-compliance', 'services/tax-compliance/'],
  ['services.html#business-advisory', 'services/business-advisory/'],
  ['services.html#visa-work-permit', 'services/visa-work-permit/'],
  ['services.html#trademark-registration', 'services/trademark-registration/'],
  ['services.html#business-consulting', 'services/business-advisory/'],
  ['https://www.linkedin.com/company/143034542/admin/dashboard/', 'https://www.linkedin.com/company/143034542/']
]);
for (const relative of linkTargets) {
  const file = path.join(root, relative);
  let content = fs.readFileSync(file, 'utf8');
  for (const [from, to] of linkReplacements) content = content.replaceAll(from, to);
  fs.writeFileSync(file, content);
}

console.log(`Generated ${articles.length} article pages, ${services.length} service pages and ${urls.length} sitemap URLs.`);
