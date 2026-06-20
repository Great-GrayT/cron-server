/**
 * Comprehensive list of company types and organizations
 */

export interface CompanyTypeDefinition {
  type: string;
  keywords: string[];
}

export const companyTypes: CompanyTypeDefinition[] = [
  // Finance - Investment Banks
  {
    type: 'Investment Bank',
    keywords: [
      'goldman sachs', 'morgan stanley', 'jp morgan', 'jpmorgan', 'barclays',
      'citigroup', 'citi', 'ubs', 'credit suisse', 'deutsche bank',
      'bank of america', 'bofa', 'wells fargo', 'hsbc', 'bnp paribas',
      'societe generale', 'lazard', 'evercore', 'moelis', 'rothschild',
      'piper sandler', 'william blair', 'jefferies', 'greenhill',
      'investment bank', 'bulge bracket'
    ]
  },

  // Finance - Asset Managers
  {
    type: 'Asset Manager',
    keywords: [
      'blackrock', 'vanguard', 'fidelity', 'state street', 'capital group',
      'jpmorgan asset', 'pimco', 'invesco', 'amundi', 'axa',
      'prudential', 'northern trust', 'franklin templeton', 'schroders',
      'allianz', 'deutsche asset', 'janus henderson', 'columbia threadneedle',
      'asset manag', 'fund management', 'investment management'
    ]
  },

  // Finance - Hedge Funds
  {
    type: 'Hedge Fund',
    keywords: [
      'hedge fund', 'citadel', 'bridgewater', 'renaissance technologies',
      'millennium', 'two sigma', 'de shaw', 'elliott management',
      'point72', 'baupost', 'viking global', 'maverick', 'tiger global',
      'appaloosa', 'och-ziff', 'pershing square', 'paulson', 'soros'
    ]
  },

  // Finance - Private Equity
  {
    type: 'Private Equity',
    keywords: [
      'private equity', 'kkr', 'blackstone', 'carlyle', 'apollo',
      'tpg capital', 'warburg pincus', 'advent', 'vista equity',
      'thoma bravo', 'silver lake', 'bain capital', 'cvc', 'permira',
      'apax', 'hellman & friedman', 'providence equity', 'general atlantic'
    ]
  },

  // Finance - Venture Capital
  {
    type: 'Venture Capital',
    keywords: [
      'venture capital', 'sequoia', 'andreessen horowitz', 'a16z',
      'accel', 'benchmark', 'greylock', 'kleiner perkins', 'lightspeed',
      'insight partners', 'general catalyst', 'nea', 'bessemer',
      'founders fund', 'thrive capital', 'index ventures', 'khosla ventures',
      'redpoint', 'spark capital', 'felicis', 'cowboy ventures'
    ]
  },

  // Consulting - Management Consulting
  {
    type: 'Management Consulting',
    keywords: [
      'mckinsey', 'bain', 'bcg', 'boston consulting', 'oliver wyman',
      'roland berger', 'booz allen', 'strategy&', 'at kearney', 'l.e.k.',
      'monitor deloitte', 'accenture strategy', 'parthenon', 'analysis group'
    ]
  },

  // Consulting - Big Four
  {
    type: 'Big Four Accounting',
    keywords: [
      'deloitte', 'pwc', 'pricewaterhousecoopers', 'ey', 'ernst & young',
      'kpmg', 'big four', 'big 4'
    ]
  },

  // Technology - Big Tech (FAANG+)
  {
    type: 'Big Tech',
    keywords: [
      'google', 'alphabet', 'meta', 'facebook', 'amazon', 'apple',
      'microsoft', 'netflix', 'tesla', 'nvidia', 'salesforce',
      'oracle', 'adobe', 'intel', 'ibm', 'cisco', 'qualcomm',
      'broadcom', 'amd', 'faang', 'big tech', 'maang'
    ]
  },

  // Technology - Social Media & Consumer Internet
  {
    type: 'Social Media & Consumer Internet',
    keywords: [
      'twitter', 'x corp', 'linkedin', 'snapchat', 'snap inc', 'tiktok',
      'bytedance', 'pinterest', 'reddit', 'discord', 'spotify', 'zoom',
      'airbnb', 'uber', 'lyft', 'doordash', 'instacart', 'shopify'
    ]
  },

  // Technology - Cloud & Enterprise SaaS
  {
    type: 'Cloud & SaaS',
    keywords: [
      'snowflake', 'databricks', 'stripe', 'atlassian', 'servicenow',
      'workday', 'zendesk', 'twilio', 'okta', 'docusign', 'zoom',
      'slack', 'asana', 'notion', 'airtable', 'monday.com',
      'hubspot', 'dropbox', 'box', 'cloudflare', 'fastly'
    ]
  },

  // Technology - Fintech
  {
    type: 'Fintech',
    keywords: [
      'fintech', 'stripe', 'square', 'block', 'paypal', 'venmo',
      'coinbase', 'robinhood', 'plaid', 'chime', 'affirm', 'klarna',
      'revolut', 'wise', 'transferwise', 'sofi', 'nubank', 'monzo',
      'n26', 'checkout.com', 'adyen', 'marqeta'
    ]
  },

  // Technology - Cybersecurity
  {
    type: 'Cybersecurity',
    keywords: [
      'crowdstrike', 'palo alto networks', 'fortinet', 'checkpoint',
      'zscaler', 'okta', 'cloudflare', 'splunk', 'datadog', 'tenable',
      'rapid7', 'qualys', 'sailpoint', 'varonis', 'proofpoint',
      'mimecast', 'cyberark', 'sentinelone'
    ]
  },

  // Technology - AI & Machine Learning
  {
    type: 'AI & Machine Learning',
    keywords: [
      'openai', 'anthropic', 'deepmind', 'scale ai', 'cohere', 'stability ai',
      'hugging face', 'midjourney', 'c3.ai', 'datarobot', 'dataiku',
      'domino data lab', 'h2o.ai'
    ]
  },

  // Healthcare - Pharma & Biotech
  {
    type: 'Pharmaceutical',
    keywords: [
      'pfizer', 'moderna', 'johnson & johnson', 'merck', 'abbvie',
      'bristol myers squibb', 'bms', 'amgen', 'gilead', 'genentech',
      'roche', 'novartis', 'sanofi', 'glaxosmithkline', 'gsk',
      'astrazeneca', 'eli lilly', 'bayer', 'pharmaceutical'
    ]
  },

  {
    type: 'Biotech',
    keywords: [
      'biotech', 'illumina', 'regeneron', 'biogen', 'vertex',
      'alexion', 'bluebird bio', 'crispr therapeutics', 'editas',
      'moderna', 'biontech', 'ionis', 'argenx', 'seagen'
    ]
  },

  // Healthcare - Medical Devices
  {
    type: 'Medical Device',
    keywords: [
      'medtronic', 'boston scientific', 'abbott', 'stryker',
      'edwards lifesciences', 'zimmer biomet', 'intuitive surgical',
      'baxter', 'becton dickinson', 'bd', 'medical device'
    ]
  },

  // Healthcare - Health Insurance
  {
    type: 'Health Insurance',
    keywords: [
      'unitedhealth', 'anthem', 'cigna', 'humana', 'aetna',
      'centene', 'wellpoint', 'kaiser permanente', 'blue cross',
      'health insurance', 'managed care'
    ]
  },

  // Healthcare - Hospital Systems
  {
    type: 'Hospital System',
    keywords: [
      'hca healthcare', 'cleveland clinic', 'mayo clinic', 'johns hopkins',
      'mass general', 'ucla health', 'cedars-sinai', 'hospital system',
      'health system', 'medical center'
    ]
  },

  // Retail & E-commerce
  {
    type: 'Retail & E-commerce',
    keywords: [
      'walmart', 'target', 'costco', 'kroger', 'home depot', 'lowes',
      'best buy', 'macys', 'nordstrom', 'kohls', 'tjx', 'ross',
      'amazon retail', 'wayfair', 'chewy', 'etsy', 'ebay', 'walmart.com'
    ]
  },

  // Consumer Goods
  {
    type: 'Consumer Goods',
    keywords: [
      'procter & gamble', 'p&g', 'unilever', 'nestle', 'pepsico',
      'coca-cola', 'mondelez', 'kraft heinz', 'general mills',
      'kellogg', 'mars', 'hershey', 'colgate-palmolive', 'johnson & johnson'
    ]
  },

  // Automotive
  {
    type: 'Automotive',
    keywords: [
      'tesla', 'ford', 'general motors', 'gm', 'toyota', 'honda',
      'volkswagen', 'bmw', 'mercedes', 'daimler', 'nissan',
      'hyundai', 'kia', 'rivian', 'lucid', 'stellantis', 'chrysler'
    ]
  },

  // Energy & Utilities
  {
    type: 'Energy & Oil/Gas',
    keywords: [
      'exxonmobil', 'chevron', 'shell', 'bp', 'conocophillips',
      'totalenergies', 'schlumberger', 'halliburton', 'baker hughes',
      'occidental', 'energy', 'oil and gas', 'petroleum'
    ]
  },

  {
    type: 'Renewable Energy',
    keywords: [
      'nextera', 'first solar', 'sunrun', 'enphase', 'solaredge',
      'vestas', 'orsted', 'renewable energy', 'solar', 'wind energy'
    ]
  },

  // Real Estate
  {
    type: 'Real Estate',
    keywords: [
      'cbre', 'jones lang lasalle', 'jll', 'cushman & wakefield',
      'colliers', 'blackstone real estate', 'brookfield', 'prologis',
      'simon property', 'boston properties', 'real estate',
      'commercial real estate', 'reit'
    ]
  },

  // Manufacturing & Industrial
  {
    type: 'Manufacturing & Industrial',
    keywords: [
      'general electric', 'ge', 'honeywell', '3m', 'caterpillar',
      'deere', 'emerson', 'parker hannifin', 'eaton', 'rockwell',
      'siemens', 'abb', 'schneider electric', 'manufacturing', 'industrial'
    ]
  },

  // Aerospace & Defense
  {
    type: 'Aerospace & Defense',
    keywords: [
      'boeing', 'lockheed martin', 'northrop grumman', 'raytheon',
      'general dynamics', 'spacex', 'blue origin', 'airbus',
      'aerospace', 'defense contractor'
    ]
  },

  // Media & Entertainment
  {
    type: 'Media & Entertainment',
    keywords: [
      'disney', 'comcast', 'viacomcbs', 'paramount', 'warner bros',
      'discovery', 'nbc universal', 'fox', 'sony pictures',
      'netflix', 'hulu', 'hbo', 'espn', 'media', 'entertainment'
    ]
  },

  // Telecommunications
  {
    type: 'Telecommunications',
    keywords: [
      'verizon', 'at&t', 't-mobile', 'sprint', 'vodafone',
      'orange', 'telefonica', 'deutsche telekom', 'telco',
      'telecommunications', 'wireless'
    ]
  },

  // Education
  {
    type: 'Education & EdTech',
    keywords: [
      'coursera', 'udemy', 'skillsoft', '2u', 'chegg', 'pearson',
      'mcgraw hill', 'edtech', 'education technology', 'university',
      'college', 'school district'
    ]
  },

  // Government & Non-Profit
  {
    type: 'Government',
    keywords: [
      'federal government', 'state government', 'department of',
      'agency', 'public sector', 'municipality', 'government'
    ]
  },

  {
    type: 'Non-Profit',
    keywords: [
      'non-profit', 'nonprofit', 'ngo', 'charity', 'foundation',
      'red cross', 'united way', 'salvation army'
    ]
  },

  // Law Firms
  {
    type: 'Law Firm',
    keywords: [
      'latham & watkins', 'kirkland & ellis', 'baker mckenzie',
      'dechert', 'skadden', 'cleary gottlieb', 'clifford chance',
      'freshfields', 'allen & overy', 'white & case', 'sidley austin',
      'law firm', 'legal services'
    ]
  },

  // Hospitality & Travel
  {
    type: 'Hospitality & Travel',
    keywords: [
      'marriott', 'hilton', 'hyatt', 'intercontinental', 'ihg',
      'accor', 'wyndham', 'booking.com', 'expedia', 'priceline',
      'hospitality', 'hotel', 'travel', 'tourism'
    ]
  },

  // Food & Beverage
  {
    type: 'Restaurant & Food Service',
    keywords: [
      'mcdonalds', 'starbucks', 'chipotle', 'dominos', 'yum brands',
      'taco bell', 'subway', 'panera', 'shake shack', 'restaurant',
      'food service', 'quick service'
    ]
  },

  // Logistics & Transportation
  {
    type: 'Logistics & Transportation',
    keywords: [
      'fedex', 'ups', 'dhl', 'usps', 'maersk', 'c.h. robinson',
      'xpo logistics', 'jb hunt', 'logistics', 'transportation',
      'freight', 'shipping'
    ]
  },

  // Insurance
  {
    type: 'Insurance',
    keywords: [
      'state farm', 'berkshire hathaway', 'progressive', 'allstate',
      'geico', 'travelers', 'liberty mutual', 'chubb', 'aig',
      'metlife', 'prudential', 'insurance', 'property casualty'
    ]
  },

  // Generic/Unknown
  {
    type: 'Startup',
    keywords: ['startup', 'early stage', 'seed stage', 'series a', 'series b']
  },

  {
    type: 'Unknown',
    keywords: []
  }
];
