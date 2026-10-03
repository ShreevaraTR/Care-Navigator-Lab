import { Link } from "react-router-dom";
import { Badge, Card, PageHeader } from "@/components/ui";
import { cases } from "@/content/cases";
import { CASE_TYPE_LABELS } from "@/domain/taxonomy";
import { useAttempts } from "@/lib/storage/attempts";

const DIFFICULTY_TONE = { foundation: "green", intermediate: "amber", advanced: "red" } as const;

export function SimulationsPage() {
  const attempts = useAttempts();

  return (
    <>
      <PageHeader
        title="Simulations"
        description="Each case is a realistic member ticket with an evidence packet. Investigate the documents, answer the tasks, and reply to the member."
      />

      <Card bodyClassName="p-0">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-28">Case</th>
              <th>Ticket</th>
              <th>Covers</th>
              <th className="w-28">Difficulty</th>
              <th className="w-28 text-right">Best score</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => {
              const mine = attempts.filter((a) => a.caseId === c.id);
              const best = Math.max(-1, ...mine.map((a) => a.score?.total ?? -1));
              const inProgress = mine.some((a) => a.status === "in_progress");
              return (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="font-mono text-[12px] text-ink-muted">
                    {c.code}
                    {c.isSample && <div className="mt-1"><Badge tone="violet">Sample</Badge></div>}
                  </td>
                  <td>
                    <Link to={`/simulations/${c.id}`} className="font-medium hover:underline">
                      {c.title}
                    </Link>
                    <p className="text-[13px] text-ink-muted">{c.summary}</p>
                    {inProgress && <div className="mt-1"><Badge tone="brand">In progress</Badge></div>}
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {c.caseTypes.map((t) => (
                        <Badge key={t}>{CASE_TYPE_LABELS[t]}</Badge>
                      ))}
                    </div>
                  </td>
                  <td>
                    <Badge tone={DIFFICULTY_TONE[c.difficulty]}>{c.difficulty}</Badge>
                  </td>
                  <td className="num text-right font-medium">{best >= 0 ? best : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <p className="mt-4 text-[12px] text-ink-muted">
        The 20 portfolio cases will be added in the content phase. Every case is validated against the Remote Health USA knowledge base before it can load.
      </p>
    </>
  );
}
