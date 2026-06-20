import { JobAnalysis, JobDetails } from "@/types/job";
import { certificationPatterns } from "./dictionaries/certifications";
import { majorKeywords } from "./dictionaries/majors";
import { softwareKeywords } from "./dictionaries/software";
import { programmingKeywords } from "./dictionaries/programming-languages";
import { expertiseKeywords } from "./dictionaries/expertise";
import { jobTypes } from "./dictionaries/job-types";
import { companyTypes } from "./dictionaries/company-types";

/**
 * Extracts company, position, and location from job title
 */
export function extractJobDetails(title: string): JobDetails {
  const cleanTitle = title.replace(/<!\[CDATA\[|\]\]>/g, "").trim();
  const hiringMatch = cleanTitle.match(/(.+?)\s+hiring\s+(.+?)\s+(?:at|in)\s+(.+)/i);

  if (hiringMatch) {
    return {
      company: hiringMatch[1].trim(),
      position: hiringMatch[2].trim(),
      location: hiringMatch[3].trim(),
      fullTitle: cleanTitle,
    };
  }

  return {
    company: "N/A",
    position: cleanTitle,
    location: "N/A",
    fullTitle: cleanTitle,
  };
}

/**
 * Analyzes job description to extract relevant information
 */
export function analyzeJobDescription(description: string): JobAnalysis {
  const cleanText = description
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const lowerText = cleanText.toLowerCase();

  return {
    certifications: extractCertifications(cleanText),
    yearsExperience: extractYearsExperience(cleanText),
    expertise: extractExpertise(cleanText),
    jobType: identifyJobType(lowerText),
    companyType: identifyCompanyType(lowerText),
    keywords: extractKeywords(lowerText),
    academicDegrees: extractAcademicDegrees(cleanText),
    majors: extractMajors(cleanText),
    software: extractSoftware(cleanText),
    programmingSkills: extractProgrammingSkills(cleanText),
  };
}

function extractCertifications(text: string): string[] {
  const certifications: string[] = [];

  for (const { pattern } of certificationPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      certifications.push(...matches.map(m => m.trim()));
    }
  }

  return [...new Set(certifications)];
}

function extractYearsExperience(text: string): string {
  const expPatterns = [
    /(\d+)\+?\s*(?:to|\-|–)\s*(\d+)\+?\s*years?/i,
    /(\d+)\+?\s*years?/i,
    /minimum\s*(?:of\s*)?(\d+)\s*years?/i,
    /at\s*least\s*(\d+)\s*years?/i,
  ];

  for (const pattern of expPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[2] ? `${match[1]}-${match[2]} years` : `${match[1]}+ years`;
    }
  }

  return "";
}

function extractExpertise(text: string): string[] {
  const expertise: string[] = [];

  for (const [skill, pattern] of Object.entries(expertiseKeywords)) {
    if (pattern.test(text)) {
      expertise.push(skill);
    }
  }

  return [...new Set(expertise)].slice(0, 10);
}

function identifyJobType(lowerText: string): string {
  for (const { type, keywords } of jobTypes) {
    if (keywords.some(kw => lowerText.includes(kw.toLowerCase()))) {
      return type;
    }
  }

  return "General";
}

function identifyCompanyType(lowerText: string): string {
  for (const { type, keywords } of companyTypes) {
    if (keywords.some(kw => lowerText.includes(kw.toLowerCase()))) {
      return type;
    }
  }

  return "Unknown";
}

function extractKeywords(lowerText: string): string[] {
  const stopWords = new Set([
    'the', 'and', 'for', 'with', 'you', 'will', 'are', 'this',
    'from', 'that', 'have', 'been', 'our', 'your'
  ]);

  const words = lowerText.match(/\b[a-z]{3,}\b/g) || [];
  const wordFreq = words.reduce((acc, word) => {
    if (!stopWords.has(word)) {
      acc[word] = (acc[word] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([word]) => word);
}

function extractAcademicDegrees(text: string): string[] {
  const degrees: string[] = [];

  if (/\bPh\.?D\.?\b|\bDoctorate\b/gi.test(text)) degrees.push('PhD');
  if (/\bMBA\b/gi.test(text)) degrees.push('MBA');
  if (/\bMaster'?s?\b|\bM\.?S\.?c\.?\b/gi.test(text)) degrees.push("Master's");
  if (/\bBachelor'?s?\b|\bB\.?S\.?c?.?\b/gi.test(text)) degrees.push("Bachelor's");

  return [...new Set(degrees)];
}

function extractMajors(text: string): string[] {
  const majors: string[] = [];

  for (const [major, pattern] of Object.entries(majorKeywords)) {
    if (pattern.test(text)) {
      majors.push(major);
    }
  }

  return [...new Set(majors)];
}

function extractSoftware(text: string): string[] {
  const software: string[] = [];

  for (const [soft, pattern] of Object.entries(softwareKeywords)) {
    if (pattern.test(text)) {
      software.push(soft);
    }
  }

  return [...new Set(software)];
}

function extractProgrammingSkills(text: string): string[] {
  const skills: string[] = [];

  for (const [skill, pattern] of Object.entries(programmingKeywords)) {
    if (pattern.test(text)) {
      skills.push(skill);
    }
  }

  return [...new Set(skills)];
}
