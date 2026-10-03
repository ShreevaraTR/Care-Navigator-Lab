import { z } from "zod";

/**
 * Registry of AUTHORITATIVE plan material (e.g. Remote Health USA documents).
 *
 * This list is intentionally empty. Plan-specific rules must only enter the app by:
 *   1. adding the source document under docs/plan-sources/,
 *   2. registering it here,
 *   3. citing it via provenance { kind: "plan_rule", sourceRef: "<id>" }.
 *
 * Content validation fails if any plan_rule cites an id not registered here.
 */
export const PlanSourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  plan: z.string(),
  effectiveDate: z.string().optional(),
  /** Path under docs/plan-sources/ or an external URL. */
  location: z.string(),
  addedAt: z.string(),
});
export type PlanSource = z.infer<typeof PlanSourceSchema>;

export const planSources: PlanSource[] = [];
