import type { Citation, PlanRule } from "@/domain/plan-knowledge";
import { BENEFITS_OVERVIEW, PUBLIC_PAGE } from "./sources";

/**
 * Remote Health USA plan rules (non-benefit-row rules; benefit rows live in benefits.ts and
 * pre-authorization list items in preauth.ts — both are also exposed as rules).
 *
 * Quotes are verbatim from the source extracts in docs/plan-sources/. Where a quote spans
 * two-column layout breaks, segments are joined with " … ". A test verifies every segment
 * appears in the extract of the cited page.
 */

export const bo = (page: number, section: string, quote: string): Citation => ({ sourceId: BENEFITS_OVERVIEW, page, section, quote });
export const pp = (section: string, quote: string): Citation => ({ sourceId: PUBLIC_PAGE, section, quote });

export const rhusRules: PlanRule[] = [
  // -------------------------------------------------------------------------
  // Plan structure
  // -------------------------------------------------------------------------
  {
    id: "rhus.structure.self_funded_erisa",
    section: "plan_structure",
    topic: "What Remote Health USA is",
    statement:
      "Remote Health USA is offered as employer-sponsored, self-funded health plans under ERISA, with integrated medical stop-loss coverage. The source states these are not traditional insurance plans.",
    citations: [
      pp(
        "Legal disclosure (page footer)",
        "This program offers employer-sponsored, self-funded health plans pursuant to the Employee Retirement Income Security Act of 1974 (ERISA), with integrated medical stop-loss coverage. These are not traditional insurance plans.",
      ),
    ],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.structure.stop_loss",
    section: "plan_structure",
    topic: "Stop-loss coverage",
    statement:
      "The stop-loss insurance protects only the plan sponsor's (employer's) financial obligations, not individual employees. It is underwritten by Roundstone.",
    citations: [
      pp(
        "Legal disclosure (page footer)",
        "The stop-loss insurance only protects the plan sponsor's financial obligations, not individual employees, and is underwritten by Roundstone (CA Lic. No. 0H65130).",
      ),
    ],
    status: "confirmed",
    confidence: "high",
    note: "Stop-loss is not member coverage. Members should never be told that a stop-loss carrier pays their claims.",
  },
  {
    id: "rhus.structure.bywater_tpa",
    section: "plan_structure",
    topic: "Role of Bywater",
    statement: "Claims and plan administration are handled by Bywater, a licensed third-party administrator (TPA).",
    citations: [pp("Legal disclosure (page footer)", "Claims and plan administration are handled by Bywater (CA TPA No. 6003851).")],
    status: "confirmed",
    confidence: "high",
    note: "Claims processing, reprocessing and EOBs therefore sit with the administrator (Bywater), not with SafetyWing or Cigna.",
  },
  {
    id: "rhus.structure.safetywing_role",
    section: "plan_structure",
    topic: "Role of SafetyWing",
    statement:
      "SafetyWing is not an insurance company, broker or TPA. It helps employers access the plan setup and provides informational materials, support and plan-design tools. It does not underwrite or administer plans.",
    citations: [
      pp(
        "Legal disclosure (page footer)",
        "SafetyWing is not an insurance company, broker, or TPA. Our role is to help employers access a modern, streamlined setup for offering healthcare benefits to their teams. We provide informational materials, support, and plan design tools, but we do not underwrite or administer plans in any U.S. state or territory.",
      ),
    ],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.structure.cigna_ppo_network",
    section: "plan_structure",
    topic: "Role of Cigna (network)",
    statement: "The plan uses Cigna's PPO network as its provider network, which the page describes as nationwide.",
    citations: [
      pp("Cigna's national network", "Powered by Cigna’s trusted PPO network, with access to care at over 55,000 locations across the U.S."),
      pp("FAQ: Do members have to stay within a network?", "Your plan uses the Cigna PPO network, which includes over 55,000 providers nationwide."),
    ],
    status: "confirmed",
    confidence: "high",
    note: "The sources describe Cigna as the provider NETWORK. They do not say Cigna insures the plan or processes claims (Bywater administers claims). The page says '55,000 locations' in one place and '55,000 providers' in another.",
  },
  {
    id: "rhus.structure.ppo_single_plan",
    section: "plan_structure",
    topic: "PPO structure",
    statement: "Members nationwide are covered under one PPO health plan.",
    citations: [pp("Nationwide coverage", "Cover everyone from coast to coast under one PPO health plan")],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.structure.out_of_network_allowed",
    section: "plan_structure",
    topic: "In-network vs. out-of-network",
    statement: "Members do not have to stay in network, but in-network care is strongly recommended to avoid the deductible and coinsurance.",
    citations: [pp("FAQ: Do members have to stay within a network?", "No, but it’s strongly recommended in order to avoid paying a deductible and coinsurance.")],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.structure.in_network_direct_billing",
    section: "plan_structure",
    topic: "Who files the claim (in-network)",
    statement: "In-network providers bill the plan directly. Members do not need to file claims.",
    citations: [pp("FAQ: Do members have to stay within a network?", "You don’t need to file claims, providers bill the plan directly")],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.structure.out_of_network_claims",
    section: "plan_structure",
    topic: "Who files the claim (out-of-network)",
    statement: "Out-of-network providers may or may not bill the plan directly. If they don't, the member submits a claim for reimbursement.",
    citations: [
      pp(
        "FAQ: Do members have to stay within a network?",
        "The provider may or may not bill the plan directly. If they don’t, you’ll need to submit a claim for reimbursement",
      ),
    ],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.structure.spd_governs",
    section: "plan_structure",
    topic: "Governing document",
    statement:
      "The benefits overview is a friendlier summary of the official Summary Plan Description (SPD). Full terms, the complete exclusions list and specific limitations are in the SPD.",
    citations: [
      bo(15, "General plan exclusions", "This document reflects the coverage in the official Summary Plan Document (SPD) in a friendlier format."),
      bo(11, "General plan exclusions", "For the complete list of non-covered services and specific limitations, please refer to your Summary Plan Description (SPD)."),
      pp("Legal disclosure (page footer)", "Please refer to the official Summary Plan Description (SPD) and stop-loss policy for full terms and details."),
    ],
    status: "confirmed",
    confidence: "high",
    note: "The SPD has not been provided to this lab, so rules here are only as complete as the summary.",
  },
  {
    id: "rhus.structure.medical_necessity",
    section: "plan_structure",
    topic: "Medical necessity and federal standards",
    statement:
      "The plan is designed to cover medically necessary care for illness, injury and prevention, and follows federal standards (ACA / ERISA). Services that are not medically necessary are not covered.",
    citations: [
      bo(
        11,
        "General plan exclusions",
        "Like all major U.S. employer health plans, this one is designed to cover care that is medically necessary for illness, injury, and prevention. It follows the same federal standards (ACA / ERISA) that most corporate plans use.",
      ),
      bo(13, "General plan exclusions", "Medically necessary Services not medically necessary aren't covered."),
    ],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.structure.coverage_limits",
    section: "plan_structure",
    topic: "Lifetime and annual limits",
    statement: "No lifetime or annual coverage limit, in or out of network. Individual benefits can still carry their own limits.",
    citations: [bo(2, "Plan basics", "Lifetime coverage limit Unlimited Unlimited Annual coverage limit Unlimited Unlimited")],
    status: "confirmed",
    confidence: "high",
  },

  // -------------------------------------------------------------------------
  // Eligibility
  // -------------------------------------------------------------------------
  {
    id: "rhus.eligibility.full_time_only",
    section: "eligibility",
    topic: "Full-time employee requirement",
    statement: "The plan covers only full-time employees. Contractors (e.g. 1099) and part-time employees are not eligible.",
    citations: [
      pp(
        "FAQ: Can I cover my contractors or part-time employees?",
        "Not yet. This plan currently only covers full-time employees . Contractors (e.g., 1099) and part-time employees are not eligible for coverage",
      ),
    ],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.eligibility.family_members",
    section: "eligibility",
    topic: "Family members",
    statement: "Unlimited family members can be added.",
    citations: [pp("FAQ: Can family members be added as well?", "Yes, unlimited family members can be added!")],
    status: "confirmed",
    confidence: "high",
    note: "The page also describes employer pricing (capped at 3 members). That is a commercial term, not a member benefit rule.",
  },

  // -------------------------------------------------------------------------
  // Costs and member responsibility
  // -------------------------------------------------------------------------
  {
    id: "rhus.cost.in_network_no_cost_share",
    section: "costs",
    topic: "In-network cost sharing",
    statement: "In network there is no deductible, no coinsurance and no provider copay. The only member cost in network is a $10–$50 prescription copay.",
    citations: [
      pp(
        "FAQ: Are there any deductibles, coinsurance, or co-pays I should know about?",
        "If you stay in-network, there are no deductibles, co-insurance, or provider co-pays. The only exception is a $10-$50 co-pay for prescriptions.",
      ),
      bo(2, "Plan basics", "Individual $0 $1,000 Annual deductible Family $0 $3,500"),
    ],
    status: "confirmed",
    confidence: "high",
    note: "The benefits overview shows most covered in-network services at 100%. Excluded or non-covered services are still not covered.",
  },
  {
    id: "rhus.cost.deductible.in_network",
    section: "costs",
    topic: "In-network deductible",
    statement: "In-network annual deductible: $0 individual / $0 family.",
    citations: [bo(2, "Plan basics", "Individual $0 $1,000 Annual deductible Family $0 $3,500")],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.cost.deductible.out_of_network",
    section: "costs",
    topic: "Out-of-network deductible",
    statement: "Out-of-network annual deductible: $1,000 individual / $3,500 family.",
    citations: [
      bo(2, "Plan basics", "Individual $0 $1,000 Annual deductible Family $0 $3,500"),
      pp("FAQ: Are there any deductibles, coinsurance, or co-pays I should know about?", "For out-of-network services, there is a $1,000 deductible ($3,500 for a family)"),
    ],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.cost.deductible.rules",
    section: "costs",
    topic: "How deductibles accumulate",
    statement:
      "No one pays more than their individual deductible, and each family member contributes toward the family deductible. In-network and out-of-network deductibles are tracked separately. Medical and pharmacy expenses count toward the same deductible.",
    citations: [
      bo(
        2,
        "Plan basics",
        "No person can be required to pay more than their individual deductible amount. Each family member contributes toward the family deductible until it’s met. • Deductible amounts for in-network and out-of-network care are tracked separately and don’t count toward each other. • Your medical and pharmacy expenses both count towards the same deductible.",
      ),
    ],
    status: "confirmed",
    confidence: "high",
    note: "Pharmacy copays are listed as 'No deductible' (p.9), so in practice the pharmacy point mainly matters out of network.",
  },
  {
    id: "rhus.cost.coinsurance.out_of_network",
    section: "costs",
    topic: "Out-of-network coinsurance",
    statement:
      "Most covered out-of-network medical services are paid at 70% after the out-of-network deductible, so the member's coinsurance is up to 30%. Exceptions: emergency services for an emergency medical condition and emergency ambulance are paid at 100% out of network.",
    citations: [
      bo(9, "All other eligible medical expenses", "All other eligible medical expenses In network Out of network 100% 70% after deductible"),
      pp("FAQ: Are there any deductibles, coinsurance, or co-pays I should know about?", "up to 30% co-insurance"),
      bo(3, "In case of emergency", "For emergency medical condition 100% 100%"),
    ],
    status: "confirmed",
    confidence: "high",
    note: "Check the specific benefit row. Some services are 'Not covered' in and out of network.",
  },
  {
    id: "rhus.cost.oop.in_network",
    section: "costs",
    topic: "In-network out-of-pocket limit",
    statement: "In-network out-of-pocket limit: $1,000 single / $3,000 family.",
    citations: [bo(2, "Plan basics", "Single $1,000 $2,000 Out-of-pocket limit Family $3,000 $7,000")],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.cost.oop.in_network_contributors",
    section: "costs",
    topic: "What counts toward the in-network out-of-pocket limit",
    statement: "The source says the only expenses that count toward the in-network out-of-pocket limit are prescription copays or a non-emergency ambulance.",
    citations: [
      bo(
        2,
        "Plan basics",
        "For this plan, the only expenses that contribute to your in-network out-of-pocket limit are prescription co-pays or a non-emergency ambulance.",
      ),
      bo(3, "In case of emergency", "Non-emergency ambulance Not covered Not covered"),
    ],
    status: "needs_clarification",
    confidence: "medium",
    note: "Conflict: p.3 lists non-emergency ambulance as 'Not covered' (except as covered under emergency ambulance), yet p.2 says it contributes to the in-network out-of-pocket limit. Do not build a case on this point until the SPD resolves it.",
  },
  {
    id: "rhus.cost.oop.out_of_network",
    section: "costs",
    topic: "Out-of-network out-of-pocket limit",
    statement: "Out-of-network out-of-pocket limit: $2,000 single / $7,000 family.",
    citations: [
      bo(2, "Plan basics", "Single $1,000 $2,000 Out-of-pocket limit Family $3,000 $7,000"),
      pp("FAQ: Are there any deductibles, coinsurance, or co-pays I should know about?", "$2,000 out-of-pocket maximum ($7,000 for a family)"),
    ],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.cost.oop.rules",
    section: "costs",
    topic: "How the out-of-pocket limit works",
    statement:
      "The out-of-pocket limit includes deductibles, coinsurance and copays (medical and pharmacy). After it is reached, the plan pays 100% of covered costs for the rest of the year. In-network and out-of-network limits are tracked separately.",
    citations: [
      bo(
        2,
        "Plan basics",
        "Your out-of-pocket limit includes everything you pay: deductibles, coinsurance, and copays (for both medical and pharmacy). Your plan pays a set percentage of covered costs until you reach your out-of-pocket limit. After that, it pays 100% of covered costs for the rest of the year.",
      ),
      bo(2, "Plan basics", "In-network and out-of-network out-of-pocket limits are tracked separately."),
    ],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.cost.oop.never_counts",
    section: "costs",
    topic: "Charges that never count toward the limit",
    statement:
      "Two kinds of charges never count toward the out-of-pocket limit and are never covered at 100%: out-of-network charges above what the plan agrees to pay, and services not covered (including pre-authorization penalties).",
    citations: [
      bo(
        2,
        "Plan basics",
        "Some charges never count toward your limit and are never covered at 100%: ▪ Out-of-network charges above what the plan agrees to pay ▪ Services not covered (including pre-authorization penalties)",
      ),
    ],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.cost.balance_billing",
    section: "costs",
    topic: "Balance billing (out-of-network)",
    statement:
      "If an out-of-network provider charges more than what the plan covers (the plan's allowed rate), the member may be billed the difference directly. This is balance billing.",
    citations: [
      bo(12, "General plan exclusions", "Excess charges You may be billed the difference directly if you visit an out-of-network provider and they charge more than what the plan covers."),
      pp("FAQ: Do members have to stay within a network?", "You may also face balance billing if the provider charges above the plan’s allowed rate"),
    ],
    status: "confirmed",
    confidence: "high",
    note: "The sources tie balance billing to out-of-network providers. Federal surprise-billing protections are a general concept, not covered by these sources.",
  },

  // -------------------------------------------------------------------------
  // Pharmacy
  // -------------------------------------------------------------------------
  {
    id: "rhus.rx.retail",
    section: "pharmacy",
    topic: "Retail pharmacy (30-day supply)",
    statement: "Retail pharmacy, 30-day supply: generic $10; preferred brand $30; non-preferred brand $50. No deductible.",
    citations: [
      bo(
        9,
        "Drug type",
        "Retail pharmacy: 30-day supply Generic drug $10 No deductible Brand name drug (preferred) $30 No deductible Brand name drug (non-preferred) $50 No deductible",
      ),
    ],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.rx.preventive",
    section: "pharmacy",
    topic: "Preventive drugs",
    statement: "Preventive drugs (as classified by HHS): no charge.",
    citations: [bo(9, "Drug type", "Preventive drug No charge As classified by HHS")],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.rx.mail_order",
    section: "pharmacy",
    topic: "Mail-order pharmacy (90-day supply)",
    statement: "Mail order, 90-day supply: generic $10; brand $30; non-preferred $50. No deductible.",
    citations: [
      bo(
        9,
        "Drug type",
        "Mail order pharmacy: 90-day supply Generic drug $10 No deductible Brand name drug $30 No deductible Non-preferred drug $50 No deductible",
      ),
    ],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.rx.specialty",
    section: "pharmacy",
    topic: "Specialty drugs (30-day supply)",
    statement: "Specialty drugs, 30-day supply: $50 copay. No deductible.",
    citations: [bo(9, "Drug type", "Specialty drugs: 30-day supply $50 No deductible")],
    status: "confirmed",
    confidence: "high",
    note: "The source doesn't say whether these copays depend on the pharmacy being in network.",
  },

  // -------------------------------------------------------------------------
  // Prior authorization (process rules; the A–T list is in preauth.ts)
  // -------------------------------------------------------------------------
  {
    id: "rhus.pa.provider_usually_requests",
    section: "prior_authorization",
    topic: "Who requests pre-authorization",
    statement:
      "In most cases the in-network provider requests pre-authorization on the member's behalf, especially for hospital stays and surgeries. Some providers call it 'pre-certification'.",
    citations: [
      bo(
        10,
        "Pre-authorization requirements",
        "In most cases, your in-network provider will request pre-authorization on your behalf, especially for hospital stays or surgeries. Some providers may refer to this process as \"pre-certification.\"",
      ),
    ],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.pa.member_must_confirm",
    section: "prior_authorization",
    topic: "Member's responsibility",
    statement:
      "The member is responsible for confirming that a treatment has been pre-authorized. They should check that the provider has obtained, or is obtaining, it before care begins, and contact customer service for help.",
    citations: [
      bo(10, "Pre-authorization requirements", "It is your responsibility to confirm a treatment has been pre-authorized."),
      bo(10, "Pre-authorization requirements", "To avoid this penalty, be sure to double-check that pre-authorization has been requested before care begins."),
      bo(
        10,
        "Instructions",
        "Check that your provider has obtained or … is obtaining pre-authorization for you. If … not, ensure that they start the process as … soon as possible. Get in touch with our … customer service for any assistance.",
      ),
    ],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.pa.penalty",
    section: "prior_authorization",
    topic: "Penalty when pre-authorization isn't obtained",
    statement:
      "If required pre-authorization isn't obtained, the plan reduces covered charges by 10%, up to $500. The source also puts it as: the member may have to pay 10% of the cost, up to $500.",
    citations: [
      bo(10, "Pre-authorization requirements", "If it isn't obtained for whatever reason, you may have to pay 10% of the cost, up to $500."),
      bo(10, "Instructions", "If pre-authorization isn’t done, the plan … reduces covered charges by 10% (up to … $500)."),
    ],
    status: "confirmed",
    confidence: "high",
    note: "The documented consequence is a capped reduction, not a denial of the whole claim. How the administrator shows it on an EOB is not described in the source.",
  },
  {
    id: "rhus.pa.penalty_not_counted",
    section: "prior_authorization",
    topic: "Penalty and accumulators",
    statement: "The pre-authorization penalty does not count toward the deductible or the out-of-pocket maximum.",
    citations: [
      bo(10, "Instructions", "This penalty does not count … toward your deductible or … out-of-pocket maximum."),
      bo(2, "Plan basics", "Services not covered (including pre-authorization penalties)"),
    ],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.pa.emergency_notification",
    section: "prior_authorization",
    topic: "Emergency admissions",
    statement:
      "For an emergency admission for any service on the pre-authorization list, call the number in the source within 24 hours of admission. On a weekend or holiday, call within 72 hours, by the following Monday.",
    citations: [
      bo(
        10,
        "Instructions",
        "If you have an emergency admission for … any of the services below, call 1 (800) … 337-0792 (toll free) within 24 hours of … the admission. On the weekend or a … holiday, call within 72 hours by the … following Monday.",
      ),
    ],
    status: "confirmed",
    confidence: "high",
    note: "The source doesn't say who must make the call (member, family or facility). Treat that as unverified.",
  },

  // -------------------------------------------------------------------------
  // Selected exclusions (claims-relevant; full list is in the SPD)
  // -------------------------------------------------------------------------
  {
    id: "rhus.excl.not_specified",
    section: "exclusions",
    topic: "Not specified as covered",
    statement: "Any service not listed as covered in the plan isn't eligible.",
    citations: [bo(14, "General plan exclusions", "Not specified as covered Any service not listed as covered in the plan isn't eligible.")],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.excl.experimental",
    section: "exclusions",
    topic: "Experimental care",
    statement: "Experimental or unproven treatments, devices or drugs aren't covered.",
    citations: [bo(12, "General plan exclusions", "Experimental care Experimental or unproven treatments, devices, or drugs aren't covered.")],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.excl.cosmetic",
    section: "exclusions",
    topic: "Cosmetic procedures",
    statement: "Cosmetic surgeries such as facelifts, implants or tattoo removal aren't covered.",
    citations: [bo(12, "General plan exclusions", "Cosmetic procedures Cosmetic surgeries like facelifts, implants, or tattoo removal aren't covered")],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.excl.outside_us",
    section: "exclusions",
    topic: "Care outside the U.S.",
    statement: "Medical travel abroad isn't covered unless preapproved as lower cost. The public page lists 'non-emergency care when traveling outside the U.S.' as an exclusion.",
    citations: [
      bo(14, "General plan exclusions", "Outside the U.S. Medical travel abroad isn't covered unless preapproved as lower cost."),
      pp("FAQ: What's covered and what's excluded?", "Non-emergency care when traveling outside the U.S."),
    ],
    status: "confirmed",
    confidence: "medium",
    note: "The two sources word this differently. Emergency care abroad is not addressed in detail. Defer to the SPD.",
  },
  {
    id: "rhus.excl.weekend_admissions",
    section: "exclusions",
    topic: "Weekend admissions",
    statement: "Non-emergency weekend admissions aren't covered unless surgery is within 24 hours.",
    citations: [bo(15, "General plan exclusions", "Weekend admissions Non-emergency weekend admissions aren't covered unless surgery is within 24 hours.")],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.excl.infertility",
    section: "exclusions",
    topic: "Infertility",
    statement:
      "Infertility treatment and procedures are not covered (e.g. IVF, donor eggs, surrogacy unless specifically listed). Testing, diagnosis and treatment of the underlying cause is covered.",
    citations: [
      bo(8, "Reproductive health", "Infertility treatment and procedures Not covered Not covered"),
      bo(13, "General plan exclusions", "Infertility Treatments like IVF, donor eggs, or surrogacy aren't covered unless specifically listed."),
    ],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.excl.workers_comp",
    section: "exclusions",
    topic: "Work-related injuries",
    statement:
      "Injuries covered by workers' compensation or similar laws, and injuries or illnesses arising out of employment or self-employment, aren't covered.",
    citations: [
      bo(15, "General plan exclusions", "Worker's compensation Injuries covered by workers' compensation or similar laws aren't covered."),
      bo(15, "General plan exclusions", "Wage or profit Injuries or illnesses that arise out of employment or self-employment are"),
    ],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.excl.coverage_dates",
    section: "exclusions",
    topic: "Coverage dates",
    statement: "Care received before coverage begins or after it ends isn't covered.",
    citations: [
      bo(14, "General plan exclusions", "Prior to effective date Care received before your coverage begins isn't covered."),
      bo(11, "General plan exclusions", "After coverage ends Care received after your coverage terminates isn't covered."),
    ],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.excl.admin_fees",
    section: "exclusions",
    topic: "Administrative fees and missed appointments",
    statement: "Fees for claim forms, shipping or handling aren't covered, and neither are fees for missed appointments.",
    citations: [
      bo(11, "General plan exclusions", "Administrative services Fees for claim forms, shipping, or handling aren't covered."),
      bo(13, "General plan exclusions", "Missed appointments Fees for missed appointments aren't covered."),
    ],
    status: "confirmed",
    confidence: "high",
  },
  {
    id: "rhus.excl.plan_maximums",
    section: "exclusions",
    topic: "Plan maximums",
    statement: "Costs above plan limits aren't covered.",
    citations: [bo(14, "General plan exclusions", "Plan maximums Costs above plan limits aren't covered.")],
    status: "confirmed",
    confidence: "high",
    note: "Applies to benefits with visit, day or dollar limits (e.g. acupuncture 20 visits, hearing aids up to $4,000).",
  },
  {
    id: "rhus.excl.maintenance_therapy",
    section: "exclusions",
    topic: "Maintenance therapy",
    statement: "Ongoing therapy after the maximum level of improvement is reached isn't covered.",
    citations: [bo(13, "General plan exclusions", "Maintenance therapy Ongoing therapy after the maximum level of improvement is reached isn't covered.")],
    status: "confirmed",
    confidence: "high",
  },

  // -------------------------------------------------------------------------
  // Add-ons
  // -------------------------------------------------------------------------
  {
    id: "rhus.addons.dental_vision",
    section: "add_ons",
    topic: "Dental and vision add-ons",
    statement:
      "Dental and vision add-ons are available only if the employer allowed members to select them during open enrollment. Add-on coverage may differ between family members.",
    citations: [
      bo(
        16,
        "Add-ons",
        "The add-ons listed below are only available if your employer allowed you to select them during open enrollment. Add-on coverage may vary between you and your family members.",
      ),
    ],
    status: "confirmed",
    confidence: "high",
    note: "Add-on benefit details (pp.16–21) are not modelled yet.",
  },
];
