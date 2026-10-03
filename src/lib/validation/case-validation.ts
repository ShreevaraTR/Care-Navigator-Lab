import { conceptById } from "@/content/learn/concepts";
import { benefitByKey, ruleById } from "@/content/plan-knowledge";
import type { Basis, CaseDocument, SimulationCase } from "@/domain/case";
import type { Provenance } from "@/domain/provenance";

/**
 * Content quality control for simulation cases.
 *
 * Structural checks (codes, rule ids, basis, documents) are exact. Text checks are heuristics
 * aimed at the specific mistakes we never want to ship: they scan only the case's
 * "authoritative voice" (model answers, rubric text, debrief, correct options, assumptions),
 * never documents or distractor options, which may be deliberately wrong.
 */

export type IssueCode =
  | "UNKNOWN_PLAN_RULE"
  | "UNDECLARED_PLAN_RULE"
  | "UNCLEAR_PLAN_RULE"
  | "UNKNOWN_CONCEPT"
  | "UNDECLARED_CONCEPT"
  | "UNKNOWN_CASE_FACT"
  | "UNKNOWN_ASSUMPTION"
  | "FICTIONAL_PLAN_PRESENTED_AS_REAL"
  | "SIMULATED_FACT_AS_PLAN_RULE"
  | "PLAN_RULE_RESTATED"
  | "IN_NETWORK_COST_SHARE"
  | "CONTRADICTS_PLAN_RULE"
  | "PREAUTH_CONTRADICTION"
  | "OWES_DESPITE_ZERO_EOB"
  | "EOB_AMOUNT_MISMATCH"
  | "BILL_TREATED_AS_EOB"
  | "CPT_AS_DIAGNOSIS"
  | "ICD_AS_PROCEDURE"
  | "CODE_FORMAT"
  | "CODE_NOT_REFERENCED"
  | "INVENTED_APPEALS_RULE"
  | "EOB_ARITHMETIC"
  | "UNTESTED_DELIBERATE_ERROR"
  | "PORTFOLIO_SHAPE";

export interface ValidationIssue {
  code: IssueCode;
  message: string;
}

// ---------------------------------------------------------------------------
// Code formats
// ---------------------------------------------------------------------------

/** CPT Category I/III (5 chars, digits; Cat II/III end in F/T) or HCPCS Level II (letter + 4 digits). */
export const isProcedureCode = (code: string) => /^\d{4}[0-9FTU]$/.test(code) || /^[A-V]\d{4}$/.test(code);
/** ICD-10-CM: letter, digit, alphanumeric, optional "." + 1–4 alphanumerics. */
export const isIcd10Code = (code: string) => /^[A-TV-Z]\d[0-9A-Z](\.[0-9A-Z]{1,4})?$/.test(code);

// ---------------------------------------------------------------------------
// Text extraction
// ---------------------------------------------------------------------------

interface VoiceText {
  where: string;
  text: string;
}

/** Text written in the case's own authoritative voice. */
export function authoritativeText(c: SimulationCase): VoiceText[] {
  const out: VoiceText[] = [];
  const push = (where: string, text: string | undefined) => text && out.push({ where, text });
  c.assumptions.forEach((a, i) => push(`assumptions[${i}]`, a));
  for (const t of c.tasks) {
    push(`${t.id}.prompt`, t.prompt);
    push(`${t.id}.hint`, t.hint);
    push(`${t.id}.modelAnswer`, t.modelAnswer);
    for (const cr of t.criteria) {
      push(`${cr.id}.expectation`, cr.expectation);
      push(`${cr.id}.feedbackIfMissed`, cr.feedbackIfMissed);
      push(`${cr.id}.feedbackIfMet`, cr.feedbackIfMet);
      if (cr.grading.mode === "auto_choice")
        for (const id of cr.grading.correctOptionIds) push(`${t.id}.option[${id}] (correct)`, t.options?.find((o) => o.id === id)?.label);
    }
  }
  push("debrief.whatHappened", c.debrief.whatHappened);
  c.debrief.correctReasoning.forEach((r, i) => push(`debrief.correctReasoning[${i}]`, r));
  push("debrief.modelMemberResponse", c.debrief.modelMemberResponse);
  for (const d of c.documents) if (d.type === "benefit_summary") d.items.forEach((it) => push(`${d.id}.${it.label}`, it.value));
  return out;
}

/** Like [^.] but lets decimal points inside codes/amounts through (e.g. "M54.16", "$2,400.00"). */
const ANY = String.raw`(?:[^.]|\.(?=\d))`;
const near = (a: string, n: number, b: string) => new RegExp(`${a}${ANY}{0,${n}}${b}`, "i");

const CPT_AS_DX_TEXT = near(String.raw`\bCPT\b`, 40, String.raw`\b(is|are|describes?|represents?|indicates?|shows?)\s+(the |a |an )?(diagnosis|condition|reason for)`);
const ICD_AS_PROC_TEXT = near(String.raw`\bICD-?10(-CM)?\b`, 40, String.raw`\b(is|are|describes?|represents?|indicates?|shows?)\s+(the |a |an )?(procedure|service performed|what was done)`);
const EOB_AS_BILL_TEXT = near(String.raw`\b(EOB|explanation of benefits)\b`, 30, String.raw`\b(is|as)\s+(a|the|your)\s+(bill|invoice)\b`);

const sentences = (text: string) => text.split(/(?<=[.!?])\s+|\n+/).filter(Boolean);

const NEGATION = /\b(not|no|never|isn't|aren't|doesn't|don't|won't|shouldn't|wouldn't|rather than|instead of|without|nor)\b|n't\b/i;

function collectProvenance(value: unknown, out: Provenance[] = []): Provenance[] {
  if (Array.isArray(value)) value.forEach((v) => collectProvenance(v, out));
  else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (k === "provenance" && v && typeof v === "object") out.push(v as Provenance);
      else collectProvenance(v, out);
    }
  }
  return out;
}

const dollars = (s: string) => Math.round(parseFloat(s.replace(/[$,\s]/g, "")) * 100);

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export function validateCaseContent(c: SimulationCase): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const add = (code: IssueCode, message: string) => issues.push({ code, message });
  const isPlanCase = c.plan.planId === "rhus";
  const declaredRules = new Set(c.knowledge.planRules);
  const declaredConcepts = new Set(c.knowledge.generalConcepts);
  const docIds = new Set(c.documents.map((d) => d.id));
  const text = authoritativeText(c);

  // --- Knowledge declarations -------------------------------------------------
  for (const id of c.knowledge.planRules) if (!ruleById(id)) add("UNKNOWN_PLAN_RULE", `knowledge.planRules: "${id}" is not in the plan knowledge base`);
  for (const id of c.knowledge.generalConcepts) if (!conceptById(id)) add("UNKNOWN_CONCEPT", `knowledge.generalConcepts: "${id}" is not a registered concept`);
  if (!isPlanCase && c.knowledge.planRules.length) add("UNDECLARED_PLAN_RULE", "a fictional-plan case cannot test Remote Health USA plan rules");

  const checkRule = (where: string, id: string) => {
    const rule = ruleById(id);
    if (!rule) return add("UNKNOWN_PLAN_RULE", `${where}: "${id}" is not in the plan knowledge base`);
    if (!declaredRules.has(id)) add("UNDECLARED_PLAN_RULE", `${where}: "${id}" is used but not declared in knowledge.planRules`);
    if (rule.status === "needs_clarification" && !c.knowledge.acknowledgedUnclearRules.includes(id))
      add("UNCLEAR_PLAN_RULE", `${where}: "${id}" needs clarification in the source; acknowledge it and add a covering assumption`);
  };

  // --- Criterion basis --------------------------------------------------------
  for (const t of c.tasks)
    for (const cr of t.criteria)
      for (const b of cr.basis as Basis[]) {
        const where = `${cr.id}.basis`;
        if (b.kind === "plan_rule") {
          if (!isPlanCase) add("SIMULATED_FACT_AS_PLAN_RULE", `${where}: a fictional-plan case cannot cite plan rule "${b.ruleId}"`);
          checkRule(where, b.ruleId);
        }
        if (b.kind === "general_concept") {
          if (!conceptById(b.conceptId)) add("UNKNOWN_CONCEPT", `${where}: "${b.conceptId}" is not a registered concept`);
          else if (!declaredConcepts.has(b.conceptId)) add("UNDECLARED_CONCEPT", `${where}: "${b.conceptId}" is not declared in knowledge.generalConcepts`);
        }
        if (b.kind === "case_fact" && !docIds.has(b.documentId)) add("UNKNOWN_CASE_FACT", `${where}: document "${b.documentId}" does not exist`);
        if (b.kind === "assumption" && !c.assumptions[b.assumptionIndex]) add("UNKNOWN_ASSUMPTION", `${where}: assumption #${b.assumptionIndex} does not exist`);
      }

  // --- Provenance -------------------------------------------------------------
  for (const p of collectProvenance(c))
    if (p.kind === "plan_rule") {
      if (!isPlanCase) add("SIMULATED_FACT_AS_PLAN_RULE", `plan_rule provenance "${p.ruleId}" in a fictional-plan case`);
      else checkRule("provenance", p.ruleId!);
    }

  // --- Real vs. fictional plan presentation -----------------------------------
  if (!isPlanCase && /remote health|safetywing|bywater/i.test(c.plan.name))
    add("FICTIONAL_PLAN_PRESENTED_AS_REAL", `fictional plan is named "${c.plan.name}"`);
  if (isPlanCase && c.plan.provenance.kind !== "plan_rule")
    add("SIMULATED_FACT_AS_PLAN_RULE", "a Remote Health USA case must cite a plan rule for the plan itself");

  for (const d of c.documents) {
    if (d.type !== "benefit_summary") continue;
    if (isPlanCase && d.isSimulatedPlan) add("FICTIONAL_PLAN_PRESENTED_AS_REAL", `${d.id}: plan case uses a simulated benefit summary`);
    if (!isPlanCase && !d.isSimulatedPlan) add("FICTIONAL_PLAN_PRESENTED_AS_REAL", `${d.id}: fictional plan's benefit summary is not marked simulated`);
    for (const it of d.items) {
      if (isPlanCase && it.provenance.kind !== "plan_rule")
        add("SIMULATED_FACT_AS_PLAN_RULE", `${d.id} › "${it.label}": a plan benefit summary may only list official plan rules (found ${it.provenance.kind})`);
      if (it.provenance.kind === "plan_rule") {
        if (!it.ruleId || it.ruleId !== it.provenance.ruleId)
          add("PLAN_RULE_RESTATED", `${d.id} › "${it.label}": plan-rule items need ruleId matching their provenance`);
        if (it.value !== undefined)
          add("PLAN_RULE_RESTATED", `${d.id} › "${it.label}": plan-rule items must not restate the rule in free text (value is taken from the knowledge base)`);
      } else if (it.value === undefined) add("PLAN_RULE_RESTATED", `${d.id} › "${it.label}": non-plan items need a value`);
    }
  }

  // --- Codes ------------------------------------------------------------------
  for (const code of c.codes) {
    if ((code.system === "CPT" || code.system === "HCPCS") && code.role !== "service")
      add("CPT_AS_DIAGNOSIS", `${code.system} ${code.code} is marked as a diagnosis; CPT/HCPCS describe the service performed`);
    if (code.system === "ICD-10-CM" && code.role !== "diagnosis")
      add("ICD_AS_PROCEDURE", `ICD-10-CM ${code.code} is marked as a service; ICD-10 describes the diagnosis / reason for care`);
    if ((code.system === "CPT" || code.system === "HCPCS") && !isProcedureCode(code.code)) add("CODE_FORMAT", `${code.code} is not a valid ${code.system} format`);
    if (code.system === "ICD-10-CM" && !isIcd10Code(code.code)) add("CODE_FORMAT", `${code.code} is not a valid ICD-10-CM format`);
  }
  const serviceCodes = new Set(c.codes.filter((x) => x.role === "service").map((x) => x.code));
  const diagnosisCodes = new Set(c.codes.filter((x) => x.role === "diagnosis").map((x) => x.code));
  const checkProcedure = (where: string, code: string) => {
    if (isIcd10Code(code) && !isProcedureCode(code)) add("ICD_AS_PROCEDURE", `${where}: "${code}" is an ICD-10 diagnosis code in a procedure field`);
    else if (!serviceCodes.has(code)) add("CODE_NOT_REFERENCED", `${where}: procedure code "${code}" is not listed in case.codes as a service`);
  };
  const checkDiagnosis = (where: string, code: string) => {
    if (isProcedureCode(code) && !isIcd10Code(code)) add("CPT_AS_DIAGNOSIS", `${where}: "${code}" is a procedure code in a diagnosis field`);
    else if (!diagnosisCodes.has(code)) add("CODE_NOT_REFERENCED", `${where}: diagnosis code "${code}" is not listed in case.codes as a diagnosis`);
  };
  for (const d of c.documents) {
    if (d.deliberateErrors.length) continue; // planted errors are the point of the exercise
    if (d.type === "claim")
      d.lines.forEach((l, i) => {
        checkProcedure(`${d.id}.lines[${i}].code`, l.code);
        l.diagnosisCodes.forEach((dx) => checkDiagnosis(`${d.id}.lines[${i}].diagnosisCodes`, dx));
      });
    if (d.type === "eob") d.lines.forEach((l, i) => l.code && checkProcedure(`${d.id}.lines[${i}].code`, l.code));
    if (d.type === "provider_bill") d.lines.forEach((l, i) => l.code && checkProcedure(`${d.id}.lines[${i}].code`, l.code));
    if (d.type === "authorization") {
      d.codes.forEach((x) => checkProcedure(`${d.id}.codes`, x));
      d.diagnosisCodes.forEach((x) => checkDiagnosis(`${d.id}.diagnosisCodes`, x));
    }
  }
  for (const { where, text: t } of text)
    for (const s of sentences(t)) {
      if (CPT_AS_DX_TEXT.test(s) && !NEGATION.test(s))
        add("CPT_AS_DIAGNOSIS", `${where}: "${s}"`);
      if (ICD_AS_PROC_TEXT.test(s) && !NEGATION.test(s))
        add("ICD_AS_PROCEDURE", `${where}: "${s}"`);
    }

  // --- EOB vs. provider bill ---------------------------------------------------
  for (const d of c.documents) {
    if (d.type === "provider_bill" && /\b(EOB|explanation of benefits)\b/i.test(d.title)) add("BILL_TREATED_AS_EOB", `${d.id}: a provider bill is titled as an EOB`);
    if (d.type === "eob" && /\b(bill|invoice|statement)\b/i.test(d.title)) add("BILL_TREATED_AS_EOB", `${d.id}: an EOB is titled as a bill/statement`);
  }
  for (const { where, text: t } of text)
    for (const s of sentences(t))
      if (EOB_AS_BILL_TEXT.test(s) && !NEGATION.test(s))
        add("BILL_TREATED_AS_EOB", `${where}: "${s}"`);

  // --- Member responsibility vs. EOB -------------------------------------------
  const eobs = c.documents.filter((d): d is Extract<CaseDocument, { type: "eob" }> => d.type === "eob");
  const eobTotal = eobs.reduce((sum, e) => sum + e.lines.reduce((s, l) => s + l.memberResponsibility, 0), 0);
  for (const t of c.tasks)
    if (t.measures === "eob_member_responsibility")
      for (const cr of t.criteria)
        if (cr.grading.mode === "auto_amount" && cr.grading.expectedCents !== eobTotal)
          add("EOB_AMOUNT_MISMATCH", `${cr.id}: expects ${cr.grading.expectedCents}¢ but the EOB member responsibility totals ${eobTotal}¢`);
  if (eobs.length && eobTotal === 0) {
    const OWES = /\b(?:owes?|owed|owing|member responsibility(?: is| of)?|responsible for(?: paying)?|have to pay|has to pay|must pay)\s+(?:about |approximately |roughly |around |up to )?(\$\s?[\d,]+(?:\.\d{2})?)/gi;
    for (const { where, text: t } of text)
      for (const s of sentences(t)) {
        for (const m of s.matchAll(OWES)) {
          const before = s.slice(Math.max(0, (m.index ?? 0) - 60), m.index);
          if (dollars(m[1]) > 0 && !NEGATION.test(before + m[0]))
            add("OWES_DESPITE_ZERO_EOB", `${where}: says the member owes ${m[1]} but the EOB shows $0 member responsibility: "${s}"`);
        }
      }
  }

  // --- EOB arithmetic ----------------------------------------------------------
  for (const e of eobs)
    e.lines.forEach((l, i) => {
      const costShare = l.deductible + l.copay + l.coinsurance;
      if (l.allowed > 0 && l.planPaid + costShare + l.notCovered !== l.allowed)
        add("EOB_ARITHMETIC", `${e.id}.lines[${i}]: plan paid + deductible + copay + coinsurance + not covered (${l.planPaid + costShare + l.notCovered}) ≠ allowed (${l.allowed})`);
      if (l.memberResponsibility < costShare || l.memberResponsibility > costShare + l.notCovered + (l.allowed === 0 ? l.billed : 0))
        add("EOB_ARITHMETIC", `${e.id}.lines[${i}]: member responsibility ${l.memberResponsibility} is inconsistent with the cost-share columns`);
      if (l.allowed > l.billed) add("EOB_ARITHMETIC", `${e.id}.lines[${i}]: allowed exceeds billed`);
    });

  // --- Deliberate errors must be tested ----------------------------------------
  const citedDocs = new Set(c.tasks.flatMap((t) => t.criteria.flatMap((cr) => cr.basis.filter((b) => b.kind === "case_fact").map((b) => (b as { documentId: string }).documentId))));
  for (const d of c.documents)
    if (d.deliberateErrors.length && !citedDocs.has(d.id))
      add("UNTESTED_DELIBERATE_ERROR", `${d.id} has planted errors but no criterion cites it`);

  // --- Portfolio cases ------------------------------------------------------------
  if (!c.isSample) {
    if (c.portfolioNumber === null) add("PORTFOLIO_SHAPE", "a non-sample case needs a portfolioNumber");
    if (c.skills.length < 3 || c.skills.length > 8) add("PORTFOLIO_SHAPE", `portfolio cases should test 3–8 skills (has ${c.skills.length})`);
    if (!c.tasks.some((t) => t.kind === "free_text")) add("PORTFOLIO_SHAPE", "every portfolio case needs a written investigation task");
    if (!c.tasks.some((t) => t.kind === "member_response")) add("PORTFOLIO_SHAPE", "every portfolio case needs a member response task");
    if (!c.scenario || !c.recordingPriority) add("PORTFOLIO_SHAPE", "portfolio cases need scenario and recordingPriority");
  }

  // --- Plan consistency (Remote Health USA cases) -------------------------------
  if (isPlanCase) {
    for (const e of eobs)
      e.lines.forEach((l, i) => {
        const benefit = l.benefitKey ? benefitByKey(l.benefitKey) : undefined;
        if (l.benefitKey && !benefit) add("UNKNOWN_PLAN_RULE", `${e.id}.lines[${i}]: unknown benefitKey "${l.benefitKey}"`);
        if (e.networkStatus === "in_network" && benefit?.group !== "pharmacy" && l.deductible + l.coinsurance + l.copay > 0)
          add("IN_NETWORK_COST_SHARE", `${e.id}.lines[${i}]: in-network line shows deductible/coinsurance/copay, but the plan has no in-network deductible, coinsurance or provider copay (rhus.cost.in_network_no_cost_share)`);
      });

    const inNetworkCase = c.provider.networkStatus === "in_network";
    for (const { where, text: t } of text)
      for (const s of sentences(t)) {
        const oonContext = /out[- ]of[- ]network|\bOON\b/i.test(s);
        // "20% coinsurance", "coinsurance of 20%", "a $40 copay"
        const costShare = /(\d{1,2})\s?%\s*(coinsurance|co-insurance)|(coinsurance|co-insurance)\s+(of\s+)?(\d{1,2})\s?%|\$\s?\d+\s*(provider\s+)?(co-?pay)/i.exec(s);
        if (costShare && !oonContext && !NEGATION.test(s) && !/prescription|pharmacy|drug/i.test(s) && (inNetworkCase || /in[- ]network/i.test(s)))
          add("IN_NETWORK_COST_SHARE", `${where}: in-network cost sharing contradicts rhus.cost.in_network_no_cost_share: "${s}"`);

        // Amounts directly attached to a deductible: "in-network deductible is $X" or "$X in-network deductible".
        const dedAmounts = (net: string) =>
          [
            ...s.matchAll(new RegExp(String.raw`${net}\s+(?:annual\s+)?deductible\s+(?:is|of|=|:)?\s*\$\s?([\d,]+)`, "gi")),
            ...s.matchAll(new RegExp(String.raw`\$\s?([\d,]+)\s+(?:individual\s+|family\s+)?${net}\s+(?:annual\s+)?deductible`, "gi")),
          ].map((m) => dollars(m[1]));
        if (dedAmounts(String.raw`in[- ]network`).some((v) => v !== 0))
          add("CONTRADICTS_PLAN_RULE", `${where}: in-network deductible is $0 (rhus.cost.deductible.in_network): "${s}"`);
        if (dedAmounts(String.raw`out[- ]of[- ]network`).some((v) => ![100000, 350000].includes(v)))
          add("CONTRADICTS_PLAN_RULE", `${where}: out-of-network deductible is $1,000 / $3,500 (rhus.cost.deductible.out_of_network): "${s}"`);
        if (/pre-?auth|prior auth/i.test(s) && /penalt/i.test(s)) {
          // Any percentage stated alongside the penalty must include 10%; any cap stated must be $500.
          const pcts = [...s.matchAll(/(\d{1,3})\s?%/g)].map((m) => m[1]);
          const capWords = /\b(up to|max(imum)?|cap(ped)?)\b/i.test(s);
          if ((pcts.length && !pcts.includes("10")) || (capWords && /\$/.test(s) && !/\$\s?500\b/.test(s)))
            add("CONTRADICTS_PLAN_RULE", `${where}: the pre-authorization penalty is 10% up to $500 (rhus.pa.penalty): "${s}"`);
        }
        // No appeals procedure exists in the knowledge base, so any plan-specific appeals rule is invented.
        if (/\bappeal/i.test(s) && !NEGATION.test(s) && /(safetywing|remote health|bywater|the plan|your plan|this plan)/i.test(s) &&
            /(\d+\s*(calendar\s+|business\s+)?days|deadline|must be (filed|submitted|made)|within\s+\d|level\s+(one|two|1|2)|second[- ]level)/i.test(s))
          add("INVENTED_APPEALS_RULE", `${where}: states a plan-specific appeals rule, but no official source in the knowledge base defines one: "${s}"`);
      }

    for (const d of c.documents) {
      if (d.type !== "authorization" || !d.requirement) continue;
      const b = benefitByKey(d.requirement.benefitKey);
      if (!b) {
        add("UNKNOWN_PLAN_RULE", `${d.id}.requirement: unknown benefitKey "${d.requirement.benefitKey}"`);
        continue;
      }
      const ruleId = `rhus.benefit.${b.key}`;
      if (d.requirement.required && b.preAuth === "not_stated")
        add("PREAUTH_CONTRADICTION", `${d.id}: case says ${b.label} requires pre-authorization, but the source states no such requirement`);
      if (!d.requirement.required && b.preAuth === "required")
        add("PREAUTH_CONTRADICTION", `${d.id}: case says ${b.label} does not require pre-authorization, but the source requires it`);
      if (d.status === "not_required" && b.preAuth === "required")
        add("PREAUTH_CONTRADICTION", `${d.id}: authorization record says "not required", but the source requires pre-authorization for ${b.label}`);
      if (b.preAuth === "unclear" && !c.knowledge.acknowledgedUnclearRules.includes(ruleId))
        add("UNCLEAR_PLAN_RULE", `${d.id}: pre-authorization for ${b.label} is unclear in the source; acknowledge ${ruleId} and add a covering assumption`);
      checkRule(`${d.id}.requirement`, ruleId);
    }
  }

  return issues;
}
