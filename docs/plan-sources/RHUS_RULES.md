# Remote Health USA: plan rules register

> Generated from `src/content/plan-knowledge/`. Do not edit by hand. Run `npm run kb:docs`.

## Sources

| Id | Title | Authority | Version | URL | Accessed | Local extract |
|---|---|---|---|---|---|---|
| `rhus-benefits-overview-2025-12-16` | Remote Health USA — Benefits overview | benefits_overview | RH USA benefits synopsis Full_2025-12-16 | https://safetywing.com/api/policy/113 | 2026-10-03 | `docs/plan-sources/rhus-benefits-overview-2025-12-16.extract.txt` |
| `rhus-public-page-2026-10-03` | Remote Health USA public plan page | public_page | Live web page (no version string) | https://safetywing.com/remote-health-us | 2026-10-03 | `docs/plan-sources/rhus-public-page-2026-10-03.extract.txt` |

Totals: 130 rules (9 need clarification), 65 benefit entries, 20 pre-authorization list items.

## plan_structure

### `rhus.structure.self_funded_erisa` · What Remote Health USA is

**Rule:** Remote Health USA is offered as employer-sponsored, self-funded health plans under ERISA, with integrated medical stop-loss coverage. The source states these are not traditional insurance plans.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA public plan page (Live web page (no version string)) · https://safetywing.com/remote-health-us · section "Legal disclosure (page footer)" · accessed 2026-10-03
  > This program offers employer-sponsored, self-funded health plans pursuant to the Employee Retirement Income Security Act of 1974 (ERISA), with integrated medical stop-loss coverage. These are not traditional insurance plans.

### `rhus.structure.stop_loss` · Stop-loss coverage

**Rule:** The stop-loss insurance protects only the plan sponsor's (employer's) financial obligations, not individual employees. It is underwritten by Roundstone.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA public plan page (Live web page (no version string)) · https://safetywing.com/remote-health-us · section "Legal disclosure (page footer)" · accessed 2026-10-03
  > The stop-loss insurance only protects the plan sponsor's financial obligations, not individual employees, and is underwritten by Roundstone (CA Lic. No. 0H65130).
- **Note:** Stop-loss is not member coverage. Members should never be told that a stop-loss carrier pays their claims.

### `rhus.structure.bywater_tpa` · Role of Bywater

**Rule:** Claims and plan administration are handled by Bywater, a licensed third-party administrator (TPA).

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA public plan page (Live web page (no version string)) · https://safetywing.com/remote-health-us · section "Legal disclosure (page footer)" · accessed 2026-10-03
  > Claims and plan administration are handled by Bywater (CA TPA No. 6003851).
- **Note:** Claims processing, reprocessing and EOBs therefore sit with the administrator (Bywater), not with SafetyWing or Cigna.

### `rhus.structure.safetywing_role` · Role of SafetyWing

**Rule:** SafetyWing is not an insurance company, broker or TPA. It helps employers access the plan setup and provides informational materials, support and plan-design tools. It does not underwrite or administer plans.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA public plan page (Live web page (no version string)) · https://safetywing.com/remote-health-us · section "Legal disclosure (page footer)" · accessed 2026-10-03
  > SafetyWing is not an insurance company, broker, or TPA. Our role is to help employers access a modern, streamlined setup for offering healthcare benefits to their teams. We provide informational materials, support, and plan design tools, but we do not underwrite or administer plans in any U.S. state or territory.

### `rhus.structure.cigna_ppo_network` · Role of Cigna (network)

**Rule:** The plan uses Cigna's PPO network as its provider network, which the page describes as nationwide.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA public plan page (Live web page (no version string)) · https://safetywing.com/remote-health-us · section "Cigna's national network" · accessed 2026-10-03
  > Powered by Cigna’s trusted PPO network, with access to care at over 55,000 locations across the U.S.
- **Source:** Remote Health USA public plan page (Live web page (no version string)) · https://safetywing.com/remote-health-us · section "FAQ: Do members have to stay within a network?" · accessed 2026-10-03
  > Your plan uses the Cigna PPO network, which includes over 55,000 providers nationwide.
- **Note:** The sources describe Cigna as the provider NETWORK. They do not say Cigna insures the plan or processes claims (Bywater administers claims). The page says '55,000 locations' in one place and '55,000 providers' in another.

### `rhus.structure.ppo_single_plan` · PPO structure

**Rule:** Members nationwide are covered under one PPO health plan.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA public plan page (Live web page (no version string)) · https://safetywing.com/remote-health-us · section "Nationwide coverage" · accessed 2026-10-03
  > Cover everyone from coast to coast under one PPO health plan

### `rhus.structure.out_of_network_allowed` · In-network vs. out-of-network

**Rule:** Members do not have to stay in network, but in-network care is strongly recommended to avoid the deductible and coinsurance.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA public plan page (Live web page (no version string)) · https://safetywing.com/remote-health-us · section "FAQ: Do members have to stay within a network?" · accessed 2026-10-03
  > No, but it’s strongly recommended in order to avoid paying a deductible and coinsurance.

### `rhus.structure.in_network_direct_billing` · Who files the claim (in-network)

**Rule:** In-network providers bill the plan directly. Members do not need to file claims.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA public plan page (Live web page (no version string)) · https://safetywing.com/remote-health-us · section "FAQ: Do members have to stay within a network?" · accessed 2026-10-03
  > You don’t need to file claims, providers bill the plan directly

### `rhus.structure.out_of_network_claims` · Who files the claim (out-of-network)

**Rule:** Out-of-network providers may or may not bill the plan directly. If they don't, the member submits a claim for reimbursement.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA public plan page (Live web page (no version string)) · https://safetywing.com/remote-health-us · section "FAQ: Do members have to stay within a network?" · accessed 2026-10-03
  > The provider may or may not bill the plan directly. If they don’t, you’ll need to submit a claim for reimbursement

### `rhus.structure.spd_governs` · Governing document

**Rule:** The benefits overview is a friendlier summary of the official Summary Plan Description (SPD). Full terms, the complete exclusions list and specific limitations are in the SPD.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 15 · section "General plan exclusions" · accessed 2026-10-03
  > This document reflects the coverage in the official Summary Plan Document (SPD) in a friendlier format.
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 11 · section "General plan exclusions" · accessed 2026-10-03
  > For the complete list of non-covered services and specific limitations, please refer to your Summary Plan Description (SPD).
- **Source:** Remote Health USA public plan page (Live web page (no version string)) · https://safetywing.com/remote-health-us · section "Legal disclosure (page footer)" · accessed 2026-10-03
  > Please refer to the official Summary Plan Description (SPD) and stop-loss policy for full terms and details.
- **Note:** The SPD has not been provided to this lab, so rules here are only as complete as the summary.

### `rhus.structure.medical_necessity` · Medical necessity and federal standards

**Rule:** The plan is designed to cover medically necessary care for illness, injury and prevention, and follows federal standards (ACA / ERISA). Services that are not medically necessary are not covered.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 11 · section "General plan exclusions" · accessed 2026-10-03
  > Like all major U.S. employer health plans, this one is designed to cover care that is medically necessary for illness, injury, and prevention. It follows the same federal standards (ACA / ERISA) that most corporate plans use.
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 13 · section "General plan exclusions" · accessed 2026-10-03
  > Medically necessary Services not medically necessary aren't covered.

### `rhus.structure.coverage_limits` · Lifetime and annual limits

**Rule:** No lifetime or annual coverage limit, in or out of network. Individual benefits can still carry their own limits.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 2 · section "Plan basics" · accessed 2026-10-03
  > Lifetime coverage limit Unlimited Unlimited Annual coverage limit Unlimited Unlimited

## eligibility

### `rhus.eligibility.full_time_only` · Full-time employee requirement

**Rule:** The plan covers only full-time employees. Contractors (e.g. 1099) and part-time employees are not eligible.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA public plan page (Live web page (no version string)) · https://safetywing.com/remote-health-us · section "FAQ: Can I cover my contractors or part-time employees?" · accessed 2026-10-03
  > Not yet. This plan currently only covers full-time employees . Contractors (e.g., 1099) and part-time employees are not eligible for coverage

### `rhus.eligibility.family_members` · Family members

**Rule:** Unlimited family members can be added.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA public plan page (Live web page (no version string)) · https://safetywing.com/remote-health-us · section "FAQ: Can family members be added as well?" · accessed 2026-10-03
  > Yes, unlimited family members can be added!
- **Note:** The page also describes employer pricing (capped at 3 members). That is a commercial term, not a member benefit rule.

## costs

### `rhus.cost.in_network_no_cost_share` · In-network cost sharing

**Rule:** In network there is no deductible, no coinsurance and no provider copay. The only member cost in network is a $10–$50 prescription copay.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA public plan page (Live web page (no version string)) · https://safetywing.com/remote-health-us · section "FAQ: Are there any deductibles, coinsurance, or co-pays I should know about?" · accessed 2026-10-03
  > If you stay in-network, there are no deductibles, co-insurance, or provider co-pays. The only exception is a $10-$50 co-pay for prescriptions.
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 2 · section "Plan basics" · accessed 2026-10-03
  > Individual $0 $1,000 Annual deductible Family $0 $3,500
- **Note:** The benefits overview shows most covered in-network services at 100%. Excluded or non-covered services are still not covered.

### `rhus.cost.deductible.in_network` · In-network deductible

**Rule:** In-network annual deductible: $0 individual / $0 family.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 2 · section "Plan basics" · accessed 2026-10-03
  > Individual $0 $1,000 Annual deductible Family $0 $3,500

### `rhus.cost.deductible.out_of_network` · Out-of-network deductible

**Rule:** Out-of-network annual deductible: $1,000 individual / $3,500 family.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 2 · section "Plan basics" · accessed 2026-10-03
  > Individual $0 $1,000 Annual deductible Family $0 $3,500
- **Source:** Remote Health USA public plan page (Live web page (no version string)) · https://safetywing.com/remote-health-us · section "FAQ: Are there any deductibles, coinsurance, or co-pays I should know about?" · accessed 2026-10-03
  > For out-of-network services, there is a $1,000 deductible ($3,500 for a family)

### `rhus.cost.deductible.rules` · How deductibles accumulate

**Rule:** No one pays more than their individual deductible, and each family member contributes toward the family deductible. In-network and out-of-network deductibles are tracked separately. Medical and pharmacy expenses count toward the same deductible.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 2 · section "Plan basics" · accessed 2026-10-03
  > No person can be required to pay more than their individual deductible amount. Each family member contributes toward the family deductible until it’s met. • Deductible amounts for in-network and out-of-network care are tracked separately and don’t count toward each other. • Your medical and pharmacy expenses both count towards the same deductible.
- **Note:** Pharmacy copays are listed as 'No deductible' (p.9), so in practice the pharmacy point mainly matters out of network.

### `rhus.cost.coinsurance.out_of_network` · Out-of-network coinsurance

**Rule:** Most covered out-of-network medical services are paid at 70% after the out-of-network deductible, so the member's coinsurance is up to 30%. Exceptions: emergency services for an emergency medical condition and emergency ambulance are paid at 100% out of network.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 9 · section "All other eligible medical expenses" · accessed 2026-10-03
  > All other eligible medical expenses In network Out of network 100% 70% after deductible
- **Source:** Remote Health USA public plan page (Live web page (no version string)) · https://safetywing.com/remote-health-us · section "FAQ: Are there any deductibles, coinsurance, or co-pays I should know about?" · accessed 2026-10-03
  > up to 30% co-insurance
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 3 · section "In case of emergency" · accessed 2026-10-03
  > For emergency medical condition 100% 100%
- **Note:** Check the specific benefit row. Some services are 'Not covered' in and out of network.

### `rhus.cost.oop.in_network` · In-network out-of-pocket limit

**Rule:** In-network out-of-pocket limit: $1,000 single / $3,000 family.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 2 · section "Plan basics" · accessed 2026-10-03
  > Single $1,000 $2,000 Out-of-pocket limit Family $3,000 $7,000

### `rhus.cost.oop.in_network_contributors` · What counts toward the in-network out-of-pocket limit

**Rule:** The source says the only expenses that count toward the in-network out-of-pocket limit are prescription copays or a non-emergency ambulance.

- **Status / confidence:** needs_clarification / medium
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 2 · section "Plan basics" · accessed 2026-10-03
  > For this plan, the only expenses that contribute to your in-network out-of-pocket limit are prescription co-pays or a non-emergency ambulance.
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 3 · section "In case of emergency" · accessed 2026-10-03
  > Non-emergency ambulance Not covered Not covered
- **Note:** Conflict: p.3 lists non-emergency ambulance as 'Not covered' (except as covered under emergency ambulance), yet p.2 says it contributes to the in-network out-of-pocket limit. Do not build a case on this point until the SPD resolves it.

### `rhus.cost.oop.out_of_network` · Out-of-network out-of-pocket limit

**Rule:** Out-of-network out-of-pocket limit: $2,000 single / $7,000 family.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 2 · section "Plan basics" · accessed 2026-10-03
  > Single $1,000 $2,000 Out-of-pocket limit Family $3,000 $7,000
- **Source:** Remote Health USA public plan page (Live web page (no version string)) · https://safetywing.com/remote-health-us · section "FAQ: Are there any deductibles, coinsurance, or co-pays I should know about?" · accessed 2026-10-03
  > $2,000 out-of-pocket maximum ($7,000 for a family)

### `rhus.cost.oop.rules` · How the out-of-pocket limit works

**Rule:** The out-of-pocket limit includes deductibles, coinsurance and copays (medical and pharmacy). After it is reached, the plan pays 100% of covered costs for the rest of the year. In-network and out-of-network limits are tracked separately.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 2 · section "Plan basics" · accessed 2026-10-03
  > Your out-of-pocket limit includes everything you pay: deductibles, coinsurance, and copays (for both medical and pharmacy). Your plan pays a set percentage of covered costs until you reach your out-of-pocket limit. After that, it pays 100% of covered costs for the rest of the year.
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 2 · section "Plan basics" · accessed 2026-10-03
  > In-network and out-of-network out-of-pocket limits are tracked separately.

### `rhus.cost.oop.never_counts` · Charges that never count toward the limit

**Rule:** Two kinds of charges never count toward the out-of-pocket limit and are never covered at 100%: out-of-network charges above what the plan agrees to pay, and services not covered (including pre-authorization penalties).

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 2 · section "Plan basics" · accessed 2026-10-03
  > Some charges never count toward your limit and are never covered at 100%: ▪ Out-of-network charges above what the plan agrees to pay ▪ Services not covered (including pre-authorization penalties)

### `rhus.cost.balance_billing` · Balance billing (out-of-network)

**Rule:** If an out-of-network provider charges more than what the plan covers (the plan's allowed rate), the member may be billed the difference directly. This is balance billing.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 12 · section "General plan exclusions" · accessed 2026-10-03
  > Excess charges You may be billed the difference directly if you visit an out-of-network provider and they charge more than what the plan covers.
- **Source:** Remote Health USA public plan page (Live web page (no version string)) · https://safetywing.com/remote-health-us · section "FAQ: Do members have to stay within a network?" · accessed 2026-10-03
  > You may also face balance billing if the provider charges above the plan’s allowed rate
- **Note:** The sources tie balance billing to out-of-network providers. Federal surprise-billing protections are a general concept, not covered by these sources.

## pharmacy

### `rhus.rx.retail` · Retail pharmacy (30-day supply)

**Rule:** Retail pharmacy, 30-day supply: generic $10; preferred brand $30; non-preferred brand $50. No deductible.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 9 · section "Drug type" · accessed 2026-10-03
  > Retail pharmacy: 30-day supply Generic drug $10 No deductible Brand name drug (preferred) $30 No deductible Brand name drug (non-preferred) $50 No deductible

### `rhus.rx.preventive` · Preventive drugs

**Rule:** Preventive drugs (as classified by HHS): no charge.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 9 · section "Drug type" · accessed 2026-10-03
  > Preventive drug No charge As classified by HHS

### `rhus.rx.mail_order` · Mail-order pharmacy (90-day supply)

**Rule:** Mail order, 90-day supply: generic $10; brand $30; non-preferred $50. No deductible.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 9 · section "Drug type" · accessed 2026-10-03
  > Mail order pharmacy: 90-day supply Generic drug $10 No deductible Brand name drug $30 No deductible Non-preferred drug $50 No deductible

### `rhus.rx.specialty` · Specialty drugs (30-day supply)

**Rule:** Specialty drugs, 30-day supply: $50 copay. No deductible.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 9 · section "Drug type" · accessed 2026-10-03
  > Specialty drugs: 30-day supply $50 No deductible
- **Note:** The source doesn't say whether these copays depend on the pharmacy being in network.

### `rhus.benefit.pharmacy_retail` · Prescriptions: retail pharmacy (30-day supply)

**Rule:** Prescriptions: retail pharmacy (30-day supply): Generic $10 · Preferred brand $30 · Non-preferred brand $50 · No deductible; no pre-authorization requirement stated.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 9 · section "Drug type" · accessed 2026-10-03
  > Retail pharmacy: 30-day supply Generic drug $10 No deductible Brand name drug (preferred) $30 No deductible Brand name drug (non-preferred) $50 No deductible
- **Note:** Network status for pharmacy is not stated in the source.

### `rhus.benefit.pharmacy_mail_order` · Prescriptions: mail order (90-day supply)

**Rule:** Prescriptions: mail order (90-day supply): Generic $10 · Brand $30 · Non-preferred $50 · No deductible; no pre-authorization requirement stated.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 9 · section "Drug type" · accessed 2026-10-03
  > Mail order pharmacy: 90-day supply Generic drug $10 No deductible Brand name drug $30 No deductible Non-preferred drug $50 No deductible

### `rhus.benefit.pharmacy_specialty` · Prescriptions: specialty drugs (30-day supply)

**Rule:** Prescriptions: specialty drugs (30-day supply): $50 · No deductible; no pre-authorization requirement stated.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 9 · section "Drug type" · accessed 2026-10-03
  > Specialty drugs: 30-day supply $50 No deductible

### `rhus.benefit.pharmacy_preventive` · Prescriptions: preventive drugs

**Rule:** Prescriptions: preventive drugs: No charge (as classified by HHS); no pre-authorization requirement stated.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 9 · section "Drug type" · accessed 2026-10-03
  > Preventive drug No charge As classified by HHS

## prior_authorization

### `rhus.pa.provider_usually_requests` · Who requests pre-authorization

**Rule:** In most cases the in-network provider requests pre-authorization on the member's behalf, especially for hospital stays and surgeries. Some providers call it 'pre-certification'.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Pre-authorization requirements" · accessed 2026-10-03
  > In most cases, your in-network provider will request pre-authorization on your behalf, especially for hospital stays or surgeries. Some providers may refer to this process as "pre-certification."

### `rhus.pa.member_must_confirm` · Member's responsibility

**Rule:** The member is responsible for confirming that a treatment has been pre-authorized. They should check that the provider has obtained, or is obtaining, it before care begins, and contact customer service for help.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Pre-authorization requirements" · accessed 2026-10-03
  > It is your responsibility to confirm a treatment has been pre-authorized.
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Pre-authorization requirements" · accessed 2026-10-03
  > To avoid this penalty, be sure to double-check that pre-authorization has been requested before care begins.
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Instructions" · accessed 2026-10-03
  > Check that your provider has obtained or … is obtaining pre-authorization for you. If … not, ensure that they start the process as … soon as possible. Get in touch with our … customer service for any assistance.

### `rhus.pa.penalty` · Penalty when pre-authorization isn't obtained

**Rule:** If required pre-authorization isn't obtained, the plan reduces covered charges by 10%, up to $500. The source also puts it as: the member may have to pay 10% of the cost, up to $500.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Pre-authorization requirements" · accessed 2026-10-03
  > If it isn't obtained for whatever reason, you may have to pay 10% of the cost, up to $500.
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Instructions" · accessed 2026-10-03
  > If pre-authorization isn’t done, the plan … reduces covered charges by 10% (up to … $500).
- **Note:** The documented consequence is a capped reduction, not a denial of the whole claim. How the administrator shows it on an EOB is not described in the source.

### `rhus.pa.penalty_not_counted` · Penalty and accumulators

**Rule:** The pre-authorization penalty does not count toward the deductible or the out-of-pocket maximum.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Instructions" · accessed 2026-10-03
  > This penalty does not count … toward your deductible or … out-of-pocket maximum.
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 2 · section "Plan basics" · accessed 2026-10-03
  > Services not covered (including pre-authorization penalties)

### `rhus.pa.emergency_notification` · Emergency admissions

**Rule:** For an emergency admission for any service on the pre-authorization list, call the number in the source within 24 hours of admission. On a weekend or holiday, call within 72 hours, by the following Monday.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Instructions" · accessed 2026-10-03
  > If you have an emergency admission for … any of the services below, call 1 (800) … 337-0792 (toll free) within 24 hours of … the admission. On the weekend or a … holiday, call within 72 hours by the … following Monday.
- **Note:** The source doesn't say who must make the call (member, family or facility). Treat that as unverified.

### `rhus.pa.list.a` · Pre-authorization list A

**Rule:** Pre-authorization is required for: Inpatient admissions (hospital, rehab, skilled nursing, extended care, mental health/substance use disorder).

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Services requiring pre-authorization" · accessed 2026-10-03
  > A. Inpatient admissions (hospital, rehab, skilled … nursing, extended care, mental health/substance … use disorder)

### `rhus.pa.list.b` · Pre-authorization list B

**Rule:** Pre-authorization is required for: Transplants.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Services requiring pre-authorization" · accessed 2026-10-03
  > B. Transplants

### `rhus.pa.list.c` · Pre-authorization list C

**Rule:** Pre-authorization is required for: Hospital stays over 48 hours.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Services requiring pre-authorization" · accessed 2026-10-03
  > C. Hospital stays over 48 hours

### `rhus.pa.list.d` · Pre-authorization list D

**Rule:** Pre-authorization is required for: Dialysis.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Services requiring pre-authorization" · accessed 2026-10-03
  > D. Dialysis

### `rhus.pa.list.e` · Pre-authorization list E

**Rule:** Pre-authorization is required for: Chemotherapy, radiation therapy.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Services requiring pre-authorization" · accessed 2026-10-03
  > E. Chemotherapy, radiation therapy

### `rhus.pa.list.f` · Pre-authorization list F

**Rule:** Pre-authorization is required for: Reconstructive or spinal surgery.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Services requiring pre-authorization" · accessed 2026-10-03
  > F. Reconstructive or spinal surgery

### `rhus.pa.list.g` · Pre-authorization list G

**Rule:** Pre-authorization is required for: Hyperbaric oxygen treatments.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Services requiring pre-authorization" · accessed 2026-10-03
  > G. Hyperbaric oxygen treatments

### `rhus.pa.list.h` · Pre-authorization list H

**Rule:** Pre-authorization is required for: Durable medical equipment (over 30-day rental or purchase) and insulin pumps.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Services requiring pre-authorization" · accessed 2026-10-03
  > H. Durable medical equipment (over 30-day rental or … purchase) and insulin pumps

### `rhus.pa.list.i` · Pre-authorization list I

**Rule:** Pre-authorization is required for: Substance use disorder programs (outpatient).

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Services requiring pre-authorization" · accessed 2026-10-03
  > I. Substance use disorder programs (outpatient)

### `rhus.pa.list.j` · Pre-authorization list J

**Rule:** Pre-authorization is required for: Outpatient surgery, procedures, or private duty nursing.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Services requiring pre-authorization" · accessed 2026-10-03
  > J. Outpatient surgery, procedures, or private duty … nursing

### `rhus.pa.list.k` · Pre-authorization list K

**Rule:** Pre-authorization is required for: Diagnostic testing (MRI/PET/CT).

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Services requiring pre-authorization" · accessed 2026-10-03
  > K. Diagnostic testing (MRI/PET/CT)

### `rhus.pa.list.l` · Pre-authorization list L

**Rule:** Pre-authorization is required for: Infusion services.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Services requiring pre-authorization" · accessed 2026-10-03
  > L. Infusion services

### `rhus.pa.list.m` · Pre-authorization list M

**Rule:** Pre-authorization is required for: Home health care.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Services requiring pre-authorization" · accessed 2026-10-03
  > M. Home health care

### `rhus.pa.list.n` · Pre-authorization list N

**Rule:** Pre-authorization is required for: Genetic testing (e.g., BRACA, BART).

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Services requiring pre-authorization" · accessed 2026-10-03
  > N. Genetic testing (e.g., BRACA, BART)

### `rhus.pa.list.o` · Pre-authorization list O

**Rule:** Pre-authorization is required for: Air/water ambulance.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Services requiring pre-authorization" · accessed 2026-10-03
  > O. Air/water ambulance

### `rhus.pa.list.p` · Pre-authorization list P

**Rule:** Pre-authorization is required for: Hospice care.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Services requiring pre-authorization" · accessed 2026-10-03
  > P. Hospice care

### `rhus.pa.list.q` · Pre-authorization list Q

**Rule:** Pre-authorization is required for: Prosthetics.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Services requiring pre-authorization" · accessed 2026-10-03
  > Q. Prosthetics

### `rhus.pa.list.r` · Pre-authorization list R

**Rule:** Pre-authorization is required for: Injection therapy for pain programs.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Services requiring pre-authorization" · accessed 2026-10-03
  > R. Injection therapy for pain programs

### `rhus.pa.list.s` · Pre-authorization list S

**Rule:** Pre-authorization is required for: Treatment/surgery for morbid obesity.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Services requiring pre-authorization" · accessed 2026-10-03
  > S. Treatment/surgery for morbid obesity

### `rhus.pa.list.t` · Pre-authorization list T

**Rule:** Pre-authorization is required for: Gender dysphoria surgical treatment.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 10 · section "Services requiring pre-authorization" · accessed 2026-10-03
  > T. Gender dysphoria surgical treatment

## exclusions

### `rhus.excl.not_specified` · Not specified as covered

**Rule:** Any service not listed as covered in the plan isn't eligible.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 14 · section "General plan exclusions" · accessed 2026-10-03
  > Not specified as covered Any service not listed as covered in the plan isn't eligible.

### `rhus.excl.experimental` · Experimental care

**Rule:** Experimental or unproven treatments, devices or drugs aren't covered.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 12 · section "General plan exclusions" · accessed 2026-10-03
  > Experimental care Experimental or unproven treatments, devices, or drugs aren't covered.

### `rhus.excl.cosmetic` · Cosmetic procedures

**Rule:** Cosmetic surgeries such as facelifts, implants or tattoo removal aren't covered.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 12 · section "General plan exclusions" · accessed 2026-10-03
  > Cosmetic procedures Cosmetic surgeries like facelifts, implants, or tattoo removal aren't covered

### `rhus.excl.outside_us` · Care outside the U.S.

**Rule:** Medical travel abroad isn't covered unless preapproved as lower cost. The public page lists 'non-emergency care when traveling outside the U.S.' as an exclusion.

- **Status / confidence:** confirmed / medium
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 14 · section "General plan exclusions" · accessed 2026-10-03
  > Outside the U.S. Medical travel abroad isn't covered unless preapproved as lower cost.
- **Source:** Remote Health USA public plan page (Live web page (no version string)) · https://safetywing.com/remote-health-us · section "FAQ: What's covered and what's excluded?" · accessed 2026-10-03
  > Non-emergency care when traveling outside the U.S.
- **Note:** The two sources word this differently. Emergency care abroad is not addressed in detail. Defer to the SPD.

### `rhus.excl.weekend_admissions` · Weekend admissions

**Rule:** Non-emergency weekend admissions aren't covered unless surgery is within 24 hours.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 15 · section "General plan exclusions" · accessed 2026-10-03
  > Weekend admissions Non-emergency weekend admissions aren't covered unless surgery is within 24 hours.

### `rhus.excl.infertility` · Infertility

**Rule:** Infertility treatment and procedures are not covered (e.g. IVF, donor eggs, surrogacy unless specifically listed). Testing, diagnosis and treatment of the underlying cause is covered.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 8 · section "Reproductive health" · accessed 2026-10-03
  > Infertility treatment and procedures Not covered Not covered
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 13 · section "General plan exclusions" · accessed 2026-10-03
  > Infertility Treatments like IVF, donor eggs, or surrogacy aren't covered unless specifically listed.

### `rhus.excl.workers_comp` · Work-related injuries

**Rule:** Injuries covered by workers' compensation or similar laws, and injuries or illnesses arising out of employment or self-employment, aren't covered.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 15 · section "General plan exclusions" · accessed 2026-10-03
  > Worker's compensation Injuries covered by workers' compensation or similar laws aren't covered.
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 15 · section "General plan exclusions" · accessed 2026-10-03
  > Wage or profit Injuries or illnesses that arise out of employment or self-employment are

### `rhus.excl.coverage_dates` · Coverage dates

**Rule:** Care received before coverage begins or after it ends isn't covered.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 14 · section "General plan exclusions" · accessed 2026-10-03
  > Prior to effective date Care received before your coverage begins isn't covered.
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 11 · section "General plan exclusions" · accessed 2026-10-03
  > After coverage ends Care received after your coverage terminates isn't covered.

### `rhus.excl.admin_fees` · Administrative fees and missed appointments

**Rule:** Fees for claim forms, shipping or handling aren't covered, and neither are fees for missed appointments.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 11 · section "General plan exclusions" · accessed 2026-10-03
  > Administrative services Fees for claim forms, shipping, or handling aren't covered.
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 13 · section "General plan exclusions" · accessed 2026-10-03
  > Missed appointments Fees for missed appointments aren't covered.

### `rhus.excl.maintenance_therapy` · Maintenance therapy

**Rule:** Ongoing therapy after the maximum level of improvement is reached isn't covered.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 13 · section "General plan exclusions" · accessed 2026-10-03
  > Maintenance therapy Ongoing therapy after the maximum level of improvement is reached isn't covered.

## add_ons

### `rhus.addons.dental_vision` · Dental and vision add-ons

**Rule:** Dental and vision add-ons are available only if the employer allowed members to select them during open enrollment. Add-on coverage may differ between family members.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 16 · section "Add-ons" · accessed 2026-10-03
  > The add-ons listed below are only available if your employer allowed you to select them during open enrollment. Add-on coverage may vary between you and your family members.
- **Note:** Add-on benefit details (pp.16–21) are not modelled yet.

## benefits

### `rhus.benefit.emergency_services` · Emergency services: emergency medical condition

**Rule:** Emergency services: emergency medical condition: in-network 100%; out-of-network 100%; emergency admission notification applies (Row says 'Pre-authorization required (see pre-authorization section for details)'. That section requires a call within 24 hours of an emergency admission (72 hours on weekends/holidays).).

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 3 · section "In case of emergency" · accessed 2026-10-03
  > For emergency medical condition 100% 100% Pre-authorization required (see pre-authorization section for details)

### `rhus.benefit.emergency_room_non_emergency` · Emergency services: non-emergency medical condition

**Rule:** Emergency services: non-emergency medical condition: in-network 100%; out-of-network 70% after deductible; pre-authorization required (Marked 'Pre-authorization required' in the benefits table but not named on the A–T pre-authorization list.).

- **Status / confidence:** needs_clarification / medium
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 3 · section "In case of emergency" · accessed 2026-10-03
  > For non-emergency medical condition 100% 70% after deductible Pre-authorization required

### `rhus.benefit.ambulance_emergency` · Emergency ambulance

**Rule:** Emergency ambulance: in-network 100%; out-of-network 100%; limit: Up to $25,000 for each air/water ambulance ride; pre-authorization required for part of this benefit (Air/water ambulance requires pre-authorization. Ground ambulance is not listed.).

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 3 · section "In case of emergency" · accessed 2026-10-03
  > Emergency ambulance 100% 100% Up to $25,000 for each air/water ambulance ride, pre-authorization required

### `rhus.benefit.ambulance_non_emergency` · Non-emergency ambulance (water, air, ground)

**Rule:** Non-emergency ambulance (water, air, ground): in-network Not covered; out-of-network Not covered; no pre-authorization requirement stated; Except as covered under emergency ambulance..

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 3 · section "In case of emergency" · accessed 2026-10-03
  > Non-emergency ambulance Not covered Not covered Water, air, ground Except as covered under emergency ambulance
- **Note:** p.2 separately says non-emergency ambulance counts toward the in-network out-of-pocket limit (see rhus.cost.oop.in_network_contributors).

### `rhus.benefit.urgent_care` · Urgent care facility

**Rule:** Urgent care facility: in-network 100%; out-of-network 70% after deductible; pre-authorization required (Marked 'Pre-authorization required' in the benefits table but not named on the A–T pre-authorization list. Pre-authorizing urgent care is unusual, so confirm with the SPD before relying on it.).

- **Status / confidence:** needs_clarification / medium
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 3 · section "In case of emergency" · accessed 2026-10-03
  > Urgent care facility 100% 70% after deductible Pre-authorization required

### `rhus.benefit.hospital_room` · Hospital stay (semi-private room)

**Rule:** Hospital stay (semi-private room): in-network 100%; out-of-network 70% after deductible; pre-authorization required; A private room is covered only if medically necessary. If the hospital only has private rooms, coverage is limited to the lowest private-room rate..

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 3 · section "Hospital charges" · accessed 2026-10-03
  > Semi-private room when hospitalized 100% 70% after deductible A private room is covered only if it's medically Pre-authorization required necessary. If the hospital only has private rooms, coverage is limited to the lowest private room rate.

### `rhus.benefit.physician_services_hospital` · Physician services (hospital charges)

**Rule:** Physician services (hospital charges): in-network 100%; out-of-network 70% after deductible; no pre-authorization requirement stated.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 3 · section "Hospital charges" · accessed 2026-10-03
  > Physician's services 100% 70% after deductible

### `rhus.benefit.icu` · Intensive care unit

**Rule:** Intensive care unit: in-network 100%; out-of-network 70% after deductible; pre-authorization required; The plan pays the ICU rate..

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 4 · section "Hospital charges" · accessed 2026-10-03
  > Intensive care unit 100% 70% after deductible This plan pays the ICU rate Pre-authorization required

### `rhus.benefit.surgery` · Surgery

**Rule:** Surgery: in-network 100%; out-of-network 70% after deductible; pre-authorization required.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 4 · section "Hospital charges" · accessed 2026-10-03
  > Surgery 100% 70% after deductible Pre-authorization required

### `rhus.benefit.day_surgery` · Day surgery

**Rule:** Day surgery: in-network 100%; out-of-network 70% after deductible; pre-authorization required.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 4 · section "Hospital charges" · accessed 2026-10-03
  > Day surgery 100% 70% after deductible Pre-authorization required

### `rhus.benefit.oral_surgery` · Oral surgery

**Rule:** Oral surgery: in-network 100%; out-of-network 70% after deductible; pre-authorization required.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 4 · section "Hospital charges" · accessed 2026-10-03
  > Oral surgery 100% 70% after deductible Pre-authorization required
- **Note:** Routine dental care is excluded unless related to a covered medical procedure (p.12). Dental is a separate add-on.

### `rhus.benefit.wisdom_teeth` · Extraction of impacted wisdom teeth

**Rule:** Extraction of impacted wisdom teeth: in-network 100%; out-of-network 70% after deductible; pre-authorization required.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 4 · section "Hospital charges" · accessed 2026-10-03
  > Extraction of impacted wisdom teeth 100% 70% after deductible Pre-authorization required

### `rhus.benefit.endoscopy_non_routine` · Endoscopic tests (non-routine)

**Rule:** Endoscopic tests (non-routine): in-network 100%; out-of-network 70% after deductible; pre-authorization required.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 4 · section "Hospital charges" · accessed 2026-10-03
  > Endoscopic tests (non-routine) 100% 70% after deductible Pre-authorization required

### `rhus.benefit.second_surgical_opinion` · Second surgical opinion

**Rule:** Second surgical opinion: in-network 100%; out-of-network 70% after deductible; no pre-authorization requirement stated.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 4 · section "Hospital charges" · accessed 2026-10-03
  > Second surgical opinion 100% 70% after deductible

### `rhus.benefit.pcp_visit` · Primary care doctor (PCP) visit

**Rule:** Primary care doctor (PCP) visit: in-network 100%; out-of-network 70% after deductible; no pre-authorization requirement stated.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 5 · section "Doctors and specialists" · accessed 2026-10-03
  > Primary care doctor (PCP) visit 100% 70% after deductible

### `rhus.benefit.specialist_visit` · Specialist doctor visit

**Rule:** Specialist doctor visit: in-network 100%; out-of-network 70% after deductible; no pre-authorization requirement stated.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 5 · section "Doctors and specialists" · accessed 2026-10-03
  > Specialist doctor visit 100% 70% after deductible

### `rhus.benefit.walk_in_clinic` · Walk-in clinic

**Rule:** Walk-in clinic: in-network 100%; out-of-network 70% after deductible; no pre-authorization requirement stated.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 5 · section "Doctors and specialists" · accessed 2026-10-03
  > Walk-in clinic 100% 70% after deductible

### `rhus.benefit.private_duty_nursing` · Private duty nursing (outpatient)

**Rule:** Private duty nursing (outpatient): in-network 100%; out-of-network 70% after deductible; limit: 60 visits a year; pre-authorization required.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 5 · section "Doctors and specialists" · accessed 2026-10-03
  > Private duty nursing (outpatient) 100% 70% after deductible 60 visits a year Pre-authorization required

### `rhus.benefit.diagnostic_mri` · MRI

**Rule:** MRI: in-network 100%; out-of-network 70% after deductible; pre-authorization required.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 5 · section "Doctors and specialists" · accessed 2026-10-03
  > Diagnostic testing 100% 70% after deductible (X-ray, MRI, CT, PET scans, labs) Pre-authorization required

### `rhus.benefit.diagnostic_ct` · CT scan

**Rule:** CT scan: in-network 100%; out-of-network 70% after deductible; pre-authorization required.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 5 · section "Doctors and specialists" · accessed 2026-10-03
  > Diagnostic testing 100% 70% after deductible (X-ray, MRI, CT, PET scans, labs) Pre-authorization required

### `rhus.benefit.diagnostic_pet` · PET scan

**Rule:** PET scan: in-network 100%; out-of-network 70% after deductible; pre-authorization required.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 5 · section "Doctors and specialists" · accessed 2026-10-03
  > Diagnostic testing 100% 70% after deductible (X-ray, MRI, CT, PET scans, labs) Pre-authorization required

### `rhus.benefit.diagnostic_xray` · X-ray

**Rule:** X-ray: in-network 100%; out-of-network 70% after deductible; pre-authorization requirement unclear in source (The 'Diagnostic testing' row (X-ray, MRI, CT, PET scans, labs) is marked 'Pre-authorization required', but the pre-authorization list names only 'Diagnostic testing (MRI/PET/CT)'.).

- **Status / confidence:** needs_clarification / medium
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 5 · section "Doctors and specialists" · accessed 2026-10-03
  > Diagnostic testing 100% 70% after deductible (X-ray, MRI, CT, PET scans, labs) Pre-authorization required

### `rhus.benefit.diagnostic_labs` · Lab tests

**Rule:** Lab tests: in-network 100%; out-of-network 70% after deductible; pre-authorization requirement unclear in source (The 'Diagnostic testing' row (X-ray, MRI, CT, PET scans, labs) is marked 'Pre-authorization required', but the pre-authorization list names only 'Diagnostic testing (MRI/PET/CT)'.).

- **Status / confidence:** needs_clarification / medium
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 5 · section "Doctors and specialists" · accessed 2026-10-03
  > Diagnostic testing 100% 70% after deductible (X-ray, MRI, CT, PET scans, labs) Pre-authorization required

### `rhus.benefit.genetic_testing` · Genetic testing

**Rule:** Genetic testing: in-network 100%; out-of-network 70% after deductible; pre-authorization required.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 5 · section "Doctors and specialists" · accessed 2026-10-03
  > Genetic testing 100% 70% after deductible (e.g., BRACA, BART) Pre-authorization required

### `rhus.benefit.allergy_testing` · Allergy testing

**Rule:** Allergy testing: in-network 100%; out-of-network 70% after deductible; limit: 1 testing (based on provider type); no pre-authorization requirement stated.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 5 · section "Doctors and specialists" · accessed 2026-10-03
  > Allergy testing 100% 70% after deductible 1 testing (based on provider type)

### `rhus.benefit.hearing_exam` · Hearing examination

**Rule:** Hearing examination: in-network 100%; out-of-network 70% after deductible; limit: 1 exam; no pre-authorization requirement stated.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 5 · section "Doctors and specialists" · accessed 2026-10-03
  > Hearing examination 100% 70% after deductible 1 exam

### `rhus.benefit.routine_eye_exam` · Routine eye exam

**Rule:** Routine eye exam: in-network 100%; out-of-network 70% after deductible; limit: 1 exam; no pre-authorization requirement stated.

- **Status / confidence:** needs_clarification / medium
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 5 · section "Doctors and specialists" · accessed 2026-10-03
  > Routine eye exam 100% 70% after deductible 1 exam
- **Note:** Conflict: the exclusions say 'Vision exams, glasses, and contacts aren't covered except after eye surgery' (p.15). Possibly reconciled by the vision add-on. Confirm with the SPD.

### `rhus.benefit.preventive_routine` · Preventive care: routine care (birth through adulthood)

**Rule:** Preventive care: routine care (birth through adulthood): in-network 100%; out-of-network 70% after deductible; no pre-authorization requirement stated.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 6 · section "Preventive care" · accessed 2026-10-03
  > Routine care (birth through adulthood) 100% 70% after deductible

### `rhus.benefit.preventive_immunizations` · Immunizations

**Rule:** Immunizations: in-network 100%; out-of-network 70% after deductible; no pre-authorization requirement stated; Vaccines for work or travel aren't covered. Preventive vaccines are (p.13)..

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 6 · section "Preventive care" · accessed 2026-10-03
  > Immunizations 100% 70% after deductible

### `rhus.benefit.preventive_screenings` · Screenings

**Rule:** Screenings: in-network 100%; out-of-network 70% after deductible; no pre-authorization requirement stated.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 6 · section "Preventive care" · accessed 2026-10-03
  > Screenings 100% 70% after deductible

### `rhus.benefit.mental_health` · Mental health (hospitalized, office or virtual visit)

**Rule:** Mental health (hospitalized, office or virtual visit): in-network 100%; out-of-network 70% after deductible; pre-authorization requirement unclear in source (The row reads 'While hospitalized, office or virtual visit' next to 'Pre-authorization required'. The A–T list requires it for inpatient mental-health admissions (A). Whether office or virtual visits need it is unclear.).

- **Status / confidence:** needs_clarification / medium
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 6 · section "Specialty support" · accessed 2026-10-03
  > Mental and substance use disorders 100% 70% after deductible While hospitalized, office or virtual visit Pre-authorization required

### `rhus.benefit.substance_use` · Substance use disorder treatment

**Rule:** Substance use disorder treatment: in-network 100%; out-of-network 70% after deductible; pre-authorization required for part of this benefit (Required for inpatient substance use admissions (A) and outpatient substance use disorder programs (I). Office or virtual visits share the ambiguity of the mental-health row.).

- **Status / confidence:** needs_clarification / medium
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 6 · section "Specialty support" · accessed 2026-10-03
  > Mental and substance use disorders 100% 70% after deductible While hospitalized, office or virtual visit Pre-authorization required

### `rhus.benefit.physical_therapy` · Physical therapy

**Rule:** Physical therapy: in-network 100%; out-of-network 70% after deductible; no pre-authorization requirement stated; Includes virtual visits. Maintenance therapy after maximum improvement is excluded (p.13)..

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 6 · section "Specialty support" · accessed 2026-10-03
  > Physical, speech and occupational therapies 100% 70% after deductible Including virtual visits

### `rhus.benefit.speech_therapy` · Speech therapy

**Rule:** Speech therapy: in-network 100%; out-of-network 70% after deductible; no pre-authorization requirement stated; Includes virtual visits. Therapy for developmental delays is excluded unless part of a diagnosed mental health condition or preventive care (p.12)..

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 6 · section "Specialty support" · accessed 2026-10-03
  > Physical, speech and occupational therapies 100% 70% after deductible Including virtual visits

### `rhus.benefit.occupational_therapy` · Occupational therapy

**Rule:** Occupational therapy: in-network 100%; out-of-network 70% after deductible; no pre-authorization requirement stated; Includes virtual visits..

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 6 · section "Specialty support" · accessed 2026-10-03
  > Physical, speech and occupational therapies 100% 70% after deductible Including virtual visits

### `rhus.benefit.home_health` · Home health care

**Rule:** Home health care: in-network 100%; out-of-network 70% after deductible; pre-authorization required.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 6 · section "Specialty support" · accessed 2026-10-03
  > Home health care 100% 70% after deductible Pre-authorization required

### `rhus.benefit.skilled_nursing` · Skilled nursing facility and rehabilitation

**Rule:** Skilled nursing facility and rehabilitation: in-network 100%; out-of-network 70% after deductible; limit: 120 days per 12-month period; pre-authorization required.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 6 · section "Specialty support" · accessed 2026-10-03
  > Skilled nursing facility and rehabilitation 100% 70% after deductible 120 days per 12 month period Pre-authorization required

### `rhus.benefit.hospice` · Hospice care

**Rule:** Hospice care: in-network 100%; out-of-network 70% after deductible; limit: Lifetime maximum benefit of 180 days; pre-authorization required.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 6 · section "Specialty support" · accessed 2026-10-03
  > Hospice care 100% 70% after deductible Lifetime maximum benefit of 180 days Pre-authorization required

### `rhus.benefit.cardiac_rehab` · Cardiac rehab

**Rule:** Cardiac rehab: in-network 100%; out-of-network 70% after deductible; limit: Single 12-week period, max 36 sessions; no pre-authorization requirement stated; Maintenance-level (Phase III) cardiac rehab is excluded (p.11)..

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 6 · section "Specialty support" · accessed 2026-10-03
  > Cardiac rehab visits 100% 70% after deductible Single 12-week period, max 36 sessions

### `rhus.benefit.pulmonary_therapy` · Pulmonary therapy (outpatient)

**Rule:** Pulmonary therapy (outpatient): in-network 100%; out-of-network 70% after deductible; limit: Single 6-week period, up to 36 visits; no pre-authorization requirement stated; Inpatient pulmonary therapy is covered under hospital charges..

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 7 · section "Specialty support" · accessed 2026-10-03
  > Pulmonary therapy (outpatient) 100% 70% after deductible Inpatient pulmonary therapy covered under Covered for a single 6-week period, up to 36 visits hospital charges

### `rhus.benefit.dialysis` · Dialysis

**Rule:** Dialysis: in-network 100%; out-of-network 70% after deductible; pre-authorization required.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 6 · section "Specialty support" · accessed 2026-10-03
  > Dialysis 100% 70% after deductible Pre-authorization required

### `rhus.benefit.oncology` · Oncology services (chemotherapy, radiation, cancer-related surgery)

**Rule:** Oncology services (chemotherapy, radiation, cancer-related surgery): in-network 100%; out-of-network 70% after deductible; pre-authorization required.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 4 · section "Hospital charges" · accessed 2026-10-03
  > Oncology services 100% 70% after deductible (e.g., chemotherapy, radiation Pre-authorization required therapy, cancer-related surgery)

### `rhus.benefit.injections` · Injections

**Rule:** Injections: in-network 100%; out-of-network 70% after deductible; pre-authorization required for part of this benefit (Required for pain programs (injection therapy for pain programs).).

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 4 · section "Hospital charges" · accessed 2026-10-03
  > Injections 100% 70% after deductible Pre-authorization required for pain programs

### `rhus.benefit.infusion` · Infusion services

**Rule:** Infusion services: in-network 100%; out-of-network 70% after deductible; pre-authorization required.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 7 · section "Specialty support" · accessed 2026-10-03
  > Infusion services 100% 70% after deductible Pre-authorization required

### `rhus.benefit.transplants` · Transplants

**Rule:** Transplants: in-network 100%; out-of-network 70% after deductible; pre-authorization required; Cornea transplants by any provider are covered as a separate benefit and paid the same as any other illness..

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 7 · section "Specialty support" · accessed 2026-10-03
  > Transplants 100% 70% after deductible Cornea transplants performed by any provider are covered under the plan as a separate benefit and Pre-authorization required paid the same as any other illness

### `rhus.benefit.hyperbaric_oxygen` · Hyperbaric oxygen treatments

**Rule:** Hyperbaric oxygen treatments: in-network 100%; out-of-network 70% after deductible; pre-authorization required; The exclusions list hyperbaric therapy as not covered unless for decompression or wound healing (p.11)..

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 7 · section "Specialty support" · accessed 2026-10-03
  > Hyperbaric oxygen treatments 100% 70% after deductible Pre-authorization required

### `rhus.benefit.tmj` · Temporomandibular joint (TMJ) dysfunction

**Rule:** Temporomandibular joint (TMJ) dysfunction: in-network 100%; out-of-network 70% after deductible; limit: Up to $2,000; no pre-authorization requirement stated.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 7 · section "Specialty support" · accessed 2026-10-03
  > Temporomandibular joint dysfunction 100% 70% after deductible Up to $2,000

### `rhus.benefit.dme` · Durable medical equipment

**Rule:** Durable medical equipment: in-network 100%; out-of-network 70% after deductible; pre-authorization required (The pre-authorization list specifies 'over 30-day rental or purchase'. The benefits table says 'Pre-authorization required' without that qualifier.).

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 7 · section "Supplies and equipment" · accessed 2026-10-03
  > Durable medical equipment 100% 70% after deductible Pre-authorization required

### `rhus.benefit.hearing_aids` · Hearing aids and related supplies

**Rule:** Hearing aids and related supplies: in-network 100%; out-of-network 70% after deductible; limit: One hearing aid per ear every 48 months; up to $4,000; no pre-authorization requirement stated.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 7 · section "Supplies and equipment" · accessed 2026-10-03
  > Hearing aids and related supplies 100% 70% after deductible One hearing aid per ear every 48 months Up to $4,000

### `rhus.benefit.prosthetics` · Prosthetics

**Rule:** Prosthetics: in-network 100%; out-of-network 70% after deductible; pre-authorization required.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 7 · section "Supplies and equipment" · accessed 2026-10-03
  > Prosthetics 100% 70% after deductible Pre-authorization required

### `rhus.benefit.diabetic_supplies` · Diabetic education and supplies

**Rule:** Diabetic education and supplies: in-network 100%; out-of-network 70% after deductible; pre-authorization required for part of this benefit (Pre-authorization required for insulin pumps.); Includes preventive and non-preventive education and supplies..

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 7 · section "Supplies and equipment" · accessed 2026-10-03
  > Diabetic education and supplies 100% 70% after deductible Includes preventive and non-preventive Pre-authorization required for insulin pumps education and supplies

### `rhus.benefit.reproductive_underlying_cause` · Reproductive health: testing, diagnosis and treatment of underlying cause

**Rule:** Reproductive health: testing, diagnosis and treatment of underlying cause: in-network 100%; out-of-network 70% after deductible; no pre-authorization requirement stated.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 8 · section "Reproductive health" · accessed 2026-10-03
  > Testing, diagnosis and treatment 100% 70% after deductible of underlying cause

### `rhus.benefit.infertility_treatment` · Infertility treatment and procedures

**Rule:** Infertility treatment and procedures: in-network Not covered; out-of-network Not covered; no pre-authorization requirement stated.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 8 · section "Reproductive health" · accessed 2026-10-03
  > Infertility treatment and procedures Not covered Not covered

### `rhus.benefit.contraceptive_management` · Contraceptive management

**Rule:** Contraceptive management: in-network 100%; out-of-network 70% after deductible; no pre-authorization requirement stated; Deductible waived for preventive (per law). OTC contraceptives not covered..

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 8 · section "Reproductive health" · accessed 2026-10-03
  > Contraceptive management 100% 70% after deductible Deductible waived for preventive (per law). OTC contraceptives not covered

### `rhus.benefit.maternity_preventive_prenatal` · Maternity: preventive prenatal and breastfeeding support

**Rule:** Maternity: preventive prenatal and breastfeeding support: in-network 100%; out-of-network 70% after deductible; no pre-authorization requirement stated.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 8 · section "Maternity care" · accessed 2026-10-03
  > Preventive prenatal 100% 70% after deductible and breastfeeding support

### `rhus.benefit.maternity_lactation` · Maternity: lactation consultations

**Rule:** Maternity: lactation consultations: in-network 100%; out-of-network 70% after deductible; no pre-authorization requirement stated.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 8 · section "Maternity care" · accessed 2026-10-03
  > Lactation consultations 100% 70% after deductible

### `rhus.benefit.maternity_other_care` · Maternity: all other prenatal and postnatal care

**Rule:** Maternity: all other prenatal and postnatal care: in-network 100%; out-of-network 70% after deductible; no pre-authorization requirement stated.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 8 · section "Maternity care" · accessed 2026-10-03
  > All other prenatal and postnatal care 100% 70% after deductible

### `rhus.benefit.maternity_delivery` · Maternity: delivery

**Rule:** Maternity: delivery: in-network 100%; out-of-network 70% after deductible; pre-authorization requirement unclear in source (The delivery row doesn't mention pre-authorization. List item A covers inpatient hospital admissions and C covers stays over 48 hours. The source doesn't say how these apply to delivery admissions.); Home births at home or unlicensed locations aren't covered unless approved as lower cost (p.13)..

- **Status / confidence:** needs_clarification / medium
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 8 · section "Maternity care" · accessed 2026-10-03
  > Delivery 100% 70% after deductible

### `rhus.benefit.acupuncture` · Acupuncture

**Rule:** Acupuncture: in-network 100%; out-of-network 70% after deductible; limit: 20 visits; no pre-authorization requirement stated.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 8 · section "Wellness therapies" · accessed 2026-10-03
  > Acupuncture 100% 70% after deductible 20 visits
- **Note:** The public page says 'up to 20 sessions each of acupuncture and chiropractics'. The period (per year?) is not stated.

### `rhus.benefit.chiropractic` · Chiropractic care / spinal manipulation

**Rule:** Chiropractic care / spinal manipulation: in-network 100%; out-of-network 70% after deductible; limit: 20 visits; no pre-authorization requirement stated.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 8 · section "Wellness therapies" · accessed 2026-10-03
  > Chiropractic care/spinal manipulation 100% 70% after deductible 20 visits

### `rhus.benefit.all_other_eligible` · All other eligible medical expenses

**Rule:** All other eligible medical expenses: in-network 100%; out-of-network 70% after deductible; no pre-authorization requirement stated.

- **Status / confidence:** confirmed / high
- **Source:** Remote Health USA — Benefits overview (RH USA benefits synopsis Full_2025-12-16) · https://safetywing.com/api/policy/113 · page 9 · section "All other eligible medical expenses" · accessed 2026-10-03
  > All other eligible medical expenses In network Out of network 100% 70% after deductible
