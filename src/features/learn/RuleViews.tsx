import { Link } from "react-router-dom";
import { Badge, cx } from "@/components/ui";
import { ruleById, sourceById } from "@/content/plan-knowledge";
import type { PlanRule } from "@/domain/plan-knowledge";

export function RuleStatusBadge({ rule }: { rule: PlanRule }) {
  return rule.status === "confirmed" ? (
    <Badge tone="blue">Official rule</Badge>
  ) : (
    <Badge tone="amber" title={rule.note}>
      Official · needs clarification
    </Badge>
  );
}

export function CitationList({ rule }: { rule: PlanRule }) {
  return (
    <ul className="space-y-2">
      {rule.citations.map((c, i) => {
        const s = sourceById(c.sourceId);
        return (
          <li key={i} className="text-[12px]">
            <div className="text-ink-muted">
              <a href={s?.url} target="_blank" rel="noreferrer" className="font-medium text-brand hover:underline">
                {s?.title ?? c.sourceId}
              </a>
              {c.page && <> · page {c.page}</>} · {c.section} · {s?.documentVersion} · accessed {s?.accessedAt}
            </div>
            <blockquote className="mt-0.5 border-l-2 border-line pl-2 font-mono text-[11.5px] leading-snug text-ink-muted">{c.quote}</blockquote>
          </li>
        );
      })}
    </ul>
  );
}

/** One official rule with its citation(s). */
export function RuleCard({ rule, highlight, compact }: { rule: PlanRule; highlight?: boolean; compact?: boolean }) {
  return (
    <div id={rule.id} className={cx("rounded-md border bg-white px-3 py-2.5", highlight ? "border-brand ring-2 ring-brand/20" : "border-line")}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-semibold text-ink-muted">{rule.topic}</div>
          <p className="text-[13.5px]">{rule.statement}</p>
        </div>
        <RuleStatusBadge rule={rule} />
      </div>
      {rule.note && <p className="mt-1.5 rounded bg-amber-50 px-2 py-1 text-[12px] text-amber-900">{rule.note}</p>}
      <details className="mt-1.5" open={highlight && !compact}>
        <summary className="cursor-pointer text-[11px] font-medium text-ink-faint select-none">
          Source · <span className="font-mono">{rule.id}</span>
        </summary>
        <div className="mt-1.5">
          <CitationList rule={rule} />
        </div>
      </details>
    </div>
  );
}

export function RuleList({ ruleIds, compact }: { ruleIds: string[]; compact?: boolean }) {
  return (
    <div className="space-y-2">
      {ruleIds.map((id) => {
        const r = ruleById(id);
        return r ? <RuleCard key={id} rule={r} compact={compact} /> : <div key={id} className="text-rose-700">Unknown rule {id}</div>;
      })}
    </div>
  );
}

export function RuleLink({ id }: { id: string }) {
  return (
    <Link to={`/learn/remote-health-usa?rule=${encodeURIComponent(id)}`} className="font-mono text-[11px] text-brand hover:underline">
      {id}
    </Link>
  );
}
