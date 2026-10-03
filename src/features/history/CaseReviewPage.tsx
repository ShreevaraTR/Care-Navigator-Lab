import { Link, useParams } from "react-router-dom";
import { Badge, Button, ButtonLink, Card, EmptyState, PageHeader, ScoreBar, cx } from "@/components/ui";
import { caseById } from "@/content/cases";
import { conceptById } from "@/content/learn/concepts";
import { RuleLink } from "@/features/learn/RuleViews";
import { KnowledgeTested } from "@/features/simulations/KnowledgeTested";
import type { Answer, Attempt, CriterionOutcome } from "@/domain/attempt";
import type { Basis, RubricCriterion, SimulationCase, Task } from "@/domain/case";
import { CATEGORY_LABELS, SKILL_LABELS } from "@/domain/taxonomy";
import { formatCents, formatDate } from "@/lib/format/money";
import { attemptToMarkdown, downloadText } from "@/lib/portfolio/record";
import { allCriteria, computeScore, pendingSelfReview } from "@/lib/scoring/scoring";
import { attemptRepository, useAttempt } from "@/lib/storage/attempts";
import { AttemptStatusBadge } from "./AttemptStatusBadge";

export function CaseReviewPage() {
  const { attemptId } = useParams();
  const attempt = useAttempt(attemptId);
  const c = attempt ? caseById(attempt.caseId) : undefined;

  if (!attempt) return <EmptyState title="Attempt not found" action={<ButtonLink to="/history">Case history</ButtonLink>} />;
  if (!c) return <EmptyState title="This case is no longer available">The attempt record is kept, but its case content was removed.</EmptyState>;

  const versionMismatch = attempt.caseVersion !== c.version;

  return (
    <>
      <PageHeader
        eyebrow={<ButtonLink to="/history" variant="ghost" className="-ml-3">← Case history</ButtonLink>}
        title={`${attempt.portfolioNumber ? `Case ${attempt.portfolioNumber}` : attempt.caseCode} · ${attempt.caseTitle}`}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <AttemptStatusBadge status={attempt.status} />
            <span>Started {formatDate(attempt.startedAt)}</span>
            {attempt.completedAt && <span>· Completed {formatDate(attempt.completedAt)}</span>}
          </span>
        }
        actions={
          attempt.status === "completed" && (
            <>
              <Button onClick={() => downloadText(`${attempt.caseCode}-${attempt.id.slice(0, 8)}.md`, attemptToMarkdown(attempt, c))}>Export record (.md)</Button>
              <ButtonLink to={`/simulations/${c.id}`}>Retry case</ButtonLink>
            </>
          )
        }
      />
      {versionMismatch && (
        <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] text-amber-900">
          This case has been updated since this attempt (v{attempt.caseVersion} → v{c.version}). The review below uses the current content.
        </p>
      )}
      {attempt.status === "awaiting_self_review" ? <SelfReview c={c} attempt={attempt} /> : attempt.status === "completed" ? <Report c={c} attempt={attempt} /> : (
        <EmptyState title="Attempt still in progress" action={<ButtonLink to={`/simulations/${c.id}`} variant="primary">Continue case</ButtonLink>} />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Self-review: trainee grades free-text criteria against the model reasoning.
// ---------------------------------------------------------------------------

const OUTCOMES: { id: CriterionOutcome; label: string }[] = [
  { id: "met", label: "Met" },
  { id: "partial", label: "Partly" },
  { id: "missed", label: "Missed" },
];

function SelfReview({ c, attempt }: { c: SimulationCase; attempt: Attempt }) {
  const selfTasks = c.tasks.filter((t) => t.criteria.some((cr) => cr.grading.mode === "self"));
  const remaining = pendingSelfReview(c, attempt.criterionResults).length;

  const grade = (criterionId: string, outcome: CriterionOutcome) =>
    attemptRepository.save({ ...attempt, criterionResults: { ...attempt.criterionResults, [criterionId]: { outcome, gradedBy: "self" } } });

  const finalize = () => {
    attemptRepository.save({
      ...attempt,
      status: "completed",
      completedAt: new Date().toISOString(),
      score: computeScore(c, attempt.criterionResults),
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <p>
          Structured answers were graded automatically. For written answers, compare your response with the model answer and mark each
          criterion honestly. <span className="text-ink-muted">Automated or reviewer grading can replace this step later.</span>
        </p>
      </Card>
      {selfTasks.map((t) => (
        <Card key={t.id} title={t.prompt}>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h4 className="mb-1 text-[12px] font-semibold text-ink-muted uppercase">Your answer</h4>
              <AnswerText task={t} answer={attempt.answers[t.id]} />
            </div>
            <div>
              <h4 className="mb-1 text-[12px] font-semibold text-ink-muted uppercase">Model answer</h4>
              <p className="whitespace-pre-line text-[13px]">
                {t.kind === "member_response" ? c.debrief.modelMemberResponse : t.modelAnswer}
              </p>
            </div>
          </div>
          <ul className="mt-4 divide-y divide-line rounded-md border border-line">
            {t.criteria.filter((cr) => cr.grading.mode === "self").map((cr) => {
              const current = attempt.criterionResults[cr.id]?.outcome;
              return (
                <li key={cr.id} className="flex flex-wrap items-center justify-between gap-3 px-3 py-2">
                  <div className="min-w-0 flex-1 text-[13px]">
                    {cr.expectation}
                    <div className="text-[11px] text-ink-muted">{CATEGORY_LABELS[cr.category]} · {cr.points} pts</div>
                  </div>
                  <div className="flex gap-1">
                    {OUTCOMES.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => grade(cr.id, o.id)}
                        className={cx(
                          "rounded-md border px-2.5 py-1 text-[12px] font-medium",
                          current === o.id ? "border-brand bg-brand text-white" : "border-line bg-white hover:bg-slate-50",
                        )}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      ))}
      <div className="flex items-center justify-end gap-3">
        <span className="text-[12px] text-ink-muted">{remaining ? `${remaining} criteria left to grade` : "All criteria graded"}</span>
        <Button variant="primary" disabled={remaining > 0} onClick={finalize}>Finalize score</Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function Report({ c, attempt }: { c: SimulationCase; attempt: Attempt }) {
  const score = attempt.score!;
  const met = allCriteria(c).filter(({ criterion }) => attempt.criterionResults[criterion.id]?.outcome === "met");
  const improve = score.categories.filter((x) => x.available > 0 && x.earned / x.available < 0.7);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Score">
          <div className="num text-[40px] leading-none font-semibold">
            {score.total}
            <span className="text-[16px] font-normal text-ink-muted"> / 100</span>
          </div>
          <ul className="mt-4 space-y-2.5">
            {score.categories.map((cat) => (
              <li key={cat.category}>
                <div className="mb-1 flex justify-between text-[12px]">
                  <span>{CATEGORY_LABELS[cat.category]}</span>
                  <span className="num text-ink-muted">{cat.weighted.toFixed(1)} / {cat.weight}</span>
                </div>
                <ScoreBar pct={(cat.earned / cat.available) * 100} />
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-ink-faint">Normalised over the categories this case tests.</p>
        </Card>

        <Card title="What you identified correctly" className="lg:col-span-2">
          {met.length === 0 ? <p className="text-ink-muted">Nothing fully met this time.</p> : (
            <ul className="space-y-1.5 text-[13px]">
              {met.map(({ criterion }) => (
                <li key={criterion.id} className="flex gap-2"><span className="text-emerald-600">✓</span>{criterion.feedbackIfMet ?? criterion.expectation}</li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card title="What you missed, and why it matters">
        {score.lostPoints.length === 0 ? <p className="text-ink-muted">No points lost.</p> : (
          <ul className="divide-y divide-line">
            {score.lostPoints.map((lp) => (
              <li key={lp.criterionId} className="flex gap-4 py-2.5 first:pt-0 last:pb-0">
                <div className="num w-14 shrink-0 text-right font-semibold text-rose-700">−{lp.pointsLost}</div>
                <div className="text-[13px]">
                  <div className="text-[11px] font-medium text-ink-muted">{CATEGORY_LABELS[lp.category]}</div>
                  {lp.explanation}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Correct reasoning">
        <p className="mb-3">{c.debrief.whatHappened}</p>
        <ol className="list-decimal space-y-1 pl-5 text-[13px]">
          {c.debrief.correctReasoning.map((r) => <li key={r}>{r}</li>)}
        </ol>
      </Card>

      <Card title="Task-by-task" bodyClassName="p-0">
        <ul className="divide-y divide-line">
          {c.tasks.map((t, i) => <TaskReview key={t.id} n={i + 1} c={c} task={t} attempt={attempt} />)}
        </ul>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Suggested member response">
          <p className="text-[13px] whitespace-pre-line">{c.debrief.modelMemberResponse}</p>
        </Card>
        <Card title="Your member response">
          <AnswerText task={c.tasks.find((t) => t.kind === "member_response")} answer={attempt.answers[c.tasks.find((t) => t.kind === "member_response")?.id ?? ""]} />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Skills tested">
          <div className="flex flex-wrap gap-1">{attempt.skills.map((s) => <Badge key={s}>{SKILL_LABELS[s]}</Badge>)}</div>
        </Card>
        <Card title="Areas to improve">
          {improve.length === 0 ? <p className="text-ink-muted">Every tested category is at 70% or above.</p> : (
            <ul className="space-y-1 text-[13px]">{improve.map((x) => <li key={x.category}>{CATEGORY_LABELS[x.category]} ({Math.round((x.earned / x.available) * 100)}%)</li>)}</ul>
          )}
        </Card>
        <Card title="Concepts to review">
          <ul className="space-y-1 text-[13px]">
            {c.debrief.conceptsToReview.map((id) => {
              const t = conceptById(id);
              return <li key={id}>{t ? <Link className="text-brand hover:underline" to={`/learn/concepts/${id}`}>{t.term}</Link> : id}</li>;
            })}
          </ul>
        </Card>
      </div>

      <KnowledgeTested c={c} />

      <PortfolioFields attempt={attempt} />
    </div>
  );
}

function TaskReview({ n, c, task, attempt }: { n: number; c: SimulationCase; task: Task; attempt: Attempt }) {
  return (
    <li className="px-4 py-4">
      <div className="mb-2 font-medium"><span className="num text-ink-muted">{n}.</span> {task.prompt}</div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <h4 className="mb-1 text-[11px] font-semibold text-ink-muted uppercase">Your answer</h4>
          <AnswerText task={task} answer={attempt.answers[task.id]} />
        </div>
        <div>
          <h4 className="mb-1 text-[11px] font-semibold text-ink-muted uppercase">Model answer</h4>
          <p className="text-[13px]">{task.modelAnswer}</p>
        </div>
      </div>
      <ul className="mt-3 space-y-1">
        {task.criteria.map((cr) => <CriterionLine key={cr.id} c={c} cr={cr} outcome={attempt.criterionResults[cr.id]?.outcome ?? "missed"} gradedBy={attempt.criterionResults[cr.id]?.gradedBy} />)}
      </ul>
    </li>
  );
}

function CriterionLine({ c, cr, outcome, gradedBy }: { c: SimulationCase; cr: RubricCriterion; outcome: CriterionOutcome; gradedBy?: string }) {
  const tone = outcome === "met" ? "green" : outcome === "partial" ? "amber" : "red";
  return (
    <li className="flex items-start gap-2 text-[12px]">
      <Badge tone={tone}>{outcome}</Badge>
      <span className="text-ink-muted">
        {cr.expectation} <span className="text-ink-faint">({CATEGORY_LABELS[cr.category]}, {cr.points} pts{gradedBy ? `, ${gradedBy}-graded` : ""})</span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px]">
          <span className="text-ink-faint">Basis:</span>
          {cr.basis.map((b, i) => <BasisChip key={i} c={c} b={b} />)}
        </span>
      </span>
    </li>
  );
}

/** Shows what makes the expected answer true: an official rule, a general concept, or a case fact. */
function BasisChip({ c, b }: { c: SimulationCase; b: Basis }) {
  if (b.kind === "plan_rule") return <span className="inline-flex items-center gap-1"><Badge tone="blue">Plan rule</Badge><RuleLink id={b.ruleId} /></span>;
  if (b.kind === "general_concept")
    return <Link to={`/learn/concepts/${b.conceptId}`} className="hover:underline"><Badge>Concept</Badge> {conceptById(b.conceptId)?.term ?? b.conceptId}</Link>;
  if (b.kind === "case_fact") return <span><Badge tone="amber">Case fact</Badge> {c.documents.find((d) => d.id === b.documentId)?.title ?? b.documentId}</span>;
  return <span><Badge tone="violet">Assumption</Badge> #{b.assumptionIndex + 1}</span>;
}

function AnswerText({ task, answer }: { task?: Task; answer?: Answer }) {
  if (!task || !answer) return <p className="text-[13px] text-ink-faint italic">No answer</p>;
  if (answer.kind === "amount") return <p className="num text-[13px]">{answer.cents === null ? "—" : formatCents(answer.cents)}</p>;
  if (answer.kind === "choice")
    return (
      <ul className="text-[13px]">
        {answer.optionIds.length === 0 && <li className="text-ink-faint italic">No selection</li>}
        {answer.optionIds.map((id) => <li key={id}>• {task.options?.find((o) => o.id === id)?.label ?? id}</li>)}
      </ul>
    );
  return <p className="text-[13px] whitespace-pre-line">{answer.text.trim() || <span className="text-ink-faint italic">No answer</span>}</p>;
}

function PortfolioFields({ attempt }: { attempt: Attempt }) {
  const save = (patch: Partial<Attempt>) => attemptRepository.save({ ...attempt, ...patch });
  return (
    <Card title="Portfolio notes">
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-[12px] font-medium text-ink-muted">Reflection: what would you do differently?</span>
          <textarea className="field min-h-24" value={attempt.reflection ?? ""} onChange={(e) => save({ reflection: e.target.value })} />
        </label>
        <label className="block">
          <span className="mb-1 block text-[12px] font-medium text-ink-muted">Recording link (optional)</span>
          <input className="field" placeholder="https://…" value={attempt.recordingUrl ?? ""} onChange={(e) => save({ recordingUrl: e.target.value })} />
          <span className="mt-1 block text-[11px] text-ink-faint">How to record interactions is still to be decided. The link is stored with this record.</span>
        </label>
      </div>
    </Card>
  );
}
