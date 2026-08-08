(function () {
  const data = window.OrdinoraInsights;
  const O = window.Ordinora;
  const articles = data.articles;
  const categories = data.categories;
  const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  function formatDate(value) { return dateFormat.format(new Date(value + 'T00:00:00')); }
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
  function articleUrl(article) { return `./${encodeURIComponent(article.slug)}`; }
  function renderImage(article) { return `<div class="insight-image"><img src="${article.featuredImage}" alt="${escapeHtml(article.imageAlt)}" loading="lazy"></div>`; }
  function renderCard(article, featured) {
    return `<article class="insight-card glass reveal-up${featured ? ' insight-card--featured' : ''}">${renderImage(article)}<div class="insight-card-body"><p class="plan-tag">${escapeHtml(article.category)}</p><h3><a href="${articleUrl(article)}" data-transition>${article.title}</a></h3><p>${article.excerpt}</p><div class="insight-meta"><span>${formatDate(article.publishedAt)}</span><span>${article.readingTime}</span></div><a href="${articleUrl(article)}" data-transition class="btn btn-ghost">Read Article</a></div></article>`;
  }
  function renderCards(list, target, emptyText) { target.innerHTML = list.length ? list.map((article) => renderCard(article)).join('') : `<p class="insight-empty">${emptyText}</p>`; }
  function currentCategory() { return new URLSearchParams(window.location.search).get('category') || 'All'; }
  function filterArticles() {
    const query = document.querySelector('#insight-search').value.trim().toLowerCase();
    const category = currentCategory();
    return articles.filter((article) => {
      const matchesCategory = category === 'All' || article.category === category;
      const haystack = [article.title, article.excerpt, article.category, ...article.tags].join(' ').toLowerCase();
      return matchesCategory && (!query || haystack.includes(query));
    });
  }
  function updateUrl(category) { const url = new URL(window.location.href); if (category === 'All') url.searchParams.delete('category'); else url.searchParams.set('category', category); history.replaceState({}, '', url); }
  function render() {
    const filtered = filterArticles();
    const latest = document.querySelector('#latest-articles');
    renderCards(filtered, latest, 'No articles match that search yet. Try another topic.');
    document.querySelectorAll('.category-filter').forEach((button) => button.classList.toggle('is-active', button.dataset.category === currentCategory()));
    if (O && O.initRevealAnimations) O.initRevealAnimations();
  }

  function init() {
    const featured = articles.find((article) => article.featured);
    document.querySelector('#featured-article').innerHTML = renderCard(featured, true);
    const guides = articles.filter((article) => article.category === 'Business Guides' || article.category === 'Company Incorporation' || article.category === 'Tax & Compliance').slice(0, 3);
    renderCards(guides, document.querySelector('#business-guides'), 'Business guides will appear here as they are published.');
    document.querySelector('#category-filters').innerHTML = categories.map((category) => `<button class="category-filter${category === currentCategory() ? ' is-active' : ''}" type="button" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join('');
    document.querySelectorAll('.category-filter').forEach((button) => button.addEventListener('click', () => { updateUrl(button.dataset.category); render(); }));
    document.querySelector('#insight-search').addEventListener('input', render);
    render();
    const params = new URLSearchParams(window.location.search);
    if (params.get('category')) document.querySelector('#latest-articles').scrollIntoView({ block: 'start' });
  }

  O.bootstrapSite({ sceneMode: 'ambient', onReady: init });
})();
