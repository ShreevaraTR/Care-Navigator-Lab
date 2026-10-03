import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { SOURCE_KIND_LABELS, type Provenance, type SourceKind } from "@/domain/provenance";

export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");

export function PageHeader({ title, description, actions, eyebrow }: { title: string; description?: ReactNode; actions?: ReactNode; eyebrow?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <div className="mb-1 text-[12px] font-medium text-ink-muted">{eyebrow}</div>}
        <h1 className="text-[22px] font-semibold">{title}</h1>
        {description && <p className="mt-1 max-w-3xl text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ title, actions, children, className, bodyClassName }: { title?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string; bodyClassName?: string }) {
  return (
    <section className={cx("rounded-lg border border-line bg-surface", className)}>
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
          <h2 className="text-[13px] font-semibold">{title}</h2>
          {actions}
        </header>
      )}
      <div className={cx("p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

type Tone = "neutral" | "brand" | "green" | "amber" | "red" | "violet" | "blue";
const TONES: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
  brand: "bg-brand-soft text-brand ring-brand/15",
  green: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  amber: "bg-amber-50 text-amber-800 ring-amber-200",
  red: "bg-rose-50 text-rose-800 ring-rose-200",
  violet: "bg-violet-50 text-violet-800 ring-violet-200",
  blue: "bg-sky-50 text-sky-800 ring-sky-200",
};

export function Badge({ tone = "neutral", children, title }: { tone?: Tone; children: ReactNode; title?: string }) {
  return (
    <span title={title} className={cx("inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap ring-1 ring-inset", TONES[tone])}>
      {children}
    </span>
  );
}

const SOURCE_TONES: Record<SourceKind, Tone> = {
  plan_rule: "blue",
  general_concept: "neutral",
  case_fact: "amber",
  assumption: "violet",
};

/** Labels where information comes from. Official plan rules link to the knowledge base. */
export function SourceBadge({ provenance, kind }: { provenance?: Provenance; kind?: SourceKind }) {
  const k = provenance?.kind ?? kind ?? "case_fact";
  const title = [provenance?.ruleId && `Rule: ${provenance.ruleId}`, provenance?.note].filter(Boolean).join(" · ");
  const badge = (
    <Badge tone={SOURCE_TONES[k]} title={title || undefined}>
      {SOURCE_KIND_LABELS[k]}
    </Badge>
  );
  return provenance?.ruleId ? (
    <Link to={`/learn/remote-health-usa?rule=${encodeURIComponent(provenance.ruleId)}`} className="hover:opacity-80">
      {badge}
    </Link>
  ) : (
    badge
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost";
const BUTTONS: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-strong disabled:bg-slate-300",
  secondary: "border border-line bg-white text-ink hover:bg-slate-50 disabled:text-ink-faint",
  ghost: "text-ink-muted hover:bg-slate-100 hover:text-ink",
};
const buttonBase = "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors disabled:cursor-not-allowed";

export function Button({ variant = "secondary", className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button type="button" className={cx(buttonBase, BUTTONS[variant], className)} {...props} />;
}

export function ButtonLink({ variant = "secondary", className, ...props }: LinkProps & { variant?: ButtonVariant }) {
  return <Link className={cx(buttonBase, BUTTONS[variant], className)} {...props} />;
}

export function StatTile({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface px-4 py-3">
      <div className="text-[12px] font-medium text-ink-muted">{label}</div>
      <div className="num mt-1 text-[24px] font-semibold">{value}</div>
      {hint && <div className="text-[12px] text-ink-faint">{hint}</div>}
    </div>
  );
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-surface px-6 py-10 text-center">
      <div className="font-semibold">{title}</div>
      {children && <div className="mx-auto mt-1 max-w-md text-ink-muted">{children}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function KeyValue({ items }: { items: [ReactNode, ReactNode][] }) {
  return (
    <dl className="grid grid-cols-[minmax(110px,auto)_1fr] gap-x-4 gap-y-1.5 text-[13px]">
      {items.map(([k, v], i) => (
        <div key={i} className="contents">
          <dt className="text-ink-muted">{k}</dt>
          <dd className="min-w-0">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ScoreBar({ pct }: { pct: number }) {
  const tone = pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div className={cx("h-full rounded-full", tone)} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
    </div>
  );
}
