import {
  BenefitSchema,
  PlanRuleSchema,
  PlanSourceSchema,
  PreAuthServiceSchema,
  type Benefit,
  type PlanRule,
  type PlanSource,
  type PreAuthService,
} from "@/domain/plan-knowledge";
import { rhusBenefits } from "./rhus/benefits";
import { PREAUTH_LIST_PAGE, rhusPreAuthList } from "./rhus/preauth";
import { bo, rhusRules } from "./rhus/rules";
import { rhusSources } from "./rhus/sources";

/**
 * The Remote Health USA knowledge base: the single source of truth for plan-specific facts.
 *
 * Every entry is exposed as a PlanRule with a stable id, so cases and lessons cite one kind of thing:
 *   rhus.<section>.<…>            hand-written rules (rules.ts)
 *   rhus.benefit.<benefitKey>     one per benefit row (benefits.ts)
 *   rhus.pa.list.<letter>         one per pre-authorization list item (preauth.ts)
 */

export const planSources: PlanSource[] = rhusSources.map((s) => PlanSourceSchema.parse(s));
export const benefits: Benefit[] = rhusBenefits.map((b) => BenefitSchema.parse(b));
export const preAuthList: PreAuthService[] = rhusPreAuthList.map((p) => PreAuthServiceSchema.parse(p));

const covText = (c: Benefit["inNetwork"]) => (c ? c.label : "not stated");

const PREAUTH_TEXT: Record<Benefit["preAuth"], string> = {
  required: "pre-authorization required",
  required_partial: "pre-authorization required for part of this benefit",
  notification: "emergency admission notification applies",
  not_stated: "no pre-authorization requirement stated",
  unclear: "pre-authorization requirement unclear in source",
};

export function benefitStatement(b: Benefit): string {
  const parts = [
    b.copay ? `${b.label}: ${b.copay}` : `${b.label}: in-network ${covText(b.inNetwork)}; out-of-network ${covText(b.outOfNetwork)}`,
    b.limits && `limit: ${b.limits}`,
    PREAUTH_TEXT[b.preAuth] + (b.preAuthNote ? ` (${b.preAuthNote})` : ""),
    b.specialConditions,
  ];
  return parts.filter(Boolean).join("; ") + ".";
}

const benefitRules: PlanRule[] = benefits.map((b) => ({
  id: `rhus.benefit.${b.key}`,
  section: b.group === "pharmacy" ? "pharmacy" : "benefits",
  topic: b.label,
  statement: benefitStatement(b),
  citations: [b.citation],
  status: b.status,
  confidence: b.status === "confirmed" ? "high" : "medium",
  note: b.note,
}));

const preAuthRules: PlanRule[] = preAuthList.map((p) => ({
  id: `rhus.pa.list.${p.letter.toLowerCase()}`,
  section: "prior_authorization",
  topic: `Pre-authorization list ${p.letter}`,
  statement: `Pre-authorization is required for: ${p.label}.`,
  citations: [bo(PREAUTH_LIST_PAGE, "Services requiring pre-authorization", `${p.letter}. ${p.quote}`)],
  status: "confirmed",
  confidence: "high",
}));

export const planRules: PlanRule[] = [...rhusRules, ...benefitRules, ...preAuthRules].map((r) => PlanRuleSchema.parse(r));

const ruleIndex = new Map(planRules.map((r) => [r.id, r]));
const benefitIndex = new Map(benefits.map((b) => [b.key, b]));

export const ruleById = (id: string) => ruleIndex.get(id);
export const benefitByKey = (key: string) => benefitIndex.get(key);
export const sourceById = (id: string) => planSources.find((s) => s.id === id);
