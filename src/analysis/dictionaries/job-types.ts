/**
 * Comprehensive list of job types and specializations
 */

export interface JobTypeDefinition {
  type: string;
  keywords: string[];
}

export const jobTypes: JobTypeDefinition[] = [
  // Finance & Banking
  { type: 'Investment Banking', keywords: ['investment bank', 'M&A', 'corporate finance', 'capital markets'] },
  { type: 'Portfolio Management', keywords: ['portfolio manager', 'fund manager', 'asset allocation'] },
  { type: 'Financial Analysis', keywords: ['financial analyst', 'FP&A', 'financial planning'] },
  { type: 'Equity Research', keywords: ['equity research', 'research analyst', 'sell-side'] },
  { type: 'Risk Management', keywords: ['risk manager', 'risk analyst', 'credit risk', 'market risk'] },
  { type: 'Quantitative Finance', keywords: ['quant', 'quantitative', 'algorithmic trading'] },
  { type: 'Trading', keywords: ['trader', 'trading', 'desk trader', 'proprietary trading'] },
  { type: 'Private Equity', keywords: ['private equity', 'PE analyst', 'buyout'] },
  { type: 'Venture Capital', keywords: ['venture capital', 'VC', 'startup investing'] },
  { type: 'Wealth Management', keywords: ['wealth manager', 'financial advisor', 'private banking'] },
  { type: 'Accounting', keywords: ['accountant', 'auditor', 'tax accountant', 'staff accountant'] },
  { type: 'Treasury', keywords: ['treasury', 'cash management', 'liquidity'] },
  { type: 'Compliance', keywords: ['compliance officer', 'regulatory', 'AML'] },
  { type: 'Internal Audit', keywords: ['internal audit', 'auditor', 'sox compliance'] },

  // Technology - Software Development
  { type: 'Full Stack Developer', keywords: ['full stack', 'fullstack developer'] },
  { type: 'Frontend Developer', keywords: ['frontend', 'front-end', 'react developer', 'vue developer', 'angular developer'] },
  { type: 'Backend Developer', keywords: ['backend', 'back-end', 'server-side', 'api developer'] },
  { type: 'Mobile Developer', keywords: ['mobile developer', 'ios developer', 'android developer', 'react native', 'flutter'] },
  { type: 'DevOps Engineer', keywords: ['devops', 'sre', 'site reliability', 'infrastructure engineer'] },
  { type: 'Cloud Engineer', keywords: ['cloud engineer', 'aws engineer', 'azure engineer', 'gcp engineer'] },
  { type: 'Software Architect', keywords: ['software architect', 'solutions architect', 'technical architect'] },
  { type: 'QA Engineer', keywords: ['qa engineer', 'quality assurance', 'test engineer', 'automation tester'] },
  { type: 'Database Administrator', keywords: ['dba', 'database administrator', 'database engineer'] },
  { type: 'Embedded Systems Engineer', keywords: ['embedded systems', 'firmware engineer', 'embedded software'] },
  { type: 'Game Developer', keywords: ['game developer', 'game programmer', 'unity developer', 'unreal developer'] },

  // Technology - Data & AI
  { type: 'Data Scientist', keywords: ['data scientist', 'machine learning scientist'] },
  { type: 'Data Engineer', keywords: ['data engineer', 'etl developer', 'data pipeline'] },
  { type: 'Data Analyst', keywords: ['data analyst', 'business analyst', 'analytics'] },
  { type: 'Machine Learning Engineer', keywords: ['machine learning engineer', 'ml engineer', 'ai engineer'] },
  { type: 'AI Research Scientist', keywords: ['ai research', 'research scientist', 'deep learning researcher'] },
  { type: 'Business Intelligence Analyst', keywords: ['bi analyst', 'business intelligence', 'tableau developer'] },

  // Technology - Cybersecurity
  { type: 'Security Engineer', keywords: ['security engineer', 'cybersecurity engineer', 'infosec'] },
  { type: 'Penetration Tester', keywords: ['penetration tester', 'ethical hacker', 'security researcher'] },
  { type: 'Security Analyst', keywords: ['security analyst', 'soc analyst', 'threat analyst'] },
  { type: 'Security Architect', keywords: ['security architect', 'cybersecurity architect'] },

  // Technology - Network & IT
  { type: 'Network Engineer', keywords: ['network engineer', 'network administrator', 'ccna'] },
  { type: 'Systems Administrator', keywords: ['systems administrator', 'sysadmin', 'linux administrator'] },
  { type: 'IT Support', keywords: ['it support', 'help desk', 'desktop support', 'technical support'] },
  { type: 'IT Manager', keywords: ['it manager', 'technology manager', 'infrastructure manager'] },

  // Product & Design
  { type: 'Product Manager', keywords: ['product manager', 'product owner', 'technical product manager'] },
  { type: 'UX Designer', keywords: ['ux designer', 'user experience', 'ux researcher'] },
  { type: 'UI Designer', keywords: ['ui designer', 'user interface', 'visual designer'] },
  { type: 'Product Designer', keywords: ['product designer', 'ux/ui designer'] },
  { type: 'Graphic Designer', keywords: ['graphic designer', 'visual designer', 'brand designer'] },
  { type: 'Motion Graphics Designer', keywords: ['motion graphics', 'motion designer', 'animator'] },

  // Marketing
  { type: 'Digital Marketing Manager', keywords: ['digital marketing', 'online marketing', 'performance marketing'] },
  { type: 'SEO Specialist', keywords: ['seo specialist', 'seo manager', 'search engine optimization'] },
  { type: 'Content Marketing Manager', keywords: ['content marketing', 'content strategist', 'content manager'] },
  { type: 'Social Media Manager', keywords: ['social media manager', 'community manager', 'social media specialist'] },
  { type: 'Marketing Analyst', keywords: ['marketing analyst', 'marketing analytics', 'growth analyst'] },
  { type: 'Brand Manager', keywords: ['brand manager', 'brand strategist', 'brand marketing'] },
  { type: 'Growth Manager', keywords: ['growth manager', 'growth hacker', 'user acquisition'] },
  { type: 'Email Marketing Specialist', keywords: ['email marketing', 'email specialist', 'crm specialist'] },

  // Sales
  { type: 'Sales Representative', keywords: ['sales representative', 'sales exec', 'account executive'] },
  { type: 'Business Development Manager', keywords: ['business development', 'bdr', 'partnership manager'] },
  { type: 'Account Manager', keywords: ['account manager', 'client manager', 'customer success manager'] },
  { type: 'Sales Engineer', keywords: ['sales engineer', 'solutions engineer', 'presales engineer'] },
  { type: 'Inside Sales', keywords: ['inside sales', 'sdr', 'sales development representative'] },

  // Operations & Supply Chain
  { type: 'Operations Manager', keywords: ['operations manager', 'operations lead', 'ops manager'] },
  { type: 'Supply Chain Manager', keywords: ['supply chain', 'logistics manager', 'procurement manager'] },
  { type: 'Operations Analyst', keywords: ['operations analyst', 'process analyst', 'business operations'] },
  { type: 'Project Manager', keywords: ['project manager', 'program manager', 'delivery manager'] },
  { type: 'Scrum Master', keywords: ['scrum master', 'agile coach', 'agile project manager'] },

  // Human Resources
  { type: 'HR Manager', keywords: ['hr manager', 'human resources manager', 'people manager'] },
  { type: 'Recruiter', keywords: ['recruiter', 'talent acquisition', 'technical recruiter'] },
  { type: 'HR Business Partner', keywords: ['hr business partner', 'hrbp', 'hr consultant'] },
  { type: 'Compensation & Benefits', keywords: ['compensation', 'benefits', 'total rewards'] },
  { type: 'Training & Development', keywords: ['training', 'learning', 'organizational development'] },

  // Engineering (Non-Software)
  { type: 'Mechanical Engineer', keywords: ['mechanical engineer', 'mechanical design', 'mech engineer'] },
  { type: 'Electrical Engineer', keywords: ['electrical engineer', 'electronics engineer', 'power engineer'] },
  { type: 'Civil Engineer', keywords: ['civil engineer', 'structural engineer', 'geotechnical'] },
  { type: 'Chemical Engineer', keywords: ['chemical engineer', 'process engineer', 'petrochemical'] },
  { type: 'Biomedical Engineer', keywords: ['biomedical engineer', 'medical device', 'biomechanical'] },
  { type: 'Manufacturing Engineer', keywords: ['manufacturing engineer', 'production engineer', 'industrial engineer'] },
  { type: 'Quality Engineer', keywords: ['quality engineer', 'quality assurance engineer', 'qa engineer'] },

  // Healthcare
  { type: 'Registered Nurse', keywords: ['registered nurse', 'rn', 'staff nurse'] },
  { type: 'Nurse Practitioner', keywords: ['nurse practitioner', 'np', 'advanced practice'] },
  { type: 'Physician', keywords: ['physician', 'doctor', 'md', 'medical doctor'] },
  { type: 'Physician Assistant', keywords: ['physician assistant', 'pa-c', 'pa'] },
  { type: 'Pharmacist', keywords: ['pharmacist', 'clinical pharmacist', 'pharmd'] },
  { type: 'Medical Assistant', keywords: ['medical assistant', 'clinical assistant', 'ma'] },
  { type: 'Healthcare Administrator', keywords: ['healthcare administrator', 'hospital administrator', 'medical office manager'] },
  { type: 'Clinical Research Coordinator', keywords: ['clinical research', 'research coordinator', 'crc'] },

  // Legal
  { type: 'Attorney', keywords: ['attorney', 'lawyer', 'counsel', 'legal counsel'] },
  { type: 'Paralegal', keywords: ['paralegal', 'legal assistant', 'litigation paralegal'] },
  { type: 'Legal Counsel', keywords: ['legal counsel', 'in-house counsel', 'corporate counsel'] },
  { type: 'Compliance Officer', keywords: ['compliance officer', 'legal compliance', 'regulatory counsel'] },

  // Customer Service
  { type: 'Customer Service Representative', keywords: ['customer service', 'customer support', 'service representative'] },
  { type: 'Customer Success Manager', keywords: ['customer success', 'csm', 'client success'] },
  { type: 'Technical Support Engineer', keywords: ['technical support', 'support engineer', 'customer support engineer'] },

  // Education
  { type: 'Teacher', keywords: ['teacher', 'educator', 'instructor'] },
  { type: 'Professor', keywords: ['professor', 'assistant professor', 'associate professor'] },
  { type: 'Instructional Designer', keywords: ['instructional designer', 'learning designer', 'curriculum developer'] },

  // Real Estate
  { type: 'Real Estate Agent', keywords: ['real estate agent', 'realtor', 'property agent'] },
  { type: 'Property Manager', keywords: ['property manager', 'real estate manager', 'asset manager'] },
  { type: 'Real Estate Analyst', keywords: ['real estate analyst', 'property analyst', 'acquisition analyst'] },

  // Consulting
  { type: 'Management Consultant', keywords: ['management consultant', 'strategy consultant', 'business consultant'] },
  { type: 'IT Consultant', keywords: ['it consultant', 'technology consultant', 'digital consultant'] },
  { type: 'Financial Consultant', keywords: ['financial consultant', 'finance consultant'] },

  // Creative & Media
  { type: 'Copywriter', keywords: ['copywriter', 'content writer', 'creative writer'] },
  { type: 'Video Editor', keywords: ['video editor', 'video producer', 'post-production'] },
  { type: 'Photographer', keywords: ['photographer', 'commercial photographer', 'photo editor'] },
  { type: 'Journalist', keywords: ['journalist', 'reporter', 'news writer'] },

  // General/Catch-all
  { type: 'General Finance', keywords: ['finance', 'financial'] },
  { type: 'General Technology', keywords: ['tech', 'technology', 'software'] },
  { type: 'General Business', keywords: ['business', 'corporate', 'professional'] },
];
