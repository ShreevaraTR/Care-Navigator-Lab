import { describe, expect, it } from "vitest";
import { CaseSchema } from "@/domain/case";
import { validateCaseContent } from "@/lib/validation/case-validation";
import { portfolioCases } from "./index";

describe("portfolio cases", () => {
  it.each(portfolioCases.map((c) => [c.code, c] as const))("%s passes schema and content validation", (_code, raw) => {
    const parsed = CaseSchema.parse(raw);
    expect(validateCaseContent(parsed).map((i) => `[${i.code}] ${i.message}`)).toEqual([]);
  });
});

import { ruleById } from "@/content/plan-knowledge";
import { conceptById } from "@/content/learn/concepts";
import { PORTFOLIO_SKILLS } from "@/domain/taxonomy";
import { blockedSpecs } from "./placeholders";

const DIFFICULTY_BY_NUMBER = (n: number) =>
  n <= 4 ? "foundation" : n <= 8 ? "intermediate" : n <= 12 ? "intermediate_plus" : n <= 16 ? "advanced" : n <= 19 ? "complex" : "capstone";

describe("portfolio structure", () => {
  it("has cases numbered 1–20 in order", () => {
    expect(portfolioCases.map((c) => c.portfolioNumber)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
  });

  it("follows the difficulty progression", () => {
    for (const c of portfolioCases) expect(c.difficulty, c.code).toBe(DIFFICULTY_BY_NUMBER(c.portfolioNumber!));
  });

  it("every case combines 3–8 skills and has a written investigation and a member reply", () => {
    for (const c of portfolioCases) {
      expect(c.skills.length, c.code).toBeGreaterThanOrEqual(3);
      expect(c.skills.length, c.code).toBeLessThanOrEqual(8);
      expect(c.tasks.some((t) => t.kind === "free_text"), c.code).toBe(true);
      expect(c.tasks.some((t) => t.kind === "member_response"), c.code).toBe(true);
    }
  });

  it("mixes task types (not just multiple choice)", () => {
    for (const c of portfolioCases) {
      const kinds = new Set(c.tasks.map((t) => t.kind));
      expect(kinds.size, c.code).toBeGreaterThanOrEqual(3);
    }
    const all = portfolioCases.flatMap((c) => c.tasks.map((t) => t.kind));
    for (const k of ["single_choice", "multi_choice", "amount", "free_text", "member_response"]) expect(all).toContain(k);
  });

  it("covers each of the 20 portfolio skills in at least two cases", () => {
    const counts = Object.fromEntries(PORTFOLIO_SKILLS.map((s) => [s, portfolioCases.filter((c) => c.skills.includes(s)).length]));
    const thin = Object.entries(counts).filter(([, n]) => n < 2);
    expect(thin).toEqual([]);
  });

  it("every case is set on Remote Health USA and cites plan rules", () => {
    for (const c of portfolioCases) {
      expect(c.plan.planId, c.code).toBe("rhus");
      expect(c.knowledge.planRules?.length ?? 0, c.code).toBeGreaterThan(2);
    }
  });

  it("blocked specs reference real knowledge and contain no answers", () => {
    for (const s of blockedSpecs) {
      expect(s.status).toBe("BLOCKED_PENDING_SPD");
      for (const r of s.existingRules) expect(ruleById(r), r).toBeDefined();
      for (const k of s.concepts) expect(conceptById(k), k).toBeDefined();
      expect(Object.keys(s)).not.toContain("tasks");
    }
  });
});

describe("generated portfolio doc", () => {
  it("docs/20_CASE_PORTFOLIO.md is up to date (run `npm run portfolio:docs`)", async () => {
    const { renderPortfolioDoc } = await import("./portfolio-doc");
    const { readFileSync, writeFileSync, existsSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const path = resolve(process.cwd(), "docs/20_CASE_PORTFOLIO.md");
    const expected = renderPortfolioDoc();
    if (process.env.UPDATE_PORTFOLIO_DOCS) writeFileSync(path, expected);
    expect(existsSync(path) ? readFileSync(path, "utf8") : "").toBe(expected);
  });
});

import { cases } from "@/content/cases";
import type { Answer, CriterionResult } from "@/domain/attempt";
import { allCriteria, computeScore, gradeAuto } from "@/lib/scoring/scoring";

describe("every loadable case is gradable end to end", () => {
  it.each(cases.map((c) => [c.code, c] as const))("%s: perfect answers score 100; blank answers score 0", (_code, c) => {
    const perfect: Record<string, Answer> = {};
    for (const t of c.tasks) {
      const g = t.criteria[0].grading;
      if (g.mode === "auto_choice") perfect[t.id] = { kind: "choice", optionIds: g.correctOptionIds };
      else if (g.mode === "auto_amount") perfect[t.id] = { kind: "amount", cents: g.expectedCents };
      else perfect[t.id] = { kind: "text", text: "answer" };
    }
    const auto = gradeAuto(c, perfect);
    expect(Object.values(auto).every((r) => r.outcome === "met")).toBe(true);
    const all: Record<string, CriterionResult> = { ...auto };
    for (const { criterion } of allCriteria(c)) all[criterion.id] ??= { outcome: "met", gradedBy: "self" };
    expect(computeScore(c, all).total).toBe(100);
    expect(computeScore(c, gradeAuto(c, {})).total).toBe(0);
  });
});
