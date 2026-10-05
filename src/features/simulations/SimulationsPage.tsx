import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Badge, ButtonLink, Card, PageHeader } from "@/components/ui";
import { cases } from "@/content/cases";
import { blockedSpecs } from "@/content/cases/portfolio/placeholders";
import type { SimulationCase } from "@/domain/case";
import { SKILL_LABELS } from "@/domain/taxonomy";
import { useAttempts } from "@/lib/storage/attempts";

export const DIFFICULTY_META: Record<SimulationCase["difficulty"], { label: string; tone: "green" | "blue" | "amber" | "red" | "violet" | "brand" }> = {
  foundation: { label: "Foundation", tone: "green" },
  intermediate: { label: "Intermediate", tone: "blue" },
  intermediate_plus: { label: "Intermediate+", tone: "amber" },
  advanced: { label: "Advanced", tone: "red" },
  complex: { label: "Complex", tone: "violet" },
  capstone: { label: "Capstone", tone: "brand" },
};

export function SimulationsPage() {
  const attempts = useAttempts();
  const warmups = cases.filter((c) => c.isSample);
  const portfolio = cases.filter((c) => !c.isSample).sort((a, b) => (a.portfolioNumber ?? 0) - (b.portfolioNumber ?? 0));
  const completedNumbers = new Set(attempts.filter((a) => a.status === "completed" && a.portfolioNumber).map((a) => a.portfolioNumber));

  return (
    <>
      <PageHeader
        title="Simulations"
        description="Twenty Care Navigator tickets in order of difficulty. Each is validated against the Remote Health USA knowledge base. Investigate the documents, answer the tasks, and reply to the member."
        actions={<Badge tone="green">{completedNumbers.size} / {portfolio.length} portfolio cases completed</Badge>}
      />

      <Card bodyClassName="p-0">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-24">Case</th>
              <th>Ticket</th>
              <th>Primary skills</th>
              <th className="w-28">Recording</th>
              <th className="w-24 text-right">Best score</th>
              <th className="w-28"><span className="sr-only">Open</span></th>
            </tr>
          </thead>
          <tbody>
            {warmups.length > 0 && <TierRow label="Warm-up" />}
            {warmups.map((c) => <CaseRow key={c.id} c={c} />)}
            {portfolio.map((c, i) => (
              <Fragment key={c.id}>
                {(i === 0 || portfolio[i - 1].difficulty !== c.difficulty) && <TierRow label={DIFFICULTY_META[c.difficulty].label} />}
                <CaseRow c={c} />
              </Fragment>
            ))}
            {blockedSpecs.length > 0 && <TierRow label="Blocked: waiting on source material" />}
            {blockedSpecs.map((b) => (
              <tr key={b.slot} className="opacity-70">
                <td className="font-mono text-[12px] text-ink-muted">{b.slot}</td>
                <td>
                  <span className="font-medium">{b.title}</span>
                  <p className="text-[13px] text-ink-muted">{b.scenario}</p>
                  <p className="mt-1 text-[12px] text-ink-muted">Blocked by: {b.blockedBy.join("; ")}</p>
                </td>
                <td><Badge tone="red">{b.status}</Badge></td>
                <td>—</td>
                <td className="text-right">—</td>
                <td />
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <p className="mt-4 text-[12px] text-ink-muted">
        Full portfolio plan with plan rules, concepts and coverage: <span className="font-mono">docs/20_CASE_PORTFOLIO.md</span>
      </p>
    </>
  );

  function CaseRow({ c }: { c: SimulationCase }) {
    const mine = attempts.filter((a) => a.caseId === c.id);
    const best = Math.max(-1, ...mine.map((a) => a.score?.total ?? -1));
    const inProgress = mine.some((a) => a.status === "in_progress");
    return (
      <tr className="hover:bg-slate-50">
        <td className="font-mono text-[12px] text-ink-muted">
          {c.portfolioNumber ? <span className="text-[14px] font-semibold text-ink">{c.portfolioNumber}</span> : c.code}
        </td>
        <td>
          <Link to={`/simulations/${c.id}`} className="font-medium hover:underline">{c.title}</Link>
          <p className="text-[13px] text-ink-muted">{c.summary}</p>
          {inProgress && <div className="mt-1"><Badge tone="brand">In progress</Badge></div>}
        </td>
        <td>
          <div className="flex flex-wrap gap-1">{c.skills.map((s) => <Badge key={s}>{SKILL_LABELS[s]}</Badge>)}</div>
        </td>
        <td>{c.recordingPriority ? <Badge tone={c.recordingPriority === "high" ? "brand" : "neutral"}>{c.recordingPriority}</Badge> : <Badge tone="violet">warm-up</Badge>}</td>
        <td className="num text-right font-medium">{best >= 0 ? best : "—"}</td>
        <td className="text-right">
          <ButtonLink to={`/simulations/${c.id}`} variant={inProgress ? "secondary" : "primary"}>{inProgress ? "Continue" : "Practice"}</ButtonLink>
        </td>
      </tr>
    );
  }
}

function TierRow({ label }: { label: string }) {
  return (
    <tr>
      <td colSpan={6} className="bg-slate-50 py-1.5 text-[11px] font-semibold tracking-wide text-ink-muted uppercase">{label}</td>
    </tr>
  );
}
