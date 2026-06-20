/**
 * Comprehensive list of academic majors and fields of study
 */

export const majorKeywords: Record<string, RegExp> = {
  // Business & Economics
  'Finance': /\bfinance\b/gi,
  'Accounting': /\baccounting\b/gi,
  'Economics': /\beconomics\b/gi,
  'Business Administration': /business\s+administration/gi,
  'Marketing': /\bmarketing\b/gi,
  'Management': /\bmanagement\b(?!\s+information)/gi,
  'Entrepreneurship': /\bentrepreneurship\b/gi,
  'International Business': /international\s+business/gi,
  'Supply Chain Management': /supply\s+chain\s+management/gi,
  'Operations Management': /operations\s+management/gi,
  'Human Resources': /human\s+resources|HR\s+management/gi,
  'Real Estate': /real\s+estate/gi,
  'Hospitality Management': /hospitality\s+management/gi,
  'Tourism Management': /tourism\s+management/gi,
  'Retail Management': /retail\s+management/gi,

  // STEM - Computer Science & IT
  'Computer Science': /computer\s+science/gi,
  'Software Engineering': /software\s+engineering/gi,
  'Information Technology': /information\s+technology/gi,
  'Information Systems': /information\s+systems/gi,
  'Cybersecurity': /cybersecurity|cyber\s+security/gi,
  'Data Science': /data\s+science/gi,
  'Artificial Intelligence': /artificial\s+intelligence/gi,
  'Machine Learning': /machine\s+learning/gi,
  'Computer Engineering': /computer\s+engineering/gi,
  'Network Engineering': /network\s+engineering/gi,
  'Game Development': /game\s+development/gi,
  'Web Development': /web\s+development/gi,

  // STEM - Engineering
  'Mechanical Engineering': /mechanical\s+engineering/gi,
  'Electrical Engineering': /electrical\s+engineering/gi,
  'Civil Engineering': /civil\s+engineering/gi,
  'Chemical Engineering': /chemical\s+engineering/gi,
  'Aerospace Engineering': /aerospace\s+engineering/gi,
  'Biomedical Engineering': /biomedical\s+engineering/gi,
  'Industrial Engineering': /industrial\s+engineering/gi,
  'Environmental Engineering': /environmental\s+engineering/gi,
  'Petroleum Engineering': /petroleum\s+engineering/gi,
  'Nuclear Engineering': /nuclear\s+engineering/gi,
  'Materials Science': /materials?\s+science/gi,
  'Robotics': /\brobotics\b/gi,
  'Mechatronics': /\bmechatronics\b/gi,
  'Systems Engineering': /systems\s+engineering/gi,
  'Agricultural Engineering': /agricultural\s+engineering/gi,
  'Mining Engineering': /mining\s+engineering/gi,

  // STEM - Mathematics & Statistics
  'Mathematics': /\bmathematics\b|\bmath\b(?!\s+education)/gi,
  'Applied Mathematics': /applied\s+mathematics/gi,
  'Statistics': /\bstatistics\b/gi,
  'Actuarial Science': /actuarial\s+science/gi,
  'Operations Research': /operations\s+research/gi,
  'Computational Mathematics': /computational\s+mathematics/gi,

  // STEM - Physical Sciences
  'Physics': /\bphysics\b/gi,
  'Astrophysics': /\bastrophysics\b/gi,
  'Chemistry': /\bchemistry\b/gi,
  'Biochemistry': /\bbiochemistry\b/gi,
  'Geology': /\bgeology\b/gi,
  'Geophysics': /\bgeophysics\b/gi,
  'Astronomy': /\bastronomy\b/gi,
  'Meteorology': /\bmeteorology\b/gi,
  'Oceanography': /\boceanography\b/gi,

  // STEM - Life Sciences
  'Biology': /\bbiology\b/gi,
  'Molecular Biology': /molecular\s+biology/gi,
  'Microbiology': /\bmicrobiology\b/gi,
  'Biotechnology': /\bbiotechnology\b/gi,
  'Genetics': /\bgenetics\b/gi,
  'Neuroscience': /\bneuroscience\b/gi,
  'Zoology': /\bzoology\b/gi,
  'Botany': /\bbotany\b/gi,
  'Ecology': /\becology\b/gi,
  'Marine Biology': /marine\s+biology/gi,
  'Environmental Science': /environmental\s+science/gi,

  // Health Sciences
  'Nursing': /\bnursing\b/gi,
  'Medicine': /\bmedicine\b/gi,
  'Pharmacy': /\bpharmacy\b/gi,
  'Public Health': /public\s+health/gi,
  'Health Administration': /health\s+administration/gi,
  'Kinesiology': /\bkinesiology\b/gi,
  'Physical Therapy': /physical\s+therapy/gi,
  'Occupational Therapy': /occupational\s+therapy/gi,
  'Nutrition': /\bnutrition\b|dietetics/gi,
  'Dental Hygiene': /dental\s+hygiene/gi,
  'Radiography': /\bradiography\b/gi,
  'Medical Laboratory Science': /medical\s+laboratory\s+science/gi,
  'Veterinary Science': /veterinary\s+science/gi,
  'Speech Pathology': /speech\s+pathology/gi,
  'Clinical Psychology': /clinical\s+psychology/gi,

  // Social Sciences
  'Psychology': /\bpsychology\b/gi,
  'Sociology': /\bsociology\b/gi,
  'Anthropology': /\banthropology\b/gi,
  'Political Science': /political\s+science/gi,
  'International Relations': /international\s+relations/gi,
  'Geography': /\bgeography\b/gi,
  'Social Work': /social\s+work/gi,
  'Criminal Justice': /criminal\s+justice/gi,
  'Criminology': /\bcriminology\b/gi,
  'Public Policy': /public\s+policy/gi,
  'Urban Planning': /urban\s+planning/gi,
  'Development Studies': /development\s+studies/gi,

  // Humanities
  'History': /\bhistory\b/gi,
  'Philosophy': /\bphilosophy\b/gi,
  'English Literature': /english\s+literature|literature/gi,
  'Linguistics': /\blinguistics\b/gi,
  'Religious Studies': /religious\s+studies|theology/gi,
  'Classics': /\bclassics\b/gi,
  'Archaeology': /\barchaeology\b/gi,

  // Arts & Design
  'Fine Arts': /fine\s+arts/gi,
  'Graphic Design': /graphic\s+design/gi,
  'Industrial Design': /industrial\s+design/gi,
  'Interior Design': /interior\s+design/gi,
  'Fashion Design': /fashion\s+design/gi,
  'Architecture': /\barchitecture\b/gi,
  'Music': /\bmusic\b(?!\s+therapy)/gi,
  'Theater': /\btheater\b|\btheatre\b/gi,
  'Film Studies': /film\s+studies|cinema/gi,
  'Photography': /\bphotography\b/gi,
  'Dance': /\bdance\b/gi,
  'Art History': /art\s+history/gi,

  // Communication & Media
  'Communications': /\bcommunications?\b/gi,
  'Journalism': /\bjournalism\b/gi,
  'Public Relations': /public\s+relations/gi,
  'Advertising': /\badvertising\b/gi,
  'Broadcasting': /\bbroadcasting\b/gi,
  'Media Studies': /media\s+studies/gi,
  'Digital Media': /digital\s+media/gi,

  // Education
  'Education': /\beducation\b/gi,
  'Early Childhood Education': /early\s+childhood\s+education/gi,
  'Special Education': /special\s+education/gi,
  'Educational Psychology': /educational\s+psychology/gi,
  'Curriculum and Instruction': /curriculum\s+and\s+instruction/gi,

  // Law
  'Law': /\blaw\b(?!\s+enforcement)/gi,
  'Legal Studies': /legal\s+studies/gi,
  'Paralegal Studies': /paralegal\s+studies/gi,

  // Agriculture & Environmental
  'Agriculture': /\bagriculture\b/gi,
  'Agricultural Science': /agricultural\s+science/gi,
  'Forestry': /\bforestry\b/gi,
  'Horticulture': /\bhorticulture\b/gi,
  'Animal Science': /animal\s+science/gi,
  'Food Science': /food\s+science/gi,
  'Environmental Studies': /environmental\s+studies/gi,
  'Sustainability': /\bsustainability\b/gi,

  // Interdisciplinary
  'Liberal Arts': /liberal\s+arts/gi,
  'General Studies': /general\s+studies/gi,
  'Interdisciplinary Studies': /interdisciplinary\s+studies/gi,
  'Cognitive Science': /cognitive\s+science/gi,
  'Bioinformatics': /\bbioinformatics\b/gi,
  'Computational Biology': /computational\s+biology/gi,
};
