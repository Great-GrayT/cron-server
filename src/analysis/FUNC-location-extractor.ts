import { logger } from "@/lib/logger";
import {
  findCountry,
  findCity,
  findState,
  extractAfterPreposition,
  COUNTRY_BY_ALIAS,
  CITY_BY_ALIAS,
  STATE_BY_ALIAS,
  Region,
} from './dictionaries/locations';

export interface LocationData {
  country: string | null;
  city: string | null;
  region: Region | null;
}

/**
 * Normalize city names for consistent statistics
 * Removes common prefixes/suffixes and filters invalid city values
 */
export function normalizeCity(cityName: string | null): string | null {
  if (!cityName) return null;

  const normalized = cityName
    .replace(/\s+Area$/i, '')
    .replace(/^City of\s+/i, '')
    .replace(/^Greater\s+/i, '')
    .trim();

  // Filter out values that are actually countries/regions, not cities
  if (/^England$/i.test(normalized) ||
      /^Scotland$/i.test(normalized) ||
      /^Wales$/i.test(normalized) ||
      /^United Kingdom$/i.test(normalized)) {
    return null;
  }

  return normalized;
}

// Invalid location indicators
const INVALID_LOCATION_PATTERNS = [
  /^null$/i, /^unknown$/i, /^n\/a$/i, /^na$/i, /^not specified$/i,
  /^various$/i, /^remote$/i, /^anywhere$/i, /^global$/i, /^worldwide$/i,
  /^multiple$/i, /^hybrid$/i, /^flexible$/i, /^\s*$/,
];

/**
 * Location Extractor
 * Extracts country and city from location strings using comprehensive multilingual dictionary
 * Supports: English, Arabic, Chinese, German, French, Spanish, Portuguese, Russian,
 * Japanese, Korean, Hindi, Turkish, Persian/Farsi, Hebrew, and many more languages
 */
export class LocationExtractor {
  /**
   * Extract location from title, link, RSS location field, or description (in that order)
   */
  static extractLocation(
    title: string,
    link: string,
    location: string | undefined | null,
    description: string
  ): LocationData {
    // 1. Try to extract from location field first (most reliable)
    if (location && this.isValidLocation(location)) {
      const extracted = this.parseLocationString(location);
      if (extracted.country || extracted.city) {
        return extracted;
      }
    }

    // 2. Try to extract from title
    if (title) {
      const extracted = this.parseLocationString(title);
      if (extracted.country || extracted.city) {
        return extracted;
      }
    }

    // 3. Try to extract from link (LinkedIn URLs often have location)
    if (link) {
      const extracted = this.extractFromLink(link);
      if (extracted.country || extracted.city) {
        return extracted;
      }
    }

    // 4. If all else fails, try description
    return this.extractFromDescription(description);
  }

  /**
   * Check if location string is valid (not null, unknown, etc.)
   */
  private static isValidLocation(location: string): boolean {
    const trimmed = location.trim();

    // Check against invalid patterns
    for (const pattern of INVALID_LOCATION_PATTERNS) {
      if (pattern.test(trimmed)) {
        return false;
      }
    }

    return trimmed.length > 0;
  }

  /**
   * Parse a location string to extract country and city
   * Supports multilingual input
   */
  private static parseLocationString(locationStr: string): LocationData {
    const result: LocationData = {
      country: null,
      city: null,
      region: null,
    };

    // Clean up the location string
    const cleanLocation = locationStr.trim();
    if (!cleanLocation) return result;

    let parsed: LocationData;

    // Check if location contains comma (English or Arabic) - indicates structured format
    // Do this BEFORE direct match to preserve city,country structure
    if (cleanLocation.includes(',') || cleanLocation.includes('،')) {
      parsed = this.parseLocationWithComma(cleanLocation);
      if (parsed.country || parsed.city) {
        // Normalize city before returning
        parsed.city = normalizeCity(parsed.city);
        return parsed;
      }
    }

    // Try direct matching
    const directMatch = this.tryDirectMatch(cleanLocation);
    if (directMatch.country || directMatch.city) {
      directMatch.city = normalizeCity(directMatch.city);
      return directMatch;
    }

    // Try to find location after prepositions (e.g., "في دبي", "在北京", "in London")
    const afterPrepositions = extractAfterPreposition(cleanLocation);
    for (const potential of afterPrepositions) {
      const extracted = this.tryDirectMatch(potential);
      if (extracted.country || extracted.city) {
        extracted.city = normalizeCity(extracted.city);
        return extracted;
      }
    }

    // Try parsing without comma
    parsed = this.parseLocationWithoutComma(cleanLocation);
    parsed.city = normalizeCity(parsed.city);
    return parsed;
  }

  /**
   * Try to directly match the entire string against our dictionaries
   */
  private static tryDirectMatch(text: string): LocationData {
    const result: LocationData = {
      country: null,
      city: null,
      region: null,
    };

    const normalized = text.toLowerCase().trim();

    // Try country first
    const countryData = findCountry(normalized);
    if (countryData) {
      result.country = countryData.canonical;
      result.region = countryData.region;
      return result;
    }

    // Try city
    const cityData = findCity(normalized);
    if (cityData) {
      result.city = cityData.canonical;
      result.country = cityData.country;
      const countryInfo = findCountry(cityData.country);
      result.region = countryInfo?.region || null;
      return result;
    }

    // Try state/province
    const stateData = findState(normalized);
    if (stateData) {
      result.country = stateData.country;
      const countryInfo = findCountry(stateData.country);
      result.region = countryInfo?.region || null;
      return result;
    }

    return result;
  }

  /**
   * Parse location string WITH comma (e.g., "Bangkok, Thailand" or "Dallas, TX" or "دبي، الإمارات")
   */
  private static parseLocationWithComma(locationStr: string): LocationData {
    const result: LocationData = {
      country: null,
      city: null,
      region: null,
    };

    // Split by comma or Arabic comma
    const parts = locationStr
      .split(/[,،]/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (parts.length === 0) {
      return result;
    }

    // Get the last part (potential country or state)
    const lastPart = parts[parts.length - 1];
    const firstPart = parts[0];

    // STEP 1: Try to find country from the last part
    const countryData = findCountry(lastPart);
    if (countryData) {
      result.country = countryData.canonical;
      result.region = countryData.region;

      // Try to match first part as city
      const cityData = findCity(firstPart);
      if (cityData) {
        result.city = cityData.canonical;
      } else {
        // If city not in our dictionary, use the raw first part
        result.city = firstPart;
      }
      return result;
    }

    // STEP 2: Try state/province mapping for the last part
    const stateData = findState(lastPart);
    if (stateData) {
      result.country = stateData.country;
      const countryInfo = findCountry(stateData.country);
      result.region = countryInfo?.region || null;

      // Try to match first part as city
      const cityData = findCity(firstPart);
      if (cityData) {
        result.city = cityData.canonical;
      } else {
        result.city = firstPart;
      }
      return result;
    }

    // STEP 3: Try city mapping for the last part
    const lastCityData = findCity(lastPart);
    if (lastCityData) {
      result.country = lastCityData.country;
      const countryInfo = findCountry(lastCityData.country);
      result.region = countryInfo?.region || null;

      // First part is likely a more specific area
      const firstCityData = findCity(firstPart);
      if (firstCityData) {
        result.city = firstCityData.canonical;
      } else {
        result.city = firstPart;
      }
      return result;
    }

    // STEP 4: Try matching first part as city (handles cases like "San Francisco, Bay Area")
    const firstCityData = findCity(firstPart);
    if (firstCityData) {
      result.city = firstCityData.canonical;
      result.country = firstCityData.country;
      const countryInfo = findCountry(firstCityData.country);
      result.region = countryInfo?.region || null;
      return result;
    }

    // STEP 5: If we have 3+ parts, try middle combinations
    if (parts.length >= 3) {
      // Try second-to-last as state
      const middlePart = parts[parts.length - 2];
      const middleState = findState(middlePart);
      if (middleState) {
        result.country = middleState.country;
        const countryInfo = findCountry(middleState.country);
        result.region = countryInfo?.region || null;
        result.city = firstPart;
        return result;
      }
    }

    // STEP 6: No match found
    return result;
  }

  /**
   * Parse location string WITHOUT comma (e.g., "Thailand" or "Bangkok" or "北京" or "دبي")
   */
  private static parseLocationWithoutComma(locationStr: string): LocationData {
    const result: LocationData = {
      country: null,
      city: null,
      region: null,
    };

    // Try to match against our dictionaries
    const directMatch = this.tryDirectMatch(locationStr);
    if (directMatch.country || directMatch.city) {
      return directMatch;
    }

    // Try to find partial matches within the string
    // This handles cases like "Job in Dubai" or "工作在北京"
    const words = this.tokenizeMultilingual(locationStr);

    for (const word of words) {
      if (word.length < 2) continue;

      // Try country match
      const countryData = findCountry(word);
      if (countryData) {
        result.country = countryData.canonical;
        result.region = countryData.region;
        return result;
      }

      // Try city match
      const cityData = findCity(word);
      if (cityData) {
        result.city = cityData.canonical;
        result.country = cityData.country;
        const countryInfo = findCountry(cityData.country);
        result.region = countryInfo?.region || null;
        return result;
      }

      // Try state match
      const stateData = findState(word);
      if (stateData) {
        result.country = stateData.country;
        const countryInfo = findCountry(stateData.country);
        result.region = countryInfo?.region || null;
        return result;
      }
    }

    // Try multi-word combinations (for places like "New York", "San Francisco", "Abu Dhabi")
    for (let i = 0; i < words.length - 1; i++) {
      const twoWord = `${words[i]} ${words[i + 1]}`;
      const twoWordMatch = this.tryDirectMatch(twoWord);
      if (twoWordMatch.country || twoWordMatch.city) {
        return twoWordMatch;
      }

      // Try three-word combinations
      if (i < words.length - 2) {
        const threeWord = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
        const threeWordMatch = this.tryDirectMatch(threeWord);
        if (threeWordMatch.country || threeWordMatch.city) {
          return threeWordMatch;
        }
      }
    }

    return result;
  }

  /**
   * Tokenize text for multiple languages
   * Handles: Latin scripts, Arabic, Chinese, Japanese, Korean, etc.
   */
  private static tokenizeMultilingual(text: string): string[] {
    const tokens: string[] = [];

    // Split on common delimiters
    const basicTokens = text.split(/[\s\-–—_|:;()[\]{}""''«»「」『』]+/);

    for (const token of basicTokens) {
      if (!token) continue;

      // For CJK characters, we might want to keep them together
      // but also try individual characters for single-character place names
      const hasCJK = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(token);

      if (hasCJK) {
        // Add the whole token
        tokens.push(token);

        // For Chinese, try extracting 2-4 character sequences
        if (/[\u4e00-\u9fff]/.test(token)) {
          for (let i = 0; i < token.length; i++) {
            for (let len = 2; len <= Math.min(4, token.length - i); len++) {
              tokens.push(token.substring(i, i + len));
            }
          }
        }
      } else {
        tokens.push(token);
      }
    }

    return tokens.filter(t => t.length > 0);
  }

  /**
   * Extract location from LinkedIn URL
   * Pattern: /-in-{location}-{numbers}
   */
  private static extractFromLink(link: string): LocationData {
    const inIndex = link.indexOf('-in-');
    if (inIndex === -1) {
      return { country: null, city: null, region: null };
    }

    const afterIn = link.substring(inIndex + 4); // Skip '-in-'

    // Find end of location: first digit
    const digitMatch = afterIn.match(/\-\d/);
    if (!digitMatch || digitMatch.index === undefined) {
      return { country: null, city: null, region: null };
    }

    const locationPart = afterIn.substring(0, digitMatch.index);

    // Convert kebab-case to normal text
    const locationStr = locationPart
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .trim();

    // Parse the extracted location string
    return this.parseLocationString(locationStr);
  }

  /**
   * Extract location from job description text
   */
  private static extractFromDescription(description: string): LocationData {
    if (!description || description.trim().length === 0) {
      return { country: null, city: null, region: null };
    }

    // Clean HTML tags if present
    const cleanDesc = description.replace(/<[^>]*>/g, ' ');

    // Common patterns for location in descriptions (multilingual)
    const locationPatterns = [
      // English patterns
      /location[:\s]+([^.\n,]+)/gi,
      /based in[:\s]+([^.\n,]+)/gi,
      /office in[:\s]+([^.\n,]+)/gi,
      /situated in[:\s]+([^.\n,]+)/gi,
      /working from[:\s]+([^.\n,]+)/gi,
      /position in[:\s]+([^.\n,]+)/gi,
      /opportunity in[:\s]+([^.\n,]+)/gi,
      /headquarters in[:\s]+([^.\n,]+)/gi,

      // Arabic patterns
      /الموقع[:\s]+([^.\n،]+)/gi,
      /المكان[:\s]+([^.\n،]+)/gi,
      /المدينة[:\s]+([^.\n،]+)/gi,
      /في\s+([^.\n،]+)/gi,

      // Chinese patterns
      /位[于於]\s*([^。\n,，]+)/gi,
      /地[点點][：:]\s*([^。\n,，]+)/gi,
      /工作地[点點]\s*([^。\n,，]+)/gi,
      /在\s*([^。\n,，]+)/gi,

      // German patterns
      /Standort[:\s]+([^.\n,]+)/gi,
      /Arbeitsort[:\s]+([^.\n,]+)/gi,

      // French patterns
      /lieu[:\s]+([^.\n,]+)/gi,
      /localisation[:\s]+([^.\n,]+)/gi,
      /basé à[:\s]+([^.\n,]+)/gi,

      // Spanish patterns
      /ubicación[:\s]+([^.\n,]+)/gi,
      /ubicado en[:\s]+([^.\n,]+)/gi,

      // Russian patterns
      /местоположение[:\s]+([^.\n,]+)/gi,
      /город[:\s]+([^.\n,]+)/gi,

      // Japanese patterns
      /勤務地[：:]\s*([^。\n]+)/gi,
      /所在地[：:]\s*([^。\n]+)/gi,

      // Korean patterns
      /근무지[:\s]+([^.\n]+)/gi,
      /위치[:\s]+([^.\n]+)/gi,
    ];

    // Try each pattern
    for (const pattern of locationPatterns) {
      const matches = Array.from(cleanDesc.matchAll(pattern));
      for (const match of matches) {
        if (match[1]) {
          const extracted = this.parseLocationString(match[1].trim());
          if (extracted.country || extracted.city) {
            return extracted;
          }
        }
      }
    }

    // Try extracting from prepositions in the text
    const afterPrepositions = extractAfterPreposition(cleanDesc);
    for (const potential of afterPrepositions) {
      // Limit to reasonable length
      if (potential.length > 50) continue;

      const extracted = this.parseLocationString(potential);
      if (extracted.country || extracted.city) {
        return extracted;
      }
    }

    return { country: null, city: null, region: null };
  }

  /**
   * Get region for a country
   */
  static getRegionForCountry(country: string): Region | null {
    const countryData = findCountry(country);
    return countryData?.region || null;
  }

  /**
   * Format location for display
   */
  static formatLocation(locationData: LocationData): string {
    if (locationData.city && locationData.country) {
      return `${locationData.city}, ${locationData.country}`;
    } else if (locationData.city) {
      return locationData.city;
    } else if (locationData.country) {
      return locationData.country;
    }
    return 'Unknown Location';
  }

  /**
   * Check if a string might be a location (quick heuristic check)
   */
  static mightBeLocation(text: string): boolean {
    if (!text || text.length < 2) return false;

    const normalized = text.toLowerCase().trim();

    // Check if it's in our dictionaries
    if (COUNTRY_BY_ALIAS.has(normalized)) return true;
    if (CITY_BY_ALIAS.has(normalized)) return true;
    if (STATE_BY_ALIAS.has(normalized)) return true;

    return false;
  }
}
