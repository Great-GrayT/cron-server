export const KNOWN_COMPANIES: Array<{ name: string; patterns: string[] }> = [
  // Big 4 & Consulting
  { name: 'PwC', patterns: ['pwc', 'pricewaterhousecoopers', 'price waterhouse'] },
  { name: 'Deloitte', patterns: ['deloitte'] },
  { name: 'EY', patterns: ['ernst & young', 'ernst and young', ' ey '] },
  { name: 'KPMG', patterns: ['kpmg', 'kmpg'] },
  { name: 'Accenture', patterns: ['accenture'] },
  { name: 'McKinsey', patterns: ['mckinsey'] },
  { name: 'BCG', patterns: ['boston consulting', ' bcg '] },
  { name: 'Oliver Wyman', patterns: ['oliver wyman'] },
  { name: 'Alvarez & Marsal', patterns: ['alvarez', 'marsal'] },
  { name: 'FTI Consulting', patterns: ['fti consulting', 'fticonsulting'] },
  { name: 'Mercer', patterns: ['mercer'] },
  { name: 'Aon', patterns: ['/aon/', 'aon plc', 'aon uk', 'aon.com'] },
  { name: 'WTW', patterns: ['willis towers watson', 'wtw'] },
  { name: 'Marsh', patterns: ['marsh mclennan', 'marsh & mclennan'] },
  // UK Retail & Commercial Banks
  { name: 'Lloyds', patterns: ['lloyds'] },
  { name: 'NatWest', patterns: ['natwest'] },
  { name: 'Santander', patterns: ['santander'] },
  { name: 'Nationwide', patterns: ['nationwide'] },
  { name: 'HSBC', patterns: ['hsbc'] },
  { name: 'Metro Bank', patterns: ['metrobank', 'metro bank'] },
  { name: 'TSB', patterns: ['/tsb/', 'tsb bank', 'tsb.co.uk'] },
  { name: 'Virgin Money', patterns: ['virgin money'] },
  { name: 'Starling', patterns: ['starling bank'] },
  { name: 'Monzo', patterns: ['monzo'] },
  { name: 'Revolut', patterns: ['revolut'] },
  // Global Investment Banks
  { name: 'JPMorgan', patterns: ['jpmorgan', 'jp morgan', 'j.p. morgan', 'jpm ', 'chase bank', 'jpmc'] },
  { name: 'Goldman Sachs', patterns: ['goldmansachs', 'goldman sachs'] },
  { name: 'Morgan Stanley', patterns: ['morgan stanley', 'morganstanley'] },
  { name: 'Barclays', patterns: ['barclay'] },
  { name: 'BNP Paribas', patterns: ['bnp paribas', 'bnpparibas', ' bnp '] },
  { name: 'Citi', patterns: ['citibank', 'citigroup', 'citi.com', '/citi/'] },
  { name: 'Deutsche Bank', patterns: ['deutschebank', 'deutsche bank'] },
  { name: 'Bank of America', patterns: ['bank of america', 'bofa', 'bankofamerica'] },
  { name: 'UBS', patterns: [' ubs ', 'ubs.com', '/ubs/'] },
  { name: 'Nomura', patterns: ['nomura'] },
  { name: 'Macquarie', patterns: ['macquarie'] },
  { name: 'Investec', patterns: ['investec'] },
  { name: 'Societe Generale', patterns: ['societe generale', 'société générale', 'socgen'] },
  { name: 'ING', patterns: [' ing ', 'ing bank', 'ing.com'] },
  { name: 'RBC', patterns: ['royal bank of canada', ' rbc '] },
  { name: 'Wells Fargo', patterns: ['wells fargo'] },
  { name: 'Mizuho', patterns: ['mizuho'] },
  { name: 'MUFG', patterns: ['mufg', 'mitsubishi ufj'] },
  { name: 'Standard Chartered', patterns: ['standard chartered'] },
  { name: 'IPONTIX', patterns: ['ipontix'] },
  // Asset Management
  { name: 'BlackRock', patterns: ['blackrock'] },
  { name: 'Vanguard', patterns: ['vanguard'] },
  { name: 'Fidelity', patterns: ['fidelity'] },
  { name: 'State Street', patterns: ['state street'] },
  { name: 'Northern Trust', patterns: ['northern trust'] },
  { name: 'Schroders', patterns: ['schroders', 'schroder'] },
  { name: 'M&G', patterns: ['m&g', 'm&g investments', 'm and g'] },
  { name: 'Aviva', patterns: ['aviva'] },
  { name: 'Legal & General', patterns: ['legal & general', 'legal and general', 'legalandgeneral'] },
  { name: 'Prudential', patterns: ['prudential'] },
  { name: 'PGIM', patterns: ['pgim'] },
  { name: 'abrdn', patterns: ['abrdn', 'aberdeen asset', 'aberdeenstandard'] },
  { name: 'Invesco', patterns: ['invesco'] },
  { name: 'Jupiter', patterns: ['jupiter asset', 'jupiteram'] },
  { name: 'Amundi', patterns: ['amundi'] },
  { name: 'Franklin Templeton', patterns: ['franklin templeton', 'franklintempleton'] },
  { name: 'T. Rowe Price', patterns: ['t. rowe price', 't rowe price', 'troweprice'] },
  { name: 'Hargreaves Lansdown', patterns: ['hargreaves lansdown', 'hl.co.uk'] },
  { name: "St. James's Place", patterns: ["st. james's place", 'st james place', 'sjp'] },
  // Insurance & Reinsurance
  { name: 'Zurich', patterns: ['zurich insurance', 'zurich.com'] },
  { name: 'Allianz', patterns: ['allianz'] },
  { name: 'AXA', patterns: [' axa ', 'axa insurance', 'axa.co.uk'] },
  { name: 'Swiss Re', patterns: ['swiss re', 'swissre'] },
  { name: 'Munich Re', patterns: ['munich re', 'munichre'] },
  { name: 'RSA', patterns: ['rsa insurance', 'rsa group'] },
  { name: 'Hiscox', patterns: ['hiscox'] },
  { name: 'Beazley', patterns: ['beazley'] },
];

// Ordered longest-first so more specific TLDs match before shorter ones
export const URL_TLD_COUNTRIES: Array<[string, string]> = [
  ['.co.uk', 'United Kingdom'],
  ['.org.uk', 'United Kingdom'],
  ['.gov.uk', 'United Kingdom'],
  ['.uk', 'United Kingdom'],
  ['.de', 'Germany'],
  ['.fr', 'France'],
  ['.nl', 'Netherlands'],
  ['.ch', 'Switzerland'],
  ['.ie', 'Ireland'],
  ['.es', 'Spain'],
  ['.it', 'Italy'],
  ['.se', 'Sweden'],
  ['.no', 'Norway'],
  ['.dk', 'Denmark'],
  ['.fi', 'Finland'],
  ['.be', 'Belgium'],
  ['.at', 'Austria'],
  ['.pl', 'Poland'],
  ['.pt', 'Portugal'],
  ['.lu', 'Luxembourg'],
  ['.sg', 'Singapore'],
  ['.au', 'Australia'],
  ['.nz', 'New Zealand'],
  ['.ca', 'Canada'],
  ['.jp', 'Japan'],
  ['.ae', 'United Arab Emirates'],
  ['.hk', 'Hong Kong'],
  ['.za', 'South Africa'],
  ['.in', 'India'],
];

/**
 * Returns the country name for a URL by matching its hostname TLD.
 * Uses the actual URL hostname (not the full URL string) to avoid false positives.
 */
export function getCountryFromUrlTLD(url: string): string | null {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    for (const [tld, country] of URL_TLD_COUNTRIES) {
      if (hostname.endsWith(tld)) return country;
    }
  } catch {
    // Invalid URL — skip
  }
  return null;
}

/**
 * Finds a company name by matching the job URL and optional title against KNOWN_COMPANIES patterns.
 */
export function getCompanyFromUrl(url: string, title?: string): string | null {
  const searchText = (url + (title ? ' ' + title : '')).toLowerCase();
  for (const { name, patterns } of KNOWN_COMPANIES) {
    if (patterns.some(p => searchText.includes(p))) return name;
  }
  return null;
}

/**
 * Returns current time as an ISO string. Use when pubDate is missing or in the future.
 */
export function currentUKTime(): string {
  return new Date().toISOString();
}

/**
 * Validates a pubDate string. Returns the date itself if valid and not in the future,
 * otherwise returns the current time ISO string.
 */
export function resolvePostedDate(pubDate: string | undefined | null): string {
  if (!pubDate) return new Date().toISOString();
  const parsed = new Date(pubDate);
  if (isNaN(parsed.getTime()) || parsed > new Date()) return new Date().toISOString();
  return pubDate;
}
