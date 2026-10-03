import type { ReactNode } from "react";
import { Badge, KeyValue, SourceBadge } from "@/components/ui";
import type {
  AuthorizationDocument,
  BenefitSummaryDocument,
  CaseDocument,
  ClaimDocument,
  EobDocument,
  NetworkStatus,
  NoteDocument,
  ProviderBillDocument,
} from "@/domain/case";
import { formatCents as $, formatDate } from "@/lib/format/money";

export const DOCUMENT_TYPE_LABELS: Record<CaseDocument["type"], string> = {
  eob: "EOB",
  provider_bill: "Provider bill",
  claim: "Claim",
  authorization: "Authorization",
  benefit_summary: "Benefits",
  note: "Note",
};

export function NetworkBadge({ status }: { status: NetworkStatus }) {
  if (status === "in_network") return <Badge tone="green">In-network</Badge>;
  if (status === "out_of_network") return <Badge tone="red">Out-of-network</Badge>;
  return <Badge>Network unknown</Badge>;
}

const Mono = ({ children }: { children: ReactNode }) => <span className="font-mono text-[12px]">{children}</span>;
const blank = <span className="text-rose-700 italic">(blank)</span>;

export function DocumentViewer({ doc }: { doc: CaseDocument }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-[15px] font-semibold">{doc.title}</h3>
        <SourceBadge provenance={doc.provenance} />
      </div>
      {doc.type === "eob" && <EobView doc={doc} />}
      {doc.type === "provider_bill" && <BillView doc={doc} />}
      {doc.type === "claim" && <ClaimView doc={doc} />}
      {doc.type === "authorization" && <AuthView doc={doc} />}
      {doc.type === "benefit_summary" && <BenefitsView doc={doc} />}
      {doc.type === "note" && <NoteView doc={doc} />}
    </div>
  );
}

type EobAmountKey = "billed" | "allowed" | "planPaid" | "deductible" | "copay" | "coinsurance" | "notCovered" | "memberResponsibility";
const EOB_ROWS: [string, EobAmountKey, boolean?][] = [
  ["Billed by provider", "billed"],
  ["Allowed amount", "allowed"],
  ["Plan paid", "planPaid"],
  ["Deductible", "deductible"],
  ["Copay", "copay"],
  ["Coinsurance", "coinsurance"],
  ["Not covered", "notCovered"],
  ["Member responsibility", "memberResponsibility", true],
];

function EobView({ doc }: { doc: EobDocument }) {
  return (
    <>
      <p className="mb-3 rounded-md bg-slate-50 px-3 py-2 text-[12px] font-medium tracking-wide text-ink-muted uppercase">This is not a bill</p>
      <KeyValue
        items={[
          ["Claim #", <Mono>{doc.claimNumber}</Mono>],
          ["Processed", formatDate(doc.processedDate)],
          ["Patient", doc.patient],
          ["Provider", <span className="flex flex-wrap items-center gap-2">{doc.provider} <NetworkBadge status={doc.networkStatus} /></span>],
        ]}
      />
      {/* Transposed: one column per service line, so every amount stays visible in a narrow panel. */}
      <div className="mt-4 overflow-x-auto rounded-md border border-line">
        <table className="data-table num">
          <thead>
            <tr>
              <th className="w-44">Line</th>
              {doc.lines.map((l, i) => (
                <th key={i} className="text-right normal-case">
                  {formatDate(l.dateOfService)} · {l.service} {l.code && <span className="font-mono">({l.code})</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EOB_ROWS.map(([label, key, strong]) => (
              <tr key={key} className={strong ? "bg-slate-50" : undefined}>
                <td className={strong ? "font-semibold" : "text-ink-muted"}>{label}</td>
                {doc.lines.map((l, i) => (
                  <td key={i} className={strong ? "text-right font-semibold" : "text-right"}>{$(l[key])}</td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="text-ink-muted">Remark codes</td>
              {doc.lines.map((l, i) => <td key={i} className="text-right"><Mono>{l.remarkCodes.join(", ") || "—"}</Mono></td>)}
            </tr>
          </tbody>
        </table>
      </div>
      {doc.remarks.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-1 text-[12px] font-semibold text-ink-muted uppercase">Remark codes</h4>
          <ul className="space-y-1 text-[13px]">
            {doc.remarks.map((r) => (
              <li key={r.code}>
                <Mono>{r.code}</Mono> · {r.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function BillView({ doc }: { doc: ProviderBillDocument }) {
  return (
    <>
      <KeyValue
        items={[
          ["Provider", doc.providerName],
          ["Statement date", formatDate(doc.statementDate)],
          ["Account #", <Mono>{doc.accountNumber}</Mono>],
          ...(doc.dueDate ? ([["Due date", formatDate(doc.dueDate)]] as [ReactNode, ReactNode][]) : []),
        ]}
      />
      <div className="mt-4 overflow-x-auto rounded-md border border-line">
        <table className="data-table num">
          <thead>
            <tr>
              <th>DOS</th>
              <th>Description</th>
              <th>Code</th>
              <th className="text-right">Charge</th>
            </tr>
          </thead>
          <tbody>
            {doc.lines.map((l, i) => (
              <tr key={i}>
                <td>{formatDate(l.dateOfService)}</td>
                <td>{l.description}</td>
                <td><Mono>{l.code ?? ""}</Mono></td>
                <td className="text-right">{$(l.charge)}</td>
              </tr>
            ))}
            <tr><td colSpan={3} className="text-right text-ink-muted">Insurance payments</td><td className="text-right">{$(-doc.insurancePayments)}</td></tr>
            <tr><td colSpan={3} className="text-right text-ink-muted">Adjustments</td><td className="text-right">{$(-doc.adjustments)}</td></tr>
            <tr><td colSpan={3} className="text-right font-semibold">Balance due</td><td className="text-right font-semibold">{$(doc.balanceDue)}</td></tr>
          </tbody>
        </table>
      </div>
      {doc.message && <p className="mt-3 rounded-md border border-line bg-slate-50 px-3 py-2 text-[13px]">“{doc.message}”</p>}
    </>
  );
}

function ClaimView({ doc }: { doc: ClaimDocument }) {
  return (
    <>
      <KeyValue
        items={[
          ["Claim #", <Mono>{doc.claimNumber}</Mono>],
          ["Status", <Badge tone={doc.status === "denied" ? "red" : doc.status === "processed_paid" ? "green" : "amber"}>{doc.status.replace(/_/g, " ")}</Badge>],
          ["Received", formatDate(doc.receivedDate)],
          ["Processed", doc.processedDate ? formatDate(doc.processedDate) : "—"],
          ["Billing provider", <span className="flex flex-wrap items-center gap-2">{doc.billingProvider} <NetworkBadge status={doc.networkStatus} /></span>],
          ["Rendering provider", doc.renderingProvider ?? "—"],
          ["Auth # on claim", doc.authorizationNumberOnClaim ? <Mono>{doc.authorizationNumberOnClaim}</Mono> : blank],
        ]}
      />
      <div className="mt-4 overflow-x-auto rounded-md border border-line">
        <table className="data-table num">
          <thead>
            <tr>
              <th>DOS</th>
              <th>Procedure</th>
              <th>Diagnosis</th>
              <th>Units</th>
              <th className="text-right">Charge</th>
              <th>Line status</th>
            </tr>
          </thead>
          <tbody>
            {doc.lines.map((l, i) => (
              <tr key={i}>
                <td>{formatDate(l.dateOfService)}</td>
                <td><Mono>{l.code}</Mono></td>
                <td><Mono>{l.diagnosisCodes.join(", ")}</Mono></td>
                <td>{l.units}</td>
                <td className="text-right">{$(l.charge)}</td>
                <td>
                  {l.lineStatus}
                  {l.denialReason && <div className="text-[12px] text-rose-700">{l.denialReason}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AuthView({ doc }: { doc: AuthorizationDocument }) {
  const tone = doc.status === "approved" ? "green" : doc.status === "denied" || doc.status === "not_found" ? "red" : "amber";
  return (
    <KeyValue
      items={[
        ["Auth #", doc.authNumber ? <Mono>{doc.authNumber}</Mono> : "—"],
        ["Status", <Badge tone={tone}>{doc.status.replace(/_/g, " ")}</Badge>],
        ["Service", doc.service],
        ["Procedure codes", <Mono>{doc.codes.join(", ")}</Mono>],
        ["Diagnosis codes", <Mono>{doc.diagnosisCodes.join(", ") || "—"}</Mono>],
        ["Requesting provider", doc.requestingProvider],
        ["Servicing provider", doc.servicingProvider ?? "—"],
        ["Requested", doc.requestedDate ? formatDate(doc.requestedDate) : "—"],
        ["Decision", doc.decisionDate ? formatDate(doc.decisionDate) : "—"],
        ["Valid", doc.validFrom && doc.validTo ? `${formatDate(doc.validFrom)} – ${formatDate(doc.validTo)}` : "—"],
        ["Notes", doc.notes ?? "—"],
      ]}
    />
  );
}

function BenefitsView({ doc }: { doc: BenefitSummaryDocument }) {
  return (
    <>
      {doc.isSimulatedPlan && (
        <p className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] text-amber-900">
          Fictional training plan. These rules exist only for this case and are not Remote Health USA policy.
        </p>
      )}
      <table className="data-table">
        <tbody>
          {doc.items.map((it) => (
            <tr key={it.label}>
              <td className="w-1/2 text-ink-muted">{it.label}</td>
              <td>{it.value}</td>
              <td className="text-right"><SourceBadge provenance={it.provenance} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function NoteView({ doc }: { doc: NoteDocument }) {
  return (
    <>
      <div className="mb-2 text-[12px] text-ink-muted">
        {[doc.author, doc.date && formatDate(doc.date)].filter(Boolean).join(" · ")}
      </div>
      <p className="whitespace-pre-line">{doc.body}</p>
    </>
  );
}
