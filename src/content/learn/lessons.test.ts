import { describe, expect, it } from "vitest";
import { ruleById } from "@/content/plan-knowledge";
import type { LessonBlock } from "@/domain/lesson";
import { conceptById, concepts } from "./concepts";
import { lessons } from "./lessons";

const blockRuleIds = (b: LessonBlock): string[] =>
  b.type === "rules" ? b.ruleIds : "source" in b && b.source?.kind === "plan_rule" ? b.source.ruleIds : [];

const blockText = (b: LessonBlock): string[] =>
  b.type === "p" || b.type === "callout" ? [b.text] : b.type === "list" ? b.items : b.type === "table" ? [...b.headers, ...b.rows.flat()] : [];

describe("lessons", () => {
  it("has the eight priority lessons in order, plus member communication", () => {
    expect(lessons.map((l) => l.id)).toEqual([
      "claims-basics",
      "reading-eob",
      "eob-vs-bill",
      "cpt-icd",
      "prior-auth",
      "allowed-amount",
      "network",
      "denials-corrections",
      "member-communication",
    ]);
  });

  it.each(lessons.map((l) => [l.id, l] as const))("%s has all seven parts and valid references", (_id, l) => {
    expect(l.explanation.length).toBeGreaterThan(0);
    expect(l.example.blocks.length).toBeGreaterThan(0);
    expect(l.whatToLookFor.length).toBeGreaterThan(0);
    expect(l.exercise.options.length).toBeGreaterThanOrEqual(2);
    const optionIds = new Set(l.exercise.options.map((o) => o.id));
    expect(l.exercise.correctOptionIds.every((id) => optionIds.has(id))).toBe(true);
    expect(l.exercise.answer).not.toBe("");
    expect(l.exercise.explanation).not.toBe("");
    expect(l.relatedConcepts.length).toBeGreaterThan(0);

    const blocks = [...l.explanation, ...l.example.blocks, ...(l.exercise.context ?? [])];
    const ruleIds = [...l.planRules, ...blocks.flatMap(blockRuleIds)];
    expect(ruleIds.filter((id) => !ruleById(id))).toEqual([]);
    expect(l.relatedConcepts.filter((id) => !conceptById(id))).toEqual([]);
  });

  it("never states a plan-specific appeals rule", () => {
    for (const l of lessons) {
      const text = [...l.explanation, ...l.example.blocks].flatMap(blockText).concat(l.exercise.explanation, l.exercise.answer);
      for (const s of text.flatMap((t) => t.split(/(?<=[.!?])\s+/))) {
        const negated = /\b(no|not|never|isn't|aren't|don't)\b/i.test(s);
        const planAppeal = /\bappeal/i.test(s) && /(safetywing|remote health|bywater)/i.test(s) && /\d+\s*days|deadline|must be filed|within \d/i.test(s);
        expect(planAppeal && !negated, `${l.id}: ${s}`).toBe(false);
      }
    }
  });

  it("every concept's lesson links resolve", () => {
    const ids = new Set(lessons.map((l) => l.id));
    for (const c of concepts) for (const id of c.lessonIds ?? []) expect(ids.has(id), `${c.id} → ${id}`).toBe(true);
  });
});
