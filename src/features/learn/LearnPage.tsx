import { Link } from "react-router-dom";
import { Badge, Card, PageHeader, SourceBadge } from "@/components/ui";
import { LEARN_GROUPS, learnTopics, type TopicStatus } from "@/content/learn/topics";

export function TopicStatusBadge({ status }: { status: TopicStatus }) {
  if (status === "published") return <Badge tone="green">Published</Badge>;
  if (status === "awaiting_source") return <Badge tone="red">Awaiting plan source</Badge>;
  return <Badge>Outline</Badge>;
}

export function LearnPage() {
  return (
    <>
      <PageHeader
        title="Learn"
        description="Structured reference for the concepts tested in simulations. Each topic is labelled by source: general insurance concept or actual plan rule."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {LEARN_GROUPS.map((group) => (
          <Card key={group} title={group} bodyClassName="p-0">
            <ul className="divide-y divide-line">
              {learnTopics
                .filter((t) => t.group === group)
                .map((t) => (
                  <li key={t.id}>
                    <Link to={`/learn/${t.id}`} className="block px-4 py-3 hover:bg-slate-50">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium">{t.title}</span>
                        <span className="flex gap-1.5">
                          <SourceBadge kind={t.sourceKind} />
                          <TopicStatusBadge status={t.status} />
                        </span>
                      </div>
                      <p className="mt-0.5 text-[13px] text-ink-muted">{t.summary}</p>
                    </Link>
                  </li>
                ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}
