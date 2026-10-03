import { Link } from "react-router-dom";
import { Badge, ButtonLink, Card, EmptyState, PageHeader, ScoreBar, StatTile } from "@/components/ui";
import { cases } from "@/content/cases";
import { computeDashboardStats } from "@/lib/stats/dashboard";
import { useAttempts } from "@/lib/storage/attempts";
import { AttemptStatusBadge } from "@/features/history/AttemptStatusBadge";
import { formatDate } from "@/lib/format/money";

export function DashboardPage() {
  const attempts = useAttempts();
  const stats = computeDashboardStats(attempts);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your progress across simulated Care Navigator tickets."
        actions={<ButtonLink to="/simulations" variant="primary">Open simulations</ButtonLink>}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatTile label="Cases completed" value={stats.casesCompleted} />
        <StatTile label="Average score" value={stats.averageScore ?? "—"} hint={stats.averageScore !== null ? "out of 100" : undefined} />
        <StatTile label="EOB investigations" value={stats.eobInvestigations} />
        <StatTile label="Claims investigations" value={stats.claimsInvestigations} />
        <StatTile label="Prior auth cases" value={stats.priorAuthCases} />
        <StatTile label="CPT/ICD exercises" value={stats.codingExercises} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card title="Recent cases" className="lg:col-span-2" bodyClassName="p-0">
          {stats.recent.length === 0 ? (
            <div className="p-4">
              <EmptyState title="No cases yet" action={<ButtonLink to="/simulations" variant="primary">Start your first case</ButtonLink>}>
                {cases.length} case{cases.length === 1 ? "" : "s"} available.
              </EmptyState>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Case</th>
                  <th>Started</th>
                  <th>Status</th>
                  <th className="text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td>
                      <Link to={a.status === "in_progress" ? `/simulations/${a.caseId}` : `/history/${a.id}`} className="font-medium hover:underline">
                        {a.caseCode} · {a.caseTitle}
                      </Link>
                    </td>
                    <td className="text-ink-muted">{formatDate(a.startedAt)}</td>
                    <td><AttemptStatusBadge status={a.status} /></td>
                    <td className="num text-right font-medium">{a.score ? a.score.total : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card title="Areas needing improvement">
          {stats.weakAreas.length === 0 ? (
            <p className="text-ink-muted">Complete a case to see your weakest scoring categories.</p>
          ) : (
            <ul className="space-y-3">
              {stats.weakAreas.map((w) => (
                <li key={w.category}>
                  <div className="mb-1 flex justify-between text-[13px]">
                    <span>{w.label}</span>
                    <span className="num text-ink-muted">{w.averagePct}%</span>
                  </div>
                  <ScoreBar pct={w.averagePct} />
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 border-t border-line pt-3 text-[12px] text-ink-muted">
            Averaged across completed cases. <Badge>Lowest first</Badge>
          </div>
        </Card>
      </div>
    </>
  );
}
