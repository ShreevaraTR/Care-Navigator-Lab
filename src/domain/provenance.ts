import { z } from "zod";

/**
 * Every piece of information shown in the lab is labelled with where it comes from.
 * This is the core accuracy safeguard: a trainee must always be able to tell an
 * actual plan rule apart from a general concept, a simulated fact, or an assumption.
 *
 * - plan_rule:       Taken from authoritative plan material (e.g. Remote Health USA documents
 *                    supplied by the user). MUST cite a registered plan source.
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
    /** Id of an entry in content/plan-sources. Required when kind === "plan_rule". */
    sourceRef: z.string().optional(),
    /** Section / page reference inside the source, if useful. */
    locator: z.string().optional(),
    note: z.string().optional(),
  })
  .refine((p) => p.kind !== "plan_rule" || !!p.sourceRef, {
    message: "plan_rule provenance must cite a sourceRef from the plan-sources registry",
  });
export type Provenance = z.infer<typeof ProvenanceSchema>;

export const SOURCE_KIND_LABELS: Record<SourceKind, string> = {
  plan_rule: "Plan rule",
  general_concept: "General concept",
  case_fact: "Simulated case fact",
  assumption: "Assumption",
};

/** Small helpers so content files stay readable. */
export const caseFact = (note?: string): Provenance => ({ kind: "case_fact", note });
export const generalConcept = (note?: string): Provenance => ({ kind: "general_concept", note });
export const assumption = (note?: string): Provenance => ({ kind: "assumption", note });
