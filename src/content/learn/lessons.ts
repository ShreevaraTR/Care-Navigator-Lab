import type { Lesson, LessonSource } from "@/domain/lesson";

/**
 * Priority lessons. General-concept text is plan-neutral. Remote Health USA facts appear only
 * through `rules` blocks (rendered verbatim from the knowledge base) or blocks whose source is
 * explicitly `plan_rule`. Worked examples use fictional amounts and say so.
 */

const plan = (...ruleIds: string[]): LessonSource => ({ kind: "plan_rule", ruleIds });
const fictional: LessonSource = { kind: "case_fact" };

export const lessons: Lesson[] = [
  // 1 -----------------------------------------------------------------------
  {
    id: "claims-basics",
    number: 1,
    title: "How U.S. health insurance claims work",
    summary: "The path from a doctor's visit to an EOB and a bill, and what each claim status means.",
    explanation: [
      { type: "p", text: "A claim is the provider's request to be paid for care. Before a member ever sees a bill, the care has been documented, coded, submitted and processed (adjudicated). Most member confusion comes from a document that arrives before, or doesn't match, another step in this chain." },
      {
        type: "list",
        ordered: true,
        items: [
          "Member receives care.",
          "Provider documents the care in the medical record.",
          "The diagnosis (why) is documented and coded as ICD-10-CM.",
          "The procedure or service (what) is coded as CPT/HCPCS.",
          "The provider submits the claim to the plan.",
          "The payer/administrator receives and processes the claim.",
          "The claim is adjudicated: coverage, allowed amount, plan payment and member responsibility are decided line by line.",
          "An EOB is generated for the member.",
          "The provider issues a statement (bill) for any balance.",
          "The member compares the EOB with the bill.",
          "Discrepancies may require investigation.",
          "A claim correction, reprocessing or appeal may follow.",
        ],
      },
      {
        type: "table",
        caption: "Claim statuses you will see",
        headers: ["Status", "What it means", "What the member owes right now"],
        rows: [
          ["Submitted / received", "The plan has the claim but hasn't decided it yet.", "Unknown until processed."],
          ["Pending (pended)", "Processing is paused, often waiting for information or review.", "Unknown until processed."],
          ["Needs additional information", "The plan asked the provider or member for something (records, accident details, other coverage).", "Unknown. Identify who must send what."],
          ["Paid", "Processed and paid per the plan's rules.", "The member responsibility shown on the EOB."],
          ["Partially paid", "Some lines paid, some denied or reduced.", "Check each line's member responsibility."],
          ["Denied", "Not paid, with a reason code.", "Depends on the reason and on who is liable (member vs. provider). Read the EOB."],
          ["Corrected / reprocessed", "A new decision replaces the earlier one.", "The member responsibility on the latest EOB."],
          ["Duplicate", "A repeat submission of a claim already on file.", "Nothing extra. Find and check the original claim."],
          ["Authorization mismatch", "The claim doesn't match an authorization on file (wrong code, date, provider, or no auth number).", "Investigate before telling the member they owe anything."],
        ],
      },
      { type: "p", text: "Remote Health USA specifics: the official sources name who does what in this chain." },
      { type: "rules", ruleIds: ["rhus.structure.bywater_tpa", "rhus.structure.cigna_ppo_network", "rhus.structure.in_network_direct_billing", "rhus.structure.out_of_network_claims"] },
    ],
    example: {
      title: "One MRI, followed through the chain (fictional)",
      blocks: [
        {
          type: "list",
          ordered: true,
          source: fictional,
          items: [
            "Aug 14: the member gets a lumbar MRI at an in-network imaging center.",
            "The radiologist's report documents the scan. The order documents the reason: lumbar radiculopathy.",
            "The claim lists CPT 72148 (lumbar MRI without contrast) and ICD-10-CM M54.16 (lumbar radiculopathy).",
            "Aug 21: the facility submits the claim to the plan.",
            "Sep 2: the claim is adjudicated and an EOB is issued.",
            "Sep 20: the facility mails a statement.",
            "Sep 24: the member contacts support because the statement and the EOB disagree.",
          ],
        },
      ],
    },
    whatToLookFor: [
      "Which step is the claim at? A bill that arrives before adjudication may be premature.",
      "The claim status, and each line's status, not just the header.",
      "Dates: date of service, received date, processed date, statement date.",
      "Who the claim was submitted by and to, and whether the provider was in network.",
    ],
    exercise: {
      prompt: "A member's claim shows 'Pending: additional information requested from provider'. The member has already received a $650 statement from the provider. What does the member owe right now?",
      options: [
        { id: "a", label: "$650, because the provider has billed it" },
        { id: "b", label: "Nothing has been determined yet: the claim hasn't been adjudicated" },
        { id: "c", label: "$0, because pending claims are always paid in full" },
        { id: "d", label: "Whatever the deductible is" },
      ],
      correctOptionIds: ["b"],
      answer: "Nothing has been determined yet.",
      explanation:
        "Member responsibility is set when the claim is adjudicated and appears on the EOB. A statement sent while the claim is pending is premature. Find out what information the plan needs and from whom, help get it sent, and ask the provider to hold the bill until the EOB is issued. Don't promise $0 either.",
    },
    relatedConcepts: ["claims-lifecycle", "claim-statuses", "adjudication", "eob", "provider-statement", "duplicate-claim"],
    planRules: ["rhus.structure.bywater_tpa", "rhus.structure.in_network_direct_billing", "rhus.structure.out_of_network_claims"],
  },

  // 2 -----------------------------------------------------------------------
  {
    id: "reading-eob",
    number: 2,
    title: "How to read an EOB",
    summary: "Every field on an Explanation of Benefits, and how the amounts relate to each other.",
    explanation: [
      { type: "callout", tone: "key", text: "An EOB is not a bill. It explains how the plan processed a claim. The member pays the provider, based on a bill that should agree with the EOB." },
      {
        type: "table",
        caption: "EOB fields",
        headers: ["Field", "What it tells you"],
        rows: [
          ["Claim number", "Identifies the claim. Use it in every follow-up."],
          ["Date of service", "When care happened. Match it to the bill and any authorization."],
          ["Provider / network status", "Who provided care, and whether they were in network. This drives cost sharing and balance-billing risk."],
          ["Billed amount", "The provider's full charge."],
          ["Allowed amount", "What the plan recognizes for the service. Cost sharing is calculated from this."],
          ["Plan payment", "What the plan paid the provider."],
          ["Deductible", "Part of the allowed amount applied to the member's deductible."],
          ["Copay", "Fixed amount owed for the service, if any."],
          ["Coinsurance", "Member's percentage share of the allowed amount, if any."],
          ["Not covered", "Amounts the plan didn't cover. Check the remark to see whether the member or the provider is liable."],
          ["Member responsibility", "What the member owes for the claim (deductible + copay + coinsurance + member-liable non-covered amounts)."],
          ["Remark / denial codes", "Why amounts were adjusted or denied. Read every remark."],
        ],
      },
      { type: "callout", tone: "key", text: "Two checks: allowed = plan payment + member cost share (for covered lines); billed − allowed = the discount or excess, which in network is normally a write-off, not a member charge." },
      { type: "p", text: "Remote Health USA in network: the official rules mean the deductible, copay and coinsurance columns should normally be $0 for covered medical services. Prescription copays are the exception.", source: plan("rhus.cost.in_network_no_cost_share", "rhus.cost.deductible.in_network") },
    ],
    example: {
      title: "A general EOB line (fictional plan with a deductible and 20% coinsurance, NOT Remote Health USA)",
      blocks: [
        {
          type: "table",
          source: fictional,
          headers: ["Billed", "Allowed", "Deductible", "Coinsurance", "Plan paid", "Member responsibility"],
          rows: [["$300.00", "$180.00", "$50.00", "$26.00", "$104.00", "$76.00"]],
        },
        { type: "list", source: fictional, items: ["Allowed $180 − deductible $50 = $130 left.", "20% coinsurance on $130 = $26.", "Plan pays $130 − $26 = $104.", "Member owes $50 + $26 = $76. The $120 difference between billed and allowed is a network discount the member doesn't owe."] },
      ],
    },
    whatToLookFor: [
      "Does the member responsibility add up from the cost-share columns?",
      "Does allowed = plan paid + member cost share?",
      "Every remark code, and whether it assigns liability to the member or the provider.",
      "Network status, and whether the cost sharing fits the plan's rules for that network tier.",
      "Is this the latest EOB for the claim? A reprocessed claim produces a new one.",
    ],
    exercise: {
      prompt: "An EOB line (fictional plan) shows: billed $500, allowed $320, deductible $0, copay $0, coinsurance $64, plan paid $256. What is the member responsibility?",
      options: [
        { id: "a", label: "$500" },
        { id: "b", label: "$244 (billed − plan paid)" },
        { id: "c", label: "$64" },
        { id: "d", label: "$180 (billed − allowed)" },
      ],
      correctOptionIds: ["c"],
      answer: "$64.",
      explanation:
        "Member responsibility is the cost share on the allowed amount: $0 deductible + $0 copay + $64 coinsurance. Check: $256 plan + $64 member = $320 allowed. The $180 above the allowed amount is a discount, not a member charge (unless it's out-of-network balance billing).",
    },
    relatedConcepts: ["eob", "billed-amount", "allowed-amount", "plan-payment", "member-responsibility", "remark-codes"],
    planRules: ["rhus.cost.in_network_no_cost_share", "rhus.cost.deductible.in_network"],
  },

  // 3 -----------------------------------------------------------------------
  {
    id: "eob-vs-bill",
    number: 3,
    title: "EOB vs. provider bill",
    summary: "Reconciling what the plan says the member owes with what the provider is asking for.",
    explanation: [
      {
        type: "table",
        headers: ["", "EOB", "Provider statement (bill)"],
        rows: [
          ["Sent by", "The plan / claims administrator", "The provider's billing office"],
          ["Purpose", "Explain how the claim was processed", "Request payment"],
          ["Is it a bill?", "No", "Yes"],
          ["Source of 'what you owe'", "Member responsibility", "Balance due"],
        ],
      },
      { type: "callout", tone: "key", text: "The provider's balance due should equal the EOB member responsibility for the same claim. If it's higher, investigate before the member pays." },
      {
        type: "list",
        items: [
          "The bill was sent before the claim was processed, or before the EOB posted.",
          "The provider billed the full charge instead of the member responsibility (the contractual adjustment wasn't written off).",
          "A denial was assigned to the provider on the EOB, but the provider billed the member anyway.",
          "The claim was reprocessed and the bill reflects the old decision.",
          "The bill and the EOB are for different claims, dates or services.",
          "Out of network: the difference may be balance billing, which is the member's risk under the plan rules.",
        ],
      },
      { type: "rules", ruleIds: ["rhus.cost.balance_billing"] },
    ],
    example: {
      title: "Bill higher than EOB (fictional)",
      blocks: [
        {
          type: "table",
          source: fictional,
          headers: ["Document", "Amount"],
          rows: [["EOB: member responsibility", "$0.00"], ["EOB: billed amount", "$2,400.00"], ["Provider statement: balance due", "$2,400.00"]],
        },
        { type: "p", source: fictional, text: "The statement asks for the full billed amount, but the EOB assigns the member $0. The provider either hasn't seen the EOB or is billing an amount the EOB doesn't support. Next steps: confirm the claim details, contact the provider's billing office with the EOB, and ask them to hold the account while it's resolved." },
      ],
    },
    whatToLookFor: [
      "Same claim? Match the claim number or account, date of service, and codes.",
      "Balance due vs. EOB member responsibility.",
      "Insurance payments and adjustments posted on the statement.",
      "Statement date vs. EOB processed date.",
      "Network status: in-network discount amounts shouldn't appear as member balances.",
    ],
    exercise: {
      prompt: "An in-network EOB (fictional) shows billed $900, allowed $400, plan paid $400, member responsibility $0. The provider statement shows charge $900, insurance paid $400, balance due $500. What's the most likely issue?",
      options: [
        { id: "a", label: "The member owes $500 because the plan didn't pay the full charge" },
        { id: "b", label: "The provider hasn't written off the $500 difference between billed and allowed" },
        { id: "c", label: "The EOB is wrong because it doesn't match the bill" },
        { id: "d", label: "The member should file an appeal" },
      ],
      correctOptionIds: ["b"],
      answer: "The provider hasn't applied the contractual adjustment ($900 − $400 = $500).",
      explanation:
        "In network, the allowed amount is generally the contracted rate. The EOB says the member owes $0, so the statement should show a $500 adjustment and a $0 balance. Contact the provider's billing office with the EOB. This is a billing correction, not an appeal.",
    },
    relatedConcepts: ["eob", "provider-statement", "member-responsibility", "contracted-rate", "balance-billing", "care-coordination"],
    planRules: ["rhus.cost.balance_billing"],
  },

  // 4 -----------------------------------------------------------------------
  {
    id: "cpt-icd",
    number: 4,
    title: "CPT vs. ICD-10",
    summary: "What was done vs. why it was done, and how to spot an obvious mismatch without pretending to be a coder.",
    explanation: [
      { type: "callout", tone: "key", text: "CPT = WHAT service or procedure was performed. ICD-10-CM = WHY: the diagnosis, condition or reason for care." },
      {
        type: "table",
        headers: ["", "CPT (and HCPCS)", "ICD-10-CM"],
        rows: [
          ["Answers", "What was done?", "Why was it done?"],
          ["Format", "5 characters, e.g. 72148 (HCPCS: letter + 4 digits)", "Letter + digits, often with a decimal, e.g. M54.16"],
          ["Maintained by", "AMA (copyrighted)", "CDC/NCHS (public domain)"],
          ["On a claim", "One per service line, drives pricing", "Linked to each line to justify it"],
        ],
      },
      { type: "p", text: "Claims carry CPT codes because the plan pays per service. The allowed amount and the benefit category depend on what was done. The ICD-10 code tells the plan why, which supports medical necessity and can also trigger rules (preventive vs. diagnostic, accident questions, authorization criteria)." },
      { type: "p", text: "Coding errors affect claims: a wrong CPT can price or categorize the service incorrectly. A diagnosis that doesn't support the procedure can lead to a medical-necessity denial. A code that doesn't match the authorization can break the authorization link." },
      { type: "callout", tone: "warn", text: "Your role as a Care Navigator: recognize obvious mismatches and route them. Ask the provider to review their coding. Don't recode a claim, and don't tell a member a code is definitely wrong." },
    ],
    example: {
      title: "Matched and mismatched pairs",
      blocks: [
        {
          type: "table",
          headers: ["Service (CPT)", "Diagnosis (ICD-10-CM)", "Makes sense?"],
          rows: [
            ["72148: lumbar spine MRI without contrast", "M54.16: lumbar radiculopathy", "Yes. Lower-back nerve pain supports a lower-back MRI."],
            ["73560: knee X-ray (1–2 views)", "M17.11: primary osteoarthritis, right knee", "Yes. Knee arthritis supports a knee X-ray."],
            ["73560: knee X-ray (1–2 views)", "H66.91: otitis media (ear infection), right ear", "Obvious mismatch. Ask the provider to review."],
            ["99213: established-patient office visit", "Z00.00: general adult exam without abnormal findings", "Possible issue. A routine-exam diagnosis on a problem-visit code can affect whether it's processed as preventive. Flag it; don't conclude."],
          ],
        },
        { type: "p", text: "Descriptions are our plain-language summaries. Official CPT descriptors are AMA-copyrighted and are not reproduced here." },
      ],
    },
    whatToLookFor: [
      "Is a diagnosis code in the diagnosis field, and a procedure code in the procedure field?",
      "Does the body area or condition in the ICD-10 plausibly fit the service?",
      "Does the CPT on the claim match the CPT on the authorization?",
      "Does the code category (preventive vs. diagnostic) match what the member says happened?",
    ],
    exercise: {
      prompt: "A claim line shows procedure 73560 (knee X-ray) with diagnosis H66.91 (ear infection). The claim was denied for medical necessity. What should you do?",
      options: [
        { id: "a", label: "Tell the member the provider used the wrong code and the claim will be paid once fixed" },
        { id: "b", label: "Recode the diagnosis to a knee condition and resubmit" },
        { id: "c", label: "Note the apparent diagnosis/procedure mismatch and ask the provider to review their coding and send a corrected claim if needed" },
        { id: "d", label: "File an appeal for medical necessity" },
      ],
      correctOptionIds: ["c"],
      answer: "Flag the apparent mismatch to the provider for coding review.",
      explanation:
        "An ear-infection diagnosis doesn't support a knee X-ray, which plausibly explains a medical-necessity denial. Only the provider can correct their coding. You don't recode, and you don't promise payment. Tell the member what you found in plain terms and that you've asked the provider to review it.",
    },
    relatedConcepts: ["cpt", "hcpcs", "icd10", "medical-necessity", "coding-error", "claim-correction"],
    planRules: ["rhus.structure.medical_necessity"],
  },

  // 5 -----------------------------------------------------------------------
  {
    id: "prior-auth",
    number: 5,
    title: "Prior authorization",
    summary: "Four separate questions: required, requested, approved for this service and date, and linked to the claim.",
    explanation: [
      { type: "callout", tone: "key", text: "Ask four questions separately: (1) Was it required? (2) Was it requested? (3) Was it approved for this service, date and provider? (4) Is the approval linked to the claim? A 'no authorization' denial can happen even when the answer to 1–3 is yes." },
      { type: "p", text: "Remote Health USA: the official process rules." },
      { type: "rules", ruleIds: ["rhus.pa.provider_usually_requests", "rhus.pa.member_must_confirm", "rhus.pa.penalty", "rhus.pa.penalty_not_counted", "rhus.pa.emergency_notification"] },
      { type: "p", text: "The official list of services requiring pre-authorization:" },
      { type: "preauth_list" },
      { type: "callout", tone: "warn", text: "Some benefit rows say 'Pre-authorization required' without appearing on this list (e.g. urgent care), and the diagnostic-testing row includes X-ray and labs while the list names only MRI/PET/CT. These are marked 'needs clarification' in the knowledge base. Don't build a conclusion on them." },
    ],
    example: {
      title: "Penalty arithmetic, per the rule's wording (fictional amounts)",
      blocks: [
        {
          type: "table",
          source: plan("rhus.pa.penalty"),
          headers: ["Covered charges", "10%", "Penalty (capped at $500)"],
          rows: [["$1,200", "$120", "$120"], ["$8,000", "$800", "$500"]],
        },
        { type: "p", text: "The source doesn't describe how the administrator shows this reduction on an EOB. Treat the arithmetic as illustrating the rule, not as an EOB format.", source: { kind: "assumption" } },
      ],
    },
    whatToLookFor: [
      "Is the service on the official list (or marked required on its benefit row)?",
      "Authorization status and number.",
      "Codes on the authorization vs. codes on the claim.",
      "Validity window vs. date of service.",
      "Requesting/servicing provider vs. the provider on the claim.",
      "Is the authorization number present on the claim?",
      "Emergency admission: was notification made within the window?",
    ],
    exercise: {
      prompt: "An authorization was approved for a CT scan (valid Mar 1–May 30). The claim is for an MRI on Apr 10 and was denied for no authorization. What's the best reading?",
      options: [
        { id: "a", label: "Processing error: the authorization was approved, so the claim should be paid" },
        { id: "b", label: "The authorization doesn't cover the service billed. Verify with the provider whether an MRI was ordered or the claim was coded incorrectly." },
        { id: "c", label: "MRI doesn't require pre-authorization, so the denial is wrong" },
        { id: "d", label: "The member must pay the full charge" },
      ],
      correctOptionIds: ["b"],
      answer: "The approved authorization (CT) doesn't match the billed service (MRI).",
      explanation:
        "MRI and CT are both on the official list (item K), so the MRI needed its own approval, or the claim was miscoded. Check with the provider which service was actually performed and authorized. If a different service was done without authorization, the plan's documented consequence is a 10% reduction of covered charges (up to $500), not automatically the full charge.",
    },
    relatedConcepts: ["prior-authorization", "authorization-linking", "medical-necessity", "cpt"],
    planRules: ["rhus.pa.provider_usually_requests", "rhus.pa.member_must_confirm", "rhus.pa.penalty", "rhus.pa.list.k"],
  },

  // 6 -----------------------------------------------------------------------
  {
    id: "allowed-amount",
    number: 6,
    title: "Allowed amount and member responsibility",
    summary: "Billed vs. allowed vs. plan payment vs. member responsibility vs. balance billing, and how a charge moves through the system.",
    explanation: [
      {
        type: "table",
        headers: ["Amount", "Definition", "Who sets it"],
        rows: [
          ["Billed (charge)", "The provider's full price", "Provider"],
          ["Allowed", "What the plan recognizes for the service (in network: typically the contracted rate)", "Plan / network contract"],
          ["Plan payment", "What the plan pays the provider", "Plan's benefits applied to the allowed amount"],
          ["Member responsibility", "Deductible + copay + coinsurance + member-liable non-covered amounts", "Plan's benefits (shown on the EOB)"],
          ["Balance-billed amount", "Billed − allowed, charged to the member by an out-of-network provider", "Provider (risk mainly out of network)"],
        ],
      },
      { type: "callout", tone: "key", text: "Covered line: allowed = plan payment + member cost share. Billed − allowed is NOT member cost share. In network it's normally written off. Out of network it may be balance billed." },
      { type: "p", text: "Remote Health USA, official rules:" },
      { type: "rules", ruleIds: ["rhus.cost.in_network_no_cost_share", "rhus.cost.coinsurance.out_of_network", "rhus.cost.deductible.out_of_network", "rhus.cost.oop.out_of_network", "rhus.cost.oop.never_counts", "rhus.cost.balance_billing"] },
    ],
    example: {
      title: "Out-of-network specialist visit under the official rules (fictional amounts; deductible already met; out-of-pocket max not reached)",
      blocks: [
        {
          type: "table",
          source: plan("rhus.cost.coinsurance.out_of_network", "rhus.cost.balance_billing"),
          headers: ["Billed", "Allowed", "Plan pays 70%", "Member coinsurance 30%", "Possible balance bill"],
          rows: [["$500", "$300", "$210", "$90", "up to $200"]],
        },
        { type: "p", source: plan("rhus.cost.oop.never_counts"), text: "The $90 counts toward the out-of-network out-of-pocket limit. Any balance-billed amount above what the plan agrees to pay never counts toward it." },
      ],
    },
    whatToLookFor: [
      "Which figure is the member actually being asked to pay, and where it comes from.",
      "Network status: in-network covered services under this plan have no deductible, coinsurance or provider copay.",
      "Out of network: deductible status, the 70% level, the out-of-pocket limit, and balance-billing risk.",
      "Charges that never count toward the out-of-pocket limit.",
    ],
    exercise: {
      prompt: "A Remote Health USA member has an out-of-network MRI (pre-authorization obtained). Billed $2,000, allowed $1,000. The member has already met the out-of-network deductible and is far from the out-of-pocket limit. Under the official rules, what can the member expect?",
      options: [
        { id: "a", label: "$0: MRI is covered at 100%" },
        { id: "b", label: "$300 coinsurance (30% of $1,000), plus a possible balance bill of up to $1,000" },
        { id: "c", label: "$600: 30% of the billed $2,000" },
        { id: "d", label: "$1,000 toward the deductible" },
      ],
      correctOptionIds: ["b"],
      answer: "$300 coinsurance, plus possible balance billing up to $1,000.",
      explanation:
        "Out of network, diagnostic testing is paid at 70% after the deductible, so the plan pays $700 and the member's coinsurance is $300. 100% applies only in network. Because the provider is out of network, the member may also be balance billed for the $1,000 above the allowed amount, and that amount never counts toward the out-of-pocket limit.",
    },
    relatedConcepts: ["billed-amount", "allowed-amount", "contracted-rate", "plan-payment", "member-responsibility", "deductible", "coinsurance", "out-of-pocket-max", "balance-billing"],
    planRules: ["rhus.cost.in_network_no_cost_share", "rhus.cost.coinsurance.out_of_network", "rhus.cost.oop.never_counts", "rhus.benefit.diagnostic_mri"],
  },

  // 7 -----------------------------------------------------------------------
  {
    id: "network",
    number: 7,
    title: "Network vs. out-of-network",
    summary: "Why network status changes almost everything about what a member pays.",
    explanation: [
      { type: "p", text: "An in-network provider has a contract with the plan's network: it accepts negotiated rates and bills the plan directly. An out-of-network provider has no contract, so the plan pays a lower percentage of an allowed amount, and the provider may bill the member the rest." },
      { type: "rules", ruleIds: ["rhus.structure.cigna_ppo_network", "rhus.structure.out_of_network_allowed"] },
      {
        type: "table",
        caption: "Remote Health USA in vs. out of network (official rules)",
        source: plan(
          "rhus.cost.in_network_no_cost_share",
          "rhus.cost.deductible.in_network",
          "rhus.cost.deductible.out_of_network",
          "rhus.cost.coinsurance.out_of_network",
          "rhus.cost.oop.in_network",
          "rhus.cost.oop.out_of_network",
          "rhus.cost.balance_billing",
          "rhus.structure.in_network_direct_billing",
          "rhus.structure.out_of_network_claims",
        ),
        headers: ["", "In network", "Out of network"],
        rows: [
          ["Deductible", "$0", "$1,000 individual / $3,500 family"],
          ["Plan pays (most covered services)", "100%", "70% after deductible"],
          ["Coinsurance / provider copay", "None", "Up to 30% coinsurance"],
          ["Out-of-pocket limit", "$1,000 single / $3,000 family", "$2,000 single / $7,000 family"],
          ["Balance billing", "Not addressed by the sources for in-network care", "Possible above the plan's allowed rate"],
          ["Who files the claim", "Provider bills the plan directly", "Provider may or may not; otherwise the member submits"],
        ],
      },
      { type: "callout", tone: "warn", text: "Exceptions: emergency services for an emergency medical condition and emergency ambulance are paid at 100% out of network. Deductibles and out-of-pocket limits for in and out of network are tracked separately." },
      { type: "rules", ruleIds: ["rhus.cost.deductible.rules"] },
    ],
    example: {
      title: "Same MRI, two networks (fictional amounts; allowed $1,000; out-of-network deductible not yet met)",
      blocks: [
        {
          type: "table",
          source: plan("rhus.benefit.diagnostic_mri", "rhus.cost.deductible.out_of_network", "rhus.cost.coinsurance.out_of_network"),
          headers: ["", "In network", "Out of network"],
          rows: [
            ["Applied to deductible", "$0", "$1,000"],
            ["Plan pays", "$1,000", "$0"],
            ["Member responsibility (EOB)", "$0", "$1,000"],
            ["Possible balance bill", "—", "Billed − allowed"],
          ],
        },
      ],
    },
    whatToLookFor: [
      "Network status on the claim and EOB, not what the member assumed.",
      "Whether the plan shows the provider in network for the date of service (the network directory is Cigna's).",
      "Emergency vs. non-emergency: the out-of-network level differs.",
      "Separate in- and out-of-network deductible and out-of-pocket accumulators.",
    ],
    exercise: {
      prompt: "A Remote Health USA member saw an out-of-network primary care doctor. Allowed amount $200. The member has paid nothing toward the out-of-network deductible this year. What is the member responsibility on the EOB?",
      options: [
        { id: "a", label: "$0: PCP visits are 100% covered" },
        { id: "b", label: "$60 (30%)" },
        { id: "c", label: "$200, applied to the out-of-network deductible" },
        { id: "d", label: "$1,000" },
      ],
      correctOptionIds: ["c"],
      answer: "$200, all applied to the $1,000 out-of-network deductible.",
      explanation:
        "Out of network, the PCP benefit is 70% after the deductible. With the deductible unmet, the whole $200 allowed amount goes toward it, and the plan pays $0 on this claim. The 100% level is in-network only. A balance bill above $200 is also possible.",
    },
    relatedConcepts: ["network", "deductible", "coinsurance", "out-of-pocket-max", "balance-billing", "contracted-rate"],
    planRules: ["rhus.structure.cigna_ppo_network", "rhus.cost.deductible.out_of_network", "rhus.cost.coinsurance.out_of_network", "rhus.benefit.pcp_visit"],
  },

  // 8 -----------------------------------------------------------------------
  {
    id: "denials-corrections",
    number: 8,
    title: "Claims denials and corrections",
    summary: "Reading a denial, and choosing between a corrected claim, reprocessing, reconsideration and an appeal.",
    explanation: [
      {
        type: "table",
        caption: "Common denial reasons and the usual path (general concepts)",
        headers: ["Denial type", "Typical cause", "Usual first path"],
        rows: [
          ["Missing information", "Records, accident or other-coverage details not received", "Get the information to the plan"],
          ["Authorization", "Not obtained, or obtained but not linked/matching", "Verify; if obtained, request reprocessing with the auth linked"],
          ["Coding", "Wrong or mismatched CPT/ICD-10", "Provider sends a corrected claim"],
          ["Medical necessity", "Plan decided the service wasn't necessary for the diagnosis", "Additional documentation / appeal"],
          ["Network", "Processed at the wrong network level", "Verify network status on the date of service; request reprocessing"],
          ["Duplicate", "Same service submitted twice", "Find the original claim; nothing to fix if it was processed"],
          ["Not covered / excluded", "Service is outside the plan's benefits", "Explain clearly; appeal only if there's a reason the rule doesn't apply"],
          ["Eligibility", "Coverage not active on the date of service", "Verify eligibility dates"],
        ],
      },
      { type: "callout", tone: "key", text: "Correction vs. appeal: an error (in submission, coding, linking or processing) is fixed by a corrected claim or reprocessing. An appeal (or reconsideration) disputes a decision the plan made correctly on the information it had, usually with added documentation." },
      { type: "p", text: "Responsibility matters: some denials are provider liability (e.g. failing a contractual requirement), others member liability. The EOB remark is the first place to look." },
      { type: "callout", tone: "warn", text: "Remote Health USA appeals: no official appeals procedure, deadline or level structure is in the knowledge base yet. The benefits overview defers full terms to the Summary Plan Description. Never quote appeal deadlines or steps until the SPD is added as a source." },
      { type: "rules", ruleIds: ["rhus.structure.spd_governs", "rhus.structure.bywater_tpa"] },
    ],
    example: {
      title: "Choosing the path (fictional)",
      blocks: [
        {
          type: "table",
          source: fictional,
          headers: ["Situation", "Path"],
          rows: [
            ["Denied 'no auth on file', but an approved, matching authorization exists", "Reprocess with the authorization linked, or the provider sends a corrected claim"],
            ["Denied for medical necessity; the doctor has notes showing failed conservative treatment", "Appeal / reconsideration with documentation"],
            ["Second claim denied as a duplicate; the first was paid", "No action on the claim. Explain to the member."],
            ["Processed as out of network, but the provider was in the network on that date", "Request reprocessing with network verification"],
          ],
        },
      ],
    },
    whatToLookFor: [
      "The exact denial or remark code, and its text.",
      "Who is liable for the denied amount: member or provider?",
      "Is there an error to correct, or a decision to dispute?",
      "What evidence exists (authorization, records, network status)?",
      "Has a corrected claim or reprocessing already happened? Check for a newer EOB.",
    ],
    exercise: {
      prompt: "A claim was denied as a duplicate. The member is worried they'll have to pay. You find an earlier claim for the same service, date and provider that was paid with $0 member responsibility. What do you tell the member?",
      options: [
        { id: "a", label: "File an appeal immediately" },
        { id: "b", label: "The denial is expected: the original claim was already processed and paid, with nothing owed by you on it" },
        { id: "c", label: "The provider will refund you" },
        { id: "d", label: "You owe the amount on the duplicate claim" },
      ],
      correctOptionIds: ["b"],
      answer: "The duplicate denial is expected. The original claim was paid and shows $0 owed.",
      explanation:
        "Duplicate denials stop double payment. They don't mean the service went unpaid. Point the member to the original EOB, and ask them to send you any bill that doesn't match it.",
    },
    relatedConcepts: ["denial", "claim-correction", "appeal", "authorization-linking", "coding-error", "duplicate-claim", "medical-necessity"],
    planRules: ["rhus.structure.spd_governs", "rhus.structure.bywater_tpa"],
  },

  // 9 -----------------------------------------------------------------------
  {
    id: "member-communication",
    number: 9,
    title: "Explaining it to the member",
    summary: "Turning claim reasoning into a short, accurate, plain-English message.",
    explanation: [
      {
        type: "list",
        items: [
          "Acknowledge frustration in one genuine sentence.",
          "Explain what happened in plain English.",
          "Translate jargon: 'pre-approval' rather than 'prior authorization', and 'what you owe' rather than 'member responsibility'.",
          "Separate what you know from what you're still checking.",
          "Don't promise coverage or guarantee reimbursement or outcomes you don't control.",
          "Say what you'll do (ownership) and who you're coordinating with.",
          "Give the member a clear next step and say when they'll hear back.",
        ],
      },
      { type: "callout", tone: "key", text: "Pattern: empathy → what we found → what it means for you → what I'm doing → what you should do → when you'll hear back." },
    ],
    example: {
      title: "Before and after (fictional)",
      blocks: [
        { type: "callout", tone: "warn", source: fictional, text: "Before: 'Your claim denied PA01 no auth. Auth 077134 is approved so it's a processing error. You won't owe anything, it will be fixed.'" },
        { type: "callout", tone: "key", source: fictional, text: "After: 'I'm sorry about the surprise bill, I can see why it's worrying. Your scan was pre-approved, but the claim was processed as if it wasn't, which looks like a processing issue. Your statement from the plan shows you owe $0 right now, so please hold off on paying the bill. I'm asking for the claim to be reprocessed and I'm contacting the imaging center to pause the bill. I'll update you by Thursday.'" },
      ],
    },
    whatToLookFor: ["Accuracy", "Empathy", "Clarity / plain English", "Ownership", "No unsupported promises", "A clear next step and timeline"],
    exercise: {
      prompt: "Which sentence best avoids an unsupported promise?",
      options: [
        { id: "a", label: "Don't worry, you won't owe anything." },
        { id: "b", label: "This will be fixed by Friday." },
        { id: "c", label: "Your plan statement shows $0 owed right now. I've asked for the claim to be reviewed and I'll confirm the result with you." },
        { id: "d", label: "Insurance always pays for approved scans." },
      ],
      correctOptionIds: ["c"],
      answer: "Option C.",
      explanation: "It states a verifiable fact (the EOB shows $0), says what you're doing, and commits to following up, without guaranteeing an outcome or timing you don't control.",
    },
    relatedConcepts: ["member-communication", "care-coordination"],
    planRules: [],
  },
];

export const lessonById = (id: string) => lessons.find((l) => l.id === id);
