import { z } from "zod";
import { CaseTypeSchema, ScoringCategorySchema, SkillSchema } from "./taxonomy";

/**
 * An attempt is one run of one case by the trainee. Once reviewed, it doubles as the
 * portfolio record: it snapshots the case identity, the trainee's investigation and
 * answers, the graded rubric, and the score breakdown.
 */

export const AnswerSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("choice"), optionIds: z.array(z.string()) }),
  z.object({ kind: z.literal("amount"), cents: z.number().int().nullable() }),
  z.object({ kind: z.literal("text"), text: z.string() }),
]);
export type Answer = z.infer<typeof AnswerSchema>;

export const CriterionOutcomeSchema = z.enum(["met", "partial", "missed"]);
export type CriterionOutcome = z.infer<typeof CriterionOutcomeSchema>;

export const CriterionResultSchema = z.object({
  outcome: CriterionOutcomeSchema,
  gradedBy: z.enum(["auto", "self", "ai", "reviewer"]),
  comment: z.string().optional(),
});
export type CriterionResult = z.infer<typeof CriterionResultSchema>;

export const CategoryScoreSchema = z.object({
  category: ScoringCategorySchema,
  weight: z.number(),
  earned: z.number(),
  available: z.number(),
  /** earned/available scaled to the category weight. */
  weighted: z.number(),
});
export type CategoryScore = z.infer<typeof CategoryScoreSchema>;

export const ScoreBreakdownSchema = z.object({
  /** 0–100, normalised over the categories the case tests. */
  total: z.number(),
  categories: z.array(CategoryScoreSchema),
  lostPoints: z.array(
    z.object({
      criterionId: z.string(),
      taskId: z.string(),
      category: ScoringCategorySchema,
      pointsLost: z.number(),
      explanation: z.string(),
    }),
  ),
});
export type ScoreBreakdown = z.infer<typeof ScoreBreakdownSchema>;

export const AttemptStatusSchema = z.enum(["in_progress", "awaiting_self_review", "completed"]);
export type AttemptStatus = z.infer<typeof AttemptStatusSchema>;

export const AttemptSchema = z.object({
  id: z.string(),
  schemaVersion: z.literal(1),
  caseId: z.string(),
  caseVersion: z.number(),
  caseCode: z.string(),
  caseTitle: z.string(),
  portfolioNumber: z.number().nullable(),
  caseTypes: z.array(CaseTypeSchema),
  skills: z.array(SkillSchema),
  status: AttemptStatusSchema,
  startedAt: z.string(),
  submittedAt: z.string().optional(),
  completedAt: z.string().optional(),
  /** Free-form investigation notes taken while working the case. */
  investigationNotes: z.string(),
  /** Task ids whose hint the trainee chose to reveal. */
  hintsUsed: z.array(z.string()).default([]),
  answers: z.record(z.string(), AnswerSchema),
  criterionResults: z.record(z.string(), CriterionResultSchema),
  score: ScoreBreakdownSchema.optional(),
  /** Trainee's own reflection after review. */
  reflection: z.string().optional(),
  /** Link to an external recording (screen capture, Yoodli, etc.), decided later. */
  recordingUrl: z.string().optional(),
});
export type Attempt = z.infer<typeof AttemptSchema>;
