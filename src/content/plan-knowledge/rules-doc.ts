import { benefits, planRules, planSources, preAuthList, sourceById } from "./index";

const esc = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");

/**
 * Renders the knowledge base as Markdown (docs/plan-sources/RHUS_RULES.md).
 * Regenerate with `npm run kb:docs`. A test fails if the committed file is stale.
 */
export function renderRulesDoc(): string {
  const out: string[] = [];
  out.push(
    "# Remote Health USA: plan rules register",
    "",
    "> Generated from `src/content/plan-knowledge/`. Do not edit by hand. Run `npm run kb:docs`.",
    "",
    "## Sources",
    "",
    "| Id | Title | Authority | Version | URL | Accessed | Local extract |",
    "|---|---|---|---|---|---|---|",
    ...planSources.map((s) => `| \`${s.id}\` | ${esc(s.title)} | ${s.authority} | ${esc(s.documentVersion)} | ${s.url} | ${s.accessedAt} | \`${s.localExtract}\` |`),
    "",
    `Totals: ${planRules.length} rules (${planRules.filter((r) => r.status === "needs_clarification").length} need clarification), ${benefits.length} benefit entries, ${preAuthList.length} pre-authorization list items.`,
    "",
  );

  const sections = [...new Set(planRules.map((r) => r.section))];
  for (const section of sections) {
    out.push(`## ${section}`, "");
    for (const r of planRules.filter((x) => x.section === section)) {
      out.push(`### \`${r.id}\` · ${r.topic}`, "", `**Rule:** ${r.statement}`, "");
      out.push(`- **Status / confidence:** ${r.status} / ${r.confidence}`);
      for (const c of r.citations) {
        const s = sourceById(c.sourceId);
        out.push(
          `- **Source:** ${s?.title ?? c.sourceId} (${s?.documentVersion ?? "?"}) · ${s?.url ?? ""}${c.page ? ` · page ${c.page}` : ""} · section "${c.section}" · accessed ${s?.accessedAt ?? "?"}`,
          `  > ${c.quote}`,
        );
      }
      if (r.note) out.push(`- **Note:** ${r.note}`);
      out.push("");
    }
  }
  return out.join("\n");
}
