import type { Basis, CodeReference, SimulationCaseInput } from "@/domain/case";
import { generalConcept, planRule } from "@/domain/provenance";
import type { ScoringCategory } from "@/domain/taxonomy";

/**
 * Authoring helpers for portfolio cases. They only build data; every case still goes through
 * the full schema + content validation when it loads.
 */

type TaskInput = SimulationCaseInput["tasks"][number];
type CriterionInput = TaskInput["criteria"][number];
export type DocInput = SimulationCaseInput["documents"][number];
type EobLineInput = Extract<DocInput, { type: "eob" }>["lines"][number];

// --- basis shorthands --------------------------------------------------------
export const rule = (ruleId: string): Basis => ({ kind: "plan_rule", ruleId });
export const concept = (conceptId: string): Basis => ({ kind: "general_concept", conceptId });
export const fact = (documentId: string): Basis => ({ kind: "case_fact", documentId });
export const assumed = (assumptionIndex: number): Basis => ({ kind: "assumption", assumptionIndex });

// --- codes -------------------------------------------------------------------
export const cpt = (code: string, plainLanguage: string): CodeReference => ({
  system: "CPT",
  code,
  role: "service",
  plainLanguage,
  provenance: generalConcept("Plain-language summary written for this lab; not the AMA descriptor."),
});
export const hcpcs = (code: string, plainLanguage: string): CodeReference => ({
  system: "HCPCS",
  code,
  role: "service",
  plainLanguage,
  provenance: generalConcept("HCPCS Level II (CMS). Plain-language summary."),
});
export const icd = (code: string, plainLanguage: string): CodeReference => ({
  system: "ICD-10-CM",
  code,
  role: "diagnosis",
  plainLanguage,
  provenance: generalConcept("ICD-10-CM (CDC/NCHS)."),
});

// --- EOB lines ---------------------------------------------------------------
export const eobLine = (l: Partial<EobLineInput> & Pick<EobLineInput, "dateOfService" | "service" | "billed">): EobLineInput => ({
  allowed: 0,
  planPaid: 0,
  deductible: 0,
  copay: 0,
  coinsurance: 0,
  notCovered: 0,
  memberResponsibility: 0,
  remarkCodes: [],
  ...l,
});

// --- criteria & tasks ----------------------------------------------------------
interface Crit {
  id: string;
  category: ScoringCategory;
  points: number;
  basis: Basis[];
  expectation: string;
  missed: string;
  met?: string;
}
const crit = (c: Crit, grading: CriterionInput["grading"]): CriterionInput => ({
  id: c.id,
  category: c.category,
  points: c.points,
  basis: c.basis,
  expectation: c.expectation,
  feedbackIfMissed: c.missed,
  feedbackIfMet: c.met,
  grading,
});
export const selfCrit = (c: Crit) => crit(c, { mode: "self" });

/** Single- or multi-select task with one auto-graded criterion. `correct` lists the right option ids. */
export function choice(
  id: string,
  prompt: string,
  options: [string, string][],
  correct: string[],
  c: Omit<Crit, "id">,
  modelAnswer: string,
  hint?: string,
): TaskInput {
  return {
    id,
    kind: correct.length > 1 ? "multi_choice" : "single_choice",
    prompt,
    hint,
    options: options.map(([oid, label]) => ({ id: oid, label })),
    criteria: [crit({ ...c, id: `c-${id}` }, { mode: "auto_choice", correctOptionIds: correct })],
    modelAnswer,
  };
}

/** Force multi-select even with one correct answer (so the trainee can't infer the count). */
export function selectAll(...args: Parameters<typeof choice>): TaskInput {
  return { ...choice(...args), kind: "multi_choice" };
}

export function amount(
  id: string,
  prompt: string,
  expectedCents: number,
  c: Omit<Crit, "id">,
  modelAnswer: string,
  opts: { hint?: string; measures?: "eob_member_responsibility"; toleranceCents?: number } = {},
): TaskInput {
  return {
    id,
    kind: "amount",
    prompt,
    hint: opts.hint,
    measures: opts.measures,
    criteria: [crit({ ...c, id: `c-${id}` }, { mode: "auto_amount", expectedCents, toleranceCents: opts.toleranceCents ?? 0 })],
    modelAnswer,
  };
}

export function investigation(prompt: string, criteria: Crit[], modelAnswer: string, hint?: string): TaskInput {
  return { id: "t-investigation", kind: "free_text", prompt, hint, criteria: criteria.map(selfCrit), modelAnswer };
}

export const INVESTIGATION_PROMPT =
  "Investigation summary: What happened? Is anything inconsistent? What is known vs. still unverified? Who needs to be contacted, and what are your next steps?";

/**
 * Standard member-reply task (10 points across the six communication criteria).
 * Case-specific text goes in `accuracy`, `promises` and `next`.
 */
export function memberReply(o: { accuracy: string; accuracyBasis: Basis[]; promises: string; next: string; nextBasis?: Basis[]; empathy?: string }): TaskInput {
  const mc = concept("member-communication");
  return {
    id: "t-member-reply",
    kind: "member_response",
    prompt: "Write the chat reply you'd send the member: short, realistic, plain English (about 80–150 words).",
    criteria: [
      selfCrit({ id: "c-comm-accuracy", category: "member_communication", points: 2, basis: [...o.accuracyBasis, mc], expectation: o.accuracy, missed: "The reply must match what the evidence actually shows. Don't state guesses or unverified causes as facts." }),
      selfCrit({ id: "c-comm-empathy", category: "member_communication", points: 1.5, basis: [mc], expectation: o.empathy ?? "Acknowledges the member's concern in one genuine sentence.", missed: "A short, genuine acknowledgement builds trust before the explanation." }),
      selfCrit({ id: "c-comm-plain", category: "member_communication", points: 2, basis: [mc], expectation: "Explains in plain English. Any insurance term used is translated (e.g. 'the amount the plan allows', 'pre-approval').", missed: "Jargon such as 'allowed amount', 'adjudicated' or 'PA' confuses members. Translate it or explain it in a few words." }),
      selfCrit({ id: "c-comm-ownership", category: "member_communication", points: 1.5, basis: [mc, concept("care-coordination")], expectation: "Takes ownership: says what you will do and who you'll contact.", missed: "The member should know someone is actively handling it, not that they have to chase it alone." }),
      selfCrit({ id: "c-comm-promises", category: "member_communication", points: 1.5, basis: [mc], expectation: o.promises, missed: "Promising approval, reimbursement or a final amount before it's confirmed sets the member up for a second surprise." }),
      selfCrit({ id: "c-comm-next", category: "member_communication", points: 1.5, basis: [mc, ...(o.nextBasis ?? [])], expectation: o.next, missed: "End with what the member should do now (or not do) and when they'll hear back." }),
    ],
    modelAnswer: "See the suggested member response in the debrief.",
  };
}

/** Standard criterion: separating evidence from inference (complex cases). */
export const knownVsUnknown = (points: number, expectation: string, basis: Basis[]): Crit => ({
  id: "c-known-unknown",
  category: "problem_solving",
  points,
  basis,
  expectation,
  missed:
    "Strong investigations separate what the documents prove from what is inferred and what still needs verification. Giving definitive answers without evidence loses points, even when the guess turns out right.",
});

// --- case-level helpers ----------------------------------------------------------

const PLAN_RULE = "rhus.structure.self_funded_erisa";
const SPD_RULE = "rhus.structure.spd_governs";

export const RHUS_PLAN: SimulationCaseInput["plan"] = {
  planId: "rhus",
  name: "Remote Health USA",
  provenance: planRule(PLAN_RULE, "Plan rules cited from the benefits overview dated 2025-12-16 and the public plan page."),
};

/**
 * Declares the knowledge a case tests. Always includes the plan-identity rules used by the plan header and
 * rules panel, plus the communication concepts every member reply is graded on.
 */
export const knowledge = (planRules: string[], generalConcepts: string[], acknowledgedUnclearRules: string[] = []) => ({
  planRules: [...new Set([PLAN_RULE, SPD_RULE, ...planRules])],
  generalConcepts: [...new Set([...generalConcepts, "member-communication", "care-coordination"])],
  acknowledgedUnclearRules,
});

/** The "Plan rules (official)" panel: only the rules a Care Navigator would need for this ticket. */
export const planRulesDoc = (items: [label: string, ruleId: string][]): DocInput => ({
  id: "doc-plan",
  type: "benefit_summary",
  title: "Plan rules (official, Remote Health USA)",
  provenance: planRule(SPD_RULE, "Excerpt from the plan knowledge base."),
  planName: "Remote Health USA",
  isSimulatedPlan: false,
  items: items.map(([label, ruleId]) => ({ label, ruleId, provenance: planRule(ruleId) })),
});

export const FICTION_ASSUMPTION =
  "All people, providers, IDs, dates and amounts are fictional. Each provider's network status is a simulated case fact.";
export const DOCS_ASSUMPTION =
  "EOB layouts, remark codes and claim-system wording are invented for the simulation. Real administrator documents look different.";
