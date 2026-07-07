/**
 * Minimal 5-field cron matcher (no dependency): "minute hour dom month dow".
 * Supports wildcard, step (slash-n), range (a-b), list (a,b) and combinations.
 * dow: 0-6 (0 = Sunday). Granularity is one minute (the tick resolution).
 */

function parseField(field: string, min: number, max: number): Set<number> {
  const out = new Set<number>();
  for (const part of field.split(",")) {
    const [rangePart, stepPart] = part.split("/");
    const step = stepPart ? parseInt(stepPart, 10) : 1;
    let lo = min;
    let hi = max;
    if (rangePart !== "*") {
      const [a, b] = rangePart.split("-");
      lo = parseInt(a, 10);
      hi = b !== undefined ? parseInt(b, 10) : lo;
    }
    if (Number.isNaN(lo) || Number.isNaN(hi) || Number.isNaN(step) || step < 1) continue;
    for (let v = lo; v <= hi; v += step) {
      if (v >= min && v <= max) out.add(v);
    }
  }
  return out;
}

/**
 * True if `date`'s UTC hour falls within an hour spec (e.g. "8-21", "0,12",
 * "*"). Reuses the same field grammar. Used to gate the global pipeline to an
 * active window regardless of what the external scheduler is configured to do.
 */
export function hoursMatch(hourSpec: string, date: Date): boolean {
  return parseField(hourSpec, 0, 23).has(date.getUTCHours());
}

/** True if `expr` is a syntactically valid 5-field cron. */
export function isValidCron(expr: string): boolean {
  const f = expr.trim().split(/\s+/);
  if (f.length !== 5) return false;
  const bounds: [number, number][] = [
    [0, 59], [0, 23], [1, 31], [1, 12], [0, 6],
  ];
  return f.every((field, i) => parseField(field, bounds[i][0], bounds[i][1]).size > 0);
}

/** True if `date` (UTC) satisfies the cron expression. */
export function matchesCron(expr: string, date: Date): boolean {
  const f = expr.trim().split(/\s+/);
  if (f.length !== 5) return false;
  const minute = parseField(f[0], 0, 59);
  const hour = parseField(f[1], 0, 23);
  const dom = parseField(f[2], 1, 31);
  const month = parseField(f[3], 1, 12);
  const dow = parseField(f[4], 0, 6);

  const dowMatch = dow.has(date.getUTCDay());
  const domMatch = dom.has(date.getUTCDate());
  // Standard cron: when both dom and dow are restricted, either matching counts.
  const domRestricted = f[2] !== "*";
  const dowRestricted = f[4] !== "*";
  const dayOk =
    domRestricted && dowRestricted ? domMatch || dowMatch : domMatch && dowMatch;

  return (
    minute.has(date.getUTCMinutes()) &&
    hour.has(date.getUTCHours()) &&
    month.has(date.getUTCMonth() + 1) &&
    dayOk
  );
}
