import { useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge, Button, ButtonLink, Card, EmptyState, PageHeader, SourceBadge, cx } from "@/components/ui";
import { conceptById } from "@/content/learn/concepts";
import { lessonById, lessons } from "@/content/learn/lessons";
import { preAuthList } from "@/content/plan-knowledge";
import type { Lesson, LessonBlock, LessonSource } from "@/domain/lesson";
import { RuleLink, RuleList } from "./RuleViews";

export function LessonPage() {
  const { lessonId } = useParams();
  const lesson = lessonId ? lessonById(lessonId) : undefined;
  if (!lesson) return <EmptyState title="Lesson not found" action={<ButtonLink to="/learn">Learn</ButtonLink>} />;
  const next = lessons.find((l) => l.number === lesson.number + 1);

  return (
    <>
      <PageHeader
        eyebrow={<ButtonLink to="/learn" variant="ghost" className="-ml-3">← Learn</ButtonLink>}
        title={`Lesson ${lesson.number}: ${lesson.title}`}
        description={lesson.summary}
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 space-y-6">
          <Section n={1} title="Explanation"><Blocks blocks={lesson.explanation} /></Section>
          <Section n={2} title={`Example: ${lesson.example.title}`}><Blocks blocks={lesson.example.blocks} /></Section>
          <Section n={3} title="What to look for">
            <ul className="list-disc space-y-1 pl-5">{lesson.whatToLookFor.map((w) => <li key={w}>{w}</li>)}</ul>
          </Section>
          <Exercise key={lesson.id} lesson={lesson} />
          <Section n={7} title="Related concepts">
            <div className="flex flex-wrap gap-1.5">
              {lesson.relatedConcepts.map((id) => (
                <Link key={id} to={`/learn/concepts/${id}`} className="rounded border border-line px-2 py-0.5 text-[12px] hover:bg-slate-50">
                  {conceptById(id)?.term ?? id}
                </Link>
              ))}
            </div>
          </Section>
          {next && (
            <div className="flex justify-end">
              <ButtonLink to={`/learn/lessons/${next.id}`} variant="primary">Next: {next.title} →</ButtonLink>
            </div>
          )}
        </div>
        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <Card title="Source labels">
            <ul className="space-y-1.5 text-[12px]">
              <li><SourceBadge kind="plan_rule" /> verbatim-backed Remote Health USA rule</li>
              <li><SourceBadge kind="general_concept" /> applies to U.S. plans generally</li>
              <li><SourceBadge kind="case_fact" /> fictional example</li>
              <li><SourceBadge kind="assumption" /> simplification for the exercise</li>
            </ul>
          </Card>
          {lesson.planRules.length > 0 && (
            <Card title="Plan rules in this lesson">
              <ul className="space-y-1">{lesson.planRules.map((id) => <li key={id}><RuleLink id={id} /></li>)}</ul>
            </Card>
          )}
        </aside>
      </div>
    </>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <Card title={<span><span className="num mr-1.5 text-ink-faint">{n}</span>{title}</span>}>
      <div className="space-y-3 text-[14px]">{children}</div>
    </Card>
  );
}

function SourceTag({ source }: { source?: LessonSource }) {
  const s = source ?? { kind: "general_concept" as const };
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      <SourceBadge kind={s.kind} />
      {s.kind === "plan_rule" && s.ruleIds.map((id) => <RuleLink key={id} id={id} />)}
    </span>
  );
}

export function Blocks({ blocks }: { blocks: LessonBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <div key={i}>
          <BlockView block={b} />
        </div>
      ))}
    </>
  );
}

function BlockView({ block: b }: { block: LessonBlock }) {
  switch (b.type) {
    case "p":
      return (
        <div>
          <p>{b.text}</p>
          <div className="mt-1"><SourceTag source={b.source} /></div>
        </div>
      );
    case "list": {
      const Tag = b.ordered ? "ol" : "ul";
      return (
        <div>
          <Tag className={cx("space-y-1 pl-5", b.ordered ? "list-decimal" : "list-disc")}>{b.items.map((it) => <li key={it}>{it}</li>)}</Tag>
          <div className="mt-1"><SourceTag source={b.source} /></div>
        </div>
      );
    }
    case "table":
      return (
        <div>
          {b.caption && <div className="mb-1 text-[12px] font-semibold text-ink-muted">{b.caption}</div>}
          <div className="overflow-x-auto rounded-md border border-line">
            <table className="data-table">
              <thead><tr>{b.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
              <tbody>{b.rows.map((r, i) => <tr key={i}>{r.map((cell, j) => <td key={j} className={j === 0 ? "font-medium" : undefined}>{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <div className="mt-1"><SourceTag source={b.source} /></div>
        </div>
      );
    case "callout":
      return (
        <div className={cx("rounded-md border px-3 py-2", b.tone === "key" ? "border-brand/20 bg-brand-soft" : "border-amber-200 bg-amber-50")}>
          <p>{b.text}</p>
          <div className="mt-1"><SourceTag source={b.source} /></div>
        </div>
      );
    case "rules":
      return <RuleList ruleIds={b.ruleIds} compact />;
    case "preauth_list":
      return (
        <div className="rounded-md border border-line">
          <ol className="grid gap-x-6 px-3 py-2 text-[13px] md:grid-cols-2">
            {preAuthList.map((p) => (
              <li key={p.letter} className="flex gap-2 py-0.5">
                <span className="w-4 shrink-0 font-mono font-semibold text-ink-muted">{p.letter}</span>
                <span>{p.label}</span>
              </li>
            ))}
          </ol>
          <div className="border-t border-line px-3 py-1.5"><SourceTag source={{ kind: "plan_rule", ruleIds: ["rhus.pa.list.k"] }} /> <span className="text-[11px] text-ink-faint">Benefits overview p.10, items A–T</span></div>
        </div>
      );
  }
}

function Exercise({ lesson }: { lesson: Lesson }) {
  const ex = lesson.exercise;
  const multi = ex.correctOptionIds.length > 1;
  const [picked, setPicked] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const correct = picked.length === ex.correctOptionIds.length && picked.every((id) => ex.correctOptionIds.includes(id));

  return (
    <>
      <Section n={4} title="Mini exercise">
        <p className="font-medium">{ex.prompt}</p>
        {ex.context && <Blocks blocks={ex.context} />}
        <div className="space-y-1.5">
          {ex.options.map((o) => {
            const isPicked = picked.includes(o.id);
            const isCorrect = ex.correctOptionIds.includes(o.id);
            return (
              <label
                key={o.id}
                className={cx(
                  "flex cursor-pointer items-start gap-2.5 rounded-md border px-3 py-2 text-[13px]",
                  revealed && isCorrect ? "border-emerald-400 bg-emerald-50" : revealed && isPicked ? "border-rose-300 bg-rose-50" : isPicked ? "border-brand bg-brand-soft" : "border-line hover:bg-slate-50",
                )}
              >
                <input
                  type={multi ? "checkbox" : "radio"}
                  name={`ex-${lesson.id}`}
                  className="mt-0.5 accent-brand"
                  checked={isPicked}
                  disabled={revealed}
                  onChange={() => setPicked(multi ? (isPicked ? picked.filter((x) => x !== o.id) : [...picked, o.id]) : [o.id])}
                />
                <span>{o.label}</span>
              </label>
            );
          })}
        </div>
        <div className="flex gap-2">
          <Button variant="primary" disabled={!picked.length || revealed} onClick={() => setRevealed(true)}>Check answer</Button>
          {revealed && <Button variant="ghost" onClick={() => { setPicked([]); setRevealed(false); }}>Try again</Button>}
        </div>
      </Section>
      {revealed && (
        <>
          <Section n={5} title="Answer">
            <p className="flex items-center gap-2">
              {correct ? <Badge tone="green">Correct</Badge> : <Badge tone="red">Not quite</Badge>} <span className="font-medium">{ex.answer}</span>
            </p>
          </Section>
          <Section n={6} title="Explanation"><p>{ex.explanation}</p></Section>
        </>
      )}
      {!revealed && (
        <Card><p className="text-[13px] text-ink-muted"><span className="num mr-1.5 text-ink-faint">5–6</span>The answer and explanation appear after you check your answer.</p></Card>
      )}
    </>
  );
}
