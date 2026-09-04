/*
HOW TO ADD A NEW INVESTMENT OPPORTUNITY
1. Copy an existing object and assign a new, never-reused reference number.
2. Create a unique slug and update all public-facing details.
3. Keep published: false while waiting for approval.
4. Change published to true only after the client confirms publication.
5. Never assume that receiving opportunity information is permission to publish it.
6. Save and deploy; the listing and detail pages update automatically.
*/
(function () {
  window.OrdinoraInvestmentOpportunities = [{
    id: 'ORD-INV-2026-001',
    slug: 'manufacturing-investment-opportunity-brunei',
    published: false,
    title: 'Manufacturing Investment Opportunity in Brunei Darussalam',
    sector: 'Manufacturing',
    industry: 'Leather Products, Footwear & Apparel',
    location: 'Brunei Darussalam',
    opportunityTypes: ['Strategic Investor', 'Equity Investor', 'Joint Venture Partner', 'Local Business Partner', 'Distribution Partner'],
    status: 'Draft',
    featured: true,
    shortDescription: 'A proposed manufacturing venture is exploring opportunities to establish manufacturing operations in Brunei Darussalam and is inviting expressions of interest from suitable investors and strategic business partners.',
    overview: 'The project proposes to establish manufacturing operations in Brunei Darussalam focusing on selected leather products, footwear, apparel and related products.',
    products: ['Leather products', 'Footwear', 'Apparel', 'Related manufactured products'],
    investorProfile: ['Strategic investors', 'Equity investors', 'Joint venture partners', 'Local Brunei business partners', 'Distribution and market partners'],
    investmentRequirement: 'Available to qualified interested parties upon request.',
    confidentialNote: 'Detailed project information, financial information and business proposals will be shared only with qualified interested parties subject to client approval and, where appropriate, confidentiality requirements.',
    publishedDate: '2026-09-04'
  }];
})();