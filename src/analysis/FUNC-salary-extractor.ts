/**
 * Salary Extractor Utility
 *
 * Extracts salary/compensation information from job descriptions
 * Supports multiple currencies and formats
 */

export interface SalaryData {
  min: number | null;
  max: number | null;
  currency: string;
  period: 'year' | 'month' | 'hour' | 'unknown';
  raw: string;
  confidence: 'high' | 'medium' | 'low';
}

export class SalaryExtractor {
  // Currency symbols and codes
  private static readonly CURRENCY_MAP: Record<string, string> = {
    '$': 'USD',
    '€': 'EUR',
    '£': 'GBP',
    '¥': 'JPY',
    '₹': 'INR',
    'USD': 'USD',
    'EUR': 'EUR',
    'GBP': 'GBP',
    'CAD': 'CAD',
    'AUD': 'AUD',
    'CHF': 'CHF',
    'SGD': 'SGD',
  };

  // Salary extraction patterns (order matters - more specific patterns first)
  private static readonly SALARY_PATTERNS = [
    // Range patterns: $50,000 - $70,000, £45k-60k, 100-120K USD
    {
      regex: /([£$€¥₹]|USD|EUR|GBP|CAD|AUD)\s*(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)\s*[-–—to]\s*([£$€¥₹]|USD|EUR|GBP|CAD|AUD)?\s*(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)\s*(k|K|thousand|mil|million)?/g,
      type: 'range',
      confidence: 'high' as const,
    },
    // Range with k suffix on both numbers: $50k - $70k, £45k-£60k
    {
      regex: /([£$€¥₹]|USD|EUR|GBP|CAD|AUD)\s*(\d{1,3}(?:\.\d{1,2})?)\s*(k|K)\s*[-–—to]\s*([£$€¥₹]|USD|EUR|GBP|CAD|AUD)?\s*(\d{1,3}(?:\.\d{1,2})?)\s*(k|K)/gi,
      type: 'range-k-both',
      confidence: 'high' as const,
    },
    // Range with "between": between $50k and $70k
    {
      regex: /between\s+([£$€¥₹]|USD|EUR|GBP|CAD|AUD)?\s*(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)\s*(k|K|thousand)?\s+and\s+([£$€¥₹]|USD|EUR|GBP|CAD|AUD)?\s*(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)\s*(k|K|thousand)?/gi,
      type: 'range-between',
      confidence: 'high' as const,
    },
    // Per annum patterns: £70,000 per annum, $80k p.a., €65,000 annually
    {
      regex: /([£$€¥₹]|USD|EUR|GBP|CAD|AUD)\s*(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)\s*(k|K|thousand)?\s*(?:per annum|p\.?a\.?|annually|\/year|\/yr|per year)/gi,
      type: 'annual-single',
      confidence: 'high' as const,
    },
    // Up to patterns: up to $70k, max £60,000
    {
      regex: /(?:up to|max|maximum|upto)\s+([£$€¥₹]|USD|EUR|GBP|CAD|AUD)?\s*(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)\s*(k|K|thousand|mil)?/gi,
      type: 'max-only',
      confidence: 'medium' as const,
    },
    // Starting from: starting from $50k, minimum £45,000
    {
      regex: /(?:starting from|from|minimum|min|starting at)\s+([£$€¥₹]|USD|EUR|GBP|CAD|AUD)?\s*(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)\s*(k|K|thousand|mil)?/gi,
      type: 'min-only',
      confidence: 'medium' as const,
    },
    // Single value with explicit salary keyword: salary: $60k, compensation $70,000
    {
      regex: /(?:salary|compensation|pay|package|remuneration|base)(?:\s*:|\s+of|\s+is|\s+range)?\s*([£$€¥₹]|USD|EUR|GBP|CAD|AUD)?\s*(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)\s*(k|K|thousand|mil)?/gi,
      type: 'single',
      confidence: 'medium' as const,
    },
    // OTE patterns: OTE $100k, On Target Earnings £80,000
    {
      regex: /(?:OTE|on.target.earnings?)\s*(?:of|:)?\s*([£$€¥₹]|USD|EUR|GBP|CAD|AUD)?\s*(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)\s*(k|K|thousand|mil)?/gi,
      type: 'single',
      confidence: 'medium' as const,
    },
    // Compact range: $50-70k, €45-60K
    {
      regex: /([£$€¥₹])\s*(\d{1,3})(?:\.\d{1,2})?\s*[-–]\s*(\d{1,3})(?:\.\d{1,2})?\s*(k|K)/g,
      type: 'compact-range',
      confidence: 'high' as const,
    },
    // Currency after number: 50,000 USD, 70k GBP, 60,000 EUR per year
    {
      regex: /(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)\s*(k|K|thousand)?\s*(USD|EUR|GBP|CAD|AUD|CHF|SGD)/gi,
      type: 'currency-after',
      confidence: 'medium' as const,
    },
  ];

  // Period detection patterns
  private static readonly PERIOD_PATTERNS = {
    year: /\b(year|yearly|annual|annually|per annum|p\.a\.|pa|\/year|\/yr)\b/i,
    month: /\b(month|monthly|per month|\/month|\/mo)\b/i,
    hour: /\b(hour|hourly|per hour|\/hour|\/hr)\b/i,
  };

  /**
   * Extract salary data from job title and description
   */
  public static extractSalary(title: string, description: string): SalaryData | null {
    const combinedText = `${title} ${description}`;

    // Try each pattern in order
    for (const pattern of this.SALARY_PATTERNS) {
      const matches = Array.from(combinedText.matchAll(pattern.regex));

      for (const match of matches) {
        const result = this.parseMatch(match, pattern.type, pattern.confidence);

        if (result) {
          // Detect period
          result.period = this.detectPeriod(combinedText, match.index || 0);
          return result;
        }
      }
    }

    return null;
  }

  /**
   * Parse a regex match into SalaryData
   */
  private static parseMatch(
    match: RegExpMatchArray,
    type: string,
    confidence: 'high' | 'medium' | 'low'
  ): SalaryData | null {
    try {
      let currency = 'USD';
      let min: number | null = null;
      let max: number | null = null;

      switch (type) {
        case 'range': {
          // Groups: [full, currency1, num1, currency2?, num2, multiplier?]
          currency = this.normalizeCurrency(match[1] || match[3]);
          min = this.parseNumber(match[2], match[5]);
          max = this.parseNumber(match[4], match[5]);
          break;
        }

        case 'range-between': {
          // Groups: [full, currency1?, num1, multiplier1?, currency2?, num2, multiplier2?]
          currency = this.normalizeCurrency(match[1] || match[4]);
          min = this.parseNumber(match[2], match[3]);
          max = this.parseNumber(match[5], match[6]);
          break;
        }

        case 'max-only': {
          // Groups: [full, currency?, num, multiplier?]
          currency = this.normalizeCurrency(match[1]);
          max = this.parseNumber(match[2], match[3]);
          break;
        }

        case 'min-only': {
          // Groups: [full, currency?, num, multiplier?]
          currency = this.normalizeCurrency(match[1]);
          min = this.parseNumber(match[2], match[3]);
          break;
        }

        case 'single': {
          // Groups: [full, currency?, num, multiplier?]
          currency = this.normalizeCurrency(match[1]);
          const value = this.parseNumber(match[2], match[3]);
          min = value;
          max = value;
          break;
        }

        case 'compact-range': {
          // Groups: [full, currency, num1, num2, multiplier]
          currency = this.normalizeCurrency(match[1]);
          min = this.parseNumber(match[2], match[4]);
          max = this.parseNumber(match[3], match[4]);
          break;
        }

        case 'range-k-both': {
          // Groups: [full, currency1, num1, k1, currency2?, num2, k2]
          currency = this.normalizeCurrency(match[1] || match[4]);
          min = this.parseNumber(match[2], match[3]);
          max = this.parseNumber(match[5], match[6]);
          break;
        }

        case 'annual-single': {
          // Groups: [full, currency, num, multiplier?]
          currency = this.normalizeCurrency(match[1]);
          const value = this.parseNumber(match[2], match[3]);
          min = value;
          max = value;
          break;
        }

        case 'currency-after': {
          // Groups: [full, num, multiplier?, currency]
          currency = this.normalizeCurrency(match[3]);
          const value = this.parseNumber(match[1], match[2]);
          min = value;
          max = value;
          break;
        }
      }

      // Validate extracted data
      if (min === null && max === null) {
        return null;
      }

      // Ensure min < max
      if (min !== null && max !== null && min > max) {
        [min, max] = [max, min];
      }

      // Filter out unrealistic salaries (likely false positives)
      if (min !== null && (min < 1000 || min > 10000000)) {
        return null;
      }
      if (max !== null && (max < 1000 || max > 10000000)) {
        return null;
      }

      return {
        min,
        max,
        currency,
        period: 'unknown',
        raw: match[0],
        confidence,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Normalize currency symbol/code to standard code
   */
  private static normalizeCurrency(currency: string | undefined): string {
    if (!currency) return 'USD';
    const normalized = currency.trim().toUpperCase();
    return this.CURRENCY_MAP[normalized] || this.CURRENCY_MAP[currency] || 'USD';
  }

  /**
   * Parse number string with optional multiplier (k, thousand, mil)
   */
  private static parseNumber(numStr: string, multiplier?: string): number {
    // Remove commas and spaces
    const cleaned = numStr.replace(/[,\s]/g, '');
    let value = parseFloat(cleaned);

    if (isNaN(value)) {
      return 0;
    }

    // Apply multiplier
    if (multiplier) {
      const mult = multiplier.toLowerCase();
      if (mult === 'k' || mult.includes('thousand')) {
        value *= 1000;
      } else if (mult.includes('mil')) {
        value *= 1000000;
      }
    }

    return Math.round(value);
  }

  /**
   * Detect salary period (year, month, hour) from context
   */
  private static detectPeriod(
    text: string,
    matchPosition: number
  ): 'year' | 'month' | 'hour' | 'unknown' {
    // Look at text around the match (±50 chars)
    const contextStart = Math.max(0, matchPosition - 50);
    const contextEnd = Math.min(text.length, matchPosition + 100);
    const context = text.slice(contextStart, contextEnd);

    // Check for period keywords
    if (this.PERIOD_PATTERNS.year.test(context)) {
      return 'year';
    }
    if (this.PERIOD_PATTERNS.month.test(context)) {
      return 'month';
    }
    if (this.PERIOD_PATTERNS.hour.test(context)) {
      return 'hour';
    }

    // Default assumption: annual for high values, hourly for low values
    const avgValue = matchPosition; // Placeholder, actual value would be extracted
    return 'year'; // Default to annual for most job postings
  }

  /**
   * Convert salary to annual equivalent
   */
  public static normalizeToAnnual(salary: SalaryData): SalaryData {
    const multipliers = {
      year: 1,
      month: 12,
      hour: 2080, // Standard work year: 40 hours/week * 52 weeks
      unknown: 1,
    };

    const multiplier = multipliers[salary.period];

    return {
      ...salary,
      min: salary.min ? Math.round(salary.min * multiplier) : null,
      max: salary.max ? Math.round(salary.max * multiplier) : null,
      period: 'year',
    };
  }

  /**
   * Get midpoint salary (average of min and max)
   */
  public static getMidpoint(salary: SalaryData): number | null {
    if (salary.min !== null && salary.max !== null) {
      return Math.round((salary.min + salary.max) / 2);
    }
    return salary.min || salary.max;
  }

  /**
   * Format salary for display
   */
  public static formatSalary(salary: SalaryData): string {
    const formatNum = (num: number) => {
      if (num >= 1000) {
        return `${(num / 1000).toFixed(0)}k`;
      }
      return num.toLocaleString();
    };

    const currencySymbol = Object.keys(this.CURRENCY_MAP).find(
      key => this.CURRENCY_MAP[key] === salary.currency
    ) || salary.currency;

    if (salary.min !== null && salary.max !== null && salary.min !== salary.max) {
      return `${currencySymbol}${formatNum(salary.min)}-${formatNum(salary.max)}`;
    }

    const value = salary.min || salary.max;
    return value ? `${currencySymbol}${formatNum(value)}` : 'N/A';
  }

  /**
   * Extract and normalize salary to annual USD equivalent
   * This is useful for cross-currency comparisons
   */
  public static extractAndNormalize(
    title: string,
    description: string,
    targetCurrency: string = 'USD'
  ): SalaryData | null {
    const salary = this.extractSalary(title, description);
    if (!salary) return null;

    // Normalize to annual
    const annual = this.normalizeToAnnual(salary);

    // TODO: Add currency conversion if needed
    // For now, just return annual value
    return annual;
  }
}
