import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge, Button, ButtonLink, Card, EmptyState, KeyValue, PageHeader, SourceBadge, cx } from "@/components/ui";
import { caseById } from "@/content/cases";
import type { Answer, Attempt } from "@/domain/attempt";
import type { SimulationCase } from "@/domain/case";
import { CASE_TYPE_LABELS } from "@/domain/taxonomy";
import { computeScore, gradeAuto, pendingSelfReview } from "@/lib/scoring/scoring";
import { attemptRepository, newId, useAttempts } from "@/lib/storage/attempts";
import { DOCUMENT_TYPE_LABELS, DocumentViewer, NetworkBadge } from "./DocumentViewer";
import { TaskInput } from "./TaskInput";

export function CaseWorkspacePage() {
  const { caseId } = useParams();
  const c = caseId ? caseById(caseId) : undefined;
  const attempts = useAttempts();

  if (!c) return <EmptyState title="Case not found" action={<ButtonLink to="/simulations">All simulations</ButtonLink>} />;

  const active = attempts.find((a) => a.caseId === c.id && a.status === "in_progress");
  return active ? <Workspace c={c} attempt={active} /> : <CaseBrief c={c} previous={attempts.filter((a) => a.caseId === c.id)} />;
}

function startAttempt(c: SimulationCase): Attempt {
  const attempt: Attempt = {
    id: newId(),
    schemaVersion: 1,
    caseId: c.id,
    caseVersion: c.version,
    caseCode: c.code,
    caseTitle: c.title,
    portfolioNumber: c.portfolioNumber,
    caseTypes: c.caseTypes,
    skills: c.skills,
    status: "in_progress",
    startedAt: new Date().toISOString(),
    investigationNotes: "",
    answers: {},
    criterionResults: {},
  };
  attemptRepository.save(attempt);
  return attempt;
}

function CaseBrief({ c, previous }: { c: SimulationCase; previous: Attempt[] }) {
  return (
    <>
      <PageHeader
        eyebrow={<ButtonLink to="/simulations" variant="ghost" className="-ml-3">← Simulations</ButtonLink>}
        title={`${c.code} · ${c.title}`}
        description={c.summary}
        actions={<Button variant="primary" onClick={() => startAttempt(c)}>Start case</Button>}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Briefing" className="lg:col-span-2">
          <KeyValue
            items={[
              ["Difficulty", c.difficulty],
              ["Covers", <div className="flex flex-wrap gap-1">{c.caseTypes.map((t) => <Badge key={t}>{CASE_TYPE_LABELS[t]}</Badge>)}</div>],
              ["Evidence", `${c.documents.length} documents`],
              ["Tasks", `${c.tasks.length} (structured answers, an investigation write-up, and a member reply)`],
            ]}
          />
          {c.isSample && (
            <p className="mt-4 rounded-md border border-violet-200 bg-violet-50 px-3 py-2 text-[13px] text-violet-900">
              Sample case. It uses a fictional plan and contains no Remote Health USA policy.
            </p>
          )}
        </Card>
        <Card title="Previous attempts">
          {previous.length === 0 ? (
            <p className="text-ink-muted">None yet.</p>
          ) : (
            <ul className="space-y-1">
              {previous.map((a) => (
                <li key={a.id} className="flex justify-between">
                  <ButtonLink to={`/history/${a.id}`} variant="ghost" className="-ml-3">{new Date(a.startedAt).toLocaleString()}</ButtonLink>
                  <span className="num self-center font-medium">{a.score?.total ?? "—"}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

function Workspace({ c, attempt }: { c: SimulationCase; attempt: Attempt }) {
  const navigate = useNavigate();
  const [docId, setDocId] = useState(c.documents[0].id);
  const doc = c.documents.find((d) => d.id === docId) ?? c.documents[0];

  const update = (patch: Partial<Attempt>) => attemptRepository.save({ ...attempt, ...patch });
  const setAnswer = (taskId: string, a: Answer) => update({ answers: { ...attempt.answers, [taskId]: a } });

  const answered = c.tasks.filter((t) => isAnswered(attempt.answers[t.id])).length;

  const submit = () => {
    if (answered < c.tasks.length && !confirm(`${c.tasks.length - answered} task(s) unanswered. Submit anyway?`)) return;
    const criterionResults = gradeAuto(c, attempt.answers);
    const pending = pendingSelfReview(c, criterionResults);
    const now = new Date().toISOString();
    attemptRepository.save({
      ...attempt,
      criterionResults,
      submittedAt: now,
      status: pending.length ? "awaiting_self_review" : "completed",
      ...(pending.length ? {} : { completedAt: now, score: computeScore(c, criterionResults) }),
    });
    navigate(`/history/${attempt.id}`);
  };

  const abandon = () => {
    if (confirm("Discard this attempt? Your answers will be deleted.")) attemptRepository.remove(attempt.id);
  };

  return (
    <>
      <PageHeader
        eyebrow={<ButtonLink to="/simulations" variant="ghost" className="-ml-3">← Simulations</ButtonLink>}
        title={`${c.code} · ${c.title}`}
        actions={
          <>
            <span className="num text-[12px] text-ink-muted">{answered}/{c.tasks.length} answered · autosaved</span>
            <Button variant="ghost" onClick={abandon}>Discard</Button>
            <Button variant="primary" onClick={submit}>Submit for review</Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* Evidence column: pinned on wide screens so documents stay visible while answering. */}
        <div className="space-y-4 xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:self-start xl:overflow-y-auto xl:pr-1">
          <Card title="Incoming ticket" actions={<Badge tone="brand">{c.ticket.channel}</Badge>}>
            <blockquote className="border-l-2 border-brand pl-3 text-[15px] leading-relaxed">{c.ticket.memberMessage}</blockquote>
            <div className="mt-4 grid gap-4 border-t border-line pt-4 sm:grid-cols-2">
              <KeyValue items={[["Member", c.member.name], ["Member ID", <span className="font-mono text-[12px]">{c.member.memberId}</span>], ["Plan", <span className="flex flex-wrap items-center gap-1.5">{c.plan.name} <SourceBadge provenance={c.plan.provenance} /></span>]]} />
              <KeyValue items={[["Provider", c.provider.name], ["Type", c.provider.type], ["Network", <NetworkBadge status={c.provider.networkStatus} />]]} />
            </div>
          </Card>

          <Card bodyClassName="p-0">
            <div className="flex gap-0.5 overflow-x-auto border-b border-line px-2 pt-2" role="tablist">
              {c.documents.map((d) => (
                <button
                  key={d.id}
                  role="tab"
                  aria-selected={d.id === doc.id}
                  onClick={() => setDocId(d.id)}
                  className={cx(
                    "-mb-px rounded-t-md border px-3 py-1.5 text-[12px] font-medium whitespace-nowrap",
                    d.id === doc.id ? "border-line border-b-white bg-white text-ink" : "border-transparent text-ink-muted hover:text-ink",
                  )}
                >
                  {DOCUMENT_TYPE_LABELS[d.type]}
                </button>
              ))}
            </div>
            <div className="p-4">
              <DocumentViewer doc={doc} />
            </div>
          </Card>

          {c.codes.length > 0 && (
            <Card title="Code reference">
              <ul className="space-y-2">
                {c.codes.map((code) => (
                  <li key={code.code} className="flex items-start justify-between gap-3 text-[13px]">
                    <div>
                      <span className="font-mono text-[12px] font-medium">{code.system} {code.code}</span>
                      <span className="text-ink-muted"> · {code.role === "service" ? "what was done" : "why it was done"}</span>
                      <div>{code.plainLanguage}</div>
                    </div>
                    <SourceBadge provenance={code.provenance} />
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {c.assumptions.length > 0 && (
            <Card title="Working assumptions" actions={<SourceBadge kind="assumption" />}>
              <ul className="list-disc space-y-1 pl-5 text-[13px] text-ink-muted">
                {c.assumptions.map((a) => <li key={a}>{a}</li>)}
              </ul>
            </Card>
          )}
        </div>

        {/* Work column */}
        <div className="space-y-4">
          <Card title="Investigation notes">
            <textarea
              className="field min-h-24 resize-y"
              placeholder="Scratchpad: facts you've verified, inconsistencies, open questions…"
              value={attempt.investigationNotes}
              onChange={(e) => update({ investigationNotes: e.target.value })}
            />
          </Card>
          {c.tasks.map((t, i) => (
            <Card
              key={t.id}
              title={<span><span className="num text-ink-muted">{i + 1}.</span> {t.kind === "member_response" ? "Member response" : t.kind === "free_text" ? "Investigation" : "Finding"}</span>}
              actions={isAnswered(attempt.answers[t.id]) ? <Badge tone="green">Answered</Badge> : undefined}
            >
              <p className="mb-3 font-medium">{t.prompt}</p>
              {t.hint && <p className="-mt-2 mb-3 text-[12px] text-ink-muted">{t.hint}</p>}
              <TaskInput task={t} answer={attempt.answers[t.id]} onChange={(a) => setAnswer(t.id, a)} />
            </Card>
          ))}
          <div className="flex justify-end">
            <Button variant="primary" onClick={submit}>Submit for review</Button>
          </div>
        </div>
      </div>
    </>
  );
}

function isAnswered(a: Answer | undefined) {
  if (!a) return false;
  if (a.kind === "choice") return a.optionIds.length > 0;
  if (a.kind === "amount") return a.cents !== null;
  return a.text.trim().length > 0;
}
