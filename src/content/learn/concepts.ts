/**
 * General U.S. health-insurance concepts: NOT specific to Remote Health USA.
 *
 * These ids are what cases cite as `{ kind: "general_concept", conceptId }`. Definitions are
 * deliberately plan-neutral. Plan-specific values live only in the plan knowledge base.
 */

export interface Concept {
  id: string;
  term: string;
  group: ConceptGroup;
  definition: string;
  /** Lessons that teach this concept. */
  lessonIds?: string[];
}

export const CONCEPT_GROUPS = ["Claims & EOBs", "Costs & member responsibility", "Coding", "Authorization & disputes", "Communication"] as const;
export type ConceptGroup = (typeof CONCEPT_GROUPS)[number];

export const concepts: Concept[] = [
  // Claims & EOBs
  { id: "claims-lifecycle", term: "Claims lifecycle", group: "Claims & EOBs", definition: "The path from care to payment. The provider documents and codes the service and submits a claim. The payer or administrator adjudicates it and issues an EOB. The provider then bills the member for any remaining balance.", lessonIds: ["claims-basics"] },
  { id: "claim-statuses", term: "Claim statuses", group: "Claims & EOBs", definition: "Where a claim stands: received/submitted, pending (in review or waiting for information), paid, partially paid, denied, or adjusted/reprocessed. The status tells you what to do next.", lessonIds: ["claims-basics", "denials-corrections"] },
  { id: "adjudication", term: "Adjudication", group: "Claims & EOBs", definition: "The payer's or administrator's decision on a claim: whether each line is covered, the allowed amount, what the plan pays, and what the member owes.", lessonIds: ["claims-basics"] },
  { id: "eob", term: "Explanation of Benefits (EOB)", group: "Claims & EOBs", definition: "A statement from the payer or administrator explaining how a claim was processed. It is not a bill. It shows billed, allowed, plan-paid and member-responsibility amounts, plus remark codes.", lessonIds: ["reading-eob", "eob-vs-bill"] },
  { id: "remark-codes", term: "Remark / denial codes", group: "Claims & EOBs", definition: "Codes on an EOB or claim that explain an adjustment or denial. They are the first clue in any claim investigation.", lessonIds: ["reading-eob", "denials-corrections"] },
  { id: "provider-statement", term: "Provider statement (bill)", group: "Claims & EOBs", definition: "The provider's request for payment from the patient. It should match the member responsibility on the EOB. When it doesn't, investigate before the member pays.", lessonIds: ["eob-vs-bill"] },
  { id: "duplicate-claim", term: "Duplicate claim", group: "Claims & EOBs", definition: "A second submission for the same service, member, provider and date. It is usually denied as a duplicate. That denial doesn't mean the service was unpaid: look for the original claim.", lessonIds: ["denials-corrections"] },
  // Costs
  { id: "billed-amount", term: "Billed amount (charge)", group: "Costs & member responsibility", definition: "What the provider charges before any network discount or plan rules. Rarely what anyone actually pays.", lessonIds: ["allowed-amount"] },
  { id: "allowed-amount", term: "Allowed amount", group: "Costs & member responsibility", definition: "The maximum the plan recognizes for a covered service: for in-network providers, typically the contracted rate. Cost sharing is calculated from it, not from the billed amount.", lessonIds: ["allowed-amount"] },
  { id: "contracted-rate", term: "Contracted (negotiated) rate", group: "Costs & member responsibility", definition: "The rate an in-network provider has agreed to accept. The difference between the billed amount and the contracted rate is a write-off, not a member charge.", lessonIds: ["allowed-amount", "network"] },
  { id: "plan-payment", term: "Plan payment", group: "Costs & member responsibility", definition: "What the plan actually pays the provider for a claim line after applying benefits and cost sharing.", lessonIds: ["allowed-amount"] },
  { id: "member-responsibility", term: "Member responsibility", group: "Costs & member responsibility", definition: "What the member owes for a claim per the EOB: deductible, copay, coinsurance and non-covered amounts. Balance billing is separate and only applies in certain situations.", lessonIds: ["allowed-amount", "eob-vs-bill"] },
  { id: "deductible", term: "Deductible", group: "Costs & member responsibility", definition: "The amount a member pays for covered services before the plan starts paying for those services. Some plans have different deductibles in and out of network.", lessonIds: ["allowed-amount", "network"] },
  { id: "coinsurance", term: "Coinsurance", group: "Costs & member responsibility", definition: "The member's percentage share of the allowed amount, usually after the deductible.", lessonIds: ["allowed-amount", "network"] },
  { id: "copayment", term: "Copayment", group: "Costs & member responsibility", definition: "A fixed dollar amount the member pays for a specific service, e.g. a prescription.", lessonIds: ["allowed-amount"] },
  { id: "out-of-pocket-max", term: "Out-of-pocket maximum", group: "Costs & member responsibility", definition: "The cap on a member's cost sharing in a plan year, after which the plan pays 100% of covered costs. Some charges (non-covered services, balance bills, penalties) usually don't count toward it.", lessonIds: ["allowed-amount", "network"] },
  { id: "network", term: "In-network vs. out-of-network", group: "Costs & member responsibility", definition: "In-network providers have a contract with the plan's network and accept its rates. Out-of-network providers don't, so cost sharing is usually higher and balance billing is possible.", lessonIds: ["network"] },
  { id: "balance-billing", term: "Balance billing", group: "Costs & member responsibility", definition: "A provider billing the member for the difference between its charge and the plan's allowed amount. In-network contracts generally prohibit it. Federal and state law restrict it in some out-of-network situations.", lessonIds: ["network", "eob-vs-bill"] },
  { id: "benefit-limit", term: "Benefit limits", group: "Costs & member responsibility", definition: "Some benefits are capped by visits, days or dollars. Services beyond the limit are generally not covered, so an EOB can show part of a claim paid and the rest as member responsibility.", lessonIds: ["allowed-amount"] },
  { id: "surprise-billing", term: "Federal surprise-billing protections", group: "Costs & member responsibility", definition: "Federal law (the No Surprises Act, effective 2022) generally limits patients' cost sharing to in-network levels, and bars balance billing, for emergency services and for certain out-of-network providers (such as anesthesiologists) at in-network facilities. Whether it applies depends on the facts. Verify with the claims administrator rather than assuming.", lessonIds: ["network"] },
  // Coding
  { id: "cpt", term: "CPT code", group: "Coding", definition: "Current Procedural Terminology (AMA): five-character codes describing WHAT service or procedure was performed. They drive how a service is priced and paid.", lessonIds: ["cpt-icd"] },
  { id: "hcpcs", term: "HCPCS Level II code", group: "Coding", definition: "Codes (a letter plus four digits) for supplies, equipment, drugs and some services not described by CPT.", lessonIds: ["cpt-icd"] },
  { id: "icd10", term: "ICD-10-CM code", group: "Coding", definition: "Diagnosis codes (CDC/NCHS) describing WHY care was given: the condition, symptom or reason for the visit.", lessonIds: ["cpt-icd"] },
  { id: "medical-necessity", term: "Medical necessity", group: "Coding", definition: "Whether a service is appropriate for the documented condition. On a claim, the diagnosis (ICD-10) must support the service (CPT).", lessonIds: ["cpt-icd", "prior-auth"] },
  { id: "coding-error", term: "Coding error / mismatch", group: "Coding", definition: "A wrong, missing or inconsistent code (for example, a diagnosis that doesn't support the procedure). A Care Navigator flags obvious mismatches and routes them to the provider. They don't recode.", lessonIds: ["cpt-icd", "denials-corrections"] },
  // Authorization & disputes
  { id: "prior-authorization", term: "Prior authorization", group: "Authorization & disputes", definition: "Approval obtained before certain services. Check four things separately: was it required, was it requested, was it approved for this service, date and provider, and is it linked to the claim?", lessonIds: ["prior-auth"] },
  { id: "pharmacy-prior-authorization", term: "Pharmacy prior authorization", group: "Authorization & disputes", definition: "Many pharmacy benefits require approval before certain drugs (often specialty drugs) are covered. Until then the pharmacy claim is rejected at the counter, and the price quoted is the full cash price, not the member's cost share.", lessonIds: ["prior-auth"] },
  { id: "authorization-linking", term: "Authorization linking", group: "Authorization & disputes", definition: "Matching an approved authorization to the claim that bills for the service (codes, dates, provider, authorization number). An approved authorization that isn't linked can still produce a 'no authorization' denial.", lessonIds: ["prior-auth", "denials-corrections"] },
  { id: "denial", term: "Denial", group: "Authorization & disputes", definition: "A decision not to pay a claim or line, with a reason code. Denials can come from coverage rules, missing information, authorization, coding, eligibility or processing errors.", lessonIds: ["denials-corrections"] },
  { id: "claim-correction", term: "Corrected claim / reprocessing", group: "Authorization & disputes", definition: "Fixing a claim that was submitted or processed incorrectly: the provider sends a corrected claim, or the administrator reprocesses it. This is the right path for errors, as opposed to an appeal.", lessonIds: ["denials-corrections"] },
  { id: "appeal", term: "Appeal", group: "Authorization & disputes", definition: "A formal request to review a coverage decision the member or provider disagrees with, usually with supporting documentation. Procedures and deadlines are plan-specific and set out in the plan documents.", lessonIds: ["denials-corrections"] },
  // Communication
  { id: "member-communication", term: "Member communication", group: "Communication", definition: "Turning claim reasoning into a short, accurate, empathetic message: what we know, what we're checking, what happens next. No jargon and no promises we can't keep.", lessonIds: ["member-communication"] },
  { id: "care-coordination", term: "Provider/member coordination", group: "Communication", definition: "Contacting the right party (provider billing office, claims administrator, member) to resolve an issue, and closing the loop with the member.", lessonIds: ["member-communication", "eob-vs-bill"] },
];

const index = new Map(concepts.map((c) => [c.id, c]));
export const conceptById = (id: string) => index.get(id);
