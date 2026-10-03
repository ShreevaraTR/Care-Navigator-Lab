import type { SimulationCaseInput } from "@/domain/case";
import { caseFact, generalConcept, planRule } from "@/domain/provenance";

/**
 * SAMPLE CASE: set on Remote Health USA, checked against the plan knowledge base.
 *
 * Plan facts are cited rules (rhus.*). Everything about this member, provider, claim,
 * authorization and amounts is fictional (case facts). Remark code PA01 and the EOB layout are invented.
 *
 * v2 (2026-10-03): corrected plan logic. The v1 fictional plan applied 20% coinsurance after
 * reprocessing, which is wrong for an in-network MRI under the current benefits overview
 * (in-network diagnostic testing 100%, $0 in-network deductible, no coinsurance or provider copay).
 */

const R = {
  mri: "rhus.benefit.diagnostic_mri",
  paListK: "rhus.pa.list.k",
  noCostShare: "rhus.cost.in_network_no_cost_share",
  inDeductible: "rhus.cost.deductible.in_network",
  providerRequests: "rhus.pa.provider_usually_requests",
  memberConfirms: "rhus.pa.member_must_confirm",
  penalty: "rhus.pa.penalty",
  bywater: "rhus.structure.bywater_tpa",
  selfFunded: "rhus.structure.self_funded_erisa",
  spd: "rhus.structure.spd_governs",
} as const;

export const sample01MriBill: SimulationCaseInput = {
  id: "sample-01-mri-bill",
  version: 2,
  portfolioNumber: null,
  code: "SAMPLE-01",
  title: "The $2,400 MRI bill",
  summary:
    "A member is billed $2,400 for a pre-authorized, in-network MRI. Reconcile the claim, EOB, provider bill and authorization record against the Remote Health USA rules, then reply to the member.",
  difficulty: "intermediate",
  status: "ready",
  isSample: true,
  caseTypes: ["eob_investigation", "claims_investigation", "prior_authorization", "medical_billing", "coding", "denial"],
  skills: [
    "eob_reading",
    "claim_status",
    "billing_reconciliation",
    "prior_auth",
    "cpt",
    "icd10",
    "denials",
    "member_responsibility",
    "cost_sharing",
    "provider_communication",
    "member_communication",
  ],
  knowledge: {
    planRules: Object.values(R),
    generalConcepts: [
      "claim-statuses",
      "remark-codes",
      "eob",
      "provider-statement",
      "member-responsibility",
      "prior-authorization",
      "authorization-linking",
      "cpt",
      "icd10",
      "claim-correction",
      "appeal",
      "care-coordination",
      "member-communication",
    ],
    acknowledgedUnclearRules: [],
  },
  ticket: {
    channel: "chat",
    receivedAt: "2026-09-24T15:12:00Z",
    memberMessage:
      "Hi, I received a $2,400 bill for my MRI. I thought my insurance covered MRIs. My doctor's office even told me it was approved. Can you help me understand what happened? The bill says I have to pay by October 20.",
  },
  member: { name: "Jordan Reyes", memberId: "SIM-48210-01", details: "Primary member (fictional)" },
  plan: {
    planId: "rhus",
    name: "Remote Health USA",
    provenance: planRule(R.selfFunded, "Plan rules cited from the benefits overview dated 2025-12-16 and the public plan page."),
  },
  provider: { name: "Lakeside Imaging Center", type: "Freestanding imaging facility (fictional)", networkStatus: "in_network" },
  codes: [
    {
      system: "CPT",
      code: "72148",
      role: "service",
      plainLanguage: "MRI of the lower (lumbar) spine, done without contrast dye.",
      provenance: generalConcept("Plain-language summary written for this lab; not the AMA descriptor."),
    },
    {
      system: "ICD-10-CM",
      code: "M54.16",
      role: "diagnosis",
      plainLanguage: "Lumbar radiculopathy: nerve-root pain radiating from the lower back.",
      provenance: generalConcept("ICD-10-CM is published by CDC/NCHS."),
    },
  ],
  assumptions: [
    "The member, Lakeside Imaging Center, Dr. Patel, and all IDs, dates and amounts are fictional. Lakeside's in-network (Cigna PPO) status is a simulated case fact.",
    "You can see the member's claim, EOB, authorization and contact history. Reprocessing is done by the claims administrator: you request it, you don't perform it.",
    "Remark code PA01 and this EOB layout are invented for the simulation. Real administrator EOBs and codes look different.",
    "The EOB's $0 member responsibility is a simulated fact. The official sources don't describe how a missing-authorization denial appears on a real EOB.",
  ],
  documents: [
    {
      id: "doc-claim",
      type: "claim",
      title: "Claim record",
      provenance: caseFact(),
      claimNumber: "CLM-26-0918-4471",
      status: "denied",
      receivedDate: "2026-08-21",
      processedDate: "2026-09-02",
      billingProvider: "Lakeside Imaging Center",
      renderingProvider: "Lakeside Imaging Center",
      networkStatus: "in_network",
      authorizationNumberOnClaim: undefined,
      lines: [
        {
          dateOfService: "2026-08-14",
          code: "72148",
          diagnosisCodes: ["M54.16"],
          units: 1,
          charge: 240000,
          lineStatus: "Denied",
          denialReason: "PA01: Prior authorization required; none on file for this claim",
        },
      ],
    },
    {
      id: "doc-eob",
      type: "eob",
      title: "Explanation of Benefits",
      provenance: caseFact(),
      claimNumber: "CLM-26-0918-4471",
      processedDate: "2026-09-02",
      patient: "Jordan Reyes",
      provider: "Lakeside Imaging Center",
      networkStatus: "in_network",
      lines: [
        {
          dateOfService: "2026-08-14",
          service: "MRI lumbar spine",
          code: "72148",
          benefitKey: "diagnostic_mri",
          billed: 240000,
          allowed: 0,
          planPaid: 0,
          deductible: 0,
          copay: 0,
          coinsurance: 0,
          notCovered: 0,
          memberResponsibility: 0,
          remarkCodes: ["PA01"],
        },
      ],
      remarks: [
        {
          code: "PA01",
          text: "Prior authorization required; no authorization was found for this claim. Claim denied. Member responsibility for this line: $0.00.",
        },
      ],
    },
    {
      id: "doc-bill",
      type: "provider_bill",
      title: "Provider statement",
      provenance: caseFact(),
      providerName: "Lakeside Imaging Center",
      statementDate: "2026-09-20",
      accountNumber: "LIC-559302",
      lines: [{ dateOfService: "2026-08-14", description: "MRI lumbar spine w/o contrast", code: "72148", charge: 240000 }],
      insurancePayments: 0,
      adjustments: 0,
      balanceDue: 240000,
      dueDate: "2026-10-20",
      message: "Your insurance has denied this claim. The balance is now your responsibility.",
    },
    {
      id: "doc-auth",
      type: "authorization",
      title: "Authorization record",
      provenance: caseFact(),
      authNumber: "AUTH-2026-077134",
      status: "approved",
      service: "MRI lumbar spine without contrast",
      codes: ["72148"],
      diagnosisCodes: ["M54.16"],
      requestingProvider: "Dr. Amina Patel (Orthopedics)",
      servicingProvider: "Lakeside Imaging Center",
      requestedDate: "2026-08-04",
      decisionDate: "2026-08-06",
      validFrom: "2026-08-06",
      validTo: "2026-11-04",
      notes: "Approved.",
      requirement: { benefitKey: "diagnostic_mri", required: true },
    },
    {
      id: "doc-benefits",
      type: "benefit_summary",
      title: "Plan rules (official, Remote Health USA)",
      provenance: planRule(R.spd, "Excerpt from the plan knowledge base. Each line cites the benefits overview or the public plan page."),
      planName: "Remote Health USA",
      isSimulatedPlan: false,
      items: [
        { label: "MRI benefit", ruleId: R.mri, provenance: planRule(R.mri) },
        { label: "Pre-authorization list", ruleId: R.paListK, provenance: planRule(R.paListK) },
        { label: "In-network cost sharing", ruleId: R.noCostShare, provenance: planRule(R.noCostShare) },
        { label: "In-network deductible", ruleId: R.inDeductible, provenance: planRule(R.inDeductible) },
        { label: "Who requests pre-authorization", ruleId: R.providerRequests, provenance: planRule(R.providerRequests) },
        { label: "Member's responsibility", ruleId: R.memberConfirms, provenance: planRule(R.memberConfirms) },
        { label: "Missing pre-authorization", ruleId: R.penalty, provenance: planRule(R.penalty) },
        { label: "Claims administration", ruleId: R.bywater, provenance: planRule(R.bywater) },
      ],
    },
    {
      id: "doc-contact-log",
      type: "note",
      title: "Member contact history",
      provenance: caseFact(),
      author: "Member support",
      date: "2026-08-05",
      body: "Member asked whether a lumbar MRI needs approval. Advised that MRI requires pre-authorization, that the in-network provider usually requests it, and that the member should confirm it has been obtained before the scan. Member confirmed that Dr. Patel's office submitted the request on 08/04.",
    },
  ],
  tasks: [
    {
      id: "t-claim-status",
      kind: "single_choice",
      prompt: "Based on the claim record, what happened to the MRI claim?",
      options: [
        { id: "paid", label: "It was paid in full" },
        { id: "denied-auth", label: "It was denied because no prior authorization was on file" },
        { id: "pended", label: "It is pended waiting for medical records" },
        { id: "oon", label: "It was paid at the out-of-network level" },
      ],
      criteria: [
        {
          id: "c-claim-status",
          category: "claims_reasoning",
          points: 4,
          basis: [
            { kind: "case_fact", documentId: "doc-claim" },
            { kind: "general_concept", conceptId: "claim-statuses" },
            { kind: "general_concept", conceptId: "remark-codes" },
          ],
          expectation: "Reads the claim status and denial reason correctly.",
          feedbackIfMissed:
            "The claim line shows 'Denied' with reason PA01 (no prior authorization on file). Reading the status and denial reason is the first step in any claims investigation.",
          grading: { mode: "auto_choice", correctOptionIds: ["denied-auth"] },
        },
      ],
      modelAnswer: "Denied with reason PA01: the claims system found no prior authorization attached to this claim.",
    },
    {
      id: "t-eob-owed",
      kind: "amount",
      measures: "eob_member_responsibility",
      prompt: "According to the EOB, how much does the member currently owe for this claim?",
      hint: "Use the member responsibility line and the remark code, not the provider bill.",
      criteria: [
        {
          id: "c-eob-owed",
          category: "eob_interpretation",
          points: 6,
          basis: [
            { kind: "case_fact", documentId: "doc-eob" },
            { kind: "general_concept", conceptId: "eob" },
            { kind: "general_concept", conceptId: "member-responsibility" },
          ],
          expectation: "Reads $0.00 member responsibility from the EOB.",
          feedbackIfMissed:
            "The EOB shows $0.00 member responsibility for this line. The $2,400 is the billed charge, which is not the same as what the member owes.",
          grading: { mode: "auto_amount", expectedCents: 0, toleranceCents: 0 },
        },
      ],
      modelAnswer: "$0.00, per the EOB's member responsibility line.",
    },
    {
      id: "t-bill-vs-eob",
      kind: "single_choice",
      prompt: "Compare the provider statement to the EOB. What do you find?",
      options: [
        { id: "match", label: "They match: the member owes $2,400" },
        { id: "bill-higher", label: "The bill asks for $2,400, but the EOB shows $0 member responsibility" },
        { id: "bill-lower", label: "The bill is lower than the EOB member responsibility" },
        { id: "cannot", label: "They can't be compared because they're different documents" },
      ],
      criteria: [
        {
          id: "c-bill-vs-eob",
          category: "eob_interpretation",
          points: 6,
          basis: [
            { kind: "case_fact", documentId: "doc-eob" },
            { kind: "case_fact", documentId: "doc-bill" },
            { kind: "general_concept", conceptId: "provider-statement" },
          ],
          expectation: "Spots that the provider bill conflicts with the EOB.",
          feedbackIfMissed:
            "Reconciling the provider statement against the EOB is a core Care Navigator check. The statement asks for $2,400 while the EOB shows $0 member responsibility, so the bill doesn't match how the claim was processed.",
          grading: { mode: "auto_choice", correctOptionIds: ["bill-higher"] },
        },
      ],
      modelAnswer: "The bill conflicts with the EOB: $2,400 requested vs. $0 member responsibility.",
    },
    {
      id: "t-auth-status",
      kind: "single_choice",
      prompt: "What is the prior authorization situation for this service on this date of service?",
      options: [
        { id: "not-required", label: "Pre-authorization was not required for an MRI" },
        { id: "required-missing", label: "Required, but never requested" },
        { id: "required-approved", label: "Required, and an approved authorization covers this service and date" },
        { id: "required-expired", label: "Required, but the authorization had expired" },
        { id: "required-denied", label: "Required, and the request was denied" },
      ],
      criteria: [
        {
          id: "c-auth-status",
          category: "prior_authorization",
          points: 6,
          basis: [
            { kind: "plan_rule", ruleId: R.mri },
            { kind: "plan_rule", ruleId: R.paListK },
            { kind: "case_fact", documentId: "doc-auth" },
          ],
          expectation: "Knows MRI requires pre-authorization (official rule), finds the approved authorization, and confirms the date of service falls inside its validity window.",
          feedbackIfMissed:
            "Official rule: MRI is on the Remote Health USA pre-authorization list (item K: Diagnostic testing (MRI/PET/CT)). Case fact: AUTH-2026-077134 was approved for 72148, valid 08/06 to 11/04, and the 08/14 date of service is inside that window. Required and obtained: the denial does not mean the service was unauthorized.",
          grading: { mode: "auto_choice", correctOptionIds: ["required-approved"] },
        },
      ],
      modelAnswer: "Required (official rule, list item K) and obtained: AUTH-2026-077134, approved 08/06, valid through 11/04.",
    },
    {
      id: "t-auth-match",
      kind: "multi_choice",
      prompt: "Which elements of the claim match the authorization record? Select all that apply.",
      options: [
        { id: "cpt", label: "Procedure code (72148)" },
        { id: "dx", label: "Diagnosis code (M54.16)" },
        { id: "servicing", label: "Servicing provider (Lakeside Imaging Center)" },
        { id: "dos", label: "Date of service within the validity window" },
        { id: "authno", label: "Authorization number appears on the claim" },
      ],
      criteria: [
        {
          id: "c-auth-match",
          category: "prior_authorization",
          points: 5,
          basis: [
            { kind: "case_fact", documentId: "doc-claim" },
            { kind: "case_fact", documentId: "doc-auth" },
            { kind: "general_concept", conceptId: "authorization-linking" },
          ],
          expectation: "Confirms that code, diagnosis, provider and date all match, and that the authorization number is missing from the claim.",
          feedbackIfMissed:
            "Every clinical and administrative element matches the authorization, but the claim's authorization number field is blank. An authorization can exist and still not be linked to the claim. That gap is the most likely cause of the denial.",
          grading: { mode: "auto_choice", correctOptionIds: ["cpt", "dx", "servicing", "dos"] },
        },
      ],
      modelAnswer: "CPT, diagnosis, servicing provider and date all match. The authorization number is not on the claim.",
    },
    {
      id: "t-plan-cost",
      kind: "single_choice",
      prompt: "Under the current Remote Health USA benefits overview, what cost sharing applies to a covered in-network MRI?",
      options: [
        { id: "full", label: "Covered at 100%: $0 deductible, no coinsurance, no provider copay" },
        { id: "coins20", label: "20% coinsurance after the deductible" },
        { id: "oon70", label: "70% after a $1,000 deductible" },
        { id: "copay30", label: "A $30 copay" },
      ],
      criteria: [
        {
          id: "c-plan-cost",
          category: "plan_knowledge",
          points: 6,
          basis: [
            { kind: "plan_rule", ruleId: R.mri },
            { kind: "plan_rule", ruleId: R.noCostShare },
            { kind: "plan_rule", ruleId: R.inDeductible },
          ],
          expectation: "Applies the official in-network rule: diagnostic testing including MRI is covered at 100%, with a $0 deductible and no coinsurance or provider copay.",
          feedbackIfMissed:
            "Official rules: in-network diagnostic testing (X-ray, MRI, CT, PET scans, labs) is covered at 100%, and the in-network deductible is $0. The plan has no in-network coinsurance or provider copay. '70% after deductible' is the out-of-network level. $30 is a prescription tier, not a provider charge.",
          grading: { mode: "auto_choice", correctOptionIds: ["full"] },
        },
      ],
      modelAnswer: "Covered at 100% in network: $0 deductible, no coinsurance, no provider copay.",
    },
    {
      id: "t-icd-why",
      kind: "single_choice",
      prompt: "Which code explains WHY the member had the MRI?",
      options: [
        { id: "72148", label: "72148" },
        { id: "m5416", label: "M54.16" },
        { id: "auth", label: "AUTH-2026-077134" },
        { id: "pa01", label: "PA01" },
      ],
      criteria: [
        {
          id: "c-icd-why",
          category: "coding_understanding",
          points: 5,
          basis: [
            { kind: "general_concept", conceptId: "icd10" },
            { kind: "case_fact", documentId: "doc-claim" },
          ],
          expectation: "Picks the ICD-10 diagnosis code as the reason for care.",
          feedbackIfMissed:
            "ICD-10-CM codes describe why care was given. M54.16 (lumbar radiculopathy) is the reason for the MRI. 72148 is the CPT code for what was done. AUTH and PA01 are an authorization number and a remark code, not clinical codes.",
          grading: { mode: "auto_choice", correctOptionIds: ["m5416"] },
        },
      ],
      modelAnswer: "M54.16, the ICD-10-CM diagnosis code: why the MRI was needed.",
    },
    {
      id: "t-cpt-what",
      kind: "single_choice",
      prompt: "What does 72148 represent on this claim?",
      options: [
        { id: "dx", label: "The member's diagnosis" },
        { id: "proc", label: "The procedure or service that was performed" },
        { id: "pos", label: "The place of service" },
        { id: "net", label: "The provider's network identifier" },
      ],
      criteria: [
        {
          id: "c-cpt-what",
          category: "coding_understanding",
          points: 4,
          basis: [
            { kind: "general_concept", conceptId: "cpt" },
            { kind: "case_fact", documentId: "doc-claim" },
          ],
          expectation: "Identifies CPT as describing what service was performed.",
          feedbackIfMissed: "CPT codes describe what was done: the procedure or service. 72148 is the lumbar spine MRI without contrast.",
          grading: { mode: "auto_choice", correctOptionIds: ["proc"] },
        },
      ],
      modelAnswer: "The service performed: a lumbar spine MRI without contrast.",
    },
    {
      id: "t-investigation",
      kind: "free_text",
      prompt:
        "Investigation summary: What most likely went wrong? Was the claim processed correctly? What would you verify, and what are your next steps?",
      hint: "Separate what the documents prove from what you are inferring, and label official plan rules as such.",
      criteria: [
        {
          id: "c-root-cause",
          category: "claims_reasoning",
          points: 8,
          basis: [
            { kind: "case_fact", documentId: "doc-claim" },
            { kind: "case_fact", documentId: "doc-auth" },
            { kind: "general_concept", conceptId: "authorization-linking" },
          ],
          expectation:
            "States that the denial conflicts with a valid, matching authorization, and treats it as a likely authorization-linking or submission issue (the authorization number is missing from the claim), not as an unauthorized service.",
          feedbackIfMissed:
            "The key insight is the contradiction: the claim was denied for 'no authorization', yet a valid, matching authorization exists for that date. That makes it a processing problem to fix, not a legitimate denial to explain to the member.",
          grading: { mode: "self" },
        },
        {
          id: "c-verify",
          category: "claims_reasoning",
          points: 4,
          basis: [
            { kind: "general_concept", conceptId: "authorization-linking" },
            { kind: "general_concept", conceptId: "claim-correction" },
          ],
          expectation:
            "Lists what still needs confirming: why the authorization didn't link, whether a corrected claim is already in progress, and the status of the provider account.",
          feedbackIfMissed:
            "A strong investigation says what is still unknown. The documents strongly suggest the authorization wasn't linked, but confirm the cause before telling anyone exactly why it happened.",
          grading: { mode: "self" },
        },
        {
          id: "c-reprocess",
          category: "problem_solving",
          points: 5,
          basis: [
            { kind: "plan_rule", ruleId: R.bywater },
            { kind: "general_concept", conceptId: "claim-correction" },
            { kind: "general_concept", conceptId: "appeal" },
          ],
          expectation:
            "Proposes the proportionate fix: ask the claims administrator (Bywater) to review and reprocess the claim with the authorization linked, or have the provider submit a corrected claim with the authorization number. Reach for a formal appeal only if that doesn't resolve it.",
          feedbackIfMissed:
            "When a denial comes from a processing or linking error, the first step is reprocessing or a corrected claim. Official rule: claims administration is handled by Bywater, so that is where reprocessing happens. An appeal is for disputing a decision made correctly on the information available.",
          grading: { mode: "self" },
        },
        {
          id: "c-provider-hold",
          category: "problem_solving",
          points: 3,
          basis: [
            { kind: "case_fact", documentId: "doc-bill" },
            { kind: "case_fact", documentId: "doc-eob" },
            { kind: "general_concept", conceptId: "care-coordination" },
          ],
          expectation: "Plans to contact the provider's billing office: point out the $0 EOB member responsibility and ask them to hold collection while the claim is reviewed.",
          feedbackIfMissed:
            "The member has a payment deadline. Coordinating with the provider to pause billing protects the member while the claim is fixed.",
          grading: { mode: "self" },
        },
        {
          id: "c-plan-benefit",
          category: "plan_knowledge",
          points: 4,
          basis: [
            { kind: "plan_rule", ruleId: R.mri },
            { kind: "plan_rule", ruleId: R.noCostShare },
            { kind: "plan_rule", ruleId: R.inDeductible },
          ],
          expectation:
            "Applies the official rules: a covered in-network MRI is paid at 100%, with a $0 in-network deductible and no coinsurance or provider copay. Once the claim is correctly processed, no cost sharing is expected for this MRI.",
          feedbackIfMissed:
            "Official rules: in-network diagnostic testing including MRI is covered at 100%, the in-network deductible is $0, and there is no in-network coinsurance or provider copay. Don't import cost-sharing assumptions from other plans.",
          grading: { mode: "self" },
        },
        {
          id: "c-penalty",
          category: "plan_knowledge",
          points: 2,
          basis: [
            { kind: "plan_rule", ruleId: R.penalty },
            { kind: "plan_rule", ruleId: R.memberConfirms },
            { kind: "case_fact", documentId: "doc-contact-log" },
          ],
          expectation:
            "Notes that the official consequence of a missing pre-authorization is a reduction of covered charges by 10% (up to $500), not the full charge. Here pre-authorization was obtained and the member confirmed it beforehand, so that consequence shouldn't come into play.",
          feedbackIfMissed:
            "Official rule: if required pre-authorization isn't obtained, the plan reduces covered charges by 10%, up to $500. Even the worst-case reading of 'no authorization' doesn't support billing the member $2,400. In this case authorization was obtained.",
          grading: { mode: "self" },
        },
      ],
      modelAnswer:
        "The claim was denied for 'no prior authorization on file' (PA01), but AUTH-2026-077134 was approved for this exact service, diagnosis, facility and date. The claim's authorization number field is blank, so the authorization most likely wasn't linked during adjudication. The claim was not processed correctly given the authorization on file. Next steps: (1) confirm why the authorization didn't link and whether a corrected claim is pending; (2) ask the claims administrator (Bywater) to review and reprocess with the authorization linked, or have Lakeside submit a corrected claim; (3) contact Lakeside's billing office, point out that the EOB shows $0 member responsibility, and ask them to hold the account. Under the official rules a covered in-network MRI is paid at 100% with a $0 deductible, so no cost sharing is expected once it's processed correctly.",
    },
    {
      id: "t-member-reply",
      kind: "member_response",
      prompt: "Write the chat reply you would send to the member. Keep it short and realistic: about 80 to 150 words.",
      criteria: [
        {
          id: "c-comm-accuracy",
          category: "member_communication",
          points: 2,
          basis: [
            { kind: "case_fact", documentId: "doc-eob" },
            { kind: "case_fact", documentId: "doc-auth" },
            { kind: "general_concept", conceptId: "member-communication" },
          ],
          expectation: "Is accurate: the approval was obtained, the denial looks like a processing issue, and the EOB shows $0 currently owed.",
          feedbackIfMissed: "The reply should reflect the facts you found, with nothing guessed stated as certain.",
          grading: { mode: "self" },
        },
        {
          id: "c-comm-empathy",
          category: "member_communication",
          points: 1.5,
          basis: [{ kind: "general_concept", conceptId: "member-communication" }],
          expectation: "Acknowledges the stress of an unexpected $2,400 bill.",
          feedbackIfMissed: "A short, genuine acknowledgement builds trust before you explain.",
          grading: { mode: "self" },
        },
        {
          id: "c-comm-plain",
          category: "member_communication",
          points: 2,
          basis: [{ kind: "general_concept", conceptId: "member-communication" }],
          expectation: "Explains in plain English, e.g. 'pre-approval' rather than 'PA01 denial', and 'what you owe' rather than 'member responsibility'.",
          feedbackIfMissed: "Insurance jargon confuses members. Translate the terms, or explain them in a few words.",
          grading: { mode: "self" },
        },
        {
          id: "c-comm-ownership",
          category: "member_communication",
          points: 1.5,
          basis: [
            { kind: "general_concept", conceptId: "care-coordination" },
            { kind: "general_concept", conceptId: "member-communication" },
          ],
          expectation: "Takes ownership: says what you will do (ask for the claim to be reprocessed, contact the provider).",
          feedbackIfMissed: "The member should leave knowing someone is actively handling this, not that they have to chase it themselves.",
          grading: { mode: "self" },
        },
        {
          id: "c-comm-promises",
          category: "member_communication",
          points: 1.5,
          basis: [
            { kind: "general_concept", conceptId: "member-communication" },
            { kind: "plan_rule", ruleId: R.noCostShare },
          ],
          expectation:
            "Avoids guaranteeing the outcome or timing of reprocessing. It can say that in-network imaging is normally covered in full under the plan, but it doesn't promise the final result before reprocessing is complete.",
          feedbackIfMissed:
            "'This will definitely be fixed by Friday' or 'you'll never owe anything' promises an outcome you don't control. Say what the plan rules and the EOB show, and what you're doing to confirm.",
          grading: { mode: "self" },
        },
        {
          id: "c-comm-next",
          category: "member_communication",
          points: 1.5,
          basis: [
            { kind: "case_fact", documentId: "doc-bill" },
            { kind: "general_concept", conceptId: "member-communication" },
          ],
          expectation: "Gives a clear next step: hold off on paying the $2,400 for now, and when they will hear back.",
          feedbackIfMissed: "End with what the member should do now and when they'll hear back. The payment deadline makes this essential.",
          grading: { mode: "self" },
        },
      ],
      modelAnswer: "See the suggested member response in the debrief.",
    },
  ],
  debrief: {
    whatHappened:
      "Lakeside Imaging Center submitted the MRI claim without the authorization number. The approved authorization (AUTH-2026-077134) wasn't linked when the claim was adjudicated, so the claim was denied as 'no authorization on file' (PA01). The EOB shows $0 member responsibility, yet Lakeside billed the member the full $2,400 charge.",
    correctReasoning: [
      "The claim was denied (PA01), and the EOB shows $0 member responsibility. The EOB is the record of how the claim was processed, and a provider statement shouldn't ask for more than it.",
      "The provider bill ($2,400 due) conflicts with the EOB ($0), so the member shouldn't pay the bill while this is investigated.",
      "Official rule: MRI requires pre-authorization (Remote Health USA pre-authorization list, item K). Case fact: it was obtained. AUTH-2026-077134 was approved for 72148 with M54.16 at Lakeside, valid 08/06 to 11/04, and the 08/14 date of service is inside that window.",
      "Required, obtained and linked are three separate questions. Every element matches except the authorization number, which is missing from the claim. That points to an authorization-linking or submission issue to verify, not an unauthorized service.",
      "The fix is a review and reprocessing by the claims administrator (Bywater) with the authorization linked, or a corrected claim from the provider, while the provider holds the bill. A formal appeal is not the first tool for a processing error.",
      "Official rules: a covered in-network MRI is paid at 100%, with a $0 in-network deductible and no coinsurance or provider copay, so no cost sharing is expected once the claim is processed correctly. The missing-authorization consequence (covered charges reduced by 10%, up to $500) shouldn't apply either, because authorization was obtained.",
    ],
    modelMemberResponse:
      "Hi Jordan, I'm sorry. An unexpected $2,400 bill is stressful, and I can see why it was confusing. I've looked into it. Your MRI did need pre-approval, and it was approved on August 6 for this exact scan and date. The claim was still marked 'no approval on file', which looks like a processing issue rather than anything you did. Your Explanation of Benefits shows you currently owe $0 for this claim, so please hold off on paying the $2,400 for now. I'm asking the claims team to review and reprocess the claim with the approval attached, and I'm contacting Lakeside Imaging to ask them to pause the bill. In-network imaging like this is normally covered in full under your plan, and I'll confirm the final result once it's reprocessed. I'll update you by Friday.",
    conceptsToReview: ["prior-authorization", "authorization-linking", "eob", "provider-statement", "member-responsibility", "cpt", "icd10", "claim-correction"],
  },
};
