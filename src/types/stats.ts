import type { SalaryData } from "@/analysis/FUNC-salary-extractor";

export type { SalaryData };

export type JobRegion =
  | "Europe"
  | "America"
  | "Middle East"
  | "Asia"
  | "Africa"
  | "Oceania";

/**
 * Fully-analysed job (ported from the old R2 `JobStatistic`). This is the
 * shape produced by the ingestion pipeline and mapped to the Prisma `Job` row.
 */
export interface JobStatistic {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string | null;
  city: string | null;
  region: JobRegion | null;
  url: string;
  postedDate: string;
  extractedDate: string;
  keywords: string[];
  certificates: string[];
  industry: string;
  seniority: string;
  description: string;
  salary?: SalaryData | null;
  software?: string[];
  programmingSkills?: string[];
  /** Numeric years of experience (parsed + capped <=15), null if unknown. */
  experienceYears?: number | null;
  academicDegrees?: string[];
  roleType?: string | null;
  roleCategory?: string | null;
}
