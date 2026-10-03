import { z } from "zod";

/**
 * Source-controlled plan knowledge.
 *
 * Hierarchy (highest authority first):
 *   1. Summary Plan Description (SPD): the governing document. Not yet obtained.
 *   2. Official benefits overview: SafetyWing's readable summary of the SPD.
 *   3. Official public plan page: marketing page incl. legal disclosure and FAQ.
 * Anything not traceable to one of these is NOT a plan rule. It must be a general
 * concept, a simulated case fact, or an assumption.
 */

export const SourceAuthoritySchema = z.enum(["spd", "benefits_overview", "public_page"]);
export type SourceAuthority = z.infer<typeof SourceAuthoritySchema>;

export const SOURCE_AUTHORITY_RANK: Record<SourceAuthority, number> = { spd: 1, benefits_overview: 2, public_page: 3 };

export const PlanSourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  publisher: z.string(),
  plan: z.string(),
  authority: SourceAuthoritySchema,
  url: z.string().url(),
  /** Document title / version string as published. */
  documentVersion: z.string(),
  documentDate: z.string().optional(),
  pages: z.number().int().positive().optional(),
  accessedAt: z.string(),
  /** Repo path of the verification extract. */
  localExtract: z.string(),
  sha256: z.string().optional(),
  notes: z.string().optional(),
});
export type PlanSource = z.infer<typeof PlanSourceSchema>;

export const RuleSectionSchema = z.enum([
  "plan_structure",
  "eligibility",
  "costs",
  "pharmacy",
  "benefits",
  "prior_authorization",
  "exclusions",
  "add_ons",
  /** Reserved: no appeals rule may exist until an official source states one. */
  "appeals",
]);
export type RuleSection = z.infer<typeof RuleSectionSchema>;

/**
 * - confirmed:           the source states it directly and unambiguously.
 * - needs_clarification: the source states it, but its scope or wording is ambiguous, or it
 *                        conflicts with another passage. Cases must not hinge on it without an
 *                        explicit assumption.
 */
export const RuleStatusSchema = z.enum(["confirmed", "needs_clarification"]);
export type RuleStatus = z.infer<typeof RuleStatusSchema>;

export const CitationSchema = z.object({
  sourceId: z.string(),
  /** Page number in the PDF (1-based), when applicable. */
  page: z.number().int().positive().optional(),
  /** Section / heading in the source. */
  section: z.string(),
  /** Exact text from the source (may be a lightly re-joined table row). */
  quote: z.string(),
});
export type Citation = z.infer<typeof CitationSchema>;

export const PlanRuleSchema = z.object({
  id: z.string().regex(/^rhus\.[a-z0-9_.]+$/),
  section: RuleSectionSchema,
  topic: z.string(),
  /** Our plain restatement of the rule. Shown in the app; must not go beyond the quote. */
  statement: z.string(),
  citations: z.array(CitationSchema).min(1),
  status: RuleStatusSchema,
  confidence: z.enum(["high", "medium", "low"]),
  /** Why something needs clarification, or how to read it. */
  note: z.string().optional(),
});
export type PlanRule = z.infer<typeof PlanRuleSchema>;

// ---------------------------------------------------------------------------
// Benefits
// ---------------------------------------------------------------------------

export const CoverageSchema = z.object({
  /** Percentage of covered charges the plan pays, or null if not covered. */
  planPaysPct: z.number().min(0).max(100).nullable(),
  afterDeductible: z.boolean(),
  /** Exact cell text, e.g. "100%", "70% after deductible", "Not covered". */
  label: z.string(),
});
export type Coverage = z.infer<typeof CoverageSchema>;

/**
 * Pre-authorization status of a benefit, reconciling the benefits table with the
 * dedicated pre-authorization list (A–T, p.10).
 * - required:        required (benefits table and/or list).
 * - required_partial: required only for part of the benefit (e.g. air/water ambulance).
 * - notification:    emergency notification rules rather than advance approval.
 * - not_stated:      the source does not mention pre-authorization for this benefit.
 * - unclear:         the source is ambiguous. Do not build a case on it without an assumption.
 */
export const PreAuthStatusSchema = z.enum(["required", "required_partial", "notification", "not_stated", "unclear"]);
export type PreAuthStatus = z.infer<typeof PreAuthStatusSchema>;

export const BenefitGroupSchema = z.enum([
  "emergency",
  "hospital",
  "surgery",
  "physician",
  "diagnostics",
  "preventive",
  "behavioral_health",
  "therapy_rehab",
  "specialty",
  "equipment_supplies",
  "reproductive_maternity",
  "wellness",
  "pharmacy",
  "other",
]);
export type BenefitGroup = z.infer<typeof BenefitGroupSchema>;

export const BenefitSchema = z.object({
  key: z.string().regex(/^[a-z0-9_]+$/),
  label: z.string(),
  group: BenefitGroupSchema,
  inNetwork: CoverageSchema.nullable(),
  outOfNetwork: CoverageSchema.nullable(),
  /** For copay-based benefits (pharmacy). */
  copay: z.string().optional(),
  limits: z.string().optional(),
  preAuth: PreAuthStatusSchema,
  /** Letters from the pre-authorization list (p.10) that apply. */
  preAuthListRefs: z.array(z.string().regex(/^[A-T]$/)).default([]),
  preAuthNote: z.string().optional(),
  specialConditions: z.string().optional(),
  citation: CitationSchema,
  status: RuleStatusSchema,
  note: z.string().optional(),
});
export type Benefit = z.infer<typeof BenefitSchema>;
export type BenefitInput = z.input<typeof BenefitSchema>;

export const PreAuthServiceSchema = z.object({
  letter: z.string().regex(/^[A-T]$/),
  label: z.string(),
  /** Exact list text. */
  quote: z.string(),
  benefitKeys: z.array(z.string()),
});
export type PreAuthService = z.infer<typeof PreAuthServiceSchema>;
