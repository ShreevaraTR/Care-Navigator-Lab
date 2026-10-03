import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { Badge, ButtonLink, Card, PageHeader, cx } from "@/components/ui";
import { benefits, planRules, planSources, preAuthList, ruleById } from "@/content/plan-knowledge";
import { SOURCE_AUTHORITY_RANK, type Benefit, type PlanRule, type RuleSection } from "@/domain/plan-knowledge";
import { CitationList, RuleCard, RuleLink, RuleStatusBadge } from "./RuleViews";

const TABS = [
  { id: "structure", label: "Plan structure", sections: ["plan_structure", "eligibility"] },
  { id: "costs", label: "Costs & member responsibility", sections: ["costs", "pharmacy"] },
  { id: "benefits", label: "Benefits", sections: ["benefits"] },
  { id: "preauth", label: "Pre-authorization", sections: ["prior_authorization"] },
  { id: "exclusions", label: "Exclusions & add-ons", sections: ["exclusions", "add_ons"] },
  { id: "sources", label: "Sources & open questions", sections: [] },
] as const satisfies readonly { id: string; label: string; sections: readonly RuleSection[] }[];
type TabId = (typeof TABS)[number]["id"];

const isBenefitRule = (r: PlanRule) => r.id.startsWith("rhus.benefit.");
const isPreAuthListRule = (r: PlanRule) => r.id.startsWith("rhus.pa.list.");

function tabForRule(id: string): TabId {
  const r = ruleById(id);
  if (!r) return "structure";
  if (isBenefitRule(r)) return "benefits";
  return (TABS.find((t) => (t.sections as readonly string[]).includes(r.section))?.id ?? "structure") as TabId;
}

export function KnowledgeBasePage() {
  const [params, setParams] = useSearchParams();
  const focusRule = params.get("rule") ?? undefined;
  const tab = (params.get("tab") as TabId | null) ?? (focusRule ? tabForRule(focusRule) : "structure");

  useEffect(() => {
    if (focusRule) document.getElementById(focusRule)?.scrollIntoView({ block: "center" });
  }, [focusRule, tab]);

  const unclear = planRules.filter((r) => r.status === "needs_clarification").length;

  return (
    <>
      <PageHeader
        eyebrow={<ButtonLink to="/learn" variant="ghost" className="-ml-3">← Learn</ButtonLink>}
        title="Remote Health USA knowledge base"
        description="Plan rules taken only from official SafetyWing material, each with a verbatim citation. Anything not here is not a plan rule in this lab."
        actions={<Badge tone="blue">{planRules.length} rules · {unclear} need clarification</Badge>}
      />
      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-line" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setParams({ tab: t.id })}
            className={cx("-mb-px border-b-2 px-3 py-2 text-[13px] font-medium whitespace-nowrap", tab === t.id ? "border-brand text-ink" : "border-transparent text-ink-muted hover:text-ink")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "benefits" ? (
        <BenefitsTable focusKey={focusRule?.startsWith("rhus.benefit.") ? focusRule.slice("rhus.benefit.".length) : undefined} />
      ) : tab === "preauth" ? (
        <PreAuthTab focusRule={focusRule} />
      ) : tab === "sources" ? (
        <SourcesTab />
      ) : (
        <RuleSections sections={TABS.find((t) => t.id === tab)!.sections} focusRule={focusRule} />
      )}
    </>
  );
}

const SECTION_LABELS: Record<RuleSection, string> = {
  plan_structure: "Plan structure",
  eligibility: "Eligibility",
  costs: "Costs and member responsibility",
  pharmacy: "Pharmacy",
  benefits: "Benefits",
  prior_authorization: "Pre-authorization process",
  exclusions: "Selected exclusions (full list: SPD)",
  add_ons: "Add-ons",
  appeals: "Appeals",
};

function RuleSections({ sections, focusRule }: { sections: readonly RuleSection[]; focusRule?: string }) {
  return (
    <div className="space-y-6">
      {sections.map((s) => {
        const rules = planRules.filter((r) => r.section === s && !isBenefitRule(r) && !isPreAuthListRule(r));
        if (!rules.length) return null;
        return (
          <section key={s}>
            <h2 className="mb-2 text-[14px] font-semibold">{SECTION_LABELS[s]}</h2>
            <div className="grid gap-2 lg:grid-cols-2">{rules.map((r) => <RuleCard key={r.id} rule={r} highlight={r.id === focusRule} />)}</div>
          </section>
        );
      })}
    </div>
  );
}

const PREAUTH_LABEL: Record<Benefit["preAuth"], { text: string; tone: "red" | "amber" | "neutral" | "violet" }> = {
  required: { text: "Required", tone: "red" },
  required_partial: { text: "Partly required", tone: "amber" },
  notification: { text: "Notify (emergency)", tone: "violet" },
  not_stated: { text: "Not stated", tone: "neutral" },
  unclear: { text: "Unclear", tone: "amber" },
};

function BenefitsTable({ focusKey }: { focusKey?: string }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | undefined>(focusKey);
  const rows = useMemo(() => benefits.filter((b) => (b.label + b.key + b.group).toLowerCase().includes(q.toLowerCase())), [q]);

  return (
    <Card bodyClassName="p-0">
      <div className="border-b border-line p-3">
        <input className="field max-w-sm" placeholder="Filter benefits (e.g. MRI, therapy, pharmacy)…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Benefit</th>
              <th>In network</th>
              <th>Out of network</th>
              <th>Limits</th>
              <th>Pre-auth</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => {
              const rule = ruleById(`rhus.benefit.${b.key}`)!;
              const isOpen = open === b.key;
              return (
                <FragmentRow key={b.key}>
                  <tr id={rule.id} className={cx("cursor-pointer hover:bg-slate-50", (isOpen || focusKey === b.key) && "bg-brand-soft/60")} onClick={() => setOpen(isOpen ? undefined : b.key)}>
                    <td className="font-medium">{b.label}</td>
                    <td className={cx(!b.copay && "whitespace-nowrap")}>{b.copay ?? b.inNetwork?.label ?? "—"}</td>
                    <td className="whitespace-nowrap">{b.copay ? "Not stated" : b.outOfNetwork?.label ?? "—"}</td>
                    <td className="text-ink-muted">{b.limits ?? "—"}</td>
                    <td>
                      <Badge tone={PREAUTH_LABEL[b.preAuth].tone}>{PREAUTH_LABEL[b.preAuth].text}</Badge>
                      {b.preAuthListRefs.length > 0 && <span className="ml-1 font-mono text-[11px] text-ink-muted">{b.preAuthListRefs.join(",")}</span>}
                    </td>
                    <td><RuleStatusBadge rule={rule} /></td>
                  </tr>
                  {isOpen && (
                    <tr>
                      <td colSpan={6} className="bg-slate-50">
                        <div className="space-y-2 py-1">
                          {b.preAuthNote && <p className="text-[13px]"><span className="font-medium">Pre-authorization:</span> {b.preAuthNote}</p>}
                          {b.specialConditions && <p className="text-[13px]"><span className="font-medium">Conditions:</span> {b.specialConditions}</p>}
                          {b.note && <p className="rounded bg-amber-50 px-2 py-1 text-[12px] text-amber-900">{b.note}</p>}
                          <CitationList rule={rule} />
                          <div className="text-[11px] text-ink-faint">Rule id: <span className="font-mono">{rule.id}</span></div>
                        </div>
                      </td>
                    </tr>
                  )}
                </FragmentRow>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="border-t border-line px-3 py-2 text-[12px] text-ink-muted">
        Click a row for the verbatim source. "70% after deductible" means the plan pays 70% of the allowed amount after the out-of-network deductible, so the member's coinsurance is up to 30%.
      </p>
    </Card>
  );
}

const FragmentRow = ({ children }: { children: ReactNode }) => <>{children}</>;

function PreAuthTab({ focusRule }: { focusRule?: string }) {
  const process = planRules.filter((r) => r.section === "prior_authorization" && !isPreAuthListRule(r));
  const offList = benefits.filter((b) => b.preAuth === "required" && b.preAuthListRefs.length === 0);
  return (
    <div className="space-y-6">
      <Card title="Four separate questions in every authorization investigation">
        <ol className="list-decimal space-y-1 pl-5 text-[13px]">
          <li><strong>Required?</strong> Check the list below and the benefit row.</li>
          <li><strong>Requested?</strong> Usually by the in-network provider. The member is responsible for confirming.</li>
          <li><strong>Approved for this service, date and provider?</strong> Match codes, validity window and servicing provider.</li>
          <li><strong>Linked to the claim?</strong> An approved authorization that isn't linked can still produce a "no authorization" denial.</li>
        </ol>
        <p className="mt-2 text-[12px] text-ink-muted">General concept: a training framework, not a plan rule.</p>
      </Card>
      <section>
        <h2 className="mb-2 text-[14px] font-semibold">Process rules</h2>
        <div className="grid gap-2 lg:grid-cols-2">{process.map((r) => <RuleCard key={r.id} rule={r} highlight={r.id === focusRule} />)}</div>
      </section>
      <Card title="Services requiring pre-authorization (benefits overview p.10, A–T)" bodyClassName="p-0">
        <table className="data-table">
          <thead><tr><th className="w-10">#</th><th>Service</th><th>Related benefits</th><th>Rule</th></tr></thead>
          <tbody>
            {preAuthList.map((p) => {
              const id = `rhus.pa.list.${p.letter.toLowerCase()}`;
              return (
                <tr key={p.letter} id={id} className={cx(focusRule === id && "bg-brand-soft/60")}>
                  <td className="font-mono font-semibold">{p.letter}</td>
                  <td>{p.label}</td>
                  <td className="text-[12px] text-ink-muted">{p.benefitKeys.map((k) => benefits.find((b) => b.key === k)?.label ?? k).join(" · ") || "No benefit row in the overview"}</td>
                  <td><RuleLink id={id} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      <Card title="Marked 'Pre-authorization required' on a benefit row but not on the A–T list">
        <ul className="space-y-1 text-[13px]">
          {offList.map((b) => (
            <li key={b.key} className="flex flex-wrap items-center gap-2">
              <span>{b.label}</span>
              <RuleLink id={`rhus.benefit.${b.key}`} />
              {b.status === "needs_clarification" && <Badge tone="amber">needs clarification</Badge>}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[12px] text-ink-muted">These may be covered by broader list items (e.g. J: outpatient surgery, procedures). Where the mapping isn't clear, the benefit is flagged.</p>
      </Card>
    </div>
  );
}

function SourcesTab() {
  const sorted = [...planSources].sort((a, b) => SOURCE_AUTHORITY_RANK[a.authority] - SOURCE_AUTHORITY_RANK[b.authority]);
  const unclear = planRules.filter((r) => r.status === "needs_clarification");
  return (
    <div className="space-y-6">
      <Card title="Source hierarchy">
        <ol className="list-decimal space-y-1 pl-5 text-[13px]">
          <li><strong>Summary Plan Description (SPD):</strong> the governing plan document. <Badge tone="amber">Not yet provided to the lab</Badge></li>
          <li><strong>Benefits overview:</strong> SafetyWing's readable summary of the SPD.</li>
          <li><strong>Public plan page:</strong> legal disclosure and FAQ.</li>
        </ol>
        <p className="mt-2 text-[12px] text-ink-muted">Where sources conflict, the higher one wins, and the rule is marked "needs clarification" until resolved.</p>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        {sorted.map((s) => (
          <Card key={s.id} title={s.title} actions={<Badge>{s.authority.replace("_", " ")}</Badge>}>
            <dl className="grid grid-cols-[120px_1fr] gap-x-3 gap-y-1 text-[13px]">
              <dt className="text-ink-muted">Version</dt><dd>{s.documentVersion}</dd>
              <dt className="text-ink-muted">URL</dt><dd className="break-all"><a className="text-brand hover:underline" href={s.url} target="_blank" rel="noreferrer">{s.url}</a></dd>
              {s.pages && (<><dt className="text-ink-muted">Pages</dt><dd>{s.pages}</dd></>)}
              <dt className="text-ink-muted">Accessed</dt><dd>{s.accessedAt}</dd>
              <dt className="text-ink-muted">Local extract</dt><dd className="font-mono text-[11px] break-all">{s.localExtract}</dd>
              {s.sha256 && (<><dt className="text-ink-muted">SHA-256</dt><dd className="font-mono text-[11px] break-all">{s.sha256}</dd></>)}
            </dl>
            {s.notes && <p className="mt-2 text-[12px] text-ink-muted">{s.notes}</p>}
          </Card>
        ))}
      </div>
      <section>
        <h2 className="mb-2 text-[14px] font-semibold">Open questions ({unclear.length}): needs clarification from the SPD</h2>
        <div className="grid gap-2 lg:grid-cols-2">{unclear.map((r) => <RuleCard key={r.id} rule={r} />)}</div>
      </section>
      <Card title="Not in the sources (do not teach as plan rules)">
        <ul className="list-disc space-y-1 pl-5 text-[13px]">
          <li>Appeals and grievance procedures, levels and deadlines</li>
          <li>Claim filing deadlines for members or providers</li>
          <li>How the administrator presents denials, penalties or provider liability on an EOB</li>
          <li>In-network provider contract terms (e.g. hold-harmless rules)</li>
          <li>Who must make the emergency-admission call</li>
          <li>Coordination of benefits, subrogation, and eligibility waiting periods</li>
        </ul>
      </Card>
    </div>
  );
}
