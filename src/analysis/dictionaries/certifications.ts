/**
 * Comprehensive list of professional certifications across all industries
 */

export const certificationPatterns: Array<{ name: string; pattern: RegExp }> = [
// Finance & Accounting core
  {
    name: 'CFA',
    pattern: /\b(?:Chartered\s+Financial\s+Analyst|CFA(?:\s+Program)?)(?:\s*(?:charterholder|charter))?(?:\s*(?:Level|Lvl)\s*(?:I{1,3}|1|2|3|One|Two|Three))?\b/gi
  },
  {
    name: 'ACCA',
    pattern: /\b(?:ACCA|Association\s+of\s+Chartered\s+Certified\s+Accountants|FCCA)\b/gi
  },
  {
    name: 'ACA',
    pattern: /\b(?:ACA|ICAEW\s+ACA|ICAEW\s+Chartered\s+Accountant|Associate\s+Chartered\s+Accountant)\b/gi
  },
  {
    name: 'CIMA',
    pattern: /\b(?:CIMA|Chartered\s+Institute\s+of\s+Management\s+Accountants|CGMA|Chartered\s+Global\s+Management\s+Accountant)\b/gi
  },
  {
    name: 'FRM',
    pattern: /\b(?:FRM|Financial\s+Risk\s+Manager)(?:\s*(?:Part|Pt)\s*(?:I{1,2}|1|2|One|Two))?\b/gi
  },
  {
    name: 'CPA',
    pattern: /\b(?:CPA|Certified\s+Public\s+Accountant|Uniform\s+CPA\s+Examination)\b/gi
  },
  {
    name: 'CIA',
    pattern: /\b(?:CIA|Certified\s+Internal\s+Auditor)\b/gi
  },
  {
    name: 'CISA',
    pattern: /\b(?:CISA|Certified\s+Information\s+Systems\s+Auditor)\b/gi
  },
  {
    name: 'CFP',
    pattern: /\b(?:CFP|Certified\s+Financial\s+Planner)\b/gi
  },
  {
    name: 'CMA',
    pattern: /\b(?:CMA|Certified\s+Management\s+Accountant)\b/gi
  },
  {
    name: 'EA',
    pattern: /\b(?:EA|Enrolled\s+Agent)\b/gi
  },
  {
    name: 'CAIA',
    pattern: /\b(?:CAIA|Chartered\s+Alternative\s+Investment\s+Analyst)(?:\s*(?:Level|Lvl)\s*(?:I{1,2}|1|2|One|Two))?\b/gi
  },
  {
    name: 'CTP',
    pattern: /\b(?:CTP|Certified\s+Treasury\s+Professional)\b/gi
  },

  // FINRA / US securities
  { name: 'Series 7',  pattern: /\b(?:Series\s*7|FINRA\s+Series\s*7)\b/gi },
  { name: 'Series 63', pattern: /\b(?:Series\s*63|FINRA\s+Series\s*63)\b/gi },
  { name: 'Series 65', pattern: /\b(?:Series\s*65|FINRA\s+Series\s*65)\b/gi },
  { name: 'Series 66', pattern: /\b(?:Series\s*66|FINRA\s+Series\s*66)\b/gi },

  // UK accounting / tax / treasury / wealth
  {
    name: 'AAT',
    pattern: /\b(?:AAT|Association\s+of\s+Accounting\s+Technicians|AATQB|MAAT|FMAAT|AAT\s+Level\s*4\s+Diploma\s+in\s+Professional\s+Accounting|Level\s*4\s+Diploma\s+in\s+Professional\s+Accounting|Level\s*4\s+Diploma\s+for\s+Professional\s+Accounting\s+Technicians|L4PAT)\b/gi
  },
  {
    name: 'ATT',
    pattern: /\b(?:ATT|Association\s+of\s+Taxation\s+Technicians)\b/gi
  },
  {
    name: 'CTA',
    pattern: /\b(?:CTA|Chartered\s+Tax\s+Adviser|Chartered\s+Tax\s+Advisor)\b/gi
  },
  {
    name: 'ACT',
    pattern: /\b(?:ACT|Association\s+of\s+Corporate\s+Treasurers|AMCT|MCT|FCT)\b/gi
  },
  {
    name: 'IMC',
    pattern: /\b(?:IMC|Investment\s+Management\s+Certificate)\b/gi
  },
  {
    name: 'CISI',
    pattern: /\b(?:CISI|Chartered\s+Institute\s+for\s+Securities\s*(?:and|&)\s*Investment)\b/gi
  },
  {
    name: 'IAD',
    pattern: /\b(?:IAD|Investment\s+Advice\s+Diploma|CISI\s+Level\s*4\s+Diploma\s+in\s+Investment\s+Advice|Level\s*4\s+Diploma\s+in\s+Investment\s+Advice)\b/gi
  },
  {
    name: 'CeMAP',
    pattern: /\b(?:CeMAP|Certificate\s+in\s+Mortgage\s+Advice\s+and\s+Practice|CeMAP\s+Level\s*3)\b/gi
  },
  {
    name: 'CeMAP Diploma',
    pattern: /\b(?:CeMAP\s+Diploma|CeMAP\s+Level\s*4|Level\s*4\s+CeMAP\s+Diploma|Advanced\s+Mortgage\s+Advice|AMA)\b/gi
  },
  {
    name: 'DipPFS',
    pattern: /\b(?:DipPFS|Diploma\s+in\s+Regulated\s+Financial\s+Planning)\b/gi
  },
  {
    name: 'Cert CII',
    pattern: /\b(?:Cert\s*CII|Certificate\s+in\s+Insurance|Certificate\s+in\s+Financial\s+Services)\b/gi
  },

  // CFA Institute adjacent
  {
    name: 'CIPM',
    pattern: /\b(?:CIPM|Certificate\s+in\s+Investment\s+Performance\s+Measurement)(?:\s*(?:Level|Lvl)\s*(?:I{1,2}|1|2|One|Two))?\b/gi
  },

  // Internal audit / risk / security adjacent
  {
    name: 'CRMA',
    pattern: /\b(?:CRMA|Certification\s+in\s+Risk\s+Management\s+Assurance)\b/gi
  },
  {
    name: 'CRISC',
    pattern: /\b(?:CRISC|Certified\s+in\s+Risk\s+and\s+Information\s+Systems\s+Control)\b/gi
  },
  {
    name: 'CISM',
    pattern: /\b(?:CISM|Certified\s+Information\s+Security\s+Manager)\b/gi
  },
  // IT & Technology
  { name: 'AWS Certified Solutions Architect', pattern: /AWS\s+(?:Certified\s+)?Solutions\s+Architect/gi },
  { name: 'AWS Certified Developer', pattern: /AWS\s+(?:Certified\s+)?Developer/gi },
  { name: 'AWS Certified SysOps', pattern: /AWS\s+(?:Certified\s+)?SysOps/gi },
  { name: 'Azure Administrator', pattern: /Azure\s+Administrator/gi },
  { name: 'Azure Developer', pattern: /Azure\s+Developer/gi },
  { name: 'Azure Solutions Architect', pattern: /Azure\s+Solutions\s+Architect/gi },
  { name: 'GCP Professional', pattern: /GCP\s+Professional|Google\s+Cloud\s+Professional/gi },
  { name: 'CISSP', pattern: /\bCISSP\b/gi },
  { name: 'CompTIA Security+', pattern: /CompTIA\s+Security\+|Security\+/gi },
  { name: 'CompTIA Network+', pattern: /CompTIA\s+Network\+|Network\+/gi },
  { name: 'CompTIA A+', pattern: /CompTIA\s+A\+|A\+\s+Certified/gi },
  { name: 'CEH', pattern: /\bCEH\b|Certified\s+Ethical\s+Hacker/gi },
  { name: 'CCNA', pattern: /\bCCNA\b|Cisco\s+Certified/gi },
  { name: 'CCNP', pattern: /\bCCNP\b/gi },
  { name: 'CCIE', pattern: /\bCCIE\b/gi },
  { name: 'RHCSA', pattern: /\bRHCSA\b|Red\s+Hat\s+Certified/gi },
  { name: 'RHCE', pattern: /\bRHCE\b/gi },
  { name: 'MCSA', pattern: /\bMCSA\b|Microsoft\s+Certified\s+Solutions\s+Associate/gi },
  { name: 'MCSE', pattern: /\bMCSE\b|Microsoft\s+Certified\s+Solutions\s+Expert/gi },
  { name: 'PMP', pattern: /\bPMP\b|Project\s+Management\s+Professional/gi },
  { name: 'ITIL', pattern: /\bITIL\b/gi },
  { name: 'TOGAF', pattern: /\bTOGAF\b/gi },
  { name: 'CKA', pattern: /\bCKA\b|Certified\s+Kubernetes\s+Administrator/gi },
  { name: 'CKAD', pattern: /\bCKAD\b|Certified\s+Kubernetes\s+Application\s+Developer/gi },
  { name: 'Terraform Associate', pattern: /Terraform\s+Associate/gi },

  // Data Science & Analytics
  { name: 'Google Data Analytics', pattern: /Google\s+(?:Certified\s+)?Data\s+Analytics/gi },
  { name: 'Microsoft Certified: Data Analyst', pattern: /Microsoft\s+Certified:?\s*Data\s+Analyst/gi },
  { name: 'Tableau Desktop Specialist', pattern: /Tableau\s+Desktop\s+Specialist/gi },
  { name: 'Cloudera Certified', pattern: /Cloudera\s+Certified/gi },
  { name: 'CAP', pattern: /\bCAP\b|Certified\s+Analytics\s+Professional/gi },

  // Marketing & Sales
  { name: 'Google Ads Certification', pattern: /Google\s+Ads\s+Certif(?:ication|ied)/gi },
  { name: 'Google Analytics', pattern: /Google\s+Analytics\s+(?:Certified|Certification)/gi },
  { name: 'HubSpot Certification', pattern: /HubSpot\s+Certif(?:ication|ied)/gi },
  { name: 'Facebook Blueprint', pattern: /Facebook\s+Blueprint/gi },
  { name: 'Salesforce Certified', pattern: /Salesforce\s+Certified/gi },
  { name: 'Hootsuite Certified', pattern: /Hootsuite\s+(?:Certified|Certification)/gi },

  // HR & Management
  { name: 'SHRM-CP', pattern: /\bSHRM-CP\b/gi },
  { name: 'SHRM-SCP', pattern: /\bSHRM-SCP\b/gi },
  { name: 'PHR', pattern: /\bPHR\b|Professional\s+in\s+Human\s+Resources/gi },
  { name: 'SPHR', pattern: /\bSPHR\b|Senior\s+Professional\s+in\s+Human\s+Resources/gi },
  { name: 'GPHR', pattern: /\bGPHR\b/gi },
  { name: 'Six Sigma Green Belt', pattern: /Six\s+Sigma\s+Green\s+Belt/gi },
  { name: 'Six Sigma Black Belt', pattern: /Six\s+Sigma\s+Black\s+Belt/gi },
  { name: 'Lean Six Sigma', pattern: /Lean\s+Six\s+Sigma/gi },
  { name: 'Scrum Master', pattern: /(?:Certified\s+)?Scrum\s+Master|CSM/gi },
  { name: 'Product Owner', pattern: /(?:Certified\s+)?(?:Scrum\s+)?Product\s+Owner|CSPO/gi },
  { name: 'SAFe', pattern: /\bSAFe\b\s+(?:Agilist|Certified)/gi },

  // Healthcare
  { name: 'MD', pattern: /\bM\.?D\.?\b|Doctor\s+of\s+Medicine/gi },
  { name: 'RN', pattern: /\bR\.?N\.?\b|Registered\s+Nurse/gi },
  { name: 'NP', pattern: /\bN\.?P\.?\b|Nurse\s+Practitioner/gi },
  { name: 'PA-C', pattern: /\bPA-C\b|Physician\s+Assistant/gi },
  { name: 'PharmD', pattern: /\bPharmD\b|Doctor\s+of\s+Pharmacy/gi },
  { name: 'APRN', pattern: /\bAPRN\b/gi },
  { name: 'ACLS', pattern: /\bACLS\b/gi },
  { name: 'BLS', pattern: /\bBLS\b/gi },
  { name: 'CNA', pattern: /\bCNA\b|Certified\s+Nursing\s+Assistant/gi },

  // Legal
  { name: 'JD', pattern: /\bJ\.?D\.?\b|Juris\s+Doctor/gi },
  { name: 'LLM', pattern: /\bLL\.?M\.?\b/gi },
  { name: 'Bar Admission', pattern: /Bar\s+Admission|Licensed\s+Attorney/gi },
  { name: 'Notary Public', pattern: /Notary\s+Public/gi },

  // Engineering
  { name: 'PE', pattern: /\bP\.?E\.?\b|Professional\s+Engineer/gi },
  { name: 'FE', pattern: /\bF\.?E\.?\b|Fundamentals\s+of\s+Engineering/gi },
  { name: 'EIT', pattern: /\bEIT\b|Engineer\s+in\s+Training/gi },
  { name: 'PLS', pattern: /\bPLS\b|Professional\s+Land\s+Surveyor/gi },
  { name: 'LEED AP', pattern: /LEED\s+AP/gi },

  // Real Estate & Construction
  { name: 'Real Estate License', pattern: /Real\s+Estate\s+Licen(?:se|ced)/gi },
  { name: 'CCIM', pattern: /\bCCIM\b/gi },
  { name: 'CPM', pattern: /\bCPM\b|Certified\s+Property\s+Manager/gi },
  { name: 'OSHA', pattern: /OSHA\s+(?:Certified|Certification)/gi },

  // Supply Chain & Logistics
  { name: 'CSCP', pattern: /\bCSCP\b|Certified\s+Supply\s+Chain\s+Professional/gi },
  { name: 'CPIM', pattern: /\bCPIM\b/gi },
  { name: 'CLTD', pattern: /\bCLTD\b/gi },

  // Quality & Manufacturing
  { name: 'ASQ', pattern: /ASQ\s+Certif(?:ied|ication)/gi },
  { name: 'CQE', pattern: /\bCQE\b|Certified\s+Quality\s+Engineer/gi },
  { name: 'CQA', pattern: /\bCQA\b|Certified\s+Quality\s+Auditor/gi },

  // General Business
  { name: 'MBA', pattern: /\bMBA\b|Master\s+of\s+Business\s+Administration/gi },
  { name: 'CFA', pattern: /\bCFA\b/gi },
];
