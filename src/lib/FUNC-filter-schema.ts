import { z } from "zod";

/**
 * Shared Zod schema for a JFS filter condition. Lives in lib (not a route file)
 * because Next.js route modules may only export route handlers + config.
 */
export const conditionSchema = z.object({
  field: z.string().min(1).max(40),
  op: z.enum(["is", "has", "contains", "gte", "lte"]).default("is"),
  value: z.string().min(1).max(200),
  connector: z.enum(["AND", "OR"]).default("AND"),
});
