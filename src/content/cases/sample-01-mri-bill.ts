import type { SimulationCaseInput } from "@/domain/case";
import { caseFact, generalConcept } from "@/domain/provenance";

/**
 * SAMPLE CASE — exists to exercise the simulation engine end to end.
 * Uses a fictional training plan. Contains NO SafetyWing / Remote Health USA policy.
 * All names, IDs, amounts and remark codes are invented.
 */
export const sample01MriBill: SimulationCaseInput = {
  id: "sample-01-mri-bill",
  version: 1,
  portfolioNumber: null,
  code: "SAMPLE-01",
  title: "The $2,400 MRI bill",
  summary:
    "A member is billed in full for a lumbar MRI they believed was covered. Reconcile the claim, EOB, provider bill and authorization record, then reply to the member.",
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
  ticket: {
    channel: "chat",
    receivedAt: "2026-09-24T15:12:00Z",
    memberMessage:
      "Hi, I received a $2,400 bill for my MRI. I thought my insurance covered MRIs. My doctor's office even told me it was approved. Can you help me understand what happened? The bill says I have to pay by October 20.",
  },
  member: { name: "Jordan Reyes", memberId: "SIM-48210-01", details: "Primary member, 2026 plan year" },
  plan: {
    name: "Sample Training Plan (fictional)",
    isSimulated: true,
    provenance: caseFact("Fictional plan used only for this sample case. Not Remote Health USA."),
  },
  provider: { name: "Lakeside Imaging Center", type: "Freestanding imaging facility", networkStatus: "in_network" },
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
    "The plan in this case is fictional. Its benefit rules exist only for this exercise.",
    "You can see the member's claim, EOB, authorization and contact history in internal systems.",
    "Remark code PA01 is invented for this simulation.",
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
          text: "This service requires prior authorization and none was found for this claim. Under the provider's network agreement, this amount is the provider's responsibility. The member may not be billed for it.",
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
      notes: "Approved: meets criteria after 6 weeks of conservative treatment.",
    },
    {
      id: "doc-benefits",
      type: "benefit_summary",
      title: "Benefit summary (fictional plan)",
      provenance: caseFact("Fictional plan."),
      planName: "Sample Training Plan (fictional)",
      isSimulatedPlan: true,
      items: [
        { label: "Advanced imaging (MRI / CT / PET)", value: "Covered; prior authorization required", provenance: caseFact() },
        { label: "Who obtains prior authorization", value: "The in-network ordering or servicing provider", provenance: caseFact() },
        { label: "Advanced imaging cost share (in-network)", value: "20% coinsurance after deductible", provenance: caseFact() },
        { label: "Individual deductible", value: "$1,500 (met for 2026 as of Jul 30)", provenance: caseFact() },
      ],
    },
    {
      id: "doc-contact-log",
      type: "note",
      title: "Member contact history",
      provenance: caseFact(),
      author: "Member Services",
      date: "2026-08-05",
      body: "Member called asking whether a lumbar MRI needs approval. Advised that advanced imaging requires prior authorization and that the ordering provider submits the request. Member confirmed that Dr. Patel's office had submitted it on 08/04.",
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
          expectation: "Reads the claim status and denial reason correctly.",
          feedbackIfMissed:
            "The claim line shows status 'Denied' with reason PA01 (no prior authorization on file). Reading the status and the denial reason is the first step in any claims investigation.",
          grading: { mode: "auto_choice", correctOptionIds: ["denied-auth"] },
        },
      ],
      modelAnswer: "Denied, reason PA01: the claims system found no prior authorization attached to this claim.",
    },
    {
      id: "t-eob-owed",
      kind: "amount",
      prompt: "According to the EOB, how much does the member currently owe for this claim?",
      hint: "Look at the member responsibility column and the remark code. Do not use the provider bill.",
      criteria: [
        {
          id: "c-eob-owed",
          category: "eob_interpretation",
          points: 6,
          expectation: "Identifies $0.00 member responsibility from the EOB.",
          feedbackIfMissed:
            "The EOB shows $0.00 member responsibility. Remark PA01 says the denied amount is the provider's responsibility and the member may not be billed. The billed charge ($2,400) is not what the member owes.",
          grading: { mode: "auto_amount", expectedCents: 0, toleranceCents: 0 },
        },
      ],
      modelAnswer: "$0.00. The denied charge is provider liability under remark PA01.",
    },
    {
      id: "t-bill-vs-eob",
      kind: "single_choice",
      prompt: "Compare the provider statement to the EOB. What do you find?",
      options: [
        { id: "match", label: "They match: the member owes $2,400" },
        { id: "bill-higher", label: "The bill asks for $2,400, but the EOB says the member owes $0" },
        { id: "bill-lower", label: "The bill is lower than the EOB member responsibility" },
        { id: "cannot", label: "They can't be compared because they're different documents" },
      ],
      criteria: [
        {
          id: "c-bill-vs-eob",
          category: "eob_interpretation",
          points: 6,
          expectation: "Spots that the provider is billing the member for an amount the EOB assigns to the provider.",
          feedbackIfMissed:
            "Reconciling the provider bill against the EOB is a core Care Navigator check. Here the provider is billing $2,400 while the EOB shows $0 member responsibility, so the bill conflicts with how the claim was processed.",
          grading: { mode: "auto_choice", correctOptionIds: ["bill-higher"] },
        },
      ],
      modelAnswer: "The bill conflicts with the EOB. The provider is billing the member for an amount the EOB assigns to the provider.",
    },
    {
      id: "t-auth-status",
      kind: "single_choice",
      prompt: "What is the prior authorization situation for this service on this date of service?",
      options: [
        { id: "not-required", label: "Prior authorization was not required" },
        { id: "required-missing", label: "Required, but never requested" },
        { id: "required-approved", label: "Required, and an approved authorization covers this service and date" },
        { id: "required-expired", label: "Required, but the authorization had expired" },
        { id: "required-denied", label: "Required, and the request was denied" },
      ],
      criteria: [
        {
          id: "c-auth-status",
          category: "prior_authorization",
          points: 8,
          expectation: "Finds the approved authorization and confirms that the date of service falls within its validity window.",
          feedbackIfMissed:
            "The benefit summary shows that advanced imaging requires authorization, and the authorization record shows AUTH-2026-077134 approved for 72148, valid 08/06 to 11/04. The 08/14 date of service falls inside that window. So the denial does not mean the service was unauthorized.",
          grading: { mode: "auto_choice", correctOptionIds: ["required-approved"] },
        },
      ],
      modelAnswer: "Authorization was required and obtained: AUTH-2026-077134, approved 08/06, valid through 11/04.",
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
          expectation: "Confirms that the code, diagnosis, provider and date all match, and that the authorization number is missing from the claim.",
          feedbackIfMissed:
            "Every clinical and administrative element matches the authorization, but the claim's authorization number field is blank. That gap is the most likely reason the system did not link the authorization, which points to a processing or submission issue.",
          grading: { mode: "auto_choice", correctOptionIds: ["cpt", "dx", "servicing", "dos"] },
        },
      ],
      modelAnswer: "CPT, diagnosis, servicing provider and date all match. The authorization number is NOT on the claim.",
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
          expectation: "Picks the ICD-10 diagnosis code as the reason for care.",
          feedbackIfMissed:
            "ICD-10 codes describe why care was given (the diagnosis). M54.16 (lumbar radiculopathy) is the reason for the MRI. 72148 is the CPT code for what was done. AUTH and PA01 are an authorization number and a remark code, not clinical codes.",
          grading: { mode: "auto_choice", correctOptionIds: ["m5416"] },
        },
      ],
      modelAnswer: "M54.16, the ICD-10-CM diagnosis code. It tells you why the MRI was needed.",
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
      hint: "Separate what the documents prove from what you are inferring.",
      criteria: [
        {
          id: "c-root-cause",
          category: "claims_reasoning",
          points: 8,
          expectation:
            "States that the denial conflicts with a valid, matching authorization. Treats it as a likely processing or submission issue (for example, the authorization number missing from the claim), not as an unauthorized service.",
          feedbackIfMissed:
            "The key insight is the contradiction: the claim was denied for 'no authorization', yet a valid matching authorization exists for that date. That makes it a processing or matching problem to fix, not a legitimate denial to explain to the member.",
          grading: { mode: "self" },
        },
        {
          id: "c-verify",
          category: "claims_reasoning",
          points: 4,
          expectation:
            "Lists what still needs confirming: why the authorization did not link (for example, the authorization number missing on submission), whether a corrected claim is already in progress, and the provider account status.",
          feedbackIfMissed:
            "A strong investigation says what is still unknown. The documents strongly suggest the authorization was not linked, but you should confirm the cause before telling anyone exactly why it happened.",
          grading: { mode: "self" },
        },
        {
          id: "c-reprocess",
          category: "problem_solving",
          points: 5,
          expectation:
            "Proposes the proportionate fix: have the claim reprocessed or reconsidered with the authorization attached (internally, or through a corrected claim from the provider) before considering a formal appeal.",
          feedbackIfMissed:
            "When a denial results from a processing or matching error, the usual first step is to get the claim reprocessed with the authorization linked. A formal appeal is generally for disputing a decision made correctly on the information available.",
          grading: { mode: "self" },
        },
        {
          id: "c-provider-hold",
          category: "problem_solving",
          points: 3,
          expectation: "Plans to contact the provider's billing office: point out the $0 EOB member responsibility and ask them to hold collection while the claim is reprocessed.",
          feedbackIfMissed:
            "The member has a payment deadline. Coordinating with the provider to pause billing protects the member while the claim is fixed. This is a core part of provider/member coordination.",
          grading: { mode: "self" },
        },
        {
          id: "c-cost-share",
          category: "plan_knowledge",
          points: 6,
          expectation:
            "Recognises that after reprocessing the member may still owe normal cost sharing (20% coinsurance on the allowed amount, deductible already met), and that this will not be $2,400.",
          feedbackIfMissed:
            "Fixing the denial does not automatically mean $0. Under this fictional plan, advanced imaging carries 20% coinsurance after the deductible, which is already met. So the member will likely owe 20% of the allowed amount, not the $2,400 billed charge. Setting that expectation now avoids a second surprise.",
          grading: { mode: "self" },
        },
      ],
      modelAnswer:
        "The claim was denied for 'no prior authorization on file', but AUTH-2026-077134 was approved for this exact service, diagnosis, facility and date. The claim's authorization number field is blank, so the authorization most likely was not linked when the claim was adjudicated. The claim was not processed correctly given the authorization on file. Next steps: (1) confirm why the authorization did not link and whether a corrected claim is pending; (2) request reprocessing with the authorization attached; (3) contact Lakeside's billing office, point out that the EOB shows $0 member responsibility, and ask them to hold the account; (4) set expectations: once reprocessed, the member will likely owe 20% coinsurance on the allowed amount.",
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
          expectation: "Is factually accurate: the authorization was approved, the denial looks like a processing issue, and the EOB shows $0 currently owed.",
          feedbackIfMissed: "The reply should reflect the facts you found, with no guesses stated as certainties.",
          grading: { mode: "self" },
        },
        {
          id: "c-comm-empathy",
          category: "member_communication",
          points: 1.5,
          expectation: "Acknowledges the stress of an unexpected $2,400 bill.",
          feedbackIfMissed: "A short, genuine acknowledgement builds trust before you explain.",
          grading: { mode: "self" },
        },
        {
          id: "c-comm-plain",
          category: "member_communication",
          points: 2,
          expectation: "Explains in plain English, for example 'prior approval' rather than 'PA01 denial', and 'your share' rather than 'coinsurance' without explanation.",
          feedbackIfMissed: "Insurance jargon confuses members. Translate terms, or explain them in a few words.",
          grading: { mode: "self" },
        },
        {
          id: "c-comm-ownership",
          category: "member_communication",
          points: 1.5,
          expectation: "Takes ownership: says what you will do (request reprocessing, contact the provider).",
          feedbackIfMissed: "The member should leave knowing that someone is actively handling this, not that they have to chase it themselves.",
          grading: { mode: "self" },
        },
        {
          id: "c-comm-promises",
          category: "member_communication",
          points: 1.5,
          expectation: "Avoids unsupported promises. Does not guarantee a $0 outcome, and mentions that normal cost sharing may still apply.",
          feedbackIfMissed:
            "Saying 'you won't owe anything' or 'this will be fixed' promises an outcome you don't control. After reprocessing, coinsurance may still apply.",
          grading: { mode: "self" },
        },
        {
          id: "c-comm-next",
          category: "member_communication",
          points: 1.5,
          expectation: "Gives a clear next step for the member: hold off on paying the $2,400 for now, and when they will hear back.",
          feedbackIfMissed: "End with what the member should do now and when they will hear back. Their payment deadline makes this essential.",
          grading: { mode: "self" },
        },
      ],
      modelAnswer: "See the suggested member response in the debrief.",
    },
  ],
  debrief: {
    whatHappened:
      "Lakeside Imaging Center billed the MRI without the authorization number. The claims system did not link the approved authorization, denied the claim for 'no authorization on file', and correctly made the amount provider liability on the EOB. The provider then billed the member the full $2,400 anyway.",
    correctReasoning: [
      "The claim was denied (PA01), but the EOB shows $0 member responsibility because the denied amount is provider liability.",
      "The provider bill ($2,400) conflicts with the EOB ($0), so the member should not be paying this bill as it stands.",
      "Prior authorization was required AND approved: AUTH-2026-077134, for 72148 with M54.16, at Lakeside, valid 08/06 to 11/04. The 08/14 date of service is covered.",
      "Every element matches except the authorization number, which is missing from the claim. That points to a processing or submission issue, not an unauthorized service.",
      "The right fix is reprocessing with the authorization linked, plus a billing hold from the provider. A formal appeal is not the first tool here.",
      "After reprocessing, the member will likely owe 20% coinsurance on the allowed amount (deductible met), not $0 and not $2,400.",
    ],
    modelMemberResponse:
      "Hi Jordan, I'm sorry you got such a big bill, and I can see why it was confusing. I've looked into it. Your MRI did need prior approval, and it was approved on August 6 for this exact scan and date. The claim was still denied for 'no approval on file', which looks like a processing issue rather than anything you did. Your Explanation of Benefits currently shows you owe $0 for this claim, so please hold off on paying the $2,400 for now. I'm asking our claims team to reprocess the claim with the approval attached, and I'll contact Lakeside Imaging to ask them to pause the bill. Once it's reprocessed, you may owe your usual share for imaging (20% of the plan's approved amount), but not the full $2,400. I'll update you by Friday.",
    conceptsToReview: ["prior-authorization", "eob", "member-responsibility", "allowed-amount", "coinsurance", "cpt", "icd10", "appeals-denials"],
  },
};
