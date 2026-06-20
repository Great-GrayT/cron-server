/**
 * Type definitions for multilingual location data
 */

export type Region = 'Europe' | 'America' | 'Middle East' | 'Asia' | 'Africa' | 'Oceania';

export interface CountryData {
  canonical: string;  // English canonical name
  region: Region;
  aliases: string[];  // All names in different languages
}

export interface CityData {
  canonical: string;  // English canonical name
  country: string;    // Country canonical name
  aliases: string[];  // All names in different languages
}

export interface PrepositionPattern {
  language: string;
  patterns: RegExp[];  // Patterns that indicate "in" or "at" location
}
