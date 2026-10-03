import { z } from "zod";

/**
 * Scoring categories and their weights in the 100-point model.
 * A case does not have to test every category: scores are normalised over the
 * categories a case actually tests (see lib/scoring).
 */
export const SCORING_CATEGORIES = [
  "claims_reasoning",
  "eob_interpretation",
  "coding_understanding",
  "prior_authorization",
  "plan_knowledge",
  "problem_solving",
  "member_communication",
] as const;
export const ScoringCategorySchema = z.enum(SCORING_CATEGORIES);
export type ScoringCategory = z.infer<typeof ScoringCategorySchema>;

export const CATEGORY_WEIGHTS: Record<ScoringCategory, number> = {
  claims_reasoning: 20,
  eob_interpretation: 20,
  coding_understanding: 15,
  prior_authorization: 15,
  plan_knowledge: 10,
  problem_solving: 10,
  member_communication: 10,
};

export const CATEGORY_LABELS: Record<ScoringCategory, string> = {
  claims_reasoning: "Claims reasoning",
  eob_interpretation: "EOB interpretation",
  coding_understanding: "CPT/ICD understanding",
  prior_authorization: "Prior authorization",
  plan_knowledge: "Plan knowledge",
  problem_solving: "Problem solving",
  member_communication: "Member communication",
};

/** What kind of ticket a case is. A case may have several. Drives dashboard counters. */
export const CASE_TYPES = [
  "eob_investigation",
  "claims_investigation",
  "medical_billing",
  "prior_authorization",
  "coding",
  "denial",
  "appeal",
  "coordination",
  "complex",
] as const;
export const CaseTypeSchema = z.enum(CASE_TYPES);
export type CaseType = z.infer<typeof CaseTypeSchema>;

export const CASE_TYPE_LABELS: Record<CaseType, string> = {
  eob_investigation: "EOB investigation",
  claims_investigation: "Claims investigation",
  medical_billing: "Medical billing",
  prior_authorization: "Prior authorization",
  coding: "CPT / ICD-10",
  denial: "Denied claim",
  appeal: "Appeal",
  coordination: "Provider/member coordination",
  complex: "Complex multi-issue",
};

/** Fine-grained skills, used for portfolio tagging and coverage tracking across the 20 cases. */
export const SKILLS = [
  "eob_reading",
  "claim_status",
  "billing_reconciliation",
  "prior_auth",
  "cpt",
  "icd10",
  "medical_necessity",
  "denials",
  "appeals",
  "network_status",
  "member_responsibility",
  "cost_sharing",
  "balance_billing",
  "provider_communication",
  "member_communication",
] as const;
export const SkillSchema = z.enum(SKILLS);
export type Skill = z.infer<typeof SkillSchema>;

export const SKILL_LABELS: Record<Skill, string> = {
  eob_reading: "Reading an EOB",
  claim_status: "Claim status",
  billing_reconciliation: "Bill vs. EOB reconciliation",
  prior_auth: "Prior authorization",
  cpt: "CPT concepts",
  icd10: "ICD-10 concepts",
  medical_necessity: "Medical necessity",
  denials: "Denials",
  appeals: "Appeals",
  network_status: "Network status",
  member_responsibility: "Member responsibility",
  cost_sharing: "Deductible / copay / coinsurance",
  balance_billing: "Balance billing",
  provider_communication: "Provider communication",
  member_communication: "Member communication",
};
