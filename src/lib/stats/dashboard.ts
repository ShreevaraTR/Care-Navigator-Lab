import type { Attempt } from "@/domain/attempt";
import { CATEGORY_LABELS, type CaseType, type ScoringCategory } from "@/domain/taxonomy";

export interface DashboardStats {
  casesCompleted: number;
  eobInvestigations: number;
  claimsInvestigations: number;
  priorAuthCases: number;
  codingExercises: number;
  averageScore: number | null;
  recent: Attempt[];
  /** Categories sorted weakest first (average % of available points). */
  weakAreas: { category: ScoringCategory; label: string; averagePct: number; attempts: number }[];
}

const has = (a: Attempt, t: CaseType) => a.caseTypes.includes(t);

export function computeDashboardStats(attempts: Attempt[]): DashboardStats {
  const done = attempts.filter((a) => a.status === "completed" && a.score);

  const perCategory = new Map<ScoringCategory, { sum: number; n: number }>();
  for (const a of done) {
    for (const c of a.score!.categories) {
      if (c.available <= 0) continue;
      const e = perCategory.get(c.category) ?? { sum: 0, n: 0 };
      e.sum += c.earned / c.available;
      e.n += 1;
      perCategory.set(c.category, e);
    }
  }

  const weakAreas = [...perCategory.entries()]
    .map(([category, { sum, n }]) => ({
      category,
      label: CATEGORY_LABELS[category],
      averagePct: Math.round((sum / n) * 100),
      attempts: n,
    }))
    .sort((x, y) => x.averagePct - y.averagePct);

  return {
    casesCompleted: done.length,
    eobInvestigations: done.filter((a) => has(a, "eob_investigation")).length,
    claimsInvestigations: done.filter((a) => has(a, "claims_investigation")).length,
    priorAuthCases: done.filter((a) => has(a, "prior_authorization")).length,
    codingExercises: done.filter((a) => has(a, "coding")).length,
    averageScore: done.length ? Math.round((done.reduce((s, a) => s + a.score!.total, 0) / done.length) * 10) / 10 : null,
    recent: attempts.slice(0, 5),
    weakAreas,
  };
}
