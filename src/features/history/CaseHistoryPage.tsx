import { Link } from "react-router-dom";
import { Badge, Button, ButtonLink, Card, EmptyState, PageHeader } from "@/components/ui";
import { CASE_TYPE_LABELS } from "@/domain/taxonomy";
import { formatDate } from "@/lib/format/money";
import { downloadText } from "@/lib/portfolio/record";
import { useAttempts } from "@/lib/storage/attempts";
import { AttemptStatusBadge } from "./AttemptStatusBadge";

export function CaseHistoryPage() {
  const attempts = useAttempts();

  return (
    <>
      <PageHeader
        title="Case History"
        description="Every attempt is kept as a portfolio record: case facts, your investigation and answers, score, feedback and correct reasoning."
        actions={
          attempts.length > 0 && (
            <Button onClick={() => downloadText(`care-navigator-lab-attempts-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(attempts, null, 2), "application/json")}>
              Export all (JSON)
            </Button>
          )
        }
      />
      {attempts.length === 0 ? (
        <EmptyState title="No attempts yet" action={<ButtonLink to="/simulations" variant="primary">Go to simulations</ButtonLink>}>
          Completed cases appear here with their full review.
        </EmptyState>
      ) : (
        <Card bodyClassName="p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Case</th>
                <th>Type</th>
                <th>Status</th>
                <th className="text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap text-ink-muted">{formatDate(a.completedAt ?? a.startedAt)}</td>
                  <td>
                    <Link to={a.status === "in_progress" ? `/simulations/${a.caseId}` : `/history/${a.id}`} className="font-medium hover:underline">
                      {a.portfolioNumber ? `Case ${a.portfolioNumber}` : a.caseCode} · {a.caseTitle}
                    </Link>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {a.caseTypes.slice(0, 3).map((t) => <Badge key={t}>{CASE_TYPE_LABELS[t]}</Badge>)}
                      {a.caseTypes.length > 3 && <Badge>+{a.caseTypes.length - 3}</Badge>}
                    </div>
                  </td>
                  <td><AttemptStatusBadge status={a.status} /></td>
                  <td className="num text-right font-medium">{a.score?.total ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
