import { useParams } from "react-router-dom";
import { ButtonLink, Card, EmptyState, PageHeader, SourceBadge } from "@/components/ui";
import { topicById } from "@/content/learn/topics";
import { cases } from "@/content/cases";
import { TopicStatusBadge } from "./LearnPage";

export function TopicPage() {
  const { topicId } = useParams();
  const topic = topicId ? topicById(topicId) : undefined;
  if (!topic) return <EmptyState title="Topic not found" action={<ButtonLink to="/learn">All topics</ButtonLink>} />;

  const relatedCases = cases.filter((c) => c.debrief.conceptsToReview.includes(topic.id));

  return (
    <>
      <PageHeader
        eyebrow={<ButtonLink to="/learn" variant="ghost" className="-ml-3">← Learn</ButtonLink>}
        title={topic.title}
        description={topic.summary}
        actions={
          <>
            <SourceBadge kind={topic.sourceKind} />
            <TopicStatusBadge status={topic.status} />
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Lesson" className="lg:col-span-2">
          {topic.status === "awaiting_source" ? (
            <p className="text-ink-muted">
              This topic covers plan-specific rules. It stays locked until authoritative plan material is added to the
              plan-source registry (see <code className="font-mono text-[12px]">docs/plan-sources/README.md</code>). The lab will
              not invent plan policy.
            </p>
          ) : (
            <p className="text-ink-muted">Full lesson content is planned for a later phase. For now, this page holds the outline entry.</p>
          )}
        </Card>
        <Card title="Practised in">
          {relatedCases.length === 0 ? (
            <p className="text-ink-muted">No cases reference this topic yet.</p>
          ) : (
            <ul className="space-y-1.5">
              {relatedCases.map((c) => (
                <li key={c.id}>
                  <ButtonLink to={`/simulations/${c.id}`} variant="ghost" className="-ml-3">
                    {c.code} · {c.title}
                  </ButtonLink>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
