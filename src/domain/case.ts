import { z } from "zod";
import { ProvenanceSchema } from "./provenance";
import { CaseTypeSchema, ScoringCategorySchema, SkillSchema } from "./taxonomy";

/**
 * Simulation case schema.
 *
 * A case is modelled as a realistic Care Navigator ticket: a member message plus
 * an evidence packet (EOB, provider bill, claim, authorization record, plan benefits…)
 * and a set of investigation tasks with explicit rubric criteria.
 *
 * All money values are integer cents to avoid floating-point drift.
 */

const Cents = z.number().int();
const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD");

export const NetworkStatusSchema = z.enum(["in_network", "out_of_network", "unknown"]);
export type NetworkStatus = z.infer<typeof NetworkStatusSchema>;

// ---------------------------------------------------------------------------
// Codes
// ---------------------------------------------------------------------------

/**
 * A code referenced in a case.
 *
 * CPT descriptors are copyrighted by the AMA. We never store official CPT descriptor
 * text — only the code number and our own plain-language summary of the concept.
 * ICD-10-CM is published by CDC/NCHS and is public domain.
 */
export const CodeReferenceSchema = z.object({
  system: z.enum(["CPT", "HCPCS", "ICD-10-CM"]),
  code: z.string(),
  /** Our own plain-language explanation. NOT the official descriptor. */
  plainLanguage: z.string(),
  role: z.enum(["service", "diagnosis"]),
  provenance: ProvenanceSchema,
});
export type CodeReference = z.infer<typeof CodeReferenceSchema>;

// ---------------------------------------------------------------------------
// Evidence documents
// ---------------------------------------------------------------------------

const DocumentBase = z.object({
  id: z.string(),
  title: z.string(),
  provenance: ProvenanceSchema,
  /**
   * Errors planted in this document on purpose (e.g. a CPT code typed into a diagnosis field),
   * described for authors. Structural code checks are relaxed for such documents, and at least
   * one criterion must cite the document so the error is actually tested.
   */
  deliberateErrors: z.array(z.string()).default([]),
});

export const EobLineSchema = z.object({
  dateOfService: IsoDate,
  /** Plan benefit this line falls under (plan knowledge-base key). Enables plan-consistency checks. */
  benefitKey: z.string().optional(),
  service: z.string(),
  code: z.string().optional(),
  billed: Cents,
  allowed: Cents,
  planPaid: Cents,
  deductible: Cents,
  copay: Cents,
  coinsurance: Cents,
  notCovered: Cents,
  memberResponsibility: Cents,
  remarkCodes: z.array(z.string()).default([]),
});

export const EobDocumentSchema = DocumentBase.extend({
  type: z.literal("eob"),
  claimNumber: z.string(),
  processedDate: IsoDate,
  patient: z.string(),
  provider: z.string(),
  networkStatus: NetworkStatusSchema,
  lines: z.array(EobLineSchema).min(1),
  remarks: z.array(z.object({ code: z.string(), text: z.string() })).default([]),
});

export const ProviderBillDocumentSchema = DocumentBase.extend({
  type: z.literal("provider_bill"),
  providerName: z.string(),
  statementDate: IsoDate,
  accountNumber: z.string(),
  lines: z.array(z.object({ dateOfService: IsoDate, description: z.string(), code: z.string().optional(), charge: Cents })),
  insurancePayments: Cents,
  adjustments: Cents,
  balanceDue: Cents,
  dueDate: IsoDate.optional(),
  message: z.string().optional(),
});

export const ClaimDocumentSchema = DocumentBase.extend({
  type: z.literal("claim"),
  claimNumber: z.string(),
  status: z.enum(["received", "pended", "processed_paid", "denied", "partially_denied", "adjusted", "voided"]),
  receivedDate: IsoDate,
  processedDate: IsoDate.optional(),
  billingProvider: z.string(),
  renderingProvider: z.string().optional(),
  networkStatus: NetworkStatusSchema,
  authorizationNumberOnClaim: z.string().optional(),
  lines: z.array(
    z.object({
      dateOfService: IsoDate,
      code: z.string(),
      diagnosisCodes: z.array(z.string()),
      units: z.number().int().positive(),
      charge: Cents,
      lineStatus: z.string(),
      denialReason: z.string().optional(),
    }),
  ),
});

export const AuthorizationDocumentSchema = DocumentBase.extend({
  type: z.literal("authorization"),
  authNumber: z.string().optional(),
  status: z.enum(["approved", "denied", "pending", "not_found", "not_required", "expired"]),
  service: z.string(),
  codes: z.array(z.string()),
  diagnosisCodes: z.array(z.string()).default([]),
  requestingProvider: z.string(),
  servicingProvider: z.string().optional(),
  requestedDate: IsoDate.optional(),
  decisionDate: IsoDate.optional(),
  validFrom: IsoDate.optional(),
  validTo: IsoDate.optional(),
  notes: z.string().optional(),
  /**
   * What the case asserts about whether pre-authorization is required for this service.
   * Checked against the plan knowledge base for plan cases.
   */
  requirement: z.object({ benefitKey: z.string(), required: z.boolean() }).optional(),
});

export const BenefitSummaryDocumentSchema = DocumentBase.extend({
  type: z.literal("benefit_summary"),
  planName: z.string(),
  /** True for fictional training plans. Plan (non-fictional) summaries may only contain plan rules. */
  isSimulatedPlan: z.boolean(),
  /**
   * For plan rules, give `ruleId` and omit `value`: the text is taken from the knowledge base, so a
   * case can never restate a rule differently. Free-text `value` is only for fictional plans.
   */
  items: z.array(z.object({ label: z.string(), value: z.string().optional(), ruleId: z.string().optional(), provenance: ProvenanceSchema })),
});

/** Free-form record: call log, clinical note excerpt, letter, chat transcript… */
export const NoteDocumentSchema = DocumentBase.extend({
  type: z.literal("note"),
  author: z.string().optional(),
  date: IsoDate.optional(),
  body: z.string(),
});

export const CaseDocumentSchema = z.discriminatedUnion("type", [
  EobDocumentSchema,
  ProviderBillDocumentSchema,
  ClaimDocumentSchema,
  AuthorizationDocumentSchema,
  BenefitSummaryDocumentSchema,
  NoteDocumentSchema,
]);
export type CaseDocument = z.infer<typeof CaseDocumentSchema>;
export type EobDocument = z.infer<typeof EobDocumentSchema>;
export type ProviderBillDocument = z.infer<typeof ProviderBillDocumentSchema>;
export type ClaimDocument = z.infer<typeof ClaimDocumentSchema>;
export type AuthorizationDocument = z.infer<typeof AuthorizationDocumentSchema>;
export type BenefitSummaryDocument = z.infer<typeof BenefitSummaryDocumentSchema>;
export type NoteDocument = z.infer<typeof NoteDocumentSchema>;

// ---------------------------------------------------------------------------
// Tasks and rubric
// ---------------------------------------------------------------------------

/**
 * How a rubric criterion gets graded.
 * - auto: deterministic check against the trainee's structured answer.
 * - self: trainee compares their free-text answer to the model reasoning and marks it.
 *         (A future "ai" grader can fill the same slot without schema changes.)
 */
export const CriterionGradingSchema = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("auto_choice"), correctOptionIds: z.array(z.string()).min(1) }),
  z.object({ mode: z.literal("auto_amount"), expectedCents: Cents, toleranceCents: Cents.default(0) }),
  z.object({ mode: z.literal("self") }),
]);
export type CriterionGrading = z.infer<typeof CriterionGradingSchema>;

/**
 * What makes a criterion's expected answer true. Every criterion needs at least one basis, so that
 * every answer is explainable from a cited plan rule, a general concept, or a stated case fact.
 */
export const BasisSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("plan_rule"), ruleId: z.string() }),
  z.object({ kind: z.literal("general_concept"), conceptId: z.string() }),
  z.object({ kind: z.literal("case_fact"), documentId: z.string() }),
  z.object({ kind: z.literal("assumption"), assumptionIndex: z.number().int().nonnegative() }),
]);
export type Basis = z.infer<typeof BasisSchema>;

export const RubricCriterionSchema = z.object({
  id: z.string(),
  basis: z.array(BasisSchema).min(1),
  category: ScoringCategorySchema,
  points: z.number().positive(),
  /** What a strong answer demonstrates. Shown in review. */
  expectation: z.string(),
  /** Explains WHY points are lost — never just "wrong". */
  feedbackIfMissed: z.string(),
  feedbackIfMet: z.string().optional(),
  grading: CriterionGradingSchema,
});
export type RubricCriterion = z.infer<typeof RubricCriterionSchema>;

export const TaskKindSchema = z.enum(["single_choice", "multi_choice", "amount", "free_text", "member_response"]);
export type TaskKind = z.infer<typeof TaskKindSchema>;

export const TaskSchema = z.object({
  id: z.string(),
  kind: TaskKindSchema,
  prompt: z.string(),
  hint: z.string().optional(),
  options: z.array(z.object({ id: z.string(), label: z.string() })).optional(),
  /** Declares what an amount task measures, so validation can check it against the documents. */
  measures: z.enum(["eob_member_responsibility"]).optional(),
  criteria: z.array(RubricCriterionSchema).min(1),
  /** Model answer / correct reasoning for this task, shown in review. */
  modelAnswer: z.string(),
});
export type Task = z.infer<typeof TaskSchema>;

// ---------------------------------------------------------------------------
// Case
// ---------------------------------------------------------------------------

export const CaseSchema = z
  .object({
    id: z.string(),
    /** Bump when content changes so stored attempts can be matched to the version they used. */
    version: z.number().int().positive(),
    /** Portfolio case number (1–20). Null for practice/sample cases. */
    portfolioNumber: z.number().int().positive().nullable(),
    code: z.string(),
    title: z.string(),
    summary: z.string(),
    difficulty: z.enum(["foundation", "intermediate", "intermediate_plus", "advanced", "complex", "capstone"]),
    /** One-line scenario for the portfolio table. */
    scenario: z.string().optional(),
    recordingPriority: z.enum(["high", "medium", "low"]).optional(),
    status: z.enum(["draft", "ready"]),
    /** Sample cases use a fictional plan and exist to exercise the app. */
    isSample: z.boolean(),
    caseTypes: z.array(CaseTypeSchema).min(1),
    skills: z.array(SkillSchema).min(1),
    ticket: z.object({
      channel: z.enum(["chat", "email", "phone"]),
      receivedAt: z.string(),
      memberMessage: z.string(),
    }),
    member: z.object({ name: z.string(), memberId: z.string(), details: z.string().optional() }),
    /**
     * "rhus": the case is set on Remote Health USA and is checked against the plan knowledge base.
     * "fictional": an invented plan. It may not be named or presented as SafetyWing / Remote Health.
     */
    plan: z.object({ planId: z.enum(["rhus", "fictional"]), name: z.string(), provenance: ProvenanceSchema }),
    /** Knowledge the case tests. Every plan rule / concept used as a basis must be declared here. */
    knowledge: z.object({
      planRules: z.array(z.string()).default([]),
      generalConcepts: z.array(z.string()).default([]),
      /** needs_clarification rules the case deliberately relies on, with an assumption covering them. */
      acknowledgedUnclearRules: z.array(z.string()).default([]),
    }),
    provider: z.object({ name: z.string(), type: z.string(), networkStatus: NetworkStatusSchema }),
    codes: z.array(CodeReferenceSchema).default([]),
    documents: z.array(CaseDocumentSchema).min(1),
    tasks: z.array(TaskSchema).min(1),
    /** Assumptions the trainee should work under, stated up front. */
    assumptions: z.array(z.string()).default([]),
    debrief: z.object({
      whatHappened: z.string(),
      correctReasoning: z.array(z.string()),
      modelMemberResponse: z.string(),
      conceptsToReview: z.array(z.string()).default([]),
    }),
  })
  .superRefine((c, ctx) => {
    const ids = new Set<string>();
    for (const t of c.tasks) {
      for (const cr of t.criteria) {
        if (ids.has(cr.id)) ctx.addIssue({ code: "custom", message: `duplicate criterion id ${cr.id}` });
        ids.add(cr.id);
        const isChoice = t.kind === "single_choice" || t.kind === "multi_choice";
        if (cr.grading.mode === "auto_choice" && !isChoice)
          ctx.addIssue({ code: "custom", message: `${cr.id}: auto_choice grading needs a choice task` });
        if (cr.grading.mode === "auto_amount" && t.kind !== "amount")
          ctx.addIssue({ code: "custom", message: `${cr.id}: auto_amount grading needs an amount task` });
        if (cr.grading.mode === "auto_choice") {
          const optionIds = new Set((t.options ?? []).map((o) => o.id));
          for (const id of cr.grading.correctOptionIds)
            if (!optionIds.has(id)) ctx.addIssue({ code: "custom", message: `${cr.id}: unknown option ${id}` });
        }
      }
      if ((t.kind === "single_choice" || t.kind === "multi_choice") && !t.options?.length)
        ctx.addIssue({ code: "custom", message: `${t.id}: choice task needs options` });
    }
  });
export type SimulationCase = z.infer<typeof CaseSchema>;
export type SimulationCaseInput = z.input<typeof CaseSchema>;
