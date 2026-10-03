import { describe, expect, it } from "vitest";
import { cases, validateCase } from "@/content/cases";
import { sample01MriBill } from "@/content/cases/sample-01-mri-bill";
import type { CriterionResult } from "@/domain/attempt";
import { allCriteria, computeScore, gradeAuto, gradeAutoCriterion, pendingSelfReview } from "./scoring";

const sample = cases[0];

describe("content validation", () => {
  it("all registered cases pass schema validation", () => {
    expect(cases.length).toBeGreaterThan(0);
  });

  it("rejects plan_rule provenance that cites no registered source", () => {
    const bad = structuredClone(sample01MriBill);
    bad.plan.provenance = { kind: "plan_rule", sourceRef: "not-a-real-source" };
    expect(() => validateCase(bad)).toThrow(/unregistered source/);
  });

  it("rejects plan_rule provenance with no sourceRef", () => {
    const bad = structuredClone(sample01MriBill);
    bad.plan.provenance = { kind: "plan_rule" };
    expect(() => validateCase(bad)).toThrow();
  });
});

describe("auto grading", () => {
  const authMatch = allCriteria(sample).find((x) => x.criterion.id === "c-auth-match")!.criterion;

  it("gives full credit for an exact multi-select match", () => {
    expect(gradeAutoCriterion(authMatch, { kind: "choice", optionIds: ["cpt", "dx", "servicing", "dos"] })).toBe("met");
  });

  it("gives partial credit for a correct subset with no wrong picks", () => {
    expect(gradeAutoCriterion(authMatch, { kind: "choice", optionIds: ["cpt", "dos"] })).toBe("partial");
  });

  it("gives no credit when a wrong option is picked", () => {
    expect(gradeAutoCriterion(authMatch, { kind: "choice", optionIds: ["cpt", "authno"] })).toBe("missed");
  });

  it("grades amounts in cents", () => {
    const owed = allCriteria(sample).find((x) => x.criterion.id === "c-eob-owed")!.criterion;
    expect(gradeAutoCriterion(owed, { kind: "amount", cents: 0 })).toBe("met");
    expect(gradeAutoCriterion(owed, { kind: "amount", cents: 240000 })).toBe("missed");
    expect(gradeAutoCriterion(owed, { kind: "amount", cents: null })).toBe("missed");
  });

  it("leaves self-graded criteria pending", () => {
    const results = gradeAuto(sample, {});
    const pending = pendingSelfReview(sample, results);
    expect(pending.length).toBeGreaterThan(0);
    expect(pending.every((c) => c.grading.mode === "self")).toBe(true);
  });
});

describe("computeScore", () => {
  const everything = (outcome: CriterionResult["outcome"]): Record<string, CriterionResult> =>
    Object.fromEntries(allCriteria(sample).map(({ criterion }) => [criterion.id, { outcome, gradedBy: "self" as const }]));

  it("scores 100 when every criterion is met", () => {
    expect(computeScore(sample, everything("met")).total).toBe(100);
  });

  it("scores 0 and explains every lost point when everything is missed", () => {
    const s = computeScore(sample, everything("missed"));
    expect(s.total).toBe(0);
    expect(s.lostPoints).toHaveLength(allCriteria(sample).length);
    expect(s.lostPoints.every((lp) => lp.explanation.length > 20)).toBe(true);
  });

  it("scores 50 when everything is partial", () => {
    expect(computeScore(sample, everything("partial")).total).toBe(50);
  });

  it("weights categories by the 100-point model", () => {
    const results = everything("met");
    // Miss every prior authorization criterion (weight 15 of 100).
    for (const { criterion } of allCriteria(sample))
      if (criterion.category === "prior_authorization") results[criterion.id] = { outcome: "missed", gradedBy: "auto" };
    expect(computeScore(sample, results).total).toBe(85);
  });
});
