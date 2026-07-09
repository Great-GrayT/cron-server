/**
 * Role Type Extractor
 * Fuzzy matches job titles and descriptions to role types from the dictionary
 */

import { roleTypes, RoleTypeDefinition, ROLE_CATEGORIES, RoleCategory } from './dictionaries/role-types';

export interface RoleTypeMatch {
  roleType: string;
  category: string;
  confidence: 'high' | 'medium' | 'low';
  matchedOn: 'title' | 'keywords' | 'description';
  score: number;
}

export class RoleTypeExtractor {
  /**
   * Extract the best matching role type from job data
   */
  static extractRoleType(
    title: string,
    keywords: string[] = [],
    description: string = '',
    industry: string = ''
  ): RoleTypeMatch | null {
    const matches: RoleTypeMatch[] = [];

    // Normalize inputs
    const normalizedTitle = title.toLowerCase().trim();
    const normalizedKeywords = keywords.map(k => k.toLowerCase().trim());
    const normalizedDescription = description.toLowerCase();
    const normalizedIndustry = industry.toLowerCase().trim();

    for (const roleTypeDef of roleTypes) {
      let score = 0;
      let matchedOn: 'title' | 'keywords' | 'description' = 'description';
      let highestMatch = 0;

      // 1. Check title patterns (highest priority)
      for (const pattern of roleTypeDef.titlePatterns) {
        if (pattern.test(title)) {
          const patternScore = 100;
          if (patternScore > highestMatch) {
            highestMatch = patternScore;
            matchedOn = 'title';
          }
        }
      }

      // 2. Check for exact/partial keyword matches in title
      for (const keyword of roleTypeDef.keywords) {
        const keywordLower = keyword.toLowerCase();

        // Exact match in title
        if (normalizedTitle.includes(keywordLower)) {
          const titleScore = 90 + (keywordLower.length / normalizedTitle.length) * 10;
          if (titleScore > highestMatch) {
            highestMatch = titleScore;
            matchedOn = 'title';
          }
        }
      }

      // 3. Check job keywords array
      for (const keyword of roleTypeDef.keywords) {
        const keywordLower = keyword.toLowerCase();

        for (const jobKeyword of normalizedKeywords) {
          if (jobKeyword.includes(keywordLower) || keywordLower.includes(jobKeyword)) {
            const keywordScore = 70;
            if (keywordScore > highestMatch) {
              highestMatch = keywordScore;
              matchedOn = 'keywords';
            }
          }
        }
      }

      // 4. Check description (lower priority, but consider keyword density)
      if (normalizedDescription.length > 0 && highestMatch < 70) {
        let descriptionMatches = 0;
        for (const keyword of roleTypeDef.keywords) {
          const keywordLower = keyword.toLowerCase();
          const regex = new RegExp(keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
          const matches = normalizedDescription.match(regex);
          if (matches) {
            descriptionMatches += matches.length;
          }
        }

        if (descriptionMatches > 0) {
          // Score based on keyword density in description
          const descriptionScore = Math.min(60, 30 + descriptionMatches * 5);
          if (descriptionScore > highestMatch) {
            highestMatch = descriptionScore;
            matchedOn = 'description';
          }
        }
      }

      // 5. Category/Industry boost
      if (highestMatch > 0 && normalizedIndustry) {
        const categoryLower = roleTypeDef.category.toLowerCase();
        if (categoryLower.includes(normalizedIndustry) || normalizedIndustry.includes(categoryLower.split(' ')[0])) {
          highestMatch += 5;
        }
      }

      score = highestMatch;

      if (score > 0) {
        matches.push({
          roleType: roleTypeDef.roleType,
          category: roleTypeDef.category,
          confidence: score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low',
          matchedOn,
          score,
        });
      }
    }

    // Sort by score and return the best match
    matches.sort((a, b) => b.score - a.score);

    if (matches.length > 0 && matches[0].score >= 30) {
      return matches[0];
    }

    // Try fallback matching based on common title patterns
    const fallbackMatch = this.fallbackMatch(normalizedTitle, normalizedIndustry);
    if (fallbackMatch) {
      return fallbackMatch;
    }

    return null;
  }

  /**
   * Fallback matching for common patterns not in the dictionary
   */
  private static fallbackMatch(title: string, industry: string): RoleTypeMatch | null {
    // Generic title-word fallbacks. Order matters — more specific/occupational
    // words first, ambiguous ones (engineer/analyst/manager) last so they don't
    // shadow a clearer signal. Deliberately NOT finance/tech-defaulted: a bare
    // "Engineer" is generic Engineering, not Software Engineering.
    const patterns: Array<{ pattern: RegExp; roleType: string; category: string }> = [
      // Occupational — unambiguous, route to their own sector
      { pattern: /\b(?:hgv|lgv|van|truck|bus|delivery)\s*driver\b|\bdriver\b/i, roleType: 'Driver', category: 'Transportation & Logistics' },
      { pattern: /\bwarehouse\b|\bforklift\b|\bpicker\b/i, roleType: 'Warehouse Operative', category: 'Transportation & Logistics' },
      { pattern: /\bchef\b|\bcook\b/i, roleType: 'Chef & Kitchen', category: 'Hospitality & Food Service' },
      { pattern: /\bcleaner\b|\bhousekeep/i, roleType: 'Housekeeping & Cleaning', category: 'Hospitality & Food Service' },
      { pattern: /\belectrician\b/i, roleType: 'Electrician', category: 'Skilled Trades' },
      { pattern: /\bplumb(?:er|ing)\b/i, roleType: 'Plumbing & Heating', category: 'Skilled Trades' },
      { pattern: /\bwelder\b|\bfabricator\b/i, roleType: 'Welding & Fabrication', category: 'Skilled Trades' },
      { pattern: /\bmechanic\b/i, roleType: 'Vehicle Mechanic', category: 'Skilled Trades' },
      { pattern: /\blabourer\b|\bgroundworker\b/i, roleType: 'Construction Trades & Labour', category: 'Construction & Property' },
      { pattern: /\boperative\b|\bmachinist\b|\bcnc\b/i, roleType: 'Production Operative', category: 'Manufacturing & Production' },
      { pattern: /\btechnician\b/i, roleType: 'Maintenance Technician', category: 'Manufacturing & Production' },
      { pattern: /\bsurveyor\b/i, roleType: 'Surveying', category: 'Construction & Property' },
      { pattern: /\bfarm(?:er|hand)?\b|\bagricultural\b/i, roleType: 'Farm Work', category: 'Agriculture & Environment' },
      { pattern: /\bcarer\b|care\s*(?:worker|assistant)|support\s*worker/i, roleType: 'Care Work', category: 'Care & Social Services' },
      { pattern: /\bnurse\b/i, roleType: 'Nursing', category: 'Healthcare & Life Sciences' },
      { pattern: /\bteacher\b|\btutor\b/i, roleType: 'Teaching & Education', category: 'Education & Training' },
      { pattern: /\blawyer\b|\battorney\b|\bsolicitor\b/i, roleType: 'Legal Counsel', category: 'Other Professional' },
      { pattern: /\baccountant\b/i, roleType: 'Accounting', category: 'Corporate Finance & Accounting' },
      { pattern: /\bHR\b|\bhuman resources\b|\brecruiter\b/i, roleType: 'Human Resources', category: 'Other Professional' },
      { pattern: /\bwriter\b/i, roleType: 'Content Marketing', category: 'Marketing & Communications' },
      { pattern: /\beditor\b/i, roleType: 'Creative & Media', category: 'Other Professional' },
      { pattern: /\bdeveloper\b|\bprogrammer\b/i, roleType: 'Software Engineering', category: 'Software Engineering' },
      { pattern: /\bscientist\b|\bresearch/i, roleType: 'Scientific Research', category: 'Research & Science' },
      { pattern: /\bdesigner\b/i, roleType: 'Product Design', category: 'Product & Design' },
      { pattern: /\bsales\b/i, roleType: 'Sales Representative', category: 'Sales & Business Development' },
      { pattern: /\bmarketing\b/i, roleType: 'Digital Marketing', category: 'Marketing & Communications' },
      { pattern: /\bconsultant\b/i, roleType: 'Management Consulting', category: 'Consulting & Advisory' },
      // Ambiguous — routed by industry below, otherwise sector-neutral defaults
      { pattern: /\bengineer\b/i, roleType: 'Process & Manufacturing Engineering', category: 'Manufacturing & Production' },
      { pattern: /\banalyst\b/i, roleType: 'Data Analysis', category: 'Data & Analytics' },
      { pattern: /\bmanager\b/i, roleType: 'Operations Management', category: 'Operations & Project Management' },
      { pattern: /\bdirector\b/i, roleType: 'Executive Leadership', category: 'Other Professional' },
      { pattern: /\bsupport\b/i, roleType: 'Customer Service', category: 'Other Professional' },
    ];

    for (const { pattern, roleType, category } of patterns) {
      if (pattern.test(title)) {
        let adjustedRoleType = roleType;
        let adjustedCategory = category;

        // Only the genuinely ambiguous words (engineer/analyst/research) get
        // re-routed by the job's industry, so context resolves them instead of a
        // hard-coded finance/tech default.
        if (industry) {
          const isSoftwareIndustry =
            industry.includes('software') || industry.includes('cloud') ||
            industry.includes('cyber') || industry.includes('data') ||
            industry.includes('it ') || industry.includes('semiconductor');
          const isFinanceIndustry =
            industry.includes('bank') || industry.includes('invest') ||
            industry.includes('capital') || industry.includes('asset') ||
            industry.includes('insurance') || industry.includes('fintech') ||
            industry.includes('lending');
          const isHealthIndustry =
            industry.includes('hospital') || industry.includes('medical') ||
            industry.includes('health') || industry.includes('clinical') ||
            industry.includes('biotech') || industry.includes('pharma');

          if (/\bengineer\b/i.test(title)) {
            if (isSoftwareIndustry) { adjustedRoleType = 'Software Engineering'; adjustedCategory = 'Software Engineering'; }
            else if (isFinanceIndustry) { adjustedRoleType = 'Financial Engineering'; adjustedCategory = 'Quantitative Finance'; }
          }
          if (/\banalyst\b/i.test(title)) {
            if (isFinanceIndustry) { adjustedRoleType = 'Financial Analysis'; adjustedCategory = 'Corporate Finance & Accounting'; }
            else if (isHealthIndustry) { adjustedRoleType = 'Clinical Research'; adjustedCategory = 'Healthcare & Life Sciences'; }
          }
          if (/\bresearch/i.test(title) && isHealthIndustry) {
            adjustedRoleType = 'Clinical Research'; adjustedCategory = 'Healthcare & Life Sciences';
          }
        }

        return {
          roleType: adjustedRoleType,
          category: adjustedCategory,
          confidence: 'low',
          matchedOn: 'title',
          score: 35,
        };
      }
    }

    return null;
  }

  /**
   * Get all available role types
   */
  static getAllRoleTypes(): string[] {
    return roleTypes.map(rt => rt.roleType);
  }

  /**
   * Get all categories
   */
  static getAllCategories(): readonly string[] {
    return ROLE_CATEGORIES;
  }

  /**
   * Get role types by category
   */
  static getRoleTypesByCategory(category: RoleCategory): RoleTypeDefinition[] {
    return roleTypes.filter(rt => rt.category === category);
  }

  /**
   * Validate if a role type exists
   */
  static isValidRoleType(roleType: string): boolean {
    return roleTypes.some(rt => rt.roleType.toLowerCase() === roleType.toLowerCase());
  }

  /**
   * Get the category for a role type
   */
  static getCategoryForRoleType(roleType: string): string | null {
    const rt = roleTypes.find(r => r.roleType.toLowerCase() === roleType.toLowerCase());
    return rt ? rt.category : null;
  }
}
