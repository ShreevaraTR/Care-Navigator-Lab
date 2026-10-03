import type { Answer, CriterionOutcome, CriterionResult, ScoreBreakdown } from "@/domain/attempt";
import type { RubricCriterion, SimulationCase, Task } from "@/domain/case";
import { CATEGORY_WEIGHTS, SCORING_CATEGORIES, type ScoringCategory } from "@/domain/taxonomy";

/** Credit given for each outcome. */
export const OUTCOME_CREDIT: Record<CriterionOutcome, number> = { met: 1, partial: 0.5, missed: 0 };

export function allCriteria(c: SimulationCase): { task: Task; criterion: RubricCriterion }[] {
  return c.tasks.flatMap((task) => task.criteria.map((criterion) => ({ task, criterion })));
}

/** Deterministically grade one auto criterion. Returns null for self-graded criteria. */
export function gradeAutoCriterion(criterion: RubricCriterion, answer: Answer | undefined): CriterionOutcome | null {
  const g = criterion.grading;
  if (g.mode === "self") return null;

  if (g.mode === "auto_amount") {
    if (answer?.kind !== "amount" || answer.cents === null) return "missed";
    return Math.abs(answer.cents - g.expectedCents) <= g.toleranceCents ? "met" : "missed";
  }

  // auto_choice: exact set match is "met"; for multi-select, a partially correct
  // selection with no wrong picks is "partial".
  if (answer?.kind !== "choice" || answer.optionIds.length === 0) return "missed";
  const correct = new Set(g.correctOptionIds);
  const picked = new Set(answer.optionIds);
  const wrongPicks = [...picked].filter((id) => !correct.has(id)).length;
  const rightPicks = [...picked].filter((id) => correct.has(id)).length;
  if (wrongPicks === 0 && rightPicks === correct.size) return "met";
  if (wrongPicks === 0 && rightPicks > 0) return "partial";
  return "missed";
}

/** Grade every auto criterion in a case. */
export function gradeAuto(c: SimulationCase, answers: Record<string, Answer>): Record<string, CriterionResult> {
  const results: Record<string, CriterionResult> = {};
  for (const { task, criterion } of allCriteria(c)) {
    const outcome = gradeAutoCriterion(criterion, answers[task.id]);
    if (outcome) results[criterion.id] = { outcome, gradedBy: "auto" };
  }
  return results;
}

export function pendingSelfReview(c: SimulationCase, results: Record<string, CriterionResult>): RubricCriterion[] {
  return allCriteria(c)
    .map(({ criterion }) => criterion)
    .filter((cr) => !results[cr.id]);
}

/**
 * 100-point scoring.
 *
 * Each category the case tests is scored as (earned / available) × category weight.
 * The total is then normalised over the weights of the categories actually tested, so a
 * case that does not test, say, prior authorization is still scored out of 100.
 * Ungraded criteria count as missed.
 */
export function computeScore(c: SimulationCase, results: Record<string, CriterionResult>): ScoreBreakdown {
  const acc = new Map<ScoringCategory, { earned: number; available: number }>();
  const lostPoints: ScoreBreakdown["lostPoints"] = [];

  for (const { task, criterion } of allCriteria(c)) {
    const outcome = results[criterion.id]?.outcome ?? "missed";
    const earned = criterion.points * OUTCOME_CREDIT[outcome];
    const entry = acc.get(criterion.category) ?? { earned: 0, available: 0 };
    entry.earned += earned;
    entry.available += criterion.points;
    acc.set(criterion.category, entry);
    if (earned < criterion.points) {
      lostPoints.push({
        criterionId: criterion.id,
        taskId: task.id,
        category: criterion.category,
        pointsLost: criterion.points - earned,
        explanation: criterion.feedbackIfMissed,
      });
    }
  }

  const categories = SCORING_CATEGORIES.filter((cat) => acc.has(cat)).map((category) => {
    const { earned, available } = acc.get(category)!;
    const weight = CATEGORY_WEIGHTS[category];
    return { category, weight, earned, available, weighted: available > 0 ? (earned / available) * weight : 0 };
  });

  const testedWeight = categories.reduce((s, x) => s + x.weight, 0);
  const weightedSum = categories.reduce((s, x) => s + x.weighted, 0);
  const total = testedWeight > 0 ? round1((weightedSum / testedWeight) * 100) : 0;

  return { total, categories, lostPoints };
}

const round1 = (n: number) => Math.round(n * 10) / 10;
