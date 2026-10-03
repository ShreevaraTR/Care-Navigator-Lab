import type { Attempt } from "@/domain/attempt";
import type { SimulationCase } from "@/domain/case";
import { CASE_TYPE_LABELS, CATEGORY_LABELS, SKILL_LABELS } from "@/domain/taxonomy";
import { formatCents } from "@/lib/format/money";
import { allCriteria } from "@/lib/scoring/scoring";

/**
 * Builds the portfolio record for a completed attempt: case number, date, type, skills,
 * case facts, investigation, final answer, score, feedback, mistakes, correct reasoning.
 */
export function attemptToMarkdown(attempt: Attempt, c: SimulationCase): string {
  const lines: string[] = [];
  const caseNo = attempt.portfolioNumber ? `Case ${attempt.portfolioNumber}` : attempt.caseCode;
  const date = attempt.completedAt ?? attempt.submittedAt ?? attempt.startedAt;

  lines.push(`# ${caseNo}: ${attempt.caseTitle}`, "");
  lines.push(`- **Date:** ${date.slice(0, 10)}`);
  lines.push(`- **Case type:** ${attempt.caseTypes.map((t) => CASE_TYPE_LABELS[t]).join(", ")}`);
  lines.push(`- **Skills tested:** ${attempt.skills.map((s) => SKILL_LABELS[s]).join(", ")}`);
  lines.push(`- **Score:** ${attempt.score ? `${attempt.score.total}/100` : "not scored"}`);
  lines.push(`- **Hints used:** ${attempt.hintsUsed.length ? attempt.hintsUsed.join(", ") : "none"}`);
  lines.push(`- **Plan:** ${c.plan.planId === "rhus" ? "Remote Health USA (official rules cited)" : `${c.plan.name} (fictional)`}${c.isSample ? " · sample case" : ""}`);
  if (c.knowledge.planRules.length) lines.push(`- **Plan rules tested:** ${c.knowledge.planRules.join(", ")}`);
  lines.push("");

  lines.push("## Case facts", "", `> ${c.ticket.memberMessage}`, "");
  lines.push(`- Member: ${c.member.name} (${c.member.memberId})`);
  lines.push(`- Plan: ${c.plan.name}`);
  lines.push(`- Provider: ${c.provider.name} (${c.provider.networkStatus.replace(/_/g, "-")})`);
  for (const code of c.codes) lines.push(`- ${code.system} ${code.code}: ${code.plainLanguage}`);
  lines.push("");

  lines.push("## Investigation notes", "", attempt.investigationNotes.trim() || "_None recorded._", "");

  lines.push("## Answers", "");
  for (const task of c.tasks) {
    const a = attempt.answers[task.id];
    let text = "_No answer._";
    if (a?.kind === "text") text = a.text.trim() || text;
    if (a?.kind === "amount" && a.cents !== null) text = formatCents(a.cents);
    if (a?.kind === "choice" && a.optionIds.length)
      text = a.optionIds.map((id) => task.options?.find((o) => o.id === id)?.label ?? id).join("; ");
    lines.push(`**${task.prompt}**`, "", text, "");
  }

  if (attempt.score) {
    lines.push("## Score breakdown", "", "| Category | Earned | Weighted |", "|---|---|---|");
    for (const cat of attempt.score.categories)
      lines.push(`| ${CATEGORY_LABELS[cat.category]} | ${cat.earned}/${cat.available} | ${cat.weighted.toFixed(1)}/${cat.weight} |`);
    lines.push("");

    lines.push("## Mistakes and lost points", "");
    if (!attempt.score.lostPoints.length) lines.push("_No points lost._");
    for (const lp of attempt.score.lostPoints)
      lines.push(`- **−${lp.pointsLost} (${CATEGORY_LABELS[lp.category]})**: ${lp.explanation}`);
    lines.push("");

    lines.push("## Identified correctly", "");
    for (const { criterion } of allCriteria(c))
      if (attempt.criterionResults[criterion.id]?.outcome === "met") lines.push(`- ${criterion.expectation}`);
    lines.push("");
  }

  lines.push("## Correct reasoning", "", c.debrief.whatHappened, "");
  for (const r of c.debrief.correctReasoning) lines.push(`- ${r}`);
  lines.push("", "## Suggested member response", "", c.debrief.modelMemberResponse, "");
  if (attempt.reflection) lines.push("## Reflection", "", attempt.reflection, "");
  if (attempt.recordingUrl) lines.push(`Recording: ${attempt.recordingUrl}`, "");

  return lines.join("\n");
}

export function downloadText(filename: string, text: string, mime = "text/markdown") {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
