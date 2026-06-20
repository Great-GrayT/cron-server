export interface JobItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  company?: string;
  location?: string;
  sourceUrl?: string; // RSS feed URL this job came from
}

export interface JobDetails {
  company: string;
  position: string;
  location: string;
  fullTitle: string;
}

export interface JobAnalysis {
  certifications: string[];
  yearsExperience: string;
  expertise: string[];
  jobType: string;
  companyType: string;
  keywords: string[];
  academicDegrees: string[];
  majors: string[];
  software: string[];
  programmingSkills: string[];
}

export interface CronJobResult {
  total: number;
  sent: number;
  failed: number;
  pubDates: string[];
  locationFiltered?: number; // Jobs filtered out by location rules
}
