import { Link } from "react-router-dom";
import { Card, SourceBadge } from "@/components/ui";
import { conceptById } from "@/content/learn/concepts";
import { ruleById } from "@/content/plan-knowledge";
import type { SimulationCase } from "@/domain/case";
import { RuleLink } from "@/features/learn/RuleViews";

/** The four knowledge categories a case draws on, kept visibly separate. */
export function KnowledgeTested({ c }: { c: SimulationCase }) {
  return (
    <Card title="Knowledge this case tests">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <div className="mb-1.5"><SourceBadge kind="plan_rule" /></div>
          {c.plan.planId === "rhus" ? (
            <ul className="space-y-1 text-[13px]">
              {c.knowledge.planRules.map((id) => (
                <li key={id}>
                  {ruleById(id)?.topic ?? id} <RuleLink id={id} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-ink-muted">None. This case uses a fictional plan.</p>
          )}
        </div>
        <div>
          <div className="mb-1.5"><SourceBadge kind="general_concept" /></div>
          <div className="flex flex-wrap gap-1">
            {c.knowledge.generalConcepts.map((id) => (
              <Link key={id} to={`/learn/concepts/${id}`} className="rounded border border-line px-1.5 py-0.5 text-[12px] hover:bg-slate-50">
                {conceptById(id)?.term ?? id}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1.5"><SourceBadge kind="case_fact" /></div>
          <p className="text-[13px] text-ink-muted">{c.documents.filter((d) => d.provenance.kind === "case_fact").map((d) => d.title).join(" · ")}</p>
        </div>
        <div>
          <div className="mb-1.5"><SourceBadge kind="assumption" /></div>
          <ul className="list-disc space-y-0.5 pl-4 text-[13px] text-ink-muted">{c.assumptions.map((a) => <li key={a}>{a}</li>)}</ul>
        </div>
      </div>
    </Card>
  );
}
