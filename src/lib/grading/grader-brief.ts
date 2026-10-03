import { conceptById } from "@/content/learn/concepts";
import { ruleById, sourceById } from "@/content/plan-knowledge";
import type { RubricCriterion, SimulationCase, Task } from "@/domain/case";

/**
 * Grader contract.
 *
 * Any automated (AI) grader must grade ONLY from the knowledge this brief contains: the plan rules
 * the case declares (verbatim, with citations), the general concepts it declares, its stated case
 * facts and assumptions, and the rubric. It must never introduce plan rules of its own. The brief
 * is plain text so it can be handed to any model, and it is unit tested.
 */

export const GRADER_RULES = [
  "Grade only against the rubric criteria below. Do not add new criteria.",
  "Treat the PLAN RULES section as the complete set of Remote Health USA policy available for this case. Do not state, imply or rely on any other SafetyWing / Remote Health USA rule, including appeals procedures, deadlines, network contracts, or cost-sharing amounts, unless it appears verbatim in PLAN RULES.",
  "If a trainee cites a plan rule that is not in PLAN RULES, do not confirm it. Mark it 'unsupported by the provided sources'.",
  "General insurance concepts may be applied only as defined in GENERAL CONCEPTS. Do not present them as plan policy.",
  "Case facts come only from the CASE FACTS section. Do not invent claim details.",
  "Every point lost must be explained with reference to a criterion and its basis (plan rule id, concept id, or document id).",
];

export function buildGraderBrief(c: SimulationCase, task: Task, answer: string): string {
  const lines: string[] = [];
  lines.push("# GRADER INSTRUCTIONS", ...GRADER_RULES.map((r, i) => `${i + 1}. ${r}`), "");

  lines.push("# PLAN RULES (official, verbatim from the knowledge base)");
  if (c.plan.planId !== "rhus") lines.push("None. This case uses a fictional plan. No SafetyWing / Remote Health USA rules apply.");
  for (const id of c.knowledge.planRules) {
    const r = ruleById(id);
    if (!r) continue;
    const cites = r.citations.map((ct) => `${sourceById(ct.sourceId)?.title ?? ct.sourceId}${ct.page ? ` p.${ct.page}` : ""}`).join("; ");
    lines.push(`- [${r.id}] (${r.status}) ${r.statement} Source: ${cites}`);
  }
  lines.push("");

  lines.push("# GENERAL CONCEPTS (not plan-specific)");
  for (const id of c.knowledge.generalConcepts) {
    const k = conceptById(id);
    if (k) lines.push(`- [${k.id}] ${k.term}: ${k.definition}`);
  }
  lines.push("");

  lines.push("# CASE FACTS (fictional)", `Member message: ${c.ticket.memberMessage}`);
  for (const d of c.documents) lines.push(`- [${d.id}] ${d.title} (${d.type}): ${JSON.stringify(d)}`);
  lines.push("", "# ASSUMPTIONS", ...c.assumptions.map((a, i) => `${i}. ${a}`), "");

  lines.push("# TASK", task.prompt, "", "# MODEL ANSWER", task.kind === "member_response" ? c.debrief.modelMemberResponse : task.modelAnswer, "");
  lines.push("# RUBRIC", ...task.criteria.map(criterionLine), "");
  lines.push("# TRAINEE ANSWER", answer);
  return lines.join("\n");
}

const criterionLine = (cr: RubricCriterion) =>
  `- [${cr.id}] (${cr.category}, ${cr.points} pts) ${cr.expectation} | basis: ${cr.basis
    .map((b) => (b.kind === "plan_rule" ? b.ruleId : b.kind === "general_concept" ? `concept:${b.conceptId}` : b.kind === "case_fact" ? `doc:${b.documentId}` : `assumption:${b.assumptionIndex}`))
    .join(", ")} | if missed: ${cr.feedbackIfMissed}`;
