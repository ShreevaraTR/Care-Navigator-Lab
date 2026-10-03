import { describe, expect, it } from "vitest";
import { cases } from "@/content/cases";
import { planRules } from "@/content/plan-knowledge";
import { buildGraderBrief } from "./grader-brief";

describe("grader brief", () => {
  const c = cases[0];
  const task = c.tasks.find((t) => t.kind === "free_text")!;
  const brief = buildGraderBrief(c, task, "trainee text");

  it("includes every declared plan rule verbatim", () => {
    for (const id of c.knowledge.planRules) expect(brief).toContain(`[${id}]`);
  });

  it("includes no plan rule the case did not declare", () => {
    const undeclared = planRules.filter((r) => !c.knowledge.planRules.includes(r.id));
    for (const r of undeclared) expect(brief).not.toContain(`[${r.id}]`);
  });

  it("forbids inventing policy, including appeals rules", () => {
    expect(brief).toMatch(/Do not state, imply or rely on any other SafetyWing \/ Remote Health USA rule, including appeals/);
  });
});
