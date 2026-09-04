/*
HOW TO ADD A NEW INVESTMENT OPPORTUNITY

1. Copy an existing object.
2. Assign a new, never-reused reference number.
3. Create a unique slug.
4. Update the title, sector, industry, descriptions and other details.
5. Select the relevant opportunity types.
6. Set the status.
7. Save and deploy.

The listing and detail pages update automatically; no new page component is needed.
*/
(function () {
  window.OrdinoraInvestmentOpportunities = [
    {
      id: 'ORD-INV-2026-001',
      slug: 'manufacturing-investment-opportunity-brunei',
      title: 'Manufacturing Investment Opportunity in Brunei Darussalam',
      sector: 'Manufacturing',
      industry: 'Leather Products, Footwear & Apparel',
      location: 'Brunei Darussalam',
      opportunityTypes: ['Strategic Investor', 'Equity Investor', 'Joint Venture Partner', 'Local Business Partner', 'Distribution Partner'],
      status: 'Open',
      featured: true,
      shortDescription: 'A proposed manufacturing venture is exploring opportunities to establish manufacturing operations in Brunei Darussalam and is inviting expressions of interest from suitable investors and strategic business partners.',
      overview: 'The project proposes to establish manufacturing operations in Brunei Darussalam focusing on selected leather products, footwear, apparel and related products.',
      products: ['Leather products', 'Footwear', 'Apparel', 'Related manufactured products'],
      investorProfile: ['Strategic investors', 'Equity investors', 'Joint venture partners', 'Local Brunei business partners', 'Distribution and market partners'],
      investmentRequirement: 'Available to qualified interested parties upon request.',
      confidentialNote: 'Detailed project information, financial information and business proposals will be shared only with qualified interested parties subject to client approval and, where appropriate, confidentiality requirements.',
      publishedDate: '2026-09-04'
    }
  ];
})();