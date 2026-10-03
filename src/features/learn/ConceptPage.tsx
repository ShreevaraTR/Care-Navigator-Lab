import { Link, useParams } from "react-router-dom";
import { ButtonLink, Card, EmptyState, PageHeader, SourceBadge } from "@/components/ui";
import { cases } from "@/content/cases";
import { conceptById } from "@/content/learn/concepts";
import { lessonById } from "@/content/learn/lessons";

export function ConceptPage() {
  const { conceptId } = useParams();
  const concept = conceptId ? conceptById(conceptId) : undefined;
  if (!concept) return <EmptyState title="Concept not found" action={<ButtonLink to="/learn">Learn</ButtonLink>} />;

  const usedIn = cases.filter((c) => c.knowledge.generalConcepts.includes(concept.id));

  return (
    <>
      <PageHeader
        eyebrow={<ButtonLink to="/learn" variant="ghost" className="-ml-3">← Learn</ButtonLink>}
        title={concept.term}
        actions={<SourceBadge kind="general_concept" />}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Definition" className="lg:col-span-2">
          <p className="text-[15px] leading-relaxed">{concept.definition}</p>
          <p className="mt-3 text-[12px] text-ink-muted">A general U.S. health-insurance concept, not a Remote Health USA rule. For plan-specific values, see the knowledge base.</p>
        </Card>
        <div className="space-y-6">
          <Card title="Taught in">
            <ul className="space-y-1 text-[13px]">
              {(concept.lessonIds ?? []).map((id) => {
                const l = lessonById(id);
                return l && <li key={id}><Link className="text-brand hover:underline" to={`/learn/lessons/${id}`}>Lesson {l.number}: {l.title}</Link></li>;
              })}
            </ul>
          </Card>
          <Card title="Practised in">
            {usedIn.length === 0 ? <p className="text-ink-muted">No cases yet.</p> : (
              <ul className="space-y-1 text-[13px]">
                {usedIn.map((c) => <li key={c.id}><Link className="text-brand hover:underline" to={`/simulations/${c.id}`}>{c.code} · {c.title}</Link></li>)}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
