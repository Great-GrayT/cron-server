/**
 * Industry taxonomy — 150 sub-industries across 16 top-level sectors.
 * Mirrors the benchmark in src/analysis/newIndust.md.
 *
 * `industry` is the value emitted by JobMetadataExtractor.extractIndustry.
 * `sector` is retained as metadata for future grouping / rollups.
 *
 * Scoring (see extractIndustry): `strong` keywords are highly specific and
 * rarely false-positive (weight 5); `keywords` are supporting signals (weight 2).
 * Generic ROLE words ("engineer", "manager", "analyst", "sales", "operations")
 * are deliberately excluded — they describe a job function, not an employer's
 * industry, and were the root cause of the old finance/tech over-fit. Only
 * discipline-qualified compounds ("mechanical engineering", "civil engineering")
 * are used, so engineering resolves to its true sector instead of "Technology".
 */
export interface IndustryDefinition {
  /** Emitted value — one of the 150 sub-industries. */
  industry: string;
  /** Parent sector (metadata only). */
  sector: string;
  /** Highly specific signals, weight 5. */
  strong: string[];
  /** Supporting signals, weight 2. */
  keywords: string[];
}

export const industries: IndustryDefinition[] = [
  // ── Agriculture, Forestry & Fishing ────────────────────────────────
  { industry: 'Crop farming', sector: 'Agriculture, Forestry & Fishing', strong: ['crop farming', 'arable farming'], keywords: ['agronomy', 'harvest', 'agricultural', 'crops'] },
  { industry: 'Livestock & animal husbandry', sector: 'Agriculture, Forestry & Fishing', strong: ['animal husbandry', 'livestock'], keywords: ['cattle', 'ranch', 'herd', 'grazing'] },
  { industry: 'Dairy farming', sector: 'Agriculture, Forestry & Fishing', strong: ['dairy farming'], keywords: ['dairy herd', 'milking', 'dairy'] },
  { industry: 'Poultry farming', sector: 'Agriculture, Forestry & Fishing', strong: ['poultry farming'], keywords: ['broiler', 'hatchery', 'egg production', 'poultry'] },
  { industry: 'Aquaculture & fish farming', sector: 'Agriculture, Forestry & Fishing', strong: ['aquaculture', 'fish farming'], keywords: ['shellfish', 'salmon farming'] },
  { industry: 'Commercial fishing', sector: 'Agriculture, Forestry & Fishing', strong: ['commercial fishing', 'fisheries'], keywords: ['trawler', 'fishing vessel', 'fishery'] },
  { industry: 'Forestry & logging', sector: 'Agriculture, Forestry & Fishing', strong: ['forestry', 'logging'], keywords: ['silviculture', 'timber harvesting', 'sawlog'] },
  { industry: 'Horticulture & nurseries', sector: 'Agriculture, Forestry & Fishing', strong: ['horticulture'], keywords: ['greenhouse', 'ornamental', 'plant nursery', 'grower'] },
  { industry: 'Agricultural support services', sector: 'Agriculture, Forestry & Fishing', strong: ['agricultural services', 'agronomist'], keywords: ['crop spraying', 'farm services', 'agri services'] },

  // ── Mining & Extraction ────────────────────────────────────────────
  { industry: 'Coal mining', sector: 'Mining & Extraction', strong: ['coal mining'], keywords: ['colliery', 'coal seam'] },
  { industry: 'Crude oil extraction', sector: 'Mining & Extraction', strong: ['crude oil', 'oil extraction', 'oilfield'], keywords: ['upstream oil', 'drilling rig', 'wellsite'] },
  { industry: 'Natural gas extraction', sector: 'Mining & Extraction', strong: ['gas extraction', 'shale gas'], keywords: ['gas field', 'lng extraction'] },
  { industry: 'Metal ore mining', sector: 'Mining & Extraction', strong: ['ore mining', 'iron ore', 'copper mining'], keywords: ['mineral extraction', 'mining operations', 'ore body'] },
  { industry: 'Precious metals mining', sector: 'Mining & Extraction', strong: ['gold mining', 'silver mining', 'precious metals'], keywords: ['bullion', 'gold mine'] },
  { industry: 'Quarrying', sector: 'Mining & Extraction', strong: ['quarrying', 'quarry'], keywords: ['aggregates', 'gravel pit', 'sand and gravel'] },
  { industry: 'Diamond & gemstone mining', sector: 'Mining & Extraction', strong: ['diamond mining', 'gemstone'], keywords: ['gem mining'] },
  { industry: 'Rare earth & critical minerals mining', sector: 'Mining & Extraction', strong: ['rare earth', 'critical minerals'], keywords: ['lithium mining', 'cobalt mining'] },

  // ── Energy & Utilities ─────────────────────────────────────────────
  { industry: 'Oil refining', sector: 'Energy & Utilities', strong: ['oil refining', 'refinery'], keywords: ['petroleum refining', 'downstream oil'] },
  { industry: 'Electric power generation', sector: 'Energy & Utilities', strong: ['power generation', 'power plant', 'power station'], keywords: ['electricity generation', 'grid operator'] },
  { industry: 'Renewable energy', sector: 'Energy & Utilities', strong: ['renewable energy', 'wind farm', 'solar farm'], keywords: ['photovoltaic', 'wind turbine', 'clean energy', 'offshore wind'] },
  { industry: 'Nuclear power', sector: 'Energy & Utilities', strong: ['nuclear power', 'nuclear plant'], keywords: ['reactor', 'nuclear energy', 'decommissioning nuclear'] },
  { industry: 'Hydroelectric power', sector: 'Energy & Utilities', strong: ['hydroelectric', 'hydropower'], keywords: ['hydro plant'] },
  { industry: 'Natural gas distribution', sector: 'Energy & Utilities', strong: ['gas distribution', 'gas network'], keywords: ['gas utility', 'gas supply'] },
  { industry: 'Water supply & treatment', sector: 'Energy & Utilities', strong: ['water treatment', 'water utility'], keywords: ['potable water', 'water supply', 'water works'] },
  { industry: 'Wastewater & sewage management', sector: 'Energy & Utilities', strong: ['wastewater', 'sewage'], keywords: ['sewerage', 'effluent treatment'] },
  { industry: 'Waste collection & recycling', sector: 'Energy & Utilities', strong: ['waste management', 'recycling'], keywords: ['refuse collection', 'waste collection', 'material recovery'] },

  // ── Manufacturing ──────────────────────────────────────────────────
  { industry: 'Food processing', sector: 'Manufacturing', strong: ['food processing', 'food manufacturing'], keywords: ['food production', 'meat processing', 'fmcg food'] },
  { industry: 'Beverage manufacturing', sector: 'Manufacturing', strong: ['beverage manufacturing', 'brewery', 'distillery'], keywords: ['bottling', 'soft drinks', 'winery'] },
  { industry: 'Tobacco products', sector: 'Manufacturing', strong: ['tobacco'], keywords: ['cigarette manufacturing'] },
  { industry: 'Textile manufacturing', sector: 'Manufacturing', strong: ['textile manufacturing', 'textiles'], keywords: ['weaving', 'spinning mill', 'fabric production'] },
  { industry: 'Apparel & clothing manufacturing', sector: 'Manufacturing', strong: ['apparel manufacturing', 'garment'], keywords: ['clothing manufacturing', 'sewing'] },
  { industry: 'Footwear manufacturing', sector: 'Manufacturing', strong: ['footwear'], keywords: ['shoe manufacturing'] },
  { industry: 'Leather goods', sector: 'Manufacturing', strong: ['leather goods', 'tannery'], keywords: ['leather manufacturing'] },
  { industry: 'Wood & timber products', sector: 'Manufacturing', strong: ['timber products', 'sawmill'], keywords: ['wood products', 'joinery manufacturing'] },
  { industry: 'Paper & pulp manufacturing', sector: 'Manufacturing', strong: ['paper mill', 'pulp'], keywords: ['paper manufacturing', 'packaging paper'] },
  { industry: 'Printing & physical publishing', sector: 'Manufacturing', strong: ['commercial printing', 'print production'], keywords: ['lithography', 'printing press'] },
  { industry: 'Petrochemicals', sector: 'Manufacturing', strong: ['petrochemical', 'petrochemicals'], keywords: ['olefins', 'polymers plant'] },
  { industry: 'Industrial chemicals', sector: 'Manufacturing', strong: ['industrial chemicals', 'chemical manufacturing'], keywords: ['specialty chemicals', 'chemical plant', 'chemical engineering'] },
  { industry: 'Fertilizers & agrochemicals', sector: 'Manufacturing', strong: ['fertilizer', 'agrochemical'], keywords: ['crop protection', 'fertiliser'] },
  { industry: 'Paints & coatings', sector: 'Manufacturing', strong: ['paints', 'coatings'], keywords: ['paint manufacturing', 'industrial coatings'] },
  { industry: 'Pharmaceuticals manufacturing', sector: 'Manufacturing', strong: ['pharmaceutical manufacturing', 'drug manufacturing'], keywords: ['pharma production', 'gmp manufacturing', 'pharmaceutical'] },
  { industry: 'Cosmetics & personal care products', sector: 'Manufacturing', strong: ['cosmetics', 'personal care products'], keywords: ['skincare manufacturing', 'toiletries'] },
  { industry: 'Plastics & rubber products', sector: 'Manufacturing', strong: ['plastics manufacturing', 'rubber products'], keywords: ['injection moulding', 'polymer products'] },
  { industry: 'Glass manufacturing', sector: 'Manufacturing', strong: ['glass manufacturing'], keywords: ['glassware', 'float glass'] },
  { industry: 'Cement & concrete', sector: 'Manufacturing', strong: ['cement', 'ready-mix'], keywords: ['precast concrete', 'concrete manufacturing'] },
  { industry: 'Ceramics', sector: 'Manufacturing', strong: ['ceramics'], keywords: ['pottery', 'tile manufacturing'] },
  { industry: 'Iron & steel production', sector: 'Manufacturing', strong: ['steel production', 'steelworks', 'iron and steel'], keywords: ['foundry', 'smelting', 'steel mill'] },
  { industry: 'Aluminum & non-ferrous metals', sector: 'Manufacturing', strong: ['aluminium', 'non-ferrous'], keywords: ['smelter', 'aluminum'] },
  { industry: 'Metal fabrication', sector: 'Manufacturing', strong: ['metal fabrication', 'sheet metal'], keywords: ['welding fabrication', 'fabrication shop'] },
  { industry: 'Machinery & equipment manufacturing', sector: 'Manufacturing', strong: ['machinery manufacturing', 'equipment manufacturing', 'mechanical engineering'], keywords: ['industrial machinery', 'capital equipment', 'plant machinery'] },
  { industry: 'Industrial tools', sector: 'Manufacturing', strong: ['tooling', 'toolmaking'], keywords: ['cutting tools', 'industrial tools'] },
  { industry: 'Electrical equipment manufacturing', sector: 'Manufacturing', strong: ['electrical equipment', 'switchgear'], keywords: ['transformers', 'electrical engineering'] },
  { industry: 'Semiconductor manufacturing', sector: 'Manufacturing', strong: ['semiconductor manufacturing', 'wafer fab'], keywords: ['chip manufacturing', 'cleanroom fab'] },
  { industry: 'Consumer electronics', sector: 'Manufacturing', strong: ['consumer electronics'], keywords: ['electronics manufacturing', 'home appliances'] },
  { industry: 'Computer hardware manufacturing', sector: 'Manufacturing', strong: ['computer hardware', 'hardware manufacturing'], keywords: ['pcb assembly', 'device manufacturing'] },
  { industry: 'Automotive manufacturing', sector: 'Manufacturing', strong: ['automotive manufacturing', 'car manufacturing', 'vehicle manufacturing'], keywords: ['oem automotive', 'automotive plant', 'automotive'] },
  { industry: 'Auto parts & components', sector: 'Manufacturing', strong: ['auto parts', 'automotive components'], keywords: ['tier 1 supplier', 'powertrain components'] },
  { industry: 'Aerospace manufacturing', sector: 'Manufacturing', strong: ['aerospace', 'aircraft manufacturing', 'aerospace engineering'], keywords: ['avionics', 'aircraft components'] },
  { industry: 'Shipbuilding', sector: 'Manufacturing', strong: ['shipbuilding', 'shipyard'], keywords: ['marine engineering', 'naval construction'] },
  { industry: 'Rail equipment manufacturing', sector: 'Manufacturing', strong: ['rolling stock', 'rail equipment'], keywords: ['locomotive manufacturing', 'railway vehicles'] },
  { industry: 'Motorcycle & bicycle manufacturing', sector: 'Manufacturing', strong: ['motorcycle manufacturing', 'bicycle manufacturing'], keywords: ['two-wheeler'] },
  { industry: 'Furniture manufacturing', sector: 'Manufacturing', strong: ['furniture manufacturing'], keywords: ['cabinetry', 'upholstery'] },
  { industry: 'Toys & sporting goods', sector: 'Manufacturing', strong: ['toy manufacturing', 'sporting goods'], keywords: ['sports equipment', 'toys'] },
  { industry: 'Jewelry manufacturing', sector: 'Manufacturing', strong: ['jewellery', 'jewelry', 'watchmaking'], keywords: ['goldsmith'] },
  { industry: 'Medical devices manufacturing', sector: 'Manufacturing', strong: ['medical devices', 'medical device', 'medtech'], keywords: ['diagnostic equipment', 'device manufacturing medical'] },
  { industry: 'Defense & weapons manufacturing', sector: 'Manufacturing', strong: ['defense manufacturing', 'defence manufacturing', 'munitions'], keywords: ['armament', 'defense contractor', 'weapons systems'] },

  // ── Construction & Real Estate ─────────────────────────────────────
  { industry: 'Residential construction', sector: 'Construction & Real Estate', strong: ['residential construction', 'housebuilding'], keywords: ['home building', 'residential developer'] },
  { industry: 'Commercial construction', sector: 'Construction & Real Estate', strong: ['commercial construction'], keywords: ['commercial building', 'fit-out'] },
  { industry: 'Industrial construction', sector: 'Construction & Real Estate', strong: ['industrial construction'], keywords: ['plant construction', 'industrial build'] },
  { industry: 'Civil engineering & infrastructure', sector: 'Construction & Real Estate', strong: ['civil engineering', 'structural engineering'], keywords: ['infrastructure', 'groundworks', 'civils'] },
  { industry: 'Road & highway construction', sector: 'Construction & Real Estate', strong: ['highway construction', 'road construction'], keywords: ['highways', 'asphalt paving'] },
  { industry: 'Specialty trade contracting', sector: 'Construction & Real Estate', strong: ['trade contractor', 'electrical contracting'], keywords: ['hvac installation', 'plumber', 'electrician'] },
  { industry: 'Building materials supply', sector: 'Construction & Real Estate', strong: ['building materials', 'builders merchant'], keywords: ['construction supplies'] },
  { industry: 'Architecture services', sector: 'Construction & Real Estate', strong: ['architecture', 'architectural'], keywords: ['architect', 'riba'] },
  { industry: 'Real estate development', sector: 'Construction & Real Estate', strong: ['real estate development', 'property development'], keywords: ['land development', 'property developer'] },
  { industry: 'Real estate brokerage & leasing', sector: 'Construction & Real Estate', strong: ['real estate brokerage', 'estate agency'], keywords: ['property leasing', 'letting agent', 'realtor'] },
  { industry: 'Property management', sector: 'Construction & Real Estate', strong: ['property management'], keywords: ['block management', 'lettings management'] },

  // ── Wholesale & Retail Trade ───────────────────────────────────────
  { industry: 'Wholesale distribution', sector: 'Wholesale & Retail Trade', strong: ['wholesale', 'wholesaler'], keywords: ['distributor', 'trade supply'] },
  { industry: 'Supermarkets & grocery retail', sector: 'Wholesale & Retail Trade', strong: ['supermarket', 'grocery retail'], keywords: ['grocery', 'food retail'] },
  { industry: 'Department stores', sector: 'Wholesale & Retail Trade', strong: ['department store'], keywords: [] },
  { industry: 'Specialty retail', sector: 'Wholesale & Retail Trade', strong: ['specialty retail', 'retailer'], keywords: ['retail store', 'high street retail'] },
  { industry: 'E-commerce & online retail', sector: 'Wholesale & Retail Trade', strong: ['e-commerce', 'ecommerce', 'online retail'], keywords: ['online store', 'marketplace retail'] },
  { industry: 'Automotive dealerships', sector: 'Wholesale & Retail Trade', strong: ['car dealership', 'automotive dealership'], keywords: ['auto dealer', 'vehicle sales showroom'] },
  { industry: 'Convenience stores', sector: 'Wholesale & Retail Trade', strong: ['convenience store'], keywords: ['forecourt retail'] },
  { industry: 'Pharmacies & drugstores', sector: 'Wholesale & Retail Trade', strong: ['pharmacy', 'drugstore'], keywords: ['retail pharmacy', 'dispensing'] },
  { industry: 'Hardware & home improvement retail', sector: 'Wholesale & Retail Trade', strong: ['home improvement', 'hardware store'], keywords: ['diy retail'] },

  // ── Transportation & Logistics ─────────────────────────────────────
  { industry: 'Airlines & air transport', sector: 'Transportation & Logistics', strong: ['airline', 'air transport'], keywords: ['cabin crew', 'flight operations', 'aviation carrier'] },
  { industry: 'Railroads', sector: 'Transportation & Logistics', strong: ['railroad', 'rail operator'], keywords: ['train operating', 'railway operations'] },
  { industry: 'Trucking & road freight', sector: 'Transportation & Logistics', strong: ['trucking', 'road freight', 'haulage'], keywords: ['hgv', 'road transport'] },
  { industry: 'Maritime & ocean shipping', sector: 'Transportation & Logistics', strong: ['ocean shipping', 'maritime shipping', 'container shipping'], keywords: ['shipping line', 'merchant navy'] },
  { industry: 'Inland water transport', sector: 'Transportation & Logistics', strong: ['inland waterway', 'barge'], keywords: [] },
  { industry: 'Courier & postal services', sector: 'Transportation & Logistics', strong: ['courier', 'postal services'], keywords: ['parcel delivery', 'last mile', 'postal'] },
  { industry: 'Warehousing & storage', sector: 'Transportation & Logistics', strong: ['warehousing', 'distribution centre'], keywords: ['fulfilment centre', 'storage facility', 'warehouse operative'] },
  { industry: 'Freight forwarding & logistics', sector: 'Transportation & Logistics', strong: ['freight forwarding', 'logistics'], keywords: ['supply chain', '3pl', 'freight'] },
  { industry: 'Public transit', sector: 'Transportation & Logistics', strong: ['public transit', 'public transport'], keywords: ['bus operator', 'transit authority'] },
  { industry: 'Taxi & ride-hailing services', sector: 'Transportation & Logistics', strong: ['ride-hailing', 'rideshare'], keywords: ['private hire', 'taxi'] },
  { industry: 'Pipeline transport', sector: 'Transportation & Logistics', strong: ['pipeline transport', 'pipeline operator'], keywords: ['pipeline'] },

  // ── Information & Communications Technology ─────────────────────────
  { industry: 'Software development', sector: 'Information & Communications Technology', strong: ['software development', 'software engineering', 'software developer'], keywords: ['saas', 'web development', 'application development', 'full stack'] },
  { industry: 'Cloud computing & data centers', sector: 'Information & Communications Technology', strong: ['cloud computing', 'data center', 'data centre'], keywords: ['cloud infrastructure', 'aws', 'azure', 'devops', 'kubernetes'] },
  { industry: 'IT consulting & services', sector: 'Information & Communications Technology', strong: ['it consulting', 'it services', 'systems integration'], keywords: ['managed it services', 'it support'] },
  { industry: 'Cybersecurity', sector: 'Information & Communications Technology', strong: ['cybersecurity', 'cyber security', 'information security'], keywords: ['infosec', 'penetration testing', 'soc analyst'] },
  { industry: 'Telecommunications carriers', sector: 'Information & Communications Technology', strong: ['telecommunications', 'telecom'], keywords: ['mobile network', 'telecoms carrier', '5g'] },
  { industry: 'Internet service providers', sector: 'Information & Communications Technology', strong: ['internet service provider', 'broadband provider'], keywords: ['isp', 'broadband'] },
  { industry: 'Data processing & hosting', sector: 'Information & Communications Technology', strong: ['data processing', 'web hosting'], keywords: ['hosting services'] },
  { industry: 'AI & data analytics', sector: 'Information & Communications Technology', strong: ['artificial intelligence', 'machine learning', 'data analytics'], keywords: ['data science', 'big data', 'deep learning'] },
  { industry: 'Video game development', sector: 'Information & Communications Technology', strong: ['video game', 'game development', 'game studio'], keywords: ['gaming', 'gameplay'] },
  { industry: 'Semiconductor design', sector: 'Information & Communications Technology', strong: ['semiconductor design', 'chip design'], keywords: ['asic', 'fpga', 'vlsi'] },

  // ── Media & Entertainment ──────────────────────────────────────────
  { industry: 'Film & television production', sector: 'Media & Entertainment', strong: ['film production', 'television production'], keywords: ['film studio', 'tv production', 'filmmaking'] },
  { industry: 'Music & recording', sector: 'Media & Entertainment', strong: ['record label', 'music production'], keywords: ['recording studio', 'music recording'] },
  { industry: 'Broadcasting', sector: 'Media & Entertainment', strong: ['broadcasting', 'broadcaster'], keywords: ['radio broadcast', 'tv broadcast'] },
  { industry: 'Streaming media', sector: 'Media & Entertainment', strong: ['streaming media', 'streaming service'], keywords: ['ott streaming', 'video streaming'] },
  { industry: 'Publishing', sector: 'Media & Entertainment', strong: ['publishing', 'publisher'], keywords: ['book publishing', 'editorial', 'news publishing'] },
  { industry: 'Advertising & marketing', sector: 'Media & Entertainment', strong: ['advertising agency', 'marketing agency'], keywords: ['media buying', 'adtech', 'digital marketing'] },
  { industry: 'Public relations', sector: 'Media & Entertainment', strong: ['public relations', 'pr agency'], keywords: ['communications agency', 'press office'] },
  { industry: 'Live events & performing arts', sector: 'Media & Entertainment', strong: ['live events', 'performing arts'], keywords: ['theatre production', 'event production', 'concerts'] },
  { industry: 'Sports & recreation', sector: 'Media & Entertainment', strong: ['sports club', 'leisure centre'], keywords: ['sports team', 'fitness centre', 'recreation'] },

  // ── Financial Services ─────────────────────────────────────────────
  { industry: 'Commercial banking', sector: 'Financial Services', strong: ['commercial banking', 'retail banking'], keywords: ['business banking', 'bank branch', 'deposits'] },
  { industry: 'Investment banking', sector: 'Financial Services', strong: ['investment banking', 'capital markets'], keywords: ['m&a advisory', 'equity research', 'debt capital markets'] },
  { industry: 'Life & health insurance', sector: 'Financial Services', strong: ['life insurance', 'health insurance'], keywords: ['life assurance', 'health cover'] },
  { industry: 'Property & casualty insurance', sector: 'Financial Services', strong: ['property and casualty', 'general insurance'], keywords: ['p&c insurance', 'casualty insurance'] },
  { industry: 'Asset & wealth management', sector: 'Financial Services', strong: ['asset management', 'wealth management'], keywords: ['fund management', 'portfolio management', 'investment management'] },
  { industry: 'Private equity & venture capital', sector: 'Financial Services', strong: ['private equity', 'venture capital'], keywords: ['buyout fund', 'growth equity', 'vc firm'] },
  { industry: 'Stock exchanges & brokerage', sector: 'Financial Services', strong: ['brokerage', 'stock exchange'], keywords: ['securities trading', 'broker dealer'] },
  { industry: 'Consumer & mortgage lending', sector: 'Financial Services', strong: ['mortgage lending', 'consumer lending'], keywords: ['mortgages', 'consumer credit', 'loans'] },
  { industry: 'Payment processing & fintech', sector: 'Financial Services', strong: ['payment processing', 'fintech'], keywords: ['payments', 'merchant acquiring', 'digital wallet'] },
  { industry: 'Accounting & auditing', sector: 'Financial Services', strong: ['auditing', 'chartered accountant'], keywords: ['audit', 'tax advisory', 'bookkeeping', 'accounting'] },

  // ── Professional & Business Services ────────────────────────────────
  { industry: 'Legal services', sector: 'Professional & Business Services', strong: ['legal services', 'law firm'], keywords: ['solicitor', 'litigation', 'barrister', 'legal counsel'] },
  { industry: 'Management consulting', sector: 'Professional & Business Services', strong: ['management consulting', 'strategy consulting'], keywords: ['business consulting', 'consultancy'] },
  { industry: 'Engineering services', sector: 'Professional & Business Services', strong: ['engineering consultancy', 'engineering services', 'consulting engineer'], keywords: ['epc services', 'multidisciplinary engineering'] },
  { industry: 'Design services', sector: 'Professional & Business Services', strong: ['graphic design', 'industrial design'], keywords: ['design studio', 'product design services'] },
  { industry: 'Human resources & staffing', sector: 'Professional & Business Services', strong: ['recruitment agency', 'staffing'], keywords: ['talent acquisition', 'hr services', 'recruiter'] },
  { industry: 'Market research', sector: 'Professional & Business Services', strong: ['market research'], keywords: ['consumer insights', 'research agency'] },
  { industry: 'Facilities & security services', sector: 'Professional & Business Services', strong: ['facilities management', 'security services'], keywords: ['fm services', 'cleaning services', 'manned guarding'] },
  { industry: 'Business process outsourcing (BPO)', sector: 'Professional & Business Services', strong: ['business process outsourcing', 'bpo'], keywords: ['outsourcing services', 'call centre outsourcing'] },

  // ── Healthcare & Social Services ───────────────────────────────────
  { industry: 'Hospitals & clinics', sector: 'Healthcare & Social Services', strong: ['hospital', 'nhs trust'], keywords: ['healthcare provider', 'medical centre', 'clinic'] },
  { industry: 'Physicians & medical practices', sector: 'Healthcare & Social Services', strong: ['medical practice', 'gp practice'], keywords: ['general practitioner', 'physician'] },
  { industry: 'Dental care', sector: 'Healthcare & Social Services', strong: ['dental practice', 'dentistry'], keywords: ['dentist', 'dental'] },
  { industry: 'Nursing & residential care', sector: 'Healthcare & Social Services', strong: ['residential care', 'nursing home', 'care home'], keywords: ['elderly care', 'domiciliary care'] },
  { industry: 'Mental health services', sector: 'Healthcare & Social Services', strong: ['mental health'], keywords: ['psychiatric', 'counselling services', 'psychology services'] },
  { industry: 'Biotechnology', sector: 'Healthcare & Social Services', strong: ['biotechnology', 'biotech'], keywords: ['life sciences', 'genomics', 'bioscience'] },
  { industry: 'Veterinary services', sector: 'Healthcare & Social Services', strong: ['veterinary', 'veterinarian'], keywords: ['vet practice', 'animal health'] },
  { industry: 'Diagnostic laboratories', sector: 'Healthcare & Social Services', strong: ['diagnostic laboratory', 'pathology'], keywords: ['clinical laboratory', 'diagnostics lab'] },

  // ── Hospitality & Tourism ──────────────────────────────────────────
  { industry: 'Hotels & accommodation', sector: 'Hospitality & Tourism', strong: ['hotel', 'accommodation'], keywords: ['resort', 'lodging', 'hospitality'] },
  { industry: 'Restaurants & food service', sector: 'Hospitality & Tourism', strong: ['restaurant', 'food service'], keywords: ['catering', 'chef', 'kitchen'] },
  { industry: 'Travel agencies & tour operators', sector: 'Hospitality & Tourism', strong: ['travel agency', 'tour operator'], keywords: ['travel agent', 'tourism'] },
  { industry: 'Casinos & gaming', sector: 'Hospitality & Tourism', strong: ['casino', 'gambling'], keywords: ['betting', 'wagering'] },

  // ── Education & Public Services ────────────────────────────────────
  { industry: 'Primary & secondary education', sector: 'Education & Public Services', strong: ['primary school', 'secondary school'], keywords: ['schoolteacher', 'sixth form', 'key stage'] },
  { industry: 'Higher education', sector: 'Education & Public Services', strong: ['higher education', 'university'], keywords: ['lecturer', 'further education college', 'academic research'] },
  { industry: 'Vocational & professional training', sector: 'Education & Public Services', strong: ['vocational training', 'professional training'], keywords: ['apprenticeship training', 'skills training'] },
  { industry: 'Government & public administration', sector: 'Education & Public Services', strong: ['public administration', 'civil service'], keywords: ['public sector', 'local authority', 'government department'] },
];
