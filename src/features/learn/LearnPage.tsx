import { Link } from "react-router-dom";
import { Badge, Card, PageHeader, SourceBadge } from "@/components/ui";
import { CONCEPT_GROUPS, concepts } from "@/content/learn/concepts";
import { lessons } from "@/content/learn/lessons";
import { benefits, planRules, planSources, preAuthList } from "@/content/plan-knowledge";

export function LearnPage() {
  const unclear = planRules.filter((r) => r.status === "needs_clarification").length;
  return (
    <>
      <PageHeader
        title="Learn"
        description="Lessons, the Remote Health USA knowledge base, and a glossary of general concepts. Everything is labelled by source: official plan rule, general concept, or fictional example."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Lessons" className="lg:col-span-2" bodyClassName="p-0">
          <ol className="divide-y divide-line">
            {lessons.map((l) => (
              <li key={l.id}>
                <Link to={`/learn/lessons/${l.id}`} className="flex gap-3 px-4 py-3 hover:bg-slate-50">
                  <span className="num mt-0.5 w-6 shrink-0 text-right font-semibold text-ink-faint">{l.number}</span>
                  <span>
                    <span className="font-medium">{l.title}</span>
                    <span className="block text-[13px] text-ink-muted">{l.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Card>

        <div className="space-y-6">
          <Card title="Remote Health USA knowledge base" actions={<SourceBadge kind="plan_rule" />}>
            <p className="text-[13px] text-ink-muted">
              Plan rules taken from the official benefits overview and the public plan page. Each rule carries a verbatim citation with its page number.
            </p>
            <dl className="num mt-3 grid grid-cols-2 gap-2 text-[13px]">
              <div><dt className="text-ink-muted">Rules</dt><dd className="font-semibold">{planRules.length}</dd></div>
              <div><dt className="text-ink-muted">Benefits</dt><dd className="font-semibold">{benefits.length}</dd></div>
              <div><dt className="text-ink-muted">Pre-auth list</dt><dd className="font-semibold">{preAuthList.length} items</dd></div>
              <div><dt className="text-ink-muted">Need clarification</dt><dd className="font-semibold">{unclear}</dd></div>
            </dl>
            <p className="mt-3 text-[12px] text-ink-faint">Sources: {planSources.map((s) => s.documentVersion).join(" · ")}</p>
            <Link to="/learn/remote-health-usa" className="mt-3 inline-block text-[13px] font-medium text-brand hover:underline">Open knowledge base →</Link>
          </Card>
        </div>
      </div>

      <h2 className="mt-8 mb-3 text-[15px] font-semibold">General concepts <span className="ml-1 align-middle"><SourceBadge kind="general_concept" /></span></h2>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {CONCEPT_GROUPS.map((g) => (
          <Card key={g} title={g} bodyClassName="p-0">
            <ul className="divide-y divide-line">
              {concepts.filter((c) => c.group === g).map((c) => (
                <li key={c.id}>
                  <Link to={`/learn/concepts/${c.id}`} className="block px-4 py-2 hover:bg-slate-50">
                    <span className="text-[13px] font-medium">{c.term}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
      <p className="mt-4 text-[12px] text-ink-muted">
        <Badge tone="violet">Note</Badge> The lab teaches working familiarity for Care Navigator work. It is not coding, claims or insurance certification.
      </p>
    </>
  );
}
