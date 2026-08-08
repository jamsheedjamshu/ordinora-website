(function () {
  const data = window.OrdinoraInsights;
  const O = window.Ordinora;
  const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const formatDate = (value) => dateFormat.format(new Date(value + 'T00:00:00'));
  const articleUrl = (article) => `./${encodeURIComponent(article.slug)}`;

  function relatedArticles(article) {
    const manuallySelected = (article.relatedArticles || []).map((slug) => data.articles.find((item) => item.slug === slug)).filter(Boolean);
    const sameCategory = data.articles.filter((item) => item.slug !== article.slug && item.category === article.category && !manuallySelected.includes(item));
    const broader = data.articles.filter((item) => item.slug !== article.slug && !manuallySelected.includes(item) && !sameCategory.includes(item));
    return [...manuallySelected, ...sameCategory, ...broader].slice(0, 3);
  }
  function updateMetadata(article) {
    document.title = article.seoTitle;
    document.querySelector('meta[name="description"]').setAttribute('content', article.seoDescription);
    document.querySelector('link[rel="canonical"]').setAttribute('href', `https://ordinorabs.com/insights/${article.slug}`);
    document.querySelector('meta[property="og:title"]').setAttribute('content', article.seoTitle);
    document.querySelector('meta[property="og:description"]').setAttribute('content', article.seoDescription);
    document.querySelector('meta[property="og:url"]').setAttribute('content', `https://ordinorabs.com/insights/${article.slug}`);
    document.querySelector('meta[property="og:image"]').setAttribute('content', `https://ordinorabs.com${article.featuredImage}`);
    const articleSchema = { '@type': 'Article', headline: article.title, description: article.excerpt, image: [`https://ordinorabs.com${article.featuredImage}`], datePublished: article.publishedAt, dateModified: article.updatedAt, author: { '@type': 'Organization', name: article.author }, publisher: { '@type': 'Organization', name: 'Ordinora Business Services Sdn Bhd' }, mainEntityOfPage: `https://ordinorabs.com/insights/${article.slug}` };
    const breadcrumbSchema = { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Insights', item: 'https://ordinorabs.com/insights' }, { '@type': 'ListItem', position: 2, name: article.category, item: `https://ordinorabs.com/insights?category=${encodeURIComponent(article.category)}` }, { '@type': 'ListItem', position: 3, name: article.title, item: `https://ordinorabs.com/insights/${article.slug}` }] };
    const schema = { '@context': 'https://schema.org', '@graph': [articleSchema, breadcrumbSchema] };
    document.querySelector('#article-schema').textContent = JSON.stringify(schema);
  }
  function renderToc(article) {
    const toc = article.content.map((block, index) => `<li><a href="#article-section-${index}">${escapeHtml(block.heading)}</a></li>`).join('');
    document.querySelector('#article-toc').innerHTML = `<p class="eyebrow">On this page</p><ol>${toc}</ol>`;
  }
  function render(article) {
    updateMetadata(article);
    document.querySelector('#article-breadcrumb').textContent = article.category;
    document.querySelector('#article-category').textContent = article.category;
    document.querySelector('#article-title').textContent = article.title;
    document.querySelector('#article-excerpt').textContent = article.excerpt;
    document.querySelector('#article-meta').innerHTML = `<span>Published: ${formatDate(article.publishedAt)}</span><span>Updated: ${formatDate(article.updatedAt)}</span><span>Reading time: ${article.readingTime}</span><span>Author: ${escapeHtml(article.author)}</span>`;
    document.querySelector('#article-image').innerHTML = `<img src="${article.featuredImage}" alt="${escapeHtml(article.imageAlt)}">`;
    document.querySelector('#article-content').innerHTML = article.content.map((block, index) => `<section id="article-section-${index}"><h2>${block.heading}</h2>${block.body}</section>`).join('');
    renderToc(article);
    document.querySelector('#takeaways').innerHTML = `<h2>Key Takeaways</h2><ul>${article.takeaways.map((item) => `<li>${item}</li>`).join('')}</ul>`;
    document.querySelector('#official-sources').innerHTML = `<h2>Official Sources</h2>${article.officialSources.length ? `<ul>${article.officialSources.map((source) => source.url ? `<li><a href="${source.url}" target="_blank" rel="noopener">${escapeHtml(source.label)}</a></li>` : `<li class="source-placeholder">${escapeHtml(source.label)}</li>`).join('')}</ul>` : '<p>No official sources are required for this general educational article.</p>'}`;
    document.querySelector('#article-disclaimer').textContent = article.disclaimer;
    document.querySelector('#related-service').innerHTML = article.relatedServices.map((service) => `<a href="${service.href}" data-transition class="btn btn-ghost">${escapeHtml(service.label)}</a>`).join('');
    document.querySelector('#related-articles').innerHTML = relatedArticles(article).map((item) => `<article class="insight-card glass"><div class="insight-card-body"><p class="plan-tag">${escapeHtml(item.category)}</p><h3><a href="${articleUrl(item)}">${item.title}</a></h3><p>${item.excerpt}</p><a href="${articleUrl(item)}" class="btn btn-ghost">Read Article</a></div></article>`).join('');
    document.querySelector('#article-cta').innerHTML = '<h2>Need help with your business?</h2><p>Ordinora provides practical accounting, tax, company secretarial and business support for companies in Brunei.</p><div class="hero-actions"><a href="../services.html" data-transition class="btn btn-primary">View Our Services</a><a href="../contact.html" data-transition class="btn btn-ghost">Request a Quote</a></div>';
  }
  function init() {
    const slug = new URLSearchParams(window.location.search).get('slug') || data.articles[0].slug;
    const article = data.articles.find((item) => item.slug === slug) || data.articles[0];
    render(article);
    if (O && O.initRevealAnimations) O.initRevealAnimations();
  }
  O.bootstrapSite({ sceneMode: 'ambient', onReady: init });
})();
