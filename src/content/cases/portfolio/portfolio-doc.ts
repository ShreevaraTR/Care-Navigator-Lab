import { CaseSchema, type SimulationCase } from "@/domain/case";
import { CATEGORY_LABELS, PORTFOLIO_SKILLS, SCORING_CATEGORIES, SKILL_LABELS } from "@/domain/taxonomy";
import { portfolioCases } from "./index";
import { blockedSpecs } from "./placeholders";

/** Rules every Remote Health USA case cites for the plan header / rules panel; omitted from the table for readability. */
const ALWAYS = new Set(["rhus.structure.self_funded_erisa", "rhus.structure.spd_governs"]);

const DIFFICULTY_LABEL: Record<SimulationCase["difficulty"], string> = {
  foundation: "Foundation",
  intermediate: "Intermediate",
  intermediate_plus: "Intermediate+",
  advanced: "Advanced",
  complex: "Complex",
  capstone: "Capstone",
};

/** Prior-authorization situations covered (hand-mapped; see each case's authorization documents). */
const PA_SITUATIONS: [string, string][] = [
  ["Required and correctly obtained", "4, 9, 14, 15 (current regimen)"],
  ["Required but never requested", "5, 20 (brace)"],
  ["Approved/notified but not linked to the claim", "17 (emergency notification); SAMPLE-01"],
  ["Expired before the date of service", "10, 18 (home health window)"],
  ["Covers a different date", "19"],
  ["Covers a different service", "6 (CT vs MRI), 15 (different drug)"],
  ["Covers a different provider", "19 (different lab)"],
  ["Diagnosis on the authorization doesn't match (laterality)", "20"],
  ["Request pending", "15 (oncology), 16 (pharmacy)"],
  ["Request denied", "18 (DME, medical necessity)"],
  ["Emergency situation (notification rules)", "17"],
];

const esc = (s: string) => s.replace(/\|/g, "\\|");

export function renderPortfolioDoc(): string {
  const cases = portfolioCases.map((c) => CaseSchema.parse(c));
  const out: string[] = [];
  out.push(
    "# 20-case portfolio",
    "",
    "> Generated from `src/content/cases/portfolio/`. Do not edit by hand. Run `npm run portfolio:docs`.",
    "",
    "Every case is set on **Remote Health USA**, validated against the plan knowledge base, and also cites `rhus.structure.self_funded_erisa` and `rhus.structure.spd_governs` (plan header / rules panel). Those two are omitted from the table.",
    "",
    "**Recommended warm-up:** `SAMPLE-01` (The $2,400 MRI bill) before Case 1.",
    "",
    "## Cases",
    "",
    "| # | Title | Difficulty | Primary scenario | Skills tested | Plan rules tested | Concepts tested | Recording priority |",
    "|---|---|---|---|---|---|---|---|",
  );
  for (const c of cases) {
    const rules = c.knowledge.planRules.filter((r) => !ALWAYS.has(r)).map((r) => `\`${r}\``).join("<br>");
    const concepts = c.knowledge.generalConcepts.filter((k) => !["member-communication", "care-coordination"].includes(k)).join(", ");
    out.push(
      `| ${c.portfolioNumber} | ${esc(c.title)} | ${DIFFICULTY_LABEL[c.difficulty]} | ${esc(c.scenario ?? "")} | ${c.skills.map((s) => SKILL_LABELS[s]).join(", ")} | ${rules} | ${concepts}, member-communication, care-coordination | ${c.recordingPriority} |`,
    );
  }
  for (const b of blockedSpecs)
    out.push(`| ${b.slot} | ${esc(b.title)} | **${b.status}** | ${esc(b.scenario)} | ${b.skills.map((s) => SKILL_LABELS[s]).join(", ")} | ${b.existingRules.map((r) => `\`${r}\``).join("<br>")} (+ SPD appeals rules, not yet sourced) | ${b.concepts.join(", ")} | after SPD |`);

  out.push("", "## Skill coverage", "", "| Skill | Cases | Count |", "|---|---|---|");
  for (const s of PORTFOLIO_SKILLS) {
    const ns = cases.filter((c) => c.skills.includes(s)).map((c) => c.portfolioNumber);
    out.push(`| ${SKILL_LABELS[s]} | ${ns.join(", ")} | ${ns.length} |`);
  }

  out.push(
    "",
    "Skill tags list each case's *primary* skills (3–8 per case). Practice is broader than the tags: every case grades a written investigation and a member reply, as the next table shows.",
    "",
    "## Scoring-category exposure",
    "",
    "| Category | Cases graded | Total rubric points across portfolio |",
    "|---|---|---|",
  );
  for (const cat of SCORING_CATEGORIES) {
    const graded = cases.filter((c) => c.tasks.some((t) => t.criteria.some((cr) => cr.category === cat)));
    const pts = cases.flatMap((c) => c.tasks.flatMap((t) => t.criteria)).filter((cr) => cr.category === cat).reduce((a, cr) => a + cr.points, 0);
    out.push(`| ${CATEGORY_LABELS[cat]} | ${graded.length} / ${cases.length} | ${pts} |`);
  }

  out.push("", "## Prior-authorization situations", "", "| Situation | Cases |", "|---|---|", ...PA_SITUATIONS.map(([a, b]) => `| ${a} | ${b} |`));

  out.push("", "## Task mix", "", "| # | Choice | Select-all | Amount | Written investigation | Member reply | Points (structured / self-graded) |", "|---|---|---|---|---|---|---|");
  for (const c of cases) {
    const n = (k: string) => c.tasks.filter((t) => t.kind === k).length;
    const auto = c.tasks.flatMap((t) => t.criteria).filter((cr) => cr.grading.mode !== "self").reduce((s, cr) => s + cr.points, 0);
    const self = c.tasks.flatMap((t) => t.criteria).filter((cr) => cr.grading.mode === "self").reduce((s, cr) => s + cr.points, 0);
    out.push(`| ${c.portfolioNumber} | ${n("single_choice")} | ${n("multi_choice")} | ${n("amount")} | ${n("free_text")} | ${n("member_response")} | ${auto} / ${self} |`);
  }

  out.push("", "## Case facts and assumptions", "");
  for (const c of cases) {
    out.push(`### ${c.portfolioNumber}. ${c.title}`, "", `**Ticket:** ${c.ticket.memberMessage}`, "");
    out.push(`**Case facts (fictional):** ${c.documents.filter((d) => d.provenance.kind === "case_fact").map((d) => d.title).join(" · ")}`, "");
    out.push("**Assumptions:**", ...c.assumptions.map((a) => `- ${a}`), "");
  }

  for (const b of blockedSpecs) {
    out.push(`## ${b.slot}: ${b.title} (${b.status})`, "", b.scenario, "", "**Blocked by:**", ...b.blockedBy.map((x) => `- ${x}`), "", "**Questions the SPD must answer (do not answer from general practice):**", ...b.openQuestions.map((x) => `- ${x}`), "");
  }

  out.push(
    "## Recording each case",
    "",
    "Each completed attempt is stored as a portfolio record: case number, date completed, score, investigation notes, answers, criterion-level feedback, hints used, reflection, and an optional recording URL. Export one case as Markdown from its review page, or all attempts as JSON from Case History. Record the browser separately and paste the link into the review page.",
    "",
  );
  return out.join("\n");
}
