import type { SimulationCaseInput } from "@/domain/case";
import { caseFact } from "@/domain/provenance";
import {
  DOCS_ASSUMPTION, FICTION_ASSUMPTION, INVESTIGATION_PROMPT, RHUS_PLAN, amount, assumed, choice, concept, cpt, eobLine, fact, hcpcs, icd,
  investigation, knowledge, knownVsUnknown, memberReply, planRulesDoc, rule, selectAll,
} from "./helpers";

// =============================================================================
// CASE 19 · Complex · Genetic test: approved lab, wrong lab, wrong date
// =============================================================================
export const case19: SimulationCaseInput = {
  id: "case-19-genetic-test-lab",
  version: 1,
  portfolioNumber: 19,
  code: "CASE-19",
  title: "\"But it was approved!\": the genetic test sent to another lab",
  summary: "BRCA testing was approved for an in-network lab within a date window. The specimen went to an out-of-network lab after the window closed, producing out-of-network cost sharing, a 10% reduction and a balance bill.",
  scenario: "The authorization covers a different provider and date. Out-of-network deductible, coinsurance, reduction, and a $2,200 balance bill. Some facts are known, much needs verification, and several parties need contacting.",
  recordingPriority: "high",
  difficulty: "complex",
  status: "ready",
  isSample: false,
  caseTypes: ["complex", "prior_authorization", "claims_investigation"],
  skills: ["complex_investigation", "prior_auth", "network_status", "balance_billing", "member_responsibility", "inconsistency_detection", "member_communication"],
  knowledge: knowledge(
    ["rhus.benefit.genetic_testing", "rhus.pa.list.n", "rhus.pa.penalty", "rhus.pa.penalty_not_counted", "rhus.cost.deductible.out_of_network", "rhus.cost.coinsurance.out_of_network", "rhus.cost.balance_billing", "rhus.cost.oop.never_counts", "rhus.cost.oop.out_of_network", "rhus.structure.cigna_ppo_network"],
    ["prior-authorization", "authorization-linking", "network", "deductible", "coinsurance", "balance-billing", "out-of-pocket-max", "eob", "provider-statement", "cpt", "icd10"],
  ),
  ticket: {
    channel: "email",
    receivedAt: "2026-08-28T13:37:00Z",
    memberMessage:
      "My genetic test was APPROVED. My doctor told me so in May. Now I have a $3,700 bill from a lab I've never heard of and an EOB saying I owe $1,500 and something about no matching authorization. I followed every rule. What is going on? — Rachel",
  },
  member: { name: "Rachel Adler", memberId: "RHU-44261-01", details: "Employee. No out-of-network spending earlier in 2026." },
  plan: RHUS_PLAN,
  provider: { name: "Helix Reference Labs", type: "Reference laboratory (fictional)", networkStatus: "out_of_network" },
  codes: [cpt("81162", "BRCA1/BRCA2 gene analysis (full sequence plus deletion/duplication analysis)."), icd("Z80.3", "Family history of malignant neoplasm of breast.")],
  assumptions: [
    FICTION_ASSUMPTION,
    DOCS_ASSUMPTION,
    "The EOB applies the deductible and coinsurance before the 10% reduction, and shows the reduction as 'not covered'. The source doesn't describe the order or format.",
  ],
  documents: [
    { id: "doc-auth", type: "authorization", title: "Authorization record", provenance: caseFact(), authNumber: "AUTH-2026-044518", status: "approved", service: "BRCA1/2 full gene analysis", codes: ["81162"], diagnosisCodes: ["Z80.3"], requestingProvider: "Dr. Hannah Kim (OB/GYN)", servicingProvider: "Northstar Genomics (in network)", decisionDate: "2026-04-29", validFrom: "2026-05-01", validTo: "2026-06-30", requirement: { benefitKey: "genetic_testing", required: true } },
    { id: "doc-clinic", type: "note", title: "Clinic note (Dr. Kim's office)", provenance: caseFact(), author: "Dr. Kim's office", date: "2026-07-08", body: "Blood drawn 07/08 (patient rescheduled from June). Specimen sent to Helix Reference Labs due to Northstar courier delay." },
    { id: "doc-claim", type: "claim", title: "Claim record", provenance: caseFact(), claimNumber: "CLM-26-0721-3049", status: "processed_paid", receivedDate: "2026-07-21", processedDate: "2026-08-14", billingProvider: "Helix Reference Labs", networkStatus: "out_of_network", lines: [{ dateOfService: "2026-07-08", code: "81162", diagnosisCodes: ["Z80.3"], units: 1, charge: 420000, lineStatus: "Paid: out of network, with reduction" }] },
    { id: "doc-eob", type: "eob", title: "Explanation of Benefits", provenance: caseFact(), claimNumber: "CLM-26-0721-3049", processedDate: "2026-08-14", patient: "Rachel Adler", provider: "Helix Reference Labs", networkStatus: "out_of_network", lines: [eobLine({ dateOfService: "2026-07-08", service: "BRCA1/2 analysis", code: "81162", benefitKey: "genetic_testing", billed: 420000, allowed: 200000, deductible: 100000, coinsurance: 30000, notCovered: 20000, planPaid: 50000, memberResponsibility: 150000, remarkCodes: ["OON1", "PA05"] })], remarks: [{ code: "OON1", text: "Out-of-network benefits applied. The provider may bill you for charges above the allowed amount." }, { code: "PA05", text: "No pre-authorization on file matching this provider and date of service. Covered charges reduced 10% (maximum $500)." }] },
    { id: "doc-bill", type: "provider_bill", title: "Provider statement", provenance: caseFact(), providerName: "Helix Reference Labs", statementDate: "2026-08-22", accountNumber: "HRL-0091847", lines: [{ dateOfService: "2026-07-08", description: "BRCA1/BRCA2 full sequence + del/dup", code: "81162", charge: 420000 }], insurancePayments: 50000, adjustments: 0, balanceDue: 370000 },
    planRulesDoc([
      ["Genetic testing", "rhus.benefit.genetic_testing"],
      ["Pre-authorization list", "rhus.pa.list.n"],
      ["Missing pre-authorization", "rhus.pa.penalty"],
      ["Penalty and accumulators", "rhus.pa.penalty_not_counted"],
      ["Out-of-network deductible", "rhus.cost.deductible.out_of_network"],
      ["Out-of-network coinsurance", "rhus.cost.coinsurance.out_of_network"],
      ["Balance billing", "rhus.cost.balance_billing"],
      ["Charges that never count", "rhus.cost.oop.never_counts"],
    ]),
  ],
  tasks: [
    selectAll("t-mismatch", "In what ways does the claim differ from the authorization? Select all that apply.", [["lab", "A different lab: Helix (out of network) instead of Northstar (in network)"], ["date", "A date of service (07/08) after the authorization ended (06/30)"], ["code", "A different test code"], ["dx", "A different diagnosis"]], ["lab", "date"], { category: "prior_authorization", points: 4, basis: [fact("doc-auth"), fact("doc-claim"), fact("doc-clinic"), concept("authorization-linking")], expectation: "Finds both the provider and the date mismatch, and confirms code and diagnosis match.", missed: "Check every element. The test (81162) and reason (Z80.3) match, but the servicing lab and the date don't. 'It was approved' was true for a different lab in a window that had ended." }, "Different lab and a date after the window."),
    amount("t-ded", "How much was applied to the out-of-network deductible?", 100000, { category: "plan_knowledge", points: 3, basis: [rule("rhus.cost.deductible.out_of_network"), fact("doc-eob")], expectation: "Reads/derives the $1,000 deductible (none met before).", missed: "Official rule: the out-of-network deductible is $1,000, and none had been met, so the first $1,000 of the $2,000 allowed amount." }, "$1,000.00"),
    amount("t-coins", "Calculate the member's coinsurance on the allowed amount remaining after the deductible.", 30000, { category: "plan_knowledge", points: 3, basis: [rule("rhus.cost.coinsurance.out_of_network")], expectation: "Calculates 30% × ($2,000 − $1,000) = $300.", missed: "Out of network the plan pays 70% after the deductible, so the member pays 30% of the remaining $1,000 = $300." }, "$300.00"),
    amount("t-penalty", "Using the official rule, what is the reduction on $2,000 of covered charges?", 20000, { category: "plan_knowledge", points: 3, basis: [rule("rhus.pa.penalty"), assumed(2)], expectation: "Calculates 10% × $2,000 = $200.", missed: "Official rule: covered charges are reduced by 10%, up to $500. 10% of $2,000 = $200." }, "$200.00"),
    amount("t-owed", "According to the EOB, what is the member responsibility?", 150000, { category: "eob_interpretation", points: 3, basis: [fact("doc-eob")], expectation: "Reads $1,500 = $1,000 + $300 + $200.", missed: "Deductible $1,000 + coinsurance $300 + reduction $200 = $1,500." }, "$1,500.00", { measures: "eob_member_responsibility" }),
    choice("t-oop", "How much of the $1,500 counts toward the out-of-network out-of-pocket limit?", [["1300", "$1,300 (deductible + coinsurance). The $200 reduction doesn't count."], ["1500", "All $1,500"], ["200", "Only the $200"], ["0", "None of it"]], ["1300"], { category: "plan_knowledge", points: 3, basis: [rule("rhus.pa.penalty_not_counted"), rule("rhus.cost.oop.out_of_network")], expectation: "Excludes the penalty from accumulators.", missed: "Official rule: the pre-authorization penalty doesn't count toward the deductible or out-of-pocket maximum. Deductible and coinsurance do." }, "$1,300."),
    amount("t-bb", "How much of Helix's $3,700 balance is above the allowed amount?", 220000, { category: "eob_interpretation", points: 3, basis: [fact("doc-bill"), fact("doc-eob"), rule("rhus.cost.balance_billing")], expectation: "Calculates $4,200 − $2,000 = $2,200.", missed: "$3,700 = $1,500 (EOB) + $2,200 above the allowed amount (out-of-network balance billing)." }, "$2,200.00"),
    choice("t-codes", "Which pairing is correct?", [["right", "81162 = the genetic test performed; Z80.3 = family history of breast cancer (the reason)"], ["rev", "81162 = family history; Z80.3 = the test"], ["pa05", "PA05 = the diagnosis"], ["both", "Both describe the lab"]], ["right"], { category: "coding_understanding", points: 3, basis: [concept("cpt"), concept("icd10")], expectation: "Pairs CPT/ICD-10 correctly.", missed: "81162 (CPT) is what was done. Z80.3 (ICD-10) is why: family history supports the testing." }, "81162 = test, Z80.3 = reason."),
    investigation(
      INVESTIGATION_PROMPT,
      [
        { id: "c-picture", category: "claims_reasoning", points: 4, basis: [fact("doc-auth"), fact("doc-clinic"), fact("doc-eob"), fact("doc-bill")], expectation: "Explains the chain: the approval was for Northstar through 06/30; the draw was rescheduled to 07/08 and sent to out-of-network Helix by the clinic; so out-of-network processing plus the reduction gave $1,500 on the EOB, and $3,700 billed including the $2,200 balance bill.", missed: "Connect the clinic note to the processing. The lab choice and timing, not the test itself, drove every number." },
        knownVsUnknown(4, "Known: approval details, lab change by the clinic, EOB math. To verify: whether Helix is truly out of the Cigna network, whether the claims administrator will review given the authorization and the clinic-initiated lab switch, and whether Helix will reduce the balance. Doesn't promise any of them.", [fact("doc-clinic"), rule("rhus.structure.cigna_ppo_network"), fact("doc-auth")]),
        { id: "c-contacts", category: "problem_solving", points: 3, basis: [concept("care-coordination"), fact("doc-clinic")], expectation: "Contacts: Dr. Kim's office (confirm why Helix was used and whether they will support a review); Helix (hold the bill, confirm network status); the claims administrator (request a review with the authorization and clinic note).", missed: "Three parties each hold a piece of the fix. The member shouldn't have to coordinate it alone." },
      ],
      "AUTH-2026-044518 approved 81162 for Z80.3 at Northstar Genomics (in network), valid 05/01–06/30. The draw was rescheduled to 07/08, and the clinic sent the specimen to Helix Reference Labs (out of network) because of a courier delay. The claim therefore matched neither the approved lab nor the date. Processing: allowed $2,000, all to the $1,000 out-of-network deductible first, then 30% coinsurance on $1,000 ($300), plus a 10% reduction ($200), so member responsibility is $1,500 ($1,300 counts toward the out-of-pocket limit; the $200 doesn't). Helix bills $3,700, including $2,200 above allowed (balance billing). Verify Helix's network status. Ask Dr. Kim's office to explain and support a review of the lab switch. Ask the claims administrator to review with the authorization and clinic note. Ask Helix to hold the bill. No promises on the outcome.",
    ),
    memberReply({
      accuracy: "Explains that the approval was for a specific in-network lab and a date window, that the sample went to a different, out-of-network lab after the window (a clinic decision), and what that did to the costs. Separates what's confirmed from what's being reviewed.",
      accuracyBasis: [fact("doc-auth"), fact("doc-clinic"), fact("doc-eob")],
      promises: "Doesn't promise the bill will be reduced, the claim reprocessed in network, or the $200 removed. Says you'll request a review.",
      next: "Asks the member to hold off paying while you contact the doctor's office, Helix and the claims team, and gives a follow-up date.",
      empathy: "Acknowledges that the member did follow the rules and that the switch wasn't her choice.",
    }),
  ],
  debrief: {
    whatHappened:
      "The test was approved for an in-network lab through 06/30. After a reschedule, the clinic drew blood on 07/08 and sent it to an out-of-network lab. The claim was processed out of network with a no-matching-authorization reduction: $1,500 on the EOB and $3,700 billed.",
    correctReasoning: [
      "Authorizations are specific to provider and dates. The test and diagnosis matched, but the lab and date didn't.",
      "Official rules: out-of-network deductible of $1,000, then 70/30, so $1,000 + $300.",
      "Official rule: the missing-authorization reduction is 10% of $2,000 = $200 (under the $500 cap) and doesn't count toward accumulators.",
      "Official rule: out-of-network providers may balance bill. The $2,200 above allowed is in the bill and never counts toward the out-of-pocket limit.",
      "The clinic's lab switch is the key fact to raise in a review. Outcome unknown, so no promises.",
    ],
    modelMemberResponse:
      "Hi Rachel, you did follow the rules, and I can see why this is upsetting. The approval was for a specific in-network lab, Northstar, through June 30. Your blood was drawn on July 8, and your doctor's office sent it to a different lab, Helix, because of a courier delay. Helix isn't in your plan's network, and the date was after the approval ended. That's why the plan treated it as out-of-network with a reduction, and why Helix is billing more on top. I'm asking Dr. Kim's office to explain the switch, asking the claims team to review it with that context, and asking Helix to pause the bill. Please hold off paying for now. I can't promise the outcome, but I'll update you by next Friday.",
    conceptsToReview: ["authorization-linking", "balance-billing", "out-of-pocket-max"],
  },
};

// =============================================================================
// CASE 20 · Capstone · Full Care Navigator case (no hints)
// =============================================================================
export const case20: SimulationCaseInput = {
  id: "case-20-capstone-acl",
  version: 1,
  portfolioNumber: 20,
  code: "CASE-20",
  title: "Capstone: the knee surgery with four bills",
  summary: "ACL reconstruction with four providers: the facility was paid, the surgeon's claim was denied for an authorization mismatch, the brace was reduced for missing pre-authorization, and the PT office collected copays the plan doesn't have.",
  scenario: "Full case: claim, EOBs, bills, authorization, CPT/HCPCS, ICD-10 laterality, plan benefits and communication. Four providers, three different problems. No hints.",
  recordingPriority: "high",
  difficulty: "capstone",
  status: "ready",
  isSample: false,
  caseTypes: ["complex", "prior_authorization", "coding", "medical_billing", "denial", "eob_investigation"],
  skills: ["complex_investigation", "prior_auth", "cpt", "icd10", "billing_reconciliation", "inconsistency_detection", "provider_communication", "member_communication"],
  knowledge: knowledge(
    ["rhus.benefit.surgery", "rhus.pa.list.j", "rhus.benefit.dme", "rhus.pa.list.h", "rhus.pa.penalty", "rhus.pa.penalty_not_counted", "rhus.benefit.physical_therapy", "rhus.cost.in_network_no_cost_share", "rhus.structure.bywater_tpa", "rhus.pa.provider_usually_requests"],
    ["prior-authorization", "authorization-linking", "cpt", "icd10", "hcpcs", "coding-error", "claim-correction", "provider-statement", "eob", "member-responsibility", "copayment", "contracted-rate"],
  ),
  ticket: {
    channel: "email",
    receivedAt: "2026-10-12T22:47:00Z",
    memberMessage:
      "I'm honestly at my wits' end. I had ACL surgery last month: approved, in-network, everything. Since then I've gotten: a $6,400 bill from my surgeon saying insurance denied it, a $68 bill for my knee brace, and the PT place has charged me $40 at every visit. I thought this plan had no copays and my surgery was approved. Can someone please explain what I actually owe? — Chris",
  },
  member: { name: "Chris Donovan", memberId: "RHU-57702-01", details: "Employee" },
  plan: RHUS_PLAN,
  provider: { name: "Riverside Surgery Center + Petrov Orthopedics + Peak Bracing + Motion PT", type: "Four in-network providers (fictional)", networkStatus: "in_network" },
  codes: [
    cpt("29888", "Arthroscopically aided ACL (anterior cruciate ligament) repair/reconstruction."),
    cpt("97110", "Therapeutic exercise, per 15 minutes."),
    hcpcs("L1832", "Knee brace (orthosis) with adjustable knee joint, prefabricated."),
    icd("S83.511A", "Sprain of anterior cruciate ligament of RIGHT knee, initial encounter."),
    icd("S83.512A", "Sprain of anterior cruciate ligament of LEFT knee, initial encounter."),
  ],
  assumptions: [
    FICTION_ASSUMPTION,
    DOCS_ASSUMPTION,
    "The EOB shows the brace reduction as a 'not covered' amount. That presentation is simulated.",
  ],
  documents: [
    { id: "doc-auth", type: "authorization", title: "Authorization record: surgery", provenance: caseFact(), authNumber: "AUTH-2026-081722", status: "approved", service: "ACL reconstruction, arthroscopic", codes: ["29888"], diagnosisCodes: ["S83.512A"], requestingProvider: "Dr. Nadia Petrov (Orthopedics)", servicingProvider: "Riverside Surgery Center", decisionDate: "2026-08-28", validFrom: "2026-09-01", validTo: "2026-10-31", requirement: { benefitKey: "surgery", required: true } },
    { id: "doc-opnote", type: "note", title: "Operative note (header)", provenance: caseFact(), author: "Dr. Nadia Petrov", date: "2026-09-09", body: "Procedure: arthroscopic ACL reconstruction, RIGHT knee. Pre-/post-op diagnosis: complete tear of the right ACL." },
    { id: "doc-claim-fac", type: "claim", title: "Claim: Riverside Surgery Center", provenance: caseFact(), claimNumber: "CLM-26-0911-5501", status: "processed_paid", receivedDate: "2026-09-11", processedDate: "2026-09-22", billingProvider: "Riverside Surgery Center", networkStatus: "in_network", authorizationNumberOnClaim: "AUTH-2026-081722", lines: [{ dateOfService: "2026-09-09", code: "29888", diagnosisCodes: ["S83.511A"], units: 1, charge: 1450000, lineStatus: "Paid" }] },
    { id: "doc-claim-surg", type: "claim", title: "Claim: Petrov Orthopedics (surgeon)", provenance: caseFact(), claimNumber: "CLM-26-0912-5502", status: "denied", receivedDate: "2026-09-12", processedDate: "2026-09-25", billingProvider: "Petrov Orthopedics", networkStatus: "in_network", authorizationNumberOnClaim: "AUTH-2026-081722", lines: [{ dateOfService: "2026-09-09", code: "29888", diagnosisCodes: ["S83.511A"], units: 1, charge: 640000, lineStatus: "Denied", denialReason: "AD2: Diagnosis on claim does not match the authorization on file" }] },
    { id: "doc-claim-dme", type: "claim", title: "Claim: Peak Bracing", provenance: caseFact(), claimNumber: "CLM-26-0915-5503", status: "processed_paid", receivedDate: "2026-09-15", processedDate: "2026-09-26", billingProvider: "Peak Bracing", networkStatus: "in_network", lines: [{ dateOfService: "2026-09-09", code: "L1832", diagnosisCodes: ["S83.511A"], units: 1, charge: 95000, lineStatus: "Paid with reduction (PA07)" }] },
    { id: "doc-claim-pt", type: "claim", title: "Claim: Motion PT", provenance: caseFact(), claimNumber: "CLM-26-1009-5504", status: "processed_paid", receivedDate: "2026-10-09", processedDate: "2026-10-10", billingProvider: "Motion PT", networkStatus: "in_network", lines: [
      { dateOfService: "2026-09-23", code: "97110", diagnosisCodes: ["S83.511A"], units: 3, charge: 24000, lineStatus: "Paid" },
      { dateOfService: "2026-09-30", code: "97110", diagnosisCodes: ["S83.511A"], units: 3, charge: 24000, lineStatus: "Paid" },
      { dateOfService: "2026-10-07", code: "97110", diagnosisCodes: ["S83.511A"], units: 3, charge: 24000, lineStatus: "Paid" },
    ] },
    { id: "doc-eob-fac", type: "eob", title: "EOB: facility", provenance: caseFact(), claimNumber: "CLM-26-0911-5501", processedDate: "2026-09-22", patient: "Chris Donovan", provider: "Riverside Surgery Center", networkStatus: "in_network", lines: [eobLine({ dateOfService: "2026-09-09", service: "ACL reconstruction (facility)", code: "29888", benefitKey: "surgery", billed: 1450000, allowed: 690000, planPaid: 690000 })] },
    { id: "doc-eob-surg", type: "eob", title: "EOB: surgeon", provenance: caseFact(), claimNumber: "CLM-26-0912-5502", processedDate: "2026-09-25", patient: "Chris Donovan", provider: "Petrov Orthopedics", networkStatus: "in_network", lines: [eobLine({ dateOfService: "2026-09-09", service: "ACL reconstruction (surgeon)", code: "29888", benefitKey: "surgery", billed: 640000, remarkCodes: ["AD2"] })], remarks: [{ code: "AD2", text: "Diagnosis on the claim does not match the authorization on file. Provider: correct the authorization or claim. Member responsibility: $0.00." }] },
    { id: "doc-eob-dme", type: "eob", title: "EOB: knee brace", provenance: caseFact(), claimNumber: "CLM-26-0915-5503", processedDate: "2026-09-26", patient: "Chris Donovan", provider: "Peak Bracing", networkStatus: "in_network", lines: [eobLine({ dateOfService: "2026-09-09", service: "Knee brace (purchase)", code: "L1832", benefitKey: "dme", billed: 95000, allowed: 68000, planPaid: 61200, notCovered: 6800, memberResponsibility: 6800, remarkCodes: ["PA07"] })], remarks: [{ code: "PA07", text: "DME purchase requires pre-authorization; none on file. Covered charges reduced 10% (maximum $500)." }] },
    { id: "doc-eob-pt", type: "eob", title: "EOB: physical therapy", provenance: caseFact(), claimNumber: "CLM-26-1009-5504", processedDate: "2026-10-10", patient: "Chris Donovan", provider: "Motion PT", networkStatus: "in_network", lines: [
      eobLine({ dateOfService: "2026-09-23", service: "Therapeutic exercise ×3", code: "97110", benefitKey: "physical_therapy", billed: 24000, allowed: 13500, planPaid: 13500 }),
      eobLine({ dateOfService: "2026-09-30", service: "Therapeutic exercise ×3", code: "97110", benefitKey: "physical_therapy", billed: 24000, allowed: 13500, planPaid: 13500 }),
      eobLine({ dateOfService: "2026-10-07", service: "Therapeutic exercise ×3", code: "97110", benefitKey: "physical_therapy", billed: 24000, allowed: 13500, planPaid: 13500 }),
    ] },
    { id: "doc-bill-surg", type: "provider_bill", title: "Statement: Petrov Orthopedics", provenance: caseFact(), providerName: "Petrov Orthopedics", statementDate: "2026-10-05", accountNumber: "PO-118204", lines: [{ dateOfService: "2026-09-09", description: "ACL reconstruction", code: "29888", charge: 640000 }], insurancePayments: 0, adjustments: 0, balanceDue: 640000, message: "Insurance denied. Patient responsible." },
    { id: "doc-bill-dme", type: "provider_bill", title: "Statement: Peak Bracing", provenance: caseFact(), providerName: "Peak Bracing", statementDate: "2026-10-02", accountNumber: "PB-3390", lines: [{ dateOfService: "2026-09-09", description: "Knee orthosis, adjustable joint", code: "L1832", charge: 95000 }], insurancePayments: 61200, adjustments: 27000, balanceDue: 6800 },
    { id: "doc-pt-receipts", type: "note", title: "Motion PT front-desk receipts", provenance: caseFact(), author: "Motion PT", date: "2026-10-07", body: "Receipts: $40.00 'visit copay' collected 09/23, 09/30 and 10/07. Total paid by patient: $120.00." },
    planRulesDoc([
      ["Surgery", "rhus.benefit.surgery"],
      ["Pre-authorization list: outpatient surgery", "rhus.pa.list.j"],
      ["Durable medical equipment", "rhus.benefit.dme"],
      ["Pre-authorization list: DME", "rhus.pa.list.h"],
      ["Missing pre-authorization", "rhus.pa.penalty"],
      ["Physical therapy", "rhus.benefit.physical_therapy"],
      ["In-network cost sharing", "rhus.cost.in_network_no_cost_share"],
      ["Claims administration", "rhus.structure.bywater_tpa"],
    ]),
  ],
  tasks: [
    choice("t-surg-denial", "Why was the surgeon's claim denied when the facility's was paid?", [["laterality", "The authorization lists the LEFT-knee diagnosis (S83.512A); the surgeon's claim (and the operative note) say RIGHT knee (S83.511A)"], ["noauth", "The surgeon had no authorization at all"], ["oon", "The surgeon is out of network"], ["cpt", "The surgeon billed a different procedure code"]], ["laterality"], { category: "prior_authorization", points: 4, basis: [fact("doc-auth"), fact("doc-claim-surg"), fact("doc-eob-surg"), concept("authorization-linking")], expectation: "Finds the laterality mismatch between authorization and claim.", missed: "The authorization's diagnosis is S83.512A (left), while the claims say S83.511A (right). The surgeon's claim was checked against the diagnosis and denied (AD2)." }, "Diagnosis laterality mismatch."),
    choice("t-which-wrong", "Which document is most likely wrong?", [["auth", "The authorization request: the operative note and all claims say right knee"], ["claim", "The surgeon's claim"], ["opnote", "The operative note"], ["eob", "The EOB"]], ["auth"], { category: "claims_reasoning", points: 3, basis: [fact("doc-opnote"), fact("doc-claim-fac"), fact("doc-claim-surg"), fact("doc-auth")], expectation: "Uses the clinical record to decide which document is in error.", missed: "When documents conflict, the clinical record (operative note) is the anchor. Every claim and the op note say right, and only the authorization says left." }, "The authorization request."),
    choice("t-fix", "What's the right path for the surgeon's claim?", [["fix-auth", "The surgeon's office contacts the claims administrator to correct the authorization's diagnosis, and the claim is then reprocessed. Verify the exact process; it's a correction, not an appeal, in the first instance."], ["appeal", "The member files an appeal"], ["pay", "The member pays $6,400 and seeks reimbursement"], ["new-auth", "Start a new surgery authorization from scratch"]], ["fix-auth"], { category: "problem_solving", points: 3, basis: [rule("rhus.structure.bywater_tpa"), rule("rhus.pa.provider_usually_requests"), concept("claim-correction")], expectation: "Chooses provider-led correction plus reprocessing.", missed: "The provider requested the authorization and must correct it with the administrator (Bywater). This is a correction of an error, not a dispute." }, "Correct the authorization, then reprocess."),
    amount("t-brace", "Using the official rule, what reduction applies to the brace's $680 of covered charges?", 6800, { category: "plan_knowledge", points: 3, basis: [rule("rhus.pa.penalty"), fact("doc-eob-dme")], expectation: "Calculates 10% × $680 = $68.", missed: "Official rule: covered charges reduced by 10%, up to $500. 10% of $680 = $68." }, "$68.00"),
    choice("t-brace-rule", "Why did the brace need pre-authorization?", [["h", "DME purchases are on the official pre-authorization list (H)"], ["k", "It's diagnostic testing"], ["none", "It didn't: the reduction is an error"], ["surgery", "It was covered by the surgery authorization"]], ["h"], { category: "prior_authorization", points: 3, basis: [rule("rhus.pa.list.h"), rule("rhus.benefit.dme")], expectation: "Identifies list H for DME purchase.", missed: "Official rule: list H covers DME over 30-day rental or purchase. The surgery authorization doesn't extend to equipment from a separate supplier." }, "List H."),
    amount("t-pt-refund", "How much should Motion PT refund the member?", 12000, { category: "eob_interpretation", points: 3, basis: [fact("doc-pt-receipts"), fact("doc-eob-pt"), rule("rhus.cost.in_network_no_cost_share")], expectation: "Totals the $40 collected at each of 3 visits = $120.", missed: "The PT EOB shows $0 member responsibility for all three visits, and the plan has no in-network provider copays. The $120 collected should be refunded." }, "$120.00"),
    amount("t-total", "Across all four EOBs, what is the total member responsibility?", 6800, { category: "eob_interpretation", points: 3, basis: [fact("doc-eob-fac"), fact("doc-eob-surg"), fact("doc-eob-dme"), fact("doc-eob-pt")], expectation: "Totals $0 + $0 + $68 + $0.", missed: "Facility $0, surgeon $0 (denied with provider action required), brace $68, PT $0. Total $68, versus $6,588 in bills and collections." }, "$68.00", { measures: "eob_member_responsibility" }),
    selectAll(
      "t-codes",
      "Select every true statement.",
      [
        ["29888", "29888 is the ACL surgery performed"],
        ["right", "S83.511A is the reason for surgery (right knee)"],
        ["l1832", "L1832 is the brace supplied"],
        ["left", "S83.512A on the authorization refers to the left knee"],
        ["dx-proc", "S83.511A is the procedure code"],
      ],
      ["29888", "right", "l1832", "left"],
      { category: "coding_understanding", points: 5, basis: [concept("cpt"), concept("hcpcs"), concept("icd10"), concept("coding-error")], expectation: "Separates CPT/HCPCS (what) from ICD-10 (why), including laterality.", missed: "29888 (CPT) and L1832 (HCPCS) are what was done or supplied. S83.511A (right) and S83.512A (left) are diagnoses, and the one-character difference is the whole surgeon denial." },
      "All except 'S83.511A is the procedure code'.",
    ),
    investigation(
      INVESTIGATION_PROMPT,
      [
        { id: "c-issues", category: "claims_reasoning", points: 5, basis: [fact("doc-eob-fac"), fact("doc-eob-surg"), fact("doc-eob-dme"), fact("doc-eob-pt"), fact("doc-pt-receipts")], expectation: "Names all four outcomes. Facility: correct, $0. Surgeon: denied for an authorization diagnosis/laterality mismatch, EOB $0, so the $6,400 bill is unsupported. Brace: DME purchase without pre-authorization, 10% reduction, so $68 is owed per the EOB and the bill matches. PT: $0 per the EOB, but $120 collected, so refund due.", missed: "Capstone cases reward completeness. Each provider has a different status, and a member reply that misses one leaves money on the table." },
        knownVsUnknown(3, "Known: the documents above. Unverified: how the administrator will handle the authorization correction and reprocessing, and the timing. Doesn't promise the surgeon claim will pay, and doesn't promise the $68 will be waived.", [fact("doc-auth"), concept("claim-correction")]),
        { id: "c-contacts", category: "problem_solving", points: 3, basis: [concept("care-coordination"), rule("rhus.structure.bywater_tpa"), rule("rhus.pa.provider_usually_requests")], expectation: "Contacts: Petrov Orthopedics (correct the authorization's laterality with the administrator, hold the $6,400); the claims administrator (confirm the fix and reprocessing); Motion PT (refund $120 and stop collecting copays). Peak Bracing's $68 matches the EOB.", missed: "Four providers, three actions, one owner of the overall picture: you." },
      ],
      "Facility (29888, S83.511A, AUTH-2026-081722 linked): paid, $0. Surgeon: same procedure, but the authorization lists S83.512A (LEFT knee) while the op note and all claims say RIGHT (S83.511A), so it was denied for AD2. EOB $0, so the $6,400 bill is unsupported. The authorization request is the document in error. Petrov's office must correct it with the claims administrator so the claim can be reprocessed. Brace (L1832): a DME purchase requires pre-authorization (list H), none was on file, so 10% of $680 = $68 owed per the EOB, and Peak's bill matches. PT (97110 ×3): EOB $0 per visit, and the plan has no in-network provider copays, so Motion PT owes a $120 refund. Total member responsibility per the EOBs: $68.",
    ),
    memberReply({
      accuracy: "Covers all four: the surgery center is paid; the surgeon's bill comes from a left/right mix-up on the approval paperwork and isn't owed per the plan's statement; the brace is $68 because it needed its own approval; and PT should refund $120.",
      accuracyBasis: [fact("doc-eob-surg"), fact("doc-eob-dme"), fact("doc-eob-pt"), fact("doc-pt-receipts")],
      promises: "Doesn't promise the surgeon's claim will be paid, the timing of reprocessing, or that the $68 will be removed.",
      next: "Clear instructions: don't pay the surgeon's $6,400; the $68 brace bill matches the plan's statement; you're getting the PT refund requested. Gives a follow-up date.",
      empathy: "Acknowledges the member's exhaustion after surgery and four confusing bills.",
    }),
  ],
  debrief: {
    whatHappened:
      "The surgery authorization was requested with the wrong knee's diagnosis code (left instead of right). The facility claim was paid, but the surgeon's claim was denied for the mismatch, and the surgeon billed $6,400. The brace was bought without its own pre-authorization (10% reduction, $68). The PT office collected $40 at each of three visits that the plan paid in full.",
    correctReasoning: [
      "Official rule: surgery requires pre-authorization. It existed, but with the wrong laterality (S83.512A vs S83.511A).",
      "The operative note anchors the truth (right knee), so the authorization request is the error. Fix: correct it with the administrator, then reprocess (a correction, not an appeal).",
      "Official rules: DME purchase is on list H, and missing pre-authorization means a 10% reduction. 10% × $680 = $68 (doesn't count toward accumulators).",
      "Official rule: no in-network provider copays, so the PT office owes a $120 refund.",
      "Total owed per the EOBs: $68, not $6,588.",
    ],
    modelMemberResponse:
      "Hi Chris, I'm sorry. Recovering from surgery is hard enough without four confusing bills. Here's the full picture. The surgery center is paid. Your surgeon's $6,400 bill comes from a paperwork mix-up: the approval listed your left knee instead of your right. The plan's statement shows you owe $0 there, so please don't pay it. I'm asking Dr. Petrov's office to correct the approval so the claim can be reprocessed. The $68 brace bill is correct: braces need their own approval, and without one the plan reduces what it pays by 10%. The PT office shouldn't have charged you $40 a visit, because your plan has no copays for in-network therapy, so I'm asking them to refund your $120. I'll update you on the surgeon's claim by next Friday.",
    conceptsToReview: ["authorization-linking", "coding-error", "claim-correction", "copayment"],
  },
};
