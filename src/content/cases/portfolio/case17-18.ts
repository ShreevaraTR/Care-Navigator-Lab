import type { SimulationCaseInput } from "@/domain/case";
import { caseFact } from "@/domain/provenance";
import {
  DOCS_ASSUMPTION, FICTION_ASSUMPTION, INVESTIGATION_PROMPT, RHUS_PLAN, amount, choice, concept, cpt, eobLine, fact, hcpcs, icd,
  investigation, knowledge, knownVsUnknown, memberReply, planRulesDoc, rule, selectAll,
} from "./helpers";

// =============================================================================
// CASE 17 · Complex · Out-of-town emergency admission
// =============================================================================
export const case17: SimulationCaseInput = {
  id: "case-17-emergency-admission",
  version: 1,
  portfolioNumber: 17,
  code: "CASE-17",
  title: "Emergency appendectomy out of town",
  summary: "An out-of-network emergency visit and admission. The ER was paid at 100%; the inpatient stay was processed at the out-of-network level with a 'no notification' reduction, though the spouse did call on Monday.",
  scenario: "Conflicting information: a timely weekend notification exists but wasn't linked, so the penalty looks inconsistent. Whether emergency-level benefits extend to the admission is unresolved by the sources. Out-of-pocket cap math, a $16,100 hospital bill, and federal protections to verify.",
  recordingPriority: "high",
  difficulty: "complex",
  status: "ready",
  isSample: false,
  caseTypes: ["complex", "claims_investigation", "eob_investigation", "prior_authorization"],
  skills: ["complex_investigation", "network_status", "prior_auth", "member_responsibility", "balance_billing", "inconsistency_detection", "member_communication"],
  knowledge: knowledge(
    [
      "rhus.benefit.emergency_services", "rhus.pa.emergency_notification", "rhus.pa.penalty", "rhus.pa.penalty_not_counted", "rhus.pa.list.a",
      "rhus.benefit.hospital_room", "rhus.cost.deductible.out_of_network", "rhus.cost.coinsurance.out_of_network", "rhus.cost.oop.out_of_network",
      "rhus.cost.oop.rules", "rhus.cost.oop.never_counts", "rhus.cost.balance_billing", "rhus.structure.bywater_tpa",
    ],
    ["surprise-billing", "network", "deductible", "coinsurance", "out-of-pocket-max", "balance-billing", "prior-authorization", "authorization-linking", "eob", "provider-statement", "cpt", "icd10"],
  ),
  ticket: {
    channel: "chat",
    receivedAt: "2026-07-14T21:18:00Z",
    memberMessage:
      "I had emergency surgery for appendicitis while visiting my sister in Denver last month. Now the hospital wants $16,100 and the EOB says I owe $2,500 and something about \"no notification\". My wife DID call the plan on Monday morning! I'm freaking out. What do I actually owe?",
  },
  member: { name: "Jordan Kim", memberId: "RHU-12873-01", details: "Employee. No out-of-network spending earlier in 2026." },
  plan: RHUS_PLAN,
  provider: { name: "Mercy Valley Hospital (Denver)", type: "Acute-care hospital (fictional)", networkStatus: "out_of_network" },
  codes: [
    cpt("99285", "Emergency department visit, high severity."),
    cpt("44970", "Laparoscopic appendectomy."),
    icd("K35.80", "Unspecified acute appendicitis."),
  ],
  assumptions: [
    FICTION_ASSUMPTION,
    DOCS_ASSUMPTION,
    "06/13/2026 was a Saturday. The member arrived at the ER at 22:40 and was admitted the same night.",
    "The EOB shows the reduction as a 'not covered' amount and applies the out-of-pocket cap to deductible + coinsurance. That presentation is simulated.",
  ],
  documents: [
    { id: "doc-contact", type: "note", title: "Member contact log", provenance: caseFact(), author: "Member support", date: "2026-06-15", body: "Mon 06/15 10:12. Spouse (Alex Kim) called to report an emergency admission at Mercy Valley Hospital, Denver, on Sat 06/13 for appendicitis; surgery on 06/14. Reference NOTIF-2026-0615-221." },
    { id: "doc-auth", type: "authorization", title: "Authorization lookup (as linked to the claim)", provenance: caseFact(), status: "not_found", service: "Inpatient admission: appendectomy", codes: ["44970"], diagnosisCodes: ["K35.80"], requestingProvider: "None linked", servicingProvider: "Mercy Valley Hospital", notes: "No pre-authorization or admission notification linked to claim CLM-26-0622-9055.", requirement: { benefitKey: "hospital_room", required: true } },
    {
      id: "doc-claim",
      type: "claim",
      title: "Claim record (hospital)",
      provenance: caseFact(),
      claimNumber: "CLM-26-0622-9055",
      status: "processed_paid",
      receivedDate: "2026-06-22",
      processedDate: "2026-07-06",
      billingProvider: "Mercy Valley Hospital",
      networkStatus: "out_of_network",
      lines: [
        { dateOfService: "2026-06-13", code: "99285", diagnosisCodes: ["K35.80"], units: 1, charge: 400000, lineStatus: "Paid: emergency" },
        { dateOfService: "2026-06-14", code: "44970", diagnosisCodes: ["K35.80"], units: 1, charge: 3000000, lineStatus: "Paid: out-of-network inpatient level, with reduction" },
      ],
    },
    { id: "doc-accum", type: "note", title: "Accumulator summary (before this claim)", provenance: caseFact(), author: "Claims system", date: "2026-06-13", body: "Out-of-network deductible: $0 of $1,000 met. Out-of-network out-of-pocket: $0 of $2,000." },
    {
      id: "doc-eob",
      type: "eob",
      title: "Explanation of Benefits",
      provenance: caseFact(),
      claimNumber: "CLM-26-0622-9055",
      processedDate: "2026-07-06",
      patient: "Jordan Kim",
      provider: "Mercy Valley Hospital",
      networkStatus: "out_of_network",
      lines: [
        eobLine({ dateOfService: "2026-06-13", service: "Emergency department visit", code: "99285", benefitKey: "emergency_services", billed: 400000, allowed: 240000, planPaid: 240000, remarkCodes: ["ER1"] }),
        eobLine({ dateOfService: "2026-06-14", service: "Inpatient stay + appendectomy", code: "44970", benefitKey: "hospital_room", billed: 3000000, allowed: 1800000, deductible: 100000, coinsurance: 100000, notCovered: 50000, planPaid: 1550000, memberResponsibility: 250000, remarkCodes: ["OON2", "PA04", "OOP1"] }),
      ],
      remarks: [
        { code: "ER1", text: "Emergency services for an emergency medical condition: paid at 100%." },
        { code: "OON2", text: "Inpatient services processed at the out-of-network level: 70% after deductible." },
        { code: "PA04", text: "No pre-authorization or admission notification on file. Covered charges reduced 10% (maximum $500). Not applied to the deductible or out-of-pocket maximum." },
        { code: "OOP1", text: "Out-of-network out-of-pocket maximum reached. Coinsurance limited accordingly." },
      ],
    },
    { id: "doc-bill", type: "provider_bill", title: "Provider statement", provenance: caseFact(), providerName: "Mercy Valley Hospital", statementDate: "2026-07-10", accountNumber: "MVH-8830142", lines: [{ dateOfService: "2026-06-13", description: "Emergency department, level 5", code: "99285", charge: 400000 }, { dateOfService: "2026-06-14", description: "Inpatient stay, laparoscopic appendectomy", code: "44970", charge: 3000000 }], insurancePayments: 1790000, adjustments: 0, balanceDue: 1610000 },
    planRulesDoc([
      ["Emergency services", "rhus.benefit.emergency_services"],
      ["Emergency admissions", "rhus.pa.emergency_notification"],
      ["Hospital stay", "rhus.benefit.hospital_room"],
      ["Missing pre-authorization", "rhus.pa.penalty"],
      ["Penalty and accumulators", "rhus.pa.penalty_not_counted"],
      ["Out-of-network deductible", "rhus.cost.deductible.out_of_network"],
      ["Out-of-network coinsurance", "rhus.cost.coinsurance.out_of_network"],
      ["Out-of-network out-of-pocket limit", "rhus.cost.oop.out_of_network"],
      ["How the limit works", "rhus.cost.oop.rules"],
      ["Charges that never count", "rhus.cost.oop.never_counts"],
      ["Balance billing", "rhus.cost.balance_billing"],
    ]),
  ],
  tasks: [
    choice("t-er", "How was the emergency department line processed, and is that consistent with the plan?", [["ok", "Paid at 100%: consistent with the official rule for emergency services for an emergency condition, even out of network"], ["70", "70% after deductible, as for any out-of-network service"], ["denied", "Denied: out-of-network ERs aren't covered"], ["copay", "Covered after a fixed ER charge"]], ["ok"], { category: "plan_knowledge", points: 3, basis: [rule("rhus.benefit.emergency_services"), fact("doc-eob")], expectation: "Confirms the ER line matches the official emergency rule.", missed: "Official rule: emergency services for an emergency medical condition are paid at 100% in and out of network." }, "100%, consistent with the rule."),
    choice("t-notification", "Under the official rule, was the emergency admission notification made in time?", [["yes", "Yes: a Saturday admission, and the weekend rule allows a call within 72 hours, by the following Monday. The call came Monday 06/15."], ["no-24", "No: it had to be within 24 hours"], ["none", "No: there's no record of any call"], ["notneeded", "Notification isn't required for emergencies"]], ["yes"], { category: "prior_authorization", points: 4, basis: [rule("rhus.pa.emergency_notification"), fact("doc-contact")], expectation: "Applies the weekend timing rule to the contact log.", missed: "Official rule: call within 24 hours of an emergency admission. On a weekend or holiday, within 72 hours, by the following Monday. Saturday night admission, Monday-morning call: on time." }, "Yes, under the weekend rule."),
    choice("t-penalty", "What does that mean for the PA04 reduction?", [["inconsistent", "It looks inconsistent: a timely notification (NOTIF-2026-0615-221) exists but wasn't linked to the claim. Request a review; don't promise the result."], ["correct", "It's definitely correct"], ["owes-all", "The member now owes the full $16,100"], ["irrelevant", "The notification doesn't matter for emergencies"]], ["inconsistent"], { category: "prior_authorization", points: 3, basis: [fact("doc-auth"), fact("doc-contact"), concept("authorization-linking"), rule("rhus.pa.penalty")], expectation: "Spots the unlinked notification and handles it as a review request.", missed: "The EOB says 'no notification on file', but your contact log has one. Like an unlinked authorization, this is a linking problem to raise, not a fact to accept." }, "It looks inconsistent, so request a review."),
    amount("t-oop", "On the inpatient line, how much deductible + coinsurance was applied in total?", 200000, { category: "plan_knowledge", points: 4, basis: [rule("rhus.cost.oop.out_of_network"), rule("rhus.cost.oop.rules"), fact("doc-eob"), fact("doc-accum")], expectation: "Recognizes the $2,000 out-of-network out-of-pocket cap ($1,000 deductible + $1,000 coinsurance).", missed: "Official rules: the out-of-network out-of-pocket limit is $2,000 and includes deductible and coinsurance. 30% of $17,000 would be $5,100, but cost sharing stops at $2,000." }, "$2,000.00"),
    amount("t-owed", "According to the EOB, what is the total member responsibility?", 250000, { category: "eob_interpretation", points: 3, basis: [fact("doc-eob")], expectation: "Totals $0 (ER) + $2,500 (inpatient).", missed: "ER line $0. Inpatient: $1,000 deductible + $1,000 coinsurance + $500 reduction = $2,500." }, "$2,500.00", { measures: "eob_member_responsibility" }),
    amount("t-above", "How much of the hospital's $16,100 balance is above the allowed amounts?", 1360000, { category: "eob_interpretation", points: 3, basis: [fact("doc-bill"), fact("doc-eob")], expectation: "Calculates ($4,000 − $2,400) + ($30,000 − $18,000) = $13,600.", missed: "$16,100 = $2,500 (EOB member responsibility) + $13,600 above the allowed amounts." }, "$13,600.00"),
    selectAll(
      "t-uncertain",
      "Which questions can't be settled from the sources and documents, and need verification? Select all that apply.",
      [
        ["admission-level", "Whether emergency-level (100%) benefits extend to the inpatient admission and surgery that followed the ER visit"],
        ["nsa", "Whether federal emergency surprise-billing protections limit the hospital's balance bill"],
        ["link", "Why the Monday notification wasn't linked to the claim, and whether the reduction will be reversed"],
        ["er-100", "Whether emergency services for an emergency condition are paid at 100% out of network"],
      ],
      ["admission-level", "nsa", "link"],
      { category: "problem_solving", points: 4, basis: [rule("rhus.benefit.emergency_services"), rule("rhus.benefit.hospital_room"), concept("surprise-billing"), fact("doc-contact")], expectation: "Separates settled rules from genuinely open questions.", missed: "The ER-at-100% rule is in the source. How it applies to the admission isn't spelled out. Federal protections are a general concept to verify, and the linking issue needs the administrator." },
      "The admission level, the federal protections, and the linking issue.",
    ),
    selectAll("t-codes", "Select the codes that describe services performed.", [["99285", "99285"], ["44970", "44970"], ["k3580", "K35.80"], ["pa04", "PA04"]], ["99285", "44970"], { category: "coding_understanding", points: 3, basis: [concept("cpt"), concept("icd10")], expectation: "Selects the CPT codes only.", missed: "99285 (ER visit) and 44970 (laparoscopic appendectomy) are what was done. K35.80 (appendicitis) is why. PA04 is a remark code." }, "99285 and 44970."),
    investigation(
      INVESTIGATION_PROMPT,
      [
        { id: "c-picture", category: "claims_reasoning", points: 4, basis: [fact("doc-eob"), fact("doc-bill"), fact("doc-accum")], expectation: "Lays out the processing: ER at 100% ($0). Inpatient at the out-of-network level: $1,000 deductible + $1,000 coinsurance (capped by the $2,000 limit) + a $500 reduction = $2,500. Hospital balance $16,100 = $2,500 + $13,600 above allowed.", missed: "Build the full financial picture before deciding what's wrong." },
        knownVsUnknown(4, "Known: timely weekend notification (contact log); ER paid per rule; out-of-pocket cap applied. Unknown: whether the reduction will be reversed once the notification is linked; whether emergency-level benefits extend to the admission; whether federal protections limit the balance bill. Doesn't tell the member a final amount.", [fact("doc-contact"), concept("surprise-billing"), rule("rhus.benefit.emergency_services")]),
        { id: "c-contacts", category: "problem_solving", points: 3, basis: [rule("rhus.structure.bywater_tpa"), concept("care-coordination"), fact("doc-contact")], expectation: "Contacts: the claims administrator (Bywater), with notification reference NOTIF-2026-0615-221, to review the reduction, the benefit level for the admission, and how emergency protections apply; Mercy Valley, to hold the $16,100 while it's reviewed.", missed: "Give the administrator the evidence it lacks (the notification reference), and protect the member from collections meanwhile." },
      ],
      "ER (99285) paid at 100% per the emergency rule. The inpatient stay and appendectomy (44970) were processed at the out-of-network level: $1,000 deductible + $1,000 coinsurance (stopped by the $2,000 out-of-network out-of-pocket limit) + a $500 'no notification' reduction = $2,500 on the EOB. The hospital bills $16,100, including $13,600 above the allowed amounts. Conflict: the contact log shows a timely weekend notification (Sat admission, Mon 06/15 call, NOTIF-2026-0615-221) that wasn't linked, so the reduction looks inconsistent. Open questions: whether emergency-level benefits extend to the admission, and whether federal emergency surprise-billing protections limit the balance bill. Send the notification reference to the claims administrator and request a review, and ask Mercy Valley to hold the bill. Don't give the member a final amount yet.",
    ),
    memberReply({
      accuracy: "Says the ER visit was paid in full, that his wife's call counts as on time under the plan's weekend rule even though the claim didn't reflect it, and that the hospital stay and bill are being reviewed. No final amount.",
      accuracyBasis: [fact("doc-contact"), rule("rhus.pa.emergency_notification"), fact("doc-eob")],
      promises: "Doesn't promise the $2,500 or the $16,100 will go away, or give a final number. Says what's being reviewed.",
      next: "Asks the member not to pay the hospital while the review is underway. Says you've sent the call reference to the claims team and asked the hospital to hold the bill, with a follow-up date.",
      empathy: "Acknowledges a frightening experience (emergency surgery away from home) and the financial worry.",
    }),
  ],
  debrief: {
    whatHappened:
      "The member was admitted through an out-of-network ER on a Saturday night for appendicitis. His spouse notified the plan on Monday, which is on time under the weekend rule, but the notification wasn't linked to the claim. The ER was paid at 100%. The admission was processed at the out-of-network level with a 'no notification' reduction ($2,500 on the EOB), and the hospital billed $16,100.",
    correctReasoning: [
      "Official rule: emergency services for an emergency condition are paid at 100% out of network, so the ER line is right.",
      "Official rule: weekend emergency admissions can be reported within 72 hours, by the following Monday. The Monday call was on time, so the reduction looks inconsistent.",
      "Official rules: the out-of-network out-of-pocket limit is $2,000 and includes deductible + coinsurance. The penalty doesn't count and the balance bill never counts.",
      "Open: whether emergency-level benefits extend to the admission, and whether federal surprise-billing protections apply (general concept). Verify; don't guess.",
      "Give the administrator the notification reference, hold the hospital bill, and give the member no final number yet.",
    ],
    modelMemberResponse:
      "Jordan, I'm so sorry. Emergency surgery away from home is scary enough without bills like this. Here's where things stand. Your ER visit was paid in full. Your wife's call on Monday counts as on time under your plan's weekend rule, but it wasn't connected to the hospital claim, which is where the 'no notification' note came from. I've sent the call reference to the claims team and asked them to review the hospital stay, including how emergency protections apply. I'm also asking the hospital to pause the $16,100 bill. Please don't pay anything yet. I can't promise the final amount, but I'll update you by next Tuesday.",
    conceptsToReview: ["surprise-billing", "out-of-pocket-max", "authorization-linking", "balance-billing"],
  },
};

// =============================================================================
// CASE 18 · Complex · Home health past its authorization + denied DME
// =============================================================================
export const case18: SimulationCaseInput = {
  id: "case-18-home-health-dme",
  version: 1,
  portfolioNumber: 18,
  code: "CASE-18",
  title: "After the stroke: home nursing and a hospital bed",
  summary: "Home health visits continued past the authorized window with no extension on file, and a hospital-bed authorization was denied after the bed was delivered. Two providers, two different problems.",
  scenario: "Specialty authorizations. Home health visits 9–12 got a 10% reduction ($60), but the agency bills $1,100. The DME authorization was denied (medical necessity), so the EOB says $480 is owed. The member asks to 'fight it', which is handled as a general appeal concept with no invented procedure.",
  recordingPriority: "high",
  difficulty: "complex",
  status: "ready",
  isSample: false,
  caseTypes: ["complex", "prior_authorization", "medical_billing", "denial", "appeal"],
  skills: ["specialty_authorization", "prior_auth", "billing_reconciliation", "inconsistency_detection", "appeals", "complex_investigation", "provider_communication"],
  knowledge: knowledge(
    ["rhus.benefit.home_health", "rhus.pa.list.m", "rhus.benefit.dme", "rhus.pa.list.h", "rhus.pa.penalty", "rhus.structure.medical_necessity", "rhus.cost.in_network_no_cost_share", "rhus.pa.provider_usually_requests"],
    ["prior-authorization", "authorization-linking", "appeal", "denial", "medical-necessity", "provider-statement", "eob", "hcpcs", "icd10", "member-responsibility"],
  ),
  ticket: {
    channel: "phone",
    receivedAt: "2026-06-29T16:05:00Z",
    memberMessage:
      "(Call notes) Caller is the member's wife, listed as authorized. Raymond came home after a stroke. BrightPath Home Health sent a bill for $1,100 saying insurance denied his last four nurse visits, and the medical supply company wants $480 for his hospital bed. She says: \"The agency told us all the visits were approved. And he needs that bed! Can we fight this?\"",
  },
  member: { name: "Raymond Ellis", memberId: "RHU-30118-01", details: "Employee, age 58. Spouse is an authorized representative on file." },
  plan: RHUS_PLAN,
  provider: { name: "BrightPath Home Health / MedEquip Supply", type: "Home health agency and DME supplier (fictional)", networkStatus: "in_network" },
  codes: [
    hcpcs("G0299", "Skilled nursing visit by a registered nurse in the home health setting."),
    hcpcs("E0260", "Hospital bed, semi-electric, with mattress."),
    icd("I63.9", "Cerebral infarction (stroke), unspecified."),
  ],
  assumptions: [
    FICTION_ASSUMPTION,
    DOCS_ASSUMPTION,
    "The EOB applies the 10% reduction only to visits 9–12. That allocation and presentation are simulated.",
  ],
  documents: [
    { id: "doc-auth-hh", type: "authorization", title: "Authorization: home health", provenance: caseFact(), authNumber: "AUTH-2026-041980", status: "approved", service: "Home health RN visits (8 visits)", codes: ["G0299"], diagnosisCodes: ["I63.9"], requestingProvider: "Dr. Simone Hart (Neurology)", servicingProvider: "BrightPath Home Health", decisionDate: "2026-05-01", validFrom: "2026-05-04", validTo: "2026-05-31", notes: "8 visits approved. No extension or new request on file as of 06/29.", requirement: { benefitKey: "home_health", required: true } },
    { id: "doc-agency-note", type: "note", title: "BrightPath office note", provenance: caseFact(), author: "BrightPath Home Health", date: "2026-06-26", body: "Our records show an extension request for 4 additional visits was faxed on 05/29. All visits were medically necessary per the plan of care." },
    { id: "doc-auth-dme", type: "authorization", title: "Authorization: hospital bed", provenance: caseFact(), authNumber: "AUTH-2026-042233", status: "denied", service: "Hospital bed, semi-electric (rental)", codes: ["E0260"], diagnosisCodes: ["I63.9"], requestingProvider: "MedEquip Supply", servicingProvider: "MedEquip Supply", requestedDate: "2026-05-02", decisionDate: "2026-05-06", notes: "Denied: medical necessity criteria not met based on the documentation submitted (no documentation of positioning needs). Bed delivered 05/03, before the decision.", requirement: { benefitKey: "dme", required: true } },
    { id: "doc-claim-hh", type: "claim", title: "Claim: BrightPath Home Health", provenance: caseFact(), claimNumber: "CLM-26-0615-4120", status: "processed_paid", receivedDate: "2026-06-15", processedDate: "2026-06-24", billingProvider: "BrightPath Home Health", networkStatus: "in_network", authorizationNumberOnClaim: "AUTH-2026-041980", lines: [
      { dateOfService: "2026-05-29", code: "G0299", diagnosisCodes: ["I63.9"], units: 8, charge: 220000, lineStatus: "Paid (visits 1–8, 05/04–05/29)" },
      { dateOfService: "2026-06-12", code: "G0299", diagnosisCodes: ["I63.9"], units: 4, charge: 110000, lineStatus: "Paid with reduction (visits 9–12, 06/02–06/12)" },
    ] },
    { id: "doc-eob-hh", type: "eob", title: "EOB: home health", provenance: caseFact(), claimNumber: "CLM-26-0615-4120", processedDate: "2026-06-24", patient: "Raymond Ellis", provider: "BrightPath Home Health", networkStatus: "in_network", lines: [
      eobLine({ dateOfService: "2026-05-29", service: "RN home visits ×8", code: "G0299", benefitKey: "home_health", billed: 220000, allowed: 120000, planPaid: 120000 }),
      eobLine({ dateOfService: "2026-06-12", service: "RN home visits ×4", code: "G0299", benefitKey: "home_health", billed: 110000, allowed: 60000, planPaid: 54000, notCovered: 6000, memberResponsibility: 6000, remarkCodes: ["PA06"] }),
    ], remarks: [{ code: "PA06", text: "Services after the authorized period, with no authorization on file. Covered charges reduced 10% (maximum $500)." }] },
    { id: "doc-bill-hh", type: "provider_bill", title: "Statement: BrightPath Home Health", provenance: caseFact(), providerName: "BrightPath Home Health", statementDate: "2026-06-26", accountNumber: "BPH-20931", lines: [{ dateOfService: "2026-06-12", description: "RN visits 06/02–06/12 (4)", code: "G0299", charge: 110000 }], insurancePayments: 0, adjustments: 0, balanceDue: 110000, message: "Insurance denied these visits. Balance due from patient." },
    { id: "doc-claim-dme", type: "claim", title: "Claim: MedEquip Supply", provenance: caseFact(), claimNumber: "CLM-26-0605-7733", status: "denied", receivedDate: "2026-06-05", processedDate: "2026-06-16", billingProvider: "MedEquip Supply", networkStatus: "in_network", authorizationNumberOnClaim: "AUTH-2026-042233", lines: [{ dateOfService: "2026-05-03", code: "E0260", diagnosisCodes: ["I63.9"], units: 1, charge: 48000, lineStatus: "Denied", denialReason: "MN2: Authorization denied, not medically necessary" }] },
    { id: "doc-eob-dme", type: "eob", title: "EOB: hospital bed", provenance: caseFact(), claimNumber: "CLM-26-0605-7733", processedDate: "2026-06-16", patient: "Raymond Ellis", provider: "MedEquip Supply", networkStatus: "in_network", lines: [eobLine({ dateOfService: "2026-05-03", service: "Hospital bed rental (2 months)", code: "E0260", benefitKey: "dme", billed: 48000, memberResponsibility: 48000, remarkCodes: ["MN2"] })], remarks: [{ code: "MN2", text: "Authorization AUTH-2026-042233 was denied as not medically necessary. Amount is member responsibility." }] },
    { id: "doc-bill-dme", type: "provider_bill", title: "Statement: MedEquip Supply", provenance: caseFact(), providerName: "MedEquip Supply", statementDate: "2026-06-22", accountNumber: "MES-6612", lines: [{ dateOfService: "2026-05-03", description: "Hospital bed, semi-electric, rental x2 months", code: "E0260", charge: 48000 }], insurancePayments: 0, adjustments: 0, balanceDue: 48000 },
    planRulesDoc([
      ["Home health care", "rhus.benefit.home_health"],
      ["Pre-authorization list: home health", "rhus.pa.list.m"],
      ["Durable medical equipment", "rhus.benefit.dme"],
      ["Pre-authorization list: DME", "rhus.pa.list.h"],
      ["Missing pre-authorization", "rhus.pa.penalty"],
      ["Medical necessity", "rhus.structure.medical_necessity"],
      ["Governing document", "rhus.structure.spd_governs"],
    ]),
  ],
  tasks: [
    choice("t-hh-window", "Why were visits 9–12 reduced?", [["window", "They fell after the authorized period (05/04–05/31), and no extension is on file"], ["visits", "Home health is limited to 8 visits by the plan"], ["oon", "The agency is out of network"], ["dx", "The diagnosis didn't match"]], ["window"], { category: "prior_authorization", points: 3, basis: [fact("doc-auth-hh"), fact("doc-claim-hh"), rule("rhus.pa.list.m")], expectation: "Ties the reduction to the authorization window, not a plan visit limit.", missed: "The 8-visit limit was in the authorization, not a plan rule. The source states no visit limit for home health. Visits 06/02–06/12 fell outside the approved period, and no extension is on file." }, "Outside the authorized window, with no extension on file."),
    amount("t-hh-penalty", "Using the official rule, what reduction applies to the $600 of covered charges for visits 9–12?", 6000, { category: "plan_knowledge", points: 3, basis: [rule("rhus.pa.penalty"), fact("doc-eob-hh")], expectation: "Calculates 10% × $600 = $60.", missed: "Official rule: covered charges reduced by 10%, up to $500. 10% of $600 = $60." }, "$60.00"),
    amount("t-hh-over", "By how much does BrightPath's statement exceed what the EOB supports for visits 9–12?", 104000, { category: "eob_interpretation", points: 3, basis: [fact("doc-bill-hh"), fact("doc-eob-hh")], expectation: "Calculates $1,100 − $60 = $1,040.", missed: "The EOB paid $540 and assigned the member $60. BrightPath billed the full $1,100 as 'denied'. That's wrong by $1,040." }, "$1,040.00"),
    choice("t-dme", "What happened with the hospital bed?", [["denied", "Pre-authorization was requested and denied as not medically necessary, and the bed was delivered before the decision. The EOB assigns the $480 to the member."], ["missing", "No one requested pre-authorization"], ["linked", "It was approved but not linked"], ["notreq", "Hospital beds don't need pre-authorization"]], ["denied"], { category: "prior_authorization", points: 3, basis: [fact("doc-auth-dme"), fact("doc-eob-dme"), rule("rhus.structure.medical_necessity")], expectation: "Distinguishes a denied authorization from a missing one.", missed: "This isn't the 10% missing-authorization situation. A review found the documentation didn't show medical necessity, and services that aren't medically necessary aren't covered (official rule)." }, "Requested and denied as not medically necessary."),
    choice("t-dme-rule", "Which official rule makes a hospital-bed rental a pre-authorization item?", [["h", "List H: durable medical equipment over 30-day rental or purchase"], ["k", "List K: diagnostic testing"], ["none", "None: equipment never needs approval"], ["m", "List M: home health care"]], ["h"], { category: "prior_authorization", points: 3, basis: [rule("rhus.pa.list.h"), rule("rhus.benefit.dme")], expectation: "Identifies list H.", missed: "Official rule: list H covers DME over a 30-day rental or purchase. A 2-month rental qualifies." }, "List H."),
    amount("t-total", "Across both EOBs, what is the total member responsibility?", 54000, { category: "eob_interpretation", points: 3, basis: [fact("doc-eob-hh"), fact("doc-eob-dme")], expectation: "Totals $60 + $480.", missed: "Home health $60 + hospital bed $480 = $540, versus the $1,580 the two statements ask for." }, "$540.00", { measures: "eob_member_responsibility" }),
    choice(
      "t-appeal",
      "The caller asks: \"Can we fight the bed denial?\" What's the right answer?",
      [
        ["general", "A denied authorization can generally be disputed through an appeal with supporting documentation (e.g. the doctor documenting positioning needs). The plan's specific appeal procedure and deadlines aren't in our sources, so verify with the claims administrator and the plan documents (SPD), and involve the prescriber."],
        ["180", "Yes: file within 180 days on the SafetyWing appeal form"],
        ["no", "No: authorization denials are final"],
        ["resubmit", "Just resubmit the same claim"],
      ],
      ["general"],
      { category: "problem_solving", points: 4, basis: [concept("appeal"), concept("medical-necessity"), rule("rhus.structure.spd_governs")], expectation: "Explains the general appeal path without inventing plan-specific procedures or deadlines.", missed: "Appeals are a general concept. The Remote Health USA appeal procedure isn't in the knowledge base (it's in the SPD, which the lab doesn't have yet). Never quote a deadline or form you can't source." },
      "Generally yes, via appeal with documentation. Verify the plan's procedure.",
    ),
    selectAll("t-codes", "Which of these are HCPCS codes for services or supplies?", [["g0299", "G0299"], ["e0260", "E0260"], ["i639", "I63.9"], ["mn2", "MN2"]], ["g0299", "e0260"], { category: "coding_understanding", points: 3, basis: [concept("hcpcs"), concept("icd10")], expectation: "Separates HCPCS service/supply codes from the diagnosis.", missed: "G0299 (RN home visit) and E0260 (hospital bed) are HCPCS: what was provided. I63.9 (stroke) is the diagnosis. MN2 is a remark code." }, "G0299 and E0260."),
    investigation(
      INVESTIGATION_PROMPT,
      [
        { id: "c-two", category: "claims_reasoning", points: 4, basis: [fact("doc-eob-hh"), fact("doc-bill-hh"), fact("doc-eob-dme"), fact("doc-auth-dme")], expectation: "Separates the two providers. Home health: visits 9–12 fell outside the authorization, a $60 reduction, but the agency bills $1,100, so the statement is wrong. DME: authorization denied (medical necessity), so the EOB's $480 is consistent and the question is whether to dispute it.", missed: "Two providers, two different problems. One is a billing error. The other is a correct-on-its-face denial the family may want to challenge." },
        knownVsUnknown(3, "Treats BrightPath's claim of a faxed extension as unverified (nothing on file), and doesn't quote any appeal deadline or procedure.", [fact("doc-agency-note"), fact("doc-auth-hh"), concept("appeal")]),
        { id: "c-contacts", category: "problem_solving", points: 3, basis: [concept("care-coordination"), rule("rhus.pa.provider_usually_requests"), rule("rhus.structure.spd_governs")], expectation: "Contacts: BrightPath, to correct the $1,100 to the EOB's $60 and send proof of the 05/29 extension request (then raise it with the administrator); Dr. Hart / MedEquip, about documentation for a possible appeal of the bed denial; the claims administrator, for the plan's appeal procedure.", missed: "Each issue has a different owner. Map who does what before calling anyone." },
      ],
      "Home health: 8 visits were approved for 05/04–05/31 and paid in full. Visits 9–12 (06/02–06/12) fell after the window with no extension on file, so the official 10% reduction applied: $60 member responsibility. BrightPath's $1,100 statement ignores the plan's $540 payment and is wrong. Its claim of a 05/29 extension fax is unverified, so ask for proof and raise it with the administrator. Hospital bed: list H requires pre-authorization. It was requested and denied (medical necessity criteria not met) after the bed had already been delivered, and the EOB assigns $480 to the member, consistent with the denial. The family can generally dispute it through an appeal with better documentation from Dr. Hart, but the plan's appeal procedure isn't in our sources: get it from the claims administrator / SPD, and don't quote deadlines.",
    ),
    memberReply({
      accuracy: "Explains both separately: the nursing bill is wrong (the plan paid most of it, and the family's share per the plan is $60), and the bed was reviewed and not approved, so $480 is currently assigned to Raymond. A denial like that can generally be challenged.",
      accuracyBasis: [fact("doc-eob-hh"), fact("doc-eob-dme"), concept("appeal")],
      promises: "Doesn't promise the extension will be accepted, the bed denial overturned, or any appeal deadline or procedure the sources don't contain.",
      next: "Says not to pay the $1,100. Explains you're getting the agency to correct it and checking their extension claim, and that you'll get the plan's appeal steps for the bed and coordinate with Dr. Hart's office.",
      empathy: "Recognizes the caregiver's stress after a stroke and acknowledges that the bed matters to Raymond's care.",
    }),
  ],
  debrief: {
    whatHappened:
      "BrightPath kept visiting after the approved window ended on 05/31, with no extension on file. The plan paid those visits with a $60 reduction, but BrightPath billed $1,100. Separately, MedEquip delivered a hospital bed before its authorization was decided, and the request was then denied as not medically necessary, leaving $480 with the member.",
    correctReasoning: [
      "Official rules: home health (M) and DME over 30 days or purchase (H) require pre-authorization.",
      "Visits 9–12 were outside the authorized window, so a 10% reduction = $60. The agency's $1,100 is wrong by $1,040.",
      "The agency's 'we faxed an extension' is unverified. Ask for proof; don't assume.",
      "Bed: required, requested and denied (medical necessity). Not the missing-authorization penalty.",
      "Appeals are a general concept. The plan's procedure and deadlines aren't sourced, so get them from the administrator / SPD.",
    ],
    modelMemberResponse:
      "Mrs. Ellis, I'm so sorry. You're juggling a lot after Raymond's stroke. Two separate things are going on. First, the nursing bill: the approval covered visits through May 31. The last four came after that, so the plan paid them minus a small reduction. Your share is $60, not $1,100. Please don't pay that bill. I'm asking BrightPath to correct it, and to send proof of the extension they say they faxed. Second, the bed: the plan reviewed it and didn't approve it based on the paperwork it received, so $480 is currently assigned to Raymond. Decisions like this can usually be challenged with more information from his doctor. I'll get the plan's exact steps and coordinate with Dr. Hart's office. I'll call you back by Thursday.",
    conceptsToReview: ["prior-authorization", "appeal", "medical-necessity", "provider-statement"],
  },
};
