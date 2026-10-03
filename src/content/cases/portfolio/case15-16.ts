import type { SimulationCaseInput } from "@/domain/case";
import { caseFact } from "@/domain/provenance";
import {
  DOCS_ASSUMPTION, FICTION_ASSUMPTION, INVESTIGATION_PROMPT, RHUS_PLAN, amount, assumed, choice, concept, cpt, eobLine, fact, hcpcs, icd,
  investigation, knowledge, knownVsUnknown, memberReply, planRulesDoc, rule, selectAll,
} from "./helpers";

// =============================================================================
// CASE 15 · Advanced · Specialty authorization pending (oncology)
// =============================================================================
export const case15: SimulationCaseInput = {
  id: "case-15-chemo-auth-pending",
  version: 1,
  portfolioNumber: 15,
  code: "CASE-15",
  title: "New cancer treatment, approval \"pending\"",
  summary: "The oncologist changed the member's regimen. The existing approval covers the old drugs, and the new request is pending two days before the infusion.",
  scenario: "Specialty authorization: chemo (E) and infusion (L) require pre-authorization. The existing approval doesn't cover the new drug, and the new request is pending. High-empathy communication with no promises and no medical advice.",
  recordingPriority: "high",
  difficulty: "advanced",
  status: "ready",
  isSample: false,
  caseTypes: ["prior_authorization", "coordination", "coding"],
  skills: ["specialty_authorization", "prior_auth", "cpt", "icd10", "provider_communication", "member_communication"],
  knowledge: knowledge(
    ["rhus.benefit.oncology", "rhus.benefit.infusion", "rhus.pa.list.e", "rhus.pa.list.l", "rhus.pa.provider_usually_requests", "rhus.pa.member_must_confirm", "rhus.pa.penalty", "rhus.cost.in_network_no_cost_share"],
    ["prior-authorization", "authorization-linking", "hcpcs", "cpt", "icd10", "medical-necessity", "eob"],
  ),
  ticket: {
    channel: "phone",
    receivedAt: "2026-08-20T15:30:00Z",
    memberMessage:
      "(Call notes) Member is upset. Her oncologist switched her to a new treatment and the office says insurance approval is \"pending\". Her next infusion is Friday (08/22). She asks: \"Will I be covered? I can't afford to pay for cancer drugs myself. Should I postpone?\"",
  },
  member: { name: "Margaret O'Neill", memberId: "RHU-19944-02", details: "Spouse of employee" },
  plan: RHUS_PLAN,
  provider: { name: "Lakeview Oncology", type: "Oncology practice with infusion center (fictional)", networkStatus: "in_network" },
  codes: [
    cpt("96413", "Chemotherapy given by IV infusion, up to 1 hour (first drug)."),
    hcpcs("J9045", "Carboplatin, 50 mg (drug supplied)."),
    hcpcs("J9271", "Pembrolizumab, 1 mg (drug supplied)."),
    icd("C34.12", "Malignant neoplasm of the upper lobe, left bronchus or lung."),
  ],
  assumptions: [FICTION_ASSUMPTION, DOCS_ASSUMPTION, "The official sources don't describe an expedited or urgent review process. Any such option must be confirmed with the claims administrator."],
  documents: [
    { id: "doc-auth-1", type: "authorization", title: "Authorization: AUTH-2026-041207 (current regimen)", provenance: caseFact(), authNumber: "AUTH-2026-041207", status: "approved", service: "Chemotherapy infusion: carboplatin", codes: ["96413", "J9045"], diagnosisCodes: ["C34.12"], requestingProvider: "Dr. Priyanka Sen (Oncology)", servicingProvider: "Lakeview Oncology", decisionDate: "2026-04-28", validFrom: "2026-05-01", validTo: "2026-10-31", requirement: { benefitKey: "oncology", required: true } },
    { id: "doc-auth-2", type: "authorization", title: "Authorization: request REQ-2026-088153 (new regimen)", provenance: caseFact(), status: "pending", service: "Infusion: pembrolizumab", codes: ["96413", "J9271"], diagnosisCodes: ["C34.12"], requestingProvider: "Dr. Priyanka Sen (Oncology)", servicingProvider: "Lakeview Oncology", requestedDate: "2026-08-18", notes: "Received 08/18. In clinical review. No decision yet.", requirement: { benefitKey: "infusion", required: true } },
    { id: "doc-claim", type: "claim", title: "Claim record: cycle 3 (07/25)", provenance: caseFact(), claimNumber: "CLM-26-0728-6120", status: "processed_paid", receivedDate: "2026-07-28", processedDate: "2026-08-07", billingProvider: "Lakeview Oncology", networkStatus: "in_network", authorizationNumberOnClaim: "AUTH-2026-041207", lines: [
      { dateOfService: "2026-07-25", code: "96413", diagnosisCodes: ["C34.12"], units: 1, charge: 98000, lineStatus: "Paid" },
      { dateOfService: "2026-07-25", code: "J9045", diagnosisCodes: ["C34.12"], units: 12, charge: 54000, lineStatus: "Paid" },
    ] },
    { id: "doc-eob", type: "eob", title: "Explanation of Benefits: cycle 3", provenance: caseFact(), claimNumber: "CLM-26-0728-6120", processedDate: "2026-08-07", patient: "Margaret O'Neill", provider: "Lakeview Oncology", networkStatus: "in_network", lines: [
      eobLine({ dateOfService: "2026-07-25", service: "Chemo infusion, first hour", code: "96413", benefitKey: "oncology", billed: 98000, allowed: 42000, planPaid: 42000 }),
      eobLine({ dateOfService: "2026-07-25", service: "Carboplatin", code: "J9045", benefitKey: "oncology", billed: 54000, allowed: 21000, planPaid: 21000 }),
    ] },
    { id: "doc-office", type: "note", title: "Lakeview financial counselor note", provenance: caseFact(), author: "Lakeview Oncology", date: "2026-08-19", body: "New regimen (pembrolizumab) submitted for authorization 08/18. If no decision by date of service, our policy is to reschedule or ask the patient to sign a financial responsibility form before treatment." },
    planRulesDoc([
      ["Oncology services", "rhus.benefit.oncology"],
      ["Infusion services", "rhus.benefit.infusion"],
      ["Pre-authorization list: chemo", "rhus.pa.list.e"],
      ["Pre-authorization list: infusion", "rhus.pa.list.l"],
      ["Who requests pre-authorization", "rhus.pa.provider_usually_requests"],
      ["Member's responsibility", "rhus.pa.member_must_confirm"],
      ["Missing pre-authorization", "rhus.pa.penalty"],
    ]),
  ],
  tasks: [
    choice("t-cover", "Does the existing approval (AUTH-2026-041207) cover the new treatment?", [["no", "No: it covers infusion with carboplatin (J9045). The new drug (J9271) needs its own approval."], ["yes", "Yes: it's valid through 10/31 for the same diagnosis"], ["partly", "Yes, for up to two cycles"], ["notreq", "The new drug doesn't need approval"]], ["no"], { category: "prior_authorization", points: 4, basis: [fact("doc-auth-1"), fact("doc-auth-2"), concept("authorization-linking")], expectation: "Recognizes that authorizations are drug- and service-specific.", missed: "Same diagnosis and a valid window don't extend an approval to a different drug. AUTH-2026-041207 lists J9045, and the new regimen is J9271." }, "No."),
    selectAll("t-list", "Which items on the official pre-authorization list apply to this treatment?", [["e", "E: Chemotherapy, radiation therapy"], ["l", "L: Infusion services"], ["k", "K: Diagnostic testing (MRI/PET/CT)"], ["p", "P: Hospice care"]], ["e", "l"], { category: "prior_authorization", points: 4, basis: [rule("rhus.pa.list.e"), rule("rhus.pa.list.l"), rule("rhus.benefit.oncology"), rule("rhus.benefit.infusion")], expectation: "Maps the treatment to list items E and L.", missed: "Official rules: chemo and radiation (E) and infusion services (L) require pre-authorization, and both benefit rows say so." }, "E and L."),
    choice("t-status", "What's the status of the new request?", [["pending", "Pending: received 08/18, in clinical review, no decision yet"], ["approved", "Approved"], ["denied", "Denied"], ["none", "Never submitted"]], ["pending"], { category: "prior_authorization", points: 2, basis: [fact("doc-auth-2")], expectation: "Reads the pending status accurately.", missed: "REQ-2026-088153 is pending, which is neither approved nor denied." }, "Pending."),
    amount("t-eob", "On the cycle 3 EOB, what was the member responsibility?", 0, { category: "eob_interpretation", points: 3, basis: [fact("doc-eob")], expectation: "Reads $0.00.", missed: "Both cycle 3 lines were paid in full in network. Member responsibility $0.00." }, "$0.00", { measures: "eob_member_responsibility" }),
    choice("t-ifnot", "If treatment went ahead without approval, what is the plan's documented consequence?", [["penalty", "Covered charges are reduced by 10% (up to $500). Whether the request itself is approved is a separate question."], ["full", "The member automatically owes the full cost of the drug"], ["none", "There's no consequence for cancer treatment"], ["cancel", "Coverage is cancelled"]], ["penalty"], { category: "plan_knowledge", points: 4, basis: [rule("rhus.pa.penalty")], expectation: "States the official consequence without overstating it.", missed: "Official rule: missing pre-authorization reduces covered charges by 10%, up to $500. Coverage also depends on the service being covered and medically necessary, which is what the pending review decides. Don't promise either way." }, "A 10% reduction (up to $500), plus the separate question of approval."),
    selectAll("t-codes", "Select every code that describes something done or supplied (not a diagnosis).", [["96413", "96413"], ["j9271", "J9271"], ["j9045", "J9045"], ["c3412", "C34.12"]], ["96413", "j9271", "j9045"], { category: "coding_understanding", points: 4, basis: [concept("cpt"), concept("hcpcs"), concept("icd10")], expectation: "Recognizes CPT and HCPCS as service/supply codes.", missed: "96413 (CPT) is the infusion administration. J9045 and J9271 (HCPCS) are the drugs supplied. C34.12 is the diagnosis." }, "96413, J9271, J9045."),
    choice("t-icd", "What does C34.12 tell the reviewer?", [["why", "Why treatment is needed: cancer of the upper lobe of the left lung"], ["drug", "Which drug is given"], ["dose", "The dose"], ["auth", "That the request is approved"]], ["why"], { category: "coding_understanding", points: 2, basis: [concept("icd10"), concept("medical-necessity")], expectation: "Identifies the diagnosis as the reason for care.", missed: "C34.12 is the diagnosis. It supports the medical necessity of the treatment." }, "The diagnosis."),
    investigation(
      INVESTIGATION_PROMPT,
      [
        { id: "c-gap", category: "prior_authorization", points: 4, basis: [fact("doc-auth-1"), fact("doc-auth-2"), rule("rhus.pa.list.e"), rule("rhus.pa.list.l")], expectation: "Identifies the gap: the current approval covers carboplatin, not pembrolizumab. The new treatment requires pre-authorization (E, L), and the request is pending with the infusion two days away.", missed: "Name the gap precisely: which approval covers what, and what's still pending." },
        { id: "c-actions", category: "problem_solving", points: 4, basis: [rule("rhus.pa.provider_usually_requests"), concept("care-coordination"), fact("doc-office"), assumed(2)], expectation: "Plans to: confirm with Lakeview that the request is complete and whether the reviewer needs anything; check the request's status with the claims administrator and ask whether an urgent review is available (the sources don't describe one, so ask, don't promise); and call the member back with the outcome.", missed: "Specialty authorizations often stall on missing clinical information. Coordinate both sides today, and don't invent an expedited process." },
        knownVsUnknown(2, "Separates the known (pending since 08/18; $0 on the current regimen) from the unknown (decision and timing), and doesn't give medical advice about postponing. That decision belongs with the oncologist.", [fact("doc-auth-2"), concept("member-communication")]),
      ],
      "The current approval (AUTH-2026-041207) covers infusion with carboplatin (J9045) through 10/31. Cycle 3 was paid in full ($0). The new regimen uses pembrolizumab (J9271), which needs its own approval: chemo (E) and infusion (L) are both on the official list. Request REQ-2026-088153 has been pending since 08/18, and the infusion is 08/22. Actions: confirm with Lakeview that the request is complete; check status with the claims administrator and ask whether an urgent review is possible (not described in the sources); and call the member back. If treatment went ahead without approval, the documented consequence is a 10% reduction (up to $500), but coverage itself depends on the review. Whether to postpone is a decision for the member and her oncologist.",
    ),
    memberReply({
      accuracy: "Explains that her current treatment was approved and fully covered, that the new medicine needs its own approval, and that the request is under review with no decision yet.",
      accuracyBasis: [fact("doc-eob"), fact("doc-auth-2")],
      promises: "Doesn't promise approval, timing, or that she won't owe anything. Doesn't advise for or against postponing treatment.",
      next: "Says exactly what you'll do today (call Lakeview and the claims team) and when you'll call her back, before Friday. Leaves the treatment decision to her and her oncologist.",
      empathy: "Shows genuine empathy for a member facing cancer treatment and financial fear.",
    }),
  ],
  debrief: {
    whatHappened:
      "The current regimen was authorized and paid in full. The oncologist switched to a new drug (pembrolizumab), which needs its own pre-authorization. The request was submitted on 08/18 and is still pending two days before the infusion.",
    correctReasoning: [
      "Authorizations are drug- and service-specific. AUTH-2026-041207 (J9045) doesn't cover J9271.",
      "Official rules: chemotherapy (E) and infusion services (L) require pre-authorization.",
      "The request is pending: neither approved nor denied. No promises either way.",
      "Official rule: missing pre-authorization means a 10% reduction (up to $500). Coverage itself is a separate review question.",
      "The sources don't describe an expedited review. Ask the administrator; don't invent one.",
      "Medical decisions (postponing) belong to the member and her oncologist.",
    ],
    modelMemberResponse:
      "Margaret, I'm so sorry you're dealing with this on top of everything else. Let me tell you where things stand. Your current treatment was approved, and your plan has covered it in full. Because your doctor changed your medicine, the new one needs its own approval, and that request is being reviewed now. There's no decision yet. Today I'm calling your oncology office to make sure they've sent everything the reviewers need, and I'm checking with the claims team on the request and whether it can be looked at sooner. I can't promise the outcome, but I'll call you back by tomorrow afternoon, before Friday. Whether to keep Friday's appointment is a decision for you and Dr. Sen, and I'll make sure you have the latest information to make it.",
    conceptsToReview: ["prior-authorization", "authorization-linking", "hcpcs"],
  },
};


// =============================================================================
// CASE 16 · Advanced · Specialty pharmacy rejection: prior authorization
// =============================================================================
export const case16: SimulationCaseInput = {
  id: "case-16-pharmacy-pa",
  version: 1,
  portfolioNumber: 16,
  code: "CASE-16",
  title: "\"The pharmacy wants $6,912\"",
  summary: "A specialty pharmacy rejects a rheumatoid-arthritis drug pending prior authorization and quotes the cash price. The plan sources list the specialty copay but don't describe a pharmacy authorization process.",
  scenario: "Pharmacy authorization. A rejected pharmacy claim shows the cash price, not cost share. Specialty copay of $50 (official). The source is silent on the pharmacy PA process, so verify. Contrasted with medical-benefit infusion (list L).",
  recordingPriority: "high",
  difficulty: "advanced",
  status: "ready",
  isSample: false,
  caseTypes: ["prior_authorization", "coordination"],
  skills: ["pharmacy_authorization", "specialty_authorization", "prior_auth", "member_responsibility", "provider_communication", "plain_english"],
  knowledge: knowledge(
    ["rhus.rx.specialty", "rhus.benefit.pharmacy_specialty", "rhus.benefit.infusion", "rhus.pa.list.l", "rhus.cost.in_network_no_cost_share"],
    ["pharmacy-prior-authorization", "prior-authorization", "member-responsibility", "copayment", "hcpcs", "icd10"],
  ),
  ticket: {
    channel: "chat",
    receivedAt: "2026-11-05T09:40:00Z",
    memberMessage:
      "The specialty pharmacy just told me my new arthritis medication needs \"prior authorization\" and if I want it today it's $6,912!!! My rheumatologist says they faxed something already. I only have a few days of my old medication left. What do I do?",
  },
  member: { name: "Jasmine Walker", memberId: "RHU-90417-01", details: "Employee" },
  plan: RHUS_PLAN,
  provider: { name: "CityCare Specialty Pharmacy", type: "Specialty pharmacy (fictional). Pharmacy network status isn't addressed in the sources.", networkStatus: "unknown" },
  codes: [icd("M06.9", "Rheumatoid arthritis, unspecified."), hcpcs("J1745", "Infliximab injection, 10 mg (an infused drug given in a clinic).")],
  assumptions: [
    FICTION_ASSUMPTION,
    "Pharmacy messages and amounts are simulated. The drug is a self-injected specialty medication dispensed by a specialty pharmacy.",
    "The official sources list specialty drug copays but don't describe a pharmacy prior-authorization process, timelines or criteria.",
  ],
  documents: [
    { id: "doc-rx-claim", type: "note", title: "Pharmacy claim response", provenance: caseFact(), author: "CityCare Specialty Pharmacy", date: "2026-11-05", body: "Drug: adalimumab pen (self-injected), qty 2 (28-day supply). Claim REJECTED: prior authorization required. Cash price if dispensed without coverage: $6,912.40." },
    { id: "doc-prescriber", type: "note", title: "Rheumatology office note", provenance: caseFact(), author: "Dr. Alana Reyes (Rheumatology)", date: "2026-11-04", body: "Diagnosis: rheumatoid arthritis (M06.9). Prior authorization form faxed 11/03 to the number on the pharmacy's rejection notice. No confirmation received yet. Alternative if needed: in-clinic infusion (infliximab, J1745)." },
    planRulesDoc([
      ["Specialty drugs", "rhus.rx.specialty"],
      ["Specialty drugs (benefit)", "rhus.benefit.pharmacy_specialty"],
      ["Infusion services", "rhus.benefit.infusion"],
      ["Pre-authorization list: infusion", "rhus.pa.list.l"],
      ["In-network cost sharing", "rhus.cost.in_network_no_cost_share"],
    ]),
  ],
  tasks: [
    choice("t-6912", "What is the $6,912 the pharmacy quoted?", [["cash", "The full cash price: the pharmacy claim was rejected pending prior authorization, so no coverage has been applied"], ["copay", "The member's cost share under the plan"], ["deductible", "The member's deductible"], ["coins", "Coinsurance on a specialty drug"]], ["cash"], { category: "claims_reasoning", points: 4, basis: [fact("doc-rx-claim"), concept("pharmacy-prior-authorization")], expectation: "Distinguishes a cash price from member cost share.", missed: "A rejected pharmacy claim means coverage hasn't been applied, so the quote is the full cash price. It's not what the member would owe under the plan." }, "The cash price."),
    amount("t-copay", "If the drug is approved and covered as a specialty drug, what copay do the official rules list for a 30-day supply?", 5000, { category: "plan_knowledge", points: 4, basis: [rule("rhus.rx.specialty")], expectation: "Applies the specialty drug copay ($50).", missed: "Official rule: specialty drugs, 30-day supply, $50 copay, no deductible." }, "$50.00"),
    choice("t-ded", "Would the deductible apply to that specialty copay?", [["no", "No: the source lists specialty drugs as 'No deductible'"], ["yes", "Yes: the full deductible first"], ["oon", "Only the out-of-network deductible"], ["unknown", "The sources don't say anything about it"]], ["no"], { category: "plan_knowledge", points: 2, basis: [rule("rhus.rx.specialty")], expectation: "Knows pharmacy copays have no deductible.", missed: "Official rule: specialty drugs, $50, 'No deductible'." }, "No deductible."),
    choice("t-source", "What do the official Remote Health USA sources say about pharmacy prior authorization?", [["silent", "They list specialty drug copays but don't describe a pharmacy authorization process, so requirements and timelines must be verified, not assumed"], ["5days", "Decisions are made within 5 business days"], ["never", "Pharmacy drugs never need authorization"], ["list-l", "It's the same as list item L, so infusion rules apply"]], ["silent"], { category: "plan_knowledge", points: 4, basis: [rule("rhus.rx.specialty"), concept("pharmacy-prior-authorization"), assumed(2)], expectation: "Recognizes the source gap and doesn't invent a rule.", missed: "The knowledge base has specialty copays, but no pharmacy authorization process, timelines or criteria. Saying so, and verifying, is the correct answer. Inventing a timeline is the mistake to avoid." }, "The sources are silent, so verify."),
    choice("t-infusion", "If the rheumatologist switched to an in-clinic infusion (J1745), what official rule would apply?", [["l", "Infusion services require pre-authorization (list L) under the medical benefit, which is 100% in network"], ["none", "No authorization needed for clinic infusions"], ["rx", "The $50 specialty pharmacy copay"], ["oon", "70% after deductible regardless of network"]], ["l"], { category: "prior_authorization", points: 3, basis: [rule("rhus.pa.list.l"), rule("rhus.benefit.infusion"), rule("rhus.cost.in_network_no_cost_share"), fact("doc-prescriber")], expectation: "Contrasts the pharmacy benefit with medical-benefit infusion.", missed: "Official rules: infusion services require pre-authorization (L) and are 100% in network. A clinic-administered drug runs through the medical benefit, not the pharmacy copay." }, "List L: infusion pre-authorization, medical benefit."),
    selectAll("t-codes", "Which of these is a diagnosis code?", [["m069", "M06.9"], ["j1745", "J1745"], ["qty", "Qty 2 (28-day)"], ["fax", "The fax date 11/03"]], ["m069"], { category: "coding_understanding", points: 3, basis: [concept("icd10"), concept("hcpcs")], expectation: "Identifies the ICD-10 code only.", missed: "M06.9 (rheumatoid arthritis) is the diagnosis. J1745 is a HCPCS drug code: what's supplied." }, "M06.9."),
    investigation(
      INVESTIGATION_PROMPT,
      [
        { id: "c-picture", category: "claims_reasoning", points: 4, basis: [fact("doc-rx-claim"), fact("doc-prescriber"), rule("rhus.rx.specialty")], expectation: "Explains that the pharmacy claim was rejected pending authorization, that $6,912 is the cash price, and that if approved and covered, the plan's listed specialty copay is $50 per 30-day supply.", missed: "Translate the pharmacy's rejection into what it means for the member, using only what the sources support." },
        knownVsUnknown(4, "States clearly that the sources don't describe the pharmacy authorization process. Verifies with the claims administrator (or the pharmacy benefit contact it designates) whether the 11/03 request was received, its status, and whether anything is missing. Doesn't quote timelines.", [assumed(2), concept("pharmacy-prior-authorization")]),
        { id: "c-coord", category: "problem_solving", points: 2, basis: [concept("care-coordination"), fact("doc-prescriber")], expectation: "Coordinates with the rheumatology office (confirm the fax went to the right place; resend if needed) and keeps the member informed. Flags the short medication supply to the prescriber as a clinical matter.", missed: "The prescriber submits the clinical request, and the member's dwindling supply is a clinical concern for the prescriber, not something to solve by paying cash." },
      ],
      "CityCare rejected the adalimumab claim pending prior authorization and quoted the $6,912.40 cash price, which is not the member's cost share. If approved and covered as a specialty drug, the official rule lists a $50 copay per 30-day supply with no deductible. The official sources don't describe a pharmacy authorization process or timelines, so verify: ask the claims administrator (or its designated pharmacy benefit contact) whether the 11/03 request arrived, its status, and whether anything is missing. Confirm with Dr. Reyes' office where it was faxed, and flag the member's short supply to them. For contrast: an in-clinic infusion (J1745) would go through the medical benefit and requires pre-authorization (list L).",
    ),
    memberReply({
      accuracy: "Explains that the $6,912 is the price without insurance because approval is still needed, and that once approved and covered, the plan's listed cost for specialty medicines is $50 for a 30-day supply. Says this depends on approval.",
      accuracyBasis: [fact("doc-rx-claim"), rule("rhus.rx.specialty")],
      promises: "Doesn't promise approval, a decision date, or the $50 price before approval. Doesn't quote authorization timelines the sources don't provide.",
      next: "Advises not paying the $6,912 cash price for now. Says you're checking on the request with the claims team and the doctor's office today, and asks the member to tell her rheumatologist how many days of medication she has left.",
    }),
  ],
  debrief: {
    whatHappened:
      "The specialty pharmacy rejected the new drug pending prior authorization and quoted the cash price. The prescriber says a request was faxed on 11/03, but nothing is confirmed. The plan sources list a $50 specialty copay but don't describe the pharmacy authorization process.",
    correctReasoning: [
      "Rejected pharmacy claim = cash price ($6,912), not cost share.",
      "Official rule: specialty drugs, 30-day supply, $50, no deductible, once approved and covered.",
      "The sources are silent on pharmacy authorization process and timelines. Verify; don't invent.",
      "Contrast: an in-clinic infusion would require pre-authorization under list L (medical benefit, 100% in network).",
      "Coordinate with the prescriber, and flag the short supply to them as a clinical issue.",
    ],
    modelMemberResponse:
      "Hi Jasmine, that number would scare anyone, so let me explain. The $6,912 is the pharmacy's price without insurance, because your plan hasn't approved the new medicine yet. Once it's approved and covered, your plan lists $50 for a 30-day supply of specialty medicines like this. Please don't pay the $6,912. Today I'm checking with the claims team whether your doctor's request arrived and if anything is missing, and I'm confirming with Dr. Reyes' office where it was sent. Please also let your rheumatologist know you only have a few days of your current medication left, so they can plan for that. I can't promise how fast the approval will come, but I'll update you by tomorrow afternoon.",
    conceptsToReview: ["pharmacy-prior-authorization", "copayment", "prior-authorization"],
  },
};

