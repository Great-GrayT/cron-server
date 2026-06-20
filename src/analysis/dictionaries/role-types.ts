/**
 * Comprehensive dictionary of job role types/functionalities
 * Organized by FUNCTIONAL PURPOSE - what the job actually does
 * Categories answer: "Is this quantitative? Real estate? Data analysis?
 * Corporate finance? Investment banking?"
 */

export interface RoleTypeDefinition {
  roleType: string;
  category: string;
  keywords: string[];
  titlePatterns: RegExp[];
}

// Functional categories - focused on what the job DOES, not broad industry
export const ROLE_CATEGORIES = [
  "Quantitative Finance",
  "Investment Banking",
  "Trading",
  "Asset & Portfolio Management",
  "Private Equity & Venture Capital",
  "Corporate Finance & Accounting",
  "Risk Management",
  "Compliance & Regulatory",
  "Wealth Management & Advisory",
  "Real Estate",
  "Insurance & Actuarial",
  "Credit & Lending",
  "Data & Analytics",
  "Machine Learning & AI",
  "Software Engineering",
  "Infrastructure & Cloud",
  "Cybersecurity",
  "Product & Design",
  "Sales & Business Development",
  "Marketing & Communications",
  "Consulting & Advisory",
  "Operations & Project Management",
  "Research & Science",
  "Engineering",
  "Healthcare & Life Sciences",
  "Other Professional",
] as const;

export type RoleCategory = (typeof ROLE_CATEGORIES)[number];

export const roleTypes: RoleTypeDefinition[] = [
  // =====================================================
  // QUANTITATIVE FINANCE
  // Jobs involving mathematical modeling, statistical analysis,
  // algorithmic strategies, and quantitative methods in finance
  // =====================================================
  {
    roleType: "Quantitative Research",
    category: "Quantitative Finance",
    keywords: [
      "quantitative research",
      "quant researcher",
      "quantitative analyst",
      "quant analyst",
      "strats",
      "quantitative strategist",
      "alpha research",
    ],
    titlePatterns: [
      /quant(?:itative)?\s*(?:research|analyst|strategist)/i,
      /\bstrats\b/i,
    ],
  },
  {
    roleType: "Quantitative Trading",
    category: "Quantitative Finance",
    keywords: [
      "quantitative trading",
      "quant trader",
      "algorithmic trading",
      "algo trader",
      "systematic trading",
      "hft",
      "high frequency",
    ],
    titlePatterns: [
      /quant(?:itative)?\s*trad(?:er|ing)/i,
      /algo(?:rithmic)?\s*trad/i,
      /systematic\s*trad/i,
    ],
  },
  {
    roleType: "Quantitative Development",
    category: "Quantitative Finance",
    keywords: [
      "quant developer",
      "quantitative developer",
      "quant dev",
      "strat tech",
      "quantitative software",
      "pricing library",
    ],
    titlePatterns: [
      /quant(?:itative)?\s*(?:develop|dev|software)/i,
      /strat(?:s)?\s*tech/i,
    ],
  },
  {
    roleType: "Financial Engineering",
    category: "Quantitative Finance",
    keywords: [
      "financial engineer",
      "derivatives pricing",
      "structured products",
      "financial modeling",
      "options pricing",
      "monte carlo",
    ],
    titlePatterns: [
      /financial\s*engineer/i,
      /derivatives?\s*(?:pricing|structur)/i,
      /structured\s*products/i,
    ],
  },

  // =====================================================
  // INVESTMENT BANKING
  // M&A, capital markets, deal execution, corporate advisory
  // =====================================================
  {
    roleType: "Investment Banking",
    category: "Investment Banking",
    keywords: [
      "investment banking",
      "investment banker",
      "M&A",
      "mergers acquisitions",
      "capital markets",
      "DCM",
      "ECM",
      "leveraged finance",
    ],
    titlePatterns: [/investment\s*bank/i, /\bM&A\b/i, /capital\s*markets/i],
  },
  {
    roleType: "Equity Research",
    category: "Investment Banking",
    keywords: [
      "equity research",
      "research analyst",
      "sell-side research",
      "buy-side research",
      "equity analyst",
      "stock research",
      "securities research",
    ],
    titlePatterns: [
      /equity\s*research/i,
      /securities\s*analyst/i,
    ],
  },

  // =====================================================
  // TRADING
  // Execution, market-making, prop trading, flow trading
  // =====================================================
  {
    roleType: "Trading",
    category: "Trading",
    keywords: [
      "trader",
      "trading",
      "desk trader",
      "prop trading",
      "proprietary trading",
      "execution trader",
      "flow trader",
      "market maker",
    ],
    titlePatterns: [/\btrad(?:er|ing)\b/i, /market\s*mak/i],
  },

  // =====================================================
  // ASSET & PORTFOLIO MANAGEMENT
  // Fund management, asset allocation, investment management
  // =====================================================
  {
    roleType: "Portfolio Management",
    category: "Asset & Portfolio Management",
    keywords: [
      "portfolio manager",
      "fund manager",
      "asset manager",
      "investment manager",
      "portfolio management",
      "asset allocation",
    ],
    titlePatterns: [
      /portfolio\s*manag/i,
      /fund\s*manag/i,
      /asset\s*manag/i,
      /investment\s*manag/i,
    ],
  },
  {
    roleType: "Hedge Fund",
    category: "Asset & Portfolio Management",
    keywords: [
      "hedge fund",
      "fund management",
      "alternative investments",
      "hedge fund analyst",
    ],
    titlePatterns: [/hedge\s*fund/i],
  },

  // =====================================================
  // PRIVATE EQUITY & VENTURE CAPITAL
  // Buyout, growth equity, startup investing
  // =====================================================
  {
    roleType: "Private Equity",
    category: "Private Equity & Venture Capital",
    keywords: [
      "private equity",
      "PE",
      "buyout",
      "LBO",
      "growth equity",
      "PE associate",
      "PE analyst",
    ],
    titlePatterns: [
      /private\s*equity/i,
      /\bPE\s*(?:analyst|associate)/i,
      /buyout/i,
    ],
  },
  {
    roleType: "Venture Capital",
    category: "Private Equity & Venture Capital",
    keywords: [
      "venture capital",
      "VC",
      "startup investing",
      "venture partner",
      "VC analyst",
      "VC associate",
    ],
    titlePatterns: [/venture\s*capital/i, /\bVC\b/i],
  },

  // =====================================================
  // CORPORATE FINANCE & ACCOUNTING
  // FP&A, accounting, treasury, controller, tax
  // =====================================================
  {
    roleType: "Financial Analysis",
    category: "Corporate Finance & Accounting",
    keywords: [
      "financial analyst",
      "FP&A",
      "financial planning",
      "financial analysis",
      "corporate finance analyst",
      "financial controller",
    ],
    titlePatterns: [
      /financial\s*analyst/i,
      /\bFP&A\b/i,
      /financial\s*planning/i,
      /corporate\s*finance/i,
    ],
  },
  {
    roleType: "Accounting",
    category: "Corporate Finance & Accounting",
    keywords: [
      "accountant",
      "accounting",
      "auditor",
      "CPA",
      "ACA",
      "ACCA",
      "tax accountant",
      "staff accountant",
      "senior accountant",
      "controller",
    ],
    titlePatterns: [
      /account(?:ant|ing)/i,
      /\bauditor\b/i,
      /\bCPA\b/i,
      /controller/i,
    ],
  },
  {
    roleType: "Treasury",
    category: "Corporate Finance & Accounting",
    keywords: [
      "treasury",
      "treasurer",
      "cash management",
      "liquidity management",
      "treasury analyst",
    ],
    titlePatterns: [/treasur(?:y|er)/i, /cash\s*manag/i],
  },

  // =====================================================
  // RISK MANAGEMENT
  // Credit risk, market risk, operational risk
  // =====================================================
  {
    roleType: "Risk Management",
    category: "Risk Management",
    keywords: [
      "risk management",
      "risk analyst",
      "risk manager",
      "credit risk",
      "market risk",
      "operational risk",
      "risk officer",
    ],
    titlePatterns: [/risk\s*(?:manag|analyst|officer)/i, /\bcro\b/i],
  },

  // =====================================================
  // COMPLIANCE & REGULATORY
  // AML, KYC, regulatory compliance, financial crimes
  // =====================================================
  {
    roleType: "Compliance",
    category: "Compliance & Regulatory",
    keywords: [
      "compliance",
      "regulatory",
      "compliance officer",
      "AML",
      "KYC",
      "financial crimes",
    ],
    titlePatterns: [/compliance/i, /\bAML\b/i, /\bKYC\b/i],
  },

  // =====================================================
  // WEALTH MANAGEMENT & ADVISORY
  // Financial advisory, private banking, client advisory
  // =====================================================
  {
    roleType: "Wealth Management",
    category: "Wealth Management & Advisory",
    keywords: [
      "wealth management",
      "financial advisor",
      "wealth advisor",
      "private banking",
      "client advisor",
    ],
    titlePatterns: [
      /wealth\s*(?:manag|advisor)/i,
      /financial\s*advisor/i,
      /private\s*bank/i,
    ],
  },

  // =====================================================
  // REAL ESTATE
  // REIT, property management, real estate finance, CRE
  // =====================================================
  {
    roleType: "Real Estate Finance",
    category: "Real Estate",
    keywords: [
      "real estate",
      "REIT",
      "property",
      "real estate finance",
      "commercial real estate",
      "CRE",
      "mortgage",
      "real estate analyst",
      "property management",
      "real estate investment",
    ],
    titlePatterns: [
      /real\s*estate/i,
      /\bREIT\b/i,
      /\bCRE\b/i,
      /property\s*(?:manag|analyst|invest)/i,
      /mortgage/i,
    ],
  },

  // =====================================================
  // INSURANCE & ACTUARIAL
  // Actuarial science, insurance underwriting, pricing
  // =====================================================
  {
    roleType: "Actuarial",
    category: "Insurance & Actuarial",
    keywords: [
      "actuary",
      "actuarial",
      "actuarial analyst",
      "insurance actuary",
      "pricing actuary",
    ],
    titlePatterns: [/actuar(?:y|ial)/i],
  },
  {
    roleType: "Insurance",
    category: "Insurance & Actuarial",
    keywords: [
      "insurance",
      "underwriter",
      "insurance analyst",
      "claims",
      "reinsurance",
    ],
    titlePatterns: [
      /insurance/i,
      /\bunderwriter\b/i,
      /reinsurance/i,
    ],
  },

  // =====================================================
  // CREDIT & LENDING
  // Credit analysis, loan underwriting, credit risk
  // =====================================================
  {
    roleType: "Credit Analysis",
    category: "Credit & Lending",
    keywords: [
      "credit analyst",
      "credit analysis",
      "credit underwriting",
      "loan analyst",
      "credit risk",
      "lending",
    ],
    titlePatterns: [/credit\s*(?:analyst|underwriter)/i, /loan\s*analyst/i, /lending/i],
  },

  // =====================================================
  // DATA & ANALYTICS
  // Data analysis, BI, reporting, business analytics
  // =====================================================
  {
    roleType: "Data Analysis",
    category: "Data & Analytics",
    keywords: [
      "data analyst",
      "business analyst",
      "analytics",
      "BI analyst",
      "reporting analyst",
      "insights analyst",
    ],
    titlePatterns: [
      /data\s*analyst/i,
      /business\s*analyst/i,
      /\bBI\s*analyst/i,
      /analytics\s*analyst/i,
    ],
  },
  {
    roleType: "Data Science",
    category: "Data & Analytics",
    keywords: [
      "data scientist",
      "data science",
      "machine learning scientist",
      "ML scientist",
      "applied scientist",
    ],
    titlePatterns: [
      /data\s*scientist/i,
      /\bML\s*scientist/i,
      /applied\s*scientist/i,
    ],
  },
  {
    roleType: "Data Engineering",
    category: "Data & Analytics",
    keywords: [
      "data engineer",
      "data engineering",
      "ETL developer",
      "data pipeline",
      "big data engineer",
      "data platform engineer",
    ],
    titlePatterns: [
      /data\s*engineer/i,
      /\bETL\s*developer/i,
      /big\s*data\s*engineer/i,
    ],
  },
  {
    roleType: "Business Intelligence",
    category: "Data & Analytics",
    keywords: [
      "business intelligence",
      "BI developer",
      "BI analyst",
      "tableau developer",
      "power BI developer",
      "data visualization",
    ],
    titlePatterns: [
      /business\s*intelligence/i,
      /\bBI\s*(?:developer|analyst)/i,
      /tableau\s*developer/i,
      /power\s*BI/i,
    ],
  },

  // =====================================================
  // MACHINE LEARNING & AI
  // ML engineering, AI research, NLP, computer vision
  // =====================================================
  {
    roleType: "Machine Learning Engineering",
    category: "Machine Learning & AI",
    keywords: [
      "machine learning engineer",
      "ML engineer",
      "AI engineer",
      "deep learning engineer",
      "MLOps engineer",
    ],
    titlePatterns: [
      /machine\s*learning\s*engineer/i,
      /\bML\s*engineer/i,
      /\bAI\s*engineer/i,
      /MLOps/i,
    ],
  },
  {
    roleType: "AI Research",
    category: "Machine Learning & AI",
    keywords: [
      "AI research",
      "research scientist",
      "deep learning researcher",
      "NLP researcher",
      "computer vision researcher",
      "AI researcher",
    ],
    titlePatterns: [
      /\bAI\s*research/i,
      /research\s*scientist/i,
      /deep\s*learning\s*research/i,
      /\bNLP\s*research/i,
    ],
  },
  {
    roleType: "NLP Engineering",
    category: "Machine Learning & AI",
    keywords: [
      "NLP engineer",
      "natural language processing",
      "computational linguist",
      "text mining",
      "conversational AI",
    ],
    titlePatterns: [
      /\bNLP\s*engineer/i,
      /natural\s*language/i,
      /computational\s*linguist/i,
    ],
  },
  {
    roleType: "Computer Vision",
    category: "Machine Learning & AI",
    keywords: [
      "computer vision",
      "vision engineer",
      "image processing",
      "video analytics",
      "CV engineer",
    ],
    titlePatterns: [
      /computer\s*vision/i,
      /vision\s*engineer/i,
      /image\s*process/i,
    ],
  },

  // =====================================================
  // SOFTWARE ENGINEERING
  // Software development, web dev, mobile, full stack
  // =====================================================
  {
    roleType: "Software Engineering",
    category: "Software Engineering",
    keywords: [
      "software engineer",
      "software developer",
      "software development",
      "programmer",
      "coder",
      "SWE",
    ],
    titlePatterns: [
      /software\s*(?:engineer|developer)/i,
      /\bSWE\b/i,
      /\bprogrammer\b/i,
    ],
  },
  {
    roleType: "Full Stack Development",
    category: "Software Engineering",
    keywords: [
      "full stack",
      "fullstack",
      "full-stack developer",
      "full stack engineer",
    ],
    titlePatterns: [/full\s*stack/i],
  },
  {
    roleType: "Frontend Development",
    category: "Software Engineering",
    keywords: [
      "frontend",
      "front-end",
      "front end",
      "UI developer",
      "react developer",
      "vue developer",
      "angular developer",
      "web developer",
    ],
    titlePatterns: [
      /front\s*end/i,
      /frontend/i,
      /\bUI\s*developer/i,
      /react\s*dev/i,
      /vue\s*dev/i,
      /angular\s*dev/i,
    ],
  },
  {
    roleType: "Backend Development",
    category: "Software Engineering",
    keywords: [
      "backend",
      "back-end",
      "back end",
      "server-side",
      "API developer",
      "node developer",
      "python developer",
      "java developer",
    ],
    titlePatterns: [
      /back\s*end/i,
      /backend/i,
      /server\s*side/i,
      /\bAPI\s*developer/i,
    ],
  },
  {
    roleType: "Mobile Development",
    category: "Software Engineering",
    keywords: [
      "mobile developer",
      "iOS developer",
      "android developer",
      "mobile engineer",
      "react native",
      "flutter developer",
      "swift developer",
      "kotlin developer",
    ],
    titlePatterns: [
      /mobile\s*(?:developer|engineer)/i,
      /iOS\s*(?:developer|engineer)/i,
      /android\s*(?:developer|engineer)/i,
      /flutter/i,
      /react\s*native/i,
    ],
  },
  {
    roleType: "Software Architecture",
    category: "Software Engineering",
    keywords: [
      "software architect",
      "solutions architect",
      "technical architect",
      "enterprise architect",
      "system architect",
    ],
    titlePatterns: [
      /(?:software|solutions|technical|enterprise|system)\s*architect/i,
    ],
  },
  {
    roleType: "QA Engineering",
    category: "Software Engineering",
    keywords: [
      "QA engineer",
      "quality assurance",
      "test engineer",
      "SDET",
      "automation tester",
      "QA analyst",
      "test automation",
    ],
    titlePatterns: [
      /\bQA\s*(?:engineer|analyst)/i,
      /quality\s*assurance/i,
      /test\s*(?:engineer|automation)/i,
      /\bSDET\b/i,
    ],
  },
  {
    roleType: "Database Administration",
    category: "Software Engineering",
    keywords: [
      "DBA",
      "database administrator",
      "database engineer",
      "database developer",
      "SQL developer",
    ],
    titlePatterns: [
      /\bDBA\b/i,
      /database\s*(?:admin|engineer|developer)/i,
      /\bSQL\s*developer/i,
    ],
  },
  {
    roleType: "Embedded Systems",
    category: "Software Engineering",
    keywords: [
      "embedded systems",
      "firmware engineer",
      "embedded software",
      "embedded developer",
      "IoT developer",
      "hardware engineer",
    ],
    titlePatterns: [
      /embedded\s*(?:systems|software|engineer|developer)/i,
      /firmware/i,
      /\bIoT\s*(?:developer|engineer)/i,
    ],
  },
  {
    roleType: "Game Development",
    category: "Software Engineering",
    keywords: [
      "game developer",
      "game programmer",
      "unity developer",
      "unreal developer",
      "game engineer",
      "graphics programmer",
    ],
    titlePatterns: [
      /game\s*(?:developer|programmer|engineer)/i,
      /unity\s*developer/i,
      /unreal\s*developer/i,
    ],
  },
  {
    roleType: "Blockchain Development",
    category: "Software Engineering",
    keywords: [
      "blockchain developer",
      "smart contract",
      "solidity developer",
      "web3 developer",
      "crypto developer",
      "DeFi developer",
    ],
    titlePatterns: [
      /blockchain\s*(?:developer|engineer)/i,
      /smart\s*contract/i,
      /solidity/i,
      /web3/i,
      /\bDeFi\b/i,
    ],
  },

  // =====================================================
  // INFRASTRUCTURE & CLOUD
  // DevOps, SRE, cloud, networking, sysadmin
  // =====================================================
  {
    roleType: "DevOps Engineering",
    category: "Infrastructure & Cloud",
    keywords: [
      "devops",
      "devops engineer",
      "SRE",
      "site reliability",
      "platform engineer",
      "infrastructure engineer",
      "release engineer",
    ],
    titlePatterns: [
      /\bdevops\b/i,
      /\bSRE\b/i,
      /site\s*reliability/i,
      /platform\s*engineer/i,
      /infrastructure\s*engineer/i,
    ],
  },
  {
    roleType: "Cloud Engineering",
    category: "Infrastructure & Cloud",
    keywords: [
      "cloud engineer",
      "AWS engineer",
      "azure engineer",
      "GCP engineer",
      "cloud architect",
      "cloud developer",
    ],
    titlePatterns: [
      /cloud\s*(?:engineer|architect|developer)/i,
      /\bAWS\s*(?:engineer|architect)/i,
      /azure\s*(?:engineer|architect)/i,
    ],
  },
  {
    roleType: "Network Engineering",
    category: "Infrastructure & Cloud",
    keywords: [
      "network engineer",
      "network administrator",
      "network architect",
      "CCNA",
      "CCNP",
      "network operations",
    ],
    titlePatterns: [/network\s*(?:engineer|admin|architect)/i, /\bNOC\b/i],
  },
  {
    roleType: "Systems Administration",
    category: "Infrastructure & Cloud",
    keywords: [
      "systems administrator",
      "sysadmin",
      "linux administrator",
      "windows administrator",
      "system admin",
      "IT administrator",
    ],
    titlePatterns: [
      /system(?:s)?\s*admin/i,
      /sysadmin/i,
      /linux\s*admin/i,
      /windows\s*admin/i,
    ],
  },
  {
    roleType: "IT Support",
    category: "Infrastructure & Cloud",
    keywords: [
      "IT support",
      "help desk",
      "desktop support",
      "technical support",
      "IT technician",
      "support engineer",
    ],
    titlePatterns: [
      /\bIT\s*support/i,
      /help\s*desk/i,
      /desktop\s*support/i,
      /technical\s*support/i,
    ],
  },
  {
    roleType: "IT Management",
    category: "Infrastructure & Cloud",
    keywords: [
      "IT manager",
      "technology manager",
      "infrastructure manager",
      "IT director",
      "CTO",
      "CIO",
    ],
    titlePatterns: [
      /\bIT\s*(?:manager|director)/i,
      /technology\s*manager/i,
    ],
  },

  // =====================================================
  // CYBERSECURITY
  // Security engineering, pen testing, SOC, security architecture
  // =====================================================
  {
    roleType: "Security Engineering",
    category: "Cybersecurity",
    keywords: [
      "security engineer",
      "cybersecurity engineer",
      "infosec engineer",
      "application security",
      "product security",
    ],
    titlePatterns: [
      /security\s*engineer/i,
      /cybersecurity\s*engineer/i,
      /infosec/i,
      /appsec/i,
    ],
  },
  {
    roleType: "Penetration Testing",
    category: "Cybersecurity",
    keywords: [
      "penetration tester",
      "ethical hacker",
      "security researcher",
      "red team",
      "offensive security",
      "pen tester",
    ],
    titlePatterns: [
      /penetration\s*test/i,
      /pen\s*test/i,
      /ethical\s*hacker/i,
      /red\s*team/i,
      /offensive\s*security/i,
    ],
  },
  {
    roleType: "Security Analysis",
    category: "Cybersecurity",
    keywords: [
      "security analyst",
      "SOC analyst",
      "threat analyst",
      "vulnerability analyst",
      "blue team",
      "security operations",
    ],
    titlePatterns: [
      /security\s*analyst/i,
      /\bSOC\s*analyst/i,
      /threat\s*analyst/i,
      /blue\s*team/i,
    ],
  },
  {
    roleType: "Security Architecture",
    category: "Cybersecurity",
    keywords: [
      "security architect",
      "cybersecurity architect",
      "enterprise security",
      "security design",
    ],
    titlePatterns: [/security\s*architect/i, /cybersecurity\s*architect/i],
  },

  // =====================================================
  // PRODUCT & DESIGN
  // Product management, UX/UI, graphic design
  // =====================================================
  {
    roleType: "Product Management",
    category: "Product & Design",
    keywords: [
      "product manager",
      "product owner",
      "technical product manager",
      "product lead",
      "APM",
    ],
    titlePatterns: [
      /product\s*(?:manager|owner|lead)/i,
      /\bTPM\b/i,
      /\bAPM\b/i,
    ],
  },
  {
    roleType: "UX Design",
    category: "Product & Design",
    keywords: [
      "UX designer",
      "user experience",
      "UX researcher",
      "usability",
      "interaction designer",
      "UX lead",
    ],
    titlePatterns: [
      /\bUX\s*(?:designer|researcher|lead)/i,
      /user\s*experience/i,
      /usability/i,
    ],
  },
  {
    roleType: "UI Design",
    category: "Product & Design",
    keywords: [
      "UI designer",
      "user interface",
      "visual designer",
      "interface designer",
      "UI developer",
    ],
    titlePatterns: [
      /\bUI\s*designer/i,
      /user\s*interface/i,
      /visual\s*designer/i,
    ],
  },
  {
    roleType: "Product Design",
    category: "Product & Design",
    keywords: [
      "product designer",
      "UX/UI designer",
      "design lead",
      "staff designer",
    ],
    titlePatterns: [/product\s*designer/i, /UX\/UI/i, /design\s*lead/i],
  },
  {
    roleType: "Graphic Design",
    category: "Product & Design",
    keywords: [
      "graphic designer",
      "visual designer",
      "brand designer",
      "creative designer",
      "digital designer",
    ],
    titlePatterns: [
      /graphic\s*designer/i,
      /brand\s*designer/i,
      /creative\s*designer/i,
    ],
  },

  // =====================================================
  // SALES & BUSINESS DEVELOPMENT
  // =====================================================
  {
    roleType: "Sales Representative",
    category: "Sales & Business Development",
    keywords: [
      "sales representative",
      "sales rep",
      "sales exec",
      "account executive",
      "AE",
      "sales associate",
    ],
    titlePatterns: [
      /sales\s*(?:rep|exec|associate)/i,
      /account\s*executive/i,
      /\bAE\b/i,
    ],
  },
  {
    roleType: "Business Development",
    category: "Sales & Business Development",
    keywords: [
      "business development",
      "BDR",
      "partnership manager",
      "BD manager",
      "strategic partnerships",
    ],
    titlePatterns: [/business\s*development/i, /\bBDR\b/i, /partnership/i],
  },
  {
    roleType: "Account Management",
    category: "Sales & Business Development",
    keywords: [
      "account manager",
      "client manager",
      "key account",
      "strategic account",
      "account director",
    ],
    titlePatterns: [
      /account\s*(?:manager|director)/i,
      /client\s*manager/i,
      /key\s*account/i,
    ],
  },
  {
    roleType: "Sales Engineering",
    category: "Sales & Business Development",
    keywords: [
      "sales engineer",
      "solutions engineer",
      "presales engineer",
      "technical sales",
      "SE",
    ],
    titlePatterns: [/sales\s*engineer/i, /solutions\s*engineer/i, /presales/i],
  },
  {
    roleType: "Customer Success",
    category: "Sales & Business Development",
    keywords: [
      "customer success",
      "CSM",
      "customer success manager",
      "client success",
      "customer experience",
    ],
    titlePatterns: [/customer\s*success/i, /\bCSM\b/i, /client\s*success/i],
  },

  // =====================================================
  // MARKETING & COMMUNICATIONS
  // =====================================================
  {
    roleType: "Digital Marketing",
    category: "Marketing & Communications",
    keywords: [
      "digital marketing",
      "online marketing",
      "performance marketing",
      "digital marketer",
      "marketing manager",
    ],
    titlePatterns: [
      /digital\s*market/i,
      /performance\s*market/i,
      /marketing\s*manager/i,
    ],
  },
  {
    roleType: "SEO Specialist",
    category: "Marketing & Communications",
    keywords: [
      "SEO",
      "search engine optimization",
      "SEO specialist",
      "SEO manager",
      "organic search",
    ],
    titlePatterns: [/\bSEO\b/i, /search\s*engine\s*optim/i],
  },
  {
    roleType: "Content Marketing",
    category: "Marketing & Communications",
    keywords: [
      "content marketing",
      "content strategist",
      "content manager",
      "content creator",
      "editorial",
      "copywriter",
    ],
    titlePatterns: [
      /content\s*(?:marketing|strategist|manager)/i,
      /editorial/i,
      /copywriter/i,
    ],
  },
  {
    roleType: "Product Marketing",
    category: "Marketing & Communications",
    keywords: [
      "product marketing",
      "PMM",
      "product marketing manager",
      "go-to-market",
    ],
    titlePatterns: [/product\s*marketing/i, /\bPMM\b/i],
  },
  {
    roleType: "Public Relations",
    category: "Marketing & Communications",
    keywords: [
      "public relations",
      "PR manager",
      "communications",
      "media relations",
      "PR specialist",
    ],
    titlePatterns: [
      /public\s*relations/i,
      /\bPR\s*(?:manager|specialist)/i,
      /communications\s*manager/i,
    ],
  },

  // =====================================================
  // CONSULTING & ADVISORY
  // Management consulting, strategy, IT consulting
  // =====================================================
  {
    roleType: "Management Consulting",
    category: "Consulting & Advisory",
    keywords: [
      "management consultant",
      "strategy consultant",
      "business consultant",
      "consulting analyst",
    ],
    titlePatterns: [
      /management\s*consultant/i,
      /strategy\s*consultant/i,
      /business\s*consultant/i,
      /consulting\s*analyst/i,
    ],
  },
  {
    roleType: "IT Consulting",
    category: "Consulting & Advisory",
    keywords: [
      "IT consultant",
      "technology consultant",
      "digital consultant",
      "technical consultant",
    ],
    titlePatterns: [
      /\bIT\s*consultant/i,
      /technology\s*consultant/i,
      /digital\s*consultant/i,
    ],
  },
  {
    roleType: "Financial Consulting",
    category: "Consulting & Advisory",
    keywords: [
      "financial consultant",
      "finance consultant",
      "advisory",
      "financial advisory",
    ],
    titlePatterns: [
      /financial\s*(?:consultant|advisory)/i,
      /finance\s*consultant/i,
    ],
  },

  // =====================================================
  // OPERATIONS & PROJECT MANAGEMENT
  // =====================================================
  {
    roleType: "Operations Management",
    category: "Operations & Project Management",
    keywords: [
      "operations manager",
      "operations director",
      "ops manager",
      "COO",
      "operations lead",
    ],
    titlePatterns: [
      /operations\s*(?:manager|director|lead)/i,
      /ops\s*manager/i,
      /\bCOO\b/i,
    ],
  },
  {
    roleType: "Project Management",
    category: "Operations & Project Management",
    keywords: [
      "project manager",
      "program manager",
      "delivery manager",
      "PMO",
      "PMP",
    ],
    titlePatterns: [
      /project\s*manager/i,
      /program\s*manager/i,
      /delivery\s*manager/i,
      /\bPMO\b/i,
    ],
  },
  {
    roleType: "Supply Chain Management",
    category: "Operations & Project Management",
    keywords: [
      "supply chain",
      "logistics",
      "procurement",
      "sourcing",
      "supply chain manager",
    ],
    titlePatterns: [
      /supply\s*chain/i,
      /logistics/i,
      /procurement/i,
      /sourcing/i,
    ],
  },
  {
    roleType: "Scrum Master",
    category: "Operations & Project Management",
    keywords: [
      "scrum master",
      "agile coach",
      "agile project manager",
      "agile lead",
    ],
    titlePatterns: [/scrum\s*master/i, /agile\s*(?:coach|lead)/i],
  },

  // =====================================================
  // RESEARCH & SCIENCE
  // =====================================================
  {
    roleType: "Scientific Research",
    category: "Research & Science",
    keywords: [
      "research scientist",
      "scientist",
      "researcher",
      "principal scientist",
      "senior scientist",
      "staff scientist",
    ],
    titlePatterns: [
      /research\s*scientist/i,
      /(?:principal|senior|staff)\s*scientist/i,
    ],
  },
  {
    roleType: "Biotechnology",
    category: "Research & Science",
    keywords: [
      "biotechnology",
      "biotech",
      "genetic engineering",
      "genomics",
      "proteomics",
      "bioinformatics",
    ],
    titlePatterns: [
      /biotech/i,
      /biotechnology/i,
      /genomics/i,
      /bioinformatics/i,
    ],
  },
  {
    roleType: "Pharmaceutical Research",
    category: "Research & Science",
    keywords: [
      "pharmaceutical",
      "drug discovery",
      "pharmacology",
      "pharma research",
      "drug development",
      "clinical development",
    ],
    titlePatterns: [
      /pharmac(?:eutical|ology)/i,
      /drug\s*(?:discovery|development)/i,
    ],
  },
  {
    roleType: "Environmental Science",
    category: "Research & Science",
    keywords: [
      "environmental scientist",
      "ecologist",
      "environmental research",
      "climate scientist",
      "sustainability researcher",
    ],
    titlePatterns: [
      /environmental\s*scientist/i,
      /ecologist/i,
      /climate\s*scientist/i,
    ],
  },

  // =====================================================
  // ENGINEERING (non-software)
  // Mechanical, electrical, civil, aerospace, etc.
  // =====================================================
  {
    roleType: "Mechanical Engineering",
    category: "Engineering",
    keywords: [
      "mechanical engineer",
      "mechanical design",
      "CAD engineer",
      "product engineer",
      "design engineer",
    ],
    titlePatterns: [
      /mechanical\s*engineer/i,
      /\bCAD\s*engineer/i,
      /design\s*engineer/i,
    ],
  },
  {
    roleType: "Electrical Engineering",
    category: "Engineering",
    keywords: [
      "electrical engineer",
      "electronics engineer",
      "power engineer",
      "circuit design",
      "PCB design",
    ],
    titlePatterns: [
      /electrical\s*engineer/i,
      /electronics\s*engineer/i,
      /power\s*engineer/i,
    ],
  },
  {
    roleType: "Civil Engineering",
    category: "Engineering",
    keywords: [
      "civil engineer",
      "structural engineer",
      "construction engineer",
      "geotechnical engineer",
      "transportation engineer",
    ],
    titlePatterns: [
      /civil\s*engineer/i,
      /structural\s*engineer/i,
      /construction\s*engineer/i,
    ],
  },
  {
    roleType: "Aerospace Engineering",
    category: "Engineering",
    keywords: [
      "aerospace engineer",
      "aeronautical engineer",
      "aircraft engineer",
      "propulsion engineer",
      "avionics engineer",
    ],
    titlePatterns: [
      /aerospace\s*engineer/i,
      /aeronautical/i,
      /aircraft\s*engineer/i,
      /avionics/i,
    ],
  },
  {
    roleType: "Robotics Engineering",
    category: "Engineering",
    keywords: [
      "robotics engineer",
      "automation engineer",
      "controls engineer",
      "robot programmer",
      "mechatronics",
    ],
    titlePatterns: [
      /robotics\s*engineer/i,
      /automation\s*engineer/i,
      /controls\s*engineer/i,
      /mechatronics/i,
    ],
  },

  // =====================================================
  // HEALTHCARE & LIFE SCIENCES
  // =====================================================
  {
    roleType: "Nursing",
    category: "Healthcare & Life Sciences",
    keywords: [
      "registered nurse",
      "RN",
      "nurse",
      "staff nurse",
      "clinical nurse",
      "nurse practitioner",
      "NP",
    ],
    titlePatterns: [
      /registered\s*nurse/i,
      /\bRN\b/i,
      /nurse\s*practitioner/i,
      /\bNP\b/i,
      /\bnurse\b/i,
    ],
  },
  {
    roleType: "Physician",
    category: "Healthcare & Life Sciences",
    keywords: [
      "physician",
      "doctor",
      "MD",
      "medical doctor",
      "attending physician",
      "hospitalist",
    ],
    titlePatterns: [/physician/i, /\bMD\b/i, /\bdoctor\b/i, /hospitalist/i],
  },
  {
    roleType: "Clinical Research",
    category: "Healthcare & Life Sciences",
    keywords: [
      "clinical research",
      "clinical trials",
      "CRA",
      "clinical research coordinator",
      "CRC",
    ],
    titlePatterns: [
      /clinical\s*research/i,
      /\bCRA\b/i,
      /\bCRC\b/i,
      /clinical\s*trials/i,
    ],
  },

  // =====================================================
  // OTHER PROFESSIONAL
  // Legal, HR, admin, education, creative, executive
  // =====================================================
  {
    roleType: "Legal Counsel",
    category: "Other Professional",
    keywords: [
      "attorney",
      "lawyer",
      "legal counsel",
      "in-house counsel",
      "corporate counsel",
      "general counsel",
      "paralegal",
    ],
    titlePatterns: [
      /attorney/i,
      /lawyer/i,
      /(?:legal|corporate|general)\s*counsel/i,
      /paralegal/i,
    ],
  },
  {
    roleType: "Human Resources",
    category: "Other Professional",
    keywords: [
      "HR manager",
      "human resources",
      "recruiter",
      "talent acquisition",
      "people manager",
      "HRBP",
    ],
    titlePatterns: [
      /\bHR\s*(?:manager|director|business)/i,
      /human\s*resources/i,
      /recruiter/i,
      /talent\s*acquisition/i,
    ],
  },
  {
    roleType: "Executive Leadership",
    category: "Other Professional",
    keywords: [
      "CEO",
      "chief executive",
      "president",
      "managing director",
      "CTO",
      "CFO",
      "COO",
      "CMO",
    ],
    titlePatterns: [
      /\bCEO\b/i,
      /chief\s*(?:executive|technology|financial|operating|marketing|product)\s*officer/i,
      /\bCTO\b/i,
      /\bCFO\b/i,
      /managing\s*director/i,
    ],
  },
  {
    roleType: "Teaching & Education",
    category: "Other Professional",
    keywords: [
      "teacher",
      "professor",
      "instructor",
      "lecturer",
      "educator",
      "tutor",
    ],
    titlePatterns: [
      /\bteacher\b/i,
      /professor/i,
      /\binstructor\b/i,
      /lecturer/i,
    ],
  },
  {
    roleType: "Administrative",
    category: "Other Professional",
    keywords: [
      "executive assistant",
      "administrative assistant",
      "office manager",
      "receptionist",
      "office administrator",
    ],
    titlePatterns: [
      /(?:executive|admin(?:istrative)?)\s*assistant/i,
      /office\s*(?:manager|admin)/i,
      /receptionist/i,
    ],
  },
  {
    roleType: "Customer Service",
    category: "Other Professional",
    keywords: [
      "customer service",
      "customer support",
      "call center",
      "contact center",
      "help desk",
    ],
    titlePatterns: [
      /customer\s*(?:service|support)/i,
      /call\s*center/i,
    ],
  },
  {
    roleType: "Creative & Media",
    category: "Other Professional",
    keywords: [
      "video editor",
      "photographer",
      "journalist",
      "reporter",
      "animator",
      "motion designer",
      "audio engineer",
    ],
    titlePatterns: [
      /video\s*(?:editor|producer)/i,
      /journalist/i,
      /reporter/i,
      /\banimator\b/i,
      /motion\s*design/i,
    ],
  },
];

// Create a map for quick lookup by role type name
export const roleTypeMap = new Map<string, RoleTypeDefinition>(
  roleTypes.map((rt) => [rt.roleType.toLowerCase(), rt]),
);

// Get all unique role type names
export const allRoleTypeNames = roleTypes.map((rt) => rt.roleType);

// Get role types by category
export function getRoleTypesByCategory(
  category: RoleCategory,
): RoleTypeDefinition[] {
  return roleTypes.filter((rt) => rt.category === category);
}
