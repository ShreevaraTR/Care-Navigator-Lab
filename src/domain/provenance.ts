import { z } from "zod";

/**
 * Every piece of information shown in the lab is labelled with where it comes from.
 * This is the core accuracy safeguard: a trainee must always be able to tell an
 * actual plan rule apart from a general concept, a simulated fact, or an assumption.
 *
 * - plan_rule:       Directly supported by official plan material. MUST cite a rule id from the
 *                    plan knowledge base (content/plan-knowledge), which carries the source citation.
 * - general_concept: Widely applicable U.S. health insurance concept, not specific to any plan.
 * - case_fact:       Fictional fact invented for this simulation.
 * - assumption:      Something the case asks the trainee to assume, or a simplification.
 */
export const SOURCE_KINDS = ["plan_rule", "general_concept", "case_fact", "assumption"] as const;
export const SourceKindSchema = z.enum(SOURCE_KINDS);
export type SourceKind = z.infer<typeof SourceKindSchema>;

export const ProvenanceSchema = z
  .object({
    kind: SourceKindSchema,
    /** Plan knowledge-base rule id (e.g. "rhus.benefit.diagnostic_mri"). Required when kind === "plan_rule". */
    ruleId: z.string().optional(),
    note: z.string().optional(),
  })
  .refine((p) => p.kind !== "plan_rule" || !!p.ruleId, {
    message: "plan_rule provenance must cite a ruleId from the plan knowledge base",
  });
export type Provenance = z.infer<typeof ProvenanceSchema>;

export const SOURCE_KIND_LABELS: Record<SourceKind, string> = {
  plan_rule: "Plan rule (official)",
  general_concept: "General concept",
  case_fact: "Simulated case fact",
  assumption: "Assumption",
};

/** Small helpers so content files stay readable. */
export const planRule = (ruleId: string, note?: string): Provenance => ({ kind: "plan_rule", ruleId, note });
export const caseFact = (note?: string): Provenance => ({ kind: "case_fact", note });
export const generalConcept = (note?: string): Provenance => ({ kind: "general_concept", note });
export const assumption = (note?: string): Provenance => ({ kind: "assumption", note });
