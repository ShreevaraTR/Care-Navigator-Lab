import type { SimulationCaseInput } from "@/domain/case";
import { caseFact } from "@/domain/provenance";
import {
  DOCS_ASSUMPTION, FICTION_ASSUMPTION, INVESTIGATION_PROMPT, RHUS_PLAN, amount, choice, concept, cpt, eobLine, fact, icd,
  investigation, knowledge, knownVsUnknown, memberReply, planRulesDoc, rule, selectAll,
} from "./helpers";

// =============================================================================
// CASE 13 · Advanced · Out-of-network specialist: deductible, coinsurance, balance bill
// =============================================================================
export const case13: SimulationCaseInput = {
  id: "case-13-oon-balance-bill",
  version: 1,
  portfolioNumber: 13,
  code: "CASE-13",
  title: "$330 on the EOB, $580 on the bill",
  summary: "An out-of-network dermatologist bills more than the EOB's member responsibility. Is that an error, or legitimate balance billing?",
  scenario: "Out-of-network visit: remaining deductible, 70/30 split, and a $250 balance bill that's consistent with the plan rules. The member must learn the difference and which amounts count toward the out-of-pocket limit.",
  recordingPriority: "high",
  difficulty: "advanced",
  status: "ready",
  isSample: false,
  caseTypes: ["eob_investigation", "medical_billing"],
  skills: ["network_status", "balance_billing", "allowed_amount", "member_responsibility", "plain_english", "cost_sharing"],
  knowledge: knowledge(
    ["rhus.structure.cigna_ppo_network", "rhus.structure.out_of_network_allowed", "rhus.benefit.specialist_visit", "rhus.cost.deductible.out_of_network", "rhus.cost.coinsurance.out_of_network", "rhus.cost.balance_billing", "rhus.cost.oop.out_of_network", "rhus.cost.oop.never_counts"],
    ["network", "deductible", "coinsurance", "allowed-amount", "balance-billing", "out-of-pocket-max", "member-responsibility", "eob", "provider-statement", "icd10"],
  ),
  ticket: {
    channel: "chat",
    receivedAt: "2026-09-03T14:46:00Z",
    memberMessage:
      "My dermatologist's bill is $580 but my EOB says I'm only responsible for $330. Which one do I pay?? Is the doctor even allowed to charge me more than the EOB says? I know she's out of network, but still.",
  },
  member: { name: "Olivia Park", memberId: "RHU-71450-01", details: "Employee" },
  plan: RHUS_PLAN,
  provider: { name: "SkinFirst Dermatology (Dr. Sunil Mehta)", type: "Dermatology practice (fictional)", networkStatus: "out_of_network" },
  codes: [cpt("99204", "Office visit, new patient, moderate complexity."), icd("L57.0", "Actinic keratosis (sun-damage skin lesions).")],
  assumptions: [FICTION_ASSUMPTION, DOCS_ASSUMPTION, "No other out-of-network claims are in process for this member."],
  documents: [
    { id: "doc-accum", type: "note", title: "Accumulator summary (before this claim)", provenance: caseFact(), author: "Claims system", date: "2026-08-12", body: "Out-of-network deductible: $700.00 of $1,000.00 met. Out-of-network out-of-pocket: $700.00 of $2,000.00. In-network accumulators tracked separately." },
    {
      id: "doc-claim",
      type: "claim",
      title: "Claim record",
      provenance: caseFact(),
      claimNumber: "CLM-26-0815-2273",
      status: "processed_paid",
      receivedDate: "2026-08-15",
      processedDate: "2026-08-27",
      billingProvider: "SkinFirst Dermatology",
      networkStatus: "out_of_network",
      lines: [{ dateOfService: "2026-08-12", code: "99204", diagnosisCodes: ["L57.0"], units: 1, charge: 65000, lineStatus: "Paid, out of network" }],
    },
    {
      id: "doc-eob",
      type: "eob",
      title: "Explanation of Benefits",
      provenance: caseFact(),
      claimNumber: "CLM-26-0815-2273",
      processedDate: "2026-08-27",
      patient: "Olivia Park",
      provider: "SkinFirst Dermatology",
      networkStatus: "out_of_network",
      lines: [eobLine({ dateOfService: "2026-08-12", service: "New patient visit", code: "99204", benefitKey: "specialist_visit", billed: 65000, allowed: 40000, deductible: 30000, coinsurance: 3000, planPaid: 7000, memberResponsibility: 33000, remarkCodes: ["OON1"] })],
      remarks: [{ code: "OON1", text: "Out-of-network benefits applied. The provider may bill you for charges above the allowed amount." }],
    },
    {
      id: "doc-bill",
      type: "provider_bill",
      title: "Provider statement",
      provenance: caseFact(),
      providerName: "SkinFirst Dermatology",
      statementDate: "2026-08-31",
      accountNumber: "SFD-4410",
      lines: [{ dateOfService: "2026-08-12", description: "New patient visit", code: "99204", charge: 65000 }],
      insurancePayments: 7000,
      adjustments: 0,
      balanceDue: 58000,
    },
    planRulesDoc([
      ["Specialist visit", "rhus.benefit.specialist_visit"],
      ["Out-of-network deductible", "rhus.cost.deductible.out_of_network"],
      ["Out-of-network coinsurance", "rhus.cost.coinsurance.out_of_network"],
      ["Balance billing", "rhus.cost.balance_billing"],
      ["Out-of-network out-of-pocket limit", "rhus.cost.oop.out_of_network"],
      ["Charges that never count", "rhus.cost.oop.never_counts"],
    ]),
  ],
  tasks: [
    amount("t-ded-left", "How much of the out-of-network deductible was left before this claim?", 30000, { category: "plan_knowledge", points: 3, basis: [fact("doc-accum"), rule("rhus.cost.deductible.out_of_network")], expectation: "Calculates $1,000 − $700 = $300.", missed: "Official rule: the out-of-network deductible is $1,000. $700 was already met, leaving $300." }, "$300.00"),
    amount("t-plan-paid", "Calculate the plan's payment: 70% of the allowed amount left after the deductible.", 7000, { category: "plan_knowledge", points: 4, basis: [rule("rhus.cost.coinsurance.out_of_network"), fact("doc-eob")], expectation: "Calculates ($400 − $300) × 70% = $70.", missed: "Allowed $400 − $300 deductible = $100. The plan pays 70% of that ($70), and the member's out-of-network coinsurance is 30% ($30)." }, "$70.00"),
    amount("t-owed", "According to the EOB, what is the member responsibility?", 33000, { category: "eob_interpretation", points: 3, basis: [fact("doc-eob")], expectation: "Reads $330 = $300 deductible + $30 coinsurance.", missed: "Member responsibility = deductible $300 + coinsurance $30 = $330." }, "$330.00", { measures: "eob_member_responsibility" }),
    amount("t-balance", "How much of the $580 balance is above the plan's allowed amount?", 25000, { category: "eob_interpretation", points: 3, basis: [fact("doc-bill"), fact("doc-eob")], expectation: "Calculates billed $650 − allowed $400 = $250.", missed: "$580 = $330 (EOB member responsibility) + $250 (billed − allowed)." }, "$250.00"),
    choice("t-legit", "Is the extra $250 on the bill an error?", [["legit", "Not necessarily: an out-of-network provider may bill above the plan's allowed amount (balance billing). That's consistent with the plan rules, though worth confirming there's no agreement that limits it."], ["error", "Yes: a bill must always equal the EOB"], ["eob-wrong", "Yes: the EOB should have shown $580"], ["plan-pays", "No: the plan will pay the $250 later"]], ["legit"], { category: "plan_knowledge", points: 4, basis: [rule("rhus.cost.balance_billing"), concept("balance-billing")], expectation: "Recognizes legitimate out-of-network balance billing instead of assuming an error.", missed: "Official rule: if an out-of-network provider charges more than what the plan covers, the member may be billed the difference. Unlike the in-network cases, here the bill can legitimately exceed the EOB." }, "Not necessarily an error. It's balance billing."),
    selectAll("t-oop", "Which amounts count toward the member's out-of-network out-of-pocket limit?", [["ded", "The $300 deductible"], ["coins", "The $30 coinsurance"], ["bb", "The $250 balance-billed amount"], ["plan", "The plan's $70 payment"]], ["ded", "coins"], { category: "plan_knowledge", points: 3, basis: [rule("rhus.cost.oop.never_counts"), rule("rhus.cost.oop.out_of_network")], expectation: "Includes cost sharing and excludes the balance bill.", missed: "Official rule: out-of-network charges above what the plan agrees to pay never count toward the limit. Deductible and coinsurance do." }, "The $300 and the $30."),
    choice("t-dx", "Which code tells you why the member saw the dermatologist?", [["l570", "L57.0"], ["99204", "99204"], ["oon1", "OON1"], ["sfd", "SFD-4410"]], ["l570"], { category: "coding_understanding", points: 3, basis: [concept("icd10")], expectation: "Identifies the diagnosis code.", missed: "L57.0 (actinic keratosis) is the diagnosis. 99204 is the visit (CPT)." }, "L57.0."),
    investigation(
      INVESTIGATION_PROMPT,
      [
        { id: "c-math", category: "claims_reasoning", points: 4, basis: [fact("doc-eob"), fact("doc-accum"), rule("rhus.cost.deductible.out_of_network"), rule("rhus.cost.coinsurance.out_of_network")], expectation: "Verifies the EOB math: $300 remaining deductible, then 70/30 on $100, so plan $70 and member $330.", missed: "Re-check the administrator's arithmetic against the plan rules before explaining it. Here it's right." },
        { id: "c-legit", category: "plan_knowledge", points: 3, basis: [rule("rhus.cost.balance_billing"), rule("rhus.cost.oop.never_counts")], expectation: "Explains that the extra $250 is out-of-network balance billing, which the plan rules allow for, and that it doesn't count toward the out-of-pocket limit.", missed: "The difference between this case and the in-network ones is the network. Out of network, the bill can legitimately exceed the EOB." },
        knownVsUnknown(3, "Notes what can still be checked (whether the practice offers any reduction or has an agreement limiting the bill) and recommends in-network options for future visits via the Cigna directory, without promising a reduction.", [concept("care-coordination"), rule("rhus.structure.cigna_ppo_network"), rule("rhus.structure.out_of_network_allowed")]),
      ],
      "Out of network. Before this claim, $700 of the $1,000 out-of-network deductible was met. Allowed $400: $300 to the deductible, then 70/30 on the remaining $100, so the plan pays $70 and coinsurance is $30. Member responsibility is $330. The statement's $580 adds $250 above the allowed amount (billed $650 − allowed $400). That's balance billing, which the plan rules allow for out-of-network providers. The $330 counts toward the out-of-network out-of-pocket limit; the $250 doesn't. Next: the member may ask SkinFirst whether they'll reduce the balance (no promise), and use in-network dermatologists in the Cigna PPO network in future, where the visit would cost $0.",
    ),
    memberReply({
      accuracy: "Explains that $330 is the member's share under the plan (the rest of the deductible plus 30%), and that because the doctor is out of network, she's allowed to bill the extra $250 above the plan's approved price. Both figures are explained.",
      accuracyBasis: [fact("doc-eob"), fact("doc-bill"), rule("rhus.cost.balance_billing")],
      promises: "Doesn't promise the provider will reduce the bill or that the plan will pay the $250.",
      next: "Explains the member's options (pay, or ask the practice about a reduction) and offers to help find an in-network dermatologist for future visits.",
      nextBasis: [rule("rhus.structure.cigna_ppo_network")],
      empathy: "Acknowledges that two different numbers are confusing, without judging the choice of an out-of-network doctor.",
    }),
  ],
  debrief: {
    whatHappened:
      "An out-of-network dermatology visit was processed correctly under the official out-of-network rules: $300 remaining deductible, then 70/30 on $100, so the member owes $330 per the EOB. The provider also billed the $250 above the allowed amount, which is out-of-network balance billing.",
    correctReasoning: [
      "Official rule: out-of-network deductible of $1,000. $700 was already met, leaving $300.",
      "Official rule: 70% after deductible, so the plan pays $70 and the member's coinsurance is $30. Member responsibility $330.",
      "Official rule: out-of-network providers may balance bill above the allowed rate. The $250 is consistent with that.",
      "Official rule: balance-billed amounts never count toward the out-of-pocket limit. Deductible and coinsurance do.",
      "Unlike in network, here the bill can legitimately exceed the EOB. The navigator verifies rather than assuming an error.",
    ],
    modelMemberResponse:
      "Hi Olivia, great question, and the two numbers are confusing. The $330 is your share under the plan: the last $300 of your out-of-network deductible, plus 30% of the rest. Because Dr. Mehta is out of network, she isn't bound by the plan's approved price, so she's allowed to bill you the extra $250 on top. That's why her bill says $580. The $330 counts toward your yearly out-of-pocket limit, but the $250 doesn't. You can ask her office whether they'd reduce the balance. Some practices do, though there's no guarantee. If you'd like, I can help you find in-network dermatologists for future visits, where a visit like this would cost you $0.",
    conceptsToReview: ["balance-billing", "deductible", "coinsurance", "out-of-pocket-max"],
  },
};

// =============================================================================
// CASE 14 · Advanced · Out-of-network anesthesiologist at an in-network surgery
// =============================================================================
export const case14: SimulationCaseInput = {
  id: "case-14-oon-anesthesia",
  version: 1,
  portfolioNumber: 14,
  code: "CASE-14",
  title: "The anesthesia bill nobody warned me about",
  summary: "An authorized hernia repair at an in-network facility with an in-network surgeon, but the anesthesiologist group was out of network and bills $1,800.",
  scenario: "Three claims: facility and surgeon paid $0, anesthesia processed out of network (EOB $720, bill $1,800). Federal surprise-billing protections may apply (general concept), so verify before telling the member anything is owed.",
  recordingPriority: "high",
  difficulty: "advanced",
  status: "ready",
  isSample: false,
  caseTypes: ["claims_investigation", "coordination", "eob_investigation"],
  skills: ["network_status", "balance_billing", "member_responsibility", "prior_auth", "provider_communication", "inconsistency_detection"],
  knowledge: knowledge(
    ["rhus.benefit.surgery", "rhus.pa.list.j", "rhus.cost.in_network_no_cost_share", "rhus.cost.deductible.out_of_network", "rhus.cost.balance_billing", "rhus.structure.bywater_tpa", "rhus.structure.cigna_ppo_network"],
    ["surprise-billing", "network", "balance-billing", "deductible", "allowed-amount", "prior-authorization", "authorization-linking", "eob", "provider-statement", "cpt", "icd10"],
  ),
  ticket: {
    channel: "email",
    receivedAt: "2026-08-25T19:02:00Z",
    memberMessage:
      "I did everything right for my hernia surgery: in-network surgery center, in-network surgeon, pre-approval. Now I have an $1,800 bill from an anesthesia group I've never heard of, and the EOB says out-of-network. I never chose an anesthesiologist! Do I really owe this? — Ben",
  },
  member: { name: "Ben Turner", memberId: "RHU-83306-01", details: "Employee. No other out-of-network claims this year." },
  plan: RHUS_PLAN,
  provider: { name: "Valley Surgical Center", type: "Ambulatory surgery center (fictional)", networkStatus: "in_network" },
  codes: [
    cpt("49505", "Open repair of an inguinal hernia (patient 5 or older), reducible."),
    cpt("00830", "Anesthesia for hernia repair in the lower abdomen."),
    icd("K40.90", "Unilateral inguinal hernia, without obstruction or gangrene, not specified as recurrent."),
  ],
  assumptions: [FICTION_ASSUMPTION, DOCS_ASSUMPTION, "The surgery was scheduled (non-emergency). The member did not choose or sign anything about the anesthesia group in advance."],
  documents: [
    { id: "doc-auth", type: "authorization", title: "Authorization record", provenance: caseFact(), authNumber: "AUTH-2026-063390", status: "approved", service: "Inguinal hernia repair", codes: ["49505"], diagnosisCodes: ["K40.90"], requestingProvider: "Dr. Elena Ruiz (General surgery)", servicingProvider: "Valley Surgical Center", decisionDate: "2026-07-08", validFrom: "2026-07-10", validTo: "2026-09-30", requirement: { benefitKey: "surgery", required: true } },
    { id: "doc-claim-facility", type: "claim", title: "Claim: Valley Surgical Center (facility)", provenance: caseFact(), claimNumber: "CLM-26-0723-1001", status: "processed_paid", receivedDate: "2026-07-23", processedDate: "2026-08-04", billingProvider: "Valley Surgical Center", networkStatus: "in_network", authorizationNumberOnClaim: "AUTH-2026-063390", lines: [{ dateOfService: "2026-07-21", code: "49505", diagnosisCodes: ["K40.90"], units: 1, charge: 820000, lineStatus: "Paid" }] },
    { id: "doc-claim-surgeon", type: "claim", title: "Claim: Dr. Ruiz (surgeon)", provenance: caseFact(), claimNumber: "CLM-26-0724-1002", status: "processed_paid", receivedDate: "2026-07-24", processedDate: "2026-08-05", billingProvider: "Ruiz Surgical Associates", networkStatus: "in_network", authorizationNumberOnClaim: "AUTH-2026-063390", lines: [{ dateOfService: "2026-07-21", code: "49505", diagnosisCodes: ["K40.90"], units: 1, charge: 210000, lineStatus: "Paid" }] },
    { id: "doc-claim-anes", type: "claim", title: "Claim: Summit Anesthesia Partners", provenance: caseFact(), claimNumber: "CLM-26-0729-1003", status: "processed_paid", receivedDate: "2026-07-29", processedDate: "2026-08-11", billingProvider: "Summit Anesthesia Partners", networkStatus: "out_of_network", lines: [{ dateOfService: "2026-07-21", code: "00830", diagnosisCodes: ["K40.90"], units: 1, charge: 180000, lineStatus: "Processed out of network" }] },
    { id: "doc-eob-facility", type: "eob", title: "EOB: facility", provenance: caseFact(), claimNumber: "CLM-26-0723-1001", processedDate: "2026-08-04", patient: "Ben Turner", provider: "Valley Surgical Center", networkStatus: "in_network", lines: [eobLine({ dateOfService: "2026-07-21", service: "Hernia repair (facility)", code: "49505", benefitKey: "surgery", billed: 820000, allowed: 380000, planPaid: 380000 })] },
    { id: "doc-eob-surgeon", type: "eob", title: "EOB: surgeon", provenance: caseFact(), claimNumber: "CLM-26-0724-1002", processedDate: "2026-08-05", patient: "Ben Turner", provider: "Ruiz Surgical Associates", networkStatus: "in_network", lines: [eobLine({ dateOfService: "2026-07-21", service: "Hernia repair (surgeon)", code: "49505", benefitKey: "surgery", billed: 210000, allowed: 95000, planPaid: 95000 })] },
    { id: "doc-eob-anes", type: "eob", title: "EOB: anesthesia", provenance: caseFact(), claimNumber: "CLM-26-0729-1003", processedDate: "2026-08-11", patient: "Ben Turner", provider: "Summit Anesthesia Partners", networkStatus: "out_of_network", lines: [eobLine({ dateOfService: "2026-07-21", service: "Anesthesia", code: "00830", benefitKey: "surgery", billed: 180000, allowed: 72000, deductible: 72000, memberResponsibility: 72000, remarkCodes: ["OON1"] })], remarks: [{ code: "OON1", text: "Out-of-network benefits applied. The provider may bill you for charges above the allowed amount." }] },
    { id: "doc-bill-anes", type: "provider_bill", title: "Provider statement: Summit Anesthesia Partners", provenance: caseFact(), providerName: "Summit Anesthesia Partners", statementDate: "2026-08-20", accountNumber: "SAP-55017", lines: [{ dateOfService: "2026-07-21", description: "Anesthesia services", code: "00830", charge: 180000 }], insurancePayments: 0, adjustments: 0, balanceDue: 180000 },
    planRulesDoc([
      ["Surgery", "rhus.benefit.surgery"],
      ["Pre-authorization list", "rhus.pa.list.j"],
      ["In-network cost sharing", "rhus.cost.in_network_no_cost_share"],
      ["Out-of-network deductible", "rhus.cost.deductible.out_of_network"],
      ["Balance billing", "rhus.cost.balance_billing"],
      ["Claims administration", "rhus.structure.bywater_tpa"],
    ]),
  ],
  tasks: [
    choice("t-auth", "Was the surgery's pre-authorization handled correctly?", [["yes", "Yes: surgery requires pre-authorization, and it was approved, valid on 07/21 and linked on the facility and surgeon claims"], ["no", "No: it's missing"], ["anes", "No: the anesthesia group needed its own separate authorization"], ["notreq", "It wasn't required"]], ["yes"], { category: "prior_authorization", points: 3, basis: [rule("rhus.benefit.surgery"), rule("rhus.pa.list.j"), fact("doc-auth"), fact("doc-claim-facility")], expectation: "Rules out authorization as the issue.", missed: "Official rules: surgery requires pre-authorization (benefit row; list J). AUTH-2026-063390 was approved and linked. The problem is network status, not authorization. The sources say nothing about a separate anesthesia authorization, so don't invent one." }, "Yes."),
    choice("t-which", "Which provider was out of network?", [["anes", "Summit Anesthesia Partners only"], ["facility", "Valley Surgical Center"], ["surgeon", "Dr. Ruiz"], ["all", "All three"]], ["anes"], { category: "claims_reasoning", points: 3, basis: [fact("doc-claim-anes"), fact("doc-eob-anes"), fact("doc-eob-facility"), fact("doc-eob-surgeon")], expectation: "Separates the three claims by network status.", missed: "Facility and surgeon were in network and paid at $0. Only the anesthesia claim was processed out of network." }, "The anesthesia group."),
    amount("t-owed", "Across all three EOBs, what is the total member responsibility?", 72000, { category: "eob_interpretation", points: 3, basis: [fact("doc-eob-facility"), fact("doc-eob-surgeon"), fact("doc-eob-anes")], expectation: "Totals $0 + $0 + $720.", missed: "Facility $0 + surgeon $0 + anesthesia $720 (applied to the out-of-network deductible) = $720." }, "$720.00", { measures: "eob_member_responsibility" }),
    amount("t-gap", "How much of Summit's $1,800 bill is above the allowed amount?", 108000, { category: "eob_interpretation", points: 3, basis: [fact("doc-bill-anes"), fact("doc-eob-anes")], expectation: "Calculates $1,800 − $720 = $1,080.", missed: "Billed $1,800 − allowed $720 = $1,080 of potential balance billing." }, "$1,080.00"),
    choice("t-plan-only", "Applying only the plan's out-of-network rules, how was the anesthesia line processed?", [["ded", "The $720 allowed amount went to the $1,000 out-of-network deductible, the plan paid $0, and the provider may balance bill the rest"], ["full", "Paid at 100% because the facility was in network"], ["denied", "Denied for missing authorization"], ["coins", "Paid at 70% with no deductible"]], ["ded"], { category: "plan_knowledge", points: 3, basis: [rule("rhus.cost.deductible.out_of_network"), rule("rhus.cost.balance_billing"), fact("doc-eob-anes")], expectation: "Explains the out-of-network processing with official rules.", missed: "With no earlier out-of-network claims, the whole $720 allowed amount went to the $1,000 out-of-network deductible, so the plan paid $0. Out-of-network providers may balance bill." }, "Applied to the out-of-network deductible."),
    choice("t-protections", "Before telling the member what they owe, what should you check?", [["nsa", "Whether federal surprise-billing protections apply: an out-of-network anesthesiologist at an in-network facility for scheduled care is a situation they often cover. Verify with the claims administrator."], ["none", "Nothing: the EOB is final, so the member owes $1,800"], ["plan-rule", "The plan rule that guarantees 100% for anesthesia"], ["appeal", "Whether the member wants to file an appeal first"]], ["nsa"], { category: "problem_solving", points: 4, basis: [concept("surprise-billing"), rule("rhus.structure.bywater_tpa")], expectation: "Raises the federal protections as a general concept to verify, not as a plan rule.", missed: "The plan sources don't address this, but federal law (a general concept, not a Remote Health USA rule) commonly protects patients from out-of-network ancillary bills at in-network facilities. Don't present it as a guarantee: verify how the administrator applies it." }, "Check federal surprise-billing protections with the administrator."),
    selectAll("t-codes", "Select every true statement.", [["49505", "49505 is the hernia repair surgery"], ["00830", "00830 is the anesthesia service"], ["k4090", "K40.90 explains why both services were done"], ["k-anes", "K40.90 is the anesthesia code"]], ["49505", "00830", "k4090"], { category: "coding_understanding", points: 4, basis: [concept("cpt"), concept("icd10")], expectation: "Recognizes two CPT services for one diagnosis.", missed: "One reason (K40.90, inguinal hernia) supports two services: the surgery (49505) and the anesthesia (00830). Separate providers bill separate claims for the same event." }, "49505, 00830 and K40.90 (as the reason)."),
    investigation(
      INVESTIGATION_PROMPT,
      [
        { id: "c-picture", category: "claims_reasoning", points: 4, basis: [fact("doc-eob-facility"), fact("doc-eob-surgeon"), fact("doc-eob-anes"), fact("doc-bill-anes")], expectation: "Lays out the three claims: facility and surgeon in network, authorized, $0. Anesthesia out of network: $720 to the deductible per the EOB, and $1,800 billed including $1,080 above allowed.", missed: "In multi-provider events, build the full picture first, claim by claim." },
        knownVsUnknown(3, "Separates the known (processing above; the member didn't choose the anesthesiologist) from the unknown (whether federal protections apply here and how the administrator will treat the claim). Doesn't tell the member they owe $720 or $1,800, or that they owe $0.", [concept("surprise-billing"), fact("doc-eob-anes")]),
        { id: "c-contacts", category: "problem_solving", points: 3, basis: [rule("rhus.structure.bywater_tpa"), concept("care-coordination")], expectation: "Contacts: the claims administrator (Bywater), to review the anesthesia claim's out-of-network processing in light of surprise-billing protections; Summit Anesthesia, to hold collection while it's reviewed.", missed: "The administrator decides how the claim is processed. The provider must pause billing meanwhile." },
      ],
      "Authorized hernia repair (49505, K40.90; AUTH-2026-063390 linked). The facility and surgeon were in network and paid in full ($0). Summit Anesthesia (00830) was out of network: allowed $720, all to the out-of-network deductible, plan paid $0. Summit bills $1,800, including $1,080 above the allowed amount. Under the plan's out-of-network rules alone, that's how it would process. But this is scheduled care at an in-network facility by an out-of-network anesthesiologist the member didn't choose, which is the situation federal surprise-billing protections (a general concept, not a plan rule) often address. Ask the claims administrator to review the anesthesia claim on that basis, and ask Summit to hold the bill. Don't tell the member what they owe until the review is done.",
    ),
    memberReply({
      accuracy: "Says the surgery itself was handled correctly (approved, and both in-network bills paid in full), and that the anesthesia group was out of network and the claim was processed that way. Notes that federal surprise-billing rules may protect the member in this situation, which is being checked.",
      accuracyBasis: [fact("doc-eob-facility"), fact("doc-eob-anes"), concept("surprise-billing")],
      promises: "Doesn't promise the protections apply or that the member will owe $0. Says it's under review.",
      next: "Asks the member not to pay the $1,800 while the review happens. Says you've asked the anesthesia group to pause billing, and when you'll update them.",
      empathy: "Acknowledges that the member did everything right and had no say in the anesthesiologist.",
    }),
  ],
  debrief: {
    whatHappened:
      "The hernia repair was authorized, and the in-network facility and surgeon were paid in full. The anesthesia group was out of network: its claim was processed at the out-of-network level ($720 to the deductible), and it billed the member $1,800.",
    correctReasoning: [
      "Official rules: surgery requires pre-authorization. It was obtained and linked, so it's not the issue.",
      "Three claims, three network checks: only anesthesia was out of network.",
      "Under the plan's out-of-network rules alone: $720 to the $1,000 deductible, plus possible balance billing of $1,080.",
      "General concept: federal surprise-billing protections often cover out-of-network ancillary providers at in-network facilities. Verify with the administrator; it's not a plan guarantee.",
      "Don't state an amount owed until the review is done. Ask the provider to pause billing.",
    ],
    modelMemberResponse:
      "Hi Ben, you really did do everything right, and I'm sorry this landed on you. Your surgery was approved, and the surgery center and your surgeon were both paid in full. The anesthesia group isn't in your plan's network, so their claim was processed as out-of-network. But federal surprise-billing rules often protect patients when an out-of-network doctor treats them at an in-network facility for planned care, especially when you didn't choose that doctor. I'm asking the claims team to review the anesthesia claim on that basis, and I'm contacting the anesthesia group to pause their bill. Please don't pay the $1,800 for now. I can't promise the result yet, but I'll update you by next Wednesday.",
    conceptsToReview: ["surprise-billing", "balance-billing", "network"],
  },
};
