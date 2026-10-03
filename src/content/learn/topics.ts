import type { SourceKind } from "@/domain/provenance";

/**
 * Learn-area outline. Phase 1 ships only the structure and a one-line orientation per topic.
 * Full lessons come later; plan-specific topics stay locked until authoritative material exists.
 */
export type TopicStatus = "outline" | "awaiting_source" | "published";

export interface LearnTopic {
  id: string;
  title: string;
  group: string;
  /** Short orientation, general-concept level only. */
  summary: string;
  status: TopicStatus;
  sourceKind: SourceKind;
}

export const LEARN_GROUPS = ["Plan fundamentals", "Core terminology", "Claims & billing", "Coding", "Authorizations & disputes"] as const;

export const learnTopics: LearnTopic[] = [
  {
    id: "remote-health-usa",
    title: "Remote Health USA fundamentals",
    group: "Plan fundamentals",
    summary: "Plan structure, benefits, network and processes. Locked until the authoritative plan material is added.",
    status: "awaiting_source",
    sourceKind: "plan_rule",
  },
  {
    id: "terminology",
    title: "Health insurance terminology",
    group: "Core terminology",
    summary: "The vocabulary used on EOBs, bills and plan documents, and how the terms relate.",
    status: "outline",
    sourceKind: "general_concept",
  },
  {
    id: "allowed-amount",
    title: "Allowed amount",
    group: "Core terminology",
    summary: "The maximum amount a plan recognizes for a covered service. Cost sharing is calculated from it, not from the billed charge.",
    status: "outline",
    sourceKind: "general_concept",
  },
  {
    id: "deductible",
    title: "Deductible",
    group: "Core terminology",
    summary: "The amount the member pays for covered services before the plan begins paying for certain services.",
    status: "outline",
    sourceKind: "general_concept",
  },
  {
    id: "coinsurance",
    title: "Coinsurance",
    group: "Core terminology",
    summary: "The member's percentage share of the allowed amount, usually applied after the deductible.",
    status: "outline",
    sourceKind: "general_concept",
  },
  {
    id: "copayment",
    title: "Copayment",
    group: "Core terminology",
    summary: "A fixed dollar amount the member pays for a specific type of covered service.",
    status: "outline",
    sourceKind: "general_concept",
  },
  {
    id: "member-responsibility",
    title: "Member responsibility",
    group: "Core terminology",
    summary: "What the member owes for a claim: deductible, copay, coinsurance and non-covered amounts, as shown on the EOB.",
    status: "outline",
    sourceKind: "general_concept",
  },
  {
    id: "network",
    title: "In-network vs. out-of-network",
    group: "Core terminology",
    summary: "Contracted providers accept negotiated rates. Out-of-network care can mean different cost sharing and possible balance bills.",
    status: "outline",
    sourceKind: "general_concept",
  },
  {
    id: "balance-billing",
    title: "Balance billing",
    group: "Core terminology",
    summary: "A provider billing the member for the difference between the billed charge and the allowed amount. It is restricted in many situations.",
    status: "outline",
    sourceKind: "general_concept",
  },
  {
    id: "claims-lifecycle",
    title: "Claims lifecycle",
    group: "Claims & billing",
    summary: "From service to submission, adjudication, payment or denial, EOB, provider statement, and adjustment.",
    status: "outline",
    sourceKind: "general_concept",
  },
  {
    id: "eob",
    title: "EOB terminology",
    group: "Claims & billing",
    summary: "How to read an Explanation of Benefits line by line, and why an EOB is not a bill.",
    status: "outline",
    sourceKind: "general_concept",
  },
  {
    id: "billing-workflow",
    title: "Medical billing workflow",
    group: "Claims & billing",
    summary: "How providers code, submit and follow up on claims, and how that produces the statement a member receives.",
    status: "outline",
    sourceKind: "general_concept",
  },
  {
    id: "cpt",
    title: "CPT: what was done",
    group: "Coding",
    summary: "CPT codes describe the service or procedure performed. Taught conceptually; the AMA descriptor set is not reproduced.",
    status: "outline",
    sourceKind: "general_concept",
  },
  {
    id: "icd10",
    title: "ICD-10: why it was done",
    group: "Coding",
    summary: "ICD-10-CM codes describe the diagnosis or reason for care, which supports medical necessity.",
    status: "outline",
    sourceKind: "general_concept",
  },
  {
    id: "prior-authorization",
    title: "Prior authorization",
    group: "Authorizations & disputes",
    summary: "Approval obtained before certain services. Check the codes, the dates, the provider, and who was responsible for obtaining it.",
    status: "outline",
    sourceKind: "general_concept",
  },
  {
    id: "medical-necessity",
    title: "Medical necessity",
    group: "Authorizations & disputes",
    summary: "Whether a service is appropriate for the documented condition. It links the CPT (what) to the ICD-10 (why).",
    status: "outline",
    sourceKind: "general_concept",
  },
  {
    id: "appeals-denials",
    title: "Appeals and denials",
    group: "Authorizations & disputes",
    summary: "Denial reasons, reprocessing versus a formal appeal, and the evidence and deadlines involved.",
    status: "outline",
    sourceKind: "general_concept",
  },
];

export const topicById = (id: string) => learnTopics.find((t) => t.id === id);
