/**
 * Structured, traceable JSON logger.
 *
 * Every line is a single JSON object tagged with `traceId`, so an engineer can
 * grep one cron run from ingress through every analysis step. Plain
 * `console.log` of free-form strings is intentionally avoided.
 */

type Level = "debug" | "info" | "warn" | "error";

const LEVEL_ORDER: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };

function threshold(): number {
  const configured = (process.env.LOG_LEVEL ?? "info").toLowerCase() as Level;
  return LEVEL_ORDER[configured] ?? LEVEL_ORDER.info;
}

/** Keys whose values must never reach the logs (basic PII / secret sanitisation). */
const REDACT_KEYS = new Set(["authorization", "cron_secret", "password", "token", "databaseUrl", "database_url"]);

function sanitise(meta: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(meta)) {
    out[key] = REDACT_KEYS.has(key.toLowerCase()) ? "[redacted]" : value;
  }
  return out;
}

function emit(level: Level, traceId: string, message: string, meta: Record<string, unknown>): void {
  if (LEVEL_ORDER[level] < threshold()) return;
  const line = {
    level,
    time: new Date().toISOString(),
    traceId,
    message,
    ...sanitise(meta),
  };
  // One JSON object per line — pipe-friendly for log shippers.
  const serialised = JSON.stringify(line);
  if (level === "error") process.stderr.write(serialised + "\n");
  else process.stdout.write(serialised + "\n");
}

/** A logger pre-bound to a traceId so steps don't re-pass it every call. */
export interface Logger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}

export function createLogger(traceId: string): Logger {
  return {
    debug: (m, meta = {}) => emit("debug", traceId, m, meta),
    info: (m, meta = {}) => emit("info", traceId, m, meta),
    warn: (m, meta = {}) => emit("warn", traceId, m, meta),
    error: (m, meta = {}) => emit("error", traceId, m, meta),
  };
}

/**
 * Backwards-compatible variadic logger used by the ported pipeline libs, which
 * call `logger.info(message, ...args)`. Extra args are folded into the
 * structured `args` field so output stays single-line JSON (traceId "system").
 */
function variadic(level: Level) {
  return (message: string, ...args: unknown[]): void => {
    emit(level, "system", message, args.length > 0 ? { args } : {});
  };
}

export const logger = {
  info: variadic("info"),
  warn: variadic("warn"),
  error: variadic("error"),
  debug: variadic("debug"),
};
