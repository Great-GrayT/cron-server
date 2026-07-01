import { certificationPatterns } from "@/analysis/dictionaries/certifications";
import { softwareKeywords } from "@/analysis/dictionaries/software";
import { programmingKeywords } from "@/analysis/dictionaries/programming-languages";
import { expertiseKeywords } from "@/analysis/dictionaries/expertise";
import { ROLE_CATEGORIES, allRoleTypeNames } from "@/analysis/dictionaries/role-types";
import { COUNTRY_BY_CANONICAL } from "@/analysis/dictionaries/locations/countries";

/**
 * JFS filter field metadata + dictionary value lookup.
 *
 * The dictionaries are large, so the frontend never loads them — it searches
 * server-side via searchFieldValues (type-ahead). Fields are `dict` (pick from a
 * dictionary), `text` (free text), or `number` (numeric range).
 */

export type FieldKind = "dict" | "text" | "number";

export interface FieldMeta {
  field: string;
  label: string;
  kind: FieldKind;
  ops: string[]; // allowed match operators for this field
}

export const FILTER_FIELDS: FieldMeta[] = [
  { field: "industry", label: "Industry", kind: "dict", ops: ["is"] },
  { field: "seniority", label: "Seniority", kind: "dict", ops: ["is"] },
  { field: "roleCategory", label: "Role Category", kind: "dict", ops: ["is"] },
  { field: "roleType", label: "Role Type", kind: "dict", ops: ["is"] },
  { field: "certificate", label: "Certificate", kind: "dict", ops: ["has"] },
  { field: "keyword", label: "Keyword / Skill", kind: "dict", ops: ["has"] },
  { field: "software", label: "Software", kind: "dict", ops: ["has"] },
  { field: "programming", label: "Programming", kind: "dict", ops: ["has"] },
  { field: "country", label: "Country", kind: "dict", ops: ["is"] },
  { field: "region", label: "Region", kind: "dict", ops: ["is"] },
  { field: "company", label: "Company", kind: "text", ops: ["is", "contains"] },
  { field: "title", label: "Title contains", kind: "text", ops: ["contains"] },
  { field: "experience", label: "Experience (years)", kind: "number", ops: ["gte", "lte"] },
  { field: "salary", label: "Salary", kind: "number", ops: ["gte", "lte"] },
];

const INDUSTRIES = [
  "Finance", "Technology", "Healthcare", "Consulting", "Manufacturing", "Retail",
  "RealEstate", "Energy", "Telecommunications", "Insurance", "Education", "Government",
  "Nonprofit", "Media", "Legal", "Accounting", "Marketing", "DataScience", "Other",
];
const SENIORITIES = ["Entry", "Mid", "Senior", "Management", "Executive"];
const REGIONS = ["Europe", "America", "Middle East", "Asia", "Africa", "Oceania"];

// Lazy so the big dictionaries aren't walked until a field is actually searched.
const VALUE_SOURCES: Record<string, () => string[]> = {
  industry: () => INDUSTRIES,
  seniority: () => SENIORITIES,
  region: () => REGIONS,
  roleCategory: () => [...ROLE_CATEGORIES],
  roleType: () => allRoleTypeNames,
  certificate: () => certificationPatterns.map((c) => c.name),
  keyword: () => Object.keys(expertiseKeywords),
  software: () => Object.keys(softwareKeywords),
  programming: () => Object.keys(programmingKeywords),
  country: () => Array.from(COUNTRY_BY_CANONICAL.keys()),
};

export function fieldHasDictionary(field: string): boolean {
  return field in VALUE_SOURCES;
}

/** Server-side type-ahead over a field's dictionary. Prefix matches rank first. */
export function searchFieldValues(field: string, q: string, limit = 30): string[] {
  const src = VALUE_SOURCES[field];
  if (!src) return [];
  const all = src();
  const query = q.trim().toLowerCase();
  const matched = query ? all.filter((v) => v.toLowerCase().includes(query)) : all;
  const sorted = [...matched].sort((a, b) => {
    if (query) {
      const ap = a.toLowerCase().startsWith(query) ? 0 : 1;
      const bp = b.toLowerCase().startsWith(query) ? 0 : 1;
      if (ap !== bp) return ap - bp;
    }
    return a.localeCompare(b);
  });
  return Array.from(new Set(sorted)).slice(0, Math.min(Math.max(limit, 1), 100));
}
